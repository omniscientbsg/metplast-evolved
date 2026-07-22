import React from 'react';
import { ScrollPageTemplate, PageConfig } from '@/components/ScrollPageTemplate';
import { environmentalControlConfig } from '@/lib/content/environmental-control';
import prisma from '@/lib/prisma';
import { rowToSectionProps, type SectionRow } from '@/lib/content/section-mapper';

export const metadata = {
  title: 'Environmental Control Systems | Metplast Industries',
  description: 'Precision climate management systems, including cooling pads, exhaust fans, and smart control panels, to maintain optimal poultry shed conditions.',
};

export const dynamic = 'force-dynamic';

export default async function EnvironmentalControlPage() {
  let sections = environmentalControlConfig.sections;
  try {
    const rows = await prisma.productSection.findMany({
      where: { page: 'environmental-control', visible: true },
      orderBy: { sortOrder: 'asc' },
    });
    // Fall back to the code config if the DB has not been migrated yet, so the
    // page is never blank during cutover.
    if (rows.length > 0) sections = rows.map((r) => rowToSectionProps(r as unknown as SectionRow));
  } catch (err) {
    console.error('environmental-control sections query failed, using code config:', err);
  }

  const config: PageConfig = { ...environmentalControlConfig, sections };
  return <ScrollPageTemplate config={config} />;
}
