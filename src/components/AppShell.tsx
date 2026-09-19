import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { useStore } from "../context/Store";
import { BottomNav } from "./BottomNav";

export function AppShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const bare = pathname === "/splash";
  return (
    <div className={bare ? "app-shell bare" : "app-shell"}>
      {children}
      {bare ? null : <BottomNav />}
    </div>
  );
}

export function TopBar({
  title,
  back,
}: {
  title?: string;
  back?: string;
}) {
  const { karmaBalance } = useStore();
  return (
    <header className="topbar">
      {back ? (
        <Link to={back} className="icon-btn" aria-label="Back">
          ←
        </Link>
      ) : (
        <div className="brand">
          <strong>Haat</strong>
          <span>guest</span>
        </div>
      )}
      {title ? <b className="topbar-title">{title}</b> : <span />}
      <div className="topbar-end">
        <div className="karma-pill" aria-label={`${karmaBalance} KarmaCoins`}>
          <span className="karma-pill-label">KarmaCoins</span>
          <b>{karmaBalance}</b>
        </div>
        <Link to="/notifications" className="icon-btn" aria-label="Notifications">
          ✶
        </Link>
      </div>
    </header>
  );
}
