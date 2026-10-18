# GOOGLE ANTIGRAVITY (GEMINI 3.8) — AUTONOMOUS EXECUTION BLUEPRINT
## Project: Gujarat InfraMap Complete Product Refactor & Heritage Redesign
**Target Environment:** Google Antigravity Agentic IDE (Editor + Terminal + Integrated Browser Sub-Agent)  
**Core Model:** Gemini 3.8 (High-Context AST Surgery, Multi-File Refactoring & Visual DOM Verification)  
**Target Live Reference:** `https://gujarat-inframap.vercel.app/`

---

## 1. HOW TO USE THIS GUIDE IN GOOGLE ANTIGRAVITY

Google Antigravity operates through three synchronized surfaces—**the Editor**, **the Terminal**, and **the Browser Sub-Agent**—coordinated by structured **Artifacts** (`task.md`, `implementation_plan.md`, and `walkthrough.md`). Because Gemini 3.8 features deep multi-file dependency reasoning and native visual inspection via the Browser Sub-Agent, you must configure the agent so it does not stop at high-level summaries or superficial CSS overrides.

### 1.1 Step-by-Step Setup in Antigravity
1. **System Rules Injection:** Copy **Section 2 (`.antigravity/rules.md`)** of this guide and save it directly into your repository root at `.antigravity/rules.md` (or `.idx/airules.md` depending on your workspace template).
2. **Task Artifact Initialization:** Copy **Section 3 (`task.md`)** into Antigravity's mission control / task tracker so Gemini 3.8 tracks every destructive removal, data transformation, and UI verification step deterministically.
3. **Kickoff Prompt:** Paste the **Master Kickoff Trigger (Section 4)** into the Antigravity Agent chat pane in **Planning & Execution Mode**.

---

## 2. WORKSPACE SYSTEM RULES (`.antigravity/rules.md`)

Save the following block as `.antigravity/rules.md` in the root of the project repository. This locks Gemini 3.8 into strict engineering, design, and data-integrity guardrails throughout its context window.

```markdown
# ANTIGRAVITY WORKSPACE RULES — GUJARAT INFRAMAP REFACTOR (GEMINI 3.8)

## 1. ROLE & EXECUTION MANDATE
You are operating as a Principal Product Designer, Senior Frontend Engineer, GIS Architect, Interaction Designer, Data-Quality Engineer, and Creative Director.
- You are executing a complete architectural and visual transformation of `gujarat-inframap`.
- NEVER stop after writing a plan, generating a mockup, or hiding old UI elements with `display: none` or `visibility: hidden`.
- You MUST inspect the actual AST and file tree, trace imports, delete obsolete engineering modules, refactor the data layer, implement the Gujarati Heritage Design System, wire the Motion system, and verify the running application using the Antigravity Browser Sub-Agent.

## 2. STRICT PRODUCT & DATA INTEGRITY INVARIANTS
1. **Zero Engineering Bloat:** The public application must NEVER expose civil-engineering calculators, bridge scour/foundation design tools, superelevation compliance panels, hydrological laboratories, reservoir operating simulators, vulnerability/hazard scores, 3D terrain workbenches, or fake SCADA/live telemetry panels.
2. **Preserve & Transform Real Datasets:** NEVER delete underlying GeoJSON, JSON, or TypeScript datasets for Dams, SAUNI Lifeline, Khavda RE, Dholera SIR, Roads, Railways, Water Infrastructure, or Environmental Geography. Transform them into clean, plain-language public asset profiles and map layers.
3. **Zero Hallucinated Data:** NEVER invent opening hours, ticket prices, transit schedules, bus routes, train frequencies, live traffic conditions, or positional accuracy claims.
4. **Explicit Missing-Data States:** Distinguish between *unverified/missing information* and *confirmed absence of service*.
5. **Straight-Line vs. Network Distance:** If calculating distance between a transport hub and a destination using coordinate geometry (Haversine), explicitly label it as `Straight-line distance (Aerial)` and state that road network distance and travel duration require verification.

## 3. INFORMATION ARCHITECTURE INVARIANT
The top-level consumer navigation must contain ONLY five destinations:
1. `Explore` (`/`) — Default workspace with Gujarat map, universal search, clean layer selector, and contextual asset inspector.
2. `Places to Explore` (`/places`) — Curated editorial destination catalogue with verified categories and honest visitor access details.
3. `Infrastructure` (`/infrastructure`) — Public directory and map explorer for dams, energy, transport, water schemes, and flagship projects (SAUNI, Dholera SIR, Khavda RE).
4. `Plan a Visit` (`/plan-visit`) — Origin-to-destination readiness evaluator highlighting the "Last-Mile Gap" and explicit trip-readiness classifications (`Well documented`, `Some planning required`, `Important details unverified`).
5. `About & Sources` (`/about`) — Platform purpose, dataset provenance registry, publication/check dates, and methodology limitations.

## 4. VISUAL & MOTION GUARDRAILS
- **Aesthetic:** Contemporary Gujarati heritage × editorial travel design × refined cartography.
- **No Dark Neon GIS Styling:** Replace all dark-mode neon/cyberpunk/dashboard styling with the Warm Ivory (`#F7F2E8`), Warm Sandstone (`#D8C3A5`), and Deep Indigo (`#243B53`) semantic palette.
- **Restrained Ornamentation:** Use SVG stepwell geometry, Ajrakh borders, Bandhani dot motifs, and Jharokha frames ONLY in brand headers, editorial section intros, destination photo frames, and the signature mode transition. Keep map canvases, search inputs, and data tables visually quiet.
- **Accessibility & Performance:** Maintain WCAG AA contrast ($\ge 4.5:1$ for body text, $\ge 3.0:1$ for large text/UI controls) and full `prefers-reduced-motion: reduce` support.
```

---

## 3. ANTIGRAVITY TASK ARTIFACT (`task.md`)

Feed this checklist to Gemini 3.8 so it maintains state across terminal commands, file edits, and browser verification cycles:

```markdown
# Task Tracker: Gujarat InfraMap Refactor

