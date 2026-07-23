# Homepage Content CMS — Phase 5 (sub-project 3) Design

**Date:** 2026-07-24
**Status:** Approved (design), pending spec review
**Scope:** Sub-project 3 of Phase 5. Makes all structured homepage content below the hero — plus the hero stats block — editable in the admin. The hero heading/subtitle/eyebrow/background-image/CTAs are already editable (Phase 3, `/admin/pages` → Home) and stay there.

## Context

`src/app/(frontend)/HomeClient.tsx` (a `"use client"` component rendered by the server `page.tsx`, which already passes a `hero` prop from Phase 3) contains a large amount of hardcoded structured content: the hero **stats grid**, three **feature cards**, a **positioning** block, four **solution cards**, a **product-overview** block (eyebrow/heading + 8 tiles), a **calculator** section (heading + 5 cards), a three-card **teaser row** (Env-Control / Gallery / Brochures), a `<CommunitySection/>`, and a **final CTA**. All of it is hardcoded.

This sub-project moves the editable copy/images/links/cards into a single `home_content` record, consumed by `HomeClient` via a new `content` prop, with the current values as the code fallback (byte-identical until edited). Icons, decorative index numbers, the brochure-download action, section layout, and animation stay in code (structural).

## Goals

1. All structured homepage text, images, links, and card lists are editable in a dedicated `/admin/home` form.
2. The hero stats grid becomes editable (the last hero piece Phase 3 left).
3. The homepage renders from the DB with a deep-merge fallback to the current values — never blank, never partially blank.
4. The hero heading/subtitle/image/CTAs remain owned by Phase 3 (`PageContent`) — not duplicated.

## Non-goals

- Icons per card slot, decorative index numbers ("01/02/03"), the brochure-download event action, and all section layout/animation stay in code.
- `CommunitySection` internal content: **in scope** only for its top-level text if it has any editable copy; if it is itself composed of sub-data, its deep content is deferred (confirmed during planning by reading the component). Treated as a small optional add.
- Hero heading/subtitle/eyebrow/image/CTAs (Phase 3), and the Navbar/Footer (sub-projects 1-2).

## Key decisions

| Decision | Choice | Why |
|---|---|---|
| Storage | One `home_content` JSON row in the `Setting` table | The content is deeply structured (5 card arrays + nested text) — one JSON blob is cleaner than ~20 scattered keys and is edited by a dedicated form, not the scalar settings form. |
| Parsing / fallback | `parseHomeContent(value)` — JSON.parse then **deep-merge each field over `DEFAULT_HOME_CONTENT`** | Partial or malformed JSON (or a missing section) can never blank a section; each field falls back independently. |
| Consumption | `HomeClient` gains a `content: HomeContent` prop (server `page.tsx` fetches it, as it already does for `hero`) | Mirrors the Phase 3 hero split; no client fetch. |
| What stays in code | Icons (per slot), index numbers, brochure action, layout, animation | Not "content"; an icon-picker is unjustified (YAGNI). |
| Admin | Dedicated `/admin/home` page + `HomeContentForm` with reusable card-list editors | The scalar settings form can't express nested card arrays. |
| API | `PUT /api/admin/home` (session-gated) writes the `home_content` key as JSON | Dedicated route; `GET` not needed (page reads server-side). |

## Data shape

New pure module `src/lib/content/home-content.ts`:

```ts
export interface StatTile { top: string; bottom: string }             // bottom '' for the text-only tiles
export interface FeatureCard { title: string; body: string }          // icon fixed by index (Bird/Award/Handshake)
export interface SolutionCard { title: string; desc: string; image: string; href: string }
export interface OverviewTile { name: string; href: string }
export interface CalcCard { title: string; image: string; href: string }
export interface Teaser { title: string; desc: string; ctaLabel: string } // icon + href/action fixed by index

export interface HomeContent {
  heroStats: StatTile[];
  featureCards: FeatureCard[];
  positioning: { heading: string; accent: string; body: string };
  solutionCards: SolutionCard[];
  overview: { eyebrow: string; heading: string; tiles: OverviewTile[] };
  calculators: { heading: string; accent: string; body: string; cards: CalcCard[] };
  teasers: Teaser[];
  cta: { heading: string; body: string; buttonLabel: string; href: string };
}

export const DEFAULT_HOME_CONTENT: HomeContent = { /* exact current values extracted from HomeClient */ };
export function parseHomeContent(value: string | null | undefined): HomeContent;  // JSON.parse + deep-merge over defaults
```

