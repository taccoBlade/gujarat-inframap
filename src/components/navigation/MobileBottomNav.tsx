import React from 'react';
import { useAtlasStore } from '../../stores/useAtlasStore';
import { AtlasMode } from '../../types/atlas';
import { Compass, Map, Award, Sparkles, Zap } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { currentMode, setMode, userProfile, theme } = useAtlasStore();

  const navItems: { mode: AtlasMode; label: string; icon: React.ReactNode; badge?: string }[] = [
    { 
      mode: 'places', 
      label: 'Destinations', 
      icon: <Compass className="w-5 h-5" />, 
      badge: '37' 
    },
    { 
      mode: 'explore', 
      label: 'Atlas Map', 
      icon: <Map className="w-5 h-5" /> 
    },
    { 
      mode: 'passport', 
      label: 'Passport', 
      icon: <Award className="w-5 h-5" />, 
      badge: `${userProfile.collectedStampIds.length}/34` 
    },
    { 
      mode: 'unfiltered', 
      label: 'Stories', 
      icon: <Sparkles className="w-5 h-5" />, 
      badge: '45' 
    },
    { 
      mode: 'infrastructure', 
      label: 'Infra', 
      icon: <Zap className="w-5 h-5" />, 
      badge: '3.3k' 
    },
  ];

  return (
    <nav 
      aria-label="Mobile Navigation"
      className={`md:hidden fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-xl transition-colors duration-200 safe-bottom ${
        theme === 'dark' 
          ? 'bg-[#0c1524]/95 border-amber-500/20 text-slate-300 shadow-[0_-8px_30px_rgba(0,0,0,0.5)]' 
          : 'bg-[#FDFBF7]/95 border-[#D8C3A5] text-[#44403c] shadow-[0_-8px_30px_rgba(0,0,0,0.08)]'
      }`}
    >
      <div className="grid grid-cols-5 h-16 items-center px-1">
        {navItems.map((item) => {
          const isActive = currentMode === item.mode;
          return (
            <button
              key={item.mode}
              onClick={() => {
                setMode(item.mode);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex flex-col items-center justify-center h-full py-1 transition-all relative ${
                isActive 
                  ? theme === 'dark' 
                    ? 'text-amber-400 font-bold' 
                    : 'text-amber-700 font-bold'
                  : theme === 'dark'
                    ? 'text-slate-400 hover:text-slate-200 font-medium'
                    : 'text-stone-500 hover:text-stone-800 font-medium'
              }`}
            >
              {/* Active top accent pill indicator */}
              {isActive && (
                <div className="absolute top-0 w-8 h-1 rounded-b-full bg-gradient-to-r from-amber-500 to-amber-600 shadow-sm" />
              )}

              <div className="relative mb-0.5">
                {item.icon}
                {item.badge && (
                  <span className={`absolute -top-1.5 -right-3 px-1 py-0.2 text-[9px] font-mono font-bold rounded-full leading-none ${
                    isActive 
                      ? 'bg-amber-500 text-slate-950' 
                      : theme === 'dark'
                        ? 'bg-slate-800 text-amber-300 border border-slate-700'
                        : 'bg-[#EDE5D8] text-stone-700 border border-[#D8C3A5]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </div>

              <span className="text-[10px] tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