- [ ] **Phase 1: Codebase Forensics & Dependency Mapping**
  - [ ] Inspect `package.json`, framework version (Next.js App/Pages router or Vite/React), map library (MapLibre GL / Leaflet / Mapbox), and styling setup.
  - [ ] Inventory all routes, components, stores, and raw datasets (`/data`, `/public`, `/src/data`).
  - [ ] Map every import of specialist engineering modules (`WaterLab`, `CycloneSurge`, `BridgeScour`, `Superelevation`, `SpatialTools`, `Terrain3D`, `Geoenv`, `Intelligence`, `SCADA`).
- [ ] **Phase 2: Git Checkpoint**
  - [ ] Verify clean working tree and create reversible branch `refactor/gujarat-public-discovery`.
- [ ] **Phase 3: Surgical Removal of Old Engineering Dashboard**
  - [ ] Unmount and delete engineering calculators, simulation workbenches, 3D terrain toggles, and redundant technical drawers.
  - [ ] Extract and preserve raw geographic/asset datasets (`dams`, `sauni`, `khavda`, `dholera`, `transport`, `water`, `districts`).
- [ ] **Phase 4: 5-Destination Information Architecture**
  - [ ] Build unified responsive Header & Mobile Navigation (`Explore`, `Places to Explore`, `Infrastructure`, `Plan a Visit`, `About & Sources`).
  - [ ] Implement Universal Search indexing Places, Districts, Infrastructure Assets, and Major Projects.
- [ ] **Phase 5: Gujarati Heritage Design System**
  - [ ] Configure CSS design tokens (`#F7F2E8`, `#D8C3A5`, `#243B53`, `#A64036`, `#52664B`, `#C49A45`, `#282823`, `#777269`).
  - [ ] Load editorial serif (`Lora` / `DM Serif Display`), UI sans (`Manrope` / `Inter`), and `Noto Sans Gujarati`.
  - [ ] Build reusable SVG motif library (`StepwellCorner`, `AjrakhDivider`, `BandhaniPattern`, `JharokhaFrame`).
  - [ ] Restyle map base layer and feature markers to match the warm cartographic aesthetic.
- [ ] **Phase 6: Advanced Motion & Signature Discovery Transition**
  - [ ] Create centralized motion tokens (`immediate`, `micro`, `panel`, `editorial`) with `prefers-reduced-motion` hooks.
  - [ ] Implement the Signature Gujarati Discovery Transition between `Infrastructure` and `Places to Explore`.
- [ ] **Phase 7: Data Provenance & "Plan a Visit" Last-Mile MVP**
  - [ ] Implement strict TypeScript schemas for `DataProvenance` and `LastMileReadiness`.
  - [ ] Build deterministic readiness classifier (`Well documented`, `Some planning required`, `Important details unverified`).
  - [ ] Seed verified origin-to-destination journeys from **Ahmedabad** to 5 benchmark destinations with explicit last-mile gap disclosures.
- [ ] **Phase 8: Responsive Validation & Codebase Cleanup**
  - [ ] Prune dead files, unused imports, and obsolete packages.
  - [ ] Run production build (`npm run build`) and fix all TypeScript/linting errors.
  - [ ] Launch Antigravity Browser Sub-Agent to test desktop (`1440x900`), tablet (`768x1024`), and mobile (`390x844`) viewports, reduced motion, and keyboard navigation.
  - [ ] Generate Part 11 Factual Implementation Report (`walkthrough.md`).
```

---

## 4. DETAILED EXECUTION PHASES FOR GEMINI 3.8

### PHASE 1 & 2: REPOSITORY FORENSICS & REVERSIBLE CHECKPOINT

Gemini 3.8 must start by executing terminal commands via Antigravity's `run_command` tool to inspect the exact structure of the existing codebase without making assumptions.

#### 1.1 Automated Discovery Script
Instruct Gemini 3.8 to run:
```bash
# 1. Create a reversible git checkpoint before any destructive edits
git status
git checkout -b refactor/gujarat-public-discovery || git switch -c refactor/gujarat-public-discovery
git tag pre-refactor-checkpoint

# 2. Inspect dependencies, framework, and scripts
cat package.json

