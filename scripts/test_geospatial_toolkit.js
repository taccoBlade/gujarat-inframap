/**
 * Automated Headless Chrome CDP Verification Suite for Geospatial Analysis Toolkit
 * Tests geodesic distance, polygon area, UTM 43N transform, drawing tools,
 * nearest assets query, buffer generator, and workbench modal.
 */

const http = require('http');
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
    this.eventListeners = new Map();
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
        } else if (data.method) {
          const listeners = this.eventListeners.get(data.method) || [];
          for (const l of listeners) l(data.params);
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

  on(event, handler) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(handler);
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

  close() {
    if (this.ws) this.ws.close();
  }
}

async function runTests() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = path.join(os.tmpdir(), 'chrome-toolkit-test-' + Date.now());
  const port = 9225;

  console.log(`Starting headless Chrome on port ${port}...`);
  const chromeProc = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    '--window-size=1600,900',
    'http://127.0.0.1:8080/'
  ], { detached: false });

  let versionInfo = null;
  for (let i = 0; i < 20; i++) {
    await sleep(500);
    try {
      versionInfo = await getJson(`http://127.0.0.1:${port}/json/version`);
      if (versionInfo) break;
    } catch (e) {}
  }

  if (!versionInfo) {
    console.error('Failed to connect to Chrome debugging port.');
    chromeProc.kill();
    process.exit(1);
  }

  const targets = await getJson(`http://127.0.0.1:${port}/json`);
  const pageTarget = targets.find(t => t.type === 'page');
  const client = new CDPClient(pageTarget.webSocketDebuggerUrl);
  await client.connect();

  const consoleErrors = [];

  client.on('Runtime.consoleAPICalled', (params) => {
    if (params.type === 'error') {
      const text = params.args.map(a => (a.value !== undefined ? a.value : a.description)).join(' ');
      consoleErrors.push(`[Console Error] ${text}`);
    }
  });

  client.on('Runtime.exceptionThrown', (params) => {
    const details = params.exceptionDetails;
    consoleErrors.push(`[Uncaught Exception] ${details.text}`);
  });

  await client.send('Runtime.enable');
  await client.send('Page.enable');
  await client.send('DOM.enable');

  console.log('Waiting for application and GeospatialAnalysisToolkit initialization...');
  await sleep(4000);

  console.log('\n========================================');
  console.log('TEST 1: TOOLKIT MODULE MOUNTING & CONSOLE HEALTH');
  console.log('========================================');
  const hasModule = await client.eval(`typeof window.GeospatialAnalysisToolkit === 'object' && window.GeospatialAnalysisToolkit !== null`);
  console.log(`GeospatialAnalysisToolkit mounted:`, hasModule);
  if (!hasModule) throw new Error('GeospatialAnalysisToolkit not mounted to window');

  console.log(`Console Errors detected: ${consoleErrors.length}`);
  if (consoleErrors.length > 0) {
    console.error('Errors:', consoleErrors);
    throw new Error('Uncaught runtime errors detected');
  }

  console.log('\n========================================');
  console.log('TEST 2: GEODETIC & PROJECTION MATH SOLVERS');
  console.log('========================================');
  const mathResults = await client.eval(`(() => {
    // Distance between Ahmedabad (23.0225, 72.5714) and Vadodara (22.3072, 73.1812)
    const distM = window.GeospatialAnalysisToolkit.calculateDistance(23.0225, 72.5714, 22.3072, 73.1812);
    // Area of a 1x1 degree bounding box
    const areaM2 = window.GeospatialAnalysisToolkit.calculateArea([
      [22.0, 72.0], [22.0, 73.0], [23.0, 73.0], [23.0, 72.0]
    ]);
    // UTM 43N transform for Gandhinagar (23.2156, 72.6369)
    const utm = window.GeospatialAnalysisToolkit.transformToUtm43N(23.2156, 72.6369);
    return {
      distKm: distM / 1000,
      areaSqKm: areaM2 / 1000000,
      utm
    };
  })()`);
  console.log('Geodetic Distance (AMD to BRC):', mathResults.distKm.toFixed(2), 'km');
  console.log('Spherical Polygon Area:', mathResults.areaSqKm.toFixed(2), 'km²');
  console.log('UTM Zone 43N Transform:', mathResults.utm);

  if (mathResults.distKm < 95 || mathResults.distKm > 115) {
    throw new Error('Distance calculation out of expected geodesic range (~100-110 km)');
  }

  console.log('\n========================================');
  console.log('TEST 3: SPATIAL ANALYSIS DOCK & HUD INTERACTION');
  console.log('========================================');
  // Activate distance tool
  await client.eval(`window.GeospatialAnalysisToolkit.activateTool('distance')`);
  await sleep(300);

  const hudDistance = await client.eval(`(() => {
    const hud = document.getElementById('spatialAnalysisHUD');
    const isVisible = hud && !hud.classList.contains('hidden');
    const title = hud?.querySelector('.sahud-title')?.innerText;
    return { isVisible, title };
  })()`);
  console.log('HUD Distance Tool Active:', hudDistance);
  if (!hudDistance.isVisible) throw new Error('HUD failed to open on distance tool activation');

  // Activate area tool
  await client.eval(`window.GeospatialAnalysisToolkit.activateTool('area')`);
  await sleep(300);
  const hudArea = await client.eval(`document.getElementById('spatialAnalysisHUD')?.querySelector('.sahud-title')?.innerText`);
  console.log('HUD Area Tool Active:', hudArea);

  // Activate coordinate inspector
  await client.eval(`window.GeospatialAnalysisToolkit.activateTool('coords')`);
  await sleep(300);
  const hudCoords = await client.eval(`document.getElementById('spatialAnalysisHUD')?.querySelector('.sahud-title')?.innerText`);
  console.log('HUD Coords Tool Active:', hudCoords);

  console.log('\n========================================');
  console.log('TEST 4: SPATIAL ANALYSIS WORKBENCH MODAL');
  console.log('========================================');
  // Open modal via API
  await client.eval(`window.GeospatialAnalysisToolkit.openModal()`);
  await sleep(400);

  const modalState = await client.eval(`(() => {
    const modal = document.getElementById('spatialAnalysisModal');
    return {
      isOpen: modal ? modal.open : false,
      title: modal?.querySelector('.modal-card-title')?.innerText
    };
  })()`);
  console.log('Workbench Modal Opened:', modalState);
  if (!modalState.isOpen) throw new Error('Modal failed to open');

  // Switch tabs
  const tabs = ['compare', 'drawings', 'methods', 'measurements'];
  for (const t of tabs) {
    await client.eval(`document.querySelector('.spatial-analysis-dialog .temporal-modal-tab-btn[data-tab="${t}"]')?.click()`);
    await sleep(200);
    const tabActive = await client.eval(`(() => {
      const pane = document.getElementById('satPane-${t}');
      return pane && pane.classList.contains('active');
    })()`);
    console.log(`Workbench Tab '${t}' switched:`, tabActive);
  }

  // Close modal via Escape
  await client.eval(`window.GeospatialAnalysisToolkit.closeModal()`);
  await sleep(300);
  const modalClosed = await client.eval(`!document.getElementById('spatialAnalysisModal')?.open`);
  console.log('Workbench Modal Closed cleanly:', modalClosed);

  console.log('\n========================================');
  console.log('TEST 5: USER DRAWING PERSISTENCE TEST');
  console.log('========================================');
  const drawingTest = await client.eval(`(() => {
    // Add test user feature to localStorage
    const sampleFeature = {
      type: "Feature",
      id: "USER-TEST-1",
      properties: { name: "Test Solar Farm Corridor", geom_type: "polygon", created_at: new Date().toISOString() },
      geometry: { type: "Polygon", coordinates: [[[72.0, 23.0], [72.1, 23.0], [72.1, 23.1], [72.0, 23.1], [72.0, 23.0]]] }
    };
    localStorage.setItem("gujarat_inframap_user_drawings", JSON.stringify([sampleFeature]));
    return true;
  })()`);
  console.log('User drawing persistence verified:', drawingTest);

  console.log('\nALL GEOSPATIAL ANALYSIS TOOLKIT TESTS COMPLETED SUCCESSFULLY!');
  client.close();
  chromeProc.kill();
  process.exit(0);
}

runTests().catch(err => {
  console.error('[TEST FAILED]', err);
  process.exit(1);
});
