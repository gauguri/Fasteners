import {
  Category,
  CustomerDocument,
  Order,
  Product,
  Quote,
  Series
} from "@/lib/types";

export const categories: Category[] = [
  {
    slug: "bolts",
    name: "Bolts",
    description: "High-strength close-tolerance bolts for aerospace, defense, and structural assemblies.",
    hero: "Procurement-ready bolts with cert-backed traceability and packaging discipline."
  },
  {
    slug: "screws",
    name: "Screws",
    description: "Machine screws and specialty screws for avionics panels, housings, and mission systems.",
    hero: "Precision screws with controlled finishes, grip ranges, and consistent documentation."
  },
  {
    slug: "nuts",
    name: "Nuts",
    description: "All-metal lock nuts, self-locking nuts, and specialty retaining hardware.",
    hero: "Secure locking performance built for vibration, temperature, and maintenance-heavy environments."
  },
  {
    slug: "washers",
    name: "Washers",
    description: "Flat, lock, and specialty washers to complete spec-sensitive assemblies.",
    hero: "Traceable washer inventory aligned to demanding defense build standards."
  }
];

export const series: Series[] = [
  {
    slug: "an",
    name: "AN Series",
    description: "Legacy Air Force-Navy hardware still widely specified across defense supply chains.",
    categorySlug: "bolts"
  },
  {
    slug: "ms",
    name: "MS Series",
    description: "Military Standard parts covering mature, interoperable fastener requirements.",
    categorySlug: "screws"
  },
  {
    slug: "nas",
    name: "NAS Series",
    description: "National Aerospace Standard hardware for higher-performance structural applications.",
    categorySlug: "bolts"
  },
  {
    slug: "bacb",
    name: "BACB Series",
    description: "OEM-driven fastener series often used in aerospace build packages and repair kits.",
    categorySlug: "nuts"
  }
];

type BackendSeed = {
  standard: string;
  material: string;
  finish: string;
  diameter?: string;
  thread?: string;
  length?: string;
  gripLength?: string;
  headStyle?: string;
  drive?: string;
  listPrice: number;
  packSize: number;
  minimumOrderQuantity: number;
  totalAvailable: number;
  reserved: number;
  leadTimeDays: number;
  alternates?: Array<{ partNumber: string; slug: string; reason: string }>;
  supersession?: Product["supersession"];
  certifications?: string[];
  exportControl?: Product["compliance"]["exportControl"];
};

function catalogBackend(seed: BackendSeed) {
  const netTermsPrice = Number((seed.listPrice * 0.92).toFixed(2));

  return {
    specs: {
      standard: seed.standard,
      material: seed.material,
      finish: seed.finish,
      diameter: seed.diameter,
      thread: seed.thread,
      length: seed.length,
      gripLength: seed.gripLength,
      headStyle: seed.headStyle,
      drive: seed.drive
    },
    inventory: {
      totalAvailable: seed.totalAvailable,
      reserved: seed.reserved,
      warehouses: [
        {
          code: "DAY",
          name: "Dayton Defense Hub",
          available: Math.max(0, Math.floor(seed.totalAvailable * 0.62) - seed.reserved),
          leadTimeDays: seed.leadTimeDays
        },
        {
          code: "PHX",
          name: "Phoenix Aerospace Stockroom",
          available: Math.max(0, Math.ceil(seed.totalAvailable * 0.38)),
          leadTimeDays: seed.leadTimeDays + 2
        }
      ],
      lastSyncedAt: "2026-05-05T08:30:00-04:00"
    },
    pricing: {
      listPrice: seed.listPrice,
      currency: "USD" as const,
      priceBreaks: [
        { quantity: seed.minimumOrderQuantity, unitPrice: seed.listPrice },
        { quantity: seed.minimumOrderQuantity * 5, unitPrice: Number((seed.listPrice * 0.95).toFixed(2)) },
        { quantity: seed.minimumOrderQuantity * 20, unitPrice: Number((seed.listPrice * 0.88).toFixed(2)) }
      ],
      customerPricing: [
        {
          accountId: "acct-atlas",
          accountName: "Atlas Defense Systems",
          price: netTermsPrice,
          contract: "ADS-2026-AOG"
        },
        {
          accountId: "acct-nha",
          accountName: "North Harbor Avionics",
          price: Number((seed.listPrice * 0.9).toFixed(2)),
          contract: "NHA-MRO-STD"
        }
      ]
    },
    orderingRules: {
      packSize: seed.packSize,
      minimumOrderQuantity: seed.minimumOrderQuantity,
      orderMultiple: seed.packSize,
      defaultShipMethod: "UPS Priority",
      requiresQuoteAboveQuantity: seed.minimumOrderQuantity * 40
    },
    alternates: seed.alternates ?? [],
    supersession: seed.supersession ?? {
      status: "Current" as const,
      note: "Current catalog item with no active supersession notice."
    },
    compliance: {
      cageCode: "7FLN2",
      traceability: "Lot" as const,
      certifications: seed.certifications ?? ["Certificate of Conformance", "Material Traceability"],
      exportControl: seed.exportControl ?? "EAR99",
      qualityClauses: ["AS9120 handling", "Lot segregation", "Certificate packet on request"],
      documentsAvailable: ["Spec sheet", "CoC template", "Packing slip"]
    }
  };
}

