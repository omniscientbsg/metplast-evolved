import React from 'react';
import prisma from '@/lib/prisma';
import { GalleryClient } from './GalleryClient';
import { rowToGalleryView } from '@/lib/content/gallery-view';
import { FALLBACK_ITEMS, FALLBACK_CATEGORIES } from './gallery-fallback';

export const metadata = {
  title: 'Projects & Gallery | Metplast Industries',
  description: 'Real poultry housing, cage systems, silos, ventilation, and installation work by Metplast Industries.',
};

export const dynamic = 'force-dynamic';

export default async function GalleryPage() {
  let items = FALLBACK_ITEMS;
  let categories = FALLBACK_CATEGORIES.map((c) => c.name);
  try {
    const [rows, cats] = await Promise.all([
      prisma.galleryItem.findMany({
        where: { visible: true },
        orderBy: { sortOrder: 'asc' },
        include: { category: { select: { name: true } } },
      }),
      prisma.galleryCategory.findMany({ orderBy: { sortOrder: 'asc' }, select: { name: true } }),
    ]);
    if (rows.length > 0) {
      items = rows.map(rowToGalleryView);
      categories = cats.map((c) => c.name);
    }
  } catch (err) {
    console.error('gallery query failed, using fallback:', err);
  }

  return <GalleryClient items={items} categories={categories} />;
}
