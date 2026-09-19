import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TopBar } from "../components/AppShell";
import { cartProducts, useStore } from "../context/Store";
import { formatInr, KARMA_TO_INR } from "../data/products";
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

export function CheckoutPage() {
  const { cart, checkout, setCheckout, placeOrder, enableNotifications, device, karmaBalance, session } =
    useStore();
  const rows = cartProducts(cart);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const subtotal = rows.reduce((s, r) => s + r.product.price * r.qty, 0);
  const delivery = subtotal >= 999 || subtotal === 0 ? 0 : 49;
  const payable = subtotal + delivery;
  const coinsEarned = rows.reduce((s, r) => s + r.product.karmaCoins * r.qty, 0);
  const maxRedeem = Math.min(karmaBalance, payable);
  const [redeem, setRedeem] = useState(0);

  useEffect(() => {
    setRedeem(maxRedeem);
  }, [maxRedeem]);

  const safeRedeem = Math.min(redeem, maxRedeem);
  const toPay = Math.max(0, payable - safeRedeem * KARMA_TO_INR);

  async function submit() {
    setError("");
    const g = checkout;
    if (!g.fullName.trim()) return setError("Full name is required.");
    if (!/^[6-9]\d{9}$/.test(g.mobile.trim())) return setError("Enter a 10-digit Indian mobile number.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(g.email.trim())) return setError("Enter a valid email.");
    if (g.address.trim().length < 8) return setError("Delivery address is too short.");
    if (!g.city.trim() || !g.state.trim()) return setError("City and state are required.");
    if (!/^\d{6}$/.test(g.pincode.trim())) return setError("Enter a 6-digit pincode.");
    if (rows.length === 0) return setError("Your cart is empty.");
    setBusy(true);
    try {
      const order = await placeOrder(safeRedeem);
      navigate(`/order-success?id=${encodeURIComponent(order.id)}`, { replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not place order");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <TopBar title={session ? "Checkout" : "Guest checkout"} back="/cart" />
      <div className="page">
        <div className="notice">
          {session ? (
            <>
              Prefilling from the demo login for {session.name}. You can still edit the address. Track later with Order
              ID + mobile.
            </>
          ) : (
            <>
              We collect this only for this order. No password or OTP is required.{" "}
              <Link to="/login">Demo login</Link> prefills a sample profile. Track later with Order ID + mobile.
            </>
          )}
        </div>

        {rows.length === 0 ? (
          <p className="muted">
            Cart is empty. Add something first, or use Buy now on a product — it will land here after you add it.
          </p>
        ) : null}

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
        <div className="notice">
          You have <b>{karmaBalance}</b> on this device. 1 KarmaCoin = {formatInr(KARMA_TO_INR)}. Available coins are
          applied to this order unless you choose Use none. After payment you still earn {coinsEarned} coins.
        </div>
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
            <div className="row">
              <button className="btn ghost" type="button" onClick={() => setRedeem(0)}>
                Use none
              </button>
              <button className="btn ghost" type="button" onClick={() => setRedeem(maxRedeem)}>
                Use max
              </button>
            </div>
          </div>
        ) : karmaBalance > 0 ? (
          <p className="muted">Add items to the cart to redeem your {karmaBalance} KarmaCoins (1 coin = ₹1).</p>
        ) : (
          <p className="muted">Earn coins on this order, then redeem them on the next guest checkout.</p>
        )}

        <h2>Payment</h2>
        <div className="pay">
          {(
            [
              ["upi", "UPI — collect on device"],
              ["card", "Card — simulated charge"],
              ["cod", "Cash on delivery"],
            ] as [PaymentMethod, string][]
          ).map(([id, label]) => (
            <label key={id}>
              <input
                type="radio"
                name="pay"
                checked={checkout.paymentMethod === id}
                onChange={() => setCheckout({ paymentMethod: id })}
              />
              {label}
            </label>
          ))}
        </div>

        {device?.permission !== "granted" ? (
          <button className="btn ghost" type="button" onClick={() => void enableNotifications()}>
            Allow delivery notifications on this device
          </button>
        ) : (
          <p className="muted">Notifications on. This device’s FCM token will be tied to the order ID.</p>
        )}

        <p>
          Subtotal {formatInr(subtotal)}
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
        <button className="btn" type="button" disabled={busy} onClick={() => void submit()}>
          {busy
            ? "Placing…"
            : safeRedeem > 0
              ? `Place order · redeem ${safeRedeem} coins`
              : "Place order"}
        </button>
      </div>
    </>
  );
}
