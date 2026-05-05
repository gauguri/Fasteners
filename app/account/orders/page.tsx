import { PageHeader } from "@/components/page-header";
import { formatMoney, sampleOrders } from "@/lib/data";

export default function OrdersPage() {
  return (
    <div className="container">
      <PageHeader
        title="Order History"
        description="Track order progress and pull shipment-linked paperwork."
        trail={[
          { href: "/", label: "Home" },
          { href: "/account", label: "Account" },
          { href: "/account/orders", label: "Orders" }
        ]}
      />
      <section className="table-card">
        <table className="table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Placed On</th>
              <th>Status</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {sampleOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.placedOn}</td>
                <td>{order.status}</td>
                <td>{formatMoney(order.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
