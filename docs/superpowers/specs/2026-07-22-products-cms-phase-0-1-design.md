# Products CMS — Phase 0 + 1 Design

**Date:** 2026-07-22
**Status:** Approved (design), pending spec review
**Scope:** Phase 0 (MySQL) + Phase 1 (Products CMS) of the larger site-CMS effort.

## Context

The Metplast site is currently **content-file driven**: every public page is
built from hardcoded `PageConfig` objects in `src/lib/content/*.ts`, rendered
through `ScrollPageTemplate` → `ProductSection`. The admin backend is mostly
scaffolding — the Products page reads the DB but Add/Edit/Delete are dead
buttons, Blogs is a stub, and the site's real products are not in the database
at all (only two dummy seed rows exist).

The client is deploying via **Docker** (full Node runtime + mountable
filesystem) and will connect a **Hostinger managed MySQL** database. They want
the site converted to a database-backed CMS. That full effort was decomposed
into six phases; this spec covers the first two, agreed as the priority:

- **Phase 0** — switch the database to MySQL.
- **Phase 1** — a real Products CMS: per-page product sections, editable in the
  admin, with page assignment, show/hide, and display order; the public pages
  render from the DB; existing content is migrated in so nothing changes
  visually.

Later phases (out of scope here): Gallery CMS, Hero & section content, Blogs
CMS, and the long-tail "every little content" editing.

## Goals

1. Prisma/DB runs on MySQL 8, connectable from the Docker container and later
   from Hostinger managed MySQL via `DATABASE_URL`.
2. Each product **section** on the layer / breeder / broiler /
   environmental-control / feed-silos pages is a database record.
3. Admin can create, edit, delete, reorder, show/hide, and assign a section to a
   page — full self-service including image upload.
4. Public pages render their sections from the DB and look **identical** to
   today after migration.
5. A one-time, idempotent migration ports all current hardcoded sections into
   the DB.

## Non-goals (explicit)

- Hero images/headings, page intro copy, `crossLinks`, and page-level
  `pageBlocks` remain in code (Phase 3).
- The `/products` overview grid (8 category cards) and the Gallery remain in code
  (Phase 2/3).
- No changes to the bespoke block components' internals; only which blocks
  attach to a section and where.
- Blogs, enquiries, settings, chatbot admin unchanged in this phase.

## Key decisions

| Decision | Choice | Why |
|---|---|---|
| DB engine | MySQL 8 | Hostinger managed MySQL; needs 8 for native JSON. |
| Section storage | One `ProductSection` table, JSON columns for list fields | List fields are always rendered whole/in-order, never queried inside. 1:1 with `ProductSectionProps`. Avoids 5-table normalization for no benefit. |
| Bespoke blocks | Attach/detach via fixed-vocabulary multiselect stored as JSON keys | Gives control over which blocks show + placement without editing block internals. `BlockRenderer` already dispatches. |
| Phase-1 seam | DB owns `PageConfig.sections`; hero/intro/crossLinks/pageBlocks stay in code | Clean boundary, defers Phase 3, nothing lost. |
| Images | Basic upload endpoint → mounted volume `./public/uploads` | Docker volume persists files; `next start` serves `/public`. Full gallery manager is Phase 2. |

## Data model

```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model ProductSection {
  id             String   @id @default(cuid())
  page           String   // "layer" | "breeder" | "broiler" | "environmental-control" | "feed-silos"
  slug           String   @unique // section id, e.g. "h-type-layer"
  title          String
  badge          String?
  tag            String?
  calculatorHref String?
  descriptions   Json     // string[]
  features       Json     // string[]
  benefits       Json     // string[]
  specs          Json     // { label: string, value: string }[]
  images         Json     // string[]  (paths like /uploads/foo.jpg or /images/foo.jpg)
  infoBlocks     Json     // { id?: string, heading: string, lines: string[] }[] rendered above the grid
  topBlockKeys   Json     // string[]  self-contained block type keys rendered above the grid
  bottomBlockKeys Json    // string[]  self-contained block type keys rendered below the grid
  visible        Boolean  @default(true)
  sortOrder      Int      @default(0)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@index([page, visible, sortOrder])
}
```

`String` columns holding long text (descriptions are JSON, fine) use MySQL
defaults; `title`/`badge` are short. JSON columns require MySQL 8. Existing
models (`User`, `Product`, `Enquiry`, `Setting`, `Blog`) are unchanged except the
datasource provider. (The legacy `Product` model is left in place, unused by the
public site; it is not the Phase-1 model. It can be removed in a later cleanup.)

### Block vocabulary

Two kinds of block:

- **Self-contained blocks** (baked-in copy): `feeder-materials`, `auto-flush`,
  `customization`, `upgrade-path`, `feeding-trolley`, `lighting`. These carry no
  per-section data, so the admin attaches/detaches them by key via a multiselect
  stored in `topBlockKeys` / `bottomBlockKeys`.
- **Info blocks** (`info` type, per-section inline text — e.g. the layer/breeder
  box-dimension notes): these are editable **content**, so they are stored in the
  `infoBlocks` JSON field (heading + lines) and edited via a repeatable-row
  editor in the form, not the attach multiselect. They render in the top-blocks
  area above the grid.

