/**
 * MedAdhere API Client
 * Base URL: https://medication-dispenser-agent.onrender.com (or configurable)
 */

import {
  AuthToken,
  CaregiverUser,
  PatientUser,
  DeviceStatus,
  DeviceFull,
  MedicationRecord,
  ScheduleRecord,
  DispenseEventRecord,
  AdherenceVideoRecord,
  TelemetryRecord,
  VoiceInteractionRecord,
  NotificationRecord,
  KnowledgeDocRecord
} from '../types';

export const DEFAULT_API_BASE_URL = 'https://medication-dispenser-agent.onrender.com';

class MedAdhereApiClient {
  private baseUrl: string;
  private token: string | null = null;
  private role: 'caregiver' | 'patient' | null = null;

  constructor() {
    this.baseUrl = localStorage.getItem('medadhere_api_base_url') || DEFAULT_API_BASE_URL;
    this.token = localStorage.getItem('medadhere_token') || null;
    this.role = (localStorage.getItem('medadhere_role') as 'caregiver' | 'patient') || null;
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  public setBaseUrl(url: string) {
    this.baseUrl = url.trim().replace(/\/$/, '');
    localStorage.setItem('medadhere_api_base_url', this.baseUrl);
  }

  public getToken(): string | null {
    return this.token;
  }

  public getRole(): 'caregiver' | 'patient' | null {
    return this.role;
  }

  public setAuth(token: string, role: 'caregiver' | 'patient') {
    this.token = token;
    this.role = role;
    localStorage.setItem('medadhere_token', token);
    localStorage.setItem('medadhere_role', role);
  }

  public clearAuth() {
    this.token = null;
    this.role = null;
    localStorage.removeItem('medadhere_token');
    localStorage.removeItem('medadhere_role');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{ data?: T; error?: string; status?: number }> {
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    if (this.token && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    if (!headers['Content-Type'] && !(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    try {
      const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
      const res = await fetch(url, {
        ...options,
        headers,
      });

      if (res.status === 204) {
        return { status: 204 };
      }

      const contentType = res.headers.get('content-type') || '';
      let json: any;
      if (contentType.includes('application/json')) {
        json = await res.json();
      } else {
        const text = await res.text();
        json = { detail: text };
      }

      if (!res.ok) {
        const detail = json?.detail;
        const msg = typeof detail === 'string' 
          ? detail 
          : Array.isArray(detail) 
            ? detail.map(d => `${d.loc?.join('.')}: ${d.msg}`).join(', ') 
            : `HTTP Error ${res.status}`;
        return { error: msg, status: res.status };
      }

      return { data: json as T, status: res.status };
    } catch (err: any) {
      return { error: err.message || 'Network connection failed', status: 0 };
    }
  }

  // --- Auth Endpoints ---
  async registerCaregiver(data: { full_name: string; email: string; password: string; phone?: string }) {
    return this.request<CaregiverUser>('/auth/caregiver/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async loginCaregiver(data: { email: string; password: string }) {
    const res = await this.request<AuthToken>('/auth/caregiver/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (res.data?.access_token) {
      this.setAuth(res.data.access_token, 'caregiver');
    }
    return res;
  }

  async loginPatient(data: { email: string; password: string }) {
    const res = await this.request<AuthToken>('/auth/patient/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (res.data?.access_token) {
      this.setAuth(res.data.access_token, 'patient');
    }
    return res;
  }

  // --- Caregiver Me ---
  async getCaregiverMe() {
    return this.request<CaregiverUser>('/caregivers/me');
  }

  // --- Patients ---
  async listPatients() {
    return this.request<PatientUser[]>('/caregivers/patients');
  }

  async enrolPatient(data: {
    full_name: string;
    date_of_birth?: string;
    phone?: string;
    email?: string;
    password?: string;
    notes?: string;
    timezone?: string;
  }) {
    return this.request<PatientUser>('/caregivers/patients', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getPatient(patientId: string) {
    return this.request<PatientUser>(`/caregivers/patients/${patientId}`);
  }

  async updatePatient(patientId: string, data: { full_name?: string; phone?: string; notes?: string; timezone?: string }) {
    return this.request<PatientUser>(`/caregivers/patients/${patientId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deletePatient(patientId: string) {
    return this.request<void>(`/caregivers/patients/${patientId}`, {
      method: 'DELETE',
    });
  }

  // --- Devices ---
  async assignDevice(patientId: string, deviceUid: string) {
    return this.request<DeviceFull>(`/caregivers/patients/${patientId}/device`, {
      method: 'POST',
      body: JSON.stringify({ device_uid: deviceUid }),
    });
  }

  async getPatientDevice(patientId: string) {
    return this.request<DeviceStatus>(`/caregivers/patients/${patientId}/device`);
  }

  async sendDeviceCommand(deviceUid: string, commandType: string, payload?: Record<string, any>) {
    return this.request<any>(`/caregivers/devices/${deviceUid}/commands`, {
      method: 'POST',
      body: JSON.stringify({ command_type: commandType, payload }),
    });
  }

  // --- Medications ---
  async listMedications(patientId: string) {
    return this.request<MedicationRecord[]>(`/caregivers/patients/${patientId}/medications`);
  }

  async createMedication(patientId: string, data: { name: string; dosage?: string; form?: string; instructions?: string; prescribing_doctor?: string }) {
    return this.request<MedicationRecord>(`/caregivers/patients/${patientId}/medications`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateMedication(medicationId: string, data: { name?: string; dosage?: string; form?: string; instructions?: string; prescribing_doctor?: string; active?: boolean }) {
    return this.request<MedicationRecord>(`/caregivers/medications/${medicationId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteMedication(medicationId: string) {
    return this.request<void>(`/caregivers/medications/${medicationId}`, {
      method: 'DELETE',
    });
  }

  // --- Schedules (Compartments A–G) ---
  async listSchedules(patientId: string) {
    return this.request<ScheduleRecord[]>(`/caregivers/patients/${patientId}/schedules`);
  }

  async createSchedule(patientId: string, data: {
    compartment: string; // 'A' .. 'G'
    medication_ids: string[];
    dispense_time: string; // 'HH:MM'
    frequency?: 'daily' | 'specific_days' | 'as_needed';
    days_of_week?: string[];
    start_date?: string;
    end_date?: string;
  }) {
    return this.request<ScheduleRecord>(`/caregivers/patients/${patientId}/schedules`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateSchedule(scheduleId: string, data: {
    medication_ids?: string[];
    dispense_time?: string;
    frequency?: string;
    days_of_week?: string[];
    start_date?: string;
    end_date?: string;
    active?: boolean;
  }) {
    return this.request<ScheduleRecord>(`/caregivers/schedules/${scheduleId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteSchedule(scheduleId: string) {
    return this.request<void>(`/caregivers/schedules/${scheduleId}`, {
      method: 'DELETE',
    });
  }

  async forceSyncSchedule(patientId: string) {
    return this.request<any>(`/caregivers/patients/${patientId}/schedules/sync`, {
      method: 'POST',
    });
  }

  // --- Monitoring & Logs ---
  async listDispenseLogs(patientId: string, limit = 100) {
    return this.request<DispenseEventRecord[]>(`/caregivers/patients/${patientId}/dispense-logs?limit=${limit}`);
  }

  async listAdherenceVideos(patientId: string) {
    return this.request<AdherenceVideoRecord[]>(`/caregivers/patients/${patientId}/adherence-videos`);
  }

  async listTelemetry(patientId: string, limit = 50) {
    return this.request<TelemetryRecord[]>(`/caregivers/patients/${patientId}/telemetry?limit=${limit}`);
  }

  async listVoiceInteractions(patientId: string) {
    return this.request<VoiceInteractionRecord[]>(`/caregivers/patients/${patientId}/voice-interactions`);
  }

  async listNotifications(patientId: string) {
    return this.request<NotificationRecord[]>(`/caregivers/patients/${patientId}/notifications`);
  }

  // --- Patient Self Endpoints ---
  async getPatientMe() {
    return this.request<PatientUser>('/patients/me');
  }

  async getMyMedications() {
    return this.request<MedicationRecord[]>('/patients/me/medications');
  }

  async getMySchedules() {
    return this.request<ScheduleRecord[]>('/patients/me/schedules');
  }

  async getMyDispenseLogs(limit = 100) {
    return this.request<DispenseEventRecord[]>(`/patients/me/dispense-logs?limit=${limit}`);
  }

  async getMyAdherenceVideos() {
    return this.request<AdherenceVideoRecord[]>('/patients/me/adherence-videos');
  }

  async getMyDevice() {
    return this.request<DeviceStatus>('/patients/me/device');
  }

  async getMyVoiceInteractions() {
    return this.request<VoiceInteractionRecord[]>('/patients/me/voice-interactions');
  }

  async getMyNotifications() {
    return this.request<NotificationRecord[]>('/patients/me/notifications');
  }

  // --- AI Ally Assistant ---
  async askAiQuestion(question: string) {
    return this.request<{
      question?: string;
      answer: string;
      citations?: any[];
      tool_results?: any[];
    }>('/ai/ask', {
      method: 'POST',
      body: JSON.stringify({ question }),
    });
  }

  async askAiVoice(audioBlob: Blob, audioFormat = 'wav') {
    const formData = new FormData();
    formData.append('audio', audioBlob, `speech.${audioFormat}`);
    formData.append('audio_format', audioFormat);
    return this.request<{
      transcript?: string;
      answer_text?: string;
      audio_base64?: string;
      citations?: any[];
    }>('/ai/voice-ask', {
      method: 'POST',
      body: formData,
    });
  }

  async getAiHealth() {
    return this.request<any>('/ai/health');
  }

  // --- AI Knowledge Base ---
  async listKnowledgeDocs() {
    return this.request<KnowledgeDocumentOut[]>('/ai/knowledge');
  }

  async uploadKnowledgeDoc(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.request<KnowledgeDocRecord>('/ai/knowledge', {
      method: 'POST',
      body: formData,
    });
  }

  async reingestKnowledge() {
    return this.request<any>('/ai/knowledge/reingest', {
      method: 'POST',
    });
  }
}

export type KnowledgeDocumentOut = KnowledgeDocRecord;

export const api = new MedAdhereApiClient();
