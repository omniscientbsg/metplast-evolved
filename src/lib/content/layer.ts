import { PageConfig } from '@/components/ScrollPageTemplate';

export const layerConfig: PageConfig = {
  hero: {
    title: "LAYER POULTRY SYSTEMS",
    subtitle: "Designed for uniform feed access, clean egg handling, stronger cage life, and consistent layer production.",
    image: "/images/Layer2.jpg",
    ctaPrimary: { label: "Get a Quote", href: "/contact" },
    ctaSecondary: { label: "View Gallery", href: "/gallery" }
  },
  intro: [
    "Metplast designs and installs complete layer cage systems built around uniform feed access, clean egg handling, and long cage life.",
    "Every system is engineered for practical daily management and consistent layer production."
  ],
  sections: [
    {
      id: "h-type",
      calculatorHref: "/calculators/layer",
      title: "H-Type Layer Cage System",
      description: [
        "A fully integrated layer cage system for farms that need efficient space use, smooth egg handling, clean manure removal, and practical daily management."
      ],
      topBlocks: [
        {
          type: 'info',
          id: 'layer-numbers',
          heading: 'Built on the Right Numbers',
          lines: [
            'Box front: 30 inches · Box depth: 26 inches · 10 birds per box',
            'Space per bird: 78 sq. in. (~503 cm²) · Feeding space per bird: 3 inches',
            'Feeding space decides whether every bird eats at the same time. 3 inches of feeder front per bird means no bird waits, no bird competes — so the flock grows uniform, and uniform birds give uniform eggs and stable daily production.',
            'Space per bird decides comfort. Adequate floor area lowers crowding stress, protects feather condition, and keeps livability and lay rate consistent across the full laying cycle.',
          ],
        },
      ],
      features: [
        "Uniform Feed Distribution – Every bird gets 3 inches of feeder front. Consistent access across all tiers reduces competition and drives uniform flock performance.",
        "Gentle Egg Movement – Engineered egg roll for smooth travel and cleaner collection — fewer cracks, less handling stress, better-grade eggs.",
        "Niagara Egg Collection System – Automated vertical egg collection transfers eggs from every tier to a single collection point — less labour, cleaner eggs.",
        "UV-Stabilized PP Manure Belt – A durable polypropylene belt built for daily use — cleaner sheds, lower ammonia and smell, easier routine maintenance.",
        "Trolley Feeding System – Trolley feeding comes standard on every H-Type Layer line — controlled, consistent feed delivery across the full cage row.",
        "Strong GI Cage Structure – Galvanized construction built for long service life, corrosion resistance, and stable alignment flock after flock."
      ],
      benefits: [
        "Cleaner eggs",
        "Better manure handling",
        "Reduced daily labour",
        "Uniform feed access",
        "Better shed hygiene",
        "Longer cage service life",
        "Built for scalable layer farms"
      ],
      images: ["/images/Hero-Slider-1.jpg"],
      specs: [
        { label: "Cage Type", value: "H-Type Layer Cage System" },
        { label: "Birds per Box", value: "10" },
        { label: "Box Front", value: "30 in" },
        { label: "Box Depth", value: "26 in" },
        { label: "Feeding Space per Bird", value: "3 in" },
        { label: "Area per Bird", value: "78 sq. in (~503 cm²)" },
        { label: "Material & Coating", value: "GI structure" },
        { label: "Manure System", value: "UV-stabilized PP belt" },
        { label: "Egg Collection", value: "Niagara vertical system" },
        { label: "Feeding", value: "Trolley (standard)" },
        { label: "Feeder Options", value: "ZAM / Aluminium / GI / PVC" },
        { label: "Automation Level", value: "Automatic-ready" },
      ]
    },
    {
      id: "s-frame",
      calculatorHref: "/calculators/layer",
      tag: "The Upgrade-Ready Cage",
      title: "S-Frame Layer Cage System",
      description: [
        "A modern alternative to traditional California-style layer cages — start manual, grow into automation, never replace your cages.",
        "Traditional California-style cages are simple and familiar. S-Frame keeps that practicality and builds on it — a stronger GI structure, better bird space, cleaner alignment, improved airflow, and a frame that is automation-ready from day one.",
      ],
      features: [
        "Stronger GI Structure – A stable, aligned frame designed for a longer working life than basic traditional layouts.",
        "Better Bird Space – Improved usable area per bird compared with basic California-style layouts.",
        "Improved Ventilation – Open structure lets air move around the birds, not past them.",
        "Manual-to-Automatic Upgrade Path – Manure belt, feeding trolley, and egg collection can be added as the farm grows.",
        "Trolley Feeding Available – The same trolley feeding used on our H-Type lines can be configured on S-Frame.",
        "Cleaner Long-Term Layout – Better alignment and stronger support across multiple flocks.",
      ],
      benefits: [
        "Better bird comfort",
        "Better airflow",
        "Longer cage life",
        "One investment, three automation stages",
        "Lower replacement pressure",
        "The modern answer to California/patti cage layouts",
      ],
      images: ["/images/gallery/1-3-600x540.jpg"],
      bottomBlocks: [
        { type: 'upgrade-path' },
        { type: 'feeder-materials' },
      ],
      specs: [
        { label: "Cage Type", value: "S-Frame Layer Cage System" },
        { label: "Structure", value: "GI, automation-ready" },
        { label: "Feeding", value: "Trolley available" },
        { label: "Manure System", value: "Belt (available)" },
        { label: "Egg Collection", value: "Manual → automatic (upgrade path)" },
        { label: "Feeder Options", value: "ZAM / Aluminium / GI / PVC" },
        { label: "Automation Level", value: "Manual → Semi-Auto → Automatic (same frame)" },
      ]
    },
    {
      id: "layer-pullet",
      calculatorHref: "/calculators/layer-pullet",
      title: "Layer Pullet Cage",
      badge: "Chick-cum-Grower",
      description: [
        "Pullets are chicks in their growing stage — there is no egg production and no egg collection at this stage. What matters is uniform growth, because a uniform pullet flock becomes a high-performing layer flock."
      ],
      features: [
        "Uniform Growth Design – Equal feed and water access so the flock grows together.",
        "Adjustable Nipple Drinking Line – Height adjusts as chicks grow, from day-old to transfer.",
        "Multi-Tier Configurations – Grow more birds in the same shed footprint.",
        "Clean Manure Removal – Healthier growing environment, lower disease pressure.",
        "Strong GI Construction – The same cage life standard as our layer systems.",
        "Easy Access for Management – Vaccination, grading, and inspection without stress.",
      ],
      benefits: [
        "Better Pullet Development for high productivity",
        "Easy Access & Handling for daily monitoring",
        "Consistent Hydration supports optimal health",
        "Higher Survivability Rates with stress-free environment"
      ],
      images: ["/images/LP3.png"],
      specs: [
        { label: "Target Age", value: "Day-Old to 14 Weeks" },
        { label: "Cage Mats", value: "Premium anti-blister" },
        { label: "Water System", value: "Adjustable Nipple" },
        { label: "Egg Collection", value: "Not applicable (growing stage)" },
      ]
    }
  ],
  pageBlocks: [
    { type: 'customization' },
  ],
  crossLinks: [
    {
      title: "Environmental Control",
      desc: "Cooling pads, exhaust fans, and smart control panels to maintain optimal layer shed climate.",
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
      title: "Layer Calculators",
      desc: "Calculate your farm's exact requirements for layer cages and equipment.",
      href: "/calculators",
      color: "#3b82f6"
    }
  ]
};
