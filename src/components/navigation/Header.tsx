import React from 'react';
import { useAtlasStore } from '../../stores/useAtlasStore';
import { AtlasMode } from '../../types/atlas';
import { Compass, Map, ShieldAlert, Sparkles, Moon, Sun, Award } from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    currentMode, 
    setMode, 
    theme, 
    toggleTheme, 
    afterDarkRadarActive, 
    toggleAfterDarkRadar,
    userProfile 
  } = useAtlasStore();

  const navItems: { mode: AtlasMode; label: string; icon: React.ReactNode; badge?: string }[] = [
    { mode: 'passport', label: 'Gujarat Passport', icon: <Award className="w-4 h-4 text-amber-400" />, badge: `${userProfile.collectedStampIds.length}/34` },
    { mode: 'explore', label: 'Atlas Map', icon: <Map className="w-4 h-4 text-sky-400" /> },
    { mode: 'unfiltered', label: 'Unfiltered Stories', icon: <Sparkles className="w-4 h-4 text-rose-400" />, badge: '45' },
    { mode: 'places', label: 'Destinations', icon: <Compass className="w-4 h-4 text-emerald-400" /> },
    { mode: 'infrastructure', label: 'Infrastructure', icon: <span className="text-sm">⚡</span>, badge: '3,337' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0f172a]/90 backdrop-blur-md border-b-2 border-slate-800 text-slate-100 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Brand identity */}
        <div 
          onClick={() => setMode('passport')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border-2 border-amber-500/40 flex items-center justify-center font-bold text-amber-400 text-xl shadow-[2px_2px_0px_#f59e0b] group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform">
            ગૂ
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-lg text-white font-['Outfit']">
                Gujarat <span className="text-amber-400">Atlas</span>
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded uppercase tracking-wider font-mono">
                Pravas
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-['Noto_Sans_Gujarati']">
              ગુજરાત ડિજિટલ પાસપોર્ટ &amp; એટલાસ
            </span>
          </div>
        </div>

        {/* Primary Mode Navigation */}
        <nav className="hidden md:flex items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800 shadow-inner">
          {navItems.map((item) => {
            const isActive = currentMode === item.mode;
            return (
              <button
                key={item.mode}
                onClick={() => setMode(item.mode)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all relative ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-[2px_2px_0px_rgba(0,0,0,0.4)] translate-y-[-1px]'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    isActive ? 'bg-black/20 text-black' : 'bg-slate-800 text-amber-400 border border-slate-700'
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
          
          {/* After Dark Radar Button */}
          <button
            onClick={toggleAfterDarkRadar}
            title="Toggle Gujarat After Dark (Paranormal & Folklore Radar)"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all ${
              afterDarkRadarActive
                ? 'bg-purple-950 text-purple-200 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)] animate-pulse'
                : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">After Dark</span>
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:border-slate-500 transition-colors"
            title="Toggle Day/Night View"
          >
            {theme === 'dark' ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
          </button>

          {/* User Passport Pill */}
          <button
            onClick={() => setMode('passport')}
            className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 hover:border-amber-400 transition-all text-left"
          >
            <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shadow">
              {userProfile.collectedStampIds.length}
            </div>
            <div className="hidden sm:flex flex-col leading-none">
              <span className="text-[11px] font-bold text-amber-300">Passport</span>
              <span className="text-[9px] text-slate-400 font-mono">34 Districts</span>
            </div>
          </button>

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