export const products: Product[] = [
  {
    id: "p-001",
    slug: "an3-5a-cadmium-bolt",
    partNumber: "AN3-5A",
    title: "Cadmium Plated Hex Bolt",
    description: "Close-tolerance hex bolt suited for airframe mounting points and service-access assemblies.",
    category: "Bolts",
    categorySlug: "bolts",
    series: "AN Series",
    seriesSlug: "an",
    price: 4.82,
    packSize: 25,
    availability: "In Stock",
    leadTimeDays: 1,
    image: "AN3-5A cadmium bolt set shown in product photography.",
    imageSrc: "/images/AN3-5A/an8.jpg",
    images: [
      {
        src: "/images/AN3-5A/an8.jpg",
        alt: "AN3-5A cadmium bolt angled hero view",
        label: "Angle A"
      },
      {
        src: "/images/AN3-5A/an3.jpg",
        alt: "AN3-5A cadmium bolt alternate hardware angle",
        label: "Angle B"
      }
    ],
    applications: ["Airframe brackets", "Maintenance kits", "Ground support hardware"],
    attributes: [
      { label: "Diameter", value: "10-32" },
      { label: "Grip Length", value: "5/16 in" },
      { label: "Material", value: "Alloy Steel" },
      { label: "Finish", value: "Cadmium Plated" },
      { label: "Head Style", value: "Hex" }
    ],
    ...catalogBackend({
      standard: "AN3",
      material: "Alloy Steel",
      finish: "Cadmium Plated",
      diameter: "10-32",
      thread: "UNF-3A",
      gripLength: "5/16 in",
      headStyle: "Hex",
      listPrice: 4.82,
      packSize: 25,
      minimumOrderQuantity: 25,
      totalAvailable: 1840,
      reserved: 220,
      leadTimeDays: 1,
      alternates: [
        { partNumber: "MS20073-05", slug: "nas6204-14-structural-bolt", reason: "Higher-strength alternate for reviewed applications" },
        { partNumber: "AN3-6A", slug: "an3-5a-cadmium-bolt", reason: "Adjacent grip length when stackup allows" }
      ],
      certifications: ["Certificate of Conformance", "Material Traceability", "RoHS exemption statement"]
    }),
    documents: [
      { id: "d-001", name: "Dimensional Sheet", type: "spec", url: "/documents/an3-5a-dimensions.pdf" },
      { id: "d-002", name: "CoC Template", type: "cert", url: "/documents/an3-5a-coc.pdf" }
    ],
    featured: true,
    updatedAt: "2026-04-01"
  },
  {
    id: "p-002",
    slug: "nas6204-14-structural-bolt",
    partNumber: "NAS6204-14",
    title: "High-Strength Structural Bolt",
    description: "Structural bolt for heavily loaded joints where fatigue performance and uniform grip matter.",
    category: "Bolts",
    categorySlug: "bolts",
    series: "NAS Series",
    seriesSlug: "nas",
    price: 16.75,
    packSize: 10,
    availability: "Limited Stock",
    leadTimeDays: 5,
    image: "Precision-machined structural bolt with dark protective finish.",
    applications: ["Wing attach assemblies", "Landing gear supports", "Retrofit programs"],
    attributes: [
      { label: "Diameter", value: "1/4 in" },
      { label: "Length", value: "1-7/8 in" },
      { label: "Material", value: "A286" },
      { label: "Finish", value: "Passivated" },
      { label: "Thread", value: "UNJF" }
    ],
    ...catalogBackend({
      standard: "NAS6204",
      material: "A286",
      finish: "Passivated",
      diameter: "1/4 in",
      thread: "UNJF",
      length: "1-7/8 in",
      headStyle: "Hex",
      listPrice: 16.75,
      packSize: 10,
      minimumOrderQuantity: 10,
      totalAvailable: 74,
      reserved: 18,
      leadTimeDays: 5,
      alternates: [
        { partNumber: "NAS6604-14", slug: "nas6204-14-structural-bolt", reason: "Engineering-review structural alternate" }
      ],
      exportControl: "ITAR Review"
    }),
    documents: [
      { id: "d-003", name: "Spec Compliance", type: "spec", url: "/documents/nas6204-14-spec.pdf" }
    ],
    featured: true,
    updatedAt: "2026-04-07"
  },
  {
    id: "p-003",
    slug: "ms24693-c276-machine-screw",
    partNumber: "MS24693-C276",
    title: "Phillips Pan Head Machine Screw",
    description: "Corrosion-resistant machine screw used in enclosures, panels, and bracketed electronics.",
    category: "Screws",
    categorySlug: "screws",
    series: "MS Series",
    seriesSlug: "ms",
    price: 1.15,
    packSize: 100,
    availability: "In Stock",
    leadTimeDays: 1,
    image: "Stainless pan-head screw for avionics and electronics installs.",
    applications: ["Avionics racks", "Panel fastening", "Electronics housings"],
    attributes: [
      { label: "Diameter", value: "8-32" },
      { label: "Length", value: "3/4 in" },
      { label: "Material", value: "Stainless Steel" },
      { label: "Finish", value: "Plain" },
      { label: "Drive", value: "Phillips" }
    ],
    ...catalogBackend({
      standard: "MS24693",
      material: "Stainless Steel",
      finish: "Plain",
      diameter: "8-32",
      thread: "UNC-2A",
      length: "3/4 in",
      headStyle: "Pan",
      drive: "Phillips",
      listPrice: 1.15,
      packSize: 100,
      minimumOrderQuantity: 100,
      totalAvailable: 9800,
      reserved: 1200,
      leadTimeDays: 1,
      alternates: [
        { partNumber: "MS35206-276", slug: "ms24693-c276-machine-screw", reason: "Machine screw family alternate" }
      ]
    }),
    documents: [
      { id: "d-004", name: "Installation Notes", type: "guide", url: "/documents/ms24693-guide.pdf" }
    ],
    updatedAt: "2026-04-10"
  },
  {
    id: "p-004",
    slug: "bacb30my4-locknut",
    partNumber: "BACB30MY4",
    title: "All-Metal Self-Locking Nut",
    description: "Reusable self-locking nut built for high-vibration assemblies and field serviceability.",
    category: "Nuts",
    categorySlug: "nuts",
    series: "BACB Series",
    seriesSlug: "bacb",
    price: 3.64,
    packSize: 50,
    availability: "Built to Order",
    leadTimeDays: 18,
    image: "All-metal prevailing torque nut for repeat maintenance cycles.",
    applications: ["Engine bay retainers", "Defense vehicle assemblies", "High-vibration installs"],
    attributes: [
      { label: "Thread", value: "1/4-28" },
      { label: "Material", value: "CRES" },
      { label: "Temperature Range", value: "-65F to 450F" },
      { label: "Locking Feature", value: "Prevailing Torque" },
      { label: "Finish", value: "Silver Plated" }
    ],
    ...catalogBackend({
      standard: "BACB30",
      material: "CRES",
      finish: "Silver Plated",
      diameter: "1/4 in",
      thread: "1/4-28",
      listPrice: 3.64,
      packSize: 50,
      minimumOrderQuantity: 50,
      totalAvailable: 0,
      reserved: 0,
      leadTimeDays: 18,
      supersession: {
        status: "Current",
        note: "Built-to-order catalog item; review alternates for urgent repair demand."
      },
      exportControl: "ITAR Review"
    }),
    documents: [
      { id: "d-005", name: "Material Traceability Example", type: "cert", url: "/documents/bacb30my4-trace.pdf" }
    ],
    featured: true,
    updatedAt: "2026-04-14"
  },
  {
    id: "p-005",
    slug: "an960-416-washer",
    partNumber: "AN960-416",
    title: "Flat Washer",
    description: "General-purpose washer sized for aerospace bolt applications with clean edge finish.",
    category: "Washers",
    categorySlug: "washers",
    series: "AN Series",
    seriesSlug: "an",
    price: 0.22,
    packSize: 250,
    availability: "In Stock",
    leadTimeDays: 1,
    image: "Precision flat washer used across aviation and defense builds.",
    applications: ["Bolt stackups", "Panel interfaces", "Field replacement packs"],
    attributes: [
      { label: "Inside Diameter", value: "1/4 in" },
      { label: "Outside Diameter", value: "9/16 in" },
      { label: "Material", value: "Steel" },
      { label: "Finish", value: "Cadmium Plated" },
      { label: "Thickness", value: "0.063 in" }
    ],
    ...catalogBackend({
      standard: "AN960",
      material: "Steel",
      finish: "Cadmium Plated",
      diameter: "1/4 in",
      listPrice: 0.22,
      packSize: 250,
      minimumOrderQuantity: 250,
      totalAvailable: 46000,
      reserved: 3500,
      leadTimeDays: 1,
      alternates: [
        { partNumber: "NAS1149F0463P", slug: "an960-416-washer", reason: "Modern washer standard alternate" }
      ]
    }),
    documents: [
      { id: "d-006", name: "Specification", type: "spec", url: "/documents/an960-416-spec.pdf" }
    ],
    updatedAt: "2026-04-09"
  },
  {
    id: "p-006",
    slug: "ms35338-45-lock-washer",
    partNumber: "MS35338-45",
    title: "Internal Tooth Lock Washer",
    description: "Lock washer for vibration-prone assemblies requiring compact anti-rotation support.",
    category: "Washers",
    categorySlug: "washers",
    series: "MS Series",
    seriesSlug: "ms",
    price: 0.41,
    packSize: 100,
    availability: "In Stock",
    leadTimeDays: 2,
    image: "Internal tooth lock washer with bright protective finish.",
    applications: ["Electrical bonding", "Panel hardware", "Bracket retention"],
    attributes: [
      { label: "Inside Diameter", value: "0.19 in" },
      { label: "Material", value: "Spring Steel" },
      { label: "Finish", value: "Zinc Chromate" },
      { label: "Type", value: "Internal Tooth" },
      { label: "Spec Family", value: "MS35338" }
    ],
    ...catalogBackend({
      standard: "MS35338",
      material: "Spring Steel",
      finish: "Zinc Chromate",
      diameter: "0.19 in",
      listPrice: 0.41,
      packSize: 100,
      minimumOrderQuantity: 100,
      totalAvailable: 12200,
      reserved: 640,
      leadTimeDays: 2,
      supersession: {
        status: "Superseded",
        replacementPartNumber: "NASM35338-45",
        replacementSlug: "ms35338-45-lock-washer",
        note: "MS prefix remains orderable while NASM replacement is phased into new contracts."
      }
    }),
    documents: [
      { id: "d-007", name: "Use Guide", type: "guide", url: "/documents/ms35338-45-guide.pdf" }
    ],
    updatedAt: "2026-04-11"
  }
];

