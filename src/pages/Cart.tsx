import { Link, useNavigate } from "react-router-dom";
import { TopBar } from "../components/AppShell";
import { ProductThumb } from "../components/ProductMedia";
import { cartProducts, useStore } from "../context/Store";
import { formatInr } from "../data/products";

export function CartPage() {
  const { cart, setQty, removeFromCart } = useStore();
  const rows = cartProducts(cart);
  const navigate = useNavigate();
  const subtotal = rows.reduce((s, r) => s + r.product.price * r.qty, 0);
  const delivery = subtotal >= 999 || subtotal === 0 ? 0 : 49;
  const coins = rows.reduce((s, r) => s + r.product.karmaCoins * r.qty, 0);

  return (
    <>
      <TopBar title="Cart" />
      <div className="page">
        {rows.length === 0 ? (
          <div className="empty">
            <p>Your basket is a still life.</p>
            <Link to="/haat" className="btn" style={{ display: "inline-flex", width: "auto", paddingInline: 24 }}>
              Browse Haat
            </Link>
          </div>
        ) : (
          <>
            <div className="list">
              {rows.map((r) => (
                <div key={r.productId} className="line-item">
                  <ProductThumb product={r.product} className="swatch cart-thumb" height={64} showBadge={false} />
                  <div>
                    <Link to={`/product/${r.productId}`}>
                      <b>{r.product.name}</b>
                    </Link>
                    <div className="muted">
                      {formatInr(r.product.price)} · {r.product.karmaCoins} KarmaCoins each
                    </div>
                    <div className="qty">
                      <button type="button" onClick={() => setQty(r.productId, r.qty - 1)}>
                        −
                      </button>
                      {r.qty}
                      <button type="button" onClick={() => setQty(r.productId, Math.min(9, r.qty + 1))}>
                        +
                      </button>
                    </div>
                  </div>
                  <button className="icon-btn" type="button" onClick={() => removeFromCart(r.productId)}>
                    ×
                  </button>
                </div>
              ))}
            </div>
            <p>
              Subtotal {formatInr(subtotal)}
              <br />
              Delivery {delivery === 0 ? "Free" : formatInr(delivery)}
              <br />
              <b>Total {formatInr(subtotal + delivery)}</b>
              <br />
              This order credits {coins} KarmaCoins
            </p>
            <p className="muted">Free delivery over ₹999. Checkout does not create an account.</p>
            <button className="btn" type="button" onClick={() => navigate("/checkout")}>
              Checkout as guest
            </button>
          </>
        )}
      </div>
    </>
  );
}
