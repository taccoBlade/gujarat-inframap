const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const WIKI_DESTINATION_MAP = {
  'statue-of-unity': 'Statue_of_Unity',
  'rani-ki-vav': 'Rani_ki_vav',
  'somnath-temple': 'Somnath_temple',
  'sun-temple-modhera': 'Sun_Temple,_Modhera',
  'white-rann-dhordo': 'Great_Rann_of_Kutch',
  'dwarkadhish-temple': 'Dwarkadhish_Temple',
  'gir-national-park': 'Gir_National_Park',
  'champaner-pavagadh': 'Champaner-Pavagadh_Archaeological_Park',
  'sabarmati-ashram': 'Sabarmati_Ashram',
  'dholavira-harappan-city': 'Dholavira',
  'polo-forest-ruins': 'Polo_Forest',
  'dada-harir-stepwell': 'Dada_Harir_Stepwell',
  'lakhpat-fort-town': 'Lakhpat',
  'khambhalida-caves': 'Khambhalida_Caves',
  'galteshwar-temple': 'Galteshwar',
  'sarkhej-roza': 'Sarkhej_Roza',
  'gira-waterfalls': 'Gira_waterfalls',
  'velavadar-blackbuck-np': 'Blackbuck_National_Park,_Velavadar',
  'marine-national-park-narara': 'Marine_National_Park,_Gulf_of_Kutch',
  'wild-ass-sanctuary': 'Indian_Wild_Ass_Sanctuary',
  'nalsarovar-bird-sanctuary': 'Nal_Sarovar_Bird_Sanctuary',
  'saputara-hill-station': 'Saputara',
  'laxmi-vilas-palace': 'Lukshmi_Vilas_Palace',
  'uparkot-fort-junagadh': 'Uparkot_Fort',
  'lothal-archaeological-site': 'Lothal',
  'aina-mahal-bhuj': 'Aina_Mahal',
  'palitana-shatrunjaya': 'Palitana_temples',
  'ambaji-temple': 'Ambaji',
  'akshardham-gandhinagar': 'Akshardham_(Gandhinagar)',
  'udvada-atash-behram': 'Udvada_Atash_Behram',
  'shivrajpur-beach': 'Dwarka',
  'madhavpur-ghed-beach': 'Madhavpur_Ghed',
  'mandvi-beach-palace': 'Vijay_Vilas_Palace',
  'tithal-beach': 'Valsad',
  'bhujodi-ajrakhpur-crafts': 'Bhujodi',
  'patan-patola-museum': 'Patola_sari',
  'manek-chowk-food-night': 'Manek_Chowk_(Ahmedabad)'
};

const outputDir = path.join(__dirname, '../public/images/destinations');
const distOutputDir = path.join(__dirname, '../dist/images/destinations');
[outputDir, distOutputDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

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
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    const download = (targetUrl, redirectCount = 0) => {
      if (redirectCount > 5) return reject(new Error('Too many redirects'));
      const client = targetUrl.startsWith('https:') ? https : http;
      client.get(targetUrl, {
        headers: {
          'User-Agent': 'GujaratInfraMap/5.0 (https://gujarat-inframap.vercel.app; saumya@gujaratatlas.in)'
        }
      }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return download(res.headers.location, redirectCount + 1);
        }
        if (res.statusCode !== 200) {
          return reject(new Error(`HTTP ${res.statusCode}`));
        }
        const fileStream = fs.createWriteStream(destPath);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close(resolve);
        });
      }).on('error', reject);
    };
    download(url);
  });
}

async function getPhotoUrl(title) {
  const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
  const summary = await fetchJson(summaryUrl);
  if (summary?.originalimage?.source) return { url: summary.originalimage.source, title: summary.title };
  if (summary?.thumbnail?.source) return { url: summary.thumbnail.source, title: summary.title };

  // Fallback to Wikipedia MediaWiki Query API to get main image
  const queryUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original|thumbnail&pithumbsize=1000&titles=${encodeURIComponent(title)}`;
  const queryRes = await fetchJson(queryUrl);
  const pages = queryRes?.query?.pages;
  if (pages) {
    const pageId = Object.keys(pages)[0];
    if (pageId && pageId !== '-1') {
      const page = pages[pageId];
      if (page.original?.source) return { url: page.original.source, title: page.title };
      if (page.thumbnail?.source) return { url: page.thumbnail.source, title: page.title };
    }
  }

  return null;
}

async function main() {
  console.log('Downloading authentic Wikipedia photographs for all 37 destinations...');
  let successCount = 0;

  for (const [id, wikiTitle] of Object.entries(WIKI_DESTINATION_MAP)) {
    try {
      const photo = await getPhotoUrl(wikiTitle);
      if (photo && photo.url) {
        const publicPath = path.join(outputDir, `${id}.jpg`);
        const distPath = path.join(distOutputDir, `${id}.jpg`);
        
        await downloadImage(photo.url, publicPath);
        fs.copyFileSync(publicPath, distPath);
        
        const size = fs.statSync(publicPath).size;
        console.log(`[PASS] ${id} -> "${photo.title}" (${(size / 1024).toFixed(1)} KB)`);
        successCount++;
      } else {
        console.warn(`[WARN] Could not find photo for ${id} (Title: ${wikiTitle})`);
      }
    } catch (err) {
      console.error(`[FAIL] ${id}:`, err.message);
    }
  }

  console.log(`\nFinished: ${successCount} / ${Object.keys(WIKI_DESTINATION_MAP).length} authentic photos updated!`);
}

main();
