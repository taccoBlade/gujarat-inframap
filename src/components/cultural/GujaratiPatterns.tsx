import React from 'react';

/**
 * GUJARAT INFRAMAP — CULTURAL SVG PATTERN SYSTEM
 * 
 * 7 Original, Lightweight, Culturally Rooted SVG Motifs:
 * 1. PatolaIkatPattern       — Patan double-ikat diamond grid (Chhabdi & Navratna Bhat)
 * 2. AjrakhStarPattern      — Kutch Khatri 8-pointed resist-dyed geometric star lattice
 * 3. BandhaniDotsPattern    — Jamnagar & Bhuj tied-resist concentric droplet clusters
 * 4. StepwellGeometryPattern — Rani ki Vav & Adalaj stepped descending chevron architecture
 * 5. ToranOrnamentalBorder  — Asopalav mango leaf & marigold auspicious threshold garland
 * 6. PolWoodCarvingPattern  — Old Ahmedabad UNESCO pol carved teakwood jharokha bracket
 * 7. PithoraEditorialMotif   — Sacred Rathwa tribal equine & cosmic sun editorial emblem
 */

// -----------------------------------------------------------------------------
// 1. PATOLA DOUBLE-IKAT GEOMETRY (Chhabdi Bhat Diamond Grid)
// -----------------------------------------------------------------------------
export const PatolaIkatPattern: React.FC<{
  className?: string;
  size?: number;
  color?: string;
  accentColor?: string;
}> = ({
  className = '',
  size = 48,
  color = '#9D233B',      // Ajrakh Red
  accentColor = '#FF9418' // Saffron Orange
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block flex-shrink-0 ${className}`}
    aria-hidden="true"
  >
    {/* Stepped Ikat Diamond Outer */}
    <path
      d="M32 4 L60 32 L32 60 L4 32 Z"
      stroke={color}
      strokeWidth="2.5"
      strokeLinejoin="miter"
      fill="none"
    />
    {/* Stepped Inner Ikat Steps */}
    <path
      d="M32 10 L54 32 L32 54 L10 32 Z"
      stroke={accentColor}
      strokeWidth="1.5"
      strokeDasharray="2 2"
      fill="none"
    />
    <path
      d="M32 16 L48 32 L32 48 L16 32 Z"
      fill={color}
      fillOpacity="0.15"
      stroke={color}
      strokeWidth="1.5"
    />
    {/* Central 4-Petal Ikat Core */}
    <rect x="28" y="28" width="8" height="8" fill={accentColor} transform="rotate(45 32 32)" />
    {/* Cardinal Ikat Nodes */}
    <circle cx="32" cy="8" r="2" fill={accentColor} />
    <circle cx="56" cy="32" r="2" fill={accentColor} />
    <circle cx="32" cy="56" r="2" fill={accentColor} />
    <circle cx="8" cy="32" r="2" fill={accentColor} />
  </svg>
);

// -----------------------------------------------------------------------------
// 2. AJRAKH GEOMETRIC 8-POINTED STAR (Khatri Resist-Dye Lattice)
// -----------------------------------------------------------------------------
export const AjrakhStarPattern: React.FC<{
  className?: string;
  size?: number;
  indigo?: string;
  madder?: string;
  turmeric?: string;
}> = ({
  className = '',
  size = 48,
  indigo = '#25324A',   // Slate Blue
  madder = '#9D233B',   // Ajrakh Red
  turmeric = '#FF9418' // Saffron Orange
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block flex-shrink-0 ${className}`}
    aria-hidden="true"
  >
    {/* Interlocking Dual Squares forming 8-Point Star */}
    <rect
      x="12"
      y="12"
      width="40"
      height="40"
      stroke={indigo}
      strokeWidth="2"
      fill="none"
    />
    <rect
      x="12"
      y="12"
      width="40"
      height="40"
      stroke={madder}
      strokeWidth="2"
      transform="rotate(45 32 32)"
      fill="none"
    />
    {/* Central Flower Core */}
    <circle cx="32" cy="32" r="7" stroke={turmeric} strokeWidth="1.5" fill={indigo} fillOpacity="0.2" />
    <circle cx="32" cy="32" r="3" fill={turmeric} />
    {/* Ray Points Accents */}
    <circle cx="32" cy="6" r="1.5" fill={madder} />
    <circle cx="58" cy="32" r="1.5" fill={madder} />
    <circle cx="32" cy="58" r="1.5" fill={madder} />
    <circle cx="6" cy="32" r="1.5" fill={madder} />
    <circle cx="50" cy="14" r="1.5" fill={indigo} />
    <circle cx="50" cy="50" r="1.5" fill={indigo} />
    <circle cx="14" cy="50" r="1.5" fill={indigo} />
    <circle cx="14" cy="14" r="1.5" fill={indigo} />
  </svg>
);

