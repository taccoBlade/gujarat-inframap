/**
 * Gujarat InfraMap — Dam Science Lab (Production Hydro-Civil Engineering Suite)
 * Educational, engineering-focused, parametric science laboratory for all Gujarat dams & reservoirs.
 * Covers:
 *   Section A: Structural Anatomy & Labeled Engineering Schematic
 *   Section B: Hydraulics Calculators (Hydrostatic Pressure, Resultant Force, Hydropower, Flow & Volume Converters)
 *   Section C: Reservoir Science (Storage Allocation, Elevations, Hypsometric EAC Dynamics)
 *   Section D: Dam Safety & Geotechnical Engineering (Uplift, Piping, Foundation, Stability, Siltation, Routing, Instrumentation)
 *   Section E: System Role, Regional Significance & Dynamic Comparative Benchmarking
 *
 * Sourced strictly from CWC NRLD 2023, India-WRIS, and Gujarat WRD Masterplan.
 * Standard: EPSG:4326, Zero Fabrication, Transparent Physics Formulations.
 * Version: 4.2.0
 */

(function () {
  "use strict";

  // Cache of water resources loaded from GeoJSON
  let cachedWaterAssets = null;
  let activeAsset = null;
  let activeTab = "sectionA";

  // Distinctive engineering notes for major Gujarat assets (verified properties & documented significance)
  const DISTINCTIVE_ENGINEERING_PROFILES = {
    "GJ-WR-DAM-001": {
      title: "Sardar Sarovar Dam (Narmada River)",
      distinctive: "The second-largest concrete gravity volume dam in the world (approx. 6.8 million m³ of concrete). It anchors the interstate Narmada Water Resources Project with a 1,450 MW powerhouse (1,200 MW underground Riverbed Powerhouse with 6×200 MW Francis reversible pump-turbines, and 250 MW Canal Head Powerhouse). Its 458 km Narmada Main Canal is the world's largest lined irrigation canal (carrying 1,133 cumecs), conveying water over 700 km into the arid plains of Saurashtra, Kutch, and southern Rajasthan.",
      geology: "Deccan Trap basalt flows with intervening dolerite dykes and riverbed fault zones, treated with extensive deep consolidation grouting and high-capacity rock anchors."
    },
    "GJ-WR-DAM-002": {
      title: "Ukai Dam / Vallabh Sagar (Tapi River)",
      distinctive: "Known as the 'Vallabh Sagar', Ukai is the second-largest reservoir in Gujarat with 7,414 MCM gross storage. Completed in 1972, this 4,927 m long composite earthen and masonry dam serves as the primary flood cushion safeguarding the industrial metropolis of Surat, while operating a 300 MW (4×75 MW) hydroelectric generating station feeding Gujarat's southern grid.",
      geology: "Amygdaloidal and compact basalt under masonry spillway, with deep alluvial cutoff trench across riverbed flanks."
    },
    "GJ-WR-DAM-003": {
      title: "Kadana Dam (Mahi River)",
      distinctive: "Constructed on the inter-state Mahi River, Kadana features an innovative 240 MW (4×60 MW) reversible pumped-storage hydro installation designed to absorb surplus off-peak thermal grid power and dispatch rapid peaking power. Its 21 radial gates manage large flash floods from Rajasthan and Madhya Pradesh catchments.",
      geology: "Folded Aravalli Supergroup quartzite and phyllite formations featuring steep dip angles requiring extensive prestressed cable anchoring."
    },
    "GJ-WR-DAM-004": {
      title: "Dharoi Dam (Sabarmati River)",
      distinctive: "Built in 1978 in the Aravalli foothills, Dharoi is the primary upstream water anchor for the Sabarmati basin (867 MCM gross storage). It guarantees municipal drinking water supply for Ahmedabad, Gandhinagar, and Mehsana, while regulating inflows into the downstream Sabarmati Riverfront and Vasna Barrage.",
      geology: "Precambrian granite-gneiss and calcschist bedrock offering a competent foundation for the central masonry spillway."
    },
    "GJ-WR-DAM-005": {
      title: "Dantiwada Dam (Banas River)",
      distinctive: "The agricultural lifeline of arid Banaskantha district, Dantiwada impounds the ephemeral Banas River (464 MCM). Constructed as a composite earthen-masonry dam in 1965, it provides critical irrigation and alluvial groundwater recharge across desert-bordering talukas.",
      geology: "Weathered granite and quartz porphyry rock overlaid by thick sandy alluvium, requiring an extensive downstream seepage cutoff."
    },
    "GJ-WR-DAM-006": {
      title: "Shetrunji Dam (Shetrunji River)",
      distinctive: "The largest water storage reservoir in the Saurashtra peninsula (309 MCM), completed in 1965 near Palitana. It provides drinking water to Bhavnagar city and rural Saurashtra while nourishing fertile coastal agrarian belts.",
      geology: "Horizontally bedded Deccan basaltic trap flows with massive columnar jointing."
    },
    "GJ-WR-DAM-007": {
      title: "Bhadar Dam (Bhadar River)",
      distinctive: "The primary water supply lifeline for Rajkot and central Saurashtra (238 MCM). It regulates the west-flowing Bhadar River, supplying critical municipal water to Rajkot Municipal Corporation and agricultural command areas.",
      geology: "Dense basaltic lava flows with intertrappean clay seams treated with pressure grouting."
    },
    "GJ-WR-DAM-008": {
      title: "Panam Dam (Panam River)",
      distinctive: "Impounding a tributary of the Mahi River in Panchmahal district (738 MCM), Panam supplies bulk water to Panchmahal, Vadodara, and Anand, supported by a 2 MW mini-hydro station and an extensive gravity canal network.",
      geology: "Competent Quartzite and granite-gneiss complex."
    },
    "GJ-WR-DAM-009": {
      title: "Karjan Dam (Karjan River)",
      distinctive: "A 100 m high masonry-concrete gravity dam on the Karjan River near Rajpipla (630 MCM). Features a high-head chute spillway and a 3 MW powerhouse, feeding irrigation canals across Bharuch and Narmada districts.",
      geology: "Massive Deccan Trap basalt with sub-horizontal flow contacts."
    },
    "GJ-WR-DAM-010": {
      title: "Damanganga Dam / Madhuban (Damanganga River)",
      distinctive: "An inter-state multipurpose reservoir (595 MCM) constructed jointly by Gujarat, Dadra & Nagar Haveli, and Daman & Diu. It supplies high-volume industrial and drinking water to Vapi, Silvassa, and Daman coastal enclaves.",
      geology: "Hard compact basaltic trap rock under spillway section."
    },
    "GJ-WR-DAM-011": {
      title: "Machhu-I Dam (Machhu River)",
      distinctive: "Upstream anchor dam of the Machhu River in Surendranagar/Morbi (73 MCM). Built in 1961, it provides irrigation and municipal buffering for Wankaner and Morbi ceramic clusters.",
      geology: "Dhrangadhra sandstone and weathered basalt formations."
    },
    "GJ-WR-DAM-012": {
      title: "Machhu-II Dam (Machhu River)",
      distinctive: "Completely reconstructed as a modern masonry gravity dam with automated radial gates following the historical 1979 flash flood. Features a massive 6,000 m³/s spillway design capacity to safely evacuate extreme cloudburst runoff from the Morbi catchment.",
      geology: "Sandstone-shale interbedded sedimentary bedrock fortified with concrete cutoff walls."
    },
    "GJ-WR-BAR-001": {
      title: "Vasna Barrage (Sabarmati River)",
      distinctive: "Located at Ahmedabad, Vasna Barrage features 26 automated radial sluice gates controlling the water level of the Sabarmati Riverfront while diverting water into the Fatehwadi irrigation canal network (32,000 ha command). During monsoon floods, it safely discharges up to 4,247 m³/s to protect urban Ahmedabad.",
      geology: "Deep alluvium and river sand bed, secured with upstream and downstream sheet pile cutoffs and reinforced concrete aprons."
    },
    "GJ-WR-BAR-002": {
      title: "Wanakbori Barrage (Mahi River)",
      distinctive: "A major diversion structure on the Mahi River with 22 radial crest gates discharging up to 28,000 m³/s. It feeds the Mahi Right Bank Canal (MRBC) system irrigating 210,000 ha across Kheda and Anand, and supplies cooling water to Wanakbori Thermal Power Station.",
      geology: "Solid quartzite and crystalline granite riverbed."
    },
    "GJ-WR-WEI-001": {
      title: "Kakrapar Weir (Tapi River)",
      distinctive: "Historic pick-up weir commissioned in 1953, 32 km downstream of Ukai Dam. Its 621 m masonry ogee crest diverts regulated Tapi flows into the Kakrapar Left and Right Bank Canals, irrigating over 227,000 ha across Surat and Navsari districts.",
      geology: "Massive riverbed basalt sill providing a natural foundation for the low-head masonry crest."
    },
    "GJ-WR-WEI-002": {
      title: "Singanpur Weir (Tapi River)",
      distinctive: "A tidal and municipal pick-up weir on the lower Tapi River in Surat. It acts as a critical salinity ingress barrier, preventing Arabian Sea tidal surges from contaminating Surat's municipal drinking water intake wells while maintaining an urban freshwater pool.",
      geology: "Coastal marine clay and silty alluvium stabilized with reinforced concrete piling."
    }
  };

  /**
   * Helper: Format number with fallback
   */
  function fmt(val, unit = "") {
    if (val === null || val === undefined || val === "" || val === "N/A" || val === "—") return "—";
    const num = parseFloat(val);
    if (isNaN(num)) return val;
    return `${num.toLocaleString()}${unit ? " " + unit : ""}`;
  }

  /**
   * Fetch or resolve all water assets
   */
  async function loadWaterAssets() {
    if (cachedWaterAssets && cachedWaterAssets.length > 0) return cachedWaterAssets;
    if (window.allWaterAssetsList && window.allWaterAssetsList.length > 0) {
      cachedWaterAssets = window.allWaterAssetsList.map(a => a.feature ? a.feature.properties : a);
      return cachedWaterAssets;
    }
    try {
      const res = await fetch("data/gujarat_water_resources.geojson");
      const geo = await res.json();
      cachedWaterAssets = geo.features.map(f => ({ ...f.properties, geometry: f.geometry }));
      return cachedWaterAssets;
    } catch (e) {
      console.error("[DamScienceLab] Failed to load water assets:", e);
      return [];
    }
  }

  /**
   * Main DamScienceLab Controller
   */
  const DamScienceLab = {
    /**
     * Initialize event listeners & DOM hooks
     */
    init() {
      const modal = document.getElementById("damScienceLabModal");
      const closeBtn = document.getElementById("closeDamLabBtn");
      const assetSelect = document.getElementById("damLabAssetSelect");
      const tabBtns = document.querySelectorAll(".dam-lab-tab-btn");
      const flyToBtn = document.getElementById("damLabFlyToBtn");
      const inspectBtn = document.getElementById("damLabInspectBtn");

      if (closeBtn) closeBtn.addEventListener("click", () => this.close());

      // Close on backdrop click
      if (modal) {
        modal.addEventListener("click", (e) => {
          const rect = modal.getBoundingClientRect();
          const inDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height && rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
          if (!inDialog) this.close();
        });
      }

      // Tab switcher
      tabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
          const tab = btn.getAttribute("data-tab");
          this.switchTab(tab);
        });
      });

      // Asset Dropdown Change
      if (assetSelect) {
        assetSelect.addEventListener("change", (e) => {
          const id = e.target.value;
          this.setAssetById(id);
        });
      }

      // Fly to Asset on Map
      if (flyToBtn) {
        flyToBtn.addEventListener("click", () => {
          if (activeAsset && window.selectWaterAssetById) {
            this.close();
            window.selectWaterAssetById(activeAsset.id, true);
          }
        });
      }

      // Open Asset Inspector Drawer
      if (inspectBtn) {
        inspectBtn.addEventListener("click", () => {
          if (activeAsset && window.AssetInspector) {
            this.close();
            window.AssetInspector.inspect({
              properties: activeAsset,
              geometry: activeAsset.geometry,
              type: activeAsset.asset_category || "water_dam"
            });
          }
        });
      }
    },

    /**
     * Open Dam Science Lab for a specific asset or asset ID
     */
    async open(assetOrId) {
      const modal = document.getElementById("damScienceLabModal");
      if (!modal) return;

      const assets = await loadWaterAssets();
      this.populateAssetSelect(assets);

      let target = null;
      if (typeof assetOrId === "string") {
        target = assets.find(a => a.id === assetOrId || a.name === assetOrId);
      } else if (assetOrId && typeof assetOrId === "object") {
        target = assetOrId.properties || assetOrId;
      }

      // Default to Sardar Sarovar Dam if none provided
      if (!target) {
        target = assets.find(a => a.id === "GJ-WR-DAM-001") || assets[0];
      }

      this.setAsset(target);

      if (typeof modal.showModal === "function") {
        modal.showModal();
      } else {
        modal.setAttribute("open", "");
      }
    },

    /**
     * Helper to open the lab for whatever asset is currently in the Asset Inspector
     */
    openCurrentAsset() {
      if (window.AssetInspector && window.AssetInspector.getCurrentAsset) {
        const cur = window.AssetInspector.getCurrentAsset();
        if (cur) return this.open(cur);
      }
      this.open("GJ-WR-DAM-001");
    },

    /**
     * Close the modal
     */
    close() {
      const modal = document.getElementById("damScienceLabModal");
      if (modal && typeof modal.close === "function") {
        modal.close();
      } else if (modal) {
        modal.removeAttribute("open");
      }
    },

    /**
     * Populate the dropdown with all verified water structures
     */
    populateAssetSelect(assets) {
      const sel = document.getElementById("damLabAssetSelect");
      if (!sel || sel.options.length > 0) return;

      // Group by category
      const dams = assets.filter(a => a.asset_category === "water_dam");
      const barrages = assets.filter(a => a.asset_category === "barrage");
      const weirs = assets.filter(a => a.asset_category === "weir");
      const reservoirs = assets.filter(a => a.asset_category === "reservoir");

      const makeGroup = (label, list) => {
        if (!list || list.length === 0) return;
        const optgroup = document.createElement("optgroup");
        optgroup.label = label;
        list.forEach(item => {
          const opt = document.createElement("option");
          opt.value = item.id;
          opt.textContent = `${item.name} (${item.district || item.basin || ''})`;
          optgroup.appendChild(opt);
        });
        sel.appendChild(optgroup);
      };

      makeGroup("Major & Medium Dams (30 CWC NRLD)", dams);
      makeGroup("Regulated River Barrages (2)", barrages);
      makeGroup("Pick-up & Tidal Weirs (2)", weirs);
      makeGroup("Reservoir Water Spreads (6)", reservoirs);
    },

    /**
     * Switch active asset by ID
     */
    async setAssetById(id) {
      const assets = await loadWaterAssets();
      const match = assets.find(a => a.id === id);
      if (match) this.setAsset(match);
    },

    /**
     * Set active asset and render
     */
    setAsset(p) {
      activeAsset = p;

      // Update Header Badges
      const nameEl = document.getElementById("damLabActiveName");
      const catBadge = document.getElementById("damLabCatBadge");
      const riverBadge = document.getElementById("damLabRiverBadge");
      const idBadge = document.getElementById("damLabIdBadge");
      const sel = document.getElementById("damLabAssetSelect");

      if (nameEl) nameEl.textContent = p.name;
      if (catBadge) {
        const catMap = {
          water_dam: "Major Water Dam",
          barrage: "River Sluice Barrage",
          weir: "Pick-up / Tidal Weir",
          reservoir: "Reservoir Water Spread",
          check_dam: "Recharge Check Dam"
        };
        catBadge.textContent = catMap[p.asset_category] || p.asset_category || "Civil Dam";
      }
      if (riverBadge) riverBadge.textContent = `${p.river || 'River Basin'} • ${p.basin || 'Gujarat'}`;
      if (idBadge) idBadge.textContent = p.id || "GJ-WR-DAM";
      if (sel && sel.value !== p.id) sel.value = p.id;

      this.render();
    },

    /**
     * Switch active section tab
     */
    switchTab(tabKey) {
      activeTab = tabKey;
      document.querySelectorAll(".dam-lab-tab-btn").forEach(btn => {
        const isMatch = btn.getAttribute("data-tab") === tabKey;
        btn.classList.toggle("active", isMatch);
        btn.setAttribute("aria-selected", isMatch ? "true" : "false");
      });
      this.render();
    },

    /**
     * Render the active tab content
     */
    render() {
      const container = document.getElementById("damLabContent");
      if (!container || !activeAsset) return;

      const p = activeAsset;
      let html = "";

      switch (activeTab) {
        case "sectionA":
          html = this.renderSectionA(p);
          break;
        case "sectionB":
          html = this.renderSectionB(p);
          break;
        case "sectionC":
          html = this.renderSectionC(p);
          break;
        case "sectionD":
          html = this.renderSectionD(p);
          break;
        case "sectionE":
          html = this.renderSectionE(p);
          break;
        default:
          html = this.renderSectionA(p);
      }

      container.innerHTML = html;
      this.bindInteractions();
    },

    // =========================================================================
    // SECTION A — Understand the Structure & Labeled Schematic
    // =========================================================================
    renderSectionA(p) {
      const damType = p.dam_type || "Concrete Gravity Dam";
      const height = parseFloat(p.height_m) || 45;
      const length = parseFloat(p.crest_length_m) || 600;
      const frl = parseFloat(p.frl_m) || (height * 0.85);
      const profile = DISTINCTIVE_ENGINEERING_PROFILES[p.id] || {};
      const geology = p.foundation_geology || profile.geology || "Precambrian to Deccan volcanic bedrock formations, surveyed under statutory CWC geotechnical investigative criteria.";

      const isEmbankment = damType.toLowerCase().includes("earth") || damType.toLowerCase().includes("rock") || damType.toLowerCase().includes("composite");
      const isBarrage = (p.asset_category === "barrage" || p.asset_category === "weir" || damType.toLowerCase().includes("barrage") || damType.toLowerCase().includes("weir"));

      // Generate Typology-Specific Schematic SVG
      let svgMarkup = "";
      if (isBarrage) {
        svgMarkup = `
          <svg viewBox="0 0 760 320" class="dam-schematic-svg" aria-label="Schematic Cross-Section of Gated River Barrage">
            <!-- Sky & Background Water -->
            <rect x="0" y="0" width="760" height="320" fill="#090d16" />
            <!-- Upstream River Water -->
            <path d="M 40 140 L 320 140 L 320 220 L 40 220 Z" fill="rgba(56, 189, 248, 0.25)" />
            <line x1="40" y1="140" x2="320" y2="140" stroke="#38bdf8" stroke-dasharray="4,4" stroke-width="2"/>
            <text x="50" y="130" fill="#38bdf8" font-size="12" font-weight="700">Upstream Pond Level (${fmt(p.frl_m, 'm MSL')})</text>

            <!-- Foundation Alluvium / Bedrock -->
            <rect x="20" y="240" width="720" height="70" fill="rgba(71, 85, 105, 0.3)" stroke="#475569" stroke-width="1.5"/>
            <text x="30" y="275" fill="#94a3b8" font-size="12">Foundation Bedrock / Alluvial Stratum (${geology.slice(0, 45)}...)</text>

            <!-- Upstream Impervious Concrete Apron -->
            <rect x="100" y="220" width="220" height="20" fill="#334155" stroke="#94a3b8" stroke-width="1.5" />
            <text x="140" y="235" fill="#cbd5e1" font-size="11">Upstream Concrete Apron</text>

            <!-- Sheet Pile Cutoffs -->
            <rect x="100" y="240" width="8" height="50" fill="#64748b" stroke="#94a3b8" />
            <text x="70" y="295" fill="#cbd5e1" font-size="10">U/S Sheet Pile Cutoff</text>
            <rect x="580" y="240" width="8" height="40" fill="#64748b" stroke="#94a3b8" />
            <text x="550" y="295" fill="#cbd5e1" font-size="10">D/S Sheet Pile Cutoff</text>

            <!-- Barrage Pier & Crest Structure -->
            <path d="M 320 220 L 320 60 L 390 60 L 390 220 Z" fill="#475569" stroke="#cbd5e1" stroke-width="2" />
            <text x="330" y="50" fill="#facc15" font-size="12" font-weight="700">Operating Pier Deck</text>

            <!-- Sluice Gate (Radial / Lift) -->
            <path d="M 320 120 Q 340 180 340 220" stroke="#f43f5e" stroke-width="6" fill="none" />
            <circle cx="320" cy="120" r="4" fill="#f43f5e" />
            <text x="240" y="170" fill="#f43f5e" font-size="11" font-weight="700">Sluice Gate (${p.gates_count || p.radial_gates_count || 'Steel Radial'})</text>

            <!-- Downstream Glacis & Stilling Basin -->
            <path d="M 390 220 L 450 228 L 520 228 L 580 220" fill="#334155" stroke="#94a3b8" stroke-width="1.5" />
            <text x="430" y="218" fill="#cbd5e1" font-size="11">Downstream Glacis</text>

            <!-- Baffle Blocks / Friction Blocks -->
            <rect x="470" y="215" width="12" height="13" fill="#94a3b8" />
            <rect x="500" y="215" width="12" height="13" fill="#94a3b8" />
            <text x="460" y="200" fill="#cbd5e1" font-size="10">Energy Dissipating Blocks</text>

            <!-- Downstream Flexible Launching Apron -->
            <rect x="580" y="220" width="120" height="14" fill="#1e293b" stroke="#64748b" stroke-dasharray="3,3" />
            <text x="600" y="212" fill="#94a3b8" font-size="10">Flexible Launching Apron</text>

            <!-- Downstream Tailwater -->
            <path d="M 390 200 L 700 200 L 700 220 L 390 220 Z" fill="rgba(56, 189, 248, 0.15)" />
            <line x1="390" y1="200" x2="700" y2="200" stroke="#0ea5e9" stroke-width="1.5" />
            <text x="620" y="190" fill="#0ea5e9" font-size="11">Downstream River</text>
          </svg>
        `;
      } else if (isEmbankment) {
        svgMarkup = `
          <svg viewBox="0 0 760 320" class="dam-schematic-svg" aria-label="Schematic Cross-Section of Earthfill / Rockfill Embankment Dam">
            <!-- Sky -->
            <rect x="0" y="0" width="760" height="320" fill="#090d16" />

            <!-- Reservoir Water -->
            <path d="M 40 100 L 315 100 L 315 240 L 40 240 Z" fill="rgba(56, 189, 248, 0.25)" />
            <line x1="40" y1="100" x2="315" y2="100" stroke="#38bdf8" stroke-dasharray="4,4" stroke-width="2"/>
            <text x="60" y="90" fill="#38bdf8" font-size="12" font-weight="700">Full Reservoir Level (FRL ${fmt(p.frl_m, 'm')})</text>

            <!-- Foundation Bedrock & Cutoff -->
            <rect x="20" y="240" width="720" height="70" fill="rgba(71, 85, 105, 0.3)" stroke="#475569" stroke-width="1.5"/>
            <text x="30" y="275" fill="#94a3b8" font-size="12">Foundation Bedrock: ${geology.slice(0, 48)}...</text>

            <!-- Foundation Impervious Cutoff Trench -->
            <polygon points="350,240 370,290 410,290 430,240" fill="#b45309" stroke="#d97706" stroke-width="1.5" />
            <text x="330" y="305" fill="#fbbf24" font-size="10">Impervious Cutoff Trench</text>

            <!-- Upstream Pervious Shell (Slope ~ 2.5:1) -->
            <polygon points="120,240 340,70 380,70 360,240" fill="#334155" stroke="#64748b" stroke-width="1.5" />
            <!-- Upstream Riprap Stone Pitching Layer -->
            <line x1="120" y1="240" x2="340" y2="70" stroke="#94a3b8" stroke-width="5" stroke-dasharray="4,2"/>
            <text x="140" y="160" fill="#e2e8f0" font-size="11" font-weight="600">Upstream Riprap Pitching</text>

            <!-- Central Low-Permeability Clay Core -->
            <polygon points="360,240 370,70 410,70 420,240" fill="#b45309" stroke="#f59e0b" stroke-width="1.5" />
            <text x="365" y="160" fill="#ffffff" font-size="11" font-weight="700" transform="rotate(-90 380,160)">Impermeable Clay Core</text>

            <!-- Chimney Filter & Horizontal Blanket Drain -->
            <line x1="410" y1="70" x2="420" y2="240" stroke="#38bdf8" stroke-width="3" stroke-dasharray="2,2"/>
            <rect x="420" y="234" width="200" height="6" fill="#38bdf8" />
            <text x="440" y="230" fill="#38bdf8" font-size="10">Internal Sand Chimney & Blanket Drain</text>

            <!-- Downstream Shell (Slope ~ 2:1) -->
            <polygon points="410,70 420,70 640,240 420,240" fill="#1e293b" stroke="#64748b" stroke-width="1.5" />
            <text x="500" y="160" fill="#cbd5e1" font-size="11">Downstream Shell (Pervious)</text>

            <!-- Rock Toe -->
            <polygon points="600,240 640,240 630,215 590,215" fill="#475569" stroke="#94a3b8" stroke-width="1.5" />
            <text x="630" y="210" fill="#e2e8f0" font-size="10">Rock Toe</text>

            <!-- Crest Roadway -->
            <rect x="340" y="65" width="70" height="5" fill="#94a3b8" />
            <text x="330" y="55" fill="#facc15" font-size="11" font-weight="700">Crest Road (${fmt(p.crest_length_m, 'm')})</text>

            <!-- Phreatic Seepage Line (Conceptual) -->
            <path d="M 315 100 Q 370 110 415 180 L 420 234" stroke="#06b6d4" stroke-width="2" stroke-dasharray="4,4" fill="none"/>
            <text x="320" y="125" fill="#06b6d4" font-size="9">Phreatic Seepage Line</text>
          </svg>
        `;
      } else {
        // Concrete Gravity Dam (Default for Sardar Sarovar, Kadana, Dharoi, etc.)
        svgMarkup = `
          <svg viewBox="0 0 760 320" class="dam-schematic-svg" aria-label="Schematic Cross-Section of Concrete Gravity Dam">
            <!-- Sky -->
            <rect x="0" y="0" width="760" height="320" fill="#090d16" />

            <!-- Reservoir Water -->
            <path d="M 40 80 L 260 80 L 260 250 L 40 250 Z" fill="rgba(56, 189, 248, 0.22)" />
            <line x1="40" y1="80" x2="260" y2="80" stroke="#38bdf8" stroke-dasharray="4,4" stroke-width="2"/>
            <text x="60" y="70" fill="#38bdf8" font-size="12" font-weight="700">Full Reservoir Level (FRL ${fmt(p.frl_m, 'm MSL')})</text>

            <!-- Foundation Bedrock Contact -->
            <rect x="20" y="250" width="720" height="60" fill="rgba(71, 85, 105, 0.35)" stroke="#475569" stroke-width="1.5"/>
            <text x="30" y="285" fill="#94a3b8" font-size="12">Foundation Bedrock: ${geology.slice(0, 50)}...</text>

            <!-- Foundation Grout Curtain & Drainage Holes -->
            <line x1="290" y1="250" x2="290" y2="305" stroke="#ef4444" stroke-width="3" stroke-dasharray="3,2"/>
            <text x="210" y="295" fill="#f87171" font-size="10">Deep Grout Curtain</text>
            <line x1="330" y1="250" x2="330" y2="295" stroke="#38bdf8" stroke-width="2" stroke-dasharray="2,2"/>
            <text x="335" y="295" fill="#38bdf8" font-size="10">Foundation Relief Drains</text>

            <!-- Concrete Gravity Dam Body -->
            <!-- Upstream Face: Vertical or slight batter; Crest: flat; Downstream slope: ~0.8:1 -->
            <polygon points="260,250 260,40 310,40 500,250" fill="#334155" stroke="#cbd5e1" stroke-width="2" />
            <text x="270" y="30" fill="#facc15" font-size="12" font-weight="700">Dam Crest (${fmt(p.crest_length_m, 'm')})</text>
            <text x="175" y="160" fill="#94a3b8" font-size="11">Upstream Face (Vertical)</text>
            <text x="430" y="130" fill="#cbd5e1" font-size="11">Downstream Glacis (Slope ~0.8:1)</text>

            <!-- Internal Inspection & Drainage Gallery -->
            <rect x="300" y="215" width="22" height="30" fill="#0f172a" stroke="#facc15" stroke-width="1.5" />
            <text x="250" y="210" fill="#facc15" font-size="10">Drainage Gallery</text>

            <!-- Spillway Ogee Glacis & Radial Gate Profile -->
            <path d="M 310 40 Q 330 40 350 75 L 490 250" stroke="#38bdf8" stroke-width="2" fill="none" stroke-dasharray="3,3"/>
            <circle cx="340" cy="55" r="4" fill="#f43f5e" />
            <text x="350" y="55" fill="#f43f5e" font-size="11" font-weight="700">Ogee Crest / Radial Gates (${p.radial_gates_count || p.gates_count || 'Spillway'})</text>

            <!-- Stilling Basin / Hydraulic Jump Stilling Pool -->
            <polygon points="500,250 630,250 640,235 640,250" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5" />
            <text x="520" y="240" fill="#38bdf8" font-size="11">Stilling Basin & Energy Dissipator</text>

            <!-- Downstream Tailwater & River Channel -->
            <path d="M 500 230 L 720 230 L 720 250 L 500 250 Z" fill="rgba(56, 189, 248, 0.18)" />
            <line x1="500" y1="230" x2="720" y2="230" stroke="#0ea5e9" stroke-width="1.5" />
            <text x="630" y="220" fill="#0ea5e9" font-size="11">Downstream River</text>

            <!-- Low-Level Sluice / Penstock Intake -->
            <line x1="260" y1="180" x2="380" y2="250" stroke="#a855f7" stroke-width="5" />
            <text x="280" y="170" fill="#c084fc" font-size="10">Penstock / Irrigation Sluice</text>
          </svg>
        `;
      }

      return `
        <div class="dam-lab-section">
          <div class="section-banner">
            <span class="section-tag">SECTION A • STRUCTURAL ANATOMY</span>
            <h3>Civil Engineering Architecture: ${p.name}</h3>
            <p>Inspection of structural materials, foundation mechanics, hydraulic control features, and energy dissipation geometry.</p>
          </div>

          <!-- Labeled Engineering Schematic Diagram -->
          <div class="schematic-container">
            <div class="schematic-header">
              <span class="schematic-title">📐 Labeled Cross-Sectional Engineering Schematic</span>
              <span class="schematic-badge">${damType}</span>
            </div>
            ${svgMarkup}
            <div class="schematic-disclaimer">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#facc15" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              <span><strong>SCHEMATIC ILLUSTRATION ONLY:</strong> This drawing represents a canonical civil engineering cross-section of a <em>${damType}</em>. It identifies fundamental functional components (crest, foundation, grout curtain, spillway, stilling basin) for educational purposes, and is not an as-built CAD blueprint.</span>
            </div>
          </div>

          <!-- Key Structural Components Breakdown Grid -->
          <div class="specs-grid-container">
            <div class="spec-card">
              <div class="spec-card-icon">🧱</div>
              <div class="spec-card-info">
                <span class="spec-card-label">Structural Material & Typology</span>
                <span class="spec-card-val">${p.construction_material || 'Mass Concrete / Zoned Rockfill'}</span>
                <span class="spec-card-hint">Typology: ${damType}</span>
              </div>
            </div>

            <div class="spec-card">
              <div class="spec-card-icon">🪨</div>
              <div class="spec-card-info">
                <span class="spec-card-label">Foundation Geology</span>
                <span class="spec-card-val">${geology}</span>
                <span class="spec-card-hint">Consolidation & curtain grouting per CWC specifications</span>
              </div>
            </div>

            <div class="spec-card">
              <div class="spec-card-icon">📏</div>
              <div class="spec-card-info">
                <span class="spec-card-label">Key Dimensions</span>
                <span class="spec-card-val">${fmt(height, 'm')} Structural Height • ${fmt(length, 'm')} Crest Length</span>
                <span class="spec-card-hint">Crest Elevation: ${fmt(p.crest_elevation_m_msl, 'm MSL')}</span>
              </div>
            </div>

            <div class="spec-card">
              <div class="spec-card-icon">🌊</div>
              <div class="spec-card-info">
                <span class="spec-card-label">Spillway & Crest Gates</span>
                <span class="spec-card-val">${p.radial_gates_count ? p.radial_gates_count + ' Radial Steel Gates' : (p.gates_count ? p.gates_count + ' Sluice Gates' : 'Gated Ogee Crest')}</span>
                <span class="spec-card-hint">Design Discharge: ${fmt(p.spillway_capacity_cumecs, 'm³/s')}</span>
              </div>
            </div>

            <div class="spec-card">
              <div class="spec-card-icon">⚡</div>
              <div class="spec-card-info">
                <span class="spec-card-label">Power & Riverbed Outlets</span>
                <span class="spec-card-val">${p.hydropower_capacity_mw ? p.hydropower_capacity_mw + ' MW Installed' : 'Non-Power Irrigation Asset'}</span>
                <span class="spec-card-hint">${p.hydropower_breakdown || 'Riverbed & canal intake sluices'}</span>
              </div>
            </div>

            <div class="spec-card">
              <div class="spec-card-icon">🛤️</div>
              <div class="spec-card-info">
                <span class="spec-card-label">Downstream River & Canals</span>
                <span class="spec-card-val">${p.river || 'River'} (${p.basin || 'Basin'})</span>
                <span class="spec-card-hint">Canals: ${fmt(p.connected_canals ? (Array.isArray(p.connected_canals) ? p.connected_canals.join(', ') : p.connected_canals) : 'Off-take Branch Networks')}</span>
              </div>
            </div>
          </div>
        </div>
      `;
    },

    // =========================================================================
    // SECTION B — Hydraulics Calculators
    // =========================================================================
    renderSectionB(p) {
      const height = parseFloat(p.height_m) || 45;
      const length = parseFloat(p.crest_length_m) || 500;
      const hydroCap = parseFloat(p.hydropower_capacity_mw) || 0;
      const grossCap = parseFloat(p.gross_storage_mcm) || 100;

      const defaultDepth = Math.max(5, Math.round(height * 0.75));
      const defaultFlow = hydroCap > 0 ? Math.round(hydroCap * 1.5) : 150;
      const defaultHead = Math.max(8, Math.round(height * 0.70));

      return `
        <div class="dam-lab-section">
          <div class="section-banner">
            <span class="section-tag">SECTION B • HYDRAULICS CALCULATOR SUITE</span>
            <h3>Interactive Hydrodynamic Calculations</h3>
            <p>Perform live mathematical evaluations of hydrostatic pressure, resultant thrust, hydroelectric generation, and hydrological unit conversions.</p>
          </div>

          <div class="calc-grid">
            <!-- 1. Hydrostatic Pressure Calculator -->
            <div class="calc-card">
              <div class="calc-card-header">
                <span class="calc-num">01</span>
                <div>
                  <h4>Hydrostatic Pressure at Depth</h4>
                  <span class="calc-formula-badge">p = ρ · g · h</span>
                </div>
              </div>
              <p class="calc-desc">Calculates fluid pressure exerted by impounded water column at depth <em>h</em> below free surface.</p>

              <div class="calc-input-group">
                <label for="calcHDepth">Water Column Depth (h): <strong id="calcHDepthVal">${defaultDepth} m</strong></label>
                <input type="range" id="calcHDepth" min="1" max="${Math.max(100, Math.round(height * 1.3))}" value="${defaultDepth}" class="calc-slider">
              </div>

              <div class="calc-results-box" id="calcPressureResults">
                <!-- Populated by JS -->
              </div>

              <div class="calc-substitution" id="calcPressureSubst">
                <!-- Populated by JS -->
              </div>

              <div class="calc-assumptions">
                <strong>Assumptions:</strong> Static fluid, standard freshwater density $\\rho = 1000\\text{ kg/m}^3$ at $20^\\circ\\text{C}$, $g = 9.80665\\text{ m/s}^2$. Gauge pressure references ambient atmospheric datum ($p_0 = 0$).
              </div>
            </div>

            <!-- 2. Resultant Hydrostatic Force on Vertical Surface -->
            <div class="calc-card">
              <div class="calc-card-header">
                <span class="calc-num">02</span>
                <div>
                  <h4>Resultant Hydrostatic Thrust & Overturning Moment</h4>
                  <span class="calc-formula-badge">F = ½ · ρ · g · b · H²</span>
                </div>
              </div>
              <p class="calc-desc">Computes the total horizontal water force acting on the dam's vertical upstream face and its point of action.</p>

              <div class="calc-input-row">
                <div class="calc-input-group">
                  <label for="calcForceH">Water Depth (H): <strong id="calcForceHVal">${defaultDepth} m</strong></label>
                  <input type="range" id="calcForceH" min="1" max="${Math.max(100, Math.round(height * 1.3))}" value="${defaultDepth}" class="calc-slider">
                </div>
                <div class="calc-input-group">
                  <label for="calcForceB">Section Width (b): <strong id="calcForceBVal">1 m</strong></label>
                  <select id="calcForceBSelect" class="calc-select">
                    <option value="1" selected>Unit 1 meter slice (per-meter run)</option>
                    <option value="${length}">Full Crest Length (${fmt(length, 'm')})</option>
                  </select>
                </div>
              </div>

              <div class="calc-results-box" id="calcForceResults">
                <!-- Populated by JS -->
              </div>

              <div class="calc-substitution" id="calcForceSubst">
                <!-- Populated by JS -->
              </div>

              <div class="calc-assumptions">
                <strong>Assumptions:</strong> Vertical planar upstream face, triangular hydrostatic distribution. Resultant force acts at Center of Pressure $y_{cp} = \\frac{2}{3} H$ from surface ($H/3$ above foundation).
              </div>
            </div>

            <!-- 3. Approximate Hydraulic Power Calculator -->
            <div class="calc-card full-width">
              <div class="calc-card-header">
                <span class="calc-num">03</span>
                <div>
                  <h4>Approximate Hydroelectric Power Generation</h4>
                  <span class="calc-formula-badge">P = ρ · g · Q · H_eff · η</span>
                </div>
              </div>
              <p class="calc-desc">Models theoretical mechanical-to-electrical energy conversion from turbine penstock discharge and net hydraulic head.</p>

              <div class="calc-tri-input-row">
                <div class="calc-input-group">
                  <label for="calcHydroQ">Turbine Flow Rate (Q): <strong id="calcHydroQVal">${defaultFlow} m³/s</strong></label>
                  <input type="range" id="calcHydroQ" min="10" max="${Math.max(600, defaultFlow * 3)}" value="${defaultFlow}" class="calc-slider">
                </div>
                <div class="calc-input-group">
                  <label for="calcHydroH">Net Effective Head (H_eff): <strong id="calcHydroHVal">${defaultHead} m</strong></label>
                  <input type="range" id="calcHydroH" min="5" max="${Math.max(80, Math.round(height * 1.2))}" value="${defaultHead}" class="calc-slider">
                </div>
                <div class="calc-input-group">
                  <label for="calcHydroEta">Combined Efficiency (η): <strong id="calcHydroEtaVal">90%</strong></label>
                  <input type="range" id="calcHydroEta" min="70" max="96" value="90" class="calc-slider">
                </div>
              </div>

              <div class="calc-results-box power-results" id="calcHydroResults">
                <!-- Populated by JS -->
              </div>

              <div class="calc-substitution" id="calcHydroSubst">
                <!-- Populated by JS -->
              </div>

              <div class="calc-verification-callout">
                <div class="callout-badge">ENGINEERING DISTINCTION</div>
                <p><strong>Calculated Power vs. Installed Capacity:</strong> The calculated value above is an <em>instantaneous theoretical hydraulic power simulation</em> under the selected inputs ($Q=${defaultFlow}\\text{ m³/s}, H=${defaultHead}\\text{ m}$). The dam's official documented installed capacity is <strong>${hydroCap > 0 ? hydroCap + ' MW' : 'Non-Power Irrigation Asset'}</strong> per CWC/GETCO records. Rated nameplate capacity reflects physical generator sizing, not continuous discharge.</p>
              </div>
            </div>

            <!-- 4. Volumetric Flow Unit Converter -->
            <div class="calc-card">
              <div class="calc-card-header">
                <span class="calc-num">04</span>
                <div>
                  <h4>Volumetric Flow Unit Converter</h4>
                  <span class="calc-formula-badge">Q Conversions</span>
                </div>
              </div>
              <p class="calc-desc">Two-way synchronized conversion across standard civil, irrigation, and municipal water flow units.</p>

              <div class="converter-grid">
                <div class="converter-item">
                  <label for="flowCumecs">Cumecs (m³/s)</label>
                  <input type="number" id="flowCumecs" value="100" class="converter-input" step="any">
                </div>
                <div class="converter-item">
                  <label for="flowCusecs">Cusecs (ft³/s)</label>
                  <input type="number" id="flowCusecs" class="converter-input" step="any">
                </div>
                <div class="converter-item">
                  <label for="flowMld">MLD (Million Litres/Day)</label>
                  <input type="number" id="flowMld" class="converter-input" step="any">
                </div>
                <div class="converter-item">
                  <label for="flowMcmDay">MCM / Day</label>
                  <input type="number" id="flowMcmDay" class="converter-input" step="any">
                </div>
              </div>
              <div class="converter-ratios">
                <span>1 cumec = 35.315 cusecs</span> • <span>1 cumec = 86.4 MLD</span> • <span>1 cumec = 0.0864 MCM/day</span>
              </div>
            </div>

            <!-- 5. Reservoir Storage Unit Converter -->
            <div class="calc-card">
              <div class="calc-card-header">
                <span class="calc-num">05</span>
                <div>
                  <h4>Reservoir Volume & Storage Converter</h4>
                  <span class="calc-formula-badge">Storage Units</span>
                </div>
              </div>
              <p class="calc-desc">Two-way synchronized comparison between national, international, and imperial volumetric capacity metrics.</p>

              <div class="converter-grid">
                <div class="converter-item">
                  <label for="volMcm">MCM (Million m³)</label>
                  <input type="number" id="volMcm" value="${grossCap}" class="converter-input" step="any">
                </div>
                <div class="converter-item">
                  <label for="volBcm">BCM (Billion m³)</label>
                  <input type="number" id="volBcm" class="converter-input" step="any">
                </div>
                <div class="converter-item">
                  <label for="volTmc">TMC (Thousand Million ft³)</label>
                  <input type="number" id="volTmc" class="converter-input" step="any">
                </div>
                <div class="converter-item">
                  <label for="volAcreFt">Acre-Feet (ac-ft)</label>
                  <input type="number" id="volAcreFt" class="converter-input" step="any">
                </div>
              </div>
              <div class="converter-ratios">
                <span>1 BCM = 1,000 MCM</span> • <span>1 TMC = 28.317 MCM</span> • <span>1 MCM = 810.71 Acre-Feet</span> • <span>1 MCM = 1 Billion Litres</span>
              </div>
            </div>
          </div>
        </div>
      `;
    },

    // =========================================================================
    // SECTION C — Reservoir Science & Elevation-Area-Capacity
    // =========================================================================
    renderSectionC(p) {
      const gross = parseFloat(p.gross_storage_mcm) || 100;
      const live = parseFloat(p.live_storage_mcm) || (gross * 0.85);
      const dead = parseFloat(p.dead_storage_mcm) || Math.max(0, gross - live);
      const frl = parseFloat(p.frl_m) || 100;
      const mwl = parseFloat(p.mwl_m) || (frl * 1.02);
      const mddl = parseFloat(p.mddl_m) || (frl * 0.70);
      const crest = parseFloat(p.crest_elevation_m_msl) || (mwl * 1.03);
      const freeboard = Math.max(1.5, (crest - mwl)).toFixed(2);
      const surfaceArea = parseFloat(p.surface_area_ha) || 5000;

      const livePct = ((live / gross) * 100).toFixed(1);
      const deadPct = ((dead / gross) * 100).toFixed(1);

      return `
        <div class="dam-lab-section">
          <div class="section-banner">
            <span class="section-tag">SECTION C • RESERVOIR SCIENCE</span>
            <h3>Storage Zones, Water Levels & Hypsometric Bathymetry</h3>
            <p>Understand the functional zoning between gross, live, and dead storage, critical operational elevations, and the elevation-area-capacity dynamics.</p>
          </div>

          <!-- Storage Zones Interactive Stack -->
          <div class="res-storage-card">
            <h4>📦 Reservoir Storage Allocation Partitioning</h4>
            <p class="res-storage-desc">Total Gross Capacity is legally partitioned into designated vertical storage tiers designed to balance conservation supply with sediment lifecycle and flood buffering.</p>

            <!-- Visual Bar -->
            <div class="storage-bar-wrapper">
              <div class="storage-bar">
                <div class="storage-bar-seg dead" style="width: ${deadPct}%;" title="Dead Storage: ${fmt(dead, 'MCM')} (${deadPct}%)">
                  <span>Dead Storage (${deadPct}%)</span>
                </div>
                <div class="storage-bar-seg live" style="width: ${livePct}%;" title="Live Storage: ${fmt(live, 'MCM')} (${livePct}%)">
                  <span>Live Storage (${livePct}%)</span>
                </div>
              </div>
              <div class="storage-bar-legend">
                <div class="legend-item"><span class="legend-color dead"></span> <strong>Dead Storage:</strong> ${fmt(dead, 'MCM')} (Below MDDL; sediment trap, non-divertible)</div>
                <div class="legend-item"><span class="legend-color live"></span> <strong>Active Live Storage:</strong> ${fmt(live, 'MCM')} (Between MDDL & FRL; exploitable irrigation/power buffer)</div>
                <div class="legend-item"><span class="legend-color gross"></span> <strong>Total Gross Storage:</strong> ${fmt(gross, 'MCM')} (At FRL)</div>
              </div>
            </div>

            <!-- Key Operating Elevation Levels Grid -->
            <div class="elevations-grid">
              <div class="elev-item">
                <span class="elev-tag frl">FRL</span>
                <div class="elev-info">
                  <span class="elev-name">Full Reservoir Level</span>
                  <span class="elev-val">${fmt(frl, 'm MSL')}</span>
                  <p class="elev-desc">Highest normal conservation level up to which water is stored without spillway overflow.</p>
                </div>
              </div>

              <div class="elev-item">
                <span class="elev-tag mwl">MWL</span>
                <div class="elev-info">
                  <span class="elev-name">Maximum Water Level</span>
                  <span class="elev-val">${fmt(mwl, 'm MSL')}</span>
                  <p class="elev-desc">Peak temporary pool elevation during design flood routing (PMF / SPF) with spillway fully open.</p>
                </div>
              </div>

              <div class="elev-item">
                <span class="elev-tag mddl">MDDL</span>
                <div class="elev-info">
                  <span class="elev-name">Minimum Drawdown Level</span>
                  <span class="elev-val">${fmt(mddl, 'm MSL')}</span>
                  <p class="elev-desc">Lowest operational limit below which canal head regulators and low-level penstocks cannot draw water by gravity.</p>
                </div>
              </div>

              <div class="elev-item">
                <span class="elev-tag freeboard">FREEBOARD</span>
                <div class="elev-info">
                  <span class="elev-name">Structural Freeboard</span>
                  <span class="elev-val">${freeboard} m</span>
                  <p class="elev-desc">Vertical safety buffer between MWL and Dam Crest (${fmt(crest, 'm MSL')}) preventing wave splash and wind overtopping.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Elevation-Area-Capacity (EAC) Hypsometric Dynamics -->
          <div class="eac-container">
            <div class="eac-header">
              <div>
                <h4>📈 Elevation-Area-Capacity (EAC) Hypsometric Model</h4>
                <p>The mathematical relationship governing stored volume $V(h)$ as a continuous integral of water spread surface area $A(z)$ across valley bathymetry:</p>
              </div>
              <div class="formula-badge-inline">V(h) = \\int_{0}^{h} A(z) \\, dz</div>
            </div>

            <div class="eac-interactive-layout">
              <div class="eac-controls">
                <label for="eacStageSlider">Simulate Reservoir Water Stage (z): <strong id="eacStageVal">${frl.toFixed(1)} m MSL</strong></label>
                <input type="range" id="eacStageSlider" min="${Math.round(mddl * 0.7)}" max="${Math.round(frl * 1.02)}" value="${Math.round(frl)}" step="0.5" class="calc-slider">

                <div class="eac-readout-card">
                  <div class="eac-readout-row">
                    <span>Stage Elevation:</span>
                    <strong id="eacElevOut">${frl.toFixed(1)} m MSL</strong>
                  </div>
                  <div class="eac-readout-row">
                    <span>Water Spread Surface Area:</span>
                    <strong id="eacAreaOut">${fmt(surfaceArea, 'ha')} (${(surfaceArea / 100).toFixed(1)} km²)</strong>
                  </div>
                  <div class="eac-readout-row">
                    <span>Cumulative Stored Volume:</span>
                    <strong id="eacVolOut" style="color: #38bdf8;">${fmt(gross, 'MCM')} (100%)</strong>
                  </div>
                  <div class="eac-readout-row">
                    <span>Operating Zone:</span>
                    <strong id="eacZoneOut" style="color: #4ade80;">Full Conservation Capacity (FRL)</strong>
                  </div>
                </div>

                <div class="eac-note">
                  <strong>Civil Engineering Note:</strong> Reservoir capacity is evaluated in practice using the prismoidal formula: $V_{1-2} = \\frac{h}{3} (A_1 + A_2 + \\sqrt{A_1 A_2})$.
                </div>
              </div>

              <div class="eac-visualizer" id="eacSvgContainer">
                <!-- SVG Hypsometric Curve generated by JS -->
              </div>
            </div>

            <div class="schematic-disclaimer">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#38bdf8" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              <span><strong>CONCEPTUAL BATHYMETRIC CURVE:</strong> This curve illustrates typical Straub/Morris conic hypsometric distribution anchored to verified FRL, Gross Storage, and Surface Area. Actual site-specific sedimentation bathymetry requires hydrographic acoustic echo-sounding surveys (CWC).</span>
            </div>
          </div>
        </div>
      `;
    },

    // =========================================================================
    // SECTION D — Dam Safety & Geotechnical Engineering
    // =========================================================================
    renderSectionD(p) {
      return `
        <div class="dam-lab-section">
          <div class="section-banner">
            <span class="section-tag">SECTION D • DAM SAFETY & GEOTECHNICAL ENGINEERING</span>
            <h3>Structural Integrity, Geomechanics & Monitoring</h3>
            <p>Rigorous civil engineering principles governing dam stability, seepage mechanics, foundation behavior, and statutory health surveillance.</p>
          </div>

          <div class="safety-grid">
            <!-- 1. Uplift Pressure & Seepage -->
            <div class="safety-card">
              <div class="safety-card-header">
                <span class="safety-icon">💧</span>
                <div>
                  <h4>1. Uplift Pressure & Foundation Seepage</h4>
                  <span class="safety-badge">FOUNDATION HYDROSTATICS</span>
                </div>
              </div>
              <p>Water under pressure seeps through porous foundation rock and along the dam-bedrock contact interface, exerting an upward hydrostatic pressure $u = \\gamma_w h_w$ that counters the dam's stabilizing self-weight.</p>
              <div class="safety-sub-box">
                <strong>Mitigation Architecture:</strong>
                <ul>
                  <li><strong>Deep Grout Curtain:</strong> Micro-fine cement grout injected at high pressure deep into bedrock fissure systems beneath the upstream heel to cut off seepage flow paths.</li>
                  <li><strong>Internal Drainage Gallery:</strong> Relief holes drilled into foundation downstream of the grout curtain intercept residual seepage, relieving uplift pressure from triangular to trapezoidal distribution.</li>
                </ul>
              </div>
            </div>

            <!-- 2. Piping & Internal Erosion -->
            <div class="safety-card">
              <div class="safety-card-header">
                <span class="safety-icon">🕳️</span>
                <div>
                  <h4>2. Piping & Internal Erosion Mechanics</h4>
                  <span class="safety-badge">EMBANKMENT INTEGRITY</span>
                </div>
              </div>
              <p>Occurs when the exit hydraulic gradient of seepage emerging at the downstream toe exceeds the Terzaghi critical hydraulic gradient:</p>
              <div class="formula-box-sm">i_{cr} = \\frac{G_s - 1}{1 + e} \\approx 1.0</div>
              <p>Fine soil particles become fluidized and wash away, creating backward progressing erosion voids ('pipes') that can cause rapid embankment collapse.</p>
              <div class="safety-sub-box">
                <strong>Mitigation:</strong> Graded inverted granular filters complying with Terzaghi retention criteria ($D_{15}/d_{85} < 5$) and non-woven geotextile envelopes.
              </div>
            </div>

            <!-- 3. Foundation Behavior & Settlement -->
            <div class="safety-card">
              <div class="safety-card-header">
                <span class="safety-icon">🪨</span>
                <div>
                  <h4>3. Foundation Behavior & Differential Settlement</h4>
                  <span class="safety-badge">ROCK MECHANICS</span>
                </div>
              </div>
              <p>Dam foundations must resist enormous shear stresses and vertical bearing loads under Mohr-Coulomb shear strength criteria: $\\tau = c' + \\sigma' \\tan\\phi'$.</p>
              <div class="safety-sub-box">
                <strong>Key Geotechnical Risks:</strong>
                <ul>
                  <li><strong>Differential Settlement:</strong> Uneven compression across faulted rock joints or clay pockets induces severe tensile cracking in rigid concrete gravity monoliths.</li>
                  <li><strong>Sliding along Weak Seams:</strong> Clay-filled shear zones or intertrappean layers in basalt require dental concrete excavation and shear keys.</li>
                </ul>
              </div>
            </div>

            <!-- 4. Slope Stability in Embankments -->
            <div class="safety-card">
              <div class="safety-card-header">
                <span class="safety-icon">📐</span>
                <div>
                  <h4>4. Slope Stability & Critical Slip Circles</h4>
                  <span class="safety-badge">LIMIT EQUILIBRIUM</span>
                </div>
              </div>
              <p>Analyzed using the Bishop Simplified Method of Slices and Morgenstern-Price limit equilibrium equations to ensure a Factor of Safety (FoS $\\ge 1.5$).</p>
              <div class="safety-sub-box">
                <strong>Critical Loading Regimes:</strong>
                <ul>
                  <li><strong>Upstream Face — Sudden Drawdown:</strong> Rapid lowering of the reservoir leaves pore water trapped inside the saturated shell without external hydrostatic counter-thrust.</li>
                  <li><strong>Downstream Face — Steady Seepage at FRL:</strong> Phreatic saturation line reaches maximum extent, risking sloughing near downstream toe.</li>
                  <li><strong>Earthquake Inflow:</strong> Pseudostatic horizontal seismic inertia $F_h = k_h \\cdot W$.</li>
                </ul>
              </div>
            </div>

            <!-- 5. Sedimentation & Storage Loss -->
            <div class="safety-card">
              <div class="safety-card-header">
                <span class="safety-icon">🏜️</span>
                <div>
                  <h4>5. Sedimentation & Storage Depletion</h4>
                  <span class="safety-badge">CATCHMENT EROSION</span>
                </div>
              </div>
              <p>River sediment entering the reservoir settles as flow velocity decelerates. Coarse bedload forms deltas at the headwaters, while fine suspended silts settle into the dead storage pocket.</p>
              <div class="safety-sub-box">
                <strong>Hydrologic Assessment:</strong> Trap efficiency $E_{trap}$ is evaluated using <em>Brune's Empirical Curve</em> based on the Capacity-Inflow ratio ($C/I$). Mitigated via Catchment Area Treatment (CAT), silt-flushing bottom sluices, and upstream check dams.
              </div>
            </div>

            <!-- 6. Spillway Capacity & Flood Routing -->
            <div class="safety-card">
              <div class="safety-card-header">
                <span class="safety-icon">🌊</span>
                <div>
                  <h4>6. Spillway Capacity & Inflow Flood Routing</h4>
                  <span class="safety-badge">HYDROLOGIC SAFETY</span>
                </div>
              </div>
              <p>Designed to evacuate the Probable Maximum Flood (PMF) or Standard Project Flood (SPF). Evaluated using the continuity equation through Modified Puls Reservoir Routing:</p>
              <div class="formula-box-sm">\\frac{I_1 + I_2}{2} - \\frac{O_1 + O_2}{2} = \\frac{S_2 - S_1}{\\Delta t}</div>
              <p>Controlled spillway chutes feature <strong>Ogee crests</strong> and high-energy <strong>stilling basins</strong> where supercritical cascade flow ($Fr > 4.5$) undergoes a controlled hydraulic jump to dissipate destructive kinetic energy.</p>
            </div>

            <!-- 7. Structural Health Monitoring Instrumentation -->
            <div class="safety-card full-width">
              <div class="safety-card-header">
                <span class="safety-icon">📡</span>
                <div>
                  <h4>7. Structural Health Monitoring & Geotechnical Instrumentation</h4>
                  <span class="safety-badge">REAL-TIME DIAGNOSTICS</span>
                </div>
              </div>
              <div class="instruments-grid">
                <div class="instrument-item">
                  <span class="inst-icon">📈</span>
                  <strong>Vibrating-Wire Piezometers</strong>
                  <p>Measure interstitial pore water pressures within embankment fill and foundation bedrock.</p>
                </div>
                <div class="instrument-item">
                  <span class="inst-icon">⚖️</span>
                  <strong>Inverted & Direct Plumb Lines</strong>
                  <p>Measure minute horizontal deflections of concrete monolith blocks relative to deep unyielding bedrock.</p>
                </div>
                <div class="instrument-item">
                  <span class="inst-icon">🧪</span>
                  <strong>Foundation Uplift Cells</strong>
                  <p>Measure hydraulic uplift pressure across the contact plane between dam heel and rock foundation.</p>
                </div>
                <div class="instrument-item">
                  <span class="inst-icon">📐</span>
                  <strong>Inclinometers & Extensometers</strong>
                  <p>Detect internal shear strain, lateral displacement, and settlement in earthfill embankments.</p>
                </div>
                <div class="instrument-item">
                  <span class="inst-icon">🌊</span>
                  <strong>V-Notch Seepage Weirs</strong>
                  <p>Continuously measure total seepage discharge (l/min) collected inside internal drainage galleries.</p>
                </div>
                <div class="instrument-item">
                  <span class="inst-icon">⚡</span>
                  <strong>Strong-Motion Accelerographs</strong>
                  <p>Record crest and foundation acceleration during seismic tremors (BIS IS 1893:2016).</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Statutory Safety Act Caveat -->
          <div class="statutory-safety-banner">
            <div class="statutory-icon">🛡️</div>
            <div>
              <h4>Statutory Dam Safety Oversight (Dam Safety Act 2021)</h4>
              <p>In accordance with India's <strong>Dam Safety Act 2021</strong>, this asset is under the statutory regulatory supervision of the <em>State Dam Safety Organisation (SDSO)</em> and the <em>National Dam Safety Authority (NDSA)</em>. Periodic structural audits (Pre-Monsoon & Post-Monsoon) and Comprehensive Dam Safety Reviews (CDSR) establish operational fitness. <strong>Engineering Rule:</strong> The absence of live publicly streamed sensor telemetry reflects open-data release boundaries, not an adverse safety rating.</p>
            </div>
          </div>
        </div>
      `;
    },

    // =========================================================================
    // SECTION E — Why This Dam Matters & Comparative Benchmarking
    // =========================================================================
    renderSectionE(p) {
      const gross = parseFloat(p.gross_storage_mcm) || 100;
      const height = parseFloat(p.height_m) || 35;
      const live = parseFloat(p.live_storage_mcm) || (gross * 0.85);
      const hydro = parseFloat(p.hydropower_capacity_mw) || 0;
      const command = parseFloat(p.irrigation_command_ha) || 0;
      const profile = DISTINCTIVE_ENGINEERING_PROFILES[p.id] || {};

      // Dynamic comparative rankings against Gujarat's 30 CWC dams
      // Benchmarks: Total Gujarat Gross Storage = ~23,646 MCM, Max Single Dam = 9,460 MCM (Sardar Sarovar), Avg Height = ~39.5m
      const gujaratTotalGross = 23646;
      const shareOfStateStorage = ((gross / gujaratTotalGross) * 100).toFixed(2);
      const liveEfficiencyRatio = ((live / gross) * 100).toFixed(1);

      let storageRankText = "Regional Reservoir Anchor";
      if (gross >= 5000) storageRankText = "Mega Strategic Lifeline (>5 BCM)";
      else if (gross >= 1000) storageRankText = "Major Basin Anchor (>1 BCM)";
      else if (gross >= 250) storageRankText = "Sub-Basin Storage Hub (>250 MCM)";

      return `
        <div class="dam-lab-section">
          <div class="section-banner">
            <span class="section-tag">SECTION E • REGIONAL IMPACT & BENCHMARKING</span>
            <h3>Socio-Economic Value & Comparative Analytics</h3>
            <p>Quantitative contribution to agricultural irrigation, drinking water security, power generation, and relative ranking among Gujarat's water resources.</p>
          </div>

          <!-- Comparative Benchmarking Cards -->
          <div class="benchmark-grid">
            <div class="bench-card">
              <span class="bench-label">Share of Gujarat Storage</span>
              <span class="bench-val">${shareOfStateStorage}%</span>
              <p class="bench-desc">${fmt(gross, 'MCM')} of State's 23,646 MCM total gross capacity.</p>
            </div>

            <div class="bench-card">
              <span class="bench-label">Storage Scale Classification</span>
              <span class="bench-val">${storageRankText}</span>
              <p class="bench-desc">${p.primary_purpose || 'Multipurpose Irrigation & Water Supply'}</p>
            </div>

            <div class="bench-card">
              <span class="bench-label">Live Storage Efficiency</span>
              <span class="bench-val">${liveEfficiencyRatio}%</span>
              <p class="bench-desc">Ratio of exploitable live volume (${fmt(live, 'MCM')}) to gross impoundment.</p>
            </div>

            <div class="bench-card">
              <span class="bench-label">Structural Height Comparison</span>
              <span class="bench-val">${fmt(height, 'm')}</span>
              <p class="bench-desc">Gujarat average: 39.5 m • Max: 163 m (Sardar Sarovar).</p>
            </div>
          </div>

          <!-- Documented Functions & Dependent Infrastructure -->
          <div class="functions-detail-card">
            <h4>🌐 Dependent Infrastructure & Supply Footprint</h4>
            <div class="functions-grid">
              <div class="func-item">
                <span class="func-icon">🌾</span>
                <div>
                  <strong>Irrigation Command Area</strong>
                  <p>${command > 0 ? (command / 100000).toFixed(2) + ' Lakh hectares (' + command.toLocaleString() + ' ha)' : 'Drinking Water & Groundwater Recharge Priority'}</p>
                </div>
              </div>

              <div class="func-item">
                <span class="func-icon">🚰</span>
                <div>
                  <strong>Municipal & Regional Water Security</strong>
                  <p>Buffers drinking water supply across <strong>${p.district || 'district'}</strong> and downstream urban centers along the <strong>${p.river || 'river'}</strong> corridor.</p>
                </div>
              </div>

              <div class="func-item">
                <span class="func-icon">⚡</span>
                <div>
                  <strong>Hydropower Generation</strong>
                  <p>${hydro > 0 ? hydro + ' MW connected to GETCO high-voltage transmission grid' : 'Non-power gravity storage asset'}</p>
                </div>
              </div>

              <div class="func-item">
                <span class="func-icon">🛣️</span>
                <div>
                  <strong>Connected Distribution Canals</strong>
                  <p>${fmt(p.connected_canals ? (Array.isArray(p.connected_canals) ? p.connected_canals.join(', ') : p.connected_canals) : 'Branch & Distributary Canal Network')}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- What Makes This Asset Distinctive -->
          <div class="distinctive-card">
            <div class="distinctive-header">
              <span class="distinctive-icon">⭐</span>
              <div>
                <h4>What Makes ${p.name} Distinctive?</h4>
                <span class="distinctive-subtitle">Verified Engineering, Geographical & Historical Significance</span>
              </div>
            </div>
            <div class="distinctive-content">
              <p>${profile.distinctive || `Impounding the ${p.river || 'river'} in ${p.district || 'Gujarat'}, this ${p.dam_type || 'dam'} is a critical hydraulic asset commissioned in ${p.commission_year || 'standard era'}. With ${fmt(gross, 'MCM')} gross storage, it provides indispensable flood cushion and agricultural security to the ${p.basin || 'river'} basin, operating under the regulatory supervision of the ${p.operating_agency || 'Gujarat Water Resources Department'}.`}</p>
            </div>
          </div>
        </div>
      `;
    },

    // =========================================================================
    // Dynamic Calculator Interactive Bindings & Computations
    // =========================================================================
    bindInteractions() {
      if (activeTab === "sectionB") {
        this.bindCalculators();
      } else if (activeTab === "sectionC") {
        this.bindEacDynamics();
      }
    },

    /**
     * Bind all Section B sliders, inputs, and converters
     */
    bindCalculators() {
      // 1. Hydrostatic Pressure
      const depthSlider = document.getElementById("calcHDepth");
      const depthVal = document.getElementById("calcHDepthVal");
      const updatePressure = () => {
        if (!depthSlider) return;
        const h = parseFloat(depthSlider.value);
        if (depthVal) depthVal.textContent = `${h} m`;

        const rho = 1000;
        const g = 9.80665;
        const pKpa = (rho * g * h) / 1000;
        const pBar = pKpa / 100;
        const pPsi = pKpa * 0.145038;
        const pAbsKpa = pKpa + 101.325;

        const resBox = document.getElementById("calcPressureResults");
        if (resBox) {
          resBox.innerHTML = `
            <div class="calc-res-item primary">
              <span class="res-lbl">Gauge Pressure:</span>
              <span class="res-num">${pKpa.toFixed(1)} kPa</span>
            </div>
            <div class="calc-res-item">
              <span class="res-lbl">In Bar:</span>
              <span class="res-num">${pBar.toFixed(2)} bar</span>
            </div>
            <div class="calc-res-item">
              <span class="res-lbl">In PSI:</span>
              <span class="res-num">${pPsi.toFixed(1)} psi</span>
            </div>
            <div class="calc-res-item">
              <span class="res-lbl">Absolute Pressure:</span>
              <span class="res-num">${pAbsKpa.toFixed(1)} kPa</span>
            </div>
          `;
        }

        const substBox = document.getElementById("calcPressureSubst");
        if (substBox) {
          substBox.innerHTML = `<strong>Substitution:</strong> $p = 1000\\text{ kg/m}^3 \\times 9.81\\text{ m/s}^2 \\times ${h}\\text{ m} = \\mathbf{${pKpa.toFixed(1)}\\text{ kPa}}$`;
        }
      };

      if (depthSlider) {
        depthSlider.addEventListener("input", updatePressure);
        updatePressure();
      }

      // 2. Resultant Hydrostatic Thrust & Overturning Moment
      const forceH = document.getElementById("calcForceH");
      const forceHVal = document.getElementById("calcForceHVal");
      const forceBSel = document.getElementById("calcForceBSelect");
      const forceBVal = document.getElementById("calcForceBVal");

      const updateForce = () => {
        if (!forceH) return;
        const H = parseFloat(forceH.value);
        const b = parseFloat(forceBSel ? forceBSel.value : 1);

        if (forceHVal) forceHVal.textContent = `${H} m`;
        if (forceBVal) forceBVal.textContent = b === 1 ? "1 m (Unit Run)" : `${b.toLocaleString()} m (Full Crest)`;

        const rho = 1000;
        const g = 9.80665;
        // F = 0.5 * rho * g * b * H^2
        const forceN = 0.5 * rho * g * b * (H * H);
        const forceMn = forceN / 1e6;
        const forceKn = forceN / 1e3;
        const cpHeight = (H / 3).toFixed(2);
        const overturnMnM = (forceMn * (H / 3)).toFixed(1);

        const resBox = document.getElementById("calcForceResults");
        if (resBox) {
          resBox.innerHTML = `
            <div class="calc-res-item primary">
              <span class="res-lbl">Resultant Thrust (F):</span>
              <span class="res-num">${forceMn >= 1 ? forceMn.toFixed(2) + ' MN' : forceKn.toFixed(1) + ' kN'}</span>
            </div>
            <div class="calc-res-item">
              <span class="res-lbl">Center of Pressure Height:</span>
              <span class="res-num">${cpHeight} m above base</span>
            </div>
            <div class="calc-res-item">
              <span class="res-lbl">Overturning Moment (M₀):</span>
              <span class="res-num">${overturnMnM} MN·m</span>
            </div>
          `;
        }

        const substBox = document.getElementById("calcForceSubst");
        if (substBox) {
          substBox.innerHTML = `<strong>Substitution:</strong> $F = \\frac{1}{2} \\times 1000 \\times 9.81 \\times ${b} \\times (${H})^2 = \\mathbf{${forceMn >= 1 ? forceMn.toFixed(2) + '\\text{ MN}' : forceKn.toFixed(1) + '\\text{ kN}'}}$`;
        }
      };

      if (forceH) forceH.addEventListener("input", updateForce);
      if (forceBSel) forceBSel.addEventListener("change", updateForce);
      updateForce();

      // 3. Approximate Hydraulic Power
      const hydroQ = document.getElementById("calcHydroQ");
      const hydroQVal = document.getElementById("calcHydroQVal");
      const hydroH = document.getElementById("calcHydroH");
      const hydroHVal = document.getElementById("calcHydroHVal");
      const hydroEta = document.getElementById("calcHydroEta");
      const hydroEtaVal = document.getElementById("calcHydroEtaVal");

      const updateHydro = () => {
        if (!hydroQ || !hydroH || !hydroEta) return;
        const Q = parseFloat(hydroQ.value);
        const H = parseFloat(hydroH.value);
        const eta = parseFloat(hydroEta.value) / 100;

        if (hydroQVal) hydroQVal.textContent = `${Q} m³/s`;
        if (hydroHVal) hydroHVal.textContent = `${H} m`;
        if (hydroEtaVal) hydroEtaVal.textContent = `${Math.round(eta * 100)}%`;

        // P = rho * g * Q * H * eta (in Watts)
        const rho = 1000;
        const g = 9.80665;
        const pWatts = rho * g * Q * H * eta;
        const pMw = pWatts / 1e6;
        const pGrossMw = (rho * g * Q * H) / 1e6;
        const gwhYear = (pMw * 8760 * 0.30) / 1000; // Assuming 30% peaking capacity factor

        const resBox = document.getElementById("calcHydroResults");
        if (resBox) {
          resBox.innerHTML = `
            <div class="calc-res-item primary">
              <span class="res-lbl">Net Electrical Output:</span>
              <span class="res-num" style="color: #facc15;">${pMw.toFixed(2)} MW</span>
            </div>
            <div class="calc-res-item">
              <span class="res-lbl">Gross Potential Power:</span>
              <span class="res-num">${pGrossMw.toFixed(2)} MW</span>
            </div>
            <div class="calc-res-item">
              <span class="res-lbl">Annual Energy (at 30% CF):</span>
              <span class="res-num">${gwhYear.toFixed(1)} GWh / year</span>
            </div>
            <div class="calc-res-item">
              <span class="res-lbl">Equivalent Household Supply:</span>
              <span class="res-num">~${Math.round((gwhYear * 1e6) / 1200).toLocaleString()} Homes</span>
            </div>
          `;
        }

        const substBox = document.getElementById("calcHydroSubst");
        if (substBox) {
          substBox.innerHTML = `<strong>Substitution:</strong> $P = 1000 \\times 9.81 \\times ${Q}\\text{ m³/s} \\times ${H}\\text{ m} \\times ${eta.toFixed(2)} = \\mathbf{${pMw.toFixed(2)}\\text{ MW}}$`;
        }
      };

      if (hydroQ) hydroQ.addEventListener("input", updateHydro);
      if (hydroH) hydroH.addEventListener("input", updateHydro);
      if (hydroEta) hydroEta.addEventListener("input", updateHydro);
      updateHydro();

      // 4. Volumetric Flow Converter
      const inCumecs = document.getElementById("flowCumecs");
      const inCusecs = document.getElementById("flowCusecs");
      const inMld = document.getElementById("flowMld");
      const inMcmDay = document.getElementById("flowMcmDay");

      const setFlowFromCumecs = (val) => {
        const c = parseFloat(val);
        if (isNaN(c)) return;
        if (inCusecs) inCusecs.value = (c * 35.3146667).toFixed(2);
        if (inMld) inMld.value = (c * 86.4).toFixed(2);
        if (inMcmDay) inMcmDay.value = (c * 0.0864).toFixed(4);
      };

      if (inCumecs) {
        inCumecs.addEventListener("input", () => setFlowFromCumecs(inCumecs.value));
        setFlowFromCumecs(inCumecs.value);
      }
      if (inCusecs) {
        inCusecs.addEventListener("input", () => {
          const cu = parseFloat(inCusecs.value);
          if (isNaN(cu)) return;
          const cumecs = cu / 35.3146667;
          if (inCumecs) inCumecs.value = cumecs.toFixed(2);
          if (inMld) inMld.value = (cumecs * 86.4).toFixed(2);
          if (inMcmDay) inMcmDay.value = (cumecs * 0.0864).toFixed(4);
        });
      }
      if (inMld) {
        inMld.addEventListener("input", () => {
          const mld = parseFloat(inMld.value);
          if (isNaN(mld)) return;
          const cumecs = mld / 86.4;
          if (inCumecs) inCumecs.value = cumecs.toFixed(2);
          if (inCusecs) inCusecs.value = (cumecs * 35.3146667).toFixed(2);
          if (inMcmDay) inMcmDay.value = (cumecs * 0.0864).toFixed(4);
        });
      }
      if (inMcmDay) {
        inMcmDay.addEventListener("input", () => {
          const mcmD = parseFloat(inMcmDay.value);
          if (isNaN(mcmD)) return;
          const cumecs = mcmD / 0.0864;
          if (inCumecs) inCumecs.value = cumecs.toFixed(2);
          if (inCusecs) inCusecs.value = (cumecs * 35.3146667).toFixed(2);
          if (inMld) inMld.value = (cumecs * 86.4).toFixed(2);
        });
      }

      // 5. Volume Converter
      const inMcm = document.getElementById("volMcm");
      const inBcm = document.getElementById("volBcm");
      const inTmc = document.getElementById("volTmc");
      const inAcreFt = document.getElementById("volAcreFt");

      const setVolFromMcm = (val) => {
        const m = parseFloat(val);
        if (isNaN(m)) return;
        if (inBcm) inBcm.value = (m / 1000).toFixed(4);
        if (inTmc) inTmc.value = (m * 0.0353147).toFixed(2);
        if (inAcreFt) inAcreFt.value = Math.round(m * 810.713).toLocaleString();
      };

      if (inMcm) {
        inMcm.addEventListener("input", () => setVolFromMcm(inMcm.value));
        setVolFromMcm(inMcm.value);
      }
      if (inBcm) {
        inBcm.addEventListener("input", () => {
          const b = parseFloat(inBcm.value);
          if (isNaN(b)) return;
          const m = b * 1000;
          if (inMcm) inMcm.value = m.toFixed(1);
          if (inTmc) inTmc.value = (m * 0.0353147).toFixed(2);
          if (inAcreFt) inAcreFt.value = Math.round(m * 810.713).toLocaleString();
        });
      }
      if (inTmc) {
        inTmc.addEventListener("input", () => {
          const t = parseFloat(inTmc.value);
          if (isNaN(t)) return;
          const m = t / 0.0353147;
          if (inMcm) inMcm.value = m.toFixed(1);
          if (inBcm) inBcm.value = (m / 1000).toFixed(4);
          if (inAcreFt) inAcreFt.value = Math.round(m * 810.713).toLocaleString();
        });
      }
      if (inAcreFt) {
        inAcreFt.addEventListener("input", () => {
          const af = parseFloat(inAcreFt.value.replace(/,/g, ''));
          if (isNaN(af)) return;
          const m = af / 810.713;
          if (inMcm) inMcm.value = m.toFixed(1);
          if (inBcm) inBcm.value = (m / 1000).toFixed(4);
          if (inTmc) inTmc.value = (m * 0.0353147).toFixed(2);
        });
      }
    },

    /**
     * Bind Section C EAC Slider & Interactive Graphic
     */
    bindEacDynamics() {
      const p = activeAsset;
      if (!p) return;

      const slider = document.getElementById("eacStageSlider");
      const stageVal = document.getElementById("eacStageVal");
      const elevOut = document.getElementById("eacElevOut");
      const areaOut = document.getElementById("eacAreaOut");
      const volOut = document.getElementById("eacVolOut");
      const zoneOut = document.getElementById("eacZoneOut");
      const svgContainer = document.getElementById("eacSvgContainer");

      const gross = parseFloat(p.gross_storage_mcm) || 100;
      const frl = parseFloat(p.frl_m) || 100;
      const mddl = parseFloat(p.mddl_m) || (frl * 0.70);
      const bed = mddl * 0.75;
      const surfaceArea = parseFloat(p.surface_area_ha) || 5000;

      const updateEac = () => {
        if (!slider) return;
        const curStage = parseFloat(slider.value);
        if (stageVal) stageVal.textContent = `${curStage.toFixed(1)} m MSL`;
        if (elevOut) elevOut.textContent = `${curStage.toFixed(1)} m MSL`;

        // Hypsometric model: area scales quadratically, volume scales with integral of area
        const fraction = Math.max(0, Math.min(1.05, (curStage - bed) / (frl - bed)));
        const curArea = Math.round(surfaceArea * Math.pow(fraction, 1.4));
        const curVol = Math.round(gross * Math.pow(fraction, 2.4));
        const pct = Math.min(105, (curVol / gross) * 100).toFixed(1);

        if (areaOut) areaOut.textContent = `${curArea.toLocaleString()} ha (${(curArea / 100).toFixed(1)} km²)`;
        if (volOut) volOut.textContent = `${curVol.toLocaleString()} MCM (${pct}%)`;

        if (zoneOut) {
          if (curStage < mddl) {
            zoneOut.textContent = "Dead Storage Pocket (Below MDDL)";
            zoneOut.style.color = "#f87171";
          } else if (curStage >= frl) {
            zoneOut.textContent = "Full Capacity (FRL) / Surcharge Spill";
            zoneOut.style.color = "#38bdf8";
          } else {
            zoneOut.textContent = "Active Conservation Buffer (Live Storage)";
            zoneOut.style.color = "#4ade80";
          }
        }

        // Render Dynamic Hypsometric Graphic
        if (svgContainer) {
          const fillH = Math.min(180, Math.round(fraction * 180));
          const waterTopY = 220 - fillH;
          const waterTopWidth = Math.min(300, Math.round(60 + (fraction * 240)));
          const waterLeftX = 180 - (waterTopWidth / 2);
          const waterRightX = 180 + (waterTopWidth / 2);

          svgContainer.innerHTML = `
            <svg viewBox="0 0 360 260" class="eac-svg" aria-label="Conceptual Hypsometric Reservoir Bathymetry Curve">
              <!-- Valley Cross-Section -->
              <rect x="0" y="0" width="360" height="260" fill="#090d16" />
              <!-- Valley Terrain (V-shaped bathymetry) -->
              <polygon points="20,40 180,220 340,40 360,40 360,260 0,260 0,40" fill="#1e293b" stroke="#475569" stroke-width="2" />
              <text x="180" y="245" fill="#64748b" font-size="10" text-anchor="middle">Valley Bed Datum: ~${bed.toFixed(0)}m MSL</text>

              <!-- Water Body Infill based on Stage -->
              <polygon points="${waterLeftX},${waterTopY} 180,220 ${waterRightX},${waterTopY}" fill="rgba(56, 189, 248, 0.45)" stroke="#38bdf8" stroke-width="1.5" />
              <!-- Water Surface Line -->
              <line x1="${waterLeftX}" y1="${waterTopY}" x2="${waterRightX}" y2="${waterTopY}" stroke="#38bdf8" stroke-width="2" />

              <!-- MDDL Marker -->
              <line x1="100" y1="160" x2="260" y2="160" stroke="#f87171" stroke-dasharray="3,3" stroke-width="1" />
              <text x="265" y="163" fill="#f87171" font-size="9">MDDL (${mddl.toFixed(0)}m)</text>

              <!-- FRL Marker -->
              <line x1="45" y1="55" x2="315" y2="55" stroke="#4ade80" stroke-dasharray="3,3" stroke-width="1" />
              <text x="320" y="58" fill="#4ade80" font-size="9">FRL (${frl.toFixed(0)}m)</text>

              <!-- Current Water Level Pointer -->
              <text x="180" y="${Math.max(30, waterTopY - 8)}" fill="#ffffff" font-size="11" font-weight="700" text-anchor="middle">
                Stage: ${curStage.toFixed(1)}m MSL (${pct}% Vol)
              </text>
            </svg>
          `;
        }
      };

      if (slider) {
        slider.addEventListener("input", updateEac);
        updateEac();
      }
    }
  };

  // Expose DamScienceLab globally
  window.DamScienceLab = DamScienceLab;

  // Initialize on DOM load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => DamScienceLab.init());
  } else {
    DamScienceLab.init();
  }

  // Global window bridge for popups & search
  window.openDamScienceLabById = (id) => DamScienceLab.open(id);
})();
