# Site Settings CMS — Phase 5 (sub-project 1) Design

**Date:** 2026-07-23
**Status:** Approved (design), pending spec review
**Scope:** The first sub-project of Phase 5 ("every little content"). Makes site-wide **company/brand settings** — logos, contact details, tagline, socials, SEO — editable in one place and consumed everywhere they're currently hardcoded. Builds on the existing `Setting` key/value table + the Phase 1-4 admin/upload patterns.

## Context

Phase 5 ("every little content") is too large for one spec, so it is decomposed into ordered sub-projects, each its own spec → plan → build: **(1) Site Settings [this doc]**, (2) Footer content, (3) Homepage sections, (4) Housing structured lists, (5) About structured, (6) Contact + Calculators copy.

Today:
- A `Setting` model (`key` unique, `value`, `updatedAt`) exists and is used for chatbot config (`chatbot_provider`, `chatbot_training_data`).
- The admin **Settings page** (`src/app/admin/(dashboard)/settings/page.tsx`) shows a Company-Contact form (email/phone/address/SEO) but it is a **dead stub**: a server component with a `type="button"` Save that has no handler and no save API. It does not persist anything, and its `defaultValue`s (`info@metplast.com`, `+91 98765 43210`, `New Delhi`) are stale placeholders.
- The **real** contact info is **hardcoded and duplicated** across `Footer.tsx`, `contact/page.tsx`, and the calculators enquiry card, and is **inconsistent** between them (e.g. Footer lists `sales@metplast.com` as primary; the contact page lists `info@metplast.com` as primary).
- **Two brand logos** (dark-theme `/images/Logo Metplast.png`, light-theme `/images/Metplast-Website-Themes-1980-x-400-px.png`) are hardcoded in the Navbar, Footer, and admin sidebar.

This sub-project makes all of the above a single editable source of truth.

## Goals

1. A typed registry of site-setting keys (label, group, input type, default) drives both the admin form and the consumption helper.
2. The admin Settings page becomes a **working** grouped form (text / textarea / url / image-upload fields) that saves via a real API.
3. A `getSiteSettings()` server helper returns a typed object (DB value ?? hardcoded fallback) so nothing renders blank.
4. Navbar, Footer, admin sidebar, contact page, and the calculators enquiry card render logos + contact details from settings — removing the duplication and inconsistency.
5. The existing chatbot settings keys are untouched.

## Non-goals (explicit)

- Footer nav-link lists, homepage/housing/about structured content, and per-page copy — later Phase 5 sub-projects.
- No new DB model (reuse `Setting`). No i18n. No versioning/audit of settings.
- No validation of external URLs beyond "non-empty → rendered".

## Key decisions

| Decision | Choice | Why |
|---|---|---|
| Storage | Reuse the existing `Setting` key/value table | No schema change; it already exists and is session-gated in spirit. Each field = one keyed row. |
| Field registry | `SITE_SETTING_KEYS` array (key, label, group, type, default) in a pure module | One source drives the admin form, the fallback defaults, and the typed getter. Adding a field = one entry. |
| Two phones / two emails | Discrete keys (`phone_primary`/`phone_secondary`, `email_primary`/`email_secondary`) | Matches the footer's exact 2+2 layout; simpler than a list editor. |
| Logos | Two image keys (`logo_dark`, `logo_light`) | The site swaps logos by theme (Navbar via JS opacity, Footer via `.footer-logo-*` CSS); two fields map 1:1 to the two `<Image src>`s. Only the `src` becomes dynamic — the toggle logic stays. |
| Fallbacks | The **current Footer** values (real Khalapur address, 05002/05005, `sales@`/`info@`, tagline, blurb) + the two real logo paths | So the live site is byte-identical until an admin edits something; the stale settings-form placeholders are discarded. |
| Phone display vs link | Store the **display** string (`+91 89284 05002`); derive `tel:` by stripping non-digits. Store `whatsapp_number` as bare digits (`918928405002`) for `wa.me`. | Keeps human-readable display editable while links stay correct. |
| Consumption | Server helper `getSiteSettings()`; client components receive values as props from their server parent, OR (Footer/Navbar) read via a server wrapper | Mirrors the Phase 3 bespoke-split pattern where a client component needs server data. |

## Data / registry

No schema change. New pure module `src/lib/settings/site-settings.ts`:

