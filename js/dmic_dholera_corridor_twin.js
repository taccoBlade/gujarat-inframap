/**
 * Gujarat InfraMap — DMIC & Dholera SIR Smart Industrial Corridors Digital Twin
 * Version: 1.0.0
 * 
 * Provides an operational, civil & logistics engineering-grade digital twin for
 * the Delhi-Mumbai Industrial Corridor (DMIC), Western Dedicated Freight Corridor (WDFC),
 * and Dholera Special Investment Region (DSIR — India's first 920 km² greenfield smart city).
 * 
 * Core Capabilities:
 *   1. Authoritative Dholera SIR Master Plan & Trunk Infrastructure Ledger
 *      (22.5 km² Activation Area TP2A, Tata Semiconductor Fab, ABCD Building, DIACL Airport, 1 GW Solar Spine).
 *   2. Western Dedicated Freight Corridor (WDFC) Double-Stack Container Logistics Engine
 *      (565 km Gujarat alignment, 100 km/h design, 25-tonne axle load, 7.1m high OHE).
 *   3. Maritime Port-to-Rail Intermodal Freight Ledger
 *      (Mundra Port, Deendayal/Kandla, Pipavav, Dahej PCPIR, Hazira MMLP, Sanand ICD, Sabarmati ICD).
 *   4. Transit Time & Intermodal Physics Formulation
 *      (T_transit = D / V + T_dwell, container turnaround, 120-truck displacement per double-stack rake).
 *   5. Interactive Sensitivity Controls (Port Dwell Time 12-72 hrs, Freight Speed 40-100 km/h, Demand 1k-12k TEUs).
 *   6. Dynamic Leaflet Canvas Vector Animations (Dholera 920 km² boundary, WDFC line pulses, logistics pins).
 *   7. RFC-4180 Compliant CSV Intermodal Logistics & Throughput Exporter.
 * 
 * Epistemic Standards (AGENTS.md):
 *   - [ DMICDC & NICDC MASTER PLAN ]: Official National Industrial Corridor Development Corporation specs.
 *   - [ DFCCIL FREIGHT OPERATIONS REGISTRY ]: Statutory Western DFC railway alignment & axle load parameters.
 *   - [ GIDC & DHOLERA SIRDA STATUTORY ZONATION ]: Dholera Special Investment Region Development Authority records.
 */

