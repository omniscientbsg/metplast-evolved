import React from 'react';
import { ScrollPageTemplate, PageConfig } from '@/components/ScrollPageTemplate';
import { layerConfig } from '@/lib/content/layer';
import prisma from '@/lib/prisma';
import { rowToSectionProps, type SectionRow } from '@/lib/content/section-mapper';
import { rowToPageContent, type PageContentView } from '@/lib/content/page-content';
import { PAGE_FALLBACK } from '@/lib/content/page-fallback';

export const metadata = {
  title: 'Layer Cage Solutions | Metplast Industries',
  description: 'H-Type and S-Frame layer cage systems engineered for uniform feed access, clean egg handling, stronger cage life, and consistent layer production.',
};

export const dynamic = 'force-dynamic';

const PAGE = 'layer';

export default async function LayerPage() {
  let sections = layerConfig.sections;
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
    ...layerConfig,
    hero: {
      title: content.title,
      subtitle: content.subtitle,
      image: content.image ?? layerConfig.hero.image,
      ctaPrimary: content.ctaPrimary ?? layerConfig.hero.ctaPrimary,
      ctaSecondary: content.ctaSecondary ?? layerConfig.hero.ctaSecondary,
    },
    intro: content.intro,
    crossLinks: content.crossLinks,
    sections,
  };
  return <ScrollPageTemplate config={config} />;
}
