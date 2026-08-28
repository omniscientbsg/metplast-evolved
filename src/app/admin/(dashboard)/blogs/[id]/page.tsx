import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { BlogForm, type BlogFormValues } from '../BlogForm';

export const dynamic = 'force-dynamic';

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [post, categories] = await Promise.all([
    prisma.blog.findUnique({ where: { id } }),
    prisma.blogCategory.findMany({ orderBy: { sortOrder: 'asc' }, select: { id: true, name: true } }),
  ]);
  if (!post) notFound();

  const initial: BlogFormValues = {
    title: post.title,
    slug: post.slug,
    content: post.content,
    excerpt: post.excerpt ?? '',
    image: post.image ?? '',
    author: post.author ?? '',
    categoryId: post.categoryId ?? '',
    featured: post.featured,
    published: post.published,
  };
  return <BlogForm mode="edit" id={post.id} categories={categories} initial={initial} />;
}
