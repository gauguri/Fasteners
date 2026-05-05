import Link from "next/link";

import { PageHeader } from "@/components/page-header";
import { formatMoney, products } from "@/lib/data";

const cartItems = [
  { product: products[0], quantity: 4 },
  { product: products[2], quantity: 12 }
];

export default function CartPage() {
  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="container">
      <PageHeader
        title="Cart"
        description="Review requested hardware, adjust quantities, and hand off to secure checkout."
        trail={[{ href: "/", label: "Home" }, { href: "/cart", label: "Cart" }]}
      />
      <section className="table-card">
        <table className="table">
          <thead>
            <tr>
              <th>Part</th>
              <th>Availability</th>
              <th>Qty</th>
              <th>Unit</th>
              <th>Extended</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item.product.id}>
                <td>
                  <strong>{item.product.partNumber}</strong>
                  <div className="muted">{item.product.title}</div>
                </td>
                <td>{item.product.availability}</td>
                <td>{item.quantity}</td>
                <td>{formatMoney(item.product.price)}</td>
                <td>{formatMoney(item.product.price * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section className="section grid cols-2">
        <article className="card">
          <h3>Fulfillment Notes</h3>
          <p>Orders can be split by required date, ship method, and cert packet requirements.</p>
        </article>
        <article className="card">
          <h3>Subtotal</h3>
          <p className="metric">{formatMoney(subtotal)}</p>
          <div className="actions">
            <Link href="/checkout" className="button">
              Proceed to Checkout
            </Link>
            <Link href="/quote" className="button-secondary">
              Convert to RFQ
            </Link>
          </div>
        </article>
      </section>
    </div>
  );
}
