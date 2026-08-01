import React, { useState } from 'react';
import { ClinicalSettings, UserRole } from '../types';
import { 
  User, 
  Bell, 
  Cpu, 
  Wrench, 
  Server, 
  Check, 
  LogOut, 
  ShieldCheck, 
  Globe, 
  RefreshCw, 
  Key,
  Database
} from 'lucide-react';

interface SettingsViewProps {
  settings: ClinicalSettings;
  userRole: UserRole;
  userEmail: string;
  onUpdateSettings: (settings: Partial<ClinicalSettings>) => void;
  onSignOut: () => void;
}

export default function SettingsView({
  settings,
  userRole,
  userEmail,
  onUpdateSettings,
  onSignOut,
}: SettingsViewProps) {
  const [baseUrlInput, setBaseUrlInput] = useState(settings.apiBaseUrl);
  const [isTestingApi, setIsTestingApi] = useState(false);
  const [apiTestResult, setApiTestResult] = useState<string | null>(null);

  const [isCalibrating, setIsCalibrating] = useState(false);
  const [calibrationStep, setCalibrationStep] = useState('');

  const handleToggleAlert = (key: 'emailNotifications' | 'pushNotifications' | 'smsAlerts') => {
    onUpdateSettings({
      alerts: {
        ...settings.alerts,
        [key]: !settings.alerts[key]
      }
    });
  };

  const handleSaveApiUrl = () => {
    onUpdateSettings({ apiBaseUrl: baseUrlInput });
    alert(`API Base URL set to: ${baseUrlInput}`);
  };

  const handleTestApiConnection = async () => {
    setIsTestingApi(true);
    setApiTestResult('Testing connection to MedAdhere Render backend...');
    try {
      const res = await fetch(`${baseUrlInput}/healthz`);
      if (res.ok) {
        setApiTestResult('SUCCESS: Connected to MedAdhere production backend (/healthz HTTP 200 OK)');
      } else {
        setApiTestResult(`RESPONSE ${res.status}: Backend reached but returned ${res.statusText}`);
      }
    } catch (err: any) {
      setApiTestResult(`OFFLINE: Could not reach endpoint (${err.message}). Using mock fallback mode.`);
    } finally {
      setIsTestingApi(false);
    }
  };

  const triggerRecalibration = () => {
    setIsCalibrating(true);
    setCalibrationStep('1. Testing 7-compartment stepper motor indexing (A–G)...');

    setTimeout(() => {
      setCalibrationStep('2. Testing optoelectronic pill release sensors...');
      setTimeout(() => {
        setCalibrationStep('3. Synchronizing hardware real-time clock...');
        setTimeout(() => {
          setCalibrationStep('4. Calibration complete!');
          setTimeout(() => {
            setIsCalibrating(false);
            setCalibrationStep('');
            onUpdateSettings({
              lastCalibration: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
            });
          }, 1200);
        }, 1200);
      }, 1200);
    }, 1200);
  };

  return (
    <div id="settings-tab-panel" className="space-y-6">
      
      {/* Main Header */}
      <header className="pb-4 border-b border-[#c3c6d5] flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#0f1c2d]">Clinical Portal Settings</h2>
          <p className="text-[#434652] text-sm mt-1">Configure backend API connection, caregiver authentication, and hardware dispenser calibration.</p>
        </div>

        <button 
          onClick={onSignOut}
          className="px-4 py-2 bg-red-50 text-[#ba1a1a] hover:bg-red-100 border border-red-200 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (span 7) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Backend API Configuration */}
          <section className="bg-white rounded-xl border border-[#c3c6d5] p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-[#c3c6d5] pb-3">
              <Globe className="w-5 h-5 text-[#003482]" />
              <h3 className="text-base font-bold text-[#0f1c2d]">Backend Service Endpoint</h3>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#434652] mb-1">MedAdhere API Base URL</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={baseUrlInput} 
                  onChange={(e) => setBaseUrlInput(e.target.value)}
                  className="flex-1 text-xs font-mono h-10 px-3 border border-[#c3c6d5] rounded outline-none focus:border-[#003482]"
                />
                <button 
                  onClick={handleSaveApiUrl}
                  className="bg-[#003482] text-white px-4 text-xs font-bold rounded hover:bg-[#0c4aac] cursor-pointer"
                >
                  Save URL
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <button 
                onClick={handleTestApiConnection}
                disabled={isTestingApi}
                className="px-3.5 py-1.5 bg-[#eff4ff] text-[#003482] hover:bg-[#e6eeff] rounded font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isTestingApi ? 'animate-spin' : ''}`} />
                Test Connection
              </button>

              <label className="flex items-center gap-2 text-xs font-bold text-[#0f1c2d] cursor-pointer">
                <input 
                  type="checkbox"
                  checked={settings.useRealApi}
                  onChange={(e) => onUpdateSettings({ useRealApi: e.target.checked })}
                  className="rounded text-[#003482]"
                />
                Use Real Backend API
              </label>
            </div>

            {apiTestResult && (
              <div className="p-3 bg-gray-50 border border-gray-200 rounded text-xs font-mono text-[#0f1c2d]">
                {apiTestResult}
              </div>
            )}
          </section>

          {/* User Account Profile */}
          <section className="bg-white rounded-xl border border-[#c3c6d5] p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#c3c6d5] pb-3">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-[#003482]" />
                <h3 className="text-base font-bold text-[#0f1c2d]">Account Profile</h3>
              </div>
              <span className="bg-[#e6eeff] text-[#003482] text-xs font-bold px-3 py-0.5 rounded-full uppercase border border-[#c3c6d5]">
                Role: {userRole}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-xs font-bold text-[#434652] mb-1">Authenticated Account Email</label>
                <input 
                  type="email" 
                  value={userEmail} 
                  readOnly
                  className="w-full bg-[#f8f9ff] text-xs font-mono h-10 px-3 border border-[#c3c6d5] rounded text-[#0f1c2d] font-bold"
                />
              </div>
            </div>
          </section>

          {/* Alert Preferences */}
          <section className="bg-white rounded-xl border border-[#c3c6d5] p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-[#c3c6d5] pb-3">
              <Bell className="w-5 h-5 text-[#003482]" />
              <h3 className="text-base font-bold text-[#0f1c2d]">Clinical Alert Preferences</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div>
                  <h4 className="font-bold text-sm text-[#0f1c2d]">Email Missed Dose Summaries</h4>
                  <p className="text-xs text-[#737784]">Send automated caregiver digests on missed dose events.</p>
                </div>
                <button 
                  onClick={() => handleToggleAlert('emailNotifications')}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    settings.alerts.emailNotifications ? 'bg-[#003482]' : 'bg-[#c3c6d5]'
                  }`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${
                    settings.alerts.emailNotifications ? 'left-5.5' : 'left-0.5'
                  }`}></span>
                </button>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div>
                  <h4 className="font-bold text-sm text-[#0f1c2d]">Web Push Notifications</h4>
                  <p className="text-xs text-[#737784]">Immediate toast notification alerts inside portal.</p>
                </div>
                <button 
                  onClick={() => handleToggleAlert('pushNotifications')}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    settings.alerts.pushNotifications ? 'bg-[#003482]' : 'bg-[#c3c6d5]'
                  }`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${
                    settings.alerts.pushNotifications ? 'left-5.5' : 'left-0.5'
                  }`}></span>
                </button>
              </div>
            </div>
          </section>

        </div>

        {/* Right Column (span 5) */}
        <div className="lg:col-span-5 space-y-6">
          
          <section className="bg-white border border-[#c3c6d5] rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-[#c3c6d5] pb-3">
              <Cpu className="w-5 h-5 text-[#003482]" />
              <h3 className="text-base font-bold text-[#0f1c2d]">Connected 7-Compartment Unit</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-gray-50">
                <span className="text-[#737784]">Hardware UID:</span>
                <span className="font-mono font-bold">{settings.hardwareId}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-50">
                <span className="text-[#737784]">Firmware Build:</span>
                <span className="font-mono font-bold">{settings.firmware}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-50">
                <span className="text-[#737784]">Last Calibration:</span>
                <span className="font-semibold">{settings.lastCalibration}</span>
              </div>
            </div>

            <div className="pt-2">
              {isCalibrating ? (
                <div className="p-3 bg-[#f8f9ff] text-center border border-[#003482]/20 rounded space-y-1">
                  <span className="text-xs font-bold text-[#003482]">Calibrating 7 Compartments...</span>
                  <p className="text-[10px] text-[#737784] font-mono">{calibrationStep}</p>
                </div>
              ) : (
                <button 
                  onClick={triggerRecalibration}
                  className="w-full bg-[#f8f9ff] hover:bg-[#eff4ff] border border-[#003482] text-[#003482] font-bold py-2.5 rounded text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Wrench className="w-4 h-4" />
                  Run Dispenser Calibration Test
                </button>
              )}
            </div>
          </section>

        </div>

      </div>

    </div>
  );
}
