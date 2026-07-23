import type { PageContentView } from './page-content';
import type { PageConfig } from '@/components/ScrollPageTemplate';
import { layerConfig } from './layer';
import { breederConfig } from './breeder';
import { broilerConfig } from './broiler';
import { environmentalControlConfig } from './environmental-control';
import { feedSilosConfig } from './feed-silos';

/** Product-page hero/intro/crossLinks come straight from the code config. */
function fromConfig(c: PageConfig): PageContentView {
  return {
    eyebrow: null,
    title: c.hero.title,
    titleAccent: null,
    subtitle: c.hero.subtitle,
    image: c.hero.image,
    ctaPrimary: c.hero.ctaPrimary,
    ctaSecondary: c.hero.ctaSecondary ?? null,
    intro: c.intro,
    crossLinks: c.crossLinks,
  };
}

export const PAGE_FALLBACK: Record<string, PageContentView> = {
  home: {
    eyebrow: '35+ Years of Poultry Engineering',
    title: 'COMPLETE POULTRY',
    titleAccent: 'HOUSING SYSTEMS',
    subtitle: 'From levelled land to complete poultry housing, cage systems, feeding, drinking, ventilation, cooling, silos, and farm workflow planning.',
    image: '/images/Hero-Slider-2.jpg',
    ctaPrimary: { label: 'Plan My Poultry Project', href: '/housing' },
    ctaSecondary: { label: 'Explore Solutions', href: '/layer' },
    intro: [],
    crossLinks: [],
  },
  about: {
    eyebrow: 'About Metplast',
    title: '35+ YEARS OF',
    titleAccent: 'POULTRY ENGINEERING.',
    subtitle: 'Metplast Industries manufactures complete poultry housing and cage systems for the evolving needs of poultry farmers worldwide.',
    image: null,
    ctaPrimary: null,
    ctaSecondary: null,
    intro: [
      'For 35+ years, Metplast Industries has manufactured poultry housing and cage systems in India — layer, breeder, broiler, and pullet systems, with feeding, drinking, manure handling, egg collection, ventilation, and feed storage built around each farm.',
      'We work turnkey: from levelled land to a running farm, one team stays responsible — planning, manufacturing, installation, and long-term support.',
      '500+ farms across India and international markets run on Metplast systems. Farmers who choose Metplast build for the long run.',
    ],
    crossLinks: [],
  },
  housing: {
    eyebrow: 'Metplast Housing',
    title: 'COMPLETE POULTRY HOUSING',
    titleAccent: 'SYSTEMS.',
    subtitle: 'From levelled land to a fully commissioned poultry farm. Metplast designs, manufactures, and installs cage systems, feeding, drinking, ventilation, cooling, silos, and everything else your farm needs — in one project.',
    image: '/images/Near-Rajesh-Home-Page.jpg',
    ctaPrimary: { label: 'Plan My Farm', href: '/contact' },
    ctaSecondary: { label: 'Use Calculator', href: '/calculators' },
    intro: [],
    crossLinks: [],
  },
  layer: fromConfig(layerConfig),
  breeder: fromConfig(breederConfig),
  broiler: fromConfig(broilerConfig),
  'environmental-control': fromConfig(environmentalControlConfig),
  'feed-silos': fromConfig(feedSilosConfig),
};
