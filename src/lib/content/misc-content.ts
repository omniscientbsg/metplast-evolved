/** Pure types + parser for Contact + Calculators page copy. No DB/React imports. */

export interface MiscContent {
  contact: {
    heroEyebrow: string;
    heroHeading: string;
    heroAccent: string;
    heroSubtitle: string;
    formHeading: string;
    ctaHeading: string;
    ctaBody: string;
  };
  calculators: {
    heroEyebrow: string;
    heroHeading: string;
    heroAccent: string;
    heroSubtitle: string;
    enquiryHeading: string;
    enquiryBody: string;
  };
}

export const DEFAULT_MISC_CONTENT: MiscContent = {
  contact: {
    heroEyebrow: 'Contact Metplast',
    heroHeading: 'SPEAK TO A',
    heroAccent: 'SALES ENGINEER.',
    heroSubtitle: 'Have questions or need expert poultry solutions? Share your project details and our team will guide you every step of the way.',
    formHeading: 'SEND ENQUIRY.',
    ctaHeading: 'FROM BLUEPRINT TO INSTALLATION.',
    ctaBody: 'Our expert team is ready to design and deploy the right system for your farm — from levelled land to full commissioning.',
  },
  calculators: {
    heroEyebrow: 'Engineering Tools',
    heroHeading: 'PLAN YOUR FARM',
    heroAccent: 'WITH PRECISION.',
    heroSubtitle: 'Select a calculator below to estimate the exact structural and equipment requirements for your poultry project.',
    enquiryHeading: 'Not Sure Which One?',
    enquiryBody: "Talk to our engineering team — we'll size your farm and recommend the right systems for your bird capacity.",
  },
};

export function parseMiscContent(value: string | null | undefined): MiscContent {
  const d = DEFAULT_MISC_CONTENT;
  if (!value) return d;
  let raw: unknown;
  try { raw = JSON.parse(value); } catch { return d; }
  if (!raw || typeof raw !== 'object') return d;
  const p = raw as Record<string, unknown>;
  const str = (v: unknown, def: string) => (typeof v === 'string' ? v : def);
  const obj = (v: unknown) => (v && typeof v === 'object' ? (v as Record<string, unknown>) : {});
  const c = obj(p.contact), k = obj(p.calculators);
  return {
    contact: {
      heroEyebrow: str(c.heroEyebrow, d.contact.heroEyebrow),
      heroHeading: str(c.heroHeading, d.contact.heroHeading),
      heroAccent: str(c.heroAccent, d.contact.heroAccent),
      heroSubtitle: str(c.heroSubtitle, d.contact.heroSubtitle),
      formHeading: str(c.formHeading, d.contact.formHeading),
      ctaHeading: str(c.ctaHeading, d.contact.ctaHeading),
      ctaBody: str(c.ctaBody, d.contact.ctaBody),
    },
    calculators: {
      heroEyebrow: str(k.heroEyebrow, d.calculators.heroEyebrow),
      heroHeading: str(k.heroHeading, d.calculators.heroHeading),
      heroAccent: str(k.heroAccent, d.calculators.heroAccent),
      heroSubtitle: str(k.heroSubtitle, d.calculators.heroSubtitle),
      enquiryHeading: str(k.enquiryHeading, d.calculators.enquiryHeading),
      enquiryBody: str(k.enquiryBody, d.calculators.enquiryBody),
    },
  };
}
