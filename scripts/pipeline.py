"""
Gujarat InfraMap — Master Data Engineering Pipeline
Commands:
  python scripts/pipeline.py          # Runs full end-to-end pipeline (download, clip, optimize, verify)
  python scripts/pipeline.py --verify # Quick validation of existing data layers
"""

import os
import sys
import json
import time
import math
import collections
import requests

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")
os.makedirs(DATA_DIR, exist_ok=True)

# Gujarat Spatial Bounding Box: [min_lon, min_lat, max_lon, max_lat]
BBOX = {
    "min_lon": 68.10,
    "min_lat": 20.10,
    "max_lon": 74.50,
    "max_lat": 24.75
}

# Authoritative District Metadata (All 33 Administrative Districts of Gujarat - Official Census 2011 / GoG)
DISTRICT_META = {
    "Ahmedabad": {
        "gu": "અમદાવાદ", "hq": "Ahmedabad", "area_sqkm": 8087.0, "city_area_sqkm": 466.0,
        "urban_body": "Ahmedabad Municipal Corporation (AMC)",
        "location_desc": "Situated along the banks of the Sabarmati River in north-central Gujarat, India.",
        "population_2011": 7214225, "talukas_count": 10, "official_portal": "https://ahmedabadcity.gov.in",
        "dt_code": "438", "hq_coords": [72.58912, 23.02656]
    },
    "Surat": {
        "gu": "સુરત", "hq": "Surat", "area_sqkm": 4418.0, "city_area_sqkm": 462.1,
        "urban_body": "Surat Municipal Corporation (SMC)",
        "location_desc": "Situated on the banks of the Tapi River near the Gulf of Khambhat in South Gujarat.",
        "population_2011": 6081322, "talukas_count": 10, "official_portal": "https://suratmunicipal.gov.in",
        "dt_code": "492", "hq_coords": [72.82567, 21.19612]
    },
    "Vadodara": {
        "gu": "વડોદરા", "hq": "Vadodara", "area_sqkm": 7794.0, "city_area_sqkm": 220.3,
        "urban_body": "Vadodara Municipal Corporation (VMC)",
        "location_desc": "Situated along the banks of the Vishwamitri River in central Gujarat, known as the cultural capital of Gujarat.",
        "population_2011": 4165626, "talukas_count": 8, "official_portal": "https://vmc.gov.in",
        "dt_code": "486", "hq_coords": [73.20539, 22.28820]
    },
    "Rajkot": {
        "gu": "રાજકોટ", "hq": "Rajkot", "area_sqkm": 11203.0, "city_area_sqkm": 129.2,
        "urban_body": "Rajkot Municipal Corporation (RMC)",
        "location_desc": "Situated along the Aji and Nyari rivers in the central Saurashtra peninsula.",
        "population_2011": 3804558, "talukas_count": 11, "official_portal": "https://rmc.gov.in",
        "dt_code": "476", "hq_coords": [70.80503, 22.29564]
    },
    "Bhavnagar": {
        "gu": "ભાવનગર", "hq": "Bhavnagar", "area_sqkm": 8334.0, "city_area_sqkm": 108.3,
        "urban_body": "Bhavnagar Municipal Corporation (BMC)",
        "location_desc": "Coastal district situated on the western shore of the Gulf of Khambhat in Saurashtra.",
        "population_2011": 2880365, "talukas_count": 10, "official_portal": "https://bmcgujarat.com",
        "dt_code": "481", "hq_coords": [72.13923, 21.77464]
    },
    "Jamnagar": {
        "gu": "જામનગર", "hq": "Jamnagar", "area_sqkm": 14125.0, "city_area_sqkm": 125.7,
        "urban_body": "Jamnagar Municipal Corporation (JMC)",
        "location_desc": "Situated south of the Gulf of Kutch in north-western Saurashtra, known as the Brass City and refining capital.",
        "population_2011": 2160119, "talukas_count": 6, "official_portal": "https://mcjamnagar.com",
        "dt_code": "477", "hq_coords": [70.07241, 22.47148]
    },
    "Junagadh": {
        "gu": "જૂનાગઢ", "hq": "Junagadh", "area_sqkm": 8839.0, "city_area_sqkm": 160.0,
        "urban_body": "Junagadh Municipal Corporation (JMC)",
        "location_desc": "Historic city at the foot of Mount Girnar in south-western Saurashtra, gateway to Asiatic lions.",
        "population_2011": 2743082, "talukas_count": 10, "official_portal": "https://junagadhmunicipal.org",
        "dt_code": "479", "hq_coords": [70.46102, 21.52319]
    },
    "Gandhinagar": {
        "gu": "ગાંધીનગર", "hq": "Gandhinagar", "area_sqkm": 2163.0, "city_area_sqkm": 326.0,
        "urban_body": "Gandhinagar Municipal Corporation (GMC)",
        "location_desc": "Planned green capital of Gujarat situated along the west bank of the Sabarmati River.",
        "population_2011": 1391753, "talukas_count": 4, "official_portal": "https://gandhinagarmunicipal.com",
        "dt_code": "474", "hq_coords": [72.66059, 23.23719]
    },
    "Kachchh": {
        "gu": "કચ્છ", "hq": "Bhuj", "area_sqkm": 45674.0, "city_area_sqkm": None,
        "urban_body": "Bhuj Municipality",
        "location_desc": "Largest district in India, bounded by the Arabian Sea, Gulf of Kutch, and the Great & Little Rann of Kutch salt deserts.",
        "population_2011": 2092371, "talukas_count": 10, "official_portal": "https://kutch.gujarat.gov.in",
        "dt_code": "468", "hq_coords": [69.66592, 23.25155]
    },
    "Banaskantha": {
        "gu": "બનાસકાંઠા", "hq": "Palanpur", "area_sqkm": 10758.0, "city_area_sqkm": None,
        "urban_body": "Palanpur Municipality",
        "location_desc": "Northern border district along the Banas River bordering Rajasthan, leading agricultural and dairy hub (Banas Dairy).",
        "population_2011": 3120506, "talukas_count": 14, "official_portal": "https://banaskantha.gujarat.gov.in",
        "dt_code": "469", "hq_coords": [72.43570, 24.17343]
    },
    "Sabarkantha": {
        "gu": "સાબરકાંઠા", "hq": "Himatnagar", "area_sqkm": 7390.0, "city_area_sqkm": None,
        "urban_body": "Himatnagar Municipality",
        "location_desc": "Northeastern district along the Hathmati and Sabarmati rivers, renowned for Sabar Dairy and historical forts.",
        "population_2011": 2428689, "talukas_count": 8, "official_portal": "https://sabarkantha.gujarat.gov.in",
        "dt_code": "472", "hq_coords": [72.95880, 23.59948]
    },
    "Aravalli": {
        "gu": "અરવલ્લી", "hq": "Modasa", "area_sqkm": 3217.0, "city_area_sqkm": None,
        "urban_body": "Modasa Municipality",
        "location_desc": "Northeastern border district situated in the foothills of the ancient Aravalli range bordering Rajasthan.",
        "population_2011": 1039911, "talukas_count": 6, "official_portal": "https://aravalli.gujarat.gov.in",
        "dt_code": "674", "hq_coords": [73.29740, 23.46275]
    },
    "Kheda": {
        "gu": "ખેડા", "hq": "Nadiad", "area_sqkm": 3959.0, "city_area_sqkm": None,
        "urban_body": "Nadiad Municipality",
        "location_desc": "Central Gujarat Charotar agricultural belt situated between the Sabarmati and Shedhi rivers, HQ at Nadiad (Santram Mandir).",
        "population_2011": 2299885, "talukas_count": 10, "official_portal": "https://kheda.gujarat.gov.in",
        "dt_code": "482", "hq_coords": [72.86336, 22.69158]
    },
    "Anand": {
        "gu": "આણંદ", "hq": "Anand", "area_sqkm": 2941.0, "city_area_sqkm": None,
        "urban_body": "Anand Municipality",
        "location_desc": "The Milk Capital of India, home to the Amul cooperative movement and Institute of Rural Management (IRMA).",
        "population_2011": 2092745, "talukas_count": 8, "official_portal": "https://anand.gujarat.gov.in",
        "dt_code": "483", "hq_coords": [72.96003, 22.55786]
    },
    "Panchmahal": {
        "gu": "પંચમહાલ", "hq": "Godhra", "area_sqkm": 5219.0, "city_area_sqkm": None,
        "urban_body": "Godhra Municipality",
        "location_desc": "Eastern Gujarat district featuring the UNESCO World Heritage Site of Champaner-Pavagadh Archaeological Park.",
        "population_2011": 2390776, "talukas_count": 7, "official_portal": "https://panchmahal.gujarat.gov.in",
        "dt_code": "484", "hq_coords": [73.61899, 22.77774]
    },
    "Mahisagar": {
        "gu": "મહીસાગર", "hq": "Lunawada", "area_sqkm": 2260.0, "city_area_sqkm": None,
        "urban_body": "Lunawada Municipality",
        "location_desc": "Eastern Gujarat district along the holy Mahi River, famous for Kadana Hydroelectric Dam and Balasinor dinosaur fossil park.",
        "population_2011": 994624, "talukas_count": 6, "official_portal": "https://mahisagar.gujarat.gov.in",
        "dt_code": "675", "hq_coords": [73.61098, 23.12722]
    },
    "Dahod": {
        "gu": "દાહોદ", "hq": "Dahod", "area_sqkm": 3642.0, "city_area_sqkm": None,
        "urban_body": "Dahod Municipality",
        "location_desc": "Easternmost border district of Gujarat bordering MP and Rajasthan, major Indian Railways locomotive production hub.",
        "population_2011": 2127086, "talukas_count": 9, "official_portal": "https://dahod.gujarat.gov.in",
        "dt_code": "485", "hq_coords": [74.25573, 22.83500]
    },
    "Chhota Udepur": {
        "gu": "છોટા ઉદેપુર", "hq": "Chhota Udepur", "area_sqkm": 3436.0, "city_area_sqkm": None,
        "urban_body": "Chhota Udepur Municipality",
        "location_desc": "Tribal forested district in eastern Gujarat bordering Madhya Pradesh, famous for indigenous Pithora folk art and mineral reserves.",
        "population_2011": 1071831, "talukas_count": 6, "official_portal": "https://chhotaudepur.gujarat.gov.in",
        "dt_code": "676", "hq_coords": [74.01188, 22.30624]
    },
    "Bharuch": {
        "gu": "ભરૂચ", "hq": "Bharuch", "area_sqkm": 5253.0, "city_area_sqkm": None,
        "urban_body": "Bharuch Municipality",
        "location_desc": "Historical port city on the Narmada River and major chemical hub of India hosting Dahej PCPIR and Golden Bridge.",
        "population_2011": 1551019, "talukas_count": 9, "official_portal": "https://bharuch.gujarat.gov.in",
        "dt_code": "488", "hq_coords": [72.97795, 21.69469]
    },
    "Narmada": {
        "gu": "નર્મદા", "hq": "Rajpipla", "area_sqkm": 2755.0, "city_area_sqkm": None,
        "urban_body": "Rajpipla Municipality",
        "location_desc": "Scenic district in South Gujarat hosting the Sardar Sarovar Dam and the world's tallest monument, the Statue of Unity at Ekta Nagar.",
        "population_2011": 590297, "talukas_count": 5, "official_portal": "https://narmada.gujarat.gov.in",
        "dt_code": "487", "hq_coords": [73.49915, 21.87634]
    },
    "Navsari": {
        "gu": "નવસારી", "hq": "Navsari", "area_sqkm": 2211.0, "city_area_sqkm": None,
        "urban_body": "Navsari Municipality",
        "location_desc": "South Gujarat coastal district along the Purna River, historical Parsi settlement and birthplace of Jamsetji Tata.",
        "population_2011": 1329672, "talukas_count": 6, "official_portal": "https://navsari.gujarat.gov.in",
        "dt_code": "490", "hq_coords": [72.93177, 20.95258]
    },
    "Valsad": {
        "gu": "વલસાડ", "hq": "Valsad", "area_sqkm": 3034.0, "city_area_sqkm": None,
        "urban_body": "Valsad Municipality",
        "location_desc": "Southernmost coastal district bordering Maharashtra and Daman, prominent for Vapi industrial estate and Tithal Beach.",
        "population_2011": 1705678, "talukas_count": 6, "official_portal": "https://valsad.gujarat.gov.in",
        "dt_code": "491", "hq_coords": [72.92750, 20.61530]
    },
    "Tapi": {
        "gu": "તાપી", "hq": "Vyara", "area_sqkm": 3249.0, "city_area_sqkm": None,
        "urban_body": "Vyara Municipality",
        "location_desc": "South Gujarat forested tribal district named after the Tapi River, home to the Ukai Hydro & Thermal Power Complex.",
        "population_2011": 807022, "talukas_count": 7, "official_portal": "https://tapi.gujarat.gov.in",
        "dt_code": "489", "hq_coords": [73.39475, 21.11065]
    },
    "Dang": {
        "gu": "ડાંગ", "hq": "Ahwa", "area_sqkm": 1764.0, "city_area_sqkm": None,
        "urban_body": "Ahwa Administrative Center",
        "location_desc": "Forested hill district in the Western Ghats (Sahyadris), home to Saputara hill station and bamboo/teak forest ecosystems.",
        "population_2011": 228291, "talukas_count": 3, "official_portal": "https://dangs.gujarat.gov.in",
        "dt_code": "493", "hq_coords": [73.68509, 20.75751]
    },
    "Surendranagar": {
        "gu": "સુરેન્દ્રનગર", "hq": "Surendranagar", "area_sqkm": 10489.0, "city_area_sqkm": None,
        "urban_body": "Surendranagar-Dudhrej-Wadhwan Joint Municipality",
        "location_desc": "Gateway to Saurashtra bordering the Little Rann of Kutch (Wild Ass Sanctuary), leading producer of raw cotton and salt.",
        "population_2011": 1756268, "talukas_count": 10, "official_portal": "https://surendranagar.gujarat.gov.in",
        "dt_code": "475", "hq_coords": [71.62809, 22.72940]
    },
    "Morbi": {
        "gu": "મોરબી", "hq": "Morbi", "area_sqkm": 4871.0, "city_area_sqkm": None,
        "urban_body": "Morbi Municipality",
        "location_desc": "Industrial powerhouse on the Machchhu River, producing over 70% of India's ceramic tiles and sanitaryware.",
        "population_2011": 960329, "talukas_count": 5, "official_portal": "https://morbi.gujarat.gov.in",
        "dt_code": "677", "hq_coords": [70.83118, 22.81865]
    },
    "Botad": {
        "gu": "બોટાદ", "hq": "Botad", "area_sqkm": 2564.0, "city_area_sqkm": None,
        "urban_body": "Botad Municipality",
        "location_desc": "Central Saurashtra district famous for diamond polishing, cotton ginning, and the holy pilgrimage site of Sarangpur.",
        "population_2011": 652527, "talukas_count": 4, "official_portal": "https://botad.gujarat.gov.in",
        "dt_code": "678", "hq_coords": [71.66622, 22.17064]
    },
    "Patan": {
        "gu": "પાટણ", "hq": "Patan", "area_sqkm": 5740.0, "city_area_sqkm": None,
        "urban_body": "Patan Municipality",
        "location_desc": "Medieval capital of Gujarat on the Saraswati River, home to UNESCO Rani ki Vav, Patola silk weaving, and Charanka Solar Park.",
        "population_2011": 1343734, "talukas_count": 9, "official_portal": "https://patan.gujarat.gov.in",
        "dt_code": "470", "hq_coords": [72.11493, 23.84995]
    },
    "Mehsana": {
        "gu": "મહેસાણા", "hq": "Mehsana", "area_sqkm": 4386.0, "city_area_sqkm": None,
        "urban_body": "Mehsana Municipality",
        "location_desc": "North Gujarat industrial, oil (ONGC), and dairy hub (Dudh Sagar Dairy), home to Modhera Sun Temple and Vadnagar.",
        "population_2011": 2035064, "talukas_count": 11, "official_portal": "https://mehsana.gujarat.gov.in",
        "dt_code": "471", "hq_coords": [72.38515, 23.60310]
    },
    "Amreli": {
        "gu": "અમરેલી", "hq": "Amreli", "area_sqkm": 7397.0, "city_area_sqkm": None,
        "urban_body": "Amreli Municipality",
        "location_desc": "Southern Saurashtra agricultural district extending to Pipavav Port on the Arabian Sea, habitat for Asiatic lions.",
        "population_2011": 1514190, "talukas_count": 11, "official_portal": "https://amreli.gujarat.gov.in",
        "dt_code": "480", "hq_coords": [71.21571, 21.59849]
    },
    "Gir Somnath": {
        "gu": "ગીર સોમનાથ", "hq": "Veraval", "area_sqkm": 3754.0, "city_area_sqkm": None,
        "urban_body": "Veraval-Patan Joint Municipality",
        "location_desc": "Coastal Saurashtra district hosting the first Jyotirlinga (Somnath Temple), Veraval all-weather fishing port, and Gir lion sanctuary.",
        "population_2011": 1217477, "talukas_count": 6, "official_portal": "https://girsomnath.gujarat.gov.in",
        "dt_code": "679", "hq_coords": [70.36644, 20.90655]
    },
    "Devbhumi Dwarka": {
        "gu": "દેવભૂમિ દ્વારકા", "hq": "Khambhalia", "area_sqkm": 4051.0, "city_area_sqkm": None,
        "urban_body": "Jam Khambhalia Municipality",
        "location_desc": "Western tip of Saurashtra on the Arabian Sea, home to the sacred Dwarkadhish Temple, Bet Dwarka, and Okha port.",
        "population_2011": 752484, "talukas_count": 4, "official_portal": "https://devbhumidwarka.gujarat.gov.in",
        "dt_code": "680", "hq_coords": [69.64989, 22.20593]
    },
    "Porbandar": {
        "gu": "પોરબંદર", "hq": "Porbandar", "area_sqkm": 2298.0, "city_area_sqkm": None,
        "urban_body": "Porbandar-Chhaya Joint Municipality",
        "location_desc": "Coastal district on the Arabian Sea, birthplace of Mahatma Gandhi (Kirti Mandir) and Sudama, commercial port city.",
        "population_2011": 585449, "talukas_count": 3, "official_portal": "https://porbandar.gujarat.gov.in",
        "dt_code": "478", "hq_coords": [69.60633, 21.64100]
    }
}

