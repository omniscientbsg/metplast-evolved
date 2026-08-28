import prisma from '@/lib/prisma';
import { rowToPageContent, type PageContentView } from '@/lib/content/page-content';
import { PAGE_FALLBACK } from '@/lib/content/page-fallback';
import { getAboutContent } from '@/lib/content/get-about-content';
import { AboutClient } from './AboutClient';

export const dynamic = 'force-dynamic';

export default async function AboutPage() {
  let hero: PageContentView = PAGE_FALLBACK.about;
  try {
    const pc = await prisma.pageContent.findUnique({ where: { page: 'about' } });
    if (pc) hero = rowToPageContent(pc);
  } catch (err) {
    console.error('about content query failed, using fallback:', err);
  }
  const content = await getAboutContent();
  return <AboutClient hero={hero} content={content} />;
}
