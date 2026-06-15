import React, { useState } from 'react';
import { Medication } from '../types';
import { 
  Pill, 
  Plus, 
  Search, 
  Bell, 
  Cpu, 
  Clock, 
  CheckCircle2, 
  Volume2, 
  Wifi, 
  Sliders, 
  Layers, 
  Server, 
  Check, 
  X,
  AlertTriangle
} from 'lucide-react';

interface MedicationsViewProps {
  medications: Medication[];
  onAddMedication: (med: Omit<Medication, 'id' | 'status'>) => void;
  showAddModal: boolean;
  setShowAddModal: (show: boolean) => void;
}

export default function MedicationsView({
  medications,
  onAddMedication,
  showAddModal,
  setShowAddModal
}: MedicationsViewProps) {
  
  // Local UI Filter and state
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal Fields State
  const [medName, setMedName] = useState('');
  const [dosage, setDosage] = useState('');
  const [medForm, setMedForm] = useState<'Tablet' | 'Capsule' | 'Liquid' | 'Inhaler'>('Tablet');
  const [frequency, setFrequency] = useState<'Once daily' | 'Twice daily' | 'Three times daily' | 'custom'>('Once daily');
  const [dispenseTime, setDispenseTime] = useState('08:00');
  const [pillsCount, setPillsCount] = useState(1);
  const [assignedCompartment, setAssignedCompartment] = useState<number>(4);
  const [purposeText, setPurposeText] = useState('');

  // Simulating hardware sync loading state
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncPhase, setSyncPhase] = useState<'idle' | 'syncing' | 'completed'>('idle');

  // Handle new medication saving
  const handleSaveMedication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medName.trim() || !dosage.trim()) {
      alert('Medication Name and Dosage value are required.');
      return;
    }

    setIsSyncing(true);
    setSyncPhase('syncing');

    // Simulate clinical Bluetooth handshake and sync sequence
    setTimeout(() => {
      setSyncPhase('completed');
      setTimeout(() => {
        // Build times array
        const times = [{ time: dispenseTime, pills: pillsCount }];
        
        // Add optional second/third slots if twice/three times daily is set
        if (frequency === 'Twice daily') {
          times.push({ time: '14:00', pills: pillsCount });
        } else if (frequency === 'Three times daily') {
          times.push({ time: '14:00', pills: pillsCount });
          times.push({ time: '20:00', pills: pillsCount });
        }

        onAddMedication({
          name: medName,
          dosage,
          form: medForm,
          frequency,
          times,
          compartment: assignedCompartment,
          totalLeft: 20, // initial stock capacity
          totalCapacity: 20,
          purpose: purposeText || `Take ${pillsCount} ${medForm.toLowerCase()}(s) for treatment.`
        });

        // Clear states and reset
        setMedName('');
        setDosage('');
        setPurposeText('');
        setAssignedCompartment(assignedCompartment === 4 ? 3 : 4); // alternate defaults
        setIsSyncing(false);
        setSyncPhase('idle');
        setShowAddModal(false);
      }, 1000);
    }, 1500);
  };

  // Filter list by clinical search input query string
  const filteredMeds = medications.filter(med => 
    med.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    med.dosage.toLowerCase().includes(searchQuery.toLowerCase()) ||
    med.purpose.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="medications-tab-panel" className="space-y-6">
      
      {/* 1. TOP NAVBAR HEADER PANEL */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#c3c6d5]">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#0f1c2d]">Medication Schedule</h2>
          <p className="text-[#434652] text-sm mt-1">Manage active prescriptions and automated hardware dispensing schedules.</p>
        </div>

        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-[#003482] text-white py-2 px-5 rounded-lg font-bold text-xs hover:bg-[#0c4aac] transition-all flex items-center gap-2 cursor-pointer shadow-sm active:scale-95 duration-150"
        >
          <Plus className="w-4 h-4" />
          Add Prescription
        </button>
      </header>

      {/* 2. LIVE SEARCH & FILTER OPTIONS BAR */}
      <div className="flex gap-3 bg-white border border-[#c3c6d5] rounded-lg p-3 shadow-none items-center">
        <div className="relative flex-1">
          <Search className="w-4.5 h-4.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#737784]" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[#c3c6d5] focus:border-[#003482] focus:ring-1 focus:ring-[#003482] outline-none text-xs rounded transition-all text-[#0f1c2d]"
            placeholder="Search medications by brand name or dosage..."
          />
        </div>
        <button className="hidden sm:flex border border-[#c3c6d5] hover:bg-[#eff4ff] text-[#0f1c2d] px-4 py-2 rounded text-xs items-center gap-1.5 font-bold transition-all">
          <Sliders className="w-4 h-4 text-[#737784]" />
          Filter Slots
        </button>
      </div>

      {/* 3. BENTO LAYOUT (SCHEDULE & HARDWARE SECTIONS) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: List of Drugs */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-base font-bold text-[#0f1c2d]">Registered Smart-Dispenser Drugs</h3>
          
          {filteredMeds.length === 0 ? (
            <div className="bg-[#eff4ff] border border-dashed border-[#c3c6d5] rounded-xl p-12 text-center text-[#737784]">
              <Pill className="w-12 h-12 mx-auto text-[#737784] mb-3 opacity-50" />
              <p className="font-semibold">No synchronized medications found.</p>
              <p className="text-xs text-[#434652] mt-1">Try adjusting your search criteria or register a new prescription in Slot 4.</p>
            </div>
          ) : (
            filteredMeds.map((med) => {
              const isNextUp = med.name === 'Metformin'; // Matches screenshot mock style perfectly
              return (
                <div 
                  key={med.id} 
                  className={`bg-white border text-[#0f1c2d] rounded-xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all hover:border-[#003482] relative ${
                    isNextUp ? 'border-l-4 border-l-[#003482]' : 'border-[#c3c6d5]'
                  }`}
                >
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[#eff4ff] border border-[#dce9ff] flex items-center justify-center text-[#003482] shrink-0">
                      <Pill className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h4 className="text-base font-bold">{med.name}</h4>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          isNextUp 
                            ? 'bg-[#dae2ff] text-[#003482]' 
                            : 'bg-[#91f8ad] text-[#00743b]'
                        }`}>
                          {isNextUp ? 'Next Up' : 'Active'}
                        </span>
                        <span className="text-[10px] font-bold font-mono text-[#737784] bg-gray-100 border border-gray-200 px-1.5 rounded">
                          Comp {med.compartment}
                        </span>
                      </div>
                      <p className="text-xs text-[#434652] font-semibold">{med.dosage} • {med.times[0].pills} {med.form} • {med.frequency}</p>
                      <p className="text-xs text-[#737784] mt-1.5 line-clamp-1 italic">{med.purpose}</p>
                    </div>
                  </div>

                  {/* Right schedule timing */}
                  <div className="flex flex-col sm:items-end w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Clock className={`w-4 h-4 ${isNextUp ? 'text-[#003482]' : 'text-[#434652]'}`} />
                      <span className={`text-sm font-bold ${isNextUp ? 'text-[#003482]' : 'text-[#0f1c2d]'}`}>
                        {med.times[0].time === '08:00' ? '08:00 AM' : med.times[0].time === '14:00' ? '02:00 PM' : med.times[0].time === '21:00' ? '09:00 PM' : med.times[0].time}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-[11px] font-semibold">
                      {isNextUp ? (
                        <span className="text-[#003482] flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 animate-pulse" /> Pending Auto Dispense
                        </span>
                      ) : (
                        <span className="text-[#006d37] flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Dispensed Today
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Hardware Status Panel Widget */}
        <div className="space-y-6">
          <section className="bg-white border border-[#c3c6d5] rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-[#0f1c2d] mb-4 flex items-center gap-2">
              <Server className="w-5 h-5 text-[#003482]" />
              Dispenser Hardware
            </h3>

            {/* Hardware ID and status bar */}
            <div className="bg-[#f8f9ff] border border-[#c3c6d5] p-3.5 rounded-lg mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-[#006d37] rounded-full inline-block animate-pulse shadow-[0_0_8px_rgba(0,109,55,0.4)]"></span>
                  <p className="text-xs font-bold text-[#0f1c2d]">Unit M-42 Online</p>
                </div>
                <span className="text-xs font-bold text-[#006d37]">Battery: 84%</span>
              </div>
              <p className="text-[10px] text-[#737784] font-semibold uppercase">BLE Signal Strength: -48dBm (Excellent)</p>
            </div>

            {/* Individual Compartments Capacity meters */}
            <div className="space-y-4">
              {medications.map((med) => {
                const percentLeft = (med.totalLeft / med.totalCapacity) * 100;
                const isCritical = med.totalLeft <= 5;
                return (
                  <div key={med.id} className="space-y-1 text-xs">
                    <div className="flex justify-between items-center text-[#434652]">
                      <span className="font-semibold">Compartment {med.compartment} ({med.name})</span>
                      <span className={`font-bold ${isCritical ? 'text-[#ba1a1a]' : 'text-[#0f1c2d]'}`}>
                        {med.totalLeft} left
                      </span>
                    </div>
                    {/* Progress track */}
                    <div className="w-full bg-[#eff4ff] rounded-full h-2 overflow-hidden border border-gray-100">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          isCritical ? 'bg-[#ba1a1a]' : 'bg-[#003482]'
                        }`} 
                        style={{ width: `${percentLeft}%` }}
                      ></div>
                    </div>
                    {isCritical && (
                      <p className="text-[10px] text-[#ba1a1a] font-bold flex items-center gap-1 mt-1">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> Restock required soon
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>

      </div>

      {/* 4. MODAL ADD NEW PRESCRIPTION DIALOG */}
      {showAddModal && (
        <div id="add-prescription-overlay" className="fixed inset-0 bg-[#0f1c2d]/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          
          <div className="bg-white w-full max-w-lg rounded-xl shadow-lg border border-[#c3c6d5] flex flex-col max-h-[90vh] overflow-hidden transform transition-all">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#c3c6d5] flex justify-between items-center bg-[#f8f9ff]">
              <div>
                <h3 className="text-base font-bold text-[#0f1c2d]">Add New Prescription</h3>
                <p className="text-xs text-[#737784]">Establish automated release database for Unit M-42.</p>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-[#737784] hover:bg-gray-200 p-1 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5.5 h-5.5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs text-[#0f1c2d]">
              
              {syncPhase === 'syncing' && (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
                  <div className="w-12 h-12 bg-[#dae2ff] rounded-full flex items-center justify-center animate-spin border-t-2 border-[#003482]">
                    <Layers className="w-6 h-6 text-[#003482]" />
                  </div>
                  <h4 className="font-bold text-sm text-[#003482]">Connecting to Smart-Dispenser...</h4>
                  <p className="text-xs text-[#434652] max-w-xs">Uploading encrypted dosage tables and local partition keys to Compartment {assignedCompartment}.</p>
                </div>
              )}

              {syncPhase === 'completed' && (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-3 bg-[#e8fbf0] rounded-xl border border-green-200">
                  <div className="w-12 h-12 bg-[#91f8ad] text-[#00743b] rounded-full flex items-center justify-center">
                    <Check className="w-6 h-6 font-extrabold" />
                  </div>
                  <h4 className="font-bold text-sm text-[#00743b]">Wireless Sync Completed!</h4>
                  <p className="text-xs text-[#434652] max-w-xs">Compartment {assignedCompartment} locking mechanisms test diagnostic has returned 100% OK.</p>
                </div>
              )}

              {syncPhase === 'idle' && (
                <form onSubmit={handleSaveMedication} className="space-y-4">
                  
                  {/* Brand info */}
                  <div className="space-y-3">
                    <h5 className="font-bold text-[#003482] uppercase tracking-wider text-[10px] border-b pb-1">Prescription Brand</h5>
                    
                    <div>
                      <label className="block text-xs font-bold mb-1">Medication Name</label>
                      <input 
                        type="text" 
                        value={medName} 
                        onChange={(e) => setMedName(e.target.value)}
                        placeholder="e.g., Amoxicillin" 
                        required
                        className="w-full text-xs h-10 px-3 border border-[#c3c6d5] rounded focus:border-[#003482] outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-35">
                      <div>
                        <label className="block text-xs font-bold mb-1">Dosage strength</label>
                        <input 
                          type="text" 
                          value={dosage} 
                          onChange={(e) => setDosage(e.target.value)}
                          placeholder="e.g., 250mg or 500mg" 
                          required
                          className="w-full text-xs h-10 px-3 border border-[#c3c6d5] rounded focus:border-[#003482] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold mb-1">Format Type</label>
                        <select 
                          value={medForm} 
                          onChange={(e) => setMedForm(e.target.value as any)}
                          className="w-full text-xs h-10 px-2 border border-[#c3c6d5] rounded bg-white outline-none focus:border-[#003482]"
                        >
                          <option value="Tablet">Tablet</option>
                          <option value="Capsule">Capsule</option>
                          <option value="Liquid">Liquid</option>
                          <option value="Inhaler">Inhaler</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Dispensing schedules */}
                  <div className="space-y-3 border-t pt-4">
                    <h5 className="font-bold text-[#003482] uppercase tracking-wider text-[10px] border-b pb-1">Dispensing times</h5>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold mb-1">Frequency</label>
                        <select 
                          value={frequency} 
                          onChange={(e) => setFrequency(e.target.value as any)}
                          className="w-full text-xs h-10 px-2 border border-[#c3c6d5] rounded bg-white outline-none focus:border-[#003482]"
                        >
                          <option value="Once daily">Once daily</option>
                          <option value="Twice daily">Twice daily</option>
                          <option value="Three times daily">Three times daily</option>
                        </select>
                      </div>

                      <div className="bg-[#f8f9ff] border border-[#c3c6d5] p-2.5 rounded flex items-center gap-2 justify-between">
                        <div>
                          <label className="block text-[10px] text-[#434652] font-semibold mb-0.5">Dispense Time</label>
                          <input 
                            type="time" 
                            value={dispenseTime} 
                            onChange={(e) => setDispenseTime(e.target.value)}
                            className="bg-white px-2 py-1 rounded text-xs border font-mono w-24 outline-none focus:border-[#003482]"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] text-[#434652] font-semibold mb-0.5">Pill count</label>
                          <input 
                            type="number" 
                            min="1" 
                            max="5"
                            value={String(pillsCount)} 
                            onChange={(e) => setPillsCount(Number(e.target.value))}
                            className="bg-white px-2 py-1 rounded text-xs border w-12 text-center outline-none focus:border-[#003482]"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold mb-1">Brief instructions</label>
                      <input 
                        type="text" 
                        value={purposeText} 
                        onChange={(e) => setPurposeText(e.target.value)}
                        placeholder="e.g. Take 1 tablet by mouth before bed." 
                        className="w-full text-xs h-10 px-3 border border-[#c3c6d5] rounded focus:border-[#003482] outline-none"
                      />
                    </div>
                  </div>

                  {/* Hardware Assignment */}
                  <div className="space-y-2 border-t pt-4">
                    <h5 className="font-bold text-[#003482] uppercase tracking-wider text-[10px]">Assign Compartment Slot</h5>
                    <div className="grid grid-cols-4 gap-2">
                      {[1, 2, 3, 4].map((slotNum) => {
                        const isSelected = assignedCompartment === slotNum;
                        return (
                          <button
                            key={slotNum}
                            type="button"
                            onClick={() => setAssignedCompartment(slotNum)}
                            className={`py-3 text-center text-sm font-bold border rounded transition-all cursor-pointer ${
                              isSelected 
                                ? 'bg-[#e6eeff] border-2 border-[#003482] text-[#003482]' 
                                : 'bg-white border-[#c3c6d5] hover:bg-gray-50'
                            }`}
                          >
                            {slotNum}
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-[10px] text-[#737784] italic">Unit M-42 has 4 active physical compartments. Allocate to Slot 3 or 4 for best clinical release response.</p>
                  </div>
                </form>
              )}

            </div>

            {/* Modal Footer */}
            {syncPhase === 'idle' && (
              <div className="px-6 py-4 border-t border-[#c3c6d5] flex justify-end gap-3 bg-[#f8f9ff]">
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-[#c3c6d5] hover:bg-gray-100 rounded text-xs font-bold transition-all text-[#434652] cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveMedication}
                  className="px-5 py-2 bg-[#003482] text-white hover:bg-[#0c4aac] font-bold rounded text-xs transition-all flex items-center gap-1 cursor-pointer active:scale-95 duration-150"
                >
                  <Wifi className="w-3.5 h-3.5" />
                  Save & Sync Dispenser
                </button>
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}
