const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const os = require('os');

const ARTIFACT_DIR = 'C:\\Users\\saumy\\.gemini\\antigravity\\brain\\f4d383a9-ea31-4c83-bc95-e3099fdc2f9a';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { resolve(null); }
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
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
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
    const id = this.id++;
    return new Promise((resolve, reject) => {
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async eval(expr) {
    const res = await this.send('Runtime.evaluate', {
      expression: expr,
      returnByValue: true,
      awaitPromise: true
    });
    return res.result ? res.result.value : null;
  }

  async screenshot(filePath) {
    const res = await this.send('Page.captureScreenshot', { format: 'png', quality: 90 });
    fs.writeFileSync(filePath, Buffer.from(res.data, 'base64'));
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function run() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = path.join(os.tmpdir(), 'chrome-capture-' + Date.now());
  const port = Math.floor(9600 + Math.random() * 50);

  const chromeProc = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    '--window-size=1440,900',
    'http://127.0.0.1:8080/'
  ], { detached: false });

  let versionInfo = null;
  for (let i = 0; i < 20; i++) {
    await sleep(350);
    try {
      versionInfo = await getJson(`http://127.0.0.1:${port}/json/version`);
      if (versionInfo) break;
    } catch (e) {}
  }

  if (!versionInfo) {
    chromeProc.kill();
    process.exit(1);
  }

  const targets = await getJson(`http://127.0.0.1:${port}/json/list`);
  const pageTarget = targets.find(t => t.type === 'page');
  const client = new CDPClient(pageTarget.webSocketDebuggerUrl);
  await client.connect();
  await client.send('Page.enable');

  // Capture 1: Uncluttered Explore Map (wait for loading screen dismissal)
  await sleep(3600);
  await client.screenshot(path.join(ARTIFACT_DIR, 'uncluttered_explore_map.png'));
  console.log('[SCREENSHOT] Saved uncluttered_explore_map.png');

  // Capture 2: Infrastructure Directory with Photography & Specs
  await client.eval(`window.PublicViews.switchDestination('infrastructure', true)`);
  await sleep(1200);
  await client.screenshot(path.join(ARTIFACT_DIR, 'overhauled_infrastructure_directory.png'));
  console.log('[SCREENSHOT] Saved overhauled_infrastructure_directory.png');

  // Capture 3: Cinematic Loading Screen
  await client.eval(`window.GujaratLoadingScreen.init()`);
  await sleep(400);
  await client.screenshot(path.join(ARTIFACT_DIR, 'cinematic_gujarat_loading_screen.png'));
  console.log('[SCREENSHOT] Saved cinematic_gujarat_loading_screen.png');

  client.close();
  chromeProc.kill();
  console.log('Done captures!');
}

run();
