import prisma from '@/lib/prisma';
import { parseMiscContent, type MiscContent } from './misc-content';

export async function getMiscContent(): Promise<MiscContent> {
  try {
    const row = await prisma.setting.findUnique({ where: { key: 'misc_content' } });
    return parseMiscContent(row?.value);
  } catch (err) {
    console.error('getMiscContent failed, using defaults:', err);
    return parseMiscContent(null);
  }
}
