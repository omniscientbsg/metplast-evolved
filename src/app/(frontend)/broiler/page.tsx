import React from 'react';
import { ScrollPageTemplate, PageConfig } from '@/components/ScrollPageTemplate';
import { broilerConfig } from '@/lib/content/broiler';
import prisma from '@/lib/prisma';
import { rowToSectionProps, type SectionRow } from '@/lib/content/section-mapper';

export const metadata = {
  title: 'Broiler Solutions | Metplast Industries',
  description: 'Broiler poultry systems — deep litter housing, pan feeding, nipple drinking with auto flush, curtains, and H-Type broiler cage systems for practical shed management.',
};

export const dynamic = 'force-dynamic';

export default async function BroilerPage() {
  let sections = broilerConfig.sections;
  try {
    const rows = await prisma.productSection.findMany({
      where: { page: 'broiler', visible: true },
      orderBy: { sortOrder: 'asc' },
    });
    // Fall back to the code config if the DB has not been migrated yet, so the
    // page is never blank during cutover.
    if (rows.length > 0) sections = rows.map((r) => rowToSectionProps(r as unknown as SectionRow));
  } catch (err) {
    console.error('broiler sections query failed, using code config:', err);
  }

  const config: PageConfig = { ...broilerConfig, sections };
  return <ScrollPageTemplate config={config} />;
}
