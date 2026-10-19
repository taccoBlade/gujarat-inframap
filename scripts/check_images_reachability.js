const fs = require('fs');
const https = require('https');
const http = require('http');

const content = fs.readFileSync('src/data/tourist-destinations.ts', 'utf8');
const regex = /"id":\s*"([^"]+)",\s*"name":\s*"([^"]+)"[\s\S]*?"image":\s*"([^"]+)"/g;

const destinations = [];
let match;
while ((match = regex.exec(content)) !== null) {
  destinations.push({ id: match[1], name: match[2], url: match[3] });
}

function checkUrl(dest) {
  return new Promise((resolve) => {
    if (dest.url.startsWith('/')) {
      const localPath = 'public' + dest.url;
      const exists = fs.existsSync(localPath);
      return resolve({ id: dest.id, url: dest.url, status: exists ? 200 : 404, ok: exists, local: true });
    }

    const checkHttp = (url, depth = 0) => {
      if (depth > 5) return resolve({ id: dest.id, url: dest.url, status: 999, ok: false, error: 'Too many redirects' });
      const client = url.startsWith('https:') ? https : http;
      try {
        const req = client.request(url, {
          method: 'GET',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'image/*,*/*'
          }
        }, (res) => {
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            let nextUrl = res.headers.location;
            if (nextUrl.startsWith('/')) {
              const u = new URL(url);
              nextUrl = u.origin + nextUrl;
            }
            return checkHttp(nextUrl, depth + 1);
          }
          res.resume(); // consume stream
          resolve({ id: dest.id, url: dest.url, status: res.statusCode, ok: res.statusCode === 200 });
        });
        req.on('error', (err) => resolve({ id: dest.id, url: dest.url, status: 0, ok: false, error: err.message }));
        req.setTimeout(8000, () => {
          req.destroy();
          resolve({ id: dest.id, url: dest.url, status: 408, ok: false, error: 'Timeout' });
        });
        req.end();
      } catch (e) {
        resolve({ id: dest.id, url: dest.url, status: 0, ok: false, error: e.message });
      }
    };
    checkHttp(dest.url);
  });
}

async function run() {
  console.log(`Checking reachability of ${destinations.length} destination image URLs...`);
  const results = await Promise.all(destinations.map(d => checkUrl(d)));
  let failed = 0;
  for (const r of results) {
    if (!r.ok) {
      console.log(`❌ FAIL: [${r.id}] ${r.url} -> status ${r.status} ${r.error || ''}`);
      failed++;
    } else {
      console.log(`✅ OK: [${r.id}] -> ${r.status}`);
    }
  }
  console.log(`\nFinished: ${results.length - failed} / ${results.length} reachable.`);
  if (failed > 0) process.exit(1);
}

run();
