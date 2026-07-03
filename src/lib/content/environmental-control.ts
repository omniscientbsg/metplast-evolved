import { PageConfig } from '@/components/ScrollPageTemplate';

export const environmentalControlConfig: PageConfig = {
  hero: {
    title: "ENVIRONMENTAL CONTROL",
    subtitle: "Precision climate management systems, including cooling pads, exhaust fans, and smart control panels, to maintain optimal shed conditions.",
    image: "/images/Hero-Slider-2.jpg",
    ctaPrimary: { label: "Get a Quote", href: "/contact" },
    ctaSecondary: { label: "View Gallery", href: "/gallery" }
  },
  intro: [
    "A well-regulated environment is critical to maximizing poultry health and yield.",
    "Metplast’s Environmental Control Systems utilize advanced ventilation and cooling technology to draw fresh, cool air into the shed while exhausting hot, ammonia-rich air. This ensures a consistent, optimal climate regardless of external weather conditions."
  ],
  sections: [
    {
      id: "exhaust-fans",
      title: "High-Capacity Exhaust Fans",
      badge: "Ventilation",
      description: [
        "Our heavy-duty exhaust fans are engineered to provide maximum airflow with minimal energy consumption.",
        "Constructed with corrosion-resistant galvanized steel, these fans efficiently remove hot air and noxious gases, maintaining excellent air quality throughout the poultry house."
      ],
      features: [
        "Aerodynamic Blade Design – Maximizes air extraction volume",
        "Corrosion-Resistant Housing – Built for harsh farm environments",
        "Energy Efficient Motors – Reduces operational electricity costs",
        "Self-Opening Louvers – Prevents backdraft when not in operation"
      ],
      benefits: [
        "Dramatically improves indoor air quality",
        "Reduces heat stress, preventing flock mortality",
        "Lower energy bills due to high-efficiency motors"
      ],
      images: ["/images/Shed-8Tier-Cage.png"],
      specs: [
        { label: "Material", value: "Galvanized Steel / Stainless Steel" },
        { label: "Drive System", value: "Belt / Direct Drive" },
        { label: "Motor", value: "High Efficiency 3-Phase" },
        { label: "Louver System", value: "Automatic Centrifugal" },
      ]
    },
    {
      id: "cooling-pads",
      title: "Evaporative Cooling Pads",
      badge: "Temperature Control",
      description: [
        "Metplast’s Evaporative Cooling Pads offer a highly effective way to reduce shed temperatures during hot climates.",
        "Working in tandem with our exhaust fans, water is circulated through the cellulose pads. As hot outside air is pulled through the wet pads, water evaporates, dropping the air temperature before it enters the shed."
      ],
      features: [
        "High-Absorbency Cellulose Paper – Maximizes evaporation efficiency",
        "Anti-Fungal Treatment – Prevents algae and mold growth",
        "Stiffened Structural Design – Ensures long-lasting durability without sagging",
        "Integrated PVC Gutter System – Ensures uniform water distribution"
      ],
      benefits: [
        "Significant temperature reduction (up to 10-15°C drop)",
        "Maintains optimal humidity levels",
        "Prevents summer heat stress and production drops",
        "Easy to clean and maintain"
      ],
      // No real cooling-pad photo available yet — section renders text + specs
      images: [],
      specs: [
        { label: "Material", value: "Treated Cellulose Paper" },
        { label: "Frame", value: "PVC / Aluminum / Galvanized" },
        { label: "Thickness", value: "100mm / 150mm" },
        { label: "Water System", value: "Closed Loop Recirculation" },
      ]
    },
    {
      id: "control-panels",
      title: "Smart Control Panels",
      badge: "Automation",
      description: [
        "Take complete command of your farm's climate with Metplast's Smart Control Panels.",
        "Our intelligent systems constantly monitor indoor temperature and humidity, automatically adjusting fan speeds and cooling pad water pumps to maintain the precise microclimate required for your birds."
      ],
      features: [
        "Real-Time Monitoring – Precision sensors for temperature and humidity",
        "Automated Adjustments – Controls fans and pumps based on set parameters",
        "Alarm Systems – Alerts for power failures or extreme temperature shifts",
        "User-Friendly Interface – Easy to program and operate"
      ],
      benefits: [
        "Eliminates human error in climate management",
        "Optimizes energy usage by only running equipment when necessary",
        "Provides peace of mind with robust alarm systems",
        "Ensures consistent 24/7 climate stability"
      ],
      // No real control-panel photo available yet — section renders text + specs
      images: [],
      specs: [
        { label: "Sensors", value: "Temperature & Humidity" },
        { label: "Interface", value: "Digital Display / Touchscreen" },
        { label: "Phases", value: "Single / 3-Phase Compatible" },
        { label: "Safety", value: "Overload & Short-Circuit Protection" },
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
      title: "Breeder Solutions",
      desc: "Advanced housing to optimize fertility and hatchability.",
      href: "/breeder",
      color: "#f97316"
    },
    {
      title: "Broiler Solutions",
      desc: "High-performance rearing systems for superior meat yield.",
      href: "/broiler",
      color: "#f97316"
    }
  ]
};
