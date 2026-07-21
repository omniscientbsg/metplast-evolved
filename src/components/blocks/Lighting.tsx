"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';

export interface LightingProps {
  id?: string;
}

const fixtures: string[] = ['T5 Tube Light', 'T6 Tube Light', 'LED Bulb'];

export function Lighting({ id }: LightingProps) {
  return (
    <section id={id} className="py-16 relative scroll-mt-24">
      <div className="max-w-[1400px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-8 md:p-10 shadow-xl"
        >
          <h3 className="text-2xl md:text-3xl font-['Space_Grotesk'] font-black text-[var(--text)] tracking-tight mb-6">
            Metplast Lighting Support
          </h3>

          <div className="flex flex-wrap gap-4 mb-8">
            {fixtures.map((fixture, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border)] bg-[var(--bg-elevated)]"
              >
                <Lightbulb className="w-4 h-4 text-[var(--accent)]" />
                <span className="text-sm font-bold text-[var(--text)]">{fixture}</span>
              </div>
            ))}
          </div>

          <p className="text-lg text-[var(--text-muted)] font-medium leading-relaxed mb-6">
            Lighting programs help farmers manage bird activity, feed behaviour, and reproductive readiness when planned properly. For breeder farms, the right lighting design supports flock management and reproductive performance when combined with the correct management program.
          </p>

          <p className="text-sm text-[var(--text-muted)] italic border-t border-[var(--border)] pt-6">
            Applicable for: Breeder · Breeder Pullet · Layer Pullet · Metplast Housing
          </p>
        </motion.div>
      </div>
    </section>
  );
}
