export type ProductAttribute = {
  label: string;
  value: string;
};

export type ProductDocument = {
  id: string;
  name: string;
  type: "spec" | "cert" | "guide";
  url: string;
};

export type ProductImage = {
  src: string;
  alt: string;
  label: string;
};

export type NormalizedSpecs = {
  diameter?: string;
  thread?: string;
  length?: string;
  gripLength?: string;
  material: string;
  finish: string;
  headStyle?: string;
  drive?: string;
  standard: string;
};

export type InventoryRecord = {
  totalAvailable: number;
  reserved: number;
  warehouses: Array<{
    code: string;
    name: string;
    available: number;
    leadTimeDays: number;
  }>;
  lastSyncedAt: string;
};

export type CustomerPricing = {
  accountId: string;
  accountName: string;
  price: number;
  contract: string;
};

export type PriceBreak = {
  quantity: number;
  unitPrice: number;
};

export type PricingRules = {
  listPrice: number;
  currency: "USD";
  priceBreaks: PriceBreak[];
  customerPricing: CustomerPricing[];
};

export type OrderingRules = {
  packSize: number;
  minimumOrderQuantity: number;
  orderMultiple: number;
  defaultShipMethod: string;
  requiresQuoteAboveQuantity?: number;
};

export type RelatedPart = {
  partNumber: string;
  slug: string;
  reason: string;
};

export type Supersession = {
  status: "Current" | "Superseded" | "Replaced";
  replacementPartNumber?: string;
  replacementSlug?: string;
  note: string;
};

export type ComplianceMetadata = {
  cageCode?: string;
  traceability: "Lot" | "Heat" | "Batch" | "None";
  certifications: string[];
  exportControl: "EAR99" | "ITAR Review" | "Unrestricted";
  qualityClauses: string[];
  documentsAvailable: string[];
};

export type Product = {
  id: string;
  slug: string;
  partNumber: string;
  title: string;
  description: string;
  category: string;
  categorySlug: string;
  series: string;
  seriesSlug: string;
  price: number;
  packSize: number;
  availability: "In Stock" | "Limited Stock" | "Built to Order";
  leadTimeDays: number;
  image: string;
  imageSrc?: string;
  images?: ProductImage[];
  applications: string[];
  attributes: ProductAttribute[];
  specs: NormalizedSpecs;
  inventory: InventoryRecord;
  pricing: PricingRules;
  orderingRules: OrderingRules;
  alternates: RelatedPart[];
  supersession: Supersession;
  compliance: ComplianceMetadata;
  documents: ProductDocument[];
  featured?: boolean;
  updatedAt: string;
};

export type Category = {
  slug: string;
  name: string;
  description: string;
  hero: string;
};

export type Series = {
  slug: string;
  name: string;
  description: string;
  categorySlug: string;
};

export type Quote = {
  id: string;
  company: string;
  contact: string;
  email: string;
  partNumber: string;
  quantity: number;
  status: "Submitted" | "Under Review" | "Quoted";
};

export type Order = {
  id: string;
  placedOn: string;
  status: "Processing" | "Shipped" | "Delivered";
  total: number;
};

export type CustomerDocument = {
  id: string;
  name: string;
  linkedOrder: string;
  type: "Certificate of Conformance" | "Material Traceability" | "Packing Slip";
};
