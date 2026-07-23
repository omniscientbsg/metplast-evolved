import prisma from '@/lib/prisma';
import { SITE_SETTING_KEYS } from '@/lib/settings/site-settings';
import { SiteSettingsForm } from './SiteSettingsForm';

export const dynamic = 'force-dynamic';

export default async function SettingsAdminPage() {
  const rows = await prisma.setting.findMany({ select: { key: true, value: true } });
  const map = new Map(rows.map((r) => [r.key, r.value]));
  // Pre-fill each registry field with its saved value or its default.
  const initial: Record<string, string> = {};
  for (const f of SITE_SETTING_KEYS) {
    const saved = map.get(f.key);
    initial[f.key] = saved && saved.trim() !== '' ? saved : f.default;
  }
  return <SiteSettingsForm initial={initial} />;
}
