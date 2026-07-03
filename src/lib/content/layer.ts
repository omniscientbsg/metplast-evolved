import { PageConfig } from '@/components/ScrollPageTemplate';

export const layerConfig: PageConfig = {
  hero: {
    title: "LAYER SOLUTIONS",
    subtitle: "Precision-engineered cage systems designed for maximum egg production, optimal bird health, and seamless farm efficiency.",
    image: "/images/Layer2.jpg",
    ctaPrimary: { label: "Get a Quote", href: "/contact" },
    ctaSecondary: { label: "View Gallery", href: "/gallery" }
  },
  intro: [
    "Metplast’s Layer Cages are meticulously designed to deliver exceptional performance and efficiency for commercial egg producers.",
    "Engineered for optimal bird health and farm productivity, our cages ensure uniform feed distribution, reducing waste while promoting consistent nutrition and maximum egg yield."
  ],
  sections: [
    {
      id: "h-type",
      calculatorHref: "/calculators/layer",
      title: "H-Type Layer Battery Cage",
      badge: "Commercial Production",
      description: [
        "With a multi-tier vertical design, our H-Type cages maximize space utilization, enhancing farm efficiency without compromising bird welfare.",
        "The increased box height ensures better bird comfort, while the advanced manure removal system keeps the environment clean and hygienic."
      ],
      features: [
        "Uniform Feed Distribution – Ensures optimal nutrition, reducing feed waste",
        "Multi-Tier Space Optimization – Maximizes farm efficiency",
        "Increased Box Height – Provides enhanced comfort, reducing stress",
        "Advanced Manure Removal System – Keeps the environment clean",
        "Gentle Egg Collection System – Minimizes damage, ensuring higher-quality yields"
      ],
      benefits: [
        "Higher Egg Quality & Yield with gentle transport",
        "Better Bird Health & Comfort with spacious design",
        "Efficient Waste Management keeps the farm cleaner",
        "Maximized Farm Efficiency with vertical space saving"
      ],
      images: ["/images/Hero-Slider-1.jpg"],
      specs: [
        { label: "Design", value: "H-Type Vertical" },
        { label: "Feeding System", value: "Trolley / Chain" },
        { label: "Manure Removal", value: "Automated Belt" },
        { label: "Egg Collection", value: "Automated Elevator" },
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
