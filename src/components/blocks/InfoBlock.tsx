"use client"

import React from 'react';
import { motion } from 'framer-motion';

export interface InfoBlockProps {
  id?: string;
  heading: string;
  lines: string[];
  note?: string;
  columns?: boolean;
}

export function InfoBlock({ id, heading, lines, note, columns = false }: InfoBlockProps) {
  // When `columns` is set, the first up-to-2 lines are treated as short stat
  // callouts and rendered larger/accented; the rest render as normal body text.
  const statLines = columns ? lines.slice(0, 2) : [];
  const bodyLines = columns ? lines.slice(2) : lines;

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
            {heading}
          </h3>

          {statLines.length > 0 && (
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              {statLines.map((line, idx) => (
                <p key={idx} className="text-xl md:text-2xl font-bold text-[var(--accent)] leading-snug">
                  {line}
                </p>
              ))}
            </div>
          )}

          <div className="space-y-4 text-[var(--text-muted)] text-lg leading-relaxed font-medium">
            {bodyLines.map((line, idx) => (
              <p key={idx}>{line}</p>
            ))}
          </div>

          {note && (
            <p className="mt-6 text-sm text-[var(--text-muted)] italic">
              {note}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
