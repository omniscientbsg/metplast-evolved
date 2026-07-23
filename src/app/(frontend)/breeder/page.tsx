import React from 'react';
import { ScrollPageTemplate, PageConfig } from '@/components/ScrollPageTemplate';
import { breederConfig } from '@/lib/content/breeder';
import prisma from '@/lib/prisma';
import { rowToSectionProps, type SectionRow } from '@/lib/content/section-mapper';
import { rowToPageContent, type PageContentView } from '@/lib/content/page-content';
import { PAGE_FALLBACK } from '@/lib/content/page-fallback';

export const metadata = {
  title: 'Breeder Solutions | Metplast Industries',
  description: 'H-Type breeder cage systems designed for male-female management, uniform feeding, cleaner hatching eggs, and easier AI workflow.',
};

export const dynamic = 'force-dynamic';

const PAGE = 'breeder';

export default async function BreederPage() {
  let sections = breederConfig.sections;
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
    ...breederConfig,
    hero: {
      title: content.title,
      subtitle: content.subtitle,
      image: content.image ?? breederConfig.hero.image,
      ctaPrimary: content.ctaPrimary ?? breederConfig.hero.ctaPrimary,
      ctaSecondary: content.ctaSecondary ?? breederConfig.hero.ctaSecondary,
    },
    intro: content.intro,
    crossLinks: content.crossLinks,
    sections,
  };
  return <ScrollPageTemplate config={config} />;
}
