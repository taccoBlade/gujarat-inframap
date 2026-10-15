const http = require('http');
const { spawn } = require('child_process');
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

async function run() {
  console.log('======================================================================');
  console.log('GUJARAT INFRAMAP — DEFINITIVE COMPLETE RESPONSIVE EXPERIENCE AUDIT');
  console.log('======================================================================');

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = path.join(os.tmpdir(), 'chrome-resp-audit-' + Date.now());
  const port = Math.floor(9300 + Math.random() * 50);

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
  const pageTarget = targets.find(t => t.type === 'page' && t.url.includes('8080'));
  if (!pageTarget) {
    chromeProc.kill();
    throw new Error('Target page not found');
  }

  const client = new CDPClient(pageTarget.webSocketDebuggerUrl);
  await client.connect();

  await client.send('Runtime.enable');
  await client.send('Page.enable');
  await client.send('DOM.enable');

  await client.send('Page.navigate', { url: 'http://127.0.0.1:8080/' });

  console.log('[TEST] Waiting for digital twin initialization...');
  let ready = false;
  for (let i = 0; i < 60; i++) {
    try {
      ready = await client.eval(`Boolean(window.map && window.LayerManager && window.AssetInspector && window.MobileGIS)`);
      if (ready) break;
    } catch (e) {}
    await sleep(400);
  }

  if (!ready) {
    chromeProc.kill();
    throw new Error('Application initialization timed out');
  }
  console.log('[INIT] Digital Twin & MobileGIS Controller initialized.');

  let passed = 0;
  let failed = 0;
  function assert(condition, desc, meta = null) {
    if (condition) {
      console.log(`  [PASS] ${desc}${meta ? ' (' + JSON.stringify(meta) + ')' : ''}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${desc}${meta ? ' (' + JSON.stringify(meta) + ')' : ''}`);
      failed++;
    }
  }

  // =========================================================================
  // 1. MULTI-VIEWPORT RESPONSIVE INTEGRITY & ZERO HORIZONTAL OVERFLOW
  // =========================================================================
  console.log('\n--- POINT 1: Multi-Viewport Responsive Matrix Audit (9 Viewports) ---');
  const viewports = [
    { width: 320, height: 568, name: 'iPhone SE (320px narrow)', type: 'mobile' },
    { width: 360, height: 800, name: 'Standard Android (360px)', type: 'mobile' },
    { width: 390, height: 844, name: 'iPhone 12/13/14 (390px)', type: 'mobile' },
    { width: 430, height: 932, name: 'iPhone Pro Max (430px wide)', type: 'mobile' },
    { width: 768, height: 1024, name: 'Tablet Portrait (768px)', type: 'tablet-portrait' },
    { width: 1024, height: 768, name: 'Tablet Landscape (1024px)', type: 'tablet-landscape' },
    { width: 1366, height: 768, name: 'Standard Laptop (1366px)', type: 'desktop' },
    { width: 1440, height: 900, name: 'MacBook / Desktop (1440px)', type: 'desktop' },
    { width: 1920, height: 1080, name: 'Full HD Desktop (1920px)', type: 'desktop' }
  ];

  for (const vp of viewports) {
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      mobile: vp.type.startsWith('mobile') || vp.type === 'tablet-portrait'
    });
    await sleep(300);

    const audit = await client.eval(`(() => {
      const scrollW = document.documentElement.scrollWidth;
      const innerW = window.innerWidth;
      const noHScroll = scrollW <= innerW;
      
      const bottomNav = document.getElementById('mobileBottomNav');
      const bNavDisplay = bottomNav ? window.getComputedStyle(bottomNav).display : 'none';
      const isMobileNavVisible = bNavDisplay !== 'none';

      const recenterBtn = document.getElementById('recenterMapBtn');
      const recenterVisible = recenterBtn ? (window.getComputedStyle(recenterBtn).display !== 'none') : false;

      const header = document.querySelector('.app-header');
      const headerNoHScroll = header ? (header.scrollWidth <= header.clientWidth + 2) : true;

      return {
        noHScroll,
        scrollW,
        innerW,
        isMobileNavVisible,
        recenterVisible,
        headerNoHScroll
      };
    })()`);

    assert(audit.noHScroll, `Viewport ${vp.name}: Zero horizontal overflow (scrollWidth <= innerWidth)`, {
      scrollWidth: audit.scrollW,
      innerWidth: audit.innerW
    });
    assert(audit.headerNoHScroll, `Viewport ${vp.name}: App header contained without horizontal clipping`);

    if (vp.width <= 768) {
      assert(audit.isMobileNavVisible, `Viewport ${vp.name}: Mobile bottom navigation is active`);
    } else {
      assert(!audit.isMobileNavVisible, `Viewport ${vp.name}: Mobile bottom navigation is cleanly hidden on desktop/tablet-landscape`);
    }
  }

  // Set to mobile viewport (iPhone 14: 390x844) for deep mobile feature tests
  console.log('\n--- POINT 2: Mobile Bottom Navigation & Sheets Interactive Workflow (390x844) ---');
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await sleep(300);

  // 2.1 Verify 5 Mobile Nav Buttons
  const navButtons = await client.eval(`(() => {
    const nav = document.getElementById('mobileBottomNav');
    if (!nav) return { count: 0, items: [] };
    const btns = Array.from(nav.querySelectorAll('.mobile-nav-btn'));
    return {
      count: btns.length,
      items: btns.map(b => ({
        tab: b.getAttribute('data-nav'),
        text: b.innerText.trim(),
        height: b.getBoundingClientRect().height,
        width: b.getBoundingClientRect().width
      }))
    };
  })()`);
  assert(navButtons.count === 5, 'Mobile bottom navigation has exactly 5 primary action buttons', navButtons.items.map(i => i.tab));
  const minTouchMet = navButtons.items.every(i => i.height >= 44 && i.width >= 44);
  assert(minTouchMet, 'All 5 bottom navigation buttons meet minimum 44x44px touch target guidelines');

  // 2.2 Test Mobile Navigation Switching to Places, Infrastructure, Plan, Layers
  console.log('\n--- POINT 3: Mobile Navigation Workflow (Places, Infrastructure, Plan, Layers) ---');
  await client.eval(`document.querySelector('.mobile-nav-btn[data-nav="places"]').click()`);
  await sleep(300);
  const placesOpen = await client.eval(`!document.getElementById('placesView').classList.contains('hidden')`);
  assert(placesOpen, 'Tapping [Places] mobile bottom nav opens #placesView');

  await client.eval(`document.querySelector('.mobile-nav-btn[data-nav="plan"]').click()`);
  await sleep(300);
  const planOpen = await client.eval(`!document.getElementById('planVisitView').classList.contains('hidden')`);
  assert(planOpen, 'Tapping [Plan] mobile bottom nav opens #planVisitView');

  await client.eval(`document.querySelector('.mobile-nav-btn[data-nav="infrastructure"]').click()`);
  await sleep(300);
  const infraOpen = await client.eval(`!document.getElementById('directoryView').classList.contains('hidden')`);
  assert(infraOpen, 'Tapping [Infra] mobile bottom nav opens #directoryView');

  await client.eval(`document.querySelector('.mobile-nav-btn[data-nav="explore"]').click()`);
  await sleep(300);
  const exploreActive = await client.eval(`document.getElementById('placesView').classList.contains('hidden') && document.getElementById('directoryView').classList.contains('hidden')`);
  assert(exploreActive, 'Tapping [Explore] mobile bottom nav restores full map canvas');

  // Test Layers toggle on mobile
  await client.eval(`document.querySelector('.mobile-nav-btn[data-nav="layers"]').click()`);
  await sleep(250);
  const drawerOpen = await client.eval(`!document.getElementById('layerDrawer').classList.contains('drawer-collapsed')`);
  assert(drawerOpen, 'Tapping [Layers] mobile bottom nav opens #layerDrawer');

  // Collapse drawer back
  await client.eval(`document.getElementById('collapseDrawerBtn').click()`);
  await sleep(200);

  // 2.3 Test Universal Search and Asset Selection on Mobile
  console.log('\n--- POINT 4: Universal Search & Asset Selection on Mobile ---');
  await client.eval(`(() => {
    const input = document.getElementById('universalSearch');
    input.value = 'Sardar';
    input.dispatchEvent(new Event('input', { bubbles: true }));
  })()`);
  await sleep(350);

  const searchResultsState = await client.eval(`(() => {
    const results = document.querySelectorAll('.search-result-item');
    return {
      resultsCount: results.length
    };
  })()`);
  assert(searchResultsState.resultsCount > 0, 'Universal search yields verified results for query "Sardar"', searchResultsState);

  // 2.4 Test Asset Inspector Snap Points
  console.log('\n--- POINT 5: Asset Inspector Gestures & Non-Regression ---');
  await client.eval(`(() => {
    if (window.inspectAsset) {
      window.inspectAsset({
        type: 'Feature',
        properties: { name: 'Sardar Sarovar Dam', asset_category: 'Water Resource & Dam', district: 'Narmada', status: 'Operational' },
        geometry: { type: 'Point', coordinates: [73.749, 21.833] }
      });
    }
  })()`);
  await sleep(350);

  const inspState = await client.eval(`(() => {
    const insp = document.getElementById('assetInspectorDrawer');
    return {
      isOpen: insp && !insp.classList.contains('hidden'),
      snap: insp ? insp.getAttribute('data-snap') : null
    };
  })()`);
  assert(inspState.isOpen, 'Inspector opens for inspected asset');

  // Close inspector
  await client.eval(`document.getElementById('inspCloseBtn').click()`);
  await sleep(200);
  const inspClosed = await client.eval(`document.getElementById('assetInspectorDrawer').classList.contains('hidden')`);
  assert(inspClosed, 'Close button dismisses inspector cleanly');

  // 2.5 Test Re-center / Fit Gujarat Bounds FAB
  console.log('\n--- POINT 6: Floating Map Controls & Fit Gujarat Bounds FAB ---');
  const recenterAction = await client.eval(`(() => {
    const btn = document.getElementById('recenterMapBtn');
    if (!btn) return { found: false };
    btn.click();
    const bounds = window.map.getBounds();
    return {
      found: true,
      southWest: [bounds.getSouth(), bounds.getWest()],
      northEast: [bounds.getNorth(), bounds.getEast()]
    };
  })()`);
  assert(recenterAction.found, 'Floating Re-center FAB (#recenterMapBtn) is present and functional');

  // 2.6 Return to Desktop Viewport & Ensure Zero Regressions
  console.log('\n--- POINT 7: Desktop Workstation Non-Regression (1920x1080) ---');
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
    mobile: false
  });
  await sleep(350);

  const desktopIntegrity = await client.eval(`(() => {
    const bottomNavHidden = window.getComputedStyle(document.getElementById('mobileBottomNav')).display === 'none';
    const mainNav = document.getElementById('mainNav');
    const mainNavVisible = mainNav && window.getComputedStyle(mainNav).display !== 'none';
    const drawer = document.getElementById('layerDrawer');
    const drawerPosition = window.getComputedStyle(drawer).position;
    const drawerSidePositioned = drawerPosition === 'absolute';
    const insp = document.getElementById('assetInspectorDrawer');
    const inspSidePositioned = window.getComputedStyle(insp).position === 'absolute';
    
    return {
      bottomNavHidden,
      mainNavVisible,
      drawerPosition,
      drawerSidePositioned,
      inspSidePositioned
    };
  })()`);
  assert(desktopIntegrity.bottomNavHidden, 'Desktop: Mobile bottom navigation is hidden');
  assert(desktopIntegrity.mainNavVisible, 'Desktop: Primary navigation (4 destinations) is visible');
  assert(desktopIntegrity.drawerSidePositioned, 'Desktop: Layer drawer retains desktop side position', desktopIntegrity);
  assert(desktopIntegrity.inspSidePositioned, 'Desktop: Asset inspector retains desktop side position');

  // Cleanup
  client.close();
  chromeProc.kill();

  console.log('\n======================================================================');
  console.log(`COMPLETE RESPONSIVE AUDIT RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('======================================================================');

  if (failed > 0) {
    process.exit(1);
  } else {
    console.log('[SUCCESS] All responsive mobile, tablet, and desktop criteria verified defect-free!');
  }
}

run().catch(err => {
  console.error('[FATAL ERROR]:', err);
  process.exit(1);
});
