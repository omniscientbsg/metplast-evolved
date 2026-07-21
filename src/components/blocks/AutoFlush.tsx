"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export interface AutoFlushProps {
  id?: string;
}

const reasons: string[] = [
  'After a medication or vaccination cycle, the line is flushed automatically — no residue sits in the pipe when birds drink next.',
  'In summer, stagnant warm water is flushed out so birds always drink cool, fresh water — and birds that drink well, eat well.',
  'Regular flushing keeps biofilm from building inside the line, protecting water quality every single day.'
];

export function AutoFlush({ id }: AutoFlushProps) {
  return (
    <section id={id} className="py-16 relative scroll-mt-24">
      <div className="max-w-[1400px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-8 md:p-10 shadow-xl"
        >
          <h3 className="text-2xl md:text-3xl font-['Space_Grotesk'] font-black text-[var(--text)] tracking-tight mb-4">
            Auto Flush Water Hygiene
          </h3>
          <p className="text-lg text-[var(--text-muted)] font-medium mb-8">
            Every Metplast nipple drinking line can be configured with an automatic flush system. Why it matters:
          </p>

          <ul className="space-y-4 mb-8">
            {reasons.map((reason, idx) => (
              <li key={idx} className="flex gap-4">
                <CheckCircle2 className="w-6 h-6 text-[var(--accent)] shrink-0" />
                <span className="text-[var(--text-muted)] font-medium leading-relaxed">
                  {reason}
                </span>
              </li>
            ))}
          </ul>

          <p className="text-sm text-[var(--text-muted)] italic border-t border-[var(--border)] pt-6">
            Available across layer, breeder, and broiler drinking systems, and alongside pan feeding setups.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
