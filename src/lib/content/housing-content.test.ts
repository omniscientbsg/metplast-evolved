import { describe, it, expect } from 'vitest';
import { parseHousingContent, DEFAULT_HOUSING_CONTENT } from './housing-content';

describe('parseHousingContent', () => {
  it('returns defaults for null/empty/garbage', () => {
    expect(parseHousingContent(null)).toEqual(DEFAULT_HOUSING_CONTENT);
    expect(parseHousingContent('')).toEqual(DEFAULT_HOUSING_CONTENT);
    expect(parseHousingContent('not json')).toEqual(DEFAULT_HOUSING_CONTENT);
    expect(parseHousingContent('42')).toEqual(DEFAULT_HOUSING_CONTENT);
  });
  it('deep-merges a partial section over defaults', () => {
    const r = parseHousingContent(JSON.stringify({ whatWeBuild: { heading: 'X' } }));
    expect(r.whatWeBuild.heading).toBe('X');
    expect(r.whatWeBuild.components).toEqual(DEFAULT_HOUSING_CONTENT.whatWeBuild.components);
    expect(r.whoItsFor).toEqual(DEFAULT_HOUSING_CONTENT.whoItsFor);
  });
  it('takes a provided array whole', () => {
    const r = parseHousingContent(JSON.stringify({ whoItsFor: { types: [{ label: 'A', desc: 'b', href: '/a' }] } }));
    expect(r.whoItsFor.types).toHaveLength(1);
    expect(r.projectFlow).toEqual(DEFAULT_HOUSING_CONTENT.projectFlow);
  });
});
