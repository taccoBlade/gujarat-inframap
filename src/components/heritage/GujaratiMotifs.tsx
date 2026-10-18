import React from 'react';

/**
 * 1. Adalaj ni Vav Stepwell Geometric Corner Bracket
 * Used to frame editorial headers and destination feature cards with stepped recess geometry.
 */
export function StepwellCornerFrame({
  children,
  className = '',
  accentColor = '#243B53'
}: {
  children: React.ReactNode;
  className?: string;
  accentColor?: string;
}) {
  return (
    <div className={`relative p-6 border border-[#D8C3A5] bg-[#FDFBF7] ${className}`}>
      {/* Top-Left Stepwell Recess */}
      <svg
        aria-hidden="true"
        className="absolute top-0 left-0 w-5 h-5 pointer-events-none"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M0 24V0H24M4 20V4H20M8 16V8H16"
          stroke={accentColor}
          strokeWidth="1.25"
          strokeOpacity="0.45"
        />
      </svg>
      {/* Top-Right Stepwell Recess */}
      <svg
        aria-hidden="true"
        className="absolute top-0 right-0 w-5 h-5 pointer-events-none rotate-90"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M0 24V0H24M4 20V4H20M8 16V8H16"
          stroke={accentColor}
          strokeWidth="1.25"
          strokeOpacity="0.45"
        />
      </svg>
      {/* Bottom-Left Stepwell Recess */}
      <svg
        aria-hidden="true"
        className="absolute bottom-0 left-0 w-5 h-5 pointer-events-none -rotate-90"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M0 24V0H24M4 20V4H20M8 16V8H16"
          stroke={accentColor}
          strokeWidth="1.25"
          strokeOpacity="0.45"
        />
      </svg>
      {/* Bottom-Right Stepwell Recess */}
      <svg
        aria-hidden="true"
        className="absolute bottom-0 right-0 w-5 h-5 pointer-events-none rotate-180"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M0 24V0H24M4 20V4H20M8 16V8H16"
          stroke={accentColor}
          strokeWidth="1.25"
          strokeOpacity="0.45"
        />
      </svg>
      {children}
    </div>
  );
}

/**
 * 2. Kutch Ajrakh & Patola Inspired Geometric Section Divider
 * Used sparingly between editorial sections on Places to Explore and About & Sources.
 */
export function AjrakhSectionDivider({ className = '' }: { className?: string }) {
  return (
    <div
      role="separator"
      aria-hidden="true"
      className={`flex items-center justify-center gap-3 my-8 select-none ${className}`}
    >
      <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#D8C3A5] to-[#243B53]/40" />
      <svg width="84" height="16" viewBox="0 0 84 16" fill="none">
        {/* Left Bandhani 4-dot cluster */}
        <circle cx="8" cy="5" r="1.3" fill="#A64036" />
        <circle cx="8" cy="11" r="1.3" fill="#A64036" />
        <circle cx="5" cy="8" r="1.3" fill="#A64036" />
        <circle cx="11" cy="8" r="1.3" fill="#A64036" />

        {/* Central Ajrakh Octagram / Stepwell Star */}
        <path
          d="M42 1L45.5 5.5L51 4.5L49 9.5L52 13L46.5 12.5L42 15L37.5 12.5L32 13L35 9.5L33 4.5L38.5 5.5L42 1Z"
          stroke="#243B53"
          strokeWidth="1.2"
          fill="#F7F2E8"
        />
        <rect
          x="39.5"
          y="5.5"
          width="5"
          height="5"
          transform="rotate(45 42 8)"
          fill="#C49A45"
        />

        {/* Right Bandhani 4-dot cluster */}
        <circle cx="76" cy="5" r="1.3" fill="#A64036" />
        <circle cx="76" cy="11" r="1.3" fill="#A64036" />
        <circle cx="73" cy="8" r="1.3" fill="#A64036" />
        <circle cx="79" cy="8" r="1.3" fill="#A64036" />
      </svg>
      <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#D8C3A5] to-[#243B53]/40" />
    </div>
  );
}

/**
 * 3. Jharokha Architectural Arch Silhouette Frame
 * Used strictly for selected hero destination photography in Places to Explore.
 */
export function JharokhaPhotoFrame({
  src,
  alt,
  caption
}: {
  src: string;
  alt: string;
  caption?: string;
}) {
  return (
    <figure className="relative group">
      <div className="relative overflow-hidden rounded-t-[28px] rounded-b-sm border border-[#D8C3A5] bg-[#E8DCCB] p-1.5">
        <div className="relative overflow-hidden rounded-t-[22px] rounded-b-xs aspect-[16/10]">
          <img
            src={src}
            alt={alt}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
          />
        </div>
      </div>
      {caption && (
        <figcaption className="mt-2 text-xs text-[#777269] flex items-center justify-between">
          <span>{caption}</span>
        </figcaption>
      )}
    </figure>
  );
}
