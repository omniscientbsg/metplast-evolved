import { describe, it, expect } from 'vitest';
import { rowToSectionProps, sectionPropsToRow, type SectionRow } from './section-mapper';
import type { ProductSectionProps } from '@/components/ProductSection';

const props: ProductSectionProps = {
  id: 'h-type-layer',
  title: 'H-Type Layer Cage System',
  badge: 'Cage System',
  tag: undefined,
  calculatorHref: '/calculators/layer',
  description: ['Line one.', 'Line two.'],
  features: ['Feature A', 'Feature B'],
  benefits: ['Benefit A'],
  specs: [{ label: 'Cage Type', value: 'H-Type' }],
  images: ['/images/layer.jpg'],
  topBlocks: [
    { type: 'info', id: 'layer-numbers', heading: 'Box Sizes', lines: ['24 in', '18 in'] },
    { type: 'upgrade-path' },
  ],
  bottomBlocks: [{ type: 'feeder-materials' }],
};

describe('section-mapper', () => {
  it('round-trips props -> row -> props', () => {
    const row = sectionPropsToRow(props, 'layer', 0, true);
    const back = rowToSectionProps(row as unknown as SectionRow);
    expect(back).toEqual(props);
  });

  it('splits info blocks into infoBlocks and keys into topBlockKeys', () => {
    const row = sectionPropsToRow(props, 'layer', 3, true);
    expect(row.infoBlocks).toEqual([{ id: 'layer-numbers', heading: 'Box Sizes', lines: ['24 in', '18 in'] }]);
    expect(row.topBlockKeys).toEqual(['upgrade-path']);
    expect(row.bottomBlockKeys).toEqual(['feeder-materials']);
    expect(row.page).toBe('layer');
    expect(row.sortOrder).toBe(3);
  });

  it('omits empty block arrays when mapping back to props', () => {
    const row = sectionPropsToRow(
      { id: 's', title: 'T', description: ['x'] } as ProductSectionProps, 'layer', 0, true,
    );
    const back = rowToSectionProps(row as unknown as SectionRow);
    expect(back.topBlocks).toBeUndefined();
    expect(back.bottomBlocks).toBeUndefined();
    expect(back.badge).toBeUndefined();
  });

  it('drops unknown block keys defensively', () => {
    const row = { slug: 's', title: 'T', badge: null, tag: null, calculatorHref: null,
      descriptions: ['x'], features: [], benefits: [], specs: [], images: [],
      infoBlocks: [], topBlockKeys: ['not-a-real-block'], bottomBlockKeys: [] } as SectionRow;
    const back = rowToSectionProps(row);
    expect(back.topBlocks).toBeUndefined();
  });

  it('defends against malformed JSON columns', () => {
    const row = {
      slug: 's', title: 'T', badge: null, tag: null, calculatorHref: null,
      descriptions: 'not-an-array',            // wrong type
      features: null,
      benefits: undefined,
      specs: [{ label: 'ok', value: 'v' }, { label: 'no-value' }, 'garbage'], // 2nd + 3rd invalid
      images: [1, 'good.jpg', null],           // only the string survives
      infoBlocks: [{ heading: 'H', lines: ['a'] }, { lines: ['x'] }], // 2nd has no heading -> dropped
      topBlockKeys: [], bottomBlockKeys: [],
    } as unknown as SectionRow;
    const back = rowToSectionProps(row);
    expect(back.description).toEqual([]);
    expect(back.features).toEqual([]);
    expect(back.benefits).toEqual([]);
    expect(back.specs).toEqual([{ label: 'ok', value: 'v' }]);
    expect(back.images).toEqual(['good.jpg']);
    expect(back.topBlocks).toEqual([{ type: 'info', heading: 'H', lines: ['a'] }]);
  });

  it('round-trips the real content shape (info-only topBlocks + keyed bottomBlocks) losslessly', () => {
    const real: ProductSectionProps = {
      id: 'h-type-breeder', title: 'H-Type Breeder Cage System', badge: 'Breeder Management',
      description: ['A breeder cage system.'],
      features: ['F1'], benefits: ['B1'], specs: [{ label: 'Cage Type', value: 'H-Type Breeder' }],
      images: [],
      topBlocks: [{ type: 'info', id: 'breeder-boxes', heading: 'Box Sizes', lines: ['18 in'] }],
      bottomBlocks: [{ type: 'feeding-trolley' }, { type: 'auto-flush' }],
    };
    const back = rowToSectionProps(sectionPropsToRow(real, 'breeder', 0, true) as unknown as SectionRow);
    expect(back).toEqual(real);
  });
});
