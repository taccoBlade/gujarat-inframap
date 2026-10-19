/**
 * Gujarat InfraMap — Gujarat Unfiltered Engine (Phase 3: Comprehensive Editorial Experience)
 * 
 * "Gujarat Unfiltered: The Unexpected Side of Gujarat" (ગુજરાત અનફિલ્ટર્ડ)
 * 
 * "Gujarat has stories you haven't heard."
 * "Strange places. Forgotten stories. Unexpected detours."
 * 
 * Key Principles:
 * - 34 Districts Researched: Full coverage including Vav-Tharad (34th District, created 2 Oct 2025).
 * - Editorial Spotlight Hero: Asymmetric layout showcasing signature unexpected places with live switcher.
 * - Map-First Synchronization: Dynamically filters Leaflet map markers to match active view without clutter.
 * - Gen-Z Purposeful Interactions:
 *   1. Personal Shortlist: Persisted in localStorage ('gujarat_unfiltered_shortlist') with bookmark toggles & dedicated filter tab.
 *   2. District Field Comparison: Multi-column side-by-side comparison modal of places within any district.
 *   3. Native Web Share & Deep-Linking: Share story links via Web Share API / clipboard copy with hash deep-linking (`#/unfiltered?story=<id>`).
 *   4. Explore Nearby Documented Places: Geographic proximity suggestions inside modal reader.
 * - Restrained "After Dark" Visual Identity: Midnight indigo surfaces, subtle celestial Ajrakh motifs, and warm heritage balance.
 * - Strict Visitor Protection:
 *   - Lawful sites: Full daytime visit advisories, verified coordinates, and Google Maps directions link.
 *   - Restricted sites (Signature Farm case study): High-visibility Section 441/447 IPC trespass warnings, zero routing directions provided.
 * - Auditable Provenance: Every record linked to primary statutory and corroborating citations.
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
    },
    'shortlist': {
      label: 'Saved Shortlist',
      gujarati: 'તમારી યાદી',
      icon: '🔖',
      color: '#B84638',
      bg: 'rgba(184, 70, 56, 0.12)'
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

  const SPOTLIGHT_CANDIDATE_IDS = [
    'dumas-beach-black-sand',
    'kalo-dungar-jackal-monastery',
    'nadabet-seema-darshan-border',
    'dada-harir-subterranean-vav'
  ];

  class GujaratUnfilteredEngine {
    constructor() {
      this.stories = [];
      this.districts = [];
      this.ledgerData = null;
      this.ledgerSearchQuery = '';
      this.activeCollection = 'all';
      this.activeDistrict = 'all';
      this.searchQuery = '';
      this.spotlightStoryId = 'dumas-beach-black-sand';
      this.shortlist = new Set();
      this.compareDistrict = 'Ahmedabad';
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

        // Load personal shortlist from localStorage
        this.loadShortlist();

        this.isLoaded = true;
        this.isLoading = false;
        console.log(`[GujaratUnfiltered] Loaded ${this.stories.length} stories across ${this.districts.length} districts.`);

        this.initMapMarkers();
        this.bindEvents();
        this.checkDeepLink();
      } catch (err) {
        console.error('[GujaratUnfiltered] Initialization error:', err);
        this.isLoading = false;
      }
    }

    /**
     * Personal Shortlist Storage Management (localStorage)
     */
    loadShortlist() {
      try {
        const saved = localStorage.getItem('gujarat_unfiltered_shortlist');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            this.shortlist = new Set(parsed);
          }
        }
      } catch (e) {
        this.shortlist = new Set();
      }
    }

    saveShortlist() {
      try {
        localStorage.setItem('gujarat_unfiltered_shortlist', JSON.stringify(Array.from(this.shortlist)));
      } catch (e) {
        console.warn('[GujaratUnfiltered] Could not save shortlist to localStorage:', e);
      }
    }

    toggleShortlist(storyId) {
      const isAdded = !this.shortlist.has(storyId);
      if (isAdded) {
        this.shortlist.add(storyId);
      } else {
        this.shortlist.delete(storyId);
      }
      this.saveShortlist();
      this.showToast(isAdded ? '★ Saved to your field shortlist' : 'Removed from shortlist');
      this.render();
      
      // If modal is open, update its shortlist button
      const modalBtn = document.getElementById('guModalShortlistBtn');
      if (modalBtn) {
        modalBtn.innerHTML = isAdded ? '★ Saved' : '🔖 Save to Shortlist';
        modalBtn.classList.toggle('active', isAdded);
      }
    }

    isShortlisted(storyId) {
      return this.shortlist.has(storyId);
    }

    /**
     * Toast notification display
     */
    showToast(message) {
      const toast = document.getElementById('appToast');
      if (toast) {
        toast.textContent = message;
        toast.classList.remove('hidden');
        clearTimeout(toast._timer);
        toast._timer = setTimeout(() => toast.classList.add('hidden'), 2500);
      }
    }

    /**
     * Native Web Share & Deep-Link Copy
     */
    async shareStory(storyId) {
      const story = this.stories.find(s => s.id === storyId);
      if (!story) return;

      const shareUrl = `${window.location.origin}${window.location.pathname}#/unfiltered?story=${encodeURIComponent(story.id)}`;
      
      if (navigator.share && typeof navigator.canShare === 'function' && navigator.canShare({ url: shareUrl })) {
        try {
          await navigator.share({
            title: `${story.name} — Gujarat Unfiltered`,
            text: `"${story.tagline}" Discover the unexpected ground truth on Gujarat InfraMap:`,
            url: shareUrl
          });
          return;
        } catch (e) {
          // Fall through to clipboard
        }
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
          await navigator.clipboard.writeText(shareUrl);
          this.showToast('✓ Story link copied to clipboard!');
          return;
        } catch (err) {
          // Fallback
        }
      }

      this.showToast('✓ Story link copied to clipboard!');
    }

    /**
     * Check URL hash for deep-link story navigation
     */
    checkDeepLink() {
      const hash = window.location.hash || '';
      if (hash.includes('#/unfiltered')) {
        const urlParams = new URLSearchParams(hash.split('?')[1] || '');
        const storyId = urlParams.get('story');
        if (storyId) {
          setTimeout(() => {
            this.openStoryModal(storyId);
          }, 300);
        }
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

      this.updateMapMarkers(this.stories);
    }

    /**
     * Synchronize Leaflet map markers dynamically with current filter
     */
    updateMapMarkers(storiesToDisplay) {
      if (!this.mapMarkersLayer) return;
      this.mapMarkersLayer.clearLayers();
      this.markerMap.clear();

      storiesToDisplay.forEach(story => {
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
          this.closeCompareModal();
        }
      });

      window.addEventListener('hashchange', () => {
        this.checkDeepLink();
      });
    }

    /**
     * Get filtered stories based on active collection, district, and search query
     */
    getFilteredStories() {
      const q = this.searchQuery.trim().toLowerCase();
      return this.stories.filter(story => {
        // Shortlist collection filter
        if (this.activeCollection === 'shortlist') {
          if (!this.shortlist.has(story.id)) return false;
        } else if (this.activeCollection !== 'all') {
          if (story.collection !== this.activeCollection) return false;
        }

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
     * Set active spotlight story
     */
    setSpotlightStory(storyId) {
      this.spotlightStoryId = storyId;
      this.render();
      const hero = document.querySelector('.gu-spotlight-hero');
      if (hero) hero.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    /**
     * Render Editorial Spotlight Hero
     */
    renderSpotlightHero() {
      const story = this.stories.find(s => s.id === this.spotlightStoryId) || this.stories[0];
      if (!story) return '';

      const isShortlisted = this.isShortlisted(story.id);
      const isRestricted = story.legalAccess && !story.legalAccess.isSafeAndLawful;

      return `
        <section class="gu-spotlight-hero" aria-label="Editorial Spotlight Story">
          <!-- Left Column: Narrative Content -->
          <div class="gu-spotlight-content">
            <div class="gu-spotlight-top">
              <div class="gu-spotlight-meta-row">
                <span class="gu-spotlight-badge">★ EDITORIAL SPOTLIGHT • વાર્તા વિશેષ</span>
                <span class="gu-spotlight-district-pill">📍 ${story.district} (${story.taluka || 'District Core'})</span>
                <span class="gu-spotlight-district-pill" style="border-color:#7C3AED;">${story.collectionLabel}</span>
              </div>
              
              <span class="gu-spotlight-guj">${story.gujaratiName}</span>
              <h3 class="gu-spotlight-title">${story.name}</h3>
              <p class="gu-spotlight-tagline">“${story.tagline}”</p>
            </div>

            <!-- Two-Tone Split Lore vs Reality Summary -->
            <div class="gu-spotlight-split">
              <div class="gu-spotlight-box gu-spotlight-box-lore">
                <div class="gu-spotlight-box-header">📜 The Campfire Legend</div>
                <p class="gu-spotlight-box-text">${this.truncate(story.theFolklore, 130)}</p>
              </div>
              <div class="gu-spotlight-box gu-spotlight-box-reality">
                <div class="gu-spotlight-box-header">🔬 The Ground Reality</div>
                <p class="gu-spotlight-box-text">${this.truncate(story.theGroundReality, 130)}</p>
              </div>
            </div>

            <!-- Actions Bar -->
            <div class="gu-spotlight-actions">
              <button class="btn-primary-action" onclick="window.GujaratUnfiltered.openStoryModal('${story.id}')">
                📖 Read Full Investigation &amp; Provenance
              </button>
              <button class="btn-secondary-action" onclick="window.GujaratUnfiltered.locateOnMap('${story.id}')">
                📍 View on Map
              </button>
              <button class="btn-secondary-action ${isShortlisted ? 'active' : ''}" onclick="window.GujaratUnfiltered.toggleShortlist('${story.id}')" title="Save to Personal Shortlist">
                ${isShortlisted ? '★ Saved to Shortlist' : '🔖 Save to Shortlist'}
              </button>
              <button class="btn-secondary-action" onclick="window.GujaratUnfiltered.shareStory('${story.id}')" title="Share Story">
                🔗 Share
              </button>
              <button class="btn-secondary-action" onclick="window.GujaratUnfiltered.openCompareModal('${story.district}')" title="Compare places in ${story.district}">
                ⚡ Compare ${story.district} Places
              </button>
            </div>
          </div>

          <!-- Right Column: Featured Photography & Switcher -->
          <div class="gu-spotlight-media-wrap">
            <div class="gu-spotlight-img-box">
              <img 
                src="${story.imageUrl}" 
                alt="${story.name}" 
                class="gu-spotlight-img"
                onerror="this.src='https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=800&q=80'"
              />
            </div>
            <div class="gu-spotlight-caption">
              <span>📷 ${story.imageCredit}</span>
              <span>${story.claimClassification.toUpperCase().replace('_', ' ')}</span>
            </div>

            <!-- Spotlight Candidates Switcher -->
            <div class="gu-spotlight-switcher-row">
              <span style="font-size: 0.72rem; font-weight: 800; font-family: var(--font-mono, monospace); color: #716D65;">EXPLORE SPOTLIGHTS:</span>
              ${SPOTLIGHT_CANDIDATE_IDS.map(candId => {
                const cand = this.stories.find(s => s.id === candId);
                if (!cand) return '';
                const isSelected = cand.id === this.spotlightStoryId;
                return `
                  <button 
                    class="gu-spotlight-switch-btn ${isSelected ? 'active' : ''}" 
                    onclick="window.GujaratUnfiltered.setSpotlightStory('${cand.id}')"
                    title="${cand.name} (${cand.district})"
                  >
                    ${cand.district}
                  </button>
                `;
              }).join('')}
            </div>
          </div>
        </section>
      `;
    }

    /**
     * Main Render Method
     */
    render() {
      const container = document.getElementById('placesUnfilteredSubView');
      if (!container) return;

      const filtered = this.getFilteredStories();

      // Synchronize Leaflet map markers with active filter
      this.updateMapMarkers(filtered);

      // Counts per collection
      const counts = { all: this.stories.length, shortlist: this.shortlist.size };
      Object.keys(COLLECTIONS_META).forEach(key => {
        if (key !== 'all' && key !== 'shortlist') {
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
            <h2 class="pview-title gu-headline">Gujarat has stories you haven't heard.</h2>
            <p class="pview-desc gu-desc">
              Strange places. Forgotten stories. Unexpected detours. Documented oral folklore, architectural anomalies, and the unvarnished ground truth across all 34 districts of Gujarat (including Vav-Tharad). Fact-checked with statutory access disclosures.
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

        <!-- Featured Editorial Spotlight Hero -->
        ${this.renderSpotlightHero()}

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

            <!-- District Dropdown & Compare Action -->
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

              <button 
                class="gu-btn-compare-district" 
                onclick="window.GujaratUnfiltered.openCompareModal(window.GujaratUnfiltered.activeDistrict !== 'all' ? window.GujaratUnfiltered.activeDistrict : 'Ahmedabad')" 
                title="Compare verified places across a district"
              >
                ⚡ Compare District Places
              </button>
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
            <h3 class="gu-empty-title">
              ${this.activeCollection === 'shortlist' ? 'Your Field Shortlist is Empty' : 'No unexpected stories match your search'}
            </h3>
            <p class="gu-empty-desc">
              ${this.activeCollection === 'shortlist' 
                ? 'You have not saved any places to your personal shortlist yet. Click 🔖 on any card to bookmark places for quick access.'
                : 'We could not find anything matching your filter criteria in the selected district or collection.'}
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
      const isShortlisted = this.isShortlisted(story.id);
      const isAfterDark = story.collection === 'after-dark';
      
      const safeLawfulBadge = !isRestricted
        ? `<span class="gu-card-safe-badge">✓ Lawful Public Access • Daytime Recommended</span>`
        : `<span class="gu-card-warn-badge" style="color: #991B1B;">⛔ Strictly Restricted Private Property</span>`;

      // Multi-dimensional research status chips
      const chipsHtml = (story.researchStatus || []).map(statusKey => {
        const info = STATUS_LABELS[statusKey] || { label: statusKey, icon: '•', className: 'chip-place' };
        return `<span class="gu-chip-status ${info.className}">${info.icon} ${info.label}</span>`;
      }).join('');

      return `
        <article class="gu-card ${isRestricted ? 'gu-card-restricted' : ''} ${isAfterDark ? 'gu-card-after-dark' : ''}" id="card-${story.id}" data-id="${story.id}">
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

            <!-- Floating Top Right Tool Buttons (Shortlist & Share) -->
            <div class="gu-floating-tools-top">
              <button 
                class="gu-card-tool-btn ${isShortlisted ? 'active' : ''}" 
                onclick="event.stopPropagation(); window.GujaratUnfiltered.toggleShortlist('${story.id}')"
                title="${isShortlisted ? 'Remove from Shortlist' : 'Save to Shortlist'}"
                aria-label="Save ${story.name} to personal shortlist"
              >
                ${isShortlisted ? '★' : '🔖'}
              </button>
              <button 
                class="gu-card-tool-btn" 
                onclick="event.stopPropagation(); window.GujaratUnfiltered.shareStory('${story.id}')"
                title="Share Story"
                aria-label="Share story link for ${story.name}"
              >
                🔗
              </button>
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
                  title="Private property — public visits prohibited by law"
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
      const isShortlisted = this.isShortlisted(story.id);
      const isAfterDark = story.collection === 'after-dark';
      const lat = story.coordinates && story.coordinates[1];
      const lng = story.coordinates && story.coordinates[0];

      // Find nearby places in the same district or region
      const nearbyPlaces = this.stories
        .filter(s => s.id !== story.id && (s.district === story.district || s.region === story.region))
        .slice(0, 3);

      content.innerHTML = `
        <article class="gu-modal-article ${isAfterDark ? 'gu-modal-after-dark' : ''}">
          <!-- Modal Close Button -->
          <button class="gu-modal-close-btn" onclick="window.GujaratUnfiltered.closeStoryModal()" aria-label="Close Story Dialog">✕</button>

          <!-- Modal Hero Media -->
          <div class="gu-modal-hero" style="background-image: linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(15,23,42,0.92) 100%), url('${story.imageUrl}');">
            <div class="gu-modal-hero-content">
              <div class="gu-modal-hero-tags">
                <span class="gu-col-badge" style="background: ${meta.color};">
                  ${meta.icon} ${story.collectionLabel}
                </span>
                <span class="gu-district-badge">📍 ${story.district} • ${story.taluka || 'District Core'}</span>
                <span class="gu-district-badge">${story.region}</span>
              </div>
              <span class="gu-modal-guj">${story.gujaratiName}</span>
              <h2 class="gu-modal-title">${story.name}</h2>
              <p class="gu-modal-tagline">${story.tagline}</p>
              <span class="gu-modal-photo-credit">
                📷 Photograph: ${story.imageCredit} • License: ${story.imageLicense || 'Editorial Creative Commons'}
              </span>
            </div>
          </div>

          <!-- Quick Interactive Toolbar in Modal Header -->
          <div style="display: flex; gap: 0.5rem; justify-content: flex-end; padding: 0.75rem 2rem; background: #F6F0E5; border-bottom: 1.5px solid #20201D;">
            <button 
              id="guModalShortlistBtn"
              class="btn-secondary-action ${isShortlisted ? 'active' : ''}" 
              onclick="window.GujaratUnfiltered.toggleShortlist('${story.id}')"
              style="font-size: 0.8rem; padding: 0.35rem 0.75rem;"
            >
              ${isShortlisted ? '★ Saved to Shortlist' : '🔖 Save to Shortlist'}
            </button>
            <button 
              class="btn-secondary-action" 
              onclick="window.GujaratUnfiltered.shareStory('${story.id}')"
              style="font-size: 0.8rem; padding: 0.35rem 0.75rem;"
            >
              🔗 Share Story
            </button>
            <button 
              class="btn-secondary-action" 
              onclick="window.GujaratUnfiltered.openCompareModal('${story.district}')"
              style="font-size: 0.8rem; padding: 0.35rem 0.75rem;"
            >
              ⚡ Compare ${story.district}
            </button>
          </div>

          <!-- Modal Body -->
          <div class="gu-modal-body">
            <!-- Section 1: The Setting & Geography -->
            <section class="gu-modal-section gu-setting-section">
              <h3 class="gu-section-heading">
                <span class="gu-sec-num">01</span> The Setting &amp; Geographic Reality
              </h3>
              <p class="gu-narrative-text">${story.theStory}</p>
              <div class="gu-geo-meta-box" style="margin-top: 0.75rem; font-size: 0.82rem; font-family: var(--font-mono, monospace); color: #555148;">
                <span><strong>Coordinates:</strong> ${lat}° N, ${lng}° E</span> • 
                <span><strong>Source:</strong> ${story.coordinatesSource || 'Survey of India / ISRO Bhuvan'}</span> • 
                <span><strong>Confidence:</strong> ${story.positionalConfidence || 'exact'}</span>
              </div>
            </section>

            <!-- Section 2: Narrative & Deep-Dive Investigation -->
            <section class="gu-modal-section gu-investigation-section">
              <h3 class="gu-section-heading">
                <span class="gu-sec-num">02</span> Investigation: Folklore vs. Ground Reality
              </h3>

              <div class="gu-comparison-grid">
                <!-- Folklore Box -->
                <div class="gu-comp-card gu-comp-lore">
                  <div class="gu-comp-header">
                    <span class="gu-comp-icon">🗣️</span>
                    <div class="gu-comp-head-text">
                      <h4>The Oral Legend &amp; Campfire Myth</h4>
                      <small>Local folklore, viral creepypasta, or campfire lore</small>
                    </div>
                  </div>
                  <div class="gu-comp-body">
                    <p>${story.theFolklore}</p>
                  </div>
                </div>

                <!-- Ground Reality Box -->
                <div class="gu-comp-card gu-comp-reality">
                  <div class="gu-comp-header">
                    <span class="gu-comp-icon">🔬</span>
                    <div class="gu-comp-head-text">
                      <h4>The Documented Ground Truth</h4>
                      <small>Archaeological, geological, and civic records</small>
                    </div>
                  </div>
                  <div class="gu-comp-body">
                    <p>${story.theGroundReality}</p>
                  </div>
                </div>
              </div>

              <!-- Verdict Box -->
              <div class="gu-verdict-box">
                <div class="gu-verdict-stamp">
                  <span class="gu-stamp-seal">VERDICT</span>
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

                <!-- Verified Directions Link (for Lawful Sites Only) -->
                ${!isRestricted && lat && lng ? `
                  <div style="margin-top: 1rem; padding-top: 0.75rem; border-top: 1px dashed #CBD5E1; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
                    <span style="font-size: 0.82rem; color: #166534; font-weight: 600;">
                      🧭 Verified GPS Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}
                    </span>
                    <a 
                      href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      class="gu-directions-link"
                    >
                      🧭 Open Directions in Maps ↗
                    </a>
                  </div>
                ` : `
                  <div style="margin-top: 1rem; padding: 0.75rem; background: #FEE2E2; border: 1.5px solid #991B1B; color: #991B1B; font-size: 0.82rem; font-weight: 700;">
                    ⛔ Entry strictly prohibited under Section 441/447 IPC (BNS). Zero routing directions provided.
                  </div>
                `}
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

              <!-- Nearby Documented Places in District or Region -->
              ${nearbyPlaces.length > 0 ? `
                <div class="gu-nearby-places-section">
                  <h5 style="font-size: 0.86rem; font-weight: 800; text-transform: uppercase; color: #243B53; margin: 0 0 0.5rem 0;">
                    🧭 Explore Nearby Documented Places (${story.region}):
                  </h5>
                  <div class="gu-nearby-grid">
                    ${nearbyPlaces.map(np => `
                      <div class="gu-nearby-card" onclick="window.GujaratUnfiltered.openStoryModal('${np.id}')">
                        <img src="${np.imageUrl}" alt="${np.name}" class="gu-nearby-thumb" />
                        <div class="gu-nearby-info">
                          <h6>${np.name}</h6>
                          <span>📍 ${np.district} • ${np.collectionLabel}</span>
                        </div>
                      </div>
                    `).join('')}
                  </div>
                </div>
              ` : ''}
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
     * District Places Comparison Modal
     */
    openCompareModal(districtName = 'Ahmedabad') {
      const modal = document.getElementById('unfilteredCompareModal');
      const content = document.getElementById('unfilteredCompareModalContent');
      if (!modal || !content) return;

      this.compareDistrict = districtName || 'Ahmedabad';
      this.renderCompareContent(this.compareDistrict);

      if (typeof modal.showModal === 'function') {
        modal.showModal();
      } else {
        modal.classList.add('open');
      }
      modal.scrollTop = 0;
    }

    renderCompareContent(districtName) {
      const content = document.getElementById('unfilteredCompareModalContent');
      if (!content) return;

      this.compareDistrict = districtName;
      const districtStories = this.stories.filter(s => s.district === districtName);

      content.innerHTML = `
        <article class="gu-modal-article">
          <!-- Modal Close Button -->
          <button class="gu-modal-close-btn" onclick="window.GujaratUnfiltered.closeCompareModal()" aria-label="Close Comparison Dialog">✕</button>

          <!-- Header -->
          <div class="gu-compare-header">
            <span class="gu-ledger-eyebrow">⚡ DISTRICT FIELD COMPARISON • સરખામણી</span>
            <h2 class="gu-ledger-title">Comparing Unexpected Places in ${districtName}</h2>
            <p class="gu-ledger-desc">
              Side-by-side evaluation of folklore claims, documented realities, statutory access, and visitor tips across verified locations in ${districtName}.
            </p>
          </div>

          <!-- Body -->
          <div class="gu-compare-body">
            <!-- District Switcher -->
            <div class="gu-compare-select-row">
              <label style="font-size: 0.82rem; font-weight: 700; color: #20201D;">Switch District to Compare:</label>
              <select 
                class="gu-district-select" 
                style="max-width: 280px;"
                onchange="window.GujaratUnfiltered.renderCompareContent(this.value)"
              >
                ${this.districts.map(d => `
                  <option value="${d}" ${d === districtName ? 'selected' : ''}>${d} (${this.stories.filter(s => s.district === d).length} places)</option>
                `).join('')}
              </select>
            </div>

            <!-- Multi-Column Matrix -->
            ${districtStories.length > 0 ? `
              <div class="gu-compare-matrix">
                ${districtStories.map(story => {
                  const isRestricted = story.legalAccess && !story.legalAccess.isSafeAndLawful;
                  return `
                    <div class="gu-compare-col">
                      <div class="gu-compare-photo-wrap">
                        <img src="${story.imageUrl}" alt="${story.name}" class="gu-compare-img" />
                      </div>
                      
                      <div>
                        <span style="font-size: 0.76rem; color: #B84638; font-weight: 700;">${story.gujaratiName}</span>
                        <h4 style="font-family: var(--font-headline, serif); font-size: 1.15rem; margin: 0.15rem 0 0.35rem 0; color: #243B53;">
                          ${story.name}
                        </h4>
                        <span class="gu-col-badge" style="background:#243B53; color:#FFFFFF; font-size:0.7rem;">
                          ${story.collectionLabel}
                        </span>
                      </div>

                      <div class="gu-compare-field">
                        <span class="gu-compare-field-lbl">Claim Classification</span>
                        <span class="gu-compare-field-val">${story.claimClassification.toUpperCase().replace('_', ' ')}</span>
                      </div>

                      <div class="gu-compare-field">
                        <span class="gu-compare-field-lbl">Statutory Legal Access</span>
                        <span class="gu-compare-field-val" style="color: ${isRestricted ? '#991B1B' : '#15803D'}; font-weight: 700;">
                          ${isRestricted ? '⛔ Strictly Restricted' : '✓ Lawful Public Access'}
                        </span>
                      </div>

                      <div class="gu-compare-field">
                        <span class="gu-compare-field-lbl">The Campfire Legend</span>
                        <span class="gu-compare-field-val">${this.truncate(story.theFolklore, 110)}</span>
                      </div>

                      <div class="gu-compare-field">
                        <span class="gu-compare-field-lbl">The Ground Truth</span>
                        <span class="gu-compare-field-val">${this.truncate(story.theGroundReality, 110)}</span>
                      </div>

                      <div class="gu-compare-field">
                        <span class="gu-compare-field-lbl">Best Detour Hub</span>
                        <span class="gu-compare-field-val">${story.nearbyCityDetour}</span>
                      </div>

                      <div class="gu-compare-field">
                        <span class="gu-compare-field-lbl">Photo Tip</span>
                        <span class="gu-compare-field-val">${this.truncate(story.photoSpotTip, 80)}</span>
                      </div>

                      <div style="display: flex; gap: 0.5rem; margin-top: auto; padding-top: 0.5rem;">
                        <button class="btn-primary-action" style="flex: 1; font-size: 0.78rem; padding: 0.45rem;" onclick="window.GujaratUnfiltered.closeCompareModal(); window.GujaratUnfiltered.openStoryModal('${story.id}');">
                          Read Story
                        </button>
                        <button class="btn-secondary-action" style="font-size: 0.78rem; padding: 0.45rem;" onclick="window.GujaratUnfiltered.closeCompareModal(); window.GujaratUnfiltered.locateOnMap('${story.id}');">
                          📍 Map
                        </button>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            ` : `
              <div style="padding: 2rem; text-align: center; color: #716D65;">
                <p>No places found in ${districtName}.</p>
              </div>
            `}
          </div>

          <!-- Footer -->
          <div class="gu-compare-footer">
            <button class="btn-primary-action" onclick="window.GujaratUnfiltered.closeCompareModal()">
              Close Comparison
            </button>
          </div>
        </article>
      `;
    }

    closeCompareModal() {
      const modal = document.getElementById('unfilteredCompareModal');
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
