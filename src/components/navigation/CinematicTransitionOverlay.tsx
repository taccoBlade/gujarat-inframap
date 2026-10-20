import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAtlasStore } from '../../stores/useAtlasStore';
import { AtlasMode } from '../../types/atlas';

interface TransitionPreset {
  code: string;
  badge: string;
  title: string;
  gujarati: string;
  accent: string;
  glowColor: string;
  subtext: string;
  iconSvg: React.ReactNode;
}

const PRESETS: Record<AtlasMode, TransitionPreset> = {
  explore: {
    code: 'GEO-01 // SPATIAL RADAR',
    badge: 'LIVING DIGITAL TWIN',
    title: 'Surveillance Digital Twin Atlas',
    gujarati: 'સચિત્ર ડિજિટલ ટ્વીન નકશો',
    accent: '#00F0FF',
    glowColor: 'rgba(0, 240, 255, 0.4)',
    subtext: 'Cultural Spatial Atlas • 34 Districts • Real-Time Corridors',
    iconSvg: (
      <svg className="w-10 h-10 sm:w-14 sm:h-14 stroke-[#00F0FF] fill-none stroke-[2]" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="42" strokeDasharray="4 4" className="animate-spin" style={{ animationDuration: '10s' }} />
        <circle cx="50" cy="50" r="28" strokeOpacity="0.7" />
        <circle cx="50" cy="50" r="14" strokeOpacity="0.9" fill="#00F0FF" fillOpacity="0.1" />
        <line x1="8" y1="50" x2="92" y2="50" strokeOpacity="0.6" />
        <line x1="50" y1="8" x2="50" y2="92" strokeOpacity="0.6" />
        <circle cx="68" cy="32" r="3.5" fill="#00F0FF" />
        <circle cx="36" cy="66" r="3" fill="#FF9418" />
      </svg>
    )
  },
  places: {
    code: 'ARCH-02 // HERITAGE CITADELS',
    badge: '37 VERIFIED REPOSITORIES',
    title: 'Ancient Cultural Repositories',
    gujarati: '૩૭ સાંસ્કૃતિક પ્રવાસ સ્થળો',
    accent: '#FF9418',
    glowColor: 'rgba(255, 148, 24, 0.4)',
    subtext: 'Solanki Stepwells • Harappan Metropolis • Coastal Mokshapuris',
    iconSvg: (
      <svg className="w-10 h-10 sm:w-14 sm:h-14 stroke-[#FF9418] fill-none stroke-[2]" viewBox="0 0 100 100">
        <path d="M 12 86 L 88 86" strokeOpacity="0.4" />
        <path d="M 22 86 L 22 66 L 78 66 L 78 86" />
        <path d="M 32 66 L 32 48 L 68 48 L 68 66" />
        <path d="M 42 48 L 42 32 L 58 32 L 58 48" />
        <circle cx="50" cy="18" r="9" stroke="#FF9418" fill="#FF9418" fillOpacity="0.2" />
        <line x1="50" y1="5" x2="50" y2="10" stroke="#FF9418" strokeWidth="2.5" />
        <line x1="50" y1="26" x2="50" y2="31" stroke="#FF9418" strokeWidth="2.5" />
        <line x1="37" y1="18" x2="42" y2="18" stroke="#FF9418" strokeWidth="2.5" />
        <line x1="58" y1="18" x2="63" y2="18" stroke="#FF9418" strokeWidth="2.5" />
      </svg>
    )
  },
  passport: {
    code: 'SEAL-03 // SOLANKI IMPERIAL LEDGER',
    badge: '34 DISTRICTS CHALLENGE',
    title: 'Royal Solanki Digital Passport',
    gujarati: 'રાજવી સોલંકી ડિજિટલ પાસપોર્ટ',
    accent: '#F59E0B',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    subtext: 'Verified Territorial Stamps • Architectural Lineage • State Rank',
    iconSvg: (
      <svg className="w-10 h-10 sm:w-14 sm:h-14 stroke-[#F59E0B] fill-none stroke-[2]" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="44" strokeDasharray="3 3" strokeOpacity="0.6" />
        <rect x="22" y="22" width="56" height="56" rx="6" stroke="#1C6555" strokeWidth="2" />
        <rect x="22" y="22" width="56" height="56" rx="6" stroke="#F59E0B" strokeWidth="2" transform="rotate(45 50 50)" />
        <circle cx="50" cy="50" r="16" fill="#F59E0B" fillOpacity="0.2" stroke="#F59E0B" />
        <path d="M 46 44 Q 50 38 54 44 Q 56 52 50 56 Q 44 52 46 44 Z" fill="#F59E0B" />
      </svg>
    )
  },
  unfiltered: {
    code: 'ARCHIVE-04 // FORENSIC DOSSIERS',
    badge: '45 CLASSIFIED FIELD DISPATCHES',
    title: 'Gujarat Unfiltered Archive',
    gujarati: '૪૫ અજાણી વાતો અને લોકવાયકા',
    accent: '#EF4444',
    glowColor: 'rgba(239, 68, 68, 0.4)',
    subtext: 'Ground Reality • Oral Folklore • Geological Anomalies • Uncensored Truth',
    iconSvg: (
      <svg className="w-10 h-10 sm:w-14 sm:h-14 stroke-[#EF4444] fill-none stroke-[2]" viewBox="0 0 100 100">
        <path d="M 16 26 L 44 26 L 52 34 L 84 34 L 84 82 L 16 82 Z" strokeWidth="2" />
        <path d="M 16 38 L 84 38" strokeOpacity="0.5" />
        <ellipse cx="50" cy="58" rx="20" ry="12" stroke="#FF9418" />
        <circle cx="50" cy="58" r="5" fill="#EF4444" stroke="#FF9418" />
        <line x1="22" y1="58" x2="28" y2="58" />
        <line x1="72" y1="58" x2="78" y2="58" />
      </svg>
    )
  },
  infrastructure: {
    code: 'TRAIL-05 // SCENIC TRAVEL CORRIDORS',
    badge: 'EXPEDITION & PILGRIM HIGHWAYS',
    title: 'Heritage Trails & Scenic Highways',
    gujarati: 'પ્રવાસન હાઈવે અને યાત્રા માર્ગો',
    accent: '#10B981',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    subtext: 'Coastal Dwarka Highway • Gir Forest Safari Route • Kutch Road to Heaven',
    iconSvg: (
      <svg className="w-10 h-10 sm:w-14 sm:h-14 stroke-[#10B981] fill-none stroke-[2]" viewBox="0 0 100 100">
        <path d="M 34 86 L 34 30 L 45 15 L 56 30 L 56 86" strokeWidth="2" />
        <line x1="34" y1="42" x2="56" y2="42" strokeOpacity="0.6" />
        <line x1="34" y1="58" x2="56" y2="58" strokeOpacity="0.6" />
        <path d="M 62 86 L 62 42 L 74 42 L 74 86" strokeOpacity="0.8" />
        <path d="M 10 74 Q 50 66 90 74" stroke="#00F0FF" strokeWidth="2.5" />
        <line x1="25" y1="73" x2="25" y2="86" stroke="#00F0FF" />
        <line x1="50" y1="70" x2="50" y2="86" stroke="#00F0FF" />
        <line x1="75" y1="73" x2="75" y2="86" stroke="#00F0FF" />
      </svg>
    )
  },
  ev: {
    code: 'EV-06 // HIGHWAY POWER GRID',
    badge: '180KW ULTRA-FAST RADAR',
    title: 'EV Highway Supercharger Radar',
    gujarati: 'ઇવી હાઇવે રડાર',
    accent: '#10B981',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    subtext: 'Blackout-Proof DG Generators • Remote Saurashtra & Kutch Dead Zone Warnings',
    iconSvg: (
      <svg className="w-10 h-10 sm:w-14 sm:h-14 stroke-[#10B981] fill-none stroke-[2]" viewBox="0 0 100 100">
        <path d="M 52 14 L 32 52 L 48 52 L 44 86 L 68 45 L 52 45 Z" fill="#10B981" fillOpacity="0.2" strokeWidth="2.5" />
      </svg>
    )
  }
};

