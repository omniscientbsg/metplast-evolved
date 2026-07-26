import prisma from '@/lib/prisma';
import { parseMiscContent } from '@/lib/content/misc-content';
import { MiscContentForm } from './MiscContentForm';

export const dynamic = 'force-dynamic';

export default async function MiscAdminPage() {
  const row = await prisma.setting.findUnique({ where: { key: 'misc_content' } });
  return <MiscContentForm initial={parseMiscContent(row?.value)} />;
}
