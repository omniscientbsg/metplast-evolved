"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

export function MobaBlock() {
  return (
    <section className="py-24 relative z-10">
      <div className="max-w-[1400px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-10 md:p-16 grid md:grid-cols-[auto_1fr] gap-10 items-center"
        >
          {/* TODO: replace with official Moba logo file from Arnav → Baljinder */}
          <div className="flex items-center justify-center w-40 h-40 rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] shrink-0 mx-auto md:mx-0">
            <span className="text-3xl font-['Space_Grotesk'] font-black tracking-tight text-[var(--text)]">
              MOBA
            </span>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl md:text-5xl font-['Space_Grotesk'] font-black text-[var(--text)] tracking-tighter leading-none">
              Metplast <span style={{ color: 'var(--accent)' }}>×</span> Moba
            </h2>
            <p className="text-lg text-[var(--text-muted)] font-medium leading-relaxed max-w-3xl">
              Metplast is a distributor of Moba — the global leader in egg grading, packing, and processing solutions. From cage to graded, packed egg, Metplast connects your farm to world-standard egg handling.
            </p>
            <a
              href="https://moba.net/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold tracking-wide uppercase text-sm transition-transform hover:-translate-y-0.5"
              style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-text)' }}
            >
              moba.net
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
