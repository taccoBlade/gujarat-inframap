/**
 * Gujarat InfraMap — Image Integration Automated Verification Suite
 * 
 * Uses Native Chrome DevTools Protocol (CDP) without external dependencies.
 * 
 * Tests:
 * 1. ImageManifest object exposure and schema compliance.
 * 2. 100% uniqueness across destination images (37/37 distinct URLs).
 * 3. 100% uniqueness across strategic projects (10/10 distinct URLs).
 * 4. Image tags have descriptive alt text and loading attributes.
 * 5. Media classification (photograph vs rendering) and photographer attribution tags rendered.
 * 6. Trip Reality Jharokha frame hero and Quick Pick thumbnails.
 * 7. Asset Inspector photo hero integration.
 * 8. Clean browser console (0 errors).
 */

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

async function runImageVerification() {
  console.log("======================================================================");
  console.log("GUJARAT INFRAMAP — IMAGE INTEGRATION CDP VERIFICATION SUITE");
  console.log("======================================================================\n");

  const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  const port = 9528;
  const chromeProc = spawn(chromePath, [
    `--remote-debugging-port=${port}`,
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--window-size=1440,900',
    'http://127.0.0.1:8080/#/places'
  ]);

  await new Promise(r => setTimeout(r, 2000));

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
    const tabs = await getJson(`http://127.0.0.1:${port}/json`);
    const targetTab = tabs.find(t => t.type === 'page' && t.url.includes('8080'));
    if (!targetTab) throw new Error("No page target found on port 8080");

    const client = new CDPClient(targetTab.webSocketDebuggerUrl);
    await client.connect();
    await client.send('Runtime.enable');
    await client.send('Page.enable');

    for (let i = 0; i < 20; i++) {
      const ready = await client.eval(`Boolean(window.ImageManifest && window.PublicViews && window.TripReality && window.AssetInspector)`);
      if (ready) break;
      await new Promise(r => setTimeout(r, 400));
    }

    // --- CHECK 1: Console Cleanliness ---
    console.log("--- CHECK 1: Console Cleanliness on Boot ---");
    const errors = client.consoleLogs.filter(l => l.type === 'error');
    assert(errors.length === 0, `Zero console errors on boot (found ${errors.length})`);

    // --- CHECK 2: ImageManifest Global Exposure & Integrity ---
    console.log("\n--- CHECK 2: ImageManifest Global Exposure & Data Integrity ---");
    const manifestStats = await client.eval(`
      (() => {
        if (!window.ImageManifest) return null;
        const d = Object.values(window.ImageManifest.DESTINATION_IMAGES);
        const p = Object.values(window.ImageManifest.STRATEGIC_PROJECT_IMAGES);
        const a = Object.values(window.ImageManifest.INFRASTRUCTURE_ASSET_IMAGES);
        return {
          hasManifest: true,
          destCount: d.length,
          projCount: p.length,
          assetCount: a.length,
          destUrls: d.map(x => x.url),
          projUrls: p.map(x => x.url),
          destAltsCount: d.filter(x => x.alt && x.alt.length > 5).length,
          destCreditsCount: d.filter(x => x.credit && x.credit.length > 2).length,
          projCreditsCount: p.filter(x => x.credit && x.credit.length > 2).length,
          projTypesCount: p.filter(x => x.type === "photograph" || x.type === "rendering").length
        };
      })()
    `);

    assert(manifestStats && manifestStats.hasManifest, "window.ImageManifest is exposed globally");
    assert(manifestStats && manifestStats.destCount >= 37, `ImageManifest contains all 37 destinations (found ${manifestStats ? manifestStats.destCount : 0})`);
    assert(manifestStats && manifestStats.projCount >= 10, `ImageManifest contains 10 strategic projects (found ${manifestStats ? manifestStats.projCount : 0})`);
    assert(manifestStats && manifestStats.assetCount >= 5, `ImageManifest contains key infrastructure asset profiles (found ${manifestStats ? manifestStats.assetCount : 0})`);
    assert(manifestStats && manifestStats.destAltsCount === manifestStats.destCount, "All destinations have descriptive, verified alt text");
    assert(manifestStats && manifestStats.destCreditsCount === manifestStats.destCount, "All destinations have photographer / agency credits");
    assert(manifestStats && manifestStats.projTypesCount === manifestStats.projCount, "All strategic projects specify media type (photograph vs rendering)");

    // --- CHECK 3: URL Uniqueness Across Destinations & Projects ---
    console.log("\n--- CHECK 3: Image Uniqueness & Non-Duplication ---");
    if (manifestStats) {
      const uniqueDestUrls = new Set(manifestStats.destUrls);
      assert(uniqueDestUrls.size === manifestStats.destCount, `100% unique URLs across destinations (${uniqueDestUrls.size}/${manifestStats.destCount})`);

      const uniqueProjUrls = new Set(manifestStats.projUrls);
      assert(uniqueProjUrls.size === manifestStats.projCount, `100% unique URLs across strategic projects (${uniqueProjUrls.size}/${manifestStats.projCount})`);
    }

    // --- CHECK 4: Places to Explore (Tourism Discovery) Cards & Attributions ---
    console.log("\n--- CHECK 4: Places to Explore Card Rendering & Image Markup ---");
    const placesCards = await client.eval(`
      (() => {
        const cards = document.querySelectorAll(".destination-card");
        const imgs = document.querySelectorAll(".destination-card .dest-card-img");
        const creditPills = document.querySelectorAll(".destination-card .dest-card-credit-pill");
        const alts = Array.from(imgs).map(img => img.getAttribute("alt"));
        const loadings = Array.from(imgs).map(img => img.getAttribute("loading"));
        return {
          cardCount: cards.length,
          imgCount: imgs.length,
          creditPillCount: creditPills.length,
          allAltsPresent: alts.every(a => a && a.trim().length > 3),
          allLazyLoaded: loadings.every(l => l === "lazy")
        };
      })()
    `);

    assert(placesCards.cardCount >= 30, `Places catalogue renders cards (found ${placesCards.cardCount})`);
    assert(placesCards.imgCount === placesCards.cardCount, `Every destination card contains an image element (${placesCards.imgCount}/${placesCards.cardCount})`);
    assert(placesCards.allAltsPresent, "All destination card images have descriptive alt text");
    assert(placesCards.allLazyLoaded, "All destination card images have native loading='lazy' applied");
    assert(placesCards.creditPillCount > 0, `Destination cards display non-intrusive credit pills (found ${placesCards.creditPillCount})`);

    // --- CHECK 5: Strategic Projects Showcase ---
    console.log("\n--- CHECK 5: Strategic Projects Showcase Images & Classification ---");
    await client.eval(`window.PublicViews.switchDestination("projects", true);`);
    await new Promise(r => setTimeout(r, 600));

    const projectCards = await client.eval(`
      (() => {
        const cards = document.querySelectorAll(".project-editorial-card");
        const imgs = document.querySelectorAll(".project-editorial-card .project-card-img");
        const mediaPills = document.querySelectorAll(".project-editorial-card .project-media-type-pill");
        const creditPills = document.querySelectorAll(".project-editorial-card .project-credit-pill");
        const alts = Array.from(imgs).map(img => img.getAttribute("alt"));
        const distinctSrcs = new Set(Array.from(imgs).map(img => img.getAttribute("src")));
        return {
          cardCount: cards.length,
          imgCount: imgs.length,
          mediaPillCount: mediaPills.length,
          creditPillCount: creditPills.length,
          distinctSrcCount: distinctSrcs.size,
          allAltsPresent: alts.every(a => a && a.trim().length > 5)
        };
      })()
    `);

    assert(projectCards.cardCount === 10, `Projects view renders 10 strategic projects (found ${projectCards.cardCount})`);
    assert(projectCards.imgCount === 10, "All 10 project cards render an image element");
    assert(projectCards.distinctSrcCount === 10, `All 10 projects have 100% distinct, non-conflicting images (${projectCards.distinctSrcCount}/10)`);
    assert(projectCards.mediaPillCount === 10, "All 10 projects display media classification (photo vs master plan render)");
    assert(projectCards.creditPillCount === 10, "All 10 projects display photographer / agency attribution pills");
    assert(projectCards.allAltsPresent, "All 10 project images have descriptive, contextual alt attributes");

    // --- CHECK 6: Trip Reality Destination Quick Picks & Snapshot Jharokha Frame ---
    console.log("\n--- CHECK 6: Trip Reality Image Integration ---");
    await client.eval(`window.PublicViews.switchDestination("plan", true);`);
    await new Promise(r => setTimeout(r, 600));

    const quickPicks = await client.eval(`
      (() => {
        const thumbs = document.querySelectorAll(".tr-pick-thumb");
        const alts = Array.from(thumbs).map(t => t.getAttribute("alt"));
        return {
          thumbCount: thumbs.length,
          allAltsPresent: alts.every(a => a && a.trim().length > 3)
        };
      })()
    `);

    assert(quickPicks.thumbCount >= 6, `Trip Reality renders quick pick thumbnails (found ${quickPicks.thumbCount})`);
    assert(quickPicks.allAltsPresent, "All quick pick thumbnails have descriptive alt text");

    // Select Modhera Sun Temple to inspect Jharokha Frame Hero
    await client.eval(`window.TripReality.selectDestination("sun-temple-modhera");`);
    await new Promise(r => setTimeout(r, 500));

    const jharokhaHero = await client.eval(`
      (() => {
        const img = document.querySelector(".tr-jharokha-frame .tr-jharokha-img");
        const credit = document.querySelector(".tr-jharokha-credit-tag");
        return {
          hasImg: Boolean(img),
          src: img ? img.getAttribute("src") : "",
          alt: img ? img.getAttribute("alt") : "",
          hasCredit: Boolean(credit),
          creditText: credit ? credit.textContent.trim() : ""
        };
      })()
    `);

    assert(jharokhaHero.hasImg, "Trip snapshot renders Jharokha sandstone frame hero image");
    assert(jharokhaHero.alt.includes("Modhera") || jharokhaHero.alt.includes("Sun Temple") || jharokhaHero.alt.length > 10, `Hero image has descriptive alt text (got: "${jharokhaHero.alt}")`);
    assert(jharokhaHero.hasCredit, `Hero frame displays photographer credit pill (got: "${jharokhaHero.creditText}")`);

    // --- CHECK 7: Asset Inspector Photo Hero ---
    console.log("\n--- CHECK 7: Asset Inspector Photo Hero Integration ---");
    await client.eval(`window.PublicViews.switchDestination("explore", true);`);
    await new Promise(r => setTimeout(r, 500));

    const inspectorPhoto = await client.eval(`
      (() => {
        if (!window.AssetInspector) return { hasInspector: false };
        window.AssetInspector.inspect({
          type: "Feature",
          properties: {
            id: "GJ-WR-DAM-001",
            name: "Sardar Sarovar Dam",
            river: "Narmada",
            district: "Narmada",
            asset_category: "water_dam"
          },
          geometry: {
            type: "Point",
            coordinates: [73.749, 21.833]
          }
        });

        const photoHero = document.querySelector(".insp-asset-photo-hero");
        const img = photoHero ? photoHero.querySelector("img") : null;
        const rect = photoHero ? photoHero.getBoundingClientRect() : null;
        const body = document.getElementById("inspBody");
        const bodyRect = body ? body.getBoundingClientRect() : null;
        return {
          hasInspector: true,
          hasPhotoHero: Boolean(photoHero),
          imgSrc: img ? img.getAttribute("src") : "",
          imgAlt: img ? img.getAttribute("alt") : "",
          heroDisplay: photoHero ? photoHero.style.display : null,
          imgComplete: img ? img.complete : null,
          imgNaturalWidth: img ? img.naturalWidth : null,
          rect,
          bodyRect
        };
      })()
    `);

    console.log("CHECK 7 DEBUG DATA:", JSON.stringify(inspectorPhoto, null, 2));

    assert(inspectorPhoto.hasPhotoHero, "Asset Inspector renders verified photo hero banner in Overview tab");
    assert(inspectorPhoto.imgAlt.length > 5, `Asset Inspector photo hero has descriptive alt text (got: "${inspectorPhoto.imgAlt}")`);

    console.log("\n======================================================================");
    console.log(`IMAGE INTEGRATION RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log("======================================================================\n");
  } catch (e) {
    console.error("Test execution exception:", e);
    failed++;
  } finally {
    try { chromeProc.kill(); } catch (e) {}
    process.exit(failed > 0 ? 1 : 0);
  }
}

runImageVerification();
