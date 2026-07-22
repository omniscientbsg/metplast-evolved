import { PrismaClient } from '@prisma/client';
import { FALLBACK_CATEGORIES, FALLBACK_ITEMS } from '../src/app/(frontend)/gallery/gallery-fallback';

const prisma = new PrismaClient();

async function main() {
  // 1) Categories (unique by name), in filter order.
  const idByName = new Map<string, string>();
  for (let i = 0; i < FALLBACK_CATEGORIES.length; i++) {
    const name = FALLBACK_CATEGORIES[i].name;
    const cat = await prisma.galleryCategory.upsert({
      where: { name },
      update: { sortOrder: i },
      create: { name, sortOrder: i },
    });
    idByName.set(name, cat.id);
    console.log(`✓ category ${name} (order ${i})`);
  }

  // 2) Items — find by src, then update or create (src is not a DB unique).
  for (let i = 0; i < FALLBACK_ITEMS.length; i++) {
    const it = FALLBACK_ITEMS[i];
    const data = {
      src: it.src,
      caption: it.caption,
      videoUrl: it.videoUrl,
      featured: it.featured,
      visible: true,
      sortOrder: i,
      categoryId: it.category ? idByName.get(it.category) ?? null : null,
    };
    const existing = await prisma.galleryItem.findFirst({ where: { src: it.src } });
    if (existing) {
      await prisma.galleryItem.update({ where: { id: existing.id }, data });
    } else {
      await prisma.galleryItem.create({ data });
    }
    console.log(`✓ item ${it.src} (order ${i})`);
  }

  const [c, n] = await Promise.all([prisma.galleryCategory.count(), prisma.galleryItem.count()]);
  console.log(`Done. ${c} categories, ${n} items.`);
}

main()
  .catch((e) => { console.error(e); process.exitCode = 1; })
  .finally(async () => { await prisma.$disconnect(); });
