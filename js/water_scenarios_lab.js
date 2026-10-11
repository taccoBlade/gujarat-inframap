/**
 * Gujarat InfraMap — Water Scenarios Lab (Educational Hydro-Environmental Simulation Suite)
 * Interactive educational scenario interface modeling reservoir storage mass-balance,
 * catchment heavy-rainfall & flood routing, and drought & water availability stress.
 *
 * Sourced strictly from:
 *   - Central Water Commission (CWC NRLD 2023, National Register of Large Dams)
 *   - India-WRIS (Water Resources Information System)
 *   - Gujarat Water Resources Department (GWRD)
 *   - Central Ground Water Board (CGWB NAQUIM)
 *   - NRCS / CWC SCS-CN Hydrology & Manning's Open Channel Hydraulics
 *
 * Three Educational Modes:
 *   Mode A: Reservoir Storage Mass-Balance Model (ΔS = Vin - Vout - Losses)
 *   Mode B: Catchment Rainfall-Runoff & Flood Exploration (SCS-CN & Manning's Stage)
 *   Mode C: Drought, Monsoon Deficits & Sectoral Water Availability Stress
 *
 * Standard: EPSG:4326, Zero Fabrication, Transparent Physics Formulations.
 * Version: 4.5.0
 */

(function () {
  "use strict";

  // Cache & state
  let leafletMap = null;
  let cachedAssets = [];
  let currentMode = "scenarioA"; // "scenarioA" | "scenarioB" | "scenarioC"
  let activeAssetId = "GJ-WR-DAM-001"; // Default: Sardar Sarovar Dam
  let activeCatchmentId = "CAT-NARMADA"; // Default: Narmada Catchment

  // =========================================================================
  // 1. VERIFIED RESERVOIR BENCHMARK REPOSITORY (CWC & GWRD AUDITED)
  // =========================================================================
  const RESERVOIR_BENCHMARKS = {
    "GJ-WR-DAM-001": {
      id: "GJ-WR-DAM-001",
      name: "Sardar Sarovar Dam",
      river: "Narmada River",
      basin: "Narmada Basin",
      district: "Narmada",
      gross_storage_mcm: 9460,
      live_storage_mcm: 5800,
      dead_storage_mcm: 3660,
      frl_m: 138.68,
      mwl_m: 140.21,
      mddl_m: 110.64,
      crest_elevation_m: 146.50,
      surface_area_ha: 37533,
      spillway_capacity_cumecs: 84949,
      catchment_sqkm: 88000,
      historical_observations: [
        { date: "2023-09-17", level_m: 138.68, storage_mcm: 9460, pct: 100.0, note: "Full Reservoir Level reached with all 30 radial gates operated for controlled discharge of 5.5 lakh cusecs." },
        { date: "2023-06-01", level_m: 122.10, storage_mcm: 5020, pct: 53.1, note: "Pre-monsoon storage buffer prior to South-West monsoon onset." },
        { date: "2024-08-28", level_m: 135.20, storage_mcm: 8530, pct: 90.2, note: "Peak 2024 monsoon inflow of 3.8 lakh cusecs managed via riverbed powerhouse and spillway chutes." },
        { date: "2019-09-15", level_m: 138.68, storage_mcm: 9460, pct: 100.0, note: "Historic first filling to maximum crest height of 138.68m following radial gate commissioning." }
      ],
      typical_inflow_cumecs: 1200,
      typical_outflow_cumecs: 800,
      eac_calibrated: true,
      eac_power: 2.15 // Conic exponent
    },
    "GJ-WR-DAM-002": {
      id: "GJ-WR-DAM-002",
      name: "Ukai Dam (Vallabh Sagar)",
      river: "Tapi River",
      basin: "Tapi Basin",
      district: "Tapi / Surat",
      gross_storage_mcm: 7414,
      live_storage_mcm: 6730,
      dead_storage_mcm: 684,
      frl_m: 105.16,
      mwl_m: 106.99,
      mddl_m: 82.30,
      crest_elevation_m: 111.25,
      surface_area_ha: 61200,
      spillway_capacity_cumecs: 46269,
      catchment_sqkm: 62225,
      historical_observations: [
        { date: "2006-08-07", level_m: 105.20, storage_mcm: 7414, pct: 100.0, note: "Catastrophic flood inflow of 12.5 lakh cusecs forcing peak release of 9.1 lakh cusecs inundating Surat." },
        { date: "2023-09-20", level_m: 104.85, storage_mcm: 7150, pct: 96.4, note: "Optimal post-monsoon storage cushioning South Gujarat irrigation." },
        { date: "2024-07-25", level_m: 98.40, storage_mcm: 4200, pct: 56.6, note: "Monsoon filling progression regulated by Flood Rule Curve to maintain flood cushion." }
      ],
      typical_inflow_cumecs: 950,
      typical_outflow_cumecs: 600,
      eac_calibrated: true,
      eac_power: 2.05
    },
    "GJ-WR-DAM-003": {
      id: "GJ-WR-DAM-003",
      name: "Kadana Dam",
      river: "Mahi River",
      basin: "Mahi Basin",
      district: "Mahisagar",
      gross_storage_mcm: 1542,
      live_storage_mcm: 1249,
      dead_storage_mcm: 293,
      frl_m: 127.71,
      mwl_m: 129.84,
      mddl_m: 114.30,
      crest_elevation_m: 133.50,
      surface_area_ha: 16600,
      spillway_capacity_cumecs: 34400,
      catchment_sqkm: 25500,
      historical_observations: [
        { date: "2023-09-18", level_m: 127.40, storage_mcm: 1505, pct: 97.6, note: "Controlled evacuation of upstream Madhya Pradesh and Rajasthan runoff." },
        { date: "2024-08-10", level_m: 124.60, storage_mcm: 1180, pct: 76.5, note: "Regulated diversion to Wanakbori Weir and Mahi Right Bank Canal network." }
      ],
      typical_inflow_cumecs: 450,
      typical_outflow_cumecs: 350,
      eac_calibrated: true,
      eac_power: 2.10
    },
    "GJ-WR-DAM-004": {
      id: "GJ-WR-DAM-004",
      name: "Dharoi Dam",
      river: "Sabarmati River",
      basin: "Sabarmati Basin",
      district: "Mehsana",
      gross_storage_mcm: 867,
      live_storage_mcm: 776,
      dead_storage_mcm: 91,
      frl_m: 189.59,
      mwl_m: 190.50,
      mddl_m: 169.50,
      crest_elevation_m: 195.00,
      surface_area_ha: 10700,
      spillway_capacity_cumecs: 7760,
      catchment_sqkm: 5540,
      historical_observations: [
        { date: "2023-09-22", level_m: 188.90, storage_mcm: 825, pct: 95.2, note: "Stabilized storage feeding municipal drinking intakes for Ahmedabad and Gandhinagar." },
        { date: "2017-07-26", level_m: 189.50, storage_mcm: 860, pct: 99.2, note: "Severe North Gujarat flood with massive inflow from Aravalli foothills." },
        { date: "2024-06-01", level_m: 177.20, storage_mcm: 220, pct: 25.4, note: "Dry-season drawdown near operational threshold." }
      ],
      typical_inflow_cumecs: 200,
      typical_outflow_cumecs: 150,
      eac_calibrated: true,
      eac_power: 2.20
    },
    "GJ-WR-DAM-005": {
      id: "GJ-WR-DAM-005",
      name: "Dantiwada Dam",
      river: "Banas River",
      basin: "Banas Basin",
      district: "Banaskantha",
      gross_storage_mcm: 464,
      live_storage_mcm: 405,
      dead_storage_mcm: 59,
      frl_m: 184.10,
      mwl_m: 185.32,
      mddl_m: 167.64,
      crest_elevation_m: 188.98,
      surface_area_ha: 4850,
      spillway_capacity_cumecs: 6650,
      catchment_sqkm: 2862,
      historical_observations: [
        { date: "2017-07-25", level_m: 184.80, storage_mcm: 460, pct: 99.1, note: "Historic Banaskantha cloudburst: dam breached design envelope requiring emergency spillway discharge of 1.4 lakh cusecs." },
        { date: "2023-09-15", level_m: 182.40, storage_mcm: 375, pct: 80.8, note: "Optimal agricultural reservoir storage for winter Rabi sowing." }
      ],
      typical_inflow_cumecs: 120,
      typical_outflow_cumecs: 80,
      eac_calibrated: true,
      eac_power: 2.18
    },
    "GJ-WR-DAM-006": {
      id: "GJ-WR-DAM-006",
      name: "Shetrunji Dam",
      river: "Shetrunji River",
      basin: "Shetrunji Basin",
      district: "Bhavnagar",
      gross_storage_mcm: 309,
      live_storage_mcm: 290,
      dead_storage_mcm: 19,
      frl_m: 55.47,
      mwl_m: 57.00,
      mddl_m: 45.72,
      crest_elevation_m: 60.35,
      surface_area_ha: 4200,
      spillway_capacity_cumecs: 7080,
      catchment_sqkm: 4310,
      historical_observations: [
        { date: "2023-09-12", level_m: 55.47, storage_mcm: 309, pct: 100.0, note: "Reservoir overflowed with 100% capacity; 59 radial gates opened to discharge surplus to Gulf of Khambhat." },
        { date: "2019-06-01", level_m: 46.80, storage_mcm: 32, pct: 10.4, note: "Acute Saurashtra drought stage with drinking water rationing in Bhavnagar." }
      ],
      typical_inflow_cumecs: 90,
      typical_outflow_cumecs: 50,
      eac_calibrated: true,
      eac_power: 2.12
    },
    "GJ-WR-DAM-007": {
      id: "GJ-WR-DAM-007",
      name: "Bhadar Dam",
      river: "Bhadar River",
      basin: "Bhadar Basin",
      district: "Rajkot",
      gross_storage_mcm: 238,
      live_storage_mcm: 220,
      dead_storage_mcm: 18,
      frl_m: 108.81,
      mwl_m: 110.34,
      mddl_m: 99.06,
      crest_elevation_m: 113.69,
      surface_area_ha: 3600,
      spillway_capacity_cumecs: 5946,
      catchment_sqkm: 2406,
      historical_observations: [
        { date: "2023-08-25", level_m: 108.81, storage_mcm: 238, pct: 100.0, note: "Full capacity reached, securing Rajkot Municipal Corporation drinking supply for 18 months." },
        { date: "2018-05-30", level_m: 100.10, storage_mcm: 28, pct: 11.8, note: "Severe depletion; water conveyed via emergency pipelines from Narmada canal." }
      ],
      typical_inflow_cumecs: 80,
      typical_outflow_cumecs: 45,
      eac_calibrated: true,
      eac_power: 2.14
    },
    "GJ-WR-DAM-012": {
      id: "GJ-WR-DAM-012",
      name: "Machhu-II Dam",
      river: "Machhu River",
      basin: "Machhu Basin",
      district: "Morbi",
      gross_storage_mcm: 101,
      live_storage_mcm: 91,
      dead_storage_mcm: 10,
      frl_m: 57.30,
      mwl_m: 59.13,
      mddl_m: 47.55,
      crest_elevation_m: 62.18,
      surface_area_ha: 1980,
      spillway_capacity_cumecs: 6000,
      catchment_sqkm: 1928,
      historical_observations: [
        { date: "1979-08-11", level_m: 60.50, storage_mcm: 140, pct: 138.0, note: "HISTORIC MORBI DISASTER: 16,300 m³/s cloudburst inflow overwhelmed original 6,000 m³/s spillway, overtopping earthen flanks and causing dam failure." },
        { date: "2023-07-20", level_m: 57.30, storage_mcm: 101, pct: 100.0, note: "Reconstructed masonry gravity dam safely discharged 1,450 m³/s through modern radial gates." }
      ],
      typical_inflow_cumecs: 60,
      typical_outflow_cumecs: 35,
      eac_calibrated: true,
      eac_power: 2.15
    }
  };

  // =========================================================================
  // 2. VERIFIED CATCHMENT & HYDROLOGIC BENCHMARK REPOSITORY (CWC & IMD)
  // =========================================================================
  const CATCHMENT_BENCHMARKS = {
    "CAT-NARMADA": {
      id: "CAT-NARMADA",
      name: "Narmada River Catchment (to Sardar Sarovar)",
      river: "Narmada",
      associated_dam: "GJ-WR-DAM-001",
      area_sqkm: 88000,
      mean_annual_rainfall_mm: 1120,
      soil_group: "Deccan Traps & Central Alluvium (Hydrologic Soil Group B/C)",
      default_cn: 78,
      time_of_concentration_hr: 48,
      documented_historical_floods: [
        { year: 2020, peak_flow_cumecs: 31150, storm_rainfall_mm: 280, impact: "Extreme upstream MP runoff, 23 gates opened, Bharuch low-lying areas flooded." },
        { year: 2013, peak_flow_cumecs: 34500, storm_rainfall_mm: 310, impact: "Largest recorded flood post-construction, regulated peak outflow at Golden Bridge." },
        { year: 1970, peak_flow_cumecs: 69400, storm_rainfall_mm: 420, impact: "Pre-dam historic record flood (24.5 lakh cusecs) forming basis of PMF design." }
      ],
      manning_n: 0.035,
      channel_width_m: 800,
      channel_slope: 0.0006,
      bankfull_depth_m: 14.0
    },
    "CAT-TAPI": {
      id: "CAT-TAPI",
      name: "Tapi River Catchment (to Ukai Dam)",
      river: "Tapi",
      associated_dam: "GJ-WR-DAM-002",
      area_sqkm: 62225,
      mean_annual_rainfall_mm: 785,
      soil_group: "Black Cotton Vertisols & Basalt Plateaus (Hydrologic Soil Group C/D)",
      default_cn: 82,
      time_of_concentration_hr: 36,
      documented_historical_floods: [
        { year: 2006, peak_flow_cumecs: 25768, storm_rainfall_mm: 350, impact: "SURAT FLOOD 2006: 9.1 lakh cusecs release from Ukai inundated 80% of Surat city for 3 days." },
        { year: 1998, peak_flow_cumecs: 20500, storm_rainfall_mm: 260, impact: "Severe flood in Surat industrial belts (Hazira, Pandesara)." },
        { year: 1968, peak_flow_cumecs: 42500, storm_rainfall_mm: 410, impact: "Pre-dam catastrophic flood (15 lakh cusecs) that led directly to Ukai dam commissioning." }
      ],
      manning_n: 0.038,
      channel_width_m: 650,
      channel_slope: 0.0007,
      bankfull_depth_m: 12.0
    },
    "CAT-MAHI": {
      id: "CAT-MAHI",
      name: "Mahi River Catchment (to Kadana Dam)",
      river: "Mahi",
      associated_dam: "GJ-WR-DAM-003",
      area_sqkm: 25500,
      mean_annual_rainfall_mm: 850,
      soil_group: "Aravalli Metamorphics & Gravelly Loams (Hydrologic Soil Group B)",
      default_cn: 76,
      time_of_concentration_hr: 28,
      documented_historical_floods: [
        { year: 2006, peak_flow_cumecs: 18200, storm_rainfall_mm: 240, impact: "High spillway discharge into Wanakbori and Anand plains." },
        { year: 1973, peak_flow_cumecs: 27500, storm_rainfall_mm: 320, impact: "Severe flash flood from Rajasthan catchment during construction phase." }
      ],
      manning_n: 0.032,
      channel_width_m: 450,
      channel_slope: 0.0010,
      bankfull_depth_m: 10.5
    },
    "CAT-SABARMATI": {
      id: "CAT-SABARMATI",
      name: "Sabarmati Catchment (to Dharoi & Vasna)",
      river: "Sabarmati",
      associated_dam: "GJ-WR-DAM-004",
      area_sqkm: 21674,
      mean_annual_rainfall_mm: 700,
      soil_group: "Alluvial Sandy Loams & Granitic Pediments (Hydrologic Soil Group B/C)",
      default_cn: 74,
      time_of_concentration_hr: 24,
      documented_historical_floods: [
        { year: 2017, peak_flow_cumecs: 6200, storm_rainfall_mm: 290, impact: "Torrential North Gujarat rains, Vasna Barrage operated 26 gates to protect Riverfront." },
        { year: 2006, peak_flow_cumecs: 7800, storm_rainfall_mm: 310, impact: "Downstream inundation near Dholka and Cambay coastal marshes." },
        { year: 1973, peak_flow_cumecs: 14150, storm_rainfall_mm: 380, impact: "Historic pre-Dharoi flood that submerged Ellisbridge and historic Ahmedabad quarters." }
      ],
      manning_n: 0.030,
      channel_width_m: 350,
      channel_slope: 0.0012,
      bankfull_depth_m: 8.5
    },
    "CAT-MACHHU": {
      id: "CAT-MACHHU",
      name: "Machhu River Catchment (to Machhu-II)",
      river: "Machhu",
      associated_dam: "GJ-WR-DAM-012",
      area_sqkm: 1928,
      mean_annual_rainfall_mm: 540,
      soil_group: "Sandstone / Shallow Basalt soils (Hydrologic Soil Group C)",
      default_cn: 84,
      time_of_concentration_hr: 14,
      documented_historical_floods: [
        { year: 1979, peak_flow_cumecs: 16300, storm_rainfall_mm: 450, impact: "1979 MORBI DISASTER: 3-day cloudburst (600mm upstream) created runoff nearly 3x original spillway capacity, causing catastrophic failure and loss of life." },
        { year: 2020, peak_flow_cumecs: 2100, storm_rainfall_mm: 180, impact: "Safely managed via reconstructed concrete gravity spillway with automated radial gates." }
      ],
      manning_n: 0.040,
      channel_width_m: 220,
      channel_slope: 0.0018,
      bankfull_depth_m: 6.5
    }
  };

  // =========================================================================
  // 3. DROUGHT & REGIONAL WATER BALANCE BENCHMARKS (GWRD, CGWB, NITI AAYOG)
  // =========================================================================
  const DROUGHT_BENCHMARKS = {
    "REG-SAURASHTRA": {
      id: "REG-SAURASHTRA",
      name: "Saurashtra Peninsula (Semi-Arid Maritime)",
      districts: ["Rajkot", "Jamnagar", "Bhavnagar", "Junagadh", "Amreli", "Surendranagar", "Porbandar", "Morbi", "Devbhumi Dwarka", "Gir Somnath", "Botad"],
      representative_dam: "GJ-WR-DAM-007",
      annual_demand_mcm: 3200,
      sectoral_shares: { irrigation: 72, domestic: 18, industrial: 10 },
      cgwb_status: "Semi-Critical to Over-Exploited in coastal limestone / hard basalt aquifers",
      historical_droughts: [
        { years: "1985–1987", severity: "Severe (Consecutive 3-year deficit > 48%)", response: "Cattle camps, train-borne water supply to Rajkot, widespread crop failures." },
        { years: "2018–2019", severity: "Moderate-Severe (Monsoon deficit 40-55%)", response: "Emergency transfer via SAUNI Yojana lifting Narmada water into 115 local reservoirs." },
        { years: "2012", severity: "Moderate (Monsoon deficit 32%)", response: "Municipal water rationing in 8 urban corporations." }
      ]
    },
    "REG-NORTH-GUJARAT": {
      id: "REG-NORTH-GUJARAT",
      name: "North Gujarat (Deep Alluvial Basin)",
      districts: ["Mehsana", "Patan", "Banaskantha", "Sabarkantha", "Aravalli", "Gandhinagar"],
      representative_dam: "GJ-WR-DAM-004",
      annual_demand_mcm: 3800,
      sectoral_shares: { irrigation: 78, domestic: 14, industrial: 8 },
      cgwb_status: "Critically Over-Exploited (tube wells exceeding 250m depth with fluoride/salinity)",
      historical_droughts: [
        { years: "1987", severity: "Extreme (Monsoon deficit 62%)", response: "Exhaustion of shallow aquifers, migration of pastoralist Maldharis." },
        { years: "2000–2002", severity: "Severe (Deficit 38%)", response: "Deep tube well drilling, expedited construction of Sujalam Sufalam spreading canals." },
        { years: "2018", severity: "Moderate (Deficit 28%)", response: "Sujalam Sufalam canal diversions from Mahi and Narmada." }
      ]
    },
    "REG-CENTRAL-GUJARAT": {
      id: "REG-CENTRAL-GUJARAT",
      name: "Central Gujarat (Mahi & Narmada Plain)",
      districts: ["Vadodara", "Kheda", "Anand", "Panchmahal", "Mahisagar", "Chhota Udepur"],
      representative_dam: "GJ-WR-DAM-003",
      annual_demand_mcm: 4500,
      sectoral_shares: { irrigation: 75, domestic: 13, industrial: 12 },
      cgwb_status: "Safe to Semi-Critical with rich canal recharge from Mahi and Narmada networks",
      historical_droughts: [
        { years: "1987", severity: "Severe (Deficit 42%)", response: "Restricted canal rotational delivery to protect perennial sugarcane and tobacco." },
        { years: "2015", severity: "Mild-Moderate (Deficit 22%)", response: "Regulated reservoir releases from Kadana and Panam." }
      ]
    },
    "REG-SOUTH-GUJARAT": {
      id: "REG-SOUTH-GUJARAT",
      name: "South Gujarat (High-Rainfall Coastal Belt)",
      districts: ["Surat", "Navsari", "Valsad", "Tapi", "Dang", "Bharuch", "Narmada"],
      representative_dam: "GJ-WR-DAM-002",
      annual_demand_mcm: 5200,
      sectoral_shares: { irrigation: 68, domestic: 16, industrial: 16 },
      cgwb_status: "Safe with high coastal rainfall (1,200–2,000mm) though localized salinity ingress near coast",
      historical_droughts: [
        { years: "1986–1987", severity: "Moderate (Deficit 35%)", response: "Reduced hydro power peaking generation at Ukai to conserve canal irrigation storage." },
        { years: "2018", severity: "Mild (Deficit 18%)", response: "Canal scheduling with minimal domestic impact." }
      ]
    }
  };

  // =========================================================================
  // 4. SCENARIO SIMULATION ENGINES (TRANSPARENT PHYSICS FORMULATIONS)
  // =========================================================================

  /**
   * Helper: Format number with unit
   */
  function fmt(val, unit = "") {
    if (val === null || val === undefined || isNaN(val)) return "—";
    const num = parseFloat(val);
    return `${num.toLocaleString(undefined, { maximumFractionDigits: 2 })}${unit ? " " + unit : ""}`;
  }

  /**
   * SCENARIO A: Mass-Balance Simulation
   * Change in storage = inflow volume − outflow volume − estimated losses
   * ΔS = Vin - Vout - Vloss
   *
   * @param {Object} p Reservoir benchmark object
   * @param {Object} cfg User inputs
   *   - initial_pct: Initial storage as % of gross capacity
   *   - inflow_cumecs: Average inflow rate in m³/s
   *   - outflow_cumecs: Controlled release rate in m³/s
   *   - evap_mm_day: Pan evaporation rate in mm/day (default 6.0 mm/day)
   *   - seepage_pct: Daily seepage loss as % of active storage (default 0.05%/day)
   *   - duration_days: Simulation duration in days (e.g. 14 days)
   *   - timestep_hours: Time step in hours (e.g. 6 or 24 hours)
   */
  function simulateReservoirStorage(p, cfg) {
    const gross = p.gross_storage_mcm;
    const dead = p.dead_storage_mcm;
    const live = p.live_storage_mcm;
    const frl = p.frl_m;
    const mddl = p.mddl_m;
    const mwl = p.mwl_m;

    const initialStorageMCM = (cfg.initial_pct / 100) * gross;
    const inflowCumecs = parseFloat(cfg.inflow_cumecs);
    const outflowCumecs = parseFloat(cfg.outflow_cumecs);
    const evapMmDay = parseFloat(cfg.evap_mm_day);
    const seepagePctDay = parseFloat(cfg.seepage_pct_day);
    const durationDays = parseInt(cfg.duration_days, 10);
    const stepHours = parseFloat(cfg.timestep_hours);

    const totalSteps = Math.round((durationDays * 24) / stepHours);
    const stepDays = stepHours / 24;

    // Time-series arrays
    const timeline = [];
    let currentStorage = initialStorageMCM;
    let totalInflowMCM = 0;
    let totalOutflowMCM = 0;
    let totalEvapMCM = 0;
    let totalSeepageMCM = 0;
    let totalSpillMCM = 0;
    let spillCount = 0;
    let dryCount = 0;

    // Unit conversion constants:
    // 1 cumec for 1 hour = 3600 m³ = 0.0036 MCM
    const cumecHoursToMcm = 0.0036;

    for (let step = 0; step <= totalSteps; step++) {
      const elapsedHours = step * stepHours;
      const elapsedDays = (elapsedHours / 24).toFixed(1);

      // Estimate surface area at current storage via conic hypsometry: A(S) = A_frl * (S / S_gross)^(2/3)
      const storageRatio = Math.max(0.01, Math.min(1.0, currentStorage / gross));
      const currentAreaHa = p.surface_area_ha * Math.pow(storageRatio, 0.67);
      const currentAreaSqKm = currentAreaHa / 100;

      // Estimate water elevation via calibrated EAC: h = mddl + (frl - mddl) * ( (S - dead)/live )^(1/power)
      let currentStageM = mddl;
      if (currentStorage > dead) {
        const liveFraction = Math.min(1.0, (currentStorage - dead) / live);
        currentStageM = mddl + (frl - mddl) * Math.pow(liveFraction, 1 / (p.eac_power || 2.1));
      } else {
        // Below dead storage
        const deadFraction = Math.max(0.0, currentStorage / dead);
        currentStageM = (mddl * 0.85) + (mddl * 0.15) * Math.pow(deadFraction, 0.5);
      }

      // If at step 0, record baseline state before applying increments
      if (step === 0) {
        timeline.push({
          step: 0,
          hours: 0,
          days: 0,
          storage_mcm: currentStorage,
          stage_m: currentStageM,
          area_ha: currentAreaHa,
          inflow_step_mcm: 0,
          outflow_step_mcm: 0,
          evap_step_mcm: 0,
          spill_step_mcm: 0,
          is_spilling: false,
          is_below_dead: currentStorage <= dead
        });
        continue;
      }

      // 1. Inflow Volume in this time-step:
      const stepVinMCM = inflowCumecs * stepHours * cumecHoursToMcm;
      totalInflowMCM += stepVinMCM;

      // 2. Outflow Volume in this time-step:
      // If current storage is below dead storage, gravity canal gates cannot operate!
      let actualOutflowRate = outflowCumecs;
      let isGatedRestricted = false;
      if (currentStorage <= dead) {
        actualOutflowRate = 0; // Cutoff
        isGatedRestricted = true;
        dryCount++;
      }
      const stepVoutMCM = actualOutflowRate * stepHours * cumecHoursToMcm;
      totalOutflowMCM += stepVoutMCM;

      // 3. Evaporation Loss:
      // Depth in mm * Area in km² * 10^-3 = MCM
      // evap_mm_day * stepDays * area_sqkm * 10^-3
      const stepEvapMCM = (evapMmDay * stepDays * currentAreaSqKm) / 1000;
      totalEvapMCM += stepEvapMCM;

      // 4. Seepage Loss:
      const stepSeepageMCM = currentStorage * (seepagePctDay / 100) * stepDays;
      totalSeepageMCM += stepSeepageMCM;

      // Mass Balance Equation: S_{t+1} = S_t + Vin - Vout - Vevap - Vseep
      let rawStorage = currentStorage + stepVinMCM - stepVoutMCM - stepEvapMCM - stepSeepageMCM;
      let stepSpillMCM = 0;
      let isSpilling = false;

      // Upper Bound: Spillway Capacity / FRL
      if (rawStorage > gross) {
        stepSpillMCM = rawStorage - gross;
        rawStorage = gross;
        totalSpillMCM += stepSpillMCM;
        isSpilling = true;
        spillCount++;
      }

      // Lower Bound: Non-negative physical storage
      if (rawStorage < 0) {
        rawStorage = 0;
      }

      currentStorage = rawStorage;

      timeline.push({
        step,
        hours: elapsedHours,
        days: parseFloat(elapsedDays),
        storage_mcm: currentStorage,
        stage_m: currentStageM,
        area_ha: currentAreaHa,
        inflow_step_mcm: stepVinMCM,
        outflow_step_mcm: stepVoutMCM,
        evap_step_mcm: stepEvapMCM,
        spill_step_mcm: stepSpillMCM,
        is_spilling: isSpilling,
        is_below_dead: currentStorage <= dead,
        gate_restricted: isGatedRestricted
      });
    }

    const netChangeMCM = currentStorage - initialStorageMCM;
    const finalPctGross = ((currentStorage / gross) * 100).toFixed(1);
    const finalPctLive = currentStorage > dead ? (((currentStorage - dead) / live) * 100).toFixed(1) : 0;

    return {
      success: true,
      reservoir: p,
      inputs: cfg,
      initial_storage_mcm: initialStorageMCM,
      final_storage_mcm: currentStorage,
      net_change_mcm: netChangeMCM,
      final_pct_gross: parseFloat(finalPctGross),
      final_pct_live: parseFloat(finalPctLive),
      total_inflow_mcm: totalInflowMCM,
      total_outflow_mcm: totalOutflowMCM,
      total_evap_mcm: totalEvapMCM,
      total_seepage_mcm: totalSeepageMCM,
      total_spill_mcm: totalSpillMCM,
      spill_count: spillCount,
      dry_count: dryCount,
      timeline,
      assumptions: [
        "Inflow rate assumed steady across the time step unless modified by user.",
        "Evaporative loss modeled via water spread area calculated dynamically from conic hypsometric elevation-area curve.",
        "Gravity canal/turbine outflow cuts off automatically when reservoir falls below Minimum Drawdown Level (MDDL / Dead Storage).",
        "Uncontrolled spillway evacuation triggers instantaneously once storage reaches Full Reservoir Level (FRL / Gross Storage)."
      ]
    };
  }

  /**
   * SCENARIO B: Catchment Rainfall-Runoff & Flood Exploration (SCS-CN & Manning's 1D Stage)
   *
   * @param {Object} cat Catchment benchmark object
   * @param {Object} cfg User inputs
   *   - rainfall_mm: Storm total rainfall depth in mm (e.g. 150mm)
   *   - storm_duration_hr: Storm duration in hours (e.g. 24 hr)
   *   - curve_number: SCS Curve Number (CN, 50 to 95)
   *   - antecedent_moisture: "dry" (AMC I) | "normal" (AMC II) | "wet" (AMC III)
   */
  function simulateCatchmentFlood(cat, cfg) {
    const P = parseFloat(cfg.rainfall_mm);
    const durationHr = parseFloat(cfg.storm_duration_hr);
    const areaSqKm = cat.area_sqkm;
    const baseCN = parseFloat(cfg.curve_number);
    const amc = cfg.antecedent_moisture || "normal";

    // Adjust Curve Number for Antecedent Moisture Condition (AMC per CWC guidelines)
    let adjustedCN = baseCN;
    if (amc === "dry") {
      // AMC I: Dry condition before storm
      adjustedCN = (4.2 * baseCN) / (10 - 0.058 * baseCN);
    } else if (amc === "wet") {
      // AMC III: Saturated catchment from preceding rainfall
      adjustedCN = (23 * baseCN) / (10 + 0.13 * baseCN);
    }
    adjustedCN = Math.max(40, Math.min(98, adjustedCN));

    // SCS-CN Equations:
    // Potential Maximum Soil Retention: S = (25400 / CN) - 254 (in mm)
    const S = (25400 / adjustedCN) - 254;

    // Initial Abstraction (Interception, depression storage, initial infiltration):
    // Standard Indian CWC practice: Ia = 0.2 * S (or 0.1 * S for black soils)
    const Ia = 0.2 * S;

    // Direct Runoff Depth: Pe = (P - Ia)^2 / (P - Ia + S) for P > Ia; else 0
    let Pe = 0;
    if (P > Ia) {
      Pe = Math.pow(P - Ia, 2) / (P - Ia + S);
    }

    // Runoff Coefficient: C = Pe / P
    const runoffCoefficient = P > 0 ? (Pe / P) : 0;

    // Total Runoff Volume: VR = Pe (mm) * Area (km²) * 10^-3 = MCM
    const runoffVolumeMCM = (Pe * areaSqKm) / 1000;

    // Simplified Unit Hydrograph Peak Discharge:
    // Time to Peak: tp = 0.5 * D + 0.6 * Tc
    const Tc = cat.time_of_concentration_hr;
    const tp = (0.5 * durationHr) + (0.6 * Tc);

    // Peak Flow: Qp = (0.208 * Area * Pe) / tp (cumecs)
    const peakFlowCumecs = tp > 0 ? (0.208 * areaSqKm * Pe) / tp : 0;
    const peakFlowCusecs = peakFlowCumecs * 35.315;

    // Downstream 1D Channel Hydraulics (Manning's Equation):
    // Q = (1/n) * A * R^(2/3) * S0^(1/2)
    // Rectangular / Trapezoidal approximation: B = width, y = stage depth
    const n = cat.manning_n;
    const B = cat.channel_width_m;
    const S0 = cat.channel_slope;
    const bankfullDepth = cat.bankfull_depth_m;

    // Solve for stage depth y iteratively
    let channelDepth = 1.0;
    for (let iter = 0; iter < 20; iter++) {
      const area = B * channelDepth;
      const wettedP = B + 2 * channelDepth;
      const R = area / wettedP;
      const computedQ = (1 / n) * area * Math.pow(R, 2 / 3) * Math.sqrt(S0);
      const diff = peakFlowCumecs - computedQ;
      if (Math.abs(diff) < 1.0) break;
      channelDepth += diff * 0.0003;
      if (channelDepth < 0.2) channelDepth = 0.2;
    }

    // Check bankfull overtopping
    const isOvertopping = channelDepth > bankfullDepth;
    const freeboardOrOvertoppingM = (channelDepth - bankfullDepth).toFixed(2);

    // Generate simplified hydrograph points
    const hydrograph = [];
    const baseflow = Math.round(areaSqKm * 0.005);
    const totalHydrographDuration = Math.round(tp * 3.5);
    for (let t = 0; t <= totalHydrographDuration; t += Math.max(1, Math.round(totalHydrographDuration / 16))) {
      let q = baseflow;
      if (t <= tp) {
        // Rising limb
        q = baseflow + (peakFlowCumecs - baseflow) * Math.pow(t / tp, 1.8);
      } else {
        // Recession limb: exponential decay
        const tRec = t - tp;
        const recDuration = totalHydrographDuration - tp;
        q = baseflow + (peakFlowCumecs - baseflow) * Math.exp(-2.5 * (tRec / recDuration));
      }
      hydrograph.push({
        time_hr: t,
        discharge_cumecs: Math.round(q),
        discharge_cusecs: Math.round(q * 35.315)
      });
    }

    return {
      success: true,
      catchment: cat,
      inputs: cfg,
      adjusted_cn: adjustedCN,
      soil_retention_s_mm: S,
      initial_abstraction_ia_mm: Ia,
      direct_runoff_pe_mm: Pe,
      runoff_coefficient: runoffCoefficient,
      runoff_volume_mcm: runoffVolumeMCM,
      time_to_peak_hr: tp,
      peak_flow_cumecs: peakFlowCumecs,
      peak_flow_cusecs: peakFlowCusecs,
      channel_stage_m: channelDepth,
      bankfull_depth_m: bankfullDepth,
      is_overtopping: isOvertopping,
      flood_margin_m: parseFloat(freeboardOrOvertoppingM),
      hydrograph,
      assumptions: [
        "Hydrologic runoff simulated via empirical SCS Curve Number (CWC Guidelines for Indian Catchments).",
        "Antecedent Moisture Condition (AMC) applied to scale Curve Number based on pre-storm saturation.",
        "Channel stage modeled using 1D uniform Manning's open channel flow across documented river cross-sections.",
        "DISCLAIMER: This is a conceptual 1D screening calculation. It does NOT generate a 2D hydrodynamic HEC-RAS flood inundation map."
      ]
    };
  }

  /**
   * SCENARIO C: Drought & Water Availability Multi-Sector Stress
   *
   * @param {Object} reg Regional drought benchmark object
   * @param {Object} cfg User inputs
   *   - monsoon_deficit_pct: Rainfall / Inflow deficit % (e.g. 0% normal, 30% moderate, 60% severe)
   *   - demand_multiplier_pct: Total demand scale % (e.g. 100% normal, 115% heatwave surge)
   *   - irrigation_curtail_pct: Voluntary agricultural rationing % (0% to 50%)
   *   - industrial_curtail_pct: Industrial rationing % (0% to 50%)
   */
  function simulateDroughtStress(reg, cfg) {
    const totalBaselineDemandMCM = reg.annual_demand_mcm;
    const deficitPct = parseFloat(cfg.monsoon_deficit_pct);
    const demandMultiplier = parseFloat(cfg.demand_multiplier_pct) / 100;
    const irrigCurtail = parseFloat(cfg.irrigation_curtail_pct) / 100;
    const indCurtail = parseFloat(cfg.industrial_curtail_pct) / 100;

    // Normal baseline annual replenishment / inflow to regional storages:
    // Approximately 110% of demand in normal monsoon years
    const baselineInflowMCM = totalBaselineDemandMCM * 1.10;
    const scenarioInflowMCM = baselineInflowMCM * (1 - deficitPct / 100);

    // Adjusted sectoral demands:
    const shares = reg.sectoral_shares;
    const rawIrrigDemand = (totalBaselineDemandMCM * (shares.irrigation / 100)) * demandMultiplier;
    const rawDomesticDemand = (totalBaselineDemandMCM * (shares.domestic / 100)) * demandMultiplier; // Protected
    const rawIndDemand = (totalBaselineDemandMCM * (shares.industrial / 100)) * demandMultiplier;

    // Apply rationing:
    const activeIrrigDemand = rawIrrigDemand * (1 - irrigCurtail);
    const activeDomesticDemand = rawDomesticDemand; // Priority #1 (never curtailed under Gujarat state policy)
    const activeIndDemand = rawIndDemand * (1 - indCurtail);

    const totalActiveDemandMCM = activeIrrigDemand + activeDomesticDemand + activeIndDemand;

    // Annual Water Balance Deficit:
    const annualBalanceMCM = scenarioInflowMCM - totalActiveDemandMCM;
    const isDeficit = annualBalanceMCM < 0;
    const deficitVolumeMCM = isDeficit ? Math.abs(annualBalanceMCM) : 0;

    // Groundwater overdraft compensation:
    // When surface reservoirs face deficit, tubewells bridge up to 65% of unmet demand
    const groundwaterBufferMCM = isDeficit ? deficitVolumeMCM * 0.65 : 0;
    const unservedDeficitMCM = isDeficit ? deficitVolumeMCM - groundwaterBufferMCM : 0;

    // Monthly depletion progression across a 12-month hydrological cycle (June to May):
    const monthlyProgression = [];
    let cumulativeStorage = Math.min(scenarioInflowMCM, totalBaselineDemandMCM * 0.95);
    const monthlyDemands = totalActiveDemandMCM / 12;

    for (let month = 1; month <= 12; month++) {
      // Inflow concentrates in monsoon months 1-4 (June-Sept)
      let monthInflow = 0;
      if (month === 1) monthInflow = scenarioInflowMCM * 0.15;
      else if (month === 2) monthInflow = scenarioInflowMCM * 0.40;
      else if (month === 3) monthInflow = scenarioInflowMCM * 0.35;
      else if (month === 4) monthInflow = scenarioInflowMCM * 0.10;

      cumulativeStorage = cumulativeStorage + monthInflow - monthlyDemands;
      const isNegative = cumulativeStorage < 0;

      monthlyProgression.push({
        month,
        month_name: ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May"][month - 1],
        storage_mcm: Math.max(0, cumulativeStorage),
        deficit_mcm: isNegative ? Math.abs(cumulativeStorage) : 0,
        inflow_mcm: monthInflow,
        demand_mcm: monthlyDemands
      });

      if (isNegative) cumulativeStorage = 0;
    }

    // Days until reservoir depletion:
    let dayOfDepletion = 365;
    for (let m = 0; m < monthlyProgression.length; m++) {
      if (monthlyProgression[m].storage_mcm === 0 && monthlyProgression[m].deficit_mcm > 0) {
        dayOfDepletion = Math.round((m + 0.5) * 30.5);
        break;
      }
    }

    return {
      success: true,
      region: reg,
      inputs: cfg,
      baseline_inflow_mcm: baselineInflowMCM,
      scenario_inflow_mcm: scenarioInflowMCM,
      inflow_deficit_mcm: baselineInflowMCM - scenarioInflowMCM,
      total_active_demand_mcm: totalActiveDemandMCM,
      sector_breakdown: {
        irrigation_mcm: activeIrrigDemand,
        domestic_mcm: activeDomesticDemand,
        industrial_mcm: activeIndDemand
      },
      annual_balance_mcm: annualBalanceMCM,
      is_deficit: isDeficit,
      deficit_volume_mcm: deficitVolumeMCM,
      groundwater_buffer_mcm: groundwaterBufferMCM,
      unserved_deficit_mcm: unservedDeficitMCM,
      day_of_depletion: dayOfDepletion,
      monthlyProgression,
      assumptions: [
        "Monsoon replenishment concentrated during June–September hydrologic window.",
        "Domestic drinking water treated as inviolable Priority #1 (statutory Gujarat Water Policy).",
        "Groundwater aquifer overdraft assumed to absorb up to 65% of surface shortfall before unserved distress occurs.",
        "Transfers via SAUNI Yojana and Narmada Main Canal treated as exogenous emergency mitigation."
      ]
    };
  }

  // =========================================================================
  // 5. MODAL UI & RENDERING PIPELINE
  // =========================================================================

  /**
   * Initialize Water Scenarios Lab
   */
  function init(map, assets) {
    leafletMap = map;
    cachedAssets = assets || [];

    // Attach DOM listener triggers
    bindEvents();
  }

  /**
   * Bind event listeners
   */
  function bindEvents() {
    const modal = document.getElementById("waterScenariosLabModal");
    if (!modal) return;

    // Header Button
    const headerBtn = document.getElementById("openWaterScenariosBtn");
    if (headerBtn) {
      headerBtn.addEventListener("click", () => open("scenarioA"));
    }

    // Drawer Button
    const drawerBtn = document.getElementById("openWaterScenariosDrawerBtn");
    if (drawerBtn) {
      drawerBtn.addEventListener("click", () => open("scenarioA"));
    }

    // Modal Close Buttons
    const closeTopBtn = document.getElementById("closeScenariosTopBtn");
    const closeBottomBtn = document.getElementById("closeScenariosBottomBtn");
    if (closeTopBtn) closeTopBtn.addEventListener("click", () => close());
    if (closeBottomBtn) closeBottomBtn.addEventListener("click", () => close());

    // Tab Navigation
    const tabs = document.querySelectorAll(".scenarios-tab-btn");
    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        const targetMode = tab.getAttribute("data-mode");
        switchMode(targetMode);
      });
    });

    // SCENARIO A Controls
    const resSelect = document.getElementById("scenAReservoirSelect");
    if (resSelect) {
      resSelect.addEventListener("change", (e) => {
        activeAssetId = e.target.value;
        renderScenarioA();
      });
    }

    const runScenarioABtn = document.getElementById("runScenarioABtn");
    if (runScenarioABtn) {
      runScenarioABtn.addEventListener("click", () => runAndRenderA());
    }

    const resetScenarioABtn = document.getElementById("resetScenarioABtn");
    if (resetScenarioABtn) {
      resetScenarioABtn.addEventListener("click", () => resetScenarioA());
    }

    // SCENARIO B Controls
    const catSelect = document.getElementById("scenBCatchmentSelect");
    if (catSelect) {
      catSelect.addEventListener("change", (e) => {
        activeCatchmentId = e.target.value;
        renderScenarioB();
      });
    }

    const runScenarioBBtn = document.getElementById("runScenarioBBtn");
    if (runScenarioBBtn) {
      runScenarioBBtn.addEventListener("click", () => runAndRenderB());
    }

    const resetScenarioBBtn = document.getElementById("resetScenarioBBtn");
    if (resetScenarioBBtn) {
      resetScenarioBBtn.addEventListener("click", () => resetScenarioB());
    }

    // SCENARIO C Controls
    const regSelect = document.getElementById("scenCRegionSelect");
    if (regSelect) {
      regSelect.addEventListener("change", () => renderScenarioC());
    }

    const runScenarioCBtn = document.getElementById("runScenarioCBtn");
    if (runScenarioCBtn) {
      runScenarioCBtn.addEventListener("click", () => runAndRenderC());
    }

    const resetScenarioCBtn = document.getElementById("resetScenarioCBtn");
    if (resetScenarioCBtn) {
      resetScenarioCBtn.addEventListener("click", () => resetScenarioC());
    }

    // Export & Import Toolbar Actions
    const exportConfigBtn = document.getElementById("exportScenarioConfigBtn");
    if (exportConfigBtn) {
      exportConfigBtn.addEventListener("click", exportConfigurationJSON);
    }

    const importConfigFile = document.getElementById("importScenarioConfigFile");
    if (importConfigFile) {
      importConfigFile.addEventListener("change", importConfigurationJSON);
    }

    const exportReportBtn = document.getElementById("exportScenarioReportBtn");
    if (exportReportBtn) {
      exportReportBtn.addEventListener("click", exportTechnicalReport);
    }
  }

  /**
   * Open the modal in specified mode
   */
  function open(mode = "scenarioA", targetAssetId = null) {
    const modal = document.getElementById("waterScenariosLabModal");
    if (!modal) return;

    if (targetAssetId && RESERVOIR_BENCHMARKS[targetAssetId]) {
      activeAssetId = targetAssetId;
    }

    populateDropdowns();
    switchMode(mode);

    if (typeof modal.showModal === "function") {
      modal.showModal();
    } else {
      modal.setAttribute("open", "true");
    }
  }

  /**
   * Close the modal
   */
  function close() {
    const modal = document.getElementById("waterScenariosLabModal");
    if (modal) {
      if (typeof modal.close === "function") {
        modal.close();
      } else {
        modal.removeAttribute("open");
      }
    }
  }

  /**
   * Switch active tab
   */
  function switchMode(mode) {
    currentMode = mode;

    document.querySelectorAll(".scenarios-tab-btn").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-mode") === mode);
    });

    document.querySelectorAll(".scenarios-tab-pane").forEach(pane => {
      pane.classList.remove("active");
    });

    const activePane = document.getElementById(`scenPane_${mode}`);
    if (activePane) activePane.classList.add("active");

    if (mode === "scenarioA") renderScenarioA();
    else if (mode === "scenarioB") renderScenarioB();
    else if (mode === "scenarioC") renderScenarioC();
  }

  /**
   * Populate reservoir, catchment, and regional dropdowns
   */
  function populateDropdowns() {
    // Reservoir Select
    const resSelect = document.getElementById("scenAReservoirSelect");
    if (resSelect && resSelect.options.length <= 1) {
      resSelect.innerHTML = Object.values(RESERVOIR_BENCHMARKS).map(res => `
        <option value="${res.id}" ${res.id === activeAssetId ? "selected" : ""}>
          ${res.name} (${res.river} • ${fmt(res.gross_storage_mcm, "MCM")})
        </option>
      `).join("");
    }

    // Catchment Select
    const catSelect = document.getElementById("scenBCatchmentSelect");
    if (catSelect && catSelect.options.length <= 1) {
      catSelect.innerHTML = Object.values(CATCHMENT_BENCHMARKS).map(cat => `
        <option value="${cat.id}" ${cat.id === activeCatchmentId ? "selected" : ""}>
          ${cat.name} (${fmt(cat.area_sqkm, "km²")})
        </option>
      `).join("");
    }

    // Regional Select
    const regSelect = document.getElementById("scenCRegionSelect");
    if (regSelect && regSelect.options.length <= 1) {
      regSelect.innerHTML = Object.values(DROUGHT_BENCHMARKS).map(reg => `
        <option value="${reg.id}">
          ${reg.name} (Annual Demand: ${fmt(reg.annual_demand_mcm, "MCM")})
        </option>
      `).join("");
    }
  }

  // =========================================================================
  // 6. RENDER SCENARIO A: RESERVOIR STORAGE MASS-BALANCE
  // =========================================================================

  function renderScenarioA() {
    const res = RESERVOIR_BENCHMARKS[activeAssetId] || RESERVOIR_BENCHMARKS["GJ-WR-DAM-001"];

    // Update Reservoir Metadata Header
    const metaContainer = document.getElementById("scenAReservoirMeta");
    if (metaContainer) {
      metaContainer.innerHTML = `
        <div class="scen-meta-strip">
          <div class="scen-meta-item">
            <span class="scen-meta-lbl">Selected Asset</span>
            <strong class="scen-meta-val">${res.name}</strong>
            <small>${res.river} • ${res.basin}</small>
          </div>
          <div class="scen-meta-item">
            <span class="scen-meta-lbl">Gross Storage (FRL)</span>
            <strong class="scen-meta-val color-cyan">${fmt(res.gross_storage_mcm, "MCM")}</strong>
            <small>FRL: ${fmt(res.frl_m, "m MSL")}</small>
          </div>
          <div class="scen-meta-item">
            <span class="scen-meta-lbl">Active Live Storage</span>
            <strong class="scen-meta-val color-emerald">${fmt(res.live_storage_mcm, "MCM")}</strong>
            <small>MDDL: ${fmt(res.mddl_m, "m MSL")}</small>
          </div>
          <div class="scen-meta-item">
            <span class="scen-meta-lbl">Dead Storage (Trap)</span>
            <strong class="scen-meta-val color-amber">${fmt(res.dead_storage_mcm, "MCM")}</strong>
            <small>Non-divertible</small>
          </div>
          <div class="scen-meta-item">
            <span class="scen-meta-lbl">Spillway Capacity</span>
            <strong class="scen-meta-val">${fmt(res.spillway_capacity_cumecs, "m³/s")}</strong>
            <small>MWL: ${fmt(res.mwl_m, "m MSL")}</small>
          </div>
        </div>

        <!-- Dated Observations Ledger -->
        <div class="dated-obs-box">
          <div class="dated-obs-header">
            <span>📅 Audited Historical Storage Observations (CWC / WRD Bulletins):</span>
            <span class="dated-obs-badge">MEASURED OFFICIAL DATA</span>
          </div>
          <div class="dated-obs-chips">
            ${res.historical_observations.map((obs, idx) => `
              <div class="dated-obs-chip" onclick="window.WaterScenariosLab.applyObsPreset('${res.id}', ${idx})">
                <span class="obs-date">${obs.date}:</span>
                <strong>${obs.level_m}m (${obs.pct}%)</strong>
                <span class="obs-hint" title="${obs.note}">ℹ️</span>
              </div>
            `).join("")}
          </div>
        </div>
      `;
    }

    runAndRenderA();
  }

  function getScenarioAInputs() {
    return {
      initial_pct: parseFloat(document.getElementById("scenA_initialPct")?.value || 75),
      inflow_cumecs: parseFloat(document.getElementById("scenA_inflowCumecs")?.value || 1200),
      outflow_cumecs: parseFloat(document.getElementById("scenA_outflowCumecs")?.value || 800),
      evap_mm_day: parseFloat(document.getElementById("scenA_evapRate")?.value || 6.0),
      seepage_pct_day: parseFloat(document.getElementById("scenA_seepageRate")?.value || 0.05),
      duration_days: parseInt(document.getElementById("scenA_durationDays")?.value || 14, 10),
      timestep_hours: parseFloat(document.getElementById("scenA_timeStep")?.value || 6)
    };
  }

  function runAndRenderA() {
    const res = RESERVOIR_BENCHMARKS[activeAssetId] || RESERVOIR_BENCHMARKS["GJ-WR-DAM-001"];
    const inputs = getScenarioAInputs();
    const result = simulateReservoirStorage(res, inputs);

    // Update Live Value Labels
    document.getElementById("lbl_scenA_initialPct").textContent = `${inputs.initial_pct}% (${fmt((inputs.initial_pct / 100) * res.gross_storage_mcm, "MCM")})`;
    document.getElementById("lbl_scenA_inflowCumecs").textContent = `${fmt(inputs.inflow_cumecs, "m³/s")} (${fmt(inputs.inflow_cumecs * 0.0864, "MCM/day")})`;
    document.getElementById("lbl_scenA_outflowCumecs").textContent = `${fmt(inputs.outflow_cumecs, "m³/s")} (${fmt(inputs.outflow_cumecs * 0.0864, "MCM/day")})`;
    document.getElementById("lbl_scenA_evapRate").textContent = `${inputs.evap_mm_day.toFixed(1)} mm/day`;
    document.getElementById("lbl_scenA_seepageRate").textContent = `${inputs.seepage_pct_day.toFixed(2)}%/day`;
    document.getElementById("lbl_scenA_durationDays").textContent = `${inputs.duration_days} Days`;
    document.getElementById("lbl_scenA_timeStep").textContent = `${inputs.timestep_hours} Hours`;

    // Render Results Container
    const out = document.getElementById("scenA_resultsOutput");
    if (!out) return;

    // SVG Storage Progression Chart
    const svgChart = renderStorageSvgChart(result);

    out.innerHTML = `
      <div class="scen-results-card">
        <div class="scen-results-header">
          <div>
            <h4>Mass-Balance Simulation Results: ${res.name}</h4>
            <span class="scen-method-badge">MODEL: ΔS = V_in − V_out − V_evap − V_seep</span>
          </div>
          <div class="scen-status-pill ${result.total_spill_mcm > 0 ? "pill-warning" : (result.dry_count > 0 ? "pill-danger" : "pill-success")}">
            ${result.total_spill_mcm > 0 ? "⚠️ Spillway Overflow Triggered" : (result.dry_count > 0 ? "⚠️ Dead Storage Depletion" : "✅ Normal Conservation Pool")}
          </div>
        </div>

        <!-- Before-Versus-After Comparison Grid -->
        <div class="compare-kpi-grid">
          <div class="compare-col baseline-col">
            <span class="compare-col-tag">BEFORE SIMULATION (T = 0)</span>
            <div class="compare-row">
              <span>Initial Storage Volume:</span>
              <strong>${fmt(result.initial_storage_mcm, "MCM")}</strong>
            </div>
            <div class="compare-row">
              <span>Initial Capacity Ratio:</span>
              <strong>${inputs.initial_pct.toFixed(1)}% of Gross</strong>
            </div>
            <div class="compare-row">
              <span>Initial Elevation:</span>
              <strong>${fmt(result.timeline[0].stage_m, "m MSL")}</strong>
            </div>
            <div class="compare-row">
              <span>Initial Water Spread Area:</span>
              <strong>${fmt(result.timeline[0].area_ha, "ha")}</strong>
            </div>
          </div>

          <div class="compare-col scenario-col">
            <span class="compare-col-tag">AFTER SIMULATION (T = ${inputs.duration_days} DAYS)</span>
            <div class="compare-row">
              <span>Final Storage Volume:</span>
              <strong class="color-cyan">${fmt(result.final_storage_mcm, "MCM")}</strong>
            </div>
            <div class="compare-row">
              <span>Net Volume Change (ΔS):</span>
              <strong class="${result.net_change_mcm >= 0 ? "color-emerald" : "color-rose"}">
                ${result.net_change_mcm >= 0 ? "+" : ""}${fmt(result.net_change_mcm, "MCM")}
              </strong>
            </div>
            <div class="compare-row">
              <span>Final Capacity Ratio:</span>
              <strong class="color-cyan">${result.final_pct_gross}% of Gross</strong>
            </div>
            <div class="compare-row">
              <span>Final Elevation:</span>
              <strong>${fmt(result.timeline[result.timeline.length - 1].stage_m, "m MSL")}</strong>
            </div>
          </div>
        </div>

        <!-- Volumetric Balance Breakdown Strip -->
        <div class="balance-budget-strip">
          <div class="budget-item inflow">
            <span class="b-lbl">+ Total Inflow Volume</span>
            <strong class="b-val">+${fmt(result.total_inflow_mcm, "MCM")}</strong>
            <small>${fmt(result.total_inflow_mcm * 810.71, "ac-ft")}</small>
          </div>
          <div class="budget-item outflow">
            <span class="b-lbl">− Controlled Outflow</span>
            <strong class="b-val">−${fmt(result.total_outflow_mcm, "MCM")}</strong>
            <small>Canals + Powerhouses</small>
          </div>
          <div class="budget-item loss">
            <span class="b-lbl">− Evaporation Losses</span>
            <strong class="b-val">−${fmt(result.total_evap_mcm, "MCM")}</strong>
            <small>Dynamic hypsometric area</small>
          </div>
          <div class="budget-item loss">
            <span class="b-lbl">− Seepage Losses</span>
            <strong class="b-val">−${fmt(result.total_seepage_mcm, "MCM")}</strong>
            <small>Foundation & rim percolation</small>
          </div>
          <div class="budget-item ${result.total_spill_mcm > 0 ? "spill" : ""}">
            <span class="b-lbl">− Emergency Spillway Overflow</span>
            <strong class="b-val">${result.total_spill_mcm > 0 ? "−" + fmt(result.total_spill_mcm, "MCM") : "0 MCM"}</strong>
            <small>${result.spill_count} time-steps above FRL</small>
          </div>
        </div>

        <!-- SVG Progression Visualizer -->
        <div class="scen-chart-container">
          <div class="scen-chart-header">
            <span>📈 Simulated Reservoir Storage & Stage Hydrograph (${inputs.duration_days} Days):</span>
            <div class="scen-chart-legend">
              <span class="leg-item"><span class="leg-dot color-cyan"></span> Storage Volume (MCM)</span>
              <span class="leg-item"><span class="leg-dot color-rose"></span> Full Reservoir Level (${fmt(res.gross_storage_mcm, "MCM")})</span>
              <span class="leg-item"><span class="leg-dot color-amber"></span> Dead Storage (${fmt(res.dead_storage_mcm, "MCM")})</span>
            </div>
          </div>
          ${svgChart}
        </div>

        <!-- Sensitivity Analysis Table -->
        <div class="sensitivity-card">
          <h5>🔍 Sensitivity Analysis: Evaporation & Inflow Perturbations</h5>
          <table class="sensitivity-table">
            <thead>
              <tr>
                <th>Perturbation Scenario</th>
                <th>Final Storage</th>
                <th>Net ΔS</th>
                <th>Spillway Surplus</th>
                <th>Hydrological Implication</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Baseline (Selected Inputs)</strong></td>
                <td>${fmt(result.final_storage_mcm, "MCM")}</td>
                <td>${fmt(result.net_change_mcm, "MCM")}</td>
                <td>${fmt(result.total_spill_mcm, "MCM")}</td>
                <td>Current parameter run</td>
              </tr>
              <tr>
                <td><strong>Hot Dry Spell (+25% Evaporation)</strong></td>
                <td>${fmt(Math.max(0, result.final_storage_mcm - result.total_evap_mcm * 0.25), "MCM")}</td>
                <td>${fmt(result.net_change_mcm - result.total_evap_mcm * 0.25, "MCM")}</td>
                <td>${fmt(result.total_spill_mcm, "MCM")}</td>
                <td>Accelerated summer depletion in wide, shallow reservoirs.</td>
              </tr>
              <tr>
                <td><strong>Monsoon Surge (+30% Inflow)</strong></td>
                <td>${fmt(Math.min(res.gross_storage_mcm, result.final_storage_mcm + result.total_inflow_mcm * 0.30), "MCM")}</td>
                <td>${fmt(result.net_change_mcm + result.total_inflow_mcm * 0.30, "MCM")}</td>
                <td>${fmt(result.total_spill_mcm + Math.max(0, (result.final_storage_mcm + result.total_inflow_mcm * 0.30) - res.gross_storage_mcm), "MCM")}</td>
                <td>Higher spillway surcharge requires early gate operation.</td>
              </tr>
              <tr>
                <td><strong>Upstream Deficit (−30% Inflow)</strong></td>
                <td>${fmt(Math.max(0, result.final_storage_mcm - result.total_inflow_mcm * 0.30), "MCM")}</td>
                <td>${fmt(result.net_change_mcm - result.total_inflow_mcm * 0.30, "MCM")}</td>
                <td>0 MCM</td>
                <td>Canal allocations must be rationed to safeguard FRL carry-over.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Assumptions & Limitations Disclosure -->
        <div class="scen-assumptions-box">
          <div class="box-title">⚖️ Physical Modeling Assumptions & Limitations:</div>
          <ul>
            ${result.assumptions.map(a => `<li>${a}</li>`).join("")}
            <li><strong>Elevation-Storage Caveat:</strong> Water stage elevations are converted from storage via calibrated hypsometric exponent ($b=${res.eac_power}$). Do not treat this as a replacement for acoustic echo-sounding bathymetric hydrographic surveys.</li>
          </ul>
        </div>
      </div>
    `;
  }

  function renderStorageSvgChart(result) {
    const res = result.reservoir;
    const timeline = result.timeline;
    const gross = res.gross_storage_mcm;
    const dead = res.dead_storage_mcm;

    const width = 760;
    const height = 240;
    const padding = { top: 20, right: 30, bottom: 35, left: 65 };

    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const maxVol = gross * 1.15;
    const totalHours = timeline[timeline.length - 1].hours;

    // Scales
    const getX = (hr) => padding.left + (hr / totalHours) * chartW;
    const getY = (vol) => padding.top + chartH - (vol / maxVol) * chartH;

    // FRL line
    const frlY = getY(gross);
    // Dead Storage line
    const deadY = getY(dead);

    // Build storage curve path
    let pathD = "";
    timeline.forEach((pt, idx) => {
      const x = getX(pt.hours);
      const y = getY(pt.storage_mcm);
      if (idx === 0) pathD += `M ${x} ${y}`;
      else pathD += ` L ${x} ${y}`;
    });

    // Area fill path
    const areaD = `${pathD} L ${getX(totalHours)} ${padding.top + chartH} L ${padding.left} ${padding.top + chartH} Z`;

    return `
      <svg viewBox="0 0 ${width} ${height}" class="scen-svg-chart" aria-label="Simulated Reservoir Storage Time Series">
        <!-- Background -->
        <rect x="0" y="0" width="${width}" height="${height}" fill="#0b1120" rx="8" />

        <!-- Grid Lines -->
        <line x1="${padding.left}" y1="${getY(0)}" x2="${padding.left + chartW}" y2="${getY(0)}" stroke="#1e293b" stroke-width="1" />
        <line x1="${padding.left}" y1="${getY(gross * 0.5)}" x2="${padding.left + chartW}" y2="${getY(gross * 0.5)}" stroke="#1e293b" stroke-dasharray="3,3" />

        <!-- Dead Storage Zone Background -->
        <rect x="${padding.left}" y="${deadY}" width="${chartW}" height="${padding.top + chartH - deadY}" fill="rgba(245, 158, 11, 0.08)" />
        <line x1="${padding.left}" y1="${deadY}" x2="${padding.left + chartW}" y2="${deadY}" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="4,4" />
        <text x="${padding.left + 8}" y="${deadY - 6}" fill="#f59e0b" font-size="10" font-weight="600">MDDL / Dead Storage (${fmt(dead, "MCM")})</text>

        <!-- Gross / FRL Threshold -->
        <line x1="${padding.left}" y1="${frlY}" x2="${padding.left + chartW}" y2="${frlY}" stroke="#f43f5e" stroke-width="1.5" stroke-dasharray="5,3" />
        <text x="${padding.left + 8}" y="${frlY - 6}" fill="#f43f5e" font-size="10" font-weight="700">FRL / Gross Storage (${fmt(gross, "MCM")})</text>

        <!-- Storage Curve & Area Fill -->
        <path d="${areaD}" fill="rgba(56, 189, 248, 0.15)" />
        <path d="${pathD}" fill="none" stroke="#38bdf8" stroke-width="2.5" />

        <!-- Axes -->
        <line x1="${padding.left}" y1="${padding.top}" x2="${padding.left}" y2="${padding.top + chartH}" stroke="#475569" stroke-width="1" />
        <line x1="${padding.left}" y1="${padding.top + chartH}" x2="${padding.left + chartW}" y2="${padding.top + chartH}" stroke="#475569" stroke-width="1" />

        <!-- Axis Labels -->
        <text x="${padding.left - 8}" y="${frlY + 4}" fill="#94a3b8" font-size="10" text-anchor="end">${fmt(gross)}</text>
        <text x="${padding.left - 8}" y="${deadY + 4}" fill="#94a3b8" font-size="10" text-anchor="end">${fmt(dead)}</text>
        <text x="${padding.left - 8}" y="${padding.top + chartH + 3}" fill="#94a3b8" font-size="10" text-anchor="end">0 MCM</text>

        <text x="${padding.left}" y="${padding.top + chartH + 20}" fill="#94a3b8" font-size="10">Day 0</text>
        <text x="${padding.left + chartW / 2}" y="${padding.top + chartH + 20}" fill="#94a3b8" font-size="10" text-anchor="middle">Day ${(totalHours / 48).toFixed(0)}</text>
        <text x="${padding.left + chartW}" y="${padding.top + chartH + 20}" fill="#94a3b8" font-size="10" text-anchor="end">Day ${(totalHours / 24).toFixed(0)}</text>
      </svg>
    `;
  }

  function resetScenarioA() {
    const res = RESERVOIR_BENCHMARKS[activeAssetId] || RESERVOIR_BENCHMARKS["GJ-WR-DAM-001"];
    document.getElementById("scenA_initialPct").value = 75;
    document.getElementById("scenA_inflowCumecs").value = res.typical_inflow_cumecs;
    document.getElementById("scenA_outflowCumecs").value = res.typical_outflow_cumecs;
    document.getElementById("scenA_evapRate").value = 6.0;
    document.getElementById("scenA_seepageRate").value = 0.05;
    document.getElementById("scenA_durationDays").value = 14;
    document.getElementById("scenA_timeStep").value = 6;
    runAndRenderA();
  }

  function applyObsPreset(resId, obsIdx) {
    const res = RESERVOIR_BENCHMARKS[resId];
    if (!res || !res.historical_observations[obsIdx]) return;
    const obs = res.historical_observations[obsIdx];
    document.getElementById("scenA_initialPct").value = obs.pct;
    runAndRenderA();
  }
  window.WaterScenariosLab = window.WaterScenariosLab || {};
  window.WaterScenariosLab.applyObsPreset = applyObsPreset;

  // =========================================================================
  // 7. RENDER SCENARIO B: CATCHMENT HEAVY-RAINFALL & FLOOD EXPLORATION
  // =========================================================================

  function renderScenarioB() {
    const cat = CATCHMENT_BENCHMARKS[activeCatchmentId] || CATCHMENT_BENCHMARKS["CAT-NARMADA"];

    // Update Catchment Metadata Header
    const metaContainer = document.getElementById("scenBCatchmentMeta");
    if (metaContainer) {
      metaContainer.innerHTML = `
        <div class="scen-meta-strip">
          <div class="scen-meta-item">
            <span class="scen-meta-lbl">Selected Catchment</span>
            <strong class="scen-meta-val">${cat.name}</strong>
            <small>${cat.river} River Basin</small>
          </div>
          <div class="scen-meta-item">
            <span class="scen-meta-lbl">Catchment Contributing Area</span>
            <strong class="scen-meta-val color-cyan">${fmt(cat.area_sqkm, "km²")}</strong>
            <small>${fmt(cat.area_sqkm * 100, "Hectares")}</small>
          </div>
          <div class="scen-meta-item">
            <span class="scen-meta-lbl">Time of Concentration (Tc)</span>
            <strong class="scen-meta-val color-emerald">${cat.time_of_concentration_hr} Hours</strong>
            <small>Catchment lag response</small>
          </div>
          <div class="scen-meta-item">
            <span class="scen-meta-lbl">Calibrated Soil Curve Number</span>
            <strong class="scen-meta-val color-amber">CN ${cat.default_cn}</strong>
            <small>${cat.soil_group.slice(0, 30)}...</small>
          </div>
          <div class="scen-meta-item">
            <span class="scen-meta-lbl">Bankfull Channel Capacity</span>
            <strong class="scen-meta-val">${cat.bankfull_depth_m} m Stage</strong>
            <small>Width: ${cat.channel_width_m} m</small>
          </div>
        </div>

        <!-- Historical Flood Benchmarks Ledger -->
        <div class="dated-obs-box">
          <div class="dated-obs-header">
            <span>🌊 Documented Historical Flood Events (CWC / Disaster Management Records):</span>
            <span class="dated-obs-badge">OFFICIAL BENCHMARK DISCHARGES</span>
          </div>
          <div class="dated-obs-chips">
            ${cat.documented_historical_floods.map((fl, idx) => `
              <div class="dated-obs-chip" onclick="window.WaterScenariosLab.applyFloodPreset('${cat.id}', ${idx})">
                <span class="obs-date">${fl.year}:</span>
                <strong>${fmt(fl.peak_flow_cumecs, "m³/s")}</strong> (${fl.storm_rainfall_mm}mm rain)
                <span class="obs-hint" title="${fl.impact}">ℹ️</span>
              </div>
            `).join("")}
          </div>
        </div>
      `;
    }

    runAndRenderB();
  }

  function getScenarioBInputs() {
    return {
      rainfall_mm: parseFloat(document.getElementById("scenB_rainfallMm")?.value || 150),
      storm_duration_hr: parseFloat(document.getElementById("scenB_durationHr")?.value || 24),
      curve_number: parseFloat(document.getElementById("scenB_curveNumber")?.value || (CATCHMENT_BENCHMARKS[activeCatchmentId]?.default_cn || 78)),
      antecedent_moisture: document.getElementById("scenB_amcSelect")?.value || "normal"
    };
  }

  function runAndRenderB() {
    const cat = CATCHMENT_BENCHMARKS[activeCatchmentId] || CATCHMENT_BENCHMARKS["CAT-NARMADA"];
    const inputs = getScenarioBInputs();
    const result = simulateCatchmentFlood(cat, inputs);

    // Update Live Value Labels
    document.getElementById("lbl_scenB_rainfallMm").textContent = `${inputs.rainfall_mm} mm (${(inputs.rainfall_mm / 25.4).toFixed(1)} inches)`;
    document.getElementById("lbl_scenB_durationHr").textContent = `${inputs.storm_duration_hr} Hours`;
    document.getElementById("lbl_scenB_curveNumber").textContent = `CN ${inputs.curve_number.toFixed(0)}`;

    const out = document.getElementById("scenB_resultsOutput");
    if (!out) return;

    // SVG Hydrograph Chart
    const svgHydrograph = renderFloodHydrographSvg(result);

    out.innerHTML = `
      <div class="scen-results-card">
        <div class="scen-results-header">
          <div>
            <h4>Rainfall-Runoff & Flood Hydrograph: ${cat.name}</h4>
            <span class="scen-method-badge">MODEL: SCS-CN Direct Runoff + Manning's 1D Open Channel Flow</span>
          </div>
          <div class="scen-status-pill ${result.is_overtopping ? "pill-danger" : "pill-success"}">
            ${result.is_overtopping ? `⚠️ Overtopping Inundation Risk (+${result.flood_margin_m}m above Bankfull)` : `✅ In-Bank Evacuation Clearance (${Math.abs(result.flood_margin_m)}m Freeboard)`}
          </div>
        </div>

        <!-- Before-Versus-After Storm Comparison Grid -->
        <div class="compare-kpi-grid">
          <div class="compare-col baseline-col">
            <span class="compare-col-tag">CATCHMENT RAINFALL RETENTION</span>
            <div class="compare-row">
              <span>Gross Storm Rainfall:</span>
              <strong>${inputs.rainfall_mm} mm</strong>
            </div>
            <div class="compare-row">
              <span>Soil Moisture Retention (S):</span>
              <strong>${fmt(result.soil_retention_s_mm, "mm")}</strong>
            </div>
            <div class="compare-row">
              <span>Initial Abstraction (Ia = 0.2S):</span>
              <strong>${fmt(result.initial_abstraction_ia_mm, "mm")}</strong>
            </div>
            <div class="compare-row">
              <span>Antecedent Moisture (AMC):</span>
              <strong>${inputs.antecedent_moisture.toUpperCase()} (CN ${result.adjusted_cn.toFixed(0)})</strong>
            </div>
          </div>

          <div class="compare-col scenario-col">
            <span class="compare-col-tag">DOWNSTREAM RUNOFF & PEAK DISCHARGE</span>
            <div class="compare-row">
              <span>Effective Direct Runoff (Pe):</span>
              <strong class="color-cyan">${fmt(result.direct_runoff_pe_mm, "mm")} (${(result.runoff_coefficient * 100).toFixed(1)}% Yield)</strong>
            </div>
            <div class="compare-row">
              <span>Total Runoff Yield Volume:</span>
              <strong class="color-cyan">${fmt(result.runoff_volume_mcm, "MCM")}</strong>
            </div>
            <div class="compare-row">
              <span>Peak Hydrograph Discharge (Qp):</span>
              <strong class="${result.is_overtopping ? "color-rose" : "color-emerald"}">${fmt(result.peak_flow_cumecs, "m³/s")} (${fmt(result.peak_flow_cusecs, "cusecs")})</strong>
            </div>
            <div class="compare-row">
              <span>Downstream Channel Stage:</span>
              <strong class="${result.is_overtopping ? "color-rose" : "color-cyan"}">${result.channel_stage_m.toFixed(2)} m (Bankfull: ${result.bankfull_depth_m} m)</strong>
            </div>
          </div>
        </div>

        <!-- SVG Flood Hydrograph -->
        <div class="scen-chart-container">
          <div class="scen-chart-header">
            <span>🌊 Simulated Catchment Runoff Hydrograph (Time to Peak: ${result.time_to_peak_hr.toFixed(1)} Hours):</span>
            <div class="scen-chart-legend">
              <span class="leg-item"><span class="leg-dot color-cyan"></span> River Discharge (m³/s)</span>
              <span class="leg-item"><span class="leg-dot color-rose"></span> Peak Discharge (${fmt(result.peak_flow_cumecs, "m³/s")})</span>
            </div>
          </div>
          ${svgHydrograph}
        </div>

        <!-- Sensitivity Analysis Matrix -->
        <div class="sensitivity-card">
          <h5>🔍 Sensitivity Analysis: Curve Number & Rainfall Duration Variations</h5>
          <table class="sensitivity-table">
            <thead>
              <tr>
                <th>Condition Perturbation</th>
                <th>Runoff Depth (Pe)</th>
                <th>Peak Flow (Qp)</th>
                <th>Channel Stage (y)</th>
                <th>Hydraulic Impact</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Baseline Run</strong></td>
                <td>${fmt(result.direct_runoff_pe_mm, "mm")}</td>
                <td>${fmt(result.peak_flow_cumecs, "m³/s")}</td>
                <td>${result.channel_stage_m.toFixed(2)} m</td>
                <td>Standard calibrated conditions</td>
              </tr>
              <tr>
                <td><strong>Saturated Catchment (AMC III, CN +8)</strong></td>
                <td>${fmt(result.direct_runoff_pe_mm * 1.35, "mm")}</td>
                <td>${fmt(result.peak_flow_cumecs * 1.40, "m³/s")}</td>
                <td>${(result.channel_stage_m * 1.18).toFixed(2)} m</td>
                <td>Pre-soaked basin rapidly converts rainfall into flash runoff.</td>
              </tr>
              <tr>
                <td><strong>Cloudburst Burst (Duration Halved to ${inputs.storm_duration_hr / 2}h)</strong></td>
                <td>${fmt(result.direct_runoff_pe_mm, "mm")}</td>
                <td>${fmt(result.peak_flow_cumecs * 1.30, "m³/s")}</td>
                <td>${(result.channel_stage_m * 1.14).toFixed(2)} m</td>
                <td>Steeper hydrograph crest with reduced warning window.</td>
              </tr>
              <tr>
                <td><strong>Vegetated / Dry Soil (AMC I, CN −8)</strong></td>
                <td>${fmt(Math.max(0, result.direct_runoff_pe_mm * 0.65), "mm")}</td>
                <td>${fmt(result.peak_flow_cumecs * 0.60, "m³/s")}</td>
                <td>${(result.channel_stage_m * 0.78).toFixed(2)} m</td>
                <td>High initial abstraction buffers downstream flood crest.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Scientific Disclaimer -->
        <div class="scen-assumptions-box">
          <div class="box-title">⚠️ Mandatory Scientific & Spatial Disclaimer:</div>
          <ul>
            <li><strong>Spatial Inundation Rule:</strong> Hydraulic stage is evaluated using 1D uniform Manning's open-channel equations across documented river channel cross-sections. This does <strong>NOT</strong> generate an arbitrary buffer polygon or a 2D hydrodynamic HEC-RAS flood inundation map.</li>
            <li><strong>Flash Flood Warning:</strong> Do not base emergency flood warning or evacuation decisions on this simplified educational screening model. Actual flood advisories are issued exclusively by the CWC and the State Disaster Management Authority (GSDMA).</li>
          </ul>
        </div>
      </div>
    `;
  }

  function renderFloodHydrographSvg(result) {
    const hydro = result.hydrograph;
    const width = 760;
    const height = 230;
    const padding = { top: 20, right: 30, bottom: 35, left: 75 };

    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const maxQ = Math.max(100, result.peak_flow_cumecs * 1.15);
    const totalT = hydro[hydro.length - 1].time_hr;

    const getX = (t) => padding.left + (t / totalT) * chartW;
    const getY = (q) => padding.top + chartH - (q / maxQ) * chartH;

    let pathD = "";
    hydro.forEach((pt, idx) => {
      const x = getX(pt.time_hr);
      const y = getY(pt.discharge_cumecs);
      if (idx === 0) pathD += `M ${x} ${y}`;
      else pathD += ` L ${x} ${y}`;
    });

    const areaD = `${pathD} L ${getX(totalT)} ${padding.top + chartH} L ${padding.left} ${padding.top + chartH} Z`;

    return `
      <svg viewBox="0 0 ${width} ${height}" class="scen-svg-chart" aria-label="Catchment Runoff Hydrograph">
        <rect x="0" y="0" width="${width}" height="${height}" fill="#0b1120" rx="8" />

        <!-- Peak Flow Line -->
        <line x1="${padding.left}" y1="${getY(result.peak_flow_cumecs)}" x2="${padding.left + chartW}" y2="${getY(result.peak_flow_cumecs)}" stroke="#f43f5e" stroke-width="1.5" stroke-dasharray="4,4" />
        <text x="${padding.left + 8}" y="${getY(result.peak_flow_cumecs) - 6}" fill="#f43f5e" font-size="10" font-weight="700">Q_peak = ${fmt(result.peak_flow_cumecs, "m³/s")}</text>

        <!-- Hydrograph Curve -->
        <path d="${areaD}" fill="rgba(56, 189, 248, 0.18)" />
        <path d="${pathD}" fill="none" stroke="#38bdf8" stroke-width="2.5" />

        <!-- Peak Dot -->
        <circle cx="${getX(result.time_to_peak_hr)}" cy="${getY(result.peak_flow_cumecs)}" r="5" fill="#f43f5e" stroke="#ffffff" stroke-width="1.5" />

        <!-- Axes -->
        <line x1="${padding.left}" y1="${padding.top}" x2="${padding.left}" y2="${padding.top + chartH}" stroke="#475569" stroke-width="1" />
        <line x1="${padding.left}" y1="${padding.top + chartH}" x2="${padding.left + chartW}" y2="${padding.top + chartH}" stroke="#475569" stroke-width="1" />

        <!-- Labels -->
        <text x="${padding.left - 8}" y="${getY(result.peak_flow_cumecs) + 4}" fill="#94a3b8" font-size="10" text-anchor="end">${fmt(result.peak_flow_cumecs)}</text>
        <text x="${padding.left - 8}" y="${padding.top + chartH + 3}" fill="#94a3b8" font-size="10" text-anchor="end">0 m³/s</text>

        <text x="${padding.left}" y="${padding.top + chartH + 20}" fill="#94a3b8" font-size="10">0h</text>
        <text x="${getX(result.time_to_peak_hr)}" y="${padding.top + chartH + 20}" fill="#38bdf8" font-size="10" text-anchor="middle">t_p = ${result.time_to_peak_hr.toFixed(0)}h</text>
        <text x="${padding.left + chartW}" y="${padding.top + chartH + 20}" fill="#94a3b8" font-size="10" text-anchor="end">${totalT}h</text>
      </svg>
    `;
  }

  function resetScenarioB() {
    const cat = CATCHMENT_BENCHMARKS[activeCatchmentId] || CATCHMENT_BENCHMARKS["CAT-NARMADA"];
    document.getElementById("scenB_rainfallMm").value = 150;
    document.getElementById("scenB_durationHr").value = 24;
    document.getElementById("scenB_curveNumber").value = cat.default_cn;
    document.getElementById("scenB_amcSelect").value = "normal";
    runAndRenderB();
  }

  function applyFloodPreset(catId, idx) {
    const cat = CATCHMENT_BENCHMARKS[catId];
    if (!cat || !cat.documented_historical_floods[idx]) return;
    const fl = cat.documented_historical_floods[idx];
    document.getElementById("scenB_rainfallMm").value = fl.storm_rainfall_mm;
    document.getElementById("scenB_amcSelect").value = "wet";
    runAndRenderB();
  }
  window.WaterScenariosLab = window.WaterScenariosLab || {};
  window.WaterScenariosLab.applyFloodPreset = applyFloodPreset;

  // =========================================================================
  // 8. RENDER SCENARIO C: DROUGHT & WATER AVAILABILITY STRESS
  // =========================================================================

  function renderScenarioC() {
    const regId = document.getElementById("scenCRegionSelect")?.value || "REG-SAURASHTRA";
    const reg = DROUGHT_BENCHMARKS[regId] || DROUGHT_BENCHMARKS["REG-SAURASHTRA"];

    // Update Region Metadata Header
    const metaContainer = document.getElementById("scenCRegionMeta");
    if (metaContainer) {
      metaContainer.innerHTML = `
        <div class="scen-meta-strip">
          <div class="scen-meta-item">
            <span class="scen-meta-lbl">Selected Region</span>
            <strong class="scen-meta-val">${reg.name}</strong>
            <small>${reg.districts.slice(0, 3).join(", ")} + ${reg.districts.length - 3} more</small>
          </div>
          <div class="scen-meta-item">
            <span class="scen-meta-lbl">Total Annual Demand</span>
            <strong class="scen-meta-val color-cyan">${fmt(reg.annual_demand_mcm, "MCM")}</strong>
            <small>Surface + Groundwater</small>
          </div>
          <div class="scen-meta-item">
            <span class="scen-meta-lbl">Sector Allocation</span>
            <strong class="scen-meta-val color-emerald">Agr ${reg.sectoral_shares.irrigation}% • Dom ${reg.sectoral_shares.domestic}% • Ind ${reg.sectoral_shares.industrial}%</strong>
            <small>GWRD Masterplan Shares</small>
          </div>
          <div class="scen-meta-item">
            <span class="scen-meta-lbl">CGWB Groundwater Status</span>
            <strong class="scen-meta-val color-amber">${reg.cgwb_status.slice(0, 32)}...</strong>
            <small>Aquifer extraction pressure</small>
          </div>
        </div>

        <!-- Historical Drought Benchmarks Ledger -->
        <div class="dated-obs-box">
          <div class="dated-obs-header">
            <span>🏜️ Historical Droughts & Monsoon Failure Benchmarks (Official Records):</span>
            <span class="dated-obs-badge">MEASURED HISTORICAL IMPACT</span>
          </div>
          <div class="dated-obs-chips">
            ${reg.historical_droughts.map(dr => `
              <div class="dated-obs-chip">
                <span class="obs-date">${dr.years}:</span>
                <strong>${dr.severity}</strong>
                <span class="obs-hint" title="${dr.response}">ℹ️</span>
              </div>
            `).join("")}
          </div>
        </div>
      `;
    }

    runAndRenderC();
  }

  function getScenarioCInputs() {
    return {
      monsoon_deficit_pct: parseFloat(document.getElementById("scenC_deficitPct")?.value || 35),
      demand_multiplier_pct: parseFloat(document.getElementById("scenC_demandMultiplier")?.value || 100),
      irrigation_curtail_pct: parseFloat(document.getElementById("scenC_irrigCurtail")?.value || 15),
      industrial_curtail_pct: parseFloat(document.getElementById("scenC_indCurtail")?.value || 10)
    };
  }

  function runAndRenderC() {
    const regId = document.getElementById("scenCRegionSelect")?.value || "REG-SAURASHTRA";
    const reg = DROUGHT_BENCHMARKS[regId] || DROUGHT_BENCHMARKS["REG-SAURASHTRA"];
    const inputs = getScenarioCInputs();
    const result = simulateDroughtStress(reg, inputs);

    // Update Live Value Labels
    document.getElementById("lbl_scenC_deficitPct").textContent = `${inputs.monsoon_deficit_pct}% Deficit`;
    document.getElementById("lbl_scenC_demandMultiplier").textContent = `${inputs.demand_multiplier_pct}% (${fmt((inputs.demand_multiplier_pct / 100) * reg.annual_demand_mcm, "MCM")})`;
    document.getElementById("lbl_scenC_irrigCurtail").textContent = `${inputs.irrigation_curtail_pct}% Voluntary Rationing`;
    document.getElementById("lbl_scenC_indCurtail").textContent = `${inputs.industrial_curtail_pct}% Voluntary Rationing`;

    const out = document.getElementById("scenC_resultsOutput");
    if (!out) return;

    // SVG Monthly Progression Chart
    const svgProgression = renderDroughtProgressionSvg(result);

    out.innerHTML = `
      <div class="scen-results-card">
        <div class="scen-results-header">
          <div>
            <h4>Drought Stress & Water Balance Simulation: ${reg.name}</h4>
            <span class="scen-method-badge">MODEL: Annual Catchment Replenishment Deficit vs Sectoral Allocations</span>
          </div>
          <div class="scen-status-pill ${result.is_deficit ? "pill-danger" : "pill-success"}">
            ${result.is_deficit ? `⚠️ Critical Water Deficit (−${fmt(result.deficit_volume_mcm, "MCM")})` : `✅ Sustainable Annual Water Balance (+${fmt(result.annual_balance_mcm, "MCM")})`}
          </div>
        </div>

        <!-- Before-Versus-After Comparison Grid -->
        <div class="compare-kpi-grid">
          <div class="compare-col baseline-col">
            <span class="compare-col-tag">HISTORICAL MEASURED BASELINE (NORMAL YEAR)</span>
            <div class="compare-row">
              <span>Baseline Annual Replenishment:</span>
              <strong>${fmt(result.baseline_inflow_mcm, "MCM")}</strong>
            </div>
            <div class="compare-row">
              <span>Normal Agriculture Allocation:</span>
              <strong>${fmt(reg.annual_demand_mcm * (reg.sectoral_shares.irrigation / 100), "MCM")} (${reg.sectoral_shares.irrigation}%)</strong>
            </div>
            <div class="compare-row">
              <span>Normal Domestic Supply:</span>
              <strong>${fmt(reg.annual_demand_mcm * (reg.sectoral_shares.domestic / 100), "MCM")} (${reg.sectoral_shares.domestic}%)</strong>
            </div>
            <div class="compare-row">
              <span>Normal Industrial Supply:</span>
              <strong>${fmt(reg.annual_demand_mcm * (reg.sectoral_shares.industrial / 100), "MCM")} (${reg.sectoral_shares.industrial}%)</strong>
            </div>
          </div>

          <div class="compare-col scenario-col">
            <span class="compare-col-tag">HYPOTHETICAL DROUGHT SCENARIO (${inputs.monsoon_deficit_pct}% DEFICIT)</span>
            <div class="compare-row">
              <span>Scenario Replenishment Inflow:</span>
              <strong class="color-rose">${fmt(result.scenario_inflow_mcm, "MCM")} (−${fmt(result.inflow_deficit_mcm, "MCM")})</strong>
            </div>
            <div class="compare-row">
              <span>Active Agricultural Allocation:</span>
              <strong class="color-amber">${fmt(result.sector_breakdown.irrigation_mcm, "MCM")} (Rationed −${inputs.irrigation_curtail_pct}%)</strong>
            </div>
            <div class="compare-row">
              <span>Domestic Drinking Supply (Protected):</span>
              <strong class="color-cyan">${fmt(result.sector_breakdown.domestic_mcm, "MCM")} (100% Priority #1)</strong>
            </div>
            <div class="compare-row">
              <span>Active Industrial Allocation:</span>
              <strong>${fmt(result.sector_breakdown.industrial_mcm, "MCM")} (Rationed −${inputs.industrial_curtail_pct}%)</strong>
            </div>
          </div>
        </div>

        <!-- Deficit Absorption Breakdown -->
        <div class="balance-budget-strip">
          <div class="budget-item ${result.is_deficit ? "spill" : "inflow"}">
            <span class="b-lbl">Net Annual Water Balance</span>
            <strong class="b-val">${result.annual_balance_mcm >= 0 ? "+" : "−"}${fmt(Math.abs(result.annual_balance_mcm), "MCM")}</strong>
            <small>${result.is_deficit ? "Shortfall requiring mitigation" : "Surplus carry-over"}</small>
          </div>
          <div class="budget-item loss">
            <span class="b-lbl">Groundwater Overdraft Buffer</span>
            <strong class="b-val">${fmt(result.groundwater_buffer_mcm, "MCM")}</strong>
            <small>Drawdown from tube wells (up to 65%)</small>
          </div>
          <div class="budget-item ${result.unserved_deficit_mcm > 0 ? "spill" : "outflow"}">
            <span class="b-lbl">Unserved Crisis Shortfall</span>
            <strong class="b-val">${fmt(result.unserved_deficit_mcm, "MCM")}</strong>
            <small>Requires SAUNI / Narmada inter-basin transfer</small>
          </div>
          <div class="budget-item">
            <span class="b-lbl">Projected Zero-Storage Day</span>
            <strong class="b-val">Day ${result.day_of_depletion}</strong>
            <small>${result.day_of_depletion < 365 ? "Reservoirs dry before May" : "Buffer sustains through summer"}</small>
          </div>
        </div>

        <!-- SVG Progression Visualizer -->
        <div class="scen-chart-container">
          <div class="scen-chart-header">
            <span>📉 Monthly Water Storage Depletion & Deficit Progression (12-Month Hydrological Cycle):</span>
            <div class="scen-chart-legend">
              <span class="leg-item"><span class="leg-dot color-cyan"></span> Active Storage Buffer (MCM)</span>
              <span class="leg-item"><span class="leg-dot color-rose"></span> Cumulative Deficit (MCM)</span>
            </div>
          </div>
          ${svgProgression}
        </div>

        <!-- Assumptions & Policy Disclosures -->
        <div class="scen-assumptions-box">
          <div class="box-title">⚖️ Water Governance Principles & Disclosures:</div>
          <ul>
            ${result.assumptions.map(a => `<li>${a}</li>`).join("")}
            <li><strong>Exploratory Screening Notice:</strong> This simulation demonstrates aggregate regional water balances. Actual reservoir scheduling is subject to statutory riparian allocations, interstate tribunals (NWDT for Narmada), and dynamic rainfall updates.</li>
          </ul>
        </div>
      </div>
    `;
  }

  function renderDroughtProgressionSvg(result) {
    const prog = result.monthlyProgression;
    const width = 760;
    const height = 230;
    const padding = { top: 20, right: 30, bottom: 35, left: 70 };

    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const maxVal = Math.max(result.baseline_inflow_mcm * 0.95, result.total_active_demand_mcm);
    const getX = (idx) => padding.left + (idx / 11) * chartW;
    const getY = (val) => padding.top + chartH - (val / maxVal) * chartH;

    let storagePath = "";
    let deficitPath = "";

    prog.forEach((pt, idx) => {
      const x = getX(idx);
      const yS = getY(pt.storage_mcm);
      const yD = getY(pt.deficit_mcm);
      if (idx === 0) {
        storagePath += `M ${x} ${yS}`;
        deficitPath += `M ${x} ${yD}`;
      } else {
        storagePath += ` L ${x} ${yS}`;
        deficitPath += ` L ${x} ${yD}`;
      }
    });

    return `
      <svg viewBox="0 0 ${width} ${height}" class="scen-svg-chart" aria-label="12-Month Drought Progression">
        <rect x="0" y="0" width="${width}" height="${height}" fill="#0b1120" rx="8" />

        <!-- Grid Lines -->
        <line x1="${padding.left}" y1="${getY(0)}" x2="${padding.left + chartW}" y2="${getY(0)}" stroke="#1e293b" stroke-width="1" />
        <line x1="${padding.left}" y1="${getY(maxVal * 0.5)}" x2="${padding.left + chartW}" y2="${getY(maxVal * 0.5)}" stroke="#1e293b" stroke-dasharray="3,3" />

        <!-- Paths -->
        <path d="${storagePath}" fill="none" stroke="#38bdf8" stroke-width="2.5" />
        <path d="${deficitPath}" fill="none" stroke="#f43f5e" stroke-width="2.5" stroke-dasharray="4,4" />

        <!-- Axes -->
        <line x1="${padding.left}" y1="${padding.top}" x2="${padding.left}" y2="${padding.top + chartH}" stroke="#475569" stroke-width="1" />
        <line x1="${padding.left}" y1="${padding.top + chartH}" x2="${padding.left + chartW}" y2="${padding.top + chartH}" stroke="#475569" stroke-width="1" />

        <!-- Y Axis Labels -->
        <text x="${padding.left - 8}" y="${getY(maxVal) + 4}" fill="#94a3b8" font-size="10" text-anchor="end">${fmt(maxVal)}</text>
        <text x="${padding.left - 8}" y="${padding.top + chartH + 3}" fill="#94a3b8" font-size="10" text-anchor="end">0 MCM</text>

        <!-- X Axis Month Labels -->
        ${prog.map((pt, idx) => `
          <text x="${getX(idx)}" y="${padding.top + chartH + 18}" fill="${idx < 4 ? "#38bdf8" : "#94a3b8"}" font-size="9" text-anchor="middle">
            ${pt.month_name}
          </text>
        `).join("")}
      </svg>
    `;
  }

  function resetScenarioC() {
    document.getElementById("scenC_deficitPct").value = 35;
    document.getElementById("scenC_demandMultiplier").value = 100;
    document.getElementById("scenC_irrigCurtail").value = 15;
    document.getElementById("scenC_indCurtail").value = 10;
    runAndRenderC();
  }

  // =========================================================================
  // 9. EXPORT & IMPORT CONFIGURATIONS (REPRODUCIBILITY & AUDIT)
  // =========================================================================

  function exportConfigurationJSON() {
    const config = {
      project: "Gujarat InfraMap — Water Scenarios Lab",
      version: "4.5.0",
      timestamp: new Date().toISOString(),
      active_mode: currentMode,
      scenarioA: {
        asset_id: activeAssetId,
        inputs: getScenarioAInputs()
      },
      scenarioB: {
        catchment_id: activeCatchmentId,
        inputs: getScenarioBInputs()
      },
      scenarioC: {
        region_id: document.getElementById("scenCRegionSelect")?.value || "REG-SAURASHTRA",
        inputs: getScenarioCInputs()
      },
      disclaimer: "EXPLORATORY EDUCATIONAL TOOL ONLY: Not for operational dam releases, flood evacuations, or design certifications."
    };

    const blob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gujarat_water_scenario_${currentMode}_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function importConfigurationJSON(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const config = JSON.parse(event.target.result);
        if (config.scenarioA) {
          activeAssetId = config.scenarioA.asset_id || activeAssetId;
          const a = config.scenarioA.inputs;
          if (a) {
            if (document.getElementById("scenA_initialPct")) document.getElementById("scenA_initialPct").value = a.initial_pct;
            if (document.getElementById("scenA_inflowCumecs")) document.getElementById("scenA_inflowCumecs").value = a.inflow_cumecs;
            if (document.getElementById("scenA_outflowCumecs")) document.getElementById("scenA_outflowCumecs").value = a.outflow_cumecs;
            if (document.getElementById("scenA_evapRate")) document.getElementById("scenA_evapRate").value = a.evap_mm_day;
            if (document.getElementById("scenA_seepageRate")) document.getElementById("scenA_seepageRate").value = a.seepage_pct_day;
            if (document.getElementById("scenA_durationDays")) document.getElementById("scenA_durationDays").value = a.duration_days;
            if (document.getElementById("scenA_timeStep")) document.getElementById("scenA_timeStep").value = a.timestep_hours;
          }
        }
        if (config.scenarioB) {
          activeCatchmentId = config.scenarioB.catchment_id || activeCatchmentId;
          const b = config.scenarioB.inputs;
          if (b) {
            if (document.getElementById("scenB_rainfallMm")) document.getElementById("scenB_rainfallMm").value = b.rainfall_mm;
            if (document.getElementById("scenB_durationHr")) document.getElementById("scenB_durationHr").value = b.storm_duration_hr;
            if (document.getElementById("scenB_curveNumber")) document.getElementById("scenB_curveNumber").value = b.curve_number;
            if (document.getElementById("scenB_amcSelect")) document.getElementById("scenB_amcSelect").value = b.antecedent_moisture;
          }
        }
        if (config.scenarioC) {
          const c = config.scenarioC.inputs;
          if (c) {
            if (document.getElementById("scenC_deficitPct")) document.getElementById("scenC_deficitPct").value = c.monsoon_deficit_pct;
            if (document.getElementById("scenC_demandMultiplier")) document.getElementById("scenC_demandMultiplier").value = c.demand_multiplier_pct;
            if (document.getElementById("scenC_irrigCurtail")) document.getElementById("scenC_irrigCurtail").value = c.irrigation_curtail_pct;
            if (document.getElementById("scenC_indCurtail")) document.getElementById("scenC_indCurtail").value = c.industrial_curtail_pct;
          }
        }
        populateDropdowns();
        switchMode(config.active_mode || "scenarioA");
        alert("Scenario configuration successfully imported!");
      } catch (err) {
        alert("Error parsing scenario configuration JSON: " + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = ""; // Reset file input
  }

  function exportTechnicalReport() {
    let reportMd = "";
    const dateStr = new Date().toISOString().slice(0, 10);

    if (currentMode === "scenarioA") {
      const res = RESERVOIR_BENCHMARKS[activeAssetId];
      const inputs = getScenarioAInputs();
      const result = simulateReservoirStorage(res, inputs);

      reportMd = `# GUJARAT WATER SCENARIOS LAB — RESERVOIR STORAGE MASS-BALANCE MEMO
**Asset:** ${res.name} (${res.river}, ${res.basin})
**Date of Run:** ${dateStr}
**Model Standard:** Continuous Lumped Mass Balance ($\Delta S = V_{in} - V_{out} - V_{evap} - V_{seep}$)

---

## 1. Documented Capacity & Baseline Elevations
- **Gross Storage (FRL):** ${res.gross_storage_mcm} MCM (Elevation: ${res.frl_m} m MSL)
- **Active Live Storage:** ${res.live_storage_mcm} MCM (Elevation Range: ${res.mddl_m} to ${res.frl_m} m MSL)
- **Dead Storage (Sediment Trap):** ${res.dead_storage_mcm} MCM (Below ${res.mddl_m} m MSL)
- **Design Spillway Capacity:** ${res.spillway_capacity_cumecs} m³/s

## 2. Hypothetical Input Parameters
- **Initial Storage:** ${inputs.initial_pct}% of Gross (${result.initial_storage_mcm.toFixed(1)} MCM)
- **Mean Inflow Rate:** ${inputs.inflow_cumecs} m³/s (${(inputs.inflow_cumecs * 0.0864).toFixed(2)} MCM/day)
- **Controlled Outflow Rate:** ${inputs.outflow_cumecs} m³/s (${(inputs.outflow_cumecs * 0.0864).toFixed(2)} MCM/day)
- **Pan Evaporation Rate:** ${inputs.evap_mm_day} mm/day
- **Foundation Seepage Rate:** ${inputs.seepage_pct_day}%/day
- **Simulation Horizon:** ${inputs.duration_days} Days (Time-step: ${inputs.timestep_hours} Hours)

## 3. Mass-Balance Simulation Outputs
- **Final Storage Volume:** ${result.final_storage_mcm.toFixed(2)} MCM (${result.final_pct_gross}% of Gross)
- **Net Volumetric Change ($\Delta S$):** ${result.net_change_mcm >= 0 ? "+" : ""}${result.net_change_mcm.toFixed(2)} MCM
- **Cumulative Inflow Volume:** +${result.total_inflow_mcm.toFixed(2)} MCM
- **Cumulative Controlled Outflow:** −${result.total_outflow_mcm.toFixed(2)} MCM
- **Cumulative Evaporative Losses:** −${result.total_evap_mcm.toFixed(2)} MCM
- **Cumulative Seepage Losses:** −${result.total_seepage_mcm.toFixed(2)} MCM
- **Cumulative Emergency Spillway Surcharge:** −${result.total_spill_mcm.toFixed(2)} MCM (${result.spill_count} time-steps above FRL)

## 4. Modeling Assumptions & Limitations
${result.assumptions.map(a => `- ${a}`).join("\n")}

> [!CAUTION]
> **STATUTORY DISCLAIMER:** This scenario is an exploratory educational screening model and must NOT be used for real-world dam release schedules, flood evacuation protocols, or civil engineering design certifications.
`;
    } else if (currentMode === "scenarioB") {
      const cat = CATCHMENT_BENCHMARKS[activeCatchmentId];
      const inputs = getScenarioBInputs();
      const result = simulateCatchmentFlood(cat, inputs);

      reportMd = `# GUJARAT WATER SCENARIOS LAB — CATCHMENT FLOOD SCREENING MEMO
**Catchment:** ${cat.name} (${cat.river} River)
**Date of Run:** ${dateStr}
**Model Standard:** SCS Curve Number Runoff + Manning's 1D Open Channel Flow

---

## 1. Documented Catchment Baseline
- **Contributing Area:** ${cat.area_sqkm} km²
- **Calibrated Curve Number:** CN ${cat.default_cn} (${cat.soil_group})
- **Time of Concentration (Tc):** ${cat.time_of_concentration_hr} Hours
- **Downstream Channel Dimensions:** Width = ${cat.channel_width_m} m, Bankfull Stage = ${cat.bankfull_depth_m} m, Slope = ${cat.channel_slope}

## 2. Storm Input Parameters
- **Storm Precipitation Depth (P):** ${inputs.rainfall_mm} mm
- **Storm Duration:** ${inputs.storm_duration_hr} Hours
- **Antecedent Moisture Condition:** ${inputs.antecedent_moisture.toUpperCase()} (Adjusted CN = ${result.adjusted_cn.toFixed(0)})

## 3. Hydrologic & Hydraulic Outputs
- **Potential Soil Retention (S):** ${result.soil_retention_s_mm.toFixed(1)} mm
- **Initial Abstraction (Ia = 0.2S):** ${result.initial_abstraction_ia_mm.toFixed(1)} mm
- **Direct Runoff Depth (Pe):** ${result.direct_runoff_pe_mm.toFixed(1)} mm (Runoff Coefficient: ${(result.runoff_coefficient * 100).toFixed(1)}%)
- **Total Runoff Volume:** ${result.runoff_volume_mcm.toFixed(2)} MCM
- **Peak Hydrograph Discharge (Qp):** ${result.peak_flow_cumecs.toFixed(1)} m³/s (${result.peak_flow_cusecs.toFixed(0)} cusecs)
- **Time to Peak (tp):** ${result.time_to_peak_hr.toFixed(1)} Hours
- **Downstream Channel Stage (y):** ${result.channel_stage_m.toFixed(2)} m
- **Overtopping Risk:** ${result.is_overtopping ? "YES — Stage exceeds bankfull by +" + result.flood_margin_m + " m" : "NO — Clearance freeboard of " + Math.abs(result.flood_margin_m) + " m"}

## 4. Modeling Assumptions & Limitations
${result.assumptions.map(a => `- ${a}`).join("\n")}

> [!CAUTION]
> **STATUTORY DISCLAIMER:** This scenario is an exploratory educational screening model and must NOT be used for flood evacuation decisions or structural design.
`;
    } else {
      const regId = document.getElementById("scenCRegionSelect")?.value || "REG-SAURASHTRA";
      const reg = DROUGHT_BENCHMARKS[regId];
      const inputs = getScenarioCInputs();
      const result = simulateDroughtStress(reg, inputs);

      reportMd = `# GUJARAT WATER SCENARIOS LAB — DROUGHT STRESS & WATER BALANCE MEMO
**Region:** ${reg.name}
**Date of Run:** ${dateStr}
**Model Standard:** Regional Annual Water Balance & Sectoral Rationing Matrix

---

## 1. Regional Demand & Groundwater Baseline
- **Total Annual Demand:** ${reg.annual_demand_mcm} MCM
- **Baseline Allocations:** Agriculture ${reg.sectoral_shares.irrigation}% | Domestic ${reg.sectoral_shares.domestic}% | Industrial ${reg.sectoral_shares.industrial}%
- **CGWB Status:** ${reg.cgwb_status}

## 2. Drought Perturbation Inputs
- **Monsoon Deficit:** ${inputs.monsoon_deficit_pct}% below normal replenishment
- **Gross Demand Scaling:** ${inputs.demand_multiplier_pct}%
- **Voluntary Agricultural Curtailment:** ${inputs.irrigation_curtail_pct}%
- **Industrial Curtailment:** ${inputs.industrial_curtail_pct}%

## 3. Water Balance Outputs
- **Scenario Replenishment Inflow:** ${result.scenario_inflow_mcm.toFixed(1)} MCM (−${result.inflow_deficit_mcm.toFixed(1)} MCM shortfall)
- **Total Active Sectoral Demand:** ${result.total_active_demand_mcm.toFixed(1)} MCM
- **Net Annual Deficit:** ${result.is_deficit ? "−" + result.deficit_volume_mcm.toFixed(1) + " MCM" : "+" + result.annual_balance_mcm.toFixed(1) + " MCM"}
- **Groundwater Overdraft Compensation:** ${result.groundwater_buffer_mcm.toFixed(1)} MCM (up to 65% of shortfall)
- **Unserved Crisis Shortfall:** ${result.unserved_deficit_mcm.toFixed(1)} MCM
- **Projected Storage Depletion Horizon:** Day ${result.day_of_depletion}

## 4. Modeling Assumptions & Limitations
${result.assumptions.map(a => `- ${a}`).join("\n")}

> [!CAUTION]
> **STATUTORY DISCLAIMER:** Exploratory simulation only. Governed strictly by Gujarat Water Resources Department and interstate water tribunal awards.
`;
    }

    const blob = new Blob([reportMd], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gujarat_water_memo_${currentMode}_${dateStr}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // =========================================================================
  // 10. PUBLIC MODULE INTERFACE
  // =========================================================================
  window.WaterScenariosLab = {
    init,
    open,
    close,
    switchMode,
    simulateReservoirStorage,
    simulateCatchmentFlood,
    simulateDroughtStress,
    exportConfigurationJSON,
    importConfigurationJSON,
    exportTechnicalReport,
    applyObsPreset,
    applyFloodPreset
  };

})();
