import React, { useState } from 'react';
import { MedicationRecord, ScheduleRecord } from '../types';
import { 
  Pill, 
  Plus, 
  Search, 
  Clock, 
  CheckCircle2, 
  Wifi, 
  Sliders, 
  Server, 
  Check, 
  X,
  AlertTriangle,
  Calendar,
  Layers,
  Trash2,
  RefreshCw,
  Zap
} from 'lucide-react';

interface MedicationsViewProps {
  medications: MedicationRecord[];
  schedules: ScheduleRecord[];
  patientId: string;
  isCaregiver: boolean;
  onCreateMedication: (data: { name: string; dosage?: string; form?: string; instructions?: string; prescribing_doctor?: string }) => Promise<any>;
  onDeleteMedication: (medicationId: string) => Promise<any>;
  onCreateSchedule: (data: {
    compartment: string;
    medication_ids: string[];
    dispense_time: string;
    frequency?: 'daily' | 'specific_days' | 'as_needed';
    days_of_week?: string[];
    start_date?: string;
  }) => Promise<any>;
  onDeleteSchedule: (scheduleId: string) => Promise<any>;
  onForceSyncSchedule: () => Promise<any>;
}

export default function MedicationsView({
  medications,
  schedules,
  patientId,
  isCaregiver,
  onCreateMedication,
  onDeleteMedication,
  onCreateSchedule,
  onDeleteSchedule,
  onForceSyncSchedule,
}: MedicationsViewProps) {
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddMedModal, setShowAddMedModal] = useState(false);
  const [showAddScheduleModal, setShowAddScheduleModal] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // New Medication Form State
  const [medName, setMedName] = useState('');
  const [dosage, setDosage] = useState('');
  const [medForm, setMedForm] = useState('Tablet');
  const [instructions, setInstructions] = useState('');
  const [doctor, setDoctor] = useState('');
  const [isSavingMed, setIsSavingMed] = useState(false);

  // New Schedule Form State (7 Compartments A–G)
  const [selectedCompartment, setSelectedCompartment] = useState<'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G'>('A');
  const [selectedMedIds, setSelectedMedIds] = useState<string[]>([]);
  const [dispenseTime, setDispenseTime] = useState('08:00');
  const [frequency, setFrequency] = useState<'daily' | 'specific_days' | 'as_needed'>('daily');
  const [selectedDays, setSelectedDays] = useState<string[]>(['mon', 'wed', 'fri']);
  const [isSavingSchedule, setIsSavingSchedule] = useState(false);

  const COMPARTMENTS: ('A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G')[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  const DAYS_LIST = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

  const handleSaveMedicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!medName.trim()) return;
    setIsSavingMed(true);
    try {
      await onCreateMedication({
        name: medName.trim(),
        dosage: dosage || undefined,
        form: medForm || undefined,
        instructions: instructions || undefined,
        prescribing_doctor: doctor || undefined
      });
      setMedName('');
      setDosage('');
      setInstructions('');
      setDoctor('');
      setShowAddMedModal(false);
    } catch (err) {
      alert('Failed to save prescription to database.');
    } finally {
      setIsSavingMed(false);
    }
  };

  const handleSaveScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMedIds.length === 0) {
      alert('Select at least one medication to bundle into this compartment.');
      return;
    }
    setIsSavingSchedule(true);
    try {
      await onCreateSchedule({
        compartment: selectedCompartment,
        medication_ids: selectedMedIds,
        dispense_time: dispenseTime,
        frequency,
        days_of_week: frequency === 'specific_days' ? selectedDays : undefined,
        start_date: new Date().toISOString().split('T')[0]
      });
      setShowAddScheduleModal(false);
    } catch (err: any) {
      alert(err.message || 'Failed to assign schedule to compartment.');
    } finally {
      setIsSavingSchedule(false);
    }
  };

  const handleSyncClick = async () => {
    setIsSyncing(true);
    try {
      await onForceSyncSchedule();
      alert('7-Compartment schedule configuration re-pushed to hardware device over WebSocket.');
    } catch (err) {
      alert('Failed to sync schedule to device.');
    } finally {
      setIsSyncing(false);
    }
  };

  const filteredMeds = medications.filter(med => 
    med.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (med.dosage && med.dosage.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (med.instructions && med.instructions.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div id="medications-tab-panel" className="space-y-6">
      
      {/* 1. TOP NAVBAR HEADER PANEL */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#c3c6d5]">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#0f1c2d]">Prescriptions & 7-Compartment Schedules</h2>
          <p className="text-[#434652] text-sm mt-1">Manage active patient medications and map them to physical dispenser compartments A through G.</p>
        </div>

        {isCaregiver && (
          <div className="flex gap-2">
            <button 
              onClick={handleSyncClick}
              disabled={isSyncing}
              className="px-4 py-2 border border-[#c3c6d5] bg-white rounded-lg font-bold text-xs hover:bg-[#eff4ff] text-[#003482] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              Push Sync to Device
            </button>
            <button 
              onClick={() => setShowAddMedModal(true)}
              className="bg-[#003482] text-white py-2 px-4 rounded-lg font-bold text-xs hover:bg-[#0c4aac] transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 duration-150"
            >
              <Plus className="w-4 h-4" />
              New Medication
            </button>
          </div>
        )}
      </header>

      {/* 2. 7-COMPARTMENT PHYSICAL DISPENSER STATUS BAR */}
      <section className="bg-white border border-[#c3c6d5] rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-[#c3c6d5] pb-3">
          <h3 className="text-sm font-bold text-[#0f1c2d] flex items-center gap-2">
            <Server className="w-4.5 h-4.5 text-[#003482]" />
            7-Compartment Hardware Dispenser Layout (Units A – G)
          </h3>
          {isCaregiver && (
            <button 
              onClick={() => setShowAddScheduleModal(true)}
              className="text-xs font-bold text-[#003482] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Configure Compartment
            </button>
          )}
        </div>

        {/* 7 Compartment Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {COMPARTMENTS.map((comp) => {
            const sch = schedules.find(s => s.compartment === comp && s.active);
            return (
              <div 
                key={comp}
                className={`p-3 rounded-lg border flex flex-col justify-between transition-all ${
                  sch 
                    ? 'bg-[#f8f9ff] border-[#003482]' 
                    : 'bg-white border-[#c3c6d5] opacity-75'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-extrabold text-sm text-[#003482]">Slot {comp}</span>
                    <span className={`w-2 h-2 rounded-full ${sch ? 'bg-[#006d37]' : 'bg-gray-300'}`}></span>
                  </div>

                  {sch ? (
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-[#0f1c2d] truncate">
                        {sch.medication_names.join(', ')}
                      </p>
                      <div className="flex items-center gap-1 text-[10px] text-[#737784] font-mono">
                        <Clock className="w-3 h-3 text-[#003482]" />
                        {sch.dispense_time}
                      </div>
                      <span className="inline-block text-[9px] font-bold text-[#00743b] uppercase">
                        {sch.frequency}
                      </span>
                    </div>
                  ) : (
                    <p className="text-[11px] text-[#737784] italic">Unassigned</p>
                  )}
                </div>

                {sch && isCaregiver && (
                  <button 
                    onClick={() => {
                      if (confirm(`Remove schedule for Compartment ${comp}?`)) {
                        onDeleteSchedule(sch.id);
                      }
                    }}
                    className="mt-2 text-[10px] text-[#ba1a1a] hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    Unbind
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. BENTO LAYOUT: DRUG CATALOG LIST */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-bold text-[#0f1c2d]">Prescription Catalog</h3>

          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#737784]" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter medications..."
              className="w-full pl-9 pr-3 py-1.5 border border-[#c3c6d5] rounded text-xs outline-none focus:border-[#003482]"
            />
          </div>
        </div>

        {filteredMeds.length === 0 ? (
          <div className="bg-[#eff4ff] border border-dashed border-[#c3c6d5] rounded-xl p-10 text-center text-[#737784]">
            <Pill className="w-10 h-10 mx-auto text-[#737784] mb-2 opacity-50" />
            <p className="font-semibold text-xs">No registered medications found.</p>
            {isCaregiver && (
              <button 
                onClick={() => setShowAddMedModal(true)}
                className="mt-3 bg-[#003482] text-white px-4 py-2 rounded text-xs font-bold cursor-pointer inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Add First Medication
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMeds.map((med) => (
              <div 
                key={med.id}
                className="bg-white border border-[#c3c6d5] rounded-xl p-5 hover:border-[#003482] transition-all shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#e6eeff] border border-[#dce9ff] flex items-center justify-center text-[#003482]">
                        <Pill className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#0f1c2d]">{med.name}</h4>
                        <p className="text-xs text-[#737784]">{med.dosage} • {med.form || 'Tablet'}</p>
                      </div>
                    </div>

                    {isCaregiver && (
                      <button 
                        onClick={() => {
                          if (confirm(`Remove ${med.name} from catalog?`)) {
                            onDeleteMedication(med.id);
                          }
                        }}
                        className="p-1 text-[#ba1a1a] hover:bg-red-50 rounded cursor-pointer"
                        title="Delete Medication"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {med.instructions && (
                    <p className="text-xs text-[#434652] italic my-2 bg-gray-50 p-2.5 rounded border border-gray-100">
                      "{med.instructions}"
                    </p>
                  )}
                  {med.prescribing_doctor && (
                    <span className="text-[10px] text-[#737784]">Prescribed by: {med.prescribing_doctor}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL: ADD MEDICATION */}
      {showAddMedModal && (
        <div className="fixed inset-0 bg-[#0f1c2d]/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-xl border border-[#c3c6d5] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#c3c6d5] flex justify-between items-center bg-[#f8f9ff]">
              <h3 className="text-base font-bold text-[#0f1c2d]">Add New Medication</h3>
              <button onClick={() => setShowAddMedModal(false)} className="text-[#737784] hover:bg-gray-200 p-1 rounded-full cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMedicationSubmit} className="p-6 space-y-4 text-xs text-[#0f1c2d]">
              <div>
                <label className="block text-xs font-bold mb-1">Medication Name *</label>
                <input 
                  type="text" 
                  value={medName}
                  onChange={(e) => setMedName(e.target.value)}
                  placeholder="e.g. Lisinopril"
                  required
                  className="w-full h-10 px-3 border border-[#c3c6d5] rounded focus:border-[#003482] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">Dosage Strength</label>
                  <input 
                    type="text" 
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    placeholder="e.g. 10mg"
                    className="w-full h-10 px-3 border border-[#c3c6d5] rounded focus:border-[#003482] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">Form</label>
                  <select 
                    value={medForm}
                    onChange={(e) => setMedForm(e.target.value)}
                    className="w-full h-10 px-2 border border-[#c3c6d5] rounded bg-white outline-none focus:border-[#003482]"
                  >
                    <option value="Tablet">Tablet</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Liquid">Liquid</option>
                    <option value="Inhaler">Inhaler</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Prescribing Doctor</label>
                <input 
                  type="text" 
                  value={doctor}
                  onChange={(e) => setDoctor(e.target.value)}
                  placeholder="Dr. Sarah Jenkins, MD"
                  className="w-full h-10 px-3 border border-[#c3c6d5] rounded focus:border-[#003482] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Instructions</label>
                <textarea 
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  rows={2}
                  placeholder="Take 1 tablet by mouth daily in the morning with water."
                  className="w-full p-2.5 border border-[#c3c6d5] rounded focus:border-[#003482] outline-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setShowAddMedModal(false)}
                  className="px-4 py-2 border border-[#c3c6d5] rounded text-xs font-bold hover:bg-gray-100 text-[#434652]"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSavingMed}
                  className="px-5 py-2 bg-[#003482] text-white hover:bg-[#0c4aac] font-bold rounded text-xs transition-all cursor-pointer"
                >
                  {isSavingMed ? 'Saving...' : 'Add Medication'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / UPDATE SCHEDULE (COMPARTMENTS A–G) */}
      {showAddScheduleModal && (
        <div className="fixed inset-0 bg-[#0f1c2d]/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-xl border border-[#c3c6d5] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#c3c6d5] flex justify-between items-center bg-[#f8f9ff]">
              <h3 className="text-base font-bold text-[#0f1c2d]">Assign 7-Compartment Hardware Schedule</h3>
              <button onClick={() => setShowAddScheduleModal(false)} className="text-[#737784] hover:bg-gray-200 p-1 rounded-full cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveScheduleSubmit} className="p-6 space-y-4 text-xs text-[#0f1c2d]">
              
              {/* Compartment Picker A-G */}
              <div>
                <label className="block text-xs font-bold mb-1">Select Hardware Compartment (A – G) *</label>
                <div className="grid grid-cols-7 gap-2">
                  {COMPARTMENTS.map((comp) => (
                    <button
                      key={comp}
                      type="button"
                      onClick={() => setSelectedCompartment(comp)}
                      className={`py-2 rounded font-bold text-xs border cursor-pointer ${
                        selectedCompartment === comp 
                          ? 'bg-[#003482] text-white border-[#003482]' 
                          : 'bg-white text-[#0f1c2d] border-[#c3c6d5]'
                      }`}
                    >
                      {comp}
                    </button>
                  ))}
                </div>
              </div>

              {/* Medication Multi Select */}
              <div>
                <label className="block text-xs font-bold mb-1">Select Bundled Medication(s) *</label>
                <div className="space-y-2 border border-[#c3c6d5] p-3 rounded max-h-36 overflow-y-auto">
                  {medications.map((m) => {
                    const isChecked = selectedMedIds.includes(m.id);
                    return (
                      <label key={m.id} className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedMedIds(prev => [...prev, m.id]);
                            } else {
                              setSelectedMedIds(prev => prev.filter(id => id !== m.id));
                            }
                          }}
                          className="rounded text-[#003482]"
                        />
                        <span className="font-semibold text-xs text-[#0f1c2d]">{m.name} ({m.dosage || 'Standard'})</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">Dispense Time (HH:MM 24h) *</label>
                  <input 
                    type="time" 
                    value={dispenseTime}
                    onChange={(e) => setDispenseTime(e.target.value)}
                    required
                    className="w-full h-10 px-3 border border-[#c3c6d5] rounded focus:border-[#003482] outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">Frequency</label>
                  <select 
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as any)}
                    className="w-full h-10 px-2 border border-[#c3c6d5] rounded bg-white outline-none focus:border-[#003482]"
                  >
                    <option value="daily">Daily</option>
                    <option value="specific_days">Specific Days</option>
                    <option value="as_needed">As Needed (PRN)</option>
                  </select>
                </div>
              </div>

              {frequency === 'specific_days' && (
                <div>
                  <label className="block text-xs font-bold mb-1">Select Active Days</label>
                  <div className="flex gap-1.5 flex-wrap">
                    {DAYS_LIST.map((d) => {
                      const active = selectedDays.includes(d);
                      return (
                        <button
                          key={d}
                          type="button"
                          onClick={() => {
                            if (active) {
                              setSelectedDays(prev => prev.filter(item => item !== d));
                            } else {
                              setSelectedDays(prev => [...prev, d]);
                            }
                          }}
                          className={`px-3 py-1 rounded text-xs font-bold uppercase border cursor-pointer ${
                            active ? 'bg-[#003482] text-white border-[#003482]' : 'bg-gray-100 text-[#737784] border-[#c3c6d5]'
                          }`}
                        >
                          {d}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setShowAddScheduleModal(false)}
                  className="px-4 py-2 border border-[#c3c6d5] rounded text-xs font-bold hover:bg-gray-100 text-[#434652]"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSavingSchedule}
                  className="px-5 py-2 bg-[#003482] text-white hover:bg-[#0c4aac] font-bold rounded text-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Wifi className="w-3.5 h-3.5" />
                  {isSavingSchedule ? 'Syncing...' : 'Save & Push Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
