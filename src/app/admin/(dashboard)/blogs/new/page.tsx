import prisma from '@/lib/prisma';
import { BlogForm } from '../BlogForm';

export const dynamic = 'force-dynamic';

export default async function NewBlogPage() {
  const categories = await prisma.blogCategory.findMany({ orderBy: { sortOrder: 'asc' }, select: { id: true, name: true } });
  return <BlogForm mode="create" categories={categories} />;
}
