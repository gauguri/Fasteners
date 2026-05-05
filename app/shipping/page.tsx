import { PageHeader } from "@/components/page-header";

export default function ShippingPage() {
  return (
    <div className="container">
      <PageHeader
        title="Shipping Information"
        description="Program-aware fulfillment with prioritization, split shipments, and document control."
        trail={[{ href: "/", label: "Home" }, { href: "/shipping", label: "Shipping" }]}
      />
      <div className="grid cols-3">
        <article className="card">
          <h3>Standard Handling</h3>
          <p>In-stock releases ship same day when orders are placed before the cutoff window.</p>
        </article>
        <article className="card">
          <h3>Expedite Support</h3>
          <p>Programs can request split shipment handling and dedicated expedite review.</p>
        </article>
        <article className="card">
          <h3>Export and Packaging</h3>
          <p>Labeling, lot separation, and document packet handling can be tuned to program rules.</p>
        </article>
      </div>
    </div>
  );
}
