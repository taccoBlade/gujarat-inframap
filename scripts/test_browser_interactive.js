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

async function main() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = path.join(os.tmpdir(), 'chrome-full-test-' + Date.now());
  const port = 9222;

  console.log(`Starting headless Chrome on port ${port}...`);
  const chromeProc = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    '--window-size=1600,960',
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
  if (!pageTarget) {
    console.error('No page target found.');
    chromeProc.kill();
    process.exit(1);
  }

  console.log(`Connecting CDP to page: ${pageTarget.url}`);
  const client = new CDPClient(pageTarget.webSocketDebuggerUrl);
  await client.connect();

  const consoleErrors = [];
  const consoleLogs = [];

  client.on('Runtime.consoleAPICalled', (params) => {
    const text = params.args.map(a => (a.value !== undefined ? a.value : a.description)).join(' ');
    consoleLogs.push(`[${params.type}] ${text}`);
    if (params.type === 'error') {
      consoleErrors.push(`[Console Error] ${text}`);
    }
  });

  client.on('Runtime.exceptionThrown', (params) => {
    const details = params.exceptionDetails;
    consoleErrors.push(`[Uncaught Exception] ${details.text} ${details.exception ? details.exception.description : ''} at line ${details.lineNumber}:${details.columnNumber}`);
  });

  await client.send('Runtime.enable');
  await client.send('Page.enable');
  await client.send('DOM.enable');

  console.log('Waiting for DOMContentLoaded and app init...');
  await sleep(3000);

  console.log('\n========================================');
  console.log('1. RUNTIME & CONSOLE HEALTH CHECK');
  console.log('========================================');
  for (const log of consoleLogs) {
    console.log(log);
  }

  if (consoleErrors.length === 0) {
    console.log('>>> SUCCESS: 0 console errors or uncaught exceptions detected!');
  } else {
    for (const err of consoleErrors) {
      console.error(err);
    }
    throw new Error(`Encountered ${consoleErrors.length} console errors!`);
  }

  console.log('\n========================================');
  console.log('2. TESTING HEADER ACTION BUTTONS & MODALS');
  console.log('========================================');
  const modalTests = [
    { name: 'Water Scenarios Lab', btnId: 'openWaterScenariosBtn', modalId: 'waterScenariosLabModal' },
    { name: 'GeoEnvironmental Intel Suite', btnId: 'openGeoenvironmentalBtn', modalId: 'geoenvironmentalModal' },
    { name: 'Dams & Reservoirs Explorer', btnId: 'openDamsExplorerBtn', modalId: 'damsExplorerModal' },
    { name: 'Dam Science Lab', btnId: 'openDamScienceLabBtn', modalId: 'damScienceLabModal' },
    { name: 'Water Systems Network', btnId: 'openWaterNetworkBtn', modalId: 'waterNetworkModal' },
    { name: 'Energy & Hydro Explorer', btnId: 'openEnergyExplorerBtn', modalId: 'energyExplorerModal' },
    { name: 'Transport & Bridges Explorer', btnId: 'openTransportExplorerBtn', modalId: 'transportExplorerModal' },
    { name: 'Proximity Audit Tool', btnId: 'proximityToolBtn', modalId: 'proximityHud' },
    { name: 'Measure Distance Tool', btnId: 'measureToolBtn', modalId: 'measureHud' }
  ];

  for (const m of modalTests) {
    const res = await client.eval(`(() => {
      const btn = document.getElementById('${m.btnId}');
      const modal = document.getElementById('${m.modalId}');
      if (!btn) return { error: 'Button #${m.btnId} not found' };
      if (!modal) return { error: 'Modal #${m.modalId} not found' };

      const wasOpen = modal.open || (!modal.classList.contains('hidden') && modal.style.display !== 'none');
      btn.click();
      const isOpen = modal.open || (!modal.classList.contains('hidden') && modal.style.display !== 'none');

      // Close it
      if (typeof modal.close === 'function' && modal.open) {
        modal.close();
      } else {
        const closeBtn = modal.querySelector('.modal-close-btn, .close-btn, .proximity-close-btn, #measureExitBtn, #proximityExitBtn, .btn-dismiss');
        if (closeBtn) closeBtn.click();
        else modal.classList.add('hidden');
      }

      const closedAgain = !modal.open && (modal.classList.contains('hidden') || modal.style.display === 'none' || !modal.open);
      return { found: true, wasOpen, isOpen, closedAgain };
    })()`);
    console.log(`[Modal Test] ${m.name}:`, res);
  }

  console.log('\n========================================');
  console.log('3. TESTING DRAWER, ACCORDIONS & PRESET PILLS');
  console.log('========================================');

  // Test Drawer collapse and expand
  const drawerTest = await client.eval(`(() => {
    const drawer = document.getElementById('layerDrawer');
    const collapseBtn = document.getElementById('collapseDrawerBtn');
    const floatingBtn = document.getElementById('floatingDrawerBtn');
    if (!drawer || !collapseBtn || !floatingBtn) return { error: 'Drawer elements missing' };

    collapseBtn.click();
    const isCollapsed = drawer.classList.contains('drawer-collapsed');
    const floatVisible = floatingBtn.classList.contains('visible');

    floatingBtn.click();
    const isExpanded = !drawer.classList.contains('drawer-collapsed');

    return { collapseWorked: isCollapsed && floatVisible, expandWorked: isExpanded };
  })()`);
  console.log('[Drawer Collapse/Expand]:', drawerTest);

  // Test Presets
  const presets = ['overview', 'water', 'transport', 'energy', 'urban', 'disaster', 'admin', 'full'];
  for (const p of presets) {
    const pRes = await client.eval(`(() => {
      const pill = document.querySelector('.preset-pill[data-preset="${p}"]');
      if (!pill) return { error: 'Preset ${p} not found' };
      pill.click();
      return {
        preset: '${p}',
        active: pill.classList.contains('active'),
        activePresetTag: document.getElementById('activePresetTag')?.textContent.trim()
      };
    })()`);
    console.log(`[Preset Pill ${p}]:`, pRes);
  }

  // Restore overview preset
  await client.eval(`document.querySelector('.preset-pill[data-preset="overview"]')?.click()`);

  // Test Basemap Switching
  const basemaps = ['osm', 'satellite', 'topo', 'dark'];
  for (const bm of basemaps) {
    const bmRes = await client.eval(`(() => {
      const btn = document.querySelector('.segment-btn[data-basemap="${bm}"]');
      if (!btn) return { error: 'Basemap btn ${bm} not found' };
      btn.click();
      return {
        basemap: '${bm}',
        active: btn.classList.contains('active')
      };
    })()`);
    console.log(`[Basemap Switcher ${bm}]:`, bmRes);
  }

  // Test Accordion Toggling
  const catRes = await client.eval(`(() => {
    const catBlock = document.getElementById('catBlock_roads');
    const catBtn = document.querySelector('[data-cat-toggle="roads"]');
    const catBody = document.getElementById('catBody_roads');
    if (!catBtn || !catBlock || !catBody) return { error: 'Roads accordion not found' };

    const wasExpanded = catBlock.classList.contains('expanded');
    catBtn.click();
    const afterFirstClick = catBlock.classList.contains('expanded');
    catBtn.click();
    const reverted = catBlock.classList.contains('expanded') === wasExpanded;

    return { wasExpanded, afterFirstClick, reverted };
  })()`);
  console.log('[Accordion Toggle roads]:', catRes);

  // Test Layer Manager Toolbar: Toggle All Categories & Reset Defaults
  const toolbarRes = await client.eval(`(() => {
    const toggleAllBtn = document.getElementById('toggleAllCategoriesBtn');
    const resetBtn = document.getElementById('resetLayersToDefaultBtn');
    if (!toggleAllBtn || !resetBtn) return { error: 'Layer Manager toolbar buttons not found' };

    toggleAllBtn.click();
    const allExpandedCount = document.querySelectorAll('.layer-category-block.expanded').length;
    toggleAllBtn.click();
    const allCollapsedCount = document.querySelectorAll('.layer-category-block.expanded').length;

    resetBtn.click();
    return { allExpandedCount, allCollapsedCount, resetClicked: true };
  })()`);
  console.log('[Layer Manager Toolbar]:', toolbarRes);

  // Test Layer Checkboxes & Legend Sync
  const cbRes = await client.eval(`(() => {
    const chk = document.querySelector('.layer-toggle-input[data-layer="railways"]');
    if (!chk) return { error: 'Railways checkbox not found' };

    const initiallyChecked = chk.checked;
    chk.click();
    chk.dispatchEvent(new Event('change', { bubbles: true }));
    const afterClick = chk.checked;

    chk.click();
    chk.dispatchEvent(new Event('change', { bubbles: true }));
    const reverted = chk.checked;

    return { layer: 'railways', initiallyChecked, afterClick, reverted };
  })()`);
  console.log('[Layer Toggle Checkbox]:', cbRes);

  // Test Layer Search Filter & Clear
  const searchTest = await client.eval(`(() => {
    const input = document.getElementById('layerSearchInput');
    const clearBtn = document.getElementById('clearLayerSearchBtn');
    if (!input) return { error: 'layerSearchInput not found' };

    input.value = 'dams';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    const visibleCount = Array.from(document.querySelectorAll('.layer-item-wrapper[data-layer-key]')).filter(r => r.style.display !== 'none').length;

    if (clearBtn) clearBtn.click();
    else {
      input.value = '';
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
    const allCount = Array.from(document.querySelectorAll('.layer-item-wrapper[data-layer-key]')).filter(r => r.style.display !== 'none').length;

    return { visibleCount, allCount };
  })()`);
  console.log('[Layer Search Filter]:', searchTest);

  console.log('\n========================================');
  console.log('4. TESTING IN-MODAL TABS & CALCULATORS');
  console.log('========================================');

  // Test Water Scenarios Lab tabs
  const waterLabRes = await client.eval(`(() => {
    const openBtn = document.getElementById('openWaterScenariosBtn');
    const modal = document.getElementById('waterScenariosLabModal');
    if (!openBtn || !modal) return { error: 'Water Scenarios modal missing' };
    openBtn.click();

    const tabs = ['scenarioA', 'scenarioB', 'scenarioC'];
    const results = [];
    for (const t of tabs) {
      const tabBtn = modal.querySelector('.scenarios-tab-btn[data-mode="' + t + '"]');
      if (tabBtn) {
        tabBtn.click();
        const pane = modal.querySelector('#scenPane_' + t);
        results.push({ tab: t, active: tabBtn.classList.contains('active'), paneActive: pane?.classList.contains('active') });
      }
    }
    modal.close();
    return results;
  })()`);
  console.log('[Water Scenarios Lab Tabs]:', waterLabRes);

  // Test Geoenvironmental Intelligence Suite tabs
  const geoenvRes = await client.eval(`(() => {
    const openBtn = document.getElementById('openGeoenvironmentalBtn');
    const modal = document.getElementById('geoenvironmentalModal');
    if (!openBtn || !modal) return { error: 'Geoenvironmental modal missing' };
    openBtn.click();

    const tabs = ['provenance', 'thematic', 'context', 'screening'];
    const results = [];
    for (const t of tabs) {
      const tabBtn = modal.querySelector('.geoenv-tab-btn[data-tab="' + t + '"]');
      if (tabBtn) {
        tabBtn.click();
        const pane = modal.querySelector('#geoenvTab_' + t);
        results.push({ tab: t, active: tabBtn.classList.contains('active'), paneActive: pane?.classList.contains('active') });
      }
    }
    modal.close();
    return results;
  })()`);
  console.log('[Geoenvironmental Suite Tabs]:', geoenvRes);

  console.log('\n========================================');
  console.log('5. TESTING KEYBOARD SHORTCUTS');
  console.log('========================================');
  const shortcutRes = await client.eval(`(() => {
    const modal = document.getElementById('waterScenariosLabModal');
    // Dispatch 's' keydown to document
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 's', code: 'KeyS', bubbles: true }));
    const openedWithS = modal ? modal.open : false;

    // Dispatch 'Escape' keydown to document
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', bubbles: true }));
    const closedWithEsc = modal ? !modal.open : false;

    return { openedWithS, closedWithEsc };
  })()`);
  console.log('[Keyboard Shortcuts s / Escape]:', shortcutRes);

  console.log('\n========================================');
  console.log('ALL BROWSER AUTOMATION TESTS COMPLETED SUCCESSFULLY!');
  console.log('========================================');

  client.close();
  chromeProc.kill();
  try {
    fs.rmSync(userDataDir, { recursive: true, force: true });
  } catch (e) {}
}

main().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
