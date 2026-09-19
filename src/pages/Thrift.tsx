import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { TopBar } from "../components/AppShell";
import { ThriftCard } from "../components/ThriftCard";
import { useStore } from "../context/Store";
import { THRIFT_CATEGORIES } from "../data/thrift";

export function ThriftPage() {
  const { usedListings } = useStore();
  const [cat, setCat] = useState("all");
  const [hideSold, setHideSold] = useState(true);

  const rows = useMemo(() => {
    return usedListings.filter((l) => {
      if (hideSold && l.sold) return false;
      if (cat !== "all" && l.category !== cat) return false;
      return true;
    });
  }, [usedListings, cat, hideSold]);

  return (
    <>
      <TopBar title="Thrift" back="/home" />
      <div className="page">
        <div className="notice">
          Used marketplace only — not the six Haat catalogue products. List your own from Sell used.
        </div>
        <div className="row" style={{ marginBottom: 16 }}>
          <Link className="btn" to="/sell">
            Sell something
          </Link>
        </div>
        <p>
          {THRIFT_CATEGORIES.map((c) => (
            <button
              key={c.id}
              className={cat === c.id ? "chip on" : "chip"}
              type="button"
              onClick={() => setCat(c.id)}
            >
              {c.label}
            </button>
          ))}
          <button className={hideSold ? "chip on" : "chip"} type="button" onClick={() => setHideSold((v) => !v)}>
            {hideSold ? "Hiding sold" : "Showing sold"}
          </button>
        </p>
        {rows.length === 0 ? (
          <p className="empty">No used pieces in this lane yet.</p>
        ) : (
          <div className="grid">
            {rows.map((l) => (
              <ThriftCard key={l.id} listing={l} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