def is_point_in_gujarat(lon, lat):
    return (BBOX["min_lon"] <= lon <= BBOX["max_lon"]) and (BBOX["min_lat"] <= lat <= BBOX["max_lat"])

def is_line_in_gujarat(coords):
    if not coords:
        return False
    if isinstance(coords[0], (int, float)):
        return is_point_in_gujarat(coords[0], coords[1])
    if isinstance(coords[0], list):
        for pt in coords:
            if is_line_in_gujarat(pt):
                return True
    return False

def filter_feature_by_geom(feature):
    geom = feature.get("geometry")
    if not geom:
        return False
    gtype = geom.get("type")
    coords = geom.get("coordinates")
    if gtype == "Point":
        return is_point_in_gujarat(coords[0], coords[1])
    elif gtype in ["LineString", "MultiLineString", "Polygon", "MultiPolygon"]:
        return is_line_in_gujarat(coords)
    return False

def get_coords_flat(coords):
    res = []
    if not coords:
        return res
    if isinstance(coords[0], (int, float)):
        return [coords]
    for sub in coords:
        res.extend(get_coords_flat(sub))
    return res

def compute_bbox_and_centroid(geom):
    coords = get_coords_flat(geom.get("coordinates", []))
    if not coords:
        return [0, 0, 0, 0], [0, 0]
    lons = [c[0] for c in coords]
    lats = [c[1] for c in coords]
    min_lon, max_lon = min(lons), max(lons)
    min_lat, max_lat = min(lats), max(lats)
    bbox = [round(min_lon, 5), round(min_lat, 5), round(max_lon, 5), round(max_lat, 5)]
    centroid = [round((min_lat + max_lat) / 2, 5), round((min_lon + max_lon) / 2, 5)]
    return bbox, centroid

