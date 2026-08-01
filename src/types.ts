/**
 * MedAdhere & MedLab Types
 * Aligned with OpenAPI 3.1.0 backend schemas and UI features
 */

export type UserRole = 'caregiver' | 'patient';

export interface AuthToken {
  access_token: string;
  token_type: string;
  role: UserRole;
}

export interface CaregiverUser {
  id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  created_at: string;
}

export interface PatientUser {
  id: string;
  caregiver_id: string;
  full_name: string;
  date_of_birth?: string | null;
  phone?: string | null;
  email?: string | null;
  notes?: string | null;
  timezone: string;
  created_at: string;
}

export interface DeviceStatus {
  id: string;
  device_uid: string;
  patient_id?: string | null;
  status: 'online' | 'offline' | 'unassigned' | string;
  last_seen_at?: string | null;
  firmware_version?: string | null;
  wifi_ssid?: string | null;
  battery_level?: number | null;
  uptime_seconds?: number | null;
}

export interface DeviceFull extends DeviceStatus {
  device_secret?: string;
}

export interface MedicationRecord {
  id: string;
  patient_id: string;
  name: string;
  dosage?: string | null;
  form?: string | null; // e.g. "Tablet", "Capsule", "Liquid", "Inhaler"
  instructions?: string | null;
  prescribing_doctor?: string | null;
  active: boolean;
  created_at: string;
}

export interface ScheduleRecord {
  id: string;
  patient_id: string;
  compartment: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | string;
  dispense_time: string; // "HH:MM" 24h
  frequency: 'daily' | 'specific_days' | 'as_needed' | string;
  days_of_week?: string[] | null; // e.g. ["mon", "wed", "fri"]
  start_date?: string | null;
  end_date?: string | null;
  active: boolean;
  medication_ids: string[];
  medication_names: string[];
  updated_at: string;
}

export interface DispenseEventRecord {
  id: string;
  device_id: string;
  patient_id: string;
  schedule_id?: string | null;
  compartment: string;
  status: 'success' | 'failed' | 'skipped' | 'manual' | string;
  scheduled_time?: string | null;
  dispensed_at: string;
  received_at: string;
  was_offline_cached: boolean;
  has_video: boolean;
}

export interface AdherenceVideoRecord {
  id: string;
  dispense_event_id: string;
  file_path: string;
  duration_seconds: number;
  person_detected?: boolean | null;
  uploaded_at: string;
}

export interface TelemetryRecord {
  id: string;
  device_id: string;
  reported_at: string;
  current_compartment?: string | null;
  motor_status?: string | null;
  sensor_status?: string | null;
  person_detected?: boolean | null;
  tray_state?: string | null;
  battery_level?: number | null;
  wifi_rssi?: number | null;
  uptime_seconds?: number | null;
}

export interface VoiceInteractionRecord {
  id: string;
  patient_id: string;
  device_id?: string | null;
  transcript?: string | null;
  answer_text?: string | null;
  citations?: any[] | null;
  tool_results?: any[] | null;
  audio_format?: string | null;
  created_at: string;
}

export interface NotificationRecord {
  id: string;
  patient_id: string;
  type: string;
  message: string;
  read: boolean;
  created_at: string;
}

export interface KnowledgeDocRecord {
  id: string;
  filename: string;
  ingest_status: 'ingested' | 'failed' | 'processing' | string;
  uploaded_at: string;
}

// UI State & Local Interfaces
export interface OnboardingState {
  step: 1 | 2 | 3;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  isCompleted: boolean;
}

export interface Vitals {
  bloodPressure: string;
  heartRate: number;
  temperature?: number;
  spO2?: number;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  text: string;
  type?: 'dispense' | 'alert' | 'system' | 'sync';
}

export interface ClinicalSettings {
  email: string;
  apiBaseUrl: string;
  alerts: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    smsAlerts: boolean;
  };
  hardwareId: string;
  firmware: string;
  lastCalibration: string;
}

export interface AllyChatMessage {
  id: string;
  sender: 'user' | 'ally';
  text: string;
  audioBase64?: string;
  citations?: any[];
  timestamp: string;
}
