/*
  Overpass Turbo Query: Gujarat Administrative Boundaries
  Target: State boundary and District boundaries
  Tool: Paste into https://overpass-turbo.eu/ and click Run -> Export -> GeoJSON
*/

[out:json][timeout:120];

// 1. Locate the Gujarat administrative polygon
{{geocodeArea:Gujarat}}->.searchArea;

// 2. Query administrative boundaries
(
  // State boundary (admin_level = 4)
  relation["boundary"="administrative"]["admin_level"="4"](area.searchArea);

  // District boundaries (admin_level = 5 or 6 in India)
  relation["boundary"="administrative"]["admin_level"="5"](area.searchArea);
  relation["boundary"="administrative"]["admin_level"="6"](area.searchArea);
);

// 3. Output features and geometry
out body;
>;
out skel qt;
