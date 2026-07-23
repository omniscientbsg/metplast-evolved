# Page Content CMS (Hero / Intro / CrossLinks) — Phase 3 Design

**Date:** 2026-07-23
**Status:** Approved (design), pending spec review
**Scope:** Phase 3 of the site-CMS effort. Makes the **hero**, **intro paragraphs**, and **crossLink cards** of the site's main pages editable in the admin. Builds on the Phase 1 fetch-with-code-fallback seam (`ProductSection`) and the Phase 2/4 admin patterns.

## Context

The five product pages (`layer`, `breeder`, `broiler`, `environmental-control`, `feed-silos`) render through `ScrollPageTemplate` from a `PageConfig` object:

```ts
interface PageConfig {
  hero: { title; subtitle; image; ctaPrimary{label,href}; ctaSecondary?{label,href} };
  intro: string[];
  sections: ProductSectionProps[];   // ← already DB-backed (Phase 1)
  pageBlocks?: PageBlock[];           // bespoke keyed blocks — stay in code
  crossLinks: CrossLink[];           // { title, desc, href, color }
}
```

Phase 1 moved `sections` into the DB; **hero / intro / crossLinks still live in the code config files** (`src/lib/content/layer.ts`, etc.) and are merged in each page as `{ ...config, sections }`.

Three more pages — **homepage** (`(frontend)/page.tsx`), **about**, **housing** — are bespoke client components with hardcoded heroes (not `ScrollPageTemplate`). Their heroes use a **different shape**: an **eyebrow badge** ("About Metplast"), a title where part is **gradient-accented** (`COMPLETE POULTRY HOUSING <span class="text-gradient">SYSTEMS.</span>`), a subtitle, and optional CTAs.

Phase 3 makes hero/intro/crossLinks database-driven and editable across **all 8 pages**, with a code fallback so nothing is ever blank.

## Goals

1. One `PageContent` DB row per page (fixed set of 8) holding an editable hero, intro paragraphs, and crossLink cards.
2. A hero shape that is a **superset** of the two existing hero styles, so both product and bespoke pages render from the same record.
3. Admin can edit each page's hero (eyebrow, title, accent, subtitle, image, up to 2 CTAs), its intro paragraph list, and its crossLink cards — with intro/crossLinks shown only where the page renders them.
4. Every page renders from the DB with a **code fallback** (identical to today after migration); never 500, never blank.

## Non-goals (explicit — deferred to Phase 5)

- Homepage stat blocks, housing farm-types/steps, about values grid and story-beyond-intro, footer text, and nav labels — the "every little content" long tail.
- Product `pageBlocks` (bespoke keyed blocks like `customization`) remain in code — they are structural, not editable copy.
- No add/delete of pages — the page set is fixed (8 known keys). No per-page SEO metadata editing (page `metadata` stays in code this phase).
- No rich text in hero/intro (plain strings); crossLink `color` is a plain hex string.

## Key decisions

| Decision | Choice | Why |
|---|---|---|
| Storage | One `PageContent` table, one row per page, unique `page` key | A page's hero+intro+crossLinks change together and belong together; a fixed-key row per page is simple and matches "8 known pages". |
| Hero shape | A **superset**: `heroEyebrow?`, `heroTitle`, `heroTitleAccent?`, `heroSubtitle`, `heroImage?`, `heroCtaPrimary?`, `heroCtaSecondary?` | Covers both styles: product pages use title/subtitle/image/CTAs (eyebrow+accent blank, title keeps word-split animation); bespoke pages use eyebrow + title + accent + subtitle + CTAs. Each page renders only the sub-fields it uses. |
| Title accent | Separate `heroTitleAccent` field (not an in-string marker) | Cleaner to edit; mirrors the existing `lead <span text-gradient>accent</span>` markup. |
| intro / crossLinks scope | Per-page capability map `PAGE_DEFS` (`hasIntro`, `hasCrossLinks`) | intro renders on the 5 product pages + about; crossLinks only on the 5 product pages. The admin form and frontend honor the map; unused fields stay empty. |
| Product page wiring | Extend the existing page's fetch to also load `PageContent`, merge hero/intro/crossLinks into `PageConfig` (fallback to the code config) | Reuses the Phase 1 seam; `ScrollPageTemplate` is unchanged. |
| Bespoke page wiring | Split each into a server `page.tsx` (fetch) + a client component taking hero/intro props (fallback constants) | Same server→client split as gallery/blog; the animated client body is preserved, only its text/image become props. |
| Persistence API | `GET/PUT /api/admin/pages/[page]` (PUT upserts) | No create/delete; each of the 8 rows is edited in place. Unknown `page` key → 404. |
| Fallback source | `src/lib/content/page-content.ts` holds `PAGE_FALLBACK` for all 8 pages | Single source of fallback truth; the migration seeds from it and the frontend falls back to it. Product-page entries reuse the existing config objects to avoid duplication. |