// -----------------------------------------------------------------------------
// 3. BANDHANI DOT CLUSTERS (Tie-Resist Droplet Formations)
// -----------------------------------------------------------------------------
export const BandhaniDotsPattern: React.FC<{
  className?: string;
  size?: number;
  primaryColor?: string;
  dotColor?: string;
}> = ({
  className = '',
  size = 40,
  primaryColor = '#9D233B',
  dotColor = '#F1E8D7'
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block flex-shrink-0 ${className}`}
    aria-hidden="true"
  >
    {/* Diamond Formation of Tied Dots */}
    {/* Central Big Cluster */}
    <circle cx="24" cy="24" r="4.5" fill={primaryColor} />
    <circle cx="24" cy="24" r="2" fill={dotColor} />
    
    {/* Inner Ring (8 Dots) */}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
      const rad = (angle * Math.PI) / 180;
      const x = 24 + 11 * Math.cos(rad);
      const y = 24 + 11 * Math.sin(rad);
      return (
        <g key={i}>
          <circle cx={x} cy={y} r="2.8" fill={primaryColor} />
          <circle cx={x} cy={y} r="1.2" fill={dotColor} />
        </g>
      );
    })}

    {/* Outer Cardinal Ring */}
    {[0, 90, 180, 270].map((angle, i) => {
      const rad = (angle * Math.PI) / 180;
      const x = 24 + 19 * Math.cos(rad);
      const y = 24 + 19 * Math.sin(rad);
      return (
        <g key={`outer-${i}`}>
          <circle cx={x} cy={y} r="2.2" fill={primaryColor} />
          <circle cx={x} cy={y} r="0.9" fill={dotColor} />
        </g>
      );
    })}
  </svg>
);

// -----------------------------------------------------------------------------
// 4. STEPWELL DESCENDING GEOMETRY (Maru-Gurjara Vav Staircases)
// -----------------------------------------------------------------------------
export const StepwellGeometryPattern: React.FC<{
  className?: string;
  size?: number;
  color?: string;
  accentColor?: string;
}> = ({
  className = '',
  size = 48,
  color = '#25324A',
  accentColor = '#FF9418'
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block flex-shrink-0 ${className}`}
    aria-hidden="true"
  >
    {/* Descending Stepped Pyramid Geometry (Adalaj / Rani ki Vav Chevron) */}
    {/* Outer Chevron Level 1 */}
    <path
      d="M4 12 L32 40 L60 12"
      stroke={color}
      strokeWidth="2"
      fill="none"
      strokeLinecap="square"
    />
    {/* Stepped Corbel Level 2 */}
    <path
      d="M12 12 L12 20 L24 32 L32 40 L40 32 L52 20 L52 12"
      stroke={accentColor}
      strokeWidth="2"
      fill="none"
    />
    {/* Stepped Corbel Level 3 */}
    <path
      d="M20 12 L20 22 L28 30 L32 34 L36 30 L44 22 L44 12"
      stroke={color}
      strokeWidth="2"
      fill="none"
    />
    {/* Deep Water Well Shaft Chamber */}
    <rect x="28" y="44" width="8" height="14" stroke={color} strokeWidth="1.5" fill={accentColor} fillOpacity="0.2" />
    <line x1="28" y1="48" x2="36" y2="48" stroke={color} strokeWidth="1" />
    <line x1="28" y1="52" x2="36" y2="52" stroke={color} strokeWidth="1" />
    <line x1="28" y1="56" x2="36" y2="56" stroke={color} strokeWidth="1" />
  </svg>
);

