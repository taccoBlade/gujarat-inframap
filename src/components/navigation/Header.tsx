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
  const [isScrolled, setIsScrolled] = useState(false);
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

  // Track scroll position to enable compact header state
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Primary navigation tabs — Progress badge strictly on Passport to prevent noise
  const navItems: { mode: AtlasMode; label: string; icon: React.ReactNode; badge?: string }[] = [
    { mode: 'explore', label: 'Atlas Map', icon: <Map className="w-4 h-4 text-[#FF9418]" /> },
    { mode: 'places', label: 'Destinations', icon: <Compass className="w-4 h-4 text-[#FF9418]" /> },
    { mode: 'passport', label: 'Gujarat Passport', icon: <Award className="w-4 h-4 text-[#FF9418]" />, badge: `${userProfile.collectedStampIds.length}/34` },
    { mode: 'unfiltered', label: 'Unfiltered Stories', icon: <Sparkles className="w-4 h-4 text-[#9D233B]" /> },
    { mode: 'infrastructure', label: 'Infrastructure', icon: <Zap className="w-4 h-4 text-[#1C6555]" /> },
  ];

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-md border-b-2 transition-all duration-200 shadow-sm ${
      theme === 'dark' 
        ? 'bg-[#101827]/95 border-[#25324A] text-[#F1E8D7]' 
        : 'bg-[#FAF6ED]/95 border-[#25324A] text-[#101827]'
    }`}>
      {/* Traditional Gujarati Toran Trim */}
      <div className="ethnic-toran-trim w-full" />

      {/* Main Header Container */}
      <div className={`max-w-7xl mx-auto px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4 transition-all duration-200 ${
        isScrolled ? 'h-13 sm:h-14' : 'h-14 sm:h-16'
      }`}>
        
        {/* Brand Identity */}
        <div 
          onClick={() => setMode('explore')}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none group flex-shrink-0"
          role="button"
          tabIndex={0}
          aria-label="Gujarat Pravas Home"
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setMode('explore'); }}
        >
          {/* Logo Glyph */}
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#151F30] border-2 border-[#FF9418] flex items-center justify-center font-bold text-[#FF9418] text-lg sm:text-xl shadow-[2px_2px_0px_#101827] group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform flex-shrink-0">
            <span className="font-['Noto_Sans_Gujarati']">ગૂ</span>
            <div className="absolute -top-1 -right-1 lippan-mirror-dot" />
          </div>

          {/* Titles & Gujarati Subtitle */}
          <div className="flex flex-col justify-center min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className={`font-black tracking-tight text-base sm:text-lg font-editorial ${
                theme === 'dark' ? 'text-white' : 'text-[#101827]'
              }`}>
                Gujarat <span className="text-[#FF9418]">Pravas</span>
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono font-bold px-1.5 py-0.2 bg-[#FF9418]/15 text-[#FF9418] border border-[#FF9418]/40 rounded uppercase tracking-wider">
                Atlas
              </span>
            </div>

            {/* Controlled Gujarati line height & responsive subtitle */}
            <p className={`text-[10px] sm:text-[11px] font-['Noto_Sans_Gujarati'] leading-tight truncate max-w-[140px] xs:max-w-[180px] sm:max-w-none ${
              theme === 'dark' ? 'text-[#8F9CAE]' : 'text-[#606F7B]'
            }`}>
              ગુજરાત ડિજિટલ પ્રવાસ &amp; સાંસ્કૃતિક પાસપોર્ટ
            </p>
          </div>
        </div>

        {/* Primary Desktop/Tablet Mode Navigation */}
        <nav className={`hidden md:flex items-center gap-1 p-1 rounded-xl border-2 transition-colors ${
          theme === 'dark' 
            ? 'bg-[#151F30] border-[#25324A]' 
            : 'bg-[#F1E8D7] border-[#25324A]'
        }`}>
          {navItems.map((item) => {
            const isActive = currentMode === item.mode;
            return (
              <button
                key={item.mode}
                onClick={() => setMode(item.mode)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all relative ${
                  isActive
                    ? 'bg-[#FF9418] text-[#101827] shadow-[2px_2px_0px_#101827]'
                    : theme === 'dark'
                      ? 'text-[#F1E8D7]/80 hover:text-white hover:bg-white/5'
                      : 'text-[#25324A] hover:text-[#101827] hover:bg-black/5'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold leading-none ${
                    isActive 
                      ? 'bg-[#101827] text-[#FF9418]' 
                      : theme === 'dark'
                        ? 'bg-[#101827] text-[#FF9418] border border-[#25324A]'
                        : 'bg-white text-[#9D233B] border border-[#25324A]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
          
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl border-2 flex items-center justify-center transition-all ${
              theme === 'dark'
                ? 'bg-[#151F30] border-[#25324A] text-[#F1E8D7] hover:border-[#FF9418] shadow-[2px_2px_0px_#101827]'
                : 'bg-[#F1E8D7] border-[#25324A] text-[#101827] hover:border-[#FF9418] shadow-[2px_2px_0px_#25324A]'
            }`}
            title="Toggle Day/Night Mode"
            aria-label="Toggle dark and light theme"
          >
            {theme === 'dark' ? <Moon className="w-4 h-4 text-[#FF9418]" /> : <Sun className="w-4 h-4 text-[#FF9418]" />}
          </button>

          {/* User Auth / Profile Section */}
          {!userProfile.isLoggedIn ? (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-[#FF9418] hover:bg-[#e07f10] text-[#101827] font-black text-xs border-2 border-[#101827] dark:border-[#25324A] shadow-[2px_2px_0px_#101827] active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              <LogIn className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Claim Passport</span>
            </button>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className={`flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-xl border-2 transition-all text-left shadow-[2px_2px_0px_#101827] ${
                  theme === 'dark' 
                    ? 'bg-[#151F30] border-[#25324A] hover:border-[#FF9418]' 
                    : 'bg-[#F1E8D7] border-[#25324A] hover:border-[#FF9418]'
                }`}
              >
                {userProfile.photoURL ? (
                  <img
                    src={userProfile.photoURL}
                    alt={userProfile.name}
                    className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg object-cover border border-[#FF9418]"
                  />
                ) : (
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#FF9418] text-[#101827] font-black text-xs flex items-center justify-center">
                    {userProfile.name.slice(0, 1)}
                  </div>
                )}

                <div className="hidden sm:flex flex-col leading-none">
                  <span className={`text-xs font-bold truncate max-w-[100px] ${theme === 'dark' ? 'text-white' : 'text-[#101827]'}`}>
                    {userProfile.name.split(' ')[0]}
                  </span>
                  <span className="text-[10px] text-[#FF9418] font-mono capitalize">
                    📍 {userProfile.homeDistrict}
                  </span>
                </div>

                <ChevronDown className="w-3.5 h-3.5 text-[#8F9CAE]" />
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className={`absolute right-0 mt-2 w-64 border-2 rounded-2xl shadow-[4px_4px_0px_#101827] py-2 z-50 overflow-hidden ${
                  theme === 'dark' 
                    ? 'bg-[#151F30] border-[#25324A] text-[#F1E8D7]' 
                    : 'bg-[#FAF6ED] border-[#25324A] text-[#101827]'
                }`}>
                  <div className="px-4 py-3 border-b-2 border-[#25324A]">
                    <p className="text-xs font-bold truncate">{userProfile.name}</p>
                    <p className="text-[11px] font-mono text-[#8F9CAE]">{userProfile.handle}</p>
                    <div className="mt-2 flex items-center gap-1.5">
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-[#FF9418]/20 text-[#FF9418] border border-[#FF9418]/40 rounded-md font-bold">
                        {userProfile.collectedStampIds.length}/34 Stamped
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-[#101827] text-[#8F9CAE] rounded-md capitalize">
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
                      className="w-full px-4 py-2 text-left text-xs hover:bg-[#FF9418]/15 flex items-center gap-2.5 font-bold transition-colors"
                    >
                      <Award className="w-4 h-4 text-[#FF9418]" />
                      <span>View My Passport</span>
                    </button>

                    <button
                      onClick={() => {
                        setOnboardingOpen(true);
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs hover:bg-[#FF9418]/15 flex items-center gap-2.5 font-medium transition-colors"
                    >
                      <MapPin className="w-4 h-4 text-[#1C6555]" />
                      <span>Change Home District</span>
                    </button>

                    <button
                      onClick={() => {
                        setShareModalOpen(true);
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs hover:bg-[#FF9418]/15 flex items-center gap-2.5 font-medium transition-colors"
                    >
                      <Sparkles className="w-4 h-4 text-[#9D233B]" />
                      <span>Share Explorer Card</span>
                    </button>
                  </div>

                  <div className="pt-1 mt-1 border-t-2 border-[#25324A]">
                    <button
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-[#9D233B] hover:bg-[#9D233B]/10 font-bold transition-colors"
                    >
                      Sign Out
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
