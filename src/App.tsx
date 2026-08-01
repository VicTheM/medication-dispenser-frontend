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

import { api } from './lib/api';
import { INITIAL_VITALS, INITIAL_ACTIVITY_LOGS, INITIAL_SETTINGS } from './lib/constants';

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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<UserRole>('caregiver');
  const [userEmail, setUserEmail] = useState<string>('');
  const [userName, setUserName] = useState<string>('');

  // Navigation
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  // Multi-patient Data
  const [patients, setPatients] = useState<PatientUser[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');

  // Patient-specific state
  const [device, setDevice] = useState<DeviceStatus | null>(null);
  const [medications, setMedications] = useState<MedicationRecord[]>([]);
  const [schedules, setSchedules] = useState<ScheduleRecord[]>([]);
  const [dispenseLogs, setDispenseLogs] = useState<DispenseEventRecord[]>([]);
  const [videos, setVideos] = useState<AdherenceVideoRecord[]>([]);
  const [telemetry, setTelemetry] = useState<TelemetryRecord[]>([]);
  const [voiceInteractions, setVoiceInteractions] = useState<VoiceInteractionRecord[]>([]);
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [knowledgeDocs, setKnowledgeDocs] = useState<KnowledgeDocRecord[]>([]);

  // App vitals & settings
  const [vitals, setVitals] = useState<Vitals>(INITIAL_VITALS);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(INITIAL_ACTIVITY_LOGS);
  const [settings, setSettings] = useState<ClinicalSettings>(INITIAL_SETTINGS);

  const currentPatient = patients.find(p => p.id === selectedPatientId) || null;

  // Sync settings API Base URL with API client
  useEffect(() => {
    api.setBaseUrl(settings.apiBaseUrl);
  }, [settings.apiBaseUrl]);

  // Initial backend data load
  useEffect(() => {
    async function loadBackendData() {
      try {
        const pRes = await api.listPatients();
        if (pRes.data && pRes.data.length > 0) {
          setPatients(pRes.data);
          setSelectedPatientId(pRes.data[0].id);
        }
      } catch (err) {
        console.error('Failed to load patients from API.', err);
      }
    }
    loadBackendData();
  }, []);

  // Load patient details function
  const loadPatientDetails = async () => {
    if (!selectedPatientId) return;
    try {
      const [medsRes, schsRes, devRes, dispsRes, notifsRes, videosRes, telemetryRes, voiceRes, docsRes] = await Promise.all([
        api.listMedications(selectedPatientId),
        api.listSchedules(selectedPatientId),
        api.getPatientDevice(selectedPatientId),
        api.listDispenseLogs(selectedPatientId),
        api.listNotifications(selectedPatientId),
        api.listAdherenceVideos(selectedPatientId),
        api.listTelemetry(selectedPatientId),
        api.listVoiceInteractions(selectedPatientId),
        api.listKnowledgeDocs()
      ]);

      if (medsRes.data) setMedications(medsRes.data);
      if (schsRes.data) setSchedules(schsRes.data);
      if (devRes.data) setDevice(devRes.data);
      if (dispsRes.data) setDispenseLogs(dispsRes.data);
      if (notifsRes.data) setNotifications(notifsRes.data);
      if (videosRes.data) setVideos(videosRes.data);
      if (telemetryRes.data) setTelemetry(telemetryRes.data);
      if (voiceRes.data) setVoiceInteractions(voiceRes.data);
      if (docsRes.data) setKnowledgeDocs(docsRes.data);
    } catch (err) {
      console.error('Failed to load patient details from API.', err);
    }
  };

  useEffect(() => {
    loadPatientDetails();
  }, [selectedPatientId]);

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
      const res = await api.enrolPatient({
        full_name: patient.full_name || 'New Patient',
        date_of_birth: patient.date_of_birth,
        phone: patient.phone,
        email: patient.email,
        notes: patient.notes,
        timezone: patient.timezone || 'America/New_York'
      });
      if (res.data) {
        setPatients(prev => [res.data!, ...prev]);
        setSelectedPatientId(res.data.id);
        alert(`Patient ${res.data.full_name} enrolled successfully.`);
      } else if (res.error) {
        alert(`Enrollment error: ${res.error}`);
      }
    } catch (err: any) {
      alert(`Enrollment failed: ${err.message}`);
    }
  };

  const handleUpdatePatient = async (patientId: string, data: Partial<PatientUser>) => {
    try {
      const res = await api.updatePatient(patientId, data);
      if (res.data) {
        setPatients(prev => prev.map(p => p.id === patientId ? res.data! : p));
      }
      alert('Patient details updated.');
    } catch (e: any) {
      alert(`Update failed: ${e.message}`);
    }
  };

  const handleDeletePatient = async (patientId: string) => {
    if (!confirm('Are you sure you want to remove this patient from your roster?')) return;
    try {
      await api.deletePatient(patientId);
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
    const res = await api.createMedication(selectedPatientId, data);
    if (res.data) setMedications(prev => [res.data!, ...prev]);
    return res;
  };

  const handleDeleteMedication = async (medicationId: string) => {
    await api.deleteMedication(medicationId);
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
    const res = await api.createSchedule(selectedPatientId, data);
    if (res.data) {
      setSchedules(prev => prev.map(s => s.compartment === res.data!.compartment ? res.data! : s));
    }
    return res;
  };

  const handleDeleteSchedule = async (scheduleId: string) => {
    await api.deleteSchedule(scheduleId);
    setSchedules(prev => prev.map(s => s.id === scheduleId ? { ...s, active: false } : s));
  };

  const handleForceSyncSchedule = async () => {
    const res = await api.forceSyncSchedule(selectedPatientId);
    alert('Schedules forcibly synchronized to ESP32 dispenser.');
    return res;
  };

  // Hardware Device handlers
  const handleAssignDevice = async (deviceUid: string) => {
    const res = await api.assignDevice(selectedPatientId, deviceUid);
    if (res.data) {
      setDevice(res.data);
      alert(`Hardware Dispenser UID ${res.data.device_uid} assigned to patient.`);
      return res.data;
    }
    throw new Error(res.error || 'Failed to assign device.');
  };

  const handleSendCommand = async (deviceUid: string, commandType: string, payload?: Record<string, any>) => {
    const result = await api.sendDeviceCommand(deviceUid, commandType, payload);
    alert(`Hardware Command sent: ${result.data?.status || 'Success'}`);
    return result;
  };

  // AI Assistant handlers
  const handleAskQuestion = async (question: string) => {
    const res = await api.askAiQuestion(question);
    if (res.data) return res.data;
    throw new Error(res.error || 'AI Query Failed');
  };

  const handleAskVoice = async (audioBlob: Blob) => {
    const res = await api.askAiVoice(audioBlob);
    if (res.data) return res.data;
    throw new Error(res.error || 'Voice AI Query Failed');
  };

  const handleUploadKnowledge = async (file: File) => {
    const res = await api.uploadKnowledgeDoc(file);
    if (res.data) setKnowledgeDocs(prev => [res.data!, ...prev]);
    return res;
  };

  const handleReingestKnowledge = async () => {
    return await api.reingestKnowledge();
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
              dispenseLogs={dispenseLogs}
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
              voiceInteractions={voiceInteractions}
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
