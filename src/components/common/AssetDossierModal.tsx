import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAtlasStore } from '../../stores/useAtlasStore';
import { getRegionalCulture } from '../../utils/cultural-regions';
import { getDistrictPhoto } from '../../utils/district-photos';
import { ToranOrnamentalBorder } from '../cultural/GujaratiPatterns';
import { 
  X, 
  MapPin, 
  Navigation, 
  Clock, 
  Ticket, 
  Calendar, 
  ShieldCheck, 
  Bookmark, 
  BookmarkCheck, 
  ExternalLink, 
  Sparkles, 
  Award,
  CheckCircle2,
  Info,
  ShieldAlert,
  Share2
} from 'lucide-react';

export const AssetDossierModal: React.FC = () => {
  const { 
    activeDossierAsset, 
    setActiveDossierAsset, 
    theme, 
    userProfile, 
    claimDistrictStamp, 
    saveLocation,
    toggleBookmark,
    setShareModalOpen
  } = useAtlasStore();

  if (!activeDossierAsset) return null;

  const asset = activeDossierAsset;
  const isDestination = asset.type === 'destination' || asset.highlights;
  const isStory = asset.type === 'story' || asset.theFolklore;
  const isInfra = asset.type === 'infra' || asset.operationalStatus;

  const districtName = asset.district || 'Gujarat';
  const culture = getRegionalCulture(districtName);
  const isSaved = (userProfile.savedLocations || []).some(l => l.name === asset.name);
  const isBookmarked = (userProfile.bookmarkedStoryIds || []).includes(asset.id);
  const isStamped = userProfile.collectedStampIds.includes(districtName.toLowerCase().replace(/\s+/g, '-'));

  const coords = asset.coordinates || [22.40, 71.80];
  const lat = Array.isArray(coords) ? (typeof coords[0] === 'number' && coords[0] < 30 ? coords[0] : coords[1]) : 22.40;
  const lng = Array.isArray(coords) ? (typeof coords[0] === 'number' && coords[0] < 30 ? coords[1] : coords[0]) : 71.80;

  const photoUrl = asset.image || asset.imageUrl || asset.imgUrl || getDistrictPhoto(districtName, asset.id);

  const handleSaveLocation = () => {
    saveLocation({
      name: asset.name,
      lat,
      lng,
      category: isDestination ? 'Verified Destination' : isStory ? 'Unfiltered Dossier' : 'Infrastructure Project',
      notes: asset.summary || asset.tagline
    });
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-[1200] flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto"
        onClick={() => setActiveDossierAsset(null)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
          className={`relative w-full max-w-3xl rounded-2xl border-2 overflow-hidden shadow-[8px_8px_0px_#101827] my-auto ${
            theme === 'dark' ? 'bg-[#151F30] border-[#25324A] text-[#F1E8D7]' : 'bg-[#FAF6ED] border-[#25324A] text-[#101827]'
          }`}
        >
          {/* Top Decorative Toran Trim */}
          <ToranOrnamentalBorder height={10} />

          {/* Close Button */}
          <button
            onClick={() => setActiveDossierAsset(null)}
            className="absolute top-4 right-4 z-30 p-2 rounded-xl bg-[#101827]/80 hover:bg-[#101827] text-white border-2 border-[#25324A] shadow-[2px_2px_0px_#101827] active:translate-x-0.5 active:translate-y-0.5 transition-all"
            aria-label="Close dossier"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Hero Photographic Banner */}
          <div className="relative aspect-[16/8] sm:aspect-[16/7] w-full overflow-hidden border-b-2 border-[#25324A] bg-[#101827]">
            <img
              src={photoUrl}
              alt={asset.name}
              onError={(e) => {
                e.currentTarget.src = getDistrictPhoto(districtName, asset.id);
              }}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#151F30] via-black/30 to-black/40 pointer-events-none" />

            {/* Badges on Hero */}
            <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-[#101827]/90 text-[#FF9418] border border-[#FF9418]/40 font-mono text-[11px] font-bold">
                📍 {districtName} • {asset.region || culture.regionName}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[#FF9418] text-[#101827] border border-[#101827] font-mono text-[11px] font-black uppercase">
                {isDestination ? (asset.categoryLabel || 'ASI Verified') : isStory ? (asset.factCheckBadge || 'Oral Dossier') : 'Mega Project'}
              </span>
            </div>

            {/* Bottom Title on Hero */}
            <div className="absolute bottom-4 left-4 right-16 z-10">
              {asset.gujaratiName || asset.gujaratiTitle || culture.gujaratiTitle ? (
                <span className="text-xs sm:text-sm font-bold text-[#FF9418] font-['Noto_Sans_Gujarati'] block mb-0.5">
                  {asset.gujaratiName || asset.gujaratiTitle || culture.gujaratiTitle}
                </span>
              ) : null}
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white font-editorial leading-tight">
                {asset.name}
              </h2>
            </div>
          </div>

          {/* Dossier Body */}
          <div className="p-5 sm:p-7 space-y-6 max-h-[60vh] overflow-y-auto">
            
            {/* Cultural Region Tag */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#25324A]/60">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-bold ${culture.badgeBg} ${culture.textColor} border ${culture.badgeBorder}`}>
                {culture.primaryIcon} {culture.culturalTag}
              </span>

              {asset.coordinates && (
                <span className="text-xs font-mono text-[#8F9CAE] flex items-center gap-1">
                  🌐 GPS: {lat.toFixed(4)}°N, {lng.toFixed(4)}°E
                </span>
              )}
            </div>

            {/* Synopsis / Summary */}
            <div className="space-y-2">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF9418] flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                <span>Executive Archival Summary</span>
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed font-sans">
                {asset.summary || asset.theStory || asset.subtitle || asset.tagline}
              </p>
            </div>

            {/* For Stories: Oral Folklore vs Ground Reality Forensic Breakdown */}
            {isStory && (asset.theFolklore || asset.theGroundReality) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {asset.theFolklore && (
                  <div className="p-4 rounded-xl border-2 border-[#9D233B]/40 bg-[#9D233B]/10 space-y-1.5">
                    <span className="text-xs font-mono font-black text-[#9D233B] uppercase tracking-wider block">
                      📜 The Oral Folklore &amp; Local Legend
                    </span>
                    <p className="text-xs leading-relaxed text-[#F1E8D7]">
                      {asset.theFolklore}
                    </p>
                  </div>
                )}
                {asset.theGroundReality && (
                  <div className="p-4 rounded-xl border-2 border-[#1C6555]/40 bg-[#1C6555]/10 space-y-1.5">
                    <span className="text-xs font-mono font-black text-[#1C6555] uppercase tracking-wider block">
                      🔬 Scientific &amp; Forensic Ground Reality
                    </span>
                    <p className="text-xs leading-relaxed text-[#F1E8D7]">
                      {asset.theGroundReality}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Key Highlights (Destinations) */}
            {asset.highlights && Array.isArray(asset.highlights) && asset.highlights.length > 0 && (
              <div className="space-y-2.5">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF9418] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Key Curated Highlights</span>
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {asset.highlights.map((h: string, idx: number) => (
                    <div 
                      key={idx}
                      className={`p-2.5 rounded-xl border flex items-start gap-2.5 text-xs ${
                        theme === 'dark' ? 'bg-[#101827] border-[#25324A]' : 'bg-white border-[#25324A]'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#FF9418] flex-shrink-0 mt-0.5" />
                      <span className="leading-snug">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Practical Traveler Dossier Grid: Timings, Fees, Season, Duration */}
            {(asset.timings || asset.entryFee || asset.bestSeason || asset.recommendedDuration) && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {asset.timings && (
                  <div className={`p-3 rounded-xl border ${theme === 'dark' ? 'bg-[#101827] border-[#25324A]' : 'bg-white border-[#25324A]'}`}>
                    <span className="text-[10px] font-mono text-[#8F9CAE] block uppercase font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#FF9418]" /> Timings
                    </span>
                    <span className="text-xs font-bold block mt-1 leading-tight">{asset.timings.split('(')[0].trim()}</span>
                  </div>
                )}
                {asset.entryFee && (
                  <div className={`p-3 rounded-xl border ${theme === 'dark' ? 'bg-[#101827] border-[#25324A]' : 'bg-white border-[#25324A]'}`}>
                    <span className="text-[10px] font-mono text-[#8F9CAE] block uppercase font-bold flex items-center gap-1">
                      <Ticket className="w-3 h-3 text-[#1C6555]" /> Entry Fee
                    </span>
                    <span className="text-xs font-bold block mt-1 leading-tight">{asset.entryFee.split(';')[0].trim()}</span>
                  </div>
                )}
                {asset.bestSeason && (
                  <div className={`p-3 rounded-xl border ${theme === 'dark' ? 'bg-[#101827] border-[#25324A]' : 'bg-white border-[#25324A]'}`}>
                    <span className="text-[10px] font-mono text-[#8F9CAE] block uppercase font-bold flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#FF9418]" /> Best Season
                    </span>
                    <span className="text-xs font-bold block mt-1 leading-tight">{asset.bestSeason.split('(')[0].trim()}</span>
                  </div>
                )}
                {asset.recommendedDuration && (
                  <div className={`p-3 rounded-xl border ${theme === 'dark' ? 'bg-[#101827] border-[#25324A]' : 'bg-white border-[#25324A]'}`}>
                    <span className="text-[10px] font-mono text-[#8F9CAE] block uppercase font-bold flex items-center gap-1">
                      ⏳ Duration
                    </span>
                    <span className="text-xs font-bold block mt-1 leading-tight">{asset.recommendedDuration.split('(')[0].trim()}</span>
                  </div>
                )}
              </div>
            )}

            {/* Rules / Access Advisories */}
            {(asset.rulesRestrictions || asset.legalAccess) && (
              <div className={`p-3.5 rounded-xl border flex items-start gap-2.5 text-xs ${
                theme === 'dark' ? 'bg-[#101827]/60 border-[#25324A]' : 'bg-white border-[#25324A]'
              }`}>
                <ShieldAlert className="w-4 h-4 text-[#FF9418] flex-shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-mono font-bold uppercase text-[10px] text-[#8F9CAE]">Visitor Safety &amp; Access Advisory</span>
                  <p className="leading-relaxed">
                    {asset.rulesRestrictions || (typeof asset.legalAccess === 'object' ? asset.legalAccess?.rulesAndWarnings : asset.legalAccess)}
                  </p>
                </div>
              </div>
            )}

            {/* Official Provenance Link */}
            {(asset.sourceName || asset.sourceUrl || asset.officialRefUrl) && (
              <div className="pt-2 text-xs text-[#8F9CAE] flex items-center justify-between border-t border-[#25324A]/60">
                <span>Verified Source: <strong className="text-white">{asset.sourceName || asset.authority || 'Government Gazetteer'}</strong></span>
                {(asset.sourceUrl || asset.officialRefUrl) && (
                  <a 
                    href={asset.sourceUrl || asset.officialRefUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-[#FF9418] font-bold hover:underline flex items-center gap-1"
                  >
                    <span>Official Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            )}

          </div>

          {/* Action Footer Bar */}
          <div className="p-4 sm:p-5 border-t-2 border-[#25324A] bg-[#101827] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveLocation}
                className={`px-3 py-2 rounded-xl border-2 font-bold text-xs flex items-center gap-1.5 shadow-[2px_2px_0px_#101827] active:translate-x-0.5 active:translate-y-0.5 transition-all ${
                  isSaved
                    ? 'bg-[#1C6555] text-white border-[#101827]'
                    : 'bg-[#151F30] text-[#F1E8D7] border-[#25324A] hover:border-[#1C6555]'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5 text-[#10B981]" />
                <span>{isSaved ? '✓ Location Saved' : 'Save Location'}</span>
              </button>

              <button
                onClick={() => claimDistrictStamp(districtName.toLowerCase().replace(/\s+/g, '-'))}
                className={`px-3 py-2 rounded-xl border-2 font-bold text-xs flex items-center gap-1.5 shadow-[2px_2px_0px_#101827] active:translate-x-0.5 active:translate-y-0.5 transition-all ${
                  isStamped
                    ? 'bg-[#1C6555] text-white border-[#101827]'
                    : 'bg-[#FF9418] text-[#101827] border-[#101827] hover:bg-[#e07f10]'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>{isStamped ? '✓ District Stamped' : 'Stamp in Passport'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-[#00F0FF] hover:bg-[#00d0dd] text-[#101827] font-black text-xs flex items-center gap-1.5 shadow-[2px_2px_0px_#101827] border-2 border-[#101827] active:translate-x-0.5 active:translate-y-0.5 transition-all"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Get GPS Directions ↗</span>
              </a>

              <button
                onClick={() => {
                  setActiveDossierAsset(null);
                  setShareModalOpen(true);
                }}
                className="p-2 rounded-xl bg-[#151F30] text-[#F1E8D7] border-2 border-[#25324A] hover:border-[#FF9418] shadow-[2px_2px_0px_#101827]"
                title="Share Story Card"
              >
                <Share2 className="w-4 h-4 text-[#FF9418]" />
              </button>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
