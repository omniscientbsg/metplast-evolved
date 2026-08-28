"use client"

import React, { useState } from 'react';
import { CalculatorShell, CalculatorResult } from '@/components/CalculatorShell';
import { computeBreederPullet, BREEDER_PULLET } from '@/lib/calculators/breeder-pullet';

type LayoutData = { tiers: number; shedLength: number; usableLength: number; cm: number; ess: number };

export default function BreederPulletCalculatorPage() {
  const [layoutData, setLayoutData] = useState<LayoutData | null>(null);

  const calculate = (values: Record<string, number>): CalculatorResult[] | { error: string } => {
    const r = computeBreederPullet({ shedLength: values.shedLength, rows: values.rows, tiers: values.tiers });
    if ('error' in r) return r;

    setLayoutData({
      tiers: values.tiers,
      shedLength: values.shedLength,
      usableLength: r.usableLength,
      cm: BREEDER_PULLET.CM,
      ess: r.ess,
    });

    return [
      { title: 'Total Breeder Pullet Capacity', value: r.totalBirds.toLocaleString(), highlight: true },
      { title: 'Shed Width (Min)', value: `${Math.ceil(r.shedWidth)} ft` },
      { title: 'Shed Height (Min)', value: `${Math.ceil(r.shedHeight)} ft` },
      { title: 'Usable Length', value: `${r.usableLength} ft` },
      { title: 'Total Cage Sections', value: r.totalSections },
      { title: 'Total Cage Boxes', value: r.totalBoxes.toLocaleString() },
      { title: 'Feeding System', value: `${values.rows * values.tiers * 2} Lines` },
      { title: 'Drinking System', value: `${values.rows * values.tiers * 2} Lines` },
    ];
  };

  const layoutView = layoutData && [2, 3, 4].includes(layoutData.tiers) ? (
    <div className="relative inline-block w-full text-center bg-white rounded-xl p-4">
      <img
        src={`/images/Breeder-Pullet-T${layoutData.tiers}.png`}
        alt="Breeder Pullet System Layout"
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
        title="Breeder Pullet Calculator"
        description="Calculate capacity and layout for breeder pullet rearing farms prior to production stage."
        systemType="Breeder Pullet System"
        inputs={[
          { id: 'shedLength', label: 'Shed Length (Feet)', placeholder: 'e.g., 300', type: 'number', defaultValue: 300 },
          { id: 'rows', label: 'Rows per Shed (1–9)', placeholder: 'e.g., 4', type: 'number', defaultValue: 4 },
          {
            id: 'tiers',
            label: 'Cage Tiers (Height)',
            type: 'select',
            defaultValue: 3,
            options: [
              { label: '2 Tiers', value: 2 },
              { label: '3 Tiers', value: 3 },
              { label: '4 Tiers', value: 4 },
            ],
          },
        ]}
        onCalculate={calculate}
        layoutView={layoutView}
      />
    </div>
  );
}
