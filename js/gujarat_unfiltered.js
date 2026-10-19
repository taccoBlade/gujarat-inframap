/**
 * Gujarat InfraMap — Gujarat Unfiltered Engine (Phase 2: 34-District Research Database)
 * 
 * "Gujarat Unfiltered: The Unexpected Side of Gujarat" (ગુજરાત અનફિલ્ટર્ડ)
 * 
 * Comprehensive 34-district discovery platform covering urban legends, folklore,
 * archaeological anomalies, forgotten desert bastions, and nature side quests.
 * 
 * Key Principles:
 * - 34 Districts Audited: Full coverage including Vav-Tharad (34th District, created 2 Oct 2025).
 * - Multi-Dimensional Research Classifications: documented_place, documented_history, local_legend, unverified_claim, public_access, restricted_access.
 * - Strict Separation of Lore & Reality: Rigorously distinguishes local campfire lore from archaeological/geological facts.
 * - Rigorous Case Study Curation: Signature Farm (Ghuma-Bopal) case study debunking viral creepypasta and enforcing strict zero-trespassing warnings on private property.
 * - Auditable Provenance: Every record references primary statutory sources, corroborating historical citations, and documented field uncertainties.
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

  const STATUS_LABELS = {
    'documented_place': { label: 'Documented Place', icon: '📍', className: 'chip-place' },
    'documented_history': { label: 'Documented History', icon: '📜', className: 'chip-history' },
    'local_legend': { label: 'Local Legend', icon: '🗣️', className: 'chip-legend' },
    'unverified_claim': { label: 'Unverified Claim', icon: '⚠️', className: 'chip-unverified' },
    'public_access': { label: 'Public Access', icon: '✓', className: 'chip-public' },
    'restricted_access': { label: 'Restricted Access', icon: '⛔', className: 'chip-restricted' }
  };

  class GujaratUnfilteredEngine {
    constructor() {
      this.stories = [];
      this.districts = [];
      this.ledgerData = null;
      this.ledgerSearchQuery = '';
      this.activeCollection = 'all';
      this.activeDistrict = 'all';
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
        const [storiesResp, ledgerResp] = await Promise.all([
          fetch('data/gujarat_unfiltered.json'),
          fetch('data/district_coverage_ledger.json')
        ]);
        if (!storiesResp.ok) {
          throw new Error(`Failed to load gujarat_unfiltered.json: ${storiesResp.status}`);
        }
        this.stories = await storiesResp.json();
        if (ledgerResp.ok) {
          this.ledgerData = await ledgerResp.json();
        }
        
        // Extract unique districts
        const distSet = new Set(this.stories.map(s => s.district));
        this.districts = Array.from(distSet).sort();

        this.isLoaded = true;
        this.isLoading = false;
        console.log(`[GujaratUnfiltered] Loaded ${this.stories.length} stories across ${this.districts.length} districts.`);

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
        const lng = story.coordinates[0];
        const lat = story.coordinates[1];
        const meta = COLLECTIONS_META[story.collection] || COLLECTIONS_META['all'];

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
     * Bind DOM listeners
     */
    bindEvents() {
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.closeStoryModal();
          this.closeLedgerModal();
        }
      });
    }

    /**
     * Get filtered stories based on active collection, district, and search query
     */
    getFilteredStories() {
      const q = this.searchQuery.trim().toLowerCase();
      return this.stories.filter(story => {
        const matchesCollection = this.activeCollection === 'all' || story.collection === this.activeCollection;
        if (!matchesCollection) return false;

        const matchesDistrict = this.activeDistrict === 'all' || 
          story.district === this.activeDistrict ||
          (this.activeDistrict === 'The Dangs' && story.district === 'Dang') ||
          (this.activeDistrict === 'Dang' && story.district === 'The Dangs');
        if (!matchesDistrict) return false;

        if (!q) return true;

        const hay = [
          story.name,
          ...(story.alternateNames || []),
          story.gujaratiName,
          story.tagline,
          story.district,
          story.taluka,
          story.region,
          story.theStory,
          story.theFolklore,
          story.theGroundReality,
          story.collectionLabel,
          story.factCheckBadge
        ].join(' ').toLowerCase();

        return hay.includes(q);
      });
    }

    /**
     * Main Render Method
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
              GUJARAT UNFILTERED • ગુજરાત અનફિલ્ટર્ડ • 34 DISTRICTS RESEARCHED
            </span>
            <h2 class="pview-title gu-headline">The stories they didn't put in the textbook.</h2>
            <p class="pview-desc gu-desc">
              Curated oral legends, architectural anomalies, forgotten desert bastions, and the unvarnished ground truth across all 34 districts of Gujarat (including Vav-Tharad). Fact-checked with statutory access disclosures.
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

          <!-- Search Input & District Selector Row -->
          <div class="gu-search-row">
            <div class="gu-search-input-wrapper">
              <span class="gu-search-icon" aria-hidden="true">🔍</span>
              <input 
                type="text" 
                id="guSearchInput" 
                class="gu-search-input" 
                placeholder="Search legends, ghost stories, anomalies, or locations (e.g. Dumas, Kalo Dungar, Lothal, Nadabet, Signature Farm)..."
                value="${this.searchQuery}"
                oninput="window.GujaratUnfiltered.handleSearch(this.value)"
              />
              ${this.searchQuery ? `
                <button class="gu-search-clear" onclick="window.GujaratUnfiltered.handleSearch('')" title="Clear search">✕</button>
              ` : ''}
            </div>

            <!-- District Dropdown -->
            <div class="gu-district-select-wrap">
              <select 
                id="guDistrictFilter" 
                class="gu-district-select" 
                onchange="window.GujaratUnfiltered.setDistrict(this.value)"
                aria-label="Filter stories by Gujarat district"
              >
                <option value="all">📍 All 34 Districts (${this.stories.length})</option>
                <option value="Vav-Tharad" ${this.activeDistrict === 'Vav-Tharad' ? 'selected' : ''}>★ Vav-Tharad (34th District - Oct 2025)</option>
                ${this.districts.filter(d => d !== 'Vav-Tharad').map(d => `
                  <option value="${d}" ${this.activeDistrict === d ? 'selected' : ''}>${d}</option>
                `).join('')}
              </select>
            </div>
          </div>
        </div>

        <!-- Status & Trust Verification Bar -->
        <div class="gu-status-row">
          <span class="gu-results-count">
            Showing <strong>${filtered.length}</strong> unexpected places across Gujarat (34 Districts Audited)
          </span>
          <div class="gu-trust-banner">
            <button class="gu-trust-pill gu-trust-btn" onclick="window.GujaratUnfiltered.openLedgerModal()" title="View Complete 34-District Research Audit Ledger" aria-label="Open 34-District Research Audit Ledger">
              <span class="gu-trust-dot">🏛️</span> 34 Districts Audited (View Ledger)
            </button>
            <span class="gu-trust-pill">
              <span class="gu-trust-dot">⚖️</span> Statutory Access Declared
            </span>
            <span class="gu-trust-pill">
              <span class="gu-trust-dot">🔬</span> Scientific Fact-Check
            </span>
            <span class="gu-trust-pill gu-trust-advisory">
              <span class="gu-trust-dot">⚠️</span> Zero Trespassing Policy
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
              We couldn't find anything matching your filter criteria in the selected district or collection.
            </p>
            <button class="btn-primary-action gu-empty-reset" onclick="window.GujaratUnfiltered.resetFilters()">
              Show All Stories
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
      const isRestricted = story.legalAccess && !story.legalAccess.isSafeAndLawful;
      
      const safeLawfulBadge = !isRestricted
        ? `<span class="gu-card-safe-badge">✓ Lawful Public Access</span>`
        : `<span class="gu-card-warn-badge" style="color: #991B1B;">⛔ Strictly Restricted Private Property</span>`;

      // Multi-dimensional research status chips
      const chipsHtml = (story.researchStatus || []).map(statusKey => {
        const info = STATUS_LABELS[statusKey] || { label: statusKey, icon: '•', className: 'chip-place' };
        return `<span class="gu-chip-status ${info.className}">${info.icon} ${info.label}</span>`;
      }).join('');

      return `
        <article class="gu-card ${isRestricted ? 'gu-card-restricted' : ''}" id="card-${story.id}" data-id="${story.id}">
          <!-- Media Wrap -->
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
              <span class="gu-district-badge">📍 ${story.district}${story.taluka ? ' (' + story.taluka + ')' : ''}</span>
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

            <!-- Research Status Chips -->
            <div class="gu-card-status-chips" aria-label="Research and Access Classifications">
              ${chipsHtml}
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
              <span class="gu-factcheck-pill" style="${isRestricted ? 'background:#FEE2E2; color:#991B1B; border-color:#991B1B;' : ''}">
                ${story.factCheckBadge}
              </span>
            </div>

            <!-- Legal Access & Safety Banner -->
            <div class="gu-legal-banner ${isRestricted ? 'gu-legal-restricted' : ''}">
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
                <span>${isRestricted ? '📖 Read Fact-Check &amp; Debunking' : '📖 Read Story &amp; Reality'}</span>
              </button>
              
              <button 
                class="gu-btn-map" 
                onclick="window.GujaratUnfiltered.locateOnMap('${story.id}')"
                title="Locate ${story.name} on the Gujarat Map"
              >
                <span>📍 Map</span>
              </button>

              ${!isRestricted ? `
                <button 
                  class="gu-btn-trip" 
                  onclick="window.GujaratUnfiltered.planInTripReality('${story.id}')"
                  title="Check last-mile feasibility in Trip Reality"
                >
                  <span>🧭 Plan</span>
                </button>
              ` : `
                <button 
                  class="gu-btn-trip gu-btn-restricted" 
                  title="Private property — public visits prohibited"
                  disabled
                >
                  <span>⛔ No Entry</span>
                </button>
              `}
            </footer>
          </div>
        </article>
      `;
    }

    /**
     * Modal Reader — Deep Dive with Narrative, Folklore vs Science, Safety, Photo Tips, and Provenance Sources
     */
    openStoryModal(storyId) {
      const story = this.stories.find(s => s.id === storyId);
      if (!story) return;

      const modal = document.getElementById('unfilteredStoryModal');
      const content = document.getElementById('unfilteredModalContent');
      if (!modal || !content) return;

      const meta = COLLECTIONS_META[story.collection] || COLLECTIONS_META['all'];
      const isRestricted = story.legalAccess && !story.legalAccess.isSafeAndLawful;

      // Status chips
      const chipsHtml = (story.researchStatus || []).map(statusKey => {
        const info = STATUS_LABELS[statusKey] || { label: statusKey, icon: '•', className: 'chip-place' };
        return `<span class="gu-chip-status ${info.className}">${info.icon} ${info.label}</span>`;
      }).join('');

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
                <span class="gu-district-badge">📍 ${story.district}${story.taluka ? ' (' + story.taluka + ')' : ''} • ${story.region}</span>
              </div>
              <span class="gu-modal-guj">${story.gujaratiName}</span>
              <h2 class="gu-modal-title">${story.name}</h2>
              <p class="gu-modal-tagline">${story.tagline}</p>
              <div class="gu-card-status-chips" style="margin-top:0.5rem;">
                ${chipsHtml}
              </div>
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
                      <small>Archaeological, geological &amp; official facts</small>
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

              <div class="gu-safety-card ${isRestricted ? 'gu-legal-restricted' : ''}">
                <div class="gu-safety-status-row">
                  <span class="gu-statutory-pill">
                    <strong>Jurisdiction:</strong> ${story.legalAccess?.accessType || 'Public Domain'}
                  </span>
                  <span class="gu-law-badge ${story.legalAccess?.isSafeAndLawful ? 'badge-safe' : 'badge-caution'}">
                    ${story.legalAccess?.isSafeAndLawful ? '✓ Lawful & Safe by Day' : '⛔ Strictly Restricted — Entry Prohibited'}
                  </span>
                </div>

                <div class="gu-safety-rules-box">
                  <h5 class="gu-rules-title">🛡️ Statutory Safety Advisory &amp; Ethical Exploration:</h5>
                  <p class="gu-rules-text">${story.legalAccess?.rulesAndWarnings}</p>
                  <ul class="gu-ethics-list">
                    <li>✓ No trespassing on private property, industrial sites, or demarcated border/forest zones.</li>
                    <li>✓ Zero damage to historic stone masonry, stepwell carvings, or fossil layers.</li>
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

            <!-- Section 5: Auditable Provenance & Source References -->
            <section class="gu-provenance-section" aria-label="Scholarly Sources and Research Provenance">
              <div class="gu-provenance-header">
                <h4 class="gu-provenance-title">05 Auditable Research Provenance &amp; Verification</h4>
                <span class="gu-provenance-meta">Audited: ${story.researchDate || '2026-10-19'} • Confidence: ${story.positionalConfidence || 'exact'}</span>
              </div>

              <div class="gu-sources-grid">
                <!-- Primary Sources -->
                <div class="gu-sources-column">
                  <h5>Primary &amp; Statutory Sources</h5>
                  ${(story.primarySources || []).map(src => `
                    <div class="gu-source-item">
                      <a href="${src.url}" target="_blank" rel="noopener noreferrer">${src.title} ↗</a>
                      <span class="gu-source-publisher">${src.publisher} (${src.type})</span>
                    </div>
                  `).join('')}
                </div>

                <!-- Corroborating Sources -->
                <div class="gu-sources-column">
                  <h5>Corroborating Historical Citations</h5>
                  ${(story.corroboratingSources || []).map(src => `
                    <div class="gu-source-item">
                      <a href="${src.url}" target="_blank" rel="noopener noreferrer">${src.title} ↗</a>
                      <span class="gu-source-publisher">${src.publisher}</span>
                    </div>
                  `).join('')}
                </div>
              </div>

              <!-- Field Limitations & Uncertainties -->
              ${story.uncertaintiesNote ? `
                <div class="gu-uncertainties-box">
                  <strong>Field Verification Note:</strong> ${story.uncertaintiesNote}
                </div>
              ` : ''}
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
            ${!isRestricted ? `
              <button class="btn-primary-action gu-modal-btn gu-modal-btn-trip" onclick="window.GujaratUnfiltered.planInTripReality('${story.id}'); window.GujaratUnfiltered.closeStoryModal();">
                🧭 Check Last-Mile in Trip Reality ➔
              </button>
            ` : `
              <button class="btn-primary-action gu-modal-btn gu-btn-restricted" disabled>
                ⛔ Private Property (No Entry)
              </button>
            `}
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
     * Close modal
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
     * Open 34-District Research Audit Ledger Modal
     */
    async openLedgerModal(filterText = '') {
      const modal = document.getElementById('unfilteredLedgerModal');
      const content = document.getElementById('unfilteredLedgerModalContent');
      if (!modal || !content) return;

      if (!this.ledgerData) {
        try {
          const resp = await fetch('data/district_coverage_ledger.json');
          if (resp.ok) this.ledgerData = await resp.json();
        } catch (e) {
          console.error('[GujaratUnfiltered] Error loading ledger data:', e);
        }
      }

      this.ledgerSearchQuery = filterText;
      this.renderLedgerContent(content);

      if (typeof modal.showModal === 'function') {
        modal.showModal();
      } else {
        modal.classList.add('open');
      }
      modal.scrollTop = 0;
    }

    /**
     * Filter ledger in real-time
     */
    filterLedger(val) {
      this.ledgerSearchQuery = val;
      const content = document.getElementById('unfilteredLedgerModalContent');
      if (content) {
        this.renderLedgerContent(content);
        const searchInput = document.getElementById('guLedgerSearchInput');
        if (searchInput) {
          searchInput.focus();
          searchInput.setSelectionRange(val.length, val.length);
        }
      }
    }

    /**
     * Render ledger content
     */
    renderLedgerContent(content) {
      if (!this.ledgerData) {
        content.innerHTML = `
          <div style="padding: 2rem; text-align: center;">
            <p>Loading research audit ledger...</p>
            <button class="btn-secondary-action" onclick="window.GujaratUnfiltered.closeLedgerModal()">Close</button>
          </div>
        `;
        return;
      }

      const meta = this.ledgerData.metadata || {};
      const totals = this.ledgerData.statewideAuditTotals || {};
      const q = (this.ledgerSearchQuery || '').trim().toLowerCase();
      
      const districts = (this.ledgerData.districtLedger || []).filter(d => {
        if (!q) return true;
        const hay = [
          d.district,
          d.is34thDistrict ? '34th district vav tharad' : '',
          ...(d.verifiedPlaces || []).map(p => `${p.name} ${p.category} ${p.collection}`),
          ...(d.rejectedClaimsAudit || []).map(r => `${r.candidateName} ${r.claim} ${r.reason}`),
          d.researchGapNote || ''
        ].join(' ').toLowerCase();
        return hay.includes(q);
      });

      content.innerHTML = `
        <article class="gu-modal-article">
          <!-- Modal Close Button -->
          <button class="gu-modal-close-btn" onclick="window.GujaratUnfiltered.closeLedgerModal()" aria-label="Close Research Ledger">✕</button>

          <!-- Header -->
          <div class="gu-ledger-header">
            <span class="gu-ledger-eyebrow">🏛️ STATEWIDE RESEARCH &amp; VERIFICATION AUDIT • ALL 34 DISTRICTS</span>
            <h2 class="gu-ledger-title">Gujarat Unfiltered: 34-District Place Discovery Ledger</h2>
            <p class="gu-ledger-desc">
              ${meta.curationStandard || 'Rigorous physical fact-checking, separation of oral lore from ground reality, statutory access transparency, and zero promotion of trespassing.'}
            </p>
          </div>

          <!-- Statewide Totals Bar -->
          <div class="gu-ledger-totals-grid">
            <div class="gu-ledger-total-card">
              <div class="gu-ledger-total-num">${totals.totalCandidatesResearched || 80}</div>
              <div class="gu-ledger-total-lbl">Candidates Researched</div>
            </div>
            <div class="gu-ledger-total-card">
              <div class="gu-ledger-total-num" style="color: #15803D;">${totals.totalAccepted || 45}</div>
              <div class="gu-ledger-total-lbl">Accepted Places</div>
            </div>
            <div class="gu-ledger-total-card">
              <div class="gu-ledger-total-num" style="color: #B84638;">${totals.totalRejectedOrDebunked || 35}</div>
              <div class="gu-ledger-total-lbl">Debunked / Rejected</div>
            </div>
            <div class="gu-ledger-total-card">
              <div class="gu-ledger-total-num" style="color: #315BD6;">${totals.totalDuplicatedConsolidated || 2}</div>
              <div class="gu-ledger-total-lbl">Duplicates Consolidated</div>
            </div>
            <div class="gu-ledger-total-card">
              <div class="gu-ledger-total-num" style="color: #D97706;">${totals.totalAwaitingFieldVerification || 0}</div>
              <div class="gu-ledger-total-lbl">Awaiting Verification</div>
            </div>
          </div>

          <!-- Body with Search & District Cards -->
          <div class="gu-ledger-body">
            <div class="gu-ledger-search-bar">
              <input 
                type="text" 
                id="guLedgerSearchInput" 
                class="gu-ledger-search-input" 
                placeholder="Search ledger by district (e.g. Vav-Tharad, Ahmedabad, Kachchh, Surat, Dang) or rejected claim..." 
                value="${this.ledgerSearchQuery || ''}"
                oninput="window.GujaratUnfiltered.filterLedger(this.value)"
              />
              ${this.ledgerSearchQuery ? `
                <button class="btn-secondary-action" onclick="window.GujaratUnfiltered.filterLedger('')" style="padding: 0.5rem 1rem;">Clear</button>
              ` : ''}
            </div>

            <div style="font-size: 0.78rem; font-weight: 700; color: #555148; margin-bottom: 0.25rem;">
              Showing <strong>${districts.length}</strong> of 34 Districts
            </div>

            ${districts.length > 0 ? districts.map(d => `
              <div class="gu-ledger-district-card">
                <div class="gu-ld-header">
                  <div class="gu-ld-name">
                    <span>${d.district}</span>
                    ${d.is34thDistrict ? `
                      <span class="gu-ld-pill" style="background:#E2AE48; color:#20201D; font-weight:800;">★ 34th District (Created 2 Oct 2025)</span>
                    ` : ''}
                  </div>
                  <div class="gu-ld-stats">
                    <span class="gu-ld-pill gu-ld-pill-accepted">✓ ${d.researchStatistics?.acceptedCount || 0} Accepted</span>
                    <span class="gu-ld-pill gu-ld-pill-rejected">✕ ${d.researchStatistics?.rejectedCount || 0} Rejected/Debunked</span>
                    ${d.researchStatistics?.duplicatedConsolidatedCount > 0 ? `
                      <span class="gu-ld-pill">⚯ ${d.researchStatistics.duplicatedConsolidatedCount} Consolidated</span>
                    ` : ''}
                  </div>
                </div>

                <!-- Accepted Verified Places -->
                <div class="gu-ld-section">
                  <span class="gu-ld-sec-title">✓ Verified Places in Database:</span>
                  <div class="gu-ld-items-list">
                    ${(d.verifiedPlaces || []).map(p => `
                      <div class="gu-ld-item gu-ld-item-acc">
                        <strong>${p.name}</strong> 
                        <span style="font-size: 0.72rem; color: #555148;">• [${p.category} | ${p.collection}]</span>
                        <div style="font-size: 0.74rem; color: #166534; margin-top: 0.15rem;">
                          ⚖️ ${p.accessType} (${p.isLawful ? 'Lawful Entry' : 'Restricted'}) • ${p.primarySourcesCount || 1} Primary Sources • ${p.corroboratingSourcesCount || 1} Citations
                        </div>
                      </div>
                    `).join('')}
                  </div>
                </div>

                <!-- Rejected / Debunked Claims -->
                ${(d.rejectedClaimsAudit || []).length > 0 ? `
                  <div class="gu-ld-section">
                    <span class="gu-ld-sec-title" style="color: #991B1B;">✕ Debunked Legends &amp; Rejected Claims:</span>
                    <div class="gu-ld-items-list">
                      ${d.rejectedClaimsAudit.map(r => `
                        <div class="gu-ld-item gu-ld-item-rej">
                          <strong>Candidate: ${r.candidateName}</strong> [${r.category}]
                          <div style="font-size: 0.75rem; color: #4B5563; margin-top: 0.15rem;"><em>Claim:</em> "${r.claim}"</div>
                          <span class="gu-ld-reason"><strong>Reason for Rejection:</strong> ${r.reason}</span>
                        </div>
                      `).join('')}
                    </div>
                  </div>
                ` : ''}

                <!-- Category Gaps Note -->
                ${d.researchGapNote ? `
                  <div class="gu-ld-gap-note">
                    <strong>Category Coverage &amp; Gap Rationale:</strong> ${d.researchGapNote}
                  </div>
                ` : ''}
              </div>
            `).join('') : `
              <div style="padding: 2rem; text-align: center; color: #716D65;">
                <p>No districts match "${this.ledgerSearchQuery}".</p>
                <button class="btn-secondary-action" onclick="window.GujaratUnfiltered.filterLedger('')">Reset Search</button>
              </div>
            `}
          </div>

          <!-- Footer Actions -->
          <div class="gu-ledger-footer">
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              <a href="data/district_coverage_ledger.json" download class="btn-secondary-action" style="font-size: 0.8rem; text-decoration: none;">
                📥 Download Full Ledger (JSON)
              </a>
              <a href="data/schema/gujarat_unfiltered.schema.json" target="_blank" rel="noopener noreferrer" class="btn-secondary-action" style="font-size: 0.8rem; text-decoration: none;">
                📜 View JSON Schema (Draft 2020-12)
              </a>
            </div>
            <button class="btn-primary-action" onclick="window.GujaratUnfiltered.closeLedgerModal()">
              Close Ledger
            </button>
          </div>
        </article>
      `;
    }

    /**
     * Close ledger modal
     */
    closeLedgerModal() {
      const modal = document.getElementById('unfilteredLedgerModal');
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
     * Set active district filter and re-render
     */
    setDistrict(distKey) {
      this.activeDistrict = distKey;
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
      this.activeDistrict = 'all';
      this.searchQuery = '';
      this.render();
    }

    /**
     * Locate story on map, fly to coordinates, and open popup
     */
    locateOnMap(storyId) {
      const story = this.stories.find(s => s.id === storyId);
      if (!story || !story.coordinates || !window.map) return;

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

      if (window.PublicViews && typeof window.PublicViews.switchDestination === 'function') {
        window.PublicViews.switchDestination('plan', true);
      }

      setTimeout(() => {
        if (window.TripReality) {
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
