"use client"

import React from 'react';
import { CalculatorShell, CalculatorResult } from '@/components/CalculatorShell';
import { computeBroiler, BROILER } from '@/lib/calculators/broiler';

export default function BroilerCalculatorPage() {
  const calculate = (values: Record<string, number>): CalculatorResult[] | { error: string } => {
    const r = computeBroiler({
      shedLength: values.shedLength,
      shedWidth: values.shedWidth,
      areaPerBird: values.areaPerBird,
    });
    if ('error' in r) return r;

    // Original page had exactly two outputs: total shed area, total birds.
    return [
      { title: 'Total Shed Area', value: `${r.area.toFixed(2)} sq.ft` },
      { title: 'Total Birds per Shed', value: r.totalBirds.toLocaleString(), highlight: true },
    ];
  };

  return (
    <div className="bg-[var(--bg)] min-h-screen">
      <CalculatorShell
        title="Broiler Shed Calculator"
        description="Estimate deep-litter broiler capacity from your shed dimensions and stocking density."
        systemType="Broiler Deep Litter System"
        inputs={[
          { id: 'shedLength', label: 'Shed Length (Feet)', placeholder: 'e.g., 200', type: 'number', defaultValue: 200 },
          { id: 'shedWidth', label: 'Shed Width (Feet)', placeholder: 'e.g., 40', type: 'number', defaultValue: 40 },
          {
            id: 'areaPerBird',
            label: 'Area per Bird (sq.ft)',
            type: 'select',
            defaultValue: 0.65,
            options: BROILER.areaPerBirdOptions.map((a) => ({ label: `${a.toFixed(2)} sq.ft`, value: a })),
          },
        ]}
        onCalculate={calculate}
      />
    </div>
  );
}