# 3. Map the directory structure (excluding node_modules and .next/.git)
find . -maxdepth 4 -not -path '*/.*' -not -path './node_modules*'
```

#### 1.2 Separating the "Kill List" from the "Preserve & Transform List"
Gemini 3.8 must classify every file in `src/` (or `app/`, `components/`, `pages/`, `lib/`) using the matrix below:

| Category | Modules / Features Found in Codebase | Required Action by Gemini 3.8 |
| :--- | :--- | :--- |
| **REMOVE COMPLETELY (Engineering & Specialist Bloat)** | • Structural / Highway / Bridge Scour / Foundation Calculators<br>• Superelevation & IRC Compliance Panels<br>• Hydrological Lab / Reservoir Operating Simulators<br>• Cyclone & Storm Surge Scenario Workbenches<br>• Unsupported Hazard / Vulnerability Scorecards<br>• Technical 3D Terrain Mode & Pitch/Exaggeration Sliders<br>• Spatial Tools (Buffer/Polygon/Measure GIS Console)<br>• Fake SCADA / Live Telemetry / Simulated Sensor Tickers<br>• Developer Config / Debug Drawers | **Delete UI components, state slices, calculation utilities, and route entry points.** Do not merely comment them out or hide them with CSS. |
| **PRESERVE & TRANSFORM (Core Public Data & Projects)** | • **Dams Inventory** (Sardar Sarovar, Ukai, Kadana, Dharoi, etc.)<br>• **SAUNI Lifeline** (Link 1, 2, 3, 4 pipelines & beneficiaries)<br>• **Khavda Renewable Energy Park** (Kutch solar/wind footprint)<br>• **Dholera SIR** (Special Investment Region boundary & infrastructure)<br>• **Transport Networks** (National/State Highways, Railways, Stations, Airports, Ports)<br>• **District & Taluka Boundaries** | **Extract raw GeoJSON/JSON/TS datasets** into a unified `/src/data/verified-registry/` module. Wrap every dataset with explicit provenance metadata and render through the new Public Asset Profile and Map Layer system. |

---

### PHASE 3 & 4: INFORMATION ARCHITECTURE & DATA SCHEMAS

To ensure zero hallucinated attributes and strict separation between verified facts and unknowns, Gemini 3.8 must implement the following TypeScript data architecture in `src/types/inframap.ts`.

#### 4.1 Core Data Provenance & Last-Mile TypeScript Schemas (`src/types/inframap.ts`)

```typescript
export type VerificationTier =
  | 'OFFICIAL_RECORD'        // Direct government/agency publication (e.g., Narmada Water Resources, GSRTC, Western Railway, ASI)
  | 'SECONDARY_VERIFIED'     // Cross-referenced public documentation
  | 'MANUALLY_REVIEWED'      // Audited project record with known date
  | 'DERIVED_GEOMETRY'       // Aerial/straight-line calculation (must be labeled as non-network)
  | 'UNVERIFIED_RECORD';     // Legacy dataset record awaiting source confirmation

export interface DataProvenance {
  sourceAgency: string;
  sourceTitle: string;
  sourceUrl?: string;
  publicationDate?: string;   // ISO YYYY-MM-DD or YYYY, or undefined if undated
  lastCheckedDate: string;    // e.g., '2026-10-18'
  datasetVersion?: string;
  verificationTier: VerificationTier;
  positionalAccuracyNote: string; // e.g., "Approximate centroid; coordinate decimals do not imply survey-grade accuracy."
  knownLimitations: string[];
}

export type InfrastructureCategory =
  | 'Water & Dams'
  | 'Water Transfer Schemes'
  | 'Renewable Energy'
  | 'Roads & Highways'
  | 'Railways & Stations'
  | 'Industrial & Regional Corridors';

export interface PublicInfrastructureAsset {
  id: string;
  slug: string;
  name: string;
  gujaratiName?: string;
  category: InfrastructureCategory;
  district: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  summary: string; // Plain-language explanation for citizens, students, and researchers
  verifiedCharacteristics: Array<{
    label: string;
    value: string;
    unit?: string;
    isVerified: boolean;
  }>;
  missingOrUnconfirmedFields: string[]; // Explicitly disclosed missing data
  responsibleAgency?: string;
  provenance: DataProvenance;
  relatedAssetIds: string[];
  relatedPlaceIds: string[];
}

export type PlaceCategory =
  | 'Iconic Gujarat'
  | 'Lesser-Known Places'
  | 'Nature & Wildlife'
  | 'Heritage & History'
  | 'Spiritual & Cultural'
  | 'Beaches & Coastal'
  | 'Weekend Destinations';

export interface PlaceToExplore {
  id: string;
  slug: string;
  name: string;
  gujaratiName?: string;
  category: PlaceCategory;
  district: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  tagline: string;
  significance: string; // Why the place matters culturally, historically, or ecologically
  visitorExperience: string[];
  image: {
    url: string;
    alt: string;
    attribution: string;
    licenseNote: string;
  };
  visitorLogistics: {
    openingHours: { value: string | null; status: 'VERIFIED' | 'UNVERIFIED_CHECK_LOCALLY' };
    entryFee: { value: string | null; status: 'VERIFIED' | 'UNVERIFIED_CHECK_LOCALLY' };
    permitsOrRestrictions: { value: string | null; status: 'VERIFIED' | 'UNVERIFIED_CHECK_LOCALLY' };
    seasonalNotes: string;
  };
  nearbyInfrastructureIds: string[];
  provenance: DataProvenance;
}

export type TripReadinessStatus =
  | 'WELL_DOCUMENTED'
  | 'SOME_PLANNING_REQUIRED'
  | 'IMPORTANT_DETAILS_UNVERIFIED';

