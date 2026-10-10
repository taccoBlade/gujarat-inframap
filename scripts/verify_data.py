import json
import glob
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def check_districts():
    with open('data/gujarat_districts.geojson', 'r', encoding='utf-8') as f:
        data = json.load(f)
    print(f"=== Districts ({len(data['features'])}) ===")
    ahmedabad = [f['properties'] for f in data['features'] if f['properties'].get('district') == 'Ahmedabad']
    if ahmedabad:
        p = ahmedabad[0]
        print(f"Ahmedabad District: area_sqkm={p.get('area_sqkm')}, city_area_sqkm={p.get('city_area_sqkm')}, body={p.get('urban_body')}, portal={p.get('official_portal')}")
        print(f"Location: {p.get('location_desc')}")

def check_hqs():
    with open('data/gujarat_district_hq.geojson', 'r', encoding='utf-8') as f:
        data = json.load(f)
    print(f"\n=== District HQs ({len(data['features'])}) ===")
    ahmedabad = [f['properties'] for f in data['features'] if f['properties'].get('district') == 'Ahmedabad']
    if ahmedabad:
        p = ahmedabad[0]
        print(f"Ahmedabad HQ: area_sqkm={p.get('area_sqkm')}, city_area_sqkm={p.get('city_area_sqkm')}, body={p.get('urban_body')}, portal={p.get('official_portal')}")

def check_highways():
    with open('data/gujarat_roads.geojson', 'r', encoding='utf-8') as f:
        data = json.load(f)
    print(f"\n=== Highways ({len(data['features'])}) ===")
    for f in data['features']:
        p = f['properties']
        print(f"  {p.get('corridor', 'N/A')}: {p.get('total_length_km')} km, speed={p.get('speed_limit_kmh')} km/h, title={p.get('title')}")

def check_power():
    with open('data/gujarat_power.geojson', 'r', encoding='utf-8') as f:
        data = json.load(f)
    print(f"\n=== Power Plants ({len(data['features'])}) ===")
    total_mw = sum(float(f['properties'].get('capacity_mw', 0)) for f in data['features'])
    print(f"Total capacity: {total_mw:,.1f} MW across {len(data['features'])} facilities")
    for f in data['features'][:3]:
        p = f['properties']
        print(f"- {p.get('name')}: {p.get('capacity_mw')} MW, fuel={p.get('fuel')}, district={p.get('district')}")

def check_stations():
    with open('data/gujarat_stations.geojson', 'r', encoding='utf-8') as f:
        data = json.load(f)
    print(f"\n=== Railway Stations ({len(data['features'])}) ===")
    adi = [f['properties'] for f in data['features'] if f['properties'].get('code') == 'ADI']
    if adi:
        p = adi[0]
        print(f"ADI: name={p.get('name')}, division={p.get('division')}, zone={p.get('zone')}, is_major={p.get('is_major')}")

def check_transmission():
    with open('data/gujarat_transmission.geojson', 'r', encoding='utf-8') as f:
        data = json.load(f)
    print(f"\n=== Transmission ({len(data['features'])}) ===")
    for f in data['features'][:3]:
        p = f['properties']
        print(f"- {p.get('name')}: type={p.get('feature_type')}, v={p.get('voltage_kv')} kV, op={p.get('operator')}")

if __name__ == '__main__':
    check_districts()
    check_hqs()
    check_highways()
    check_power()
    check_stations()
    check_transmission()
