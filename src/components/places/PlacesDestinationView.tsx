import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAtlasStore } from '../../stores/useAtlasStore';
import { VERIFIED_TOURIST_DESTINATIONS, TouristDestination } from '../../data/tourist-destinations';
import { GUJARAT_34_DISTRICTS } from '../../data/passport-districts';
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
    setSelectedDistrict 
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
    <div className="max-w-6xl mx-auto px-4 py-8 text-slate-100">
      
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
      <div className="relative bg-gradient-to-br from-[#1b1c2b] via-[#161d2d] to-[#0e141f] border-2 border-amber-600/50 rounded-2xl p-6 sm:p-8 mb-8 shadow-2xl overflow-hidden">
        
        {/* Folk Toran Border Trim on top */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-600 via-rose-700 to-amber-600" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/15 border border-amber-500/30 rounded-full text-xs font-bold text-amber-300 uppercase tracking-widest font-mono">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>GUJARAT DARSHAN • ગુજરાત દર્શન</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white font-['Lora',serif] tracking-tight">
              Verified Destinations <span className="text-amber-400">of Gujarat</span>
            </h1>

            <p className="text-sm text-slate-300 max-w-2xl font-['Plus_Jakarta_Sans',sans-serif] leading-relaxed">
              37 Monumental Solanki Stepwells, Ancient Harappan Citadels, Sacred Jyotirlinga Shrines, Asiatic Lion Sanctuaries, and Blue Flag Coastlines with official ASI &amp; Gujarat Tourism logistics.
            </p>
          </div>

          {/* Quick Counter */}
          <div className="bg-[#121926] border-2 border-amber-500/40 p-4 rounded-xl shadow-lg flex-shrink-0 text-center font-mono">
            <span className="text-3xl font-black text-amber-400 font-['Outfit'] block">37</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">Official ASI &amp; Tourism Sites</span>
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
      <div className="bg-[#121926] border-2 border-slate-800 rounded-xl p-4 mb-6 space-y-3 shadow-lg">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          
          {/* Search Box */}
          <div className="relative flex-grow">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search destination, Rani ki Vav, Somnath, Gir..."
              className="w-full bg-[#0a0f1a] border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-400 font-mono"
            />
          </div>

          {/* District Filter Dropdown */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">District:</span>
            <select
              value={selectedDistrictFilter}
              onChange={(e) => setSelectedDistrictFilter(e.target.value)}
              className="bg-[#0a0f1a] border border-slate-700 rounded-lg px-3 py-2 text-xs text-amber-300 font-mono outline-none focus:border-amber-400"
            >
              <option value="all">All 34 Districts</option>
              {GUJARAT_34_DISTRICTS.map((d) => (
                <option key={d.id} value={d.name}>{d.name} ({d.gujaratiName})</option>
              ))}
            </select>
          </div>

        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 border-t border-slate-800/80 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${
                selectedCategory === c.id
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-[2px_2px_0px_#000]'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              {c.label}
            </button>
          ))}
          <span className="ml-auto text-[11px] font-mono text-slate-400 whitespace-nowrap hidden md:inline">
            Showing {filteredPlaces.length} destinations
          </span>
        </div>
      </div>

      {/* Destinations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPlaces.map((place) => {
          const districtObj = GUJARAT_34_DISTRICTS.find(d => d.name.toLowerCase() === place.district.toLowerCase());
          const isDistrictStamped = districtObj && userProfile.collectedStampIds.includes(districtObj.id);

          return (
            <motion.div
              key={place.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="bg-[#121926] border-2 border-slate-800 hover:border-amber-500/60 rounded-xl overflow-hidden shadow-xl flex flex-col justify-between group transition-colors"
            >
              {/* Photo Area with Jharokha Arch Framing */}
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                  {place.image ? (
                    <img
                      src={place.image}
                      alt={place.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl bg-amber-950/20 text-amber-500">
                      🏛️
                    </div>
                  )}

                  {/* Gradient shadow overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121926] via-transparent to-black/40" />

                  {/* District & Category badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-950/80 backdrop-blur-md text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold uppercase">
                      {place.district}
                    </span>
                    {place.categoryLabel && (
                      <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-slate-300 text-[10px] font-mono">
                        {place.categoryLabel}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content body */}
                <div className="p-4 sm:p-5">
                  <h3 className="font-extrabold text-lg text-white font-['Lora',serif] group-hover:text-amber-300 transition-colors tracking-tight">
                    {place.name}
                  </h3>

                  <p className="text-xs text-slate-300 line-clamp-2 mt-1.5 leading-relaxed">
                    {place.summary}
                  </p>

                  {/* Highlights Bullet List */}
                  {place.highlights && place.highlights.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1">
                      {place.highlights.slice(0, 2).map((hl, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-400">
                          <span className="text-amber-400 font-bold">•</span>
                          <span className="line-clamp-1">{hl}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Key Visitor Logistics Chips */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[11px] font-mono">
                    <div className="flex items-center gap-1.5 text-slate-300 truncate">
                      <Clock className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                      <span className="truncate">{place.timings || '08:00 - 18:00'}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-300 truncate">
                      <Ticket className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span className="truncate">{place.entryFee || 'Free / ASI'}</span>
                    </div>
                  </div>

                  {/* EV Roadtrip Readiness & Nearest Fast Charger */}
                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                    <span className="flex items-center gap-1.5 text-amber-300 truncate">
                      <Zap className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                      {place.district.toLowerCase() === 'kachchh' || place.name.includes('Dholavira') || place.name.includes('Rann')
                        ? '⚠️ Remote Dead Zone: Top-up 100% at Bhuj'
                        : place.district.toLowerCase() === 'the dangs' || place.name.includes('Saputara')
                        ? '⚠️ Forest Dead Zone: Top-up at Waghai'
                        : '⚡ EV Ready: Fast Charger < 45km'}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-950/80 text-amber-400 border border-amber-600/40">
                      {place.district.toLowerCase() === 'kachchh' || place.district.toLowerCase() === 'the dangs' ? 'Dead Zone Alert' : '60-180kW'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-4 bg-slate-950/70 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleViewOnMap(place)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-colors flex items-center gap-1.5 border border-slate-700"
                >
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>View on Map</span>
                </button>

                {districtObj && (
                  <button
                    onClick={() => handleClaimDistrict(place.district)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isDistrictStamped
                        ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
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
