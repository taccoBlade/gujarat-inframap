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
  console.log('GUJARAT ATLAS — TOURISM & INFRASTRUCTURE E2E VERIFICATION SUITE');
  console.log('======================================================================');

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = path.join(os.tmpdir(), 'chrome-atlas-e2e-' + Date.now());
  const port = Math.floor(9400 + Math.random() * 50);

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

  console.log('[TEST] Waiting for page initialization...');
  await sleep(2500);

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition, message) {
    totalTests++;
    if (condition) {
      console.log(`  [PASS] ${message}`);
      passedTests++;
    } else {
      console.error(`  [FAIL] ${message}`);
    }
  }

  try {
    // 1. BRAND IDENTITY
    console.log('\n--- Test Group 1: Brand Abstraction & Identity ---');
    const brandTitle = await client.eval(`document.querySelector('.brand-title').textContent.trim()`);
    const brandSubtitle = await client.eval(`document.querySelector('.brand-subtitle').textContent.trim()`);
    const docTitle = await client.eval(`document.title`);

    assert(brandTitle === 'Gujarat InfraMap' || brandTitle === 'Gujarat Atlas', `Brand title is authentic ("${brandTitle}")`);
    assert(brandSubtitle.includes('places') && brandSubtitle.includes('infrastructure'), `Brand subtitle reflects dual pillar (got: "${brandSubtitle}")`);
    assert(docTitle.includes('Gujarat InfraMap') || docTitle.includes('Gujarat Atlas'), `Document title is valid (got: "${docTitle}")`);

    // 2. PRIMARY NAVIGATION
    console.log('\n--- Test Group 2: Primary Destination Navigation ---');
    const navTabs = await client.eval(`Array.from(document.querySelectorAll('.nav-tab')).map(b => b.getAttribute('data-tab'))`);
    assert(navTabs.length === 5, `Primary navigation has 5 core destinations (got: ${navTabs.length})`);
    assert(navTabs.includes('explore') && navTabs.includes('places') && (navTabs.includes('infrastructure') || navTabs.includes('directory')),
      `Navigation includes explore, places, and infrastructure (${navTabs.join(', ')})`);

    // 3. PLACES TO EXPLORE VIEW SWITCHING
    console.log('\n--- Test Group 3: Places to Explore View Switching ---');
    await client.eval(`document.querySelector('.nav-tab[data-tab="places"]').click()`);
    await sleep(500);

    const placesVisible = await client.eval(`!document.getElementById('placesView').classList.contains('hidden')`);
    const exploreActive = await client.eval(`document.querySelector('.nav-tab[data-tab="places"]').classList.contains('active')`);
    const currentHash = await client.eval(`window.location.hash`);

    assert(placesVisible, 'Places view (#placesView) is visible upon tab selection');
    assert(exploreActive, 'Places tab is marked active');
    assert(currentHash === '#/places', `URL hash updated to #/places (got: "${currentHash}")`);

    // 4. DESTINATION CARDS RENDERING
    console.log('\n--- Test Group 4: Destination Catalog Rendering ---');
    const cardCount = await client.eval(`document.querySelectorAll('.destination-card').length`);
    const resultCountText = await client.eval(`document.getElementById('tourismResultsCount').textContent.trim()`);
    assert(cardCount === 37, `Rendered 37 verified destination cards (got: ${cardCount})`);
    assert(resultCountText.includes('37'), `Counter displays 37 verified destinations (got: "${resultCountText}")`);

    // 5. CATEGORY FILTERING
    console.log('\n--- Test Group 5: Category Filtering ---');
    // Click "🌿 Off the Familiar Trail" pill
    await client.eval(`document.querySelector('.tourism-cat-pill[data-cat="lesser_known"]').click()`);
    await sleep(300);
    const lesserKnownCount = await client.eval(`document.querySelectorAll('.destination-card').length`);
    assert(lesserKnownCount >= 5 && lesserKnownCount <= 12, `Off-the-trail filter narrowed results (got: ${lesserKnownCount})`);

    // Click "🦁 Nature & Wildlife" pill
    await client.eval(`document.querySelector('.tourism-cat-pill[data-cat="nature_wildlife"]').click()`);
    await sleep(300);
    const natureCount = await client.eval(`document.querySelectorAll('.destination-card').length`);
    const hasGir = await client.eval(`document.body.innerText.includes('Gir National Park')`);
    assert(natureCount >= 4, `Nature & Wildlife filter returned matching destinations (got: ${natureCount})`);
    assert(hasGir, 'Gir National Park is present in nature filter');

    // Reset filters
    await client.eval(`document.getElementById('tourismResetFiltersBtn').click()`);
    await sleep(300);
    const resetCount = await client.eval(`document.querySelectorAll('.destination-card').length`);
    assert(resetCount === 37, `Reset filters restored all 37 destinations (got: ${resetCount})`);

    // 6. DESTINATION PROFILE MODAL & CROSS-LINKING
    console.log('\n--- Test Group 6: Destination Profile Modal & Cross-Linking ---');
    // Click Explore Profile on Rani ki Vav
    await client.eval(`
      const card = document.getElementById('dest-card-rani-ki-vav');
      if (card) {
        const btn = card.querySelector('.dest-btn-details');
        if (btn) btn.click();
      }
    `);
    await sleep(600);

    const modalOpen = await client.eval(`
      const m = document.getElementById('destinationProfileModal');
      m ? (m.open || !m.classList.contains('hidden')) : false
    `);
    assert(modalOpen, 'Destination Profile Modal opened');

    const modalContent = await client.eval(`document.getElementById('destProfileContent').innerText`);
    assert(modalContent.includes('Rani ki Vav'), 'Modal contains destination name "Rani ki Vav"');
    assert(modalContent.includes('Patan'), 'Modal contains district "Patan"');
    assert(modalContent.includes('ASI') || modalContent.includes('Archaeological Survey'), 'Modal cites statutory source ASI');
    assert(modalContent.includes('Connected Infrastructure') || modalContent.includes('Railway'), 'Modal includes connected infrastructure (Rail/Highway)');

    // Close modal
    await client.eval(`document.getElementById('destinationProfileModal').close()`);
    await sleep(300);

    // 7. UNIVERSAL SMART SEARCH CROSS-DISCOVERY
    console.log('\n--- Test Group 7: Universal Search Cross-Discovery ---');
    await client.eval(`
      const sInput = document.getElementById('universalSearch');
      if (sInput) {
        sInput.value = 'Rani ki Vav';
        sInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
    `);
    await sleep(500);

    const searchMatches = await client.eval(`
      Array.from(document.querySelectorAll('.search-result-item')).map(el => el.innerText)
    `);
    const hasRaniSearch = searchMatches.some(m => m.includes('Rani ki Vav'));
    assert(hasRaniSearch, `Universal Search discovers tourism destinations (Rani ki Vav found in ${searchMatches.length} matches)`);

    // Clear search
    await client.eval(`
      const cBtn = document.getElementById('clearSearchBtn');
      if (cBtn) cBtn.click();
    `);
    await sleep(200);

    // 8. RESPONSIVE AUDIT ACROSS VIEWPORTS
    console.log('\n--- Test Group 8: Responsive Header & Overflow Check ---');
    const viewports = [
      { name: 'Desktop HD', width: 1920, height: 1080 },
      { name: 'Laptop', width: 1366, height: 768 },
      { name: 'Tablet Landscape', width: 1024, height: 768 },
      { name: 'Tablet Portrait', width: 768, height: 1024 },
      { name: 'Mobile Large', width: 425, height: 850 },
      { name: 'Mobile Standard', width: 375, height: 812 },
      { name: 'Mobile Small', width: 320, height: 568 }
    ];

    for (const vp of viewports) {
      await client.send('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 1,
        mobile: vp.width < 768
      });
      await sleep(200);

      const overflow = await client.eval(`document.documentElement.scrollWidth > window.innerWidth`);
      assert(!overflow, `Zero horizontal overflow on ${vp.name} (${vp.width}x${vp.height})`);
    }

    console.log('\n======================================================================');
    console.log(`E2E TEST SUMMARY: ${passedTests}/${totalTests} TESTS PASSED (${Math.round(passedTests/totalTests*100)}%)`);
    console.log('======================================================================');

  } finally {
    client.close();
    chromeProc.kill();
    try {
      fs.rmSync(userDataDir, { recursive: true, force: true });
    } catch (e) {}
  }

  if (passedTests === totalTests) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

run().catch(err => {
  console.error('[FATAL]', err);
  process.exit(1);
});