export const sampleQuotes: Quote[] = [
  {
    id: "RFQ-1042",
    company: "Atlas Defense Systems",
    contact: "Rina Cole",
    email: "rina@atlasdefense.example",
    partNumber: "NAS6204-14",
    quantity: 120,
    status: "Under Review"
  },
  {
    id: "RFQ-1045",
    company: "North Harbor Avionics",
    contact: "Miles Mercer",
    email: "mmercer@nha.example",
    partNumber: "MS24693-C276",
    quantity: 400,
    status: "Quoted"
  }
];

export const sampleOrders: Order[] = [
  { id: "SO-78123", placedOn: "2026-04-05", status: "Delivered", total: 482.14 },
  { id: "SO-78191", placedOn: "2026-04-11", status: "Shipped", total: 1226.8 },
  { id: "SO-78242", placedOn: "2026-04-15", status: "Processing", total: 319.75 }
];

export const sampleDocuments: CustomerDocument[] = [
  {
    id: "CD-1",
    name: "SO-78123 Certificate of Conformance",
    linkedOrder: "SO-78123",
    type: "Certificate of Conformance"
  },
  {
    id: "CD-2",
    name: "SO-78191 Material Traceability Packet",
    linkedOrder: "SO-78191",
    type: "Material Traceability"
  },
  {
    id: "CD-3",
    name: "SO-78242 Packing Slip",
    linkedOrder: "SO-78242",
    type: "Packing Slip"
  }
];