`DEFAULT_HOME_CONTENT` holds the current homepage copy/images/links verbatim (client's own content — moved, not rewritten; no-overclaim preserved). `parseHomeContent` merges each top-level field (and, for objects like `positioning`/`overview`/`calculators`/`cta`, each sub-field) over the default; arrays are taken whole from the parsed value when present and valid, else the default array. Vitest covers: empty/null → defaults; a partial object (only `cta.heading`) → that field overridden, everything else default; malformed JSON → all defaults; an array field present → used.

## Architecture

- **`get-home-content.ts`** (server): `getHomeContent()` → read the `home_content` Setting row, `parseHomeContent(row?.value)`; try/catch → defaults. Never throws.
- **`(frontend)/page.tsx`** (already a server component fetching `hero`): also `getHomeContent()`; pass `<HomeClient hero={hero} content={content} />`.
- **`HomeClient.tsx`**: add `content: HomeContent` to props; render:
  - hero stats grid from `content.heroStats` (keep the grid/tile markup + the accent-colored `+` styling; a `StatTile` renders `top` big and `bottom` small — text-only tiles have empty `bottom`).
  - feature cards: `content.featureCards.map` with the icon chosen by index from a fixed `[Bird, Award, Handshake]` array; keep the number/markup.
  - positioning: `content.positioning.heading` + gradient `accent` + `body`.
  - solution cards: `content.solutionCards.map` (title/desc/image/href).
  - overview: eyebrow/heading + `content.overview.tiles.map`.
  - calculators: heading/accent/body + `content.calculators.cards.map`.
  - teasers: `content.teasers.map` with icon + href/action fixed by index (`[/environmental-control link, /gallery link, brochure-download button]`).
  - cta: heading/body/buttonLabel/href.
  - Keep every className, motion wrapper, decorative element, and `CommunitySection` unchanged.
- **Admin:** `/admin/(dashboard)/home/page.tsx` (server: read `home_content`, `parseHomeContent`, pass to form) + `HomeContentForm` (client) with text inputs + reusable list editors (a generic `CardListEditor` for each array, or per-array editors) that upload images via `/api/admin/upload`. New "Home" nav link in the admin layout. Submits the whole `HomeContent` as JSON to `PUT /api/admin/home`.
- **API:** `PUT /api/admin/home` — session-gated; body = a `HomeContent` object; `parseHomeContent(JSON.stringify(body))` (normalize/merge) then `prisma.setting.upsert({ where:{ key:'home_content' }, ... value: JSON.stringify(normalized) })`; 401/400/500.

## Error handling / fallback

- `getHomeContent()` / `parseHomeContent()` never throw → `DEFAULT_HOME_CONTENT`.
- Empty `Setting` table → homepage byte-identical (minus any intentional structural simplifications, e.g. a decorative mid-heading `<br/>` — noted in the plan).
- Admin form: functional state + try/catch/finally; save errors surfaced.

## Verification

1. `npm run test` — vitest for `parseHomeContent` (empty/partial/malformed/array cases).
2. `npx tsc --noEmit` + `npm run build` pass; `/` + `/admin/home` compile.
3. Empty `Setting` table → homepage renders identically to current (diff sections against the base).
4. Admin round-trip: edit a feature card, reorder a solution card, change the CTA button label, edit a hero stat → all reflect on `/`.
5. Banned-term grep clean over `home-content.ts` (contains the moved copy) + `HomeClient.tsx`.

## Risks

- **Big form:** the admin form has 5 card-list editors + many text fields. Keep the card editors small/reusable (mirror the Phase 3 `StringListEditor`/`CrossLinksEditor` pattern).
- **Fidelity:** `HomeClient` has heavy animation; the rewiring must touch only content, not layout — the final review diffs it against the base (as with the Phase 3 bespoke splits).
- **Decorative `<br/>` in two headings** (`PLAN YOUR / FARM.`, `START FARM / CALCULATION`): the accent-split headings keep their structural `<br>`; a purely decorative mid-word break may be dropped (natural wrap) — noted so the diff review expects it.
- **`Setting.value` MUST be widened to `@db.Text` (schema change + `prisma db push`).** It is currently a bare `String` → `VARCHAR(191)` on MySQL. The `home_content` JSON far exceeds 191 chars, so the write would fail/truncate. **This also retroactively fixes a latent bug in sub-project 2:** the `footer_links` default is ~250 chars, so saving settings today would error on the `footer_links` write. Widening the column (VARCHAR→TEXT) is a safe, non-destructive migration and is the first task of this sub-project.
