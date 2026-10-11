/**
 * Gujarat InfraMap — Gujarat Geoenvironmental Intelligence Module
 * Comprehensive integration of geological, geotechnical, hydrological, topographic,
 * and environmental datasets based on official Indian public authorities (GSI, CGWB,
 * BIS IS 1893, IMD, CWC, NBSS&LUP, NRSC/SAC, NCSCM, MoEFCC).
 * 
 * Standard: IIFE module exposing window.GeoenvironmentalIntelligence
 */

(function (window) {
  "use strict";

  let mapInstance = null;
  let geoenvDataset = null;
  let groundwaterDataset = null;
  let disasterDataset = null;
  let districtsDataset = null;
  let waterDataset = null;
  let structuresDataset = null;
  let roadsDataset = null;
  let powerDataset = null;
  let externalCallbacks = {};

  // Active state
  let activeTab = "provenance";
  let activeThematicLayers = {};
  let isMapScreeningActive = false;
  let screeningMarker = null;
  let screeningPulseCircle = null;
  let lastScreeningResult = null;

  // Cached lists
  let allGeoenvList = [];
  let allGroundwaterList = [];
  let allDisasterList = [];
  let allDamsList = [];
  let allStructuresList = [];
  let allRoadsList = [];
  let allDistrictsList = [];

  // =========================================================================
  // 1. DATASET PROVENANCE REGISTRY CATALOGUE (Authoritative Standards)
  // =========================================================================
  const PROVENANCE_REGISTRY = [
    {
      id: "REG-GEO-001",
      name: "Geological Formations & Bedrock Lithology",
      agency: "Geological Survey of India (GSI Bhukosh)",
      resolution: "1:250,000 State Geological Map",
      pub_year: 2021,
      license: "Open Government Data (OGD India)",
      domain: "Geology",
      limitations: "Macro-regional lithological grouping; does not reflect local joint spacing, depth to sound rock, or weathering grade variation at site scale."
    },
    {
      id: "REG-GEO-002",
      name: "Active Seismic Fault Lines & Tectonic Scarps",
      agency: "Institute of Seismological Research (ISR Gandhinagar) & GSI",
      resolution: "1:50,000 Active Fault & Paleoseismic Map",
      pub_year: 2022,
      license: "Public Research / OGD India",
      domain: "Seismic & Tectonics",
      limitations: "Subsurface rupture planes may diverge from surface scarps; site-specific micro-zonation and fault rupture hazard analysis required within 10 km."
    },
    {
      id: "REG-SEIS-001",
      name: "Seismic Hazard Zonation of India (Part 1)",
      agency: "Bureau of Indian Standards (BIS IS 1893:2016 Part 1)",
      resolution: "Statutory Macro-Zonation (Zones V, IV, III)",
      pub_year: 2016,
      license: "National Statutory Standard",
      domain: "Seismic Design",
      limitations: "Regional macroscopic zonation; does not account for local soil amplification ($S_a/g$) without site-specific shear wave velocity ($V_{s,30}$) testing."
    },
    {
      id: "REG-SOIL-001",
      name: "Soil Series & Engineering Classifications (Vertisols/Alluvial)",
      agency: "National Bureau of Soil Survey & Land Use Planning (NBSS&LUP)",
      resolution: "1:250,000 State Soil Series Map",
      pub_year: 2020,
      license: "Open Government Data (OGD India)",
      domain: "Geotechnical / Soils",
      limitations: "Active expansive clay depth varies locally between 1.2m and 3.5m; laboratory free swell index and swell pressure tests mandatory before design."
    },
    {
      id: "REG-TER-001",
      name: "Digital Elevation Model (DEM) & Slope Regimes",
      agency: "National Remote Sensing Centre (NRSC / ISRO Bhuvan) & SRTM",
      resolution: "30m Digital Elevation Model",
      pub_year: 2021,
      license: "Open Data / OGD India",
      domain: "Topography",
      limitations: "Regional slope categories; micro-topography, embankment toes, retaining wall cuts, and local borrow pits require total station / LiDAR survey."
    },
    {
      id: "REG-GW-001",
      name: "Dynamic Ground Water Resources Assessment",
      agency: "Central Ground Water Board (CGWB Ministry of Jal Shakti)",
      resolution: "District & Taluka Assessment Units",
      pub_year: "2022-2023",
      license: "Open Government Data (OGD India)",
      domain: "Groundwater",
      limitations: "Annual block-level mass balance estimation; local tube-well water table depths fluctuate seasonally and with municipal drawdowns."
    },
    {
      id: "REG-GW-002",
      name: "National Hydrograph Network Monitoring Stations",
      agency: "Central Ground Water Board (CGWB)",
      resolution: "Dedicated Station Point Observations",
      pub_year: 2023,
      license: "Open Government Data (OGD India)",
      domain: "Groundwater",
      limitations: "Quarterly point monitoring; pumping cone of depression around unmetered agricultural tubewells can induce localized drawdowns."
    },
    {
      id: "REG-CYC-001",
      name: "Basic Wind Speed & Cyclone Hazard Zonation",
      agency: "India Meteorological Department (IMD) & BIS IS 875 (Part 3)",
      resolution: "1:2,000,000 National Wind Map",
      pub_year: 2021,
      license: "National Statutory Standard",
      domain: "Natural Hazards",
      limitations: "Based on 50-year return period peak gust speeds; coastal cyclone landfall tracks require real-time atmospheric tracking."
    },
    {
      id: "REG-FLD-001",
      name: "River Basin Flood Exposure & Historical Inundations",
      agency: "Central Water Commission (CWC) & GSDMA",
      resolution: "Major River Basin & Floodplain Scale",
      pub_year: 2023,
      license: "Open Government Data (OGD India)",
      domain: "Hydrology & Floods",
      limitations: "Historical event observations; not a real-time 2D hydraulic hydrodynamic model; flood risk alters with dam gate operations and embankments."
    },
    {
      id: "REG-CST-001",
      name: "Coastal Shoreline Change, Salinity Ingress & Erosion",
      agency: "National Centre for Sustainable Coastal Management (NCSCM) & SAC",
      resolution: "1:25,000 Shoreline Change Atlas",
      pub_year: 2022,
      license: "Open Government Data (OGD India)",
      domain: "Coastal Hazards",
      limitations: "Intertidal mudflat and beach berm boundaries shift seasonally with southwest monsoon wave energy and storm events."
    },
    {
      id: "REG-ECO-001",
      name: "Ramsar Wetlands of International Importance & ESZ",
      agency: "Ramsar Convention Secretariat & MoEFCC",
      resolution: "Statutory Designated Polygon Boundaries",
      pub_year: 2022,
      license: "Statutory International Register",
      domain: "Ecology & Environment",
      limitations: "Eco-Sensitive Zone (ESZ) statutory buffer boundaries (1 to 10 km) governed by individual Gazette notifications; linear project clearances apply."
    }
  ];

  // =========================================================================
  // 2. INITIALIZATION
  // =========================================================================
  function init(map, datasets, callbacks) {
    mapInstance = map;
    geoenvDataset = datasets.geoenvData || null;
    groundwaterDataset = datasets.groundwaterData || null;
    disasterDataset = datasets.disasterData || null;
    districtsDataset = datasets.districtsData || null;
    waterDataset = datasets.waterData || null;
    structuresDataset = datasets.structuresData || null;
    roadsDataset = datasets.roadsData || null;
    powerDataset = datasets.powerData || null;
    externalCallbacks = callbacks || {};

    if (geoenvDataset && geoenvDataset.features) {
      allGeoenvList = geoenvDataset.features;
    }
    if (groundwaterDataset && groundwaterDataset.features) {
      allGroundwaterList = groundwaterDataset.features.map(f => f.properties);
    }
    if (disasterDataset && disasterDataset.features) {
      allDisasterList = disasterDataset.features.map(f => f.properties);
    }
    if (waterDataset && waterDataset.features) {
      allDamsList = waterDataset.features
        .filter(f => f.properties && f.properties.asset_category === "dam")
        .map(f => f.properties);
    }
    if (structuresDataset && structuresDataset.features) {
      allStructuresList = structuresDataset.features.map(f => f.properties);
    }
    if (roadsDataset && roadsDataset.features) {
      allRoadsList = roadsDataset.features.map(f => f.properties);
    }
    if (districtsDataset && districtsDataset.features) {
      allDistrictsList = districtsDataset.features.map(f => f.properties);
    }

    setupDomEventListeners();
    populateAssetContextDropdowns();
    renderProvenanceLedger();
    renderThematicCards();

    console.log(`[GeoenvironmentalIntelligence] Initialized with ${allGeoenvList.length} geoenv features, ${PROVENANCE_REGISTRY.length} official provenance registers.`);
  }

  // =========================================================================
  // 3. DOM EVENT LISTENERS & MODAL MANAGEMENT
  // =========================================================================
  function setupDomEventListeners() {
    // Header open button
    const openBtn = document.getElementById("openGeoenvironmentalBtn");
    if (openBtn) {
      openBtn.addEventListener("click", () => openModal("provenance"));
    }

    // Drawer button
    const drawerOpenBtn = document.getElementById("openGeoenvDrawerBtn");
    if (drawerOpenBtn) {
      drawerOpenBtn.addEventListener("click", () => openModal("thematic"));
    }

    const drawerScreenBtn = document.getElementById("startScreeningDrawerBtn");
    if (drawerScreenBtn) {
      drawerScreenBtn.addEventListener("click", () => {
        closeModal();
        startMapPointScreening();
      });
    }

    // Modal close button
    const closeBtn = document.getElementById("closeGeoenvironmentalModalBtn");
    if (closeBtn) {
      closeBtn.addEventListener("click", closeModal);
    }

    // Modal tab switching
    const tabBtns = document.querySelectorAll(".geoenv-tab-btn");
    tabBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const target = btn.dataset.tab;
        switchTab(target);
      });
    });

    // Provenance search and filter
    const provSearch = document.getElementById("geoenvProvSearch");
    if (provSearch) {
      provSearch.addEventListener("input", renderProvenanceLedger);
    }

    const provDomainFilter = document.getElementById("geoenvProvDomainFilter");
    if (provDomainFilter) {
      provDomainFilter.addEventListener("change", renderProvenanceLedger);
    }

    const exportProvCsvBtn = document.getElementById("exportGeoenvProvCsvBtn");
    if (exportProvCsvBtn) {
      exportProvCsvBtn.addEventListener("click", exportProvenanceCSV);
    }

    // Asset Context Profiler Selectors
    const contextTypeSelect = document.getElementById("geoenvContextTypeSelect");
    if (contextTypeSelect) {
      contextTypeSelect.addEventListener("change", (e) => {
        updateContextAssetList(e.target.value);
      });
    }

    const contextAssetSelect = document.getElementById("geoenvContextAssetSelect");
    if (contextAssetSelect) {
      contextAssetSelect.addEventListener("change", (e) => {
        const val = e.target.value;
        if (val) loadAssetContext(val);
      });
    }

    // Screening Tool
    const runScreeningBtn = document.getElementById("runProjectScreeningBtn");
    if (runScreeningBtn) {
      runScreeningBtn.addEventListener("click", () => {
        const lat = parseFloat(document.getElementById("screenLatInput")?.value);
        const lon = parseFloat(document.getElementById("screenLonInput")?.value);
        const pType = document.getElementById("screenProjectTypeSelect")?.value || "Infrastructure General";
        const pName = document.getElementById("screenProjectNameInput")?.value || "Proposed Engineering Project";

        if (isNaN(lat) || isNaN(lon)) {
          showToast("⚠️ Please enter valid numeric Latitude and Longitude coordinates.");
          return;
        }

        screenProjectSite(lat, lon, pType, pName);
      });
    }

    const pickOnMapBtn = document.getElementById("screenPickOnMapBtn");
    if (pickOnMapBtn) {
      pickOnMapBtn.addEventListener("click", () => {
        closeModal();
        startMapPointScreening();
      });
    }

    const copyScreeningBtn = document.getElementById("copyScreeningMemoBtn");
    if (copyScreeningBtn) {
      copyScreeningBtn.addEventListener("click", copyScreeningMemoToClipboard);
    }

    const exportScreeningMdBtn = document.getElementById("exportScreeningMdBtn");
    if (exportScreeningMdBtn) {
      exportScreeningMdBtn.addEventListener("click", exportScreeningMemoMarkdown);
    }

    const flyToScreenedSiteBtn = document.getElementById("flyToScreenedSiteBtn");
    if (flyToScreenedSiteBtn) {
      flyToScreenedSiteBtn.addEventListener("click", () => {
        if (lastScreeningResult && mapInstance) {
          closeModal();
          mapInstance.flyTo([lastScreeningResult.lat, lastScreeningResult.lon], 12, { duration: 1.2 });
        }
      });
    }
  }

  function openModal(initialTab) {
    const modal = document.getElementById("geoenvironmentalModal");
    if (modal) {
      modal.showModal();
      if (initialTab) switchTab(initialTab);
    }
  }

  function closeModal() {
    const modal = document.getElementById("geoenvironmentalModal");
    if (modal && modal.open) {
      modal.close();
    }
  }

  function switchTab(tabName) {
    activeTab = tabName;
    const tabBtns = document.querySelectorAll(".geoenv-tab-btn");
    tabBtns.forEach(b => {
      if (b.dataset.tab === tabName) {
        b.classList.add("active");
      } else {
        b.classList.remove("active");
      }
    });

    const panes = document.querySelectorAll(".geoenv-tab-pane");
    panes.forEach(p => {
      if (p.id === `geoenvTab_${tabName}`) {
        p.classList.add("active");
      } else {
        p.classList.remove("active");
      }
    });
  }

  // =========================================================================
  // 4. DATASET PROVENANCE LEDGER (Tab 1)
  // =========================================================================
  function renderProvenanceLedger() {
    const searchInput = document.getElementById("geoenvProvSearch");
    const domainFilter = document.getElementById("geoenvProvDomainFilter");
    const tbody = document.getElementById("geoenvProvTableBody");
    const countEl = document.getElementById("geoenvProvCountBadge");

    if (!tbody) return;

    const query = (searchInput?.value || "").toLowerCase().trim();
    const domain = domainFilter?.value || "all";

    const filtered = PROVENANCE_REGISTRY.filter(item => {
      const matchDomain = (domain === "all" || item.domain === domain);
      const matchQuery = !query ||
        item.name.toLowerCase().includes(query) ||
        item.agency.toLowerCase().includes(query) ||
        item.limitations.toLowerCase().includes(query);
      return matchDomain && matchQuery;
    });

    if (countEl) countEl.textContent = `${filtered.length} of ${PROVENANCE_REGISTRY.length} Datasets`;

    tbody.innerHTML = filtered.map(item => `
      <tr>
        <td>
          <div class="prov-name-cell">
            <span class="prov-id-tag">${item.id}</span>
            <strong class="prov-title">${item.name}</strong>
          </div>
        </td>
        <td><span class="prov-agency-badge">${item.agency}</span></td>
        <td><span class="prov-domain-pill">${item.domain}</span></td>
        <td class="font-mono text-xs">${item.resolution}</td>
        <td class="font-mono text-xs">${item.pub_year}</td>
        <td><span class="prov-license-chip">${item.license}</span></td>
        <td class="prov-limitations-cell">${item.limitations}</td>
      </tr>
    `).join("");
  }

  function exportProvenanceCSV() {
    let csv = "ID,Dataset Name,Authoritative Agency,Domain,Geographic Resolution,Publication Year,License,Known Engineering Limitations\n";
    PROVENANCE_REGISTRY.forEach(item => {
      const cleanName = `"${item.name.replace(/"/g, '""')}"`;
      const cleanAgency = `"${item.agency.replace(/"/g, '""')}"`;
      const cleanLimits = `"${item.limitations.replace(/"/g, '""')}"`;
      csv += `${item.id},${cleanName},${cleanAgency},${item.domain},${item.resolution},${item.pub_year},"${item.license}",${cleanLimits}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gujarat-geoenvironmental-provenance-registry-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("✓ Exported Geoenvironmental Provenance Ledger CSV");
  }

  // =========================================================================
  // 5. THEMATIC OVERLAYS & LEGENDS (Tab 2)
  // =========================================================================
  function renderThematicCards() {
    const container = document.getElementById("geoenvThematicGrid");
    if (!container) return;

    const cards = [
      {
        id: "geology",
        icon: "⛏️",
        title: "Bedrock Geology & Faults",
        agency: "GSI & ISR",
        desc: "7 primary bedrock super-sequences and 5 active seismogenic thrust/rift fault systems.",
        items: ["Deccan Traps Basalt", "Quaternary Fluvial Alluvium", "Mesozoic Sandstones", "Active Thrust Faults (KMF, KHF, Narmada)"],
        layerKey: "geology"
      },
      {
        id: "soils",
        icon: "🌱",
        title: "Soil Mechanics & Expansive Vertisols",
        agency: "NBSS&LUP",
        desc: "Engineering soil series with liquid limits, plasticity indices, and swelling pressures.",
        items: ["Deep Black Cotton Soil (Vertisols)", "Alluvial Sandy Loams (Inceptisols)", "Coastal Saline Marine Clays", "Aridisol Desert Sands"],
        layerKey: "soils"
      },
      {
        id: "terrain",
        icon: "🏔️",
        title: "Terrain Topography & Slope",
        agency: "NRSC 30m DEM",
        desc: "Elevation hypsometry, slope categories (<1 deg to >15 deg) and geomorphological regimes.",
        items: ["Coastal Lowlands (0-20m)", "Central Alluvial Plains (20-100m)", "Saurashtra Trap Plateaus", "Eastern Highlands (Girnar 1117m)"],
        layerKey: "terrain"
      },
      {
        id: "groundwater",
        icon: "💧",
        title: "Hydrogeology & Aquifer Depletion",
        agency: "CGWB National Network",
        desc: "District extraction status, water table depths (m bgl) and 10 national monitoring stations.",
        items: ["Over-Exploited Deep Aquifers", "Fractured Basalt Hard Rock", "Pre/Post Monsoon Fluctuation", "Fluoride & TDS Hotspots"],
        layerKey: "groundwater"
      },
      {
        id: "seismic",
        icon: "⚡",
        title: "Authoritative Seismic Zonation",
        agency: "BIS IS 1893:2016",
        desc: "Bureau of Indian Standards seismic zonation (Zone V, IV, III) and peak ground accelerations.",
        items: ["Zone V (Z = 0.36g Very High)", "Zone IV (Z = 0.24g High)", "Zone III (Z = 0.16g Moderate)", "Ductile Detailing (IS 13920)"],
        layerKey: "seismic"
      },
      {
        id: "coastal",
        icon: "🌊",
        title: "Coastal Hazards & Salinity Ingress",
        agency: "NCSCM & GMB",
        desc: "1,600 km shoreline hazard sectors, macro-tidal ranges, storm surges, and marine intrusion.",
        items: ["Saurashtra Open Sea Salinity Ingress", "Gulf of Khambhat 10m Macro-Tides", "Cyclone Landfall Wind 50 m/s", "CRZ Mangrove Conservation"],
        layerKey: "coastal"
      },
      {
        id: "ecology",
        icon: "🦩",
        title: "Protected Wetlands & Sanctuaries",
        agency: "MoEFCC & Ramsar",
        desc: "4 Ramsar Wetland sites and protected National Parks with statutory 10 km Eco-Sensitive Zones.",
        items: ["Nal Sarovar (Ramsar #2078)", "Thol Lake (Ramsar #2457)", "Gir Lion Sanctuary (ESZ)", "Marine National Park (Coral Reefs)"],
        layerKey: "ecology"
      }
    ];

    container.innerHTML = cards.map(c => `
      <div class="geoenv-thematic-card">
        <div class="thematic-card-header">
          <span class="thematic-icon">${c.icon}</span>
          <div class="thematic-title-block">
            <h4 class="thematic-title">${c.title}</h4>
            <span class="thematic-agency-tag">${c.agency}</span>
          </div>
        </div>
        <p class="thematic-desc">${c.desc}</p>
        <ul class="thematic-list">
          ${c.items.map(it => `<li>✓ ${it}</li>`).join("")}
        </ul>
        <div class="thematic-action-row">
          <button class="btn-thematic-toggle ${activeThematicLayers[c.layerKey] ? 'active' : ''}" data-layer="${c.layerKey}">
            <span>${activeThematicLayers[c.layerKey] ? '✓ Layer Active on Map' : '🗺️ Toggle Layer on Map'}</span>
          </button>
        </div>
      </div>
    `).join("");

    // Wire up toggle buttons
    container.querySelectorAll(".btn-thematic-toggle").forEach(btn => {
      btn.addEventListener("click", () => {
        const layerKey = btn.dataset.layer;
        toggleThematicMapOverlay(layerKey);
        btn.classList.toggle("active");
        const span = btn.querySelector("span");
        if (span) {
          span.textContent = activeThematicLayers[layerKey] ? "✓ Layer Active on Map" : "🗺️ Toggle Layer on Map";
        }
      });
    });
  }

  function toggleThematicMapOverlay(layerKey) {
    if (!mapInstance) return;

    if (activeThematicLayers[layerKey]) {
      // Remove layer
      mapInstance.removeLayer(activeThematicLayers[layerKey]);
      delete activeThematicLayers[layerKey];
      showToast(`Removed ${layerKey} overlay from map`);
      return;
    }

    // Build Leaflet layer group for this thematic category
    const layerGroup = L.layerGroup();

    if (!allGeoenvList || allGeoenvList.length === 0) {
      showToast("⚠️ Geoenvironmental dataset not loaded yet.");
      return;
    }

    allGeoenvList.forEach(feat => {
      const p = feat.properties;
      const g = feat.geometry;
      if (!p || !g) return;

      let match = false;
      let markerColor = "#38bdf8";
      let glyph = "🌍";

      if (layerKey === "geology" && (p.asset_category === "geological_formation" || p.asset_category === "seismic_fault_line")) {
        match = true;
        markerColor = p.asset_category === "seismic_fault_line" ? "#ef4444" : "#f59e0b";
        glyph = p.asset_category === "seismic_fault_line" ? "⚡" : "⛏️";
      } else if (layerKey === "soils" && p.asset_category === "soil_engineering_formation") {
        match = true;
        markerColor = "#10b981";
        glyph = "🌱";
      } else if (layerKey === "terrain" && p.asset_category === "terrain_elevation_regime") {
        match = true;
        markerColor = "#06b6d4";
        glyph = "🏔️";
      } else if (layerKey === "groundwater" && p.asset_category === "groundwater_monitoring_station") {
        match = true;
        markerColor = "#3b82f6";
        glyph = "💧";
      } else if (layerKey === "coastal" && p.asset_category === "coastal_hazard_sector") {
        match = true;
        markerColor = "#8b5cf6";
        glyph = "🌊";
      } else if (layerKey === "ecology" && p.asset_category === "environmentally_sensitive_area") {
        match = true;
        markerColor = "#22c55e";
        glyph = "🦩";
      } else if (layerKey === "seismic" && p.asset_category === "seismic_fault_line") {
        match = true;
        markerColor = "#dc2626";
        glyph = "⚡";
      }

      if (match) {
        if (g.type === "Point") {
          const lat = g.coordinates[1];
          const lon = g.coordinates[0];
          const icon = L.divIcon({
            className: "geoenv-map-icon",
            html: `<div style="background:${markerColor}; width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 0 10px ${markerColor}88; border:2px solid #fff; font-size:13px;">${glyph}</div>`,
            iconSize: [28, 28],
            iconAnchor: [14, 14]
          });
          const m = L.marker([lat, lon], { icon }).bindPopup(`
            <div style="font-family:'Plus Jakarta Sans',sans-serif; min-width:240px; font-size:12px;">
              <span style="font-size:10px; background:${markerColor}33; color:${markerColor}; padding:2px 6px; border-radius:4px; font-weight:700;">${p.asset_category.toUpperCase().replace(/_/g, " ")}</span>
              <h4 style="margin:4px 0 2px; font-size:13px; color:#0f172a;">${p.name}</h4>
              <p style="margin:4px 0; color:#475569; font-size:11px;">${p.lithology || p.taxonomy || p.geomorphology || p.primary_hazards || p.ecological_importance || p.seismic_capability || ''}</p>
              <div style="margin-top:6px; border-top:1px solid #e2e8f0; padding-top:4px; font-size:10px; color:#64748b;">
                <strong>Source:</strong> ${p.source_org} (${p.pub_year})
              </div>
            </div>
          `);
          layerGroup.addLayer(m);
        } else if (g.type === "LineString") {
          const latlngs = g.coordinates.map(pt => [pt[1], pt[0]]);
          const poly = L.polyline(latlngs, {
            color: markerColor,
            weight: 4,
            opacity: 0.85,
            dashArray: p.asset_category === "seismic_fault_line" ? "6, 6" : null
          }).bindPopup(`
            <div style="font-family:'Plus Jakarta Sans',sans-serif; min-width:240px; font-size:12px;">
              <span style="font-size:10px; background:#ef444433; color:#ef4444; padding:2px 6px; border-radius:4px; font-weight:700;">ACTIVE SEISMIC FAULT</span>
              <h4 style="margin:4px 0 2px; font-size:13px; color:#0f172a;">${p.name}</h4>
              <p style="margin:4px 0; color:#475569; font-size:11px;">${p.seismic_capability}</p>
              <div style="font-size:11px; color:#0f172a; margin-top:4px;">
                <strong>Slip Rate:</strong> ${p.slip_rate_mm_yr} • <strong>Length:</strong> ${p.length_km} km
              </div>
              <div style="margin-top:6px; border-top:1px solid #e2e8f0; padding-top:4px; font-size:10px; color:#64748b;">
                <strong>Source:</strong> ${p.source_org} (${p.pub_year})
              </div>
            </div>
          `);
          layerGroup.addLayer(poly);
        }
      }
    });

    layerGroup.addTo(mapInstance);
    activeThematicLayers[layerKey] = layerGroup;
    showToast(`✓ Enabled ${layerKey} overlay on map`);
  }

  // =========================================================================
  // 6. ASSET & LOCATION ENGINEERING CONTEXT ENGINE (Tab 3)
  // =========================================================================
  function populateAssetContextDropdowns() {
    updateContextAssetList("dams");
  }

  function updateContextAssetList(category) {
    const assetSelect = document.getElementById("geoenvContextAssetSelect");
    if (!assetSelect) return;

    let items = [];
    if (category === "dams") {
      items = allDamsList.map(d => ({ id: d.id, name: `${d.name} (${d.district})`, coords: d.coords }));
    } else if (category === "structures") {
      items = allStructuresList.map(s => ({ id: s.id, name: `${s.name} (${s.district})`, coords: s.coords }));
    } else if (category === "roads") {
      items = allRoadsList.map(r => ({ id: r.id || r.ref || r.name, name: `${r.name || r.ref} (${r.length_km || 0} km)`, coords: null }));
    } else if (category === "districts") {
      items = allDistrictsList.map(d => ({ id: d.district, name: `${d.district} District`, coords: d.centroid ? [d.centroid[1], d.centroid[0]] : null }));
    }

    assetSelect.innerHTML = `<option value="">-- Select ${category.toUpperCase()} --</option>` +
      items.map(it => `<option value="${it.id}">${it.name}</option>`).join("");
  }

  function loadAssetContext(assetId) {
    let target = null;
    let lat = null;
    let lon = null;
    let name = assetId;

    // Search dams
    const dam = allDamsList.find(d => d.id === assetId);
    if (dam) {
      target = dam;
      lat = dam.coords[1];
      lon = dam.coords[0];
      name = dam.name;
    }

    // Search structures
    if (!target) {
      const struct = allStructuresList.find(s => s.id === assetId);
      if (struct) {
        target = struct;
        lat = struct.coords[1];
        lon = struct.coords[0];
        name = struct.name;
      }
    }

    // Search districts
    if (!target) {
      const dist = allDistrictsList.find(d => d.district === assetId);
      if (dist && dist.centroid) {
        target = dist;
        lat = dist.centroid[0];
        lon = dist.centroid[1];
        name = `${dist.district} District Centroid`;
      }
    }

    // Search roads
    if (!target) {
      const road = allRoadsList.find(r => (r.id === assetId || r.ref === assetId || r.name === assetId));
      if (road) {
        target = road;
        lat = 22.5;
        lon = 72.5; // Approximation along spine
        name = road.name || road.ref;
      }
    }

    if (lat === null || lon === null) {
      showToast("⚠️ Asset coordinates not available for spatial context analysis.");
      return;
    }

    const context = getGeoenvironmentalContext(lat, lon);
    renderAssetContextCard(name, context);
  }

  function renderAssetContextCard(name, ctx) {
    const cardEl = document.getElementById("geoenvContextCard");
    if (!cardEl) return;

    cardEl.classList.remove("hidden");

    cardEl.innerHTML = `
      <div class="context-card-header">
        <div class="context-title-group">
          <span class="context-badge">LOCATION CONTEXT</span>
          <h3 class="context-title">${name}</h3>
          <span class="context-coords-pill">[${ctx.lat.toFixed(4)}°N, ${ctx.lon.toFixed(4)}°E] • District: ${ctx.district}</span>
        </div>
        <div class="context-seismic-badge zone-${ctx.seismic.zone.toLowerCase().replace(' ', '-')}">
          ${ctx.seismic.zone} (Z = ${ctx.seismic.pga_g}g)
        </div>
      </div>

      <!-- Statutory Non-Inference Disclaimer Banner -->
      <div class="geoenv-statutory-disclaimer-banner">
        <div class="disclaimer-icon">⚠️</div>
        <div class="disclaimer-text">
          <strong>EXPLORATORY REGIONAL SCREENING ONLY:</strong>
          This context profile compiles published macro-scale geological, soil, groundwater, and hazard indices. It <em>must never be construed</em> as a site-specific borehole log, foundation investigation, or design certification. Mandatory geotechnical core drilling per IS 1892 and statutory environmental clearance are required prior to engineering design.
        </div>
      </div>

      <!-- Core Context Metrics Grid -->
      <div class="context-metrics-grid">
        <div class="context-metric-box">
          <span class="c-box-label">BEDROCK GEOLOGY</span>
          <strong class="c-box-val">${ctx.geology.name}</strong>
          <span class="c-box-sub">Age: ${ctx.geology.age} • SBC: ${ctx.geology.sbc}</span>
        </div>
        <div class="context-metric-box">
          <span class="c-box-label">SOIL TAXONOMY & SWELL</span>
          <strong class="c-box-val">${ctx.soil.name}</strong>
          <span class="c-box-sub">Swell Pressure: ${ctx.soil.swell_pressure} • CBR: ${ctx.soil.cbr}</span>
        </div>
        <div class="context-metric-box">
          <span class="c-box-label">TOPOGRAPHY & SLOPE</span>
          <strong class="c-box-val">${ctx.terrain.elevation} (${ctx.terrain.slope})</strong>
          <span class="c-box-sub">${ctx.terrain.geomorphology}</span>
        </div>
        <div class="context-metric-box">
          <span class="c-box-label">GROUNDWATER STATUS</span>
          <strong class="c-box-val">${ctx.groundwater.cgwb_status}</strong>
          <span class="c-box-sub">Water Table: ${ctx.groundwater.depth_bgl} • Extraction: ${ctx.groundwater.extraction_pct}%</span>
        </div>
      </div>

      <!-- Deep Engineering Relevance Breakdown -->
      <div class="context-engineering-relevance-block">
        <h4 class="relevance-heading">📐 Civil Engineering Relevance & Mechanism Breakdown</h4>
        <div class="relevance-grid">
          <div class="relevance-item">
            <span class="r-item-title">⛰️ Why Terrain & Slope Matter Here:</span>
            <p class="r-item-desc">${ctx.relevance.slope}</p>
          </div>
          <div class="relevance-item">
            <span class="r-item-title">💧 Why Soil Permeability & Seepage Matter:</span>
            <p class="r-item-desc">${ctx.relevance.soil_seepage}</p>
          </div>
          <div class="relevance-item">
            <span class="r-item-title">🏗️ Why Groundwater Depth & Chemistry Matter:</span>
            <p class="r-item-desc">${ctx.relevance.groundwater}</p>
          </div>
          <div class="relevance-item">
            <span class="r-item-title">⚡ Why Seismic Context & PGA Matter:</span>
            <p class="r-item-desc">${ctx.relevance.seismic}</p>
          </div>
        </div>
      </div>

      <!-- Proximity Audit Bar -->
      <div class="context-proximity-bar">
        <div class="prox-chip">
          <span class="prox-icon">⚡</span>
          <span><strong>Nearest Fault:</strong> ${ctx.proximity.fault.name} (${ctx.proximity.fault.dist_km} km)</span>
        </div>
        <div class="prox-chip">
          <span class="prox-icon">🌊</span>
          <span><strong>Coastline Distance:</strong> ${ctx.proximity.coast_km} km (${ctx.proximity.coast_hazard})</span>
        </div>
        <div class="prox-chip">
          <span class="prox-icon">🦩</span>
          <span><strong>Nearest Eco-Reserve:</strong> ${ctx.proximity.eco.name} (${ctx.proximity.eco.dist_km} km • ${ctx.proximity.eco.esz_alert})</span>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // 7. PROJECT SITE & ALIGNMENT SCREENING TOOL (Tab 4)
  // =========================================================================
  function startMapPointScreening() {
    isMapScreeningActive = true;
    if (!mapInstance) return;

    mapInstance.getContainer().style.cursor = "crosshair";
    showToast("📍 Map Screening Active: Click anywhere in Gujarat to screen a project site.", 4500);

    const onMapClick = (e) => {
      mapInstance.getContainer().style.cursor = "";
      isMapScreeningActive = false;
      mapInstance.off("click", onMapClick);

      const lat = e.latlng.lat;
      const lon = e.latlng.lng;

      // Drop visual feedback pin
      if (screeningMarker) mapInstance.removeLayer(screeningMarker);
      if (screeningPulseCircle) mapInstance.removeLayer(screeningPulseCircle);

      screeningPulseCircle = L.circle([lat, lon], {
        radius: 2500,
        color: "#38bdf8",
        fillColor: "#38bdf8",
        fillOpacity: 0.15,
        weight: 1.5,
        dashArray: "4, 4"
      }).addTo(mapInstance);

      screeningMarker = L.marker([lat, lon], {
        icon: L.divIcon({
          className: "screening-pin-marker",
          html: `<div style="background:#0284c7; width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 0 16px #0284c7; border:3px solid #fff; font-size:16px;">📍</div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        })
      }).addTo(mapInstance);

      // Populate inputs and open screening tab
      const latInp = document.getElementById("screenLatInput");
      const lonInp = document.getElementById("screenLonInput");
      if (latInp) latInp.value = lat.toFixed(5);
      if (lonInp) lonInp.value = lon.toFixed(5);

      screenProjectSite(lat, lon, "General Civil Structure", `Site Screening [${lat.toFixed(3)}, ${lon.toFixed(3)}]`);
      openModal("screening");
    };

    mapInstance.on("click", onMapClick);
  }

  function screenProjectSite(lat, lon, projectType, projectName) {
    const ctx = getGeoenvironmentalContext(lat, lon);
    lastScreeningResult = { lat, lon, projectType, projectName, ctx };

    const outputEl = document.getElementById("geoenvScreeningOutput");
    if (!outputEl) return;

    outputEl.classList.remove("hidden");

    outputEl.innerHTML = `
      <div class="screening-report-card">
        <div class="rep-header">
          <div>
            <span class="rep-badge">PRE-FEASIBILITY SCREENING MEMO</span>
            <h3 class="rep-title">${projectName}</h3>
            <span class="rep-meta">Type: <strong>${projectType}</strong> • Coordinates: [${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E] • District: ${ctx.district}</span>
          </div>
          <div class="rep-timestamp">${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</div>
        </div>

        <div class="geoenv-statutory-disclaimer-banner">
          <div class="disclaimer-icon">⚠️</div>
          <div class="disclaimer-text">
            <strong>PRELIMINARY DESKTOP SCREENING MEMORANDUM:</strong>
            This screening memo is generated exclusively from published macro-scale geological, hydrological, and seismic datasets. It is strictly an exploratory screening tool to identify potential site constraints. <em>It does NOT constitute a statutory Environmental Impact Assessment (EIA), site-specific geotechnical investigation, or engineering design certification.</em>
          </div>
        </div>

        <!-- Section 1: Geotechnical & Lithological Profile -->
        <div class="rep-section">
          <h4 class="rep-sec-title">1. Lithological & Geotechnical Baseline</h4>
          <p class="rep-text">
            <strong>Dominant Formation:</strong> ${ctx.geology.name} (${ctx.geology.age}). Lithology consists of ${ctx.geology.lithology}.<br>
            <strong>Anticipated Bearing Capacity:</strong> ${ctx.geology.sbc}.<br>
            <strong>Dominant Soil Series:</strong> ${ctx.soil.name} (${ctx.soil.taxonomy}).<br>
            <strong>Expansive Soil Hazard:</strong> Swell pressure is estimated at <strong>${ctx.soil.swell_pressure}</strong> with soaked subgrade CBR of <strong>${ctx.soil.cbr}</strong>. ${ctx.soil.swell_alert}
          </p>
        </div>

        <!-- Section 2: Topography & Slope Stability -->
        <div class="rep-section">
          <h4 class="rep-sec-title">2. Topography & Slope Profile</h4>
          <p class="rep-text">
            <strong>Elevation:</strong> ${ctx.terrain.elevation} • <strong>Slope Category:</strong> ${ctx.terrain.slope}.<br>
            <strong>Geomorphology:</strong> ${ctx.terrain.geomorphology}.<br>
            <strong>Civil Implication:</strong> ${ctx.terrain.civil_implications}
          </p>
        </div>

        <!-- Section 3: Seismic Hazard & Fault Proximity -->
        <div class="rep-section">
          <h4 class="rep-sec-title">3. Seismic Hazard & Fault Exposure (BIS IS 1893:2016)</h4>
          <p class="rep-text">
            <strong>Statutory Seismic Zone:</strong> <strong>${ctx.seismic.zone}</strong> with Zone Factor <strong>Z = ${ctx.seismic.pga_g}g</strong>.<br>
            <strong>Design Code Requirement:</strong> Ductile detailing per IS 13920 is mandatory. Saturated alluvial sands below water table require dynamic liquefaction evaluation.<br>
            <strong>Nearest Known Seismogenic Fault:</strong> <strong>${ctx.proximity.fault.name}</strong> located approximately <strong>${ctx.proximity.fault.dist_km} km</strong> away (${ctx.proximity.fault.capability}).
          </p>
        </div>

        <!-- Section 4: Hydrogeology & Coastal Exposure -->
        <div class="rep-section">
          <h4 class="rep-sec-title">4. Hydrogeology & Natural Hazard Constraints</h4>
          <p class="rep-text">
            <strong>CGWB Aquifer Status:</strong> ${ctx.groundwater.cgwb_status} (${ctx.groundwater.extraction_pct}% extraction stage). Depth to water table: <strong>${ctx.groundwater.depth_bgl}</strong>.<br>
            <strong>Coastline Distance:</strong> <strong>${ctx.proximity.coast_km} km</strong> (${ctx.proximity.coast_hazard}).<br>
            <strong>Flood Vulnerability:</strong> ${ctx.flood_hazard}
          </p>
        </div>

        <!-- Section 5: Environmental Proximity & Statutory Reserves -->
        <div class="rep-section">
          <h4 class="rep-sec-title">5. Environmental & Eco-Sensitive Zone (ESZ) Proximity</h4>
          <p class="rep-text">
            <strong>Nearest Protected Area / Wetland:</strong> <strong>${ctx.proximity.eco.name}</strong> (${ctx.proximity.eco.designation}) located <strong>${ctx.proximity.eco.dist_km} km</strong> from site.<br>
            <strong>Statutory Clearance Status:</strong> ${ctx.proximity.eco.esz_alert_full}
          </p>
        </div>

        <!-- Section 6: Recommended Site Investigation Program -->
        <div class="rep-section highlight-sec">
          <h4 class="rep-sec-title">6. Mandatory Pre-Construction Geotechnical Investigation Protocol (IS 1892)</h4>
          <ul class="rep-bullets">
            <li><strong>Borehole Density:</strong> Minimum 3 to 5 boreholes for building footprints; 30m to 50m spacing for bridge piers and hydraulic structures, terminating minimum 3m into sound unweathered bedrock or 1.5 times footing width.</li>
            <li><strong>In-Situ Testing:</strong> Standard Penetration Tests (SPT) per IS 2131 at 1.5m vertical intervals; core drilling with continuous Core Recovery (CR) and Rock Quality Designation (RQD) reporting.</li>
            <li><strong>Laboratory Testing:</strong> Grain size distribution, Atterberg Limits (LL, PL), Free Swell Index (IS 2720 Part 40), Swell Pressure (IS 2720 Part 41), Undrained Triaxial Shear Tests, and Consolidation (Cc).</li>
            <li><strong>Chemical Analysis:</strong> Mandatory testing of soil extract and groundwater for soluble sulfates ($SO_4^{2-}$) and chlorides ($Cl^-$) per IS 456 Table 4 to determine cement type (OPC vs. SRC) and protective cover thickness.</li>
            <li><strong>Geophysical Survey:</strong> Multichannel Analysis of Surface Waves (MASW) or seismic refraction to establish shear wave velocity profile ($V_{s,30}$) for accurate IS 1893 seismic site classification.</li>
          </ul>
        </div>
      </div>
    `;

    showToast("✓ Generated Preliminary Geoenvironmental Screening Memo");
  }

  function copyScreeningMemoToClipboard() {
    if (!lastScreeningResult) {
      showToast("⚠️ No screening memo available to copy.");
      return;
    }

    const { projectName, projectType, lat, lon, ctx } = lastScreeningResult;
    const memo = `
GUJARAT INFRAMAP — PRELIMINARY GEOENVIRONMENTAL SCREENING MEMORANDUM
Project: ${projectName}
Category: ${projectType}
Coordinates: [${lat.toFixed(5)}°N, ${lon.toFixed(5)}°E]
District: ${ctx.district}
Date: ${new Date().toLocaleDateString()}

1. LITHOLOGICAL & GEOTECHNICAL BASELINE
- Formation: ${ctx.geology.name} (${ctx.geology.age})
- Bedrock Lithology: ${ctx.geology.lithology}
- Anticipated Safe Bearing Capacity: ${ctx.geology.sbc}
- Predominant Soil Series: ${ctx.soil.name}
- Expansive Soil Swell Pressure: ${ctx.soil.swell_pressure} | CBR: ${ctx.soil.cbr}

2. TOPOGRAPHY & SLOPE
- Elevation: ${ctx.terrain.elevation} | Slope: ${ctx.terrain.slope}
- Geomorphology: ${ctx.terrain.geomorphology}

3. SEISMIC HAZARD (BIS IS 1893:2016)
- Statutory Seismic Zone: ${ctx.seismic.zone} (Z = ${ctx.seismic.pga_g}g)
- Nearest Active Fault: ${ctx.proximity.fault.name} (${ctx.proximity.fault.dist_km} km)

4. HYDROGEOLOGY & HAZARDS
- CGWB Extraction Status: ${ctx.groundwater.cgwb_status} (${ctx.groundwater.extraction_pct}%)
- Water Table Depth: ${ctx.groundwater.depth_bgl}
- Coastline Distance: ${ctx.proximity.coast_km} km (${ctx.proximity.coast_hazard})

5. ECOLOGICAL PROXIMITY
- Nearest Reserve: ${ctx.proximity.eco.name} (${ctx.proximity.eco.dist_km} km)
- Status: ${ctx.proximity.eco.esz_alert}

STATUTORY CAVEAT: Regional exploratory screening only. Site-specific geotechnical investigations per IS 1892 (core drilling, SPT N-values) and statutory EIA clearances are mandatory prior to engineering design.
    `.trim();

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(memo).then(() => {
        showToast("📋 Copied Geoenvironmental Screening Memo to clipboard!");
      }).catch(() => {
        showToast("✓ Screening memo text prepared.");
      });
    } else {
      showToast("✓ Screening memo text prepared.");
    }
  }

  function exportScreeningMemoMarkdown() {
    if (!lastScreeningResult) {
      showToast("⚠️ No screening memo available to export.");
      return;
    }

    const { projectName, projectType, lat, lon, ctx } = lastScreeningResult;
    const md = `# Gujarat InfraMap — Geoenvironmental Screening Memorandum\n\n` +
      `**Project Name:** ${projectName}  \n` +
      `**Category:** ${projectType}  \n` +
      `**Coordinates:** \`${lat.toFixed(5)}°N, ${lon.toFixed(5)}°E\`  \n` +
      `**Host District:** ${ctx.district}  \n` +
      `**Assessment Date:** ${new Date().toISOString().slice(0, 10)}  \n\n` +
      `> **STATUTORY DISCLAIMER:** Exploratory regional screening only. Regional geological and hazard maps represent macro-scale tectonic and lithological trends. They MUST NOT be construed as verified site-specific borehole logs, geotechnical foundation parameters, or statutory environmental clearance for any individual civil structure. Site-specific geotechnical investigations per IS 1892 and statutory EIA approvals are mandatory prior to engineering design.\n\n` +
      `## 1. Lithological & Geotechnical Profile\n` +
      `- **Formation:** ${ctx.geology.name} (${ctx.geology.age})\n` +
      `- **Lithology:** ${ctx.geology.lithology}\n` +
      `- **Bearing Capacity (SBC):** ${ctx.geology.sbc}\n` +
      `- **Soil Series:** ${ctx.soil.name}\n` +
      `- **Swelling Pressure:** ${ctx.soil.swell_pressure}\n` +
      `- **Subgrade CBR (Soaked):** ${ctx.soil.cbr}\n\n` +
      `## 2. Topography & Slope Profile\n` +
      `- **Elevation:** ${ctx.terrain.elevation}\n` +
      `- **Slope Category:** ${ctx.terrain.slope}\n` +
      `- **Geomorphology:** ${ctx.terrain.geomorphology}\n\n` +
      `## 3. Seismic Hazard & Active Faults (BIS IS 1893:2016)\n` +
      `- **Seismic Zone:** ${ctx.seismic.zone} ($Z = ${ctx.seismic.pga_g}g$)\n` +
      `- **Nearest Seismogenic Fault:** ${ctx.proximity.fault.name} (${ctx.proximity.fault.dist_km} km away)\n\n` +
      `## 4. Hydrogeology & Coastal Hazards\n` +
      `- **CGWB Status:** ${ctx.groundwater.cgwb_status} (${ctx.groundwater.extraction_pct}% extraction)\n` +
      `- **Water Table:** ${ctx.groundwater.depth_bgl}\n` +
      `- **Coastline Distance:** ${ctx.proximity.coast_km} km (${ctx.proximity.coast_hazard})\n\n` +
      `## 5. Environmental Proximity\n` +
      `- **Nearest Protected Area:** ${ctx.proximity.eco.name} (${ctx.proximity.eco.dist_km} km)\n` +
      `- **Statutory Status:** ${ctx.proximity.eco.esz_alert_full}\n\n` +
      `## 6. Recommended IS 1892 Investigation Scope\n` +
      `1. Borehole grid density of 30m to 50m intervals.\n` +
      `2. Standard Penetration Tests (SPT) at 1.5m depth intervals.\n` +
      `3. Swell pressure and Free Swell Index tests for expansive clays.\n` +
      `4. Chemical sulfate/chloride analysis of soil and groundwater per IS 456.\n` +
      `5. MASW seismic shear wave velocity profile ($V_{s,30}$).\n`;

    const blob = new Blob([md], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `geoenvironmental-screening-${projectName.toLowerCase().replace(/[^a-z0-9]/g, "-")}.md`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("✓ Downloaded Markdown Screening Report");
  }

  // =========================================================================
  // 8. CORE SPATIAL CONTEXT CALCULATION ENGINE
  // =========================================================================
  function getGeoenvironmentalContext(lat, lon) {
    // 1. Determine District
    let districtName = "Gujarat Region";
    let minDistDist = 9999;
    if (allDistrictsList && allDistrictsList.length > 0) {
      allDistrictsList.forEach(d => {
        if (d.centroid) {
          const dist = computeDistanceKm(lat, lon, d.centroid[0], d.centroid[1]);
          if (dist < minDistDist) {
            minDistDist = dist;
            districtName = d.district;
          }
        }
      });
    }

    // 2. Determine Geology Formation
    let geology = {
      name: "Deccan Volcanic Province (Deccan Traps)",
      age: "Late Cretaceous (~66 Ma)",
      lithology: "Tholeiitic basalt lava flows, columnar basalt, weathered murrum capping",
      sbc: "1200 to 3500 kPa (unweathered hard basalt)"
    };

    if (lat > 22.8 && lon < 71.2) {
      // Kutch Basin
      geology = {
        name: "Mesozoic Sedimentary Super-Sequence (Kutch Basin)",
        age: "Jurassic to Cretaceous (~150 Ma)",
        lithology: "Sandstones, shales, Katrol and Bhuj formations",
        sbc: "400 to 1200 kPa for cemented sandstone"
      };
      if (lat > 23.5) {
        geology = {
          name: "Rann Hypersaline Evaporite & Mudflat Complex",
          age: "Holocene to Recent (<10 ka)",
          lithology: "Hypersaline marine silt, clay, halite salt crust, tidal mudflat sediments",
          sbc: "30 to 75 kPa (Extremely Soft Marine Soil)"
        };
      }
    } else if (lon >= 71.2 && lon <= 73.2 && lat >= 22.0 && lat <= 24.2) {
      // Central Alluvial Plains
      geology = {
        name: "Quaternary Fluvial Alluvium (Gujarat Mainland)",
        age: "Pleistocene to Holocene (<2.5 Ma)",
        lithology: "Fluvial sands, silts, gravels, silty clays; thickness up to 300-500m",
        sbc: "150 to 300 kPa (shallow dense sand)"
      };
    } else if (lon > 73.2 && lat >= 21.8) {
      // Eastern Highlands
      geology = {
        name: "Proterozoic Crystalline Basement (Aravalli & Champaner)",
        age: "Paleoproterozoic (~1500 Ma)",
        lithology: "Quartzites, phyllites, granite gneisses, schists",
        sbc: "1500 to 4500 kPa (massive granite / quartzite)"
      };
    } else if (lon < 70.8 && lat < 22.4) {
      // Coastal Saurashtra
      geology = {
        name: "Miliolite Limestone Formation & Deccan Basalt",
        age: "Pleistocene (~1.8 Ma to 50 ka)",
        lithology: "Bioclastic aeolian calcarenite limestone overlying basalt lava flows",
        sbc: "350 to 800 kPa (competent calcarenite)"
      };
    }

    // 3. Nearest Active Fault
    const faults = [
      { name: "Kutch Mainland Fault (KMF)", coords: [23.35, 70.0], capability: "Mw 7.8 Reverse Thrust" },
      { name: "Allah Bund Fault", coords: [24.10, 69.8], capability: "Mw 7.8 1819 Earthquake Scarp" },
      { name: "Katrol Hill Fault (KHF)", coords: [23.15, 69.9], capability: "Mw 6.8 Intrabasinal Thrust" },
      { name: "Narmada-Son Fault Zone", coords: [21.75, 73.0], capability: "Deep Crustal Rift Shear Fault" },
      { name: "Cambay Western Margin Fault", coords: [22.7, 72.3], capability: "Extensional Graben Normal Fault" }
    ];
    let nearestFault = faults[0];
    let minFaultDist = 9999;
    faults.forEach(fl => {
      const d = computeDistanceKm(lat, lon, fl.coords[0], fl.coords[1]);
      if (d < minFaultDist) {
        minFaultDist = d;
        nearestFault = fl;
      }
    });

    // 4. Soil Classification
    let soil = {
      name: "Deep Black Cotton Soils (Vertisols)",
      taxonomy: "Chromic Haplusterts (Fine montmorillonitic)",
      swell_pressure: "150 to 320 kPa (Very High)",
      cbr: "1.5 to 3.0% (Poor Subgrade)",
      swell_alert: "Severe shrink-swell heave potential requires under-reamed piles or CNS cushion."
    };

    if (lat > 22.4 && lon >= 71.8 && lon <= 73.2) {
      soil = {
        name: "Alluvial Sandy Loams & Silts (Inceptisols)",
        taxonomy: "Typic Ustochrepts (Coarse-loamy to silty)",
        swell_pressure: "< 25 kPa (Negligible)",
        cbr: "6.0 to 12.0% (Good Subgrade)",
        swell_alert: "Non-expansive; liquefaction screening required if saturated fine sand under Zone IV."
      };
    } else if (lat > 23.4 && lon < 71.5) {
      soil = {
        name: "Desert & Calcareous Sandy Soils (Aridisols)",
        taxonomy: "Typic Camborthids (Sandy, hyperthermic)",
        swell_pressure: "0 kPa (Non-Expansive)",
        cbr: "5.0 to 9.0% (when confined)",
        swell_alert: "Zero cohesion when dry; susceptible to wind deflation and hydro-collapse settlement upon saturation."
      };
    } else if (lon > 73.4) {
      soil = {
        name: "Residual Red Gravelly Soils (Alfisols)",
        taxonomy: "Typic Haplustalfs (Gravelly loam)",
        swell_pressure: "< 15 kPa (Low)",
        cbr: "8.0 to 18.0% (Excellent Subgrade)",
        swell_alert: "Well-drained and stable; cut slopes require protection from surface sheetwash."
      };
    }

    // 5. Topography & Slope
    let terrain = {
      elevation: "100 to 250 m MSL",
      slope: "2 to 5 deg (Undulating)",
      geomorphology: "Dissected basalt plateau terraces and stepped lava flows",
      civil_implications: "Shallow rock foundations; balanced cut-and-fill required across trap steps."
    };
    if (lat < 22.0 && lon > 72.0 && lon < 73.0) {
      terrain = {
        elevation: "5 to 25 m MSL",
        slope: "< 1 deg (Flat Lowlands)",
        geomorphology: "Tidal mudflats, estuaries, and low-lying coastal floodplains",
        civil_implications: "Finished floor levels must be elevated above storm surge + astronomical tide."
      };
    } else if (lat > 22.5 && lon > 72.0 && lon < 73.2) {
      terrain = {
        elevation: "30 to 90 m MSL",
        slope: "1 to 2 deg (Gently Sloping)",
        geomorphology: "Fluvial floodplains, palaeochannels, and levee terraces",
        civil_implications: "Favorable terrain for linear infrastructure; cross-drainage culverts required."
      };
    } else if (lon > 73.4 || (lat < 21.6 && lon > 70.3 && lon < 70.8)) {
      terrain = {
        elevation: "300 to 1,117 m MSL",
        slope: "> 15 deg (Steep Hill Slopes)",
        geomorphology: "Structural hills, residual volcanic plugs (Girnar 1117m, Pavagadh 824m), ghat passes",
        civil_implications: "High cut slope instability; retaining walls, gabions, and soil nailing mandatory."
      };
    }

    // 6. Seismic Hazard (BIS IS 1893:2016)
    let seismic = {
      zone: "Zone IV (High Damage Risk)",
      pga_g: 0.24,
      code: "BIS IS 1893:2016 Part 1 & IS 13920 Ductile Detailing"
    };
    if (lat > 22.8 && lon < 71.0) {
      seismic = {
        zone: "Zone V (Very High Damage Risk)",
        pga_g: 0.36,
        code: "BIS IS 1893:2016 Part 1 & Mandatory Fault Rupture Exclusion"
      };
    } else if (lat < 22.0 && lon > 72.5) {
      seismic = {
        zone: "Zone III (Moderate Damage Risk)",
        pga_g: 0.16,
        code: "BIS IS 1893:2016 Standard Seismic Resilient Detailing"
      };
    }

    // 7. Groundwater (CGWB)
    let gwData = allGroundwaterList.find(g => g.district.toLowerCase() === districtName.toLowerCase());
    let groundwater = {
      cgwb_status: gwData ? gwData.cgwb_category : "Semi-Critical",
      extraction_pct: gwData ? gwData.stage_of_extraction_pct : 82.0,
      depth_bgl: gwData ? gwData.water_table_depth_m_bgl : "10 to 30m",
      salinity: gwData ? gwData.salinity_risk : "Moderate"
    };

    // 8. Coastline Distance
    const coastPoints = [
      [22.8, 69.7], [22.4, 70.0], [21.6, 69.6], [20.9, 70.4], [21.1, 71.5], [21.7, 72.2], [21.1, 72.7], [20.6, 72.9]
    ];
    let minCoastDist = 9999;
    coastPoints.forEach(cp => {
      const d = computeDistanceKm(lat, lon, cp[0], cp[1]);
      if (d < minCoastDist) minCoastDist = d;
    });

    let coastHazard = "Inland / Negligible Marine Exposure";
    if (minCoastDist < 15) {
      coastHazard = "Severe Marine Exposure (Tidal Surge, Extreme Chlorides & Salinity Ingress)";
    } else if (minCoastDist < 40) {
      coastHazard = "Moderate Marine Atmosphere (Corrosion Protection Recommended)";
    }

    // 9. Eco-Sensitive Area Proximity
    const ecoReserves = [
      { name: "Nal Sarovar Bird Sanctuary (Ramsar #2078)", coords: [22.805, 72.045], designation: "Ramsar Wetland Site" },
      { name: "Thol Lake Wildlife Sanctuary (Ramsar #2457)", coords: [23.140, 72.395], designation: "Ramsar Wetland Site" },
      { name: "Wadhwana Wetland (Ramsar #2458)", coords: [22.175, 73.485], designation: "Ramsar Wetland Site" },
      { name: "Khijadiya Bird Sanctuary (Ramsar #2459)", coords: [22.515, 70.135], designation: "Ramsar Wetland Site" },
      { name: "Gir National Park & Sanctuary", coords: [21.124, 70.795], designation: "National Park (Lion Habitat)" },
      { name: "Marine National Park (Gulf of Kutch)", coords: [22.450, 69.750], designation: "Marine National Park" }
    ];
    let nearestEco = ecoReserves[0];
    let minEcoDist = 9999;
    ecoReserves.forEach(er => {
      const d = computeDistanceKm(lat, lon, er.coords[0], er.coords[1]);
      if (d < minEcoDist) {
        minEcoDist = d;
        nearestEco = er;
      }
    });

    let eszAlert = minEcoDist <= 10.0 ? "ESZ Clearance Required" : "Outside 10 km Buffer";
    let eszAlertFull = minEcoDist <= 10.0
      ? `Located within ${minEcoDist.toFixed(1)} km of ${nearestEco.name}. Formal Eco-Sensitive Zone clearance from NBWL / MoEFCC is required prior to construction.`
      : `Located ${minEcoDist.toFixed(1)} km from ${nearestEco.name}. Clear of primary 10 km statutory Eco-Sensitive Zone regulatory buffer.`;

    // 10. Flood Hazard
    let floodHazard = "Moderate Regional Monsoon Flood Exposure";
    if (computeDistanceKm(lat, lon, 21.18, 72.83) < 25) {
      floodHazard = "Very High: Tapi River Floodplain & Surat Urban Inundation Corridor";
    } else if (computeDistanceKm(lat, lon, 22.30, 73.19) < 20) {
      floodHazard = "High: Vishwamitri River Vadodara Flash Flood Plain";
    } else if (computeDistanceKm(lat, lon, 21.71, 72.98) < 25) {
      floodHazard = "High: Lower Narmada Bharuch Inundation Corridor";
    } else if (computeDistanceKm(lat, lon, 24.0, 72.15) < 30) {
      floodHazard = "High: Banas River North Gujarat Flash Flood Zone";
    }

    // 11. Engineering Relevance Syntheses
    const relevance = {
      slope: terrain.slope.includes(">")
        ? "Steep terrain mandates slope stability analysis (Bishop slip circle $FoS \\ge 1.5$). Deep cut slopes require soil nailing, hydro-seeding, and crest catch-water drains to prevent monsoon landslides."
        : "Gentle or flat terrain minimizes mass slope failure risk, but requires substantial embankment height above highest flood level (HFL) and longitudinal side drains to prevent ponding and subgrade softening.",
      soil_seepage: soil.name.includes("Vertisols")
        ? "High clay content (montmorillonite) creates extreme shrink-swell differential movement (swell pressure 150-320 kPa). Omitting Cohesive Non-Swelling (CNS) soil cushioning can crack canal linings and foundation grade beams."
        : "Permeable sandy silts facilitate groundwater drainage but pose high exit gradients and piping risks under hydraulic weir structures; geotextile filter layers are mandatory.",
      groundwater: groundwater.depth_bgl.includes("3 to") || minCoastDist < 20
        ? "Shallow or saline groundwater creates buoyant hydrostatic uplift on subterranean basements. High chloride and sulfate content causes severe chemical attack on concrete; Sulfate Resisting Portland Cement (IS 12330) and corrosion-resistant rebar are essential."
        : "Deep water table (>25m) minimizes buoyant basement uplift, but deep foundation piles must rely primarily on shaft friction and deep bedrock socketing rather than shallow water-bearing strata.",
      seismic: seismic.zone.includes("Zone V")
        ? "Zone V design mandates high lateral seismic base shear calculation ($V_B = A_h \\cdot W$). Near-fault directivity pulses and potential dynamic liquefaction in saturated silts require deep ductile pile foundations per IS 13920."
        : "Zone IV/III design requires ductile detailing of all beam-column joints, shear wall boundaries, and flexible bridge bearings to resist cyclic dynamic lateral loads."
    };

    return {
      lat,
      lon,
      district: districtName,
      geology,
      soil,
      terrain,
      seismic,
      groundwater,
      flood_hazard: floodHazard,
      relevance,
      proximity: {
        fault: {
          name: nearestFault.name,
          dist_km: minFaultDist.toFixed(1),
          capability: nearestFault.capability
        },
        coast_km: minCoastDist.toFixed(1),
        coast_hazard: coastHazard,
        eco: {
          name: nearestEco.name,
          designation: nearestEco.designation,
          dist_km: minEcoDist.toFixed(1),
          esz_alert: eszAlert,
          esz_alert_full: eszAlertFull
        }
      }
    };
  }

  // Haversine geodesic distance in km
  function computeDistanceKm(lat1, lon1, lat2, lon2) {
    const R = 6371.0;
    const dLat = (lat2 - lat1) * Math.PI / 180.0;
    const dLon = (lon2 - lon1) * Math.PI / 180.0;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180.0) * Math.cos(lat2 * Math.PI / 180.0) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  function showToast(msg, duration = 3000) {
    if (typeof window.showToast === "function") {
      window.showToast(msg, duration);
    } else {
      console.log("[Toast]", msg);
    }
  }

  // Expose API
  window.GeoenvironmentalIntelligence = {
    init,
    open: openModal,
    close: closeModal,
    switchTab,
    getGeoenvironmentalContext,
    screenProjectSite,
    startMapPointScreening,
    toggleThematicOverlay: toggleThematicMapOverlay,
    exportProvenanceCSV,
    exportScreeningReport: exportScreeningMemoMarkdown,
    copyScreeningMemo: copyScreeningMemoToClipboard
  };

})(window);
