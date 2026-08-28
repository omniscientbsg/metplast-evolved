import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { parseHomeContent, type HomeContent } from '@/lib/content/home-content';

async function authed() {
  return Boolean(await getServerSession(authOptions));
}

export async function PUT(req: Request) {
  if (!(await authed())) return new Response('Unauthorized', { status: 401 });
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Invalid body' }, { status: 400 }); }
  // Normalize through the parser (merges over defaults, drops junk) then store.
  const normalized: HomeContent = parseHomeContent(JSON.stringify(body));
  try {
    await prisma.setting.upsert({
      where: { key: 'home_content' },
      create: { key: 'home_content', value: JSON.stringify(normalized) },
      update: { value: JSON.stringify(normalized) },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('save home content failed:', e);
    return NextResponse.json({ error: 'Could not save' }, { status: 500 });
  }
}
