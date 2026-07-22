import type { ProductSectionProps, SpecData } from '@/components/ProductSection';
import type { PageBlock } from '@/components/blocks/types';

/** The columns of a ProductSection row this mapper reads (Json columns are unknown). */
export interface SectionRow {
  slug: string;
  title: string;
  badge: string | null;
  tag: string | null;
  calculatorHref: string | null;
  descriptions: unknown;
  features: unknown;
  benefits: unknown;
  specs: unknown;
  images: unknown;
  infoBlocks: unknown;
  topBlockKeys: unknown;
  bottomBlockKeys: unknown;
}

export interface InfoBlockData {
  id?: string;
  heading: string;
  lines: string[];
}

/** The write-shape for creating/updating a row (matches Prisma data input). */
export interface SectionRowInput {
  page: string;
  slug: string;
  title: string;
  badge: string | null;
  tag: string | null;
  calculatorHref: string | null;
  descriptions: string[];
  features: string[];
  benefits: string[];
  specs: SpecData[];
  images: string[];
  infoBlocks: InfoBlockData[];
  topBlockKeys: string[];
  bottomBlockKeys: string[];
  visible: boolean;
  sortOrder: number;
}

export const SELF_CONTAINED_BLOCKS = [
  'feeder-materials', 'auto-flush', 'customization', 'upgrade-path', 'feeding-trolley', 'lighting',
] as const;
type SelfContainedKey = (typeof SELF_CONTAINED_BLOCKS)[number];

function asStringArray(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [];
}

function asSpecs(v: unknown): SpecData[] {
  if (!Array.isArray(v)) return [];
  return v
    .filter((x): x is SpecData =>
      !!x && typeof x === 'object' &&
      typeof (x as SpecData).label === 'string' && typeof (x as SpecData).value === 'string')
    .map((x) => ({ label: x.label, value: x.value }));
}

function asInfoBlocks(v: unknown): InfoBlockData[] {
  if (!Array.isArray(v)) return [];
  return v
    .filter((x): x is InfoBlockData =>
      !!x && typeof x === 'object' && typeof (x as InfoBlockData).heading === 'string')
    .map((x) => {
      const b: InfoBlockData = { heading: x.heading, lines: asStringArray(x.lines) };
      if (typeof x.id === 'string') b.id = x.id;
      return b;
    });
}

function keysToBlocks(v: unknown): PageBlock[] {
  return asStringArray(v)
    .filter((k): k is SelfContainedKey => (SELF_CONTAINED_BLOCKS as readonly string[]).includes(k))
    .map((type) => ({ type }) as PageBlock);
}

/** DB row -> ProductSectionProps (as consumed by ScrollPageTemplate). */
export function rowToSectionProps(row: SectionRow): ProductSectionProps {
  const infoAsBlocks: PageBlock[] = asInfoBlocks(row.infoBlocks).map((b) => ({
    type: 'info' as const,
    ...(b.id ? { id: b.id } : {}),
    heading: b.heading,
    lines: b.lines,
  }));
  const topBlocks = [...infoAsBlocks, ...keysToBlocks(row.topBlockKeys)];
  const bottomBlocks = keysToBlocks(row.bottomBlockKeys);

  return {
    id: row.slug,
    title: row.title,
    ...(row.badge ? { badge: row.badge } : {}),
    ...(row.tag ? { tag: row.tag } : {}),
    ...(row.calculatorHref ? { calculatorHref: row.calculatorHref } : {}),
    description: asStringArray(row.descriptions),
    features: asStringArray(row.features),
    benefits: asStringArray(row.benefits),
    specs: asSpecs(row.specs),
    images: asStringArray(row.images),
    ...(topBlocks.length ? { topBlocks } : {}),
    ...(bottomBlocks.length ? { bottomBlocks } : {}),
  };
}

/** ProductSectionProps -> DB write input. Splits blocks into info content + keys. */
export function sectionPropsToRow(
  props: ProductSectionProps,
  page: string,
  sortOrder: number,
  visible = true,
): SectionRowInput {
  const infoBlocks: InfoBlockData[] = [];
  const topBlockKeys: string[] = [];
  for (const b of props.topBlocks ?? []) {
    if (b.type === 'info') {
      infoBlocks.push({ ...(b.id ? { id: b.id } : {}), heading: b.heading, lines: b.lines });
    } else {
      topBlockKeys.push(b.type);
    }
  }
  const bottomBlockKeys = (props.bottomBlocks ?? [])
    .filter((b) => b.type !== 'info')
    .map((b) => b.type);

  return {
    page,
    slug: props.id,
    title: props.title,
    badge: props.badge ?? null,
    tag: props.tag ?? null,
    calculatorHref: props.calculatorHref ?? null,
    descriptions: props.description ?? [],
    features: props.features ?? [],
    benefits: props.benefits ?? [],
    specs: props.specs ?? [],
    images: props.images ?? [],
    infoBlocks,
    topBlockKeys,
    bottomBlockKeys,
    visible,
    sortOrder,
  };
}
