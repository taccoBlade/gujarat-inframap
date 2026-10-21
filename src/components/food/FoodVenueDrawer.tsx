import React, { useMemo, useState } from 'react';
import { VerifiedFoodVenue } from '../../types/food';
import { evaluateVenueOpenStatus } from '../../utils/opening-hours';
import { getFoodFallbackPhoto } from '../../utils/food-photos';
import { useAtlasStore } from '../../stores/useAtlasStore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  MapPin, 
  Clock, 
  ExternalLink, 
  Star, 
  Navigation, 
  Footprints, 
  CheckCircle2, 
  AlertTriangle, 
  Flag, 
  Share2, 
  Copy, 
  Check, 
  ShieldCheck,
  Building2,
  Store,
  Trees,
  Utensils,
  Coffee,
  Moon,
  Sparkles,
  Wallet
} from 'lucide-react';

interface FoodVenueDrawerProps {
  venue: VerifiedFoodVenue | null;
  onClose: () => void;
}

export const FoodVenueDrawer: React.FC<FoodVenueDrawerProps> = ({ venue, onClose }) => {
  const { 
    theme, 
    favouriteFoodVenueIds, 
    toggleFavouriteFoodVenue, 
    foodCrawlVenueIds, 
    addToFoodCrawl, 
    removeFromFoodCrawl,
    openReportClosureModal
  } = useAtlasStore();

  const [copied, setCopied] = useState(false);
  const [shareToast, setShareToast] = useState(false);

  if (!venue) return null;

  const isFavourite = favouriteFoodVenueIds.includes(venue.id);
  const isInCrawl = foodCrawlVenueIds.includes(venue.id);

  const openStatus = evaluateVenueOpenStatus(venue.opening_hours, venue.status);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(`${venue.name}, ${venue.branch}, ${venue.address}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${venue.name} — Gujarat InfraMap`,
        text: `Check out ${venue.name} (${venue.branch}) in ${venue.city}!`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${venue.name} (${venue.branch}), ${venue.city}: ${venue.address}`);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2500);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1400] flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        />

        {/* Responsive Drawer Sheet: Bottom sheet on mobile, slide-over on desktop */}
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className={`relative z-10 w-full sm:max-w-lg md:max-w-xl h-[88vh] sm:h-full flex flex-col justify-between mt-auto sm:mt-0 rounded-t-3xl sm:rounded-none sm:rounded-l-3xl border-t-2 sm:border-t-0 sm:border-l-2 shadow-2xl overflow-hidden ${
            theme === 'dark' 
              ? 'bg-[#101827] border-[#25324A] text-[#F1E8D7]' 
              : 'bg-[#FAF6ED] border-[#25324A] text-[#101827]'
          }`}
        >
          {/* Mobile Sheet Drag Handle */}
          <div className="sm:hidden w-full pt-3 pb-1 flex justify-center">
            <div className="w-12 h-1.5 rounded-full bg-neutral-500/40" />
          </div>

          {/* Drawer Scrollable Content */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 space-y-6">
            
            {/* Top Close & Share Bar */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-lg bg-[#FF9418]/15 border border-[#FF9418]/40 text-[#FF9418] font-mono font-bold text-xs uppercase tracking-wider">
                  {venue.city}
                </span>
                <span className={`px-2.5 py-0.5 rounded-lg border text-xs font-semibold ${
                  venue.entity_type === 'food_street_precinct'
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                    : venue.entity_type === 'public_space'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                      : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                }`}>
                  {venue.entity_type === 'food_street_precinct' ? 'Food Street / Precinct' : venue.entity_type === 'public_space' ? 'Public Space / Waterfront' : 'Individual Business'}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleShare}
                  className={`p-2 rounded-xl border-2 transition-all ${
                    theme === 'dark'
                      ? 'bg-[#151F30] border-[#25324A] text-[#F1E8D7] hover:border-[#FF9418]'
                      : 'bg-[#F1E8D7] border-[#25324A] text-[#101827] hover:border-[#FF9418]'
                  }`}
                  title="Share venue"
                  aria-label="Share"
                >
                  <Share2 className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className={`p-2 rounded-xl border-2 transition-all ${
                    theme === 'dark'
                      ? 'bg-[#151F30] border-[#25324A] text-[#F1E8D7] hover:border-red-500'
                      : 'bg-[#F1E8D7] border-[#25324A] text-[#101827] hover:border-red-500'
                  }`}
                  title="Close details"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Photo Banner with Neo-Brutalist Frame */}
            <div className="relative rounded-2xl border-2 border-[#25324A] overflow-hidden h-52 sm:h-64 shadow-[4px_4px_0px_#101827] bg-gradient-to-br from-[#151F30] to-[#101827]">
              <img
                src={venue.photo_url || getFoodFallbackPhoto(venue.city, venue.category)}
                alt={venue.name}
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
                onError={(e) => {
                  const target = e.currentTarget;
                  const fallback = getFoodFallbackPhoto(venue.city, venue.category);
                  if (target.src !== fallback) {
                    target.src = fallback;
                  } else {
                    target.src = '/images/destinations/manek-chowk-food-night.jpg';
                  }
                }}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
              
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2 z-10">
                <div>
                  <h2 className="text-xl sm:text-2xl font-editorial font-bold text-white drop-shadow-md">
                    {venue.name}
                  </h2>
                  <p className="text-sm font-medium text-white/80">
                    {venue.branch}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-black/80 backdrop-blur-md border border-emerald-500/50 text-emerald-300 font-mono text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Verified</span>
                </div>
              </div>
            </div>

            {/* Live Operational Status Banner */}
            <div className={`p-4 rounded-2xl border-2 flex items-start gap-3 ${
              openStatus.statusColor === 'green'
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                : openStatus.statusColor === 'amber'
                  ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                  : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
            }`}>
              <div className="pt-0.5">
                <Clock className="w-5 h-5 flex-shrink-0" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    openStatus.statusColor === 'green'
                      ? 'bg-emerald-400 animate-pulse'
                      : openStatus.statusColor === 'amber'
                        ? 'bg-amber-400'
                        : 'bg-rose-400'
                  }`} />
                  <span className="font-bold text-sm sm:text-base">{openStatus.badgeText}</span>
                </div>
                <p className="text-xs opacity-90 leading-relaxed">
                  {venue.opening_hours}
                </p>
                {openStatus.disclaimer && (
                  <p className="text-[11px] font-mono text-amber-400/90 pt-1">
                    ℹ️ {openStatus.disclaimer}
                  </p>
                )}
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* Pricing Box */}
              <div className={`p-3.5 rounded-2xl border-2 ${
                theme === 'dark' ? 'bg-[#151F30] border-[#25324A]' : 'bg-[#F1E8D7] border-[#25324A]'
              }`}>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#FF9418] font-bold block mb-1">
                  Estimated Cost
                </span>
                <p className="font-bold text-xs sm:text-sm line-clamp-2">
                  {venue.price_range}
                </p>
              </div>

              {/* Vegetarian Options Box */}
              <div className={`p-3.5 rounded-2xl border-2 ${
                theme === 'dark' ? 'bg-[#151F30] border-[#25324A]' : 'bg-[#F1E8D7] border-[#25324A]'
              }`}>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#10B981] font-bold block mb-1">
                  Vegetarian Standard
                </span>
                <p className="font-bold text-xs sm:text-sm line-clamp-2">
                  {venue.vegetarian}
                </p>
              </div>
            </div>

            {/* Address & Navigation Box */}
            <div className={`p-4 rounded-2xl border-2 space-y-3 ${
              theme === 'dark' ? 'bg-[#151F30] border-[#25324A]' : 'bg-[#F1E8D7] border-[#25324A]'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#FF9418] uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Exact Address &amp; Coordinates</span>
                </span>
                <button
                  type="button"
                  onClick={handleCopyAddress}
                  className="flex items-center gap-1 text-[11px] font-mono text-blue-400 hover:underline"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <p className={`text-xs sm:text-sm leading-relaxed ${
                theme === 'dark' ? 'text-[#F1E8D7]' : 'text-[#101827]'
              }`}>
                {venue.address}
              </p>

              <div className="flex items-center gap-2 pt-1 font-mono text-xs opacity-75">
                <span>Lat: {venue.latitude.toFixed(4)}</span>
                <span>•</span>
                <span>Lng: {venue.longitude.toFixed(4)}</span>
              </div>

              <a
                href={venue.google_maps_url || `https://www.google.com/maps/dir/?api=1&destination=${venue.latitude},${venue.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#25324A] hover:bg-[#1E293B] text-white font-bold text-xs border-2 border-[#101827] shadow-[2px_2px_0px_#101827] transition-all"
              >
                <Navigation className="w-4 h-4 text-[#FF9418]" />
                <span>Open Directions in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Verification Dossier & Evidence */}
            <div className={`p-4 rounded-2xl border-2 space-y-3 ${
              theme === 'dark' ? 'bg-[#151F30] border-[#25324A]' : 'bg-[#F1E8D7] border-[#25324A]'
            }`}>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Strict Verification Dossier</span>
              </div>

              <p className="text-xs leading-relaxed opacity-90">
                {venue.verification_notes}
              </p>

              <div className="pt-2 border-t border-[#25324A]/40 flex flex-col gap-1.5 text-xs">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="opacity-70">Last Verified Date:</span>
                  <span className="font-bold text-[#FF9418]">{venue.last_verified}</span>
                </div>

                <div className="text-[11px] font-mono pt-1">
                  <span className="opacity-70 block mb-1">Authoritative Source Links:</span>
                  <div className="space-y-1">
                    {venue.source_urls.map((url, i) => (
                      <a
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-blue-400 hover:underline truncate max-w-full"
                      >
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{url}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Community Issue & Closure Reporting Action */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => openReportClosureModal(venue)}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-xs font-semibold transition-all ${
                  theme === 'dark'
                    ? 'bg-[#101827] hover:bg-rose-950/30 border-[#25324A] text-rose-400'
                    : 'bg-white hover:bg-rose-50 border-[#25324A] text-rose-600'
                }`}
              >
                <Flag className="w-3.5 h-3.5" />
                <span>Report Permanent Closure or Incorrect Timing</span>
              </button>
            </div>
          </div>

          {/* Sticky Bottom Drawer Action Footer */}
          <div className={`p-4 border-t-2 flex items-center justify-between gap-3 ${
            theme === 'dark' ? 'bg-[#151F30] border-[#25324A]' : 'bg-[#F1E8D7] border-[#25324A]'
          }`}>
            <button
              type="button"
              onClick={() => toggleFavouriteFoodVenue(venue.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border-2 text-xs font-bold transition-all ${
                isFavourite
                  ? 'bg-[#FF9418] text-[#101827] border-[#101827] shadow-[2px_2px_0px_#101827]'
                  : 'bg-[#25324A] text-white hover:bg-[#1E293B] border-[#101827]'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${isFavourite ? 'fill-[#101827]' : ''}`} />
              <span>{isFavourite ? 'Saved in Favourites' : 'Save Favourite'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (isInCrawl) {
                  removeFromFoodCrawl(venue.id);
                } else {
                  addToFoodCrawl(venue.id);
                }
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border-2 text-xs font-black transition-all ${
                isInCrawl
                  ? 'bg-[#1C6555] text-white border-[#101827] shadow-[2px_2px_0px_#101827]'
                  : 'bg-[#FF9418] hover:bg-[#e07f10] text-[#101827] border-[#101827] shadow-[2px_2px_0px_#101827]'
              }`}
            >
              <Footprints className="w-3.5 h-3.5" />
              <span>{isInCrawl ? 'Remove from Crawl' : 'Add to Food Crawl'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
