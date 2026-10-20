import React, { useState } from 'react';
import { useAtlasStore } from '../../stores/useAtlasStore';
import { IndiaKeyPlan } from './IndiaKeyPlan';
import { ToranOrnamentalBorder, AjrakhStarPattern } from '../cultural/GujaratiPatterns';
import { VERIFIED_TOURIST_DESTINATIONS } from '../../data/tourist-destinations';
import { 
  Compass, 
  MapPin, 
  Sparkles, 
  ExternalLink, 
  X, 
  Eye, 
  EyeOff, 
  ChevronUp, 
  ChevronDown,
  Navigation
} from 'lucide-react';

interface LandmarkVignette {
  id: string;
  name: string;
  gujarati: string;
  district: string;
  icon: string;
  themeColor: string;
  coords: [number, number];
  tagline: string;
}

const HERITAGE_VIGNETTES: LandmarkVignette[] = [
  {
    id: 'modhera-sun-temple',
    name: 'Modhera Sun Temple',
    gujarati: 'મોઢેરા સૂર્ય મંદિર',
    district: 'Mehsana',
    icon: '☀️',
    themeColor: '#FF9418',
    coords: [23.5833, 72.1333],
    tagline: '1026 CE Solanki Sun Chariot & Surya Kund'
  },
  {
    id: 'rani-ki-vav',
    name: 'Rani ki Vav Stepwell',
    gujarati: 'રાણીની વાવ',
    district: 'Patan',
    icon: '🏛️',
    themeColor: '#FF9418',
    coords: [23.8589, 72.1017],
    tagline: 'UNESCO World Heritage Descending Subterranean Art'
  },
  {
    id: 'dholavira-harappan-city',
    name: 'Dholavira & Rann of Kutch',
    gujarati: 'ધોળાવીરા અને રણ કચ્છ',
    district: 'Kutch',
    icon: '🐪',
    themeColor: '#E2E8F0',
    coords: [23.8864, 70.2133],
    tagline: '5,000-Year Harappan Citadel & White Salt Desert'
  },
  {
    id: 'dwarkadhish-temple',
    name: 'Dwarkadhish Temple',
    gujarati: 'દ્વારકાધીશ મંદિર',
    district: 'Devbhoomi Dwarka',
    icon: '🕉️',
    themeColor: '#F59E0B',
    coords: [22.2376, 68.9678],
    tagline: 'Sacred Coastal Mokshapuri on Arabian Sea'
  },
  {
    id: 'gir-national-park',
    name: 'Gir Forest & Asiatic Lion',
    gujarati: 'ગીર અને એશિયાટીક સિંહ',
    district: 'Junagadh',
    icon: '🦁',
    themeColor: '#10B981',
    coords: [21.1243, 70.8242],
    tagline: 'Only Natural Sanctuary of Asiatic Lions Worldwide'
  },
  {
    id: 'statue-of-unity',
    name: 'Statue of Unity',
    gujarati: 'સ્ટેચ્યુ ઓફ યુનિટી',
    district: 'Narmada',
    icon: '🗿',
    themeColor: '#FF9418',
    coords: [21.838, 73.7191],
    tagline: "World's Tallest Monument (182m) on Narmada River"
  },
  {
    id: 'somnath-temple',
    name: 'Somnath Jyotirlinga',
    gujarati: 'સોમનાથ જ્યોતિર્લિંગ',
    district: 'Gir Somnath',
    icon: '🔱',
    themeColor: '#FF9418',
    coords: [20.888, 70.4013],
    tagline: 'First of the 12 Sacred Jyotirlinga Shrines'
  },
  {
    id: 'laxmi-vilas-palace',
    name: 'Laxmi Vilas Palace',
    gujarati: 'લક્ષ્મી વિલાસ પેલેસ',
    district: 'Vadodara',
    icon: '👑',
    themeColor: '#9D233B',
    coords: [22.2936, 73.1917],
    tagline: 'Gaekwad Royal Residence (4x Size of Buckingham Palace)'
  },
  {
    id: 'sabarmati-ashram',
    name: 'Sabarmati & Heritage Ahmedabad',
    gujarati: 'સાબરમતી આશ્રમ અને પોળ',
    district: 'Ahmedabad',
    icon: '🕊️',
    themeColor: '#1C6555',
    coords: [23.0605, 72.5802],
    tagline: 'Mahatma Gandhi Cradle of Non-Violence & UNESCO City'
  },
  {
    id: 'surat-diamond-bourse',
    name: 'Surat Maritime & Diamond Hub',
    gujarati: 'સૂરત ડાયમંડ બોર્સ',
    district: 'Surat',
    icon: '💎',
    themeColor: '#00F0FF',
    coords: [21.1126, 72.8258],
    tagline: "World's Largest Office Complex & Tapi Riverfront"
  }
];

