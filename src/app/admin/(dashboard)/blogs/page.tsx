import prisma from '@/lib/prisma';
import Link from 'next/link';
import { BlogCategoryManager } from './BlogCategoryManager';
import { BlogRowActions } from './BlogRowActions';
import { formatPostDate } from '@/lib/content/blog-view';

export const dynamic = 'force-dynamic';

export default async function BlogsAdminPage() {
  const [posts, categories] = await Promise.all([
    prisma.blog.findMany({
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
      include: { category: { select: { name: true } } },
    }),
    prisma.blogCategory.findMany({ orderBy: { sortOrder: 'asc' }, select: { id: true, name: true } }),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Blogs &amp; News</h1>
          <p className="text-white/60 mt-1">Articles shown on the public /blog page.</p>
        </div>
        <Link href="/admin/blogs/new" className="bg-primary text-white font-bold px-6 py-2 rounded-xl hover:bg-primary/90 transition-colors">New Post</Link>
      </div>

      <BlogCategoryManager categories={categories} />

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <tbody>
            {posts.length === 0 && (
              <tr><td className="p-8 text-center text-white/50">No posts yet. Click “New Post” to write one.</td></tr>
            )}
            {posts.map((p) => (
              <tr key={p.id} className="border-t border-white/10 hover:bg-white/5">
                <td className="p-4">
                  <div className="text-white font-medium">{p.title}</div>
                  <div className="text-xs text-white/50">
                    {p.category?.name ?? 'Uncategorized'} · {formatPostDate(p.createdAt)}
                    {p.featured && ' · featured'}
                  </div>
                </td>
                <td className="p-4 w-28">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${p.published ? 'bg-green-500/15 text-green-300' : 'bg-white/10 text-white/50'}`}>
                    {p.published ? 'Live' : 'Draft'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <BlogRowActions id={p.id} published={p.published} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
