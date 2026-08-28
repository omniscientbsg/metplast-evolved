import { describe, it, expect } from 'vitest';
import { parseAboutContent, DEFAULT_ABOUT_CONTENT } from './about-content';

describe('parseAboutContent', () => {
  it('returns defaults for null/empty/garbage', () => {
    expect(parseAboutContent(null)).toEqual(DEFAULT_ABOUT_CONTENT);
    expect(parseAboutContent('')).toEqual(DEFAULT_ABOUT_CONTENT);
    expect(parseAboutContent('not json')).toEqual(DEFAULT_ABOUT_CONTENT);
    expect(parseAboutContent('42')).toEqual(DEFAULT_ABOUT_CONTENT);
  });
  it('deep-merges a partial section over defaults', () => {
    const r = parseAboutContent(JSON.stringify({ story: { heading: 'X' }, values: { accent: 'Y' } }));
    expect(r.story.heading).toBe('X');
    expect(r.story.subheading).toBe(DEFAULT_ABOUT_CONTENT.story.subheading);
    expect(r.values.accent).toBe('Y');
    expect(r.values.cards).toEqual(DEFAULT_ABOUT_CONTENT.values.cards);
  });
  it('normalizes stats to exactly 2 (fixed-index render), even when empty', () => {
    expect(parseAboutContent(JSON.stringify({ stats: [] })).stats).toEqual(DEFAULT_ABOUT_CONTENT.stats);
    const r = parseAboutContent(JSON.stringify({ stats: [{ top: 'A' }, {}, { top: 'EXTRA' }] }));
    expect(r.stats).toHaveLength(2);
    expect(r.stats[0]).toEqual({ top: 'A', bottom: DEFAULT_ABOUT_CONTENT.stats[0].bottom });
    expect(r.stats[1]).toEqual(DEFAULT_ABOUT_CONTENT.stats[1]);
  });
  it('takes the values.cards array whole', () => {
    const r = parseAboutContent(JSON.stringify({ values: { cards: [{ title: 'A', desc: 'b' }] } }));
    expect(r.values.cards).toHaveLength(1);
  });
});
