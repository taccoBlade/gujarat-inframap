import React, { useMemo } from 'react';
import { useAtlasStore } from '../../stores/useAtlasStore';
import { VERIFIED_FOOD_VENUES } from '../../data/food-venues-data';
import { FoodVenueCard } from './FoodVenueCard';
import { FoodVenueDrawer } from './FoodVenueDrawer';
import { FoodSplitMap } from './FoodSplitMap';
import { FoodCrawlPlannerModal } from './FoodCrawlPlannerModal';
import { ReportClosureModal } from './ReportClosureModal';
import { evaluateVenueOpenStatus } from '../../utils/opening-hours';
import { 
  Search, 
  X, 
  MapPin, 
  SlidersHorizontal, 
  Footprints, 
  Sparkles, 
  Clock, 
  Wallet, 
  Utensils, 
  Coffee, 
  Moon, 
  Trees, 
  Compass, 
  RotateCcw,
  Layers,
  Map as MapIcon,
  ListFilter
} from 'lucide-react';

export const FoodAfterDarkView: React.FC = () => {
  const { 
    theme, 
    foodCityFilter, 
    setFoodCityFilter, 
    foodCategoryFilter, 
    setFoodCategoryFilter, 
    foodSearchQuery, 
    setFoodSearchQuery, 
    foodFilterOpenNow, 
    setFoodFilterOpenNow, 
    foodFilterOpenLate, 
    setFoodFilterOpenLate, 
    foodFilterUnder200, 
    setFoodFilterUnder200, 
    foodFilterPureVegOnly, 
    setFoodFilterPureVegOnly,
    foodViewMode,
    setFoodViewMode,
    selectedFoodVenueId,
    setSelectedFoodVenueId,
    foodCrawlVenueIds,
    setFoodCrawlModalOpen
  } = useAtlasStore();

  const categories = [
    { id: 'all', label: 'All Categories', icon: <Compass className="w-3.5 h-3.5" /> },
    { id: 'Street food & local favourites', label: '🌮 Street Food', icon: <Utensils className="w-3.5 h-3.5" /> },
    { id: 'Cafés & coffee spots', label: '☕ Cafés', icon: <Coffee className="w-3.5 h-3.5" /> },
    { id: 'Late-night food', label: '🌙 Late Night', icon: <Moon className="w-3.5 h-3.5" /> },
    { id: 'Night-out destinations and hangout spots', label: '✨ Night Out', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'Evening walks, waterfronts and public spaces', label: '🌳 Public Walks', icon: <Trees className="w-3.5 h-3.5" /> },
    { id: 'Budget-friendly places for students', label: '💸 Student Budget', icon: <Wallet className="w-3.5 h-3.5" /> }
  ];

  // Filtering Logic
  const filteredVenues = useMemo(() => {
    return VERIFIED_FOOD_VENUES.filter((venue) => {
      // 1. City Filter
      if (foodCityFilter !== 'all' && venue.city !== foodCityFilter) {
        return false;
      }

      // 2. Search Query (Matches Name, Branch, Area, or Category)
      if (foodSearchQuery.trim()) {
        const query = foodSearchQuery.toLowerCase();
        const matchesName = venue.name.toLowerCase().includes(query);
        const matchesBranch = venue.branch.toLowerCase().includes(query);
        const matchesArea = venue.area.toLowerCase().includes(query);
        const matchesAddress = venue.address.toLowerCase().includes(query);
        const matchesNotes = venue.verification_notes.toLowerCase().includes(query);
        const matchesVeg = venue.vegetarian.toLowerCase().includes(query);
        if (!matchesName && !matchesBranch && !matchesArea && !matchesAddress && !matchesNotes && !matchesVeg) {
          return false;
        }
      }

      // 3. Category Filter
      if (foodCategoryFilter !== 'all') {
        const matchesPrimary = venue.category === foodCategoryFilter;
        const matchesSecondary = venue.secondary_categories?.includes(foodCategoryFilter);
        if (!matchesPrimary && !matchesSecondary) {
          return false;
        }
      }

      // 4. Quick Filters
      if (foodFilterOpenLate && !venue.late_night) {
        return false;
      }

      if (foodFilterUnder200 && !venue.price_range.toLowerCase().includes('under ₹200')) {
        return false;
      }

      if (foodFilterPureVegOnly) {
        const v = venue.vegetarian.toLowerCase();
        const isPure = v.includes('pure vegetarian') || v.includes('100% pure veg') || v.includes('100% vegetarian');
        if (!isPure) return false;
      }

      if (foodFilterOpenNow) {
        const status = evaluateVenueOpenStatus(venue.opening_hours, venue.status);
        if (!status.isOpen) {
          return false;
        }
      }

      return true;
    });
  }, [
    foodCityFilter, 
    foodCategoryFilter, 
    foodSearchQuery, 
    foodFilterOpenLate, 
    foodFilterUnder200, 
    foodFilterPureVegOnly, 
    foodFilterOpenNow
  ]);

  const selectedVenue = useMemo(() => {
    return VERIFIED_FOOD_VENUES.find(v => v.id === selectedFoodVenueId) || null;
  }, [selectedFoodVenueId]);

  const resetFilters = () => {
    setFoodCityFilter('all');
    setFoodCategoryFilter('all');
    setFoodSearchQuery('');
    setFoodFilterOpenNow(false);
    setFoodFilterOpenLate(false);
    setFoodFilterUnder200(false);
    setFoodFilterPureVegOnly(false);
  };

  const isAnyFilterActive = 
    foodCityFilter !== 'all' || 
    foodCategoryFilter !== 'all' || 
    Boolean(foodSearchQuery.trim()) || 
    foodFilterOpenNow || 
    foodFilterOpenLate || 
    foodFilterUnder200 || 
    foodFilterPureVegOnly;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 pt-4 pb-20 space-y-6">
      
      {/* Editorial Cultural Hero Header */}
      <section className={`p-5 sm:p-7 rounded-3xl border-2 relative overflow-hidden shadow-[4px_4px_0px_#101827] ${
        theme === 'dark' 
          ? 'bg-[#151F30] border-[#25324A]' 
          : 'bg-[#FAF6ED] border-[#25324A]'
      }`}>
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF9418]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 text-[120px] font-['Noto_Sans_Gujarati'] font-black text-[#FF9418]/5 pointer-events-none select-none">
          સ્વાદ
        </div>

        <div className="relative z-10 max-w-3xl space-y-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-lg bg-[#FF9418] text-[#101827] font-mono font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_#101827]">
              After Dark Discovery
            </span>
            <span className="text-xs font-mono font-bold text-[#FF9418]">
              Ahmedabad • Gandhinagar • Vadodara • Surat
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              {VERIFIED_FOOD_VENUES.length} Verified Listings
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-editorial font-bold tracking-tight">
            Food &amp; Nightlife Discovery <span className="text-[#FF9418] font-['Noto_Sans_Gujarati'] font-normal text-xl sm:text-2xl ml-2">રાત્રિ પ્રવાસ &amp; સ્વાદ</span>
          </h1>

          <p className={`text-xs sm:text-sm leading-relaxed ${
            theme === 'dark' ? 'text-[#8F9CAE]' : 'text-[#606F7B]'
          }`}>
            Explore Gujarat's verified late-night food markets, street chaat havens, buzzing student cafes, bowling alleys, and serene waterfront evening walks. Strictly cross-checked for real operating hours and branch locations.
          </p>
        </div>
      </section>

      {/* Control Bar: City Selector, Search & Filters */}
      <section className="space-y-3.5">
        
        {/* City Filter Tabs + View Mode Toggle */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* City Selector Tabs */}
          <div className={`flex items-center gap-1.5 p-1 rounded-2xl border-2 self-start flex-wrap ${
            theme === 'dark' ? 'bg-[#151F30] border-[#25324A]' : 'bg-[#FAF6ED] border-[#25324A]'
          }`}>
            {(['all', 'Ahmedabad', 'Gandhinagar', 'Vadodara', 'Surat'] as const).map((city) => {
              const isActive = foodCityFilter === city;
              const count = city === 'all' 
                ? VERIFIED_FOOD_VENUES.length 
                : VERIFIED_FOOD_VENUES.filter(v => v.city === city).length;

              return (
                <button
                  key={city}
                  type="button"
                  onClick={() => setFoodCityFilter(city)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#FF9418] text-[#101827] shadow-[2px_2px_0px_#101827]'
                      : theme === 'dark'
                        ? 'text-[#F1E8D7]/80 hover:text-white hover:bg-white/5'
                        : 'text-[#25324A] hover:text-[#101827] hover:bg-black/5'
                  }`}
                >
                  <span>{city === 'all' ? 'All Gujarat' : city}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                    isActive ? 'bg-[#101827] text-[#FF9418]' : 'bg-black/10 text-neutral-400'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Controls: View Switcher & Food Crawl Launcher */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Food Crawl Trigger Button */}
            <button
              type="button"
              onClick={() => setFoodCrawlModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1C6555] hover:bg-[#155043] text-white font-bold text-xs border-2 border-[#101827] shadow-[2px_2px_0px_#101827] transition-all"
              title="Open Food Crawl Itinerary Planner"
            >
              <Footprints className="w-4 h-4 text-[#FF9418]" />
              <span>Food Crawl</span>
              {foodCrawlVenueIds.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#FF9418] text-[#101827] font-mono text-[10px] font-black flex items-center justify-center">
                  {foodCrawlVenueIds.length}
                </span>
              )}
            </button>

            {/* Desktop View Mode Switcher (Split / List / Map) */}
            <div className={`hidden lg:flex items-center gap-1 p-1 rounded-xl border-2 ${
              theme === 'dark' ? 'bg-[#151F30] border-[#25324A]' : 'bg-[#FAF6ED] border-[#25324A]'
            }`}>
              <button
                type="button"
                onClick={() => setFoodViewMode('split')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  foodViewMode === 'split' ? 'bg-[#FF9418] text-[#101827]' : 'text-neutral-400 hover:text-white'
                }`}
                title="Split View (List + Interactive Map)"
              >
                Split
              </button>
              <button
                type="button"
                onClick={() => setFoodViewMode('list')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  foodViewMode === 'list' ? 'bg-[#FF9418] text-[#101827]' : 'text-neutral-400 hover:text-white'
                }`}
                title="List Only View"
              >
                List
              </button>
              <button
                type="button"
                onClick={() => setFoodViewMode('map')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  foodViewMode === 'map' ? 'bg-[#FF9418] text-[#101827]' : 'text-neutral-400 hover:text-white'
                }`}
                title="Map Only View"
              >
                Map
              </button>
            </div>
          </div>
        </div>

        {/* Universal Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#FF9418]" />
          <input
            type="text"
            value={foodSearchQuery}
            onChange={(e) => setFoodSearchQuery(e.target.value)}
            placeholder="Search by venue name, branch, locality, or dish (e.g. 'Locho', 'Sev Usal', 'Bowling', 'Manek Chowk')..."
            className={`w-full pl-10 pr-10 py-3 rounded-2xl border-2 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#FF9418] shadow-[2px_2px_0px_#101827] transition-all ${
              theme === 'dark'
                ? 'bg-[#151F30] border-[#25324A] text-white placeholder-[#8F9CAE]'
                : 'bg-[#FAF6ED] border-[#25324A] text-[#101827] placeholder-[#606F7B]'
            }`}
          />
          {foodSearchQuery && (
            <button
              type="button"
              onClick={() => setFoodSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Filter Badges (Open Now, Open Late, Under ₹200, Pure Veg) */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setFoodFilterOpenNow(!foodFilterOpenNow)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 text-xs font-bold transition-all ${
              foodFilterOpenNow
                ? 'bg-emerald-600 border-[#101827] text-white shadow-[2px_2px_0px_#101827]'
                : theme === 'dark'
                  ? 'bg-[#151F30] border-[#25324A] text-[#8F9CAE] hover:border-emerald-500'
                  : 'bg-white border-[#25324A] text-[#606F7B] hover:border-emerald-500'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Open Now</span>
          </button>

          <button
            type="button"
            onClick={() => setFoodFilterOpenLate(!foodFilterOpenLate)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 text-xs font-bold transition-all ${
              foodFilterOpenLate
                ? 'bg-indigo-600 border-[#101827] text-white shadow-[2px_2px_0px_#101827]'
                : theme === 'dark'
                  ? 'bg-[#151F30] border-[#25324A] text-[#8F9CAE] hover:border-indigo-500'
                  : 'bg-white border-[#25324A] text-[#606F7B] hover:border-indigo-500'
            }`}
          >
            <Moon className="w-3.5 h-3.5 text-indigo-400" />
            <span>Open Late (Past 11 PM)</span>
          </button>

          <button
            type="button"
            onClick={() => setFoodFilterUnder200(!foodFilterUnder200)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 text-xs font-bold transition-all ${
              foodFilterUnder200
                ? 'bg-[#FF9418] border-[#101827] text-[#101827] shadow-[2px_2px_0px_#101827]'
                : theme === 'dark'
                  ? 'bg-[#151F30] border-[#25324A] text-[#8F9CAE] hover:border-[#FF9418]'
                  : 'bg-white border-[#25324A] text-[#606F7B] hover:border-[#FF9418]'
            }`}
          >
            <Wallet className="w-3.5 h-3.5 text-[#FF9418]" />
            <span>Under ₹200 (Student)</span>
          </button>

          <button
            type="button"
            onClick={() => setFoodFilterPureVegOnly(!foodFilterPureVegOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 text-xs font-bold transition-all ${
              foodFilterPureVegOnly
                ? 'bg-emerald-700 border-[#101827] text-white shadow-[2px_2px_0px_#101827]'
                : theme === 'dark'
                  ? 'bg-[#151F30] border-[#25324A] text-[#8F9CAE] hover:border-emerald-500'
                  : 'bg-white border-[#25324A] text-[#606F7B] hover:border-emerald-500'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full border border-emerald-500 flex items-center justify-center p-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </span>
            <span>Pure Vegetarian</span>
          </button>

          {isAnyFilterActive && (
            <button
              type="button"
              onClick={resetFilters}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-rose-400 hover:underline font-mono"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Category Horizontal Scroll Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar select-none">
          {categories.map((cat) => {
            const isActive = foodCategoryFilter === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setFoodCategoryFilter(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#25324A] text-[#FF9418] border-[#FF9418] shadow-[2px_2px_0px_#FF9418]'
                    : theme === 'dark'
                      ? 'bg-[#151F30] border-[#25324A] text-[#8F9CAE] hover:text-white'
                      : 'bg-white border-[#25324A] text-[#606F7B] hover:text-[#101827]'
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Content Area: Split Grid or Full List/Map */}
      <section>
        {filteredVenues.length === 0 ? (
          <div className={`p-12 text-center rounded-3xl border-2 space-y-3 ${
            theme === 'dark' ? 'bg-[#151F30] border-[#25324A]' : 'bg-[#FAF6ED] border-[#25324A]'
          }`}>
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#FF9418]/15 border-2 border-[#FF9418]/40 flex items-center justify-center text-[#FF9418]">
              <Compass className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold font-editorial">No matching venues found</h3>
            <p className={`text-xs max-w-sm mx-auto ${
              theme === 'dark' ? 'text-[#8F9CAE]' : 'text-[#606F7B]'
            }`}>
              Try expanding your search query or toggling off specific filters like "Open Now" or "Under ₹200".
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="px-4 py-2 rounded-xl bg-[#FF9418] text-[#101827] font-bold text-xs border-2 border-[#101827]"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            
            {/* Split View on Large Screens */}
            {foodViewMode === 'split' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left: Scrollable List of Venue Cards */}
                <div className="lg:col-span-7 xl:col-span-7 space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono text-[#8F9CAE] px-1">
                    <span>Showing {filteredVenues.length} verified venues</span>
                    <span>Click any venue for verification dossier &amp; hours</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredVenues.map((venue) => (
                      <FoodVenueCard
                        key={venue.id}
                        venue={venue}
                        onSelect={(v) => setSelectedFoodVenueId(v.id)}
                        isSelected={selectedFoodVenueId === venue.id}
                      />
                    ))}
                  </div>
                </div>

                {/* Right: Sticky Interactive Leaflet Map on Desktop */}
                <div className="hidden lg:block lg:col-span-5 xl:col-span-5 sticky top-20 h-[calc(100vh-6rem)]">
                  <FoodSplitMap
                    venues={filteredVenues}
                    selectedVenue={selectedVenue}
                    onSelectVenue={(v) => setSelectedFoodVenueId(v.id)}
                  />
                </div>
              </div>
            )}

            {/* List Only View */}
            {foodViewMode === 'list' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-mono text-[#8F9CAE] px-1">
                  <span>Showing {filteredVenues.length} verified venues</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredVenues.map((venue) => (
                    <FoodVenueCard
                      key={venue.id}
                      venue={venue}
                      onSelect={(v) => setSelectedFoodVenueId(v.id)}
                      isSelected={selectedFoodVenueId === venue.id}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Map Only View */}
            {foodViewMode === 'map' && (
              <div className="h-[75vh] w-full">
                <FoodSplitMap
                  venues={filteredVenues}
                  selectedVenue={selectedVenue}
                  onSelectVenue={(v) => setSelectedFoodVenueId(v.id)}
                />
              </div>
            )}
          </div>
        )}
      </section>

      {/* Slide-over / Bottom Sheet Venue Details Drawer */}
      <FoodVenueDrawer
        venue={selectedVenue}
        onClose={() => setSelectedFoodVenueId(null)}
      />

      {/* Multi-Stop Food Crawl Planner Modal */}
      <FoodCrawlPlannerModal />

      {/* Report Closure or Incorrect Details Modal */}
      <ReportClosureModal />
    </div>
  );
};
