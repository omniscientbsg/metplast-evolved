import { describe, it, expect } from 'vitest';
import { sanitizePostHtml } from './sanitize-post';

describe('sanitizePostHtml', () => {
  it('keeps allowed formatting tags', () => {
    const html = '<p>Hello <strong>bold</strong> and <em>italic</em></p><ul><li>one</li></ul>';
    expect(sanitizePostHtml(html)).toBe(html);
  });
  it('strips <script> tags', () => {
    const out = sanitizePostHtml('<p>ok</p><script>alert(1)</script>');
    expect(out).not.toContain('script');
    expect(out).toContain('<p>ok</p>');
  });
  it('strips on* event handlers', () => {
    const out = sanitizePostHtml('<p onclick="steal()">hi</p>');
    expect(out).not.toContain('onclick');
    expect(out).toContain('hi');
  });
  it('drops javascript: hrefs but keeps http links (with rel)', () => {
    expect(sanitizePostHtml('<a href="javascript:alert(1)">x</a>')).not.toContain('javascript:');
    const link = sanitizePostHtml('<a href="https://metplast.com">x</a>');
    expect(link).toContain('href="https://metplast.com"');
    expect(link).toContain('rel="noopener noreferrer"');
  });
  it('keeps images with src/alt only', () => {
    const out = sanitizePostHtml('<img src="/uploads/a.jpg" alt="a" onerror="x">');
    expect(out).toContain('src="/uploads/a.jpg"');
    expect(out).toContain('alt="a"');
    expect(out).not.toContain('onerror');
  });
});
