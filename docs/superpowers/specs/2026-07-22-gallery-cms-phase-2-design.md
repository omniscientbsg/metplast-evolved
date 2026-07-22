# Gallery CMS — Phase 2 Design

**Date:** 2026-07-22
**Status:** Approved (design), pending spec review
**Scope:** Phase 2 (Gallery CMS) of the site-CMS effort. Builds on Phase 0+1 (MySQL, upload endpoint, admin patterns).

## Context

The gallery page (`src/app/(frontend)/gallery/page.tsx`) is a client component with a hardcoded `GALLERY_ITEMS` array (9 items: `src`, `caption`, `category`, optional YouTube `video`; one item rendered as a full-width featured tile) and a hardcoded `FILTERS` category list, plus a lightbox. Nothing is editable.

Phase 2 makes the gallery database-driven and editable in the admin: upload/manage images, assign a **managed category** (a filter list the admin can add to / rename / reorder / delete), set caption, optional video, a featured (full-width) flag, visibility, and order. The public page renders from the DB and looks identical after a one-time migration.

## Goals

1. Gallery images and their categories are database records, fully editable in the admin.
2. Categories are a managed list (add / rename / reorder / delete), assigned to items via a dropdown.
3. Admin can upload images, set caption / category / video / featured / visible / order, reorder, and delete.
4. The public gallery renders from the DB (with a code fallback) and looks identical to today after migration; the filter bar shows "All" + categories that have ≥1 visible item, in category order.

## Non-goals (explicit)

- Hero/intro/crossLinks, blogs, and other page content remain out of scope (later phases).
- No image transforms/thumbnails pipeline — uploaded images are served as-is (as in Phase 1).
- No multi-category per item — each item has at most one category.
- Reordering categories/items is manual (up/down), not drag-and-drop.

## Key decisions

| Decision | Choice | Why |
|---|---|---|
| Categories | Own `GalleryCategory` table, managed inline on the Gallery admin page | User wants a fixed dropdown that they can add filters to; a table gives add/rename/reorder/delete + a stable filter order. |
| Item→category link | FK `categoryId` (nullable), `onDelete: SetNull` | Deleting a category leaves its images intact as "Uncategorized" rather than deleting them; images just drop off the filter bar. |
| Featured tile | `featured` boolean on `GalleryItem` | Reproduces today's full-width tile (the factory video) editably. |
| Video | `videoUrl` string (nullable) | Preserves the YouTube-embed lightbox items. |
| Public component | Server page fetches → passes to client `GalleryClient` | The interactive UI (filter/lightbox) stays a client component; data loads server-side, matching the Phase 1 page pattern. |
| Categories admin location | Inline section on the Gallery admin page (no separate nav item) | Keeps admin nav simple; category management is small. |

## Data model

```prisma
model GalleryCategory {
  id        String        @id @default(cuid())
  name      String        @unique
  sortOrder Int           @default(0)
  createdAt DateTime      @default(now())
  updatedAt DateTime      @updatedAt
  items     GalleryItem[]

  @@index([sortOrder])
}

model GalleryItem {
  id         String           @id @default(cuid())
  src        String
  caption    String           @db.Text
  videoUrl   String?
  featured   Boolean          @default(false)
  visible    Boolean          @default(true)
  sortOrder  Int              @default(0)
  categoryId String?
  category   GalleryCategory? @relation(fields: [categoryId], references: [id], onDelete: SetNull)
  createdAt  DateTime         @default(now())
  updatedAt  DateTime         @updatedAt

  @@index([visible, sortOrder])
  @@index([categoryId])
}
```

`caption` is `@db.Text` (MySQL) since captions can be a sentence or two. Existing models (incl. `ProductSection`) are unchanged.

## Architecture & components

