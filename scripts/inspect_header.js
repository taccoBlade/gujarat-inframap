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
    const res = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true
    });
    return res.result ? res.result.value : undefined;
  }
  close() {
    if (this.ws) this.ws.close();
  }
}

async function testViewport(width, height) {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = path.join(os.tmpdir(), 'chrome-inspect-' + Date.now());
  const port = 9256;
  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--user-data-dir=' + userDataDir,
    '--no-first-run',
    '--disable-gpu',
    `--window-size=${width},${height}`,
    'http://127.0.0.1:8080/'
  ]);

  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 200));
    try {
      const v = await getJson(`http://127.0.0.1:${port}/json/version`);
      if (v) break;
    } catch(e) {}
  }

  const targets = await getJson(`http://127.0.0.1:${port}/json/list`);
  const page = targets.find(t => t.type === 'page' && t.url.includes('8080'));
  const cdp = new CDPClient(page.webSocketDebuggerUrl);
  await cdp.connect();
  await new Promise(r => setTimeout(r, 2000));

  const data = await cdp.eval(`(() => {
    const h = document.querySelector('.app-header');
    const hl = document.querySelector('.header-left');
    const hc = document.querySelector('.header-center');
    const hr = document.querySelector('.header-right');
    const hRect = h.getBoundingClientRect();
    const hrRect = hr.getBoundingClientRect();
    
    const btns = Array.from(hr.children).map(c => {
      const r = c.getBoundingClientRect();
      const isClippedLeft = r.left < hrRect.left || r.left < 0;
      const isClippedRight = r.right > hrRect.right || r.right > window.innerWidth;
      return {
        id: c.id || c.className,
        text: c.innerText.trim().replace(/\\n/g, ' '),
        left: Math.round(r.left),
        right: Math.round(r.right),
        width: Math.round(r.width),
        isClippedLeft,
        isClippedRight
      };
    });

    return {
      windowWidth: window.innerWidth,
      headerWidth: Math.round(hRect.width),
      headerLeftWidth: Math.round(hl.getBoundingClientRect().width),
      headerCenterWidth: Math.round(hc.getBoundingClientRect().width),
      headerRightWidth: Math.round(hrRect.width),
      headerRightScrollWidth: hr.scrollWidth,
      headerRightClientWidth: hr.clientWidth,
      buttons: btns
    };
  })()`);

  console.log(`\n=== VIEWPORT: ${width}x${height} ===`);
  console.log(`Header Left: ${data.headerLeftWidth}px | Center: ${data.headerCenterWidth}px | Right: ${data.headerRightWidth}px`);
  console.log(`Header Right ScrollWidth: ${data.headerRightScrollWidth}px vs ClientWidth: ${data.headerRightClientWidth}px (Overflow: ${data.headerRightScrollWidth - data.headerRightClientWidth}px)`);
  console.log('Buttons:');
  data.buttons.forEach(b => {
    const clipped = b.isClippedLeft ? '[CLIPPED LEFT!]' : (b.isClippedRight ? '[CLIPPED RIGHT!]' : '[OK]');
    console.log(`  ${clipped} ${b.id.padEnd(25)} | width: ${b.width}px | left: ${b.left}px, right: ${b.right}px | text: "${b.text}"`);
  });

  const shot = await cdp.send('Page.captureScreenshot', {
    format: 'png',
    clip: { x: 0, y: 0, width: width, height: 80, scale: 1 }
  });
  fs.writeFileSync(`scratch_header_${width}.png`, Buffer.from(shot.data, 'base64'));
  console.log(`Saved screenshot to scratch_header_${width}.png`);

  cdp.close();
  chromeProc.kill();
}

async function main() {
  await testViewport(1536, 864);
  await testViewport(1366, 768);
  await testViewport(1280, 720);
}
main();
