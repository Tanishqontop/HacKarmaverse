import { Link } from "react-router-dom";
import { TopBar } from "../components/AppShell";
import { useStore } from "../context/Store";

const links = [
  { to: "/haat", label: "Haat — six new products" },
  { to: "/thrift", label: "Thrift — used marketplace" },
  { to: "/orders", label: "Orders" },
  { to: "/sell", label: "Sell used products" },
  { to: "/repair", label: "Request a repair" },
  { to: "/wishlist", label: "Wishlist" },
  { to: "/notifications", label: "Notifications" },
  { to: "/help", label: "Help & Support" },
  { to: "/about", label: "About" },
  { to: "/privacy", label: "Privacy Policy" },
  { to: "/terms", label: "Terms & Conditions" },
];

export function MorePage() {
  const { device, karmaBalance, session, logout } = useStore();
  return (
    <>
      <TopBar title="More" />
      <div className="page">
        <div className="notice">
          {session ? (
            <>
              Signed in as <b>{session.name}</b> ({session.email}) — demo session on this device only.
              <br />
            </>
          ) : (
            <>
              Shopping as a guest. Use <Link to="/login">demo login</Link> to prefill checkout.
              <br />
            </>
          )}
          <b>{karmaBalance} KarmaCoins</b> stay on this device with cart, wishlist, and chats.
          <br />
          Device {device?.deviceId}
        </div>
        {session ? (
          <button className="btn" type="button" style={{ marginBottom: 12 }} onClick={() => { logout(); }}>
            Log out
          </button>
        ) : (
          <Link className="btn" to="/login" style={{ marginBottom: 16, display: "inline-flex" }}>
            Demo login
          </Link>
        )}
        {links.map((l) => (
          <Link key={l.to} className="more-link" to={l.to}>
            <span>{l.label}</span>
            <span>→</span>
          </Link>
        ))}
      </div>
    </>
  );
}
