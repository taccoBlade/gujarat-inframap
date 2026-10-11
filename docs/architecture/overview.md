# Gujarat InfraMap — System Architecture & Overview

## 1. System Vision & Paradigm
**Gujarat InfraMap** is a high-fidelity geospatial digital twin and infrastructure spatial observatory for the State of Gujarat. It provides an interactive, client-side GIS platform visualizing 33 administrative districts, highway corridors, railway networks, power stations, transmission grids, large dams, reservoirs, ports, airports, and geoenvironmental hazard domains.

### Core Architectural Principles
1. **Zero-Build, Pure Web Native Architecture:** Runs directly in modern browsers via standard ES6+ JavaScript, CSS3, HTML5, and Leaflet.js. No Node runtime or heavy bundler required for deployment; deployable instantly as static files on GitHub Pages, Netlify, Vercel, or Apache/Nginx.
2. **Context-Optimized Geospatial Data Separation:** All 13 statutory datasets (3,327 features) are strictly isolated in `data/`, formatted as compact GeoJSON with 5-decimal coordinate precision and single-line coordinate streams. Source code never embeds bulky GIS arrays.
3. **Scale-Dependent Level-of-Detail (LOD):** Automatic feature decluttering and layer gating prevent visual noise and performance degradation at high or state-wide zoom levels.
4. **Context-Aware Typed Asset Inspection:** Every selected asset maps to a typed civil engineering schema with statutory metadata, physical dimensions, engineering formulas, risk metrics, and connected infrastructure graph links.
5. **Robust Responsive Layout:** Standardized 3-tier modal architecture, collision-avoiding floating HUDs, and responsive header navigation ensuring flawless rendering from mobile (390px) to ultrawide (1920px+).

---

## 2. Directory Structure
```
digital twin of gujarat/
├── index.html                   # Single-Page GIS Application Shell
├── manifest.json                # PWA Progressive Web App Manifest
├── sw.js                        # Service Worker for Offline GIS Caching
├── css/
│   └── style.css                # Precision GIS Dark-Engine Stylesheet
├── js/
│   ├── app.js                   # Application Controller & Core Map Lifecycle
│   ├── district_registry.js     # 33-District Multi-Modal Infrastructure Matrix
│   ├── layer_manager.js         # Hierarchical Layer Registry & Scale LOD
│   ├── asset_inspector.js       # Typed Asset Inspector & Schema Visualizer
│   ├── civil_science_stop.js    # Educational Civil Engineering Laboratory
│   ├── dam_science_lab.js       # Hydrostatic & Dam Structural Simulator
│   ├── water_systems_network.js # Topological River Basins & Network Traversal
│   ├── water_scenarios_lab.js   # 3-Mode Hydrologic & Reservoir Scenarios Lab
│   ├── energy_infrastructure_explorer.js # Hydropower & Energy Grid Explorer
│   ├── transportation_explorer.js       # Bridges, Flyovers & Highway Structures
│   └── geoenvironmental_intelligence.js # Geology, Faults, Soil & Hazard Suite
├── data/                        # Compact Production GeoJSON Datasets
│   ├── gujarat_districts.geojson
│   ├── gujarat_district_hq.geojson
│   ├── gujarat_roads.geojson
│   ├── gujarat_railways.geojson
│   ├── gujarat_stations.geojson
│   ├── gujarat_power.geojson
│   ├── gujarat_transmission.geojson
│   ├── gujarat_water_resources.geojson
│   ├── gujarat_urban_industry.geojson
│   ├── gujarat_transport_structures.geojson
│   ├── gujarat_groundwater_geology.geojson
│   ├── gujarat_geoenvironmental.geojson
│   └── gujarat_environment_disaster.geojson
├── data/raw/                    # Unmodified Raw Statutory GeoJSON Backups
├── docs/
│   ├── data/
│   │   ├── catalog.json         # Automated Geospatial Dataset Catalog
│   │   └── sources.md           # Statutory Data Sources & Provenance
│   ├── architecture/            # Architectural Documentation
│   │   ├── overview.md          # System Architecture & Overview
│   │   ├── data-flow.md         # Data Flow & LOD Engineering
│   │   └── developer-guide.md   # AI & Developer Extension Guidelines
│   └── reports/                 # Quality & Performance Lighthouse Reports
└── scripts/                     # Automation, ETL & Verification Tooling
    ├── optimize_geojson_formats.py
    ├── generate_dataset_catalog.py
    ├── verify_deployment.py
    └── test_browser_interactive.js
```

---

## 3. UI Stacking & Layer Hierarchy
A strict z-index hierarchy governed by `:root` design tokens guarantees that popups, menus, modals, and drawers never visually clip or collide:

| Layer Token | Z-Index | Purpose |
| :--- | :--- | :--- |
| `--z-map-base` | `1` | Cartographic Leaflet canvas & base raster tiles |
| `--z-map-panes` | `200–700`| Leaflet vector panes (districts, roads, assets, halos) |
| `--z-controls` | `400` | Leaflet zoom controls and scale bars |
| `--z-hud` | `600` | Real-time measurement & proximity analysis HUDs |
| `--z-header` | `800` | Sticky top navigation bar and search bar |
| `--z-drawer` | `900` | Floating collapsible Layer Manager Drawer (width 326px) |
| `--z-legend` | `950` | Scale-aware Active Layer Legend (auto-shifts when drawer opens) |
| `--z-inspector`| `1100` | Sliding Infrastructure Asset Inspector drawer (width 460px) |
| `--z-dropdown` | `1200` | Search autocomplete results & "More Tools" dropdown menu |
| `--z-modal-backdrop` | `1400` | Frosted backdrop filter for dialog cards |
| `--z-modal` | `1500` | Universal 3-tier modal cards (centered, single vertical scroll) |
| `--z-toasts` | `1700` | System status notifications and operational feedback chips |

---

## 4. Key Subsystems
1. **Application Shell (`index.html` & `app.js`):**
   Manages the Leaflet map instance, custom map panes with fixed rendering order, keyboard shortcuts, universal multi-token search, and district jumping.
2. **Layer Manager (`layer_manager.js`):**
   Controls 11 thematic layer groups with toggleable visibility, opacity sliders, feature count badges, and scale-dependent LOD rendering rules.
3. **Asset Inspector (`asset_inspector.js`):**
   Displays typed asset cards with multi-tab narrative sections (Overview, Engineering, Function, Network, Science Stop, Risk, History, Sources).
4. **Hydrologic & Scientific Labs:**
   - `dam_science_lab.js`: Interactive hydrostatic pressure, spillway discharge, and structural factor-of-safety simulator.
   - `water_systems_network.js`: Graph traversal for river basins and canal connectivity.
   - `water_scenarios_lab.js`: Reservoir mass-balance, heavy rainfall runoff, and drought scenarios.
   - `civil_science_stop.js`: Interactive civil engineering theory and calculations across 10 asset categories.
