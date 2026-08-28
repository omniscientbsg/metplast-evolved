import React from 'react';
import { ScrollPageTemplate, PageConfig } from '@/components/ScrollPageTemplate';
import { environmentalControlConfig } from '@/lib/content/environmental-control';
import prisma from '@/lib/prisma';
import { rowToSectionProps, type SectionRow } from '@/lib/content/section-mapper';
import { rowToPageContent, type PageContentView } from '@/lib/content/page-content';
import { PAGE_FALLBACK } from '@/lib/content/page-fallback';

export const metadata = {
  title: 'Environmental Control Systems | Metplast Industries',
  description: 'Precision climate management systems, including cooling pads, exhaust fans, and smart control panels, to maintain optimal poultry shed conditions.',
};

export const dynamic = 'force-dynamic';

const PAGE = 'environmental-control';

export default async function EnvironmentalControlPage() {
  let sections = environmentalControlConfig.sections;
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
    ...environmentalControlConfig,
    hero: {
      title: content.title,
      subtitle: content.subtitle,
      image: content.image ?? environmentalControlConfig.hero.image,
      ctaPrimary: content.ctaPrimary ?? environmentalControlConfig.hero.ctaPrimary,
      ctaSecondary: content.ctaSecondary ?? environmentalControlConfig.hero.ctaSecondary,
    },
    intro: content.intro,
    crossLinks: content.crossLinks,
    sections,
  };
  return <ScrollPageTemplate config={config} />;
}
