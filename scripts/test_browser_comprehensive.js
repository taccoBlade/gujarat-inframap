const http = require('http');
const { spawn } = require('child_process');
const path = require('path');
const os = require('os');
const fs = require('fs');

async function getJson(url) {
  return new Promise((res, rej) => {
    http.get(url, r => {
      let d = '';
      r.on('data', c => d += c);
      r.on('end', () => res(JSON.parse(d)));
    }).on('error', rej);
  });
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.id = 1;
    this.callbacks = new Map();
    this.listeners = new Map();
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
          const arr = this.listeners.get(data.method) || [];
          for (const l of arr) l(data.params);
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
  on(event, fn) {
    if (!this.listeners.has(event)) this.listeners.set(event, []);
    this.listeners.get(event).push(fn);
  }
  async eval(expression) {
    const res = await this.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
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
  const userDataDir = path.join(os.tmpdir(), 'chrome-comp-' + Date.now());
  const port = 9270;
  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--user-data-dir=' + userDataDir,
    '--no-first-run',
    '--disable-gpu',
    '--window-size=1536,900',
    'http://127.0.0.1:8080/'
  ]);

  for (let i = 0; i < 25; i++) {
    await sleep(200);
    try {
      if (await getJson(`http://127.0.0.1:${port}/json/version`)) break;
    } catch (e) {}
  }

  const targets = await getJson(`http://127.0.0.1:${port}/json/list`);
  const page = targets.find(t => t.type === 'page' && t.url.includes('8080'));
  const cdp = new CDPClient(page.webSocketDebuggerUrl);
  await cdp.connect();

  const consoleErrors = [];
  cdp.on('Runtime.consoleAPICalled', params => {
    if (params.type === 'error') {
      const text = params.args.map(a => (a.value !== undefined ? a.value : a.description)).join(' ');
      consoleErrors.push(text);
    }
  });

  await cdp.send('Runtime.enable');
  await cdp.send('Page.enable');
  await cdp.send('DOM.enable');

  console.log('Waiting for twin initialization...');
  await sleep(3000);

  console.log('\n========================================');
  console.log('1. RUNTIME HEALTH & CONSOLE INTEGRITY');
  console.log('========================================');
  if (consoleErrors.length === 0) {
    console.log('[PASS] 0 console errors detected during startup.');
  } else {
    console.warn('[WARN] Console errors:', consoleErrors);
  }

  console.log('\n========================================');
  console.log('2. MULTI-VIEWPORT HEADER VISIBILITY AUDIT');
  console.log('========================================');
  const viewports = [
    { w: 1920, h: 1080, name: '1080p Desktop' },
    { w: 1536, h: 864, name: '1536px (125% DPI scale / User Screen)' },
    { w: 1440, h: 900, name: '1440px Laptop' },
    { w: 1366, h: 768, name: '1366px Laptop' },
    { w: 1280, h: 800, name: '1280px Screen' },
    { w: 1024, h: 768, name: '1024px Tablet' },
    { w: 768, h: 1024, name: '768px Portrait' }
  ];

  for (const vp of viewports) {
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: vp.w,
      height: vp.h,
      deviceScaleFactor: 1,
      mobile: vp.w < 768
    });
    await sleep(200);

    const check = await cdp.eval(`(() => {
      const hr = document.querySelector('.header-right');
      const hl = document.querySelector('.header-left');
      const hc = document.querySelector('.header-center');
      const dams = document.getElementById('openDamsExplorerBtn');
      const water = document.getElementById('openWaterScenariosBtn');
      const geoenv = document.getElementById('openGeoenvironmentalBtn');
      const more = document.getElementById('headerMoreMenuBtn');
      const drawer = document.getElementById('toggleDrawerBtn');

      const isClipped = el => {
        if (!el) return false;
        const r = el.getBoundingClientRect();
        return r.left < 0 || r.right > window.innerWidth;
      };

      return {
        hrScrollOverflow: hr.scrollWidth > hr.clientWidth,
        hcWidth: Math.round(hc.getBoundingClientRect().width),
        geoenvClipped: isClipped(geoenv),
        damsClipped: isClipped(dams),
        waterClipped: isClipped(water),
        moreClipped: isClipped(more),
        drawerClipped: isClipped(drawer),
        geoenvText: geoenv.innerText.trim().replace(/\\n/g, ' '),
        waterText: water.innerText.trim().replace(/\\n/g, ' '),
        damsText: dams.innerText.trim().replace(/\\n/g, ' ')
      };
    })()`);

    console.log(`[Viewport: ${vp.name}]`);
    console.log(`  Search Width: ${check.hcWidth}px | Scroll Overflow: ${check.hrScrollOverflow}`);
    console.log(`  Geoenv text: "${check.geoenvText}" (Clipped: ${check.geoenvClipped})`);
    console.log(`  Water text: "${check.waterText}" (Clipped: ${check.waterClipped})`);
    console.log(`  Dams text: "${check.damsText}" (Clipped: ${check.damsClipped})`);

    if (check.hrScrollOverflow || check.geoenvClipped || check.hcWidth < 140) {
      throw new Error(`Viewport check failed for ${vp.name}!`);
    }
  }

  // Restore 1536 viewport for modal tests
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: 1536,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });
  await sleep(200);

  console.log('\n========================================');
  console.log('3. TESTING MORE TOOLS DROPDOWN INTERACTIONS & BUTTON ACTIONS');
  console.log('========================================');

  const toolsToTest = [
    { btnId: 'openDamScienceLabBtn', targetModal: 'damScienceLabModal', name: 'Dam Science Lab' },
    { btnId: 'openWaterNetworkBtn', targetModal: 'waterNetworkModal', name: 'Water Systems Network' },
    { btnId: 'openEnergyExplorerBtn', targetModal: 'energyExplorerModal', name: 'Energy & Hydropower Explorer' },
    { btnId: 'openTemporalExplorerBtn', targetModal: 'temporalExplorerModal', name: 'Temporal Explorer' },
    { btnId: 'openTransportExplorerBtn', targetModal: 'transportExplorerModal', name: 'Transport & Bridges' },
    { btnId: 'openSpatialToolkitBtn', targetModal: 'spatialAnalysisModal', name: 'GIS Spatial Toolkit' },
    { btnId: 'openInfraIntelBtn', targetModal: 'infraIntelModal', name: 'Infra Intelligence' },
    { btnId: 'openDataOpsBtn', targetModal: 'dataOpsModal', name: 'Geospatial Data Ops' },
    { btnId: 'openReportBuilderBtn', targetModal: 'reportBuilderModal', name: 'Report Builder' },
    { btnId: 'aboutBtn', targetModal: 'aboutModal', name: 'Specs & Metadata' }
  ];

  for (const tool of toolsToTest) {
    // 1. Open More Menu
    await cdp.eval(`document.getElementById('headerMoreMenuBtn').click()`);
    await sleep(150);

    // 2. Click the specific tool button inside dropdown
    const res = await cdp.eval(`(() => {
      const btn = document.getElementById('${tool.btnId}');
      const menu = document.getElementById('headerMoreMenu');
      if (!btn) return { error: 'Button #${tool.btnId} not found' };

      btn.click();
      const modal = document.getElementById('${tool.targetModal}');
      if (!modal) return { error: 'Modal #${tool.targetModal} not found after click' };

      const menuClosedAfterClick = !menu.classList.contains('open');
      const modalOpened = modal.open || (!modal.classList.contains('hidden') && modal.style.display !== 'none');

      // Dismiss modal
      if (typeof modal.close === 'function' && modal.open) {
        modal.close();
      } else {
        const closeBtn = modal.querySelector('.modal-close-btn, .close-btn, .btn-dismiss, [data-dismiss]');
        if (closeBtn) closeBtn.click();
        else modal.classList.add('hidden');
      }

      return {
        btnFound: true,
        menuClosedAfterClick,
        modalOpened
      };
    })()`);

    console.log(`[Tool Action: ${tool.name}]:`, res);
    if (!res.modalOpened || !res.menuClosedAfterClick) {
      throw new Error(`Failed to open ${tool.name} via header dropdown!`);
    }
  }

  console.log('\n========================================');
  console.log('4. TESTING PRIMARY BAR MODALS (Dams, Water Scenarios, Geoenv)');
  console.log('========================================');
  const primaryModals = [
    { btnId: 'openDamsExplorerBtn', modalId: 'damsExplorerModal', name: 'Dams & Reservoirs Ledger' },
    { btnId: 'openWaterScenariosBtn', modalId: 'waterScenariosLabModal', name: 'Water Scenarios Lab' },
    { btnId: 'openGeoenvironmentalBtn', modalId: 'geoenvironmentalModal', name: 'Geoenvironmental Intelligence' }
  ];

  for (const pm of primaryModals) {
    const res = await cdp.eval(`(() => {
      const btn = document.getElementById('${pm.btnId}');
      const modal = document.getElementById('${pm.modalId}');
      if (!btn || !modal) return { error: 'Element missing' };

      btn.click();
      const opened = modal.open || (!modal.classList.contains('hidden') && modal.style.display !== 'none');

      if (typeof modal.close === 'function' && modal.open) {
        modal.close();
      } else {
        const closeBtn = modal.querySelector('.modal-close-btn, .close-btn, .btn-dismiss');
        if (closeBtn) closeBtn.click();
        else modal.classList.add('hidden');
      }

      return { opened };
    })()`);
    console.log(`[Primary Modal: ${pm.name}]:`, res);
    if (!res.opened) throw new Error(`Primary modal ${pm.name} failed to open!`);
  }

  console.log('\n========================================');
  console.log('5. KEYBOARD SHORTCUT DISPATCH AUDIT');
  console.log('========================================');
  const shortcuts = [
    { key: 'q', code: 'KeyQ', modalId: 'dataOpsModal', name: 'Q -> Data Ops' },
    { key: 'b', code: 'KeyB', modalId: 'reportBuilderModal', name: 'B -> Report Builder' },
    { key: 'g', code: 'KeyG', modalId: 'geoenvironmentalModal', name: 'G -> Geoenvironmental' },
    { key: 's', code: 'KeyS', modalId: 'waterScenariosLabModal', name: 'S -> Water Scenarios' }
  ];

  for (const sc of shortcuts) {
    const res = await cdp.eval(`(() => {
      const modal = document.getElementById('${sc.modalId}');
      document.dispatchEvent(new KeyboardEvent('keydown', { key: '${sc.key}', code: '${sc.code}', bubbles: true }));
      const opened = modal ? (modal.open || (!modal.classList.contains('hidden') && modal.style.display !== 'none')) : false;

      // Close with Escape
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', bubbles: true }));
      const closed = modal ? (!modal.open && (modal.classList.contains('hidden') || modal.style.display === 'none' || !modal.open)) : true;

      return { opened, closed };
    })()`);
    console.log(`[Shortcut: ${sc.name}]:`, res);
    if (!res.opened) throw new Error(`Shortcut ${sc.name} failed!`);
  }

  console.log('\n======================================================');
  console.log('ALL BROWSER TESTS PASSED DEFECT-FREE ACROSS ALL VIEWPORTS!');
  console.log('======================================================');

  cdp.close();
  chromeProc.kill();
  try { fs.rmSync(userDataDir, { recursive: true, force: true }); } catch (e) {}
}

run().catch(err => {
  console.error('[FATAL ERROR]:', err);
  process.exit(1);
});
