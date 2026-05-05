import { PageHeader } from "@/components/page-header";
import { products, sampleQuotes } from "@/lib/data";

export default function AdminPage() {
  return (
    <div className="container">
      <PageHeader
        title="Admin Workspace"
        description="Manage imports, merchandising, quote activity, documents, and content operations."
        trail={[{ href: "/", label: "Home" }, { href: "/admin", label: "Admin" }]}
      />
      <div className="grid cols-4">
        <article className="card">
          <h3>Catalog</h3>
          <p className="metric">{products.length}</p>
          <p className="muted">Seeded SKUs in current workspace dataset</p>
        </article>
        <article className="card">
          <h3>Pending RFQs</h3>
          <p className="metric">{sampleQuotes.filter((item) => item.status !== "Quoted").length}</p>
          <p className="muted">Awaiting response or internal pricing review</p>
        </article>
        <article className="card">
          <h3>Documents</h3>
          <p className="metric">12</p>
          <p className="muted">Spec sheets, certs, and templates in circulation</p>
        </article>
        <article className="card">
          <h3>Content Blocks</h3>
          <p className="metric">9</p>
          <p className="muted">Marketing and support pages ready for CMS handoff</p>
        </article>
      </div>
      <section className="section grid cols-2">
        <article className="card">
          <h3>CSV Import Workflow</h3>
          <p>Upload product, pricing, and inventory files through the import endpoint.</p>
          <form action="/api/import" method="post" className="form-grid">
            <div className="field full">
              <label htmlFor="import-name">Import Batch Name</label>
              <input id="import-name" name="batchName" defaultValue="April-Program-Refresh" />
            </div>
            <div className="field full">
              <label htmlFor="import-notes">Notes</label>
              <textarea
                id="import-notes"
                name="notes"
                defaultValue="Includes pricing refresh, lead-time changes, and two new documentation links."
              />
            </div>
            <button className="button" type="submit">
              Queue Import
            </button>
          </form>
        </article>
        <article className="card">
          <h3>Quote Queue</h3>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Company</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {sampleQuotes.map((quote) => (
                <tr key={quote.id}>
                  <td>{quote.id}</td>
                  <td>{quote.company}</td>
                  <td>{quote.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>
      </section>
    </div>
  );
}
