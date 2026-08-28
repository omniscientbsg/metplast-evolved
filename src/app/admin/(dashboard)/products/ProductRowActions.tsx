"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function ProductRowActions({
  id,
  isFirst,
  isLast,
}: {
  id: string;
  isFirst: boolean;
  isLast: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function move(direction: 'up' | 'down') {
    setBusy(true);
    await fetch('/api/admin/products/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, direction }),
    });
    setBusy(false);
    router.refresh();
  }

  async function del() {
    if (!confirm('Delete this section? This cannot be undone.')) return;
    setBusy(true);
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    setBusy(false);
    router.refresh();
  }

  return (
    <div className="inline-flex items-center gap-3">
      <button disabled={busy || isFirst} onClick={() => move('up')}
        className="text-white/50 hover:text-white disabled:opacity-20 text-lg leading-none">↑</button>
      <button disabled={busy || isLast} onClick={() => move('down')}
        className="text-white/50 hover:text-white disabled:opacity-20 text-lg leading-none">↓</button>
      <Link href={`/admin/products/${id}`}
        className="text-white/50 hover:text-white text-sm font-medium">Edit</Link>
      <button disabled={busy} onClick={del}
        className="text-red-400 hover:text-red-300 text-sm font-medium">Delete</button>
    </div>
  );
}
