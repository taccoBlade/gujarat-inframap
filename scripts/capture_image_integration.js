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
    if (res && res.exceptionDetails) {
      console.error("CDP Eval Exception:", JSON.stringify(res.exceptionDetails));
    }
    return res && res.result ? res.result.value : null;
  }

  async captureScreenshot(outputPath) {
    const res = await this.send('Page.captureScreenshot', { format: 'png', quality: 90 });
    if (res && res.data) {
      fs.writeFileSync(outputPath, Buffer.from(res.data, 'base64'));
      console.log(`Saved screenshot to ${outputPath}`);
    }
  }
}

async function capture() {
  const artifactDir = "C:\\Users\\saumy\\.gemini\\antigravity\\brain\\f4d383a9-ea31-4c83-bc95-e3099fdc2f9a";
  const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  const port = 9534;
  const chromeProc = spawn(chromePath, [
    `--remote-debugging-port=${port}`,
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--window-size=1440,960',
    'http://127.0.0.1:8080/#/places'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const tabs = await getJson(`http://127.0.0.1:${port}/json`);
    const pageTab = tabs.find(t => t.type === 'page' && t.url.includes('8080'));
    if (!pageTab) throw new Error("Could not find Gujarat InfraMap tab on port 8080");
    const client = new CDPClient(pageTab.webSocketDebuggerUrl);
    await client.connect();
    await client.send('Page.enable');
    await client.send('Runtime.enable');

    // Wait until engines are ready
    let ready = false;
    for (let i = 0; i < 20; i++) {
      ready = await client.eval(`Boolean(window.PublicViews && window.TripReality && window.AssetInspector && window.ImageManifest)`);
      if (ready) break;
      await new Promise(r => setTimeout(r, 500));
    }
    console.log("Engines ready:", ready);

    // 1. Places View with Images
    await new Promise(r => setTimeout(r, 2000));
    await client.captureScreenshot(path.join(artifactDir, "image_places_catalogue.png"));

    // 2. Strategic Projects View with Images
    await client.eval(`window.PublicViews.switchDestination("projects", true);`);
    await new Promise(r => setTimeout(r, 2500));
    await client.captureScreenshot(path.join(artifactDir, "image_projects_showcase.png"));

    // 3. Plan a Visit / Trip Reality with Jharokha Hero & Quick Picks
    await client.eval(`window.PublicViews.switchDestination("plan", true);`);
    await new Promise(r => setTimeout(r, 1000));
    await client.eval(`window.TripReality.selectDestination("sun-temple-modhera");`);
    await new Promise(r => setTimeout(r, 2500));
    await client.captureScreenshot(path.join(artifactDir, "image_trip_snapshot_hero.png"));

    // 4. Asset Inspector Photo Hero
    await client.eval(`window.PublicViews.switchDestination("explore", true);`);
    await new Promise(r => setTimeout(r, 1200));
    const inspectResult = await client.eval(`
      (() => {
        window.AssetInspector.inspect({
          type: "Feature",
          properties: {
            id: "GJ-WR-DAM-001",
            name: "Sardar Sarovar Dam",
            river: "Narmada",
            district: "Narmada",
            asset_category: "water_dam",
            gross_storage_mcm: 9460,
            frl_m: 138.68,
            status: "Operational"
          },
          geometry: {
            type: "Point",
            coordinates: [73.749, 21.833]
          }
        });
        const hero = document.querySelector(".insp-asset-photo-hero");
        return {
          inspected: true,
          hasHero: Boolean(hero),
          src: hero && hero.querySelector("img") ? hero.querySelector("img").src : null
        };
      })()
    `);
    console.log("Inspect evaluated:", inspectResult);
    await client.eval(`
      new Promise(resolve => {
        const img = document.querySelector(".insp-asset-photo-hero img");
        if (!img || (img.complete && img.naturalWidth > 0)) return resolve();
        img.onload = () => resolve();
        img.onerror = () => resolve();
        setTimeout(resolve, 6000);
      })
    `);
    await new Promise(r => setTimeout(r, 800));
    await client.captureScreenshot(path.join(artifactDir, "image_asset_inspector_hero.png"));

    console.log("All screenshots successfully captured!");
  } finally {
    try { chromeProc.kill(); } catch (e) {}
  }
}

capture();
