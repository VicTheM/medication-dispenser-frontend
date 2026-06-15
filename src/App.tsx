import React, { useState, useEffect } from 'react';
import { 
  OnboardingState, 
  Medication, 
  ActivityLog, 
  Vitals, 
  VerificationLog, 
  ClinicalSettings 
} from './types';
import { 
  INITIAL_MEDICATIONS, 
  INITIAL_ACTIVITY_LOGS, 
  INITIAL_VITALS, 
  INITIAL_VERIFICATION_LOGS, 
  INITIAL_SETTINGS 
} from './mockData';

// Subcomponents named imports
import OnboardingFlow from './components/OnboardingFlow';
import Navigation from './components/Navigation';
import DashboardView from './components/DashboardView';
import MedicationsView from './components/MedicationsView';
import AdherenceView from './components/AdherenceView';
import SettingsView from './components/SettingsView';

export default function App() {
  
  // 1. STATE INITIALIZATION (Syncing from LocalStorage if preset)
  const [onboarding, setOnboarding] = useState<OnboardingState>(() => {
    const saved = localStorage.getItem('medlab_onboarding');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore fallback
      }
    }
    return {
      step: 1,
      firstName: 'Clinician',
      lastName: 'Smith',
      email: 'clinician@medlab.org',
      isCompleted: false
    };
  });

  const [medications, setMedications] = useState<Medication[]>(() => {
    const saved = localStorage.getItem('medlab_med_list');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore fallback
      }
    }
    return INITIAL_MEDICATIONS;
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('medlab_activity_logs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore fallback
      }
    }
    return INITIAL_ACTIVITY_LOGS;
  });

  const [vitals, setVitals] = useState<Vitals>(() => {
    const saved = localStorage.getItem('medlab_vitals');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore fallback
      }
    }
    return INITIAL_VITALS;
  });

  const [verificationLogs, setVerificationLogs] = useState<VerificationLog[]>(() => {
    const saved = localStorage.getItem('medlab_verifications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore fallback
      }
    }
    return INITIAL_VERIFICATION_LOGS;
  });

  const [settings, setSettings] = useState<ClinicalSettings>(() => {
    const saved = localStorage.getItem('medlab_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore fallback
      }
    }
    return INITIAL_SETTINGS;
  });

  // Active portal tab router ('dashboard' | 'medications' | 'adherence' | 'settings')
  const [activeTab, setActiveTab2] = useState<'dashboard' | 'medications' | 'adherence' | 'settings'>('dashboard');
  
  // Shared quick modal trigger
  const [showAddMedModal, setShowAddMedModal] = useState(false);

  // 2. PERSISTENCE PERSIST TRIGGER EFFECT HOOKS
  useEffect(() => {
    localStorage.setItem('medlab_onboarding', JSON.stringify(onboarding));
  }, [onboarding]);

  useEffect(() => {
    localStorage.setItem('medlab_med_list', JSON.stringify(medications));
  }, [medications]);

  useEffect(() => {
    localStorage.setItem('medlab_activity_logs', JSON.stringify(activityLogs));
  }, [activityLogs]);

  useEffect(() => {
    localStorage.setItem('medlab_vitals', JSON.stringify(vitals));
  }, [vitals]);

  useEffect(() => {
    localStorage.setItem('medlab_verifications', JSON.stringify(verificationLogs));
  }, [verificationLogs]);

  useEffect(() => {
    localStorage.setItem('medlab_settings', JSON.stringify(settings));
  }, [settings]);


  // 3. ACTION EVENT HANDLERS (Interconnected across views)

  // On onboarding register forms submit
  const handleOnboardingComplete = (data: { firstName: string; lastName: string; email: string }) => {
    setOnboarding({
      step: 3,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      isCompleted: true
    });
    // Synced profile settings
    setSettings((prev) => ({
      ...prev,
      email: data.email
    }));
    // Take clinician to Dashboard directly
    setActiveTab2('dashboard');
  };

  // Skip dose trigger
  const handleSkipDose = (medId: string) => {
    const targetMed = medications.find(m => m.id === medId);
    if (!targetMed) return;

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Add skipped activity log
    const newLog: ActivityLog = {
      id: `act-${Date.now()}`,
      timestamp: `Today, ${timeString}`,
      text: `Clinical trigger: Skipping Next Dose for ${targetMed.name} ${targetMed.dosage}.`
    };

    setActivityLogs((prev) => [newLog, ...prev]);
    alert(`Clinical Note: Next scheduled ${targetMed.name} medication intake has been marked as deferred/skipped.`);
  };

  // Dispense now action event (decrements compartment inventory, appends timeline, adds verification log)
  const handleDispenseMedication = (medId: string) => {
    setMedications((prev) => 
      prev.map((med) => {
        if (med.id === medId) {
          return {
            ...med,
            totalLeft: Math.max(0, med.totalLeft - 1)
          };
        }
        return med;
      })
    );

    const targetMed = medications.find(m => m.id === medId);
    if (!targetMed) return;

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Create successful timeline event log
    const newLogItem: ActivityLog = {
      id: `act-${Date.now()}`,
      timestamp: `Today, ${timeString}`,
      text: `${targetMed.name} ${targetMed.dosage} dispensed successfully.`
    };
    setActivityLogs((prev) => [newLogItem, ...prev]);

    // Create fresh taken verification report logs check
    const newVerification: VerificationLog = {
      id: `ver-${Date.now()}`,
      status: 'Taken',
      timestamp: `Today, ${timeString}`,
      timeOfDay: timeString,
      medName: targetMed.name,
      dosage: targetMed.dosage,
      pills: 1,
      hasVideo: true,
      cardPhotoUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      aiVerifiedText: 'AI Verified: Pill Detected'
    };
    setVerificationLogs((prev) => [newVerification, ...prev]);
  };

  // Add customized synchronized drug scheduler records from the input Modal popup
  const handleAddMedication = (newMed: Omit<Medication, 'id' | 'status'>) => {
    const medItem: Medication = {
      ...newMed,
      id: `med-${Date.now()}`,
      status: 'Active'
    };
    setMedications((prev) => [...prev, medItem]);

    // timeline update
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const logItem: ActivityLog = {
      id: `act-${Date.now()}`,
      timestamp: `Today, ${timeString}`,
      text: `Sync Success: Refilled Compartment ${newMed.compartment} with ${newMed.name} database.`
    };
    setActivityLogs((prev) => [logItem, ...prev]);
  };

  // Toggle checklist states manually
  const handleToggleScheduleItem = (medId: string, timeIndex: number) => {
    // Simply informs completion overrides
    alert('MedLab Schedules override: Dispensing slots adjusted.');
  };

  // Real-time vital changes
  const handleUpdateVitals = (freshVitals: Partial<Vitals>) => {
    setVitals((prev) => ({
      ...prev,
      ...freshVitals
    }));
    
    // Create vital status edit track record
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const logItem: ActivityLog = {
      id: `act-${Date.now()}`,
      timestamp: `Today, ${timeString}`,
      text: `Vitals calibrated: Clinical status metrics adjusted to BP ${freshVitals.bloodPressure || vitals.bloodPressure}.`
    };
    setActivityLogs((prev) => [logItem, ...prev]);
  };

  // Settings updating
  const handleUpdateSettings = (freshSettings: Partial<ClinicalSettings>) => {
    setSettings((prev) => ({
      ...prev,
      ...freshSettings
    }));
  };

  // Support clinical CSV exports simulation trigger
  const handleExportCSV = () => {
    // logs timeline event
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const logItem: ActivityLog = {
      id: `act-${Date.now()}`,
      timestamp: `Today, ${timeString}`,
      text: 'Clinical database integrity audit csv report generated successfully.'
    };
    setActivityLogs((prev) => [logItem, ...prev]);
  };

  // Return to Onboarding flow / Reset portal values
  const handleSignOut = () => {
    const confirmSignOut = window.confirm('MedLab Identity Portal: Are you sure you want to sign out and clear local clinical device configuration coordinates?');
    if (confirmSignOut) {
      setOnboarding({
        step: 1,
        firstName: '',
        lastName: '',
        email: '',
        isCompleted: false
      });
      // Reset variables locally
      setMedications(INITIAL_MEDICATIONS);
      setActivityLogs(INITIAL_ACTIVITY_LOGS);
      setVitals(INITIAL_VITALS);
      setVerificationLogs(INITIAL_VERIFICATION_LOGS);
      setSettings(INITIAL_SETTINGS);
      setActiveTab2('dashboard');
      localStorage.clear();
    }
  };

  // 4. MAIN RENDER DIRECTIVES
  if (!onboarding.isCompleted) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  // Active Screen Selector mapping helper
  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView 
            medications={medications}
            activityLogs={activityLogs}
            vitals={vitals}
            onDispenseMedication={handleDispenseMedication}
            onSkipMedication={handleSkipDose}
            onToggleScheduleItem={handleToggleScheduleItem}
            onUpdateVitals={handleUpdateVitals}
          />
        );
      case 'medications':
        return (
          <MedicationsView 
            medications={medications}
            onAddMedication={handleAddMedication}
            showAddModal={showAddMedModal}
            setShowAddModal={setShowAddMedModal}
          />
        );
      case 'adherence':
        return (
          <AdherenceView 
            verificationLogs={verificationLogs}
            onExportCSV={handleExportCSV}
          />
        );
      case 'settings':
        return (
          <SettingsView 
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div id="medlab-application-root" className="bg-[#f8f9ff] text-[#0f1c2d] min-h-screen font-sans flex flex-col md:flex-row">
      
      {/* Dynamic Navigation Sidebar & mobile bars */}
      <Navigation 
        currentTab={activeTab}
        onChangeTab={setActiveTab2}
        onNewPrescription={() => {
          setActiveTab2('medications');
          setShowAddMedModal(true);
        }}
        onSignOut={handleSignOut}
        userEmail={onboarding.email}
      />

      {/* Main clinical workspace areas */}
      <main id="clinical-workspace-main" className="flex-1 md:ml-64 p-4 md:p-[32px] max-w-[1440px] w-full pt-20 md:pt-[32px] pb-[80px] md:pb-[32px]">
        {renderActiveScreen()}
      </main>

    </div>
  );
}
