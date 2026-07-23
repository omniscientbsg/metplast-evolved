import prisma from '@/lib/prisma';
import { parseHomeContent } from '@/lib/content/home-content';
import { HomeContentForm } from './HomeContentForm';

export const dynamic = 'force-dynamic';

export default async function HomeAdminPage() {
  const row = await prisma.setting.findUnique({ where: { key: 'home_content' } });
  return <HomeContentForm initial={parseHomeContent(row?.value)} />;
}
