# Footer Content CMS — Phase 5 (sub-project 2) Design

**Date:** 2026-07-24
**Status:** Approved (design), pending spec review
**Scope:** Sub-project 2 of Phase 5. Makes the Footer's link column editable and renders the social links (already editable in sub-project 1) as icons. Builds directly on the Site Settings infra (sub-project 1).

## Context

After sub-project 1 (Site Settings), the Footer already renders logos, brand blurb, tagline, address, phones, and emails from settings. Still hardcoded in `src/components/Footer.tsx`:
- the `solutionLinks` array (10 nav links) rendered in the "Solutions" column;
- the column headings ("Solutions", "Contact");
- the bottom bar (auto-year copyright + Privacy/Terms links).

Also, the `social_facebook/instagram/linkedin/youtube` keys added in sub-project 1 are **editable but rendered nowhere** — the Footer has no social row.

## Goals

1. The Footer's link list is editable in the admin (no code change to add/remove/reorder a link).
2. The social links set in `/admin/settings` render as icons in the Footer, each only when its URL is non-empty.
3. Everything falls back to the current values — the Footer is byte-identical until edited.

## Non-goals

- Column headings, bottom-bar Privacy/Terms links, and the copyright line stay in code (low churn / legal / auto-year).
- Navbar links stay in code (different structure — has a "Solutions" dropdown; a separate concern).
- No new DB model, no new API route, no new admin page — reuse the sub-project 1 settings infra.

## Key decisions

| Decision | Choice | Why |
|---|---|---|
| Footer links storage | A `footer_links` **textarea** setting: one link per line, `Label \| /href` | Reuses the entire scalar `SiteSettingsForm` + the `SETTING_KEY_SET` allowlist + the `useSiteSettings` context — zero new admin/API/context surface. A bespoke list-editor was considered but is unjustified for a ~10-item low-churn list (YAGNI). |
| Parsing | A pure `parseFooterLinks(text): FooterLink[]` (splits lines, splits on the first `\|`, trims, drops malformed/empty rows) | Unit-testable; the Footer renders the parsed result. |
| Social row | The Footer reads `socialFacebook/…` from `useSiteSettings` (already in context) and renders a lucide icon `<a>` per non-empty URL | Pure consumption; no new editing surface. |
| Default | `footer_links` registry default = the current 10 links as `Label \| /href` lines | Byte-identical fallback. |

## Data / registry

Extend the sub-project 1 registry (`src/lib/settings/site-settings.ts`):
- Add one field: `{ key: 'footer_links', label: 'Footer links (one per line: Label | /href)', group: 'Footer', type: 'textarea', default: '<the 10 current links as lines>' }`.
- Add `footerLinks: string` (the raw textarea value) to the `SiteSettings` interface + `siteSettingsFromRows`.

New pure module `src/lib/settings/footer-links.ts`:
- `interface FooterLink { label: string; href: string }`
- `parseFooterLinks(text: string): FooterLink[]` — for each non-empty line, split on the first `|`, trim label + href, keep only rows with both parts.
- Vitest for: the default 10 parse correctly; malformed lines (no `|`, empty) are dropped; whitespace trimmed.

Since `footer_links` is added to `SITE_SETTING_KEYS`, it is automatically: rendered as a textarea in the admin form, included in `SETTING_KEY_SET` (so the existing allowlisted `PUT` accepts it), and carried in `getSiteSettings()`/the context. **No API/admin/helper/context changes.**

## Architecture

- **`Footer.tsx`** (already a client component using `useSiteSettings`):
  - Replace the module-level `solutionLinks` const usage with `parseFooterLinks(s.footerLinks)` (the registry default guarantees the same 10 links when unset). Keep the "Solutions" heading + the per-link markup/hover exactly.
  - Add a **social row** in the brand column (after the tagline): for each of facebook/instagram/linkedin/youtube, if the URL is set, render an `<a href={url} target="_blank" rel="noopener noreferrer">` with the matching lucide icon (`Facebook`, `Instagram`, `Linkedin`, `Youtube`). The row renders nothing if all four are empty (current behavior).
- **Admin:** none — the `footer_links` textarea appears automatically under a new "Footer" group in the existing settings form.
- **Layout/API/context:** unchanged.

## Error handling / fallback

- `parseFooterLinks` on empty/garbage → drops bad rows; if the whole value is empty, the registry default (10 links) is used via `getSiteSettings()` resolution, so the Footer always has links.
- Social row: empty URLs render nothing (no broken icons).

## Verification

1. `npm run test` — vitest for `parseFooterLinks` (default parse, malformed drop, trim) passes; existing `site-settings` tests still pass (new `footerLinks` field).
2. `npx tsc --noEmit` + `npm run build` pass.
3. Empty `Setting` table → Footer link column byte-identical to current (10 links); no social icons (all URLs empty).
4. Admin round-trip: edit the `footer_links` textarea (reorder/rename/remove a line) → Footer reflects it; set a Facebook URL in Settings → the icon appears in the Footer.
5. Banned-term grep clean.

## Risks

- The `Label | /href` textarea is less polished than a list-editor; acceptable for a low-churn list and consistent with the settings form. If the client later wants drag-and-drop, a bespoke editor can replace the textarea without changing the storage key.
- A link with a literal `|` in its label would mis-split — labels don't contain `|`; documented in the field label.
