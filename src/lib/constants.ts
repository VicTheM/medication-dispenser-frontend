import { ClinicalSettings, Vitals, ActivityLog } from '../types';

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
    text: 'Compartment A & B dispensed on time.',
    type: 'dispense'
  },
  {
    id: 'act-2',
    timestamp: 'Today, 07:58 AM',
    text: 'Ally AI answered a medication dosage query.',
    type: 'system'
  },
  {
    id: 'act-3',
    timestamp: 'Yesterday, 06:00 PM',
    text: 'Missed dose recorded for Compartment D.',
    type: 'alert'
  },
  {
    id: 'act-4',
    timestamp: 'Yesterday, 12:00 PM',
    text: 'Compartment C dispensed successfully.',
    type: 'dispense'
  }
];

export const INITIAL_SETTINGS: ClinicalSettings = {
  email: 'caregiver@medlab.org',
  apiBaseUrl: 'https://medication-dispenser-agent.onrender.com',
  alerts: {
    emailNotifications: true,
    pushNotifications: true,
    smsAlerts: true
  },
  hardwareId: 'DISPENSER-M42-7C',
  firmware: 'v3.1.2-esp32',
  lastCalibration: 'Today, 08:00 AM'
};
