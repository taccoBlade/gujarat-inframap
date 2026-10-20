import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { useAtlasStore } from '../../stores/useAtlasStore';
import { VERIFIED_TOURIST_DESTINATIONS, TouristDestination } from '../../data/tourist-destinations';
import { ToranOrnamentalBorder } from '../cultural/GujaratiPatterns';
import { 
  Sparkles, 
  MapPin, 
  Navigation, 
  ExternalLink, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Compass, 
  Layers, 
  X,
  Eye,
  Info
} from 'lucide-react';

interface AtlasHotspot {
  id: string;
  name: string;
  gujarati: string;
  district: string;
  tagline: string;
  topPercent: number;    // % from top on the 1024x682 canvas
  leftPercent: number;   // % from left on the 1024x682 canvas
  icon: string;
  accent: string;
  coords: [number, number]; // [lat, lng] for precision flyTo
}

const ATLAS_HOTSPOTS: AtlasHotspot[] = [
  {
    id: 'dholavira-harappan-city',
    name: 'Dholavira Citadel & White Rann',
    gujarati: 'ધોળાવીરા અને રણ કચ્છ',
    district: 'Kutch',
    tagline: '5,000-year Harappan metropolis & UNESCO World Heritage white salt desert',
    topPercent: 20.5,
    leftPercent: 46.2,
    icon: '🏛️',
    accent: '#E2E8F0',
    coords: [23.8864, 70.2133]
  },
  {
    id: 'kutch-bhuj-rann',
    name: 'Kutch & Bhuj Desert Corridor',
    gujarati: 'કચ્છ અને ભુજ',
    district: 'Kutch',
    tagline: 'Centuries of Kutchi textile embroidery, camels, and Rogan art',
    topPercent: 30.5,
    leftPercent: 30.0,
    icon: '🐪',
    accent: '#FF9418',
    coords: [23.242, 69.6669]
  },
  {
    id: 'rani-ki-vav',
    name: 'Rani ki Vav Stepwell',
    gujarati: 'રાણીની વાવ (પાટણ)',
    district: 'Patan',
    tagline: 'Solanki architectural subterranean masterwork with 800+ deities',
    topPercent: 24.2,
    leftPercent: 57.5,
    icon: '👑',
    accent: '#FF9418',
    coords: [23.8589, 72.1017]
  },
  {
    id: 'modhera-sun-temple',
    name: 'Modhera Sun Temple',
    gujarati: 'મોઢેરા સૂર્ય મંદિર (મહેસાણા)',
    district: 'Mehsana',
    tagline: '1026 CE Solanki Sun Chariot with 52 intricately sculpted pillars',
    topPercent: 16.5,
    leftPercent: 64.5,
    icon: '☀️',
    accent: '#F59E0B',
    coords: [23.5833, 72.1333]
  },
  {
    id: 'sabarmati-ashram',
    name: 'Sabarmati & Heritage Ahmedabad',
    gujarati: 'સાબરમતી આશ્રમ અને પોળ',
    district: 'Ahmedabad',
    tagline: 'UNESCO World Heritage City, Mahatma Gandhi Ashram & Sidi Saiyyed Jali',
    topPercent: 34.0,
    leftPercent: 61.5,
    icon: '🕊️',
    accent: '#1C6555',
    coords: [23.0605, 72.5802]
  },
  {
    id: 'gandhinagar-capital',
    name: 'Gandhinagar Capital Complex',
    gujarati: 'ગાંધીનગર રાજધાની',
    district: 'Gandhinagar',
    tagline: 'Greenest capital city, Secretariat & Akshardham monument',
    topPercent: 36.8,
    leftPercent: 71.0,
    icon: '🏛️',
    accent: '#10B981',
    coords: [23.2156, 72.6369]
  },
  {
    id: 'dwarkadhish-temple',
    name: 'Dwarkadhish Temple',
    gujarati: 'દ્વારકાધીશ મંદિર (દેવભૂમિ દ્વારકા)',
    district: 'Devbhoomi Dwarka',
    tagline: 'Sacred coastal Mokshapuri, 72-pillar sanctum overlooking the Arabian Sea',
    topPercent: 47.5,
    leftPercent: 25.5,
    icon: '🕉️',
    accent: '#F59E0B',
    coords: [22.2376, 68.9678]
  },
  {
    id: 'porbandar-kirti-mandir',
    name: 'Porbandar & Kirti Mandir',
    gujarati: 'પોરબંદર અને કીર્તિ મંદિર',
    district: 'Porbandar',
    tagline: 'Birthplace of Mahatma Gandhi & coastal seafaring maritime heritage',
    topPercent: 59.5,
    leftPercent: 28.5,
    icon: '⛵',
    accent: '#38BDF8',
    coords: [21.6417, 69.6083]
  },
  {
    id: 'gir-national-park',
    name: 'Gir Forest & Asiatic Lion Sanctuary',
    gujarati: 'ગીર અને એશિયાટીક સિંહ (જૂનાગઢ)',
    district: 'Junagadh',
    tagline: 'The only sanctuary of wild Asiatic Lions on Earth, dry deciduous terrain',
    topPercent: 71.2,
    leftPercent: 41.5,
    icon: '🦁',
    accent: '#10B981',
    coords: [21.1243, 70.8242]
  },
  {
    id: 'somnath-temple',
    name: 'Somnath Jyotirlinga',
    gujarati: 'સોમનાથ જ્યોતિર્લિંગ (ગીર સોમનાથ)',
    district: 'Gir Somnath',
    tagline: 'First of the 12 sacred Jyotirlingas, ancient coastal shoreline temple',
    topPercent: 76.5,
    leftPercent: 43.5,
    icon: '🔱',
    accent: '#FF9418',
    coords: [20.8880, 70.4013]
  },
  {
    id: 'bhavnagar-alang',
    name: 'Bhavnagar & Alang Maritime Port',
    gujarati: 'ભાવનગર અને અલંગ શિપયાર્ડ',
    district: 'Bhavnagar',
    tagline: "Takhteshwar Temple & world's largest ship-recycling maritime coast",
    topPercent: 61.5,
    leftPercent: 60.5,
    icon: '⚓',
    accent: '#00F0FF',
    coords: [21.7645, 72.1519]
  },
  {
    id: 'laxmi-vilas-palace',
    name: 'Laxmi Vilas Palace',
    gujarati: 'લક્ષ્મી વિલાસ પેલેસ (વડોદરા)',
    district: 'Vadodara',
    tagline: 'Majestic Gaekwad royal palace with Indo-Saracenic stained glass & armory',
    topPercent: 52.0,
    leftPercent: 77.0,
    icon: '👑',
    accent: '#9D233B',
    coords: [22.2936, 73.1917]
  },
  {
    id: 'statue-of-unity',
    name: 'Statue of Unity & Sardar Sarovar',
    gujarati: 'સ્ટેચ્યુ ઓફ યુનિટી (નર્મદા)',
    district: 'Narmada',
    tagline: "World's tallest monument (182m) honoring Sardar Vallabhbhai Patel",
    topPercent: 55.5,
    leftPercent: 84.5,
    icon: '🗿',
    accent: '#FF9418',
    coords: [21.8380, 73.7191]
  },
  {
    id: 'surat-diamond-bourse',
    name: 'Surat Diamond Bourse & Port',
    gujarati: 'સૂરત ડાયમંડ બોર્સ અને તાપી',
    district: 'Surat',
    tagline: "World's largest interconnected office complex & global diamond cutting capital",
    topPercent: 71.0,
    leftPercent: 76.0,
    icon: '💎',
    accent: '#00F0FF',
    coords: [21.1126, 72.8258]
  },
  {
    id: 'valsad-daman-coast',
    name: 'Valsad & Daman Coastal Belt',
    gujarati: 'વલસાડ અને દમણ દરિયાકિનારો',
    district: 'Valsad',
    tagline: 'Black sand Tithal beach, Alphonso orchards, and Portuguese fortresses',
    topPercent: 84.5,
    leftPercent: 75.0,
    icon: '🌴',
    accent: '#10B981',
    coords: [20.5992, 72.9342]
  }
];

