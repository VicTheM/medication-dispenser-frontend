import { useEffect, useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import AppShell from "../../components/AppShell";
import CompartmentStrip from "../../components/CompartmentStrip";
import AskAI from "../../components/AskAI";
import { Modal, StatusBadge, EmptyState, formatDateTime } from "../../components/Shared";
import { api, ApiError } from "../../api/client";
import {
  Patient, Medication, Schedule, DeviceStatus, DeviceFull, DispenseEvent,
  AdherenceVideo, Telemetry, VoiceInteraction, Notification, Compartment, Frequency,
} from "../../api/types";
import { useToast } from "../../context/ToastContext";

const NAV = [
  { to: "/app", label: "Patients", icon: "◈", end: true },
  { to: "/app/knowledge", label: "Knowledge base", icon: "▤" },
];

type Tab = "overview" | "medications" | "schedule" | "device" | "logs" | "videos" | "telemetry" | "voice" | "notifications";

export default function PatientDetail() {
  const { patientId = "" } = useParams();
  const [tab, setTab] = useState<Tab>("overview");
  const [patient, setPatient] = useState<Patient | null>(null);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [device, setDevice] = useState<DeviceStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const { show } = useToast();

  const loadCore = useCallback(async () => {
    try {
      const [p, meds, scheds] = await Promise.all([
        api.get<Patient>(`/caregivers/patients/${patientId}`),
        api.get<Medication[]>(`/caregivers/patients/${patientId}/medications`),
        api.get<Schedule[]>(`/caregivers/patients/${patientId}/schedules`),
      ]);
      setPatient(p);
      setMedications(meds);
      setSchedules(scheds);
      try {
        setDevice(await api.get<DeviceStatus>(`/caregivers/patients/${patientId}/device`));
      } catch {
        setDevice(null);
      }
    } catch (err) {
      show(err instanceof ApiError ? err.message : "Couldn't load patient", "error");
    } finally {
      setLoading(false);
    }
  }, [patientId, show]);

  useEffect(() => { loadCore(); }, [loadCore]);

  if (loading || !patient) {
    return (
      <AppShell navItems={NAV} roleLabel="Caregiver">
        <div className="flex" style={{ justifyContent: "center", padding: 80 }}><span className="spinner" /></div>
      </AppShell>
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "medications", label: "Medications" },
    { id: "schedule", label: "Schedule" },
    { id: "device", label: "Device" },
    { id: "logs", label: "Dispense logs" },
    { id: "videos", label: "Adherence videos" },
    { id: "telemetry", label: "Telemetry" },
    { id: "voice", label: "Voice history" },
    { id: "notifications", label: "Notifications" },
  ];

  return (
    <AppShell navItems={NAV} roleLabel="Caregiver">
      <div className="topbar">
        <div>
          <Link to="/app" className="text-sm" style={{ textDecoration: "none", color: "var(--horizon)" }}>← All patients</Link>
          <h2 style={{ fontSize: 22, marginTop: 4 }}>{patient.full_name}</h2>
        </div>
        <StatusBadge status={device?.status || "unassigned"} />
      </div>
      <div className="content" style={{ maxWidth: 1080 }}>
        <div className="tabs">
          {tabs.map((t) => (
            <button key={t.id} className={`tab ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>{t.label}</button>
          ))}
        </div>

        {tab === "overview" && <OverviewTab patient={patient} schedules={schedules} device={device} />}
        {tab === "medications" && <MedicationsTab patientId={patientId} medications={medications} onChange={loadCore} />}
        {tab === "schedule" && <ScheduleTab patientId={patientId} medications={medications} schedules={schedules} onChange={loadCore} />}
        {tab === "device" && <DeviceTab patientId={patientId} device={device} onChange={loadCore} />}
        {tab === "logs" && <LogsTab patientId={patientId} />}
        {tab === "videos" && <VideosTab patientId={patientId} />}
        {tab === "telemetry" && <TelemetryTab patientId={patientId} />}
        {tab === "voice" && <VoiceTab patientId={patientId} />}
        {tab === "notifications" && <NotificationsTab patientId={patientId} />}
      </div>
    </AppShell>
  );
}

// ---------------------------------------------------------------------------
// Overview
// ---------------------------------------------------------------------------
function OverviewTab({ patient, schedules, device }: { patient: Patient; schedules: Schedule[]; device: DeviceStatus | null }) {
  return (
    <div className="flex-col gap-24">
      <div className="card card-pad">
        <h3 style={{ fontSize: 17 }} className="mb-16">Today's compartments</h3>
        <CompartmentStrip schedules={schedules} highlightNow />
      </div>
      <div className="grid-2">
        <div className="card card-pad">
          <h3 style={{ fontSize: 15 }} className="mb-8">Device</h3>
          {device ? (
            <>
              <p className="mono text-sm">{device.device_uid}</p>
              <p className="text-sm mt-8">Battery: {device.battery_level != null ? `${device.battery_level.toFixed(0)}%` : "—"}</p>
              <p className="text-sm">Last seen: {device.last_seen_at ? formatDateTime(device.last_seen_at) : "never"}</p>
            </>
          ) : <p className="text-sm">No device assigned yet.</p>}
        </div>
        <div className="card card-pad">
          <h3 style={{ fontSize: 15 }} className="mb-8">Patient</h3>
          <p className="text-sm">{patient.email || "No login set up"}</p>
          <p className="text-sm mt-8">Timezone: {patient.timezone}</p>
        </div>
      </div>
      <AskAI />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Medications
// ---------------------------------------------------------------------------
function MedicationsTab({ patientId, medications, onChange }: { patientId: string; medications: Medication[]; onChange: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const { show } = useToast();

  async function remove(id: string) {
    if (!confirm("Remove this medication? Any schedule using it will need to be updated.")) return;
    try {
      await api.del(`/caregivers/medications/${id}`);
      show("Medication removed");
      onChange();
    } catch (err) {
      show(err instanceof ApiError ? err.message : "Couldn't remove medication", "error");
    }
  }

  return (
    <div>
      <div className="flex-between mb-16">
        <p>Medications on file for this patient.</p>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>+ Add medication</button>
      </div>
      <div className="card">
        {medications.length === 0 ? (
          <EmptyState title="No medications yet" hint="Add a medication before building a schedule." />
        ) : (
          <table>
            <thead><tr><th>Name</th><th>Dosage</th><th>Instructions</th><th>Status</th><th /></tr></thead>
            <tbody>
              {medications.map((m) => (
                <tr key={m.id}>
                  <td>{m.name}</td>
                  <td>{m.dosage || "—"}</td>
                  <td className="text-sm">{m.instructions || "—"}</td>
                  <td><span className={`badge ${m.active ? "badge-success" : "badge-unassigned"}`}>{m.active ? "active" : "inactive"}</span></td>
                  <td><button className="btn btn-danger btn-sm" onClick={() => remove(m.id)}>Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {showForm && <MedicationForm patientId={patientId} onClose={() => setShowForm(false)} onDone={() => { setShowForm(false); onChange(); }} />}
    </div>
  );
}

function MedicationForm({ patientId, onClose, onDone }: { patientId: string; onClose: () => void; onDone: () => void }) {
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [form, setForm] = useState("");
  const [instructions, setInstructions] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post(`/caregivers/patients/${patientId}/medications`, { name, dosage: dosage || undefined, form: form || undefined, instructions: instructions || undefined });
      onDone();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't add medication");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal title="Add medication" onClose={onClose}>
      {error && <div className="form-error">{error}</div>}
      <form onSubmit={onSubmit}>
        <div className="field"><label htmlFor="name">Name</label><input id="name" required value={name} onChange={(e) => setName(e.target.value)} /></div>
        <div className="form-row">
          <div className="field"><label htmlFor="dosage">Dosage</label><input id="dosage" placeholder="500mg" value={dosage} onChange={(e) => setDosage(e.target.value)} /></div>
          <div className="field"><label htmlFor="form">Form</label><input id="form" placeholder="tablet" value={form} onChange={(e) => setForm(e.target.value)} /></div>
        </div>
        <div className="field"><label htmlFor="instr">Instructions</label><textarea id="instr" placeholder="Take with food" value={instructions} onChange={(e) => setInstructions(e.target.value)} /></div>
        <button className="btn btn-primary btn-block" disabled={loading} type="submit">{loading ? <span className="spinner" /> : "Add medication"}</button>
      </form>
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// Schedule (compartment assignment) — signature CompartmentStrip is interactive here
// ---------------------------------------------------------------------------
function ScheduleTab({ patientId, medications, schedules, onChange }: {
  patientId: string; medications: Medication[]; schedules: Schedule[]; onChange: () => void;
}) {
  const [editing, setEditing] = useState<Compartment | null>(null);
  const { show } = useToast();

  async function remove(id: string) {
    if (!confirm("Delete this schedule entry?")) return;
    try {
      await api.del(`/caregivers/schedules/${id}`);
      show("Schedule removed — device will resync");
      onChange();
    } catch (err) {
      show(err instanceof ApiError ? err.message : "Couldn't remove schedule", "error");
    }
  }

  return (
    <div>
      <p className="mb-24">Tap a compartment to assign or edit its medications and dispense time. Changes push to the device immediately.</p>
      <div className="card card-pad mb-24">
        <CompartmentStrip schedules={schedules} onSelect={(letter) => setEditing(letter)} />
      </div>
      <div className="card">
        {schedules.length === 0 ? (
          <EmptyState title="No compartments assigned" hint="Tap a letter above to build the first schedule entry." />
        ) : (
          <table>
            <thead><tr><th>Compartment</th><th>Medications</th><th>Time</th><th>Frequency</th><th /></tr></thead>
            <tbody>
              {schedules.map((s) => (
                <tr key={s.id}>
                  <td className="mono">{s.compartment}</td>
                  <td>{s.medication_names.join(", ")}</td>
                  <td className="mono">{s.dispense_time}</td>
                  <td>{s.frequency === "specific_days" ? (s.days_of_week || []).join(", ") : s.frequency.replace("_", " ")}</td>
                  <td className="flex gap-8">
                    <button className="btn btn-ghost btn-sm" onClick={() => setEditing(s.compartment)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => remove(s.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {editing && (
        <ScheduleForm
          patientId={patientId}
          letter={editing}
          medications={medications}
          existing={schedules.find((s) => s.compartment === editing) || null}
          onClose={() => setEditing(null)}
          onDone={() => { setEditing(null); onChange(); }}
        />
      )}
    </div>
  );
}

function ScheduleForm({ patientId, letter, medications, existing, onClose, onDone }: {
  patientId: string; letter: Compartment; medications: Medication[]; existing: Schedule | null;
  onClose: () => void; onDone: () => void;
}) {
  const [medIds, setMedIds] = useState<string[]>(existing?.medication_ids || []);
  const [time, setTime] = useState(existing?.dispense_time || "08:00");
  const [frequency, setFrequency] = useState<Frequency>(existing?.frequency || "daily");
  const [days, setDays] = useState<string[]>(existing?.days_of_week || []);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function toggleMed(id: string) {
    setMedIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));
  }
  function toggleDay(d: string) {
    setDays((ds) => (ds.includes(d) ? ds.filter((x) => x !== d) : [...ds, d]));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (medIds.length === 0) { setError("Select at least one medication."); return; }
    if (frequency === "specific_days" && days.length === 0) { setError("Select at least one day."); return; }
    setLoading(true);
    setError("");
    const payload = { compartment: letter, medication_ids: medIds, dispense_time: time, frequency, days_of_week: frequency === "specific_days" ? days : undefined };
    try {
      if (existing) {
        await api.patch(`/caregivers/schedules/${existing.id}`, payload);
      } else {
        await api.post(`/caregivers/patients/${patientId}/schedules`, payload);
      }
      onDone();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't save schedule");
    } finally {
      setLoading(false);
    }
  }

  const DAY_OPTIONS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

  return (
    <Modal title={`Compartment ${letter}`} onClose={onClose}>
      {error && <div className="form-error">{error}</div>}
      <form onSubmit={onSubmit}>
        <div className="field">
          <label>Medications in this compartment</label>
          {medications.length === 0 ? (
            <p className="text-sm">Add a medication first, from the Medications tab.</p>
          ) : (
            <div className="flex-col gap-8">
              {medications.filter((m) => m.active).map((m) => (
                <label key={m.id} className="flex gap-8" style={{ fontWeight: 400, alignItems: "center" }}>
                  <input type="checkbox" style={{ width: "auto" }} checked={medIds.includes(m.id)} onChange={() => toggleMed(m.id)} />
                  {m.name} {m.dosage ? `(${m.dosage})` : ""}
                </label>
              ))}
            </div>
          )}
        </div>
        <div className="form-row">
          <div className="field"><label htmlFor="time">Dispense time</label><input id="time" type="time" required value={time} onChange={(e) => setTime(e.target.value)} /></div>
          <div className="field">
            <label htmlFor="freq">Frequency</label>
            <select id="freq" value={frequency} onChange={(e) => setFrequency(e.target.value as Frequency)}>
              <option value="daily">Daily</option>
              <option value="specific_days">Specific days</option>
              <option value="as_needed">As needed (manual only)</option>
            </select>
          </div>
        </div>
        {frequency === "specific_days" && (
          <div className="field">
            <label>Days</label>
            <div className="flex gap-8" style={{ flexWrap: "wrap" }}>
              {DAY_OPTIONS.map((d) => (
                <button type="button" key={d} className={`btn btn-sm ${days.includes(d) ? "btn-primary" : "btn-ghost"}`} onClick={() => toggleDay(d)}>{d}</button>
              ))}
            </div>
          </div>
        )}
        <button className="btn btn-primary btn-block" disabled={loading} type="submit">{loading ? <span className="spinner" /> : existing ? "Save changes" : "Assign compartment"}</button>
      </form>
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// Device
// ---------------------------------------------------------------------------
function DeviceTab({ patientId, device, onChange }: { patientId: string; device: DeviceStatus | null; onChange: () => void }) {
  const [uid, setUid] = useState("");
  const [secret, setSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { show } = useToast();

  async function assign(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const d = await api.post<DeviceFull>(`/caregivers/patients/${patientId}/device`, { device_uid: uid });
      setSecret(d.device_secret);
      onChange();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't assign device");
    } finally {
      setLoading(false);
    }
  }

  async function sendCommand(command_type: string, payload?: Record<string, unknown>) {
    if (!device) return;
    try {
      const res = await api.post<{ delivered: boolean; note?: string }>(`/caregivers/devices/${device.device_uid}/commands`, { command_type, payload });
      show(res.delivered ? "Command sent" : (res.note || "Device is offline — command queued"));
    } catch (err) {
      show(err instanceof ApiError ? err.message : "Couldn't send command", "error");
    }
  }

  if (!device) {
    return (
      <div className="card card-pad" style={{ maxWidth: 480 }}>
        <h3 style={{ fontSize: 16 }} className="mb-16">Assign hardware</h3>
        {error && <div className="form-error">{error}</div>}
        {secret ? (
          <div>
            <p className="mb-8">Device assigned. Give this secret to whoever is provisioning the unit — it's shown only once:</p>
            <p className="mono card-pad" style={{ background: "var(--paper)", wordBreak: "break-all" }}>{secret}</p>
          </div>
        ) : (
          <form onSubmit={assign}>
            <div className="field">
              <label htmlFor="uid">Device serial / QR code</label>
              <input id="uid" required value={uid} onChange={(e) => setUid(e.target.value)} placeholder="DEV-2201" />
            </div>
            <button className="btn btn-primary btn-block" disabled={loading} type="submit">{loading ? <span className="spinner" /> : "Assign device"}</button>
          </form>
        )}
      </div>
    );
  }

  return (
    <div className="flex-col gap-24">
      <div className="card card-pad">
        <div className="grid-2">
          <div>
            <p className="text-sm">Device ID</p>
            <p className="mono">{device.device_uid}</p>
          </div>
          <div>
            <p className="text-sm">Status</p>
            <StatusBadge status={device.status} />
          </div>
          <div>
            <p className="text-sm">Battery</p>
            <p>{device.battery_level != null ? `${device.battery_level.toFixed(0)}%` : "—"}</p>
          </div>
          <div>
            <p className="text-sm">Last seen</p>
            <p>{device.last_seen_at ? formatDateTime(device.last_seen_at) : "never"}</p>
          </div>
        </div>
      </div>
      <div className="card card-pad">
        <h3 style={{ fontSize: 15 }} className="mb-16">Send a command</h3>
        <div className="flex gap-8" style={{ flexWrap: "wrap" }}>
          <ManualDispenseControl onDispense={(c) => sendCommand("manual_dispense", { compartment: c })} />
          <button className="btn btn-ghost btn-sm" onClick={() => sendCommand("sync")}>Sync offline data</button>
          <button className="btn btn-ghost btn-sm" onClick={() => sendCommand("update_schedule")}>Re-push schedule</button>
          <button className="btn btn-danger btn-sm" onClick={() => { if (confirm("Restart this device now?")) sendCommand("restart"); }}>Restart device</button>
        </div>
      </div>
    </div>
  );
}

function ManualDispenseControl({ onDispense }: { onDispense: (c: Compartment) => void }) {
  const [selected, setSelected] = useState<Compartment>("A");
  return (
    <div className="flex gap-8" style={{ alignItems: "center" }}>
      <select value={selected} onChange={(e) => setSelected(e.target.value as Compartment)} style={{ width: 90 }}>
        {(["A", "B", "C", "D", "E", "F", "G"] as Compartment[]).map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
      <button className="btn btn-accent btn-sm" onClick={() => onDispense(selected)}>Manual dispense</button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Dispense logs
// ---------------------------------------------------------------------------
function LogsTab({ patientId }: { patientId: string }) {
  const [logs, setLogs] = useState<DispenseEvent[] | null>(null);
  const { show } = useToast();

  useEffect(() => {
    api.get<DispenseEvent[]>(`/caregivers/patients/${patientId}/dispense-logs`)
      .then(setLogs)
      .catch((err) => show(err instanceof ApiError ? err.message : "Couldn't load logs", "error"));
  }, [patientId]);

  if (!logs) return <div className="flex" style={{ justifyContent: "center", padding: 40 }}><span className="spinner" /></div>;

  return (
    <div className="card">
      {logs.length === 0 ? <EmptyState title="No dispenses yet" hint="Events will appear here as soon as the device reports one." /> : (
        <table>
          <thead><tr><th>Compartment</th><th>Status</th><th>Scheduled</th><th>Dispensed at</th><th>Video</th></tr></thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l.id}>
                <td className="mono">{l.compartment}</td>
                <td><StatusBadge status={l.status} /></td>
                <td className="mono text-sm">{l.scheduled_time || "—"}</td>
                <td className="text-sm">{formatDateTime(l.dispensed_at)} {l.was_offline_cached && <span className="badge badge-unassigned" style={{ marginLeft: 6 }}>synced offline</span>}</td>
                <td>{l.has_video ? "✓" : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Adherence videos
// ---------------------------------------------------------------------------
function VideosTab({ patientId }: { patientId: string }) {
  const [videos, setVideos] = useState<AdherenceVideo[] | null>(null);
  const { show } = useToast();

  useEffect(() => {
    api.get<AdherenceVideo[]>(`/caregivers/patients/${patientId}/adherence-videos`)
      .then(setVideos)
      .catch((err) => show(err instanceof ApiError ? err.message : "Couldn't load videos", "error"));
  }, [patientId]);

  if (!videos) return <div className="flex" style={{ justifyContent: "center", padding: 40 }}><span className="spinner" /></div>;

  return (
    <div className="card">
      {videos.length === 0 ? <EmptyState title="No adherence videos yet" hint="A short clip appears here after each dispense." /> : (
        <table>
          <thead><tr><th>Uploaded</th><th>Duration</th><th>Person detected</th><th>File</th></tr></thead>
          <tbody>
            {videos.map((v) => (
              <tr key={v.id}>
                <td className="text-sm">{formatDateTime(v.uploaded_at)}</td>
                <td>{v.duration_seconds}s</td>
                <td>{v.person_detected == null ? "—" : v.person_detected ? "Yes" : "No"}</td>
                <td className="text-sm mono" style={{ wordBreak: "break-all" }}>{v.file_path}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <p className="text-sm" style={{ padding: 16 }}>Video files are served from wherever the backend's storage volume is mounted — wire a static/CDN route in front of it to preview or download them here.</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Telemetry
// ---------------------------------------------------------------------------
function TelemetryTab({ patientId }: { patientId: string }) {
  const [rows, setRows] = useState<Telemetry[] | null>(null);
  const { show } = useToast();

  useEffect(() => {
    api.get<Telemetry[]>(`/caregivers/patients/${patientId}/telemetry`)
      .then(setRows)
      .catch((err) => show(err instanceof ApiError ? err.message : "Couldn't load telemetry", "error"));
  }, [patientId]);

  if (!rows) return <div className="flex" style={{ justifyContent: "center", padding: 40 }}><span className="spinner" /></div>;

  return (
    <div className="card">
      {rows.length === 0 ? <EmptyState title="No telemetry yet" hint="Device status reports will appear here." /> : (
        <table>
          <thead><tr><th>Reported</th><th>Compartment</th><th>Tray</th><th>Battery</th><th>Wi-Fi</th><th>Person</th></tr></thead>
          <tbody>
            {rows.map((t) => (
              <tr key={t.id}>
                <td className="text-sm">{formatDateTime(t.reported_at)}</td>
                <td className="mono">{t.current_compartment || "—"}</td>
                <td>{t.tray_state || "—"}</td>
                <td>{t.battery_level != null ? `${t.battery_level.toFixed(0)}%` : "—"}</td>
                <td>{t.wifi_rssi != null ? `${t.wifi_rssi} dBm` : "—"}</td>
                <td>{t.person_detected == null ? "—" : t.person_detected ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Voice history
// ---------------------------------------------------------------------------
function VoiceTab({ patientId }: { patientId: string }) {
  const [rows, setRows] = useState<VoiceInteraction[] | null>(null);
  const { show } = useToast();

  useEffect(() => {
    api.get<VoiceInteraction[]>(`/caregivers/patients/${patientId}/voice-interactions`)
      .then(setRows)
      .catch((err) => show(err instanceof ApiError ? err.message : "Couldn't load voice history", "error"));
  }, [patientId]);

  if (!rows) return <div className="flex" style={{ justifyContent: "center", padding: 40 }}><span className="spinner" /></div>;

  return (
    <div className="card">
      {rows.length === 0 ? <EmptyState title="No voice questions yet" hint="Questions asked to the device will show up here with the assistant's answer." /> : (
        <div className="flex-col">
          {rows.map((r) => (
            <div key={r.id} style={{ padding: 18, borderBottom: "1px solid var(--mist)" }}>
              <p style={{ fontWeight: 600, color: "var(--ink)" }}>{r.transcript || "(no transcript)"}</p>
              <p className="text-sm mt-8">{r.answer_text}</p>
              <p className="text-sm mt-8" style={{ color: "var(--slate-light)" }}>{formatDateTime(r.created_at)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------
function NotificationsTab({ patientId }: { patientId: string }) {
  const [rows, setRows] = useState<Notification[] | null>(null);
  const { show } = useToast();

  useEffect(() => {
    api.get<Notification[]>(`/caregivers/patients/${patientId}/notifications`)
      .then(setRows)
      .catch((err) => show(err instanceof ApiError ? err.message : "Couldn't load notifications", "error"));
  }, [patientId]);

  if (!rows) return <div className="flex" style={{ justifyContent: "center", padding: 40 }}><span className="spinner" /></div>;

  return (
    <div className="card">
      {rows.length === 0 ? <EmptyState title="All quiet" hint="Missed doses, offline devices, and low battery alerts will appear here." /> : (
        <div className="flex-col">
          {rows.map((n) => (
            <div key={n.id} className="flex-between" style={{ padding: 16, borderBottom: "1px solid var(--mist)", background: n.read ? "transparent" : "var(--horizon-tint)" }}>
              <div>
                <span className={`badge ${n.type === "missed_dose" || n.type === "device_offline" ? "badge-failed" : n.type === "low_battery" ? "badge-manual" : "badge-unassigned"}`}>{n.type.replace("_", " ")}</span>
                <p className="mt-8">{n.message}</p>
              </div>
              <p className="text-sm" style={{ color: "var(--slate-light)", whiteSpace: "nowrap" }}>{formatDateTime(n.created_at)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
