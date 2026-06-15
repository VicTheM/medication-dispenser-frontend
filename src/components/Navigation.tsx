import React from 'react';
import { 
  LayoutDashboard, 
  Pill, 
  BarChart3, 
  Settings as SettingsIcon, 
  Plus, 
  HelpCircle, 
  LogOut, 
  Menu, 
  Bell, 
  Activity,
  Radio
} from 'lucide-react';

interface NavigationProps {
  currentTab: 'dashboard' | 'medications' | 'adherence' | 'settings';
  onChangeTab: (tab: 'dashboard' | 'medications' | 'adherence' | 'settings') => void;
  onNewPrescription: () => void;
  onSignOut: () => void;
  userEmail: string;
}

export default function Navigation({ 
  currentTab, 
  onChangeTab, 
  onNewPrescription, 
  onSignOut,
  userEmail 
}: NavigationProps) {

  // Navigation Items details
  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'medications', label: 'Medications', icon: Pill },
    { id: 'adherence', label: 'Adherence', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ] as const;

  return (
    <>
      {/* 1. DESKTOP SIDEBAR NAVIGATION PANEL */}
      <aside 
        id="desktop-sidebar-nav" 
        className="hidden md:flex h-screen w-64 flex-col bg-white border-r border-[#c3c6d5] p-4 gap-4 shrink-0 fixed left-0 top-0 z-40"
      >
        <div className="flex items-center gap-2 mb-6 px-1 pt-2">
          <div className="w-10 h-10 bg-[#e6eeff] rounded-lg flex items-center justify-center text-[#003482]">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#003482] leading-none">MedLab</h1>
            <p className="text-xs text-[#434652] mt-1 font-semibold">Clinical Portal</p>
          </div>
        </div>

        {/* Prescription quick button */}
        <button 
          onClick={onNewPrescription}
          className="w-full bg-[#003482] text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-[#0c4aac] transition-all cursor-pointer shadow-sm active:scale-95 duration-150 mb-4"
        >
          <Plus className="w-5 h-5" />
          New Prescription
        </button>

        {/* Tab Links */}
        <nav className="flex-1 flex flex-col gap-1 text-sm font-semibold">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onChangeTab(item.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left cursor-pointer ${
                  isActive 
                    ? 'text-[#003482] font-bold bg-[#e6eeff]' 
                    : 'text-[#434652] hover:bg-[#eff4ff] hover:text-[#0f1c2d]'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#003482]' : 'text-[#737784]'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer Link Groupings */}
        <div className="mt-auto flex flex-col gap-1 pt-4 border-t border-[#c3c6d5] text-sm font-semibold">
          <button 
            onClick={() => onChangeTab('settings')}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-[#434652] hover:bg-[#eff4ff] hover:text-[#0f1c2d] text-left cursor-pointer w-full"
          >
            <HelpCircle className="w-5 h-5 text-[#737784]" />
            Support Help
          </button>
          <button 
            onClick={onSignOut}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-[#ba1a1a] hover:bg-red-50 text-left cursor-pointer w-full"
          >
            <LogOut className="w-5 h-5 text-[#ba1a1a]" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* 2. MOBILE TOP BAR PANEL */}
      <header 
        id="mobile-top-bar" 
        className="md:hidden flex justify-between items-center px-4 w-full h-16 bg-white border-b border-[#c3c6d5] z-40 fixed top-0 left-0 shadow-sm"
      >
        <div className="flex items-center gap-2">
          <Menu 
            className="w-6 h-6 text-[#434652] cursor-pointer hover:text-[#0f1c2d]" 
            onClick={() => onChangeTab('settings')} // quick detour to actions
          />
          <h1 className="text-xl font-bold text-[#003482]">MedLab</h1>
        </div>

        <div className="flex items-center gap-3">
          <button className="text-[#434652] hover:bg-gray-100 p-2 rounded-full transition-all relative">
            <Radio className="w-5 h-5 text-[#006d37] animate-pulse" />
          </button>
          
          <button className="text-[#434652] hover:bg-gray-100 p-2 rounded-full transition-all relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#ba1a1a] rounded-full"></span>
          </button>

          {/* Clinician Headshot profile representation */}
          <div 
            onClick={() => onChangeTab('settings')}
            className="w-8 h-8 rounded-full border border-[#c3c6d5] overflow-hidden cursor-pointer active:opacity-80"
          >
            <img 
              alt="Clinician Avatar"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEHJGAJTTwNevUFHMihpow-kW688RKd6OI2H69Tx3gMR7Ag67tpI6Ra2dO_D9qZN3KAhLe6J7Qy6TAsu8O8jVyRJk5Fn2-YCmX4DazXYe3_IOZM7nAj7WWwNHitcDOBPGn04ugonDfWivKzJdnB55I6rAlvNdyg4OR_m9wBu3JUwPYK7fEdBmGIRNq1Ub17KGOgFEJTrCJ2CDVGraTZLgTjNcyLrh-5puCq4subPQ6BEyfAIRmakxYvN8RNMsZp2-iiZ_y42asCYg" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </header>

      {/* 3. MOBILE BOTTOM NAV-TABS SCREEN STICKY FOOTER */}
      <nav 
        id="mobile-bottom-nav" 
        className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-[#c3c6d5] flex justify-around items-center h-16 px-2 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]"
      >
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeTab(item.id)}
              className={`flex flex-col items-center justify-center w-1/4 h-full cursor-pointer relative ${
                isActive ? 'text-[#003482]' : 'text-[#737784]'
              }`}
            >
              {isActive ? (
                <div className="bg-[#e6eeff] px-4 py-0.5 rounded-full mb-1">
                  <Icon className="w-5 h-5 text-[#003482]" />
                </div>
              ) : (
                <Icon className="w-5.5 h-5.5 mb-1 text-[#737784]" />
              )}
              <span className="text-[10px] uppercase font-bold tracking-wider leading-none">
                {item.id === 'medications' ? 'Meds' : item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
