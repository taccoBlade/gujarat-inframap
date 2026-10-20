import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAtlasStore } from '../../stores/useAtlasStore';
import { GUJARAT_34_DISTRICTS } from '../../data/passport-districts';
import { DistrictRegion } from '../../types/atlas';
import { getRegionalCulture } from '../../utils/cultural-regions';
import { 
  PatolaIkatPattern, 
  StepwellGeometryPattern, 
  ToranOrnamentalBorder 
} from '../cultural/GujaratiPatterns';
import { 
  Share2, 
  CheckCircle2, 
  MapPin, 
  Sparkles, 
  Trophy, 
  Lock, 
  Cloud, 
  CloudOff, 
  LogIn,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

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

  const getMilestoneStatus = (count: number) => {
    if (count >= 34) return { title: 'Royal Solanki Emperor', next: '100% Gujarat Conquered!', needed: 0 };
    if (count >= 24) return { title: 'Vanguard Explorer', next: '10 stamps to Royal Solanki Emperor', needed: 34 - count };
    if (count >= 12) return { title: 'Saurashtra Pathfinder', next: '12 stamps to Vanguard Explorer', needed: 24 - count };
    if (count >= 5) return { title: 'Heritage Pravasi', next: '7 stamps to Pathfinder status', needed: 12 - count };
    return { title: 'Novice Pilgrim', next: `${5 - count} stamps to Heritage Pravasi rank`, needed: 5 - count };
  };

  const currentMilestone = getMilestoneStatus(collectedCount);

  const filteredDistricts = selectedRegion === 'All' 
    ? GUJARAT_34_DISTRICTS 
    : GUJARAT_34_DISTRICTS.filter(d => d.region === selectedRegion);

  const handleStampClick = (districtId: string) => {
    const res = claimDistrictStamp(districtId);
    setToastMessage(res.message);
    setTimeout(() => setToastMessage(null), 3500);
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
    <div className={`max-w-6xl mx-auto px-3 sm:px-6 py-6 sm:py-8 relative transition-colors duration-200 ${
      theme === 'dark' ? 'text-[#F1E8D7]' : 'text-[#101827]'
    }`}>
      
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#FF9418] text-[#101827] font-black px-6 py-2.5 rounded-xl shadow-[4px_4px_0px_#101827] border-2 border-[#101827] flex items-center gap-2 text-xs"
          >
            <Sparkles className="w-4 h-4 text-[#101827]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cloud Sync & Auth Explanation Banner */}
      <div className="mb-6">
        {!userProfile.isLoggedIn ? (
          <div className={`p-4 sm:p-5 rounded-2xl border-2 shadow-[3px_3px_0px_#101827] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
            theme === 'dark' ? 'bg-[#151F30] border-[#25324A]' : 'bg-[#FAF6ED] border-[#25324A]'
          }`}>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#FF9418]/15 border-2 border-[#FF9418] flex items-center justify-center text-[#FF9418] flex-shrink-0 mt-0.5">
                <CloudOff className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-black text-[#FF9418] uppercase tracking-wider font-mono">
                  GUEST PASSPORT ACTIVE • LOCAL CACHE SECURE
                </p>
                <p className="text-xs text-[#8F9CAE] leading-relaxed">
                  Your stamps are preserved locally in this browser. When you sign in, all existing guest stamps safely merge with your cloud account without loss.
                </p>
              </div>
            </div>
            <button
              onClick={() => setAuthModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#FF9418] hover:bg-[#e07f10] text-[#101827] font-black text-xs flex items-center gap-1.5 shadow-[2px_2px_0px_#101827] border-2 border-[#101827] active:translate-x-0.5 active:translate-y-0.5 transition-all flex-shrink-0"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Claim Cloud Passport</span>
            </button>
          </div>
        ) : (
          <div className={`p-3.5 rounded-2xl border-2 shadow-[2px_2px_0px_#101827] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs ${
            theme === 'dark' ? 'bg-[#1C6555]/15 border-[#1C6555]' : 'bg-[#FAF6ED] border-[#1C6555]'
          }`}>
            <div className="flex items-center gap-2 text-[#1C6555] font-bold">
              <Cloud className="w-4 h-4" />
              <span>
                Passport Synced: <strong className="text-white dark:text-white">{userProfile.name}</strong> ({userProfile.handle})
              </span>
              <span className="text-[10px] px-2 py-0.2 bg-[#1C6555] text-white rounded font-mono">
                Cloud Active
              </span>
            </div>
            <button
              onClick={() => setOnboardingOpen(true)}
              className="text-xs text-[#FF9418] hover:underline font-mono font-bold flex items-center gap-1"
            >
              <span>Change Home District ({userProfile.homeDistrict})</span>
            </button>
          </div>
        )}
      </div>

      {/* Hero Header: Official Solanki Gujarat Cultural Passport */}
      <div className={`border-2 rounded-2xl p-5 sm:p-8 mb-6 sm:mb-8 shadow-[4px_4px_0px_#101827] relative overflow-hidden transition-colors ${
        theme === 'dark' ? 'bg-[#151F30] border-[#25324A]' : 'bg-[#FAF6ED] border-[#25324A]'
      }`}>
        {/* Toran Border Trim on Top */}
        <ToranOrnamentalBorder className="rounded-t mb-4 -mt-5 -mx-5 sm:-mt-8 sm:-mx-8" height={10} />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider font-mono bg-[#FF9418]/15 text-[#FF9418] border border-[#FF9418]/40">
              <Trophy className="w-3.5 h-3.5" />
              <span>OFFICIAL CULTURAL PASSPORT • ગુજરાત પાસપોર્ટ</span>
            </div>
            
            <h1 className={`text-2xl sm:text-3xl md:text-4xl font-black tracking-tight font-editorial ${
              theme === 'dark' ? 'text-white' : 'text-[#101827]'
            }`}>
              34 Districts <span className="text-[#FF9418]">Explorer Challenge</span>
            </h1>

            <p className={`text-xs sm:text-sm max-w-xl font-['Noto_Sans_Gujarati'] leading-relaxed ${
              theme === 'dark' ? 'text-[#8F9CAE]' : 'text-[#606F7B]'
            }`}>
              ગુજરાતના તમામ ૩૪ જિલ્લાઓની મુલાકાત લો, ડિજિટલ મોહર (Stamp) સંગ્રહિત કરો અને તમારો યાત્રા સ્કોર મિત્રો સાથે શેર કરો.
            </p>
          </div>

          {/* User Score & Share Card Button */}
          <div className={`flex flex-wrap items-center gap-4 border-2 p-4 rounded-xl shadow-[2px_2px_0px_#101827] ${
            theme === 'dark' ? 'bg-[#101827] border-[#25324A]' : 'bg-white border-[#25324A]'
          }`}>
            <div className="flex flex-col text-right">
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-[#8F9CAE]">STAMPS EARNED</span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black font-editorial text-[#FF9418]">{collectedCount}</span>
                <span className="font-bold text-[#8F9CAE]">/ 34</span>
                <span className="text-xs font-bold ml-1 font-['Noto_Sans_Gujarati'] text-[#FF9418]">
                  ({toGujaratiDigits(collectedCount)}/૩૪)
                </span>
              </div>
            </div>

            <div className="w-px h-10 hidden sm:block bg-[#25324A]"></div>

            <button
              onClick={() => setShareModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#FF9418] hover:bg-[#e07f10] text-[#101827] font-black text-xs uppercase tracking-wider rounded-xl shadow-[2px_2px_0px_#101827] border-2 border-[#101827] active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Card</span>
            </button>
          </div>
        </div>

        {/* Single Prominent Progress Indicator & Milestone Card */}
        <div className="mt-6 pt-5 border-t-2 border-[#25324A] space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono font-bold gap-1">
            <div className="flex items-center gap-2">
              <PatolaIkatPattern size={18} />
              <span>RANK: <strong className="text-[#FF9418]">{currentMilestone.title}</strong></span>
              <span className="text-[#8F9CAE]">({progressPercent}% Complete)</span>
            </div>
            <span className="text-[#1C6555] font-semibold">
              {currentMilestone.next}
            </span>
          </div>

          <div className="w-full h-3 rounded-md overflow-hidden border-2 border-[#25324A] bg-[#101827] p-0.5">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-[#FF9418] via-[#FFB054] to-[#1C6555] rounded-sm shadow-sm"
            />
          </div>
        </div>

      </div>

      {/* Region Filter Bar with Stepwell Geometry */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
        <StepwellGeometryPattern size={22} className="flex-shrink-0 hidden sm:inline-block" />
        {regions.map((region) => {
          const isSelected = selectedRegion === region;
          return (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all border-2 ${
                isSelected
                  ? 'bg-[#FF9418] text-[#101827] border-[#101827] shadow-[2px_2px_0px_#101827]'
                  : theme === 'dark'
                    ? 'bg-[#151F30] text-[#8F9CAE] border-[#25324A] hover:border-[#FF9418] hover:text-white'
                    : 'bg-white text-[#25324A] border-[#25324A] hover:border-[#FF9418]'
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
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className={`relative rounded-2xl border-2 p-5 transition-all flex flex-col justify-between overflow-hidden shadow-[3px_3px_0px_#101827] hover:shadow-[5px_5px_0px_#FF9418] ${
                isCollected
                  ? theme === 'dark'
                    ? 'bg-[#151F30] border-[#1C6555]'
                    : 'bg-[#FAF6ED] border-[#1C6555]'
                  : theme === 'dark'
                    ? 'bg-[#151F30] border-[#25324A]'
                    : 'bg-[#FAF6ED] border-[#25324A]'
              }`}
            >
              {/* Toran top accent hairline */}
              <div style={{ height: '3px', background: culture.borderTrimStyle }} className="w-full absolute top-0 left-0 right-0" />

              {/* Top Row: Regional Tag & Rarity */}
              <div className="flex items-center justify-between gap-2 mb-3 mt-1">
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                  theme === 'dark'
                    ? 'bg-[#101827] text-[#FF9418] border-[#25324A]'
                    : 'bg-white text-[#9D233B] border-[#25324A]'
                }`}>
                  {culture.primaryIcon} {district.region}
                </span>

                {isHome && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#1C6555]/20 text-[#1C6555] border border-[#1C6555]">
                    🏠 Home
                  </span>
                )}

                <span className="text-[10px] font-mono text-[#8F9CAE]">
                  Top {100 - district.rarityPercentile}% rarity
                </span>
              </div>

              {/* District Identity & Stamp Seal */}
              <div className="flex items-start gap-3.5 mb-3">
                {/* Stamp Icon / Circular Seal with brutalist offset */}
                <div className={`w-13 h-13 rounded-xl flex-shrink-0 flex items-center justify-center text-2xl border-2 shadow-[2px_2px_0px_#101827] transition-transform ${
                  isCollected
                    ? 'bg-[#1C6555]/20 border-[#1C6555] text-[#1C6555] rotate-[-3deg]'
                    : 'bg-[#101827] border-dashed border-[#25324A] text-[#8F9CAE]/40'
                }`}>
                  {isCollected ? district.icon : <Lock className="w-4 h-4 text-[#8F9CAE]" />}
                </div>

                {/* Name & Gujarati Script */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <h3 className={`font-black text-base tracking-tight font-editorial truncate ${
                      theme === 'dark' ? 'text-white' : 'text-[#101827]'
                    }`}>
                      {district.name}
                    </h3>
                    <span className="text-xs font-bold text-[#FF9418] font-['Noto_Sans_Gujarati']">
                      {district.gujaratiName}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-[#8F9CAE] truncate mt-0.5">
                    📍 {district.landmark}
                  </p>
                  
                  <p className="text-xs line-clamp-2 mt-1 leading-snug text-[#8F9CAE]">
                    {district.culturalTitle}
                  </p>
                </div>
              </div>

              {/* Regional Cultural Craft Tag */}
              <div className="mb-3">
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${culture.badgeBg} ${culture.textColor} ${culture.badgeBorder}`}>
                  {culture.culturalTag}
                </span>
              </div>

              {/* Action Button: Check In / Stamped */}
              <div className="pt-3 border-t-2 border-[#25324A] flex items-center justify-between">
                <span className="text-xs flex items-center gap-1 font-mono text-[#8F9CAE]">
                  <MapPin className="w-3 h-3 text-[#FF9418]" />
                  HQ: {district.hq}
                </span>

                {isCollected ? (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#1C6555]/20 border border-[#1C6555] text-[#1C6555] text-xs font-black">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Stamped ✓</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleStampClick(district.id)}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-black transition-all border-2 border-[#101827] bg-[#FF9418] hover:bg-[#e07f10] text-[#101827] shadow-[2px_2px_0px_#101827] active:translate-x-0.5 active:translate-y-0.5"
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
