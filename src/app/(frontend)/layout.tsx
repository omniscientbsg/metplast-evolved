import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Chatbot } from "@/components/Chatbot";
import { getSiteSettings } from "@/lib/settings/get-site-settings";
import { SiteSettingsProvider } from "@/lib/settings/site-settings-context";

export const dynamic = 'force-dynamic';

export default async function FrontendLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSiteSettings();
  return (
    <SiteSettingsProvider value={settings}>
      <Navbar />
      {children}
      <Footer />
      <Chatbot />
    </SiteSettingsProvider>
  );
}
