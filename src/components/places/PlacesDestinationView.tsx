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
  Sun, 
  ExternalLink, 
  Compass, 
  Search, 
  CheckCircle2, 
  Sparkles,
  Award,
  ChevronRight,
  Filter,
  Zap,
  ShieldCheck
} from 'lucide-react';

export const PlacesDestinationView: React.FC = () => {
  const { 
    userProfile, 
    claimDistrictStamp, 
    setMode, 
    setSelectedDistrict,
    theme
  } = useAtlasStore();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDistrictFilter, setSelectedDistrictFilter] = useState<string>('all');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Destinations (37)' },
    { id: 'iconic', label: '🏛️ Iconic Heritage' },
    { id: 'spiritual', label: '🛕 Spiritual & Jyotirlingas' },
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

  const handleViewOnMap = (place: TouristDestination) => {
    setMode('explore');
  };

  return (
    <div className={`max-w-6xl mx-auto px-4 py-8 relative transition-colors duration-200 ${theme === 'dark' ? 'text-slate-100' : 'text-[#282823]'}`}>
      
      {/* Toast */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-slate-950 font-bold px-5 py-2.5 rounded-xl shadow-2xl border-2 border-black flex items-center gap-2 text-xs"
          >
            <Sparkles className="w-4 h-4" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Header: Traditional Gujarati Heritage Style */}
      <div className={`relative border-2 rounded-2xl p-6 sm:p-8 mb-8 shadow-xl overflow-hidden transition-colors ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-[#1b1c2b] via-[#161d2d] to-[#0e141f] border-amber-600/50'
          : 'bg-gradient-to-br from-[#FDFBF7] via-[#F7F2E8] to-[#EFE7D8] border-[#D8C3A5]'
      }`}>
        
        {/* Folk Toran Border Trim on top */}
        <div className="ethnic-toran-trim absolute top-0 left-0 right-0 w-full" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest font-mono border ${
              theme === 'dark'
                ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                : 'bg-amber-500/10 border-amber-600/30 text-[#9a3412]'
            }`}>
              <Compass className="w-3.5 h-3.5 text-amber-500" />
              <span>GUJARAT DARSHAN • ગુજરાત દર્શન</span>
            </div>

            <h1 className={`text-3xl sm:text-4xl font-black font-['Lora',serif] tracking-tight ${
              theme === 'dark' ? 'text-white' : 'text-[#1c1917]'
            }`}>
              Verified Destinations <span className="text-amber-600">of Gujarat</span>
            </h1>

            <p className={`text-sm max-w-2xl leading-relaxed ${
              theme === 'dark' ? 'text-slate-300' : 'text-[#57534e]'
            }`}>
              37 Monumental Solanki Stepwells, Ancient Harappan Citadels, Sacred Jyotirlinga Shrines, Asiatic Lion Sanctuaries, and Blue Flag Coastlines with official ASI &amp; Gujarat Tourism logistics.
            </p>
          </div>

          {/* Quick Counter */}
          <div className={`border-2 p-4 rounded-xl shadow-lg flex-shrink-0 text-center font-mono ${
            theme === 'dark'
              ? 'bg-[#121926] border-amber-500/40'
              : 'bg-[#FDFBF7] border-[#D8C3A5]'
          }`}>
            <span className={`text-3xl font-black font-['Outfit'] block ${theme === 'dark' ? 'text-amber-400' : 'text-[#9a3412]'}`}>37</span>
            <span className={`text-[10px] uppercase tracking-wider ${theme === 'dark' ? 'text-slate-400' : 'text-[#78716c]'}`}>Official ASI &amp; Tourism Sites</span>
          </div>
        </div>

        {/* Traditional Earthen Chips Strip */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-3 text-xs text-slate-300">
          <span className="flex items-center gap-1.5 font-mono text-[11px] text-amber-300">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            100% Statutorily Verified Coordinates
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-1.5 font-mono text-[11px] text-slate-300">
            <span>🏛️</span> ASI National Monuments Included
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-1.5 font-mono text-[11px] text-slate-300">
            <span>🎫</span> Accurate Entry Fee &amp; Visiting Timings
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className={`border-2 rounded-xl p-4 mb-6 space-y-3 shadow-md transition-colors ${
        theme === 'dark'
          ? 'bg-[#121926] border-slate-800'
          : 'bg-[#FDFBF7] border-[#DFD3C3]'
      }`}>
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          
          {/* Search Box */}
          <div className="relative flex-grow">
            <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-slate-400' : 'text-[#78716c]'}`} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search destination, Rani ki Vav, Somnath, Gir..."
              className={`w-full rounded-lg pl-9 pr-4 py-2 text-xs outline-none font-mono border transition-colors ${
                theme === 'dark'
                  ? 'bg-[#0a0f1a] border-slate-700 text-white placeholder-slate-500 focus:border-amber-400'
                  : 'bg-[#F7F2E8] border-[#D8C3A5] text-[#282823] placeholder-[#78716c] focus:border-[#9a3412]'
              }`}
            />
          </div>

          {/* District Filter Dropdown */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={`text-xs font-mono hidden sm:inline ${theme === 'dark' ? 'text-slate-400' : 'text-[#78716c]'}`}>District:</span>
            <select
              value={selectedDistrictFilter}
              onChange={(e) => setSelectedDistrictFilter(e.target.value)}
              className={`border rounded-lg px-3 py-2 text-xs font-mono outline-none ${
                theme === 'dark'
                  ? 'bg-[#0a0f1a] border-slate-700 text-amber-300 focus:border-amber-400'
                  : 'bg-[#F7F2E8] border-[#D8C3A5] text-[#9a3412] focus:border-[#9a3412]'
              }`}
            >
              <option value="all">All 34 Districts</option>
              {GUJARAT_34_DISTRICTS.map((d) => (
                <option key={d.id} value={d.name}>{d.name} ({d.gujaratiName})</option>
              ))}
            </select>
          </div>

        </div>

        {/* Category Pills */}
        <div className={`flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 border-t scrollbar-none ${
          theme === 'dark' ? 'border-slate-800/80' : 'border-[#DFD3C3]'
        }`}>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${
                selectedCategory === c.id
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-[2px_2px_0px_#000]'
                  : theme === 'dark'
                    ? 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                    : 'bg-[#EDE5D8] text-[#44403c] border-[#D8C3A5] hover:border-[#9a3412] hover:text-[#1c1917]'
              }`}
            >
              {c.label}
            </button>
          ))}
          <span className={`ml-auto text-[11px] font-mono whitespace-nowrap hidden md:inline ${
            theme === 'dark' ? 'text-slate-400' : 'text-[#78716c]'
          }`}>
            Showing {filteredPlaces.length} destinations
          </span>
        </div>
      </div>

      {/* Destinations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className={`rounded-xl border-2 overflow-hidden shadow-xl flex flex-col justify-between group transition-all ${
                theme === 'dark'
                  ? 'bg-[#121926] border-slate-800 hover:border-amber-500/60'
                  : 'bg-[#FDFBF7] border-[#DFD3C3] hover:border-[#9a3412] text-[#282823]'
              }`}
            >
              {/* Regional Cultural Toran Trim Ribbon */}
              <div style={{ height: '3.5px', background: culture.borderTrimStyle }} className="w-full" />

              {/* Photo Area with Proper 16:10 Framing and Top Align */}
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                  {place.image ? (
                    <img
                      src={place.image}
                      alt={place.name}
                      referrerPolicy="no-referrer"
                      style={{ objectPosition: 'center center' }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/destinations/statue-of-unity.jpg';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl bg-amber-950/20 text-amber-500">
                      🏛️
                    </div>
                  )}

                  {/* Gradient shadow overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/30" />

                  {/* District & Category badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold uppercase">
                      {place.district}
                    </span>
                    {place.categoryLabel && (
                      <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-slate-200 text-[10px] font-mono">
                        {place.categoryLabel}
                      </span>
                    )}
                  </div>

                  {/* Sub-Regional Folk Motif Pill on Image */}
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[10px] text-amber-200 font-mono font-bold drop-shadow">
                    <span className="truncate">{culture.primaryIcon} {culture.regionName}</span>
                    <span className="font-['Noto_Sans_Gujarati'] font-normal text-amber-100">{culture.gujaratiTitle}</span>
                  </div>
                </div>

                {/* Content body */}
                <div className="p-4 sm:p-5">
                  <h3 className={`font-extrabold text-lg font-['Lora',serif] transition-colors tracking-tight ${
                    theme === 'dark' ? 'text-white group-hover:text-amber-300' : 'text-[#1c1917] group-hover:text-[#9a3412]'
                  }`}>
                    {place.name}
                  </h3>

                  {/* Sub-regional Craft Tag */}
                  <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono mt-1.5 ${culture.badgeBg} ${culture.textColor} border ${culture.badgeBorder}`}>
                    <span>{culture.culturalTag}</span>
                  </div>

                  <p className={`text-xs line-clamp-2 mt-2 leading-relaxed ${
                    theme === 'dark' ? 'text-slate-300' : 'text-[#57534e]'
                  }`}>
                    {place.summary}
                  </p>

                  {/* Highlights Bullet List */}
                  {place.highlights && place.highlights.length > 0 && (
                    <div className={`mt-3 pt-3 border-t space-y-1 ${
                      theme === 'dark' ? 'border-slate-800/80 text-slate-400' : 'border-[#DFD3C3] text-[#78716c]'
                    }`}>
                      {place.highlights.slice(0, 2).map((hl, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-[11px]">
                          <span className="text-amber-500 font-bold">•</span>
                          <span className="line-clamp-1">{hl}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Key Visitor Logistics Chips */}
                  <div className={`mt-4 pt-3 border-t grid grid-cols-2 gap-2 text-[11px] font-mono ${
                    theme === 'dark' ? 'border-slate-800/80 text-slate-300' : 'border-[#DFD3C3] text-[#44403c]'
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

                  {/* EV Roadtrip Readiness & Nearest Fast Charger */}
                  <div className={`mt-2.5 pt-2 border-t flex items-center justify-between text-[11px] font-mono ${
                    theme === 'dark' ? 'border-slate-800/80' : 'border-[#DFD3C3]'
                  }`}>
                    <span className={`flex items-center gap-1.5 truncate ${
                      place.district.toLowerCase() === 'kachchh' || place.district.toLowerCase() === 'the dangs'
                        ? 'text-rose-500'
                        : 'text-emerald-500'
                    }`}>
                      <Zap className="w-3.5 h-3.5 flex-shrink-0" />
                      {place.district.toLowerCase() === 'kachchh' || place.name.includes('Dholavira') || place.name.includes('Rann')
                        ? '⚠️ Remote Dead Zone: Top-up at Bhuj'
                        : place.district.toLowerCase() === 'the dangs' || place.name.includes('Saputara')
                        ? '⚠️ Forest Dead Zone: Top-up at Waghai'
                        : '⚡ EV Ready: Fast Charger < 45km'}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-600 border border-amber-600/30">
                      {place.district.toLowerCase() === 'kachchh' || place.district.toLowerCase() === 'the dangs' ? 'Dead Zone' : '60-180kW'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className={`p-4 border-t flex items-center justify-between gap-2 ${
                theme === 'dark' ? 'bg-slate-950/70 border-slate-800' : 'bg-[#F7F2E8] border-[#DFD3C3]'
              }`}>
                <button
                  onClick={() => handleViewOnMap(place)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 border ${
                    theme === 'dark'
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border-slate-700'
                      : 'bg-[#EDE5D8] hover:bg-[#E2D6C3] text-[#282823] border-[#D8C3A5]'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  <span>View on Map</span>
                </button>

                {districtObj && (
                  <button
                    onClick={() => handleClaimDistrict(place.district)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isDistrictStamped
                        ? 'bg-amber-500/10 text-amber-600 border border-amber-500/30'
                        : 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-[2px_2px_0px_#000]'
                    }`}
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>{isDistrictStamped ? 'District Stamped ✓' : 'Stamp District'}</span>
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
