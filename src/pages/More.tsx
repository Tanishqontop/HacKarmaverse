import { Link } from "react-router-dom";
import { TopBar } from "../components/AppShell";
import { useStore } from "../context/Store";

const links = [
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
  const { device, karmaBalance } = useStore();
  return (
    <>
      <TopBar title="More" />
      <div className="page">
        <div className="notice">
          <b>{karmaBalance} KarmaCoins</b> on this device. Coins are credited at guest checkout — not a user account.
          <br />
          Device {device?.deviceId} holds cart, wishlist, chats, and coins until you clear site data.
        </div>
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
