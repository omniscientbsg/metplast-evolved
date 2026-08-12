import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import { ALLOWED_IMAGE_TYPES, validateImageUpload } from '@/lib/upload-limits';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response('Unauthorized', { status: 401 });

  const form = await req.formData();
  const file = form.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }
  // Same size/type rule the client enforces — never trust the client.
  const invalid = validateImageUpload(file);
  if (invalid) {
    const status = ALLOWED_IMAGE_TYPES[file.type] ? 413 : 415;
    return NextResponse.json({ error: invalid }, { status });
  }
  const ext = ALLOWED_IMAGE_TYPES[file.type];

  const dir = process.env.UPLOAD_DIR || path.join(process.cwd(), 'public', 'uploads');
  await mkdir(dir, { recursive: true });
  const name = `${randomUUID()}.${ext}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, name), bytes);

  return NextResponse.json({ path: `/uploads/${name}` }, { status: 201 });
}
