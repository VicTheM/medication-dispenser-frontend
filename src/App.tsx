import React, { useState, useEffect } from 'react';
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
  ActivityLog,
  UserRole
} from './types';

import { 
  MOCK_PATIENTS, 
  MOCK_DEVICE, 
  MOCK_MEDICATIONS, 
  MOCK_SCHEDULES, 
  MOCK_DISPENSE_LOGS, 
  MOCK_VIDEOS, 
  MOCK_TELEMETRY, 
  MOCK_VOICE_INTERACTIONS, 
  MOCK_NOTIFICATIONS, 
  MOCK_KNOWLEDGE, 
  INITIAL_VITALS, 
  INITIAL_ACTIVITY_LOGS, 
  INITIAL_SETTINGS 
} from './mockData';

import { api } from './lib/api';

// Components
import Navigation, { TabType } from './components/Navigation';
import LandingView from './components/LandingView';
import OnboardingFlow from './components/OnboardingFlow';
import DashboardView from './components/DashboardView';
import PatientsView from './components/PatientsView';
import MedicationsView from './components/MedicationsView';
import AdherenceView from './components/AdherenceView';
import HardwareView from './components/HardwareView';
import AiAssistantView from './components/AiAssistantView';
import NotificationsView from './components/NotificationsView';
import SettingsView from './components/SettingsView';