def round_coords(obj, precision=5):
    if isinstance(obj, float):
        return round(obj, precision)
    elif isinstance(obj, list):
        return [round_coords(item, precision) for item in obj]
    elif isinstance(obj, dict):
        return {k: round_coords(v, precision) for k, v in obj.items()}
    return obj

def save_minified_geojson(filename, data):
    for f in data.get("features", []):
        geom = f.get("geometry")
        if geom and "coordinates" in geom:
            geom["coordinates"] = round_coords(geom["coordinates"])
            
    out_path = os.path.join(DATA_DIR, filename)
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(data, f, separators=(',', ':'), ensure_ascii=False)
    size_kb = os.path.getsize(out_path) / 1024
    print(f"  [OK] {filename}: {len(data.get('features', []))} features saved ({size_kb:.1f} KB)")

def build_districts():
    print("[1/6] Building District Boundaries Layer...")
    url = "https://raw.githubusercontent.com/datta07/INDIAN-SHAPEFILES/master/STATES/GUJARAT/GUJARAT_DISTRICTS.geojson"
    r = requests.get(url, timeout=30)
    if r.status_code == 200:
        data = r.json()
        clean_names = {
            'Ahmadabad': 'Ahmedabad',
            'Banas Kantha': 'Banaskantha',
            'Sabar Kantha': 'Sabarkantha',
            'Panch Mahals': 'Panchmahal',
            'The Dangs': 'Dang',
            'Chota Udaipur': 'Chhota Udepur',
            'Mahesana': 'Mehsana',
            'Dohad': 'Dahod'
        }
        for f in data.get("features", []):
            p = f.get("properties", {})
            raw_name = p.get("dtname") or p.get("district") or "District"
            name_clean = clean_names.get(raw_name, raw_name)
            meta = DISTRICT_META.get(name_clean, {})
            bbox, centroid = compute_bbox_and_centroid(f.get("geometry", {}))
            
            f["properties"] = {
                "district": name_clean,
                "district_gu": meta.get("gu", ""),
                "hq": meta.get("hq", name_clean),
                "state": "Gujarat",
                "dt_code": meta.get("dt_code") or str(p.get("Dist_LGD") or p.get("dtcode11") or "N/A"),
                "area_sqkm": meta.get("area_sqkm", 0.0),
                "city_area_sqkm": meta.get("city_area_sqkm"),
                "urban_body": meta.get("urban_body", ""),
                "location_desc": meta.get("location_desc", ""),
                "population_2011": meta.get("population_2011"),
                "talukas_count": meta.get("talukas_count"),
                "official_portal": meta.get("official_portal", ""),
                "bbox": bbox,
                "centroid": centroid
            }
        save_minified_geojson("gujarat_districts.geojson", data)
    else:
        print(f"  [-] Failed to fetch districts: HTTP {r.status_code}")

def build_district_hq():
    print("[2/6] Building District Headquarters Nodes Layer...")
    features = []
    for district, meta in DISTRICT_META.items():
        coords = meta["hq_coords"]
        feature = {
            "type": "Feature",
            "properties": {
                "district": district,
                "district_gu": meta["gu"],
                "hq": meta["hq"],
                "state": "Gujarat",
                "area_sqkm": meta.get("area_sqkm"),
                "city_area_sqkm": meta.get("city_area_sqkm"),
                "urban_body": meta.get("urban_body"),
                "location_desc": meta.get("location_desc"),
                "population_2011": meta.get("population_2011"),
                "talukas_count": meta.get("talukas_count"),
                "official_portal": meta.get("official_portal")
            },
            "geometry": {
                "type": "Point",
                "coordinates": [round(coords[0], 5), round(coords[1], 5)]
            }
        }
        features.append(feature)
        
    out_geojson = {
        "type": "FeatureCollection",
        "name": "gujarat_district_hq",
        "features": features
    }
    save_minified_geojson("gujarat_district_hq.geojson", out_geojson)

