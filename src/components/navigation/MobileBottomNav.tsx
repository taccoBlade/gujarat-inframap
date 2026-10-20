import React from 'react';
import { useAtlasStore } from '../../stores/useAtlasStore';
import { AtlasMode } from '../../types/atlas';
import { Compass, Map, Award, Sparkles, Zap } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { currentMode, setMode, userProfile, theme } = useAtlasStore();

  const navItems: { mode: AtlasMode; label: string; icon: React.ReactNode; badge?: string }[] = [
    { 
      mode: 'explore', 
      label: 'Atlas Map', 
      icon: <Map className="w-5 h-5" /> 
    },
    { 
      mode: 'places', 
      label: 'Destinations', 
      icon: <Compass className="w-5 h-5" /> 
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
      icon: <Sparkles className="w-5 h-5" /> 
    },
    { 
      mode: 'infrastructure', 
      label: 'Infra', 
      icon: <Zap className="w-5 h-5" /> 
    },
  ];

  return (
    <nav 
      aria-label="Mobile Navigation"
      className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t-2 backdrop-blur-xl transition-colors duration-200 safe-bottom ${
        theme === 'dark' 
          ? 'bg-[#101827]/98 border-[#25324A] text-[#F1E8D7] shadow-[0_-4px_16px_rgba(0,0,0,0.4)]' 
          : 'bg-[#FAF6ED]/98 border-[#25324A] text-[#101827] shadow-[0_-4px_16px_rgba(0,0,0,0.06)]'
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
                  ? 'text-[#FF9418] font-black' 
                  : theme === 'dark'
                    ? 'text-[#8F9CAE] hover:text-[#F1E8D7] font-medium'
                    : 'text-[#606F7B] hover:text-[#101827] font-medium'
              }`}
            >
              {/* Active top accent pill indicator */}
              {isActive && (
                <div className="absolute top-0 w-8 h-1 rounded-b-md bg-[#FF9418] shadow-[0_1px_4px_rgba(255,148,24,0.6)]" />
              )}

              <div className="relative mb-0.5">
                {item.icon}
                {item.badge && (
                  <span className={`absolute -top-1.5 -right-3.5 px-1 py-0.2 text-[9px] font-mono font-bold rounded leading-none ${
                    isActive 
                      ? 'bg-[#FF9418] text-[#101827]' 
                      : theme === 'dark'
                        ? 'bg-[#151F30] text-[#FF9418] border border-[#25324A]'
                        : 'bg-white text-[#9D233B] border border-[#25324A]'
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