export interface JourneyReadinessProfile {
  id: string;
  originCity: 'Ahmedabad'; // Initial validated origin
  destinationId: string;
  primaryAccessCorridor: {
    highwaySummary: string;
    nearestRailHub: {
      stationName: string;
      stationCode?: string;
      aerialDistanceKm: number; // Explicitly calculated or documented aerial/road distance
      roadDistanceKm?: number;  // Only populated if verified
      connectionVerified: boolean;
      note: string;
    };
    nearestBusNode: {
      depotName: string;
      serviceVerificationNote: string;
    };
  };
  lastMileGap: {
    hasLastMileUncertainty: boolean;
    headline: string; // e.g., "Nearby railway station identified. The onward connection from the station to this destination has not been verified."
    verifiedOptions: string[];
    unverifiedFactors: string[];
    returnJourneyWarning: string;
  };
  beforeYouGoChecklist: string[];
  provenance: DataProvenance;
}
```

#### 4.2 Deterministic Rules for Trip-Readiness Classification
Gemini 3.8 must never hardcode arbitrary readiness scores or percentages. Instead, implement this pure evaluation function in `src/lib/readiness-evaluator.ts`:

```typescript
import { JourneyReadinessProfile, PlaceToExplore, TripReadinessStatus } from '@/types/inframap';

export interface ReadinessEvaluationResult {
  status: TripReadinessStatus;
  badgeLabel: string;
  summaryExplanation: string;
  reasons: string[];
}

export function evaluateTripReadiness(
  place: PlaceToExplore,
  journey?: JourneyReadinessProfile
): ReadinessEvaluationResult {
  if (!journey) {
    return {
      status: 'IMPORTANT_DETAILS_UNVERIFIED',
      badgeLabel: 'Important details unverified',
      summaryExplanation:
        'Essential transit connections and last-mile access arrangements from your selected origin have not yet been audited for this location.',
      reasons: [
        'Origin-to-destination transport corridor has not been verified.',
        'Last-mile transfer availability and return transport options are undocumented.'
      ]
    };
  }

  const reasons: string[] = [];
  let hasCriticalUnknowns = false;
  let hasModerateUnknowns = false;

  // Check primary rail/highway documentation
  if (!journey.primaryAccessCorridor.nearestRailHub.connectionVerified) {
    hasModerateUnknowns = true;
    reasons.push(journey.primaryAccessCorridor.nearestRailHub.note);
  }

  // Check Last-Mile Gap
  if (journey.lastMileGap.hasLastMileUncertainty) {
    hasModerateUnknowns = true;
    reasons.push(journey.lastMileGap.headline);
  }

  // Check if essential visitor logistics are missing
  if (place.visitorLogistics.openingHours.status === 'UNVERIFIED_CHECK_LOCALLY') {
    hasModerateUnknowns = true;
    reasons.push('Current opening hours require confirmation with local authorities before departure.');
  }

  if (place.visitorLogistics.permitsOrRestrictions.status === 'UNVERIFIED_CHECK_LOCALLY') {
    hasCriticalUnknowns = true;
    reasons.push('Permit or entry restriction requirements are unverified.');
  }

  if (journey.provenance.verificationTier === 'UNVERIFIED_RECORD') {
    hasCriticalUnknowns = true;
    reasons.push('Underlying transport access dataset is awaiting updated verification.');
  }

  if (hasCriticalUnknowns) {
    return {
      status: 'IMPORTANT_DETAILS_UNVERIFIED',
      badgeLabel: 'Important details unverified',
      summaryExplanation:
        'Essential information is missing, conflicting, or too old to support a confident assessment without independent verification.',
      reasons
    };
  }

  if (hasModerateUnknowns) {
    return {
      status: 'SOME_PLANNING_REQUIRED',
      badgeLabel: 'Some planning required',
      summaryExplanation:
        'Primary road or rail corridors are documented, but last-mile transfers, return transport, or current visitor timings require confirmation.',
      reasons
    };
  }

  return {
    status: 'WELL_DOCUMENTED',
    badgeLabel: 'Well documented',
    summaryExplanation:
      'The essential journey corridors, nearest transport hubs, and visitor entry parameters are supported by credible public sources.',
    reasons: [
      'Primary highway and transport hub proximity documented.',
      'Last-mile transfer expectations and visitor access guidelines recorded.'
    ]
  };
}
```

---

### PHASE 5: THE GUJARATI HERITAGE DESIGN SYSTEM

Gemini 3.8 must strip out all dark-mode slate/neon classes (`bg-slate-900`, `text-cyan-400`, `border-emerald-500/30`, etc.) and replace the global stylesheet with the **Contemporary Gujarati Heritage** token system.

#### 5.1 Semantic Design Tokens (`src/styles/globals.css`)

```css
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Lora:ital,wght@0,500;0,600;1,400&family=Manrope:wght@400;500;600;700&family=Noto+Sans+Gujarati:wght@400;500;600&display=swap');

:root {
  /* Core Gujarati Heritage Palette */
  --color-ivory-paper: #F7F2E8;
  --color-ivory-elevated: #FDFBF7;
  --color-warm-sandstone: #D8C3A5;
  --color-sandstone-muted: #E8DCCB;
  --color-deep-indigo: #243B53;
  --color-indigo-hover: #1B2D40;
  --color-indigo-subtle: #EBF0F5;
  --color-madder-red: #A64036;
  --color-madder-subtle: #F9ECEA;
  --color-neem-green: #52664B;
  --color-neem-subtle: #EDF2EB;
  --color-turmeric-gold: #C49A45;
  --color-turmeric-subtle: #FAF3E3;
  --color-ink-charcoal: #282823;
  --color-muted-stone: #777269;

  /* Semantic Surface & Border Assignments */
  --bg-canvas: var(--color-ivory-paper);
  --bg-surface: var(--color-ivory-elevated);
  --bg-subtle: var(--color-sandstone-muted);
  --border-hairline: #DFD3C3;
  --border-architectural: var(--color-warm-sandstone);
  --border-focus: var(--color-deep-indigo);

  /* Semantic Map Category Colours */
  --map-water-dams: #243B53;        /* Deep Indigo */
  --map-water-transfer: #3B6978;    /* Stepwell Slate Blue */
  --map-energy-re: #C49A45;         /* Turmeric Gold */
  --map-transport-road: #A64036;    /* Madder Red */
  --map-transport-rail: #5C4D42;    /* Earth Timber */
  --map-nature-ecology: #52664B;    /* Neem Green */
  --map-heritage-places: #8C3B32;   /* Terracotta Madder */

  /* Typography Families */
  --font-serif: 'Lora', 'DM Serif Display', Georgia, serif;
  --font-sans: 'Manrope', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-gujarati: 'Noto Sans Gujarati', sans-serif;

  /* Motion Timing Tokens */
  --duration-immediate: 130ms;
  --duration-micro: 200ms;
  --duration-panel: 280ms;
  --duration-editorial: 450ms;
  --ease-architectural: cubic-bezier(0.22, 1, 0.36, 1);
}

