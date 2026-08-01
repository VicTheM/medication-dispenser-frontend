import React, { useState, useMemo } from 'react';
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

  const videoMap = useMemo(() => new Map(videos.map((video) => [video.dispense_event_id, video])), [videos]);
  const selectedVideo = selectedLog ? videoMap.get(selectedLog.id) : null;

  const handleExportClick = () => {
    onExportCSV();
    alert(`MedLab Adherence Logs for ${patientName} exported to CSV.`);
  };

  // Calculate adherence rate
  const totalCount = dispenseLogs.length;
  const successCount = dispenseLogs.filter(l => l.status === 'success').length;
  const adherenceScore = totalCount > 0 ? Math.round((successCount / totalCount) * 100) : 0;

  const WEEK_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const dayCounts = useMemo(() => {
    const counts = [0, 0, 0, 0, 0, 0, 0];
    const jsDayToIndex = [6, 0, 1, 2, 3, 4, 5];
    dispenseLogs.forEach((log) => {
      const date = new Date(log.dispensed_at);
      const idx = jsDayToIndex[date.getDay()];
      if (idx != null) counts[idx] += 1;
    });
    return counts;
  }, [dispenseLogs]);
  const maxDayCount = Math.max(...dayCounts, 1);

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
            const count = dayCounts[idx];
            const heightPct = count > 0 ? Math.max(18, Math.round((count / maxDayCount) * 100)) : 18;
            return (
              <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end relative group cursor-pointer">
                <div 
                  className={`w-full max-w-[44px] rounded-t transition-all duration-500 ${
                    count === 0 
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
                  {selectedVideo ? (
                    <div className="w-full p-4 text-white text-center">
                      <p className="text-sm font-bold mb-2">Video ready for playback</p>
                      <p className="text-[11px] mb-3">Duration: {selectedVideo.duration_seconds}s · Person detected: {selectedVideo.person_detected ? 'Yes' : 'No'}</p>
                      <a 
                        href={selectedVideo.file_path.startsWith('http') ? selectedVideo.file_path : `${window.location.origin}${selectedVideo.file_path}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#91f8ad] text-[#003482] rounded-lg text-xs font-bold hover:bg-[#76e593]"
                      >
                        <Video className="w-4 h-4" />
                        Open Video File
                      </a>
                    </div>
                  ) : (
                    <div className="w-full p-4 text-white text-center">
                      <p className="text-sm font-bold mb-2">Video metadata not available</p>
                      <p className="text-[11px]">This dispense event has no linked video file in the current backend response.</p>
                    </div>
                  )}

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

      {videos.length > 0 && (
        <section className="bg-white border border-[#c3c6d5] rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#0f1c2d]">Adherence Video Library</h3>
              <p className="text-xs text-[#737784]">Recorded device videos for dispense events.</p>
            </div>
          </div>

          <div className="grid gap-3">
            {videos.map((video) => (
              <div key={video.id} className="bg-[#f8f9ff] border border-[#c3c6d5] rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-[#0f1c2d]">{video.file_path.split('/').pop() || video.file_path}</p>
                  <p className="text-[11px] text-[#737784]">Uploaded at {new Date(video.uploaded_at).toLocaleString()}</p>
                </div>
                <a
                  href={video.file_path.startsWith('http') ? video.file_path : `${window.location.origin}${video.file_path}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-[#003482] hover:underline"
                >
                  Open video file
                </a>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
