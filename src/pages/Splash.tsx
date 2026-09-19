import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function SplashPage() {
  const navigate = useNavigate();
  useEffect(() => {
    const t = window.setTimeout(() => navigate("/home", { replace: true }), 1600);
    return () => window.clearTimeout(t);
  }, [navigate]);

  return (
    <section className="splash">
      <div className="orb" />
      <div className="orb2" />
      <p className="muted" style={{ color: "#cfc3ae" }}>
        Marketplace · no account
      </p>
      <h1>Haat</h1>
      <p>Walk in like a bazaar. Browse, ask, buy. Checkout as a guest.</p>
    </section>
  );
}