```ts
export type SettingType = 'text' | 'textarea' | 'url' | 'image';
export interface SettingField { key: string; label: string; group: string; type: SettingType; default: string; }

export const SITE_SETTING_KEYS: SettingField[] = [
  // Logos
  { key: 'logo_dark',  label: 'Logo (dark theme)',  group: 'Logos', type: 'image', default: '/images/Logo Metplast.png' },
  { key: 'logo_light', label: 'Logo (light theme)', group: 'Logos', type: 'image', default: '/images/Metplast-Website-Themes-1980-x-400-px.png' },
  // Contact
  { key: 'phone_primary',    label: 'Phone (primary)',    group: 'Contact', type: 'text',     default: '+91 89284 05002' },
  { key: 'phone_secondary',  label: 'Phone (secondary)',  group: 'Contact', type: 'text',     default: '+91 89284 05005' },
  { key: 'whatsapp_number',  label: 'WhatsApp number (digits only)', group: 'Contact', type: 'text', default: '918928405002' },
  { key: 'email_primary',    label: 'Email (primary)',    group: 'Contact', type: 'text',     default: 'sales@metplast.com' },
  { key: 'email_secondary',  label: 'Email (secondary)',  group: 'Contact', type: 'text',     default: 'info@metplast.com' },
  { key: 'address',          label: 'Address (one line per row)', group: 'Contact', type: 'textarea', default: 'Plot No. 207, Atkargaon, Dheku Road,\nSajgaon Phata, Khalapur,\nMH 410203, India' },
  { key: 'map_url',          label: 'Google Maps URL',    group: 'Contact', type: 'url',      default: '' },
  { key: 'business_hours',   label: 'Business hours',     group: 'Contact', type: 'text',     default: '' },
  // Brand
  { key: 'tagline',     label: 'Tagline',     group: 'Brand', type: 'text',     default: 'Think of Poultry, Think of Us.' },
  { key: 'footer_blurb',label: 'Footer blurb',group: 'Brand', type: 'textarea', default: 'From levelled land to complete poultry housing systems. Metplast designs, manufactures, and installs cage systems, feeding, drinking, ventilation, cooling, and feed storage for Layer, Breeder, and Broiler farms.' },
  // Social (blank = hidden)
  { key: 'social_facebook',  label: 'Facebook URL',  group: 'Social', type: 'url', default: '' },
  { key: 'social_instagram', label: 'Instagram URL', group: 'Social', type: 'url', default: '' },
  { key: 'social_linkedin',  label: 'LinkedIn URL',  group: 'Social', type: 'url', default: '' },
  { key: 'social_youtube',   label: 'YouTube URL',   group: 'Social', type: 'url', default: '' },
  // SEO
  { key: 'seo_description', label: 'Meta description', group: 'SEO', type: 'textarea', default: '' },
];
```

Plus pure helpers (unit-tested):
- `siteSettingsFromRows(rows: {key,value}[]): SiteSettings` — builds a typed object keyed by camelCase (`logoDark`, `phonePrimary`, …), each value = row value (non-empty) ?? registry default.
- `telHref(display: string): string` — `tel:+` + digits of the display phone.
- `SiteSettings` interface (all fields as strings; the exact camelCase keys).

## Architecture & components

### Server helper
`src/lib/settings/get-site-settings.ts` → `getSiteSettings()`: `prisma.setting.findMany()` (or `findMany({ where: { key: { in: keys } } })`), map via `siteSettingsFromRows`, return `SiteSettings`. Wrapped in try/catch → all-defaults on error. (This file imports prisma, so it is separate from the pure registry/helpers that vitest tests.)

