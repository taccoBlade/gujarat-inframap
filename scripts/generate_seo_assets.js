const fs = require('fs');
const path = require('path');

// Base production domain
const BASE_URL = 'https://gujarat-inframap.vercel.app';

// 1. Generate robots.txt
const robotsTxt = `# ======================================================================
# GUJARAT PRAVAS ATLAS — PRODUCTION ROBOTS.TXT
# Optimized for Googlebot, Bingbot, Applebot & Global Search Indexing
# ======================================================================

User-agent: *
Allow: /
Disallow: /api/
Disallow: /scratch/
Disallow: /node_modules/

# Priority Search Engine Crawlers
User-agent: Googlebot
Allow: /

User-agent: Googlebot-Image
Allow: /images/

User-agent: Bingbot
Allow: /

User-agent: Applebot
Allow: /

User-agent: DuckDuckBot
Allow: /

User-agent: Slurp
Allow: /

# Host & XML Sitemap
Host: ${BASE_URL}
Sitemap: ${BASE_URL}/sitemap.xml
`;

fs.writeFileSync('public/robots.txt', robotsTxt, 'utf8');
console.log('✓ Created public/robots.txt');

// 2. Load Destinations from source
const destFile = fs.readFileSync('src/data/tourist-destinations.ts', 'utf8');
const destMatches = [];
const destRegex = /{\s*"id":\s*"([^"]+)",\s*"name":\s*"([^"]+)",[\s\S]*?"district":\s*"([^"]+)",[\s\S]*?"summary":\s*"([^"]+)",/g;
let match;
while ((match = destRegex.exec(destFile)) !== null) {
  destMatches.push({
    id: match[1],
    name: match[2],
    district: match[3],
    summary: match[4]
  });
}
console.log(`Found ${destMatches.length} tourist destinations for SEO sitemap & structured data`);

// 3. Load Stories
const storiesRaw = JSON.parse(fs.readFileSync('data/gujarat_unfiltered.json', 'utf8'));
const stories = storiesRaw.stories || storiesRaw;
console.log(`Found ${stories.length} stories for SEO sitemap`);

// 4. Load Districts
const distFile = fs.readFileSync('src/data/passport-districts.ts', 'utf8');
const distMatches = [];
const distRegex = /id:\s*'([^']+)',\s*name:\s*'([^']+)',/g;
while ((match = distRegex.exec(distFile)) !== null) {
  distMatches.push({ id: match[1], name: match[2] });
}
console.log(`Found ${distMatches.length} districts for SEO sitemap`);

// 5. Generate comprehensive XML Sitemap
const currentDate = new Date().toISOString().split('T')[0];

let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <!-- Core Application Landing Views -->
  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${BASE_URL}/#places</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.95</priority>
  </url>
  <url>
    <loc>${BASE_URL}/#unfiltered</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.90</priority>
  </url>
  <url>
    <loc>${BASE_URL}/#passport</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>${BASE_URL}/#explore</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.95</priority>
  </url>
`;

// Add each tourist destination
destMatches.forEach(d => {
  sitemapXml += `  <url>
    <loc>${BASE_URL}/#destination-${d.id}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>
`;
});

// Add each story
stories.forEach(s => {
  sitemapXml += `  <url>
    <loc>${BASE_URL}/#story-${s.id}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.75</priority>
  </url>
`;
});

// Add each district
distMatches.forEach(d => {
  sitemapXml += `  <url>
    <loc>${BASE_URL}/#district-${d.id}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.70</priority>
  </url>
`;
});

sitemapXml += `</urlset>\n`;
fs.writeFileSync('public/sitemap.xml', sitemapXml, 'utf8');
console.log('✓ Created public/sitemap.xml');

// 6. Generate JSON-LD Structured Data
const jsonLdWebSite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Gujarat Pravas — Places to Visit & Cultural Travel Atlas",
  "url": BASE_URL,
  "description": "Comprehensive cultural travel atlas and tourist guide to 37 verified destinations, 34 districts, and 45 folklore dossiers across Gujarat, India.",
  "inLanguage": ["en", "gu"],
  "potentialAction": {
    "@type": "SearchAction",
    "target": `${BASE_URL}/?q={search_term_string}`,
    "query-input": "required name=search_term_string"
  }
};

const jsonLdTouristDestination = {
  "@context": "https://schema.org",
  "@type": "TouristDestination",
  "name": "Gujarat",
  "alternateName": ["ગુજરાત", "State of Gujarat", "Jewel of Western India"],
  "description": "Gujarat is India's westernmost state renowned for 5,000 years of civilization, featuring UNESCO World Heritage Sites (Rani ki Vav, Champaner, Dholavira, Historic Ahmedabad), the Statue of Unity, Asiatic Lion sanctuaries at Gir, and the sacred coastal pilgrimage sites of Somnath and Dwarka.",
  "url": BASE_URL,
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 22.40,
    "longitude": 71.80
  },
  "touristType": [
    "Heritage Tourism",
    "Spiritual Tourism",
    "Wildlife Tourism",
    "Coastal Tourism",
    "Cultural & Craft Tourism"
  ],
  "containedInPlace": {
    "@type": "Country",
    "name": "India"
  }
};

const topAttractionsList = [
  {
    name: "Statue of Unity & Kevadia Complex",
    description: "World's tallest monument standing 182 metres dedicated to Sardar Vallabhbhai Patel on Sadhu Bet island along the Narmada River.",
    location: "Kevadia, Narmada District, Gujarat",
    lat: 21.838,
    lng: 73.7191
  },
  {
    name: "Rani ki Vav (Queen's Stepwell)",
    description: "11th-century Chaulukya subterranean inverted temple and UNESCO World Heritage stepwell with over 500 intricate stone sculptures.",
    location: "Patan, Gujarat",
    lat: 23.8589,
    lng: 72.1023
  },
  {
    name: "Somnath Jyotirlinga Temple",
    description: "The first of the 12 sacred Jyotirlinga shrines of Lord Shiva situated on the coast of the Arabian Sea at Prabhas Patan.",
    location: "Veraval, Gir Somnath, Gujarat",
    lat: 20.888,
    lng: 70.4012
  },
  {
    name: "Dwarkadhish Temple (Jagat Mandir)",
    description: "Ancient 2,200-year-old 5-storey shrine of Lord Krishna and one of Hinduism's sacred Char Dham coastal pilgrimage sites.",
    location: "Dwarka, Devbhumi Dwarka, Gujarat",
    lat: 22.2376,
    lng: 68.9678
  },
  {
    name: "Gir National Park & Asiatic Lion Sanctuary",
    description: "The sole natural global habitat of the wild Asiatic Lion (Panthera leo leo) spread across rugged deciduous teak forests.",
    location: "Sasan Gir, Junagadh / Gir Somnath, Gujarat",
    lat: 21.1243,
    lng: 70.7937
  },
  {
    name: "White Desert — Great Rann of Kutch",
    description: "World's largest seasonal salt marsh desert transforming into an endless shimmering white expanse under the full moon.",
    location: "Dhordo, Kutch, Gujarat",
    lat: 23.834,
    lng: 69.516
  },
  {
    name: "Modhera Sun Temple",
    description: "1026 CE Solanki architectural masterpiece dedicated to Surya with 52 intricately carved pillared sabha mandapa and Surya Kund stepwell.",
    location: "Modhera, Mehsana, Gujarat",
    lat: 23.5835,
    lng: 72.1333
  },
  {
    name: "Dholavira: Harappan Metropolis",
    description: "UNESCO World Heritage Indus Valley Civilization city featuring 5,000-year-old monumental stone citadels and advanced reservoirs.",
    location: "Khadir Bet, Kutch, Gujarat",
    lat: 23.8863,
    lng: 70.2178
  }
];

const jsonLdAttractions = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Top Places to Visit in Gujarat",
  "itemListElement": topAttractionsList.map((attr, idx) => ({
    "@type": "ListItem",
    "position": idx + 1,
    "item": {
      "@type": "TouristAttraction",
      "name": attr.name,
      "description": attr.description,
      "address": {
        "@type": "PostalAddress",
        "addressRegion": "Gujarat",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": attr.lat,
        "longitude": attr.lng
      }
    }
  }))
};

const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What are the best places to visit in Gujarat?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The top places to visit in Gujarat include the Statue of Unity in Kevadia (world's tallest monument), Rani ki Vav stepwell in Patan (UNESCO World Heritage Site), Somnath and Dwarkadhish Jyotirlinga and Char Dham temples, Gir National Park (only home of wild Asiatic lions), the White Desert of Great Rann of Kutch, Modhera Sun Temple, and the Harappan city of Dholavira."
      }
    },
    {
      "@type": "Question",
      "name": "What is the best time to visit Gujarat?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The best time to visit Gujarat is between October and March when the weather is pleasantly cool and dry. This window coincides with the world-famous Rann Utsav in Kutch, migratory bird arrivals at Nal Sarovar, and optimal conditions for wildlife safaris at Gir National Park."
      }
    },
    {
      "@type": "Question",
      "name": "How to plan a trip to the Statue of Unity?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The Statue of Unity is located at Kevadia (Ekta Nagar), approximately 90 km from Vadodara. Tickets must be booked in advance online at the official portal (statueofunity.in). It is closed on Mondays. The complex features a 153m high viewing gallery, Valley of Flowers, evening projection mapping show, and electric bus network."
      }
    },
    {
      "@type": "Question",
      "name": "Which UNESCO World Heritage Sites are in Gujarat?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Gujarat hosts 4 UNESCO World Heritage Sites: Rani ki Vav (Queen's Stepwell) in Patan (inscribed 2014), Champaner-Pavagadh Archaeological Park (inscribed 2004), Historic City of Ahmedabad (India's first World Heritage City, inscribed 2017), and Dholavira: A Harappan City in Kutch (inscribed 2021)."
      }
    },
    {
      "@type": "Question",
      "name": "How many districts are in Gujarat?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Gujarat is administratively organized into 34 districts across Saurashtra, Kutch, North Gujarat, Central Gujarat, and South Gujarat. You can explore all 34 districts and collect territorial passport stamps on the Gujarat Pravas Atlas."
      }
    }
  ]
};

// Export stringified JSON-LD blocks
const jsonLdBlocks = `
  <!-- SEO: Structured Data JSON-LD (Schema.org) for Google Search #1 Ranking -->
  <script type="application/ld+json">
${JSON.stringify(jsonLdWebSite, null, 2)}
  </script>
  <script type="application/ld+json">
${JSON.stringify(jsonLdTouristDestination, null, 2)}
  </script>
  <script type="application/ld+json">
${JSON.stringify(jsonLdAttractions, null, 2)}
  </script>
  <script type="application/ld+json">
${JSON.stringify(jsonLdFaq, null, 2)}
  </script>
`;

// 7. Update app.html with ultra-optimized SEO head and crawlable fallback HTML
let appHtml = fs.readFileSync('app.html', 'utf8');

// Replace head tags
const seoHeadMeta = `  <!-- Core SEO & Primary Keywords Meta Tags -->
  <title>Places to Visit in Gujarat (2026) — 37 Best Destinations &amp; Cultural Atlas</title>
  <meta name="description" content="Discover 37 verified places to visit in Gujarat: Statue of Unity, Rani ki Vav stepwell, Somnath &amp; Dwarkadhish temples, Gir Lion safari, and White Rann of Kutch. Complete travel guide with timings, entry fees, and 34-district interactive atlas.">
  <meta name="keywords" content="places to visit in gujarat, best places to visit in gujarat, gujarat tourist places, gujarat tourism, rani ki vav, statue of unity, somnath temple, dwarka, gir national park, rann of kutch, modhera sun temple, dholavira, lothal, gujarat travel guide 2026, gujarat trip itinerary">
  <meta name="author" content="Gujarat Pravas Cultural Spatial Project">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <link rel="canonical" href="${BASE_URL}/">

  <!-- Open Graph / Facebook Protocol -->
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Gujarat Pravas — Cultural Travel Atlas">
  <meta property="og:url" content="${BASE_URL}/">
  <meta property="og:title" content="Places to Visit in Gujarat (2026) — 37 Best Destinations &amp; Cultural Atlas">
  <meta property="og:description" content="Explore 37 verified destinations across Gujarat: Statue of Unity, Rani ki Vav, Somnath, Dwarka, Gir Lions &amp; Rann of Kutch with official ASI coordinates, timings, entry fees &amp; folklore.">
  <meta property="og:image" content="${BASE_URL}/images/destinations/statue-of-unity.jpg">
  <meta property="og:image:alt" content="Statue of Unity &amp; Gujarat Cultural Destinations">
  <meta property="og:locale" content="en_IN">
  <meta property="og:locale:alternate" content="gu_IN">

  <!-- Twitter Card Protocol -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Places to Visit in Gujarat (2026) — 37 Best Destinations &amp; Cultural Atlas">
  <meta name="twitter:description" content="Official cultural travel atlas for Gujarat. 37 verified landmarks, 34 districts passport, and 45 unfiltered folklore dispatches.">
  <meta name="twitter:image" content="${BASE_URL}/images/destinations/statue-of-unity.jpg">

  <!-- Geotagging Meta for Regional Local SEO -->
  <meta name="geo.region" content="IN-GJ">
  <meta name="geo.placename" content="Gujarat, India">
  <meta name="geo.position" content="22.40;71.80">
  <meta name="ICBM" content="22.40, 71.80">
`;

// Replace <head> inner content up to Leaflet CSS
appHtml = appHtml.replace(/<title>[\s\S]*?<!-- Leaflet CSS -->/, `${seoHeadMeta}\n${jsonLdBlocks}\n  <!-- Leaflet CSS -->`);

// 8. Add Semantic HTML Crawlable Fallback inside <div id="root">
const crawlableFallbackHtml = `<div id="root">
    <!-- Server-Side Crawlable SEO Fallback for Instant Search Engine Indexing (Hydrated by React) -->
    <noscript>
      <header>
        <h1>Places to Visit in Gujarat — 37 Best Destinations &amp; Cultural Travel Atlas</h1>
        <p>The definitive guide to Gujarat tourism: Solanki stepwells, Harappan citadels, Jyotirlinga shrines, and wild Asiatic Lion sanctuaries.</p>
      </header>
    </noscript>
    <div style="display:none;" aria-hidden="true">
      <h2>Top Tourist Destinations in Gujarat</h2>
      <ul>
        ${destMatches.slice(0, 15).map(d => `<li><strong>${d.name}</strong> (${d.district} District): ${d.summary}</li>`).join('\n        ')}
      </ul>
      <h2>Frequently Asked Questions About Gujarat Tourism</h2>
      ${jsonLdFaq.mainEntity.map(q => `<h3>${q.name}</h3><p>${q.acceptedAnswer.text}</p>`).join('\n      ')}
    </div>
  </div>`;

appHtml = appHtml.replace(/<div id="root"><\/div>/, crawlableFallbackHtml);

fs.writeFileSync('app.html', appHtml, 'utf8');
console.log('✓ Successfully injected rich JSON-LD and SEO metadata into app.html');
