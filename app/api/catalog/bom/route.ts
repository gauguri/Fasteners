import { NextResponse } from "next/server";

import { searchBom } from "@/lib/search";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const text = typeof body.text === "string" ? body.text : "";
  const accountId = typeof body.accountId === "string" ? body.accountId : "acct-atlas";

  return NextResponse.json({
    source: "catalog-bom-v1",
    accountId,
    ...searchBom(text, accountId)
  });
}