At render time the top blocks are assembled as: `infoBlocks` (mapped to `info`
block props) followed by `topBlockKeys` (mapped to self-contained blocks).

## Architecture & components

### Row ↔ props mapper
`src/lib/content/section-mapper.ts` — pure functions:
- `rowToSectionProps(row): ProductSectionProps` — parses JSON; maps column
  `descriptions` → props `description`; assembles `topBlocks` = `infoBlocks`
  (as `info` block props) + `topBlockKeys` (as self-contained blocks), and
  `bottomBlocks` from `bottomBlockKeys`.
- `sectionPropsToRow(input)` — inverse, for create/update.
Single, isolated, unit-testable unit. No DB or React imports.

### Public rendering
Each page component (`src/app/(frontend)/layer/page.tsx`, etc.) becomes a server
component that:
1. reads the code config (hero/intro/crossLinks/pageBlocks) from `src/lib/content/*.ts`,
2. queries `prisma.productSection.findMany({ where: { page, visible: true }, orderBy: { sortOrder: 'asc' } })`,
3. maps rows → `ProductSectionProps`, sets `config.sections`,
4. renders `<ScrollPageTemplate config={config} />`.

`ScrollPageTemplate` and `ProductSection` are unchanged (still client
components). The code config files keep everything **except** `sections`, which
now comes from the DB.

### Admin CRUD (`/admin/(dashboard)/products`)
- **List:** sections grouped by page; columns title / visible / order; actions
  edit, delete, move up/down. Server component reads DB; row actions call APIs.
- **Form** (`/admin/products/new`, `/admin/products/[id]`): client component with
  all fields; repeatable-row editors for descriptions / features / benefits /
  specs / info-blocks (heading + lines); multi-image upload with previews; page
  `<select>`; self-contained-block multiselect (top/bottom); visible toggle;
  sortOrder.
- **APIs** (all `getServerSession`-gated, return 401 otherwise):
  - `GET /api/admin/products` — list.
  - `POST /api/admin/products` — create.
  - `PUT /api/admin/products/[id]` — update.
  - `DELETE /api/admin/products/[id]` — delete.
  - `POST /api/admin/upload` — multipart image upload.

### Image upload
`POST /api/admin/upload`: session-gated; validates content-type
(jpeg/png/webp/avif) and size (≤ 5 MB); writes to `process.env.UPLOAD_DIR ||
'./public/uploads'` with a randomized filename; returns `{ path: '/uploads/<file>' }`.
Docker must mount a volume at `/app/public/uploads` to persist across
redeploys. Documented in `docs/SECURITY.md` / deployment notes.

## Migration

`scripts/migrate-content.ts` (run via `tsx`, added as `npm run db:migrate-content`):
- Imports the section arrays from `src/lib/content/{layer,breeder,broiler,environmental-control,feed-silos}.ts`.
- For each section, upsert by `slug`: set page, all fields, `sortOrder` = array
  index. Split the section's existing `topBlocks`: `info`-type blocks → the
  `infoBlocks` field (with their heading/lines content); all other block `type`
  values → `topBlockKeys`. `bottomBlocks` `type` values → `bottomBlockKeys`.
- Idempotent: re-running updates in place, never duplicates.

After migration succeeds and pages are switched to DB reads, the `sections`
arrays in the code config files are removed (or left dormant); the rest of each
config object stays.

## Error handling

- Public page query failure → render the page with an empty sections list rather
  than 500 (hero/intro still show); log the error. (A page with no sections is
  degraded but not broken.)
- Admin APIs: 401 unauthenticated; 400 on invalid payload (missing
  `page`/`title`/`slug`, malformed JSON arrays); 409 on duplicate slug; 500
  logged with a safe message.
- Upload: 401 / 415 (bad type) / 413 (too large) / 500.

## Verification (no test suite in repo)

1. Local MySQL 8 via Docker; set `DATABASE_URL`.
2. `prisma db push` creates the schema.
3. `npm run db:migrate-content` ports existing sections.
4. `npm run build` + `npx tsc --noEmit` pass.
5. Manually diff layer/breeder/broiler pages (DB-rendered) against the current
   live output — must match.
6. Admin round-trip: create a section, upload an image, reorder, hide, confirm it
   reflects on the public page.
7. Optional lightweight unit test for `section-mapper` (row↔props) if a runner is
   added; otherwise a scripted assertion in the migration dry-run.
8. Banned-term grep still clean (no-overclaim rule) after migration.

## Rollout

- Phase 0 and Phase 1 ship together (Phase 1 needs the DB).
- Cutover order: deploy schema → run migration → deploy code that reads sections
  from DB. Until migration runs, keep code configs as the source so the site
  never goes blank.

## Risks / open items

- **MySQL 8 requirement** for JSON — confirm Hostinger managed MySQL is 8.x.
- **Volume mount** for `/public/uploads` must be configured in the Docker/compose
  setup or uploaded images vanish on redeploy.
- Legacy `Product` model/table remains; harmless but should be cleaned up later
  to avoid confusion with `ProductSection`.
- Content edited in the CMS must still honor the no-overclaim content rules;
  those are human-enforced (no automated gate).
