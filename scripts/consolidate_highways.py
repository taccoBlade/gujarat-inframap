import json
import os

input_file = "data/gujarat_roads.geojson"
output_file = "data/gujarat_roads_unified.geojson"

with open(input_file, "r", encoding="utf-8") as f:
    data = json.load(f)

corridors = {}

# Special overrides for official MoRTH details
CORRIDOR_METADATA = {
    "NE 1": {
        "title": "National Expressway 1 (NE-1) — Mahatma Gandhi Expressway",
        "route": "Ahmedabad (SP Ring Road) ↔ Anand ↔ Nadiad ↔ Vadodara (Golden Chaukdi)",
        "speed_limit_kmh": 120,
        "class_label": "Access-Controlled Expressway",
        "category": "expressway",
        "operator": "National Highways Authority of India (NHAI)"
    },
    "Delhi - Vadodara Expressway": {
        "title": "Delhi — Mumbai Expressway (NE-4 / NH-148N Greenfield Alignment)",
        "route": "Dahod (MP Border) ↔ Godhra ↔ Vadodara ↔ Bharuch ↔ Surat ↔ Valsad",
        "speed_limit_kmh": 120,
        "class_label": "8-Lane Access-Controlled Greenfield Expressway",
        "category": "expressway",
        "operator": "National Highways Authority of India (NHAI)"
    },
    "NH 48": {
        "title": "Delhi — Mumbai Golden Quadrilateral Lifeline (NH 48)",
        "route": "Maharashtra Border (Bhilad / Vapi) ↔ Valsad ↔ Navsari ↔ Surat ↔ Ankleshwar ↔ Bharuch ↔ Vadodara ↔ Anand ↔ Kheda ↔ Ahmedabad",
        "speed_limit_kmh": 100,
        "class_label": "Golden Quadrilateral Arterial (6-8 Lanes)",
        "category": "golden_quadrilateral",
        "operator": "National Highways Authority of India (NHAI)"
    },
    "NH 27": {
        "title": "East — West Economic Corridor Lifeline (NH 27)",
        "route": "Porbandar Port ↔ Upleta ↔ Dhoraji ↔ Gondal ↔ Rajkot ↔ Bamanbore ↔ Morbi ↔ Samakhiali ↔ Radhanpur ↔ Deesa ↔ Palanpur ↔ Rajasthan Border (Abu Road)",
        "speed_limit_kmh": 100,
        "class_label": "Trans-National Economic Arterial Corridor",
        "category": "arterial_corridor",
        "operator": "National Highways Authority of India (NHAI)"
    },
    "NH 47": {
        "title": "Bamanbore — Ahmedabad — Godhra — Indore Corridor (NH 47)",
        "route": "Bamanbore ↔ Limbdi ↔ Bagodara ↔ Ahmedabad ↔ Dakor ↔ Godhra ↔ Dahod ↔ MP Border (Jhabua / Indore)",
        "speed_limit_kmh": 100,
        "class_label": "Inter-State Industrial Arterial Corridor",
        "category": "arterial_corridor",
        "operator": "National Highways Authority of India (NHAI)"
    },
    "NH 53": {
        "title": "Hazira Port — Surat — Dhule — Kolkata Arterial Corridor (NH 53)",
        "route": "Hazira Deepwater Port ↔ Surat Industrial Hub ↔ Bardoli ↔ Vyara ↔ Songadh ↔ Maharashtra Border (Navapur / Dhule)",
        "speed_limit_kmh": 100,
        "class_label": "Port-Connectivity Strategic Arterial Corridor",
        "category": "arterial_corridor",
        "operator": "National Highways Authority of India (NHAI)"
    },
    "NH 64": {
        "title": "Ahmedabad — Dholera Special Investment Region (SIR) — Bhavnagar Expressway Corridor (NH 64)",
        "route": "Ahmedabad (Sarkhej) ↔ Dholka ↔ Dholera Smart City SIR ↔ Bhavnagar Port",
        "speed_limit_kmh": 100,
        "class_label": "Semiconductor & SIR Industrial Corridor",
        "category": "arterial_corridor",
        "operator": "National Highways Authority of India (NHAI)"
    },
    "NH 754K": {
        "title": "Amritsar — Jamnagar Economic Corridor (NH 754K)",
        "route": "Rajasthan Border (Sanchore) ↔ Tharad ↔ Vav ↔ Santalpur ↔ Malia ↔ Jamnagar Refining Complex",
        "speed_limit_kmh": 100,
        "class_label": "Refinery & Energy Economic Corridor",
        "category": "arterial_corridor",
        "operator": "National Highways Authority of India (NHAI)"
    },
    "NH 51": {
        "title": "Coastal Saurashtra Strategic Highway (NH 51)",
        "route": "Dwarka ↔ Porbandar ↔ Mangrol ↔ Veraval (Somnath) ↔ Kodinar ↔ Una ↔ Mahuva ↔ Talaja ↔ Bhavnagar",
        "speed_limit_kmh": 90,
        "class_label": "Maritime Coastal Strategic Highway",
        "category": "national_highway",
        "operator": "National Highways Authority of India (NHAI)"
    },
    "NH 41": {
        "title": "Kandla Port — Samakhiali — Mandvi Strategic Corridor (NH 41)",
        "route": "Samakhiali ↔ Gandhidham ↔ Kandla Major Port ↔ Anjar ↔ Mundra Port Spur ↔ Mandvi",
        "speed_limit_kmh": 90,
        "class_label": "Port-Hinterland Primary Highway",
        "category": "national_highway",
        "operator": "National Highways Authority of India (NHAI)"
    },
    "NH 58": {
        "title": "Palanpur — Ambaji — Udaipur Pilgrimage & Industrial Highway (NH 58)",
        "route": "Palanpur Junction ↔ Danta ↔ Ambaji Shaktipeeth ↔ Rajasthan Border (Khedbrahma / Udaipur)",
        "speed_limit_kmh": 80,
        "class_label": "Pilgrimage & Inter-State National Highway",
        "category": "national_highway",
        "operator": "National Highways Authority of India (NHAI)"
    },
    "NH 68": {
        "title": "Barmer — Sanchore — Tharad — Radhanpur Desert Highway (NH 68)",
        "route": "Rajasthan Border (Sanchore) ↔ Tharad ↔ Bhabhar ↔ Radhanpur Junction (NH 27 Interchange)",
        "speed_limit_kmh": 90,
        "class_label": "Border Strategic National Highway",
        "category": "national_highway",
        "operator": "National Highways Authority of India (NHAI)"
    },
    "NH 56": {
        "title": "Eastern Tribal Arterial Highway (NH 56)",
        "route": "Nimach / MP Border ↔ Dahod ↔ Jhalod ↔ Chhota Udepur ↔ Rajpipla ↔ Netrang ↔ Vyara ↔ Vapi",
        "speed_limit_kmh": 80,
        "class_label": "Eastern Foothills Tribal Strategic Highway",
        "category": "national_highway",
        "operator": "National Highways Authority of India (NHAI)"
    }
}

