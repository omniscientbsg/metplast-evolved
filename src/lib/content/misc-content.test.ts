import { describe, it, expect } from 'vitest';
import { parseMiscContent, DEFAULT_MISC_CONTENT } from './misc-content';

describe('parseMiscContent', () => {
  it('returns defaults for null/empty/garbage', () => {
    expect(parseMiscContent(null)).toEqual(DEFAULT_MISC_CONTENT);
    expect(parseMiscContent('')).toEqual(DEFAULT_MISC_CONTENT);
    expect(parseMiscContent('not json')).toEqual(DEFAULT_MISC_CONTENT);
    expect(parseMiscContent('42')).toEqual(DEFAULT_MISC_CONTENT);
  });
  it('deep-merges a partial field over defaults', () => {
    const r = parseMiscContent(JSON.stringify({ contact: { heroHeading: 'X' }, calculators: { enquiryHeading: 'Y' } }));
    expect(r.contact.heroHeading).toBe('X');
    expect(r.contact.heroSubtitle).toBe(DEFAULT_MISC_CONTENT.contact.heroSubtitle);
    expect(r.calculators.enquiryHeading).toBe('Y');
    expect(r.calculators.heroHeading).toBe(DEFAULT_MISC_CONTENT.calculators.heroHeading);
  });
});
