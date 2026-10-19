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
    { mode: 'explore', label: 'Atlas Map', icon: <Map className="w-4 h-4 text-amber-400" /> },
    { mode: 'places', label: 'Destinations', icon: <Compass className="w-4 h-4 text-amber-400" />, badge: '37' },
    { mode: 'passport', label: 'Gujarat Passport', icon: <Award className="w-4 h-4 text-amber-400" />, badge: `${userProfile.collectedStampIds.length}/34` },
    { mode: 'unfiltered', label: 'Unfiltered Stories', icon: <Sparkles className="w-4 h-4 text-rose-400" />, badge: '45' },
    { mode: 'infrastructure', label: 'Infrastructure', icon: <span className="text-sm">⚡</span>, badge: '3,337' },
  ];

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-md border-b-2 transition-colors duration-200 shadow-xl ${
      theme === 'dark' 
        ? 'bg-[#0c1524]/95 border-amber-600/40 text-[#f7f2e8]' 
        : 'bg-[#FDFBF7]/95 border-[#D8C3A5] text-[#282823]'
    }`}>
      {/* Traditional Gujarati Toran Trim */}
      <div className="ethnic-toran-trim w-full" />

      {/* Header Dropdown & Right Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        
        {/* Brand identity */}
        <div 
          onClick={() => setMode('explore')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 border border-amber-400/50 flex items-center justify-center font-bold text-amber-100 text-xl shadow-sm group-hover:scale-105 transition-transform">
            <span className="font-['Noto_Sans_Gujarati']">ગૂ</span>
            <div className="absolute -top-1 -right-1 lippan-mirror-dot" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className={`font-bold tracking-tight text-lg font-['Outfit'] ${theme === 'dark' ? 'text-white' : 'text-[#1c1917]'}`}>
                Gujarat <span className="text-amber-500">Pravas</span>
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 rounded-md uppercase tracking-wider font-mono">
                Atlas
              </span>
            </div>
            <span className={`text-[11px] font-['Noto_Sans_Gujarati'] ${theme === 'dark' ? 'text-amber-200/70' : 'text-[#78716c]'}`}>
              ગુજરાત ડિજિટલ પ્રવાસ &amp; સાંસ્કૃતિક પાસપોર્ટ
            </span>
          </div>
        </div>

        {/* Primary Desktop Mode Navigation */}
        <nav className={`hidden md:flex items-center gap-1 p-1 rounded-full border transition-colors ${
          theme === 'dark' 
            ? 'bg-[#121c2e]/90 border-amber-500/20' 
            : 'bg-[#EDE5D8]/80 border-[#D8C3A5]'
        }`}>
          {navItems.map((item) => {
            const isActive = currentMode === item.mode;
            return (
              <button
                key={item.mode}
                onClick={() => setMode(item.mode)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all relative ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-sm'
                    : theme === 'dark'
                      ? 'text-amber-100/75 hover:text-white hover:bg-white/5'
                      : 'text-[#44403c] hover:text-[#1c1917] hover:bg-black/5'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold leading-none ${
                    isActive 
                      ? 'bg-black/20 text-slate-950' 
                      : theme === 'dark'
                        ? 'bg-slate-900 text-amber-300 border border-amber-600/30'
                        : 'bg-[#FDFBF7] text-[#9a3412] border border-[#D8C3A5]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2.5">
          
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${
              theme === 'dark'
                ? 'bg-slate-900/90 border-slate-700/80 text-slate-300 hover:text-white hover:border-slate-500 shadow-sm'
                : 'bg-[#EDE5D8] border-[#D8C3A5] text-[#282823] hover:border-[#9a3412] shadow-sm'
            }`}
            title="Toggle Day/Night Mode"
          >
            {theme === 'dark' ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-amber-600" />}
          </button>

          {/* User Auth / Profile Section */}
          {!userProfile.isLoggedIn ? (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs transition-all shadow-sm hover:shadow-md active:translate-y-0.5"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Claim Passport</span>
            </button>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className={`flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full border transition-all text-left shadow-sm ${
                  theme === 'dark' 
                    ? 'bg-slate-900 border-amber-500/40 hover:border-amber-400' 
                    : 'bg-[#EDE5D8] border-[#D8C3A5] hover:border-[#9a3412]'
                }`}
              >
                {userProfile.photoURL ? (
                  <img
                    src={userProfile.photoURL}
                    alt={userProfile.name}
                    className="w-7 h-7 rounded-full object-cover border border-amber-400"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center">
                    {userProfile.name.slice(0, 1)}
                  </div>
                )}

                <div className="hidden sm:flex flex-col leading-none">
                  <span className={`text-xs font-semibold truncate max-w-[100px] ${theme === 'dark' ? 'text-white' : 'text-[#1c1917]'}`}>
                    {userProfile.name.split(' ')[0]}
                  </span>
                  <span className="text-[10px] text-amber-500 font-mono capitalize">
                    📍 {userProfile.homeDistrict}
                  </span>
                </div>

                <ChevronDown className="w-3.5 h-3.5 text-stone-400 ml-0.5" />
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-[#0f172a] border border-slate-700 rounded-2xl shadow-2xl py-2 z-50 text-slate-200 overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-800">
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
                      className="w-full px-4 py-2 text-left text-xs hover:bg-slate-800/80 flex items-center gap-2.5 font-medium transition-colors"
                    >
                      <Award className="w-4 h-4 text-amber-400" />
                      <span>View My Passport</span>
                    </button>

                    <button
                      onClick={() => {
                        setOnboardingOpen(true);
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs hover:bg-slate-800/80 flex items-center gap-2.5 font-medium transition-colors"
                    >
                      <MapPin className="w-4 h-4 text-emerald-400" />
                      <span>Change Home District</span>
                    </button>

                    <button
                      onClick={() => {
                        setShareModalOpen(true);
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs hover:bg-slate-800/80 flex items-center gap-2.5 font-medium transition-colors"
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
                      className="w-full px-4 py-2 text-left text-xs text-rose-400 hover:bg-rose-950/40 flex items-center gap-2.5 font-bold transition-colors"
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
    </header>
  );
};
