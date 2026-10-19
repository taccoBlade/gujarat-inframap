import React, { useState, useRef, useEffect } from 'react';
import { useAtlasStore } from '../../stores/useAtlasStore';
import { AtlasMode } from '../../types/atlas';
import { 
  Compass, 
  Map, 
  Sparkles, 
  Moon, 
  Sun, 
  Award, 
  LogIn, 
  User, 
  LogOut, 
  Share2, 
  MapPin, 
  ChevronDown,
  Zap
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    currentMode, 
    setMode, 
    theme, 
    toggleTheme, 
    userProfile,
    setAuthModalOpen,
    setOnboardingOpen,
    setShareModalOpen,
    logout
  } = useAtlasStore();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems: { mode: AtlasMode; label: string; icon: React.ReactNode; badge?: string }[] = [
    { mode: 'passport', label: 'Gujarat Passport', icon: <Award className="w-4 h-4 text-amber-400" />, badge: `${userProfile.collectedStampIds.length}/34` },
    { mode: 'ev', label: 'EV Highway Radar', icon: <Zap className="w-4 h-4 text-emerald-400" />, badge: '60-180kW' },
    { mode: 'explore', label: 'Atlas Map', icon: <Map className="w-4 h-4 text-amber-300" /> },
    { mode: 'unfiltered', label: 'Unfiltered Stories', icon: <Sparkles className="w-4 h-4 text-rose-400" />, badge: '45' },
    { mode: 'places', label: 'Destinations', icon: <Compass className="w-4 h-4 text-amber-400" />, badge: '37' },
    { mode: 'infrastructure', label: 'Infrastructure', icon: <span className="text-sm">⚡</span>, badge: '3,337' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0c1524]/95 backdrop-blur-md border-b-2 border-amber-600/40 text-[#f7f2e8] shadow-2xl">
      {/* Traditional Gujarati Toran Trim */}
      <div className="ethnic-toran-trim w-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        
        {/* Brand identity */}
        <div 
          onClick={() => setMode('passport')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 border-2 border-amber-400/60 flex items-center justify-center font-bold text-amber-100 text-xl shadow-[2px_2px_0px_#78350f] group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform">
            <span className="font-['Noto_Sans_Gujarati']">ગૂ</span>
            <div className="absolute -top-1 -right-1 lippan-mirror-dot" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-lg text-white font-['Outfit']">
                Gujarat <span className="text-amber-400">Atlas</span>
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded uppercase tracking-wider font-mono">
                Pravas
              </span>
            </div>
            <span className="text-[11px] text-amber-200/70 font-['Noto_Sans_Gujarati']">
              ગુજરાત ડિજિટલ પાસપોર્ટ &amp; એટલાસ
            </span>
          </div>
        </div>

        {/* Primary Mode Navigation */}
        <nav className="hidden md:flex items-center gap-1.5 bg-[#121c2e] p-1.5 rounded-xl border border-amber-600/30 shadow-inner">
          {navItems.map((item) => {
            const isActive = currentMode === item.mode;
            return (
              <button
                key={item.mode}
                onClick={() => setMode(item.mode)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all relative ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-[2px_2px_0px_#78350f] translate-y-[-1px]'
                    : 'text-amber-100/80 hover:text-white hover:bg-amber-950/40'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    isActive ? 'bg-black/25 text-black' : 'bg-slate-900 text-amber-300 border border-amber-600/40'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2">
          
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:border-slate-500 transition-colors"
            title="Toggle Day/Night View"
          >
            {theme === 'dark' ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
          </button>

          {/* User Auth / Profile Section */}
          {!userProfile.isLoggedIn ? (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Claim Passport / Sign In</span>
              <span className="sm:hidden">Sign In</span>
            </button>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full bg-slate-900 border border-amber-500/50 hover:border-amber-400 transition-all text-left"
              >
                {userProfile.photoURL ? (
                  <img
                    src={userProfile.photoURL}
                    alt={userProfile.name}
                    className="w-7 h-7 rounded-full object-cover border border-amber-400"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">
                    {userProfile.name.slice(0, 1)}
                  </div>
                )}

                <div className="hidden sm:flex flex-col leading-none">
                  <span className="text-[11px] font-bold text-white truncate max-w-[90px]">
                    {userProfile.name.split(' ')[0]}
                  </span>
                  <span className="text-[9px] text-amber-400 font-mono capitalize">
                    📍 {userProfile.homeDistrict}
                  </span>
                </div>

                <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-[#0f172a] border-2 border-slate-700 rounded-xl shadow-2xl py-2 z-50 text-slate-200">
                  <div className="px-3.5 py-2.5 border-b border-slate-800">
                    <p className="text-xs font-bold text-white truncate">{userProfile.name}</p>
                    <p className="text-[11px] font-mono text-slate-400">{userProfile.handle}</p>
                    <div className="mt-2 flex items-center gap-1.5">
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full font-bold">
                        {userProfile.collectedStampIds.length}/34 Stamped
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-800 text-slate-400 rounded-full capitalize">
                        {userProfile.authProvider || 'Verified'}
                      </span>
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setMode('passport');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full px-3.5 py-2 text-left text-xs hover:bg-slate-800 flex items-center gap-2.5 font-medium"
                    >
                      <Award className="w-4 h-4 text-amber-400" />
                      <span>View My Passport</span>
                    </button>

                    <button
                      onClick={() => {
                        setOnboardingOpen(true);
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full px-3.5 py-2 text-left text-xs hover:bg-slate-800 flex items-center gap-2.5 font-medium"
                    >
                      <MapPin className="w-4 h-4 text-emerald-400" />
                      <span>Change Home District</span>
                    </button>

                    <button
                      onClick={() => {
                        setShareModalOpen(true);
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full px-3.5 py-2 text-left text-xs hover:bg-slate-800 flex items-center gap-2.5 font-medium"
                    >
                      <Share2 className="w-4 h-4 text-rose-400" />
                      <span>Generate 9:16 Story Card</span>
                    </button>
                  </div>

                  <div className="pt-1 border-t border-slate-800">
                    <button
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full px-3.5 py-2 text-left text-xs text-rose-400 hover:bg-rose-950/40 flex items-center gap-2.5 font-bold"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Mobile Navigation Strip */}
      <div className="md:hidden flex items-center justify-around bg-slate-950 border-t border-slate-800 py-2 px-1">
        {navItems.map((item) => (
          <button
            key={item.mode}
            onClick={() => setMode(item.mode)}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold py-1 px-2 rounded ${
              currentMode === item.mode ? 'text-amber-400 bg-amber-500/10' : 'text-slate-400'
            }`}
          >
            {item.icon}
            <span>{item.label.split(' ')[0]}</span>
          </button>
        ))}
      </div>
    </header>
  );
};
