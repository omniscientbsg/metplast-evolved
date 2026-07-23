import Link from 'next/link';
import { PAGE_DEFS } from '@/lib/content/page-content';

export const dynamic = 'force-dynamic';

export default function PagesAdminPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">Pages</h1>
        <p className="text-white/60 mt-1">Edit the hero, intro, and cross-links for each page.</p>
      </div>
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <tbody>
            {PAGE_DEFS.map((d) => (
              <tr key={d.page} className="border-t border-white/10 hover:bg-white/5 first:border-t-0">
                <td className="p-4 text-white font-medium">{d.label}</td>
                <td className="p-4 text-xs text-white/50">
                  hero{d.hasIntro && ' · intro'}{d.hasCrossLinks && ' · cross-links'}
                </td>
                <td className="p-4 text-right">
                  <Link href={`/admin/pages/${d.page}`} className="text-white/50 hover:text-white text-sm font-medium">Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
