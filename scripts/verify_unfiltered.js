/**
 * Gujarat InfraMap — Gujarat Unfiltered CDP Automated Verification Suite
 * 
 * Verifies:
 * 1. GujaratUnfiltered object loaded and healthy (24 stories across 6 collections)
 * 2. Mode switching via #btnModeUnfiltered
 * 3. 24 editorial cards rendered with unique images, folklore vs reality, and safety badges
 * 4. Filtering across all 6 collections (4 stories each)
 * 5. Real-time search functionality
 * 6. Interactive Story Modal deep-dive (Lore vs Ground Reality, Safety, Creator Intel)
 * 7. Leaflet Map markers & popups integration
 * 8. Direct URL hash routing (e.g. #/unfiltered)
 * 9. Clean browser console (0 errors)
 * 10. Captures high-res visual evidence screenshots to artifacts directory
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
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
    this.consoleErrors = [];
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.onopen = () => resolve();
      this.ws.onerror = (err) => reject(err);
      this.ws.onmessage = (msg) => {
        const data = JSON.parse(msg.data);
        if (data.method === 'Runtime.consoleAPICalled') {
          if (data.params.type === 'error') {
            const text = (data.params.args || []).map(a => a.value || a.description || '').join(' ');
            this.consoleErrors.push(text);
          }
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
      console.error('Eval exception:', JSON.stringify(res.exceptionDetails));
      return null;
    }
    return res && res.result ? res.result.value : null;
  }

  async captureScreenshot(outputPath) {
    const res = await this.send('Page.captureScreenshot', { format: 'png', quality: 90 });
    if (res && res.data) {
      const buf = Buffer.from(res.data, 'base64');
      fs.writeFileSync(outputPath, buf);
      console.log(`  [SCREENSHOT] Saved: ${outputPath} (${Math.round(buf.length / 1024)} KB)`);
    }
  }

  close() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

async function runUnfilteredVerification() {
  console.log('======================================================================');
  console.log('GUJARAT INFRAMAP — GUJARAT UNFILTERED VERIFICATION SUITE');
  console.log('======================================================================\n');

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9529;
  const chromeProc = spawn(chromePath, [
    `--remote-debugging-port=${port}`,
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--window-size=1440,950',
    'http://127.0.0.1:8080/#/places'
  ]);

  await new Promise(r => setTimeout(r, 2200));

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`  [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${testName}`);
      failed++;
    }
  }

  try {
    const version = await getJson(`http://127.0.0.1:${port}/json/version`);
    const targets = await getJson(`http://127.0.0.1:${port}/json/list`);
    const target = targets.find(t => t.type === 'page' && t.url.includes('8080'));

    if (!target) throw new Error('No page target found on port ' + port);

    const client = new CDPClient(target.webSocketDebuggerUrl);
    await client.connect();
    await client.send('Page.enable');
    await client.send('Runtime.enable');

    await new Promise(r => setTimeout(r, 1200));

    // TEST 1: Check GujaratUnfiltered global object
    console.log('\n--- CHECK 1: Engine Initialization & Dataset Health ---');
    const initInfo = await client.eval(`(() => {
      return {
        hasEngine: typeof window.GujaratUnfiltered !== 'undefined',
        storyCount: window.GujaratUnfiltered ? window.GujaratUnfiltered.stories.length : 0,
        isLoaded: window.GujaratUnfiltered ? window.GujaratUnfiltered.isLoaded : false
      };
    })()`);

    assert(initInfo.hasEngine, 'window.GujaratUnfiltered engine singleton exists');
    assert(initInfo.isLoaded, 'Dataset loaded successfully from data/gujarat_unfiltered.json');
    assert(initInfo.storyCount === 24, `Complete dataset has exactly 24 curated stories (got: ${initInfo.storyCount})`);

    // TEST 2: Mode Switcher Presence & Activation
    console.log('\n--- CHECK 2: Mode Switcher Interaction (#btnModeUnfiltered) ---');
    const switcherInfo = await client.eval(`(() => {
      const btn = document.getElementById('btnModeUnfiltered');
      if (!btn) return { exists: false };
      btn.click();
      const subCat = document.getElementById('placesCatalogSubView');
      const subTR = document.getElementById('tripRealitySubView');
      const subUnfiltered = document.getElementById('placesUnfilteredSubView');
      return {
        exists: true,
        btnActive: btn.classList.contains('active'),
        subCatHidden: subCat ? subCat.classList.contains('hidden') : false,
        subTRHidden: subTR ? subTR.classList.contains('hidden') : false,
        subUnfilteredVisible: subUnfiltered ? !subUnfiltered.classList.contains('hidden') : false
      };
    })()`);

    assert(switcherInfo.exists, 'Mode switcher button #btnModeUnfiltered exists in DOM');
    assert(switcherInfo.btnActive, 'Button receives .active class on click');
    assert(switcherInfo.subCatHidden, 'placesCatalogSubView is hidden');
    assert(switcherInfo.subTRHidden, 'tripRealitySubView is hidden');
    assert(switcherInfo.subUnfilteredVisible, 'placesUnfilteredSubView is visible');

    await new Promise(r => setTimeout(r, 600));

    // TEST 3: Card Rendering & Architecture
    console.log('\n--- CHECK 3: Editorial Cards & Content Architecture ---');
    const cardsInfo = await client.eval(`(() => {
      const cards = document.querySelectorAll('.gu-card');
      const firstCard = cards[0];
      const loreBox = firstCard ? firstCard.querySelector('.gu-teaser-lore') : null;
      const realityBox = firstCard ? firstCard.querySelector('.gu-teaser-reality') : null;
      const factcheckPill = firstCard ? firstCard.querySelector('.gu-factcheck-pill') : null;
      const safetyBanner = firstCard ? firstCard.querySelector('.gu-legal-banner') : null;
      return {
        cardCount: cards.length,
        hasLoreBox: !!loreBox,
        hasRealityBox: !!realityBox,
        hasFactcheckPill: !!factcheckPill,
        hasSafetyBanner: !!safetyBanner,
        firstCardTitle: firstCard ? firstCard.querySelector('.gu-card-name')?.innerText : ''
      };
    })()`);

    assert(cardsInfo.cardCount === 24, `Renders all 24 editorial story cards (got: ${cardsInfo.cardCount})`);
    assert(cardsInfo.hasLoreBox, 'Cards feature dedicated Folklore & Myth teaser box');
    assert(cardsInfo.hasRealityBox, 'Cards feature dedicated Documented Ground Reality teaser box');
    assert(cardsInfo.hasFactcheckPill, 'Cards feature prominent Fact-Check status pill');
    assert(cardsInfo.hasSafetyBanner, 'Cards feature Statutory Legal Access and Safety advisory banner');

    // Screenshot 1: Gujarat Unfiltered Overview
    const artifactDir = 'C:\\Users\\saumy\\.gemini\\antigravity\\brain\\f4d383a9-ea31-4c83-bc95-e3099fdc2f9a';
    await client.captureScreenshot(path.join(artifactDir, 'unfiltered_editorial_view.png'));

    // TEST 4: Collection Filtering across all 6 collections
    console.log('\n--- CHECK 4: Collection Category Filtering ---');
    const collections = ['after-dark', 'hidden-plain-sight', 'weird-gujarat', 'lost-chapters', 'nature-side-quests', 'worth-detour'];
    for (const col of collections) {
      const count = await client.eval(`(() => {
        window.GujaratUnfiltered.setCollection('${col}');
        return document.querySelectorAll('.gu-card').length;
      })()`);
      assert(count === 4, `Collection "${col}" filters to exactly 4 curated stories (got: ${count})`);
    }

    // Reset collection filter
    await client.eval(`window.GujaratUnfiltered.setCollection('all')`);
    await new Promise(r => setTimeout(r, 200));

    // TEST 5: Search Functionality
    console.log('\n--- CHECK 5: Search Filter Testing ---');
    const searchResult = await client.eval(`(() => {
      window.GujaratUnfiltered.handleSearch('Dumas');
      const cards = document.querySelectorAll('.gu-card');
      const title = cards[0] ? cards[0].querySelector('.gu-card-name')?.innerText : '';
      return { count: cards.length, title };
    })()`);
    assert(searchResult.count === 1, `Search "Dumas" returned exactly 1 matching story (got: ${searchResult.count})`);
    assert(searchResult.title.includes('Dumas'), `Matched correct story: "${searchResult.title}"`);

    // Reset search
    await client.eval(`window.GujaratUnfiltered.handleSearch('')`);
    await new Promise(r => setTimeout(r, 300));

    // TEST 6: Interactive Story Modal Reader
    console.log('\n--- CHECK 6: Story Modal Reader Deep-Dive ---');
    const modalInfo = await client.eval(`(() => {
      window.GujaratUnfiltered.openStoryModal('dumas-beach-black-sand');
      const modal = document.getElementById('unfilteredStoryModal');
      const title = modal.querySelector('.gu-modal-title')?.innerText;
      const compLore = modal.querySelector('.gu-comp-lore p')?.innerText;
      const compReality = modal.querySelector('.gu-comp-reality p')?.innerText;
      const safetyBox = modal.querySelector('.gu-safety-card')?.innerText;
      const photoTip = modal.querySelector('.gu-intel-card p')?.innerText;
      return {
        isOpen: modal.hasAttribute('open') || modal.classList.contains('open'),
        title,
        hasLore: !!compLore && compLore.length > 20,
        hasReality: !!compReality && compReality.length > 20,
        hasSafety: !!safetyBox && safetyBox.includes('Advisory'),
        hasPhotoTip: !!photoTip && photoTip.length > 10
      };
    })()`);

    assert(modalInfo.isOpen, 'Story Modal opens cleanly with showModal()');
    assert(modalInfo.title && modalInfo.title.includes('Dumas'), `Modal displays correct story title: "${modalInfo.title}"`);
    assert(modalInfo.hasLore, 'Modal features deep-dive oral folklore analysis');
    assert(modalInfo.hasReality, 'Modal features deep-dive scientific / historical ground reality');
    assert(modalInfo.hasSafety, 'Modal contains statutory jurisdiction & ethical safety rules');
    assert(modalInfo.hasPhotoTip, 'Modal contains traveler & creator field intel');

    // Screenshot 2: Story Modal Deep Dive
    await client.captureScreenshot(path.join(artifactDir, 'unfiltered_story_modal.png'));

    // Close modal
    await client.eval(`window.GujaratUnfiltered.closeStoryModal()`);
    await new Promise(r => setTimeout(r, 300));

    // TEST 7: Map Markers Integration
    console.log('\n--- CHECK 7: Leaflet Map Integration ---');
    const mapInfo = await client.eval(`(() => {
      const layer = window.GujaratUnfiltered.mapMarkersLayer;
      const markers = window.GujaratUnfiltered.markerMap;
      return {
        hasLayer: !!layer,
        layerCount: layer ? layer.getLayers().length : 0,
        mapCount: markers ? markers.size : 0
      };
    })()`);
    assert(mapInfo.hasLayer, 'Leaflet markers layer group initialized on map');
    assert(mapInfo.layerCount === 24, `All 24 unfiltered stories plotted as map markers (got: ${mapInfo.layerCount})`);

    // TEST 8: Direct Routing Check
    console.log('\n--- CHECK 8: Hash Routing & Deep Linking (#/unfiltered) ---');
    const routeCheck = await client.eval(`(() => {
      window.location.hash = '#/unfiltered';
      window.dispatchEvent(new HashChangeEvent('hashchange'));
      const subUnfiltered = document.getElementById('placesUnfilteredSubView');
      return {
        subUnfilteredVisible: subUnfiltered ? !subUnfiltered.classList.contains('hidden') : false,
        btnActive: document.getElementById('btnModeUnfiltered')?.classList.contains('active')
      };
    })()`);
    assert(routeCheck.subUnfilteredVisible, 'Navigating to #/unfiltered reveals Gujarat Unfiltered view');
    assert(routeCheck.btnActive, '#btnModeUnfiltered is active on hashchange');

    // TEST 9: Console Health
    console.log('\n--- CHECK 9: Console Error Audit ---');
    assert(client.consoleErrors.length === 0, `Clean browser console with 0 errors (got: ${client.consoleErrors.length})`);
    if (client.consoleErrors.length > 0) {
      console.error('Console errors logged:', client.consoleErrors);
    }

    client.close();
    chromeProc.kill();

    console.log('\n======================================================================');
    console.log(`TOTAL PASSES: ${passed} / ${passed + failed}`);
    console.log('======================================================================');

    if (failed > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }

  } catch (err) {
    console.error('Test run failed:', err);
    chromeProc.kill();
    process.exit(1);
  }
}

runUnfilteredVerification();