for f in data["features"]:
    p = f["properties"]
    raw_c = p.get("corridor") or p.get("name") or "Other"
    c = " ".join(raw_c.split())
    if c == "NH 151 A": c = "NH 151A"
    if c == "NH 147 D": c = "NH 147D"
    if c == "NH 168, NH 168A": c = "NH 168A"
    if c == "NH 753B, NH 752G": c = "NH 752G"
    
    if c not in corridors:
        meta = CORRIDOR_METADATA.get(c, {})
        corridors[c] = {
            "type": "Feature",
            "properties": {
                "corridor": c,
                "name": meta.get("title") or p.get("title") or f"{c} Highway Corridor",
                "title": meta.get("title") or p.get("title") or f"{c} Corridor",
                "category": meta.get("category") or p.get("category", "national_highway"),
                "class_label": meta.get("class_label") or p.get("class_label", "National Highway"),
                "route": meta.get("route") or p.get("route") or f"Continuous Interstate & Intra-State Highway Alignment ({c})",
                "operator": meta.get("operator") or p.get("operator", "NHAI / MoRTH"),
                "speed_limit_kmh": meta.get("speed_limit_kmh") or p.get("speed_limit_kmh", 80),
                "total_length_km": 0.0
            },
            "geometry": {
                "type": "MultiLineString",
                "coordinates": []
            }
        }
    
    corridors[c]["properties"]["total_length_km"] += float(p.get("length_km", 0.0))
    g = f["geometry"]
    if g["type"] == "LineString":
        corridors[c]["geometry"]["coordinates"].append(g["coordinates"])
    elif g["type"] == "MultiLineString":
        corridors[c]["geometry"]["coordinates"].extend(g["coordinates"])

for c in corridors.values():
    c["properties"]["total_length_km"] = round(c["properties"]["total_length_km"], 1)

output_geojson = {
    "type": "FeatureCollection",
    "name": "gujarat_roads_unified",
    "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
    "features": list(corridors.values())
}

with open(output_file, "w", encoding="utf-8") as f:
    json.dump(output_geojson, f, separators=(",", ":"))

print(f"Successfully created {output_file} with {len(corridors)} unified highway corridors.")
