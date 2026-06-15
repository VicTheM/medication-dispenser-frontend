import React, { useState, useEffect } from 'react';
import { OnboardingState } from '../types';
import { 
  Lock, 
  HelpCircle, 
  Activity, 
  ArrowLeft, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Bluetooth, 
  RefreshCw, 
  CheckCircle2, 
  CheckSquare, 
  Cpu, 
  ShieldCheck 
} from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: (data: { firstName: string; lastName: string; email: string }) => void;
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  // Setup onboarding form states
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');

  // Hardware pairing states
  const [pairingStatus, setPairingStatus] = useState<'idle' | 'scanning' | 'discovered' | 'connecting' | 'paired'>('idle');
  const [scanProgress, setScanProgress] = useState(0);

  // Validate and continue from Step 1
  const handleContinueToHardware = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      setFormError('First Name and Last Name are required.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setFormError('Please enter a valid institutional email address.');
      return;
    }
    if (password.length < 12) {
      setFormError('Password must be at least 12 characters.');
      return;
    }
    setFormError('');
    setStep(2);
    // Auto-trigger scanning on Step 2
    triggerHardwareScan();
  };

  // Simulate scanning for bluetooth hardware
  const triggerHardwareScan = () => {
    setPairingStatus('scanning');
    setScanProgress(0);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (pairingStatus === 'scanning') {
      interval = setInterval(() => {
        setScanProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setPairingStatus('discovered');
            return 100;
          }
          return prev + 8;
        });
      }, 150);
    }
    return () => clearInterval(interval);
  }, [pairingStatus]);

  // Connect to the discovered dispenser
  const connectDevice = () => {
    setPairingStatus('connecting');
    setTimeout(() => {
      setPairingStatus('paired');
    }, 1500);
  };

  // Complete onboarding
  const handleFinishOnboarding = () => {
    onComplete({
      firstName,
      lastName,
      email
    });
  };

  return (
    <div id="onboarding-flow-container" className="bg-[#f8f9ff] text-[#0f1c2d] min-h-screen flex flex-col font-sans">
      {/* Top Navigation */}
      <header id="onboarding-header" className="bg-white border-b border-[#c3c6d5] w-full h-16 flex items-center px-6 md:px-8 sticky top-0 z-50 justify-between">
        <div className="flex items-center gap-2 text-[#003482]">
          <Activity className="w-7 h-7" />
          <span className="font-semibold text-xl tracking-tight">MedLab</span>
        </div>
        <div className="text-[#434652] text-xs font-semibold flex items-center gap-1 cursor-pointer hover:text-[#003482] transition-colors">
          <HelpCircle className="w-4.5 h-4.5" />
          Need Help?
        </div>
      </header>

      <main id="onboarding-main" className="flex-grow flex flex-col items-center justify-center p-4 md:p-8 max-w-7xl mx-auto w-full">
        <div className="w-full max-w-[800px]">
          {/* Header titles */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-[#003482] mb-2">Welcome to MedLab</h1>
            <p className="text-[#434652] text-base">Set up your account and pair your diagnostic hardware.</p>
          </div>

          {/* Stepper visual */}
          <div className="flex items-center justify-between mb-8 relative px-4">
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-[#c3c6d5] -z-10 -translate-y-1/2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#003482] transition-all duration-500" 
                style={{ width: step === 1 ? '16%' : step === 2 ? '50%' : '100%' }}
              ></div>
            </div>

            {/* Step 1 marker */}
            <div className="flex flex-col items-center gap-2 bg-[#f8f9ff] px-2">
              <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-semibold text-sm transition-colors duration-300 ${
                step >= 1 ? 'bg-[#003482] text-white border-[#003482]' : 'bg-white text-[#737784] border-[#c3c6d5]'
              }`}>
                1
              </div>
              <span className={`text-xs font-bold transition-colors ${step >= 1 ? 'text-[#003482]' : 'text-[#434652]'}`}>Account</span>
            </div>

            {/* Step 2 marker */}
            <div className="flex flex-col items-center gap-2 bg-[#f8f9ff] px-2">
              <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-semibold text-sm transition-colors duration-300 ${
                step >= 2 ? 'bg-[#003482] text-white border-[#003482]' : 'bg-white text-[#737784] border-[#c3c6d5]'
              }`}>
                2
              </div>
              <span className={`text-xs font-bold transition-colors ${step >= 2 ? 'text-[#003482]' : 'text-[#434652]'}`}>Hardware</span>
            </div>

            {/* Step 3 marker */}
            <div className="flex flex-col items-center gap-2 bg-[#f8f9ff] px-2">
              <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-semibold text-sm transition-colors duration-300 ${
                step === 3 ? 'bg-[#003482] text-white border-[#003482]' : 'bg-white text-[#737784] border-[#c3c6d5]'
              }`}>
                3
              </div>
              <span className={`text-xs font-bold transition-colors ${step === 3 ? 'text-[#003482]' : 'text-[#434652]'}`}>Complete</span>
            </div>
          </div>

          {/* Stepper Card container */}
          <div className="bg-white border border-[#c3c6d5] rounded-xl p-6 md:p-8 shadow-sm relative overflow-hidden transition-all duration-300 min-h-[420px] flex flex-col justify-between">
            {/* Soft background blue corner highlight */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#e6eeff] opacity-40 rounded-bl-full -z-0 pointer-events-none"></div>

            <div className="relative z-10 flex-grow">
              
              {/* STEP 1: ACCOUNT DETAILS CONTAINER */}
              {step === 1 && (
                <div id="step-1-content">
                  <h2 className="text-xl font-bold mb-2 text-[#0f1c2d]">Account Information</h2>
                  <p className="text-sm text-[#434652] mb-6">Please provide your institutional email to begin the secure enrollment process.</p>
                  
                  {formError && (
                    <div className="bg-red-50 text-[#ba1a1a] text-sm p-3 rounded border border-red-200 mb-4 font-semibold">
                      {formError}
                    </div>
                  )}

                  <form onSubmit={handleContinueToHardware} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#0f1c2d] mb-1">First Name</label>
                        <input 
                          type="text" 
                          value={firstName} 
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full h-11 px-3 border border-[#c3c6d5] rounded focus:border-[#003482] focus:ring-1 focus:ring-[#003482] outline-none transition-all text-sm" 
                          placeholder="Enter first name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#0f1c2d] mb-1">Last Name</label>
                        <input 
                          type="text" 
                          value={lastName} 
                          onChange={(e) => setLastName(e.target.value)}
                          className="w-full h-11 px-3 border border-[#c3c6d5] rounded focus:border-[#003482] focus:ring-1 focus:ring-[#003482] outline-none transition-all text-sm" 
                          placeholder="Enter last name"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#0f1c2d] mb-1">Institutional Email</label>
                      <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-11 px-3 border border-[#c3c6d5] rounded focus:border-[#003482] focus:ring-1 focus:ring-[#003482] outline-none transition-all text-sm" 
                        placeholder="dr.smith@hospital.org"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#0f1c2d] mb-1">Password</label>
                      <div className="relative">
                        <input 
                          type={showPassword ? "text" : "password"} 
                          value={password} 
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full h-11 pl-3 pr-10 border border-[#c3c6d5] rounded focus:border-[#003482] focus:ring-1 focus:ring-[#003482] outline-none transition-all text-sm" 
                          placeholder="Create a secure password"
                          required
                        />
                        <button 
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737784] hover:text-[#0f1c2d] cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-5.5 h-5.5" /> : <Eye className="w-5.5 h-5.5" />}
                        </button>
                      </div>
                      <p className="text-[11px] text-[#737784] mt-1 italic">Must be at least 12 characters and include a number and symbol.</p>
                    </div>
                  </form>
                </div>
              )}

              {/* STEP 2: HARDWARE PAIRING CONTAINER */}
              {step === 2 && (
                <div id="step-2-content" className="flex flex-col items-center text-center">
                  <h2 className="text-xl font-bold mb-1 text-[#0f1c2d] w-full text-left">Connect Smart Dispenser</h2>
                  <p className="text-sm text-[#434652] mb-6 w-full text-left">Activate your Smart Dispenser Pro near your client device to establish secure Bluetooth sync.</p>

                  <div className="w-full max-w-md bg-[#eff4ff] border border-[#d6e3fb] rounded-lg p-6 flex flex-col items-center gap-4 py-8">
                    {pairingStatus === 'scanning' && (
                      <div className="flex flex-col items-center gap-3 w-full">
                        <div className="relative w-16 h-16 flex items-center justify-center">
                          <div className="absolute inset-0 border-4 border-[#003482] border-t-transparent rounded-full animate-spin"></div>
                          <Bluetooth className="w-7 h-7 text-[#003482]" />
                        </div>
                        <p className="text-sm font-semibold text-[#003482]">Searching and scanning for nearby MedLab devices...</p>
                        <div className="w-full bg-[#c3c6d5] rounded-full h-2 mt-2 overflow-hidden">
                          <div className="bg-[#003482] h-full transition-all duration-150" style={{ width: `${scanProgress}%` }}></div>
                        </div>
                        <span className="text-xs text-[#434652]">{scanProgress}% completed</span>
                      </div>
                    )}

                    {pairingStatus === 'discovered' && (
                      <div className="flex flex-col items-center gap-3 w-full">
                        <div className="w-12 h-12 bg-[#dae2ff] text-[#003482] rounded-full flex items-center justify-center animate-bounce">
                          <Bluetooth className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-base font-bold text-[#0f1c2d]">1 MedLab Device Discovered!</p>
                          <span className="text-xs font-mono text-[#003482] bg-white border border-[#c3c6d5] px-2 py-0.5 rounded mt-1 inline-block">ID: ML-SDP-8472-A (84% Battery)</span>
                        </div>
                        <button 
                          onClick={connectDevice}
                          className="mt-2 w-full max-w-xs bg-[#003482] hover:bg-[#0c4aac] text-white px-4 py-2.5 rounded font-bold text-sm transition-all"
                        >
                          Pair & Sync Device
                        </button>
                      </div>
                    )}

                    {pairingStatus === 'connecting' && (
                      <div className="flex flex-col items-center gap-2 py-4">
                        <RefreshCw className="w-10 h-10 text-[#003482] animate-spin" />
                        <p className="text-sm font-semibold text-[#0f1c2d] mt-2">Pairing Unit and authenticating HIPAA keys...</p>
                      </div>
                    )}

                    {pairingStatus === 'paired' && (
                      <div className="flex flex-col items-center gap-3 py-2">
                        <div className="w-14 h-14 bg-[#91f8ad] text-[#00743b] rounded-full flex items-center justify-center shadow-sm">
                          <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <div>
                          <p className="text-base font-bold text-[#00743b]">Pairing Successful!</p>
                          <p className="text-xs text-[#434652] mt-1">Smart Dispenser Pro [Unit M-42] is ready to receive prescription databases.</p>
                        </div>
                      </div>
                    )}

                    {pairingStatus === 'idle' && (
                      <button 
                        onClick={triggerHardwareScan}
                        className="bg-[#003482] hover:bg-[#0c4aac] text-white font-bold py-2.5 px-6 rounded text-sm transition-all flex items-center gap-2"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Initialize Dispenser Scan
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 3: REGISTRATION COMPLETE CONTAINER */}
              {step === 3 && (
                <div id="step-3-content" className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-[#e6eeff] text-[#003482] rounded-full flex items-center justify-center mb-4">
                    <ShieldCheck className="w-10 h-10" />
                  </div>
                  <h2 className="text-xl font-bold mb-1 text-[#0f1c2d] text-center">Clinical Credentials Verified</h2>
                  <p className="text-sm text-[#434652] text-center mb-6 max-w-md">Your clinical account has been securely enrolled in compliance with medical data regulations.</p>

                  <div className="w-full max-w-md space-y-3 bg-[#f8f9ff] border border-[#c3c6d5] p-5 rounded-lg text-sm text-[#0f1c2d]">
                    <div className="flex items-center gap-3">
                      <CheckSquare className="w-5 h-5 text-[#006d37] shrink-0" />
                      <span>Institutional Account Created (<strong>{email}</strong>)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckSquare className="w-5 h-5 text-[#006d37] shrink-0" />
                      <span>Hardware Connection Linked (<strong>ML-SDP-8472-A</strong>)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckSquare className="w-5 h-5 text-[#006d37] shrink-0" />
                      <span>Firmware Synchronized to Version <strong>v2.4.1</strong></span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckSquare className="w-5 h-5 text-[#006d37] shrink-0" />
                      <span>Secure 256-bit Encryption Verified</span>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Stepper Footer Action Buttons */}
            <div id="onboarding-controls" className="mt-8 flex justify-between items-center pt-4 border-t border-[#c3c6d5] relative z-10 bg-white">
              {step > 1 ? (
                <button 
                  onClick={() => setStep((prev) => (prev - 1) as 1 | 2 | 3)}
                  className="px-4 py-2 text-xs font-bold text-[#434652] hover:bg-[#eff4ff] rounded transition-all flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
              ) : (
                <div className="w-20"></div> // Placeholder layout balance
              )}

              {step === 1 && (
                <button 
                  onClick={handleContinueToHardware}
                  className="px-6 py-2.5 font-bold text-sm bg-[#003482] text-white rounded shadow-sm hover:bg-[#0c4aac] transition-all flex items-center gap-2 cursor-pointer active:scale-95 duration-150"
                >
                  Continue to Hardware
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              {step === 2 && (
                <button 
                  onClick={() => setStep(3)}
                  disabled={pairingStatus !== 'paired'}
                  className={`px-6 py-2.5 font-bold text-sm rounded shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-95 duration-150 ${
                    pairingStatus === 'paired' 
                      ? 'bg-[#003482] text-white hover:bg-[#0c4aac]' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Configure System
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              {step === 3 && (
                <button 
                  onClick={handleFinishOnboarding}
                  className="px-6 py-2.5 font-bold text-sm bg-[#006d37] text-white rounded shadow-sm hover:bg-[#005228] transition-all flex items-center gap-2 cursor-pointer active:scale-95 duration-150"
                >
                  Enter Clinical Portal
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Secure lock footer note */}
          <div className="mt-6 text-center flex items-center justify-center gap-1.5 text-[#737784] text-xs font-medium">
            <Lock className="w-3.5 h-3.5" />
            End-to-end encrypted. HIPAA compliant infrastructure.
          </div>
        </div>
      </main>
    </div>
  );
}
