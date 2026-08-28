/** Pure registry + resolvers for site-wide settings. No DB/React imports. */

export type SettingType = 'text' | 'textarea' | 'url' | 'image';
export interface SettingField { key: string; label: string; group: string; type: SettingType; default: string; }

export const SITE_SETTING_KEYS: SettingField[] = [
  { key: 'logo_dark',  label: 'Logo (dark theme)',  group: 'Logos', type: 'image', default: '/images/Logo Metplast.png' },
  { key: 'logo_light', label: 'Logo (light theme)', group: 'Logos', type: 'image', default: '/images/Metplast-Website-Themes-1980-x-400-px.png' },
  { key: 'phone_primary',   label: 'Phone (primary)',   group: 'Contact', type: 'text', default: '+91 89284 05002' },
  { key: 'phone_secondary', label: 'Phone (secondary)', group: 'Contact', type: 'text', default: '+91 89284 05005' },
  { key: 'whatsapp_number', label: 'WhatsApp number (digits only)', group: 'Contact', type: 'text', default: '918928405002' },
  { key: 'email_primary',   label: 'Email (primary)',   group: 'Contact', type: 'text', default: 'sales@metplast.com' },
  { key: 'email_secondary', label: 'Email (secondary)', group: 'Contact', type: 'text', default: 'info@metplast.com' },
  { key: 'address', label: 'Address (one line per row)', group: 'Contact', type: 'textarea', default: 'Plot No. 207, Atkargaon, Dheku Road,\nSajgaon Phata, Khalapur,\nDist. Raigad, MH-410203, India' },
  { key: 'map_url', label: 'Google Maps URL', group: 'Contact', type: 'url', default: '' },
  { key: 'business_hours', label: 'Business hours', group: 'Contact', type: 'text', default: '' },
  { key: 'tagline', label: 'Tagline', group: 'Brand', type: 'text', default: 'Think of Poultry, Think of Us.' },
  { key: 'footer_blurb', label: 'Footer blurb', group: 'Brand', type: 'textarea', default: 'From levelled land to complete poultry housing systems. Metplast designs, manufactures, and installs cage systems, feeding, drinking, ventilation, cooling, and feed storage for Layer, Breeder, and Broiler farms.' },
  { key: 'social_facebook',  label: 'Facebook URL',  group: 'Social', type: 'url', default: '' },
  { key: 'social_instagram', label: 'Instagram URL', group: 'Social', type: 'url', default: '' },
  { key: 'social_linkedin',  label: 'LinkedIn URL',  group: 'Social', type: 'url', default: '' },
  { key: 'social_youtube',   label: 'YouTube URL',   group: 'Social', type: 'url', default: '' },
  { key: 'seo_description', label: 'Meta description', group: 'SEO', type: 'textarea', default: '' },
  { key: 'footer_links', label: 'Footer links (one per line: Label | /href)', group: 'Footer', type: 'textarea', default: 'Metplast Housing | /housing\nAbout Metplast | /about\nLayer Solutions | /layer\nBreeder Solutions | /breeder\nBroiler Solutions | /broiler\nEnvironmental Control | /environmental-control\nFeed Silos | /feed-silos\nCalculators | /calculators\nGallery | /gallery\nContact | /contact' },
];

export const SETTING_KEY_SET = new Set(SITE_SETTING_KEYS.map((f) => f.key));

export interface SiteSettings {
  logoDark: string; logoLight: string;
  phonePrimary: string; phoneSecondary: string; whatsappNumber: string;
  emailPrimary: string; emailSecondary: string;
  address: string; mapUrl: string; businessHours: string;
  tagline: string; footerBlurb: string;
  socialFacebook: string; socialInstagram: string; socialLinkedin: string; socialYoutube: string;
  seoDescription: string;
  footerLinks: string;
}

/** Resolve one key: a non-empty DB value wins, else the registry default. */
function resolve(rows: { key: string; value: string }[], key: string): string {
  const field = SITE_SETTING_KEYS.find((f) => f.key === key);
  const def = field ? field.default : '';
  const row = rows.find((r) => r.key === key);
  return row && row.value.trim() !== '' ? row.value : def;
}

export function siteSettingsFromRows(rows: { key: string; value: string }[]): SiteSettings {
  const g = (key: string) => resolve(rows, key);
  return {
    logoDark: g('logo_dark'), logoLight: g('logo_light'),
    phonePrimary: g('phone_primary'), phoneSecondary: g('phone_secondary'), whatsappNumber: g('whatsapp_number'),
    emailPrimary: g('email_primary'), emailSecondary: g('email_secondary'),
    address: g('address'), mapUrl: g('map_url'), businessHours: g('business_hours'),
    tagline: g('tagline'), footerBlurb: g('footer_blurb'),
    socialFacebook: g('social_facebook'), socialInstagram: g('social_instagram'),
    socialLinkedin: g('social_linkedin'), socialYoutube: g('social_youtube'),
    seoDescription: g('seo_description'),
    footerLinks: g('footer_links'),
  };
}

/** Build a tel: link from a display phone by keeping only digits. */
export function telHref(display: string): string {
  return `tel:+${display.replace(/\D/g, '')}`;
}