POWER_PLANT_CLEAN_MAP = {
    "Gandhi Nagar TPS": {
        "name": "Gandhinagar Thermal Power Station",
        "category": "thermal",
        "type_label": "Thermal Power (Coal)",
        "capacity_mw": 420.0,
        "fuel": "Bituminous Coal",
        "district": "Gandhinagar",
        "operator": "GSECL"
    },
    "Kutch Lignite TPS": {
        "name": "Kutch Lignite Thermal Power Station (Panandhro)",
        "category": "thermal",
        "type_label": "Thermal Power (Lignite)",
        "capacity_mw": 220.0,
        "fuel": "Indigenous Lignite",
        "district": "Kutch",
        "operator": "GSECL"
    },
    "Sabarmati TPS": {
        "name": "Sabarmati Thermal Power Station",
        "category": "thermal",
        "type_label": "Thermal Power (Coal)",
        "capacity_mw": 110.0,
        "fuel": "Coal",
        "district": "Ahmedabad",
        "operator": "Torrent Power"
    },
    "Sikka TPS": {
        "name": "Sikka Thermal Power Station",
        "category": "thermal",
        "type_label": "Thermal Power (Coal)",
        "capacity_mw": 740.0,
        "fuel": "Imported / Domestic Coal",
        "district": "Jamnagar",
        "operator": "GSECL"
    },
    "Wanakabori TPS-II": {
        "name": "Wanakbori Thermal Power Station",
        "category": "thermal",
        "type_label": "Thermal Power (Coal)",
        "capacity_mw": 1640.0,
        "fuel": "Coal",
        "district": "Kheda",
        "operator": "GSECL"
    },
    "Akrimota TPP": {
        "name": "Akrimota Thermal Power Plant (GMDC)",
        "category": "thermal",
        "type_label": "Thermal Power (Lignite)",
        "capacity_mw": 250.0,
        "fuel": "Lignite (CFBC)",
        "district": "Kutch",
        "operator": "Gujarat Mineral Development Corp (GMDC)"
    },
    "Surat Lignite TPP Extn.": {
        "name": "Surat Lignite Power Plant (GIPCL Nani Naroli)",
        "category": "thermal",
        "type_label": "Thermal Power (Lignite)",
        "capacity_mw": 250.0,
        "fuel": "Lignite",
        "district": "Surat",
        "operator": "Gujarat Industries Power Co (GIPCL)"
    },
    "Ukai TPP Extn.": {
        "name": "Ukai Thermal Power Station (Unit 6 Extn)",
        "category": "thermal",
        "type_label": "Thermal Power (Coal)",
        "capacity_mw": 500.0,
        "fuel": "Coal",
        "district": "Tapi",
        "operator": "GSECL"
    },
    "Bhavnagar CFBC TPP": {
        "name": "Bhavnagar Lignite Thermal Power Station (Padva)",
        "category": "thermal",
        "type_label": "Thermal Power (Lignite)",
        "capacity_mw": 500.0,
        "fuel": "Lignite (CFBC)",
        "district": "Bhavnagar",
        "operator": "BECL / GSECL"
    },
    "Mangrol Lignite": {
        "name": "Mangrol Lignite Thermal Power Plant",
        "category": "thermal",
        "type_label": "Thermal Power (Lignite)",
        "capacity_mw": 250.0,
        "fuel": "Lignite",
        "district": "Surat",
        "operator": "GIPCL"
    },
    "Mundra TPP Ph-1(U-1&2)": {
        "name": "Mundra Thermal Power Station (Adani Power)",
        "category": "thermal",
        "type_label": "Supercritical Thermal (Coal)",
        "capacity_mw": 4620.0,
        "fuel": "Supercritical Coal",
        "district": "Kutch",
        "operator": "Adani Power"
    },
    "Mundra UMTPP": {
        "name": "Mundra Ultra Mega Power Plant (Tata Power UMPP)",
        "category": "thermal",
        "type_label": "Supercritical Thermal (Coal UMPP)",
        "capacity_mw": 4000.0,
        "fuel": "Supercritical Imported Coal",
        "district": "Kutch",
        "operator": "Tata Power"
    },
    "Salaya TPP": {
        "name": "Salaya Thermal Power Plant (Essar Power)",
        "category": "thermal",
        "type_label": "Thermal Power (Coal)",
        "capacity_mw": 1200.0,
        "fuel": "Imported Coal",
        "district": "Jamnagar",
        "operator": "Essar Power Gujarat"
    },
    "MAHIBAJAJ  SAGAR-II": {
        "name": "Mahi Bajaj Sagar Hydroelectric Station",
        "category": "hydro",
        "type_label": "Hydroelectric Dam",
        "capacity_mw": 90.0,
        "fuel": "Hydroelectric Dam",
        "district": "Mahisagar",
        "operator": "Mahi Hydel Project"
    },
    "UKAI": {
        "name": "Ukai Hydro Power Station",
        "category": "hydro",
        "type_label": "Hydroelectric Reservoir Dam",
        "capacity_mw": 300.0,
        "fuel": "Hydroelectric Reservoir Dam",
        "district": "Tapi",
        "operator": "GSECL"
    },
    "S. SAROVAR (CHPH)": {
        "name": "Sardar Sarovar Canal Head Power House (CHPH)",
        "category": "hydro",
        "type_label": "Hydroelectric Canal Head",
        "capacity_mw": 250.0,
        "fuel": "Hydroelectric Canal Head (Kaplan)",
        "district": "Narmada",
        "operator": "Sardar Sarovar Narmada Nigam (SSNNL)"
    },
    "S. SAROVAR (RBPH)": {
        "name": "Sardar Sarovar River Bed Power House (RBPH)",
        "category": "hydro",
        "type_label": "Pumped Storage Hydro (Reversible)",
        "capacity_mw": 1200.0,
        "fuel": "Pumped Storage Francis Turbines",
        "district": "Narmada",
        "operator": "Sardar Sarovar Narmada Nigam (SSNNL)"
    },
    "KADANA PSS & EXT.": {
        "name": "Kadana Pumped Storage Hydro Power Station",
        "category": "hydro",
        "type_label": "Pumped Storage Hydro",
        "capacity_mw": 240.0,
        "fuel": "Pumped Storage Hydro",
        "district": "Mahisagar",
        "operator": "GSECL"
    },
    "Banaskandi CCGT": {
        "name": "Banaskantha Combined Cycle Gas Power Plant",
        "category": "gas",
        "type_label": "Combined Cycle Gas Turbine (CCGT)",
        "capacity_mw": 15.5,
        "fuel": "Natural Gas",
        "district": "Banaskantha",
        "operator": "GIPCL / GSECL"
    },
    "Gandhar CCGT": {
        "name": "Gandhar Gas Power Station (NTPC Jhanor)",
        "category": "gas",
        "type_label": "Combined Cycle Gas Turbine (CCGT)",
        "capacity_mw": 648.0,
        "fuel": "Natural Gas (Combined Cycle)",
        "district": "Bharuch",
        "operator": "NTPC Limited"
    },
    "Kawas CCGT -I": {
        "name": "Kawas Gas Power Station (NTPC)",
        "category": "gas",
        "type_label": "Combined Cycle Gas Turbine (CCGT)",
        "capacity_mw": 538.0,
        "fuel": "Natural Gas (Combined Cycle)",
        "district": "Surat",
        "operator": "NTPC Limited"
    },
    "Utran CCGT": {
        "name": "Utran Gas Combined Cycle Power Station",
        "category": "gas",
        "type_label": "Combined Cycle Gas Turbine (CCGT)",
        "capacity_mw": 452.0,
        "fuel": "Natural Gas",
        "district": "Surat",
        "operator": "GSECL"
    },
    "Hazira CCPP": {
        "name": "Hazira Combined Cycle Power Plant (Essar Power)",
        "category": "gas",
        "type_label": "Combined Cycle Gas Turbine (CCGT)",
        "capacity_mw": 156.1,
        "fuel": "Natural Gas / Naphtha",
        "district": "Surat",
        "operator": "Essar Power"
    },
    "Dhuvaran CCPP": {
        "name": "Dhuvaran Gas Combined Cycle Power Station",
        "category": "gas",
        "type_label": "Combined Cycle Gas Turbine (CCGT)",
        "capacity_mw": 594.7,
        "fuel": "Natural Gas",
        "district": "Anand",
        "operator": "GSECL"
    },
    "Hazira CCPP Extn.": {
        "name": "Hazira CCPP Extension (Essar Power)",
        "category": "gas",
        "type_label": "Combined Cycle Gas Turbine (CCGT)",
        "capacity_mw": 351.0,
        "fuel": "Natural Gas",
        "district": "Surat",
        "operator": "Essar Power"
    },
    "Pipavav CCPP": {
        "name": "Pipavav Combined Cycle Gas Power Plant",
        "category": "gas",
        "type_label": "Combined Cycle Gas Turbine (CCGT)",
        "capacity_mw": 702.0,
        "fuel": "Natural Gas",
        "district": "Amreli",
        "operator": "GSPC Pipavav Power Co (GPPC)"
    },
    "Hazira CCGT": {
        "name": "Hazira Gas Turbine Power Station",
        "category": "gas",
        "type_label": "Gas Turbine Generation",
        "capacity_mw": 515.0,
        "fuel": "Natural Gas",
        "district": "Surat",
        "operator": "Reliance / Private"
    },
    "GIPCL Baroda CCGT": {
        "name": "Vadodara Gas Based Power Station (GIPCL)",
        "category": "gas",
        "type_label": "Combined Cycle Gas Turbine (CCGT)",
        "capacity_mw": 167.0,
        "fuel": "Natural Gas",
        "district": "Vadodara",
        "operator": "Gujarat Industries Power Co (GIPCL)"
    },
    "Paguthan CCGT": {
        "name": "Paguthan Combined Cycle Power Plant (CLP India)",
        "category": "gas",
        "type_label": "Combined Cycle Gas Turbine (CCGT)",
        "capacity_mw": 655.0,
        "fuel": "Natural Gas",
        "district": "Bharuch",
        "operator": "Apraava Energy / CLP India"
    },
    "Sugen CCPP(Akhakhol)": {
        "name": "Sugen Combined Cycle Power Plant (Torrent Power)",
        "category": "gas",
        "type_label": "Combined Cycle Gas Turbine (CCGT)",
        "capacity_mw": 1147.5,
        "fuel": "Natural Gas",
        "district": "Surat",
        "operator": "Torrent Power"
    },
    "Uno sugen Mega CCPP": {
        "name": "UNOSUGEN Combined Cycle Power Plant (Torrent)",
        "category": "gas",
        "type_label": "Combined Cycle Gas Turbine (CCGT)",
        "capacity_mw": 382.5,
        "fuel": "Natural Gas",
        "district": "Surat",
        "operator": "Torrent Power"
    },
    "DGEN Mega CCPP": {
        "name": "DGEN Mega Combined Cycle Power Plant (Torrent Dahej)",
        "category": "gas",
        "type_label": "Combined Cycle Gas Turbine (CCGT)",
        "capacity_mw": 1200.0,
        "fuel": "Natural Gas",
        "district": "Bharuch",
        "operator": "Torrent Power"
    }
}

