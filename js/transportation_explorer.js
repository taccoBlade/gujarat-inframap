/**
 * Gujarat InfraMap — Transportation & Civil Structures Explorer Engine
 * Comprehensive multi-modal inventory, civil structure profiles, bridge-corridor relationships,
 * multi-modal freight analytics, and transport civil engineering calculators.
 * Standard: IIFE module exposing window.TransportExplorer
 */

(function () {
  "use strict";

  let mapInstance = null;
  let roadsDataset = null;
  let structuresDataset = null;
  let railwaysDataset = null;
  let stationsDataset = null;
  let urbanDataset = null;
  let waterDataset = null;
  let externalCallbacks = {};

  let activeTab = "inventory";
  let activeCategoryFilter = "all";
  let activeDistrictFilter = "all";
  let activeAuthorityFilter = "all";
  let activeSearchQuery = "";
  let activeHighlightLayers = [];
  let activeStructureMarker = null;

  // Cached lists
  let allStructuresList = [];
  let allRoadsList = [];
  let allPortsAirportsList = [];

  function init(map, datasets, callbacks) {
    mapInstance = map;
    roadsDataset = datasets.roadsData || null;
    structuresDataset = datasets.structuresData || null;
    railwaysDataset = datasets.railwaysData || null;
    stationsDataset = datasets.stationsData || null;
    urbanDataset = datasets.urbanData || null;
    waterDataset = datasets.waterData || null;
    externalCallbacks = callbacks || {};

    if (structuresDataset && structuresDataset.features) {
      allStructuresList = structuresDataset.features.map(f => f.properties);
    }
    if (roadsDataset && roadsDataset.features) {
      allRoadsList = roadsDataset.features.map(f => f.properties);
    }
    if (urbanDataset && urbanDataset.features) {
      allPortsAirportsList = urbanDataset.features
        .filter(f => f.properties && (f.properties.asset_category === "seaport" || f.properties.asset_category === "airport"))
        .map(f => f.properties);
    }

    setupDomEventListeners();
    initLabCalculators();
    console.log(`[TransportExplorer] Initialized with ${allStructuresList.length} civil structures, ${allRoadsList.length} road corridors, ${allPortsAirportsList.length} port/airport facilities.`);
  }

  function setupDomEventListeners() {
    // Modal buttons
    const openBtn = document.getElementById("openTransportExplorerBtn");
    const openDrawerBtn = document.getElementById("openTransportExplorerTabBtn");
    const openStructuresBtn = document.getElementById("openStructuresTabBtn");
    const closeBtn = document.getElementById("closeTransportExplorerBtn");
    const modal = document.getElementById("transportExplorerModal");

    if (openBtn) openBtn.addEventListener("click", () => openModal("inventory"));
    if (openDrawerBtn) openDrawerBtn.addEventListener("click", () => openModal("inventory"));
    if (openStructuresBtn) openStructuresBtn.addEventListener("click", () => openModal("structures"));
    if (closeBtn) closeBtn.addEventListener("click", closeModal);

    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
      });
    }

    // Tabs
    const tabBtns = document.querySelectorAll(".trans-tab-btn");
    tabBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const tab = btn.getAttribute("data-tab");
        switchTab(tab);
      });
    });

    // Filters
    const catSelect = document.getElementById("transCatFilter");
    const distSelect = document.getElementById("transDistFilter");
    const authSelect = document.getElementById("transAuthFilter");
    const searchInput = document.getElementById("transSearchInput");
    const resetBtn = document.getElementById("transResetFiltersBtn");
    const exportBtn = document.getElementById("transExportCsvBtn");

    if (catSelect) catSelect.addEventListener("change", (e) => {
      activeCategoryFilter = e.target.value;
      renderInventoryTable();
    });
    if (distSelect) distSelect.addEventListener("change", (e) => {
      activeDistrictFilter = e.target.value;
      renderInventoryTable();
    });
    if (authSelect) authSelect.addEventListener("change", (e) => {
      activeAuthorityFilter = e.target.value;
      renderInventoryTable();
    });
    if (searchInput) searchInput.addEventListener("input", (e) => {
      activeSearchQuery = e.target.value.toLowerCase().trim();
      renderInventoryTable();
    });
    if (resetBtn) resetBtn.addEventListener("click", resetFilters);
    if (exportBtn) exportBtn.addEventListener("click", exportCSV);

    // Structure showcase filter pills
    const pillBtns = document.querySelectorAll(".struct-pill-btn");
    pillBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        pillBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const type = btn.getAttribute("data-struct-type");
        renderStructuresShowcase(type);
      });
    });
  }

  function openModal(defaultTab) {
    const modal = document.getElementById("transportExplorerModal");
    if (!modal) return;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    switchTab(defaultTab || activeTab);
  }

  function closeModal() {
    const modal = document.getElementById("transportExplorerModal");
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  }

  function switchTab(tabId) {
    activeTab = tabId;
    document.querySelectorAll(".trans-tab-btn").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-tab") === tabId);
    });
    document.querySelectorAll(".trans-tab-pane").forEach(pane => {
      pane.classList.toggle("active", pane.id === `transPane_${tabId}`);
    });

    if (tabId === "inventory") {
      populateDistrictDropdown();
      populateAuthorityDropdown();
      renderInventoryTable();
      updateKpis();
    } else if (tabId === "structures") {
      renderStructuresShowcase("all");
    } else if (tabId === "lab") {
      updateSightDistanceCalc();
      updateBridgeScourCalc();
    }
  }

  function updateKpis() {
    const kpiCorridors = document.getElementById("kpiTransCorridors");
    const kpiBridges = document.getElementById("kpiTransBridges");
    const kpiStations = document.getElementById("kpiTransStations");
    const kpiPorts = document.getElementById("kpiTransPorts");
    const kpiAirports = document.getElementById("kpiTransAirports");
    const kpiICDs = document.getElementById("kpiTransICDs");

    if (kpiCorridors) kpiCorridors.textContent = `${allRoadsList.length} Corridors (8,940+ km)`;
    if (kpiBridges) {
      const bridgesCount = allStructuresList.filter(s => s.asset_category === "bridge").length;
      kpiBridges.textContent = `${bridgesCount} Signature Bridges`;
    }
    if (kpiStations && stationsDataset) {
      kpiStations.textContent = `${stationsDataset.features.length} Western Rail Nodes`;
    }
    if (kpiPorts) {
      const ports = allPortsAirportsList.filter(p => p.asset_category === "seaport");
      kpiPorts.textContent = `${ports.length} Major Ports (640+ MMT)`;
    }
    if (kpiAirports) {
      const airports = allPortsAirportsList.filter(p => p.asset_category === "airport");
      kpiAirports.textContent = `${airports.length} Civil Aerodromes`;
    }
    if (kpiICDs) {
      const icds = allStructuresList.filter(s => s.asset_category === "freight_terminal");
      kpiICDs.textContent = `${icds.length} Multimodal Logistics Parks`;
    }
  }

  function populateDistrictDropdown() {
    const select = document.getElementById("transDistFilter");
    if (!select || select.children.length > 1) return;
    const districts = new Set();
    allStructuresList.forEach(s => { if (s.district) districts.add(s.district); });
    allPortsAirportsList.forEach(p => { if (p.district || p.city) districts.add(p.district || p.city); });

    Array.from(districts).sort().forEach(dist => {
      const opt = document.createElement("option");
      opt.value = dist;
      opt.textContent = dist;
      select.appendChild(opt);
    });
  }

  function populateAuthorityDropdown() {
    const select = document.getElementById("transAuthFilter");
    if (!select || select.children.length > 1) return;
    const auths = new Set();
    allStructuresList.forEach(s => {
      if (s.responsible_authority) {
        const clean = s.responsible_authority.split("/")[0].trim();
        auths.add(clean);
      }
    });
    allRoadsList.forEach(r => {
      if (r.operator) {
        const clean = r.operator.split("/")[0].trim();
        auths.add(clean);
      }
    });

    Array.from(auths).sort().forEach(auth => {
      const opt = document.createElement("option");
      opt.value = auth;
      opt.textContent = auth;
      select.appendChild(opt);
    });
  }

  function resetFilters() {
    activeCategoryFilter = "all";
    activeDistrictFilter = "all";
    activeAuthorityFilter = "all";
    activeSearchQuery = "";

    const catSelect = document.getElementById("transCatFilter");
    const distSelect = document.getElementById("transDistFilter");
    const authSelect = document.getElementById("transAuthFilter");
    const searchInput = document.getElementById("transSearchInput");

    if (catSelect) catSelect.value = "all";
    if (distSelect) distSelect.value = "all";
    if (authSelect) authSelect.value = "all";
    if (searchInput) searchInput.value = "";

    renderInventoryTable();
  }

  // Combine unified rows for table
  function getFilteredInventoryRows() {
    let rows = [];

    // 1. Civil Structures
    allStructuresList.forEach(s => {
      rows.push({
        id: s.id,
        name: s.name,
        category: s.asset_category,
        categoryLabel: s.asset_category === "bridge" ? "Bridge" : (s.asset_category === "flyover" ? "Elevated Flyover" : (s.asset_category === "tunnel" ? "Tunnel" : "Freight Terminal")),
        badgeClass: `cat-${s.asset_category}`,
        district: s.district || "—",
        corridorOrCrossing: `${s.supporting_corridor} (Crosses: ${s.waterway_crossed})`,
        metrics: s.length_m ? `${s.length_m} m length • ${s.lane_count} lanes` : `${s.lane_count || "—"} lines`,
        authority: s.responsible_authority || "—",
        coords: s.coordinates || null,
        raw: s,
        isStructure: true
      });
    });

    // 2. Highway Corridors
    allRoadsList.forEach(r => {
      rows.push({
        id: r.corridor || r.name,
        name: r.name || r.corridor,
        category: "highway",
        categoryLabel: r.class_label || "National Highway",
        badgeClass: r.category === "expressway" ? "cat-expressway" : (r.category === "golden_quadrilateral" ? "cat-gq" : "cat-nh"),
        district: "Statewide Alignment",
        corridorOrCrossing: r.route || "Continuous Corridor",
        metrics: `${r.total_length_km || 0} km • ${r.speed_limit_kmh || 80} km/h • ${r.lane_count || 4} Lanes`,
        authority: r.operator || "NHAI",
        coords: null,
        raw: r,
        isRoad: true
      });
    });

    // 3. Ports & Airports
    allPortsAirportsList.forEach(p => {
      const isPort = p.asset_category === "seaport";
      rows.push({
        id: p.id,
        name: p.name,
        category: isPort ? "seaport" : "airport",
        categoryLabel: isPort ? "Commercial Seaport" : "Airport Terminal",
        badgeClass: isPort ? "cat-port" : "cat-airport",
        district: p.district || p.city || "—",
        corridorOrCrossing: isPort ? `Hinterland: ${p.highway_connectivity || "NH corridor"}` : `Access: ${p.highway_connectivity || "City Link"}`,
        metrics: isPort ? `${p.capacity_mmt || 0} MMT • ${p.draft_m || 0} m draft • ${p.berths_count || 0} berths` : `Runway: ${p.runway_length_m || 0} m • IATA: ${p.iata || "—"}`,
        authority: p.authority || p.operator || "GMB / AAI",
        coords: null,
        raw: p,
        isUrban: true
      });
    });

    // Apply Filter logic
    return rows.filter(r => {
      // Category filter
      if (activeCategoryFilter !== "all") {
        if (activeCategoryFilter === "bridge" && r.category !== "bridge") return false;
        if (activeCategoryFilter === "flyover" && r.category !== "flyover") return false;
        if (activeCategoryFilter === "tunnel" && r.category !== "tunnel") return false;
        if (activeCategoryFilter === "freight_terminal" && r.category !== "freight_terminal") return false;
        if (activeCategoryFilter === "highway" && r.category !== "highway") return false;
        if (activeCategoryFilter === "seaport" && r.category !== "seaport") return false;
        if (activeCategoryFilter === "airport" && r.category !== "airport") return false;
      }

      // District filter
      if (activeDistrictFilter !== "all" && r.district !== "Statewide Alignment") {
        if (r.district.toLowerCase() !== activeDistrictFilter.toLowerCase()) return false;
      }

      // Authority filter
      if (activeAuthorityFilter !== "all") {
        if (!r.authority.toLowerCase().includes(activeAuthorityFilter.toLowerCase())) return false;
      }

      // Search query
      if (activeSearchQuery) {
        const text = [r.id, r.name, r.categoryLabel, r.district, r.corridorOrCrossing, r.authority].join(" ").toLowerCase();
        if (!text.includes(activeSearchQuery)) return false;
      }

      return true;
    });
  }

  function renderInventoryTable() {
    const tbody = document.getElementById("transInventoryTableBody");
    const countBadge = document.getElementById("transTableCountBadge");
    if (!tbody) return;

    const rows = getFilteredInventoryRows();
    if (countBadge) countBadge.textContent = `${rows.length} assets listed`;

    if (rows.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 30px; color: #94a3b8;">No transport infrastructure assets match the active filter criteria.</td></tr>`;
      return;
    }

    let html = "";
    rows.forEach(r => {
      html += `
        <tr>
          <td>
            <div style="font-weight: 600; color: #f8fafc; font-size: 0.82rem;">${r.name}</div>
            <div style="font-size: 0.70rem; color: #94a3b8; font-family: monospace;">${r.id}</div>
          </td>
          <td>
            <span class="badge-trans ${r.badgeClass}">${r.categoryLabel}</span>
          </td>
          <td style="font-size: 0.78rem; color: #cbd5e1;">${r.district}</td>
          <td style="font-size: 0.74rem; color: #94a3b8; max-width: 260px; line-height: 1.35;">
            ${r.corridorOrCrossing}
          </td>
          <td style="font-size: 0.76rem; color: #38bdf8; font-weight: 500;">
            ${r.metrics}
          </td>
          <td style="font-size: 0.74rem; color: #cbd5e1;">
            ${r.authority}
          </td>
          <td>
            <div class="trans-action-btns">
              <button class="trans-action-btn btn-map" title="Fly to Map" onclick="window.TransportExplorer.focusAsset('${r.id}')">
                🎯 Map
              </button>
              ${r.isStructure ? `
                <button class="trans-action-btn btn-highlight" title="Highlight Crossing & Corridor" onclick="window.TransportExplorer.highlightCrossingRelationship('${r.id}')">
                  🔗 Link
                </button>
              ` : ''}
              <button class="trans-action-btn btn-inspect" title="Inspect Asset" onclick="window.TransportExplorer.inspectAsset('${r.id}')">
                🔍 Details
              </button>
            </div>
          </td>
        </tr>
      `;
    });

    tbody.innerHTML = html;
  }

  function renderStructuresShowcase(typeFilter) {
    const container = document.getElementById("transStructuresGrid");
    if (!container) return;

    let list = allStructuresList;
    if (typeFilter && typeFilter !== "all") {
      list = list.filter(s => s.asset_category === typeFilter);
    }

    let html = "";
    list.forEach(s => {
      const isBridge = s.asset_category === "bridge";
      const isFlyover = s.asset_category === "flyover";
      const isTunnel = s.asset_category === "tunnel";
      const isTerminal = s.asset_category === "freight_terminal";

      let icon = "🌉";
      let tagLabel = "SIGNATURE BRIDGE";
      let tagClass = "tag-bridge";
      if (isFlyover) { icon = "🛣️"; tagLabel = "ELEVATED FLYOVER"; tagClass = "tag-flyover"; }
      else if (isTunnel) { icon = "🚇"; tagLabel = "TUNNEL / PASS"; tagClass = "tag-tunnel"; }
      else if (isTerminal) { icon = "📦"; tagLabel = "FREIGHT TERMINAL / ICD"; tagClass = "tag-terminal"; }

      html += `
        <div class="trans-struct-card">
          <div class="struct-card-header">
            <span class="struct-tag ${tagClass}">${icon} ${tagLabel}</span>
            <span class="struct-year">${s.commissioning_year ? `Year ${s.commissioning_year}` : "Operational"}</span>
          </div>
          <h4 class="struct-title">${s.name}</h4>
          <div class="struct-alt-name">${s.alternate_name || s.id}</div>
          
          <div class="struct-metrics-grid">
            <div class="metric-box">
              <span class="metric-lbl">Total Length</span>
              <span class="metric-num">${s.length_m ? `${s.length_m.toLocaleString()} m` : "—"}</span>
            </div>
            <div class="metric-box">
              <span class="metric-lbl">Max Span</span>
              <span class="metric-num">${s.max_span_m ? `${s.max_span_m} m` : "N/A"}</span>
            </div>
            <div class="metric-box">
              <span class="metric-lbl">Lane Capacity</span>
              <span class="metric-num">${s.lane_count || "—"} Lanes</span>
            </div>
            <div class="metric-box">
              <span class="metric-lbl">District</span>
              <span class="metric-num" style="font-size: 0.75rem;">${s.district || "—"}</span>
            </div>
          </div>

          <div class="struct-cross-box">
            <div class="cross-line">
              <span class="cross-key">Supporting Route:</span>
              <span class="cross-val" style="color: #38bdf8; font-weight: 600;">${s.supporting_corridor}</span>
            </div>
            <div class="cross-line">
              <span class="cross-key">${isBridge ? 'Waterway Crossed:' : 'Feature Crossed:'}</span>
              <span class="cross-val" style="color: #67e8f9;">${s.waterway_crossed}</span>
            </div>
            <div class="cross-line">
              <span class="cross-key">Structure Type:</span>
              <span class="cross-val">${s.bridge_type}</span>
            </div>
            <div class="cross-line">
              <span class="cross-key">Superstructure:</span>
              <span class="cross-val" style="font-size: 0.72rem; color: #94a3b8;">${s.superstructure}</span>
            </div>
            <div class="cross-line">
              <span class="cross-key">Foundation / Piers:</span>
              <span class="cross-val" style="font-size: 0.72rem; color: #94a3b8;">${s.substructure}</span>
            </div>
            <div class="cross-line">
              <span class="cross-key">Authority:</span>
              <span class="cross-val">${s.responsible_authority}</span>
            </div>
          </div>

          <div class="struct-disclosure">
            <div class="disclosure-header">⚖️ Statutory Inspection & Structural Health Disclosure:</div>
            <p class="disclosure-text">${s.inspection_disclosure}</p>
          </div>

          <div class="struct-actions">
            <button class="card-btn-trace" onclick="window.TransportExplorer.highlightCrossingRelationship('${s.id}')">
              🔗 Highlight Crossing & Corridor
            </button>
            <button class="card-btn-map" onclick="window.TransportExplorer.focusAsset('${s.id}')">
              🎯 Fly to Map
            </button>
            <button class="card-btn-inspect" onclick="window.TransportExplorer.inspectAsset('${s.id}')">
              🔍 Inspector
            </button>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  // ==========================================
  // MAP RELATIONSHIPS: HIGHLIGHT CROSSING
  // ==========================================
  function highlightCrossingRelationship(structureId) {
    const s = allStructuresList.find(item => item.id === structureId);
    if (!s || !mapInstance) return;

    closeModal();

    // Clear previous relationship layers
    clearActiveHighlights();

    const [lon, lat] = s.coordinates;
    const structureLatLng = L.latLng(lat, lon);

    // 1. Center map
    mapInstance.flyTo(structureLatLng, 14, { duration: 1.2 });

    // 2. Pulse structure marker
    const pulseIcon = L.divIcon({
      className: "pulsing-crossing-marker",
      html: `
        <div class="crossing-beacon-wrapper">
          <div class="crossing-beacon-ring"></div>
          <div class="crossing-beacon-dot">${s.asset_category === "bridge" ? "🌉" : (s.asset_category === "flyover" ? "🛣️" : "🚇")}</div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });

    activeStructureMarker = L.marker(structureLatLng, { icon: pulseIcon }).addTo(mapInstance);
    activeHighlightLayers.push(activeStructureMarker);

    // 3. Highlight supporting corridor if highway
    if (s.supporting_corridor_id && window.highlightHighwayCorridor) {
      window.highlightHighwayCorridor(s.supporting_corridor_id);
    }

    // 4. Highlight crossed feature if river
    if (s.feature_crossed_id && waterDataset && waterDataset.features) {
      const riverFeat = waterDataset.features.find(f => {
        const rp = f.properties || {};
        return (rp.id === s.feature_crossed_id) || 
               (rp.name && rp.name.toLowerCase().includes(s.waterway_crossed.toLowerCase())) ||
               (rp.river && rp.river.toLowerCase().includes(s.waterway_crossed.toLowerCase()));
      });

      if (riverFeat) {
        const riverLayer = L.geoJSON(riverFeat, {
          style: {
            color: "#38bdf8",
            weight: 6,
            opacity: 0.95,
            dashArray: "8, 12",
            lineCap: "round"
          }
        }).addTo(mapInstance);
        activeHighlightLayers.push(riverLayer);
      }
    }

    // 5. Surface interactive HUD banner on map
    showCrossingHudBanner(s);
  }

  function showCrossingHudBanner(s) {
    let hud = document.getElementById("crossingRelationshipHud");
    if (!hud) {
      hud = document.createElement("div");
      hud.id = "crossingRelationshipHud";
      hud.className = "crossing-hud-card";
      document.body.appendChild(hud);
    }

    hud.innerHTML = `
      <div class="crossing-hud-header">
        <span class="hud-tag">MAP CROSSING RELATIONSHIP VERIFIED</span>
        <button class="hud-close-btn" onclick="window.TransportExplorer.clearActiveHighlights()">×</button>
      </div>
      <div class="crossing-hud-title">${s.name}</div>
      <div class="crossing-hud-connections">
        <div class="hud-conn-row">
          <span class="hud-conn-icon">🛣️</span>
          <span class="hud-conn-label">Supporting Corridor:</span>
          <span class="hud-conn-target">${s.supporting_corridor}</span>
        </div>
        <div class="hud-conn-row">
          <span class="hud-conn-icon">🌊</span>
          <span class="hud-conn-label">Feature Crossed:</span>
          <span class="hud-conn-target">${s.waterway_crossed}</span>
        </div>
        <div class="hud-conn-row">
          <span class="hud-conn-icon">📐</span>
          <span class="hud-conn-label">Structure / Span:</span>
          <span class="hud-conn-target">${s.length_m} m Length • ${s.max_span_m || "—"} m Max Span (${s.bridge_type})</span>
        </div>
      </div>
      <div class="crossing-hud-footer">
        <button class="hud-btn-inspect" onclick="window.TransportExplorer.inspectAsset('${s.id}')">
          Open Civil Asset Inspector
        </button>
      </div>
    `;

    hud.style.display = "block";
  }

  function clearActiveHighlights() {
    activeHighlightLayers.forEach(l => {
      if (mapInstance && mapInstance.hasLayer(l)) {
        mapInstance.removeLayer(l);
      }
    });
    activeHighlightLayers = [];
    activeStructureMarker = null;

    const hud = document.getElementById("crossingRelationshipHud");
    if (hud) hud.style.display = "none";
  }

  function focusAsset(id) {
    closeModal();
    // 1. Structure
    const s = allStructuresList.find(item => item.id === id);
    if (s && s.coordinates && mapInstance) {
      const [lon, lat] = s.coordinates;
      mapInstance.flyTo([lat, lon], 14, { duration: 1.2 });
      return;
    }

    // 2. Road
    if (window.zoomToHighwayCorridor) {
      window.zoomToHighwayCorridor(id);
    }
  }

  function inspectAsset(id) {
    closeModal();
    // 1. Structure
    const s = allStructuresList.find(item => item.id === id);
    if (s && externalCallbacks.onInspect) {
      const feat = {
        type: "Feature",
        geometry: { type: "Point", coordinates: s.coordinates },
        properties: s
      };
      externalCallbacks.onInspect(feat, s.asset_category);
      return;
    }

    // 2. Road
    const r = allRoadsList.find(item => item.corridor === id || item.name === id);
    if (r && externalCallbacks.onInspect) {
      const feat = {
        type: "Feature",
        geometry: { type: "LineString", coordinates: [] },
        properties: r
      };
      externalCallbacks.onInspect(feat, "highway_corridor");
      return;
    }

    // 3. Port / Airport
    const u = allPortsAirportsList.find(item => item.id === id);
    if (u && externalCallbacks.onInspect) {
      const feat = {
        type: "Feature",
        geometry: { type: "Point", coordinates: [] },
        properties: u
      };
      externalCallbacks.onInspect(feat, u.asset_category === "seaport" ? "commercial_seaport" : "commercial_airport");
      return;
    }
  }

  function exportCSV() {
    const rows = getFilteredInventoryRows();
    if (!rows.length) return;

    let csv = "Asset ID,Name,Category,District,Supporting Corridor / Crossing,Specifications,Responsible Authority\n";
    rows.forEach(r => {
      const cleanName = `"${(r.name || '').replace(/"/g, '""')}"`;
      const cleanCorr = `"${(r.corridorOrCrossing || '').replace(/"/g, '""')}"`;
      const cleanSpec = `"${(r.metrics || '').replace(/"/g, '""')}"`;
      const cleanAuth = `"${(r.authority || '').replace(/"/g, '""')}"`;
      csv += `${r.id},${cleanName},${r.categoryLabel},${r.district},${cleanCorr},${cleanSpec},${cleanAuth}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gujarat_transport_infrastructure_inventory_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ==========================================
  // CIVIL ENGINEERING CALCULATORS (LAB TAB)
  // ==========================================
  function initLabCalculators() {
    // 1. Sight distance inputs
    const speedSlider = document.getElementById("labSpeedSlider");
    const reactionSlider = document.getElementById("labReactionSlider");
    const frictionSlider = document.getElementById("labFrictionSlider");
    const gradeSlider = document.getElementById("labGradeSlider");
    const radiusSlider = document.getElementById("labRadiusSlider");

    if (speedSlider) speedSlider.addEventListener("input", updateSightDistanceCalc);
    if (reactionSlider) reactionSlider.addEventListener("input", updateSightDistanceCalc);
    if (frictionSlider) frictionSlider.addEventListener("input", updateSightDistanceCalc);
    if (gradeSlider) gradeSlider.addEventListener("input", updateSightDistanceCalc);
    if (radiusSlider) radiusSlider.addEventListener("input", updateSightDistanceCalc);

    // 2. Bridge scour inputs
    const dischargeSlider = document.getElementById("labScourDischargeSlider");
    const siltSlider = document.getElementById("labScourSiltSlider");

    if (dischargeSlider) dischargeSlider.addEventListener("input", updateBridgeScourCalc);
    if (siltSlider) siltSlider.addEventListener("input", updateBridgeScourCalc);
  }

  function updateSightDistanceCalc() {
    const V = parseFloat(document.getElementById("labSpeedSlider")?.value || "100");
    const t = parseFloat(document.getElementById("labReactionSlider")?.value || "2.5");
    const f = parseFloat(document.getElementById("labFrictionSlider")?.value || "0.35");
    const G = parseFloat(document.getElementById("labGradeSlider")?.value || "0") / 100;
    const R = parseFloat(document.getElementById("labRadiusSlider")?.value || "500");

    // Display labels
    const vLbl = document.getElementById("lblLabSpeed");
    const tLbl = document.getElementById("lblLabReaction");
    const fLbl = document.getElementById("lblLabFriction");
    const gLbl = document.getElementById("lblLabGrade");
    const rLbl = document.getElementById("lblLabRadius");

    if (vLbl) vLbl.textContent = `${V} km/h`;
    if (tLbl) tLbl.textContent = `${t.toFixed(1)} s`;
    if (fLbl) fLbl.textContent = f.toFixed(2);
    if (gLbl) gLbl.textContent = `${(G * 100).toFixed(1)}%`;
    if (rLbl) rLbl.textContent = `${R} m`;

    // Formula: SSD = 0.278 * V * t + V^2 / (254 * (f + G))
    const lagDist = 0.278 * V * t;
    const denominator = 254 * Math.max(0.1, (f + G));
    const brakeDist = (V * V) / denominator;
    const ssd = lagDist + brakeDist;

    // Superelevation (IRC:73 design for 75% speed): e = V^2 / (225 * R)
    const e = (V * V) / (225 * R);
    const ePercent = e * 100;

    const outLag = document.getElementById("resLabLagDist");
    const outBrake = document.getElementById("resLabBrakeDist");
    const outSSD = document.getElementById("resLabSSD");
    const outSuper = document.getElementById("resLabSuperelevation");
    const outSuperStatus = document.getElementById("resLabSuperStatus");

    if (outLag) outLag.textContent = `${lagDist.toFixed(1)} m`;
    if (outBrake) outBrake.textContent = `${brakeDist.toFixed(1)} m`;
    if (outSSD) outSSD.textContent = `${ssd.toFixed(1)} m`;
    if (outSuper) outSuper.textContent = `${ePercent.toFixed(2)}%`;
    if (outSuperStatus) {
      if (ePercent <= 7.0) {
        outSuperStatus.textContent = "COMPLIANT with IRC:73 Plain/Rolling Terrain (≤ 7.0%)";
        outSuperStatus.style.color = "#4ade80";
      } else if (ePercent <= 10.0) {
        outSuperStatus.textContent = "PERMISSIBLE only for Hilly Terrain (≤ 10.0% max)";
        outSuperStatus.style.color = "#facc15";
      } else {
        outSuperStatus.textContent = "EXCEEDS MAXIMUM ALLOWABLE (Increase curve radius R)";
        outSuperStatus.style.color = "#f87171";
      }
    }
  }

  function updateBridgeScourCalc() {
    const q = parseFloat(document.getElementById("labScourDischargeSlider")?.value || "20");
    const f = parseFloat(document.getElementById("labScourSiltSlider")?.value || "1.0");

    const qLbl = document.getElementById("lblLabScourDischarge");
    const fLbl = document.getElementById("lblLabScourSilt");

    if (qLbl) qLbl.textContent = `${q} m³/s per m`;
    if (fLbl) fLbl.textContent = f.toFixed(2);

    // Lacey's Regime Scour Depth: R = 1.35 * (q^2 / f)^(1/3)
    const R = 1.35 * Math.pow((q * q) / f, 1 / 3);
    const maxPierScour = 2.0 * R; // IRC:78 recommendation for pier scour below HFL
    const minGrip = 0.33 * R; // Minimum foundation grip length

    const outR = document.getElementById("resLabRegimeScour");
    const outPier = document.getElementById("resLabPierScour");
    const outGrip = document.getElementById("resLabFoundationGrip");

    if (outR) outR.textContent = `${R.toFixed(2)} m below HFL`;
    if (outPier) outPier.textContent = `${maxPierScour.toFixed(2)} m below HFL`;
    if (outGrip) outGrip.textContent = `${minGrip.toFixed(2)} m minimum grip`;
  }

  // Public API
  window.TransportExplorer = {
    init,
    open: openModal,
    close: closeModal,
    switchTab,
    focusAsset,
    inspectAsset,
    highlightCrossingRelationship,
    clearActiveHighlights
  };

})();
