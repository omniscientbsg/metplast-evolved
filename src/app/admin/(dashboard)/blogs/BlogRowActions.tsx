"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function BlogRowActions({ id, published }: { id: string; published: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function togglePublish() {
    setBusy(true);
    await fetch(`/api/admin/blogs/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ published: !published }),
    });
    setBusy(false); router.refresh();
  }
  async function del() {
    if (!confirm('Delete this post?')) return;
    setBusy(true);
    await fetch(`/api/admin/blogs/${id}`, { method: 'DELETE' });
    setBusy(false); router.refresh();
  }

  return (
    <div className="inline-flex items-center gap-3">
      <button disabled={busy} onClick={togglePublish} className="text-white/50 hover:text-white text-sm font-medium">
        {published ? 'Unpublish' : 'Publish'}
      </button>
      <Link href={`/admin/blogs/${id}`} className="text-white/50 hover:text-white text-sm font-medium">Edit</Link>
      <button disabled={busy} onClick={del} className="text-red-400 hover:text-red-300 text-sm font-medium">Delete</button>
    </div>
  );
}
