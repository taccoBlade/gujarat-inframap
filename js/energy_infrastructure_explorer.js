/**
 * Gujarat InfraMap — Hydropower & Gujarat Energy Infrastructure Explorer
 * 
 * Provides:
 * 1. Multi-filter Generating Stations Ledger with dynamic KPIs and CSV export.
 * 2. Water-Energy Nexus View linking Hydropower, Thermal/Nuclear Cooling, and Irrigation Pumping.
 * 3. Audited CEA FY23-24 Capacity vs Reported Generation Benchmark with PLF% calculations.
 * 4. Parametric Hydropower Physics & Turbine Conversion Lab (P = ρ·g·Q·H·η).
 * 5. Interactive Grid Evacuation Tracing on Leaflet map panes.
 * 
 * Statutory Standard: Clearly distinguishes Installed Capacity (MW), Reported Generation (MU),
 * and Illustrative Theoretical Physics values. Discloses zero fabricated operational correlations.
 */

(function (window) {
  "use strict";

  // Category Configuration
  const SOURCE_CONFIG = {
    hydro: { label: "Hydropower", icon: "💧⚡", color: "#06b6d4", bg: "rgba(6, 182, 212, 0.15)", border: "#0891b2" },
    solar: { label: "Solar PV", icon: "☀️", color: "#eab308", bg: "rgba(234, 179, 8, 0.15)", border: "#ca8a04" },
    wind: { label: "Wind Energy", icon: "💨", color: "#10b981", bg: "rgba(16, 185, 129, 0.15)", border: "#059669" },
    thermal: { label: "Thermal (Coal/Lignite)", icon: "🏭", color: "#f97316", bg: "rgba(249, 115, 22, 0.15)", border: "#ea580c" },
    gas: { label: "Natural Gas (CCGT)", icon: "🔥", color: "#a855f7", bg: "rgba(168, 85, 247, 0.15)", border: "#9333ea" },
    nuclear: { label: "Nuclear (PHWR)", icon: "⚛️", color: "#ec4899", bg: "rgba(236, 72, 153, 0.15)", border: "#db2777" }
  };

  // State
  const state = {
    initialized: false,
    map: null,
    powerFeatures: [],
    transFeatures: [],
    waterFeatures: [],
    activeTab: "generators",
    filterSource: "all",
    filterCapacity: "all",
    filterDistrict: "all",
    filterGridRole: "all",
    searchQuery: "",
    sortCol: "capacity_mw",
    sortDir: "desc",
    highlightedLayers: [],
    nexusModeActive: false
  };

  // Formatting Helpers
  function fmt(val, fallback = "—") {
    if (val === null || val === undefined || val === "") return fallback;
    if (typeof val === "number") return val.toLocaleString("en-IN");
    return String(val);
  }

  function fmtNum(val, unit = "") {
    if (val === null || val === undefined || isNaN(val)) return "—";
    return `${Number(val).toLocaleString("en-IN")}${unit ? " " + unit : ""}`;
  }

  // --- 1. DATA INITIALIZATION & INDEXING ---
  function init(mapInstance, powerData, transData, waterData) {
    state.map = mapInstance;
    state.powerFeatures = (powerData && powerData.features) ? powerData.features : [];
    state.transFeatures = (transData && transData.features) ? transData.features : [];
    state.waterFeatures = (waterData && waterData.features) ? waterData.features : [];
    state.initialized = true;

    initModalDOM();
    setupEventListeners();
  }

  function setDatasets(powerData, transData, waterData) {
    if (powerData && powerData.features) state.powerFeatures = powerData.features;
    if (transData && transData.features) state.transFeatures = transData.features;
    if (waterData && waterData.features) state.waterFeatures = waterData.features;
  }

  // --- 2. MODAL & DOM BINDINGS ---
  function initModalDOM() {
    const modal = document.getElementById("energyExplorerModal");
    if (!modal) return;

    // Populate District Filter Dropdown
    const distSelect = document.getElementById("energyFilterDistrict");
    if (distSelect) {
      const districts = Array.from(new Set(state.powerFeatures.map(f => f.properties.district).filter(Boolean))).sort();
      distSelect.innerHTML = '<option value="all">All Districts (33)</option>' +
        districts.map(d => `<option value="${d}">${d}</option>`).join("");
    }

    // Bind Tab Switching
    const tabBtns = modal.querySelectorAll(".energy-tab-btn");
    tabBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const target = btn.dataset.tab;
        switchTab(target);
      });
    });

    // Bind Filter Controls
    const srcSelect = document.getElementById("energyFilterSource");
    const capSelect = document.getElementById("energyFilterCapacity");
    const roleSelect = document.getElementById("energyFilterRole");
    const searchInput = document.getElementById("energySearchInput");
    const resetBtn = document.getElementById("energyResetFiltersBtn");
    const exportBtn = document.getElementById("energyExportCsvBtn");

    if (srcSelect) srcSelect.addEventListener("change", (e) => { state.filterSource = e.target.value; renderGeneratorsTable(); });
    if (capSelect) capSelect.addEventListener("change", (e) => { state.filterCapacity = e.target.value; renderGeneratorsTable(); });
    if (distSelect) distSelect.addEventListener("change", (e) => { state.filterDistrict = e.target.value; renderGeneratorsTable(); });
    if (roleSelect) roleSelect.addEventListener("change", (e) => { state.filterGridRole = e.target.value; renderGeneratorsTable(); });
    if (searchInput) searchInput.addEventListener("input", (e) => { state.searchQuery = e.target.value.toLowerCase().trim(); renderGeneratorsTable(); });

    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        state.filterSource = "all";
        state.filterCapacity = "all";
        state.filterDistrict = "all";
        state.filterGridRole = "all";
        state.searchQuery = "";
        if (srcSelect) srcSelect.value = "all";
        if (capSelect) capSelect.value = "all";
        if (distSelect) distSelect.value = "all";
        if (roleSelect) roleSelect.value = "all";
        if (searchInput) searchInput.value = "";
        renderGeneratorsTable();
      });
    }

    if (exportBtn) {
      exportBtn.addEventListener("click", exportLedgerToCsv);
    }

    // Close buttons
    const closeBtns = modal.querySelectorAll("#closeEnergyExplorerBtn, #closeEnergyExplorerBottomBtn");
    closeBtns.forEach(btn => {
      btn.addEventListener("click", () => modal.close());
    });

    // Hydropower Physics Interactive Calculator Slider bindings
    initHydroPhysicsCalculator();
  }

  function setupEventListeners() {
    // Open Energy Explorer Button in Header
    const openBtn = document.getElementById("openEnergyExplorerBtn");
    if (openBtn) {
      openBtn.addEventListener("click", () => openModal("generators"));
    }

    // Drawer Power Tab Launch Button
    const drawerOpenBtn = document.getElementById("openEnergyExplorerTabBtn");
    if (drawerOpenBtn) {
      drawerOpenBtn.addEventListener("click", () => openModal("generators"));
    }

    const drawerNexusBtn = document.getElementById("openEnergyNexusTabBtn");
    if (drawerNexusBtn) {
      drawerNexusBtn.addEventListener("click", () => openModal("nexus"));
    }
  }

  function openModal(defaultTab = "generators") {
    const modal = document.getElementById("energyExplorerModal");
    if (!modal) return;
    if (typeof modal.showModal === "function") {
      modal.showModal();
    } else {
      modal.setAttribute("open", "");
    }
    switchTab(defaultTab);
  }

  function switchTab(tabId) {
    state.activeTab = tabId;
    const modal = document.getElementById("energyExplorerModal");
    if (!modal) return;

    modal.querySelectorAll(".energy-tab-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.tab === tabId);
    });

    modal.querySelectorAll(".energy-tab-pane").forEach(pane => {
      pane.classList.toggle("active", pane.id === `energy-pane-${tabId}`);
    });

    if (tabId === "generators") {
      renderGeneratorsTable();
    } else if (tabId === "nexus") {
      renderWaterEnergyNexusView();
    } else if (tabId === "benchmark") {
      renderBenchmarkView();
    } else if (tabId === "science") {
      updateHydroPhysicsResults();
    }
  }

  // --- 3. TAB 1: GENERATING STATIONS LEDGER ---
  function getFilteredPowerFeatures() {
    return state.powerFeatures.filter(f => {
      const p = f.properties || {};
      const cat = (p.category || "thermal").toLowerCase();
      const cap = parseFloat(p.installed_capacity_mw || p.capacity_mw) || 0;
      const isGreen = p.is_renewable;
      const isHydro = p.is_hydropower || cat === "hydro";
      const dist = p.district || "";
      const name = (p.name || "").toLowerCase();
      const op = (p.operator || "").toLowerCase();
      const typeLabel = (p.type_label || "").toLowerCase();

      // Source Filter
      if (state.filterSource === "hydro" && !isHydro) return false;
      if (state.filterSource !== "all" && state.filterSource !== "hydro" && cat !== state.filterSource) return false;

      // Capacity Tier Filter
      if (state.filterCapacity === "small" && cap >= 100) return false;
      if (state.filterCapacity === "medium" && (cap < 100 || cap > 500)) return false;
      if (state.filterCapacity === "large" && (cap < 500 || cap > 1500)) return false;
      if (state.filterCapacity === "mega" && cap < 1500) return false;

      // District Filter
      if (state.filterDistrict !== "all" && dist !== state.filterDistrict) return false;

      // Grid Role Filter
      if (state.filterGridRole === "renewable" && !isGreen) return false;
      if (state.filterGridRole === "baseload" && isGreen) return false;
      if (state.filterGridRole === "peaking" && !isHydro) return false;

      // Search Query
      if (state.searchQuery) {
        const q = state.searchQuery;
        if (!name.includes(q) && !op.includes(q) && !dist.toLowerCase().includes(q) && !typeLabel.includes(q)) {
          return false;
        }
      }

      return true;
    });
  }

  function renderGeneratorsTable() {
    const list = getFilteredPowerFeatures();

    // Sort list
    list.sort((a, b) => {
      const pa = a.properties || {};
      const pb = b.properties || {};
      let va = pa[state.sortCol];
      let vb = pb[state.sortCol];
      if (state.sortCol === "capacity_mw") {
        va = parseFloat(pa.installed_capacity_mw || pa.capacity_mw) || 0;
        vb = parseFloat(pb.installed_capacity_mw || pb.capacity_mw) || 0;
      } else if (state.sortCol === "annual_generation_mu") {
        va = parseFloat(pa.annual_generation_mu) || 0;
        vb = parseFloat(pb.annual_generation_mu) || 0;
      }
      if (typeof va === "string") {
        return state.sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
      }
      return state.sortDir === "asc" ? (va - vb) : (vb - va);
    });

    // Update KPI Strip
    const totalCap = list.reduce((sum, f) => sum + (parseFloat(f.properties.installed_capacity_mw || f.properties.capacity_mw) || 0), 0);
    const totalGen = list.reduce((sum, f) => sum + (parseFloat(f.properties.annual_generation_mu) || 0), 0);
    const greenCap = list.filter(f => f.properties.is_renewable).reduce((sum, f) => sum + (parseFloat(f.properties.installed_capacity_mw || f.properties.capacity_mw) || 0), 0);
    const greenPct = totalCap > 0 ? ((greenCap / totalCap) * 100).toFixed(1) : "0.0";
    const hydroCount = list.filter(f => f.properties.is_hydropower || f.properties.category === "hydro").length;

    const countEl = document.getElementById("kpiEnergyCount");
    const capEl = document.getElementById("kpiEnergyCap");
    const genEl = document.getElementById("kpiEnergyGen");
    const greenEl = document.getElementById("kpiEnergyGreen");
    const hydroEl = document.getElementById("kpiEnergyHydroCount");

    if (countEl) countEl.textContent = list.length;
    if (capEl) capEl.textContent = `${Math.round(totalCap).toLocaleString()} MW`;
    if (genEl) genEl.textContent = `${Math.round(totalGen).toLocaleString()} MU`;
    if (greenEl) greenEl.textContent = `${greenPct}%`;
    if (hydroEl) hydroEl.textContent = `${hydroCount} Hydro Units`;

    // Render Table Body
    const tbody = document.getElementById("energyTableBody");
    if (!tbody) return;

    if (list.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; padding: 2rem; color: #94a3b8;">
            No generating facilities match the selected filters. Click <strong>Reset All</strong> to clear filters.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = list.map((f, idx) => {
      const p = f.properties || {};
      const cat = (p.category || "thermal").toLowerCase();
      const conf = SOURCE_CONFIG[cat] || SOURCE_CONFIG.thermal;
      const cap = parseFloat(p.installed_capacity_mw || p.capacity_mw) || 0;
      const gen = parseFloat(p.annual_generation_mu) || 0;
      const plf = parseFloat(p.plant_load_factor_pct) || 0;
      const isHydro = p.is_hydropower || cat === "hydro";
      const name = p.name || "Generating Station";
      const dist = p.district || "Gujarat";
      const op = p.operator ? p.operator.split("—")[0].trim() : "Utility";
      const units = p.units_description || (p.units_count ? `${p.units_count} Units` : p.fuel || "Thermal Units");
      const damLink = p.associated_dam_name ? `<span class="energy-dam-pill" title="Associated Dam: ${p.associated_dam_name}">💧 ${p.associated_dam_name}</span>` : "";

      return `
        <tr class="energy-row ${isHydro ? 'is-hydro-row' : ''}" data-name="${name.replace(/"/g, '&quot;')}">
          <td class="col-rank">${idx + 1}</td>
          <td class="col-name">
            <div class="energy-name-box">
              <span class="energy-source-badge" style="color: ${conf.color}; background: ${conf.bg}; border: 1px solid ${conf.border};">
                ${conf.icon} ${conf.label}
              </span>
              <strong>${name}</strong>
              ${damLink}
            </div>
          </td>
          <td class="col-cap">
            <span class="energy-num-val" style="color: #38bdf8;">${cap.toLocaleString()} MW</span>
            <span class="energy-metric-tag">Installed Cap</span>
          </td>
          <td class="col-gen">
            <span class="energy-num-val" style="color: #fde047;">${gen > 0 ? gen.toLocaleString() : '—'} MU</span>
            <span class="energy-metric-tag">CEA Audited FY24</span>
          </td>
          <td class="col-plf">
            <span class="energy-plf-badge ${plf >= 60 ? 'plf-high' : (plf >= 30 ? 'plf-med' : 'plf-peaking')}">${plf > 0 ? plf + '%' : '—'}</span>
          </td>
          <td class="col-tech">
            <span class="energy-tech-desc">${units}</span>
          </td>
          <td class="col-loc">
            <span>${dist} • <small style="color: #94a3b8;">${op}</small></span>
          </td>
          <td class="col-actions">
            <button class="btn-energy-map" onclick="window.EnergyExplorer.flyToPowerPlant('${name.replace(/'/g, "\\'")}', true)" title="Locate on Map & Inspect Asset">
              🔍 Inspect
            </button>
            <button class="btn-energy-evac" onclick="window.EnergyExplorer.highlightPowerEvacuation('${name.replace(/'/g, "\\'")}')" title="Trace Grid Transmission Evacuation">
              ⚡ Evacuate
            </button>
          </td>
        </tr>
      `;
    }).join("");
  }

  function exportLedgerToCsv() {
    const list = getFilteredPowerFeatures();
    if (!list.length) return;

    const headers = [
      "Station Name", "Category", "Installed Capacity (MW)", "Metric Type",
      "Annual Generation (MU)", "Generation Period", "Plant Load Factor (%)",
      "Station Type / Units", "Associated Dam", "Associated Reservoir", "River",
      "District", "Operator", "Evacuation Voltage (kV)", "Water Cooling Source"
    ];

    const rows = list.map(f => {
      const p = f.properties || {};
      return [
        `"${p.name || ""}"`,
        `"${p.category || ""}"`,
        p.installed_capacity_mw || p.capacity_mw || 0,
        `"${p.capacity_metric_type || "INSTALLED_CAPACITY_MW"}"`,
        p.annual_generation_mu || 0,
        `"${p.generation_period || "FY 2023-24"}"`,
        p.plant_load_factor_pct || 0,
        `"${p.units_description || p.station_type || ""}"`,
        `"${p.associated_dam_name || "N/A (Non-Hydro Dam)"}"`,
        `"${p.associated_reservoir || "N/A"}"`,
        `"${p.river || "N/A"}"`,
        `"${p.district || ""}"`,
        `"${p.operator || ""}"`,
        p.evacuation_voltage_kv || "",
        `"${p.water_cooling_source || "N/A"}"`
      ];
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `gujarat_energy_infrastructure_ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // --- 4. TAB 2: WATER–ENERGY NEXUS VIEW ---
  function renderWaterEnergyNexusView() {
    const container = document.getElementById("waterEnergyNexusContent");
    if (!container) return;

    // Filter Hydropower stations
    const hydroStations = state.powerFeatures.filter(f => f.properties.is_hydropower || f.properties.category === "hydro");
    // Filter Thermal / Nuclear cooling consumers
    const coolingConsumers = state.powerFeatures.filter(f => f.properties.water_cooling_source && !f.properties.is_hydropower);

    container.innerHTML = `
      <div class="nexus-explainer-banner">
        <div class="nexus-icon-badge">💧 ⇄ ⚡</div>
        <div>
          <h4>The Gujarat Water–Energy Nexus Architecture</h4>
          <p>
            Energy and water systems in Gujarat operate in a closed hydraulic-electrical interdependence. 
            <strong>Hydropower facilities</strong> convert reservoir potential energy into grid peaking capacity. 
            <strong>Thermal & Nuclear power stations</strong> depend on massive continuous freshwater diversions for condenser steam cycles. 
            Concurrently, <strong>bulk lift irrigation schemes (SAUNI & Sujalam Sufalam)</strong> consume large blocks of electrical energy to transfer water across arid peninsular topography.
          </p>
        </div>
      </div>

      <div class="nexus-action-bar">
        <button class="btn-nexus-toggle ${state.nexusModeActive ? 'active' : ''}" onclick="window.EnergyExplorer.toggleWaterEnergyNexusMode()">
          ${state.nexusModeActive ? '❌ Exit Water–Energy Map Mode' : '🌊⚡ Activate Water–Energy Map Mode'}
        </button>
        <span class="nexus-help-note">
          Highlights paired dams, reservoirs, hydropower turbines, and thermal cooling intakes with connected visual flows.
        </span>
      </div>

      <div class="nexus-grid-container">
        <!-- 1. Hydropower Generation (Water -> Electricity) -->
        <div class="nexus-category-card">
          <div class="nexus-card-header hydro-header">
            <span class="nexus-cat-icon">💧➔⚡</span>
            <div>
              <h3>1. Hydroelectric Power Generation</h3>
              <small>Hydraulic Potential & Kinetic Energy Converted to Grid Electricity (2,112 MW Installed)</small>
            </div>
          </div>
          <div class="nexus-list">
            ${hydroStations.map(f => {
              const p = f.properties;
              return `
                <div class="nexus-item-box">
                  <div class="nexus-item-title-row">
                    <strong>${p.name}</strong>
                    <span class="nexus-cap-pill">${p.installed_capacity_mw} MW</span>
                  </div>
                  <div class="nexus-link-chips">
                    <span class="chip-dam">💧 Dam: ${p.associated_dam_name || 'Associated Dam'}</span>
                    <span class="chip-river">🏞️ River: ${p.river || 'River Basin'}</span>
                    ${p.gross_head_m ? `<span class="chip-head">📐 Head: ${p.gross_head_m} m</span>` : ''}
                    ${p.design_flow_cumecs ? `<span class="chip-flow">🌊 Q: ${p.design_flow_cumecs} m³/s</span>` : ''}
                  </div>
                  <p class="nexus-narrative">${p.water_energy_nexus || 'Generates clean peaking power synchronized with downstream irrigation releases.'}</p>
                  <div class="nexus-btn-row">
                    <button class="btn-nexus-focus" onclick="window.EnergyExplorer.focusPair('${p.associated_dam_id}', '${p.name.replace(/'/g, "\\'")}')">
                      🎯 View Dam & Powerhouse Pair
                    </button>
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        </div>

        <!-- 2. Thermal & Nuclear Cooling (Water Consumed by Power) -->
        <div class="nexus-category-card">
          <div class="nexus-card-header thermal-header">
            <span class="nexus-cat-icon">⚡➔💧</span>
            <div>
              <h3>2. Thermal & Nuclear Cooling Demands</h3>
              <small>Critical Freshwater Intakes & Closed-Loop Condenser Cooling Networks</small>
            </div>
          </div>
          <div class="nexus-list">
            ${coolingConsumers.map(f => {
              const p = f.properties;
              return `
                <div class="nexus-item-box">
                  <div class="nexus-item-title-row">
                    <strong>${p.name}</strong>
                    <span class="nexus-cap-pill thermal-pill">${p.installed_capacity_mw} MW</span>
                  </div>
                  <div class="nexus-link-chips">
                    <span class="chip-cooling">💧 Source: ${p.water_cooling_source}</span>
                    <span class="chip-district">📍 District: ${p.district}</span>
                  </div>
                  <p class="nexus-narrative">${p.water_nexus_role || 'Relies on bulk surface water allocation for condenser steam cooling and boiler makeup.'}</p>
                  <div class="nexus-btn-row">
                    <button class="btn-nexus-focus" onclick="window.EnergyExplorer.flyToPowerPlant('${p.name.replace(/'/g, "\\'")}', true)">
                      🎯 Inspect Cooling Infrastructure
                    </button>
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        </div>

        <!-- 3. Agricultural Irrigation Pumping (Electricity Consumed by Water) -->
        <div class="nexus-category-card">
          <div class="nexus-card-header pumping-header">
            <span class="nexus-cat-icon">⚙️➔🌊</span>
            <div>
              <h3>3. Bulk Irrigation Lift Pumping Stations</h3>
              <small>Grid Electricity Consumed to Transfer Water Over High Topography</small>
            </div>
          </div>
          <div class="nexus-list">
            <div class="nexus-item-box">
              <div class="nexus-item-title-row">
                <strong>Dhanki Bulk Lift Pumping Station (SAUNI Link Hub)</strong>
                <span class="nexus-cap-pill pumping-pill">750 MLD (120 MW Grid Load)</span>
              </div>
              <div class="nexus-link-chips">
                <span class="chip-canal">🌊 Source: Saurashtra Branch Canal</span>
                <span class="chip-grid">⚡ Evacuation: 220 kV GETCO Chorania Grid</span>
                <span class="chip-dest">📍 Destination: 115 Saurashtra Reservoirs</span>
              </div>
              <p class="nexus-narrative">
                High-head multi-stage vertical turbine pumps lift bulk Narmada waters out of the central depression to feed SAUNI Link 1, 2, 3, and 4 pipelines across the Saurashtra plateau.
              </p>
              <div class="nexus-btn-row">
                <button class="btn-nexus-focus" onclick="window.EnergyExplorer.flyToCoord([71.8500, 22.8200], 13, 'Dhanki Pumping Station')">
                  🎯 View Dhanki Pumping Hub
                </button>
              </div>
            </div>

            <div class="nexus-item-box">
              <div class="nexus-item-title-row">
                <strong>Navda Bulk Water Pumping Station</strong>
                <span class="nexus-cap-pill pumping-pill">450 MLD (45 MW Grid Load)</span>
              </div>
              <div class="nexus-link-chips">
                <span class="chip-canal">🌊 Source: Narmada Vallabhipur Branch</span>
                <span class="chip-grid">⚡ Evacuation: 66 kV Dedicated Feeder</span>
                <span class="chip-dest">📍 Destination: Bhavnagar & Amreli Grids</span>
              </div>
              <p class="nexus-narrative">
                Major municipal and agricultural lift pump station delivering bulk potable water to coastal Saurashtra districts prone to saline groundwater ingress.
              </p>
              <div class="nexus-btn-row">
                <button class="btn-nexus-focus" onclick="window.EnergyExplorer.flyToCoord([71.8850, 22.0150], 13, 'Navda Pumping Station')">
                  🎯 View Navda Pumping Hub
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // --- 5. TAB 3: GENERATION VS CAPACITY BENCHMARK ---
  function renderBenchmarkView() {
    const container = document.getElementById("energyBenchmarkContent");
    if (!container) return;

    // Pick stations where CEA FY23-24 audited data is documented
    const benchmarkList = state.powerFeatures.filter(f => {
      const p = f.properties || {};
      return p.annual_generation_mu && p.installed_capacity_mw >= 200;
    }).sort((a, b) => b.properties.installed_capacity_mw - a.properties.installed_capacity_mw);

    container.innerHTML = `
      <div class="benchmark-disclosure-box">
        <div class="disclosure-header">
          <span class="disclosure-badge">STATUTORY DATA DISCLOSURE</span>
          <h4>Measurement Definitions & Metric Comparability Standards</h4>
        </div>
        <p>
          Every metric in this platform adheres strictly to CEA and GERC engineering definitions:
        </p>
        <ul class="disclosure-points">
          <li><strong>Installed Capacity (MW):</strong> Instantaneous maximum electrical power rating under rated head, pressure, and temperature (Nameplate Rating).</li>
          <li><strong>Reported Annual Generation (MU):</strong> Cumulative electrical work performed over 8,760 hours of the financial year ($1\text{ MU} = 10^6\text{ kWh} = 1\text{ GWh}$).</li>
          <li><strong>Plant Load Factor (PLF) / Capacity Utilization Factor (CUF):</strong> Computed strictly as:
            <div class="math-eq">\\text{PLF (\\%)} = \\frac{\\text{Annual Generation (MU)} \\times 10^3}{\\text{Installed Capacity (MW)} \\times 8,760\\text{ hours}} \\times 100\\%</div>
          </li>
          <li><strong>Direct Comparisons:</strong> Only valid between stations with identical operating regimes (Baseload thermal/nuclear vs Peaking hydro vs Intermittent solar/wind).</li>
        </ul>
      </div>

      <div class="benchmark-table-wrapper">
        <table class="benchmark-table">
          <thead>
            <tr>
              <th>Station Name</th>
              <th>Category</th>
              <th>Installed Cap (MW)</th>
              <th>Reported Gen (MU)</th>
              <th>Calculated PLF / CUF</th>
              <th>Operating Regime</th>
              <th>Measurement Standard</th>
            </tr>
          </thead>
          <tbody>
            ${benchmarkList.map(f => {
              const p = f.properties;
              const cap = p.installed_capacity_mw;
              const gen = p.annual_generation_mu;
              const plf = p.plant_load_factor_pct;
              const isHydro = p.is_hydropower || p.category === "hydro";
              const isGreen = p.is_renewable;
              const regime = isHydro ? "Peaking Reserve & Flood Discharge" : 
                             (isGreen ? "Intermittent Variable RE" : 
                             (p.category === "nuclear" ? "Baseload Continuous (PHWR)" : "Baseload Thermal Grid"));

              return `
                <tr>
                  <td>
                    <strong>${p.name}</strong>
                    <br><small style="color: #94a3b8;">${p.district} • ${p.operator ? p.operator.split("—")[0] : ''}</small>
                  </td>
                  <td>
                    <span class="energy-source-badge" style="color: ${SOURCE_CONFIG[p.category]?.color || '#cbd5e1'};">
                      ${SOURCE_CONFIG[p.category]?.icon || '⚡'} ${p.category?.toUpperCase()}
                    </span>
                  </td>
                  <td><strong style="color: #38bdf8;">${cap.toLocaleString()} MW</strong></td>
                  <td><strong style="color: #fde047;">${gen.toLocaleString()} MU</strong></td>
                  <td>
                    <div class="plf-bar-container">
                      <div class="plf-bar-fill" style="width: ${Math.min(100, plf)}%;"></div>
                      <span class="plf-bar-text">${plf}%</span>
                    </div>
                  </td>
                  <td><span class="regime-tag">${regime}</span></td>
                  <td><span class="audit-badge">${p.generation_period || 'CEA FY24 Audited'}</span></td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  // --- 6. TAB 4: HYDROPOWER PHYSICS & TURBINE LAB ---
  function initHydroPhysicsCalculator() {
    const headSlider = document.getElementById("hydroLabHeadSlider");
    const flowSlider = document.getElementById("hydroLabFlowSlider");
    const effSlider = document.getElementById("hydroLabEffSlider");

    if (headSlider) headSlider.addEventListener("input", updateHydroPhysicsResults);
    if (flowSlider) flowSlider.addEventListener("input", updateHydroPhysicsResults);
    if (effSlider) effSlider.addEventListener("input", updateHydroPhysicsResults);
  }

  function updateHydroPhysicsResults() {
    const headSlider = document.getElementById("hydroLabHeadSlider");
    const flowSlider = document.getElementById("hydroLabFlowSlider");
    const effSlider = document.getElementById("hydroLabEffSlider");

    if (!headSlider || !flowSlider || !effSlider) return;

    const H = parseFloat(headSlider.value) || 92.0;
    const Q = parseFloat(flowSlider.value) || 1600.0;
    const eta = (parseFloat(effSlider.value) || 91.5) / 100.0;

    // Density of water = 1000 kg/m3, Gravity g = 9.80665 m/s2
    const rho = 1000.0;
    const g = 9.80665;

    // Theoretical Hydraulic Potential Power: P_theo = rho * g * Q * H in Watts
    const pTheoWatts = rho * g * Q * H;
    const pTheoMw = pTheoWatts / 1e6;

    // Delivered Electrical Power: P_elec = eta * P_theo
    const pElecMw = pTheoMw * eta;

    // Annual Energy at 30% Peaking Duty Factor:
    const annualPeakingMu = (pElecMw * 8760 * 0.30) / 1000.0;
    // Annual Energy at 100% Continuous Flow:
    const annualContinuousMu = (pElecMw * 8760 * 1.0) / 1000.0;

    // Update Slider Value Badges
    const headValEl = document.getElementById("hydroLabHeadVal");
    const flowValEl = document.getElementById("hydroLabFlowVal");
    const effValEl = document.getElementById("hydroLabEffVal");

    if (headValEl) headValEl.textContent = `${H.toFixed(1)} m`;
    if (flowValEl) flowValEl.textContent = `${Math.round(Q).toLocaleString()} m³/s`;
    if (effValEl) effValEl.textContent = `${(eta * 100).toFixed(1)}%`;

    // Update Calculated Output Fields
    const resTheoEl = document.getElementById("calcResTheo");
    const resElecEl = document.getElementById("calcResElec");
    const resPeakEl = document.getElementById("calcResPeaking");
    const resContEl = document.getElementById("calcResCont");
    const resTurbineEl = document.getElementById("calcResTurbine");

    if (resTheoEl) resTheoEl.textContent = `${Math.round(pTheoMw).toLocaleString()} MW`;
    if (resElecEl) resElecEl.textContent = `${Math.round(pElecMw).toLocaleString()} MW`;
    if (resPeakEl) resPeakEl.textContent = `${Math.round(annualPeakingMu).toLocaleString()} MU / yr`;
    if (resContEl) resContEl.textContent = `${Math.round(annualContinuousMu).toLocaleString()} MU / yr`;

    // Turbine Selection Logic based on Head H
    if (resTurbineEl) {
      if (H > 250) {
        resTurbineEl.innerHTML = `<span class="badge-turbine pelton">PELTON IMPULSE TURBINE</span> (High Head H > 250m)`;
      } else if (H >= 40) {
        resTurbineEl.innerHTML = `<span class="badge-turbine francis">FRANCIS REACTION TURBINE</span> (Medium Head 40m - 250m: matches Sardar Sarovar RBPH & Ukai)`;
      } else {
        resTurbineEl.innerHTML = `<span class="badge-turbine kaplan">KAPLAN AXIAL PROPELLER</span> (Low Head 3m - 40m: matches Sardar Sarovar CHPH & Canal Drops)`;
      }
    }
  }

  // --- 7. MAP INTERACTION: EVACUATION TRACING & NEXUS HIGHLIGHT ---
  function flyToPowerPlant(name, openInspector = false) {
    const modal = document.getElementById("energyExplorerModal");
    if (modal && modal.open) modal.close();

    if (window.focusPowerPlant) {
      window.focusPowerPlant(name, true);
    } else {
      const feature = state.powerFeatures.find(f => f.properties.name === name);
      if (feature && state.map) {
        const coords = feature.geometry.coordinates;
        state.map.flyTo([coords[1], coords[0]], 13, { duration: 1.2 });
      }
    }
  }

  function highlightPowerEvacuation(name) {
    const modal = document.getElementById("energyExplorerModal");
    if (modal && modal.open) modal.close();

    const plantFeature = state.powerFeatures.find(f => f.properties.name === name);
    if (!plantFeature || !state.map) return;

    clearHighlightedLayers();

    const p = plantFeature.properties || {};
    const plantCoord = plantFeature.geometry.coordinates;
    const connectedLines = p.connected_transmission_ids || [];
    const connectedSubs = p.connected_substations || [];

    // Ensure Transmission & Power layers are toggled visible
    const transToggle = document.getElementById("layerTransmission");
    const powerToggle = document.getElementById("layerPower");
    if (transToggle && !transToggle.checked) { transToggle.checked = true; transToggle.dispatchEvent(new Event("change")); }
    if (powerToggle && !powerToggle.checked) { powerToggle.checked = true; powerToggle.dispatchEvent(new Event("change")); }

    // 1. Highlight Generating Station with pulsing marker
    const plantPulse = L.circleMarker([plantCoord[1], plantCoord[0]], {
      pane: "waterHighlightPane" in state.map.getPanes() ? "waterHighlightPane" : "overlayPane",
      radius: 16,
      color: "#fde047",
      fillColor: "#eab308",
      weight: 3.5,
      fillOpacity: 0.85,
      className: "water-pulse-active-marker"
    }).addTo(state.map);
    state.highlightedLayers.push(plantPulse);

    // 2. Find and highlight matching transmission corridors
    const bounds = L.latLngBounds([[plantCoord[1], plantCoord[0]]]);
    state.transFeatures.forEach(tf => {
      const tp = tf.properties || {};
      const tid = tp.id || "";
      const matchesPlant = connectedLines.includes(tid) || (tp.connected_plant_ids && tp.connected_plant_ids.includes(p.id));

      if (matchesPlant && tf.geometry.type === "LineString") {
        const coords = tf.geometry.coordinates.map(c => [c[1], c[0]]);
        coords.forEach(ll => bounds.extend(ll));

        const lineHighlight = L.polyline(coords, {
          pane: "waterHighlightPane" in state.map.getPanes() ? "waterHighlightPane" : "overlayPane",
          color: "#fde047",
          weight: 6.0,
          opacity: 0.95,
          dashArray: "8, 6",
          className: "water-flow-active-line"
        }).addTo(state.map);
        state.highlightedLayers.push(lineHighlight);
      } else if (connectedSubs.includes(tp.id) && tf.geometry.type === "Point") {
        const scoords = [tf.geometry.coordinates[1], tf.geometry.coordinates[0]];
        bounds.extend(scoords);

        const subMarker = L.circleMarker(scoords, {
          pane: "waterHighlightPane" in state.map.getPanes() ? "waterHighlightPane" : "overlayPane",
          radius: 12,
          color: "#ffffff",
          fillColor: "#a855f7",
          weight: 2.5,
          fillOpacity: 0.95
        }).addTo(state.map);
        subMarker.bindTooltip(`<strong>Substation: ${tp.name}</strong><br><small>${tp.voltage_label || ''}</small>`, { permanent: true, direction: "top" });
        state.highlightedLayers.push(subMarker);
      }
    });

    // Fit map bounds to frame the entire evacuation corridor
    state.map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12, duration: 1.0 });

    // Open Inspector for this plant
    if (window.AssetInspector && typeof window.AssetInspector.inspectAsset === "function") {
      window.AssetInspector.inspectAsset({
        properties: { ...p, asset_category: p.is_hydropower ? "hydropower_plant" : "power_plant" },
        geometry: plantFeature.geometry,
        type: p.is_hydropower ? "hydropower_plant" : "power_plant"
      });
    }
  }

  function focusPair(damId, plantName) {
    const modal = document.getElementById("energyExplorerModal");
    if (modal && modal.open) modal.close();

    const plant = state.powerFeatures.find(f => f.properties.name === plantName);
    const dam = state.waterFeatures.find(f => f.properties.id === damId);

    if (!plant || !state.map) return;
    clearHighlightedLayers();

    const bounds = L.latLngBounds([[plant.geometry.coordinates[1], plant.geometry.coordinates[0]]]);
    if (dam) {
      if (dam.geometry.type === "Point") {
        bounds.extend([dam.geometry.coordinates[1], dam.geometry.coordinates[0]]);
      } else if (dam.geometry.type === "Polygon") {
        dam.geometry.coordinates[0].forEach(c => bounds.extend([c[1], c[0]]));
      }
    }

    // Highlight both
    const plantMarker = L.circleMarker([plant.geometry.coordinates[1], plant.geometry.coordinates[0]], {
      pane: "waterHighlightPane" in state.map.getPanes() ? "waterHighlightPane" : "overlayPane",
      radius: 14,
      color: "#06b6d4",
      fillColor: "#0891b2",
      weight: 3.0,
      fillOpacity: 0.9,
      className: "water-pulse-active-marker"
    }).addTo(state.map);
    plantMarker.bindTooltip(`<strong>⚡ ${plant.properties.name}</strong> (${plant.properties.installed_capacity_mw} MW)`, { permanent: true, direction: "top" });
    state.highlightedLayers.push(plantMarker);

    state.map.fitBounds(bounds, { padding: [60, 60], maxZoom: 13, duration: 1.2 });

    // Inspect the hydropower asset
    if (window.AssetInspector && typeof window.AssetInspector.inspectAsset === "function") {
      window.AssetInspector.inspectAsset({
        properties: { ...plant.properties, asset_category: "hydropower_plant" },
        geometry: plant.geometry,
        type: "hydropower_plant"
      });
    }
  }

  function toggleWaterEnergyNexusMode() {
    state.nexusModeActive = !state.nexusModeActive;
    const modal = document.getElementById("energyExplorerModal");
    if (modal && modal.open) modal.close();

    clearHighlightedLayers();

    if (!state.nexusModeActive) {
      console.log("[EnergyExplorer] Nexus map mode deactivated.");
      return;
    }

    console.log("[EnergyExplorer] Water-Energy Nexus Map Mode Activated.");
    // Highlight all paired hydropower plants and cooling water sources
    const hydroPlants = state.powerFeatures.filter(f => f.properties.is_hydropower);
    const bounds = L.latLngBounds([]);

    hydroPlants.forEach(f => {
      const coord = [f.geometry.coordinates[1], f.geometry.coordinates[0]];
      bounds.extend(coord);

      const marker = L.circleMarker(coord, {
        pane: "waterHighlightPane" in state.map.getPanes() ? "waterHighlightPane" : "overlayPane",
        radius: 10,
        color: "#06b6d4",
        fillColor: "#0284c7",
        weight: 2.5,
        fillOpacity: 0.9,
        className: "water-pulse-active-marker"
      }).addTo(state.map);
      marker.bindTooltip(`<strong>💧⚡ ${f.properties.name}</strong><br><small>${f.properties.installed_capacity_mw} MW</small>`, { direction: "top" });
      state.highlightedLayers.push(marker);
    });

    if (bounds.isValid()) {
      state.map.fitBounds(bounds, { padding: [40, 40], maxZoom: 9 });
    }
  }

  function flyToCoord(latlng, zoom = 13, title = "") {
    const modal = document.getElementById("energyExplorerModal");
    if (modal && modal.open) modal.close();
    if (state.map) {
      state.map.flyTo(latlng, zoom, { duration: 1.2 });
    }
  }

  function clearHighlightedLayers() {
    state.highlightedLayers.forEach(layer => {
      if (state.map && state.map.hasLayer(layer)) {
        state.map.removeLayer(layer);
      }
    });
    state.highlightedLayers = [];
  }

  // Global Export API
  window.EnergyExplorer = {
    init,
    setDatasets,
    openModal,
    switchTab,
    flyToPowerPlant,
    highlightPowerEvacuation,
    focusPair,
    toggleWaterEnergyNexusMode,
    flyToCoord,
    clearHighlightedLayers
  };

})(typeof window !== "undefined" ? window : global);
