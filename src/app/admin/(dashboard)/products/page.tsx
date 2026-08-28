import prisma from '@/lib/prisma';
import Link from 'next/link';
import { ProductRowActions } from './ProductRowActions';

export const dynamic = 'force-dynamic';

export default async function ProductsAdminPage() {
  const sections = await prisma.productSection.findMany({
    orderBy: [{ page: 'asc' }, { sortOrder: 'asc' }],
  });

  const byPage: Record<string, typeof sections> = {};
  for (const s of sections) (byPage[s.page] ??= []).push(s);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Products</h1>
          <p className="text-white/60 mt-1">Sections shown on each public page. Reorder with the arrows.</p>
        </div>
        <Link href="/admin/products/new"
          className="bg-primary text-white font-bold px-6 py-2 rounded-xl hover:bg-primary/90 transition-colors">
          Add Section
        </Link>
      </div>

      {Object.keys(byPage).length === 0 && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center text-white/50">
          No sections yet. Run <code>npm run db:migrate-content</code> or add one.
        </div>
      )}

      {Object.entries(byPage).map(([page, rows]) => (
        <div key={page} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="px-4 py-3 bg-black/20 text-white/70 text-sm font-bold uppercase tracking-wider">
            {page}
          </div>
          <table className="w-full text-left border-collapse">
            <tbody>
              {rows.map((s, i) => (
                <tr key={s.id} className="border-t border-white/10 hover:bg-white/5">
                  <td className="p-4">
                    <div className="font-bold text-white">{s.title}</div>
                    <div className="text-xs text-white/50">/{s.slug}{!s.visible && ' · hidden'}</div>
                  </td>
                  <td className="p-4 text-right">
                    <ProductRowActions id={s.id} isFirst={i === 0} isLast={i === rows.length - 1} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
