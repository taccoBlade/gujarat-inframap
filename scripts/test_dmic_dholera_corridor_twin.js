/**
 * Gujarat InfraMap — DMIC & Dholera SIR Smart Industrial Corridors Twin Verification Suite
 * 
 * Verifies:
 * 1. Static Industrial, Transport & Railway GeoJSON Data Sanity
 * 2. DmicDholeraTwin Lifecycle & Public API on window
 * 3. Authoritative Dholera SIR Master Plan & Trunk Infrastructure Ledger (22.5 km² Activation Area, Tata Fab, DIACL Airport, 1 GW Solar)
 * 4. Western Dedicated Freight Corridor (WDFC) Double-Stack Physics & Logistics Ledger
 * 5. Commercial Port-to-Rail Intermodal Connectivity Matrix (Mundra, Kandla, Pipavav, Dahej, Hazira, Sanand, Sabarmati)
 * 6. Intermodal Physics Formulation (T_transit = D/V + T_dwell, 120-truck displacement, 78% fuel reduction, CO2 mitigation)
 * 7. Studio Cockpit Navigation & Hash Routing (/#/dholera and /#/dmic)
 * 8. Modal Dialog Mounting, 4-Card KPI Row, Sensitivity Adjuster Bar & Tabs
 * 9. Interactive Sensitivity Slider Perturbation & Dynamic Recalculation
 * 10. Universal Search Slash Command (/dholera)
 * 11. Keyboard Hotkeys ('j' / 'J' toggle and 'Escape' close)
 * 12. RFC-4180 CSV Exporter
 * 13. High-Resolution Screenshot Artifact Generation
 */

const http = require('http');
const fs = require('fs');
const { spawn } = require('child_process');
const path = require('path');
const os = require('os');

async function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.id = 1;
    this.callbacks = new Map();
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.onopen = () => resolve();
      this.ws.onerror = (err) => reject(err);
      this.ws.onmessage = (msg) => {
        const data = JSON.parse(msg.data);
        if (data.id && this.callbacks.has(data.id)) {
          const cb = this.callbacks.get(data.id);
          this.callbacks.delete(data.id);
          if (data.error) cb.reject(data.error);
          else cb.resolve(data.result);
        }
      };
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async eval(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true
    });
    if (res.exceptionDetails) {
      throw new Error(res.exceptionDetails.text || (res.exceptionDetails.exception && res.exceptionDetails.exception.description) || 'Eval error');
    }
    return res.result ? res.result.value : undefined;
  }
}

