import React, { useState } from 'react';
import { ClinicalSettings } from '../types';
import { 
  User, 
  Bell, 
  Smartphone, 
  Mail, 
  Cpu, 
  ShieldAlert, 
  Check, 
  Activity, 
  Wrench,
  ShieldCheck,
  FileSpreadsheet
} from 'lucide-react';

interface SettingsViewProps {
  settings: ClinicalSettings;
  onUpdateSettings: (settings: Partial<ClinicalSettings>) => void;
}

export default function SettingsView({
  settings,
  onUpdateSettings
}: SettingsViewProps) {
  
  // Local toggles and edit helpers
  const [emailInput, setEmailInput] = useState(settings.email);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [calibrationStep, setCalibrationStep] = useState('');

  // Handle alerts updates
  const handleToggleAlert = (key: 'emailNotifications' | 'pushNotifications' | 'smsAlerts') => {
    onUpdateSettings({
      alerts: {
        ...settings.alerts,
        [key]: !settings.alerts[key]
      }
    });
  };

  // Simulated Email Profile update
  const handleEmailChange = () => {
    const freshEmail = prompt('Please enter your new institutional email address:', emailInput);
    if (freshEmail && freshEmail.includes('@')) {
      setEmailInput(freshEmail);
      onUpdateSettings({ email: freshEmail });
      alert('MedLab Security Portal: Clinician identity email has been updated.');
    } else if (freshEmail) {
      alert('Error: Please enter a valid institutional address domain.');
    }
  };

  // Simulated Password profile update
  const handlePasswordUpdate = () => {
    const currentPass = prompt('Enter your current verification passcode:');
    if (currentPass) {
      const newPass = prompt('Enter of a secure replacement password (at least 12 symbols):');
      if (newPass && newPass.length >= 12) {
        alert('MedLab Identity Manager: Critical credentials changed. Re-authenticating local keys...');
      } else if (newPass) {
        alert('Validation Failure: Replacement password contains insufficient length.');
      }
    }
  };

  // Run dynamic hardware Calibration Sequence
  const triggerRecalibration = () => {
    setIsCalibrating(true);
    setCalibrationStep('1. Initiating BLE wireless hand-shake...');

    setTimeout(() => {
      setCalibrationStep('2. Testing Compartment motors (1, 2, 3)...');
      setTimeout(() => {
        setCalibrationStep('3. Adjusting optoelectronic weight scales...');
        setTimeout(() => {
          setCalibrationStep('4. Successfully calibrated! Synced timestamp.');
          setTimeout(() => {
            setIsCalibrating(false);
            setCalibrationStep('');
            
            // Log fresh sync date
            onUpdateSettings({
              lastCalibration: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
            });
          }, 1500);
        }, 1200);
      }, 1200);
    }, 1200);
  };

  return (
    <div id="settings-tab-panel" className="space-y-6">
      
      {/* 1. VIEW MAIN HEADER */}
      <header className="pb-4 border-b border-[#c3c6d5]">
        <h2 className="text-2xl font-bold tracking-tight text-[#0f1c2d]">Settings</h2>
        <p className="text-[#434652] text-sm mt-1">Manage your administrator clinical preferences and connected diagnostic hardware elements.</p>
      </header>

      {/* 2. MAIN BENTO GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (Account Setup & Alerts, span 7) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Account Profile Section */}
          <section className="bg-white rounded-xl border border-[#c3c6d5] p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4 border-b border-[#c3c6d5] pb-3">
              <User className="w-5 h-5 text-[#003482]" />
              <h3 className="text-base font-bold text-[#0f1c2d]">Account Coordinates</h3>
            </div>

            <div className="space-y-4 text-xs">
              {/* Email domain input */}
              <div>
                <label className="block text-xs font-bold text-[#434652] mb-1">Email Address</label>
                <div className="relative">
                  <input 
                    type="email" 
                    value={emailInput} 
                    readOnly
                    className="w-full bg-[#f8f9ff] text-xs font-mono h-10 px-3 pr-20 border border-[#c3c6d5] rounded outline-none select-none text-[#0f1c2d] font-semibold"
                  />
                  <button 
                    onClick={handleEmailChange}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[#003482] font-bold hover:underline cursor-pointer"
                  >
                    Change
                  </button>
                </div>
              </div>

              {/* Password dot display */}
              <div>
                <label className="block text-xs font-bold text-[#434652] mb-1">Keyholder Passcode</label>
                <div className="relative">
                  <input 
                    type="password" 
                    value="••••••••••••••" 
                    readOnly
                    className="w-full bg-[#f8f9ff] text-xs h-10 px-3 pr-20 border border-[#c3c6d5] rounded outline-none select-none text-[#0f1c2d]"
                  />
                  <button 
                    onClick={handlePasswordUpdate}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[#003482] font-bold hover:underline cursor-pointer"
                  >
                    Update
                  </button>
                </div>
                <p className="text-[11px] text-[#737784] mt-1.5 italic">Identity token is active in connection database keys.</p>
              </div>
            </div>
          </section>

          {/* Missed Dose Notification Alerts Configuration */}
          <section className="bg-white rounded-xl border border-[#c3c6d5] p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-2 border-b border-[#c3c6d5] pb-3">
              <Bell className="w-5 h-5 text-[#003482]" />
              <h3 className="text-base font-bold text-[#0f1c2d]">Missed Dose Alerts</h3>
            </div>
            <p className="text-xs text-[#434652] mb-4">Select how you want to be notified when a patient misses a scheduled dose.</p>

            <div className="space-y-3 text-xs text-[#0f1c2d]">
              
              {/* Email alert */}
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <h4 className="font-bold text-sm">Email Notification</h4>
                  <p className="text-xs text-[#737784]">Daily digest of missed doses summary checklist.</p>
                </div>
                <button 
                  onClick={() => handleToggleAlert('emailNotifications')}
                  className={`w-12 h-6.5 rounded-full transition-colors relative cursor-pointer outline-none ${
                    settings.alerts.emailNotifications ? 'bg-[#003482]' : 'bg-[#c3c6d5]'
                  }`}
                >
                  <span className={`absolute top-0.5 w-5.5 h-5.5 rounded-full bg-white transition-all shadow-sm ${
                    settings.alerts.emailNotifications ? 'left-6' : 'left-0.5'
                  }`}></span>
                </button>
              </div>

              {/* Push Portal alert */}
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <h4 className="font-bold text-sm">Push Notification</h4>
                  <p className="text-xs text-[#737784]">Immediate popup sound alerts in clinical web portal dashboard.</p>
                </div>
                <button 
                  onClick={() => handleToggleAlert('pushNotifications')}
                  className={`w-12 h-6.5 rounded-full transition-colors relative cursor-pointer outline-none ${
                    settings.alerts.pushNotifications ? 'bg-[#003482]' : 'bg-[#c3c6d5]'
                  }`}
                >
                  <span className={`absolute top-0.5 w-5.5 h-5.5 rounded-full bg-white transition-all shadow-sm ${
                    settings.alerts.pushNotifications ? 'left-6' : 'left-0.5'
                  }`}></span>
                </button>
              </div>

              {/* SMS alert */}
              <div className="flex items-center justify-between py-3">
                <div>
                  <h4 className="font-bold text-sm">SMS Alerts</h4>
                  <p className="text-xs text-[#737784]">Critical push alerts sent directly to registered mobile devices.</p>
                </div>
                <button 
                  onClick={() => handleToggleAlert('smsAlerts')}
                  className={`w-12 h-6.5 rounded-full transition-colors relative cursor-pointer outline-none ${
                    settings.alerts.smsAlerts ? 'bg-[#003482]' : 'bg-[#c3c6d5]'
                  }`}
                >
                  <span className={`absolute top-0.5 w-5.5 h-5.5 rounded-full bg-white transition-all shadow-sm ${
                    settings.alerts.smsAlerts ? 'left-6' : 'left-0.5'
                  }`}></span>
                </button>
              </div>

            </div>
          </section>

        </div>

        {/* Right Column (Connected Hardware Calibration, span 5) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <section className="bg-white border border-[#c3c6d5] rounded-xl p-6 shadow-sm h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4 border-b border-[#c3c6d5] pb-3">
                <Cpu className="w-5 h-5 text-[#003482]" />
                <h3 className="text-base font-bold text-[#0f1c2d]">Connected Hardware</h3>
              </div>

              {/* Animated Hardware Badge preview */}
              <div className="bg-[#eff4ff] border border-[#d6e3fb] p-6 rounded-lg flex flex-col items-center justify-center text-center relative overflow-hidden mb-6">
                <span className="absolute top-3 right-3 bg-[#91f8ad] text-[#00743b] text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-[#00743b] rounded-full inline-block"></span>
                  Online
                </span>

                <div className="w-14 h-14 bg-white border border-[#c3c6d5] text-[#003482] rounded-full flex items-center justify-center shadow-xs mb-3">
                  <Activity className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-[#0f1c2d]">Smart Dispenser Pro</h4>
                <p className="text-xs text-[#434652] mt-1">Unit active in Clinical Ward 3B</p>
              </div>

              {/* Technical credentials lists */}
              <div className="space-y-3.5 text-xs text-[#0f1c2d] border-t border-gray-100 pt-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-[#434652] font-semibold uppercase text-[10px] tracking-wider">Hardware ID</span>
                  <span className="font-mono font-bold text-gray-800">{settings.hardwareId}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-[#434652] font-semibold uppercase text-[10px] tracking-wider">Firmware</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-800">{settings.firmware}</span>
                    <span className="bg-[#eff4ff] border border-[#003482]/20 text-[#003482] font-extrabold text-[10px] px-1.5 py-0.5 rounded">Up To Date</span>
                  </div>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-[#434652] font-semibold uppercase text-[10px] tracking-wider">Last Calibration</span>
                  <span className="font-semibold text-[#0f1c2d]">{settings.lastCalibration}</span>
                </div>
              </div>
            </div>

            {/* Microcalibration trigger control */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              
              {isCalibrating ? (
                <div className="bg-[#f8f9ff] text-center border border-[#003482]/20 p-4 rounded-lg space-y-2 animate-pulse">
                  <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#003482]">
                    <Wrench className="w-4 h-4 animate-spin text-[#003482]" />
                    <span>Executing Sensor Calibration Test...</span>
                  </div>
                  <p className="text-[10px] text-[#737784] font-semibold">{calibrationStep}</p>
                </div>
              ) : (
                <button 
                  onClick={triggerRecalibration}
                  className="w-full bg-[#f8f9ff] hover:bg-[#eff4ff] border-2 border-[#003482] text-[#003482] font-bold py-2.5 rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 duration-150 transition-all font-sans"
                >
                  <Wrench className="w-4 h-4 text-[#003482]" />
                  Recalibrate Dispenser
                </button>
              )}

              <p className="text-[10px] text-center text-[#737784] italic mt-2.5">
                Note: Recalibration tests physical scale elements and requires nearby dispenser BLE presence.
              </p>
            </div>
          </section>
        </div>

      </div>

    </div>
  );
}