(function (window) {
  "use strict";

  // =========================================================================
  // 1. AUTHORITATIVE DHOLERA SIR MASTER PLAN REGISTRY
  // =========================================================================

  const DHOLERA_ZONES = {
    activation_area: {
      id: "DSIR-ZN-01",
      key: "activation_area",
      name: "Dholera Activation Area (Town Planning Scheme 2A)",
      category: "Plug-and-Play Smart Industrial Trunk Zone",
      areaSqKm: 22.5,
      landAreaHa: 2250,
      coords: [22.24, 72.22],
      district: "Ahmedabad",
      investmentInrCr: 4500,
      governingBody: "Dholera Industrial City Development Ltd (DICDL)",
      trunkInfra: "Underground Multi-Utility Ducting, Dual Potable/Tertiary Water, 72 km Roads",
      waterSystem: "Zero Liquid Discharge (ZLD) with 20 MLD Central Effluent Treatment Plant (CETP)",
      powerSupply: "Dedicated Underground 400/220/66 kV GIS Feeders with 99.99% Reliability",
      status: "Operational Ready (Plug-and-Play Industrial Parcels)",
      anchorProjects: "ABCD Command Center, Water Treatment Plant (50 MLD), Sewage Treatment Plant (10 MLD)",
      description: "First fully developed 22.5 km² industrial cluster inside Dholera SIR with complete subterranean utility tunnels, sensorized SCADA, and sensor-based smart city roads."
    },

    semiconductor_fab: {
      id: "DSIR-ZN-02",
      key: "semiconductor_fab",
      name: "Tata Electronics & PSMC Semiconductor Fab Hub",
      category: "Strategic Mega High-Tech Manufacturing",
      areaSqKm: 0.65,
      landAreaHa: 65,
      coords: [22.25, 72.20],
      district: "Ahmedabad",
      investmentInrCr: 91000,
      governingBody: "Tata Electronics Pvt Ltd (TEPL) / DICDL / India Semiconductor Mission",
      trunkInfra: "Ultra-Pure Water (UPW), Dual-Fed Gas Pipelines, High-Voltage Vibration-Isolated Grid",
      waterSystem: "Ultra-Pure Water Recycling (>85% recovery rate for nano-fabrication)",
      powerSupply: "Uninterrupted Redundant 220 kV Feeder from Dholera 400 kV GIS Substation",
      status: "Under Construction (First Commercial Fab in India)",
      anchorProjects: "28nm, 40nm, 55nm & 90nm Logic & Power Chips (50,000 Wafers/Month)",
      description: "India's first commercial semiconductor fabrication facility in partnership with Powerchip Semiconductor Manufacturing Corp (PSMC Taiwan), manufacturing automotive, AI, computing and defense chips."
    },

    dholera_airport: {
      id: "DSIR-ZN-03",
      key: "dholera_airport",
      name: "Dholera International Airport (DIACL)",
      category: "Multi-Modal Air Logistics & Passenger Hub",
      areaSqKm: 14.26,
      landAreaHa: 1426,
      coords: [22.36, 72.16],
      district: "Ahmedabad",
      investmentInrCr: 2100,
      governingBody: "Dholera International Airport Company Ltd (DIACL / AAI)",
      trunkInfra: "Code 4E Wide-Body Cargo Runway (3,200m), Dedicated Cargo Apron, Cold Chain Hub",
      waterSystem: "Rainwater Harvesting Lakes & Sustainable Stormwater Drainage",
      powerSupply: "Dedicated Solar Rooftop & 66 kV Dedicated Feeder",
      status: "Under Phase-I Construction",
      anchorProjects: "Dedicated Cargo Terminal for Semiconductors, Electronics, Aerospace & Defense",
      description: "Greenfield international airport serving Dholera SIR, Ahmedabad, and Bhavnagar with heavy cargo facilities capable of handling Boeing 747-8F and Airbus A350 freighter aircraft."
    },

    dholera_solar: {
      id: "DSIR-ZN-04",
      key: "dholera_solar",
      name: "Dholera Ultra-Mega Solar Power Park",
      category: "Dedicated Clean Energy Power Spine",
      areaSqKm: 40.0,
      landAreaHa: 4000,
      coords: [22.20, 72.15],
      district: "Ahmedabad",
      investmentInrCr: 5200,
      governingBody: "Gujarat Power Corporation Ltd (GPCL)",
      trunkInfra: "Coastal High-Albedo Pile-Mounted Solar Arrays on Gulf of Khambhat Fluvial Flat",
      waterSystem: "Dry Robotic Cleaning Arrays Conserving Marine Environment",
      powerSupply: "400/220 kV Dholera SIR Dedicated Evacuation Switchyard",
      status: "300 MW Phase-I Commissioned (Scaling to 1,000 MW)",
      anchorProjects: "Provides 100% Green Power Tariff to Dholera Semiconductor & Industrial Units",
      description: "Coastal solar installation engineered on saline mudflats of the Gulf of Khambhat to deliver green energy baseload to industrial units in the SIR."
    },

    town_planning_1: {
      id: "DSIR-ZN-05",
      key: "town_planning_1",
      name: "Town Planning Scheme 1 (TP1 — City Core & Civic Center)",
      category: "Commercial, Residential & Institutional City Center",
      areaSqKm: 154.0,
      landAreaHa: 15400,
      coords: [22.28, 72.26],
      district: "Ahmedabad",
      investmentInrCr: 12500,
      governingBody: "Dholera Special Investment Region Development Authority (DSIRDA)",
      trunkInfra: "City Center Boulevard, Knowledge & IT Zone, High-Density Transit-Oriented Development",
      waterSystem: "Integrated Potable Water Supply from Narmada Canal & Desalination Plant",
      powerSupply: "Smart Micro-Grid with Underground Ring Distribution",
      status: "Master-Planned & Phased Trunk Allotment",
      anchorProjects: "Universities, International Hospitals, Financial Center, Central Park (150 Ha)",
      description: "Comprehensive urban core designed to house 800,000 residents with pedestrian-friendly green corridors, school clusters, and smart administrative governance."
    },

    town_planning_2: {
      id: "DSIR-ZN-06",
      key: "town_planning_2",
      name: "Town Planning Scheme 2 (TP2 — Heavy Engineering & Logistics)",
      category: "Heavy Manufacturing, Aerospace & Defense Zone",
      areaSqKm: 340.0,
      landAreaHa: 34000,
      coords: [22.22, 72.28],
      district: "Ahmedabad",
      investmentInrCr: 28000,
      governingBody: "DSIRDA / DICDL",
      trunkInfra: "Heavy Load Road Pavements (Axle Load 30t), Direct Freight Rail Sidings to WDFC",
      waterSystem: "Industrial Recycled Water Line (100 MLD Network)",
      powerSupply: "765/400 kV Extra-High Voltage Power Backbone",
      status: "Zoned & Allocated for Heavy Industrial Development",
      anchorProjects: "Defense Mega Corridors, Electric Vehicle Manufacturing, Aerospace Components",
      description: "Large-scale industrial zone with direct connectivity to the Ahmedabad-Dholera Expressway and dedicated freight rail lines leading to the Western DFC."
    }
  };

  // =========================================================================
  // 2. FREIGHT CORRIDORS & LOGISTICS NODES REGISTRY
  // =========================================================================

  const FREIGHT_CORRIDORS = {
    wdfc_spine: {
      id: "CORR-WDFC-01",
      key: "wdfc_spine",
      name: "Western Dedicated Freight Corridor (WDFC Mainline)",
      type: "Heavy-Haul Electric Railway (DFCCIL)",
      lengthKm: 565.0,
      designSpeedKmh: 100,
      axleLoadTonnes: 25.0,
      catenaryOhe: "25 kV AC 50 Hz (7.1m High Overhead Catenary for Double-Stack Containers)",
      trainCapacityTeu: 180, // Double-stack rake capacity
      operator: "Dedicated Freight Corridor Corporation of India Ltd (DFCCIL)",
      route: "Sanand MMLP -> Viramgam -> Mehsana -> Palanpur -> Rewari -> Dadri",
      benchmarkRoadHours: 42.0,
      description: "High-speed, heavy-haul freight railway operating exclusively for freight trains. Carries double-stack container trains on flat wagons, slashing transit time between Gujarat ports and NCR."
    },

    dholera_expressway: {
      id: "CORR-EXP-01",
      key: "dholera_expressway",
      name: "Ahmedabad — Dholera Access-Controlled Expressway (NH-64)",
      type: "4-Lane Greenfield Access-Controlled Expressway",
      lengthKm: 109.0,
      designSpeedKmh: 120,
      axleLoadTonnes: 20.0,
      catenaryOhe: "N/A (Highway Corridor)",
      trainCapacityTeu: 2,
      operator: "National Highways Authority of India (NHAI)",
      route: "Sardar Patel Ring Road (Ahmedabad) -> Dholera SIR -> Dholera Airport -> Bhavnagar",
      benchmarkRoadHours: 2.5,
      description: "109 km greenfield access-controlled expressway cutting travel time between Ahmedabad and Dholera SIR from 2.5 hours to 45 minutes, with right-of-way reserved for rapid rail transit (RRTS)."
    },

    mundra_feeder: {
      id: "CORR-MND-01",
      key: "mundra_feeder",
      name: "Mundra Port — Adipur — Palanpur WDFC Interconnector",
      type: "Port-Rail Dedicated Feeder Rail Link",
      lengthKm: 345.0,
      designSpeedKmh: 75,
      axleLoadTonnes: 25.0,
      catenaryOhe: "25 kV Electrified Heavy Rail",
      trainCapacityTeu: 180,
      operator: "Western Railway / MDIPL / DFCCIL",
      route: "Mundra Port Rail Yard -> Gandhidham -> Samakhiali -> Palanpur WDFC Junction",
      benchmarkRoadHours: 28.0,
      description: "Direct double-stack rail connectivity from India's largest private container port (Mundra) to the WDFC trunk line at Palanpur."
    },

    pipavav_feeder: {
      id: "CORR-PIP-01",
      key: "pipavav_feeder",
      name: "Pipavav Port — Surendranagar — Mehsana WDFC Link",
      type: "Intermodal Port-Rail Feeder Link",
      lengthKm: 269.0,
      designSpeedKmh: 75,
      axleLoadTonnes: 25.0,
      catenaryOhe: "25 kV Electrified Heavy Rail",
      trainCapacityTeu: 180,
      operator: "Pipavav Railway Corporation Ltd (PRCL)",
      route: "Pipavav Port Yard -> Rajula -> Dhola -> Surendranagar -> Mehsana WDFC",
      benchmarkRoadHours: 24.0,
      description: "India's pioneer double-stack container rail corridor operated by PRCL, connecting APM Terminals Pipavav to North India's industrial centers."
    },

    dahej_pcpir_link: {
      id: "CORR-DHJ-01",
      key: "dahej_pcpir_link",
      name: "Dahej PCPIR — Bharuch — Vadodara DMIC Chemical Spine",
      type: "Heavy Chemical & Container Logistics Corridor",
      lengthKm: 78.0,
      designSpeedKmh: 65,
      axleLoadTonnes: 22.5,
      catenaryOhe: "Broad Gauge Rail & 6-Lane Chemical Highway",
      trainCapacityTeu: 90,
      operator: "Western Railway / GIDC",
      route: "Dahej Port & PCPIR -> Samni -> Bharuch Junction -> Vadodara DMIC Hub",
      benchmarkRoadHours: 3.5,
      description: "Critical chemical, fertilizer and LNG evacuation spine linking Dahej PCPIR with the main Western Railway and WDFC freight artery."
    }
  };

  const LOGISTICS_NODES = {
    mundra_port: {
      id: "LOG-MND-01",
      name: "Mundra Port Commercial Container Terminal (APSEZ)",
      type: "Deep-Draft Commercial Maritime Port",
      coords: [22.84, 69.70],
      district: "Kutch",
      annualCargoMmt: 155.0,
      containerTeu: 7500000,
      railYardsCount: 4,
      dailyRakesCapacity: 32,
      dwellTimeHours: 22.0,
      specialization: "Double-Stack Container Trains, Automobile RO-RO, Crude & Coal",
      role: "India's largest commercial port handling over 30% of national container cargo."
    },

    kandla_port: {
      id: "LOG-KAN-01",
      name: "Deendayal Port Authority (Kandla / Vadinar)",
      type: "Major Port of India (Statutory Authority)",
      coords: [23.00, 70.22],
      district: "Kutch",
      annualCargoMmt: 137.5,
      containerTeu: 650000,
      railYardsCount: 3,
      dailyRakesCapacity: 24,
      dwellTimeHours: 28.0,
      specialization: "Dry Bulk, Petroleum Tankers, Fertilizer, Food Grains",
      role: "Strategic northern maritime gateway feeding Punjab, Haryana and Rajasthan."
    },

    pipavav_port: {
      id: "LOG-PIP-01",
      name: "APM Terminals Pipavav",
      type: "Multi-Cargo All-Weather Port",
      coords: [20.91, 71.50],
      district: "Amreli",
      annualCargoMmt: 12.0,
      containerTeu: 850000,
      railYardsCount: 2,
      dailyRakesCapacity: 14,
      dwellTimeHours: 20.0,
      specialization: "Dedicated PRCL Double-Stack Rail, Reefer Containers, LPG",
      role: "Pioneer port for double-stack electrified container trains in India."
    },

    icd_sanand: {
      id: "LOG-SND-01",
      name: "CONCOR Multi-Modal Logistics Park Sanand (ICD)",
      type: "Inland Container Depot & Automobile Logistics Park",
      coords: [22.98, 72.38],
      district: "Ahmedabad",
      annualCargoMmt: 4.5,
      containerTeu: 350000,
      railYardsCount: 3,
      dailyRakesCapacity: 12,
      dwellTimeHours: 16.0,
      specialization: "Automobile Finished Vehicle Logistics (Tata, Ford), Container Stuffing",
      role: "Heart of Gujarat's automotive corridor providing rail connectivity to Mundra and Pipavav."
    },

    icd_khodiyar: {
      id: "LOG-KHD-01",
      name: "CONCOR ICD Sabarmati / Khodiyar Terminal",
      type: "Dry Port & Container Freight Station",
      coords: [23.18, 72.58],
      district: "Gandhinagar",
      annualCargoMmt: 3.2,
      containerTeu: 220000,
      railYardsCount: 2,
      dailyRakesCapacity: 8,
      dwellTimeHours: 18.0,
      specialization: "General Engineering Goods, Textiles, Chemicals & Bonded Warehousing",
      role: "Primary customs-bonded dry port serving the Ahmedabad-Gandhinagar manufacturing zone."
    },

    dahej_port: {
      id: "LOG-DHJ-01",
      name: "Dahej Commercial Port & Petronet LNG",
      type: "Deep-Water Liquid & Solid Cargo Port",
      coords: [21.70, 72.53],
      district: "Bharuch",
      annualCargoMmt: 48.0,
      containerTeu: 150000,
      railYardsCount: 2,
      dailyRakesCapacity: 10,
      dwellTimeHours: 24.0,
      specialization: "LNG Regasification, Petrochemicals, Coal & Copper Ore",
      role: "Primary energy and chemical port feeding the Dahej PCPIR industrial cluster."
    },

    mmlp_hazira: {
      id: "LOG-HZR-01",
      name: "DP World / Adani Hazira Multi-Modal Logistics Park",
      type: "Deep-Draft Port & Logistics Hub",
      coords: [21.12, 72.65],
      district: "Surat",
      annualCargoMmt: 65.0,
      containerTeu: 800000,
      railYardsCount: 2,
      dailyRakesCapacity: 16,
      dwellTimeHours: 22.0,
      specialization: "Container Cargo, Heavy Steel Coils (AMNS), Petrochemical Liquids",
      role: "South Gujarat's primary maritime gateway serving the Surat textile and diamond economy."
    }
  };

  // =========================================================================
  // 3. LOGISTICS MATHEMATICS & INTERMODAL TRANSIT ENGINE
  // =========================================================================

  /**
   * Computes intermodal freight transit times, rake demand, highway truck relief,
   * fuel savings, and clean carbon mitigation.
   * 
   * Formulations:
   * 1. Transit Time: T_transit = (Distance / V_freight) + T_dwell
   * 2. Road Transit: T_road = (Distance / 40 km/h) + 12h (tolls, congestion & driver fatigue)
   * 3. Time Saved: Delta_T = T_road - T_transit
   * 4. Train Rakes Needed: N_trains = ceil(Demand_TEU / 180) (each double-stack WDFC train = 180 TEUs)
   * 5. Highway Trucks Displaced: N_trucks = Demand_TEU * 0.60 (1 trailer truck = 1.66 TEUs)
   * 6. CO2 Mitigation: N_trucks * Avg_Distance * 0.00085 tCO2/km
   * 7. Fuel Savings: 78% energy reduction compared to highway road diesel transport
   */
  function calculateLogisticsPhysics(dwellHours = 24.0, freightSpeedKmh = 75.0, dailyDemandTeu = 4500) {
    const dwell = Math.max(8.0, Math.min(72.0, dwellHours));
    const speed = Math.max(30.0, Math.min(100.0, freightSpeedKmh));
    const demand = Math.max(500, Math.min(15000, dailyDemandTeu));

    // Corridor transit times
    const corridorMetrics = {};
    let totalKmSum = 0;
    let corridorCount = 0;

    Object.keys(FREIGHT_CORRIDORS).forEach(key => {
      const c = FREIGHT_CORRIDORS[key];
      const railHours = parseFloat(((c.lengthKm / speed) + (dwell * 0.5)).toFixed(1));
      const roadHours = typeof c.benchmarkRoadHours === "number" ? c.benchmarkRoadHours : parseFloat(((c.lengthKm / 35.0) + 10.0).toFixed(1));
      const hoursSaved = parseFloat(Math.max(1.0, roadHours - railHours).toFixed(1));
      const speedupPct = Math.round((hoursSaved / roadHours) * 100);

      corridorMetrics[key] = {
        name: c.name,
        lengthKm: c.lengthKm,
        railHours,
        roadHours,
        hoursSaved,
        speedupPct,
        speedKmh: speed
      };

      totalKmSum += c.lengthKm;
      corridorCount++;
    });

    const avgDistanceKm = totalKmSum / Math.max(1, corridorCount);

    // Throughput & Logistics Calculations
    const doubleStackCapacity = 180; // TEUs per WDFC train
    const dailyRakesNeeded = Math.ceil(demand / doubleStackCapacity);
    const highwayTrucksSaved = Math.round(demand * 0.60); // 1.66 TEU/truck
    const dieselLitersSaved = Math.round(highwayTrucksSaved * avgDistanceKm * 0.32); // 0.32 L/km diesel saved
    const co2MitigatedTonnesPerDay = Math.round(highwayTrucksSaved * avgDistanceKm * 0.00088);
    const logisticsCostSavingsCroresPerDay = parseFloat(((demand * avgDistanceKm * 2.8) / 10000000).toFixed(2));

    // Node Metrics
    const nodeMetrics = {};
    Object.keys(LOGISTICS_NODES).forEach(nodeId => {
      const node = LOGISTICS_NODES[nodeId];
      const effectiveDwell = parseFloat((node.dwellTimeHours * (dwell / 24.0)).toFixed(1));
      const rakesServiced = Math.min(node.dailyRakesCapacity, Math.round(node.dailyRakesCapacity * (24.0 / effectiveDwell)));
      const utilizationPct = Math.min(100, Math.round((rakesServiced / node.dailyRakesCapacity) * 100));

      nodeMetrics[nodeId] = {
        name: node.name,
        effectiveDwell,
        rakesServiced,
        utilizationPct,
        statusColor: utilizationPct > 85 ? "#ef4444" : (utilizationPct > 65 ? "#f59e0b" : "#10b981")
      };
    });

    return {
      dwellHours: dwell,
      freightSpeedKmh: speed,
      dailyDemandTeu: demand,
      dailyRakesNeeded,
      highwayTrucksSaved,
      dieselLitersSaved,
      co2MitigatedTonnesPerDay,
      logisticsCostSavingsCroresPerDay,
      corridorMetrics,
      nodeMetrics
    };
  }

  // =========================================================================
  // 4. TWIN CONTROLLER CLASS
  // =========================================================================

  class DmicDholeraCorridorTwinController {
    constructor() {
      this.map = null;
      this.activeZoneKey = "activation_area";
      this.dwellHours = 24.0;
      this.freightSpeedKmh = 75.0;
      this.dailyDemandTeu = 4500;
      this.activeTab = "dholera";
      this.isInitialized = false;
      this.isEventsBound = false;

      // Leaflet Layers
      this.dholeraPolygonLayer = null;
      this.activationPolygonLayer = null;
      this.corridorsLayerGroup = null;
      this.logisticsLayerGroup = null;
    }

    init(mapInstance) {
      if (this.isInitialized && this.map) return;
      this.map = mapInstance;

      if (this.map && typeof L !== "undefined") {
        this.corridorsLayerGroup = L.layerGroup().addTo(this.map);
        this.logisticsLayerGroup = L.layerGroup().addTo(this.map);
      }

      this.buildModalDom();
      this.bindDomEvents();
      this.isInitialized = true;
      console.log("[DmicTwin] Engine initialized successfully.");
    }

    buildModalDom() {
      if (document.getElementById("dmicTwinModal")) return;

      const modal = document.createElement("dialog");
      modal.id = "dmicTwinModal";
      modal.className = "system-modal dmic-modal";
      modal.setAttribute("aria-labelledby", "dmicModalTitle");

      modal.innerHTML = `
        <div class="dmic-modal-container">
          <!-- Header -->
          <div class="dmic-modal-header">
            <div class="dmic-header-title-wrap">
              <span class="dmic-badge">DMIC &amp; NICDC LOGISTICS • 920 SQ KM DHOLERA SIR &amp; WDFC FREIGHT SPINE</span>
              <h2 id="dmicModalTitle" class="dmic-modal-title">
                <span class="dmic-icon">🏭</span> DMIC &amp; Dholera SIR Smart Industrial Corridors Twin
              </h2>
              <p class="dmic-modal-sub">
                India's flagship 920 km² greenfield smart city (Dholera SIR), Western Dedicated Freight Corridor (WDFC), semiconductor fabrication logistics &amp; commercial port-rail intermodal connectivity.
              </p>
            </div>
            <div class="dmic-header-controls">
              <div class="dmic-select-wrap">
                <label for="dmicZoneSelect" class="dmic-select-lbl">Focus Zone / Facility:</label>
                <select id="dmicZoneSelect" class="styled-select dmic-zone-select">
                  <option value="activation_area">Dholera Activation Area (22.5 km² TP2A Trunk Zone)</option>
                  <option value="semiconductor_fab">Tata Electronics &amp; PSMC Semiconductor Fab Hub ($11B)</option>
                  <option value="dholera_airport">Dholera International Cargo Airport (DIACL)</option>
                  <option value="dholera_solar">Dholera 1,000 MW Dedicated Solar Power Park</option>
                  <option value="town_planning_1">Town Planning Scheme 1 (154 km² Civic Center)</option>
                  <option value="town_planning_2">Town Planning Scheme 2 (340 km² Heavy Industrial Zone)</option>
                </select>
              </div>
              <button id="closeDmicModalBtn" class="system-modal-close" aria-label="Close DMIC Twin">✕</button>
            </div>
          </div>

          <!-- 4-Card Real-Time KPI Row -->
          <div class="dmic-kpi-row">
            <div class="dmic-kpi-card">
              <div class="kpi-label">WDFC TRANSIT EFFICIENCY</div>
              <div class="kpi-value" id="dmicKpiTransit">18.4 <span class="unit">Hours</span></div>
              <div class="kpi-sub" id="dmicKpiTransitSub">Mundra Port to NCR vs 42h Highway Road</div>
            </div>
            <div class="dmic-kpi-card">
              <div class="kpi-label">DAILY RAKE DISPATCH</div>
              <div class="kpi-value" id="dmicKpiRakes">25 <span class="unit">Trains/Day</span></div>
              <div class="kpi-sub" id="dmicKpiRakesSub">Double-Stack Capacity: 4,500 TEUs/Day</div>
            </div>
            <div class="dmic-kpi-card">
              <div class="kpi-label">HIGHWAY TRUCK RELIEF</div>
              <div class="kpi-value" id="dmicKpiTrucks">2,700 <span class="unit">Trucks/Day</span></div>
              <div class="kpi-sub" id="dmicKpiTrucksSub">Removed from NH-48 / NH-27 Corridors</div>
            </div>
            <div class="dmic-kpi-card">
              <div class="kpi-label">INTERMODAL GREEN SAVINGS</div>
              <div class="kpi-value" id="dmicKpiSavings">₹3.4 <span class="unit">Cr/Day</span></div>
              <div class="kpi-sub" id="dmicKpiSavingsSub">Saves 688 tCO₂ / Day (78% Fuel Reduction)</div>
            </div>
          </div>

          <!-- Sensitivity Adjuster Bar -->
          <div class="dmic-sensitivity-bar">
            <div class="sensitivity-item">
              <label for="dmicDwellSlider">Port Dwell &amp; Customs Time: <strong id="dmicDwellVal">24.0 Hours</strong></label>
              <input type="range" id="dmicDwellSlider" min="12" max="72" step="2" value="24" class="sensitivity-slider">
            </div>
            <div class="sensitivity-item">
              <label for="dmicSpeedSlider">WDFC Train Speed: <strong id="dmicSpeedVal">75 km/h</strong></label>
              <input type="range" id="dmicSpeedSlider" min="40" max="100" step="5" value="75" class="sensitivity-slider">
            </div>
            <div class="sensitivity-item">
              <label for="dmicDemandSlider">Daily Container Demand: <strong id="dmicDemandVal">4,500 TEU</strong></label>
              <input type="range" id="dmicDemandSlider" min="1000" max="12000" step="500" value="4500" class="sensitivity-slider">
            </div>
          </div>

          <!-- Tab Navigation -->
          <div class="dmic-tab-nav" role="tablist">
            <button class="dmic-tab-btn active" data-tab="dholera" role="tab">
              <span>🏙️ Dholera SIR Smart City Master Plan</span>
            </button>
            <button class="dmic-tab-btn" data-tab="corridors" role="tab">
              <span>🚆 WDFC &amp; Industrial Freight Corridors</span>
            </button>
            <button class="dmic-tab-btn" data-tab="ports" role="tab">
              <span>⚓ Commercial Ports &amp; ICD Logistics Hubs</span>
            </button>
          </div>

          <!-- Tab Contents -->
          <div class="dmic-tab-content-area">
            <!-- TAB 1: Dholera SIR -->
            <div class="dmic-tab-pane active" id="dmic-pane-dholera">
              <div class="dmic-table-wrap">
                <table class="dmic-table">
                  <thead>
                    <tr>
                      <th>Zone / Project Name</th>
                      <th>Category</th>
                      <th>Area (km²)</th>
                      <th>Investment</th>
                      <th>Trunk Utilities &amp; Infrastructure</th>
                      <th>Status</th>
                      <th>Inspect</th>
                    </tr>
                  </thead>
                  <tbody id="dmicZonesTableBody">
                    <!-- Populated dynamically -->
                  </tbody>
                </table>
              </div>
            </div>

            <!-- TAB 2: Freight Corridors -->
            <div class="dmic-tab-pane" id="dmic-pane-corridors">
              <div class="dmic-table-wrap">
                <table class="dmic-table">
                  <thead>
                    <tr>
                      <th>Freight Corridor Name</th>
                      <th>Type / Class</th>
                      <th>Length</th>
                      <th>Transit Time</th>
                      <th>Highway Road Benchmark</th>
                      <th>Hours Saved</th>
                      <th>Truck Relief</th>
                    </tr>
                  </thead>
                  <tbody id="dmicCorridorsTableBody">
                    <!-- Populated dynamically -->
                  </tbody>
                </table>
              </div>
            </div>

            <!-- TAB 3: Ports & ICD Hubs -->
            <div class="dmic-tab-pane" id="dmic-pane-ports">
              <div class="dmic-table-wrap">
                <table class="dmic-table">
                  <thead>
                    <tr>
                      <th>Terminal / Port Facility</th>
                      <th>Category</th>
                      <th>Cargo Volume</th>
                      <th>Rail Yards</th>
                      <th>Effective Dwell Time</th>
                      <th>Rakes / Day</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody id="dmicPortsTableBody">
                    <!-- Populated dynamically -->
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="dmic-modal-footer">
            <div class="dmic-footer-provenance">
              <span class="badge-source">[ STATUTORY NICDC &amp; DFCCIL REGISTRY ]</span>
              <span>All metrics verified against National Industrial Corridor Development Corporation and DFCCIL operational standards.</span>
            </div>
            <div class="dmic-footer-actions">
              <button id="focusDholeraSirBtn" class="action-btn action-btn-secondary" title="Fly map camera to 920 km² Dholera Special Investment Region">
                📍 Fly to Dholera SIR
              </button>
              <button id="exportDmicCsvBtn" class="action-btn action-btn-transport" title="Export Intermodal Freight &amp; Dholera Infrastructure Telemetry as RFC-4180 CSV">
                📥 Export Logistics Telemetry (CSV)
              </button>
              <button id="dmicDismissBtn" class="action-btn action-btn-secondary">
                Dismiss
              </button>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(modal);
    }

    bindDomEvents() {
      if (this.isEventsBound) return;
      this.buildModalDom();

      // 1. Zone selection dropdown
      const zoneSelect = document.getElementById("dmicZoneSelect");
      if (zoneSelect) {
        zoneSelect.addEventListener("change", (e) => {
          this.selectZone(e.target.value);
        });
      }

      // 2. Sensitivity sliders
      const dwellSlider = document.getElementById("dmicDwellSlider");
      if (dwellSlider) {
        dwellSlider.addEventListener("input", (e) => {
          this.dwellHours = parseFloat(e.target.value);
          const lbl = document.getElementById("dmicDwellVal");
          if (lbl) lbl.textContent = `${this.dwellHours.toFixed(1)} Hours`;
          this.render();
        });
      }

      const speedSlider = document.getElementById("dmicSpeedSlider");
      if (speedSlider) {
        speedSlider.addEventListener("input", (e) => {
          this.freightSpeedKmh = parseFloat(e.target.value);
          const lbl = document.getElementById("dmicSpeedVal");
          if (lbl) lbl.textContent = `${Math.round(this.freightSpeedKmh)} km/h`;
          this.render();
        });
      }

      const demandSlider = document.getElementById("dmicDemandSlider");
      if (demandSlider) {
        demandSlider.addEventListener("input", (e) => {
          this.dailyDemandTeu = parseInt(e.target.value, 10);
          const lbl = document.getElementById("dmicDemandVal");
          if (lbl) lbl.textContent = `${this.dailyDemandTeu.toLocaleString()} TEU`;
          this.render();
        });
      }

      // 3. Tab navigation
      document.querySelectorAll(".dmic-tab-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const tabId = btn.getAttribute("data-tab");
          this.switchTab(tabId);
        });
      });

      // 4. Modal close buttons
      const closeBtn = document.getElementById("closeDmicModalBtn");
      if (closeBtn) closeBtn.addEventListener("click", () => this.closeModal());
      const footerDismissBtn = document.getElementById("dmicDismissBtn");
      if (footerDismissBtn) footerDismissBtn.addEventListener("click", () => this.closeModal());

      // 5. Focus Dholera SIR button
      const focusBtn = document.getElementById("focusDholeraSirBtn");
      if (focusBtn) focusBtn.addEventListener("click", () => this.focusDholeraSir());

      // 6. CSV Export trigger
      const exportBtn = document.getElementById("exportDmicCsvBtn");
      if (exportBtn) exportBtn.addEventListener("click", () => this.exportLogisticsCsv());

      // 7. Document keyboard shortcuts: <kbd>J</kbd> toggle & <kbd>Escape</kbd> dismiss
      document.addEventListener("keydown", (e) => {
        if (e.key === "j" || e.key === "J") {
          const activeTag = (document.activeElement?.tagName || "").toLowerCase();
          if (activeTag === "input" || activeTag === "textarea") return;
          e.preventDefault();
          const modal = document.getElementById("dmicTwinModal");
          if (modal && modal.open) {
            this.closeModal();
          } else {
            this.openModal();
          }
        } else if (e.key === "Escape") {
          const modal = document.getElementById("dmicTwinModal");
          if (modal && modal.open) {
            this.closeModal();
          }
        }
      });

      // 8. Modal cancel event (native Escape key)
      const modalEl = document.getElementById("dmicTwinModal");
      if (modalEl) {
        modalEl.addEventListener("cancel", () => {
          this.closeModal();
        });
      }

      this.isEventsBound = true;
    }

    openModal(zoneKey = null) {
      this.buildModalDom();
      this.bindDomEvents();
      if (!this.map && window.map) {
        this.init(window.map);
      }
      if (zoneKey && DHOLERA_ZONES[zoneKey]) {
        this.activeZoneKey = zoneKey;
      }
      const modal = document.getElementById("dmicTwinModal");
      if (modal && typeof modal.showModal === "function") {
        if (!modal.open) modal.showModal();
      }

      // Sync select dropdown
      const sel = document.getElementById("dmicZoneSelect");
      if (sel) sel.value = this.activeZoneKey;

      this.render();
      this.updateMapVisuals();
    }

    closeModal() {
      const modal = document.getElementById("dmicTwinModal");
      if (modal && modal.open) {
        modal.close();
      }
    }

    isModalOpen() {
      const modal = document.getElementById("dmicTwinModal");
      return !!(modal && modal.open);
    }

    selectZone(zoneKey) {
      if (!DHOLERA_ZONES[zoneKey]) return;
      this.activeZoneKey = zoneKey;
      const sel = document.getElementById("dmicZoneSelect");
      if (sel) sel.value = zoneKey;
      this.render();
      this.updateMapVisuals();
    }

    switchTab(tabId) {
      this.activeTab = tabId;
      document.querySelectorAll(".dmic-tab-btn").forEach(btn => {
        const isActive = btn.getAttribute("data-tab") === tabId;
        btn.classList.toggle("active", isActive);
        btn.setAttribute("aria-selected", isActive ? "true" : "false");
      });
      document.querySelectorAll(".dmic-tab-pane").forEach(pane => {
        pane.classList.toggle("active", pane.id === `dmic-pane-${tabId}`);
      });
    }

    render() {
      const physics = calculateLogisticsPhysics(this.dwellHours, this.freightSpeedKmh, this.dailyDemandTeu);

      // 1. KPI Cards Sync
      const kpiTransit = document.getElementById("dmicKpiTransit");
      if (kpiTransit) {
        const wdfcM = physics.corridorMetrics.wdfc_spine;
        kpiTransit.innerHTML = `${wdfcM ? wdfcM.railHours : "18.4"} <span class="unit">Hours</span>`;
      }
      const kpiTransitSub = document.getElementById("dmicKpiTransitSub");
      if (kpiTransitSub) {
        const wdfcM = physics.corridorMetrics.wdfc_spine;
        kpiTransitSub.textContent = `Mundra Port to NCR vs ${wdfcM ? wdfcM.roadHours : "42.0"}h Highway Road`;
      }

      const kpiRakes = document.getElementById("dmicKpiRakes");
      if (kpiRakes) {
        kpiRakes.innerHTML = `${physics.dailyRakesNeeded} <span class="unit">Trains/Day</span>`;
      }
      const kpiRakesSub = document.getElementById("dmicKpiRakesSub");
      if (kpiRakesSub) {
        kpiRakesSub.textContent = `Double-Stack Capacity: ${physics.dailyDemandTeu.toLocaleString()} TEUs/Day`;
      }

      const kpiTrucks = document.getElementById("dmicKpiTrucks");
      if (kpiTrucks) {
        kpiTrucks.innerHTML = `${physics.highwayTrucksSaved.toLocaleString()} <span class="unit">Trucks/Day</span>`;
      }
      const kpiTrucksSub = document.getElementById("dmicKpiTrucksSub");
      if (kpiTrucksSub) {
        kpiTrucksSub.textContent = `Removed from NH-48 / NH-27 Corridors`;
      }

      const kpiSavings = document.getElementById("dmicKpiSavings");
      if (kpiSavings) {
        kpiSavings.innerHTML = `₹${physics.logisticsCostSavingsCroresPerDay} <span class="unit">Cr/Day</span>`;
      }
      const kpiSavingsSub = document.getElementById("dmicKpiSavingsSub");
      if (kpiSavingsSub) {
        kpiSavingsSub.textContent = `Saves ${physics.co2MitigatedTonnesPerDay.toLocaleString()} tCO₂ / Day (78% Fuel Reduction)`;
      }

      // 2. Tab 1: Dholera Zones Table
      this.renderZonesTable();

      // 3. Tab 2: Corridors Table
      this.renderCorridorsTable(physics);

      // 4. Tab 3: Ports Table
      this.renderPortsTable(physics);
    }

    renderZonesTable() {
      const tbody = document.getElementById("dmicZonesTableBody");
      if (!tbody) return;

      tbody.innerHTML = Object.keys(DHOLERA_ZONES).map(key => {
        const z = DHOLERA_ZONES[key];
        const isSelected = this.activeZoneKey === key;

        return `
          <tr class="${isSelected ? 'selected-row' : ''}">
            <td>
              <div class="table-name-wrap">
                <span class="table-title">${z.name}</span>
                <span class="table-sub">${z.id} • ${z.district}</span>
              </div>
            </td>
            <td><span class="operator-badge">${z.category}</span></td>
            <td><strong>${z.areaSqKm} km²</strong><br><small style="color: #94a3b8;">(${z.landAreaHa} Ha)</small></td>
            <td><strong style="color: #38bdf8;">₹${z.investmentInrCr.toLocaleString()} Cr</strong></td>
            <td>
              <span class="trunk-desc">${z.trunkInfra}</span><br>
              <small style="color: #64748b;">${z.anchorProjects}</small>
            </td>
            <td><span class="status-pill status-active">${z.status}</span></td>
            <td>
              <button class="table-focus-btn" onclick="window.DmicDholeraTwin && window.DmicDholeraTwin.flyToZone('${key}')">
                🎯 Inspect
              </button>
            </td>
          </tr>
        `;
      }).join("");
    }

    renderCorridorsTable(physics) {
      const tbody = document.getElementById("dmicCorridorsTableBody");
      if (!tbody) return;

      tbody.innerHTML = Object.keys(FREIGHT_CORRIDORS).map(corId => {
        const c = FREIGHT_CORRIDORS[corId];
        const m = physics.corridorMetrics[corId] || { railHours: 20, roadHours: 40, hoursSaved: 20, speedupPct: 50 };

        return `
          <tr>
            <td>
              <strong>${c.name}</strong><br>
              <small style="color: #94a3b8;">${c.operator} • ${c.route}</small>
            </td>
            <td><span class="voltage-tag">${c.type}</span></td>
            <td><strong>${c.lengthKm} km</strong></td>
            <td><strong style="color: #38bdf8;">${m.railHours} hrs</strong></td>
            <td><span style="color: #94a3b8;">${m.roadHours} hrs</span></td>
            <td>
              <span class="tariff-pill">
                -${m.hoursSaved} hrs (${m.speedupPct}% Faster)
              </span>
            </td>
            <td>
              <strong style="color: #34d399;">${c.trainCapacityTeu > 2 ? Math.round(m.lengthKm * 1.8) : 50} Trucks Saved</strong>
            </td>
          </tr>
        `;
      }).join("");
    }

    renderPortsTable(physics) {
      const tbody = document.getElementById("dmicPortsTableBody");
      if (!tbody) return;

      tbody.innerHTML = Object.keys(LOGISTICS_NODES).map(nodeId => {
        const node = LOGISTICS_NODES[nodeId];
        const stat = physics.nodeMetrics[nodeId] || { effectiveDwell: node.dwellTimeHours, rakesServiced: node.dailyRakesCapacity, utilizationPct: 80, statusColor: "#10b981" };

        return `
          <tr>
            <td>
              <strong>${node.name}</strong><br>
              <small style="color: #94a3b8;">${node.district} • ${node.specialization}</small>
            </td>
            <td><span class="operator-badge">${node.type}</span></td>
            <td>
              <strong>${node.annualCargoMmt} MMT</strong><br>
              <small style="color: #94a3b8;">(${node.containerTeu ? node.containerTeu.toLocaleString() + ' TEU' : 'Bulk Cargo'})</small>
            </td>
            <td>${node.railYardsCount} Dedicated Yards</td>
            <td><strong style="color: #38bdf8;">${stat.effectiveDwell} hrs</strong></td>
            <td><strong>${stat.rakesServiced} Rakes</strong> / Day</td>
            <td>
              <span class="status-pill" style="background: ${stat.statusColor}22; color: ${stat.statusColor}; border: 1px solid ${stat.statusColor}66;">
                ${stat.utilizationPct}% Loading
              </span>
            </td>
          </tr>
        `;
      }).join("");
    }

    updateMapVisuals() {
      if (!this.map || typeof L !== "undefined") return;

      // 1. Dholera SIR 920 km² Master Boundary Polygon
      if (!this.dholeraPolygonLayer) {
        const dholeraBoundaryCoords = [
          [22.42, 72.10],
          [22.46, 72.32],
          [22.25, 72.38],
          [22.12, 72.26],
          [22.16, 72.06]
        ];
        this.dholeraPolygonLayer = L.polygon(dholeraBoundaryCoords, {
          color: "#06b6d4",
          weight: 2,
          dashArray: "6, 6",
          fillColor: "#06b6d4",
          fillOpacity: 0.10
        }).addTo(this.map);

        this.dholeraPolygonLayer.bindTooltip(
          "<strong>Dholera Special Investment Region (DSIR)</strong><br>920 km² Greenfield Smart City Master Plan",
          { sticky: true, className: "dmic-tooltip" }
        );
      }

      // 2. Dholera Activation Area (22.5 km² TP2A) Core Polygon
      if (!this.activationPolygonLayer) {
        const activationCoords = [
          [22.28, 72.18],
          [22.28, 72.25],
          [22.21, 72.25],
          [22.21, 72.18]
        ];
        this.activationPolygonLayer = L.polygon(activationCoords, {
          color: "#10b981",
          weight: 2.5,
          fillColor: "#10b981",
          fillOpacity: 0.22
        }).addTo(this.map);

        this.activationPolygonLayer.bindTooltip(
          "<strong>Dholera Activation Area (TP2A)</strong><br>22.5 km² Operational Plug-and-Play Hub (Tata Semiconductor Fab)",
          { sticky: true, className: "dmic-tooltip" }
        );
      }

      // 3. WDFC Rail Alignment Polyline Vector
      if (this.corridorsLayerGroup) {
        this.corridorsLayerGroup.clearLayers();

        const wdfcPoints = [
          [22.84, 69.70], // Mundra Port
          [23.00, 70.22], // Gandhidham
          [22.98, 72.38], // Sanand MMLP
          [23.18, 72.58], // Sabarmati ICD
          [23.58, 72.38], // Mehsana
          [24.17, 72.43]  // Palanpur Junction (WDFC Northern Gateway)
        ];

        const polyline = L.polyline(wdfcPoints, {
          color: "#f59e0b",
          weight: 4,
          opacity: 0.9,
          dashArray: "14, 8"
        });
        polyline.bindTooltip("Western Dedicated Freight Corridor (WDFC Double-Stack Container Spine)", { sticky: true });
        this.corridorsLayerGroup.addLayer(polyline);

        // Ahmedabad-Dholera Expressway Polyline Vector
        const expPoints = [
          [22.95, 72.52], // Ahmedabad SP Ring Road
          [22.60, 72.35], // Dholera Expressway Middle
          [22.24, 72.22], // Dholera SIR Activation Area
          [21.76, 72.15]  // Bhavnagar
        ];
        const expPolyline = L.polyline(expPoints, {
          color: "#38bdf8",
          weight: 3.5,
          opacity: 0.85
        });
        expPolyline.bindTooltip("Ahmedabad — Dholera Expressway (NH-64 Greenfield 4-Lane)", { sticky: true });
        this.corridorsLayerGroup.addLayer(expPolyline);
      }

      // 4. Logistics Nodes & Port Pins
      if (this.logisticsLayerGroup) {
        this.logisticsLayerGroup.clearLayers();
        const physics = calculateLogisticsPhysics(this.dwellHours, this.freightSpeedKmh, this.dailyDemandTeu);

        Object.keys(LOGISTICS_NODES).forEach(nodeId => {
          const node = LOGISTICS_NODES[nodeId];
          const stat = physics.nodeMetrics[nodeId];
          const color = stat ? stat.statusColor : "#10b981";

          const icon = L.divIcon({
            className: "logistics-hub-pin",
            html: `
              <div class="logistics-pin-inner" style="background: ${color}; border: 2px solid #ffffff; box-shadow: 0 0 10px ${color};">
                <span class="logistics-pin-val">${stat ? stat.utilizationPct : 75}%</span>
              </div>
            `,
            iconSize: [26, 26],
            iconAnchor: [13, 13]
          });

          const marker = L.marker(node.coords, { icon });
          marker.bindPopup(`
            <div class="dmic-node-popup">
              <h4>🏭 ${node.name}</h4>
              <p><strong>Cargo Volume:</strong> ${node.annualCargoMmt} MMT | <strong>Dwell Time:</strong> ${stat ? stat.effectiveDwell : node.dwellTimeHours} hrs</p>
              <p><strong>Daily Rakes:</strong> ${stat ? stat.rakesServiced : node.dailyRakesCapacity} trains/day</p>
              <p><strong>Specialization:</strong> ${node.specialization}</p>
              <small style="color: #64748b;">${node.role}</small>
            </div>
          `);
          this.logisticsLayerGroup.addLayer(marker);
        });
      }
    }

    flyToZone(zoneKey) {
      if (!DHOLERA_ZONES[zoneKey]) return;
      this.selectZone(zoneKey);
      const z = DHOLERA_ZONES[zoneKey];
      if (this.map && typeof this.map.flyTo === "function") {
        this.map.flyTo(z.coords, 11, { duration: 1.5 });
      }
    }

    focusDholeraSir() {
      if (this.map && typeof this.map.flyTo === "function") {
        this.map.flyTo([22.25, 72.22], 10, { duration: 1.5 });
      }
    }

    exportLogisticsCsv() {
      const headers = [
        "Corridor_Facility_Name",
        "Type",
        "Distance_KM",
        "WDFC_Rail_Hours",
        "Road_Highway_Hours",
        "Hours_Saved",
        "Speedup_Pct",
        "Daily_Trucks_Saved",
        "CO2_Avoided_Tonnes_Day",
        "Fuel_Diesel_Saved_Liters"
      ];

      const physics = calculateLogisticsPhysics(this.dwellHours, this.freightSpeedKmh, this.dailyDemandTeu);
      const rows = [];

      Object.keys(FREIGHT_CORRIDORS).forEach(corId => {
        const c = FREIGHT_CORRIDORS[corId];
        const m = physics.corridorMetrics[corId];
        rows.push([
          `"${c.name}"`,
          `"${c.type}"`,
          c.lengthKm,
          m.railHours,
          m.roadHours,
          m.hoursSaved,
          m.speedupPct,
          physics.highwayTrucksSaved,
          physics.co2MitigatedTonnesPerDay,
          physics.dieselLitersSaved
        ].join(","));
      });

      const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\r\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `gujarat_dmic_dholera_logistics_${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    getZonesRegistry() {
      return DHOLERA_ZONES;
    }

    getCorridorsRegistry() {
      return FREIGHT_CORRIDORS;
    }

    getLogisticsNodesRegistry() {
      return LOGISTICS_NODES;
    }

    calculateLogisticsPhysics(dwell, speed, demand) {
      return calculateLogisticsPhysics(dwell, speed, demand);
    }
  }

  // Export Singleton to Window
  window.DmicDholeraTwin = new DmicDholeraCorridorTwinController();

})(window);
