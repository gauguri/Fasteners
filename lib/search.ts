import { formatMoney, getCustomerPrice, products } from "@/lib/data";
import { Product } from "@/lib/types";

export type SearchMatchType =
  | "exact"
  | "normalized-exact"
  | "prefix"
  | "alternate"
  | "supersession"
  | "typo"
  | "attribute"
  | "text"
  | "browse";

export type CatalogSearchFilters = {
  series?: string;
  availability?: string;
  material?: string;
  finish?: string;
  exportControl?: string;
  inStockOnly?: boolean;
};

export type CatalogSearchResult = {
  product: Product;
  score: number;
  matchType: SearchMatchType;
  matchLabel: string;
  matchedOn: string;
  effectivePrice: number;
  effectivePriceLabel: string;
  allocatableInventory: number;
};

export type SearchSuggestion = {
  value: string;
  label: string;
  detail: string;
  type: "part" | "alternate" | "standard" | "category" | "attribute";
};

export type BomSearchLine = {
  line: number;
  raw: string;
  query: string;
  quantity: number;
  match: CatalogSearchResult | null;
  confidence: "High" | "Medium" | "Low" | "No match";
};

export type BomSearchResult = {
  lines: BomSearchLine[];
  matchedCount: number;
  unresolvedCount: number;
  estimatedTotal: number;
};

const matchLabels: Record<SearchMatchType, string> = {
  exact: "Exact part number",
  "normalized-exact": "Exact normalized part number",
  prefix: "Part number prefix",
  alternate: "Alternate part",
  supersession: "Supersession match",
  typo: "Typo-tolerant match",
  attribute: "Spec attribute match",
  text: "Catalog text match",
  browse: "Catalog browse"
};

