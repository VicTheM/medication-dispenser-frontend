import React, { useState } from 'react';
import { DeviceStatus, TelemetryRecord } from '../types';
import { 
  Server, 
  Wifi, 
  Battery, 
  RefreshCw, 
  RotateCcw, 
  Play, 
  Sliders, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  Radio, 
  Cpu, 
  Zap, 
  ShieldCheck, 
  Clock,
  Plus
} from 'lucide-react';

interface HardwareViewProps {
  device: DeviceStatus | null;
  telemetry: TelemetryRecord[];
  patientName: string;
  onAssignDevice: (deviceUid: string) => Promise<any>;
  onSendCommand: (deviceUid: string, commandType: string, payload?: Record<string, any>) => Promise<any>;
  onRefreshDevice: () => void;
  isCaregiver: boolean;
}

export default function HardwareView({
  device,
  telemetry,
  patientName,
  onAssignDevice,
  onSendCommand,
  onRefreshDevice,
  isCaregiver,
}: HardwareViewProps) {
  const [deviceUidInput, setDeviceUidInput] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);
  const [commandLog, setCommandLog] = useState<{ id: string; time: string; text: string; status: 'pending' | 'delivered' | 'failed' }[]>([]);
  const [selectedCompartment, setSelectedCompartment] = useState<'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G'>('A');

  const COMPARTMENTS: ('A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G')[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deviceUidInput.trim()) return;
    setIsAssigning(true);
    try {
      const res = await onAssignDevice(deviceUidInput.trim());
      if (res.device_secret) {
        alert(`Hardware Device Assigned Successfully!\nDevice UID: ${res.device_uid}\nDevice Secret: ${res.device_secret}\n(Secret is used for provisioning hardware firmware).`);
      } else {
        alert(`Device ${deviceUidInput} assigned to ${patientName}.`);
      }
      setDeviceUidInput('');
    } catch (err) {
      alert('Failed to assign device. Make sure Device UID is valid.');
    } finally {
      setIsAssigning(false);
    }
  };

  const handleExecuteCommand = async (type: string, payload?: Record<string, any>) => {
    if (!device?.device_uid) {
      alert('No device currently paired with this patient.');
      return;
    }

    const timeStr = new Date().toLocaleTimeString();
    const cmdId = `cmd-${Date.now()}`;
    const logText = type === 'manual_dispense' 
      ? `Manual Dispense Compartment ${payload?.compartment}` 
      : `Command ${type}`;

    setCommandLog(prev => [{ id: cmdId, time: timeStr, text: logText, status: 'pending' }, ...prev]);

    try {
      const res = await onSendCommand(device.device_uid, type, payload);
      const delivered = res?.delivered ?? true;

      setCommandLog(prev => prev.map(item => {
        if (item.id === cmdId) {
          return {
            ...item,
            status: delivered ? 'delivered' : 'failed'
          };
        }
        return item;
      }));

      if (!delivered) {
        alert(`Device Command "${type}" was sent, but unit reported offline. Command will be processed when unit reconnects.`);
      }
    } catch (err) {
      setCommandLog(prev => prev.map(item => item.id === cmdId ? { ...item, status: 'failed' } : item));
    }
  };

  const latestTelemetry = telemetry[0] || null;

  return (
    <div id="hardware-tab-panel" className="space-y-6">
      
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#c3c6d5]">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#0f1c2d]">7-Compartment Hardware Dispenser</h2>
          <p className="text-[#434652] text-sm mt-1">Real-time telemetry, BLE/WiFi link diagnostics, and remote WebSocket command hub for {patientName}.</p>
        </div>

        <button 
          onClick={onRefreshDevice}
          className="px-4 py-2 border border-[#c3c6d5] bg-white rounded-lg font-bold text-xs hover:bg-[#eff4ff] text-[#0f1c2d] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <RefreshCw className="w-4 h-4 text-[#003482]" />
          Refresh Status
        </button>
      </header>

      {/* Claim / Assign Hardware Form (if no device paired or caregiver wants to update) */}
      {(!device || isCaregiver) && (
        <section className="bg-white border border-[#c3c6d5] rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-[#0f1c2d] mb-2 flex items-center gap-2">
            <Cpu className="w-4.5 h-4.5 text-[#003482]" />
            Pair Physical Hardware Unit
          </h3>
          <p className="text-xs text-[#737784] mb-4">
            Enter the <strong>Device UID</strong> (printed on the serial barcode label / QR code on the physical 7-compartment hardware unit).
          </p>

          <form onSubmit={handleAssignSubmit} className="flex flex-col sm:flex-row gap-3">
            <input 
              type="text" 
              value={deviceUidInput}
              onChange={(e) => setDeviceUidInput(e.target.value)}
              placeholder="e.g. DISPENSER-M42-7C"
              className="flex-1 px-3 py-2 border border-[#c3c6d5] rounded focus:border-[#003482] outline-none text-xs font-mono"
            />
            <button 
              type="submit"
              disabled={isAssigning || !deviceUidInput.trim()}
              className="bg-[#003482] text-white py-2 px-5 rounded font-bold text-xs hover:bg-[#0c4aac] transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {isAssigning ? 'Pairing...' : 'Assign Hardware Unit'}
            </button>
          </form>
        </section>
      )}

      {/* Active Device Overview Bento */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Device Status Card (span 7) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          <section className="bg-white border border-[#c3c6d5] rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6 border-b border-[#c3c6d5] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#e6eeff] border border-[#dce9ff] text-[#003482] rounded-lg flex items-center justify-center">
                  <Server className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0f1c2d]">
                    {device?.device_uid || 'Unit M-42 (7-Compartment)'}
                  </h3>
                  <p className="text-xs text-[#737784] font-mono">Assigned to: {patientName}</p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2 bg-[#e6eeff] px-3 py-1.5 rounded-full border border-[#c3c6d5]">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  device?.status === 'online' ? 'bg-[#006d37] animate-pulse shadow-[0_0_8px_rgba(0,109,55,0.4)]' : 'bg-[#ba1a1a]'
                }`}></span>
                <span className="text-xs font-bold uppercase tracking-wider text-[#0f1c2d]">
                  {device?.status || 'Online'}
                </span>
              </div>
            </div>

            {/* Hardware Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-[#f8f9ff] border border-[#c3c6d5] p-3 rounded-lg">
                <div className="flex items-center justify-between text-[#737784] mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Battery</span>
                  <Battery className="w-4 h-4 text-[#006d37]" />
                </div>
                <p className="text-lg font-bold text-[#0f1c2d]">
                  {device?.battery_level != null ? `${device.battery_level}%` : 'Unknown'}
                </p>
                <span className="text-[10px] text-[#006d37] font-semibold">Battery Level</span>
              </div>

              <div className="bg-[#f8f9ff] border border-[#c3c6d5] p-3 rounded-lg">
                <div className="flex items-center justify-between text-[#737784] mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider">WiFi SSID</span>
                  <Wifi className="w-4 h-4 text-[#003482]" />
                </div>
                <p className="text-xs font-bold text-[#0f1c2d] truncate font-mono">
                  {device?.wifi_ssid || 'Unavailable'}
                </p>
                <span className="text-[10px] text-[#737784] font-semibold">WiFi SSID</span>
              </div>

              <div className="bg-[#f8f9ff] border border-[#c3c6d5] p-3 rounded-lg">
                <div className="flex items-center justify-between text-[#737784] mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Firmware</span>
                  <Cpu className="w-4 h-4 text-[#003482]" />
                </div>
                <p className="text-xs font-bold text-[#0f1c2d] font-mono truncate">
                  {device?.firmware_version || 'Unavailable'}
                </p>
                <span className="text-[10px] text-[#00743b] font-semibold">Firmware Version</span>
              </div>

              <div className="bg-[#f8f9ff] border border-[#c3c6d5] p-3 rounded-lg">
                <div className="flex items-center justify-between text-[#737784] mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Uptime</span>
                  <Clock className="w-4 h-4 text-[#737784]" />
                </div>
                <p className="text-xs font-bold text-[#0f1c2d] font-mono">
                  {device?.uptime_seconds ? `${Math.floor(device.uptime_seconds / 3600)}h` : 'Unavailable'}
                </p>
                <span className="text-[10px] text-[#737784] font-semibold">Uptime</span>
              </div>
            </div>

            {/* Telemetry live status bars */}
            {latestTelemetry && (
              <div className="border-t border-gray-100 pt-4 space-y-2 text-xs">
                <h4 className="font-bold text-[#003482] text-[11px] uppercase tracking-wider">Live Sensor Telemetry</h4>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-gray-50 border p-2 rounded">
                    <span className="text-[10px] text-[#737784] block">Motor Status</span>
                    <span className="font-bold text-[#006d37]">{latestTelemetry.motor_status || 'Ready'}</span>
                  </div>
                  <div className="bg-gray-50 border p-2 rounded">
                    <span className="text-[10px] text-[#737784] block">Person Presence</span>
                    <span className="font-bold text-[#003482]">
                      {latestTelemetry.person_detected ? 'Detected' : 'Searching'}
                    </span>
                  </div>
                  <div className="bg-gray-50 border p-2 rounded">
                    <span className="text-[10px] text-[#737784] block">Tray Position</span>
                    <span className="font-bold text-[#0f1c2d] capitalize">{latestTelemetry.tray_state || 'Closed'}</span>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Compartments Selector & Manual Trigger */}
          {isCaregiver && (
            <section className="bg-white border border-[#c3c6d5] rounded-xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-[#0f1c2d] flex items-center gap-2">
                <Zap className="w-4.5 h-4.5 text-[#003482]" />
                Manual Compartment Release Control
              </h3>
              <p className="text-xs text-[#737784]">
                Select a compartment (A through G) to send a remote manual release signal to the hardware unit.
              </p>

              {/* 7 Compartment Buttons */}
              <div className="grid grid-cols-7 gap-2">
                {COMPARTMENTS.map((comp) => {
                  const isSelected = selectedCompartment === comp;
                  return (
                    <button
                      key={comp}
                      type="button"
                      onClick={() => setSelectedCompartment(comp)}
                      className={`py-3 rounded-lg text-center font-bold text-sm transition-all border cursor-pointer ${
                        isSelected 
                          ? 'bg-[#003482] text-white border-[#003482] shadow-sm scale-105' 
                          : 'bg-white text-[#0f1c2d] border-[#c3c6d5] hover:bg-[#eff4ff]'
                      }`}
                    >
                      Comp {comp}
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between items-center bg-[#f8f9ff] border border-[#c3c6d5] p-4 rounded-lg">
                <div>
                  <span className="text-xs font-bold text-[#0f1c2d]">Target: Compartment {selectedCompartment}</span>
                  <p className="text-[11px] text-[#737784]">Sends immediate stepper motor actuation payload.</p>
                </div>

                <button 
                  onClick={() => handleExecuteCommand('manual_dispense', { compartment: selectedCompartment })}
                  className="bg-[#003482] text-white py-2 px-5 rounded-lg text-xs font-bold hover:bg-[#0c4aac] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 duration-150"
                >
                  <Play className="w-4 h-4 fill-white" />
                  Dispense Compartment {selectedCompartment}
                </button>
              </div>
            </section>
          )}

        </div>

        {/* Right Column: WebSocket Command Dispatcher & Command Audit Log (span 5) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {isCaregiver && (
            <section className="bg-white border border-[#c3c6d5] rounded-xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-[#0f1c2d] flex items-center gap-2">
                <Sliders className="w-4.5 h-4.5 text-[#003482]" />
                Remote Command Dispatcher
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => handleExecuteCommand('update_schedule')}
                  className="p-3 border border-[#c3c6d5] bg-[#f8f9ff] hover:bg-[#eff4ff] rounded-lg text-xs font-bold text-[#003482] text-left transition-all cursor-pointer flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4 shrink-0" />
                  Push Schedule Sync
                </button>

                <button 
                  onClick={() => handleExecuteCommand('restart')}
                  className="p-3 border border-[#c3c6d5] bg-[#f8f9ff] hover:bg-amber-50 rounded-lg text-xs font-bold text-amber-800 text-left transition-all cursor-pointer flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4 shrink-0" />
                  Reboot Device
                </button>

                <button 
                  onClick={() => handleExecuteCommand('sync')}
                  className="p-3 border border-[#c3c6d5] bg-[#f8f9ff] hover:bg-[#eff4ff] rounded-lg text-xs font-bold text-[#003482] text-left transition-all cursor-pointer flex items-center gap-2"
                >
                  <Layers className="w-4 h-4 shrink-0" />
                  Sync Internal Partition
                </button>

                <button 
                  onClick={() => handleExecuteCommand('configure')}
                  className="p-3 border border-[#c3c6d5] bg-[#f8f9ff] hover:bg-[#eff4ff] rounded-lg text-xs font-bold text-[#003482] text-left transition-all cursor-pointer flex items-center gap-2"
                >
                  <Sliders className="w-4 h-4 shrink-0" />
                  Configure Calibration
                </button>
              </div>
            </section>
          )}

          {/* Command Audit Log */}
          <section className="bg-white border border-[#c3c6d5] rounded-xl p-6 shadow-sm flex-1">
            <h3 className="text-xs font-bold text-[#434652] uppercase tracking-wider mb-4">Command Execution Audit Log</h3>
            
            {commandLog.length === 0 ? (
              <div className="text-center py-8 text-[#737784] text-xs">
                No commands dispatched in current session.
              </div>
            ) : (
              <ul className="space-y-3">
                {commandLog.map((log) => (
                  <li key={log.id} className="p-3 bg-[#f8f9ff] border border-[#c3c6d5] rounded-lg flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-[#0f1c2d]">{log.text}</p>
                      <span className="text-[10px] text-[#737784]">{log.time}</span>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      log.status === 'delivered' 
                        ? 'bg-[#91f8ad] text-[#00743b]' 
                        : log.status === 'failed' 
                          ? 'bg-red-100 text-[#ba1a1a]' 
                          : 'bg-amber-100 text-amber-800 animate-pulse'
                    }`}>
                      {log.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

        </div>

      </div>

    </div>
  );
}
