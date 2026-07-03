"use client"

import React, { useState } from 'react';
import { CalculatorShell, CalculatorResult } from '@/components/CalculatorShell';

export default function LayerPulletCalculatorPage() {
  const [layoutData, setLayoutData] = useState<{
    tiers: number;
    shedLength: number;
    usableLength: number;
    cm: number;
    ess: number;
  } | null>(null);

  const calculateLayerPullet = (values: Record<string, number>): CalculatorResult[] | { error: string } => {
    const length = values.shedLength;
    const rows = values.rows;
    const tiers = values.tiers;

    if (!length || length < 100 || length > 500) return { error: 'Shed length must be between 100 and 500 ft.' };
    
    // Metplast Engineering Math
    const CM = 7, MU = 6.3, EndKit = 5.7;
    const sectionLength = 6;
    const baseHeight = 1.26, tierHeight = 2.18, houseHeightMargin = 2.46;
    const birdsPerBox = 5; // Pullets usually have higher capacity per box

    const usableLength1 = length - (CM + MU + EndKit);
    const sectionsPerRow = Math.floor(usableLength1 / sectionLength) - 1;
    
    if (sectionsPerRow <= 0) return { error: 'Shed length too small to fit any sections.' };

    const totalSections = sectionsPerRow * rows;
    const totalBoxes = 8 * tiers * totalSections;
    const totalBirds = totalBoxes * birdsPerBox;
    const shedHeight = (tierHeight * tiers) + baseHeight + houseHeightMargin;
    const shedWidth = rows * 8.3;
    const usableLength = sectionsPerRow * sectionLength;
    const ESS = usableLength1 - usableLength;

    setLayoutData({
      tiers,
      shedLength: length,
      usableLength,
      cm: CM,
      ess: ESS
    });

    return [
      { title: 'Total Pullet Capacity', value: totalBirds.toLocaleString(), highlight: true },
      { title: 'Shed Width (Min)', value: `${Math.ceil(shedWidth)} ft` },
      { title: 'Shed Height (Min)', value: `${Math.ceil(shedHeight)} ft` },
      { title: 'Usable Length', value: `${usableLength} ft` },
      { title: 'Total Cage Sections', value: totalSections },
      { title: 'Total Cage Boxes', value: totalBoxes.toLocaleString() },
      { title: 'Feeding System', value: `${rows * tiers * 2} Lines` },
      { title: 'Drinking System', value: `${rows * tiers * 2} Lines` }
    ];
  };

  const layoutView = layoutData && [3,4,5,6].includes(layoutData.tiers) ? (
    <div className="relative inline-block w-full text-center bg-white rounded-xl p-4">
      <img 
        src={`/images/LP${layoutData.tiers}.png`} 
        alt="Layer Pullet System Layout" 
        className="max-w-full h-auto rounded-xl mx-auto mix-blend-multiply" 
      />
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute -translate-x-1/2 -translate-y-1/2 text-[10px] sm:text-xs font-bold text-white bg-dark/80 px-2 py-0.5 rounded" style={{ top: '17.6%', left: '53.5%' }}>
          {layoutData.shedLength} ft
        </div>
        <div className="absolute -translate-x-1/2 -translate-y-1/2 text-[10px] sm:text-xs font-bold text-dark bg-white/80 px-2 py-0.5 rounded shadow-sm" style={{ top: '23.6%', left: '54.3%' }}>
          {layoutData.usableLength.toFixed(2)} ft
        </div>
        <div className="absolute -translate-x-1/2 -translate-y-1/2 text-[10px] sm:text-xs font-bold text-dark bg-white/80 px-2 py-0.5 rounded shadow-sm" style={{ top: '23.6%', left: '11.8%' }}>
          {layoutData.cm} ft
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
          {
            id: 'shedLength',
            label: 'Shed Length (Feet)',
            placeholder: 'e.g., 300',
            type: 'number',
            defaultValue: 300
          },
          {
            id: 'rows',
            label: 'Rows per Shed',
            type: 'select',
            options: [
              { label: '3 Rows', value: 3 },
              { label: '4 Rows', value: 4 },
              { label: '5 Rows', value: 5 },
              { label: '6 Rows', value: 6 }
            ],
            defaultValue: 4
          },
          {
            id: 'tiers',
            label: 'Cage Tiers (Height)',
            type: 'select',
            options: [
              { label: '3 Tiers', value: 3 },
              { label: '4 Tiers', value: 4 },
              { label: '5 Tiers', value: 5 },
              { label: '6 Tiers', value: 6 }
            ],
            defaultValue: 4
          }
        ]}
        onCalculate={calculateLayerPullet}
        layoutView={layoutView}
      />
    </div>
  );
}
