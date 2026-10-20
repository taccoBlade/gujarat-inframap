import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAtlasStore } from '../../stores/useAtlasStore';
import { VERIFIED_TOURIST_DESTINATIONS, TouristDestination } from '../../data/tourist-destinations';
import { GUJARAT_34_DISTRICTS } from '../../data/passport-districts';
import { getRegionalCulture } from '../../utils/cultural-regions';
import { ToranOrnamentalBorder, BandhaniDotsPattern } from '../cultural/GujaratiPatterns';
import { 
  MapPin, 
  Clock, 
  Ticket, 
  Search, 
  Sparkles,
  Zap,
  CheckCircle2,
  Compass,
  ArrowRight,
  RotateCcw,
  ExternalLink,
  Bookmark
} from 'lucide-react';

export const PlacesDestinationView: React.FC = () => {
  const { 
    userProfile, 
    claimDistrictStamp, 
    setMode, 
    setSelectedDistrict,
    theme,
    setActiveDossierAsset,
    saveLocation,
    removeSavedLocation
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

    const matchesDistrict = selectedDistrictFilter === 'all' || place.district.toLowerCase() === selectedDistrictFilter.toLowerCase();

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
    const districtObj = GUJARAT_34_DISTRICTS.find(d => d.name.toLowerCase() === place.district.toLowerCase());
    if (districtObj) {
      setSelectedDistrict(districtObj.id);
    }
    setMode('explore');
  };

  const resetAllFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setSelectedDistrictFilter('all');
  };

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 transition-colors duration-200 ${
      theme === 'dark' ? 'text-[#F1E8D7]' : 'text-[#101827]'
    }`}>
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#FF9418] text-[#101827] font-black px-5 py-2.5 rounded-xl shadow-[4px_4px_0px_#101827] flex items-center gap-2 text-xs border-2 border-[#101827]"
          >
            <Sparkles className="w-4 h-4 text-[#101827]" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editorial Header in Gen Z Neo-Brutalist Frame */}
      <div className={`rounded-2xl border-2 p-6 sm:p-8 mb-6 sm:mb-8 transition-all relative overflow-hidden shadow-[4px_4px_0px_#101827] ${
        theme === 'dark' ? 'bg-[#151F30] border-[#25324A]' : 'bg-[#FAF6ED] border-[#25324A]'
      }`}>
        {/* Toran Border Accent */}
        <ToranOrnamentalBorder className="rounded-t mb-4 -mt-6 -mx-6 sm:-mt-8 sm:-mx-8" height={10} />

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase font-mono bg-[#FF9418]/15 text-[#FF9418] border border-[#FF9418]/40">
              <Compass className="w-3.5 h-3.5" />
              <span>GUJARAT DARSHAN • ૩૭ સાંસ્કૃતિક પ્રવાસ સ્થળો</span>
            </div>

            <h1 className={`text-2xl sm:text-3xl md:text-4xl font-black tracking-tight font-editorial ${
              theme === 'dark' ? 'text-white' : 'text-[#101827]'
            }`}>
              Verified Destinations <span className="text-[#FF9418]">of Gujarat</span>
            </h1>

            <p className={`text-xs sm:text-sm leading-relaxed ${
              theme === 'dark' ? 'text-[#8F9CAE]' : 'text-[#606F7B]'
            }`}>
              Solanki Stepwells, Harappan Citadels, Jyotirlinga Shrines, Asiatic Lion Reserves, and Blue Flag Coastlines with official ASI &amp; Gujarat Tourism coordinates.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 self-start lg:self-auto">
            <div className={`px-4 py-2.5 rounded-xl border-2 text-center shadow-[2px_2px_0px_#101827] ${
              theme === 'dark' ? 'bg-[#101827] border-[#25324A]' : 'bg-white border-[#25324A]'
            }`}>
              <div className="text-2xl font-black font-mono text-[#FF9418] leading-none">37</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#8F9CAE] mt-0.5">
                Verified Sites
              </div>
            </div>

            <div className={`px-4 py-2.5 rounded-xl border-2 text-center shadow-[2px_2px_0px_#101827] ${
              theme === 'dark' ? 'bg-[#101827] border-[#25324A]' : 'bg-white border-[#25324A]'
            }`}>
              <div className="text-2xl font-black font-mono text-[#1C6555] leading-none">100%</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#8F9CAE] mt-0.5">
                ASI Coordinates
              </div>
            </div>
          </div>
        </div>

        {/* Integrated Filter & Search Toolbar */}
        <div className="mt-6 pt-5 border-t-2 border-[#25324A] flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          
          {/* Search Box */}
          <div className="relative flex-grow max-w-lg">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8F9CAE]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Rani ki Vav, Somnath, Gir, Dholavira..."
              className={`w-full rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none border-2 transition-all font-semibold ${
                theme === 'dark'
                  ? 'bg-[#101827] border-[#25324A] text-white placeholder-[#8F9CAE] focus:border-[#FF9418]'
                  : 'bg-white border-[#25324A] text-[#101827] placeholder-[#8F9CAE] focus:border-[#FF9418]'
              }`}
            />
          </div>

          {/* District Selector */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs font-bold text-[#8F9CAE] hidden sm:inline">District:</span>
            <select
              value={selectedDistrictFilter}
              onChange={(e) => setSelectedDistrictFilter(e.target.value)}
              className={`rounded-xl px-3 py-2 text-xs font-bold outline-none border-2 transition-all ${
                theme === 'dark'
                  ? 'bg-[#101827] border-[#25324A] text-[#FF9418] focus:border-[#FF9418]'
                  : 'bg-white border-[#25324A] text-[#9D233B] focus:border-[#FF9418]'
              }`}
            >
              <option value="all">All 34 Districts</option>
              {GUJARAT_34_DISTRICTS.map((d) => (
                <option key={d.id} value={d.name}>{d.name} ({d.gujaratiName})</option>
              ))}
            </select>
          </div>

        </div>

        {/* Category Filter Pills */}
        <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all border-2 ${
                selectedCategory === c.id
                  ? 'bg-[#FF9418] text-[#101827] border-[#101827] shadow-[2px_2px_0px_#101827]'
                  : theme === 'dark'
                    ? 'bg-[#101827] text-[#8F9CAE] border-[#25324A] hover:border-[#FF9418] hover:text-white'
                    : 'bg-white text-[#25324A] border-[#25324A] hover:border-[#FF9418]'
              }`}
            >
              {c.label}
            </button>
          ))}
          <span className="ml-auto text-xs font-mono text-[#8F9CAE] whitespace-nowrap hidden lg:inline">
            Showing {filteredPlaces.length} destinations
          </span>
        </div>

      </div>

      {/* Destinations Cards Grid */}
      {filteredPlaces.length > 0 ? (
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
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                className={`rounded-2xl border-2 overflow-hidden shadow-[4px_4px_0px_#101827] hover:shadow-[6px_6px_0px_#FF9418] transition-all duration-200 flex flex-col justify-between group ${
                  theme === 'dark'
                    ? 'bg-[#151F30] border-[#25324A]'
                    : 'bg-[#FAF6ED] border-[#25324A]'
                }`}
              >
                {/* Cultural Toran Accent Line */}
                <div style={{ height: '3px', background: culture.borderTrimStyle }} className="w-full" />

                {/* 1. Image Area with stable 16:10 aspect ratio and reliable fallback */}
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#0A0F1D] border-b-2 border-[#25324A] flex items-center justify-center">
                    {/* Ambient Blurred Backdrop - preserves background color harmony without clipping */}
                    <img
                      src={place.image || '/images/destinations/statue-of-unity.jpg'}
                      alt=""
                      aria-hidden="true"
                      className="absolute inset-0 w-full h-full object-cover filter blur-md opacity-35 scale-110 pointer-events-none"
                    />

                    {/* Uncropped Landmark Image - 100% complete view from head to base */}
                    <img
                      src={place.image || '/images/destinations/statue-of-unity.jpg'}
                      alt={place.name}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/destinations/statue-of-unity.jpg';
                      }}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none z-10" />

                    {/* 2. District & Category Badges */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-[#101827]/90 text-[#FF9418] border border-[#25324A] text-xs font-mono font-bold uppercase tracking-wider">
                        {place.district}
                      </span>
                      {place.categoryLabel && (
                        <span className="px-2 py-0.5 rounded-md bg-[#101827]/80 text-[#F1E8D7] text-xs font-sans font-semibold border border-white/10">
                          {place.categoryLabel}
                        </span>
                      )}
                    </div>

                    {/* Top-Right Dossier Quick Action */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDossierAsset({ ...place, type: 'destination' });
                      }}
                      className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-[#101827]/90 hover:bg-[#FF9418] hover:text-[#101827] text-white text-[10px] font-mono font-bold border border-white/20 backdrop-blur-sm transition-all flex items-center gap-1 shadow-md"
                      title="View Uncropped Photo & Dossier"
                    >
                      <ExternalLink className="w-3 h-3 text-[#FF9418]" />
                      <span>Dossier</span>
                    </button>

                    {/* Cultural Region Tag on Photo Footer */}
                    <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-xs text-[#FF9418] font-bold drop-shadow">
                      <span className="truncate">{culture.primaryIcon} {culture.regionName}</span>
                      <span className="font-['Noto_Sans_Gujarati'] text-[#F1E8D7] text-[11px]">{culture.gujaratiTitle}</span>
                    </div>
                  </div>

                  {/* 3. Destination Title & 4. Concise Description */}
                  <div className="p-4 sm:p-5">
                    <h3 className={`font-black text-lg font-editorial transition-colors tracking-tight line-clamp-1 ${
                      theme === 'dark' ? 'text-white group-hover:text-[#FF9418]' : 'text-[#101827] group-hover:text-[#9D233B]'
                    }`}>
                      {place.name}
                    </h3>

                    {/* Regional Craft & Heritage Tag */}
                    <div className="mt-1.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#FF9418]/10 text-[#FF9418] border border-[#FF9418]/30">
                        {culture.culturalTag}
                      </span>
                    </div>

                    <p className={`text-xs line-clamp-2 mt-2 leading-relaxed ${
                      theme === 'dark' ? 'text-[#8F9CAE]' : 'text-[#606F7B]'
                    }`}>
                      {place.summary}
                    </p>

                    {/* 5. Two or Three Useful Logistics Facts */}
                    <div className="mt-3.5 pt-3 border-t-2 border-[#25324A] grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-1.5 truncate">
                        <Clock className="w-3.5 h-3.5 text-[#FF9418] flex-shrink-0" />
                        <span className="truncate text-[#8F9CAE] font-medium">{place.timings || '08:00 - 18:00'}</span>
                      </div>

                      <div className="flex items-center gap-1.5 truncate">
                        <Ticket className="w-3.5 h-3.5 text-[#1C6555] flex-shrink-0" />
                        <span className="truncate text-[#8F9CAE] font-medium">{place.entryFee || 'Free / ASI'}</span>
                      </div>
                    </div>

                    {/* EV Roadtrip Reachability Status */}
                    <div className="mt-2 pt-2 border-t border-[#25324A]/60 flex items-center justify-between text-xs">
                      <span className={`flex items-center gap-1.5 truncate font-bold text-[11px] ${
                        place.district.toLowerCase() === 'kachchh' || place.district.toLowerCase() === 'the dangs'
                          ? 'text-[#9D233B]'
                          : 'text-[#1C6555]'
                      }`}>
                        <Zap className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">
                          {place.district.toLowerCase() === 'kachchh' || place.name.includes('Dholavira') || place.name.includes('Rann')
                            ? '⚠️ Remote Dead Zone: Top-up 100% at Bhuj'
                            : place.district.toLowerCase() === 'the dangs' || place.name.includes('Saputara')
                            ? '⚠️ Forest Dead Zone: Top-up at Waghai'
                            : '⚡ EV Ready: Fast Charger < 45km'}
                        </span>
                      </span>
                      <span className="text-[10px] px-2 py-0.2 rounded font-mono font-bold bg-[#101827] text-[#8F9CAE] border border-[#25324A]">
                        {place.district.toLowerCase() === 'kachchh' || place.district.toLowerCase() === 'the dangs' ? 'Remote Dead Zone' : '60-180kW'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 6. Primary Action Buttons */}
                <div className={`p-3.5 border-t-2 border-[#25324A] flex items-center justify-between gap-2 ${
                  theme === 'dark' ? 'bg-[#101827]' : 'bg-[#F1E8D7]'
                }`}>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleViewOnMap(place)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border-2 border-[#25324A] hover:border-[#FF9418] bg-transparent"
                    >
                      <MapPin className="w-3.5 h-3.5 text-[#FF9418]" />
                      <span>Map</span>
                    </button>
                    {(() => {
                      const isSaved = (userProfile.savedLocations || []).some(l => l.name === place.name);
                      return (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isSaved) {
                              const existing = (userProfile.savedLocations || []).find(l => l.name === place.name);
                              if (existing) removeSavedLocation(existing.id);
                            } else {
                              saveLocation({
                                name: place.name,
                                lat: place.coordinates[0],
                                lng: place.coordinates[1],
                                category: place.categoryLabel,
                                notes: place.district
                              });
                            }
                          }}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border-2 ${
                            isSaved
                              ? 'bg-[#FF9418] text-[#101827] border-[#101827] shadow-[1px_1px_0px_#101827]'
                              : 'border-[#25324A] hover:border-[#FF9418] bg-transparent text-[#FF9418]'
                          }`}
                          title={isSaved ? "Remove from Saved Places" : "Save Location to My Profile"}
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                          <span>{isSaved ? 'Saved' : 'Save'}</span>
                        </button>
                      );
                    })()}
                  </div>

                  {districtObj && (
                    <button
                      onClick={() => handleClaimDistrict(place.district)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 border-2 ${
                        isDistrictStamped
                          ? 'bg-[#1C6555]/20 text-[#1C6555] border-[#1C6555]'
                          : 'bg-[#FF9418] text-[#101827] border-[#101827] shadow-[2px_2px_0px_#101827] active:translate-x-0.5 active:translate-y-0.5'
                      }`}
                    >
                      {isDistrictStamped ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Stamped</span>
                        </>
                      ) : (
                        <>
                          <span>Stamp District</span>
                          <ArrowRight className="w-3 h-3" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        /* Empty State with Bandhani Dot Pattern */
        <div className={`rounded-2xl border-2 p-12 text-center shadow-[4px_4px_0px_#101827] relative overflow-hidden ${
          theme === 'dark' ? 'bg-[#151F30] border-[#25324A]' : 'bg-[#FAF6ED] border-[#25324A]'
        }`}>
          <div className="flex justify-center mb-4">
            <BandhaniDotsPattern size={48} primaryColor="#FF9418" />
          </div>
          <h3 className="text-lg font-black font-editorial mb-1">
            No destinations found matching your filter
          </h3>
          <p className="text-xs text-[#8F9CAE] max-w-sm mx-auto mb-6">
            Try resetting your search query or choosing "All 34 Districts" to explore verified monuments across Gujarat.
          </p>
          <button
            onClick={resetAllFilters}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF9418] text-[#101827] font-black text-xs border-2 border-[#101827] shadow-[2px_2px_0px_#101827] active:translate-x-0.5 active:translate-y-0.5 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      )}

    </div>
  );
};
