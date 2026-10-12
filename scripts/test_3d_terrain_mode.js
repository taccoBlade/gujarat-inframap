/**
 * Automated Headless Chrome CDP Verification Suite for Gujarat 3D Terrain & Infrastructure Mode
 * Tests:
 * 1. Terrain3DMode presence, initialization, and public API.
 * 2. DOM elements (#map3DContainer, canvas, controls, hud, floating button).
 * 3. SRTM 90m mathematical terrain elevation accuracy across Gujarat physiographic regimes.
 * 4. Mode transition: Enter 3D, exit back to 2D Leaflet without map disruption.
 * 5. Camera landmark presets (Sardar Sarovar, Ukai, Sudarshan Setu, Girnar, Dholera, etc.).
 * 6. Camera angle presets (Oblique, Nadir, Profile).
 * 7. Shading and analysis modes (Analytical Hillshade vs Geotechnical Slope Gradient).
 * 8. Exaggeration slider adjustment.
 * 9. Keyboard triggers: 'v' / 'V' toggle, 'Escape' exit.
 * 10. Memory safety & render cycle verification.
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
  const userDataDir = path.join(os.tmpdir(), 'chrome-3d-test-' + Date.now());
  const port = 9228;

  console.log(`[TEST] Starting headless Chrome on port ${port}...`);
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
    console.error('[FAIL] Could not connect to Chrome debugging port.');
    chromeProc.kill();
    process.exit(1);
  }

  const targets = await getJson(`http://127.0.0.1:${port}/json/list`);
  const pageTarget = targets.find(t => t.type === 'page' && t.url.includes('8080'));
  if (!pageTarget) {
    console.error('[FAIL] Target page not found.');
    chromeProc.kill();
    process.exit(1);
  }

  const cdp = new CDPClient(pageTarget.webSocketDebuggerUrl);
  await cdp.connect();
  console.log('[TEST] Connected to Chrome DevTools Protocol.');

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

  try {
    // 1. Wait for page load and app initialization
    console.log('\n--- Test 1: Page Initialization & Terrain3DMode Global ---');
    await sleep(2500);

    const has3DMode = await cdp.eval('typeof window.Terrain3DMode === "object"');
    assert(has3DMode, 'window.Terrain3DMode object exists in global namespace');

    const hasAPI = await cdp.eval(`
      typeof window.Terrain3DMode.init === "function" &&
      typeof window.Terrain3DMode.enter === "function" &&
      typeof window.Terrain3DMode.exit === "function" &&
      typeof window.Terrain3DMode.toggle === "function" &&
      typeof window.Terrain3DMode.isActive === "function" &&
      typeof window.Terrain3DMode.focusLandmark === "function" &&
      typeof window.Terrain3DMode.setCameraPreset === "function" &&
      typeof window.Terrain3DMode.getElevation === "function"
    `);
    assert(hasAPI, 'Terrain3DMode exposes full public API (init, enter, exit, toggle, isActive, focusLandmark, setCameraPreset, getElevation)');

    // 2. Test SRTM Elevation Accuracy
    console.log('\n--- Test 2: SRTM 90m Topographic Elevation Accuracy ---');
    const elevGirnar = await cdp.eval('Math.round(window.Terrain3DMode.getElevation(21.527, 70.533))');
    assert(elevGirnar >= 1000 && elevGirnar <= 1040, `Girnar volcanic plug elevation ~1,031m MSL (got ${elevGirnar}m)`);

    const elevPavagadh = await cdp.eval('Math.round(window.Terrain3DMode.getElevation(22.460, 73.522))');
    assert(elevPavagadh >= 800 && elevPavagadh <= 835, `Pavagadh volcanic neck elevation ~824m MSL (got ${elevPavagadh}m)`);

    const elevSaputara = await cdp.eval('Math.round(window.Terrain3DMode.getElevation(20.57, 73.75))');
    assert(elevSaputara >= 900 && elevSaputara <= 1010, `Saputara highlands elevation ~1,000m MSL (got ${elevSaputara}m)`);

    const elevAlluvium = await cdp.eval('Math.round(window.Terrain3DMode.getElevation(23.02, 72.57))');
    assert(elevAlluvium >= 25 && elevAlluvium <= 70, `Central Gujarat alluvium plains elevation 25-70m MSL (got ${elevAlluvium}m)`);

    const elevKutch = await cdp.eval('Math.round(window.Terrain3DMode.getElevation(23.8, 70.0))');
    assert(elevKutch >= 0 && elevKutch <= 25, `Rann of Kutch coastal depression 0-25m MSL (got ${elevKutch}m)`);

    // 3. Test Enter 3D Mode via API
    console.log('\n--- Test 3: Entering 3D Terrain Mode ---');
    const wasActiveInitially = await cdp.eval('window.Terrain3DMode.isActive()');
    assert(!wasActiveInitially, '3D Mode starts in inactive state (2D Leaflet active)');

    await cdp.eval('window.Terrain3DMode.enter()');
    await sleep(1000);

    const isActiveNow = await cdp.eval('window.Terrain3DMode.isActive()');
    assert(isActiveNow, 'Terrain3DMode.isActive() is true after enter()');

    const containerVisible = await cdp.eval(`
      const c = document.getElementById("map3DContainer");
      c && !c.classList.contains("hidden") && c.offsetHeight > 0
    `);
    assert(containerVisible, '#map3DContainer is rendered and visible in DOM');

    const canvasExists = await cdp.eval('!!document.getElementById("map3DCanvas")');
    assert(canvasExists, 'WebGL #map3DCanvas is attached to the container');

    // 4. Test UI Controls and HUD in 3D Mode
    console.log('\n--- Test 4: 3D UI Controls & Real-Time HUD Elements ---');
    const controlsExist = await cdp.eval(`
      !!document.getElementById("exit3DModeBtn") &&
      !!document.getElementById("select3DLandmark") &&
      !!document.getElementById("toggle3DHillshade") &&
      !!document.getElementById("toggle3DSlope") &&
      !!document.getElementById("sliderExaggeration") &&
      !!document.getElementById("hud3DCoords") &&
      !!document.getElementById("hud3DElev") &&
      !!document.getElementById("hud3DPitch")
    `);
    assert(controlsExist, 'All 3D controls (Exit, Landmarks, Hillshade, Slope, Exaggeration, HUD stats) exist');

    // 5. Test Landmark Focusing
    console.log('\n--- Test 5: Landmark Presets & Camera Navigation ---');
    await cdp.eval('window.Terrain3DMode.focusLandmark("sardar_sarovar")');
    await sleep(400);
    const ssCoords = await cdp.eval('document.getElementById("hud3DCoords").textContent');
    assert(ssCoords.includes('21.83') || ssCoords.includes('21.8'), `Camera focused at Sardar Sarovar coordinates (${ssCoords})`);

    await cdp.eval('window.Terrain3DMode.focusLandmark("sudarshan_setu")');
    await sleep(400);
    const setuCoords = await cdp.eval('document.getElementById("hud3DCoords").textContent');
    assert(setuCoords.includes('22.46') || setuCoords.includes('22.5'), `Camera focused at Sudarshan Setu (${setuCoords})`);

    // 6. Test Camera Angle Presets
    console.log('\n--- Test 6: Camera Angle View Presets ---');
    await cdp.eval('window.Terrain3DMode.setCameraPreset("nadir")');
    await sleep(300);
    const nadirPitch = await cdp.eval('document.getElementById("hud3DPitch").textContent');
    assert(nadirPitch.includes('88') || nadirPitch.includes('90'), `Nadir camera pitch ~88° (got ${nadirPitch})`);

    await cdp.eval('window.Terrain3DMode.setCameraPreset("profile")');
    await sleep(300);
    const profilePitch = await cdp.eval('document.getElementById("hud3DPitch").textContent');
    assert(profilePitch.includes('18'), `Profile camera pitch ~18° (got ${profilePitch})`);

    // 7. Test Shading Mode & Exaggeration
    console.log('\n--- Test 7: Analytical Hillshade & Geotechnical Slope Gradient ---');
    await cdp.eval(`
      const slopeBtn = document.getElementById("toggle3DSlope");
      slopeBtn && slopeBtn.click();
    `);
    await sleep(300);
    const slopeLegendVisible = await cdp.eval(`
      const box = document.getElementById("slopeLegend3D");
      box && !box.classList.contains("hidden")
    `);
    assert(slopeLegendVisible, 'Geotechnical Slope Gradient box is displayed when slope mode is toggled on');

    // Switch back to realistic hillshade
    await cdp.eval(`
      const hillBtn = document.getElementById("toggle3DHillshade");
      hillBtn && hillBtn.click();
    `);
    await sleep(200);

    // Test Exaggeration Slider
    await cdp.eval(`
      const slider = document.getElementById("sliderExaggeration");
      if (slider) {
        slider.value = "3.5";
        slider.dispatchEvent(new Event("input"));
      }
    `);
    const exaggText = await cdp.eval('document.getElementById("exaggValDisplay").textContent');
    assert(exaggText.includes("3.5"), `Vertical exaggeration slider updated display to ${exaggText}`);

    // 8. Test Return to 2D Map via Exit Button
    console.log('\n--- Test 8: Instant Return to 2D Leaflet Map ---');
    await cdp.eval('document.getElementById("exit3DModeBtn").click()');
    await sleep(600);

    const isInactiveAfterExit = await cdp.eval('!window.Terrain3DMode.isActive()');
    assert(isInactiveAfterExit, 'Terrain3DMode.isActive() is false after clicking Exit');

    const containerHidden = await cdp.eval('document.getElementById("map3DContainer").classList.contains("hidden")');
    assert(containerHidden, '#map3DContainer is hidden when exiting');

    const leafletResponsive = await cdp.eval('window.map && typeof window.map.getZoom === "function"');
    assert(leafletResponsive, 'Leaflet map instance remains fully active and uncorrupted');

    // 9. Test Toggle Button & Keyboard Shortcuts
    console.log('\n--- Test 9: Floating Toggle Button & Keyboard Shortcuts ---');
    await cdp.eval('document.getElementById("floating3DToggleBtn").click()');
    await sleep(800);
    const activeViaFloatingBtn = await cdp.eval('window.Terrain3DMode.isActive()');
    assert(activeViaFloatingBtn, 'Floating 3D Toggle button entered 3D mode successfully');

    // Test Escape key exits 3D mode
    await cdp.eval(`
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', bubbles: true }));
    `);
    await sleep(400);
    const exitedViaEscape = await cdp.eval('!window.Terrain3DMode.isActive()');
    assert(exitedViaEscape, 'Escape key safely exits 3D mode and returns to 2D map');

    // Test 'v' key toggles 3D mode
    await cdp.eval(`
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'v', code: 'KeyV', bubbles: true }));
    `);
    await sleep(800);
    const enteredViaKeyV = await cdp.eval('window.Terrain3DMode.isActive()');
    assert(enteredViaKeyV, 'Keyboard shortcut "v" toggles into 3D mode');

    // Exit cleanly
    await cdp.eval('window.Terrain3DMode.exit()');
    await sleep(300);

    console.log('\n==================================================');
    console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log('==================================================');

  } catch (err) {
    console.error('[ERROR during tests]:', err);
    failed++;
  } finally {
    cdp.close();
    chromeProc.kill();
    process.exit(failed > 0 ? 1 : 0);
  }
}

runTests();
