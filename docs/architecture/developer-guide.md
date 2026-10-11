# Gujarat InfraMap — Developer & AI Extension Guide

## 1. Quick Start & Local Development
Because Gujarat InfraMap is a pure client-side web application, no compilation or build steps are needed:

```bash
# 1. Start local development server (Python 3)
python -m http.server 8080

# 2. Open in browser
http://localhost:8080
```

---

## 2. AI Coding Guidelines & Context Hygiene
When contributing to Gujarat InfraMap or running automated coding agents, adhere strictly to the rules defined in `AGENTS.md`:

### Context Safety Rules
1. **Never read entire GeoJSON files into context.**
   Use targeted command-line tools or `scripts/generate_dataset_catalog.py` to inspect metadata, schemas, and sample properties.
2. **Never commit pretty-printed coordinate arrays.**
   Always run `python scripts/optimize_geojson_formats.py` if adding or editing GeoJSON files to maintain single-line coordinate formatting.
3. **Never place large reports or dumps in root.**
   All benchmark logs, Lighthouse audits, and test artifacts belong in `docs/reports/` or temporary folders.
4. **Preserve exact statutory calculations.**
   Do not replace real physics or civil calculations (mass-balance in `water_scenarios_lab.js`, hydrodynamic UKC in `asset_inspector.js`, structural stability in `dam_science_lab.js`) with dummy placeholders.

---

## 3. Adding a New Infrastructure Layer
To add a new geospatial layer to the digital twin:
1. **Prepare Data:**
   Place the GeoJSON file in `data/`, formatted with 5-decimal coordinate precision. Back up the raw original in `data/raw/`.
2. **Register in Dataset Catalog:**
   Update `scripts/generate_dataset_catalog.py` with the dataset's statutory source, feature count, and bounding box, then execute:
   ```bash
   python scripts/generate_dataset_catalog.py
   ```
3. **Register Leaflet Pane:**
   In `js/app.js`, assign a dedicated Leaflet pane with an appropriate `zIndex` (between 340 and 650) to enforce strict rendering order.
4. **Add to Layer Manager:**
   In `js/layer_manager.js`, add the layer configuration under its appropriate parent category group (Roads, Power, Water, etc.), specifying zoom thresholds (`minZoom`, `maxZoom`), icon, color, and default checked status.
5. **Add Typed Asset Schema:**
   In `js/asset_inspector.js`, register the asset type in `CATEGORY_THEMES` and define its engineering metrics, overview fields, and technical narratives in `SCHEMAS`.

---

## 4. Testing & Verification Gate
Before committing any changes, run the full verification and automated browser test suite:

```bash
# 1. Verify deployment integrity, assets, datasets & JS syntax
python scripts/verify_deployment.py

# 2. Run automated headless Chrome CDP test suite across viewports
# (Requires local server running on port 8080)
node scripts/test_browser_interactive.js
```

### Verification Criteria
- `verify_deployment.py` must report: `ALL VERIFICATION CHECKS PASSED: 100% PRODUCTION READY` with 13 layers and 3,327 features.
- `test_browser_interactive.js` must report: `SUCCESS: 0 console errors or uncaught exceptions detected!` and pass all modal opens/closes, drawer collapse/expand, and preset pill switches.
