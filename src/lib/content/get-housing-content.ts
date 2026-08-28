import prisma from '@/lib/prisma';
import { parseHousingContent, type HousingContent } from './housing-content';

export async function getHousingContent(): Promise<HousingContent> {
  try {
    const row = await prisma.setting.findUnique({ where: { key: 'housing_content' } });
    return parseHousingContent(row?.value);
  } catch (err) {
    console.error('getHousingContent failed, using defaults:', err);
    return parseHousingContent(null);
  }
}
