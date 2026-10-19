const fs = require('fs');
const path = require('path');
const https = require('https');

const missingMap = {
  'galteshwar-temple': 'Galteshwar_Temple',
  'ambaji-temple': 'Ambaji_temple',
  'bhujodi-ajrakhpur-crafts': 'Ajrak',
  'gira-waterfalls': 'Gira_waterfalls'
};

const outputDir = path.join(__dirname, '../public/images/destinations');
const distOutputDir = path.join(__dirname, '../dist/images/destinations');

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function fetchJson(url) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: {
        'User-Agent': 'GujaratInfraMap/5.0 (https://gujarat-inframap.vercel.app; saumya@gujaratatlas.in)'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { resolve(null); }
      });
    }).on('error', () => resolve(null));
  });
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: { 'User-Agent': 'GujaratInfraMap/5.0 (https://gujarat-inframap.vercel.app; saumya@gujaratatlas.in)' }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) return reject(new Error('Status ' + res.statusCode));
      const s = fs.createWriteStream(dest);
      res.pipe(s);
      s.on('finish', () => s.close(resolve));
    }).on('error', reject);
  });
}

async function run() {
  for (const [id, title] of Object.entries(missingMap)) {
    await sleep(1000);
    const summary = await fetchJson(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`);
    const img = summary?.originalimage?.source || summary?.thumbnail?.source;
    if (img) {
      console.log('Downloading', id, img);
      const p1 = path.join(outputDir, `${id}.jpg`);
      const p2 = path.join(distOutputDir, `${id}.jpg`);
      await download(img, p1);
      fs.copyFileSync(p1, p2);
      console.log('Saved', id);
    } else {
      console.log('No img for', id);
    }
  }
}

run();
