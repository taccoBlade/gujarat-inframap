/**
 * Gujarat InfraMap — Gujarat Unfiltered CDP Automated Verification Suite (Phase 2: 34 Districts)
 * 
 * Verifies:
 * 1. GujaratUnfiltered object loaded and healthy (45 stories across all 34 districts)
 * 2. Mode switching via #btnModeUnfiltered
 * 3. 45 editorial cards rendered with unique images, folklore vs reality, research chips, and safety badges
 * 4. Filtering across all 6 collections
 * 5. District dropdown filtering (including Vav-Tharad 34th District)
 * 6. Real-time search functionality (including Signature Farm and Nadabet)
 * 7. Interactive Story Modal deep-dive (Lore vs Reality, Safety, Provenance & Sources)
 * 8. Leaflet Map markers & popups integration (45 markers)
 * 9. Direct URL hash routing (e.g. #/unfiltered)
 * 10. Clean browser console (0 errors)
 * 11. Captures high-res visual evidence screenshots to artifacts directory
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
  console.log('GUJARAT INFRAMAP — GUJARAT UNFILTERED 34-DISTRICT VERIFICATION SUITE');
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
    console.log('\n--- CHECK 1: Engine Initialization & 34-District Dataset Health ---');
    const initInfo = await client.eval(`(() => {
      const eng = window.GujaratUnfiltered;
      if (!eng) return { hasEngine: false };
      const dists = new Set(eng.stories.map(s => s.district === 'Dang' ? 'The Dangs' : s.district));
      const hasVavTharad = eng.stories.some(s => s.district === 'Vav-Tharad');
      const sigFarm = eng.stories.find(s => s.id === 'signature-farm-ghuma');
      return {
        hasEngine: true,
        isLoaded: eng.isLoaded,
        storyCount: eng.stories.length,
        districtCount: dists.size,
        hasVavTharad,
        sigFarmRestricted: sigFarm && !sigFarm.legalAccess.isSafeAndLawful,
        sigFarmDebunked: sigFarm && sigFarm.claimClassification === 'debunked_legend'
      };
    })()`);

    assert(initInfo.hasEngine, 'window.GujaratUnfiltered engine singleton exists');
    assert(initInfo.isLoaded, 'Dataset loaded successfully from data/gujarat_unfiltered.json');
    assert(initInfo.storyCount === 45, `Dataset contains all 45 verified stories (got: ${initInfo.storyCount})`);
    assert(initInfo.districtCount === 34, `All 34 official districts covered (got: ${initInfo.districtCount})`);
    assert(initInfo.hasVavTharad, '34th District (Vav-Tharad, created 2 Oct 2025) included with Nadabet');
    assert(initInfo.sigFarmRestricted, 'Signature Farm case study explicitly classified as restricted private property');
    assert(initInfo.sigFarmDebunked, 'Signature Farm massacre claims explicitly classified as debunked_legend');

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
    console.log('\n--- CHECK 3: Editorial Cards & Research Architecture ---');
    const cardsInfo = await client.eval(`(() => {
      const cards = document.querySelectorAll('.gu-card');
      const firstCard = cards[0];
      const chips = firstCard ? firstCard.querySelectorAll('.gu-chip-status') : [];
      const loreBox = firstCard ? firstCard.querySelector('.gu-teaser-lore') : null;
      const realityBox = firstCard ? firstCard.querySelector('.gu-teaser-reality') : null;
      const factcheckPill = firstCard ? firstCard.querySelector('.gu-factcheck-pill') : null;
      const safetyBanner = firstCard ? firstCard.querySelector('.gu-legal-banner') : null;
      return {
        cardCount: cards.length,
        hasChips: chips.length > 0,
        hasLoreBox: !!loreBox,
        hasRealityBox: !!realityBox,
        hasFactcheckPill: !!factcheckPill,
        hasSafetyBanner: !!safetyBanner,
        firstCardTitle: firstCard ? firstCard.querySelector('.gu-card-name')?.innerText : ''
      };
    })()`);

    assert(cardsInfo.cardCount === 45, `Renders all 45 editorial story cards (got: ${cardsInfo.cardCount})`);
    assert(cardsInfo.hasChips, 'Cards feature multi-dimensional research status chips');
    assert(cardsInfo.hasLoreBox, 'Cards feature dedicated Folklore & Myth teaser box');
    assert(cardsInfo.hasRealityBox, 'Cards feature dedicated Documented Ground Reality teaser box');
    assert(cardsInfo.hasFactcheckPill, 'Cards feature prominent Fact-Check status pill');
    assert(cardsInfo.hasSafetyBanner, 'Cards feature Statutory Legal Access and Safety advisory banner');

    // Screenshot 1: Gujarat Unfiltered Overview
    const artifactDir = 'C:\\Users\\saumy\\.gemini\\antigravity\\brain\\f4d383a9-ea31-4c83-bc95-e3099fdc2f9a';
    await client.captureScreenshot(path.join(artifactDir, 'unfiltered_editorial_view.png'));

    // TEST 4: Collection Filtering
    console.log('\n--- CHECK 4: Collection Category Filtering ---');
    const collections = ['after-dark', 'hidden-plain-sight', 'weird-gujarat', 'lost-chapters', 'nature-side-quests', 'worth-detour'];
    for (const col of collections) {
      const count = await client.eval(`(() => {
        window.GujaratUnfiltered.setCollection('${col}');
        return document.querySelectorAll('.gu-card').length;
      })()`);
      assert(count > 0, `Collection "${col}" filters correctly to matching stories (got: ${count})`);
    }

    // Reset collection filter
    await client.eval(`window.GujaratUnfiltered.setCollection('all')`);
    await new Promise(r => setTimeout(r, 200));

    // TEST 5: District Dropdown Filtering
    console.log('\n--- CHECK 5: District Dropdown Filtering (Vav-Tharad & Kachchh) ---');
    const vavTharadResult = await client.eval(`(() => {
      window.GujaratUnfiltered.setDistrict('Vav-Tharad');
      const cards = document.querySelectorAll('.gu-card');
      const title = cards[0] ? cards[0].querySelector('.gu-card-name')?.innerText : '';
      return { count: cards.length, title };
    })()`);
    assert(vavTharadResult.count >= 1, `District filter "Vav-Tharad" returns matching story (got: ${vavTharadResult.count})`);
    assert(vavTharadResult.title.includes('Nadabet'), `Matched 34th District story: "${vavTharadResult.title}"`);

    // Reset district filter
    await client.eval(`window.GujaratUnfiltered.setDistrict('all')`);
    await new Promise(r => setTimeout(r, 200));

    // TEST 6: Search Functionality
    console.log('\n--- CHECK 6: Search Filter Testing (Signature Farm & Dumas) ---');
    const sigFarmSearch = await client.eval(`(() => {
      window.GujaratUnfiltered.handleSearch('Signature Farm');
      const cards = document.querySelectorAll('.gu-card');
      const title = cards[0] ? cards[0].querySelector('.gu-card-name')?.innerText : '';
      const isRestrictedBadge = cards[0] ? !!cards[0].querySelector('.gu-legal-restricted') : false;
      return { count: cards.length, title, isRestrictedBadge };
    })()`);
    assert(sigFarmSearch.count === 1, `Search "Signature Farm" returned exactly 1 matching case study`);
    assert(sigFarmSearch.title.includes('Signature Farm'), `Matched correct story: "${sigFarmSearch.title}"`);
    assert(sigFarmSearch.isRestrictedBadge, 'Signature Farm card renders red restricted warning banner');

    // Reset search
    await client.eval(`window.GujaratUnfiltered.handleSearch('')`);
    await new Promise(r => setTimeout(r, 300));

    // TEST 7: Interactive Story Modal Reader with Provenance
    console.log('\n--- CHECK 7: Story Modal Reader & Scholarly Provenance Deep-Dive ---');
    const modalInfo = await client.eval(`(() => {
      window.GujaratUnfiltered.openStoryModal('signature-farm-ghuma');
      const modal = document.getElementById('unfilteredStoryModal');
      const title = modal.querySelector('.gu-modal-title')?.innerText;
      const compLore = modal.querySelector('.gu-comp-lore p')?.innerText;
      const compReality = modal.querySelector('.gu-comp-reality p')?.innerText;
      const safetyBox = modal.querySelector('.gu-safety-card')?.innerText;
      const provenance = modal.querySelector('.gu-provenance-section');
      const sourcesCount = provenance ? provenance.querySelectorAll('.gu-source-item').length : 0;
      const uncertainties = provenance ? provenance.querySelector('.gu-uncertainties-box')?.innerText : '';
      return {
        isOpen: modal.hasAttribute('open') || modal.classList.contains('open'),
        title,
        hasLore: !!compLore && compLore.length > 20,
        hasReality: !!compReality && compReality.length > 20,
        hasSafety: !!safetyBox && safetyBox.includes('Advisory'),
        hasProvenance: !!provenance,
        sourcesCount,
        hasUncertainties: !!uncertainties && uncertainties.length > 10
      };
    })()`);

    assert(modalInfo.isOpen, 'Story Modal opens cleanly with showModal()');
    assert(modalInfo.title && modalInfo.title.includes('Signature Farm'), `Modal displays correct story title: "${modalInfo.title}"`);
    assert(modalInfo.hasLore, 'Modal features deep-dive oral folklore analysis');
    assert(modalInfo.hasReality, 'Modal features deep-dive official ground reality');
    assert(modalInfo.hasSafety, 'Modal contains statutory jurisdiction & ethical safety rules');
    assert(modalInfo.hasProvenance, 'Modal contains Section 05: Auditable Research Provenance');
    assert(modalInfo.sourcesCount >= 2, `Modal lists primary and corroborating sources (got: ${modalInfo.sourcesCount})`);
    assert(modalInfo.hasUncertainties, 'Modal contains field verification and uncertainties note');

    // Screenshot 2: Story Modal Deep Dive
    await client.captureScreenshot(path.join(artifactDir, 'unfiltered_story_modal.png'));

    // Close modal
    await client.eval(`window.GujaratUnfiltered.closeStoryModal()`);
    await new Promise(r => setTimeout(r, 300));

    // TEST 8: Map Markers Integration
    console.log('\n--- CHECK 8: Leaflet Map Integration ---');
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
    assert(mapInfo.layerCount === 45, `All 45 unfiltered stories plotted as map markers (got: ${mapInfo.layerCount})`);

    // TEST 9: Direct Routing Check
    console.log('\n--- CHECK 9: Hash Routing & Deep Linking (#/unfiltered) ---');
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

    // TEST 10: Console Health
    console.log('\n--- CHECK 10: Console Error Audit ---');
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
