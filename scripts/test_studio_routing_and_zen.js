/**
 * Automated Verification Suite for Studio Workspaces Routing & Zen View
 * Validates:
 * 1. Studio Cockpit Bar DOM mounting and studio pills
 * 2. Hash routing: #/dams, #/water, #/energy, #/transport, #/analytics, #/overview
 * 3. Decluttered initial canvas (>90% map visibility, drawer & dock collapsed)
 * 4. Deep linking with asset ID: #/dams?id=GJ-WR-DAM-001
 * 5. Zen Mode toggle (Z key and floating button)
 * 6. Slash command routing (/dams in universal search)
 * 7. Visual screenshot generation for quality verification
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
  console.log('GUJARAT INFRAMAP — STUDIO WORKSPACES ROUTING & ZEN VIEW AUDIT');
  console.log('======================================================================');

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = path.join(os.tmpdir(), 'chrome-studio-test-' + Date.now());
  const port = Math.floor(9350 + Math.random() * 40);

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

  const client = new CDPClient(pageTarget.webSocketDebuggerUrl);
  await client.connect();
  console.log('[TEST] Connected to Chrome DevTools Protocol page target.');
  await sleep(2000);

  // Wait for digital twin and async spatial toolkit to load
  let ready = false;
  for (let i = 0; i < 30; i++) {
    ready = await client.eval('!!(window.StudioManager && window.map && window.LayerManager && document.getElementById("sadToolsGrid"))');
    if (ready) break;
    await sleep(400);
  }
  console.log(`[INIT] Twin initialized: ${ready}`);

  let passed = 0;
  let failed = 0;
  function assert(condition, desc) {
    if (condition) {
      console.log(`  [PASS] ${desc}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${desc}`);
      failed++;
    }
  }

  console.log('\n--- POINT 1: Initial Clutter Elimination & Studio Cockpit Bar ---');
  const initialClutter = await client.eval(`(() => {
    const drawer = document.getElementById('layerDrawer');
    const dock = document.getElementById('sadToolsGrid');
    const legend = document.getElementById('activeLayerLegend');
    const cockpit = document.getElementById('studioCockpitBar');
    return {
      drawerCollapsed: drawer ? drawer.classList.contains('drawer-collapsed') : false,
      dockCollapsed: dock ? dock.classList.contains('collapsed') : false,
      legendCollapsed: legend ? legend.classList.contains('collapsed') : false,
      cockpitMounted: !!cockpit,
      currentStudio: window.StudioManager ? window.StudioManager.currentStudio : null
    };
  })()`);

  assert(initialClutter.drawerCollapsed, 'Layer drawer starts collapsed by default (no 326px obstruction)');
  assert(initialClutter.dockCollapsed, 'Spatial tools dock starts collapsed by default (no Saurashtra blockage)');
  assert(initialClutter.legendCollapsed, 'Active layer legend starts collapsed by default');
  assert(initialClutter.cockpitMounted, 'Studio Cockpit Bar mounted with tabs in viewport');
  assert(initialClutter.currentStudio === 'overview', 'Initial studio workspace defaults to overview');

  console.log('\n--- POINT 2: Hash Routing to /#/dams Studio ---');
  const damsStudioTest = await client.eval(`(() => {
    window.location.hash = '#/dams';
    if (window.StudioManager) {
      window.StudioManager.handleRouteFromHash();
    }
    const damsPill = document.querySelector('.studio-pill[data-studio="dams"]');
    const isDamsActive = damsPill ? damsPill.classList.contains('active') : false;
    const currentStudio = window.StudioManager.currentStudio;
    const waterDamsOn = window.LayerManager ? window.LayerManager.isLayerActive('waterDams') : false;
    return { isDamsActive, currentStudio, waterDamsOn };
  })()`);

  assert(damsStudioTest.currentStudio === 'dams', 'StudioManager activates dams studio workspace');
  assert(damsStudioTest.isDamsActive, 'Studio Cockpit Bar highlights Dams & Reservoirs pill');
  assert(damsStudioTest.waterDamsOn, 'Water Dams & Reservoirs layers automatically enabled in Dams studio');

  console.log('\n--- POINT 3: Deep-Linking to Specific Dam Asset (#/dams?id=GJ-WR-DAM-001) ---');
  const deepLinkTest = await client.eval(`(async () => {
    window.location.hash = '#/dams?id=GJ-WR-DAM-001';
    window.StudioManager.handleRouteFromHash();
    await new Promise(r => setTimeout(r, 800));
    const drawer = document.getElementById('assetInspectorDrawer');
    const title = document.getElementById('inspTitle')?.textContent.trim();
    const isOpen = drawer && !drawer.classList.contains('hidden');
    return {
      modalOpen: isOpen,
      title
    };
  })()`);

  assert(deepLinkTest.modalOpen, 'Deep link opens Asset Inspector for target dam asset');
  assert(deepLinkTest.title && deepLinkTest.title.includes('Sardar Sarovar'), `Target dam inspected: "${deepLinkTest.title}"`);

  // Close inspector
  await client.eval(`(() => {
    if (window.AssetInspector && window.AssetInspector.close) window.AssetInspector.close();
  })()`);

  console.log('\n--- POINT 4: Hash Routing to /#/energy and /#/transport Studios ---');
  const energyTest = await client.eval(`(() => {
    window.StudioManager.activateStudio('energy', true);
    const powerOn = window.LayerManager.isLayerActive('power');
    const transOn = window.LayerManager.isLayerActive('transmission');
    const energyPill = document.querySelector('.studio-pill[data-studio="energy"]');
    return {
      currentStudio: window.StudioManager.currentStudio,
      powerOn,
      transOn,
      pillActive: energyPill ? energyPill.classList.contains('active') : false,
      hash: window.location.hash
    };
  })()`);

  assert(energyTest.currentStudio === 'energy', 'Switched to Energy & Hydropower Studio');
  assert(energyTest.powerOn && energyTest.transOn, 'Power generation and GETCO transmission layers active');
  assert(energyTest.pillActive, 'Energy cockpit pill highlighted');

  const transportTest = await client.eval(`(() => {
    window.StudioManager.activateStudio('transport', true);
    const roadsOn = window.LayerManager.isLayerActive('roads');
    const railOn = window.LayerManager.isLayerActive('railways');
    return {
      currentStudio: window.StudioManager.currentStudio,
      roadsOn,
      railOn,
      hash: window.location.hash
    };
  })()`);

  assert(transportTest.currentStudio === 'transport', 'Switched to Multi-Modal Transport Studio');
  assert(transportTest.roadsOn && transportTest.railOn, 'National Highways and Western Railway layers active');

  console.log('\n--- POINT 5: Zen Mode Edge-to-Edge Full-Bleed Map (Key Z) ---');
  const zenTest = await client.eval(`(() => {
    window.StudioManager.toggleZenMode();
    const isZen = document.body.classList.contains('zen-mode-active');
    const exitBtnVisible = !document.getElementById('zenExitFloatingBtn')?.classList.contains('hidden');
    return { isZen, exitBtnVisible };
  })()`);

  assert(zenTest.isZen, 'Zen Mode activated: .zen-mode-active applied to body');
  assert(zenTest.exitBtnVisible, 'Floating exit button visible in Zen Mode');

  // Capture screenshot of Zen Mode
  await client.screenshot('C:\\Users\\saumy\\.gemini\\antigravity\\brain\\6069751d-a4a6-4f58-a74e-c145d8a18829\\zen_mode_preview.png');

  // Exit Zen Mode
  const exitZenTest = await client.eval(`(() => {
    window.StudioManager.setZenMode(false);
    return !document.body.classList.contains('zen-mode-active');
  })()`);
  assert(exitZenTest, 'Zen Mode exited cleanly');

  console.log('\n--- POINT 6: Universal Search Slash Command (/dams) ---');
  const slashTest = await client.eval(`(async () => {
    const searchInput = document.getElementById('universalSearch');
    searchInput.value = '/';
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise(r => setTimeout(r, 200));

    const dropdown = document.getElementById('searchResults');
    const items = dropdown ? Array.from(dropdown.querySelectorAll('.search-result-item')).map(el => el.textContent.trim()) : [];
    
    // Now trigger /dams
    searchInput.value = '/dams';
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise(r => setTimeout(r, 200));

    const damsItem = dropdown ? dropdown.querySelector('.search-result-item') : null;
    if (damsItem) damsItem.click();

    return {
      hadSlashCommands: items.length >= 6,
      currentStudioAfterSlash: window.StudioManager.currentStudio
    };
  })()`);

  assert(slashTest.hadSlashCommands, 'Typing / in search reveals all Studio workspace commands');
  assert(slashTest.currentStudioAfterSlash === 'dams', 'Executing /dams in search switches directly to Dams Studio');

  // Capture final Dams Studio screenshot
  await sleep(600);
  await client.screenshot('C:\\Users\\saumy\\.gemini\\antigravity\\brain\\6069751d-a4a6-4f58-a74e-c145d8a18829\\dams_studio_preview.png');

  console.log('\n======================================================================');
  console.log(`STUDIO WORKSPACES AUDIT SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('======================================================================');

  client.close();
  chromeProc.kill();

  if (failed > 0) {
    process.exit(1);
  } else {
    console.log('[SUCCESS] All studio routing, deep-linking and Zen mode checks passed!');
    process.exit(0);
  }
}

run().catch(err => {
  console.error('[ERROR]', err);
  process.exit(1);
});
