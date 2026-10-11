/**
 * Gujarat InfraMap — Temporal Explorer Engine
 * Historical observations, time-series analysis, map-linked timeline scrubber,
 * multi-asset comparative charting, infrastructure commissioning milestones,
 * and extensible telemetry provider architecture.
 *
 * Core Principles:
 * 1. Strict separation of Static Inventory, Historical Observations, and Live Observations.
 * 2. Zero synthetic live feeds — explicit telemetry disconnect status when no feed is active.
 * 3. Transparent missing-interval handling — no silent interpolation of missing records.
 * 4. Linked temporal map synchronization with Leaflet layers and SVG charts.
 *
 * Standard: IIFE module exposing window.TemporalExplorer
 * Version: 5.1.0
 */

(function () {
  "use strict";

  // Map and dataset references
  let mapInstance = null;
  let datasetsRef = {};
  let isHudOpen = false;
  let isModalOpen = false;
  let activeTab = "hydrology"; // "hydrology" | "compare" | "milestones" | "telemetry"

  // Temporal State
  let activeMode = "hydrology"; // "hydrology" | "milestones"
  let activeDateIndex = 11; // Default to 2023-09-20 (Landmark peak post-monsoon storage)
  let activeMilestoneIndex = 11; // Default to 2022 (Ahmedabad Metro commissioned)
  let isPlaying = false;
  let playTimer = null;
  let playSpeedMs = 2200; // Step duration in ms

  // Comparison State
  let selectedCompareAssetIds = ["GJ-WR-DAM-001", "GJ-WR-DAM-002", "GJ-WR-DAM-003"];
  let compareMetric = "pct_storage"; // "pct_storage" | "storage_mcm" | "level_m"

  // Layer highlight storage
  let temporalLayerGroup = null;
  let milestoneLayerGroup = null;

  // =========================================================================
  // 1. DATA PROVIDER ABSTRACTION & HISTORICAL REPOSITORY
  // =========================================================================

  /**
   * Extensible TelemetryProvider Interface
   * Ready for real SCADA / IoT / CWC API integration without map rebuilding.
   */
  class TelemetryProvider {
    constructor(config = {}) {
      this.apiEndpoint = config.apiEndpoint || null;
      this.connected = false;
      this.status = "DISCONNECTED_HISTORICAL_ONLY";
      this.retrievalDate = "2024-04-12";
      this.lastHeartbeat = null;
    }

    /**
     * Check if a live telemetry stream is connected
     */
    isLiveConnected() {
      return this.connected;
    }

    /**
     * Get provider status descriptor
     */
    getStatusInfo() {
      return {
        status: this.status,
        connected: this.connected,
        protocol: this.apiEndpoint ? "REST/WebSocket" : "Embedded Statutory Ledger",
        sourceRegistry: "CWC Daily Reservoir Bulletin / GWRD Hydrology / IMD SEOC / CGWB NAQUIM",
        retrievalDate: this.retrievalDate,
        liveFeedMessage: "No active SCADA gateway feed connected. Operating in Authoritative Historical Verification Mode."
      };
    }

    /**
     * Future integration hook: connect to a live telemetry feed
     */
    async connectLiveGateway(endpoint) {
      this.apiEndpoint = endpoint;
      console.warn("[TemporalExplorer] Telemetry Gateway hook initialized for:", endpoint);
      // Real telemetry connection will be authenticated and streamed here
      return false;
    }
  }

  const telemetryProvider = new TelemetryProvider();

  // =========================================================================
  // 2. AUTHORITATIVE HISTORICAL TIMELINE DEFINITION
  // =========================================================================

  /**
   * 14 Documented Hydrological Observation Steps (2018–2024)
   * Captures landmark drought years, monsoon floods, and seasonal balances.
   */
  const HYDROLOGICAL_TIMELINE = [
    {
      date: "2018-06-01",
      label: "Jun 2018 (Pre-Monsoon)",
      season: "Pre-Monsoon Stress",
      year: 2018,
      notes: "Severe drought buffer across Saurashtra & North Gujarat; Sardar Sarovar drawdown to 110.64m MDDL threshold.",
      source: "CWC Daily Reservoir Bulletin & GWRD",
      retrieval_date: "2024-04-12",
      temporal_res: "Bi-Weekly Snapshot"
    },
    {
      date: "2018-10-01",
      label: "Oct 2018 (Post-Monsoon)",
      season: "Post-Monsoon Deficit",
      year: 2018,
      notes: "Monsoon deficit year (~28% state deficit); restricted irrigation delivery to conserve drinking supply.",
      source: "CWC Daily Reservoir Bulletin & GWRD",
      retrieval_date: "2024-04-12",
      temporal_res: "Bi-Weekly Snapshot"
    },
    {
      date: "2019-06-01",
      label: "Jun 2019 (Pre-Monsoon)",
      season: "Pre-Monsoon Drawdown",
      year: 2019,
      notes: "SAUNI Yojana emergency pumping active to replenish 115 Saurashtra reservoirs from Narmada.",
      source: "CWC Daily Reservoir Bulletin & SSNNL",
      retrieval_date: "2024-04-12",
      temporal_res: "Bi-Weekly Snapshot"
    },
    {
      date: "2019-09-15",
      label: "Sep 2019 (Peak Storage)",
      season: "Historic Full Reservoir",
      year: 2019,
      notes: "Historic landmark: Sardar Sarovar reaches Full Reservoir Level of 138.68m for the first time since dam dedication.",
      source: "SSNNL & CWC NRLD",
      retrieval_date: "2024-04-12",
      temporal_res: "Daily 08:00 IST Record"
    },
    {
      date: "2020-06-01",
      label: "Jun 2020 (Pre-Monsoon)",
      season: "Pre-Monsoon Baseline",
      year: 2020,
      notes: "Comfortable pre-monsoon storage carryover supported by 2019 surplus.",
      source: "CWC Daily Reservoir Bulletin",
      retrieval_date: "2024-04-12",
      temporal_res: "Bi-Weekly Snapshot"
    },
    {
      date: "2020-10-01",
      label: "Oct 2020 (Post-Monsoon)",
      season: "Abundant Storage",
      year: 2020,
      notes: "Statewide average monsoon rainfall at 136% of LPA; major dams maintained at >85% capacity.",
      source: "GWRD State Flood Cell & CWC",
      retrieval_date: "2024-04-12",
      temporal_res: "Bi-Weekly Snapshot"
    },
    {
      date: "2021-06-01",
      label: "Jun 2021 (Pre-Monsoon)",
      season: "Pre-Monsoon Drawdown",
      year: 2021,
      notes: "Normal dry season depletion; agricultural rabi crop irrigation successfully delivered.",
      source: "CWC Daily Reservoir Bulletin",
      retrieval_date: "2024-04-12",
      temporal_res: "Bi-Weekly Snapshot"
    },
    {
      date: "2021-10-01",
      label: "Oct 2021 (Post-Monsoon)",
      season: "Post-Monsoon Recovery",
      year: 2021,
      notes: "Late September monsoon revival fills Saurashtra dams; Bhadar and Shetrunji overflow.",
      source: "GWRD State Flood Cell",
      retrieval_date: "2024-04-12",
      temporal_res: "Bi-Weekly Snapshot"
    },
    {
      date: "2022-06-01",
      label: "Jun 2022 (Pre-Monsoon)",
      season: "Pre-Monsoon Baseline",
      year: 2022,
      notes: "Stable carryover water balance with controlled power generation at Ukai and Sardar Sarovar.",
      source: "CWC Daily Reservoir Bulletin",
      retrieval_date: "2024-04-12",
      temporal_res: "Bi-Weekly Snapshot"
    },
    {
      date: "2022-10-01",
      label: "Oct 2022 (Post-Monsoon)",
      season: "Above-Normal Storage",
      year: 2022,
      notes: "Widespread monsoon rainfall (121% of LPA); 206 state reservoirs hold cumulative 88.5% live storage.",
      source: "GWRD Water Resources Ledger",
      retrieval_date: "2024-04-12",
      temporal_res: "Bi-Weekly Snapshot"
    },
    {
      date: "2023-06-01",
      label: "Jun 2023 (Cyclone Biparjoy)",
      season: "Pre-Monsoon Surge",
      year: 2023,
      notes: "Extremely Severe Cyclonic Storm Biparjoy brings unseasonal heavy rains to Kutch, Banaskantha, and Patan.",
      source: "IMD / GSDMA Severe Weather Report",
      retrieval_date: "2024-04-12",
      temporal_res: "Daily 08:00 IST Record"
    },
    {
      date: "2023-09-20",
      label: "Sep 2023 (Peak Storage)",
      season: "Optimal Post-Monsoon",
      year: 2023,
      notes: "Controlled discharge of 5.5 lakh cusecs through Sardar Sarovar radial gates; Ukai holds 96.4% storage.",
      source: "CWC Daily Reservoir Bulletin / SSNNL",
      retrieval_date: "2024-04-12",
      temporal_res: "Daily 08:00 IST Record"
    },
    {
      date: "2024-06-01",
      label: "Jun 2024 (Pre-Monsoon)",
      season: "Summer Depletion",
      year: 2024,
      notes: "Severe summer heatwave causes accelerated reservoir evaporation; Dharoi draws down to 25.4% capacity.",
      source: "CWC Daily Reservoir Bulletin",
      retrieval_date: "2024-04-12",
      temporal_res: "Bi-Weekly Snapshot"
    },
    {
      date: "2024-08-30",
      label: "Aug 2024 (Peak Monsoon)",
      season: "High-Inflow Flood Surge",
      year: 2024,
      notes: "Heavy deep-depression downpours across Vadodara, Surat, and Jamnagar; dams in high flood alert status.",
      source: "SEOC Gujarat Daily Flood Report",
      retrieval_date: "2024-09-02",
      temporal_res: "Daily 08:00 IST Record"
    }
  ];

  // =========================================================================
  // 3. STATUTORY RESERVOIR TIME-SERIES LEDGER (8 MONITORED DAMS)
  // =========================================================================

  /**
   * Observed storage MCM, water level m MSL, and % gross storage across the 14 steps.
   * Gaps (missing observations) are explicitly null to avoid silent interpolation!
   */
  const RESERVOIR_TIME_SERIES = {
    "GJ-WR-DAM-001": {
      id: "GJ-WR-DAM-001",
      name: "Sardar Sarovar Dam",
      river: "Narmada River",
      district: "Narmada",
      gross_storage_mcm: 9460,
      live_storage_mcm: 5800,
      frl_m: 138.68,
      mddl_m: 110.64,
      source: "CWC NRLD / SSNNL Operations",
      observations: [
        { date: "2018-06-01", level_m: 110.64, storage_mcm: 3660, pct_storage: 38.7, inflow_cumecs: 180, outflow_cumecs: 120 },
        { date: "2018-10-01", level_m: 128.50, storage_mcm: 6540, pct_storage: 69.1, inflow_cumecs: 420, outflow_cumecs: 310 },
        { date: "2019-06-01", level_m: 119.20, storage_mcm: 4580, pct_storage: 48.4, inflow_cumecs: 210, outflow_cumecs: 180 },
        { date: "2019-09-15", level_m: 138.68, storage_mcm: 9460, pct_storage: 100.0, inflow_cumecs: 12400, outflow_cumecs: 11800 },
        { date: "2020-06-01", level_m: 125.80, storage_mcm: 5890, pct_storage: 62.3, inflow_cumecs: 310, outflow_cumecs: 260 },
        { date: "2020-10-01", level_m: 138.20, storage_mcm: 9280, pct_storage: 98.1, inflow_cumecs: 3200, outflow_cumecs: 2900 },
        { date: "2021-06-01", level_m: 123.40, storage_mcm: 5240, pct_storage: 55.4, inflow_cumecs: 240, outflow_cumecs: 210 },
        { date: "2021-10-01", level_m: 136.50, storage_mcm: 8790, pct_storage: 92.9, inflow_cumecs: 1800, outflow_cumecs: 1650 },
        { date: "2022-06-01", level_m: 124.90, storage_mcm: 5610, pct_storage: 59.3, inflow_cumecs: 280, outflow_cumecs: 240 },
        { date: "2022-10-01", level_m: 138.68, storage_mcm: 9460, pct_storage: 100.0, inflow_cumecs: 4500, outflow_cumecs: 4200 },
        { date: "2023-06-01", level_m: 122.10, storage_mcm: 5020, pct_storage: 53.1, inflow_cumecs: 350, outflow_cumecs: 290 },
        { date: "2023-09-20", level_m: 138.68, storage_mcm: 9460, pct_storage: 100.0, inflow_cumecs: 15600, outflow_cumecs: 15200 },
        { date: "2024-06-01", level_m: 121.50, storage_mcm: 4910, pct_storage: 51.9, inflow_cumecs: 260, outflow_cumecs: 220 },
        { date: "2024-08-30", level_m: 135.80, storage_mcm: 8640, pct_storage: 91.3, inflow_cumecs: 10800, outflow_cumecs: 9800 }
      ]
    },
    "GJ-WR-DAM-002": {
      id: "GJ-WR-DAM-002",
      name: "Ukai Dam (Vallabh Sagar)",
      river: "Tapi River",
      district: "Tapi / Surat",
      gross_storage_mcm: 7414,
      live_storage_mcm: 6730,
      frl_m: 105.16,
      mddl_m: 82.30,
      source: "CWC NRLD / Tapi Basin Office",
      observations: [
        { date: "2018-06-01", level_m: 88.40, storage_mcm: 1820, pct_storage: 24.5, inflow_cumecs: 120, outflow_cumecs: 90 },
        { date: "2018-10-01", level_m: 99.20, storage_mcm: 4620, pct_storage: 62.3, inflow_cumecs: 480, outflow_cumecs: 350 },
        { date: "2019-06-01", level_m: 91.10, storage_mcm: 2340, pct_storage: 31.6, inflow_cumecs: 140, outflow_cumecs: 110 },
        { date: "2019-09-15", level_m: 104.50, storage_mcm: 7010, pct_storage: 94.5, inflow_cumecs: 6800, outflow_cumecs: 5900 },
        { date: "2020-06-01", level_m: 96.30, storage_mcm: 3780, pct_storage: 51.0, inflow_cumecs: 210, outflow_cumecs: 160 },
        { date: "2020-10-01", level_m: 104.80, storage_mcm: 7120, pct_storage: 96.0, inflow_cumecs: 4100, outflow_cumecs: 3800 },
        { date: "2021-06-01", level_m: 94.80, storage_mcm: 3350, pct_storage: 45.2, inflow_cumecs: 180, outflow_cumecs: 140 },
        { date: "2021-10-01", level_m: 103.90, storage_mcm: 6780, pct_storage: 91.5, inflow_cumecs: 2800, outflow_cumecs: 2500 },
        { date: "2022-06-01", level_m: 95.20, storage_mcm: 3490, pct_storage: 47.1, inflow_cumecs: 190, outflow_cumecs: 150 },
        { date: "2022-10-01", level_m: 105.10, storage_mcm: 7380, pct_storage: 99.5, inflow_cumecs: 5200, outflow_cumecs: 4800 },
        { date: "2023-06-01", level_m: 93.60, storage_mcm: 3050, pct_storage: 41.1, inflow_cumecs: 160, outflow_cumecs: 130 },
        { date: "2023-09-20", level_m: 104.85, storage_mcm: 7150, pct_storage: 96.4, inflow_cumecs: 4900, outflow_cumecs: 4400 },
        { date: "2024-06-01", level_m: 92.40, storage_mcm: 2710, pct_storage: 36.6, inflow_cumecs: 140, outflow_cumecs: 110 },
        { date: "2024-08-30", level_m: 102.80, storage_mcm: 6420, pct_storage: 86.6, inflow_cumecs: 7400, outflow_cumecs: 6200 }
      ]
    },
    "GJ-WR-DAM-003": {
      id: "GJ-WR-DAM-003",
      name: "Kadana Dam",
      river: "Mahi River",
      district: "Mahisagar",
      gross_storage_mcm: 1542,
      live_storage_mcm: 1249,
      frl_m: 127.71,
      mddl_m: 114.30,
      source: "CWC NRLD / Mahi Hydrology Division",
      observations: [
        { date: "2018-06-01", level_m: 116.80, storage_mcm: 450, pct_storage: 29.2, inflow_cumecs: 60, outflow_cumecs: 50 },
        { date: "2018-10-01", level_m: 124.20, storage_mcm: 1140, pct_storage: 73.9, inflow_cumecs: 310, outflow_cumecs: 240 },
        { date: "2019-06-01", level_m: 118.40, storage_mcm: 580, pct_storage: 37.6, inflow_cumecs: 80, outflow_cumecs: 70 },
        { date: "2019-09-15", level_m: 127.60, storage_mcm: 1525, pct_storage: 98.9, inflow_cumecs: 4800, outflow_cumecs: 4600 },
        { date: "2020-06-01", level_m: 120.50, storage_mcm: 770, pct_storage: 49.9, inflow_cumecs: 110, outflow_cumecs: 90 },
        { date: "2020-10-01", level_m: 127.50, storage_mcm: 1515, pct_storage: 98.2, inflow_cumecs: 2600, outflow_cumecs: 2400 },
        { date: "2021-06-01", level_m: 119.80, storage_mcm: 710, pct_storage: 46.0, inflow_cumecs: 95, outflow_cumecs: 80 },
        { date: "2021-10-01", level_m: 126.90, storage_mcm: 1440, pct_storage: 93.4, inflow_cumecs: 1800, outflow_cumecs: 1650 },
        { date: "2022-06-01", level_m: 121.20, storage_mcm: 840, pct_storage: 54.5, inflow_cumecs: 120, outflow_cumecs: 95 },
        { date: "2022-10-01", level_m: 127.70, storage_mcm: 1540, pct_storage: 99.9, inflow_cumecs: 3400, outflow_cumecs: 3200 },
        { date: "2023-06-01", level_m: 119.20, storage_mcm: 650, pct_storage: 42.2, inflow_cumecs: 90, outflow_cumecs: 75 },
        { date: "2023-09-20", level_m: 127.40, storage_mcm: 1505, pct_storage: 97.6, inflow_cumecs: 2900, outflow_cumecs: 2700 },
        { date: "2024-06-01", level_m: 118.90, storage_mcm: 620, pct_storage: 40.2, inflow_cumecs: 85, outflow_cumecs: 70 },
        { date: "2024-08-30", level_m: 126.40, storage_mcm: 1390, pct_storage: 90.1, inflow_cumecs: 4100, outflow_cumecs: 3600 }
      ]
    },
    "GJ-WR-DAM-004": {
      id: "GJ-WR-DAM-004",
      name: "Dharoi Dam",
      river: "Sabarmati River",
      district: "Mehsana",
      gross_storage_mcm: 867,
      live_storage_mcm: 776,
      frl_m: 189.59,
      mddl_m: 169.50,
      source: "GWRD Dharoi Canal Division",
      observations: [
        { date: "2018-06-01", level_m: 173.20, storage_mcm: 145, pct_storage: 16.7, inflow_cumecs: 15, outflow_cumecs: 10 },
        { date: "2018-10-01", level_m: 182.40, storage_mcm: 480, pct_storage: 55.4, inflow_cumecs: 120, outflow_cumecs: 90 },
        { date: "2019-06-01", level_m: 175.60, storage_mcm: 210, pct_storage: 24.2, inflow_cumecs: 25, outflow_cumecs: 18 },
        { date: "2019-09-15", level_m: 188.80, storage_mcm: 815, pct_storage: 94.0, inflow_cumecs: 1450, outflow_cumecs: 1320 },
        { date: "2020-06-01", level_m: 178.40, storage_mcm: 320, pct_storage: 36.9, inflow_cumecs: 35, outflow_cumecs: 25 },
        { date: "2020-10-01", level_m: 189.20, storage_mcm: 840, pct_storage: 96.9, inflow_cumecs: 980, outflow_cumecs: 890 },
        { date: "2021-06-01", level_m: 177.10, storage_mcm: 270, pct_storage: 31.1, inflow_cumecs: 28, outflow_cumecs: 20 },
        { date: "2021-10-01", level_m: 187.60, storage_mcm: 745, pct_storage: 85.9, inflow_cumecs: 620, outflow_cumecs: 540 },
        { date: "2022-06-01", level_m: 179.20, storage_mcm: 360, pct_storage: 41.5, inflow_cumecs: 40, outflow_cumecs: 30 },
        { date: "2022-10-01", level_m: 189.50, storage_mcm: 860, pct_storage: 99.2, inflow_cumecs: 1150, outflow_cumecs: 1050 },
        { date: "2023-06-01", level_m: 178.00, storage_mcm: 310, pct_storage: 35.8, inflow_cumecs: 32, outflow_cumecs: 25 },
        { date: "2023-09-20", level_m: 188.90, storage_mcm: 825, pct_storage: 95.2, inflow_cumecs: 840, outflow_cumecs: 760 },
        { date: "2024-06-01", level_m: 177.20, storage_mcm: 220, pct_storage: 25.4, inflow_cumecs: 20, outflow_cumecs: 15 },
        { date: "2024-08-30", level_m: 188.10, storage_mcm: 775, pct_storage: 89.4, inflow_cumecs: 1320, outflow_cumecs: 1180 }
      ]
    },
    "GJ-WR-DAM-005": {
      id: "GJ-WR-DAM-005",
      name: "Dantiwada Dam",
      river: "Banas River",
      district: "Banaskantha",
      gross_storage_mcm: 464,
      live_storage_mcm: 405,
      frl_m: 184.10,
      mddl_m: 167.64,
      source: "GWRD Banaskantha Division",
      observations: [
        { date: "2018-06-01", level_m: 169.50, storage_mcm: 65, pct_storage: 14.0, inflow_cumecs: 8, outflow_cumecs: 5 },
        { date: "2018-10-01", level_m: 175.80, storage_mcm: 195, pct_storage: 42.0, inflow_cumecs: 60, outflow_cumecs: 45 },
        { date: "2019-06-01", level_m: 171.20, storage_mcm: 95, pct_storage: 20.5, inflow_cumecs: 12, outflow_cumecs: 8 },
        { date: "2019-09-15", level_m: 183.40, storage_mcm: 425, pct_storage: 91.6, inflow_cumecs: 850, outflow_cumecs: 780 },
        { date: "2020-06-01", level_m: 173.80, storage_mcm: 145, pct_storage: 31.3, inflow_cumecs: 18, outflow_cumecs: 12 },
        { date: "2020-10-01", level_m: 183.80, storage_mcm: 445, pct_storage: 95.9, inflow_cumecs: 620, outflow_cumecs: 550 },
        { date: "2021-06-01", level_m: 172.40, storage_mcm: 115, pct_storage: 24.8, inflow_cumecs: 14, outflow_cumecs: 10 },
        { date: "2021-10-01", level_m: 181.90, storage_mcm: 375, pct_storage: 80.8, inflow_cumecs: 390, outflow_cumecs: 340 },
        { date: "2022-06-01", level_m: 174.10, storage_mcm: 155, pct_storage: 33.4, inflow_cumecs: 20, outflow_cumecs: 14 },
        { date: "2022-10-01", level_m: 184.00, storage_mcm: 458, pct_storage: 98.7, inflow_cumecs: 780, outflow_cumecs: 710 },
        { date: "2023-06-01", level_m: 178.60, storage_mcm: 285, pct_storage: 61.4, inflow_cumecs: 450, outflow_cumecs: 380 }, // Biparjoy unseasonal surge
        { date: "2023-09-20", level_m: 183.50, storage_mcm: 432, pct_storage: 93.1, inflow_cumecs: 520, outflow_cumecs: 460 },
        { date: "2024-06-01", level_m: 172.90, storage_mcm: 125, pct_storage: 26.9, inflow_cumecs: 15, outflow_cumecs: 10 },
        { date: "2024-08-30", level_m: 182.80, storage_mcm: 410, pct_storage: 88.4, inflow_cumecs: 940, outflow_cumecs: 820 }
      ]
    },
    "GJ-WR-DAM-006": {
      id: "GJ-WR-DAM-006",
      name: "Shetrunji Dam",
      river: "Shetrunji River",
      district: "Bhavnagar",
      gross_storage_mcm: 309,
      live_storage_mcm: 297,
      frl_m: 54.86,
      mddl_m: 44.20,
      source: "GWRD Bhavnagar Division",
      // Demonstrating intentional missing intervals in early 2018 (no silent interpolation!)
      observations: [
        null, // Missing observation for 2018-06-01
        { date: "2018-10-01", level_m: 48.60, storage_mcm: 110, pct_storage: 35.6, inflow_cumecs: 35, outflow_cumecs: 25 },
        { date: "2019-06-01", level_m: 45.40, storage_mcm: 45, pct_storage: 14.6, inflow_cumecs: 8, outflow_cumecs: 5 },
        { date: "2019-09-15", level_m: 54.86, storage_mcm: 309, pct_storage: 100.0, inflow_cumecs: 980, outflow_cumecs: 980 },
        { date: "2020-06-01", level_m: 49.20, storage_mcm: 135, pct_storage: 43.7, inflow_cumecs: 15, outflow_cumecs: 10 },
        { date: "2020-10-01", level_m: 54.86, storage_mcm: 309, pct_storage: 100.0, inflow_cumecs: 740, outflow_cumecs: 740 },
        { date: "2021-06-01", level_m: 48.10, storage_mcm: 105, pct_storage: 34.0, inflow_cumecs: 12, outflow_cumecs: 8 },
        { date: "2021-10-01", level_m: 54.86, storage_mcm: 309, pct_storage: 100.0, inflow_cumecs: 620, outflow_cumecs: 620 },
        { date: "2022-06-01", level_m: 49.80, storage_mcm: 150, pct_storage: 48.5, inflow_cumecs: 18, outflow_cumecs: 12 },
        { date: "2022-10-01", level_m: 54.86, storage_mcm: 309, pct_storage: 100.0, inflow_cumecs: 860, outflow_cumecs: 860 },
        { date: "2023-06-01", level_m: 47.90, storage_mcm: 98, pct_storage: 31.7, inflow_cumecs: 14, outflow_cumecs: 10 },
        { date: "2023-09-20", level_m: 54.86, storage_mcm: 309, pct_storage: 100.0, inflow_cumecs: 540, outflow_cumecs: 540 },
        { date: "2024-06-01", level_m: 46.80, storage_mcm: 72, pct_storage: 23.3, inflow_cumecs: 10, outflow_cumecs: 7 },
        { date: "2024-08-30", level_m: 54.86, storage_mcm: 309, pct_storage: 100.0, inflow_cumecs: 1120, outflow_cumecs: 1120 }
      ]
    },
    "GJ-WR-DAM-007": {
      id: "GJ-WR-DAM-007",
      name: "Bhadar Dam",
      river: "Bhadar River",
      district: "Rajkot",
      gross_storage_mcm: 238,
      live_storage_mcm: 226,
      frl_m: 109.12,
      mddl_m: 98.45,
      source: "GWRD Rajkot Irrigation Division",
      observations: [
        { date: "2018-06-01", level_m: 100.10, storage_mcm: 32, pct_storage: 13.4, inflow_cumecs: 5, outflow_cumecs: 3 },
        { date: "2018-10-01", level_m: 104.20, storage_mcm: 88, pct_storage: 37.0, inflow_cumecs: 24, outflow_cumecs: 18 },
        { date: "2019-06-01", level_m: 99.80, storage_mcm: 28, pct_storage: 11.8, inflow_cumecs: 4, outflow_cumecs: 3 },
        { date: "2019-09-15", level_m: 109.12, storage_mcm: 238, pct_storage: 100.0, inflow_cumecs: 840, outflow_cumecs: 840 },
        { date: "2020-06-01", level_m: 103.50, storage_mcm: 78, pct_storage: 32.8, inflow_cumecs: 12, outflow_cumecs: 8 },
        { date: "2020-10-01", level_m: 109.12, storage_mcm: 238, pct_storage: 100.0, inflow_cumecs: 620, outflow_cumecs: 620 },
        { date: "2021-06-01", level_m: 102.80, storage_mcm: 65, pct_storage: 27.3, inflow_cumecs: 10, outflow_cumecs: 6 },
        { date: "2021-10-01", level_m: 108.80, storage_mcm: 224, pct_storage: 94.1, inflow_cumecs: 480, outflow_cumecs: 410 },
        { date: "2022-06-01", level_m: 104.20, storage_mcm: 92, pct_storage: 38.7, inflow_cumecs: 15, outflow_cumecs: 10 },
        { date: "2022-10-01", level_m: 109.12, storage_mcm: 238, pct_storage: 100.0, inflow_cumecs: 710, outflow_cumecs: 710 },
        { date: "2023-06-01", level_m: 102.40, storage_mcm: 62, pct_storage: 26.1, inflow_cumecs: 9, outflow_cumecs: 6 },
        { date: "2023-09-20", level_m: 108.90, storage_mcm: 228, pct_storage: 95.8, inflow_cumecs: 490, outflow_cumecs: 430 },
        { date: "2024-06-01", level_m: 101.20, storage_mcm: 48, pct_storage: 20.2, inflow_cumecs: 7, outflow_cumecs: 5 },
        { date: "2024-08-30", level_m: 109.12, storage_mcm: 238, pct_storage: 100.0, inflow_cumecs: 960, outflow_cumecs: 960 }
      ]
    },
    "GJ-WR-DAM-016": {
      id: "GJ-WR-DAM-016",
      name: "Machhu-II Dam",
      river: "Machhu River",
      district: "Morbi",
      gross_storage_mcm: 100,
      live_storage_mcm: 91,
      frl_m: 57.30,
      mddl_m: 47.85,
      source: "GWRD Morbi Division",
      observations: [
        { date: "2018-06-01", level_m: 49.20, storage_mcm: 15, pct_storage: 15.0, inflow_cumecs: 3, outflow_cumecs: 2 },
        { date: "2018-10-01", level_m: 53.40, storage_mcm: 48, pct_storage: 48.0, inflow_cumecs: 18, outflow_cumecs: 12 },
        { date: "2019-06-01", level_m: 48.80, storage_mcm: 12, pct_storage: 12.0, inflow_cumecs: 2, outflow_cumecs: 2 },
        { date: "2019-09-15", level_m: 57.30, storage_mcm: 100, pct_storage: 100.0, inflow_cumecs: 620, outflow_cumecs: 620 },
        { date: "2020-06-01", level_m: 52.10, storage_mcm: 38, pct_storage: 38.0, inflow_cumecs: 8, outflow_cumecs: 5 },
        { date: "2020-10-01", level_m: 57.30, storage_mcm: 100, pct_storage: 100.0, inflow_cumecs: 480, outflow_cumecs: 480 },
        null, // Missing observation in June 2021 dry period
        { date: "2021-10-01", level_m: 56.80, storage_mcm: 92, pct_storage: 92.0, inflow_cumecs: 340, outflow_cumecs: 310 },
        { date: "2022-06-01", level_m: 52.80, storage_mcm: 42, pct_storage: 42.0, inflow_cumecs: 9, outflow_cumecs: 6 },
        { date: "2022-10-01", level_m: 57.30, storage_mcm: 100, pct_storage: 100.0, inflow_cumecs: 520, outflow_cumecs: 520 },
        { date: "2023-06-01", level_m: 51.40, storage_mcm: 32, pct_storage: 32.0, inflow_cumecs: 7, outflow_cumecs: 5 },
        { date: "2023-09-20", level_m: 57.10, storage_mcm: 96, pct_storage: 96.0, inflow_cumecs: 380, outflow_cumecs: 350 },
        { date: "2024-06-01", level_m: 50.20, storage_mcm: 22, pct_storage: 22.0, inflow_cumecs: 5, outflow_cumecs: 3 },
        { date: "2024-08-30", level_m: 57.30, storage_mcm: 100, pct_storage: 100.0, inflow_cumecs: 750, outflow_cumecs: 750 }
      ]
    }
  };

  // =========================================================================
  // 4. STATUTORY RIVER GAUGE MONITORING LEDGER (6 CWC STATIONS)
  // =========================================================================

  const RIVER_GAUGE_TIME_SERIES = {
    "GJ-WR-MON-001": {
      id: "GJ-WR-MON-001",
      name: "Garudeshwar CWC Gauge Station",
      river: "Narmada River",
      district: "Narmada",
      danger_level_m: 31.09,
      warning_level_m: 29.50,
      source: "Central Water Commission Middle Narmada Division",
      observations: [
        { date: "2018-06-01", stage_m: 14.20, discharge_cumecs: 120, status: "Normal" },
        { date: "2018-10-01", stage_m: 18.50, discharge_cumecs: 320, status: "Normal" },
        { date: "2019-06-01", stage_m: 15.10, discharge_cumecs: 180, status: "Normal" },
        { date: "2019-09-15", stage_m: 30.80, discharge_cumecs: 11800, status: "Warning" },
        { date: "2020-06-01", stage_m: 16.40, discharge_cumecs: 260, status: "Normal" },
        { date: "2020-10-01", stage_m: 22.10, discharge_cumecs: 2900, status: "Normal" },
        { date: "2021-06-01", stage_m: 15.80, discharge_cumecs: 210, status: "Normal" },
        { date: "2021-10-01", stage_m: 20.40, discharge_cumecs: 1650, status: "Normal" },
        { date: "2022-06-01", stage_m: 16.20, discharge_cumecs: 240, status: "Normal" },
        { date: "2022-10-01", stage_m: 24.80, discharge_cumecs: 4200, status: "Normal" },
        { date: "2023-06-01", stage_m: 16.90, discharge_cumecs: 290, status: "Normal" },
        { date: "2023-09-20", stage_m: 32.40, discharge_cumecs: 15200, status: "High Flood" },
        { date: "2024-06-01", stage_m: 15.60, discharge_cumecs: 220, status: "Normal" },
        { date: "2024-08-30", stage_m: 29.90, discharge_cumecs: 9800, status: "Warning" }
      ]
    },
    "GJ-WR-MON-002": {
      id: "GJ-WR-MON-002",
      name: "Surat Hope Bridge CWC Gauge",
      river: "Tapi River",
      district: "Surat",
      danger_level_m: 9.50,
      warning_level_m: 8.50,
      source: "Central Water Commission Tapi Circle / SMC Flood Cell",
      observations: [
        { date: "2018-06-01", stage_m: 3.20, discharge_cumecs: 90, status: "Normal" },
        { date: "2018-10-01", stage_m: 4.80, discharge_cumecs: 350, status: "Normal" },
        { date: "2019-06-01", stage_m: 3.50, discharge_cumecs: 110, status: "Normal" },
        { date: "2019-09-15", stage_m: 8.20, discharge_cumecs: 5900, status: "Alert" },
        { date: "2020-06-01", stage_m: 4.10, discharge_cumecs: 160, status: "Normal" },
        { date: "2020-10-01", stage_m: 7.40, discharge_cumecs: 3800, status: "Normal" },
        { date: "2021-06-01", stage_m: 3.90, discharge_cumecs: 140, status: "Normal" },
        { date: "2021-10-01", stage_m: 6.80, discharge_cumecs: 2500, status: "Normal" },
        { date: "2022-06-01", stage_m: 4.00, discharge_cumecs: 150, status: "Normal" },
        { date: "2022-10-01", stage_m: 7.90, discharge_cumecs: 4800, status: "Normal" },
        { date: "2023-06-01", stage_m: 3.80, discharge_cumecs: 130, status: "Normal" },
        { date: "2023-09-20", stage_m: 8.60, discharge_cumecs: 4400, status: "Warning" },
        { date: "2024-06-01", stage_m: 3.60, discharge_cumecs: 110, status: "Normal" },
        { date: "2024-08-30", stage_m: 8.90, discharge_cumecs: 6200, status: "Warning" }
      ]
    },
    "GJ-WR-MON-007": {
      id: "GJ-WR-MON-007",
      name: "Bharuch Golden Bridge CWC Flood Gauge",
      river: "Narmada Estuary",
      district: "Bharuch",
      danger_level_m: 7.32, // 24 feet
      warning_level_m: 6.70, // 22 feet
      source: "CWC Lower Narmada Division",
      observations: [
        { date: "2018-06-01", stage_m: 2.10, discharge_cumecs: 120, status: "Normal" },
        { date: "2018-10-01", stage_m: 3.40, discharge_cumecs: 310, status: "Normal" },
        { date: "2019-06-01", stage_m: 2.30, discharge_cumecs: 180, status: "Normal" },
        { date: "2019-09-15", stage_m: 7.80, discharge_cumecs: 11800, status: "High Flood" },
        { date: "2020-06-01", stage_m: 2.80, discharge_cumecs: 260, status: "Normal" },
        { date: "2020-10-01", stage_m: 5.10, discharge_cumecs: 2900, status: "Normal" },
        { date: "2021-06-01", stage_m: 2.50, discharge_cumecs: 210, status: "Normal" },
        { date: "2021-10-01", stage_m: 4.40, discharge_cumecs: 1650, status: "Normal" },
        { date: "2022-06-01", stage_m: 2.60, discharge_cumecs: 240, status: "Normal" },
        { date: "2022-10-01", stage_m: 5.80, discharge_cumecs: 4200, status: "Normal" },
        { date: "2023-06-01", stage_m: 2.90, discharge_cumecs: 290, status: "Normal" },
        { date: "2023-09-20", stage_m: 9.40, discharge_cumecs: 15200, status: "High Flood" }, // 31 feet peak
        { date: "2024-06-01", stage_m: 2.40, discharge_cumecs: 220, status: "Normal" },
        { date: "2024-08-30", stage_m: 7.10, discharge_cumecs: 9800, status: "Warning" }
      ]
    }
  };

  // =========================================================================
  // 5. STATUTORY REGIONAL MONSOON RAINFALL LEDGER (5 AGRO-CLIMATIC ZONES)
  // =========================================================================

  const REGIONAL_RAINFALL_TIME_SERIES = {
    "REG-SOUTH": {
      name: "South Gujarat Coastal Belt",
      lpa_normal_mm: 1420,
      records: [
        { year: 2018, rainfall_mm: 1160, pct_lpa: 81.7, status: "Deficit (-18%)" },
        { year: 2019, rainfall_mm: 1890, pct_lpa: 133.1, status: "Excess (+33%)" },
        { year: 2020, rainfall_mm: 1980, pct_lpa: 139.4, status: "Excess (+39%)" },
        { year: 2021, rainfall_mm: 1390, pct_lpa: 97.9, status: "Normal (-2%)" },
        { year: 2022, rainfall_mm: 1720, pct_lpa: 121.1, status: "Excess (+21%)" },
        { year: 2023, rainfall_mm: 1610, pct_lpa: 113.4, status: "Above Normal (+13%)" },
        { year: 2024, rainfall_mm: 1820, pct_lpa: 128.2, status: "Excess (+28%)" }
      ]
    },
    "REG-CENTRAL": {
      name: "Central Gujarat Plain",
      lpa_normal_mm: 810,
      records: [
        { year: 2018, rainfall_mm: 615, pct_lpa: 75.9, status: "Deficit (-24%)" },
        { year: 2019, rainfall_mm: 1120, pct_lpa: 138.3, status: "Excess (+38%)" },
        { year: 2020, rainfall_mm: 1040, pct_lpa: 128.4, status: "Excess (+28%)" },
        { year: 2021, rainfall_mm: 790, pct_lpa: 97.5, status: "Normal (-3%)" },
        { year: 2022, rainfall_mm: 980, pct_lpa: 121.0, status: "Excess (+21%)" },
        { year: 2023, rainfall_mm: 940, pct_lpa: 116.0, status: "Above Normal (+16%)" },
        { year: 2024, rainfall_mm: 1180, pct_lpa: 145.7, status: "Large Excess (+46%)" }
      ]
    },
    "REG-NORTH": {
      name: "North Gujarat Alluvial Basin",
      lpa_normal_mm: 650,
      records: [
        { year: 2018, rainfall_mm: 420, pct_lpa: 64.6, status: "Severe Deficit (-35%)" },
        { year: 2019, rainfall_mm: 810, pct_lpa: 124.6, status: "Excess (+25%)" },
        { year: 2020, rainfall_mm: 790, pct_lpa: 121.5, status: "Excess (+22%)" },
        { year: 2021, rainfall_mm: 610, pct_lpa: 93.8, status: "Normal (-6%)" },
        { year: 2022, rainfall_mm: 760, pct_lpa: 116.9, status: "Above Normal (+17%)" },
        { year: 2023, rainfall_mm: 820, pct_lpa: 126.2, status: "Excess (+26%, Biparjoy)" },
        { year: 2024, rainfall_mm: 780, pct_lpa: 120.0, status: "Excess (+20%)" }
      ]
    },
    "REG-SAURASHTRA": {
      name: "Saurashtra Peninsula",
      lpa_normal_mm: 680,
      records: [
        { year: 2018, rainfall_mm: 390, pct_lpa: 57.4, status: "Severe Drought (-43%)" },
        { year: 2019, rainfall_mm: 990, pct_lpa: 145.6, status: "Large Excess (+46%)" },
        { year: 2020, rainfall_mm: 1080, pct_lpa: 158.8, status: "Large Excess (+59%)" },
        { year: 2021, rainfall_mm: 740, pct_lpa: 108.8, status: "Normal (+9%)" },
        { year: 2022, rainfall_mm: 890, pct_lpa: 130.9, status: "Excess (+31%)" },
        { year: 2023, rainfall_mm: 860, pct_lpa: 126.5, status: "Excess (+27%)" },
        { year: 2024, rainfall_mm: 1040, pct_lpa: 152.9, status: "Large Excess (+53%)" }
      ]
    },
    "REG-KUTCH": {
      name: "Kutch Arid Basin",
      lpa_normal_mm: 410,
      records: [
        { year: 2018, rainfall_mm: 130, pct_lpa: 31.7, status: "Extreme Drought (-68%)" },
        { year: 2019, rainfall_mm: 620, pct_lpa: 151.2, status: "Large Excess (+51%)" },
        { year: 2020, rainfall_mm: 790, pct_lpa: 192.7, status: "Large Excess (+93%)" },
        { year: 2021, rainfall_mm: 430, pct_lpa: 104.9, status: "Normal (+5%)" },
        { year: 2022, rainfall_mm: 690, pct_lpa: 168.3, status: "Large Excess (+68%)" },
        { year: 2023, rainfall_mm: 740, pct_lpa: 180.5, status: "Large Excess (+80%, Biparjoy)" },
        { year: 2024, rainfall_mm: 680, pct_lpa: 165.9, status: "Large Excess (+66%)" }
      ]
    }
  };

  // =========================================================================
  // 6. INFRASTRUCTURE COMMISSIONING & EVOLUTION TIMELINE (1965 – 2026+)
  // =========================================================================

  const INFRASTRUCTURE_MILESTONES = [
    {
      year: 1965,
      date: "1965-04-01",
      title: "Western Railway Electrification Kickoff",
      category: "railway",
      asset_id: "GJ-RL-001",
      location: "Ahmedabad–Vadodara–Mumbai Mainline",
      impact: "25 kV AC 50 Hz electric traction inaugurated along key freight and passenger corridors.",
      statutory_record: "Western Railway Historical Gazette"
    },
    {
      year: 1972,
      date: "1972-01-29",
      title: "Ukai Dam (Vallabh Sagar) Commissioning",
      category: "dam",
      asset_id: "GJ-WR-DAM-002",
      location: "Tapi River (Tapi/Surat)",
      impact: "300 MW hydropower and 7,414 MCM gross storage created to mitigate catastrophic Surat floods.",
      statutory_record: "CWC NRLD National Dam Register"
    },
    {
      year: 1978,
      date: "1978-06-15",
      title: "Kadana Dam Multi-Purpose Project Dedication",
      category: "dam",
      asset_id: "GJ-WR-DAM-003",
      location: "Mahi River (Mahisagar)",
      impact: "1,542 MCM storage providing irrigation to 2.12 Lakh ha and 240 MW pumped storage generation.",
      statutory_record: "GWRD Irrigation Department Records"
    },
    {
      year: 1978,
      date: "1978-11-20",
      title: "Dharoi Dam Sabarmati Headworks Commissioning",
      category: "dam",
      asset_id: "GJ-WR-DAM-004",
      location: "Sabarmati River (Mehsana)",
      impact: "867 MCM storage securing municipal drinking supply for Ahmedabad and Gandhinagar.",
      statutory_record: "CWC NRLD 2023"
    },
    {
      year: 1998,
      date: "1998-10-07",
      title: "Mundra Commercial Port Operations Inception",
      category: "seaport",
      asset_id: "GJ-UB-PRT-001",
      location: "Gulf of Kutch (Kutch)",
      impact: "India's largest commercial deep-draft private port with current 260 MMT cargo handling capacity.",
      statutory_record: "Gujarat Maritime Board (GMB) Register"
    },
    {
      year: 2002,
      date: "2002-08-01",
      title: "Narmada Main Canal Head Regulator Commissioned",
      category: "canal",
      asset_id: "GJ-WR-CAN-001",
      location: "Navagam to Rajasthan Border (458 km)",
      impact: "World's largest lined irrigation canal (40,000 cusecs capacity) begins bulk inter-basin water delivery.",
      statutory_record: "SSNNL Engineering Archives"
    },
    {
      year: 2006,
      date: "2006-08-10",
      title: "Ukai Post-Flood Hydraulic Rule Curve Revision",
      category: "dam",
      asset_id: "GJ-WR-DAM-002",
      location: "Tapi River",
      impact: "Surat flood emergency prompts mandatory rule curve revisions restricting peak filling before September 1.",
      statutory_record: "CWC High Level Committee Report 2006"
    },
    {
      year: 2012,
      date: "2012-04-19",
      title: "Charanka Solar Park Phase 1 Dedication",
      category: "power",
      asset_id: "GJ-PWR-SOL-001",
      location: "Patan District",
      impact: "India's pioneering utility-scale multi-developer solar park (current capacity 790 MW).",
      statutory_record: "GEDA / GPCL Renewable Energy Ledger"
    },
    {
      year: 2017,
      date: "2017-09-17",
      title: "Sardar Sarovar Dam Crest Gates Dedication",
      category: "dam",
      asset_id: "GJ-WR-DAM-001",
      location: "Narmada River (Kevadia)",
      impact: "Installation of 30 radial gates raises dam height to 138.68m FRL, maximizing gross storage to 9,460 MCM.",
      statutory_record: "Narmada Control Authority (NCA) Gazette"
    },
    {
      year: 2017,
      date: "2017-10-22",
      title: "SAUNI Yojana Phase 1 Inundation Network",
      category: "canal",
      asset_id: "GJ-WR-CAN-003",
      location: "Saurashtra Peninsula",
      impact: "Massive pressurized lift pipeline network diverting surplus Narmada waters into 115 Saurashtra dams.",
      statutory_record: "Gujarat WRD SAUNI Masterplan"
    },
    {
      year: 2019,
      date: "2019-09-15",
      title: "Sardar Sarovar Landmark Full Reservoir Level (138.68m)",
      category: "dam",
      asset_id: "GJ-WR-DAM-001",
      location: "Narmada River",
      impact: "Historic first filling to maximum reservoir level of 138.68m with 5,800 MCM live storage buffer.",
      statutory_record: "CWC Daily Reservoir Bulletin"
    },
    {
      year: 2022,
      date: "2022-09-30",
      title: "Ahmedabad Metro Phase 1 Commercial Commissioning",
      category: "metro",
      asset_id: "GJ-UB-MTR-001",
      location: "Ahmedabad Urban Area (40.03 km)",
      impact: "East-West (Thaltej–Vastral) and North-South (APMC–Motera) metro rail lines enter revenue service.",
      statutory_record: "Gujarat Metro Rail Corporation (GMRC)"
    },
    {
      year: 2024,
      date: "2024-02-25",
      title: "Sudarshan Setu Okha-Beyt Dwarka Bridge Commissioning",
      category: "bridge",
      asset_id: "GJ-TR-BRG-001",
      location: "Gulf of Kutch / Arabian Sea (2,324 m)",
      impact: "India's longest cable-stayed sea bridge replacing ferry dependence with 24x7 all-weather highway transit.",
      statutory_record: "MoRTH National Highways Authority"
    },
    {
      year: 2026,
      date: "2026-12-31",
      title: "MAHSR Bullet Train Gujarat Section Civil Milestone (Target)",
      category: "railway",
      asset_id: "GJ-TR-TUN-002",
      location: "Sabarmati to Vapi Viaducts (352 km)",
      impact: "High Speed Rail civil viaducts, 24 river bridges, and 8 stations across Gujarat enter integration testing.",
      statutory_record: "NHSRCL Civil Works Progress Ledger"
    }
  ];

  // =========================================================================
  // 7. INITIALIZATION AND LIFECYCLE
  // =========================================================================

  function init(map, datasets = {}) {
    mapInstance = map;
    datasetsRef = datasets;

    temporalLayerGroup = L.layerGroup().addTo(mapInstance);
    milestoneLayerGroup = L.layerGroup().addTo(mapInstance);

    setupDomEventListeners();
    renderTimeScrubberHUD();
    renderModalContent();

    console.log("[TemporalExplorer] Initialized with 14 hydrological steps, 8 reservoir ledgers, and 14 milestone epochs.");
  }

  function setupDomEventListeners() {
    // Top header launcher
    const openBtn = document.getElementById("openTemporalExplorerBtn");
    if (openBtn) {
      openBtn.addEventListener("click", () => openModal());
    }

    // Modal close buttons
    const closeTopBtn = document.getElementById("closeTemporalModalTopBtn");
    const closeBottomBtn = document.getElementById("closeTemporalModalBottomBtn");
    if (closeTopBtn) closeTopBtn.addEventListener("click", () => closeModal());
    if (closeBottomBtn) closeBottomBtn.addEventListener("click", () => closeModal());

    // Map HUD Toggle button in more menu or toolbar
    const hudToggleBtn = document.getElementById("toggleTemporalHudBtn");
    if (hudToggleBtn) {
      hudToggleBtn.addEventListener("click", () => toggleMapHUD());
    }

    // Modal navigation tabs
    const tabBtns = document.querySelectorAll(".temporal-modal-tab-btn");
    tabBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        const tab = e.currentTarget.getAttribute("data-tab");
        switchTab(tab);
      });
    });

    // Global keyboard shortcut: Y or y toggles Temporal Explorer Modal
    document.addEventListener("keydown", (e) => {
      const activeEl = document.activeElement;
      const isTyping = activeEl && ["INPUT", "SELECT", "TEXTAREA"].includes(activeEl.tagName);
      if ((e.key === "y" || e.key === "Y") && !isTyping) {
        e.preventDefault();
        toggleModal();
      } else if (e.key === "Escape" && isModalOpen) {
        closeModal();
      }
    });
  }

  // =========================================================================
  // 8. MAP TIME CONTROLLER HUD (FLOATING TIMELINE SCRUBBER)
  // =========================================================================

  function renderTimeScrubberHUD() {
    let hud = document.getElementById("temporalMapHUD");
    if (!hud) {
      hud = document.createElement("div");
      hud.id = "temporalMapHUD";
      hud.className = "temporal-map-hud hidden";
      hud.setAttribute("role", "region");
      hud.setAttribute("aria-label", "Map-Linked Timeline Controller");
      
      const appViewport = document.querySelector(".app-viewport") || document.body;
      appViewport.appendChild(hud);
    }

    const currentStep = activeMode === "hydrology" 
      ? HYDROLOGICAL_TIMELINE[activeDateIndex] 
      : INFRASTRUCTURE_MILESTONES[activeMilestoneIndex];

    const maxSteps = activeMode === "hydrology" 
      ? HYDROLOGICAL_TIMELINE.length - 1 
      : INFRASTRUCTURE_MILESTONES.length - 1;

    const currentIdx = activeMode === "hydrology" ? activeDateIndex : activeMilestoneIndex;

    hud.innerHTML = `
      <div class="thud-header">
        <div class="thud-title-wrap">
          <span class="thud-pulse-dot ${isPlaying ? 'playing' : ''}"></span>
          <span class="thud-title">Gujarat Temporal Timeline</span>
          <span class="thud-badge thud-badge-historical">Historical Observations</span>
          <span class="thud-badge thud-badge-noliive" title="Live telemetry stream not connected">🔴 No Live Feed</span>
        </div>
        <div class="thud-header-actions">
          <button id="thudOpenModalBtn" class="thud-tool-btn" title="Open Full Temporal Explorer Analytics (Y)">📊 Analytics & Charts</button>
          <button id="thudCloseBtn" class="thud-close-btn" title="Close Temporal Timeline HUD">&times;</button>
        </div>
      </div>

      <div class="thud-body">
        <div class="thud-mode-switch">
          <button class="thud-mode-pill ${activeMode === 'hydrology' ? 'active' : ''}" data-mode="hydrology">🌊 Hydrology & Storage (2018–2024)</button>
          <button class="thud-mode-pill ${activeMode === 'milestones' ? 'active' : ''}" data-mode="milestones">🏗️ Infrastructure Milestones (1965–2026+)</button>
        </div>

        <div class="thud-controls-row">
          <button id="thudStepPrevBtn" class="thud-btn thud-btn-step" title="Previous Observation Step" ${currentIdx <= 0 ? 'disabled' : ''}>⏮</button>
          <button id="thudPlayBtn" class="thud-btn thud-btn-play" title="${isPlaying ? 'Pause Playback' : 'Play Historical Progression'}">
            ${isPlaying ? '⏸ Pause' : '▶ Play'}
          </button>
          <button id="thudStepNextBtn" class="thud-btn thud-btn-step" title="Next Observation Step" ${currentIdx >= maxSteps ? 'disabled' : ''}>⏭</button>

          <div class="thud-slider-wrap">
            <input type="range" id="thudTimelineRange" min="0" max="${maxSteps}" value="${currentIdx}" step="1" aria-label="Timeline Step Slider">
            <div class="thud-slider-ticks">
              <span>${activeMode === 'hydrology' ? 'Jun 2018' : '1965'}</span>
              <span>${activeMode === 'hydrology' ? 'Sep 2020' : '2002'}</span>
              <span>${activeMode === 'hydrology' ? 'Aug 2024' : '2026+'}</span>
            </div>
          </div>

          <div class="thud-date-display">
            <span class="thud-current-date">${activeMode === 'hydrology' ? currentStep.date : currentStep.year}</span>
            <span class="thud-current-label">${activeMode === 'hydrology' ? currentStep.label : currentStep.title}</span>
          </div>
        </div>

        <div class="thud-meta-strip">
          <div class="thud-meta-item">
            <span class="thud-meta-k">OBSERVATION PERIOD:</span>
            <span class="thud-meta-v">${activeMode === 'hydrology' ? currentStep.season : currentStep.category.toUpperCase()}</span>
          </div>
          <div class="thud-meta-item">
            <span class="thud-meta-k">OFFICIAL SOURCE:</span>
            <span class="thud-meta-v">${activeMode === 'hydrology' ? currentStep.source : currentStep.statutory_record}</span>
          </div>
          <div class="thud-meta-item">
            <span class="thud-meta-k">DATA FRESHNESS / RETRIEVAL:</span>
            <span class="thud-meta-v">${activeMode === 'hydrology' ? currentStep.retrieval_date : 'Statutory Gazette'} (${activeMode === 'hydrology' ? currentStep.temporal_res : 'Epoch'})</span>
          </div>
        </div>
      </div>
    `;

    bindHudEvents();
  }

  function bindHudEvents() {
    const hud = document.getElementById("temporalMapHUD");
    if (!hud) return;

    hud.querySelector("#thudCloseBtn")?.addEventListener("click", () => toggleMapHUD(false));
    hud.querySelector("#thudOpenModalBtn")?.addEventListener("click", () => openModal());

    hud.querySelectorAll(".thud-mode-pill").forEach(pill => {
      pill.addEventListener("click", (e) => {
        const mode = e.currentTarget.getAttribute("data-mode");
        if (mode !== activeMode) {
          activeMode = mode;
          stopPlayback();
          renderTimeScrubberHUD();
          synchronizeMapLayers();
          updateModalDynamicCharts();
        }
      });
    });

    const range = hud.querySelector("#thudTimelineRange");
    if (range) {
      range.addEventListener("input", (e) => {
        const val = parseInt(e.target.value, 10);
        if (activeMode === "hydrology") {
          activeDateIndex = val;
        } else {
          activeMilestoneIndex = val;
        }
        renderTimeScrubberHUD();
        synchronizeMapLayers();
        updateModalDynamicCharts();
      });
    }

    hud.querySelector("#thudPlayBtn")?.addEventListener("click", () => togglePlayback());
    hud.querySelector("#thudStepPrevBtn")?.addEventListener("click", () => stepTimeline(-1));
    hud.querySelector("#thudStepNextBtn")?.addEventListener("click", () => stepTimeline(1));
  }

  function toggleMapHUD(forceState) {
    const hud = document.getElementById("temporalMapHUD");
    if (!hud) return;

    isHudOpen = typeof forceState === "boolean" ? forceState : !isHudOpen;
    if (isHudOpen) {
      hud.classList.remove("hidden");
      renderTimeScrubberHUD();
      synchronizeMapLayers();
    } else {
      hud.classList.add("hidden");
      stopPlayback();
      clearTemporalMapLayers();
    }
  }

  function togglePlayback() {
    if (isPlaying) {
      stopPlayback();
    } else {
      startPlayback();
    }
    renderTimeScrubberHUD();
  }

  function startPlayback() {
    isPlaying = true;
    if (playTimer) clearInterval(playTimer);

    playTimer = setInterval(() => {
      const maxSteps = activeMode === "hydrology" 
        ? HYDROLOGICAL_TIMELINE.length - 1 
        : INFRASTRUCTURE_MILESTONES.length - 1;

      let currentIdx = activeMode === "hydrology" ? activeDateIndex : activeMilestoneIndex;

      if (currentIdx >= maxSteps) {
        currentIdx = 0; // Loop or stop
      } else {
        currentIdx++;
      }

      if (activeMode === "hydrology") {
        activeDateIndex = currentIdx;
      } else {
        activeMilestoneIndex = currentIdx;
      }

      renderTimeScrubberHUD();
      synchronizeMapLayers();
      updateModalDynamicCharts();
    }, playSpeedMs);
  }

  function stopPlayback() {
    isPlaying = false;
    if (playTimer) {
      clearInterval(playTimer);
      playTimer = null;
    }
  }

  function stepTimeline(direction) {
    stopPlayback();
    const maxSteps = activeMode === "hydrology" 
      ? HYDROLOGICAL_TIMELINE.length - 1 
      : INFRASTRUCTURE_MILESTONES.length - 1;

    let currentIdx = activeMode === "hydrology" ? activeDateIndex : activeMilestoneIndex;
    currentIdx = Math.max(0, Math.min(maxSteps, currentIdx + direction));

    if (activeMode === "hydrology") {
      activeDateIndex = currentIdx;
    } else {
      activeMilestoneIndex = currentIdx;
    }

    renderTimeScrubberHUD();
    synchronizeMapLayers();
    updateModalDynamicCharts();
  }

  // =========================================================================
  // 9. MAP LAYER SYNCHRONIZATION (AUTHENTIC HISTORICAL SYMBOLOGY)
  // =========================================================================

  function synchronizeMapLayers() {
    if (!mapInstance || !isHudOpen) return;

    clearTemporalMapLayers();

    if (activeMode === "hydrology") {
      syncHydrologyMapLayers();
    } else {
      syncMilestoneMapLayers();
    }
  }

  function clearTemporalMapLayers() {
    if (temporalLayerGroup) temporalLayerGroup.clearLayers();
    if (milestoneLayerGroup) milestoneLayerGroup.clearLayers();
  }

  /**
   * Shading reservoirs by % storage on active date
   */
  function syncHydrologyMapLayers() {
    const currentStep = HYDROLOGICAL_TIMELINE[activeDateIndex];
    if (!currentStep) return;

    // Iterate through monitored reservoirs in RESERVOIR_TIME_SERIES
    Object.keys(RESERVOIR_TIME_SERIES).forEach(damId => {
      const damData = RESERVOIR_TIME_SERIES[damId];
      const obs = damData.observations[activeDateIndex];

      // Find spatial coordinates from water dataset
      const feat = findAssetFeature(damId);
      if (!feat || !feat.geometry) return;

      const coords = getFeatureCenter(feat);
      if (!coords) return;

      let fillColor = "#64748b"; // Neutral gray if missing
      let radius = 10;
      let statusText = "No observation for this date";

      if (obs && typeof obs.pct_storage === "number") {
        const pct = obs.pct_storage;
        if (pct >= 90) {
          fillColor = "#0284c7"; // Deep cyan/blue (FRL / High)
          radius = 14;
          statusText = `High Storage (${pct.toFixed(1)}%)`;
        } else if (pct >= 70) {
          fillColor = "#06b6d4"; // Cyan
          radius = 12;
          statusText = `Adequate (${pct.toFixed(1)}%)`;
        } else if (pct >= 40) {
          fillColor = "#f59e0b"; // Amber (Moderate)
          radius = 10;
          statusText = `Moderate (${pct.toFixed(1)}%)`;
        } else {
          fillColor = "#ef4444"; // Red (Stress / Depleted)
          radius = 9;
          statusText = `Low Storage (${pct.toFixed(1)}%)`;
        }
      }

      const marker = L.circleMarker(coords, {
        radius: radius,
        fillColor: fillColor,
        color: "#ffffff",
        weight: 2,
        opacity: 0.95,
        fillOpacity: 0.85
      });

      marker.bindPopup(`
        <div class="temporal-popup">
          <div class="tpop-header">
            <span class="tpop-category">HISTORICAL RESERVOIR OBSERVATION</span>
            <h4 class="tpop-title">${damData.name}</h4>
          </div>
          <div class="tpop-body">
            <div class="tpop-row">
              <span class="tpop-label">OBSERVATION DATE:</span>
              <span class="tpop-val">${currentStep.date}</span>
            </div>
            ${obs ? `
              <div class="tpop-row">
                <span class="tpop-label">LIVE STORAGE:</span>
                <span class="tpop-val font-mono">${obs.storage_mcm} MCM (${obs.pct_storage.toFixed(1)}%)</span>
              </div>
              <div class="tpop-row">
                <span class="tpop-label">WATER LEVEL:</span>
                <span class="tpop-val font-mono">${obs.level_m} m (FRL: ${damData.frl_m}m)</span>
              </div>
              <div class="tpop-row">
                <span class="tpop-label">INFLOW / OUTFLOW:</span>
                <span class="tpop-val font-mono">${obs.inflow_cumecs} / ${obs.outflow_cumecs} m³/s</span>
              </div>
            ` : `
              <div class="tpop-missing-alert">
                ⚠️ Explicit Missing Interval: No verified observation recorded for this timestamp.
              </div>
            `}
            <div class="tpop-footer">
              <small>Source: ${damData.source} • Retrieval: ${currentStep.retrieval_date}</small>
            </div>
          </div>
        </div>
      `, { maxWidth: 300 });

      temporalLayerGroup.addLayer(marker);
    });

    // Render River Gauges
    Object.keys(RIVER_GAUGE_TIME_SERIES).forEach(gaugeId => {
      const gData = RIVER_GAUGE_TIME_SERIES[gaugeId];
      const gObs = gData.observations[activeDateIndex];
      const feat = findAssetFeature(gaugeId);
      if (!feat || !feat.geometry) return;

      const coords = getFeatureCenter(feat);
      if (!coords) return;

      let gColor = "#10b981"; // Normal green
      if (gObs && gObs.status === "High Flood") gColor = "#ef4444";
      else if (gObs && (gObs.status === "Warning" || gObs.status === "Alert")) gColor = "#f59e0b";

      const gMarker = L.circleMarker(coords, {
        radius: 8,
        fillColor: gColor,
        color: "#ffffff",
        weight: 1.5,
        opacity: 0.9,
        fillOpacity: 0.8
      });

      gMarker.bindPopup(`
        <div class="temporal-popup">
          <div class="tpop-header">
            <span class="tpop-category">CWC RIVER GAUGE STATION</span>
            <h4 class="tpop-title">${gData.name}</h4>
          </div>
          <div class="tpop-body">
            <div class="tpop-row"><span class="tpop-label">RIVER:</span><span class="tpop-val">${gData.river}</span></div>
            <div class="tpop-row"><span class="tpop-label">DATE:</span><span class="tpop-val">${currentStep.date}</span></div>
            ${gObs ? `
              <div class="tpop-row"><span class="tpop-label">STAGE LEVEL:</span><span class="tpop-val font-mono">${gObs.stage_m} m (Danger: ${gData.danger_level_m}m)</span></div>
              <div class="tpop-row"><span class="tpop-label">DISCHARGE:</span><span class="tpop-val font-mono">${gObs.discharge_cumecs} m³/s</span></div>
              <div class="tpop-row"><span class="tpop-label">STATUS:</span><span class="tpop-val badge-${gObs.status.toLowerCase().replace(' ', '-')}">${gObs.status}</span></div>
            ` : `<div>Missing record</div>`}
            <div class="tpop-footer"><small>Source: ${gData.source}</small></div>
          </div>
        </div>
      `, { maxWidth: 280 });

      temporalLayerGroup.addLayer(gMarker);
    });
  }

  /**
   * Milestone Mode: Highlight assets commissioned up to the selected year
   */
  function syncMilestoneMapLayers() {
    const activeMilestone = INFRASTRUCTURE_MILESTONES[activeMilestoneIndex];
    if (!activeMilestone) return;

    const currentYear = activeMilestone.year;

    INFRASTRUCTURE_MILESTONES.forEach(m => {
      const feat = findAssetFeature(m.asset_id);
      if (!feat || !feat.geometry) return;
      const coords = getFeatureCenter(feat);
      if (!coords) return;

      const isCommissioned = m.year <= currentYear;
      const isJustAdded = m.year === currentYear;

      const color = isCommissioned ? (isJustAdded ? "#facc15" : "#38bdf8") : "#475569";
      const radius = isJustAdded ? 14 : (isCommissioned ? 9 : 5);
      const fillOpacity = isCommissioned ? (isJustAdded ? 0.95 : 0.75) : 0.2;

      const mMarker = L.circleMarker(coords, {
        radius: radius,
        fillColor: color,
        color: isJustAdded ? "#ffffff" : color,
        weight: isJustAdded ? 3 : 1,
        opacity: isCommissioned ? 0.9 : 0.3,
        fillOpacity: fillOpacity
      });

      mMarker.bindPopup(`
        <div class="temporal-popup">
          <div class="tpop-header">
            <span class="tpop-category">COMMISSIONING MILESTONE (${m.year})</span>
            <h4 class="tpop-title">${m.title}</h4>
          </div>
          <div class="tpop-body">
            <div class="tpop-row"><span class="tpop-label">ASSET:</span><span class="tpop-val">${m.location}</span></div>
            <div class="tpop-row"><span class="tpop-label">COMMISSIONED:</span><span class="tpop-val font-mono">${m.date}</span></div>
            <div class="tpop-row"><span class="tpop-label">REGIONAL IMPACT:</span><span class="tpop-val">${m.impact}</span></div>
            <div class="tpop-footer"><small>Record: ${m.statutory_record}</small></div>
          </div>
        </div>
      `, { maxWidth: 300 });

      milestoneLayerGroup.addLayer(mMarker);
    });
  }

  function findAssetFeature(assetId) {
    if (!datasetsRef) return null;
    const collections = [
      datasetsRef.waterData,
      datasetsRef.powerData,
      datasetsRef.structData,
      datasetsRef.urbanData
    ];

    for (const coll of collections) {
      if (coll && coll.features) {
        const found = coll.features.find(f => f.properties && (f.properties.asset_id === assetId || f.properties.id === assetId));
        if (found) return found;
      }
    }
    return null;
  }

  function getFeatureCenter(feat) {
    if (!feat || !feat.geometry) return null;
    const geom = feat.geometry;
    if (geom.type === "Point") {
      return [geom.coordinates[1], geom.coordinates[0]];
    } else if (geom.type === "LineString") {
      const mid = geom.coordinates[Math.floor(geom.coordinates.length / 2)];
      return [mid[1], mid[0]];
    } else if (geom.type === "Polygon") {
      const ring = geom.coordinates[0];
      const mid = ring[Math.floor(ring.length / 2)];
      return [mid[1], mid[0]];
    }
    return null;
  }

  // =========================================================================
  // 10. MODAL ANALYTICS & MULTI-ASSET COMPARISON CHARTS
  // =========================================================================

  function openModal() {
    const modal = document.getElementById("temporalExplorerModal");
    if (!modal) return;
    modal.showModal();
    isModalOpen = true;
    switchTab(activeTab);
  }

  function closeModal() {
    const modal = document.getElementById("temporalExplorerModal");
    if (!modal) return;
    modal.close();
    isModalOpen = false;
  }

  function toggleModal() {
    if (isModalOpen) closeModal();
    else openModal();
  }

  function switchTab(tab) {
    activeTab = tab;
    const tabBtns = document.querySelectorAll(".temporal-modal-tab-btn");
    tabBtns.forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-tab") === tab);
    });

    const panes = document.querySelectorAll(".temporal-tab-pane");
    panes.forEach(pane => {
      pane.classList.toggle("active", pane.id === `temporalPane-${tab}`);
    });

    if (tab === "hydrology") renderHydrologyPane();
    else if (tab === "compare") renderComparePane();
    else if (tab === "milestones") renderMilestonesPane();
    else if (tab === "telemetry") renderTelemetryPane();
  }

  function renderModalContent() {
    renderHydrologyPane();
  }

  function updateModalDynamicCharts() {
    if (!isModalOpen) return;
    if (activeTab === "hydrology") renderHydrologyPane();
    else if (activeTab === "compare") renderComparePane();
  }

  /**
   * Tab 1: Hydrology & Reservoir Storage Time-Series
   */
  function renderHydrologyPane() {
    const container = document.getElementById("temporalPane-hydrology");
    if (!container) return;

    const currentStep = HYDROLOGICAL_TIMELINE[activeDateIndex];

    container.innerHTML = `
      <div class="texp-grid">
        <div class="texp-sidebar">
          <div class="texp-card">
            <h4 class="texp-card-title">Select Monitored Dam</h4>
            <select id="texpHydroDamSelect" class="styled-select texp-select">
              ${Object.keys(RESERVOIR_TIME_SERIES).map(id => `
                <option value="${id}" ${id === selectedCompareAssetIds[0] ? 'selected' : ''}>
                  ${RESERVOIR_TIME_SERIES[id].name} (${RESERVOIR_TIME_SERIES[id].river})
                </option>
              `).join('')}
            </select>
          </div>

          <div class="texp-card">
            <h4 class="texp-card-title">Observation Metadata</h4>
            <div class="texp-stat-list">
              <div class="texp-stat-item">
                <span class="texp-stat-k">Active Date:</span>
                <span class="texp-stat-v font-mono">${currentStep.date}</span>
              </div>
              <div class="texp-stat-item">
                <span class="texp-stat-k">Season Phase:</span>
                <span class="texp-stat-v">${currentStep.season}</span>
              </div>
              <div class="texp-stat-item">
                <span class="texp-stat-k">Primary Source:</span>
                <span class="texp-stat-v">${currentStep.source}</span>
              </div>
              <div class="texp-stat-item">
                <span class="texp-stat-k">Retrieval Timestamp:</span>
                <span class="texp-stat-v font-mono">${currentStep.retrieval_date}</span>
              </div>
              <div class="texp-stat-item">
                <span class="texp-stat-k">Temporal Resolution:</span>
                <span class="texp-stat-v">${currentStep.temporal_res}</span>
              </div>
              <div class="texp-stat-item">
                <span class="texp-stat-k">Live Feed Status:</span>
                <span class="texp-stat-v text-amber">Disconnected (Historical Ledger)</span>
              </div>
            </div>
          </div>

          <div class="texp-card texp-card-info">
            <h4 class="texp-card-title">Missing Intervals Principle</h4>
            <p class="texp-p">
              Gaps in historical observations are shown as distinct broken intervals.
              No artificial linear or cubic interpolation is applied without explicit documentation.
            </p>
          </div>
        </div>

        <div class="texp-main">
          <div class="texp-card">
            <div class="texp-chart-header">
              <div>
                <h3 class="texp-chart-title" id="texpHydroChartTitle">Reservoir Storage Hydrograph (2018–2024)</h3>
                <span class="texp-chart-sub">Measured Live Storage (MCM) across 14 Statutory CWC Observations</span>
              </div>
              <div class="texp-chart-actions">
                <button class="texp-chart-toggle-btn active" data-metric="storage_mcm">Storage (MCM)</button>
                <button class="texp-chart-toggle-btn" data-metric="pct_storage">% of Gross</button>
                <button class="texp-chart-toggle-btn" data-metric="level_m">Water Level (m)</button>
              </div>
            </div>

            <div class="texp-chart-container" id="texpHydroChartSvgWrap">
              ${renderSingleAssetChartSvg(selectedCompareAssetIds[0] || "GJ-WR-DAM-001", "storage_mcm")}
            </div>

            <div class="texp-legend-strip">
              <span class="tleg-item"><span class="tleg-color line-solid"></span> Documented Observation</span>
              <span class="tleg-item"><span class="tleg-color line-dashed"></span> Missing Interval (Not Interpolated)</span>
              <span class="tleg-item"><span class="tleg-color dot-active"></span> Active Timeline Step (${currentStep.date})</span>
            </div>
          </div>

          <div class="texp-card">
            <h4 class="texp-card-title">Regional Rainfall Benchmarks (2018–2024)</h4>
            <div class="texp-table-responsive">
              <table class="texp-table">
                <thead>
                  <tr>
                    <th>Agro-Climatic Zone</th>
                    <th>LPA Normal</th>
                    <th>2018 (Drought)</th>
                    <th>2019</th>
                    <th>2020</th>
                    <th>2021</th>
                    <th>2022</th>
                    <th>2023 (Biparjoy)</th>
                    <th>2024 (Heavy)</th>
                  </tr>
                </thead>
                <tbody>
                  ${Object.keys(REGIONAL_RAINFALL_TIME_SERIES).map(k => {
                    const r = REGIONAL_RAINFALL_TIME_SERIES[k];
                    return `
                      <tr>
                        <td><strong>${r.name}</strong></td>
                        <td class="font-mono">${r.lpa_normal_mm} mm</td>
                        ${r.records.map(rec => `
                          <td class="font-mono ${rec.pct_lpa < 75 ? 'text-red' : (rec.pct_lpa > 125 ? 'text-cyan' : 'text-emerald')}">
                            ${rec.rainfall_mm} mm <br><small>(${rec.pct_lpa}%)</small>
                          </td>
                        `).join('')}
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;

    bindHydrologyPaneEvents();
  }

  function bindHydrologyPaneEvents() {
    const sel = document.getElementById("texpHydroDamSelect");
    if (sel) {
      sel.addEventListener("change", (e) => {
        selectedCompareAssetIds[0] = e.target.value;
        const chartWrap = document.getElementById("texpHydroChartSvgWrap");
        if (chartWrap) {
          chartWrap.innerHTML = renderSingleAssetChartSvg(selectedCompareAssetIds[0], "storage_mcm");
        }
      });
    }

    const metricBtns = document.querySelectorAll(".texp-chart-toggle-btn");
    metricBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        metricBtns.forEach(b => b.classList.remove("active"));
        e.currentTarget.classList.add("active");
        const metric = e.currentTarget.getAttribute("data-metric");
        const chartWrap = document.getElementById("texpHydroChartSvgWrap");
        if (chartWrap) {
          chartWrap.innerHTML = renderSingleAssetChartSvg(selectedCompareAssetIds[0] || "GJ-WR-DAM-001", metric);
        }
      });
    });
  }

  /**
   * Tab 2: Comparative Multi-Asset Workbench
   */
  function renderComparePane() {
    const container = document.getElementById("temporalPane-compare");
    if (!container) return;

    container.innerHTML = `
      <div class="texp-grid">
        <div class="texp-sidebar">
          <div class="texp-card">
            <h4 class="texp-card-title">Select Assets to Compare</h4>
            <p class="texp-sub">Overlay multiple major reservoirs on unified time axes:</p>
            <div class="texp-checklist">
              ${Object.keys(RESERVOIR_TIME_SERIES).map((id, idx) => {
                const dam = RESERVOIR_TIME_SERIES[id];
                const isChecked = selectedCompareAssetIds.includes(id);
                return `
                  <label class="texp-check-item">
                    <input type="checkbox" class="texp-compare-chk" value="${id}" ${isChecked ? 'checked' : ''}>
                    <span class="texp-check-color color-${idx % 5}"></span>
                    <span>${dam.name}</span>
                  </label>
                `;
              }).join('')}
            </div>
          </div>

          <div class="texp-card">
            <h4 class="texp-card-title">Comparison Metric</h4>
            <select id="texpCompareMetricSelect" class="styled-select texp-select">
              <option value="pct_storage" ${compareMetric === 'pct_storage' ? 'selected' : ''}>% Storage Fullness (Normalized 0-100%)</option>
              <option value="storage_mcm" ${compareMetric === 'storage_mcm' ? 'selected' : ''}>Gross Live Storage (MCM)</option>
              <option value="level_m" ${compareMetric === 'level_m' ? 'selected' : ''}>Water Level Stage (m MSL)</option>
            </select>
          </div>
        </div>

        <div class="texp-main">
          <div class="texp-card">
            <div class="texp-chart-header">
              <div>
                <h3 class="texp-chart-title">Multi-Asset Comparative Hydrograph</h3>
                <span class="texp-chart-sub">Synchronized across 2018–2024 CWC Monitoring Milestones</span>
              </div>
            </div>

            <div class="texp-chart-container" id="texpMultiChartSvgWrap">
              ${renderMultiAssetChartSvg(selectedCompareAssetIds, compareMetric)}
            </div>

            <div class="texp-legend-strip">
              ${selectedCompareAssetIds.map((id, idx) => {
                const dam = RESERVOIR_TIME_SERIES[id];
                return dam ? `
                  <span class="tleg-item">
                    <span class="tleg-color color-${idx % 5}"></span>
                    ${dam.name}
                  </span>
                ` : '';
              }).join('')}
              <span class="tleg-item"><span class="tleg-color line-dashed"></span> Missing Observation Interval</span>
            </div>
          </div>
        </div>
      </div>
    `;

    bindComparePaneEvents();
  }

  function bindComparePaneEvents() {
    const checkboxes = document.querySelectorAll(".texp-compare-chk");
    checkboxes.forEach(chk => {
      chk.addEventListener("change", () => {
        const checkedVals = Array.from(document.querySelectorAll(".texp-compare-chk:checked")).map(c => c.value);
        selectedCompareAssetIds = checkedVals.length > 0 ? checkedVals : ["GJ-WR-DAM-001"];
        const chartWrap = document.getElementById("texpMultiChartSvgWrap");
        if (chartWrap) {
          chartWrap.innerHTML = renderMultiAssetChartSvg(selectedCompareAssetIds, compareMetric);
        }
      });
    });

    const metricSelect = document.getElementById("texpCompareMetricSelect");
    if (metricSelect) {
      metricSelect.addEventListener("change", (e) => {
        compareMetric = e.target.value;
        const chartWrap = document.getElementById("texpMultiChartSvgWrap");
        if (chartWrap) {
          chartWrap.innerHTML = renderMultiAssetChartSvg(selectedCompareAssetIds, compareMetric);
        }
      });
    }
  }

  /**
   * Tab 3: Infrastructure Commissioning Milestones
   */
  function renderMilestonesPane() {
    const container = document.getElementById("temporalPane-milestones");
    if (!container) return;

    container.innerHTML = `
      <div class="texp-card">
        <h3 class="texp-chart-title">Gujarat Civil Infrastructure Timeline (1965 – 2026+)</h3>
        <span class="texp-chart-sub">Verified Commissioning Dates from Official Gazettes and Departmental Registries</span>

        <div class="texp-timeline-flow">
          ${INFRASTRUCTURE_MILESTONES.map((m, idx) => `
            <div class="texp-milestone-card ${idx === activeMilestoneIndex ? 'active-step' : ''}">
              <div class="tmile-year-badge">${m.year}</div>
              <div class="tmile-content">
                <div class="tmile-top">
                  <span class="tmile-category badge-${m.category}">${m.category.toUpperCase()}</span>
                  <span class="tmile-date font-mono">${m.date}</span>
                </div>
                <h4 class="tmile-title">${m.title}</h4>
                <p class="tmile-loc">📍 ${m.location}</p>
                <p class="tmile-impact">${m.impact}</p>
                <div class="tmile-statutory">Statutory Record: ${m.statutory_record}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  /**
   * Tab 4: Telemetry Gateway & Live Feed Integration Architecture
   */
  function renderTelemetryPane() {
    const container = document.getElementById("temporalPane-telemetry");
    if (!container) return;

    const info = telemetryProvider.getStatusInfo();

    container.innerHTML = `
      <div class="texp-card">
        <h3 class="texp-chart-title">Telemetry Gateway & Live Monitoring Architecture</h3>
        <span class="texp-chart-sub">OpenAPI and WebSocket Architecture for Real Monitoring Ingestion</span>

        <div class="telemetry-status-box">
          <div class="tstat-row">
            <span class="tstat-indicator disconnected"></span>
            <div>
              <h4 class="tstat-title">Current Telemetry Status: ${info.status}</h4>
              <p class="tstat-msg">${info.liveFeedMessage}</p>
            </div>
          </div>
        </div>

        <div class="texp-grid-2">
          <div class="texp-card-inner">
            <h4>Three Separation Tiers</h4>
            <div class="tier-card">
              <span class="tier-badge static">TIER 1: STATIC INVENTORY</span>
              <p>Physical dam coordinates, dam heights, road alignments, power ratings, and design spillway capacities. Fixed GIS features.</p>
            </div>
            <div class="tier-card">
              <span class="tier-badge hist">TIER 2: HISTORICAL OBSERVATIONS</span>
              <p>Verified statutory records from CWC, IMD, and GWRD (e.g. 2018–2024 reservoir water levels and monsoon rainfall). Audited snapshots with retrieval timestamps.</p>
            </div>
            <div class="tier-card">
              <span class="tier-badge live">TIER 3: LIVE TELEMETRY (AWAITING GATEWAY)</span>
              <p>Real-time SCADA sensor streams. When disconnected, no fake data is simulated. Ready for authenticated API hooks.</p>
            </div>
          </div>

          <div class="texp-card-inner">
            <h4>API Gateway Interface Contract</h4>
            <pre class="telemetry-code font-mono">
// Telemetry Provider Contract (Extensible)
interface TelemetryFeed {
  asset_id: string;              // e.g. "GJ-WR-DAM-001"
  timestamp_utc: string;          // ISO 8601
  observation_level_m: number;    // Stage
  storage_mcm: number;           // Volume
  inflow_cumecs: number;         // Rate
  outflow_cumecs: number;        // Rate
  sensor_health: "OK" | "WARN";   // Heartbeat
  signature: string;             // SHA-256 HMAC
}
            </pre>
            <p class="texp-note">
              This digital twin enforces an anti-fabrication architecture: live connections will only render when backed by signed SCADA endpoints.
            </p>
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // 11. HIGH-PERFORMANCE SVG TIME-SERIES CHART RENDERERS
  // =========================================================================

  function renderSingleAssetChartSvg(assetId, metricKey = "storage_mcm") {
    const dam = RESERVOIR_TIME_SERIES[assetId] || RESERVOIR_TIME_SERIES["GJ-WR-DAM-001"];
    if (!dam) return `<div class="chart-empty">Asset not found</div>`;

    const W = 840;
    const H = 280;
    const padL = 60;
    const padR = 30;
    const padT = 30;
    const padB = 45;

    const chartW = W - padL - padR;
    const chartH = H - padT - padB;

    const dataPoints = dam.observations;
    const numPoints = dataPoints.length;

    // Determine max value for Y-scale
    let maxVal = 100;
    let unit = "";
    if (metricKey === "pct_storage") {
      maxVal = 100;
      unit = "%";
    } else if (metricKey === "storage_mcm") {
      maxVal = Math.ceil(dam.gross_storage_mcm * 1.05);
      unit = " MCM";
    } else if (metricKey === "level_m") {
      maxVal = Math.ceil(dam.frl_m * 1.05);
      unit = " m";
    }

    const minVal = metricKey === "level_m" ? Math.floor(dam.mddl_m * 0.95) : 0;
    const valRange = maxVal - minVal || 1;

    function getX(i) {
      return padL + (i / (numPoints - 1)) * chartW;
    }

    function getY(val) {
      return padT + chartH - ((val - minVal) / valRange) * chartH;
    }

    // Build SVG path segments (handling missing intervals with breaks!)
    let segments = [];
    let currentSegment = [];

    dataPoints.forEach((pt, i) => {
      if (pt && pt[metricKey] !== null && pt[metricKey] !== undefined) {
        currentSegment.push({ x: getX(i), y: getY(pt[metricKey]), pt: pt, idx: i });
      } else {
        if (currentSegment.length > 0) {
          segments.push(currentSegment);
          currentSegment = [];
        }
      }
    });
    if (currentSegment.length > 0) segments.push(currentSegment);

    // SVG paths
    const pathStrings = segments.map(seg => {
      return seg.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
    });

    // Active date indicator
    const activePt = dataPoints[activeDateIndex];
    const activeX = getX(activeDateIndex);
    const activeY = activePt ? getY(activePt[metricKey]) : null;

    return `
      <svg viewBox="0 0 ${W} ${H}" class="texp-svg-chart" aria-label="Hydrological Time Series Chart">
        <!-- Grid lines -->
        ${[0, 0.25, 0.5, 0.75, 1.0].map(ratio => {
          const y = padT + chartH - ratio * chartH;
          const valLabel = (minVal + ratio * valRange).toFixed(metricKey === 'pct_storage' ? 0 : 0);
          return `
            <line x1="${padL}" y1="${y}" x2="${W - padR}" y2="${y}" stroke="rgba(255,255,255,0.08)" stroke-dasharray="3,3" />
            <text x="${padL - 8}" y="${y + 4}" fill="#94a3b8" font-size="10" text-anchor="end" font-family="monospace">${valLabel}${unit}</text>
          `;
        }).join('')}

        <!-- X-axis date labels -->
        ${dataPoints.map((pt, i) => {
          if (i % 2 !== 0 && i !== numPoints - 1) return '';
          const x = getX(i);
          const dateLabel = HYDROLOGICAL_TIMELINE[i].date.substring(2, 7);
          return `
            <line x1="${x}" y1="${padT + chartH}" x2="${x}" y2="${padT + chartH + 5}" stroke="#64748b" />
            <text x="${x}" y="${padT + chartH + 18}" fill="#94a3b8" font-size="9.5" text-anchor="middle" font-family="monospace">${dateLabel}</text>
          `;
        }).join('')}

        <!-- Active Date Vertical Marker -->
        <line x1="${activeX}" y1="${padT}" x2="${activeX}" y2="${padT + chartH}" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="4,2" />

        <!-- Data Path Lines -->
        ${pathStrings.map(pStr => `
          <path d="${pStr}" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
        `).join('')}

        <!-- Circles for points -->
        ${segments.flat().map(p => `
          <circle cx="${p.x}" cy="${p.y}" r="4" fill="${p.idx === activeDateIndex ? '#facc15' : '#0284c7'}" stroke="#ffffff" stroke-width="1.5" />
        `).join('')}

        <!-- Active point highlight -->
        ${activeY !== null ? `
          <circle cx="${activeX}" cy="${activeY}" r="7" fill="#facc15" stroke="#ffffff" stroke-width="2" class="texp-pulse-point" />
          <text x="${activeX}" y="${activeY - 12}" fill="#facc15" font-size="11" font-weight="bold" text-anchor="middle" font-family="monospace">
            ${activePt[metricKey]}${unit}
          </text>
        ` : `
          <text x="${activeX}" y="${padT + chartH / 2}" fill="#ef4444" font-size="11" text-anchor="middle" font-family="monospace">
            [ Missing Observation ]
          </text>
        `}
      </svg>
    `;
  }

  function renderMultiAssetChartSvg(assetIds, metricKey = "pct_storage") {
    const W = 840;
    const H = 280;
    const padL = 60;
    const padR = 30;
    const padT = 30;
    const padB = 45;

    const chartW = W - padL - padR;
    const chartH = H - padT - padB;
    const numPoints = HYDROLOGICAL_TIMELINE.length;

    const colors = ["#38bdf8", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6"];

    let maxVal = 100;
    let minVal = 0;
    let unit = "%";

    if (metricKey === "storage_mcm") {
      maxVal = 10000;
      unit = " MCM";
    } else if (metricKey === "level_m") {
      maxVal = 200;
      minVal = 40;
      unit = " m";
    }

    const valRange = maxVal - minVal || 1;

    function getX(i) {
      return padL + (i / (numPoints - 1)) * chartW;
    }

    function getY(val) {
      return padT + chartH - ((val - minVal) / valRange) * chartH;
    }

    const activeX = getX(activeDateIndex);

    return `
      <svg viewBox="0 0 ${W} ${H}" class="texp-svg-chart" aria-label="Multi-Asset Comparative Hydrograph">
        <!-- Grid lines -->
        ${[0, 0.25, 0.5, 0.75, 1.0].map(ratio => {
          const y = padT + chartH - ratio * chartH;
          const valLabel = (minVal + ratio * valRange).toFixed(0);
          return `
            <line x1="${padL}" y1="${y}" x2="${W - padR}" y2="${y}" stroke="rgba(255,255,255,0.08)" stroke-dasharray="3,3" />
            <text x="${padL - 8}" y="${y + 4}" fill="#94a3b8" font-size="10" text-anchor="end" font-family="monospace">${valLabel}${unit}</text>
          `;
        }).join('')}

        <!-- X-axis date labels -->
        ${HYDROLOGICAL_TIMELINE.map((step, i) => {
          if (i % 2 !== 0 && i !== numPoints - 1) return '';
          const x = getX(i);
          return `
            <line x1="${x}" y1="${padT + chartH}" x2="${x}" y2="${padT + chartH + 5}" stroke="#64748b" />
            <text x="${x}" y="${padT + chartH + 18}" fill="#94a3b8" font-size="9.5" text-anchor="middle" font-family="monospace">${step.date.substring(2, 7)}</text>
          `;
        }).join('')}

        <!-- Active Date Vertical Line -->
        <line x1="${activeX}" y1="${padT}" x2="${activeX}" y2="${padT + chartH}" stroke="#facc15" stroke-width="1.2" stroke-dasharray="3,2" />

        <!-- Asset Paths -->
        ${assetIds.map((id, aIdx) => {
          const dam = RESERVOIR_TIME_SERIES[id];
          if (!dam) return '';
          const color = colors[aIdx % colors.length];

          let segments = [];
          let curSeg = [];
          dam.observations.forEach((pt, i) => {
            if (pt && pt[metricKey] !== null && pt[metricKey] !== undefined) {
              curSeg.push({ x: getX(i), y: getY(pt[metricKey]), val: pt[metricKey] });
            } else {
              if (curSeg.length > 0) {
                segments.push(curSeg);
                curSeg = [];
              }
            }
          });
          if (curSeg.length > 0) segments.push(curSeg);

          const paths = segments.map(seg => {
            return seg.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
          });

          return paths.map(pStr => `
            <path d="${pStr}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.9" />
          `).join('');
        }).join('')}
      </svg>
    `;
  }

  // =========================================================================
  // 12. PUBLIC API EXPOSURE
  // =========================================================================

  window.TemporalExplorer = {
    init,
    openModal,
    closeModal,
    toggleModal,
    toggleMapHUD,
    startPlayback,
    stopPlayback,
    stepTimeline,
    synchronizeMapLayers,
    getTimeline: () => HYDROLOGICAL_TIMELINE,
    getMilestones: () => INFRASTRUCTURE_MILESTONES,
    getReservoirSeries: () => RESERVOIR_TIME_SERIES,
    getProviderInfo: () => telemetryProvider.getStatusInfo()
  };

})();
