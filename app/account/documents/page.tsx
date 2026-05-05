import { PageHeader } from "@/components/page-header";
import { sampleDocuments } from "@/lib/data";

export default function DocumentsPage() {
  return (
    <div className="container">
      <PageHeader
        title="Documents and Certifications"
        description="Retrieve order-linked compliance documents, traceability packets, and shipping paperwork."
        trail={[
          { href: "/", label: "Home" },
          { href: "/account", label: "Account" },
          { href: "/account/documents", label: "Documents" }
        ]}
      />
      <div className="grid cols-3">
        {sampleDocuments.map((document) => (
          <article key={document.id} className="card">
            <h3>{document.name}</h3>
            <p className="muted">{document.type}</p>
            <p>Linked order: {document.linkedOrder}</p>
            <button className="button-secondary" type="button">
              Download Packet
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
