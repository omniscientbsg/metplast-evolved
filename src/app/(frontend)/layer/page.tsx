import React from 'react';
import { ScrollPageTemplate } from '@/components/ScrollPageTemplate';
import { layerConfig } from '@/lib/content/layer';

export const metadata = {
  title: 'Layer Cage Solutions | Metplast Industries',
  description: 'Precision-engineered H-Type and A-Frame layer cage systems designed for maximum egg production and optimal bird health.',
};

export default function LayerPage() {
  return <ScrollPageTemplate config={layerConfig} />;
}
