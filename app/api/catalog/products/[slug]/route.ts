import { NextResponse } from "next/server";

import { getProductBySlug } from "@/lib/data";

type ProductApiProps = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, { params }: ProductApiProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({
    source: "catalog-v1",
    product,
    allocatableInventory: Math.max(0, product.inventory.totalAvailable - product.inventory.reserved)
  });
}
