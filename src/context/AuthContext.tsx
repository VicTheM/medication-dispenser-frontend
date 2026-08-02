import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { api, setSession, clearSession, getToken, getRole } from "../api/client";
import { Caregiver, Patient, Role } from "../api/types";

interface AuthState {
  role: Role | null;
  identity: Caregiver | Patient | null;
  loading: boolean;
  loginCaregiver: (email: string, password: string) => Promise<void>;
  registerCaregiver: (fullName: string, email: string, password: string, phone?: string) => Promise<void>;
  loginPatient: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role | null>(getRole());
  const [identity, setIdentity] = useState<Caregiver | Patient | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const r = getRole();
    if (!getToken() || !r) {
      setRole(null);
      setIdentity(null);
      setLoading(false);
      return;
    }
    try {
      const me = r === "caregiver"
        ? await api.get<Caregiver>("/caregivers/me")
        : await api.get<Patient>("/patients/me");
      setRole(r);
      setIdentity(me);
    } catch {
      clearSession();
      setRole(null);
      setIdentity(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const loginCaregiver = useCallback(async (email: string, password: string) => {
    const res = await api.post<{ access_token: string; role: string }>("/auth/caregiver/login", { email, password });
    setSession(res.access_token, res.role);
    await refresh();
  }, [refresh]);

  const registerCaregiver = useCallback(async (full_name: string, email: string, password: string, phone?: string) => {
    await api.post("/auth/caregiver/register", { full_name, email, password, phone: phone || undefined });
    await loginCaregiver(email, password);
  }, [loginCaregiver]);

  const loginPatient = useCallback(async (email: string, password: string) => {
    const res = await api.post<{ access_token: string; role: string }>("/auth/patient/login", { email, password });
    setSession(res.access_token, res.role);
    await refresh();
  }, [refresh]);

  const logout = useCallback(() => {
    clearSession();
    setRole(null);
    setIdentity(null);
  }, []);

  return (
    <AuthContext.Provider value={{ role, identity, loading, loginCaregiver, registerCaregiver, loginPatient, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