LANDMARK_POWER_PLANTS = [
    {
        "name": "Kakrapar Atomic Power Station (KAPS Unit 1-4)",
        "type": "nuclear_power_plant",
        "category": "nuclear",
        "type_label": "Nuclear Power (PHWR 700 MWe)",
        "capacity_mw": 1840.0,
        "district": "Tapi",
        "operator": "Nuclear Power Corporation of India (NPCIL)",
        "coords": [73.3500, 21.2383],
        "fuel": "Uranium (Indigenous 700 MWe PHWR)",
        "is_renewable": False
    },
    {
        "name": "Charanka Solar Park",
        "type": "solar_power_plant",
        "category": "solar",
        "type_label": "Utility-Scale Solar PV Park",
        "capacity_mw": 790.0,
        "district": "Patan",
        "operator": "Gujarat Power Corporation Limited (GPCL)",
        "coords": [71.2008, 23.9056],
        "fuel": "Solar Photovoltaic",
        "is_renewable": True
    },
    {
        "name": "Dholera Solar Park (Phase I)",
        "type": "solar_power_plant",
        "category": "solar",
        "type_label": "Utility-Scale Solar PV Park",
        "capacity_mw": 300.0,
        "district": "Ahmedabad",
        "operator": "Tata Power / GPCL",
        "coords": [72.1850, 22.2530],
        "fuel": "Solar Photovoltaic",
        "is_renewable": True
    },
    {
        "name": "Raghanesda Solar Park",
        "type": "solar_power_plant",
        "category": "solar",
        "type_label": "Utility-Scale Solar PV Park",
        "capacity_mw": 700.0,
        "district": "Banaskantha",
        "operator": "GSECL / Tata Power / GPCL",
        "coords": [71.1850, 24.1620],
        "fuel": "Solar Photovoltaic",
        "is_renewable": True
    },
    {
        "name": "Khavda Renewable Energy Park (Phase I)",
        "type": "hybrid_renewable_plant",
        "category": "solar",
        "type_label": "Solar & Wind Hybrid RE Mega-Park",
        "capacity_mw": 2140.0,
        "district": "Kutch",
        "operator": "Adani Green Energy / NTPC REL",
        "coords": [69.7540, 23.8820],
        "fuel": "Solar & Wind Hybrid (World's Largest RE Park)",
        "is_renewable": True
    },
    {
        "name": "Jakhau Wind Energy Farm",
        "type": "wind_power_plant",
        "category": "wind",
        "type_label": "Utility-Scale Wind Farm",
        "capacity_mw": 1000.0,
        "district": "Kutch",
        "operator": "Suzlon / Adani Wind",
        "coords": [68.7050, 23.2380],
        "fuel": "Wind Turbine Generation",
        "is_renewable": True
    },
    {
        "name": "Dwarka Coastal Wind Farm",
        "type": "wind_power_plant",
        "category": "wind",
        "type_label": "Coastal Wind Farm",
        "capacity_mw": 450.0,
        "district": "Devbhumi Dwarka",
        "operator": "ReNew Power / GSECL",
        "coords": [69.0550, 22.2470],
        "fuel": "Wind Turbine Generation",
        "is_renewable": True
    },
    {
        "name": "Jasdan Wind Energy Farm",
        "type": "wind_power_plant",
        "category": "wind",
        "type_label": "Inland Wind Farm",
        "capacity_mw": 350.0,
        "district": "Rajkot",
        "operator": "GSECL / Suzlon",
        "coords": [71.2000, 22.0300],
        "fuel": "Wind Turbine Generation",
        "is_renewable": True
    }
]

def build_power():
    print("[3/7] Building Power & Energy Generation Facilities Layer...")
    url = "https://raw.githubusercontent.com/datta07/INDIAN-SHAPEFILES/master/INDIA/INDIA_ENERGY_PLANTS.geojson"
    r = requests.get(url, timeout=30)
    
    guj_features = []
    seen_names = set()
    
    if r.status_code == 200:
        data = r.json()
        for f in data.get("features", []):
            props = f.get("properties", {})
            state = str(props.get("STATE") or props.get("State") or props.get("state") or "")
            if "gujarat" in state.lower() or filter_feature_by_geom(f):
                raw_name = str(props.get("plant_name") or props.get("NAME") or "").strip()
                raw_type = str(props.get("type") or "power_plant").lower()
                coords = f.get("geometry", {}).get("coordinates", [])
                
                # Check clean dictionary mapping
                clean_info = POWER_PLANT_CLEAN_MAP.get(raw_name)
                if clean_info:
                    name = clean_info["name"]
                    cat = clean_info["category"]
                    type_label = clean_info["type_label"]
                    cap = clean_info["capacity_mw"]
                    dist = clean_info["district"]
                    op = clean_info["operator"]
                    fuel = clean_info["fuel"]
                    is_ren = cat in ["hydro", "solar", "wind"]
                elif "small_hydro" in raw_type:
                    # Clean small canal hydro plants
                    dist_cand = str(props.get("district") or props.get("DISTRICT") or "Gujarat").title()
                    cap = round(float(props.get("inst_cap") or props.get("capacity") or 5.0), 1)
                    name = f"Canal Small Hydro Station ({dist_cand})"
                    cat = "hydro"
                    type_label = "Small Canal Hydro Power (SHP)"
                    dist = dist_cand
                    op = "GSECL / SSNNL"
                    fuel = "Canal Head Hydroelectric"
                    is_ren = True
                else:
                    name = raw_name or "Power Generation Facility"
                    cat = "thermal" if "coal" in raw_type or "lignite" in raw_type else ("gas" if "gas" in raw_type else "thermal")
                    type_label = raw_type.replace("_", " ").title()
                    try:
                        cap = round(float(props.get("inst_cap") or props.get("capacity") or 100), 1)
                    except:
                        cap = 100.0
                    dist = str(props.get("district") or props.get("DISTRICT") or "Gujarat").title()
                    op = str(props.get("owner") or props.get("OPERATOR") or "GSECL / Private")
                    fuel = "Coal / Gas / Hydro"
                    is_ren = False
                
                if name in seen_names:
                    continue
                seen_names.add(name)
                
                f["properties"] = {
                    "name": name,
                    "category": cat,
                    "type_label": type_label,
                    "capacity_mw": cap,
                    "district": dist,
                    "operator": op,
                    "fuel": fuel,
                    "is_renewable": is_ren,
                    "state": "Gujarat"
                }
                guj_features.append(f)
                
    # Add landmark modern power plants (Nuclear, Solar Parks, Wind Farms)
    for p in LANDMARK_POWER_PLANTS:
        if p["name"] in seen_names:
            continue
        seen_names.add(p["name"])
        feature = {
            "type": "Feature",
            "properties": {
                "name": p["name"],
                "category": p["category"],
                "type_label": p["type_label"],
                "capacity_mw": p["capacity_mw"],
                "district": p["district"],
                "operator": p["operator"],
                "fuel": p["fuel"],
                "is_renewable": p["is_renewable"],
                "state": "Gujarat"
            },
            "geometry": {
                "type": "Point",
                "coordinates": p["coords"]
            }
        }
        guj_features.append(feature)
        
    out_geojson = {"type": "FeatureCollection", "name": "gujarat_power", "features": guj_features}
    save_minified_geojson("gujarat_power.geojson", out_geojson)

