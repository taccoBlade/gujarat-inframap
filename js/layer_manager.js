/**
 * Gujarat InfraMap — Modular Layer Manager & Advanced Scale-Dependent Rendering Engine
 * Version: 5.0.0
 *
 * Implements:
 * 1. 11 Collapsible Layer Categories:
 *    - Administrative Boundaries
 *    - Roads & Highways
 *    - Railways & Stations
 *    - Dams & Reservoirs
 *    - Rivers & Canals
 *    - Hydrology & Groundwater
 *    - Power & Energy
 *    - Urban & Industrial Infrastructure
 *    - Geology & Terrain
 *    - Environment & Hazards
 *    - Imagery & Basemaps
 * 2. Group-level visibility & master toggles
 * 3. Individual-layer toggles with feature count & scale badges
 * 4. Dedicated opacity sliders per layer (GPU-composited pane/style manipulation)
 * 5. Instantaneous Layer Search with highlight & auto-accordion expansion
 * 6. "Reset to Default" button restoring calibrated baseline view
 * 7. Real-Time Active-Layer Legend with scale visibility indicators and quick-hide actions
 * 8. Dynamic Level-of-Detail (LOD) Scale-Dependent Engine (State-wide -> District -> City -> Close-up)
 * 9. Non-intrusive Selected Asset Highlighting Engine on dedicated selectionPane
 */

