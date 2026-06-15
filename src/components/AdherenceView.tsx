import React, { useState } from 'react';
import { VerificationLog } from '../types';
import { 
  BarChart3, 
  Download, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Video, 
  VideoOff, 
  Play, 
  X, 
  ShieldCheck 
} from 'lucide-react';

interface AdherenceViewProps {
  verificationLogs: VerificationLog[];
  onExportCSV: () => void;
}

export default function AdherenceView({
  verificationLogs,
  onExportCSV
}: AdherenceViewProps) {
  
  // Video Modal State
  const [selectedLog, setSelectedLog] = useState<VerificationLog | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Simulated export action
  const handleExportClick = () => {
    onExportCSV();
    alert('MedLab Clinical Database: Adherence CSV export generated and saved.');
  };

  // Mock adherence percentages for bars (Mon - Sun)
  const WEEK_BARS = [
    { day: 'M', percent: 100, tooltip: 'Monday: 100% (1/1 dispensed)' },
    { day: 'T', percent: 100, tooltip: 'Tuesday: 100% (1/1 dispensed)' },
    { day: 'W', percent: 66, tooltip: 'Wednesday: 66% (Missed Morning Dose)' },
    { day: 'T', percent: 100, tooltip: 'Thursday: 100% (1/1 dispensed)' },
    { day: 'F', percent: 85, tooltip: 'Friday: 85% (15m offset variance)' },
    { day: 'S', percent: 100, tooltip: 'Saturday: 100% (1/1 dispensed)' },
    { day: 'S', percent: 0, isPending: true, tooltip: 'Sunday: Pending sync' },
  ];

  return (
    <div id="adherence-tab-panel" className="space-y-6">
      
      {/* 1. SECTION ADHERENCE GENERAL HEADER */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#c3c6d5]">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#0f1c2d]">Adherence Reports</h2>
          <p className="text-[#434652] text-sm mt-1">Historical analytics of patient medication intake and secure AI video verification logs.</p>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={handleExportClick}
            className="px-4 py-2 border border-[#c3c6d5] bg-white rounded-lg font-bold text-xs hover:bg-[#eff4ff] text-[#0f1c2d] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#737784]" />
            Export CSV
          </button>
          
          <button className="px-4 py-2 border border-[#c3c6d5] bg-white rounded-lg font-bold text-xs hover:bg-[#eff4ff] text-[#0f1c2d] transition-all flex items-center gap-1.5 cursor-pointer">
            <Filter className="w-4 h-4 text-[#737784]" />
            Filter
          </button>
        </div>
      </header>

      {/* 2. WEEKLY OVERVIEW GRAPH CONTAINER */}
      <div className="bg-white border border-[#c3c6d5] rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-base font-bold text-[#0f1c2d]">Weekly Overview</h3>
          <span className="text-xs font-bold text-[#00743b] bg-[#91f8ad] px-3 py-1 rounded-full">92% Overall Score</span>
        </div>

        {/* Custom responsive clinical SVG/CSS graph */}
        <div className="h-56 bg-[#f8f9ff] border border-[#c3c6d5] rounded-lg relative flex items-end justify-between p-6 pt-12 gap-2 md:gap-4 overflow-hidden shadow-none">
          
          {/* Horizontal dotted grid backgrounds */}
          <div className="absolute left-0 right-0 top-1/4 h-[1px] border-t border-dashed border-gray-200 pointer-events-none"></div>
          <div className="absolute left-0 right-0 top-2/4 h-[1px] border-t border-dashed border-gray-200 pointer-events-none"></div>
          <div className="absolute left-0 right-0 top-3/4 h-[1px] border-t border-dashed border-gray-200 pointer-events-none"></div>

          {WEEK_BARS.map((bar, index) => (
            <div 
              key={index} 
              className="flex-1 flex flex-col items-center h-full justify-end relative group cursor-pointer"
            >
              {/* Tooltip on Hover */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#243143] text-white text-[10px] font-bold px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30 pointer-events-none">
                {bar.tooltip}
              </div>

              {/* Bar level */}
              <div 
                className={`w-full max-w-[48px] rounded-t-sm transition-all duration-700 ${
                  bar.isPending 
                    ? 'border border-dashed border-[#c3c6d5] bg-[#eff4ff] h-[40%] opacity-50' 
                    : 'bg-[#003482] opacity-85 group-hover:opacity-100'
                }`}
                style={{ 
                  height: bar.isPending ? '40%' : `${bar.percent * 0.85 + 5}%` 
                }}
              ></div>

              {/* Bottom label */}
              <div className="text-[10px] font-bold text-[#737784] mt-2 tracking-widest">{bar.day}</div>
            </div>
          ))}

          {/* Dotted indicator timeline label container */}
          <div className="absolute bottom-1 right-2 text-[9px] font-bold text-[#737784] uppercase tracking-wider bg-[#f8f9ff] px-2 rounded">
            Patient Partition 3B
          </div>
        </div>
      </div>

      {/* 3. DETAILED LOG GRID (Taken Cards / Missed Cards) */}
      <h3 className="text-base font-bold text-[#0f1c2d] mt-8 mb-4">Daily Verification Logs</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {verificationLogs.map((log) => {
          const isTaken = log.status === 'Taken';
          return (
            <div 
              key={log.id} 
              className={`bg-white border text-[#0f1c2d] rounded-xl overflow-hidden flex flex-col justify-between shadow-sm ${
                isTaken ? 'border-[#c3c6d5]' : 'border-red-200 bg-red-50/10'
              }`}
            >
              {/* Card top banner */}
              <div className={`p-4 border-b flex justify-between items-center ${
                isTaken ? 'border-[#c3c6d5] bg-[#eff4ff]' : 'border-red-200 bg-red-50/50'
              }`}>
                <div className={`flex items-center gap-1.5 font-bold text-xs ${isTaken ? 'text-[#006d37]' : 'text-[#ba1a1a]'}`}>
                  {isTaken ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                  <span>{log.status}</span>
                </div>
                <span className="text-[10px] text-[#737784] font-bold">{log.timestamp}</span>
              </div>

              {/* Card inner body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div className="mb-4">
                  <h4 className="text-base font-bold mb-0.5">{log.medName} {log.dosage}</h4>
                  <p className="text-xs text-[#737784]">Prescribed: {log.pills} tablet daily for partition sync.</p>
                </div>

                {log.hasVideo ? (
                  <button 
                    onClick={() => {
                      setSelectedLog(log);
                      setIsVideoPlaying(false);
                    }}
                    className="w-full flex items-center justify-center gap-1.5 bg-[#f8f9ff] hover:bg-[#e6eeff] border border-[#c3c6d5] text-[#0f1c2d] py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
                  >
                    <Video className="w-4.5 h-4.5 text-[#003482]" />
                    View Video Log
                  </button>
                ) : (
                  <div className="w-full flex items-center justify-center gap-1.5 text-[#ba1a1a] py-2.5 rounded-lg text-xs font-bold bg-amber-50 border border-amber-200/50 opacity-70 cursor-not-allowed">
                    <VideoOff className="w-4.5 h-4.5" />
                    No Log Available
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. CLINICAL VIDEO PLAY MODAL */}
      {selectedLog && (
        <div id="video-verification-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0f1c2d]/50 backdrop-blur-sm">
          
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl relative z-10 flex flex-col overflow-hidden border border-[#c3c6d5]">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b border-[#c3c6d5] bg-[#f8f9ff]">
              <div>
                <h3 className="text-base font-bold text-[#0f1c2d]">Secure Verification Log</h3>
                <p className="text-xs text-[#737784]">{selectedLog.medName} {selectedLog.dosage} - {selectedLog.timestamp}</p>
              </div>
              <button 
                onClick={() => setSelectedLog(null)}
                className="p-1 rounded-full hover:bg-gray-200 text-[#737784] transition-colors cursor-pointer"
              >
                <X className="w-5.5 h-5.5" />
              </button>
            </div>

            {/* Simulated Live Video Stage Area */}
            <div className="bg-black aspect-video w-full relative flex items-center justify-center overflow-hidden">
              
              {/* Unsplash Background */}
              <img 
                alt="Verification Video Preview" 
                src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                className="absolute inset-0 w-full h-full object-cover opacity-65 mix-blend-luminosity"
              />

              {isVideoPlaying ? (
                /* Simulated video play animation */
                <div className="absolute inset-0 bg-transparent flex items-center justify-center text-white p-4">
                  <div className="absolute top-3 left-3 bg-[#ba1a1a] text-white text-[10px] font-bold px-2 py-0.5 rounded animate-pulse uppercase tracking-widest">
                    • RECORDING LOG PLAYBACK
                  </div>
                  
                  {/* Glowing bounding box simulation */}
                  <div className="border-2 border-dashed border-[#91f8ad] w-1/2 aspect-square animate-pulse rounded flex flex-col justify-end p-2">
                    <span className="text-[9px] font-bold bg-[#00743b] text-white px-1.5 py-0.5 rounded self-start tracking-wide">
                      ANALYZING: COMPARTMENT_SYNC
                    </span>
                  </div>

                  {/* Complete verification check message */}
                  <div className="absolute bottom-4 right-4 bg-[#006d37] text-white rounded p-3 text-xs flex items-center gap-1.5 shadow-md">
                    <ShieldCheck className="w-4 h-4 text-[#91f8ad]" />
                    <span>AI ingestion verification check: 100% OK</span>
                  </div>
                </div>
              ) : (
                /* Preplay overlay button */
                <button 
                  onClick={() => setIsVideoPlaying(true)}
                  className="w-16 h-16 bg-[#003482]/90 hover:bg-[#003482] backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all z-10 shadow-lg cursor-pointer transform hover:scale-105 active:scale-95 duration-150"
                >
                  <Play className="w-8 h-8 fill-white ml-1" />
                </button>
              )}

              {/* Patient HIPAA verified badge overlay */}
              <div className="absolute bottom-4 left-4 bg-[#91f8ad]/90 backdrop-blur-md border border-[#00743b]/10 px-3 py-1.5 rounded-lg flex items-center gap-1.5 z-10 text-[11px] font-bold text-[#00743b]">
                <ShieldCheck className="w-4 h-4" />
                <span>AI Verified: Ingestion Confirmed</span>
              </div>
            </div>

            {/* Dismiss controls */}
            <div className="p-4 bg-[#f8f9ff] border-t border-[#c3c6d5] flex justify-end gap-2">
              <button 
                onClick={() => setSelectedLog(null)}
                className="px-5 py-2 bg-[#003482] hover:bg-[#0c4aac] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer active:scale-95 duration-150"
              >
                Close Logs Check
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
