"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export interface FeedingTrolleyProps {
  id?: string;
}

const capabilities: string[] = [
  'Calibrate feed quantity per box — exact grams, not guesswork',
  'Skip empty boxes automatically — no feed wasted on vacant cages',
  'Keep body weight on target — controlled feeding is the foundation of breeder performance'
];

export function FeedingTrolley({ id }: FeedingTrolleyProps) {
  return (
    <section id={id} className="py-16 md:py-20 relative scroll-mt-24 bg-[var(--bg-elevated)] border-y border-[var(--border)]">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
          >
            <div className="inline-block px-3 py-1 rounded-full border border-[var(--accent)]/20 bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-bold tracking-widest uppercase mb-4">
              99.7% Feeding Accuracy
            </div>
            <h3 className="text-2xl md:text-3xl font-['Space_Grotesk'] font-black text-[var(--text)] tracking-tight mb-4">
              Precision Feeding, Bird by Bird
            </h3>
            <p className="text-lg text-[var(--text-muted)] font-medium leading-relaxed mb-6">
              Every Metplast breeder feeding trolley carries a 10-inch touchscreen display. From the screen, the operator can:
            </p>

            <ul className="space-y-4 mb-6">
              {capabilities.map((item, idx) => (
                <li key={idx} className="flex gap-4">
                  <CheckCircle2 className="w-6 h-6 text-[var(--accent)] shrink-0" />
                  <span className="text-[var(--text-muted)] font-medium leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            <p className="text-[var(--text)] font-bold text-lg leading-relaxed">
              The result: 99.7% feeding accuracy across the line, uniform body weight, and feed cost that stays under control.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ delay: 0.1 }}
            className="relative aspect-video md:aspect-square rounded-3xl border-2 border-dashed border-[var(--border)] bg-[var(--surface)] flex flex-col items-center justify-center gap-2 p-8 text-center"
          >
            <span className="text-sm font-bold text-[var(--text-muted)]">
              Photo coming soon — trolley with 10-inch touchscreen
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
