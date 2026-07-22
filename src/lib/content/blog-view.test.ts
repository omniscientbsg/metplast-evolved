import { describe, it, expect } from 'vitest';
import { slugify, sortPosts, rowToBlogCard, type BlogCardRow } from './blog-view';

const base: BlogCardRow = {
  id: '1', slug: 'a', title: 'A', excerpt: 'blurb', image: '/img.jpg',
  author: 'Metplast Team', featured: false,
  createdAt: new Date('2026-01-10T00:00:00Z'), category: { name: 'News' },
};

describe('slugify', () => {
  it('lowercases and hyphenates', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });
  it('strips punctuation and collapses/trims hyphens', () => {
    expect(slugify('  The Future of Poultry!! (2026)  ')).toBe('the-future-of-poultry-2026');
  });
  it('handles empty/garbage input', () => {
    expect(slugify('***')).toBe('');
  });
});

describe('sortPosts', () => {
  it('floats featured to the top, then newest-first', () => {
    const rows = [
      { featured: false, createdAt: new Date('2026-01-01') },
      { featured: true, createdAt: new Date('2025-01-01') },
      { featured: false, createdAt: new Date('2026-05-01') },
    ];
    const out = sortPosts(rows);
    expect(out[0].featured).toBe(true);
    expect(out[1].createdAt.getTime()).toBeGreaterThan(out[2].createdAt.getTime());
  });
  it('does not mutate the input', () => {
    const rows = [{ featured: false, createdAt: new Date('2026-01-01') }];
    const copy = [...rows];
    sortPosts(rows);
    expect(rows).toEqual(copy);
  });
});

describe('rowToBlogCard', () => {
  it('maps a row to a display card with a formatted date', () => {
    const card = rowToBlogCard(base);
    expect(card).toMatchObject({
      id: '1', slug: 'a', title: 'A', excerpt: 'blurb',
      image: '/img.jpg', author: 'Metplast Team', featured: false, category: 'News',
    });
    expect(card.date).toBe('Jan 10, 2026');
  });
  it('maps a null category to null', () => {
    expect(rowToBlogCard({ ...base, category: null }).category).toBeNull();
  });
});
