import {
  PatientUser,
  DeviceStatus,
  MedicationRecord,
  ScheduleRecord,
  DispenseEventRecord,
  AdherenceVideoRecord,
  TelemetryRecord,
  VoiceInteractionRecord,
  NotificationRecord,
  KnowledgeDocRecord,
  ClinicalSettings,
  Vitals,
  ActivityLog
} from './types';

export const MOCK_PATIENTS: PatientUser[] = [
  {
    id: 'pat-101',
    caregiver_id: 'cg-001',
    full_name: 'Eleanor Vance',
    date_of_birth: '1952-04-14',
    phone: '+1 (555) 234-5678',
    email: 'eleanor.vance@example.com',
    notes: 'Hypertension and Type 2 Diabetes management. Prefers morning reminders.',
    timezone: 'America/New_York',
    created_at: '2026-01-15T09:00:00Z'
  },
  {
    id: 'pat-102',
    caregiver_id: 'cg-001',
    full_name: 'Arthur Pendelton',
    date_of_birth: '1948-11-22',
    phone: '+1 (555) 876-5432',
    email: 'arthur.p@example.com',
    notes: 'Post-cardiac rehab schedule. Compartment A and C active.',
    timezone: 'America/Chicago',
    created_at: '2026-02-10T11:30:00Z'
  }
];

export const MOCK_DEVICE: DeviceStatus = {
  id: 'dev-9901',
  device_uid: 'DISPENSER-M42-7C',
  patient_id: 'pat-101',
  status: 'online',
  last_seen_at: new Date().toISOString(),
  firmware_version: 'v3.1.2-esp32',
  wifi_ssid: 'MedLab_Clinical_5G',
  battery_level: 88,
  uptime_seconds: 432000
};

export const MOCK_MEDICATIONS: MedicationRecord[] = [
  {
    id: 'med-1',
    patient_id: 'pat-101',
    name: 'Lisinopril',
    dosage: '10mg',
    form: 'Tablet',
    instructions: 'Take 1 tablet by mouth daily in the morning for hypertension.',
    prescribing_doctor: 'Dr. Sarah Jenkins, MD',
    active: true,
    created_at: '2026-01-16T08:00:00Z'
  },
  {
    id: 'med-2',
    patient_id: 'pat-101',
    name: 'Metformin HCl',
    dosage: '500mg',
    form: 'Tablet',
    instructions: 'Take 1 tablet twice daily with meals for glucose regulation.',
    prescribing_doctor: 'Dr. Robert Vance, MD',
    active: true,
    created_at: '2026-01-16T08:15:00Z'
  },
  {
    id: 'med-3',
    patient_id: 'pat-101',
    name: 'Atorvastatin',
    dosage: '20mg',
    form: 'Capsule',
    instructions: 'Take 1 capsule before bedtime for cholesterol control.',
    prescribing_doctor: 'Dr. Sarah Jenkins, MD',
    active: true,
    created_at: '2026-01-20T10:00:00Z'
  },
  {
    id: 'med-4',
    patient_id: 'pat-101',
    name: 'Vitamin D3 & Calcium',
    dosage: '1000 IU',
    form: 'Tablet',
    instructions: 'Take 1 tablet daily at noon to support bone density.',
    prescribing_doctor: 'Dr. Sarah Jenkins, MD',
    active: true,
    created_at: '2026-02-01T09:00:00Z'
  }
];