interface CulturalAtlasOverlayProps {
  isOpen: boolean;
  onToggle: () => void;
  onFlyToCoords: (coords: [number, number]) => void;
}

export const CulturalAtlasOverlay: React.FC<CulturalAtlasOverlayProps> = ({
  isOpen,
  onToggle,
  onFlyToCoords
}) => {
  const { theme, setActiveDossierAsset, setSelectedDistrict } = useAtlasStore();
  const [isMinimized, setIsMinimized] = useState(false);
  const [selectedVignette, setSelectedVignette] = useState<LandmarkVignette | null>(null);

  const handleVignetteClick = (vignette: LandmarkVignette) => {
    onFlyToCoords(vignette.coords);
    setSelectedDistrict(vignette.district.toLowerCase());

    // Find destination match
    const matchedDest = VERIFIED_TOURIST_DESTINATIONS.find(d => 
      d.id === vignette.id || 
      d.name.toLowerCase().includes(vignette.name.toLowerCase().split(' ')[0])
    );

    if (matchedDest) {
      setActiveDossierAsset({ ...matchedDest, type: 'destination' });
    } else {
      setActiveDossierAsset({
        id: vignette.id,
        name: vignette.name,
        gujaratiTitle: vignette.gujarati,
        district: vignette.district,
        summary: vignette.tagline,
        coordinates: vignette.coords,
        type: 'destination'
      });
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-20 left-4 z-[990] flex items-center gap-2 px-3 py-2 rounded-xl bg-[#151F30]/95 border-2 border-[#FF9418] text-[#FF9418] font-bold text-xs shadow-[3px_3px_0px_#101827] backdrop-blur-md hover:bg-[#FF9418] hover:text-[#101827] transition-all"
        title="Open Vintage Cultural Atlas Overlay (Illustrated Heritage Cartography)"
      >
        <span className="text-base">📜</span>
        <span className="hidden sm:inline">Royal Cultural Atlas • હેરિટેજ નકશો</span>
        <span className="sm:hidden">Vintage Map</span>
      </button>
    );
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-[980] overflow-hidden">
      {/* 1. Vintage Ornate Border Framing along Screen Edges (Toran & Patola Ikat) */}
      <div className="absolute top-0 inset-x-0 h-3 z-10 opacity-80 pointer-events-none">
        <ToranOrnamentalBorder className="w-full h-3" />
      </div>
      <div className="absolute bottom-0 inset-x-0 h-3 z-10 opacity-80 pointer-events-none rotate-180">
        <ToranOrnamentalBorder className="w-full h-3" />
      </div>

      {/* 2. Top-Left Royal Calligraphic Title Cartouche (Matching Image 3) */}
      <div className="pointer-events-auto absolute top-16 left-4 max-w-sm sm:max-w-md p-3.5 sm:p-4 rounded-2xl border-2 shadow-[4px_4px_0px_#101827] backdrop-blur-xl bg-[#151F30]/95 border-[#25324A] text-[#F1E8D7] select-none animate-in fade-in slide-in-from-top-4 duration-300">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-2">
              <h1 className="text-2xl sm:text-3xl font-black font-['Noto_Sans_Gujarati'] text-[#FF9418] tracking-tight leading-none drop-shadow">
                ગુજરાત
              </h1>
              <span className="text-xs sm:text-sm font-black font-editorial tracking-widest text-white uppercase">
                GUJARAT
              </span>
            </div>
            <p className="text-[9px] font-mono font-bold tracking-widest uppercase text-[#8F9CAE] mt-0.5">
              LAND OF LEGACY • PEOPLE OF PROGRESS • SPIRIT OF GUJARAT
            </p>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 rounded-lg text-[#8F9CAE] hover:text-white hover:bg-white/10"
              title={isMinimized ? 'Expand Cartouche' : 'Minimize Cartouche'}
            >
              {isMinimized ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
            <button
              onClick={onToggle}
              className="p-1 rounded-lg text-[#8F9CAE] hover:text-[#9D233B] hover:bg-white/10"
              title="Close Royal Cultural Overlay"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Poetic Couplet from Image 3 */}
        {!isMinimized && (
          <div className="mt-2.5 pt-2.5 border-t border-[#25324A] space-y-1">
            <p className="text-xs font-['Noto_Sans_Gujarati'] text-[#FAF6ED] leading-relaxed italic">
              "જ્યાં ધરતી ધીરજ રાખે, સમુદ્ર સાથે વાતો કરે, અને માણસ સપનાંને હકીકતમાં બણે."
            </p>
            <p className="text-[10px] text-[#8F9CAE] font-mono leading-relaxed">
              "WHERE THE LAND HOLDS PATIENCE, THE SEA WHISPERS STORIES, AND ITS PEOPLE TURN DREAMS INTO REALITY."
            </p>

            {/* Quick Vignette Filter Pills */}
            <div className="mt-3 pt-2 border-t border-[#25324A]/50 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-[9px] font-mono text-[#FF9418] uppercase font-bold flex-shrink-0">
                HERITAGE CRESTS:
              </span>
              {HERITAGE_VIGNETTES.slice(0, 5).map((v) => (
                <button
                  key={v.id}
                  onClick={() => handleVignetteClick(v)}
                  className="px-2 py-0.5 rounded-md bg-black/40 hover:bg-[#FF9418] hover:text-[#101827] text-[10px] font-bold border border-white/10 whitespace-nowrap transition-colors flex items-center gap-1"
                >
                  <span>{v.icon}</span>
                  <span>{v.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. Top-Right Antique Mariner Compass Rose (Matching Image 3) */}
      <div className="pointer-events-auto absolute top-16 right-4 hidden md:flex flex-col items-center p-3 rounded-2xl border-2 border-[#25324A] bg-[#151F30]/90 backdrop-blur-md shadow-[3px_3px_0px_#101827] select-none">
        <svg className="w-16 h-16" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill="none" stroke="#25324A" strokeWidth="1.5" strokeDasharray="3 3" />
          <circle cx="50" cy="50" r="35" fill="none" stroke="#FF9418" strokeWidth="0.8" strokeOpacity="0.5" />
          
          {/* North needle */}
          <polygon points="50,12 55,50 50,45" fill="#FF9418" />
          <polygon points="50,12 45,50 50,45" fill="#D97706" />
          
          {/* South needle */}
          <polygon points="50,88 55,50 50,55" fill="#64748B" />
          <polygon points="50,88 45,50 50,55" fill="#334155" />
          
          {/* East needle */}
          <polygon points="88,50 50,55 55,50" fill="#64748B" />
          <polygon points="88,50 50,45 55,50" fill="#334155" />
          
          {/* West needle */}
          <polygon points="12,50 50,55 45,50" fill="#64748B" />
          <polygon points="12,50 50,45 45,50" fill="#334155" />

          {/* Core pivot */}
          <circle cx="50" cy="50" r="4" fill="#FF9418" stroke="#101827" strokeWidth="1.5" />

          {/* Cardinal Directions */}
          <text x="50" y="8" fontSize="8" fontWeight="900" fill="#FF9418" textAnchor="middle" fontFamily="sans-serif">N</text>
          <text x="96" y="53" fontSize="8" fontWeight="800" fill="#8F9CAE" textAnchor="middle" fontFamily="sans-serif">E</text>
          <text x="50" y="98" fontSize="8" fontWeight="800" fill="#8F9CAE" textAnchor="middle" fontFamily="sans-serif">S</text>
          <text x="5" y="53" fontSize="8" fontWeight="800" fill="#8F9CAE" textAnchor="middle" fontFamily="sans-serif">W</text>
        </svg>
        <span className="text-[8px] font-['Noto_Sans_Gujarati'] font-bold text-[#FF9418] mt-1">
          દિશા સૂચક
        </span>
      </div>

      {/* 4. Bottom-Left India Key Plan & Regional Inset (Matching Image 3 Inset Location) */}
      <div className="pointer-events-auto absolute bottom-16 sm:bottom-6 left-4 z-20">
        <IndiaKeyPlan 
          variant="floating" 
          onDistrictSelect={(districtName) => {
            const matched = HERITAGE_VIGNETTES.find(v => v.district.toLowerCase() === districtName.toLowerCase());
            if (matched) {
              onFlyToCoords(matched.coords);
            }
          }}
        />
      </div>

      {/* 5. Floating Bottom Navigation Bar for Heritage Vignettes */}
      <div className="pointer-events-auto absolute bottom-4 inset-x-0 hidden lg:flex justify-center z-10 px-4">
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl border-2 border-[#25324A] bg-[#151F30]/95 backdrop-blur-xl shadow-[4px_4px_0px_#101827]">
          <span className="px-2 py-1 text-[10px] font-mono font-bold text-[#FF9418] uppercase">
            🏛️ 10 ROYAL EMBLEMS:
          </span>
          {HERITAGE_VIGNETTES.map((v) => (
            <button
              key={v.id}
              onClick={() => handleVignetteClick(v)}
              className="px-2.5 py-1.5 rounded-xl bg-black/30 hover:bg-[#FF9418] hover:text-[#101827] text-white text-xs font-bold border border-white/10 transition-all flex items-center gap-1.5 group"
              title={`${v.name} (${v.gujarati})`}
            >
              <span>{v.icon}</span>
              <span className="font-editorial text-[11px] group-hover:text-[#101827]">{v.name.split(' ')[0]}</span>
            </button>
          ))}
          <button
            onClick={onToggle}
            className="p-1.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-400 hover:bg-red-900/60 transition-colors"
            title="Exit Vintage Overlay"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
