import prisma from '@/lib/prisma';
import { BlogClient } from './BlogClient';
import { sortPosts, rowToBlogCard, type BlogCard } from '@/lib/content/blog-view';

export const metadata = {
  title: 'Blog & News | Metplast Industries',
  description: 'Poultry housing insights, product updates, and news from Metplast Industries.',
};

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  let posts: BlogCard[] = [];
  let categories: string[] = [];
  try {
    const [rows, cats] = await Promise.all([
      prisma.blog.findMany({
        where: { published: true },
        // Card fields only — the full @db.Text `content` body is not needed on
        // the listing (rowToBlogCard drops it), so don't pull it per request.
        select: {
          id: true, slug: true, title: true, excerpt: true, image: true,
          author: true, featured: true, createdAt: true,
          category: { select: { name: true } },
        },
      }),
      prisma.blogCategory.findMany({ orderBy: { sortOrder: 'asc' }, select: { name: true } }),
    ]);
    posts = sortPosts(rows).map(rowToBlogCard);
    categories = cats.map((c) => c.name);
  } catch (err) {
    console.error('blog query failed:', err);
  }

  return <BlogClient posts={posts} categories={categories} />;
}
