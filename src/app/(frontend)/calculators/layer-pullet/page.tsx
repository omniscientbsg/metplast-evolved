"use client"

import React, { useState } from 'react';
import { CalculatorShell, CalculatorResult } from '@/components/CalculatorShell';
import { computeLayerPullet, LAYER_PULLET } from '@/lib/calculators/layer-pullet';

type LayoutData = { tiers: number; shedLength: number; usableLength: number; ess: number };

export default function LayerPulletCalculatorPage() {
  const [layoutData, setLayoutData] = useState<LayoutData | null>(null);
  const [imgError, setImgError] = useState(false);

  const calculate = (values: Record<string, number>): CalculatorResult[] | { error: string } => {
    const r = computeLayerPullet({
      shedLength: values.shedLength,
      rows: values.rows,
      tiers: values.tiers,
      birdsPerBox: values.birdsPerBox,
    });
    if ('error' in r) return r;

    setImgError(false);
    setLayoutData({ tiers: values.tiers, shedLength: values.shedLength, usableLength: r.usableLength, ess: r.ess });

    // Same rows as Layer, but NO ESS row (original showed ESS only on the diagram).
    return [
      { title: 'Sections per Row', value: r.sectionsPerRow },
      { title: 'Total Sections', value: r.totalSections.toLocaleString() },
      { title: 'Boxes per Section', value: r.boxesPerSection },
      { title: 'Total Boxes', value: r.totalBoxes.toLocaleString() },
      { title: 'Shed Height', value: `${r.shedHeight.toFixed(2)} ft` },
      { title: 'Required Shed Width', value: `${r.shedWidth} ft` },
      { title: 'Area per Bird', value: `${r.areaPerBirdSqIn.toFixed(2)} sq. in` },
      { title: 'Birds per Shed', value: r.birdsPerShed.toLocaleString(), highlight: true },
    ];
  };

  const layoutView = layoutData && !imgError && [3, 4, 5, 6].includes(layoutData.tiers) ? (
    <div className="relative inline-block w-full text-center bg-white rounded-xl p-4">
      <img
        src={LAYER_PULLET.diagramSrc(layoutData.tiers)}
        alt="Layer Pullet System Layout"
        onError={() => setImgError(true)}
        className="max-w-full h-auto rounded-xl mx-auto mix-blend-multiply"
      />
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute -translate-x-1/2 -translate-y-1/2 text-[10px] sm:text-xs font-bold text-white bg-dark/80 px-2 py-0.5 rounded" style={{ top: '17.6%', left: '53.5%' }}>
          {layoutData.shedLength} ft
        </div>
        <div className="absolute -translate-x-1/2 -translate-y-1/2 text-[10px] sm:text-xs font-bold text-dark bg-white/80 px-2 py-0.5 rounded shadow-sm" style={{ top: '23.3%', left: '54.3%' }}>
          {layoutData.usableLength.toFixed(2)} ft
        </div>
        <div className="absolute -translate-x-1/2 -translate-y-1/2 text-[10px] sm:text-xs font-bold text-dark bg-white/80 px-2 py-0.5 rounded shadow-sm" style={{ top: '23.6%', left: '11.8%' }}>
          7 ft
        </div>
        <div className="absolute -translate-x-1/2 -translate-y-1/2 text-[10px] sm:text-xs font-bold text-dark bg-white/80 px-2 py-0.5 rounded shadow-sm" style={{ top: '23.6%', left: '86.2%' }}>
          {layoutData.ess.toFixed(1)} ft
        </div>
      </div>
    </div>
  ) : null;

  return (
    <div className="bg-[var(--bg)] min-h-screen">
      <CalculatorShell
        title="Layer Pullet Calculator"
        description="Calculate capacity and layout for layer pullet rearing farms prior to production stage."
        systemType="Layer Pullet System"
        inputs={[
          { id: 'shedLength', label: 'Shed Length (Feet)', placeholder: 'e.g., 300', type: 'number', defaultValue: 300 },
          { id: 'rows', label: 'Rows per Shed (1–8)', placeholder: 'e.g., 4', type: 'number', defaultValue: 4 },
          { id: 'tiers', label: 'Cage Tiers (3–6)', placeholder: 'e.g., 4', type: 'number', defaultValue: 4 },
          {
            id: 'birdsPerBox',
            label: 'Birds per Box',
            type: 'select',
            defaultValue: 24,
            options: LAYER_PULLET.birdsPerBoxOptions.map((b) => ({ label: `${b} Birds`, value: b })),
          },
        ]}
        onCalculate={calculate}
        layoutView={layoutView}
      />
    </div>
  );
}