(function () {
  "use strict";

  // =========================================================================
  // 1. LAYER & CATEGORY REGISTRY CONFIGURATION
  // =========================================================================

  const CATEGORIES = [
    {
      id: "admin",
      title: "Administrative Boundaries",
      icon: "🏛️",
      description: "Statutory boundaries, headquarters & revenue districts",
      expanded: true
    },
    {
      id: "roads",
      title: "Roads & Highways",
      icon: "🛣️",
      description: "Expressways, National Highways & civil structures",
      expanded: true
    },
    {
      id: "rail",
      title: "Railways & Stations",
      icon: "🚆",
      description: "Western Railway corridors, junctions & halts",
      expanded: false
    },
    {
      id: "dams",
      title: "Dams & Reservoirs",
      icon: "💧",
      description: "Large dams, barrages, weirs & water-spread footprints",
      expanded: true
    },
    {
      id: "rivers",
      title: "Rivers & Canals",
      icon: "🌊",
      description: "Major river trunks & Narmada canal distribution networks",
      expanded: false
    },
    {
      id: "hydro",
      title: "Hydrology & Groundwater",
      icon: "🚰",
      description: "CGWB aquifer extraction, monitoring wells & command areas",
      expanded: false
    },
    {
      id: "energy",
      title: "Power & Energy",
      icon: "⚡",
      description: "Generation plants, 765/400kV transmission & substations",
      expanded: true
    },
    {
      id: "urban",
      title: "Urban & Industrial Infrastructure",
      icon: "🏗️",
      description: "Smart cities, metro corridors, seaports, airports & SEZs",
      expanded: false
    },
    {
      id: "geology",
      title: "Geology & Terrain",
      icon: "🌍",
      description: "Bedrock formations, seismogenic faults, soils & SRTM terrain",
      expanded: false
    },
    {
      id: "hazard",
      title: "Environment & Hazards",
      icon: "⚠️",
      description: "BIS seismic zones, cyclone/flood risk & Ramsar reserves",
      expanded: false
    },
    {
      id: "basemaps",
      title: "Imagery & Basemaps",
      icon: "🗺️",
      description: "High-resolution satellite imagery, dark GIS & terrain basemaps",
      expanded: true
    }
  ];

  const LAYERS = [
    // --- 1. Administrative Boundaries ---
    {
      key: "districts",
      category: "admin",
      name: "District Boundaries",
      type: "polygon",
      count: "33 districts",
      minZoom: 5,
      maxZoom: 19,
      defaultOn: true,
      swatch: { color: "#38bdf8", fill: "rgba(56, 189, 248, 0.08)", type: "polygon" },
      panes: ["districtsPane"],
      searchTerms: "district boundary administration revenue taluka gujarat"
    },
    {
      key: "hq",
      category: "admin",
      name: "District Headquarters",
      type: "point",
      count: "33 HQs",
      minZoom: 6.5,
      maxZoom: 19,
      defaultOn: false,
      swatch: { color: "#14b8a6", fill: "#14b8a6", type: "circle" },
      panes: ["hqPane"],
      searchTerms: "district headquarters capital city civic collectorate"
    },

    // --- 2. Roads & Highways ---
    {
      key: "roads",
      category: "roads",
      name: "National Highways & Expressways",
      type: "line",
      count: "43 corridors (8,940 km)",
      minZoom: 6,
      maxZoom: 19,
      defaultOn: true,
      swatch: { color: "#f97316", width: 3, type: "line" },
      panes: ["roadsPane"],
      searchTerms: "expressway highway ne-1 nh-48 nhai corridor road traffic golden quadrilateral"
    },
    {
      key: "structures",
      category: "roads",
      name: "Signature Bridges & Flyovers",
      type: "point",
      count: "31 civil structures",
      minZoom: 7.5,
      maxZoom: 19,
      defaultOn: false,
      swatch: { color: "#06b6d4", fill: "#06b6d4", type: "circle" },
      panes: ["roadsPane"],
      searchTerms: "bridge flyover tunnel viaduct overpass crossing sudarshan setu narmada cable stayed"
    },

    // --- 3. Railways & Stations ---
    {
      key: "railways",
      category: "rail",
      name: "Western Railway Tracks",
      type: "line",
      count: "2,264 tracks",
      minZoom: 7.5,
      maxZoom: 19,
      defaultOn: false,
      swatch: { color: "#94a3b8", width: 2, dashed: true, type: "line" },
      panes: ["railwaysBasePane", "railwaysPane"],
      searchTerms: "railway train track rail corridor broad gauge wdfc western railway"
    },
    {
      key: "stations",
      category: "rail",
      name: "Passenger Railway Stations",
      type: "point",
      count: "623 stations",
      minZoom: 7,
      maxZoom: 19,
      defaultOn: false,
      swatch: { color: "#3b82f6", fill: "#3b82f6", type: "circle" },
      panes: ["stationsPane"],
      searchTerms: "station junction terminal passenger halt railway code wr adi brc st"
    },

    // --- 4. Dams & Reservoirs ---
    {
      key: "waterDams",
      category: "dams",
      name: "Major Dams, Barrages & Weirs",
      type: "point",
      count: "34 structures (23.6 BCM)",
      minZoom: 6,
      maxZoom: 19,
      defaultOn: true,
      swatch: { color: "#0284c7", fill: "#0284c7", type: "circle" },
      panes: ["damsPane"],
      searchTerms: "dam reservoir barrage weir cwc nrld storage sardar sarovar ukai kadana dharoi"
    },
    {
      key: "reservoirs",
      category: "dams",
      name: "Reservoir Water-Spread Footprints",
      type: "polygon",
      count: "6 major reservoirs",
      minZoom: 6.5,
      maxZoom: 19,
      defaultOn: true,
      swatch: { color: "#0ea5e9", fill: "rgba(14, 165, 233, 0.20)", type: "polygon" },
      panes: ["reservoirsPane"],
      searchTerms: "reservoir water spread lake bathymetry submergence frl vallabh sagar"
    },

    // --- 5. Rivers & Canals ---
    {
      key: "rivers",
      category: "rivers",
      name: "Major River Trunks",
      type: "line",
      count: "10 river basins",
      minZoom: 5.5,
      maxZoom: 19,
      defaultOn: false,
      swatch: { color: "#38bdf8", width: 2.5, type: "line" },
      panes: ["waterwaysPane"],
      searchTerms: "river narmada tapi sabarmati mahi banas shetrunji drainage basin trunk"
    },
    {
      key: "canals",
      category: "rivers",
      name: "Narmada & Irrigation Canals",
      type: "line",
      count: "10 canal networks (1,100 km)",
      minZoom: 7,
      maxZoom: 19,
      defaultOn: false,
      swatch: { color: "#06b6d4", width: 2, dashed: true, type: "line" },
      panes: ["waterwaysPane"],
      searchTerms: "canal nmc narmada main canal branch sauni irrigation distributary water supply"
    },

    // --- 6. Hydrology & Groundwater ---
    {
      key: "groundwater",
      category: "hydro",
      name: "CGWB District Aquifer Status",
      type: "polygon",
      count: "33 district assessments",
      minZoom: 6,
      maxZoom: 19,
      defaultOn: false,
      swatch: { color: "#10b981", fill: "rgba(16, 185, 129, 0.14)", type: "polygon" },
      panes: ["groundwaterPane"],
      searchTerms: "groundwater aquifer cgwb extraction over-exploited critical safe salinity water table"
    },
    {
      key: "gwStations",
      category: "hydro",
      name: "Groundwater Monitoring Stations",
      type: "point",
      count: "10 hydrograph stations",
      minZoom: 8,
      maxZoom: 19,
      defaultOn: false,
      swatch: { color: "#38bdf8", fill: "#38bdf8", type: "circle" },
      panes: ["groundwaterPane"],
      searchTerms: "piezometer tube-well water level hydrograph observation monitoring cgwb"
    },
    {
      key: "commandAreas",
      category: "hydro",
      name: "Irrigation Command Areas",
      type: "polygon",
      count: "6 command footprints (2.5M ha)",
      minZoom: 7,
      maxZoom: 19,
      defaultOn: false,
      swatch: { color: "#84cc16", fill: "rgba(132, 204, 22, 0.12)", type: "polygon" },
      panes: ["commandPane"],
      searchTerms: "command area culturable agriculture irrigation command ssp ukai kadana"
    },

    // --- 7. Power & Energy ---
    {
      key: "power",
      category: "energy",
      name: "Power Generation Facilities",
      type: "point",
      count: "49 plants (33.7 GW)",
      minZoom: 6,
      maxZoom: 19,
      defaultOn: true,
      swatch: { color: "#f59e0b", fill: "#f59e0b", type: "circle" },
      panes: ["powerPane"],
      searchTerms: "power plant solar wind thermal nuclear hydro gas khavda mundra wanakbori generation"
    },
    {
      key: "transmission",
      category: "energy",
      name: "GETCO Grid (400/765 kV Lines)",
      type: "line",
      count: "15 EHV corridors",
      minZoom: 7,
      maxZoom: 19,
      defaultOn: false,
      swatch: { color: "#a855f7", width: 2.5, type: "line" },
      panes: ["transmissionLinesPane"],
      searchTerms: "transmission grid getco pgcil 765kv 400kv line corridor power evacuation"
    },
    {
      key: "substations",
      category: "energy",
      name: "Grid Pooling Substations",
      type: "point",
      count: "22 substations",
      minZoom: 7.5,
      maxZoom: 19,
      defaultOn: false,
      swatch: { color: "#c084fc", fill: "#c084fc", type: "circle" },
      panes: ["substationsPane"],
      searchTerms: "substation pooling switchyard getco transformer ehv busbar"
    },

    // --- 8. Urban & Industrial Infrastructure ---
    {
      key: "urbanMetro",
      category: "urban",
      name: "Smart Cities & Metro Corridors",
      type: "mixed",
      count: "8 MCs • Metro Network",
      minZoom: 7,
      maxZoom: 19,
      defaultOn: false,
      swatch: { color: "#06b6d4", fill: "#06b6d4", type: "circle" },
      panes: ["urbanMetroPane"],
      searchTerms: "urban municipal corporation smart city metro transit ahmedabad surat vadodara"
    },
    {
      key: "portsAirports",
      category: "urban",
      name: "Major Commercial Ports & Airports",
      type: "point",
      count: "8 Ports • 7 Airports",
      minZoom: 6.5,
      maxZoom: 19,
      defaultOn: false,
      swatch: { color: "#6366f1", fill: "#6366f1", type: "circle" },
      panes: ["portsAirportsPane"],
      searchTerms: "port seaport airport aviation logistics mundra kandla svpia cargo maritime"
    },
    {
      key: "industries",
      category: "urban",
      name: "Mega GIDC Estates & SEZs",
      type: "polygon",
      count: "9 Mega SEZs (Dholera, PCPIR)",
      minZoom: 7,
      maxZoom: 19,
      defaultOn: false,
      swatch: { color: "#d97706", fill: "rgba(217, 119, 6, 0.12)", type: "polygon" },
      panes: ["industryPane"],
      searchTerms: "gidc sez industrial estate dholera dahej pcpir sanand gift city investment"
    },

    // --- 9. Geology & Terrain ---
    {
      key: "geology",
      category: "geology",
      name: "Bedrock Formations (GSI Bhukosh)",
      type: "polygon",
      count: "7 lithological formations",
      minZoom: 6.5,
      maxZoom: 19,
      defaultOn: false,
      swatch: { color: "#b45309", fill: "rgba(180, 83, 9, 0.12)", type: "polygon" },
      panes: ["geologyPane"],
      searchTerms: "geology rock deccan trap basalt sandstone alluvium gsi lithology"
    },
    {
      key: "faults",
      category: "geology",
      name: "Active Seismogenic Fault Lines",
      type: "line",
      count: "5 active faults (KMF, KBF)",
      minZoom: 6.5,
      maxZoom: 19,
      defaultOn: false,
      swatch: { color: "#dc2626", width: 2.5, dashed: true, type: "line" },
      panes: ["faultsPane"],
      searchTerms: "fault earthquake kutch mainland fault kbf narmada son lineament seismic isr"
    },
    {
      key: "soils",
      category: "geology",
      name: "Soil Series & Expansive Vertisols",
      type: "polygon",
      count: "5 soil engineering units",
      minZoom: 7,
      maxZoom: 19,
      defaultOn: false,
      swatch: { color: "#15803d", fill: "rgba(21, 128, 61, 0.12)", type: "polygon" },
      panes: ["soilsPane"],
      searchTerms: "soil black cotton vertisol clay cbr nbsslup expansive swelling subgrade"
    },
    {
      key: "terrain",
      category: "geology",
      name: "SRTM Terrain & Elevation Regimes",
      type: "polygon",
      count: "5 geomorphological regimes",
      minZoom: 6.5,
      maxZoom: 19,
      defaultOn: false,
      swatch: { color: "#0284c7", fill: "rgba(2, 132, 199, 0.12)", type: "polygon" },
      panes: ["terrainPane"],
      searchTerms: "terrain elevation slope srtm dem relief girnar aravalli coastal plain"
    },

    // --- 10. Environment & Hazards ---
    {
      key: "seismic",
      category: "hazard",
      name: "BIS IS 1893 Seismic Zones",
      type: "polygon",
      count: "Zone V / IV / III",
      minZoom: 5.5,
      maxZoom: 19,
      defaultOn: false,
      swatch: { color: "#ef4444", fill: "rgba(239, 68, 68, 0.14)", type: "polygon" },
      panes: ["seismicPane"],
      searchTerms: "seismic earthquake zone v zone iv bis is 1893 hazard pga ground acceleration"
    },
    {
      key: "cycloneFlood",
      category: "hazard",
      name: "Cyclone Winds & Floodplains",
      type: "polygon",
      count: "IMD 50 m/s • 4 Floodplains",
      minZoom: 6,
      maxZoom: 19,
      defaultOn: false,
      swatch: { color: "#f97316", fill: "rgba(249, 115, 22, 0.12)", type: "polygon" },
      panes: ["disasterPane"],
      searchTerms: "cyclone wind imd flood floodplain inundation coastal surge disaster gsdma"
    },
    {
      key: "coastal",
      category: "hazard",
      name: "Coastal Inundation & Salinity",
      type: "polygon",
      count: "3 coastal hazard sectors",
      minZoom: 6.5,
      maxZoom: 19,
      defaultOn: false,
      swatch: { color: "#8b5cf6", fill: "rgba(139, 92, 246, 0.12)", type: "polygon" },
      panes: ["coastalPane"],
      searchTerms: "coastal shoreline erosion salinity ingress tidal ncscm sac gulf khambhat kutch"
    },
    {
      key: "sanctuaries",
      category: "hazard",
      name: "Wildlife Sanctuaries & Ramsar",
      type: "polygon",
      count: "12 Protected Areas (Gir, Nalsarovar)",
      minZoom: 6.5,
      maxZoom: 19,
      defaultOn: false,
      swatch: { color: "#10b981", fill: "rgba(16, 185, 129, 0.15)", type: "polygon" },
      panes: ["sanctuariesPane"],
      searchTerms: "sanctuary national park ramsar wetland eco-sensitive esz gir lion marine nalsarovar"
    }
  ];

  // Default calibrated configuration (Overview preset)
  const DEFAULT_ACTIVE_KEYS = ["districts", "roads", "power", "waterDams", "reservoirs"];

  // =========================================================================
  // 2. STATE STORAGE & CACHE
  // =========================================================================

  let mapInstance = null;
  let layerGroupsRef = {};
  let callbacksRef = {};
  let currentZoom = 7.0;
  let activeSearchQuery = "";
  let selectedHighlightLayer = null;

  // Active state per layer: { [layerKey]: boolean }
  const layerActiveState = {};

  // Opacity state per layer: { [layerKey]: number (0-100) }
  const layerOpacityState = {};

  // Initialize defaults
  LAYERS.forEach(l => {
    layerActiveState[l.key] = l.defaultOn;
    layerOpacityState[l.key] = 100;
  });

  // =========================================================================
  // 3. UI GENERATION ENGINE
  // =========================================================================

  function renderCategoryAccordions(container) {
    if (!container) return;

    let html = `
      <div class="layer-mgr-controls-bar">
        <div class="layer-search-box">
          <span class="layer-search-icon">🔍</span>
          <input type="text" id="layerSearchInput" class="layer-search-input" placeholder="Search 27 layers (e.g. dams, faults, rail)..." autocomplete="off" aria-label="Search layers">
          <button id="clearLayerSearchBtn" class="clear-layer-search-btn hidden" title="Clear layer search" aria-label="Clear layer search">✕</button>
        </div>
        <div class="layer-mgr-actions-row">
          <button id="resetLayersToDefaultBtn" class="layer-mgr-btn" title="Reset all layers to calibrated overview baseline">
            <span>↺</span> Reset Defaults
          </button>
          <button id="toggleAllCategoriesBtn" class="layer-mgr-btn" title="Expand or collapse all category sections">
            <span>⮁</span> Toggle All
          </button>
        </div>
      </div>
      <div class="layer-categories-list" id="layerCategoriesList">
    `;

    CATEGORIES.forEach(cat => {
      if (cat.id === "basemaps") {
        html += renderBasemapsCategoryBlock(cat);
      } else {
        html += renderStandardCategoryBlock(cat);
      }
    });

    html += `</div>`;
    container.innerHTML = html;

    // Attach listeners
    bindManagerDOMEvents();
    updateAllCategoryHeaders();
    renderActiveLayerLegend();
  }

  function renderStandardCategoryBlock(cat) {
    const catLayers = LAYERS.filter(l => l.category === cat.id);
    const activeCount = catLayers.filter(l => layerActiveState[l.key]).length;
    const isExpanded = cat.expanded;

    return `
      <div class="layer-category-block collapsible ${isExpanded ? 'expanded' : ''}" data-cat-id="${cat.id}" id="catBlock_${cat.id}">
        <div class="category-header">
          <button class="category-expand-btn" data-cat-toggle="${cat.id}" aria-label="Toggle ${cat.title} accordion" title="Expand / collapse">
            <svg viewBox="0 0 24 24" class="category-chevron-icon"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
          </button>
          <div class="category-title-wrap" data-cat-toggle="${cat.id}">
            <span class="category-title">${cat.icon} ${cat.title}</span>
            <span class="category-active-badge" id="catBadge_${cat.id}">${activeCount}/${catLayers.length}</span>
          </div>
          <label class="group-master-toggle" title="Toggle all layers in ${cat.title}">
            <input type="checkbox" class="group-toggle-input" data-group-cat="${cat.id}" ${activeCount === catLayers.length && catLayers.length > 0 ? 'checked' : ''} aria-label="Toggle all layers in ${cat.title}">
            <span class="group-toggle-slider"></span>
          </label>
        </div>
        <div class="category-body ${isExpanded ? '' : 'hidden'}" id="catBody_${cat.id}">
          ${catLayers.map(l => renderLayerItemRow(l)).join("")}
        </div>
      </div>
    `;
  }

  function renderBasemapsCategoryBlock(cat) {
    return `
      <div class="layer-category-block collapsible expanded" data-cat-id="basemaps" id="catBlock_basemaps">
        <div class="category-header">
          <button class="category-expand-btn" data-cat-toggle="basemaps" aria-label="Toggle ${cat.title} accordion">
            <svg viewBox="0 0 24 24" class="category-chevron-icon"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
          </button>
          <div class="category-title-wrap" data-cat-toggle="basemaps">
            <span class="category-title">${cat.icon} ${cat.title}</span>
            <span class="category-active-badge">4 Basemaps</span>
          </div>
        </div>
        <div class="category-body" id="catBody_basemaps">
          <div class="basemap-segmented-box">
            <span class="basemap-group-label">Cartographic Provider</span>
            <div class="segmented-control" id="basemapSegmentedControl">
              <button class="segment-btn active" data-basemap="dark">Dark GIS</button>
              <button class="segment-btn" data-basemap="osm">Clean OSM</button>
              <button class="segment-btn" data-basemap="satellite">Satellite</button>
              <button class="segment-btn" data-basemap="topo">Terrain</button>
            </div>
          </div>
          <div class="layer-item-wrapper basemap-opacity-row">
            <div class="layer-meta">
              <span class="layer-name">Basemap Canvas Opacity</span>
              <span class="layer-sublabel" id="valBasemapOpacity">100%</span>
            </div>
            <input type="range" class="opacity-slider" id="opacityBasemapSlider" min="15" max="100" value="100" aria-label="Basemap Opacity">
          </div>
        </div>
      </div>
    `;
  }

  function renderLayerItemRow(l) {
    const isActive = layerActiveState[l.key];
    const opVal = layerOpacityState[l.key] || 100;
    const swatchHtml = renderSwatchIcon(l.swatch);

    return `
      <div class="layer-item-wrapper" data-layer-key="${l.key}" data-search="${(l.name + ' ' + l.searchTerms).toLowerCase()}">
        <div class="layer-item">
          <label class="custom-toggle">
            <input type="checkbox" id="chk_${l.key}" class="layer-toggle-input" data-layer="${l.key}" ${isActive ? 'checked' : ''} aria-label="Toggle ${l.name} Layer">
            <span class="toggle-slider"></span>
          </label>
          <div class="layer-meta">
            <div class="layer-name-row">
              <span class="layer-swatch-slot">${swatchHtml}</span>
              <span class="layer-name">${l.name}</span>
            </div>
            <div class="layer-action-pills">
              <span class="asset-badge badge-neutral">${l.count}</span>
              <span class="scale-badge" title="Scale visibility threshold: renders from zoom ${l.minZoom} to ${l.maxZoom}">z${l.minZoom}+</span>
              <button class="layer-opacity-btn" data-opacity-btn="${l.key}" title="Adjust Layer Opacity" aria-label="Adjust ${l.name} Opacity">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12">
                  <circle cx="12" cy="12" r="9"></circle>
                  <path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div class="layer-opacity-drawer hidden" id="opDrawer_${l.key}">
          <div class="opacity-slider-inner">
            <span class="opacity-label">Opacity</span>
            <input type="range" class="opacity-slider" data-op-slider="${l.key}" min="0" max="100" value="${opVal}" aria-label="${l.name} Opacity">
            <span class="opacity-val" id="valOp_${l.key}">${opVal}%</span>
          </div>
        </div>
      </div>
    `;
  }

  function renderSwatchIcon(sw) {
    if (!sw) return `<span class="swatch-generic"></span>`;
    if (sw.type === "circle") {
      return `<span class="swatch-circle" style="background:${sw.color}; border: 1.5px solid #ffffff;"></span>`;
    }
    if (sw.type === "line") {
      return `<span class="swatch-line ${sw.dashed ? 'dashed' : ''}" style="border-top-color:${sw.color};"></span>`;
    }
    if (sw.type === "polygon") {
      return `<span class="swatch-polygon" style="border-color:${sw.color}; background:${sw.fill};"></span>`;
    }
    return `<span class="swatch-circle" style="background:#38bdf8;"></span>`;
  }

  // =========================================================================
  // 4. EVENT BINDINGS & LAYER TOGGLING
  // =========================================================================

  function bindManagerDOMEvents() {
    // Accordion expand/collapse
    document.querySelectorAll("[data-cat-toggle]").forEach(el => {
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        const catId = el.getAttribute("data-cat-toggle");
        toggleCategoryAccordion(catId);
      });
    });

    // Group-level master toggle
    document.querySelectorAll("[data-group-cat]").forEach(input => {
      input.addEventListener("change", (e) => {
        const catId = e.target.getAttribute("data-group-cat");
        const shouldEnable = e.target.checked;
        toggleCategoryGroup(catId, shouldEnable);
      });
    });

    // Individual layer toggles
    document.querySelectorAll(".layer-toggle-input").forEach(input => {
      input.addEventListener("change", (e) => {
        const key = e.target.getAttribute("data-layer");
        const isChecked = e.target.checked;
        setLayerActive(key, isChecked);
      });
    });

    // Opacity toggle buttons
    document.querySelectorAll("[data-opacity-btn]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const key = btn.getAttribute("data-opacity-btn");
        const drawer = document.getElementById(`opDrawer_${key}`);
        if (drawer) {
          const isHidden = drawer.classList.toggle("hidden");
          btn.classList.toggle("active", !isHidden);
        }
      });
    });

    // Opacity sliders
    document.querySelectorAll("[data-op-slider]").forEach(slider => {
      slider.addEventListener("input", (e) => {
        const key = e.target.getAttribute("data-op-slider");
        const val = parseInt(e.target.value, 10);
        setLayerOpacity(key, val);
      });
    });

    // Basemap opacity slider
    const bmSlider = document.getElementById("opacityBasemapSlider");
    if (bmSlider) {
      bmSlider.addEventListener("input", (e) => {
        const val = parseInt(e.target.value, 10);
        const ratio = (val / 100).toFixed(2);
        const disp = document.getElementById("valBasemapOpacity");
        if (disp) disp.textContent = `${val}%`;
        const tilePane = mapInstance ? mapInstance.getPane("tilePane") : null;
        if (tilePane) tilePane.style.opacity = ratio;
      });
    }

    // Layer search filter
    const searchInput = document.getElementById("layerSearchInput");
    const clearSearchBtn = document.getElementById("clearLayerSearchBtn");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        filterLayersBySearch(e.target.value);
        if (clearSearchBtn) {
          clearSearchBtn.classList.toggle("hidden", !e.target.value);
        }
      });
    }
    if (clearSearchBtn) {
      clearSearchBtn.addEventListener("click", () => {
        if (searchInput) {
          searchInput.value = "";
          filterLayersBySearch("");
          clearSearchBtn.classList.add("hidden");
        }
      });
    }

    // Reset Defaults Button
    const resetBtn = document.getElementById("resetLayersToDefaultBtn");
    if (resetBtn) {
      resetBtn.addEventListener("click", resetLayersToDefault);
    }

    // Toggle All Categories Button
    const toggleAllBtn = document.getElementById("toggleAllCategoriesBtn");
    if (toggleAllBtn) {
      let allExpanded = false;
      toggleAllBtn.addEventListener("click", () => {
        allExpanded = !allExpanded;
        CATEGORIES.forEach(cat => {
          setCategoryAccordion(cat.id, allExpanded);
        });
        toggleAllBtn.innerHTML = allExpanded ? `<span>⮁</span> Collapse All` : `<span>⮁</span> Expand All`;
      });
    }
  }

  function toggleCategoryAccordion(catId) {
    const block = document.getElementById(`catBlock_${catId}`);
    const body = document.getElementById(`catBody_${catId}`);
    if (block && body) {
      const isExpanded = block.classList.toggle("expanded");
      body.classList.toggle("hidden", !isExpanded);
    }
  }

  function setCategoryAccordion(catId, expand) {
    const block = document.getElementById(`catBlock_${catId}`);
    const body = document.getElementById(`catBody_${catId}`);
    if (block && body) {
      block.classList.toggle("expanded", expand);
      body.classList.toggle("hidden", !expand);
    }
  }

  function toggleCategoryGroup(catId, enable) {
    const catLayers = LAYERS.filter(l => l.category === catId);
    catLayers.forEach(l => {
      layerActiveState[l.key] = enable;
      const chk = document.getElementById(`chk_${l.key}`);
      if (chk) chk.checked = enable;

      applyLayerVisibility(l.key, enable);
    });

    updateCategoryHeader(catId);
    renderActiveLayerLegend();
    triggerSyncCallbacks();
  }

  function setLayerActive(key, enable) {
    layerActiveState[key] = enable;
    const lDef = LAYERS.find(l => l.key === key);
    if (lDef) {
      updateCategoryHeader(lDef.category);
    }

    applyLayerVisibility(key, enable);
    renderActiveLayerLegend();
    triggerSyncCallbacks();
  }

  function setLayerOpacity(key, opacityPercent) {
    layerOpacityState[key] = opacityPercent;
    const disp = document.getElementById(`valOp_${key}`);
    if (disp) disp.textContent = `${opacityPercent}%`;

    const lDef = LAYERS.find(l => l.key === key);
    if (!lDef || !mapInstance) return;

    const ratio = (opacityPercent / 100).toFixed(2);
    lDef.panes.forEach(paneName => {
      const p = mapInstance.getPane(paneName);
      if (p) p.style.opacity = ratio;
    });

    // Also notify active legend
    const legendOpBadge = document.getElementById(`legendOp_${key}`);
    if (legendOpBadge) legendOpBadge.textContent = `${opacityPercent}%`;
  }

  function applyLayerVisibility(key, enable) {
    if (!mapInstance) return;
    const group = layerGroupsRef[key];
    if (!group) return;

    if (enable) {
      // Ensure data is loaded
      if (typeof callbacksRef.ensureLayerLoaded === "function") {
        callbacksRef.ensureLayerLoaded(key);
      }

      // Check scale threshold
      const lDef = LAYERS.find(l => l.key === key);
      const isScaleValid = lDef ? (currentZoom >= lDef.minZoom && currentZoom <= lDef.maxZoom) : true;

      if (isScaleValid) {
        if (!mapInstance.hasLayer(group)) {
          mapInstance.addLayer(group);
        }
      } else {
        if (mapInstance.hasLayer(group)) {
          mapInstance.removeLayer(group);
        }
      }
    } else {
      if (mapInstance.hasLayer(group)) {
        mapInstance.removeLayer(group);
      }
    }
  }

  function updateCategoryHeader(catId) {
    const catLayers = LAYERS.filter(l => l.category === catId);
    const activeCount = catLayers.filter(l => layerActiveState[l.key]).length;

    const badge = document.getElementById(`catBadge_${catId}`);
    if (badge) {
      badge.textContent = `${activeCount}/${catLayers.length}`;
      badge.classList.toggle("all-active", activeCount === catLayers.length && catLayers.length > 0);
      badge.classList.toggle("none-active", activeCount === 0);
    }

    const groupInput = document.querySelector(`[data-group-cat="${catId}"]`);
    if (groupInput) {
      groupInput.checked = activeCount === catLayers.length && catLayers.length > 0;
      groupInput.indeterminate = activeCount > 0 && activeCount < catLayers.length;
    }
  }

  function updateAllCategoryHeaders() {
    CATEGORIES.forEach(cat => {
      if (cat.id !== "basemaps") {
        updateCategoryHeader(cat.id);
      }
    });
  }

  function triggerSyncCallbacks() {
    const totalActive = Object.values(layerActiveState).filter(Boolean).length;
    const totalLayers = LAYERS.length;

    const countHeader = document.getElementById("activeLayersCount");
    if (countHeader) countHeader.textContent = `${totalActive} Layers Active`;

    const subCount = document.getElementById("layerFilterCount");
    if (subCount) subCount.textContent = `${totalActive} of ${totalLayers} Active`;

    if (typeof callbacksRef.onStateChange === "function") {
      callbacksRef.onStateChange(layerActiveState);
    }
  }

  // =========================================================================
  // 5. LAYER SEARCH & FILTERING
  // =========================================================================

  function filterLayersBySearch(query) {
    activeSearchQuery = (query || "").trim().toLowerCase();
    const rows = document.querySelectorAll(".layer-item-wrapper[data-layer-key]");

    if (!activeSearchQuery) {
      // Restore all rows and categories
      rows.forEach(r => {
        r.classList.remove("search-match", "search-hidden");
        r.style.display = "";
      });
      document.querySelectorAll(".layer-category-block").forEach(b => {
        b.style.display = "";
      });
      return;
    }

    const matchedCats = new Set();

    rows.forEach(r => {
      const searchTerms = r.getAttribute("data-search") || "";
      const isMatch = searchTerms.includes(activeSearchQuery);

      if (isMatch) {
        r.classList.add("search-match");
        r.classList.remove("search-hidden");
        r.style.display = "";

        const catBlock = r.closest(".layer-category-block");
        if (catBlock) {
          const catId = catBlock.getAttribute("data-cat-id");
          if (catId) matchedCats.add(catId);
        }
      } else {
        r.classList.remove("search-match");
        r.classList.add("search-hidden");
        r.style.display = "none";
      }
    });

    // Auto-expand and reveal categories with matches
    CATEGORIES.forEach(cat => {
      const block = document.getElementById(`catBlock_${cat.id}`);
      if (block) {
        if (matchedCats.has(cat.id)) {
          block.style.display = "";
          setCategoryAccordion(cat.id, true);
        } else {
          block.style.display = "none";
        }
      }
    });
  }

  // =========================================================================
  // 6. RESET TO DEFAULTS
  // =========================================================================

  function resetLayersToDefault() {
    LAYERS.forEach(l => {
      const shouldBeOn = DEFAULT_ACTIVE_KEYS.includes(l.key);
      layerActiveState[l.key] = shouldBeOn;
      layerOpacityState[l.key] = 100;

      const chk = document.getElementById(`chk_${l.key}`);
      if (chk) chk.checked = shouldBeOn;

      const slider = document.querySelector(`[data-op-slider="${l.key}"]`);
      if (slider) slider.value = 100;

      const opDisp = document.getElementById(`valOp_${l.key}`);
      if (opDisp) opDisp.textContent = "100%";

      // Reset pane opacity
      if (mapInstance) {
        l.panes.forEach(paneName => {
          const p = mapInstance.getPane(paneName);
          if (p) p.style.opacity = "1";
        });
      }

      applyLayerVisibility(l.key, shouldBeOn);
    });

    // Reset basemap to Dark GIS
    const darkBtn = document.querySelector(`.segment-btn[data-basemap="dark"]`);
    if (darkBtn) darkBtn.click();

    updateAllCategoryHeaders();
    renderActiveLayerLegend();
    triggerSyncCallbacks();

    if (mapInstance) {
      mapInstance.flyTo([22.30, 71.80], 7.0, { duration: 1.0 });
    }

    if (typeof callbacksRef.showToast === "function") {
      callbacksRef.showToast("✓ Reset layers to calibrated default overview");
    }
  }

  // =========================================================================
  // 7. REAL-TIME ACTIVE-LAYER LEGEND WIDGET
  // =========================================================================

  function renderActiveLayerLegend() {
    let legendContainer = document.getElementById("activeLayerLegend");
    if (!legendContainer) {
      legendContainer = document.createElement("div");
      legendContainer.id = "activeLayerLegend";
      legendContainer.className = "active-layer-legend";
      legendContainer.setAttribute("role", "region");
      legendContainer.setAttribute("aria-label", "Active Map Layers Legend");
      document.body.appendChild(legendContainer);
    }

    const activeLayers = LAYERS.filter(l => layerActiveState[l.key]);
    const z = currentZoom;

    let itemsHtml = "";
    if (activeLayers.length === 0) {
      itemsHtml = `
        <div class="legend-empty-state">
          <p>No layers currently enabled.</p>
          <small>Toggle layers in the manager on the left.</small>
        </div>
      `;
    } else {
      itemsHtml = activeLayers.map(l => {
        const isVisibleAtCurrentZoom = z >= l.minZoom && z <= l.maxZoom;
        const swatchHtml = renderSwatchIcon(l.swatch);
        const opVal = layerOpacityState[l.key] || 100;

        return `
          <div class="legend-item ${isVisibleAtCurrentZoom ? 'in-scale' : 'out-of-scale'}" id="legendRow_${l.key}">
            <span class="legend-item-swatch">${swatchHtml}</span>
            <div class="legend-item-info">
              <span class="legend-item-name" title="${l.name}">${l.name}</span>
              <div class="legend-item-badges">
                ${isVisibleAtCurrentZoom
                  ? `<span class="legend-zoom-pill visible">● Visible</span>`
                  : `<span class="legend-zoom-pill deferred" title="Layer reveals at zoom ${l.minZoom}+">○ Zoom in (z${l.minZoom}+)</span>`
                }
                <span class="legend-op-pill" id="legendOp_${l.key}">${opVal}%</span>
              </div>
            </div>
            <button class="legend-hide-btn" data-legend-hide="${l.key}" title="Hide ${l.name} layer" aria-label="Hide ${l.name}">
              ✕
            </button>
          </div>
        `;
      }).join("");
    }

    legendContainer.innerHTML = `
      <div class="legend-header">
        <div class="legend-header-title">
          <span class="legend-title-icon">🗺️</span>
          <h4>Active Legend</h4>
          <span class="legend-count-pill" id="legendCountPill">${activeLayers.length} Active</span>
        </div>
        <div class="legend-header-actions">
          <button id="legendCollapseToggleBtn" class="legend-toggle-btn" title="Minimize / Expand legend panel" aria-label="Toggle legend panel">
            −
          </button>
        </div>
      </div>
      <div class="legend-body" id="legendBody">
        <div class="legend-items-list">
          ${itemsHtml}
        </div>
      </div>
    `;

    // Bind legend hide buttons
    legendContainer.querySelectorAll("[data-legend-hide]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const key = btn.getAttribute("data-legend-hide");
        const chk = document.getElementById(`chk_${key}`);
        if (chk) chk.checked = false;
        setLayerActive(key, false);
      });
    });

    // Legend collapse button
    const toggleBtn = document.getElementById("legendCollapseToggleBtn");
    const legendBody = document.getElementById("legendBody");
    if (toggleBtn && legendBody) {
      toggleBtn.addEventListener("click", () => {
        const isCollapsed = legendContainer.classList.toggle("collapsed");
        toggleBtn.textContent = isCollapsed ? "+" : "−";
      });
    }
  }

  // =========================================================================
  // 8. SCALE-DEPENDENT LEVEL-OF-DETAIL (LOD) ENGINE
  // =========================================================================

  function updateZoomLOD(zoom) {
    currentZoom = typeof zoom === "number" ? zoom : (mapInstance ? mapInstance.getZoom() : 7.0);

    // 1. Evaluate scale threshold for every active layer
    LAYERS.forEach(l => {
      const isActive = layerActiveState[l.key];
      if (!isActive) return;

      const group = layerGroupsRef[l.key];
      if (!group || !mapInstance) return;

      const isScaleValid = currentZoom >= l.minZoom && currentZoom <= l.maxZoom;
      if (isScaleValid) {
        if (!mapInstance.hasLayer(group)) {
          mapInstance.addLayer(group);
        }
      } else {
        if (mapInstance.hasLayer(group)) {
          mapInstance.removeLayer(group);
        }
      }
    });

    // 2. Fine-grained feature LOD within layers:
    updateFeatureLevelOfDetail(currentZoom);

    // 3. Update legend zoom badges
    renderActiveLayerLegend();
  }

  function updateFeatureLevelOfDetail(z) {
    if (!mapInstance) return;

    // A. Administrative Boundaries (Dynamic stroke hierarchy)
    if (layerActiveState.districts && layerGroupsRef.districts) {
      const dWeight = z <= 7.5 ? 0.8 : (z <= 10 ? 1.1 : 1.5);
      const distGroup = layerGroupsRef.districts;
      if (distGroup && typeof distGroup.eachLayer === "function") {
        distGroup.eachLayer(layer => {
          if (layer.setStyle && !layer._isSelected) {
            layer.setStyle({ weight: dWeight });
          }
        });
      }
    }

    // B. Highway Corridors (Hierarchy: Expressway -> GQ -> NH -> Spurs)
    if (layerActiveState.roads && layerGroupsRef.roads) {
      const roadGroup = layerGroupsRef.roads;
      if (roadGroup && typeof roadGroup.eachLayer === "function") {
        roadGroup.eachLayer(layer => {
          if (layer.feature && layer.setStyle) {
            const cat = (layer.feature.properties && layer.feature.properties.category) || "national_highway";
            const isExpress = cat === "expressway" || cat === "golden_quadrilateral";

            if (z < 7.5) {
              layer.setStyle({
                weight: isExpress ? 2.5 : 1.2,
                opacity: isExpress ? 0.90 : 0.35
              });
            } else if (z < 9.5) {
              layer.setStyle({
                weight: isExpress ? 3.0 : 2.0,
                opacity: 0.85
              });
            } else {
              layer.setStyle({
                weight: isExpress ? 3.8 : 2.8,
                opacity: 0.95
              });
            }
          }
        });
      }
    }

    // C. Passenger Railway Stations (Thresholds: Major Terminals -> Junctions -> Halts)
    if (layerActiveState.stations && layerGroupsRef.stations) {
      const statGroup = layerGroupsRef.stations;
      if (statGroup && typeof statGroup.eachLayer === "function") {
        statGroup.eachLayer(layer => {
          if (layer.feature && layer.setStyle) {
            const p = layer.feature.properties || {};
            const isMajor = p.is_major || p.category === "major_junction";
            const isJunction = p.category === "junction";

            if (z < 8.0) {
              // Only major terminals visible
              if (isMajor) {
                layer.setStyle({ radius: 5.5, opacity: 0.95, fillOpacity: 0.95 });
              } else {
                layer.setStyle({ radius: 0.001, opacity: 0, fillOpacity: 0 });
              }
            } else if (z < 10.0) {
              // Major terminals + all junctions
              if (isMajor) {
                layer.setStyle({ radius: 6.5, opacity: 0.95, fillOpacity: 0.95 });
              } else if (isJunction) {
                layer.setStyle({ radius: 5.0, opacity: 0.90, fillOpacity: 0.90 });
              } else {
                layer.setStyle({ radius: 0.001, opacity: 0, fillOpacity: 0 });
              }
            } else {
              // All 623 stations visible
              const r = isMajor ? 7.5 : (isJunction ? 6.0 : 4.5);
              layer.setStyle({ radius: r, opacity: 0.90, fillOpacity: 0.85 });
            }
          }
        });
      }
    }

    // D. Power Plants (Thresholds: >= 1,000 MW -> >= 100 MW -> All)
    if (layerActiveState.power && layerGroupsRef.power) {
      const powGroup = layerGroupsRef.power;
      if (powGroup && typeof powGroup.eachLayer === "function") {
        powGroup.eachLayer(layer => {
          if (layer.feature && layer.setStyle) {
            const p = layer.feature.properties || {};
            const cap = parseFloat(p.capacity_mw) || 0;

            if (z < 7.5) {
              if (cap >= 1000) {
                layer.setStyle({ radius: 7.5, opacity: 0.95, fillOpacity: 0.95 });
              } else {
                layer.setStyle({ radius: 0.001, opacity: 0, fillOpacity: 0 });
              }
            } else if (z < 9.5) {
              if (cap >= 100) {
                layer.setStyle({ radius: cap >= 1000 ? 7.0 : 5.5, opacity: 0.90, fillOpacity: 0.90 });
              } else {
                layer.setStyle({ radius: 0.001, opacity: 0, fillOpacity: 0 });
              }
            } else {
              layer.setStyle({ radius: cap >= 1000 ? 8.0 : (cap >= 100 ? 6.5 : 5.0), opacity: 0.90, fillOpacity: 0.85 });
            }
          }
        });
      }
    }

    // E. Dams & Reservoirs (Thresholds: >= 500 MCM -> >= 50 MCM -> All)
    if (layerActiveState.waterDams && layerGroupsRef.waterDams) {
      const damGroup = layerGroupsRef.waterDams;
      if (damGroup && typeof damGroup.eachLayer === "function") {
        damGroup.eachLayer(layer => {
          if (layer.feature && layer.setStyle) {
            const p = layer.feature.properties || {};
            const gross = parseFloat(p.gross_storage_mcm) || 0;

            if (z < 7.5) {
              if (gross >= 500) {
                layer.setStyle({ radius: 8.0, opacity: 0.95, fillOpacity: 0.95 });
              } else {
                layer.setStyle({ radius: 0.001, opacity: 0, fillOpacity: 0 });
              }
            } else if (z < 9.5) {
              if (gross >= 50) {
                layer.setStyle({ radius: gross >= 500 ? 8.0 : 6.0, opacity: 0.90, fillOpacity: 0.90 });
              } else {
                layer.setStyle({ radius: 0.001, opacity: 0, fillOpacity: 0 });
              }
            } else {
              layer.setStyle({ radius: gross >= 500 ? 8.5 : (gross >= 50 ? 6.8 : 5.2), opacity: 0.90, fillOpacity: 0.85 });
            }
          }
        });
      }
    }
  }

  // =========================================================================
  // 9. NON-INTRUSIVE SELECTED ASSET HIGHLIGHTING ENGINE
  // =========================================================================

  function highlightSelectedAsset(asset) {
    if (!mapInstance || !asset) return;

    // Clear previous highlight
    clearSelectedHighlight();

    const geom = asset.geometry;
    if (!geom) return;

    const selPane = mapInstance.getPane("selectionPane") || mapInstance.getPane("overlayPane");

    if (geom.type === "Point") {
      const latlng = [geom.coordinates[1], geom.coordinates[0]];
      selectedHighlightLayer = L.circleMarker(latlng, {
        pane: "selectionPane",
        radius: 14,
        color: "#38bdf8",
        weight: 3.5,
        fillColor: "#0284c7",
        fillOpacity: 0.25,
        className: "leaflet-selection-halo pulse-halo"
      }).addTo(mapInstance);
    } else if (geom.type === "LineString") {
      const latlngs = geom.coordinates.map(pt => [pt[1], pt[0]]);
      selectedHighlightLayer = L.polyline(latlngs, {
        pane: "selectionPane",
        color: "#38bdf8",
        weight: 6,
        opacity: 0.85,
        className: "leaflet-selection-halo"
      }).addTo(mapInstance);
    } else if (geom.type === "Polygon") {
      const latlngs = geom.coordinates[0].map(pt => [pt[1], pt[0]]);
      selectedHighlightLayer = L.polygon(latlngs, {
        pane: "selectionPane",
        color: "#38bdf8",
        weight: 3,
        fillColor: "#0284c7",
        fillOpacity: 0.20,
        className: "leaflet-selection-halo"
      }).addTo(mapInstance);
    }
  }

  function clearSelectedHighlight() {
    if (selectedHighlightLayer && mapInstance) {
      mapInstance.removeLayer(selectedHighlightLayer);
      selectedHighlightLayer = null;
    }
  }

  // =========================================================================
  // 10. PRESET INTEGRATION
  // =========================================================================

  function applyPreset(presetName) {
    const presets = {
      overview: DEFAULT_ACTIVE_KEYS,
      water: ["districts", "waterDams", "reservoirs", "rivers", "canals", "commandAreas"],
      transport: ["districts", "roads", "structures", "railways", "stations", "portsAirports", "urbanMetro"],
      energy: ["districts", "power", "transmission", "substations"],
      urban: ["districts", "urbanMetro", "portsAirports", "industries", "roads"],
      disaster: ["districts", "seismic", "cycloneFlood", "coastal", "groundwater", "sanctuaries"],
      admin: ["districts", "hq"],
      full: LAYERS.map(l => l.key)
    };

    const targetKeys = presets[presetName] || DEFAULT_ACTIVE_KEYS;

    LAYERS.forEach(l => {
      const shouldBeOn = targetKeys.includes(l.key);
      layerActiveState[l.key] = shouldBeOn;
      const chk = document.getElementById(`chk_${l.key}`);
      if (chk) chk.checked = shouldBeOn;

      applyLayerVisibility(l.key, shouldBeOn);
    });

    updateAllCategoryHeaders();
    renderActiveLayerLegend();
    triggerSyncCallbacks();
  }

  // =========================================================================
  // 11. INITIALIZATION & PUBLIC API
  // =========================================================================

  function init(map, layerGroups, options = {}) {
    mapInstance = map;
    layerGroupsRef = layerGroups || {};
    callbacksRef = options || {};

    // Create dedicated selectionPane if not present
    if (!map.getPane("selectionPane")) {
      const selPane = map.createPane("selectionPane");
      selPane.style.zIndex = 650;
      selPane.style.pointerEvents = "none";
    }

    // Additional thematic panes
    const paneDefs = [
      { name: "geologyPane", zIndex: 355 },
      { name: "soilsPane", zIndex: 358 },
      { name: "terrainPane", zIndex: 365 },
      { name: "coastalPane", zIndex: 385 },
      { name: "faultsPane", zIndex: 430 }
    ];
    paneDefs.forEach(({ name, zIndex }) => {
      if (!map.getPane(name)) {
        map.createPane(name).style.zIndex = zIndex;
      }
    });

    // Render Layer Manager UI into container
    const container = document.getElementById("layerManagerContainer") || document.querySelector(".layers-container");
    if (container) {
      renderCategoryAccordions(container);
    }

    // Attach zoomend listener for scale-dependent Level-of-Detail
    let zoomDebounceTimer = null;
    map.on("zoomend", () => {
      clearTimeout(zoomDebounceTimer);
      zoomDebounceTimer = setTimeout(() => {
        updateZoomLOD(map.getZoom());
      }, 60);
    });

    // Initial scale LOD application
    updateZoomLOD(map.getZoom());

    console.log("[LayerManager] Initialized with 11 categories and 27 infrastructure layers.");
  }

  // Export to global namespace
  window.LayerManager = {
    init,
    CATEGORIES,
    LAYERS,
    setLayerActive,
    setLayerOpacity,
    toggleCategoryGroup,
    resetLayersToDefault,
    applyPreset,
    updateZoomLOD,
    highlightSelectedAsset,
    clearSelectedHighlight,
    renderActiveLayerLegend
  };

})();
