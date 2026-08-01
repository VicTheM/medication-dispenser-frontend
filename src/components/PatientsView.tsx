import React, { useState } from 'react';
import { PatientUser } from '../types';
import { 
  Users, 
  UserPlus, 
  Search, 
  Mail, 
  Phone, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Sparkles,
  Key
} from 'lucide-react';

interface PatientsViewProps {
  patients: PatientUser[];
  selectedPatientId: string;
  onSelectPatient: (patientId: string) => void;
  onEnrolPatient: (patient: {
    full_name: string;
    date_of_birth?: string;
    phone?: string;
    email?: string;
    password?: string;
    notes?: string;
    timezone?: string;
  }) => Promise<void>;
  onDeletePatient: (patientId: string) => Promise<void>;
  onUpdatePatient: (patientId: string, updates: Partial<PatientUser>) => Promise<void>;
}

export default function PatientsView({
  patients,
  selectedPatientId,
  onSelectPatient,
  onEnrolPatient,
  onDeletePatient,
  onUpdatePatient,
}: PatientsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showEnrolModal, setShowEnrolModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState<PatientUser | null>(null);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notes, setNotes] = useState('');
  const [timezone, setTimezone] = useState('America/New_York');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEnrolSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;
    setIsSubmitting(true);
    try {
      await onEnrolPatient({
        full_name: fullName,
        date_of_birth: dob || undefined,
        phone: phone || undefined,
        email: email || undefined,
        password: password || undefined,
        notes: notes || undefined,
        timezone: timezone || 'America/New_York'
      });
      // reset form
      setFullName('');
      setDob('');
      setPhone('');
      setEmail('');
      setPassword('');
      setNotes('');
      setShowEnrolModal(false);
    } catch (err) {
      alert('Error enrolling patient. Please check input values.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPatient) return;
    setIsSubmitting(true);
    try {
      await onUpdatePatient(editingPatient.id, {
        full_name: editingPatient.full_name,
        phone: editingPatient.phone,
        notes: editingPatient.notes,
        timezone: editingPatient.timezone
      });
      setEditingPatient(null);
    } catch (err) {
      alert('Failed to update patient record.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredPatients = patients.filter(p =>
    p.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.email && p.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (p.notes && p.notes.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div id="patients-tab-panel" className="space-y-6">
      
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#c3c6d5]">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#0f1c2d]">Enrolled Patients</h2>
          <p className="text-[#434652] text-sm mt-1">Manage clinical roster, patient credentials, and dispenser assignments.</p>
        </div>

        <button 
          onClick={() => setShowEnrolModal(true)}
          className="bg-[#003482] text-white py-2.5 px-5 rounded-lg font-bold text-xs hover:bg-[#0c4aac] transition-all flex items-center gap-2 cursor-pointer shadow-sm active:scale-95 duration-150"
        >
          <UserPlus className="w-4 h-4" />
          Enrol New Patient
        </button>
      </header>

      {/* Search Bar */}
      <div className="flex gap-3 bg-white border border-[#c3c6d5] rounded-lg p-3 shadow-none items-center">
        <div className="relative flex-1">
          <Search className="w-4.5 h-4.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#737784]" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[#c3c6d5] focus:border-[#003482] focus:ring-1 focus:ring-[#003482] outline-none text-xs rounded transition-all text-[#0f1c2d]"
            placeholder="Search patient name, email, or notes..."
          />
        </div>
      </div>

      {/* Patient Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPatients.map((patient) => {
          const isSelected = patient.id === selectedPatientId;
          return (
            <div 
              key={patient.id}
              className={`bg-white border rounded-xl p-5 transition-all shadow-sm flex flex-col justify-between relative ${
                isSelected ? 'border-2 border-[#003482] bg-[#f8f9ff]' : 'border-[#c3c6d5] hover:border-[#003482]'
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-[#e6eeff] border border-[#dce9ff] text-[#003482] rounded-full flex items-center justify-center font-bold text-base">
                      {patient.full_name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#0f1c2d] flex items-center gap-2">
                        {patient.full_name}
                        {isSelected && (
                          <span className="bg-[#91f8ad] text-[#00743b] text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                            Active Session
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-[#737784] font-mono">ID: {patient.id}</p>
                    </div>
                  </div>

                  <div className="flex gap-1">
                    <button 
                      onClick={() => setEditingPatient(patient)}
                      className="p-1.5 text-[#434652] hover:bg-gray-100 rounded cursor-pointer"
                      title="Edit Patient Details"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    {patients.length > 1 && (
                      <button 
                        onClick={() => {
                          if (confirm(`Remove ${patient.full_name} from roster?`)) {
                            onDeletePatient(patient.id);
                          }
                        }}
                        className="p-1.5 text-[#ba1a1a] hover:bg-red-50 rounded cursor-pointer"
                        title="Delete Patient"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Patient metadata list */}
                <div className="space-y-2 text-xs text-[#434652] my-4 bg-white p-3 rounded-lg border border-[#c3c6d5]">
                  {patient.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#737784]" />
                      <span className="font-mono">{patient.email}</span>
                    </div>
                  )}
                  {patient.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#737784]" />
                      <span>{patient.phone}</span>
                    </div>
                  )}
                  {patient.date_of_birth && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#737784]" />
                      <span>DOB: {patient.date_of_birth}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#737784]" />
                    <span>Timezone: {patient.timezone}</span>
                  </div>
                  {patient.notes && (
                    <div className="pt-2 border-t border-gray-100 text-[11px] text-[#0f1c2d] italic">
                      "{patient.notes}"
                    </div>
                  )}
                </div>
              </div>

              {/* Action */}
              <button 
                onClick={() => onSelectPatient(patient.id)}
                className={`w-full py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  isSelected 
                    ? 'bg-[#003482] text-white shadow-sm' 
                    : 'bg-[#eff4ff] text-[#003482] hover:bg-[#e6eeff]'
                }`}
              >
                {isSelected ? (
                  <>
                    <Check className="w-4 h-4" />
                    Currently Managing Schedule
                  </>
                ) : (
                  'Select Patient Workspace'
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Modal: Enrol Patient */}
      {showEnrolModal && (
        <div className="fixed inset-0 bg-[#0f1c2d]/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-xl border border-[#c3c6d5] overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-[#c3c6d5] flex justify-between items-center bg-[#f8f9ff]">
              <div>
                <h3 className="text-base font-bold text-[#0f1c2d]">Enrol New Clinical Patient</h3>
                <p className="text-xs text-[#737784]">Create clinical record and optional patient login access.</p>
              </div>
              <button onClick={() => setShowEnrolModal(false)} className="text-[#737784] hover:bg-gray-200 p-1 rounded-full cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEnrolSubmit} className="p-6 overflow-y-auto space-y-4 text-xs text-[#0f1c2d] flex-1">
              <div>
                <label className="block text-xs font-bold mb-1">Full Legal Name *</label>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Eleanor Vance" 
                  required
                  className="w-full h-10 px-3 border border-[#c3c6d5] rounded focus:border-[#003482] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">Date of Birth</label>
                  <input 
                    type="date" 
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full h-10 px-3 border border-[#c3c6d5] rounded focus:border-[#003482] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Phone Number</label>
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full h-10 px-3 border border-[#c3c6d5] rounded focus:border-[#003482] outline-none"
                  />
                </div>
              </div>

              <div className="space-y-3 border-t border-gray-100 pt-3">
                <h4 className="font-bold text-[#003482] text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5" />
                  Optional Patient Self-Login Credentials
                </h4>
                <div>
                  <label className="block text-xs font-bold mb-1">Patient Email Address</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="patient@example.com"
                    className="w-full h-10 px-3 border border-[#c3c6d5] rounded focus:border-[#003482] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Patient Login Password</label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    minLength={6}
                    className="w-full h-10 px-3 border border-[#c3c6d5] rounded focus:border-[#003482] outline-none"
                  />
                  <p className="text-[10px] text-[#737784] mt-1 italic">
                    If set, the patient can sign into the portal in read-only mode using these credentials.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 border-t border-gray-100 pt-3">
                <div>
                  <label className="block text-xs font-bold mb-1">Timezone</label>
                  <select 
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full h-10 px-2 border border-[#c3c6d5] rounded bg-white outline-none focus:border-[#003482]"
                  >
                    <option value="America/New_York">America/New_York (EST)</option>
                    <option value="America/Chicago">America/Chicago (CST)</option>
                    <option value="America/Denver">America/Denver (MST)</option>
                    <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Clinical Notes & Care Directives</label>
                  <textarea 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    placeholder="Care instructions, diagnosis, allergies, preferences..."
                    className="w-full p-3 border border-[#c3c6d5] rounded focus:border-[#003482] outline-none"
                  ></textarea>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-[#c3c6d5] flex justify-end gap-3 bg-[#f8f9ff] -mx-6 -mb-6">
                <button 
                  type="button"
                  onClick={() => setShowEnrolModal(false)}
                  className="px-4 py-2 border border-[#c3c6d5] rounded text-xs font-bold hover:bg-gray-100 text-[#434652]"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#003482] text-white hover:bg-[#0c4aac] font-bold rounded text-xs transition-all cursor-pointer"
                >
                  {isSubmitting ? 'Enrolling...' : 'Save & Enrol Patient'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Patient */}
      {editingPatient && (
        <div className="fixed inset-0 bg-[#0f1c2d]/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-xl border border-[#c3c6d5] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#c3c6d5] flex justify-between items-center bg-[#f8f9ff]">
              <h3 className="text-base font-bold text-[#0f1c2d]">Edit Patient Record</h3>
              <button onClick={() => setEditingPatient(null)} className="text-[#737784] hover:bg-gray-200 p-1 rounded-full cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4 text-xs text-[#0f1c2d]">
              <div>
                <label className="block text-xs font-bold mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={editingPatient.full_name}
                  onChange={(e) => setEditingPatient({ ...editingPatient, full_name: e.target.value })}
                  required
                  className="w-full h-10 px-3 border border-[#c3c6d5] rounded focus:border-[#003482] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Phone</label>
                <input 
                  type="text" 
                  value={editingPatient.phone || ''}
                  onChange={(e) => setEditingPatient({ ...editingPatient, phone: e.target.value })}
                  className="w-full h-10 px-3 border border-[#c3c6d5] rounded focus:border-[#003482] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Timezone</label>
                <input 
                  type="text" 
                  value={editingPatient.timezone}
                  onChange={(e) => setEditingPatient({ ...editingPatient, timezone: e.target.value })}
                  className="w-full h-10 px-3 border border-[#c3c6d5] rounded focus:border-[#003482] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Clinical Notes</label>
                <textarea 
                  value={editingPatient.notes || ''}
                  onChange={(e) => setEditingPatient({ ...editingPatient, notes: e.target.value })}
                  rows={3}
                  className="w-full p-3 border border-[#c3c6d5] rounded focus:border-[#003482] outline-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setEditingPatient(null)}
                  className="px-4 py-2 border border-[#c3c6d5] rounded text-xs font-bold hover:bg-gray-100 text-[#434652]"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#003482] text-white hover:bg-[#0c4aac] font-bold rounded text-xs transition-all"
                >
                  {isSubmitting ? 'Saving...' : 'Update Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
