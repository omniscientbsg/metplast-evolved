/** Pure types + parser for editable About-page content. No DB/React imports. */

export interface StatTile { top: string; bottom: string }
export interface ValueCard { title: string; desc: string }

export interface AboutContent {
  story: { heading: string; subheading: string };
  stats: StatTile[];
  mainImage: string;
  imageBadge: { eyebrow: string; title: string };
  values: { heading: string; accent: string; intro: string; cards: ValueCard[] };
}

export const DEFAULT_ABOUT_CONTENT: AboutContent = {
  story: { heading: 'DECADES OF EXPERTISE.', subheading: 'ZERO COMPROMISE.' },
  stats: [
    { top: '35+', bottom: 'Years' },
    { top: '500+', bottom: 'Farms' },
  ],
  mainImage: '/images/Hero-Slider-2.jpg',
  imageBadge: { eyebrow: 'Turnkey Housing Project', title: 'Built by Metplast, Khalapur' },
  values: {
    heading: 'WHY CHOOSE',
    accent: 'METPLAST.',
    intro: "Built on engineering precision and deep understanding of what poultry farmers need. We don't just supply equipment — we help you build a farm that performs year after year.",
    cards: [
      { title: 'Turnkey Delivery', desc: 'From levelled land to a running farm, one team stays responsible — planning, manufacturing, installation, and long-term support.' },
      { title: 'India & International', desc: 'Metplast systems operate on poultry farms across India and international markets.' },
      { title: 'Egg Protection', desc: 'Our cage designs protect every egg from collection to delivery, reducing breakage and improving margins.' },
      { title: '500+ Farms', desc: 'Layer, Breeder, and Broiler farms trust Metplast for complete housing and equipment solutions.' },
    ],
  },
};

export function parseAboutContent(value: string | null | undefined): AboutContent {
  const d = DEFAULT_ABOUT_CONTENT;
  if (!value) return d;
  let raw: unknown;
  try { raw = JSON.parse(value); } catch { return d; }
  if (!raw || typeof raw !== 'object') return d;
  const p = raw as Record<string, unknown>;
  const str = (v: unknown, def: string) => (typeof v === 'string' ? v : def);
  const arr = <T,>(v: unknown, def: T[]) => (Array.isArray(v) ? (v as T[]) : def);
  const obj = (v: unknown) => (v && typeof v === 'object' ? (v as Record<string, unknown>) : {});
  // stats are rendered by fixed index (2 tiles) -> normalize to exactly 2 over the
  // defaults (pad/clamp/fill), so any input yields a well-formed 2-length array.
  const fixedStats = (v: unknown): StatTile[] =>
    d.stats.map((def, i) => { const o = obj(Array.isArray(v) ? v[i] : undefined); return { top: str(o.top, def.top), bottom: str(o.bottom, def.bottom) }; });
  const st = obj(p.story), ib = obj(p.imageBadge), va = obj(p.values);
  return {
    story: { heading: str(st.heading, d.story.heading), subheading: str(st.subheading, d.story.subheading) },
    stats: fixedStats(p.stats),
    mainImage: str(p.mainImage, d.mainImage),
    imageBadge: { eyebrow: str(ib.eyebrow, d.imageBadge.eyebrow), title: str(ib.title, d.imageBadge.title) },
    values: {
      heading: str(va.heading, d.values.heading),
      accent: str(va.accent, d.values.accent),
      intro: str(va.intro, d.values.intro),
      cards: arr(va.cards, d.values.cards),
    },
  };
}