body {
  background-color: var(--bg-canvas);
  color: var(--color-ink-charcoal);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

h1, h2, .font-editorial {
  font-family: var(--font-serif);
  letter-spacing: -0.015em;
}

.lang-gu {
  font-family: var(--font-gujarati);
}
```

#### 5.2 Contrast Verification Table (WCAG 2.1 Compliance)
Gemini 3.8 must adhere to these verified foreground/background pairings:
*   **Primary Body Text:** Ink Charcoal (`#282823`) on Ivory Paper (`#F7F2E8`) $\rightarrow$ Contrast Ratio $\approx 13.1:1$ (Exceeds AAA).
*   **Primary Interactive & Headings:** Deep Indigo (`#243B53`) on Ivory Paper (`#F7F2E8`) $\rightarrow$ Contrast Ratio $\approx 9.8:1$ (Exceeds AAA).
*   **Secondary Metadata:** Muted Stone (`#777269`) on Ivory Elevated (`#FDFBF7`) $\rightarrow$ Contrast Ratio $\approx 4.6:1$ (Meets AA for normal text; use `#5E5A52` for $12\text{px}$ metadata badges to achieve $\ge 6.2:1$).
*   **Madder Red Emphasis:** Madder Red (`#A64036`) on Ivory Paper (`#F7F2E8`) $\rightarrow$ Contrast Ratio $\approx 5.3:1$ (Meets AA).
*   **Turmeric Gold Highlights:** Never use raw `#C49A45` for small text on Ivory. Use `#C49A45` as an accent border, icon fill, or badge background paired with `#282823` Ink Charcoal text.

#### 5.3 Reusable Gujarati Architectural & Textile SVG Motifs (`src/components/heritage/GujaratiMotifs.tsx`)
To ensure cultural identity emerges from disciplined architectural geometry rather than cluttered clipart, Gemini 3.8 should implement this exact SVG component suite:

```tsx
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
        {/* Subtle inner architectural arch line */}
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
```

---

### PHASE 6: ADVANCED MOTION ENGINEERING & THE SIGNATURE TRANSITION

#### 6.1 Centralized Motion Tokens (`src/lib/motion-tokens.ts`)
Gemini 3.8 must inspect `package.json` first. If `framer-motion` or `motion` is already installed, reuse it. If neither is installed, install `motion` (`npm install motion`) and define these exact presets:

```typescript
import { Transition } from 'motion/react';

export const MOTION_TOKENS = {
  // 100-160ms: Immediate button/control feedback
  immediate: {
    type: 'tween',
    duration: 0.13,
    ease: [0.22, 1, 0.36, 1]
  } satisfies Transition,

  // 160-240ms: Small interface transitions (search dropdowns, layer pills)
  micro: {
    type: 'tween',
    duration: 0.2,
    ease: [0.22, 1, 0.36, 1]
  } satisfies Transition,

  // 220-360ms: Panel and layout transitions (Asset Inspector drawer, Mode switcher)
  panelSpring: {
    type: 'spring',
    stiffness: 340,
    damping: 32,
    mass: 0.85
  } satisfies Transition,

  // 350-600ms: Occasional editorial reveals & stepwell line drawing
  editorialReveal: {
    type: 'tween',
    duration: 0.45,
    ease: [0.16, 1, 0.3, 1]
  } satisfies Transition
};
```

#### 6.2 Implementing the Signature Gujarati Discovery Transition (`src/components/navigation/DiscoveryModeSwitcher.tsx`)
Part 6 (Section 16) requires a signature, restrained transition when switching between **Infrastructure** and **Places to Explore** where:
1. A small architectural/textile geometric detail transitions (morphing between a **Stepwell Geometric Grid** for *Infrastructure* and a **Bandhani/Jharokha Motif** for *Places to Explore*).
2. The active mode indicator moves smoothly using shared layout animation (`layoutId`).
3. Relevant navigation and map context update coherently without unmounting or resetting the underlying Gujarat map viewport.
4. Respects `useReducedMotion()` from `motion/react`.

```tsx
'use client';

import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { MOTION_TOKENS } from '@/lib/motion-tokens';

export type DiscoveryLens = 'places' | 'infrastructure';

interface DiscoveryModeSwitcherProps {
  activeLens: DiscoveryLens;
  onChangeLens: (lens: DiscoveryLens) => void;
}

export function DiscoveryModeSwitcher({
  activeLens,
  onChangeLens
}: DiscoveryModeSwitcherProps) {
  const prefersReducedMotion = useReducedMotion();
  const transition = prefersReducedMotion ? { duration: 0 } : MOTION_TOKENS.panelSpring;

  return (
    <div className="inline-flex items-center gap-2 p-1 rounded-lg bg-[#E8DCCB]/75 border border-[#D8C3A5]">
      {/* Animated Gujarati Geometric Crest that morphs between Places and Infrastructure */}
      <div className="w-8 h-8 flex items-center justify-center rounded bg-[#FDFBF7] border border-[#D8C3A5]/80">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <AnimatePresence mode="wait" initial={false}>
            {activeLens === 'places' ? (
              <motion.g
                key="places-motif"
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.82, rotate: -15 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.82, rotate: 15 }}
                transition={MOTION_TOKENS.micro}
              >
                {/* Jharokha & Bandhani 4-Dot Cultural Motif */}
                <path
                  d="M4 20V11C4 6.5 12 3 12 3C12 3 20 6.5 20 11V20H4Z"
                  stroke="#A64036"
                  strokeWidth="1.6"
                />
                <circle cx="12" cy="11" r="1.5" fill="#C49A45" />
                <circle cx="9.5" cy="14.5" r="1.2" fill="#243B53" />
                <circle cx="14.5" cy="14.5" r="1.2" fill="#243B53" />
              </motion.g>
            ) : (
              <motion.g
                key="infra-motif"
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.82, rotate: 15 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.82, rotate: -15 }}
                transition={MOTION_TOKENS.micro}
              >
                {/* Adalaj Stepwell Concentric Architectural Geometry */}
                <rect x="3" y="3" width="18" height="18" stroke="#243B53" strokeWidth="1.6" />
                <rect x="7" y="7" width="10" height="10" stroke="#52664B" strokeWidth="1.4" />
                <path d="M3 12H7M17 12H21M12 3V7M12 17V21" stroke="#C49A45" strokeWidth="1.4" />
              </motion.g>
            )}
          </AnimatePresence>
        </svg>
      </div>

      {/* Mode Buttons with Shared Layout Indicator */}
      <div className="relative flex items-center" role="tablist" aria-label="Discovery Mode">
        {(['places', 'infrastructure'] as const).map((lens) => {
          const isActive = activeLens === lens;
          const label = lens === 'places' ? 'Places to Explore' : 'Infrastructure';
          return (
            <button
              key={lens}
              role="tab"
              aria-selected={isActive}
              onClick={() => onChangeLens(lens)}
              className={`relative z-10 px-3.5 py-1.5 text-sm font-medium rounded-md transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#243B53] ${
                isActive ? 'text-[#F7F2E8]' : 'text-[#282823] hover:text-[#243B53]'
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="gujarat-discovery-active-pill"
                  transition={transition}
                  className="absolute inset-0 -z-10 rounded-md bg-[#243B53] shadow-xs"
                />
              )}
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
```

---

### PHASE 7: CURATED & VERIFIED "PLAN A VISIT" SEED ARCHITECTURE (AHMEDABAD ORIGIN MVP)

Part 5 (Section 13) requires starting with **Ahmedabad** as the supported origin and **3 to 5 carefully validated destinations** whose access and last-mile constraints are honestly represented without inventing timetables or bus numbers.

Gemini 3.8 must implement the following 5 validated destination-readiness profiles in `src/data/verified-registry/plan-visit-seed.ts`, connecting directly to nearby infrastructure assets preserved from the existing codebase:

1. **Adalaj ni Vav (Gandhinagar District)**
   * **Readiness Status:** `WELL_DOCUMENTED`
   * **Primary Access from Ahmedabad:** Located along NH-147 / Sarkhej–Gandhinagar Highway corridor ($\approx 18\text{–}20\text{ km}$ north of central Ahmedabad).
   * **Nearest Rail Hub:** Kalupur (Ahmedabad Junction, ADI) or Sabarmati Junction (SBT).
   * **Last-Mile Disclosure:** Direct road access via SG Highway; urban bus and auto-rickshaw connections operate along the Ahmedabad–Adalaj corridor, though exact stop-to-monument walking distance ($\approx 400\text{ m}$) and evening return availability should be planned.
   * **Connected Infrastructure Layer:** Narmada Main Canal (crosses just south of Adalaj).
   * **Source Attribution:** Archaeological Survey of India (ASI) Vadodara Circle & Gujarat Tourism public records.

2. **Sun Temple, Modhera (Mehsana District)**
   * **Readiness Status:** `SOME_PLANNING_REQUIRED`
   * **Primary Access from Ahmedabad:** Via SH-41 / Ahmedabad–Mehsana–Becharaji highway corridor ($\approx 100\text{ km}$ road distance).
   * **Nearest Rail Hub:** Mehsana Junction (MSH), located $\approx 25\text{ km}$ east of the monument.
   * **Last-Mile Gap Signature Disclosure:** *"Nearby railway station identified (Mehsana Junction, ~25 km). The onward connection from Mehsana station to Modhera relies on regional GSRTC buses or private taxis whose live schedules are not verified on this platform."*
   * **Connected Infrastructure Layer:** Pushpavati River basin & Sujalam Sufalam / North Gujarat canal network; Modhera Solar-Powered Heritage Village renewable energy project.
   * **Source Attribution:** Archaeological Survey of India (ASI) & Gujarat Energy Development Agency (GEDA) project documentation.

3. **Sardar Sarovar Dam & Ekta Nagar / Statue of Unity (Narmada District)**
   * **Readiness Status:** `WELL_DOCUMENTED`
   * **Primary Access from Ahmedabad:** Express highway corridor via NH-48 (Ahmedabad–Vadodara) connecting to SH-11 / Dabhoi–Ekta Nagar corridor ($\approx 195\text{–}200\text{ km}$).
   * **Nearest Rail Hub:** Ekta Nagar Railway Station (EKNR).
   * **Last-Mile Disclosure:** Local electric shuttle buses and dedicated last-mile visitor transit operate inside the Ekta Nagar precinct from the railway station and parking hubs to the viewing gallery and dam viewpoints, but entry tickets and viewing slots require prior booking on the official portal.
   * **Connected Infrastructure Layer:** Sardar Sarovar Dam asset profile, Main Canal headworks, and Riverbed/Canal Head Hydropower stations.
   * **Source Attribution:** Sardar Sarovar Narmada Nigam Ltd. (SSNNL) & Official Statue of Unity / Ekta Nagar Authority links.

4. **Lothal Archaeological Site & Museum (Ahmedabad District, Dholka Taluka)**
   * **Readiness Status:** `SOME_PLANNING_REQUIRED`
   * **Primary Access from Ahmedabad:** Via NH-47 / Bagodara highway corridor ($\approx 80\text{ km}$ southwest of Ahmedabad).
   * **Nearest Rail Hub:** Lothal Bhurkhi station (on the Bhavnagar–Gandhigram line, $\approx 6\text{ km}$ aerial distance from the mound).
   * **Last-Mile Gap Signature Disclosure:** *"Nearby railway station identified (Lothal Bhurkhi). However, train frequency is limited and the ~6 km onward road transfer from the halt station to the archaeological site has no confirmed dedicated shuttle service. Visitors arriving without a personal vehicle should verify return transport in advance."*
   * **Connected Infrastructure Layer:** Dholera SIR northern access corridor and Sabarmati/Bhogavo delta geography.
   * **Source Attribution:** Archaeological Survey of India (ASI) & National Maritime Heritage Complex public notices.

5. **Dholavira — Harappan Metropolis & Khavda Corridor (Kutch District)**
   * **Readiness Status:** `IMPORTANT_DETAILS_UNVERIFIED`
   * **Primary Access from Ahmedabad:** Long-distance highway journey via NH-27 and Rapar / Khadir Bet causeway ($\approx 360\text{–}380\text{ km}$).
   * **Nearest Rail Hub:** Bhuj Railway Station or Samakhiali Junction (both $>100\text{ km}$ from Khadir Bet).
   * **Last-Mile Gap Signature Disclosure:** *"Major last-mile distance gap identified. Nearest major railheads are over 100 km away. Access crosses remote Rann causeways where fuel stations, public bus frequency, and evening return transport are sparse and unverified."*
   * **Connected Infrastructure Layer:** Road to Heaven (Khadir–Kutch causeway infrastructure) & Khavda Renewable Energy Park profile in northern Kutch.
   * **Source Attribution:** UNESCO World Heritage Dossier (Dholavira) & Gujarat Road Infrastructure public documentation.

---

### PHASE 8: MAP ENGINE REFACTOR & RESPONSIVE ARCHITECTURE

When refactoring the map component (whether built on `maplibre-gl`, `react-map-gl`, or `leaflet` in the current repo), Gemini 3.8 must enforce the following rules:

#### 8.1 Map Controls & Layer Selector Cleanup
1. **Delete Floating Specialist Panels:** Remove all floating GIS toolbars (polygon draw, buffer radius, elevation profile, 3D terrain pitch button, coordinate grid overlays, and dual district dropdowns).
2. **Retain Clean Public Controls:**
   * Top-Left or Top-Center: Compact Layer Filter Pill Bar (`Roads`, `Railways`, `Water & Dams`, `Renewable Energy`, `Public Projects`, `Heritage & Nature`). Only render toggles for layers that have real non-empty GeoJSON/JSON features in the repository.
   * Bottom-Right: Standard `+` / `-` Zoom buttons and a single **"Reset Gujarat View"** button (`bounds: [[68.1, 20.1], [74.5, 24.7]]`).
3. **Cartographic Styling:**
   * Style the base map container and water/land fills (or CSS filter / vector style overrides) so it harmonizes with Ivory Paper (`#F7F2E8`), Warm Sandstone (`#D8C3A5`), and Deep Indigo (`#243B53`) water bodies.
   * Implement marker clustering (`supercluster` or native GeoJSON source clustering `cluster: true, clusterMaxZoom: 11, clusterRadius: 45`) if a layer contains $>50$ point features (such as state dams) so the map never visually overloads.

