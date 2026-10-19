import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAtlasStore } from '../../stores/useAtlasStore';
import { GUJARAT_34_DISTRICTS } from '../../data/passport-districts';
import { DistrictRegion } from '../../types/atlas';
import { getRegionalCulture } from '../../utils/cultural-regions';
import { Share2, CheckCircle2, MapPin, Sparkles, Trophy, Lock, Cloud, CloudOff, LogIn } from 'lucide-react';

export const GujaratPassport: React.FC = () => {
  const { 
    userProfile, 
    claimDistrictStamp, 
    setShareModalOpen, 
    setAuthModalOpen, 
    setOnboardingOpen,
    theme
  } = useAtlasStore();
  const [selectedRegion, setSelectedRegion] = useState<DistrictRegion | 'All'>('All');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const collectedCount = userProfile.collectedStampIds.length;
  const progressPercent = Math.round((collectedCount / 34) * 100);

  // Gujarati Numerals Formatter
  const toGujaratiDigits = (n: number) => {
    const digits = ['૦', '૧', '૨', '૩', '૪', '૫', '૬', '૭', '૮', '૯'];
    return String(n).split('').map(d => digits[parseInt(d, 10)] || d).join('');
  };

  const filteredDistricts = selectedRegion === 'All' 
    ? GUJARAT_34_DISTRICTS 
    : GUJARAT_34_DISTRICTS.filter(d => d.region === selectedRegion);

  const handleStampClick = (districtId: string) => {
    const res = claimDistrictStamp(districtId);
    setToastMessage(res.message);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const regions: (DistrictRegion | 'All')[] = [
    'All', 
    'Saurashtra', 
    'North Gujarat', 
    'Central Gujarat', 
    'South Gujarat', 
    'Kachchh'
  ];

  return (
    <div className={`max-w-6xl mx-auto px-4 py-8 relative transition-colors duration-200 ${theme === 'dark' ? 'text-slate-100' : 'text-[#282823]'}`}>
      
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-slate-950 font-bold px-6 py-3 rounded-xl shadow-[4px_4px_0px_#78350f] border-2 border-black flex items-center gap-2 text-sm"
          >
            <Sparkles className="w-5 h-5 text-slate-950" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cloud Sync & Auth Status Banner */}
      <div className="mb-4">
        {!userProfile.isLoggedIn ? (
          <div className="p-3 sm:p-4 rounded-xl bg-amber-500/10 border-2 border-amber-600/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <CloudOff className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-amber-300">
                  Guest Mode • Stamps saved locally on this browser
                </p>
                <p className="text-[11px] text-amber-200/70">
                  Sign in with Google or Phone to sync your Gujarat travel passport across devices and claim your explorer rank.
                </p>
              </div>
            </div>
            <button
              onClick={() => setAuthModalOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex-shrink-0"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Claim Cloud Passport</span>
            </button>
          </div>
        ) : (
          <div className="p-2.5 sm:p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-emerald-300">
              <Cloud className="w-4 h-4 text-emerald-400" />
              <span>
                Passport Synced: <strong className="text-white">{userProfile.name}</strong> ({userProfile.handle})
              </span>
              <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 rounded font-mono text-emerald-200">
                Cloud Active
              </span>
            </div>
            <button
              onClick={() => setOnboardingOpen(true)}
              className="text-[11px] text-amber-400 hover:text-amber-300 underline font-mono flex items-center gap-1"
            >
              <span>Change Home District ({userProfile.homeDistrict})</span>
            </button>
          </div>
        )}
      </div>

      {/* Hero Header: Royal Solanki Gujarat Cultural Passport */}
      <div className={`border-2 rounded-2xl p-6 sm:p-8 mb-8 shadow-xl relative overflow-hidden transition-colors ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-amber-950/70 via-[#121c2e] to-[#0c1524] border-amber-600/50'
          : 'bg-gradient-to-br from-[#FDFBF7] via-[#F7F2E8] to-[#EFE7D8] border-[#D8C3A5]'
      }`}>
        
        {/* Toran Border Trim on Top */}
        <div className="ethnic-toran-trim absolute top-0 left-0 right-0 w-full" />

        {/* Background decorative Solanki rosette watermark */}
        <div className="absolute -right-12 -bottom-12 w-72 h-72 rounded-full border-8 border-amber-500/10 pointer-events-none flex items-center justify-center">
          <div className="w-48 h-48 rounded-full border-4 border-dashed border-amber-500/10 animate-spin-slow"></div>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          <div className="space-y-2">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest font-mono border ${
              theme === 'dark'
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-amber-500/10 border-amber-600/30 text-[#9a3412]'
            }`}>
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>OFFICIAL CULTURAL PASSPORT • ગુજરાત પાસપોર્ટ</span>
            </div>
            
            <h1 className={`text-3xl sm:text-4xl font-extrabold font-['Lora',serif] tracking-tight ${
              theme === 'dark' ? 'text-white' : 'text-[#1c1917]'
            }`}>
              34 Districts <span className="text-amber-600">Explorer Challenge</span>
            </h1>

            <p className={`text-sm max-w-xl font-['Noto_Sans_Gujarati'] leading-relaxed ${
              theme === 'dark' ? 'text-amber-100/90' : 'text-[#57534e]'
            }`}>
              ગુજરાતના તમામ ૩૪ જિલ્લાઓની મુલાકાત લો, ડિજિટલ મોહર (Stamp) સંગ્રહિત કરો અને તમારો યાત્રા સ્કોર મિત્રો સાથે શેર કરો.
            </p>
          </div>

          {/* User Score & Share Button */}
          <div className={`flex flex-wrap items-center gap-4 border-2 p-4 rounded-xl shadow-lg ${
            theme === 'dark'
              ? 'bg-[#0c1524]/90 border-amber-600/40'
              : 'bg-[#FDFBF7] border-[#D8C3A5]'
          }`}>
            
            <div className="flex flex-col text-right">
              <span className={`text-xs uppercase font-mono tracking-wider ${theme === 'dark' ? 'text-amber-200/70' : 'text-[#78716c]'}`}>Collected</span>
              <div className="flex items-baseline gap-1">
                <span className={`text-3xl font-black font-['Outfit'] ${theme === 'dark' ? 'text-amber-400' : 'text-[#9a3412]'}`}>{collectedCount}</span>
                <span className={`font-bold ${theme === 'dark' ? 'text-amber-100/50' : 'text-[#78716c]'}`}>/ 34</span>
                <span className={`text-xs font-bold ml-1 font-['Noto_Sans_Gujarati'] ${theme === 'dark' ? 'text-amber-300' : 'text-amber-600'}`}>
                  ({toGujaratiDigits(collectedCount)}/૩૪)
                </span>
              </div>
            </div>

            <div className={`w-px h-10 hidden sm:block ${theme === 'dark' ? 'bg-amber-600/30' : 'bg-[#D8C3A5]'}`}></div>

            <button
              onClick={() => setShareModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs uppercase tracking-wider rounded-lg shadow-[3px_3px_0px_#78350f] active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Card</span>
            </button>
          </div>
        </div>

        {/* State Completion Progress Bar */}
        <div className="mt-6 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono font-bold">
            <span className={theme === 'dark' ? 'text-amber-100/70' : 'text-[#57534e]'}>State Completion Progress: {progressPercent}%</span>
            <span className="text-amber-600">
              {progressPercent === 100 
                ? '🏆 સંપૂર્ણ ગુજરાત અનલૉક!' 
                : `${34 - collectedCount} districts remaining to unlock Gold Badge`}
            </span>
          </div>
          <div className={`w-full h-3 rounded-full overflow-hidden border p-0.5 ${
            theme === 'dark' ? 'bg-[#0c1524] border-amber-600/40' : 'bg-[#EDE5D8] border-[#D8C3A5]'
          }`}>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-yellow-300 rounded-full shadow-[0_0_12px_rgba(251,191,36,0.5)]"
            />
          </div>
        </div>

      </div>

      {/* Region Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
        {regions.map((region) => {
          const isSelected = selectedRegion === region;
          return (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border-2 ${
                isSelected
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 border-black shadow-[3px_3px_0px_#78350f] translate-y-[-2px]'
                  : theme === 'dark'
                    ? 'bg-[#121c2e] text-amber-100/80 border-amber-600/30 hover:border-amber-500 hover:text-white'
                    : 'bg-[#EDE5D8] text-[#44403c] border-[#D8C3A5] hover:border-[#9a3412] hover:text-[#1c1917]'
              }`}
            >
              {region} {region === 'All' ? '(34)' : ''}
            </button>
          );
        })}
      </div>

      {/* The 34-District Stamp Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDistricts.map((district) => {
          const isCollected = userProfile.collectedStampIds.includes(district.id);
          const isHome = userProfile.homeDistrict === district.id;
          const culture = getRegionalCulture(district.region || district.name);

          return (
            <motion.div
              key={district.id}
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className={`relative rounded-xl border-2 p-5 transition-all flex flex-col justify-between overflow-hidden ${
                isCollected
                  ? theme === 'dark'
                    ? 'bg-gradient-to-b from-amber-950/40 to-[#121c2e] border-amber-500/80 shadow-[4px_4px_0px_rgba(217,119,6,0.3)]'
                    : 'bg-gradient-to-b from-amber-50 to-[#FDFBF7] border-amber-600/70 shadow-[4px_4px_0px_rgba(180,83,9,0.25)] text-[#282823]'
                  : theme === 'dark'
                    ? 'bg-[#0f1a2d]/80 border-amber-600/30 hover:border-amber-400/60 opacity-95'
                    : 'bg-[#FDFBF7] border-[#DFD3C3] hover:border-[#9a3412] text-[#282823]'
              }`}
            >
              {/* Toran top ribbon */}
              <div style={{ height: '3px', background: culture.borderTrimStyle }} className="w-full absolute top-0 left-0 right-0" />

              {/* Top Row: Regional Tag & Rarity */}
              <div className="flex items-center justify-between gap-2 mb-3 mt-1">
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                  theme === 'dark'
                    ? 'bg-[#0c1524] text-amber-200 border-amber-600/30'
                    : 'bg-[#EDE5D8] text-[#9a3412] border-[#D8C3A5]'
                }`}>
                  {culture.primaryIcon} {district.region}
                </span>

                {isHome && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 border border-emerald-500/40">
                    🏠 Home District
                  </span>
                )}

                <span className={`text-[10px] font-mono ${theme === 'dark' ? 'text-amber-100/60' : 'text-[#78716c]'}`}>
                  Top {100 - district.rarityPercentile}% rarity
                </span>
              </div>

              {/* District Identity & Stamp Seal */}
              <div className="flex items-start gap-4 mb-3">
                
                {/* Stamp Icon / Circular Seal */}
                <div className={`w-16 h-16 rounded-2xl flex-shrink-0 flex items-center justify-center text-3xl border-2 shadow-inner transition-transform ${
                  isCollected
                    ? 'bg-amber-500/15 border-amber-400 text-amber-500 shadow-[2px_2px_0px_#d97706] rotate-[-4deg]'
                    : theme === 'dark'
                      ? 'bg-[#0c1524]/60 border-dashed border-amber-600/30 text-amber-100/30'
                      : 'bg-[#EDE5D8]/60 border-dashed border-[#D8C3A5] text-[#78716c]'
                }`}>
                  {isCollected ? district.icon : <Lock className="w-6 h-6 text-amber-600/40" />}
                </div>

                {/* Name & Gujarati Script */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <h3 className={`font-extrabold text-base tracking-tight font-['Lora',serif] truncate ${
                      theme === 'dark' ? 'text-white' : 'text-[#1c1917]'
                    }`}>
                      {district.name}
                    </h3>
                    <span className="text-xs font-bold text-amber-600 font-['Noto_Sans_Gujarati']">
                      {district.gujaratiName}
                    </span>
                  </div>

                  <p className={`text-xs font-semibold line-clamp-1 mt-0.5 ${
                    theme === 'dark' ? 'text-amber-100/90' : 'text-[#44403c]'
                  }`}>
                    {district.landmark}
                  </p>
                  
                  <p className={`text-[11px] line-clamp-2 mt-1 leading-snug ${
                    theme === 'dark' ? 'text-amber-200/60' : 'text-[#78716c]'
                  }`}>
                    {district.culturalTitle}
                  </p>
                </div>
              </div>

              {/* Regional Cultural Craft Tag */}
              <div className={`text-[10px] font-mono px-2 py-0.5 rounded mb-3 w-fit ${culture.badgeBg} ${culture.textColor} border ${culture.badgeBorder}`}>
                <span>{culture.culturalTag}</span>
              </div>

              {/* Action Button: Check In / Stamped */}
              <div className={`pt-3 border-t flex items-center justify-between ${
                theme === 'dark' ? 'border-amber-600/20' : 'border-[#DFD3C3]'
              }`}>
                <span className={`text-[11px] flex items-center gap-1 font-mono ${
                  theme === 'dark' ? 'text-amber-200/60' : 'text-[#78716c]'
                }`}>
                  <MapPin className="w-3 h-3 text-amber-500" />
                  HQ: {district.hq}
                </span>

                {isCollected ? (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-500/20 border border-amber-500/40 text-amber-600 text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                    <span>Stamped ✓</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleStampClick(district.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center gap-1.5 ${
                      theme === 'dark'
                        ? 'bg-[#0c1524] hover:bg-gradient-to-r hover:from-amber-500 hover:to-amber-600 text-amber-200 hover:text-slate-950 border-amber-600/40 hover:border-black hover:shadow-[2px_2px_0px_#000]'
                        : 'bg-[#EDE5D8] hover:bg-amber-500 text-[#1c1917] hover:text-slate-950 border-[#D8C3A5] hover:border-black hover:shadow-[2px_2px_0px_#000]'
                    }`}
                  >
                    <span>Stamp Passport</span>
                  </button>
                )}
              </div>

            </motion.div>
          );
        })}
      </div>

    </div>
  );
};
