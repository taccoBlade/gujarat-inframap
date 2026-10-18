/**
 * Gujarat InfraMap — SAUNI Yojana & Basin Water Transfer Explorer Engine
 * 
 * Provides an operational digital twin for Saurashtra Narmada Avtaran Irrigation Yojana
 * (SAUNI Links 1, 2, 3, 4) and the Sujalam Sufalam Spreading Canal in North Gujarat.
 * 
 * Hydraulic mass-balance simulation:
 *   - Transfer Volume: V (MCM) = Q (cusecs) * 0.00244658 * Days
 *   - Pumping Power:   P (MW)  = (rho * g * Q_cumecs * TDH) / (eta * 1e6)
 *   - Recipient dam replenishment allocation, fill ratios, and GIS gradient vector tracing.
 * 
 * Epistemic Standards (AGENTS.md):
 *   - Physical dimensions & design capacities: [ SOURCED GOV BENCHMARKS ] (WRD Gujarat / SSNNL / CWC).
 *   - Pumping & replenishment numbers:        [ CALCULATED SIMULATION ] (explicit physical mass-balance).
 */

(function (window) {
  "use strict";

  // SAUNI & Sujalam Corridor Authoritative Profiles
  const CORRIDOR_REGISTRY = {
    link1: {
      id: "GJ-WR-CAN-011",
      key: "link1",
      name: "SAUNI Link 1: Machhu-II to Sani Dam",
      shortTitle: "Link 1 (Morbi–Jamnagar–Dwarka)",
      category: "Pressurized Bulk Water Pipeline",
      headworksId: "GJ-WR-PMP-002",
      headworksName: "Dhanki SAUNI Lift Headworks",
      alignment: "Morbi → Tankara → Dhrol → Jamnagar → Devbhumi Dwarka",
      districtsServed: ["Morbi", "Jamnagar", "Devbhumi Dwarka"],
      lengthKm: 180.5,
      pipeDiameterM: 3.0,
      pipeMaterial: "Mild Steel (MS) 3LPE Coated High-Pressure Pipeline",
      designDischargeCusecs: 1200,
      designDischargeCumecs: 33.98,
      staticLiftM: 64.0,
      frictionLossM: 6.2,
      pumpEfficiency: 0.82,
      beneficiaryReservoirsCount: 30,
      commandHa: 82000,
      intakeSource: "Saurashtra Branch Canal (SBC Tail) via Dhanki Headworks",
      operatingAgency: "WRD Gujarat / SAUNI Project Wing",
      sourceOrg: "WRD Gujarat & SSNNL SAUNI Project Engineering Records",
      sourceUrl: "https://guj-nwrws.gujarat.gov.in",
      coordinates: [
        [71.72, 22.75], [71.45, 22.78], [71.12, 22.79], [70.8833, 22.7833],
        [70.75, 22.68], [70.52, 22.61], [70.3667, 22.2833], [70.08, 22.25],
        [69.75, 22.18], [69.35, 22.02]
      ],
      recipientDams: [
        { id: "GJ-WR-DAM-011", name: "Machhu II Dam", district: "Morbi", grossStorageMcm: 100.0, river: "Machhu", shareWeight: 0.35, lat: 22.7833, lng: 70.8833 },
        { id: "GJ-WR-DAM-020", name: "Machhu-I Dam", district: "Morbi", grossStorageMcm: 71.0, river: "Machhu", shareWeight: 0.25, lat: 22.468, lng: 70.97 },
        { id: "GJ-WR-DAM-023", name: "Und-I Dam", district: "Jamnagar", grossStorageMcm: 64.0, river: "Und", shareWeight: 0.40, lat: 22.2833, lng: 70.3667 }
      ],
      description: "180.5 km pressurized bulk pipeline diverting surplus Narmada floodwaters to replenish 30 reservoirs across Morbi, Jamnagar, and coastal Devbhumi Dwarka."
    },
    link2: {
      id: "GJ-WR-CAN-012",
      key: "link2",
      name: "SAUNI Link 2: Limdi Bhogavo to Shetrunji & Raika",
      shortTitle: "Link 2 (Surendranagar–Botad–Bhavnagar)",
      category: "Pressurized Bulk Water Pipeline",
      headworksId: "GJ-WR-PMP-002",
      headworksName: "Dhanki SAUNI Lift Headworks",
      alignment: "Surendranagar → Botad → Gadhada → Bhavnagar",
      districtsServed: ["Surendranagar", "Botad", "Bhavnagar"],
      lengthKm: 253.2,
      pipeDiameterM: 3.0,
      pipeMaterial: "Mild Steel (MS) 3LPE Coated High-Pressure Pipeline",
      designDischargeCusecs: 1200,
      designDischargeCumecs: 33.98,
      staticLiftM: 58.0,
      frictionLossM: 7.0,
      pumpEfficiency: 0.82,
      beneficiaryReservoirsCount: 17,
      commandHa: 111000,
      intakeSource: "Saurashtra Branch Canal (SBC) / Limdi Bhogavo-II Feeder",
      operatingAgency: "WRD Gujarat / SAUNI Project Wing",
      sourceOrg: "WRD Gujarat & SSNNL SAUNI Project Engineering Records",
      sourceUrl: "https://guj-nwrws.gujarat.gov.in",
      coordinates: [
        [71.72, 22.75], [71.78, 22.56], [71.74, 22.38], [71.66, 22.17],
        [71.58, 21.97], [71.72, 21.80], [71.865, 21.5033], [71.95, 21.45]
      ],
      recipientDams: [
        { id: "GJ-WR-DAM-022", name: "Brahmani Dam", district: "Surendranagar", grossStorageMcm: 75.0, river: "Brahmani", shareWeight: 0.25, lat: 22.95, lng: 71.3 },
        { id: "GJ-WR-DAM-006", name: "Shetrunji Dam", district: "Bhavnagar", grossStorageMcm: 308.0, river: "Shetrunji", shareWeight: 0.75, lat: 21.5033, lng: 71.865 }
      ],
      description: "253.2 km pipeline conveying Narmada water into the Shetrunji river basin, safeguarding irrigation for Bhavnagar and coastal Saurashtra."
    },
    link3: {
      id: "GJ-WR-CAN-013",
      key: "link3",
      name: "SAUNI Link 3: Dholidhaja to Aji-I, Nyari-I & Bhadar (Rajkot Lifeline Spine)",
      shortTitle: "Link 3 (Rajkot Lifeline Spine)",
      category: "Pressurized Bulk Water Pipeline",
      headworksId: "GJ-WR-PMP-002",
      headworksName: "Dhanki SAUNI Lift Headworks",
      alignment: "Surendranagar → Sayla → Rajkot → Gondal → Porbandar",
      districtsServed: ["Surendranagar", "Rajkot", "Jamnagar", "Porbandar"],
      lengthKm: 245.0,
      pipeDiameterM: 3.0,
      pipeMaterial: "Mild Steel (MS) 3LPE Coated High-Pressure Pipeline",
      designDischargeCusecs: 1200,
      designDischargeCumecs: 33.98,
      staticLiftM: 68.0,
      frictionLossM: 6.8,
      pumpEfficiency: 0.82,
      beneficiaryReservoirsCount: 28,
      commandHa: 98000,
      intakeSource: "Dholidhaja Dam / SBC Feeder Trunk",
      operatingAgency: "WRD Gujarat / SAUNI Project Wing",
      sourceOrg: "WRD Gujarat & SSNNL SAUNI Project Engineering Records",
      sourceUrl: "https://guj-nwrws.gujarat.gov.in",
      coordinates: [
        [71.72, 22.75], [71.64, 22.71], [71.48, 22.54], [71.22, 22.38],
        [70.98, 22.30], [70.8333, 22.25], [70.7333, 22.2833], [70.76, 22.05],
        [70.7833, 21.8167], [70.52, 21.75], [70.28, 21.73]
      ],
      recipientDams: [
        { id: "GJ-WR-DAM-012", name: "Aji-I Dam", district: "Rajkot", grossStorageMcm: 38.0, river: "Aji", shareWeight: 0.25, lat: 22.25, lng: 70.8333 },
        { id: "GJ-WR-DAM-021", name: "Nyari-I Dam", district: "Rajkot", grossStorageMcm: 25.0, river: "Nyari", shareWeight: 0.15, lat: 22.2833, lng: 70.7333 },
        { id: "GJ-WR-DAM-007", name: "Bhadar Dam", district: "Rajkot", grossStorageMcm: 238.0, river: "Bhadar", shareWeight: 0.60, lat: 21.8167, lng: 70.7833 }
      ],
      description: "245.0 km pressurized lifeline trunk carrying Narmada water to Rajkot's municipal drinking reservoirs (Aji-I, Nyari-I) and Bhadar-I."
    },
    link4: {
      id: "GJ-WR-CAN-014",
      key: "link4",
      name: "SAUNI Link 4: Dhanki to Khodiyar & Hiran-II",
      shortTitle: "Link 4 (Amreli–Junagadh–Gir Somnath)",
      category: "Pressurized Bulk Water Pipeline",
      headworksId: "GJ-WR-PMP-002",
      headworksName: "Dhanki SAUNI Lift Headworks",
      alignment: "Surendranagar → Babra → Amreli → Junagadh → Gir Somnath",
      districtsServed: ["Surendranagar", "Botad", "Amreli", "Junagadh", "Gir Somnath"],
      lengthKm: 250.0,
      pipeDiameterM: 3.0,
      pipeMaterial: "Mild Steel (MS) 3LPE Coated High-Pressure Pipeline",
      designDischargeCusecs: 1200,
      designDischargeCumecs: 33.98,
      staticLiftM: 65.0,
      frictionLossM: 7.0,
      pumpEfficiency: 0.82,
      beneficiaryReservoirsCount: 40,
      commandHa: 145000,
      intakeSource: "Ankadiya Feeder / Dhanki South Lift",
      operatingAgency: "WRD Gujarat / SAUNI Project Wing",
      sourceOrg: "WRD Gujarat & SSNNL SAUNI Project Engineering Records",
      sourceUrl: "https://guj-nwrws.gujarat.gov.in",
      coordinates: [
        [71.72, 22.75], [71.55, 22.58], [71.40, 22.42], [71.20, 22.15],
        [71.30, 21.85], [71.22, 21.60], [71.0167, 21.3167], [70.68, 21.38],
        [70.3333, 21.4667], [70.42, 21.22], [70.5333, 21.05]
      ],
      recipientDams: [
        { id: "GJ-WR-DAM-025", name: "Khodiyar Dam", district: "Amreli", grossStorageMcm: 34.0, river: "Shetrunji Upper", shareWeight: 0.30, lat: 21.3167, lng: 71.0167 },
        { id: "GJ-WR-DAM-026", name: "Ozat-II (Vanshal) Dam", district: "Junagadh", grossStorageMcm: 42.0, river: "Ozat", shareWeight: 0.35, lat: 21.4667, lng: 70.3333 },
        { id: "GJ-WR-DAM-027", name: "Hiran-II Dam", district: "Gir Somnath", grossStorageMcm: 36.0, river: "Hiran", shareWeight: 0.35, lat: 21.05, lng: 70.5333 }
      ],
      description: "250.0 km high-pressure southern lifeline transferring Narmada water across Amreli and Junagadh down to Somnath coastal belt."
    },
    sujalam: {
      id: "GJ-WR-CAN-015",
      key: "sujalam",
      name: "Sujalam Sufalam Spreading Canal: Kadana to Banaskantha",
      shortTitle: "Sujalam Sufalam (North Gujarat)",
      category: "Unlined Infiltration & Recharge Canal",
      headworksId: "GJ-WR-DAM-003",
      headworksName: "Kadana Dam Offtake / Mahi River",
      alignment: "Mahisagar → Sabarkantha → Mehsana → Patan → Banaskantha",
      districtsServed: ["Mahisagar", "Panchmahal", "Sabarkantha", "Mehsana", "Patan", "Banaskantha"],
      lengthKm: 332.0,
      pipeDiameterM: 0.0, // Open Canal
      pipeMaterial: "Unlined Earthen Contour Infiltration Canal (Bed Width ~18m)",
      designDischargeCusecs: 2000,
      designDischargeCumecs: 56.63,
      staticLiftM: 12.0, // Offtake lift
      frictionLossM: 2.0,
      pumpEfficiency: 0.80,
      beneficiaryReservoirsCount: 21, // 21 rivers
      commandHa: 180000,
      intakeSource: "Kadana Dam Reservoir / Mahi River High Flood Spill",
      operatingAgency: "NWRWS Department, Govt of Gujarat",
      sourceOrg: "NWRWS & Kalpsar Department, WRD Gujarat",
      sourceUrl: "https://guj-nwrws.gujarat.gov.in",
      coordinates: [
        [73.82538, 23.304], [73.61, 23.13], [73.42, 23.25], [73.30, 23.46],
        [73.00, 23.60], [72.8519, 24.0042], [72.55, 23.70], [72.25, 23.82],
        [72.13, 23.85], [72.3333, 24.3278], [72.3167, 24.3833]
      ],
      recipientDams: [
        { id: "GJ-WR-DAM-004", name: "Dharoi Dam", district: "Mehsana", grossStorageMcm: 815.0, river: "Sabarmati", shareWeight: 0.40, lat: 24.0042, lng: 72.8519 },
        { id: "GJ-WR-DAM-005", name: "Dantiwada Dam", district: "Banaskantha", grossStorageMcm: 464.0, river: "Banas", shareWeight: 0.35, lat: 24.3278, lng: 72.3333 },
        { id: "GJ-WR-DAM-013", name: "Sipu Dam", district: "Banaskantha", grossStorageMcm: 156.0, river: "Sipu", shareWeight: 0.15, lat: 24.3833, lng: 72.3167 },
        { id: "GJ-WR-DAM-014", name: "Mukteshwar Dam", district: "Banaskantha", grossStorageMcm: 38.0, river: "Saraswati", shareWeight: 0.10, lat: 24.1833, lng: 72.5833 }
      ],
      description: "332.0 km unlined contour infiltration canal recharging 21 dry rivers and depleted deep alluvial aquifers across North Gujarat."
    }
  };

  // State Container
  const state = {
    initialized: false,
    map: null,
    waterData: null,
    activeLinkKey: "link1",
    inputs: {
      dischargeCusecs: 1200,
      durationDays: 30,
      baselineFillPct: 20
    },
    mapHighlightLayers: [],
    damMarkerLayers: []
  };

  /**
   * Initializes the SAUNI Basin Transfer Explorer
   */
  function init(mapInstance, waterDataset) {
    state.map = mapInstance;
    state.waterData = waterDataset;

    buildModalDom();
    bindEvents();
    state.initialized = true;
    console.log("[SauniBasinTransferExplorer] Initialized successfully.");
  }

  /**
   * Construct Modal Dialog DOM if not already present
   */
  function buildModalDom() {
    if (document.getElementById("sauniExplorerModal")) return;

    const modal = document.createElement("dialog");
    modal.id = "sauniExplorerModal";
    modal.className = "system-modal sauni-modal";
    modal.setAttribute("aria-labelledby", "sauniModalTitle");

    modal.innerHTML = `
      <div class="sauni-modal-container">
        <!-- Modal Header -->
        <div class="sauni-modal-header">
          <div class="sauni-header-title-wrap">
            <span class="sauni-badge">GUJARAT DIGITAL TWIN • HYDRAULIC LIFELINE ENGINE</span>
            <h2 id="sauniModalTitle" class="sauni-modal-title">
              <span class="sauni-icon">🚰</span> SAUNI Yojana &amp; Basin Water Transfer Explorer
            </h2>
            <p class="sauni-modal-sub">
              Operational twin of Narmada floodwater diversion via 4 pressurized pipeline links to 115 Saurashtra dams &amp; Sujalam Sufalam recharge spine.
            </p>
          </div>
          <button id="closeSauniModalBtn" class="system-modal-close" aria-label="Close SAUNI Explorer">✕</button>
        </div>

        <!-- Corridor Selection Tabs -->
        <div class="sauni-tabs-bar" role="tablist" aria-label="Transfer Corridors">
          <button class="sauni-tab-btn active" data-link="link1" role="tab" aria-selected="true">
            <span class="sauni-tab-num">LINK 1</span>
            <span class="sauni-tab-name">Machhu-II → Sani</span>
          </button>
          <button class="sauni-tab-btn" data-link="link2" role="tab" aria-selected="false">
            <span class="sauni-tab-num">LINK 2</span>
            <span class="sauni-tab-name">Bhogavo → Shetrunji</span>
          </button>
          <button class="sauni-tab-btn" data-link="link3" role="tab" aria-selected="false">
            <span class="sauni-tab-num">LINK 3</span>
            <span class="sauni-tab-name">Rajkot (Aji–Nyari–Bhadar)</span>
          </button>
          <button class="sauni-tab-btn" data-link="link4" role="tab" aria-selected="false">
            <span class="sauni-tab-num">LINK 4</span>
            <span class="sauni-tab-name">Amreli → Gir Somnath</span>
          </button>
          <button class="sauni-tab-btn" data-link="sujalam" role="tab" aria-selected="false">
            <span class="sauni-tab-num">SUJALAM</span>
            <span class="sauni-tab-name">Kadana → Banaskantha</span>
          </button>
        </div>

        <!-- Main Body Grid -->
        <div class="sauni-body-grid">
          <!-- Left Column: Specs & Hydraulic Simulation Controls -->
          <div class="sauni-col sauni-col-controls">
            <!-- Corridor Profile Card -->
            <div class="sauni-card sauni-profile-card" id="sauniProfileCard">
              <!-- Dynamically populated -->
            </div>

            <!-- Simulation Sliders Card -->
            <div class="sauni-card sauni-controls-card">
              <div class="sauni-card-header">
                <h4 class="sauni-card-title">⚙️ Mass-Balance Simulation Controls</h4>
                <span class="sauni-tag">[ CALCULATED SIMULATION ]</span>
              </div>
              <div class="sauni-controls-form">
                <div class="sauni-control-group">
                  <div class="sauni-control-labels">
                    <label for="sauniDischargeInput">Transfer Rate (Q):</label>
                    <span class="sauni-val-display" id="sauniDischargeVal">1,200 cusecs (34.0 m³/s)</span>
                  </div>
                  <input type="range" id="sauniDischargeInput" min="200" max="1500" step="50" value="1200" class="sauni-slider">
                </div>

                <div class="sauni-control-group">
                  <div class="sauni-control-labels">
                    <label for="sauniDurationInput">Transfer Duration (Flood Window):</label>
                    <span class="sauni-val-display" id="sauniDurationVal">30 days</span>
                  </div>
                  <input type="range" id="sauniDurationInput" min="5" max="90" step="5" value="30" class="sauni-slider">
                </div>

                <div class="sauni-control-group">
                  <div class="sauni-control-labels">
                    <label for="sauniBaselineFillInput">Pre-Transfer Drought Baseline:</label>
                    <span class="sauni-val-display" id="sauniBaselineFillVal">20% of Gross Storage</span>
                  </div>
                  <input type="range" id="sauniBaselineFillInput" min="5" max="60" step="5" value="20" class="sauni-slider">
                </div>
              </div>
            </div>

            <!-- Hydraulic Telemetry Results Card -->
            <div class="sauni-card sauni-telemetry-card">
              <div class="sauni-card-header">
                <h4 class="sauni-card-title">⚡ Hydraulic &amp; Pumping Power Demand</h4>
                <span class="sauni-tag">Dhanki Headworks Lift</span>
              </div>
              <div class="sauni-telemetry-grid" id="sauniTelemetryGrid">
                <!-- Dynamically populated -->
              </div>
            </div>
          </div>

          <!-- Right Column: Recipient Dams Ledger & Replenishment Allocation -->
          <div class="sauni-col sauni-col-ledger">
            <div class="sauni-card sauni-ledger-card">
              <div class="sauni-card-header">
                <h4 class="sauni-card-title">💧 Recipient Reservoirs Replenishment Matrix</h4>
                <div class="sauni-header-actions">
                  <button id="sauniFocusCorridorBtn" class="sauni-action-btn" title="Focus map camera on pipeline corridor">
                    📍 Focus on Map
                  </button>
                  <button id="sauniExportCsvBtn" class="sauni-action-btn" title="Export replenishment simulation to CSV">
                    📥 Export CSV
                  </button>
                </div>
              </div>

              <!-- Recipient Dams Table -->
              <div class="sauni-table-scroll">
                <table class="sauni-ledger-table" id="sauniLedgerTable">
                  <thead>
                    <tr>
                      <th>Reservoir Asset</th>
                      <th>District</th>
                      <th>Gross Cap (MCM)</th>
                      <th>Pre-Transfer</th>
                      <th>Inflow Added</th>
                      <th>Post-Transfer Fill</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody id="sauniLedgerBody">
                    <!-- Populated dynamically -->
                  </tbody>
                </table>
              </div>

              <!-- Physical Schematic Flow Bar -->
              <div class="sauni-flow-schematic" id="sauniFlowSchematic">
                <!-- Populated dynamically -->
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer with Statutory Notice -->
        <div class="sauni-modal-footer">
          <div class="sauni-statutory-notice">
            <span class="sauni-alert-icon">⚖️</span>
            <span>
              <strong>STATUTORY CIVIL ENGINEERING DISCLOSURE:</strong>
              Pipeline specifications, static head ($H_{lift}$ = 64m), and pump capacities ($Q$ = 1,200 cusecs) are sourced from official WRD Gujarat &amp; SSNNL project technical schedules. Daily transfer volumes, pumping power requirements, and reservoir replenishment fill percentages represent physical mass-balance calculations ($\eta = 82\%$, conveyance loss = $2.5\%$). Disconnected live SCADA feeds are not simulated.
            </span>
          </div>
          <div class="sauni-footer-buttons">
            <button id="closeSauniModalBottomBtn" class="sauni-close-btn">Close Explorer</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  }

  /**
   * Bind DOM event listeners
   */
  function bindEvents() {
    const modal = document.getElementById("sauniExplorerModal");
    if (!modal) return;

    // Close buttons
    const closeBtn = document.getElementById("closeSauniModalBtn");
    const closeBottomBtn = document.getElementById("closeSauniModalBottomBtn");
    if (closeBtn) closeBtn.addEventListener("click", () => closeModal());
    if (closeBottomBtn) closeBottomBtn.addEventListener("click", () => closeModal());

    // Overlay backdrop click to close
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });

    // Corridor Tab Switchers
    modal.querySelectorAll(".sauni-tab-btn[data-link]").forEach(btn => {
      btn.addEventListener("click", () => {
        const linkKey = btn.getAttribute("data-link");
        selectLink(linkKey);
      });
    });

    // Range Sliders
    const qInput = document.getElementById("sauniDischargeInput");
    const durInput = document.getElementById("sauniDurationInput");
    const baseInput = document.getElementById("sauniBaselineFillInput");

    if (qInput) {
      qInput.addEventListener("input", (e) => {
        const val = parseFloat(e.target.value);
        state.inputs.dischargeCusecs = val;
        const cumecs = (val * 0.0283168466).toFixed(1);
        document.getElementById("sauniDischargeVal").textContent = `${val.toLocaleString()} cusecs (${cumecs} m³/s)`;
        updateSimulation();
      });
    }

    if (durInput) {
      durInput.addEventListener("input", (e) => {
        const val = parseInt(e.target.value, 10);
        state.inputs.durationDays = val;
        document.getElementById("sauniDurationVal").textContent = `${val} days`;
        updateSimulation();
      });
    }

    if (baseInput) {
      baseInput.addEventListener("input", (e) => {
        const val = parseInt(e.target.value, 10);
        state.inputs.baselineFillPct = val;
        document.getElementById("sauniBaselineFillVal").textContent = `${val}% of Gross Storage`;
        updateSimulation();
      });
    }

    // Focus Corridor on Map
    const focusBtn = document.getElementById("sauniFocusCorridorBtn");
    if (focusBtn) {
      focusBtn.addEventListener("click", () => {
        highlightLinkOnMap(state.activeLinkKey);
      });
    }

    // Export CSV
    const exportBtn = document.getElementById("sauniExportCsvBtn");
    if (exportBtn) {
      exportBtn.addEventListener("click", () => {
        exportTransferSummaryCsv();
      });
    }

    // Keyboard Hotkey 'U' or 'u'
    window.addEventListener("keydown", (e) => {
      if (e.key === "u" || e.key === "U") {
        const activeTag = (document.activeElement?.tagName || "").toLowerCase();
        if (activeTag === "input" || activeTag === "textarea" || activeTag === "select") return;
        e.preventDefault();
        toggleModal();
      } else if (e.key === "Escape") {
        if (modal.open) closeModal();
      }
    });
  }

  /**
   * Opens the Explorer Modal
   */
  function openModal(linkKey = null) {
    buildModalDom();
    const modal = document.getElementById("sauniExplorerModal");
    if (!modal) return;

    if (linkKey && CORRIDOR_REGISTRY[linkKey]) {
      state.activeLinkKey = linkKey;
    }

    if (!state.waterData && typeof window.fetchCachedGeoJson === "function") {
      window.fetchCachedGeoJson("data/gujarat_water_resources.geojson").then(d => {
        state.waterData = d;
        selectLink(state.activeLinkKey);
      }).catch(() => {});
    }

    if (!modal.open) {
      modal.showModal();
    }

    selectLink(state.activeLinkKey);
  }

  /**
   * Closes the Explorer Modal
   */
  function closeModal() {
    const modal = document.getElementById("sauniExplorerModal");
    if (modal && modal.open) {
      modal.close();
    }
    clearMapHighlights();
  }

  /**
   * Toggles the modal
   */
  function toggleModal() {
    const modal = document.getElementById("sauniExplorerModal");
    if (modal && modal.open) {
      closeModal();
    } else {
      openModal();
    }
  }

  /**
   * Selects an active corridor link and updates UI
   */
  function selectLink(linkKey) {
    if (!CORRIDOR_REGISTRY[linkKey]) return;
    state.activeLinkKey = linkKey;

    // Update Tab Buttons
    document.querySelectorAll(".sauni-tab-btn[data-link]").forEach(b => {
      const isMatch = b.getAttribute("data-link") === linkKey;
      b.classList.toggle("active", isMatch);
      b.setAttribute("aria-selected", isMatch ? "true" : "false");
    });

    const cfg = CORRIDOR_REGISTRY[linkKey];

    // Adjust discharge slider limits for Sujalam
    const qInput = document.getElementById("sauniDischargeInput");
    if (qInput) {
      if (linkKey === "sujalam") {
        qInput.max = "2500";
        if (state.inputs.dischargeCusecs < 1500) {
          state.inputs.dischargeCusecs = 2000;
          qInput.value = "2000";
        }
      } else {
        qInput.max = "1500";
        if (state.inputs.dischargeCusecs > 1200) {
          state.inputs.dischargeCusecs = 1200;
          qInput.value = "1200";
        }
      }
      const qVal = state.inputs.dischargeCusecs;
      const cumecs = (qVal * 0.0283168466).toFixed(1);
      document.getElementById("sauniDischargeVal").textContent = `${qVal.toLocaleString()} cusecs (${cumecs} m³/s)`;
    }

    // Render Corridor Profile Card
    renderProfileCard(cfg);

    // Update Simulation & Recipient Dams
    updateSimulation();

    // Trace link on map
    highlightLinkOnMap(linkKey);
  }

  /**
   * Render Corridor Technical Profile Card
   */
  function renderProfileCard(cfg) {
    const card = document.getElementById("sauniProfileCard");
    if (!card) return;

    card.innerHTML = `
      <div class="sauni-card-header">
        <h3 class="sauni-card-title">${cfg.shortTitle}</h3>
        <span class="sauni-tag sauni-tag-blue">[ VERIFIED SOURCED ]</span>
      </div>
      <div class="sauni-profile-grid">
        <div class="sauni-profile-item">
          <span class="sauni-meta-k">Asset Code:</span>
          <span class="sauni-meta-v"><code>${cfg.id}</code></span>
        </div>
        <div class="sauni-profile-item">
          <span class="sauni-meta-k">Total Length:</span>
          <span class="sauni-meta-v font-bold">${cfg.lengthKm} km</span>
        </div>
        <div class="sauni-profile-item">
          <span class="sauni-meta-k">Pipe / Channel:</span>
          <span class="sauni-meta-v">${cfg.pipeDiameterM > 0 ? `${cfg.pipeDiameterM}m MS Pipeline` : 'Unlined Canal'}</span>
        </div>
        <div class="sauni-profile-item">
          <span class="sauni-meta-k">Design Capacity:</span>
          <span class="sauni-meta-v">${cfg.designDischargeCusecs.toLocaleString()} cusecs (${cfg.designDischargeCumecs} m³/s)</span>
        </div>
        <div class="sauni-profile-item">
          <span class="sauni-meta-k">Headworks / Intake:</span>
          <span class="sauni-meta-v">${cfg.headworksName}</span>
        </div>
        <div class="sauni-profile-item">
          <span class="sauni-meta-k">Districts Served:</span>
          <span class="sauni-meta-v">${cfg.districtsServed.join(", ")}</span>
        </div>
        <div class="sauni-profile-item">
          <span class="sauni-meta-k">Command Area:</span>
          <span class="sauni-meta-v">${cfg.commandHa.toLocaleString()} ha</span>
        </div>
        <div class="sauni-profile-item">
          <span class="sauni-meta-k">Beneficiary Units:</span>
          <span class="sauni-meta-v">${cfg.beneficiaryReservoirsCount} ${cfg.key === 'sujalam' ? 'Rivers & Tanks' : 'Storage Dams'}</span>
        </div>
      </div>
      <p class="sauni-profile-desc">${cfg.description}</p>
    `;
  }

  /**
   * Recalculate Hydraulic Mass-Balance & Telemetry
   */
  function updateSimulation() {
    const cfg = CORRIDOR_REGISTRY[state.activeLinkKey];
    if (!cfg) return;

    const Q_cusecs = state.inputs.dischargeCusecs;
    const T_days = state.inputs.durationDays;
    const baselinePct = state.inputs.baselineFillPct;

    // Physical Conversions
    const Q_cumecs = Q_cusecs * 0.0283168466;
    const totalVolumeMcm = Q_cusecs * 0.0024465755 * T_days;
    const totalVolumeAcreFt = totalVolumeMcm * 810.713;

    // Pumping Hydraulics:
    // Total Dynamic Head TDH = static lift + friction loss
    const TDH = cfg.staticLiftM + cfg.frictionLossM;
    const rho = 1000; // kg/m3
    const g = 9.81;   // m/s2
    const hydraulicPowerMw = (rho * g * Q_cumecs * TDH) / 1e6;
    const electricPowerMw = hydraulicPowerMw / cfg.pumpEfficiency;
    const totalEnergyMwh = electricPowerMw * 24 * T_days;
    const specificEnergyKwhPerM3 = (electricPowerMw * 1000) / (Q_cumecs * 3600);

    // Update Telemetry Grid
    const telemGrid = document.getElementById("sauniTelemetryGrid");
    if (telemGrid) {
      telemGrid.innerHTML = `
        <div class="sauni-telem-card">
          <span class="sauni-telem-val text-cyan">${totalVolumeMcm.toFixed(1)} <small>MCM</small></span>
          <span class="sauni-telem-lbl">Total Diverted Volume</span>
          <span class="sauni-telem-sub">${totalVolumeAcreFt.toLocaleString(undefined, { maximumFractionDigits: 0 })} Acre-Feet</span>
        </div>
        <div class="sauni-telem-card">
          <span class="sauni-telem-val text-amber">${electricPowerMw.toFixed(1)} <small>MW</small></span>
          <span class="sauni-telem-lbl">Pumping Motor Load</span>
          <span class="sauni-telem-sub">Lift TDH: ${TDH.toFixed(1)}m (Headworks)</span>
        </div>
        <div class="sauni-telem-card">
          <span class="sauni-telem-val text-emerald">${(totalEnergyMwh / 1000).toFixed(2)} <small>GWh</small></span>
          <span class="sauni-telem-lbl">Cumulative Grid Energy</span>
          <span class="sauni-telem-sub">${totalEnergyMwh.toLocaleString(undefined, { maximumFractionDigits: 0 })} MWh across ${T_days}d</span>
        </div>
        <div class="sauni-telem-card">
          <span class="sauni-telem-val text-blue">${specificEnergyKwhPerM3.toFixed(3)} <small>kWh/m³</small></span>
          <span class="sauni-telem-lbl">Conveyance Energy Intensity</span>
          <span class="sauni-telem-sub">η = ${(cfg.pumpEfficiency * 100).toFixed(0)}% wire-to-water</span>
        </div>
      `;
    }

    // Conveyance Loss factor (2.5%)
    const netDeliveredMcm = totalVolumeMcm * 0.975;

    // Recipient Dams Allocation
    renderRecipientLedger(cfg, netDeliveredMcm, baselinePct);

    // Render Schematic Bar
    renderSchematicFlow(cfg, totalVolumeMcm, netDeliveredMcm);
  }

  /**
   * Render Recipient Dams Replenishment Table
   */
  function renderRecipientLedger(cfg, netDeliveredMcm, baselinePct) {
    const tbody = document.getElementById("sauniLedgerBody");
    if (!tbody) return;

    tbody.innerHTML = "";

    cfg.recipientDams.forEach(dam => {
      const grossCap = dam.grossStorageMcm;
      const initialStorage = grossCap * (baselinePct / 100);
      const allocatedInflow = netDeliveredMcm * dam.shareWeight;
      const finalStorage = Math.min(grossCap, initialStorage + allocatedInflow);
      const finalPct = Math.min(100, (finalStorage / grossCap) * 100);
      const gainPct = finalPct - baselinePct;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>
          <div class="sauni-dam-cell">
            <span class="sauni-dam-icon">💧</span>
            <div>
              <strong class="sauni-dam-title">${dam.name}</strong>
              <small class="sauni-dam-sub">${dam.river} River • <code>${dam.id}</code></small>
            </div>
          </div>
        </td>
        <td><span class="sauni-district-pill">${dam.district}</span></td>
        <td class="font-mono">${grossCap.toFixed(1)}</td>
        <td class="font-mono text-dim">${initialStorage.toFixed(1)} <small>(${baselinePct}%)</small></td>
        <td class="font-mono text-cyan">+${allocatedInflow.toFixed(1)} MCM</td>
        <td>
          <div class="sauni-meter-wrap">
            <div class="sauni-meter-bar">
              <div class="sauni-meter-fill-base" style="width: ${baselinePct}%;"></div>
              <div class="sauni-meter-fill-gain" style="width: ${gainPct.toFixed(1)}%;"></div>
            </div>
            <span class="sauni-meter-val font-bold ${finalPct >= 95 ? 'text-emerald' : 'text-cyan'}">${finalPct.toFixed(0)}%</span>
          </div>
        </td>
        <td>
          <button class="sauni-inspect-dam-btn" data-dam-id="${dam.id}" title="Inspect Dam in Digital Twin">
            🔍 Inspect
          </button>
        </td>
      `;

      tbody.appendChild(row);
    });

    // Bind Dam inspection buttons
    tbody.querySelectorAll(".sauni-inspect-dam-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const did = btn.getAttribute("data-dam-id");
        if (typeof window.selectWaterAssetById === "function") {
          closeModal();
          setTimeout(() => {
            window.selectWaterAssetById(did, true);
          }, 300);
        }
      });
    });
  }

  /**
   * Render Flow Schematic Progress
   */
  function renderSchematicFlow(cfg, totalMcm, netMcm) {
    const bar = document.getElementById("sauniFlowSchematic");
    if (!bar) return;

    bar.innerHTML = `
      <div class="sauni-schematic-track">
        <div class="sauni-node sauni-node-intake">
          <span class="sauni-node-badge">INTAKE</span>
          <span class="sauni-node-title">${cfg.headworksName}</span>
          <span class="sauni-node-metric">${totalMcm.toFixed(1)} MCM Inflow</span>
        </div>
        <div class="sauni-connector">
          <div class="sauni-connector-pulse"></div>
          <span class="sauni-connector-lbl">Pressurized Transfer (${cfg.lengthKm} km)</span>
        </div>
        <div class="sauni-node sauni-node-terminal">
          <span class="sauni-node-badge">RECIPIENT NETWORK</span>
          <span class="sauni-node-title">${cfg.recipientDams.length} Key Storage Reservoirs</span>
          <span class="sauni-node-metric">${netMcm.toFixed(1)} MCM Replenished</span>
        </div>
      </div>
    `;
  }

  /**
   * Highlights the selected pipeline link and recipient dams on Leaflet map
   */
  function highlightLinkOnMap(linkKey) {
    if (!state.map && window.map) state.map = window.map;
    if (!state.map) return;
    clearMapHighlights();

    const cfg = CORRIDOR_REGISTRY[linkKey];
    if (!cfg) return;

    // 1. Locate GeoJSON coordinates from waterData or embedded fallback
    let rawCoords = cfg.coordinates;
    if (state.waterData && state.waterData.features) {
      const feat = state.waterData.features.find(f => f.properties?.id === cfg.id);
      if (feat && feat.geometry && feat.geometry.coordinates) {
        rawCoords = feat.geometry.coordinates;
      }
    }

    if (rawCoords && rawCoords.length) {
      const coords = rawCoords.map(c => [c[1], c[0]]);
      const pane = (state.map.getPane && state.map.getPane("waterwaysPane")) ? "waterwaysPane" : "overlayPane";

      // Glowing pulse line
      const glowLine = L.polyline(coords, {
        color: "#38bdf8",
        weight: 8,
        opacity: 0.45,
        lineCap: "round",
        pane: pane
      }).addTo(state.map);

      // Core flow line
      const coreLine = L.polyline(coords, {
        color: "#06b6d4",
        weight: 4,
        opacity: 0.95,
        dashArray: "10, 6",
        pane: pane
      }).addTo(state.map);

      state.mapHighlightLayers.push(glowLine, coreLine);

      // Fit map bounds smoothly
      if (state.map.flyToBounds) {
        state.map.flyToBounds(coreLine.getBounds(), { padding: [60, 60], duration: 1.0 });
      }
    }

    // 2. Add pulsing markers at recipient dams
    const damPane = (state.map.getPane && state.map.getPane("damsPane")) ? "damsPane" : "overlayPane";
    cfg.recipientDams.forEach(d => {
      let lat = d.lat;
      let lng = d.lng;
      if (state.waterData && state.waterData.features) {
        const damFeat = state.waterData.features.find(f => f.properties?.id === d.id);
        if (damFeat && damFeat.geometry && damFeat.geometry.type === "Point") {
          lng = damFeat.geometry.coordinates[0];
          lat = damFeat.geometry.coordinates[1];
        }
      }

      if (lat !== undefined && lng !== undefined) {
        const pulseMarker = L.circleMarker([lat, lng], {
          radius: 9,
          color: "#38bdf8",
          weight: 2.5,
          fillColor: "#0284c7",
          fillOpacity: 0.85,
          pane: damPane
        }).addTo(state.map);

        pulseMarker.bindTooltip(`<strong>${d.name}</strong><br><small style="color:#38bdf8;">Recipient Dam • Gross: ${d.grossStorageMcm} MCM</small>`, {
          sticky: false,
          direction: "top"
        });

        state.damMarkerLayers.push(pulseMarker);
      }
    });
  }

  /**
   * Clear all transient map highlight layers
   */
  function clearMapHighlights() {
    if (!state.map) return;
    state.mapHighlightLayers.forEach(l => state.map.removeLayer(l));
    state.damMarkerLayers.forEach(m => state.map.removeLayer(m));
    state.mapHighlightLayers = [];
    state.damMarkerLayers = [];
  }

  /**
   * Export simulation results as RFC-4180 CSV
   */
  function exportTransferSummaryCsv() {
    const cfg = CORRIDOR_REGISTRY[state.activeLinkKey];
    if (!cfg) return;

    const Q_cusecs = state.inputs.dischargeCusecs;
    const T_days = state.inputs.durationDays;
    const baselinePct = state.inputs.baselineFillPct;
    const totalVolumeMcm = Q_cusecs * 0.0024465755 * T_days;
    const netDeliveredMcm = totalVolumeMcm * 0.975;
    const TDH = cfg.staticLiftM + cfg.frictionLossM;
    const Q_cumecs = Q_cusecs * 0.0283168466;
    const electricPowerMw = ((1000 * 9.81 * Q_cumecs * TDH) / 1e6) / cfg.pumpEfficiency;
    const totalEnergyMwh = electricPowerMw * 24 * T_days;

    const rows = [
      ["METADATA_KEY", "VALUE"],
      ["Report Title", "Gujarat Digital Twin — SAUNI Basin Water Transfer Simulation"],
      ["Generated Timestamp", new Date().toISOString()],
      ["Corridor ID", cfg.id],
      ["Corridor Name", cfg.name],
      ["Corridor Length (km)", cfg.lengthKm.toString()],
      ["Design Discharge (cusecs)", cfg.designDischargeCusecs.toString()],
      ["Operating Agency", cfg.operatingAgency],
      ["Simulated Discharge Rate (cusecs)", Q_cusecs.toString()],
      ["Simulated Duration (days)", T_days.toString()],
      ["Pre-Transfer Drought Baseline Fill (%)", baselinePct.toString()],
      ["Total Diverted Volume (MCM)", totalVolumeMcm.toFixed(2)],
      ["Net Delivered Volume (MCM)", netDeliveredMcm.toFixed(2)],
      ["Pumping Motor Demand (MW)", electricPowerMw.toFixed(2)],
      ["Total Energy Consumption (MWh)", totalEnergyMwh.toFixed(0)],
      [],
      ["RECIPIENT_DAM_ID", "DAM_NAME", "DISTRICT", "RIVER", "GROSS_CAPACITY_MCM", "INITIAL_STORAGE_MCM", "ALLOCATED_INFLOW_MCM", "POST_TRANSFER_STORAGE_MCM", "POST_TRANSFER_FILL_PCT"]
    ];

    cfg.recipientDams.forEach(dam => {
      const grossCap = dam.grossStorageMcm;
      const initialStorage = grossCap * (baselinePct / 100);
      const allocatedInflow = netDeliveredMcm * dam.shareWeight;
      const finalStorage = Math.min(grossCap, initialStorage + allocatedInflow);
      const finalPct = Math.min(100, (finalStorage / grossCap) * 100);

      rows.push([
        dam.id,
        dam.name,
        dam.district,
        dam.river,
        grossCap.toFixed(2),
        initialStorage.toFixed(2),
        allocatedInflow.toFixed(2),
        finalStorage.toFixed(2),
        finalPct.toFixed(1) + "%"
      ]);
    });

    const csvContent = "\uFEFF" + rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `gujarat_sauni_transfer_${cfg.key}_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Public Interface
  window.SauniBasinTransferExplorer = {
    init,
    openModal,
    closeModal,
    toggleModal,
    selectLink,
    updateSimulation,
    highlightLinkOnMap,
    clearMapHighlights,
    exportTransferSummaryCsv,
    getRegistry: () => CORRIDOR_REGISTRY,
    getActiveLinkKey: () => state.activeLinkKey,
    getState: () => ({ ...state })
  };

})(window);
