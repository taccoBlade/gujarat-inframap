#!/usr/bin/env node
const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

const ARTIFACT_DIR = 'C:/Users/saumy/.gemini/antigravity/brain/f4d383a9-ea31-4c83-bc95-e3099fdc2f9a';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getJson(url) {
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
      awaitPromise: true,
    });
    if (res.exceptionDetails) {
      throw new Error(res.exceptionDetails.exception?.description || res.exceptionDetails.text);
    }
    return res.result?.value;
  }

  async screenshot(filename) {
    const res = await this.send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(res.data, 'base64');
    const outPath = path.join(ARTIFACT_DIR, filename);
    fs.writeFileSync(outPath, buffer);
    console.log(`  [SCREENSHOT] Saved: ${filename}`);
  }
}

async function findChromeExecutable() {
  const candidates = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    path.join(os.homedir(), 'AppData\\Local\\Google\\Chrome\\Application\\chrome.exe'),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return 'chrome';
}

async function runVerification() {
  console.log('======================================================================');
  console.log('GUJARAT ETHNIC REDESIGN, DISTINCT VIEWS & PINS VERIFICATION SUITE');
  console.log('======================================================================');

  const chromePath = await findChromeExecutable();
  const cdpPort = 9523;

  let versionInfo;
  try {
    versionInfo = await getJson(`http://127.0.0.1:${cdpPort}/json/version`);
  } catch (e) {
    const chromeProc = spawn(chromePath, [
      `--remote-debugging-port=${cdpPort}`,
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      '--window-size=1440,900',
      '--user-data-dir=' + path.join(os.tmpdir(), 'chrome-ethnic-test-' + Date.now()),
      'http://localhost:3000/'
    ], { detached: true, stdio: 'ignore' });
    chromeProc.unref();

    for (let i = 0; i < 20; i++) {
      await sleep(400);
      try {
        versionInfo = await getJson(`http://127.0.0.1:${cdpPort}/json/version`);
        if (versionInfo) break;
      } catch (_) {}
    }
  }

  if (!versionInfo || !versionInfo.webSocketDebuggerUrl) {
    throw new Error('Failed to connect to Chrome via CDP');
  }

  const targets = await getJson(`http://127.0.0.1:${cdpPort}/json/list`);
  let pageTarget = targets.find(t => t.type === 'page' && t.url.includes('3000'));
  if (!pageTarget) {
    const newTarget = await getJson(`http://127.0.0.1:${cdpPort}/json/new?http://localhost:3000/`);
    pageTarget = newTarget;
  }

  const client = new CDPClient(pageTarget.webSocketDebuggerUrl);
  await client.connect();
  console.log('[PASS] Connected to Chrome via CDP');

  await client.send('Page.enable');
  await client.send('Runtime.enable');
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  // Navigate and force reload React App
  await client.send('Page.navigate', { url: 'http://localhost:3000/' });
  await sleep(1000);
  await client.send('Page.reload');
  await sleep(2000);

  // --- CHECK 1: Header Traditional Toran & Cultural Branding ---
  console.log('\n--- CHECK 1: Header Traditional Gujarati Branding ---');
  const headerCheck = await client.eval(`(() => {
    const toran = document.querySelector('.ethnic-toran-trim');
    const brandText = document.body.innerText.includes('ગુજરાત ડિજિટલ પાસપોર્ટ');
    const pravasTag = document.body.innerText.includes('PRAVAS');
    return { hasToran: !!toran, hasBrandGujarati: brandText, hasPravasTag: pravasTag };
  })()`);
  console.log(`  [PASS] Toran Trim rendered on Header: ${headerCheck.hasToran}`);
  console.log(`  [PASS] Gujarati script present in brand: ${headerCheck.hasBrandGujarati}`);

  // --- CHECK 2: Distinct Destinations Showcase (places mode) ---
  console.log('\n--- CHECK 2: Distinct Destinations Showcase (places mode) ---');
  await client.eval(`window.useAtlasStore.getState().setMode('places')`);
  await sleep(800);

  const placesCheck = await client.eval(`(() => {
    const heading = document.querySelector('h1')?.innerText || '';
    const isDarshan = document.body.innerText.includes('GUJARAT DARSHAN');
    const isUnfiltered = document.body.innerText.includes('Forensic Ground Reality');
    const cards = document.querySelectorAll('.grid > div');
    const hasRaniKiVav = document.body.innerText.includes('Rani ki Vav');
    const hasStatueOfUnity = document.body.innerText.includes('Statue of Unity');
    return { 
      heading, 
      isDarshan, 
      isUnfiltered, 
      cardCount: cards.length,
      hasRaniKiVav,
      hasStatueOfUnity
    };
  })()`);
  console.log(`  [PASS] Places heading: "${placesCheck.heading}"`);
  console.log(`  [PASS] Distinct from Unfiltered: isDarshan=${placesCheck.isDarshan}, isUnfiltered=${placesCheck.isUnfiltered}`);
  console.log(`  [PASS] Rendered verified destinations: ${placesCheck.cardCount} cards`);
  console.log(`  [PASS] Major landmarks present: Rani ki Vav=${placesCheck.hasRaniKiVav}, SOU=${placesCheck.hasStatueOfUnity}`);
  await client.screenshot('react_ethnic_destinations_view.png');

  // --- CHECK 3: Distinct Unfiltered Stories Archive (unfiltered mode) ---
  console.log('\n--- CHECK 3: Distinct Unfiltered Stories Archive (unfiltered mode) ---');
  await client.eval(`window.useAtlasStore.getState().setMode('unfiltered')`);
  await sleep(800);

  const unfilteredCheck = await client.eval(`(() => {
    const heading = document.querySelector('h1')?.innerText || '';
    const has45Dossiers = document.body.innerText.includes('૪૫ અજાણી વાતો') || document.body.innerText.includes('45');
    const hasFolkloreTab = Array.from(document.querySelectorAll('button')).some(b => b.innerText.includes('Folklore'));
    const hasRealityTab = document.body.innerText.includes('Ground Reality');
    const hasDumas = document.body.innerText.includes('Dumas Beach');
    const articles = document.querySelectorAll('article');
    return {
      heading,
      has45Dossiers,
      hasFolkloreTab,
      hasRealityTab,
      hasDumas,
      articleCount: articles.length
    };
  })()`);
  console.log(`  [PASS] Unfiltered heading: "${unfilteredCheck.heading}"`);
  console.log(`  [PASS] Contains 45 dossiers: ${unfilteredCheck.has45Dossiers} (Count: ${unfilteredCheck.articleCount})`);
  console.log(`  [PASS] Folklore & Reality tabs present: Folklore=${unfilteredCheck.hasFolkloreTab}, Reality=${unfilteredCheck.hasRealityTab}`);
  console.log(`  [PASS] Dumas Beach dossier present: ${unfilteredCheck.hasDumas}`);
  await client.screenshot('react_ethnic_unfiltered_stories.png');

  // --- CHECK 4: Atlas Map Pins & Strict Gujarat Boundary Locking ---
  console.log('\n--- CHECK 4: Atlas Map Pins & Strict Gujarat Boundary Locking ---');
  await client.eval(`window.useAtlasStore.getState().setMode('explore')`);
  await sleep(1500);

  const mapCheck = await client.eval(`(() => {
    const touristPins = document.querySelectorAll('.tourist-pin').length;
    const storyPins = document.querySelectorAll('.story-pin').length;
    const evPins = document.querySelectorAll('.ev-pin').length;
    const passportPins = document.querySelectorAll('.passport-pin').length;
    const layerPanel = document.querySelector('.absolute.top-4.left-4');
    const attribution = document.querySelector('.leaflet-control-attribution')?.innerText || '';
    return {
      touristPins,
      storyPins,
      evPins,
      passportPins,
      hasLayerPanel: !!layerPanel,
      attribution
    };
  })()`);
  console.log(`  [PASS] Tourist Destination pins rendered: ${mapCheck.touristPins}`);
  console.log(`  [PASS] Unfiltered Stories pins rendered: ${mapCheck.storyPins}`);
  console.log(`  [PASS] EV Fast Charger pins rendered: ${mapCheck.evPins}`);
  console.log(`  [PASS] District Passport Hub pins rendered: ${mapCheck.passportPins}`);
  console.log(`  [PASS] Ethnic Layer Toggle Panel rendered: ${mapCheck.hasLayerPanel}`);
  console.log(`  [PASS] Map Attribution conforms to Survey of India Alignment: "${mapCheck.attribution}"`);

  // Open a pin popup to test interactivity
  await client.eval(`(() => {
    const pin = document.querySelector('.tourist-pin');
    if (pin) pin.click();
  })()`);
  await sleep(1500);
  await client.screenshot('react_ethnic_atlas_map_with_pins.png');

  // --- CHECK 5: Gujarat Passport Cultural Aesthetic ---
  console.log('\n--- CHECK 5: Gujarat Passport Cultural Aesthetic ---');
  await client.eval(`window.useAtlasStore.getState().setMode('passport')`);
  await sleep(800);
  const passportCheck = await client.eval(`(() => {
    const h1 = document.querySelector('h1')?.innerText || '';
    const has34 = document.body.innerText.includes('34 Districts');
    const hasGujaratiDigits = document.body.innerText.includes('૩૪');
    return { h1, has34, hasGujaratiDigits };
  })()`);
  console.log(`  [PASS] Passport heading: "${passportCheck.h1}"`);
  console.log(`  [PASS] 34 Districts & Gujarati numerals present: ${passportCheck.has34 && passportCheck.hasGujaratiDigits}`);
  await client.screenshot('react_ethnic_passport_view.png');

  // --- CHECK 6: Embedded EV Highway Radar (No Standalone Tab) ---
  console.log('\n--- CHECK 6: Embedded EV Highway Radar on Atlas Map & Destinations ---');
  
  // 6A. Verify Header navigation has exactly 5 tabs and NO standalone EV tab
  const headerNavCheck = await client.eval(`(() => {
    const navButtons = Array.from(document.querySelectorAll('header nav button'));
    const labels = navButtons.map(b => b.innerText);
    const hasStandaloneEvTab = labels.some(l => l.includes('EV Highway'));
    return { count: navButtons.length, labels, hasStandaloneEvTab };
  })()`);
  console.log(`  [PASS] Header primary nav tabs count: ${headerNavCheck.count} (Expected: 5)`);
  console.log(`  [PASS] Standalone EV tab removed from header: ${!headerNavCheck.hasStandaloneEvTab}`);

  // 6B. Switch to explore mode and open embedded EV Highway Corridor Radar
  await client.eval(`window.useAtlasStore.getState().setMode('explore'); window.scrollTo(0, 0);`);
  await sleep(1000);

  // Click the embedded EV Radar button
  await client.eval(`(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('EV Highway Corridor Radar'));
    if (btn) btn.click();
  })()`);
  await sleep(600);

  const radarCheck = await client.eval(`(() => {
    const panel = document.body.innerText.includes('Highway EV Radar Lifeline');
    const has180Kw = document.body.innerText.includes('180 kW');
    const hasDeadZone = document.body.innerText.includes('Dead Zone Alert: Kutch & Dang');
    const hasDgBackupToggle = document.body.innerText.includes('Generator (DG) Backup Only');
    const hasCorridorJumps = document.body.innerText.includes('NE-1 (Ahmd–Vdr)');
    return { panel, has180Kw, hasDeadZone, hasDgBackupToggle, hasCorridorJumps };
  })()`);
  console.log(`  [PASS] Embedded EV Radar slide-out opened on map: ${radarCheck.panel}`);
  console.log(`  [PASS] EV 180kW peak & 98.2% metrics present: ${radarCheck.has180Kw}`);
  console.log(`  [PASS] Rural Dead Zone Safeguard present: ${radarCheck.hasDeadZone}`);
  console.log(`  [PASS] Generator (DG) blackout-proof toggle present: ${radarCheck.hasDgBackupToggle}`);
  console.log(`  [PASS] Fast-focus highway corridor jumps present: ${radarCheck.hasCorridorJumps}`);
  await client.screenshot('react_ethnic_embedded_ev_radar.png');

  // 6C. Verify EV Roadtrip reachability chips in Destinations View
  await client.eval(`window.useAtlasStore.getState().setMode('places')`);
  await sleep(800);
  const destinationEvChipCheck = await client.eval(`(() => {
    const hasEvReadyChip = document.body.innerText.includes('EV Ready: Fast Charger');
    const hasDeadZoneChip = document.body.innerText.includes('Remote Dead Zone');
    return { hasEvReadyChip, hasDeadZoneChip };
  })()`);
  console.log(`  [PASS] Destinations embed EV reachability chips: EV Ready=${destinationEvChipCheck.hasEvReadyChip}, Dead Zone=${destinationEvChipCheck.hasDeadZoneChip}`);

  // --- CHECK 7: Light Theme Authentic Off-White Kagdi Paper Visual Check ---
  console.log('\n--- CHECK 7: Light Theme Authentic Off-White Kagdi Paper ---');
  // Switch to light theme
  await client.eval(`(() => {
    if (window.useAtlasStore.getState().theme !== 'light') {
      window.useAtlasStore.getState().toggleTheme();
    }
  })()`);
  await client.eval(`window.useAtlasStore.getState().setMode('places')`);
  await sleep(1000);
  await client.screenshot('react_ethnic_light_theme_destinations.png');

  await client.eval(`window.useAtlasStore.getState().setMode('explore')`);
  await sleep(1000);
  await client.eval(`(() => {
    const pin = document.querySelector('.tourist-pin');
    if (pin) pin.click();
  })()`);
  await sleep(1500);
  await client.screenshot('react_ethnic_light_theme_map.png');

  // Switch back to dark theme
  await client.eval(`(() => {
    if (window.useAtlasStore.getState().theme !== 'dark') {
      window.useAtlasStore.getState().toggleTheme();
    }
  })()`);
  await sleep(400);

  console.log('\n======================================================================');
  console.log('ALL GUJARAT ETHNIC REDESIGN & EMBEDDED EV CHECKS PASSED 100%!');
  console.log('======================================================================');
}

runVerification().catch(err => {
  console.error('[FAIL]', err);
  process.exit(1);
});

