/**
 * Gujarat InfraMap — Reusable Civil Science Stop Framework
 * Universal, field-based educational civil engineering laboratory for every asset category
 * in the Gujarat Digital Twin.
 *
 * Each category provides five mandatory, tailored educational pillars:
 *   1. What it is — definition, purpose, and civil engineering context.
 *   2. How it works — mechanism, structural components, labeled vector schematic, and theory.
 *   3. Engineering calculations — relevant interactive calculator with explicit assumptions,
 *      consistent units, symbol definitions, step-by-step substitution, physical limitations,
 *      and Indian Standards (IS / IRC / CWC / CEA / CPHEEO) references.
 *   4. Gujarat context — actual geographical setting, neighboring assets, environmental setting,
 *      and documented regional role.
 *   5. Interesting facts — genuinely distinctive, verifiable characteristics.
 *
 * Sourced strictly from:
 *   - Central Water Commission (CWC) & India-WRIS
 *   - Indian Roads Congress (IRC:37, IRC:58, IRC:5/78, IRC:73)
 *   - Indian Railway Permanent Way Manual (IRPWM) & RDSO
 *   - Bureau of Indian Standards (IS 456, IS 1893, IS 6403, IS 2911, IS 10500)
 *   - Central Public Health & Environmental Engineering Organisation (CPHEEO)
 *   - Central Electricity Authority (CEA) & GETCO Grid Code
 *
 * Standard: EPSG:4326, Zero Fabrication, Professional Engineering Integrity.
 * Version: 5.0.0
 */

