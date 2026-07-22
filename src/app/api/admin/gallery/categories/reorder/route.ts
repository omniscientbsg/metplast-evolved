import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  if (!(await getServerSession(authOptions))) return new Response('Unauthorized', { status: 401 });
  const { id, direction } = (await req.json()) as { id?: string; direction?: 'up' | 'down' };
  if (!id || (direction !== 'up' && direction !== 'down')) {
    return NextResponse.json({ error: 'id and direction (up|down) are required' }, { status: 400 });
  }
  const current = await prisma.galleryCategory.findUnique({ where: { id } });
  if (!current) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const neighbor = await prisma.galleryCategory.findFirst({
    where: { sortOrder: direction === 'up' ? { lt: current.sortOrder } : { gt: current.sortOrder } },
    orderBy: { sortOrder: direction === 'up' ? 'desc' : 'asc' },
  });
  if (!neighbor) return NextResponse.json({ ok: true, moved: false });
  await prisma.$transaction([
    prisma.galleryCategory.update({ where: { id: current.id }, data: { sortOrder: neighbor.sortOrder } }),
    prisma.galleryCategory.update({ where: { id: neighbor.id }, data: { sortOrder: current.sortOrder } }),
  ]);
  return NextResponse.json({ ok: true, moved: true });
}