// -----------------------------------------------------------------------------
// 5. TORAN ORNAMENTAL BORDER (Asopalav Leaves & Marigolds)
// -----------------------------------------------------------------------------
export const ToranOrnamentalBorder: React.FC<{
  className?: string;
  height?: number;
}> = ({
  className = '',
  height = 14
}) => (
  <div 
    className={`w-full overflow-hidden leading-none select-none ${className}`} 
    style={{ height: `${height}px` }}
    aria-hidden="true"
  >
    <svg
      width="100%"
      height={height}
      viewBox="0 0 320 14"
      preserveAspectRatio="none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full block"
    >
      <defs>
        <pattern id="toran-unit" width="32" height="14" patternUnits="userSpaceOnUse">
          {/* Top Auspicious Ribbon */}
          <rect x="0" y="0" width="32" height="3" fill="#9D233B" />
          <rect x="0" y="2" width="32" height="1" fill="#FF9418" />
          
          {/* Asopalav Triangular Mango Leaf */}
          <path d="M4 3 L16 13 L28 3 Z" fill="#1C6555" fillOpacity="0.9" stroke="#101827" strokeWidth="0.8" />
          
          {/* Golden Marigold Drop */}
          <circle cx="16" cy="11" r="2.2" fill="#FF9418" stroke="#9D233B" strokeWidth="0.6" />
          
          {/* Mirrorwork (Lippan Abhla) Dot */}
          <circle cx="16" cy="6" r="1.5" fill="#FFFFFF" stroke="#8F9CAE" strokeWidth="0.5" />
          
          {/* Side Floral Beads */}
          <circle cx="3" cy="4" r="1.2" fill="#FF9418" />
          <circle cx="29" cy="4" r="1.2" fill="#FF9418" />
        </pattern>
      </defs>
      <rect width="100%" height="14" fill="url(#toran-unit)" />
    </svg>
  </div>
);

