import { PageConfig } from '@/components/ScrollPageTemplate';

export const broilerConfig: PageConfig = {
  hero: {
    title: "BROILER SOLUTIONS",
    subtitle: "High-performance rearing systems, from automated deep litter to space-saving multi-tier battery cages, designed for superior meat yield and flock health.",
    image: "/images/Broiler2.jpg",
    ctaPrimary: { label: "Get a Quote", href: "/contact" },
    ctaSecondary: { label: "View Gallery", href: "/gallery" }
  },
  intro: [
    "Metplast’s Broiler Rearing Solutions provide a combination of high efficiency, excellent bird health, and superior meat yield, making them ideal for modern poultry farms.",
    "Whether you prefer the cost-effective flexibility of a Deep Litter System or the high-density optimization of our H-Type Battery Cages, we have the complete automated solution for you."
  ],
  sections: [
    {
      id: "deep-litter",
      calculatorHref: "/calculators/broiler",
      title: "Deep Litter Broiler System",
      badge: "Floor Rearing",
      description: [
        "The Deep Litter Broiler System is a cost-effective and flexible solution for commercial broiler farming.",
        "Birds are housed on a bedding material-covered floor, ensuring natural movement and comfortable growth. Metplast provides a fully automated setup to simplify farm management and maximize growth performance."
      ],
      features: [
        "Automated Pan Feeding System – High-capacity pans ensure even distribution",
        "Nipple Drinking System – Easy-access water supply promotes hydration",
        "Brooding & Heating Equipment – Ensures optimal chick comfort",
        "Poultry Curtains & Ventilation – Controls temperature and airflow"
      ],
      benefits: [
        "Better Bird Welfare allowing free movement and stronger legs",
        "Lower Initial Investment requiring minimal infrastructure",
        "Reduced Feed Waste with ergonomically designed feeders",
        "Scalable for Any Farm Size from small to large-scale operations"
      ],
      images: [],
      specs: [
        { label: "Design", value: "Automated Floor/Litter" },
        { label: "Feeding System", value: "Automated Pan Line" },
        { label: "Water System", value: "Nipple Line with Cups" },
        { label: "Ventilation", value: "Curtain / Tunnel" },
      ]
    },
    {
      id: "battery-cage",
      calculatorHref: "/calculators/broiler",
      title: "H-Type Broiler Battery Cage",
      badge: "High Density",
      description: [
        "Metplast’s H-Type Broiler Battery Cages provide an innovative, space-efficient solution for intensive broiler farming.",
        "With a multi-tier vertical design, this system allows high stocking density, reducing the overall farm footprint while ensuring healthy growth conditions for the birds."
      ],
      features: [
        "High-Density Rearing – Multi-tier design allows more birds per square meter",
        "Optimized Feed Conversion – Precision feeding system improves weight gain",
        "Automated Manure Removal – Ensures a hygienic environment",
        "Bird Harvesting System – Streamlines the collection process"
      ],
      benefits: [
        "Improved FCR (Feed Conversion Ratio) with efficient feed utilization",
        "Space Optimization leading to increased profitability",
        "Hygienic & Disease-Free Environment reduces mortality",
        "Superior Meat Quality through healthy rearing conditions"
      ],
      images: ["/images/Broiler2.jpg"],
      specs: [
        { label: "Design", value: "H-Type Vertical" },
        { label: "Feeding System", value: "Automated Pan" },
        { label: "Manure Removal", value: "Automated Belt" },
        { label: "Harvesting", value: "Integrated Conveyor" },
      ]
    }
  ],
  crossLinks: [
    {
      title: "Environmental Control",
      desc: "Cooling pads, exhaust fans, and smart control panels to maintain optimal broiler climate.",
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
      title: "Broiler Calculators",
      desc: "Calculate your farm's exact requirements for broiler equipment.",
      href: "/calculators",
      color: "#3b82f6"
    }
  ]
};
