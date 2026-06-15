import React, { useState, useEffect } from 'react';
import { Medication, ActivityLog, Vitals } from '../types';
import { 
  Clock, 
  HelpCircle, 
  CheckCircle2, 
  Circle, 
  Activity, 
  Heart, 
  TrendingUp, 
  User,
  ShieldCheck,
  AlertCircle,
  Play
} from 'lucide-react';

interface DashboardViewProps {
  medications: Medication[];
  activityLogs: ActivityLog[];
  vitals: Vitals;
  onDispenseMedication: (medId: string) => void;
  onSkipMedication: (medId: string) => void;
  onToggleScheduleItem: (medId: string, timeIndex: number) => void;
  onUpdateVitals: (vitals: Partial<Vitals>) => void;
}

export default function DashboardView({
  medications,
  activityLogs,
  vitals,
  onDispenseMedication,
  onSkipMedication,
  onToggleScheduleItem,
  onUpdateVitals
}: DashboardViewProps) {
  
  // Real-time countdown state for the next Lisinopril dose (configured to 1 hr 45 min initially, which is 6300 seconds)
  const [secondsRemaining, setSecondsRemaining] = useState(6300);
  const [isDispensingAnimation, setIsDispensingAnimation] = useState(false);
  const [dispenseMedName, setDispenseMedName] = useState('');
  const [vitalEditMode, setVitalEditMode] = useState(false);
  const [editedBP, setEditedBP] = useState(vitals.bloodPressure);
  const [editedHR, setEditedHR] = useState(vitals.heartRate);

  // Countdown timer hook
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 0) {
          return 6300; // soft cycle reset
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format countdown seconds into HH:MM:SS
  const formatCountdown = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    
    return {
      hrs: String(hrs).padStart(2, '0'),
      mins: String(mins).padStart(2, '0'),
      secs: String(secs).padStart(2, '0')
    };
  };

  const { hrs, mins, secs } = formatCountdown(secondsRemaining);

  // Trigger interactive dispenser mock animation
  const handleDispenseClick = (medId: string, name: string) => {
    setDispenseMedName(name);
    setIsDispensingAnimation(true);
    
    // Dispensing cycle completes after 2.5 seconds
    setTimeout(() => {
      onDispenseMedication(medId);
      setIsDispensingAnimation(false);
    }, 2500);
  };

  // Submit vitals update
  const handleVitalsSave = () => {
    onUpdateVitals({
      bloodPressure: editedBP,
      heartRate: Number(editedHR)
    });
    setVitalEditMode(false);
  };

  // Safe retrieve next medication item (typically Lisinopril)
  const heroMed = medications.find(m => m.name === 'Lisinopril') || medications[0];

  return (
    <div id="dashboard-tab-panel" className="space-y-6">
      
      {/* Page Header */}
      <header className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4 pb-4 border-b border-[#c3c6d5]">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#0f1c2d] mb-1">Dashboard</h2>
          <p className="text-[#434652] text-sm">Overview of your clinical status and automated medication schedule.</p>
        </div>

        {/* Live Dispenser connection badge */}
        <div className="flex items-center gap-3 bg-[#e6eeff] px-4 py-2 rounded-lg border border-[#c3c6d5] shrink-0">
          <Activity className="w-5 h-5 text-[#006d37] animate-pulse" />
          <div>
            <p className="text-[10px] text-[#434652] font-bold uppercase tracking-wider">Dispenser Status</p>
            <p className="text-xs font-bold text-[#0f1c2d] flex items-center gap-1.5 mt-0.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#006d37] inline-block shadow-[0_0_8px_rgba(0,109,55,0.4)]"></span>
              Connected / Online
            </p>
          </div>
        </div>
      </header>

      {/* Bento Grid Layout Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Next Dose Hero Card (Left, Col-span 8) */}
        <section className="lg:col-span-8 bg-white border border-[#c3c6d5] rounded-xl p-6 flex flex-col justify-between shadow-sm relative overflow-hidden min-h-[300px]">
          {/* Faded clinical visual elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#e6eeff] opacity-20 rounded-bl-full pointer-events-none"></div>

          {/* Interactive dispensing animation overlay */}
          {isDispensingAnimation && (
            <div className="absolute inset-0 bg-[#003482]/95 text-white z-20 flex flex-col items-center justify-center p-6 transition-all duration-300">
              <div className="relative w-16 h-16 flex items-center justify-center mb-4">
                <span className="absolute inset-0 border-4 border-[#91f8ad] border-t-transparent rounded-full animate-spin"></span>
                <Clock className="w-8 h-8 text-[#91f8ad] animate-bounce" />
              </div>
              <h4 className="text-lg font-bold">Dispensing Activity Initiated</h4>
              <p className="text-xs text-[#dae2ff] mt-2 text-center max-w-sm">
                Unit M-42 is aligning Compartment for <strong>{dispenseMedName}</strong>. Standard clinical release keys verified.
              </p>
            </div>
          )}

          <div className="relative z-10 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-[#434652] uppercase tracking-wider mb-1">Next Dose scheduled in</p>
                <div className="text-4xl md:text-5xl font-bold font-mono text-[#003482] tracking-tight flex items-baseline gap-1 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                  {hrs}<span className="text-lg text-[#737784] font-normal mr-1">h</span>
                  {mins}<span className="text-lg text-[#737784] font-normal mr-1">m</span>
                  {secs}<span className="text-lg text-[#737784] font-normal">s</span>
                </div>
              </div>
              <div className="bg-[#eff4ff] p-3 rounded-full text-[#003482] border border-[#dce9ff]">
                <Clock className="w-6 h-6" />
              </div>
            </div>

            {heroMed && (
              <div className="border-t border-[#c3c6d5] pt-4 mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-bold text-[#0f1c2d]">{heroMed.name} {heroMed.dosage}</h3>
                  <span className="bg-[#91f8ad] text-[#00743b] text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">Active</span>
                </div>
                <p className="text-sm text-[#434652] mb-4">{heroMed.purpose}</p>

                <div className="flex gap-3">
                  <button 
                    onClick={() => handleDispenseClick(heroMed.id, heroMed.name)}
                    className="bg-[#003482] text-white py-2 px-5 rounded-lg font-bold text-xs hover:bg-[#0c4aac] transition-colors cursor-pointer shadow-sm active:scale-95 duration-150"
                  >
                    Dispense Now
                  </button>
                  <button 
                    onClick={() => onSkipMedication(heroMed.id)}
                    className="bg-white text-[#0f1c2d] border border-[#c3c6d5] py-2 px-5 rounded-lg font-bold text-xs hover:bg-[#eff4ff] transition-colors cursor-pointer active:scale-95 duration-150"
                  >
                    Skip Dose
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Adherence Score Card (Right, Col-span 4) */}
        <section className="lg:col-span-4 bg-white border border-[#c3c6d5] rounded-xl p-6 flex flex-col justify-between shadow-sm text-center">
          <p className="text-xs font-bold text-[#434652] uppercase tracking-wider mb-4 text-left">Weekly Adherence</p>
          
          <div className="relative w-36 h-36 mx-auto mb-4 flex items-center justify-center">
            {/* Standard Circular Rating Progress SVGs */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="41" fill="none" stroke="#eff4ff" strokeWidth="9"></circle>
              {/* StrokeDashoffset corresponds to score. 95% is approx 257.6 circumference length */}
              <circle 
                cx="50" 
                cy="50" 
                r="41" 
                fill="none" 
                stroke="#006d37" 
                strokeWidth="9"
                strokeDasharray="257.6"
                strokeDashoffset="12.8" /* 95% filled */
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              ></circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-[#0f1c2d]">
              <span className="text-3xl font-bold tracking-tight">95%</span>
              <span className="text-[10px] uppercase font-bold text-[#434652] tracking-wider mt-0.5">Adhered</span>
            </div>
          </div>

          <p className="text-xs text-[#434652] leading-relaxed max-w-xs mx-auto">
            Excellent adherence recorded this week. Complete clinical synchronization remains consistent.
          </p>
        </section>

        {/* Left Bottom Section: Today's Schedule Card (Col-span 7) */}
        <section className="lg:col-span-7 bg-white border border-[#c3c6d5] rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#c3c6d5]">
            <h3 className="text-base font-bold text-[#0f1c2d]">Today's Schedule</h3>
            <span className="text-xs text-[#003482] font-bold cursor-pointer hover:underline">View All</span>
          </div>

          <ul className="space-y-3">
            {/* Metformin display item */}
            <li className="flex items-center justify-between p-4 bg-[#eff4ff] rounded-lg border border-transparent">
              <div className="flex items-center gap-3 opacity-75">
                <CheckCircle2 className="w-5.5 h-5.5 text-[#006d37]" />
                <div>
                  <p className="font-bold text-sm text-[#0f1c2d] line-through">Metformin 500mg</p>
                  <p className="text-xs text-[#434652]">08:00 AM • Taken on time</p>
                </div>
              </div>
              <span className="text-[10px] bg-[#91f8ad] text-[#00743b] font-bold px-2 py-0.5 rounded">Synced</span>
            </li>

            {/* Lisinopril display item */}
            <li className="flex items-center justify-between p-4 bg-white border border-[#c3c6d5] rounded-lg relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-[5px] bg-[#003482]"></div>
              <div className="flex items-center gap-3 pl-1">
                <Circle className="w-5.5 h-5.5 text-[#003482]" />
                <div>
                  <p className="font-bold text-sm text-[#0f1c2d]">Lisinopril 10mg</p>
                  <p className="text-xs font-bold text-[#003482]">12:00 PM • Next Scheduled</p>
                </div>
              </div>
            </li>

            {/* Atorvastatin display item */}
            <li className="flex items-center justify-between p-4 bg-white border border-[#c3c6d5] rounded-lg">
              <div className="flex items-center gap-3">
                <Circle className="w-5.5 h-5.5 text-[#737784]" />
                <div>
                  <p className="font-bold text-sm text-[#0f1c2d]">Atorvastatin 20mg</p>
                  <p className="text-xs text-[#434652]">08:00 PM</p>
                </div>
              </div>
            </li>
          </ul>
        </section>

        {/* Right Bottom Section: Quick Vitals & Recent Activity Log (Col-span 5) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Quick Vitals */}
          <section className="bg-white border border-[#c3c6d5] rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold text-[#434652] uppercase tracking-wider">Latest Vitals</h3>
              
              {vitalEditMode ? (
                <div className="flex gap-2">
                  <button onClick={handleVitalsSave} className="text-xs text-[#006d37] font-bold hover:underline">Save</button>
                  <button onClick={() => setVitalEditMode(false)} className="text-xs text-[#ba1a1a] font-bold hover:underline">Cancel</button>
                </div>
              ) : (
                <button 
                  onClick={() => {
                    setEditedBP(vitals.bloodPressure);
                    setEditedHR(vitals.heartRate);
                    setVitalEditMode(true);
                  }} 
                  className="text-xs text-[#003482] font-bold hover:underline cursor-pointer"
                >
                  Edit Vitals
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#f8f9ff] p-3 rounded-lg border border-[#c3c6d5] flex flex-col justify-between">
                <span className="text-xs text-[#434652] font-semibold mb-1">Blood Pressure</span>
                {vitalEditMode ? (
                  <input 
                    type="text" 
                    value={editedBP}
                    onChange={(e) => setEditedBP(e.target.value)}
                    className="w-full text-base font-bold text-[#0f1c2d] bg-white border border-[#c3c6d5] rounded px-1.5 py-0.5"
                  />
                ) : (
                  <p className="text-lg font-bold text-[#0f1c2d]">{vitals.bloodPressure}</p>
                )}
                <span className="text-[10px] text-[#737784] mt-1 italic">mmHg (Stable)</span>
              </div>

              <div className="bg-[#f8f9ff] p-3 rounded-lg border border-[#c3c6d5] flex flex-col justify-between">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-[#434652] font-semibold">Heart Rate</span>
                  <Heart className="w-3.5 h-3.5 text-red-500 animate-pulse fill-red-500" />
                </div>
                {vitalEditMode ? (
                  <input 
                    type="number" 
                    value={editedHR}
                    onChange={(e) => setEditedHR(Number(e.target.value))}
                    className="w-full text-base font-bold text-[#0f1c2d] bg-white border border-[#c3c6d5] rounded px-1.5 py-0.5"
                  />
                ) : (
                  <p className="text-lg font-bold text-[#0f1c2d]">
                    {vitals.heartRate} <span className="text-xs font-normal text-[#434652]">bpm</span>
                  </p>
                )}
                <span className="text-[10px] text-[#737784] mt-1 italic">Normal sinus rythm</span>
              </div>
            </div>
          </section>

          {/* Chronological live activity log stream */}
          <section className="bg-white border border-[#c3c6d5] rounded-xl p-5 shadow-sm flex-1">
            <h3 className="text-xs font-bold text-[#434652] uppercase tracking-wider mb-4">Recent Activity</h3>
            
            <div className="relative pl-4 border-l-2 border-[#e6eeff] flex flex-col gap-4">
              {activityLogs.slice(0, 4).map((log, index) => (
                <div key={log.id} className="relative">
                  <div className="absolute -left-[22px] top-1 w-2.5 h-2.5 rounded-full bg-[#c3c6d5] border-2 border-white"></div>
                  <p className="text-[10px] text-[#737784] font-semibold mb-0.5">{log.timestamp}</p>
                  <p className="text-xs text-[#0f1c2d] font-medium leading-relaxed">{log.text}</p>
                </div>
              ))}
            </div>
          </section>

        </div>

      </div>

    </div>
  );
}
