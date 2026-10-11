import json
import os
import shutil

def optimize_geojson_collection(file_path, raw_backup_dir="data/raw"):
    os.makedirs(raw_backup_dir, exist_ok=True)
    base_name = os.path.basename(file_path)
    backup_path = os.path.join(raw_backup_dir, base_name)
    
    if not os.path.exists(backup_path):
        shutil.copy2(file_path, backup_path)
        print(f"Backed up {base_name} -> {backup_path}")

    orig_size = os.path.getsize(file_path)
    with open(file_path, 'rb') as fp:
        orig_lines = sum(1 for _ in fp)

    with open(backup_path, 'r', encoding='utf-8') as fp:
        data = json.load(fp)

    features = data.get("features", [])
    crs = data.get("crs")
    name = data.get("name")

    lines = ['{']
    lines.append('  "type": "FeatureCollection",')
    if name:
        lines.append(f'  "name": {json.dumps(name)},')
    if crs:
        lines.append(f'  "crs": {json.dumps(crs, separators=(",", ":"))},')
    lines.append('  "features": [')

    for i, feat in enumerate(features):
        comma = "," if i < len(features) - 1 else ""
        lines.append("    " + json.dumps(feat, separators=(",", ":")) + comma)

    lines.append('  ]')
    lines.append('}')

    formatted = "\n".join(lines)
    with open(file_path, 'w', encoding='utf-8') as fp:
        fp.write(formatted)

    new_size = os.path.getsize(file_path)
    with open(file_path, 'rb') as fp:
        new_lines = sum(1 for _ in fp)

    # Validate
    with open(file_path, 'r', encoding='utf-8') as fp:
        verify = json.load(fp)
    assert len(verify.get("features", [])) == len(features), "Feature count mismatch!"

    print(f"Optimized {base_name:32s}: {orig_size/1024:7.1f} KB -> {new_size/1024:7.1f} KB | {orig_lines:6d} lines -> {new_lines:4d} lines [OK]")

def main():
    target_files = [
        "data/gujarat_roads.geojson",
        "data/gujarat_water_resources.geojson",
        "data/gujarat_power.geojson",
        "data/gujarat_geoenvironmental.geojson",
        "data/gujarat_transmission.geojson",
        "data/gujarat_transport_structures.geojson",
        "data/gujarat_urban_industry.geojson"
    ]
    for tf in target_files:
        if os.path.exists(tf):
            optimize_geojson_collection(tf)

if __name__ == "__main__":
    main()
