import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Box, Clock3, Layers3, ShieldCheck } from "lucide-react";

import { formatMoney, getCustomerPrice } from "@/lib/data";
import { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const accountPrice = getCustomerPrice(product);
  const allocatable = Math.max(0, product.inventory.totalAvailable - product.inventory.reserved);

  return (
    <article className="product-card">
      <div className="product-card__media">
        {product.imageSrc ? (
          <Image src={product.imageSrc} alt={`${product.partNumber} product reference`} width={220} height={180} />
        ) : (
          <Box size={54} />
        )}
      </div>
      <div className="product-card__body">
        <div className="product-card__meta">
          <span>{product.series}</span>
          <span>{product.category}</span>
        </div>
        <h3>{product.partNumber}</h3>
        <p className="muted">{product.title}</p>
        <p>{product.description}</p>
        <div className="product-card__facts">
          <span><Layers3 size={14} /> MOQ {product.orderingRules.minimumOrderQuantity}</span>
          <span><ShieldCheck size={14} /> {product.compliance.exportControl}</span>
        </div>
      </div>
      <div className="product-card__footer">
        <span className="status">{product.availability}</span>
        <span className="product-card__lead">{allocatable.toLocaleString()} avail</span>
        <span className="product-card__lead"><Clock3 size={15} /> {product.leadTimeDays}d</span>
        <strong>{formatMoney(accountPrice?.price ?? product.price)}</strong>
        <Link className="icon-link" href={`/products/${product.slug}`} aria-label={`View ${product.partNumber}`}>
          <ArrowUpRight size={18} />
        </Link>
      </div>
    </article>
  );
}