export function normalizePartNumber(value: string) {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

function searchableText(product: Product) {
  return [
    product.partNumber,
    product.title,
    product.description,
    product.category,
    product.series,
    product.specs.standard,
    product.specs.material,
    product.specs.finish,
    product.specs.diameter ?? "",
    product.specs.thread ?? "",
    product.specs.length ?? "",
    product.specs.gripLength ?? "",
    product.specs.headStyle ?? "",
    product.specs.drive ?? "",
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
}

function levenshtein(a: string, b: string) {
  const previous = Array.from({ length: b.length + 1 }, (_, index) => index);

  for (let i = 1; i <= a.length; i += 1) {
    let lastDiagonal = i - 1;
    previous[0] = i;

    for (let j = 1; j <= b.length; j += 1) {
      const oldDiagonal = previous[j];
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      previous[j] = Math.min(
        previous[j] + 1,
        previous[j - 1] + 1,
        lastDiagonal + cost
      );
      lastDiagonal = oldDiagonal;
    }
  }

  return previous[b.length];
}

function typoScore(query: string, candidate: string) {
  if (query.length < 4) {
    return 0;
  }

  const lengthDelta = Math.abs(query.length - candidate.length);
  if (lengthDelta > 2) {
    return 0;
  }

  const distance = levenshtein(query, candidate);
  if (distance === 1) {
    return 520;
  }
  if (distance === 2 && query.length >= 7) {
    return 420;
  }

  return 0;
}

function scoreProduct(product: Product, query: string): Omit<CatalogSearchResult, "product" | "effectivePrice" | "effectivePriceLabel" | "allocatableInventory"> {
  const trimmed = query.trim();
  const lower = trimmed.toLowerCase();
  const normalized = normalizePartNumber(trimmed);
  const productPart = product.partNumber.toUpperCase();
  const normalizedPart = normalizePartNumber(product.partNumber);
  const alternate = product.alternates.find((item) => {
    const normalizedAlternate = normalizePartNumber(item.partNumber);
    return item.partNumber.toLowerCase() === lower || normalizedAlternate === normalized || normalizedAlternate.startsWith(normalized);
  });
  const replacement = product.supersession.replacementPartNumber;
  const replacementNormalized = replacement ? normalizePartNumber(replacement) : "";

  if (!trimmed) {
    return {
      score: product.featured ? 95 : 75,
      matchType: "browse",
      matchLabel: matchLabels.browse,
      matchedOn: product.featured ? "Featured catalog item" : "Catalog item"
    };
  }

  if (productPart === trimmed.toUpperCase()) {
    return {
      score: 1000,
      matchType: "exact",
      matchLabel: matchLabels.exact,
      matchedOn: product.partNumber
    };
  }

  if (normalizedPart === normalized) {
    return {
      score: 940,
      matchType: "normalized-exact",
      matchLabel: matchLabels["normalized-exact"],
      matchedOn: product.partNumber
    };
  }

  if (normalizedPart.startsWith(normalized)) {
    return {
      score: 760 - Math.max(0, normalizedPart.length - normalized.length),
      matchType: "prefix",
      matchLabel: matchLabels.prefix,
      matchedOn: product.partNumber
    };
  }

  if (alternate) {
    return {
      score: 690,
      matchType: "alternate",
      matchLabel: matchLabels.alternate,
      matchedOn: `${alternate.partNumber}: ${alternate.reason}`
    };
  }

  if (replacementNormalized && (replacementNormalized === normalized || replacementNormalized.startsWith(normalized))) {
    return {
      score: 650,
      matchType: "supersession",
      matchLabel: matchLabels.supersession,
      matchedOn: replacement ?? product.partNumber
    };
  }

  const typo = Math.max(
    typoScore(normalized, normalizedPart),
    ...product.alternates.map((item) => typoScore(normalized, normalizePartNumber(item.partNumber)))
  );
  if (typo > 0) {
    return {
      score: typo,
      matchType: "typo",
      matchLabel: matchLabels.typo,
      matchedOn: product.partNumber
    };
  }

  const specs = [
    product.specs.standard,
    product.specs.material,
    product.specs.finish,
    product.specs.diameter,
    product.specs.thread,
    product.specs.length,
    product.specs.gripLength,
    product.specs.headStyle,
    product.specs.drive
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  if (specs.includes(lower)) {
    return {
      score: 320,
      matchType: "attribute",
      matchLabel: matchLabels.attribute,
      matchedOn: "Normalized specs"
    };
  }

  if (searchableText(product).includes(lower)) {
    return {
      score: 180,
      matchType: "text",
      matchLabel: matchLabels.text,
      matchedOn: "Title, description, applications, or compliance data"
    };
  }

  return {
    score: 0,
    matchType: "text",
    matchLabel: matchLabels.text,
    matchedOn: ""
  };
}

function productPassesFilters(product: Product, filters: CatalogSearchFilters = {}) {
  const allocatable = Math.max(0, product.inventory.totalAvailable - product.inventory.reserved);
  const availability = filters.availability?.toLowerCase();

  if (filters.series && product.seriesSlug !== filters.series) {
    return false;
  }
  if (availability && product.availability.toLowerCase() !== availability) {
    return false;
  }
  if (filters.material && !product.specs.material.toLowerCase().includes(filters.material.toLowerCase())) {
    return false;
  }
  if (filters.finish && !product.specs.finish.toLowerCase().includes(filters.finish.toLowerCase())) {
    return false;
  }
  if (filters.exportControl && product.compliance.exportControl !== filters.exportControl) {
    return false;
  }
  if (filters.inStockOnly && allocatable <= 0) {
    return false;
  }

  return true;
}

export function searchCatalog({
  query = "",
  filters = {},
  accountId = "acct-atlas",
  limit
}: {
  query?: string;
  filters?: CatalogSearchFilters;
  accountId?: string;
  limit?: number;
} = {}) {
  const ranked = products
    .filter((product) => productPassesFilters(product, filters))
    .map((product) => {
      const score = scoreProduct(product, query);
      const effectivePrice = getCustomerPrice(product, accountId)?.price ?? product.pricing.listPrice;
      const allocatableInventory = Math.max(0, product.inventory.totalAvailable - product.inventory.reserved);

      return {
        product,
        ...score,
        effectivePrice,
        effectivePriceLabel: formatMoney(effectivePrice),
        allocatableInventory
      };
    })
    .filter((result) => !query.trim() || result.score > 0)
    .sort((a, b) => b.score - a.score || a.product.partNumber.localeCompare(b.product.partNumber));

  return typeof limit === "number" ? ranked.slice(0, limit) : ranked;
}

export function getAutocompleteSuggestions(query: string, limit = 8): SearchSuggestion[] {
  const normalized = normalizePartNumber(query);
  const lower = query.trim().toLowerCase();

  if (!query.trim()) {
    return products.slice(0, limit).map((product) => ({
      value: product.partNumber,
      label: product.partNumber,
      detail: `${product.title} · ${product.series}`,
      type: "part"
    }));
  }

  const suggestions = new Map<string, SearchSuggestion>();

  for (const product of products) {
    const productPart = normalizePartNumber(product.partNumber);
    if (productPart.startsWith(normalized) || product.partNumber.toLowerCase().includes(lower)) {
      suggestions.set(`part-${product.partNumber}`, {
        value: product.partNumber,
        label: product.partNumber,
        detail: `${product.title} · ${product.availability}`,
        type: "part"
      });
    }

    for (const alternate of product.alternates) {
      if (normalizePartNumber(alternate.partNumber).startsWith(normalized)) {
        suggestions.set(`alternate-${alternate.partNumber}`, {
          value: alternate.partNumber,
          label: alternate.partNumber,
          detail: `Alternate for ${product.partNumber}`,
          type: "alternate"
        });
      }
    }

    if (product.specs.standard.toLowerCase().startsWith(lower)) {
      suggestions.set(`standard-${product.specs.standard}`, {
        value: product.specs.standard,
        label: product.specs.standard,
        detail: `${product.series} standard`,
        type: "standard"
      });
    }

    for (const value of [product.category, product.specs.material, product.specs.finish]) {
      if (value.toLowerCase().includes(lower)) {
        suggestions.set(`attribute-${value}`, {
          value,
          label: value,
          detail: `Filter-friendly catalog term`,
          type: value === product.category ? "category" : "attribute"
        });
      }
    }
  }

  return Array.from(suggestions.values()).slice(0, limit);
}

function parseBomLine(raw: string, line: number) {
  const cleaned = raw.trim();
  const tokens = cleaned.split(/[\s,\t;|]+/).filter(Boolean);
  const partToken =
    tokens.find((token) => /[A-Za-z]{1,6}[A-Za-z0-9-]*\d[A-Za-z0-9-]*/.test(token)) ?? "";
  const quantityToken =
    tokens.find((token) => /^\d+$/.test(token) && token !== partToken) ??
    tokens.find((token) => /qty[:=]?\d+/i.test(token))?.replace(/\D/g, "") ??
    "1";

  return {
    line,
    raw,
    query: partToken.replace(/["']/g, ""),
    quantity: Math.max(1, Number.parseInt(quantityToken, 10) || 1)
  };
}

function confidenceForMatch(match: CatalogSearchResult | undefined): BomSearchLine["confidence"] {
  if (!match) {
    return "No match";
  }
  if (["exact", "normalized-exact", "prefix"].includes(match.matchType)) {
    return "High";
  }
  if (["alternate", "supersession", "typo"].includes(match.matchType)) {
    return "Medium";
  }
  return "Low";
}

export function searchBom(text: string, accountId = "acct-atlas"): BomSearchResult {
  const lines = text
    .split(/\r?\n/)
    .map((raw, index) => parseBomLine(raw, index + 1))
    .filter((line) => line.raw.trim())
    .map((line) => {
      const match = line.query
        ? searchCatalog({ query: line.query, accountId, limit: 1 })[0]
        : undefined;

      return {
        ...line,
        match: match ?? null,
        confidence: confidenceForMatch(match)
      };
    });

  return {
    lines,
    matchedCount: lines.filter((line) => line.match).length,
    unresolvedCount: lines.filter((line) => !line.match).length,
    estimatedTotal: Number(
      lines
        .reduce((total, line) => total + (line.match ? line.match.effectivePrice * line.quantity : 0), 0)
        .toFixed(2)
    )
  };
}

export function searchFacets() {
  return {
    series: Array.from(new Map(products.map((product) => [product.seriesSlug, product.series])).entries()),
    availability: Array.from(new Set(products.map((product) => product.availability))),
    materials: Array.from(new Set(products.map((product) => product.specs.material))).sort(),
    finishes: Array.from(new Set(products.map((product) => product.specs.finish))).sort(),
    exportControls: Array.from(new Set(products.map((product) => product.compliance.exportControl))).sort()
  };
}
