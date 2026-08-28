/** Pure types + parser for editable homepage content. No DB/React imports. */

export interface StatTile { top: string; bottom: string }
export interface FeatureCard { title: string; body: string }
export interface SolutionCard { title: string; desc: string; image: string; href: string }
export interface OverviewTile { name: string; href: string }
export interface CalcCard { title: string; image: string; href: string }
export interface Teaser { title: string; desc: string; ctaLabel: string }

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

export const DEFAULT_HOME_CONTENT: HomeContent = {
  heroStats: [
    { top: '35+', bottom: 'Years of Experience' },
    { top: '500+', bottom: 'Farms' },
    { top: 'Complete Poultry Housing', bottom: '' },
    { top: 'Layer · Breeder · Broiler Systems', bottom: '' },
  ],
  featureCards: [
    {
      title: 'Innovative Poultry Solutions',
      body: 'Poultry housing systems engineered around bird comfort, farm workflow, clean manure handling, uniform feeding, and long service life.',
    },
    {
      title: 'Expertise & Experience',
      body: 'Backed by over 35 years of manufacturing excellence and deep industry knowledge.',
    },
    {
      title: 'Customer-Centric Approach',
      body: 'Delivering customized turnkey solutions from project planning to final installation.',
    },
  ],
  positioning: {
    heading: 'Engineered for',
    accent: 'Performance.',
    body: 'Metplast designs, manufactures, and installs complete poultry housing — cage systems, feeding, drinking, manure handling, egg collection, ventilation, and feed storage — for layer, breeder, and broiler farms. From levelled land to a running farm, one team stays responsible.',
  },
  solutionCards: [
    { title: 'Metplast Housing', image: '/images/Near-Rajesh-Home-Page.jpg', href: '/housing', desc: 'Complete structural builds.' },
    { title: 'Layer Solutions', image: '/images/Layer2.jpg', href: '/layer', desc: 'H-Type & S-Frame Layer Cages.' },
    { title: 'Breeder Solutions', image: '/images/Breeder2.jpg', href: '/breeder', desc: 'Breeder Cage & Feeding Systems.' },
    { title: 'Broiler Solutions', image: '/images/gallery/1-3-600x540.jpg', href: '/broiler', desc: 'Floor & Cage Broiler Systems.' },
  ],
  overview: {
    eyebrow: 'Our Equipment',
    heading: 'Everything Your Farm Needs',
    tiles: [
      { name: 'Cage Systems', href: '/layer' },
      { name: 'Feeding', href: '/layer' },
      { name: 'Drinking', href: '/layer' },
      { name: 'Manure Removal', href: '/layer' },
      { name: 'Egg Collection', href: '/layer' },
      { name: 'Environmental Control', href: '/environmental-control' },
      { name: 'Feed Silos', href: '/feed-silos' },
      { name: 'Calculators', href: '/calculators' },
    ],
  },
  calculators: {
    heading: 'START FARM',
    accent: 'CALCULATION',
    body: 'Use our intelligent calculators to determine the optimal bird density, rows, and dimensions for your shed.',
    cards: [
      { title: 'Layer', image: '/images/Untitled-design-3-560x690.jpg', href: '/calculators/layer' },
      { title: 'Layer Pullet', image: '/images/gallery/9-600x540.jpg', href: '/calculators/layer-pullet' },
      { title: 'Breeder', image: '/images/Breeder2.jpg', href: '/calculators/breeder' },
      { title: 'Breeder Pullet', image: '/images/gallery/4-1-600x540.jpg', href: '/calculators/breeder-pullet' },
      { title: 'Broiler', image: '/images/gallery/1-3-600x540.jpg', href: '/calculators/broiler' },
    ],
  },
  teasers: [
    {
      title: 'Environmental Control',
      desc: 'Keep your flock comfortable with our range of exhaust fans, cooling pads, and automated climate control systems.',
      ctaLabel: 'View Climate Systems',
    },
    {
      title: 'Projects & Gallery',
      desc: 'See real installations of our cages, silos, and housing projects across 500+ farms.',
      ctaLabel: 'View All Projects',
    },
    {
      title: 'Product Brochures',
      desc: 'Download our comprehensive master brochure containing detailed specs of all Metplast products.',
      ctaLabel: 'Download PDF',
    },
  ],
  cta: {
    heading: 'PLAN YOUR FARM.',
    body: 'Speak to our engineers today to configure your complete poultry housing and equipment setup.',
    buttonLabel: 'Send Enquiry',
    href: '/contact',
  },
};

export function parseHomeContent(value: string | null | undefined): HomeContent {
  const d = DEFAULT_HOME_CONTENT;
  if (!value) return d;
  let raw: unknown;
  try { raw = JSON.parse(value); } catch { return d; }
  if (!raw || typeof raw !== 'object') return d;
  const p = raw as Record<string, unknown>;
  const str = (v: unknown, def: string) => (typeof v === 'string' ? v : def);
  const arr = <T,>(v: unknown, def: T[]) => (Array.isArray(v) ? (v as T[]) : def);
  const obj = (v: unknown) => (v && typeof v === 'object' ? (v as Record<string, unknown>) : {});
  /**
   * heroStats and teasers are rendered by FIXED INDEX in HomeClient (icons/CTAs
   * are positional), so their length must always equal the default's — otherwise
   * a removed/short/empty array would make `content.heroStats[3]` undefined and
   * crash SSR. Normalize element-wise over the defaults (pad missing, drop extras,
   * fill missing sub-fields), so any input — including `[]` or `[null,...]` from a
   * crafted PUT — yields a well-formed fixed-length array.
   */
  const fixedStats = (v: unknown): StatTile[] =>
    d.heroStats.map((def, i) => { const o = obj(Array.isArray(v) ? v[i] : undefined); return { top: str(o.top, def.top), bottom: str(o.bottom, def.bottom) }; });
  const fixedTeasers = (v: unknown): Teaser[] =>
    d.teasers.map((def, i) => { const o = obj(Array.isArray(v) ? v[i] : undefined); return { title: str(o.title, def.title), desc: str(o.desc, def.desc), ctaLabel: str(o.ctaLabel, def.ctaLabel) }; });
  const pos = obj(p.positioning), ov = obj(p.overview), ca = obj(p.calculators), ct = obj(p.cta);
  return {
    heroStats: fixedStats(p.heroStats),
    featureCards: arr(p.featureCards, d.featureCards),
    positioning: { heading: str(pos.heading, d.positioning.heading), accent: str(pos.accent, d.positioning.accent), body: str(pos.body, d.positioning.body) },
    solutionCards: arr(p.solutionCards, d.solutionCards),
    overview: { eyebrow: str(ov.eyebrow, d.overview.eyebrow), heading: str(ov.heading, d.overview.heading), tiles: arr(ov.tiles, d.overview.tiles) },
    calculators: { heading: str(ca.heading, d.calculators.heading), accent: str(ca.accent, d.calculators.accent), body: str(ca.body, d.calculators.body), cards: arr(ca.cards, d.calculators.cards) },
    teasers: fixedTeasers(p.teasers),
    cta: { heading: str(ct.heading, d.cta.heading), body: str(ct.body, d.cta.body), buttonLabel: str(ct.buttonLabel, d.cta.buttonLabel), href: str(ct.href, d.cta.href) },
  };
}
