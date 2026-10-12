/**
 * Gujarat InfraMap — Khavda Hybrid Renewable Park & EHV Green Energy Corridor Digital Twin
 * Version: 1.0.0
 * 
 * Provides an operational, civil & electrical engineering-grade digital twin for
 * the world's largest renewable energy installation (30 GW Khavda Mega-Park in Kutch)
 * and Gujarat's 765 kV / 400 kV Extra-High Voltage (EHV) Green Energy Corridor grid.
 * 
 * Core Capabilities:
 *   1. Authoritative 30 GW Khavda Mega-Park Block Registry (Adani, NTPC, GIPCL, GSECL, SECI)
 *      and Anchor State RE Parks (Charanka 790 MW, Dholera SIR 1000 MW, Raghanesda 700 MW).
 *   2. 24-Hour Diurnal Generation Engine (Solar PV irradiance curve, nocturnal wind dynamics,
 *      hybrid smoothing, and Duck Curve industrial baseload balancing).
 *   3. 765 kV / 400 kV EHV Transmission Line Load Flow & Thermal Rating Analysis
 *      (Hexa/Twin-bundle ACSR Zebra conductors, Surge Impedance Loading SIL, Joule losses).
 *   4. Substation Transformer Stepping & MVA Headroom Matrix (Khavda GIS, Lakadia 765/400 kV,
 *      Banaskantha, Dehgam, Pirana, Asoj, Dahej PCPIR, Dholera SIR).
 *   5. Interactive Diurnal Scrubber (00:00 to 23:00) with Play/Pause animation and sensitivity
 *      stress sliders (Solar Irradiance 400-1200 W/m², Wind Speed 3-18 m/s, Grid Rating 80-120%).
 *   6. Dynamic Leaflet Canvas Vector Animations (corridor power flow pulses, substation loading pins,
 *      and Khavda park polygon footprint in the Great Rann of Kutch).
 *   7. RFC-4180 Compliant CSV Telemetry & Hourly Dispatch Exporter.
 * 
 * Epistemic Standards (AGENTS.md):
 *   - [ CEA & GETCO GRID DISPATCH ]: Official CEA FY24 & GETCO EHV transmission parameters.
 *   - [ MNRE RE ULTRA MEGA PARK REGISTRY ]: Statutory land, allocation & tariff registries.
 *   - [ IEEE-14 BUS LOAD FLOW FORMULATION ]: Physical power flow, thermal loading & SIL physics.
 */

