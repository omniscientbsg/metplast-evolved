import React from 'react';
import { ScrollPageTemplate } from '@/components/ScrollPageTemplate';
import { breederConfig } from '@/lib/content/breeder';

export const metadata = {
  title: 'Breeder Solutions | Metplast Industries',
  description: 'Advanced breeder housing and cage systems engineered to optimize fertility, hatchability, and uniform flock health.',
};

export default function BreederPage() {
  return <ScrollPageTemplate config={breederConfig} />;
}
