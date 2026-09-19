import { Link, useNavigate } from "react-router-dom";
import { TopBar } from "../components/AppShell";
import { ProductCard } from "../components/ProductCard";
import { useStore } from "../context/Store";
import { CATEGORIES, PRODUCTS, getProduct } from "../data/products";

export function HomePage() {
  const { recentViews } = useStore();
  const navigate = useNavigate();
  const viewed = recentViews.map(getProduct).filter((p) => p != null);

  return (
    <>
      <TopBar />
      <div className="page">
        <section className="hero">
          <h1>The stall is open. No ticket needed.</h1>
          <p>Guest checkout, device-local cart, and an AI that only talks about the thing in your hand.</p>
          <Link to="/search" className="search-pill">
            ⌕  Search terracotta, mycelium, denim…
          </Link>
        </section>

        <div className="row" style={{ marginBottom: 22 }}>
          <Link className="btn secondary" to="/sell">
            Sell used
          </Link>
          <Link className="btn" to="/repair">
            Repair
          </Link>
        </div>

        <div className="cats">
          {CATEGORIES.map((c) => (
            <button key={c.id} className="cat" onClick={() => navigate(`/search?cat=${c.id}`)}>
              <span className="g">{c.glyph}</span>
              <small>{c.label}</small>
            </button>
          ))}
        </div>

        {viewed.length > 0 ? (
          <>
            <div className="section-head">
              <h2>Recently viewed</h2>
            </div>
            <div className="grid">
              {viewed.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </>
        ) : null}

        <div className="section-head">
          <h2>The six stalls</h2>
          <Link to="/search" className="muted">
            See all
          </Link>
        </div>
        <div className="grid">
          {PRODUCTS.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </>
  );
}
