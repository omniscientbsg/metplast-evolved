import React from 'react';
import { ScrollPageTemplate, PageConfig } from '@/components/ScrollPageTemplate';
import { feedSilosConfig } from '@/lib/content/feed-silos';
import prisma from '@/lib/prisma';
import { rowToSectionProps, type SectionRow } from '@/lib/content/section-mapper';

export const metadata = {
  title: 'Feed Silos & Auger Systems | Metplast Industries',
  description: 'Galvanized steel feed silos designed for secure bulk storage, weather protection, and automated distribution across your poultry farm.',
};

export const dynamic = 'force-dynamic';

export default async function FeedSilosPage() {
  let sections = feedSilosConfig.sections;
  try {
    const rows = await prisma.productSection.findMany({
      where: { page: 'feed-silos', visible: true },
      orderBy: { sortOrder: 'asc' },
    });
    // Fall back to the code config if the DB has not been migrated yet, so the
    // page is never blank during cutover.
    if (rows.length > 0) sections = rows.map((r) => rowToSectionProps(r as unknown as SectionRow));
  } catch (err) {
    console.error('feed-silos sections query failed, using code config:', err);
  }

  const config: PageConfig = { ...feedSilosConfig, sections };
  return <ScrollPageTemplate config={config} />;
}
