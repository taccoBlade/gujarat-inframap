/**
 * Gujarat InfraMap — Gujarat Unfiltered Engine
 * 
 * "Gujarat Unfiltered: The Unexpected Side of Gujarat" (ગુજરાત અનફિલ્ટર્ડ)
 * 
 * Contemporary youth-culture editorial discovery experience covering eerie places,
 * urban legends, forgotten heritage, strange landmarks, and nature side quests.
 * 
 * Key Principles:
 * - 6 Curated Collections: After Dark, Hidden in Plain Sight, Weird Gujarat, Lost Chapters, Nature's Side Quests, Worth the Detour
 * - Strict Separation of Lore & Reality: Rigorously distinguishes local folklore/myths from documented scientific/historical facts.
 * - 100% Lawfully Accessible: Strictly declares legal access status and explicit safety advisories (zero promotion of trespassing).
 * - Deeply integrated with Leaflet map markers and Trip Reality last-mile feasibility.
 */

(function (window, document) {
  'use strict';

  // Collection metadata configuration
  const COLLECTIONS_META = {
    'all': {
      label: 'All Unexpected Stories',
      gujarati: 'બધી વાર્તાઓ',
      icon: '⚡',
      color: 'var(--color-madder-red, #B84638)',
      bg: 'rgba(184, 70, 56, 0.1)'
    },
    'after-dark': {
      label: 'After Dark',
      gujarati: 'સાંજ પછીનો રહસ્યમય ગુજરાત',
      icon: '🌙',
      color: '#7C3AED',
      bg: 'rgba(124, 58, 237, 0.12)'
    },
    'hidden-plain-sight': {
      label: 'Hidden in Plain Sight',
      gujarati: 'નજરે ન ચડેલું ગુજરાત',
      icon: '👁️',
      color: '#0284C7',
      bg: 'rgba(2, 132, 199, 0.12)'
    },
    'weird-gujarat': {
      label: 'Weird Gujarat',
      gujarati: 'અજીબ અને અનોખું',
      icon: '🌀',
      color: '#D97706',
      bg: 'rgba(217, 119, 6, 0.12)'
    },
    'lost-chapters': {
      label: 'Lost Chapters',
      gujarati: 'ભૂલાયેલા પાનાં',
      icon: '⏳',
      color: '#B45309',
      bg: 'rgba(180, 83, 9, 0.12)'
    },
    'nature-side-quests': {
      label: "Nature's Side Quests",
      gujarati: 'કુદરતની અજાણી કેડી',
      icon: '🌿',
      color: '#15803D',
      bg: 'rgba(21, 128, 61, 0.12)'
    },
    'worth-detour': {
      label: 'Worth the Detour',
      gujarati: 'એક વળાંક લેવા જેવો',
      icon: '🛣️',
      color: '#BE123C',
      bg: 'rgba(190, 18, 60, 0.12)'
    }
  };

  class GujaratUnfilteredEngine {
    constructor() {
      this.stories = [];
      this.activeCollection = 'all';
      this.searchQuery = '';
      this.mapMarkersLayer = null;
      this.markerMap = new Map();
      this.isLoaded = false;
      this.isLoading = false;
    }

    /**
     * Initialize engine: load dataset and set up event listeners
     */
    async init() {
      if (this.isLoaded) return;
      if (this.isLoading) return;
      this.isLoading = true;

      try {
        const response = await fetch('data/gujarat_unfiltered.json');
        if (!response.ok) {
          throw new Error(`Failed to load gujarat_unfiltered.json: ${response.status}`);
        }
        this.stories = await response.json();
        this.isLoaded = true;
        this.isLoading = false;
        console.log(`[GujaratUnfiltered] Loaded ${this.stories.length} unexpected Gujarat stories.`);

        this.initMapMarkers();
        this.bindEvents();
      } catch (err) {
        console.error('[GujaratUnfiltered] Initialization error:', err);
        this.isLoading = false;
      }
    }

    /**
     * Set up Leaflet map markers for all unfiltered stories
     */
    initMapMarkers() {
      if (!window.map || typeof L === 'undefined') {
        // Retry when map becomes available
        setTimeout(() => this.initMapMarkers(), 500);
        return;
      }

      if (!this.mapMarkersLayer) {
        this.mapMarkersLayer = L.layerGroup();
        this.mapMarkersLayer.addTo(window.map);
      }

      this.mapMarkersLayer.clearLayers();
      this.markerMap.clear();

      this.stories.forEach(story => {
        if (!story.coordinates || story.coordinates.length < 2) return;
        // coordinates are [lng, lat]
        const lng = story.coordinates[0];
        const lat = story.coordinates[1];
        const meta = COLLECTIONS_META[story.collection] || COLLECTIONS_META['all'];

        // Custom stylized SVG pin
        const customIcon = L.divIcon({
          className: 'gu-map-marker-container',
          html: `
            <div class="gu-map-marker" style="--marker-color: ${meta.color};" title="${story.name}">
              <span class="gu-marker-icon">${meta.icon}</span>
              <div class="gu-marker-pulse"></div>
            </div>
          `,
          iconSize: [36, 42],
          iconAnchor: [18, 42],
          popupAnchor: [0, -38]
        });

        const marker = L.marker([lat, lng], { icon: customIcon });

        const popupContent = `
          <div class="gu-map-popup">
            <div class="gu-popup-header" style="background-image: url('${story.imageUrl}');">
              <span class="gu-popup-badge" style="background:${meta.color};">${meta.icon} ${story.collectionLabel}</span>
            </div>
            <div class="gu-popup-body">
              <span class="gu-popup-guj">${story.gujaratiName}</span>
              <h4 class="gu-popup-title">${story.name}</h4>
              <p class="gu-popup-tagline">${story.tagline}</p>
              <div class="gu-popup-actions">
                <button class="gu-popup-btn" onclick="window.GujaratUnfiltered.openStoryModal('${story.id}')">
                  📖 Read Story &amp; Reality
                </button>
              </div>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent, { maxWidth: 300, className: 'gu-leaflet-popup' });
        this.mapMarkersLayer.addLayer(marker);
        this.markerMap.set(story.id, marker);
      });
    }

    /**
     * Bind DOM listeners for search, collection filtering, and modals
     */
    bindEvents() {
      // Global ESC listener for modal
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.closeStoryModal();
        }
      });
    }

    /**
     * Get filtered stories based on active collection and search query
     */
    getFilteredStories() {
      const q = this.searchQuery.trim().toLowerCase();
      return this.stories.filter(story => {
        const matchesCollection = this.activeCollection === 'all' || story.collection === this.activeCollection;
        if (!matchesCollection) return false;
        if (!q) return true;

        const hay = [
          story.name,
          story.gujaratiName,
          story.tagline,
          story.district,
          story.region,
          story.theStory,
          story.theFolklore,
          story.theGroundReality,
          story.collectionLabel
        ].join(' ').toLowerCase();

        return hay.includes(q);
      });
    }

    /**
     * Main Render Method — Renders hero, filters, counter, and 24 editorial cards
     */
    render() {
      const container = document.getElementById('placesUnfilteredSubView');
      if (!container) return;

      const filtered = this.getFilteredStories();

      // Counts per collection
      const counts = { all: this.stories.length };
      Object.keys(COLLECTIONS_META).forEach(key => {
        if (key !== 'all') {
          counts[key] = this.stories.filter(s => s.collection === key).length;
        }
      });

      container.innerHTML = `
        <!-- Gujarat Unfiltered Hero Header -->
        <header class="public-view-header gu-editorial-header">
          <div class="gu-header-content">
            <span class="pview-eyebrow gu-eyebrow">
              <span class="eyebrow-symbol">⚡</span>
              GUJARAT UNFILTERED • ગુજરાત અનફિલ્ટર્ડ • YOUTH EDITORIAL
            </span>
            <h2 class="pview-title gu-headline">The stories they didn't put in the textbook.</h2>
            <p class="pview-desc gu-desc">
              Curated urban legends, architectural anomalies, forgotten desert bastions, and the unvarnished ground truth — all physically verified, fact-checked, and lawfully accessible.
            </p>
          </div>
          <div class="gu-header-badge" aria-hidden="true">
            <svg width="48" height="48" viewBox="0 0 44 44" fill="none">
              <rect x="4" y="4" width="36" height="36" rx="8" stroke="#B84638" stroke-width="2" stroke-dasharray="4 2"/>
              <path d="M22 6L25 18L37 22L25 26L22 38L19 26L7 22L19 18L22 6Z" fill="#B84638" opacity="0.85"/>
              <circle cx="22" cy="22" r="5" fill="#E2AE48"/>
            </svg>
          </div>
        </header>

        <!-- Search & Category Controls Bar -->
        <div class="gu-controls-bar">
          <div class="gu-collection-pills" role="tablist" aria-label="Filter stories by collection">
            ${Object.entries(COLLECTIONS_META).map(([key, meta]) => `
              <button 
                class="gu-cat-pill ${this.activeCollection === key ? 'active' : ''}" 
                data-collection="${key}"
                style="--pill-accent: ${meta.color};"
                onclick="window.GujaratUnfiltered.setCollection('${key}')"
                role="tab"
                aria-selected="${this.activeCollection === key ? 'true' : 'false'}"
              >
                <span class="gu-pill-icon">${meta.icon}</span>
                <span class="gu-pill-label">${meta.label}</span>
                <span class="gu-pill-count">${counts[key] || 0}</span>
              </button>
            `).join('')}
          </div>

          <!-- Search Input -->
          <div class="gu-search-row">
            <div class="gu-search-input-wrapper">
              <span class="gu-search-icon" aria-hidden="true">🔍</span>
              <input 
                type="text" 
                id="guSearchInput" 
                class="gu-search-input" 
                placeholder="Search legends, ghost stories, anomalies, or locations (e.g. Dumas, Kalo Dungar, Lothal, Lakhpat)..."
                value="${this.searchQuery}"
                oninput="window.GujaratUnfiltered.handleSearch(this.value)"
              />
              ${this.searchQuery ? `
                <button class="gu-search-clear" onclick="window.GujaratUnfiltered.handleSearch('')" title="Clear search">✕</button>
              ` : ''}
            </div>
          </div>
        </div>

        <!-- Status & Trust Verification Bar -->
        <div class="gu-status-row">
          <span class="gu-results-count">
            Showing <strong>${filtered.length}</strong> unexpected places across Gujarat
          </span>
          <div class="gu-trust-banner">
            <span class="gu-trust-pill">
              <span class="gu-trust-dot">✓</span> 100% Lawfully Accessible
            </span>
            <span class="gu-trust-pill">
              <span class="gu-trust-dot">🛡️</span> Scientific &amp; Historical Fact-Check
            </span>
            <span class="gu-trust-pill gu-trust-advisory">
              <span class="gu-trust-dot">⚠️</span> Strict Safety Advisories
            </span>
          </div>
        </div>

        <!-- Cards Grid -->
        ${filtered.length > 0 ? `
          <div class="gu-cards-grid" role="region" aria-label="Gujarat Unfiltered Stories Grid">
            ${filtered.map(story => this.renderStoryCard(story)).join('')}
          </div>
        ` : `
          <div class="gu-empty-state">
            <div class="gu-empty-icon">🌀</div>
            <h3 class="gu-empty-title">No unexpected stories match your search</h3>
            <p class="gu-empty-desc">
              We couldn't find anything matching "<strong>${this.searchQuery}</strong>" in the ${COLLECTIONS_META[this.activeCollection]?.label || 'selected'} collection.
            </p>
            <button class="btn-primary-action gu-empty-reset" onclick="window.GujaratUnfiltered.resetFilters()">
              Show All 24 Stories
            </button>
          </div>
        `}
      `;
    }

    /**
     * Render an individual editorial story card
     */
    renderStoryCard(story) {
      const meta = COLLECTIONS_META[story.collection] || COLLECTIONS_META['all'];
      const safeLawfulBadge = story.legalAccess && story.legalAccess.isSafeAndLawful
        ? `<span class="gu-card-safe-badge">✓ Lawful Public Access</span>`
        : `<span class="gu-card-warn-badge">⚠️ Regulated Access</span>`;

      return `
        <article class="gu-card" id="card-${story.id}" data-id="${story.id}">
          <!-- Jharokha Image Container -->
          <div class="gu-card-media-wrap">
            <img 
              src="${story.imageUrl}" 
              alt="${story.name} — ${story.district}, Gujarat" 
              class="gu-card-image"
              loading="lazy"
              onerror="this.src='https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=800&q=80'"
            />
            <div class="gu-media-gradient"></div>
            
            <!-- Badges Floating on Image -->
            <div class="gu-media-badges-top">
              <span class="gu-col-badge" style="background: ${meta.color};">
                ${meta.icon} ${story.collectionLabel}
              </span>
              <span class="gu-district-badge">📍 ${story.district}</span>
            </div>

            <div class="gu-media-badges-bottom">
              <span class="gu-credit-badge">📷 ${story.imageCredit}</span>
            </div>
          </div>

          <!-- Card Body -->
          <div class="gu-card-body">
            <div class="gu-card-titles">
              <span class="gu-gujarati-name">${story.gujaratiName}</span>
              <h3 class="gu-card-name">${story.name}</h3>
              <p class="gu-card-tagline">${story.tagline}</p>
            </div>

            <!-- Two-Tone Split Lore vs Reality Teaser -->
            <div class="gu-split-teaser">
              <!-- Lore Box -->
              <div class="gu-teaser-box gu-teaser-lore">
                <div class="gu-teaser-header">
                  <span class="gu-teaser-tag">📜 THE FOLKLORE &amp; MYTH</span>
                </div>
                <p class="gu-teaser-snippet">${this.truncate(story.theFolklore, 115)}</p>
              </div>

              <!-- Reality Box -->
              <div class="gu-teaser-box gu-teaser-reality">
                <div class="gu-teaser-header">
                  <span class="gu-teaser-tag">🔬 THE GROUND REALITY</span>
                </div>
                <p class="gu-teaser-snippet">${this.truncate(story.theGroundReality, 115)}</p>
              </div>
            </div>

            <!-- Fact Check Verdict Strip -->
            <div class="gu-factcheck-strip">
              <span class="gu-factcheck-pill">${story.factCheckBadge}</span>
            </div>

            <!-- Legal Access & Safety Banner -->
            <div class="gu-legal-banner">
              <div class="gu-legal-header">
                ${safeLawfulBadge}
                <span class="gu-access-type">${story.legalAccess?.accessType || 'Public Access'}</span>
              </div>
              <p class="gu-safety-rules">⚠️ <strong>Advisory:</strong> ${story.legalAccess?.rulesAndWarnings || 'Follow local civic rules and daytime visiting hours.'}</p>
            </div>

            <!-- Card Action Footer -->
            <footer class="gu-card-actions">
              <button 
                class="gu-btn-read-deep" 
                onclick="window.GujaratUnfiltered.openStoryModal('${story.id}')"
                aria-label="Read full story and reality for ${story.name}"
              >
                <span>📖 Read Story &amp; Reality</span>
              </button>
              
              <button 
                class="gu-btn-map" 
                onclick="window.GujaratUnfiltered.locateOnMap('${story.id}')"
                title="Locate ${story.name} on the Gujarat Map"
              >
                <span>📍 Map</span>
              </button>

              <button 
                class="gu-btn-trip" 
                onclick="window.GujaratUnfiltered.planInTripReality('${story.id}')"
                title="Check last-mile feasibility in Trip Reality"
              >
                <span>🧭 Plan</span>
              </button>
            </footer>
          </div>
        </article>
      `;
    }

    /**
     * Modal Reader — Deep Dive with Narrative, Folklore vs Science, Safety, Photo Tips
     */
    openStoryModal(storyId) {
      const story = this.stories.find(s => s.id === storyId);
      if (!story) return;

      const modal = document.getElementById('unfilteredStoryModal');
      const content = document.getElementById('unfilteredModalContent');
      if (!modal || !content) return;

      const meta = COLLECTIONS_META[story.collection] || COLLECTIONS_META['all'];

      content.innerHTML = `
        <article class="gu-modal-article">
          <!-- Top Modal Close Button -->
          <button class="gu-modal-close-btn" onclick="window.GujaratUnfiltered.closeStoryModal()" aria-label="Close story modal">✕</button>

          <!-- Hero Media Banner -->
          <div class="gu-modal-hero" style="background-image: linear-gradient(180deg, rgba(17, 24, 39, 0.2) 0%, rgba(17, 24, 39, 0.88) 100%), url('${story.imageUrl}');">
            <div class="gu-modal-hero-content">
              <div class="gu-modal-hero-tags">
                <span class="gu-col-badge" style="background: ${meta.color};">
                  ${meta.icon} ${story.collectionLabel}
                </span>
                <span class="gu-district-badge">📍 ${story.district} • ${story.region}</span>
              </div>
              <span class="gu-modal-guj">${story.gujaratiName}</span>
              <h2 class="gu-modal-title">${story.name}</h2>
              <p class="gu-modal-tagline">${story.tagline}</p>
              <span class="gu-modal-photo-credit">📷 Photo: ${story.imageCredit}</span>
            </div>
          </div>

          <!-- Modal Body Content -->
          <div class="gu-modal-body">
            <!-- Section 1: The Narrative Story -->
            <section class="gu-modal-section gu-narrative-section">
              <h3 class="gu-section-heading">
                <span class="gu-sec-num">01</span> The Atmosphere &amp; Setting
              </h3>
              <p class="gu-narrative-text">${story.theStory}</p>
            </section>

            <!-- Section 2: Side-by-Side Folklore vs Ground Reality -->
            <section class="gu-modal-section gu-comparison-section">
              <h3 class="gu-section-heading">
                <span class="gu-sec-num">02</span> The Investigation: Folklore vs. Ground Reality
              </h3>
              
              <div class="gu-comparison-grid">
                <!-- Column 1: The Lore -->
                <div class="gu-comp-card gu-comp-lore">
                  <div class="gu-comp-header">
                    <span class="gu-comp-icon">📜</span>
                    <div class="gu-comp-head-text">
                      <h4>The Oral Lore &amp; Local Rumours</h4>
                      <small>What campfire tales, village elders &amp; youth claim</small>
                    </div>
                  </div>
                  <div class="gu-comp-body">
                    <p>${story.theFolklore}</p>
                  </div>
                </div>

                <!-- Column 2: The Reality -->
                <div class="gu-comp-card gu-comp-reality">
                  <div class="gu-comp-header">
                    <span class="gu-comp-icon">🔬</span>
                    <div class="gu-comp-head-text">
                      <h4>The Documented Ground Reality</h4>
                      <small>Archaeological, geological &amp; acoustic facts</small>
                    </div>
                  </div>
                  <div class="gu-comp-body">
                    <p>${story.theGroundReality}</p>
                  </div>
                </div>
              </div>

              <!-- Fact Check Stamp -->
              <div class="gu-verdict-box">
                <div class="gu-verdict-stamp">
                  <span class="gu-stamp-seal">VERIFIED</span>
                  <span class="gu-stamp-text">${story.factCheckBadge}</span>
                </div>
              </div>
            </section>

            <!-- Section 3: Statutory Lawful Access & Safety Directives -->
            <section class="gu-modal-section gu-safety-section">
              <h3 class="gu-section-heading">
                <span class="gu-sec-num">03</span> Lawful Access &amp; Safety Directives
              </h3>

              <div class="gu-safety-card">
                <div class="gu-safety-status-row">
                  <span class="gu-statutory-pill">
                    <strong>Jurisdiction:</strong> ${story.legalAccess?.accessType || 'Public Domain'}
                  </span>
                  <span class="gu-law-badge ${story.legalAccess?.isSafeAndLawful ? 'badge-safe' : 'badge-caution'}">
                    ${story.legalAccess?.isSafeAndLawful ? '✓ Lawful & Safe by Day' : '⚠️ Strictly Regulated Entry'}
                  </span>
                </div>

                <div class="gu-safety-rules-box">
                  <h5 class="gu-rules-title">🛡️ Statutory Safety Advisory &amp; Ethical Exploration:</h5>
                  <p class="gu-rules-text">${story.legalAccess?.rulesAndWarnings}</p>
                  <ul class="gu-ethics-list">
                    <li>✓ No trespassing on private property or demarcated border/forest zones.</li>
                    <li>✓ Zero damage to historic stone masonry or stepwell carvings.</li>
                    <li>✓ Strict day-visit compliance — avoid hazardous mudflats, dry scrub forests, or ruins after nightfall.</li>
                    <li>✓ Leave zero litter; carry all plastic and water bottles back.</li>
                  </ul>
                </div>
              </div>
            </section>

            <!-- Section 4: Traveler & Creator Intel -->
            <section class="gu-modal-section gu-intel-section">
              <h3 class="gu-section-heading">
                <span class="gu-sec-num">04</span> Traveler &amp; Creator Field Intel
              </h3>

              <div class="gu-intel-grid">
                <div class="gu-intel-card">
                  <span class="gu-intel-icon">📸</span>
                  <div class="gu-intel-info">
                    <h5>Photography Tip</h5>
                    <p>${story.photoSpotTip}</p>
                  </div>
                </div>

                <div class="gu-intel-card">
                  <span class="gu-intel-icon">⏰</span>
                  <div class="gu-intel-info">
                    <h5>Best Time to Experience</h5>
                    <p>${story.bestTimeToExperience}</p>
                  </div>
                </div>

                <div class="gu-intel-card">
                  <span class="gu-intel-icon">🚗</span>
                  <div class="gu-intel-info">
                    <h5>Detour from Major Hub</h5>
                    <p>${story.nearbyCityDetour}</p>
                  </div>
                </div>

                <div class="gu-intel-card">
                  <span class="gu-intel-icon">💡</span>
                  <div class="gu-intel-info">
                    <h5>Curator's Note</h5>
                    <p>${story.curatorNote}</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <!-- Modal Action Bar -->
          <footer class="gu-modal-footer">
            <button class="btn-secondary-action gu-modal-btn" onclick="window.GujaratUnfiltered.closeStoryModal()">
              Close Story
            </button>
            <button class="btn-primary-action gu-modal-btn" onclick="window.GujaratUnfiltered.locateOnMap('${story.id}'); window.GujaratUnfiltered.closeStoryModal();">
              📍 View Location on Map
            </button>
            <button class="btn-primary-action gu-modal-btn gu-modal-btn-trip" onclick="window.GujaratUnfiltered.planInTripReality('${story.id}'); window.GujaratUnfiltered.closeStoryModal();">
              🧭 Check Last-Mile in Trip Reality ➔
            </button>
          </footer>
        </article>
      `;

      if (typeof modal.showModal === 'function') {
        modal.showModal();
      } else {
        modal.classList.add('open');
      }
      modal.scrollTop = 0;
    }

    /**
     * Close the modal reader
     */
    closeStoryModal() {
      const modal = document.getElementById('unfilteredStoryModal');
      if (!modal) return;
      if (typeof modal.close === 'function') {
        modal.close();
      } else {
        modal.classList.remove('open');
      }
    }

    /**
     * Set active collection category and re-render
     */
    setCollection(colKey) {
      this.activeCollection = colKey;
      this.render();
      const firstCard = document.querySelector('.gu-card');
      if (firstCard) {
        firstCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }

    /**
     * Filter stories via search bar
     */
    handleSearch(val) {
      this.searchQuery = val;
      this.render();
    }

    /**
     * Reset all filters to default
     */
    resetFilters() {
      this.activeCollection = 'all';
      this.searchQuery = '';
      this.render();
    }

    /**
     * Locate story on map, fly to coordinates, and open popup
     */
    locateOnMap(storyId) {
      const story = this.stories.find(s => s.id === storyId);
      if (!story || !story.coordinates || !window.map) return;

      // Switch to explore map view
      if (window.PublicViews && typeof window.PublicViews.switchDestination === 'function') {
        window.PublicViews.switchDestination('explore', true);
      }

      const lng = story.coordinates[0];
      const lat = story.coordinates[1];

      setTimeout(() => {
        window.map.flyTo([lat, lng], 13, { duration: 1.2 });
        const marker = this.markerMap.get(story.id);
        if (marker) {
          setTimeout(() => marker.openPopup(), 1200);
        }
      }, 300);
    }

    /**
     * Deep-link into Trip Reality with route pre-selected
     */
    planInTripReality(storyId) {
      const story = this.stories.find(s => s.id === storyId);
      if (!story) return;

      // Switch to Trip Reality view
      if (window.PublicViews && typeof window.PublicViews.switchDestination === 'function') {
        window.PublicViews.switchDestination('plan', true);
      }

      // If matching destination exists in Trip Reality, select it
      setTimeout(() => {
        if (window.TripReality) {
          // Attempt to find matching destination key or closest destination
          const destSelect = document.getElementById('trDestinationSelect');
          if (destSelect) {
            let matchedValue = '';
            for (let i = 0; i < destSelect.options.length; i++) {
              const opt = destSelect.options[i];
              if (
                opt.text.toLowerCase().includes(story.district.toLowerCase()) ||
                story.name.toLowerCase().includes(opt.value.toLowerCase()) ||
                opt.value.toLowerCase().includes(story.district.toLowerCase())
              ) {
                matchedValue = opt.value;
                break;
              }
            }

            if (matchedValue) {
              window.TripReality.selectDestination(matchedValue);
            } else {
              window.TripReality.renderAssessment();
            }
          }
        }
      }, 200);
    }

    /**
     * Utility string truncator
     */
    truncate(str, maxLen = 120) {
      if (!str) return '';
      if (str.length <= maxLen) return str;
      return str.substring(0, maxLen).trim() + '...';
    }
  }

  // Create singleton instance and attach to window
  window.GujaratUnfiltered = new GujaratUnfilteredEngine();

  // Auto-init when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.GujaratUnfiltered.init());
  } else {
    window.GujaratUnfiltered.init();
  }

})(window, document);
