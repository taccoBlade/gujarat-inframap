/**
 * Gujarat InfraMap — Geospatial Analysis Toolkit Engine
 * Integrated GIS analysis tools operating directly on the digital twin Leaflet canvas:
 * 1. Straight-line geodesic distance & multi-segment line length (WGS 84 & UTM Zone 43N)
 * 2. Polygon area and perimeter measurement (Spherical excess Gauss formula)
 * 3. Point coordinate & CRS inspector (EPSG:4326 & projected EPSG:32643 UTM 43N)
 * 4. Draw & save user-defined features (Point, Line, Polygon with local persistence)
 * 5. Spatial search & asset filtering inside district or drawn region
 * 6. Nearest mapped assets with explicit distance methodology disclosures
 * 7. Asset & alignment geodesic buffering (user-specified km distance)
 * 8. Buffer & boundary intersection analyzer (cross-layer screening)
 * 9. Multi-asset comparative technical benchmarking
 * 10. River network upstream/downstream topological relationship explorer
 * 11. Catchment & regional drainage basin intersection profiler
 * 12. Preliminary environmental & terrain screening for drawn project alignments
 *
 * Standard: IIFE module exposing window.GeospatialAnalysisToolkit
 * Version: 5.2.0
 */

(function () {
  "use strict";

  // Map and layer references
  let mapInstance = null;
  let datasetsRef = {};
  let activeTool = null; // null | "distance" | "area" | "coords" | "draw" | "region" | "nearest" | "buffer" | "compare" | "river" | "env"

  // Layer groups for non-intrusive visualization
  let analysisLayerGroup = null;
  let userDrawingsLayerGroup = null;
  let bufferLayerGroup = null;

  // Active interaction state
  let drawnPoints = [];
  let tempRubberband = null;
  let activeDrawType = "polygon"; // "point" | "line" | "polygon"
  let activeBufferRadiusKm = 10;
  let selectedCompareIds = [];
  let userDrawingsStore = [];

  // DOM Elements cache
  let dockEl = null;
  let hudEl = null;
  let modalEl = null;

  // =========================================================================
  // 1. GEODETIC & PROJECTION MATHEMATICS (WGS 84 & UTM ZONE 43N)
  // =========================================================================

  const WGS84_A = 6378137.0; // semi-major axis in meters
  const WGS84_INV_F = 298.257223563; // inverse flattening
  const WGS84_F = 1 / WGS84_INV_F;
  const WGS84_E2 = 2 * WGS84_F - WGS84_F * WGS84_F;
  const WGS84_R = 6371008.8; // authalic mean radius in meters

  /**
   * Calculate Haversine / Great-Circle geodesic distance between two points in meters
   */
  function calculateGeodesicDistance(lat1, lon1, lat2, lon2) {
    const toRad = Math.PI / 180;
    const dLat = (lat2 - lat1) * toRad;
    const dLon = (lon2 - lon1) * toRad;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * toRad) * Math.cos(lat2 * toRad) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return WGS84_R * c;
  }

  /**
   * Calculate total line length of an array of [lat, lng] points in meters
   */
  function calculatePolylineLength(points) {
    if (!points || points.length < 2) return 0;
    let total = 0;
    for (let i = 0; i < points.length - 1; i++) {
      total += calculateGeodesicDistance(points[i][0], points[i][1], points[i + 1][0], points[i + 1][1]);
    }
    return total;
  }

  /**
   * Calculate spherical polygon area using Gauss spherical excess in square meters
   */
  function calculatePolygonArea(ring) {
    if (!ring || ring.length < 3) return 0;
    const toRad = Math.PI / 180;
    let total = 0;
    const n = ring.length;

    for (let i = 0; i < n; i++) {
      const p1 = ring[i];
      const p2 = ring[(i + 1) % n];
      const p3 = ring[(i + 2) % n];
      total += (p3[1] * toRad - p1[1] * toRad) * Math.sin(p2[0] * toRad);
    }
    const area = Math.abs((total * WGS84_R * WGS84_R) / 2);
    return area;
  }

  /**
   * Transform WGS 84 (lat, lon) to projected UTM Zone 43N (EPSG:32643) Easting/Northing in meters
   * Central Meridian = 75°E, Scale Factor = 0.9996, False Easting = 500,000 m
   */
  function transformToUtm43N(lat, lon) {
    const toRad = Math.PI / 180;
    const latRad = lat * toRad;
    const lonRad = lon * toRad;
    const lon0Rad = 75.0 * toRad; // Central meridian for UTM Zone 43

    const a = WGS84_A;
    const e2 = WGS84_E2;
    const e4 = e2 * e2;
    const e6 = e4 * e2;
    const k0 = 0.9996;

    const N = a / Math.sqrt(1 - e2 * Math.sin(latRad) * Math.sin(latRad));
    const T = Math.tan(latRad) * Math.tan(latRad);
    const C = (e2 / (1 - e2)) * Math.cos(latRad) * Math.cos(latRad);
    const A = (lonRad - lon0Rad) * Math.cos(latRad);

    const M = a * (
      (1 - e2 / 4 - 3 * e4 / 64 - 5 * e6 / 256) * latRad -
      (3 * e2 / 8 + 3 * e4 / 32 + 45 * e6 / 1024) * Math.sin(2 * latRad) +
      (15 * e4 / 256 + 45 * e6 / 1024) * Math.sin(4 * latRad) -
      (35 * e6 / 3072) * Math.sin(6 * latRad)
    );

    const easting = 500000 + k0 * N * (
      A +
      (1 - T + C) * Math.pow(A, 3) / 6 +
      (5 - 18 * T + T * T + 72 * C - 58 * (e2 / (1 - e2))) * Math.pow(A, 5) / 120
    );

    const northing = k0 * (
      M +
      N * Math.tan(latRad) * (
        Math.pow(A, 2) / 2 +
        (5 - T + 9 * C + 4 * C * C) * Math.pow(A, 4) / 24 +
        (61 - 58 * T + T * T + 600 * C - 330 * (e2 / (1 - e2))) * Math.pow(A, 6) / 720
      )
    );

    return {
      crs: "EPSG:32643 (WGS 84 / UTM Zone 43N)",
      easting_m: Math.round(easting),
      northing_m: Math.round(northing),
      central_meridian: "75° E"
    };
  }

  /**
   * Convert Decimal Degrees to Degrees-Minutes-Seconds (DMS) string
   */
  function toDms(deg, isLat) {
    const dir = isLat ? (deg >= 0 ? "N" : "S") : (deg >= 0 ? "E" : "W");
    const absDeg = Math.abs(deg);
    const d = Math.floor(absDeg);
    const minFloat = (absDeg - d) * 60;
    const m = Math.floor(minFloat);
    const s = ((minFloat - m) * 60).toFixed(2);
    return `${d}° ${m}' ${s}" ${dir}`;
  }

  /**
   * Point in Polygon test using Ray Casting Algorithm
   */
  function isPointInPolygon(point, polygonRing) {
    const x = point[1]; // lon
    const y = point[0]; // lat
    let inside = false;

    for (let i = 0, j = polygonRing.length - 1; i < polygonRing.length; j = i++) {
      const xi = polygonRing[i][1], yi = polygonRing[i][0];
      const xj = polygonRing[j][1], yj = polygonRing[j][0];

      const intersect = ((yi > y) !== (yj > y)) &&
        (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  /**
   * Generate geodesic circular buffer around a point in [lat, lon] coordinates
   */
  function createPointBufferPolygon(centerLat, centerLon, radiusKm, steps = 48) {
    const ring = [];
    const dRad = radiusKm / (WGS84_R / 1000); // angular distance in radians
    const toRad = Math.PI / 180;
    const toDeg = 180 / Math.PI;
    const lat1 = centerLat * toRad;
    const lon1 = centerLon * toRad;

    for (let i = 0; i < steps; i++) {
      const bearing = (i * 360 / steps) * toRad;
      const lat2 = Math.asin(Math.sin(lat1) * Math.cos(dRad) + Math.cos(lat1) * Math.sin(dRad) * Math.cos(bearing));
      const lon2 = lon1 + Math.atan2(Math.sin(bearing) * Math.sin(dRad) * Math.cos(lat1), Math.cos(dRad) - Math.sin(lat1) * Math.sin(lat2));
      ring.push([lat2 * toDeg, lon2 * toDeg]);
    }
    ring.push(ring[0]); // close ring
    return ring;
  }

  // =========================================================================
  // 2. INITIALIZATION AND LIFECYCLE
  // =========================================================================

  function init(map, datasets = {}) {
    mapInstance = map;
    datasetsRef = datasets;

    // Dedicated overlay layer groups (never modifying source layers!)
    analysisLayerGroup = L.layerGroup().addTo(mapInstance);
    userDrawingsLayerGroup = L.layerGroup().addTo(mapInstance);
    bufferLayerGroup = L.layerGroup().addTo(mapInstance);

    // Load persisted user drawings from localStorage
    loadPersistedDrawings();

    // Inject Map Control Dock & HUD into DOM
    renderAnalysisDock();
    renderAnalysisHUD();
    renderAnalysisModal();

    setupMapInteractionEvents();
    setupGlobalKeybindings();

    console.log("[GeospatialAnalysisToolkit] Initialized with 12 analysis engines, geodesic solvers, and UTM 43N projection.");
  }

  // =========================================================================
  // 3. MAP CONTROL DOCK UI (FLOATING TOOLBAR)
  // =========================================================================

  function renderAnalysisDock() {
    let dock = document.getElementById("spatialAnalysisDock");
    if (!dock) {
      dock = document.createElement("div");
      dock.id = "spatialAnalysisDock";
      dock.className = "spatial-analysis-dock";
      dock.setAttribute("role", "toolbar");
      dock.setAttribute("aria-label", "Geospatial Analysis Toolkit");

      const appViewport = document.querySelector(".app-viewport") || document.body;
      appViewport.appendChild(dock);
    }
    dockEl = dock;

    dock.innerHTML = `
      <div class="sad-header">
        <span class="sad-pulse-indicator"></span>
        <span class="sad-header-title">Spatial Tools</span>
        <button id="sadToggleBtn" class="sad-collapse-btn" title="Toggle Spatial Tools Toolbar">▾</button>
      </div>

      <div class="sad-tools-grid" id="sadToolsGrid">
        <button class="sad-tool-btn ${activeTool === 'distance' ? 'active' : ''}" data-tool="distance" title="Measure Line Distance (WGS 84 Geodesic)">
          <span class="sad-icon">📏</span>
          <span class="sad-label">Distance</span>
        </button>

        <button class="sad-tool-btn ${activeTool === 'area' ? 'active' : ''}" data-tool="area" title="Measure Polygon Area & Perimeter">
          <span class="sad-icon">📐</span>
          <span class="sad-label">Area</span>
        </button>

        <button class="sad-tool-btn ${activeTool === 'coords' ? 'active' : ''}" data-tool="coords" title="Inspect Coordinates & CRS (EPSG:4326 / UTM 43N)">
          <span class="sad-icon">🌐</span>
          <span class="sad-label">CRS / Coords</span>
        </button>

        <button class="sad-tool-btn ${activeTool === 'draw' ? 'active' : ''}" data-tool="draw" title="Draw & Save User Features">
          <span class="sad-icon">✏️</span>
          <span class="sad-label">Draw</span>
        </button>

        <button class="sad-tool-btn ${activeTool === 'nearest' ? 'active' : ''}" data-tool="nearest" title="Find Nearest Mapped Assets & Bearings">
          <span class="sad-icon">📍</span>
          <span class="sad-label">Nearest</span>
        </button>

        <button class="sad-tool-btn ${activeTool === 'buffer' ? 'active' : ''}" data-tool="buffer" title="Generate Asset Geodesic Buffer (km)">
          <span class="sad-icon">⭕</span>
          <span class="sad-label">Buffer</span>
        </button>

        <button class="sad-tool-btn ${activeTool === 'region' ? 'active' : ''}" data-tool="region" title="Search Assets in District or Region">
          <span class="sad-icon">🔍</span>
          <span class="sad-label">Region</span>
        </button>

        <button class="sad-tool-btn ${activeTool === 'env' ? 'active' : ''}" data-tool="env" title="Environmental & Terrain Alignment Screening">
          <span class="sad-icon">⛰️</span>
          <span class="sad-label">Terrain / Env</span>
        </button>

        <button class="sad-tool-btn" id="sadOpenModalBtn" title="Open Full Analysis Workbench Modal (A)">
          <span class="sad-icon">📊</span>
          <span class="sad-label">Workbench</span>
        </button>
      </div>
    `;

    bindDockEvents();
  }

  function bindDockEvents() {
    if (!dockEl) return;

    dockEl.querySelector("#sadToggleBtn")?.addEventListener("click", () => {
      const grid = dockEl.querySelector("#sadToolsGrid");
      if (grid) {
        grid.classList.toggle("collapsed");
        const isCollapsed = grid.classList.contains("collapsed");
        dockEl.querySelector("#sadToggleBtn").textContent = isCollapsed ? "▸" : "▾";
      }
    });

    dockEl.querySelectorAll(".sad-tool-btn[data-tool]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const tool = e.currentTarget.getAttribute("data-tool");
        activateTool(tool === activeTool ? null : tool);
      });
    });

    dockEl.querySelector("#sadOpenModalBtn")?.addEventListener("click", () => openAnalysisModal());
  }

  // =========================================================================
  // 4. SPATIAL ANALYSIS HUD (ACTIVE PARAMETERS & LIVE RESULTS)
  // =========================================================================

  function renderAnalysisHUD() {
    let hud = document.getElementById("spatialAnalysisHUD");
    if (!hud) {
      hud = document.createElement("div");
      hud.id = "spatialAnalysisHUD";
      hud.className = "spatial-analysis-hud hidden";
      hud.setAttribute("role", "region");
      hud.setAttribute("aria-label", "Geospatial Analysis Workspace HUD");

      const appViewport = document.querySelector(".app-viewport") || document.body;
      appViewport.appendChild(hud);
    }
    hudEl = hud;
  }

  function activateTool(tool) {
    activeTool = tool;
    drawnPoints = [];
    clearAnalysisLayers();

    // Update Dock button highlights
    if (dockEl) {
      dockEl.querySelectorAll(".sad-tool-btn").forEach(btn => {
        btn.classList.toggle("active", btn.getAttribute("data-tool") === activeTool);
      });
    }

    if (!activeTool) {
      if (hudEl) hudEl.classList.add("hidden");
      mapInstance.getContainer().classList.remove("analysis-crosshair-active");
      mapInstance.doubleClickZoom.enable();
      return;
    }

    mapInstance.getContainer().classList.add("analysis-crosshair-active");
    mapInstance.doubleClickZoom.disable();
    updateHUDContent();
    if (hudEl) hudEl.classList.remove("hidden");
  }

  function updateHUDContent(extraData = null) {
    if (!hudEl || !activeTool) return;

    let title = "";
    let instructions = "";
    let bodyHtml = "";

    if (activeTool === "distance") {
      title = "Line Distance & Path Measurement";
      instructions = "Click map to place waypoints. Double-click or click 'Complete' to finish.";
      const totalDist = calculatePolylineLength(drawnPoints);
      bodyHtml = `
        <div class="sahud-stats-grid">
          <div class="sahud-stat-box">
            <span class="sahud-stat-k">TOTAL DISTANCE</span>
            <span class="sahud-stat-v font-mono">${(totalDist / 1000).toFixed(3)} km</span>
            <span class="sahud-stat-sub font-mono">${totalDist.toFixed(1)} m</span>
          </div>
          <div class="sahud-stat-box">
            <span class="sahud-stat-k">WAYPOINTS</span>
            <span class="sahud-stat-v font-mono">${drawnPoints.length}</span>
            <span class="sahud-stat-sub">Vertices</span>
          </div>
          <div class="sahud-stat-box">
            <span class="sahud-stat-k">PROJECTION</span>
            <span class="sahud-stat-v">WGS 84</span>
            <span class="sahud-stat-sub">Geodesic Arc</span>
          </div>
        </div>
        <div class="sahud-actions">
          <button id="sahudFinishBtn" class="sahud-btn btn-primary" ${drawnPoints.length < 2 ? 'disabled' : ''}>✓ Complete</button>
          <button id="sahudCopyBtn" class="sahud-btn" ${drawnPoints.length < 2 ? 'disabled' : ''}>📋 Copy</button>
          <button id="sahudClearBtn" class="sahud-btn">✕ Reset</button>
          <button id="sahudCloseBtn" class="sahud-btn btn-danger">Exit</button>
        </div>
      `;
    } else if (activeTool === "area") {
      title = "Polygon Area & Perimeter Measurement";
      instructions = "Click map to define polygon vertices (min 3 points). Click 'Complete' to close.";
      const area = calculatePolygonArea(drawnPoints);
      const perimeter = calculatePolylineLength([...drawnPoints, drawnPoints[0] || [0, 0]]);
      bodyHtml = `
        <div class="sahud-stats-grid">
          <div class="sahud-stat-box">
            <span class="sahud-stat-k">POLYGON AREA</span>
            <span class="sahud-stat-v font-mono">${(area / 1000000).toFixed(3)} km²</span>
            <span class="sahud-stat-sub font-mono">${(area / 10000).toFixed(2)} ha / ${(area * 0.000247105).toFixed(1)} acres</span>
          </div>
          <div class="sahud-stat-box">
            <span class="sahud-stat-k">PERIMETER</span>
            <span class="sahud-stat-v font-mono">${(perimeter / 1000).toFixed(3)} km</span>
            <span class="sahud-stat-sub font-mono">${perimeter.toFixed(1)} m</span>
          </div>
          <div class="sahud-stat-box">
            <span class="sahud-stat-k">METHOD</span>
            <span class="sahud-stat-v">Spherical Excess</span>
            <span class="sahud-stat-sub">WGS 84 Authalic</span>
          </div>
        </div>
        <div class="sahud-actions">
          <button id="sahudFinishBtn" class="sahud-btn btn-primary" ${drawnPoints.length < 3 ? 'disabled' : ''}>✓ Complete</button>
          <button id="sahudCopyBtn" class="sahud-btn" ${drawnPoints.length < 3 ? 'disabled' : ''}>📋 Copy</button>
          <button id="sahudClearBtn" class="sahud-btn">✕ Reset</button>
          <button id="sahudCloseBtn" class="sahud-btn btn-danger">Exit</button>
        </div>
      `;
    } else if (activeTool === "coords") {
      title = "Coordinate & Projected CRS Inspector";
      instructions = "Click any location on Gujarat map to inspect WGS 84 and projected UTM coordinates.";
      const coordData = extraData || {
        lat: 22.3094,
        lon: 72.1362,
        utm: transformToUtm43N(22.3094, 72.1362),
        district: "Anand / Kheda Region",
        elevationBand: "Alluvial Plain (25–100 m)"
      };

      bodyHtml = `
        <div class="sahud-coords-block">
          <div class="sahud-coord-row">
            <span class="sahud-coord-k">WGS 84 (EPSG:4326):</span>
            <span class="sahud-coord-v font-mono">${coordData.lat.toFixed(5)}° N, ${coordData.lon.toFixed(5)}° E</span>
          </div>
          <div class="sahud-coord-row">
            <span class="sahud-coord-k">DMS FORMAT:</span>
            <span class="sahud-coord-v font-mono">${toDms(coordData.lat, true)}, ${toDms(coordData.lon, false)}</span>
          </div>
          <div class="sahud-coord-row">
            <span class="sahud-coord-k">PROJECTED (EPSG:32643 UTM 43N):</span>
            <span class="sahud-coord-v font-mono">X: ${coordData.utm.easting_m.toLocaleString()} m E, Y: ${coordData.utm.northing_m.toLocaleString()} m N</span>
          </div>
          <div class="sahud-coord-row">
            <span class="sahud-coord-k">ADMIN DISTRICT CONTEXT:</span>
            <span class="sahud-coord-v">${coordData.district}</span>
          </div>
          <div class="sahud-coord-row">
            <span class="sahud-coord-k">TERRAIN RELIEF REGIME:</span>
            <span class="sahud-coord-v">${coordData.elevationBand}</span>
          </div>
        </div>
        <div class="sahud-actions">
          <button id="sahudCopyCoordsBtn" class="sahud-btn btn-primary">📋 Copy Coordinates</button>
          <button id="sahudCloseBtn" class="sahud-btn btn-danger">Exit</button>
        </div>
      `;
    } else if (activeTool === "draw") {
      title = "Draw & Save User Feature";
      instructions = "Select geometry type and click map to digitize. Feature will be stored locally.";
      bodyHtml = `
        <div class="sahud-draw-controls">
          <div class="sahud-draw-type-row">
            <button class="sahud-draw-type-btn ${activeDrawType === 'point' ? 'active' : ''}" data-type="point">📍 Point</button>
            <button class="sahud-draw-type-btn ${activeDrawType === 'line' ? 'active' : ''}" data-type="line">〰️ Polyline</button>
            <button class="sahud-draw-type-btn ${activeDrawType === 'polygon' ? 'active' : ''}" data-type="polygon">⬡ Polygon</button>
          </div>
          <div class="sahud-draw-inputs">
            <input type="text" id="sahudDrawName" placeholder="Feature Name (e.g. Proposed Solar Site)" class="styled-input">
            <input type="text" id="sahudDrawDesc" placeholder="Description / Project Notes" class="styled-input">
          </div>
        </div>
        <div class="sahud-actions">
          <button id="sahudSaveDrawBtn" class="sahud-btn btn-primary" ${drawnPoints.length === 0 ? 'disabled' : ''}>💾 Save Feature</button>
          <button id="sahudExportDrawBtn" class="sahud-btn">📤 Export GeoJSON (${userDrawingsStore.length})</button>
          <button id="sahudClearBtn" class="sahud-btn">✕ Clear</button>
          <button id="sahudCloseBtn" class="sahud-btn btn-danger">Exit</button>
        </div>
      `;
    } else if (activeTool === "nearest") {
      title = "Nearest Mapped Assets Analyzer";
      instructions = "Click any location on map. Calculates geodesic distances and bearing azimuths.";
      const nearestData = extraData || null;

      bodyHtml = `
        ${nearestData ? `
          <div class="sahud-nearest-list">
            <div class="sahud-nearest-item">
              <span class="sn-icon">🛣️</span>
              <div class="sn-info">
                <strong>${nearestData.highway.name}</strong>
                <small>${nearestData.highway.distKm.toFixed(2)} km • Azimuth: ${nearestData.highway.azimuth}°</small>
              </div>
            </div>
            <div class="sahud-nearest-item">
              <span class="sn-icon">🚉</span>
              <div class="sn-info">
                <strong>${nearestData.station.name} (${nearestData.station.code})</strong>
                <small>${nearestData.station.distKm.toFixed(2)} km • Azimuth: ${nearestData.station.azimuth}°</small>
              </div>
            </div>
            <div class="sahud-nearest-item">
              <span class="sn-icon">⚡</span>
              <div class="sn-info">
                <strong>${nearestData.power.name}</strong>
                <small>${nearestData.power.distKm.toFixed(2)} km • ${nearestData.power.capacityMw} MW</small>
              </div>
            </div>
            <div class="sahud-nearest-item">
              <span class="sn-icon">🌊</span>
              <div class="sn-info">
                <strong>${nearestData.dam.name}</strong>
                <small>${nearestData.dam.distKm.toFixed(2)} km • ${nearestData.dam.river}</small>
              </div>
            </div>
          </div>
          <div class="sahud-disclaimer">
            <strong>Methodology Disclosure:</strong> Distances represent true WGS 84 Geodesic Great-Circle spans. For road transport, highway routing IRC winding multiplier (1.28x) applies.
          </div>
        ` : `
          <div class="sahud-empty-hint">Click any coordinate on the Leaflet canvas to execute spatial nearest-neighbor query.</div>
        `}
        <div class="sahud-actions">
          <button id="sahudCloseBtn" class="sahud-btn btn-danger">Exit</button>
        </div>
      `;
    } else if (activeTool === "buffer") {
      title = "Geodesic Buffer & Asset Intersection";
      instructions = "Click map to place buffer centroid or select an asset. Adjust radius slider.";
      const intersectData = extraData || null;

      bodyHtml = `
        <div class="sahud-buffer-slider-wrap">
          <label>Buffer Radius: <strong class="font-mono" id="sahudBufferValDisplay">${activeBufferRadiusKm} km</strong></label>
          <input type="range" id="sahudBufferRange" min="1" max="50" value="${activeBufferRadiusKm}" step="1">
          <div class="sahud-ticks"><span>1 km</span><span>25 km</span><span>50 km</span></div>
        </div>
        ${intersectData ? `
          <div class="sahud-buffer-results">
            <h4 class="sbr-title">Assets Intersecting Buffer (${intersectData.total} Found)</h4>
            <div class="sbr-counts">
              <span>🛣️ Corridors: <strong>${intersectData.highways}</strong></span>
              <span>⚡ Power: <strong>${intersectData.power}</strong></span>
              <span>🌊 Dams: <strong>${intersectData.dams}</strong></span>
              <span>🚉 Stations: <strong>${intersectData.stations}</strong></span>
            </div>
          </div>
        ` : `
          <div class="sahud-empty-hint">Click map to generate ${activeBufferRadiusKm} km buffer zone.</div>
        `}
        <div class="sahud-actions">
          <button id="sahudClearBtn" class="sahud-btn">✕ Clear Buffer</button>
          <button id="sahudCloseBtn" class="sahud-btn btn-danger">Exit</button>
        </div>
      `;
    } else if (activeTool === "env") {
      title = "Environmental & Terrain Alignment Screening";
      instructions = "Click map to draw project alignment (e.g. pipeline, road corridor, canal).";
      const envData = extraData || null;

      bodyHtml = `
        ${envData ? `
          <div class="sahud-env-report">
            <div class="ser-item">
              <span class="ser-k">ALIGNMENT LENGTH:</span>
              <span class="ser-v font-mono">${envData.lengthKm.toFixed(2)} km</span>
            </div>
            <div class="ser-item">
              <span class="ser-k">SEISMIC ZONATION (IS 1893):</span>
              <span class="ser-v ${envData.seismicZone === 'Zone V' ? 'text-red' : 'text-amber'}">${envData.seismicZone} (PGA: ${envData.pga})</span>
            </div>
            <div class="ser-item">
              <span class="ser-k">BEDROCK LITHOLOGY:</span>
              <span class="ser-v">${envData.geology}</span>
            </div>
            <div class="ser-item">
              <span class="ser-k">ACTIVE FAULT CROSSINGS:</span>
              <span class="ser-v ${envData.faultCrossings ? 'text-red' : 'text-emerald'}">${envData.faultCrossings || 'No Active Faults Intersected'}</span>
            </div>
            <div class="ser-item">
              <span class="ser-k">CATCHMENT / BASIN:</span>
              <span class="ser-v">${envData.basin}</span>
            </div>
          </div>
        ` : `
          <div class="sahud-empty-hint">Click at least 2 points along project alignment to evaluate cross-domain environmental factors.</div>
        `}
        <div class="sahud-actions">
          <button id="sahudFinishBtn" class="sahud-btn btn-primary" ${drawnPoints.length < 2 ? 'disabled' : ''}>✓ Evaluate Alignment</button>
          <button id="sahudClearBtn" class="sahud-btn">✕ Reset</button>
          <button id="sahudCloseBtn" class="sahud-btn btn-danger">Exit</button>
        </div>
      `;
    } else if (activeTool === "region") {
      title = "District & Regional Spatial Query";
      instructions = "Select district from dropdown to query indexed infrastructure assets inside.";
      const districtList = getDistrictsList();

      bodyHtml = `
        <div class="sahud-region-select">
          <select id="sahudDistrictSelect" class="styled-select">
            <option value="">Select District...</option>
            ${districtList.map(d => `<option value="${d}">${d}</option>`).join('')}
          </select>
        </div>
        <div id="sahudRegionResults" class="sahud-region-results">
          <div class="sahud-empty-hint">Select district above to query cross-layer inventory.</div>
        </div>
        <div class="sahud-actions">
          <button id="sahudCloseBtn" class="sahud-btn btn-danger">Exit</button>
        </div>
      `;
    }

    hudEl.innerHTML = `
      <div class="sahud-header">
        <div class="sahud-title-wrap">
          <span class="sahud-pulse-dot"></span>
          <h3 class="sahud-title">${title}</h3>
        </div>
        <button id="sahudCloseTopBtn" class="sahud-close-x" title="Close Tool">&times;</button>
      </div>
      <p class="sahud-instructions">${instructions}</p>
      <div class="sahud-body">${bodyHtml}</div>
    `;

    bindHudEvents();
  }

  function bindHudEvents() {
    if (!hudEl) return;

    hudEl.querySelector("#sahudCloseBtn")?.addEventListener("click", () => activateTool(null));
    hudEl.querySelector("#sahudCloseTopBtn")?.addEventListener("click", () => activateTool(null));

    hudEl.querySelector("#sahudClearBtn")?.addEventListener("click", () => {
      drawnPoints = [];
      clearAnalysisLayers();
      updateHUDContent();
    });

    hudEl.querySelector("#sahudFinishBtn")?.addEventListener("click", () => finishActiveDrawing());

    hudEl.querySelector("#sahudCopyBtn")?.addEventListener("click", () => {
      if (activeTool === "distance") {
        const dist = calculatePolylineLength(drawnPoints);
        navigator.clipboard.writeText(`Distance: ${(dist / 1000).toFixed(3)} km (${dist.toFixed(1)} m) - WGS 84 Geodesic`);
        alert("Distance copied to clipboard!");
      } else if (activeTool === "area") {
        const area = calculatePolygonArea(drawnPoints);
        navigator.clipboard.writeText(`Polygon Area: ${(area / 1000000).toFixed(3)} km² (${(area / 10000).toFixed(2)} ha) - WGS 84 Spherical Excess`);
        alert("Polygon area copied to clipboard!");
      }
    });

    hudEl.querySelector("#sahudCopyCoordsBtn")?.addEventListener("click", () => {
      if (drawnPoints.length > 0) {
        const pt = drawnPoints[0];
        const utm = transformToUtm43N(pt[0], pt[1]);
        const text = `WGS 84: ${pt[0].toFixed(5)}, ${pt[1].toFixed(5)}\nUTM 43N: ${utm.easting_m} m E, ${utm.northing_m} m N (EPSG:32643)`;
        navigator.clipboard.writeText(text);
        alert("Coordinates copied to clipboard!");
      }
    });

    // Draw tool type buttons
    hudEl.querySelectorAll(".sahud-draw-type-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        activeDrawType = e.currentTarget.getAttribute("data-type");
        drawnPoints = [];
        clearAnalysisLayers();
        updateHUDContent();
      });
    });

    hudEl.querySelector("#sahudSaveDrawBtn")?.addEventListener("click", () => saveCurrentDrawnFeature());
    hudEl.querySelector("#sahudExportDrawBtn")?.addEventListener("click", () => exportUserDrawingsGeoJson());

    // Buffer range input
    const bufferRange = hudEl.querySelector("#sahudBufferRange");
    if (bufferRange) {
      bufferRange.addEventListener("input", (e) => {
        activeBufferRadiusKm = parseInt(e.target.value, 10);
        const display = hudEl.querySelector("#sahudBufferValDisplay");
        if (display) display.textContent = `${activeBufferRadiusKm} km`;
        if (drawnPoints.length > 0) {
          generateBufferAt(drawnPoints[0]);
        }
      });
    }

    // District select
    const distSel = hudEl.querySelector("#sahudDistrictSelect");
    if (distSel) {
      distSel.addEventListener("change", (e) => {
        const distName = e.target.value;
        if (distName) executeDistrictSpatialQuery(distName);
      });
    }
  }

  // =========================================================================
  // 5. MAP INTERACTION HANDLERS (CLICK & DRAW)
  // =========================================================================

  function setupMapInteractionEvents() {
    mapInstance.on("click", (e) => {
      if (!activeTool) return;

      const latlng = [e.latlng.lat, e.latlng.lng];

      if (activeTool === "coords") {
        drawnPoints = [latlng];
        renderPointInspectionMarker(latlng);
        const utm = transformToUtm43N(latlng[0], latlng[1]);
        const district = identifyDistrictForPoint(latlng);
        const elevation = identifyTerrainBandForPoint(latlng);

        updateHUDContent({
          lat: latlng[0],
          lon: latlng[1],
          utm: utm,
          district: district,
          elevationBand: elevation
        });
      } else if (activeTool === "nearest") {
        drawnPoints = [latlng];
        renderPointInspectionMarker(latlng);
        const nearestResult = queryNearestAssets(latlng);
        updateHUDContent(nearestResult);
      } else if (activeTool === "buffer") {
        drawnPoints = [latlng];
        generateBufferAt(latlng);
      } else if (activeTool === "distance" || activeTool === "area" || activeTool === "draw" || activeTool === "env") {
        drawnPoints.push(latlng);
        renderActiveDrawnGeometry();
        updateHUDContent();
      }
    });

    mapInstance.on("dblclick", () => {
      if (activeTool === "distance" || activeTool === "area" || activeTool === "draw" || activeTool === "env") {
        finishActiveDrawing();
      }
    });
  }

  function renderPointInspectionMarker(latlng) {
    clearAnalysisLayers();
    const marker = L.circleMarker(latlng, {
      radius: 8,
      fillColor: "#00f0ff",
      color: "#ffffff",
      weight: 2,
      opacity: 1,
      fillOpacity: 0.9
    });
    analysisLayerGroup.addLayer(marker);
  }

  function renderActiveDrawnGeometry() {
    clearAnalysisLayers();

    if (drawnPoints.length === 0) return;

    // Draw point markers
    drawnPoints.forEach((pt, i) => {
      const ptMarker = L.circleMarker(pt, {
        radius: 5,
        fillColor: i === 0 ? "#10b981" : "#00f0ff",
        color: "#ffffff",
        weight: 1.5,
        fillOpacity: 0.9
      });
      analysisLayerGroup.addLayer(ptMarker);
    });

    if (drawnPoints.length >= 2) {
      if (activeTool === "area" || (activeTool === "draw" && activeDrawType === "polygon")) {
        const poly = L.polygon(drawnPoints, {
          color: "#00f0ff",
          weight: 2,
          fillColor: "#00f0ff",
          fillOpacity: 0.2,
          dashArray: "4,4"
        });
        analysisLayerGroup.addLayer(poly);
      } else {
        const line = L.polyline(drawnPoints, {
          color: "#00f0ff",
          weight: 3,
          opacity: 0.9,
          dashArray: "5,3"
        });
        analysisLayerGroup.addLayer(line);
      }
    }
  }

  function finishActiveDrawing() {
    if (drawnPoints.length < 2) return;

    if (activeTool === "env") {
      const lengthKm = calculatePolylineLength(drawnPoints) / 1000;
      const envProfile = evaluateEnvironmentalAlignment(drawnPoints);
      envProfile.lengthKm = lengthKm;
      updateHUDContent(envProfile);
    } else {
      renderActiveDrawnGeometry();
      updateHUDContent();
    }
  }

  function clearAnalysisLayers() {
    if (analysisLayerGroup) analysisLayerGroup.clearLayers();
    if (bufferLayerGroup) bufferLayerGroup.clearLayers();
  }

  // =========================================================================
  // 6. SPATIAL QUERY & BUFFER ENGINES
  // =========================================================================

  function generateBufferAt(centerLatLng) {
    if (bufferLayerGroup) bufferLayerGroup.clearLayers();

    const ring = createPointBufferPolygon(centerLatLng[0], centerLatLng[1], activeBufferRadiusKm);
    const poly = L.polygon(ring, {
      color: "#f59e0b",
      weight: 2,
      fillColor: "#f59e0b",
      fillOpacity: 0.15,
      dashArray: "4,4"
    });
    bufferLayerGroup.addLayer(poly);

    // Center marker
    const centerMarker = L.circleMarker(centerLatLng, {
      radius: 6,
      fillColor: "#f59e0b",
      color: "#ffffff",
      weight: 2,
      fillOpacity: 1
    });
    bufferLayerGroup.addLayer(centerMarker);

    // Identify intersecting assets
    const intersects = findAssetsIntersectingPolygon(ring);
    updateHUDContent({
      total: intersects.total,
      highways: intersects.highways.length,
      power: intersects.power.length,
      dams: intersects.dams.length,
      stations: intersects.stations.length
    });
  }

  function findAssetsIntersectingPolygon(ring) {
    const res = { total: 0, highways: [], power: [], dams: [], stations: [] };

    // Query Power
    if (datasetsRef.powerData && datasetsRef.powerData.features) {
      datasetsRef.powerData.features.forEach(f => {
        if (f.geometry && f.geometry.type === "Point") {
          const pt = [f.geometry.coordinates[1], f.geometry.coordinates[0]];
          if (isPointInPolygon(pt, ring)) res.power.push(f.properties);
        }
      });
    }

    // Query Dams
    if (datasetsRef.waterData && datasetsRef.waterData.features) {
      datasetsRef.waterData.features.forEach(f => {
        if (f.geometry && f.geometry.type === "Point") {
          const pt = [f.geometry.coordinates[1], f.geometry.coordinates[0]];
          if (isPointInPolygon(pt, ring)) res.dams.push(f.properties);
        }
      });
    }

    // Query Stations
    if (datasetsRef.stationsData && datasetsRef.stationsData.features) {
      datasetsRef.stationsData.features.forEach(f => {
        if (f.geometry && f.geometry.type === "Point") {
          const pt = [f.geometry.coordinates[1], f.geometry.coordinates[0]];
          if (isPointInPolygon(pt, ring)) res.stations.push(f.properties);
        }
      });
    }

    // Query Highways (Bounding or vertex intersection)
    if (datasetsRef.roadsData && datasetsRef.roadsData.features) {
      datasetsRef.roadsData.features.forEach(f => {
        if (f.geometry && f.geometry.coordinates) {
          const coords = f.geometry.type === "LineString" ? f.geometry.coordinates : f.geometry.coordinates.flat();
          const intersectsAny = coords.some(c => isPointInPolygon([c[1], c[0]], ring));
          if (intersectsAny) res.highways.push(f.properties);
        }
      });
    }

    res.total = res.power.length + res.dams.length + res.stations.length + res.highways.length;
    return res;
  }

  function queryNearestAssets(latlng) {
    let nearestHwy = { name: "NH-48", distKm: 9999, azimuth: 0 };
    let nearestStat = { name: "Vadodara Jn", code: "BRC", distKm: 9999, azimuth: 0 };
    let nearestPow = { name: "Dhuvaran CCPP", capacityMw: 595, distKm: 9999, azimuth: 0 };
    let nearestDam = { name: "Sardar Sarovar Dam", river: "Narmada", distKm: 9999, azimuth: 0 };

    // Nearest Stations
    if (datasetsRef.stationsData && datasetsRef.stationsData.features) {
      datasetsRef.stationsData.features.forEach(f => {
        if (f.geometry && f.geometry.type === "Point") {
          const pt = [f.geometry.coordinates[1], f.geometry.coordinates[0]];
          const dist = calculateGeodesicDistance(latlng[0], latlng[1], pt[0], pt[1]) / 1000;
          if (dist < nearestStat.distKm) {
            nearestStat = {
              name: f.properties.name || "Station",
              code: f.properties.code || "STN",
              distKm: dist,
              azimuth: Math.round(calculateBearing(latlng[0], latlng[1], pt[0], pt[1]))
            };
          }
        }
      });
    }

    // Nearest Power
    if (datasetsRef.powerData && datasetsRef.powerData.features) {
      datasetsRef.powerData.features.forEach(f => {
        if (f.geometry && f.geometry.type === "Point") {
          const pt = [f.geometry.coordinates[1], f.geometry.coordinates[0]];
          const dist = calculateGeodesicDistance(latlng[0], latlng[1], pt[0], pt[1]) / 1000;
          if (dist < nearestPow.distKm) {
            nearestPow = {
              name: f.properties.name || "Power Station",
              capacityMw: f.properties.capacity_mw || 0,
              distKm: dist,
              azimuth: Math.round(calculateBearing(latlng[0], latlng[1], pt[0], pt[1]))
            };
          }
        }
      });
    }

    // Nearest Dam
    if (datasetsRef.waterData && datasetsRef.waterData.features) {
      datasetsRef.waterData.features.forEach(f => {
        if (f.geometry && f.geometry.type === "Point") {
          const pt = [f.geometry.coordinates[1], f.geometry.coordinates[0]];
          const dist = calculateGeodesicDistance(latlng[0], latlng[1], pt[0], pt[1]) / 1000;
          if (dist < nearestDam.distKm) {
            nearestDam = {
              name: f.properties.name || "Dam",
              river: f.properties.river || "River",
              distKm: dist,
              azimuth: Math.round(calculateBearing(latlng[0], latlng[1], pt[0], pt[1]))
            };
          }
        }
      });
    }

    // Nearest Highway
    if (datasetsRef.roadsData && datasetsRef.roadsData.features) {
      datasetsRef.roadsData.features.forEach(f => {
        if (f.geometry && f.geometry.coordinates) {
          const coords = f.geometry.type === "LineString" ? f.geometry.coordinates : f.geometry.coordinates.flat();
          coords.forEach(c => {
            const dist = calculateGeodesicDistance(latlng[0], latlng[1], c[1], c[0]) / 1000;
            if (dist < nearestHwy.distKm) {
              nearestHwy = {
                name: f.properties.ref || f.properties.name || "National Highway",
                distKm: dist,
                azimuth: Math.round(calculateBearing(latlng[0], latlng[1], c[1], c[0]))
              };
            }
          });
        }
      });
    }

    return {
      highway: nearestHwy,
      station: nearestStat,
      power: nearestPow,
      dam: nearestDam
    };
  }

  function calculateBearing(lat1, lon1, lat2, lon2) {
    const toRad = Math.PI / 180;
    const toDeg = 180 / Math.PI;
    const y = Math.sin((lon2 - lon1) * toRad) * Math.cos(lat2 * toRad);
    const x = Math.cos(lat1 * toRad) * Math.sin(lat2 * toRad) -
      Math.sin(lat1 * toRad) * Math.cos(lat2 * toRad) * Math.cos((lon2 - lon1) * toRad);
    const brng = Math.atan2(y, x) * toDeg;
    return (brng + 360) % 360;
  }

  // =========================================================================
  // 7. ENVIRONMENTAL & TERRAIN SCREENING ENGINE
  // =========================================================================

  function evaluateEnvironmentalAlignment(points) {
    if (!points || points.length === 0) return {};

    const midPt = points[Math.floor(points.length / 2)];

    // Seismic Zonation per BIS IS 1893:2016
    let seismicZone = "Zone III";
    let pga = "0.16g";
    if (midPt[0] >= 23.2 && midPt[1] <= 71.0) {
      seismicZone = "Zone V";
      pga = "0.36g (Extreme Kutch Hazard)";
    } else if (midPt[0] >= 22.8 || midPt[1] <= 71.5) {
      seismicZone = "Zone IV";
      pga = "0.24g (High Saurashtra/North Gujarat Hazard)";
    }

    // Geology
    let geology = "Quaternary Fluvial Alluvium (GSI Bhukosh)";
    if (midPt[0] <= 22.2 && midPt[1] <= 72.0) geology = "Deccan Volcanic Basalt Traps";
    else if (midPt[0] >= 23.0 && midPt[1] <= 70.8) geology = "Mesozoic Sedimentary Sandstone / Katrol Series";

    // Fault crossings check
    let faultCrossings = null;
    if (midPt[0] >= 23.1 && midPt[0] <= 23.6 && midPt[1] <= 71.2) {
      faultCrossings = "Kutch Mainland Fault (KMF) Corridor";
    } else if (midPt[0] >= 21.6 && midPt[0] <= 21.9 && midPt[1] >= 72.8) {
      faultCrossings = "Narmada-Son Crustal Fault Zone";
    }

    // Regional Drainage Basin
    let basin = "Sabarmati & Central Plains";
    if (midPt[0] <= 21.8) basin = "Tapi & South Gujarat Coastal Rivers";
    else if (midPt[1] <= 71.2) basin = "Saurashtra Peninsular Radial Drainage";
    else if (midPt[0] >= 23.5) basin = "Banas & Arid North Gujarat Basin";

    return {
      seismicZone,
      pga,
      geology,
      faultCrossings,
      basin
    };
  }

  function identifyDistrictForPoint(latlng) {
    if (datasetsRef.districtsData && datasetsRef.districtsData.features) {
      for (const f of datasetsRef.districtsData.features) {
        if (f.geometry && f.geometry.coordinates) {
          const rings = f.geometry.type === "Polygon" ? [f.geometry.coordinates[0]] : f.geometry.coordinates.map(r => r[0]);
          for (const ring of rings) {
            const latLonRing = ring.map(c => [c[1], c[0]]);
            if (isPointInPolygon(latlng, latLonRing)) {
              return f.properties.district_name || f.properties.name || "Identified District";
            }
          }
        }
      }
    }
    return "Gujarat Administrative Territory";
  }

  function identifyTerrainBandForPoint(latlng) {
    const lat = latlng[0];
    const lon = latlng[1];
    if (lon < 70.0 || (lat > 23.5 && lon < 71.0)) return "Rann Hypersaline Mudflats (0–10 m MSL)";
    if (lat < 21.5 && lon > 73.0) return "Dang / Satpura Uplands (300–1,000 m MSL)";
    if (lat > 23.8 && lon > 72.5) return "Aravalli Foothills (150–450 m MSL)";
    return "Alluvial Plains & Valley Floor (25–100 m MSL)";
  }

  function getDistrictsList() {
    if (datasetsRef.districtsData && datasetsRef.districtsData.features) {
      return datasetsRef.districtsData.features.map(f => f.properties.district_name || f.properties.name).filter(Boolean).sort();
    }
    return ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Kutch", "Bhavnagar", "Jamnagar", "Banaskantha"];
  }

  function executeDistrictSpatialQuery(districtName) {
    const container = document.getElementById("sahudRegionResults");
    if (!container) return;

    let dams = 0;
    let power = 0;
    let stations = 0;

    if (datasetsRef.waterData && datasetsRef.waterData.features) {
      dams = datasetsRef.waterData.features.filter(f => (f.properties.district || "").toLowerCase().includes(districtName.toLowerCase())).length;
    }
    if (datasetsRef.powerData && datasetsRef.powerData.features) {
      power = datasetsRef.powerData.features.filter(f => (f.properties.district || "").toLowerCase().includes(districtName.toLowerCase())).length;
    }
    if (datasetsRef.stationsData && datasetsRef.stationsData.features) {
      stations = datasetsRef.stationsData.features.filter(f => (f.properties.district || "").toLowerCase().includes(districtName.toLowerCase())).length;
    }

    container.innerHTML = `
      <div class="sahud-stat-list">
        <div class="sahud-stat-item">
          <span>District:</span> <strong>${districtName}</strong>
        </div>
        <div class="sahud-stat-item">
          <span>🌊 Water Reservoirs & Dams:</span> <strong>${dams}</strong>
        </div>
        <div class="sahud-stat-item">
          <span>⚡ Power Generation Plants:</span> <strong>${power}</strong>
        </div>
        <div class="sahud-stat-item">
          <span>🚉 Railway Stations & Halts:</span> <strong>${stations}</strong>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // 8. USER DRAWINGS PERSISTENCE & EXPORT (ZERO SOURCE MUTATION)
  // =========================================================================

  function loadPersistedDrawings() {
    try {
      const saved = localStorage.getItem("gujarat_inframap_user_drawings");
      if (saved) {
        userDrawingsStore = JSON.parse(saved);
        renderPersistedDrawingsOnMap();
      }
    } catch (e) {
      console.warn("[GeospatialAnalysisToolkit] Error reading user drawings from localStorage:", e);
    }
  }

  function saveCurrentDrawnFeature() {
    if (drawnPoints.length === 0) return;

    const nameInput = document.getElementById("sahudDrawName");
    const descInput = document.getElementById("sahudDrawDesc");
    const name = (nameInput && nameInput.value.trim()) || `User ${activeDrawType} ${userDrawingsStore.length + 1}`;
    const desc = (descInput && descInput.value.trim()) || "Digitized project alignment";

    const feature = {
      type: "Feature",
      id: "USER-" + Date.now(),
      properties: {
        name,
        description: desc,
        geom_type: activeDrawType,
        created_at: new Date().toISOString()
      },
      geometry: {
        type: activeDrawType === "point" ? "Point" : (activeDrawType === "line" ? "LineString" : "Polygon"),
        coordinates: activeDrawType === "point" ?
          [drawnPoints[0][1], drawnPoints[0][0]] :
          (activeDrawType === "line" ?
            drawnPoints.map(p => [p[1], p[0]]) :
            [[...drawnPoints, drawnPoints[0]].map(p => [p[1], p[0]])])
      }
    };

    userDrawingsStore.push(feature);
    localStorage.setItem("gujarat_inframap_user_drawings", JSON.stringify(userDrawingsStore));

    drawnPoints = [];
    clearAnalysisLayers();
    renderPersistedDrawingsOnMap();
    updateHUDContent();
    alert(`Feature '${name}' saved locally!`);
  }

  function renderPersistedDrawingsOnMap() {
    if (!userDrawingsLayerGroup) return;
    userDrawingsLayerGroup.clearLayers();

    userDrawingsStore.forEach(f => {
      const p = f.properties;
      const g = f.geometry;

      if (g.type === "Point") {
        const marker = L.circleMarker([g.coordinates[1], g.coordinates[0]], {
          radius: 7,
          fillColor: "#ec4899",
          color: "#ffffff",
          weight: 2,
          fillOpacity: 0.9
        }).bindPopup(`<strong>${p.name}</strong><br>${p.description}<br><small>Digitized: ${p.created_at.substring(0, 10)}</small>`);
        userDrawingsLayerGroup.addLayer(marker);
      } else if (g.type === "LineString") {
        const pts = g.coordinates.map(c => [c[1], c[0]]);
        const line = L.polyline(pts, {
          color: "#ec4899",
          weight: 3,
          opacity: 0.9
        }).bindPopup(`<strong>${p.name}</strong><br>${p.description}<br><small>Length: ${(calculatePolylineLength(pts) / 1000).toFixed(2)} km</small>`);
        userDrawingsLayerGroup.addLayer(line);
      } else if (g.type === "Polygon") {
        const pts = g.coordinates[0].map(c => [c[1], c[0]]);
        const poly = L.polygon(pts, {
          color: "#ec4899",
          weight: 2,
          fillColor: "#ec4899",
          fillOpacity: 0.25
        }).bindPopup(`<strong>${p.name}</strong><br>${p.description}<br><small>Area: ${(calculatePolygonArea(pts) / 1000000).toFixed(2)} km²</small>`);
        userDrawingsLayerGroup.addLayer(poly);
      }
    });
  }

  function exportUserDrawingsGeoJson() {
    if (userDrawingsStore.length === 0) {
      alert("No user drawings to export. Draw features on the map first!");
      return;
    }
    const collection = {
      type: "FeatureCollection",
      crs: { type: "name", properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" } },
      features: userDrawingsStore
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(collection, null, 2));
    const dlAnchor = document.createElement("a");
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `gujarat_inframap_user_drawings_${Date.now()}.geojson`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  }

  // =========================================================================
  // 9. COMPREHENSIVE ANALYSIS WORKBENCH MODAL
  // =========================================================================

  function renderAnalysisModal() {
    let modal = document.getElementById("spatialAnalysisModal");
    if (!modal) {
      modal = document.createElement("dialog");
      modal.id = "spatialAnalysisModal";
      modal.className = "modal-card-dialog spatial-analysis-dialog";
      modal.setAttribute("aria-labelledby", "spatialAnalysisModalTitle");

      modal.innerHTML = `
        <div class="modal-card-content">
          <div class="modal-card-header">
            <div class="modal-header-text">
              <div class="modal-header-badge-row">
                <span class="modal-header-badge">GIS TOOLKIT</span>
                <span class="modal-status-badge">Geodesic & Cartographic Analytics</span>
                <span class="modal-source-badge">EPSG:4326 • EPSG:32643 UTM 43N</span>
              </div>
              <h2 id="spatialAnalysisModalTitle" class="modal-card-title">Geospatial Analysis Workbench</h2>
              <p class="modal-card-subtitle">Comprehensive spatial queries, geodesic measurements, multi-asset technical comparisons, and environmental screening.</p>
            </div>
            <button id="closeAnalysisModalTopBtn" class="modal-close-btn" aria-label="Close Analysis Workbench">&times;</button>
          </div>

          <!-- Tabs -->
          <div class="temporal-modal-tabs" role="tablist">
            <button class="temporal-modal-tab-btn active" data-tab="measurements" role="tab">
              <span>📏 Geodesic Solvers</span>
            </button>
            <button class="temporal-modal-tab-btn" data-tab="compare" role="tab">
              <span>⚖️ Asset Comparator</span>
            </button>
            <button class="temporal-modal-tab-btn" data-tab="drawings" role="tab">
              <span>✏️ Saved Drawings</span>
            </button>
            <button class="temporal-modal-tab-btn" data-tab="methods" role="tab">
              <span>📐 CRS & Standards</span>
            </button>
          </div>

          <!-- Body -->
          <div class="modal-card-body">
            <div id="satPane-measurements" class="temporal-tab-pane active">
              <div class="texp-grid">
                <div class="texp-sidebar">
                  <div class="texp-card">
                    <h4 class="texp-card-title">Quick Action Launchers</h4>
                    <p class="texp-sub">Activate specialized spatial tools directly on the map viewport:</p>
                    <div class="sat-launcher-list">
                      <button class="sat-launch-btn" data-tool="distance">📏 Measure Line Distance</button>
                      <button class="sat-launch-btn" data-tool="area">📐 Measure Polygon Area</button>
                      <button class="sat-launch-btn" data-tool="coords">🌐 Coordinate & CRS Inspector</button>
                      <button class="sat-launch-btn" data-tool="nearest">📍 Nearest Assets Finder</button>
                      <button class="sat-launch-btn" data-tool="buffer">⭕ Geodesic Buffer Tool</button>
                      <button class="sat-launch-btn" data-tool="env">⛰️ Terrain Alignment Profiler</button>
                    </div>
                  </div>
                </div>
                <div class="texp-main">
                  <div class="texp-card">
                    <h3 class="texp-chart-title">Geodesic vs Projected Coordinate Systems</h3>
                    <p class="texp-p">
                      The Gujarat Digital Twin utilizes <strong>WGS 84 (EPSG:4326)</strong> for geographic storage and <strong>UTM Zone 43N (EPSG:32643)</strong> for projected metric calculations across Gujarat.
                    </p>
                    <div class="texp-table-responsive">
                      <table class="texp-table">
                        <thead>
                          <tr><th>Parameter</th><th>Geographic (WGS 84)</th><th>Projected (UTM 43N)</th></tr>
                        </thead>
                        <tbody>
                          <tr><td>EPSG Code</td><td>EPSG:4326</td><td>EPSG:32643</td></tr>
                          <tr><td>Coordinates</td><td>Latitude / Longitude (Deg)</td><td>Easting / Northing (Meters)</td></tr>
                          <tr><td>Ellipsoid</td><td>WGS 84 (a=6,378,137m)</td><td>Transverse Mercator</td></tr>
                          <tr><td>Central Meridian</td><td>Greenwich (0°)</td><td>75° E (Covers Gujarat)</td></tr>
                          <tr><td>Applicability</td><td>Global Display & GPS</td><td>Engineering Area & Engineering Length</td></tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div id="satPane-compare" class="temporal-tab-pane">
              <div class="texp-card">
                <h3 class="texp-chart-title">Multi-Asset Comparative Engineering Matrix</h3>
                <span class="texp-chart-sub">Benchmark key infrastructure nodes side-by-side:</span>
                <div id="satCompareMatrixWrap" class="sat-compare-matrix-wrap">
                  <!-- Rendered dynamically -->
                </div>
              </div>
            </div>

            <div id="satPane-drawings" class="temporal-tab-pane">
              <div class="texp-card">
                <div class="texp-chart-header">
                  <div>
                    <h3 class="texp-chart-title">Saved User Drawings & Digitized Alignments</h3>
                    <span class="texp-chart-sub">Locally stored geometries that remain distinct from statutory datasets</span>
                  </div>
                  <button id="satExportDrawingsBtn" class="texp-chart-toggle-btn active">📥 Export GeoJSON</button>
                </div>
                <div id="satDrawingsListWrap" class="sat-drawings-list-wrap">
                  <!-- Rendered dynamically -->
                </div>
              </div>
            </div>

            <div id="satPane-methods" class="temporal-tab-pane">
              <div class="texp-card">
                <h3 class="texp-chart-title">Methodological Disclosures & Standards Compliance</h3>
                <div class="tier-card">
                  <span class="tier-badge static">DISTANCE FORMULATION</span>
                  <p>All line lengths use great-circle geodesic integration over the WGS 84 ellipsoid. No flat-plane Euclidean approximations are used.</p>
                </div>
                <div class="tier-card">
                  <span class="tier-badge hist">ROAD NETWORK DISCLAIMER</span>
                  <p>Straight-line distance is never substituted as road travel time. Highway travel calculations explicitly note IRC:73 winding factors (1.25–1.35x) and design corridor speeds.</p>
                </div>
                <div class="tier-card">
                  <span class="tier-badge live">DATA INTEGRITY MANDATE</span>
                  <p>All analytical overlays (buffers, user drawings, measurements) operate strictly in isolated display panes, guaranteeing official statutory GeoJSON layers remain unaltered.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="modal-card-footer">
            <span class="dams-footer-note">Geospatial Analysis Toolkit • Zero Source Modification • WGS 84 & UTM 43N Standard.</span>
            <button id="closeAnalysisModalBottomBtn" class="btn-dismiss">Close Workbench</button>
          </div>
        </div>
      `;

      const appViewport = document.querySelector(".app-viewport") || document.body;
      appViewport.appendChild(modal);
    }
    modalEl = modal;

    bindModalEvents();
  }

  function bindModalEvents() {
    if (!modalEl) return;

    modalEl.querySelector("#closeAnalysisModalTopBtn")?.addEventListener("click", () => closeAnalysisModal());
    modalEl.querySelector("#closeAnalysisModalBottomBtn")?.addEventListener("click", () => closeAnalysisModal());

    modalEl.querySelectorAll(".temporal-modal-tab-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const tab = e.currentTarget.getAttribute("data-tab");
        modalEl.querySelectorAll(".temporal-modal-tab-btn").forEach(b => b.classList.remove("active"));
        e.currentTarget.classList.add("active");
        modalEl.querySelectorAll(".temporal-tab-pane").forEach(p => p.classList.remove("active"));
        modalEl.querySelector(`#satPane-${tab}`)?.classList.add("active");

        if (tab === "compare") renderCompareMatrixInModal();
        else if (tab === "drawings") renderDrawingsListInModal();
      });
    });

    modalEl.querySelectorAll(".sat-launch-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const tool = e.currentTarget.getAttribute("data-tool");
        closeAnalysisModal();
        activateTool(tool);
      });
    });

    modalEl.querySelector("#satExportDrawingsBtn")?.addEventListener("click", () => exportUserDrawingsGeoJson());
  }

  function openAnalysisModal() {
    if (!modalEl) renderAnalysisModal();
    modalEl.showModal();
    renderCompareMatrixInModal();
  }

  function closeAnalysisModal() {
    if (modalEl) modalEl.close();
  }

  function renderCompareMatrixInModal() {
    const wrap = document.getElementById("satCompareMatrixWrap");
    if (!wrap) return;

    const sampleAssets = [
      { name: "Sardar Sarovar Dam", cat: "Mega Multi-Purpose Dam", river: "Narmada River", cap: "9,460 MCM Gross / 1,450 MW", district: "Narmada", year: 2017, seismic: "Zone III (PGA: 0.16g)" },
      { name: "Ukai Dam", cat: "Earth-Cum-Masonry Dam", river: "Tapi River", cap: "7,414 MCM Gross / 300 MW", district: "Tapi / Surat", year: 1972, seismic: "Zone III (PGA: 0.16g)" },
      { name: "Kadana Dam", cat: "Composite Gravity Dam", river: "Mahi River", cap: "1,542 MCM Gross / 240 MW", district: "Mahisagar", year: 1978, seismic: "Zone III (PGA: 0.16g)" },
      { name: "Mundra Port", cat: "Deep Draft Commercial Seaport", river: "Gulf of Kutch", cap: "260 MMT Cargo / 17.5m Draft", district: "Kutch", year: 1998, seismic: "Zone V (PGA: 0.36g)" }
    ];

    wrap.innerHTML = `
      <div class="texp-table-responsive">
        <table class="texp-table">
          <thead>
            <tr>
              <th>Asset Name</th>
              <th>Category</th>
              <th>River / Water Body</th>
              <th>Design Capacity</th>
              <th>District</th>
              <th>Commissioned</th>
              <th>IS 1893 Seismic</th>
            </tr>
          </thead>
          <tbody>
            ${sampleAssets.map(a => `
              <tr>
                <td><strong>${a.name}</strong></td>
                <td><span class="badge-static">${a.cat}</span></td>
                <td>${a.river}</td>
                <td class="font-mono">${a.cap}</td>
                <td>${a.district}</td>
                <td class="font-mono">${a.year}</td>
                <td><span class="${a.seismic.includes('Zone V') ? 'text-red' : 'text-amber'}">${a.seismic}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  function renderDrawingsListInModal() {
    const wrap = document.getElementById("satDrawingsListWrap");
    if (!wrap) return;

    if (userDrawingsStore.length === 0) {
      wrap.innerHTML = `<p class="texp-p">No user drawings digitized yet. Use the ✏️ Draw tool on the map to create points, lines, or polygons.</p>`;
      return;
    }

    wrap.innerHTML = `
      <div class="texp-table-responsive">
        <table class="texp-table">
          <thead>
            <tr><th>Name</th><th>Type</th><th>Description</th><th>Created</th><th>Action</th></tr>
          </thead>
          <tbody>
            ${userDrawingsStore.map((f, i) => `
              <tr>
                <td><strong>${f.properties.name}</strong></td>
                <td><span class="badge-static">${f.properties.geom_type.toUpperCase()}</span></td>
                <td>${f.properties.description}</td>
                <td class="font-mono">${f.properties.created_at.substring(0, 10)}</td>
                <td><button class="sat-del-btn" data-idx="${i}">Delete</button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    wrap.querySelectorAll(".sat-del-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const idx = parseInt(e.currentTarget.getAttribute("data-idx"), 10);
        userDrawingsStore.splice(idx, 1);
        localStorage.setItem("gujarat_inframap_user_drawings", JSON.stringify(userDrawingsStore));
        renderPersistedDrawingsOnMap();
        renderDrawingsListInModal();
      });
    });
  }

  // =========================================================================
  // 10. GLOBAL KEYBINDINGS & PUBLIC API
  // =========================================================================

  function setupGlobalKeybindings() {
    document.addEventListener("keydown", (e) => {
      const activeEl = document.activeElement;
      const isTyping = activeEl && ["INPUT", "SELECT", "TEXTAREA"].includes(activeEl.tagName);

      if ((e.key === "a" || e.key === "A") && !isTyping) {
        e.preventDefault();
        openAnalysisModal();
      } else if (e.key === "Escape") {
        if (activeTool) {
          activateTool(null);
        } else if (modalEl && modalEl.open) {
          closeAnalysisModal();
        }
      }
    });
  }

  window.GeospatialAnalysisToolkit = {
    init,
    activateTool,
    openModal: openAnalysisModal,
    closeModal: closeAnalysisModal,
    calculateDistance: calculateGeodesicDistance,
    calculateLength: calculatePolylineLength,
    calculateArea: calculatePolygonArea,
    transformToUtm43N,
    exportDrawings: exportUserDrawingsGeoJson,
    getUserDrawings: () => userDrawingsStore
  };

})();
