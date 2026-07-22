import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { ProductForm, type ProductFormValues } from '../ProductForm';

export const dynamic = 'force-dynamic';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const s = await prisma.productSection.findUnique({ where: { id } });
  if (!s) notFound();

  const initial: ProductFormValues = {
    page: s.page,
    slug: s.slug,
    title: s.title,
    badge: s.badge ?? '',
    tag: s.tag ?? '',
    calculatorHref: s.calculatorHref ?? '',
    descriptions: (s.descriptions as string[]) ?? [],
    features: (s.features as string[]) ?? [],
    benefits: (s.benefits as string[]) ?? [],
    specs: (s.specs as { label: string; value: string }[]) ?? [],
    images: (s.images as string[]) ?? [],
    infoBlocks: (s.infoBlocks as { id?: string; heading: string; lines: string[] }[]) ?? [],
    topBlockKeys: (s.topBlockKeys as string[]) ?? [],
    bottomBlockKeys: (s.bottomBlockKeys as string[]) ?? [],
    visible: s.visible,
    sortOrder: s.sortOrder,
  };

  return <ProductForm mode="edit" id={s.id} initial={initial} />;
}
