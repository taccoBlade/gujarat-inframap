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
  const userDataDir = path.join(os.tmpdir(), 'chrome-drop-' + Date.now());
  const port = 9265;
  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--user-data-dir=' + userDataDir,
    '--no-first-run',
    '--disable-gpu',
    '--window-size=1536,900',
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

  // Click More Tools button to open dropdown
  await cdp.eval(`(() => {
    const btn = document.getElementById('headerMoreMenuBtn');
    if (btn) btn.click();
  })()`);
  await new Promise(r => setTimeout(r, 300));

  const dropdownInfo = await cdp.eval(`(() => {
    const d = document.getElementById('headerMoreMenu');
    if (!d) return null;
    const r = d.getBoundingClientRect();
    const btns = Array.from(d.querySelectorAll('.action-btn')).map(b => ({
      id: b.id,
      text: b.innerText.trim().replace(/\\n/g, ' ')
    }));
    return {
      isOpen: d.classList.contains('open'),
      width: Math.round(r.width),
      height: Math.round(r.height),
      left: Math.round(r.left),
      top: Math.round(r.top),
      right: Math.round(r.right),
      bottom: Math.round(r.bottom),
      buttonsCount: btns.length,
      buttons: btns
    };
  })()`);

  console.log('Dropdown Info:', dropdownInfo);

  // Capture screenshot of the opened dropdown menu in the upper right
  const shot = await cdp.send('Page.captureScreenshot', {
    format: 'png',
    clip: { x: 900, y: 0, width: 636, height: 480, scale: 1 }
  });
  fs.writeFileSync('scratch_dropdown_menu.png', Buffer.from(shot.data, 'base64'));
  console.log('Saved scratch_dropdown_menu.png');

  cdp.close();
  chromeProc.kill();
}
run();
