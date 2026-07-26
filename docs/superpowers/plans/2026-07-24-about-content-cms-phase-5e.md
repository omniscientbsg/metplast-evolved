# About Content CMS — Phase 5 (sub-project 5) Design + Plan

**Date:** 2026-07-24
**Status:** Design approved. Built directly by the controller (no subagents — budget constrained).

**Goal:** Make the About page's structured content below the hero+intro editable via one `about_content` JSON setting + `/admin/about`. Mirrors homepage/housing (5c/5d).

## Scope
`src/app/(frontend)/about/AboutClient.tsx` (already takes a `hero` prop; `hero.intro` = the story paragraphs, Phase 3). Editable here:
- **Story block:** 2-line heading ("DECADES OF EXPERTISE." / "ZERO COMPROMISE."), the 2 stat tiles (35+/Years, 500+/Farms), the main image + its badge (eyebrow/title).
- **"Why Choose Metplast" values grid:** heading + accent + intro + 4 value cards (title/desc).
- **Out of scope / stays in code:** value/badge icons (fixed by index), `MobaBlock`, layout/animation. Hero + intro-story = Phase 3.

## Shape (`src/lib/content/about-content.ts`, pure)

```ts
export interface StatTile { top: string; bottom: string }
export interface ValueCard { title: string; desc: string }

export interface AboutContent {
  story: { heading: string; subheading: string };
  stats: StatTile[];                       // exactly 2 (parser-normalized)
  mainImage: string;
  imageBadge: { eyebrow: string; title: string };
  values: { heading: string; accent: string; intro: string; cards: ValueCard[] };
}
```

- `DEFAULT_ABOUT_CONTENT` = current values verbatim (see Task 1).
- `parseAboutContent(value)`: JSON.parse + deep-merge each scalar over defaults; `values.cards` taken whole (free list); **`stats` normalized to exactly 2 element-wise over defaults** (fixed-index in the render → crash-guard, same as homepage heroStats).

## Tasks (built directly)

**Task 1 — `about-content.ts` + test (TDD).** Types + `DEFAULT_ABOUT_CONTENT` (extracted below) + `parseAboutContent`. Tests: null/garbage→defaults; partial merge; `stats:[]`→2 defaults; cards array taken whole.

`DEFAULT_ABOUT_CONTENT`:
- `story`: `{ heading: 'DECADES OF EXPERTISE.', subheading: 'ZERO COMPROMISE.' }`
- `stats`: `[{ top: '35+', bottom: 'Years' }, { top: '500+', bottom: 'Farms' }]`
- `mainImage`: `'/images/Hero-Slider-2.jpg'`
- `imageBadge`: `{ eyebrow: 'Turnkey Housing Project', title: 'Built by Metplast, Khalapur' }`
- `values.heading`: `'WHY CHOOSE'`, `values.accent`: `'METPLAST.'`, `values.intro`: (the current paragraph verbatim), `values.cards`: the 4 current cards (title/desc) verbatim.

**Task 2 — `get-about-content.ts` + `PUT /api/admin/about`** (mirror `home`/`housing`: `about_content` key, `parseAboutContent`).

**Task 3 — `AboutClient` + `about/page.tsx`.** page.tsx fetches `getAboutContent()`, passes `content`. AboutClient: `content: AboutContent` prop; render story heading/subheading, the 2 stat tiles from `content.stats[0]`/`[1]` (fixed 2, parser-guaranteed), main image (`content.mainImage`) + badge, values heading/accent/intro + `content.values.cards.map` with `VALUE_ICONS = [Zap, Globe, ShieldCheck, Users]` by index (fallback). Keep icons/MobaBlock/layout. The `35+`/`500+` inner `+` span collapses to plain (accepted minor delta).

**Task 4 — `/admin/about` form + nav link.** `AboutContentForm` (reuse ListEditor/ImageField): story heading/subheading; 2 fixed stat rows (top/bottom, `fixed` — no add/remove); main image upload; badge eyebrow/title; values heading/accent/intro + cards ListEditor (title/desc). `PUT /api/admin/about`. "About" nav link after "Housing".

**Task 5 — docs + verify.** SECURITY.md (`/api/admin/about` + no-overclaim caveat); `npm run test` + tsc + build + grep; commit.

## Verify / risks
- Empty `Setting` → About byte-identical (modulo the `+`-span collapse). `stats` fixed-count via parser (crash-safe). `values.cards` free list. No-overclaim: copy moved verbatim.
