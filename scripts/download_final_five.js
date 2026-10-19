const fs = require('fs');
const path = require('path');
const https = require('https');

const finalFive = {
  'ambaji-temple': 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Ambaji_Temple_at_Night.jpg',
  'gira-waterfalls': 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Gira_waterfall_02.jpg',
  'patan-patola-museum': 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Patola_House.jpg',
  'shivrajpur-beach': 'https://upload.wikimedia.org/wikipedia/commons/c/c6/Shivrajpur_Beach_Daytime.jpg',
  'tithal-beach': 'https://upload.wikimedia.org/wikipedia/commons/4/46/Tithal_Beach.jpg'
};

const outputDir = path.join(__dirname, '../public/images/destinations');
const distOutputDir = path.join(__dirname, '../dist/images/destinations');

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

async function main() {
  for (const [id, url] of Object.entries(finalFive)) {
    console.log('Downloading', id);
    const p1 = path.join(outputDir, `${id}.jpg`);
    const p2 = path.join(distOutputDir, `${id}.jpg`);
    await download(url, p1);
    fs.copyFileSync(p1, p2);
    console.log('[SAVED]', id, fs.statSync(p1).size, 'bytes');
  }
  console.log('ALL 37 AUTHENTIC PHOTOS SAVED!');
}

main();
