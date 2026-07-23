import { describe, it, expect } from 'vitest';
import { parseHomeContent, DEFAULT_HOME_CONTENT } from './home-content';

describe('parseHomeContent', () => {
  it('returns defaults for null/empty/garbage', () => {
    expect(parseHomeContent(null)).toEqual(DEFAULT_HOME_CONTENT);
    expect(parseHomeContent('')).toEqual(DEFAULT_HOME_CONTENT);
    expect(parseHomeContent('not json')).toEqual(DEFAULT_HOME_CONTENT);
    expect(parseHomeContent('42')).toEqual(DEFAULT_HOME_CONTENT);
  });
  it('deep-merges a partial object field over defaults', () => {
    const r = parseHomeContent(JSON.stringify({ cta: { heading: 'NEW' } }));
    expect(r.cta.heading).toBe('NEW');
    expect(r.cta.body).toBe(DEFAULT_HOME_CONTENT.cta.body);
    expect(r.featureCards).toEqual(DEFAULT_HOME_CONTENT.featureCards);
  });
  it('takes a provided free-list array whole', () => {
    const r = parseHomeContent(JSON.stringify({ featureCards: [{ title: 'A', body: 'b' }] }));
    expect(r.featureCards).toHaveLength(1);
    expect(r.positioning).toEqual(DEFAULT_HOME_CONTENT.positioning);
  });

  // heroStats + teasers are rendered by FIXED INDEX in HomeClient, so the parser
  // must always return exactly the default count regardless of input (else SSR crashes).
  it('normalizes heroStats to exactly 4, even when empty', () => {
    const r = parseHomeContent(JSON.stringify({ heroStats: [] }));
    expect(r.heroStats).toEqual(DEFAULT_HOME_CONTENT.heroStats);
    expect(r.heroStats).toHaveLength(4);
  });
  it('fills missing heroStats sub-fields from defaults and clamps overflow', () => {
    const r = parseHomeContent(JSON.stringify({ heroStats: [{ top: 'X' }, {}, {}, {}, { top: 'EXTRA' }] }));
    expect(r.heroStats).toHaveLength(4);
    expect(r.heroStats[0]).toEqual({ top: 'X', bottom: DEFAULT_HOME_CONTENT.heroStats[0].bottom });
    expect(r.heroStats[1]).toEqual(DEFAULT_HOME_CONTENT.heroStats[1]);
  });
  it('normalizes teasers to exactly 3 for empty / null-filled input', () => {
    expect(parseHomeContent(JSON.stringify({ teasers: [] })).teasers).toEqual(DEFAULT_HOME_CONTENT.teasers);
    expect(parseHomeContent(JSON.stringify({ teasers: [null, null, null] })).teasers).toEqual(DEFAULT_HOME_CONTENT.teasers);
  });
});
