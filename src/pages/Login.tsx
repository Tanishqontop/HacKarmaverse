import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TopBar } from "../components/AppShell";
import { useStore } from "../context/Store";
import { DEMO_ACCOUNT } from "../data/demo";

export function LoginPage() {
  const { login, signup, session } = useStore();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function fillDemo() {
    setMode("login");
    setEmail(DEMO_ACCOUNT.email);
    setPassword(DEMO_ACCOUNT.password);
    setError("");
  }

  async function submit() {
    setError("");
    setBusy(true);
    try {
      if (mode === "login") await login(email, password);
      else await signup({ name, email, mobile, password });
      navigate("/home", { replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not sign in");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <TopBar title={mode === "login" ? "Demo login" : "Demo signup"} />
      <div className="page">
        <div className="notice">
          Demo only — no OTP, no server, no real account. The built-in judge login is{" "}
          <b>{DEMO_ACCOUNT.email}</b> / <b>{DEMO_ACCOUNT.password}</b>. You can still shop as a guest.
        </div>

        {session ? (
          <>
            <p className="muted">
              Signed in as {session.name} ({session.email}).
            </p>
            <Link className="btn" to="/home">
              Enter shop
            </Link>
          </>
        ) : (
          <>
        <div className="row" style={{ marginBottom: 16 }}>
          <button className={mode === "login" ? "btn" : "btn ghost"} type="button" onClick={() => setMode("login")}>
            Log in
          </button>
          <button className={mode === "signup" ? "btn" : "btn ghost"} type="button" onClick={() => setMode("signup")}>
            Sign up
          </button>
        </div>

        {mode === "signup" ? (
          <>
            <div className="field">
              <label htmlFor="name">Name</label>
              <input id="name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
            </div>
            <div className="field">
              <label htmlFor="mobile">Mobile</label>
              <input
                id="mobile"
                inputMode="numeric"
                maxLength={10}
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                autoComplete="tel"
              />
            </div>
          </>
        ) : null}

        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
          />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
          />
        </div>

        {error ? <p style={{ color: "var(--danger)" }}>{error}</p> : null}

        <button className="btn" type="button" disabled={busy} onClick={() => void submit()}>
          {busy ? "Please wait…" : mode === "login" ? "Log in" : "Create demo account"}
        </button>
        <div className="row" style={{ marginTop: 12 }}>
          <button className="btn secondary" type="button" onClick={fillDemo}>
            Fill demo account
          </button>
          <Link className="btn ghost" to="/home">
            Continue as guest
          </Link>
        </div>
          </>
        )}
      </div>
    </>
  );
}
