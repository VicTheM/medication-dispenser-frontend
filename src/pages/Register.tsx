import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ApiError } from "../api/client";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { registerCaregiver } = useAuth();
  const navigate = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      await registerCaregiver(fullName, email, password, phone);
      navigate("/app");
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
        <h1>Create your account</h1>
        <p className="sub">For caregivers setting up medication schedules for a patient.</p>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={onSubmit}>
          <div className="field">
            <label htmlFor="fullName">Full name</label>
            <input id="fullName" required value={fullName} onChange={(e) => setFullName(e.target.value)} autoComplete="name" />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </div>
          <div className="field">
            <label htmlFor="phone">Phone <span className="hint">(optional)</span></label>
            <input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
            <span className="hint">At least 8 characters.</span>
          </div>
          <button className="btn btn-primary btn-block" disabled={loading} type="submit">
            {loading ? <span className="spinner" /> : "Create account"}
          </button>
        </form>

        <p className="auth-foot">Already have an account? <Link to="/login">Log in</Link></p>
      </div>
    </div>
  );
}
