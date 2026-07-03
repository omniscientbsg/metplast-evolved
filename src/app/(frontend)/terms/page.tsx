import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use | Metplast Industries",
  description: "Terms governing the use of the Metplast Industries website.",
};

const sections = [
  {
    title: "Use of This Website",
    body: "This website provides information about Metplast Industries' poultry housing, cage systems, and farm equipment. Content is provided for general information and enquiry purposes.",
  },
  {
    title: "Product Information & Specifications",
    body: "Product specifications, capacities, and calculator outputs shown on this website are indicative planning estimates. Final specifications, layouts, and pricing are confirmed only in a formal quotation from the Metplast team after reviewing your project details.",
  },
  {
    title: "Calculators",
    body: "Farm calculators are planning tools. Results are preliminary estimates based on the inputs you provide and do not constitute an engineering drawing, commitment, or quotation.",
  },
  {
    title: "Intellectual Property",
    body: "All content on this website — including text, photographs, product designs, and the Metplast name and logo — belongs to Metplast Industries and may not be reproduced without written permission.",
  },
  {
    title: "Contact",
    body: "Questions about these terms can be sent to info@metplast.com or +91 89284 05002.",
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[var(--bg)] pt-40 pb-24 px-6">
      <div className="max-w-[900px] mx-auto">
        <h1 className="text-4xl md:text-6xl font-['Space_Grotesk'] font-black text-[var(--text)] tracking-tighter mb-4">
          TERMS OF USE.
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
