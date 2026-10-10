# Gujarat InfraMap 🗺️⚡

> **Production Digital Infrastructure Twin & GIS Spatial Planning Observatory for Gujarat, India.**

![Gujarat InfraMap Social Preview](assets/og-preview.png)

[![Deployment Status](https://img.shields.io/badge/Deploy-GitHub%20Pages%20|%20Netlify%20|%20Vercel-success.svg)](#deployment--hosting)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions%20Enabled-blue.svg)](.github/workflows/deploy.yml)
[![Lighthouse](https://img.shields.io/badge/Lighthouse-Performance%2090%20%7C%20A11y%20100%20%7C%20Best%20Practices%20100%20%7C%20SEO%20100-brightgreen.svg)](#performance-benchmarks)
[![Zero Backend](https://img.shields.io/badge/Architecture-100%25%20Client--Side%20GIS-cyan.svg)](#tech-stack)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 📌 Executive Overview

**Gujarat InfraMap** is a client-side geospatial web application designed for civil and electrical engineers, spatial analysts, urban planners, and researchers. It aggregates scattered multi-modal infrastructure across Gujarat into a single, high-performance, dark-themed GIS spatial observatory.

- **Zero-Backend Client GIS:** Powered entirely by Leaflet.js, vanilla JavaScript (ES6+), and IndexedDB client caching. Requires no database servers or proprietary GIS engines.
- **Authoritative Data Coverage:** 7 core infrastructure layers covering 33 districts, 43 national highway corridors, 623 passenger railway stations, 44 major power generation plants (31.9 GW), and GETCO 400kV/765kV transmission corridors.
- **Production Performance:** Sub-second cold load time, zero-jank 60 FPS panning, hardware GPU-composited opacity controls, and WCAG 2.1 AA accessibility.

---

## 🚀 Key Features

| Capability | Description |
| :--- | :--- |
| **Administrative Boundaries** | 33 administrative districts and 33 district headquarters with official Census & AMC area metrics. |
| **Unified Highway Corridors** | 43 consolidated national highway corridors (NE-1, NH-48 Golden Quadrilateral, arterial trunks) with official NHAI speed limits (NE-1 120 km/h). |
| **Railway Network & Stations** | Complete Western Railway broad gauge tracks and 623 clickable passenger railway stations across ADI, BRC, RJT, and BVC operating divisions. |
| **Power Grid & Substation Hubs** | 44 generation facilities (Solar, Wind, Thermal, Nuclear, Hydro, Gas) with installed capacities up to 4,620 MW (Mundra) and Khavda RE Park, plus GETCO/PGCIL 765kV/400kV lines and 10 pooling substations. |
| **Multi-Token Search Engine** | Sub-millisecond client-side spatial search across all 7,344 indexed infrastructure features with keyboard navigation (`/`, `Arrow`, `Enter`). |
| **Geodesic Measurement Tool** | Interactive geodesic distance calculator with real-time rubberband tracking, waypoint badges, and live elevation/distance HUD (`M` shortcut). |
| **2x Retina Map Exporter** | One-click cartographic PNG screenshot generator compositing a title banner, coordinates, scale bar, and attribution (`E` shortcut). |
| **PWA & Social Cards** | Fully installable Progressive Web App (`manifest.json`) and high-resolution Open Graph/Twitter Card previews (1200x630). |

---

## 🛠️ Architecture & Tech Stack

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        Gujarat InfraMap Frontend                       │
│      (HTML5 / CSS3 / Vanilla ES6+ / Leaflet.js / EPSG:4326 WGS 84)     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
          ┌─────────────────────────┼─────────────────────────┐
          ▼                         ▼                         ▼
┌───────────────────┐     ┌───────────────────┐     ┌───────────────────┐
│   Vector Layers   │     │  Interactive Tools│     │   Client Storage  │
│ - 33 Districts    │     │ - Spatial Search  │     │ - IndexedDB Tile  │
│ - 43 NH Corridors │     │ - Geodesic Ruler  │     │   & GeoJSON Cache │
│ - 623 Rail Nodes  │     │ - 2x PNG Exporter │     │ - Memory Buffer   │
│ - 44 Power Plants │     │ - Opacity Sliders │     └───────────────────┘
│ - GETCO 765kV Grid│     └───────────────────┘
└───────────────────┘
```

| Component | Technology | Rationale |
| :--- | :--- | :--- |
| **Map Rendering** | [Leaflet.js](https://leafletjs.com/) (v1.9.4) | Lightweight (42KB), zero-dependency, mobile-first SVG/Canvas rendering. |
| **Spatial Projection** | `EPSG:4326` (WGS 84) | Direct browser-native coordinates, zero runtime re-projection overhead. |
| **Data Format** | GeoJSON (`data/*.geojson`) | Clean, validated, human-readable open GIS standards. |
| **Basemap Streaming** | CartoDB Dark Matter / OSM / ESRI World Imagery | High-contrast cartography with CORS-enabled satellite imagery. |
| **Exporter** | `html2canvas` (Retina 2x) | Pixel-perfect cartographic snapshots for student and planning reports. |
| **CI/CD** | GitHub Actions (`.github/workflows/deploy.yml`) | Automated schema validation, JS linting, and GitHub Pages publishing. |

---

## 📁 Repository Layout

```text
digital-twin-of-gujarat/
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Actions CI/CD deployment pipeline
├── assets/
│   ├── og-preview.png        # 1200x630 Open Graph binary social preview card
│   ├── og-preview.svg        # 1200x630 Scalable vector social card
│   ├── icon-192.png          # PWA standard application icon
│   └── icon-512.png          # PWA high-res application icon
├── css/
│   └── style.css             # Glassmorphic dark industrial GIS styling
├── js/
│   └── app.js                # Spatial engine, layer loaders, measurement, export
├── data/                     # Authoritative, optimized GeoJSON layers (EPSG:4326)
│   ├── gujarat_districts.geojson
│   ├── gujarat_district_hq.geojson
│   ├── gujarat_roads.geojson
│   ├── gujarat_railways.geojson
│   ├── gujarat_stations.geojson
│   ├── gujarat_power.geojson
│   └── gujarat_transmission.geojson
├── queries/                  # Overpass QL extraction sources
├── scripts/
│   ├── verify_deployment.py  # Production validation test suite
│   ├── generate_og_image.py  # Automated social preview generator
│   └── pipeline.py           # ETL and precision optimization script
├── index.html                # Application entry point with complete SEO metadata
├── manifest.json             # Web App Manifest for PWA installation
├── netlify.toml              # Netlify hosting configuration with CSP & caching headers
├── vercel.json               # Vercel hosting configuration
├── gujarat_inframap.qgs      # Master QGIS 3.x spatial project file
├── PLAN.md                   # 12-week roadmap & technical specifications
├── DEVLOG.md                 # Engineering changelog & implementation history
└── README.md                 # Project documentation
```

---

## 🚦 Deployment & Hosting

### Option 1: GitHub Pages (Automated via GitHub Actions)
1. Push code to the `main` branch of your GitHub repository.
2. In your repository settings, navigate to **Settings** → **Pages** → **Build and deployment**.
3. Under **Source**, select **GitHub Actions**.
4. The `.github/workflows/deploy.yml` workflow automatically runs the quality validation suite and publishes the live site to:
   ```text
   https://<username>.github.io/<repo-name>/
   ```

### Option 2: Netlify (One-Click)
1. Link your repository in Netlify or run `netlify deploy --prod`.
2. Netlify reads `netlify.toml`, automatically applying:
   - Security headers (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `CSP`).
   - Edge asset caching: 1-year immutable caching for static assets (`css`, `js`, `assets`).
   - Stale-while-revalidate caching for GeoJSON datasets.

### Option 3: Vercel
1. Run `vercel --prod` or link the repository in the Vercel dashboard.
2. Vercel automatically deploys using the configuration in `vercel.json`.

### Option 4: Local Development
```bash
# Clone repository
git clone https://github.com/saumy/gujarat-inframap.git
cd gujarat-inframap

# Run automated deployment verification suite
python scripts/verify_deployment.py

# Launch local HTTP server
python -m http.server 3000
```
Visit `http://localhost:3000` in your web browser.

---

## 🧪 Automated Verification Suite

Run the built-in quality gate test suite anytime to verify data integrity and configurations:
```bash
python scripts/verify_deployment.py
```
**Test Coverage:**
1. Validates all GeoJSON files in `data/` for `FeatureCollection` schema compliance.
2. Ensures all referenced HTML resources, styles, scripts, and PWA icons exist.
3. Tests JavaScript syntax using the Node.js compiler engine (`node --check js/app.js`).
4. Verifies CI/CD and hosting manifests (`.github/workflows/deploy.yml`, `netlify.toml`, `vercel.json`).

---

## ⚡ Performance Benchmarks

Audited on Google Chrome Lighthouse v12 (Desktop & Mobile):
- **Performance:** `90 / 100` (FCP: 0.7s, LCP: 2.0s, TBT: 0ms, CLS: 0.004)
- **Accessibility:** `100 / 100` (WCAG 2.1 AA compliant color contrast & touch targets)
- **Best Practices:** `100 / 100` (HTTPS, secure headers, modern image formats)
- **SEO:** `100 / 100` (Open Graph, Twitter Cards, semantic markup, canonical links)

---

## 📅 12-Week Roadmap Progress

See [PLAN.md](file:///c:/Users/saumy/OneDrive/Desktop/qgis%20work/digital%20tiwn%20of%20gujarat/PLAN.md) for the detailed engineering roadmap.

- [x] **Week 1:** Project charter, roadmap, Overpass extraction queries, pipeline script
- [x] **Week 2:** Leaflet base map, custom panes, and 33 Gujarat district boundaries
- [x] **Week 3:** Major national highways layer, NE-1 expressway, click inspection
- [x] **Week 4:** Railway network symbology and 623 passenger railway station nodes
- [x] **Week 5:** Power generation facilities (31.9 GW) and GETCO 765kV/400kV transmission grid
- [x] **Week 6:** Collapsible control drawer, GPU-composited opacity sliders, keyboard shortcuts
- [x] **Week 7:** Multi-token high-speed spatial search engine & camera navigation
- [x] **Week 8:** Highway corridor consolidation, district non-interaction, zero-snap markers, Lighthouse 90+
- [x] **Week 9:** ESRI World Imagery satellite basemap, geodesic measurement tool, 2x Retina PNG exporter
- [x] **Week 10:** Git repository setup, GitHub Actions CI/CD, Netlify/Vercel configs, Open Graph cards
- [ ] **Week 11:** Structured user testing & peer evaluation (5 participants)
- [ ] **Week 12:** Academic report, viva presentation deck, and v1.0.0 release

---

## 📄 License & Data Attribution

- **Code:** Licensed under the [MIT License](LICENSE).
- **Map Data:** © [OpenStreetMap contributors](https://www.openstreetmap.org/copyright) (ODbL).
- **Satellite Tiles:** © [Esri, Maxar, Earthstar Geographics](https://www.esri.com/).
- **Government Records:** Gujarat Energy Development Agency (GEDA), GETCO, NHAI, Western Railway (WR).
