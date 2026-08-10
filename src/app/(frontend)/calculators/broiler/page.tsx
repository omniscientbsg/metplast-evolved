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

    const results: CalculatorResult[] = [
      { title: 'Total Broiler Capacity', value: r.totalBirds.toLocaleString(), highlight: true },
      { title: 'Total Shed Area', value: `${r.area.toLocaleString()} sq.ft` },
      { title: 'Area per Bird', value: `${r.areaPerBird.toFixed(2)} sq.ft` },
    ];
    // Gated behind BROILER.showSystemEstimates (off pending client sign-off).
    if (r.estimates) {
      results.push(
        { title: 'Pan Feeding System', value: `${r.estimates.feedLines} Lines` },
        { title: 'Nipple Drinking System', value: `${r.estimates.waterLines} Lines` },
        { title: 'Ventilation Estimate', value: `${r.estimates.exhaustFans} Exhaust Fans` },
        { title: 'Cooling Pad Estimate', value: `${r.estimates.coolingPadSqFt} sq.ft` },
      );
    }
    return results;
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
