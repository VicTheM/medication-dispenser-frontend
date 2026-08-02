export type Role = "caregiver" | "patient";

export interface Caregiver {
  id: string; full_name: string; email: string; phone?: string | null; created_at: string;
}

export interface Patient {
  id: string; caregiver_id: string; full_name: string; date_of_birth?: string | null;
  phone?: string | null; email?: string | null; notes?: string | null; timezone: string; created_at: string;
}

export interface DeviceStatus {
  id: string; device_uid: string; patient_id?: string | null; status: "unassigned" | "online" | "offline";
  last_seen_at?: string | null; firmware_version?: string | null; wifi_ssid?: string | null;
  battery_level?: number | null; uptime_seconds?: number | null;
}

export interface DeviceFull extends DeviceStatus {
  device_secret: string;
}

export interface Medication {
  id: string; patient_id: string; name: string; dosage?: string | null; form?: string | null;
  instructions?: string | null; prescribing_doctor?: string | null; active: boolean; created_at: string;
}

export type Frequency = "daily" | "specific_days" | "as_needed";
export type Compartment = "A" | "B" | "C" | "D" | "E" | "F" | "G";

export interface Schedule {
  id: string; patient_id: string; compartment: Compartment; dispense_time: string; frequency: Frequency;
  days_of_week?: string[] | null; start_date?: string | null; end_date?: string | null; active: boolean;
  medication_ids: string[]; medication_names: string[]; updated_at: string;
}

export interface DispenseEvent {
  id: string; device_id: string; patient_id: string; schedule_id?: string | null; compartment: Compartment;
  status: "success" | "failed" | "skipped" | "manual"; scheduled_time?: string | null; dispensed_at: string;
  received_at: string; was_offline_cached: boolean; has_video: boolean;
}

export interface AdherenceVideo {
  id: string; dispense_event_id: string; file_path: string; duration_seconds: number;
  person_detected?: boolean | null; uploaded_at: string;
}

export interface Telemetry {
  id: string; device_id: string; reported_at: string; current_compartment?: string | null;
  motor_status?: string | null; sensor_status?: string | null; person_detected?: boolean | null;
  tray_state?: string | null; battery_level?: number | null; wifi_rssi?: number | null; uptime_seconds?: number | null;
}

export interface VoiceInteraction {
  id: string; patient_id: string; device_id?: string | null; transcript?: string | null;
  answer_text?: string | null; citations?: unknown[] | null; audio_format?: string | null; created_at: string;
}

export interface KnowledgeDocument {
  id: string; filename: string; ingest_status: string; uploaded_at: string;
}

export interface Notification {
  id: string; patient_id: string; type: string; message: string; read: boolean; created_at: string;
}

export interface AskResult {
  question: string; answer: string; citations?: unknown[]; tool_results?: unknown[];
}
