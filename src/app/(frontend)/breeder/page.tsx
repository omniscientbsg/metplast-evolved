import React from 'react';
import { ScrollPageTemplate, PageConfig } from '@/components/ScrollPageTemplate';
import { breederConfig } from '@/lib/content/breeder';
import prisma from '@/lib/prisma';
import { rowToSectionProps, type SectionRow } from '@/lib/content/section-mapper';

export const metadata = {
  title: 'Breeder Solutions | Metplast Industries',
  description: 'H-Type breeder cage systems designed for male-female management, uniform feeding, cleaner hatching eggs, and easier AI workflow.',
};

export const dynamic = 'force-dynamic';

export default async function BreederPage() {
  let sections = breederConfig.sections;
  try {
    const rows = await prisma.productSection.findMany({
      where: { page: 'breeder', visible: true },
      orderBy: { sortOrder: 'asc' },
    });
    // Fall back to the code config if the DB has not been migrated yet, so the
    // page is never blank during cutover.
    if (rows.length > 0) sections = rows.map((r) => rowToSectionProps(r as unknown as SectionRow));
  } catch (err) {
    console.error('breeder sections query failed, using code config:', err);
  }

  const config: PageConfig = { ...breederConfig, sections };
  return <ScrollPageTemplate config={config} />;
}
