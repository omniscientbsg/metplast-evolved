import React from 'react';
import { CalculatorCard } from '@/components/CalculatorCard';

export const metadata = {
  title: 'Poultry Farm Calculators | Metplast Industries',
  description: 'Calculate exact equipment requirements for your poultry farm with Metplast\'s engineering tools.',
};

const calculators = [
  {
    title: 'Layer Calculator',
    description: 'Calculate H-Type and S-Frame cage requirements for commercial layer production based on your bird capacity.',
    href: '/calculators/layer',
    delay: 0.1
  },
  {
    title: 'Layer Pullet Calculator',
    description: 'Estimate cage requirements for growing layer chicks up to 14 weeks.',
    href: '/calculators/layer-pullet',
    delay: 0.2
  },
  {
    title: 'Breeder Calculator',
    description: 'Calculate H-Type breeder cage requirements, including custom male bird placement ratios.',
    href: '/calculators/breeder',
    delay: 0.3
  },
  {
    title: 'Breeder Pullet Calculator',
    description: 'Determine exact cage and feeding requirements for breeder chicks from day old to maturity.',
    href: '/calculators/breeder-pullet',
    delay: 0.4
  },
  {
    title: 'Broiler Calculator',
    description: 'Estimate deep litter or H-Type cage requirements for intensive broiler rearing.',
    href: '/calculators/broiler',
    delay: 0.5
  }
];

export default function CalculatorsHubPage() {
  return (
    <main className="min-h-screen bg-[var(--bg)] relative overflow-hidden pt-32 pb-24">
      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="glow-orb glow-red w-[600px] h-[600px] top-[-10%] right-[-10%] opacity-20" />
        <div className="glow-orb glow-blue w-[500px] h-[500px] bottom-[-20%] left-[-10%] opacity-20" />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-[var(--border)] bg-[var(--surface)]/50 backdrop-blur-xl mb-6">
            <span className="text-sm font-bold tracking-widest uppercase text-[var(--accent)]">
              Engineering Tools
            </span>
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-['Space_Grotesk'] text-[var(--text)] tracking-tight mb-6">
            PLAN YOUR FARM <br/>
            <span className="text-[var(--accent)]">WITH PRECISION.</span>
          </h1>
          <p className="text-xl text-[var(--text-muted)] font-medium max-w-2xl mx-auto leading-relaxed">
            Select a calculator below to estimate the exact structural and equipment requirements for your poultry project.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {calculators.map((calc, idx) => (
            <CalculatorCard 
              key={idx}
              title={calc.title}
              description={calc.description}
              href={calc.href}
              delay={calc.delay}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