interface CulturalParallaxMapProps {
  onSwitchToLeafletGis?: (coords?: [number, number]) => void;
}

export const CulturalParallaxMap: React.FC<CulturalParallaxMapProps> = ({
  onSwitchToLeafletGis
}) => {
  const { theme, setActiveDossierAsset, setSelectedDistrict } = useAtlasStore();
  const containerRef = useRef<HTMLDivElement>(null);

  // Zoom & Pan state
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeHotspot, setActiveHotspot] = useState<AtlasHotspot | null>(null);
  const [is3DActive, setIs3DActive] = useState(true);

  // Mouse tilt motion values for 3D Parallax effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring physics for buttery smooth tilt
  const springX = useSpring(mouseX, { stiffness: 90, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 90, damping: 20 });

  // Transform angles: tilt up to 6.5 degrees
  const rotateX = useTransform(springY, [-0.5, 0.5], [6.5, -6.5]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-7.5, 7.5]);

  // Handle Mouse movement relative to container
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !is3DActive) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Open rich dossier modal for a hotspot
  const handleOpenDossier = (hotspot: AtlasHotspot) => {
    setSelectedDistrict(hotspot.district.toLowerCase());
    const matchedDest = VERIFIED_TOURIST_DESTINATIONS.find(d => 
      d.id === hotspot.id || 
      d.name.toLowerCase().includes(hotspot.name.toLowerCase().split(' ')[0])
    );

    if (matchedDest) {
      setActiveDossierAsset({ ...matchedDest, type: 'destination' });
    } else {
      setActiveDossierAsset({
        id: hotspot.id,
        name: hotspot.name,
        gujaratiTitle: hotspot.gujarati,
        district: hotspot.district,
        summary: hotspot.tagline,
        coordinates: hotspot.coords,
        type: 'destination'
      });
    }
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-[calc(100vh-64px)] min-h-[580px] overflow-hidden bg-[#0F172A] select-none flex items-center justify-center"
      style={{ perspective: 1200 }}
    >
      {/* 1. Ornate Gujarati Toran Borders along Viewport Edges */}
      <div className="absolute top-0 inset-x-0 h-3 z-30 opacity-90 pointer-events-none">
        <ToranOrnamentalBorder className="w-full h-3" />
      </div>
      <div className="absolute bottom-0 inset-x-0 h-3 z-30 opacity-90 pointer-events-none rotate-180">
        <ToranOrnamentalBorder className="w-full h-3" />
      </div>

      {/* 2. Top Controls HUD: Zoom, 3D Toggle, Mode Switcher */}
      <div className="absolute top-5 inset-x-4 sm:inset-x-8 z-40 flex items-center justify-between pointer-events-none">
        {/* Left: Branding Badge */}
        <div className="pointer-events-auto flex items-center gap-2 p-1.5 sm:p-2 rounded-2xl border-2 border-[#25324A] bg-[#151F30]/95 backdrop-blur-xl shadow-[3px_3px_0px_#101827]">
          <span className="text-sm sm:text-base font-black font-['Noto_Sans_Gujarati'] text-[#FF9418] px-2 py-0.5 rounded bg-black/40">
            ગુજરાત
          </span>
          <span className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-white pr-2">
            ROYAL 3D ATLAS • સચિત્ર હેરિટેજ નકશો
          </span>
        </div>

        {/* Right: Quick Zoom, 3D Tilt & GIS Switcher */}
        <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2">
          {/* 3D Tilt Toggle */}
          <button
            onClick={() => {
              setIs3DActive(!is3DActive);
              if (is3DActive) { mouseX.set(0); mouseY.set(0); }
            }}
            className={`px-2.5 py-1.5 rounded-xl border-2 text-xs font-bold transition-all shadow-[2px_2px_0px_#101827] flex items-center gap-1 ${
              is3DActive
                ? 'bg-[#00F0FF] text-[#101827] border-[#101827]'
                : 'bg-[#151F30] text-[#8F9CAE] border-[#25324A]'
            }`}
            title="Toggle 3D Gyro/Mouse Parallax Depth"
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{is3DActive ? '3D Tilt ON' : '3D Tilt OFF'}</span>
          </button>

          {/* Zoom Buttons */}
          <div className="flex items-center rounded-xl border-2 border-[#25324A] bg-[#151F30]/95 shadow-[2px_2px_0px_#101827] overflow-hidden">
            <button
              onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2.0))}
              className="p-1.5 sm:p-2 hover:bg-[#FF9418] hover:text-[#101827] text-white transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 text-[10px] font-mono font-bold text-[#FF9418]">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 1.0))}
              className="p-1.5 sm:p-2 hover:bg-[#FF9418] hover:text-[#101827] text-white transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            {zoomLevel > 1 && (
              <button
                onClick={() => setZoomLevel(1)}
                className="p-1.5 text-[#8F9CAE] hover:text-white border-l border-[#25324A]"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Switch to Precision Leaflet GIS */}
          {onSwitchToLeafletGis && (
            <button
              onClick={() => onSwitchToLeafletGis()}
              className="px-3 py-1.5 rounded-xl border-2 border-[#101827] bg-[#FF9418] hover:bg-[#e07f10] text-[#101827] font-black text-xs shadow-[2px_2px_0px_#101827] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5"
              title="Switch to Precision Leaflet GIS GPS Coordinates"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Precision GIS Map</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. The 3D Parallax Multi-Plane Canvas Stage */}
      <motion.div
        style={{
          rotateX: is3DActive ? rotateX : 0,
          rotateY: is3DActive ? rotateY : 0,
          scale: zoomLevel,
          transformStyle: 'preserve-3d'
        }}
        className="relative max-w-5xl w-[92vw] aspect-[1024/682] max-h-[82vh] rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] border-4 border-[#25324A] overflow-hidden"
      >
        {/* Layer 0: The Full Illustrated Cultural Atlas Map Artwork */}
        <img
          src="/images/atlas/gujarat-cultural-atlas-full.jpg"
          alt="Gujarat Royal Cultural Atlas Illustrated Map"
          className="w-full h-full object-cover object-center pointer-events-none filter brightness-105 contrast-[1.03]"
        />

        {/* Ambient Animated Sea Shimmer Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-cyan-500/[0.03] to-transparent pointer-events-none animate-pulse" />

        {/* Layer 1: Ambient Animated Arabian Sea Dhow Boats (વહાણ) */}
        <motion.div
          animate={{ y: [0, -4, 0], rotate: [0, 1.5, 0] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ top: '56%', left: '17.5%', transform: 'translateZ(18px)' }}
          className="absolute pointer-events-none hidden sm:block"
        >
          <div className="text-xl filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">⛵</div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 3, 0], rotate: [0, -1.5, 0] }}
          transition={{ duration: 5.1, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          style={{ top: '84%', left: '62.5%', transform: 'translateZ(18px)' }}
          className="absolute pointer-events-none hidden sm:block"
        >
          <div className="text-lg filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">⛵</div>
        </motion.div>

        {/* Layer 2: Interactive 3D Landmark Beacons Floating Above Map Surface */}
        {ATLAS_HOTSPOTS.map((hotspot) => {
          const isSelected = activeHotspot?.id === hotspot.id;
          return (
            <motion.div
              key={hotspot.id}
              style={{
                top: `${hotspot.topPercent}%`,
                left: `${hotspot.leftPercent}%`,
                transform: 'translate(-50%, -50%) translateZ(40px)'
              }}
              className="absolute z-20 cursor-pointer group"
              onClick={() => setActiveHotspot(hotspot)}
              whileHover={{ scale: 1.25 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Outer Pulsing Beacon Ring */}
              <div 
                style={{ borderColor: hotspot.accent }}
                className="relative w-8 h-8 rounded-full border-2 bg-[#151F30]/90 backdrop-blur-md flex items-center justify-center shadow-[0_0_15px_currentColor] transition-all group-hover:border-white"
              >
                <span className="text-sm filter drop-shadow">{hotspot.icon}</span>
                {/* Glowing Radar Ping */}
                <span 
                  style={{ backgroundColor: hotspot.accent }}
                  className="absolute inset-0 rounded-full animate-ping opacity-40 pointer-events-none" 
                />
              </div>

              {/* Landmark Tooltip Pill on Hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center pointer-events-none z-30">
                <div className="px-2.5 py-1 rounded-lg bg-[#101827]/95 border border-[#FF9418] text-white text-[10px] font-bold shadow-xl whitespace-nowrap flex items-center gap-1.5">
                  <span className="text-[#FF9418]">{hotspot.name}</span>
                  <span className="font-['Noto_Sans_Gujarati'] text-[9px] text-slate-300">({hotspot.gujarati})</span>
                </div>
                <div className="w-2 h-1 bg-[#FF9418] clip-triangle" />
              </div>
            </motion.div>
          );
        })}

        {/* Layer 3: Dynamic Floating 3D Detail Popover (When a Landmark is Clicked) */}
        <AnimatePresence>
          {activeHotspot && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              style={{
                top: activeHotspot.topPercent > 55 ? `${activeHotspot.topPercent - 28}%` : `${activeHotspot.topPercent + 6}%`,
                left: activeHotspot.leftPercent > 70 ? `${activeHotspot.leftPercent - 28}%` : `${Math.max(activeHotspot.leftPercent - 10, 8)}%`,
                transform: 'translateZ(65px)'
              }}
              className="absolute z-50 w-72 sm:w-80 p-4 rounded-2xl border-2 border-[#FF9418] bg-[#151F30]/98 backdrop-blur-2xl shadow-[0_20px_40px_rgba(0,0,0,0.85)] text-[#F1E8D7]"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2 border-b border-[#25324A] pb-2 mb-2.5">
                <div>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#FF9418] uppercase">
                    <span>{activeHotspot.icon}</span>
                    <span>{activeHotspot.district} DISTRICT</span>
                  </div>
                  <h3 className="text-base font-black text-white font-editorial tracking-tight leading-snug">
                    {activeHotspot.name}
                  </h3>
                  <p className="text-xs font-['Noto_Sans_Gujarati'] font-bold text-[#FF9418]">
                    {activeHotspot.gujarati}
                  </p>
                </div>
                <button
                  onClick={() => setActiveHotspot(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Tagline / Summary */}
              <p className="text-xs text-slate-300 leading-relaxed font-sans mb-3">
                {activeHotspot.tagline}
              </p>

              {/* Coordinates Pill */}
              <div className="flex items-center justify-between text-[10px] font-mono text-[#8F9CAE] bg-black/40 p-2 rounded-lg border border-white/5 mb-3">
                <span>📍 GPS COORDS</span>
                <span className="font-bold text-white">{activeHotspot.coords[0].toFixed(4)}°N, {activeHotspot.coords[1].toFixed(4)}°E</span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleOpenDossier(activeHotspot)}
                  className="w-full py-2 px-2.5 rounded-xl bg-[#FF9418] hover:bg-[#e07f10] text-[#101827] font-black text-xs shadow-[2px_2px_0px_#101827] transition-all flex items-center justify-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Full Dossier</span>
                </button>

                {onSwitchToLeafletGis && (
                  <button
                    onClick={() => onSwitchToLeafletGis(activeHotspot.coords)}
                    className="w-full py-2 px-2.5 rounded-xl bg-[#101827] hover:bg-black text-white border border-[#25324A] font-bold text-xs shadow-[2px_2px_0px_#101827] transition-all flex items-center justify-center gap-1.5"
                  >
                    <Navigation className="w-3.5 h-3.5 text-[#00F0FF]" />
                    <span>Fly in GIS</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* 4. Bottom Quick Heritage Hotspot Reel */}
      <div className="absolute bottom-5 inset-x-4 sm:inset-x-8 z-40 flex items-center justify-center pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-1.5 p-1.5 sm:p-2 rounded-2xl border-2 border-[#25324A] bg-[#151F30]/95 backdrop-blur-xl shadow-[4px_4px_0px_#101827] max-w-full overflow-x-auto scrollbar-none">
          <span className="px-2 text-[10px] font-mono font-bold text-[#FF9418] whitespace-nowrap hidden sm:inline">
            ✨ CULTURAL HOTSPOTS:
          </span>
          {ATLAS_HOTSPOTS.map((h) => (
            <button
              key={h.id}
              onClick={() => setActiveHotspot(h)}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 border ${
                activeHotspot?.id === h.id
                  ? 'bg-[#FF9418] text-[#101827] border-[#101827] shadow-[1px_1px_0px_#101827]'
                  : 'bg-black/30 text-slate-300 border-white/5 hover:border-[#FF9418] hover:text-white'
              }`}
            >
              <span>{h.icon}</span>
              <span className="text-[11px] font-editorial">{h.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
