import { NextResponse } from "next/server";

import { getAutocompleteSuggestions } from "@/lib/search";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? "";
  const limit = Number.parseInt(searchParams.get("limit") ?? "8", 10);

  return NextResponse.json({
    source: "catalog-suggest-v1",
    query,
    suggestions: getAutocompleteSuggestions(query, Number.isFinite(limit) ? limit : 8)
  });
}
