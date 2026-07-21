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
      title: "S-Frame / A-Frame Layer Cage",
      badge: "Manual / Semi-Auto",
      description: [
        "Metplast’s A-Frame Commercial Layer Cages provide an affordable and efficient solution for poultry farms, ensuring optimal bird comfort, easy management, and high egg production.",
        "Designed for manual operations, these cages are durable, easy to maintain, and maximize farm efficiency."
      ],
      features: [
        "Optimized cage height – For bird comfort and higher egg production",
        "Sturdy construction – Ensures long-term durability and reliability",
        "Well-ventilated design – To reduce heat stress and mortality",
        "Manual feeding and watering system – Promotes consistent development"
      ],
      benefits: [
        "Cost-effective and durable manual cage system",
        "High space utilization for maximum bird capacity",
        "Designed for high egg yield, minimizing stress",
        "Proven and efficient system for commercial production"
      ],
      images: ["/images/gallery/1-3-600x540.jpg"],
      specs: [
        { label: "Design", value: "A-Frame / Pyramid" },
        { label: "Feeding System", value: "Manual / Semi-Auto" },
        { label: "Manure Removal", value: "Scraper / Manual" },
        { label: "Egg Collection", value: "Manual" },
      ]
    },
    {
      id: "layer-pullet",
      calculatorHref: "/calculators/layer-pullet",
      title: "Layer Pullet Cage",
      badge: "Chick-cum-Grower",
      description: [
        "The ideal start for healthy & productive layers. Metplast’s Layer Pullet Cages are designed to provide a safe, comfortable, and growth-focused environment for pullets from day-old to maturity.",
        "Built with precision engineering, these cages ensure optimal development, preparing birds for a highly productive laying phase."
      ],
      features: [
        "Adjustable Nipple Drinking System – Provides consistent water access",
        "Swing-Open Doors – Ensures effortless bird handling and monitoring",
        "Optimized Space Utilization – Maximizes farm capacity",
        "Hygienic & Easy to Maintain – Reduces disease risk"
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
        { label: "Egg Collection", value: "N/A" },
      ]
    }
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
