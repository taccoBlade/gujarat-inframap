import React from 'react';
import { useAtlasStore } from '../../stores/useAtlasStore';
import { 
  PatolaIkatPattern, 
  AjrakhStarPattern, 
  BandhaniDotsPattern, 
  StepwellGeometryPattern,
  ToranOrnamentalBorder 
} from '../cultural/GujaratiPatterns';
import { Compass, Map, Award, Sparkles, Zap, Heart, ShieldCheck } from 'lucide-react';

export const CulturalFooter: React.FC = () => {
  const { theme, setMode, currentMode, userProfile } = useAtlasStore();

  // Don't render full footer on full-bleed interactive map mode
  if (currentMode === 'explore' || currentMode === 'ev') {
    return null;
  }

  return (
    <footer className={`mt-16 border-t-2 transition-colors select-none ${
      theme === 'dark' 
        ? 'bg-[#090e1a] border-amber-500/20 text-slate-300' 
        : 'bg-[#F4ECE1] border-[#D8C3A5] text-[#282823]'
    }`}>
      {/* Auspicious Toran Border Trim */}
      <ToranOrnamentalBorder height={12} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand & Regional Roots */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 border border-amber-400/50 flex items-center justify-center font-bold text-amber-100 text-lg shadow-sm">
                <span className="font-['Noto_Sans_Gujarati']">ગૂ</span>
              </div>
              <div>
                <span className={`font-bold font-serif text-lg tracking-tight block leading-none ${theme === 'dark' ? 'text-white' : 'text-[#1c1917]'}`}>
                  Gujarat Pravas
                </span>
                <span className="text-[11px] font-['Noto_Sans_Gujarati'] text-amber-600 dark:text-amber-400">
                  ગુજરાત ડિજિટલ સાંસ્કૃતિક એટલાસ
                </span>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-stone-600 dark:text-slate-400">
              A contemporary digital twin honoring 5,000 years of Gujarati civilization — from Harappan Dholavira and Solanki stepwells to 30 GW clean energy mega-grids.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <PatolaIkatPattern size={24} />
              <AjrakhStarPattern size={24} />
              <BandhaniDotsPattern size={24} />
              <StepwellGeometryPattern size={24} />
            </div>
          </div>

          {/* Core Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-amber-600 dark:text-amber-400">
              Cultural Portals
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => { setMode('explore'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-amber-500 transition-colors flex items-center gap-1.5"
                >
                  <Map className="w-3.5 h-3.5 text-amber-500" />
                  <span>Interactive Atlas Map</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setMode('places'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-amber-500 transition-colors flex items-center gap-1.5"
                >
                  <Compass className="w-3.5 h-3.5 text-amber-500" />
                  <span>37 Verified Destinations</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setMode('passport'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-amber-500 transition-colors flex items-center gap-1.5"
                >
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  <span>34 Districts Travel Passport</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setMode('unfiltered'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-amber-500 transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                  <span>45 Unfiltered Folklore Dossiers</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setMode('infrastructure'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-amber-500 transition-colors flex items-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>3,337 Public Infrastructure Assets</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Regional Heritage Lineage */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-amber-600 dark:text-amber-400">
              Living Craft Heritage
            </h4>
            <div className="space-y-1.5 text-xs text-stone-600 dark:text-slate-400">
              <p>• <strong>Patan</strong>: Double-Ikat Silk Patola</p>
              <p>• <strong>Kachchh</strong>: Ajrakh Block-Print &amp; Lippan Mud-Art</p>
              <p>• <strong>Jamnagar</strong>: Fine Knotted Bandhej Dyeing</p>
              <p>• <strong>Ahmedabad</strong>: Carved Teakwood Pol Architecture</p>
              <p>• <strong>Chhota Udepur</strong>: Indigenous Pithora Mural Painting</p>
            </div>
          </div>

          {/* Statutary Standards & Cartography */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-amber-600 dark:text-amber-400">
              Cartographic Alignment
            </h4>
            <div className="p-3 rounded-xl border text-[11px] leading-relaxed space-y-1.5 bg-white/50 dark:bg-slate-900/50 border-stone-200 dark:border-slate-800">
              <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Survey of India Aligned</span>
              </div>
              <p className="text-stone-500 dark:text-slate-400">
                Administrative boundaries match official Government of Gujarat Survey of India demarcations across all 34 districts.
              </p>
              <p className="text-[10px] font-mono text-stone-400 dark:text-slate-500">
                Coordinates: WGS84 EPSG:4326 • 100% Statutorily Verified
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Baseline Bar */}
        <div className="pt-6 border-t border-stone-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500 dark:text-slate-400">
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
            <span>for Gujarat • ગુજરાત ડિજિટલ ટ્વિન</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>34 Districts</span>
            <span>•</span>
            <span>37 Destinations</span>
            <span>•</span>
            <span>45 Dossiers</span>
            <span>•</span>
            <span>3,337 Infra Works</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
