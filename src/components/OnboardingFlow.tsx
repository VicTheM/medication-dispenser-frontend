import React, { useState } from 'react';
import { api } from '../lib/api';
import { CaregiverUser, PatientUser, UserRole } from '../types';
import { 
  Lock, 
  Activity, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  ShieldCheck,
  UserCheck,
  Users
} from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: (user: { role: UserRole; profile: CaregiverUser | PatientUser }) => void;
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<UserRole>('caregiver');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      if (tab === 'register') {
        const res = await api.registerCaregiver({ email, password, full_name: fullName });
        if (res.error) {
          setErrorMsg(res.error);
          return;
        }
        // Registration doesn't return a token, so sign in right after.
        const loginRes = await api.loginCaregiver({ email, password });
        if (loginRes.error) {
          setErrorMsg(`Account created, but sign-in failed: ${loginRes.error}`);
          return;
        }
        onComplete({ role: 'caregiver', profile: res.data! });
      } else if (role === 'caregiver') {
        const loginRes = await api.loginCaregiver({ email, password });
        if (loginRes.error) {
          setErrorMsg(loginRes.error);
          return;
        }
        const meRes = await api.getCaregiverMe();
        if (meRes.error || !meRes.data) {
          setErrorMsg(meRes.error || 'Signed in, but could not load your profile.');
          return;
        }
        onComplete({ role: 'caregiver', profile: meRes.data });
      } else {
        const loginRes = await api.loginPatient({ email, password });
        if (loginRes.error) {
          setErrorMsg(loginRes.error);
          return;
        }
        const meRes = await api.getPatientMe();
        if (meRes.error || !meRes.data) {
          setErrorMsg(meRes.error || 'Signed in, but could not load your profile.');
          return;
        }
        onComplete({ role: 'patient', profile: meRes.data });
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not reach the MedAdhere API. Check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="onboarding-flow-container" className="bg-[#f8f9ff] text-[#0f1c2d] min-h-screen flex flex-col font-sans">
      <header id="onboarding-header" className="bg-white border-b border-[#c3c6d5] w-full h-16 flex items-center px-6 md:px-8 sticky top-0 z-50 justify-between">
        <div className="flex items-center gap-2 text-[#003482]">
          <Activity className="w-7 h-7" />
          <span className="font-extrabold text-xl tracking-tight">MedLab | Adherence pro</span>
        </div>
        <div className="text-[#434652] text-xs font-semibold flex items-center gap-1">
          <ShieldCheck className="w-4 h-4 text-[#006d37]" />
          HIPAA Compliant Platform
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-8 max-w-4xl mx-auto w-full">
        <div className="w-full max-w-md">
          
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-[#003482] mb-1">MedLab Clinical Portal</h1>
            <p className="text-[#434652] text-xs">Sign in or register to manage 7-compartment hardware dispensers and patient adherence schedules.</p>
          </div>

          {/* Main Auth Form */}
          <div className="bg-white border border-[#c3c6d5] rounded-xl p-6 shadow-sm space-y-5">
            
            <div className="flex border-b border-[#c3c6d5]">
              <button 
                onClick={() => setTab('login')}
                className={`flex-1 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  tab === 'login' ? 'border-[#003482] text-[#003482]' : 'border-transparent text-[#737784]'
                }`}
              >
                Sign In
              </button>
              <button 
                onClick={() => setTab('register')}
                className={`flex-1 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  tab === 'register' ? 'border-[#003482] text-[#003482]' : 'border-transparent text-[#737784]'
                }`}
              >
                Caregiver Register
              </button>
            </div>

            {tab === 'login' && (
              <div className="flex bg-[#f8f9ff] p-1 rounded-lg border border-[#c3c6d5] gap-1">
                <button 
                  onClick={() => setRole('caregiver')}
                  className={`flex-1 py-1.5 rounded text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                    role === 'caregiver' ? 'bg-[#003482] text-white shadow-xs' : 'text-[#737784] hover:text-[#0f1c2d]'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  Caregiver
                </button>
                <button 
                  onClick={() => setRole('patient')}
                  className={`flex-1 py-1.5 rounded text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                    role === 'patient' ? 'bg-[#003482] text-white shadow-xs' : 'text-[#737784] hover:text-[#0f1c2d]'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  Patient
                </button>
              </div>
            )}

            {errorMsg && (
              <div className="p-3 bg-red-50 text-[#ba1a1a] border border-red-200 text-xs rounded font-bold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {tab === 'register' && (
                <div>
                  <label className="block font-bold text-[#0f1c2d] mb-1">Full Name & Title</label>
                  <input 
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Dr. Sarah Smith"
                    className="w-full h-10 px-3 border border-[#c3c6d5] rounded focus:border-[#003482] outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block font-bold text-[#0f1c2d] mb-1">Email Address</label>
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="dr.smith@hospital.org"
                  className="w-full h-10 px-3 border border-[#c3c6d5] rounded focus:border-[#003482] outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0f1c2d] mb-1">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-10 pl-3 pr-10 border border-[#c3c6d5] rounded focus:border-[#003482] outline-none font-mono"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737784]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-[#003482] hover:bg-[#0c4aac] text-white font-bold rounded flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                {isLoading ? 'Authenticating...' : tab === 'register' ? 'Register Caregiver Account' : `Sign In as ${role === 'caregiver' ? 'Caregiver' : 'Patient'}`}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

          </div>

          <div className="mt-4 text-center flex items-center justify-center gap-1.5 text-[#737784] text-[11px]">
            <Lock className="w-3.5 h-3.5" />
            256-Bit SSL Encrypted Connection to MedAdhere Service
          </div>

        </div>
      </main>
    </div>
  );
}
