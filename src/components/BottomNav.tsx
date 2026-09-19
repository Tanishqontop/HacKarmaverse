import { NavLink, useLocation } from "react-router-dom";
import { cartCount, useStore } from "../context/Store";

const tabs = [
  { to: "/home", label: "Home", icon: "⌂" },
  { to: "/haat", label: "Haat", icon: "⌕" },
  { to: "/thrift", label: "Thrift", icon: "↺" },
  { to: "/cart", label: "Cart", icon: "◻" },
  { to: "/more", label: "More", icon: "⋯" },
];

export function BottomNav() {
  const { cart } = useStore();
  const { pathname } = useLocation();
  const n = cartCount(cart);
  return (
    <nav className="bottom-nav">
      {tabs.map((t) => (
        <NavLink
          key={t.to}
          to={t.to}
          className={({ isActive }) =>
            isActive || (t.to === "/haat" && pathname === "/search") ? "active" : ""
          }
        >
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
