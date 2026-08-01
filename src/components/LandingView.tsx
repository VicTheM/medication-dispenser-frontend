import React, { useState } from 'react';
import { 
  Activity, 
  ShieldCheck, 
  Cpu, 
  Bot, 
  BarChart3, 
  Clock, 
  Wifi, 
  CheckCircle2, 
  Zap, 
  Download, 
  ArrowRight, 
  Check, 
  Lock, 
  Server, 
  Battery, 
  Volume2, 
  Video, 
  ChevronRight, 
  Sparkles,
  Layers,
  Award,
  PhoneCall,
  UserCheck,
  Users
} from 'lucide-react';

interface LandingViewProps {
  onLaunchPortal: (role?: 'caregiver' | 'patient') => void;
}

export default function LandingView({ onLaunchPortal }: LandingViewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'hardware' | 'ai' | 'adherence' | 'specs'>('overview');
  const [simState, setSimState] = useState<'idle' | 'dispensing' | 'dispensed'>('idle');
  const [selectedSlot, setSelectedSlot] = useState<string>('A');

  const triggerSimulateDispense = () => {
    setSimState('dispensing');
    setTimeout(() => {
      setSimState('dispensed');
    }, 2500);
  };

  const resetSimulate = () => {
    setSimState('idle');
  };

  return (
    <div className="bg-[#f8f9ff] text-[#0f1c2d] min-h-screen font-sans selection:bg-[#003482] selection:text-white">
      
      {/* Top Navbar */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-[#c3c6d5] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-18 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="bg-[#003482] text-white p-2.5 rounded-xl shadow-xs">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-[#003482] block leading-none">
                MedLab <span className="text-xs uppercase font-extrabold text-[#00743b] tracking-wider bg-[#91f8ad] px-2 py-0.5 rounded-full ml-1">Adherence Pro</span>
              </span>
              <span className="text-[10px] text-[#737784] font-semibold tracking-wide">Next-Gen IoT Medication Hardware & AI Portal</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs font-bold text-[#434652]">
            <a href="#hardware-section" className="hover:text-[#003482] transition-colors">Hardware Unit</a>
            <a href="#features-section" className="hover:text-[#003482] transition-colors">Key Features</a>
            <a href="#ai-section" className="hover:text-[#003482] transition-colors">Ally RAG AI</a>
            <a href="#specs-section" className="hover:text-[#003482] transition-colors">Specifications</a>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => onLaunchPortal('patient')}
              className="px-4 py-2 text-xs font-bold text-[#003482] bg-[#eff4ff] hover:bg-[#e6eeff] border border-[#c3c6d5] rounded-lg transition-all cursor-pointer hidden sm:block"
            >
              Patient Portal
            </button>
            <button 
              onClick={() => onLaunchPortal('caregiver')}
              className="px-5 py-2.5 text-xs font-bold text-white bg-[#003482] hover:bg-[#0c4aac] rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
            >
              <UserCheck className="w-4 h-4" />
              Caregiver Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:py-24 border-b border-[#c3c6d5] bg-gradient-to-b from-white via-[#f8f9ff] to-[#eff4ff]/30">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Text (Span 7) */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 bg-[#eff4ff] border border-[#003482]/20 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#003482]">
                <ShieldCheck className="w-4 h-4 text-[#00743b]" />
                HIPAA-Compliant IoT Dispenser System & Clinical RAG Engine
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0f1c2d] leading-[1.15]">
                Precision Medication Adherence. <br />
                <span className="text-[#003482]">Powered by Smart Hardware & AI.</span>
              </h1>

              <p className="text-[#434652] text-base md:text-lg max-w-2xl leading-relaxed">
                Meet the MedLab 7-Compartment Smart Dispenser. Featuring an integrated LCD screen, dual acoustic proximity sensors, tri-color LED status telemetry, automated motor release door, and AI video verification.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button 
                  onClick={() => onLaunchPortal('caregiver')}
                  className="px-6 py-3.5 bg-[#003482] hover:bg-[#0c4aac] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  Launch Clinical Caregiver Portal
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a 
                  href="#demo-simulator"
                  className="px-6 py-3.5 bg-white text-[#003482] border border-[#c3c6d5] hover:bg-[#eff4ff] font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Cpu className="w-4 h-4 text-[#003482]" />
                  View Dispenser Preview
                </a>
              </div>

              {/* Stat Highlights */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#c3c6d5]/60 max-w-lg">
                <div>
                  <p className="text-2xl font-extrabold text-[#003482]">99.8%</p>
                  <p className="text-xs text-[#737784] font-semibold">Dispense Accuracy</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-[#003482]">7 Slots</p>
                  <p className="text-xs text-[#737784] font-semibold">Weekly Indexing</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-[#00743b]">500 Log</p>
                  <p className="text-xs text-[#737784] font-semibold">Offline ESP32 Cache</p>
                </div>
              </div>

            </div>

            {/* Right Hero Graphic: Hardware Representation (Span 5) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md bg-white border-2 border-[#c3c6d5] rounded-3xl p-6 shadow-2xl space-y-4">
                
                {/* Visual Label */}
                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <span className="text-xs font-extrabold text-[#003482] uppercase tracking-wider">MedLab Hardware Unit v3</span>
                  <span className="text-[10px] font-bold text-[#00743b] bg-[#91f8ad] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#00743b] animate-pulse"></span>
                    ONLINE
                  </span>
                </div>

                {/* 3D-styled Hardware Graphic rendered to match attached CAD image */}
                <div className="bg-gradient-to-b from-[#e2e6ea] to-[#cbd2d9] border border-[#9aa0a6] rounded-2xl p-6 shadow-inner relative flex flex-col items-center justify-between min-h-[340px]">
                  
                  {/* Top: Blue LCD Character Display */}
                  <div className="w-full bg-[#002bb8] border-2 border-[#001c7a] rounded-md p-3 shadow-md flex items-center justify-center font-mono text-center">
                    <div className="text-[#64d2ff] font-bold text-sm tracking-wider animate-pulse">
                      {simState === 'dispensing' 
                        ? `RELEASE SLOT ${selectedSlot}...` 
                        : simState === 'dispensed'
                        ? `SLOT ${selectedSlot} DISPENSED!`
                        : `MEDLAB READY: SLOT ${selectedSlot}`}
                    </div>
                  </div>

                  {/* Middle: Dual Ultrasonic Sensors / Speaker Grilles & Mic Pinhole */}
                  <div className="flex items-center gap-6 my-6">
                    <div className="w-14 h-14 bg-[#1f2937] border-2 border-[#4b5563] rounded-full flex items-center justify-center shadow-inner relative overflow-hidden">
                      <div className="w-10 h-10 border border-gray-500 rounded-full bg-radial from-gray-700 to-gray-900 flex items-center justify-center">
                        <div className="w-6 h-6 border border-gray-600 rounded-full bg-black"></div>
                      </div>
                    </div>

                    <div className="w-14 h-14 bg-[#1f2937] border-2 border-[#4b5563] rounded-full flex items-center justify-center shadow-inner relative overflow-hidden">
                      <div className="w-10 h-10 border border-gray-500 rounded-full bg-radial from-gray-700 to-gray-900 flex items-center justify-center">
                        <div className="w-6 h-6 border border-gray-600 rounded-full bg-black"></div>
                      </div>
                    </div>

                    {/* Camera / Mic Pinhole */}
                    <div className="w-3 h-3 bg-black border border-gray-400 rounded-full shadow-inner" title="Camera/Mic Pinhole"></div>
                  </div>

                  {/* Bottom: Tri-Color Telemetry LEDs & Motorized Dispense Door */}
                  <div className="w-full flex items-end justify-between gap-4 pt-2">
                    
                    {/* Tri-Color LEDs */}
                    <div className="flex flex-col gap-2 p-1.5 bg-gray-300 rounded-lg border border-gray-400">
                      <div className={`w-3.5 h-3.5 rounded-full border border-red-800 ${simState === 'idle' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'bg-red-950 opacity-40'}`} title="Alert/Missed LED"></div>
                      <div className={`w-3.5 h-3.5 rounded-full border border-green-800 ${simState === 'dispensed' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]' : 'bg-green-950 opacity-40'}`} title="Ready/Dispensed LED"></div>
                      <div className={`w-3.5 h-3.5 rounded-full border border-blue-800 ${simState === 'dispensing' ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]' : 'bg-blue-950 opacity-40'}`} title="Network LED"></div>
                    </div>

                    {/* Motorized Dispense Door */}
                    <div className="flex-1 h-24 bg-gradient-to-b from-[#b0b8c1] to-[#8c96a0] border-2 border-[#6c757d] rounded-lg relative flex items-center justify-center overflow-hidden shadow-md">
                      {simState === 'dispensing' ? (
                        <div className="absolute inset-0 bg-[#003482]/90 text-white flex flex-col items-center justify-center text-xs font-bold animate-pulse">
                          <Zap className="w-5 h-5 text-[#91f8ad] mb-1 animate-bounce" />
                          Stepper Motor Opening
                        </div>
                      ) : simState === 'dispensed' ? (
                        <div className="bg-[#91f8ad] text-[#00743b] px-3 py-1.5 rounded-md text-xs font-extrabold flex items-center gap-1.5 shadow-sm">
                          <CheckCircle2 className="w-4 h-4" />
                          Pills Delivered
                        </div>
                      ) : (
                        <span className="text-xs text-[#333e48] font-bold font-mono tracking-wider uppercase">
                          Dispense Tray Closed
                        </span>
                      )}
                    </div>

                  </div>

                </div>

                {/* Sub Caption */}
                <p className="text-[11px] text-[#737784] text-center italic">
                  Physical CAD Representation of the MedLab 7-Compartment Hardware Box
                </p>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Interactive Hardware Dispenser Simulator */}
      <section id="demo-simulator" className="py-16 bg-white border-b border-[#c3c6d5]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-8">
          
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase text-[#003482] tracking-wider bg-[#eff4ff] px-3 py-1 rounded-full border border-[#003482]/20">
              Preview &middot; Not Connected to a Live Device
            </span>
            <h2 className="text-3xl font-extrabold text-[#0f1c2d] mt-2">
              See How a 7-Compartment Dispense Looks
            </h2>
            <p className="text-[#434652] text-sm mt-1">
              This is a visual walkthrough only. Sign in to a caregiver account to control a real dispenser.
            </p>
          </div>

          <div className="bg-[#f8f9ff] border border-[#c3c6d5] rounded-2xl p-6 md:p-8 max-w-3xl mx-auto shadow-sm space-y-5">
            
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-[#0f1c2d]">Select a compartment (A–G)</h3>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((slot) => (
                  <button
                    key={slot}
                    onClick={() => {
                      setSelectedSlot(slot);
                      resetSimulate();
                    }}
                    className={`py-2.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer border ${
                      selectedSlot === slot 
                        ? 'bg-[#003482] text-white border-[#003482] shadow-sm' 
                        : 'bg-white text-[#0f1c2d] border-[#c3c6d5] hover:bg-gray-50'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={triggerSimulateDispense}
                disabled={simState === 'dispensing'}
                className="flex-1 py-3 bg-[#003482] hover:bg-[#0c4aac] text-white font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
              >
                <Zap className="w-4 h-4 fill-white" />
                Preview Dispense from Slot {selectedSlot}
              </button>
              <button
                onClick={resetSimulate}
                className="px-4 py-3 bg-white text-[#737784] border border-[#c3c6d5] hover:bg-gray-50 font-bold text-xs rounded-lg cursor-pointer"
              >
                Reset
              </button>
            </div>

            <p className="text-xs text-center text-[#737784]">
              {simState === 'idle' && `Dispenser is idle, waiting at slot ${selectedSlot}.`}
              {simState === 'dispensing' && `Opening compartment ${selectedSlot}...`}
              {simState === 'dispensed' && `Compartment ${selectedSlot} dispensed successfully.`}
            </p>
          </div>

        </div>
      </section>

      {/* Hardware Features Breakdown */}
      <section id="features-section" className="py-16 md:py-24 max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase text-[#003482] tracking-wider bg-[#eff4ff] px-3.5 py-1 rounded-full border border-[#003482]/20">
            Hardware Engineering Excellence
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0f1c2d]">
            Built to Eliminate Missed & Duplicate Doses
          </h2>
          <p className="text-[#434652] text-sm md:text-base">
            Designed for elderly care, clinical trials, and home health monitoring with complete hardware authority.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Card 1 */}
          <div className="bg-white border border-[#c3c6d5] rounded-xl p-6 shadow-sm space-y-3 hover:border-[#003482] transition-all group">
            <div className="w-12 h-12 bg-[#eff4ff] text-[#003482] rounded-xl flex items-center justify-center group-hover:bg-[#003482] group-hover:text-white transition-all">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#0f1c2d]">High-Contrast Blue LCD Screen</h3>
            <p className="text-xs text-[#434652] leading-relaxed">
              Provides crystal-clear, high-legibility text instructions for patients. Displays current slot, time countdowns, and dosage guidance clearly.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-[#c3c6d5] rounded-xl p-6 shadow-sm space-y-3 hover:border-[#003482] transition-all group">
            <div className="w-12 h-12 bg-[#eff4ff] text-[#003482] rounded-xl flex items-center justify-center group-hover:bg-[#003482] group-hover:text-white transition-all">
              <Volume2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#0f1c2d]">Dual Acoustic & Proximity Sensors</h3>
            <p className="text-xs text-[#434652] leading-relaxed">
              Integrates dual ultrasonic distance sensors and speaker grilles to detect when a patient approaches the dispenser and speak audible dose reminders.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-[#c3c6d5] rounded-xl p-6 shadow-sm space-y-3 hover:border-[#003482] transition-all group">
            <div className="w-12 h-12 bg-[#eff4ff] text-[#003482] rounded-xl flex items-center justify-center group-hover:bg-[#003482] group-hover:text-white transition-all">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#0f1c2d]">Tri-Color Telemetry LEDs</h3>
            <p className="text-xs text-[#434652] leading-relaxed">
              Instant physical status indicators: Red for missed dose alerts, Green for ready/dispensed state, and Blue for active network sync.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white border border-[#c3c6d5] rounded-xl p-6 shadow-sm space-y-3 hover:border-[#003482] transition-all group">
            <div className="w-12 h-12 bg-[#eff4ff] text-[#003482] rounded-xl flex items-center justify-center group-hover:bg-[#003482] group-hover:text-white transition-all">
              <Video className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#0f1c2d]">AI Video Adherence Verification</h3>
            <p className="text-xs text-[#434652] leading-relaxed">
              Front-facing micro camera logs short adherence clips to verify person presence and pill consumption with automated AI face & pill detection.
            </p>
          </div>

          {/* Card 5 */}
          <div className="bg-white border border-[#c3c6d5] rounded-xl p-6 shadow-sm space-y-3 hover:border-[#003482] transition-all group">
            <div className="w-12 h-12 bg-[#eff4ff] text-[#003482] rounded-xl flex items-center justify-center group-hover:bg-[#003482] group-hover:text-white transition-all">
              <Server className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#0f1c2d]">Offline ESP32 Memory Caching</h3>
            <p className="text-xs text-[#434652] leading-relaxed">
              Stores up to 500 dispense logs locally in non-volatile flash memory during internet outages and auto-resyncs seamlessly when back online.
            </p>
          </div>

          {/* Card 6 */}
          <div className="bg-white border border-[#c3c6d5] rounded-xl p-6 shadow-sm space-y-3 hover:border-[#003482] transition-all group">
            <div className="w-12 h-12 bg-[#eff4ff] text-[#003482] rounded-xl flex items-center justify-center group-hover:bg-[#003482] group-hover:text-white transition-all">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#0f1c2d]">Ally RAG Clinical Assistant</h3>
            <p className="text-xs text-[#434652] leading-relaxed">
              Connects to ingested PDF care plans for instant voice & text queries regarding dosage schedules, drug-drug interactions, and missed dose protocols.
            </p>
          </div>

        </div>
      </section>

      {/* Specifications Table Section */}
      <section id="specs-section" className="py-16 bg-[#eff4ff]/40 border-t border-[#c3c6d5]">
        <div className="max-w-5xl mx-auto px-4 md:px-8 space-y-8">
          
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-[#0f1c2d]">Hardware Technical Specifications</h2>
            <p className="text-xs text-[#434652]">MedLab 7-Compartment Smart Dispenser Model M-42-7C</p>
          </div>

          <div className="bg-white border border-[#c3c6d5] rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs">
              <tbody className="divide-y divide-[#c3c6d5]">
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-bold text-[#003482] w-1/3">Microcontroller Architecture</td>
                  <td className="py-3 px-4 text-[#0f1c2d] font-mono">ESP32 Dual-Core Tensilica LX6 (240MHz, Wi-Fi 802.11 b/g/n, BLE 4.2)</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-bold text-[#003482]">Tray Mechanism</td>
                  <td className="py-3 px-4 text-[#0f1c2d]">7-Compartment Carousel, High-Torque NEMA Stepper Motor with Optocoupler Indexing</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-bold text-[#003482]">Display & Visuals</td>
                  <td className="py-3 px-4 text-[#0f1c2d]">16x2 Blue Backlit LCD Screen + 3 Status LEDs (Red, Green, Blue)</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-bold text-[#003482]">Sensors & Telemetry</td>
                  <td className="py-3 px-4 text-[#0f1c2d]">Dual Ultrasonic Proximity Sensors, Optical Pill Pass IR Sensor, Mic Pinhole</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-bold text-[#003482]">Power & Battery</td>
                  <td className="py-3 px-4 text-[#0f1c2d]">5V DC USB-C Main In + 3.7V LiPo 2200mAh Backup Battery (48-Hour Operation)</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-bold text-[#003482]">Security & Compliance</td>
                  <td className="py-3 px-4 text-[#0f1c2d]">256-bit TLS/SSL Telemetry Encryption, HIPAA Compliant Cloud Data Vault</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-16 md:py-20 bg-[#003482] text-white text-center">
        <div className="max-w-4xl mx-auto px-4 md:px-8 space-y-6">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Ready to Experience Next-Generation Medication Management?
          </h2>
          <p className="text-sm md:text-base text-[#dae2ff] max-w-2xl mx-auto">
            Access the clinical caregiver dashboard or patient portal to manage hardware schedules, view adherence reports, and interact with the AI assistant.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <button 
              onClick={() => onLaunchPortal('caregiver')}
              className="px-8 py-4 bg-white text-[#003482] font-extrabold text-sm rounded-xl hover:bg-gray-100 shadow-lg transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2"
            >
              <UserCheck className="w-5 h-5 text-[#003482]" />
              Open Caregiver Clinical Portal
            </button>
            <button 
              onClick={() => onLaunchPortal('patient')}
              className="px-8 py-4 bg-[#eff4ff]/20 text-white border border-white/30 font-extrabold text-sm rounded-xl hover:bg-[#eff4ff]/30 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Users className="w-5 h-5 text-white" />
              Open Patient Portal
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-[#c3c6d5] py-6 px-4 md:px-8 text-xs text-[#737784] text-center">
        <p>© 2026 MedLab Adherence Pro. All rights reserved. Built for 7-Compartment ESP32 Smart Dispensers.</p>
      </footer>

    </div>
  );
}
