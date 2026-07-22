import React from 'react';
import { ScrollPageTemplate, PageConfig } from '@/components/ScrollPageTemplate';
import { layerConfig } from '@/lib/content/layer';
import prisma from '@/lib/prisma';
import { rowToSectionProps, type SectionRow } from '@/lib/content/section-mapper';

export const metadata = {
  title: 'Layer Cage Solutions | Metplast Industries',
  description: 'H-Type and S-Frame layer cage systems engineered for uniform feed access, clean egg handling, stronger cage life, and consistent layer production.',
};

export const dynamic = 'force-dynamic';

export default async function LayerPage() {
  let sections = layerConfig.sections;
  try {
    const rows = await prisma.productSection.findMany({
      where: { page: 'layer', visible: true },
      orderBy: { sortOrder: 'asc' },
    });
    // Fall back to the code config if the DB has not been migrated yet, so the
    // page is never blank during cutover.
    if (rows.length > 0) sections = rows.map((r) => rowToSectionProps(r as unknown as SectionRow));
  } catch (err) {
    console.error('layer sections query failed, using code config:', err);
  }

  const config: PageConfig = { ...layerConfig, sections };
  return <ScrollPageTemplate config={config} />;
}
