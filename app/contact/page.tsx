import { PageHeader } from "@/components/page-header";

export default function ContactPage() {
  return (
    <div className="container">
      <PageHeader
        title="Contact"
        description="Talk to sales, sourcing, or document support for defense and aerospace programs."
        trail={[{ href: "/", label: "Home" }, { href: "/contact", label: "Contact" }]}
      />
      <div className="grid cols-2">
        <article className="card">
          <h3>Program Support</h3>
          <p>Sales: sales@forgeline.example</p>
          <p>Quality: quality@forgeline.example</p>
          <p>Phone: 1-800-555-FAST</p>
        </article>
        <article className="card">
          <h3>Response Targets</h3>
          <p>Quotes under 24 hours</p>
          <p>Document requests same business day</p>
          <p>Expedite review within 2 hours during business operations</p>
        </article>
      </div>
    </div>
  );
}
