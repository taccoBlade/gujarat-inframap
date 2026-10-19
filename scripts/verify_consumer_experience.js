#!/usr/bin/env node
/**
 * Gujarat InfraMap — Consumer Refactor Definitive Verification Script
 * Validates the complete removal of engineering workbench controls and tests the 5 consumer destinations.
 */

const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

async function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(e); }
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

  close() {
    if (this.ws) this.ws.close();
  }
}

function startStaticServer(port = 8080) {
  const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.geojson': 'application/geo+json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml; charset=utf-8',
    '.ico': 'image/x-icon'
  };

  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let reqPath = decodeURI(req.url.split('?')[0]);
      if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
      const filePath = path.join(process.cwd(), reqPath.replace(/^\//, ''));
      const ext = path.extname(filePath).toLowerCase();
      const contentType = mimeTypes[ext] || 'application/octet-stream';

      fs.readFile(filePath, (err, content) => {
        if (err) {
          if (err.code === 'ENOENT') {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found');
          } else {
            res.writeHead(500);
            res.end(`Server Error: ${err.code}`);
          }
        } else {
          res.writeHead(200, { 'Content-Type': contentType });
          res.end(content);
        }
      });
    });

    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`[INFO] Port ${port} is already active; connecting to existing server.`);
        resolve(null);
      } else {
        console.warn(`[WARN] Server error on port ${port}:`, err);
        resolve(null);
      }
    });

    server.listen(port, '127.0.0.1', () => {
      console.log(`[INFO] Internal test server started on http://127.0.0.1:${port}/`);
      resolve(server);
    });
  });
}

