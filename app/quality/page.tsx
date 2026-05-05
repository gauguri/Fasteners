import { PageHeader } from "@/components/page-header";

export default function QualityPage() {
  return (
    <div className="container">
      <PageHeader
        title="Quality Commitment"
        description="Quality posture centered on traceability, inspection readiness, and document accuracy."
        trail={[{ href: "/", label: "Home" }, { href: "/quality", label: "Quality" }]}
      />
      <div className="grid cols-2">
        <article className="card">
          <h3>Traceability First</h3>
          <p>
            Product records include document links, update timestamps, and cert-related metadata to support
            receiving and audit workflows.
          </p>
        </article>
        <article className="card">
          <h3>Receiving Confidence</h3>
          <p>
            Orders and documents are modeled together so customer accounts can surface shipment-linked packets
            without manual lookup.
          </p>
        </article>
      </div>
    </div>
  );
}