def build_transmission():
    print("[4/7] Building GETCO & POWERGRID High-Voltage Transmission Grid (400kV / 765kV)...")
    
    # Strategic High-Voltage Substations and Pooling Nodes
    substations = [
        {"name": "Lakadia 765/400 kV Pooling Substation", "voltage_kv": 765, "district": "Kutch", "coords": [70.380, 23.310], "operator": "POWERGRID / GETCO"},
        {"name": "Pirana 400 kV Bulk Grid Substation", "voltage_kv": 400, "district": "Ahmedabad", "coords": [72.580, 22.980], "operator": "GETCO"},
        {"name": "Dehgam 765/400 kV Bulk Substation", "voltage_kv": 765, "district": "Gandhinagar", "coords": [72.810, 23.170], "operator": "POWERGRID / GETCO"},
        {"name": "Asoj 400 kV Grid Substation", "voltage_kv": 400, "district": "Vadodara", "coords": [73.260, 22.380], "operator": "GETCO"},
        {"name": "Navsari 400 kV Grid Substation", "voltage_kv": 400, "district": "Navsari", "coords": [72.930, 20.950], "operator": "GETCO"},
        {"name": "Hadala 400 kV Grid Substation", "voltage_kv": 400, "district": "Rajkot", "coords": [70.800, 22.300], "operator": "GETCO"},
        {"name": "Jetpur 400 kV Grid Substation", "voltage_kv": 400, "district": "Rajkot", "coords": [70.750, 21.760], "operator": "GETCO"},
        {"name": "Kasor 400 kV Grid Substation", "voltage_kv": 400, "district": "Anand", "coords": [73.300, 22.150], "operator": "GETCO"},
        {"name": "Khavda 765 kV Pooling Station", "voltage_kv": 765, "district": "Kutch", "coords": [69.754, 23.882], "operator": "POWERGRID ISTS"},
        {"name": "Charanka 400 kV Solar Pooling Station", "voltage_kv": 400, "district": "Patan", "coords": [71.201, 23.906], "operator": "GETCO"}
    ]
    
    # Strategic 765 kV and 400 kV Transmission Lines
    corridors = [
        {
            "name": "765 kV Mundra - Lakadia - Pirana (Ahmedabad) UHV Corridor",
            "voltage_kv": 765,
            "corridor_code": "765-MUNDRA-PIRANA",
            "operator": "POWERGRID / GETCO",
            "circuits": "Double Circuit (D/C)",
            "substations": "Mundra Generation Complex -> Lakadia 765kV -> Viramgam -> Pirana 400kV",
            "coords": [[69.527, 22.823], [69.950, 23.100], [70.380, 23.310], [71.180, 23.010], [72.030, 23.120], [72.580, 22.980]]
        },
        {
            "name": "765 kV Khavda RE - Lakadia - Vadodara ISTS Green Energy Corridor",
            "voltage_kv": 765,
            "corridor_code": "765-KHAVDA-VADODARA",
            "operator": "POWERGRID ISTS",
            "circuits": "Double Circuit (D/C)",
            "substations": "Khavda RE Mega-Park -> Lakadia Pooling -> Radhanpur -> Dehgam 765kV -> Vadodara",
            "coords": [[69.754, 23.882], [69.670, 23.250], [70.380, 23.310], [71.600, 23.830], [72.810, 23.170], [73.250, 22.310]]
        },
        {
            "name": "400 kV Charanka Solar - Santalpur - Mehsana - Gandhinagar Corridor",
            "voltage_kv": 400,
            "corridor_code": "400-CHARANKA-GANDHINAGAR",
            "operator": "GETCO",
            "circuits": "Double Circuit (D/C)",
            "substations": "Charanka Solar Pooling -> Santalpur -> Radhanpur -> Patan -> Mehsana -> Gandhinagar TPS",
            "coords": [[71.201, 23.906], [71.100, 23.750], [71.600, 23.830], [72.120, 23.850], [72.400, 23.600], [72.674, 23.251]]
        },
        {
            "name": "400 kV Sardar Sarovar - Kasor - Asoj - Dehgam Hydro Transmission Grid",
            "voltage_kv": 400,
            "corridor_code": "400-SSNNL-DEHGAM",
            "operator": "SSNNL / GETCO",
            "circuits": "Double Circuit (D/C)",
            "substations": "Sardar Sarovar RBPH/CHPH -> Rajpipla -> Kasor 400kV -> Asoj 400kV -> Dehgam 765kV",
            "coords": [[73.748, 21.834], [73.570, 21.870], [73.300, 22.150], [73.260, 22.380], [72.950, 22.560], [72.810, 23.170]]
        },
        {
            "name": "400 kV Wanakbori - Nadiad - Pirana - Gandhinagar Backbone",
            "voltage_kv": 400,
            "corridor_code": "400-WANAKBORI-AHMEDABAD",
            "operator": "GETCO",
            "circuits": "Double Circuit (D/C)",
            "substations": "Wanakbori TPS -> Thasra -> Nadiad -> Pirana 400kV -> Gandhinagar TPS",
            "coords": [[73.359, 22.873], [73.150, 22.750], [72.860, 22.690], [72.580, 22.980], [72.674, 23.251]]
        },
        {
            "name": "400 kV Kakrapar Nuclear - Navsari - Valsad - Vapi South Corridor",
            "voltage_kv": 400,
            "corridor_code": "400-KAKRAPAR-VAPI",
            "operator": "NPCIL / GETCO",
            "circuits": "Double Circuit (D/C)",
            "substations": "Kakrapar Nuclear (KAPS) -> Vyara -> Navsari 400kV -> Valsad -> Vapi 400kV",
            "coords": [[73.350, 21.238], [73.390, 21.110], [72.930, 20.950], [72.930, 20.610], [72.910, 20.370]]
        },
        {
            "name": "400 kV Sugen / Kawas / Hazira Petrochemical & Gas Grid",
            "voltage_kv": 400,
            "corridor_code": "400-SUGEN-HAZIRA",
            "operator": "Torrent Power / GETCO",
            "circuits": "Double Circuit (D/C)",
            "substations": "Hazira CCPP -> Kawas CCGT -> Surat Grid -> Sugen CCPP -> Kosamba -> Bharuch",
            "coords": [[72.639, 21.120], [72.688, 21.175], [72.830, 21.170], [72.988, 21.339], [72.950, 21.480], [73.000, 21.710]]
        },
        {
            "name": "400 kV Dahej PCPIR - Paguthan - Bharuch - Vadodara Industrial Corridor",
            "voltage_kv": 400,
            "corridor_code": "400-DAHEJ-VADODARA",
            "operator": "GETCO",
            "circuits": "Double Circuit (D/C)",
            "substations": "Dahej PCPIR / DGEN Mega -> Paguthan CCGT -> Bharuch 400kV -> Karjan -> Asoj 400kV",
            "coords": [[72.613, 21.706], [72.985, 21.778], [73.000, 21.710], [73.120, 22.050], [73.260, 22.380]]
        },
        {
            "name": "400 kV Sikka - Motikhavdi - Jamnagar - Hadala - Jetpur Saurashtra Grid",
            "voltage_kv": 400,
            "corridor_code": "400-SIKKA-JETPUR",
            "operator": "GETCO",
            "circuits": "Double Circuit (D/C)",
            "substations": "Sikka TPS -> Motikhavdi Refinery -> Jamnagar -> Dhrol -> Hadala 400kV -> Jetpur 400kV",
            "coords": [[69.828, 22.421], [69.870, 22.380], [70.060, 22.470], [70.410, 22.560], [70.800, 22.300], [70.750, 21.760]]
        },
        {
            "name": "400 kV Jetpur - Amreli - Pipavav Coastal Energy Corridor",
            "voltage_kv": 400,
            "corridor_code": "400-JETPUR-PIPAVAV",
            "operator": "GETCO",
            "circuits": "Double Circuit (D/C)",
            "substations": "Jetpur 400kV -> Dhoraji -> Amreli 400kV -> Kundla -> Pipavav Port / CCPP",
            "coords": [[70.750, 21.760], [70.450, 21.730], [71.220, 21.600], [71.300, 21.350], [71.469, 20.899]]
        },
        {
            "name": "400 kV Dhuvaran - Borsad - Kasor - Vadodara Clean Energy Link",
            "voltage_kv": 400,
            "corridor_code": "400-DHUVARAN-VADODARA",
            "operator": "GETCO",
            "circuits": "Double Circuit (D/C)",
            "substations": "Dhuvaran CCPP -> Borsad -> Kasor 400kV -> Vadodara Asoj",
            "coords": [[72.752, 22.240], [72.900, 22.410], [73.300, 22.150], [73.260, 22.380]]
        },
        {
            "name": "400 kV Ukai - Songadh - Navapur - Dhule Bulk Inter-State Line",
            "voltage_kv": 400,
            "corridor_code": "400-UKAI-DHULE",
            "operator": "GETCO / WRLDC",
            "circuits": "Double Circuit (D/C)",
            "substations": "Ukai Generation Complex -> Songadh -> Navapur -> Dhule (Inter-State WRLDC)",
            "coords": [[73.557, 21.209], [73.550, 21.170], [73.790, 21.160], [74.240, 21.050]]
        }
    ]
    
    features = []
    
    # 1. Add Transmission Line Corridors
    for c in corridors:
        geom = {"type": "LineString", "coordinates": c["coords"]}
        length_km = round(calculate_geom_length_km(geom), 1)
        v_label = "765 kV Ultra-High Voltage (UHV)" if c["voltage_kv"] == 765 else "400 kV Extra-High Voltage (EHV)"
        features.append({
            "type": "Feature",
            "properties": {
                "name": c["name"],
                "feature_type": "transmission_line",
                "corridor_code": c["corridor_code"],
                "voltage_kv": c["voltage_kv"],
                "voltage_label": v_label,
                "operator": c["operator"],
                "circuits": c["circuits"],
                "substations": c["substations"],
                "length_km": length_km,
                "state": "Gujarat"
            },
            "geometry": geom
        })
        
    # 2. Add Substation Nodes
    for s in substations:
        v_label = f"{s['voltage_kv']} kV Strategic Pooling Substation"
        features.append({
            "type": "Feature",
            "properties": {
                "name": s["name"],
                "feature_type": "substation",
                "voltage_kv": s["voltage_kv"],
                "voltage_label": v_label,
                "operator": s["operator"],
                "district": s["district"],
                "state": "Gujarat"
            },
            "geometry": {
                "type": "Point",
                "coordinates": s["coords"]
            }
        })
        
    out_geojson = {
        "type": "FeatureCollection",
        "name": "gujarat_transmission",
        "features": features
    }
    save_minified_geojson("gujarat_transmission.geojson", out_geojson)

def haversine_km(lon1, lat1, lon2, lat2):
    R = 6371.0
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2)**2
    return 2 * R * math.atan2(math.sqrt(a), math.sqrt(1 - a))

def calculate_linestring_length_km(coords):
    if not coords or len(coords) < 2:
        return 0.0
    total = 0.0
    for i in range(len(coords) - 1):
        total += haversine_km(coords[i][0], coords[i][1], coords[i+1][0], coords[i+1][1])
    return total

def calculate_geom_length_km(geom):
    if not geom:
        return 0.0
    gtype = geom.get("type")
    coords = geom.get("coordinates", [])
    if gtype == "LineString":
        return calculate_linestring_length_km(coords)
    elif gtype == "MultiLineString":
        return sum(calculate_linestring_length_km(c) for c in coords)
    return 0.0

