/*
  Overpass Turbo Query: Gujarat Electrical Infrastructure
  Target: Power substations, transmission lines, power plants
  Tool: Paste into https://overpass-turbo.eu/ and click Run -> Export -> GeoJSON
*/

[out:json][timeout:180];

// 1. Locate the Gujarat administrative polygon
{{geocodeArea:Gujarat}}->.searchArea;

// 2. Query power distribution and generation features
(
  // Transmission lines (GETCO / PowerGrid corridors)
  way["power"="line"](area.searchArea);
  way["power"="minor_line"](area.searchArea);
  way["power"="cable"](area.searchArea);

  // Electrical substations (66kV, 132kV, 220kV, 400kV, 765kV)
  node["power"="substation"](area.searchArea);
  way["power"="substation"](area.searchArea);
  relation["power"="substation"](area.searchArea);

  // Power plants (Thermal, Solar parks like Charanka, Wind farms in Kutch/Saurashtra, Hydro)
  node["power"="plant"](area.searchArea);
  way["power"="plant"](area.searchArea);
  relation["power"="plant"](area.searchArea);
);

// 3. Output features and geometry
out body;
>;
out skel qt;
