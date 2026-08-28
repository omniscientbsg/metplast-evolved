import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { GalleryForm, type GalleryFormValues } from '../GalleryForm';

export const dynamic = 'force-dynamic';

export default async function EditGalleryItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [item, categories] = await Promise.all([
    prisma.galleryItem.findUnique({ where: { id } }),
    prisma.galleryCategory.findMany({ orderBy: { sortOrder: 'asc' }, select: { id: true, name: true } }),
  ]);
  if (!item) notFound();

  const initial: GalleryFormValues = {
    src: item.src,
    caption: item.caption,
    categoryId: item.categoryId ?? '',
    videoUrl: item.videoUrl ?? '',
    featured: item.featured,
    visible: item.visible,
  };
  return <GalleryForm mode="edit" id={item.id} categories={categories} initial={initial} />;
}
