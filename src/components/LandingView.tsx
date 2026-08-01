import React, { useState } from 'react';
import { 
  Activity, 
  ShieldCheck, 
  Cpu, 
  Pill, 
  Bot, 
  Users, 
  Video, 
  Wifi, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Play, 
  Sparkles, 
  Lock, 
  FileText, 
  Zap,
  Volume2,
  Camera,
  Layers,
  Clock,
  ChevronRight,
  Sliders,
  Award
} from 'lucide-react';

interface LandingViewProps {
  onLaunchPortal: (role?: 'caregiver' | 'patient') => void;
}

export default function LandingView({ onLaunchPortal }: LandingViewProps) {
  const [activeSlot, setActiveSlot] = useState<number>(0);
  const [simulatedDispensing, setSimulatedDispensing] = useState<boolean>(false);
  const [dispenseLog, setDispenseLog] = useState<string | null>(null);

  const slotData = [
    { slot: 1, day: 'Monday', med: 'Lisinopril 10mg + Metformin 500mg', time: '08:00 AM', status: 'ready', color: 'bg-emerald-500' },
    { slot: 2, day: 'Tuesday', med: 'Lisinopril 10mg + Atorvastatin 20mg', time: '08:00 AM', status: 'ready', color: 'bg-emerald-500' },
    { slot: 3, day: 'Wednesday', med: 'Lisinopril 10mg + Metformin 500mg', time: '08:00 AM', status: 'ready', color: 'bg-emerald-500' },
    { slot: 4, day: 'Thursday', med: 'Lisinopril 10mg + Vitamin D3', time: '08:00 AM', status: 'ready', color: 'bg-emerald-500' },
    { slot: 5, day: 'Friday', med: 'Lisinopril 10mg + Metformin 500mg', time: '08:00 AM', status: 'ready', color: 'bg-emerald-500' },
    { slot: 6, day: 'Saturday', med: 'Lisinopril 10mg + Atorvastatin 20mg', time: '08:00 AM', status: 'ready', color: 'bg-emerald-500' },
    { slot: 7, day: 'Sunday', med: 'Lisinopril 10mg + Multi-Vitamin', time: '08:00 AM', status: 'ready', color: 'bg-emerald-500' },
  ];

  const handleSimulateDispense = () => {
    setSimulatedDispensing(true);
    setDispenseLog('Rotating Carousel Stepper Motor to Compartment ' + (activeSlot + 1) + '...');
    
    setTimeout(() => {
      setDispenseLog('Optocoupler confirmed alignment. Actuating Solenoid Gate...');
    }, 1200);

    setTimeout(() => {
      setDispenseLog('Acoustic Sensor verified pill drop. Video clip #DISP-8842 recorded (5.2s).');
      setSimulatedDispensing(false);
    }, 2600);
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0f1c2d] flex flex-col font-sans antialiased">
      
      {/* Top Banner Announcement */}
      <div className="bg-[#003482] text-white px-4 py-2 text-center text-xs font-medium flex items-center justify-center gap-2 shadow-xs">
        <span className="bg-[#91f8ad] text-[#004d25] px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider">
          Clinical Grade
        </span>
        <span>MedLab 7-Compartment Dispenser v3.4 Firmware Released with Gemini Ally AI Integration</span>
        <ArrowRight className="w-3.5 h-3.5 text-[#91f8ad]" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 md:px-8 max-w-7xl mx-auto w-full overflow-hidden">
        {/* Decorative Grid Backdrop */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#eff4ff] border border-[#003482]/20 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#003482]">
              <Activity className="w-4 h-4 text-[#006d37]" />
              <span>MedLab Hardware & Clinical Adherence System</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#0f1c2d] leading-[1.1]">
              Zero-Defect <span className="text-[#003482] underline decoration-[#91f8ad] decoration-4 underline-offset-4">7-Compartment</span> Smart Medication Dispensing.
            </h1>

            <p className="text-base sm:text-lg text-[#434755] leading-relaxed max-w-2xl font-normal">
              Combining automated stepper motor carousel hardware, dual acoustic drop verification, micro-camera adherence video recording, and real-time Gemini AI clinical oversight.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => onLaunchPortal('caregiver')}
                className="bg-[#003482] hover:bg-[#0c4aac] text-white px-6 py-3.5 rounded-xl font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer group"
              >
                <span>Launch Caregiver Portal</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onLaunchPortal('patient')}
                className="bg-white hover:bg-gray-50 text-[#003482] border-2 border-[#003482] px-6 py-3.5 rounded-xl font-extrabold text-sm transition-all flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Users className="w-4 h-4 text-[#006d37]" />
                <span>Launch Patient View</span>
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-[#c3c6d5]/50 w-full max-w-lg">
              <div>
                <p className="text-2xl font-black text-[#003482]">99.8%</p>
                <p className="text-xs text-[#737784] font-semibold mt-0.5">Adherence Rate</p>
              </div>
              <div>
                <p className="text-2xl font-black text-[#006d37]">7 Slots</p>
                <p className="text-xs text-[#737784] font-semibold mt-0.5">Physical Compartments</p>
              </div>
              <div>
                <p className="text-2xl font-black text-[#003482]">24/7</p>
                <p className="text-xs text-[#737784] font-semibold mt-0.5">Gemini Clinical AI</p>
              </div>
            </div>
          </div>

          {/* Hero Right Visual: Interactive Hardware Dispenser Replica */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md bg-white border-2 border-[#003482]/20 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
              {/* Device Header */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-[#0f1c2d] tracking-wide">MEDLAB-DISP-7X</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] bg-[#eff4ff] text-[#003482] font-mono px-2.5 py-1 rounded-full border border-[#003482]/20">
                  <Wifi className="w-3 h-3 text-[#006d37]" />
                  <span>ESP32-ONLINE</span>
                </div>
              </div>

              {/* Simulated Hardware LCD Screen */}
              <div className="bg-[#0f1c2d] text-emerald-400 p-4 rounded-xl font-mono text-xs mb-5 shadow-inner border border-emerald-900/50 relative overflow-hidden">
                <div className="absolute top-2 right-2 text-[9px] text-emerald-500/80 uppercase font-sans font-bold">LCD Display (20x4)</div>
                <div className="flex justify-between items-center text-[11px] text-white/90 border-b border-emerald-900/40 pb-1 mb-2">
                  <span>MEDLAB DISPENSER v3.4</span>
                  <span>14:30:12</span>
                </div>
                <p className="text-emerald-300 font-bold">NEXT DOSAGE: {slotData[activeSlot].day} {slotData[activeSlot].time}</p>
                <p className="text-emerald-200 text-[11px] mt-1 truncate">MED: {slotData[activeSlot].med}</p>
                <div className="mt-2 text-[10px] text-emerald-400/80 flex justify-between">
                  <span>SLOT: #{activeSlot + 1} (COMP-0{activeSlot + 1})</span>
                  <span className="text-emerald-300">STATUS: READY</span>
                </div>
              </div>

              {/* 7-Slot Carousel Visualiser */}
              <div className="mb-5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-[#737784] uppercase tracking-wider">7-Compartment Carousel</span>
                  <span className="text-xs text-[#003482] font-semibold">Select Slot to Inspect</span>
                </div>
                <div className="grid grid-cols-7 gap-1.5">
                  {slotData.map((s, idx) => (
                    <button
                      key={s.slot}
                      onClick={() => setActiveSlot(idx)}
                      className={`p-2 rounded-xl text-center border-2 transition-all cursor-pointer ${
                        activeSlot === idx 
                          ? 'border-[#003482] bg-[#eff4ff] ring-2 ring-[#003482]/20 scale-105' 
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="text-[10px] font-extrabold text-gray-500">{s.day.substring(0, 3)}</div>
                      <div className={`w-3 h-3 mx-auto my-1 rounded-full ${s.color}`} />
                      <div className="text-[10px] font-mono font-bold text-[#0f1c2d]">#{s.slot}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dispense Action Control */}
              <div className="space-y-3">
                <button
                  onClick={handleSimulateDispense}
                  disabled={simulatedDispensing}
                  className="w-full bg-[#006d37] hover:bg-[#004d25] disabled:bg-gray-400 text-white font-extrabold text-xs py-3 px-4 rounded-xl shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  {simulatedDispensing ? (
                    <>
                      <Zap className="w-4 h-4 animate-spin text-white" />
                      <span>Actuating Stepper Motor...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>Simulate Dispense Trigger (Slot #{activeSlot + 1})</span>
                    </>
                  )}
                </button>

                {/* Live Hardware Feedback Log */}
                {dispenseLog && (
                  <div className="bg-gray-50 border border-gray-200 p-2.5 rounded-lg text-[11px] font-mono text-gray-700 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{dispenseLog}</span>
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Hardware Architecture Feature Grid */}
      <section className="py-16 px-4 md:px-8 bg-white border-y border-[#c3c6d5]/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 bg-[#eff4ff] text-[#003482] px-3 py-1 rounded-full text-xs font-bold mb-3">
              <Cpu className="w-4 h-4" />
              <span>Embedded Hardware Architecture</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0f1c2d] tracking-tight">
              Built for Uncompromising Reliability in Home & Clinical Care
            </h2>
            <p className="text-sm sm:text-base text-[#737784] mt-2">
              Every detail of the MedLab 7-Compartment unit is designed to prevent missed doses, double dispensations, or unauthorized access.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <div className="bg-[#f8f9ff] border border-[#c3c6d5]/60 rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#003482] text-white rounded-xl flex items-center justify-center mb-4">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-[#0f1c2d] mb-2">7 Motorized Compartments</h3>
              <p className="text-xs text-[#737784] leading-relaxed">
                Precision optical encoders align the 7-compartment pill carousel smoothly. Configurable for daily, weekly, or custom interval dosing schedules.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#f8f9ff] border border-[#c3c6d5]/60 rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#006d37] text-white rounded-xl flex items-center justify-center mb-4">
                <Volume2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-[#0f1c2d] mb-2">Dual Acoustic & Piezo Feedback</h3>
              <p className="text-xs text-[#737784] leading-relaxed">
                Microphone and piezoelectric drop sensors detect the exact sonic signature of pills falling into the dispense tray for verified logging.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#f8f9ff] border border-[#c3c6d5]/60 rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#003482] text-white rounded-xl flex items-center justify-center mb-4">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-[#0f1c2d] mb-2">Micro-Camera Adherence Logging</h3>
              <p className="text-xs text-[#737784] leading-relaxed">
                High-definition micro-camera captures a 5-second video recording during every dispense event, allowing caregivers to remotely verify ingestion.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-[#f8f9ff] border border-[#c3c6d5]/60 rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#006d37] text-white rounded-xl flex items-center justify-center mb-4">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-[#0f1c2d] mb-2">Gemini Clinical Ally AI</h3>
              <p className="text-xs text-[#737784] leading-relaxed">
                Ingests clinical documents, drug leaflets, and care plans. Answers complex dosage questions and monitors drug-drug interactions automatically.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-[#f8f9ff] border border-[#c3c6d5]/60 rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#003482] text-white rounded-xl flex items-center justify-center mb-4">
                <Wifi className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-[#0f1c2d] mb-2">Offline Resilience & Cloud Sync</h3>
              <p className="text-xs text-[#737784] leading-relaxed">
                ESP32 onboard EEPROM stores up to 500 dispense events offline. Automatically resynchronizes with the cloud portal as soon as connectivity resumes.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-[#f8f9ff] border border-[#c3c6d5]/60 rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#006d37] text-white rounded-xl flex items-center justify-center mb-4">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-[#0f1c2d] mb-2">Clinical Grade Security</h3>
              <p className="text-xs text-[#737784] leading-relaxed">
                End-to-end 256-bit TLS hardware payload encryption, tamper detection sensors, and role-based caregiver vs. patient access controls.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Dual Portal Gateway Section */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="bg-gradient-to-r from-[#003482] to-[#0c4aac] text-white rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden">
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#91f8ad]">
                <Sparkles className="w-4 h-4" />
                <span>Interactive Clinical Sandbox</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                Ready to explore the MedLab Clinical Portal?
              </h2>
              <p className="text-sm sm:text-base text-blue-100 max-w-2xl leading-relaxed">
                Test the full application directly in your browser. Seamlessly manage patient schedules, analyze video adherence logs, send remote hardware commands, or consult the Gemini Ally AI.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
              <button
                onClick={() => onLaunchPortal('caregiver')}
                className="bg-[#91f8ad] hover:bg-[#76e593] text-[#004d25] font-black text-sm px-6 py-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Users className="w-5 h-5" />
                <span>Enter Caregiver Portal</span>
              </button>

              <button
                onClick={() => onLaunchPortal('patient')}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/30 font-bold text-sm px-6 py-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Pill className="w-5 h-5 text-[#91f8ad]" />
                <span>Enter Patient View</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-[#c3c6d5] py-8 px-4 md:px-8 text-xs text-[#737784]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#003482] text-white p-1.5 rounded-lg">
              <Activity className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-[#003482] text-sm">MedLab Adherence Pro</span>
            <span className="text-[11px] text-[#737784]">| 7-Compartment Clinical Hardware Platform</span>
          </div>

          <div className="flex items-center gap-6 text-xs font-semibold text-[#434755]">
            <button onClick={() => onLaunchPortal('caregiver')} className="hover:text-[#003482] cursor-pointer">Clinical Dashboard</button>
            <button onClick={() => onLaunchPortal('patient')} className="hover:text-[#003482] cursor-pointer">Patient Portal</button>
            <span className="text-gray-300">|</span>
            <span className="text-emerald-700 font-bold">System Status: Operational</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
