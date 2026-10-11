# Gujarat InfraMap — Geospatial Dataset Catalog & Provenance

This catalog documents the 13 official, statutory public datasets integrated into the Gujarat InfraMap Digital Twin.

| ID | Dataset Name | Category | Features | Geometry | Primary Source | License |
| :--- | :--- | :--- | :---: | :--- | :--- | :--- |
| `GJ-GEO-DIST-01` | **Gujarat Administrative Revenue Districts** | Administrative Boundaries | 33 | MultiPolygon, Polygon | Survey of India / Revenue Dept Gujarat | Open Government Data (OGD) India / Government of Gujarat |
| `GJ-GEO-DHQ-01` | **District Collectorate Headquarters & Administrative Centroids** | Administrative Boundaries | 33 | Point | General Administration Department (GAD) Gujarat | Open Government Data (OGD) India |
| `GJ-TR-RDS-01` | **Gujarat Strategic Highway Corridors & Expressways Network** | Roads & Highways | 43 | MultiLineString | NHAI / MoRTH / Gujarat R&B Department | MoRTH National Highways Open Geospatial Access |
| `GJ-TR-STR-01` | **Signature Bridges, Elevated Flyovers, Tunnels & Freight Terminals** | Roads & Highways | 31 | Point | NHAI / Western Railway / Gujarat R&B Dept / DFCCIL | Open Government Data (OGD) India |
| `GJ-TR-RLY-01` | **Western Railway Broad-Gauge Lines & Dedicated Freight Corridor (WDFC)** | Railways & Stations | 2264 | LineString | Ministry of Railways / Western Railway / DFCCIL | Indian Railways Open Spatial Portal |
| `GJ-TR-STN-01` | **Western Railway Stations & Intermodal Junctions** | Railways & Stations | 623 | Point | Ministry of Railways / Western Railway / CRIS | Indian Railways Open Spatial Portal |
| `GJ-WR-ALL-01` | **Gujarat Dams, Reservoirs, River Trunks, Canals & Command Areas** | Dams & Reservoirs / Rivers & Canals | 90 | LineString, Point, Polygon | Central Water Commission (CWC) / Narmada, Water Resources, Water Supply and Kalpsar Dept (NWRWS) | India-WRIS / National Water Informatics Centre (NWIC) |
| `GJ-HY-GW-01` | **CGWB Aquifer Categorization & Groundwater Stress Monitoring** | Hydrology & Groundwater | 33 | Point | Central Ground Water Board (CGWB) / Dynamic GW Assessment 2023 | Ministry of Jal Shakti / CGWB Open Data |
| `GJ-EN-PWR-01` | **Central & State Generating Stations (Thermal, Solar, Wind, Hydro, Nuclear)** | Power & Energy | 49 | Point | Central Electricity Authority (CEA) / GSECL / GEDA | CEA Open Data / Ministry of Power |
| `GJ-EN-TX-01` | **GETCO 400 kV & 765 kV Extra High Voltage (EHV) Transmission Grid** | Power & Energy | 37 | LineString, Point | Gujarat Energy Transmission Corporation Limited (GETCO) / WRPC | GETCO Statutory Grid Map |
| `GJ-UR-IND-01` | **Commercial Seaports, Commercial Aerodromes, Mega GIDC/SEZs & Municipalities** | Urban & Industrial Infrastructure | 34 | LineString, Point | Gujarat Maritime Board (GMB) / AAI / GIDC / Urban Development Dept | Government of Gujarat Open Data |
| `GJ-ENV-INT-01` | **Gujarat Geoenvironmental Intelligence Registry (GSI, CGWB, SRTM, NBSS&LUP)** | Geology & Terrain / Environment & Hazards | 41 | LineString, Point | Geological Survey of India (GSI) / NBSS&LUP / NASA-USGS SRTM / NCSCM | GSI Bhukosh / Bhuvan Open Data / USGS Open Access |
| `GJ-ENV-HAZ-01` | **BIS IS 1893 Seismic Zones, IMD Cyclone Paths & Ramsar Sanctuaries** | Environment & Hazards | 16 | Point | Bureau of Indian Standards (BIS) / IMD / Gujarat Forest Department | BIS Standards / MoEFCC Open Data |

## Dataset Details & Provenance

