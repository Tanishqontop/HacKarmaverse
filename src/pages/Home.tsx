import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TopBar } from "../components/AppShell";
import { ThriftCard } from "../components/ThriftCard";
import { ProductCard } from "../components/ProductCard";
import { useStore } from "../context/Store";
import { CATEGORIES, PRODUCTS, getProduct } from "../data/products";

export function HomePage() {
  const { recentViews, usedListings } = useStore();
  const navigate = useNavigate();
  const [lane, setLane] = useState<"haat" | "thrift">("haat");
  const viewed = recentViews.map(getProduct).filter((p) => p != null);
  const thriftPreview = usedListings.filter((l) => !l.sold);

  return (
    <>
      <TopBar />
      <div className="page">
        <section className="hero">
          <h1>{lane === "haat" ? "Haat — six new stalls" : "Thrift — used, not ours"}</h1>
          <p>
            {lane === "haat"
              ? "MittiFlow, NariGlow, MycoRise, JalCycle, CocoForm, and ReDenim. New from the makers."
              : "Second-hand pieces from other guests. None of these are the six Haat products."}
          </p>
          {lane === "haat" ? (
            <Link to="/haat" className="search-pill">
              ⌕  Search the six stalls…
            </Link>
          ) : (
            <Link to="/thrift" className="search-pill">
              ⌕  Browse used listings…
            </Link>
          )}
        </section>

        <div className="lane-switch" role="tablist" aria-label="Marketplace">
          <button
            type="button"
            role="tab"
            aria-selected={lane === "haat"}
            className={lane === "haat" ? "on" : ""}
            onClick={() => setLane("haat")}
          >
            Haat
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={lane === "thrift"}
            className={lane === "thrift" ? "on" : ""}
            onClick={() => setLane("thrift")}
          >
            Thrift
          </button>
        </div>

        {lane === "haat" ? (
          <>
            <div className="cats">
              {CATEGORIES.map((c) => (
                <button key={c.id} className="cat" onClick={() => navigate(`/haat?cat=${c.id}`)}>
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
              <h2>Haat</h2>
              <Link to="/haat" className="muted">
                See all six
              </Link>
            </div>
            <p className="muted" style={{ marginTop: -8 }}>
              New catalogue only — not thrift.
            </p>
            <div className="grid">
              {PRODUCTS.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
            <Link className="btn ghost" to="/repair" style={{ marginTop: 16 }}>
              Request a repair
            </Link>
          </>
        ) : (
          <>
            <div className="row" style={{ marginBottom: 16 }}>
              <Link className="btn" to="/sell">
                Sell used
              </Link>
              <Link className="btn secondary" to="/thrift">
                Full thrift stall
              </Link>
            </div>
            <div className="section-head">
              <h2>Thrift</h2>
              <Link to="/thrift" className="muted">
                See all
              </Link>
            </div>
            <p className="muted" style={{ marginTop: -8 }}>
              Used goods from guests. Separate from the Haat catalogue.
            </p>
            {thriftPreview.length === 0 ? (
              <p className="empty">No used pieces yet. List one from Sell used.</p>
            ) : (
              <div className="grid">
                {thriftPreview.map((l) => (
                  <ThriftCard key={l.id} listing={l} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
