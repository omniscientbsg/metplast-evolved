/** Pure types + mappers for editable page content. No DB/React/config imports. */

export interface HeroCta { label: string; href: string; }
export interface CrossLink { title: string; desc: string; href: string; color: string; }

/** Flat, typed shape the frontend + admin consume. */
export interface PageContentView {
  eyebrow: string | null;
  title: string;
  titleAccent: string | null;
  subtitle: string;
  image: string | null;
  ctaPrimary: HeroCta | null;
  ctaSecondary: HeroCta | null;
  intro: string[];
  crossLinks: CrossLink[];
}

/** The subset of a PageContent row the mapper reads (Json columns typed loosely). */
export interface PageContentRow {
  page: string;
  heroEyebrow: string | null;
  heroTitle: string;
  heroTitleAccent: string | null;
  heroSubtitle: string;
  heroImage: string | null;
  heroCtaPrimary: unknown;
  heroCtaSecondary: unknown;
  intro: unknown;
  crossLinks: unknown;
}

/** `bespoke` = the hero renders an eyebrow badge + a gradient title-accent
 *  (home/about/housing). The 5 product pages use ScrollPageTemplate's plain
 *  word-split title, which ignores eyebrow/titleAccent — so the admin form
 *  hides those two inputs when `bespoke` is false. */
export interface PageDef { page: string; label: string; hasIntro: boolean; hasCrossLinks: boolean; bespoke: boolean; }

export const PAGE_DEFS: PageDef[] = [
  { page: 'home',                  label: 'Home',                  hasIntro: false, hasCrossLinks: false, bespoke: true  },
  { page: 'about',                 label: 'About',                 hasIntro: true,  hasCrossLinks: false, bespoke: true  },
  { page: 'housing',               label: 'Metplast Housing',      hasIntro: false, hasCrossLinks: false, bespoke: true  },
  { page: 'layer',                 label: 'Layer',                 hasIntro: true,  hasCrossLinks: true,  bespoke: false },
  { page: 'breeder',               label: 'Breeder',               hasIntro: true,  hasCrossLinks: true,  bespoke: false },
  { page: 'broiler',               label: 'Broiler',               hasIntro: true,  hasCrossLinks: true,  bespoke: false },
  { page: 'environmental-control', label: 'Environmental Control', hasIntro: true,  hasCrossLinks: true,  bespoke: false },
  { page: 'feed-silos',            label: 'Feed Silos',            hasIntro: true,  hasCrossLinks: true,  bespoke: false },
];

export function getPageDef(page: string): PageDef | undefined {
  return PAGE_DEFS.find((d) => d.page === page);
}
export function isKnownPage(page: string): boolean {
  return PAGE_DEFS.some((d) => d.page === page);
}

function asCta(v: unknown): HeroCta | null {
  if (v && typeof v === 'object' && 'label' in v && 'href' in v) {
    const o = v as { label: unknown; href: unknown };
    if (typeof o.label === 'string' && typeof o.href === 'string') return { label: o.label, href: o.href };
  }
  return null;
}
function asStringArray(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [];
}
function asCrossLinks(v: unknown): CrossLink[] {
  if (!Array.isArray(v)) return [];
  return v
    .filter((x): x is Record<string, unknown> => Boolean(x) && typeof x === 'object')
    .map((x) => ({
      title: typeof x.title === 'string' ? x.title : '',
      desc: typeof x.desc === 'string' ? x.desc : '',
      href: typeof x.href === 'string' ? x.href : '#',
      color: typeof x.color === 'string' ? x.color : '#3b82f6',
    }));
}

export function rowToPageContent(row: PageContentRow): PageContentView {
  return {
    eyebrow: row.heroEyebrow,
    title: row.heroTitle,
    titleAccent: row.heroTitleAccent,
    subtitle: row.heroSubtitle,
    image: row.heroImage,
    ctaPrimary: asCta(row.heroCtaPrimary),
    ctaSecondary: asCta(row.heroCtaSecondary),
    intro: asStringArray(row.intro),
    crossLinks: asCrossLinks(row.crossLinks),
  };
}

/** Shape passed to prisma create/update `data` (Json fields left as JS values; the
 *  API casts them to Prisma.InputJsonValue). `page` is included for upsert. */
export interface PageContentWrite {
  page: string;
  heroEyebrow: string | null;
  heroTitle: string;
  heroTitleAccent: string | null;
  heroSubtitle: string;
  heroImage: string | null;
  heroCtaPrimary: HeroCta | null;
  heroCtaSecondary: HeroCta | null;
  intro: string[];
  crossLinks: CrossLink[];
}

export function pageContentToRow(page: string, v: PageContentView): PageContentWrite {
  return {
    page,
    heroEyebrow: v.eyebrow?.trim() || null,
    heroTitle: v.title,
    heroTitleAccent: v.titleAccent?.trim() || null,
    heroSubtitle: v.subtitle,
    heroImage: v.image || null,
    heroCtaPrimary: v.ctaPrimary,
    heroCtaSecondary: v.ctaSecondary,
    intro: v.intro,
    crossLinks: v.crossLinks,
  };
}

/** Coerce an untrusted view (an API request body) into a clean PageContentView:
 *  CTAs -> {label,href}|null, intro/crossLinks -> well-formed arrays, string|null
 *  fields guarded. Guarantees the write path never sees malformed/missing JSON
 *  (e.g. a body omitting `intro` would otherwise write `undefined` into a
 *  non-null Json column and throw). */
export function normalizePageContentView(v: PageContentView): PageContentView {
  return {
    eyebrow: typeof v?.eyebrow === 'string' ? v.eyebrow : null,
    title: typeof v?.title === 'string' ? v.title : '',
    titleAccent: typeof v?.titleAccent === 'string' ? v.titleAccent : null,
    subtitle: typeof v?.subtitle === 'string' ? v.subtitle : '',
    image: typeof v?.image === 'string' ? v.image : null,
    ctaPrimary: asCta(v?.ctaPrimary),
    ctaSecondary: asCta(v?.ctaSecondary),
    intro: asStringArray(v?.intro),
    crossLinks: asCrossLinks(v?.crossLinks),
  };
}
