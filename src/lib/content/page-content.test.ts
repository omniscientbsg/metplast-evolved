import { describe, it, expect } from 'vitest';
import {
  rowToPageContent, pageContentToRow, getPageDef, isKnownPage, PAGE_DEFS,
  type PageContentRow, type PageContentView,
} from './page-content';

const view: PageContentView = {
  eyebrow: 'Eye', title: 'TITLE', titleAccent: 'ACCENT', subtitle: 'sub',
  image: '/img.jpg',
  ctaPrimary: { label: 'A', href: '/a' }, ctaSecondary: null,
  intro: ['p1', 'p2'],
  crossLinks: [{ title: 'C', desc: 'd', href: '/c', color: '#fff' }],
};

const row: PageContentRow = {
  page: 'layer', heroEyebrow: 'Eye', heroTitle: 'TITLE', heroTitleAccent: 'ACCENT',
  heroSubtitle: 'sub', heroImage: '/img.jpg',
  heroCtaPrimary: { label: 'A', href: '/a' }, heroCtaSecondary: null,
  intro: ['p1', 'p2'],
  crossLinks: [{ title: 'C', desc: 'd', href: '/c', color: '#fff' }],
};

describe('page-content mappers', () => {
  it('rowToPageContent maps a row (Json cast) to a view', () => {
    expect(rowToPageContent(row)).toEqual(view);
  });
  it('handles null CTAs and empty arrays', () => {
    const v = rowToPageContent({ ...row, heroCtaPrimary: null, heroCtaSecondary: null, intro: [], crossLinks: [] });
    expect(v.ctaPrimary).toBeNull();
    expect(v.intro).toEqual([]);
    expect(v.crossLinks).toEqual([]);
  });
  it('tolerates non-array intro/crossLinks (bad data) -> []', () => {
    const v = rowToPageContent({ ...row, intro: null as unknown as string[], crossLinks: undefined as unknown as [] });
    expect(v.intro).toEqual([]);
    expect(v.crossLinks).toEqual([]);
  });
  it('pageContentToRow round-trips a view', () => {
    const r = pageContentToRow('layer', view);
    expect(r.page).toBe('layer');
    expect(r.heroTitle).toBe('TITLE');
    expect(r.heroCtaPrimary).toEqual({ label: 'A', href: '/a' });
    expect(r.intro).toEqual(['p1', 'p2']);
  });
});

describe('page defs', () => {
  it('has 8 pages; home has no intro/crossLinks; layer has both', () => {
    expect(PAGE_DEFS).toHaveLength(8);
    expect(getPageDef('home')).toMatchObject({ hasIntro: false, hasCrossLinks: false });
    expect(getPageDef('layer')).toMatchObject({ hasIntro: true, hasCrossLinks: true });
    expect(getPageDef('about')).toMatchObject({ hasIntro: true, hasCrossLinks: false });
  });
  it('isKnownPage guards the fixed set', () => {
    expect(isKnownPage('layer')).toBe(true);
    expect(isKnownPage('nope')).toBe(false);
  });
});
