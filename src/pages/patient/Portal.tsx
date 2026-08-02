import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AppShell from "../../components/AppShell";
import CompartmentStrip from "../../components/CompartmentStrip";
import AskAI from "../../components/AskAI";
import { StatusBadge, EmptyState, formatDateTime } from "../../components/Shared";
import { api, ApiError } from "../../api/client";
import { Medication, Schedule, DeviceStatus, DispenseEvent, VoiceInteraction, Notification } from "../../api/types";
import { useToast } from "../../context/ToastContext";

const NAV = [
  { to: "/portal", label: "Today", icon: "◈", end: true },
  { to: "/portal/history", label: "History", icon: "▤" },
  { to: "/portal/notifications", label: "Notifications", icon: "◔" },
];

type Tab = "today" | "history" | "notifications";

export default function Portal() {
  const location = useLocation();
  const tabFromPath = (): Tab => {
    if (location.pathname.endsWith("/history")) return "history";
    if (location.pathname.endsWith("/notifications")) return "notifications";
    return "today";
  };
  const [tab, setTab] = useState<Tab>(tabFromPath());
  useEffect(() => { setTab(tabFromPath()); }, [location.pathname]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [device, setDevice] = useState<DeviceStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const { show } = useToast();

  useEffect(() => {
    (async () => {
      try {
        const [meds, scheds] = await Promise.all([
          api.get<Medication[]>("/patients/me/medications"),
          api.get<Schedule[]>("/patients/me/schedules"),
        ]);
        setMedications(meds);
        setSchedules(scheds);
        try { setDevice(await api.get<DeviceStatus>("/patients/me/device")); } catch { setDevice(null); }
      } catch (err) {
        show(err instanceof ApiError ? err.message : "Couldn't load your data", "error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <AppShell navItems={NAV} roleLabel="Patient">
      <div className="topbar">
        <h2 style={{ fontSize: 22 }}>Your medication</h2>
        <StatusBadge status={device?.status || "unassigned"} />
      </div>
      <div className="content" style={{ maxWidth: 900 }}>
        <div className="tabs">
          <button className={`tab ${tab === "today" ? "active" : ""}`} onClick={() => setTab("today")}>Today</button>
          <button className={`tab ${tab === "history" ? "active" : ""}`} onClick={() => setTab("history")}>History</button>
          <button className={`tab ${tab === "notifications" ? "active" : ""}`} onClick={() => setTab("notifications")}>Notifications</button>
        </div>

        {loading ? (
          <div className="flex" style={{ justifyContent: "center", padding: 60 }}><span className="spinner" /></div>
        ) : (
          <>
            {tab === "today" && <TodayTab schedules={schedules} medications={medications} device={device} />}
            {tab === "history" && <HistoryTab />}
            {tab === "notifications" && <NotificationsTab />}
          </>
        )}
      </div>
    </AppShell>
  );
}

function TodayTab({ schedules, medications, device }: { schedules: Schedule[]; medications: Medication[]; device: DeviceStatus | null }) {
  return (
    <div className="flex-col gap-24">
      <div className="card card-pad">
        <h3 style={{ fontSize: 17 }} className="mb-16">Today's compartments</h3>
        <CompartmentStrip schedules={schedules} highlightNow />
        <p className="text-sm mt-16">
          {device ? `Device ${device.device_uid} is ${device.status}.` : "No device assigned yet — talk to your caregiver."}
        </p>
      </div>
      <div className="card card-pad">
        <h3 style={{ fontSize: 15 }} className="mb-16">Your medications</h3>
        {medications.length === 0 ? <EmptyState title="Nothing on file yet" hint="Your caregiver will add these." /> : (
          <table>
            <thead><tr><th>Name</th><th>Dosage</th><th>Instructions</th></tr></thead>
            <tbody>
              {medications.map((m) => (
                <tr key={m.id}><td>{m.name}</td><td>{m.dosage || "—"}</td><td className="text-sm">{m.instructions || "—"}</td></tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <AskAI />
    </div>
  );
}

function HistoryTab() {
  const [logs, setLogs] = useState<DispenseEvent[] | null>(null);
  const [voice, setVoice] = useState<VoiceInteraction[] | null>(null);
  const { show } = useToast();

  useEffect(() => {
    api.get<DispenseEvent[]>("/patients/me/dispense-logs").then(setLogs).catch((err) => show(err instanceof ApiError ? err.message : "Couldn't load history", "error"));
    api.get<VoiceInteraction[]>("/patients/me/voice-interactions").then(setVoice).catch(() => {});
  }, []);

  return (
    <div className="flex-col gap-24">
      <div className="card">
        <div style={{ padding: "16px 16px 0" }}><h3 style={{ fontSize: 15 }}>Dispense history</h3></div>
        {!logs ? <div className="flex" style={{ justifyContent: "center", padding: 40 }}><span className="spinner" /></div> : logs.length === 0 ? (
          <EmptyState title="Nothing yet" hint="Your dispense history will show up here." />
        ) : (
          <table>
            <thead><tr><th>Compartment</th><th>Status</th><th>Dispensed at</th></tr></thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l.id}><td className="mono">{l.compartment}</td><td><StatusBadge status={l.status} /></td><td className="text-sm">{formatDateTime(l.dispensed_at)}</td></tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="card">
        <div style={{ padding: "16px 16px 0" }}><h3 style={{ fontSize: 15 }}>Questions you've asked</h3></div>
        {!voice || voice.length === 0 ? (
          <EmptyState title="No questions yet" hint="Ask your device a question out loud, anytime." />
        ) : (
          <div className="flex-col">
            {voice.map((v) => (
              <div key={v.id} style={{ padding: 18, borderBottom: "1px solid var(--mist)" }}>
                <p style={{ fontWeight: 600, color: "var(--ink)" }}>{v.transcript}</p>
                <p className="text-sm mt-8">{v.answer_text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function NotificationsTab() {
  const [rows, setRows] = useState<Notification[] | null>(null);
  const { show } = useToast();

  useEffect(() => {
    api.get<Notification[]>("/patients/me/notifications").then(setRows).catch((err) => show(err instanceof ApiError ? err.message : "Couldn't load notifications", "error"));
  }, []);

  if (!rows) return <div className="flex" style={{ justifyContent: "center", padding: 40 }}><span className="spinner" /></div>;

  return (
    <div className="card">
      {rows.length === 0 ? <EmptyState title="All quiet" hint="Updates from your care team will appear here." /> : (
        <div className="flex-col">
          {rows.map((n) => (
            <div key={n.id} style={{ padding: 16, borderBottom: "1px solid var(--mist)" }}>
              <p>{n.message}</p>
              <p className="text-sm mt-8" style={{ color: "var(--slate-light)" }}>{formatDateTime(n.created_at)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
