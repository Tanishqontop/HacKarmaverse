export function newId(prefix = "id") {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let core = "";
  const bytes = crypto.getRandomValues(new Uint8Array(5));
  for (const b of bytes) core += alphabet[b % alphabet.length];
  return `${prefix}-${core}`;
}

export function makeOrderId() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(5));
  let tail = "";
  for (const b of bytes) tail += alphabet[b % alphabet.length];
  return `ORD-${new Date().getFullYear()}-${tail}`;
}

export function isoDaysFromNow(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(18, 0, 0, 0);
  return d.toISOString();
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatTime(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}
