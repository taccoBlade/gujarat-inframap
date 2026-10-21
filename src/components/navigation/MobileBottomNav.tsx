import React from 'react';
import { useAtlasStore } from '../../stores/useAtlasStore';
import { AtlasMode } from '../../types/atlas';
import { Compass, Map, Award, Sparkles, Zap, Utensils } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { currentMode, setMode, userProfile, theme } = useAtlasStore();

  const navItems: { mode: AtlasMode; label: string; icon: React.ReactNode; badge?: string }[] = [
    { 
      mode: 'explore', 
      label: 'Atlas', 
      icon: <Map className="w-4 h-4" /> 
    },
    { 
      mode: 'food', 
      label: 'Food', 
      icon: <Utensils className="w-4 h-4 text-[#FF9418]" /> 
    },
    { 
      mode: 'places', 
      label: 'Places', 
      icon: <Compass className="w-4 h-4" /> 
    },
    { 
      mode: 'passport', 
      label: 'Passport', 
      icon: <Award className="w-4 h-4" />, 
      badge: `${userProfile?.collectedStampIds?.length ?? 1}/34` 
    },
    { 
      mode: 'unfiltered', 
      label: 'Stories', 
      icon: <Sparkles className="w-4 h-4" /> 
    },
    { 
      mode: 'infrastructure', 
      label: 'Infra', 
      icon: <Zap className="w-4 h-4" /> 
    },
  ];

  return (
    <nav 
      aria-label="Mobile Navigation"
      className={`md:hidden fixed bottom-0 left-0 right-0 z-[9999] border-t-2 transition-colors duration-200 safe-bottom select-none ${
        theme === 'dark' 
          ? 'bg-[#101827] border-[#25324A] text-[#F1E8D7] shadow-[0_-4px_24px_rgba(0,0,0,0.7)]' 
          : 'bg-[#FAF6ED] border-[#25324A] text-[#101827] shadow-[0_-4px_24px_rgba(0,0,0,0.15)]'
      }`}
    >
      <div className="grid grid-cols-6 h-16 items-center px-0.5">
        {navItems.map((item) => {
          const isActive = currentMode === item.mode;
          return (
            <button
              key={item.mode}
              onClick={() => {
                setMode(item.mode);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex flex-col items-center justify-center h-full py-1 transition-all relative touch-manipulation active:scale-95 ${
                isActive 
                  ? 'text-[#FF9418] font-black' 
                  : theme === 'dark'
                    ? 'text-[#8F9CAE] hover:text-[#F1E8D7] font-semibold'
                    : 'text-[#606F7B] hover:text-[#101827] font-semibold'
              }`}
            >
              {/* Active top accent pill indicator */}
              {isActive && (
                <div className="absolute top-0 w-10 h-1 rounded-b-md bg-[#FF9418] shadow-[0_2px_8px_#FF9418]" />
              )}

              <div className="relative mb-0.5">
                {item.icon}
                {item.badge && (
                  <span className={`absolute -top-1.5 -right-3 px-1 py-0.2 text-[8px] font-mono font-bold rounded leading-none ${
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

              <span className={`text-[10px] tracking-tight leading-none ${isActive ? 'font-black' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
