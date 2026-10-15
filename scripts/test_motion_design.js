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
  console.log('GUJARAT ATLAS — PHASE 3 MOTION DESIGN & INTERACTION TEST SUITE');
  console.log('======================================================================');

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = path.join(os.tmpdir(), 'chrome-motion-test-' + Date.now());
  const cdpPort = Math.floor(9420 + Math.random() * 50);

  console.log(`[TEST] Starting headless Chrome on port ${cdpPort}...`);
  const chromeProc = spawn(chromePath, [
    `--remote-debugging-port=${cdpPort}`,
    `--user-data-dir=${userDataDir}`,
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--window-size=1440,900',
    'http://127.0.0.1:8080/'
  ], { detached: false });

  let cdp = null;
  let testCount = 0;
  let passCount = 0;

  function assert(condition, testName, details = '') {
    testCount++;
    if (condition) {
      passCount++;
      console.log(`  [PASS] ${testName}`);
    } else {
      console.error(`  [FAIL] ${testName} ${details ? '(' + details + ')' : ''}`);
    }
  }

  try {
    let versionInfo = null;
    for (let i = 0; i < 25; i++) {
      await sleep(300);
      try {
        versionInfo = await getJson(`http://127.0.0.1:${cdpPort}/json/version`);
        if (versionInfo) break;
      } catch (e) {}
    }

    if (!versionInfo) {
      throw new Error('Failed to connect to Chrome DevTools port');
    }

    const targets = await getJson(`http://127.0.0.1:${cdpPort}/json/list`);
    const pageTarget = targets.find(t => t.type === 'page' && t.url.includes('8080'));
    if (!pageTarget) {
      throw new Error('Target page on port 8080 not found');
    }

    cdp = new CDPClient(pageTarget.webSocketDebuggerUrl);
    await cdp.connect();

    await cdp.send('Runtime.enable');
    await cdp.send('Page.enable');

    console.log('[TEST] Waiting for page and assets to initialize...');
    await sleep(2500);

    // -----------------------------------------------------------------------
    // TEST GROUP 1: Motion Tokens Hierarchy in CSS :root
    // -----------------------------------------------------------------------
    console.log('\n--- Test Group 1: Motion Tokens Hierarchy in :root ---');

    const tokens = await cdp.eval(`(() => {
      const s = getComputedStyle(document.documentElement);
      return {
        durInstant: s.getPropertyValue('--dur-instant').trim(),
        durSubtle: s.getPropertyValue('--dur-subtle').trim(),
        durPanel: s.getPropertyValue('--dur-panel').trim(),
        durEditorial: s.getPropertyValue('--dur-editorial').trim(),
        durDiscovery: s.getPropertyValue('--dur-discovery').trim(),
        easeInstant: s.getPropertyValue('--ease-instant').trim(),
        easeSubtle: s.getPropertyValue('--ease-subtle').trim(),
        easePanel: s.getPropertyValue('--ease-panel').trim(),
        easeEditorial: s.getPropertyValue('--ease-editorial').trim(),
        easeSpring: s.getPropertyValue('--ease-spring').trim(),
        easeOutQuad: s.getPropertyValue('--ease-out-quad').trim()
      };
    })()`);

    assert(tokens.durInstant === '140ms', 'Token --dur-instant is 140ms', `got: "${tokens.durInstant}"`);
    assert(tokens.durSubtle === '220ms', 'Token --dur-subtle is 220ms', `got: "${tokens.durSubtle}"`);
    assert(tokens.durPanel === '320ms', 'Token --dur-panel is 320ms', `got: "${tokens.durPanel}"`);
    assert(tokens.durEditorial === '460ms', 'Token --dur-editorial is 460ms', `got: "${tokens.durEditorial}"`);
    assert(tokens.durDiscovery === '340ms', 'Token --dur-discovery is 340ms', `got: "${tokens.durDiscovery}"`);
    assert(tokens.easeSpring.includes('cubic-bezier'), 'Token --ease-spring is valid cubic-bezier', `got: "${tokens.easeSpring}"`);
    assert(tokens.easePanel.includes('cubic-bezier'), 'Token --ease-panel is valid cubic-bezier', `got: "${tokens.easePanel}"`);

    // -----------------------------------------------------------------------
    // TEST GROUP 2: Signature "Gujarat Discovery Transition"
    // -----------------------------------------------------------------------
    console.log('\n--- Test Group 2: Signature Gujarat Discovery Transition ---');

    const barExists = await cdp.eval(`(() => {
      const el = document.getElementById('discoveryTransitionBar');
      if (!el) return false;
      const svg = el.querySelector('.discovery-motif-svg');
      const line = el.querySelector('.discovery-line-base');
      const chev = el.querySelector('.discovery-stepwell-chevron');
      const dot = el.querySelector('.discovery-ajrakh-dot');
      return !!(svg && line && chev && dot);
    })()`);
    assert(barExists, 'Signature Discovery Transition Bar with SVG stepwell & Ajrakh motifs exists in DOM');

    // Trigger transition by switching destination
    const triggerResult = await cdp.eval(`(() => {
      if (!window.PublicViews) return false;
      window.PublicViews.switchDestination('places', true);
      const bar = document.getElementById('discoveryTransitionBar');
      return bar ? bar.classList.contains('discovery-active') : false;
    })()`);
    assert(triggerResult, 'Discovery Transition Bar activates with .discovery-active upon mode switch');

    // Wait for transition bar animation duration to complete (~360ms)
    await sleep(450);
    const settledResult = await cdp.eval(`(() => {
      const bar = document.getElementById('discoveryTransitionBar');
      return bar ? !bar.classList.contains('discovery-active') : false;
    })()`);
    assert(settledResult, 'Discovery Transition Bar automatically settles and cleans up state after ~360ms');

    // -----------------------------------------------------------------------
    // TEST GROUP 3: Primary Navigation Indicator
    // -----------------------------------------------------------------------
    console.log('\n--- Test Group 3: Primary Navigation Indicator ---');

    const activeNavTab = await cdp.eval(`(() => {
      const tab = document.querySelector('.nav-tab.active');
      return tab ? tab.getAttribute('data-tab') : null;
    })()`);
    assert(activeNavTab === 'places', 'Active navigation tab correctly updated to "places"', `got: "${activeNavTab}"`);

    // -----------------------------------------------------------------------
    // TEST GROUP 4: Stepwell Cascading Reveals & Card Staggers
    // -----------------------------------------------------------------------
    console.log('\n--- Test Group 4: Stepwell Cascading Reveals & Card Staggers ---');

    const cardStaggerDelays = await cdp.eval(`(() => {
      const cards = document.querySelectorAll('.destination-card');
      if (cards.length < 3) return null;
      return [
        getComputedStyle(cards[0]).animationDelay,
        getComputedStyle(cards[1]).animationDelay,
        getComputedStyle(cards[2]).animationDelay
      ];
    })()`);

    assert(Array.isArray(cardStaggerDelays), 'Destination cards are rendered in DOM');
    assert(cardStaggerDelays && (cardStaggerDelays[0] === '0.02s' || cardStaggerDelays[0] === '20ms'), 'First card delay is 20ms', `got: "${cardStaggerDelays ? cardStaggerDelays[0] : ''}"`);
    assert(cardStaggerDelays && (cardStaggerDelays[1] === '0.05s' || cardStaggerDelays[1] === '50ms'), 'Second card delay is 50ms', `got: "${cardStaggerDelays ? cardStaggerDelays[1] : ''}"`);
    assert(cardStaggerDelays && (cardStaggerDelays[2] === '0.08s' || cardStaggerDelays[2] === '80ms'), 'Third card delay is 80ms', `got: "${cardStaggerDelays ? cardStaggerDelays[2] : ''}"`);

    const cardAnimName = await cdp.eval(`(() => {
      const card = document.querySelector('.destination-card');
      return card ? getComputedStyle(card).animationName : '';
    })()`);
    assert(cardAnimName.includes('stepwellCardReveal'), 'Destination card animation is stepwellCardReveal', `got: "${cardAnimName}"`);

    // -----------------------------------------------------------------------
    // TEST GROUP 5: Shared-Element Destination Modal Expansion
    // -----------------------------------------------------------------------
    console.log('\n--- Test Group 5: Shared-Element Destination Modal Expansion ---');

    const modalOpenAnim = await cdp.eval(`(() => {
      if (!window.TourismDiscovery) return false;
      window.TourismDiscovery.showDestinationProfile('rani-ki-vav');
      const modal = document.getElementById('destinationProfileModal');
      if (!modal || !modal.open) return false;
      const anim = getComputedStyle(modal).animationName;
      return anim;
    })()`);

    assert(modalOpenAnim && modalOpenAnim.includes('modalExpandEntrance'), 'Modal enters with modalExpandEntrance animation', `got: "${modalOpenAnim}"`);

    // Close modal
    await cdp.eval(`(() => {
      const modal = document.getElementById('destinationProfileModal');
      if (modal && typeof modal.close === 'function') modal.close();
    })()`);
    await sleep(200);

    const modalClosed = await cdp.eval(`(() => {
      const modal = document.getElementById('destinationProfileModal');
      return modal ? !modal.open : false;
    })()`);
    assert(modalClosed, 'Destination modal closes cleanly');

    // -----------------------------------------------------------------------
    // TEST GROUP 6: Map-Connected Ephemeral Visual Focal Ring
    // -----------------------------------------------------------------------
    console.log('\n--- Test Group 6: Map-Connected Ephemeral Visual Focal Ring ---');

    // Switch to explore map
    await cdp.eval(`window.PublicViews.switchDestination('explore', false)`);
    await sleep(200);

    const pulseCreated = await cdp.eval(`(() => {
      if (typeof window.showMapFocalPulse !== 'function') return false;
      window.showMapFocalPulse(23.85, 72.10);
      const pulseEl = document.querySelector('.map-focal-pulse');
      if (!pulseEl) return false;
      const circle = pulseEl.querySelector('.focal-pulse-circle');
      const dot = pulseEl.querySelector('.focal-pulse-dot');
      return !!(circle && dot);
    })()`);
    assert(pulseCreated, 'showMapFocalPulse renders ephemeral SVG focal ring in selectionPane');

    // Verify self-removal after ~1600ms
    await sleep(1700);
    const pulseRemoved = await cdp.eval(`(() => {
      return document.querySelector('.map-focal-pulse') === null;
    })()`);
    assert(pulseRemoved, 'Visual focal ring auto-removes from map after animation completes');

    // -----------------------------------------------------------------------
    // TEST GROUP 7: Accessibility & Reduced Motion Handling
    // -----------------------------------------------------------------------
    console.log('\n--- Test Group 7: Accessibility & Reduced Motion Handling ---');

    // Emulate prefers-reduced-motion: reduce
    await cdp.send('Emulation.setEmulatedMedia', {
      features: [{ name: 'prefers-reduced-motion', value: 'reduce' }]
    });

    const isReducedActive = await cdp.eval(`(() => {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    })()`);
    assert(isReducedActive, 'CDP media emulation activates prefers-reduced-motion: reduce');

    // Under reduced motion, showMapFocalPulse must be bypassed
    const reducedPulseSkipped = await cdp.eval(`(() => {
      window.showMapFocalPulse(23.85, 72.10);
      return document.querySelector('.map-focal-pulse') === null;
    })()`);
    assert(reducedPulseSkipped, 'showMapFocalPulse is cleanly bypassed when reduced motion is preferred');

    // Under reduced motion, transition bar does not activate
    const reducedBarSkipped = await cdp.eval(`(() => {
      window.PublicViews.switchDestination('directory', false);
      const bar = document.getElementById('discoveryTransitionBar');
      return !bar.classList.contains('discovery-active');
    })()`);
    assert(reducedBarSkipped, 'Signature transition bar animation is bypassed when reduced motion is preferred');

    // Restore standard motion emulation
    await cdp.send('Emulation.setEmulatedMedia', { features: [] });

    // -----------------------------------------------------------------------
    // TEST GROUP 8: Map Interactivity & Zero Input Interference
    // -----------------------------------------------------------------------
    console.log('\n--- Test Group 8: Map Interactivity & Zero Input Interference ---');

    await cdp.eval(`window.PublicViews.switchDestination('explore', false)`);
    await sleep(200);

    const mapInteractive = await cdp.eval(`(() => {
      if (!window.map) return false;
      const initialCenter = window.map.getCenter();
      window.map.panBy([30, 30], { animate: false });
      const newCenter = window.map.getCenter();
      const moved = (initialCenter.lat !== newCenter.lat || initialCenter.lng !== newCenter.lng);
      window.map.setView([22.2587, 71.1924], 7, { animate: false });
      return moved;
    })()`);
    assert(mapInteractive, 'Leaflet map remains 100% interactive and responds immediately to spatial gestures');

    const mapTransformsUnpolluted = await cdp.eval(`(() => {
      const mapEl = document.getElementById('map');
      const cs = getComputedStyle(mapEl);
      return cs.transform === 'none';
    })()`);
    assert(mapTransformsUnpolluted, 'Map container (#map) has zero CSS animation transforms applied to it');

    // -----------------------------------------------------------------------
    // TEST GROUP 9: 0px Horizontal Overflow Check Across Viewports
    // -----------------------------------------------------------------------
    console.log('\n--- Test Group 9: Responsive Viewports Horizontal Overflow Audit ---');

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
      await cdp.send('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 1,
        mobile: vp.width <= 768
      });
      await sleep(150);

      const overflow = await cdp.eval(`(() => {
        const bodyWidth = document.body.getBoundingClientRect().width;
        const htmlWidth = document.documentElement.getBoundingClientRect().width;
        const scrollW = Math.max(document.body.scrollWidth, document.documentElement.scrollWidth);
        const winW = window.innerWidth;
        return Math.max(0, scrollW - winW);
      })()`);

      assert(overflow <= 0.5, `Zero horizontal overflow on ${vp.name} (${vp.width}x${vp.height})`, `overflow: ${overflow}px`);
    }

    // -----------------------------------------------------------------------
    // SUMMARY
    // -----------------------------------------------------------------------
    console.log('\n======================================================================');
    console.log(`PHASE 3 MOTION DESIGN TEST SUMMARY: ${passCount}/${testCount} TESTS PASSED (${Math.round((passCount / testCount) * 100)}%)`);
    console.log('======================================================================');

    if (passCount === testCount) {
      process.exitCode = 0;
    } else {
      process.exitCode = 1;
    }
  } catch (err) {
    console.error('[FATAL ERROR IN TEST RUNNER]', err);
    process.exitCode = 1;
  } finally {
    if (cdp) cdp.close();
    chromeProc.kill();
    try {
      fs.rmSync(userDataDir, { recursive: true, force: true });
    } catch (e) {}
  }
}

run();
