const http = require('http');
const { spawn } = require('child_process');

function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.id = 1;
    this.callbacks = new Map();
    this.consoleLogs = [];
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.onopen = () => resolve();
      this.ws.onerror = (err) => reject(err);
      this.ws.onmessage = (msg) => {
        const data = JSON.parse(msg.data);
        if (data.method === 'Runtime.consoleAPICalled') {
          const text = (data.params.args || []).map(a => a.value || a.description || '').join(' ');
          this.consoleLogs.push({ type: data.params.type, text });
        }
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
    if (res && res.exceptionDetails) {
      console.error("Eval exception details:", JSON.stringify(res.exceptionDetails));
      return null;
    }
    if (res && res.result) {
      return res.result.value;
    }
    return null;
  }
}

async function runAudit() {
  console.log("======================================================================");
  console.log("PHASE 6 QA & PRODUCT POLISH — COMPREHENSIVE AUDIT SUITE");
  console.log("======================================================================");

  const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  const port = 9522;
  const chromeProc = spawn(chromePath, [
    `--remote-debugging-port=${port}`,
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--window-size=1440,900',
    'http://127.0.0.1:8080/'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  let passed = 0;
  let failed = 0;

  function assert(cond, msg) {
    if (cond) {
      console.log(`  [PASS] ${msg}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${msg}`);
      failed++;
    }
  }

  try {
    const targets = await getJson(`http://127.0.0.1:${port}/json`);
    const pageTarget = targets.find(t => t.type === 'page');
    if (!pageTarget) throw new Error("No page target found");

    const client = new CDPClient(pageTarget.webSocketDebuggerUrl);
    await client.connect();

    await client.send('Runtime.enable');
    await client.send('Page.enable');

    await new Promise(r => setTimeout(r, 1000));

    // Wait until window.PublicViews and window.TripReality are initialized
    for (let i = 0; i < 30; i++) {
      const ready = await client.eval(`typeof window.PublicViews !== 'undefined' && typeof window.TripReality !== 'undefined'`);
      if (ready) break;
      await new Promise(r => setTimeout(r, 300));
    }

    console.log("\n--- AUDIT 1: Console Cleanliness on Boot ---");
    const errors = client.consoleLogs.filter(l => l.type === 'error');
    assert(errors.length === 0, `Zero console errors on boot (found ${errors.length})`);

    console.log("\n--- AUDIT 2: Floating Map Chrome / HUDs on Consumer Views ---");
    const navDests = ['plan', 'places', 'infrastructure', 'about', 'explore'];
    for (const d of navDests) {
      await client.eval(`window.PublicViews.switchDestination('${d}', true)`);
      await new Promise(r => setTimeout(r, 300));
      const hud = await client.eval(`(() => {
        const isExplore = '${d}' === 'explore';
        const leg = document.getElementById('activeLayerLegend');
        const legDisp = leg ? window.getComputedStyle(leg).display : 'none';
        const hudEl = document.querySelector('.map-hud');
        const hudDisp = hudEl ? window.getComputedStyle(hudEl).display : 'none';
        const rec = document.getElementById('recenterMapBtn') || document.querySelector('.floating-recenter-btn');
        const recDisp = rec ? window.getComputedStyle(rec).display : 'none';
        const zoom = document.querySelector('.leaflet-control-zoom');
        const zoomDisp = zoom ? window.getComputedStyle(zoom).display : 'none';
        const drawer = document.querySelector('.layer-drawer');
        const drawerOpen = drawer ? drawer.classList.contains('open') : false;

        return {
          isExplore,
          legendOk: isExplore ? (legDisp !== 'none') : (legDisp === 'none'),
          hudOk: isExplore ? (hudDisp !== 'none') : (hudDisp === 'none'),
          recenterOk: isExplore ? (recDisp !== 'none') : (recDisp === 'none'),
          zoomOk: isExplore ? (zoomDisp !== 'none') : (zoomDisp === 'none'),
          drawerClosed: !drawerOpen
        };
      })()`);
      assert(hud.legendOk, `View '${d}': Active layer legend is ${d === 'explore' ? 'visible' : 'completely hidden'}`);
      assert(hud.hudOk, `View '${d}': Map HUD is ${d === 'explore' ? 'visible' : 'completely hidden'}`);
      assert(hud.recenterOk, `View '${d}': Recenter button is ${d === 'explore' ? 'visible' : 'completely hidden'}`);
      assert(hud.drawerClosed, `View '${d}': Layer drawer is closed`);
    }

    console.log("\n--- AUDIT 3: Empty State in Trip Reality ---");
    await client.eval(`window.PublicViews.switchDestination('plan', true)`);
    await new Promise(r => setTimeout(r, 300));
    await client.eval(`window.TripReality.selectDestination('')`);
    await new Promise(r => setTimeout(r, 300));
    const emptyCheck = await client.eval(`(() => {
      const activeDest = window.TripReality.activeDestination;
      const emptyCard = document.querySelector('.tr-empty-state-card');
      const snapshot = document.querySelector('.tr-snapshot-section');
      const chips = document.querySelectorAll('.tr-empty-chip');
      const selVal = document.getElementById('trDestinationSelect').value;
      return {
        activeNull: activeDest === null,
        emptyCardPresent: !!emptyCard,
        snapshotAbsent: !snapshot,
        chipsCount: chips.length,
        selEmpty: selVal === ''
      };
    })()`);
    assert(emptyCheck.activeNull, 'TripReality.activeDestination is null when unselected');
    assert(emptyCheck.emptyCardPresent, 'Editorial empty state card (.tr-empty-state-card) is rendered');
    assert(emptyCheck.snapshotAbsent, 'Trip snapshot (.tr-snapshot-section) is absent during empty state');
    assert(emptyCheck.chipsCount >= 6, `Benchmark starter chips rendered (found ${emptyCheck.chipsCount})`);
    assert(emptyCheck.selEmpty, 'Destination selector dropdown value reset to empty');

    console.log("\n--- AUDIT 4: Destination Selection & Snapshot Render ---");
    await client.eval(`window.TripReality.selectDestination('sun-temple-modhera')`);
    await new Promise(r => setTimeout(r, 500));
    const selectCheck = await client.eval(`(() => {
      const active = window.TripReality.activeDestination;
      const snapshot = document.querySelector('.tr-snapshot-section');
      const headline = document.querySelector('.tr-snapshot-title');
      const statusPill = document.querySelector('.tr-snapshot-status-pill');
      const stages = document.querySelectorAll('.tr-stage-card');
      const selVal = document.getElementById('trDestinationSelect').value;
      const activeCard = document.querySelector('.tr-pick-card.active.selected');
      return {
        activeId: active ? active.destinationId : null,
        snapshotPresent: !!snapshot,
        headlineText: headline ? headline.textContent.trim() : '',
        statusLabel: statusPill ? statusPill.textContent.trim() : '',
        stagesCount: stages.length,
        selVal,
        activeCardFound: !!activeCard
      };
    })()`);
    assert(selectCheck.activeId === 'sun-temple-modhera', 'Selected destination activeId is sun-temple-modhera');
    assert(selectCheck.snapshotPresent, 'Trip snapshot section is present');
    assert(selectCheck.headlineText.includes('Modhera'), `Headline includes Modhera (got: "${selectCheck.headlineText}")`);
    assert(selectCheck.statusLabel.length > 0, `Status pill displays deliberate classification ("${selectCheck.statusLabel}")`);
    assert(selectCheck.stagesCount === 4, `All 4 journey stages rendered (found ${selectCheck.stagesCount})`);
    assert(selectCheck.activeCardFound, 'Matching quick pick card receives .active and .selected classes');

    console.log("\n--- AUDIT 5: Mode Switch & Origin Feedback ---");
    await client.eval(`window.TripReality.setMode('private')`);
    await new Promise(r => setTimeout(r, 300));
    const modeCheck = await client.eval(`(() => {
      const mode = window.TripReality.activeMode;
      const metricEl = document.querySelector('.tr-snap-metric:nth-child(2) .metric-val');
      const privateBtn = document.querySelector('.tr-mode-btn[data-mode="private"].active');
      return {
        mode,
        metricText: metricEl ? metricEl.textContent.trim() : '',
        privateBtnActive: !!privateBtn
      };
    })()`);
    assert(modeCheck.mode === 'private', 'TripReality activeMode changed to private');
    assert(modeCheck.privateBtnActive, 'Private vehicle button has .active class');

    console.log("\n--- AUDIT 6: Universal Smart Search ---");
    await client.eval(`window.PublicViews.switchDestination('explore', true)`);
    await new Promise(r => setTimeout(r, 300));
    const searchCheck = await client.eval(`(() => {
      const input = document.getElementById('universalSearch');
      if (!input) return { inputFound: false };
      input.value = 'Rani';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      const results = document.getElementById('searchResults');
      return {
        inputFound: true,
        resultsPresent: !!results,
        resultsHidden: results ? results.classList.contains('hidden') : true
      };
    })()`);
    assert(searchCheck.inputFound, 'Universal Search input (#universalSearch) found in header');
    // Allow debounce to populate results
    await new Promise(r => setTimeout(r, 450));
    const searchResultsCheck = await client.eval(`(() => {
      const items = document.querySelectorAll('.search-result-item, .search-item');
      return { count: items.length };
    })()`);
    assert(searchResultsCheck.count > 0, `Universal Search returned results for query 'Rani' (count: ${searchResultsCheck.count})`);

    console.log("\n--- AUDIT 7: Places to Explore Search & Filter ---");
    await client.eval(`window.PublicViews.switchDestination('places', true)`);
    await new Promise(r => setTimeout(r, 300));
    const placesCheck = await client.eval(`(() => {
      const search = document.getElementById('tourismSearchInput');
      if (search) {
        search.value = 'stepwell';
        search.dispatchEvent(new Event('input', { bubbles: true }));
      }
      const cards = document.querySelectorAll('.destination-card');
      return {
        hasInput: !!search,
        cardsCount: cards.length
      };
    })()`);
    assert(placesCheck.hasInput, 'Tourism Search input present in Places view');
    assert(placesCheck.cardsCount > 0, `Places catalog renders cards (count: ${placesCheck.cardsCount})`);

    console.log("\n--- AUDIT 8: Responsive Layout Across Desktop, Tablet, Mobile ---");
    const breakpoints = [
      { name: 'Desktop', w: 1440, h: 900 },
      { name: 'Tablet', w: 768, h: 1024 },
      { name: 'Mobile', w: 375, h: 812 }
    ];
    for (const bp of breakpoints) {
      await client.send('Emulation.setDeviceMetricsOverride', {
        width: bp.w,
        height: bp.h,
        deviceScaleFactor: 1,
        mobile: bp.w < 768
      });
      for (const d of ['explore', 'places', 'plan', 'infrastructure', 'about']) {
        await client.eval(`window.PublicViews.switchDestination('${d}', true)`);
        await new Promise(r => setTimeout(r, 200));
        const overflow = await client.eval(`(() => {
          const docW = document.documentElement.scrollWidth;
          const winW = window.innerWidth;
          const bodyW = document.body.scrollWidth;
          return docW <= winW && bodyW <= winW;
        })()`);
        assert(overflow, `No horizontal overflow at ${bp.name} (${bp.w}px) on view '${d}'`);
      }
    }

    console.log("\n--- AUDIT 9: Destination Images Uniqueness & Integrity ---");
    const imgCheck = await client.eval(`(() => {
      const dests = (window.TourismDiscovery && window.TourismDiscovery.destinations) || [];
      const images = dests.map(d => d.image).filter(Boolean);
      const uniqueImages = new Set(images);
      return {
        total: dests.length,
        imageCount: images.length,
        uniqueCount: uniqueImages.size,
        hasDuplicates: images.length !== uniqueImages.size
      };
    })()`);
    assert(!imgCheck.hasDuplicates, `All ${imgCheck.total} destinations have 100% unique images (zero duplicates across catalog)`);

    console.log("\n--- AUDIT 10: Browser Back & Forward Navigation ---");
    await client.eval(`window.PublicViews.switchDestination('explore', true)`);
    await new Promise(r => setTimeout(r, 200));
    await client.eval(`window.PublicViews.switchDestination('plan', true)`);
    await new Promise(r => setTimeout(r, 200));
    // Test back button
    await client.eval(`window.history.back()`);
    await new Promise(r => setTimeout(r, 300));
    const backCheck = await client.eval(`window.location.hash`);
    assert(backCheck === '#/explore', `Browser history back navigates to #/explore (got: ${backCheck})`);
    // Test forward button
    await client.eval(`window.history.forward()`);
    await new Promise(r => setTimeout(r, 300));
    const forwardCheck = await client.eval(`window.location.hash`);
    assert(forwardCheck === '#/plan', `Browser history forward navigates to #/plan (got: ${forwardCheck})`);

    console.log("\n======================================================================");
    console.log(`AUDIT RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log("======================================================================");

  } finally {
    chromeProc.kill();
  }
}

runAudit().catch(err => {
  console.error("Audit error:", err);
  process.exit(1);
});
