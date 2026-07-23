import { describe, it, expect } from 'vitest';
import { parseFooterLinks } from './footer-links';

describe('parseFooterLinks', () => {
  it('parses the default 10-line block into 10 links', () => {
    const text = [
      'Metplast Housing | /housing',
      'About Metplast | /about',
      'Layer Solutions | /layer',
      'Breeder Solutions | /breeder',
      'Broiler Solutions | /broiler',
      'Environmental Control | /environmental-control',
      'Feed Silos | /feed-silos',
      'Calculators | /calculators',
      'Gallery | /gallery',
      'Contact | /contact',
    ].join('\n');
    const links = parseFooterLinks(text);
    expect(links).toHaveLength(10);
    expect(links[0]).toEqual({ label: 'Metplast Housing', href: '/housing' });
    expect(links[9]).toEqual({ label: 'Contact', href: '/contact' });
  });

  it('trims whitespace around label and href', () => {
    expect(parseFooterLinks('  Home   |   /   ')).toEqual([{ label: 'Home', href: '/' }]);
  });

  it('drops lines with no pipe, blank lines, and rows missing label or href', () => {
    const text = 'Good | /good\nNoPipe\n\n | /orphan-href\nOrphan Label |\n   ';
    expect(parseFooterLinks(text)).toEqual([{ label: 'Good', href: '/good' }]);
  });

  it('splits only on the first pipe (href may contain query params)', () => {
    expect(parseFooterLinks('Search | /search?q=a|b')).toEqual([{ label: 'Search', href: '/search?q=a|b' }]);
  });
});
