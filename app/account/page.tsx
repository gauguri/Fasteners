import Link from "next/link";

import { PageHeader } from "@/components/page-header";
import { sampleOrders, sampleQuotes } from "@/lib/data";

export default function AccountPage() {
  return (
    <div className="container">
      <PageHeader
        title="Account Dashboard"
        description="Access order history, quote activity, saved shipping data, and compliance documents."
        trail={[{ href: "/", label: "Home" }, { href: "/account", label: "Account" }]}
      />
      <div className="grid cols-3">
        <article className="card">
          <h3>Open Quotes</h3>
          <p className="metric">{sampleQuotes.length}</p>
          <Link href="/quote" className="button-secondary">
            Manage RFQs
          </Link>
        </article>
        <article className="card">
          <h3>Recent Orders</h3>
          <p className="metric">{sampleOrders.length}</p>
          <Link href="/account/orders" className="button-secondary">
            View Orders
          </Link>
        </article>
        <article className="card">
          <h3>Documents</h3>
          <p className="metric">3</p>
          <Link href="/account/documents" className="button-secondary">
            View Documents
          </Link>
        </article>
      </div>
      <section className="section card">
        <h3>Saved Purchasing Profile</h3>
        <div className="grid cols-2">
          <article className="panel">
            <h4>Primary Buyer</h4>
            <p>Rina Cole</p>
            <p className="muted">Atlas Defense Systems</p>
          </article>
          <article className="panel">
            <h4>Default Ship-To</h4>
            <p>42 Program Way, Dayton, OH 45402</p>
            <p className="muted">Dock 4, Receiving Window 07:00-14:00</p>
          </article>
        </div>
      </section>
    </div>
  );
}
