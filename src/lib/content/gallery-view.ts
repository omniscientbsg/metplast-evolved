/** Flat shape the gallery client component consumes. */
export interface GalleryView {
  id: string;
  src: string;
  caption: string;
  category: string | null;
  videoUrl: string | null;
  featured: boolean;
}

export interface GalleryCategoryView {
  name: string;
}

/** The subset of a GalleryItem row (with its category joined) that the mapper reads. */
export interface GalleryItemRow {
  id: string;
  src: string;
  caption: string;
  videoUrl: string | null;
  featured: boolean;
  category: { name: string } | null;
}

export function rowToGalleryView(row: GalleryItemRow): GalleryView {
  return {
    id: row.id,
    src: row.src,
    caption: row.caption,
    category: row.category ? row.category.name : null,
    videoUrl: row.videoUrl,
    featured: row.featured,
  };
}
