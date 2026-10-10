/*
  Overpass Turbo Query: Gujarat Railways & Stations
  Target: Main railway tracks, junctions, stations, halts
  Tool: Paste into https://overpass-turbo.eu/ and click Run -> Export -> GeoJSON
*/

[out:json][timeout:120];

// 1. Locate the Gujarat administrative polygon
{{geocodeArea:Gujarat}}->.searchArea;

// 2. Query railway tracks and stations
(
  // Mainline rail tracks (Indian Railways broad gauge, freight corridors, etc.)
  way["railway"="rail"](area.searchArea);

  // Railway stations and stops
  node["railway"="station"](area.searchArea);
  node["railway"="halt"](area.searchArea);
  way["railway"="station"](area.searchArea);
);

// 3. Output features and geometry
out body;
>;
out skel qt;
