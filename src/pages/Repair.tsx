import { useState } from "react";
import { TopBar } from "../components/AppShell";
import { useStore } from "../context/Store";
import { formatTime } from "../lib/ids";
import { fileToThumb } from "../lib/photo";

const ITEM_TYPES = [
  "Lamp / lighting",
  "Laptop / computer",
  "Phone / tablet",
  "Audio / radio",
  "Kitchen electronics",
  "Other electronics",
];

const SLOTS = ["Morning (9–12)", "Afternoon (12–4)", "Evening (4–7)", "Weekend"];

const empty = {
  itemType: ITEM_TYPES[0],
  brand: "",
  model: "",
  issue: "",
  preferredSlot: SLOTS[0],
  name: "",
  mobile: "",
  address: "",
  city: "",
  pincode: "",
};

export function RepairPage() {
  const { repairs, addRepairRequest } = useStore();
  const [form, setForm] = useState(empty);
  const [photo, setPhoto] = useState<string>();
  const [error, setError] = useState("");
  const [doneId, setDoneId] = useState("");

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
    if (!form.brand.trim()) return setError("Brand or make is required.");
    if (form.issue.trim().length < 8) return setError("Describe the fault in a few words.");
    if (form.name.trim().length < 2) return setError("Your name is required.");
    if (!/^[6-9]\d{9}$/.test(form.mobile.trim())) return setError("Enter a 10-digit mobile number.");
    if (form.address.trim().length < 8) return setError("Pickup address is too short.");
    if (!form.city.trim()) return setError("City is required.");
    if (!/^\d{6}$/.test(form.pincode.trim())) return setError("Enter a 6-digit pincode.");
    addRepairRequest({ ...form, photo });
    setDoneId("ok");
    setForm(empty);
    setPhoto(undefined);
  }

  return (
    <>
      <TopBar title="Repair request" back="/more" />
      <div className="page">
        <div className="notice">
          Request a pickup-repair for an electronic item. No login. We store the request on this device and share it
          with a technician using your mobile number.
        </div>

        {doneId ? (
          <p className="notice">
            Request received. A technician will call the number you entered. Track it below on this device.
          </p>
        ) : null}

        <h2>What needs repair?</h2>
        <div className="field">
          <label htmlFor="itype">Item</label>
          <select id="itype" value={form.itemType} onChange={(e) => setForm({ ...form, itemType: e.target.value })}>
            {ITEM_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="brand">Brand</label>
          <input id="brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
        </div>
        <div className="field">
          <label htmlFor="model">Model (optional)</label>
          <input id="model" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} />
        </div>
        <div className="field">
          <label htmlFor="issue">What’s wrong?</label>
          <textarea
            id="issue"
            rows={3}
            value={form.issue}
            onChange={(e) => setForm({ ...form, issue: e.target.value })}
            placeholder="Won’t power on, flicker, battery, charging port…"
          />
        </div>
        <div className="field">
          <label htmlFor="slot">Preferred visit</label>
          <select
            id="slot"
            value={form.preferredSlot}
            onChange={(e) => setForm({ ...form, preferredSlot: e.target.value })}
          >
            {SLOTS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="rphoto">Photo of the item</label>
          <input id="rphoto" type="file" accept="image/*" onChange={(e) => void onPhoto(e.target.files?.[0])} />
          {photo ? <img className="listing-photo" src={photo} alt="Repair item" /> : null}
        </div>
        <div className="field">
          <label htmlFor="rname">Your name</label>
          <input id="rname" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="field">
          <label htmlFor="rmob">Mobile</label>
          <input id="rmob" inputMode="numeric" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} />
        </div>
        <div className="field">
          <label htmlFor="raddr">Pickup address</label>
          <textarea id="raddr" rows={2} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        </div>
        <div className="field">
          <label htmlFor="rcity">City</label>
          <input id="rcity" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
        </div>
        <div className="field">
          <label htmlFor="rpin">Pincode</label>
          <input id="rpin" inputMode="numeric" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} />
        </div>
        {error ? <p style={{ color: "var(--danger)" }}>{error}</p> : null}
        <button className="btn secondary" type="button" onClick={submit}>
          Request repair
        </button>

        <div className="section-head">
          <h2>Your requests</h2>
        </div>
        {repairs.length === 0 ? (
          <p className="empty">No repair requests on this device.</p>
        ) : (
          <div className="list">
            {repairs.map((r) => (
              <article key={r.id} className="listing-card">
                {r.photo ? <img src={r.photo} alt="" /> : <div className="listing-fallback">Fix</div>}
                <div>
                  <b>
                    {r.brand} {r.model}
                  </b>
                  <div className="muted">
                    {r.itemType} · {r.status.replace("_", " ")} · {r.preferredSlot}
                  </div>
                  <p>{r.issue}</p>
                  <div className="muted">
                    {r.id} · {r.city} {r.pincode} · {formatTime(r.createdAt)}
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
