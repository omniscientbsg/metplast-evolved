import prisma from '@/lib/prisma';
import { parseHomeContent, type HomeContent } from './home-content';

export async function getHomeContent(): Promise<HomeContent> {
  try {
    const row = await prisma.setting.findUnique({ where: { key: 'home_content' } });
    return parseHomeContent(row?.value);
  } catch (err) {
    console.error('getHomeContent failed, using defaults:', err);
    return parseHomeContent(null);
  }
}
