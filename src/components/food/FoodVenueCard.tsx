import React, { useMemo } from 'react';
import { VerifiedFoodVenue } from '../../types/food';
import { evaluateVenueOpenStatus } from '../../utils/opening-hours';
import { getFoodFallbackPhoto } from '../../utils/food-photos';
import { useAtlasStore } from '../../stores/useAtlasStore';
import { 
  MapPin, 
  Clock, 
  ExternalLink, 
  Star, 
  Navigation, 
  Footprints, 
  Sparkles, 
  Utensils, 
  Coffee, 
  Moon, 
  Trees, 
  Wallet,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Store,
  Compass
} from 'lucide-react';

interface FoodVenueCardProps {
  venue: VerifiedFoodVenue;
  onSelect: (venue: VerifiedFoodVenue) => void;
  isSelected?: boolean;
}

export const FoodVenueCard: React.FC<FoodVenueCardProps> = ({ venue, onSelect, isSelected = false }) => {
  const { 
    favouriteFoodVenueIds, 
    toggleFavouriteFoodVenue, 
    foodCrawlVenueIds, 
    addToFoodCrawl, 
    removeFromFoodCrawl, 
    theme 
  } = useAtlasStore();

  const isFavourite = favouriteFoodVenueIds.includes(venue.id);
  const isInCrawl = foodCrawlVenueIds.includes(venue.id);
  const crawlIndex = foodCrawlVenueIds.indexOf(venue.id);

  const openStatus = useMemo(() => {
    return evaluateVenueOpenStatus(venue.opening_hours, venue.status);
  }, [venue.opening_hours, venue.status]);

  const categoryIcon = useMemo(() => {
    switch (venue.category) {
      case 'Street food & local favourites':
        return <Utensils className="w-3.5 h-3.5 text-[#FF9418]" />;
      case 'Cafés & coffee spots':
        return <Coffee className="w-3.5 h-3.5 text-[#D97706]" />;
      case 'Late-night food':
        return <Moon className="w-3.5 h-3.5 text-[#818CF8]" />;
      case 'Night-out destinations and hangout spots':
        return <Sparkles className="w-3.5 h-3.5 text-[#EC4899]" />;
      case 'Evening walks, waterfronts and public spaces':
        return <Trees className="w-3.5 h-3.5 text-[#10B981]" />;
      case 'Budget-friendly places for students':
        return <Wallet className="w-3.5 h-3.5 text-[#10B981]" />;
      default:
        return <Compass className="w-3.5 h-3.5 text-[#FF9418]" />;
    }
  }, [venue.category]);

  const entityTypeLabel = useMemo(() => {
    switch (venue.entity_type) {
      case 'food_street_precinct':
        return { label: 'Food Street / Precinct', icon: <Store className="w-3 h-3" />, color: 'bg-amber-500/10 text-amber-500 border-amber-500/30' };
      case 'public_space':
        return { label: 'Public Waterfront / Walk', icon: <Trees className="w-3 h-3" />, color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' };
      default:
        return { label: 'Individual Venue', icon: <Building2 className="w-3 h-3" />, color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' };
    }
  }, [venue.entity_type]);

  const isPureVeg = useMemo(() => {
    const v = venue.vegetarian.toLowerCase();
    return v.includes('pure vegetarian') || v.includes('100% pure veg') || v.includes('100% vegetarian');
  }, [venue.vegetarian]);

  const isStudentBudget = useMemo(() => {
    return venue.price_range.toLowerCase().includes('under ₹200');
  }, [venue.price_range]);

  return (
    <article
      onClick={() => onSelect(venue)}
      className={`group relative rounded-2xl border-2 transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between ${
        isSelected
          ? 'border-[#FF9418] shadow-[4px_4px_0px_#FF9418] -translate-y-0.5'
          : theme === 'dark'
            ? 'bg-[#151F30] border-[#25324A] hover:border-[#FF9418]/60 shadow-[3px_3px_0px_#101827] hover:shadow-[5px_5px_0px_#101827]'
            : 'bg-[#FAF6ED] border-[#25324A] hover:border-[#FF9418]/60 shadow-[3px_3px_0px_#25324A] hover:shadow-[5px_5px_0px_#25324A]'
      }`}
    >
      {/* Top Media & Tags Header */}
      <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-gradient-to-br from-[#151F30] to-[#101827]">
        <img
          src={venue.photo_url || getFoodFallbackPhoto(venue.city, venue.category)}
          alt={venue.name}
          loading="lazy"
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
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20" />

        {/* Top Badges Floating Header */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5 z-10">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* City Tag */}
            <span className="px-2 py-0.5 rounded-md bg-[#101827]/90 backdrop-blur-md border border-[#FF9418]/40 text-[#FF9418] font-mono font-bold text-[10px] tracking-wide uppercase">
              {venue.city}
            </span>

            {/* Entity Type Tag */}
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md backdrop-blur-md border text-[10px] font-semibold ${entityTypeLabel.color}`}>
              {entityTypeLabel.icon}
              <span className="hidden xs:inline">{entityTypeLabel.label}</span>
            </span>
          </div>

          {/* Favourite Bookmark Toggle Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavouriteFoodVenue(venue.id);
            }}
            className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${
              isFavourite
                ? 'bg-[#FF9418] border-[#101827] text-[#101827] shadow-[2px_2px_0px_#101827]'
                : 'bg-[#101827]/80 hover:bg-[#101827] border-[#25324A] text-white/80 hover:text-white'
            }`}
            title={isFavourite ? 'Saved in Favourites' : 'Save to Favourites'}
            aria-label="Toggle favourite"
          >
            <Star className={`w-4 h-4 ${isFavourite ? 'fill-[#101827]' : ''}`} />
          </button>
        </div>

        {/* Bottom Floating Status & Category Bar on Image */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between gap-2 z-10">
          {/* Real-time Open Status Indicator */}
          <div className="flex items-center gap-1.5">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg backdrop-blur-md border text-xs font-bold tracking-tight shadow-sm ${
              openStatus.statusColor === 'green'
                ? 'bg-emerald-950/85 border-emerald-500/50 text-emerald-300'
                : openStatus.statusColor === 'amber'
                  ? 'bg-amber-950/85 border-amber-500/50 text-amber-300'
                  : 'bg-rose-950/85 border-rose-500/50 text-rose-300'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                openStatus.statusColor === 'green'
                  ? 'bg-emerald-400 animate-pulse'
                  : openStatus.statusColor === 'amber'
                    ? 'bg-amber-400'
                    : 'bg-rose-400'
              }`} />
              <span>{openStatus.badgeText}</span>
            </span>
          </div>

          {/* Verified Badge */}
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#101827]/90 border border-emerald-500/40 text-emerald-400 font-mono text-[10px] font-semibold">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Verified</span>
          </div>
        </div>
      </div>

      {/* Content Details */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between gap-3">
        <div className="space-y-2">
          {/* Category & Area */}
          <div className="flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 font-medium text-[#FF9418]">
              {categoryIcon}
              <span className="truncate max-w-[210px]">{venue.category}</span>
            </div>
            <span className={`font-mono text-[11px] truncate max-w-[120px] ${
              theme === 'dark' ? 'text-[#8F9CAE]' : 'text-[#606F7B]'
            }`}>
              {venue.area}
            </span>
          </div>

          {/* Venue Name & Branch */}
          <div>
            <h3 className={`font-editorial font-bold text-base sm:text-lg leading-snug line-clamp-1 ${
              theme === 'dark' ? 'text-white' : 'text-[#101827]'
            }`}>
              {venue.name}
            </h3>
            <p className={`text-xs font-medium truncate ${
              theme === 'dark' ? 'text-[#8F9CAE]' : 'text-[#606F7B]'
            }`}>
              {venue.branch}
            </p>
          </div>

          {/* Pricing & Veg Highlights */}
          <div className="flex items-center gap-2 flex-wrap pt-0.5">
            {isPureVeg ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-[11px] font-bold">
                <span className="w-2 h-2 rounded-full border border-emerald-500 flex items-center justify-center p-0.5">
                  <span className="w-1 h-1 rounded-full bg-emerald-500" />
                </span>
                Pure Veg
              </span>
            ) : (
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[11px] font-medium ${
                theme === 'dark' ? 'bg-[#101827] border-[#25324A] text-[#8F9CAE]' : 'bg-[#E8DCCB] border-[#25324A]/30 text-[#606F7B]'
              }`}>
                Veg &amp; Non-Veg Options
              </span>
            )}

            {isStudentBudget && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#FF9418]/15 border border-[#FF9418]/40 text-[#FF9418] text-[11px] font-mono font-bold">
                Under ₹200
              </span>
            )}

            {venue.late_night && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[11px] font-medium">
                🌙 Open Late
              </span>
            )}
          </div>

          {/* Notes Snippet */}
          <p className={`text-xs line-clamp-2 leading-relaxed ${
            theme === 'dark' ? 'text-[#8F9CAE]' : 'text-[#606F7B]'
          }`}>
            {venue.verification_notes}
          </p>
        </div>

        {/* Card Footer Actions */}
        <div className={`pt-3 border-t flex items-center justify-between gap-2 ${
          theme === 'dark' ? 'border-[#25324A]' : 'border-[#25324A]/20'
        }`}>
          {/* Add to Food Crawl Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (isInCrawl) {
                removeFromFoodCrawl(venue.id);
              } else {
                addToFoodCrawl(venue.id);
              }
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border-2 text-xs font-bold transition-all ${
              isInCrawl
                ? 'bg-[#1C6555] border-[#101827] text-white shadow-[2px_2px_0px_#101827]'
                : theme === 'dark'
                  ? 'bg-[#101827] hover:bg-[#1C6555]/20 border-[#25324A] text-[#F1E8D7]'
                  : 'bg-white hover:bg-[#1C6555]/10 border-[#25324A] text-[#101827]'
            }`}
            title={isInCrawl ? 'Remove from Food Crawl' : 'Add to Food Crawl itinerary'}
          >
            <Footprints className="w-3.5 h-3.5 text-[#FF9418]" />
            <span>{isInCrawl ? `Stop #${crawlIndex + 1}` : '+ Crawl'}</span>
          </button>

          {/* Direct Google Maps Navigation Link */}
          <div className="flex items-center gap-1.5">
            <a
              href={venue.google_maps_url || `https://www.google.com/maps/dir/?api=1&destination=${venue.latitude},${venue.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className={`p-2 rounded-xl border-2 flex items-center justify-center transition-all ${
                theme === 'dark'
                  ? 'bg-[#101827] hover:bg-[#151F30] border-[#25324A] text-[#FF9418]'
                  : 'bg-white hover:bg-[#FAF6ED] border-[#25324A] text-[#FF9418]'
              }`}
              title="Open directions in Google Maps"
              aria-label="Get directions in Google Maps"
            >
              <Navigation className="w-3.5 h-3.5" />
            </a>

            {/* View Details Button */}
            <button
              type="button"
              onClick={() => onSelect(venue)}
              className="px-3 py-1.5 rounded-xl bg-[#FF9418] hover:bg-[#e07f10] text-[#101827] font-black text-xs border-2 border-[#101827] shadow-[2px_2px_0px_#101827] active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              Details
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
