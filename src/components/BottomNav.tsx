import { NavLink } from "react-router-dom";
import { cartCount, useStore } from "../context/Store";

const tabs = [
  { to: "/home", label: "Home", icon: "⌂" },
  { to: "/search", label: "Explore", icon: "⌕" },
  { to: "/cart", label: "Cart", icon: "◻" },
  { to: "/orders", label: "Orders", icon: "▤" },
  { to: "/more", label: "More", icon: "⋯" },
];

export function BottomNav() {
  const { cart } = useStore();
  const n = cartCount(cart);
  return (
    <nav className="bottom-nav">
      {tabs.map((t) => (
        <NavLink key={t.to} to={t.to} className={({ isActive }) => (isActive ? "active" : "")}>
          <span style={{ position: "relative" }}>
            {t.icon}
            {t.to === "/cart" && n > 0 ? <span className="dot">{n}</span> : null}
          </span>
          {t.label}
        </NavLink>
      ))}
    </nav>
  );
}
