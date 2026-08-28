# Footer Content CMS — Phase 5 (sub-project 2) Implementation Plan

**Goal:** Footer link column editable via a `footer_links` textarea setting; social links rendered as icons. Reuses the sub-project 1 settings infra (no new model/API/admin page).

**Execution note:** Small sub-project (one pure module + two edits) that reuses established patterns — implemented inline by the controller, not via subagents. TDD for the pure parser; build/tsc/test + banned-term grep for the rest.

---

## Task 1: `parseFooterLinks` pure module (TDD)

**Files:** Create `src/lib/settings/footer-links.ts` + `.test.ts`.

- Test cases: the default 10-line block parses to 10 `{label,href}`; a line with no `|` is dropped; blank lines dropped; whitespace around label/href trimmed; a line with an empty label or empty href dropped.
- Implement:

```ts
export interface FooterLink { label: string; href: string }

/** Parse a "Label | /href" per-line textarea into links. Drops malformed rows. */
export function parseFooterLinks(text: string): FooterLink[] {
  return text
    .split('\n')
    .map((line) => {
      const i = line.indexOf('|');
      if (i === -1) return null;
      const label = line.slice(0, i).trim();
      const href = line.slice(i + 1).trim();
      return label && href ? { label, href } : null;
    })
    .filter((x): x is FooterLink => x !== null);
}
```

Commit: `feat(footer): parseFooterLinks pure module (task 1)`.

---

## Task 2: Registry field + SiteSettings

**Files:** Modify `src/lib/settings/site-settings.ts`.

- Add to `SITE_SETTING_KEYS` (new "Footer" group):

```ts
  { key: 'footer_links', label: 'Footer links (one per line: Label | /href)', group: 'Footer', type: 'textarea', default: 'Metplast Housing | /housing\nAbout Metplast | /about\nLayer Solutions | /layer\nBreeder Solutions | /breeder\nBroiler Solutions | /broiler\nEnvironmental Control | /environmental-control\nFeed Silos | /feed-silos\nCalculators | /calculators\nGallery | /gallery\nContact | /contact' },
```

- Add `footerLinks: string;` to the `SiteSettings` interface and `footerLinks: g('footer_links'),` to `siteSettingsFromRows`.
- `npx tsc --noEmit` + existing `site-settings.test.ts` still pass (new field is additive). Commit with Task 3.

---

## Task 3: Footer social row + editable links

**Files:** Modify `src/components/Footer.tsx`.

- Import: `import { parseFooterLinks } from '@/lib/settings/footer-links';` and add `Facebook, Instagram, Linkedin, Youtube` to the existing `lucide-react` import.
- Replace the module-level `solutionLinks` usage: render the "Solutions" column from `parseFooterLinks(s.footerLinks)` instead of the const. (The const can be removed; the registry default reproduces the same 10 links.)
- Add a social row in the brand column, after the tagline `<p>`:

```tsx
{(s.socialFacebook || s.socialInstagram || s.socialLinkedin || s.socialYoutube) && (
  <div className="flex gap-4 mt-2">
    {[
      { url: s.socialFacebook, Icon: Facebook },
      { url: s.socialInstagram, Icon: Instagram },
      { url: s.socialLinkedin, Icon: Linkedin },
      { url: s.socialYoutube, Icon: Youtube },
    ].filter((x) => x.url).map(({ url, Icon }, i) => (
      <a key={i} href={url} target="_blank" rel="noopener noreferrer"
        className="w-11 h-11 rounded-2xl flex items-center justify-center transition-colors"
        style={{ background: 'var(--glass-bg)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
        <Icon className="w-5 h-5" />
      </a>
    ))}
  </div>
)}
```

- Keep the "Solutions"/"Contact" headings, bottom bar, and all other markup unchanged.
- `npx tsc --noEmit` + `npm run build` pass; `/` renders. Empty Setting table → link column identical, no social icons.

Commit (tasks 2+3): `feat(footer): editable link column + social icons from settings (task 2-3)`.

---

## Final

- `npm run test` (parseFooterLinks + site-settings), `npx tsc --noEmit`, `npm run build`, banned-term grep on `src/lib/settings` + `src/components/Footer.tsx`.
- Self-review the Footer diff for fidelity (only the link source + the new social row changed).