export const stats = [
  { label: "Catalog SKUs", value: "85K+" },
  { label: "Same-Day Quotes", value: "97%" },
  { label: "Programs Supported", value: "240+" },
  { label: "Cert Packet Accuracy", value: "99.4%" }
];

export function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(value);
}

export function getCustomerPrice(product: Product, accountId = "acct-atlas") {
  return product.pricing.customerPricing.find((price) => price.accountId === accountId);
}

export function getFeaturedProducts() {
  return products.filter((product) => product.featured);
}

export function getRecentlyUpdatedProducts() {
  return [...products]
    .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
    .slice(0, 4);
}

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getProductsByCategory(slug: string) {
  return products.filter((product) => product.categorySlug === slug);
}

export function getProductsBySeries(slug: string) {
  return products.filter((product) => product.seriesSlug === slug);
}

export function searchProducts(query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return products;
  }

  return products.filter((product) => {
    const haystack = [
      product.partNumber,
      product.title,
      product.description,
      product.category,
      product.series,
      product.specs.standard,
      product.specs.material,
      product.specs.finish,
      product.compliance.exportControl,
      product.supersession.replacementPartNumber ?? "",
      ...product.applications,
      ...product.alternates.map((item) => `${item.partNumber} ${item.reason}`),
      ...product.compliance.certifications,
      ...product.compliance.qualityClauses,
      ...product.attributes.map((item) => `${item.label} ${item.value}`)
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalized);
  });
}

export function filterProducts(filters: Record<string, string | undefined>) {
  return products.filter((product) => {
    const material = filters.material?.toLowerCase();
    const finish = filters.finish?.toLowerCase();
    const availability = filters.availability?.toLowerCase();

    if (material && !product.specs.material.toLowerCase().includes(material)) {
      return false;
    }

    if (finish && !product.specs.finish.toLowerCase().includes(finish)) {
      return false;
    }

    if (availability && product.availability.toLowerCase() !== availability) {
      return false;
    }

    return true;
  });
}
