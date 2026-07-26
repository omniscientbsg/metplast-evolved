import prisma from '@/lib/prisma';
import { rowToPageContent, type PageContentView } from '@/lib/content/page-content';
import { PAGE_FALLBACK } from '@/lib/content/page-fallback';
import { getHousingContent } from '@/lib/content/get-housing-content';
import { HousingClient } from './HousingClient';

export const dynamic = 'force-dynamic';

export default async function HousingPage() {
  let hero: PageContentView = PAGE_FALLBACK.housing;
  try {
    const pc = await prisma.pageContent.findUnique({ where: { page: 'housing' } });
    if (pc) hero = rowToPageContent(pc);
  } catch (err) {
    console.error('housing content query failed, using fallback:', err);
  }
  const content = await getHousingContent();
  return <HousingClient hero={hero} content={content} />;
}
