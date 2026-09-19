import { Link, useParams } from "react-router-dom";
import { TopBar } from "../components/AppShell";
import { useStore } from "../context/Store";
import { formatDate, formatTime } from "../lib/ids";
import { formatInr, getProduct } from "../data/products";

const LABELS: Record<string, string> = {
  placed: "Placed",
  packed: "Packed",
  shipped: "Shipped",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
};

export function OrderDetailPage() {
  const { id = "" } = useParams();
  const { orders, fcmLinks, device } = useStore();
  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <>
        <TopBar back="/orders" title="Order" />
        <p className="empty">Order not on this device. Try Order ID + mobile on the Orders tab.</p>
      </>
    );
  }

  const linked = fcmLinks.some((l) => l.orderId === order.id && l.fcmToken === device?.fcmToken);

  return (
    <>
      <TopBar back="/orders" title="Tracking" />
      <div className="page">
        <p className="muted">Order</p>
        <h1 style={{ marginTop: 0 }}>{order.id}</h1>
        <p>
          Status: <b>{LABELS[order.status]}</b>
          <br />
          Expected {formatDate(order.expectedDelivery)}
        </p>
        <div className="notice">
          {order.guest.fullName} · {order.guest.mobile}
          <br />
          {order.guest.address}, {order.guest.city}, {order.guest.state} {order.guest.pincode}
          <br />
          {order.guest.email}
        </div>
        <p className="muted">
          Device FCM token linked: {linked ? "yes" : "no"} · {device?.fcmToken.slice(0, 18)}…
        </p>

        <h2>Items</h2>
        {order.thrift ? (
          <p>
            Thrift · {order.thrift.title} · {formatInr(order.thrift.price)}
            <br />
            Seller {order.thrift.sellerName} ({order.thrift.sellerMobile}) · {order.thrift.city}
          </p>
        ) : (
          order.items.map((i) => {
            const p = getProduct(i.productId);
            return (
              <p key={i.productId}>
                {p?.name ?? i.productId} × {i.qty}
              </p>
            );
          })
        )}
        <p>
          Paid via {order.guest.paymentMethod.toUpperCase()} · {formatInr(order.total)}
          <br />
          KarmaCoins earned: {order.karmaCoins ?? 0}
          {(order.karmaRedeemed ?? 0) > 0 ? (
            <>
              <br />
              Redeemed: {order.karmaRedeemed} (−{formatInr(order.karmaRedeemed)})
            </>
          ) : null}
        </p>

        <h2>Delivery intelligence</h2>
        <div className="timeline">
          {order.timeline.map((t) => (
            <div key={t.at + t.status} className="tl">
              <b>{LABELS[t.status]}</b>
              <div className="muted">{formatTime(t.at)}</div>
              <div>{t.note}</div>
            </div>
          ))}
        </div>
        <Link className="btn ghost" to="/help">
          Need help?
        </Link>
      </div>
    </>
  );
}
