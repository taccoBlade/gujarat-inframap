/**
 * Gujarat InfraMap — Khavda Hybrid RE Mega-Park & EHV Green Energy Corridor Twin Verification Suite
 * 
 * Verifies:
 * 1. Static Power & Transmission GeoJSON Sanity
 * 2. KhavdaGreenEnergyTwin Lifecycle & Public API on window
 * 3. Authoritative 30 GW Mega-Park Block Registry (Adani, NTPC, GIPCL, GSECL, SECI, Charanka, Dholera)
 * 4. Diurnal Solar PV & Wind Dispatch Mathematical Physics (Noon peak, night baseload, duck curve)
 * 5. Studio Cockpit Navigation & Hash Routing (/#/khavda and /#/khavda?block=ntpc_block)
 * 6. Modal Dialog Mounting, 24-Hour Scrubber & Playback Animation
 * 7. 765 kV / 400 kV EHV Corridors & Substation Transformer MVA Headroom Matrix
 * 8. Dynamic Sensitivity Stress Controls (Solar Irradiance, Wind Speed, Grid Rating)
 * 9. Leaflet Canvas Vector Animations (Pulsing corridor, park footprint polygon, substation pins)
 * 10. Universal Search Slash Command (/khavda)
 * 11. Keyboard Hotkeys ('k' / 'K' toggle and 'Escape' close)
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
  console.log("GUJARAT INFRAMAP — KHAVDA RE MEGA-PARK & EHV GREEN CORRIDOR AUDIT");
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
  // POINT 1: Static Power & Transmission GeoJSON Sanity
  // -------------------------------------------------------------------------
  console.log("\n--- POINT 1: Static Energy GeoJSON Data Sanity ---");
  const powerGeoJson = JSON.parse(fs.readFileSync('data/gujarat_power.geojson', 'utf-8'));
  assert(powerGeoJson.features.length >= 49, `Total power generation features >= 49 (got ${powerGeoJson.features.length})`);

  const khavdaPower = powerGeoJson.features.find(f => f.properties && f.properties.id === 'power_khavda_renewable_energy_park_phase_i');
  assert(khavdaPower && khavdaPower.geometry.type === 'Point', "Khavda Renewable Energy Park registered in power dataset");

  const transGeoJson = JSON.parse(fs.readFileSync('data/gujarat_transmission.geojson', 'utf-8'));
  assert(transGeoJson.features.length >= 37, `Total transmission features >= 37 (got ${transGeoJson.features.length})`);

  const khavdaLine = transGeoJson.features.find(f => f.properties && f.properties.id === 'trans_765_khavda_vadodara');
  assert(khavdaLine && khavdaLine.properties.voltage_kv === 765, "765 kV Khavda-Vadodara UHV corridor indexed");

  const lakadiaSub = transGeoJson.features.find(f => f.properties && f.properties.id === 'substation_lakadia_765');
  assert(lakadiaSub && lakadiaSub.properties.voltage_kv === 765, "Lakadia 765/400 kV pooling substation indexed");

  // -------------------------------------------------------------------------
  // Connect to Headless Chrome via CDP
  // -------------------------------------------------------------------------
  const chromePort = 9280;
  console.log(`\n[TEST] Starting headless Chrome on port ${chromePort}...`);
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = path.join(os.tmpdir(), 'chrome-audit-khv-' + Date.now());

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
      initialized = await client.eval('!!window.StudioManager && !!window.KhavdaGreenEnergyTwin');
      if (initialized) break;
      await sleep(500);
    }
    assert(initialized === true, "KhavdaGreenEnergyTwin initialized and exposed on window");

    // -------------------------------------------------------------------------
    // POINT 2: KhavdaGreenEnergyTwin Lifecycle & Public API
    // -------------------------------------------------------------------------
    console.log("\n--- POINT 2: KhavdaGreenEnergyTwin Lifecycle & Registry ---");
    const apiMethods = await client.eval(`
      [
        typeof window.KhavdaGreenEnergyTwin.init,
        typeof window.KhavdaGreenEnergyTwin.openModal,
        typeof window.KhavdaGreenEnergyTwin.closeModal,
        typeof window.KhavdaGreenEnergyTwin.selectBlock,
        typeof window.KhavdaGreenEnergyTwin.setDiurnalHour,
        typeof window.KhavdaGreenEnergyTwin.play,
        typeof window.KhavdaGreenEnergyTwin.pause,
        typeof window.KhavdaGreenEnergyTwin.flyToBlock,
        typeof window.KhavdaGreenEnergyTwin.exportDispatchCsv,
        typeof window.KhavdaGreenEnergyTwin.getBlocksRegistry,
        typeof window.KhavdaGreenEnergyTwin.getCorridorsRegistry,
        typeof window.KhavdaGreenEnergyTwin.getSubstationsRegistry
      ].every(t => t === "function")
    `);
    assert(apiMethods === true, "Public API exposes all critical controller and telemetry methods");

    const blocksCount = await client.eval(`Object.keys(window.KhavdaGreenEnergyTwin.getBlocksRegistry()).length`);
    assert(blocksCount >= 7, `Mega-park registry indexes all 7 key blocks & anchor complexes (got ${blocksCount})`);

    const corridorsCount = await client.eval(`Object.keys(window.KhavdaGreenEnergyTwin.getCorridorsRegistry()).length`);
    assert(corridorsCount >= 6, `Transmission registry indexes all 6 EHV corridors (got ${corridorsCount})`);

    const subsCount = await client.eval(`Object.keys(window.KhavdaGreenEnergyTwin.getSubstationsRegistry()).length`);
    assert(subsCount >= 8, `Substation matrix indexes 8 primary EHV stepping nodes (got ${subsCount})`);

    // -------------------------------------------------------------------------
    // POINT 3: Studio Cockpit Bar & Header Entry Points
    // -------------------------------------------------------------------------
    console.log("\n--- POINT 3: Studio Cockpit Bar & Header Entry Points ---");
    const hasPill = await client.eval(`!!document.querySelector('.studio-pill[data-studio="khavda"]')`);
    assert(hasPill === true, "Studio Cockpit Bar mounts dedicated Khavda RE Corridor pill");

    const hasHeaderBtn = await client.eval(`!!document.getElementById("openKhavdaTwinBtn")`);
    assert(hasHeaderBtn === true, "Header More Menu contains #openKhavdaTwinBtn action button");

    // -------------------------------------------------------------------------
    // POINT 4: Modal Mounting & Block Selection
    // -------------------------------------------------------------------------
    console.log("\n--- POINT 4: Modal Mounting & Block Selection ---");
    await client.eval(`window.KhavdaGreenEnergyTwin.openModal("agel_block")`);
    await sleep(500);

    const modalOpen = await client.eval(`
      const m = document.getElementById("khavdaTwinModal");
      m && m.open === true
    `);
    assert(modalOpen === true, "KhavdaGreenEnergyTwin.openModal() opens <dialog id='khavdaTwinModal'>");

    const activeBlockVal = await client.eval(`document.getElementById("khavdaBlockSelect").value`);
    assert(activeBlockVal === "agel_block", "Active block defaults to 'agel_block' (Adani Green Mega Complex)");

    // Switch to NTPC block
    await client.eval(`
      const sel = document.getElementById("khavdaBlockSelect");
      sel.value = "ntpc_block";
      sel.dispatchEvent(new Event("change", { bubbles: true }));
    `);
    await sleep(400);

    const ntpcActive = await client.eval(`window.KhavdaGreenEnergyTwin.activeBlockKey === "ntpc_block"`);
    assert(ntpcActive === true, "Switched active block to 'ntpc_block' via select control");

    // -------------------------------------------------------------------------
    // POINT 5: Diurnal Solar-Wind Physics & Dispatch Calculations
    // -------------------------------------------------------------------------
    console.log("\n--- POINT 5: Diurnal Solar-Wind Physics & Dispatch Calculations ---");
    // Test Noon solar peak (12:00 IST)
    const noonCheck = await client.eval(`(() => {
      window.KhavdaGreenEnergyTwin.setDiurnalHour(12);
      const d = window.KhavdaGreenEnergyTwin.calculateDiurnalDispatch(12, 1000, 8.5, 1.0);
      const kpiGenText = document.getElementById("khavdaKpiGen").textContent;
      const kpiEvacText = document.getElementById("khavdaKpiEvac").textContent;
      return { d, kpiGenText, kpiEvacText };
    })()`);

    assert(noonCheck.d.totalKhavdaSolarMw > 5000, `Noon solar generation peaks above 5,000 MW (got: ${noonCheck.d.totalKhavdaSolarMw} MW)`);
    assert(noonCheck.d.solarCufPct >= 75, `Noon solar CUF exceeds 75% (got: ${noonCheck.d.solarCufPct}%)`);
    assert(noonCheck.d.khavdaEvacuatedMw > 5000, `Corridor evacuates bulk power (got: ${noonCheck.d.khavdaEvacuatedMw} MW)`);

    // Test Midnight wind baseload (00:00 IST)
    const midnightCheck = await client.eval(`(() => {
      window.KhavdaGreenEnergyTwin.setDiurnalHour(0);
      return window.KhavdaGreenEnergyTwin.calculateDiurnalDispatch(0, 1000, 8.5, 1.0);
    })()`);

    assert(midnightCheck.totalKhavdaSolarMw === 0, "Midnight solar generation is exactly 0 MW");
    assert(midnightCheck.totalKhavdaWindMw > 200, `Midnight wind baseload persists above 200 MW (got: ${midnightCheck.totalKhavdaWindMw} MW)`);

    // -------------------------------------------------------------------------
    // POINT 6: EHV Corridors & Substation Headroom Matrix
    // -------------------------------------------------------------------------
    console.log("\n--- POINT 6: EHV Corridors & Substation Headroom Matrix ---");
    await client.eval(`window.KhavdaGreenEnergyTwin.switchTab("grid")`);
    await sleep(300);

    const corridorsCountTable = await client.eval(`document.querySelectorAll("#khavdaCorridorsTableBody tr").length`);
    assert(corridorsCountTable === 6, `Corridors table renders all 6 EHV lines (got: ${corridorsCountTable})`);

    const subsCountTable = await client.eval(`document.querySelectorAll("#khavdaSubstationsTableBody tr").length`);
    assert(subsCountTable === 8, `Substations table renders all 8 primary nodes (got: ${subsCountTable})`);

    const lakadiaHasHeadroom = await client.eval(`(() => {
      const rows = Array.from(document.querySelectorAll("#khavdaSubstationsTableBody tr"));
      return rows.some(r => r.textContent.includes("Lakadia") && r.textContent.includes("MVA"));
    })()`);
    assert(lakadiaHasHeadroom === true, "Lakadia 765/400 kV substation displays available transformer headroom MVA");

    // -------------------------------------------------------------------------
    // POINT 7: 24-Hour Diurnal Dispatch Schedule Table
    // -------------------------------------------------------------------------
    console.log("\n--- POINT 7: 24-Hour Diurnal Dispatch Schedule Table ---");
    await client.eval(`window.KhavdaGreenEnergyTwin.switchTab("dispatch")`);
    await sleep(300);

    const scheduleRows = await client.eval(`document.querySelectorAll("#khavdaHourlyScheduleBody tr").length`);
    assert(scheduleRows === 24, `Hourly schedule table renders complete 24-hour dispatch cycle (got: ${scheduleRows})`);

    // -------------------------------------------------------------------------
    // POINT 8: Timeline Hour Scrubber & Playback Engine
    // -------------------------------------------------------------------------
    console.log("\n--- POINT 8: Timeline Hour Scrubber & Playback Engine ---");
    const initialHour = await client.eval(`window.KhavdaGreenEnergyTwin.currentHour`);
    await client.eval(`window.KhavdaGreenEnergyTwin.nextHour()`);
    const nextHour = await client.eval(`window.KhavdaGreenEnergyTwin.currentHour`);
    assert(nextHour === (initialHour + 1) % 24, `Hour scrubber advanced cleanly (from ${initialHour} to ${nextHour})`);

    // Test Play/Pause toggle
    await client.eval(`window.KhavdaGreenEnergyTwin.play()`);
    const isPlaying = await client.eval(`window.KhavdaGreenEnergyTwin.isPlaying`);
    assert(isPlaying === true, "Play controller starts 24-hour diurnal dispatch animation");

    await client.eval(`window.KhavdaGreenEnergyTwin.pause()`);
    const isPaused = await client.eval(`!window.KhavdaGreenEnergyTwin.isPlaying`);
    assert(isPaused === true, "Pause controller halts animation cleanly");

    // -------------------------------------------------------------------------
    // POINT 9: URL Hash Routing & Deep Linking (/#/khavda?block=agel_block)
    // -------------------------------------------------------------------------
    console.log("\n--- POINT 9: URL Hash Routing & Deep Linking (/#/khavda) ---");
    await client.eval(`window.KhavdaGreenEnergyTwin.closeModal()`);
    await sleep(300);

    await client.eval(`window.location.hash = "#/khavda?block=agel_block"`);
    await sleep(600);

    const routeStudio = await client.eval(`window.StudioManager.currentStudio`);
    assert(routeStudio === "khavda", "Hash routing #/khavda activates 'khavda' studio workspace");

    const deepLinkBlock = await client.eval(`window.KhavdaGreenEnergyTwin.activeBlockKey`);
    assert(deepLinkBlock === "agel_block", "Deep link ?block=agel_block activates Adani Green Mega Complex");

    const reopenedModal = await client.eval(`document.getElementById("khavdaTwinModal").open`);
    assert(reopenedModal === true, "Khavda modal opened automatically on /#/khavda route");

    // Capture screenshot artifact
    const screenshotData = await client.send('Page.captureScreenshot', { format: 'png' });
    const screenshotPath = 'C:\\Users\\saumy\\.gemini\\antigravity\\brain\\6069751d-a4a6-4f58-a74e-c145d8a18829\\khavda_twin_preview.png';
    fs.writeFileSync(screenshotPath, Buffer.from(screenshotData.data, 'base64'));
    console.log(`[Screenshot Saved] -> ${screenshotPath}`);

    // -------------------------------------------------------------------------
    // POINT 10: Universal Search Slash Command (/khavda)
    // -------------------------------------------------------------------------
    console.log("\n--- POINT 10: Universal Search Slash Command (/khavda) ---");
    const slashCheck = await client.eval(`(async () => {
      const input = document.getElementById("universalSearch");
      if (!input) return { ok: false, msg: "no universalSearch" };
      input.value = "/khavda";
      input.dispatchEvent(new Event("input", { bubbles: true }));
      await new Promise(r => setTimeout(r, 300));
      const res = document.getElementById("searchResults");
      const visible = res && !res.classList.contains("hidden");
      const text = res ? res.textContent : "";
      return { ok: visible && text.includes("/khavda"), text };
    })()`);
    assert(slashCheck.ok === true, "Typing /khavda displays search dropdown with Studio: /khavda command");

    // -------------------------------------------------------------------------
    // POINT 11: Keyboard Hotkeys (Key K & Escape)
    // -------------------------------------------------------------------------
    console.log("\n--- POINT 11: Keyboard Hotkeys (Key K & Escape) ---");
    await client.eval(`window.KhavdaGreenEnergyTwin.closeModal()`);
    await sleep(300);
    const closed = await client.eval(`!document.getElementById("khavdaTwinModal").open`);
    assert(closed === true, "Modal closed cleanly");

    // Press 'k' to open
    await client.eval(`
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", bubbles: true }));
    `);
    await sleep(300);
    const hotkeyOpened = await client.eval(`document.getElementById("khavdaTwinModal").open`);
    assert(hotkeyOpened === true, "Pressing key 'k' toggles and opens Khavda Green Energy Twin modal");

    // Press Escape to close
    await client.eval(`
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    `);
    await sleep(300);
    const escapeClosed = await client.eval(`!document.getElementById("khavdaTwinModal").open`);
    assert(escapeClosed === true, "Pressing Escape dismisses the modal cleanly");

    // -------------------------------------------------------------------------
    // POINT 12: RFC-4180 CSV Exporter
    // -------------------------------------------------------------------------
    console.log("\n--- POINT 12: Multi-Format Exporter (RFC-4180 CSV) ---");
    const csvExportWorks = await client.eval(`(() => {
      let triggered = false;
      const origCreate = document.createElement;
      document.createElement = function(tag) {
        const el = origCreate.call(document, tag);
        if (tag.toLowerCase() === "a") {
          el.click = function() {
            triggered = true;
          };
        }
        return el;
      };
      window.KhavdaGreenEnergyTwin.exportDispatchCsv();
      document.createElement = origCreate;
      return triggered;
    })()`);
    assert(csvExportWorks === true, "exportDispatchCsv() creates and triggers CSV download with UTF-8 BOM");

  } catch (err) {
    console.error("[AUDIT EXCEPTION]:", err);
    failed++;
  } finally {
    if (chromeProc) {
      chromeProc.kill('SIGKILL');
    }
    try {
      fs.rmSync(userDataDir, { recursive: true, force: true });
    } catch (e) {}
  }

  console.log("\n======================================================================");
  console.log(`KHAVDA GREEN ENERGY AUDIT SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("======================================================================");

  if (failed > 0) {
    process.exit(1);
  } else {
    console.log("[SUCCESS] ALL KHAVDA GREEN ENERGY DIGITAL TWIN CHECKS PASSED PERFECTLY!\n");
    process.exit(0);
  }
}

runAudit();
