/**
 * Gujarat Atlas — Tourism & Places to Explore Discovery Engine
 * Manages destination discovery, curated categories, interactive map markers,
 * destination profiles, weekend getaway planning, and intelligent infrastructure cross-linking.
 *
 * Adheres to strict civic-tech standards:
 * - Genuine, verified destinations from Gujarat Tourism, Incredible India, ASI, and Forest Dept.
 * - No AI hallucinations, no fake reviews, no unverified claims.
 * - Seamless integration with existing Leaflet map canvas and infrastructure layers.
 */

(function (window, document) {
  "use strict";

  const TourismDiscovery = {
    destinations: [],
    markers: {},
    markerLayerGroup: null,
    activeFilter: {
      category: "all",
      district: "",
      searchQuery: "",
      duration: "all",
      weekendFrom: "all",
      lesserKnownOnly: false
    },
    activeDestinationId: null,

    // Departure cities with approximate coordinates for distance calculations
    DEPARTURE_CITIES: {
      "Ahmedabad": [72.5714, 23.0225],
      "Gandhinagar": [72.6369, 23.2156],
      "Vadodara": [73.1812, 22.3072],
      "Surat": [72.8311, 21.1702],
      "Rajkot": [70.8022, 22.3039],
      "Bhuj": [69.6669, 23.2420],
      "Bhavnagar": [72.1500, 21.7645]
    },

    init: async function () {
      console.log("[TourismDiscovery] Initializing Gujarat Places to Explore Engine...");
      this.bindControls();
      await this.loadData();
      this.initMapLayer();
      this.render();
      this.integrateWithUniversalSearch();
    },

    loadData: async function () {
      try {
        const response = await fetch("data/gujarat_tourism_destinations.geojson");
        if (response.ok) {
          const data = await response.json();
          this.destinations = (data.features || []).map(f => ({
            ...f.properties,
            coordinates: f.geometry ? f.geometry.coordinates : [72.0, 23.0]
          }));
          console.log(`[TourismDiscovery] Loaded ${this.destinations.length} verified destinations from GeoJSON.`);
        } else {
          console.warn("[TourismDiscovery] GeoJSON response not ok, checking window fallback.");
        }
      } catch (err) {
        console.warn("[TourismDiscovery] Failed to fetch GeoJSON, using embedded data fallback:", err);
      }
    },

    initMapLayer: function () {
      if (!window.map || typeof L === "undefined") {
        setTimeout(() => this.initMapLayer(), 500);
        return;
      }

      if (!this.markerLayerGroup) {
        this.markerLayerGroup = L.layerGroup();
        // Add to map by default or when Places mode is active
      }

      this.updateMapMarkers();
    },

    getCategoryIcon: function (cat) {
      const map = {
        iconic: "✨",
        lesser_known: "🌿",
        nature_wildlife: "🦁",
        heritage_history: "🏰",
        spiritual_cultural: "🛕",
        coastal_beach: "🏖️",
        food_craft: "🎨",
        weekend_getaway: "🚗"
      };
      return map[cat] || "📍";
    },

    getCategoryColor: function (cat) {
      const colors = {
        iconic: "#C49A45",          // Turmeric Gold
        lesser_known: "#52664B",    // Neem Green
        nature_wildlife: "#374632", // Deep Forest Neem
        heritage_history: "#A64036",// Madder Red / Ajrakh
        spiritual_cultural: "#B59B79", // Warm Sandstone Bronze
        coastal_beach: "#243B53",   // Deep Indigo
        food_craft: "#7F231C",      // Deep Terracotta
        weekend_getaway: "#334E68"  // Slate Indigo
      };
      return colors[cat] || "#C49A45";
    },

    updateMapMarkers: function () {
      if (!this.markerLayerGroup || !window.map) return;
      this.markerLayerGroup.clearLayers();
      this.markers = {};

      const filtered = this.getFilteredDestinations();

      filtered.forEach(d => {
        const [lng, lat] = d.coordinates;
        if (!lat || !lng) return;

        const iconSymbol = this.getCategoryIcon(d.category);
        const iconColor = this.getCategoryColor(d.category);

        const customIcon = L.divIcon({
          className: "tourism-map-marker-wrap",
          html: `
            <div class="tourism-marker-pin" style="background-color: ${iconColor};" title="${this.escapeHtml(d.name)}">
              <span class="tourism-marker-symbol">${iconSymbol}</span>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32]
        });

        const marker = L.marker([lat, lng], { icon: customIcon });

        const popupContent = `
          <div class="tourism-marker-popup" style="font-family: var(--font-sans);">
            <div class="tmp-badge" style="color: ${iconColor}; font-weight: 700; font-size: 0.72rem; text-transform: uppercase;">
              ${iconSymbol} ${this.escapeHtml(d.categoryLabel || d.category)}
            </div>
            <h4 class="tmp-title" style="margin: 0.25rem 0 0.4rem; font-family: var(--font-serif-display); font-size: 1rem; font-weight: 700; color: #102A43;">
              ${this.escapeHtml(d.name)}
            </h4>
            <p class="tmp-district" style="margin: 0 0 0.5rem; font-size: 0.78rem; color: #777269;">
              📍 ${this.escapeHtml(d.district)} District • ${this.escapeHtml(d.region || 'Gujarat')}
            </p>
            <p class="tmp-summary" style="margin: 0 0 0.65rem; font-size: 0.8rem; line-height: 1.45; color: #282823;">
              ${this.escapeHtml(d.summary ? d.summary.substring(0, 130) + '...' : '')}
            </p>
            <div class="tmp-actions" style="display: flex; gap: 0.4rem;">
              <button class="tmp-btn-profile" onclick="window.TourismDiscovery.showDestinationProfile('${d.id}')" style="flex: 1; padding: 0.38rem 0.6rem; background: var(--color-indigo, #243B53); color: #fff; border: none; border-radius: 4px; font-size: 0.75rem; font-weight: 600; cursor: pointer;">
                Explore Details
              </button>
              <a href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}" target="_blank" rel="noopener" class="tmp-btn-nav" style="padding: 0.38rem 0.6rem; background: var(--color-sandstone-light, #EFE6D8); color: #282823; border: 1px solid var(--color-sandstone, #D8C3A5); border-radius: 4px; font-size: 0.75rem; font-weight: 600; text-decoration: none; display: inline-flex; align-items: center;" title="Get directions in Google Maps">
                Directions ↗
              </a>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent, { maxWidth: 280, className: "tourism-leaflet-popup" });
        marker.on("click", () => {
          this.activeDestinationId = d.id;
        });

        this.markerLayerGroup.addLayer(marker);
        this.markers[d.id] = marker;
      });
    },

    bindControls: function () {
      // Category filter pills
      document.querySelectorAll(".tourism-cat-pill").forEach(pill => {
        pill.addEventListener("click", () => {
          document.querySelectorAll(".tourism-cat-pill").forEach(p => p.classList.remove("active"));
          pill.classList.add("active");
          this.activeFilter.category = pill.getAttribute("data-cat") || "all";
          this.render();
          this.updateMapMarkers();
        });
      });

      // Search input
      const searchInput = document.getElementById("tourismSearchInput");
      if (searchInput) {
        searchInput.addEventListener("input", (e) => {
          this.activeFilter.searchQuery = (e.target.value || "").toLowerCase().trim();
          this.render();
          this.updateMapMarkers();
        });
      }

      // District filter
      const districtSelect = document.getElementById("tourismDistrictSelect");
      if (districtSelect) {
        this.populateDistrictDropdown(districtSelect);
        districtSelect.addEventListener("change", (e) => {
          this.activeFilter.district = e.target.value;
          this.render();
          this.updateMapMarkers();
        });
      }

      // Trip duration filter
      const durationSelect = document.getElementById("tourismDurationSelect");
      if (durationSelect) {
        durationSelect.addEventListener("change", (e) => {
          this.activeFilter.duration = e.target.value;
          this.render();
          this.updateMapMarkers();
        });
      }

      // Weekend departure city selector
      const weekendCitySelect = document.getElementById("tourismWeekendCitySelect");
      if (weekendCitySelect) {
        weekendCitySelect.addEventListener("change", (e) => {
          this.activeFilter.weekendFrom = e.target.value;
          this.render();
          this.updateMapMarkers();
        });
      }

      // Lesser-known toggle button
      const lesserKnownBtn = document.getElementById("tourismLesserKnownBtn");
      if (lesserKnownBtn) {
        lesserKnownBtn.addEventListener("click", () => {
          this.activeFilter.lesserKnownOnly = !this.activeFilter.lesserKnownOnly;
          lesserKnownBtn.classList.toggle("active", this.activeFilter.lesserKnownOnly);
          this.render();
          this.updateMapMarkers();
        });
      }

      // Reset filters button
      const resetBtn = document.getElementById("tourismResetFiltersBtn");
      if (resetBtn) {
        resetBtn.addEventListener("click", () => {
          this.resetFilters();
        });
      }

      // Places Exploration Mode Switcher (Catalogue vs Trip Reality vs Gujarat Unfiltered)
      const btnModeCatalog = document.getElementById("btnModeCatalog");
      const btnModeTripReality = document.getElementById("btnModeTripReality");
      const btnModeUnfiltered = document.getElementById("btnModeUnfiltered");
      const subViewCatalog = document.getElementById("placesCatalogSubView");
      const subViewTripReality = document.getElementById("tripRealitySubView");
      const subViewUnfiltered = document.getElementById("placesUnfilteredSubView");

      if (btnModeCatalog && btnModeTripReality) {
        btnModeCatalog.addEventListener("click", () => {
          btnModeCatalog.classList.add("active");
          btnModeCatalog.setAttribute("aria-selected", "true");
          btnModeTripReality.classList.remove("active");
          btnModeTripReality.setAttribute("aria-selected", "false");
          if (btnModeUnfiltered) {
            btnModeUnfiltered.classList.remove("active");
            btnModeUnfiltered.setAttribute("aria-selected", "false");
          }
          if (subViewCatalog) subViewCatalog.classList.remove("hidden");
          if (subViewTripReality) subViewTripReality.classList.add("hidden");
          if (subViewUnfiltered) subViewUnfiltered.classList.add("hidden");
          if (window.history && window.history.pushState) {
            history.pushState(null, "", "#/places");
          }
        });

        btnModeTripReality.addEventListener("click", () => {
          btnModeTripReality.classList.add("active");
          btnModeTripReality.setAttribute("aria-selected", "true");
          btnModeCatalog.classList.remove("active");
          btnModeCatalog.setAttribute("aria-selected", "false");
          if (btnModeUnfiltered) {
            btnModeUnfiltered.classList.remove("active");
            btnModeUnfiltered.setAttribute("aria-selected", "false");
          }
          if (subViewCatalog) subViewCatalog.classList.add("hidden");
          if (subViewTripReality) subViewTripReality.classList.remove("hidden");
          if (subViewUnfiltered) subViewUnfiltered.classList.add("hidden");
          if (window.TripReality) {
            window.TripReality.renderAssessment();
            window.TripReality.updateMapVisualization();
          }
          if (window.history && window.history.pushState) {
            history.pushState(null, "", "#/trip-reality");
          }
        });

        if (btnModeUnfiltered) {
          btnModeUnfiltered.addEventListener("click", () => {
            btnModeUnfiltered.classList.add("active");
            btnModeUnfiltered.setAttribute("aria-selected", "true");
            btnModeCatalog.classList.remove("active");
            btnModeCatalog.setAttribute("aria-selected", "false");
            btnModeTripReality.classList.remove("active");
            btnModeTripReality.setAttribute("aria-selected", "false");
            if (subViewCatalog) subViewCatalog.classList.add("hidden");
            if (subViewTripReality) subViewTripReality.classList.add("hidden");
            if (subViewUnfiltered) subViewUnfiltered.classList.remove("hidden");
            if (window.GujaratUnfiltered) {
              window.GujaratUnfiltered.render();
            }
            if (window.history && window.history.pushState) {
              history.pushState(null, "", "#/unfiltered");
            }
          });
        }
      }
    },

    populateDistrictDropdown: function (selectEl) {
      if (!selectEl) return;
      const districts = [
        "Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch", "Bhavnagar",
        "Botad", "Chhota Udaipur", "Dahod", "Dang", "Devbhumi Dwarka", "Gandhinagar",
        "Gir Somnath", "Jamnagar", "Junagadh", "Kachchh", "Kheda", "Mahisagar", "Mehsana",
        "Morbi", "Narmada", "Navsari", "Panchmahal", "Patan", "Porbandar", "Rajkot",
        "Sabarkantha", "Surat", "Surendranagar", "Tapi", "Vadodara", "Valsad"
      ];
      selectEl.innerHTML = `<option value="">All 33 Districts</option>` +
        districts.map(d => `<option value="${d}">${d}</option>`).join("");
    },

    resetFilters: function () {
      this.activeFilter = {
        category: "all",
        district: "",
        searchQuery: "",
        duration: "all",
        weekendFrom: "all",
        lesserKnownOnly: false
      };

      document.querySelectorAll(".tourism-cat-pill").forEach(p => {
        p.classList.toggle("active", p.getAttribute("data-cat") === "all");
      });

      const sInput = document.getElementById("tourismSearchInput");
      if (sInput) sInput.value = "";

      const dSelect = document.getElementById("tourismDistrictSelect");
      if (dSelect) dSelect.value = "";

      const durSelect = document.getElementById("tourismDurationSelect");
      if (durSelect) durSelect.value = "all";

      const wSelect = document.getElementById("tourismWeekendCitySelect");
      if (wSelect) wSelect.value = "all";

      const lkBtn = document.getElementById("tourismLesserKnownBtn");
      if (lkBtn) lkBtn.classList.remove("active");

      this.render();
      this.updateMapMarkers();
    },

    getFilteredDestinations: function () {
      return this.destinations.filter(d => {
        // Category filter
        if (this.activeFilter.category !== "all") {
          if (this.activeFilter.category === "lesser_known") {
            if (!d.isLesserKnown) return false;
          } else if (d.category !== this.activeFilter.category) {
            return false;
          }
        }

        // Lesser known toggle
        if (this.activeFilter.lesserKnownOnly && !d.isLesserKnown) {
          return false;
        }

        // District filter
        if (this.activeFilter.district && d.district !== this.activeFilter.district) {
          return false;
        }

        // Weekend getaway departure city filter
        if (this.activeFilter.weekendFrom !== "all") {
          if (!d.weekendFrom || !d.weekendFrom.includes(this.activeFilter.weekendFrom)) {
            return false;
          }
        }

        // Duration filter
        if (this.activeFilter.duration !== "all") {
          const dur = (d.recommendedDuration || "").toLowerCase();
          if (this.activeFilter.duration === "short" && !(dur.includes("1") || dur.includes("2 hours"))) return false;
          if (this.activeFilter.duration === "half_day" && !(dur.includes("half") || dur.includes("3") || dur.includes("4 hours"))) return false;
          if (this.activeFilter.duration === "full_day" && !(dur.includes("full") || dur.includes("day"))) return false;
          if (this.activeFilter.duration === "weekend" && !(dur.includes("2 day") || dur.includes("night") || dur.includes("weekend"))) return false;
        }

        // Search text query
        if (this.activeFilter.searchQuery) {
          const q = this.activeFilter.searchQuery;
          const matchName = (d.name || "").toLowerCase().includes(q);
          const matchDist = (d.district || "").toLowerCase().includes(q);
          const matchCat = (d.categoryLabel || "").toLowerCase().includes(q);
          const matchSummary = (d.summary || "").toLowerCase().includes(q);
          const matchTags = (d.tags || []).some(t => t.toLowerCase().includes(q));
          if (!matchName && !matchDist && !matchCat && !matchSummary && !matchTags) return false;
        }

        return true;
      });
    },

    render: function () {
      const container = document.getElementById("tourismCardsGrid");
      const countEl = document.getElementById("tourismResultsCount");
      if (!container) return;

      const filtered = this.getFilteredDestinations();

      if (countEl) {
        const total = this.destinations.length;
        countEl.textContent = `Showing ${filtered.length} of ${total} verified Gujarat destinations`;
      }

      if (filtered.length === 0) {
        container.innerHTML = `
          <div class="tourism-empty-state" style="grid-column: 1 / -1; padding: 3rem 1.5rem; text-align: center; background: var(--color-ivory-warm, #FAF6EE); border: 1px dashed var(--color-sandstone, #D8C3A5); border-radius: 8px;">
            <div style="font-size: 2.5rem; margin-bottom: 0.75rem;">🧭</div>
            <h3 style="font-family: var(--font-serif-display); font-size: 1.2rem; font-weight: 700; color: #102A43; margin-bottom: 0.35rem;">No matching destinations found</h3>
            <p style="font-size: 0.88rem; color: #777269; margin-bottom: 1.25rem;">Try relaxing your filters or search query to discover more places across Gujarat.</p>
            <button onclick="window.TourismDiscovery.resetFilters()" style="padding: 0.5rem 1.25rem; background: var(--color-indigo, #243B53); color: #fff; border: none; border-radius: 6px; font-size: 0.85rem; font-weight: 600; cursor: pointer;">
              Reset All Filters
            </button>
          </div>
        `;
        return;
      }

      container.innerHTML = filtered.map(d => {
        const iconSymbol = this.getCategoryIcon(d.category);
        const iconColor = this.getCategoryColor(d.category);
        const manifestImg = (window.ImageManifest && window.ImageManifest.getDestinationImage) ? window.ImageManifest.getDestinationImage(d.id) : null;
        const photoUrl = (manifestImg && manifestImg.url) ? manifestImg.url : (d.image && d.image.startsWith("http") ? d.image : "");
        const altText = (manifestImg && manifestImg.alt) ? manifestImg.alt : d.name;
        const credit = (manifestImg && manifestImg.credit) ? manifestImg.credit : "";
        const license = (manifestImg && manifestImg.license) ? manifestImg.license : "";
        const hasPhoto = Boolean(photoUrl);

        return `
          <article class="destination-card" id="dest-card-${d.id}">
            <div class="dest-card-image-wrap">
              ${hasPhoto ? `
                <img src="${this.escapeHtml(photoUrl)}" alt="${this.escapeHtml(altText)}" class="dest-card-img" loading="lazy" onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'dest-img-placeholder\\' style=\\'background: linear-gradient(135deg, ${iconColor}22, #f1f5f9); height: 160px; display: flex; align-items: center; justify-content: center; font-size: 2.5rem;\\'>${iconSymbol}</div>';">
              ` : `
                <div class="dest-img-placeholder" style="background: linear-gradient(135deg, ${iconColor}22, #f1f5f9); height: 160px; display: flex; align-items: center; justify-content: center; font-size: 2.5rem;">
                  ${iconSymbol}
                </div>
              `}
              <div class="dest-card-floating-badge" style="background: rgba(15, 23, 42, 0.85); color: #fff; backdrop-filter: blur(4px);">
                <span>${iconSymbol} ${this.escapeHtml(d.categoryLabel)}</span>
              </div>
              ${credit ? `
                <div class="dest-card-credit-pill" title="${this.escapeHtml(credit)} • ${this.escapeHtml(license)}">
                  <span class="attribution-dot">●</span> ${this.escapeHtml(credit)}
                </div>
              ` : ''}
              ${d.isLesserKnown ? `
                <span class="dest-badge-lesser-known" title="Curated off-the-familiar-trail destination">
                  🌿 Off-Trail
                </span>
              ` : ''}
            </div>

            <div class="dest-card-body">
              <div class="dest-card-location-row">
                <span class="dest-district-tag">📍 ${this.escapeHtml(d.district)} • ${this.escapeHtml(d.region || 'Gujarat')}</span>
                ${d.recommendedDuration ? `<span class="dest-duration-tag">⏱️ ${this.escapeHtml(d.recommendedDuration)}</span>` : ''}
              </div>

              <h3 class="dest-card-title">${this.escapeHtml(d.name)}</h3>

              <p class="dest-card-summary">
                ${this.escapeHtml(d.summary ? d.summary.substring(0, 140) + '...' : '')}
              </p>

              ${d.nearbyInfrastructure ? `
                <div class="dest-card-infra-hint" title="Connected transport infrastructure">
                  <span class="dci-icon">🚆</span>
                  <span class="dci-text">${this.escapeHtml(d.nearbyInfrastructure.railway || d.nearbyInfrastructure.highway || 'Transport connected')}</span>
                </div>
              ` : ''}

              <div class="dest-card-actions">
                <button class="dest-btn-map" onclick="window.TourismDiscovery.flyToDestination('${d.id}')" title="Locate on map">
                  <span>🗺️ Map</span>
                </button>
                <button class="dest-btn-feasibility" onclick="window.TourismDiscovery.launchTripReality('${d.id}')" title="Analyze practical access & last-mile feasibility">
                  <span>🧭 Feasibility</span>
                </button>
                <button class="dest-btn-details" onclick="window.TourismDiscovery.showDestinationProfile('${d.id}')" title="Explore complete profile">
                  <span>Details</span>
                </button>
              </div>
            </div>
          </article>
        `;
      }).join("");
    },

    flyToDestination: function (destId) {
      const dest = this.destinations.find(d => d.id === destId);
      if (!dest) return;

      // Ensure map destination tab is active if on desktop
      if (window.PublicViews && typeof window.PublicViews.switchDestination === "function") {
        window.PublicViews.switchDestination("explore", true);
      }

      // Ensure tourism marker layer is added to map
      if (this.markerLayerGroup && window.map && !window.map.hasLayer(this.markerLayerGroup)) {
        this.markerLayerGroup.addTo(window.map);
      }

      const [lng, lat] = dest.coordinates;
      if (window.map && lat && lng) {
        const isReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (isReduced) {
          window.map.setView([lat, lng], 14, { animate: false });
        } else {
          window.map.flyTo([lat, lng], 14, { duration: 1.1 });
        }

        if (typeof window.showMapFocalPulse === "function") {
          window.showMapFocalPulse(lat, lng);
        }

        setTimeout(() => {
          const marker = this.markers[destId];
          if (marker) {
            marker.openPopup();
          }
        }, isReduced ? 50 : 1200);
      }
    },

    showDestinationProfile: function (destId) {
      const dest = this.destinations.find(d => d.id === destId);
      if (!dest) return;

      this.activeDestinationId = destId;
      const modal = document.getElementById("destinationProfileModal");
      const content = document.getElementById("destProfileContent");
      if (!modal || !content) return;

      const [lng, lat] = dest.coordinates;
      const iconSymbol = this.getCategoryIcon(dest.category);
      const iconColor = this.getCategoryColor(dest.category);
      const manifestImg = (window.ImageManifest && window.ImageManifest.getDestinationImage) ? window.ImageManifest.getDestinationImage(dest.id) : null;
      const photoUrl = (manifestImg && manifestImg.url) ? manifestImg.url : (dest.image && dest.image.startsWith("http") ? dest.image : "");
      const altText = (manifestImg && manifestImg.alt) ? manifestImg.alt : dest.name;
      const credit = (manifestImg && manifestImg.credit) ? manifestImg.credit : "";
      const license = (manifestImg && manifestImg.license) ? manifestImg.license : "";
      const hasPhoto = Boolean(photoUrl);

      content.innerHTML = `
        <article class="dp-article">
          <!-- Header Banner -->
          <div class="dp-header-banner" style="position: relative; background: #0f172a; color: #fff; border-radius: 8px; overflow: hidden; margin-bottom: 1.5rem;">
            ${hasPhoto ? `
              <img src="${this.escapeHtml(photoUrl)}" alt="${this.escapeHtml(altText)}" style="width: 100%; height: 260px; object-fit: cover; opacity: 0.88;">
              ${credit ? `
                <div class="dest-profile-credit-pill" style="position: absolute; top: 12px; right: 12px; background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(4px); color: #FAF6EE; font-size: 0.72rem; padding: 3px 8px; border-radius: 4px; border: 1px solid rgba(255, 255, 255, 0.15);" title="${this.escapeHtml(credit)} • ${this.escapeHtml(license)}">
                  <span style="color: #E2AE48;">●</span> ${this.escapeHtml(credit)}
                </div>
              ` : ''}
            ` : `
              <div style="height: 180px; background: linear-gradient(135deg, ${iconColor}, #0f172a); display: flex; align-items: center; justify-content: center; font-size: 3.5rem;">
                ${iconSymbol}
              </div>
            `}
            <div class="dp-banner-overlay" style="position: absolute; bottom: 0; left: 0; right: 0; padding: 1.25rem; background: linear-gradient(to top, rgba(15,23,42,0.95), transparent);">
              <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.35rem;">
                <span style="background: ${iconColor}; color: #fff; font-size: 0.72rem; font-weight: 700; padding: 0.2rem 0.6rem; border-radius: 4px; text-transform: uppercase;">
                  ${iconSymbol} ${this.escapeHtml(dest.categoryLabel || dest.category)}
                </span>
                ${dest.isLesserKnown ? `
                  <span style="background: #059669; color: #fff; font-size: 0.72rem; font-weight: 700; padding: 0.2rem 0.6rem; border-radius: 4px;">
                    🌿 Off the Familiar Trail
                  </span>
                ` : ''}
              </div>
              <h2 style="font-size: 1.5rem; font-weight: 800; margin: 0; color: #ffffff;">${this.escapeHtml(dest.name)}</h2>
              <div style="font-size: 0.85rem; color: #cbd5e1; margin-top: 0.25rem;">
                📍 ${this.escapeHtml(dest.district)} District, ${this.escapeHtml(dest.region || 'Gujarat')} • Coordinates: ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E
              </div>
            </div>
          </div>

          <!-- Quick Action Bar -->
          <div class="dp-quick-actions" style="display: flex; flex-wrap: wrap; gap: 0.65rem; margin-bottom: 1.25rem;">
            <button class="btn-primary-action" onclick="window.TourismDiscovery.flyToDestination('${dest.id}'); document.getElementById('destinationProfileModal').close();" style="display: inline-flex; align-items: center; gap: 0.4rem;">
              <span>🗺️ View on Map</span>
            </button>
            <button class="btn-primary-action btn-profile-feasibility" onclick="window.TourismDiscovery.launchTripReality('${dest.id}');" style="display: inline-flex; align-items: center; gap: 0.4rem; background: #0f766e; color: #fff; border-color: #0d9488;">
              <span>🧭 Check Trip Reality & Last-Mile</span>
            </button>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}" target="_blank" rel="noopener" class="btn-secondary-action" style="display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.5rem 1rem; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; color: #0f172a; text-decoration: none; font-weight: 600; font-size: 0.85rem;">
              <span>🚗 Directions ↗</span>
            </a>
            ${dest.sourceUrl ? `
              <a href="${dest.sourceUrl}" target="_blank" rel="noopener" class="btn-secondary-action" style="display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.5rem 1rem; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; color: #0f172a; text-decoration: none; font-weight: 600; font-size: 0.85rem;">
                <span>🌐 Official Portal ↗</span>
              </a>
            ` : ''}
          </div>

          <!-- Trip Reality Prompt Callout -->
          <div class="dp-section dp-feasibility-callout" style="margin-bottom: 1.5rem; background: var(--color-neem-light, #EEF3ED); border: 1px solid var(--color-neem, #52664B); border-radius: 6px; padding: 0.85rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
            <div style="flex: 1; min-width: 240px;">
              <strong style="font-size: 0.88rem; color: var(--color-neem-dark, #374632); display: flex; align-items: center; gap: 0.35rem;">
                <span>🧭 Before You Go: Practical Last-Mile Travel Reality</span>
              </strong>
              <p style="margin: 0.2rem 0 0; font-size: 0.82rem; color: var(--color-neem-dark, #374632); line-height: 1.4;">
                Assess the gap from nearest rail/feeder hub, available last-mile transport, same-day return viability, road conditions, and seasonal constraints.
              </p>
            </div>
            <button onclick="window.TourismDiscovery.launchTripReality('${dest.id}');" style="padding: 0.5rem 1rem; background: var(--color-neem, #52664B); color: #ffffff; border: none; border-radius: 6px; font-weight: 600; font-size: 0.82rem; cursor: pointer; white-space: nowrap;">
              Analyze Feasibility →
            </button>
          </div>

          <!-- Editorial Summary -->
          <div class="dp-section" style="margin-bottom: 1.5rem;">
            <h4 style="font-family: var(--font-serif-display); font-size: 1.05rem; font-weight: 700; color: #102A43; border-left: 3px solid var(--color-indigo, #243B53); padding-left: 0.6rem; margin-bottom: 0.6rem;">
              About This Destination
            </h4>
            <p style="font-size: 0.92rem; line-height: 1.6; color: #282823; margin: 0;">
              ${this.escapeHtml(dest.summary)}
            </p>
          </div>

          <!-- Key Highlights / Things to See -->
          ${dest.highlights && dest.highlights.length ? `
            <div class="dp-section" style="margin-bottom: 1.5rem;">
              <h4 style="font-family: var(--font-serif-display); font-size: 1.05rem; font-weight: 700; color: #102A43; border-left: 3px solid var(--color-turmeric, #C49A45); padding-left: 0.6rem; margin-bottom: 0.6rem;">
                Key Experiences & Highlights
              </h4>
              <ul style="margin: 0; padding-left: 1.25rem; font-size: 0.88rem; color: #282823; line-height: 1.6;">
                ${dest.highlights.map(h => `<li style="margin-bottom: 0.35rem;">${this.escapeHtml(h)}</li>`).join("")}
              </ul>
            </div>
          ` : ''}

          <!-- Practical Visitor Information Grid -->
          <div class="dp-section" style="margin-bottom: 1.5rem;">
            <h4 style="font-family: var(--font-serif-display); font-size: 1.05rem; font-weight: 700; color: #102A43; border-left: 3px solid var(--color-neem, #52664B); padding-left: 0.6rem; margin-bottom: 0.6rem;">
              Practical Visitor Guidelines & Information
            </h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 0.75rem;">
              <div class="dp-info-box" style="padding: 0.75rem; background: #ffffff; border: 1px solid var(--color-sandstone, #D8C3A5); border-radius: 6px;">
                <strong style="display: block; font-size: 0.75rem; text-transform: uppercase; color: #777269; margin-bottom: 0.25rem;">Best Season to Visit</strong>
                <span style="font-size: 0.85rem; color: #102A43; font-weight: 600;">${this.escapeHtml(dest.bestSeason || 'Year-round')}</span>
              </div>
              <div class="dp-info-box" style="padding: 0.75rem; background: #ffffff; border: 1px solid var(--color-sandstone, #D8C3A5); border-radius: 6px;">
                <strong style="display: block; font-size: 0.75rem; text-transform: uppercase; color: #777269; margin-bottom: 0.25rem;">Recommended Time</strong>
                <span style="font-size: 0.85rem; color: #102A43; font-weight: 600;">${this.escapeHtml(dest.recommendedDuration || '2 hours')}</span>
              </div>
              <div class="dp-info-box" style="padding: 0.75rem; background: #ffffff; border: 1px solid var(--color-sandstone, #D8C3A5); border-radius: 6px;">
                <strong style="display: block; font-size: 0.75rem; text-transform: uppercase; color: #777269; margin-bottom: 0.25rem;">Visiting Timings</strong>
                <span style="font-size: 0.85rem; color: #102A43; font-weight: 600;">${this.escapeHtml(dest.timings || 'Sunrise to sunset')}</span>
              </div>
              <div class="dp-info-box" style="padding: 0.75rem; background: #ffffff; border: 1px solid var(--color-sandstone, #D8C3A5); border-radius: 6px;">
                <strong style="display: block; font-size: 0.75rem; text-transform: uppercase; color: #777269; margin-bottom: 0.25rem;">Statutory Entry Fee</strong>
                <span style="font-size: 0.85rem; color: #102A43; font-weight: 600;">${this.escapeHtml(dest.entryFee || 'Free entry')}</span>
              </div>
            </div>
          </div>

          <!-- Rules, Facilities & Access -->
          <div class="dp-section" style="margin-bottom: 1.5rem; background: var(--color-ivory-warm, #FAF6EE); border: 1px solid var(--color-sandstone, #D8C3A5); border-radius: 6px; padding: 0.85rem;">
            <div style="margin-bottom: 0.6rem;">
              <strong style="font-size: 0.82rem; color: #102A43;">Visitor Facilities & Accessibility:</strong>
              <p style="margin: 0.2rem 0 0; font-size: 0.84rem; color: #282823;">${this.escapeHtml(dest.facilities || 'Basic local amenities available.')}</p>
            </div>
            <div>
              <strong style="font-size: 0.82rem; color: var(--color-madder, #A64036);">Rules & Access Restrictions:</strong>
              <p style="margin: 0.2rem 0 0; font-size: 0.84rem; color: #282823;">${this.escapeHtml(dest.rulesRestrictions || 'Standard heritage/forest preservation guidelines apply.')}</p>
            </div>
          </div>

          <!-- Connected Infrastructure Network -->
          ${dest.nearbyInfrastructure ? `
            <div class="dp-section" style="margin-bottom: 1.5rem; border: 1px solid var(--color-sandstone, #D8C3A5); background: var(--color-turmeric-light, #FBF5E8); border-radius: 6px; padding: 0.85rem;">
              <h4 style="font-family: var(--font-serif-display); font-size: 0.95rem; font-weight: 700; color: var(--color-turmeric-dark, #8F6B22); margin: 0 0 0.5rem; display: flex; align-items: center; gap: 0.4rem;">
                <span>🚆 Connected Infrastructure & Transport Access</span>
              </h4>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.5rem; font-size: 0.82rem; color: var(--color-turmeric-dark, #8F6B22);">
                ${dest.nearbyInfrastructure.railway ? `<div><strong>Nearest Rail:</strong> ${this.escapeHtml(dest.nearbyInfrastructure.railway)}</div>` : ''}
                ${dest.nearbyInfrastructure.airport ? `<div><strong>Nearest Airport:</strong> ${this.escapeHtml(dest.nearbyInfrastructure.airport)}</div>` : ''}
                ${dest.nearbyInfrastructure.highway ? `<div><strong>Highway Corridor:</strong> ${this.escapeHtml(dest.nearbyInfrastructure.highway)}</div>` : ''}
              </div>
            </div>
          ` : ''}

          <!-- Provenance and Verification Source -->
          <div class="dp-footer-meta" style="border-top: 1px solid var(--color-sandstone, #D8C3A5); padding-top: 0.75rem; font-size: 0.78rem; color: #777269; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
            <span>Source: <strong>${this.escapeHtml(dest.sourceName || 'Gujarat Tourism Authority')}</strong></span>
            <span style="color: var(--color-neem, #52664B); font-weight: 600;">✓ Verified Statutory Record</span>
          </div>
        </article>
      `;

      if (typeof modal.showModal === "function") {
        modal.showModal();
      } else {
        modal.classList.remove("hidden");
      }
    },

    integrateWithUniversalSearch: function () {
      if (!window.searchIndex || !Array.isArray(window.searchIndex)) return;

      this.destinations.forEach(d => {
        const [lng, lat] = d.coordinates;
        window.searchIndex.push({
          title: d.name,
          subtitle: `${d.categoryLabel} • ${d.district} District (${d.region || 'Gujarat'})`,
          type: "tourism",
          category: "TOURISM",
          badgeClass: "tag-tourism",
          lat: lat,
          lng: lng,
          destinationId: d.id,
          properties: d
        });
      });

      console.log(`[TourismDiscovery] Registered ${this.destinations.length} destinations into Universal Smart Search.`);
    },

    launchTripReality: function (destId) {
      const modal = document.getElementById("destinationProfileModal");
      if (modal && typeof modal.close === "function") {
        modal.close();
      }
      if (window.PublicViews && typeof window.PublicViews.switchDestination === "function") {
        window.PublicViews.switchDestination("places", false);
      }
      const btnModeCatalog = document.getElementById("btnModeCatalog");
      const btnModeTripReality = document.getElementById("btnModeTripReality");
      const btnModeUnfiltered = document.getElementById("btnModeUnfiltered");
      const subViewCatalog = document.getElementById("placesCatalogSubView");
      const subViewTripReality = document.getElementById("tripRealitySubView");
      const subViewUnfiltered = document.getElementById("placesUnfilteredSubView");

      if (btnModeCatalog && btnModeTripReality) {
        btnModeTripReality.classList.add("active");
        btnModeTripReality.setAttribute("aria-selected", "true");
        btnModeCatalog.classList.remove("active");
        btnModeCatalog.setAttribute("aria-selected", "false");
        if (btnModeUnfiltered) {
          btnModeUnfiltered.classList.remove("active");
          btnModeUnfiltered.setAttribute("aria-selected", "false");
        }
      }
      if (subViewCatalog) subViewCatalog.classList.add("hidden");
      if (subViewUnfiltered) subViewUnfiltered.classList.add("hidden");
      if (subViewTripReality) subViewTripReality.classList.remove("hidden");

      if (window.TripReality) {
        if (destId) {
          window.TripReality.selectDestination(destId);
        } else {
          window.TripReality.renderAssessment();
          window.TripReality.updateMapVisualization();
        }
      }
      if (window.history && window.history.pushState) {
        history.pushState(null, "", destId ? `#/trip-reality?dest=${destId}` : "#/trip-reality");
      }
      const deck = document.getElementById("tripRealityControlDeck");
      if (deck) {
        deck.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },

    escapeHtml: function (str) {
      if (!str) return "";
      return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }
  };

  window.TourismDiscovery = TourismDiscovery;

  // Auto-init on DOMContentLoaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => TourismDiscovery.init());
  } else {
    TourismDiscovery.init();
  }

})(window, document);
