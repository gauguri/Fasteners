import { PageHeader } from "@/components/page-header";

export default function CheckoutPage() {
  return (
    <div className="container">
      <PageHeader
        title="Checkout"
        description="Hosted-payment-ready checkout with shipping instructions, cert preferences, and purchasing controls."
        trail={[{ href: "/", label: "Home" }, { href: "/checkout", label: "Checkout" }]}
      />
      <div className="grid cols-2">
        <section className="card">
          <h3>Billing and Shipping</h3>
          <form className="form-grid">
            <div className="field">
              <label htmlFor="company">Company</label>
              <input id="company" defaultValue="Atlas Defense Systems" />
            </div>
            <div className="field">
              <label htmlFor="buyer">Buyer</label>
              <input id="buyer" defaultValue="Rina Cole" />
            </div>
            <div className="field full">
              <label htmlFor="address">Address</label>
              <input id="address" defaultValue="42 Program Way, Dayton, OH 45402" />
            </div>
            <div className="field">
              <label htmlFor="ship-method">Ship Method</label>
              <select id="ship-method" defaultValue="priority">
                <option value="ground">Ground</option>
                <option value="priority">Priority</option>
                <option value="expedite">Expedite</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="payment">Payment</label>
              <select id="payment" defaultValue="hosted">
                <option value="hosted">Hosted Payment Link</option>
                <option value="po">Purchase Order</option>
                <option value="net">Net Terms</option>
              </select>
            </div>
            <div className="field full">
              <label htmlFor="instructions">Special Instructions</label>
              <textarea
                id="instructions"
                defaultValue="Include CoC in shipment packet and apply job number JN-4472 on all labels."
              />
            </div>
          </form>
        </section>
        <aside className="card">
          <h3>Order Summary</h3>
          <p className="metric">$156.08</p>
          <p className="muted">Taxes, shipping, and hosted-payment redirect handled at order confirmation.</p>
          <div className="notice">
            <p>
              PCI-sensitive payment collection should be delegated to a hosted provider such as Stripe Checkout
              or an equivalent B2B processor.
            </p>
          </div>
          <button className="button" type="button">
            Continue to Hosted Payment
          </button>
        </aside>
      </div>
    </div>
  );
}
