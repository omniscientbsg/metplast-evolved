import type { SpecData } from '@/components/ProductSection';
import type { InfoBlockData } from '@/lib/content/section-mapper';

export interface SectionPayload {
  page?: string;
  slug?: string;
  title?: string;
  badge?: string | null;
  tag?: string | null;
  calculatorHref?: string | null;
  descriptions?: string[];
  features?: string[];
  benefits?: string[];
  specs?: SpecData[];
  images?: string[];
  infoBlocks?: InfoBlockData[];
  topBlockKeys?: string[];
  bottomBlockKeys?: string[];
  visible?: boolean;
  sortOrder?: number;
}

/** Coerce an admin request body into a full Prisma data object with safe defaults. */
export function normalizeSectionPayload(b: SectionPayload) {
  return {
    page: b.page ?? '',
    slug: b.slug ?? '',
    title: b.title ?? '',
    badge: b.badge ?? null,
    tag: b.tag ?? null,
    calculatorHref: b.calculatorHref ?? null,
    descriptions: b.descriptions ?? [],
    features: b.features ?? [],
    benefits: b.benefits ?? [],
    specs: b.specs ?? [],
    images: b.images ?? [],
    infoBlocks: b.infoBlocks ?? [],
    topBlockKeys: b.topBlockKeys ?? [],
    bottomBlockKeys: b.bottomBlockKeys ?? [],
    visible: b.visible ?? true,
    sortOrder: b.sortOrder ?? 0,
  };
}
