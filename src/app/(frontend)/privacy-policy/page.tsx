import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Metplast Industries",
  description: "How Metplast Industries collects, uses, and protects your information.",
};

const sections = [
  {
    title: "Information We Collect",
    body: "When you send an enquiry, request a quote, or download a brochure, we collect the details you provide — such as your name, farm or company name, phone number, email address, country, bird type, and project requirements. We also record the page you enquired from so our team can respond with the right product information.",
  },
  {
    title: "How We Use Your Information",
    body: "Your details are used only to respond to your enquiry, prepare quotations, share product information and brochures, and follow up on your poultry project. We do not sell or rent your personal information to third parties.",
  },
  {
    title: "Data Storage",
    body: "Enquiry details are stored securely and are accessible only to the Metplast sales and engineering team. You may ask us to update or delete your details at any time by writing to info@metplast.com.",
  },
  {
    title: "Cookies & Analytics",
    body: "Our website may use basic analytics to understand which pages visitors find useful. This data is aggregated and does not personally identify you.",
  },
  {
    title: "Contact",
    body: "For any privacy-related questions, contact us at info@metplast.com or +91 89284 05002. Metplast Industries, Plot No. 207, Atkargaon, Dheku Road, Sajgaon Phata, Khalapur, Dist. Raigad, MH-410203, India.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[var(--bg)] pt-40 pb-24 px-6">
      <div className="max-w-[900px] mx-auto">
        <h1 className="text-4xl md:text-6xl font-['Space_Grotesk'] font-black text-[var(--text)] tracking-tighter mb-4">
          PRIVACY POLICY.
        </h1>
        <p className="text-[var(--text-muted)] font-medium mb-16">
          Last updated: July 2026
        </p>
        <div className="space-y-12">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="text-2xl font-bold text-[var(--text)] mb-3 font-['Space_Grotesk']">
                {s.title}
              </h2>
              <p className="text-[var(--text-muted)] text-lg leading-relaxed font-medium">
                {s.body}
              </p>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