def build_railways():
    print("[4/6] Building Railways Layer...")
    url = "https://raw.githubusercontent.com/datta07/INDIAN-SHAPEFILES/master/INDIA/INDIAN_RAILWAYS.geojson"
    r = requests.get(url, timeout=60)
    if r.status_code == 200:
        data = r.json()
        guj_features = []
        for f in data.get("features", []):
            if filter_feature_by_geom(f):
                props = f.get("properties", {})
                ftr = str(props.get("FTR_CRY") or props.get("gauge") or "BG").strip().upper()
                
                if ftr == "BG":
                    gauge = "Broad Gauge (1676 mm)"
                    gauge_code = "BG"
                    electrified = "Yes (25 kV AC)"
                    track_name = "Western Railway Broad Gauge Line"
                elif ftr == "MG":
                    gauge = "Meter Gauge (1000 mm)"
                    gauge_code = "MG"
                    electrified = "No (Diesel Traction)"
                    track_name = "Western Railway Meter Gauge Line"
                elif ftr == "NG":
                    gauge = "Narrow Gauge (762 mm)"
                    gauge_code = "NG"
                    electrified = "No (Heritage Diesel/Steam)"
                    track_name = "Western Railway Heritage Narrow Gauge Line"
                else:
                    gauge = "Broad Gauge (1676 mm)"
                    gauge_code = "BG"
                    electrified = "Yes (25 kV AC)"
                    track_name = "Western Railway Mainline Track"
                    
                length_km = round(calculate_geom_length_km(f.get("geometry")), 2)
                f["properties"] = {
                    "name": track_name,
                    "gauge": gauge,
                    "gauge_code": gauge_code,
                    "electrified": electrified,
                    "zone": "Western Railway (WR)",
                    "length_km": length_km
                }
                guj_features.append(f)
        out_geojson = {"type": "FeatureCollection", "name": "gujarat_railways", "features": guj_features}
        save_minified_geojson("gujarat_railways.geojson", out_geojson)
    else:
        print(f"  [-] Failed to fetch railways: HTTP {r.status_code}")

HIGHWAY_PROFILES = {
    "NE 1": {
        "title": "National Expressway 1 (NE-1) — Mahatma Gandhi Expressway",
        "route": "Ahmedabad (SP Ring Road) - Nadiad - Anand - Vadodara (93.1 km Access-Controlled 4-Lane Expressway)",
        "category": "expressway",
        "class_label": "National Expressway (120 km/h Access-Controlled)",
        "speed_limit_kmh": 120
    },
    "Delhi - Vadodara Expressway": {
        "title": "Delhi - Mumbai Expressway (NE-4 / NH-148N Greenfield Corridor)",
        "route": "Vadodara - Godhra - Dahod - Ratlam - Kota - New Delhi (8-Lane Access-Controlled Greenfield Expressway)",
        "category": "expressway",
        "class_label": "National Expressway (120 km/h Access-Controlled)",
        "speed_limit_kmh": 120
    },
    "NH 148N": {
        "title": "Delhi - Mumbai Expressway (Vadodara Spur)",
        "route": "Greenfield 8-Lane Expressway linking Vadodara to Kota, Jaipur & Delhi NCR",
        "category": "expressway",
        "class_label": "National Expressway (120 km/h Access-Controlled)",
        "speed_limit_kmh": 120
    },
    "NH 48": {
        "title": "Delhi - Mumbai Golden Quadrilateral (NH 48)",
        "route": "Major Arterial Lifeline: Ratanpur - Himatnagar - Ahmedabad - Vadodara - Surat - Navsari - Valsad - Vapi - Mumbai",
        "category": "golden_quadrilateral",
        "class_label": "Golden Quadrilateral (100 km/h Arterial 6/8-Lane)",
        "speed_limit_kmh": 100
    },
    "NH 27": {
        "title": "East - West Economic Corridor (NH 27)",
        "route": "Porbandar - Upleta - Dhoraji - Gondal - Rajkot - Bamanbore - Samakhiali - Radhanpur - Deesa - Palanpur - Rajasthan",
        "category": "arterial_corridor",
        "class_label": "East-West Economic Corridor (100 km/h)",
        "speed_limit_kmh": 100
    },
    "NH 47": {
        "title": "Bamanbore - Ahmedabad - Godhra - Indore Highway (NH 47)",
        "route": "Bamanbore - Limbdi - Bagodara - Ahmedabad - Kathwada - Godhra - Dahod - Madhya Pradesh",
        "category": "arterial_corridor",
        "class_label": "Major Arterial Highway (100 km/h)",
        "speed_limit_kmh": 100
    },
    "NH 53": {
        "title": "Hazira Port - Surat - Dhule - Kolkata Arterial (NH 53)",
        "route": "Hazira Deepwater Port - Surat - Bardoli - Vyara - Songadh - Maharashtra Border",
        "category": "arterial_corridor",
        "class_label": "Port-Connectivity Arterial Highway (100 km/h)",
        "speed_limit_kmh": 100
    },
    "NH 754K": {
        "title": "Amritsar - Jamnagar Economic Corridor (NH 754K)",
        "route": "Greenfield Economic Corridor linking Punjab/Rajasthan refineries directly to Jamnagar Petroleum Complex",
        "category": "arterial_corridor",
        "class_label": "Economic Industrial Corridor (100 km/h)",
        "speed_limit_kmh": 100
    },
    "NH 51": {
        "title": "Coastal Saurashtra Corridor",
        "route": "Dwarka - Porbandar - Mangrol - Veraval (Somnath) - Kodinar - Una - Jafrabad - Mahuva - Bhavnagar",
        "category": "national_highway",
        "class_label": "Primary Coastal Highway",
        "speed_limit_kmh": 80
    },
    "NH 41": {
        "title": "Kandla Port - Mandvi Corridor",
        "route": "Samakhiali - Bhachau - Gandhidham - Kandla Port - Mundra Port - Mandvi",
        "category": "national_highway",
        "class_label": "Port Link National Highway",
        "speed_limit_kmh": 80
    },
    "NH 56": {
        "title": "Eastern Tribal Corridor",
        "route": "Dahod - Chhota Udepur - Rajpipla - Netrang - Mandvi - Vyara - Dharampur - Vapi",
        "category": "national_highway",
        "class_label": "Primary National Highway",
        "speed_limit_kmh": 80
    },
    "NH 58": {
        "title": "Palanpur - Ambaji - Udaipur Highway",
        "route": "Palanpur - Danta - Ambaji Pilgrim Link - Rajasthan Border",
        "category": "national_highway",
        "class_label": "Primary National Highway",
        "speed_limit_kmh": 80
    },
    "NH 64": {
        "title": "Ahmedabad - Dholera SIR - Bhavnagar Corridor",
        "route": "Ahmedabad - Dholera Special Investment Region (SIR) - Bhavnagar Port Expressway Link",
        "category": "arterial_corridor",
        "class_label": "Dholera SIR Economic Corridor (100 km/h)",
        "speed_limit_kmh": 100
    },
    "NH 68": {
        "title": "Barmer - Radhanpur Desert Highway",
        "route": "Sanchore - Tharad - Radhanpur North Gujarat Border Link",
        "category": "national_highway",
        "class_label": "Primary National Highway",
        "speed_limit_kmh": 80
    }
}

def classify_highway_feature(raw_name):
    raw_u = str(raw_name or '').upper().strip()
    if 'NE 1' in raw_u or 'NE-1' in raw_u or ('AHMEDABAD' in raw_u and 'EXPRESSWAY' in raw_u):
        key = 'NE 1'
    elif ('DELHI' in raw_u and 'VADODARA' in raw_u) or 'NE-4' in raw_u or 'NE 4' in raw_u:
        key = 'Delhi - Vadodara Expressway'
    elif '148N' in raw_u:
        key = 'NH 148N'
    elif 'NH 48' in raw_u:
        key = 'NH 48'
    elif 'NH 27' in raw_u:
        key = 'NH 27'
    elif 'NH 47' in raw_u:
        key = 'NH 47'
    elif 'NH 53' in raw_u:
        key = 'NH 53'
    elif '754K' in raw_u:
        key = 'NH 754K'
    elif 'NH 51' in raw_u:
        key = 'NH 51'
    elif 'NH 41' in raw_u:
        key = 'NH 41'
    elif 'NH 56' in raw_u:
        key = 'NH 56'
    elif 'NH 64' in raw_u:
        key = 'NH 64'
    elif 'NH 58' in raw_u:
        key = 'NH 58'
    elif 'NH 68' in raw_u:
        key = 'NH 68'
    else:
        clean_name = raw_name.strip() if raw_name else 'National Highway'
        if not clean_name.startswith('NH ') and any(c.isdigit() for c in clean_name):
            clean_name = f"NH {clean_name}"
        digits = ''.join(c for c in clean_name if c.isdigit())
        if len(digits) >= 3:
            return clean_name, {
                "title": f"{clean_name} Feeder Corridor",
                "route": f"Secondary Inter-District Highway Link ({clean_name})",
                "category": "feeder_highway",
                "class_label": "Feeder National Highway",
                "speed_limit_kmh": 70
            }
        return clean_name, {
            "title": f"{clean_name} Corridor",
            "route": f"Statewide Inter-City Transport Corridor ({clean_name})",
            "category": "national_highway",
            "class_label": "Primary National Highway",
            "speed_limit_kmh": 80
        }
    return key, HIGHWAY_PROFILES[key]

