import { Medication, ActivityLog, Vitals, VerificationLog, ClinicalSettings } from './types';

export const INITIAL_MEDICATIONS: Medication[] = [
  {
    id: '1',
    name: 'Lisinopril',
    dosage: '10mg',
    form: 'Tablet',
    frequency: 'Once daily',
    times: [{ time: '08:00', pills: 1 }],
    status: 'Active',
    compartment: 1,
    totalLeft: 14,
    totalCapacity: 20,
    purpose: 'Take 1 tablet by mouth daily for hypertension.'
  },
  {
    id: '2',
    name: 'Metformin',
    dosage: '500mg',
    form: 'Tablet',
    frequency: 'Twice daily',
    times: [
      { time: '08:00', pills: 1 },
      { time: '14:00', pills: 2 }
    ],
    status: 'Next Up',
    compartment: 2,
    totalLeft: 4,
    totalCapacity: 20,
    purpose: 'Take with food for blood sugar control.'
  },
  {
    id: '3',
    name: 'Atorvastatin',
    dosage: '20mg',
    form: 'Capsule',
    frequency: 'Once daily',
    times: [{ time: '21:00', pills: 1 }],
    status: 'Active',
    compartment: 3,
    totalLeft: 18,
    totalCapacity: 20,
    purpose: 'Take 1 capsule before bed for cholesterol management.'
  }
];

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'act-1',
    timestamp: 'Today, 08:05 AM',
    text: 'Metformin dispensed successfully.'
  },
  {
    id: 'act-2',
    timestamp: 'Yesterday, 09:00 PM',
    text: 'Weekly adherence report generated.'
  },
  {
    id: 'act-3',
    timestamp: 'Yesterday, 08:00 PM',
    text: 'Atorvastatin dispensed successfully.'
  }
];

export const INITIAL_VITALS: Vitals = {
  bloodPressure: '120/80',
  heartRate: 72
};

export const INITIAL_VERIFICATION_LOGS: VerificationLog[] = [
  {
    id: 'log-1',
    status: 'Taken',
    timestamp: 'Today, 8:00 AM',
    timeOfDay: '8:00 AM',
    medName: 'Lisinopril',
    dosage: '10mg',
    pills: 1,
    hasVideo: true,
    cardPhotoUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    aiVerifiedText: 'AI Verified: Pill Detected'
  },
  {
    id: 'log-2',
    status: 'Taken',
    timestamp: 'Yesterday, 8:05 AM',
    timeOfDay: '8:05 AM',
    medName: 'Lisinopril',
    dosage: '10mg',
    pills: 1,
    hasVideo: true,
    cardPhotoUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    aiVerifiedText: 'AI Verified: Pill Detected'
  },
  {
    id: 'log-3',
    status: 'Missed',
    timestamp: 'Wed, 8:00 AM',
    timeOfDay: '8:00 AM',
    medName: 'Lisinopril',
    dosage: '10mg',
    pills: 1,
    hasVideo: false
  }
];

export const INITIAL_SETTINGS: ClinicalSettings = {
  email: 'clinician@medlab.org',
  alerts: {
    emailNotifications: true,
    pushNotifications: true,
    smsAlerts: false
  },
  hardwareId: 'ML-SDP-8472-A',
  firmware: 'v2.4.1',
  lastCalibration: 'Oct 12, 2023 (14 days ago)'
};
