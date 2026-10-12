/**
 * Gujarat InfraMap — Production Service Worker (PWA Offline Cache Engine)
 * Standard: Cache-First for static assets & 11 GeoJSON datasets; Stale-While-Revalidate for external CDNs & tiles.
 * Version: 5.0.0
 */

const CACHE_NAME = "gujarat-inframap-v5.6.0";

const PRECACHE_ASSETS = [
  "./",
  "./index.html",
  "./css/style.css",
  "./js/civil_science_stop.js",
  "./js/layer_manager.js",
  "./js/asset_inspector.js",
  "./js/dam_science_lab.js",
  "./js/water_systems_network.js",
  "./js/energy_infrastructure_explorer.js",
  "./js/transportation_explorer.js",
  "./js/geoenvironmental_intelligence.js",
  "./js/water_scenarios_lab.js",
  "./js/district_registry.js",
  "./js/temporal_explorer.js",
  "./js/geospatial_analysis_toolkit.js",
  "./js/infrastructure_intelligence.js",
  "./js/terrain_3d_mode.js",
  "./js/geospatial_data_ops.js",
  "./js/digital_twin_report_builder.js",
  "./js/app.js",
  "./data/data_quality_catalog.json",
  "./manifest.json",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./data/gujarat_districts.geojson",
  "./data/gujarat_district_hq.geojson",
  "./data/gujarat_roads.geojson",
  "./data/gujarat_transport_structures.geojson",
  "./data/gujarat_geoenvironmental.geojson",
  "./data/gujarat_railways.geojson",
  "./data/gujarat_stations.geojson",
  "./data/gujarat_power.geojson",
  "./data/gujarat_transmission.geojson",
  "./data/gujarat_water_resources.geojson",
  "./data/gujarat_groundwater_geology.geojson",
  "./data/gujarat_urban_industry.geojson",
  "./data/gujarat_environment_disaster.geojson"
];

// Install event ?" Pre-cache all core application shell assets and 11 GeoJSON layers
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn("[SW] Some assets failed to precache during install:", err);
      });
    })
  );
});

// Activate event ?" Purge outdated caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event ?" Cache-First for local assets, Stale-While-Revalidate for remote tiles/CDNs
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Ignore non-GET requests
  if (event.request.method !== "GET") return;

  // Local assets (HTML, CSS, JS, GeoJSON, icons) ?" Cache-First with Network Fallback
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          // Revalidate in background if online
          fetch(event.request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
            }
          }).catch(() => {/* Offline */});
          return cachedResponse;
        }
        return fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
          }
          return networkResponse;
        }).catch(() => {
          if (event.request.headers.get("accept") && event.request.headers.get("accept").includes("text/html")) {
            return caches.match("./index.html");
          }
        });
      })
    );
    return;
  }

  // External CDN scripts & Fonts (Leaflet, Google Fonts, Carto) ?" Stale-While-Revalidate
  if (
    url.hostname.includes("unpkg.com") ||
    url.hostname.includes("fonts.googleapis.com") ||
    url.hostname.includes("fonts.gstatic.com") ||
    url.hostname.includes("tile.openstreetmap.fr") ||
    url.hostname.includes("basemaps.cartocdn.com")
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          const fetchPromise = fetch(event.request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => cachedResponse);

          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // Default network pass-through
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
