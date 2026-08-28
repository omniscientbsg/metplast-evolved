import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getPageDef, rowToPageContent, type PageContentView } from '@/lib/content/page-content';
import { PAGE_FALLBACK } from '@/lib/content/page-fallback';
import { PageContentForm } from '../PageContentForm';

export const dynamic = 'force-dynamic';

export default async function EditPageContentPage({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const def = getPageDef(page);
  if (!def) notFound();

  let initial: PageContentView = PAGE_FALLBACK[page];
  try {
    const row = await prisma.pageContent.findUnique({ where: { page } });
    if (row) initial = rowToPageContent(row);
  } catch (err) {
    console.error('load page content failed, using fallback:', err);
  }
  return <PageContentForm def={def} initial={initial} />;
}