#### 8.2 Contextual Asset Inspector & Mobile Bottom Sheet
* **Desktop (`>= 1024px`):** Clicking a marker opens a clean right-hand contextual inspector (`w-[400px]`) with smooth `MOTION_TOKENS.panelSpring` entrance, preserving full map pan/zoom usability on the left.
* **Tablet (`768px - 1023px`):** Contextual panel docks cleanly (`w-[340px]`) without overlapping the top search bar.
* **Mobile (`< 768px`):**
  * Top compact brand bar + immediate search trigger.
  * Map occupies full viewport height minus header and bottom navigation bar.
  * Layer selector and Selected Asset Inspector open in a scrollable **Bottom Sheet** (`max-h-[75vh]`, `overflow-y-auto`, rounded top corners, minimum $44 \times 44\text{px}$ touch targets, zero horizontal overflow).

---

### PHASE 9: ANTIGRAVITY BROWSER SUB-AGENT VERIFICATION PROTOCOL

In Google Antigravity, Gemini 3.8 must not stop after `npm run build` succeeds. It must spawn the **Browser Sub-Agent** against the local dev server (`http://localhost:3000` or Vite port) and execute this exact visual & functional verification checklist:

```markdown
### Antigravity Browser Sub-Agent Test Script
1. **Desktop Audit (`1440x900`):**
   - Navigate to `/`. Verify headline ("A closer look at Gujarat.") and immediate map access without a blocking marketing splash page.
   - Inspect DOM to verify zero occurrences of: `Water Lab`, `Cyclone`, `Geoenv`, `Intelligence`, `Spatial Tools`, `3D Terrain`, `SCADA`, `Bridge Scour`, or `Superelevation`.
   - Click between `Places to Explore` and `Infrastructure` in the switcher. Verify the Signature Gujarati Discovery Transition runs smoothly without resetting map state.
   - Click a Dam marker (e.g., Sardar Sarovar or Ukai) and a Project profile (SAUNI or Khavda RE). Verify the Asset Inspector displays:
     - Plain-language description
     - Verified characteristics
     - Source agency & link
     - Publication / last-checked date
     - Explicit missing-data or positional-accuracy notes
     - Working `Zoom to Location`, `Copy Coordinates`, and `Explore Nearby` buttons.

2. **Plan a Visit Workflow Audit (`/plan-visit`):**
   - Select Origin: `Ahmedabad`.
   - Test switching across the 5 verified destinations (`Adalaj ni Vav`, `Modhera Sun Temple`, `Sardar Sarovar / Ekta Nagar`, `Lothal`, `Dholavira`).
   - Verify each displays its deterministic readiness badge (`Well documented`, `Some planning required`, or `Important details unverified`), nearest rail hub aerial/road distance distinction, and the highlighted **Last-Mile Gap** box.

3. **Mobile Responsive Audit (`390x844`):**
   - Resize Browser Sub-Agent viewport to `390x844`.
   - Verify `document.documentElement.scrollWidth <= window.innerWidth` (Zero horizontal scrollbars).
   - Open mobile navigation menu, test layer bottom sheet, and select a map marker to confirm scrollable asset sheet usability.

4. **Accessibility & Reduced Motion Audit:**
   - Emulate `prefers-reduced-motion: reduce` in the Browser Sub-Agent and verify mode switching and panel transitions remain instantaneous and functional.
   - Test `Tab` key focus ring visibility across header links, search input, layer pills, and asset inspector close button.
   - Check Browser Console logs and confirm zero unhandled runtime errors or broken network requests.
```

