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
      title: "H-Type Breeder Cage",
      badge: "Breeder Management",
      description: [
        "To enhance breeding efficiency, we offer a custom placement option for male birds, streamlining the artificial insemination process for improved breeding outcomes.",
        "Additionally, our innovative cage structure significantly reduces egg breakage, ensuring higher-quality yields and improved farm efficiency."
      ],
      features: [
        "Custom Male Bird Placement – Enhances efficiency during artificial insemination",
        "Controlled Feeding – Trolley feeding keeps breeder body weight on target",
        "Egg Protection Design – Specially sloped floors reduce breakage",
        "Superior Build Quality – Ergonomically designed for comfort"
      ],
      benefits: [
        "Supports cleaner hatching egg handling and easier AI workflow",
        "Supports a well-organized breeding environment for the flock",
        "Superior Egg Quality ensures higher-grade hatching eggs",
        "Long-Lasting Durability with premium galvanized materials"
      ],
      images: ["/images/gallery/4-1-600x540.jpg"],
      specs: [
        { label: "Design", value: "H-Type Vertical" },
        { label: "Feeding System", value: "Trolley / Chain" },
        { label: "Insemination Access", value: "Custom placement doors" },
        { label: "Manure Removal", value: "Automated Belt" },
      ]
    },
    {
      id: "breeder-pullet",
      calculatorHref: "/calculators/breeder-pullet",
      title: "Breeder Pullet Cage",
      badge: "Chick-cum-Grower",
      description: [
        "Metplast’s Breeder Pullet Cages are expertly designed to provide a safe, comfortable, and nurturing environment for chicks from day-old to 14 weeks.",
        "Our high-quality cage mats are specially designed to prevent blisters and foot-related issues, promoting stronger and healthier breeder birds."
      ],
      features: [
        "Premium Cage Mats – Prevents blisters and foot injuries",
        "Adjustable Nipple Drinking System – Adapts to chick growth",
        "Durable & Hygienic Design – Easy to clean, reducing disease risks",
        "Optimized Space Utilization – Enhances bird comfort"
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
      ]
    }
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