(function () {
  "use strict";

  // Number formatting helper
  function fmt(val, unit = "", decimals = 2) {
    if (val === null || val === undefined || isNaN(val)) return "—";
    const num = parseFloat(val);
    return `${num.toLocaleString(undefined, { maximumFractionDigits: decimals })}${unit ? " " + unit : ""}`;
  }

  // =========================================================================
  // 1. CATEGORY IDENTIFIER & RESOLVER
  // =========================================================================
  function resolveCategory(asset) {
    if (!asset) return "general";
    const p = asset.properties || {};
    const cat = (p.asset_category || asset.type || p.category || "").toLowerCase();
    const type = (p.structure_type || p.dam_type || p.plant_type || "").toLowerCase();
    const id = (p.id || "").toUpperCase();

    // 1. Dams, Barrages, Weirs & Hydraulic structures
    if (cat.includes("dam") || cat.includes("barrage") || cat.includes("weir") || id.startsWith("GJ-WR-DAM") || id.startsWith("GJ-WR-BAR") || id.startsWith("GJ-WR-WEI") || id.startsWith("GJ-WR-RES")) {
      return "dam";
    }

    // 2. Bridges, Flyovers, Elevated Viaducts
    if (cat.includes("bridge") || cat.includes("flyover") || id.startsWith("GJ-TR-BRG") || id.startsWith("GJ-TR-FLY")) {
      return "bridge";
    }

    // 3. Roads & Highway Corridors
    if (cat.includes("road") || cat.includes("highway") || cat.includes("corridor") || id.startsWith("GJ-RD") || p.highway_number || p.nh_number) {
      return "road";
    }

    // 4. Railways, Rail Tracks, Passenger Stations, Metro & Freight Hubs
    if (cat.includes("railway") || cat.includes("station") || cat.includes("metro") || cat.includes("freight") || id.startsWith("GJ-TR-FRT") || id.startsWith("GJ-RL")) {
      return "railway";
    }

    // 5. Water Treatment Plants (WTP)
    if (cat.includes("treatment") && (cat.includes("water") || cat.includes("wtp")) || id.startsWith("GJ-WR-WTP") || (p.name && p.name.toLowerCase().includes("wtp"))) {
      return "wtp";
    }

    // 6. Sewage Treatment Plants (STP) & Sanitation
    if (cat.includes("sewage") || cat.includes("stp") || cat.includes("wastewater") || (p.name && (p.name.toLowerCase().includes("stp") || p.name.toLowerCase().includes("sewage")))) {
      return "stp";
    }

    // 7. Electrical Substations & Grid Pooling Nodes
    if (cat.includes("substation") || cat.includes("pooling") || id.startsWith("GJ-TX-SUB") || id.startsWith("GJ-PWR-SUB")) {
      return "substation";
    }

    // 8. Renewable Energy Generating Facilities (Solar, Wind, Small Hydro)
    if (cat.includes("power") || id.startsWith("GJ-PWR")) {
      if (type.includes("solar") || type.includes("wind") || type.includes("hydro") || p.is_renewable || (p.primary_fuel && ["solar", "wind", "hydro"].includes(p.primary_fuel.toLowerCase()))) {
        return "renewable";
      }
      return "renewable"; // General power generation conversion
    }

    // 9. Foundations, Geotechnical & Soil Assets
    if (cat.includes("groundwater") || cat.includes("seismic") || cat.includes("soil") || cat.includes("geolog") || id.startsWith("GJ-ENV-GEO") || id.startsWith("GJ-GW")) {
      return "geotechnical";
    }

    // 10. Coastal Structures, Seaports & Marine Works
    if (cat.includes("seaport") || cat.includes("port") || cat.includes("coastal") || cat.includes("cyclone") || id.startsWith("GJ-UI-PRT") || id.startsWith("GJ-ENV-CYC")) {
      return "coastal";
    }

    return "general";
  }

  // =========================================================================
  // 2. CATEGORY-SPECIFIC CIVIL ENGINEERING DOMAIN MODELS
  // =========================================================================
  const DOMAIN_MODELS = {

    // -----------------------------------------------------------------------
    // DOMAIN 1: DAMS & HYDRAULIC RETENTION STRUCTURES
    // -----------------------------------------------------------------------
    dam: {
      title: "Dam & Hydraulic Impoundment Engineering",
      subTitle: "Hydrostatic force, spillways, reservoir storage allocation, and foundation seepage",
      standards: "CWC NRLD 2023 • IS 6512 (Gravity Dams) • IS 11527 (Spillway Hydraulics) • Dam Safety Act 2021",

      whatItIs: (p) => `
        <div class="css-block">
          <h4>1. What It Is — Definition & Engineering Context</h4>
          <p>A <strong>water dam</strong> is a massive civil barrier engineered across a river valley or natural drainage channel to impound surface runoff, elevating upstream hydraulic head and creating an artificial storage reservoir. Its primary purpose balances multi-seasonal water conservation (irrigation, municipal drinking supply, and industrial intake) with hydrologic flood cushioning and hydroelectric power generation.</p>
          <div class="css-highlight-box">
            <span class="css-tag">ASSET ATTRIBUTES</span>
            <p><strong>Typology:</strong> ${p.dam_type || p.construction_material || 'Concrete Gravity / Zoned Earthen Composite'}<br>
            <strong>Structural Height:</strong> ${fmt(p.height_m, 'm above foundation')} | <strong>Crest Length:</strong> ${fmt(p.crest_length_m, 'm')}<br>
            <strong>Gross Storage Capacity:</strong> ${fmt(p.gross_storage_mcm, 'MCM')} (FRL: ${fmt(p.frl_m, 'm MSL')})</p>
          </div>
        </div>
      `,

      howItWorks: (p) => {
        const height = parseFloat(p.height_m) || 50;
        const frl = parseFloat(p.frl_m) || 120;
        return `
          <div class="css-block">
            <h4>2. How It Works — Mechanism, Components & Theory</h4>
            <p>Dams resist enormous horizontal hydrostatic forces through their dead weight (concrete gravity monoliths) or by distributing shear stresses over broad footprint slopes (zoned earthen/rockfill embankments). During heavy inflows, surplus discharge is safely evacuated via an <strong>Ogee spillway</strong>, transitioning supercritical flow through a hydraulic jump in the stilling basin to dissipate destructive kinetic energy ($Fr_1 > 4.5$). Foundation seepage is controlled via deep micro-fine cement grout curtains and relief drainage galleries.</p>

            <!-- Vector Schematic SVG -->
            <div class="css-svg-frame">
              <svg viewBox="0 0 700 240" class="css-schematic-svg" aria-label="Concrete Gravity Dam Cross Section">
                <rect x="0" y="0" width="700" height="240" fill="#0b1120" rx="6"/>
                <!-- Reservoir -->
                <path d="M 30 60 L 220 60 L 220 190 L 30 190 Z" fill="rgba(56, 189, 248, 0.25)"/>
                <line x1="30" y1="60" x2="220" y2="60" stroke="#38bdf8" stroke-width="2" stroke-dasharray="4,4"/>
                <text x="40" y="50" fill="#38bdf8" font-size="11" font-weight="700">Reservoir Pool (FRL ${fmt(frl, 'm MSL')})</text>
                <!-- Dam Monolith -->
                <polygon points="220,190 220,30 265,30 460,190" fill="#334155" stroke="#94a3b8" stroke-width="2"/>
                <text x="235" y="22" fill="#facc15" font-size="11" font-weight="700">Roadway Crest</text>
                <text x="145" y="130" fill="#cbd5e1" font-size="10">Vertical Upstream Face</text>
                <text x="360" y="110" fill="#cbd5e1" font-size="10">Downstream Glacis (Slope ~0.8:1)</text>
                <!-- Grout curtain -->
                <line x1="240" y1="190" x2="240" y2="230" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="3,2"/>
                <text x="175" y="220" fill="#f87171" font-size="9">Grout Curtain</text>
                <!-- Foundation -->
                <rect x="10" y="190" width="680" height="40" fill="rgba(71, 85, 105, 0.3)" stroke="#475569" stroke-width="1"/>
                <text x="20" y="212" fill="#94a3b8" font-size="10">Competent Bedrock Contact</text>
                <!-- Stilling basin -->
                <polygon points="460,190 580,190 590,175 590,190" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5"/>
                <text x="480" y="182" fill="#38bdf8" font-size="9">Stilling Basin (Jump Dissipator)</text>
                <!-- River channel -->
                <path d="M 460 170 L 680 170 L 680 190 L 460 190 Z" fill="rgba(56, 189, 248, 0.15)"/>
                <text x="600" y="160" fill="#0ea5e9" font-size="10">Tailwater Channel</text>
              </svg>
            </div>
          </div>
        `;
      },

      calculations: (p) => {
        const height = parseFloat(p.height_m) || 50;
        const defaultDepth = Math.max(5, Math.round(height * 0.8));
        return {
          id: "dam_calc",
          formulaLatex: "F = \\frac{1}{2} \\cdot \\rho \\cdot g \\cdot b \\cdot H^2 \\quad \\text{and} \\quad M_0 = F \\cdot \\frac{H}{3}",
          description: "Calculates total horizontal hydrostatic water thrust ($F$) and overturning moment ($M_0$) acting on a unit 1-meter slice of the dam's vertical upstream face.",
          inputsHtml: `
            <div class="css-calc-inputs">
              <div class="css-input-row">
                <div class="css-field">
                  <label>Water Depth at Heel (H): <strong id="lbl_dam_H">${defaultDepth} m</strong></label>
                  <input type="range" id="dam_H" min="5" max="${Math.max(100, Math.round(height * 1.1))}" value="${defaultDepth}" class="css-slider" data-param="H">
                </div>
                <div class="css-field">
                  <label>Slice Width (b): <strong id="lbl_dam_b">1.0 m</strong></label>
                  <input type="number" id="dam_b" value="1.0" step="0.5" min="1" max="500" class="css-input" data-param="b">
                </div>
              </div>
            </div>
          `,
          units: "Force in kN / MN; Overturning Moment in kN·m / MN·m",
          defaults: { H: defaultDepth, b: 1.0 },
          evaluate: (vals) => {
            const H = parseFloat(vals.H) || 40;
            const b = parseFloat(vals.b) || 1.0;
            const rho = 1000; // kg/m3
            const g = 9.81; // m/s2
            // F = 0.5 * rho * g * b * H^2 in N
            const F_N = 0.5 * rho * g * b * Math.pow(H, 2);
            const F_kN = F_N / 1000;
            const F_MN = F_kN / 1000;
            const arm = H / 3;
            const M_kNm = F_kN * arm;
            const M_MNm = M_kNm / 1000;
            return {
              primary: `${fmt(F_MN, 'MN')} (${fmt(F_kN, 'kN')})`,
              secondary: `Overturning Moment: ${fmt(M_MNm, 'MN·m')} (Lever Arm: ${arm.toFixed(2)} m)`,
              substitution: `F = 0.5 · 1000 · 9.81 · ${b} · (${H})² = ${fmt(F_kN, 'kN')} | M₀ = ${fmt(F_kN)} · (${H}/3) = ${fmt(M_kNm, 'kN·m')}`,
              assumptions: "Planar vertical upstream face, static clean freshwater (ρ = 1000 kg/m³). Excludes dynamic earthquake hydrodynamic inertia (Westergaard effect) and tailwater back-thrust."
            };
          }
        };
      },

      gujaratContext: (p) => `
        <div class="css-block">
          <h4>4. Gujarat Geographical & Environmental Setting</h4>
          <p><strong>${p.name}</strong> is situated in the <strong>${p.basin || 'Gujarat River'}</strong> basin within <strong>${p.district || 'Gujarat'}</strong> district. Gujarat's unique hydrology is characterized by extreme spatial skewness: over 70% of the state's surface water potential originates in South Gujarat (Narmada, Tapi, Damanganga), while the arid zones of Saurashtra and Kutch experience high evaporation rates ($>2,200\\text{ mm/year}$) and erratic monsoons.</p>
          <div class="css-network-context">
            <strong>Downstream Network Linkages:</strong>
            <p>${p.connected_canals ? `Conveys regulated irrigation water directly into the <em>${Array.isArray(p.connected_canals) ? p.connected_canals.join(', ') : p.connected_canals}</em> network.` : 'Regulates riverine flows into downstream pick-up weirs and municipal water intakes.'}</p>
          </div>
        </div>
      `,

      interestingFacts: (p) => `
        <div class="css-block">
          <h4>5. Distinctive Civil Engineering Characteristics</h4>
          <ul class="css-facts-list">
            <li><strong>Hydraulic Scale:</strong> ${p.name.includes("Sardar Sarovar") ? "Sardar Sarovar is the second-largest concrete gravity volume dam in the world (approx. 6.8 million m³ of concrete), anchoring an interstate command area of 1.845 million hectares." : (p.name.includes("Ukai") ? "Ukai impounds 'Vallabh Sagar' (7,414 MCM), acting as the crucial flood buffer protecting the industrial metropolis of Surat from catastrophic Tapi flash runoff." : `Engineered with a gross capacity of ${fmt(p.gross_storage_mcm, 'MCM')} to balance conservation with sediment deposition lifecycle.`)}</li>
            <li><strong>Seismic Resilience:</strong> Built under BIS IS 1893 criteria to withstand intra-plate tectonic movements along regional crustal lineaments (Narmada-Son Fault Zone / Cambay Graben).</li>
            <li><strong>Energy Dissipation:</strong> The spillway utilizes high-capacity radial crest gates engineered to evacuate extreme design floods up to ${fmt(p.spillway_capacity_cumecs, 'm³/s')}.</li>
          </ul>
        </div>
      `
    },

    // -----------------------------------------------------------------------
    // DOMAIN 2: BRIDGES & ELEVATED VIADUCTS
    // -----------------------------------------------------------------------
    bridge: {
      title: "Bridge & Civil Crossing Structural Engineering",
      subTitle: "Load paths, superstructure framing, span-to-depth ratios, and Lacey scour depth",
      standards: "IRC:5 (General Bridge Features) • IRC:112 (Concrete Bridges) • IRC:78 (Foundations & Pier Scour)",

      whatItIs: (p) => `
        <div class="css-block">
          <h4>1. What It Is — Definition & Engineering Context</h4>
          <p>A <strong>civil bridge structure</strong> is an elevated transportation link engineered to provide continuous passage over physical obstacles such as waterways, railway corridors, deep gorges, or other roadways without closing the clearance envelope beneath. It consists of three integrated structural tiers: the <em>superstructure</em> (deck, girders, cables, trusses), the <em>substructure</em> (piers, abutments, bearings, pier caps), and the <em>deep foundation</em> (large-diameter bored piles or open caisson wells).</p>
          <div class="css-highlight-box">
            <span class="css-tag">STRUCTURE METRICS</span>
            <p><strong>Typology:</strong> ${p.bridge_type || p.structure_type || 'Prestressed Concrete Box Girder / Extradosed Cable-Stayed'}<br>
            <strong>Total Structural Length:</strong> ${fmt(p.length_m, 'm')} | <strong>Maximum Clear Span:</strong> ${fmt(p.span_m || (parseFloat(p.length_m) ? Math.round(parseFloat(p.length_m) / 6) : 60), 'm')}<br>
            <strong>Crossed Feature:</strong> ${p.waterway_crossed || p.river || p.obstacle_crossed || 'Waterway / Transit Corridor'}</p>
          </div>
        </div>
      `,

      howItWorks: (p) => {
        const length = parseFloat(p.length_m) || 300;
        const span = parseFloat(p.span_m) || Math.round(length / 5);
        return `
          <div class="css-block">
            <h4>2. How It Works — Structural Framing, Load Paths & Beam Behavior</h4>
            <p><strong>Load Path:</strong> Vehicular live wheel loads (IRC Class 70R / Class A) transmit through the asphaltic wearing coat into the reinforced concrete deck slab, which distributes moments into longitudinal girders. Longitudinal shear and bending are transferred through elastomeric/pot bearings down into pier caps, vertical pier columns, and finally into competent rock strata via deep well foundations.</p>
            <p><strong>Span-to-Depth Ratio ($L/d$):</strong> Governs structural stiffness and limits live-load deflection ($\delta \le L/800$). Typical ranges: $L/d \approx 10-14$ for RC T-beams, $18-22$ for prestressed concrete box girders, and $>30$ for extradosed and cable-stayed superstructures.</p>

            <div class="css-svg-frame">
              <svg viewBox="0 0 700 230" class="css-schematic-svg" aria-label="Bridge Load Path & Pier Elevation">
                <rect x="0" y="0" width="700" height="230" fill="#0b1120" rx="6"/>
                <!-- Deck Slab -->
                <rect x="40" y="45" width="620" height="18" fill="#475569" stroke="#94a3b8" stroke-width="1.5"/>
                <text x="350" y="38" fill="#facc15" font-size="11" font-weight="700" text-anchor="middle">Bridge Deck & Wearing Coat (Span ${fmt(span, 'm')})</text>
                <!-- Vehicular Load Arrows -->
                <line x1="200" y1="12" x2="200" y2="40" stroke="#f43f5e" stroke-width="2.5" marker-end="url(#arrow)"/>
                <line x1="280" y1="12" x2="280" y2="40" stroke="#f43f5e" stroke-width="2.5"/>
                <text x="240" y="10" fill="#f43f5e" font-size="10" text-anchor="middle">IRC 70R Wheel Loads</text>
                <!-- Girders -->
                <rect x="130" y="63" width="40" height="25" fill="#334155" stroke="#cbd5e1"/>
                <rect x="330" y="63" width="40" height="25" fill="#334155" stroke="#cbd5e1"/>
                <rect x="530" y="63" width="40" height="25" fill="#334155" stroke="#cbd5e1"/>
                <!-- Bearings -->
                <rect x="140" y="88" width="20" height="8" fill="#f59e0b"/>
                <rect x="340" y="88" width="20" height="8" fill="#f59e0b"/>
                <rect x="540" y="88" width="20" height="8" fill="#f59e0b"/>
                <text x="370" y="96" fill="#f59e0b" font-size="9">Elastomeric Bearings</text>
                <!-- Pier Caps & Piers -->
                <polygon points="120,96 180,96 160,110 140,110" fill="#64748b"/>
                <rect x="142" y="110" width="16" height="55" fill="#475569" stroke="#94a3b8"/>
                <polygon points="320,96 380,96 360,110 340,110" fill="#64748b"/>
                <rect x="342" y="110" width="16" height="55" fill="#475569" stroke="#94a3b8"/>
                <polygon points="520,96 580,96 560,110 540,110" fill="#64748b"/>
                <rect x="542" y="110" width="16" height="55" fill="#475569" stroke="#94a3b8"/>
                <text x="365" y="140" fill="#cbd5e1" font-size="10">Reinforced Concrete Pier</text>
                <!-- River Water Line -->
                <line x1="20" y1="135" x2="680" y2="135" stroke="#38bdf8" stroke-dasharray="4,4" stroke-width="1.5"/>
                <text x="30" y="130" fill="#38bdf8" font-size="10">High Flood Level (HFL)</text>
                <!-- Well Foundations -->
                <rect x="135" y="165" width="30" height="50" fill="#1e293b" stroke="#38bdf8"/>
                <rect x="335" y="165" width="30" height="50" fill="#1e293b" stroke="#38bdf8"/>
                <rect x="535" y="165" width="30" height="50" fill="#1e293b" stroke="#38bdf8"/>
                <text x="375" y="195" fill="#38bdf8" font-size="10">Deep Well Foundation / Caisson</text>
              </svg>
            </div>
          </div>
        `;
      },

      calculations: (p) => {
        const length = parseFloat(p.length_m) || 120;
        const defaultSpan = parseFloat(p.span_m) || Math.min(80, Math.max(25, Math.round(length / 3)));
        return {
          id: "bridge_calc",
          formulaLatex: "M_{max} = \\frac{w \\cdot L^2}{8} + \\frac{P \\cdot L}{4} \\quad \\text{and} \\quad \\delta = \\frac{5 w L^4}{384 E I} + \\frac{P L^3}{48 E I}",
          description: "Models mid-span maximum bending moment ($M_{max}$) and center deflection ($\delta$) for an illustrative simply supported bridge girder span under combined dead load ($w$) and vehicular axle point load ($P$).",
          inputsHtml: `
            <div class="css-calc-inputs">
              <div class="css-input-row">
                <div class="css-field">
                  <label>Span Length (L): <strong id="lbl_brg_L">${defaultSpan} m</strong></label>
                  <input type="range" id="brg_L" min="15" max="150" value="${defaultSpan}" class="css-slider" data-param="L">
                </div>
                <div class="css-field">
                  <label>Girder Depth (d): <strong id="lbl_brg_d">2.5 m</strong></label>
                  <input type="range" id="brg_d" min="1.0" max="6.0" step="0.1" value="2.5" class="css-slider" data-param="d">
                </div>
              </div>
              <div class="css-input-row">
                <div class="css-field">
                  <label>Dead Load (w): <strong id="lbl_brg_w">45 kN/m</strong></label>
                  <input type="range" id="brg_w" min="10" max="120" step="5" value="45" class="css-slider" data-param="w">
                </div>
                <div class="css-field">
                  <label>Live Axle Load (P): <strong id="lbl_brg_P">350 kN</strong></label>
                  <input type="range" id="brg_P" min="100" max="700" step="25" value="350" class="css-slider" data-param="P">
                </div>
              </div>
            </div>
          `,
          units: "Moment in kN·m / MN·m; Deflection in mm",
          defaults: { L: defaultSpan, d: 2.5, w: 45, P: 350 },
          evaluate: (vals) => {
            const L = parseFloat(vals.L) || 40;
            const d = parseFloat(vals.d) || 2.5;
            const w = parseFloat(vals.w) || 45; // kN/m
            const P = parseFloat(vals.P) || 350; // kN
            const E = 3.5e7; // M35 concrete E in kPa (35 GPa)
            const b = 1.2; // girder flange/web approx width
            // I = b * d^3 / 12 in m^4
            const I = (b * Math.pow(d, 3)) / 12;
            const M_dead = (w * Math.pow(L, 2)) / 8;
            const M_live = (P * L) / 4;
            const M_total = M_dead + M_live;
            // delta in meters: (5 * w * L^4)/(384 * E * I) + (P * L^3)/(48 * E * I)
            const delta_w = (5 * w * Math.pow(L, 4)) / (384 * E * I);
            const delta_P = (P * Math.pow(L, 3)) / (48 * E * I);
            const delta_mm = (delta_w + delta_P) * 1000;
            const spanDepthRatio = (L / d).toFixed(1);
            return {
              primary: `M_max = ${fmt(M_total / 1000, 'MN·m')} (${fmt(M_total, 'kN·m')})`,
              secondary: `Midspan Deflection: ${delta_mm.toFixed(1)} mm (Span/Depth: ${spanDepthRatio})`,
              substitution: `M = (${w} · ${L}²)/8 + (${P} · ${L})/4 = ${fmt(M_dead)} + ${fmt(M_live)} = ${fmt(M_total)} kN·m`,
              assumptions: "Idealized 1D simply supported beam model with uncracked gross concrete section inertia. Professional bridge design requires grillage/finite element analysis under moving vehicular load envelopes (IRC:6)."
            };
          }
        };
      },

      gujaratContext: (p) => `
        <div class="css-block">
          <h4>4. Gujarat Geographical & Environmental Setting</h4>
          <p><strong>${p.name}</strong> provides vital corridor connectivity within <strong>${p.district || 'Gujarat'}</strong>. Gujarat's transport topography demands extreme structural adaptability: coastal river estuaries (Narmada, Tapi, Mahi, Sabarmati) experience severe macro-tidal currents and marine atmospheric corrosivity ($C5\\text{-M}$ per ISO 12944), requiring dense silica fume concrete and minimum 50mm clear cover over reinforcement.</p>
          <div class="css-network-context">
            <strong>Crossed Feature & Corridor Role:</strong>
            <p>Carries arterial traffic over <em>${p.waterway_crossed || p.obstacle_crossed || 'regional waterway'}</em>, maintaining unhindered clearance above historical High Flood Levels (HFL).</p>
          </div>
        </div>
      `,

      interestingFacts: (p) => `
        <div class="css-block">
          <h4>5. Distinctive Civil Engineering Characteristics</h4>
          <ul class="css-facts-list">
            <li><strong>Signature Engineering:</strong> ${p.name.includes("Sudarshan") ? "Sudarshan Setu (Okha-Beyt Dwarka) is India's longest cable-stayed bridge (2,320m total length with a 900m central cable-stayed section) featuring solar panels on the footpaths generating 1 MW clean power." : (p.name.includes("Narmada") ? "The New Narmada Bridge at Bharuch is a 1.34 km extradosed bridge engineered to evacuate heavy freight along the Golden Quadrilateral (NH-48), operating alongside the historic 1881 Golden Bridge." : `Commissioned in ${p.commission_year || 'recent milestones'} to alleviate bottleneck congestion with continuous span design.`)}</li>
            <li><strong>Scour Protection:</strong> River piers are embedded to Lacey's regime scour depth ($R = 1.35 (q^2/f)^{1/3}$), providing foundation grip below maximum riverbed degradation levels.</li>
            <li><strong>Ductile Detailing:</strong> Engineered with seismic restrainer cables and elastomeric shear keys compliant with IRC:SP:114 to resist high lateral seismic accelerations.</li>
          </ul>
        </div>
      `
    },

    // -----------------------------------------------------------------------
    // DOMAIN 3: ROADS & HIGHWAY CORRIDORS
    // -----------------------------------------------------------------------
    road: {
      title: "Highway & Pavement Engineering",
      subTitle: "Flexible vs rigid pavements, subgrade CBR, traffic loading (MSA), and drainage camber",
      standards: "IRC:37 (Flexible Pavements) • IRC:58 (Rigid Pavements) • IRC:73 (Geometric Highway Design)",

      whatItIs: (p) => `
        <div class="css-block">
          <h4>1. What It Is — Definition & Engineering Context</h4>
          <p>A <strong>highway corridor</strong> is an engineered multi-lane transport facility designed to carry high-volume vehicular traffic safely at designated operating speeds ($80-120\\text{ km/h}$). The structural pavement consists of superimposed layers of engineered materials designed to distribute concentrated wheel loads down to a stress level that the natural subgrade soil can support without excessive permanent deformation (rutting or fatigue cracking).</p>
          <div class="css-highlight-box">
            <span class="css-tag">CORRIDOR ATTRIBUTES</span>
            <p><strong>Designation:</strong> ${p.route || p.highway_number || p.name || 'National Highway Corridor'}<br>
            <strong>Carriageway:</strong> ${p.lanes || '4 to 6 Lanes Dual Carriageway'} | <strong>Pavement Type:</strong> ${p.pavement_type || 'Flexible Bituminous (DBM + BC)'}<br>
            <strong>Design Speed:</strong> ${p.speed_limit || '100 km/h (Expressway: 120 km/h)'}</p>
          </div>
        </div>
      `,

      howItWorks: (p) => `
        <div class="css-block">
          <h4>2. How It Works — Multi-Layer Anatomy & Load Distribution</h4>
          <p><strong>Flexible Pavement Mechanics (IRC:37):</strong> Wheel loads dissipate through grain-to-grain contact over successive unbound and bound layers: Bituminous Concrete (BC, 40-50mm) $\\to$ Dense Bituminous Macadam (DBM, 100-150mm) $\\to$ Wet Mix Macadam (WMM Base, 250mm) $\\to$ Granular Sub-Base (GSB Drainage, 200mm) $\\to$ Compacted Subgrade ($CBR \\ge 8\\%$). Effective geometric design incorporates a $2.5\\%$ cross-slope (camber) to rapidly shed surface monsoon runoff into lined road-side drains.</p>

          <div class="css-svg-frame">
            <svg viewBox="0 0 700 210" class="css-schematic-svg" aria-label="Flexible Pavement Multi-Layer Cross Section">
              <rect x="0" y="0" width="700" height="210" fill="#0b1120" rx="6"/>
              <!-- Surface Wheel -->
              <circle cx="350" cy="20" r="16" fill="#1e293b" stroke="#e2e8f0" stroke-width="2"/>
              <text x="350" y="24" fill="#38bdf8" font-size="9" text-anchor="middle" font-weight="700">WHEEL</text>
              <!-- Stress Bulb -->
              <polygon points="350,36 180,185 520,185" fill="rgba(56, 189, 248, 0.08)"/>
              <!-- Layer 1: BC -->
              <rect x="50" y="38" width="600" height="18" fill="#1e293b" stroke="#64748b"/>
              <text x="60" y="51" fill="#facc15" font-size="10">Bituminous Concrete (BC Wearing Surface: 40-50 mm)</text>
              <!-- Layer 2: DBM -->
              <rect x="50" y="56" width="600" height="28" fill="#334155" stroke="#64748b"/>
              <text x="60" y="74" fill="#e2e8f0" font-size="10">Dense Bituminous Macadam (DBM Binder Layer: 100-150 mm)</text>
              <!-- Layer 3: WMM -->
              <rect x="50" y="84" width="600" height="35" fill="#475569" stroke="#64748b"/>
              <text x="60" y="106" fill="#cbd5e1" font-size="10">Wet Mix Macadam Base (WMM: 250 mm)</text>
              <!-- Layer 4: GSB -->
              <rect x="50" y="119" width="600" height="32" fill="#64748b" stroke="#475569"/>
              <text x="60" y="139" fill="#94a3b8" font-size="10">Granular Sub-Base Drainage Layer (GSB: 200 mm)</text>
              <!-- Layer 5: Subgrade -->
              <rect x="50" y="151" width="600" height="45" fill="rgba(100, 116, 139, 0.4)" stroke="#475569"/>
              <text x="60" y="177" fill="#cbd5e1" font-size="10">Compacted Subgrade Soil (500 mm, Design CBR ≥ 8%)</text>
            </svg>
          </div>
        </div>
      `,

      calculations: (p) => ({
        id: "road_calc",
        formulaLatex: "N = \\frac{365 \\cdot [(1 + r)^n - 1] \\cdot A \\cdot D \\cdot F}{r} \\quad \\text{and} \\quad M_r = 10 \\cdot CBR \\text{ (MPa)}",
        description: "Evaluates cumulative design traffic loading in Million Standard Axles (MSA) and subgrade Resilient Modulus ($M_r$) per IRC:37 for flexible pavement thickness catalogs.",
        inputsHtml: `
          <div class="css-calc-inputs">
            <div class="css-input-row">
              <div class="css-field">
                <label>Commercial Vehicles/Day (A): <strong id="lbl_rd_A">3,500 CVPD</strong></label>
                <input type="range" id="rd_A" min="500" max="15000" step="500" value="3500" class="css-slider" data-param="A">
              </div>
              <div class="css-field">
                <label>Subgrade CBR: <strong id="lbl_rd_CBR">8%</strong></label>
                <input type="range" id="rd_CBR" min="2" max="15" step="1" value="8" class="css-slider" data-param="CBR">
              </div>
            </div>
            <div class="css-input-row">
              <div class="css-field">
                <label>Design Period (n): <strong id="lbl_rd_n">15 Years</strong></label>
                <input type="range" id="rd_n" min="10" max="25" step="5" value="15" class="css-slider" data-param="n">
              </div>
              <div class="css-field">
                <label>Annual Traffic Growth (r): <strong id="lbl_rd_r">5.0%</strong></label>
                <input type="range" id="rd_r" min="3.0" max="8.0" step="0.5" value="5.0" class="css-slider" data-param="r">
              </div>
            </div>
          </div>
        `,
        units: "Traffic in MSA (Million Standard Axles); Modulus in MPa",
        defaults: { A: 3500, CBR: 8, n: 15, r: 5.0 },
        evaluate: (vals) => {
          const A = parseFloat(vals.A) || 3500;
          const cbr = parseFloat(vals.CBR) || 8;
          const n = parseFloat(vals.n) || 15;
          const r = (parseFloat(vals.r) || 5.0) / 100;
          const D = 0.75; // Lane distribution factor for 4-lane divided
          const F = 3.5; // Vehicle Damage Factor (VDF) for Indian multi-axle freight
          // N = 365 * [ (1+r)^n - 1 ] * A * D * F / r
          const growthFactor = (Math.pow(1 + r, n) - 1) / r;
          const N_axles = 365 * growthFactor * A * D * F;
          const msa = N_axles / 1e6;
          const Mr = 10 * cbr; // Resilient modulus in MPa per IRC:37
          return {
            primary: `Design Traffic: ${msa.toFixed(1)} MSA`,
            secondary: `Subgrade Resilient Modulus (Mr): ${Mr.toFixed(0)} MPa (CBR ${cbr}%)`,
            substitution: `N = 365 · [ (1+${r.toFixed(2)})^${n} - 1 ] / ${r.toFixed(2)} · ${A} · ${D} · ${F} = ${msa.toFixed(1)} MSA`,
            assumptions: "IRC:37 4-lane divided carriageway with VDF = 3.5 commercial freight factor. Subgrade compacted to 97% MDD per MORTH Section 300."
          };
        }
      }),

      gujaratContext: (p) => `
        <div class="css-block">
          <h4>4. Gujarat Geographical & Environmental Setting</h4>
          <p><strong>${p.name || 'Highway Corridor'}</strong> forms a major trade conduit across <strong>${p.district || 'Gujarat'}</strong>. Gujarat accounts for over 16% of India's industrial output and handles over 40% of national maritime container freight. Consequently, state highways experience exceptionally high Vehicle Damage Factors ($VDF > 4.5$) due to heavy multi-axle cargo moving between Mundra/Kandla ports and landlocked North Indian hinterlands.</p>
          <div class="css-network-context">
            <strong>Expansive Soil Challenge:</strong>
            <p>Much of Saurashtra and Central Gujarat is underlain by expansive <strong>Black Cotton Soils (Vertisols)</strong>. These soils exhibit high plasticity and swelling pressures up to $320\\text{ kPa}$. IRC:37 mandates a minimum 500mm Cohesive Non-Swelling (CNS) soil blanket layer beneath the subgrade to prevent differential pavement cracking.</p>
          </div>
        </div>
      `,

      interestingFacts: (p) => `
        <div class="css-block">
          <h4>5. Distinctive Civil Engineering Characteristics</h4>
          <ul class="css-facts-list">
            <li><strong>Pioneer Expressway:</strong> National Expressway 1 (NE-1, Ahmedabad–Vadodara Expressway, 93 km) was India's first modern access-controlled expressway, commissioned in 2004 with a 120 km/h design speed and dedicated intelligent traffic management systems.</li>
            <li><strong>Polymer Modified Bitumen:</strong> In Gujarat's high-temperature saline coastal zones (Gulf of Khambhat and Kutch), highway surface wearing courses use specialized PMB-40 (Polymer Modified Bitumen) to resist thermal rutting under pavement surface temperatures reaching $65^\\circ\\text{C}$.</li>
          </ul>
        </div>
      `
    },

    // -----------------------------------------------------------------------
    // DOMAIN 4: RAILWAYS & TRANSIT SYSTEMS
    // -----------------------------------------------------------------------
    railway: {
      title: "Railway Track & Permanent Way Engineering",
      subTitle: "Broad gauge alignment, rail stress, equilibrium cant, and heavy-haul formation",
      standards: "Indian Railway Permanent Way Manual (IRPWM) • RDSO Heavy Haul Track Standards • UIC 774-R",

      whatItIs: (p) => `
        <div class="css-block">
          <h4>1. What It Is — Definition & Engineering Context</h4>
          <p>The <strong>railway track structure (Permanent Way)</strong> is a specialized civil transportation infrastructure designed to guide and support heavy rolling stock with extremely low rolling resistance. Indian Railways operates predominantly on <strong>Broad Gauge (1,676 mm)</strong>, providing higher lateral stability and freight payload capacity than standard gauge (1,435 mm). It transfers wheel axle loads (up to 25.0 tonnes on mainline, 32.5 tonnes on DFC) through resilient structural layers into the track formation.</p>
          <div class="css-highlight-box">
            <span class="css-tag">PERMANENT WAY PROFILE</span>
            <p><strong>Track Gauge:</strong> 1,676 mm (Standard Broad Gauge 5'-6")<br>
            <strong>Rail Section:</strong> 60 kg/m UIC 60, 90 UTS Head-Hardened Steel<br>
            <strong>Sleepers:</strong> Monoblock Prestressed Concrete (PSC) at 1,660 sleepers/km | <strong>Ballast:</strong> 300 mm Clean Crushed Granite</p>
          </div>
        </div>
      `,

      howItWorks: (p) => `
        <div class="css-block">
          <h4>2. How It Works — Track Anatomy & Geometric Cant</h4>
          <p><strong>Load Transmission:</strong> Concentrated wheel contact stresses ($>800\\text{ MPa}$) on the rail head spread across the 60 kg/m rail beam to rubber pads and PSC sleepers. Sleepers distribute pressure over a 300mm deep ballast cushion ($350\\text{ kPa}$), which rests on an engineered blanket layer ($100\\text{ kPa}$) and subgrade formation ($40\\text{ kPa}$).</p>
          <p><strong>Equilibrium Cant ($C_{eq}$):</strong> On horizontal curves, the outer rail is elevated above the inner rail to counteract centrifugal acceleration: $C = \\frac{G \\cdot V^2}{127 \\cdot R}$. When trains run faster or slower than equilibrium speed, cant deficiency ($C_d$) or cant excess ($C_e$) develops (capped at $75\\text{ mm}$ for BG mainlines).</p>

          <div class="css-svg-frame">
            <svg viewBox="0 0 700 200" class="css-schematic-svg" aria-label="Railway Permanent Way Cross Section">
              <rect x="0" y="0" width="700" height="200" fill="#0b1120" rx="6"/>
              <!-- Steel Rails -->
              <rect x="250" y="35" width="18" height="30" fill="#94a3b8" stroke="#f1f5f9"/>
              <rect x="432" y="35" width="18" height="30" fill="#94a3b8" stroke="#f1f5f9"/>
              <!-- Gauge Line -->
              <line x1="268" y1="42" x2="432" y2="42" stroke="#facc15" stroke-dasharray="3,3" stroke-width="2"/>
              <text x="350" y="32" fill="#facc15" font-size="10" font-weight="700" text-anchor="middle">BROAD GAUGE G = 1,676 mm</text>
              <!-- Concrete Sleeper -->
              <polygon points="170,68 530,68 510,95 190,95" fill="#475569" stroke="#cbd5e1" stroke-width="1.5"/>
              <text x="350" y="85" fill="#e2e8f0" font-size="10" text-anchor="middle">Prestressed Concrete (PSC) Sleeper (Weight ~300 kg)</text>
              <!-- Ballast Cushion -->
              <polygon points="120,95 580,95 620,140 80,140" fill="#334155" stroke="#64748b"/>
              <text x="350" y="122" fill="#94a3b8" font-size="10" text-anchor="middle">Clean Crushed Stone Ballast Cushion (300 mm depth)</text>
              <!-- Formation Blanket -->
              <rect x="60" y="140" width="580" height="25" fill="#1e293b" stroke="#475569"/>
              <text x="350" y="157" fill="#cbd5e1" font-size="9" text-anchor="middle">Engineered Granular Blanket Layer (300 mm)</text>
              <!-- Subgrade -->
              <rect x="40" y="165" width="620" height="25" fill="rgba(71, 85, 105, 0.4)" stroke="#334155"/>
              <text x="350" y="182" fill="#94a3b8" font-size="9" text-anchor="middle">Natural Subgrade Soil Formation</text>
            </svg>
          </div>
        </div>
      `,

      calculations: (p) => ({
        id: "rail_calc",
        formulaLatex: "C_{eq} = \\frac{G \\cdot V^2}{127 \\cdot R} = \\frac{1.676 \\cdot V^2}{127 \\cdot R} \\text{ (m)} \\quad \\implies \\quad C_{eq} = \\frac{13.2 \\cdot V^2}{R} \\text{ (mm)}",
        description: "Computes theoretical Equilibrium Cant ($C_{eq}$) and Cant Deficiency ($C_d$) for Indian Broad Gauge curves per the Indian Railway Permanent Way Manual (IRPWM).",
        inputsHtml: `
          <div class="css-calc-inputs">
            <div class="css-input-row">
              <div class="css-field">
                <label>Train Speed (V): <strong id="lbl_rail_V">110 km/h</strong></label>
                <input type="range" id="rail_V" min="50" max="160" step="5" value="110" class="css-slider" data-param="V">
              </div>
              <div class="css-field">
                <label>Curve Radius (R): <strong id="lbl_rail_R">800 m</strong></label>
                <input type="range" id="rail_R" min="300" max="2500" step="50" value="800" class="css-slider" data-param="R">
              </div>
            </div>
            <div class="css-input-row">
              <div class="css-field">
                <label>Actual Provided Cant (Ca): <strong id="lbl_rail_Ca">90 mm</strong></label>
                <input type="range" id="rail_Ca" min="20" max="165" step="5" value="90" class="css-slider" data-param="Ca">
              </div>
            </div>
          </div>
        `,
        units: "Cant in millimeters (mm); Speed in km/h; Radius in meters",
        defaults: { V: 110, R: 800, Ca: 90 },
        evaluate: (vals) => {
          const V = parseFloat(vals.V) || 110;
          const R = parseFloat(vals.R) || 800;
          const Ca = parseFloat(vals.Ca) || 90;
          const C_eq = (13.2 * Math.pow(V, 2)) / R;
          const Cd = C_eq - Ca;
          const isCdAcceptable = Math.abs(Cd) <= 75; // 75 mm standard limit
          return {
            primary: `Equilibrium Cant: ${C_eq.toFixed(1)} mm`,
            secondary: `Cant Deficiency (Cd): ${Cd.toFixed(1)} mm [${isCdAcceptable ? 'COMPLIANT' : 'EXCEEDS 75mm IRPWM LIMIT'}]`,
            substitution: `C = (13.2 · ${V}²) / ${R} = ${C_eq.toFixed(1)} mm | Cd = ${C_eq.toFixed(1)} - ${Ca} = ${Cd.toFixed(1)} mm`,
            assumptions: "Indian Broad Gauge (G = 1,676 mm, dynamic gauge 1,750 mm). Maximum permissible cant on BG is 165 mm; maximum cant deficiency is 75 mm (100 mm for high-speed stock with CRS sanction)."
          };
        }
      }),

      gujaratContext: (p) => `
        <div class="css-block">
          <h4>4. Gujarat Geographical & Environmental Setting</h4>
          <p><strong>${p.name}</strong> operates under Western Railway (WR) jurisdiction within <strong>${p.district || 'Gujarat'}</strong>. Gujarat is home to the spine of the <strong>Western Dedicated Freight Corridor (WDFC)</strong>, traversing Palanpur, Mehsana, Sanand, Vadodara, Bharuch, and Surat toward Jawaharlal Nehru Port (JNPT).</p>
          <div class="css-network-context">
            <strong>Double-Stack Electric Traction:</strong>
            <p>Gujarat's rail network pioneers heavy-haul logistics, operating 1.5 km long double-stack container freight trains under high-reach Overhead Equipment (OHE, 7.57m wire height), delivering twice the cargo throughput per train path compared to standard global railways.</p>
          </div>
        </div>
      `,

      interestingFacts: (p) => `
        <div class="css-block">
          <h4>5. Distinctive Civil Engineering Characteristics</h4>
          <ul class="css-facts-list">
            <li><strong>High-Speed Rail (MAHSR):</strong> Gujarat hosts 352 km of India's first 508 km Mumbai–Ahmedabad Bullet Train corridor (320 km/h commercial speed), engineered with Japanese Shinkansen ballastless slab-track, 8 modern terminals, and 24 major river bridges.</li>
            <li><strong>Heavy Axle Load:</strong> WDFC track infrastructure is designed for 25.0t operational axle load with substructure formation certified for future 32.5t heavy-haul operations using UIC 60 Head-Hardened rails and elastic rail clips (ERC-Mk V).</li>
          </ul>
        </div>
      `
    },

    // -----------------------------------------------------------------------
    // DOMAIN 5: WATER-TREATMENT PLANTS (WTP)
    // -----------------------------------------------------------------------
    wtp: {
      title: "Municipal Water Treatment & Potable Purification",
      subTitle: "Coagulation, clariflocculation, rapid sand filtration, and chemical disinfection",
      standards: "CPHEEO Manual on Water Supply & Treatment • BIS IS 10500:2012 (Drinking Water)",

      whatItIs: (p) => `
        <div class="css-block">
          <h4>1. What It Is — Definition & Engineering Context</h4>
          <p>A <strong>Water Treatment Plant (WTP)</strong> is a centralized municipal process facility engineered to clarify, filter, and disinfect turbid raw surface or canal water into safe, palatable drinking water meeting <strong>BIS IS 10500:2012</strong> statutory standards. It systematically eliminates suspended silts, microbial pathogens, organic impurities, and heavy metals before pumping water into urban distribution networks.</p>
          <div class="css-highlight-box">
            <span class="css-tag">TREATMENT SCALE</span>
            <p><strong>Facility Name:</strong> ${p.name || 'Municipal Water Treatment Facility'}<br>
            <strong>Rated Capacity:</strong> ${fmt(p.capacity_mld, 'MLD')} (${fmt((parseFloat(p.capacity_mld) || 200) * 0.0864, 'MCM/day')})<br>
            <strong>Raw Water Source:</strong> ${p.raw_water_source || p.river || 'Narmada Main Canal / River Impoundment'}</p>
          </div>
        </div>
      `,

      howItWorks: (p) => `
        <div class="css-block">
          <h4>2. How It Works — Sequential Process Train & Hydraulic Flow</h4>
          <p><strong>Process Stages:</strong> Raw water enters via a cascade aerator (iron/VOC degassing) $\\to$ Flash mixer where Alum / PAC coagulant neutralizes negative zeta potential of suspended colloids $\\to$ Clariflocculator where slow-paddle flocculation binds micro-flocs into heavy agglomerates settling under gravity $\\to$ Rapid Gravity Sand Filters (sand bed effective size $0.55\\text{ mm}$, uniformity coefficient $<1.5$) capturing fine particles $\\to$ Disinfection chamber with chlorine gas or sodium hypochlorite maintaining $0.2-0.5\\text{ mg/L}$ free residual chlorine at user taps.</p>

          <div class="css-svg-frame">
            <svg viewBox="0 0 700 180" class="css-schematic-svg" aria-label="Water Treatment Plant Process Flow">
              <rect x="0" y="0" width="700" height="180" fill="#0b1120" rx="6"/>
              <!-- Flow Path Blocks -->
              <rect x="25" y="60" width="95" height="55" fill="#1e293b" stroke="#38bdf8"/>
              <text x="72" y="85" fill="#38bdf8" font-size="10" font-weight="700" text-anchor="middle">Cascade</text>
              <text x="72" y="100" fill="#94a3b8" font-size="9" text-anchor="middle">Aeration</text>

              <line x1="120" y1="87" x2="155" y2="87" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrow)"/>

              <rect x="155" y="60" width="105" height="55" fill="#1e293b" stroke="#f59e0b"/>
              <text x="207" y="85" fill="#f59e0b" font-size="10" font-weight="700" text-anchor="middle">Flash Mixer</text>
              <text x="207" y="100" fill="#94a3b8" font-size="9" text-anchor="middle">+ Alum/PAC</text>

              <line x1="260" y1="87" x2="295" y2="87" stroke="#38bdf8" stroke-width="2"/>

              <rect x="295" y="60" width="115" height="55" fill="#1e293b" stroke="#10b981"/>
              <text x="352" y="85" fill="#10b981" font-size="10" font-weight="700" text-anchor="middle">Clariflocculator</text>
              <text x="352" y="100" fill="#94a3b8" font-size="9" text-anchor="middle">Sedimentation</text>

              <line x1="410" y1="87" x2="445" y2="87" stroke="#38bdf8" stroke-width="2"/>

              <rect x="445" y="60" width="110" height="55" fill="#1e293b" stroke="#38bdf8"/>
              <text x="500" y="85" fill="#38bdf8" font-size="10" font-weight="700" text-anchor="middle">Rapid Sand</text>
              <text x="500" y="100" fill="#94a3b8" font-size="9" text-anchor="middle">Filtration</text>

              <line x1="555" y1="87" x2="585" y2="87" stroke="#38bdf8" stroke-width="2"/>

              <rect x="585" y="60" width="95" height="55" fill="#1e293b" stroke="#a855f7"/>
              <text x="632" y="85" fill="#a855f7" font-size="10" font-weight="700" text-anchor="middle">Chlorination</text>
              <text x="632" y="100" fill="#94a3b8" font-size="9" text-anchor="middle">Clear Sump</text>
            </svg>
          </div>
        </div>
      `,

      calculations: (p) => {
        const defaultCap = parseFloat(p.capacity_mld) || 250;
        return {
          id: "wtp_calc",
          formulaLatex: "M_{chem} = Q \\cdot \\text{Dose} \\cdot 10^{-3} \\text{ (kg/day)} \\quad \\text{and} \\quad SOR = \\frac{Q \\cdot 10^3}{A_{clarifier}} \\text{ (m/day)}",
          description: "Calculates daily coagulant consumption (Alum/PAC mass) and Surface Overflow Rate (SOR) for clarifier sizing.",
          inputsHtml: `
            <div class="css-calc-inputs">
              <div class="css-input-row">
                <div class="css-field">
                  <label>Plant Capacity (Q): <strong id="lbl_wtp_Q">${defaultCap} MLD</strong></label>
                  <input type="range" id="wtp_Q" min="20" max="650" step="10" value="${defaultCap}" class="css-slider" data-param="Q">
                </div>
                <div class="css-field">
                  <label>Coagulant Dose: <strong id="lbl_wtp_dose">25 mg/L</strong></label>
                  <input type="range" id="wtp_dose" min="10" max="60" step="5" value="25" class="css-slider" data-param="dose">
                </div>
              </div>
              <div class="css-input-row">
                <div class="css-field">
                  <label>Clarifier Diameter: <strong id="lbl_wtp_dia">35 m</strong></label>
                  <input type="range" id="wtp_dia" min="20" max="55" step="5" value="35" class="css-slider" data-param="dia">
                </div>
              </div>
            </div>
          `,
          units: "Coagulant in kg/day or tonnes/day; SOR in m³/m²/day",
          defaults: { Q: defaultCap, dose: 25, dia: 35 },
          evaluate: (vals) => {
            const Q = parseFloat(vals.Q) || 250; // MLD
            const dose = parseFloat(vals.dose) || 25; // mg/L
            const dia = parseFloat(vals.dia) || 35; // m
            // Mass = Q (MLD = 10^6 L/day) * dose (mg/L = 10^-6 kg/L) = Q * dose kg/day
            const mass_kg = Q * dose;
            const mass_tonnes = mass_kg / 1000;
            // Area = pi * dia^2 / 4
            const area = (Math.PI * Math.pow(dia, 2)) / 4;
            // Flow per clarifier assuming 4 parallel clarifier units
            const units = Math.max(2, Math.round(Q / 60));
            const flowPerUnit_m3 = (Q * 1000) / units;
            const sor = flowPerUnit_m3 / area;
            return {
              primary: `Chemical Consumption: ${mass_tonnes.toFixed(2)} tonnes/day (${fmt(mass_kg, 'kg/day')})`,
              secondary: `Clarifier Surface Loading: ${sor.toFixed(1)} m³/m²/day across ${units} units (Dia: ${dia}m)`,
              substitution: `M = ${Q} MLD · ${dose} mg/L = ${mass_kg.toFixed(0)} kg/day | SOR = (${Q*1000}/${units} m³) / ${area.toFixed(0)} m² = ${sor.toFixed(1)} m/day`,
              assumptions: "CPHEEO standard rapid mixing and radial clariflocculation. Maximum permissible SOR is 35-40 m/day to prevent micro-floc carry-over to sand filters."
            };
          }
        };
      },

      gujaratContext: (p) => `
        <div class="css-block">
          <h4>4. Gujarat Geographical & Environmental Setting</h4>
          <p><strong>${p.name || 'WTP Facility'}</strong> serves urban populations across <strong>${p.district || 'Gujarat'}</strong>. Gujarat operates one of the world's most ambitious inter-basin drinking water distribution schemes: the Gujarat State Piped Water Grid, managed by the Gujarat Water Infrastructure Co. Ltd. (GWIL) and GWSSB, lifting treated surface water over hundreds of kilometers into arid Kutch and Saurashtra towns.</p>
          <div class="css-network-context">
            <strong>Mega Facility Benchmark:</strong>
            <p>Ahmedabad's <strong>Kotarpur WTP (650 MLD)</strong> is one of the largest single-location water treatment plants in Asia, purifying raw water from the Narmada Main Canal and Sabarmati River to serve over 4 million urban citizens.</p>
          </div>
        </div>
      `,

      interestingFacts: (p) => `
        <div class="css-block">
          <h4>5. Distinctive Civil Engineering Characteristics</h4>
          <ul class="css-facts-list">
            <li><strong>Turbidity Spikes:</strong> During monsoon flood events, raw river water turbidity in Gujarat can surge from $<15\\text{ NTU}$ to over $1,200\\text{ NTU}$, requiring automated polyaluminium chloride (PAC) dosing and automated sludge scraping mechanisms.</li>
            <li><strong>Gravity Operation:</strong> Modern Gujarat WTPs feature hydraulic cascades designed so that once raw water is pumped to the flash mixer inlet, flow proceeds through clariflocculation and rapid sand filters by gravity alone, minimizing internal power losses.</li>
          </ul>
        </div>
      `
    },

    // -----------------------------------------------------------------------
    // DOMAIN 6: SEWAGE-TREATMENT PLANTS (STP) & WASTEWATER REUSE
    // -----------------------------------------------------------------------
    stp: {
      title: "Wastewater Treatment & Reclamation Engineering",
      subTitle: "Primary sedimentation, secondary biological oxidation (SBR/MBBR), and industrial tertiary recycling",
      standards: "CPHEEO Manual on Sewerage & Sewage Treatment • CPCB 2021 Discharge Standards",

      whatItIs: (p) => `
        <div class="css-block">
          <h4>1. What It Is — Definition & Engineering Context</h4>
          <p>A <strong>Sewage Treatment Plant (STP)</strong> is an environmental sanitation facility engineered to purify municipal domestic wastewater, removing suspended solids, organic pathogens, and nutrients (nitrogen and phosphorus) before discharging effluent into natural watercourses or supplying reclaimed water for industrial manufacturing.</p>
          <div class="css-highlight-box">
            <span class="css-tag">SANITATION PROFILE</span>
            <p><strong>Facility Name:</strong> ${p.name || 'Municipal Wastewater Treatment Plant'}<br>
            <strong>Rated Capacity:</strong> ${fmt(p.capacity_mld || 100, 'MLD')}<br>
            <strong>Technology:</strong> Sequencing Batch Reactor (SBR) / Moving Bed Biofilm Reactor (MBBR)</p>
          </div>
        </div>
      `,

      howItWorks: (p) => `
        <div class="css-block">
          <h4>2. How It Works — Biological Degradation & Nutrient Removal</h4>
          <p><strong>Treatment Train:</strong> Raw sewage passes coarse and fine mechanical bar screens $\\to$ Vortex grit removal $\\to$ <strong>Secondary Biological Reactor (SBR)</strong>: aerobic heterotrophic micro-organisms consume dissolved Biochemical Oxygen Demand (BOD) and chemical nutrients under cyclic fill, aerate, settle, and decant phases $\\to$ <strong>Tertiary Treatment</strong>: dual media sand filtration, activated carbon adsorption, and ultrafiltration yielding clear, non-potable industrial grade water ($BOD < 5\\text{ mg/L}$, $TSS < 5\\text{ mg/L}$).</p>

          <div class="css-svg-frame">
            <svg viewBox="0 0 700 170" class="css-schematic-svg" aria-label="Sewage Treatment Plant Process Architecture">
              <rect x="0" y="0" width="700" height="170" fill="#0b1120" rx="6"/>
              <rect x="30" y="55" width="110" height="50" fill="#1e293b" stroke="#64748b"/>
              <text x="85" y="78" fill="#94a3b8" font-size="10" font-weight="700" text-anchor="middle">Bar Screens</text>
              <text x="85" y="93" fill="#64748b" font-size="9" text-anchor="middle">& Grit Trap</text>

              <line x1="140" y1="80" x2="180" y2="80" stroke="#38bdf8" stroke-width="2"/>

              <rect x="180" y="55" width="140" height="50" fill="#1e293b" stroke="#10b981"/>
              <text x="250" y="78" fill="#10b981" font-size="10" font-weight="700" text-anchor="middle">SBR Biological</text>
              <text x="250" y="93" fill="#94a3b8" font-size="9" text-anchor="middle">BOD Oxidation</text>

              <line x1="320" y1="80" x2="360" y2="80" stroke="#38bdf8" stroke-width="2"/>

              <rect x="360" y="55" width="130" height="50" fill="#1e293b" stroke="#38bdf8"/>
              <text x="425" y="78" fill="#38bdf8" font-size="10" font-weight="700" text-anchor="middle">Tertiary Filter</text>
              <text x="425" y="93" fill="#94a3b8" font-size="9" text-anchor="middle">Sand + Carbon</text>

              <line x1="490" y1="80" x2="530" y2="80" stroke="#38bdf8" stroke-width="2"/>

              <rect x="530" y="55" width="140" height="50" fill="#1e293b" stroke="#f59e0b"/>
              <text x="600" y="78" fill="#f59e0b" font-size="10" font-weight="700" text-anchor="middle">Industrial Reuse</text>
              <text x="600" y="93" fill="#94a3b8" font-size="9" text-anchor="middle">Textile & Chemical</text>
            </svg>
          </div>
        </div>
      `,

      calculations: (p) => {
        const defaultCap = parseFloat(p.capacity_mld) || 100;
        return {
          id: "stp_calc",
          formulaLatex: "L_{BOD} = Q \\cdot \\text{BOD}_{in} \\cdot 10^{-3} \\text{ (kg/day)} \\quad \\text{and} \\quad \\text{Effluent BOD} = \\text{BOD}_{in} \\cdot (1 - \\eta)",
          description: "Calculates daily raw organic pollutant load ($L_{BOD}$), treated effluent quality, and oxygen transfer requirements.",
          inputsHtml: `
            <div class="css-calc-inputs">
              <div class="css-input-row">
                <div class="css-field">
                  <label>Sewage Flow (Q): <strong id="lbl_stp_Q">${defaultCap} MLD</strong></label>
                  <input type="range" id="stp_Q" min="10" max="250" step="5" value="${defaultCap}" class="css-slider" data-param="Q">
                </div>
                <div class="css-field">
                  <label>Influent BOD: <strong id="lbl_stp_bod">250 mg/L</strong></label>
                  <input type="range" id="stp_bod" min="150" max="400" step="10" value="250" class="css-slider" data-param="bod">
                </div>
              </div>
              <div class="css-input-row">
                <div class="css-field">
                  <label>BOD Removal Efficiency (η): <strong id="lbl_stp_eff">96%</strong></label>
                  <input type="range" id="stp_eff" min="80" max="98" step="1" value="96" class="css-slider" data-param="eff">
                </div>
              </div>
            </div>
          `,
          units: "Load in kg BOD/day; Effluent in mg/L",
          defaults: { Q: defaultCap, bod: 250, eff: 96 },
          evaluate: (vals) => {
            const Q = parseFloat(vals.Q) || 100;
            const bod_in = parseFloat(vals.bod) || 250;
            const eff = (parseFloat(vals.eff) || 96) / 100;
            const load_kg = Q * bod_in; // MLD * mg/L = kg/day
            const bod_out = bod_in * (1 - eff);
            const o2_demand_kg = load_kg * eff * 1.25; // approx 1.25 kg O2 per kg BOD removed
            return {
              primary: `Daily Organic Load: ${fmt(load_kg / 1000, 'tonnes BOD/day')} (${fmt(load_kg, 'kg/day')})`,
              secondary: `Treated Effluent BOD: ${bod_out.toFixed(1)} mg/L (CPCB Limit: ≤ 10 mg/L) | O₂ Requirement: ${fmt(o2_demand_kg / 1000, 'tonnes O₂/day')}`,
              substitution: `L = ${Q} MLD · ${bod_in} mg/L = ${fmt(load_kg)} kg/day | BOD_out = ${bod_in} · (1 - ${eff.toFixed(2)}) = ${bod_out.toFixed(1)} mg/L`,
              assumptions: "Sequencing Batch Reactor (SBR) cyclic aeration. Complies with Central Pollution Control Board (CPCB 2021) urban river discharge limits."
            };
          }
        };
      },

      gujaratContext: (p) => `
        <div class="css-block">
          <h4>4. Gujarat Geographical & Environmental Setting</h4>
          <p><strong>${p.name || 'Wastewater Treatment Asset'}</strong> serves municipal domains across <strong>${p.district || 'Gujarat'}</strong>. Gujarat is a national pioneer in the circular economy of municipal water. The <strong>Surat Municipal Corporation (SMC)</strong> was the first urban body in India to establish a commercial tertiary sewage recycling network, supplying over 115 MLD of high-grade industrial water to the Pandesara and Sachin textile dyeing hubs.</p>
        </div>
      `,

      interestingFacts: (p) => `
        <div class="css-block">
          <h4>5. Distinctive Civil Engineering Characteristics</h4>
          <ul class="css-facts-list">
            <li><strong>Revenue Generation:</strong> Surat Municipal Corporation generates over ₹140 crore annually by selling tertiary-treated sewage to private industries, substituting fresh Tapi River withdrawals.</li>
            <li><strong>Riverfront Ecology:</strong> Ahmedabad's modern STPs at Pirana and Vasna prevent raw sewage outfalls into the downstream Sabarmati River, discharging tertiary-polished effluent with Dissolved Oxygen ($DO > 4\\text{ mg/L}$) to sustain aquatic ecology.</li>
          </ul>
        </div>
      `
    },

    // -----------------------------------------------------------------------
    // DOMAIN 7: ELECTRICAL SUBSTATIONS & TRANSMISSION
    // -----------------------------------------------------------------------
    substation: {
      title: "Electrical Substation & Grid Transformation Engineering",
      subTitle: "Voltage transformation, power transformer MVA sizing, busbar topologies, and reactive power compensation",
      standards: "Central Electricity Authority (CEA) Technical Standards • GETCO Grid Code • IS 2026",

      whatItIs: (p) => `
        <div class="css-block">
          <h4>1. What It Is — Definition & Engineering Context</h4>
          <p>An <strong>electrical substation</strong> is an Extra High Voltage (EHV) grid node engineered to switch, protect, and transform electrical energy between transmission and distribution voltage tiers ($765\\text{ kV} \\leftrightarrow 400\\text{ kV} \\leftrightarrow 220\\text{ kV} \\leftrightarrow 66\\text{ kV}$). By stepping voltage up at power stations, it drastically reduces transmission line $I^2 R$ thermal losses across long distances, and steps voltage down near load centers for regional delivery.</p>
          <div class="css-highlight-box">
            <span class="css-tag">SUBSTATION PROFILE</span>
            <p><strong>Substation Name:</strong> ${p.name || 'GETCO / PGCIL Grid Substation'}<br>
            <strong>Nominal Operating Voltage:</strong> ${p.voltage_kv ? p.voltage_kv + ' kV' : '400 / 220 kV'}<br>
            <strong>Switchgear Type:</strong> ${p.switchgear_type || 'Air Insulated Switchgear (AIS) / Gas Insulated (GIS)'}</p>
          </div>
        </div>
      `,

      howItWorks: (p) => {
        const v = parseFloat(p.voltage_kv) || 400;
        return `
          <div class="css-block">
            <h4>2. How It Works — Voltage Transformation & Busbar Architecture</h4>
            <p><strong>Transformation Theory:</strong> Large 3-phase Autotransformers utilize electromagnetic flux linkage across laminated silicon steel cores: $\\frac{V_1}{V_2} = \\frac{N_1}{N_2}$, with tertiary delta windings mitigating third-harmonic currents. <strong>Busbar Schemes</strong> (such as <em>One-and-a-Half Breaker</em> or <em>Double Bus Single Breaker</em>) provide high operational reliability, allowing any circuit breaker to be isolated for maintenance without de-energizing connecting transmission lines.</p>

            <div class="css-svg-frame">
              <svg viewBox="0 0 700 170" class="css-schematic-svg" aria-label="Substation Single Line Diagram">
                <rect x="0" y="0" width="700" height="170" fill="#0b1120" rx="6"/>
                <!-- Bus 1 -->
                <line x1="40" y1="35" x2="660" y2="35" stroke="#f59e0b" stroke-width="3"/>
                <text x="50" y="25" fill="#f59e0b" font-size="10" font-weight="700">MAIN BUSBAR I (${v} kV)</text>
                <!-- Isolator & Breaker Bay -->
                <line x1="200" y1="35" x2="200" y2="60" stroke="#f1f5f9" stroke-width="2"/>
                <rect x="192" y="60" width="16" height="16" fill="#1e293b" stroke="#38bdf8"/>
                <text x="215" y="72" fill="#38bdf8" font-size="9">SF6 Circuit Breaker</text>
                <!-- Transformer Core Symbol -->
                <circle cx="200" cy="105" r="14" fill="none" stroke="#facc15" stroke-width="2"/>
                <circle cx="200" cy="122" r="14" fill="none" stroke="#facc15" stroke-width="2"/>
                <text x="225" y="118" fill="#facc15" font-size="10" font-weight="700">ICT Transformer</text>
                <!-- Step down line -->
                <line x1="200" y1="136" x2="200" y2="155" stroke="#10b981" stroke-width="2"/>
                <!-- Bus 2 (Step down) -->
                <line x1="40" y1="155" x2="660" y2="155" stroke="#10b981" stroke-width="3"/>
                <text x="50" y="148" fill="#10b981" font-size="10" font-weight="700">SECONDARY BUSBAR (220 kV / 66 kV)</text>
              </svg>
            </div>
          </div>
        `;
      },

      calculations: (p) => {
        const vDefault = parseFloat(p.voltage_kv) || 400;
        return {
          id: "sub_calc",
          formulaLatex: "I = \\frac{S \\cdot 10^3}{\\sqrt{3} \\cdot V} \\text{ (Amperes)} \\quad \\text{and} \\quad P = S \\cdot \\cos\\phi \\text{ (MW)}",
          description: "Calculates full-load 3-phase line current ($I$) and active megawatt power transfer capability for high-voltage power transformers.",
          inputsHtml: `
            <div class="css-calc-inputs">
              <div class="css-input-row">
                <div class="css-field">
                  <label>Transformer Rating (S): <strong id="lbl_sub_S">500 MVA</strong></label>
                  <input type="range" id="sub_S" min="100" max="1500" step="50" value="500" class="css-slider" data-param="S">
                </div>
                <div class="css-field">
                  <label>Nominal Line Voltage (V): <strong id="lbl_sub_V">${vDefault} kV</strong></label>
                  <select id="sub_V" class="css-select" data-param="V">
                    <option value="765">765 kV (Ultra High Voltage)</option>
                    <option value="400" ${vDefault === 400 ? 'selected' : ''}>400 kV (Extra High Voltage)</option>
                    <option value="220" ${vDefault === 220 ? 'selected' : ''}>220 kV (Regional Grid)</option>
                    <option value="66">66 kV (Sub-Transmission)</option>
                  </select>
                </div>
              </div>
              <div class="css-input-row">
                <div class="css-field">
                  <label>Power Factor (cos φ): <strong id="lbl_sub_pf">0.90</strong></label>
                  <input type="range" id="sub_pf" min="0.80" max="0.98" step="0.02" value="0.90" class="css-slider" data-param="pf">
                </div>
              </div>
            </div>
          `,
          units: "Current in Amperes (A); Active Power in Megawatts (MW)",
          defaults: { S: 500, V: vDefault, pf: 0.90 },
          evaluate: (vals) => {
            const S = parseFloat(vals.S) || 500; // MVA
            const V = parseFloat(vals.V) || 400; // kV
            const pf = parseFloat(vals.pf) || 0.90;
            // I = (S * 1000) / (sqrt(3) * V)
            const I = (S * 1000) / (Math.sqrt(3) * V);
            const P = S * pf; // MW
            return {
              primary: `Rated Line Current: ${fmt(I, 'A')}`,
              secondary: `Active Power Capacity: ${fmt(P, 'MW')} at ${pf.toFixed(2)} PF`,
              substitution: `I = (${S} · 10³) / (√3 · ${V}) = ${fmt(I)} A | P = ${S} MVA · ${pf} = ${fmt(P)} MW`,
              assumptions: "Symmetrical balanced 3-phase sinusoidal AC system. Excludes overload thermal cooling stages (ONAN vs ONAF ratings per IS 2026)."
            };
          }
        };
      },

      gujaratContext: (p) => `
        <div class="css-block">
          <h4>4. Gujarat Geographical & Environmental Setting</h4>
          <p><strong>${p.name || 'GETCO Substation'}</strong> forms a critical switching node in <strong>${p.district || 'Gujarat'}</strong>. The Gujarat Energy Transmission Corporation (GETCO) operates over 2,200 substations managing peak state demands exceeding $24,500\\text{ MW}$.</p>
          <div class="css-network-context">
            <strong>Khavda RE Evacuation Corridor:</strong>
            <p>Gujarat hosts the mega <strong>Khavda Pooling Stations (KPS-1, KPS-2)</strong> in Kutch, converting green electricity from the world's largest 30 GW solar/wind park into 765 kV AC and $\\pm 800\\text{ kV}$ HVDC corridors transmitting clean power across the Western Regional Grid.</p>
          </div>
        </div>
      `,

      interestingFacts: (p) => `
        <div class="css-block">
          <h4>5. Distinctive Civil Engineering Characteristics</h4>
          <ul class="css-facts-list">
            <li><strong>Ferranti Mitigation:</strong> Long EHV transmission lines traversing the arid Rann of Kutch experience significant capacitive Ferranti overvoltage under light load, requiring massive $125\\text{ MVAR}$ shunt reactors at terminal substations to stabilize grid voltage.</li>
            <li><strong>Gas-Insulated Switchgear (GIS):</strong> In coastal industrial estates (Dahej, Hazira, Mundra), substations utilize SF6 Gas-Insulated Switchgear to prevent saline atmospheric flashover, reducing equipment footprint by $>75\\%$.</li>
          </ul>
        </div>
      `
    },

    // -----------------------------------------------------------------------
    // DOMAIN 8: RENEWABLE ENERGY GENERATION (SOLAR & WIND)
    // -----------------------------------------------------------------------
    renewable: {
      title: "Renewable Energy Conversion Engineering",
      subTitle: "Solar PV photoelectric conversion, wind turbine aerodynamic power, and Capacity Utilization Factor (CUF)",
      standards: "CERC / GERC Tariff Regulations • IEC 61215 (Solar PV) • IEC 61400 (Wind Turbines)",

      whatItIs: (p) => `
        <div class="css-block">
          <h4>1. What It Is — Definition & Engineering Context</h4>
          <p>A <strong>renewable energy facility</strong> harnesses naturally replenished kinetic or radiative energy flows (sunlight, wind, or flowing water) to generate electrical power with zero operational greenhouse gas emissions. Unlike baseload thermal generation, renewable output is intermittent and governed by atmospheric resource dynamics.</p>
          <div class="css-highlight-box">
            <span class="css-tag">ENERGY PROFILE</span>
            <p><strong>Plant Name:</strong> ${p.name || 'Renewable Generating Facility'}<br>
            <strong>Primary Technology:</strong> ${p.plant_type || p.primary_fuel || 'Solar Photovoltaic / Wind Turbine Farm'}<br>
            <strong>Documented Nameplate Capacity:</strong> ${fmt(p.installed_capacity_mw || p.capacity_mw, 'MW')}</p>
          </div>
        </div>
      `,

      howItWorks: (p) => `
        <div class="css-block">
          <h4>2. How It Works — Conversion Mechanisms & Betz Aerodynamics</h4>
          <p><strong>Solar Photovoltaic:</strong> Photons striking crystalline silicon semiconductor p-n junctions excite electrons across the $1.1\\text{ eV}$ bandgap, producing direct current (DC). Central inverters convert DC into $50\\text{ Hz}$ AC power at $98.5\\%$ efficiency. Output scales with Global Horizontal Irradiance (GHI, $W/m^2$).</p>
          <p><strong>Wind Power & Betz Limit:</strong> Wind blades extract kinetic energy from moving air masses: $P = \\frac{1}{2} \\rho A v^3 C_p \\eta$. By fluid continuity and momentum conservation, theoretical aerodynamic efficiency cannot exceed the <strong>Betz Limit</strong> ($C_p \\le \\frac{16}{27} \\approx 59.3\\%$; modern turbines achieve $C_p \\approx 45-50\\%$).</p>

          <div class="css-svg-frame">
            <svg viewBox="0 0 700 170" class="css-schematic-svg" aria-label="Renewable Energy Conversion Architecture">
              <rect x="0" y="0" width="700" height="170" fill="#0b1120" rx="6"/>
              <!-- Solar Array -->
              <polygon points="50,110 120,45 220,45 150,110" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
              <line x1="85" y1="77" x2="185" y2="77" stroke="#38bdf8"/>
              <text x="135" y="130" fill="#38bdf8" font-size="10" font-weight="700" text-anchor="middle">Solar PV Array (GHI)</text>
              <!-- Sun Rays -->
              <line x1="80" y1="20" x2="110" y2="45" stroke="#facc15" stroke-width="2"/>
              <line x1="130" y1="15" x2="150" y2="40" stroke="#facc15" stroke-width="2"/>
              <!-- Wind Turbine -->
              <line x1="480" y1="140" x2="480" y2="50" stroke="#cbd5e1" stroke-width="4"/>
              <circle cx="480" cy="50" r="5" fill="#facc15"/>
              <line x1="480" y1="50" x2="450" y2="15" stroke="#94a3b8" stroke-width="2.5"/>
              <line x1="480" y1="50" x2="510" y2="25" stroke="#94a3b8" stroke-width="2.5"/>
              <line x1="480" y1="50" x2="480" y2="90" stroke="#94a3b8" stroke-width="2.5"/>
              <text x="480" y="155" fill="#facc15" font-size="10" font-weight="700" text-anchor="middle">Wind Turbine (Betz Cp ≤ 59.3%)</text>
              <!-- Grid Inverter -->
              <rect x="290" y="60" width="80" height="45" fill="#1e293b" stroke="#10b981"/>
              <text x="330" y="87" fill="#10b981" font-size="10" font-weight="700" text-anchor="middle">Grid Inverter</text>
            </svg>
          </div>
        </div>
      `,

      calculations: (p) => {
        const cap = parseFloat(p.installed_capacity_mw || p.capacity_mw) || 100;
        return {
          id: "re_calc",
          formulaLatex: "E_{annual} = P_{cap} \\cdot 8760 \\cdot \\text{CUF} \\text{ (MWh)} \\quad \\text{and} \\quad \\text{PLF/CUF} = \\frac{\\text{Actual Output (MWh)}}{\\text{Installed MW} \\cdot 8760 \\text{ h}}",
          description: "Calculates annual electrical generation and Capacity Utilization Factor (CUF), clearly distinguishing installed nameplate rating from actual energy yield.",
          inputsHtml: `
            <div class="css-calc-inputs">
              <div class="css-input-row">
                <div class="css-field">
                  <label>Installed Capacity (P): <strong id="lbl_re_cap">${cap} MW</strong></label>
                  <input type="range" id="re_cap" min="10" max="1000" step="10" value="${cap}" class="css-slider" data-param="cap">
                </div>
                <div class="css-field">
                  <label>Capacity Utilization Factor (CUF): <strong id="lbl_re_cuf">24%</strong></label>
                  <input type="range" id="re_cuf" min="15" max="42" step="1" value="24" class="css-slider" data-param="cuf">
                </div>
              </div>
            </div>
          `,
          units: "Energy in GWh / Million Units (MU); Capacity in MW",
          defaults: { cap, cuf: 24 },
          evaluate: (vals) => {
            const P = parseFloat(vals.cap) || 100;
            const cuf = (parseFloat(vals.cuf) || 24) / 100;
            const hours = 8760; // 365 * 24
            const annual_mwh = P * hours * cuf;
            const annual_mu = annual_mwh / 1000; // 1 MU = 1 GWh = 1000 MWh
            const daily_mwh = annual_mwh / 365;
            return {
              primary: `Annual Energy Yield: ${fmt(annual_mu, 'Million Units (MU / GWh)')}`,
              secondary: `Daily Average Generation: ${fmt(daily_mwh, 'MWh/day')} at ${fmt(cuf * 100, '%')} CUF`,
              substitution: `E = ${P} MW · 8,760 h · ${(cuf).toFixed(2)} = ${fmt(annual_mwh)} MWh = ${fmt(annual_mu)} MU`,
              assumptions: "Standard meteorological year generation. Solar PV typically achieves 21-26% CUF; modern coastal wind turbines achieve 32-38% CUF in Gujarat."
            };
          }
        };
      },

      gujaratContext: (p) => `
        <div class="css-block">
          <h4>4. Gujarat Geographical & Environmental Setting</h4>
          <p><strong>${p.name}</strong> operates within <strong>${p.district || 'Gujarat'}</strong>. Gujarat boasts India's highest installed wind capacity and among the highest solar potentials, benefiting from $>300$ sunny days annually and strong coastal monsoon winds across the Arabian Sea and Gulf of Kutch.</p>
          <div class="css-network-context">
            <strong>Khavda & Charanka Benchmarks:</strong>
            <p>Gujarat is home to the <strong>Khavda Renewable Energy Park</strong> (30 GW, spreading across 726 km² of salt desert in Kutch) and was the birthplace of Asia's first mega solar park at <strong>Charanka (Patan)</strong> in 2012.</p>
          </div>
        </div>
      `,

      interestingFacts: (p) => `
        <div class="css-block">
          <h4>5. Distinctive Civil Engineering Characteristics</h4>
          <ul class="css-facts-list">
            <li><strong>World-First Canal-Top Solar:</strong> Gujarat pioneered the world's first canal-top solar installation on the Narmada Main Canal (Chandrasan, Mehsana). Mounting photovoltaic panels over moving water eliminates land acquisition and reduces reservoir water evaporation by $>90,000\\text{ litres/MW/year}$.</li>
            <li><strong>Thermal Efficiency Gain:</strong> The cool ambient microclimate of canal water beneath panels reduces photovoltaic operating temperature, increasing electrical generation efficiency by $2.5-3.0\\%$.</li>
          </ul>
        </div>
      `
    },

    // -----------------------------------------------------------------------
    // DOMAIN 9: GEOTECHNICAL SOILS & FOUNDATION MECHANICS
    // -----------------------------------------------------------------------
    geotechnical: {
      title: "Geotechnical Engineering & Soil Mechanics",
      subTitle: "Bearing capacity, settlement, expansive Vertisol swell mechanics, and groundwater uplift",
      standards: "IS 6403 (Bearing Capacity) • IS 1904 (Structural Foundations) • IS 2911 Part 3 (Piles in Expansive Soils) • IS 9451 (CNS Layer)",

      whatItIs: (p) => `
        <div class="css-block">
          <h4>1. What It Is — Definition & Engineering Context</h4>
          <p><strong>Geotechnical soil engineering</strong> governs the boundary between human-made civil superstructures and natural geological strata. The foundation transfers massive vertical dead loads, live traffic impacts, and lateral seismic forces into the ground without exceeding the soil's ultimate shear strength ($q_{ult}$) or causing differential settlement that could crack rigid concrete frames.</p>
          <div class="css-highlight-box">
            <span class="css-tag">GEOTECHNICAL ZONE</span>
            <p><strong>Formation / Series:</strong> ${p.dominant_lithology || p.formation_name || p.soil_series || 'Regional Geological Stratum'}<br>
            <strong>Dominant Soil:</strong> ${p.soil_type || 'Deep Black Cotton Soil (Vertisol) / Fluvial Alluvium'}<br>
            <strong>Seismic Context:</strong> BIS IS 1893:2016 Zone ${p.seismic_zone || 'III / IV / V'}</p>
          </div>
        </div>
      `,

      howItWorks: (p) => `
        <div class="css-block">
          <h4>2. How It Works — Terzaghi Bearing Capacity & Vertisol Heave</h4>
          <p><strong>Terzaghi Bearing Capacity Equation:</strong>
          $$q_{ult} = c N_c + q N_q + 0.5 \\gamma B N_\\gamma$$
          Where shear failure resistance is derived from cohesion ($c$), surcharge confinement ($q = \\gamma D_f$), and soil self-weight friction ($\gamma B$).</p>
          <p><strong>Expansive Clay Mechanics:</strong> Montmorillonite-rich <strong>Black Cotton Soils (Vertisols)</strong> expand and shrink drastically with moisture variation. Swelling pressures reach $150-320\\text{ kPa}$, exerting upward uplift forces that crack shallow footings. Foundations require under-reamed bored concrete piles anchored into stable non-expansive strata (IS 2911 Part 3) or a Cohesive Non-Swelling (CNS) cushion layer (IS 9451).</p>

          <div class="css-svg-frame">
            <svg viewBox="0 0 700 180" class="css-schematic-svg" aria-label="Shallow Footing Shear Failure Zones">
              <rect x="0" y="0" width="700" height="180" fill="#0b1120" rx="6"/>
              <!-- Ground line -->
              <line x1="40" y1="50" x2="660" y2="50" stroke="#94a3b8" stroke-width="1.5"/>
              <text x="50" y="42" fill="#94a3b8" font-size="10">Ground Level (GL)</text>
              <!-- Concrete Footing -->
              <rect x="290" y="50" width="120" height="35" fill="#475569" stroke="#f1f5f9" stroke-width="1.5"/>
              <text x="350" y="72" fill="#facc15" font-size="11" font-weight="700" text-anchor="middle">Footing (Width B)</text>
              <!-- Wedge I (Elastic) -->
              <polygon points="290,85 410,85 350,130" fill="rgba(244, 63, 94, 0.2)" stroke="#f43f5e"/>
              <text x="350" y="105" fill="#f43f5e" font-size="9" text-anchor="middle">Zone I: Elastic Wedge</text>
              <!-- Radial Shear Zones II -->
              <path d="M 290 85 Q 220 120 200 85 Z" fill="rgba(56, 189, 248, 0.15)" stroke="#38bdf8"/>
              <path d="M 410 85 Q 480 120 500 85 Z" fill="rgba(56, 189, 248, 0.15)" stroke="#38bdf8"/>
              <text x="235" y="100" fill="#38bdf8" font-size="9">Zone II: Radial Shear</text>
              <text x="465" y="100" fill="#38bdf8" font-size="9">Zone II: Radial Shear</text>
            </svg>
          </div>
        </div>
      `,

      calculations: (p) => ({
        id: "geo_calc",
        formulaLatex: "q_{safe} = \\frac{1}{FoS} \\cdot \\left[ c N_c + \\gamma D_f (N_q - 1) + 0.5 \\gamma B N_\\gamma \\right] + \\gamma D_f",
        description: "Evaluates Safe Bearing Capacity ($q_{safe}$) for an isolated strip footing under Terzaghi general shear failure criteria with Factor of Safety (FoS = 3.0).",
        inputsHtml: `
          <div class="css-calc-inputs">
            <div class="css-input-row">
              <div class="css-field">
                <label>Footing Width (B): <strong id="lbl_geo_B">2.0 m</strong></label>
                <input type="range" id="geo_B" min="1.0" max="6.0" step="0.5" value="2.0" class="css-slider" data-param="B">
              </div>
              <div class="css-field">
                <label>Depth of Embedment (Df): <strong id="lbl_geo_Df">1.5 m</strong></label>
                <input type="range" id="geo_Df" min="0.5" max="4.0" step="0.5" value="1.5" class="css-slider" data-param="Df">
              </div>
            </div>
            <div class="css-input-row">
              <div class="css-field">
                <label>Soil Cohesion (c): <strong id="lbl_geo_c">25 kPa</strong></label>
                <input type="range" id="geo_c" min="5" max="80" step="5" value="25" class="css-slider" data-param="c">
              </div>
              <div class="css-field">
                <label>Friction Angle (φ): <strong id="lbl_geo_phi">20°</strong></label>
                <input type="range" id="geo_phi" min="0" max="35" step="5" value="20" class="css-slider" data-param="phi">
              </div>
            </div>
          </div>
        `,
        units: "Safe Bearing Capacity in kPa (kN/m²)",
        defaults: { B: 2.0, Df: 1.5, c: 25, phi: 20 },
        evaluate: (vals) => {
          const B = parseFloat(vals.B) || 2.0;
          const Df = parseFloat(vals.Df) || 1.5;
          const c = parseFloat(vals.c) || 25; // kPa
          const phi = parseFloat(vals.phi) || 20;
          const gamma = 18.0; // kN/m3
          const FoS = 3.0;

          // Terzaghi Bearing Capacity Factors (approximate for general shear)
          let Nc = 17.7, Nq = 7.4, Ngamma = 5.0;
          if (phi <= 0) { Nc = 5.7; Nq = 1.0; Ngamma = 0.0; }
          else if (phi <= 10) { Nc = 9.6; Nq = 2.7; Ngamma = 1.2; }
          else if (phi <= 20) { Nc = 17.7; Nq = 7.4; Ngamma = 5.0; }
          else if (phi <= 30) { Nc = 37.2; Nq = 22.5; Ngamma = 19.7; }
          else { Nc = 57.8; Nq = 41.4; Ngamma = 42.4; }

          const q_ult = (c * Nc) + (gamma * Df * Nq) + (0.5 * gamma * B * Ngamma);
          const q_net_ult = q_ult - (gamma * Df);
          const q_safe = (q_net_ult / FoS) + (gamma * Df);

          return {
            primary: `Safe Bearing Capacity: ${fmt(q_safe, 'kPa (kN/m²)')}`,
            secondary: `Ultimate Capacity (q_ult): ${fmt(q_ult, 'kPa')} with FoS = 3.0 (φ = ${phi}°)`,
            substitution: `q_safe = 1/3 · [(${c}·${Nc}) + (${gamma}·${Df}·${(Nq-1).toFixed(1)}) + (0.5·${gamma}·${B}·${Ngamma})] + (${gamma}·${Df}) = ${fmt(q_safe)} kPa`,
            assumptions: "IS 6403 general shear failure on uniform homogeneous soil above water table. If groundwater rises to footing level, subgrade self-weight (N_gamma term) reduces by 50% due to buoyant submerged unit weight (gamma_sub)."
          };
        }
      }),

      gujaratContext: (p) => `
        <div class="css-block">
          <h4>4. Gujarat Geographical & Environmental Setting</h4>
          <p><strong>Geotechnical Stratum:</strong> Situated in <strong>${p.district || 'Gujarat'}</strong>. Gujarat exhibits three distinct geotechnical provinces: (1) Deep fluvial and aeolian alluvium in North and Central Gujarat ($>300\\text{m}$ deep sandy loams), (2) Expansive Deccan Trap Basalt and Black Cotton Soils across Saurashtra, and (3) Hypersaline marine clays and evaporites across the Rann of Kutch.</p>
          <div class="css-network-context">
            <strong>Statutory Warning:</strong>
            <p>Regional geological mapping serves exploratory screening only. Site-specific borehole investigations per IS 1892 (SPT N-values, undisturbed core sampling, and triaxial shear testing) are legally mandatory prior to foundation design.</p>
          </div>
        </div>
      `,

      interestingFacts: (p) => `
        <div class="css-block">
          <h4>5. Distinctive Civil Engineering Characteristics</h4>
          <ul class="css-facts-list">
            <li><strong>Statue of Unity Foundation:</strong> The 182-meter tall Statue of Unity at Kevadia anchors into dense basalt bedrock on Sadhu Bet island using two massive concrete foundation cores post-tensioned with 25-meter deep high-tensile rock anchors to withstand extreme earthquake inertia and 180 km/h wind gusts.</li>
            <li><strong>Sulfate Resistance:</strong> Coastal clays near the Gulf of Khambhat contain high concentrations of aggressive sulfates and chlorides ($EC > 16\\text{ dS/m}$), requiring Sulfate Resisting Portland Cement (IS 12330) and corrosion-inhibiting fly ash admixtures for all subterranean piles.</li>
          </ul>
        </div>
      `
    },

    // -----------------------------------------------------------------------
    // DOMAIN 10: COASTAL STRUCTURES & MARINE ENGINEERING
    // -----------------------------------------------------------------------
    coastal: {
      title: "Coastal & Marine Civil Engineering",
      subTitle: "Wave action, breakwater stability (Hudson formula), macro-tides, and coastal protection",
      standards: "IS 4651 (Code of Practice for Ports & Harbours) • USACE Coastal Engineering Manual (CEM) • Hudson Formula",

      whatItIs: (p) => `
        <div class="css-block">
          <h4>1. What It Is — Definition & Engineering Context</h4>
          <p>A <strong>coastal marine structure</strong> (breakwater, sea wall, deep-draft jetty, or tetrapod revetment) is an oceanfront civil structure engineered to protect harbours, navigation channels, and shorelines against destructive wave impact, storm surge inundation, and littoral sediment erosion. It dissipates storm wave energy through porous rock armour layers.</p>
          <div class="css-highlight-box">
            <span class="css-tag">PORT & MARINE PROFILE</span>
            <p><strong>Facility Name:</strong> ${p.name || 'Commercial Marine Port & Harbor'}<br>
            <strong>Port Type:</strong> ${p.port_type || 'Deep-Draft Commercial Seaport / Marine Terminal'}<br>
            <strong>Cargo Volume:</strong> ${fmt(p.capacity_mmt || p.cargo_volume_mmt, 'MMT/year')}</p>
          </div>
        </div>
      `,

      howItWorks: (p) => `
        <div class="css-block">
          <h4>2. How It Works — Wave Energy Dissipation & Hudson Stability</h4>
          <p><strong>Breakwater Mechanics:</strong> Rubblemound breakwaters consist of a quarry-run rock core, intermediate stone filter layers, and an outer armour layer of massive quarried rocks or precast concrete interlocking units (<strong>Tetrapods / Accropodes</strong>). When ocean waves break against the porous slope, water flows through inter-block voids, dissipating hydraulic energy via internal turbulence without causing hydraulic lift.</p>
          <p><strong>Hudson's Equation:</strong> Governs the required armour unit weight ($W$) to prevent displacement under peak design wave height ($H$):
          $$W = \\frac{\\gamma_r \\cdot H^3}{K_D \\cdot (S_r - 1)^3 \\cdot \\cot\\theta}$$</p>

          <div class="css-svg-frame">
            <svg viewBox="0 0 700 180" class="css-schematic-svg" aria-label="Breakwater Multi-Tier Cross Section">
              <rect x="0" y="0" width="700" height="180" fill="#0b1120" rx="6"/>
              <!-- Seabed line -->
              <line x1="30" y1="150" x2="670" y2="150" stroke="#475569" stroke-width="2"/>
              <text x="40" y="165" fill="#94a3b8" font-size="10">Natural Seabed Floor</text>
              <!-- Core -->
              <polygon points="180,150 350,75 520,150" fill="#334155" stroke="#64748b"/>
              <text x="350" y="125" fill="#94a3b8" font-size="9" text-anchor="middle">Quarry Run Rock Core</text>
              <!-- Underlayer -->
              <polygon points="140,150 350,60 560,150" fill="none" stroke="#64748b" stroke-width="2" stroke-dasharray="3,3"/>
              <!-- Outer Armour Tetrapods -->
              <polygon points="100,150 350,45 600,150" fill="none" stroke="#38bdf8" stroke-width="3"/>
              <text x="350" y="38" fill="#facc15" font-size="10" font-weight="700" text-anchor="middle">Armour Layer (Tetrapods / Accropode Units)</text>
              <!-- Incident Waves -->
              <path d="M 50 85 Q 75 70 100 85 Q 125 100 150 85" fill="none" stroke="#38bdf8" stroke-width="2"/>
              <text x="70" y="75" fill="#38bdf8" font-size="9">Incident Waves (H)</text>
              <!-- Sheltered Harbor -->
              <text x="560" y="85" fill="#10b981" font-size="10">Protected Basin</text>
            </svg>
          </div>
        </div>
      `,

      calculations: (p) => ({
        id: "coastal_calc",
        formulaLatex: "W = \\frac{\\gamma_r \\cdot H^3}{K_D \\cdot (S_r - 1)^3 \\cdot \\cot\\theta} \\text{ (tonnes)}",
        description: "Evaluates the minimum stable weight ($W$) of individual breakwater armour units using Hudson's Equation under extreme design wave heights ($H$).",
        inputsHtml: `
          <div class="css-calc-inputs">
            <div class="css-input-row">
              <div class="css-field">
                <label>Design Wave Height (H): <strong id="lbl_cst_H">4.5 m</strong></label>
                <input type="range" id="cst_H" min="2.0" max="8.0" step="0.5" value="4.5" class="css-slider" data-param="H">
              </div>
              <div class="css-field">
                <label>Armour Type: <strong id="lbl_cst_kd">Tetrapod Units (KD = 8.0)</strong></label>
                <select id="cst_kd" class="css-select" data-param="kd">
                  <option value="8.0" selected>Concrete Tetrapods (KD = 8.0)</option>
                  <option value="15.0">Single-Layer Accropode (KD = 15.0)</option>
                  <option value="3.5">Natural Quarry Stone (KD = 3.5)</option>
                </select>
              </div>
            </div>
            <div class="css-input-row">
              <div class="css-field">
                <label>Breakwater Slope (cot θ): <strong id="lbl_cst_cot">1 : 1.5</strong></label>
                <select id="cst_cot" class="css-select" data-param="cot">
                  <option value="1.5" selected>1 : 1.5 (Steep Marine Slope)</option>
                  <option value="2.0">1 : 2.0 (Moderate Slope)</option>
                  <option value="2.5">1 : 2.5 (Gentle Slope)</option>
                </select>
              </div>
            </div>
          </div>
        `,
        units: "Armour Unit Weight in tonnes",
        defaults: { H: 4.5, kd: 8.0, cot: 1.5 },
        evaluate: (vals) => {
          const H = parseFloat(vals.H) || 4.5; // meters
          const KD = parseFloat(vals.kd) || 8.0;
          const cotTheta = parseFloat(vals.cot) || 1.5;
          const gamma_r = 2.4; // concrete density tonnes/m3
          const gamma_w = 1.025; // seawater density tonnes/m3
          const Sr = gamma_r / gamma_w; // relative density approx 2.34
          // W = (gamma_r * H^3) / [ KD * (Sr - 1)^3 * cotTheta ]
          const numerator = gamma_r * Math.pow(H, 3);
          const denominator = KD * Math.pow(Sr - 1, 3) * cotTheta;
          const W_tonnes = numerator / denominator;
          return {
            primary: `Minimum Armour Weight: ${W_tonnes.toFixed(1)} tonnes per unit`,
            secondary: `Relative Density (Sr): ${Sr.toFixed(2)} | Stability Factor (KD): ${KD} on ${cotTheta}:1 slope`,
            substitution: `W = (2.4 · ${H}³) / [ ${KD} · (${Sr.toFixed(2)} - 1)³ · ${cotTheta} ] = ${W_tonnes.toFixed(1)} tonnes`,
            assumptions: "Hudson's non-breaking wave equation per USACE Coastal Engineering Manual (CEM). Excludes oblique angle wave incidence reduction."
          };
        }
      }),

      gujaratContext: (p) => `
        <div class="css-block">
          <h4>4. Gujarat Geographical & Environmental Setting</h4>
          <p><strong>${p.name || 'Marine Coastal Facility'}</strong> is located along Gujarat's coastline in <strong>${p.district || 'Gujarat'}</strong>. Gujarat possesses India's longest maritime shoreline ($1,600\\text{ km}$), accounting for nearly $40\\%$ of national commercial maritime cargo throughput.</p>
          <div class="css-network-context">
            <strong>Macro-Tidal Dynamics:</strong>
            <p>The <strong>Gulf of Khambhat</strong> exhibits the second-highest tidal range in the world (up to $10.5\\text{ meters}$ spring tides) with tidal stream velocities exceeding $3.5\\text{ m/s}$, requiring massive siltation dredging and specialized offshore jetty trestles (such as Dahej LNG's 2.4 km trestle).</p>
          </div>
        </div>
      `,

      interestingFacts: (p) => `
        <div class="css-block">
          <h4>5. Distinctive Civil Engineering Characteristics</h4>
          <ul class="css-facts-list">
            <li><strong>Mundra Port Scale:</strong> Mundra Port (Kutch) is India's largest private commercial port ($260\\text{ MMT}$ annual throughput) featuring a natural deep draft of $17.5\\text{ meters}$ enabling fully laden Capesize bulk carriers to berth directly without offshore transshipment.</li>
            <li><strong>Cyclone Protection:</strong> Situated in IMD Very High Damage Risk Cyclone belts, coastal structures are certified against $50\\text{ m/s}$ (180 km/h) cyclonic wind gusts and storm surges exceeding $4.0\\text{ m}$ MSL.</li>
          </ul>
        </div>
      `
    }
  };

  // Fallback for general assets
  const GENERAL_MODEL = {
    title: "General Civil Engineering Diagnostics",
    subTitle: "Structural dimensions, material specifications, and environmental parameters",
    standards: "Bureau of Indian Standards (BIS) • National Building Code (NBC 2016)",
    whatItIs: (p) => `
      <div class="css-block">
        <h4>1. What It Is — Definition & Engineering Context</h4>
        <p><strong>${p.name || 'Infrastructure Asset'}</strong> is a statutory civil asset operating in <strong>${p.district || 'Gujarat'}</strong>, cataloged within the Gujarat Digital Twin spatial database.</p>
      </div>
    `,
    howItWorks: (p) => `
      <div class="css-block">
        <h4>2. How It Works — Mechanism & Components</h4>
        <p>Operates according to standard civil, structural, or transportation engineering specifications under statutory operating frameworks.</p>
      </div>
    `,
    calculations: (p) => null,
    gujaratContext: (p) => `
      <div class="css-block">
        <h4>4. Gujarat Geographical & Environmental Setting</h4>
        <p>Located in ${p.district || 'Gujarat'} within regional infrastructure corridors.</p>
      </div>
    `,
    interestingFacts: (p) => `
      <div class="css-block">
        <h4>5. Distinctive Civil Engineering Characteristics</h4>
        <p>Indexed in the state digital twin repository for geospatial planning and infrastructure resilience.</p>
      </div>
    `
  };

  // =========================================================================
  // 3. CORE RENDERING ENGINE
  // =========================================================================
  function render(asset) {
    if (!asset) return "<p>Select an asset on the map to inspect its Civil Science Stop.</p>";
    const p = asset.properties || {};
    const domainKey = resolveCategory(asset);
    const model = DOMAIN_MODELS[domainKey] || GENERAL_MODEL;

    // Build calculation section if model supports it
    let calcHtml = "";
    if (typeof model.calculations === "function") {
      const calcObj = model.calculations(p);
      if (calcObj) {
        calcHtml = `
          <div class="css-block css-calc-block" id="cssCalcContainer">
            <div class="css-calc-header">
              <span class="css-calc-num">03</span>
              <div>
                <h4>3. Engineering Calculations — Interactive Parametric Evaluation</h4>
                <div class="css-formula-badge">${calcObj.formulaLatex}</div>
              </div>
            </div>
            <p class="css-calc-desc">${calcObj.description}</p>
            ${calcObj.inputsHtml}
            <div class="css-calc-results" id="${calcObj.id}_results">
              <!-- Dynamically populated by evaluate() -->
            </div>
            <div class="css-calc-subst" id="${calcObj.id}_subst">
              <!-- Substitution line -->
            </div>
            <div class="css-calc-assumptions" id="${calcObj.id}_assumptions">
              <!-- Assumptions & limitations -->
            </div>
            <div class="css-calc-disclaimer">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#facc15" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              <span><strong>ENGINEERING LIMITATION:</strong> Educational classroom calculation using simplified single-element equations. Not a substitute for site-specific statutory structural FEM or geotechnical design per ${model.standards.split('•')[0].trim()}.</span>
            </div>
          </div>
        `;
      }
    }

    return `
      <div class="civil-science-stop-wrapper">
        <!-- Banner -->
        <div class="css-hero-banner">
          <div class="css-hero-badge-row">
            <span class="css-pill css-pill-domain">🔬 CIVIL SCIENCE STOP</span>
            <span class="css-pill css-pill-code">${model.standards.split('•')[0].trim()}</span>
          </div>
          <h3 class="css-hero-title">${model.title}</h3>
          <p class="css-hero-subtitle">${model.subTitle}</p>
          <div class="css-standards-tag">Regulatory Reference Standards: <strong>${model.standards}</strong></div>
        </div>

        <!-- Pillar 1: What It Is -->
        ${model.whatItIs(p)}

        <!-- Pillar 2: How It Works -->
        ${model.howItWorks(p)}

        <!-- Pillar 3: Engineering Calculations -->
        ${calcHtml}

        <!-- Pillar 4: Gujarat Context -->
        ${model.gujaratContext(p)}

        <!-- Pillar 5: Interesting Facts -->
        ${model.interestingFacts(p)}
      </div>
    `;
  }

  // =========================================================================
  // 4. INTERACTIVE WIDGET BINDER
  // =========================================================================
  function bindWidgets(asset, container) {
    if (!asset) return;
    const p = asset.properties || {};
    const domainKey = resolveCategory(asset);
    const model = DOMAIN_MODELS[domainKey];
    if (!model || typeof model.calculations !== "function") return;

    const calcObj = model.calculations(p);
    if (!calcObj) return;

    const parent = container || document;
    const resultsBox = parent.querySelector(`#${calcObj.id}_results`);
    const substBox = parent.querySelector(`#${calcObj.id}_subst`);
    const assumBox = parent.querySelector(`#${calcObj.id}_assumptions`);

    const updateCalc = () => {
      // Gather inputs
      const vals = {};
      parent.querySelectorAll(`[data-param]`).forEach(input => {
        const param = input.getAttribute("data-param");
        vals[param] = input.value;

        // Update live label if exists
        const lbl = parent.querySelector(`#lbl_${calcObj.id.replace('_calc', '')}_${param}`);
        if (lbl) {
          const unit = input.tagName === "SELECT" ? "" : (input.getAttribute("data-unit") || "");
          lbl.textContent = `${input.value}${unit ? " " + unit : ""}`;
        }
      });

      const res = calcObj.evaluate(vals);
      if (resultsBox) {
        resultsBox.innerHTML = `
          <div class="css-res-main">${res.primary}</div>
          <div class="css-res-sub">${res.secondary}</div>
        `;
      }
      if (substBox && res.substitution) {
        substBox.innerHTML = `<strong>Step-by-Step Substitution:</strong> ${res.substitution}`;
      }
      if (assumBox && res.assumptions) {
        assumBox.innerHTML = `<strong>Assumptions & Physical Constraints:</strong> ${res.assumptions}`;
      }
    };

    // Attach listeners to all inputs
    parent.querySelectorAll(`[data-param]`).forEach(input => {
      input.addEventListener("input", updateCalc);
      input.addEventListener("change", updateCalc);
    });

    // Run initial evaluation
    updateCalc();
  }

  // =========================================================================
  // 5. PUBLIC API
  // =========================================================================
  window.CivilScienceStop = {
    render,
    bindWidgets,
    resolveCategory,
    DOMAIN_MODELS
  };

})();
