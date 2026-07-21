"use client"

import React from 'react';
import { motion } from 'framer-motion';

export interface CustomizationProps {
  id?: string;
}

const options: string[] = [
  'ZAM / Aluminium / GI / PVC feeder choice',
  'Manual or trolley feeding configuration',
  'Manure belt configuration',
  'Automatic egg collection configuration',
  'Auto flush drinking lines',
  'Custom layout planning',
  'Male/female breeder planning',
  'Lighting program support'
];

export function Customization({ id }: CustomizationProps) {
  return (
    <section id={id} className="py-16 relative scroll-mt-24">
      <div className="max-w-[1400px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="mb-10"
        >
          <h3 className="text-2xl md:text-3xl font-['Space_Grotesk'] font-black text-[var(--text)] tracking-tight mb-4">
            Built Around Your Farm Requirement
          </h3>
          <p className="text-lg text-[var(--text-muted)] font-medium leading-relaxed max-w-4xl">
            Metplast customizes cage systems around: bird type · shed size · tier count · row count · manual / semi-automatic / automatic level · feeder material · drinker placement · manure system · egg collection requirement · ventilation coordination · farm workflow.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {options.map((option, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: idx * 0.03 }}
              className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-sm"
            >
              <p className="text-sm font-bold text-[var(--text)] leading-snug">
                {option}
              </p>
            </motion.div>
          ))}
        </div>

        <p className="text-sm text-[var(--text-muted)] italic">
          Available customization depends on bird type, shed size, automation level, and final technical approval.
        </p>
      </div>
    </section>
  );
}
