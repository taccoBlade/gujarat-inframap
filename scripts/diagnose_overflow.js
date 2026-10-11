const http = require('http');
const { spawn } = require('child_process');
const path = require('path');
const os = require('os');

async function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

(async () => {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = path.join(os.tmpdir(), 'chrome-diag-' + Date.now());
  const port = 9224;

  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--user-data-dir=' + userDataDir,
    '--window-size=1366,768',
    'http://127.0.0.1:8080/'
  ]);

  await new Promise(r => setTimeout(r, 2000));
  const targets = await getJson('http://127.0.0.1:' + port + '/json');
  const target = targets.find(t => t.type === 'page');
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  
  await new Promise(r => ws.onopen = r);
  let id = 1;
  const send = (method, params = {}) => new Promise((resolve) => {
    const msgId = id++;
    const handler = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.id === msgId) {
        ws.removeEventListener('message', handler);
        resolve(data.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id: msgId, method, params }));
  });

  await send('Runtime.enable');
  await new Promise(r => setTimeout(r, 2000));

  const diag = await send('Runtime.evaluate', {
    expression: `(() => {
      const header = document.querySelector(".app-header");
      const left = document.querySelector(".header-left");
      const center = document.querySelector(".header-center");
      const right = document.querySelector(".header-right");
      
      const overflowingElements = [];
      document.querySelectorAll("*").forEach(el => {
        if (el.scrollWidth > window.innerWidth) {
          overflowingElements.push({ tag: el.tagName, id: el.id, class: el.className, scrollWidth: el.scrollWidth });
        }
      });

      return {
        windowWidth: window.innerWidth,
        headerWidth: header?.getBoundingClientRect().width,
        headerScrollWidth: header?.scrollWidth,
        leftWidth: left?.getBoundingClientRect().width,
        centerWidth: center?.getBoundingClientRect().width,
        rightWidth: right?.getBoundingClientRect().width,
        rightScrollWidth: right?.scrollWidth,
        overflowingElements
      };
    })()`,
    returnByValue: true
  });

  console.log(JSON.stringify(diag.result.value, null, 2));
  chromeProc.kill();
  process.exit(0);
})();