export default function App() {
  // Authentication & Session
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<UserRole>('caregiver');
  const [userEmail, setUserEmail] = useState<string>('dr.smith@medlab.org');
  const [userName, setUserName] = useState<string>('Dr. Sarah Smith');

  // Navigation
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  // Multi-patient Data
  const [patients, setPatients] = useState<PatientUser[]>(MOCK_PATIENTS);
  const [selectedPatientId, setSelectedPatientId] = useState<string>(MOCK_PATIENTS[0].id);

  // Patient-specific state
  const [device, setDevice] = useState<DeviceStatus | null>(MOCK_DEVICE);
  const [medications, setMedications] = useState<MedicationRecord[]>(MOCK_MEDICATIONS);
  const [schedules, setSchedules] = useState<ScheduleRecord[]>(MOCK_SCHEDULES);
  const [dispenseLogs, setDispenseLogs] = useState<DispenseEventRecord[]>(MOCK_DISPENSE_LOGS);
  const [videos, setVideos] = useState<AdherenceVideoRecord[]>(MOCK_VIDEOS);
  const [telemetry, setTelemetry] = useState<TelemetryRecord[]>(MOCK_TELEMETRY);
  const [voiceInteractions, setVoiceInteractions] = useState<VoiceInteractionRecord[]>(MOCK_VOICE_INTERACTIONS);
  const [notifications, setNotifications] = useState<NotificationRecord[]>(MOCK_NOTIFICATIONS);
  const [knowledgeDocs, setKnowledgeDocs] = useState<KnowledgeDocRecord[]>(MOCK_KNOWLEDGE);

  // App vitals & settings
  const [vitals, setVitals] = useState<Vitals>(INITIAL_VITALS);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(INITIAL_ACTIVITY_LOGS);
  const [settings, setSettings] = useState<ClinicalSettings>(INITIAL_SETTINGS);

  const currentPatient = patients.find(p => p.id === selectedPatientId) || patients[0] || null;

  // Sync settings API Base URL with API client
  useEffect(() => {
    api.setBaseUrl(settings.apiBaseUrl);
  }, [settings.apiBaseUrl]);

  // Initial backend data load
  useEffect(() => {
    if (!settings.useRealApi) return;

    async function loadBackendData() {
      try {
        const pRes = await api.listPatients();
        if (pRes.data && pRes.data.length > 0) {
          setPatients(pRes.data);
        }
      } catch (err) {
        console.warn('Real API unavailable, using local mock data.', err);
      }
    }
    loadBackendData();
  }, [settings.useRealApi]);

  // Load patient details function
  const loadPatientDetails = async () => {
    if (!selectedPatientId || !settings.useRealApi) return;
    try {
      const [medsRes, schsRes, devRes, dispsRes, notifsRes] = await Promise.all([
        api.listMedications(selectedPatientId),
        api.listSchedules(selectedPatientId),
        api.getPatientDevice(selectedPatientId),
        api.listDispenseLogs(selectedPatientId),
        api.listNotifications(selectedPatientId)
      ]);
      if (medsRes.data) setMedications(medsRes.data);
      if (schsRes.data) setSchedules(schsRes.data);
      if (devRes.data) setDevice(devRes.data);
      if (dispsRes.data) setDispenseLogs(dispsRes.data);
      if (notifsRes.data) setNotifications(notifsRes.data);
    } catch (e) {
      console.warn('Using local patient data fallback');
    }
  };

  useEffect(() => {
    loadPatientDetails();
  }, [selectedPatientId, settings.useRealApi]);

  // Auth Handler
  const handleAuthComplete = (user: { email: string; role: UserRole; name: string }) => {
    setUserEmail(user.email);
    setUserRole(user.role);
    setUserName(user.name);
    setIsAuthenticated(true);
    setActiveTab('dashboard');
  };

  const handleLaunchPortal = (role?: 'caregiver' | 'patient') => {
    if (role) setUserRole(role);
    setIsAuthenticated(true);
    setActiveTab('dashboard');
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
  };

  const handleSelectPatient = (patientId: string) => {
    setSelectedPatientId(patientId);
  };

  const handleEnrolPatient = async (patient: Partial<PatientUser>) => {
    try {
      if (settings.useRealApi) {
        const res = await api.enrolPatient({
          full_name: patient.full_name || 'New Patient',
          date_of_birth: patient.date_of_birth,
          phone: patient.phone,
          email: patient.email,
          notes: patient.notes,
          timezone: 'America/New_York'
        });
        if (res.data) {
          setPatients(prev => [res.data!, ...prev]);
          setSelectedPatientId(res.data.id);
        } else if (res.error) {
          alert(`Enrollment error: ${res.error}`);
        }
      } else {
        const mockP: PatientUser = {
          id: `pat-${Date.now().toString().slice(-4)}`,
          caregiver_id: 'cg-001',
          full_name: patient.full_name || 'New Patient',
          date_of_birth: patient.date_of_birth || '1960-01-01',
          phone: patient.phone || '',
          email: patient.email || '',
          notes: patient.notes || '',
          timezone: 'America/New_York',
          created_at: new Date().toISOString()
        };
        setPatients(prev => [mockP, ...prev]);
        setSelectedPatientId(mockP.id);
      }
      alert(`Patient ${patient.full_name} enrolled successfully.`);
    } catch (err: any) {
      alert(`Enrollment failed: ${err.message}`);
    }
  };

  const handleUpdatePatient = async (patientId: string, data: Partial<PatientUser>) => {
    try {
      if (settings.useRealApi) {
        const res = await api.updatePatient(patientId, data);
        if (res.data) {
          setPatients(prev => prev.map(p => p.id === patientId ? res.data! : p));
        }
      } else {
        setPatients(prev => prev.map(p => p.id === patientId ? { ...p, ...data } : p));
      }
      alert('Patient details updated.');
    } catch (e: any) {
      alert(`Update failed: ${e.message}`);
    }
  };

  const handleDeletePatient = async (patientId: string) => {
    if (!confirm('Are you sure you want to remove this patient from your roster?')) return;
    try {
      if (settings.useRealApi) {
        await api.deletePatient(patientId);
      }
      setPatients(prev => prev.filter(p => p.id !== patientId));
      if (selectedPatientId === patientId) {
        const remaining = patients.filter(p => p.id !== patientId);
        if (remaining.length > 0) setSelectedPatientId(remaining[0].id);
      }
    } catch (err: any) {
      alert(`Failed to delete patient: ${err.message}`);
    }
  };

  // Medication handlers
  const handleCreateMedication = async (data: { name: string; dosage?: string; form?: string; instructions?: string; prescribing_doctor?: string }) => {
    if (settings.useRealApi) {
      const res = await api.createMedication(selectedPatientId, data);
      if (res.data) setMedications(prev => [res.data!, ...prev]);
      return res;
    } else {
      const mockMed: MedicationRecord = {
        id: `med-${Date.now()}`,
        patient_id: selectedPatientId,
        name: data.name,
        dosage: data.dosage || '10mg',
        form: data.form || 'Tablet',
        instructions: data.instructions || '',
        prescribing_doctor: data.prescribing_doctor || userName,
        active: true,
        created_at: new Date().toISOString()
      };
      setMedications(prev => [mockMed, ...prev]);
      return { data: mockMed };
    }
  };

  const handleDeleteMedication = async (medicationId: string) => {
    if (settings.useRealApi) {
      await api.deleteMedication(medicationId);
    }
    setMedications(prev => prev.filter(m => m.id !== medicationId));
  };

  // Schedule handlers
  const handleCreateSchedule = async (data: {
    compartment: string;
    medication_ids: string[];
    dispense_time: string;
    frequency?: 'daily' | 'specific_days' | 'as_needed';
    days_of_week?: string[];
    start_date?: string;
    end_date?: string;
  }) => {
    if (settings.useRealApi) {
      const res = await api.createSchedule(selectedPatientId, data);
      if (res.data) {
        setSchedules(prev => prev.map(s => s.compartment === res.data!.compartment ? res.data! : s));
      }
      return res;
    } else {
      const updatedSch: ScheduleRecord = {
        id: `sch-${data.compartment}`,
        patient_id: selectedPatientId,
        compartment: data.compartment,
        dispense_time: data.dispense_time,
        frequency: data.frequency || 'daily',
        days_of_week: data.days_of_week || [],
        start_date: data.start_date || new Date().toISOString().slice(0, 10),
        end_date: data.end_date || null,
        active: true,
        medication_ids: data.medication_ids,
        medication_names: data.medication_ids.map(id => medications.find(m => m.id === id)?.name || id),
        updated_at: new Date().toISOString()
      };
      setSchedules(prev => prev.map(s => s.compartment === data.compartment ? updatedSch : s));
      return { data: updatedSch };
    }
  };

  const handleDeleteSchedule = async (scheduleId: string) => {
    if (settings.useRealApi) {
      await api.deleteSchedule(scheduleId);
    }
    setSchedules(prev => prev.map(s => s.id === scheduleId ? { ...s, active: false } : s));
  };

  const handleForceSyncSchedule = async () => {
    if (settings.useRealApi) {
      const res = await api.forceSyncSchedule(selectedPatientId);
      alert('Schedules forcibly synchronized to ESP32 dispenser.');
      return res;
    } else {
      alert('Local demo mode: Schedules synchronized to dispenser memory.');
      return { status: 'synced' };
    }
  };

  // Hardware Device handlers
  const handleAssignDevice = async (deviceUid: string) => {
    if (settings.useRealApi) {
      const res = await api.assignDevice(selectedPatientId, deviceUid);
      if (res.data) {
        setDevice({
          id: res.data.id,
          device_uid: res.data.device_uid,
          patient_id: selectedPatientId,
          status: 'online',
          battery_level: 95,
          firmware_version: 'v3.1.2-esp32'
        });
      }
    } else {
      setDevice(prev => prev ? { ...prev, device_uid: deviceUid } : {
        id: `dev-${Date.now()}`,
        device_uid: deviceUid,
        patient_id: selectedPatientId,
        status: 'online',
        battery_level: 90
      });
    }
    alert(`Hardware Dispenser UID ${deviceUid} assigned to patient.`);
  };

  const handleSendCommand = async (deviceUid: string, commandType: string, payload?: Record<string, any>) => {
    if (settings.useRealApi) {
      const result = await api.sendDeviceCommand(deviceUid, commandType, payload);
      alert(`Hardware Command sent: ${result.data?.status || 'Success'}`);
      return result;
    } else {
      const newLog: ActivityLog = {
        id: `act-${Date.now()}`,
        timestamp: 'Just now',
        text: `Command [${commandType}] executed on Hardware ${deviceUid}.`,
        type: 'dispense'
      };
      setActivityLogs(prev => [newLog, ...prev]);
      return { data: { status: 'sent', command: commandType } };
    }
  };

  // AI Assistant handlers
  const handleAskQuestion = async (question: string) => {
    if (settings.useRealApi) {
      const res = await api.askAiQuestion(question);
      if (res.data) return res.data;
      throw new Error(res.error || 'AI Query Failed');
    } else {
      return {
        answer: `Ally AI Response: Based on ${currentPatient?.full_name || 'the patient'}'s profile and active 7-compartment dispenser records, take Lisinopril 10mg in the morning (Compartment A) with water. No severe interactions detected with Metformin in Compartment B.`,
        citations: [{ doc: 'Hypertension_Care_Plan_2026.pdf', page: 2 }],
        tool_results: [{ action: 'check_compartment_schedule', compartment: 'A' }]
      };
    }
  };

  const handleAskVoice = async (audioBlob: Blob) => {
    if (settings.useRealApi) {
      const res = await api.askAiVoice(audioBlob);
      if (res.data) return res.data;
      throw new Error(res.error || 'Voice AI Query Failed');
    } else {
      return {
        transcript: "When is my next dose of Lisinopril scheduled?",
        answer_text: "Your next dose of Lisinopril (10mg) is scheduled in Compartment A for 08:00 AM tomorrow morning.",
        citations: [{ doc: 'Eleanor_Vance_Clinical_Care_Plan_2026.pdf', page: 1 }]
      };
    }
  };

  const handleUploadKnowledge = async (file: File) => {
    if (settings.useRealApi) {
      const res = await api.uploadKnowledgeDoc(file);
      if (res.data) setKnowledgeDocs(prev => [res.data!, ...prev]);
      return res;
    } else {
      const mockDoc: KnowledgeDocRecord = {
        id: `kdoc-${Date.now()}`,
        filename: file.name,
        ingest_status: 'ingested',
        uploaded_at: new Date().toISOString()
      };
      setKnowledgeDocs(prev => [mockDoc, ...prev]);
      return { data: mockDoc };
    }
  };

  const handleReingestKnowledge = async () => {
    if (settings.useRealApi) {
      return await api.reingestKnowledge();
    } else {
      alert('Mock Knowledge documents re-indexed.');
      return { status: 'ok' };
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const csvHeader = 'Timestamp,Patient,Compartment,Status,OfflineCached,HasVideo\n';
    const csvRows = dispenseLogs.map(l => 
      `${l.dispensed_at},${currentPatient?.full_name || 'Patient'},${l.compartment},${l.status},${l.was_offline_cached},${l.has_video}`
    ).join('\n');
    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MedLab_Adherence_${currentPatient?.full_name || 'Export'}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const unreadNotificationCount = notifications.filter(n => !n.read).length;

  if (!isAuthenticated) {
    return <OnboardingFlow onComplete={handleAuthComplete} />;
  }

  return (
    <div className="bg-[#f8f9ff] text-[#0f1c2d] min-h-screen font-sans flex flex-col antialiased">
      
      {/* Top Navigation */}
      <Navigation 
        currentTab={activeTab} 
        onTabChange={setActiveTab}
        unreadNotificationCount={unreadNotificationCount}
        currentPatientName={currentPatient?.full_name || 'No Patient Selected'}
        userRole={userRole}
      />

      {/* Main Stage */}
      {activeTab === 'landing' ? (
        <LandingView onLaunchPortal={handleLaunchPortal} />
      ) : (
        <main className="flex-grow max-w-7xl w-full mx-auto px-4 md:px-8 py-6">
          
          {activeTab === 'dashboard' && (
            <DashboardView 
              currentPatient={currentPatient}
              device={device}
              medications={medications}
              schedules={schedules}
              vitals={vitals}
              activityLogs={activityLogs}
              onNavigateTab={setActiveTab}
              onSendCommand={handleSendCommand}
              onUpdateVitals={(newVitals) => setVitals(prev => ({ ...prev, ...newVitals }))}
            />
          )}

          {activeTab === 'patients' && (
            <PatientsView 
              patients={patients}
              selectedPatientId={selectedPatientId}
              onSelectPatient={handleSelectPatient}
              onEnrolPatient={handleEnrolPatient}
              onUpdatePatient={handleUpdatePatient}
              onDeletePatient={handleDeletePatient}
            />
          )}

          {activeTab === 'medications' && (
            <MedicationsView 
              medications={medications}
              schedules={schedules}
              patientId={selectedPatientId}
              isCaregiver={userRole === 'caregiver'}
              onCreateMedication={handleCreateMedication}
              onDeleteMedication={handleDeleteMedication}
              onCreateSchedule={handleCreateSchedule}
              onDeleteSchedule={handleDeleteSchedule}
              onForceSyncSchedule={handleForceSyncSchedule}
            />
          )}

          {activeTab === 'adherence' && (
            <AdherenceView 
              dispenseLogs={dispenseLogs}
              videos={videos}
              patientName={currentPatient?.full_name || 'Patient'}
              onExportCSV={handleExportCSV}
            />
          )}

          {activeTab === 'hardware' && (
            <HardwareView 
              device={device}
              telemetry={telemetry}
              patientName={currentPatient?.full_name || 'Patient'}
              onAssignDevice={handleAssignDevice}
              onSendCommand={handleSendCommand}
              onRefreshDevice={loadPatientDetails}
              isCaregiver={userRole === 'caregiver'}
            />
          )}

          {activeTab === 'ai_assistant' && (
            <AiAssistantView 
              onAskQuestion={handleAskQuestion}
              onAskVoice={handleAskVoice}
              knowledgeDocs={knowledgeDocs}
              onUploadDoc={handleUploadKnowledge}
              onReingest={handleReingestKnowledge}
              isCaregiver={userRole === 'caregiver'}
            />
          )}

          {activeTab === 'notifications' && (
            <NotificationsView 
              notifications={notifications}
              onMarkAllRead={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView 
              settings={settings}
              userRole={userRole}
              userEmail={userEmail}
              onUpdateSettings={(newSettings) => setSettings(prev => ({ ...prev, ...newSettings }))}
              onSignOut={handleSignOut}
            />
          )}

        </main>
      )}

      {/* Persistent Clinical Footer */}
      <footer className="bg-white border-t border-[#c3c6d5] py-4 px-6 md:px-8 text-xs text-[#737784] flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="flex items-center gap-2 font-semibold">
          <span className="w-2 h-2 bg-[#006d37] rounded-full inline-block animate-pulse"></span>
          <span>MedLab | Adherence pro • System Operational</span>
        </div>
        <div className="flex gap-4">
          <span>Backend: {settings.apiBaseUrl}</span>
          <span>Dispenser UID: {device?.device_uid || 'DISPENSER-M42-7C'}</span>
          <span>HIPAA 256-Bit SSL</span>
        </div>
      </footer>

    </div>
  );
}
