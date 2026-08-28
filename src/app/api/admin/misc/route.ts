import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { parseMiscContent, type MiscContent } from '@/lib/content/misc-content';

async function authed() {
  return Boolean(await getServerSession(authOptions));
}

export async function PUT(req: Request) {
  if (!(await authed())) return new Response('Unauthorized', { status: 401 });
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Invalid body' }, { status: 400 }); }
  const normalized: MiscContent = parseMiscContent(JSON.stringify(body));
  try {
    await prisma.setting.upsert({
      where: { key: 'misc_content' },
      create: { key: 'misc_content', value: JSON.stringify(normalized) },
      update: { value: JSON.stringify(normalized) },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('save misc content failed:', e);
    return NextResponse.json({ error: 'Could not save' }, { status: 500 });
  }
}
