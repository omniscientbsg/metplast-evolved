import React from 'react';
import { ScrollPageTemplate } from '@/components/ScrollPageTemplate';
import { layerConfig } from '@/lib/content/layer';

export const metadata = {
  title: 'Layer Cage Solutions | Metplast Industries',
  description: 'H-Type and S-Frame layer cage systems engineered for uniform feed access, clean egg handling, stronger cage life, and consistent layer production.',
};

export default function LayerPage() {
  return <ScrollPageTemplate config={layerConfig} />;
}
