/** Pure helpers for blog rendering — unit-tested, no DB/React imports. */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** URL-safe slug: lowercase, non-alphanumerics -> hyphens, collapse/trim. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Featured-first, then newest-first. Stable, non-mutating. */
export function sortPosts<T extends { featured: boolean; createdAt: Date }>(rows: T[]): T[] {
  return [...rows].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return b.createdAt.getTime() - a.createdAt.getTime();
  });
}

/** Deterministic "Mon D, YYYY" (avoids toLocaleDateString tz/locale drift). */
export function formatPostDate(d: Date): string {
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

/** Row shape the listing reads (Blog row + joined category name). */
export interface BlogCardRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  image: string | null;
  author: string | null;
  featured: boolean;
  createdAt: Date;
  category: { name: string } | null;
}

/** Flat shape the listing client consumes. */
export interface BlogCard {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  image: string | null;
  author: string | null;
  featured: boolean;
  date: string;
  category: string | null;
}

export function rowToBlogCard(row: BlogCardRow): BlogCard {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    image: row.image,
    author: row.author,
    featured: row.featured,
    date: formatPostDate(row.createdAt),
    category: row.category ? row.category.name : null,
  };
}
