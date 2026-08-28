import prisma from '@/lib/prisma';
import { parseAboutContent } from '@/lib/content/about-content';
import { AboutContentForm } from './AboutContentForm';

export const dynamic = 'force-dynamic';

export default async function AboutAdminPage() {
  const row = await prisma.setting.findUnique({ where: { key: 'about_content' } });
  return <AboutContentForm initial={parseAboutContent(row?.value)} />;
}