def build_roads():
    print("[5/6] Building Roads & Highways Layer...")
    url = "https://raw.githubusercontent.com/datta07/INDIAN-SHAPEFILES/master/INDIA/INDIA_NATIONAL_HIGHWAY.geojson"
    r = requests.get(url, timeout=90)
    if r.status_code == 200:
        data = r.json()
        raw_guj_features = []
        corridor_lengths = collections.defaultdict(float)
        corridor_segment_counts = collections.defaultdict(int)
        
        for f in data.get("features", []):
            if filter_feature_by_geom(f):
                props = f.get("properties", {})
                raw_name = props.get("Name") or props.get("name") or props.get("NH_No") or "National Highway"
                corridor_name, meta = classify_highway_feature(raw_name)
                length_km = round(calculate_geom_length_km(f.get("geometry")), 2)
                
                corridor_lengths[corridor_name] += length_km
                corridor_segment_counts[corridor_name] += 1
                
                raw_guj_features.append((f, corridor_name, meta, length_km))
        
        guj_features = []
        for f, corridor_name, meta, length_km in raw_guj_features:
            f["properties"] = {
                "name": corridor_name,
                "corridor": corridor_name,
                "title": meta["title"],
                "route": meta["route"],
                "category": meta["category"],
                "class_label": meta["class_label"],
                "operator": "NHAI / MoRTH",
                "speed_limit_kmh": meta["speed_limit_kmh"],
                "length_km": length_km,
                "corridor_total_km": round(corridor_lengths[corridor_name], 1),
                "corridor_segments": corridor_segment_counts[corridor_name]
            }
            guj_features.append(f)
            
        out_geojson = {"type": "FeatureCollection", "name": "gujarat_roads", "features": guj_features}
        save_minified_geojson("gujarat_roads.geojson", out_geojson)
    else:
        print(f"  [-] Failed to fetch highways: HTTP {r.status_code}")

MAJOR_JUNCTION_CODES = {
    'ADI', 'BRC', 'ST', 'RJT', 'BVC', 'GIMB', 'ANND', 'BH', 'VG',
    'PNU', 'MSH', 'SUNR', 'JND', 'VRL', 'DWK', 'OKHA', 'JAM',
    'SIOB', 'BHUJ', 'BL', 'VAPI', 'NVS', 'GDA', 'DHD', 'AKV', 'UDN', 'BTD', 'WKR'
}

def clean_station_name(raw_name):
    clean = str(raw_name or 'Station').strip().title()
    clean = clean.replace(' Jn', ' Junction').replace(' Rd', ' Road').replace(' Bg', ' (BG)')
    return clean

def assign_station_division(lon, lat):
    if lon < 72.0:
        if lat > 23.0:
            return "Ahmedabad Division", "ADI"
        elif lat > 21.8:
            return "Rajkot Division", "RJT"
        else:
            return "Bhavnagar Division", "BVC"
    else:
        if lat >= 22.8:
            return "Ahmedabad Division", "ADI"
        else:
            return "Vadodara Division", "BRC"

def build_railway_stations():
    print("[6/6] Building Railway Stations Layer...")
    url = "https://raw.githubusercontent.com/datameet/railways/master/stations.json"
    r = requests.get(url, timeout=30)
    if r.status_code == 200:
        data = r.json()
        guj_stations = []
        for f in data.get("features", []):
            geom = f.get("geometry")
            if geom and geom.get("type") == "Point":
                coords = geom.get("coordinates", [])
                if coords and len(coords) == 2:
                    lon, lat = coords[0], coords[1]
                    if is_point_in_gujarat(lon, lat):
                        props = f.get("properties", {})
                        raw_name = str(props.get("name") or "Railway Station")
                        code = str(props.get("code") or "N/A").upper().strip()
                        clean_name = clean_station_name(raw_name)
                        division, div_code = assign_station_division(lon, lat)
                        
                        if code in MAJOR_JUNCTION_CODES or any(t in raw_name.upper() for t in ['AHMEDABAD JN', 'VADODARA JN', 'SURAT', 'RAJKOT JN', 'BHAVNAGAR TERMINUS']):
                            category = "major_junction"
                            cat_label = "Major Junction / Terminal"
                            is_major = True
                        elif 'JN' in raw_name.upper() or 'JUNCTION' in raw_name.upper():
                            category = "junction"
                            cat_label = "Railway Junction"
                            is_major = False
                        else:
                            category = "regular_station"
                            cat_label = "Passenger Station / Halt"
                            is_major = False
                            
                        f["properties"] = {
                            "name": clean_name,
                            "raw_name": raw_name,
                            "code": code,
                            "category": category,
                            "class_label": cat_label,
                            "is_major": is_major,
                            "division": f"Western Railway - {division}",
                            "division_code": div_code,
                            "zone": "Western Railway (WR)",
                            "state": "Gujarat"
                        }
                        guj_stations.append(f)
        out_geojson = {"type": "FeatureCollection", "name": "gujarat_stations", "features": guj_stations}
        save_minified_geojson("gujarat_stations.geojson", out_geojson)
    else:
        print(f"  [-] Failed to fetch stations: HTTP {r.status_code}")

def verify_all():
    print("\n--- Verifying Data Directory ---")
    files = [
        "gujarat_districts.geojson",
        "gujarat_district_hq.geojson",
        "gujarat_power.geojson",
        "gujarat_transmission.geojson",
        "gujarat_railways.geojson",
        "gujarat_stations.geojson",
        "gujarat_roads.geojson"
    ]
    all_ok = True
    for f in files:
        p = os.path.join(DATA_DIR, f)
        if not os.path.exists(p):
            print(f"  [-] Missing: {f}")
            all_ok = False
            continue
        try:
            with open(p, "r", encoding="utf-8") as jf:
                data = json.load(jf)
            count = len(data.get("features", []))
            size = os.path.getsize(p) / 1024
            print(f"  [OK] {f:<30} | {count:>5} features | {size:>7.1f} KB")
        except Exception as e:
            print(f"  [FAIL] Invalid JSON in {f}: {e}")
            all_ok = False
    return all_ok

def generate_qgis_project():
    print("[QGIS] Generating desktop QGIS project (gujarat_inframap.qgs)...")
    import html
    import xml.etree.ElementTree as ET
    
    project_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "gujarat_inframap.qgs")
    layers = [
        {"id": "district_hq", "name": "District Headquarters Nodes", "file": "./data/gujarat_district_hq.geojson", "geom": "Point"},
        {"id": "substations", "name": "High-Voltage Substations & Grid Nodes", "file": "./data/gujarat_transmission.geojson", "geom": "Point"},
        {"id": "transmission_lines", "name": "GETCO & PowerGrid Transmission Corridors (400kV/765kV)", "file": "./data/gujarat_transmission.geojson", "geom": "LineString"},
        {"id": "power_plants", "name": "Power and Energy Generation Facilities", "file": "./data/gujarat_power.geojson", "geom": "Point"},
        {"id": "railway_stations", "name": "Railway Stations (Western Railway)", "file": "./data/gujarat_stations.geojson", "geom": "Point"},
        {"id": "railways", "name": "Railway Corridors", "file": "./data/gujarat_railways.geojson", "geom": "LineString"},
        {"id": "roads", "name": "National Highways and Expressways", "file": "./data/gujarat_roads.geojson", "geom": "LineString"},
        {"id": "districts", "name": "District Boundaries (Gujarat)", "file": "./data/gujarat_districts.geojson", "geom": "Polygon"}
    ]
    
    xml_tree_layers = "\n".join([
        f'    <layer-tree-layer name="{html.escape(l["name"])}" id="{l["id"]}" checked="Qt::Checked" expanded="1" source="{l["file"]}" providerKey="ogr"/>'
        for l in layers
    ])
    
    xml_map_layers = "\n".join([
        f'''    <maplayer type="vector" id="{l["id"]}" name="{html.escape(l["name"])}" readOnly="0">
      <id>{l["id"]}</id>
      <datasource>{l["file"]}</datasource>
      <keywordList><value></value></keywordList>
      <layername>{html.escape(l["name"])}</layername>
      <srs>
        <spatialrefsys>
          <authid>EPSG:4326</authid>
          <description>WGS 84</description>
          <srid>4326</srid>
        </spatialrefsys>
      </srs>
      <provider encoding="UTF-8">ogr</provider>
    </maplayer>'''
        for l in layers
    ])
    
    qgs_content = f'''<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE qgis PUBLIC 'http://mrcc.com/qgis.dtd' 'SYSTEM'>
<qgis projectname="Gujarat InfraMap" version="3.34.0">
  <title>Gujarat InfraMap — Infrastructure GIS</title>
  <homePath path=""/>
  <layer-tree-group>
    <customproperties/>
{xml_tree_layers}
  </layer-tree-group>
  <mapcanvas>
    <units>degrees</units>
    <extent>
      <xmin>68.10</xmin>
      <ymin>20.10</ymin>
      <xmax>74.50</xmax>
      <ymax>24.75</ymax>
    </extent>
    <destinationsrs>
      <spatialrefsys>
        <authid>EPSG:4326</authid>
        <description>WGS 84</description>
        <srid>4326</srid>
      </spatialrefsys>
    </destinationsrs>
  </mapcanvas>
  <projectlayers>
{xml_map_layers}
  </projectlayers>
</qgis>
'''
    # Verify XML well-formedness before saving
    ET.fromstring(qgs_content)
    
    with open(project_path, "w", encoding="utf-8") as f:
        f.write(qgs_content)
    print("  [OK] gujarat_inframap.qgs generated and verified with XML parser.")

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--verify":
        success = verify_all()
        sys.exit(0 if success else 1)
        
    start_time = time.time()
    print("=== Gujarat InfraMap Data Pipeline ===")
    build_districts()
    build_district_hq()
    build_power()
    build_transmission()
    build_railways()
    build_roads()
    build_railway_stations()
    generate_qgis_project()
    verify_all()
    print(f"\nPipeline finished in {time.time()-start_time:.2f} seconds.")
