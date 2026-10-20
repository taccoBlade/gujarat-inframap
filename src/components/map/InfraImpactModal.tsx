import React, { useState } from 'react';
import { 
  compute5KmInfraImpact, 
  ImpactScoreResult, 
  TRENDING_PIN_LOCALITIES 
} from '../../data/corridors-3d-data';
import { ToranOrnamentalBorder } from '../cultural/GujaratiPatterns';
import { 
  X, 
  MapPin, 
  Sparkles, 
  Train, 
  Zap, 
  Navigation, 
  Share2, 
  CheckCircle, 
  ArrowUpRight, 
  Building, 
  Copy,
  Clock,
  Layers
} from 'lucide-react';

interface InfraImpactModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'dark' | 'light';
  coordinates: [number, number];
  localityName?: string;
  onSelectLocality: (coords: [number, number], name: string) => void;
  onOpenExportSnapshot: (stats: any) => void;
}

export const InfraImpactModal: React.FC<InfraImpactModalProps> = ({
  isOpen,
  onClose,
  theme,
  coordinates,
  localityName = 'Dropped Pin Location',
  onSelectLocality,
  onOpenExportSnapshot
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const result: ImpactScoreResult = compute5KmInfraImpact(coordinates[0], coordinates[1]);

  const handleShare = () => {
    const text = `📍 ${localityName} scored ${result.score}/100 on Gujarat InfraMap! Found ${result.totalProjectsWithin5Km} upcoming mega-projects within 5 km. Check your locality: https://gujarat-inframap.vercel.app`;
    if (navigator.share) {
      navigator.share({ title: `Infra Impact Score: ${localityName}`, text, url: 'https://gujarat-inframap.vercel.app' }).catch(() => {});
    } else {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  const handleCopyLink = () => {
    const url = `https://gujarat-inframap.vercel.app/?pin=${coordinates[0]},${coordinates[1]}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className={`relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-2xl border-2 shadow-[8px_8px_0px_#101827] overflow-hidden ${
          theme === 'dark' ? 'bg-[#151F30] border-[#25324A] text-[#F1E8D7]' : 'bg-[#FAF6ED] border-[#25324A] text-[#101827]'
        }`}
      >
        {/* Cultural Toran Header Accent */}
        <ToranOrnamentalBorder className="w-full flex-shrink-0" height={8} />

        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b-2 border-[#25324A] flex items-center justify-between gap-4 flex-shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-md bg-[#FF9418]/20 text-[#FF9418] border border-[#FF9418]/40 text-[10px] font-mono font-bold uppercase tracking-wider">
                📍 5 km Spatial Radii Engine
              </span>
              <span className="text-[10px] font-mono text-[#8F9CAE]">
                Real Estate &amp; Infra Connectivity Score
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black font-editorial tracking-tight flex items-center gap-2">
              <span>5 km Infra Impact Score</span>
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl border-2 border-[#25324A] hover:border-[#FF9418] hover:text-[#FF9418] transition-colors"
            aria-label="Close impact score modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Trending Localities Quick Selector */}
        <div className="px-4 py-2.5 bg-[#101827]/60 border-b border-[#25324A] flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-shrink-0">
          <span className="text-[10px] font-mono font-bold text-[#8F9CAE] whitespace-nowrap pl-1">
            TRENDING:
          </span>
          {TRENDING_PIN_LOCALITIES.map((loc) => {
            const isCurrent = localityName.includes(loc.name);
            return (
              <button
                key={loc.name}
                onClick={() => onSelectLocality(loc.coords, `${loc.name}, ${loc.city}`)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-1 ${
                  isCurrent
                    ? 'bg-[#FF9418] text-[#101827] border-[#101827] shadow-sm font-black'
                    : 'bg-[#151F30] text-[#8F9CAE] border-[#25324A] hover:border-[#FF9418] hover:text-white'
                }`}
              >
                <span>{loc.name}</span>
                <span className="text-[9px] opacity-70">({loc.city.slice(0, 3)})</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          
          {/* Main Score Hero Card */}
          <div className="p-4 sm:p-5 rounded-xl border-2 border-[#FF9418] bg-gradient-to-br from-[#101827] via-[#151F30] to-[#101827] shadow-[4px_4px_0px_#101827]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#FF9418]" />
                  <span className="text-base sm:text-lg font-black font-editorial text-white">
                    {localityName}
                  </span>
                </div>
                <p className="text-xs font-mono text-[#8F9CAE]">
                  Coordinates: [{coordinates[0].toFixed(4)}, {coordinates[1].toFixed(4)}] • 5.0 km Buffer
                </p>
                <div className="pt-1">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/40">
                    🏆 {result.tier}
                  </span>
                </div>
              </div>

              {/* Big Score Gauge */}
              <div className="flex items-center gap-3 bg-[#101827]/90 px-4 py-2.5 rounded-xl border-2 border-[#25324A] self-start sm:self-auto">
                <div className="text-4xl sm:text-5xl font-black font-editorial text-[#FF9418] leading-none">
                  {result.score}
                </div>
                <div className="text-left font-mono">
                  <span className="text-xs text-[#8F9CAE] block font-bold leading-none">/ 100</span>
                  <span className="text-[10px] text-[#10B981] font-bold uppercase mt-1 block">
                    {result.totalProjectsWithin5Km} Projects &lt; 5km
                  </span>
                </div>
              </div>

            </div>

            {/* Score Breakdown Bars */}
            <div className="mt-4 pt-3 border-t border-[#25324A] grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-mono">
              <div className="p-2 rounded bg-black/30 border border-white/5">
                <span className="text-[#8F9CAE] text-[10px] block">Metro Transit</span>
                <span className="font-bold text-[#FF9418]">{result.scoreBreakdown.metroScore} / 35</span>
              </div>
              <div className="p-2 rounded bg-black/30 border border-white/5">
                <span className="text-[#8F9CAE] text-[10px] block">Highways &amp; Rings</span>
                <span className="font-bold text-[#00F0FF]">{result.scoreBreakdown.highwayScore} / 30</span>
              </div>
              <div className="p-2 rounded bg-black/30 border border-white/5">
                <span className="text-[#8F9CAE] text-[10px] block">Bullet Train / Air</span>
                <span className="font-bold text-[#10B981]">{result.scoreBreakdown.hsrScore} / 20</span>
              </div>
              <div className="p-2 rounded bg-black/30 border border-white/5">
                <span className="text-[#8F9CAE] text-[10px] block">Mega Industry</span>
                <span className="font-bold text-[#EC4899]">{result.scoreBreakdown.megaProjectScore} / 15</span>
              </div>
            </div>
          </div>

          {/* List of Infrastructure Projects within 5 km */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-black font-mono text-[#FF9418] uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>Catalytic Infrastructure Projects Within 5 km</span>
              </h3>
              <span className="text-[10px] font-mono text-[#8F9CAE]">
                Showing {result.assets.length} closest verified assets
              </span>
            </div>

            <div className="space-y-2">
              {result.assets.map(({ asset, distanceKm }) => {
                const isUnder5 = distanceKm <= 5.0;
                return (
                  <div
                    key={asset.id}
                    className={`p-3 rounded-xl border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isUnder5
                        ? 'bg-[#151F30]/90 border-[#25324A] hover:border-[#FF9418]'
                        : 'bg-[#101827]/60 border-[#25324A]/60 opacity-80'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-xs sm:text-sm text-white">
                          {asset.name}
                        </span>
                        <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                          asset.category === 'Metro Rail' ? 'bg-[#FF9418]/20 text-[#FF9418] border-[#FF9418]/40' :
                          asset.category === 'Bullet Train' ? 'bg-[#00F0FF]/20 text-[#00F0FF] border-[#00F0FF]/40' :
                          asset.category === 'Airport' ? 'bg-[#3B82F6]/20 text-[#3B82F6] border-[#3B82F6]/40' :
                          'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/40'
                        }`}>
                          {asset.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#8F9CAE]">
                        Agency: {asset.agency} • CapEx: {asset.capex}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center flex-shrink-0">
                      <div className="text-right font-mono">
                        <span className="text-sm font-black text-[#10B981] block">
                          {distanceKm} km
                        </span>
                        <span className="text-[9px] text-[#8F9CAE] block">
                          Est: {asset.completionYear.split(' ')[0]}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Modal Actions */}
        <div className="p-3 sm:p-4 border-t-2 border-[#25324A] bg-[#101827]/80 flex items-center justify-between gap-2 flex-wrap flex-shrink-0">
          <div className="text-[11px] font-mono text-[#8F9CAE] truncate">
            Formula calibrated to GMRC Metro &amp; NHSRCL master plan benchmarks
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-xl border-2 border-[#25324A] hover:border-[#FF9418] text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied!' : 'Copy Pin Link'}</span>
            </button>

            <button
              onClick={() => onOpenExportSnapshot({
                locality: localityName,
                impactScore: result.score,
                capex: result.assets[0]?.asset.capex || '₹12,000 Cr',
                completion: result.tier,
                agency: result.assets[0]?.asset.agency || 'GMRC / NHSRCL'
              })}
              className="px-3 py-1.5 rounded-xl bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/50 hover:bg-[#00F0FF]/30 text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Story Card</span>
            </button>

            <button
              onClick={handleShare}
              className="px-3.5 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-black font-black text-xs flex items-center gap-1.5 border border-[#101827] shadow-[2px_2px_0px_#101827] active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share WhatsApp</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
