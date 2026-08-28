import prisma from '@/lib/prisma';
import { parseAboutContent, type AboutContent } from './about-content';

export async function getAboutContent(): Promise<AboutContent> {
  try {
    const row = await prisma.setting.findUnique({ where: { key: 'about_content' } });
    return parseAboutContent(row?.value);
  } catch (err) {
    console.error('getAboutContent failed, using defaults:', err);
    return parseAboutContent(null);
  }
}
