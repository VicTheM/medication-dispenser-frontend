import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ApiError } from "../api/client";

export default function Login() {
  const [mode, setMode] = useState<"caregiver" | "patient">("caregiver");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { loginCaregiver, loginPatient } = useAuth();
  const navigate = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "caregiver") {
        await loginCaregiver(email, password);
        navigate("/app");
      } else {
        await loginPatient(email, password);
        navigate("/portal");
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="card auth-card">
        <Link to="/" className="auth-brand"><span aria-hidden="true">⬢</span> MedAdhere</Link>
        <h1>Welcome back</h1>
        <p className="sub">Log in to continue.</p>

        <div className="auth-toggle" role="tablist" aria-label="Login as">
          <button type="button" role="tab" aria-selected={mode === "caregiver"} className={mode === "caregiver" ? "active" : ""} onClick={() => setMode("caregiver")}>Caregiver</button>
          <button type="button" role="tab" aria-selected={mode === "patient"} className={mode === "patient" ? "active" : ""} onClick={() => setMode("patient")}>Patient</button>
        </div>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={onSubmit}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
          </div>
          <button className="btn btn-primary btn-block" disabled={loading} type="submit">
            {loading ? <span className="spinner" /> : "Log in"}
          </button>
        </form>

        {mode === "caregiver" && (
          <p className="auth-foot">New here? <Link to="/register">Create a caregiver account</Link></p>
        )}
        {mode === "patient" && (
          <p className="auth-foot text-slate">Patient accounts are created by your caregiver during enrolment.</p>
        )}
      </div>
    </div>
  );
}
