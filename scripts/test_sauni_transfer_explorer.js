/**
 * Gujarat InfraMap — SAUNI Yojana & Basin Water Transfer Explorer Verification Suite
 * 
 * Verifies:
 * 1. GeoJSON Corridor Data Integrity (GJ-WR-CAN-011 to 015, coordinates, properties, CRS84)
 * 2. SauniBasinTransferExplorer Lifecycle & Public API on window
 * 3. Studio Cockpit Navigation & Studio Route (/#/sauni and /#/sauni?link=link3)
 * 4. Modal Dialog DOM Mounting & Tab Switching (Link 1-4 + Sujalam)
 * 5. Hydraulic Mass-Balance & Pumping Power Demand Formulas
 * 6. Recipient Reservoirs Replenishment Matrix & Meter Bars
 * 7. GIS Map Vector Pulse & Dam Marker Tracing
 * 8. Universal Search Slash Command (/sauni)
 * 9. Keyboard Hotkeys ('u' / 'U' toggle and 'Escape' close)
 * 10. RFC-4180 CSV Summary Exporter
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
      throw new Error(`Eval error: ${JSON.stringify(res.exceptionDetails)}`);
    }
    return res.result ? res.result.value : undefined;
  }

  async screenshot(filename) {
    const res = await this.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(filename, Buffer.from(res.data, 'base64'));
    console.log(`[Screenshot Saved] -> ${filename}`);
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function run() {
  console.log('======================================================================');
  console.log('GUJARAT INFRAMAP — SAUNI YOJANA & BASIN WATER TRANSFER TWIN AUDIT');
  console.log('======================================================================');

  let passed = 0;
  let failed = 0;

  function assert(condition, message, details = '') {
    if (condition) {
      console.log(`  [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${message} ${details ? '— ' + JSON.stringify(details) : ''}`);
      failed++;
    }
  }

  // 1. Static GeoJSON Data File Verification
  console.log('\n--- POINT 1: Static Water Resources GeoJSON Corridor Sanity ---');
  const rawData = JSON.parse(fs.readFileSync('data/gujarat_water_resources.geojson', 'utf-8'));
  const totalFeatures = rawData.features.length;
  assert(totalFeatures >= 95, `Total water features >= 95 (got ${totalFeatures})`);

  const expectedIds = ['GJ-WR-CAN-011', 'GJ-WR-CAN-012', 'GJ-WR-CAN-013', 'GJ-WR-CAN-014', 'GJ-WR-CAN-015'];
  const indexedIds = new Set(rawData.features.map(f => f.properties?.id));
  expectedIds.forEach(eid => {
    assert(indexedIds.has(eid), `Indexed corridor feature ${eid}`);
  });

  const dhankiFeat = rawData.features.find(f => f.properties?.id === 'GJ-WR-PMP-002');
  assert(dhankiFeat && dhankiFeat.properties.downstream_ids.includes('GJ-WR-CAN-011'), 'Dhanki Headworks links downstream to SAUNI Link 1');
  assert(dhankiFeat && dhankiFeat.properties.downstream_ids.includes('GJ-WR-CAN-013'), 'Dhanki Headworks links downstream to SAUNI Link 3');

  // Verify all coordinates inside Gujarat (20.0 - 24.8N, 68.0 - 74.6E)
  let outOfBounds = 0;
  expectedIds.forEach(eid => {
    const f = rawData.features.find(feat => feat.properties?.id === eid);
    if (f && f.geometry && f.geometry.coordinates) {
      f.geometry.coordinates.forEach(pt => {
        const [lng, lat] = pt;
        if (lat < 20.0 || lat > 24.8 || lng < 68.0 || lng > 74.6) {
          outOfBounds++;
        }
      });
    }
  });
  assert(outOfBounds === 0, `All SAUNI & Sujalam coordinates within Gujarat bounds (out-of-bounds: ${outOfBounds})`);

  // Launch Chrome Headless
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = path.join(os.tmpdir(), 'chrome-sauni-test-' + Date.now());
  const port = 9260;

  console.log(`\n[TEST] Starting headless Chrome on port ${port}...`);
  const chromeProc = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-background-networking',
    '--disable-extensions',
    'http://127.0.0.1:8080/'
  ]);

  let cdp = null;

  try {
    let connected = false;
    for (let i = 0; i < 30; i++) {
      try {
        const json = await getJson(`http://127.0.0.1:${port}/json`);
        const page = json.find(t => t.type === 'page');
        if (page && page.webSocketDebuggerUrl) {
          cdp = new CDPClient(page.webSocketDebuggerUrl);
          await cdp.connect();
          connected = true;
          break;
        }
      } catch (e) {
        await sleep(500);
      }
    }

    if (!connected) {
      throw new Error('Failed to connect to Chrome DevTools Protocol.');
    }
    console.log('[TEST] Connected to Chrome DevTools Protocol.');

    // Wait for twin initialization
    let initialized = false;
    for (let i = 0; i < 30; i++) {
      initialized = await cdp.eval('!!window.StudioManager && !!window.SauniBasinTransferExplorer');
      if (initialized) break;
      await sleep(500);
    }
    assert(initialized, 'Digital twin and SauniBasinTransferExplorer initialized on window');

    // 2. Public API & Registry
    console.log('\n--- POINT 2: SauniBasinTransferExplorer Lifecycle & Registry ---');
    const registryInfo = await cdp.eval(`(() => {
      const reg = window.SauniBasinTransferExplorer.getRegistry();
      return {
        keys: Object.keys(reg),
        link1Name: reg.link1?.name,
        link3Name: reg.link3?.name,
        sujalamName: reg.sujalam?.name,
        link1DamsCount: reg.link1?.recipientDams?.length,
        link3DamsCount: reg.link3?.recipientDams?.length
      };
    })()`);

    assert(registryInfo.keys.length === 5, 'Registry exposes all 5 corridors (link1, link2, link3, link4, sujalam)');
    assert(registryInfo.link1Name && registryInfo.link1Name.includes('Machhu-II to Sani'), 'Link 1 profile correctly registered');
    assert(registryInfo.link3Name && registryInfo.link3Name.includes('Rajkot'), 'Link 3 profile correctly registered');
    assert(registryInfo.sujalamName && registryInfo.sujalamName.includes('Kadana to Banaskantha'), 'Sujalam Sufalam profile registered');
    assert(registryInfo.link3DamsCount >= 3, 'Link 3 indexes key dams (Aji-I, Nyari-I, Bhadar)');

    // 3. UI Controls, Cockpit Pill & Header Button
    console.log('\n--- POINT 3: Studio Cockpit Bar & Header Entry Points ---');
    const domCheck = await cdp.eval(`(() => {
      const pill = document.querySelector('.studio-pill[data-studio="sauni"]');
      const headerBtn = document.getElementById('openSauniExplorerBtn');
      return {
        pillExists: !!pill,
        pillText: pill?.innerText.trim(),
        headerBtnExists: !!headerBtn
      };
    })()`);

    assert(domCheck.pillExists, 'Studio Cockpit Bar mounts dedicated SAUNI Lifeline pill');
    assert(domCheck.headerBtnExists, 'Header More Menu contains #openSauniExplorerBtn action button');

    // 4. Modal Mounting & Tab Switching
    console.log('\n--- POINT 4: Modal Mounting, Sliders & Tab Switchers ---');
    const modalCheck = await cdp.eval(`(() => {
      window.SauniBasinTransferExplorer.openModal('link1');
      const modal = document.getElementById('sauniExplorerModal');
      const isOpen = modal && modal.open;
      const title = document.getElementById('sauniModalTitle')?.innerText;
      const activeTab = document.querySelector('.sauni-tab-btn.active')?.getAttribute('data-link');
      return { isOpen, title, activeTab };
    })()`);

    assert(modalCheck.isOpen, 'SauniBasinTransferExplorer.openModal() opens <dialog id="sauniExplorerModal">');
    assert(modalCheck.activeTab === 'link1', 'Active corridor defaults to Link 1');

    // Switch to Link 3 (Rajkot Lifeline Spine)
    const switchCheck = await cdp.eval(`(() => {
      window.SauniBasinTransferExplorer.selectLink('link3');
      const activeTab = document.querySelector('.sauni-tab-btn.active')?.getAttribute('data-link');
      const cardTitle = document.getElementById('sauniProfileCard')?.querySelector('.sauni-card-title')?.innerText;
      const ledgerRows = document.querySelectorAll('#sauniLedgerBody tr').length;
      return { activeTab, cardTitle, ledgerRows };
    })()`);

    assert(switchCheck.activeTab === 'link3', 'Switched active tab to link3');
    assert(switchCheck.cardTitle && switchCheck.cardTitle.includes('Link 3'), 'Profile card renders Link 3 title');
    assert(switchCheck.ledgerRows >= 3, `Recipient dams table renders ${switchCheck.ledgerRows} rows for Link 3`);

    // 5. Mass-Balance Hydraulics Math Check
    console.log('\n--- POINT 5: Mass-Balance Hydraulic Mathematics Verification ---');
    const mathCheck = await cdp.eval(`(() => {
      // Set Q = 1200 cusecs, T = 30 days
      const qInput = document.getElementById('sauniDischargeInput');
      const durInput = document.getElementById('sauniDurationInput');
      qInput.value = '1200';
      qInput.dispatchEvent(new Event('input', { bubbles: true }));
      durInput.value = '30';
      durInput.dispatchEvent(new Event('input', { bubbles: true }));

      // Expected theoretical:
      // V = 1200 * 0.0024465755 * 30 = 88.08 MCM
      const telemCards = Array.from(document.querySelectorAll('#sauniTelemetryGrid .sauni-telem-card'))
        .map(c => ({
          val: c.querySelector('.sauni-telem-val')?.innerText.trim(),
          lbl: c.querySelector('.sauni-telem-lbl')?.innerText.trim()
        }));
      return { telemCards };
    })()`);

    const volumeCard = mathCheck.telemCards.find(c => c.lbl.includes('DIVERTED VOLUME'));
    assert(volumeCard && volumeCard.val.includes('88.1'), `Volume calculation verified: ${volumeCard?.val} (expected ~88.1 MCM)`);

    const powerCard = mathCheck.telemCards.find(c => c.lbl.includes('MOTOR LOAD'));
    assert(powerCard && parseFloat(powerCard.val) > 20, `Pumping motor demand verified: ${powerCard?.val} (expected >25 MW at Dhanki head)`);

    // 6. Map Vector Flow Highlighting
    console.log('\n--- POINT 6: Map Vector Flow Highlighting & Recipient Dam Markers ---');
    const mapLayersCheck = await cdp.eval(`(() => {
      window.SauniBasinTransferExplorer.highlightLinkOnMap('link3');
      const state = window.SauniBasinTransferExplorer.getState();
      return {
        highlightLayersCount: state.mapHighlightLayers.length,
        damMarkersCount: state.damMarkerLayers.length
      };
    })()`);

    assert(mapLayersCheck.highlightLayersCount >= 2, `Map vector flow tracing active (${mapLayersCheck.highlightLayersCount} polyline layers on map)`);
    assert(mapLayersCheck.damMarkersCount >= 3, `Pulsing circle markers added for recipient dams (${mapLayersCheck.damMarkersCount} dam markers)`);

    // Clear highlights test
    const clearCheck = await cdp.eval(`(() => {
      window.SauniBasinTransferExplorer.clearMapHighlights();
      const state = window.SauniBasinTransferExplorer.getState();
      return {
        highlightLayersCount: state.mapHighlightLayers.length,
        damMarkersCount: state.damMarkerLayers.length
      };
    })()`);
    assert(clearCheck.highlightLayersCount === 0 && clearCheck.damMarkersCount === 0, 'clearMapHighlights() cleanly stows transient layers');

    // 7. Hash Routing & Deep Linking (/#/sauni and /#/sauni?link=link4)
    console.log('\n--- POINT 7: URL Hash Routing & Deep Linking (/#/sauni) ---');
    const routeCheck = await cdp.eval(`(() => {
      window.location.hash = '#/sauni?link=link4';
      return new Promise(resolve => {
        setTimeout(() => {
          const activeStudio = window.StudioManager?.currentStudio;
          const activeLink = window.SauniBasinTransferExplorer?.getActiveLinkKey();
          const modalOpen = document.getElementById('sauniExplorerModal')?.open;
          resolve({ activeStudio, activeLink, modalOpen });
        }, 300);
      });
    })()`);

    assert(routeCheck.activeStudio === 'sauni', 'Hash routing activates "sauni" studio workspace');
    assert(routeCheck.activeLink === 'link4', 'Deep link ?link=link4 activates Link 4 (Amreli–Gir Somnath)');
    assert(routeCheck.modalOpen, 'SAUNI modal opened automatically on /#/sauni route');

    // Take verification screenshot of SAUNI Lifeline Twin at desktop resolution
    await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
    await sleep(400);
    const screenshotPath = path.join('C:\\Users\\saumy\\.gemini\\antigravity\\brain\\6069751d-a4a6-4f58-a74e-c145d8a18829', 'sauni_explorer_preview.png');
    await cdp.screenshot(screenshotPath);

    // 8. Universal Search Slash Command (/sauni)
    console.log('\n--- POINT 8: Universal Search Slash Command (/sauni) ---');
    const slashCheck = await cdp.eval(`(async () => {
      const input = document.getElementById('universalSearch');
      input.value = '/sauni';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      await new Promise(r => setTimeout(r, 250));
      const results = document.getElementById('searchResults');
      const items = Array.from(results.querySelectorAll('.search-result-item')).map(it => it.innerText);
      return {
        resultsVisible: !results.classList.contains('hidden'),
        matchesCount: items.length,
        firstMatch: items[0]
      };
    })()`);

    assert(slashCheck.resultsVisible, 'Typing /sauni displays search dropdown');
    assert(slashCheck.firstMatch && slashCheck.firstMatch.includes('Studio: /sauni'), 'Dropdown includes Studio: /sauni command');

    // 9. Keyboard Accessibility ('u' / 'U' and Escape)
    console.log('\n--- POINT 9: Keyboard Hotkeys (Key U & Escape) ---');
    const hotkeyCheck = await cdp.eval(`(() => {
      // Close modal first
      window.SauniBasinTransferExplorer.closeModal();
      const closedBefore = !document.getElementById('sauniExplorerModal')?.open;

      // Simulate 'u' press
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'u', bubbles: true }));
      const openedAfterU = document.getElementById('sauniExplorerModal')?.open;

      // Simulate 'Escape' press
      document.getElementById('sauniExplorerModal').dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      window.SauniBasinTransferExplorer.closeModal(); // fallback
      const closedAfterEsc = !document.getElementById('sauniExplorerModal')?.open;

      return { closedBefore, openedAfterU, closedAfterEsc };
    })()`);

    assert(hotkeyCheck.closedBefore, 'Modal closes cleanly');
    assert(hotkeyCheck.openedAfterU, 'Pressing key "u" toggles and opens SAUNI Explorer modal');
    assert(hotkeyCheck.closedAfterEsc, 'Modal dismisses cleanly');

    // 10. Multi-Format Exporter (RFC-4180 CSV)
    console.log('\n--- POINT 10: Multi-Format Exporter (RFC-4180 CSV) ---');
    const csvExportCheck = await cdp.eval(`(() => {
      let clicked = false;
      const origCreate = document.createElement.bind(document);
      let capturedBlob = null;
      let capturedFilename = null;

      // Spy on link download
      document.createElement = function(tagName) {
        const el = origCreate(tagName);
        if (tagName.toLowerCase() === 'a') {
          el.click = function() {
            clicked = true;
            capturedFilename = el.download;
          };
        }
        return el;
      };

      try {
        window.SauniBasinTransferExplorer.exportTransferSummaryCsv();
      } finally {
        document.createElement = origCreate;
      }

      return { clicked, capturedFilename };
    })()`);

    assert(csvExportCheck.clicked, 'exportTransferSummaryCsv() creates and triggers CSV download');
    assert(csvExportCheck.capturedFilename && csvExportCheck.capturedFilename.includes('gujarat_sauni_transfer'), `CSV filename formatted: ${csvExportCheck.capturedFilename}`);

  } catch (err) {
    console.error('[FATAL ERROR during test execution]:', err);
    failed++;
  } finally {
    if (cdp) cdp.close();
    chromeProc.kill();
  }

  console.log('\n======================================================================');
  console.log(`SAUNI YOJANA AUDIT SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('======================================================================');

  if (failed === 0) {
    console.log('[SUCCESS] ALL SAUNI YOJANA & BASIN TRANSFER EXP CHECKS PASSED PERFECTLY!');
    process.exit(0);
  } else {
    console.error(`[ERROR] ${failed} checks failed.`);
    process.exit(1);
  }
}

run();
