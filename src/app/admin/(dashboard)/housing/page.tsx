import prisma from '@/lib/prisma';
import { parseHousingContent } from '@/lib/content/housing-content';
import { HousingContentForm } from './HousingContentForm';

export const dynamic = 'force-dynamic';

export default async function HousingAdminPage() {
  const row = await prisma.setting.findUnique({ where: { key: 'housing_content' } });
  return <HousingContentForm initial={parseHousingContent(row?.value)} />;
}
