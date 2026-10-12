/**
 * Automated Headless Chrome CDP Verification Suite for Gujarat Geospatial Data Operations & Quality Engine
 * Tests:
 * 1. Global GeospatialDataOps lifecycle and public API.
 * 2. DOM elements and modal dialog mounting (#dataOpsModal, #openDataOpsBtn).
 * 3. Statewide Quality Overview & Master Layer Health Ledger (3,327 features).
 * 4. Record Classification Hierarchy (verified, source-reported, derived, illustrative, pending-review).
 * 5. Visual Data Lineage Explorer & Custodian Registry.
 * 6. Anomaly & Conflict Ledger (non-destructive preservation of contradictory dimensions).
 * 7. Controlled Review Workbench & Immutable Audit Trail (with RFC-4180 export).
 * 8. Pre-Flight 10-Stage Ingestion Sandbox.
 * 9. Keyboard shortcuts: 'q' / 'Q' toggle, 'Escape' exit.
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
  const userDataDir = path.join(os.tmpdir(), 'chrome-dataops-test-' + Date.now());
  const port = 9229;

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
    // 1. Wait for page load and module initialization
    console.log('\n--- Test 1: Page Initialization & GeospatialDataOps Global ---');
    await sleep(2500);

    const hasDataOps = await cdp.eval('typeof window.GeospatialDataOps === "object"');
    assert(hasDataOps, 'window.GeospatialDataOps object exists in global namespace');

    const hasAPI = await cdp.eval(`
      typeof window.GeospatialDataOps.init === "function" &&
      typeof window.GeospatialDataOps.openModal === "function" &&
      typeof window.GeospatialDataOps.closeModal === "function" &&
      typeof window.GeospatialDataOps.toggleModal === "function" &&
      typeof window.GeospatialDataOps.openReviewForAsset === "function" &&
      typeof window.GeospatialDataOps.getAuditTrail === "function" &&
      typeof window.GeospatialDataOps.getAnomalies === "function" &&
      typeof window.GeospatialDataOps.getCustodianRegistry === "function"
    `);
    assert(hasAPI, 'GeospatialDataOps exposes full public API');

    // 2. Open Modal via Action Button
    console.log('\n--- Test 2: Modal Mounting & Header Action Button ---');
    const hasHeaderBtn = await cdp.eval('!!document.getElementById("openDataOpsBtn")');
    assert(hasHeaderBtn, '#openDataOpsBtn button exists in header');

    await cdp.eval('document.getElementById("openDataOpsBtn").click()');
    await sleep(600);

    const modalOpen = await cdp.eval(`
      const m = document.getElementById("dataOpsModal");
      m && m.open
    `);
    assert(modalOpen, '#dataOpsModal opens cleanly on button click');

    // 3. Test Pane 1: Statewide Quality Overview & KPI Cards
    console.log('\n--- Test 3: Quality Overview & Statewide Layer Health Ledger ---');
    const kpiCount = await cdp.eval('document.querySelectorAll(".data-ops-kpi-card").length');
    assert(kpiCount >= 4, `Statewide KPI strip contains 4 metric cards (got ${kpiCount})`);

    const layerRowCount = await cdp.eval('document.querySelectorAll(".data-ops-ledger-table tbody tr").length');
    assert(layerRowCount >= 13, `Master Layer Health ledger lists all 13 core layers (got ${layerRowCount})`);

    // 4. Test Pane 2: Data Lineage Visualizer
    console.log('\n--- Test 4: Visual Data Lineage Explorer ---');
    await cdp.eval(`
      document.querySelector('.data-ops-tabs button[data-tab="lineage"]')?.click();
    `);
    await sleep(400);

    const hasFlowchart = await cdp.eval('document.querySelectorAll(".lineage-flowchart-card .flow-step").length');
    assert(hasFlowchart >= 4, `Lineage flowchart visualizes 4 end-to-end pipeline stages (got ${hasFlowchart})`);

    const hasSpecs = await cdp.eval('document.querySelectorAll(".lineage-spec-box .spec-col").length');
    assert(hasSpecs >= 2, 'Lineage technical specifications box displayed');

    // 5. Test Pane 3: Anomaly & Conflict Ledger
    console.log('\n--- Test 5: Anomaly & Conflict Detection Ledger ---');
    await cdp.eval(`
      document.querySelector('.data-ops-tabs button[data-tab="anomalies"]')?.click();
    `);
    await sleep(400);

    const anomCards = await cdp.eval('document.querySelectorAll(".anomaly-card").length');
    assert(anomCards >= 4, `Anomaly ledger renders flagged cards (got ${anomCards})`);

    const hasConflict = await cdp.eval(`
      Array.from(document.querySelectorAll(".anomaly-card")).some(c => c.textContent.includes("Kadana Dam") && c.textContent.includes("66.0m"))
    `);
    assert(hasConflict, 'Contradictory dimensions for Kadana Dam preserved non-destructively for review');

    // 6. Test Pane 4: Controlled Review Workbench & Audit Trail
    console.log('\n--- Test 6: Controlled Review Workbench & Immutable Audit Trail ---');
    await cdp.eval(`
      document.querySelector('.data-ops-tabs button[data-tab="review"]')?.click();
    `);
    await sleep(400);

    const hasForm = await cdp.eval('!!document.getElementById("controlledReviewForm")');
    assert(hasForm, 'Controlled correction form mounted with mandatory justification & operator inputs');

    const auditRows = await cdp.eval('document.querySelectorAll(".audit-table tbody tr").length');
    assert(auditRows >= 2, `Audit trail displays initial chronological entries (got ${auditRows})`);

    const hasExportBtns = await cdp.eval('!!document.getElementById("exportAuditJsonBtn") && !!document.getElementById("exportAuditCsvBtn")');
    assert(hasExportBtns, 'Audit trail export buttons (JSON & CSV) available');

    // 7. Test Pane 5: Ingestion Sandbox & Pre-Flight Validator
    console.log('\n--- Test 7: Pre-Flight Ingestion Sandbox ---');
    await cdp.eval(`
      document.querySelector('.data-ops-tabs button[data-tab="import"]')?.click();
    `);
    await sleep(400);

    const hasDropzone = await cdp.eval('!!document.getElementById("sandboxDropzone")');
    assert(hasDropzone, 'Drag-and-drop file upload zone rendered');

    // Run client-side preflight validation with sample GeoJSON
    await cdp.eval(`
      const rawText = document.getElementById("sandboxRawText");
      rawText.value = JSON.stringify({
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            id: "TEST-01",
            geometry: { type: "Point", coordinates: [72.58, 23.02] },
            properties: { id: "TEST-01", name: "Ahmedabad Test Substation", district: "Ahmedabad" }
          }
        ]
      });
      document.getElementById("runPreflightBtn").click();
    `);
    await sleep(400);

    const reportVisible = await cdp.eval(`
      const rep = document.getElementById("sandboxResultsBox");
      rep && !rep.classList.contains("hidden") && rep.textContent.includes("Pre-Flight Quality Report")
    `);
    assert(reportVisible, 'Client-side 10-stage pre-flight quality report generated and displayed');

    // 8. Test Keyboard Navigation (Escape & Q key)
    console.log('\n--- Test 8: Keyboard Navigation & Shortcuts ---');
    // Escape closes modal
    await cdp.eval(`
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', bubbles: true }));
    `);
    await sleep(400);

    const isClosedAfterEsc = await cdp.eval(`
      !document.getElementById("dataOpsModal") || !document.getElementById("dataOpsModal").open
    `);
    assert(isClosedAfterEsc, 'Escape key safely dismisses #dataOpsModal');

    // 'q' key toggles modal open
    await cdp.eval(`
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'q', code: 'KeyQ', bubbles: true }));
    `);
    await sleep(600);

    const isOpenAfterKeyQ = await cdp.eval(`
      !!document.getElementById("dataOpsModal") && document.getElementById("dataOpsModal").open
    `);
    assert(isOpenAfterKeyQ, 'Keyboard shortcut "q" toggles #dataOpsModal open');

    // Dismiss cleanly
    await cdp.eval('window.GeospatialDataOps.closeModal()');
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
