import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { TopBar } from "../components/AppShell";
import { useStore } from "../context/Store";
import { formatInr, getProduct } from "../data/products";
import { customerQuestions } from "../data/qa";
import { answerAboutProduct } from "../services/ai";

export function ProductPage() {
  const { id = "" } = useParams();
  const product = getProduct(id);
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, wishlist, viewProduct, chats, pushChat } = useStore();
  const [q, setQ] = useState("");
  const [added, setAdded] = useState(false);
  const [photo, setPhoto] = useState(0);

  useEffect(() => {
    setPhoto(0);
    setAdded(false);
    if (product) viewProduct(product.id);
  }, [product, viewProduct]);

  const thread = useMemo(
    () => chats.filter((m) => m.productId === id),
    [chats, id],
  );

  if (!product) {
    return (
      <>
        <TopBar back="/home" title="Missing" />
        <p className="empty">This stall packed up.</p>
      </>
    );
  }

  function ask(text = q) {
    const trimmed = text.trim();
    if (!trimmed || !product) return;
    pushChat(product.id, "user", trimmed);
    pushChat(product.id, "ai", answerAboutProduct(product, trimmed));
    setQ("");
  }

  return (
    <>
      <TopBar back="/home" title={product.brand} />
      <div className="page">
        {product.images?.length ? (
          <>
            <div className="hero-photo">
              {product.badge ? <span className="badge">{product.badge}</span> : null}
              <img src={product.images[photo] ?? product.images[0]} alt={product.name} />
            </div>
            {product.images.length > 1 ? (
              <div className="gallery">
                {product.images.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    className={i === photo ? "on" : ""}
                    onClick={() => setPhoto(i)}
                    aria-label={`Photo ${i + 1}`}
                  >
                    <img src={src} alt="" />
                  </button>
                ))}
              </div>
            ) : null}
          </>
        ) : (
          <div className="swatch" style={{ background: product.hue, height: 180, borderRadius: 24 }}>
            {product.badge ? <span className="badge">{product.badge}</span> : null}
            <span style={{ fontSize: 72 }}>{product.glyph}</span>
          </div>
        )}
        <p className="muted" style={{ marginTop: 16 }}>
          {product.rating} ★ · {product.reviews} reviews · {product.stock} in stock
        </p>
        <h1 style={{ fontSize: 32, margin: "4px 0" }}>{product.name}</h1>
        <p>{product.tagline}</p>
        <div className="price">
          <b style={{ fontSize: 22 }}>{formatInr(product.price)}</b>
          {product.mrp > product.price ? <span className="strike">{formatInr(product.mrp)}</span> : null}
        </div>
        <p className="notice">
          Guest price {formatInr(product.price)}. You receive <b>{product.karmaCoins} KarmaCoins</b> on this device
          after checkout — no account.
        </p>
        <p>{product.description}</p>
        <ul>
          {product.highlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
        <div className="notice">
          Delivery in about {product.deliveryDays} days. Guest checkout — we only ask for an address when you buy.
        </div>
        <div className="row">
          <button
            className="btn"
            type="button"
            onClick={() => {
              addToCart(product.id);
              setAdded(true);
            }}
          >
            {added ? "Added" : "Add to cart"}
          </button>
          <button className="btn ghost" type="button" onClick={() => toggleWishlist(product.id)}>
            {wishlist.includes(product.id) ? "Saved" : "Wishlist"}
          </button>
        </div>
        {added ? (
          <p>
            <Link to="/cart">Go to cart →</Link>
          </p>
        ) : null}

        <h2 style={{ marginTop: 28 }}>Ask AI about this product</h2>
        <div className="chat">
          <div className="bubbles">
            {thread.length === 0 ? (
              <div className="bubble ai">
                I answer from this product’s question matrix. Tap a prompt or type your own — I will not invent specs.
              </div>
            ) : (
              thread.map((m) => (
                <div key={m.id} className={`bubble ${m.role}`}>
                  {m.text}
                </div>
              ))
            )}
          </div>
          <p>
            {customerQuestions(product.id)
              .slice(0, 6)
              .map((item) => (
                <button key={item.question} className="chip" type="button" onClick={() => ask(item.question)}>
                  {item.question}
                </button>
              ))}
          </p>
          <div className="row">
            <input
              style={{ flex: 1, border: "1px solid var(--line)", borderRadius: 999, padding: "12px 14px" }}
              value={q}
              placeholder="Ask about materials, fit, care…"
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") ask();
              }}
            />
            <button className="btn" style={{ width: "auto", paddingInline: 18 }} type="button" onClick={() => ask()}>
              Ask
            </button>
          </div>
        </div>

        <h2 style={{ marginTop: 24 }}>Specs</h2>
        {product.specs.map((s) => (
          <p key={s.label}>
            <b>{s.label}</b> · {s.value}
          </p>
        ))}

        <button
          className="btn secondary"
          type="button"
          onClick={() => {
            addToCart(product.id);
            navigate("/checkout");
          }}
        >
          Buy now as guest
        </button>
      </div>
    </>
  );
}