export const MOCK_SCHEDULES: ScheduleRecord[] = [
  {
    id: 'sch-A',
    patient_id: 'pat-101',
    compartment: 'A',
    dispense_time: '08:00',
    frequency: 'daily',
    days_of_week: [],
    start_date: '2026-01-16',
    end_date: null,
    active: true,
    medication_ids: ['med-1'],
    medication_names: ['Lisinopril 10mg'],
    updated_at: '2026-06-01T08:00:00Z'
  },
  {
    id: 'sch-B',
    patient_id: 'pat-101',
    compartment: 'B',
    dispense_time: '08:00',
    frequency: 'daily',
    days_of_week: [],
    start_date: '2026-01-16',
    end_date: null,
    active: true,
    medication_ids: ['med-2'],
    medication_names: ['Metformin HCl 500mg'],
    updated_at: '2026-06-01T08:00:00Z'
  },
  {
    id: 'sch-C',
    patient_id: 'pat-101',
    compartment: 'C',
    dispense_time: '12:00',
    frequency: 'daily',
    days_of_week: [],
    start_date: '2026-02-01',
    end_date: null,
    active: true,
    medication_ids: ['med-4'],
    medication_names: ['Vitamin D3 & Calcium 1000 IU'],
    updated_at: '2026-06-01T12:00:00Z'
  },
  {
    id: 'sch-D',
    patient_id: 'pat-101',
    compartment: 'D',
    dispense_time: '18:00',
    frequency: 'daily',
    days_of_week: [],
    start_date: '2026-01-16',
    end_date: null,
    active: true,
    medication_ids: ['med-2'],
    medication_names: ['Metformin HCl 500mg'],
    updated_at: '2026-06-01T18:00:00Z'
  },
  {
    id: 'sch-E',
    patient_id: 'pat-101',
    compartment: 'E',
    dispense_time: '21:00',
    frequency: 'daily',
    days_of_week: [],
    start_date: '2026-01-20',
    end_date: null,
    active: true,
    medication_ids: ['med-3'],
    medication_names: ['Atorvastatin 20mg'],
    updated_at: '2026-06-01T21:00:00Z'
  },
  {
    id: 'sch-F',
    patient_id: 'pat-101',
    compartment: 'F',
    dispense_time: '14:00',
    frequency: 'as_needed',
    days_of_week: [],
    start_date: '2026-03-01',
    end_date: null,
    active: false,
    medication_ids: [],
    medication_names: ['Unallocated PRN Compartment'],
    updated_at: '2026-06-01T14:00:00Z'
  },
  {
    id: 'sch-G',
    patient_id: 'pat-101',
    compartment: 'G',
    dispense_time: '20:00',
    frequency: 'specific_days',
    days_of_week: ['mon', 'wed', 'fri'],
    start_date: '2026-04-01',
    end_date: null,
    active: true,
    medication_ids: ['med-4'],
    medication_names: ['Vitamin D3 (Weekly booster)'],
    updated_at: '2026-06-01T20:00:00Z'
  }
];

export const MOCK_DISPENSE_LOGS: DispenseEventRecord[] = [
  {
    id: 'disp-001',
    device_id: 'dev-9901',
    patient_id: 'pat-101',
    schedule_id: 'sch-A',
    compartment: 'A',
    status: 'success',
    scheduled_time: '08:00',
    dispensed_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    received_at: new Date(Date.now() - 3600000 * 4 + 1200).toISOString(),
    was_offline_cached: false,
    has_video: true
  },
  {
    id: 'disp-002',
    device_id: 'dev-9901',
    patient_id: 'pat-101',
    schedule_id: 'sch-B',
    compartment: 'B',
    status: 'success',
    scheduled_time: '08:00',
    dispensed_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    received_at: new Date(Date.now() - 3600000 * 4 + 1400).toISOString(),
    was_offline_cached: false,
    has_video: true
  },
  {
    id: 'disp-003',
    device_id: 'dev-9901',
    patient_id: 'pat-101',
    schedule_id: 'sch-C',
    compartment: 'C',
    status: 'success',
    scheduled_time: '12:00',
    dispensed_at: new Date(Date.now() - 86400000 + 3600000 * 12).toISOString(),
    received_at: new Date(Date.now() - 86400000 + 3600000 * 12 + 1000).toISOString(),
    was_offline_cached: false,
    has_video: true
  },
  {
    id: 'disp-004',
    device_id: 'dev-9901',
    patient_id: 'pat-101',
    schedule_id: 'sch-D',
    compartment: 'D',
    status: 'skipped',
    scheduled_time: '18:00',
    dispensed_at: new Date(Date.now() - 86400000 + 3600000 * 18).toISOString(),
    received_at: new Date(Date.now() - 86400000 + 3600000 * 18).toISOString(),
    was_offline_cached: false,
    has_video: false
  }
];

export const MOCK_VIDEOS: AdherenceVideoRecord[] = [
  {
    id: 'vid-101',
    dispense_event_id: 'disp-001',
    file_path: '/videos/pat-101/disp-001.mp4',
    duration_seconds: 18,
    person_detected: true,
    uploaded_at: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: 'vid-102',
    dispense_event_id: 'disp-002',
    file_path: '/videos/pat-101/disp-002.mp4',
    duration_seconds: 22,
    person_detected: true,
    uploaded_at: new Date(Date.now() - 3600000 * 4).toISOString()
  }
];

export const MOCK_TELEMETRY: TelemetryRecord[] = [
  {
    id: 'tel-501',
    device_id: 'dev-9901',
    reported_at: new Date().toISOString(),
    current_compartment: 'A',
    motor_status: 'ready',
    sensor_status: 'ok',
    person_detected: true,
    tray_state: 'closed',
    battery_level: 88,
    wifi_rssi: -52,
    uptime_seconds: 432000
  },
  {
    id: 'tel-500',
    device_id: 'dev-9901',
    reported_at: new Date(Date.now() - 300000).toISOString(),
    current_compartment: 'A',
    motor_status: 'ready',
    sensor_status: 'ok',
    person_detected: false,
    tray_state: 'closed',
    battery_level: 89,
    wifi_rssi: -54,
    uptime_seconds: 431700
  }
];

