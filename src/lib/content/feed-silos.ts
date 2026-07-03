import { PageConfig } from '@/components/ScrollPageTemplate';

export const feedSilosConfig: PageConfig = {
  hero: {
    title: "FEED SILOS",
    subtitle: "Galvanized steel feed silos designed for secure storage, weather protection, and automated distribution across your poultry farm.",
    image: "/images/Untitled-design-7-560x690.jpg",
    ctaPrimary: { label: "Get a Quote", href: "/contact" },
    ctaSecondary: { label: "View Gallery", href: "/gallery" }
  },
  intro: [
    "Efficient feed management is the backbone of a profitable poultry operation.",
    "Metplast’s Feed Silos provide a highly durable, weather-proof solution for bulk feed storage. Integrated seamlessly with our automated feeding systems, they ensure a continuous, uncontaminated supply of feed to your flock."
  ],
  sections: [
    {
      id: "silo-storage",
      title: "Galvanized Feed Silos",
      badge: "Bulk Storage",
      description: [
        "Constructed from high-grade corrugated galvanized steel, our silos are built to withstand harsh environmental conditions while protecting feed from moisture, pests, and contamination.",
        "The specialized roof design prevents condensation buildup, ensuring feed remains fresh and mold-free."
      ],
      features: [
        "Corrugated Galvanized Steel – Exceptional strength and rust resistance",
        "Weather-Proof Roof – Protects feed from rain and internal condensation",
        "Pneumatic or Mechanical Filling – Flexible loading options",
        "Smooth Inner Funnel – Ensures consistent feed flow without bridging"
      ],
      benefits: [
        "Drastically reduces feed wastage and contamination",
        "Protects expensive feed inventory from pests and weather",
        "Lowers labor costs associated with manual feed handling",
        "Ensures uninterrupted feed supply to the bird houses"
      ],
      images: ["/images/Untitled-design-7-560x690.jpg"],
      specs: [
        { label: "Material", value: "High-Tensile Galvanized Steel" },
        { label: "Capacities", value: "3 Tons to 30+ Tons" },
        { label: "Roof Design", value: "Anti-Condensation Profile" },
        { label: "Filling", value: "Pneumatic Pipe / Manual Hatch" },
      ]
    },
    {
      id: "auger-systems",
      title: "Auger Conveyor Systems",
      badge: "Automated Distribution",
      description: [
        "Our coreless auger systems transport feed directly from the silo to the shed's feeding lines with zero manual intervention.",
        "Designed for smooth, fast, and quiet operation, the flexible auger tubes can navigate corners and long distances without degrading the feed quality."
      ],
      features: [
        "Coreless Steel Auger – Highly durable and flexible",
        "UV-Resistant PVC Tubing – Protects feed during transport",
        "Automated Sensors – Stops the motor when hoppers are full",
        "High Conveying Capacity – Fills sheds rapidly"
      ],
      benefits: [
        "Eliminates manual feed carrying and related labor",
        "Maintains feed integrity without grinding pellets",
        "Fully automated, sensor-driven operation",
        "Quiet operation minimizes bird stress"
      ],
      images: [],
      specs: [
        { label: "Auger Material", value: "High-Carbon Spring Steel" },
        { label: "Tube Material", value: "Heavy-Duty PVC" },
        { label: "Drive Motor", value: "3-Phase / Single-Phase" },
        { label: "Control", value: "Sensor-Automated" },
      ]
    }
  ],
  crossLinks: [
    {
      title: "Layer Solutions",
      desc: "Precision-engineered cages for maximum egg production.",
      href: "/layer",
      color: "#f97316"
    },
    {
      title: "Broiler Solutions",
      desc: "High-performance rearing systems for superior meat yield.",
      href: "/broiler",
      color: "#f97316"
    },
    {
      title: "Breeder Solutions",
      desc: "Advanced housing to optimize fertility and hatchability.",
      href: "/breeder",
      color: "#f97316"
    }
  ]
};
