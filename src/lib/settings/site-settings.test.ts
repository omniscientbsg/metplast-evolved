import { describe, it, expect } from 'vitest';
import { siteSettingsFromRows, telHref, SITE_SETTING_KEYS, SETTING_KEY_SET } from './site-settings';

describe('siteSettingsFromRows', () => {
  it('uses registry defaults when no rows', () => {
    const s = siteSettingsFromRows([]);
    expect(s.logoDark).toBe('/images/Logo Metplast.png');
    expect(s.phonePrimary).toBe('+91 89284 05002');
    expect(s.emailPrimary).toBe('sales@metplast.com');
    expect(s.tagline).toBe('Think of Poultry, Think of Us.');
    expect(s.socialFacebook).toBe('');
  });
  it('overrides with a non-empty DB value', () => {
    const s = siteSettingsFromRows([{ key: 'phone_primary', value: '+91 90000 00000' }]);
    expect(s.phonePrimary).toBe('+91 90000 00000');
  });
  it('treats a blank/whitespace DB value as "use default"', () => {
    const s = siteSettingsFromRows([{ key: 'logo_dark', value: '   ' }]);
    expect(s.logoDark).toBe('/images/Logo Metplast.png');
  });
  it('ignores unknown keys (e.g. chatbot settings)', () => {
    const s = siteSettingsFromRows([{ key: 'chatbot_provider', value: 'gemini' }]);
    expect((s as Record<string, string>).chatbot_provider).toBeUndefined();
    expect(s.phonePrimary).toBe('+91 89284 05002');
  });
});

describe('telHref', () => {
  it('strips formatting to a tel: link', () => {
    expect(telHref('+91 89284 05002')).toBe('tel:+918928405002');
  });
  it('handles already-bare digits', () => {
    expect(telHref('918928405002')).toBe('tel:+918928405002');
  });
});

describe('SETTING_KEY_SET', () => {
  it('is the set of registry keys', () => {
    expect(SETTING_KEY_SET.has('logo_dark')).toBe(true);
    expect(SETTING_KEY_SET.has('chatbot_provider')).toBe(false);
    expect(SETTING_KEY_SET.size).toBe(SITE_SETTING_KEYS.length);
  });
});
