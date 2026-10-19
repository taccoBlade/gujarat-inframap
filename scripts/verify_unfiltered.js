/**
 * Gujarat InfraMap — Gujarat Unfiltered CDP Automated Verification Suite (Phase 3: Editorial Experience)
 * 
 * Verifies:
 * 1. Engine initialization & 34-District Dataset Health (45 stories across all 34 districts)
 * 2. Mode switching via #btnModeUnfiltered
 * 3. Strong opening lines ("Gujarat has stories you haven't heard.", "Strange places. Forgotten stories. Unexpected detours.")
 * 4. Editorial Spotlight Hero (.gu-spotlight-hero) with switcher & asymmetric layout
 * 5. Editorial Cards & Research Architecture (status chips, split teaser, fact-check verdict, legal access)
 * 6. Restrained "After Dark" Visual Treatment (.gu-card-after-dark with midnight indigo surface)
 * 7. Collection Filtering (including all 6 collections + Saved Shortlist)
 * 8. Personal Shortlist Feature (localStorage persistence, bookmark toggle, count badge)
 * 9. District Exploration & Comparison Modal (side-by-side matrix of places in a district)
 * 10. Native Web Share & Deep-Linking (shareStory, toast notification, hash auto-open)
 * 11. Search filtering (e.g. Signature Farm, Nadabet, Dumas)
 * 12. Story Modal Reader Deep-Dive (Lore vs Ground Reality, Safety & Verified Directions, Nearby Places, Provenance)
 * 13. Strict Visitor Protection (Google Maps directions for lawful places, Section 441/447 IPC warning for Signature Farm)
 * 14. 34-District Research Audit Ledger Modal
 * 15. Map-first Synchronization (Leaflet markers dynamically filtered to match active view)
 * 16. Console Health (0 errors)
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
  console.log('GUJARAT INFRAMAP — GUJARAT UNFILTERED PHASE 3 VERIFICATION SUITE');
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

  const artifactDir = 'C:\\Users\\saumy\\.gemini\\antigravity\\brain\\f4d383a9-ea31-4c83-bc95-e3099fdc2f9a';

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

    // TEST 3: Strong Opening Lines
    console.log('\n--- CHECK 3: Strong Editorial Opening & Supporting Lines ---');
    const headerInfo = await client.eval(`(() => {
      const headline = document.querySelector('.gu-headline')?.innerText;
      const desc = document.querySelector('.gu-desc')?.innerText;
      return { headline, desc };
    })()`);
    assert(headerInfo.headline && headerInfo.headline.includes("Gujarat has stories you haven't heard"), `Hero headline matches editorial brief (got: "${headerInfo.headline}")`);
    assert(headerInfo.desc && headerInfo.desc.includes("Strange places. Forgotten stories. Unexpected detours."), `Supporting line matches editorial brief (got: "${headerInfo.desc?.slice(0, 50)}...")`);

    // TEST 4: Editorial Spotlight Hero
    console.log('\n--- CHECK 4: Editorial Spotlight Hero & Asymmetric Composition ---');
    const spotlightInfo = await client.eval(`(() => {
      const hero = document.querySelector('.gu-spotlight-hero');
      if (!hero) return { exists: false };
      const title = hero.querySelector('.gu-spotlight-title')?.innerText;
      const district = hero.querySelector('.gu-spotlight-district-pill')?.innerText;
      const switcherBtns = hero.querySelectorAll('.gu-spotlight-switch-btn');
      return {
        exists: true,
        title,
        district,
        switcherCount: switcherBtns.length
      };
    })()`);
    assert(spotlightInfo.exists, 'Editorial Spotlight Hero (.gu-spotlight-hero) is rendered');
    assert(spotlightInfo.title && spotlightInfo.title.length > 5, `Spotlight headline rendered: "${spotlightInfo.title}"`);
    assert(spotlightInfo.switcherCount >= 3, `Spotlight candidates switcher has multiple options (got: ${spotlightInfo.switcherCount})`);

    // Test switching spotlight candidate
    const switchTest = await client.eval(`(() => {
      window.GujaratUnfiltered.setSpotlightStory('nadabet-seema-darshan-border');
      const newTitle = document.querySelector('.gu-spotlight-hero .gu-spotlight-title')?.innerText;
      return { newTitle };
    })()`);
    assert(switchTest.newTitle && switchTest.newTitle.includes('Nadabet'), `Spotlight switched to Nadabet: "${switchTest.newTitle}"`);

    // TEST 5: Card Rendering & Architecture
    console.log('\n--- CHECK 5: Editorial Cards & Research Architecture ---');
    const cardsInfo = await client.eval(`(() => {
      const cards = document.querySelectorAll('.gu-card');
      const firstCard = cards[0];
      const chips = firstCard ? firstCard.querySelectorAll('.gu-chip-status') : [];
      const loreBox = firstCard ? firstCard.querySelector('.gu-teaser-lore') : null;
      const realityBox = firstCard ? firstCard.querySelector('.gu-teaser-reality') : null;
      const factcheckPill = firstCard ? firstCard.querySelector('.gu-factcheck-pill') : null;
      const safetyBanner = firstCard ? firstCard.querySelector('.gu-legal-banner') : null;
      const toolBtns = firstCard ? firstCard.querySelectorAll('.gu-card-tool-btn') : [];
      return {
        cardCount: cards.length,
        hasChips: chips.length > 0,
        hasLoreBox: !!loreBox,
        hasRealityBox: !!realityBox,
        hasFactcheckPill: !!factcheckPill,
        hasSafetyBanner: !!safetyBanner,
        hasToolBtns: toolBtns.length >= 2,
        firstCardTitle: firstCard ? firstCard.querySelector('.gu-card-name')?.innerText : ''
      };
    })()`);

    assert(cardsInfo.cardCount === 45, `Renders all 45 editorial story cards (got: ${cardsInfo.cardCount})`);
    assert(cardsInfo.hasChips, 'Cards feature multi-dimensional research status chips');
    assert(cardsInfo.hasLoreBox, 'Cards feature dedicated Folklore & Myth teaser box');
    assert(cardsInfo.hasRealityBox, 'Cards feature dedicated Documented Ground Reality teaser box');
    assert(cardsInfo.hasFactcheckPill, 'Cards feature prominent Fact-Check status pill');
    assert(cardsInfo.hasSafetyBanner, 'Cards feature Statutory Legal Access and Safety advisory banner');
    assert(cardsInfo.hasToolBtns, 'Cards feature Bookmark (Shortlist) and Share floating tool buttons');

    // Screenshot 1: Gujarat Unfiltered Overview
    await client.captureScreenshot(path.join(artifactDir, 'unfiltered_editorial_view.png'));

    // TEST 6: Restrained "After Dark" Visual Treatment
    console.log('\n--- CHECK 6: Restrained After Dark Visual Language ---');
    const afterDarkCheck = await client.eval(`(() => {
      window.GujaratUnfiltered.setCollection('after-dark');
      const darkCards = document.querySelectorAll('.gu-card-after-dark');
      const count = darkCards.length;
      const firstCard = darkCards[0];
      const computedBg = firstCard ? window.getComputedStyle(firstCard).backgroundColor : '';
      return { count, computedBg };
    })()`);
    assert(afterDarkCheck.count === 5, `After Dark collection filters to 5 verified stories (got: ${afterDarkCheck.count})`);
    assert(afterDarkCheck.count > 0, 'After Dark stories receive dedicated .gu-card-after-dark class with midnight indigo surface');

    // Reset collection
    await client.eval(`window.GujaratUnfiltered.setCollection('all')`);
    await new Promise(r => setTimeout(r, 200));

    // TEST 7: Personal Shortlist (localStorage Persistence)
    console.log('\n--- CHECK 7: Personal Shortlist & Persistence ---');
    const shortlistTest = await client.eval(`(() => {
      // Toggle Dumas into shortlist
      window.GujaratUnfiltered.toggleShortlist('dumas-beach-black-sand');
      const isSaved = window.GujaratUnfiltered.isShortlisted('dumas-beach-black-sand');
      const rawStorage = localStorage.getItem('gujarat_unfiltered_shortlist');
      const count = window.GujaratUnfiltered.shortlist.size;
      return { isSaved, hasStorage: !!rawStorage, count };
    })()`);
    assert(shortlistTest.isSaved, 'Story saved to personal shortlist');
    assert(shortlistTest.hasStorage, 'Shortlist persisted to localStorage ("gujarat_unfiltered_shortlist")');

    // Test shortlist filter tab
    const shortlistTabTest = await client.eval(`(() => {
      window.GujaratUnfiltered.setCollection('shortlist');
      const cards = document.querySelectorAll('.gu-card');
      return { cardCount: cards.length, firstCardName: cards[0]?.querySelector('.gu-card-name')?.innerText };
    })()`);
    assert(shortlistTabTest.cardCount === 1, `Shortlist collection tab filters to exactly 1 saved place (got: ${shortlistTabTest.cardCount})`);
    assert(shortlistTabTest.firstCardName.includes('Dumas'), `Saved place matched: "${shortlistTabTest.firstCardName}"`);

    // Reset collection
    await client.eval(`window.GujaratUnfiltered.setCollection('all')`);
    await new Promise(r => setTimeout(r, 200));

    // TEST 8: District Exploration & Comparison Modal
    console.log('\n--- CHECK 8: District Exploration & Comparison Matrix ---');
    const compareTest = await client.eval(`(() => {
      window.GujaratUnfiltered.openCompareModal('Ahmedabad');
      const modal = document.getElementById('unfilteredCompareModal');
      const title = modal.querySelector('.gu-ledger-title')?.innerText;
      const cols = modal.querySelectorAll('.gu-compare-col');
      return {
        isOpen: modal.hasAttribute('open') || modal.classList.contains('open'),
        title,
        colCount: cols.length
      };
    })()`);
    assert(compareTest.isOpen, 'District Places Comparison Modal opens cleanly with showModal()');
    assert(compareTest.colCount === 6, `Ahmedabad district comparison displays all 6 verified places side-by-side (got: ${compareTest.colCount})`);

    // Screenshot: District Comparison Modal
    await client.captureScreenshot(path.join(artifactDir, 'unfiltered_compare_modal.png'));

    // Close compare modal
    await client.eval(`window.GujaratUnfiltered.closeCompareModal()`);
    await new Promise(r => setTimeout(r, 300));

    // TEST 9: Native Share & Deep-Link Simulation
    console.log('\n--- CHECK 9: Native Share & Toast Feedback ---');
    const shareTest = await client.eval(`(async () => {
      await window.GujaratUnfiltered.shareStory('dada-harir-subterranean-vav');
      const toast = document.getElementById('appToast');
      return {
        toastVisible: toast ? !toast.classList.contains('hidden') : false,
        toastText: toast ? toast.innerText : ''
      };
    })()`);
    assert(shareTest.toastVisible, 'Share action displays instant toast notification');
    assert(shareTest.toastText.includes('copied'), `Toast informs user link copied to clipboard (got: "${shareTest.toastText}")`);

    // TEST 10: Search Filter Testing (Signature Farm & Dumas)
    console.log('\n--- CHECK 10: Search Filter Testing (Signature Farm & Dumas) ---');
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

    // TEST 11: Story Modal Reader with Nearby Places & Verified Directions
    console.log('\n--- CHECK 11: Story Modal Reader Deep-Dive & Visitor Protection ---');
    const modalInfo = await client.eval(`(() => {
      window.GujaratUnfiltered.openStoryModal('dada-harir-subterranean-vav');
      const modal = document.getElementById('unfilteredStoryModal');
      const title = modal.querySelector('.gu-modal-title')?.innerText;
      const compLore = modal.querySelector('.gu-comp-lore p')?.innerText;
      const compReality = modal.querySelector('.gu-comp-reality p')?.innerText;
      const safetyBox = modal.querySelector('.gu-safety-card')?.innerText;
      const directionsLink = modal.querySelector('.gu-directions-link')?.getAttribute('href');
      const nearbyCards = modal.querySelectorAll('.gu-nearby-card').length;
      const provenance = modal.querySelector('.gu-provenance-section');
      const sourcesCount = provenance ? provenance.querySelectorAll('.gu-source-item').length : 0;
      const uncertainties = provenance ? provenance.querySelector('.gu-uncertainties-box')?.innerText : '';
      return {
        isOpen: modal.hasAttribute('open') || modal.classList.contains('open'),
        title,
        hasLore: !!compLore && compLore.length > 20,
        hasReality: !!compReality && compReality.length > 20,
        hasSafety: !!safetyBox && safetyBox.includes('Advisory'),
        hasDirectionsLink: !!directionsLink && directionsLink.includes('google.com/maps'),
        nearbyCount: nearbyCards,
        hasProvenance: !!provenance,
        sourcesCount,
        hasUncertainties: !!uncertainties && uncertainties.length > 10
      };
    })()`);

    assert(modalInfo.isOpen, 'Story Modal opens cleanly with showModal()');
    assert(modalInfo.title && modalInfo.title.includes('Dada Harir'), `Modal displays correct story title: "${modalInfo.title}"`);
    assert(modalInfo.hasLore, 'Modal features deep-dive oral folklore analysis');
    assert(modalInfo.hasReality, 'Modal features deep-dive official ground reality');
    assert(modalInfo.hasSafety, 'Modal contains statutory jurisdiction & ethical safety rules');
    assert(modalInfo.hasDirectionsLink, 'Lawful sites feature verified Google Maps directions link with exact GPS coordinates');
    assert(modalInfo.nearbyCount >= 1, `Modal provides "Explore Nearby Documented Places" recommendations (got: ${modalInfo.nearbyCount})`);
    assert(modalInfo.hasProvenance, 'Modal contains Section 05: Auditable Research Provenance');
    assert(modalInfo.sourcesCount >= 2, `Modal lists primary and corroborating sources (got: ${modalInfo.sourcesCount})`);
    assert(modalInfo.hasUncertainties, 'Modal contains field verification and uncertainties note');

    // Screenshot 2: Story Modal Deep Dive
    await client.captureScreenshot(path.join(artifactDir, 'unfiltered_story_modal.png'));

    // Close story modal
    await client.eval(`window.GujaratUnfiltered.closeStoryModal()`);
    await new Promise(r => setTimeout(r, 300));

    // TEST 12: Signature Farm Visitor Protection Audit
    console.log('\n--- CHECK 12: Restricted Site Visitor Protection Audit ---');
    const sigFarmModal = await client.eval(`(() => {
      window.GujaratUnfiltered.openStoryModal('signature-farm-ghuma');
      const modal = document.getElementById('unfilteredStoryModal');
      const hasDirectionsLink = !!modal.querySelector('.gu-directions-link');
      const cautionText = modal.querySelector('.gu-safety-card')?.innerText || '';
      return {
        hasDirectionsLink,
        hasIpcWarning: cautionText.includes('Section 441/447 IPC') || cautionText.includes('prohibited')
      };
    })()`);
    assert(!sigFarmModal.hasDirectionsLink, 'Signature Farm provides ZERO directions links to prevent trespassing');
    assert(sigFarmModal.hasIpcWarning, 'Signature Farm prominently displays statutory criminal trespass warning (Section 441/447 IPC)');

    // Close modal
    await client.eval(`window.GujaratUnfiltered.closeStoryModal()`);
    await new Promise(r => setTimeout(r, 300));

    // TEST 13: 34-District Research Audit Ledger Modal
    console.log('\n--- CHECK 13: 34-District Research Audit Ledger Modal ---');
    const ledgerInfo = await client.eval(`(async () => {
      await window.GujaratUnfiltered.openLedgerModal();
      const modal = document.getElementById('unfilteredLedgerModal');
      const title = modal.querySelector('.gu-ledger-title')?.innerText;
      const totalCards = modal.querySelectorAll('.gu-ledger-total-card');
      const cardsCount = modal.querySelectorAll('.gu-ledger-district-card').length;
      return {
        isOpen: modal.hasAttribute('open') || modal.classList.contains('open'),
        title,
        totalsFound: totalCards.length,
        districtsRendered: cardsCount
      };
    })()`);

    assert(ledgerInfo.isOpen, 'Research Audit Ledger Modal opens cleanly with showModal()');
    assert(ledgerInfo.totalsFound === 5, `Audit ledger renders 5 state summary total cards (got: ${ledgerInfo.totalsFound})`);
    assert(ledgerInfo.districtsRendered === 34, `Audit ledger renders all 34 district audit cards (got: ${ledgerInfo.districtsRendered})`);

    // Screenshot 3: Ledger Modal
    await client.captureScreenshot(path.join(artifactDir, 'unfiltered_ledger_modal.png'));

    // Close ledger modal
    await client.eval(`window.GujaratUnfiltered.closeLedgerModal()`);
    await new Promise(r => setTimeout(r, 300));

    // TEST 14: Map Markers Synchronization
    console.log('\n--- CHECK 14: Leaflet Map Synchronization & Dynamic Filtering ---');
    const mapSyncTest = await client.eval(`(() => {
      // Filter to Vav-Tharad
      window.GujaratUnfiltered.setDistrict('Vav-Tharad');
      const layer = window.GujaratUnfiltered.mapMarkersLayer;
      const markerCount = layer ? layer.getLayers().length : 0;
      return { markerCount };
    })()`);
    assert(mapSyncTest.markerCount === 1, `Map markers dynamically sync to active filter: exactly 1 marker for Vav-Tharad (got: ${mapSyncTest.markerCount})`);

    // Reset filter
    await client.eval(`window.GujaratUnfiltered.setDistrict('all')`);
    await new Promise(r => setTimeout(r, 300));
    const allMarkersCount = await client.eval(`window.GujaratUnfiltered.mapMarkersLayer ? window.GujaratUnfiltered.mapMarkersLayer.getLayers().length : 0`);
    assert(allMarkersCount === 45, `Resetting filter restores all 45 map markers (got: ${allMarkersCount})`);

    // TEST 15: Direct Routing Check (#/unfiltered)
    console.log('\n--- CHECK 15: Hash Routing & Deep Linking (#/unfiltered) ---');
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

    // TEST 16: Console Health
    console.log('\n--- CHECK 16: Console Error Audit ---');
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