// Relaxed, cinematic, slower-paced duration (1100ms)
const TRANSITION_DURATION_MS = 1100;

export const CinematicTransitionOverlay: React.FC = () => {
  const { currentMode } = useAtlasStore();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [preset, setPreset] = useState<TransitionPreset>(PRESETS.explore);
  const prevModeRef = useRef<AtlasMode>(currentMode);

  useEffect(() => {
    if (prevModeRef.current !== currentMode) {
      prevModeRef.current = currentMode;
      setPreset(PRESETS[currentMode] || PRESETS.explore);
      setIsTransitioning(true);

      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, TRANSITION_DURATION_MS);

      return () => clearTimeout(timer);
    }
  }, [currentMode]);

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.32, ease: 'easeInOut' }}
          className="fixed inset-0 z-[3000] pointer-events-none select-none flex items-center justify-center p-4 overflow-hidden"
        >
          {/* 1. Backdrop Glass Veil with Soft Radial Darkness */}
          <div className="absolute inset-0 bg-[#060913]/90 backdrop-blur-xl" />

          {/* 2. Top Precision Scan Conduit (Never cuts through text) */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: [0, 1, 1], opacity: [0, 1, 0.8] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
            style={{ 
              backgroundColor: preset.accent, 
              boxShadow: `0 0 20px ${preset.accent}, 0 0 40px ${preset.accent}` 
            }}
            className="absolute top-0 inset-x-0 h-[3px] origin-left z-20"
          />

          {/* 3. Subtle Cartographic Watermark Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#FF9418_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

          {/* 4. Cohesive Central Holographic Card - Stately Slow Presentation */}
          <motion.div
            initial={{ scale: 0.90, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 1.03, opacity: 0, y: -10 }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-30 flex flex-col items-center justify-center text-center max-w-sm sm:max-w-md w-full px-5 py-6 sm:py-8 rounded-3xl border-2 border-white/10 bg-[#0A0F1D]/85 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)]"
          >
            {/* Holographic Glowing Icon Pod */}
            <div className="relative mb-3 sm:mb-4">
              <div 
                style={{ borderColor: preset.accent, animationDuration: '8s' }}
                className="absolute -inset-2 rounded-2xl border border-dashed animate-spin opacity-30 pointer-events-none"
              />
              <div 
                style={{ 
                  borderColor: preset.accent, 
                  boxShadow: `0 0 35px ${preset.glowColor}, inset 0 0 15px ${preset.glowColor}` 
                }}
                className="p-3.5 sm:p-4 rounded-2xl border-2 bg-black/70 flex items-center justify-center"
              >
                {preset.iconSvg}
              </div>
            </div>

            {/* Territorial Technical Code Pill */}
            <div
              style={{ 
                color: preset.accent, 
                borderColor: `${preset.accent}50`, 
                backgroundColor: `${preset.accent}15` 
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-mono font-black uppercase tracking-wider border mb-2 shadow-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: preset.accent }} />
              <span>{preset.code}</span>
            </div>

            {/* Gujarati Script - Clear spacing, no collisions */}
            <div className="mb-1">
              <span className="text-xs sm:text-sm font-['Noto_Sans_Gujarati'] font-black text-[#FF9418] drop-shadow-[0_1px_8px_rgba(255,148,24,0.6)] tracking-wide block">
                {preset.gujarati}
              </span>
            </div>

            {/* English Hero Title */}
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white font-editorial tracking-tight drop-shadow-md leading-tight mb-2">
              {preset.title}
            </h2>

            {/* Editorial Subtext */}
            <p className="text-[11px] sm:text-xs text-slate-300 font-mono max-w-xs sm:max-w-sm mx-auto leading-relaxed opacity-90">
              {preset.subtext}
            </p>
          </motion.div>

        </motion.div>
      )}
    </AnimatePresence>
  );
};
