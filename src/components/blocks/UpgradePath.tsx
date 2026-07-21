"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export interface UpgradePathProps {
  id?: string;
}

interface Stage {
  number: string;
  label: string;
  body: string;
  accent: string;
}

const stages: Stage[] = [
  {
    number: '1',
    label: 'STAGE 1 — MANUAL',
    body: 'Manual feeding and collection. Full S-Frame structure and bird space from day one.',
    accent: 'bg-[var(--surface)] border-[var(--border)]'
  },
  {
    number: '2',
    label: 'STAGE 2 — SEMI-AUTOMATIC',
    body: 'Add a feeding trolley and manure belt when the farm is ready. Same cages. No rebuild.',
    accent: 'bg-[var(--accent)]/5 border-[var(--accent)]/30'
  },
  {
    number: '3',
    label: 'STAGE 3 — AUTOMATIC',
    body: 'Add automatic egg collection. The cage you bought in Stage 1 is still the cage running in Stage 3.',
    accent: 'bg-[var(--accent)]/10 border-[var(--accent)]/50'
  }
];

export function UpgradePath({ id }: UpgradePathProps) {
  return (
    <section id={id} className="py-16 relative scroll-mt-24">
      <div className="max-w-[1400px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="mb-10"
        >
          <div className="inline-block px-3 py-1 rounded-full border border-[var(--accent)]/20 bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-bold tracking-widest uppercase mb-4">
            The Upgrade-Ready Cage
          </div>
        </motion.div>

        <div className="flex flex-col md:flex-row items-stretch gap-6">
          {stages.map((stage, idx) => (
            <React.Fragment key={stage.number}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: idx * 0.1 }}
                className={`flex-1 rounded-3xl border p-8 shadow-xl ${stage.accent}`}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center mb-5 bg-[var(--accent)] text-white font-bold">
                  {stage.number}
                </div>
                <h4 className="text-sm font-bold tracking-widest uppercase text-[var(--accent)] mb-3">
                  {stage.label}
                </h4>
                <p className="text-[var(--text)] font-medium leading-relaxed">
                  {stage.body}
                </p>
              </motion.div>

              {idx !== stages.length - 1 && (
                <div className="hidden md:flex items-center justify-center shrink-0">
                  <ArrowRight className="w-6 h-6 text-[var(--accent)]" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
