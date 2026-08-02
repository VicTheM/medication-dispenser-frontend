import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Role } from "../api/types";

export function ProtectedRoute({ role, children }: { role: Role; children: ReactNode }) {
  const { role: currentRole, loading } = useAuth();
  if (loading) return <FullscreenSpinner />;
  if (currentRole !== role) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export function FullscreenSpinner() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="spinner" />
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    online: "badge-online", offline: "badge-offline", unassigned: "badge-unassigned",
    success: "badge-success", failed: "badge-failed", manual: "badge-manual", skipped: "badge-skipped",
  };
  const cls = map[status] || "badge-unassigned";
  return (
    <span className={`badge ${cls}`}>
      <span className="badge-dot" />
      {status}
    </span>
  );
}

export function Modal({ title, onClose, children, wide }: { title: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(20,33,61,0.4)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, zIndex: 50 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="card card-pad"
        style={{ width: "100%", maxWidth: wide ? 640 : 460, maxHeight: "88vh", overflowY: "auto" }}
      >
        <div className="flex-between mb-24">
          <h3 style={{ fontSize: 19 }}>{title}</h3>
          <button className="btn btn-ghost btn-sm" onClick={onClose} aria-label="Close">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function EmptyState({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="empty-state">
      <h3>{title}</h3>
      <p>{hint}</p>
    </div>
  );
}

export function formatDateTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return iso;
  }
}
