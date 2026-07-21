"use client"

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

export interface CrossLink {
  title: string;
  desc: string;
  href: string;
  color: string;
}

interface CrossLinkCardsProps {
  links: CrossLink[];
}

export function CrossLinkCards({ links }: CrossLinkCardsProps) {
  if (!links || links.length === 0) return null;

  return (
    <section className="py-24 bg-[var(--bg-elevated)] border-t border-[var(--border)]">
      <div className="max-w-[1400px] mx-auto px-6">
        <h2 className="text-3xl font-['Space_Grotesk'] font-black text-[var(--text)] mb-10 tracking-tight">
          Explore Related Solutions
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {links.map((link, idx) => (
            <Link key={idx} href={link.href}>
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-[var(--surface)] p-8 rounded-3xl border border-[var(--border)] shadow-sm hover:shadow-xl transition-all h-full flex flex-col group"
              >
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: `${link.color}20`, color: link.color }}
                >
                  <ArrowUpRight className="w-6 h-6 group-hover:rotate-45 transition-transform" />
                </div>
                
                <h3 className="text-xl font-bold text-[var(--text)] mb-3 group-hover:text-[var(--accent)] transition-colors">
                  {link.title}
                </h3>
                <p className="text-[var(--text-muted)] font-medium leading-relaxed flex-grow">
                  {link.desc}
                </p>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