export const MOCK_VOICE_INTERACTIONS: VoiceInteractionRecord[] = [
  {
    id: 'v-901',
    patient_id: 'pat-101',
    device_id: 'dev-9901',
    transcript: 'Should I take Lisinopril with food or on an empty stomach?',
    answer_text: 'Lisinopril can be taken with or without food. However, try to take it consistently at the same time every morning to maintain stable blood pressure control.',
    citations: [{ doc: 'Hypertension_Care_Plan_2026.pdf', page: 4 }],
    tool_results: [],
    audio_format: 'wav',
    created_at: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: 'v-902',
    patient_id: 'pat-101',
    device_id: 'dev-9901',
    transcript: 'When is my next scheduled dose of Metformin?',
    answer_text: 'Your next Metformin dose is scheduled in Compartment D at 06:00 PM today.',
    citations: [],
    tool_results: [{ action: 'query_schedule', compartment: 'D' }],
    audio_format: 'wav',
    created_at: new Date(Date.now() - 14400000).toISOString()
  }
];

export const MOCK_NOTIFICATIONS: NotificationRecord[] = [
  {
    id: 'notif-1',
    patient_id: 'pat-101',
    type: 'missed_dose',
    message: 'Missed dose alert: Compartment D (Metformin) was not retrieved yesterday at 18:00.',
    read: false,
    created_at: new Date(Date.now() - 3600000 * 16).toISOString()
  },
  {
    id: 'notif-2',
    patient_id: 'pat-101',
    type: 'low_stock',
    message: 'Inventory warning: Compartment B (Metformin 500mg) has 4 tablets remaining.',
    read: true,
    created_at: new Date(Date.now() - 3600000 * 28).toISOString()
  },
  {
    id: 'notif-3',
    patient_id: 'pat-101',
    type: 'device_sync',
    message: 'Schedule update successfully synchronized to Unit DISPENSER-M42-7C.',
    read: true,
    created_at: new Date(Date.now() - 3600000 * 40).toISOString()
  }
];

export const MOCK_KNOWLEDGE: KnowledgeDocRecord[] = [
  {
    id: 'kdoc-1',
    filename: 'Eleanor_Vance_Clinical_Care_Plan_2026.pdf',
    ingest_status: 'ingested',
    uploaded_at: '2026-01-20T10:30:00Z'
  },
  {
    id: 'kdoc-2',
    filename: 'Lisinopril_Metformin_Drug_Interaction_Guide.pdf',
    ingest_status: 'ingested',
    uploaded_at: '2026-02-05T14:15:00Z'
  },
  {
    id: 'kdoc-3',
    filename: 'Hospital_Discharge_Summary_Cardiology.pdf',
    ingest_status: 'ingested',
    uploaded_at: '2026-03-12T11:00:00Z'
  }
];

export const INITIAL_VITALS: Vitals = {
  bloodPressure: '120/80',
  heartRate: 72,
  temperature: 98.6,
  spO2: 98
};

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'act-1',
    timestamp: 'Today, 08:05 AM',
    text: 'Compartment A & B (Lisinopril & Metformin) dispensed on time.',
    type: 'dispense'
  },
  {
    id: 'act-2',
    timestamp: 'Today, 07:58 AM',
    text: 'Ally AI Voice Interaction: Verified medication dosage question.',
    type: 'system'
  },
  {
    id: 'act-3',
    timestamp: 'Yesterday, 06:00 PM',
    text: 'Missed dose recorded for Compartment D (Metformin).',
    type: 'alert'
  },
  {
    id: 'act-4',
    timestamp: 'Yesterday, 12:00 PM',
    text: 'Compartment C (Vitamin D3) dispensed successfully.',
    type: 'dispense'
  }
];

export const INITIAL_SETTINGS: ClinicalSettings = {
  email: 'caregiver@medlab.org',
  apiBaseUrl: 'https://medication-dispenser-agent.onrender.com',
  useRealApi: true,
  alerts: {
    emailNotifications: true,
    pushNotifications: true,
    smsAlerts: true
  },
  hardwareId: 'DISPENSER-M42-7C',
  firmware: 'v3.1.2-esp32',
  lastCalibration: 'Today, 08:00 AM'
};
