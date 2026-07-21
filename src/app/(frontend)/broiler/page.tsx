import React from 'react';
import { ScrollPageTemplate } from '@/components/ScrollPageTemplate';
import { broilerConfig } from '@/lib/content/broiler';

export const metadata = {
  title: 'Broiler Solutions | Metplast Industries',
  description: 'Broiler poultry systems — deep litter housing, pan feeding, nipple drinking with auto flush, curtains, and H-Type broiler cage systems for practical shed management.',
};

export default function BroilerPage() {
  return <ScrollPageTemplate config={broilerConfig} />;
}
