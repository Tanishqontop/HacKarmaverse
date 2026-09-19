import { useState } from "react";
import { Link } from "react-router-dom";
import { TopBar } from "../components/AppShell";
import { useStore } from "../context/Store";
import { CATEGORIES, formatInr } from "../data/products";
import { formatTime } from "../lib/ids";
import { fileToThumb } from "../lib/photo";
import type { UsedListing } from "../types";

const empty = {
  title: "",
  category: "furniture",
  condition: "working" as UsedListing["condition"],
  price: "",
  description: "",
  sellerName: "",
  mobile: "",
  city: "",
};

export function SellPage() {
  const { usedListings, addUsedListing, removeUsedListing, session } = useStore();
  const [form, setForm] = useState({
    ...empty,
    sellerName: session?.name ?? "",
    mobile: session?.mobile ?? "",
  });
  const [photo, setPhoto] = useState<string>();
  const [error, setError] = useState("");

  async function onPhoto(file?: File) {
    if (!file) return;
    try {
      setPhoto(await fileToThumb(file));
    } catch {
      setError("Could not read that photo.");
    }
  }

  function submit() {
    setError("");
    const price = Number(form.price);
    if (form.title.trim().length < 3) return setError("Give the item a name.");
    if (!Number.isFinite(price) || price < 1) return setError("Enter a selling price.");
    if (form.description.trim().length < 8) return setError("Add a short description.");
    if (form.sellerName.trim().length < 2) return setError("Your name is required.");
    if (!/^[6-9]\d{9}$/.test(form.mobile.trim())) return setError("Enter a 10-digit mobile number.");
    if (!form.city.trim()) return setError("City is required.");
    addUsedListing({
      title: form.title.trim(),
      category: form.category,
      condition: form.condition,
      price,
      description: form.description.trim(),
      sellerName: form.sellerName.trim(),
      mobile: form.mobile.trim(),
      city: form.city.trim(),
      photo,
    });
    setForm(empty);
    setPhoto(undefined);
  }

  return (
    <>
      <TopBar title="Sell used" back="/more" />
      <div className="page">
        <div className="notice">
          List a used item as a guest. It appears in the <Link to="/thrift">thrift marketplace</Link> for buyers on this
          device. Buyers see your name, city, and mobile.
        </div>

        <h2>Add your product</h2>
        <div className="field">
          <label htmlFor="title">What are you selling?</label>
          <input
            id="title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. Water-hyacinth stool, barely used"
          />
        </div>
        <div className="field">
          <label htmlFor="ucat">Category</label>
          <select id="ucat" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
            <option value="electronics">Electronics</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="cond">Condition</label>
          <select
            id="cond"
            value={form.condition}
            onChange={(e) => setForm({ ...form, condition: e.target.value as UsedListing["condition"] })}
          >
            <option value="working">Working / good</option>
            <option value="fair">Fair, signs of use</option>
            <option value="for_parts">For parts / repair</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="uprice">Asking price (₹)</label>
          <input
            id="uprice"
            inputMode="numeric"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
        </div>
        <div className="field">
          <label htmlFor="udesc">Description</label>
          <textarea
            id="udesc"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <div className="field">
          <label htmlFor="uphoto">Photo</label>
          <input
            id="uphoto"
            type="file"
            accept="image/*"
            onChange={(e) => void onPhoto(e.target.files?.[0])}
          />
          {photo ? <img className="listing-photo" src={photo} alt="Listing preview" /> : null}
        </div>
        <div className="field">
          <label htmlFor="uname">Your name</label>
          <input id="uname" value={form.sellerName} onChange={(e) => setForm({ ...form, sellerName: e.target.value })} />
        </div>
        <div className="field">
          <label htmlFor="umob">Mobile</label>
          <input id="umob" inputMode="numeric" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} />
        </div>
        <div className="field">
          <label htmlFor="ucity">City</label>
          <input id="ucity" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
        </div>
        {error ? <p style={{ color: "var(--danger)" }}>{error}</p> : null}
        <button className="btn" type="button" onClick={submit}>
          List for sale
        </button>

        <div className="section-head">
          <h2>On this device</h2>
        </div>
        {usedListings.length === 0 ? (
          <p className="empty">No used listings yet.</p>
        ) : (
          <div className="list">
            {usedListings.map((l) => (
              <article key={l.id} className="listing-card">
                {l.photo ? <img src={l.photo} alt="" /> : <div className="listing-fallback">Used</div>}
                <div>
                  <b>{l.title}</b>
                  <div className="muted">
                    {l.sold ? "Sold · " : ""}
                    {formatInr(l.price)} · {l.condition.replace("_", " ")} · {l.city}
                  </div>
                  <p>{l.description}</p>
                  <div className="muted">
                    {l.sellerName} · {l.mobile} · {formatTime(l.createdAt)}
                  </div>
                  <div className="row" style={{ marginTop: 8 }}>
                    <Link className="btn ghost" to={`/thrift/${l.id}`}>
                      View in thrift
                    </Link>
                    <button className="btn ghost" type="button" onClick={() => removeUsedListing(l.id)}>
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
