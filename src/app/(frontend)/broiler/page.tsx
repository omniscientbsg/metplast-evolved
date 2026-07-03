import React from 'react';
import { ScrollPageTemplate } from '@/components/ScrollPageTemplate';
import { broilerConfig } from '@/lib/content/broiler';

export const metadata = {
  title: 'Broiler Solutions | Metplast Industries',
  description: 'High-performance broiler rearing systems, from automated deep litter to space-saving multi-tier battery cages, designed for superior meat yield.',
};

export default function BroilerPage() {
  return <ScrollPageTemplate config={broilerConfig} />;
}