## Data model

```prisma
model PageContent {
  id               String   @id @default(cuid())
  page             String   @unique  // 'home' | 'about' | 'housing' | 'layer' | 'breeder' | 'broiler' | 'environmental-control' | 'feed-silos'
  heroEyebrow      String?
  heroTitle        String
  heroTitleAccent  String?
  heroSubtitle     String   @db.Text
  heroImage        String?
  heroCtaPrimary   Json?             // { label: string, href: string } | null
  heroCtaSecondary Json?             // { label: string, href: string } | null
  intro            Json              // string[]  (empty [] where unused)
  crossLinks       Json              // { title, desc, href, color }[]  (empty [] where unused)
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
}
```

MySQL 8 JSON columns (already in use for `ProductSection`/gallery). `heroSubtitle` is `@db.Text` (can be a couple of sentences). All existing models unchanged.

## Capability map

`src/lib/content/page-content.ts` exports:

```ts
interface PageDef { page: string; label: string; hasIntro: boolean; hasCrossLinks: boolean; }
const PAGE_DEFS: PageDef[] = [
  { page: 'home',                  label: 'Home',                  hasIntro: false, hasCrossLinks: false },
  { page: 'about',                 label: 'About',                 hasIntro: true,  hasCrossLinks: false },
  { page: 'housing',               label: 'Metplast Housing',      hasIntro: false, hasCrossLinks: false },
  { page: 'layer',                 label: 'Layer',                 hasIntro: true,  hasCrossLinks: true  },
  { page: 'breeder',               label: 'Breeder',               hasIntro: true,  hasCrossLinks: true  },
  { page: 'broiler',               label: 'Broiler',               hasIntro: true,  hasCrossLinks: true  },
  { page: 'environmental-control', label: 'Environmental Control', hasIntro: true,  hasCrossLinks: true  },
  { page: 'feed-silos',            label: 'Feed Silos',            hasIntro: true,  hasCrossLinks: true  },
];
```

Hero fields are editable on every page (each page renders only what it uses). `hasIntro`/`hasCrossLinks` gate the intro and crossLinks editors in the admin form and the corresponding render on the frontend.

## Architecture & components

