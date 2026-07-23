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
  it('takes a provided array whole', () => {
    const r = parseHomeContent(JSON.stringify({ featureCards: [{ title: 'A', body: 'b' }] }));
    expect(r.featureCards).toHaveLength(1);
    expect(r.positioning).toEqual(DEFAULT_HOME_CONTENT.positioning);
  });
});
