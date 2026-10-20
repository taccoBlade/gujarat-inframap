import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAtlasStore } from '../../stores/useAtlasStore';
import { AtlasMode } from '../../types/atlas';

interface TransitionMeta {
  code: string;
  title: string;
  gujarati: string;
  subtitle: string;
  accent: string;
  bgGradient: string;
  iconSvg: React.ReactNode;
}

const TRANSITION_PRESETS: Record<AtlasMode, TransitionMeta> = {
  explore: {
    code: 'GEO-01 // SPATIAL RADAR',
    title: 'Living Digital Twin',
    gujarati: 'ડિજિટલ ટ્વીન નકશો',
    subtitle: 'Full-State Spatial Coordinate System • Survey of India Alignment',
    accent: '#00F0FF',
    bgGradient: 'from-[#060B14] via-[#0A1222] to-[#040810]',
    iconSvg: (
      <svg className="w-24 h-24 sm:w-32 sm:h-32 stroke-[#00F0FF] fill-none stroke-[1.5]" viewBox="0 0 100 100">
        {/* Radar concentric rings */}
        <circle cx="50" cy="50" r="45" strokeOpacity="0.3" strokeDasharray="4 4" />
        <circle cx="50" cy="50" r="30" strokeOpacity="0.5" />
        <circle cx="50" cy="50" r="15" strokeOpacity="0.8" />
        {/* Crosshairs */}
        <line x1="5" y1="50" x2="95" y2="50" strokeOpacity="0.6" />
        <line x1="50" y1="5" x2="50" y2="95" strokeOpacity="0.6" />
        {/* Coordinate blips */}
        <circle cx="65" cy="35" r="2.5" fill="#00F0FF" />
        <circle cx="40" cy="68" r="2" fill="#FF9418" />
        <circle cx="70" cy="62" r="2" fill="#00F0FF" />
      </svg>
    )
  },
  places: {
    code: 'ARCH-02 // HERITAGE REPOSITORIES',
    title: 'Verified Destinations',
    gujarati: '૩૭ સાંસ્કૃતિક પ્રવાસ સ્થળો',
    subtitle: 'Solanki Stepwells • Harappan Citadels • Jyotirlinga Shrines • Lion Reserves',
    accent: '#FF9418',
    bgGradient: 'from-[#1A0E05] via-[#241408] to-[#120903]',
    iconSvg: (
      <svg className="w-24 h-24 sm:w-32 sm:h-32 stroke-[#FF9418] fill-none stroke-[1.5]" viewBox="0 0 100 100">
        {/* Stepwell descending nested arches line art */}
        <path d="M 10 85 L 90 85" strokeOpacity="0.4" />
        <path d="M 20 85 L 20 65 L 80 65 L 80 85" />
        <path d="M 30 65 L 30 48 L 70 48 L 70 65" />
        <path d="M 40 48 L 40 32 L 60 32 L 60 48" />
        {/* Solanki Sun disc */}
        <circle cx="50" cy="18" r="8" stroke="#FF9418" />
        <path d="M 50 6 L 50 10 M 50 26 L 50 30 M 38 18 L 42 18 M 58 18 L 62 18" stroke="#FF9418" />
      </svg>
    )
  },
  passport: {
    code: 'SEAL-03 // SOLANKI IMPERIAL LEDGER',
    title: '34 Districts Explorer Challenge',
    gujarati: 'રાજવી સોલંકી ડિજિટલ પાસપોર્ટ',
    subtitle: 'Official Cultural Pilgrimage • Verified Geographic Stamps • Rank Milestones',
    accent: '#F59E0B',
    bgGradient: 'from-[#061510] via-[#0B231B] to-[#040D0A]',
    iconSvg: (
      <svg className="w-24 h-24 sm:w-32 sm:h-32 stroke-[#F59E0B] fill-none stroke-[1.5]" viewBox="0 0 100 100">
        {/* Ornate 8-pointed royal mandala star seal */}
        <circle cx="50" cy="50" r="42" strokeOpacity="0.4" strokeDasharray="3 3" />
        <rect x="22" y="22" width="56" height="56" rx="6" stroke="#1C6555" strokeWidth="1.5" />
        <rect x="22" y="22" width="56" height="56" rx="6" stroke="#F59E0B" strokeWidth="1.5" transform="rotate(45 50 50)" />
        {/* Inner royal stamp core with Gujarati glyph */}
        <circle cx="50" cy="50" r="16" fill="#F59E0B" fillOpacity="0.15" stroke="#F59E0B" />
        <path d="M 46 44 Q 50 38 54 44 Q 56 52 50 56 Q 44 52 46 44 Z" fill="#F59E0B" />
      </svg>
    )
  },
  unfiltered: {
    code: 'ARCHIVE-04 // CLASSIFIED FIELD DOSSIERS',
    title: 'Gujarat Unfiltered Archive',
    gujarati: '૪૫ અજાણી વાતો અને લોકવાયકા',
    subtitle: 'Forensic Ground Reality • Centuried Oral Folklore • Geological Anomalies',
    accent: '#9D233B',
    bgGradient: 'from-[#140609] via-[#1E090F] to-[#0A0305]',
    iconSvg: (
      <svg className="w-24 h-24 sm:w-32 sm:h-32 stroke-[#9D233B] fill-none stroke-[1.5]" viewBox="0 0 100 100">
        {/* Classified Folder / Forensic Dossier Eye line art */}
        <path d="M 15 25 L 42 25 L 50 33 L 85 33 L 85 82 L 15 82 Z" strokeWidth="1.5" />
        <path d="M 15 37 L 85 37" strokeOpacity="0.5" />
        {/* Forensic reticle / eye */}
        <ellipse cx="50" cy="58" rx="20" ry="12" stroke="#FF9418" />
        <circle cx="50" cy="58" r="5" fill="#9D233B" stroke="#FF9418" />
        <line x1="22" y1="58" x2="28" y2="58" />
        <line x1="72" y1="58" x2="78" y2="58" />
      </svg>
    )
  },
  infrastructure: {
    code: 'ENG-05 // CYBER-CORRIDOR & GIFT CITY',
    title: 'Infrastructure Directory',
    gujarati: 'ઇન્ફ્રાસ્ટ્રક્ચર અને ઔદ્યોગિક કોરિડોર',
    subtitle: 'GIFT City • High-Speed Rail • Khavda Renewable Park • Dholera SIR',
    accent: '#00F0FF',
    bgGradient: 'from-[#050D17] via-[#091728] to-[#03080F]',
    iconSvg: (
      <svg className="w-24 h-24 sm:w-32 sm:h-32 stroke-[#00F0FF] fill-none stroke-[1.5]" viewBox="0 0 100 100">
        {/* GIFT City Tower & Bullet Train Blueprint line art */}
        {/* Tower 1 (Diamond geometry) */}
        <path d="M 35 85 L 35 30 L 45 15 L 55 30 L 55 85" strokeWidth="1.8" />
        <line x1="35" y1="42" x2="55" y2="42" strokeOpacity="0.5" />
        <line x1="35" y1="56" x2="55" y2="56" strokeOpacity="0.5" />
        <line x1="35" y1="70" x2="55" y2="70" strokeOpacity="0.5" />
        {/* Tower 2 */}
        <path d="M 60 85 L 60 40 L 72 40 L 72 85" strokeOpacity="0.7" />
        {/* High Speed Viaduct track */}
        <path d="M 10 75 Q 50 68 90 75" stroke="#10B981" strokeWidth="2" />
        <line x1="25" y1="74" x2="25" y2="85" stroke="#10B981" />
        <line x1="50" y1="71" x2="50" y2="85" stroke="#10B981" />
        <line x1="75" y1="74" x2="75" y2="85" stroke="#10B981" />
      </svg>
    )
  },
  ev: {
    code: 'EV-06 // HIGHWAY POWER GRID',
    title: 'EV Highway Radar',
    gujarati: 'ઇવી હાઇવે રડાર',
    subtitle: '180kW Fast Highway Chargers • Rural Dead Zone Alerts',
    accent: '#10B981',
    bgGradient: 'from-[#051510] via-[#0A241B] to-[#040E0A]',
    iconSvg: (
      <svg className="w-24 h-24 sm:w-32 sm:h-32 stroke-[#10B981] fill-none stroke-[1.5]" viewBox="0 0 100 100">
        <path d="M 52 15 L 32 52 L 48 52 L 44 85 L 68 45 L 52 45 Z" fill="#10B981" fillOpacity="0.2" strokeWidth="2" />
      </svg>
    )
  }
};

