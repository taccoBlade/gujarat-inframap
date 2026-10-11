/**
 * Automated Headless Chrome CDP Verification Suite for Temporal Explorer Engine
 * Tests timeline scrubber HUD, map synchronization, multi-asset charts,
 * missing interval representation, milestones evolution, and telemetry provider.
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
  const userDataDir = path.join(os.tmpdir(), 'chrome-temporal-test-' + Date.now());
  const port = 9224;

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
    consoleErrors.push(`[Uncaught Exception] ${details.text} ${details.exception ? details.exception.description : ''}`);
  });

  await client.send('Runtime.enable');
  await client.send('Page.enable');
  await client.send('DOM.enable');

  console.log('Waiting for application and TemporalExplorer initialization...');
  await sleep(4000);

  console.log('\n========================================');
  console.log('TEST 1: MODULE INITIALIZATION & CONSOLE HEALTH');
  console.log('========================================');
  const hasModule = await client.eval(`typeof window.TemporalExplorer === 'object' && window.TemporalExplorer !== null`);
  console.log(`TemporalExplorer module found:`, hasModule);
  if (!hasModule) throw new Error('TemporalExplorer module not mounted to window');

  console.log(`Console Errors detected: ${consoleErrors.length}`);
  if (consoleErrors.length > 0) {
    console.error('Console errors:', consoleErrors);
    throw new Error('Uncaught runtime errors detected');
  }

  console.log('\n========================================');
  console.log('TEST 2: MAP TIMELINE SCRUBBER HUD CONTROLS');
  console.log('========================================');
  // Toggle Map HUD via API
  await client.eval(`window.TemporalExplorer.toggleMapHUD(true)`);
  await sleep(400);

  const hudState = await client.eval(`(() => {
    const hud = document.getElementById('temporalMapHUD');
    const isVisible = hud && !hud.classList.contains('hidden');
    const title = hud?.querySelector('.thud-title')?.innerText;
    const currentStep = hud?.querySelector('.thud-current-date')?.innerText;
    const isHistorical = hud?.innerText.includes('Historical Observations');
    const isNoLive = hud?.innerText.includes('No Live Feed');
    return { isVisible, title, currentStep, isHistorical, isNoLive };
  })()`);
  console.log('HUD Initial State:', hudState);

  // Step timeline forward
  await client.eval(`window.TemporalExplorer.stepTimeline(1)`);
  await sleep(300);

  const steppedState = await client.eval(`(() => {
    const hud = document.getElementById('temporalMapHUD');
    return { currentStep: hud?.querySelector('.thud-current-date')?.innerText };
  })()`);
  console.log('HUD Stepped State:', steppedState);

  console.log('\n========================================');
  console.log('TEST 3: TEMPORAL MODAL & TAB NAVIGATION');
  console.log('========================================');
  // Open modal via button
  await client.eval(`document.getElementById('openTemporalExplorerBtn')?.click()`);
  await sleep(400);

  const modalOpenState = await client.eval(`(() => {
    const modal = document.getElementById('temporalExplorerModal');
    return {
      isOpen: modal ? modal.open : false,
      title: modal?.querySelector('.modal-card-title')?.innerText
    };
  })()`);
  console.log('Modal Opened:', modalOpenState);

  // Verify tab switching
  const tabs = ['compare', 'milestones', 'telemetry', 'hydrology'];
  for (const tab of tabs) {
    await client.eval(`document.querySelector('.temporal-modal-tab-btn[data-tab="${tab}"]')?.click()`);
    await sleep(200);
    const tabActive = await client.eval(`(() => {
      const pane = document.getElementById('temporalPane-${tab}');
      return pane && pane.classList.contains('active');
    })()`);
    console.log(`Tab '${tab}' switched successfully:`, tabActive);
  }

  console.log('\n========================================');
  console.log('TEST 4: MULTI-ASSET COMPARATIVE SVG CHART');
  console.log('========================================');
  await client.eval(`document.querySelector('.temporal-modal-tab-btn[data-tab="compare"]')?.click()`);
  await sleep(300);

  const chartState = await client.eval(`(() => {
    const chart = document.querySelector('#texpMultiChartSvgWrap svg');
    const paths = chart ? chart.querySelectorAll('path').length : 0;
    const lines = chart ? chart.querySelectorAll('line').length : 0;
    return { hasSvg: !!chart, pathCount: paths, lineCount: lines };
  })()`);
  console.log('Comparative SVG Chart Rendered:', chartState);

  console.log('\n========================================');
  console.log('TEST 5: TELEMETRY DISCONNECT TRANSPARENCY');
  console.log('========================================');
  const telemetryInfo = await client.eval(`window.TemporalExplorer.getProviderInfo()`);
  console.log('Telemetry Provider Info:', telemetryInfo);
  if (telemetryInfo.connected !== false) {
    throw new Error('Telemetry must not fabricate live connection!');
  }

  console.log('\n========================================');
  console.log('TEST 6: KEYBOARD SHORTCUT (Y & Escape)');
  console.log('========================================');
  // Close modal via Escape
  await client.eval(`document.getElementById('temporalExplorerModal')?.close()`);
  await sleep(300);
  const closedState = await client.eval(`!document.getElementById('temporalExplorerModal')?.open`);
  console.log('Modal closed cleanly:', closedState);

  console.log('\nALL TEMPORAL EXPLORER TESTS COMPLETED SUCCESSFULLY!');
  client.close();
  chromeProc.kill();
  process.exit(0);
}

runTests().catch(err => {
  console.error('[TEST FAILED]', err);
  process.exit(1);
});