### Admin
- **Settings page** (`settings/page.tsx`, server): fetch current `Setting` rows, build the typed values (with defaults), render a client `SiteSettingsForm` grouped by `group`. (The chatbot settings live on a separate `/admin/chatbot` page and are not touched.)
- **`SiteSettingsForm`** (client): renders each `SITE_SETTING_KEYS` field by `type` — text/url = input, textarea = textarea, image = current-preview + upload (via `/api/admin/upload`). Grouped headings. One Save → `PUT /api/admin/settings` with `{ [key]: value }`. Functional state + try/catch/finally + success/error banner (mirrors the Phase 3 form).
- **API** `PUT /api/admin/settings` (session-gated, 401): body = `Record<string,string>`; for each key that is in `SITE_SETTING_KEYS`, `prisma.setting.upsert({ where:{key}, create:{key,value}, update:{value} })` in a transaction. Ignores unknown keys (so it can't clobber chatbot settings). Returns the saved map. (A `GET` is not needed — the page reads via prisma directly.)

### Consumption (rewire hardcoded → settings)
- **Footer** (`components/Footer.tsx`): becomes props-driven — a server wrapper passes `settings` in, OR Footer is rendered by a server component that calls `getSiteSettings()`. Logos → `settings.logoDark`/`logoLight` (keep `.footer-logo-*` classes); address → split on `\n`; phones/emails → primary/secondary; tagline + blurb from settings. `tel:`/`mailto:` via `telHref` / `mailto:${email}`.
- **Navbar** (`components/Navbar.tsx`): the two `<Image src>` become `settings.logoDark`/`logoLight`; the existing opacity-toggle logic stays. Navbar is a client component → its server parent (the frontend layout) passes `logoDark`/`logoLight` as props.
- **Admin sidebar** (`admin/(dashboard)/layout.tsx`, server): the two `<Image src="/images/Logo Metplast.png">` → `settings.logoDark`.
- **Contact page** (`contact/page.tsx`): address/phones/emails/hours from settings (aligns its email order to the shared primary/secondary — a deliberate consistency change); the hardcoded error-message phone (`call us directly at +91 89284 05002`) → `settings.phonePrimary`.
- **Calculators enquiry card** (`calculators/page.tsx`): `wa.me/${whatsappNumber}` + `telHref(phonePrimary)`.
- Where a client component needs the values (Navbar, contact form, calculators card), the server page/layout fetches `getSiteSettings()` and passes the needed fields as props (Phase 3 pattern).

### Layout wiring
The `(frontend)/layout.tsx` renders Navbar + Footer. It becomes (or already is) a server component that calls `getSiteSettings()` once and passes logos/contact to Navbar + Footer. Confirm whether it's currently server or client; if client, split it minimally so the fetch happens server-side.

## Seeding

No migration script needed — `getSiteSettings()` falls back to registry defaults, so the site works with zero `Setting` rows. Optionally, the admin's first Save persists them. (The existing `prisma/seed.ts` seeds only chatbot keys; leave it, or add the site-setting defaults behind the non-prod gate — not required since fallbacks cover it.) Production: no change needed; admin edits create the rows on demand.

## Error handling

- `getSiteSettings()` DB failure → all registry defaults (never blank, never 500).
- API: 401 unauthenticated; unknown keys ignored (chatbot settings safe); 500 logged with safe message. Empty string for a field = "use default" on read (so clearing a logo restores the bundled one).
- Image upload reuses the existing endpoint (MIME allowlist, 5 MB, 401).

## Verification (project norm)

1. `npm run test` — vitest for `siteSettingsFromRows` (default fallback, override, camelCase mapping) + `telHref` (spaces/format stripped).
2. `npx tsc --noEmit` + `npm run build` pass; `/admin/settings` + all consuming pages compile.
3. Admin round-trip: change the primary phone + upload a new dark logo + set a Facebook URL → Save → Footer/Navbar/contact/calculators reflect it; clear the logo → bundled default returns.
4. Diff Footer/Navbar/contact/calculators against current with an empty `Setting` table → byte-identical (fallbacks = current values), except the contact page's email order aligning to `sales@` primary (the intended consistency fix).
5. Chatbot settings still work (untouched keys).
6. Banned-term grep clean (settings copy is admin-editable, not auto-checked — reviewer responsibility; note in `docs/SECURITY.md`).

## Risks / open items

- **Client-vs-server boundary:** Navbar, the contact form, and the calculators card are client components. Their server parent must fetch `getSiteSettings()` and pass props. Confirm `(frontend)/layout.tsx`'s current server/client status before wiring (may need a minimal split).
- **Email-order consistency change** on the contact page is intentional (aligns to the shared primary/secondary) — the only non-identical visual change post-wiring.
- Settings copy bypasses the no-overclaim grep gate (no automated check on admin writes) — documented as reviewer responsibility, consistent with products/gallery/blogs/pages.
- `PUT /api/admin/settings` must allowlist keys against `SITE_SETTING_KEYS` so it can never overwrite `chatbot_*` (or any non-registry) keys.