export const CinematicTransitionOverlay: React.FC = () => {
  const { currentMode } = useAtlasStore();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activePreset, setActivePreset] = useState<TransitionMeta>(TRANSITION_PRESETS.explore);
  const prevModeRef = useRef<AtlasMode>(currentMode);

  useEffect(() => {
    // Only trigger when mode actually changes
    if (prevModeRef.current !== currentMode) {
      prevModeRef.current = currentMode;
      const preset = TRANSITION_PRESETS[currentMode] || TRANSITION_PRESETS.explore;
      setActivePreset(preset);
      setIsTransitioning(true);

      // Snappy 480ms cinematic sweep
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 520);

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
          transition={{ duration: 0.18 }}
          className={`fixed inset-0 z-[1500] pointer-events-none flex flex-col items-center justify-center p-6 bg-gradient-to-b ${activePreset.bgGradient} backdrop-blur-xl select-none`}
        >
          {/* Cyber / Archival laser horizontal scan line */}
          <motion.div 
            initial={{ y: '-100vh' }}
            animate={{ y: '100vh' }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            style={{ backgroundColor: activePreset.accent }}
            className="absolute inset-x-0 h-1 opacity-75 shadow-[0_0_15px_currentColor] pointer-events-none"
          />

          {/* Central Line Art Graphic with pulse & draw animation */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0, rotate: -3 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 1.05, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex items-center justify-center mb-6"
          >
            <div 
              style={{ borderColor: `${activePreset.accent}40`, boxShadow: `0 0 40px ${activePreset.accent}20` }}
              className="p-5 sm:p-6 rounded-3xl border-2 backdrop-blur-md bg-black/40"
            >
              {activePreset.iconSvg}
            </div>
          </motion.div>

          {/* Text Identity Box */}
          <motion.div
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.25, delay: 0.05 }}
            className="text-center space-y-2 max-w-lg"
          >
            <div 
              style={{ color: activePreset.accent, borderColor: `${activePreset.accent}50`, backgroundColor: `${activePreset.accent}15` }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest border"
            >
              <span>{activePreset.code}</span>
            </div>

            <div className="space-y-0.5">
              <span className="text-xs sm:text-sm font-['Noto_Sans_Gujarati'] font-bold text-[#FF9418] block">
                {activePreset.gujarati}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-editorial tracking-tight">
                {activePreset.title}
              </h2>
            </div>

            <p className="text-xs text-[#8F9CAE] font-mono leading-relaxed px-4">
              {activePreset.subtitle}
            </p>
          </motion.div>

        </motion.div>
      )}
    </AnimatePresence>
  );
};
