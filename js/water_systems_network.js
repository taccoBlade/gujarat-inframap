/**
 * Gujarat InfraMap — Water Systems Network Topological Engine
 * 
 * Provides graph-based relationship indexing, hydraulic network traversal,
 * basin summary aggregation, disconnected network auditing, and the interactive
 * 'Follow the Water' navigation mode across Gujarat's water infrastructure.
 * 
 * Data Sources: CWC National Register of Large Dams, India-WRIS, SSNNL, Gujarat WRD.
 * Disclaimer: Structural & hydrological network topology model; not real-time SCADA telemetry.
 */

(function (window) {
  "use strict";

  // Category Configuration & Visual Semantics
  const CATEGORY_META = {
    water_dam: { label: "Storage Dam", icon: "💧", color: "#0284c7" },
    reservoir: { label: "Reservoir Spread", icon: "🌊", color: "#38bdf8" },
    barrage: { label: "Pick-up Barrage", icon: "🚪", color: "#0891b2" },
    weir: { label: "Pick-up Weir", icon: "🌊", color: "#0284c7" },
    check_dam: { label: "Watershed Check Dam", icon: "🧱", color: "#0d9488" },
    natural_river: { label: "Natural River Trunk", icon: "🏞️", color: "#0284c7" },
    irrigation_canal: { label: "Irrigation Canal", icon: "🌊", color: "#06b6d4" },
    monitoring_station: { label: "Hydrometric Gauge", icon: "📡", color: "#f59e0b" },
    water_treatment_plant: { label: "Water Treatment Plant", icon: "🏭", color: "#10b981" },
    pumping_station: { label: "Bulk Pumping Station", icon: "⚙️", color: "#8b5cf6" },
    command_area: { label: "Irrigation Command Area", icon: "🌾", color: "#84cc16" },
    river_basin: { label: "River Drainage Basin", icon: "🗺️", color: "#6366f1" }
  };

  // State Container
  const state = {
    initialized: false,
    map: null,
    geojsonData: null,
    catalogById: {},
    forwardEdges: {},    // id -> [downstream_ids]
    backwardEdges: {},   // id -> [upstream_ids]
    basinCatalog: {},    // basinName -> [assetIds]
    activeFollowNodeId: null,
    followPathHistory: [],
    flowHighlightLayer: null,
    pulseMarker: null,
    onInspectCallback: null,
    onSelectDamCallback: null
  };

  /**
   * Initialize Water Systems Network with GeoJSON feature collection and map instance
   */
  function init(geojsonData, mapInstance, callbacks = {}) {
    if (!geojsonData || !geojsonData.features) {
      console.warn("[WaterSystemsNetwork] Invalid GeoJSON dataset provided.");
      return;
    }

    state.map = mapInstance;
    state.geojsonData = geojsonData;
    state.onInspectCallback = callbacks.onInspect || null;
    state.onSelectDamCallback = callbacks.onSelectDam || null;

    buildGraph(geojsonData.features);
    state.initialized = true;
    console.log(`[WaterSystemsNetwork] Initialized topological model with ${Object.keys(state.catalogById).length} assets.`);
  }

  /**
   * Build directed adjacency graph from GeoJSON features
   */
  function buildGraph(features) {
    state.catalogById = {};
    state.forwardEdges = {};
    state.backwardEdges = {};
    state.basinCatalog = {};

    features.forEach(feature => {
      const p = feature.properties || {};
      const fid = feature.id || p.id;
      if (!fid) return;

      const record = {
        id: fid,
        name: p.name || "Unnamed Asset",
        category: p.asset_category || "unknown",
        river: p.river || "Regional Waterway",
        basin: p.parent_basin || p.basin || "Gujarat Basin",
        district: p.district || "Gujarat",
        agency: p.operating_agency || p.operating_authority || "Govt of Gujarat",
        grossCap: parseFloat(p.gross_storage_mcm) || 0,
        liveCap: parseFloat(p.live_storage_mcm) || 0,
        hydro: parseFloat(p.hydropower_capacity_mw || p.hydropower_mw) || 0,
        lengthKm: parseFloat(p.length_km) || 0,
        commandHa: parseInt(p.culturable_command_ha || p.irrigation_command_ha, 10) || 0,
        capacityMld: parseFloat(p.capacity_mld) || 0,
        upstreamIds: Array.isArray(p.upstream_ids) ? p.upstream_ids : [],
        downstreamIds: Array.isArray(p.downstream_ids) ? p.downstream_ids : [],
        connectedCanals: Array.isArray(p.connected_canals) ? p.connected_canals : [],
        connectedReservoirs: Array.isArray(p.connected_reservoirs) ? p.connected_reservoirs : [],
        connectedDams: Array.isArray(p.connected_dams) ? p.connected_dams : [],
        commandIds: Array.isArray(p.command_ids) ? p.command_ids : [],
        wtpIds: Array.isArray(p.wtp_ids) ? p.wtp_ids : [],
        monitoringStationIds: Array.isArray(p.monitoring_station_ids) ? p.monitoring_station_ids : [],
        disconnected: Boolean(p.disconnected),
        disconnectionReason: p.disconnection_reason || null,
        geometry: feature.geometry,
        feature: feature
      };

      state.catalogById[fid] = record;
      state.forwardEdges[fid] = [...record.downstreamIds];
      state.backwardEdges[fid] = [...record.upstreamIds];

      // Basin grouping
      const basinName = record.basin;
      if (!state.basinCatalog[basinName]) {
        state.basinCatalog[basinName] = [];
      }
      state.basinCatalog[basinName].push(fid);
    });

    // Ensure bidirectional indexing for explicit upstream/downstream edges
    Object.keys(state.forwardEdges).forEach(sourceId => {
      state.forwardEdges[sourceId].forEach(targetId => {
        if (!state.backwardEdges[targetId]) state.backwardEdges[targetId] = [];
        if (!state.backwardEdges[targetId].includes(sourceId)) {
          state.backwardEdges[targetId].push(sourceId);
        }
      });
    });

    Object.keys(state.backwardEdges).forEach(targetId => {
      state.backwardEdges[targetId].forEach(sourceId => {
        if (!state.forwardEdges[sourceId]) state.forwardEdges[sourceId] = [];
        if (!state.forwardEdges[sourceId].includes(targetId)) {
          state.forwardEdges[sourceId].push(targetId);
        }
      });
    });
  }

  /**
   * Traversal: Get all upstream nodes using BFS
   */
  function getUpstreamAssets(assetId, maxDepth = 10) {
    if (!state.catalogById[assetId]) return [];
    const visited = new Set([assetId]);
    const queue = [{ id: assetId, depth: 0 }];
    const results = [];

    while (queue.length > 0) {
      const current = queue.shift();
      if (current.depth >= maxDepth) continue;

      const upIds = state.backwardEdges[current.id] || [];
      upIds.forEach(uid => {
        if (!visited.has(uid) && state.catalogById[uid]) {
          visited.add(uid);
          const record = state.catalogById[uid];
          results.push({ ...record, depth: current.depth + 1 });
          queue.push({ id: uid, depth: current.depth + 1 });
        }
      });
    }

    return results;
  }

  /**
   * Traversal: Get all downstream nodes using BFS
   */
  function getDownstreamAssets(assetId, maxDepth = 10) {
    if (!state.catalogById[assetId]) return [];
    const visited = new Set([assetId]);
    const queue = [{ id: assetId, depth: 0 }];
    const results = [];

    while (queue.length > 0) {
      const current = queue.shift();
      if (current.depth >= maxDepth) continue;

      const downIds = state.forwardEdges[current.id] || [];
      downIds.forEach(did => {
        if (!visited.has(did) && state.catalogById[did]) {
          visited.add(did);
          const record = state.catalogById[did];
          results.push({ ...record, depth: current.depth + 1 });
          queue.push({ id: did, depth: current.depth + 1 });
        }
      });
    }

    return results;
  }

  /**
   * Full Hydraulic Chain: All upstream nodes -> Current -> All downstream nodes
   */
  function getFullHydraulicChain(assetId) {
    const current = state.catalogById[assetId];
    if (!current) return [];

    const upstream = getUpstreamAssets(assetId).reverse(); // Far upstream first
    const downstream = getDownstreamAssets(assetId);

    return [
      ...upstream.map(u => ({ ...u, position: "upstream" })),
      { ...current, depth: 0, position: "active" },
      ...downstream.map(d => ({ ...d, position: "downstream" }))
    ];
  }

  /**
   * Get Immediate Hydraulic Neighbors (for Asset Inspector Tab)
   */
  function getImmediateNeighbors(assetId) {
    const node = state.catalogById[assetId];
    if (!node) return { upstream: [], downstream: [], lateral: [] };

    const upstream = (state.backwardEdges[assetId] || [])
      .map(id => state.catalogById[id])
      .filter(Boolean);

    const downstream = (state.forwardEdges[assetId] || [])
      .map(id => state.catalogById[id])
      .filter(Boolean);

    // Lateral linkages (canals, reservoirs, command footprints, WTPs, gauge stations)
    const lateralIds = new Set([
      ...node.connectedCanals,
      ...node.connectedReservoirs,
      ...node.connectedDams,
      ...node.commandIds,
      ...node.wtpIds,
      ...node.monitoringStationIds
    ]);

    const lateral = Array.from(lateralIds)
      .filter(id => id !== assetId && !state.backwardEdges[assetId]?.includes(id) && !state.forwardEdges[assetId]?.includes(id))
      .map(id => state.catalogById[id])
      .filter(Boolean);

    return { upstream, downstream, lateral };
  }

  /**
   * Basin Aggregates with Coverage Transparency
   */
  function getBasinMetrics(basinName) {
    const assetIds = state.basinCatalog[basinName] || [];
    const assets = assetIds.map(id => state.catalogById[id]).filter(Boolean);

    let grossStorage = 0;
    let liveStorage = 0;
    let hydropower = 0;
    let commandArea = 0;
    let canalLength = 0;
    let riverLength = 0;
    let gaugeCount = 0;
    let wtpCapacity = 0;
    let isCoveragePartial = false;
    let coverageNotes = "Verified Major Trunk Infrastructure";

    assets.forEach(a => {
      grossStorage += a.grossCap;
      liveStorage += a.liveCap;
      hydropower += a.hydro;
      commandArea += a.commandHa;
      if (a.category === "irrigation_canal") canalLength += a.lengthKm;
      if (a.category === "natural_river") riverLength += a.lengthKm;
      if (a.category === "monitoring_station") gaugeCount++;
      if (a.category === "water_treatment_plant") wtpCapacity += a.capacityMld;
    });

    // Rigorous domain transparency notes
    if (basinName.includes("Saurashtra")) {
      isCoveragePartial = true;
      coverageNotes = "Totals represent mapped CWC large dams & major rivers. Thousands of local check dams & SAUNI tertiary pipelines not aggregated.";
    } else if (basinName.includes("Kutch")) {
      isCoveragePartial = true;
      coverageNotes = "Arid ephemeral basin: storage relies heavily on monsoon spates and Kutch Branch Canal inter-basin water imports.";
    } else if (basinName.includes("Banas")) {
      coverageNotes = "Semi-arid North Gujarat basin with high monsoon variance and seasonal sand aquifer recharge.";
    }

    return {
      basinName,
      totalAssets: assets.length,
      grossStorageMcm: grossStorage,
      liveStorageMcm: liveStorage,
      hydropowerMw: hydropower,
      commandAreaHa: commandArea,
      canalLengthKm: canalLength,
      riverLengthKm: riverLength,
      gaugeStationsCount: gaugeCount,
      wtpCapacityMld: wtpCapacity,
      isCoveragePartial,
      coverageNotes,
      assets
    };
  }

  /**
   * Get List of All Basin Names
   */
  function getAllBasinNames() {
    return Object.keys(state.basinCatalog).sort();
  }

  /**
   * Disconnected Assets Audit
   */
  function getDisconnectedAudit() {
    const disconnected = [];
    Object.values(state.catalogById).forEach(node => {
      const up = state.backwardEdges[node.id] || [];
      const down = state.forwardEdges[node.id] || [];
      if (node.disconnected || (up.length === 0 && down.length === 0 && !["river_basin", "command_area"].includes(node.category))) {
        disconnected.push({
          id: node.id,
          name: node.name,
          category: node.category,
          basin: node.basin,
          reason: node.disconnectionReason || "No verified upstream or downstream hydraulic edges recorded in trunk grid register."
        });
      }
    });
    return disconnected;
  }

  /**
   * 'Follow the Water' Mode: Start at given Asset ID
   */
  function startFollowWater(assetId = "GJ-WR-DAM-001") {
    const node = state.catalogById[assetId];
    if (!node) {
      console.warn(`[WaterSystemsNetwork] Asset not found: ${assetId}`);
      return;
    }

    state.activeFollowNodeId = assetId;
    state.followPathHistory = [assetId];

    ensureHUDCreated();
    updateHUD(node);
    highlightNodeOnMap(node);

    const hud = document.getElementById("followWaterHUD");
    if (hud) hud.classList.add("active");
  }

  /**
   * 'Follow the Water' Mode: Step Downstream
   */
  function stepDownstream() {
    if (!state.activeFollowNodeId) return;
    const downIds = state.forwardEdges[state.activeFollowNodeId] || [];

    if (downIds.length === 0) {
      alert("Terminal Flow Node reached: Waters have reached downstream coastal discharge, municipal distribution, or end of mapped canal reach.");
      return;
    }

    if (downIds.length === 1) {
      navigateToNode(downIds[0]);
    } else {
      // Multiple downstream paths (e.g. canal headworks vs riverbed release)
      promptBranchSelection(downIds, "downstream");
    }
  }

  /**
   * 'Follow the Water' Mode: Step Upstream
   */
  function stepUpstream() {
    if (!state.activeFollowNodeId) return;
    const upIds = state.backwardEdges[state.activeFollowNodeId] || [];

    if (upIds.length === 0) {
      alert("Headwaters reached: This is the uppermost mapped catchment reach or inflow boundary.");
      return;
    }

    if (upIds.length === 1) {
      navigateToNode(upIds[0]);
    } else {
      promptBranchSelection(upIds, "upstream");
    }
  }

  /**
   * 'Follow the Water' Mode: Navigate to specific node ID
   */
  function navigateToNode(targetId) {
    const node = state.catalogById[targetId];
    if (!node) return;

    state.activeFollowNodeId = targetId;
    state.followPathHistory.push(targetId);

    updateHUD(node);
    highlightNodeOnMap(node);
  }

  /**
   * 'Follow the Water' Mode: Exit
   */
  function exitFollowWater() {
    state.activeFollowNodeId = null;
    state.followPathHistory = [];

    const hud = document.getElementById("followWaterHUD");
    if (hud) hud.classList.remove("active");

    clearMapHighlights();
  }

  /**
   * Show branch selection dialog in HUD
   */
  function promptBranchSelection(nodeIds, direction) {
    const branchContainer = document.getElementById("followWaterBranches");
    if (!branchContainer) return;

    const label = direction === "downstream" ? "Choose Downstream Flow Branch:" : "Choose Upstream Contributing Reach:";
    branchContainer.innerHTML = `
      <div class="fwh-branch-picker">
        <span class="fwh-branch-label">${label}</span>
        <div class="fwh-branch-chips">
          ${nodeIds.map(id => {
            const n = state.catalogById[id];
            if (!n) return "";
            const meta = CATEGORY_META[n.category] || { icon: "💧" };
            return `
              <button class="fwh-branch-chip" onclick="window.WaterSystemsNetwork.navigateToNode('${n.id}')">
                <span>${meta.icon} ${n.name}</span>
                <small>${n.category.replace(/_/g, " ")}</small>
              </button>
            `;
          }).join("")}
        </div>
      </div>
    `;
    branchContainer.style.display = "block";
  }

  /**
   * Ensure Floating HUD DOM element exists
   */
  function ensureHUDCreated() {
    let hud = document.getElementById("followWaterHUD");
    if (!hud) {
      hud = document.createElement("div");
      hud.id = "followWaterHUD";
      hud.className = "follow-water-hud";
      hud.setAttribute("role", "region");
      hud.setAttribute("aria-label", "Follow the Water Interactive Navigation");
      document.body.appendChild(hud);
    }
  }

  /**
   * Update Floating HUD with current active node details
   */
  function updateHUD(node) {
    const hud = document.getElementById("followWaterHUD");
    if (!hud) return;

    const meta = CATEGORY_META[node.category] || { label: "Hydraulic Asset", icon: "💧", color: "#38bdf8" };
    const upCount = (state.backwardEdges[node.id] || []).length;
    const downCount = (state.forwardEdges[node.id] || []).length;

    let metricSummary = "";
    if (node.grossCap > 0) {
      metricSummary = `<strong>${node.grossCap.toLocaleString()} MCM</strong> gross storage`;
    } else if (node.lengthKm > 0) {
      metricSummary = `<strong>${node.lengthKm.toLocaleString()} km</strong> channel length`;
    } else if (node.capacityMld > 0) {
      metricSummary = `<strong>${node.capacityMld.toLocaleString()} MLD</strong> treatment capacity`;
    } else if (node.commandHa > 0) {
      metricSummary = `<strong>${node.commandHa.toLocaleString()} ha</strong> command footprint`;
    } else {
      metricSummary = `<span style="color: #94a3b8;">${node.district}</span>`;
    }

    hud.innerHTML = `
      <div class="fwh-inner">
        <div class="fwh-top">
          <div class="fwh-badge-wrap">
            <span class="fwh-pulse-dot"></span>
            <span class="fwh-cat-badge" style="background: ${meta.color};">${meta.icon} ${meta.label.toUpperCase()}</span>
            <span class="fwh-basin-tag">${node.basin}</span>
          </div>
          <button class="fwh-close-btn" onclick="window.WaterSystemsNetwork.exitFollowWater()" title="Exit Follow the Water Mode">×</button>
        </div>

        <div class="fwh-title-row">
          <h3 class="fwh-node-title">${node.name}</h3>
          <span class="fwh-river-name">${node.river}</span>
        </div>

        <div class="fwh-metric-row">
          <span class="fwh-metric-pill">${metricSummary}</span>
          ${node.hydro > 0 ? `<span class="fwh-metric-pill" style="color: #38bdf8;">⚡ ${node.hydro} MW</span>` : ""}
          <span class="fwh-metric-pill" style="color: #94a3b8;">${node.agency}</span>
        </div>

        <div id="followWaterBranches" style="display: none;"></div>

        <div class="fwh-controls">
          <button class="fwh-nav-btn ${upCount === 0 ? 'disabled' : ''}" onclick="window.WaterSystemsNetwork.stepUpstream()" ${upCount === 0 ? 'disabled' : ''} title="Follow water upstream against hydraulic flow">
            ← Upstream (${upCount})
          </button>
          
          <button class="fwh-inspect-btn" onclick="window.WaterSystemsNetwork.inspectCurrentNode()" title="Open Asset Inspector detail drawer">
            🔍 Inspect
          </button>

          <button class="fwh-nav-btn fwh-nav-btn-next ${downCount === 0 ? 'disabled' : ''}" onclick="window.WaterSystemsNetwork.stepDownstream()" ${downCount === 0 ? 'disabled' : ''} title="Follow water downstream along hydraulic gradient">
            Downstream (${downCount}) →
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Highlight Active Node & Directional Vectors on Leaflet Map
   */
  function highlightNodeOnMap(node) {
    if (!state.map) return;
    clearMapHighlights();

    // Create highlight group if needed
    if (!state.flowHighlightLayer) {
      state.flowHighlightLayer = L.featureGroup().addTo(state.map);
    }

    const geom = node.geometry;
    let centerLatLng = null;

    if (geom.type === "Point") {
      centerLatLng = [geom.coordinates[1], geom.coordinates[0]];

      // Add animated pulsing circle marker
      state.pulseMarker = L.circleMarker(centerLatLng, {
        pane: "waterHighlightPane",
        radius: 14,
        fillColor: "#38bdf8",
        color: "#ffffff",
        weight: 3,
        opacity: 1,
        fillOpacity: 0.95,
        className: "water-pulse-active-marker"
      }).addTo(state.flowHighlightLayer);

      state.map.flyTo(centerLatLng, Math.max(state.map.getZoom(), 11), { duration: 0.8 });

    } else if (geom.type === "LineString") {
      const lineLayer = L.geoJSON(node.feature, {
        pane: "waterHighlightPane",
        style: {
          color: "#38bdf8",
          weight: 7,
          opacity: 0.95,
          dashArray: "10, 8",
          className: "water-flow-active-line"
        }
      }).addTo(state.flowHighlightLayer);

      const bounds = lineLayer.getBounds();
      state.map.fitBounds(bounds, { padding: [60, 60], maxZoom: 12 });
      centerLatLng = bounds.getCenter();

    } else if (geom.type === "Polygon") {
      const polyLayer = L.geoJSON(node.feature, {
        pane: "waterHighlightPane",
        style: {
          color: "#38bdf8",
          weight: 3,
          fillColor: "#0284c7",
          fillOpacity: 0.45,
          className: "water-flow-active-poly"
        }
      }).addTo(state.flowHighlightLayer);

      const bounds = polyLayer.getBounds();
      state.map.fitBounds(bounds, { padding: [60, 60], maxZoom: 12 });
      centerLatLng = bounds.getCenter();
    }
  }

  /**
   * Clear Map Highlight Layers
   */
  function clearMapHighlights() {
    if (state.flowHighlightLayer) {
      state.flowHighlightLayer.clearLayers();
    }
  }

  /**
   * Inspect current node in Asset Inspector
   */
  function inspectCurrentNode() {
    if (!state.activeFollowNodeId) return;
    const node = state.catalogById[state.activeFollowNodeId];
    if (!node) return;

    if (typeof state.onInspectCallback === "function") {
      state.onInspectCallback({
        properties: node.feature.properties,
        geometry: node.geometry,
        type: node.category
      });
    } else if (window.AssetInspector && typeof window.AssetInspector.inspect === "function") {
      window.AssetInspector.inspect({
        properties: node.feature.properties,
        geometry: node.geometry,
        type: node.category
      });
    }
  }

  /**
   * Open Network Modal Explorer
   */
  function openNetworkModal() {
    const modal = document.getElementById("waterNetworkModal");
    if (!modal) return;
    renderNetworkModalContent();
    modal.showModal();
  }

  /**
   * Close Network Modal Explorer
   */
  function closeNetworkModal() {
    const modal = document.getElementById("waterNetworkModal");
    if (modal) modal.close();
  }

  /**
   * Render Comprehensive Content for Water Network Explorer Modal
   */
  function renderNetworkModalContent() {
    const container = document.getElementById("waterNetworkModalBody");
    if (!container) return;

    const basins = getAllBasinNames();
    const disconnected = getDisconnectedAudit();

    container.innerHTML = `
      <div class="wn-modal-tabs">
        <button class="wn-modal-tab-btn active" data-tab="wnBasins">🏞️ Basin Summaries & Storage</button>
        <button class="wn-modal-tab-btn" data-tab="wnChain">⛓️ Hydraulic Chain Traversal</button>
        <button class="wn-modal-tab-btn" data-tab="wnAudit">⚠️ Network Audit & Disconnected</button>
        <button class="wn-modal-tab-btn" data-tab="wnDisclaimer">📜 Model Standards & Disclaimer</button>
      </div>

      <!-- Tab 1: Basin Summaries -->
      <div class="wn-modal-pane active" id="paneWnBasins">
        <div class="wn-basin-grid">
          ${basins.map(bName => {
            const m = getBasinMetrics(bName);
            return `
              <div class="wn-basin-card">
                <div class="wn-basin-card-header">
                  <h4 class="wn-basin-title">🏞️ ${m.basinName}</h4>
                  <span class="wn-basin-count">${m.totalAssets} Mapped Assets</span>
                </div>
                
                <div class="wn-basin-kpis">
                  <div class="wn-kpi">
                    <span class="wn-kpi-val" style="color: #38bdf8;">${m.grossStorageMcm > 0 ? m.grossStorageMcm.toLocaleString() + ' MCM' : '—'}</span>
                    <span class="wn-kpi-lbl">Gross Storage</span>
                  </div>
                  <div class="wn-kpi">
                    <span class="wn-kpi-val" style="color: #22d3ee;">${m.liveStorageMcm > 0 ? m.liveStorageMcm.toLocaleString() + ' MCM' : '—'}</span>
                    <span class="wn-kpi-lbl">Live Storage</span>
                  </div>
                  <div class="wn-kpi">
                    <span class="wn-kpi-val">${m.hydropowerMw > 0 ? m.hydropowerMw + ' MW' : 'Non-Hydro'}</span>
                    <span class="wn-kpi-lbl">Hydropower</span>
                  </div>
                  <div class="wn-kpi">
                    <span class="wn-kpi-val">${m.gaugeStationsCount}</span>
                    <span class="wn-kpi-lbl">CWC Gauges</span>
                  </div>
                </div>

                <div class="wn-basin-footer">
                  <span class="wn-coverage-note ${m.isCoveragePartial ? 'wn-partial' : ''}">
                    ${m.isCoveragePartial ? '⚠️ ' : '✓ '} ${m.coverageNotes}
                  </span>
                  <button class="btn-sm btn-outline-cyan" onclick="window.WaterSystemsNetwork.inspectFirstAssetInBasin('${m.basinName.replace(/'/g, "\\'")}')">
                    Inspect Basin ➔
                  </button>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>

      <!-- Tab 2: Hydraulic Chain Traversal -->
      <div class="wn-modal-pane" id="paneWnChain" style="display: none;">
        <div class="wn-chain-controls">
          <label for="chainSelectNode"><strong>Select Headworks or River Node to Trace Flow Chain:</strong></label>
          <select id="chainSelectNode" class="dam-dropdown" onchange="window.WaterSystemsNetwork.renderChainForSelected(this.value)">
            <option value="GJ-WR-DAM-001">Sardar Sarovar Dam (Narmada Lifeline Grid)</option>
            <option value="GJ-WR-DAM-002">Ukai Dam (Tapi River Trunk)</option>
            <option value="GJ-WR-DAM-003">Kadana Dam (Mahi Interstate Grid)</option>
            <option value="GJ-WR-DAM-004">Dharoi Dam (Sabarmati Basin Master Headworks)</option>
            <option value="GJ-WR-DAM-005">Dantiwada Dam (Banas River Semi-Arid Basin)</option>
            <option value="GJ-WR-DAM-006">Shetrunji Dam (Saurashtra Coastal Lifeline)</option>
            <option value="GJ-WR-DAM-011">Machhu II Dam (Morbi Reconstructed Barrier)</option>
            <option value="GJ-WR-CAN-001">Narmada Main Canal (NMC 458 km Trunk)</option>
          </select>
        </div>
        <div id="chainVisualizer" class="wn-chain-flow-strip"></div>
      </div>

      <!-- Tab 3: Disconnected & Audit -->
      <div class="wn-modal-pane" id="paneWnAudit" style="display: none;">
        <div class="wn-audit-box">
          <div class="wn-audit-header">
            <h4>⚠️ Topological Disconnection & Data Limitation Warnings</h4>
            <p>Assets listed below operate as closed local catchments, seasonal ephemeral check dams, or micro-watershed recharges without perennial trunk channel connectivity. They are tracked for complete statutory inventory accounting but isolated from regional multi-basin dispatch traversal.</p>
          </div>
          <table class="dams-table">
            <thead>
              <tr>
                <th>Asset ID</th>
                <th>Asset Name</th>
                <th>Category</th>
                <th>Parent Basin</th>
                <th>Documented Disconnection Rationale</th>
              </tr>
            </thead>
            <tbody>
              ${disconnected.map(d => `
                <tr>
                  <td><code>${d.id}</code></td>
                  <td><strong>${d.name}</strong></td>
                  <td><span class="dams-cat-badge">${d.category.replace(/_/g, " ")}</span></td>
                  <td>${d.basin}</td>
                  <td style="color: #fbbf24;"><small>${d.reason}</small></td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tab 4: Disclaimer & Standards -->
      <div class="wn-modal-pane" id="paneWnDisclaimer" style="display: none;">
        <div class="wn-disclaimer-card">
          <h4>📜 Statutory Hydrological Model Standards & Regulatory Scope</h4>
          <p>This digital twin water module implements a <strong>structural and hydrological network topology model</strong> constructed from verified publications by the Central Water Commission (CWC NRLD 2023), Sardar Sarovar Narmada Nigam Limited (SSNNL), National Dam Safety Authority (NDSA), and the Gujarat Water Resources Department.</p>
          
          <div class="wn-standards-grid">
            <div class="wn-std-item">
              <span class="wn-std-icon">⚖️</span>
              <div>
                <strong>Zero Proximity Heuristics</strong>
                <p>Nodes are connected exclusively by verified physical hydraulic conveyance (canals, gates, spillways, river channels, and treatment intakes) documented in official engineering reports. No artificial proximity or Euclidean bounding links are generated.</p>
              </div>
            </div>

            <div class="wn-std-item">
              <span class="wn-std-icon">📡</span>
              <div>
                <strong>Telemetry Transparency</strong>
                <p>This graph models physical connectivity and design capacities. It does NOT represent real-time SCADA operational dispatch or hydrodynamic gate actuation telemetry unless specifically tied to an active, authenticated government API telemetry stream.</p>
              </div>
            </div>

            <div class="wn-std-item">
              <span class="wn-std-icon">📊</span>
              <div>
                <strong>Aggregated Metric Integrity</strong>
                <p>Storage and command metrics are aggregated per river basin. Where data are incomplete (e.g. distributed Saurashtra check dam networks or arid Kutch ephemeral gullies), totals are explicitly qualified to avoid misleading municipal capacity estimations.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Bind tab switching
    container.querySelectorAll(".wn-modal-tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        container.querySelectorAll(".wn-modal-tab-btn").forEach(b => b.classList.remove("active"));
        container.querySelectorAll(".wn-modal-pane").forEach(p => p.style.display = "none");

        btn.classList.add("active");
        const targetPane = document.getElementById("pane" + btn.dataset.tab.charAt(0).toUpperCase() + btn.dataset.tab.slice(1));
        if (targetPane) targetPane.style.display = "block";
      });
    });

    // Render initial chain
    renderChainForSelected("GJ-WR-DAM-001");
  }

  /**
   * Render Hydraulic Chain Strip for chosen asset
   */
  function renderChainForSelected(assetId) {
    const container = document.getElementById("chainVisualizer");
    if (!container) return;

    const chain = getFullHydraulicChain(assetId);
    if (chain.length === 0) {
      container.innerHTML = `<div class="insp-empty-msg">No hydraulic chain found for this node.</div>`;
      return;
    }

    container.innerHTML = `
      <div class="wn-chain-track">
        ${chain.map((c, idx) => {
          const meta = CATEGORY_META[c.category] || { icon: "💧", color: "#38bdf8" };
          const isActive = c.id === assetId;
          return `
            <div class="wn-chain-node ${isActive ? 'active' : ''}" style="border-top-color: ${meta.color};">
              <span class="wn-chain-step">Step ${idx + 1}</span>
              <span class="wn-chain-icon">${meta.icon}</span>
              <strong class="wn-chain-name">${c.name}</strong>
              <small class="wn-chain-meta">${c.category.replace(/_/g, " ")}</small>
              <button class="wn-chain-btn" onclick="window.WaterSystemsNetwork.startFollowWater('${c.id}')">
                Follow Here ➔
              </button>
            </div>
            ${idx < chain.length - 1 ? `<div class="wn-chain-arrow">➔</div>` : ""}
          `;
        }).join("")}
      </div>
    `;
  }

  /**
   * Inspect first asset in basin
   */
  function inspectFirstAssetInBasin(basinName) {
    const assetIds = state.basinCatalog[basinName] || [];
    if (assetIds.length === 0) return;
    closeNetworkModal();
    startFollowWater(assetIds[0]);
  }

  // Public Interface
  window.WaterSystemsNetwork = {
    init,
    getUpstreamAssets,
    getDownstreamAssets,
    getFullHydraulicChain,
    getImmediateNeighbors,
    getBasinMetrics,
    getAllBasinNames,
    getDisconnectedAudit,
    startFollowWater,
    stepDownstream,
    stepUpstream,
    navigateToNode,
    exitFollowWater,
    inspectCurrentNode,
    openNetworkModal,
    closeNetworkModal,
    renderChainForSelected,
    inspectFirstAssetInBasin
  };

})(typeof window !== "undefined" ? window : global);