---

## 5. MASTER KICKOFF TRIGGER PROMPT (PASTE INTO ANTIGRAVITY CHAT)

Once you have saved `.antigravity/rules.md` or opened the project workspace in Google Antigravity with **Gemini 3.8** selected, paste the following prompt into the Agent chat to initiate autonomous end-to-end execution:

```text
@workspace Execute the complete Gujarat InfraMap Product Refactor, Gujarati Heritage Redesign, Public Discovery Experience, and Advanced Motion Engineering according to `.antigravity/rules.md` and the 10-step implementation workflow.

Do not stop after writing an implementation plan or hiding old UI elements with CSS. Execute all 10 steps directly in the repository:

1. Run terminal forensics to inspect `package.json`, routes, components, and all data files. Create a reversible git branch/tag checkpoint first.
2. Completely remove the old specialist engineering dashboard (`Water Lab`, `Cyclone & Surge`, `Geoenv`, `Intelligence`, `Spatial Tools`, `3D Terrain Mode`, engineering calculators, bridge scour/superelevation tools, and fake telemetry/SCADA displays) from the codebase and routing table.
3. Preserve and transform all valid datasets (`Dams`, `SAUNI Lifeline`, `Khavda RE`, `Dholera SIR`, `Roads`, `Railways`, `Districts`) into structured public asset profiles and clean map layers with explicit `DataProvenance` metadata.
4. Implement the 5-destination Information Architecture (`Explore`, `Places to Explore`, `Infrastructure`, `Plan a Visit`, `About & Sources`).
5. Implement the Gujarati Heritage Design System (`#F7F2E8` Ivory paper, `#D8C3A5` Warm sandstone, `#243B53` Deep indigo, `#A64036` Madder red, `#52664B` Neem green, `#C49A45` Turmeric gold, `#282823` Ink charcoal, `#777269` Muted stone; `Lora`/`DM Serif Display` + `Manrope`/`Inter` + `Noto Sans Gujarati`) and reusable SVG architectural motifs (`StepwellCornerFrame`, `AjrakhSectionDivider`, `JharokhaPhotoFrame`).
6. Implement the centralized motion tokens and the Signature Gujarati Discovery Transition between `Places to Explore` and `Infrastructure`, including full `prefers-reduced-motion` support.
7. Build the `Plan a Visit` destination-readiness engine featuring the deterministic 3-tier status classifier (`Well documented`, `Some planning required`, `Important details unverified`) and the signature Last-Mile Gap disclosure for Ahmedabad to the initial 5 verified destinations.
8. Clean up dead code, unused imports, and obsolete dependencies. Run `npm run build` to verify zero TypeScript or build errors.
9. Launch the Antigravity Browser Sub-Agent to visually and functionally test Desktop (`1440x900`), Mobile (`390x844`), keyboard accessibility, and reduced-motion behavior.
10. Deliver the Part 11 Factual Final Report in `walkthrough.md` detailing every removed module, retained dataset, redesigned component, motion check, and verified source.
```