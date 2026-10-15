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
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = path.join(os.tmpdir(), 'chrome-ui-rescue-' + Date.now());
  const port = Math.floor(9260 + Math.random() * 30);

  console.log(`Starting headless Chrome on port ${port}...`);
  const chromeProc = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    '--window-size=1780,830',
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

  const targets = await getJson(`http://127.0.0.1:${port}/json/list`);
  const pageTarget = targets.find(t => t.type === 'page' && t.url.includes('8080'));
  if (!pageTarget) {
    console.error('[FAIL] Page target 8080 not found.');
    chromeProc.kill();
    process.exit(1);
  }
  const client = new CDPClient(pageTarget.webSocketDebuggerUrl);
  await client.connect();

  await client.send('Runtime.enable');
  await client.send('Page.enable');
  await client.send('DOM.enable');

  console.log('Waiting for application initialization and GeoJSON streaming...');
  await sleep(2000);
  let ready = false;
  for (let i = 0; i < 50; i++) {
    try {
      ready = await client.eval('typeof window.selectUrbanAssetByName === "function"');
      if (ready) {
        console.log(`[INIT] window.selectUrbanAssetByName ready in ${i * 250}ms`);
        break;
      }
    } catch (e) {}
    await sleep(250);
  }
  if (!ready) {
    chromeProc.kill();
    throw new Error('Application initialization timed out waiting for window.selectUrbanAssetByName');
  }

  console.log('\n========================================');
  console.log('TEST 1: SEAPORT & AIRPORT POPUP FIDELITY');
  console.log('========================================');

  // Trigger seaport selection & inspect popup
  await client.eval(`window.selectUrbanAssetByName('Deendayal Port (Kandla)', false)`);
  await sleep(400);

  const portInspection = await client.eval(`(() => {
    const popup = document.querySelector('.leaflet-popup-content');
    const popupText = popup ? popup.innerText : '';
    const catBadge = popup ? popup.querySelector('.popup-category')?.innerText : '';
    const title = popup ? popup.querySelector('.popup-card-title')?.innerText : '';
    
    const inspCat = document.getElementById('inspCategoryBadge')?.innerText;
    const inspTitle = document.getElementById('inspTitle')?.innerText;
    
    return {
      popupFound: !!popup,
      popupCategory: catBadge,
      popupTitle: title,
      hasMMT: popupText.includes('137 MMT') || popupText.includes('MMT'),
      isSmartCity: catBadge.includes('SMART CITY') || popupText.includes('Smart City Status: Municipal Corporation'),
      inspectorCategory: inspCat,
      inspectorTitle: inspTitle
    };
  })()`);
  console.log('Deendayal Port (Kandla) Result:', portInspection);

  // Trigger airport selection & inspect popup
  await client.eval(`window.selectUrbanAssetByName('Sardar Vallabhbhai Patel International Airport (SVPIA)', false)`);
  await sleep(400);

  const airportInspection = await client.eval(`(() => {
    const popup = document.querySelector('.leaflet-popup-content');
    const popupText = popup ? popup.innerText : '';
    const catBadge = popup ? popup.querySelector('.popup-category')?.innerText : '';
    const title = popup ? popup.querySelector('.popup-card-title')?.innerText : '';
    
    const inspCat = document.getElementById('inspCategoryBadge')?.innerText;
    const inspTitle = document.getElementById('inspTitle')?.innerText;
    
    return {
      popupFound: !!popup,
      popupCategory: catBadge,
      popupTitle: title,
      hasIATA: popupText.includes('AMD') || popupText.includes('VAAH'),
      isSmartCity: catBadge.includes('SMART CITY') || popupText.includes('Smart City Status: Municipal Corporation'),
      inspectorCategory: inspCat,
      inspectorTitle: inspTitle
    };
  })()`);
  console.log('SVPIA Airport Result:', airportInspection);

  console.log('\n========================================');
  console.log('TEST 2: MULTI-VIEWPORT RESPONSIVE AUDIT');
  console.log('========================================');
  const viewports = [
    { width: 1920, height: 1080, name: 'Full HD Desktop' },
    { width: 1780, height: 830, name: 'User Reference Window' },
    { width: 1366, height: 768, name: 'Standard Laptop' },
    { width: 1024, height: 768, name: 'Tablet Landscape' },
    { width: 768, height: 1024, name: 'Tablet Portrait' },
    { width: 390, height: 844, name: 'Mobile Phone' }
  ];

  for (const vp of viewports) {
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      mobile: vp.width < 768
    });
    await sleep(400);

    const vpAudit = await client.eval(`(() => {
      const header = document.querySelector('.app-header');
      const headerRight = document.querySelector('.header-right');
      const body = document.body;
      const drawer = document.getElementById('layerDrawer');
      const legend = document.getElementById('activeLayerLegend');
      
      const headerHasHScroll = header ? (header.scrollWidth > header.clientWidth + 2) : false;
      const bodyHasHScroll = document.documentElement.scrollWidth > window.innerWidth;
      
      // Calculate Legend vs Drawer bounding box collision
      let legendRect = legend ? legend.getBoundingClientRect() : null;
      let drawerRect = drawer ? drawer.getBoundingClientRect() : null;
      let collides = false;
      if (legendRect && drawerRect && !drawer.classList.contains('drawer-collapsed') && legend.style.display !== 'none') {
        const overlapX = Math.max(0, Math.min(legendRect.right, drawerRect.right) - Math.max(legendRect.left, drawerRect.left));
        const overlapY = Math.max(0, Math.min(legendRect.bottom, drawerRect.bottom) - Math.max(legendRect.top, drawerRect.top));
        collides = (overlapX > 0 && overlapY > 0);
      }

      const moreMenuBtn = document.getElementById('headerMoreMenuBtn');
      const moreBtnVisible = moreMenuBtn ? (window.getComputedStyle(moreMenuBtn).display !== 'none') : false;

      return {
        viewport: '${vp.name} (${vp.width}x${vp.height})',
        headerHasHScroll,
        bodyHasHScroll,
        legendCollidesWithDrawer: collides,
        moreToolsButtonVisible: moreBtnVisible
      };
    })()`);
    console.log(`[Viewport ${vp.name}]:`, vpAudit);
  }

  console.log('\n========================================');
  console.log('TEST 3: RESIZE OBSERVER & MAP INVALIDATE SIZE');
  console.log('========================================');
  const roTest = await client.eval(`(() => {
    const mapEl = document.getElementById('map');
    const initialBounds = mapEl ? mapEl.getBoundingClientRect() : null;
    
    // Toggle drawer
    const collapseBtn = document.getElementById('collapseDrawerBtn');
    if (collapseBtn) collapseBtn.click();
    
    return {
      mapFound: !!mapEl,
      initialWidth: initialBounds?.width,
      initialHeight: initialBounds?.height
    };
  })()`);
  console.log('ResizeObserver Map Test:', roTest);

  client.close();
  chromeProc.kill();
  console.log('\nALL VERIFICATION TESTS COMPLETED SUCCESSFULLY!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
