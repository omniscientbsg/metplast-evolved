import { PrismaClient, Prisma } from '@prisma/client';
import { PAGE_DEFS, pageContentToRow } from '../src/lib/content/page-content';
import { PAGE_FALLBACK } from '../src/lib/content/page-fallback';

const prisma = new PrismaClient();

async function main() {
  for (const def of PAGE_DEFS) {
    const view = PAGE_FALLBACK[def.page];
    if (!view) { console.warn(`no fallback for ${def.page}, skipping`); continue; }
    const w = pageContentToRow(def.page, view);
    const data = {
      heroEyebrow: w.heroEyebrow,
      heroTitle: w.heroTitle,
      heroTitleAccent: w.heroTitleAccent,
      heroSubtitle: w.heroSubtitle,
      heroImage: w.heroImage,
      heroCtaPrimary: (w.heroCtaPrimary ?? Prisma.JsonNull) as unknown as Prisma.InputJsonValue,
      heroCtaSecondary: (w.heroCtaSecondary ?? Prisma.JsonNull) as unknown as Prisma.InputJsonValue,
      intro: w.intro as unknown as Prisma.InputJsonValue,
      crossLinks: w.crossLinks as unknown as Prisma.InputJsonValue,
    };
    await prisma.pageContent.upsert({ where: { page: def.page }, create: { page: def.page, ...data }, update: data });
    console.log(`upserted page content: ${def.page}`);
  }
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
