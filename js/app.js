/**
 * Gujarat InfraMap — Production Client Application Logic
 * Standard: Leaflet.js (EPSG:4326 WGS 84 Projection)
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initial State & Gujarat Bounds
  const GUJARAT_CENTER = [22.4, 71.8];
  const GUJARAT_ZOOM = 7.5;

  // Search index repository
  const searchIndex = [];
  const districtBounds = {};
  let activeDistrictHighlight = null;

  // Initialize Leaflet Map (Framed upfront to eliminate redundant tile fetch passes)
  const map = L.map("map", {
    minZoom: 6,
    maxZoom: 18,
    zoomControl: false // custom position
  });
  map.fitBounds([[20.10, 68.10], [24.75, 74.50]], { padding: [30, 30], animate: false });

  // Position zoom controls at bottom right
  L.control.zoom({ position: "bottomright" }).addTo(map);

  // 2. Custom Leaflet Panes for strict Z-Index rendering order
  // Districts polygon base pane sits below all infrastructure overlays (350 vs 448-600)
  map.createPane("districtsPane").style.zIndex = 350;
  map.createPane("railwaysBasePane").style.zIndex = 448; // Base dark casing for dual-tone track
  map.createPane("railwaysPane").style.zIndex = 450;     // High-contrast dashed ties
  map.createPane("roadsPane").style.zIndex = 500;
  map.createPane("stationsPane").style.zIndex = 550;
  map.createPane("hqPane").style.zIndex = 580;
  map.createPane("transmissionLinesPane").style.zIndex = 590; // High-Voltage Transmission Corridors
  map.createPane("substationsPane").style.zIndex = 595;        // Substation Pooling Nodes
  map.createPane("powerPane").style.zIndex = 600;              // Generation Facilities

  // 3. Basemap Providers (100% Free & Open-Source — Zero Watermarks, Zero API Keys)
  // 3. Basemap Providers (CARTO Dark Matter Default: Muted charcoal GIS canvas, zero noise)
  function createBasemaps() {
    const customKey = (localStorage.getItem("inframap_api_key") || "").trim();
    let darkLayer;

    if (customKey.startsWith("pk.")) {
      // Mapbox Dark Navigation (When user provides free Mapbox token)
      darkLayer = L.tileLayer(`https://api.mapbox.com/styles/v1/mapbox/dark-v11/tiles/{z}/{x}/{y}?access_token=${customKey}`, {
        attribution: '&copy; <a href="https://www.mapbox.com/">Mapbox</a>, OpenStreetMap',
        maxZoom: 19
      });
    } else {
      // Default: 100% Free Open-Source OpenStreetMap Dark GIS (Zero API Keys, Zero Watermarks)
      darkLayer = L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles by <a href="https://www.hotosm.org/">HOT</a>',
        subdomains: ["a", "b", "c"],
        className: "dark-tiles",
        crossOrigin: true,
        maxZoom: 19
      });
    }

    return {
      dark: darkLayer,
      osm: L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, HOT',
        subdomains: ["a", "b", "c"],
        crossOrigin: true,
        maxZoom: 19
      }),
      satellite: L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
        attribution: '&copy; <a href="https://www.esri.com/">Esri</a>, Earthstar Geographics',
        crossOrigin: true,
        maxZoom: 19
      }),
      topo: L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
        subdomains: ["a", "b", "c"],
        crossOrigin: true,
        maxZoom: 17
      })
    };
  }

  const basemapLayers = createBasemaps();
  basemapLayers.dark.addTo(map);

  // Basemap switcher listener
  document.querySelectorAll(".segment-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      document.querySelectorAll(".segment-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const chosen = btn.getAttribute("data-basemap");

      Object.values(basemapLayers).forEach(l => {
        if (map.hasLayer(l)) map.removeLayer(l);
      });
      if (basemapLayers[chosen]) {
        basemapLayers[chosen].addTo(map);
      }
    });
  });

  // 4. Infrastructure Layer Groups (Overview Preset Default: Districts, Roads, Power)
  const layerGroups = {
    districts: L.layerGroup().addTo(map),
    roads: L.layerGroup().addTo(map),
    power: L.layerGroup().addTo(map),
    railways: L.layerGroup(),
    stations: L.layerGroup(),
    hq: L.layerGroup(),
    transmission: L.layerGroup()
  };

  // Toggle Checkboxes Registry
  const layerToggles = [
    { key: "districts", id: "layerDistricts", group: layerGroups.districts },
    { key: "hq", id: "layerHq", group: layerGroups.hq },
    { key: "roads", id: "layerRoads", group: layerGroups.roads },
    { key: "railways", id: "layerRailways", group: layerGroups.railways },
    { key: "stations", id: "layerStations", group: layerGroups.stations },
    { key: "power", id: "layerPower", group: layerGroups.power },
    { key: "transmission", id: "layerTransmission", group: layerGroups.transmission }
  ];

  // Intelligent Layer Presets Configuration (Requirement 4)
  const LAYER_PRESETS = {
    overview: {
      name: "Overview",
      layers: { districts: true, roads: true, power: true, railways: false, stations: false, hq: false, transmission: false }
    },
    transport: {
      name: "Transport",
      layers: { districts: true, roads: true, railways: true, stations: true, power: false, transmission: false, hq: false }
    },
    energy: {
      name: "Energy",
      layers: { districts: true, power: true, transmission: true, roads: false, railways: false, stations: false, hq: false }
    },
    admin: {
      name: "Admin",
      layers: { districts: true, hq: true, roads: false, railways: false, stations: false, power: false, transmission: false }
    },
    full: {
      name: "Full Infra",
      layers: { districts: true, roads: true, railways: true, stations: true, power: true, transmission: true, hq: true }
    }
  };

  function updateActiveLayersCount() {
    let count = 0;
    layerToggles.forEach(t => {
      const el = document.getElementById(t.id);
      if (el && el.checked) count++;
    });
    const label = document.getElementById("activeLayersCount");
    if (label) label.textContent = `${count} of 7 Active`;
    const filterCount = document.getElementById("layerFilterCount");
    if (filterCount) filterCount.textContent = `${count} of 7 Active`;
  }

  function checkCurrentPresetMatch() {
    let matchedPreset = null;
    for (const [pKey, pConfig] of Object.entries(LAYER_PRESETS)) {
      let matches = true;
      for (const [lKey, expected] of Object.entries(pConfig.layers)) {
        const tObj = layerToggles.find(t => t.key === lKey);
        const el = tObj ? document.getElementById(tObj.id) : null;
        if (el && el.checked !== expected) {
          matches = false;
          break;
        }
      }
      if (matches) {
        matchedPreset = pKey;
        break;
      }
    }

    const tag = document.getElementById("activePresetTag");
    if (matchedPreset) {
      document.querySelectorAll(".preset-pill").forEach(btn => {
        btn.classList.toggle("active", btn.getAttribute("data-preset") === matchedPreset);
      });
      if (tag) tag.textContent = LAYER_PRESETS[matchedPreset].name;
    } else {
      document.querySelectorAll(".preset-pill").forEach(btn => btn.classList.remove("active"));
      if (tag) tag.textContent = "Custom";
    }
  }

  function applyPreset(presetKey) {
    const preset = LAYER_PRESETS[presetKey];
    if (!preset) return;

    Object.entries(preset.layers).forEach(([layerKey, shouldShow]) => {
      const tObj = layerToggles.find(t => t.key === layerKey);
      if (!tObj) return;
      const el = document.getElementById(tObj.id);
      if (el) el.checked = shouldShow;

      if (shouldShow) {
        if (typeof ensureLayerLoaded === "function") ensureLayerLoaded(layerKey);
        if (!map.hasLayer(tObj.group)) map.addLayer(tObj.group);
      } else {
        if (map.hasLayer(tObj.group)) map.removeLayer(tObj.group);
      }
    });

    document.querySelectorAll(".preset-pill").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-preset") === presetKey);
    });

    const tag = document.getElementById("activePresetTag");
    if (tag) tag.textContent = preset.name;

    updateActiveLayersCount();
    if (typeof applyZoomDependentRendering === "function") {
      applyZoomDependentRendering(map.getZoom());
    }
  }

  // Preset button click listeners
  document.querySelectorAll(".preset-pill").forEach(btn => {
    btn.addEventListener("click", () => {
      const pKey = btn.getAttribute("data-preset");
      if (pKey) applyPreset(pKey);
    });
  });

  // Layer toggle change listeners
  layerToggles.forEach(t => {
    const el = document.getElementById(t.id);
    if (el) {
      el.addEventListener("change", (e) => {
        if (e.target.checked) {
          if (typeof ensureLayerLoaded === "function") ensureLayerLoaded(t.key);
          if (!map.hasLayer(t.group)) map.addLayer(t.group);
        } else {
          if (map.hasLayer(t.group)) map.removeLayer(t.group);
        }
        updateActiveLayersCount();
        checkCurrentPresetMatch();
        if (typeof applyZoomDependentRendering === "function") {
          applyZoomDependentRendering(map.getZoom());
        }
      });
    }
  });

  // Tab switching for Specialized Asset Inspectors (Reduces vertical clutter)
  document.querySelectorAll(".insp-tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".insp-tab-btn").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".insp-tab-pane").forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      const targetId = btn.getAttribute("data-tab");
      const targetPane = document.getElementById(targetId);
      if (targetPane) targetPane.classList.add("active");
    });
  });

  // Initial active layers count update
  updateActiveLayersCount();

  // Layer Opacity Management (Week 6 GPU-Composited Custom Panes)
  const layerOpacityConfig = {
    opacityPower: { panes: ["powerPane"], valId: "valPower" },
    opacityTransmission: { panes: ["transmissionLinesPane", "substationsPane"], valId: "valTransmission" },
    opacityRoads: { panes: ["roadsPane"], valId: "valRoads" },
    opacityRailways: { panes: ["railwaysBasePane", "railwaysPane"], valId: "valRailways" },
    opacityStations: { panes: ["stationsPane"], valId: "valStations" },
    opacityDistricts: { panes: ["districtsPane"], valId: "valDistricts" },
    opacityHq: { panes: ["hqPane"], valId: "valHq" }
  };

  // Wire opacity drawer toggle buttons
  document.querySelectorAll(".layer-opacity-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const targetId = btn.getAttribute("data-target");
      const drawer = document.getElementById(targetId);
      if (drawer) {
        const isHidden = drawer.classList.toggle("hidden");
        btn.classList.toggle("active", !isHidden);
      }
    });
  });

  // Wire range sliders to Leaflet custom pane CSS opacities
  Object.entries(layerOpacityConfig).forEach(([sliderId, cfg]) => {
    const slider = document.getElementById(sliderId);
    const valDisplay = document.getElementById(cfg.valId);
    if (slider) {
      slider.addEventListener("input", (e) => {
        const val = parseInt(e.target.value, 10);
        if (valDisplay) valDisplay.textContent = `${val}%`;
        const ratio = (val / 100).toFixed(2);
        cfg.panes.forEach(paneName => {
          const p = map.getPane(paneName);
          if (p) p.style.opacity = ratio;
        });
      });
    }
  });

  // --- High-Performance Geospatial Caching & IndexedDB Storage Engine (Week 8) ---
  const InfraDataCache = {
    dbPromise: null,
    getDB() {
      if (!this.dbPromise) {
        this.dbPromise = new Promise((resolve) => {
          if (!window.indexedDB) {
            resolve(null);
            return;
          }
          try {
            const req = indexedDB.open("GujaratInfraTwin_v1", 1);
            req.onupgradeneeded = (e) => {
              const db = e.target.result;
              if (!db.objectStoreNames.contains("geojson_cache")) {
                db.createObjectStore("geojson_cache", { keyPath: "url" });
              }
            };
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => resolve(null);
          } catch {
            resolve(null);
          }
        });
      }
      return this.dbPromise;
    },
    async get(url) {
      try {
        const db = await this.getDB();
        if (!db) return null;
        return new Promise((resolve) => {
          const tx = db.transaction("geojson_cache", "readonly");
          const store = tx.objectStore("geojson_cache");
          const req = store.get(url);
          req.onsuccess = () => resolve(req.result ? req.result.data : null);
          req.onerror = () => resolve(null);
        });
      } catch {
        return null;
      }
    },
    async set(url, data) {
      try {
        const db = await this.getDB();
        if (!db) return;
        const tx = db.transaction("geojson_cache", "readwrite");
        const store = tx.objectStore("geojson_cache");
        store.put({ url, data, timestamp: Date.now() });
      } catch {
        // Silently tolerate quota or private-browsing restrictions
      }
    }
  };

  async function fetchCachedGeoJson(url) {
    try {
      const cached = await InfraDataCache.get(url);
      if (cached) {
        return cached;
      }
      const res = await fetch(url);
      if (!res.ok) {
        console.warn(`File ${url} returned HTTP ${res.status}`);
        return null;
      }
      const data = await res.json();
      InfraDataCache.set(url, data);
      return data;
    } catch (err) {
      console.error(`Failed to fetch GeoJSON from ${url}:`, err);
      return null;
    }
  }

  // 5. GeoJSON Layer Loader Helper with Non-Blocking Asynchronous Chunking
  async function loadGeoJsonLayer(url, layerGroup, options = {}) {
    try {
      const data = await fetchCachedGeoJson(url);
      if (!data) return null;

      const features = data.features;
      // If dataset contains > 350 features, chunk ingestion using requestAnimationFrame to yield main-thread control
      if (Array.isArray(features) && features.length > 350) {
        const rootLayer = L.geoJSON(null, options);
        layerGroup.addLayer(rootLayer);
        const chunkSize = 250;
        let offset = 0;

        await new Promise((resolve) => {
          function ingestNextChunk() {
            const chunk = features.slice(offset, offset + chunkSize);
            if (chunk.length > 0) {
              rootLayer.addData({ type: "FeatureCollection", features: chunk });
              offset += chunkSize;
              if (offset < features.length) {
                requestAnimationFrame(ingestNextChunk);
                return;
              }
            }
            resolve();
          }
          ingestNextChunk();
        });

        return { data, layer: rootLayer };
      } else {
        const layer = L.geoJSON(data, options);
        layerGroup.addLayer(layer);
        return { data, layer };
      }
    } catch (err) {
      console.error(`Failed to load GeoJSON from ${url}:`, err);
      return null;
    }
  }

  // 6. Layer Ingestion & Precision Feature Styling

  const DEFAULT_DISTRICT_STYLE = {
    color: "rgba(100, 116, 139, 0.40)",
    weight: 0.8,
    fillColor: "transparent",
    fillOpacity: 0.0
  };

  const ACTIVE_DISTRICT_STYLE = {
    weight: 2.0,
    color: "#38bdf8",
    fillColor: "#0284c7",
    fillOpacity: 0.12
  };

  let activeDistrictLayer = null;
  const districtLayers = {};
  const districtList = [];

  // --- A. District Boundaries (Clean solid boundary, authentic Survey of India polygons) ---
  loadGeoJsonLayer("data/gujarat_districts.geojson", layerGroups.districts, {
    pane: "districtsPane",
    interactive: false, // Pure cartographic backdrop: never intercepts POI dots, roads, or map panning
    style: DEFAULT_DISTRICT_STYLE,
    onEachFeature: (feature, layer) => {
      const p = feature.properties;
      const name = p.district || "District";
      const nameGu = p.district_gu || "";
      const hq = p.hq || name;
      const area = p.area_sqkm ? `${p.area_sqkm.toLocaleString()} sq. km` : "N/A";
      const cityArea = p.city_area_sqkm ? `~${p.city_area_sqkm.toLocaleString()} sq. km governed by ${p.urban_body || 'Municipal Corporation'}` : null;
      const locationDesc = p.location_desc || "";
      const dtCode = p.dt_code || "N/A";
      const pop = p.population_2011 ? `${p.population_2011.toLocaleString()} (Census 2011)` : "";
      const talukas = p.talukas_count ? `${p.talukas_count} Talukas` : "";
      const portal = p.official_portal || "";
      const bounds = layer.getBounds();

      districtBounds[name] = bounds;
      districtLayers[name] = layer;
      districtList.push(name);

      // Add to search index with enriched authoritative terms
      const searchSubtitle = cityArea 
        ? `District: ${area} • City Area: ~${p.city_area_sqkm} sq. km • HQ: ${hq}`
        : `Administrative District • Area: ${area} • HQ: ${hq}`;

      searchIndex.push({
        title: `${name} (${nameGu}) District`,
        subtitle: searchSubtitle,
        type: "district",
        category: "DISTRICT",
        badgeClass: "tag-district",
        icon: "🏛️",
        priority: 100,
        layerKey: "districts",
        searchTerms: [name, nameGu, hq, dtCode, p.urban_body || '', locationDesc, "district", "jilla", "gujarat"].join(" ").toLowerCase(),
        bounds: bounds,
        layer: layer,
        districtName: name
      });

      layer.bindPopup(`
        <div class="popup-card">
          <div class="popup-card-header">
            <div class="popup-category cat-district">Administrative District</div>
            <h4 class="popup-card-title">${name} <span style="font-size: 0.85rem; color: #94a3b8; font-weight: 500;">(${nameGu})</span></h4>
          </div>
          <div class="popup-grid">
            <span class="grid-key">Headquarters:</span>
            <span class="grid-val"><strong>📍 ${hq}</strong></span>
            <span class="grid-key">District Area:</span>
            <span class="grid-val"><strong>${area}</strong></span>
            ${cityArea ? `
            <span class="grid-key">City Area:</span>
            <span class="grid-val" style="color: #38bdf8;"><strong>${cityArea}</strong></span>
            ` : ''}
            ${locationDesc ? `
            <span class="grid-key">Location:</span>
            <span class="grid-val" style="grid-column: span 2; text-align: left; font-size: 0.72rem; color: #cbd5e1; line-height: 1.35; margin-top: 2px;">
              ${locationDesc}
            </span>
            ` : ''}
            ${pop ? `
            <span class="grid-key">Demographics:</span>
            <span class="grid-val">${pop} • ${talukas}</span>
            ` : ''}
            <span class="grid-key">LGD Code:</span>
            <span class="grid-val">${dtCode}</span>
            ${portal ? `
            <span class="grid-key">Official Portal:</span>
            <span class="grid-val"><a href="${portal}" target="_blank" rel="noopener noreferrer" style="color: #38bdf8; text-decoration: underline; font-weight: 500;">${portal.replace('https://', '')} ↗</a></span>
            ` : ''}
          </div>
          <div style="margin-top: 8px;">
            <button style="width: 100%; padding: 6px; background: #0284c7; color: #fff; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 0.78rem;" onclick="window.selectDistrictByName('${name}', true)">
              🔍 Zoom & Inspect District
            </button>
          </div>
        </div>
      `, { maxWidth: 320 });
    }
  }).then(() => {
    // Populate sorted district selector dropdown with dual-language labels
    const select = document.getElementById("districtSelect");
    if (select) {
      districtList.sort().forEach(dName => {
        const opt = document.createElement("option");
        opt.value = dName;
        const l = districtLayers[dName];
        const gu = l && l.feature && l.feature.properties && l.feature.properties.district_gu;
        opt.textContent = gu ? `${dName} (${gu})` : dName;
        select.appendChild(opt);
      });
    }
  });

  // --- A2. District Headquarters Nodes (Official Administrative Centers - Lazy Loaded) ---
  let districtHqPromise = null;
  function ensureDistrictHqLoaded() {
    if (districtHqPromise) return districtHqPromise;
    districtHqPromise = loadGeoJsonLayer("data/gujarat_district_hq.geojson", layerGroups.hq, {
      pane: "hqPane",
      pointToLayer: (feature, latlng) => {
        return L.circleMarker(latlng, {
          pane: "hqPane",
          radius: 5.5,
          fillColor: "#14b8a6",
          color: "#ffffff",
          weight: 1.8,
          opacity: 0.95,
          fillOpacity: 0.95
        });
      },
      onEachFeature: (feature, layer) => {
        const p = feature.properties;
        const hq = p.hq || "District HQ";
        const dt = p.district || "Gujarat";
        const dt_gu = p.district_gu || "";
        const latlng = layer.getLatLng();
        const area = p.area_sqkm ? `${p.area_sqkm.toLocaleString()} sq. km` : "";
        const cityArea = p.city_area_sqkm ? `~${p.city_area_sqkm.toLocaleString()} sq. km (${p.urban_body || 'Municipal Corp'})` : null;
        const locationDesc = p.location_desc || "";
        const portal = p.official_portal || "";

        searchIndex.push({
          title: `${hq} (District HQ)`,
          subtitle: `Administrative Seat of ${dt} (${dt_gu})${area ? ` • District Area: ${area}` : ''}`,
          type: "hq",
          category: "HQ",
          badgeClass: "tag-hq",
          icon: "📍",
          priority: 85,
          layerKey: "hq",
          searchTerms: [hq, dt, dt_gu, p.urban_body || '', locationDesc, "hq", "headquarters", "seat", "capital", "district"].join(" ").toLowerCase(),
          latlng: [latlng.lat, latlng.lng],
          layer: layer,
          districtName: dt
        });

        layer.bindTooltip(`<strong>📍 ${hq}</strong><br><small>HQ of ${dt}</small>`, {
          direction: "top",
          offset: [0, -6],
          opacity: 0.95
        });
        layer.bindPopup(`
          <div class="popup-card">
            <div class="popup-card-header">
              <div class="popup-category cat-district" style="background: rgba(20, 184, 166, 0.2); color: #2dd4bf;">District Headquarters</div>
              <h4 class="popup-card-title">📍 ${hq}</h4>
              <p style="font-size: 0.76rem; color: #94a3b8; margin-top: 2px;">Administrative seat of ${dt} (${dt_gu})</p>
            </div>
            <div class="popup-grid">
              <span class="grid-key">District:</span>
              <span class="grid-val"><strong>${dt}</strong></span>
              ${area ? `
              <span class="grid-key">District Area:</span>
              <span class="grid-val">${area}</span>
              ` : ''}
              ${cityArea ? `
              <span class="grid-key">City Area:</span>
              <span class="grid-val" style="color: #2dd4bf;"><strong>${cityArea}</strong></span>
              ` : ''}
              ${locationDesc ? `
              <span class="grid-key">Location:</span>
              <span class="grid-val" style="grid-column: span 2; text-align: left; font-size: 0.72rem; color: #cbd5e1; line-height: 1.35; margin-top: 2px;">
                ${locationDesc}
              </span>
              ` : ''}
              ${portal ? `
              <span class="grid-key">Gov Portal:</span>
              <span class="grid-val"><a href="${portal}" target="_blank" rel="noopener noreferrer" style="color: #2dd4bf; text-decoration: underline; font-weight: 500;">${portal.replace('https://', '')} ↗</a></span>
              ` : ''}
              <span class="grid-key">State:</span>
              <span class="grid-val">Gujarat</span>
            </div>
            <button style="width: 100%; margin-top: 0.6rem; padding: 6px; background: #0284c7; color: #fff; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 0.78rem;" onclick="window.selectDistrictByName('${dt}')">
              🔍 Zoom to ${dt} Boundary
            </button>
          </div>
        `);

        layer.on({
          mouseover: (e) => {
            e.target.setRadius(7.5);
            e.target.setStyle({ weight: 2.5, color: "#ffffff", fillOpacity: 1.0 });
          },
          mouseout: (e) => {
            e.target.setRadius(5.5);
            e.target.setStyle({ weight: 1.8, color: "#ffffff", fillOpacity: 0.95 });
          },
          click: (e) => {
            if (e) {
              if (e.originalEvent) {
                e.originalEvent._infraHandled = true;
                L.DomEvent.stopPropagation(e.originalEvent);
                L.DomEvent.preventDefault(e.originalEvent);
              }
              if (typeof L.DomEvent.stopPropagation === "function") {
                L.DomEvent.stopPropagation(e);
              }
            }
            layer.openPopup();
          }
        });
      }
    });
    return districtHqPromise;
  }

  // --- B. Roads & National Highways (Hierarchical Infrastructure Corridors) ---
  
  // Geodesic Segment Distance Helper (Leaflet LatLng distance calculation)
  function computeLatLngsLengthKm(latlngs) {
    if (!latlngs) return "0.00";
    let totalMeters = 0;
    if (Array.isArray(latlngs) && latlngs.length > 0) {
      if (Array.isArray(latlngs[0])) {
        for (const sub of latlngs) {
          totalMeters += parseFloat(computeLatLngsLengthKm(sub)) * 1000;
        }
      } else {
        for (let i = 0; i < latlngs.length - 1; i++) {
          totalMeters += latlngs[i].distanceTo(latlngs[i + 1]);
        }
      }
    }
    return (totalMeters / 1000).toFixed(2);
  }

  // Highway Symbology Hierarchy Engine (Warm Industrial Palette & Scale-Dependent LOD)
  function getHighwayStyle(feature, isHighlighted = false, zoom = null) {
    if (isHighlighted) {
      return {
        color: "#00f0ff", // Electric Cyan high-contrast highlight
        weight: 4.8,
        opacity: 1.0,
        lineCap: "round",
        lineJoin: "round"
      };
    }

    const currentZoom = typeof zoom === "number" ? zoom : map.getZoom();
    const cat = (feature.properties && feature.properties.category) || "national_highway";

    // Level-of-Detail (LOD) scale filtering for visual clarity
    // At state overview (zoom <= 7.5), hide minor feeder roads to eliminate visual clutter
    if (currentZoom <= 7.5) {
      if (cat === "feeder_highway") {
        return { opacity: 0, weight: 0.001 };
      }
      if (cat === "national_highway") {
        return { color: "#eab308", weight: 1.3, opacity: 0.65, lineCap: "round", lineJoin: "round" };
      }
    } else if (currentZoom <= 9.5) {
      if (cat === "feeder_highway") {
        return { color: "#78716c", weight: 0.9, opacity: 0.40, lineCap: "round", lineJoin: "round" };
      }
      if (cat === "national_highway") {
        return { color: "#eab308", weight: 1.7, opacity: 0.75, lineCap: "round", lineJoin: "round" };
      }
    }

    switch (cat) {
      case "expressway":
        // Access-Controlled Expressway (NE-1, NH 148N) - Vivid Neon Orange
        return { color: "#f97316", weight: currentZoom >= 11 ? 4.5 : 3.5, opacity: 0.95, lineCap: "round", lineJoin: "round" };
      case "golden_quadrilateral":
        // Golden Quadrilateral Arterial Lifeline (NH 48) - Deep Arterial Red-Orange
        return { color: "#ea580c", weight: currentZoom >= 11 ? 4.0 : 3.0, opacity: 0.90, lineCap: "round", lineJoin: "round" };
      case "arterial_corridor":
        // East-West Corridor & Major Economic Corridors (NH 27, 47, 53, 754K) - Warm Amber
        return { color: "#f59e0b", weight: currentZoom >= 11 ? 3.0 : 2.2, opacity: 0.85, lineCap: "round", lineJoin: "round" };
      case "national_highway":
        // Primary 2-lane / 4-lane National Highways (NH 51, 41, 56, 64, etc.) - Golden Yellow
        return { color: "#eab308", weight: currentZoom >= 11 ? 2.2 : 1.8, opacity: 0.80, lineCap: "round", lineJoin: "round" };
      case "feeder_highway":
      default:
        // Feeder & 3-Digit Inter-District Spurs - Muted Stone Neutral
        return { color: "#78716c", weight: currentZoom >= 11 ? 1.6 : 1.1, opacity: 0.60, lineCap: "round", lineJoin: "round" };
    }
  }

  const highwayCorridors = {}; // corridorName -> [{ layer, feature }]
  const highwayLayers = [];    // [{ layer, feature }]
  let activeHighlightedCorridor = null;
  let activeFilteredClass = "all";

  let roadsPromise = null;
  function ensureRoadsLoaded() {
    if (roadsPromise) return roadsPromise;
    roadsPromise = loadGeoJsonLayer("data/gujarat_roads.geojson", layerGroups.roads, {
      pane: "roadsPane",
      style: (feature) => getHighwayStyle(feature, false),
      onEachFeature: (feature, layer) => {
        const p = feature.properties || {};
        const corridor = p.corridor || p.name || "National Highway";
        const cat = p.category || "national_highway";
        const title = p.title || `${corridor} Corridor`;
        const route = p.route || "Continuous National Highway Corridor";
        const totalKm = p.total_length_km || p.corridor_total_km || 0;
        const speed = p.speed_limit_kmh || 80;
        const operator = p.operator || "NHAI / MoRTH";

        // Register into corridor and layer index
        if (!highwayCorridors[corridor]) {
          highwayCorridors[corridor] = [];
          // Add to search index once per unified corridor
          searchIndex.push({
            title: `${corridor} — ${title}`,
            subtitle: `${p.class_label || "National Highway"} • ${totalKm} km Statewide Alignment • ${speed} km/h • ${operator}`,
            type: "road",
            category: cat === "expressway" ? "EXPRESSWAY" : (cat === "golden_quadrilateral" ? "GQ ARTERIAL" : "HIGHWAY"),
            badgeClass: cat === "expressway" ? "tag-expressway" : (cat === "golden_quadrilateral" ? "tag-expressway" : "tag-road"),
            icon: "🛣️",
            priority: cat === "expressway" ? 95 : (cat === "golden_quadrilateral" ? 92 : 75),
            layerKey: "roads",
            searchTerms: [corridor, title, route, operator, p.class_label, "nh", "highway", "expressway", "corridor", "road", "gujarat"].join(" ").toLowerCase(),
            corridorName: corridor
          });
        }
        highwayCorridors[corridor].push({ layer, feature });
        highwayLayers.push({ layer, feature });

        // Determine category CSS class badge
        let catBadgeClass = "cat-nh";
        if (cat === "expressway") catBadgeClass = "cat-expressway";
        else if (cat === "golden_quadrilateral") catBadgeClass = "cat-gq";
        else if (cat === "arterial_corridor") catBadgeClass = "cat-arterial";
        else if (cat === "feeder_highway") catBadgeClass = "cat-feeder";

        layer.bindTooltip(`<strong>🛣️ ${title}</strong><br><small style="color: #38bdf8;">${totalKm} km Statewide Alignment • ${speed} km/h • ${operator}</small>`, {
          sticky: true,
          opacity: 0.95
        });
        layer.bindPopup(`
          <div class="popup-card">
            <div class="popup-card-header">
              <span class="popup-category ${catBadgeClass}">${p.class_label || "National Highway"}</span>
              <h4 class="popup-card-title">🛣️ ${corridor}</h4>
              <p style="font-size: 0.74rem; color: #94a3b8; margin-top: 2px;">${title}</p>
            </div>
            <div class="popup-grid">
              <span class="grid-key">Statewide Route:</span>
              <span class="grid-val"><strong style="color: #38bdf8;">${totalKm} km</strong> (Unified Gujarat Alignment)</span>
              <span class="grid-key">Classification:</span>
              <span class="grid-val">${p.class_label || "National Highway"}</span>
              <span class="grid-key">Design Speed:</span>
              <span class="grid-val"><strong>${speed} km/h</strong> ${cat === 'expressway' ? '<span style="color: #f97316; font-size: 0.70rem; font-weight: 600;">(MoRTH Official Limit)</span>' : ''}</span>
              <span class="grid-key">Authority:</span>
              <span class="grid-val">${operator}</span>
              <span class="grid-key">Interconnected Hubs:</span>
              <span class="grid-val" style="grid-column: span 2; text-align: left; font-size: 0.72rem; color: #cbd5e1; margin-top: 4px; line-height: 1.35;">
                ${route}
              </span>
            </div>
            <div class="popup-action-row">
              <button class="popup-btn-highlight" onclick="window.highlightHighwayCorridor('${corridor}')">
                🔦 Highlight Highway (${totalKm} km)
              </button>
              <button class="popup-btn-zoom" onclick="window.zoomToHighwayCorridor('${corridor}')">
                🔍 Zoom Extent
              </button>
            </div>
          </div>
        `, { maxWidth: 330 });

        layer.on({
          mouseover: (e) => {
            if (activeHighlightedCorridor !== corridor) {
              e.target.setStyle({ weight: 5.2, color: "#fef08a", opacity: 1.0 });
            }
          },
          mouseout: (e) => {
            if (activeHighlightedCorridor === corridor) {
              e.target.setStyle(getHighwayStyle(feature, true, map.getZoom()));
            } else {
              e.target.setStyle(getHighwayStyle(feature, false, map.getZoom()));
            }
          },
          click: (e) => {
            if (e) {
              if (e.originalEvent) {
                e.originalEvent._infraHandled = true;
                L.DomEvent.stopPropagation(e.originalEvent);
                L.DomEvent.preventDefault(e.originalEvent);
              }
              if (typeof L.DomEvent.stopPropagation === "function") {
                L.DomEvent.stopPropagation(e);
              }
            }
            selectHighwayCorridor(corridor, false);
          }
        });
      }
    }).then(() => {
      if (typeof applyZoomDependentRendering === "function") {
        applyZoomDependentRendering(map.getZoom());
      }
    });
    return roadsPromise;
  }

  // Defer roads loading until after initial map canvas, vector districts, and LCP tile have rendered
  if ("requestIdleCallback" in window) {
    requestIdleCallback(() => {
      setTimeout(ensureRoadsLoaded, 800);
    });
  } else {
    setTimeout(ensureRoadsLoaded, 1000);
  }

  // --- C. Railway Tracks (Authentic Dual-Tone Railroad Symbology) ---
  // Layered architecture: solid dark base casing (railwaysBasePane) + high-contrast dashed cross-ties (railwaysPane)
  
  async function loadDualToneRailways() {
    try {
      const data = await fetchCachedGeoJson("data/gujarat_railways.geojson");
      if (!data) return;

      // Layer 1: Solid Dark Base Casing (Rail Track Ballast/Bed)
      const baseLayer = L.geoJSON(data, {
        pane: "railwaysBasePane",
        style: (feature) => {
          const gcode = (feature.properties && feature.properties.gauge_code) || "BG";
          return {
            color: "#0f172a",
            weight: gcode === "BG" ? 3.8 : (gcode === "MG" ? 2.8 : 2.0),
            opacity: 0.95,
            lineCap: "butt",
            lineJoin: "round"
          };
        }
      });
      layerGroups.railways.addLayer(baseLayer);

      // Layer 2: High-Contrast Dashed Cross-Ties (Sleepers Overlay)
      const tiesLayer = L.geoJSON(data, {
        pane: "railwaysPane",
        style: (feature) => {
          const gcode = (feature.properties && feature.properties.gauge_code) || "BG";
          if (gcode === "NG") {
            // Heritage narrow gauge - subtle amber tint
            return { color: "#fbbf24", weight: 1.2, dashArray: "2, 4", opacity: 0.90 };
          } else if (gcode === "MG") {
            // Meter gauge
            return { color: "#e2e8f0", weight: 1.4, dashArray: "3, 5", opacity: 0.90 };
          }
          // Standard Broad Gauge mainline
          return { color: "#ffffff", weight: 1.8, dashArray: "4, 6", opacity: 0.95 };
        },
        onEachFeature: (feature, layer) => {
          const p = feature.properties || {};
          const name = p.name || "Western Railway Corridor";
          const gauge = p.gauge || "Broad Gauge (1676 mm)";
          const electrified = p.electrified || "Yes (25 kV AC)";
          const len = p.length_km ? `${p.length_km} km` : "N/A";
          const zone = p.zone || "Western Railway (WR)";

          if (!window.railwayCorridorsIndex) window.railwayCorridorsIndex = {};
          if (!window.railwayCorridorsIndex[name]) {
            window.railwayCorridorsIndex[name] = true;
            searchIndex.push({
              title: `${name}`,
              subtitle: `Rail Corridor • ${gauge} • ${electrified} • ${zone}`,
              type: "railway",
              category: "RAILWAY",
              badgeClass: "tag-railway",
              icon: "🚆",
              priority: 70,
              layerKey: "railways",
              searchTerms: [name, gauge, electrified, zone, "railway", "train", "track", "corridor", "rail"].join(" ").toLowerCase(),
              bounds: layer.getBounds ? layer.getBounds() : null,
              layer: layer,
              railwayName: name
            });
          }

          layer.bindTooltip(`<strong>🚆 ${name}</strong><br><small>${gauge} | ${electrified}</small>`, {
            sticky: true,
            opacity: 0.95
          });
          layer.bindPopup(`
            <div class="popup-card">
              <div class="popup-card-header">
                <span class="popup-category cat-rail" style="color: #94a3b8;">Rail Infrastructure</span>
                <h4 class="popup-card-title">🚆 ${name}</h4>
              </div>
              <div class="popup-grid">
                <span class="grid-key">Track Gauge:</span>
                <span class="grid-val">${gauge}</span>
                <span class="grid-key">Electrification:</span>
                <span class="grid-val"><strong style="color: #38bdf8;">${electrified}</strong></span>
                <span class="grid-key">Segment Length:</span>
                <span class="grid-val">${len}</span>
                <span class="grid-key">Operating Zone:</span>
                <span class="grid-val">${zone}</span>
                <span class="grid-key">Authority:</span>
                <span class="grid-val">Ministry of Railways</span>
              </div>
            </div>
          `);

          layer.on({
            mouseover: (e) => e.target.setStyle({ color: "#00f0ff", weight: 3.5, opacity: 1 }),
            mouseout: (e) => {
              const gcode = (feature.properties && feature.properties.gauge_code) || "BG";
              const defaultColor = gcode === "NG" ? "#fbbf24" : "#ffffff";
              e.target.setStyle({ color: defaultColor, weight: gcode === "BG" ? 1.8 : 1.4, opacity: 0.95 });
            },
            click: (e) => {
              if (e) {
                if (e.originalEvent) {
                  L.DomEvent.stopPropagation(e.originalEvent);
                  L.DomEvent.preventDefault(e.originalEvent);
                }
                if (typeof L.DomEvent.stopPropagation === "function") {
                  L.DomEvent.stopPropagation(e);
                }
              }
            }
          });
        }
      });
      layerGroups.railways.addLayer(tiesLayer);
    } catch (err) {
      console.error("Failed to load dual-tone railway tracks:", err);
    }
  }

  let railwaysPromise = null;
  function ensureRailwaysLoaded() {
    if (railwaysPromise) return railwaysPromise;
    railwaysPromise = loadDualToneRailways();
    return railwaysPromise;
  }

  // --- D. Railway Stations (Level-of-Detail & Operating Divisions) ---
  const stationMarkersByCode = {};
  const allStationMarkers = [];
  let activeDivisionFilter = "all";

  function getStationVisibility(feature, zoom) {
    const p = feature.properties || {};
    const divCode = p.division_code || "";

    // Check division filter match
    if (activeDivisionFilter !== "all") {
      if (activeDivisionFilter === "major") {
        if (!p.is_major) return false;
      } else if (divCode !== activeDivisionFilter) {
        return false;
      }
    }

    // All stations visible when layer is active with zoom-scaled tactile radii
    return true;
  }

  function getStationMarkerStyle(feature, zoom) {
    const currentZoom = typeof zoom === "number" ? zoom : map.getZoom();
    const isVisible = getStationVisibility(feature, currentZoom);
    if (!isVisible) {
      return { radius: 0.001, opacity: 0, fillOpacity: 0, pane: "stationsPane" };
    }

    const p = feature.properties || {};
    const cat = p.category || "regular_station";

    if (p.is_major || cat === "major_junction") {
      const rad = currentZoom >= 11 ? 8.0 : (currentZoom >= 8.5 ? 6.8 : 5.8);
      return {
        pane: "stationsPane",
        radius: rad,
        fillColor: "#2563eb",
        color: "#ffffff",
        weight: 1.8,
        opacity: 0.95,
        fillOpacity: 0.95
      };
    } else if (cat === "junction") {
      const rad = currentZoom >= 11 ? 6.5 : (currentZoom >= 8.5 ? 5.5 : 4.8);
      return {
        pane: "stationsPane",
        radius: rad,
        fillColor: "#3b82f6",
        color: "#ffffff",
        weight: 1.5,
        opacity: 0.90,
        fillOpacity: 0.90
      };
    }
    const rad = currentZoom >= 12 ? 5.2 : (currentZoom >= 9 ? 4.2 : 3.6);
    return {
      pane: "stationsPane",
      radius: rad,
      fillColor: "#60a5fa",
      color: "#1e3a8a",
      weight: 1.2,
      opacity: 0.90,
      fillOpacity: 0.85
    };
  }

  let stationsPromise = null;
  function ensureStationsLoaded() {
    if (stationsPromise) return stationsPromise;
    stationsPromise = loadGeoJsonLayer("data/gujarat_stations.geojson", layerGroups.stations, {
      pane: "stationsPane",
      pointToLayer: (feature, latlng) => {
        const style = getStationMarkerStyle(feature, map.getZoom());
        return L.circleMarker(latlng, {
          ...style,
          pane: "stationsPane"
        });
      },
      onEachFeature: (feature, layer) => {
        const p = feature.properties || {};
        const name = p.name || "Station";
        const code = p.code || "N/A";
        const division = p.division || "Western Railway";
        const divCode = p.division_code || "WR";
        const category = p.category || "regular_station";
        const classLabel = p.class_label || "Passenger Station";
        const zone = p.zone || "Western Railway (WR)";
        const latlng = layer.getLatLng();

        stationMarkersByCode[code] = { marker: layer, feature };
        allStationMarkers.push({ marker: layer, feature });

        // Add all stations to search index
        searchIndex.push({
          title: `${name} (${code})`,
          subtitle: `${classLabel} • ${division} (${divCode}) • ${zone}`,
          type: "station",
          category: p.is_major ? "TERMINAL" : (category === "junction" ? "JUNCTION" : "STATION"),
          badgeClass: p.is_major ? "tag-terminal" : "tag-station",
          icon: "🚉",
          priority: p.is_major ? 92 : (category === "junction" ? 78 : 55),
          layerKey: "stations",
          searchTerms: [name, code, division, divCode, classLabel, zone, "station", "junction", "railway", "train", "wr"].join(" ").toLowerCase(),
          stationCode: code,
          latlng: [latlng.lat, latlng.lng],
          layer: layer
        });

        // Tooltip with Operating Division
        layer.bindTooltip(`<strong>🚆 ${name} (${code})</strong><br><small style="color: #38bdf8;">${division}</small>`, {
          direction: "top",
          offset: [0, -6],
          opacity: 0.95
        });

        let catBadgeClass = "cat-railway-halt";
        if (p.is_major) catBadgeClass = "cat-railway-terminal";
        else if (category === "junction") catBadgeClass = "cat-railway-junction";

        layer.bindPopup(`
          <div class="popup-card">
            <div class="popup-card-header">
              <span class="popup-category ${catBadgeClass}">${classLabel}</span>
              <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 3px;">
                <h4 class="popup-card-title">🚉 ${name}</h4>
                <span class="station-code-chip">${code}</span>
              </div>
            </div>
            <div class="popup-grid">
              <span class="grid-key">Operating Division:</span>
              <span class="grid-val"><strong style="color: #38bdf8;">${division}</strong></span>
              <span class="grid-key">Railway Zone:</span>
              <span class="grid-val">${zone}</span>
              <span class="grid-key">Station Code:</span>
              <span class="grid-val">${code}</span>
              <span class="grid-key">State:</span>
              <span class="grid-val">Gujarat</span>
            </div>
            <div class="popup-action-row">
              <button class="popup-btn-zoom" onclick="window.focusRailwayStation('${code}', true)">
                🔍 Zoom to Station
              </button>
            </div>
          </div>
        `, { maxWidth: 300 });

        layer.on({
          mouseover: (e) => {
            const curR = e.target.getRadius();
            e.target._origRadius = curR;
            e.target.setRadius(curR + 2.5);
            e.target.setStyle({ weight: 2.5, color: "#ffffff", fillOpacity: 1.0 });
          },
          mouseout: (e) => {
            if (typeof e.target._origRadius === "number") {
              e.target.setRadius(e.target._origRadius);
            }
            e.target.setStyle(getStationMarkerStyle(feature, map.getZoom()));
          },
          click: (e) => {
            if (e) {
              if (e.originalEvent) {
                e.originalEvent._infraHandled = true;
                L.DomEvent.stopPropagation(e.originalEvent);
                L.DomEvent.preventDefault(e.originalEvent);
              }
              if (typeof L.DomEvent.stopPropagation === "function") {
                L.DomEvent.stopPropagation(e);
              }
            }
            focusRailwayStation(code, false); // Keep camera steady, open popup in-place
          }
        });
      }
    }).then(() => {
      if (typeof applyZoomDependentRendering === "function") {
        applyZoomDependentRendering(map.getZoom());
      }
    });
    return stationsPromise;
  }

  // --- E. Power Generation Facilities (Capacity-Scaled Radii & Fuel Categorization) ---
  const POWER_CATEGORY_CONFIG = {
    solar: { color: "#eab308", glow: "#ca8a04", label: "Solar Photovoltaic", badgeClass: "cat-solar" },
    wind: { color: "#10b981", glow: "#059669", label: "Wind Generation", badgeClass: "cat-wind" },
    nuclear: { color: "#a855f7", glow: "#7e22ce", label: "Atomic Nuclear", badgeClass: "cat-nuclear" },
    hydro: { color: "#0284c7", glow: "#0369a1", label: "Hydroelectric Dam", badgeClass: "cat-hydro" },
    thermal: { color: "#f97316", glow: "#c2410c", label: "Thermal (Coal/Lignite)", badgeClass: "cat-thermal" },
    gas: { color: "#06b6d4", glow: "#0891b2", label: "Natural Gas (CCGT)", badgeClass: "cat-gas" }
  };

  const powerMarkersByName = {};
  const allPowerMarkers = [];
  let activePowerFilter = "all";

  function getPowerMarkerStyle(feature, zoom = null) {
    const p = feature.properties || {};
    const cat = (p.category || "thermal").toLowerCase();
    const config = POWER_CATEGORY_CONFIG[cat] || POWER_CATEGORY_CONFIG.thermal;
    const isVisible = activePowerFilter === "all" || cat === activePowerFilter;

    if (!isVisible) {
      return { radius: 0.001, opacity: 0, fillOpacity: 0, pane: "powerPane" };
    }

    const currentZoom = typeof zoom === "number" ? zoom : map.getZoom();
    const cap = parseFloat(p.capacity_mw) || 100;

    // Ensure all 44 power facilities across Gujarat are visible and interactive with tactile hit targets
    let rad;
    if (currentZoom <= 7.5) {
      rad = Math.max(6.0, Math.min(12.0, Math.sqrt(cap) / 5.0));
    } else if (currentZoom <= 10) {
      rad = Math.max(7.0, Math.min(14.0, Math.sqrt(cap) / 4.5));
    } else {
      rad = Math.max(8.0, Math.min(16.0, Math.sqrt(cap) / 4.0));
    }

    return {
      pane: "powerPane",
      radius: rad,
      fillColor: config.color,
      color: "#ffffff",
      weight: 1.8,
      opacity: 0.95,
      fillOpacity: 0.92
    };
  }

  loadGeoJsonLayer("data/gujarat_power.geojson", layerGroups.power, {
    pane: "powerPane",
    pointToLayer: (feature, latlng) => {
      const style = getPowerMarkerStyle(feature, map.getZoom());
      return L.circleMarker(latlng, {
        ...style,
        pane: "powerPane"
      });
    },
    onEachFeature: (feature, layer) => {
      const p = feature.properties || {};
      const name = p.name || "Power Generation Plant";
      const cat = (p.category || "thermal").toLowerCase();
      const config = POWER_CATEGORY_CONFIG[cat] || POWER_CATEGORY_CONFIG.thermal;
      const cap = parseFloat(p.capacity_mw) || 0;
      const typeLabel = p.type_label || config.label;
      const fuel = p.fuel || "Thermal / Gas / Hydro";
      const dist = p.district || "Gujarat";
      const op = p.operator || "GSECL / Private";
      const isGreen = p.is_renewable;
      const latlng = layer.getLatLng();

      powerMarkersByName[name] = { marker: layer, feature };
      allPowerMarkers.push({ marker: layer, feature });

      // Add power plants to search index
      searchIndex.push({
        title: `${name}`,
        subtitle: `${cap.toLocaleString()} MW • ${typeLabel} • ${dist} • ${op}`,
        type: "power",
        category: cat.toUpperCase(),
        badgeClass: `tag-${cat}`,
        icon: isGreen ? "🌱" : "⚡",
        priority: cap >= 1000 ? 94 : 80,
        layerKey: "power",
        searchTerms: [name, cat, fuel, op, dist, `${cap} mw`, `${cap}mw`, typeLabel, isGreen ? "renewable green clean solar wind" : "baseload grid thermal gas coal", "power", "energy", "generation", "plant", "station"].join(" ").toLowerCase(),
        powerName: name,
        latlng: [latlng.lat, latlng.lng],
        layer: layer
      });

      layer.bindTooltip(`<strong>⚡ ${name}</strong><br><small style="color: #fef08a;">${cap.toLocaleString()} MW</small> | <small style="color: #94a3b8;">${typeLabel}</small>`, {
        direction: "top",
        offset: [0, -8],
        opacity: 0.95
      });
      layer.bindPopup(`
        <div class="popup-card">
          <div class="popup-card-header">
            <span class="popup-category ${config.badgeClass}">${typeLabel}</span>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 3px;">
              <h4 class="popup-card-title">⚡ ${name}</h4>
              <span class="telemetry-cap-badge" style="font-size: 0.75rem;">${cap.toLocaleString()} MW</span>
            </div>
          </div>
          <div class="popup-grid">
            <span class="grid-key">Installed Capacity:</span>
            <span class="grid-val"><strong style="color: #38bdf8;">${cap.toLocaleString()} MW</strong></span>
            <span class="grid-key">Fuel Source:</span>
            <span class="grid-val">${fuel}</span>
            <span class="grid-key">Operator / Utility:</span>
            <span class="grid-val">${op}</span>
            <span class="grid-key">Host District:</span>
            <span class="grid-val">${dist}</span>
            <span class="grid-key">Grid Role:</span>
            <span class="grid-val">${isGreen ? "🌱 100% Clean Renewable" : "⚡ Baseload Grid Power"}</span>
          </div>
          <div class="popup-action-row">
            <button class="popup-btn-zoom" onclick="window.focusPowerPlant('${name.replace(/'/g, "\\'")}', true)">
              🔍 Zoom to Plant
            </button>
          </div>
        </div>
      `, { maxWidth: 320 });

      layer.on({
        mouseover: (e) => {
          const curR = e.target.getRadius();
          e.target._origRadius = curR;
          e.target.setRadius(curR + 2.5);
          e.target.setStyle({ weight: 3.0, color: "#ffffff", fillOpacity: 1.0 });
        },
        mouseout: (e) => {
          if (typeof e.target._origRadius === "number") {
            e.target.setRadius(e.target._origRadius);
          }
          e.target.setStyle(getPowerMarkerStyle(feature, map.getZoom()));
        },
        click: (e) => {
          if (e) {
            if (e.originalEvent) {
              e.originalEvent._infraHandled = true;
              L.DomEvent.stopPropagation(e.originalEvent);
              L.DomEvent.preventDefault(e.originalEvent);
            }
            if (typeof L.DomEvent.stopPropagation === "function") {
              L.DomEvent.stopPropagation(e);
            }
          }
          focusPowerPlant(name, false); // Keep camera steady, open popup in-place
        }
      });
    }
  }).then(() => {
    if (typeof applyZoomDependentRendering === "function") {
      applyZoomDependentRendering(map.getZoom());
    }
  });

  // --- F. GETCO & POWERGRID High-Voltage Transmission Grid (400kV / 765kV) ---
  const transmissionCorridorsByCode = {};
  const transmissionLayers = [];
  let activeHighlightedTransmission = null;

  async function loadTransmissionGrid() {
    try {
      const data = await fetchCachedGeoJson("data/gujarat_transmission.geojson");
      if (!data) return;

      L.geoJSON(data, {
        pointToLayer: (feature, latlng) => {
          const p = feature.properties || {};
          const v = p.voltage_kv || 400;
          return L.circleMarker(latlng, {
            pane: "substationsPane",
            radius: v === 765 ? 5.5 : 4.2,
            fillColor: v === 765 ? "#a855f7" : "#38bdf8",
            color: "#ffffff",
            weight: v === 765 ? 1.6 : 1.2,
            opacity: 1.0,
            fillOpacity: 0.95
          });
        },
        style: (feature) => {
          if (feature.geometry.type === "LineString") {
            const p = feature.properties || {};
            const v = p.voltage_kv || 400;
            if (v === 765) {
              return {
                pane: "transmissionLinesPane",
                color: "#c084fc",
                weight: 3.2,
                opacity: 0.95,
                lineCap: "round",
                lineJoin: "round"
              };
            }
            return {
              pane: "transmissionLinesPane",
              color: "#38bdf8",
              weight: 2.0,
              dashArray: "5, 4",
              opacity: 0.85,
              lineCap: "round",
              lineJoin: "round"
            };
          }
          return {};
        },
        onEachFeature: (feature, layer) => {
          const p = feature.properties || {};
          const ftype = p.feature_type || (feature.geometry.type === "Point" ? "substation" : "transmission_line");
          const v = p.voltage_kv || 400;

          if (ftype === "transmission_line") {
            const name = p.name || "Transmission Corridor";
            const code = p.corridor_code || "";
            const len = p.length_km ? `${p.length_km} km` : "N/A";
            const op = p.operator || "GETCO / POWERGRID";
            const subs = p.substations || "Strategic Substation Nodes";
            const circuits = p.circuits || "Double Circuit (D/C)";
            const catBadgeClass = v === 765 ? "cat-transmission-765" : "cat-transmission-400";

            transmissionCorridorsByCode[code] = { layer, feature };
            transmissionLayers.push({ layer, feature });

            searchIndex.push({
              title: `${name}`,
              subtitle: `${v} kV ${v === 765 ? 'UHV' : 'EHV'} Corridor • ${len} • ${circuits} • ${op}`,
              type: "power",
              category: v === 765 ? "765kV GRID" : "400kV GRID",
              badgeClass: "tag-grid",
              icon: "⚡",
              priority: v === 765 ? 88 : 74,
              layerKey: "transmission",
              searchTerms: [name, code, `${v} kv`, `${v}kv`, op, subs, "transmission", "grid", "line", "getco", "powergrid"].join(" ").toLowerCase(),
              transmissionCode: code,
              layer: layer
            });

            layer.bindTooltip(`<strong>⚡ ${name}</strong><br><small style="color: #38bdf8;">${len} | ${circuits}</small>`, {
              sticky: true,
              opacity: 0.95
            });
            layer.bindPopup(`
              <div class="popup-card">
                <div class="popup-card-header">
                  <span class="popup-category ${catBadgeClass}">${p.voltage_label || "High-Voltage Transmission Line"}</span>
                  <h4 class="popup-card-title">⚡ ${name}</h4>
                </div>
                <div class="popup-grid">
                  <span class="grid-key">Voltage Level:</span>
                  <span class="grid-val"><strong style="color: ${v === 765 ? '#c084fc' : '#38bdf8'};">${v} kV ${v === 765 ? 'UHV' : 'EHV'}</strong></span>
                  <span class="grid-key">Corridor Length:</span>
                  <span class="grid-val">${len}</span>
                  <span class="grid-key">Circuit Config:</span>
                  <span class="grid-val">${circuits}</span>
                  <span class="grid-key">Grid Operator:</span>
                  <span class="grid-val">${op}</span>
                  <span class="grid-key">Interconnected Nodes:</span>
                  <span class="grid-val" style="grid-column: span 2; font-size: 0.72rem; color: #cbd5e1; margin-top: 4px; line-height: 1.35;">${subs}</span>
                </div>
                <div class="popup-action-row">
                  <button class="popup-btn-highlight" onclick="window.highlightTransmissionCorridor('${code}')">
                    🔦 Highlight Corridor
                  </button>
                  <button class="popup-btn-zoom" onclick="window.zoomToTransmissionCorridor('${code}')">
                    🔍 Zoom Extent
                  </button>
                </div>
              </div>
            `, { maxWidth: 320 });

            layer.on({
              mouseover: (e) => {
                if (activeHighlightedTransmission !== code) {
                  e.target.setStyle({ weight: 4.8, color: "#fef08a", opacity: 1.0 });
                }
              },
              mouseout: (e) => {
                if (activeHighlightedTransmission !== code) {
                  e.target.setStyle({
                    color: v === 765 ? "#c084fc" : "#38bdf8",
                    weight: v === 765 ? 3.2 : 2.0,
                    dashArray: v === 765 ? null : "5, 4",
                    opacity: v === 765 ? 0.95 : 0.85
                  });
                }
              },
              click: (e) => {
                if (e) {
                  if (e.originalEvent) {
                    L.DomEvent.stopPropagation(e.originalEvent);
                    L.DomEvent.preventDefault(e.originalEvent);
                  }
                  if (typeof L.DomEvent.stopPropagation === "function") {
                    L.DomEvent.stopPropagation(e);
                  }
                }
                selectTransmissionCorridor(code, false);
              }
            });
          } else if (ftype === "substation") {
            const name = p.name || "Substation";
            const dist = p.district || "Gujarat";
            const op = p.operator || "GETCO";
            const latlng = layer.getLatLng();

            searchIndex.push({
              title: `${name}`,
              subtitle: `${p.voltage_label || (v + " kV Substation")} • ${dist} • ${op}`,
              type: "power",
              category: "SUBSTATION",
              badgeClass: "tag-substation",
              icon: "🔌",
              priority: 76,
              layerKey: "transmission",
              searchTerms: [name, `${v} kv`, `${v}kv`, dist, op, "substation", "pooling", "getco", "powergrid", "grid"].join(" ").toLowerCase(),
              latlng: [latlng.lat, latlng.lng],
              layer: layer
            });

            layer.bindTooltip(`<strong>⚡ ${name}</strong><br><small style="color: #a855f7;">${p.voltage_label}</small>`, {
              direction: "top",
              offset: [0, -6],
              opacity: 0.95
            });
            layer.bindPopup(`
              <div class="popup-card">
                <div class="popup-card-header">
                  <span class="popup-category cat-substation">${p.voltage_label}</span>
                  <h4 class="popup-card-title">⚡ ${name}</h4>
                </div>
                <div class="popup-grid">
                  <span class="grid-key">Voltage Level:</span>
                  <span class="grid-val"><strong style="color: ${v === 765 ? '#c084fc' : '#38bdf8'};">${v} kV</strong></span>
                  <span class="grid-key">Host District:</span>
                  <span class="grid-val">${dist}</span>
                  <span class="grid-key">Operating Utility:</span>
                  <span class="grid-val">${op}</span>
                  <span class="grid-key">Grid Role:</span>
                  <span class="grid-val">State Strategic Pooling Substation</span>
                </div>
              </div>
            `);

            layer.on({
              mouseover: (e) => {
                const curR = e.target.getRadius();
                e.target._origRadius = curR;
                e.target.setRadius(curR + 2.5);
                e.target.setStyle({ weight: 2.8, color: "#ffffff", fillOpacity: 1.0 });
              },
              mouseout: (e) => {
                if (typeof e.target._origRadius === "number") {
                  e.target.setRadius(e.target._origRadius);
                }
                const vLevel = p.voltage_kv || 400;
                e.target.setStyle({
                  pane: "substationsPane",
                  radius: vLevel === 765 ? 6.0 : 4.8,
                  fillColor: vLevel === 765 ? "#a855f7" : "#38bdf8",
                  color: "#ffffff",
                  weight: vLevel === 765 ? 1.8 : 1.4,
                  opacity: 1.0,
                  fillOpacity: 0.95
                });
              },
              click: (e) => {
                if (e) {
                  if (e.originalEvent) {
                    e.originalEvent._infraHandled = true;
                    L.DomEvent.stopPropagation(e.originalEvent);
                    L.DomEvent.preventDefault(e.originalEvent);
                  }
                  if (typeof L.DomEvent.stopPropagation === "function") {
                    L.DomEvent.stopPropagation(e);
                  }
                }
                layer.openPopup();
              }
            });
          }
        }
      }).addTo(layerGroups.transmission);
    } catch (err) {
      console.error("Failed to load transmission grid:", err);
    }
  }

  let transmissionPromise = null;
  function ensureTransmissionLoaded() {
    if (transmissionPromise) return transmissionPromise;
    transmissionPromise = loadTransmissionGrid();
    return transmissionPromise;
  }

  // Unified Layer Loader & Deferred Preloader Engine
  function ensureLayerLoaded(layerKey) {
    switch (layerKey) {
      case "hq":
        return ensureDistrictHqLoaded();
      case "railways":
        return ensureRailwaysLoaded();
      case "stations":
        return ensureStationsLoaded();
      case "transmission":
        return ensureTransmissionLoaded();
      case "roads":
        return ensureRoadsLoaded();
      default:
        return Promise.resolve();
    }
  }

  function ensureAllDeferredLoaded() {
    ensureDistrictHqLoaded();
    ensureRailwaysLoaded();
    ensureStationsLoaded();
    ensureTransmissionLoaded();
  }

  // Preload deferred layers in idle cycles after critical render path settles
  if ("requestIdleCallback" in window) {
    requestIdleCallback(() => {
      setTimeout(ensureAllDeferredLoaded, 2500);
    });
  } else {
    setTimeout(ensureAllDeferredLoaded, 3000);
  }

  // 7. District Selector & Breadcrumb Navigation Engine
  const breadcrumbDistrict = document.getElementById("breadcrumbDistrict");
  const breadcrumbStateBtn = document.getElementById("breadcrumbStateBtn");
  const districtSelect = document.getElementById("districtSelect");

  function selectDistrict(name, shouldZoom = false) {
    const layer = districtLayers[name];
    if (!layer) return;

    // If this district is already actively selected, handle popup and zoom if requested
    if (activeDistrictLayer === layer) {
      if (shouldZoom) {
        const bounds = layer.getBounds();
        map.fitBounds(bounds, { padding: [55, 55], maxZoom: 12, duration: 1.4 });
      }
      layer.openPopup();
      return;
    }

    if (activeDistrictLayer && activeDistrictLayer !== layer) {
      activeDistrictLayer.setStyle(DEFAULT_DISTRICT_STYLE);
    }

    activeDistrictLayer = layer;
    layer.setStyle(ACTIVE_DISTRICT_STYLE);
    if (typeof layer.bringToFront === "function") {
      layer.bringToFront();
    }

    // Only snap camera with fitBounds if explicitly requested (Dropdown, Search, or Zoom button)
    if (shouldZoom) {
      const bounds = layer.getBounds();
      map.fitBounds(bounds, { padding: [55, 55], maxZoom: 12, duration: 1.4 });
    }

    const p = layer.feature.properties;
    if (breadcrumbDistrict) {
      breadcrumbDistrict.textContent = `${name} (${p.district_gu || ''})`;
    }

    if (districtSelect && districtSelect.value !== name) {
      districtSelect.value = name;
    }

    layer.openPopup();
  }

  // Dynamic Level-of-Detail (LOD) Rendering Engine (Prevents GIS Visual Clutter)
  function applyZoomDependentRendering(zoom) {
    const z = typeof zoom === "number" ? zoom : map.getZoom();

    // 1. Administrative District Boundaries
    if (map.hasLayer(layerGroups.districts)) {
      const dWeight = z <= 7.5 ? 0.8 : (z <= 10 ? 1.0 : 1.4);
      Object.values(districtLayers).forEach(l => {
        if (l !== activeDistrictLayer) {
          l.setStyle({ weight: dWeight });
        }
      });
    }

    // 2. Highway Network (Scale-Dependent Corridor Hierarchy)
    if (map.hasLayer(layerGroups.roads)) {
      highwayLayers.forEach(({ layer, feature }) => {
        const isHighlighted = activeHighlightedCorridor === (feature.properties && feature.properties.corridor);
        if (activeFilteredClass !== "all") {
          const cat = (feature.properties && feature.properties.category) || "national_highway";
          if (cat === activeFilteredClass) {
            layer.setStyle({
              ...getHighwayStyle(feature, isHighlighted, z),
              opacity: 0.85
            });
          } else {
            layer.setStyle({ opacity: 0.08, weight: 0.8 });
          }
        } else {
          layer.setStyle(getHighwayStyle(feature, isHighlighted, z));
        }
      });
    }

    // 3. Railway Stations (LOD Thresholds: Terminals -> Junctions -> Halts)
    if (map.hasLayer(layerGroups.stations)) {
      allStationMarkers.forEach(({ marker, feature }) => {
        marker.setStyle(getStationMarkerStyle(feature, z));
      });
    }

    // 4. Power Plants (Capacity-Scaled Radii & Regional Filtering)
    if (map.hasLayer(layerGroups.power)) {
      allPowerMarkers.forEach(({ marker, feature }) => {
        marker.setStyle(getPowerMarkerStyle(feature, z));
      });
    }
  }

  function resetToStateView() {
    map.closePopup();
    if (activeDistrictLayer) {
      activeDistrictLayer.setStyle(DEFAULT_DISTRICT_STYLE);
      activeDistrictLayer = null;
    }
    clearHighwayHighlight(true);
    if (typeof clearPowerFocus === "function") clearPowerFocus(true);
    if (typeof clearStationFocus === "function") clearStationFocus(true);
    if (typeof selectTransmissionCorridor === "function") selectTransmissionCorridor(null, false);

    // Apply default Overview preset (districts + roads + power)
    applyPreset("overview");

    map.fitBounds([[20.10, 68.10], [24.75, 74.50]], { padding: [30, 30], duration: 1.2 });
    if (breadcrumbDistrict) {
      breadcrumbDistrict.textContent = "All Districts (33)";
    }
    if (districtSelect) {
      districtSelect.value = "";
    }
    if (searchInput) {
      searchInput.value = "";
    }
    applyZoomDependentRendering(map.getZoom());
  }

  // --- Highway Corridor Selection & Inspection Engine (Week 3) ---

  function selectHighwayCorridor(corridorName, zoom = true) {
    if (!corridorName) {
      clearHighwayHighlight(true);
      return;
    }

    // Reset previous corridor highlight
    if (activeHighlightedCorridor && activeHighlightedCorridor !== corridorName) {
      clearHighwayHighlight(false);
    }

    const segments = highwayCorridors[corridorName];
    if (!segments || segments.length === 0) return;

    activeHighlightedCorridor = corridorName;

    // Apply pulsing electric cyan highlight to all segments of this corridor
    const bounds = L.latLngBounds([]);
    segments.forEach(({ layer, feature }) => {
      layer.setStyle(getHighwayStyle(feature, true));
      bounds.extend(layer.getBounds());
    });

    if (zoom && bounds.isValid()) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
    }

    // Sync Telemetry UI
    const firstProps = segments[0].feature.properties || {};
    const telemetryCard = document.getElementById("corridorTelemetry");
    const telemetryName = document.getElementById("telemetryName");
    const telemetryRoute = document.getElementById("telemetryRoute");
    const telemetryLen = document.getElementById("telemetryLen");
    const telemetryAuth = document.getElementById("telemetryAuth") || document.getElementById("telemetrySegs");
    const telemetrySpeed = document.getElementById("telemetrySpeed");
    const corridorBadge = document.getElementById("corridorActiveBadge");
    const corridorSelect = document.getElementById("corridorSelect");

    if (telemetryCard) telemetryCard.classList.remove("hidden");
    if (telemetryName) telemetryName.textContent = corridorName;
    if (telemetryRoute) telemetryRoute.textContent = firstProps.route || firstProps.title || "National Highway Corridor";
    if (telemetryLen) telemetryLen.textContent = `${firstProps.total_length_km || firstProps.corridor_total_km || 0} km`;
    if (telemetryAuth) telemetryAuth.textContent = firstProps.operator ? "NHAI" : "MoRTH";
    if (telemetrySpeed) telemetrySpeed.textContent = `${firstProps.speed_limit_kmh || 80} km/h`;
    if (corridorBadge) corridorBadge.textContent = corridorName;
    if (corridorSelect && corridorSelect.value !== corridorName) corridorSelect.value = corridorName;
  }

  function clearHighwayHighlight(resetSelect = true) {
    if (activeHighlightedCorridor && highwayCorridors[activeHighlightedCorridor]) {
      highwayCorridors[activeHighlightedCorridor].forEach(({ layer, feature }) => {
        layer.setStyle(getHighwayStyle(feature, false, map.getZoom()));
      });
    }
    activeHighlightedCorridor = null;

    const telemetryCard = document.getElementById("corridorTelemetry");
    const corridorBadge = document.getElementById("corridorActiveBadge");
    const corridorSelect = document.getElementById("corridorSelect");

    if (telemetryCard) telemetryCard.classList.add("hidden");
    if (corridorBadge) corridorBadge.textContent = "All Corridors";
    if (resetSelect && corridorSelect) corridorSelect.value = "";
  }

  function filterHighwaysByClass(targetClass) {
    activeFilteredClass = targetClass;
    const currentZoom = map.getZoom();
    highwayLayers.forEach(({ layer, feature }) => {
      const cat = (feature.properties && feature.properties.category) || "national_highway";
      if (targetClass === "all" || cat === targetClass) {
        layer.setStyle({
          ...getHighwayStyle(feature, activeHighlightedCorridor === feature.properties.corridor, currentZoom),
          opacity: 0.85
        });
      } else {
        layer.setStyle({
          opacity: 0.08,
          weight: 0.8
        });
      }
    });
  }

  // Window bridges for popup actions
  window.selectDistrictByName = selectDistrict;
  window.highlightHighwayCorridor = (name) => selectHighwayCorridor(name, false);
  window.zoomToHighwayCorridor = (name) => selectHighwayCorridor(name, true);
  window.focusRailwayStation = focusRailwayStation;
  window.focusPowerPlant = focusPowerPlant;
  window.highlightTransmissionCorridor = (code) => selectTransmissionCorridor(code, false);
  window.zoomToTransmissionCorridor = (code) => selectTransmissionCorridor(code, true);

  function focusPowerPlant(name, zoomTo = false) {
    if (!name || !powerMarkersByName[name]) return;
    const { marker, feature } = powerMarkersByName[name];
    const p = feature.properties || {};

    // 1. Ensure Power Layer is visible on map and toggle checked
    const powerToggle = document.getElementById("layerPower");
    if (!map.hasLayer(layerGroups.power)) {
      map.addLayer(layerGroups.power);
    }
    if (powerToggle && !powerToggle.checked) {
      powerToggle.checked = true;
      updateActiveLayersCount();
    }

    // 2. Open popup and optionally zoom camera smoothly
    const latlng = marker.getLatLng();
    if (zoomTo) {
      map.flyTo([latlng.lat, latlng.lng], 13, { duration: 1.2 });
      setTimeout(() => {
        marker.openPopup();
      }, 450);
    } else {
      marker.openPopup();
    }

    // 3. Update Power Telemetry Card in Control Drawer
    const powerTelemetry = document.getElementById("powerTelemetry");
    const powerTelName = document.getElementById("powerTelName");
    const powerTelCap = document.getElementById("powerTelCap");
    const powerTelOperator = document.getElementById("powerTelOperator");
    const powerTelCat = document.getElementById("powerTelCat");
    const powerTelDist = document.getElementById("powerTelDist");
    const powerTelGreen = document.getElementById("powerTelGreen");
    const powerActiveBadge = document.getElementById("powerActiveBadge");
    const powerSelect = document.getElementById("powerSelect");

    const cap = parseFloat(p.capacity_mw) || 0;
    if (powerTelemetry) powerTelemetry.classList.remove("hidden");
    if (powerTelName) powerTelName.textContent = p.name || "Power Station";
    if (powerTelCap) powerTelCap.textContent = `${cap.toLocaleString()} MW`;
    if (powerTelOperator) powerTelOperator.textContent = `${p.operator || "Utility"} — ${p.fuel || "Fuel"}`;
    if (powerTelCat) powerTelCat.textContent = p.type_label || p.category || "Generation";
    if (powerTelDist) powerTelDist.textContent = p.district || "Gujarat";
    if (powerTelGreen) powerTelGreen.textContent = p.is_renewable ? "100% Clean RE" : "Baseload Grid";
    if (powerActiveBadge) powerActiveBadge.textContent = `${cap.toLocaleString()} MW`;
    if (powerSelect) powerSelect.value = name;
  }

  function clearPowerFocus(resetSelect = true) {
    const powerTelemetry = document.getElementById("powerTelemetry");
    const powerActiveBadge = document.getElementById("powerActiveBadge");
    const powerSelect = document.getElementById("powerSelect");

    if (powerTelemetry) powerTelemetry.classList.add("hidden");
    if (powerActiveBadge) powerActiveBadge.textContent = "31.9 GW Monitored";
    if (resetSelect && powerSelect) powerSelect.value = "";

    // Reset styles on all power markers according to active filter
    allPowerMarkers.forEach(({ marker, feature }) => {
      marker.setStyle(getPowerMarkerStyle(feature, map.getZoom()));
    });
  }

  function filterPowerByCategory(category) {
    activePowerFilter = category;

    // Ensure power layer is active so user sees filtered assets
    const powerToggle = document.getElementById("layerPower");
    if (!map.hasLayer(layerGroups.power)) {
      map.addLayer(layerGroups.power);
    }
    if (powerToggle && !powerToggle.checked) {
      powerToggle.checked = true;
      updateActiveLayersCount();
    }

    const matchingBounds = L.latLngBounds([]);
    allPowerMarkers.forEach(({ marker, feature }) => {
      marker.setStyle(getPowerMarkerStyle(feature, map.getZoom()));
      const p = feature.properties || {};
      const cat = (p.category || "thermal").toLowerCase();
      if (category === "all" || cat === category) {
        matchingBounds.extend(marker.getLatLng());
      }
    });

    const powerActiveBadge = document.getElementById("powerActiveBadge");
    if (powerActiveBadge) {
      if (category === "all") powerActiveBadge.textContent = "31.9 GW Monitored";
      else powerActiveBadge.textContent = `${category.toUpperCase()} Plants`;
    }

    if (category !== "all" && matchingBounds.isValid()) {
      map.fitBounds(matchingBounds, { padding: [50, 50], maxZoom: 11 });
    }
  }

  function selectTransmissionCorridor(corridorCode, zoomTo = true) {
    // Reset previously highlighted transmission line
    if (activeHighlightedTransmission && transmissionCorridorsByCode[activeHighlightedTransmission]) {
      const prev = transmissionCorridorsByCode[activeHighlightedTransmission];
      const prevV = prev.feature.properties.voltage_kv || 400;
      prev.layer.setStyle({
        color: prevV === 765 ? "#c084fc" : "#38bdf8",
        weight: prevV === 765 ? 3.2 : 2.0,
        dashArray: prevV === 765 ? null : "5, 4",
        opacity: prevV === 765 ? 0.95 : 0.85
      });
    }

    if (!corridorCode || !transmissionCorridorsByCode[corridorCode]) {
      activeHighlightedTransmission = null;
      return;
    }

    // Ensure transmission layer is enabled
    const transToggle = document.getElementById("layerTransmission");
    if (!map.hasLayer(layerGroups.transmission)) {
      map.addLayer(layerGroups.transmission);
    }
    if (transToggle && !transToggle.checked) {
      transToggle.checked = true;
      updateActiveLayersCount();
    }

    const { layer, feature } = transmissionCorridorsByCode[corridorCode];
    layer.setStyle({ color: "#00f0ff", weight: 5.2, opacity: 1.0 });
    activeHighlightedTransmission = corridorCode;

    if (zoomTo) {
      map.fitBounds(layer.getBounds(), { padding: [60, 60], maxZoom: 12 });
    }

    setTimeout(() => {
      layer.openPopup();
    }, 400);

    const transSelect = document.getElementById("transmissionSelect");
    if (transSelect) transSelect.value = corridorCode;
  }

  function focusRailwayStation(code, zoomTo = false) {
    if (!code || !stationMarkersByCode[code]) return;
    const { marker, feature } = stationMarkersByCode[code];
    const p = feature.properties || {};

    // 1. Ensure Station Layer is visible on map and checkbox checked
    const stationToggle = document.getElementById("layerStations");
    if (!map.hasLayer(layerGroups.stations)) {
      map.addLayer(layerGroups.stations);
    }
    if (stationToggle && !stationToggle.checked) {
      stationToggle.checked = true;
      updateActiveLayersCount();
    }

    // 2. Open popup and optionally zoom camera smoothly
    const latlng = marker.getLatLng();
    if (zoomTo) {
      map.flyTo([latlng.lat, latlng.lng], 14, { duration: 1.2 });
      setTimeout(() => {
        marker.openPopup();
      }, 450);
    } else {
      marker.openPopup();
    }

    // 3. Update Station Telemetry Card in Control Drawer
    const stationTelemetry = document.getElementById("stationTelemetry");
    const stationTelName = document.getElementById("stationTelName");
    const stationTelCode = document.getElementById("stationTelCode");
    const stationTelDivision = document.getElementById("stationTelDivision");
    const stationTelClass = document.getElementById("stationTelClass");
    const stationTelZone = document.getElementById("stationTelZone");
    const stationActiveBadge = document.getElementById("stationActiveBadge");
    const stationSelect = document.getElementById("stationSelect");

    if (stationTelemetry) stationTelemetry.classList.remove("hidden");
    if (stationTelName) stationTelName.textContent = p.name || "Station";
    if (stationTelCode) stationTelCode.textContent = code;
    if (stationTelDivision) stationTelDivision.textContent = `${p.zone || "Western Railway"} — ${p.division || "Division"}`;
    if (stationTelClass) stationTelClass.textContent = p.class_label || "Passenger Station";
    if (stationTelZone) stationTelZone.textContent = p.division_code || "WR";
    if (stationActiveBadge) stationActiveBadge.textContent = code;
    if (stationSelect) stationSelect.value = code;
  }

  function clearStationFocus(resetSelect = true) {
    const stationTelemetry = document.getElementById("stationTelemetry");
    const stationActiveBadge = document.getElementById("stationActiveBadge");
    const stationSelect = document.getElementById("stationSelect");

    if (stationTelemetry) stationTelemetry.classList.add("hidden");
    if (stationActiveBadge) stationActiveBadge.textContent = "Western Railway";
    if (resetSelect && stationSelect) stationSelect.value = "";

    // Reset styles on all stations according to zoom and activeDivisionFilter
    const z = map.getZoom();
    allStationMarkers.forEach(({ marker, feature }) => {
      marker.setStyle(getStationMarkerStyle(feature, z));
    });
  }

  function filterStationsByDivision(divCode) {
    activeDivisionFilter = divCode;

    // Ensure stations layer is active so user sees the filtered results
    const stationToggle = document.getElementById("layerStations");
    if (!map.hasLayer(layerGroups.stations)) {
      map.addLayer(layerGroups.stations);
    }
    if (stationToggle && !stationToggle.checked) {
      stationToggle.checked = true;
      updateActiveLayersCount();
    }

    const z = map.getZoom();
    const matchingBounds = L.latLngBounds([]);

    allStationMarkers.forEach(({ marker, feature }) => {
      const style = getStationMarkerStyle(feature, z);
      marker.setStyle(style);
      if (getStationVisibility(feature, z)) {
        matchingBounds.extend(marker.getLatLng());
      }
    });

    const stationActiveBadge = document.getElementById("stationActiveBadge");
    if (stationActiveBadge) {
      if (divCode === "all") stationActiveBadge.textContent = "Western Railway";
      else if (divCode === "major") stationActiveBadge.textContent = "Major Junctions";
      else stationActiveBadge.textContent = `${divCode} Division`;
    }

    // If a specific division was selected and has valid bounds, smoothly zoom to encompass its stations
    if (divCode !== "all" && matchingBounds.isValid()) {
      map.fitBounds(matchingBounds, { padding: [50, 50], maxZoom: 11 });
    }
  }

  if (districtSelect) {
    districtSelect.addEventListener("change", (e) => {
      const distName = e.target.value;
      if (distName) {
        selectDistrict(distName, true);
      } else {
        resetToStateView();
      }
    });
  }

  if (breadcrumbStateBtn) {
    breadcrumbStateBtn.addEventListener("click", resetToStateView);
  }

  // Highway Corridor Controls
  const corridorSelect = document.getElementById("corridorSelect");
  if (corridorSelect) {
    corridorSelect.addEventListener("change", (e) => {
      selectHighwayCorridor(e.target.value, true);
    });
  }

  const clearCorridorBtn = document.getElementById("clearCorridorBtn");
  if (clearCorridorBtn) {
    clearCorridorBtn.addEventListener("click", () => clearHighwayHighlight(true));
  }

  const corridorPills = document.querySelectorAll("#corridorFilterPills .c-pill");
  corridorPills.forEach(pill => {
    pill.addEventListener("click", () => {
      corridorPills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      const targetClass = pill.getAttribute("data-class");
      filterHighwaysByClass(targetClass);
    });
  });

  // Railway Station Controls
  const stationSelect = document.getElementById("stationSelect");
  if (stationSelect) {
    stationSelect.addEventListener("change", (e) => {
      if (e.target.value) {
        focusRailwayStation(e.target.value, true);
      } else {
        clearStationFocus(false);
      }
    });
  }

  const clearStationBtn = document.getElementById("clearStationBtn");
  if (clearStationBtn) {
    clearStationBtn.addEventListener("click", () => clearStationFocus(true));
  }

  const stationPills = document.querySelectorAll("#stationFilterPills .r-pill");
  stationPills.forEach(pill => {
    pill.addEventListener("click", () => {
      stationPills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      const targetDiv = pill.getAttribute("data-div");
      filterStationsByDivision(targetDiv);
    });
  });

  // Power Generation & Transmission Controls (Week 5)
  const powerSelect = document.getElementById("powerSelect");
  if (powerSelect) {
    powerSelect.addEventListener("change", (e) => {
      if (e.target.value) {
        focusPowerPlant(e.target.value, true);
      } else {
        clearPowerFocus(false);
      }
    });
  }

  const clearPowerBtn = document.getElementById("clearPowerBtn");
  if (clearPowerBtn) {
    clearPowerBtn.addEventListener("click", () => clearPowerFocus(true));
  }

  const powerPills = document.querySelectorAll("#powerFilterPills .p-pill");
  powerPills.forEach(pill => {
    pill.addEventListener("click", () => {
      powerPills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      const targetCat = pill.getAttribute("data-cat");
      filterPowerByCategory(targetCat);
    });
  });

  const transmissionSelect = document.getElementById("transmissionSelect");
  if (transmissionSelect) {
    transmissionSelect.addEventListener("change", (e) => {
      if (e.target.value) {
        selectTransmissionCorridor(e.target.value, true);
      } else {
        selectTransmissionCorridor(null, false);
      }
    });
  }

  // 8. Universal Smart Search & Spatial Navigation Engine (Week 7 Production Architecture)
  const searchInput = document.getElementById("universalSearch");
  const searchResults = document.getElementById("searchResults");
  const clearSearchBtn = document.getElementById("clearSearchBtn");

  let currentSearchMatches = [];
  let activeSearchSelectionIdx = -1;

  // Debounce utility to eliminate UI thread jitter during rapid typing
  function debounce(fn, waitMs) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(this, args), waitMs);
    };
  }

  // Safe regex escape helper
  function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  // Text match highlighter wrapping query tokens in high-contrast span
  function highlightQueryMatches(text, tokens) {
    if (!text || !tokens || tokens.length === 0) return text || "";
    let highlighted = text;
    // Sort tokens longest first to avoid partial replacements
    const sortedTokens = [...tokens].sort((a, b) => b.length - a.length);
    sortedTokens.forEach(t => {
      if (t.length >= 2) {
        const regex = new RegExp(`(${escapeRegExp(t)})`, "gi");
        highlighted = highlighted.replace(regex, '<mark class="search-highlight">$1</mark>');
      }
    });
    return highlighted;
  }

  // Multi-Token Ranking & Fuzzy Matcher Engine
  function searchInfrastructure(query) {
    const raw = query.trim().toLowerCase();
    if (raw.length < 2) return [];

    const tokens = raw.split(/\s+/).filter(t => t.length > 0);

    const scored = [];
    for (let i = 0; i < searchIndex.length; i++) {
      const item = searchIndex[i];
      const titleLower = item.title.toLowerCase();
      const termsLower = item.searchTerms || titleLower;
      let score = 0;

      // 1. Exact Code or Identifier Match (Highest Confidence)
      if (item.stationCode && item.stationCode.toLowerCase() === raw) score += 2500;
      if (item.corridorName && item.corridorName.toLowerCase() === raw) score += 2200;
      if (item.transmissionCode && item.transmissionCode.toLowerCase() === raw) score += 2200;

      // 2. Exact Title Prefix or Boundary Match
      if (titleLower.startsWith(raw)) score += 1000;
      else if (titleLower.includes(` ${raw}`)) score += 600;

      // 3. Exact Contiguous Phrase Match in Title or Search Terms
      if (titleLower.includes(raw)) score += 400;
      else if (termsLower.includes(raw)) score += 250;

      // 4. Tokenized Multi-Term Matching
      let tokenMatches = 0;
      for (const t of tokens) {
        if (titleLower.includes(t)) {
          tokenMatches++;
          score += 150;
        } else if (termsLower.includes(t)) {
          tokenMatches++;
          score += 80;
        }
      }

      // If multiple tokens were typed, require at least one token match
      if (tokens.length > 1 && tokenMatches === 0 && score === 0) continue;
      if (score === 0) continue;

      // 5. Add Base Infrastructure Priority (Mega-plants, Expressways, Terminals ranked higher)
      score += (item.priority || 50);

      scored.push({ item, score });
    }

    // Sort descending by calculated relevance score
    scored.sort((a, b) => b.score - a.score);

    // Return top 8 most relevant matches
    return scored.slice(0, 8).map(s => s.item);
  }

  // Spatial Navigation Execution Engine (Guarantees Layer Activation + Smooth Camera Focus)
  function executeSpatialNavigation(item) {
    if (!item) return;

    // 1. Guaranteed Underlying Layer Activation
    if (item.layerKey && layerGroups[item.layerKey]) {
      const targetGroup = layerGroups[item.layerKey];
      if (!map.hasLayer(targetGroup)) {
        map.addLayer(targetGroup);
      }
      const toggleObj = layerToggles.find(t => t.key === item.layerKey);
      if (toggleObj) {
        const chk = document.getElementById(toggleObj.id);
        if (chk && !chk.checked) {
          chk.checked = true;
        }
      }
      updateActiveLayersCount();
      checkCurrentPresetMatch();
      if (typeof applyZoomDependentRendering === "function") {
        applyZoomDependentRendering(map.getZoom());
      }
    }

    // 2. Specific Asset Navigation & Telemetry Synchronization
    if (item.districtName && item.type === "district") {
      selectDistrict(item.districtName, true);
    } else if (item.corridorName) {
      selectHighwayCorridor(item.corridorName, true);
    } else if (item.stationCode) {
      focusRailwayStation(item.stationCode, true);
    } else if (item.powerName) {
      focusPowerPlant(item.powerName, true);
    } else if (item.transmissionCode) {
      selectTransmissionCorridor(item.transmissionCode, true);
    } else if (item.railwayName) {
      if (item.bounds) {
        map.fitBounds(item.bounds, { padding: [55, 55], maxZoom: 13, duration: 1.2 });
      }
      if (item.layer && item.layer.openPopup) {
        setTimeout(() => item.layer.openPopup(), 450);
      }
    } else if (item.bounds) {
      map.fitBounds(item.bounds, { padding: [55, 55], maxZoom: 12, duration: 1.2 });
      if (item.layer && item.layer.openPopup) {
        setTimeout(() => item.layer.openPopup(), 450);
      }
    } else if (item.latlng) {
      map.flyTo(item.latlng, 13.5, { duration: 1.2 });
      if (item.layer && item.layer.openPopup) {
        setTimeout(() => item.layer.openPopup(), 450);
      }
    }

    // 3. UI Cleanup
    if (searchInput) {
      searchInput.value = item.title;
      if (clearSearchBtn) clearSearchBtn.classList.remove("hidden");
    }
    if (searchResults) {
      searchResults.classList.add("hidden");
    }
    currentSearchMatches = [];
    activeSearchSelectionIdx = -1;
  }

  // Render Search Results into Glassmorphic Dropdown
  function renderSearchResults(matches, rawQuery, tokens) {
    if (!searchResults) return;

    currentSearchMatches = matches;
    activeSearchSelectionIdx = -1;

    if (matches.length === 0) {
      searchResults.innerHTML = `
        <div class="search-empty-state">
          <div class="search-empty-title">No infrastructure assets matching "<strong>${rawQuery}</strong>"</div>
          <div class="search-suggestions-label">Try searching:</div>
          <div class="search-suggestions-grid">
            <button class="search-suggestion-pill" data-query="NH 48">NH 48</button>
            <button class="search-suggestion-pill" data-query="NE-1">NE-1 Expressway</button>
            <button class="search-suggestion-pill" data-query="Mundra">Mundra TPS</button>
            <button class="search-suggestion-pill" data-query="ADI">ADI (Ahmedabad)</button>
            <button class="search-suggestion-pill" data-query="Khavda">Khavda Solar</button>
            <button class="search-suggestion-pill" data-query="Lakadia">765 kV Lakadia</button>
            <button class="search-suggestion-pill" data-query="Kakrapar">Kakrapar Nuclear</button>
            <button class="search-suggestion-pill" data-query="Kutch">Kutch District</button>
          </div>
        </div>
      `;
      searchResults.classList.remove("hidden");

      // Wire suggestion pill clicks
      searchResults.querySelectorAll(".search-suggestion-pill").forEach(pill => {
        pill.addEventListener("click", (e) => {
          e.stopPropagation();
          const q = pill.getAttribute("data-query");
          if (searchInput) {
            searchInput.value = q;
            triggerSearch(q);
          }
        });
      });
      return;
    }

    searchResults.innerHTML = matches.map((m, idx) => `
      <div class="search-result-item" data-index="${idx}" role="option" aria-selected="false">
        <span class="result-icon">${m.icon || "📍"}</span>
        <div class="result-text-col">
          <span class="result-title">${highlightQueryMatches(m.title, tokens)}</span>
          <span class="result-subtitle">${m.subtitle || m.type}</span>
        </div>
        <span class="result-type-tag ${m.badgeClass || 'tag-' + m.type}">${m.category}</span>
      </div>
    `).join("");

    searchResults.classList.remove("hidden");

    // Add click listeners to items
    searchResults.querySelectorAll(".search-result-item").forEach((el, idx) => {
      el.addEventListener("click", () => {
        executeSpatialNavigation(matches[idx]);
      });
      el.addEventListener("mouseenter", () => {
        updateActiveSearchVisual(idx);
      });
    });
  }

  // Update visual selection highlight in dropdown
  function updateActiveSearchVisual(newIdx) {
    activeSearchSelectionIdx = newIdx;
    const items = searchResults.querySelectorAll(".search-result-item");
    items.forEach((itemEl, idx) => {
      const isSelected = idx === activeSearchSelectionIdx;
      itemEl.classList.toggle("active-selection", isSelected);
      itemEl.setAttribute("aria-selected", isSelected ? "true" : "false");
      if (isSelected) {
        itemEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    });
  }

  // Primary Search Execution Controller
  function triggerSearch(query) {
    const raw = (query || "").trim();
    if (clearSearchBtn) {
      clearSearchBtn.classList.toggle("hidden", raw.length === 0);
    }

    if (raw.length < 2) {
      if (searchResults) {
        searchResults.classList.add("hidden");
        searchResults.innerHTML = "";
      }
      currentSearchMatches = [];
      activeSearchSelectionIdx = -1;
      return;
    }

    const tokens = raw.toLowerCase().split(/\s+/).filter(t => t.length > 0);
    const matches = searchInfrastructure(raw);
    renderSearchResults(matches, raw, tokens);
  }

  const debouncedSearch = debounce((q) => triggerSearch(q), 120);

  // Search Input Event Listeners
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      debouncedSearch(e.target.value);
    });

    searchInput.addEventListener("focus", (e) => {
      ensureAllDeferredLoaded();
      if (e.target.value.trim().length >= 2) {
        triggerSearch(e.target.value);
      }
    });

    // Keyboard Arrow Navigation & Enter Selection inside search input
    searchInput.addEventListener("keydown", (e) => {
      if (searchResults && !searchResults.classList.contains("hidden") && currentSearchMatches.length > 0) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          const nextIdx = (activeSearchSelectionIdx + 1) % currentSearchMatches.length;
          updateActiveSearchVisual(nextIdx);
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          const prevIdx = (activeSearchSelectionIdx - 1 + currentSearchMatches.length) % currentSearchMatches.length;
          updateActiveSearchVisual(prevIdx);
        } else if (e.key === "Enter") {
          e.preventDefault();
          const selectedItem = activeSearchSelectionIdx >= 0 ? currentSearchMatches[activeSearchSelectionIdx] : currentSearchMatches[0];
          if (selectedItem) {
            executeSpatialNavigation(selectedItem);
          }
        } else if (e.key === "Escape") {
          e.preventDefault();
          searchResults.classList.add("hidden");
          searchInput.blur();
        }
      }
    });
  }

  // Clear Search Button Listener
  if (clearSearchBtn) {
    clearSearchBtn.addEventListener("click", () => {
      if (searchInput) {
        searchInput.value = "";
        searchInput.focus();
      }
      if (searchResults) {
        searchResults.classList.add("hidden");
        searchResults.innerHTML = "";
      }
      clearSearchBtn.classList.add("hidden");
      currentSearchMatches = [];
      activeSearchSelectionIdx = -1;
    });
  }

  // Dismiss dropdown on outside clicks
  document.addEventListener("click", (e) => {
    if (searchInput && searchResults && !searchInput.contains(e.target) && !searchResults.contains(e.target)) {
      searchResults.classList.add("hidden");
    }
  });

  // 9. Reset View Action
  document.getElementById("resetViewBtn").addEventListener("click", resetToStateView);

  // 10. Mouse Coordinates & HUD Tracking
  const hudCoords = document.getElementById("hudCoords");
  const hudZoom = document.getElementById("hudZoom");

  let hudRafPending = false;
  map.on("mousemove", (e) => {
    if (hudRafPending) return;
    hudRafPending = true;
    requestAnimationFrame(() => {
      const lat = e.latlng.lat.toFixed(4);
      const lng = e.latlng.lng.toFixed(4);
      if (hudCoords) hudCoords.textContent = `${lat}° N, ${lng}° E`;
      hudRafPending = false;
    });
  });

  map.on("zoomend", () => {
    hudZoom.textContent = map.getZoom().toFixed(1);
    applyZoomDependentRendering(map.getZoom());
  });

  // 11. Technical Specifications Modal Dialog
  const modal = document.getElementById("aboutModal");
  document.getElementById("aboutBtn").addEventListener("click", () => modal.showModal());
  document.getElementById("closeModalBtn").addEventListener("click", () => modal.close());
  document.getElementById("modalDismissBtn").addEventListener("click", () => modal.close());
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.close();
  });

  // 12. Free API Key Storage & Live Reload
  const apiKeyInput = document.getElementById("customApiKeyInput");
  const saveApiKeyBtn = document.getElementById("saveApiKeyBtn");
  const apiKeyStatus = document.getElementById("apiKeyStatus");

  if (apiKeyInput) {
    apiKeyInput.value = localStorage.getItem("inframap_api_key") || "";
  }

  if (saveApiKeyBtn) {
    saveApiKeyBtn.addEventListener("click", () => {
      const val = (apiKeyInput.value || "").trim();
      if (val) {
        localStorage.setItem("inframap_api_key", val);
        if (apiKeyStatus) apiKeyStatus.textContent = "✓ Key saved! Reloading custom basemap...";
      } else {
        localStorage.removeItem("inframap_api_key");
        if (apiKeyStatus) apiKeyStatus.textContent = "Key cleared. Using free open basemaps.";
      }
      setTimeout(() => {
        location.reload();
      }, 600);
    });
  }

  // 13. Responsive Layer Control Drawer Toggle (Week 6 UI/UX Polish)
  const layerDrawer = document.getElementById("layerDrawer");
  const toggleDrawerBtn = document.getElementById("toggleDrawerBtn");
  const collapseDrawerBtn = document.getElementById("collapseDrawerBtn");
  const floatingDrawerBtn = document.getElementById("floatingDrawerBtn");

  function setDrawerCollapsed(collapsed) {
    if (!layerDrawer) return;
    if (collapsed) {
      layerDrawer.classList.add("drawer-collapsed");
      if (floatingDrawerBtn) floatingDrawerBtn.classList.add("visible");
      if (toggleDrawerBtn) toggleDrawerBtn.classList.remove("active");
    } else {
      layerDrawer.classList.remove("drawer-collapsed");
      if (floatingDrawerBtn) floatingDrawerBtn.classList.remove("visible");
      if (toggleDrawerBtn) toggleDrawerBtn.classList.add("active");
    }
  }

  function toggleDrawer() {
    if (!layerDrawer) return;
    const isCollapsed = layerDrawer.classList.contains("drawer-collapsed");
    setDrawerCollapsed(!isCollapsed);
  }

  if (toggleDrawerBtn) {
    toggleDrawerBtn.addEventListener("click", toggleDrawer);
  }
  if (collapseDrawerBtn) {
    collapseDrawerBtn.addEventListener("click", () => setDrawerCollapsed(true));
  }
  if (floatingDrawerBtn) {
    floatingDrawerBtn.addEventListener("click", () => setDrawerCollapsed(false));
  }

  // ==========================================================================
  // 15. Dynamic User Feedback Toast Engine (Week 9 UI/UX Polish)
  // ==========================================================================
  const appToast = document.getElementById("appToast");
  let toastTimer = null;

  function showToast(message, duration = 3500) {
    if (!appToast) return;
    appToast.textContent = message;
    appToast.classList.remove("hidden");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      appToast.classList.add("hidden");
    }, duration);
  }

  // ==========================================================================
  // 16. Week 9 Stretch Tool A: Interactive Geodesic Distance Measurement Engine
  // ==========================================================================
  const measureToolBtn = document.getElementById("measureToolBtn");
  const measureHud = document.getElementById("measureHud");
  const measureModeStatus = document.getElementById("measureModeStatus");
  const measureTotalDisplay = document.getElementById("measureTotalDisplay");
  const measureSegmentDisplay = document.getElementById("measureSegmentDisplay");
  const measurePointsDisplay = document.getElementById("measurePointsDisplay");
  const measureFinishBtn = document.getElementById("measureFinishBtn");
  const measureClearBtn = document.getElementById("measureClearBtn");
  const measureDoneBtn = document.getElementById("measureDoneBtn");
  const measureExitBtn = document.getElementById("measureExitBtn");

  let isMeasuring = false;
  let measurePoints = [];
  let totalMeasureDistance = 0;
  let measurePolyline = null;
  let rubberbandLine = null;
  let measureMarkers = [];
  let measureCompleted = false;

  // Measurement graphics pane (Ensures measurement line and badges sit above all infrastructure)
  map.createPane("measurePane").style.zIndex = 650;
  const measureLayerGroup = L.layerGroup().addTo(map);

  function formatDist(meters) {
    if (meters < 1000) {
      return `${Math.round(meters)} m`;
    }
    return `${(meters / 1000).toFixed(2)} km`;
  }

  function updateMeasureHud() {
    if (measureTotalDisplay) measureTotalDisplay.textContent = formatDist(totalMeasureDistance);
    if (measurePointsDisplay) measurePointsDisplay.textContent = measurePoints.length.toString();
    if (measureFinishBtn) measureFinishBtn.disabled = measurePoints.length < 2;
  }

  function startMeasurement() {
    isMeasuring = true;
    measureCompleted = false;
    if (measureToolBtn) measureToolBtn.classList.add("active");
    if (measureHud) measureHud.classList.remove("hidden");
    map.getContainer().classList.add("measuring-active");
    map.doubleClickZoom.disable();
    if (measureModeStatus) measureModeStatus.textContent = "Click map to place Point 1";
    showToast("📏 Measurement Active: Click map to place waypoints across infrastructure.");
  }

  function finishMeasurement() {
    if (measurePoints.length < 2) return;
    measureCompleted = true;
    if (rubberbandLine) {
      measureLayerGroup.removeLayer(rubberbandLine);
      rubberbandLine = null;
    }
    if (measurePolyline) {
      measurePolyline.setStyle({ color: "#00f0ff", weight: 4.5, dashArray: null });
      const lastPt = measurePoints[measurePoints.length - 1];
      L.popup({ className: "measure-summary-popup", offset: [0, -10] })
        .setLatLng(lastPt)
        .setContent(`
          <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.80rem; color: #f8fafc; padding: 4px 6px;">
            <div style="color: #00f0ff; font-weight: 700; margin-bottom: 3px;">📐 Measured Infrastructure Path</div>
            <div>Total Geodesic Distance: <strong style="color: #38bdf8;">${formatDist(totalMeasureDistance)}</strong></div>
            <div style="color: #94a3b8; font-size: 0.72rem; margin-top: 3px;">${measurePoints.length} Waypoints • ${measurePoints.length - 1} Segment(s)</div>
          </div>
        `)
        .openOn(map);
    }
    if (measureModeStatus) measureModeStatus.textContent = `✓ Path Complete (${formatDist(totalMeasureDistance)})`;
    showToast(`✓ Measured Path: ${formatDist(totalMeasureDistance)} total distance.`);
  }

  function clearMeasurement() {
    measurePoints = [];
    totalMeasureDistance = 0;
    measureCompleted = false;
    measureLayerGroup.clearLayers();
    measurePolyline = null;
    rubberbandLine = null;
    measureMarkers = [];
    if (measureSegmentDisplay) measureSegmentDisplay.textContent = "0.00 km";
    if (measureTotalDisplay) measureTotalDisplay.textContent = "0.00 km";
    if (measurePointsDisplay) measurePointsDisplay.textContent = "0";
    if (measureModeStatus) measureModeStatus.textContent = "Click map to place Point 1";
    if (measureFinishBtn) measureFinishBtn.disabled = true;
  }

  function exitMeasurement() {
    isMeasuring = false;
    clearMeasurement();
    if (measureToolBtn) measureToolBtn.classList.remove("active");
    if (measureHud) measureHud.classList.add("hidden");
    map.getContainer().classList.remove("measuring-active");
    map.doubleClickZoom.enable();
    map.closePopup();
  }

  function toggleMeasurement() {
    if (isMeasuring) {
      exitMeasurement();
    } else {
      startMeasurement();
    }
  }

  // Map click listener for placing measurement waypoints
  map.on("click", (e) => {
    if (!isMeasuring || measureCompleted) return;

    const latlng = e.latlng;
    measurePoints.push(latlng);

    if (measurePoints.length === 1) {
      // First point (Start node)
      const marker = L.circleMarker(latlng, {
        pane: "measurePane",
        radius: 6.5,
        fillColor: "#00f0ff",
        color: "#ffffff",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.95
      }).addTo(measureLayerGroup);
      marker.bindTooltip("Start Node (0.00 km)", {
        permanent: true,
        direction: "top",
        className: "measure-marker-tooltip",
        offset: [0, -8]
      });
      measureMarkers.push(marker);

      if (measureModeStatus) measureModeStatus.textContent = "Click map to place Point 2";
      updateMeasureHud();
    } else {
      // Subsequent point
      const prevPt = measurePoints[measurePoints.length - 2];
      const segDist = prevPt.distanceTo(latlng);
      totalMeasureDistance += segDist;

      if (!measurePolyline) {
        measurePolyline = L.polyline(measurePoints, {
          pane: "measurePane",
          color: "#00f0ff",
          weight: 3.5,
          opacity: 0.95,
          dashArray: "6, 6"
        }).addTo(measureLayerGroup);
      } else {
        measurePolyline.setLatLngs(measurePoints);
      }

      const marker = L.circleMarker(latlng, {
        pane: "measurePane",
        radius: 5.5,
        fillColor: "#38bdf8",
        color: "#ffffff",
        weight: 1.8,
        opacity: 1,
        fillOpacity: 0.95
      }).addTo(measureLayerGroup);
      marker.bindTooltip(`+${formatDist(segDist)} (${formatDist(totalMeasureDistance)})`, {
        permanent: true,
        direction: "top",
        className: "measure-marker-tooltip",
        offset: [0, -8]
      });
      measureMarkers.push(marker);

      if (measureSegmentDisplay) measureSegmentDisplay.textContent = formatDist(segDist);
      if (measureModeStatus) measureModeStatus.textContent = `Point ${measurePoints.length} added. Click next or Complete.`;
      updateMeasureHud();
    }
  });

  // Map mousemove listener for live rubberband distance preview
  map.on("mousemove", (e) => {
    if (!isMeasuring || measureCompleted || measurePoints.length === 0) return;

    const lastPt = measurePoints[measurePoints.length - 1];
    const hoverDist = lastPt.distanceTo(e.latlng);

    if (!rubberbandLine) {
      rubberbandLine = L.polyline([lastPt, e.latlng], {
        pane: "measurePane",
        color: "#38bdf8",
        weight: 2.2,
        dashArray: "4, 6",
        opacity: 0.75
      }).addTo(measureLayerGroup);
    } else {
      rubberbandLine.setLatLngs([lastPt, e.latlng]);
    }

    if (measureSegmentDisplay) measureSegmentDisplay.textContent = formatDist(hoverDist);
  });

  if (measureToolBtn) measureToolBtn.addEventListener("click", toggleMeasurement);
  if (measureFinishBtn) measureFinishBtn.addEventListener("click", finishMeasurement);
  if (measureClearBtn) measureClearBtn.addEventListener("click", clearMeasurement);
  if (measureDoneBtn) measureDoneBtn.addEventListener("click", exitMeasurement);
  if (measureExitBtn) measureExitBtn.addEventListener("click", exitMeasurement);

  // ==========================================================================
  // 17. Week 9 Stretch Tool B: One-Click High-Resolution PNG Map Exporter
  // ==========================================================================
  const exportMapBtn = document.getElementById("exportMapBtn");

  async function exportMapToPng() {
    showToast("📸 Generating high-resolution PNG map snapshot...", 5000);

    try {
      const mapEl = document.getElementById("map");
      if (!mapEl) throw new Error("Map viewport container not found");

      // Temporarily hide measure HUD if visible to capture clean cartographic map
      const hudWasVisible = measureHud && !measureHud.classList.contains("hidden");
      if (hudWasVisible) measureHud.classList.add("hidden");

      let mapCanvas;
      if (typeof html2canvas === "function") {
        mapCanvas = await html2canvas(mapEl, {
          useCORS: true,
          allowTaint: false,
          scale: 2, // 2x High-DPI Retina resolution
          logging: false,
          ignoreElements: (el) => el.classList && (el.classList.contains("leaflet-control-zoom") || el.classList.contains("measure-hud"))
        });
      } else {
        throw new Error("html2canvas library unavailable");
      }

      if (hudWasVisible) measureHud.classList.remove("hidden");

      // Composite professional cartographic title banner and spatial metadata bar
      const width = mapCanvas.width;
      const height = mapCanvas.height;
      const bannerHeight = 85;
      const footerHeight = 45;

      const outputCanvas = document.createElement("canvas");
      outputCanvas.width = width;
      outputCanvas.height = height + bannerHeight + footerHeight;
      const ctx = outputCanvas.getContext("2d");

      // 1. Top Cartographic Header Banner
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, width, bannerHeight);

      // Top cyan accent line
      ctx.fillStyle = "#0284c7";
      ctx.fillRect(0, 0, width, 5);

      // Header Title
      ctx.font = "bold 24px 'Plus Jakarta Sans', sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.fillText("GUJARAT INFRAMAP — DIGITAL INFRASTRUCTURE TWIN", 24, 38);

      // Header Subtitle
      ctx.font = "14px 'Plus Jakarta Sans', sans-serif";
      ctx.fillStyle = "#94a3b8";
      ctx.fillText("Statewide Geospatial Infrastructure Observatory • EPSG:4326 (WGS 84 Projection)", 24, 62);

      // Header Right Metadata
      ctx.font = "12px 'JetBrains Mono', monospace";
      ctx.fillStyle = "#38bdf8";
      const now = new Date();
      const timeStr = now.toLocaleDateString() + " " + now.toLocaleTimeString();
      const rightText = `Exported: ${timeStr} • Scale: 1:500,000`;
      const rightTextWidth = ctx.measureText(rightText).width;
      ctx.fillText(rightText, width - rightTextWidth - 24, 48);

      // 2. Draw Captured Map Canvas in Center
      ctx.drawImage(mapCanvas, 0, bannerHeight);

      // 3. Bottom Spatial Metadata Footer Bar
      ctx.fillStyle = "#090d16";
      ctx.fillRect(0, height + bannerHeight, width, footerHeight);

      // Footer divider
      ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
      ctx.fillRect(0, height + bannerHeight, width, 1);

      // Footer Spatial Extent Coordinates
      const bounds = map.getBounds();
      const sw = bounds.getSouthWest();
      const ne = bounds.getNorthEast();
      ctx.font = "11px 'JetBrains Mono', monospace";
      ctx.fillStyle = "#64748b";
      ctx.fillText(`Spatial Extent: [${sw.lat.toFixed(3)}°N, ${sw.lng.toFixed(3)}°E] to [${ne.lat.toFixed(3)}°N, ${ne.lng.toFixed(3)}°E] • Zoom: ${map.getZoom()}`, 24, height + bannerHeight + 28);

      // Footer Right Sources
      const srcText = "Authoritative Sources: Survey of India • MoRTH • CEA • GETCO • Western Railway";
      const srcWidth = ctx.measureText(srcText).width;
      ctx.fillText(srcText, width - srcWidth - 24, height + bannerHeight + 28);

      // Convert to PNG and trigger browser download
      const dataUrl = outputCanvas.toDataURL("image/png");
      const a = document.createElement("a");
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
      a.download = `gujarat-inframap-${timestamp}.png`;
      a.href = dataUrl;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      showToast("✓ High-Resolution Map PNG exported successfully!");
    } catch (err) {
      console.error("Map export error:", err);
      showToast("⚠️ Export failed: " + (err.message || "Unknown error"), 4000);
    }
  }

  if (exportMapBtn) {
    exportMapBtn.addEventListener("click", exportMapToPng);
  }

  // ==========================================================================
  // 18. Keyboard Shortcuts Navigation Engine (Week 6 & Week 9 Accessibility)
  // ==========================================================================
  document.addEventListener("keydown", (e) => {
    const activeEl = document.activeElement;
    const isTyping = activeEl && ["INPUT", "SELECT", "TEXTAREA"].includes(activeEl.tagName);

    if (e.key === "/" && !isTyping) {
      e.preventDefault();
      const sInput = document.getElementById("universalSearch");
      if (sInput) {
        sInput.focus();
        sInput.select();
      }
    } else if ((e.key === "d" || e.key === "D") && !isTyping) {
      e.preventDefault();
      toggleDrawer();
    } else if ((e.key === "m" || e.key === "M") && !isTyping) {
      e.preventDefault();
      toggleMeasurement();
    } else if ((e.key === "e" || e.key === "E") && !isTyping) {
      e.preventDefault();
      exportMapToPng();
    } else if ((e.key === "r" || e.key === "R") && !isTyping) {
      e.preventDefault();
      resetToStateView();
    } else if (e.key === "Escape") {
      if (isMeasuring) {
        exitMeasurement();
        return;
      }
      const modal = document.getElementById("aboutModal");
      if (modal && modal.open) {
        modal.close();
      }
      const sResults = document.getElementById("searchResults");
      if (sResults && !sResults.classList.contains("hidden")) {
        sResults.classList.add("hidden");
      }
      if (window.innerWidth <= 768 && layerDrawer && !layerDrawer.classList.contains("drawer-collapsed")) {
        setDrawerCollapsed(true);
      }
    }
  });
});
