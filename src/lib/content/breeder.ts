import { PageConfig } from '@/components/ScrollPageTemplate';

export const breederConfig: PageConfig = {
  hero: {
    title: "BREEDER POULTRY SYSTEMS",
    subtitle: "Designed for male-female management, uniform feeding, cleaner hatching eggs, and easier AI workflow.",
    image: "/images/Breeder2.jpg",
    ctaPrimary: { label: "Get a Quote", href: "/contact" },
    ctaSecondary: { label: "View Gallery", href: "/gallery" }
  },
  intro: [
    "Metplast’s breeder cage systems are designed around bird comfort, controlled feeding, male-female placement, AI access, and cleaner hatching egg handling.",
    "Built to support consistent breeder management across the flock."
  ],
  sections: [
    {
      id: "h-type-breeder",
      calculatorHref: "/calculators/breeder",
      title: "H-Type Breeder Cage System",
      badge: "Breeder Management",
      description: [
        "A breeder cage system designed around bird comfort, controlled feeding, male-female placement, AI access, and cleaner hatching egg handling.",
      ],
      topBlocks: [
        {
          type: 'info',
          id: 'breeder-boxes',
          heading: 'Box Sizes Built Around Your Breed',
          lines: [
            'Female boxes are available in three front widths — 18", 18.75", and 19.5" — housing 2 females per box.',
            'Box selection is matched to breed, target body weight, and your hatchery’s egg handling plan, so birds get the space the breed actually needs.',
          ],
        },
      ],
      features: [
        "Male-Female Layout Planning – Cage planning supports practical male and female placement for easier day-to-day breeder management.",
        "AI-Friendly Access – Layout planned to cut unnecessary worker movement during artificial insemination — faster rounds, calmer birds.",
        "Controlled Feeding – Touchscreen trolley feeding with per-box calibration keeps breeder body weight exactly where it should be.",
        "Cleaner Hatching Egg Handling – Egg roll and collection planned to reduce handling and keep hatching eggs clean.",
        "Engineered Wire & Structure – Wire diameter, mesh, and GI/ZAM coating are specified for bird comfort and long structural life — the wire under the bird decides foot health and egg cleanliness, so we don't treat it as an afterthought.",
        "Custom Feeder Options – ZAM, aluminium, GI, or PVC feeders — selected per project requirement.",
        "Inspection Cart Compatibility – Designed to support safe inspection across higher tiers.",
      ],
      bottomBlocks: [
        { type: 'feeding-trolley' },
        { type: 'auto-flush' },
      ],
      benefits: [
        "Supports cleaner hatching egg handling and easier AI workflow",
        "Supports a well-organized breeding environment for the flock",
        "Superior Egg Quality ensures higher-grade hatching eggs",
        "Long-Lasting Durability with premium galvanized materials"
      ],
      images: ["/images/gallery/4-1-600x540.jpg"],
      specs: [
        { label: "Cage Type", value: "H-Type Breeder Cage System" },
        { label: "Female Boxes", value: "18 / 18.75 / 19.5 in front" },
        { label: "Birds per Box", value: "2 females per box" },
        { label: "Feeding", value: "10\" touchscreen trolley" },
        { label: "Material & Coating", value: "GI / ZAM" },
        { label: "Manure System", value: "UV-stabilized PP belt" },
        { label: "Egg Collection", value: "Planned egg roll + collection" },
        { label: "Feeder Options", value: "ZAM / Aluminium / GI / PVC" },
        { label: "Automation Level", value: "AI-friendly, trolley-fed" },
      ]
    },
    {
      id: "breeder-pullet",
      calculatorHref: "/calculators/breeder-pullet",
      title: "Breeder Pullet Cage",
      badge: "Chick-cum-Grower",
      description: [
        "Pullets are chicks — no egg production, no egg collection. Uniform breeder pullets are the foundation of breeder performance later."
      ],
      features: [
        "Uniform Growth – Equal feed and water access so the flock grows together.",
        "Adjustable Nipple Line – Height adjusts as chicks grow, from day-old to transfer.",
        "Clean Manure Removal – Healthier growing environment, lower disease pressure.",
        "Multi-Tier Option – Grow more birds in the same shed footprint.",
        "Strong GI Construction – The same cage life standard as our breeder systems.",
        "Easy Inspection – Vaccination, grading, and inspection without stress.",
      ],
      benefits: [
        "Stronger & Healthier Birds with thoughtful foot-protection design",
        "Consistent Hydration across all growth stages",
        "Higher Survivability with safe and comfortable conditions",
        "Improved Farm Efficiency with structured design"
      ],
      images: ["/images/Breeder-Pullet-T2.png"],
      specs: [
        { label: "Target Age", value: "Day-Old to 14 Weeks" },
        { label: "Floor System", value: "Specialized Cage Mats" },
        { label: "Water System", value: "Adjustable Nipple" },
        { label: "Feeding", value: "Automated Pan/Chain" },
        { label: "Egg Collection", value: "Not applicable (growing stage)" },
      ]
    }
  ],
  pageBlocks: [
    { type: 'feeder-materials' },
    { type: 'lighting' },
    { type: 'customization' },
  ],
  crossLinks: [
    {
      title: "Environmental Control",
      desc: "Cooling pads, exhaust fans, and smart control panels to maintain optimal breeder climate.",
      href: "/environmental-control",
      color: "#14b8a6"
    },
    {
      title: "Feed Silos",
      desc: "Galvanized steel silos for safe and efficient feed storage and distribution.",
      href: "/feed-silos",
      color: "#eab308"
    },
    {
      title: "Breeder Calculators",
      desc: "Calculate your farm's exact requirements for breeder cages and equipment.",
      href: "/calculators",
      color: "#3b82f6"
    }
  ]
};
