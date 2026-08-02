import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "../../components/AppShell";
import { Modal, StatusBadge, EmptyState } from "../../components/Shared";
import { api, ApiError } from "../../api/client";
import { Patient, DeviceStatus } from "../../api/types";
import { useToast } from "../../context/ToastContext";

const NAV = [
  { to: "/app", label: "Patients", icon: "◈", end: true },
  { to: "/app/knowledge", label: "Knowledge base", icon: "▤" },
];

export default function Dashboard() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [devices, setDevices] = useState<Record<string, DeviceStatus>>({});
  const [loading, setLoading] = useState(true);
  const [showEnrol, setShowEnrol] = useState(false);
  const { show } = useToast();

  async function load() {
    setLoading(true);
    try {
      const list = await api.get<Patient[]>("/caregivers/patients");
      setPatients(list);
      const entries = await Promise.all(list.map(async (p) => {
        try {
          const d = await api.get<DeviceStatus>(`/caregivers/patients/${p.id}/device`);
          return [p.id, d] as const;
        } catch {
          return [p.id, null] as const;
        }
      }));
      setDevices(Object.fromEntries(entries.filter(([, d]) => d) as [string, DeviceStatus][]));
    } catch (err) {
      show(err instanceof ApiError ? err.message : "Couldn't load patients", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <AppShell navItems={NAV} roleLabel="Caregiver">
      <div className="topbar">
        <h2 style={{ fontSize: 22 }}>Your patients</h2>
        <button className="btn btn-primary" onClick={() => setShowEnrol(true)}>+ Enrol patient</button>
      </div>
      <div className="content" style={{ maxWidth: 1080 }}>
        {loading ? (
          <div className="flex" style={{ justifyContent: "center", padding: 60 }}><span className="spinner" /></div>
        ) : patients.length === 0 ? (
          <div className="card">
            <EmptyState title="No patients yet" hint="Enrol your first patient to assign a device and build their medication schedule." />
          </div>
        ) : (
          <div className="grid-2">
            {patients.map((p) => (
              <Link key={p.id} to={`/app/patients/${p.id}`} className="card card-pad" style={{ textDecoration: "none", color: "inherit" }}>
                <div className="flex-between mb-8">
                  <h3 style={{ fontSize: 18 }}>{p.full_name}</h3>
                  <StatusBadge status={devices[p.id]?.status || "unassigned"} />
                </div>
                <p className="text-sm">{p.email || "No login set up"}</p>
                <p className="text-sm mt-8">
                  {devices[p.id] ? <>Device <span className="mono">{devices[p.id].device_uid}</span></> : "No device assigned"}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>

      {showEnrol && <EnrolModal onClose={() => setShowEnrol(false)} onDone={() => { setShowEnrol(false); load(); }} />}
    </AppShell>
  );
}

function EnrolModal({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDob] = useState("");
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { show } = useToast();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/caregivers/patients", {
        full_name: fullName,
        email: email || undefined,
        password: password || undefined,
        date_of_birth: dob || undefined,
        timezone,
      });
      show("Patient enrolled");
      onDone();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't enrol patient");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal title="Enrol a patient" onClose={onClose}>
      {error && <div className="form-error">{error}</div>}
      <form onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="full_name">Full name</label>
          <input id="full_name" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>
        <div className="form-row">
          <div className="field">
            <label htmlFor="dob">Date of birth</label>
            <input id="dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="tz">Timezone</label>
            <input id="tz" value={timezone} onChange={(e) => setTimezone(e.target.value)} />
          </div>
        </div>
        <div className="field">
          <label htmlFor="p_email">Patient login email <span className="hint">(optional)</span></label>
          <input id="p_email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <span className="hint">Set this and a password so the patient can view their own dashboard.</span>
        </div>
        {email && (
          <div className="field">
            <label htmlFor="p_password">Patient login password</label>
            <input id="p_password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} />
          </div>
        )}
        <button className="btn btn-primary btn-block" disabled={loading} type="submit">
          {loading ? <span className="spinner" /> : "Enrol patient"}
        </button>
      </form>
    </Modal>
  );
}