### Gujarat Administrative Revenue Districts (`GJ-GEO-DIST-01`)
- **Category:** Administrative Boundaries
- **Feature Count:** 33 features (MultiPolygon, Polygon)
- **Spatial Reference:** EPSG:4326 (WGS 84) — Coverage: Gujarat State, India (20.1°N - 24.7°N, 68.1°E - 74.5°E)
- **Authoritative Source:** [Survey of India / Revenue Dept Gujarat](https://revenue.gujarat.gov.in)
- **License Terms:** Open Government Data (OGD) India / Government of Gujarat
- **Processed File:** `data/gujarat_districts.geojson` (Raw: `data/gujarat_districts.geojson`)
- **ETL Pipeline Script:** `scripts/generate_domain_layers.py`
- **Indexed Properties:** `area_sqkm, bbox, centroid, city_area_sqkm, district, district_gu, dt_code, hq, location_desc, official_portal, population_2011, state`

### District Collectorate Headquarters & Administrative Centroids (`GJ-GEO-DHQ-01`)
- **Category:** Administrative Boundaries
- **Feature Count:** 33 features (Point)
- **Spatial Reference:** EPSG:4326 (WGS 84) — Coverage: Gujarat State, India (20.1°N - 24.7°N, 68.1°E - 74.5°E)
- **Authoritative Source:** [General Administration Department (GAD) Gujarat](https://gad.gujarat.gov.in)
- **License Terms:** Open Government Data (OGD) India
- **Processed File:** `data/gujarat_district_hq.geojson` (Raw: `data/gujarat_district_hq.geojson`)
- **ETL Pipeline Script:** `scripts/generate_domain_layers.py`
- **Indexed Properties:** `area_sqkm, city_area_sqkm, district, district_gu, hq, location_desc, official_portal, population_2011, state, talukas_count, urban_body`

### Gujarat Strategic Highway Corridors & Expressways Network (`GJ-TR-RDS-01`)
- **Category:** Roads & Highways
- **Feature Count:** 43 features (MultiLineString)
- **Spatial Reference:** EPSG:4326 (WGS 84) — Coverage: Gujarat State, India (20.1°N - 24.7°N, 68.1°E - 74.5°E)
- **Authoritative Source:** [NHAI / MoRTH / Gujarat R&B Department](https://nhai.gov.in)
- **License Terms:** MoRTH National Highways Open Geospatial Access
- **Processed File:** `data/gujarat_roads.geojson` (Raw: `data/raw/gujarat_roads.geojson`)
- **ETL Pipeline Script:** `scripts/consolidate_highways.py`
- **Indexed Properties:** `category, class_label, connected_bridge_ids, corridor, lane_count, name, operator, project_details, responsible_authority, road_classification, route, speed_limit_kmh`

### Signature Bridges, Elevated Flyovers, Tunnels & Freight Terminals (`GJ-TR-STR-01`)
- **Category:** Roads & Highways
- **Feature Count:** 31 features (Point)
- **Spatial Reference:** EPSG:4326 (WGS 84) — Coverage: Gujarat State, India (20.1°N - 24.7°N, 68.1°E - 74.5°E)
- **Authoritative Source:** [NHAI / Western Railway / Gujarat R&B Dept / DFCCIL](https://dfccil.com)
- **License Terms:** Open Government Data (OGD) India
- **Processed File:** `data/gujarat_transport_structures.geojson` (Raw: `data/raw/gujarat_transport_structures.geojson`)
- **ETL Pipeline Script:** `scripts/build_transport_network.py`
- **Indexed Properties:** `alternate_name, asset_category, bridge_type, commissioning_date, commissioning_year, cost_inr_crore, deck_width_m, design_consultant, district, feature_crossed_id, id, inspection_disclosure`

### Western Railway Broad-Gauge Lines & Dedicated Freight Corridor (WDFC) (`GJ-TR-RLY-01`)
- **Category:** Railways & Stations
- **Feature Count:** 2264 features (LineString)
- **Spatial Reference:** EPSG:4326 (WGS 84) — Coverage: Gujarat State, India (20.1°N - 24.7°N, 68.1°E - 74.5°E)
- **Authoritative Source:** [Ministry of Railways / Western Railway / DFCCIL](https://wr.indianrailways.gov.in)
- **License Terms:** Indian Railways Open Spatial Portal
- **Processed File:** `data/gujarat_railways.geojson` (Raw: `data/gujarat_railways.geojson`)
- **ETL Pipeline Script:** `scripts/pipeline.py`
- **Indexed Properties:** `electrified, gauge, gauge_code, length_km, name, zone`

### Western Railway Stations & Intermodal Junctions (`GJ-TR-STN-01`)
- **Category:** Railways & Stations
- **Feature Count:** 623 features (Point)
- **Spatial Reference:** EPSG:4326 (WGS 84) — Coverage: Gujarat State, India (20.1°N - 24.7°N, 68.1°E - 74.5°E)
- **Authoritative Source:** [Ministry of Railways / Western Railway / CRIS](https://cris.org.in)
- **License Terms:** Indian Railways Open Spatial Portal
- **Processed File:** `data/gujarat_stations.geojson` (Raw: `data/gujarat_stations.geojson`)
- **ETL Pipeline Script:** `scripts/pipeline.py`
- **Indexed Properties:** `category, class_label, code, division, division_code, is_major, name, raw_name, state, zone`

### Gujarat Dams, Reservoirs, River Trunks, Canals & Command Areas (`GJ-WR-ALL-01`)
- **Category:** Dams & Reservoirs / Rivers & Canals
- **Feature Count:** 90 features (LineString, Point, Polygon)
- **Spatial Reference:** EPSG:4326 (WGS 84) — Coverage: Gujarat State, India (20.1°N - 24.7°N, 68.1°E - 74.5°E)
- **Authoritative Source:** [Central Water Commission (CWC) / Narmada, Water Resources, Water Supply and Kalpsar Dept (NWRWS)](https://indiawris.gov.in)
- **License Terms:** India-WRIS / National Water Informatics Centre (NWIC)
- **Processed File:** `data/gujarat_water_resources.geojson` (Raw: `data/raw/gujarat_water_resources.geojson`)
- **ETL Pipeline Script:** `scripts/build_water_network.py`
- **Indexed Properties:** `alternate_names, asset_category, average_annual_runoff_mcm, avg_annual_yield_mcm, basin, basin_id, capacity_mld, command_ids, commission_year, connected_canals, connected_dams, connected_reservoirs`

### CGWB Aquifer Categorization & Groundwater Stress Monitoring (`GJ-HY-GW-01`)
- **Category:** Hydrology & Groundwater
- **Feature Count:** 33 features (Point)
- **Spatial Reference:** EPSG:4326 (WGS 84) — Coverage: Gujarat State, India (20.1°N - 24.7°N, 68.1°E - 74.5°E)
- **Authoritative Source:** [Central Ground Water Board (CGWB) / Dynamic GW Assessment 2023](https://cgwb.gov.in)
- **License Terms:** Ministry of Jal Shakti / CGWB Open Data
- **Processed File:** `data/gujarat_groundwater_geology.geojson` (Raw: `data/gujarat_groundwater_geology.geojson`)
- **ETL Pipeline Script:** `scripts/generate_domain_layers.py`
- **Indexed Properties:** `asset_category, cgwb_category, data_quality, district, dominant_aquifer, geological_terrain, id, retrieval_date, salinity_risk, source_org, source_url, stage_of_extraction_pct`

### Central & State Generating Stations (Thermal, Solar, Wind, Hydro, Nuclear) (`GJ-EN-PWR-01`)
- **Category:** Power & Energy
- **Feature Count:** 49 features (Point)
- **Spatial Reference:** EPSG:4326 (WGS 84) — Coverage: Gujarat State, India (20.1°N - 24.7°N, 68.1°E - 74.5°E)
- **Authoritative Source:** [Central Electricity Authority (CEA) / GSECL / GEDA](https://cea.nic.in)
- **License Terms:** CEA Open Data / Ministry of Power
- **Processed File:** `data/gujarat_power.geojson` (Raw: `data/raw/gujarat_power.geojson`)
- **ETL Pipeline Script:** `scripts/build_energy_network.py`
- **Indexed Properties:** `annual_generation_mu, associated_dam_id, associated_dam_name, associated_reservoir, associated_reservoir_id, basin, capacity_metric_type, capacity_mw, category, commissioning_year, connected_substations, connected_transmission_ids`

### GETCO 400 kV & 765 kV Extra High Voltage (EHV) Transmission Grid (`GJ-EN-TX-01`)
- **Category:** Power & Energy
- **Feature Count:** 37 features (LineString, Point)
- **Spatial Reference:** EPSG:4326 (WGS 84) — Coverage: Gujarat State, India (20.1°N - 24.7°N, 68.1°E - 74.5°E)
- **Authoritative Source:** [Gujarat Energy Transmission Corporation Limited (GETCO) / WRPC](https://getcogujarat.com)
- **License Terms:** GETCO Statutory Grid Map
- **Processed File:** `data/gujarat_transmission.geojson` (Raw: `data/raw/gujarat_transmission.geojson`)
- **ETL Pipeline Script:** `scripts/build_energy_network.py`
- **Indexed Properties:** `busbar_scheme, capacity_metric_type, circuits, connected_lines, connected_plant_ids, connected_plants, corridor_code, district, evacuation_role, feature_type, id, length_km`

### Commercial Seaports, Commercial Aerodromes, Mega GIDC/SEZs & Municipalities (`GJ-UR-IND-01`)
- **Category:** Urban & Industrial Infrastructure
- **Feature Count:** 34 features (LineString, Point)
- **Spatial Reference:** EPSG:4326 (WGS 84) — Coverage: Gujarat State, India (20.1°N - 24.7°N, 68.1°E - 74.5°E)
- **Authoritative Source:** [Gujarat Maritime Board (GMB) / AAI / GIDC / Urban Development Dept](https://gmbports.org)
- **License Terms:** Government of Gujarat Open Data
- **Processed File:** `data/gujarat_urban_industry.geojson` (Raw: `data/raw/gujarat_urban_industry.geojson`)
- **ETL Pipeline Script:** `scripts/generate_domain_layers.py`
- **Indexed Properties:** `airport_type, area_sqkm, asset_category, authority, berths_count, capacity_mmt, city, connected_structures, data_quality, district, draft_m, focus`

### Gujarat Geoenvironmental Intelligence Registry (GSI, CGWB, SRTM, NBSS&LUP) (`GJ-ENV-INT-01`)
- **Category:** Geology & Terrain / Environment & Hazards
- **Feature Count:** 41 features (LineString, Point)
- **Spatial Reference:** EPSG:4326 (WGS 84) — Coverage: Gujarat State, India (20.1°N - 24.7°N, 68.1°E - 74.5°E)
- **Authoritative Source:** [Geological Survey of India (GSI) / NBSS&LUP / NASA-USGS SRTM / NCSCM](https://bhukosh.gsi.gov.in)
- **License Terms:** GSI Bhukosh / Bhuvan Open Data / USGS Open Access
- **Processed File:** `data/gujarat_geoenvironmental.geojson` (Raw: `data/raw/gujarat_geoenvironmental.geojson`)
- **ETL Pipeline Script:** `scripts/build_geoenvironmental_data.py`
- **Indexed Properties:** `age_era, annual_fluctuation_m, aquifer_type, area_sqkm, asset_category, cgwb_status, civil_implications, coastal_stretch, data_quality, designation, dip_direction, district`

### BIS IS 1893 Seismic Zones, IMD Cyclone Paths & Ramsar Sanctuaries (`GJ-ENV-HAZ-01`)
- **Category:** Environment & Hazards
- **Feature Count:** 16 features (Point)
- **Spatial Reference:** EPSG:4326 (WGS 84) — Coverage: Gujarat State, India (20.1°N - 24.7°N, 68.1°E - 74.5°E)
- **Authoritative Source:** [Bureau of Indian Standards (BIS) / IMD / Gujarat Forest Department](https://bis.gov.in)
- **License Terms:** BIS Standards / MoEFCC Open Data
- **Processed File:** `data/gujarat_environment_disaster.geojson` (Raw: `data/gujarat_environment_disaster.geojson`)
- **ETL Pipeline Script:** `scripts/generate_domain_layers.py`
- **Indexed Properties:** `active_faults, area_sqkm, asset_category, basic_wind_speed_kmh, basic_wind_speed_ms, basin, coastal_length_km, data_quality, design_code, designation, district, districts_covered`
