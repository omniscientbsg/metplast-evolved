import type { GalleryView, GalleryCategoryView } from '@/lib/content/gallery-view';

export const FALLBACK_CATEGORIES: GalleryCategoryView[] = [
  { name: 'Metplast Housing' },
  { name: 'Layer Cage Systems' },
  { name: 'Breeder Cage Systems' },
  { name: 'Feed Silos' },
  { name: 'Factory / Manufacturing' },
];

export const FALLBACK_ITEMS: GalleryView[] = [
  { id: '1', src: '/images/gallery/1-3-600x540.jpg', caption: 'H-Type Layer Cage System — multi-tier automatic system with egg belt collection', category: 'Layer Cage Systems', videoUrl: null, featured: false },
  { id: '2', src: '/images/gallery/3-2-600x540.jpg', caption: 'Metplast Layer cage corridor — automated feeding and manure belt system in operation', category: 'Layer Cage Systems', videoUrl: null, featured: false },
  { id: '3', src: '/images/gallery/4-1-600x540.jpg', caption: 'Breeder cage system — designed for hatching egg quality and custom male bird placement', category: 'Breeder Cage Systems', videoUrl: null, featured: false },
  { id: '4', src: '/images/gallery/7-1-600x540.jpg', caption: 'Automatic nest boxes installed for clean hatching egg collection', category: 'Breeder Cage Systems', videoUrl: null, featured: false },
  { id: '5', src: '/images/gallery/8-1-600x540.jpg', caption: 'H-Type layer cage corridor — central service walkway with automated feeding lines', category: 'Layer Cage Systems', videoUrl: null, featured: false },
  { id: '6', src: '/images/gallery/9-600x540.jpg', caption: 'Multi-tier layer cages with feed trough and nipple drinking lines', category: 'Layer Cage Systems', videoUrl: null, featured: false },
  { id: '8', src: '/images/Untitled-design-7-560x690.jpg', caption: 'Metplast feed silo installed at farm — galvanized steel with conical bottom', category: 'Feed Silos', videoUrl: null, featured: false },
  { id: '9', src: '/images/Hero-Slider-2.jpg', caption: 'Complete poultry housing project — multiple sheds built from levelled land', category: 'Metplast Housing', videoUrl: null, featured: false },
  { id: '7', src: '/images/Glimpse-Metplast-Indsutries-1.jpg', caption: 'Metplast Industries manufacturing facility — Khalapur, Maharashtra', category: 'Factory / Manufacturing', videoUrl: 'https://www.youtube.com/embed/sPCkTagbAYo', featured: true },
];
