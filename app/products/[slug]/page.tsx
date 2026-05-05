import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ClipboardList, ShoppingCart } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { ProductViewer } from "@/components/product-viewer";
import { formatMoney, getCustomerPrice, getProductBySlug } from "@/lib/data";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const accountPrice = getCustomerPrice(product);
  const allocatable = Math.max(0, product.inventory.totalAvailable - product.inventory.reserved);

  return (
    <div className="container">
      <PageHeader
        title={product.partNumber}
        description={product.title}
        trail={[
          { href: "/", label: "Home" },
          { href: `/categories/${product.categorySlug}`, label: product.category },
          { href: `/products/${product.slug}`, label: product.partNumber }
        ]}
        actions={
          <div className="actions">
            <Link href="/cart" className="button">
              Add to Cart
            </Link>
            <Link href={`/quote?part=${product.partNumber}`} className="button-secondary">
              Request Quote
            </Link>
          </div>
        }
      />
      <section className="product-detail-layout">
        <div className="product-detail-main">
          <div className="product-title-block">
            <span className="eyebrow">{product.series}</span>
            <h2>{product.title}</h2>
            <p>{product.description}</p>
          </div>
          {product.imageSrc ? (
            <ProductViewer
              src={product.imageSrc}
              images={product.images}
              alt={`${product.partNumber} product image`}
              caption={product.image}
            />
          ) : null}
          <div className="pill-row">
            {product.applications.map((application) => (
              <span className="pill" key={application}>
                {application}
              </span>
            ))}
          </div>
        </div>
        <aside className="buy-panel">
          <p className="status">{product.availability}</p>
          <p className="metric">{formatMoney(accountPrice?.price ?? product.price)}</p>
          {accountPrice ? (
            <p className="muted">{accountPrice.accountName} contract {accountPrice.contract}</p>
          ) : null}
          <p className="muted">List price {formatMoney(product.pricing.listPrice)} each</p>
          <p className="muted">MOQ {product.orderingRules.minimumOrderQuantity}, multiple {product.orderingRules.orderMultiple}</p>
          <p className="muted">{allocatable.toLocaleString()} allocatable across warehouses</p>
          <p>Lead time: {product.leadTimeDays} day(s)</p>
          <div className="actions">
            <Link href="/checkout" className="button">
              <ShoppingCart size={18} /> Buy Now
            </Link>
            <Link href="/account/documents" className="button-secondary">
              View Docs <ArrowRight size={18} />
            </Link>
            <Link href={`/quote?part=${product.partNumber}`} className="button-secondary">
              <ClipboardList size={18} /> RFQ
            </Link>
          </div>
        </aside>
      </section>
      <section className="section spec-panel">
        <h3>Catalog Backend</h3>
        <div className="backend-grid">
          <article>
            <strong>Live Inventory</strong>
            <p className="muted">Last sync {product.inventory.lastSyncedAt}</p>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Warehouse</th>
                    <th>Available</th>
                    <th>Lead</th>
                  </tr>
                </thead>
                <tbody>
                  {product.inventory.warehouses.map((warehouse) => (
                    <tr key={warehouse.code}>
                      <td>{warehouse.code} / {warehouse.name}</td>
                      <td>{warehouse.available.toLocaleString()}</td>
                      <td>{warehouse.leadTimeDays}d</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
          <article>
            <strong>Customer Pricing</strong>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Account</th>
                    <th>Price</th>
                    <th>Contract</th>
                  </tr>
                </thead>
                <tbody>
                  {product.pricing.customerPricing.map((price) => (
                    <tr key={price.accountId}>
                      <td>{price.accountName}</td>
                      <td>{formatMoney(price.price)}</td>
                      <td>{price.contract}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
          <article>
            <strong>Quantity Breaks</strong>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Qty</th>
                    <th>Unit</th>
                  </tr>
                </thead>
                <tbody>
                  {product.pricing.priceBreaks.map((priceBreak) => (
                    <tr key={priceBreak.quantity}>
                      <td>{priceBreak.quantity.toLocaleString()}+</td>
                      <td>{formatMoney(priceBreak.unitPrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        </div>
      </section>
      <section className="section spec-panel">
        <h3>Normalized Specs</h3>
        <div className="spec-list">
          {Object.entries(product.specs)
            .filter(([, value]) => Boolean(value))
            .map(([key, value]) => (
            <div className="spec-item" key={key}>
              <strong>{key.replace(/([A-Z])/g, " $1")}</strong>
              <span>{value}</span>
            </div>
          ))}
        </div>
      </section>
      <section className="section spec-panel">
        <h3>Alternates, Supersession, Compliance</h3>
        <div className="backend-grid">
          <article>
            <strong>Alternates</strong>
            {product.alternates.length ? (
              <div className="activity-list">
                {product.alternates.map((alternate) => (
                  <Link href={`/products/${alternate.slug}`} key={alternate.partNumber} className="activity-row">
                    <span>{alternate.partNumber}</span>
                    <small>{alternate.reason}</small>
                    <ArrowRight size={18} />
                  </Link>
                ))}
              </div>
            ) : (
              <p className="muted">No approved alternates are linked.</p>
            )}
          </article>
          <article>
            <strong>Supersession</strong>
            <p className="status">{product.supersession.status}</p>
            <p>{product.supersession.note}</p>
            {product.supersession.replacementPartNumber ? (
              <p className="muted">Replacement: {product.supersession.replacementPartNumber}</p>
            ) : null}
          </article>
          <article>
            <strong>Compliance</strong>
            <div className="pill-row">
              <span className="pill">{product.compliance.exportControl}</span>
              <span className="pill">{product.compliance.traceability} traceability</span>
              {product.compliance.certifications.map((certification) => (
                <span className="pill" key={certification}>{certification}</span>
              ))}
            </div>
          </article>
        </div>
      </section>
      <section className="section spec-panel">
        <h3>Related Documents</h3>
        <div className="grid cols-3">
          {product.documents.map((document) => (
            <article key={document.id} className="panel">
              <h4>{document.name}</h4>
              <p className="muted">{document.type.toUpperCase()}</p>
              <p>{document.url}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
