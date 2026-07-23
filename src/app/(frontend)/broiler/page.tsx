import React from 'react';
import { ScrollPageTemplate, PageConfig } from '@/components/ScrollPageTemplate';
import { broilerConfig } from '@/lib/content/broiler';
import prisma from '@/lib/prisma';
import { rowToSectionProps, type SectionRow } from '@/lib/content/section-mapper';
import { rowToPageContent, type PageContentView } from '@/lib/content/page-content';
import { PAGE_FALLBACK } from '@/lib/content/page-fallback';

export const metadata = {
  title: 'Broiler Solutions | Metplast Industries',
  description: 'Broiler poultry systems — deep litter housing, pan feeding, nipple drinking with auto flush, curtains, and H-Type broiler cage systems for practical shed management.',
};

export const dynamic = 'force-dynamic';

const PAGE = 'broiler';

export default async function BroilerPage() {
  let sections = broilerConfig.sections;
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
    ...broilerConfig,
    hero: {
      title: content.title,
      subtitle: content.subtitle,
      image: content.image ?? broilerConfig.hero.image,
      ctaPrimary: content.ctaPrimary ?? broilerConfig.hero.ctaPrimary,
      ctaSecondary: content.ctaSecondary ?? broilerConfig.hero.ctaSecondary,
    },
    intro: content.intro,
    crossLinks: content.crossLinks,
    sections,
  };
  return <ScrollPageTemplate config={config} />;
}