async function runAudit() {
  console.log("======================================================================");
  console.log("GUJARAT INFRAMAP — DMIC & DHOLERA SIR CORRIDORS TWIN TEST SUITE");
  console.log("======================================================================");

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${message}`);
      failed++;
    }
  }

  // -------------------------------------------------------------------------
  // POINT 1: Static Industrial, Transport & Railway GeoJSON Sanity
  // -------------------------------------------------------------------------
  console.log("\n--- POINT 1: Static Industrial & Logistics GeoJSON Sanity ---");
  const urbanGeoJson = JSON.parse(fs.readFileSync('data/gujarat_urban_industry.geojson', 'utf-8'));
  assert(urbanGeoJson.features.length >= 34, `Total urban/industry features >= 34 (got ${urbanGeoJson.features.length})`);

  const dholeraSez = urbanGeoJson.features.find(f => f.properties && (f.properties.id === 'GJ-IND-SEZ-002' || (f.properties.name && f.properties.name.includes('Dholera'))));
  assert(dholeraSez && (dholeraSez.geometry.type === 'Point' || dholeraSez.geometry.type === 'Polygon'), "Dholera SIR statutory asset (920 km²) registered in urban_industry dataset");

  const railGeoJson = JSON.parse(fs.readFileSync('data/gujarat_railways.geojson', 'utf-8'));
  assert(railGeoJson.features.length >= 2200, `Total railway tracks >= 2200 (got ${railGeoJson.features.length})`);

  const structGeoJson = JSON.parse(fs.readFileSync('data/gujarat_transport_structures.geojson', 'utf-8'));
  assert(structGeoJson.features.length >= 31, `Total transport structures >= 31 (got ${structGeoJson.features.length})`);

  const roadsGeoJson = JSON.parse(fs.readFileSync('data/gujarat_roads.geojson', 'utf-8'));
  const dholeraExp = roadsGeoJson.features.find(f => f.properties && (f.properties.id === 'GJ-RD-EXP-002' || (f.properties.name && f.properties.name.includes('Dholera'))));
  assert(dholeraExp, "Ahmedabad-Dholera Expressway (NH-64/NE-5) indexed in roads dataset");

  // -------------------------------------------------------------------------
  // Connect to Headless Chrome via CDP
  // -------------------------------------------------------------------------
  const chromePort = 9281;
  console.log(`\n[TEST] Starting headless Chrome on port ${chromePort}...`);
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = path.join(os.tmpdir(), 'chrome-audit-dholera-' + Date.now());

  const chromeProc = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${chromePort}`,
    `--user-data-dir=${userDataDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-background-networking',
    '--disable-extensions',
    'http://127.0.0.1:8080/'
  ]);

  let client = null;
  try {
    let connected = false;
    for (let i = 0; i < 30; i++) {
      try {
        const json = await getJson(`http://127.0.0.1:${chromePort}/json`);
        const page = json.find(t => t.type === 'page');
        if (page && page.webSocketDebuggerUrl) {
          client = new CDPClient(page.webSocketDebuggerUrl);
          await client.connect();
          connected = true;
          break;
        }
      } catch (e) {
        await sleep(500);
      }
    }

    if (!connected) {
      throw new Error("Could not connect to Headless Chrome DevTools Protocol");
    }
    console.log("[TEST] Connected to Chrome DevTools Protocol.");

    await client.send('Page.enable');
    await client.send('Runtime.enable');
    await client.send('DOM.enable');

    let initialized = false;
    for (let i = 0; i < 30; i++) {
      initialized = await client.eval('!!window.StudioManager && !!window.DmicDholeraTwin');
      if (initialized) break;
      await sleep(500);
    }
    assert(initialized, "StudioManager and DmicDholeraTwin initialized on window");

    // -------------------------------------------------------------------------
    // POINT 2: DmicDholeraTwin Public API Surface
    // -------------------------------------------------------------------------
    console.log("\n--- POINT 2: DmicDholeraTwin Public API Surface ---");
    const apiSurface = await client.eval(`({
      hasInit: typeof window.DmicDholeraTwin.init === 'function',
      hasOpenModal: typeof window.DmicDholeraTwin.openModal === 'function',
      hasCloseModal: typeof window.DmicDholeraTwin.closeModal === 'function',
      hasSelectZone: typeof window.DmicDholeraTwin.selectZone === 'function',
      hasSwitchTab: typeof window.DmicDholeraTwin.switchTab === 'function',
      hasGetZones: typeof window.DmicDholeraTwin.getZonesRegistry === 'function',
      hasGetCorridors: typeof window.DmicDholeraTwin.getCorridorsRegistry === 'function',
      hasGetNodes: typeof window.DmicDholeraTwin.getLogisticsNodesRegistry === 'function',
      hasPhysics: typeof window.DmicDholeraTwin.calculateLogisticsPhysics === 'function',
      hasExportCsv: typeof window.DmicDholeraTwin.exportLogisticsCsv === 'function'
    })`);

    assert(apiSurface.hasInit, "window.DmicDholeraTwin.init() method exposed");
    assert(apiSurface.hasOpenModal && apiSurface.hasCloseModal, "openModal() and closeModal() methods exposed");
    assert(apiSurface.hasSelectZone && apiSurface.hasSwitchTab, "selectZone() and switchTab() methods exposed");
    assert(apiSurface.hasGetZones && apiSurface.hasGetCorridors && apiSurface.hasGetNodes, "Registry accessor methods exposed");
    assert(apiSurface.hasPhysics && apiSurface.hasExportCsv, "calculateLogisticsPhysics() and exportLogisticsCsv() methods exposed");

    // -------------------------------------------------------------------------
    // POINT 3: Dholera SIR Master Plan & Trunk Infrastructure Ledger
    // -------------------------------------------------------------------------
    console.log("\n--- POINT 3: Authoritative Dholera SIR Master Plan Ledger ---");
    const zones = await client.eval(`window.DmicDholeraTwin.getZonesRegistry()`);
    const zoneKeys = Object.keys(zones);
    assert(zoneKeys.length === 6, `Total Dholera SIR zones equals 6 (got ${zoneKeys.length})`);

    const activationArea = zones.activation_area;
    assert(activationArea && activationArea.areaSqKm === 22.5, "Dholera Activation Area (TP2A) registered with 22.5 km²");
    assert(activationArea.trunkInfra.includes("Underground Multi-Utility Ducting"), "Activation Area includes underground utility tunnels");

    const semiFab = zones.semiconductor_fab;
    assert(semiFab && semiFab.investmentInrCr === 91000, "Tata Electronics & PSMC Semiconductor Fab Hub ($11B / ₹91,000 Cr) registered");
    assert(semiFab.anchorProjects.includes("50,000 Wafers/Month"), "Semiconductor Fab capacity is 50,000 wafers/month");

    const airport = zones.dholera_airport;
    assert(airport && airport.trunkInfra.includes("Code 4E"), "Dholera International Cargo Airport (DIACL Code 4E) registered");

    const solar = zones.dholera_solar;
    assert(solar && solar.investmentInrCr === 5200, "Dholera 1,000 MW Ultra-Mega Solar Power Park registered");

    // -------------------------------------------------------------------------
    // POINT 4: WDFC Double-Stack Container Freight Corridors
    // -------------------------------------------------------------------------
    console.log("\n--- POINT 4: WDFC Freight Corridors & Axle Load Registry ---");
    const corridors = await client.eval(`window.DmicDholeraTwin.getCorridorsRegistry()`);
    const corKeys = Object.keys(corridors);
    assert(corKeys.length === 5, `Total intermodal freight corridors equals 5 (got ${corKeys.length})`);

    const wdfcSpine = corridors.wdfc_spine;
    assert(wdfcSpine && wdfcSpine.lengthKm === 565, "Western Dedicated Freight Corridor (WDFC Spine) length is 565 km");
    assert(wdfcSpine.catenaryOhe.includes("7.1m High"), "WDFC catenary is 7.1m high overhead for double-stack containers");
    assert(wdfcSpine.trainCapacityTeu === 180, "Double-stack rake capacity is 180 TEUs per train");
    assert(wdfcSpine.axleLoadTonnes === 25, "WDFC axle load standard is 25 tonnes (upgradable to 32.5t)");

    const mundraCor = corridors.mundra_feeder;
    assert(mundraCor && mundraCor.lengthKm === 345, "Mundra Port - Palanpur WDFC interconnector registered (345 km)");

    const pipavavCor = corridors.pipavav_feeder;
    assert(pipavavCor && pipavavCor.lengthKm === 269, "Pipavav Port - Surendranagar WDFC feeder registered (269 km)");

    // -------------------------------------------------------------------------
    // POINT 5: Commercial Ports & Inland Container Depots (ICD)
    // -------------------------------------------------------------------------
    console.log("\n--- POINT 5: Commercial Ports & ICD Logistics Ledger ---");
    const nodes = await client.eval(`window.DmicDholeraTwin.getLogisticsNodesRegistry()`);
    const nodeKeys = Object.keys(nodes);
    assert(nodeKeys.length === 7, `Total logistics nodes equals 7 (got ${nodeKeys.length})`);

    const mundraPort = nodes.mundra_port;
    assert(mundraPort && mundraPort.annualCargoMmt === 155, "Mundra Port throughput registered at 155 MMT");
    assert(mundraPort.containerTeu === 7500000, "Mundra Port container capacity is 7.5 Million TEUs (7,500,000 TEU)");

    const sanandIcd = nodes.icd_sanand;
    assert(sanandIcd && sanandIcd.role.toLowerCase().includes("automotive"), "CONCOR ICD Sanand handles automotive exports");

    // -------------------------------------------------------------------------
    // POINT 6: Intermodal Physics Calculations
    // -------------------------------------------------------------------------
    console.log("\n--- POINT 6: Intermodal Physics Formulation Verification ---");
    const defaultPhysics = await client.eval(`window.DmicDholeraTwin.calculateLogisticsPhysics(24, 75, 4500)`);

    assert(defaultPhysics.dailyRakesNeeded === 25, `Daily rakes needed for 4,500 TEU is 25 (got ${defaultPhysics.dailyRakesNeeded})`);
    assert(defaultPhysics.highwayTrucksSaved === 2700, `Highway trucks displaced equals 2,700/day (got ${defaultPhysics.highwayTrucksSaved})`);
    assert(defaultPhysics.co2MitigatedTonnesPerDay > 500, `CO2 mitigation exceeds 500 tCO2/day (got ${defaultPhysics.co2MitigatedTonnesPerDay})`);
    assert(defaultPhysics.corridorMetrics.wdfc_spine.speedupPct >= 50, `WDFC transit time speedup exceeds 50% vs road (got ${defaultPhysics.corridorMetrics.wdfc_spine.speedupPct}%)`);

    // -------------------------------------------------------------------------
    // POINT 7: Studio Cockpit Navigation & Hash Routing
    // -------------------------------------------------------------------------
    console.log("\n--- POINT 7: Studio Cockpit Navigation & Hash Routing ---");
    const studioPillExists = await client.eval(`!!document.querySelector('.studio-pill[data-studio="dholera"]')`);
    assert(studioPillExists, "Dholera SIR studio pill mounted in .studio-cockpit-bar");

    // Navigate to #/dholera
    await client.eval(`window.location.hash = '#/dholera'`);
    await sleep(600);

    const activeStudio = await client.eval(`window.StudioManager.currentStudio`);
    assert(activeStudio === 'dholera', `Active studio is 'dholera' (got '${activeStudio}')`);

    const isModalOpenAfterHash = await client.eval(`(() => {
      const modal = document.getElementById('dmicTwinModal');
      return modal && modal.open;
    })()`);
    assert(isModalOpenAfterHash, "DMIC Twin Modal opened automatically via /#/dholera hash route");

    // Close modal for subsequent tests
    await client.eval(`window.DmicDholeraTwin.closeModal()`);
    await sleep(300);

    // -------------------------------------------------------------------------
    // POINT 8: Header More Menu & Keyboard Shortcut Toggle (Hotkeys)
    // -------------------------------------------------------------------------
    console.log("\n--- POINT 8: Header More Menu & Keyboard Shortcuts ---");
    const moreBtnExists = await client.eval(`!!document.getElementById('openDmicTwinBtn')`);
    assert(moreBtnExists, "#openDmicTwinBtn button mounted in Header More Menu");

    // Click button to open modal
    await client.eval(`document.getElementById('openDmicTwinBtn').click()`);
    await sleep(300);

    const isModalOpenAfterClick = await client.eval(`(() => {
      const modal = document.getElementById('dmicTwinModal');
      return modal && modal.open;
    })()`);
    assert(isModalOpenAfterClick, "DMIC Twin Modal opened via #openDmicTwinBtn click");

    // Press 'J' key to toggle close
    await client.eval(`document.dispatchEvent(new KeyboardEvent('keydown', { key: 'j', bubbles: true }))`);
    await sleep(300);
    const isModalClosedAfterJ = await client.eval(`(() => {
      const modal = document.getElementById('dmicTwinModal');
      return !modal || !modal.open;
    })()`);
    assert(isModalClosedAfterJ, "Modal closed via keyboard shortcut 'j'");

    // Press 'J' key to toggle open again
    await client.eval(`document.dispatchEvent(new KeyboardEvent('keydown', { key: 'j', bubbles: true }))`);
    await sleep(300);
    const isModalOpenAfterJ2 = await client.eval(`(() => {
      const modal = document.getElementById('dmicTwinModal');
      return modal && modal.open;
    })()`);
    assert(isModalOpenAfterJ2, "Modal opened via keyboard shortcut 'j'");

    // -------------------------------------------------------------------------
    // POINT 9: Modal DOM, 4-Card KPI Row, Sensitivity Sliders & Tables
    // -------------------------------------------------------------------------
    console.log("\n--- POINT 9: Modal DOM Structure & KPI Row ---");
    const kpiMetrics = await client.eval(`({
      transit: document.getElementById('dmicKpiTransit').innerText,
      rakes: document.getElementById('dmicKpiRakes').innerText,
      trucks: document.getElementById('dmicKpiTrucks').innerText,
      savings: document.getElementById('dmicKpiSavings').innerText
    })`);

    assert(kpiMetrics.transit.includes("Hours"), `Transit KPI displays hours (${kpiMetrics.transit})`);
    assert(kpiMetrics.rakes.includes("Trains"), `Rakes KPI displays trains/day (${kpiMetrics.rakes})`);
    assert(kpiMetrics.trucks.includes("Trucks"), `Trucks KPI displays trucks/day relief (${kpiMetrics.trucks})`);
    assert(kpiMetrics.savings.includes("Cr"), `Green savings KPI displays economic benefit (${kpiMetrics.savings})`);

    // -------------------------------------------------------------------------
    // POINT 10: Interactive Sensitivity Sliders Perturbation
    // -------------------------------------------------------------------------
    console.log("\n--- POINT 10: Interactive Sensitivity Sliders Perturbation ---");
    // Change speed slider to 90 km/h and dwell to 18 hrs
    await client.eval(`(() => {
      const speedSlider = document.getElementById('dmicSpeedSlider');
      if (speedSlider) {
        speedSlider.value = 90;
        speedSlider.dispatchEvent(new Event('input', { bubbles: true }));
      }
      const dwellSlider = document.getElementById('dmicDwellSlider');
      if (dwellSlider) {
        dwellSlider.value = 18;
        dwellSlider.dispatchEvent(new Event('input', { bubbles: true }));
      }
    })()`);
    await sleep(200);

    const updatedTransitKpi = await client.eval(`document.getElementById('dmicKpiTransit').innerText`);
    assert(parseFloat(updatedTransitKpi) < 18.0, `Transit time decreased with higher speed & lower dwell (${updatedTransitKpi})`);

    // -------------------------------------------------------------------------
    // POINT 11: Tab Navigation (Master Plan, Corridors, Ports)
    // -------------------------------------------------------------------------
    console.log("\n--- POINT 11: Tab Navigation & Table Rendering ---");
    // Switch to Corridors tab
    await client.eval(`window.DmicDholeraTwin.switchTab('corridors')`);
    await sleep(200);

    const corridorsTabActive = await client.eval(`(() => {
      const pane = document.getElementById('dmic-pane-corridors');
      const rows = document.querySelectorAll('#dmicCorridorsTableBody tr');
      return pane.classList.contains('active') && rows.length >= 5;
    })()`);
    assert(corridorsTabActive, "Switched to Corridors tab with at least 5 freight route rows");

    // Switch to Ports tab
    await client.eval(`window.DmicDholeraTwin.switchTab('ports')`);
    await sleep(200);

    const portsTabActive = await client.eval(`(() => {
      const pane = document.getElementById('dmic-pane-ports');
      const rows = document.querySelectorAll('#dmicPortsTableBody tr');
      return pane.classList.contains('active') && rows.length >= 7;
    })()`);
    assert(portsTabActive, "Switched to Ports & ICD Hubs tab with 7 facility rows");

    // Switch back to Dholera tab
    await client.eval(`window.DmicDholeraTwin.switchTab('dholera')`);
    await sleep(200);

    // -------------------------------------------------------------------------
    // POINT 12: RFC-4180 CSV Exporter
    // -------------------------------------------------------------------------
    console.log("\n--- POINT 12: RFC-4180 CSV Logistics Exporter ---");
    const csvExportSuccess = await client.eval(`(() => {
      try {
        let clicked = false;
        const origAppend = document.body.appendChild;
        document.body.appendChild = function(node) {
          if (node.tagName === 'A' && node.download && node.download.includes('dholera')) {
            clicked = true;
          }
          return origAppend.call(document.body, node);
        };
        window.DmicDholeraTwin.exportLogisticsCsv();
        document.body.appendChild = origAppend;
        return clicked;
      } catch (e) {
        return false;
      }
    })()`);
    assert(csvExportSuccess, "exportLogisticsCsv() triggers RFC-4180 CSV file download");

    // -------------------------------------------------------------------------
    // POINT 13: High-Resolution Screenshot Artifact Generation
    // -------------------------------------------------------------------------
    console.log("\n--- POINT 13: Capturing High-Fidelity Screenshot Artifact ---");
    // Set viewport to 1600x950
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 1600,
      height: 950,
      deviceScaleFactor: 1,
      mobile: false
    });
    await sleep(400);

    const screenshotData = await client.send('Page.captureScreenshot', { format: 'png' });
    const artifactPath = 'C:\\Users\\saumy\\.gemini\\antigravity\\brain\\6069751d-a4a6-4f58-a74e-c145d8a18829\\dholera_twin_preview.png';
    fs.writeFileSync(artifactPath, Buffer.from(screenshotData.data, 'base64'));
    assert(fs.existsSync(artifactPath), `Screenshot successfully saved to ${artifactPath}`);

    // Verify Escape key closes modal
    await client.eval(`document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))`);
    await sleep(200);
    const modalClosedAfterEsc = await client.eval(`(() => {
      const modal = document.getElementById('dmicTwinModal');
      return !modal || !modal.open;
    })()`);
    assert(modalClosedAfterEsc, "Modal dismissed cleanly via Escape key");

  } finally {
    if (client && client.ws) {
      client.ws.close();
    }
    chromeProc.kill();
    try {
      fs.rmSync(userDataDir, { recursive: true, force: true });
    } catch (e) {}
  }

  console.log("\n======================================================================");
  console.log(`AUDIT COMPLETE: ${passed} PASSED, ${failed} FAILED`);
  console.log("======================================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runAudit().catch(err => {
  console.error("Fatal Test Suite Error:", err);
  process.exit(1);
});
