import React from 'react';
import { ScrollPageTemplate, PageConfig } from '@/components/ScrollPageTemplate';
import { feedSilosConfig } from '@/lib/content/feed-silos';
import prisma from '@/lib/prisma';
import { rowToSectionProps, type SectionRow } from '@/lib/content/section-mapper';
import { rowToPageContent, type PageContentView } from '@/lib/content/page-content';
import { PAGE_FALLBACK } from '@/lib/content/page-fallback';

export const metadata = {
  title: 'Feed Silos & Auger Systems | Metplast Industries',
  description: 'Galvanized steel feed silos designed for secure bulk storage, weather protection, and automated distribution across your poultry farm.',
};

export const dynamic = 'force-dynamic';

const PAGE = 'feed-silos';

export default async function FeedSilosPage() {
  let sections = feedSilosConfig.sections;
  let content: PageContentView = PAGE_FALLBACK[PAGE];
  try {
    const [rows, pc] = await Promise.all([
      prisma.productSection.findMany({ where: { page: PAGE, visible: true }, orderBy: { sortOrder: 'asc' } }),
      prisma.pageContent.findUnique({ where: { page: PAGE } }),
    ]);
    if (rows.length > 0) sections = rows.map((r) => rowToSectionProps(r as unknown as SectionRow));
    if (pc) content = rowToPageContent(pc);
  } catch (err) {
    console.error(`${PAGE} content query failed, using code config:`, err);
  }

  const config: PageConfig = {
    ...feedSilosConfig,
    hero: {
      title: content.title,
      subtitle: content.subtitle,
      image: content.image ?? feedSilosConfig.hero.image,
      ctaPrimary: content.ctaPrimary ?? feedSilosConfig.hero.ctaPrimary,
      ctaSecondary: content.ctaSecondary ?? feedSilosConfig.hero.ctaSecondary,
    },
    intro: content.intro,
    crossLinks: content.crossLinks,
    sections,
  };
  return <ScrollPageTemplate config={config} />;
}
