import React from 'react';
import { ScrollPageTemplate } from '@/components/ScrollPageTemplate';
import { breederConfig } from '@/lib/content/breeder';

export const metadata = {
  title: 'Breeder Solutions | Metplast Industries',
  description: 'H-Type breeder cage systems designed for male-female management, uniform feeding, cleaner hatching eggs, and easier AI workflow.',
};

export default function BreederPage() {
  return <ScrollPageTemplate config={breederConfig} />;
}
