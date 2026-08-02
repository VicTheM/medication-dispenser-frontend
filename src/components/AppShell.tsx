import { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Caregiver, Patient } from "../api/types";

interface NavItem { to: string; label: string; icon: string; end?: boolean; }

export default function AppShell({ children, navItems, roleLabel }: {
  children: ReactNode; navItems: NavItem[]; roleLabel: string;
}) {
  const { identity, logout } = useAuth();
  const navigate = useNavigate();
  const name = identity ? (identity as Caregiver).full_name || (identity as Patient).full_name : "";

  function onLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="appshell">
      <aside className="sidebar">
        <a href="/" className="sidebar-brand"><span aria-hidden="true">⬢</span> MedAdhere</a>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}
          >
            <span aria-hidden="true">{item.icon}</span> {item.label}
          </NavLink>
        ))}
        <div className="sidebar-foot">
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", marginBottom: 10 }}>{roleLabel}</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "white", marginBottom: 12 }}>{name}</div>
          <button className="btn btn-ghost btn-sm" style={{ color: "white", borderColor: "rgba(255,255,255,0.25)", width: "100%" }} onClick={onLogout}>
            Log out
          </button>
        </div>
      </aside>
      <div className="main">{children}</div>
    </div>
  );
}
