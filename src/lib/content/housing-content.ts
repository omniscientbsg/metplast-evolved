/** Pure types + parser for editable Housing-page content. No DB/React imports. */

export interface SystemComponent { title: string; desc: string }
export interface FarmType { label: string; desc: string; href: string }
export interface ProjectStep { step: string; title: string; desc: string }

export interface HousingContent {
  whatWeBuild: { heading: string; intro: string; components: SystemComponent[] };
  whoItsFor:   { heading: string; intro: string; types: FarmType[] };
  projectFlow: { heading: string; intro: string; steps: ProjectStep[] };
  cta: { heading: string; body: string; buttonLabel: string; href: string };
}

export const DEFAULT_HOUSING_CONTENT: HousingContent = {
  whatWeBuild: {
    heading: 'WHAT METPLAST INTEGRATES.',
    intro: 'Every system below is designed, manufactured, and installed by Metplast. One vendor. One team. One responsibility.',
    components: [
      { title: 'Cage Systems', desc: 'H-Type and S-Frame cages for Layer, Breeder, and Broiler' },
      { title: 'Automatic Feeding', desc: 'Chain & trolley feeding systems for layer, breeder, and broiler lines' },
      { title: 'Nipple Drinking', desc: 'Adjustable nipple lines for all bird types and ages' },
      { title: 'Manure Removal', desc: 'Automated belt conveyors, cross conveyors, and elevators' },
      { title: 'Egg Collection', desc: 'Gentle slope collection with reduced breakage design' },
      { title: 'Environmental Control', desc: 'Cooling pads, exhaust fans, cone fans, and control panels' },
      { title: 'Feed Silos', desc: 'Galvanized steel silos with screw conveyors' },
      { title: 'Shed Structure', desc: 'Pre-engineered steel frames and sidewall systems' },
      { title: 'Lighting System', desc: 'LED lighting optimised for laying and breeding cycles' },
      { title: 'Water Lines', desc: 'Main water lines, pressure regulators, and medication dosers' },
      { title: 'Control Panels', desc: 'Smart environmental control panels for every shed' },
    ],
  },
  whoItsFor: {
    heading: "WHO IT'S FOR.",
    intro: 'Metplast Housing is built for farmers starting fresh, expanding existing farms, or upgrading from manual to automated systems.',
    types: [
      { label: 'Layer Farms', desc: 'Commercial egg production from 10,000 to 5 lakh+ birds', href: '/layer' },
      { label: 'Breeder Farms', desc: 'Hatching egg production with practical male bird placement', href: '/breeder' },
      { label: 'Broiler Farms', desc: 'Deep litter and H-Type cage broiler rearing systems', href: '/broiler' },
      { label: 'Integrated Farms', desc: 'Pullet + Layer or Pullet + Breeder on the same land', href: '/contact' },
    ],
  },
  projectFlow: {
    heading: 'HOW A PROJECT WORKS.',
    intro: 'From your first call to the day you stock birds — here is how Metplast manages your project.',
    steps: [
      { step: '01', title: 'Site Assessment', desc: 'We visit your land, assess topography, access, and local climate.' },
      { step: '02', title: 'Farm Layout Planning', desc: 'Shed count, orientation, spacing, utility routing, and system sizing.' },
      { step: '03', title: 'Manufacturing', desc: 'Cages, feeding systems, drinking lines, and silos made at Khalapur.' },
      { step: '04', title: 'Installation', desc: 'Our team installs every component — structure, cages, plumbing, electrical.' },
      { step: '05', title: 'Commissioning', desc: 'Full trial run, team training, and handover with ongoing support.' },
    ],
  },
  cta: {
    heading: 'PLAN YOUR FARM.',
    body: "Talk to a Metplast engineer about your project. We'll guide you from site layout to cage selection to full commissioning.",
    buttonLabel: 'Enquire Now',
    href: '/contact',
  },
};

export function parseHousingContent(value: string | null | undefined): HousingContent {
  const d = DEFAULT_HOUSING_CONTENT;
  if (!value) return d;
  let raw: unknown;
  try { raw = JSON.parse(value); } catch { return d; }
  if (!raw || typeof raw !== 'object') return d;
  const p = raw as Record<string, unknown>;
  const str = (v: unknown, def: string) => (typeof v === 'string' ? v : def);
  const arr = <T,>(v: unknown, def: T[]) => (Array.isArray(v) ? (v as T[]) : def);
  const obj = (v: unknown) => (v && typeof v === 'object' ? (v as Record<string, unknown>) : {});
  const wb = obj(p.whatWeBuild), wf = obj(p.whoItsFor), pf = obj(p.projectFlow), ct = obj(p.cta);
  return {
    whatWeBuild: { heading: str(wb.heading, d.whatWeBuild.heading), intro: str(wb.intro, d.whatWeBuild.intro), components: arr(wb.components, d.whatWeBuild.components) },
    whoItsFor:   { heading: str(wf.heading, d.whoItsFor.heading),   intro: str(wf.intro, d.whoItsFor.intro),   types: arr(wf.types, d.whoItsFor.types) },
    projectFlow: { heading: str(pf.heading, d.projectFlow.heading), intro: str(pf.intro, d.projectFlow.intro), steps: arr(pf.steps, d.projectFlow.steps) },
    cta: { heading: str(ct.heading, d.cta.heading), body: str(ct.body, d.cta.body), buttonLabel: str(ct.buttonLabel, d.cta.buttonLabel), href: str(ct.href, d.cta.href) },
  };
}
