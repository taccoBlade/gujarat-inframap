import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAtlasStore } from '../../stores/useAtlasStore';
import { GUJARAT_34_DISTRICTS } from '../../data/passport-districts';
import { DistrictRegion } from '../../types/atlas';
import { X, MapPin, Check, Sparkles, Compass } from 'lucide-react';

const REGIONS: (DistrictRegion | 'All')[] = [
  'All',
  'Central Gujarat',
  'North Gujarat',
  'Saurashtra',
  'South Gujarat',
  'Kachchh'
];

export const OnboardingModal: React.FC = () => {
  const { isOnboardingOpen, setOnboardingOpen, userProfile, setHomeDistrict } = useAtlasStore();
  const [selectedRegion, setSelectedRegion] = useState<DistrictRegion | 'All'>('All');
  const [search, setSearch] = useState('');

  if (!isOnboardingOpen) return null;

  const filteredDistricts = GUJARAT_34_DISTRICTS.filter(d => {
    const matchesRegion = selectedRegion === 'All' || d.region === selectedRegion;
    const matchesSearch = !search || 
      d.name.toLowerCase().includes(search.toLowerCase()) || 
      d.gujaratiName.includes(search) || 
      d.landmark.toLowerCase().includes(search.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  const handleSelectDistrict = (districtId: string) => {
    setHomeDistrict(districtId);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-[#151F30] border-2 border-[#25324A] rounded-2xl shadow-[6px_6px_0px_#101827] overflow-hidden text-[#F1E8D7]"
        >
          {/* Folk pattern ribbon header */}
          <div className="h-2 bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500 flex-shrink-0" />

          {/* Close Button */}
          <button
            onClick={() => setOnboardingOpen(false)}
            className="absolute top-4 right-4 z-10 p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="p-5 sm:p-6 pb-3 flex-shrink-0 border-b border-slate-800">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 text-xs font-bold">
                📍
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 font-mono">
                Step 1: Identity &amp; Roots • તમારું વતન
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-['Outfit'] mb-1">
              Pick Your Home District
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Select the district where your heart or family belongs. We'll automatically issue your{' '}
              <span className="text-amber-400 font-bold">First Golden Passport Stamp</span> and calibrate your regional explorer rank!
            </p>

            {/* Region Tabs & Search */}
            <div className="mt-4 flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
              <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {REGIONS.map((region) => (
                  <button
                    key={region}
                    onClick={() => setSelectedRegion(region)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${
                      selectedRegion === region
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-[2px_2px_0px_#000]'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    {region}
                  </button>
                ))}
              </div>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search district, landmark..."
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-400 font-mono"
              />
            </div>
          </div>

          {/* District Cards Grid (Scrollable) */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-grow grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {filteredDistricts.map((district) => {
              const isSelected = userProfile.homeDistrict === district.id;
              return (
                <div
                  key={district.id}
                  onClick={() => handleSelectDistrict(district.id)}
                  className={`group relative p-3.5 rounded-xl border-2 transition-all cursor-pointer select-none ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-400 shadow-[3px_3px_0px_#f59e0b]'
                      : 'bg-slate-900/90 border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-xl shadow-inner group-hover:scale-105 transition-transform">
                      {district.icon}
                    </div>
                    {isSelected ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-amber-500 text-slate-950 rounded-full font-mono">
                        <Check className="w-3 h-3" />
                        HOME
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-slate-500 border border-slate-800 px-1.5 py-0.5 rounded">
                        {district.region}
                      </span>
                    )}
                  </div>

                  <div className="mt-2.5">
                    <div className="flex items-baseline gap-1.5">
                      <h3 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
                        {district.name}
                      </h3>
                      <span className="text-xs text-amber-400/90 font-['Noto_Sans_Gujarati'] font-medium">
                        {district.gujaratiName}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {district.landmark}
                    </p>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-800/70 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>Rank: Top {100 - district.rarityPercentile}%</span>
                    <span className="text-amber-400/80 group-hover:underline">Select →</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer with summary */}
          <div className="p-4 bg-slate-900 border-t border-slate-800 flex-shrink-0 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>
                Current home: <strong className="text-white capitalize">{userProfile.homeDistrict}</strong> (1 Golden Stamp awarded)
              </span>
            </div>
            <button
              onClick={() => setOnboardingOpen(false)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg shadow-[2px_2px_0px_#000] text-xs transition-colors"
            >
              Done &amp; Explore
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
