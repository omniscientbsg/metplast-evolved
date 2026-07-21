import React from 'react';
import { ScrollPageTemplate } from '@/components/ScrollPageTemplate';
import { environmentalControlConfig } from '@/lib/content/environmental-control';

export const metadata = {
  title: 'Environmental Control Systems | Metplast Industries',
  description: 'Precision climate management systems, including cooling pads, exhaust fans, and smart control panels, to maintain optimal poultry shed conditions.',
};

export default function EnvironmentalControlPage() {
  return <ScrollPageTemplate config={environmentalControlConfig} />;
}
