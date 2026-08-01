import React, { useState, useEffect, useMemo } from 'react';
import { MedicationRecord, ScheduleRecord, DeviceStatus, PatientUser, Vitals, ActivityLog, DispenseEventRecord } from '../types';
import { 
  Clock, 
  CheckCircle2, 
  Circle, 
  Activity, 
  Heart, 
  Server,
  Zap,
  Bot,
  Battery,
  Wifi,
  Users
} from 'lucide-react';

interface DashboardViewProps {
  currentPatient: PatientUser | null;
  device: DeviceStatus | null;
  medications: MedicationRecord[];
  schedules: ScheduleRecord[];
  dispenseLogs: DispenseEventRecord[];
  vitals: Vitals;
  activityLogs: ActivityLog[];
  onNavigateTab: (tab: 'dashboard' | 'patients' | 'medications' | 'adherence' | 'hardware' | 'ai_assistant' | 'notifications' | 'settings') => void;
  onSendCommand: (deviceUid: string, commandType: string, payload?: Record<string, any>) => Promise<any>;
  onUpdateVitals: (vitals: Partial<Vitals>) => void;
}

export default function DashboardView({
  currentPatient,
  device,
  medications,
  schedules,
  dispenseLogs,
  vitals,
  activityLogs,
  onNavigateTab,
  onSendCommand,
  onUpdateVitals,
}: DashboardViewProps) {
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [isDispensingAnimation, setIsDispensingAnimation] = useState(false);
  const [dispenseMedName, setDispenseMedName] = useState('');
  const [vitalEditMode, setVitalEditMode] = useState(false);
  const [editedBP, setEditedBP] = useState(vitals.bloodPressure);
  const [editedHR, setEditedHR] = useState(vitals.heartRate);

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

  const activeSchedules = schedules.filter(s => s.active);
  const nextSchedule = activeSchedules[0] || null;
  const successCount = dispenseLogs.filter(l => l.status === 'success').length;
  const adherenceScore = dispenseLogs.length > 0 ? Math.round((successCount / dispenseLogs.length) * 100) : 0;

  const nextScheduleDate = useMemo(() => {
    if (!nextSchedule?.dispense_time) return null;
    const [hourStr, minuteStr] = nextSchedule.dispense_time.split(':');
    const hour = Number(hourStr);
    const minute = Number(minuteStr);
    if (Number.isNaN(hour) || Number.isNaN(minute)) return null;
    const now = new Date();
    const target = new Date(now);
    target.setHours(hour, minute, 0, 0);
    if (target <= now) target.setDate(target.getDate() + 1);
    return target;
  }, [nextSchedule]);

  useEffect(() => {
    if (!nextScheduleDate) {
      setSecondsRemaining(0);
      return;
    }

    const updateCountdown = () => {
      const diff = Math.max(0, Math.floor((nextScheduleDate.getTime() - Date.now()) / 1000));
      setSecondsRemaining(diff);
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [nextScheduleDate]);

  const handleManualDispenseClick = async (compartmentLetter: string, name: string) => {
    if (!device?.device_uid) {
      alert('No physical device assigned to patient.');
      return;
    }
    setDispenseMedName(name || `Compartment ${compartmentLetter}`);
    setIsDispensingAnimation(true);

    try {
      await onSendCommand(device.device_uid, 'manual_dispense', { compartment: compartmentLetter });
    } catch (e) {
      // ignore
    } finally {
      setTimeout(() => {
        setIsDispensingAnimation(false);
      }, 2000);
    }
  };

  const handleVitalsSave = () => {
    onUpdateVitals({
      bloodPressure: editedBP,
      heartRate: Number(editedHR)
    });
    setVitalEditMode(false);
  };

  return (
    <div id="dashboard-tab-panel" className="space-y-6">
      
      {/* Header */}
      <header className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4 pb-4 border-b border-[#c3c6d5]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-bold tracking-tight text-[#0f1c2d]">Clinical Dashboard</h2>
            {currentPatient && (
              <span className="bg-[#e6eeff] text-[#003482] border border-[#c3c6d5] text-xs font-bold px-3 py-0.5 rounded-full flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                {currentPatient.full_name}
              </span>
            )}
          </div>
          <p className="text-[#434652] text-sm">Real-time status of 7-compartment hardware dispenser, schedule, and adherence.</p>
        </div>

        {/* Live Hardware Connection badge */}
        <div className="flex items-center gap-3 bg-[#e6eeff] px-4 py-2 rounded-lg border border-[#c3c6d5] shrink-0">
          <Activity className="w-5 h-5 text-[#006d37] animate-pulse" />
          <div>
            <p className="text-[10px] text-[#434652] font-bold uppercase tracking-wider">Dispenser Unit {device?.device_uid || 'M-42'}</p>
            <p className="text-xs font-bold text-[#0f1c2d] flex items-center gap-1.5 mt-0.5">
              <span className={`w-2.5 h-2.5 rounded-full ${device?.status === 'online' ? 'bg-[#006d37] animate-pulse shadow-[0_0_8px_rgba(0,109,55,0.4)]' : 'bg-[#ba1a1a]'}`}></span>
              {device?.status || 'Online'} • Batt {device?.battery_level ?? 88}%
            </p>
          </div>
        </div>
      </header>

      {/* Bento Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Hero Card: Next Scheduled Dose (span 8) */}
        <section className="lg:col-span-8 bg-white border border-[#c3c6d5] rounded-xl p-6 flex flex-col justify-between shadow-sm relative overflow-hidden min-h-[290px]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#e6eeff] opacity-20 rounded-bl-full pointer-events-none"></div>

          {/* Interactive Dispensing Animation Overlay */}
          {isDispensingAnimation && (
            <div className="absolute inset-0 bg-[#003482]/95 text-white z-20 flex flex-col items-center justify-center p-6 transition-all duration-300">
              <div className="relative w-16 h-16 flex items-center justify-center mb-4">
                <span className="absolute inset-0 border-4 border-[#91f8ad] border-t-transparent rounded-full animate-spin"></span>
                <Clock className="w-8 h-8 text-[#91f8ad] animate-bounce" />
              </div>
              <h4 className="text-lg font-bold">WebSocket Motor Release Initiated</h4>
              <p className="text-xs text-[#dae2ff] mt-2 text-center max-w-sm">
                Command <strong>manual_dispense</strong> dispatched to unit for <strong>{dispenseMedName}</strong>.
              </p>
            </div>
          )}

          <div className="relative z-10 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-[#434652] uppercase tracking-wider mb-1">{nextScheduleDate ? 'Next Scheduled Release in' : 'No upcoming active schedule'}</p>
                <div className="text-4xl md:text-5xl font-bold font-mono text-[#003482] tracking-tight flex items-baseline gap-1 bg-gray-50 px-3.5 py-1.5 rounded-lg border border-gray-200">
                  {nextScheduleDate ? (
                    <>
                      {hrs}<span className="text-lg text-[#737784] font-normal mr-1">h</span>
                      {mins}<span className="text-lg text-[#737784] font-normal mr-1">m</span>
                      {secs}<span className="text-lg text-[#737784] font-normal">s</span>
                    </>
                  ) : (
                    '--:--:--'
                  )}
                </div>
              </div>
              <div className="bg-[#eff4ff] p-3 rounded-full text-[#003482] border border-[#dce9ff]">
                <Clock className="w-6 h-6" />
              </div>
            </div>

            {nextSchedule ? (
              <div className="border-t border-[#c3c6d5] pt-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-[#003482] text-white text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">
                    Slot {nextSchedule.compartment}
                  </span>
                  <h3 className="text-base font-bold text-[#0f1c2d]">
                    {nextSchedule.medication_names.join(', ')}
                  </h3>
                </div>
                <p className="text-xs text-[#737784] mb-3">
                  Dispense Time: {nextSchedule.dispense_time} • Frequency: {nextSchedule.frequency}
                </p>

                <div className="flex gap-3">
                  <button 
                    onClick={() => handleManualDispenseClick(nextSchedule.compartment, nextSchedule.medication_names[0])}
                    className="bg-[#003482] text-white py-2 px-5 rounded-lg font-bold text-xs hover:bg-[#0c4aac] transition-colors cursor-pointer shadow-xs active:scale-95 duration-150 flex items-center gap-1.5"
                  >
                    <Zap className="w-4 h-4 fill-white" />
                    Dispense Compartment {nextSchedule.compartment} Now
                  </button>

                  <button 
                    onClick={() => onNavigateTab('ai_assistant')}
                    className="bg-white text-[#003482] border border-[#c3c6d5] py-2 px-4 rounded-lg font-bold text-xs hover:bg-[#eff4ff] transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Bot className="w-4 h-4 text-[#003482]" />
                    Ask Ally AI
                  </button>
                </div>
              </div>
            ) : (
              <div className="border-t border-[#c3c6d5] pt-4 text-xs text-[#737784]">
                No active schedules configured for this patient.
              </div>
            )}
          </div>
        </section>

        {/* Weekly Adherence Ring (span 4) */}
        <section className="lg:col-span-4 bg-white border border-[#c3c6d5] rounded-xl p-6 flex flex-col justify-between shadow-sm text-center">
          <p className="text-xs font-bold text-[#434652] uppercase tracking-wider mb-2 text-left">Weekly Adherence</p>
          
          <div className="relative w-32 h-32 mx-auto my-2 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="41" fill="none" stroke="#eff4ff" strokeWidth="9"></circle>
              <circle 
                cx="50" 
                cy="50" 
                r="41" 
                fill="none" 
                stroke="#006d37" 
                strokeWidth="9"
                strokeDasharray="257.6"
                strokeDashoffset={`${257.6 - (adherenceScore / 100) * 257.6}`}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              ></circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-[#0f1c2d]">
              <span className="text-2xl font-bold tracking-tight">{adherenceScore}%</span>
              <span className="text-[10px] uppercase font-bold text-[#434652]">Score</span>
            </div>
          </div>

          <span className="text-xs text-[#434652] block mb-3">
            {dispenseLogs.length > 0 ? `${successCount}/${dispenseLogs.length} recent dispense events verified` : 'Awaiting dispense history from the device.'}
          </span>

          <button 
            onClick={() => onNavigateTab('adherence')}
            className="text-xs text-[#003482] font-bold hover:underline cursor-pointer"
          >
            View Adherence & Video Logs →
          </button>
        </section>

        {/* 7-Compartments Status Panel (span 7) */}
        <section className="lg:col-span-7 bg-white border border-[#c3c6d5] rounded-xl p-6 shadow-sm space-y-3">
          <div className="flex justify-between items-center border-b border-[#c3c6d5] pb-2">
            <h3 className="text-sm font-bold text-[#0f1c2d] flex items-center gap-2">
              <Server className="w-4 h-4 text-[#003482]" />
              7-Compartment Tray State
            </h3>
            <button onClick={() => onNavigateTab('medications')} className="text-xs font-bold text-[#003482] hover:underline">
              Configure Schedules →
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((comp) => {
              const sch = schedules.find(s => s.compartment === comp && s.active);
              return (
                <div key={comp} className={`p-2.5 rounded border text-center ${sch ? 'bg-[#f8f9ff] border-[#003482]' : 'bg-gray-50 border-gray-200 opacity-60'}`}>
                  <span className="text-xs font-extrabold text-[#003482] block">Slot {comp}</span>
                  <span className="text-[10px] text-[#737784] block font-mono truncate">{sch ? sch.dispense_time : 'Free'}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Right Bottom Column: Vitals & Activity (span 5) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          <section className="bg-white border border-[#c3c6d5] rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-bold text-[#434652] uppercase tracking-wider">Patient Vitals</h3>
              {vitalEditMode ? (
                <div className="flex gap-2">
                  <button onClick={handleVitalsSave} className="text-xs text-[#006d37] font-bold">Save</button>
                  <button onClick={() => setVitalEditMode(false)} className="text-xs text-[#ba1a1a] font-bold">Cancel</button>
                </div>
              ) : (
                <button onClick={() => setVitalEditMode(true)} className="text-xs text-[#003482] font-bold hover:underline">
                  Edit
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#f8f9ff] p-3 rounded-lg border border-[#c3c6d5]">
                <span className="text-xs text-[#434652] block mb-1">Blood Pressure</span>
                {vitalEditMode ? (
                  <input type="text" value={editedBP} onChange={(e) => setEditedBP(e.target.value)} className="w-full text-xs border rounded p-1 font-bold" />
                ) : (
                  <p className="text-base font-bold text-[#0f1c2d]">{vitals.bloodPressure}</p>
                )}
                <span className="text-[10px] text-[#737784]">mmHg</span>
              </div>

              <div className="bg-[#f8f9ff] p-3 rounded-lg border border-[#c3c6d5]">
                <span className="text-xs text-[#434652] block mb-1">Heart Rate</span>
                {vitalEditMode ? (
                  <input type="number" value={editedHR} onChange={(e) => setEditedHR(Number(e.target.value))} className="w-full text-xs border rounded p-1 font-bold" />
                ) : (
                  <p className="text-base font-bold text-[#0f1c2d]">{vitals.heartRate} bpm</p>
                )}
                <span className="text-[10px] text-[#737784]">Sinus rhythm</span>
              </div>
            </div>
          </section>

          {/* Activity Stream */}
          <section className="bg-white border border-[#c3c6d5] rounded-xl p-5 shadow-sm">
            <h3 className="text-xs font-bold text-[#434652] uppercase tracking-wider mb-3">Recent Activity Stream</h3>
            <div className="space-y-2 text-xs">
              {activityLogs.slice(0, 3).map((log) => (
                <div key={log.id} className="p-2.5 bg-gray-50 border border-gray-100 rounded">
                  <span className="text-[10px] text-[#737784] font-mono block">{log.timestamp}</span>
                  <p className="text-[#0f1c2d] font-semibold">{log.text}</p>
                </div>
              ))}
            </div>
          </section>

        </div>

      </div>

    </div>
  );
}
