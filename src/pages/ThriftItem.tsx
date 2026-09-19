import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { TopBar } from "../components/AppShell";
import { useStore } from "../context/Store";
import { formatInr, KARMA_TO_INR } from "../data/products";
import { CONDITION_LABEL, listingKarma } from "../data/thrift";
import type { PaymentMethod } from "../types";

const STATES = [
  "Karnataka",
  "Maharashtra",
  "Delhi",
  "Tamil Nadu",
  "Kerala",
  "Telangana",
  "West Bengal",
  "Gujarat",
  "Rajasthan",
  "Uttar Pradesh",
];

export function ThriftItemPage() {
  const { id = "" } = useParams();
  const { usedListings, checkout, setCheckout, buyUsedListing, enableNotifications, device, karmaBalance } =
    useStore();
  const listing = usedListings.find((l) => l.id === id);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [redeem, setRedeem] = useState(0);

  if (!listing) {
    return (
      <>
        <TopBar title="Thrift" back="/thrift" />
        <p className="empty">That listing is not on this device.</p>
      </>
    );
  }

  const delivery = listing.price >= 999 ? 0 : 49;
  const payable = listing.price + delivery;
  const coinsEarned = listingKarma(listing.price);
  const maxRedeem = listing.sold ? 0 : Math.min(karmaBalance, payable);
  const safeRedeem = Math.min(redeem, maxRedeem);
  const toPay = Math.max(0, payable - safeRedeem * KARMA_TO_INR);

  async function submit() {
    setError("");
    if (!listing || listing.sold) return setError("This piece already sold.");
    const g = checkout;
    if (!g.fullName.trim()) return setError("Full name is required.");
    if (!/^[6-9]\d{9}$/.test(g.mobile.trim())) return setError("Enter a 10-digit Indian mobile number.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(g.email.trim())) return setError("Enter a valid email.");
    if (g.address.trim().length < 8) return setError("Delivery address is too short.");
    if (!g.city.trim() || !g.state.trim()) return setError("City and state are required.");
    if (!/^\d{6}$/.test(g.pincode.trim())) return setError("Enter a 6-digit pincode.");
    setBusy(true);
    try {
      const order = await buyUsedListing(listing.id, safeRedeem);
      navigate(`/order-success?id=${encodeURIComponent(order.id)}`, { replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not buy");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <TopBar title="Used piece" back="/thrift" />
      <div className="page">
        {listing.photo ? <img className="listing-photo" src={listing.photo} alt="" /> : null}
        {listing.sold ? <div className="notice">Sold — this stall is empty now.</div> : null}
        <h1 style={{ marginBottom: 6 }}>{listing.title}</h1>
        <p>
          <b>{formatInr(listing.price)}</b>
          <br />
          <span className="muted">
            {CONDITION_LABEL[listing.condition]} · {listing.city} · {listing.category}
          </span>
        </p>
        <p>{listing.description}</p>
        <div className="notice">
          Seller {listing.sellerName} · {listing.mobile}
          <br />
          Buying does not create an account. The seller is contacted with your delivery mobile.
        </div>

        <h2>Buy this used item</h2>
        {(["fullName", "mobile", "email", "address", "city", "pincode"] as const).map((key) => (
          <div className="field" key={key}>
            <label htmlFor={key}>
              {key === "fullName"
                ? "Full name"
                : key === "mobile"
                  ? "Mobile number"
                  : key === "email"
                    ? "Email"
                    : key === "address"
                      ? "Delivery address"
                      : key === "city"
                        ? "City"
                        : "Pincode"}
            </label>
            {key === "address" ? (
              <textarea
                id={key}
                rows={3}
                value={checkout[key]}
                onChange={(e) => setCheckout({ [key]: e.target.value })}
              />
            ) : (
              <input
                id={key}
                inputMode={key === "mobile" || key === "pincode" ? "numeric" : "text"}
                value={checkout[key]}
                onChange={(e) => setCheckout({ [key]: e.target.value })}
              />
            )}
          </div>
        ))}
        <div className="field">
          <label htmlFor="state">State</label>
          <select id="state" value={checkout.state} onChange={(e) => setCheckout({ state: e.target.value })}>
            <option value="">Select</option>
            {STATES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>

        <h2>KarmaCoins</h2>
        <p className="muted">
          Balance {karmaBalance}. This buy credits {coinsEarned} coins. 1 coin = {formatInr(KARMA_TO_INR)}.
        </p>
        {maxRedeem > 0 ? (
          <div className="field">
            <label htmlFor="redeem">
              Redeem {safeRedeem} coins (−{formatInr(safeRedeem * KARMA_TO_INR)})
            </label>
            <input
              id="redeem"
              type="range"
              min={0}
              max={maxRedeem}
              value={safeRedeem}
              onChange={(e) => setRedeem(Number(e.target.value))}
            />
          </div>
        ) : null}

        <h2>Payment</h2>
        <div className="pay">
          {(
            [
              ["upi", "UPI — collect on device"],
              ["card", "Card — simulated charge"],
              ["cod", "Cash on delivery"],
            ] as [PaymentMethod, string][]
          ).map(([pid, label]) => (
            <label key={pid}>
              <input
                type="radio"
                name="pay"
                checked={checkout.paymentMethod === pid}
                onChange={() => setCheckout({ paymentMethod: pid })}
              />
              {label}
            </label>
          ))}
        </div>
        {device?.permission !== "granted" ? (
          <button className="btn ghost" type="button" onClick={() => void enableNotifications()}>
            Allow delivery notifications on this device
          </button>
        ) : null}
        <p>
          Item {formatInr(listing.price)}
          <br />
          Delivery {delivery === 0 ? "Free" : formatInr(delivery)}
          {safeRedeem > 0 ? (
            <>
              <br />
              Redeemed −{formatInr(safeRedeem * KARMA_TO_INR)}
            </>
          ) : null}
          <br />
          <b>To pay {formatInr(toPay)}</b>
        </p>
        {error ? <p style={{ color: "var(--danger)" }}>{error}</p> : null}
        <button className="btn" type="button" disabled={busy || listing.sold} onClick={() => void submit()}>
          {listing.sold ? "Sold" : busy ? "Placing…" : "Buy used"}
        </button>
        <Link className="btn ghost" to="/thrift" style={{ marginTop: 10 }}>
          Back to thrift
        </Link>
      </div>
    </>
  );
}
