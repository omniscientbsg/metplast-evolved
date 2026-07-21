"use client"

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calculator, ArrowRight } from 'lucide-react';

interface CalculatorCardProps {
  title: string;
  description: string;
  href: string;
  delay?: number;
}

export function CalculatorCard({ title, description, href, delay = 0 }: CalculatorCardProps) {
  return (
    <Link href={href}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5 }}
        whileHover={{ y: -5 }}
        className="group relative h-full rounded-3xl p-8 overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, rgba(11,18,32,1) 0%, rgba(22,32,50,1) 100%)',
          border: '1px solid rgba(255,255,255,0.05)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
        }}
      >
        {/* Blueprint grid background */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none transition-opacity group-hover:opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(249, 115, 22, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(249, 115, 22, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        />

        <div className="relative z-10 flex flex-col h-full">
          <div className="w-14 h-14 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center mb-6 border border-[var(--accent)]/20">
            <Calculator className="w-7 h-7 text-[var(--accent)]" />
          </div>

          <h3 className="text-2xl font-bold text-white mb-3 tracking-tight group-hover:text-[var(--accent)] transition-colors">
            {title}
          </h3>
          
          <p className="text-[#9AA7BD] font-medium leading-relaxed flex-grow mb-8">
            {description}
          </p>

          <div className="flex items-center text-[var(--accent)] font-bold uppercase tracking-widest text-sm mt-auto">
            Open Calculator
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