### Public rendering
- `src/app/(frontend)/gallery/page.tsx` → server component (`export const dynamic = 'force-dynamic'`): fetches `GalleryCategory` (ordered) + `GalleryItem` (visible, ordered) with the category name joined, maps rows to a plain `GalleryView` shape, and renders `<GalleryClient items={...} categories={...} />`. On empty/error, falls back to the current hardcoded arrays (kept in a `gallery-fallback.ts`) so the page is never blank.
- `src/app/(frontend)/gallery/GalleryClient.tsx` → the existing client UI (hero, filter bar, grid, lightbox), refactored to take `items` + `categories` as props instead of the module-level constants. Filter bar = `['All', ...categories.filter(c => items have a visible item in c)]`. Featured items use the full-width tile styling (replacing today's `id === 7` special-case).

### Admin (`/admin/(dashboard)/gallery`)
- **Nav:** add a "Gallery" link to `src/app/admin/(dashboard)/layout.tsx`.
- **Page** (`gallery/page.tsx`, server): renders a `CategoryManager` (client) at top and the items list below (items grouped/ordered), each row with reorder (↑↓), edit, delete via a `GalleryRowActions` client component.
- **CategoryManager** (client): list categories with rename (inline), reorder, delete; an "Add category" input. Calls the category APIs and `router.refresh()`.
- **Item form** (`gallery/new/page.tsx`, `gallery/[id]/page.tsx` → shared `GalleryForm` client): image upload (via `/api/admin/upload`), caption, category `<select>` (options from `GalleryCategory`, fetched server-side and passed in), optional video URL, `featured` toggle, `visible` toggle, order. Submits to the item APIs.

### APIs (all session-gated, 401 otherwise; mirror the Phase 1 products pattern)
- `GET/POST /api/admin/gallery` — list / create item.
- `PUT/DELETE /api/admin/gallery/[id]` — update / delete item.
- `POST /api/admin/gallery/reorder` — swap item `sortOrder` with the global adjacent item (the gallery is one ordered list, not page-grouped like products), append-on-create.
- `GET/POST /api/admin/gallery/categories` — list / create category.
- `PUT/DELETE /api/admin/gallery/categories/[id]` — rename / delete category.
- `POST /api/admin/gallery/categories/reorder` — swap category `sortOrder`.

Create appends to the end (max `sortOrder` + 1) so new rows never tie — same fix applied to products. Category `name` is unique → duplicate create returns 409. Item create requires `src`; category is optional.

## Migration

`scripts/migrate-gallery.ts` (`npm run db:migrate-gallery`, idempotent):
1. Upsert the 5 categories by `name` (which IS unique) in filter order: `Metplast Housing`, `Layer Cage Systems`, `Breeder Cage Systems`, `Feed Silos`, `Factory / Manufacturing` (matching today's `FILTERS`, minus "All").
2. For each of the 9 current gallery items, idempotently write by `src`: `findFirst({ where: { src } })` → `update` if found else `create`. (`src` is NOT a DB unique — the admin may legitimately reuse an image path across items — so the script does a manual find-then-write rather than `prisma.upsert`.) Set caption, link to the category by name (`connect` via the category's id), `videoUrl` for the factory item, `featured: true` for the factory item (today's full-width tile), `sortOrder` = original array index, `visible: true`.
Re-running updates the matched rows in place; the fixed set of 9 known `src` values never duplicates.

The current hardcoded arrays are copied into `src/app/(frontend)/gallery/gallery-fallback.ts` as the fallback source; the page reads DB first, falls back to these until migration runs.

## Error handling

- Public page: DB failure → fall back to the hardcoded arrays; log the error. Never 500.
- Admin APIs: 401 unauthenticated; 400 on missing required fields (`src` for items, `name` for categories); 409 on duplicate category name; 404 on delete/update of a missing id; 500 logged with a safe message.
- Upload: reuses the existing endpoint's validation (type/size, 401).

## Verification (no full test suite; matches project norm)

1. MySQL 8 up (already running locally). `prisma db push` creates the two tables.
2. `npm run db:migrate-gallery` seeds 5 categories + 9 items.
3. `npm run build` + `npx tsc --noEmit` pass; `/gallery` and `/admin/gallery*` compile (`ƒ`).
4. Manually diff `/gallery` (DB-rendered) against current output — filters, grid, featured tile, video lightbox must match.
5. Admin round-trip: add a category, upload an image into it, mark featured, reorder, hide, delete a category (items become Uncategorized) — confirm each reflects on `/gallery`.
6. Unit test (vitest) for the row→view mapper if one is added; otherwise scripted assertion in the migration.
7. Banned-term grep still clean.

## Risks / open items

- `onDelete: SetNull` requires the FK to be nullable (it is). Prisma `db push` will create the FK constraint on MySQL 8 (InnoDB) — confirm no engine issues.
- Uploaded gallery images live under the same `/public/uploads` volume as product images — the persistent-volume requirement already documented in `docs/SECURITY.md` covers this.
- The migration matches by `src` via `findFirst` (not a DB unique). Re-running the migration is safe for the fixed 9 seed items; it is a one-time content import, not a general sync, so it does not need to handle admin-created rows.
