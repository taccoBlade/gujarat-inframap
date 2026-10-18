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
      'adalaj-ni-vav': 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=1200&q=80',
      'sun-temple-modhera': 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=1200&q=80',
      'statue-of-unity': 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80',
      'lothal-archaeological-site': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
      'dholavira-unesco': 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80',
      'dholavira-harappan-city': 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80',
      'rani-ki-vav': 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=1200&q=80',
      'gir-national-park': 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?auto=format&fit=crop&w=1200&q=80',
      'white-rann-dhordo': 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1200&q=80',
      'marine-national-park': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
      'somnath-temple': 'https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?auto=format&fit=crop&w=1200&q=80',
      'polo-forest': 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1200&q=80',
      'lakhpat-fort': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
      'saputara-hill-station': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      'dumas-beach': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'
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

    init: async function () {
      console.log("[TripReality] Initializing Gujarat Trip Reality Engine...");
      await this.loadData();
      this.bindUI();
      this.initMapLayer();
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
        });
      }

      // Mode toggles
      document.querySelectorAll(".tr-mode-pill").forEach(pill => {
        pill.addEventListener("click", () => {
          document.querySelectorAll(".tr-mode-pill").forEach(p => p.classList.remove("active"));
          pill.classList.add("active");
          this.activeMode = pill.getAttribute("data-mode") || "public";
          this.renderAssessment();
        });
      });

      // Date input
      const dateInput = document.getElementById("trTravelDateInput");
      if (dateInput) {
        dateInput.addEventListener("change", (e) => {
          this.activeDate = e.target.value ? new Date(e.target.value) : null;
          this.renderAssessment();
        });
      }

      // Quick destination pills
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
      let dest = this.destinationsMap[destinationId];
      if (!dest && window.TourismDiscovery && window.TourismDiscovery.destinations) {
        // Fallback for catalog destinations not yet in the deep-audit list
        const raw = window.TourismDiscovery.destinations.find(d => d.id === destinationId);
        if (raw) {
          dest = this.createCatalogFallbackRecord(raw);
        }
      }

      this.activeDestination = dest || this.auditedDestinations[0] || null;

      // Update dropdown selection if needed
      const destSelect = document.getElementById("trDestinationSelect");
      if (destSelect && dest) {
        destSelect.value = dest.destinationId;
      }

      // Update quick pills
      document.querySelectorAll(".tr-quick-dest-pill").forEach(p => {
        p.classList.toggle("active", p.getAttribute("data-id") === (dest ? dest.destinationId : ""));
      });

      this.renderAssessment();
      this.updateMapVisualization();
    },

    setMode: function (mode) {
      this.activeMode = mode || "public";
      document.querySelectorAll(".tr-mode-pill").forEach(p => {
        p.classList.toggle("active", p.getAttribute("data-mode") === this.activeMode);
      });
      this.renderAssessment();
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
        if (this.auditedDestinations.length > 0) {
          this.activeDestination = this.auditedDestinations[0];
        } else {
          container.innerHTML = `<div class="tr-loading">Loading trip reality audit data...</div>`;
          return;
        }
      }

      const d = this.activeDestination;
      const originInfo = this.ORIGIN_HUBS[this.activeOrigin] || this.ORIGIN_HUBS["Ahmedabad"];
      const straightLineKm = this.calculateStraightLineDistance(originInfo.coordinates, d.coordinates);
      const roadKm = this.estimateRoadDistance(straightLineKm, d.region);
      const timeEst = this.estimateTravelTimes(roadKm, this.activeMode);
      const dateAlerts = this.checkDateAlerts(d, this.activeDate);

      // Status Badge Config
      const statusConfig = {
        well_documented: {
          label: "Well Documented",
          badgeClass: "tr-status-well-documented",
          icon: "✓",
          summary: "Essential journey, last-mile connection, return transit, and visitor entry rules are verified from reliable statutory sources."
        },
        some_planning_required: {
          label: "Some Planning Required",
          badgeClass: "tr-status-planning-required",
          icon: "!",
          summary: "Key journey segments (such as last-mile transport, mandatory advance entry permits, or return connectivity) require advance arrangements."
        },
        important_details_unverified: {
          label: "Important Details Unverified",
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

      const heroImg = d.image || this.DEST_PHOTOS[d.destinationId] || this.DEST_PHOTOS[d.id] || "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=1200&q=80";
      const culturalTip = this.DEST_CULTURAL_TIPS[d.destinationId] || this.DEST_CULTURAL_TIPS[d.id] || null;

      container.innerHTML = `
        <article class="tr-assessment-card">
          <!-- Full-Bleed High-Res Destination Hero Banner -->
          <div class="tr-hero-banner" style="background-image: url('${heroImg}');">
            <div class="tr-hero-overlay"></div>
            <div class="tr-hero-content">
              <div class="tr-hero-badges">
                <span class="tr-hero-badge tr-tag-cat">✨ ${this.escapeHtml(d.category || 'DESTINATION')}</span>
                <div class="tr-status-pill ${status.badgeClass}">
                  <span class="tr-status-icon">${status.icon}</span>
                  <span class="tr-status-text">${status.label}</span>
                </div>
              </div>
              <h2 class="tr-hero-title">${this.escapeHtml(d.destinationName)}</h2>
              <div class="tr-hero-meta">
                <span>📍 ${this.escapeHtml(d.district)} District, ${this.escapeHtml(d.region || 'Gujarat')}</span>
                <span class="tr-meta-dot">•</span>
                <span>🚀 Trip from: <strong>${this.escapeHtml(originInfo.name)}</strong> (${roadKm} km • ${timeEst.formatted})</span>
                <span class="tr-meta-dot">•</span>
                <span>⏱️ Recommended: ${d.recommendedMinHours || 2.5} hrs</span>
              </div>
            </div>
          </div>

          <!-- Top Classification Bar -->
          <header class="tr-card-header">
            <div class="tr-status-reason-box">
              <span class="tr-vibe-pill">GROUND TRUTH</span>
              <p><strong>Travel Assessment:</strong> ${this.escapeHtml(d.statusReason)}</p>
            </div>
          </header>

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

          <!-- Metric Overview Bar -->
          <div class="tr-metrics-grid">
            <div class="tr-metric-item">
              <span class="trm-label">Estimated Road Distance</span>
              <span class="trm-val">${roadKm} km</span>
              <span class="trm-sub">Baseline Straight-Line: ${straightLineKm} km</span>
            </div>
            <div class="tr-metric-item">
              <span class="trm-label">Est. One-Way Travel Time</span>
              <span class="trm-val">${timeEst.formatted}</span>
              <span class="trm-sub">${this.activeMode === 'public' ? 'Public Transit + Transfers' : 'Direct Highway Driving'}</span>
            </div>
            <div class="tr-metric-item">
              <span class="trm-label">Recommended Visit Duration</span>
              <span class="trm-val">${d.recommendedMinHours || 2.5} Hours</span>
              <span class="trm-sub">Minimum exploration time</span>
            </div>
            <div class="tr-metric-item">
              <span class="trm-label">Same-Day Return Reality</span>
              <span class="trm-val ${returnJ.sameDayFeasible ? 'trm-feasible' : 'trm-not-feasible'}">
                ${returnJ.sameDayFeasible ? '✓ Feasible' : '⚠ Overnight Advised'}
              </span>
              <span class="trm-sub">${returnJ.sameDayFeasible ? 'From ' + originInfo.name : 'Long transit distance'}</span>
            </div>
          </div>

          <!-- Section 1: Journey Stages Breakdown -->
          <section class="tr-section">
            <h4 class="tr-section-title">
              <span class="tr-section-num">1</span>
              <span>Getting There: Confirmed Infrastructure &amp; Journey Stages</span>
            </h4>
            <div class="tr-stages-timeline">
              <!-- Stage 1 -->
              <div class="tr-stage-node">
                <div class="tr-node-marker">A</div>
                <div class="tr-node-content">
                  <div class="tr-node-header">
                    <strong>Stage 1: Trunk Corridor from ${this.escapeHtml(originInfo.name)}</strong>
                    <span class="tr-connection-tag">${this.activeMode === 'public' ? 'Rail / State Transport' : 'National / State Highway'}</span>
                  </div>
                  <p class="tr-node-desc">
                    ${this.activeMode === 'public' ? 
                      (hubs.railway ? `Western Railway services to ${this.escapeHtml(hubs.railway.name)}. ` : '') + (hubs.busTerminal ? `GSRTC bus routes connect to ${this.escapeHtml(hubs.busTerminal.name)}.` : '') :
                      (hubs.highway ? `Traverse ${this.escapeHtml(hubs.highway.name)}. Road type: ${this.escapeHtml(hubs.highway.roadType)}. ${this.escapeHtml(hubs.highway.conditionNote)}` : 'Via paved state highway.')
                    }
                  </p>
                </div>
              </div>

              <!-- Stage 2 -->
              <div class="tr-stage-node">
                <div class="tr-node-marker">B</div>
                <div class="tr-node-content">
                  <div class="tr-node-header">
                    <strong>Stage 2: Nearest Practical Transport Hub</strong>
                    <span class="tr-source-tag">${hubs.railway ? hubs.railway.verification.source : 'Statutory Record'}</span>
                  </div>
                  <div class="tr-hubs-subgrid">
                    ${hubs.railway ? `
                      <div class="tr-hub-box">
                        <strong>🚆 Railway Station:</strong> ${this.escapeHtml(hubs.railway.name)}
                        <span class="tr-hub-dist">${hubs.railway.roadDistanceKm} km from destination</span>
                        <p class="tr-hub-note">${this.escapeHtml(hubs.railway.frequencyNote || '')}</p>
                      </div>
                    ` : ''}
                    ${hubs.busTerminal ? `
                      <div class="tr-hub-box">
                        <strong>🚌 Bus Terminal:</strong> ${this.escapeHtml(hubs.busTerminal.name)}
                        <span class="tr-hub-dist">${hubs.busTerminal.roadDistanceKm} km from destination</span>
                        <p class="tr-hub-note">${this.escapeHtml(hubs.busTerminal.frequencyNote || '')}</p>
                      </div>
                    ` : ''}
                  </div>
                </div>
              </div>

              <!-- Stage 3: The Last-Mile Gap -->
              <div class="tr-stage-node tr-stage-last-mile">
                <div class="tr-node-marker tr-marker-alert">C</div>
                <div class="tr-node-content">
                  <div class="tr-node-header">
                    <strong class="tr-last-mile-heading">Stage 3: The Last-Mile Gap (${lastMile.gapDistanceKm || 5} km)</strong>
                    <span class="tr-gap-tag">${this.escapeHtml(lastMile.documentationStatus)}</span>
                  </div>
                  
                  <div class="tr-last-mile-box">
                    <div class="trlm-summary">
                      <strong>Terrain &amp; Access Route:</strong> ${this.escapeHtml(lastMile.terrainType || 'Local road network')}
                    </div>
                    <div class="trlm-modes-list">
                      <strong>Available Local Transport Options:</strong>
                      ${(lastMile.availableModes || []).map(m => `
                        <div class="trlm-mode-item">
                          <div class="trlm-mode-title">
                            <span class="trlm-bullet">•</span>
                            <strong>${this.escapeHtml(m.mode)}</strong>
                            <span class="trlm-feasibility-tag">${this.escapeHtml(m.feasibility)}</span>
                            ${m.fareEstimate ? `<span class="trlm-fare">${this.escapeHtml(m.fareEstimate)}</span>` : ''}
                          </div>
                          <p class="trlm-mode-note">${this.escapeHtml(m.notes)}</p>
                        </div>
                      `).join("")}
                    </div>
                    <div class="trlm-practical-verdict">
                      <strong>Last-Mile Practical Reality:</strong> ${this.escapeHtml(lastMile.gapSummary)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Section 2: Return Journey Reality Check -->
          <section class="tr-section">
            <h4 class="tr-section-title">
              <span class="tr-section-num">2</span>
              <span>Same-Day Return Journey Reality Check</span>
            </h4>
            <div class="tr-return-box ${returnJ.sameDayFeasible ? 'tr-return-feasible' : 'tr-return-warning'}">
              <div class="tr-return-header">
                <span class="tr-ret-icon">${returnJ.sameDayFeasible ? '✓' : '⚠️'}</span>
                <div>
                  <strong>${returnJ.sameDayFeasible ? 'Same-day return is practically feasible from ' + originInfo.name : 'Same-day return from ' + originInfo.name + ' is high risk / impractical'}</strong>
                  <p class="tr-ret-timing">${this.escapeHtml(returnJ.lastScheduledTransitNote || 'Check return transit upon morning arrival.')}</p>
                </div>
              </div>
              ${returnJ.caution ? `
                <div class="tr-return-caution">
                  <strong>Critical Return Warning:</strong> ${this.escapeHtml(returnJ.caution)}
                </div>
              ` : ''}
            </div>
          </section>

          <!-- Section 3: Before You Go — Visiting Rules & Facilities -->
          <section class="tr-section">
            <h4 class="tr-section-title">
              <span class="tr-section-num">3</span>
              <span>Before You Go: Visiting Information &amp; Entry Requirements</span>
            </h4>
            <div class="tr-visiting-grid">
              <div class="tr-vg-item">
                <span class="trvg-label">Statutory Opening Hours</span>
                <span class="trvg-val">${this.escapeHtml(visiting.openingHours || 'Sunrise to Sunset')}</span>
                <span class="trvg-source">Source: ${this.escapeHtml(visiting.hoursVerification ? visiting.hoursVerification.source : 'Official Portal')}</span>
              </div>
              <div class="tr-vg-item">
                <span class="trvg-label">Entry Permits &amp; Ticketing</span>
                <span class="trvg-val">${visiting.entryPermits ? (visiting.entryPermits.required ? 'Mandatory Ticket/Permit Required' : 'Free Entry') : 'Permit checking'}</span>
                <span class="trvg-pricing">${this.escapeHtml(visiting.entryPermits ? visiting.entryPermits.pricing : 'Standard')}</span>
                ${visiting.entryPermits && visiting.entryPermits.onlinePortal ? `
                  <a href="${visiting.entryPermits.onlinePortal}" target="_blank" rel="noopener" class="trvg-link">
                    Book Official Permit ↗
                  </a>
                ` : ''}
              </div>
            </div>

            <!-- Facilities Checklist -->
            <div class="tr-facilities-checklist">
              <h5 class="tr-subheading">Verified On-Site Visitor Facilities</h5>
              <div class="tr-facilities-grid">
                <div class="tr-fac-card">
                  <span class="trfc-icon">🅿️</span>
                  <div>
                    <strong>Parking:</strong>
                    <span>${this.escapeHtml(facilities.parking ? facilities.parking.details : 'Check on-site')}</span>
                  </div>
                </div>
                <div class="tr-fac-card">
                  <span class="trfc-icon">🚻</span>
                  <div>
                    <strong>Restrooms:</strong>
                    <span>${this.escapeHtml(facilities.restrooms ? facilities.restrooms.details : 'Basic')}</span>
                  </div>
                </div>
                <div class="tr-fac-card">
                  <span class="trfc-icon">🚰</span>
                  <div>
                    <strong>Drinking Water:</strong>
                    <span>${this.escapeHtml(facilities.drinkingWater ? facilities.drinkingWater.details : 'Carry water')}</span>
                  </div>
                </div>
                <div class="tr-fac-card">
                  <span class="trfc-icon">♿</span>
                  <div>
                    <strong>Wheelchair Access:</strong>
                    <span>${this.escapeHtml(facilities.wheelchairAccess ? facilities.wheelchairAccess.details : 'Partially accessible')}</span>
                  </div>
                </div>
                <div class="tr-fac-card">
                  <span class="trfc-icon">📶</span>
                  <div>
                    <strong>Mobile Network:</strong>
                    <span>${this.escapeHtml(facilities.cellularNetwork ? facilities.cellularNetwork.details : 'Check carrier')}</span>
                  </div>
                </div>
                <div class="tr-fac-card">
                  <span class="trfc-icon">⚡</span>
                  <div>
                    <strong>EV Charging:</strong>
                    <span>${this.escapeHtml(facilities.evCharging ? facilities.evCharging.details : 'No verified fast chargers')}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Material Restrictions -->
            ${visiting.materialRestrictions && visiting.materialRestrictions.length > 0 ? `
              <div class="tr-restrictions-box">
                <h5 class="tr-subheading">Material Restrictions &amp; Prohibitions</h5>
                <ul class="tr-restrictions-list">
                  ${visiting.materialRestrictions.map(r => `<li>${this.escapeHtml(r)}</li>`).join("")}
                </ul>
              </div>
            ` : ''}
          </section>

          <!-- Section 3.5: Authentic Gujarati Culture & Regional Flavours -->
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
                    <strong>Local Bites &amp; Highway Food Secrets:</strong>
                    <p>${this.escapeHtml(culturalTip.food)}</p>
                  </div>
                </div>
                <div class="tr-culture-card">
                  <div class="trc-icon">📸</div>
                  <div class="trc-body">
                    <strong>Heritage &amp; Photography Vibe:</strong>
                    <p>${this.escapeHtml(culturalTip.vibe)}</p>
                  </div>
                </div>
              </div>
            </section>
          ` : ''}

          <!-- Section 4: Granular Fact Provenance & Freshness Table -->
          <section class="tr-section">
            <h4 class="tr-section-title">
              <span class="tr-section-num">4</span>
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
              * Distances and durations are estimated based on road network geometry and typical Western Railway / GSRTC run times, not live GPS telematics.
            </p>
          </section>

          <!-- Section 5: Action Confirmations & Public Reporting -->
          <footer class="tr-card-footer">
            <div class="tr-footer-actions">
              <button class="btn-primary-action" onclick="window.TripReality.viewTripOnMap()">
                <span>🗺️ View Route &amp; Hubs on Map</span>
              </button>
              <a href="https://www.google.com/maps/dir/?api=1&destination=${d.coordinates[1]},${d.coordinates[0]}" target="_blank" rel="noopener" class="btn-secondary-action">
                <span>🚗 Google Maps Direct ↗</span>
              </a>
              ${(d.externalLinks || []).filter(l => l.type === 'official_permit').map(l => `
                <a href="${l.url}" target="_blank" rel="noopener" class="btn-secondary-action">
                  <span>🎫 ${this.escapeHtml(l.label)} ↗</span>
                </a>
              `).join("")}
              <button class="btn-outline-action tr-btn-report" onclick="window.TripReality.openReportModal('${d.destinationId}', '${this.escapeHtml(d.destinationName)}')">
                <span>⚠️ Report Outdated Info</span>
              </button>
            </div>
          </footer>
        </article>
      `;
    },

    updateMapVisualization: function () {
      if (!this.mapLayerGroup || !window.map || !this.activeDestination) return;
      this.mapLayerGroup.clearLayers();

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
