import React from 'react';
import { ScrollPageTemplate } from '@/components/ScrollPageTemplate';
import { feedSilosConfig } from '@/lib/content/feed-silos';

export const metadata = {
  title: 'Feed Silos & Auger Systems | Metplast Industries',
  description: 'Galvanized steel feed silos designed for secure bulk storage, weather protection, and automated distribution across your poultry farm.',
};

export default function FeedSilosPage() {
  return <ScrollPageTemplate config={feedSilosConfig} />;
}