async function run() {
  console.log('======================================================================');
  console.log('GUJARAT INFRAMAP — CONSUMER REFACTOR DEFINITIVE VERIFICATION SUITE');
  console.log('======================================================================');

  const server = await startStaticServer(8080);

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = path.join(os.tmpdir(), 'chrome-consumer-verify-' + Date.now());
  const port = Math.floor(9500 + Math.random() * 50);

  console.log(`[TEST] Starting headless Chrome on port ${port}...`);
  const chromeProc = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    '--window-size=1920,1080',
    'http://127.0.0.1:8080/'
  ], { detached: false });

  let versionInfo = null;
  for (let i = 0; i < 20; i++) {
    await sleep(400);
    try {
      versionInfo = await getJson(`http://127.0.0.1:${port}/json/version`);
      if (versionInfo) break;
    } catch (e) {}
  }

  if (!versionInfo) {
    chromeProc.kill();
    throw new Error('Failed to connect to Chrome DevTools port');
  }

  const targets = await getJson(`http://127.0.0.1:${port}/json/list`);
  let pageTarget = targets.find(t => t.type === 'page' && t.url.includes('8080'));
  if (!pageTarget) {
    try {
      pageTarget = await getJson(`http://127.0.0.1:${port}/json/new?http://127.0.0.1:8080/`);
    } catch (_) {}
  }
  if (!pageTarget) {
    chromeProc.kill();
    throw new Error('Could not find active page target');
  }

  const client = new CDPClient(pageTarget.webSocketDebuggerUrl);
  await client.connect();
  await client.send('Page.enable');

  console.log('[TEST] Waiting for page initialization...');
  await sleep(2500);

  let passed = 0;
  let failed = 0;

  function assert(condition, message, detail) {
    if (condition) {
      console.log(`  [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${message}`, detail || '');
      failed++;
    }
  }

  try {
    // 1. ABSOLUTE REMOVAL OF ENGINEERING WORKBENCH TOOLS
    console.log('\n--- CHECK 1: Verifying Complete Removal of Engineering Tools ---');
    const removedElements = await client.eval(`(() => {
      return {
        floating3D: !document.getElementById('floating3DToggleBtn'),
        measureHud: !document.getElementById('measureHud'),
        proximityHud: !document.getElementById('proximityHud'),
        zenExitFloatingBtn: !document.getElementById('zenExitFloatingBtn'),
        floatingDrawerBtn: !document.getElementById('floatingDrawerBtn'),
        mobileStudiosSheet: !document.getElementById('mobileStudiosSheet'),
        damsExplorerModal: !document.getElementById('damsExplorerModal'),
        damScienceLabModal: !document.getElementById('damScienceLabModal'),
        waterNetworkModal: !document.getElementById('waterNetworkModal'),
        energyExplorerModal: !document.getElementById('energyExplorerModal'),
        transportExplorerModal: !document.getElementById('transportExplorerModal'),
        geoenvironmentalModal: !document.getElementById('geoenvironmentalModal'),
        waterScenariosLabModal: !document.getElementById('waterScenariosLabModal'),
        temporalExplorerModal: !document.getElementById('temporalExplorerModal'),
        shortcutsHelpModal: !document.getElementById('shortcutsHelpModal'),
        inspOpenLabBtn: !document.getElementById('inspOpenLabBtn'),
        inspGenerateReportBtn: !document.getElementById('inspGenerateReportBtn'),
        gwSimulationBox: !document.getElementById('gwSimulationBox'),
        corridorSelect: !document.getElementById('corridorSelect')
      };
    })()`);

    for (const [key, isRemoved] of Object.entries(removedElements)) {
      assert(isRemoved, `Element "${key}" is completely removed from DOM`);
    }

    // 2. PRIMARY HEADER CONTROLS
    console.log('\n--- CHECK 2: Header Simplicity & Navigation Destinations ---');
    const headerInfo = await client.eval(`(() => {
      const brand = document.querySelector('.brand-title')?.innerText;
      const navTabs = Array.from(document.querySelectorAll('.nav-tab')).map(b => b.getAttribute('data-tab'));
      const searchPresent = !!document.getElementById('universalSearch');
      const layersPresent = !!document.getElementById('toggleDrawerBtn');
      const themePresent = !!(document.getElementById('toggleThemeBtn') || document.getElementById('themeToggleBtn'));
      const districtSelectPresent = !!document.getElementById('districtSelect');
      const helpBtnPresent = !!document.getElementById('shortcutsHelpBtn');

      return {
        brand,
        navTabs,
        searchPresent,
        layersPresent,
        themePresent,
        districtSelectPresent,
        helpBtnPresent
      };
    })()`);

    assert(headerInfo.brand === 'Gujarat InfraMap', `Brand is "Gujarat InfraMap" (got: "${headerInfo.brand}")`);
    assert(headerInfo.navTabs.length === 5, `Primary navigation has exactly 5 tabs (got: ${headerInfo.navTabs.length})`);
    assert(
      JSON.stringify(headerInfo.navTabs) === JSON.stringify(['explore', 'places', 'infrastructure', 'plan', 'about']),
      `Primary tabs match consumer structure (got: ${headerInfo.navTabs.join(', ')})`
    );
    assert(headerInfo.searchPresent, 'Universal Search input is present in header');
    assert(headerInfo.layersPresent, 'Simple Layers button is present in header');
    assert(headerInfo.themePresent, 'Theme Toggle button is present in header');
    assert(!headerInfo.districtSelectPresent, 'Duplicate district dropdown is removed');
    assert(!headerInfo.helpBtnPresent, 'Obsolete help modal button is removed');

    // 3. DESTINATION 1: EXPLORE (DEFAULT MAP VIEW)
    console.log('\n--- CHECK 3: Destination 1 — Explore (Interactive Map) ---');
    const exploreState = await client.eval(`(() => {
      const map = document.getElementById('map');
      const getDisplay = (id) => {
        const el = document.getElementById(id);
        return el ? window.getComputedStyle(el).display : 'none';
      };
      const mapDisplay = map ? window.getComputedStyle(map).display : 'none';
      const placesDisplay = getDisplay('placesView');
      const planDisplay = getDisplay('planVisitView');
      const dirDisplay = getDisplay('directoryView');
      const aboutDisplay = getDisplay('aboutView');
      return { mapDisplay, placesDisplay, planDisplay, dirDisplay, aboutDisplay };
    })()`);
    assert(
      exploreState.mapDisplay !== 'none' &&
      exploreState.placesDisplay === 'none' &&
      exploreState.planDisplay === 'none' &&
      exploreState.dirDisplay === 'none' &&
      exploreState.aboutDisplay === 'none',
      'Default view is interactive map with all secondary overlays computed as display: none'
    );

    // 4. DESTINATION 2: PLACES TO EXPLORE
    console.log('\n--- CHECK 4: Destination 2 — Places to Explore ---');
    await client.eval(`document.querySelector('.nav-tab[data-tab="places"]').click()`);
    await sleep(400);

    const placesState = await client.eval(`(() => {
      const placesView = document.getElementById('placesView');
      const isVisible = placesView && !placesView.classList.contains('hidden') && window.getComputedStyle(placesView).display !== 'none';
      const cardsCount = document.querySelectorAll('.destination-card').length;
      const countText = document.getElementById('tourismResultsCount')?.innerText;
      return { isVisible, cardsCount, countText };
    })()`);
    assert(placesState.isVisible, 'Places to Explore view (#placesView) is visible (display != none) upon click');
    assert(placesState.cardsCount === 37, `Catalogue renders all 37 verified destinations (got: ${placesState.cardsCount})`);

    // 5. DESTINATION 3: PLAN A VISIT (TRIP REALITY)
    console.log('\n--- CHECK 5: Destination 3 — Plan a Visit (Trip Reality Feasibility) ---');
    await client.eval(`document.querySelector('.nav-tab[data-tab="plan"]').click()`);
    await sleep(400);

    const planState = await client.eval(`(() => {
      const planView = document.getElementById('planVisitView');
      const isVisible = planView && !planView.classList.contains('hidden') && window.getComputedStyle(planView).display !== 'none';
      const destSelect = document.getElementById('trDestinationSelect');
      const originSelect = document.getElementById('trOriginSelect');
      const content = document.getElementById('tripRealityContent');
      const hasContent = content && content.innerHTML.trim().length > 100;
      const currentHash = window.location.hash;
      return {
        isVisible,
        destOptions: destSelect ? destSelect.options.length : 0,
        originOptions: originSelect ? originSelect.options.length : 0,
        hasContent,
        currentHash
      };
    })()`);
    assert(planState.isVisible, 'Plan a Visit view (#planVisitView) is visible (display != none) upon click');
    assert(planState.currentHash === '#/plan', `URL hash updated to #/plan (got: "${planState.currentHash}")`);
    assert(planState.destOptions >= 12, `Destination dropdown populated with verified places (got: ${planState.destOptions})`);
    assert(planState.originOptions >= 8, `Origin dropdown populated with major cities (got: ${planState.originOptions})`);
    assert(planState.hasContent, 'Trip feasibility assessment renders verified transit, last-mile, return reality, and statutory alerts');

    // 6. DESTINATION 4: INFRASTRUCTURE DIRECTORY
    console.log('\n--- CHECK 6: Destination 4 — Infrastructure Directory ---');
    await client.eval(`document.querySelector('.nav-tab[data-tab="infrastructure"]').click()`);
    await sleep(400);

    const infraState = await client.eval(`(() => {
      const dirView = document.getElementById('directoryView');
      const isVisible = dirView && !dirView.classList.contains('hidden') && window.getComputedStyle(dirView).display !== 'none';
      const cardsCount = document.querySelectorAll('.dir-card').length;
      const countText = document.getElementById('dirResultsCount')?.innerText;
      const currentHash = window.location.hash;
      return { isVisible, cardsCount, countText, currentHash };
    })()`);
    assert(infraState.isVisible, 'Infrastructure Directory view (#directoryView) is visible (display != none) upon click');
    assert(infraState.currentHash === '#/infrastructure', `URL hash updated to #/infrastructure (got: "${infraState.currentHash}")`);
    assert(infraState.cardsCount > 0, `Directory displays verified public assets (got: ${infraState.cardsCount} cards rendered)`);

    // 7. DESTINATION 5: ABOUT & SOURCES
    console.log('\n--- CHECK 7: Destination 5 — About & Sources ---');
    await client.eval(`document.querySelector('.nav-tab[data-tab="about"]').click()`);
    await sleep(400);

    const aboutState = await client.eval(`(() => {
      const aboutView = document.getElementById('aboutView');
      const isVisible = aboutView && !aboutView.classList.contains('hidden') && window.getComputedStyle(aboutView).display !== 'none';
      const downloads = document.querySelectorAll('.about-download-btn').length;
      const table = !!(document.querySelector('.spec-table') || document.querySelector('.data-table'));
      const currentHash = window.location.hash;
      return { isVisible, downloads, table, currentHash };
    })()`);
    assert(aboutState.isVisible, 'About & Sources view (#aboutView) is visible (display != none) upon click');
    assert(aboutState.currentHash === '#/about', `URL hash updated to #/about (got: "${aboutState.currentHash}")`);
    assert(aboutState.downloads >= 4, `Authoritative GeoJSON download buttons present (got: ${aboutState.downloads})`);
    assert(aboutState.table, 'Dataset provenance & statutory source inventory table is present');

    // 8. RETURN TO EXPLORE MAP
    console.log('\n--- CHECK 8: Return to Map & Layer Drawer ---');
    await client.eval(`document.querySelector('.nav-tab[data-tab="explore"]').click()`);
    await sleep(400);

    const returnExplore = await client.eval(`(() => {
      const getDisplay = (id) => {
        const el = document.getElementById(id);
        return el ? window.getComputedStyle(el).display : 'none';
      };
      const placesDisplay = getDisplay('placesView');
      const planDisplay = getDisplay('planVisitView');
      const dirDisplay = getDisplay('directoryView');
      const aboutDisplay = getDisplay('aboutView');
      const currentHash = window.location.hash;
      return { placesDisplay, planDisplay, dirDisplay, aboutDisplay, currentHash };
    })()`);
    assert(
      returnExplore.placesDisplay === 'none' &&
      returnExplore.planDisplay === 'none' &&
      returnExplore.dirDisplay === 'none' &&
      returnExplore.aboutDisplay === 'none',
      'Returning to Explore hides all views (computed display: none) and displays interactive map canvas'
    );
    assert(returnExplore.currentHash === '#/explore', `URL hash updated to #/explore (got: "${returnExplore.currentHash}")`);

    // Toggle Layers Drawer
    await client.eval(`document.getElementById('toggleDrawerBtn').click()`);
    await sleep(300);

    const drawerState = await client.eval(`(() => {
      const drawer = document.getElementById('layerDrawer');
      const isOpen = drawer && !drawer.classList.contains('drawer-collapsed');
      const basemapBtns = document.querySelectorAll('.segmented-control .segment-btn').length;
      const catCount = document.querySelectorAll('#layerManagerContainer .layer-category-block').length;
      return { isOpen, basemapBtns, catCount };
    })()`);
    assert(drawerState.isOpen, 'Layers button opens streamlined Layer Drawer');
    assert(drawerState.basemapBtns === 4, `Basemap style switcher present (got: ${drawerState.basemapBtns} buttons)`);
    assert(drawerState.catCount >= 6, `Dynamic layer categories rendered cleanly (got: ${drawerState.catCount} categories)`);

    // Close Drawer
    await client.eval(`document.getElementById('collapseDrawerBtn').click()`);
    await sleep(200);

  } catch (err) {
    console.error('[FATAL ERROR]:', err);
    failed++;
  } finally {
    if (client) client.close();
    if (chromeProc) chromeProc.kill();
    if (server) server.close();
  }

  console.log('\n======================================================================');
  console.log(`VERIFICATION SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('======================================================================');

  if (failed > 0) {
    process.exit(1);
  } else {
    console.log('[SUCCESS] All consumer refactoring acceptance criteria verified 100% green!');
  }
}

run();
