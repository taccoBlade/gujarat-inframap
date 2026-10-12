const http = require('http');
const { spawn } = require('child_process');
const path = require('path');
const os = require('os');
const fs = require('fs');

async function getJson(url) {
  return new Promise((res, rej) => {
    http.get(url, r => {
      let d = '';
      r.on('data', c => d += c);
      r.on('end', () => res(JSON.parse(d)));
    }).on('error', rej);
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
    const res = await this.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    return res.result ? res.result.value : undefined;
  }
  close() {
    if (this.ws) this.ws.close();
  }
}

async function run() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = path.join(os.tmpdir(), 'chrome-scan-' + Date.now());
  const port = 9260;
  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--user-data-dir=' + userDataDir,
    '--no-first-run',
    '--disable-gpu',
    '--window-size=1920,1080',
    'http://127.0.0.1:8080/'
  ]);
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 200));
    try { if (await getJson(`http://127.0.0.1:${port}/json/version`)) break; } catch(e) {}
  }
  const targets = await getJson(`http://127.0.0.1:${port}/json/list`);
  const page = targets.find(t => t.type === 'page' && t.url.includes('8080'));
  const cdp = new CDPClient(page.webSocketDebuggerUrl);
  await cdp.connect();
  await new Promise(r => setTimeout(r, 2000));

  console.log('Testing widths from 768px to 1920px:');
  for (let w = 768; w <= 1920; w += 32) {
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: w,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });
    await new Promise(r => setTimeout(r, 100));

    const res = await cdp.eval(`(() => {
      const hr = document.querySelector('.header-right');
      const hl = document.querySelector('.header-left');
      const hc = document.querySelector('.header-center');
      const btn = document.getElementById('openGeoenvironmentalBtn');
      if (!hr || !btn) return null;
      const r = btn.getBoundingClientRect();
      const hrRect = hr.getBoundingClientRect();
      const hcRect = hc.getBoundingClientRect();
      return {
        w: window.innerWidth,
        hrOverflow: hr.scrollWidth > hr.clientWidth,
        scrollDiff: hr.scrollWidth - hr.clientWidth,
        hcWidth: Math.round(hcRect.width),
        btnVisible: r.width > 0 && r.height > 0,
        btnLeft: Math.round(r.left),
        btnRight: Math.round(r.right),
        btnWidth: Math.round(r.width),
        hrLeft: Math.round(hrRect.left),
        hrRight: Math.round(hrRect.right),
        isClippedLeft: r.left < hrRect.left,
        overlapsCenter: r.left < hcRect.right,
        btnText: btn.innerText.trim().replace(/\\n/g, ' ')
      };
    })()`);

    if (res && (res.hrOverflow || res.isClippedLeft || res.overlapsCenter || res.hcWidth < 120)) {
      console.log(`[Width: ${w}px] Search Width: ${res.hcWidth}px | Overlaps Center: ${res.overlapsCenter} | Clipped Left: ${res.isClippedLeft} | hrOverflow: ${res.hrOverflow} (${res.scrollDiff}px) | btn: "${res.btnText}" (w:${res.btnWidth}px)`);
    }
  }

  cdp.close();
  chromeProc.kill();
}
run();
