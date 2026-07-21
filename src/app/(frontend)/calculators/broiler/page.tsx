"use client"

import React from 'react';
import { CalculatorShell, CalculatorResult } from '@/components/CalculatorShell';

export default function BroilerCalculatorPage() {
  const calculateBroiler = (values: Record<string, number>): CalculatorResult[] | { error: string } => {
    const length = values.shedLength;
    const width = values.shedWidth;

    if (!length || length < 50 || length > 500) return { error: 'Shed length must be between 50 and 500 ft.' };
    if (!width || width < 20 || width > 100) return { error: 'Shed width must be between 20 and 100 ft.' };
    
    // Metplast Engineering Math for Deep Litter Broilers
    const area = length * width;
    
    // Deep litter broiler density is typically 1.0 - 1.2 sq ft per bird
    const densitySqFt = 1.2; 
    const totalBirds = Math.floor(area / densitySqFt);

    // Pan feeding: 1 line per 15ft of width approximately
    const feedLines = Math.ceil(width / 15);
    
    // Nipple drinking: 1 line per 10ft of width approximately
    const waterLines = Math.ceil(width / 10);

    return [
      { title: 'Total Broiler Capacity', value: totalBirds.toLocaleString(), highlight: true },
      { title: 'Total Shed Area', value: `${area.toLocaleString()} sq.ft` },
      { title: 'Pan Feeding System', value: `${feedLines} Lines` },
      { title: 'Nipple Drinking System', value: `${waterLines} Lines` },
      { title: 'Ventilation Estimate', value: `${Math.ceil((area * 8) / 10000)} Exhaust Fans` },
      { title: 'Cooling Pad Estimate', value: `${Math.ceil(area / 400)} sq.ft` }
    ];
  };

  return (
    <div className="bg-[var(--bg)] min-h-screen">
      <CalculatorShell 
        title="Broiler Shed Calculator"
        description="Calculate capacity, feeding lines, and drinking lines for deep litter broiler housing based on shed dimensions."
        systemType="Broiler Deep Litter System"
        inputs={[
          {
            id: 'shedLength',
            label: 'Shed Length (Feet)',
            placeholder: 'e.g., 200',
            type: 'number',
            defaultValue: 200
          },
          {
            id: 'shedWidth',
            label: 'Shed Width (Feet)',
            placeholder: 'e.g., 40',
            type: 'number',
            defaultValue: 40
          }
        ]}
        onCalculate={calculateBroiler}
      />
    </div>
  );
}
