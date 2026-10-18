import React from 'react';

export type DiscoveryLens = 'places' | 'infrastructure';

export interface DiscoveryModeSwitcherProps {
  activeLens: DiscoveryLens;
  onChangeLens: (lens: DiscoveryLens) => void;
  prefersReducedMotion?: boolean;
}

export function DiscoveryModeSwitcher({
  activeLens,
  onChangeLens,
  prefersReducedMotion = false
}: DiscoveryModeSwitcherProps) {
  return (
    <div className="inline-flex items-center gap-2 p-1 rounded-lg bg-[#E8DCCB]/75 border border-[#D8C3A5]">
      {/* Animated Gujarati Geometric Crest that morphs between Places and Infrastructure */}
      <div className="w-8 h-8 flex items-center justify-center rounded bg-[#FDFBF7] border border-[#D8C3A5]/80">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          {activeLens === 'places' ? (
            <g key="places-motif">
              {/* Jharokha & Bandhani 4-Dot Cultural Motif */}
              <path
                d="M4 20V11C4 6.5 12 3 12 3C12 3 20 6.5 20 11V20H4Z"
                stroke="#A64036"
                strokeWidth="1.6"
              />
              <circle cx="12" cy="11" r="1.5" fill="#C49A45" />
              <circle cx="9.5" cy="14.5" r="1.2" fill="#243B53" />
              <circle cx="14.5" cy="14.5" r="1.2" fill="#243B53" />
            </g>
          ) : (
            <g key="infra-motif">
              {/* Adalaj Stepwell Concentric Architectural Geometry */}
              <rect x="3" y="3" width="18" height="18" stroke="#243B53" strokeWidth="1.6" />
              <rect x="7" y="7" width="10" height="10" stroke="#52664B" strokeWidth="1.4" />
              <path d="M3 12H7M17 12H21M12 3V7M12 17V21" stroke="#C49A45" strokeWidth="1.4" />
            </g>
          )}
        </svg>
      </div>

      {/* Mode Buttons with Active Pill Indicator */}
      <div className="relative flex items-center gap-1" role="tablist" aria-label="Discovery Mode">
        {(['places', 'infrastructure'] as const).map((lens) => {
          const isActive = activeLens === lens;
          const label = lens === 'places' ? 'Places to Explore' : 'Infrastructure';
          return (
            <button
              key={lens}
              role="tab"
              aria-selected={isActive}
              onClick={() => onChangeLens(lens)}
              className={`relative z-10 px-3.5 py-1.5 text-sm font-medium rounded-md transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#243B53] ${
                isActive ? 'text-[#F7F2E8] bg-[#243B53] shadow-xs' : 'text-[#282823] hover:text-[#243B53] hover:bg-[#D8C3A5]/30'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
