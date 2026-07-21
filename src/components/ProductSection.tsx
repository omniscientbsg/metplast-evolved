"use client"

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2, ArrowUpRight, Calculator, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageBlock } from './blocks/types';
import { BlockRenderer } from './blocks/BlockRenderer';

export interface SpecData {
  label: string;
  value: string;
}

export interface ProductSectionProps {
  id: string;
  title: string;
  badge?: string;
  tag?: string;
  description: string[];
  features?: string[];
  benefits?: string[];
  images?: string[];
  specs?: SpecData[];
  calculatorHref?: string;
  reverse?: boolean;
  topBlocks?: PageBlock[];
  bottomBlocks?: PageBlock[];
}

export function ProductSection({
  id,
  title,
  badge,
  tag,
  description,
  features,
  benefits,
  images,
  specs,
  calculatorHref,
  reverse = false,
  topBlocks,
  bottomBlocks
}: ProductSectionProps) {

  return (
    <section id={id} className="py-24 relative scroll-mt-24">
      <div className="max-w-[1400px] mx-auto px-6">

        {/* topBlocks render full-width above the two-column grid — keeps wide
            content (feeder grids, upgrade-path stage cards) readable instead
            of being squeezed into the content column. */}
        {topBlocks && topBlocks.length > 0 && (
          <div className="mb-16 space-y-16">
            {topBlocks.map((block, idx) => (
              <BlockRenderer key={block.id ?? idx} block={block} />
            ))}
          </div>
        )}

        <div className={`grid lg:grid-cols-2 gap-16 items-start ${reverse ? 'lg:flex-row-reverse' : ''}`}>

          {/* Content Column */}
          <div className={`space-y-8 ${reverse ? 'lg:order-2' : 'lg:order-1'}`}>
            <div>
              {(tag || badge) && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {tag && (
                    <div className="inline-block px-3 py-1 rounded-full border border-[var(--accent)]/20 bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-bold tracking-widest uppercase">
                      {tag}
                    </div>
                  )}
                  {badge && (
                    <div className="inline-block px-3 py-1 rounded-full border border-[var(--accent)]/20 bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-bold tracking-widest uppercase">
                      {badge}
                    </div>
                  )}
                </div>
              )}
              <h2 className="text-3xl md:text-5xl font-['Space_Grotesk'] font-black text-[var(--text)] tracking-tight leading-tight mb-6">
                {title}
              </h2>
              <div className="space-y-4 text-[var(--text-muted)] text-lg leading-relaxed font-medium">
                {description.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </div>

            {features && features.length > 0 && (
              <div className="bg-[var(--surface)] p-8 rounded-3xl border border-[var(--border)] shadow-xl">
                <h3 className="text-xl font-bold text-[var(--text)] mb-6">Key Features</h3>
                <ul className="space-y-4">
                  {features.map((feature, idx) => (
                    <li key={idx} className="flex gap-4">
                      <CheckCircle2 className="w-6 h-6 text-[var(--accent)] shrink-0" />
                      <span className="text-[var(--text-muted)] font-medium leading-relaxed">
                        <strong className="text-[var(--text)]">{feature.split('–')[0]}</strong> 
                        {feature.includes('–') ? '–' + feature.split('–')[1] : ''}
                        {feature.includes('-') && !feature.includes('–') ? '-' + feature.split('-')[1] : ''}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {benefits && benefits.length > 0 && (
              <div className="pt-4">
                <h3 className="text-xl font-bold text-[var(--text)] mb-6">Key Benefits</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {benefits.map((benefit, idx) => (
                    <div key={idx} className="bg-[var(--surface)] p-5 rounded-2xl border border-[var(--border)]">
                      <p className="text-sm font-bold text-[var(--accent)] mb-1">0{idx + 1}</p>
                      <p className="text-[var(--text-muted)] font-medium leading-snug">
                        {benefit}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA row — every product section gets Enquire + Brochure (+ Calculator) */}
            <div className="flex flex-wrap gap-3 pt-4">
              <Link href={`/contact?product=${encodeURIComponent(title)}`}>
                <Button className="h-12 px-6 bg-[var(--accent)] text-white hover:bg-[var(--accent)]/90 rounded-xl font-bold btn-glow transition-all">
                  Enquire Now <ArrowUpRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              {calculatorHref && (
                <Link href={calculatorHref}>
                  <Button variant="outline" className="h-12 px-6 border-[var(--border)] bg-[var(--glass-bg)] text-[var(--text)] hover:bg-[var(--glass-border)] rounded-xl font-bold transition-all">
                    <Calculator className="mr-2 w-4 h-4" /> Start Calculator
                  </Button>
                </Link>
              )}
              <Button
                variant="outline"
                onClick={() => window.dispatchEvent(new CustomEvent('metplast:open-brochure'))}
                className="h-12 px-6 border-[var(--border)] bg-[var(--glass-bg)] text-[var(--text)] hover:bg-[var(--glass-border)] rounded-xl font-bold transition-all"
              >
                <Download className="mr-2 w-4 h-4" /> Brochure
              </Button>
            </div>
          </div>

          {/* Visuals / Specs Column */}
          <div className={`space-y-8 ${reverse ? 'lg:order-1' : 'lg:order-2'}`}>
            {images && images.length > 0 && (
              <div className="relative aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden border border-[var(--border)] shadow-2xl">
                <Image
                  src={images[0]}
                  alt={title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {specs && specs.length > 0 && (
              <div className="bg-[var(--surface)] rounded-3xl border border-[var(--border)] overflow-hidden shadow-lg">
                <div className="p-6 bg-[var(--bg-elevated)] border-b border-[var(--border)]">
                  <h3 className="text-lg font-bold text-[var(--text)]">Technical Specifications</h3>
                </div>
                <div className="divide-y divide-[var(--border)]">
                  {specs.map((spec, idx) => (
                    <div key={idx} className="flex justify-between p-4 hover:bg-[var(--bg-elevated)]/50 transition-colors">
                      <span className="text-[var(--text-muted)] font-medium">{spec.label}</span>
                      <span className="text-[var(--text)] font-bold text-right">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* bottomBlocks render full-width below the two-column grid — same
            rationale as topBlocks (see comment above): big blocks like
            upgrade-path or feeder-materials read poorly squeezed into a
            single content column. */}
        {bottomBlocks && bottomBlocks.length > 0 && (
          <div className="mt-16 space-y-16">
            {bottomBlocks.map((block, idx) => (
              <BlockRenderer key={block.id ?? idx} block={block} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
