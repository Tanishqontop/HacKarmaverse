import { Link, useSearchParams } from "react-router-dom";
import { TopBar } from "../components/AppShell";
import { useStore } from "../context/Store";
import { formatDate } from "../lib/ids";

export function OrderSuccessPage() {
  const [params] = useSearchParams();
  const id = params.get("id") ?? "";
  const { orders } = useStore();
  const order = orders.find((o) => o.id === id) ?? orders[0];

  if (!order) {
    return (
      <>
        <TopBar title="Order" back="/home" />
        <p className="empty">No order on this device yet.</p>
      </>
    );
  }

  return (
    <>
      <TopBar title="Done" back="/home" />
      <div className="page">
        <div className="success">
          <div className="mark">✓</div>
          <h1>Order placed successfully</h1>
          <p className="muted">No account was created. Keep this ID with your mobile number.</p>
          <p>
            <b style={{ fontSize: 22 }}>{order.id}</b>
          </p>
          <p>
            Expected delivery
            <br />
            <b>{formatDate(order.expectedDelivery)}</b>
          </p>
          <p>
            KarmaCoins credited
            <br />
            <b>+{order.karmaCoins ?? 0}</b>
          </p>
          {(order.karmaRedeemed ?? 0) > 0 ? (
            <p>
              KarmaCoins redeemed
              <br />
              <b>−{order.karmaRedeemed}</b>
            </p>
          ) : null}
        </div>
        <Link className="btn" to={`/order/${order.id}`}>
          Track order
        </Link>
        <div style={{ height: 10 }} />
        <Link className="btn ghost" to="/home">
          Keep browsing
        </Link>
      </div>
    </>
  );
}
