import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Chatbot } from "@/components/Chatbot";
import { getSiteSettings } from "@/lib/settings/get-site-settings";
import { SiteSettingsProvider } from "@/lib/settings/site-settings-context";
import { getMiscContent } from "@/lib/content/get-misc-content";
import { MiscContentProvider } from "@/lib/content/misc-content-context";

export const dynamic = 'force-dynamic';

export default async function FrontendLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [settings, misc] = await Promise.all([getSiteSettings(), getMiscContent()]);
  return (
    <SiteSettingsProvider value={settings}>
      <MiscContentProvider value={misc}>
        <Navbar />
        {children}
        <Footer />
        <Chatbot />
      </MiscContentProvider>
    </SiteSettingsProvider>
  );
}
