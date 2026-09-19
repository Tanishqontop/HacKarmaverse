import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TopBar } from "../components/AppShell";
import { useStore } from "../context/Store";
import { formatDate } from "../lib/ids";
import { formatInr } from "../data/products";

export function OrdersPage() {
  const { orders, findOrder } = useStore();
  const [oid, setOid] = useState("");
  const [mobile, setMobile] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  function lookup() {
    const found = findOrder(oid, mobile);
    if (!found) {
      setErr("No match. Use the Order ID and the mobile number from checkout.");
      return;
    }
    navigate(`/order/${found.id}`);
  }

  return (
    <>
      <TopBar title="Orders" />
      <div className="page">
        <h2>Find an order</h2>
        <p className="muted">Guest orders live on this device, and can be opened with Order ID + mobile.</p>
        <div className="field">
          <label htmlFor="oid">Order ID</label>
          <input id="oid" value={oid} placeholder="ORD-2026-8F42K" onChange={(e) => setOid(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="mob">Mobile number</label>
          <input id="mob" value={mobile} inputMode="numeric" onChange={(e) => setMobile(e.target.value)} />
        </div>
        {err ? <p style={{ color: "var(--danger)" }}>{err}</p> : null}
        <button className="btn secondary" type="button" onClick={lookup}>
          Track
        </button>

        <div className="section-head">
          <h2>On this device</h2>
        </div>
        {orders.length === 0 ? (
          <p className="empty">No orders yet. The bazaar is patient.</p>
        ) : (
          <div className="list">
            {orders.map((o) => (
              <Link key={o.id} to={`/order/${o.id}`} className="line-item" style={{ gridTemplateColumns: "1fr auto" }}>
                <div>
                  <b>{o.id}</b>
                  <div className="muted">
                    {o.kind === "thrift" ? "Thrift · " : ""}
                    {o.status.replaceAll("_", " ")} · {formatInr(o.total)}
                  </div>
                  <div className="muted">ETA {formatDate(o.expectedDelivery)}</div>
                </div>
                →
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
