import { NextResponse } from "next/server";

import { products } from "@/lib/data";
import { searchCatalog } from "@/lib/search";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? "";
  const accountId = searchParams.get("accountId") ?? "acct-atlas";
  const limit = Number.parseInt(searchParams.get("limit") ?? "", 10);
  const results = searchCatalog({
    query,
    accountId,
    limit: Number.isFinite(limit) ? limit : undefined,
    filters: {
      series: searchParams.get("series") ?? undefined,
      availability: searchParams.get("availability") ?? undefined,
      material: searchParams.get("material") ?? undefined,
      finish: searchParams.get("finish") ?? undefined,
      exportControl: searchParams.get("exportControl") ?? undefined,
      inStockOnly: searchParams.get("inStockOnly") === "true"
    }
  }).map((result) => ({
    ...result.product,
    score: result.score,
    matchType: result.matchType,
    matchLabel: result.matchLabel,
    matchedOn: result.matchedOn,
    effectivePrice: result.effectivePrice,
    effectivePriceLabel: result.effectivePriceLabel,
    allocatableInventory: result.allocatableInventory
  }));

  return NextResponse.json({
    source: "catalog-search-v2",
    count: results.length,
    total: products.length,
    accountId,
    results
  });
}
