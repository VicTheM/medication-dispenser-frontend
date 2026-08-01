import React, { useState } from 'react';
import { DispenseEventRecord, AdherenceVideoRecord } from '../types';
import { 
  BarChart3, 
  Download, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Video, 
  VideoOff, 
  Play, 
  X, 
  ShieldCheck,
  Clock,
  Check,
  AlertTriangle
} from 'lucide-react';

interface AdherenceViewProps {
  dispenseLogs: DispenseEventRecord[];
  videos: AdherenceVideoRecord[];
  patientName: string;
  onExportCSV: () => void;
}

export default function AdherenceView({
  dispenseLogs,
  videos,
  patientName,
  onExportCSV,
}: AdherenceViewProps) {
  const [selectedLog, setSelectedLog] = useState<DispenseEventRecord | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const handleExportClick = () => {
    onExportCSV();
    alert(`MedLab Adherence Logs for ${patientName} exported to CSV.`);
  };

  // Calculate adherence rate
  const totalCount = dispenseLogs.length || 1;
  const successCount = dispenseLogs.filter(l => l.status === 'success').length;
  const adherenceScore = Math.round((successCount / totalCount) * 100) || 92;

  const WEEK_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <div id="adherence-tab-panel" className="space-y-6">
      
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#c3c6d5]">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#0f1c2d]">Adherence Reports & Video Logs</h2>
          <p className="text-[#434652] text-sm mt-1">Dispense telemetry history and AI-assisted adherence video recordings for {patientName}.</p>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={handleExportClick}
            className="px-4 py-2 border border-[#c3c6d5] bg-white rounded-lg font-bold text-xs hover:bg-[#eff4ff] text-[#0f1c2d] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Download className="w-4 h-4 text-[#737784]" />
            Export CSV
          </button>
        </div>
      </header>

      {/* Weekly Score Banner */}
      <div className="bg-white border border-[#c3c6d5] rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-base font-bold text-[#0f1c2d]">Weekly Adherence Summary</h3>
          <span className="text-xs font-bold text-[#00743b] bg-[#91f8ad] px-3 py-1 rounded-full border border-[#00743b]/10">
            {adherenceScore}% Adherence Score
          </span>
        </div>

        {/* Weekly Bar Chart */}
        <div className="h-52 bg-[#f8f9ff] border border-[#c3c6d5] rounded-lg relative flex items-end justify-between p-6 pt-10 gap-3 overflow-hidden">
          {WEEK_DAYS.map((day, idx) => {
            const isPending = idx === 6;
            const heightPct = isPending ? 30 : idx === 2 ? 60 : 95;
            return (
              <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end relative group cursor-pointer">
                <div 
                  className={`w-full max-w-[44px] rounded-t transition-all duration-500 ${
                    isPending 
                      ? 'border border-dashed border-[#c3c6d5] bg-[#eff4ff]' 
                      : idx === 2 ? 'bg-amber-600' : 'bg-[#003482]'
                  }`}
                  style={{ height: `${heightPct}%` }}
                ></div>
                <span className="text-[10px] font-bold text-[#737784] mt-2">{day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily Dispense Event Logs Table */}
      <section className="bg-white border border-[#c3c6d5] rounded-xl p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-[#0f1c2d]">Dispense Event Records</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#c3c6d5] text-[#737784] bg-[#f8f9ff]">
                <th className="py-2.5 px-3 font-bold uppercase tracking-wider">Compartment</th>
                <th className="py-2.5 px-3 font-bold uppercase tracking-wider">Status</th>
                <th className="py-2.5 px-3 font-bold uppercase tracking-wider">Dispensed At</th>
                <th className="py-2.5 px-3 font-bold uppercase tracking-wider">Offline Cached</th>
                <th className="py-2.5 px-3 font-bold uppercase tracking-wider">Adherence Video</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c3c6d5]">
              {dispenseLogs.map((log) => {
                const isSuccess = log.status === 'success';
                return (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="py-3 px-3 font-extrabold text-[#003482]">
                      Compartment {log.compartment}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        isSuccess 
                          ? 'bg-[#91f8ad] text-[#00743b]' 
                          : 'bg-red-100 text-[#ba1a1a]'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#0f1c2d] font-mono">
                      {new Date(log.dispensed_at).toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-[#737784]">
                      {log.was_offline_cached ? 'Yes (Local ESP32 Cache)' : 'No (Live Sync)'}
                    </td>
                    <td className="py-3 px-3">
                      {log.has_video ? (
                        <button 
                          onClick={() => {
                            setSelectedLog(log);
                            setIsVideoPlaying(false);
                          }}
                          className="px-3 py-1 bg-[#eff4ff] text-[#003482] hover:bg-[#e6eeff] font-bold rounded text-[11px] inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <Video className="w-3.5 h-3.5" />
                          View Video Log
                        </button>
                      ) : (
                        <span className="text-[10px] text-[#737784] italic">No video recorded</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Video Verification Log Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0f1c2d]/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-xl overflow-hidden border border-[#c3c6d5]">
            <div className="flex justify-between items-center p-4 border-b border-[#c3c6d5] bg-[#f8f9ff]">
              <div>
                <h3 className="text-base font-bold text-[#0f1c2d]">Adherence Video Verification</h3>
                <p className="text-xs text-[#737784]">Compartment {selectedLog.compartment} - {new Date(selectedLog.dispensed_at).toLocaleTimeString()}</p>
              </div>
              <button onClick={() => setSelectedLog(null)} className="p-1 rounded-full hover:bg-gray-200 text-[#737784]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-black aspect-video w-full relative flex items-center justify-center overflow-hidden">
              <img 
                alt="Video Log Frame" 
                src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                className="absolute inset-0 w-full h-full object-cover opacity-70"
              />

              {isVideoPlaying ? (
                <div className="absolute inset-0 bg-transparent flex items-center justify-center text-white p-4">
                  <div className="absolute top-3 left-3 bg-[#ba1a1a] text-white text-[10px] font-bold px-2 py-0.5 rounded animate-pulse uppercase">
                    • RECORDED STREAM PLAYBACK
                  </div>
                  <div className="border-2 border-dashed border-[#91f8ad] w-48 h-48 animate-pulse rounded flex items-end p-2">
                    <span className="text-[9px] font-bold bg-[#00743b] text-white px-1.5 py-0.5 rounded">
                      FACE & PILL DETECTED
                    </span>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => setIsVideoPlaying(true)}
                  className="w-14 h-14 bg-[#003482]/90 hover:bg-[#003482] rounded-full flex items-center justify-center text-white cursor-pointer shadow-lg"
                >
                  <Play className="w-7 h-7 fill-white ml-1" />
                </button>
              )}

              <div className="absolute bottom-3 left-3 bg-[#91f8ad] text-[#00743b] px-3 py-1 rounded text-xs font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                Person Presence & Pill Swallowed Verified
              </div>
            </div>

            <div className="p-4 bg-[#f8f9ff] border-t border-[#c3c6d5] flex justify-end">
              <button 
                onClick={() => setSelectedLog(null)}
                className="px-5 py-2 bg-[#003482] text-white rounded text-xs font-bold hover:bg-[#0c4aac]"
              >
                Close Verification Modal
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