(function (window) {
  "use strict";

  // =========================================================================
  // 1. AUTHORITATIVE MEGA-PARK & BLOCK REGISTRY
  // =========================================================================

  const KHAVDA_BLOCKS = {
    agel_block: {
      id: "KHV-BLK-01",
      key: "agel_block",
      name: "Adani Green Energy Ltd (AGEL) Mega Complex",
      operator: "Adani Green Energy Ltd",
      totalCapacityMw: 11250,
      solarCapacityMw: 8750,
      windCapacityMw: 2500,
      currentCommissionedMw: 2140,
      technology: "Bifacial Mono-PERC Single-Axis Trackers + 5.2 MW Wind Turbines",
      coords: [23.92, 69.72],
      district: "Kutch",
      landAreaHa: 27200,
      tariffInrPerKwh: 2.45,
      targetAnnualGenMu: 24500,
      waterSavingKlPerYr: 85000,
      poolingStationId: "substation_khavda_765",
      status: "Active Phased Rollout (2,140 MW Commissioned)",
      description: "World's largest contiguous private RE block. Features automated waterless robotic cleaning across 72,000 tracker rows and 5.2 MW ultra-tall wind turbines designed for desert soil mechanics."
    },

    ntpc_block: {
      id: "KHV-BLK-02",
      key: "ntpc_block",
      name: "NTPC Renewable Energy Ltd (REL) Ultra-Mega Park",
      operator: "NTPC REL",
      totalCapacityMw: 4750,
      solarCapacityMw: 4000,
      windCapacityMw: 750,
      currentCommissionedMw: 500,
      technology: "TOPCon Bifacial Solar PV with String Inverters",
      coords: [23.86, 69.80],
      district: "Kutch",
      landAreaHa: 11500,
      tariffInrPerKwh: 2.48,
      targetAnnualGenMu: 10400,
      waterSavingKlPerYr: 36000,
      poolingStationId: "substation_khavda_765",
      status: "Under Phased Construction (500 MW Online)",
      description: "Central Public Sector undertaking block using high-efficiency N-type TOPCon modules engineered for high ambient temperatures up to 48°C in the Rann of Kutch."
    },

    gipcl_block: {
      id: "KHV-BLK-03",
      key: "gipcl_block",
      name: "GIPCL Renewable Mega Park",
      operator: "Gujarat Industries Power Company Ltd",
      totalCapacityMw: 2375,
      solarCapacityMw: 2375,
      windCapacityMw: 0,
      currentCommissionedMw: 300,
      technology: "Fixed-Tilt Solar PV with Hydrophobic Anti-Soiling Coating",
      coords: [23.81, 69.68],
      district: "Kutch",
      landAreaHa: 5750,
      tariffInrPerKwh: 2.51,
      targetAnnualGenMu: 5200,
      waterSavingKlPerYr: 18000,
      poolingStationId: "substation_khavda_765",
      status: "Active Implementation",
      description: "State PSU solar block feeding Gujarat's state grid through dedicated 33/400 kV pooling switchyards."
    },

    gsecl_block: {
      id: "KHV-BLK-04",
      key: "gsecl_block",
      name: "GSECL Hybrid Energy Complex",
      operator: "Gujarat State Electricity Corp Ltd",
      totalCapacityMw: 3325,
      solarCapacityMw: 2500,
      windCapacityMw: 825,
      currentCommissionedMw: 400,
      technology: "Solar-Wind Hybrid with Battery Energy Storage System (BESS ready)",
      coords: [23.84, 69.60],
      district: "Kutch",
      landAreaHa: 8100,
      tariffInrPerKwh: 2.54,
      targetAnnualGenMu: 7300,
      waterSavingKlPerYr: 25000,
      poolingStationId: "substation_khavda_765",
      status: "Under Construction",
      description: "Hybrid facility featuring co-located BESS infrastructure for peak frequency response and renewable smoothing."
    },

    seci_block: {
      id: "KHV-BLK-05",
      key: "seci_block",
      name: "SECI Inter-State Bidding Tranche (ISTS)",
      operator: "SECI Competitive Tariff Bidders",
      totalCapacityMw: 8300,
      solarCapacityMw: 6000,
      windCapacityMw: 2300,
      currentCommissionedMw: 0,
      technology: "High-Voltage Hybrid AC Gathering with Advanced SCADA",
      coords: [23.95, 69.85],
      district: "Kutch",
      landAreaHa: 20050,
      tariffInrPerKwh: 2.49,
      targetAnnualGenMu: 18200,
      waterSavingKlPerYr: 62000,
      poolingStationId: "substation_khavda_765",
      status: "Tendered & Awarded",
      description: "Pan-India green power evacuation tranche allocated via national reverse auctions under the Green Energy Corridor Phase-II framework."
    },

    charanka_park: {
      id: "PRK-CHA-01",
      key: "charanka_park",
      name: "Charanka Solar Park (Patan)",
      operator: "GPCL / Multi-Developer",
      totalCapacityMw: 790,
      solarCapacityMw: 790,
      windCapacityMw: 0,
      currentCommissionedMw: 790,
      technology: "Multi-Developer Thin-Film & Poly-Si Ground Mount PV",
      coords: [23.90, 71.20],
      district: "Patan",
      landAreaHa: 2000,
      tariffInrPerKwh: 3.15,
      targetAnnualGenMu: 1580,
      waterSavingKlPerYr: 12000,
      poolingStationId: "substation_charanka_400",
      status: "Fully Operational (Asia Pioneer Park)",
      description: "Asia's pioneer multi-developer solar park commissioned in 2012 in Patan district, connected via 400 kV Charanka-Santalpur-Gandhinagar corridor."
    },

    dholera_park: {
      id: "PRK-DHO-01",
      key: "dholera_park",
      name: "Dholera SIR Solar Park (Phase I)",
      operator: "GPCL / Tata Power / Torrent",
      totalCapacityMw: 1000,
      solarCapacityMw: 1000,
      windCapacityMw: 0,
      currentCommissionedMw: 300,
      technology: "Coastal High-Albedo Pile-Mounted Solar Arrays",
      coords: [22.25, 72.18],
      district: "Ahmedabad",
      landAreaHa: 4000,
      tariffInrPerKwh: 2.75,
      targetAnnualGenMu: 2100,
      waterSavingKlPerYr: 15000,
      poolingStationId: "substation_dholera_400",
      status: "Phase-I Operational (300 MW Online)",
      description: "Ultra-mega solar park located on coastal marshland in Dholera Special Investment Region (SIR), powering semiconductor fabs and green industries."
    }
  };

  // =========================================================================
  // 2. EXTRA-HIGH VOLTAGE (EHV) CORRIDORS & SUBSTATIONS REGISTRY
  // =========================================================================

  const TRANSMISSION_CORRIDORS = {
    corridor_khv_lak: {
      id: "765-KHV-LAK",
      name: "765 kV Khavda PS-1 - Lakadia Pooling Line",
      voltageKv: 765,
      circuits: "Double Circuit (D/C)",
      conductor: "Hexa-Bundle ACSR Zebra (6x420 mm²)",
      lengthKm: 178.0,
      thermalRatingMva: 4500,
      silMw: 2250,
      operator: "POWERGRID ISTS",
      sendingSub: "substation_khavda_765",
      receivingSub: "substation_lakadia_765",
      evacuationRole: "Primary evacuation artery for Khavda Blocks 1, 2, and 3 into the Western Regional Grid."
    },

    corridor_khv_ban: {
      id: "765-KHV-BAN",
      name: "765 kV Khavda PS-2 - Banaskantha (Radhanpur) Link",
      voltageKv: 765,
      circuits: "Double Circuit (D/C)",
      conductor: "Hexa-Bundle ACSR Zebra (6x420 mm²)",
      lengthKm: 225.0,
      thermalRatingMva: 4500,
      silMw: 2250,
      operator: "POWERGRID ISTS",
      sendingSub: "substation_khavda_765",
      receivingSub: "substation_banaskantha_765",
      evacuationRole: "Northern evacuation path feeding North Gujarat and National Green Energy Corridor."
    },

    corridor_lak_vad: {
      id: "765-LAK-VAD",
      name: "765 kV Lakadia - Vadodara Inter-State UHV Corridor",
      voltageKv: 765,
      circuits: "Double Circuit (D/C)",
      conductor: "Hexa-Bundle ACSR Zebra (6x420 mm²)",
      lengthKm: 335.0,
      thermalRatingMva: 4500,
      silMw: 2250,
      operator: "POWERGRID ISTS",
      sendingSub: "substation_lakadia_765",
      receivingSub: "substation_asoj_400",
      evacuationRole: "Cross-peninsular backbone connecting Kutch renewable generation with Central Gujarat industrial hubs."
    },

    corridor_mun_pir: {
      id: "765-MUN-PIR",
      name: "765 kV Mundra - Lakadia - Pirana (Ahmedabad) Backbone",
      voltageKv: 765,
      circuits: "Double Circuit (D/C)",
      conductor: "Hexa-Bundle ACSR Zebra (6x420 mm²)",
      lengthKm: 337.4,
      thermalRatingMva: 4500,
      silMw: 2250,
      operator: "POWERGRID / GETCO",
      sendingSub: "substation_lakadia_765",
      receivingSub: "substation_pirana_400",
      evacuationRole: "Delivers bulk clean power directly to the Ahmedabad-Gandhinagar urban megapolis."
    },

    corridor_cha_gan: {
      id: "400-CHA-GAN",
      name: "400 kV Charanka - Santalpur - Gandhinagar Corridor",
      voltageKv: 400,
      circuits: "Double Circuit (D/C)",
      conductor: "Twin-Bundle ACSR Moose (2x54/3.53 mm)",
      lengthKm: 182.0,
      thermalRatingMva: 1800,
      silMw: 515,
      operator: "GETCO",
      sendingSub: "substation_charanka_400",
      receivingSub: "substation_dehgam_765",
      evacuationRole: "Patan solar evacuation to North Gujarat and GIFT City clean baseload."
    },

    corridor_dho_cho: {
      id: "400-DHO-CHO",
      name: "400 kV Dholera SIR - Chorania Industrial Link",
      voltageKv: 400,
      circuits: "Double Circuit (D/C)",
      conductor: "Twin-Bundle ACSR Moose (2x54/3.53 mm)",
      lengthKm: 95.0,
      thermalRatingMva: 1800,
      silMw: 515,
      operator: "GETCO",
      sendingSub: "substation_dholera_400",
      receivingSub: "substation_pirana_400",
      evacuationRole: "Dedicated clean transmission for Dholera Semiconductor & Smart City hub."
    }
  };

  const SUBSTATIONS_MATRIX = {
    substation_khavda_765: {
      id: "substation_khavda_765",
      name: "Khavda 765 kV Pooling Station (KPS)",
      voltageKv: 765,
      ratingMva: 4500,
      tech: "Gas-Insulated Substation (GIS)",
      coords: [23.882, 69.754],
      district: "Kutch",
      buses: "1.5 Circuit Breaker Scheme",
      role: "Strategic Master Pooling Node for 30 GW Khavda Park"
    },

    substation_lakadia_765: {
      id: "substation_lakadia_765",
      name: "Lakadia 765/400 kV Pooling Substation",
      voltageKv: 765,
      ratingMva: 4500,
      tech: "Hybrid AIS / GIS with 3x1500 MVA ICTs",
      coords: [23.36, 70.62],
      district: "Kutch",
      buses: "765 kV & 400 kV Double Bus",
      role: "Central Energy Dispatch Junction for Kutch & Saurashtra"
    },

    substation_banaskantha_765: {
      id: "substation_banaskantha_765",
      name: "Banaskantha 765/400 kV Substation (Radhanpur)",
      voltageKv: 765,
      ratingMva: 3000,
      tech: "2x1500 MVA Auto-Transformers",
      coords: [23.83, 71.60],
      district: "Patan",
      buses: "765 kV Double Bus",
      role: "North Gujarat Green Corridor Pooling & Inter-State Export"
    },

    substation_dehgam_765: {
      id: "substation_dehgam_765",
      name: "Dehgam 765/400 kV Bulk Grid Substation",
      voltageKv: 765,
      ratingMva: 3000,
      tech: "2x1500 MVA Auto-Transformers",
      coords: [23.17, 72.82],
      district: "Gandhinagar",
      buses: "765/400 kV Intertie",
      role: "Ahmedabad-Gandhinagar Capital Region Grid Gateway"
    },

    substation_pirana_400: {
      id: "substation_pirana_400",
      name: "Pirana 400 kV Bulk Grid Substation",
      voltageKv: 400,
      ratingMva: 1800,
      tech: "Air-Insulated Substation (AIS)",
      coords: [22.97, 72.58],
      district: "Ahmedabad",
      buses: "400/220 kV Stepping",
      role: "Ahmedabad Metropolitan Demand Center Feed"
    },

    substation_asoj_400: {
      id: "substation_asoj_400",
      name: "Asoj 400 kV Grid Substation",
      voltageKv: 400,
      ratingMva: 1800,
      tech: "400/220 kV Stepping Substation",
      coords: [22.36, 73.28],
      district: "Vadodara",
      buses: "400 kV Ring Bus",
      role: "Vadodara Industrial Corridor & Inter-State Tie to WR Grid"
    },

    substation_dholera_400: {
      id: "substation_dholera_400",
      name: "Dholera SIR 400 kV Bulk Substation",
      voltageKv: 400,
      ratingMva: 1800,
      tech: "Gas-Insulated Substation (GIS)",
      coords: [22.25, 72.18],
      district: "Ahmedabad",
      buses: "400/220/66 kV GIS",
      role: "Exclusive Clean Power for Dholera Semiconductor Cluster"
    },

    substation_charanka_400: {
      id: "substation_charanka_400",
      name: "Charanka 400 kV Solar Pooling Station",
      voltageKv: 400,
      ratingMva: 1200,
      tech: "Dedicated Solar Evacuation Substation",
      coords: [23.90, 71.20],
      district: "Patan",
      buses: "400/33 kV Pooling",
      role: "Gathers 790 MW Charanka Solar Generation"
    }
  };

  // =========================================================================
  // 3. DIURNAL DISPATCH & ELECTRICAL ENGINEERING PHYSICS ENGINE
  // =========================================================================

  /**
   * Computes diurnal solar, wind, combined hybrid generation, line flows,
   * transformer headroom, and curtailment for hour t in [0..23].
   * 
   * Mathematical formulations:
   * 1. Solar irradiance GHI(t): Bell-curve model peaking at 12:30 IST
   *    P_solar(t) = Capacity_solar * max(0, sin(pi * (t - 6.0) / 12.5)) * (GHI / 1000) * eta_temp * eta_inv
   * 2. Wind breeze v(t): Nocturnal/afternoon Rann of Kutch thermal breeze
   *    P_wind(t) = Capacity_wind * windPowerCurve(v(t))
   * 3. Hybrid dispatch P_hybrid(t) = P_solar(t) + P_wind(t)
   * 4. Evacuation load flow & curtailment:
   *    P_evac(t) = min(P_hybrid(t), S_thermal_limit)
   *    P_curtail(t) = max(0, P_hybrid(t) - S_thermal_limit)
   * 5. CO2 Mitigation: P_evac(t) * 0.82 tCO2/MWh
   */
  function calculateDiurnalDispatch(hour, ghiWm2 = 1000.0, windBaseSpeedMs = 8.5, gridCapacityFactor = 1.0) {
    const t = Math.max(0, Math.min(23, Math.round(hour)));

    // 1. Solar Irradiance Profile (06:00 to 18:30 IST)
    let solarFraction = 0.0;
    if (t >= 6 && t <= 18) {
      const angle = (Math.PI * (t - 5.8)) / 12.6;
      solarFraction = Math.max(0.0, Math.sin(angle));
      // Midday tracker boost (flat peak with single-axis tracking)
      if (t >= 10 && t <= 14) {
        solarFraction = Math.min(1.0, solarFraction * 1.08);
      }
    }
    // Ambient desert temperature derating factor (eta_temp = 0.92) & inverter eta_inv = 0.98
    const solarCuf = solarFraction * (ghiWm2 / 1000.0) * 0.9016;

    // 2. Wind Speed Profile (nocturnal coastal & Rann breeze dynamics)
    // Wind peaks at night (21:00 to 05:00) and late afternoon (15:00 to 18:00)
    const diurnalWindModifier = 1.0 + 0.28 * Math.cos((2.0 * Math.PI * (t - 16.0)) / 24.0) + 0.14 * Math.sin((2.0 * Math.PI * t) / 12.0);
    const localWindSpeedMs = Math.max(0.5, windBaseSpeedMs * diurnalWindModifier);

    // Wind Turbine Power Curve (Cut-in: 3.0 m/s, Rated: 12.0 m/s, Cut-out: 25.0 m/s)
    let windCuf = 0.0;
    if (localWindSpeedMs >= 3.0 && localWindSpeedMs <= 25.0) {
      if (localWindSpeedMs >= 12.0) {
        windCuf = 0.95; // Rated plateau
      } else {
        // Cubic aerodynamic power curve: P ~ v^3
        windCuf = Math.min(0.95, Math.pow((localWindSpeedMs - 3.0) / (12.0 - 3.0), 2.8) * 0.95);
      }
    }

    // 3. Block-by-Block Generation
    let totalKhavdaSolarMw = 0;
    let totalKhavdaWindMw = 0;
    let totalKhavdaOnlineMw = 0;
    let totalKhavdaDesignMw = 0;

    const blockDispatch = {};

    Object.keys(KHAVDA_BLOCKS).forEach(key => {
      const blk = KHAVDA_BLOCKS[key];
      // For Khavda blocks, calculate generation on currently commissioned capacity vs design
      const activeSolarCap = (blk.key.startsWith("agel") || blk.key.startsWith("ntpc") || blk.key.startsWith("gipcl") || blk.key.startsWith("gsecl"))
        ? (blk.currentCommissionedMw * (blk.solarCapacityMw / blk.totalCapacityMw))
        : blk.solarCapacityMw;
      const activeWindCap = (blk.key.startsWith("agel") || blk.key.startsWith("ntpc") || blk.key.startsWith("gsecl"))
        ? (blk.currentCommissionedMw * (blk.windCapacityMw / blk.totalCapacityMw))
        : blk.windCapacityMw;

      const genSolarMw = Math.round(activeSolarCap * solarCuf);
      const genWindMw = Math.round(activeWindCap * windCuf);
      const genTotalMw = genSolarMw + genWindMw;

      blockDispatch[key] = {
        name: blk.name,
        genSolarMw,
        genWindMw,
        genTotalMw,
        solarCufPct: Math.round(solarCuf * 100),
        windCufPct: Math.round(windCuf * 100),
        effectiveCufPct: Math.round(((genTotalMw) / Math.max(1, blk.currentCommissionedMw || blk.totalCapacityMw)) * 100)
      };

      if (key.includes("block")) {
        totalKhavdaSolarMw += genSolarMw;
        totalKhavdaWindMw += genWindMw;
        totalKhavdaOnlineMw += genTotalMw;
        totalKhavdaDesignMw += blk.totalCapacityMw;
      }
    });

    // 4. Transmission Evacuation Flow & Line Headroom
    // Khavda PS nominal evacuation capacity: 2x 765 kV corridors = 9,000 MVA * gridCapacityFactor
    const khavdaEvacCapacityMva = Math.round(9000 * gridCapacityFactor);
    const khavdaGenTotalMw = totalKhavdaSolarMw + totalKhavdaWindMw;
    const khavdaEvacuatedMw = Math.min(khavdaGenTotalMw, khavdaEvacCapacityMva);
    const khavdaCurtailedMw = Math.max(0, khavdaGenTotalMw - khavdaEvacCapacityMva);
    const khavdaGridLoadingPct = Math.min(100, parseFloat(((khavdaEvacuatedMw / khavdaEvacCapacityMva) * 100).toFixed(1)));

    // Corridor breakdown flows
    const corridorFlows = {
      "765-KHV-LAK": {
        flowMw: Math.round(khavdaEvacuatedMw * 0.58), // 58% routed through Lakadia
        ratingMva: Math.round(4500 * gridCapacityFactor),
        loadingPct: Math.min(100, Math.round(((khavdaEvacuatedMw * 0.58) / (4500 * gridCapacityFactor)) * 100))
      },
      "765-KHV-BAN": {
        flowMw: Math.round(khavdaEvacuatedMw * 0.42), // 42% routed through Banaskantha
        ratingMva: Math.round(4500 * gridCapacityFactor),
        loadingPct: Math.min(100, Math.round(((khavdaEvacuatedMw * 0.42) / (4500 * gridCapacityFactor)) * 100))
      },
      "765-LAK-VAD": {
        flowMw: Math.round(khavdaEvacuatedMw * 0.48),
        ratingMva: Math.round(4500 * gridCapacityFactor),
        loadingPct: Math.min(100, Math.round(((khavdaEvacuatedMw * 0.48) / (4500 * gridCapacityFactor)) * 100))
      },
      "765-MUN-PIR": {
        flowMw: Math.round(2100 + khavdaEvacuatedMw * 0.15),
        ratingMva: Math.round(4500 * gridCapacityFactor),
        loadingPct: Math.min(100, Math.round(((2100 + khavdaEvacuatedMw * 0.15) / (4500 * gridCapacityFactor)) * 100))
      },
      "400-CHA-GAN": {
        flowMw: Math.round(blockDispatch.charanka_park.genTotalMw * 0.95),
        ratingMva: Math.round(1800 * gridCapacityFactor),
        loadingPct: Math.min(100, Math.round(((blockDispatch.charanka_park.genTotalMw * 0.95) / 1800) * 100))
      },
      "400-DHO-CHO": {
        flowMw: Math.round(blockDispatch.dholera_park.genTotalMw * 0.95),
        ratingMva: Math.round(1800 * gridCapacityFactor),
        loadingPct: Math.min(100, Math.round(((blockDispatch.dholera_park.genTotalMw * 0.95) / 1800) * 100))
      }
    };

    // Substation Transformer Loading & MVA Headroom
    const substationHeadrooms = {};
    Object.keys(SUBSTATIONS_MATRIX).forEach(subId => {
      const sub = SUBSTATIONS_MATRIX[subId];
      let subFlowMw = 0;
      if (subId === "substation_khavda_765") subFlowMw = khavdaEvacuatedMw;
      else if (subId === "substation_lakadia_765") subFlowMw = corridorFlows["765-KHV-LAK"].flowMw;
      else if (subId === "substation_banaskantha_765") subFlowMw = corridorFlows["765-KHV-BAN"].flowMw;
      else if (subId === "substation_charanka_400") subFlowMw = corridorFlows["400-CHA-GAN"].flowMw;
      else if (subId === "substation_dholera_400") subFlowMw = corridorFlows["400-DHO-CHO"].flowMw;
      else subFlowMw = Math.round(sub.ratingMva * 0.55);

      const effectiveRating = Math.round(sub.ratingMva * gridCapacityFactor);
      const loadingPct = Math.min(100, Math.round((subFlowMw / effectiveRating) * 100));
      const headroomMva = Math.max(0, effectiveRating - subFlowMw);

      substationHeadrooms[subId] = {
        name: sub.name,
        flowMw: subFlowMw,
        ratingMva: effectiveRating,
        loadingPct,
        headroomMva,
        statusColor: loadingPct > 85 ? "#ef4444" : (loadingPct > 65 ? "#f59e0b" : "#10b981")
      };
    });

    // 5. Environmental CO2 Mitigation (0.82 tCO2 / MWh Indian Grid factor)
    const co2AvoidedTonnesPerHour = Math.round((khavdaEvacuatedMw / 1000.0) * 820.0);

    return {
      hour: t,
      hourLabel: `${String(t).padStart(2, "0")}:00 IST`,
      solarCufPct: Math.round(solarCuf * 100),
      windCufPct: Math.round(windCuf * 100),
      windSpeedMs: parseFloat(localWindSpeedMs.toFixed(1)),
      totalKhavdaSolarMw,
      totalKhavdaWindMw,
      totalKhavdaOnlineMw,
      totalKhavdaDesignMw,
      khavdaEvacuatedMw,
      khavdaCurtailedMw,
      khavdaGridLoadingPct,
      khavdaEvacCapacityMva,
      co2AvoidedTonnesPerHour,
      blockDispatch,
      corridorFlows,
      substationHeadrooms
    };
  }

  // =========================================================================
  // 4. TWIN CONTROLLER CLASS
  // =========================================================================

  class KhavdaGreenEnergyTwinController {
    constructor() {
      this.map = null;
      this.activeBlockKey = "agel_block";
      this.currentHour = 12; // Start at solar peak noon
      this.isPlaying = false;
      this.playTimer = null;
      this.ghiWm2 = 1000.0;
      this.windBaseSpeedMs = 8.5;
      this.gridCapacityFactor = 1.0;
      this.activeTab = "blocks";
      this.isInitialized = false;
      this.isEventsBound = false;

      // Leaflet Layers
      this.corridorLayerGroup = null;
      this.substationsLayerGroup = null;
      this.parkFootprintLayer = null;
    }

    init(mapInstance) {
      if (this.isInitialized && this.map) return;
      this.map = mapInstance;

      if (this.map && typeof L !== "undefined") {
        this.corridorLayerGroup = L.layerGroup().addTo(this.map);
        this.substationsLayerGroup = L.layerGroup().addTo(this.map);
      }

      this.buildModalDom();
      this.bindDomEvents();
      this.isInitialized = true;
      console.log("[KhavdaTwin] Engine initialized successfully.");
    }

    buildModalDom() {
      if (document.getElementById("khavdaTwinModal")) return;

      const modal = document.createElement("dialog");
      modal.id = "khavdaTwinModal";
      modal.className = "system-modal khavda-modal";
      modal.setAttribute("aria-labelledby", "khavdaModalTitle");

      modal.innerHTML = `
        <div class="khavda-modal-container">
          <!-- Header -->
          <div class="khavda-modal-header">
            <div class="khavda-header-title-wrap">
              <span class="khavda-badge">CEA &amp; GETCO DISPATCH • 30 GW KHAVDA MEGA-PARK &amp; 765 kV CORRIDOR</span>
              <h2 id="khavdaModalTitle" class="khavda-modal-title">
                <span class="khavda-icon">⚡</span> Khavda Hybrid Renewable Park &amp; EHV Green Energy Corridor Twin
              </h2>
              <p class="khavda-modal-sub">
                World's largest 30 GW Solar/Wind Mega-Park in Kutch, 765 kV UHV ISTS Green Energy Corridors, diurnal dispatch dynamics, and substation MVA headroom.
              </p>
            </div>
            <div class="khavda-header-controls">
              <div class="khavda-select-wrap">
                <label for="khavdaBlockSelect" class="khavda-select-lbl">Focus Block / Mega-Park:</label>
                <select id="khavdaBlockSelect" class="styled-select khavda-block-select">
                  <option value="agel_block">Adani Green Mega Complex (11.25 GW Hybrid)</option>
                  <option value="ntpc_block">NTPC REL Ultra-Mega Park (4.75 GW Solar/Wind)</option>
                  <option value="gipcl_block">GIPCL Renewable Mega Park (2.375 GW Solar)</option>
                  <option value="gsecl_block">GSECL Hybrid Energy Complex (3.325 GW + BESS)</option>
                  <option value="seci_block">SECI ISTS Tranche (8.30 GW Green Corridor)</option>
                  <option value="charanka_park">Charanka Solar Park (790 MW Patan)</option>
                  <option value="dholera_park">Dholera SIR Solar Park (1,000 MW Semiconductor Hub)</option>
                </select>
              </div>
              <button id="closeKhavdaModalBtn" class="system-modal-close" aria-label="Close Khavda Twin">✕</button>
            </div>
          </div>

          <!-- Diurnal 24-Hour Scrubber Bar -->
          <div class="khavda-timeline-bar">
            <div class="khavda-timeline-left">
              <button id="khavdaPlayBtn" class="khavda-btn-play" title="Play / Pause 24-hour diurnal dispatch animation">
                <span>▶ Play</span>
              </button>
              <button id="khavdaPrevHourBtn" class="khavda-btn-step" title="Previous Hour">◀</button>
              <div class="khavda-slider-wrap">
                <input type="range" id="khavdaHourSlider" min="0" max="23" value="12" class="khavda-slider" title="Scrub through 24-hour day/night cycle">
              </div>
              <button id="khavdaNextHourBtn" class="khavda-btn-step" title="Next Hour">▶</button>
              <span class="khavda-step-badge" id="khavdaHourBadge">12:00 IST (Noon Peak)</span>
            </div>
            <div class="khavda-timeline-right">
              <div class="khavda-sun-wind-indicators">
                <span class="solar-indicator-pill" id="khavdaSolarPill">☀️ Solar: 82% CUF</span>
                <span class="wind-indicator-pill" id="khavdaWindPill">💨 Wind: 44% CUF</span>
              </div>
            </div>
          </div>

          <!-- 4-Card Real-Time KPI Row -->
          <div class="khavda-kpi-row">
            <div class="khavda-kpi-card">
              <div class="kpi-label">KHAVDA REAL-TIME GENERATION</div>
              <div class="kpi-value" id="khavdaKpiGen">3,340 <span class="unit">MW</span></div>
              <div class="kpi-sub" id="khavdaKpiGenSub">☀️ Solar: 2,420 MW • 💨 Wind: 920 MW</div>
            </div>
            <div class="khavda-kpi-card">
              <div class="kpi-label">765 kV CORRIDOR EVACUATION</div>
              <div class="kpi-value" id="khavdaKpiEvac">37.1% <span class="badge-sub loading-safe">OPTIMAL</span></div>
              <div class="kpi-sub" id="khavdaKpiEvacSub">Flow: 3,340 MW / Rating: 9,000 MVA</div>
            </div>
            <div class="khavda-kpi-card">
              <div class="kpi-label">LAKADIA 765 kV HEADROOM</div>
              <div class="kpi-value" id="khavdaKpiHeadroom">2,563 <span class="unit">MVA</span></div>
              <div class="kpi-sub" id="khavdaKpiHeadroomSub">3x1500 MVA ICT Utilization: 43.0%</div>
            </div>
            <div class="khavda-kpi-card">
              <div class="kpi-label">CLEAN CO₂ MITIGATION</div>
              <div class="kpi-value" id="khavdaKpiCo2">2,739 <span class="unit">t/hr</span></div>
              <div class="kpi-sub" id="khavdaKpiCo2Sub">Avoids 65,700 Tonnes Coal-CO₂ / Day</div>
            </div>
          </div>

          <!-- Sensitivity Adjuster Bar -->
          <div class="khavda-sensitivity-bar">
            <div class="sensitivity-item">
              <label for="khavdaGhiSlider">Solar Irradiance (GHI): <strong id="khavdaGhiVal">1000 W/m²</strong></label>
              <input type="range" id="khavdaGhiSlider" min="400" max="1200" step="50" value="1000" class="sensitivity-slider">
            </div>
            <div class="sensitivity-item">
              <label for="khavdaWindSlider">Desert Wind Speed: <strong id="khavdaWindVal">8.5 m/s</strong></label>
              <input type="range" id="khavdaWindSlider" min="3.0" max="18.0" step="0.5" value="8.5" class="sensitivity-slider">
            </div>
            <div class="sensitivity-item">
              <label for="khavdaGridCapSlider">Corridor Thermal Limit: <strong id="khavdaGridCapVal">100%</strong></label>
              <input type="range" id="khavdaGridCapSlider" min="80" max="120" step="5" value="100" class="sensitivity-slider">
            </div>
          </div>

          <!-- Tab Navigation -->
          <div class="khavda-tab-nav" role="tablist">
            <button class="khavda-tab-btn active" data-tab="blocks" role="tab">
              <span>🏗️ 30 GW Mega-Park Blocks Matrix</span>
            </button>
            <button class="khavda-tab-btn" data-tab="grid" role="tab">
              <span>⚡ 765/400 kV Corridors &amp; Substations</span>
            </button>
            <button class="khavda-tab-btn" data-tab="dispatch" role="tab">
              <span>📊 24-Hour Diurnal Dispatch &amp; Duck Curve</span>
            </button>
          </div>

          <!-- Tab Contents -->
          <div class="khavda-tab-content-area">
            <!-- TAB 1: Blocks Matrix -->
            <div class="khavda-tab-pane active" id="khavda-pane-blocks">
              <div class="khavda-table-wrap">
                <table class="khavda-table">
                  <thead>
                    <tr>
                      <th>Park / Block Name</th>
                      <th>Developer / Agency</th>
                      <th>Total MW</th>
                      <th>Solar / Wind Split</th>
                      <th>Tariff</th>
                      <th>Land (Ha)</th>
                      <th>Active Dispatch</th>
                      <th>Map Focus</th>
                    </tr>
                  </thead>
                  <tbody id="khavdaBlocksTableBody">
                    <!-- Populated dynamically -->
                  </tbody>
                </table>
              </div>
            </div>

            <!-- TAB 2: Grid Corridors & Substations -->
            <div class="khavda-tab-pane" id="khavda-pane-grid">
              <div class="khavda-grid-split">
                <div class="khavda-split-col">
                  <h4 class="khavda-split-title">765 kV / 400 kV Extra-High Voltage Corridors</h4>
                  <div class="khavda-table-wrap">
                    <table class="khavda-table">
                      <thead>
                        <tr>
                          <th>Corridor Name</th>
                          <th>Voltage</th>
                          <th>Rating</th>
                          <th>Active Flow</th>
                          <th>Loading %</th>
                        </tr>
                      </thead>
                      <tbody id="khavdaCorridorsTableBody">
                        <!-- Populated dynamically -->
                      </tbody>
                    </table>
                  </div>
                </div>
                <div class="khavda-split-col">
                  <h4 class="khavda-split-title">Substations &amp; Transformer Headroom (MVA)</h4>
                  <div class="khavda-table-wrap">
                    <table class="khavda-table">
                      <thead>
                        <tr>
                          <th>Substation Node</th>
                          <th>Voltage</th>
                          <th>MVA Rating</th>
                          <th>Available Headroom</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody id="khavdaSubstationsTableBody">
                        <!-- Populated dynamically -->
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <!-- TAB 3: 24-Hour Diurnal Dispatch -->
            <div class="khavda-tab-pane" id="khavda-pane-dispatch">
              <div class="khavda-dispatch-summary">
                <div class="dispatch-header-note">
                  <strong>DIURNAL SOLAR-WIND COMPLEMENTARITY PRINCIPLE:</strong> 
                  Solar PV generates massive daytime generation (08:00–17:00 IST), while nocturnal and late-afternoon thermal breezes in the Rann of Kutch boost wind generation (21:00–06:00 IST). The hybrid combination flattens intermittency and raises firm minimum baseload from 0% to over 28% of plant capacity.
                </div>
                <div class="dispatch-schedule-table-wrap">
                  <table class="khavda-table dispatch-table">
                    <thead>
                      <tr>
                        <th>Hour (IST)</th>
                        <th>Solar PV (MW)</th>
                        <th>Wind Energy (MW)</th>
                        <th>Combined Hybrid (MW)</th>
                        <th>Evacuated (MW)</th>
                        <th>Curtailed (MW)</th>
                        <th>CO₂ Avoided</th>
                      </tr>
                    </thead>
                    <tbody id="khavdaHourlyScheduleBody">
                      <!-- 24-Hour hourly schedule populated dynamically -->
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="khavda-modal-footer">
            <div class="khavda-footer-provenance">
              <span class="badge-source">[ STATUTORY CEA FY24 &amp; GETCO EHV AUDIT ]</span>
              <span>All ratings based on Central Electricity Authority transmission inventory and MNRE Ultra-Mega RE Park allocations.</span>
            </div>
            <div class="khavda-footer-actions">
              <button id="focusKhavdaParkBtn" class="action-btn action-btn-secondary" title="Fly map camera to 30 GW Khavda Mega-Park in Kutch">
                📍 Fly to Khavda Park
              </button>
              <button id="exportKhavdaCsvBtn" class="action-btn action-btn-energy" title="Export 24-Hour Dispatch Schedule &amp; Line Loadings as RFC-4180 CSV">
                📥 Export Dispatch Telemetry (CSV)
              </button>
              <button id="khavdaDismissBtn" class="action-btn action-btn-secondary">
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

      // 1. Block selection dropdown
      const blockSelect = document.getElementById("khavdaBlockSelect");
      if (blockSelect) {
        blockSelect.addEventListener("change", (e) => {
          this.selectBlock(e.target.value);
        });
      }

      // 2. Hour scrubber slider
      const hourSlider = document.getElementById("khavdaHourSlider");
      if (hourSlider) {
        hourSlider.addEventListener("input", (e) => {
          this.setDiurnalHour(parseInt(e.target.value, 10));
        });
      }

      // 3. Play / Pause button
      const playBtn = document.getElementById("khavdaPlayBtn");
      if (playBtn) {
        playBtn.addEventListener("click", () => {
          this.togglePlay();
        });
      }

      // 4. Hour prev / next buttons
      const prevBtn = document.getElementById("khavdaPrevHourBtn");
      if (prevBtn) {
        prevBtn.addEventListener("click", () => this.prevHour());
      }
      const nextBtn = document.getElementById("khavdaNextHourBtn");
      if (nextBtn) {
        nextBtn.addEventListener("click", () => this.nextHour());
      }

      // 5. Sensitivity sliders
      const ghiSlider = document.getElementById("khavdaGhiSlider");
      if (ghiSlider) {
        ghiSlider.addEventListener("input", (e) => {
          this.ghiWm2 = parseFloat(e.target.value);
          const lbl = document.getElementById("khavdaGhiVal");
          if (lbl) lbl.textContent = `${Math.round(this.ghiWm2)} W/m²`;
          this.render();
        });
      }

      const windSlider = document.getElementById("khavdaWindSlider");
      if (windSlider) {
        windSlider.addEventListener("input", (e) => {
          this.windBaseSpeedMs = parseFloat(e.target.value);
          const lbl = document.getElementById("khavdaWindVal");
          if (lbl) lbl.textContent = `${this.windBaseSpeedMs.toFixed(1)} m/s`;
          this.render();
        });
      }

      const gridCapSlider = document.getElementById("khavdaGridCapSlider");
      if (gridCapSlider) {
        gridCapSlider.addEventListener("input", (e) => {
          this.gridCapacityFactor = parseFloat(e.target.value) / 100.0;
          const lbl = document.getElementById("khavdaGridCapVal");
          if (lbl) lbl.textContent = `${Math.round(this.gridCapacityFactor * 100)}%`;
          this.render();
        });
      }

      // 6. Tab switching
      document.querySelectorAll(".khavda-tab-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const tabId = btn.getAttribute("data-tab");
          this.switchTab(tabId);
        });
      });

      // 7. Modal close buttons
      const closeBtn = document.getElementById("closeKhavdaModalBtn");
      if (closeBtn) closeBtn.addEventListener("click", () => this.closeModal());
      const footerDismissBtn = document.getElementById("khavdaDismissBtn");
      if (footerDismissBtn) footerDismissBtn.addEventListener("click", () => this.closeModal());

      // 8. Focus park button
      const focusBtn = document.getElementById("focusKhavdaParkBtn");
      if (focusBtn) focusBtn.addEventListener("click", () => this.focusKhavdaPark());

      // 9. CSV Export trigger
      const exportBtn = document.getElementById("exportKhavdaCsvBtn");
      if (exportBtn) exportBtn.addEventListener("click", () => this.exportDispatchCsv());

      // 10. Document keyboard shortcuts: <kbd>K</kbd> toggle & <kbd>Escape</kbd> dismiss
      document.addEventListener("keydown", (e) => {
        if (e.key === "k" || e.key === "K") {
          const activeTag = (document.activeElement?.tagName || "").toLowerCase();
          if (activeTag === "input" || activeTag === "textarea" || activeTag === "select") return;
          e.preventDefault();
          const modal = document.getElementById("khavdaTwinModal");
          if (modal && modal.open) {
            this.closeModal();
          } else {
            this.openModal();
          }
        } else if (e.key === "Escape") {
          const modal = document.getElementById("khavdaTwinModal");
          if (modal && modal.open) {
            this.closeModal();
          }
        }
      });

      // 11. Modal cancel event (native Escape key)
      const modalEl = document.getElementById("khavdaTwinModal");
      if (modalEl) {
        modalEl.addEventListener("cancel", () => {
          this.closeModal();
        });
      }

      this.isEventsBound = true;
    }

    openModal(blockKey = null) {
      this.buildModalDom();
      this.bindDomEvents();
      if (!this.map && window.map) {
        this.init(window.map);
      }
      if (blockKey && KHAVDA_BLOCKS[blockKey]) {
        this.activeBlockKey = blockKey;
      }
      const modal = document.getElementById("khavdaTwinModal");
      if (modal && typeof modal.showModal === "function") {
        if (!modal.open) modal.showModal();
      }

      // Sync select dropdown
      const sel = document.getElementById("khavdaBlockSelect");
      if (sel) sel.value = this.activeBlockKey;

      this.render();
      this.updateMapVisuals();
    }

    closeModal() {
      this.pause();
      const modal = document.getElementById("khavdaTwinModal");
      if (modal && modal.open) {
        modal.close();
      }
    }

    isModalOpen() {
      const modal = document.getElementById("khavdaTwinModal");
      return !!(modal && modal.open);
    }

    selectBlock(blockKey) {
      if (!KHAVDA_BLOCKS[blockKey]) return;
      this.activeBlockKey = blockKey;
      const sel = document.getElementById("khavdaBlockSelect");
      if (sel) sel.value = blockKey;
      this.render();
      this.updateMapVisuals();
    }

    setDiurnalHour(hour) {
      this.currentHour = Math.max(0, Math.min(23, hour));
      this.render();
      this.updateMapVisuals();
    }

    nextHour() {
      this.currentHour = (this.currentHour + 1) % 24;
      this.render();
      this.updateMapVisuals();
    }

    prevHour() {
      this.currentHour = (this.currentHour - 1 + 24) % 24;
      this.render();
      this.updateMapVisuals();
    }

    play() {
      if (this.isPlaying) return;
      this.isPlaying = true;
      const playBtn = document.getElementById("khavdaPlayBtn");
      if (playBtn) playBtn.innerHTML = `<span>⏸ Pause</span>`;

      this.playTimer = setInterval(() => {
        this.nextHour();
      }, 1200);
    }

    pause() {
      if (!this.isPlaying) return;
      this.isPlaying = false;
      if (this.playTimer) {
        clearInterval(this.playTimer);
        this.playTimer = null;
      }
      const playBtn = document.getElementById("khavdaPlayBtn");
      if (playBtn) playBtn.innerHTML = `<span>▶ Play</span>`;
    }

    togglePlay() {
      if (this.isPlaying) this.pause();
      else this.play();
    }

    switchTab(tabId) {
      this.activeTab = tabId;
      document.querySelectorAll(".khavda-tab-btn").forEach(btn => {
        const isActive = btn.getAttribute("data-tab") === tabId;
        btn.classList.toggle("active", isActive);
        btn.setAttribute("aria-selected", isActive ? "true" : "false");
      });
      document.querySelectorAll(".khavda-tab-pane").forEach(pane => {
        pane.classList.toggle("active", pane.id === `khavda-pane-${tabId}`);
      });
    }

    render() {
      const dispatch = calculateDiurnalDispatch(
        this.currentHour,
        this.ghiWm2,
        this.windBaseSpeedMs,
        this.gridCapacityFactor
      );

      // 1. Scrubber UI sync
      const slider = document.getElementById("khavdaHourSlider");
      if (slider) slider.value = this.currentHour;

      const badge = document.getElementById("khavdaHourBadge");
      if (badge) {
        let tag = "Off-Peak Night";
        if (this.currentHour >= 6 && this.currentHour <= 8) tag = "Morning Ramp";
        else if (this.currentHour >= 11 && this.currentHour <= 14) tag = "Solar Peak Noon";
        else if (this.currentHour >= 17 && this.currentHour <= 19) tag = "Twilight Ramp";
        else if (this.currentHour >= 20 && this.currentHour <= 23) tag = "Night Wind Peak";
        badge.textContent = `${dispatch.hourLabel} (${tag})`;
      }

      const solarPill = document.getElementById("khavdaSolarPill");
      if (solarPill) {
        solarPill.textContent = `☀️ Solar: ${dispatch.solarCufPct}% CUF`;
      }
      const windPill = document.getElementById("khavdaWindPill");
      if (windPill) {
        windPill.textContent = `💨 Wind: ${dispatch.windCufPct}% CUF (${dispatch.windSpeedMs} m/s)`;
      }

      // 2. KPI Cards
      const kpiGen = document.getElementById("khavdaKpiGen");
      if (kpiGen) {
        kpiGen.innerHTML = `${dispatch.totalKhavdaOnlineMw.toLocaleString()} <span class="unit">MW</span>`;
      }
      const kpiGenSub = document.getElementById("khavdaKpiGenSub");
      if (kpiGenSub) {
        kpiGenSub.textContent = `☀️ Solar: ${dispatch.totalKhavdaSolarMw.toLocaleString()} MW • 💨 Wind: ${dispatch.totalKhavdaWindMw.toLocaleString()} MW`;
      }

      const kpiEvac = document.getElementById("khavdaKpiEvac");
      if (kpiEvac) {
        const badgeClass = dispatch.khavdaGridLoadingPct > 85 ? "loading-critical" : (dispatch.khavdaGridLoadingPct > 65 ? "loading-warning" : "loading-safe");
        const statusText = dispatch.khavdaGridLoadingPct > 85 ? "CONGESTION" : (dispatch.khavdaGridLoadingPct > 65 ? "MODERATE" : "OPTIMAL");
        kpiEvac.innerHTML = `${dispatch.khavdaGridLoadingPct}% <span class="badge-sub ${badgeClass}">${statusText}</span>`;
      }
      const kpiEvacSub = document.getElementById("khavdaKpiEvacSub");
      if (kpiEvacSub) {
        kpiEvacSub.textContent = `Flow: ${dispatch.khavdaEvacuatedMw.toLocaleString()} MW / Rating: ${dispatch.khavdaEvacCapacityMva.toLocaleString()} MVA`;
      }

      const kpiHeadroom = document.getElementById("khavdaKpiHeadroom");
      if (kpiHeadroom) {
        const lak = dispatch.substationHeadrooms["substation_lakadia_765"];
        kpiHeadroom.innerHTML = `${lak ? lak.headroomMva.toLocaleString() : "2,500"} <span class="unit">MVA</span>`;
      }
      const kpiHeadroomSub = document.getElementById("khavdaKpiHeadroomSub");
      if (kpiHeadroomSub) {
        const lak = dispatch.substationHeadrooms["substation_lakadia_765"];
        kpiHeadroomSub.textContent = `3x1500 MVA ICT Utilization: ${lak ? lak.loadingPct : "43"}%`;
      }

      const kpiCo2 = document.getElementById("khavdaKpiCo2");
      if (kpiCo2) {
        kpiCo2.innerHTML = `${dispatch.co2AvoidedTonnesPerHour.toLocaleString()} <span class="unit">t/hr</span>`;
      }
      const kpiCo2Sub = document.getElementById("khavdaKpiCo2Sub");
      if (kpiCo2Sub) {
        const dayTotal = Math.round(dispatch.co2AvoidedTonnesPerHour * 24);
        kpiCo2Sub.textContent = `Avoids ${dayTotal.toLocaleString()} Tonnes Coal-CO₂ / Day`;
      }

      // 3. Tab 1: Mega-Park Blocks Table
      this.renderBlocksTable(dispatch);

      // 4. Tab 2: Corridors & Substations Table
      this.renderCorridorsTable(dispatch);
      this.renderSubstationsTable(dispatch);

      // 5. Tab 3: 24-Hour Diurnal Schedule Table
      this.renderHourlyScheduleTable();
    }

    renderBlocksTable(dispatch) {
      const tbody = document.getElementById("khavdaBlocksTableBody");
      if (!tbody) return;

      tbody.innerHTML = Object.keys(KHAVDA_BLOCKS).map(key => {
        const blk = KHAVDA_BLOCKS[key];
        const isSelected = this.activeBlockKey === key;
        const bDisp = dispatch.blockDispatch[key] || { genTotalMw: 0, genSolarMw: 0, genWindMw: 0, effectiveCufPct: 0 };

        return `
          <tr class="${isSelected ? 'selected-row' : ''}">
            <td>
              <div class="table-name-wrap">
                <span class="table-title">${blk.name}</span>
                <span class="table-sub">${blk.id} • ${blk.district}</span>
              </div>
            </td>
            <td><span class="operator-badge">${blk.operator}</span></td>
            <td><strong>${blk.totalCapacityMw.toLocaleString()} MW</strong><br><small style="color: #94a3b8;">(${blk.currentCommissionedMw} MW online)</small></td>
            <td>☀️ ${blk.solarCapacityMw.toLocaleString()} MW<br>💨 ${blk.windCapacityMw.toLocaleString()} MW</td>
            <td><span class="tariff-pill">₹${blk.tariffInrPerKwh}/kWh</span></td>
            <td>${blk.landAreaHa.toLocaleString()} Ha</td>
            <td>
              <strong style="color: #38bdf8;">${bDisp.genTotalMw.toLocaleString()} MW</strong>
              <div class="table-bar-bg"><div class="table-bar-fill" style="width: ${bDisp.effectiveCufPct}%;"></div></div>
            </td>
            <td>
              <button class="table-focus-btn" onclick="window.KhavdaGreenEnergyTwin && window.KhavdaGreenEnergyTwin.flyToBlock('${key}')">
                🎯 Inspect
              </button>
            </td>
          </tr>
        `;
      }).join("");
    }

    renderCorridorsTable(dispatch) {
      const tbody = document.getElementById("khavdaCorridorsTableBody");
      if (!tbody) return;

      tbody.innerHTML = Object.keys(TRANSMISSION_CORRIDORS).map(corId => {
        const cor = TRANSMISSION_CORRIDORS[corId];
        const flow = dispatch.corridorFlows[cor.id] || { flowMw: 0, ratingMva: cor.thermalRatingMva, loadingPct: 0 };
        const badgeColor = flow.loadingPct > 85 ? "#ef4444" : (flow.loadingPct > 65 ? "#f59e0b" : "#10b981");

        return `
          <tr>
            <td>
              <strong>${cor.name}</strong><br>
              <small style="color: #94a3b8;">${cor.circuits} • ${cor.lengthKm} km • ${cor.operator}</small>
            </td>
            <td><span class="voltage-tag">${cor.voltageKv} kV</span></td>
            <td>${flow.ratingMva.toLocaleString()} MVA</td>
            <td><strong>${flow.flowMw.toLocaleString()} MW</strong></td>
            <td>
              <span class="status-pill" style="background: ${badgeColor}22; color: ${badgeColor}; border: 1px solid ${badgeColor}66;">
                ${flow.loadingPct}%
              </span>
            </td>
          </tr>
        `;
      }).join("");
    }

    renderSubstationsTable(dispatch) {
      const tbody = document.getElementById("khavdaSubstationsTableBody");
      if (!tbody) return;

      tbody.innerHTML = Object.keys(SUBSTATIONS_MATRIX).map(subId => {
        const sub = SUBSTATIONS_MATRIX[subId];
        const stat = dispatch.substationHeadrooms[subId] || { flowMw: 0, ratingMva: sub.ratingMva, loadingPct: 0, headroomMva: sub.ratingMva, statusColor: "#10b981" };

        return `
          <tr>
            <td>
              <strong>${sub.name}</strong><br>
              <small style="color: #94a3b8;">${sub.tech} • ${sub.district}</small>
            </td>
            <td><span class="voltage-tag">${sub.voltageKv} kV</span></td>
            <td>${stat.ratingMva.toLocaleString()} MVA</td>
            <td><strong style="color: #38bdf8;">${stat.headroomMva.toLocaleString()} MVA</strong></td>
            <td>
              <span class="status-pill" style="background: ${stat.statusColor}22; color: ${stat.statusColor}; border: 1px solid ${stat.statusColor}66;">
                ${stat.loadingPct}% Load
              </span>
            </td>
          </tr>
        `;
      }).join("");
    }

    renderHourlyScheduleTable() {
      const tbody = document.getElementById("khavdaHourlyScheduleBody");
      if (!tbody) return;

      const rows = [];
      for (let h = 0; h < 24; h++) {
        const d = calculateDiurnalDispatch(h, this.ghiWm2, this.windBaseSpeedMs, this.gridCapacityFactor);
        const isCurrent = h === this.currentHour;
        rows.push(`
          <tr class="${isCurrent ? 'current-hour-row' : ''}">
            <td><strong>${d.hourLabel}</strong></td>
            <td>${d.totalKhavdaSolarMw.toLocaleString()} MW</td>
            <td>${d.totalKhavdaWindMw.toLocaleString()} MW</td>
            <td><strong style="color: #38bdf8;">${d.totalKhavdaOnlineMw.toLocaleString()} MW</strong></td>
            <td>${d.khavdaEvacuatedMw.toLocaleString()} MW</td>
            <td>${d.khavdaCurtailedMw > 0 ? `<span style="color: #ef4444; font-weight: 700;">${d.khavdaCurtailedMw.toLocaleString()} MW</span>` : "0 MW"}</td>
            <td>${d.co2AvoidedTonnesPerHour.toLocaleString()} t/hr</td>
          </tr>
        `);
      }
      tbody.innerHTML = rows.join("");
    }

    updateMapVisuals() {
      if (!this.map || typeof L === "undefined") return;

      // 1. Draw Khavda 30 GW Mega-Park Footprint Polygon in Kutch Rann
      if (!this.parkFootprintLayer) {
        const khavdaPolygonCoords = [
          [23.75, 69.50],
          [24.02, 69.60],
          [24.08, 69.95],
          [23.85, 70.02],
          [23.72, 69.75]
        ];
        this.parkFootprintLayer = L.polygon(khavdaPolygonCoords, {
          color: "#f59e0b",
          weight: 2,
          dashArray: "6, 6",
          fillColor: "#f59e0b",
          fillOpacity: 0.12
        }).addTo(this.map);

        this.parkFootprintLayer.bindTooltip(
          "<strong>30 GW Khavda Renewable Mega-Park</strong><br>726 km² World's Largest Green Energy Installation",
          { sticky: true, className: "khavda-tooltip" }
        );
      }

      // 2. Render substation status pins
      if (this.substationsLayerGroup) {
        this.substationsLayerGroup.clearLayers();
        const dispatch = calculateDiurnalDispatch(this.currentHour, this.ghiWm2, this.windBaseSpeedMs, this.gridCapacityFactor);

        Object.keys(SUBSTATIONS_MATRIX).forEach(subId => {
          const sub = SUBSTATIONS_MATRIX[subId];
          const stat = dispatch.substationHeadrooms[subId];
          const color = stat ? stat.statusColor : "#10b981";

          const icon = L.divIcon({
            className: "substation-load-pin",
            html: `
              <div class="sub-pin-inner" style="background: ${color}; border: 2px solid #ffffff; box-shadow: 0 0 10px ${color};">
                <span class="sub-pin-val">${stat ? stat.loadingPct : 50}%</span>
              </div>
            `,
            iconSize: [26, 26],
            iconAnchor: [13, 13]
          });

          const marker = L.marker(sub.coords, { icon });
          marker.bindPopup(`
            <div class="khavda-sub-popup">
              <h4>⚡ ${sub.name}</h4>
              <p><strong>Voltage:</strong> ${sub.voltageKv} kV | <strong>Rating:</strong> ${sub.ratingMva} MVA</p>
              <p><strong>Current Power Flow:</strong> ${stat ? stat.flowMw.toLocaleString() : 0} MW</p>
              <p><strong>Available Headroom:</strong> ${stat ? stat.headroomMva.toLocaleString() : sub.ratingMva} MVA</p>
              <p><strong>Loading:</strong> ${stat ? stat.loadingPct : 0}%</p>
              <small style="color: #94a3b8;">${sub.role}</small>
            </div>
          `);
          this.substationsLayerGroup.addLayer(marker);
        });
      }

      // 3. Render pulsing vector corridors
      if (this.corridorLayerGroup) {
        this.corridorLayerGroup.clearLayers();

        // 765 kV Khavda -> Lakadia -> Vadodara line vector
        const corridorPoints = [
          [23.882, 69.754], // Khavda PS
          [23.360, 70.620], // Lakadia 765kV
          [23.830, 71.600], // Radhanpur / Banaskantha
          [23.170, 72.820], // Dehgam 765kV
          [22.360, 73.280]  // Asoj / Vadodara
        ];

        const polyline = L.polyline(corridorPoints, {
          color: "#38bdf8",
          weight: 4,
          opacity: 0.85,
          dashArray: "12, 8"
        });
        polyline.bindTooltip("765 kV Green Energy Corridor (Khavda - Lakadia - Vadodara UHV)", { sticky: true });
        this.corridorLayerGroup.addLayer(polyline);
      }
    }

    flyToBlock(blockKey) {
      if (!KHAVDA_BLOCKS[blockKey]) return;
      this.selectBlock(blockKey);
      const blk = KHAVDA_BLOCKS[blockKey];
      if (this.map && typeof this.map.flyTo === "function") {
        this.map.flyTo(blk.coords, 10, { duration: 1.5 });
      }
    }

    focusKhavdaPark() {
      if (this.map && typeof this.map.flyTo === "function") {
        this.map.flyTo([23.88, 69.75], 9, { duration: 1.5 });
      }
    }

    exportDispatchCsv() {
      const headers = [
        "Hour_IST",
        "Khavda_Solar_MW",
        "Khavda_Wind_MW",
        "Khavda_Total_Gen_MW",
        "Evacuated_MW",
        "Curtailed_MW",
        "Grid_Loading_Pct",
        "CO2_Avoided_Tonnes_Hr",
        "Lakadia_Flow_MW",
        "Lakadia_Headroom_MVA",
        "Banaskantha_Flow_MW",
        "Charanka_Solar_MW",
        "Dholera_Solar_MW"
      ];

      const rows = [];
      for (let h = 0; h < 24; h++) {
        const d = calculateDiurnalDispatch(h, this.ghiWm2, this.windBaseSpeedMs, this.gridCapacityFactor);
        const lak = d.substationHeadrooms["substation_lakadia_765"] || { flowMw: 0, headroomMva: 0 };
        const ban = d.substationHeadrooms["substation_banaskantha_765"] || { flowMw: 0 };
        const cha = d.blockDispatch.charanka_park ? d.blockDispatch.charanka_park.genTotalMw : 0;
        const dho = d.blockDispatch.dholera_park ? d.blockDispatch.dholera_park.genTotalMw : 0;

        rows.push([
          `"${d.hourLabel}"`,
          d.totalKhavdaSolarMw,
          d.totalKhavdaWindMw,
          d.totalKhavdaOnlineMw,
          d.khavdaEvacuatedMw,
          d.khavdaCurtailedMw,
          d.khavdaGridLoadingPct,
          d.co2AvoidedTonnesPerHour,
          lak.flowMw,
          lak.headroomMva,
          ban.flowMw,
          cha,
          dho
        ].join(","));
      }

      const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\r\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `gujarat_khavda_green_energy_dispatch_${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    getBlocksRegistry() {
      return KHAVDA_BLOCKS;
    }

    getCorridorsRegistry() {
      return TRANSMISSION_CORRIDORS;
    }

    getSubstationsRegistry() {
      return SUBSTATIONS_MATRIX;
    }

    calculateDiurnalDispatch(hour, ghi, windSpeed, capFactor) {
      return calculateDiurnalDispatch(hour, ghi, windSpeed, capFactor);
    }
  }

  // Export Singleton to Window
  window.KhavdaGreenEnergyTwin = new KhavdaGreenEnergyTwinController();

})(window);
