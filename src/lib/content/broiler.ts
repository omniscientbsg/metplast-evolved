import { PageConfig } from '@/components/ScrollPageTemplate';

export const broilerConfig: PageConfig = {
  hero: {
    title: "BROILER POULTRY SYSTEMS",
    subtitle: "Designed for uniform feed access, clean water, better airflow, and practical shed management.",
    image: "/images/Broiler2.jpg",
    ctaPrimary: { label: "Get a Quote", href: "/contact" },
    ctaSecondary: { label: "View Gallery", href: "/gallery" }
  },
  intro: [
    "Metplast broiler systems cover deep litter housing and cage rearing — with pan feeding, nipple drinking, curtains, false ceiling, and ventilation integrated around the shed.",
    "Every setup is built for uniform feed access, clean water, better airflow, and practical day-to-day shed management.",
  ],
  sections: [
    {
      id: "deep-litter",
      calculatorHref: "/calculators/broiler",
      title: "Deep Litter Broiler Housing",
      badge: "Floor Rearing",
      description: [
        "The Deep Litter Broiler System is a cost-effective and flexible solution for commercial broiler farming — birds are housed on a bedding material-covered floor, allowing natural movement and comfortable growth.",
        "Metplast provides a fully integrated shed setup around this housing — pan feeding, nipple drinking, curtains, false ceiling, and ventilation — to simplify day-to-day management and support consistent growth performance."
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
      id: "pan-feeding",
      title: "Pan Feeding System",
      description: [
        "Uniform pans, controlled feed depth, and fast line filling — every bird finds feed within reach, and feed stays in the pan, not on the litter.",
      ],
      images: [],
      specs: [
        { label: "Feeder", value: "Pan line" },
        { label: "Feed Depth", value: "Controlled" },
        { label: "Coverage", value: "Full shed length" },
      ]
    },
    {
      id: "nipple-drinking",
      title: "Nipple Drinking System",
      description: [
        "Clean water at the right height at every age, with auto flush available — medicine residue and stagnant water are flushed out before birds drink.",
      ],
      images: [],
      specs: [
        { label: "Drinker", value: "Nipple line with cups" },
        { label: "Height", value: "Adjustable by age" },
        { label: "Auto Flush", value: "Available" },
      ],
      bottomBlocks: [
        { type: 'auto-flush' },
      ]
    },
    {
      id: "curtain",
      title: "Curtain System",
      description: [
        "Practical side-curtain control for airflow and temperature management in open and semi-controlled sheds.",
      ],
      images: [],
      specs: [
        { label: "Type", value: "Side curtain" },
        { label: "Control", value: "Manual / winch" },
        { label: "Use", value: "Open & semi-controlled sheds" },
      ]
    },
    {
      id: "false-ceiling",
      title: "False Ceiling",
      description: [
        "Reduces the air volume to be managed, improves air speed over birds, and makes summer and winter management easier and cheaper.",
      ],
      images: [],
      specs: [
        { label: "Benefit", value: "Lower managed air volume" },
        { label: "Effect", value: "Higher air speed over birds" },
        { label: "Season", value: "Summer & winter management" },
      ]
    },
    {
      id: "ventilation",
      title: "Ventilation Integration",
      description: [
        "Metplast exhaust fans, air inlets, and cooling integrate with the shed design — one supplier, one responsibility.",
      ],
      images: [],
      specs: [
        { label: "Equipment", value: "Exhaust fans, inlets, cooling" },
        { label: "Integration", value: "Designed with the shed" },
      ],
      benefits: [
        "Explore Environmental Control →",
      ]
    },
    {
      id: "h-type-broiler",
      calculatorHref: "/calculators/broiler",
      title: "H-Type Broiler Cage System",
      badge: "Cage Rearing",
      description: [
        "Practical multi-tier broiler rearing for farms that want more birds per square foot of land with organised feeding, drinking, and manure handling.",
      ],
      features: [
        "Multi-Tier Rearing – More birds reared per square foot of shed floor across stacked tiers.",
        "Automated Pan Feeding – Consistent feed delivery across every tier, reducing manual handling.",
        "Automated Manure Removal – Belt system keeps the shed clean with less daily labour.",
        "Organised Drinking Lines – Nipple lines arranged per tier for reliable water access."
      ],
      images: [],
      specs: [
        { label: "Cage Type", value: "H-Type Broiler Cage System" },
        { label: "Feeding", value: "Automated pan" },
        { label: "Drinker", value: "Nipple line (auto flush available)" },
        { label: "Manure System", value: "Automated belt" },
        { label: "Automation Level", value: "Multi-tier automatic" },
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
