import React from 'react';
import { useAtlasStore } from '../../stores/useAtlasStore';
import { VERIFIED_FOOD_VENUES } from '../../data/food-venues-data';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Footprints, 
  Navigation, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  ExternalLink, 
  Compass, 
  Share2,
  CheckCircle2,
  MapPin
} from 'lucide-react';

export const FoodCrawlPlannerModal: React.FC = () => {
  const { 
    isFoodCrawlModalOpen, 
    setFoodCrawlModalOpen, 
    foodCrawlVenueIds, 
    removeFromFoodCrawl, 
    reorderFoodCrawl, 
    clearFoodCrawl,
    setSelectedFoodVenueId,
    theme 
  } = useAtlasStore();

  if (!isFoodCrawlModalOpen) return null;

  const crawlVenues = foodCrawlVenueIds
    .map(id => VERIFIED_FOOD_VENUES.find(v => v.id === id))
    .filter((v): v is typeof VERIFIED_FOOD_VENUES[0] => Boolean(v));

  // Build multi-stop Google Maps URL
  // e.g. https://www.google.com/maps/dir/lat1,lng1/lat2,lng2/lat3,lng3
  const multiStopGoogleMapsUrl = crawlVenues.length > 0
    ? `https://www.google.com/maps/dir/${crawlVenues.map(v => `${v.latitude},${v.longitude}`).join('/')}`
    : '#';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1500] flex items-center justify-center p-3 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setFoodCrawlModalOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className={`relative z-10 w-full max-w-2xl max-h-[85vh] flex flex-col rounded-3xl border-2 shadow-[6px_6px_0px_#101827] overflow-hidden ${
            theme === 'dark' 
              ? 'bg-[#101827] border-[#25324A] text-[#F1E8D7]' 
              : 'bg-[#FAF6ED] border-[#25324A] text-[#101827]'
          }`}
        >
          {/* Header */}
          <div className={`p-4 sm:p-5 border-b-2 flex items-center justify-between gap-3 ${
            theme === 'dark' ? 'bg-[#151F30] border-[#25324A]' : 'bg-[#F1E8D7] border-[#25324A]'
          }`}>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#1C6555] border-2 border-[#101827] flex items-center justify-center text-white shadow-[2px_2px_0px_#101827]">
                <Footprints className="w-5 h-5 text-[#FF9418]" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-editorial font-bold">
                  My Food &amp; Night Crawl
                </h2>
                <p className="text-xs font-mono text-[#FF9418]">
                  {crawlVenues.length} {crawlVenues.length === 1 ? 'Stop Selected' : 'Stops Selected'} • Multi-Stop Itinerary
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setFoodCrawlModalOpen(false)}
              className={`p-2 rounded-xl border-2 transition-all ${
                theme === 'dark'
                  ? 'bg-[#101827] border-[#25324A] text-white hover:border-red-500'
                  : 'bg-white border-[#25324A] text-[#101827] hover:border-red-500'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {crawlVenues.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-[#FF9418]/10 border-2 border-[#FF9418]/30 flex items-center justify-center text-[#FF9418]">
                  <Compass className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold font-editorial">
                  Your Food Crawl Itinerary is Empty
                </h3>
                <p className={`text-xs max-w-sm mx-auto leading-relaxed ${
                  theme === 'dark' ? 'text-[#8F9CAE]' : 'text-[#606F7B]'
                }`}>
                  Browse venues in Ahmedabad, Vadodara, or Surat and click <strong>“+ Crawl”</strong> on any card to build your multi-stop night trail!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className={`text-xs ${
                  theme === 'dark' ? 'text-[#8F9CAE]' : 'text-[#606F7B]'
                }`}>
                  Organize your evening crawl in sequential order. Reorder stops or launch directly as a turnkey Google Maps multi-point navigation route:
                </p>

                <div className="space-y-2.5">
                  {crawlVenues.map((venue, index) => (
                    <div
                      key={venue.id}
                      className={`p-3.5 rounded-2xl border-2 flex items-center justify-between gap-3 transition-all ${
                        theme === 'dark' 
                          ? 'bg-[#151F30] border-[#25324A] hover:border-[#FF9418]/50' 
                          : 'bg-[#F1E8D7] border-[#25324A] hover:border-[#FF9418]/50'
                      }`}
                    >
                      {/* Left: Number & Photo */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-[#FF9418] border-2 border-[#101827] font-black text-xs text-[#101827] flex items-center justify-center flex-shrink-0 shadow-[2px_2px_0px_#101827]">
                          #{index + 1}
                        </div>

                        <img
                          src={venue.photo_url || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'}
                          alt={venue.name}
                          className="w-12 h-12 rounded-xl object-cover border border-[#25324A] flex-shrink-0"
                        />

                        <div className="min-w-0">
                          <h4 
                            onClick={() => {
                              setSelectedFoodVenueId(venue.id);
                              setFoodCrawlModalOpen(false);
                            }}
                            className="font-bold text-sm truncate cursor-pointer hover:text-[#FF9418] transition-colors"
                          >
                            {venue.name}
                          </h4>
                          <p className={`text-xs truncate ${
                            theme === 'dark' ? 'text-[#8F9CAE]' : 'text-[#606F7B]'
                          }`}>
                            {venue.area} • {venue.city}
                          </p>
                        </div>
                      </div>

                      {/* Right: Reorder & Remove Actions */}
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {/* Move Up */}
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => reorderFoodCrawl(index, index - 1)}
                          className="p-1.5 rounded-lg border text-xs disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black/10"
                          title="Move earlier in itinerary"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>

                        {/* Move Down */}
                        <button
                          type="button"
                          disabled={index === crawlVenues.length - 1}
                          onClick={() => reorderFoodCrawl(index, index + 1)}
                          className="p-1.5 rounded-lg border text-xs disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black/10"
                          title="Move later in itinerary"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>

                        {/* Remove from crawl */}
                        <button
                          type="button"
                          onClick={() => removeFromFoodCrawl(venue.id)}
                          className="p-1.5 rounded-lg border border-red-500/30 text-rose-500 hover:bg-rose-500/10 ml-1"
                          title="Remove from crawl"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          {crawlVenues.length > 0 && (
            <div className={`p-4 border-t-2 flex flex-col sm:flex-row items-center justify-between gap-3 ${
              theme === 'dark' ? 'bg-[#151F30] border-[#25324A]' : 'bg-[#F1E8D7] border-[#25324A]'
            }`}>
              <button
                type="button"
                onClick={clearFoodCrawl}
                className="text-xs text-rose-400 hover:underline font-mono"
              >
                Clear all stops
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <a
                  href={multiStopGoogleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF9418] hover:bg-[#e07f10] text-[#101827] font-black text-xs border-2 border-[#101827] shadow-[2px_2px_0px_#101827] active:translate-x-0.5 active:translate-y-0.5 transition-all"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Open Route in Google Maps ({crawlVenues.length} Stops)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
