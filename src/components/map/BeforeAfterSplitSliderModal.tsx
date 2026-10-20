import React, { useState, useRef, useEffect } from 'react';
import { BEFORE_AFTER_ZONES, BeforeAfterZone } from '../../data/corridors-3d-data';
import { ToranOrnamentalBorder } from '../cultural/GujaratiPatterns';
import { X, Sliders, Sparkles, CheckCircle2, Share2, Video, ChevronRight, Building2, MapPin } from 'lucide-react';

interface BeforeAfterSplitSliderModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'dark' | 'light';
  initialZoneId?: string;
}

export const BeforeAfterSplitSliderModal: React.FC<BeforeAfterSplitSliderModalProps> = ({
  isOpen,
  onClose,
  theme,
  initialZoneId
}) => {
  const [selectedZoneId, setSelectedZoneId] = useState<string>(initialZoneId || BEFORE_AFTER_ZONES[0].id);
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage 0 - 100
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeZone = BEFORE_AFTER_ZONES.find(z => z.id === selectedZoneId) || BEFORE_AFTER_ZONES[0];

  useEffect(() => {
    if (initialZoneId) setSelectedZoneId(initialZoneId);
  }, [initialZoneId]);

  // Handle drag mechanics
  const handlePointerMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleWindowMouseMove = (e: MouseEvent) => {
      handlePointerMove(e.clientX);
    };

    const handleWindowTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handlePointerMove(e.touches[0].clientX);
      }
    };

    const handleGlobalMouseUp = () => setIsDragging(false);

    window.addEventListener('mousemove', handleWindowMouseMove);
    window.addEventListener('touchmove', handleWindowTouchMove, { passive: true });
    window.addEventListener('mouseup', handleGlobalMouseUp);
    window.addEventListener('touchend', handleGlobalMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('touchmove', handleWindowTouchMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('touchend', handleGlobalMouseUp);
    };
  }, [isDragging]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className={`relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl border-2 shadow-[8px_8px_0px_#101827] overflow-hidden ${
          theme === 'dark' ? 'bg-[#151F30] border-[#25324A] text-[#F1E8D7]' : 'bg-[#FAF6ED] border-[#25324A] text-[#101827]'
        }`}
      >
        {/* Cultural Toran Accent Top Border */}
        <ToranOrnamentalBorder className="w-full flex-shrink-0" height={8} />

        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b-2 border-[#25324A] flex items-center justify-between gap-4 flex-shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-md bg-[#FF9418]/20 text-[#FF9418] border border-[#FF9418]/40 text-[10px] font-mono font-bold uppercase tracking-wider">
                ⚡ Viral Visual Tool
              </span>
              <span className="text-[10px] font-mono text-[#8F9CAE]">
                Drag slider to reveal 3D master plan
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black font-editorial tracking-tight flex items-center gap-2">
              <span>Before vs. Planned: Ground Truth &amp; Master Plan</span>
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl border-2 border-[#25324A] hover:border-[#FF9418] hover:text-[#FF9418] transition-colors"
            aria-label="Close split screen modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Zone Selector Pills */}
        <div className="px-4 py-2.5 bg-[#101827]/60 border-b border-[#25324A] flex items-center gap-2 overflow-x-auto no-scrollbar flex-shrink-0">
          <span className="text-xs font-mono font-bold text-[#8F9CAE] whitespace-nowrap pl-1">
            HOT ZONES:
          </span>
          {BEFORE_AFTER_ZONES.map(zone => (
            <button
              key={zone.id}
              onClick={() => setSelectedZoneId(zone.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border-2 flex items-center gap-1.5 ${
                selectedZoneId === zone.id
                  ? 'bg-[#FF9418] text-[#101827] border-[#101827] shadow-[2px_2px_0px_#101827]'
                  : 'bg-[#151F30] text-[#8F9CAE] border-[#25324A] hover:border-[#FF9418] hover:text-white'
              }`}
            >
              <span>{zone.title.split(' ')[0]}</span>
              <span className="text-[10px] font-mono opacity-80">({zone.location.split(',')[0]})</span>
            </button>
          ))}
        </div>

        {/* Interactive Split-Screen Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          
          {/* Main Visual Slider Container */}
          <div 
            ref={containerRef}
            onMouseDown={(e) => {
              setIsDragging(true);
              handlePointerMove(e.clientX);
            }}
            onTouchStart={(e) => {
              setIsDragging(true);
              if (e.touches.length > 0) {
                handlePointerMove(e.touches[0].clientX);
              }
            }}
            className="relative w-full aspect-[16/9] sm:aspect-[21/10] rounded-xl overflow-hidden border-2 border-[#25324A] bg-[#101827] select-none cursor-ew-resize shadow-[4px_4px_0px_#101827]"
          >
            {/* RIGHT SIDE: 3D Master Plan & Future Infra (Revealed underneath) */}
            <div className="absolute inset-0 w-full h-full">
              <img
                src={activeZone.plannedImage}
                alt={activeZone.plannedYear}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/destinations/statue-of-unity.jpg';
                }}
              />
              {/* Engineering Blueprint Overlay Tint */}
              <div className="absolute inset-0 bg-cyan-950/25 pointer-events-none" />

              {/* Planned Badge (Top Right) */}
              <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-lg bg-[#00F0FF]/90 text-[#101827] border border-[#101827] shadow-sm font-mono font-black text-[11px] tracking-wide uppercase">
                🚀 {activeZone.plannedYear}
              </div>

              {/* Bottom Right Caption */}
              <div className="absolute bottom-3 right-3 z-10 max-w-[200px] sm:max-w-xs text-right bg-[#101827]/90 p-2 rounded-lg border border-[#25324A] backdrop-blur-md">
                <span className="text-[10px] text-[#00F0FF] font-bold block uppercase font-mono">Master Plan Spec</span>
                <p className="text-[11px] text-[#F1E8D7] line-clamp-2 leading-tight">
                  {activeZone.plannedDesc}
                </p>
              </div>
            </div>

            {/* LEFT SIDE: Historical Ground Truth (Clipped by sliderPosition) */}
            <div 
              style={{ width: `${sliderPosition}%` }}
              className="absolute inset-y-0 left-0 overflow-hidden border-r-2 border-white/90 z-20"
            >
              <div 
                style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%' }}
                className="h-full relative"
              >
                <img
                  src={activeZone.historicImage}
                  alt={activeZone.historicYear}
                  className="w-full h-full object-cover filter saturate-75"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/destinations/lothal-archaeological-site.jpg';
                  }}
                />
                {/* Vintage Sepia/Arid Scrim */}
                <div className="absolute inset-0 bg-amber-950/20 pointer-events-none" />

                {/* Historic Badge (Top Left) */}
                <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-lg bg-[#9D233B]/90 text-white border border-[#101827] shadow-sm font-mono font-black text-[11px] tracking-wide uppercase">
                  ⏳ {activeZone.historicYear}
                </div>

                {/* Bottom Left Caption */}
                <div className="absolute bottom-3 left-3 z-10 max-w-[200px] sm:max-w-xs bg-[#101827]/90 p-2 rounded-lg border border-[#25324A] backdrop-blur-md">
                  <span className="text-[10px] text-[#FF9418] font-bold block uppercase font-mono">Ground Reality</span>
                  <p className="text-[11px] text-[#F1E8D7] line-clamp-2 leading-tight">
                    {activeZone.historicDesc}
                  </p>
                </div>
              </div>
            </div>

            {/* Center Slider Handle */}
            <div 
              style={{ left: `${sliderPosition}%` }}
              className="absolute inset-y-0 -ml-4 w-8 z-30 flex items-center justify-center pointer-events-none"
            >
              <div className="w-8 h-8 rounded-full bg-[#FF9418] text-[#101827] border-2 border-[#101827] shadow-[2px_2px_0px_#101827] flex items-center justify-center cursor-ew-resize pointer-events-auto active:scale-110 transition-transform">
                <Sliders className="w-4 h-4 rotate-90" />
              </div>
            </div>

            {/* Creator Recording Hint */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 px-2 py-0.5 rounded-full bg-black/75 border border-white/20 text-[10px] text-white/90 font-mono flex items-center gap-1.5 pointer-events-none">
              <Video className="w-3 h-3 text-[#FF9418]" />
              <span>Drag to compare • 15s viral recording ready</span>
            </div>
          </div>

          {/* Key Engineering Details & Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            
            {/* Stat 1: CapEx */}
            <div className="p-3 rounded-xl border-2 border-[#25324A] bg-[#101827]/40 flex flex-col justify-between">
              <span className="text-[10px] font-mono text-[#8F9CAE] uppercase font-bold">Investment CapEx</span>
              <div className="text-xl font-black font-editorial text-[#FF9418]">{activeZone.capex}</div>
              <span className="text-[10px] text-[#8F9CAE]">{activeZone.agency}</span>
            </div>

            {/* Stat 2: Progress & Year */}
            <div className="p-3 rounded-xl border-2 border-[#25324A] bg-[#101827]/40 flex flex-col justify-between">
              <span className="text-[10px] font-mono text-[#8F9CAE] uppercase font-bold">Execution Status</span>
              <div className="text-base font-black font-mono text-[#10B981]">{activeZone.completion}</div>
              <span className="text-[10px] text-[#8F9CAE]">📍 {activeZone.location}</span>
            </div>

            {/* Stat 3: Viral Tip */}
            <div className="p-3 rounded-xl border-2 border-[#25324A] bg-[#101827]/40 flex flex-col justify-between">
              <span className="text-[10px] font-mono text-[#8F9CAE] uppercase font-bold">Engagement Hook</span>
              <p className="text-[11px] leading-tight text-[#F1E8D7]">
                Compare satellite history vs. 3D blueprint master plan for real estate FOMO.
              </p>
              <span className="text-[10px] font-mono text-[#FF9418] font-bold">#GujaratInfra #SmartCities</span>
            </div>

          </div>

          {/* Core Master Plan Transformations */}
          <div className="p-3.5 rounded-xl border-2 border-[#25324A] bg-[#101827]/50">
            <h4 className="text-xs font-black font-mono text-[#FF9418] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Key Master Plan Transformations</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {activeZone.highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-2 p-1.5 rounded-lg bg-black/20 border border-white/5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] flex-shrink-0 mt-0.5" />
                  <span className="text-[#F1E8D7] text-[11px] leading-snug">{h}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 border-t-2 border-[#25324A] flex items-center justify-between gap-3 flex-shrink-0 bg-[#101827]/80">
          <div className="text-[11px] font-mono text-[#8F9CAE] truncate">
            Source: Official DIACL, NHSRCL &amp; GIFTCL Gazette Master Plans
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const text = `Look at the master plan transformation of ${activeZone.title}! Historical satellite vs 3D planned infrastructure on Gujarat InfraMap: https://gujarat-inframap.vercel.app`;
                if (navigator.share) {
                  navigator.share({ title: activeZone.title, text, url: 'https://gujarat-inframap.vercel.app' }).catch(() => {});
                } else {
                  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
                }
              }}
              className="px-3.5 py-1.5 rounded-xl bg-[#FF9418] hover:bg-[#e07f10] text-[#101827] font-black text-xs flex items-center gap-1.5 border-2 border-[#101827] shadow-[2px_2px_0px_#101827] active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Hot Zone</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
