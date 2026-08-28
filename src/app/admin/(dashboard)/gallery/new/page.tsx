import prisma from '@/lib/prisma';
import { GalleryForm } from '../GalleryForm';

export const dynamic = 'force-dynamic';

export default async function NewGalleryItemPage() {
  const categories = await prisma.galleryCategory.findMany({ orderBy: { sortOrder: 'asc' }, select: { id: true, name: true } });
  return <GalleryForm mode="create" categories={categories} />;
}
