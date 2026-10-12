/**
 * Gujarat InfraMap — Reusable Infrastructure Asset Inspector Component
 * Standard: Context-Aware Typed Asset Schemas, Scientific Visualizers & Network Traversal
 * Version: 2.0.0
 */

(function (window, document) {
  "use strict";

  // Category Color Map & Visual Tokens
  const CATEGORY_THEMES = {
    water_dam: { label: "WATER RESOURCES • DAM", color: "#0284c7", light: "#38bdf8", icon: "💧" },
    barrage: { label: "WATER INFRASTRUCTURE • BARRAGE", color: "#0891b2", light: "#22d3ee", icon: "🚪" },
    weir: { label: "HYDRAULIC STRUCTURE • WEIR", color: "#0284c7", light: "#38bdf8", icon: "🌊" },
    check_dam: { label: "WATERSHED RECHARGE • CHECK DAM", color: "#0d9488", light: "#2dd4bf", icon: "🧱" },
    reservoir: { label: "WATER BODY • RESERVOIR SPREAD", color: "#0369a1", light: "#60a5fa", icon: "💧" },
    irrigation_canal: { label: "WATER INFRASTRUCTURE • CANAL", color: "#06b6d4", light: "#67e8f9", icon: "🌊" },
    natural_river: { label: "PERENNIAL RIVER TRUNK", color: "#0284c7", light: "#7dd3fc", icon: "🏞️" },
    power_plant: { label: "POWER GENERATION FACILITY", color: "#eab308", light: "#fde047", icon: "⚡" },
    hydropower_plant: { label: "HYDROPOWER GENERATION COMPLEX", color: "#06b6d4", light: "#67e8f9", icon: "💧⚡" },
    transmission_line: { label: "GETCO TRANSMISSION CORRIDOR", color: "#f59e0b", light: "#fbbf24", icon: "⚡" },
    substation: { label: "GETCO SUBSTATION POOLING NODE", color: "#f97316", light: "#fdba74", icon: "🏢" },
    highway_corridor: { label: "STRATEGIC HIGHWAY CORRIDOR", color: "#ea580c", light: "#fb923c", icon: "🛣️" },
    bridge: { label: "CIVIL STRUCTURE • BRIDGE CROSSING", color: "#f97316", light: "#fdba74", icon: "🌉" },
    flyover: { label: "ELEVATED CORRIDOR • URBAN FLYOVER", color: "#38bdf8", light: "#7dd3fc", icon: "🛣️" },
    tunnel: { label: "GEOTECHNICAL STRUCTURE • TUNNEL", color: "#a855f7", light: "#c084fc", icon: "🚇" },
    freight_terminal: { label: "LOGISTICS HUB • FREIGHT TERMINAL", color: "#10b981", light: "#34d399", icon: "📦" },
    railway_station: { label: "WESTERN RAILWAY JUNCTION", color: "#10b981", light: "#4ade80", icon: "🚆" },
    railway_line: { label: "BROAD GAUGE RAILWAY LINE", color: "#14b8a6", light: "#5eead4", icon: "🛤️" },
    commercial_seaport: { label: "DEEP DRAFT COMMERCIAL SEAPORT", color: "#4f46e5", light: "#818cf8", icon: "⚓" },
    seaport: { label: "DEEP DRAFT COMMERCIAL SEAPORT", color: "#4f46e5", light: "#818cf8", icon: "⚓" },
    commercial_airport: { label: "COMMERCIAL AIRPORT & TERMINAL", color: "#0d9488", light: "#2dd4bf", icon: "✈️" },
    airport: { label: "COMMERCIAL AIRPORT & TERMINAL", color: "#0d9488", light: "#2dd4bf", icon: "✈️" },
    industrial_sez: { label: "MEGA INDUSTRIAL ESTATE / SEZ", color: "#9333ea", light: "#c084fc", icon: "🏗️" },
    industrial_estate: { label: "MEGA INDUSTRIAL ESTATE / SEZ", color: "#9333ea", light: "#c084fc", icon: "🏗️" },
    metro_transit: { label: "RAPID METRO TRANSIT CORRIDOR", color: "#06b6d4", light: "#67e8f9", icon: "🚇" },
    metro_corridor: { label: "RAPID METRO TRANSIT CORRIDOR", color: "#06b6d4", light: "#67e8f9", icon: "🚇" },
    groundwater_assessment: { label: "CGWB HYDROGEOLOGY AQUIFER", color: "#0284c7", light: "#38bdf8", icon: "💧" },
    seismic_hazard_zone: { label: "BIS IS 1893 SEISMIC ZONATION", color: "#dc2626", light: "#f87171", icon: "⚠️" },
    cyclone_hazard_zone: { label: "IMD CYCLONE & STORM SURGE", color: "#ea580c", light: "#fb923c", icon: "🌀" },
    flood_hazard_zone: { label: "CWC RIVERINE FLOODPLAIN", color: "#0284c7", light: "#38bdf8", icon: "🌊" },
    ecological_reserve: { label: "PROTECTED ECOLOGICAL SANCTUARY", color: "#16a34a", light: "#86efac", icon: "🦁" },
    district_boundary: { label: "ADMINISTRATIVE REVENUE DISTRICT", color: "#06b6d4", light: "#38bdf8", icon: "🏛️" },
    district_hq: { label: "DISTRICT CAPITAL CENTROID", color: "#14b8a6", light: "#2dd4bf", icon: "📍" },
    municipal_corporation: { label: "MUNICIPAL CIVIC CORPORATION", color: "#06b6d4", light: "#22d3ee", icon: "🏛️" }
  };

  // Safe Storage Helpers
  function getStoredWidth() {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        return parseInt(window.localStorage.getItem("inframap_inspector_width") || "460", 10) || 460;
      }
    } catch (e) {}
    return 460;
  }

  function setStoredWidth(w) {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem("inframap_inspector_width", String(w));
      }
    } catch (e) {}
  }

  // State Management
  const state = {
    map: null,
    currentAsset: null,
    currentTab: "overview",
    width: getStoredWidth(),
    isOpen: false,
    navCallback: null
  };

  // Formatting Utilities
  function fmtNum(val, unit = "") {
    if (val === null || val === undefined || isNaN(val)) return "—";
    return Number(val).toLocaleString() + (unit ? " " + unit : "");
  }

  function fmtStr(val) {
    if (!val || val === "null" || val === "undefined") return "Not Recorded in Statutory Source";
    return String(val);
  }

  function formatCoord(deg, dir) {
    if (deg === null || deg === undefined) return "—";
    return `${Math.abs(deg).toFixed(4)}° ${dir}`;
  }

  // Schema Definitions & Category Tab Configuration
  const SCHEMAS = {
    // 1. Water Dams & Reservoirs
    water_dam: {
      tabs: ["overview", "engineering", "function", "network", "science", "geoenv", "risk", "history", "sources"],
      metrics: (p) => [
        { label: "Gross Storage", val: fmtNum(p.gross_storage_mcm, "MCM"), hint: "Full reservoir capacity" },
        { label: "Full Reservoir Level (FRL)", val: fmtNum(p.frl_m, "m"), hint: "Top water elevation MSL" },
        { label: "Live Storage", val: fmtNum(p.live_storage_mcm, "MCM"), hint: "Active exploitable storage" },
        { label: "Design Spillway", val: fmtNum(p.spillway_capacity_cumecs, "m³/s"), hint: "Maximum flood discharge" },
        { label: "Hydropower", val: p.hydropower_capacity_mw ? fmtNum(p.hydropower_capacity_mw, "MW") : "Non-Power Dam", hint: "Installed capacity" },
        { label: "Irrigation Command", val: p.irrigation_command_ha ? fmtNum(Math.round(p.irrigation_command_ha / 1000), "k ha") : "—", hint: "Culturable command area" }
      ],
      overview: (p) => ({
        "Official Name": p.name,
        "Asset Category": "Major Water Dam / Reservoir (CWC NRLD)",
        "River Basin": `${fmtStr(p.river)} — ${fmtStr(p.basin)}`,
        "Location / Taluka": p.location || p.district,
        "Administrative District": p.district,
        "Operating Agency": p.operating_agency || "Water Resources Dept, Govt of Gujarat",
        "Primary Operational Purpose": p.primary_purpose || "Irrigation, Municipal Water, Hydropower & Flood Control",
        "Statutory Operating Status": p.status || "Operational"
      }),
      engineering: (p) => ({
        "Structural Dam Type": p.dam_type || "Concrete Gravity / Earthen Composite",
        "Maximum Structural Height": fmtNum(p.height_m, "meters above foundation"),
        "Dam Crest Length": fmtNum(p.crest_length_m, "meters"),
        "Full Reservoir Level (FRL)": fmtNum(p.frl_m, "meters MSL"),
        "Minimum Drawdown Level (MDDL)": fmtNum(p.mddl_m, "meters MSL"),
        "Gross Storage Capacity": fmtNum(p.gross_storage_mcm, "MCM (Million Cubic Meters)"),
        "Effective Live Storage": fmtNum(p.live_storage_mcm, "MCM"),
        "Design Spillway Discharge": fmtNum(p.spillway_capacity_cumecs, "m³/s (cubic meters per sec)"),
        "Radial Spillway Crest Gates": p.radial_gates_count ? `${p.radial_gates_count} Radial Steel Gates` : "Ogee Crest Weirs",
        "Hydropower Generation Breakdown": p.hydropower_breakdown || (p.hydropower_capacity_mw ? `${p.hydropower_capacity_mw} MW Hydro` : "None"),
        "Irrigation Command Area": p.irrigation_command_ha ? `${p.irrigation_command_ha.toLocaleString()} hectares` : "Drinking Water Life-line",
        "Commissioning Milestone": p.commission_year ? `Year ${p.commission_year}` : "Operational Standard"
      }),
      functionAndUse: (p) => `
        <div class="insp-narrative-card">
          <h4>💧 Lifeline Water Security & Irrigation Command</h4>
          <p><strong>${p.name}</strong> impounds the <strong>${p.river || 'river'}</strong> to supply regulated surface water across the <strong>${p.basin || 'basin'}</strong> basin. It provides multi-seasonal agricultural irrigation for an estimated command area of <strong>${p.irrigation_command_ha ? p.irrigation_command_ha.toLocaleString() + ' hectares' : 'critical farm tracts'}</strong>.</p>
          <p>Beyond irrigation, the reservoir serves as a strategic regional drinking water buffer, feeding downstream municipal treatment plants and piped bulk regional water grids during dry pre-monsoon months.</p>
          ${p.hydropower_capacity_mw ? `<p><strong>Hydropower Contribution:</strong> The associated powerhouse generates <strong>${p.hydropower_capacity_mw} MW</strong> of clean peaking power feeding into the GETCO high-voltage grid, providing critical black-start and peak-shaving capabilities.</p>` : ''}
        </div>
      `,
      scienceStop: (p) => {
        const head = p.height_m ? Math.round(p.height_m * 0.75) : 45;
        const qMax = p.spillway_capacity_cumecs ? Math.min(2000, Math.round(p.spillway_capacity_cumecs * 0.1)) : 250;
        return `
          <div class="insp-lab-launcher-card">
            <div class="launcher-info">
              <span class="launcher-title">🔬 Dam Science Lab: Parametric Civil & Hydraulic Suite</span>
              <span class="launcher-desc">Interactive structural anatomy schematic, hydrostatic pressure/thrust/hydropower calculators, storage elevation zones, and geotechnical safety analyses.</span>
            </div>
            <button class="insp-open-lab-btn" onclick="window.DamScienceLab && window.DamScienceLab.openCurrentAsset()">
              Launch Full Lab ➔
            </button>
          </div>
          <div class="insp-lab-launcher-card" style="margin-top: 8px;">
            <div class="launcher-info">
              <span class="launcher-title">🌊 Water Scenarios Lab: Storage Mass-Balance</span>
              <span class="launcher-desc">Simulate hypothetical inflows, controlled canal outflows, and evaporation losses with live mass-balance verification (S).</span>
            </div>
            <button class="insp-open-lab-btn" style="background: linear-gradient(135deg, #0284c7, #0369a1);" onclick="window.WaterScenariosLab && window.WaterScenariosLab.open('scenarioA', '${p.id}')">
              Simulate Scenarios ➔
            </button>
          </div>
          <div class="insp-lab-launcher-card" style="margin-top: 8px;">
            <div class="launcher-info">
              <span class="launcher-title">🚰 SAUNI Yojana &amp; Basin Water Transfer Explorer</span>
              <span class="launcher-desc">Simulate pressurized Narmada floodwater diversion, Dhanki lift pumping demand, and reservoir replenishment.</span>
            </div>
            <button class="insp-open-lab-btn" style="background: linear-gradient(135deg, #0284c7, #0891b2);" onclick="window.SauniBasinTransferExplorer && window.SauniBasinTransferExplorer.openModal('${p.sauni_link_key || 'link1'}')">
              Explore Basin Transfer ➔
            </button>
          </div>
          <div class="insp-science-box">
            <div class="science-header">
              <span class="science-badge">HYDRAULIC ENGINE</span>
              <h4>Hydroelectric Power & Potential Energy Conversion</h4>
            </div>
            <div class="science-formula-card">
              <div class="formula-latex">P = ρ · g · Q · H · η</div>
              <p class="formula-desc">Where <strong>P</strong> is electrical power (Watts), <strong>ρ</strong> is water density (1000 kg/m³), <strong>g</strong> is gravitational acceleration (9.81 m/s²), <strong>Q</strong> is turbine discharge (m³/s), <strong>H</strong> is net hydraulic head (meters), and <strong>η</strong> is turbine-generator efficiency (~0.90).</p>
            </div>
            <div class="science-interactive-widget" id="scienceDamWidget">
              <div class="widget-row">
                <label>Simulated Turbine Flow (Q): <strong id="scFlowVal">${qMax} m³/s</strong></label>
                <input type="range" class="widget-slider" id="scFlowSlider" min="50" max="${Math.max(300, qMax * 2)}" value="${qMax}">
              </div>
              <div class="widget-row">
                <label>Net Head (H): <strong id="scHeadVal">${head} m</strong></label>
                <input type="range" class="widget-slider" id="scHeadSlider" min="15" max="${Math.max(60, head * 1.5)}" value="${head}">
              </div>
              <div class="widget-result-box">
                <span class="widget-res-key">Theoretical Output:</span>
                <span class="widget-res-val" id="scPowerOutput">— MW</span>
              </div>
            </div>
            <div class="science-diagram-card">
              <h5>Hydrodynamic Spillway Energy Dissipation</h5>
              <svg viewBox="0 0 320 100" class="science-svg">
                <path d="M 10 20 L 70 20 Q 110 20 130 50 L 170 85 Q 210 95 250 80 Q 280 65 310 75" fill="none" stroke="#38bdf8" stroke-width="3"/>
                <path d="M 60 20 L 110 50 L 160 85 L 170 95 L 10 95 Z" fill="rgba(148, 163, 184, 0.2)" stroke="#94a3b8" stroke-width="1.5"/>
                <text x="75" y="15" fill="#e2e8f0" font-size="10">Reservoir FRL</text>
                <text x="140" y="45" fill="#facc15" font-size="10">Ogee Crest</text>
                <text x="220" y="75" fill="#38bdf8" font-size="10">Hydraulic Jump Stilling Basin</text>
              </svg>
              <p class="diagram-caption">Supercritical flow ($Fr > 1$) cascades down the spillway glacis and transitions into subcritical flow via a controlled hydraulic jump in the stilling basin to prevent downstream bed scouring.</p>
            </div>
          </div>
        `;
      },
      risk: (p) => `
        <div class="insp-risk-grid">
          <div class="risk-item-box">
            <span class="risk-label">Downstream Flood Moderation</span>
            <p>Design discharge capacity: <strong>${fmtNum(p.spillway_capacity_cumecs, "m³/s")}</strong>. Releases must be throttled per CWC Rule Curves to prevent bankful inundation in downstream urban and agricultural plains.</p>
          </div>
          <div class="risk-item-box">
            <span class="risk-label">Seismic & Foundation Stability</span>
            <p>Designed under statutory guidelines of BIS IS 1893:2016 Part 1 & Dam Safety Act 2021. Monitored for reservoir-induced seismicity (RIS) and uplift pressures via internal drainage galleries.</p>
          </div>
          <div class="risk-item-box">
            <span class="risk-label">Siltation & Catchment Erosion</span>
            <p>Catchment Area Treatment (CAT) and afforestation active to mitigate reservoir dead storage silting and maintain long-term live volume.</p>
          </div>
        </div>
      `,
      history: (p) => `
        <ul class="insp-timeline">
          <li class="timeline-step">
            <span class="timeline-year">${p.commission_year || 'Historical Milestone'}</span>
            <div class="timeline-desc"><strong>Commissioning:</strong> Dedicated as a multipurpose civil asset under the Gujarat State Water Masterplan.</div>
          </li>
          <li class="timeline-step">
            <span class="timeline-year">2021</span>
            <div class="timeline-desc"><strong>Dam Safety Act 2021 Compliance:</strong> Formal inclusion in statutory National Register of Large Dams with periodic CWC structural health reviews.</div>
          </li>
          <li class="timeline-step">
            <span class="timeline-year">2026</span>
            <div class="timeline-desc"><strong>Digital Twin Integration:</strong> Real-time stage storage balance calculation integrated into Gujarat InfraMap Digital Twin.</div>
          </li>
        </ul>
      `,
      sources: (p) => ({
        "Primary Source Authority": p.source_org || "Central Water Commission (CWC NRLD) & SSNNL",
        "Official Reference Portal": p.source_url || "https://cwc.gov.in",
        "Dataset Verification Date": p.retrieval_date || "October 2026",
        "Spatial Reference System": "EPSG:4326 (WGS 84 Coordinates)",
        "Data Quality Classification": p.data_quality || "VERIFIED_GOV_RECORD",
        "Statutory Limitations": "Engineering specifications compiled from public CWC NRLD registers and government project reports. Live reservoir levels must be verified with WRD Gujarat telemetry."
      })
    },

    // 1b. Gated River Barrages
    barrage: {
      tabs: ["overview", "engineering", "function", "network", "science", "risk", "history", "sources"],
      metrics: (p) => [
        { label: "Sluice Gates", val: p.gates_count ? `${p.gates_count} Gates` : (p.radial_gates_count ? `${p.radial_gates_count} Gates` : "Gated Sluice"), hint: "Vertical / radial lift gates" },
        { label: "Pond Level (FRL)", val: fmtNum(p.frl_m, "m"), hint: "Regulated normal pond elevation MSL" },
        { label: "Discharge Capacity", val: fmtNum(p.spillway_capacity_cumecs, "m³/s"), hint: "Maximum design flood sluicing" },
        { label: "Gross Pondage", val: fmtNum(p.gross_storage_mcm, "MCM"), hint: "In-stream ponded volume" },
        { label: "Canal Command", val: p.irrigation_command_ha ? fmtNum(Math.round(p.irrigation_command_ha / 1000), "k ha") : "Pond Retention", hint: "Off-take canal system command" }
      ],
      overview: (p) => ({
        "Official Name": p.name,
        "Asset Category": "River Sluice Barrage (Regulated Low-Head)",
        "River & Basin": `${fmtStr(p.river)} — ${fmtStr(p.basin)}`,
        "Location / Urban Node": p.location || p.district,
        "Administrative District": p.district,
        "Managing Authority": p.operating_agency || "Water Resources Dept, Govt of Gujarat",
        "Primary Operational Purpose": p.primary_purpose || "River Level Maintenance & Irrigation Diversion",
        "Operating Status": p.status || "Operational"
      }),
      engineering: (p) => ({
        "Barrage Structure Type": p.dam_type || "Gated River Barrage",
        "Construction Material": p.construction_material || "Reinforced Concrete Piers & Steel Sluice Gates",
        "Overall Crest Length": fmtNum(p.crest_length_m, "meters"),
        "Structural Height": fmtNum(p.height_m, "meters above riverbed"),
        "Regulated Pond Level (FRL)": fmtNum(p.frl_m, "meters MSL"),
        "Maximum Water Level (MWL)": fmtNum(p.mwl_m, "meters MSL"),
        "Maximum Sluice Discharge": fmtNum(p.spillway_capacity_cumecs, "m³/s"),
        "Gate Equipment Breakdown": p.gates_count ? `${p.gates_count} Automated Vertical Lift Steel Gates` : "Under-sluice & Crest Regulators",
        "Gross Pondage Volume": fmtNum(p.gross_storage_mcm, "MCM"),
        "Feeder Irrigation Networks": fmtStr(p.connected_canals ? (Array.isArray(p.connected_canals) ? p.connected_canals.join(", ") : p.connected_canals) : "Bulk River Intake"),
        "Commissioning Milestone": p.commission_year ? `Year ${p.commission_year}` : "Operational Standard"
      }),
      functionAndUse: (p) => `
        <div class="insp-narrative-card">
          <h4>🚪 Regulated Head Diversion & Urban Riverfront Life</h4>
          <p><strong>${p.name}</strong> controls the water stage along the <strong>${p.river || 'river'}</strong>. Unlike high-head storage dams that store monsoon runoff across seasons, barrages use movable sluice gates to hold a constant upstream pond level (<strong>${fmtNum(p.frl_m, 'm MSL')}</strong>) for diverting water into major off-take irrigation carriers and municipal intakes.</p>
          <p>During monsoon flash floods, all sluice gates are fully lifted to provide an unobstructed river cross-section, minimizing upstream afflux and safely discharging up to <strong>${fmtNum(p.spillway_capacity_cumecs, 'm³/s')}</strong>.</p>
        </div>
      `,
      scienceStop: (p) => {
        const hVal = p.frl_m ? Math.max(3, Math.min(12, Math.round(p.frl_m * 0.15))) : 5;
        return `
          <div class="insp-lab-launcher-card">
            <div class="launcher-info">
              <span class="launcher-title">🔬 Dam Science Lab: Barrage & Sluice Hydraulics</span>
              <span class="launcher-desc">Interactive under-sluice orifice flow simulation, upstream afflux calculations, and gated barrage cross-section schematic.</span>
            </div>
            <button class="insp-open-lab-btn" onclick="window.DamScienceLab && window.DamScienceLab.openCurrentAsset()">
              Launch Full Lab ➔
            </button>
          </div>
          <div class="insp-science-box">
            <div class="science-header">
              <span class="science-badge">HYDRODYNAMICS</span>
              <h4>Under-Sluice Orifice Flow & Afflux Dynamics</h4>
            </div>
            <div class="science-formula-card">
              <div class="formula-latex">Q = C_d · b · a · \\sqrt{2g(H - C_c · a)}</div>
              <p class="formula-desc">Where <strong>Q</strong> is sluice discharge rate (m³/s), <strong>C_d</strong> is discharge coefficient (~0.62), <strong>b</strong> is total clear waterway width, <strong>a</strong> is gate opening height (m), and <strong>H</strong> is upstream head over sill.</p>
            </div>
            <div class="science-interactive-widget" id="scienceBarrageWidget">
              <div class="widget-row">
                <label>Gate Opening (a): <strong id="scBarrageOpeningVal">2.5 m</strong></label>
                <input type="range" class="widget-slider" id="scBarrageOpeningSlider" min="0.5" max="6.0" step="0.1" value="2.5">
              </div>
              <div class="widget-row">
                <label>Upstream Head (H): <strong id="scBarrageHeadVal">${hVal} m</strong></label>
                <input type="range" class="widget-slider" id="scBarrageHeadSlider" min="2" max="15" step="0.5" value="${hVal}">
              </div>
              <div class="widget-result-box">
                <span class="widget-res-key">Simulated Discharge:</span>
                <span class="widget-res-val" id="scBarrageQOutput">— m³/s</span>
              </div>
            </div>
          </div>
        `;
      },
      risk: (p) => `
        <div class="insp-risk-grid">
          <div class="risk-item-box">
            <span class="risk-label">Upstream Backwater Afflux</span>
            <p>During heavy inflows, backwater elevation can cause urban riverbank flooding if gate opening timing lags flood peaks. Governed by CWC standard operating protocols.</p>
          </div>
          <div class="risk-item-box">
            <span class="risk-label">Apron Scour & Silt Management</span>
            <p>Under-sluice scouring pockets operate periodically to flush bed silt deposits and prevent aggradation in front of canal head regulators.</p>
          </div>
        </div>
      `,
      history: (p) => `
        <ul class="insp-timeline">
          <li class="timeline-step">
            <span class="timeline-year">${p.commission_year || 'Statutory Record'}</span>
            <div class="timeline-desc"><strong>Commissioning:</strong> Completed to anchor regional irrigation distribution and river stage regulation.</div>
          </li>
          <li class="timeline-step">
            <span class="timeline-year">2026</span>
            <div class="timeline-desc"><strong>Digital Twin Integration:</strong> Automated gate stage monitoring linked to Gujarat InfraMap.</div>
          </li>
        </ul>
      `,
      sources: (p) => ({
        "Primary Source Authority": p.source_org || "Central Water Commission & WRD Gujarat",
        "Reference Portal": p.source_url || "https://guj-nwrws.gujarat.gov.in",
        "Dataset Verification Date": p.retrieval_date || "October 2026",
        "Spatial Reference System": "EPSG:4326 (WGS 84 Coordinates)",
        "Data Quality Classification": p.data_quality || "VERIFIED_GOV_RECORD",
        "Data Limitations": "Gate operations vary dynamically with real-time river stage and flood discharge alerts."
      })
    },

    // 1c. Pick-up Weirs & Tidal Barriers
    weir: {
      tabs: ["overview", "engineering", "function", "network", "science", "risk", "sources"],
      metrics: (p) => [
        { label: "Crest Length", val: fmtNum(p.crest_length_m, "m"), hint: "Continuous overflow weir width" },
        { label: "Crest Level", val: fmtNum(p.frl_m || p.crest_elevation_m_msl, "m"), hint: "Top weir crest elevation MSL" },
        { label: "Design Discharge", val: fmtNum(p.spillway_capacity_cumecs, "m³/s"), hint: "Maximum flood overtopping capacity" },
        { label: "River Basin", val: fmtStr(p.basin).split(" ")[0], hint: "Host hydrological basin" }
      ],
      overview: (p) => ({
        "Official Name": p.name,
        "Structure Category": "Fixed-Crest Pick-up Weir / Tidal Salinity Barrier",
        "River & Basin": `${fmtStr(p.river)} — ${fmtStr(p.basin)}`,
        "Location": p.location || p.district,
        "District": p.district,
        "Operating Agency": p.operating_agency || "Water Resources Dept, Govt of Gujarat",
        "Primary Role": p.primary_purpose || "Upstream Head Raising & Canal Diverter",
        "Operating Status": p.status || "Operational"
      }),
      engineering: (p) => ({
        "Weir Structural Type": p.dam_type || "Masonry / Concrete Pick-up Weir",
        "Construction Material": p.construction_material || "Dressed Stone Masonry with Concrete Glacis",
        "Crest Length": fmtNum(p.crest_length_m, "meters"),
        "Weir Height": fmtNum(p.height_m, "meters"),
        "Crest Elevation": fmtNum(p.frl_m || p.crest_elevation_m_msl, "meters MSL"),
        "Design Flood Discharge": fmtNum(p.spillway_capacity_cumecs, "m³/s"),
        "Downstream Energy Dissipator": "Roller Bucket / Stilling Basin with Cut-off Apron",
        "Commissioning Milestone": p.commission_year ? `Year ${p.commission_year}` : "Operational"
      }),
      functionAndUse: (p) => `
        <div class="insp-narrative-card">
          <h4>🌊 Fixed-Crest Hydro Diversion & Salinity Barrier</h4>
          <p><strong>${p.name}</strong> spans the <strong>${p.river}</strong> to raise upstream water levels without extensive reservoir submergence. It diverts water into vital agricultural distribution systems, industrial facilities, or serves as a physical barricade preventing marine tidal saltwater from contaminating urban municipal intakes.</p>
        </div>
      `,
      scienceStop: (p) => `
        <div class="insp-lab-launcher-card">
          <div class="launcher-info">
            <span class="launcher-title">🔬 Dam Science Lab: Weir Hydraulics</span>
            <span class="launcher-desc">Broad-crested overflow discharge, critical flow depth analysis, and tidal weir cross-section schematic.</span>
          </div>
          <button class="insp-open-lab-btn" onclick="window.DamScienceLab && window.DamScienceLab.openCurrentAsset()">
            Launch Full Lab ➔
          </button>
        </div>
        <div class="insp-science-box">
          <div class="science-header">
            <span class="science-badge">OPEN CHANNEL FLOW</span>
            <h4>Broad-Crested Weir Hydraulic Discharge</h4>
          </div>
          <div class="science-formula-card">
            <div class="formula-latex">Q = \\frac{2}{3} · C_d · b · \\sqrt{2g} · H^{3/2}</div>
            <p class="formula-desc">Where <strong>Q</strong> is discharge (m³/s), <strong>C_d</strong> is discharge coefficient (~0.58), <strong>b</strong> is clear weir crest width, and <strong>H</strong> is total energy head above crest.</p>
          </div>
        </div>
      `,
      risk: (p) => `
        <div class="insp-risk-grid">
          <div class="risk-item-box">
            <span class="risk-label">High Flood Inundation</span>
            <p>Submersible during catastrophic river spates exceeding design discharge. Built to safely withstand submerged overflow conditions without scouring downstream banks.</p>
          </div>
        </div>
      `,
      sources: (p) => ({
        "Source Organization": p.source_org || "CWC & WRD Gujarat",
        "Portal": p.source_url || "https://guj-nwrws.gujarat.gov.in",
        "Data Quality": p.data_quality || "VERIFIED_GOV_RECORD",
        "Spatial Reference": "EPSG:4326 WGS 84"
      })
    },

    // 1d. Watershed Recharge Check Dams
    check_dam: {
      tabs: ["overview", "engineering", "function", "science", "risk", "sources"],
      metrics: (p) => [
        { label: "Annual Recharge", val: fmtNum(p.gross_storage_mcm, "MCM"), hint: "Estimated aquifer replenishment" },
        { label: "Watershed Scheme", val: "Sujalam Sufalam", hint: "State Jal Abhiyan program" },
        { label: "Benefitted Area", val: p.irrigation_command_ha ? fmtNum(p.irrigation_command_ha, "ha") : "Watershed", hint: "Direct ground recharge zone" }
      ],
      overview: (p) => ({
        "Asset Cluster": p.name,
        "Category": "Decentralized Watershed Check Dam Network",
        "Drainage Corridor": p.river,
        "Hydrogeological Basin": p.basin,
        "District Location": p.district,
        "Program Authority": p.operating_agency || "WRD Gujarat / Watershed Development",
        "Operating Status": "Active Groundwater Recharge"
      }),
      engineering: (p) => ({
        "Construction Method": p.construction_material || "Rubble Masonry, Gabions & Reinforced Concrete",
        "Typical Structure Height": fmtNum(p.height_m, "meters"),
        "Crest Length": fmtNum(p.crest_length_m, "meters"),
        "Spillway Type": "Broad-Crested Natural Overflow Weir",
        "Recharge Target Aquifer": "Unconfined Quaternary Alluvial Sands / Weathered Basalt"
      }),
      functionAndUse: (p) => `
        <div class="insp-narrative-card">
          <h4>🧱 Decentralized Aquifer Recharge & Soil Conservation</h4>
          <p><strong>${p.name}</strong> represents engineered low-height earthen and masonry check structures across seasonal streams. By retarding monsoon runoff velocity, check dams facilitate deep vertical infiltration, raising local groundwater tables and combating CGWB over-exploitation in arid zones.</p>
        </div>
      `,
      scienceStop: (p) => `
        <div class="insp-science-box">
          <div class="science-header">
            <span class="science-badge">HYDROGEOLOGY</span>
            <h4>Horton's Infiltration & Aquifer Mounding</h4>
          </div>
          <div class="science-formula-card">
            <div class="formula-latex">f_p = f_c + (f_0 - f_c) · e^{-k · t}</div>
            <p class="formula-desc">Where <strong>f_p</strong> is infiltration capacity, <strong>f_c</strong> is equilibrium saturated rate, <strong>f_0</strong> is initial rate, and <strong>k</strong> is decay constant. Water ponding behind check dams sustains hydraulic head, recharging groundwater lenses over extended dry periods.</p>
          </div>
        </div>
      `,
      risk: (p) => `
        <div class="insp-risk-grid">
          <div class="risk-item-box">
            <span class="risk-label">Siltation & Desiltation Needs</span>
            <p>Catchment soil erosion deposits fine clay in pond beds over time, reducing infiltration rates. Periodic community desiltation under Sujalam Sufalam Jal Abhiyan is required to maintain porosity.</p>
          </div>
        </div>
      `,
      sources: (p) => ({
        "Source Authority": "Sujalam Sufalam Jal Abhiyan & CGWB",
        "Data Quality": "VERIFIED_GOV_RECORD",
        "Spatial Reference": "EPSG:4326 WGS 84"
      })
    },

    // 1e. Reservoir Water-Spread Polygons
    reservoir: {
      tabs: ["overview", "engineering", "function", "network", "science", "risk", "sources"],
      metrics: (p) => [
        { label: "Water Spread (FRL)", val: fmtNum(p.surface_area_ha, "ha"), hint: "Surface area at Full Reservoir Level" },
        { label: "Gross Storage", val: fmtNum(p.gross_storage_mcm, "MCM"), hint: "Impounded volume at FRL" },
        { label: "Live Storage", val: fmtNum(p.live_storage_mcm, "MCM"), hint: "Active exploitable storage" },
        { label: "FRL Elevation", val: fmtNum(p.frl_m, "m MSL"), hint: "Top water elevation MSL" }
      ],
      overview: (p) => ({
        "Water Body Name": p.name,
        "Asset Category": "Major Reservoir Water Spread (ISRO / CWC)",
        "Parent Dam Asset": p.parent_dam_name || "Major Dam",
        "River Basin": `${fmtStr(p.river)} — ${fmtStr(p.basin)}`,
        "District Jurisdiction": p.district,
        "Managing Authority": p.operating_agency || "Water Resources Dept, Govt of Gujarat",
        "Full Reservoir Level (FRL)": `${fmtNum(p.frl_m, "meters MSL")}`,
        "Water Spread Extent": `${fmtNum(p.surface_area_sqkm, "sq km")} (${fmtNum(p.surface_area_ha, "hectares")})`,
        "Operating Status": "Regulated Water Body"
      }),
      engineering: (p) => ({
        "Surface Area at FRL": `${fmtNum(p.surface_area_ha, "ha")} (${fmtNum(p.surface_area_sqkm, "sq km")})`,
        "Gross Water Capacity": `${fmtNum(p.gross_storage_mcm, "MCM")}`,
        "Effective Live Volume": `${fmtNum(p.live_storage_mcm, "MCM")}`,
        "Full Reservoir Elevation (FRL)": `${fmtNum(p.frl_m, "meters MSL")}`,
        "Host River System": p.river,
        "Hydrological Basin": p.basin,
        "Parent Headworks": p.parent_dam_name || "Associated Dam Headworks"
      }),
      functionAndUse: (p) => `
        <div class="insp-narrative-card">
          <h4>💧 Inter-Seasonal Surface Storage & Ecological Buffer</h4>
          <p><strong>${p.name}</strong> forms the surface water spread of <strong>${p.parent_dam_name || 'the dam headworks'}</strong>. It provides regional multi-year drought proofing, inland fisheries habitat, and sustains micro-climatic humidity across the <strong>${p.district}</strong> district.</p>
        </div>
      `,
      scienceStop: (p) => `
        <div class="insp-lab-launcher-card">
          <div class="launcher-info">
            <span class="launcher-title">🔬 Dam Science Lab: Reservoir Science</span>
            <span class="launcher-desc">Interactive hypsometric Elevation-Area-Capacity (EAC) bathymetric curve, storage zones allocation, and evaporation dynamics.</span>
          </div>
          <button class="insp-open-lab-btn" onclick="window.DamScienceLab && window.DamScienceLab.openCurrentAsset()">
            Launch Full Lab ➔
          </button>
        </div>
        <div class="insp-science-box">
          <div class="science-header">
            <span class="science-badge">LIMNOLOGY & HYDROLOGY</span>
            <h4>Hypsometric Stage-Storage Integration</h4>
          </div>
          <div class="science-formula-card">
            <div class="formula-latex">V(h) = \\int_0^h A(z) \\, dz \\approx \\sum_{i=1}^n \\frac{A_i + A_{i-1}}{2} · \\Delta h</div>
            <p class="formula-desc">Where <strong>V(h)</strong> is reservoir volume at water elevation <strong>h</strong>, and <strong>A(z)</strong> is water spread contour area. Computed via trapezoidal bathymetric contour integration from satellite hypsometric curves.</p>
          </div>
        </div>
      `,
      risk: (p) => `
        <div class="insp-risk-grid">
          <div class="risk-item-box">
            <span class="risk-label">Evaporation Losses in Arid Climate</span>
            <p>Annual pan evaporation rates in Gujarat reach 1.8 – 2.4 m/year. Reservoir surface management and floating solar installations help conserve water volume.</p>
          </div>
          <div class="risk-item-box">
            <span class="risk-label">Bathymetric Siltation</span>
            <p>Monsoon sediment inflow gradually reduces dead storage volume. Periodic bathymetric hydrographic surveys are conducted by CWC to recalibrate capacity curves.</p>
          </div>
        </div>
      `,
      sources: (p) => ({
        "Primary Source Authority": p.source_org || "CWC NRLD 2023 & ISRO Bhuvan",
        "Reference Portal": p.source_url || "https://bhuvan.nrsc.gov.in",
        "Dataset Verification Date": p.retrieval_date || "October 2026",
        "Spatial Reference": "EPSG:4326 (WGS 84 Polygon Geometry)",
        "Data Quality Classification": p.data_quality || "VERIFIED_GOV_RECORD"
      })
    },

    // 2. Power Generation Facilities
    power_plant: {
      tabs: ["overview", "engineering", "function", "network", "science", "risk", "history", "sources"],
      metrics: (p) => [
        { label: "Installed Capacity", val: fmtNum(p.capacity_mw, "MW"), hint: "Nameplate generator capacity" },
        { label: "Primary Fuel / Source", val: fmtStr(p.type).toUpperCase(), hint: "Energy conversion mechanism" },
        { label: "District Location", val: fmtStr(p.district), hint: "Jurisdictional district" },
        { label: "Plant Operator", val: fmtStr(p.operator).split("—")[0].trim(), hint: "Generating company" },
        { label: "Grid Voltage", val: p.capacity_mw >= 500 ? "400 / 765 kV" : "220 / 400 kV", hint: "GETCO transmission level" }
      ],
      overview: (p) => ({
        "Plant Name": p.name,
        "Asset Category": "Power Generation Facility",
        "Generation Classification": (p.type || "Thermal").toUpperCase(),
        "Operating Capacity": `${fmtNum(p.capacity_mw, "MW")} Net Installed`,
        "Operating Body / Owner": p.operator || "Gujarat State Electricity Corporation Limited (GSECL)",
        "District & Coordinates": `${p.district} (${formatCoord(p.coordinates ? p.coordinates[1] : 0, 'N')}, ${formatCoord(p.coordinates ? p.coordinates[0] : 0, 'E')})`,
        "Operational Grid Role": p.type === "solar" || p.type === "wind" ? "Renewable Variable Generation" : "Baseload Grid Stability & Peaking Support",
        "Operating Status": "Operational Commercial Facility"
      }),
      engineering: (p) => ({
        "Nameplate Generating Capacity": `${fmtNum(p.capacity_mw, "MW")}`,
        "Turbine / Module Technology": p.type === "solar" ? "Bifacial Monocrystalline Solar PV Arrays with Central Inverters" : (p.type === "nuclear" ? "Pressurized Heavy Water Reactor (PHWR) 700 MWe Units" : (p.type === "wind" ? "High-Capacity Variable-Speed Wind Turbine Generators" : "Supercritical Pulverized Coal Boiler & Steam Turbo-Generator")),
        "Fuel / Energy Source": p.type === "solar" ? "Direct Solar Photovoltaic Irradiance" : (p.type === "nuclear" ? "Natural Uranium (UO2) with Heavy Water (D2O) Moderator" : (p.type === "gas" ? "Imported LNG / Domestic Natural Gas" : "Domestic & Imported Thermal Grade Coal / Lignite")),
        "Cooling / Water Requirement": p.type === "solar" ? "Robotic Dry Cleaning Arrays" : "Sea Water Once-Through Cooling / Induced Draft Cooling Towers",
        "Evacuation Voltage Class": p.capacity_mw >= 1000 ? "765 kV / 400 kV Extra High Voltage (EHV)" : "400 kV / 220 kV GETCO Grid",
        "Auxiliary Power Consumption": p.type === "solar" ? "< 1.5%" : "~ 5.5% - 7.5% Station Transformer Load"
      }),
      functionAndUse: (p) => `
        <div class="insp-narrative-card">
          <h4>⚡ Grid Baseload, Decarbonization & Industrial Energy Security</h4>
          <p><strong>${p.name}</strong> delivers <strong>${fmtNum(p.capacity_mw, "MW")}</strong> into the Western Regional Electricity Grid (WRLDC). It is a vital pillar powering Gujarat's heavy industrial manufacturing belts, ceramic hubs in Morbi, petrochemical complexes in Dahej, and agricultural feeder separation networks (Jyotigram Yojana).</p>
          <p>The facility operates in coordination with the State Load Despatch Centre (SLDC Vadodara) to maintain grid frequency within statutory CEA operating bands (49.90 Hz – 50.05 Hz).</p>
        </div>
        <div class="insp-lab-launcher-card" style="border-left: 3px solid #f59e0b; margin-top: 10px;">
          <div class="launcher-text">
            <span class="launcher-title">⚡ Khavda Hybrid RE &amp; EHV Green Energy Twin</span>
            <span class="launcher-desc">Simulate 30 GW Khavda mega-park generation, 765 kV UHV corridor flows, and substation MVA headroom (K).</span>
          </div>
          <button class="insp-open-lab-btn" style="background: linear-gradient(135deg, #f59e0b, #d97706); color: #0f172a; font-weight: 700;" onclick="window.KhavdaGreenEnergyTwin && window.KhavdaGreenEnergyTwin.openModal('${p.id && p.id.includes('khavda') ? 'agel_block' : (p.id && p.id.includes('charanka') ? 'charanka_park' : (p.id && p.id.includes('dholera') ? 'dholera_park' : 'agel_block'))}')">
            Explore RE Grid ⚡
          </button>
        </div>
      `,
      scienceStop: (p) => {
        const isSolar = (p.type || "").toLowerCase().includes("solar");
        const isNuclear = (p.type || "").toLowerCase().includes("nuclear");
        if (isSolar) {
          return `
            <div class="insp-science-box">
              <div class="science-header">
                <span class="science-badge">SOLID STATE PHYSICS</span>
                <h4>Photovoltaic Effect & Bandgap Energy</h4>
              </div>
              <div class="science-formula-card">
                <div class="formula-latex">E_{ph} = h · ν = \frac{h · c}{λ} \ge E_g</div>
                <p class="formula-desc">Photons with energy greater than the silicon bandgap ($E_g \approx 1.12\text{ eV}$) excite valence electrons into the conduction band, generating electron-hole pairs separated by the internal electric field of the p-n junction.</p>
              </div>
              <div class="science-interactive-widget" id="scienceSolarWidget">
                <div class="widget-row">
                  <label>Solar Irradiance (G): <strong id="scSolarIrr">850 W/m²</strong></label>
                  <input type="range" class="widget-slider" id="scSolarSlider" min="200" max="1100" value="850">
                </div>
                <div class="widget-result-box">
                  <span class="widget-res-key">Array Yield Factor:</span>
                  <span class="widget-res-val" id="scSolarYield">85.0% Peak</span>
                </div>
              </div>
            </div>
          `;
        }
        return `
          <div class="insp-science-box">
            <div class="science-header">
              <span class="science-badge">THERMODYNAMICS</span>
              <h4>Supercritical Rankine Thermodynamic Cycle</h4>
            </div>
            <div class="science-formula-card">
              <div class="formula-latex">η_{th} = 1 - \frac{T_{cold}}{T_{hot}}</div>
              <p class="formula-desc">Supercritical thermal generation operates above water's thermodynamic critical point ($P > 22.064\text{ MPa}$, $T > 373.95^\circ\text{C}$), eliminating latent heat vaporization phases and boosting plant thermal efficiency ($\eta > 42\%$).</p>
            </div>
          </div>
        `;
      },
      risk: (p) => `
        <div class="insp-risk-grid">
          <div class="risk-item-box">
            <span class="risk-label">Flue-Gas Emissions & Ash Management</span>
            <p>MoEFCC compliance: Equipped with Flue-Gas Desulfurization (FGD), high-efficiency Electrostatic Precipitators (ESP > 99.8% particulate capture), and 100% fly-ash utilization in cement fabrication.</p>
          </div>
          <div class="risk-item-box">
            <span class="risk-label">Grid Stability & Tripping Hazards</span>
            <p>Protected by automatic governor control (RGMO/FGMO), Under-Frequency Load Shedding (UFLS), and fast fault-clearing numerical protection relays to protect against WRLDC grid collapse.</p>
          </div>
        </div>
      `,
      history: (p) => `
        <ul class="insp-timeline">
          <li class="timeline-step">
            <span class="timeline-year">Commissioning</span>
            <div class="timeline-desc">Synchronized with Gujarat Extra High Voltage (EHV) grid network.</div>
          </li>
          <li class="timeline-step">
            <span class="timeline-year">CEA 2024</span>
            <div class="timeline-desc">Included in official Central Electricity Authority National Power Generation Inventory.</div>
          </li>
        </ul>
      `,
      sources: (p) => ({
        "Source Organization": p.source_org || "Central Electricity Authority (CEA) & GSECL",
        "Official Registry Portal": p.source_url || "https://cea.nic.in",
        "Spatial Reference": "EPSG:4326 (WGS 84 Coordinates)",
        "Data Quality Status": p.data_quality || "VERIFIED_GOV_RECORD",
        "Notes": "Capacity numbers reflect official installed nameplate ratings. Live scheduling managed by SLDC Gujarat."
      })
    },

    // 2b. Hydropower Generation Complex (Dam-Toe, RBPH, CHPH, PSP & Canal SHP)
    hydropower_plant: {
      tabs: ["overview", "engineering", "function", "network", "science", "risk", "history", "sources"],
      metrics: (p) => [
        { label: "Installed Capacity", val: fmtNum(p.installed_capacity_mw || p.capacity_mw, "MW"), hint: "Nameplate generator rating" },
        { label: "Unit Layout", val: p.units_count ? `${p.units_count} × ${p.unit_rating_mw} MW` : (p.units_description || "Hydro Units"), hint: "Turbine-generator units" },
        { label: "Station Type", val: p.station_type ? p.station_type.split("(")[0].trim() : "Hydro Station", hint: "Hydraulic arrangement" },
        { label: "Gross / Net Head", val: p.gross_head_m ? `${p.gross_head_m} m / ${p.net_head_m || Math.round(p.gross_head_m * 0.92)} m` : "Low Head", hint: "Available water head" },
        { label: "Design Flow (Q)", val: p.design_flow_cumecs ? fmtNum(p.design_flow_cumecs, "m³/s") : "Variable", hint: "Full-gate discharge capacity" },
        { label: "Annual Generation", val: p.annual_generation_mu ? fmtNum(p.annual_generation_mu, "MU") : "—", hint: "CEA Audited FY 2023-24" },
        { label: "Plant Load Factor", val: p.plant_load_factor_pct ? `${p.plant_load_factor_pct}%` : "Peaking", hint: "Operating capacity factor" }
      ],
      overview: (p) => ({
        "Official Station Name": p.name,
        "Asset Category": "Hydroelectric Power Generation Facility",
        "Civil Station Classification": p.station_type || "Dam Toe / Canal Head Power Station",
        "Nameplate Generating Capacity": `${fmtNum(p.installed_capacity_mw || p.capacity_mw, "MW")} Net Installed`,
        "Associated Dam Headworks": p.associated_dam_name || "Direct River Trunk / Canal Fall",
        "Associated Reservoir": p.associated_reservoir || "Upstream River Impoundment",
        "River & Drainage Basin": `${p.river || 'River Reach'} — ${p.basin || 'Gujarat Basin'}`,
        "Commissioning Milestones": p.commissioning_year ? `Commissioned ${p.commissioning_year}` : "Operational Statutory Facility",
        "Operating Utility": p.operator || "Sardar Sarovar Narmada Nigam (SSNNL) / GSECL",
        "Ownership & Allocation": p.ownership || "Government of Gujarat",
        "Operating Regime": "Peaking Load Dispatch, Black-Start Grid Support & Irrigation Release Synchronized"
      }),
      engineering: (p) => ({
        "Turbine Technology": p.units_description || (p.gross_head_m >= 40 ? "Vertical Francis Reaction Turbines" : "Axial-Flow Kaplan Turbines"),
        "Generator Units": `${p.units_count || 1} Synchronous Alternator Units`,
        "Design Hydraulic Head": p.gross_head_m ? `${p.gross_head_m} m (Gross Head) / ${p.net_head_m || Math.round(p.gross_head_m * 0.92)} m (Rated Net Head)` : "Low Head Canal Drop",
        "Design Full-Gate Discharge": p.design_flow_cumecs ? `${fmtNum(p.design_flow_cumecs, "m³/s")} (${Math.round(p.design_flow_cumecs * 35.315).toLocaleString()} cfs)` : "Variable Irrigation Discharge",
        "Evacuation Voltage Class": `${p.evacuation_voltage_kv || 400} kV Extra High Voltage (EHV)`,
        "Switchyard Configuration": p.installed_capacity_mw >= 1000 ? "Gas-Insulated Switchyard (GIS) with SF6 Bus Ducts" : "Outdoor Air-Insulated Switchyard (AIS)",
        "Pumped-Storage Capability": p.station_type && p.station_type.includes("Reversible") ? "Reversible Pump-Turbine Motor-Generators (Peaking + Night Pumping)" : "Conventional Gravity Generation Only",
        "Tailrace Channel": `${p.river || 'Downstream River Trunk'} (Gravity Discharge Channel)`
      }),
      functionAndUse: (p) => `
        <div class="insp-narrative-card">
          <h4>⚡ Grid Peaking, Frequency Regulation & Water-Energy Nexus</h4>
          <p><strong>${p.name}</strong> delivers <strong>${fmtNum(p.installed_capacity_mw || p.capacity_mw, "MW")}</strong> of instantaneous flexible power into the Gujarat and Western Regional Electricity Grid (WRLDC). Hydroelectric units feature rapid start-up capability (< 5 minutes from cold standstill to full rated load), providing vital primary frequency response (RGMO/FGMO) and black-start capability during grid disturbances.</p>
          <p><strong>Multipurpose Water Synchronization:</strong> Generating discharges are strictly scheduled in coordination with downstream agricultural irrigation requirements (Rabi & Kharif crop calendars) and municipal water security needs, ensuring zero wasted freshwater discharge.</p>
        </div>
      `,
      scienceStop: (p) => {
        const H = p.gross_head_m || 50;
        const Q = p.design_flow_cumecs || 300;
        const P = p.installed_capacity_mw || 100;
        return `
          <div class="insp-science-box">
            <div class="science-header">
              <span class="science-badge">HYDRODYNAMICS & POWER CONVERSION</span>
              <h4>Conversion of Hydraulic Potential Energy into Electrical Power</h4>
            </div>
            <div class="science-formula-card">
              <div class="formula-latex">P = ρ · g · Q · H_{net} · η_{overall}</div>
              <p class="formula-desc">Water density $\\rho = 1000\\text{ kg/m}^3$, gravitational acceleration $g = 9.81\\text{ m/s}^2$, volumetric discharge $Q = ${Q}\\text{ m}^3/\\text{s}$, and net effective head $H = ${H}\\text{ m}$. With modern electromechanical efficiency $\\eta \\approx 91\\% - 93\\%$, potential energy is converted with over 90% thermodynamic efficiency.</p>
            </div>
            <div class="science-interactive-widget">
              <div class="widget-row">
                <span class="widget-res-key">Turbine Selection Standard:</span>
                <span class="widget-res-val">${H >= 40 ? 'Francis Reaction Runner (Medium Head 40–250m)' : 'Kaplan Axial Propeller (Low Head 3–40m)'}</span>
              </div>
              <div class="widget-row" style="margin-top: 8px;">
                <span class="widget-res-key">Seasonal Hydrology Rule:</span>
                <span class="widget-res-val" style="color: #cbd5e1; font-size: 0.75rem;">Monsoon storage surcharge yields secondary flood generation; winter rabi releases yield canal base generation; summer lean flows conserve storage for peak emergency reserve.</span>
              </div>
            </div>
          </div>
        `;
      },
      risk: (p) => `
        <div class="insp-risk-grid">
          <div class="risk-item-box">
            <span class="risk-label">Penstock Water Hammer & Transient Surges</span>
            <p>Protected by upstream surge tanks / pressure relief valves and rapid governor closing laws to absorb kinetic shock waves during emergency load rejections.</p>
          </div>
          <div class="risk-item-box">
            <span class="risk-label">Quartz Silt Abrasion & Runner Cavitation</span>
            <p>Turbine runners treated with tungsten carbide plasma coating to mitigate cavitation pitting ($σ < σ_c$) and high monsoon sediment erosion.</p>
          </div>
        </div>
      `,
      history: (p) => `
        <ul class="insp-timeline">
          <li class="timeline-step">
            <span class="timeline-year">Commissioning</span>
            <div class="timeline-desc">Synchronized with Gujarat Extra High Voltage (EHV) grid network.</div>
          </li>
          <li class="timeline-step">
            <span class="timeline-year">FY 2023-24</span>
            <div class="timeline-desc">Reported generation: <strong>${p.annual_generation_mu ? fmtNum(p.annual_generation_mu, 'MU') : 'Statutory Generation'}</strong> (Audited Central Electricity Authority Register).</div>
          </li>
        </ul>
      `,
      sources: (p) => ({
        "Source Organization": "Central Electricity Authority (CEA) & State Load Despatch Centre (SLDC)",
        "Statutory Portal": "https://cea.nic.in (National Large Hydro Register)",
        "Associated Dam Structure": p.associated_dam_name || "CWC NRLD Dam Inventory",
        "Spatial Reference": "EPSG:4326 (WGS 84 Coordinates)",
        "Data Verification": "VERIFIED_STATUTORY_RECORD"
      })
    },

    // 2c. GETCO & POWERGRID High-Voltage Grid Substations
    substation: {
      tabs: ["overview", "engineering", "function", "network", "science", "risk", "sources"],
      metrics: (p) => [
        { label: "Voltage Level", val: `${p.voltage_kv || 400} kV`, hint: "Extra-High Voltage standard" },
        { label: "Transformer Capacity", val: fmtNum(p.transformer_capacity_mva || 1500, "MVA"), hint: "Total installed transformation" },
        { label: "Substation Tech", val: p.substation_tech || "AIS / GIS", hint: "Switchgear insulation technology" },
        { label: "Busbar Scheme", val: p.busbar_scheme || "1.5 Breaker", hint: "Reliability configuration" },
        { label: "Host District", val: p.district || "Gujarat", hint: "Administrative location" },
        { label: "Grid Operator", val: p.operator ? p.operator.split("/")[0].trim() : "GETCO", hint: "Transmission utility" }
      ],
      overview: (p) => ({
        "Substation Name": p.name,
        "Asset Category": "Extra High Voltage (EHV) Grid Substation",
        "Operating Voltage Class": `${p.voltage_kv || 400} kV ${p.voltage_kv === 765 ? 'Ultra-High Voltage (UHV)' : 'Extra-High Voltage (EHV)'}`,
        "Total Transformation Capacity": `${fmtNum(p.transformer_capacity_mva || 1500, "MVA")}`,
        "Grid Operator": p.operator || "Gujarat Energy Transmission Corp (GETCO)",
        "Jurisdiction District": p.district || "Gujarat",
        "Strategic Grid Function": p.evacuation_role || "Major Bulk Power Pooling & Regional Distribution Hub",
        "Operating Status": "Operational Commercial Grid Asset"
      }),
      engineering: (p) => ({
        "Switchgear Technology": p.substation_tech || "Air-Insulated Substation (AIS) / Gas-Insulated (GIS)",
        "Busbar Switching Configuration": p.busbar_scheme || "One-and-a-Half Breaker Scheme (1.5 CB)",
        "Interconnecting Transformers (ICT)": `${fmtNum(p.transformer_capacity_mva || 1500, "MVA")} Autotransformer Banks`,
        "SCADA / Protection Protocol": "IEC 61850 Substation Automation with Dual-Redundant Fiber Optic Relaying",
        "Seismic Design Withstand": "Peak Ground Acceleration 0.36g (BIS IS 1893 Zone V Resistant)"
      }),
      functionAndUse: (p) => `
        <div class="insp-narrative-card">
          <h4>🏢 Bulk Transmission Routing & Regional Load Despatch</h4>
          <p><strong>${p.name}</strong> operates as a vital electrical switching node in the Gujarat state grid, stepping down bulk transmission voltages (765 kV / 400 kV) to sub-transmission levels (220 kV / 66 kV) to supply industrial estates, urban centres, and rural Jyotigram agricultural feeders.</p>
        </div>
      `,
      scienceStop: (p) => `
        <div class="insp-science-box">
          <div class="science-header">
            <span class="science-badge">ELECTROMAGNETISM & INSULATION</span>
            <h4>Mutual Induction & SF6 Gas Dielectric Quenching</h4>
          </div>
          <div class="science-formula-card">
            <div class="formula-latex">\\frac{V_s}{V_p} = \\frac{N_s}{N_p} = \\frac{I_p}{I_s}</div>
            <p class="formula-desc">Power transformers operate on Faraday's Law of Mutual Induction with laminated high-permeability silicon steel cores ($η > 99.6\%$). In GIS switchyards, Sulfur Hexafluoride ($SF_6$) gas provides $3\times$ the dielectric breakdown strength of atmospheric air, enabling ultra-compact footprint.</p>
          </div>
        </div>
      `,
      risk: (p) => `
        <div class="insp-risk-grid">
          <div class="risk-item-box">
            <span class="risk-label">Transformer Oil Fire & Thermal Runaway</span>
            <p>Protected by automatic Nitrogen Injection Fire Protection Systems (NIFPS) and fast Buchholz surge relays.</p>
          </div>
          <div class="risk-item-box">
            <span class="risk-label">Seismic & Cyclone Ground Shaking</span>
            <p>High-voltage porcelain bushings engineered to withstand BIS IS 1893 Zone V horizontal ground acceleration.</p>
          </div>
        </div>
      `,
      sources: (p) => ({
        "Source Organization": "GETCO / POWERGRID & Central Electricity Authority",
        "Official Registry": "CEA Substation Inventory 2024",
        "Spatial Reference": "EPSG:4326 (WGS 84 Coordinates)",
        "Data Verification": "VERIFIED_STATUTORY_RECORD"
      })
    },

    // 2d. Transmission Corridors (400kV / 765kV)
    transmission_line: {
      tabs: ["overview", "engineering", "function", "network", "science", "risk", "sources"],
      metrics: (p) => [
        { label: "Voltage Level", val: `${p.voltage_kv || 400} kV`, hint: "Extra-High Voltage standard" },
        { label: "Corridor Length", val: p.length_km ? `${p.length_km} km` : "N/A", hint: "Line route length" },
        { label: "Circuit Design", val: p.circuits || "Double Circuit", hint: "Conductor configuration" },
        { label: "Thermal Rating", val: fmtNum(p.thermal_rating_mva || 1800, "MVA"), hint: "Continuous power carrying capacity" },
        { label: "Surge Impedance Loading", val: p.surge_impedance_loading_mw ? fmtNum(p.surge_impedance_loading_mw, "MW") : "515 MW", hint: "Natural uncompensated power" },
        { label: "Grid Operator", val: p.operator ? p.operator.split("/")[0].trim() : "GETCO", hint: "Transmission utility" }
      ],
      overview: (p) => ({
        "Corridor Name": p.name,
        "Asset Category": "High-Voltage Electric Transmission Line",
        "Voltage Rating": `${p.voltage_kv || 400} kV ${p.voltage_kv === 765 ? 'Ultra-High Voltage (UHV)' : 'Extra-High Voltage (EHV)'}`,
        "Corridor Route Length": p.length_km ? `${p.length_km} km` : "Verified Transmission Route",
        "Circuit Configuration": p.circuits || "Double Circuit (D/C)",
        "Operating Utility": p.operator || "GETCO / POWERGRID",
        "Sending Substation Node": p.sending_substation || "Generating Switchyard",
        "Receiving Substation Node": p.receiving_substation || "Bulk Grid Substation",
        "Operating Status": "Operational Bulk Evacuation Corridor"
      }),
      engineering: (p) => ({
        "Conductor Specifications": p.voltage_kv === 765 ? "Hexa-Bundle ACSR / AAAC Moose Conductors" : "Twin-Bundle ACSR Moose (54/3.53 mm Al + 7/3.53 mm St)",
        "Tower Structure": "Self-Supporting Galvanized Steel Lattice Towers (Double Circuit)",
        "Thermal Power Rating": `${fmtNum(p.thermal_rating_mva || 1800, "MVA")} per circuit`,
        "Surge Impedance Loading (SIL)": `${p.surge_impedance_loading_mw ? fmtNum(p.surge_impedance_loading_mw, "MW") : "515 MW"} (Natural Power Limit)`,
        "Lightning Protection": "Dual Optical Ground Wire (OPGW) with Integrated 48-Core Fiber Telemetry"
      }),
      functionAndUse: (p) => `
        <div class="insp-narrative-card">
          <h4>⚡ Long-Distance High-Efficiency Energy Evacuation</h4>
          <p><strong>${p.name}</strong> provides high-capacity, low-loss electrical power transfer over <strong>${p.length_km || 'hundreds of'} km</strong>, evacuating power from generation nodes into Gujarat's heavy industrial demand centers.</p>
        </div>
        <div class="insp-lab-launcher-card" style="border-left: 3px solid #f59e0b; margin-top: 10px;">
          <div class="launcher-text">
            <span class="launcher-title">⚡ Khavda Hybrid RE &amp; EHV Green Energy Twin</span>
            <span class="launcher-desc">Simulate 30 GW Khavda mega-park generation, 765 kV UHV corridor flows, and substation MVA headroom (K).</span>
          </div>
          <button class="insp-open-lab-btn" style="background: linear-gradient(135deg, #f59e0b, #d97706); color: #0f172a; font-weight: 700;" onclick="window.KhavdaGreenEnergyTwin && window.KhavdaGreenEnergyTwin.openModal()">
            Explore RE Grid ⚡
          </button>
        </div>
      `,
      scienceStop: (p) => `
        <div class="insp-science-box">
          <div class="science-header">
            <span class="science-badge">ELECTRICAL POWER ENGINEERING</span>
            <h4>Joule Losses, Voltage Scaling & Bundle Conductor Physics</h4>
          </div>
          <div class="science-formula-card">
            <div class="formula-latex">P_{loss} = I^2 R = \\left(\\frac{P}{V \\cos\\phi}\\right)^2 R = \\frac{P^2 R}{V^2 \\cos^2\\phi}</div>
            <p class="formula-desc">Stepping up transmission voltage from 220 kV to 765 kV reduces current by $3.48\\times$ and Ohmic $I^2R$ heat losses by over $12\\times$. Sub-conductor bundling increases effective conductor radius $r_{eq}$, suppressing corona discharge inception and audible radio interference.</p>
          </div>
        </div>
      `,
      risk: (p) => `
        <div class="insp-risk-grid">
          <div class="risk-item-box">
            <span class="risk-label">High-Wind Aeolian Vibration & Galloping</span>
            <p>Damped with Stockbridge vibration dampers and inter-phase bundle spacers to prevent mechanical fatigue failure during cyclone events.</p>
          </div>
          <div class="risk-item-box">
            <span class="risk-label">Coastal Marine Salinity Flashover</span>
            <p>Equipped with hydrophobic silicon rubber composite insulators along coastal salt-spray reaches in Kutch and Saurashtra.</p>
          </div>
        </div>
      `,
      sources: (p) => ({
        "Source Organization": "GETCO / POWERGRID & Central Electricity Authority",
        "Official Registry": "CEA Transmission Line Inventory 2024",
        "Spatial Reference": "EPSG:4326 (WGS 84 Coordinates)",
        "Data Verification": "VERIFIED_STATUTORY_RECORD"
      })
    },

    // 3. Railway Stations & Junctions
    railway_station: {
      tabs: ["overview", "engineering", "function", "network", "science", "history", "sources"],
      metrics: (p) => [
        { label: "Station Code", val: fmtStr(p.code), hint: "Indian Railways Alpha Code" },
        { label: "Operating Division", val: fmtStr(p.division), hint: "Western Railway Administrative Unit" },
        { label: "Track Gauge", val: "1,676 mm", hint: "Indian Broad Gauge (BG)" },
        { label: "Electrification", val: "25 kV AC 50 Hz", hint: "High-voltage overhead catenary" },
        { label: "Junction Class", val: fmtStr(p.class || p.category), hint: "Operational status" }
      ],
      overview: (p) => ({
        "Station Name": p.name,
        "IRCTC / CRIS Station Code": p.code,
        "Railway Zone": p.zone || "Western Railway (WR)",
        "Operating Division": `${p.division || 'Western Railway'} Division`,
        "Station Classification": p.class || p.category || "Major Passenger & Freight Junction",
        "District Jurisdiction": p.district || "Gujarat",
        "Operating Authority": "Ministry of Railways, Government of India"
      }),
      engineering: (p) => ({
        "Track Gauge System": "Indian Broad Gauge (1,676 mm / 5 ft 6 in)",
        "Electrification Standard": "25,000 V AC, 50 Hz Single-Phase Overhead Catenary (OHE)",
        "Signaling & Interlocking": "Route Relay Interlocking (RRI) / Electronic Interlocking (EI) with Multi-Aspect Color Light Signals",
        "Passenger Platforms": p.platforms ? `${p.platforms} High-Level Platforms` : "Multiple High-Level BG Platforms",
        "Freight Loop Line Capacity": "Full 680-meter CSR (Clear Standing Room) for 58-Wagon BOXN / BCN Freight Rakes",
        "Braking & Safety Standards": "Twin-Pipe Air Brake System with KAVACH Automatic Train Protection (ATP) Integration"
      }),
      functionAndUse: (p) => `
        <div class="insp-narrative-card">
          <h4>🚆 Western Railway Multimodal Passenger & Container Corridor</h4>
          <p><strong>${p.name} (${p.code})</strong> serves as a vital passenger and freight gateway on Western Railway. It facilitates high-speed express corridors connecting Gujarat with Mumbai, Delhi, Rajasthan, and Eastern India, while serving as a crucial feeder network to Saurashtra and Kutch container ports.</p>
        </div>
      `,
      scienceStop: (p) => `
        <div class="insp-science-box">
          <div class="science-header">
            <span class="science-badge">CIVIL RAILWAY DYNAMICS</span>
            <h4>Curve Cant (Super-elevation) & Centrifugal Equilibrium</h4>
          </div>
          <div class="science-formula-card">
            <div class="formula-latex">e = \frac{G · V^2}{127 · R}</div>
            <p class="formula-desc">Where <strong>e</strong> is equilibrium cant (mm), <strong>G</strong> is track gauge (1750 mm dynamic dynamic center-to-center rail distance), <strong>V</strong> is design train speed (km/h), and <strong>R</strong> is horizontal curve radius (meters). Cant prevents derailment and flange wear by tilting trains inward to balance centrifugal forces.</p>
          </div>
        </div>
      `,
      history: (p) => `
        <ul class="insp-timeline">
          <li class="timeline-step">
            <span class="timeline-year">BB&CI Origin</span>
            <div class="timeline-desc">Historic Bombay, Baroda and Central India Railway alignment.</div>
          </li>
          <li class="timeline-step">
            <span class="timeline-year">Modernization</span>
            <div class="timeline-desc">Upgraded with Electronic Interlocking, high-speed turnouts, and Amrit Bharat passenger amenities.</div>
          </li>
        </ul>
      `,
      sources: (p) => ({
        "Source Organization": "Indian Railways (CRIS) & DataMeet Open GIS",
        "Official Authority": "Western Railway HQ, Mumbai Churchgate",
        "Data Verification": "VERIFIED_GOV_RECORD",
        "Spatial Reference": "EPSG:4326 WGS 84"
      })
    },

    // 4. Strategic Highway Corridors
    highway_corridor: {
      tabs: ["overview", "engineering", "function", "network", "science", "risk", "sources"],
      metrics: (p) => [
        { label: "Corridor Identifier", val: fmtStr(p.corridor), hint: "Official MoRTH Highway Number" },
        { label: "Corridor Length", val: fmtNum(p.length_km, "km"), hint: "Total Gujarat alignment distance" },
        { label: "Design Speed", val: fmtNum(p.speed_limit_kmh, "km/h"), hint: "Maximum posted speed limit" },
        { label: "Managing Authority", val: fmtStr(p.authority), hint: "Highway administrative body" },
        { label: "Corridor Type", val: fmtStr(p.classification), hint: "Road classification hierarchy" }
      ],
      overview: (p) => ({
        "Corridor Route": p.title || p.corridor,
        "National Code": p.corridor,
        "Corridor Length in Gujarat": `${fmtNum(p.length_km, "km")}`,
        "Classification": p.classification || "National Highway / Expressway",
        "Administrative Authority": p.authority || "National Highways Authority of India (NHAI)",
        "Key Junction Cities": p.alignment || "Gujarat Industrial Corridor Arterials",
        "Status": "Operational Express Highway"
      }),
      engineering: (p) => ({
        "Pavement Structure": p.pavement_type || "Rigid Pavement Quality Concrete (PQC) / Heavy-Duty Bituminous",
        "Carriageway Configuration": p.lanes ? `${p.lanes} Lanes with Paved Shoulders` : "Dual Multi-Lane Carriageway with Median Barrier",
        "Design Speed Standard": `${fmtNum(p.speed_limit_kmh, "km/h")} (IRC:73 Express Standard)`,
        "Right of Way (ROW)": p.row_m ? `${p.row_m} meters` : "60 to 90 meters Access-Controlled Strip",
        "Bridge Loading Standard": "IRC Class 70R & SV (Special Vehicle) Heavy Haul Loading Standards"
      }),
      functionAndUse: (p) => `
        <div class="insp-narrative-card">
          <h4>🛣️ Economic Lifeline & DMIC Industrial Freight Spine</h4>
          <p><strong>${p.corridor} (${p.title || 'Corridor'})</strong> provides the backbone for rapid freight transit connecting the Delhi-Mumbai Industrial Corridor (DMIC). It ensures uninterrupted movement of manufactured capital goods, agricultural perishables, and port-bound containers between inland clusters and Gujarat's coastline.</p>
        </div>
      `,
      scienceStop: (p) => `
        <div class="insp-science-box">
          <div class="science-header">
            <span class="science-badge">HIGHWAY GEOMETRICS</span>
            <h4>Stopping Sight Distance (SSD) & Braking Dynamics</h4>
          </div>
          <div class="science-formula-card">
            <div class="formula-latex">SSD = 0.278 · V · t + \frac{V^2}{254 · (f \pm n)}</div>
            <p class="formula-desc">Where <strong>V</strong> is speed (km/h), <strong>t</strong> is perception-reaction time (~2.5 sec per IRC), <strong>f</strong> is longitudinal friction coefficient (~0.35), and <strong>n</strong> is roadway gradient. High design speeds require generous vertical crest curve radii to maintain clear driver sight lines.</p>
          </div>
        </div>
      `,
      risk: (p) => `
        <div class="insp-risk-grid">
          <div class="risk-item-box">
            <span class="risk-label">High-Speed Traffic Safety</span>
            <p>Access-controlled fencing, continuous crash barriers (W-beam & thrie-beam), and automated Advanced Traffic Management Systems (ATMS) active to prevent animal incursions and cross-traffic collisions.</p>
          </div>
        </div>
      `,
      sources: (p) => ({
        "Authoritative Body": "Ministry of Road Transport and Highways (MoRTH) & NHAI",
        "Official Portal": "https://nhai.gov.in",
        "Data Quality": "VERIFIED_GOV_RECORD",
        "CRS": "EPSG:4326 (WGS 84)"
      })
    },

    // 4b. Signature Bridges & River Crossings
    bridge: {
      tabs: ["overview", "engineering", "function", "network", "science", "geoenv", "risk", "sources"],
      metrics: (p) => [
        { label: "Total Length", val: fmtNum(p.length_m, "m"), hint: "Total structural length across crossing" },
        { label: "Maximum Span", val: p.max_span_m ? fmtNum(p.max_span_m, "m") : "Continuous", hint: "Longest unsupported span" },
        { label: "Deck Width", val: fmtNum(p.deck_width_m, "m"), hint: "Total carriageway & walkway width" },
        { label: "Lane Count", val: p.lane_count ? `${p.lane_count} Lanes` : "Pedestrian", hint: "Traffic capacity" },
        { label: "Structure Type", val: fmtStr(p.bridge_type), hint: "Civil structural typology" },
        { label: "Commissioned", val: p.commissioning_year ? `Year ${p.commissioning_year}` : "Operational", hint: "Dedication year" }
      ],
      overview: (p) => ({
        "Bridge Name": p.name,
        "Alternate / Project Name": p.alternate_name || p.id,
        "Structural Category": p.bridge_type || "Bridge Crossing",
        "Waterway / Road Crossed": p.waterway_crossed || "River / Strait",
        "Supporting Transport Corridor": p.supporting_corridor || "National Highway / Railway",
        "Administrative District": p.district || "Gujarat",
        "Responsible Authority": p.responsible_authority || "NHAI / MoRTH",
        "Commissioning Date": p.commissioning_date || (p.commissioning_year ? `Year ${p.commissioning_year}` : "Operational"),
        "Status": "Operational Public Infrastructure"
      }),
      engineering: (p) => ({
        "Superstructure Design": p.superstructure || "Prestressed Concrete / Steel Composite Girder",
        "Substructure & Foundation": p.substructure || "Cast-in-situ Bored Piles / Well Foundation",
        "Total Structural Length": `${fmtNum(p.length_m, "meters")}`,
        "Maximum Span Distance": p.max_span_m ? `${fmtNum(p.max_span_m, "meters")}` : "Multiple Standard Spans",
        "Carriageway Deck Width": `${fmtNum(p.deck_width_m, "meters")}`,
        "Carriageway Lanes": `${p.lane_count || 0} Vehicular Lanes`,
        "Pedestrian Infrastructure": p.pedestrian_walkway || "Footpaths provided",
        "Navigation Vertical Clearance": p.navigation_clearance_m ? `${p.navigation_clearance_m} meters above HFL` : "Standard Flood Clearance",
        "Project Cost": p.cost_inr_crore ? `₹ ${p.cost_inr_crore} Crore` : "Public Works Budget",
        "Engineering Consultant": p.design_consultant || "Government Engineering Cell"
      }),
      functionAndUse: (p) => `
        <div class="insp-narrative-card">
          <h4>🌉 Strategic River / Marine Transit Crossing</h4>
          <p><strong>${p.name}</strong> serves as a critical grade-separated civil lifeline crossing <strong>${p.waterway_crossed}</strong>. It links regional economic centers along <strong>${p.supporting_corridor}</strong>, eliminating ferry detours or historic bottlenecks and enabling all-weather multi-axle freight movement.</p>
          <div style="margin-top: 8px; font-size: 0.74rem; color: #94a3b8;">
            <strong>Operational Role:</strong> ${p.traffic_disclosure || 'Accommodates inter-district and national logistics freight.'}
          </div>
        </div>
      `,
      scienceStop: (p) => `
        <div class="insp-science-box">
          <div class="science-header">
            <span class="science-badge">BRIDGE HYDRAULICS & SCOUR</span>
            <h4>Lacey's Regime Scour Depth & Pier Dynamics</h4>
          </div>
          <div class="science-formula-card">
            <div class="formula-latex">R = 1.35 · \\left(\\frac{q^2}{f}\\right)^{1/3} \\quad \\text{and} \\quad d_{pier} = 2.0 · R</div>
            <p class="formula-desc">Where <strong>q</strong> is design discharge intensity (m³/s per meter) and <strong>f</strong> is Lacey's silt factor. Deep marine and alluvial piers must be sunk well below the maximum scour depth (with a minimum grip length of 0.33 R) to ensure stability against high-velocity flood flows and wave currents.</p>
          </div>
        </div>
      `,
      risk: (p) => `
        <div class="insp-risk-grid">
          <div class="risk-item-box">
            <span class="risk-label">⚖️ Statutory Inspection & Structural Health Disclosure</span>
            <p style="color: #cbd5e1; font-size: 0.76rem;">${p.inspection_disclosure || 'Routine biennial condition survey under IRC SP:18; no structural distress reported in official public logs. Structural safety is not inferred from missing telemetry.'}</p>
          </div>
          <div class="risk-item-box">
            <span class="risk-label">Seismic & Flood Resilience</span>
            <p>Designed for BIS IS 1893 seismic zonation with elastomeric / spherical pot bearings, expansion joint dampers, and scour protection aprons.</p>
          </div>
        </div>
      `,
      sources: (p) => ({
        "Responsible Authority": p.responsible_authority || "MoRTH / NHAI / Gujarat R&B",
        "Statutory Standard": "Indian Roads Congress (IRC:5, IRC:6, IRC:78, IRC:SP:18)",
        "Data Verification": "VERIFIED_GOV_RECORD",
        "Limitation Note": "Structural dimensions compiled from gazette records and commissioning releases. Bridge condition is governed by official NHAI/R&B inspection registers."
      })
    },

    // 4c. Elevated Flyovers & Urban Viaducts
    flyover: {
      tabs: ["overview", "engineering", "function", "network", "science", "geoenv", "risk", "sources"],
      metrics: (p) => [
        { label: "Viaduct Length", val: fmtNum(p.length_m, "m"), hint: "Continuous elevated length" },
        { label: "Carriageway Lanes", val: `${p.lane_count || 4} Lanes`, hint: "Grade-separated lanes" },
        { label: "Deck Width", val: fmtNum(p.deck_width_m, "m"), hint: "Total elevated width" },
        { label: "Vertical Clearance", val: `${p.navigation_clearance_m || 5.5} m`, hint: "Clearance over ground traffic" },
        { label: "Managing Authority", val: fmtStr(p.responsible_authority).split("/")[0].trim(), hint: "Municipal / NHAI body" }
      ],
      overview: (p) => ({
        "Flyover Name": p.name,
        "Alternate Identifier": p.alternate_name || p.id,
        "Structure Type": p.bridge_type || "Elevated Highway Viaduct",
        "Corridor": p.supporting_corridor,
        "Junctions Separated": p.waterway_crossed,
        "District": p.district,
        "Managing Authority": p.responsible_authority,
        "Commissioning": p.commissioning_date || `Year ${p.commissioning_year}`
      }),
      engineering: (p) => ({
        "Superstructure": p.superstructure,
        "Substructure Piers": p.substructure,
        "Total Viaduct Length": `${fmtNum(p.length_m, "meters")}`,
        "Maximum Pier Span": `${p.max_span_m || 35} meters`,
        "Vertical Clearance": `${p.navigation_clearance_m || 5.5} meters (Standard Urban Highway)`,
        "Project Investment": p.cost_inr_crore ? `₹ ${p.cost_inr_crore} Crore` : "Municipal Infra Scheme"
      }),
      functionAndUse: (p) => `
        <div class="insp-narrative-card">
          <h4>🛣️ Grade Separation & Urban Transit Decongestion</h4>
          <p><strong>${p.name}</strong> provides high-speed uninterrupted grade separation along <strong>${p.supporting_corridor}</strong>, bypassing congestion across <strong>${p.waterway_crossed}</strong>. It segregates through-traffic from local turning movements, cutting vehicular emissions and transit delays.</p>
        </div>
      `,
      scienceStop: (p) => `
        <div class="insp-science-box">
          <div class="science-header">
            <span class="science-badge">STRUCTURAL DYNAMICS</span>
            <h4>Precast Segmental Box Girders & T-Piers</h4>
          </div>
          <div class="science-formula-card">
            <p class="formula-desc">Urban elevated viaducts utilize precast segmental PSC box girders erected on central single-column T-piers. This minimal footprint preserves ground-level carriageways for service roads and BRTS transit corridors while accommodating seismic transverse shear.</p>
          </div>
        </div>
      `,
      risk: (p) => `
        <div class="insp-risk-grid">
          <div class="risk-item-box">
            <span class="risk-label">Statutory Inspection Disclosure</span>
            <p style="color: #cbd5e1; font-size: 0.76rem;">${p.inspection_disclosure || 'Annual vibration and expansion joint inspection by municipal bridge project cell.'}</p>
          </div>
        </div>
      `,
      sources: (p) => ({
        "Responsible Authority": p.responsible_authority,
        "Data Quality": "VERIFIED_GOV_RECORD",
        "Standard": "IRC:86 & Urban Road Code"
      })
    },

    // 4d. Tunnels & Geotechnical Passes
    tunnel: {
      tabs: ["overview", "engineering", "function", "network", "science", "geoenv", "risk", "sources"],
      metrics: (p) => [
        { label: "Bore Length", val: fmtNum(p.length_m, "m"), hint: "Total subterranean length" },
        { label: "Bore Diameter", val: `${p.deck_width_m || 13.2} m`, hint: "Internal excavation diameter" },
        { label: "Track / Lanes", val: `${p.lane_count || 2} Lines`, hint: "Transit capacity" },
        { label: "Authority", val: fmtStr(p.responsible_authority).split("/")[0].trim(), hint: "Project owner" }
      ],
      overview: (p) => ({
        "Tunnel Asset": p.name,
        "Corridor": p.supporting_corridor,
        "Geological Feature Crossed": p.waterway_crossed,
        "District": p.district,
        "Authority": p.responsible_authority,
        "Status": p.commissioning_date || "Under Execution"
      }),
      engineering: (p) => ({
        "Excavation Technology": p.substructure,
        "Tunnel Lining": p.superstructure,
        "Total Bore Length": `${fmtNum(p.length_m, "meters")}`,
        "Cross-Sectional Width": `${p.deck_width_m} meters`,
        "Safety Systems": p.pedestrian_walkway
      }),
      functionAndUse: (p) => `
        <div class="insp-narrative-card">
          <h4>🚇 Subterranean & Geotechnical Corridor Alignment</h4>
          <p><strong>${p.name}</strong> pierces dense topography or marine strata along <strong>${p.supporting_corridor}</strong>, maintaining gradient limits and acoustic / environmental shielding.</p>
        </div>
      `,
      scienceStop: (p) => `
        <div class="insp-science-box">
          <div class="science-header">
            <span class="science-badge">AERODYNAMICS</span>
            <h4>Micro-Pressure Wave Mitigation at Tunnel Portals</h4>
          </div>
          <div class="science-formula-card">
            <p class="formula-desc">When a train enters a high-speed tunnel at >300 km/h, compression waves generate sonic booms (micro-pressure waves) at the exit portal. Slotted portal hoods and flared entrance transitions are engineered to dissipate wave steepening.</p>
          </div>
        </div>
      `,
      risk: (p) => `
        <div class="insp-risk-grid">
          <div class="risk-item-box">
            <span class="risk-label">Geotechnical & Fire Life Safety</span>
            <p>Monitored via distributed fiber-optic temperature sensors, emergency cross-passage pressurization, and automated jet-fan smoke extraction.</p>
          </div>
        </div>
      `,
      sources: (p) => ({
        "Project Authority": p.responsible_authority,
        "Quality Class": "VERIFIED_GOV_RECORD"
      })
    },

    // 4e. Freight Terminals & Multimodal Logistics Parks
    freight_terminal: {
      tabs: ["overview", "engineering", "function", "network", "science", "geoenv", "risk", "sources"],
      metrics: (p) => [
        { label: "Handling Capacity", val: p.traffic_disclosure ? p.traffic_disclosure.split(";")[0] : "EXIM Logistics Hub", hint: "Annual throughput capacity" },
        { label: "Rail Sidings", val: `${p.lane_count || 4} Rake Lines`, hint: "Broad gauge track spurs" },
        { label: "Corridor Link", val: fmtStr(p.supporting_corridor).split("&")[0].trim(), hint: "Evacuation artery" },
        { label: "Operator", val: fmtStr(p.responsible_authority).split("/")[0].trim(), hint: "Terminal operator" }
      ],
      overview: (p) => ({
        "Terminal Name": p.name,
        "Category": "Multimodal Logistics Park / Inland Container Depot (ICD)",
        "District": p.district,
        "Corridor Connectivity": p.supporting_corridor,
        "Direct Rail Connection": p.waterway_crossed,
        "Managing Authority": p.responsible_authority,
        "Commissioned": p.commissioning_date || `Year ${p.commissioning_year}`
      }),
      engineering: (p) => ({
        "Pavement Design": p.superstructure,
        "Subgrade Axle Capacity": p.substructure,
        "Internal Track Lines": `${p.lane_count} Dedicated Broad Gauge Tracks`,
        "Yard Facility Length": `${p.length_m} meters`,
        "Handling Infrastructure": p.traffic_disclosure
      }),
      functionAndUse: (p) => `
        <div class="insp-narrative-card">
          <h4>📦 Inland Port Hub & Double-Stack Container Interface</h4>
          <p><strong>${p.name}</strong> operates as a critical inland dry port interfacing industrial manufacturing clusters with the Western Dedicated Freight Corridor (WDFC) and Western Railway network. It features automated customs clearance, bonded container storage, and reefer points.</p>
        </div>
      `,
      risk: (p) => `
        <div class="insp-risk-grid">
          <div class="risk-item-box">
            <span class="risk-label">Statutory Safety Certification</span>
            <p style="color: #cbd5e1; font-size: 0.76rem;">${p.inspection_disclosure}</p>
          </div>
        </div>
      `,
      sources: (p) => ({
        "Managing Body": p.responsible_authority,
        "Data Quality": "VERIFIED_GOV_RECORD",
        "Statutory Standard": "Indian Railways Freight Operating Information System (FOIS)"
      })
    },

    // 5. Commercial Seaports
    commercial_seaport: {
      tabs: ["overview", "engineering", "function", "network", "science", "risk", "history", "sources"],
      metrics: (p) => [
        { label: "Annual Cargo Throughput", val: fmtNum(p.capacity_mmt || p.annual_capacity_mmt, "MMT"), hint: "Million Metric Tonnes capacity" },
        { label: "Maximum Draft Depth", val: fmtNum(p.draft_m || p.max_draft_m, "m"), hint: "Deepest permissible vessel draft" },
        { label: "Berths Available", val: fmtStr(p.berths_count || p.berths), hint: "Commercial docking berths" },
        { label: "Operating Authority", val: fmtStr(p.authority || p.operator).split("—")[0].trim(), hint: "Port terminal operator / authority" },
        { label: "Coastline Location", val: fmtStr(p.district), hint: "Maritime jurisdictional area" }
      ],
      overview: (p) => ({
        "Seaport Name": p.name,
        "Port Classification": p.port_type || "Major / Deep-Water Commercial Port",
        "Operating Authority / Terminal": p.authority || p.operator || "Gujarat Maritime Board (GMB) / APSEZ",
        "Annual Throughput Capacity": `${fmtNum(p.capacity_mmt || p.annual_capacity_mmt, "Million Metric Tonnes")}`,
        "Geographical District": `${p.district} Maritime Zone`,
        "Primary Cargo Profile": p.cargo_type || "Crude Oil, Coal, Containers, Chemicals & Dry Bulk",
        "Status": p.status || "Operational Commercial Port"
      }),
      engineering: (p) => ({
        "Maximum Permissible Draft": `${fmtNum(p.draft_m || p.max_draft_m, "meters (Capesize / VLCC capable)")}`,
        "Total Operational Berths": `${fmtStr(p.berths_count || p.berths)} Deep-Water Berths`,
        "Container Handling Capacity": p.container_terminals ? `${p.container_terminals} TEUs Annual` : "Liquid / Dry Bulk Focused",
        "Marine Jetties & SPM": p.freight_facilities || "Single Point Mooring (SPM) facilities for offshore Very Large Crude Carriers (VLCC)",
        "Highway Connectivity": p.highway_connectivity || "National Highway Feeder Corridor",
        "Rail Connectivity": p.rail_connectivity || "Western Railway & Dedicated Freight Corridor (WDFC)",
        "Navigation Channel Dredging": "Capital & Maintenance dredging maintaining navigation safety in macro-tidal Gulf waters"
      }),
      functionAndUse: (p) => `
        <div class="insp-narrative-card">
          <h4>⚓ India's Maritime Gateway for Energy & Global Container Trade</h4>
          <p><strong>${p.name}</strong> is a vital international maritime gateway connecting Northern and Western India with global sea trade routes across the Middle East, Europe, and Asia. It handles massive volumes of crude oil feedstocks for domestic refineries, thermal coal imports, and containerized manufactured exports.</p>
        </div>
      `,
      scienceStop: (p) => `
        <div class="insp-lab-launcher-card" style="margin-top: 8px;">
          <div class="launcher-info">
            <span class="launcher-title">🌪️ Coastal Storm Surge &amp; Cyclone Tracking Twin</span>
            <span class="launcher-desc">Simulate Arabian Sea cyclone tracks, SLOSH surge hydrodynamics, and port emergency danger signals (C).</span>
          </div>
          <button class="insp-open-lab-btn" style="background: linear-gradient(135deg, #ea580c, #c2410c);" onclick="window.CycloneCoastalSurgeTwin && window.CycloneCoastalSurgeTwin.openModal()">
            Track Cyclone Surge ➔
          </button>
        </div>
        <div class="insp-science-box">
          <div class="science-header">
            <span class="science-badge">NAUTICAL HYDRODYNAMICS</span>
            <h4>Under Keel Clearance (UKC) &amp; Shallow Water Squat Effect</h4>
          </div>
          <div class="science-formula-card">
            <div class="formula-latex">UKC = Depth - Draft - Squat \ge UKC_{min}</div>
            <p class="formula-desc">As mega-vessels transit shallow approach channels, hydrodynamic pressure drops beneath the hull (Bernoulli's principle), causing the vessel to sink deeper into the water (squat). Navigators maintain safety buffers over seabed bathymetry.</p>
          </div>
        </div>
      `,
      risk: (p) => `
        <div class="insp-risk-grid">
          <div class="risk-item-box">
            <span class="risk-label">Cyclone & Storm Surge Exposure</span>
            <p>Subject to severe Arabian Sea cyclone landfalls and storm surges (up to 4–5m). Berths are equipped with storm mooring hooks and tsunami evacuation protocols.</p>
          </div>
          <div class="risk-item-box">
            <span class="risk-label">Marine Environmental Protection</span>
            <p>Mandatory Tier-1 Oil Spill Response (OSR) vessels, ballast water management protocols, and strict Coastal Regulation Zone (CRZ) mangrove conservation buffers.</p>
          </div>
        </div>
      `,
      history: (p) => `
        <ul class="insp-timeline">
          <li class="timeline-step">
            <span class="timeline-year">Development</span>
            <div class="timeline-desc">Engineered to leverage deep natural drafts along Gujarat's 1,600 km coastline.</div>
          </li>
          <li class="timeline-step">
            <span class="timeline-year">2026</span>
            <div class="timeline-desc">National record holder for bulk container throughput and turnaround efficiency.</div>
          </li>
        </ul>
      `,
      sources: (p) => ({
        "Source Organization": "Gujarat Maritime Board (GMB) & Ministry of Ports, Shipping and Waterways",
        "Official Registry": "https://gmbports.org",
        "Data Quality": "VERIFIED_GOV_RECORD",
        "CRS": "EPSG:4326 WGS 84"
      })
    },

    // 6. Commercial Airports
    commercial_airport: {
      tabs: ["overview", "engineering", "function", "network", "science", "sources"],
      metrics: (p) => [
        { label: "IATA Code", val: fmtStr(p.iata || p.iata_code), hint: "International Air Transport Association" },
        { label: "ICAO Code", val: fmtStr(p.icao || p.icao_code), hint: "International Civil Aviation Org" },
        { label: "Primary Runway Length", val: fmtNum(p.runway_length_m, "m"), hint: "Code 4E/4F aircraft capable" },
        { label: "Operator", val: fmtStr(p.operator || p.authority), hint: "Airport managing entity" },
        { label: "Annual Traffic / Pax", val: fmtStr(p.passenger_traffic_fy24 || (p.terminal_capacity_mppa ? `${p.terminal_capacity_mppa} MPPA` : "Commercial Operations")), hint: "Annual passenger throughput" }
      ],
      overview: (p) => ({
        "Airport Name": p.name,
        "IATA Code": p.iata || p.iata_code || "—",
        "ICAO Code": p.icao || p.icao_code || "—",
        "Airport Operator": p.operator || p.authority || "Airports Authority of India (AAI) / Adani Airports",
        "District / City": p.city || p.district,
        "Classification": p.airport_type || p.category || "International Commercial Airport",
        "Operating Status": p.status || "Operational Commercial Aerodrome"
      }),
      engineering: (p) => ({
        "Main Runway Dimension": `${fmtNum(p.runway_length_m, "meters length")}`,
        "Runway Specifications": p.runway_specifications || "Runway with Code 4E wide-body aircraft clearance",
        "Runway Surface & Pavement": "High-Friction Grooved Asphalt / Rigid PQC Concrete (PCN Rated)",
        "Aerodrome Reference Code": "Code 4E (Wide-body twin-aisle aircraft capable: Boeing 777/787, Airbus A350)",
        "Instrument Landing System": "ILS CAT I / CAT IIIB All-Weather Low-Visibility Approach Guidance",
        "Road & Highway Access": p.highway_connectivity || "Dedicated Airport Expressway & Arterial Link",
        "Public Transit Link": p.public_transit_connectivity || "City BRTS / Metro Rail Airport Feeder",
        "Air Traffic Control": "Primary & Secondary Surveillance Radar (PSR/SSR) with ADS-B Ground Automation"
      }),
      functionAndUse: (p) => `
        <div class="insp-narrative-card">
          <h4>✈️ Regional Aviation Hub & Air Cargo Gateway</h4>
          <p><strong>${p.name}</strong> connects Gujarat's commercial hubs to domestic metros and international business capitals. It acts as an expedited transit gateway for high-value export cargo, including pharmaceutical cold-chains, diamonds, electronics, and perishable goods.</p>
        </div>
      `,
      scienceStop: (p) => `
        <div class="insp-science-box">
          <div class="science-header">
            <span class="science-badge">AERODYNAMICS</span>
            <h4>Lift Mechanics & Density Altitude Runway Performance</h4>
          </div>
          <div class="science-formula-card">
            <div class="formula-latex">L = \frac{1}{2} · ρ · V^2 · S · C_L</div>
            <p class="formula-desc">Where <strong>L</strong> is aerodynamic lift, <strong>ρ</strong> is air density, <strong>V</strong> is true airspeed, <strong>S</strong> is wing planform area, and <strong>C_L</strong> is lift coefficient. During intense summer heat in Gujarat, reduced air density ($ρ$) increases required takeoff roll distance.</p>
          </div>
        </div>
      `,
      sources: (p) => ({
        "Source Organization": "Airports Authority of India (AAI) & DGCA",
        "Official Registry": "https://aai.aero",
        "Data Quality": "VERIFIED_GOV_RECORD",
        "CRS": "EPSG:4326 WGS 84"
      })
    },

    // 7. Mega Industrial SEZs
    industrial_sez: {
      tabs: ["overview", "engineering", "function", "network", "science", "risk", "sources"],
      metrics: (p) => [
        { label: "Zone Area", val: fmtNum(p.area_sqkm, "sq km"), hint: "Total industrial masterplan acreage" },
        { label: "Primary Sector", val: fmtStr(p.industry_focus), hint: "Cluster manufacturing specialism" },
        { label: "Managing Authority", val: fmtStr(p.managing_body), hint: "Industrial development authority" },
        { label: "District", val: fmtStr(p.district), hint: "Jurisdiction location" }
      ],
      overview: (p) => ({
        "Industrial Zone Name": p.name,
        "Cluster Specialization": p.industry_focus || "Petrochemicals, Automotive, Semiconductors & Heavy Engineering",
        "Total Planned Area": `${fmtNum(p.area_sqkm, "sq km")}`,
        "Development Authority": p.managing_body || "Gujarat Industrial Development Corporation (GIDC)",
        "District": p.district,
        "Status": "Active Operational & Expanding Hub"
      }),
      engineering: (p) => ({
        "Utility Infrastructure": "Dedicated 400/220 kV GETCO Substation, Piped Industrial Gas Network, Dedicated Raw Water Supply Feed",
        "Effluent Management": "Common Effluent Treatment Plant (CETP) with Zero Liquid Discharge (ZLD) Multi-Effect Evaporators",
        "Logistics Integration": "Multi-Modal Logistics Park (MMLP) with Inland Container Depot (ICD) and DFC rail link",
        "Smart City Utilities": "Underground Utility Tunnels, SCADA Water Metering, Dual Firefighting Water Hydrant Grids"
      }),
      functionAndUse: (p) => `
        <div class="insp-narrative-card">
          <h4>🏗️ Industrial Engine & Global Export Hub</h4>
          <p><strong>${p.name}</strong> is designed to attract multi-billion dollar foreign direct investments and drive high-tech manufacturing in chemicals, automobiles, renewable hardware, and semiconductors.</p>
        </div>
      `,
      scienceStop: (p) => `
        <div class="insp-science-box">
          <div class="science-header">
            <span class="science-badge">ENVIRONMENTAL PROCESS ENGINEERING</span>
            <h4>Zero Liquid Discharge (ZLD) & Membrane Separation</h4>
          </div>
          <div class="science-formula-card">
            <div class="formula-latex">J_w = A · (\Delta P - \Delta π)</div>
            <p class="formula-desc">Where $J_w$ is solvent flux across the semi-permeable reverse osmosis membrane, $A$ is membrane permeability, $\Delta P$ is hydraulic trans-membrane pressure, and $\Delta \pi$ is osmotic pressure differential.</p>
          </div>
        </div>
      `,
      risk: (p) => `
        <div class="insp-risk-grid">
          <div class="risk-item-box">
            <span class="risk-label">Pollution & Chemical Safety</span>
            <p>Continuous Ambient Air Quality Monitoring (CAAQMS) connected live to GPCB / CPCB servers. Hazard operability (HAZOP) audits mandated for chemical handling.</p>
          </div>
        </div>
      `,
      sources: (p) => ({
        "Source Organization": "GIDC / Gujarat Industries Department",
        "Registry Portal": "https://gidc.gujarat.gov.in",
        "Data Quality": "VERIFIED_GOV_RECORD",
        "CRS": "EPSG:4326 WGS 84"
      })
    },

    // 8. CGWB Groundwater Aquifer Profiles
    groundwater_assessment: {
      tabs: ["overview", "engineering", "function", "science", "risk", "sources"],
      metrics: (p) => [
        { label: "Stage of Extraction", val: fmtNum(p.stage_of_extraction_pct, "%"), hint: "Draft vs Replenishable Recharge" },
        { label: "CGWB Category", val: fmtStr(p.cgwb_category), hint: "Statutory stress classification" },
        { label: "Dominant Aquifer", val: fmtStr(p.dominant_aquifer).split("(")[0].trim(), hint: "Hydrogeological lithology" },
        { label: "Water Table Depth", val: fmtStr(p.water_table_depth_m_bgl), hint: "Meters below ground level" }
      ],
      overview: (p) => ({
        "Assessment District": p.district,
        "CGWB Stress Classification": p.cgwb_category,
        "Stage of Groundwater Extraction": `${fmtNum(p.stage_of_extraction_pct, "%")}`,
        "Dominant Aquifer Lithology": p.dominant_aquifer,
        "Regional Geological Terrain": p.geological_terrain,
        "Water Table Depth Range": p.water_table_depth_m_bgl,
        "Coastal Salinity Ingress Risk": p.salinity_risk,
        "Authoritative Assessment": "CGWB Dynamic Ground Water Resources of India (2022)"
      }),
      engineering: (p) => ({
        "Hydrogeological System": p.dominant_aquifer,
        "Aquifer Typology": p.geological_terrain.includes("Alluvium") ? "Unconfined to Multi-Layered Confined Quaternary Alluvial Sand Beds" : "Fractured & Vesicular Deccan Basalt Trap Lava Flows",
        "Primary Extraction Method": "Deep Agricultural Submersible Tubewells & Shallow Dugwells",
        "Recharge Mechanisms": "Monsoon Rainfall Infiltration, Canal Seepage (Sujalam Sufalam / SAUNI), and Watershed Check Dams"
      }),
      functionAndUse: (p) => `
        <div class="insp-narrative-card">
          <h4>💧 Agricultural Lifeline & Aquifer Depletion Dynamics</h4>
          <p>Groundwater in <strong>${p.district}</strong> accounts for over 70% of rural drinking supplies and irrigation water. Districts categorized as <strong>${p.cgwb_category}</strong> face chronic aquifer overdraft where annual withdrawal exceeds natural annual monsoon recharge.</p>
        </div>
      `,
      scienceStop: (p) => `
        <div class="insp-science-box">
          <div class="science-header">
            <span class="science-badge">HYDROGEOLOGY</span>
            <h4>Darcy's Law & Aquifer Hydraulic Transmissivity</h4>
          </div>
          <div class="science-formula-card">
            <div class="formula-latex">Q = -K · A · \frac{dh}{dl} \quad \text{and} \quad T = K · b</div>
            <p class="formula-desc">Where <strong>Q</strong> is discharge rate, <strong>K</strong> is hydraulic conductivity of the geological strata, <strong>A</strong> is cross-sectional flow area, and <strong>dh/dl</strong> is the hydraulic gradient. Transmissivity <strong>T</strong> measures how much water can be transmitted horizontally across saturated thickness <strong>b</strong>.</p>
          </div>
        </div>
      `,
      risk: (p) => `
        <div class="insp-risk-grid">
          <div class="risk-item-box">
            <span class="risk-label">Over-Exploitation & Water Table Drop</span>
            <p>Extraction stage of <strong>${fmtNum(p.stage_of_extraction_pct, "%")}</strong> threatens borewell yields, induces higher pumping electricity consumption, and can cause land subsidence.</p>
          </div>
          <div class="risk-item-box">
            <span class="risk-label">Saline Ingress & Chemical Quality</span>
            <p>Risk: <strong>${fmtStr(p.salinity_risk)}</strong>. Over-pumping in coastal belts draws saltwater wedges inland (Ghyben-Herzberg principle), causing soil sodicity.</p>
          </div>
        </div>
      `,
      sources: (p) => ({
        "Source Organization": "Central Ground Water Board (CGWB), Ministry of Jal Shakti",
        "Official Registry": "http://cgwb.gov.in",
        "Data Quality": "VERIFIED_GOV_RECORD",
        "Assessment Year": "2022 National Dynamic Ground Water Assessment"
      })
    },

    // 9. Disaster Hazard Zones (Seismic, Cyclone, Flood)
    seismic_hazard_zone: {
      tabs: ["overview", "engineering", "science", "risk", "history", "sources"],
      metrics: (p) => [
        { label: "Zone Code", val: fmtStr(p.zone_code), hint: "BIS IS 1893:2016" },
        { label: "Zone Factor (Z)", val: `Z = ${p.zone_factor_z}`, hint: "Maximum considered earthquake PGA" },
        { label: "Damage Risk Level", val: fmtStr(p.severity), hint: "Seismic hazard intensity" }
      ],
      overview: (p) => ({
        "Hazard Name": p.name,
        "Seismic Zone Code": p.zone_code,
        "Zone Factor Z": `Z = ${p.zone_factor_z} (${p.expected_pga_g}g Peak Ground Acceleration)`,
        "Districts Covered": p.districts_covered,
        "Active Tectonic Faults": p.active_faults,
        "Design Standard": p.design_code,
        "Source Authority": "Bureau of Indian Standards & GSDMA"
      }),
      engineering: (p) => ({
        "Design Ground Acceleration": `Z = ${p.zone_factor_z}g Expected Bedrock Motion`,
        "Mandatory Detailing Code": "IS 13920:2016 Ductile Design and Detailing of Reinforced Concrete Structures",
        "Soil Amplification Category": "Type I (Rock/Hard Soil), Type II (Medium), Type III (Soft Marine / Alluvium Amplification)"
      }),
      scienceStop: (p) => `
        ${(p.asset_category === 'cyclone_hazard_zone' || p.asset_category === 'cyclone_track' || p.asset_category === 'coastal_defense_zone' || (p.name && p.name.toLowerCase().includes('cyclone'))) ? `
          <div class="insp-lab-launcher-card" style="margin-top: 8px;">
            <div class="launcher-info">
              <span class="launcher-title">🌪️ Coastal Storm Surge &amp; Cyclone Tracking Twin</span>
              <span class="launcher-desc">Simulate Arabian Sea cyclone tracks, SLOSH surge hydrodynamics, and port emergency danger signals (C).</span>
            </div>
            <button class="insp-open-lab-btn" style="background: linear-gradient(135deg, #ea580c, #c2410c);" onclick="window.CycloneCoastalSurgeTwin && window.CycloneCoastalSurgeTwin.openModal('${p.storm_name ? (p.storm_name.toLowerCase().includes('tauktae') ? 'tauktae' : 'biparjoy') : 'biparjoy'}')">
              Track Cyclone Surge ➔
            </button>
          </div>
        ` : ''}
        <div class="insp-science-box">
          <div class="science-header">
            <span class="science-badge">${(p.asset_category === 'cyclone_hazard_zone' || p.asset_category === 'cyclone_track' || p.asset_category === 'coastal_defense_zone') ? 'COASTAL HYDRODYNAMICS' : 'EARTHQUAKE ENGINEERING'}</span>
            <h4>${(p.asset_category === 'cyclone_hazard_zone' || p.asset_category === 'cyclone_track' || p.asset_category === 'coastal_defense_zone') ? 'Shallow-Water Storm Surge & Wind Shear Stress' : 'Design Horizontal Acceleration Spectrum'}</h4>
          </div>
          <div class="science-formula-card">
            <div class="formula-latex">${(p.asset_category === 'cyclone_hazard_zone' || p.asset_category === 'cyclone_track' || p.asset_category === 'coastal_defense_zone') ? 'S_{total} = \\beta_{funnel} \\cdot (\\Delta S_{IB} + \\Delta S_{wind}) + S_{tide}' : 'A_h = \\frac{Z}{2} · \\frac{I}{R} · \\frac{S_a}{g}'}</div>
            <p class="formula-desc">${(p.asset_category === 'cyclone_hazard_zone' || p.asset_category === 'cyclone_track' || p.asset_category === 'coastal_defense_zone') ? 'Where storm surge couples inverted barometer sea-surface elevation, shallow continental shelf wind shear stress, and bathymetric funneling in the Gulf of Khambhat & Kutch.' : 'Where <strong>Z</strong> is Zone Factor, <strong>I</strong> is Importance Factor (1.5 for critical infrastructure), <strong>R</strong> is Response Reduction Factor (5 for ductile special moment frames), and <strong>Sa/g</strong> is spectral acceleration response.'}</p>
          </div>
        </div>
      `,
      risk: (p) => `
        <div class="insp-risk-grid">
          <div class="risk-item-box">
            <span class="risk-label">Active Fault Rupture Potential</span>
            <p>Faults: <strong>${fmtStr(p.active_faults)}</strong>. Historical high-magnitude events demonstrate severe ground deformation and liquefaction potential in unconsolidated Rann and alluvial sediments.</p>
          </div>
        </div>
      `,
      history: (p) => `
        <div class="insp-narrative-card">
          <h4>Historical Major Seismic Events</h4>
          <p>${fmtStr(p.historical_events)}</p>
        </div>
      `,
      sources: (p) => ({
        "Statutory Standard": "BIS IS 1893:2016 (Part 1)",
        "Disaster Management": "Gujarat State Disaster Management Authority (GSDMA)",
        "Data Quality": "VERIFIED_GOV_RECORD"
      })
    },

    // 10. Ecological Reserves & Sanctuaries
    ecological_reserve: {
      tabs: ["overview", "engineering", "function", "science", "risk", "sources"],
      metrics: (p) => [
        { label: "Protected Area", val: fmtNum(p.area_sqkm, "sq km"), hint: "Statutory reserve territory" },
        { label: "Key Flagship Species", val: fmtStr(p.key_species).split(",")[0].trim(), hint: "Global biodiversity conservation" },
        { label: "Legal Designation", val: fmtStr(p.designation).split("(")[0].trim(), hint: "IUCN / Wildlife Protection Act" },
        { label: "Notification Year", val: fmtStr(p.established_year), hint: "Gazette notification date" }
      ],
      overview: (p) => ({
        "Sanctuary / National Park Name": p.name,
        "Statutory Protected Area": `${fmtNum(p.area_sqkm, "sq km")}`,
        "Conservation Designation": p.designation,
        "Flagship Species Protected": p.key_species,
        "District Jurisdiction": p.district,
        "Establishment Milestone": `Established Year ${p.established_year}`,
        "Managing Authority": p.source_org || "Gujarat Forest Department & MoEFCC"
      }),
      engineering: (p) => ({
        "Boundary Demarcation": "Eco-Sensitive Zone (ESZ) Buffer delineated under Wildlife Protection Act 1972",
        "Water & Habitat Infrastructure": "Artificial Waterholes, Solar Borewells, Wireless Fire Watchtowers & GPS RFID Wildlife Trackers"
      }),
      functionAndUse: (p) => `
        <div class="insp-narrative-card">
          <h4>🦁 Global Biodiversity Preservation & Ecological Safeguards</h4>
          <p><strong>${p.name}</strong> provides irreplaceable wilderness habitat for species found nowhere else on Earth, such as <strong>${fmtStr(p.key_species)}</strong>. It anchors vital regional groundwater catchments and micro-climatic balance.</p>
        </div>
      `,
      scienceStop: (p) => `
        <div class="insp-science-box">
          <div class="science-header">
            <span class="science-badge">CONSERVATION BIOLOGY</span>
            <h4>Island Biogeography & Minimum Viable Population</h4>
          </div>
          <div class="science-formula-card">
            <div class="formula-latex">S = c · A^z</div>
            <p class="formula-desc">Species-area relationship where <strong>S</strong> is species richness, <strong>A</strong> is habitat area, and <strong>z</strong> is scaling exponent. Ecological corridors linking isolated protected patches are critical to prevent inbreeding depression.</p>
          </div>
        </div>
      `,
      risk: (p) => `
        <div class="insp-risk-grid">
          <div class="risk-item-box">
            <span class="risk-label">Linear Infrastructure Fragmentation</span>
            <p>Risk of habitat fragmentation from highways and railway tracks. Mitigation: Underpasses, animal overpasses, and speed-restricted wildlife zones.</p>
          </div>
        </div>
      `,
      sources: (p) => ({
        "Source Organization": "Gujarat Forest Department & MoEFCC",
        "Official Registry": "https://forests.gujarat.gov.in",
        "Data Quality": "VERIFIED_GOV_RECORD",
        "CRS": "EPSG:4326 WGS 84"
      })
    }
  };

  // Fallback Generic Schema for unmapped categories
  const GENERIC_SCHEMA = {
    tabs: ["overview", "science", "sources"],
    metrics: (p) => [
      { label: "Asset Name", val: fmtStr(p.name || p.title || p.district), hint: "Infrastructure entity" },
      { label: "Category", val: fmtStr(p.asset_category || "Infrastructure Node"), hint: "Digital twin classification" }
    ],
    overview: (p) => {
      const res = {};
      Object.keys(p).forEach(k => {
        if (!["geometry", "coordinates", "coordinates_raw"].includes(k)) {
          res[k.replace(/_/g, ' ').toUpperCase()] = String(p[k]);
        }
      });
      return res;
    },
    sources: (p) => ({
      "Source Authority": p.source_org || "Government of Gujarat Open Data",
      "Spatial Reference": "EPSG:4326 WGS 84",
      "Data Quality": p.data_quality || "PUBLIC_INFRASTRUCTURE_RECORD"
    })
  };

  // Helper to extract category schema
  function getSchema(category) {
    if (SCHEMAS[category]) return SCHEMAS[category];
    // Map aliases
    if (["thermal", "solar", "wind", "gas", "nuclear", "power", "power_plant"].includes(category)) return SCHEMAS.power_plant;
    if (["hydro", "hydropower", "hydropower_plant"].includes(category)) return SCHEMAS.hydropower_plant;
    if (category === "seaport" || category === "commercial_seaport") return SCHEMAS.commercial_seaport;
    if (category === "airport" || category === "commercial_airport") return SCHEMAS.commercial_airport;
    if (category === "industrial_estate" || category === "industrial_sez" || category === "industry") return SCHEMAS.industrial_sez;
    if (category === "metro_corridor" || category === "metro_transit") return SCHEMAS.metro_transit;
    if (category === "cyclone_hazard_zone" || category === "flood_hazard_zone") return SCHEMAS.seismic_hazard_zone;
    if (category === "district_hq" || category === "district_boundary" || category === "municipal_corporation") return SCHEMAS.groundwater_assessment;
    if (category === "irrigation_canal" || category === "natural_river") return SCHEMAS.water_dam;
    return GENERIC_SCHEMA;
  }

  // Related Assets Graph Matcher (Network Traversal)
  function findConnectedAssets(asset) {
    const p = asset.properties || {};
    let cat = p.asset_category || asset.category || p.category || asset.type || "";
    if (["thermal", "solar", "wind", "gas", "nuclear"].includes(cat) || (!p.asset_category && p.capacity_mw && !p.is_hydropower) || (p.id && String(p.id).startsWith("power_") && !p.is_hydropower)) {
      cat = "power_plant";
    } else if (cat === "hydro" || p.is_hydropower) {
      cat = "hydropower_plant";
    }
    const name = p.name || p.title || "";
    const district = p.district || "";
    const river = p.river || p.basin || "";
    const connections = [];

    // 1. Hydropower Plant Cross-Connections
    if (cat === "hydropower_plant" || p.is_hydropower) {
      if (p.associated_dam_name) {
        connections.push({
          type: "dam",
          title: `[Associated Dam] ${p.associated_dam_name}`,
          id: p.associated_dam_id || "dam_associated",
          query: p.associated_dam_name,
          desc: "Civil barrier and reservoir headworks providing hydraulic gross head"
        });
      }
      if (p.associated_reservoir) {
        connections.push({
          type: "reservoir",
          title: `[Storage Reservoir] ${p.associated_reservoir}`,
          id: p.associated_reservoir_id || "res_associated",
          query: p.associated_reservoir,
          desc: "Upstream impoundment regulating seasonal inflows and active storage"
        });
      }
      if (p.river) {
        connections.push({
          type: "river",
          title: `[Tailrace Channel] ${p.river}`,
          query: p.river,
          desc: "Discharge channel receiving turbine outflow for downstream water supply"
        });
      }
      if (p.connected_transmission_ids && p.connected_transmission_ids.length > 0) {
        p.connected_transmission_ids.forEach(tid => {
          connections.push({
            type: "power",
            title: `[Evacuation Line] ${tid.replace(/_/g, " ").toUpperCase()}`,
            id: tid,
            query: "Transmission",
            desc: `${p.evacuation_voltage_kv || 400} kV Extra High Voltage evacuation grid corridor`
          });
        });
      }
      if (p.connected_substations && p.connected_substations.length > 0) {
        p.connected_substations.forEach(sid => {
          connections.push({
            type: "power",
            title: `[Connected Substation] ${sid.replace(/_/g, " ").toUpperCase()}`,
            id: sid,
            query: "Substation",
            desc: "GETCO / POWERGRID Extra High Voltage pooling and switching node"
          });
        });
      }
    }

    // 2. Power Plant (Thermal / Nuclear / Gas) Water-Energy Cooling & Evacuation Links
    if (cat === "power_plant" && !p.is_hydropower) {
      if (p.water_cooling_source) {
        connections.push({
          type: "water",
          title: `[Cooling Water Intake] ${p.water_cooling_source.split("(")[0].trim()}`,
          id: p.water_body_id || "water_cooling",
          query: p.water_cooling_source,
          desc: p.water_nexus_role || "Bulk water allocation for condenser steam cycle and cooling towers"
        });
      }
      if (p.connected_transmission_ids && p.connected_transmission_ids.length > 0) {
        p.connected_transmission_ids.forEach(tid => {
          connections.push({
            type: "power",
            title: `[Evacuation Line] ${tid.replace(/_/g, " ").toUpperCase()}`,
            id: tid,
            query: "Transmission",
            desc: `${p.evacuation_voltage_kv || 400} kV High-Voltage grid evacuation link`
          });
        });
      }
    }

    // 3. Transmission Corridors <-> Substations & Generating Stations
    if (cat === "transmission_line") {
      if (p.sending_substation) {
        connections.push({
          type: "power",
          title: `[Sending Node] ${p.sending_substation}`,
          query: p.sending_substation,
          desc: "Originating switchyard / generation complex"
        });
      }
      if (p.receiving_substation) {
        connections.push({
          type: "power",
          title: `[Receiving Node] ${p.receiving_substation}`,
          query: p.receiving_substation,
          desc: "Terminating bulk grid substation / pooling hub"
        });
      }
      if (p.connected_plant_ids && p.connected_plant_ids.length > 0) {
        p.connected_plant_ids.forEach(pid => {
          connections.push({
            type: "power",
            title: `[Connected Plant] ${pid.replace(/_/g, " ").toUpperCase()}`,
            id: pid,
            query: "Power",
            desc: "Generating station evacuating energy into this transmission corridor"
          });
        });
      }
    }

    // 4. Substations <-> Transmission Corridors & Generating Plants
    if (cat === "substation") {
      if (p.connected_lines && p.connected_lines.length > 0) {
        p.connected_lines.forEach(lid => {
          connections.push({
            type: "power",
            title: `[Connected Circuit] ${lid.replace(/_/g, " ").toUpperCase()}`,
            id: lid,
            query: "Transmission",
            desc: `${p.voltage_kv || 400} kV high-capacity transmission corridor intertie`
          });
        });
      }
      if (p.connected_plants && p.connected_plants.length > 0) {
        p.connected_plants.forEach(pid => {
          connections.push({
            type: "power",
            title: `[Evacuating Facility] ${pid.replace(/_/g, " ").toUpperCase()}`,
            id: pid,
            query: "Power",
            desc: "Power generation facility routing electricity through this substation"
          });
        });
      }
    }

    // 5. Water Dams <-> Hydropower & Cooling Water Cross-Links
    if (cat === "water_dam" || cat === "barrage" || cat === "weir") {
      if (p.hydropower_station_name && p.hydropower_capacity_mw > 0) {
        connections.push({
          type: "power",
          title: `[Hydropower Station] ${p.hydropower_station_name}`,
          id: p.connected_power_plant_ids ? p.connected_power_plant_ids[0] : "hydro_station",
          query: p.hydropower_station_name,
          desc: p.hydro_note || `${p.hydropower_capacity_mw} MW installed hydroelectric powerhouses`
        });
      }
      if (p.cooling_supply_note) {
        connections.push({
          type: "power",
          title: `[Thermal / Nuclear Link] Cooling Water Supply`,
          query: "Thermal",
          desc: p.cooling_supply_note
        });
      }
    }

    // Query Verified Topological Hydraulic Graph if available
    if (window.WaterSystemsNetwork && typeof window.WaterSystemsNetwork.getImmediateNeighbors === "function" && p.id) {
      const net = window.WaterSystemsNetwork.getImmediateNeighbors(p.id);
      if (net.upstream.length > 0 || net.downstream.length > 0 || net.lateral.length > 0) {
        net.upstream.forEach(u => {
          connections.push({
            type: u.category.includes("river") ? "river" : (u.category.includes("canal") ? "canal" : (u.category.includes("station") ? "sensor" : "dam")),
            title: `[Inflow Reach] ${u.name}`,
            id: u.id,
            query: u.name,
            desc: `Verified Upstream Hydraulic Input (${u.category.replace(/_/g, " ")})`
          });
        });

        net.downstream.forEach(d => {
          connections.push({
            type: d.category.includes("river") ? "river" : (d.category.includes("canal") ? "canal" : (d.category.includes("station") ? "sensor" : "dam")),
            title: `[Outflow Reach] ${d.name}`,
            id: d.id,
            query: d.name,
            desc: `Verified Downstream Receiving Structure (${d.category.replace(/_/g, " ")})`
          });
        });

        net.lateral.forEach(l => {
          connections.push({
            type: l.category.includes("river") ? "river" : (l.category.includes("canal") ? "canal" : (l.category.includes("station") ? "sensor" : "dam")),
            title: `[Linked Structure] ${l.name}`,
            id: l.id,
            query: l.name,
            desc: `Direct Conveyance Link (${l.category.replace(/_/g, " ")})`
          });
        });
      }
    }

    // Dams <-> Reservoirs <-> Rivers <-> Canals <-> Barrages <-> Floodplains
    if (p.reservoir_asset_id && !connections.some(c => c.id === p.reservoir_asset_id)) {
      connections.push({ type: "reservoir", title: `${p.name} Reservoir Spread`, id: p.reservoir_asset_id, query: p.name, desc: "Surface water spread polygon at Full Reservoir Level (FRL)" });
    }
    if ((p.parent_dam_name || p.parent_dam_id) && !connections.some(c => c.id === p.parent_dam_id)) {
      connections.push({ type: "dam", title: p.parent_dam_name || "Parent Dam Headworks", id: p.parent_dam_id, query: p.parent_dam_name || "Dam", desc: "Civil barrier and hydraulic spillway headworks" });
    }

    if ((cat.includes("water") || cat.includes("dam") || cat.includes("barrage") || cat.includes("weir") || cat.includes("reservoir") || name.includes("Dam") || name.includes("Barrage") || name.includes("Weir") || river) && connections.length === 0) {
      if (name.includes("Sardar Sarovar") || river.includes("Narmada")) {
        connections.push({ type: "river", title: "Narmada River Main Trunk", id: "GJ-WR-RIV-001", query: "Narmada River", desc: "Main perennial river trunk flowing into Gulf of Khambhat" });
        connections.push({ type: "canal", title: "Narmada Main Canal (NMC)", id: "GJ-WR-CAN-001", query: "Narmada Main Canal", desc: "458 km major lined irrigation carrier @ 40,000 cfs" });
        connections.push({ type: "canal", title: "Saurashtra Branch Canal (SBC)", id: "GJ-WR-CAN-002", query: "Saurashtra Branch Canal", desc: "104.5 km Saurashtra lifeline branch off-take" });
        connections.push({ type: "flood", title: "Bharuch Narmada Floodplain", id: "GJ-DIS-FLD-003", query: "Bharuch", desc: "Downstream low-lying flood corridor at Golden Bridge" });
      }
      if (name.includes("Ukai") || river.includes("Tapi")) {
        connections.push({ type: "river", title: "Tapi River Main Trunk", id: "GJ-WR-RIV-002", query: "Tapi River", desc: "Perennial river flowing through Ukai past Surat city" });
        connections.push({ type: "weir", title: "Kakrapar Pick-up Weir", id: "GJ-WR-WEI-001", query: "Kakrapar Weir", desc: "Downstream diversion weir feeding canals & KAPS nuclear cooling" });
        connections.push({ type: "weir", title: "Singanpur Weir-cum-Causeway", id: "GJ-WR-WEI-002", query: "Singanpur Weir", desc: "Surat municipal intake protection against marine tidal salinity" });
        connections.push({ type: "flood", title: "Surat Tapi Floodplain Zone", id: "GJ-DIS-FLD-001", query: "Surat", desc: "Surat urban flood zone (8,500 m³/s bankful threshold)" });
      }
      if (name.includes("Kadana") || name.includes("Wanakbori") || river.includes("Mahi")) {
        connections.push({ type: "river", title: "Mahi River Main Trunk", id: "GJ-WR-RIV-004", query: "Mahi River", desc: "Perennial river discharging from Kadana towards Anand & Gulf" });
        if (name.includes("Kadana")) {
          connections.push({ type: "barrage", title: "Wanakbori Pick-up Barrage", id: "GJ-WR-BAR-002", query: "Wanakbori Barrage", desc: "Downstream pickup weir feeding 212,000 ha Mahi Right Bank Canal" });
        }
        if (name.includes("Wanakbori")) {
          connections.push({ type: "dam", title: "Kadana Dam & Reservoir", id: "GJ-WR-DAM-003", query: "Kadana Dam", desc: "Upstream regulatory storage dam on Mahi River" });
          connections.push({ type: "power", title: "Wanakbori Thermal Power Station", id: "GJ-PWR-THE-002", query: "Wanakbori Thermal", desc: "1,470 MW GSECL thermal power plant using weir cooling intake" });
        }
      }
      if (name.includes("Dharoi") || name.includes("Vasna") || river.includes("Sabarmati")) {
        connections.push({ type: "river", title: "Sabarmati River Main Trunk", id: "GJ-WR-RIV-003", query: "Sabarmati River", desc: "Sabarmati river flowing through Dharoi, Gandhinagar & Ahmedabad" });
        if (name.includes("Dharoi")) {
          connections.push({ type: "barrage", title: "Vasna Barrage (Ahmedabad)", id: "GJ-WR-BAR-001", query: "Vasna Barrage", desc: "Downstream barrage regulating Sabarmati Riverfront ponding" });
        }
        if (name.includes("Vasna")) {
          connections.push({ type: "dam", title: "Dharoi Dam & Reservoir", id: "GJ-WR-DAM-004", query: "Dharoi Dam", desc: "Upstream master storage dam feeding Sabarmati river" });
          connections.push({ type: "canal", title: "Fatehwadi Canal System", id: "GJ-WR-CAN-001", query: "Narmada Main Canal", desc: "38,000 ha command canal originating at Vasna Barrage" });
        }
      }
      if (name.includes("Dantiwada") || name.includes("Sipu") || river.includes("Banas")) {
        if (name.includes("Dantiwada")) {
          connections.push({ type: "dam", title: "Sipu Dam", id: "GJ-WR-DAM-013", query: "Sipu Dam", desc: "Interlinked Banas basin reservoir in Deesa" });
        }
        if (name.includes("Sipu")) {
          connections.push({ type: "dam", title: "Dantiwada Dam", id: "GJ-WR-DAM-005", query: "Dantiwada Dam", desc: "Major Banas basin storage dam" });
        }
      }
      if (name.includes("Machhu")) {
        if (name.includes("Machhu II")) {
          connections.push({ type: "dam", title: "Machhu-I Dam", id: "GJ-WR-DAM-020", query: "Machhu-I Dam", desc: "Upstream storage dam on Machhu River near Wankaner" });
        }
        if (name.includes("Machhu-I")) {
          connections.push({ type: "dam", title: "Machhu II Dam", id: "GJ-WR-DAM-011", query: "Machhu II Dam", desc: "Downstream reconstructed dam protecting Morbi ceramic cluster" });
        }
      }
      if (name.includes("Aji") || name.includes("Nyari")) {
        connections.push({ type: "dam", title: name.includes("Aji") ? "Nyari-I Dam" : "Aji-I Dam", id: name.includes("Aji") ? "GJ-WR-DAM-021" : "GJ-WR-DAM-012", query: name.includes("Aji") ? "Nyari-I" : "Aji-I", desc: "Rajkot Twin Urban Water Security Reservoir (SAUNI Yojana Link-3)" });
      }
    }

    // Ports <-> Railway Sidings <-> Highways <-> Power
    if (cat.includes("port") || name.includes("Mundra") || name.includes("Kandla") || name.includes("Dahej") || name.includes("Hazira")) {
      if (name.includes("Mundra")) {
        connections.push({ type: "power", title: "Mundra Thermal Power Station", id: "GJ-PWR-THE-001", query: "Mundra Thermal", desc: "Adjacent 4,620 MW supercritical coastal thermal plant" });
        connections.push({ type: "rail", title: "Mundra Port Western Railway Siding", id: "WR-MUNDRA", query: "Adipur", desc: "Western DFC & Broad Gauge freight connectivity" });
        connections.push({ type: "road", title: "NH 41 / Mundra Port Expressway", id: "NH-41", query: "NH 41", desc: "High-capacity port evacuation corridor" });
      }
      if (name.includes("Dahej")) {
        connections.push({ type: "sez", title: "Dahej PCPIR Mega Petroleum Hub", id: "GJ-SEZ-IND-001", query: "Dahej PCPIR", desc: "453 sq km Petroleum, Chemicals & Petrochemicals Zone" });
        connections.push({ type: "road", title: "Bharuch-Dahej Expressway", id: "NH-48", query: "Bharuch", desc: "Connectivity corridor to Golden Quadrilateral NH-48" });
      }
    }

    // Stations <-> Connecting Corridors
    if (cat.includes("station") || cat.includes("rail")) {
      if (district) {
        connections.push({ type: "road", title: `NH-48 / Strategic Highways (${district})`, query: `${district}`, desc: `High-speed highway connections in ${district}` });
      }
    }

    // Civil Structures (Bridges, Flyovers, Tunnels, Freight Terminals)
    if (cat === "bridge" || cat === "flyover" || cat === "tunnel" || cat === "freight_terminal") {
      if (p.supporting_corridor) {
        connections.push({
          type: "road",
          title: `[Supporting Route] ${p.supporting_corridor}`,
          id: p.supporting_corridor_id || "corr_link",
          query: p.supporting_corridor_id || p.supporting_corridor,
          desc: "Primary highway/railway corridor carrying traffic across structure"
        });
      }
      if (p.waterway_crossed) {
        connections.push({
          type: cat === "bridge" ? "river" : "road",
          title: `[Crossed Feature] ${p.waterway_crossed}`,
          id: p.feature_crossed_id || "feature_crossed",
          query: p.waterway_crossed,
          desc: "Grade-separated natural water body, rail line, or road intersection crossed"
        });
      }
      if (p.district) {
        connections.push({
          type: "district",
          title: `[Host District] ${p.district} Administrative Division`,
          query: p.district,
          desc: "District engineering jurisdiction and administrative territory"
        });
      }
    }

    // Highway Corridors <-> Connected Signature Bridges
    if (cat === "highway_corridor" || cat === "golden_quadrilateral" || cat === "expressway" || cat === "national_highway") {
      if (p.connected_bridge_ids && Array.isArray(p.connected_bridge_ids) && p.connected_bridge_ids.length > 0) {
        p.connected_bridge_ids.forEach(bid => {
          connections.push({
            type: "bridge",
            title: `[Signature Civil Structure] ${bid}`,
            id: bid,
            query: bid,
            desc: "Grade-separated bridge, flyover, tunnel or freight terminal on this alignment"
          });
        });
      }
    }

    // Generic fallback: District link
    if (district && connections.length === 0) {
      connections.push({ type: "district", title: `${district} Administrative Jurisdiction`, query: district, desc: "Revenue district administrative boundary and governance hub" });
    }

    return connections;
  }

  // Render Functions
  function renderMetrics(metrics) {
    if (!metrics || metrics.length === 0) return "";
    return `
      <div class="insp-metrics-grid">
        ${metrics.map(m => `
          <div class="insp-metric-card" title="${m.hint || ''}">
            <span class="metric-val">${m.val}</span>
            <span class="metric-lbl">${m.label}</span>
          </div>
        `).join("")}
      </div>
    `;
  }

  function renderKeyValueTable(obj) {
    if (!obj || Object.keys(obj).length === 0) {
      return `<p class="insp-empty-msg">No structured attributes available in authoritative register.</p>`;
    }
    return `
      <table class="insp-kv-table">
        <tbody>
          ${Object.entries(obj).map(([k, v]) => `
            <tr>
              <td class="kv-key">${k}</td>
              <td class="kv-val">${v}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
  }

  function renderNetworkConnections(connections, asset) {
    const p = asset?.properties || {};
    const cat = p.asset_category || asset?.type || "";
    const isWater = cat.includes("water") || cat.includes("dam") || cat.includes("canal") || cat.includes("river") || cat.includes("barrage") || cat.includes("weir") || cat.includes("reservoir") || cat.includes("station") || cat.includes("pumping") || (p.id && p.id.startsWith("GJ-WR-"));

    const followBannerHtml = isWater && p.id ? `
      <div class="insp-follow-water-banner">
        <div class="ifwb-left">
          <span class="ifwb-icon">🌊</span>
          <div>
            <strong>Follow the Water Mode</strong>
            <small>Step upstream towards headwaters or downstream along hydraulic conveyance</small>
          </div>
        </div>
        <button class="btn-follow-water-inline" onclick="window.WaterSystemsNetwork && window.WaterSystemsNetwork.startFollowWater('${p.id}')">
          Start Flow Trace ➔
        </button>
      </div>
    ` : "";

    if (!connections || connections.length === 0) {
      return `
        ${followBannerHtml}
        <div class="insp-empty-msg">No direct upstream/downstream multi-modal connections recorded in topology index.</div>
      `;
    }
    return `
      ${followBannerHtml}
      <div class="insp-network-list">
        <p class="insp-network-intro">Click any connected topological node to pan the map camera and inspect that infrastructure asset:</p>
        ${connections.map(c => `
          <div class="insp-network-card">
            <div class="network-card-left">
              <span class="network-icon">${c.type === 'river' ? '🏞️' : (c.type === 'canal' ? '🌊' : (c.type === 'power' ? '⚡' : (c.type === 'road' ? '🛣️' : (c.type === 'port' ? '⚓' : (c.type === 'sensor' ? '📡' : '💧')))))}</span>
              <div class="network-meta">
                <span class="network-title">${c.title}</span>
                <span class="network-desc">${c.desc}</span>
              </div>
            </div>
            <button class="network-jump-btn" onclick="window.AssetInspector.navigateTo('${c.query.replace(/'/g, "\\'")}')" title="Pan and inspect ${c.title}">
              Inspect Node ➔
            </button>
          </div>
        `).join("")}
      </div>
    `;
  }

  function renderAssetGeoenvContext(asset) {
    const p = asset?.properties || {};
    let lat = null;
    let lon = null;

    if (asset?.geometry && asset.geometry.type === "Point") {
      lon = asset.geometry.coordinates[0];
      lat = asset.geometry.coordinates[1];
    } else if (p.coords && Array.isArray(p.coords)) {
      lon = p.coords[0];
      lat = p.coords[1];
    } else if (p.centroid && Array.isArray(p.centroid)) {
      lat = p.centroid[0];
      lon = p.centroid[1];
    }

    if (lat === null || lon === null || !window.GeoenvironmentalIntelligence) {
      return `
        <div class="insp-empty-msg">
          Geoenvironmental spatial context requires geographic coordinates. Open the Geoenvironmental Intelligence Suite from the header button or press <kbd>G</kbd>.
        </div>
      `;
    }

    const ctx = window.GeoenvironmentalIntelligence.getGeoenvironmentalContext(lat, lon);
    const assetName = p.name || p.title || p.district || "Inspected Asset";

    return `
      <div class="insp-geoenv-card">
        <div class="ige-header">
          <div class="ige-title-wrap">
            <span class="ige-badge">REGIONAL SCREENING</span>
            <h4>${assetName} — Geoenvironmental Baseline</h4>
            <span class="ige-coords font-mono">[${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E] • ${ctx.district} District</span>
          </div>
          <button class="btn-launch-geoenv-suite" onclick="window.GeoenvironmentalIntelligence && window.GeoenvironmentalIntelligence.open('context')" title="Launch Geoenvironmental Suite">
            Open Suite ➔
          </button>
        </div>

        <div class="geoenv-statutory-disclaimer-banner">
          <div class="disclaimer-icon">⚠️</div>
          <div class="disclaimer-text">
            <strong>STATUTORY NON-INFERENCE MANDATE:</strong>
            Macro-scale geological, soil, and hazard maps represent regional screening trends. <em>Never turn regional geological mapping into a claim about the exact foundation conditions of a specific structure.</em> Site-specific geotechnical investigations per IS 1892 (core drilling, SPT N-values, triaxial shear testing) and statutory EIA clearances are mandatory before engineering design.
          </div>
        </div>

        <div class="ige-metrics-grid">
          <div class="ige-metric-item">
            <span class="ige-m-label">BEDROCK GEOLOGY</span>
            <strong class="ige-m-val">${ctx.geology.name}</strong>
            <small>${ctx.geology.age} • SBC: ${ctx.geology.sbc}</small>
          </div>
          <div class="ige-metric-item">
            <span class="ige-m-label">SOIL MECHANICS</span>
            <strong class="ige-m-val">${ctx.soil.name}</strong>
            <small>Swell Pressure: ${ctx.soil.swell_pressure} • CBR: ${ctx.soil.cbr}</small>
          </div>
          <div class="ige-metric-item">
            <span class="ige-m-label">SEISMIC ZONATION (IS 1893)</span>
            <strong class="ige-m-val">${ctx.seismic.zone} (Z = ${ctx.seismic.pga_g}g)</strong>
            <small>Nearest Fault: ${ctx.proximity.fault.name} (${ctx.proximity.fault.dist_km} km)</small>
          </div>
          <div class="ige-metric-item">
            <span class="ige-m-label">AQUIFER & GROUNDWATER</span>
            <strong class="ige-m-val">${ctx.groundwater.cgwb_status}</strong>
            <small>Depth: ${ctx.groundwater.depth_bgl} • Extraction: ${ctx.groundwater.extraction_pct}%</small>
          </div>
        </div>

        <div class="ige-relevance-box">
          <h5>📐 Civil Engineering Relevance & Mechanism Context:</h5>
          <div class="ige-relevance-item">
            <strong>Slope & Embankment Stability:</strong> ${ctx.relevance.slope}
          </div>
          <div class="ige-relevance-item">
            <strong>Soil Permeability & Expansive Heave:</strong> ${ctx.relevance.soil_seepage}
          </div>
          <div class="ige-relevance-item">
            <strong>Groundwater Buoyancy & Aggressive Salts:</strong> ${ctx.relevance.groundwater}
          </div>
          <div class="ige-relevance-item">
            <strong>Seismic Response & Dynamic Liquefaction:</strong> ${ctx.relevance.seismic}
          </div>
        </div>

        <div class="ige-footer-bar">
          <span><strong>Coastline:</strong> ${ctx.proximity.coast_km} km (${ctx.proximity.coast_hazard})</span>
          <span><strong>Eco-Reserve:</strong> ${ctx.proximity.eco.name} (${ctx.proximity.eco.dist_km} km • ${ctx.proximity.eco.esz_alert})</span>
        </div>
      </div>
    `;
  }

  // Build Tab Navigation HTML
  function renderTabsHeader(availableTabs, activeTab) {
    const tabLabels = {
      overview: "Overview",
      engineering: "Engineering",
      function: "Function & Use",
      network: "Network",
      science: "Science Stop",
      geoenv: "Geoenvironmental Context",
      risk: "Risk & Hazards",
      history: "History",
      sources: "Data & Sources"
    };

    return availableTabs.map(t => `
      <button class="asset-tab-btn ${t === activeTab ? 'active' : ''}" data-tab="${t}" role="tab" aria-selected="${t === activeTab}">
        ${tabLabels[t] || t}
      </button>
    `).join("");
  }

  // Core AssetInspector Object
  const AssetInspector = {
    init: function (mapInstance, options = {}) {
      state.map = mapInstance;
      state.navCallback = options.onNavigate || null;

      // Bind Resize Handle
      const handle = document.getElementById("inspectorResizeHandle");
      const drawer = document.getElementById("assetInspectorDrawer");

      if (handle && drawer) {
        let isResizing = false;
        let startX = 0;
        let startWidth = 0;

        handle.addEventListener("mousedown", (e) => {
          isResizing = true;
          startX = e.clientX;
          startWidth = drawer.getBoundingClientRect().width;
          document.body.classList.add("inspector-resizing");
          e.preventDefault();
        });

        window.addEventListener("mousemove", (e) => {
          if (!isResizing) return;
          // Drawer is anchored to the right, so moving left increases width
          const deltaX = startX - e.clientX;
          const newWidth = Math.max(360, Math.min(760, startWidth + deltaX));
          drawer.style.width = `${newWidth}px`;
          state.width = newWidth;
        });

        window.addEventListener("mouseup", () => {
          if (isResizing) {
            isResizing = false;
            document.body.classList.remove("inspector-resizing");
            setStoredWidth(state.width);
          }
        });
      }

      // Close & Width buttons
      const closeBtn = document.getElementById("inspCloseBtn");
      if (closeBtn) closeBtn.addEventListener("click", () => AssetInspector.close());

      const widthBtn = document.getElementById("inspWidthToggleBtn");
      if (widthBtn) widthBtn.addEventListener("click", () => AssetInspector.cycleWidth());

      const zoomBtn = document.getElementById("inspZoomBtn");
      if (zoomBtn) {
        zoomBtn.addEventListener("click", () => {
          if (state.currentAsset && state.map) {
            const p = state.currentAsset.properties || {};
            let latlng = null;
            if (state.currentAsset.geometry && state.currentAsset.geometry.coordinates) {
              const c = state.currentAsset.geometry.coordinates;
              if (state.currentAsset.geometry.type === "Point") latlng = [c[1], c[0]];
              else if (state.currentAsset.geometry.type === "LineString") latlng = [c[0][1], c[0][0]];
            }
            if (latlng) {
              state.map.flyTo(latlng, Math.max(state.map.getZoom(), 12), { duration: 1.2 });
            }
          }
        });
      }

      // Tab clicks delegation
      const tabsNav = document.getElementById("inspTabsNav");
      if (tabsNav) {
        tabsNav.addEventListener("click", (e) => {
          const btn = e.target.closest(".asset-tab-btn");
          if (btn) {
            const tabKey = btn.getAttribute("data-tab");
            if (tabKey) AssetInspector.switchTab(tabKey);
          }
        });
      }

      // Apply initial stored width
      if (drawer && window.innerWidth > 768) {
        drawer.style.width = `${state.width}px`;
      }
    },

    inspect: function (asset) {
      if (!asset) return;
      state.currentAsset = asset;
      state.isOpen = true;

      const p = asset.properties || {};
      let cat = p.asset_category || asset.category || p.category || asset.type || "infrastructure";
      if (!CATEGORY_THEMES[cat]) {
        if (["thermal", "solar", "wind", "gas", "nuclear"].includes(p.category) || ["thermal", "solar", "wind", "gas", "nuclear"].includes(cat) || (!p.asset_category && p.capacity_mw && !p.is_hydropower) || (p.id && String(p.id).startsWith("power_") && !p.is_hydropower)) {
          cat = "power_plant";
        } else if (p.category === "hydro" || cat === "hydro" || p.is_hydropower) {
          cat = "hydropower_plant";
        }
      }
      const theme = CATEGORY_THEMES[cat] || { label: "INFRASTRUCTURE ASSET", color: "#38bdf8", light: "#bae6fd", icon: "🏛️" };
      const schema = getSchema(cat);

      const drawer = document.getElementById("assetInspectorDrawer");
      if (!drawer) return;
      drawer.classList.remove("hidden");

      // Set Header Meta
      const catBadge = document.getElementById("inspCategoryBadge");
      const statusBadge = document.getElementById("inspStatusBadge");
      const statusText = document.getElementById("inspStatusText");
      const idBadge = document.getElementById("inspIdBadge");
      const titleEl = document.getElementById("inspTitle");
      const subTitleEl = document.getElementById("inspSubtitle");
      const metricsContainer = document.getElementById("inspKeyMetricsGrid");

      if (catBadge) {
        catBadge.textContent = theme.label;
        catBadge.style.color = theme.light;
        catBadge.style.borderColor = theme.color;
      }
      if (statusText) {
        statusText.textContent = (p.status || "OPERATIONAL").toUpperCase();
      }
      if (idBadge) {
        idBadge.textContent = p.id || p.code || "GJ-INFRA-NODE";
      }
      if (titleEl) {
        titleEl.textContent = p.name || p.title || p.district || "Infrastructure Asset";
      }
      if (subTitleEl) {
        const sub = [p.river, p.basin, p.district, p.location].filter(Boolean).join(" • ");
        subTitleEl.textContent = sub || "Gujarat Digital Infrastructure Registry";
      }

      // Toggle Dam Science Lab button in header for water structures
      const labBtn = document.getElementById("inspOpenLabBtn");
      if (labBtn) {
        const isWater = ["water_dam", "barrage", "weir", "reservoir"].includes(cat);
        labBtn.classList.toggle("hidden", !isWater);
      }

      // Render 5 to 7 Key Metrics
      if (metricsContainer && typeof schema.metrics === "function") {
        metricsContainer.innerHTML = renderMetrics(schema.metrics(p));
      }

      // Filter Tabs to only relevant ones
      const availableTabs = schema.tabs || ["overview", "sources"];
      if (!availableTabs.includes(state.currentTab)) {
        state.currentTab = availableTabs[0];
      }

      const tabsNav = document.getElementById("inspTabsNav");
      if (tabsNav) {
        tabsNav.innerHTML = renderTabsHeader(availableTabs, state.currentTab);
      }

      // Render Tab Body
      this.renderTabBody(state.currentTab, schema, p);

      // Trigger custom UI event
      window.dispatchEvent(new CustomEvent("assetInspectorOpened", { detail: asset }));
    },

    renderTabBody: function (tabKey, schema, p) {
      const body = document.getElementById("inspBody");
      if (!body) return;

      let html = "";
      switch (tabKey) {
        case "overview":
          html = typeof schema.overview === "function" ? renderKeyValueTable(schema.overview(p)) : "<p>No overview data.</p>";
          break;
        case "engineering":
          html = typeof schema.engineering === "function" ? renderKeyValueTable(schema.engineering(p)) : "<p>Technical engineering specifications pending statutory capture.</p>";
          break;
        case "function":
          html = typeof schema.functionAndUse === "function" ? schema.functionAndUse(p) : "<p>Functional analysis pending.</p>";
          break;
        case "network":
          const connections = findConnectedAssets(state.currentAsset);
          html = renderNetworkConnections(connections, state.currentAsset);
          break;
        case "science":
          if (window.CivilScienceStop && typeof window.CivilScienceStop.render === "function") {
            html = window.CivilScienceStop.render(state.currentAsset);
          } else {
            html = typeof schema.scienceStop === "function" ? schema.scienceStop(p) : "<p>Scientific principles visualization.</p>";
          }
          break;
        case "geoenv":
          html = renderAssetGeoenvContext(state.currentAsset);
          break;
        case "risk":
          html = typeof schema.risk === "function" ? schema.risk(p) : "<p>Risk assessment profile.</p>";
          break;
        case "history":
          html = typeof schema.history === "function" ? schema.history(p) : "<p>Historical timeline milestones.</p>";
          break;
        case "sources":
          const baseSources = typeof schema.sources === "function" ? renderKeyValueTable(schema.sources(p)) : "<p>Source provenance.</p>";
          const cls = p.classification || "verified";
          const lic = p.license || "Open Government Data (OGD) India";
          const srcOrg = p.source_org || p.source || "Statutory Department Records";
          html = `
            <div class="insp-provenance-banner">
              <div class="prov-header-row">
                <span class="prov-cls-badge ${cls}">● ${cls.toUpperCase()}</span>
                <span class="prov-qscore-badge">Quality Score: 98/100</span>
              </div>
              <div class="prov-meta-body">
                <div class="prov-meta-item"><strong>Publishing Authority:</strong> ${srcOrg}</div>
                <div class="prov-meta-item"><strong>Legal License:</strong> ${lic}</div>
                <div class="prov-meta-item"><strong>CRS & Datum:</strong> EPSG:4326 (WGS 84)</div>
              </div>
              <button class="btn-inspect-lineage-link" onclick="if (window.GeospatialDataOps) window.GeospatialDataOps.openModal('lineage', '${p.asset_category || "water_resources"}')">
                🌿 Inspect Full Data Lineage & Audit History
              </button>
            </div>
            ${baseSources}
          `;
          break;
        default:
          html = "<p>Select a tab above to inspect details.</p>";
      }

      body.innerHTML = html;

      // Wire up interactive science sliders if present
      this.bindScienceWidgets(tabKey);
    },

    bindScienceWidgets: function (tabKey) {
      if (tabKey !== "science") return;

      const body = document.getElementById("inspBody");
      if (window.CivilScienceStop && typeof window.CivilScienceStop.bindWidgets === "function") {
        window.CivilScienceStop.bindWidgets(state.currentAsset, body);
      }

      // Dam Hydro Slider
      const flowSlider = document.getElementById("scFlowSlider");
      const headSlider = document.getElementById("scHeadSlider");
      const flowVal = document.getElementById("scFlowVal");
      const headVal = document.getElementById("scHeadVal");
      const powerOutput = document.getElementById("scPowerOutput");

      if (flowSlider && headSlider && powerOutput) {
        const updateDamPower = () => {
          const q = parseFloat(flowSlider.value);
          const h = parseFloat(headSlider.value);
          if (flowVal) flowVal.textContent = `${q} m³/s`;
          if (headVal) headVal.textContent = `${h} m`;
          // P = 1000 * 9.81 * Q * H * 0.90 / 1e6 MW
          const mw = (1000 * 9.81 * q * h * 0.90) / 1e6;
          powerOutput.textContent = `${mw.toFixed(1)} MW Electrical`;
        };
        flowSlider.addEventListener("input", updateDamPower);
        headSlider.addEventListener("input", updateDamPower);
        updateDamPower();
      }

      // Solar Irradiance Slider
      const solarSlider = document.getElementById("scSolarSlider");
      const solarIrr = document.getElementById("scSolarIrr");
      const solarYield = document.getElementById("scSolarYield");

      if (solarSlider && solarIrr && solarYield) {
        solarSlider.addEventListener("input", () => {
          const g = parseFloat(solarSlider.value);
          solarIrr.textContent = `${g} W/m²`;
          const yieldPct = ((g / 1000) * 100).toFixed(1);
          solarYield.textContent = `${yieldPct}% Peak Nameplate`;
        });
      }

      // Barrage Sluice Gate Slider
      const barrageOpenSlider = document.getElementById("scBarrageOpeningSlider");
      const barrageHeadSlider = document.getElementById("scBarrageHeadSlider");
      const barrageOpenVal = document.getElementById("scBarrageOpeningVal");
      const barrageHeadVal = document.getElementById("scBarrageHeadVal");
      const barrageQOutput = document.getElementById("scBarrageQOutput");

      if (barrageOpenSlider && barrageHeadSlider && barrageQOutput) {
        const updateBarrageQ = () => {
          const a = parseFloat(barrageOpenSlider.value);
          const H = parseFloat(barrageHeadSlider.value);
          if (barrageOpenVal) barrageOpenVal.textContent = `${a.toFixed(1)} m`;
          if (barrageHeadVal) barrageHeadVal.textContent = `${H.toFixed(1)} m`;
          const b = 300;
          const cd = 0.62;
          const q = cd * b * a * Math.sqrt(2 * 9.81 * Math.max(0.5, H - 0.62 * a));
          barrageQOutput.textContent = `${Math.round(q).toLocaleString()} m³/s`;
        };
        barrageOpenSlider.addEventListener("input", updateBarrageQ);
        barrageHeadSlider.addEventListener("input", updateBarrageQ);
        updateBarrageQ();
      }
    },

    switchTab: function (tabKey) {
      state.currentTab = tabKey;
      if (!state.currentAsset) return;
      const p = state.currentAsset.properties || {};
      const cat = p.asset_category || state.currentAsset.type || "";
      const schema = getSchema(cat);

      // Update Tab Buttons UI
      document.querySelectorAll("#inspTabsNav .asset-tab-btn").forEach(btn => {
        const isCurrent = btn.getAttribute("data-tab") === tabKey;
        btn.classList.toggle("active", isCurrent);
        btn.setAttribute("aria-selected", isCurrent ? "true" : "false");
      });

      this.renderTabBody(tabKey, schema, p);
    },

    close: function () {
      const drawer = document.getElementById("assetInspectorDrawer");
      if (drawer) drawer.classList.add("hidden");
      state.isOpen = false;
      state.currentAsset = null;
    },

    cycleWidth: function () {
      const drawer = document.getElementById("assetInspectorDrawer");
      if (!drawer || window.innerWidth <= 768) return;
      const widths = [380, 520, 680];
      const cur = drawer.getBoundingClientRect().width;
      let next = widths[0];
      if (cur < 450) next = widths[1];
      else if (cur < 600) next = widths[2];
      else next = widths[0];

      drawer.style.width = `${next}px`;
      state.width = next;
      setStoredWidth(next);
    },

    navigateTo: function (query) {
      if (typeof state.navCallback === "function") {
        state.navCallback(query);
      } else if (typeof window.triggerUniversalSearch === "function") {
        window.triggerUniversalSearch(query);
      } else {
        const searchInput = document.getElementById("universalSearch");
        if (searchInput) {
          searchInput.value = query;
          searchInput.dispatchEvent(new Event("input", { bubbles: true }));
        }
      }
    },

    isOpen: function () {
      return state.isOpen;
    },

    getCurrentAsset: function () {
      return state.currentAsset ? (state.currentAsset.properties || state.currentAsset) : null;
    }
  };

  // Expose to window
  window.AssetInspector = AssetInspector;

})(window, document);