### Shared lib (`src/lib/content/page-content.ts`)
- `PageContentView` (flat, typed: `eyebrow`, `title`, `titleAccent`, `subtitle`, `image`, `ctaPrimary`, `ctaSecondary`, `intro: string[]`, `crossLinks: CrossLink[]`) + `HeroCta` type.
- `rowToPageContent(row)` / `pageContentToRow(view)` — pure mappers casting the Json columns (CTAs, intro, crossLinks) to/from typed shapes. Vitest-covered.
- `PAGE_DEFS` + `PAGE_FALLBACK: Record<string, PageContentView>` (all 8 pages' current values; product entries reuse `layerConfig` etc.).
- `getPageDef(page)` helper; the known-page set is derived from `PAGE_DEFS`.

### Frontend rendering
- **Product pages (5):** each `page.tsx` (already a server component fetching sections) also fetches its `PageContent` row, maps to `PageContentView`, and builds `config = { ...codeConfig, hero, intro, crossLinks, sections }` — every DB field falls back to the code config on empty/error. `ScrollPageTemplate` is unchanged.
- **Bespoke pages (3):** split `page.tsx` into a **server** component that fetches the `PageContent` row (fallback to `PAGE_FALLBACK`) and renders a **client** component (`HomeClient` / `AboutClient` / `HousingClient` — the current body, refactored to take a `hero` prop, plus `intro` for about). The hardcoded hero markup reads from props; the gradient accent renders `titleAccent`. All animation/layout preserved.

### Admin (`/admin/(dashboard)/pages`)
- **Nav:** add a "Pages" link to the admin layout (after Products, before Enquiries — or adjacent to content items).
- **List** (`pages/page.tsx`, server): renders the 8 `PAGE_DEFS` rows (label + "Edit"), linking to `pages/[page]`.
- **Edit** (`pages/[page]/page.tsx`, server): validates `page` against `PAGE_DEFS` (else `notFound()`); fetches the row (or `PAGE_FALLBACK`); passes the view + the `PageDef` into `PageContentForm`.
- **`PageContentForm`** (client): hero fields (eyebrow, title, title-accent, subtitle, image upload via `/api/admin/upload`, primary/secondary CTA label+href); an **intro editor** (add/remove/reorder plain-text paragraphs) shown when `hasIntro`; a **crossLinks editor** (list of cards: title, desc, href, color; add/remove/reorder) shown when `hasCrossLinks`. Submits `PUT /api/admin/pages/[page]`.

### APIs (session-gated, 401 otherwise)
- `GET /api/admin/pages/[page]` — the row (or 404 if `page` unknown).
- `PUT /api/admin/pages/[page]` — **upsert** the row for a known `page` (create on first save, update thereafter). Validates `page` ∈ `PAGE_DEFS`; coerces `intro`/`crossLinks` to arrays and CTAs to `{label,href}|null`. Unknown page → 404; malformed body → 400.

No reorder/list/delete endpoints (fixed page set; intro/crossLink ordering is handled inside the form's JSON payload).

## Migration

`scripts/migrate-pages.ts` (`npm run db:migrate-pages`, idempotent): for each of the 8 `PAGE_DEFS`, upsert (`where: { page }`) the row from `PAGE_FALLBACK[page]` via `pageContentToRow`. Re-running overwrites the 8 known rows in place. First-deploy one-time content import (documented in `docs/SECURITY.md` alongside the existing migrate steps).

## Error handling / fallback

- Frontend: any DB miss/error → use `PAGE_FALLBACK` (bespoke) or the code config (product). Never 500, never blank.
- Admin edit page: unknown `page` → `notFound()`; the row is read with a `PAGE_FALLBACK` default so the form is pre-filled even before the first migration.
- API: 401 unauthenticated; 404 unknown page; 400 malformed; 500 logged with a safe message.
- Upload: reuses the existing endpoint (MIME allowlist, 5 MB, 401).

## Verification (project norm — no full test suite)

1. `prisma db push` creates `PageContent` (stop any local `next dev` — Windows Prisma DLL lock).
2. `npm run test` — vitest for `rowToPageContent`/`pageContentToRow` (Json casting, null CTAs, empty arrays) passes.
3. `npm run db:migrate-pages` seeds all 8 rows.
4. `npx tsc --noEmit` + `npm run build` pass; all 8 pages + `/admin/pages*` compile.
5. Manual diff each page (DB-rendered) vs current: hero (eyebrow/title/accent/subtitle/image/CTAs), intro, crossLinks must match after migration.
6. Admin round-trip: edit a product page's hero title + add an intro paragraph + reorder a crossLink → reflects on the page; edit the homepage hero → reflects; confirm intro/crossLinks editors are hidden on `home`/`housing`.
7. Banned-term grep clean (hero/intro/crossLink copy is CMS-editable and NOT auto-checked — reviewers must keep honoring the no-overclaim rules; note in `docs/SECURITY.md`).

## Risks / open items

- **Bespoke page splits** are the riskiest part: extracting the current homepage/about/housing hero markup into a props-driven client component without changing the animation/layout. Each must be diffed against the live page. The word-split animation on product-page titles and the scroll/blur on the homepage hero must be preserved.
- The gradient accent is represented as a second field; a page with no accent simply omits the `<span>`. Product-page titles keep word-split animation and leave `titleAccent` empty.
- JSON columns need `Prisma.InputJsonValue` casts for typed arrays (same pattern as `ProductSection` — the plan will apply the cast to pass `next build`).
- CMS-edited hero/intro/crossLink copy bypasses the no-overclaim grep gate (no automated check on admin writes) — documented as a reviewer responsibility, consistent with products/gallery/blogs.
