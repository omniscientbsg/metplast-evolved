import prisma from '@/lib/prisma';
import { siteSettingsFromRows, SITE_SETTING_KEYS, type SiteSettings } from './site-settings';

/** Load all site settings (DB value ?? registry default). Never throws. */
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const rows = await prisma.setting.findMany({
      where: { key: { in: SITE_SETTING_KEYS.map((f) => f.key) } },
      select: { key: true, value: true },
    });
    return siteSettingsFromRows(rows);
  } catch (err) {
    console.error('getSiteSettings failed, using defaults:', err);
    return siteSettingsFromRows([]);
  }
}
