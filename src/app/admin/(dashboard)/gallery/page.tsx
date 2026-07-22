import prisma from '@/lib/prisma';
import Link from 'next/link';
import { CategoryManager } from './CategoryManager';
import { GalleryRowActions } from './GalleryRowActions';

export const dynamic = 'force-dynamic';

export default async function GalleryAdminPage() {
  const [items, categories] = await Promise.all([
    prisma.galleryItem.findMany({ orderBy: { sortOrder: 'asc' }, include: { category: { select: { name: true } } } }),
    prisma.galleryCategory.findMany({ orderBy: { sortOrder: 'asc' } }),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Gallery</h1>
          <p className="text-white/60 mt-1">Images shown on the public gallery. Reorder with the arrows.</p>
        </div>
        <Link href="/admin/gallery/new" className="bg-primary text-white font-bold px-6 py-2 rounded-xl hover:bg-primary/90 transition-colors">Add Image</Link>
      </div>

      <CategoryManager categories={categories} />

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <tbody>
            {items.length === 0 && (
              <tr><td className="p-8 text-center text-white/50">No images yet. Run <code>npm run db:migrate-gallery</code> or add one.</td></tr>
            )}
            {items.map((it, i) => (
              <tr key={it.id} className="border-t border-white/10 hover:bg-white/5">
                <td className="p-4 w-24">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={it.src} alt="" className="w-16 h-16 object-cover rounded-lg border border-white/10" />
                </td>
                <td className="p-4">
                  <div className="text-white text-sm">{it.caption || <span className="text-white/40">(no caption)</span>}</div>
                  <div className="text-xs text-white/50">
                    {it.category?.name ?? 'Uncategorized'}
                    {it.featured && ' · featured'}{!it.visible && ' · hidden'}{it.videoUrl && ' · video'}
                  </div>
                </td>
                <td className="p-4 text-right">
                  <GalleryRowActions id={it.id} isFirst={i === 0} isLast={i === items.length - 1} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
