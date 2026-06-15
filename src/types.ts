/**
 * Represents the onboarding state for a clinical/patient account.
 */
export interface OnboardingState {
  step: 1 | 2 | 3;
  firstName: string;
  lastName: string;
  email: string;
  isCompleted: boolean;
}

/**
 * Medication item form types.
 */
export type MedicationFormType = 'Tablet' | 'Capsule' | 'Liquid' | 'Inhaler';

/**
 * Frequency schedule types.
 */
export type MedicationFrequencyType = 'Once daily' | 'Twice daily' | 'Three times daily' | 'custom';

/**
 * A detail for when a medication should be dispensed.
 */
export interface DispenseTime {
  time: string; // e.g., "08:00"
  pills: number;
}

/**
 * Structured Medication object.
 */
export interface Medication {
  id: string;
  name: string;
  dosage: string;
  form: MedicationFormType;
  frequency: MedicationFrequencyType;
  times: DispenseTime[];
  status: 'Active' | 'Next Up' | 'Inactive';
  compartment: number; // 1, 2, 3, or 4
  totalLeft: number;
  totalCapacity: number;
  purpose: string;
}

/**
 * Simple recent activity timeline log.
 */
export interface ActivityLog {
  id: string;
  timestamp: string; // e.g., "Today, 08:05 AM"
  text: string;
}

/**
 * Patient vital signs.
 */
export interface Vitals {
  bloodPressure: string; // e.g., "120/80"
  heartRate: number; // e.g., 72
}

/**
 * Daily adherence verification logs with video verification status.
 */
export interface VerificationLog {
  id: string;
  status: 'Taken' | 'Missed';
  timestamp: string; // e.g., "Today, 08:00 AM"
  timeOfDay: string; // e.g., "08:00 AM"
  medName: string;
  dosage: string;
  pills: number;
  hasVideo: boolean;
  videoUrl?: string; // unsplash video log representation
  aiVerifiedText?: string; // AI confirmation text
  cardPhotoUrl?: string; // unspash preview image
}

/**
 * Settings configuration state.
 */
export interface ClinicalSettings {
  email: string;
  alerts: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    smsAlerts: boolean;
  };
  hardwareId: string;
  firmware: string;
  lastCalibration: string; // "Oct 12, 2023 (14 days ago)"
}
