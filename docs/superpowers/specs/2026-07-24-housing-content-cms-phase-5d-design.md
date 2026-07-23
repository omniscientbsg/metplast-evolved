# Housing Content CMS — Phase 5 (sub-project 4) Design

**Date:** 2026-07-24
**Status:** Approved (design), pending spec review
**Scope:** Sub-project 4 of Phase 5. Makes the Housing page's structured sections below the hero editable. Directly mirrors the Homepage Content pattern (sub-project 3).

## Context

`src/app/(frontend)/housing/HousingClient.tsx` (a `"use client"` component that already takes a `hero` prop from Phase 3) has three module-level hardcoded lists rendered below the hero, plus section headings/intros and a bottom CTA:
- **`systemComponents`** (11 × `{icon, title, desc}`) — the "What We Build" grid.
- **`farmTypes`** (4 × `{label, desc, href}`) — the "Who It's For" cards.
- **`projectSteps`** (5 × `{step, title, desc}`) — the "Project Flow" section.
- Each section has an `<h2>` heading (+ usually an intro paragraph), and there is a bottom CTA section.

The hero (heading/subtitle/image/CTAs) is already editable via Phase 3 (`/admin/pages` → Metplast Housing) and stays there.

## Goals

1. The three card lists + their section headings/intros + the bottom CTA are editable in a dedicated `/admin/housing` form.
2. The page renders from the DB with a deep-merge fallback to the current values — never blank.
3. The hero remains owned by Phase 3.

## Non-goals

- Icons per `systemComponents` slot (fixed in code by index, with a fallback), decorative step-number styling, layout/animation — stay in code.
- Hero (Phase 3), Navbar/Footer (sub-projects 1-2).

## Key decisions (same as Homepage sub-project 3)

| Decision | Choice | Why |
|---|---|---|
| Storage | One `housing_content` JSON row in the `Setting` table (`value` is already `@db.Text`) | Consistent with homepage; deeply structured. |
| Parsing / fallback | `parseHousingContent(value)` — JSON.parse + deep-merge each field over `DEFAULT_HOUSING_CONTENT` | Partial/malformed JSON never blanks a section. |
| List safety | All three lists are `.map`-rendered (NOT fixed-index reads), so they are free lists — add/remove/reorder is safe (unlike the homepage `heroStats`/`teasers` which were fixed-index). `systemComponents` icons are chosen by index from a fixed code array with a fallback. | No crash risk; no fixed-count constraint needed. |
| Consumption | `HousingClient` gains a `content: HousingContent` prop (server `page.tsx` fetches it, as it already does `hero`). | Mirrors homepage. |
| Admin | Dedicated `/admin/housing` + `HousingContentForm` reusing the homepage `ListEditor` pattern. | Consistent. |
| API | Session-gated `PUT /api/admin/housing` writes `housing_content` (JSON), normalized through `parseHousingContent`. | Mirrors `/api/admin/home`. |

## Data shape

New pure module `src/lib/content/housing-content.ts`:

```ts
export interface SystemComponent { title: string; desc: string }   // icon fixed by index
export interface FarmType { label: string; desc: string; href: string }
export interface ProjectStep { step: string; title: string; desc: string }

export interface HousingContent {
  whatWeBuild: { heading: string; intro: string; components: SystemComponent[] };
  whoItsFor:   { heading: string; intro: string; types: FarmType[] };
  projectFlow: { heading: string; intro: string; steps: ProjectStep[] };
  cta: { heading: string; body: string; buttonLabel: string; href: string };
}

export const DEFAULT_HOUSING_CONTENT: HousingContent = { /* extracted verbatim from HousingClient */ };
export function parseHousingContent(value: string | null | undefined): HousingContent;  // deep-merge over defaults
```

`parseHousingContent` merges each section's scalar sub-fields (`heading`/`intro`) over the default and takes each array whole when present & valid (else the default array). Since nothing is rendered by fixed index, empty/short arrays are safe (they render an empty grid, admin-recoverable) — no fixed-count normalization needed. Vitest: null/empty/malformed → defaults; partial `{whatWeBuild:{heading}}` → that field overridden, rest default; array override taken whole.

> Confirm the exact `whatWeBuild`/`whoItsFor`/`projectFlow` intro paragraphs and the CTA fields by reading `HousingClient.tsx` during implementation — some sections may have a heading only (no intro); model `intro` as `''` where absent.

## Architecture

- **`get-housing-content.ts`** (server): `getHousingContent()` → read `housing_content` Setting, `parseHousingContent`; try/catch → defaults. Never throws.
- **`housing/page.tsx`** (already server, fetches `hero`): also `getHousingContent()`; render `<HousingClient hero={hero} content={content} />`.
- **`HousingClient.tsx`**: add `content: HousingContent` prop; render the three lists from `content.*.{components,types,steps}` (keep the `.map`, icons via a fixed `SYSTEM_ICONS` array indexed with a fallback, decorative step numbers from `step.step`), section headings/intros from content, and the CTA from `content.cta`. Keep all classes/animation/layout + the module-level icon list.
- **Admin:** `/admin/(dashboard)/housing/page.tsx` (server) + `HousingContentForm` (client, reuse the homepage `ListEditor`/text-field pattern) + a "Housing" admin nav link. Submits the whole `HousingContent` JSON to `PUT /api/admin/housing`.
- **API:** `PUT /api/admin/housing` — session-gated; normalizes body through `parseHousingContent`; upserts `housing_content`.

## Error handling / fallback / verification

- `getHousingContent`/`parseHousingContent` never throw → `DEFAULT_HOUSING_CONTENT`; empty `Setting` → byte-identical page.
- Verify: vitest for `parseHousingContent`; tsc + build; empty-table render matches current; admin round-trip (edit a component, reorder a farm type, change the CTA); banned-term grep clean over `housing-content.ts` + `HousingClient.tsx`.

## Risks

- Fidelity: `HousingClient` rewiring must touch only content bindings — the final review diffs it against the base (as with homepage).
- The `systemComponents` icon array must map 1:1 to the default order; an admin-added 12th component gets a fallback icon (acceptable, same as homepage feature cards).
