const http = require('http');
const { spawn } = require('child_process');

async function test() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9810',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    'http://localhost:3000/'
  ]);

  await new Promise(r => setTimeout(r, 1500));
  const list = await new Promise(r => http.get('http://127.0.0.1:9810/json/list', res => {
    let d = ''; res.on('data', c => d += c); res.on('end', () => r(JSON.parse(d)));
  }));

  const page = list.find(t => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  ws.onmessage = (msg) => {
    const d = JSON.parse(msg.data);
    if (d.method === 'Runtime.consoleAPICalled') {
      console.log('CONSOLE:', d.params.type, d.params.args.map(a => a.value || a.description));
    }
    if (d.method === 'Runtime.exceptionThrown') {
      console.error('EXCEPTION:', d.params.exceptionDetails?.exception?.description || d.params.exceptionDetails?.text);
    }
  };

  let id = 1;
  const send = (m, p = {}) => ws.send(JSON.stringify({ id: id++, method: m, params: p }));
  send('Runtime.enable');
  send('Page.enable');

  await new Promise(r => setTimeout(r, 1000));
  console.log('Switching to unfiltered mode...');
  send('Runtime.evaluate', {
    expression: "window.useAtlasStore.getState().setMode('unfiltered')",
    returnByValue: true
  });

  await new Promise(r => setTimeout(r, 1500));
  ws.close();
  chromeProc.kill();
  console.log('Done debugging.');
}

test();
