/**
 * Gujarat InfraMap — Public Views & Editorial Information Engine
 * Manages the 4 primary destinations:
 * 1. Explore Map (default full-screen interactive GIS)
 * 2. Infrastructure Directory (searchable, filterable public catalog by category & district)
 * 3. Projects (curated, verified public profiles of major strategic infrastructure projects)
 * 4. About & Data Sources (complete transparency, 7 domains, 13 layers, 3,337 features, provenance & licenses)
 *
 * Design: Restrained civic-tech, editorial cartography, zero neon / zero AI slop.
 */

(function (window, document) {
  "use strict";

  // =========================================================================
  // 1. VERIFIED STRATEGIC PROJECTS REGISTRY (10 MAJOR GUJARAT INITIATIVES)
  // =========================================================================

  const STRATEGIC_PROJECTS = [
    {
      id: "dholera-sir",
      name: "Dholera Special Investment Region (SIR)",
      category: "urban",
      categoryLabel: "Planned Industrial Smart City",
      district: "Ahmedabad",
      location: "Dholera Taluka, Gulf of Khambhat",
      coordinates: [22.25, 72.22],
      zoom: 11,
      agency: "Dholera Industrial City Development Limited (DICDL) / GIDC",
      status: "Activation Area Operational • Ongoing Industrial Construction",
      scale: "920 km² Total Area • 22.54 km² Activation Area (Phase 1)",
      summary: "India's first platinum-rated greenfield industrial smart city. Encompasses dedicated high-speed highway connectivity (NH-751), trunk water pipelines, sub-surface utility ducting, solar park, and the Tata Electronics mega semiconductor fabrication plant.",
      facts: [
        { label: "Total Planned Area", value: "920 km² (larger than Singapore)" },
        { label: "Activation Node Area", value: "22.54 km² (Phase 1 infrastructure complete)" },
        { label: "Anchor Semiconductor Fab", value: "Tata Electronics / PSMC ($11 Billion)" },
        { label: "Expressway Connection", value: "109 km 4-Lane Access-Controlled NH-751" },
        { label: "Industrial Water Pipeline", value: "Piped water feed from Narmada canal network" },
        { label: "Future Dholera Airport", value: "International cargo & passenger airport under development" }
      ],
      relevantLayers: ["urban", "roads", "water"],
      sourceTitle: "DICDL Official Master Plan & PM Gati Shakti Disclosures",
      sourceUrl: "https://dholera.gujarat.gov.in"
    },
    {
      id: "khavda-re-park",
      name: "Khavda Hybrid Renewable Energy Mega-Park",
      category: "energy",
      categoryLabel: "Clean Energy & Transmission Grid",
      district: "Kachchh",
      location: "Vighakot, Great Rann of Kutch",
      coordinates: [23.95, 69.80],
      zoom: 10,
      agency: "Adani Green Energy Limited (AGEL) / NTPC REL / GIPCL / POWERGRID",
      status: "First 2,000+ MW Commissioned • Phased Expansion to 30 GW",
      scale: "30,000 MW (30 GW) Hybrid Capacity • 726 km² Footprint",
      summary: "The world's largest single-location renewable energy park, combining utility-scale solar photovoltaic arrays and wind turbines on arid salt desert flats. Evacuation supported by dedicated 765 kV double-circuit EHV transmission lines.",
      facts: [
        { label: "Total Targeted Capacity", value: "30,000 MW (30 GW Solar + Wind)" },
        { label: "Annual Clean Generation", value: "81 Billion kWh (powers ~16M homes)" },
        { label: "Land Footprint", value: "726 km² wasteland in Great Rann" },
        { label: "Grid Interconnection", value: "Navinal & Khavda 765 kV Pooling Substations" },
        { label: "Transmission Line Length", value: "225+ km EHV Double-Circuit Corridors" },
        { label: "Commissioning Milestone", value: "Initial generation operational since March 2024" }
      ],
      relevantLayers: ["power", "transmission"],
      sourceTitle: "Central Electricity Authority (CEA) & MNRE Gazette",
      sourceUrl: "https://cea.nic.in"
    },
    {
      id: "sauni-yojana",
      name: "SAUNI Yojana (Saurashtra Narmada Avtaran Irrigation)",
      category: "water",
      categoryLabel: "Inter-Basin Water Transfer Scheme",
      district: "Saurashtra Region",
      location: "Spans 11 Districts (Rajkot, Morbi, Jamnagar, Surendranagar, Bhavnagar)",
      coordinates: [22.30, 70.80],
      zoom: 8,
      agency: "Water Resources Department, Government of Gujarat",
      status: "Links 1, 2, 3 Operational • Phase 2 Expansion Underway",
      scale: "1,126+ km Pressurized MS Pipeline Network • 115 Dams Fed",
      summary: "Pioneering regional water security initiative diverting 1 MAF (1,233 MCM) of surplus floodwaters from the Narmada Main Canal via pressurized underground mild steel pipelines and high-capacity lift pump stations to replenish 115 drought-prone reservoirs in Saurashtra.",
      facts: [
        { label: "Allocated Flood Discharge", value: "1.0 MAF (Million Acre Feet) / 1,233 MCM" },
        { label: "Underground Pipeline Network", value: "1,126+ km High-Pressure MS Pipelines" },
        { label: "Replenished Reservoirs", value: "115 existing dams across Saurashtra" },
        { label: "Agricultural Command Benefited", value: "8.24 Lakh Acres across 11 districts" },
        { label: "Pumping Hubs", value: "Dhanki, Machhu, and Morbi pump stations" },
        { label: "Environmental Advantage", value: "Zero evaporation loss via buried pipes" }
      ],
      relevantLayers: ["dams", "rivers"],
      sourceTitle: "Narmada, Water Resources, Water Supply & Kalpsar Department, GoG",
      sourceUrl: "https://guj-nwrws.gujarat.gov.in"
    },
    {
      id: "western-dfc",
      name: "Western Dedicated Freight Corridor (WDFC)",
      category: "transport",
      categoryLabel: "Dedicated Rail Freight Logistics Spine",
      district: "Statewide Corridor",
      location: "Palanpur to Sanjan (Traverses 9 Gujarat Districts)",
      coordinates: [22.75, 72.85],
      zoom: 8,
      agency: "Dedicated Freight Corridor Corporation of India Limited (DFCCIL)",
      status: "Operational in Gujarat • Double-Stack Electric Container Service",
      scale: "565 km Dedicated Double-Track Alignment in Gujarat",
      summary: "High-capacity electrified freight rail corridor constructed parallel to Western Railway. Engineered with 25-tonne axle loads (upgradeable to 32.5 tonnes) and automated signaling, enabling double-stack container trains to run at 100 km/h between Gujarat ports and Delhi NCR.",
      facts: [
        { label: "Total Corridor Length", value: "1,504 km (Dadri to JNPT)" },
        { label: "Gujarat Alignment Length", value: "565 km (Banaskantha to Valsad)" },
        { label: "Maximum Operating Speed", value: "100 km/h for freight trains" },
        { label: "Train Configuration", value: "Double-stack electric container rakes" },
        { label: "Port Rail Linkages", value: "Direct hinterland connection to Mundra, Kandla, Pipavav" },
        { label: "Decarbonization Impact", value: "50%+ reduction in freight transit greenhouse emissions" }
      ],
      relevantLayers: ["railways", "stations", "roads"],
      sourceTitle: "DFCCIL Western Corridor Operational Directory",
      sourceUrl: "https://dfccil.com"
    },
    {
      id: "mahsr-bullet-train",
      name: "Mumbai–Ahmedabad High Speed Rail (MAHSR)",
      category: "transport",
      categoryLabel: "High-Speed Passenger Rail (Bullet Train)",
      district: "Central & South Gujarat",
      location: "Sabarmati, Ahmedabad, Anand, Vadodara, Bharuch, Surat, Bilimora, Vapi",
      coordinates: [21.80, 73.00],
      zoom: 8.5,
      agency: "National High Speed Rail Corporation Limited (NHSRCL)",
      status: "Under Active Construction • Major Viaduct & River Bridges Completed",
      scale: "352 km in Gujarat • 8 Specialized High-Speed Stations",
      summary: "India's first Shinkansen-standard bullet train corridor connecting Ahmedabad and Mumbai. Reduces end-to-end travel time from 6.5 hours to under 2 hours with top operating speeds of 320 km/h across an elevated viaduct crossing 24 major Gujarat rivers.",
      facts: [
        { label: "Total System Length", value: "508.17 km (352 km in Gujarat)" },
        { label: "Maximum Operating Speed", value: "320 km/h (Design Speed: 350 km/h)" },
        { label: "Travel Time (Fast Express)", value: "1 Hour 58 Minutes (Sabarmati to BKC)" },
        { label: "Gujarat High-Speed Stations", value: "8 Stations (Sabarmati, Ahmedabad, Anand, Vadodara, Bharuch, Surat, Bilimora, Vapi)" },
        { label: "Major River Bridge Crossings", value: "24 Bridges (including Narmada, Tapi, Mahi, Sabarmati)" },
        { label: "Terminal Hub", value: "Sabarmati Multimodal Hub integrating WR, Metro, and BRTS" }
      ],
      relevantLayers: ["roads", "railways", "stations"],
      sourceTitle: "NHSRCL Project Status & Engineering Disclosures",
      sourceUrl: "https://nhsrcl.in"
    },
    {
      id: "sardar-sarovar-project",
      name: "Sardar Sarovar Narmada Dam & Canal Project",
      category: "water",
      categoryLabel: "Multipurpose Water Resources Complex",
      district: "Narmada",
      location: "Kevadia / Ekta Nagar",
      coordinates: [21.833, 73.749],
      zoom: 12,
      agency: "Sardar Sarovar Narmada Nigam Limited (SSNNL) / CWC",
      status: "Fully Operational • 138.68 m FRL Achieved",
      scale: "9,460 MCM Gross Storage • 1,450 MW Hydropower • 458 km Main Canal",
      summary: "The cornerstone of Gujarat's regional water security. A 163 m concrete gravity dam impounding the Narmada River, feeding a 458 km contour canal and generating 1,450 MW of clean peaking power while supplying drinking water to over 9,400 villages and 173 urban civic bodies.",
      facts: [
        { label: "Dam Type & Height", value: "Concrete Gravity • 163 m above deepest foundation" },
        { label: "Gross Storage Capacity", value: "9,460 MCM (7.67 Million Acre Feet)" },
        { label: "Hydropower Installation", value: "1,450 MW (1,200 MW RBPH + 250 MW CHPH)" },
        { label: "Narmada Main Canal", value: "458 km long contour canal (40,000 cusecs capacity)" },
        { label: "Drinking Water Beneficiaries", value: "9,490 villages and 173 towns across Gujarat" },
        { label: "Irrigation Command Area", value: "1.85 Million Hectares across 17 districts" }
      ],
      relevantLayers: ["dams", "rivers", "power"],
      sourceTitle: "Central Water Commission (CWC NRLD 2023) & SSNNL Annual Report",
      sourceUrl: "https://sardarsarovardam.org"
    },
    {
      id: "gift-city",
      name: "Gujarat International Finance Tec-City (GIFT City)",
      category: "urban",
      categoryLabel: "Smart City & International Financial Centre",
      district: "Gandhinagar",
      location: "Sabarmati Riverfront Corridor",
      coordinates: [23.16, 72.68],
      zoom: 13,
      agency: "GIFT City Company Limited / GUDC / IFSCA",
      status: "Operational International Financial Services Centre (IFSC)",
      scale: "886 Acres Master Plan • 62 Million sq.ft. Planned Built-Up Area",
      summary: "India's first designated operational greenfield Smart City and International Financial Services Centre. Features a multi-utility subterranean service tunnel, district cooling, automated pneumatic waste collection, and direct connectivity via Ahmedabad Metro Phase 2.",
      facts: [
        { label: "Master Plan Area", value: "886 Acres on Sabarmati riverfront" },
        { label: "Underground Utility Tunnel", value: "Dedicated utility trench for power, water, telecom, and waste" },
        { label: "District Cooling System", value: "Centralized chilled water distribution reducing energy load by 30%" },
        { label: "Automated Waste Collection", value: "Vacuum-powered subterranean pneumatic waste chute network" },
        { label: "Financial Regulatory Zone", value: "International Financial Services Centres Authority (IFSCA)" },
        { label: "Rapid Transit", value: "Connected to Ahmedabad & Gandhinagar via Metro Phase 2" }
      ],
      relevantLayers: ["urban", "roads"],
      sourceTitle: "GIFT City Official Master Plan Disclosures",
      sourceUrl: "https://giftgujarat.in"
    },
    {
      id: "surat-diamond-bourse",
      name: "Surat Diamond Bourse & DREAM City",
      category: "urban",
      categoryLabel: "Commercial Logistics Hub & Diamond Trading",
      district: "Surat",
      location: "Khajod, DREAM City",
      coordinates: [21.13, 72.78],
      zoom: 13,
      agency: "Diamond Research and Mercantile (DREAM) City Limited / SDB",
      status: "Operational Commercial Facility",
      scale: "6.7 Million sq.ft. Built-Up Space • 9 Interconnected 15-Story Towers",
      summary: "The world's largest single-building office complex, consolidating the global diamond cutting, polishing, and rough trading ecosystem under one roof. Forms the anchor commercial node of the 2,000-acre DREAM City smart master plan.",
      facts: [
        { label: "Total Built-Up Area", value: "6.7 Million sq.ft. (surpasses Pentagon)" },
        { label: "Architectural Layout", value: "9 Interconnected 15-story towers on 35 acres" },
        { label: "Diamond Trade Concentration", value: "Over 4,500 diamond merchant offices" },
        { label: "Parent Urban District", value: "2,000-acre DREAM City smart city precinct" },
        { label: "Public Transit Link", value: "Terminal station on Surat Metro Line 1" },
        { label: "Customs Clearance", value: "In-house independent customs clearance and security vault" }
      ],
      relevantLayers: ["urban", "roads"],
      sourceTitle: "Surat Municipal Corporation (SMC) & DREAM City Authority",
      sourceUrl: "https://dreamcitysurat.com"
    },
    {
      id: "sudarshan-setu",
      name: "Sudarshan Setu (Okha–Beyt Dwarka Cable-Stayed Bridge)",
      category: "transport",
      categoryLabel: "Signature Civil Maritime Crossing",
      district: "Devbhumi Dwarka",
      location: "Gulf of Kutch, connecting Okha with Beyt Dwarka",
      coordinates: [22.46, 69.11],
      zoom: 13,
      agency: "Ministry of Road Transport & Highways (MoRTH) / Gujarat R&B",
      status: "Fully Operational • Opened to Public February 2024",
      scale: "2,320 m (2.32 km) Total Length • 900 m Cable-Stayed Central Span",
      summary: "India's longest cable-stayed maritime bridge, spanning the Arabian Sea between Okha port and Beyt Dwarka island. Engineered with solar canopies generating 1 MW of electricity along pedestrian walkways, replacing unreliable boat ferries with all-weather road access.",
      facts: [
        { label: "Total Structure Length", value: "2,320 m (2.32 km)" },
        { label: "Cable-Stayed Navigation Span", value: "900 m (Central span 500 m)" },
        { label: "Deck Width & Lanes", value: "27.2 m wide deck carrying 4 vehicular lanes" },
        { label: "Integrated Solar Energy", value: "1 MW solar rooftop canopies along pedestrian walkways" },
        { label: "Public Utility", value: "All-weather access to Beyt Dwarka for 2M+ annual pilgrims" },
        { label: "Commissioning Date", value: "Inaugurated February 25, 2024" }
      ],
      relevantLayers: ["structures", "roads"],
      sourceTitle: "MoRTH National Highways Division Project Completion Gazette",
      sourceUrl: "https://morth.nic.in"
    },
    {
      id: "ahmedabad-metro",
      name: "Ahmedabad–Gandhinagar Metro Rail Network",
      category: "transport",
      categoryLabel: "Urban Rapid Mass Transit System",
      district: "Ahmedabad",
      location: "Metropolitan Ahmedabad and Gandhinagar",
      coordinates: [23.03, 72.57],
      zoom: 12,
      agency: "Gujarat Metro Rail Corporation (GMRC) Limited",
      status: "Phase 1 Operational (40 km) • Phase 2 Operational to GIFT City & Gandhinagar",
      scale: "68.2 km Total Operational & Commissioned Network • 54 Stations",
      summary: "Standard-gauge electrified rapid transit system connecting Ahmedabad, Gandhinagar, and GIFT City. Incorporates elevated viaducts, an underground heritage sector, cross-platform interchange at Old High Court, and direct multi-modal feeder buses.",
      facts: [
        { label: "Phase 1 Network Length", value: "40.03 km (32 Stations: North-South & East-West)" },
        { label: "Phase 2 Extension Length", value: "28.2 km (Motera Stadium to Mahatma Mandir & GIFT City)" },
        { label: "Key Cross Interchange", value: "Old High Court Station (cross-platform transfer)" },
        { label: "Rolling Stock", value: "Hyundai Rotem stainless steel 3-car air-conditioned trainsets" },
        { label: "Power Supply", value: "750 V DC third-rail traction with regenerative braking" },
        { label: "Connectivity Scope", value: "Integrates APMC, Railway Junction, Thaltej, Motera, and GIFT City" }
      ],
      relevantLayers: ["urban", "stations", "roads"],
      sourceTitle: "GMRC Operational Network Disclosures",
      sourceUrl: "https://gujaratmetrorail.com"
    }
  ];

  // =========================================================================
  // 2. STATE MANAGEMENT & DOM INITIALIZATION
  // =========================================================================

  const state = {
    activeTab: "explore", // "explore" | "directory" | "projects" | "about"
    theme: localStorage.getItem("inframap_theme") || "light",
    directoryFilterCat: "all",
    directoryFilterDistrict: "",
    directorySearchQuery: "",
    projectsFilterCat: "all",
    directoryItems: [],
    initialized: false
  };

  function init() {
    applyTheme(state.theme);
    bindNavigationTabs();
    bindThemeToggle();
    bindDirectoryControls();
    bindProjectsControls();
    handleInitialRoute();

    // Re-render directory when search index or layers load
    window.addEventListener("searchIndexUpdated", () => {
      buildDirectoryDataset();
      renderDirectory();
    });

    // Populate after delay if already indexed
    setTimeout(() => {
      buildDirectoryDataset();
      renderDirectory();
    }, 1500);

    state.initialized = true;
    console.log("[PublicViews] Initialized: 4 core destinations active.");
  }

  // =========================================================================
  // 3. THEME CONTROLLER (EDITORIAL LIGHT BY DEFAULT, CLEAN SLATE DARK)
  // =========================================================================

  function applyTheme(theme) {
    state.theme = theme;
    localStorage.setItem("inframap_theme", theme);

    const body = document.body;
    if (theme === "dark") {
      body.classList.add("theme-dark");
      body.classList.remove("theme-light");
    } else {
      body.classList.add("theme-light");
      body.classList.remove("theme-dark");
    }

    const themeBtn = document.getElementById("toggleThemeBtn") || document.getElementById("themeToggleBtn");
    if (themeBtn) {
      themeBtn.setAttribute("title", theme === "dark" ? "Switch to Light Theme" : "Switch to Dark Slate Theme");
      themeBtn.innerHTML = theme === "dark"
        ? `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`
        : `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    }

    // Switch default basemap if appropriate and LayerManager is ready
    if (window.LayerManager && typeof window.LayerManager.setBasemap === "function") {
      window.LayerManager.setBasemap(theme === "dark" ? "dark" : "osm");
    }
  }

  function bindThemeToggle() {
    const btn = document.getElementById("toggleThemeBtn") || document.getElementById("themeToggleBtn");
    if (btn) {
      btn.addEventListener("click", () => {
        const nextTheme = state.theme === "dark" ? "light" : "dark";
        applyTheme(nextTheme);
      });
    }
  }

  // =========================================================================
  // 4. MAIN DESTINATION NAVIGATION CONTROLLER (PHASE 3 SIGNATURE TRANSITION)
  // =========================================================================

  function triggerDiscoveryTransition() {
    const isReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) return;

    const bar = document.getElementById("discoveryTransitionBar");
    if (!bar) return;

    bar.classList.remove("discovery-active");
    void bar.offsetWidth; // Force reflow for repeatable rapid transitions
    bar.classList.add("discovery-active");

    clearTimeout(bar._timer);
    bar._timer = setTimeout(() => {
      bar.classList.remove("discovery-active");
    }, 360);
  }

  function switchDestination(destKey, updateHash = true) {
    // Normalize aliases
    if (destKey === "trip-reality" || destKey === "feasibility") destKey = "plan";
    if (destKey === "directory") destKey = "infrastructure";

    state.activeTab = destKey;
    triggerDiscoveryTransition();

    // Update nav tab buttons
    document.querySelectorAll(".nav-tab").forEach(tab => {
      const isMatch = tab.getAttribute("data-tab") === destKey;
      tab.classList.toggle("active", isMatch);
      tab.setAttribute("aria-selected", isMatch ? "true" : "false");
    });

    // Update mobile bottom nav buttons
    document.querySelectorAll(".mobile-nav-btn").forEach(btn => {
      const isMatch = btn.getAttribute("data-nav") === destKey;
      btn.classList.toggle("active", isMatch);
    });

    const placesView = document.getElementById("placesView");
    const planVisitView = document.getElementById("planVisitView");
    const dirView = document.getElementById("directoryView");
    const projView = document.getElementById("projectsView");
    const aboutView = document.getElementById("aboutView");
    const mapEl = document.getElementById("map");

    // Manage Map HUD elements visibility
    const isExplore = destKey === "explore";
    document.body.classList.toggle("non-explore-active", !isExplore);
    const mapHud = document.querySelector(".map-hud");
    const activeLegend = document.getElementById("activeLayerLegend");
    const recenterBtn = document.getElementById("recenterMapBtn") || document.querySelector(".floating-recenter-btn");
    const layerDrawer = document.querySelector(".layer-drawer");
    if (mapHud) mapHud.classList.toggle("hidden", !isExplore);
    if (activeLegend) {
      activeLegend.classList.toggle("hidden", !isExplore);
      activeLegend.style.display = isExplore ? "" : "none";
    }
    if (recenterBtn) recenterBtn.classList.toggle("hidden", !isExplore);
    if (layerDrawer && !isExplore) layerDrawer.classList.remove("open");

    // Hide all secondary views first
    if (placesView) placesView.classList.add("hidden");
    if (planVisitView) planVisitView.classList.add("hidden");
    if (dirView) dirView.classList.add("hidden");
    if (projView) projView.classList.add("hidden");
    if (aboutView) aboutView.classList.add("hidden");

    if (destKey === "explore") {
      // Map is dominant working area
      if (window.map && typeof window.map.invalidateSize === "function") {
        window.map.invalidateSize({ debounceMove: true });
      }
    } else if (destKey === "places") {
      if (placesView) placesView.classList.remove("hidden");
      if (window.TourismDiscovery && typeof window.TourismDiscovery.render === "function") {
        window.TourismDiscovery.render();
      }
    } else if (destKey === "plan") {
      if (planVisitView) planVisitView.classList.remove("hidden");
      const subViewTripReality = document.getElementById("tripRealitySubView");
      if (subViewTripReality) subViewTripReality.classList.remove("hidden");
      if (window.TripReality) {
        window.TripReality.renderAssessment();
        window.TripReality.updateMapVisualization();
      }
    } else if (destKey === "infrastructure") {
      if (dirView) dirView.classList.remove("hidden");
      renderDirectory();
    } else if (destKey === "projects") {
      if (projView) projView.classList.remove("hidden");
      renderProjects();
    } else if (destKey === "about") {
      if (aboutView) aboutView.classList.remove("hidden");
    }

    if (updateHash) {
      const hashMap = {
        explore: "#/explore",
        places: "#/places",
        plan: "#/plan",
        infrastructure: "#/infrastructure",
        projects: "#/projects",
        about: "#/about"
      };
      if (window.location.hash !== hashMap[destKey]) {
        history.pushState(null, "", hashMap[destKey] || "#/explore");
      }
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function bindNavigationTabs() {
    document.querySelectorAll(".nav-tab[data-tab]").forEach(tab => {
      tab.addEventListener("click", (e) => {
        e.preventDefault();
        const dest = tab.getAttribute("data-tab");
        switchDestination(dest, true);
      });
    });


    window.addEventListener("hashchange", () => {
      handleInitialRoute();
    });
  }

  function handleInitialRoute() {
    const fullHash = (window.location.hash || "").replace(/^#\/?/, "");
    const rawHash = fullHash.split("?")[0].toLowerCase();
    if (!rawHash) {
      switchDestination("explore", false);
      return;
    }

    if (rawHash.startsWith("plan") || rawHash.startsWith("trip-reality") || rawHash.startsWith("feasibility") || rawHash.startsWith("trip_reality")) {
      switchDestination("plan", false);

      // Check query params in hash or search
      const queryString = fullHash.includes("?") ? fullHash.substring(fullHash.indexOf("?") + 1) : window.location.search.substring(1);
      const params = new URLSearchParams(queryString);
      const destParam = params.get("dest") || params.get("destination");

      if (window.TripReality) {
        if (destParam) {
          window.TripReality.selectDestination(destParam);
        } else {
          window.TripReality.renderAssessment();
          window.TripReality.updateMapVisualization();
        }
      }
    } else if (rawHash.startsWith("places") || rawHash.startsWith("tourism") || rawHash.startsWith("destinations")) {
      switchDestination("places", false);
    } else if (rawHash.startsWith("infrastructure") || rawHash.startsWith("directory")) {
      switchDestination("infrastructure", false);
    } else if (rawHash.startsWith("projects") || rawHash.startsWith("initiatives")) {
      switchDestination("projects", false);
    } else if (rawHash.startsWith("about") || rawHash.startsWith("data") || rawHash.startsWith("provenance")) {
      switchDestination("about", false);
    } else {
      switchDestination("explore", false);
    }
  }

  // =========================================================================
  // 5. INFRASTRUCTURE DIRECTORY ENGINE
  // =========================================================================

  function buildDirectoryDataset() {
    const rawIndex = window.searchIndex || [];
    const items = [];
    const seenIds = new Set();

    for (let i = 0; i < rawIndex.length; i++) {
      const item = rawIndex[i];
      if (!item || !item.title) continue;

      // Filter out pure administrative polygon labels from directory cards
      const type = (item.type || "").toLowerCase();
      if (type === "district_boundary" || type === "regime") continue;

      const dedupeKey = `${item.title}_${item.district || ''}_${type}`;
      if (seenIds.has(dedupeKey)) continue;
      seenIds.add(dedupeKey);

      items.push({
        id: item.id || `infra-${i}`,
        name: item.title,
        subtitle: item.subtitle || "",
        category: categorizeItem(item),
        categoryLabel: item.category || "Infrastructure",
        district: item.district || extractDistrictFromSubtitle(item.subtitle) || "Gujarat",
        lat: item.lat || (item.coordinates ? item.coordinates[1] : null),
        lng: item.lng || (item.coordinates ? item.coordinates[0] : null),
        bounds: item.bounds || null,
        properties: item.properties || {},
        sourceItem: item
      });
    }

    state.directoryItems = items;
  }

  function categorizeItem(item) {
    const cat = (item.category || "").toLowerCase();
    const type = (item.type || "").toLowerCase();

    if (cat.includes("water") || type.includes("dam") || type.includes("canal") || type.includes("river") || type.includes("reservoir")) {
      return "water";
    }
    if (cat.includes("power") || cat.includes("energy") || cat.includes("grid") || type.includes("power") || type.includes("substation")) {
      return "energy";
    }
    if (cat.includes("road") || cat.includes("highway") || cat.includes("rail") || cat.includes("station") || cat.includes("bridge") || type.includes("road") || type.includes("structure") || type.includes("station")) {
      return "transport";
    }
    if (cat.includes("urban") || cat.includes("industry") || cat.includes("port") || cat.includes("airport") || cat.includes("metro") || type.includes("urban") || type.includes("port") || type.includes("airport")) {
      return "urban";
    }
    return "public";
  }

  function extractDistrictFromSubtitle(sub) {
    if (!sub) return "";
    const districts = [
      "Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch", "Bhavnagar",
      "Botad", "Chhota Udaipur", "Dahod", "Dang", "Devbhumi Dwarka", "Gandhinagar",
      "Gir Somnath", "Jamnagar", "Junagadh", "Kachchh", "Kheda", "Mahisagar", "Mehsana",
      "Morbi", "Narmada", "Navsari", "Panchmahal", "Patan", "Porbandar", "Rajkot",
      "Sabarkantha", "Surat", "Surendranagar", "Tapi", "Vadodara", "Valsad"
    ];
    for (const d of districts) {
      if (sub.includes(d)) return d;
    }
    return "";
  }

  function bindDirectoryControls() {
    // Category filter pills
    document.querySelectorAll(".dir-cat-pill").forEach(pill => {
      pill.addEventListener("click", () => {
        document.querySelectorAll(".dir-cat-pill").forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        state.directoryFilterCat = pill.getAttribute("data-cat") || "all";
        renderDirectory();
      });
    });

    // District select filter
    const distSelect = document.getElementById("dirDistrictFilter");
    if (distSelect) {
      distSelect.addEventListener("change", (e) => {
        state.directoryFilterDistrict = e.target.value;
        renderDirectory();
      });
    }

    // Directory search input
    const searchInput = document.getElementById("dirSearchInput");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        state.directorySearchQuery = (e.target.value || "").toLowerCase().trim();
        renderDirectory();
      });
    }
  }

  function renderDirectory() {
    const grid = document.getElementById("dirCardsGrid");
    const countEl = document.getElementById("dirResultsCount");
    if (!grid) return;

    if (state.directoryItems.length === 0) {
      buildDirectoryDataset();
    }

    const cat = state.directoryFilterCat;
    const dist = state.directoryFilterDistrict;
    const q = state.directorySearchQuery;

    const filtered = state.directoryItems.filter(item => {
      if (cat !== "all" && item.category !== cat) return false;
      if (dist && dist !== "" && item.district !== dist) return false;
      if (q && q.length > 0) {
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesSub = item.subtitle.toLowerCase().includes(q);
        const matchesDist = item.district.toLowerCase().includes(q);
        if (!matchesName && !matchesSub && !matchesDist) return false;
      }
      return true;
    });

    if (countEl) {
      countEl.textContent = `Showing ${filtered.length.toLocaleString()} verified infrastructure assets`;
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="dir-empty-state">
          <div class="dir-empty-icon">🔍</div>
          <h3>No matching infrastructure assets found</h3>
          <p>Try broadening your search term or selecting "All Categories" and "All Districts".</p>
        </div>
      `;
      return;
    }

    // Render first 72 items cleanly for instant performance
    const pageItems = filtered.slice(0, 72);
    grid.innerHTML = pageItems.map(item => `
      <article class="dir-card" data-id="${item.id}">
        <div class="dir-card-header">
          <span class="dir-badge dir-badge-${item.category}">${escapeHtml(item.categoryLabel)}</span>
          <span class="dir-district-tag">${escapeHtml(item.district)}</span>
        </div>
        <h3 class="dir-card-title">${escapeHtml(item.name)}</h3>
        <p class="dir-card-subtitle">${escapeHtml(item.subtitle)}</p>
        <div class="dir-card-actions">
          <button class="dir-action-btn btn-view-map" onclick="window.PublicViews.viewOnMap('${item.id}')">
            <span>🗺️ View on Map</span>
          </button>
          <button class="dir-action-btn btn-inspect" onclick="window.PublicViews.inspectDirectoryItem('${item.id}')">
            <span>Details</span>
          </button>
        </div>
      </article>
    `).join("");
  }

  function viewOnMap(itemId) {
    const item = state.directoryItems.find(i => i.id === itemId);
    if (!item) return;

    // Switch to Explore Map view
    switchDestination("explore", true);

    setTimeout(() => {
      if (window.map) {
        if (item.lat && item.lng) {
          window.map.flyTo([item.lat, item.lng], 13, { duration: 1.2 });
        } else if (item.bounds) {
          window.map.fitBounds(item.bounds, { padding: [40, 40], maxZoom: 14, duration: 1.2 });
        }
      }

      // Automatically inspect the asset
      if (window.inspectAsset && item.sourceItem) {
        window.inspectAsset({
          type: "Feature",
          properties: item.properties || item.sourceItem.properties || { name: item.name, district: item.district },
          geometry: {
            type: "Point",
            coordinates: [item.lng || 72.0, item.lat || 23.0]
          }
        });
      }
    }, 200);
  }

  function inspectDirectoryItem(itemId) {
    const item = state.directoryItems.find(i => i.id === itemId);
    if (!item) return;

    if (window.inspectAsset && item.sourceItem) {
      window.inspectAsset({
        type: "Feature",
        properties: item.properties || item.sourceItem.properties || { name: item.name, district: item.district },
        geometry: {
          type: "Point",
          coordinates: [item.lng || 72.0, item.lat || 23.0]
        }
      });
    }
  }

  // =========================================================================
  // 6. PROJECTS SHOWCASE ENGINE
  // =========================================================================

  function bindProjectsControls() {
    document.querySelectorAll(".proj-cat-pill").forEach(pill => {
      pill.addEventListener("click", () => {
        document.querySelectorAll(".proj-cat-pill").forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        state.projectsFilterCat = pill.getAttribute("data-cat") || "all";
        renderProjects();
      });
    });
  }

  function renderProjects() {
    const container = document.getElementById("projectsGrid") || document.getElementById("projectsCardsContainer");
    if (!container) return;

    const filter = state.projectsFilterCat;
    const filtered = STRATEGIC_PROJECTS.filter(p => filter === "all" || p.category === filter);

    container.innerHTML = filtered.map(p => {
      const manifestImg = (window.ImageManifest && window.ImageManifest.getProjectImage) ? window.ImageManifest.getProjectImage(p.id) : null;
      const imgUrl = manifestImg ? manifestImg.url : "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80";
      const altText = manifestImg ? manifestImg.alt : p.name;
      const credit = manifestImg ? manifestImg.credit : "";
      const isRender = manifestImg && manifestImg.type === "rendering";
      const mediaTag = isRender ? "📐 Master Plan Render" : "📷 Site Photograph";

      return `
      <article class="project-editorial-card" id="proj-${p.id}">
        <div class="project-card-image-wrap">
          <img src="${imgUrl}" alt="${escapeHtml(altText)}" class="project-card-img" loading="lazy" onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'img-fallback-box\\' style=\\'aspect-ratio: 16/9; display: flex; align-items: center; justify-content: center; background: #FAF6EE;\\'><span style=\\'font-size: 2.5rem;\\'>🏗️</span></div>';">
          <div class="project-card-floating-badge">
            <span class="project-cat-badge badge-${p.category}">${escapeHtml(p.categoryLabel)}</span>
            <span class="project-status-badge">${escapeHtml(p.status)}</span>
          </div>
          <div class="project-card-media-meta">
            <span class="project-media-type-pill ${isRender ? 'pill-render' : 'pill-photo'}">${mediaTag}</span>
            ${credit ? `<span class="project-credit-pill" title="${escapeHtml(credit)} • ${escapeHtml(manifestImg.license || 'Verified')}"><span class="attribution-dot">●</span> ${escapeHtml(credit)}</span>` : ''}
          </div>
        </div>

        <div class="project-card-body">
          <div class="project-card-top">
            <span class="project-district-tag">📍 ${escapeHtml(p.district)} • ${escapeHtml(p.location)}</span>
          </div>

          <h2 class="project-title">${escapeHtml(p.name)}</h2>
          <div class="project-agency-row">
            <span class="agency-label">Responsible Agency:</span>
            <span class="agency-name">${escapeHtml(p.agency)}</span>
          </div>

          <p class="project-summary-text">${escapeHtml(p.summary)}</p>

          <div class="project-facts-grid">
            ${p.facts.map(f => `
              <div class="project-fact-cell">
                <span class="fact-label">${escapeHtml(f.label)}</span>
                <strong class="fact-value">${escapeHtml(f.value)}</strong>
              </div>
            `).join("")}
          </div>

          <div class="project-card-footer">
            <div class="project-source-info">
              <span class="source-caption">Primary Statutory Source:</span>
              <span class="source-ref">${escapeHtml(p.sourceTitle)}</span>
            </div>
            <div class="project-actions">
              <button class="project-explore-btn" onclick="window.PublicViews.exploreProject('${p.id}')">
                <span>🗺️ Explore on Map</span>
              </button>
              <a href="${p.sourceUrl}" target="_blank" rel="noopener noreferrer" class="project-source-link">
                <span>Official Reference ↗</span>
              </a>
            </div>
          </div>
        </div>
      </article>
      `;
    }).join("");
  }

  function exploreProject(projectId) {
    const project = STRATEGIC_PROJECTS.find(p => p.id === projectId);
    if (!project) return;

    // Switch to Explore Map
    switchDestination("explore", true);

    setTimeout(() => {
      if (window.map && project.coordinates) {
        window.map.flyTo(project.coordinates, project.zoom || 11, { duration: 1.5 });
      }

      // Activate corresponding layers if LayerManager available
      if (window.LayerManager && project.relevantLayers) {
        project.relevantLayers.forEach(layerKey => {
          if (typeof window.LayerManager.setLayerVisible === "function") {
            window.LayerManager.setLayerVisible(layerKey, true);
          }
        });
      }

      // Inspect project card
      if (window.inspectAsset) {
        window.inspectAsset({
          type: "Feature",
          properties: {
            name: project.name,
            asset_category: project.categoryLabel,
            district: project.district,
            location: project.location,
            operating_agency: project.agency,
            status: project.status,
            scale: project.scale,
            summary: project.summary,
            source_org: project.sourceTitle,
            source_url: project.sourceUrl,
            classification: "statutory_verified",
            data_limitations: "Compiled from official project master plans and gazette notifications."
          },
          geometry: {
            type: "Point",
            coordinates: [project.coordinates[1], project.coordinates[0]]
          }
        });
      }
    }, 250);
  }

  // Helper
  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // =========================================================================
  // 7. PUBLIC API EXPOSURE
  // =========================================================================

  window.PublicViews = {
    init,
    switchDestination,
    applyTheme,
    viewOnMap,
    inspectDirectoryItem,
    exploreProject,
    getStrategicProjects: () => STRATEGIC_PROJECTS
  };

  // Auto-init on DOMContentLoaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})(window, document);
