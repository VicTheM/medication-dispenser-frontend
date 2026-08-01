import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Pill, 
  BarChart3, 
  Cpu, 
  Bot, 
  Bell, 
  Settings as SettingsIcon,
  Activity,
  ShieldCheck,
  Home
} from 'lucide-react';
import { UserRole } from '../types';

export type TabType = 
  | 'landing'
  | 'dashboard' 
  | 'patients' 
  | 'medications' 
  | 'adherence' 
  | 'hardware' 
  | 'ai_assistant' 
  | 'notifications' 
  | 'settings';

interface NavigationProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  unreadNotificationCount: number;
  currentPatientName: string;
  userRole: UserRole;
}

export default function Navigation({ 
  currentTab, 
  onTabChange, 
  unreadNotificationCount,
  currentPatientName,
  userRole
}: NavigationProps) {

  const allNavItems: { id: TabType; label: string; icon: React.ReactNode; badge?: number; caregiverOnly?: boolean }[] = [
    { id: 'landing', label: 'Overview & Hardware', icon: <Home className="w-4 h-4" /> },
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'patients', label: 'Patients', icon: <Users className="w-4 h-4" />, caregiverOnly: true },
    { id: 'medications', label: '7-Compartment Schedules', icon: <Pill className="w-4 h-4" /> },
    { id: 'adherence', label: 'Adherence & Videos', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'hardware', label: 'Dispenser Unit', icon: <Cpu className="w-4 h-4" /> },
    { id: 'ai_assistant', label: 'Ally AI Assistant', icon: <Bot className="w-4 h-4" /> },
    { id: 'notifications', label: 'Alerts', icon: <Bell className="w-4 h-4" />, badge: unreadNotificationCount },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon className="w-4 h-4" /> },
  ];
  const navItems = allNavItems.filter(item => !item.caregiverOnly || userRole === 'caregiver');

  return (
    <header className="bg-white border-b border-[#c3c6d5] sticky top-0 z-40 shadow-xs">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div 
          onClick={() => onTabChange('landing')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="bg-[#003482] text-white p-2 rounded-lg shadow-xs group-hover:bg-[#0c4aac] transition-colors">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-tight text-[#003482] leading-tight group-hover:text-[#0c4aac]">MedLab | Adherence pro</h1>
            <p className="text-[10px] text-[#737784] font-semibold uppercase tracking-wider">7-Compartment Clinical Portal</p>
          </div>
        </div>

        {/* Patient / Role Badge */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-[#eff4ff] border border-[#003482]/20 px-3 py-1.5 rounded-lg text-xs">
            <ShieldCheck className="w-4 h-4 text-[#006d37]" />
            <span className="font-bold text-[#003482]">{currentPatientName}</span>
            <span className="text-[10px] bg-[#91f8ad] text-[#00743b] px-1.5 py-0.5 rounded uppercase font-extrabold">{userRole}</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="max-w-7xl mx-auto px-4 md:px-8 flex overflow-x-auto scrollbar-none border-t border-gray-100">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex items-center gap-2 px-3.5 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                isActive 
                  ? 'border-[#003482] text-[#003482] bg-[#eff4ff]/60' 
                  : 'border-transparent text-[#737784] hover:text-[#0f1c2d] hover:bg-gray-50'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="bg-[#ba1a1a] text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-0.5">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
