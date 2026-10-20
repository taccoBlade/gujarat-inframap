import React from 'react';
import { GuidedTour, TourWaypoint } from '../../data/corridors-3d-data';
import { ToranOrnamentalBorder } from '../cultural/GujaratiPatterns';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Play, 
  Pause, 
  Compass, 
  Layers, 
  Eye, 
  Sparkles,
  Maximize2
} from 'lucide-react';

interface CorridorFlythroughHUDProps {
  activeTour: GuidedTour;
  currentWaypointIndex: number;
  isPlaying: boolean;
  theme: 'dark' | 'light';
  onNext: () => void;
  onPrev: () => void;
  onTogglePlay: () => void;
  onSelectWaypoint: (index: number) => void;
  onExit: () => void;
}

export const CorridorFlythroughHUD: React.FC<CorridorFlythroughHUDProps> = ({
  activeTour,
  currentWaypointIndex,
  isPlaying,
  theme,
  onNext,
  onPrev,
  onTogglePlay,
  onSelectWaypoint,
  onExit
}) => {
  const currentWaypoint: TourWaypoint = activeTour.waypoints[currentWaypointIndex] || activeTour.waypoints[0];
  const totalWaypoints = activeTour.waypoints.length;

  return (
    <div className="absolute inset-x-3 bottom-20 md:bottom-6 md:inset-x-auto md:left-6 md:max-w-md z-[1100] animate-in fade-in slide-in-from-bottom-6 duration-300 pointer-events-auto">
      <div 
        className={`rounded-2xl border-2 shadow-[6px_6px_0px_#101827] backdrop-blur-xl overflow-hidden ${
          theme === 'dark' ? 'bg-[#151F30]/95 border-[#25324A] text-[#F1E8D7]' : 'bg-[#FAF6ED]/95 border-[#25324A] text-[#101827]'
        }`}
      >
        {/* Cultural Toran Accent Strip */}
        <div style={{ height: '4px', background: activeTour.accentColor }} className="w-full" />

        <div className="p-3.5 sm:p-4">
          
          {/* Top Bar: Tour Category Badge & 3D Pitch Indicator & Close Button */}
          <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-[#25324A]">
            <div className="flex items-center gap-1.5">
              <span 
                style={{ backgroundColor: `${activeTour.accentColor}25`, color: activeTour.accentColor, borderColor: `${activeTour.accentColor}50` }}
                className="px-2 py-0.5 rounded-md border text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1"
              >
                <Compass className="w-3 h-3 animate-spin" />
                <span>3D Corridor Flythrough</span>
              </span>
              <span className="text-[10px] font-mono text-[#10B981] font-bold px-1.5 py-0.2 rounded bg-black/30 border border-white/10">
                60° 3D Tilt
              </span>
            </div>

            <button
              onClick={onExit}
              className="p-1 rounded-lg text-[#8F9CAE] hover:text-[#FF9418] hover:bg-black/20 transition-colors"
              title="Exit 3D Corridor Mode"
              aria-label="Exit 3D Corridor Mode"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tour Title & Waypoint Progress Dots */}
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="font-editorial text-sm sm:text-base font-black truncate text-white">
              {activeTour.title}
            </h3>
            <span className="text-[11px] font-mono font-bold text-[#FF9418] flex-shrink-0">
              {currentWaypointIndex + 1} / {totalWaypoints}
            </span>
          </div>

          {/* Waypoint Selector Stepper Chips */}
          <div className="flex items-center gap-1 my-2 overflow-x-auto no-scrollbar py-0.5">
            {activeTour.waypoints.map((wp, idx) => (
              <button
                key={wp.id}
                onClick={() => onSelectWaypoint(idx)}
                className={`h-1.5 rounded-full transition-all flex-1 ${
                  idx === currentWaypointIndex
                    ? 'bg-[#FF9418] h-2 shadow-[0_0_8px_#FF9418]'
                    : idx < currentWaypointIndex
                      ? 'bg-[#10B981]'
                      : 'bg-[#25324A]'
                }`}
                title={wp.name}
              />
            ))}
          </div>

          {/* Current Waypoint Details Card */}
          <div className="p-3 rounded-xl bg-[#101827]/90 border border-[#25324A] my-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#FF9418] uppercase block">
                  📍 {currentWaypoint.badge}
                </span>
                <h4 className="font-editorial text-sm sm:text-base font-bold text-white leading-snug">
                  {currentWaypoint.name}
                </h4>
                <span className="font-['Noto_Sans_Gujarati'] text-[11px] text-[#8F9CAE] block">
                  {currentWaypoint.gujaratiName}
                </span>
              </div>

              {/* Waypoint Thumbnail Preview */}
              {currentWaypoint.imageUrl && (
                <div className="w-16 h-12 rounded-lg overflow-hidden border border-[#25324A] flex-shrink-0 bg-black">
                  <img
                    src={currentWaypoint.imageUrl}
                    alt={currentWaypoint.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/destinations/statue-of-unity.jpg';
                    }}
                  />
                </div>
              )}
            </div>

            <p className="text-xs text-[#8F9CAE] line-clamp-2 my-2 leading-relaxed">
              {currentWaypoint.description}
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#25324A]/60 text-[10px] font-mono">
              <div className="text-left">
                <span className="text-[#8F9CAE] block">CapEx:</span>
                <span className="font-bold text-[#FF9418]">{currentWaypoint.capex}</span>
              </div>
              <div className="text-right">
                <span className="text-[#8F9CAE] block">Progress:</span>
                <span className="font-bold text-[#10B981]">{currentWaypoint.completion}% Complete</span>
              </div>
            </div>
          </div>

          {/* Interactive Navigation & Playback Controls */}
          <div className="flex items-center justify-between gap-2 pt-1">
            
            <button
              onClick={onPrev}
              disabled={currentWaypointIndex === 0}
              className="py-1.5 px-3 rounded-xl border-2 border-[#25324A] text-xs font-bold flex items-center gap-1 hover:border-[#FF9418] disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Prev</span>
            </button>

            <button
              onClick={onTogglePlay}
              className="py-1.5 px-4 rounded-xl bg-[#101827] border-2 border-[#FF9418] text-[#FF9418] hover:bg-[#FF9418] hover:text-[#101827] font-black text-xs flex items-center gap-1.5 transition-all shadow-[2px_2px_0px_#101827]"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Pause Glide</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Auto Glide</span>
                </>
              )}
            </button>

            <button
              onClick={onNext}
              disabled={currentWaypointIndex === totalWaypoints - 1}
              className="py-1.5 px-3 rounded-xl border-2 border-[#25324A] text-xs font-bold flex items-center gap-1 hover:border-[#FF9418] disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

          </div>

        </div>
      </div>
    </div>
  );
};
