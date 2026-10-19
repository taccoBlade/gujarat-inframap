import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAtlasStore } from '../../stores/useAtlasStore';
import { VERIFIED_TOURIST_DESTINATIONS, TouristDestination } from '../../data/tourist-destinations';
import { GUJARAT_34_DISTRICTS } from '../../data/passport-districts';
import { getRegionalCulture } from '../../utils/cultural-regions';
import { 
  MapPin, 
  Clock, 
  Ticket, 
  Search, 
  Sparkles,
  Award,
  Zap,
  CheckCircle2,
  Compass
} from 'lucide-react';

export const PlacesDestinationView: React.FC = () => {
  const { 
    userProfile, 
    claimDistrictStamp, 
    setMode, 
    theme
  } = useAtlasStore();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDistrictFilter, setSelectedDistrictFilter] = useState<string>('all');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Places (37)' },
    { id: 'iconic', label: '🏛️ Iconic Heritage' },
    { id: 'spiritual', label: '🛕 Spiritual Shrines' },
    { id: 'wildlife', label: '🦁 Wildlife & Rann' },
    { id: 'coastal', label: '🌊 Coastal & Beaches' },
    { id: 'nature', label: '🌿 Nature & Hills' }
  ];

  const filteredPlaces = VERIFIED_TOURIST_DESTINATIONS.filter((place) => {
    const matchesSearch = !search || 
      place.name.toLowerCase().includes(search.toLowerCase()) || 
      place.district.toLowerCase().includes(search.toLowerCase()) ||
      place.summary.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || 
      place.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      (selectedCategory === 'wildlife' && (place.name.includes('Gir') || place.name.includes('Rann') || place.name.includes('Sanctuary') || place.name.includes('Blackbuck'))) ||
      (selectedCategory === 'spiritual' && (place.name.includes('Temple') || place.name.includes('Mandir') || place.name.includes('Jyotirlinga') || place.name.includes('Palitana') || place.name.includes('Ambaji') || place.name.includes('Somnath') || place.name.includes('Dwarka'))) ||
      (selectedCategory === 'coastal' && (place.name.includes('Beach') || place.name.includes('Coast') || place.name.includes('Marine') || place.name.includes('Mandvi') || place.name.includes('Shivrajpur') || place.name.includes('Dumas'))) ||
      (selectedCategory === 'nature' && (place.name.includes('Saputara') || place.name.includes('Polo') || place.name.includes('Hills') || place.name.includes('Waterfall')));

    const matchesDistrict = selectedDistrictFilter === 'all' || place.district === selectedDistrictFilter;

    return matchesSearch && matchesCategory && matchesDistrict;
  });

  const handleClaimDistrict = (districtName: string) => {
    const districtObj = GUJARAT_34_DISTRICTS.find(d => d.name.toLowerCase() === districtName.toLowerCase());
    if (districtObj) {
      const res = claimDistrictStamp(districtObj.id);
      setToastMsg(res.message);
      setTimeout(() => setToastMsg(null), 3500);
    }
  };

  const handleViewOnMap = (_place: TouristDestination) => {
    setMode('explore');
  };

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 transition-colors duration-200 ${
      theme === 'dark' ? 'text-slate-100' : 'text-[#282823]'
    }`}>
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-slate-950 font-bold px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 text-xs border border-amber-400"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Unified Luxury Editorial Header */}
      <div className={`rounded-3xl border p-6 sm:p-8 mb-6 sm:mb-8 transition-all relative overflow-hidden shadow-sm ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-[#121c2e] via-[#0f172a] to-[#090d16] border-amber-500/20'
          : 'bg-gradient-to-br from-[#FDFBF7] via-[#F8F4EC] to-[#EFE7D8] border-[#D8C3A5]'
      }`}>
        {/* Subtle decorative cultural hairline */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500" />

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase font-mono bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Compass className="w-3.5 h-3.5" />
              <span>Gujarat Darshan • ૩૭ સાંસ્કૃતિક પ્રવાસ સ્થળો</span>
            </div>

            <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight font-serif ${
              theme === 'dark' ? 'text-white' : 'text-[#1c1917]'
            }`}>
              Verified Destinations <span className="text-amber-500">of Gujarat</span>
            </h1>

            <p className={`text-xs sm:text-sm leading-relaxed ${
              theme === 'dark' ? 'text-slate-300' : 'text-[#57534e]'
            }`}>
              Solanki Stepwells, Harappan Citadels, Jyotirlinga Shrines, Asiatic Lion Reserves, and Blue Flag Coastlines with official ASI &amp; Gujarat Tourism coordinates.
            </p>
          </div>

          {/* Clean Quick Metric Badge */}
          <div className="flex items-center gap-3 self-start lg:self-auto">
            <div className={`px-4 py-2.5 rounded-2xl border text-center shadow-sm ${
              theme === 'dark' 
                ? 'bg-slate-900/80 border-slate-700/80' 
                : 'bg-white/80 border-[#D8C3A5]'
            }`}>
              <div className="text-2xl font-black font-mono text-amber-500 leading-none">37</div>
              <div className="text-[10px] font-medium uppercase tracking-wider text-stone-500 dark:text-slate-400 mt-0.5">
                Verified Sites
              </div>
            </div>

            <div className={`px-4 py-2.5 rounded-2xl border text-center shadow-sm ${
              theme === 'dark' 
                ? 'bg-slate-900/80 border-slate-700/80' 
                : 'bg-white/80 border-[#D8C3A5]'
            }`}>
              <div className="text-2xl font-black font-mono text-emerald-500 leading-none">100%</div>
              <div className="text-[10px] font-medium uppercase tracking-wider text-stone-500 dark:text-slate-400 mt-0.5">
                ASI Coordinates
              </div>
            </div>
          </div>
        </div>

        {/* Integrated Filter & Search Toolbar */}
        <div className="mt-6 pt-5 border-t border-stone-200/60 dark:border-slate-800/80 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          
          {/* Search Box */}
          <div className="relative flex-grow max-w-lg">
            <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${
              theme === 'dark' ? 'text-slate-400' : 'text-stone-400'
            }`} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Rani ki Vav, Somnath, Gir, Dholavira..."
              className={`w-full rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none border transition-all ${
                theme === 'dark'
                  ? 'bg-slate-900/90 border-slate-700/80 text-white placeholder-slate-500 focus:border-amber-400'
                  : 'bg-white/90 border-[#D8C3A5] text-[#282823] placeholder-stone-400 focus:border-amber-600'
              }`}
            />
          </div>

          {/* District Selector */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs font-medium text-stone-500 dark:text-slate-400 hidden sm:inline">District:</span>
            <select
              value={selectedDistrictFilter}
              onChange={(e) => setSelectedDistrictFilter(e.target.value)}
              className={`rounded-xl px-3 py-2.5 text-xs outline-none border transition-all ${
                theme === 'dark'
                  ? 'bg-slate-900/90 border-slate-700/80 text-amber-300 focus:border-amber-400'
                  : 'bg-white/90 border-[#D8C3A5] text-[#9a3412] focus:border-amber-600'
              }`}
            >
              <option value="all">All 34 Districts</option>
              {GUJARAT_34_DISTRICTS.map((d) => (
                <option key={d.id} value={d.name}>{d.name} ({d.gujaratiName})</option>
              ))}
            </select>
          </div>

        </div>

        {/* Category Pills Row */}
        <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedCategory === c.id
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                  : theme === 'dark'
                    ? 'bg-slate-900/60 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                    : 'bg-white/60 text-stone-700 border-[#D8C3A5] hover:border-amber-600'
              }`}
            >
              {c.label}
            </button>
          ))}
          <span className="ml-auto text-xs font-mono text-stone-400 dark:text-slate-500 whitespace-nowrap hidden lg:inline">
            Showing {filteredPlaces.length} destinations
          </span>
        </div>

      </div>

      {/* Destinations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlaces.map((place) => {
          const districtObj = GUJARAT_34_DISTRICTS.find(d => d.name.toLowerCase() === place.district.toLowerCase());
          const isDistrictStamped = districtObj && userProfile.collectedStampIds.includes(districtObj.id);
          const culture = getRegionalCulture(place.district || place.region);

          return (
            <motion.div
              key={place.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.25 }}
              className={`rounded-2xl border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group ${
                theme === 'dark'
                  ? 'bg-[#121926] border-slate-800/90 hover:border-amber-500/50'
                  : 'bg-[#FDFBF7] border-[#DFD3C3] hover:border-amber-600 text-[#282823]'
              }`}
            >
              {/* Cultural Toran Line */}
              <div style={{ height: '3px', background: culture.borderTrimStyle }} className="w-full" />

              {/* Photo Area with 16:10 Aspect Ratio */}
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                  <img
                    src={place.image || '/images/destinations/statue-of-unity.jpg'}
                    alt={place.name}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/destinations/statue-of-unity.jpg';
                    }}
                  />

                  {/* Gradient overlay for text contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                  {/* District & Category badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-md text-amber-300 border border-amber-500/30 text-xs font-mono font-bold uppercase tracking-wider">
                      {place.district}
                    </span>
                    {place.categoryLabel && (
                      <span className="px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-slate-200 text-xs font-sans font-medium">
                        {place.categoryLabel}
                      </span>
                    )}
                  </div>

                  {/* Cultural Region Tag on Photo Footer */}
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs text-amber-200 font-medium drop-shadow">
                    <span className="truncate">{culture.primaryIcon} {culture.regionName}</span>
                    <span className="font-['Noto_Sans_Gujarati'] text-amber-100">{culture.gujaratiTitle}</span>
                  </div>
                </div>

                {/* Content body */}
                <div className="p-5">
                  <h3 className={`font-bold text-lg font-serif transition-colors tracking-tight line-clamp-1 ${
                    theme === 'dark' ? 'text-white group-hover:text-amber-400' : 'text-[#1c1917] group-hover:text-amber-700'
                  }`}>
                    {place.name}
                  </h3>

                  {/* Regional Craft Pill */}
                  <div className="mt-2">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono ${culture.badgeBg} ${culture.textColor} border ${culture.badgeBorder}`}>
                      {culture.culturalTag}
                    </span>
                  </div>

                  <p className={`text-xs line-clamp-2 mt-2.5 leading-relaxed ${
                    theme === 'dark' ? 'text-slate-300' : 'text-[#57534e]'
                  }`}>
                    {place.summary}
                  </p>

                  {/* Key Visitor Logistics */}
                  <div className={`mt-4 pt-3 border-t grid grid-cols-2 gap-2 text-xs ${
                    theme === 'dark' ? 'border-slate-800/80 text-slate-300' : 'border-stone-200 text-stone-600'
                  }`}>
                    <div className="flex items-center gap-1.5 truncate">
                      <Clock className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                      <span className="truncate">{place.timings || '08:00 - 18:00'}</span>
                    </div>

                    <div className="flex items-center gap-1.5 truncate">
                      <Ticket className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      <span className="truncate">{place.entryFee || 'Free / ASI'}</span>
                    </div>
                  </div>

                  {/* EV Roadtrip Status */}
                  <div className={`mt-2.5 pt-2 border-t flex items-center justify-between text-xs ${
                    theme === 'dark' ? 'border-slate-800/80' : 'border-stone-200'
                  }`}>
                    <span className={`flex items-center gap-1.5 truncate ${
                      place.district.toLowerCase() === 'kachchh' || place.district.toLowerCase() === 'the dangs'
                        ? 'text-rose-500'
                        : 'text-emerald-500'
                    }`}>
                      <Zap className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">
                        {place.district.toLowerCase() === 'kachchh' || place.name.includes('Dholavira') || place.name.includes('Rann')
                          ? 'Remote Zone (Top-up Bhuj)'
                          : place.district.toLowerCase() === 'the dangs' || place.name.includes('Saputara')
                          ? 'Forest Zone (Top-up Waghai)'
                          : 'EV Ready (< 45km)'}
                      </span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-mono">
                      {place.district.toLowerCase() === 'kachchh' || place.district.toLowerCase() === 'the dangs' ? 'Dead Zone' : '60-180kW'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className={`p-4 border-t flex items-center justify-between gap-2.5 ${
                theme === 'dark' ? 'bg-slate-950/60 border-slate-800' : 'bg-[#F8F5EE] border-stone-200'
              }`}>
                <button
                  onClick={() => handleViewOnMap(place)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 border ${
                    theme === 'dark'
                      ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border-slate-700'
                      : 'bg-white hover:bg-stone-50 text-stone-800 border-[#D8C3A5]'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  <span>View on Map</span>
                </button>

                {districtObj && (
                  <button
                    onClick={() => handleClaimDistrict(place.district)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isDistrictStamped
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm active:translate-y-0.5'
                    }`}
                  >
                    {isDistrictStamped ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Stamped ✓</span>
                      </>
                    ) : (
                      <>
                        <Award className="w-3.5 h-3.5" />
                        <span>Stamp District</span>
                      </>
                    )}
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
