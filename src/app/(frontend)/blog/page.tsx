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
        include: { category: { select: { name: true } } },
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
