"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Feather, Wrench, Droplets, LucideIcon } from 'lucide-react';

export interface FeederMaterialsProps {
  id?: string;
}

interface MaterialCard {
  icon: LucideIcon;
  title: string;
  body: string;
}

const materials: MaterialCard[] = [
  {
    icon: ShieldCheck,
    title: 'ZAM (Zinc–Aluminium–Magnesium) Coated',
    body: 'Our premium coating for feeders and cage wire. Zinc forms the base corrosion barrier. Aluminium builds a stable protective oxide layer that resists heat and humidity. Magnesium is the difference-maker — it seals and protects cut edges and scratches, exactly where ordinary coatings fail first. In an ammonia-rich poultry shed, ZAM lasts significantly longer than standard galvanizing.'
  },
  {
    icon: Feather,
    title: 'Aluminium Feeder',
    body: 'Lightweight and naturally rust-free. Smooth surface keeps feed flowing and makes cleaning fast. Suited to farms that want low weight on the trolley line and zero corrosion worry.'
  },
  {
    icon: Wrench,
    title: 'GI (Galvanized Iron) Feeder',
    body: 'The proven workhorse — strong, economical, and field-tested across Indian farms for decades. The right choice where budget and durability must meet.'
  },
  {
    icon: Droplets,
    title: 'PVC Feeder',
    body: 'Corrosion-proof, food-safe, easy to wash, and economical. A practical choice for farms prioritising hygiene and simple maintenance.'
  }
];

export function FeederMaterials({ id }: FeederMaterialsProps) {
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
            Choose the Right Feeder for Your Farm
          </h3>
          <p className="text-lg text-[var(--text-muted)] font-medium">
            Metplast builds feeders in four materials. Each exists for a reason:
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {materials.map((material, idx) => {
            const Icon = material.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: idx * 0.05 }}
                className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 shadow-xl flex flex-col"
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 bg-[var(--accent)]/10 text-[var(--accent)]">
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-[var(--text)] mb-3 leading-snug">
                  {material.title}
                </h4>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed font-medium">
                  {material.body}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