// -----------------------------------------------------------------------------
// 6. POL WOOD CARVING BRACKET (Ahmedabad UNESCO Pol Jharokha Framing)
// -----------------------------------------------------------------------------
export const PolWoodCarvingPattern: React.FC<{
  className?: string;
  size?: number;
  orientation?: 'left' | 'right';
  color?: string;
  accent?: string;
}> = ({
  className = '',
  size = 40,
  orientation = 'left',
  color = '#5C4D42', // Teakwood Earth
  accent = '#DDA15E'
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block flex-shrink-0 ${orientation === 'right' ? 'scale-x-[-1]' : ''} ${className}`}
    aria-hidden="true"
  >
    {/* Architectural Pol Bracket Scroll (Todla Bracket) */}
    <path
      d="M4 4 H44 V12 C32 12 24 20 20 32 V44 H12 C12 30 8 18 4 12 Z"
      fill={color}
      fillOpacity="0.12"
      stroke={color}
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* Carved Floral S-Scroll Interior */}
    <path
      d="M14 12 C18 18 24 22 28 22 C34 22 36 16 40 12"
      stroke={accent}
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
    />
    <circle cx="28" cy="22" r="3" fill={accent} stroke={color} strokeWidth="1" />
    <circle cx="10" cy="8" r="2" fill={color} />
    <circle cx="38" cy="8" r="2" fill={color} />
  </svg>
);

// -----------------------------------------------------------------------------
// 7. PITHORA SACRED TRIBAL MOTIF (Rathwa Cosmic Equine & Sun Disk)
// -----------------------------------------------------------------------------
export const PithoraEditorialMotif: React.FC<{
  className?: string;
  size?: number;
  primaryColor?: string;
  accentColor?: string;
}> = ({
  className = '',
  size = 56,
  primaryColor = '#9B2226',
  accentColor = '#DDA15E'
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block flex-shrink-0 ${className}`}
    aria-hidden="true"
  >
    {/* Cosmic Sun / Moon Wheel above */}
    <circle cx="48" cy="16" r="6" stroke={accentColor} strokeWidth="1.8" strokeDasharray="3 2" fill="none" />
    <circle cx="48" cy="16" r="2.5" fill={primaryColor} />

    {/* Sacred Stepped Tree of Life (Tad Tree) */}
    <line x1="14" y1="16" x2="14" y2="44" stroke={primaryColor} strokeWidth="2" />
    <line x1="8" y1="22" x2="20" y2="22" stroke={accentColor} strokeWidth="1.5" />
    <line x1="10" y1="28" x2="18" y2="28" stroke={accentColor} strokeWidth="1.5" />
    <line x1="12" y1="34" x2="16" y2="34" stroke={accentColor} strokeWidth="1.5" />

    {/* Stylized Pithora Equine Silhouette (Sacred Horse) */}
    {/* Horse Torso & Stepped Neck */}
    <path
      d="M26 36 L34 26 L42 26 L40 32 L46 36 L46 44 L40 44 L38 48 L34 48 L36 44 L28 44 L26 50 L22 50 L24 42 Z"
      fill={primaryColor}
      fillOpacity="0.85"
      stroke={primaryColor}
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    {/* Equine Mane Dots */}
    <circle cx="36" cy="24" r="1.5" fill={accentColor} />
    <circle cx="39" cy="27" r="1.5" fill={accentColor} />
    <circle cx="42" cy="30" r="1.5" fill={accentColor} />

    {/* Auspicious Vermilion Footprint Dots */}
    <circle cx="28" cy="54" r="1.8" fill={accentColor} />
    <circle cx="38" cy="54" r="1.8" fill={accentColor} />
    <circle cx="48" cy="54" r="1.8" fill={accentColor} />
  </svg>
);

// -----------------------------------------------------------------------------
// REUSABLE NEO-BRUTALIST CULTURAL CARD FRAME
// -----------------------------------------------------------------------------
export const CulturalCardFrame: React.FC<{
  children: React.ReactNode;
  motif?: 'patola' | 'ajrakh' | 'bandhani' | 'stepwell' | 'pol' | 'pithora';
  title?: string;
  badge?: string;
  className?: string;
}> = ({
  children,
  motif = 'patola',
  title,
  badge,
  className = ''
}) => {
  return (
    <div className={`relative border-2 border-[#25324A] bg-[#FAF6ED] dark:bg-[#151F30] rounded-2xl shadow-[4px_4px_0px_#25324A] dark:shadow-[4px_4px_0px_#101827] overflow-hidden transition-all duration-200 ${className}`}>
      {/* Top Toran Ornamental Trim */}
      <ToranOrnamentalBorder height={10} />

      {/* Header bar if title or badge provided */}
      {(title || badge) && (
        <div className="px-4 py-2.5 border-b-2 border-[#25324A] flex items-center justify-between gap-2 bg-[#F1E8D7] dark:bg-[#101827]">
          <div className="flex items-center gap-2">
            {motif === 'patola' && <PatolaIkatPattern size={22} />}
            {motif === 'ajrakh' && <AjrakhStarPattern size={22} />}
            {motif === 'bandhani' && <BandhaniDotsPattern size={22} />}
            {motif === 'stepwell' && <StepwellGeometryPattern size={22} />}
            {motif === 'pol' && <PolWoodCarvingPattern size={22} />}
            {motif === 'pithora' && <PithoraEditorialMotif size={22} />}
            {title && (
              <span className="font-bold font-editorial text-sm text-[#101827] dark:text-[#F1E8D7]">
                {title}
              </span>
            )}
          </div>
          {badge && (
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#FF9418] text-[#101827] border border-[#25324A]">
              {badge}
            </span>
          )}
        </div>
      )}

      {/* Main Card Content */}
      <div className="p-4 sm:p-5">
        {children}
      </div>
    </div>
  );
};
