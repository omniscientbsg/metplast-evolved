/** Pure parser for the `footer_links` textarea setting. No DB/React imports. */

export interface FooterLink { label: string; href: string }

/**
 * Parse a "Label | /href" per-line textarea into links. Splits on the FIRST
 * pipe (so an href may itself contain `|`), trims both parts, and drops any
 * malformed row (no pipe, or an empty label/href).
 */
export function parseFooterLinks(text: string): FooterLink[] {
  return text
    .split('\n')
    .map((line): FooterLink | null => {
      const i = line.indexOf('|');
      if (i === -1) return null;
      const label = line.slice(0, i).trim();
      const href = line.slice(i + 1).trim();
      return label && href ? { label, href } : null;
    })
    .filter((x): x is FooterLink => x !== null);
}
