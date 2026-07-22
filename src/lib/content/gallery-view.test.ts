import { describe, it, expect } from 'vitest';
import { rowToGalleryView, type GalleryItemRow } from './gallery-view';

const row: GalleryItemRow = {
  id: 'abc',
  src: '/uploads/x.jpg',
  caption: 'A caption',
  videoUrl: null,
  featured: false,
  category: { name: 'Feed Silos' },
};

describe('gallery-view', () => {
  it('maps a row with a category to a flat view', () => {
    expect(rowToGalleryView(row)).toEqual({
      id: 'abc', src: '/uploads/x.jpg', caption: 'A caption',
      category: 'Feed Silos', videoUrl: null, featured: false,
    });
  });

  it('maps a null category to category: null (Uncategorized)', () => {
    expect(rowToGalleryView({ ...row, category: null }).category).toBeNull();
  });

  it('preserves videoUrl and featured', () => {
    const v = rowToGalleryView({ ...row, videoUrl: 'https://x/embed/1', featured: true });
    expect(v.videoUrl).toBe('https://x/embed/1');
    expect(v.featured).toBe(true);
  });
});
