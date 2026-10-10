/*
  Overpass Turbo Query: Gujarat Highways & Major Roads
  Target: Motorways, Trunk (National Highways), Primary (State Highways), Secondary
  Tool: Paste into https://overpass-turbo.eu/ and click Run -> Export -> GeoJSON
*/

[out:json][timeout:180];

// 1. Locate the Gujarat administrative polygon
{{geocodeArea:Gujarat}}->.searchArea;

// 2. Query major road networks
(
  // Motorways / Expressways (e.g., NE-1 Ahmedabad-Vadodara Expressway)
  way["highway"="motorway"](area.searchArea);
  way["highway"="motorway_link"](area.searchArea);

  // Trunk roads (National Highways, e.g., NH-48, NH-27)
  way["highway"="trunk"](area.searchArea);
  way["highway"="trunk_link"](area.searchArea);

  // Primary roads (State Highways & Major Arterials)
  way["highway"="primary"](area.searchArea);
  way["highway"="primary_link"](area.searchArea);

  // Secondary roads (Major District Roads connecting talukas/towns)
  way["highway"="secondary"](area.searchArea);
);

// 3. Output features and geometry
out body;
>;
out skel qt;
