import prisma from '@/lib/prisma';
import { rowToPageContent, type PageContentView } from '@/lib/content/page-content';
import { PAGE_FALLBACK } from '@/lib/content/page-fallback';
import { getHomeContent } from '@/lib/content/get-home-content';
import type { HomeContent } from '@/lib/content/home-content';
import { HomeClient } from './HomeClient';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let hero: PageContentView = PAGE_FALLBACK.home;
  try {
    const pc = await prisma.pageContent.findUnique({ where: { page: 'home' } });
    if (pc) hero = rowToPageContent(pc);
  } catch (err) {
    console.error('home content query failed, using fallback:', err);
  }
  const content: HomeContent = await getHomeContent();
  return <HomeClient hero={hero} content={content} />;
}
