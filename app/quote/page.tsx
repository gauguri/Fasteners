import { PageHeader } from "@/components/page-header";
import { sampleQuotes } from "@/lib/data";

type QuotePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function QuotePage({ searchParams }: QuotePageProps) {
  const params = await searchParams;
  const part = typeof params.part === "string" ? params.part : "";

  return (
    <div className="container">
      <PageHeader
        title="Request a Quote"
        description="Submit an RFQ with program details, target quantity, and documentation requirements."
        trail={[{ href: "/", label: "Home" }, { href: "/quote", label: "Quote" }]}
      />
      <div className="grid cols-2">
        <section className="card">
          <form action="/api/quote" method="post" className="form-grid">
            <div className="field">
              <label htmlFor="quote-company">Company</label>
              <input id="quote-company" name="company" defaultValue="Atlas Defense Systems" />
            </div>
            <div className="field">
              <label htmlFor="quote-contact">Contact</label>
              <input id="quote-contact" name="contact" defaultValue="Rina Cole" />
            </div>
            <div className="field">
              <label htmlFor="quote-email">Email</label>
              <input id="quote-email" name="email" defaultValue="rina@atlasdefense.example" />
            </div>
            <div className="field">
              <label htmlFor="quote-phone">Phone</label>
              <input id="quote-phone" name="phone" defaultValue="937-555-0183" />
            </div>
            <div className="field">
              <label htmlFor="quote-part">Part Number</label>
              <input id="quote-part" name="partNumber" defaultValue={part} />
            </div>
            <div className="field">
              <label htmlFor="quote-qty">Quantity</label>
              <input id="quote-qty" name="quantity" defaultValue="250" />
            </div>
            <div className="field full">
              <label htmlFor="quote-notes">Program Notes</label>
              <textarea
                id="quote-notes"
                name="notes"
                defaultValue="Need pricing with cert packet, ship split optional, and alternate recommendations if lead time exceeds 10 days."
              />
            </div>
            <button type="submit" className="button">
              Submit RFQ
            </button>
          </form>
        </section>
        <aside className="card">
          <h3>Active RFQs</h3>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Part</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {sampleQuotes.map((quote) => (
                <tr key={quote.id}>
                  <td>{quote.id}</td>
                  <td>{quote.partNumber}</td>
                  <td>{quote.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </aside>
      </div>
    </div>
  );
}
