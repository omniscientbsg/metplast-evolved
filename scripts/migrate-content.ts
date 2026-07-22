import { PrismaClient } from '@prisma/client';
import { sectionPropsToRow } from '../src/lib/content/section-mapper';
import { layerConfig } from '../src/lib/content/layer';
import { breederConfig } from '../src/lib/content/breeder';
import { broilerConfig } from '../src/lib/content/broiler';
import { environmentalControlConfig } from '../src/lib/content/environmental-control';
import { feedSilosConfig } from '../src/lib/content/feed-silos';

const prisma = new PrismaClient();

const PAGES = [
  { page: 'layer', sections: layerConfig.sections },
  { page: 'breeder', sections: breederConfig.sections },
  { page: 'broiler', sections: broilerConfig.sections },
  { page: 'environmental-control', sections: environmentalControlConfig.sections },
  { page: 'feed-silos', sections: feedSilosConfig.sections },
];

async function main() {
  for (const { page, sections } of PAGES) {
    for (let i = 0; i < sections.length; i++) {
      const row = sectionPropsToRow(sections[i], page, i, true);
      await prisma.productSection.upsert({
        where: { slug: row.slug },
        update: row,
        create: row,
      });
      console.log(`✓ ${page}/${row.slug} (order ${i})`);
    }
  }
  const total = await prisma.productSection.count();
  console.log(`Done. ${total} sections in DB.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
