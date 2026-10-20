import React, { useState } from 'react';
import { useAtlasStore } from '../../stores/useAtlasStore';
import { GUJARAT_34_DISTRICTS } from '../../data/passport-districts';

interface IndiaKeyPlanProps {
  className?: string;
  variant?: 'floating' | 'embedded';
  onDistrictSelect?: (districtName: string) => void;
}

export const IndiaKeyPlan: React.FC<IndiaKeyPlanProps> = ({ 
  className = '', 
  variant = 'floating',
  onDistrictSelect 
}) => {
  const { theme, selectedDistrict, setSelectedDistrict } = useAtlasStore();
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'india' | 'gujarat'>('india');

  const currentDist = hoveredDistrict || selectedDistrict;
  const distInfo = currentDist 
    ? GUJARAT_34_DISTRICTS.find(d => d.id === currentDist || d.name.toLowerCase() === currentDist.toLowerCase())
    : null;

  return (
    <div 
      className={`rounded-2xl border-2 backdrop-blur-xl shadow-[4px_4px_0px_#101827] overflow-hidden select-none transition-all ${
        theme === 'dark' 
          ? 'bg-[#151F30]/95 border-[#25324A] text-[#F1E8D7]' 
          : 'bg-[#FAF6ED]/95 border-[#25324A] text-[#101827]'
      } ${className}`}
    >
      {/* Header Bar */}
      <div className="px-3 py-2 border-b-2 border-[#25324A] flex items-center justify-between bg-black/10">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#FF9418] animate-pulse" />
          <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-[#FF9418]">
            KEY PLAN // કી પ્લાન
          </span>
        </div>
        <div className="flex items-center gap-1 text-[9px] font-mono">
          <button
            onClick={() => setActiveTab('india')}
            className={`px-1.5 py-0.5 rounded transition-all ${
              activeTab === 'india' 
                ? 'bg-[#FF9418] text-[#101827] font-bold' 
                : 'text-[#8F9CAE] hover:text-white'
            }`}
          >
            India • ભારત
          </button>
          <button
            onClick={() => setActiveTab('gujarat')}
            className={`px-1.5 py-0.5 rounded transition-all ${
              activeTab === 'gujarat' 
                ? 'bg-[#FF9418] text-[#101827] font-bold' 
                : 'text-[#8F9CAE] hover:text-white'
            }`}
          >
            34 Districts
          </button>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="p-3 flex flex-col items-center justify-center relative">
        {activeTab === 'india' ? (
          /* Simplified High-Precision India Map Outline with Gujarat Highlighted */
          <div className="relative w-36 h-40 sm:w-44 sm:h-48 flex items-center justify-center">
            <svg 
              viewBox="0 0 200 220" 
              className="w-full h-full filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
            >
              {/* Ocean contour ripples */}
              <path
                d="M 10 130 Q 30 150 10 170 M 20 120 Q 40 140 20 160"
                fill="none"
                stroke={theme === 'dark' ? '#00F0FF' : '#1C6555'}
                strokeWidth="0.75"
                strokeOpacity="0.25"
                strokeDasharray="2 3"
              />

              {/* India National Boundary (Simplified Cartographic Path) */}
              <path
                d="
                  M 75 18 
                  C 85 8, 95 10, 105 18
                  C 115 25, 120 35, 115 45
                  C 130 50, 150 50, 165 65
                  C 180 75, 185 85, 175 95
                  C 165 105, 155 100, 145 105
                  C 140 115, 145 125, 140 135
                  C 130 150, 120 165, 110 185
                  C 100 200, 95 210, 90 215
                  C 85 210, 80 195, 75 180
                  C 70 160, 65 150, 60 140
                  C 55 130, 40 125, 35 115
                  C 30 105, 35 95, 45 90
                  C 50 80, 55 60, 65 50
                  C 68 35, 70 25, 75 18
                  Z
                "
                fill={theme === 'dark' ? '#1E293B' : '#E2E8F0'}
                stroke={theme === 'dark' ? '#334155' : '#94A3B8'}
                strokeWidth="1.5"
                strokeLinejoin="round"
              />

              {/* Gujarat State Inset Highlight (Western Peninsular Horn & Saurashtra) */}
              <g 
                className="cursor-pointer group"
                onClick={() => setActiveTab('gujarat')}
              >
                {/* Glowing halo */}
                <path
                  d="
                    M 35 110 
                    C 20 105, 15 115, 25 125
                    C 30 130, 45 135, 52 130
                    C 58 125, 55 115, 48 112
                    C 42 108, 38 108, 35 110
                    Z
                  "
                  fill="#FF9418"
                  fillOpacity="0.4"
                  className="animate-pulse"
                />
                {/* Sharp Gujarat Boundary */}
                <path
                  d="
                    M 35 110 
                    C 20 105, 15 115, 25 125
                    C 30 130, 45 135, 52 130
                    C 58 125, 55 115, 48 112
                    C 42 108, 38 108, 35 110
                    Z
                  "
                  fill="#FF9418"
                  stroke="#101827"
                  strokeWidth="1.5"
                />
                {/* Pointer blip */}
                <circle cx="36" cy="118" r="3" fill="#FFFFFF" stroke="#FF9418" strokeWidth="1.5" />
              </g>

              {/* Geographic Labels */}
              <text x="36" y="142" fontSize="9" fontWeight="800" fill="#FF9418" textAnchor="middle" fontFamily="monospace">
                GUJARAT • ગુજરાત
              </text>
              <text x="110" y="115" fontSize="8" fontWeight="700" fill={theme === 'dark' ? '#64748B' : '#94A3B8'} textAnchor="middle" fontFamily="sans-serif">
                INDIA • ભારત
              </text>
              <text x="25" y="165" fontSize="7" fontWeight="600" fill={theme === 'dark' ? '#38BDF8' : '#0284C7'} fontStyle="italic">
                Arabian Sea
              </text>

              {/* Compass Rose Mini Inset */}
              <g transform="translate(165, 25)">
                <circle cx="0" cy="0" r="14" fill="none" stroke={theme === 'dark' ? '#475569' : '#CBD5E1'} strokeWidth="1" strokeDasharray="2 2" />
                <path d="M 0 -12 L 3 -3 L 12 0 L 3 3 L 0 12 L -3 3 L -12 0 L -3 -3 Z" fill={theme === 'dark' ? '#334155' : '#CBD5E1'} />
                <path d="M 0 -12 L 3 -3 L 0 0 L -3 -3 Z" fill="#FF9418" />
                <text x="0" y="-14" fontSize="6" fontWeight="bold" fill="#FF9418" textAnchor="middle">N</text>
              </g>
            </svg>

            {/* Tap Hint */}
            <div className="absolute bottom-0 inset-x-0 text-center">
              <span className="text-[9px] font-mono text-[#8F9CAE] bg-black/40 px-2 py-0.5 rounded border border-white/10">
                20°01'N - 24°07'N • 68°04'E - 74°28'E
              </span>
            </div>
          </div>
        ) : (
          /* Gujarat 34 Districts Regional Schematic Map */
          <div className="w-full">
            <div className="text-[10px] font-mono text-[#8F9CAE] text-center mb-1">
              Select or hover a district to locate:
            </div>
            <div className="grid grid-cols-3 gap-1 max-h-40 overflow-y-auto p-1 rounded-lg bg-black/20 border border-[#25324A]">
              {GUJARAT_34_DISTRICTS.map((d) => {
                const isSelected = selectedDistrict === d.id || selectedDistrict === d.name;
                return (
                  <button
                    key={d.id}
                    onMouseEnter={() => setHoveredDistrict(d.id)}
                    onMouseLeave={() => setHoveredDistrict(null)}
                    onClick={() => {
                      setSelectedDistrict(d.id);
                      if (onDistrictSelect) onDistrictSelect(d.name);
                    }}
                    className={`px-1.5 py-1 rounded text-left text-[10px] font-bold transition-all truncate border ${
                      isSelected
                        ? 'bg-[#FF9418] text-[#101827] border-[#101827] shadow-[1px_1px_0px_#101827]'
                        : 'bg-black/30 text-slate-300 border-white/5 hover:border-[#FF9418] hover:text-[#FF9418]'
                    }`}
                  >
                    <span className="truncate block">{d.name}</span>
                    <span className="text-[8px] font-['Noto_Sans_Gujarati'] opacity-75 truncate block">
                      {d.gujaratiName || d.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Cartographic Scale Bar (Matching Image 3 Inset) */}
      <div className="px-3 py-2 border-t-2 border-[#25324A] bg-black/20 flex items-center justify-between text-[9px] font-mono">
        <div className="flex items-center gap-1.5">
          <div className="flex items-center">
            <span className="w-4 h-1.5 bg-[#FF9418] border border-[#101827]" />
            <span className="w-4 h-1.5 bg-[#101827] border border-[#25324A]" />
            <span className="w-8 h-1.5 bg-[#FF9418] border border-[#101827]" />
          </div>
          <span className="text-[#8F9CAE]">0 - 100 - 200 km</span>
        </div>
        <span className="text-[#FF9418] font-bold">1:2,500,000</span>
      </div>

      {/* Active District Info Bar (If Selected) */}
      {distInfo && (
        <div className="px-3 py-1.5 bg-[#FF9418]/15 border-t border-[#FF9418]/30 flex items-center justify-between text-[10px]">
          <span className="font-bold text-[#FF9418] truncate">
            📍 {distInfo.name} ({distInfo.gujaratiName || distInfo.name})
          </span>
          <span className="font-mono text-[#8F9CAE] text-[9px]">
            HQ: {distInfo.hq}
          </span>
        </div>
      )}
    </div>
  );
};
