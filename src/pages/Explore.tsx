import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { TopBar } from "../components/AppShell";
import { ProductCard } from "../components/ProductCard";
import { useStore } from "../context/Store";
import { CATEGORIES, searchProducts } from "../data/products";
import type { Product } from "../types";

export function SearchPage() {
  const [params, setParams] = useSearchParams();
  const { recentSearches, rememberSearch } = useStore();
  const [q, setQ] = useState(params.get("q") ?? "");
  const cat = (params.get("cat") as Product["category"] | "all" | null) ?? "all";

  const results = useMemo(() => searchProducts(q, cat === "all" ? undefined : cat), [q, cat]);

  function applyCat(next: string) {
    const p = new URLSearchParams(params);
    if (next === "all") p.delete("cat");
    else p.set("cat", next);
    setParams(p);
  }

  function runSearch() {
    rememberSearch(q);
    const p = new URLSearchParams(params);
    if (q.trim()) p.set("q", q.trim());
    else p.delete("q");
    setParams(p);
  }

  return (
    <>
      <TopBar title="Explore" back="/home" />
      <div className="page">
        <div className="field">
          <label htmlFor="q">Search the bazaar</label>
          <input
            id="q"
            value={q}
            placeholder="MittiFlow, mycelium, hyacinth…"
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") runSearch();
            }}
          />
        </div>
        <button className="btn" onClick={runSearch} type="button">
          Search
        </button>

        {recentSearches.length > 0 ? (
          <p style={{ marginTop: 16 }}>
            {recentSearches.map((s) => (
              <button
                key={s}
                className="chip"
                type="button"
                onClick={() => {
                  setQ(s);
                  rememberSearch(s);
                  const p = new URLSearchParams(params);
                  p.set("q", s);
                  setParams(p);
                }}
              >
                {s}
              </button>
            ))}
          </p>
        ) : null}

        <p>
          <button className={cat === "all" || !params.get("cat") ? "chip on" : "chip"} type="button" onClick={() => applyCat("all")}>
            All
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              className={cat === c.id ? "chip on" : "chip"}
              type="button"
              onClick={() => applyCat(c.id)}
            >
              {c.label}
            </button>
          ))}
        </p>

        <div className="section-head">
          <h2>{results.length} finds</h2>
        </div>
        {results.length === 0 ? (
          <p className="empty">Nothing in this aisle. Try another word.</p>
        ) : (
          <div className="grid">
            {results.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
