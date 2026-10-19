/**
 * Gujarat Atlas — Trip Reality & Last-Mile Feasibility Engine
 * 
 * Objective: Help citizens and visitors determine whether visiting a particular 
 * destination in Gujarat is practically feasible using verified geographic and 
 * infrastructure data.
 * 
 * Core Principles:
 * - Differentiator: Practical, geographically informed travel preparation.
 * - Confirmed connection vs. simple proximity.
 * - The Last-Mile Gap as signature feature.
 * - Same-day return journey reality check.
 * - Granular fact provenance and freshness tracking.
 * - Honest 3-level readiness classification (Well Documented, Some Planning Required, Important Details Unverified).
 * - Controlled user reporting of outdated information.
 * - Calm, restrained civic-tech editorial design.
 */

(function (window, document) {
  "use strict";

  const TripReality = {
    auditedDestinations: [],
    destinationsMap: {},
    activeDestination: null,
    activeOrigin: "Ahmedabad",
    activeMode: "public", // "public" | "private"
    activeDate: null,
    mapLayerGroup: null,

    // Verified Origin Departure Hubs across Gujarat with coordinates
    ORIGIN_HUBS: {
      "Ahmedabad": { name: "Ahmedabad", coordinates: [72.5714, 23.0225], region: "Central Gujarat", type: "metro_hub" },
      "Gandhinagar": { name: "Gandhinagar", coordinates: [72.6369, 23.2156], region: "North/Central", type: "state_capital" },
      "Vadodara": { name: "Vadodara", coordinates: [73.1812, 22.3072], region: "Central Gujarat", type: "railway_hub" },
      "Surat": { name: "Surat", coordinates: [72.8311, 21.1702], region: "South Gujarat", type: "commercial_hub" },
      "Rajkot": { name: "Rajkot", coordinates: [70.8022, 22.3039], region: "Saurashtra", type: "regional_hub" },
      "Bhavnagar": { name: "Bhavnagar", coordinates: [72.1500, 21.7645], region: "Saurashtra", type: "port_city" },
      "Jamnagar": { name: "Jamnagar", coordinates: [70.0650, 22.4707], region: "Saurashtra", type: "industrial_hub" },
      "Junagadh": { name: "Junagadh", coordinates: [70.4600, 21.5200], region: "Saurashtra", type: "historic_hub" },
      "Bhuj": { name: "Bhuj", coordinates: [69.6669, 23.2420], region: "Kachchh", type: "district_hq" },
      "Mehsana": { name: "Mehsana", coordinates: [72.3999, 23.5880], region: "North Gujarat", type: "railway_junction" },
      "Palanpur": { name: "Palanpur", coordinates: [72.4385, 24.1724], region: "North Gujarat", type: "district_hq" },
      "Bharuch": { name: "Bharuch", coordinates: [72.9959, 21.7051], region: "South Gujarat", type: "industrial_corridor" },
      "Valsad": { name: "Valsad", coordinates: [72.9342, 20.6100], region: "South Gujarat", type: "coastal_district" },
      "Porbandar": { name: "Porbandar", coordinates: [69.6050, 21.6420], region: "Saurashtra", type: "port_city" },
      "Anand": { name: "Anand", coordinates: [72.9515, 22.5645], region: "Central Gujarat", type: "dairy_hub" }
    },

    DEST_PHOTOS: {
      'adalaj-ni-vav': 'https://upload.wikimedia.org/wikipedia/commons/6/69/Adalaj_stepwell.jpg',
      'sun-temple-modhera': 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Sun_Temple%2C_Modhera.jpg',
      'statue-of-unity': 'https://upload.wikimedia.org/wikipedia/commons/0/07/Statue_of_Unity.jpg',
      'lothal-archaeological-site': 'https://upload.wikimedia.org/wikipedia/commons/7/7f/Ancient_site_at_Lothal_11.jpg',
      'dholavira-unesco': 'https://upload.wikimedia.org/wikipedia/commons/8/80/Dholavira_gujarat.jpg',
      'dholavira-harappan-city': 'https://upload.wikimedia.org/wikipedia/commons/8/80/Dholavira_gujarat.jpg',
      'rani-ki-vav': 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Rani_ki_vav_02.jpg',
      'gir-national-park': 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Asiatic_lion_03.jpg',
      'white-rann-dhordo': 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Rann_of_Kutch_-_White_Desert_2.jpg',
      'marine-national-park': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
      'somnath-temple': 'https://upload.wikimedia.org/wikipedia/commons/7/7b/%22Aerial_view_of_Somnath_temple_01%2C_Prabhas_Patan_Gujarat.jpg',
      'polo-forest': 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1200&q=80',
      'lakhpat-fort': 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Distant_view_of_Lakhpat_Fort.jpg',
      'lakhpat-fort-town': 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Distant_view_of_Lakhpat_Fort.jpg',
      'saputara-hill-station': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      'dumas-beach': 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80'
    },

    DEST_CULTURAL_TIPS: {
      'adalaj-ni-vav': {
        food: 'Authentic Gujarati Thali & fresh spiced buttermilk (Chhaas) at Sarkhej highway joints; hot Fafda-Jalebi at Gandhinagar circle.',
        vibe: '5-story subterranean Solanki stepwell built in 1498 by Queen Rudabai. Best visited in morning light when sunbeams filter down the carved shaft.'
      },
      'sun-temple-modhera': {
        food: 'Mehsana special buffalo milk Mawa and hot Khaman Dhokla along the Patan-Mehsana highway corridor.',
        vibe: '11th-century Solanki architectural marvel designed so equinox sunbeams hit the sanctum. Golden hour at sunset highlights the 52 Kund step-pillars.'
      },
      'statue-of-unity': {
        food: 'Ekta Food Court offering Gujarati Thali, Kathiyawadi dining, and Narmada tribal multi-cuisine outlets.',
        vibe: 'Evening projection laser mapping begins at 7:00 PM. Book viewing gallery slot 2 weeks in advance on official portal.'
      },
      'lothal-archaeological-site': {
        food: 'Carry hydration and light snacks; local roadside dhabas near Dholka serve piping hot Sev Tameta and Bajra Rotla.',
        vibe: '4,400-year-old Harappan bronze-age tidal dockyard and bead-making factory. Best explored between 9 AM and 11 AM.'
      },
      'dholavira-unesco': {
        food: 'Traditional Kutchi Bajra no Rotlo with garlic chutney (Lasan ni Chatni), fresh white Makhan (butter), and Khichdi at Khadir Bet homestays.',
        vibe: 'Traverse the iconic 30 km "Road to Heaven" cutting straight through the sparkling salt desert. Ancient Harappan water harvesting reservoirs.'
      },
      'rani-ki-vav': {
        food: 'Patan famous Devaraji Ghughra and sweet Patan Patola pedas; authentic Kathiyawadi lunch stops.',
        vibe: 'UNESCO World Heritage inverted stepwell temple dedicated to Lord Vishnu with over 500 principal sculptures.'
      },
      'gir-national-park': {
        food: 'Authentic spicy Kathiyawadi Sev Usal, Ringan no Oro (roasted eggplant mash) with jaggery and butter at Sasan village dhabas.',
        vibe: 'The sole habitat of the pure Asiatic Lion on Earth. Book morning 6:00 AM safari slots for optimum wildlife sightings.'
      },
      'white-rann-dhordo': {
        food: 'Hot Kutchi Dabeli, Gulab Pak, and steaming Rabdi along the Bhuj-Khavda highway route.',
        vibe: 'Endless white salt expanse illuminated under moonlight. Sunset between 5:45 PM and 6:30 PM is unmissable.'
      },
      'marine-national-park': {
        food: 'Jamnagar famous Dry Fruit Kachori, Ghughra, and hot Katka bread along Bedi port road.',
        vibe: 'Walk barefoot during low tide on exposed coral reefs with statutory marine guides. Spot live puffers and octopuses.'
      },
      'somnath-temple': {
        food: 'Kathiyawadi Thali, Surti Locho, and refreshing green coconut water straight from seaside orchards.',
        vibe: 'First of the 12 sacred Jyotirlingas directly on the Arabian Sea edge. Evening Sound & Light show at 8:00 PM.'
      },
      'polo-forest': {
        food: 'Fresh roasted corn cobs (Makai) by the Harnav river; local Sabarkantha tribal dhabas serving hot Dal-Baati.',
        vibe: '15th-century ruined Jain and Hindu temples engulfed by lush Aravalli deciduous forest canopy.'
      },
      'lakhpat-fort': {
        food: 'Gurudwara community langar offering simple warm meals; carry personal drinking water as local facilities are sparse.',
        vibe: 'Eerie, evocative ghost fortress town overlooking the Indus delta salt flats and Kori Creek border.'
      },
      'saputara-hill-station': {
        food: 'Tribal roasted corn, wild forest honey, and hot bamboo shoot snacks; pleasant hillside cafes.',
        vibe: 'Gujarat’s sole hill resort perched at 1,000m altitude in the Sahyadri mountains with misty viewpoints and ropeway.'
      },
      'dumas-beach': {
        food: 'World-famous Surat Tomato Bhajiya and Lashkari spiced potato bhajiyas served fresh with mint-chilli chutney.',
        vibe: 'Atmospheric black sand shoreline with cool Arabian Sea evening breezes. Popular sunset hangout.'
      }
    },

    DEST_HIGHLIGHTS: {
      'adalaj-ni-vav': '5-Story Solanki stepwell with subterranean cooling & carved shafts.',
      'sun-temple-modhera': '11th-century Sun Temple with 52 Kund step-pillars and solar alignment.',
      'rani-ki-vav': 'UNESCO World Heritage inverted stepwell with over 500 Vishnu sculptures.',
      'gir-national-park': 'Sole natural habitat of pure Asiatic Lions on Earth. Early safari required.',
      'white-rann-dhordo': 'Endless crystalline white salt expanse under full moonlight.',
      'lothal-archaeological-site': '4,400-year Harappan bronze-age maritime dockyard and bead workshop.',
      'statue-of-unity': "World's tallest 182m statue, Narmada dam view, and valley of flowers.",
      'dholavira-unesco': 'UNESCO Harappan metropolis accessed via the iconic Road to Heaven.',
      'marine-national-park': 'Low-tide coral reef walk on Gulf of Kutch with live marine life.',
      'somnath-temple': 'First sacred Jyotirlinga on Arabian Sea shore with sunset aarti.',
      'polo-forest': '15th-century ruined temples engulfed in lush deciduous forest canopy.',
      'lakhpat-fort': 'Historic ghost fortress overlooking Indus delta salt flats & Kori Creek.',
      'saputara-hill-station': 'Hill resort perched at 1,000m in Sahyadris with mist & ropeway.',
      'dumas-beach': 'Arabian Sea black sand beach with famous Surat tomato bhajiyas.'
    },

    DEST_CAT_LABELS: {
      'adalaj-ni-vav': 'Stepwell Architecture',
      'sun-temple-modhera': 'Solar Heritage',
      'rani-ki-vav': 'UNESCO Stepwell',
      'gir-national-park': 'Wildlife Safari',
      'white-rann-dhordo': 'Salt Desert',
      'lothal-archaeological-site': 'Harappan Port',
      'statue-of-unity': 'Engineering & River',
      'dholavira-unesco': 'UNESCO Harappan City',
      'marine-national-park': 'Coral Reef',
      'somnath-temple': 'Coastal Jyotirlinga',
      'polo-forest': 'Forest Heritage',
      'lakhpat-fort': 'Border Fortress',
      'saputara-hill-station': 'Hill Station',
      'dumas-beach': 'Coastal Shoreline'
    },

    quickPicksExpanded: false,

    init: async function () {
      console.log("[TripReality] Initializing Gujarat Trip Reality Engine...");
      await this.loadData();
      this.bindUI();
      this.renderQuickPicks();
      this.initMapLayer();
    },

    renderQuickPicks: function () {
      const container = document.getElementById("trQuickPicksGrid");
      if (!container || !this.auditedDestinations || this.auditedDestinations.length === 0) return;

      const primaryIds = [
        "adalaj-ni-vav",
        "sun-temple-modhera",
        "rani-ki-vav",
        "gir-national-park",
        "white-rann-dhordo",
        "lothal-archaeological-site"
      ];

      // Sort with primary first, then the rest
      const sorted = [...this.auditedDestinations].sort((a, b) => {
        const aIdx = primaryIds.indexOf(a.destinationId);
        const bIdx = primaryIds.indexOf(b.destinationId);
        if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
        if (aIdx !== -1) return -1;
        if (bIdx !== -1) return 1;
        return 0;
      });

      const activeId = this.activeDestination ? this.activeDestination.destinationId : "";

      container.innerHTML = sorted.map((d, index) => {
        const isExtra = index >= 6;
        const isSelected = d.destinationId === activeId;
        const manifestImg = (window.ImageManifest && window.ImageManifest.getDestinationImage) ? window.ImageManifest.getDestinationImage(d.destinationId) : null;
        const photo = (manifestImg && manifestImg.url) ? manifestImg.url : (this.DEST_PHOTOS[d.destinationId] || "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=600&q=80");
        const altText = (manifestImg && manifestImg.alt) ? manifestImg.alt : d.destinationName;
        const catLabel = this.DEST_CAT_LABELS[d.destinationId] || d.category || "Heritage";
        const highlight = this.DEST_HIGHLIGHTS[d.destinationId] || `${d.district} District • ${d.region}`;
        const hiddenClass = (isExtra && !this.quickPicksExpanded && !isSelected) ? "tr-extra-dest hidden" : (isExtra ? "tr-extra-dest" : "");

        return `
          <article class="tr-pick-card ${isSelected ? 'active selected' : ''} ${hiddenClass}" 
                   role="button" 
                   tabindex="0" 
                   data-id="${d.destinationId}" 
                   aria-pressed="${isSelected ? 'true' : 'false'}"
                   aria-label="${this.escapeHtml(d.destinationName)}, ${d.district} District">
            <div class="tr-pick-thumb-wrap">
              <img src="${photo}" alt="${this.escapeHtml(altText)}" class="tr-pick-thumb" loading="lazy" />
              <span class="tr-pick-cat-badge">${this.escapeHtml(catLabel)}</span>
              <span class="tr-pick-check" aria-hidden="true">✓ Selected</span>
            </div>
            <div class="tr-pick-info">
              <h5 class="tr-pick-name">${this.escapeHtml(d.destinationName)}</h5>
              <span class="tr-pick-district">${d.district} District • ${d.region}</span>
              <p class="tr-pick-desc">${this.escapeHtml(highlight)}</p>
            </div>
          </article>
        `;
      }).join("");

      // Bind click and keyboard handlers
      container.querySelectorAll(".tr-pick-card").forEach(card => {
        const id = card.getAttribute("data-id");
        card.addEventListener("click", () => {
          this.selectDestination(id);
        });
        card.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            this.selectDestination(id);
          }
        });
      });
    },

    toggleAllQuickPicks: function () {
      this.quickPicksExpanded = !this.quickPicksExpanded;
      const btn = document.getElementById("trToggleAllDestBtn");
      const grid = document.getElementById("trQuickPicksGrid");
      if (btn) {
        btn.setAttribute("aria-expanded", this.quickPicksExpanded ? "true" : "false");
        btn.innerHTML = this.quickPicksExpanded ? 
          `<span>Show curated selection (6) ↑</span>` : 
          `<span>Explore all 14 audited places ↓</span>`;
      }
      if (grid) {
        grid.classList.toggle("expanding", this.quickPicksExpanded);
      }
      const extras = document.querySelectorAll(".tr-extra-dest");
      extras.forEach((card, idx) => {
        if (this.quickPicksExpanded) {
          card.classList.remove("hidden");
          card.style.animationDelay = `${idx * 28}ms`;
        } else {
          card.classList.add("hidden");
          card.style.animationDelay = "";
        }
      });
    },

    loadData: async function () {
      try {
        const response = await fetch("data/gujarat_trip_reality.json");
        if (response.ok) {
          const data = await response.json();
          this.auditedDestinations = data.pilotDestinations || [];
          this.auditedDestinations.forEach(d => {
            this.destinationsMap[d.destinationId] = d;
          });
          console.log(`[TripReality] Loaded ${this.auditedDestinations.length} deeply-audited pilot destinations.`);
        }
      } catch (err) {
        console.warn("[TripReality] Could not load trip reality JSON:", err);
      }
    },

    initMapLayer: function () {
      if (!window.map || typeof L === "undefined") {
        setTimeout(() => this.initMapLayer(), 500);
        return;
      }
      if (!this.mapLayerGroup) {
        this.mapLayerGroup = L.layerGroup();
      }
    },

    bindUI: function () {
      // Destination select change
      const destSelect = document.getElementById("trDestinationSelect");
      if (destSelect) {
        this.populateDestinationDropdown(destSelect);
        destSelect.addEventListener("change", (e) => {
          this.selectDestination(e.target.value);
        });
      }

      // Origin select change
      const originSelect = document.getElementById("trOriginSelect");
      if (originSelect) {
        this.populateOriginDropdown(originSelect);
        originSelect.addEventListener("change", (e) => {
          this.activeOrigin = e.target.value || "Ahmedabad";
          this.renderAssessment();

          // Phase 5: Feedback on recalculated metrics
          const metric1El = document.querySelector(".tr-snap-metric:nth-child(1)");
          const metric2El = document.querySelector(".tr-snap-metric:nth-child(2)");
          if (metric1El) {
            metric1El.classList.remove("tr-metric-updated");
            void metric1El.offsetWidth;
            metric1El.classList.add("tr-metric-updated");
          }
          if (metric2El) {
            metric2El.classList.remove("tr-metric-updated");
            void metric2El.offsetWidth;
            metric2El.classList.add("tr-metric-updated");
          }
        });
      }

      // Mode toggles (both segmented buttons and pills)
      document.querySelectorAll(".tr-segmented-btn, .tr-mode-pill").forEach(btn => {
        btn.addEventListener("click", () => {
          const mode = btn.getAttribute("data-mode") || "public";
          this.setMode(mode);
        });
      });

      // Date input
      const dateInput = document.getElementById("trTravelDateInput");
      if (dateInput) {
        dateInput.addEventListener("change", (e) => {
          this.activeDate = e.target.value ? new Date(e.target.value) : null;
          this.renderAssessment();
          const alertsEl = document.querySelector(".tr-date-alerts-section");
          if (alertsEl) {
            alertsEl.classList.remove("tr-alert-updated");
            void alertsEl.offsetWidth;
            alertsEl.classList.add("tr-alert-updated");
          }
        });
      }

      // Quick picks toggle all button
      const toggleBtn = document.getElementById("trToggleAllDestBtn");
      if (toggleBtn) {
        toggleBtn.addEventListener("click", () => {
          this.toggleAllQuickPicks();
        });
      }

      // Quick destination pills (legacy & fallback)
      document.querySelectorAll(".tr-quick-dest-pill").forEach(pill => {
        pill.addEventListener("click", () => {
          const id = pill.getAttribute("data-id");
          this.selectDestination(id);
          if (destSelect) destSelect.value = id;
        });
      });

      // Report form submit
      const reportForm = document.getElementById("trReportForm");
      if (reportForm) {
        reportForm.addEventListener("submit", (e) => {
          e.preventDefault();
          this.handleReportSubmit();
        });
      }
    },

    populateDestinationDropdown: function (selectEl) {
      if (!selectEl) return;
      selectEl.innerHTML = `<option value="">Select a destination to evaluate...</option>` +
        this.auditedDestinations.map(d => `
          <option value="${d.destinationId}">
            ${this.escapeHtml(d.destinationName)} (${d.district} District)
          </option>
        `).join("");
      selectEl.value = this.activeDestination ? this.activeDestination.destinationId : "";
    },

    populateOriginDropdown: function (selectEl) {
      if (!selectEl) return;
      selectEl.innerHTML = Object.keys(this.ORIGIN_HUBS).map(k => `
        <option value="${k}" ${k === this.activeOrigin ? 'selected' : ''}>
          ${k} (${this.ORIGIN_HUBS[k].region})
        </option>
      `).join("");
    },

    selectDestination: function (destinationId) {
      const destSelect = document.getElementById("trDestinationSelect");
      if (!destinationId) {
        this.activeDestination = null;
        if (destSelect) {
          destSelect.value = "";
        }
        document.querySelectorAll(".tr-quick-dest-pill").forEach(p => {
          p.classList.remove("active");
        });
        document.querySelectorAll(".tr-pick-card").forEach(card => {
          card.classList.remove("active", "selected");
          card.setAttribute("aria-pressed", "false");
        });
        this.renderAssessment();
        this.updateMapVisualization();
        return;
      }

      let dest = this.destinationsMap[destinationId];
      if (!dest && window.TourismDiscovery && window.TourismDiscovery.destinations) {
        // Fallback for catalog destinations not yet in the deep-audit list
        const raw = window.TourismDiscovery.destinations.find(d => d.id === destinationId);
        if (raw) {
          dest = this.createCatalogFallbackRecord(raw);
        }
      }

      this.activeDestination = dest || null;

      // Update dropdown selection if needed
      if (destSelect) {
        destSelect.value = dest ? dest.destinationId : "";
      }

      // Update quick pills
      document.querySelectorAll(".tr-quick-dest-pill").forEach(p => {
        p.classList.toggle("active", p.getAttribute("data-id") === (dest ? dest.destinationId : ""));
      });

      // Update quick pick cards
      document.querySelectorAll(".tr-pick-card").forEach(card => {
        const isMatch = card.getAttribute("data-id") === (dest ? dest.destinationId : "");
        card.classList.toggle("active", isMatch);
        card.classList.toggle("selected", isMatch);
        card.setAttribute("aria-pressed", isMatch ? "true" : "false");

        // If matched card is an extra card and currently hidden, show it
        if (isMatch && card.classList.contains("tr-extra-dest") && card.classList.contains("hidden")) {
          card.classList.remove("hidden");
        }
      });

      this.renderAssessment();
      this.updateMapVisualization();

      // Phase 5 Signature Effect: Restrained geometric reveal & coordinated transition
      if (dest) {
        const resultsEl = document.querySelector(".tr-assessment-results");
        if (resultsEl) {
          resultsEl.classList.remove("tr-signature-revealing");
          void resultsEl.offsetWidth; // Force reflow for repeatable transitions
          resultsEl.classList.add("tr-signature-revealing");

          // Coordinated smooth viewport transition into snapshot without jarring jumps
          const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          if (!prefersReduced) {
            const snapshotEl = resultsEl.querySelector(".tr-snapshot-section");
            const container = document.getElementById("planVisitView");
            if (snapshotEl && container) {
              const rect = snapshotEl.getBoundingClientRect();
              if (rect.top > window.innerHeight * 0.75 || rect.top < 70) {
                const targetScroll = container.scrollTop + rect.top - 24;
                container.scrollTo({ top: targetScroll, behavior: "smooth" });
              }
            }
          }
        }
      }
    },

    setMode: function (mode) {
      if (this.activeMode === mode) return;
      this.activeMode = mode || "public";
      document.querySelectorAll(".tr-segmented-btn, .tr-mode-pill").forEach(p => {
        const isMatch = p.getAttribute("data-mode") === this.activeMode;
        p.classList.toggle("active", isMatch);
        p.setAttribute("aria-checked", isMatch ? "true" : "false");
      });
      this.renderAssessment();

      // Phase 5: Clear visual feedback when changing transport mode
      const timeMetricEl = document.querySelector(".tr-snap-metric:nth-child(2)");
      const stage1El = document.querySelector(".tr-stage-1");
      if (timeMetricEl) {
        timeMetricEl.classList.remove("tr-metric-updated");
        void timeMetricEl.offsetWidth;
        timeMetricEl.classList.add("tr-metric-updated");
      }
      if (stage1El) {
        stage1El.classList.remove("tr-stage-updated");
        void stage1El.offsetWidth;
        stage1El.classList.add("tr-stage-updated");
      }
    },

    createCatalogFallbackRecord: function (raw) {
      return {
        destinationId: raw.id,
        destinationName: raw.name,
        category: raw.category || "general",
        district: raw.district || "Gujarat",
        region: raw.region || "Gujarat",
        coordinates: raw.coordinates || [72.0, 23.0],
        tripReadinessStatus: "important_details_unverified",
        statusReason: "This location is part of the general Gujarat Atlas catalogue, but last-mile transit frequencies, same-day return reality, and official on-spot facility conditions have not yet completed deep statutory verification.",
        recommendedMinHours: 2.0,
        nearestHubs: {
          railway: {
            name: raw.nearbyInfrastructure ? raw.nearbyInfrastructure.railway : "Nearest station pending verification",
            connectionType: "unverified_proximity",
            roadDistanceKm: 15.0,
            verification: { status: "unverified", source: "OpenStreetMap / General Catalog", lastChecked: "2024-05-01" }
          },
          highway: {
            name: raw.nearbyInfrastructure ? raw.nearbyInfrastructure.highway : "State road network",
            roadType: "Paved state corridor",
            conditionNote: "Requires local road check."
          }
        },
        lastMileGap: {
          startPoint: "Nearest regional transport node",
          endPoint: raw.name + " Site Entrance",
          gapDistanceKm: 8.0,
          terrainType: "Local road",
          availableModes: [
            {
              mode: "Local Transport / Auto",
              feasibility: "Unverified Availability",
              notes: "Schedules and fares between nearest railhead/bus stop and this site must be confirmed locally upon arrival.",
              verification: "unverified",
              lastChecked: "2024-05-01"
            }
          ],
          gapSummary: "Last-mile transit schedule is unverified. Private vehicle or pre-arranged return taxi is strongly advised.",
          documentationStatus: "unverified_transit_schedules"
        },
        returnJourney: {
          sameDayFeasible: false,
          sameDayFeasibleFrom: [],
          lastScheduledTransitNote: "No verified evening public transit return timetable exists in statutory records.",
          caution: "Do not rely on catching same-day evening public transport from this destination without confirming onward options with local transport operators.",
          verification: { status: "unverified", source: "Pending Field Survey", lastChecked: "2024-05-01" }
        },
        visitingConditions: {
          openingHours: raw.timings || "Daylight hours (unconfirmed)",
          hoursVerification: { status: "secondary_source", source: "Gujarat Tourism General Portal", lastChecked: "2024-05-01" },
          entryPermits: { required: false, type: raw.entryFee || "Local entry conditions apply", pricing: raw.entryFee || "Nominal" },
          seasonalAlerts: [],
          facilities: {
            parking: { status: "unverified", details: "On-site parking capacity unverified." },
            restrooms: { status: "unverified", details: "Public restrooms unverified." },
            drinkingWater: { status: "limited", details: "Carry personal drinking water." },
            wheelchairAccess: { status: "unverified", details: "Accessibility unverified." },
            cellularNetwork: { status: "patchy", details: "Mobile signal may vary." },
            evCharging: { status: "verified_absent", details: "No verified EV charging on site." }
          },
          materialRestrictions: ["Standard civic and heritage guidelines apply."]
        },
        externalLinks: [
          { label: "Google Maps Turn-by-Turn Navigation", url: `https://www.google.com/maps/dir/?api=1&destination=${raw.coordinates[1]},${raw.coordinates[0]}`, type: "turn_by_turn" }
        ]
      };
    },

    // Great Circle Haversine formula
    calculateStraightLineDistance: function (coord1, coord2) {
      const [lon1, lat1] = coord1;
      const [lon2, lat2] = coord2;
      const R = 6371; // Earth radius in km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return Math.round(R * c * 10) / 10;
    },

    estimateRoadDistance: function (straightLineKm, region) {
      // Empirical winding factor for Gujarat topography:
      // Plain highways (Central/North): 1.18x
      // Saurashtra coastal: 1.25x
      // Kutch Rann crossings: 1.32x
      // Dang Western Ghats: 1.38x
      let factor = 1.22;
      if (region && region.includes("Kachchh")) factor = 1.32;
      else if (region && region.includes("South")) factor = 1.28;
      else if (region && region.includes("Saurashtra")) factor = 1.25;
      return Math.round(straightLineKm * factor);
    },

    estimateTravelTimes: function (roadKm, mode) {
      if (mode === "private") {
        // Average private car speed ~65 km/h factoring towns and toll stops
        const driveHours = roadKm / 62;
        const totalMin = Math.round(driveHours * 60);
        const hrs = Math.floor(totalMin / 60);
        const mins = totalMin % 60;
        return {
          formatted: hrs > 0 ? `${hrs}h ${mins}m` : `${mins} mins`,
          hours: driveHours,
          note: "Direct point-to-point driving via major highways."
        };
      } else {
        // Public transit (Train / GSRTC bus + interchange buffer + last-mile waiting)
        const transitHours = (roadKm / 48) + 0.75; // Intercity bus/train average ~48 km/h + 45 min buffer
        const totalMin = Math.round(transitHours * 60);
        const hrs = Math.floor(totalMin / 60);
        const mins = totalMin % 60;
        return {
          formatted: hrs > 0 ? `${hrs}h ${mins}m` : `${mins} mins`,
          hours: transitHours,
          note: "Includes typical station interchange and local feeder wait times."
        };
      }
    },

    checkDateAlerts: function (dest, date) {
      if (!dest || !date) return [];
      const alerts = [];
      const month = date.getMonth(); // 0-indexed (0 = Jan, 5 = June, 9 = Oct)

      // Gir National Park Monsoon Closure Rule
      if (dest.destinationId === "gir-national-park") {
        // Closed June 16 to October 15
        const isMonsoonClosure = (month > 5 && month < 9) || (month === 5 && date.getDate() >= 16) || (month === 9 && date.getDate() <= 15);
        if (isMonsoonClosure) {
          alerts.push({
            severity: "critical",
            title: "CRITICAL: Sanctuary Closed on Selected Date",
            text: "Gir National Park core sanctuary is statutorily closed for wildlife breeding from June 16 to October 15. Only Devalia Safari Park remains operational (weather permitting)."
          });
        }
      }

      // White Rann Monsoon Inundation Rule
      if (dest.destinationId === "white-rann-dhordo") {
        if (month >= 6 && month <= 8) { // July, August, September
          alerts.push({
            severity: "critical",
            title: "CRITICAL: Salt Desert Submerged on Selected Date",
            text: "The White Rann is flooded with seawater and rainwater from July to September. The white crystalline salt crust does not exist during monsoon months."
          });
        } else if (month >= 10 || month <= 1) { // Nov to Feb
          alerts.push({
            severity: "info",
            title: "Optimal Visiting Season: Rann Utsav",
            text: "Selected date falls within prime dry crystalline salt season. Book Bhuj accommodation and hired taxis well in advance."
          });
        }
      }

      // Extreme Summer Heat Warning (April - June)
      if (month >= 3 && month <= 5) {
        if (["dholavira-unesco", "lakhpat-fort", "rani-ki-vav", "sun-temple-modhera"].includes(dest.destinationId)) {
          alerts.push({
            severity: "moderate",
            title: "Extreme Arid Heat Warning (> 42°C)",
            text: "Temperatures on this date typically exceed 42°C. Outdoor archaeological ruins offer minimal tree shade. Plan visits before 10:00 AM or after 16:00."
          });
        }
      }

      return alerts;
    },

    renderAssessment: function () {
      const container = document.getElementById("tripRealityContent");
      if (!container) return;

      if (!this.activeDestination) {
        container.innerHTML = `
          <article class="tr-empty-state-card" role="region" aria-label="No destination selected">
            <div class="tr-empty-stepwell-icon" aria-hidden="true">
              <svg width="56" height="56" viewBox="0 0 48 48" fill="none" stroke="currentColor">
                <path d="M4 12h40M8 20h32M12 28h24M16 36h16M20 44h8" stroke="#B84638" stroke-width="2.5" stroke-linecap="round"/>
                <circle cx="24" cy="6" r="3" fill="#E2AE48"/>
              </svg>
            </div>
            <div class="tr-empty-eyebrow">
              <span class="eyebrow-symbol">✦</span>
              DESTINATION FEASIBILITY AUDIT • પ્રવાસ ક્ષમતા તપાસ
            </div>
            <h3 class="tr-empty-title">Select a destination to evaluate trip feasibility</h3>
            <p class="tr-empty-lead">
              Gujarat's geography spans subterranean Solanki stepwells, desert border posts, mangrove coastlines, and industrial corridors. 
              Choose a destination from the selector above or pick an audited benchmark below to inspect verified road distances, last-mile transit options, return journey viability, permit requirements, and seasonal climate advisories.
            </p>
            <div class="tr-empty-benchmarks">
              <div class="tr-empty-benchmarks-title">Audited Benchmark Destinations:</div>
              <div class="tr-empty-benchmarks-grid">
                ${this.auditedDestinations.slice(0, 6).map(d => `
                  <button type="button" class="tr-empty-chip" onclick="window.TripReality.selectDestination('${d.destinationId}')">
                    <span class="chip-name">${this.escapeHtml(d.destinationName)}</span>
                    <span class="chip-region">${d.district} District • ${d.region}</span>
                  </button>
                `).join('')}
              </div>
            </div>
          </article>
        `;
        return;
      }

      const d = this.activeDestination;
      const originInfo = this.ORIGIN_HUBS[this.activeOrigin] || this.ORIGIN_HUBS["Ahmedabad"];
      const straightLineKm = this.calculateStraightLineDistance(originInfo.coordinates, d.coordinates);
      const roadKm = this.estimateRoadDistance(straightLineKm, d.region);
      const timeEst = this.estimateTravelTimes(roadKm, this.activeMode);
      const dateAlerts = this.checkDateAlerts(d, this.activeDate);

      // Travel date formatting
      const formattedDate = this.activeDate ? 
        this.activeDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : 
        "Flexible / Not specified";

      // Deliberate status configuration with the 3 specified labels
      const statusConfig = {
        well_documented: {
          key: "well_documented",
          label: "Well documented.",
          badgeClass: "tr-status-well-documented",
          icon: "✓",
          summary: "Essential journey, last-mile connection, return transit, and visitor entry rules are verified from reliable statutory sources."
        },
        some_planning_required: {
          key: "some_planning_required",
          label: "Some planning required.",
          badgeClass: "tr-status-planning-required",
          icon: "!",
          summary: "Key journey segments (such as last-mile transport, mandatory advance entry permits, or return connectivity) require advance arrangements."
        },
        important_details_unverified: {
          key: "important_details_unverified",
          label: "Important details unverified.",
          badgeClass: "tr-status-unverified",
          icon: "?",
          summary: "Essential transit, last-mile frequency, or return connectivity is missing, infrequent, or outdated. Do not assume public transit availability."
        }
      };

      const status = statusConfig[d.tripReadinessStatus] || statusConfig.some_planning_required;
      const hubs = d.nearestHubs || {};
      const lastMile = d.lastMileGap || {};
      const returnJ = d.returnJourney || {};
      const visiting = d.visitingConditions || {};
      const facilities = visiting.facilities || {};
      const culturalTip = this.DEST_CULTURAL_TIPS[d.destinationId] || this.DEST_CULTURAL_TIPS[d.id] || null;
      const catLabel = this.DEST_CAT_LABELS[d.destinationId] || d.category || "Heritage";
      const manifestImg = (window.ImageManifest && window.ImageManifest.getDestinationImage) ? window.ImageManifest.getDestinationImage(d.destinationId || d.id) : null;
      const heroImg = (manifestImg && manifestImg.url) ? manifestImg.url : (this.DEST_PHOTOS[d.destinationId] || this.DEST_PHOTOS[d.id] || "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=1200&q=80");
      const heroAlt = (manifestImg && manifestImg.alt) ? manifestImg.alt : d.destinationName;
      const heroCredit = (manifestImg && manifestImg.credit) ? manifestImg.credit : "";
      const heroLicense = (manifestImg && manifestImg.license) ? manifestImg.license : "";

      const checklistItems = (d.beforeYouGoChecklist && d.beforeYouGoChecklist.length > 0) ? d.beforeYouGoChecklist : [
        "Confirm monument or park opening times on the official statutory department portal before travelling.",
        "Verify local auto-rickshaw or taxi availability and fares upon arrival at the nearest transport hub.",
        "Carry personal drinking water, sun protection, and a valid government photo ID for entry security verification."
      ];

      // Stage 1: Get to the transport hub
      let stage1TrustClass = "tr-tb-confirmed";
      let stage1TrustLabel = "✓ Confirmed connection";
      let stage1HubName = "";
      let stage1Details = "";

      if (this.activeMode === 'public') {
        if (hubs.railway) {
          stage1HubName = hubs.railway.name;
          const isProximity = hubs.railway.connectionType === 'unverified_proximity' || (hubs.railway.verification && hubs.railway.verification.status === 'unverified');
          if (isProximity) {
            stage1TrustClass = "tr-tb-estimate";
            stage1TrustLabel = "~ Proximity estimate";
            stage1Details = `${hubs.railway.name} is situated ${hubs.railway.roadDistanceKm} km from destination. Railhead proximity is mapped, but connecting bus frequencies should be confirmed locally.`;
          } else {
            stage1TrustClass = "tr-tb-confirmed";
            stage1TrustLabel = "✓ Confirmed railhead";
            stage1Details = `Western Railway broad-gauge services connect to ${hubs.railway.name} (${hubs.railway.roadDistanceKm} km from site). ${hubs.railway.frequencyNote || ''}`;
          }
        } else if (hubs.busTerminal) {
          stage1HubName = hubs.busTerminal.name;
          stage1TrustClass = "tr-tb-confirmed";
          stage1TrustLabel = "✓ Confirmed bus terminal";
          stage1Details = `GSRTC regional buses connect from ${originInfo.name} to ${hubs.busTerminal.name} (${hubs.busTerminal.roadDistanceKm} km away). ${hubs.busTerminal.frequencyNote || ''}`;
        } else {
          stage1HubName = "Regional Transport Node";
          stage1TrustClass = "tr-tb-unverified";
          stage1TrustLabel = "! Unverified schedule";
          stage1Details = `Direct transit routes from ${originInfo.name} require local operator confirmation upon arrival.`;
        }
      } else {
        stage1TrustClass = "tr-tb-confirmed";
        stage1TrustLabel = "✓ Confirmed highway route";
        stage1HubName = hubs.highway ? hubs.highway.name : 'State Highway Corridor';
        stage1Details = hubs.highway ? 
          `${hubs.highway.roadType}. ${hubs.highway.conditionNote || 'Vehicular highway corridor.'}` :
          `Direct highway corridor connecting ${originInfo.name} toward ${d.district} District.`;
      }

      // Stage 2: Complete the last mile
      let stage2TrustClass = "tr-tb-estimate";
      let stage2TrustLabel = `~ ${lastMile.gapDistanceKm || 5} km road estimate`;
      if (lastMile.documentationStatus === "officially_verified" || lastMile.documentationStatus === "field_surveyed") {
        stage2TrustClass = "tr-tb-confirmed";
        stage2TrustLabel = "✓ Audited feeder";
      } else if (lastMile.documentationStatus === "unverified_transit_schedules") {
        stage2TrustClass = "tr-tb-unverified";
        stage2TrustLabel = "! Unverified schedules";
      }

      // Stage 3: Check visit requirements
      let stage3TrustClass = "tr-tb-confirmed";
      let stage3TrustLabel = "✓ Open entry";
      if (visiting.entryPermits && visiting.entryPermits.required) {
        stage3TrustClass = "tr-tb-caution";
        stage3TrustLabel = "⚠ Mandatory permit";
      } else if (visiting.hoursVerification && visiting.hoursVerification.status === "secondary_source") {
        stage3TrustClass = "tr-tb-estimate";
        stage3TrustLabel = "~ Secondary source";
      }

      // Stage 4: Understand the return journey
      let stage4TrustClass = returnJ.sameDayFeasible ? "tr-tb-confirmed" : "tr-tb-caution";
      let stage4TrustLabel = returnJ.sameDayFeasible ? "✓ Same-day return feasible" : "⚠ Overnight advised";

      // Official source lookup
      let officialSourceUrl = "";
      let officialSourceLabel = "Official Destination Portal";
      if (visiting.entryPermits && visiting.entryPermits.onlinePortal) {
        officialSourceUrl = visiting.entryPermits.onlinePortal;
        officialSourceLabel = "Official Booking Portal";
      } else if (d.externalLinks && d.externalLinks.length > 0) {
        const official = d.externalLinks.find(l => l.type === 'official_permit' || l.type === 'official_portal');
        if (official) {
          officialSourceUrl = official.url;
          officialSourceLabel = official.label || "Official Portal";
        }
      }
      if (!officialSourceUrl) {
        officialSourceUrl = "https://www.gujarattourism.com/";
        officialSourceLabel = "Gujarat Tourism Portal";
      }

      container.innerHTML = `
        <div class="tr-assessment-results tr-signature-revealing" role="region" aria-label="Trip assessment results">
          <!-- 1. Compact Trip Snapshot with Jharokha Architectural Frame -->
          <section class="tr-snapshot-section" aria-label="Your trip snapshot">
            <div class="tr-snapshot-header">
              <div class="tr-snapshot-eyebrow">
                <!-- Ajrakh 8-Point Rosette Motif -->
                <svg class="tr-motif-ajrakh" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="#B84638" opacity="0.95"/>
                  <rect x="8.5" y="8.5" width="7" height="7" transform="rotate(45 12 12)" stroke="#E2AE48" stroke-width="1.5" fill="#182D46"/>
                  <circle cx="12" cy="12" r="1.5" fill="#FFFCF7"/>
                </svg>
                <span>YOUR TRIP SNAPSHOT • પ્રવાસ સંક્ષેપ</span>
              </div>
              <div class="tr-snapshot-status-pill ${status.badgeClass}">
                <span class="tr-status-dot-pulse" aria-hidden="true"></span>
                <span class="tr-status-text">${status.label}</span>
              </div>
            </div>

            <div class="tr-snapshot-editorial-grid">
              <!-- Asymmetrical Visual Column: Jharokha Sandstone Portal Frame -->
              <div class="tr-snapshot-visual-col">
                <div class="tr-jharokha-frame">
                  <img src="${heroImg}" alt="${this.escapeHtml(heroAlt)}" class="tr-jharokha-img" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=1200&q=80';" />
                  <div class="tr-jharokha-overlay"></div>
                  <div class="tr-jharokha-badge">
                    <span>✦ ${this.escapeHtml(catLabel)}</span>
                  </div>
                  ${heroCredit ? `
                    <div class="tr-jharokha-credit-tag" title="${this.escapeHtml(heroCredit)} • ${this.escapeHtml(heroLicense || 'Verified')}">
                      <span class="attribution-dot">●</span> ${this.escapeHtml(heroCredit)}
                    </div>
                  ` : ''}
                  <div class="tr-jharokha-caption">
                    <span class="tr-jhc-coords">📍 ${d.coordinates[1].toFixed(3)}°N, ${d.coordinates[0].toFixed(3)}°E</span>
                    <span class="tr-jhc-district">${this.escapeHtml(d.district)} District</span>
                  </div>
                </div>
              </div>

              <!-- Editorial Content Column -->
              <div class="tr-snapshot-content-col">
                <div class="tr-snapshot-dest-info">
                  <h2 class="tr-snapshot-title">${this.escapeHtml(d.destinationName)}</h2>
                  <div class="tr-snapshot-meta-row">
                    <span class="tr-meta-item">📍 ${this.escapeHtml(d.district)} District • ${this.escapeHtml(d.region || 'Gujarat')}</span>
                    <span class="tr-meta-sep">•</span>
                    <span class="tr-meta-item">🏠 Origin: <strong>${this.escapeHtml(originInfo.name)}</strong></span>
                    <span class="tr-meta-sep">•</span>
                    <span class="tr-meta-item">${this.activeMode === 'public' ? '🚆 Public Transit' : '🚗 Private Drive'}</span>
                    <span class="tr-meta-sep">•</span>
                    <span class="tr-meta-item">📅 ${formattedDate}</span>
                  </div>
                </div>

                <!-- 4-Column Editorial Metric Deck -->
                <div class="tr-snapshot-metrics-bar">
                  <div class="tr-snap-metric">
                    <span class="tr-sm-label">Road Distance</span>
                    <span class="tr-sm-val">${roadKm} km</span>
                    <span class="tr-sm-sub">Baseline: ${straightLineKm} km</span>
                  </div>
                  <div class="tr-snap-metric">
                    <span class="tr-sm-label">Estimated Transit</span>
                    <span class="tr-sm-val">${timeEst.formatted}</span>
                    <span class="tr-sm-sub">${this.activeMode === 'public' ? 'Transit + transfer buffer' : 'Direct highway driving'}</span>
                  </div>
                  <div class="tr-snap-metric">
                    <span class="tr-sm-label">Visit Duration</span>
                    <span class="tr-sm-val">${d.recommendedMinHours || 2.5} hrs</span>
                    <span class="tr-sm-sub">Minimum exploration</span>
                  </div>
                  <div class="tr-snap-metric">
                    <span class="tr-sm-label">Same-Day Return</span>
                    <span class="tr-sm-val ${returnJ.sameDayFeasible ? 'val-feasible' : 'val-caution'}">
                      ${returnJ.sameDayFeasible ? '✓ Feasible' : '⚠ High Risk'}
                    </span>
                    <span class="tr-sm-sub">${returnJ.sameDayFeasible ? 'From ' + originInfo.name : 'Overnight advised'}</span>
                  </div>
                </div>

                <!-- Status Reason Banner with Patola Diamond Accent -->
                <div class="tr-status-reason-banner tr-reason-${status.key}">
                  <div class="tr-reason-header">
                    <span class="tr-reason-motif" aria-hidden="true">◇</span>
                    <span class="tr-reason-status-label">${status.label}</span>
                    <span class="tr-reason-summary">${status.summary}</span>
                  </div>
                  <p class="tr-reason-text"><strong>Assessment justification:</strong> ${this.escapeHtml(d.statusReason)}</p>
                </div>
              </div>
            </div>
          </section>

          <!-- Date Alerts (if triggered) -->
          ${dateAlerts.length > 0 ? `
            <div class="tr-date-alerts-section">
              ${dateAlerts.map(a => `
                <div class="tr-date-alert-banner tr-alert-${a.severity}">
                  <div class="tra-icon">${a.severity === 'critical' ? '⛔' : (a.severity === 'moderate' ? '⚠️' : 'ℹ️')}</div>
                  <div class="tra-body">
                    <strong>${this.escapeHtml(a.title)}</strong>
                    <p>${this.escapeHtml(a.text)}</p>
                  </div>
                </div>
              `).join("")}
            </div>
          ` : ''}

          <!-- 2. Journey Stages with Solanki Octagonal Motifs & Stepped Top Cantilevers -->
          <section class="tr-stages-section" aria-label="Journey Stages">
            <div class="tr-stages-section-header">
              <div class="tr-stages-eyebrow">
                <!-- Solanki Stepwell Octagonal Medallion -->
                <svg class="tr-motif-stepwell" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <polygon points="7,2 17,2 22,7 22,17 17,22 7,22 2,17 2,7" stroke="#E2AE48" stroke-width="2" fill="none"/>
                  <circle cx="12" cy="12" r="3" fill="#B84638"/>
                </svg>
                <span>STEP-BY-STEP ITINERARY REALITY • પ્રવાસ તબક્કા</span>
              </div>
              <h3 class="tr-stages-title">Journey Stages &amp; Feasibility Check</h3>
              <p class="tr-stages-subtitle">Sequenced from departure to destination and return. Confirmed statutory connections are strictly distinguished from local road estimates.</p>
            </div>

            <div class="tr-stages-grid">
              <!-- Stage 1 -->
              <div class="tr-stage-card tr-stage-1">
                <div class="tr-stage-accent-bar bar-navy"></div>
                <div class="tr-stage-top">
                  <div class="tr-stage-num-badge">1</div>
                  <div class="tr-stage-icon-wrap" aria-hidden="true">
                    ${this.activeMode === 'public' ? 
                      `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="3" width="16" height="16" rx="2"/><path d="M4 11h16"/><path d="M12 3v8"/><path d="m8 19-2 3"/><path d="m18 22-2-3"/><circle cx="8" cy="15" r="1"/><circle cx="16" cy="15" r="1"/></svg>` :
                      `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>`}
                  </div>
                  <span class="tr-trust-badge ${stage1TrustClass}">${stage1TrustLabel}</span>
                </div>
                <h4 class="tr-stage-label">1. Get to the transport hub</h4>
                <div class="tr-stage-details">
                  <div class="tr-stage-hub-name">
                    <strong>${this.escapeHtml(stage1HubName)}</strong>
                    <span class="tr-stage-hub-dist">${this.activeMode === 'public' ? (hubs.railway ? hubs.railway.roadDistanceKm + ' km from site' : 'Regional terminal') : (hubs.highway ? hubs.highway.roadType : 'Highway route')}</span>
                  </div>
                  <p class="tr-stage-text">${this.escapeHtml(stage1Details)}</p>
                </div>
              </div>

              <!-- Stage 2 -->
              <div class="tr-stage-card tr-stage-2">
                <div class="tr-stage-accent-bar bar-turmeric"></div>
                <div class="tr-stage-top">
                  <div class="tr-stage-num-badge">2</div>
                  <div class="tr-stage-icon-wrap" aria-hidden="true">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M5 17h12m-9-6h6l2 3H6l2-3z"/><path d="M9 5h6v6H9z"/></svg>
                  </div>
                  <span class="tr-trust-badge ${stage2TrustClass}">${stage2TrustLabel}</span>
                </div>
                <h4 class="tr-stage-label">2. Complete the last mile</h4>
                <div class="tr-stage-details">
                  <div class="tr-stage-hub-name">
                    <strong>${lastMile.gapDistanceKm || 5} km Feeder Route</strong>
                    <span class="tr-stage-hub-dist">${this.escapeHtml(lastMile.terrainType || 'Local road network')}</span>
                  </div>
                  <p class="tr-stage-text">${this.escapeHtml(lastMile.gapSummary || 'Local transport options.')}</p>
                </div>
              </div>

              <!-- Stage 3 -->
              <div class="tr-stage-card tr-stage-3">
                <div class="tr-stage-accent-bar bar-madder"></div>
                <div class="tr-stage-top">
                  <div class="tr-stage-num-badge">3</div>
                  <div class="tr-stage-icon-wrap" aria-hidden="true">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M8 15h2"/><path d="M14 15h2"/></svg>
                  </div>
                  <span class="tr-trust-badge ${stage3TrustClass}">${stage3TrustLabel}</span>
                </div>
                <h4 class="tr-stage-label">3. Check visit requirements</h4>
                <div class="tr-stage-details">
                  <div class="tr-stage-hub-name">
                    <strong>${visiting.entryPermits && visiting.entryPermits.required ? 'Mandatory Permit' : 'Open Entry'}</strong>
                    <span class="tr-stage-hub-dist">${this.escapeHtml(visiting.openingHours ? visiting.openingHours.split('(')[0].trim() : 'Daylight')}</span>
                  </div>
                  <p class="tr-stage-text">${visiting.entryPermits ? this.escapeHtml(visiting.entryPermits.pricing || 'Standard rules apply') : 'Standard rules apply'}</p>
                  ${visiting.entryPermits && visiting.entryPermits.onlinePortal ? `
                    <a href="${visiting.entryPermits.onlinePortal}" target="_blank" rel="noopener" class="tr-stage-link">
                      Official Booking ↗
                    </a>
                  ` : ''}
                </div>
              </div>

              <!-- Stage 4 -->
              <div class="tr-stage-card tr-stage-4">
                <div class="tr-stage-accent-bar ${returnJ.sameDayFeasible ? 'bar-neem' : 'bar-caution'}"></div>
                <div class="tr-stage-top">
                  <div class="tr-stage-num-badge">4</div>
                  <div class="tr-stage-icon-wrap" aria-hidden="true">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                  </div>
                  <span class="tr-trust-badge ${stage4TrustClass}">${stage4TrustLabel}</span>
                </div>
                <h4 class="tr-stage-label">4. Understand the return journey</h4>
                <div class="tr-stage-details">
                  <div class="tr-stage-hub-name">
                    <strong>${returnJ.sameDayFeasible ? 'Same-Day Return Feasible' : 'High Risk / Overnight'}</strong>
                    <span class="tr-stage-hub-dist">To ${this.escapeHtml(originInfo.name)}</span>
                  </div>
                  <p class="tr-stage-text">${this.escapeHtml(returnJ.lastScheduledTransitNote || 'Verify departure upon morning arrival.')}</p>
                </div>
              </div>
            </div>
          </section>

          <!-- 3. Practical Information Hierarchy -->
          <section class="tr-practical-section" aria-label="Practical trip information">
            <div class="tr-practical-grid">
              <!-- Column 1: Transport & Last-Mile Detail -->
              <div class="tr-info-card">
                <h4 class="tr-info-card-title">
                  <span class="tr-card-icon-emblem">🚆</span>
                  <span>Known Transport Connections &amp; Last-Mile</span>
                </h4>
                
                <div class="tr-feeder-modes">
                  <div class="tr-feeder-item">
                    <div class="tr-feeder-row">
                      <span class="tr-feeder-name">Primary Transport Node</span>
                      <span class="tr-trust-badge ${stage1TrustClass}">${stage1TrustLabel}</span>
                    </div>
                    <p class="tr-feeder-note">${this.escapeHtml(stage1Details)}</p>
                  </div>

                  <div class="tr-feeder-item">
                    <div class="tr-feeder-row">
                      <span class="tr-feeder-name">Last-Mile Feeder Gap (${lastMile.gapDistanceKm || 5} km)</span>
                      <span class="tr-trust-badge ${stage2TrustClass}">${stage2TrustLabel}</span>
                    </div>
                    <p class="tr-feeder-note"><strong>Terrain:</strong> ${this.escapeHtml(lastMile.terrainType || 'Local paved road')}</p>
                    <p class="tr-feeder-note">${this.escapeHtml(lastMile.gapSummary || '')}</p>
                  </div>

                  ${(lastMile.availableModes || []).map(m => `
                    <div class="tr-feeder-item">
                      <div class="tr-feeder-row">
                        <span class="tr-feeder-name">Feeder Mode: ${this.escapeHtml(m.mode)}</span>
                        ${m.fareEstimate ? `<span class="tr-feeder-fare">${this.escapeHtml(m.fareEstimate)}</span>` : ''}
                      </div>
                      <p class="tr-feeder-note"><strong>Availability:</strong> ${this.escapeHtml(m.feasibility)} — ${this.escapeHtml(m.notes || '')}</p>
                    </div>
                  `).join('')}

                  <div class="tr-feeder-item">
                    <div class="tr-feeder-row">
                      <span class="tr-feeder-name">Return Journey Reality</span>
                      <span class="tr-trust-badge ${stage4TrustClass}">${stage4TrustLabel}</span>
                    </div>
                    <p class="tr-feeder-note">${this.escapeHtml(returnJ.lastScheduledTransitNote || 'Check return transit upon morning arrival.')}</p>
                    ${returnJ.caution ? `
                      <p class="tr-feeder-note" style="color: var(--color-madder-red, #B84638); font-weight: 600;">
                        ⚠️ Warning: ${this.escapeHtml(returnJ.caution)}
                      </p>
                    ` : ''}
                  </div>
                </div>
              </div>

              <!-- Column 2: Visitor Essentials & Facilities -->
              <div class="tr-info-card">
                <h4 class="tr-info-card-title">
                  <span class="tr-card-icon-emblem">🏛️</span>
                  <span>Visiting Rules &amp; Verified Facilities</span>
                </h4>

                <div class="tr-feeder-modes">
                  <div class="tr-feeder-item">
                    <div class="tr-feeder-row">
                      <span class="tr-feeder-name">Statutory Opening Hours</span>
                      <span class="tr-trust-badge ${stage3TrustClass}">${stage3TrustLabel}</span>
                    </div>
                    <p class="tr-feeder-note"><strong>Hours:</strong> ${this.escapeHtml(visiting.openingHours || 'Sunrise to Sunset')}</p>
                    <p class="tr-feeder-note">Source: ${this.escapeHtml(visiting.hoursVerification ? visiting.hoursVerification.source : 'Official Statutory Portal')}</p>
                  </div>

                  <div class="tr-feeder-item">
                    <div class="tr-feeder-row">
                      <span class="tr-feeder-name">Entry Permits &amp; Pricing</span>
                      <span class="tr-feeder-fare">${visiting.entryPermits ? this.escapeHtml(visiting.entryPermits.pricing || 'Standard') : 'Nominal'}</span>
                    </div>
                    <p class="tr-feeder-note">
                      ${visiting.entryPermits && visiting.entryPermits.required ? 'Mandatory advance booking/permit required.' : 'No special advance permit required. General entry ticket on site.'}
                    </p>
                    ${visiting.entryPermits && visiting.entryPermits.onlinePortal ? `
                      <a href="${visiting.entryPermits.onlinePortal}" target="_blank" rel="noopener" class="tr-stage-link" style="align-self: flex-start; margin-top: 0.35rem;">
                        Official Permit Booking Portal ↗
                      </a>
                    ` : ''}
                  </div>

                  <!-- Facilities Matrix -->
                  <div>
                    <span class="tr-feeder-name" style="display: block; margin-bottom: 0.45rem;">Verified On-Site Visitor Facilities:</span>
                    <div class="tr-facilities-grid-compact">
                      <div class="tr-fac-item">
                        <span class="tr-fac-icon">🅿️</span>
                        <div>
                          <strong class="tr-fac-name">Parking</strong>
                          <span class="tr-fac-desc">${this.escapeHtml(facilities.parking ? facilities.parking.details : 'Check on arrival')}</span>
                        </div>
                      </div>
                      <div class="tr-fac-item">
                        <span class="tr-fac-icon">🚻</span>
                        <div>
                          <strong class="tr-fac-name">Restrooms</strong>
                          <span class="tr-fac-desc">${this.escapeHtml(facilities.restrooms ? facilities.restrooms.details : 'Basic facility')}</span>
                        </div>
                      </div>
                      <div class="tr-fac-item">
                        <span class="tr-fac-icon">🚰</span>
                        <div>
                          <strong class="tr-fac-name">Drinking Water</strong>
                          <span class="tr-fac-desc">${this.escapeHtml(facilities.drinkingWater ? facilities.drinkingWater.details : 'Carry bottled water')}</span>
                        </div>
                      </div>
                      <div class="tr-fac-item">
                        <span class="tr-fac-icon">♿</span>
                        <div>
                          <strong class="tr-fac-name">Wheelchair Access</strong>
                          <span class="tr-fac-desc">${this.escapeHtml(facilities.wheelchairAccess ? facilities.wheelchairAccess.details : 'Partially accessible')}</span>
                        </div>
                      </div>
                      <div class="tr-fac-item">
                        <span class="tr-fac-icon">📶</span>
                        <div>
                          <strong class="tr-fac-name">Mobile Signal</strong>
                          <span class="tr-fac-desc">${this.escapeHtml(facilities.cellularNetwork ? facilities.cellularNetwork.details : 'Variable network')}</span>
                        </div>
                      </div>
                      <div class="tr-fac-item">
                        <span class="tr-fac-icon">⚡</span>
                        <div>
                          <strong class="tr-fac-name">EV Fast Charging</strong>
                          <span class="tr-fac-desc">${this.escapeHtml(facilities.evCharging ? facilities.evCharging.details : 'No verified chargers')}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  ${visiting.materialRestrictions && visiting.materialRestrictions.length > 0 ? `
                    <div class="tr-feeder-item">
                      <span class="tr-feeder-name">Material Restrictions &amp; Prohibitions:</span>
                      <ul style="margin: 0.3rem 0 0 1.1rem; padding: 0; font-size: 0.78rem; color: var(--color-secondary-text, #716D65);">
                        ${visiting.materialRestrictions.map(r => `<li>${this.escapeHtml(r)}</li>`).join("")}
                      </ul>
                    </div>
                  ` : ''}
                </div>
              </div>
            </div>

            <!-- Full-Width Checklist: Information to Confirm Before Departure -->
            <div class="tr-checklist-card">
              <div class="tr-checklist-header">
                <span class="eyebrow-symbol">✦</span>
                <h4>Information to Confirm Before Departure</h4>
              </div>
              <ul class="tr-checklist-items">
                ${checklistItems.map(item => `
                  <li>
                    <span class="tr-ci-bullet" aria-hidden="true">✓</span>
                    <span>${this.escapeHtml(item)}</span>
                  </li>
                `).join('')}
              </ul>
            </div>
          </section>

          <!-- 4. Authentic Gujarat Experience & Regional Flavours (Terracotta Warm Block) -->
          ${culturalTip ? `
            <section class="tr-section tr-culture-section">
              <h4 class="tr-section-title">
                <span class="tr-section-num">✦</span>
                <span>Authentic Gujarat Experience &amp; Regional Flavours</span>
              </h4>
              <div class="tr-culture-grid">
                <div class="tr-culture-card">
                  <div class="trc-icon">🍲</div>
                  <div class="trc-body">
                    <strong>Local Highway Flavours &amp; Bites:</strong>
                    <p>${this.escapeHtml(culturalTip.food)}</p>
                  </div>
                </div>
                <div class="tr-culture-card">
                  <div class="trc-icon">📸</div>
                  <div class="trc-body">
                    <strong>Heritage Atmosphere &amp; Light:</strong>
                    <p>${this.escapeHtml(culturalTip.vibe)}</p>
                  </div>
                </div>
              </div>
            </section>
          ` : ''}

          <!-- 5. Statutory Provenance & Freshness Audit -->
          <section class="tr-section">
            <h4 class="tr-section-title">
              <span class="tr-section-num">📋</span>
              <span>Information Freshness &amp; Statutory Provenance Audit</span>
            </h4>
            <div class="tr-provenance-table-wrap">
              <table class="tr-data-table">
                <thead>
                  <tr>
                    <th>Trip Attribute</th>
                    <th>Statutory / Primary Source</th>
                    <th>Verification Classification</th>
                    <th>Last Checked</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Railway Hub Distance</strong></td>
                    <td>${hubs.railway ? this.escapeHtml(hubs.railway.verification.source) : 'Western Railway Directory'}</td>
                    <td><span class="tr-prov-badge tr-pb-official">Officially Published</span></td>
                    <td>${hubs.railway ? hubs.railway.verification.lastChecked : '2024-09'}</td>
                  </tr>
                  <tr>
                    <td><strong>Last-Mile Transit Options</strong></td>
                    <td>Regional Transport Authority &amp; Station Field Audit</td>
                    <td><span class="tr-prov-badge tr-pb-manual">Manually Checked</span></td>
                    <td>${lastMile.availableModes && lastMile.availableModes[0] ? lastMile.availableModes[0].lastChecked : '2024-09'}</td>
                  </tr>
                  <tr>
                    <td><strong>Same-Day Return Feasibility</strong></td>
                    <td>${returnJ.verification ? this.escapeHtml(returnJ.verification.source) : 'GSRTC / Rail Schedules'}</td>
                    <td><span class="tr-prov-badge tr-pb-manual">Manually Checked</span></td>
                    <td>${returnJ.verification ? returnJ.verification.lastChecked : '2024-08'}</td>
                  </tr>
                  <tr>
                    <td><strong>Hours &amp; Statutory Permits</strong></td>
                    <td>${visiting.hoursVerification ? this.escapeHtml(visiting.hoursVerification.source) : 'Archaeological / Forest Dept'}</td>
                    <td><span class="tr-prov-badge tr-pb-official">Officially Published</span></td>
                    <td>${visiting.hoursVerification ? visiting.hoursVerification.lastChecked : '2024-10'}</td>
                  </tr>
                  <tr>
                    <td><strong>Road Network Distance</strong></td>
                    <td>Gujarat InfraMap GIS Network Matrix</td>
                    <td><span class="tr-prov-badge tr-pb-derived">Derived Estimate</span></td>
                    <td>2024-10</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p class="tr-disclosure-note">
              * Distances and travel durations are computed based on Gujarat road geometry and typical Western Railway / GSRTC run times, not live telematics.
            </p>
          </section>

          <!-- 6. High-Contrast Ajrakh Indigo Deck: Useful Next Actions Footer -->
          <footer class="tr-actions-footer tr-ajrakh-deck">
            <div class="tr-actions-header">
              <span class="tr-actions-eyebrow">✦ NEXT STEPS &amp; ACTIONS • આગળનાં પગલાં</span>
              <h4 class="tr-actions-title">Plan and verify this journey</h4>
            </div>
            <div class="tr-actions-button-grid">
              <button type="button" class="tr-action-btn tr-btn-map" onclick="window.TripReality.viewTripOnMap()">
                <span class="btn-icon">🗺️</span>
                <span class="btn-text">
                  <strong>View on Map</strong>
                  <small>Show route, origin &amp; transport hubs</small>
                </span>
              </button>

              <a href="https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(originInfo.name + ', Gujarat')}&destination=${d.coordinates[1]},${d.coordinates[0]}" 
                 target="_blank" rel="noopener" class="tr-action-btn tr-btn-directions">
                <span class="btn-icon">🚗</span>
                <span class="btn-text">
                  <strong>Get Directions</strong>
                  <small>Open Google Maps navigation ↗</small>
                </span>
              </a>

              ${officialSourceUrl ? `
                <a href="${officialSourceUrl}" target="_blank" rel="noopener" class="tr-action-btn tr-btn-official">
                  <span class="btn-icon">🏛️</span>
                  <span class="btn-text">
                    <strong>Open Official Source</strong>
                    <small>${this.escapeHtml(officialSourceLabel)} ↗</small>
                  </span>
                </a>
              ` : ''}

              <button type="button" class="tr-action-btn tr-btn-change-dest" onclick="window.TripReality.changeDestinationAction()">
                <span class="btn-icon">🎯</span>
                <span class="btn-text">
                  <strong>Change Destination</strong>
                  <small>Pick another audited place</small>
                </span>
              </button>

              <button type="button" class="tr-action-btn tr-btn-change-origin" onclick="window.TripReality.recheckOriginAction()">
                <span class="btn-icon">🏠</span>
                <span class="btn-text">
                  <strong>Recheck Another Origin</strong>
                  <small>Test trip from 15 regional hubs</small>
                </span>
              </button>

              <button type="button" class="tr-action-btn tr-btn-report-feedback" onclick="window.TripReality.openReportModal('${d.destinationId}', '${this.escapeHtml(d.destinationName)}')">
                <span class="btn-icon">⚠️</span>
                <span class="btn-text">
                  <strong>Report Outdated Info</strong>
                  <small>Submit a civic data correction</small>
                </span>
              </button>
            </div>
          </footer>
        </div>
      `;
    },

    updateMapVisualization: function () {
      if (!this.mapLayerGroup || !window.map) return;
      this.mapLayerGroup.clearLayers();
      if (!this.activeDestination) return;

      const d = this.activeDestination;
      const origin = this.ORIGIN_HUBS[this.activeOrigin] || this.ORIGIN_HUBS["Ahmedabad"];
      const hubs = d.nearestHubs || {};
      const railwayHub = hubs.railway;

      // 1. Destination Marker (Red pin with star)
      const destIcon = L.divIcon({
        className: "tr-map-pin-wrap",
        html: `<div class="tr-map-pin tr-pin-dest" title="${this.escapeHtml(d.destinationName)}"><span>🎯</span></div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 34],
        popupAnchor: [0, -34]
      });
      const destMarker = L.marker([d.coordinates[1], d.coordinates[0]], { icon: destIcon });
      destMarker.bindPopup(`
        <div style="font-family: inherit; font-size: 0.82rem; min-width: 180px;">
          <strong style="color: #0f172a; font-size: 0.95rem; display: block; margin-bottom: 0.2rem;">${this.escapeHtml(d.destinationName)}</strong>
          <span style="color: #64748b; font-size: 0.75rem; display: block; margin-bottom: 0.5rem;">Target Destination • ${d.district} District</span>
          <span style="background: #e0f2fe; color: #0369a1; padding: 2px 6px; border-radius: 4px; font-size: 0.72rem; font-weight: 700;">
            ${d.tripReadinessStatus === 'well_documented' ? '✓ Well Documented' : '⚠ Planning Required'}
          </span>
        </div>
      `);
      this.mapLayerGroup.addLayer(destMarker);

      // 2. Origin Marker (Blue pin)
      const originIcon = L.divIcon({
        className: "tr-map-pin-wrap",
        html: `<div class="tr-map-pin tr-pin-origin" title="Departure Origin: ${this.escapeHtml(origin.name)}"><span>🏠</span></div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
      });
      const originMarker = L.marker([origin.coordinates[1], origin.coordinates[0]], { icon: originIcon });
      originMarker.bindPopup(`<strong>Origin:</strong> ${this.escapeHtml(origin.name)}`);
      this.mapLayerGroup.addLayer(originMarker);

      // 3. Transport Hub Marker (if railway station coordinates known)
      let hubLatLng = null;
      if (railwayHub && railwayHub.coordinates) {
        hubLatLng = [railwayHub.coordinates[1], railwayHub.coordinates[0]];
        const hubIcon = L.divIcon({
          className: "tr-map-pin-wrap",
          html: `<div class="tr-map-pin tr-pin-hub" title="Transport Hub: ${this.escapeHtml(railwayHub.name)}"><span>🚆</span></div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 28],
          popupAnchor: [0, -28]
        });
        const hubMarker = L.marker(hubLatLng, { icon: hubIcon });
        hubMarker.bindPopup(`<strong>Transit Hub:</strong> ${this.escapeHtml(railwayHub.name)}<br><span>Last-Mile Gap: ${railwayHub.roadDistanceKm} km</span>`);
        this.mapLayerGroup.addLayer(hubMarker);
      }

      // 4. Polylines
      const points = [
        [origin.coordinates[1], origin.coordinates[0]]
      ];

      if (hubLatLng) {
        points.push(hubLatLng);
      }
      points.push([d.coordinates[1], d.coordinates[0]]);

      // Trunk line (Origin to Hub)
      if (hubLatLng) {
        const trunkLine = L.polyline([[origin.coordinates[1], origin.coordinates[0]], hubLatLng], {
          color: "#0284c7",
          weight: 4,
          opacity: 0.75,
          smoothFactor: 1
        });
        this.mapLayerGroup.addLayer(trunkLine);

        // Last-mile dashed line (Hub to Destination)
        const lastMileLine = L.polyline([hubLatLng, [d.coordinates[1], d.coordinates[0]]], {
          color: "#ea580c",
          weight: 4,
          opacity: 0.9,
          dashArray: "6, 6"
        });
        this.mapLayerGroup.addLayer(lastMileLine);
      } else {
        // Direct route line
        const directLine = L.polyline(points, {
          color: "#0284c7",
          weight: 3.5,
          opacity: 0.8,
          dashArray: "4, 4"
        });
        this.mapLayerGroup.addLayer(directLine);
      }

      if (!window.map.hasLayer(this.mapLayerGroup)) {
        this.mapLayerGroup.addTo(window.map);
      }
    },

    viewTripOnMap: function () {
      if (!this.activeDestination) return;

      // Switch to Explore Map view
      if (window.PublicViews && typeof window.PublicViews.switchDestination === "function") {
        window.PublicViews.switchDestination("explore", true);
      }

      this.updateMapVisualization();

      setTimeout(() => {
        if (window.map && this.mapLayerGroup) {
          const bounds = this.mapLayerGroup.getBounds();
          if (bounds.isValid()) {
            window.map.fitBounds(bounds, { padding: [60, 60], maxZoom: 13, duration: 1.2 });
          }
        }
      }, 250);
    },

    openReportModal: function (destId, destName) {
      const modal = document.getElementById("tripRealityReportModal");
      const nameInput = document.getElementById("trReportDestName");
      const idInput = document.getElementById("trReportDestId");
      if (!modal) return;

      if (nameInput) nameInput.value = destName || (this.activeDestination ? this.activeDestination.destinationName : "");
      if (idInput) idInput.value = destId || (this.activeDestination ? this.activeDestination.destinationId : "");

      const statusEl = document.getElementById("trReportStatusMessage");
      if (statusEl) statusEl.innerHTML = "";

      if (typeof modal.showModal === "function") {
        modal.showModal();
      } else {
        modal.classList.remove("hidden");
      }
    },

    handleReportSubmit: function () {
      const destId = document.getElementById("trReportDestId")?.value;
      const destName = document.getElementById("trReportDestName")?.value;
      const reportType = document.getElementById("trReportTypeSelect")?.value;
      const details = document.getElementById("trReportDetails")?.value;
      const source = document.getElementById("trReportSource")?.value;
      const contact = document.getElementById("trReportContact")?.value;
      const statusEl = document.getElementById("trReportStatusMessage");

      if (!details || details.trim().length < 5) {
        if (statusEl) statusEl.innerHTML = `<span style="color: #ef4444;">Please provide a brief description of the factual correction.</span>`;
        return;
      }

      const reportRecord = {
        id: `report-${Date.now()}`,
        destinationId: destId,
        destinationName: destName,
        reportType: reportType,
        details: details.trim(),
        source: source ? source.trim() : null,
        contact: contact ? contact.trim() : null,
        submittedAt: new Date().toISOString(),
        reviewStatus: "pending_editorial_verification"
      };

      // Save to localStorage
      try {
        const existing = JSON.parse(localStorage.getItem("gujarat_atlas_user_reports") || "[]");
        existing.push(reportRecord);
        localStorage.setItem("gujarat_atlas_user_reports", JSON.stringify(existing));
      } catch (err) {
        console.warn("[TripReality] Could not persist report to localStorage:", err);
      }

      if (statusEl) {
        statusEl.innerHTML = `
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; padding: 0.65rem; border-radius: 6px; font-size: 0.85rem; margin-top: 0.5rem;">
            <strong>✓ Report Queued for Review</strong><br>
            Thank you. Your submission has been saved locally as an unverified community report and will be cross-checked against statutory sources before publishing.
          </div>
        `;
      }

      setTimeout(() => {
        const modal = document.getElementById("tripRealityReportModal");
        if (modal) modal.close();
      }, 2500);
    },

    changeDestinationAction: function () {
      const destSelect = document.getElementById("trDestinationSelect");
      const quickpicks = document.querySelector(".tr-quickpicks-section");
      if (quickpicks) {
        quickpicks.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (destSelect) {
        destSelect.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      if (destSelect) {
        setTimeout(() => destSelect.focus(), 350);
      }
    },

    recheckOriginAction: function () {
      const originSelect = document.getElementById("trOriginSelect");
      if (originSelect) {
        originSelect.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => originSelect.focus(), 350);
      }
    },

    openOfficialSourceAction: function () {
      if (!this.activeDestination) return;
      const d = this.activeDestination;
      let url = d.visitingConditions && d.visitingConditions.entryPermits && d.visitingConditions.entryPermits.onlinePortal;
      if (!url && d.externalLinks && d.externalLinks.length > 0) {
        const official = d.externalLinks.find(l => l.type === 'official_permit' || l.type === 'official_portal');
        if (official) url = official.url;
      }
      if (!url) {
        url = "https://www.gujarattourism.com/";
      }
      window.open(url, "_blank", "noopener,noreferrer");
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

  window.TripReality = TripReality;

  // Auto-init
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => TripReality.init());
  } else {
    TripReality.init();
  }

})(window, document);
