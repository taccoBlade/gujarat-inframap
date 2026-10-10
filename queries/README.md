# Overpass Turbo Starter Kit — Gujarat InfraMap

This directory contains ready-to-use Overpass QL queries for OpenStreetMap via [Overpass Turbo](https://overpass-turbo.eu/).

---

## How to Run These Queries

1. Open [https://overpass-turbo.eu/](https://overpass-turbo.eu/) in your web browser.
2. Open any `.overpassql` file in this folder in VS Code or Notepad.
3. Copy the entire query text and paste it into the left code editor on Overpass Turbo.
4. Click the **Run** button at the top left.
5. Once the data loads on the map:
   - Click **Export** (top menu bar)
   - Under **Data**, click **download as GeoJSON**
   - Save the file into your project's `data/` folder (e.g., `data/gujarat_roads.geojson`).

---

## Tips for Working with QGIS

- **Inspect in QGIS:** Drag and drop the downloaded `.geojson` file directly into your QGIS map window.
- **Simplify Geometries:** In QGIS, go to **Vector → Geometry Tools → Simplify** to reduce file sizes if needed for web performance.
- **Save as Clean GeoJSON:** Right-click the layer in QGIS → **Export → Save Features As...** → format: `GeoJSON`, Coordinate Reference System (CRS): `EPSG:4326 - WGS 84`.
