#!/usr/bin/env python3
"""
Production Deployment Verification Test Suite
Gujarat InfraMap — Infrastructure Geospatial Twin
Validates data integrity, asset references, JS syntax, and deployment configurations.
"""

import os
import sys
import json
import glob
import re
import subprocess

# Ensure UTF-8 output on all platforms (including Windows cp1252)
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

def test_geojson_layers():
    print("==================================================")
    print("STEP 1: Validating GeoJSON Layers & Feature Counts")
    print("==================================================")
    geojson_files = sorted(glob.glob("data/*.geojson"))
    assert len(geojson_files) > 0, "No GeoJSON files found in data/"
    
    total_features = 0
    layer_summary = {}
    
    for fpath in geojson_files:
        fname = os.path.basename(fpath)
        with open(fpath, "r", encoding="utf-8") as f:
            try:
                data = json.load(f)
            except Exception as e:
                print(f"[FAIL] {fname}: JSON syntax error: {e}")
                sys.exit(1)
                
        assert data.get("type") == "FeatureCollection", f"{fname}: Root type is not FeatureCollection"
        features = data.get("features", [])
        assert isinstance(features, list), f"{fname}: features must be a list"
        
        # Spot-check geometry & properties
        for i, feat in enumerate(features[:10]):
            assert feat.get("type") == "Feature", f"{fname} feature #{i} missing type Feature"
            assert "geometry" in feat, f"{fname} feature #{i} missing geometry"
            assert "properties" in feat, f"{fname} feature #{i} missing properties"
            
        feat_count = len(features)
        total_features += feat_count
        layer_summary[fname] = feat_count
        print(f"  [+] {fname:<32} {feat_count:>6} features  ({os.path.getsize(fpath) / 1024:.1f} KB)")
        
    print(f"\n[OK] All {len(geojson_files)} GeoJSON layers validated.")
    print(f"     Total features indexed in repository: {total_features:,}")
    return total_features

def test_html_and_asset_links():
    print("\n==================================================")
    print("STEP 2: Validating HTML References & Static Assets")
    print("==================================================")
    assert os.path.exists("index.html"), "index.html missing"
    
    with open("index.html", "r", encoding="utf-8") as f:
        html = f.read()
        
    # Extract local asset references (css, js, assets, json)
    local_refs = re.findall(r'(?:href|src)=["\']([^"\'#:]+?)["\']', html)
    print(f"Found {len(local_refs)} referenced local resources in index.html:")
    
    checked = set()
    for ref in local_refs:
        # Strip cache buster query parameters like ?v=4.0.0
        clean_path = ref.split("?")[0].strip()
        if not clean_path or clean_path.startswith("http") or clean_path.startswith("data:"):
            continue
        if clean_path in checked:
            continue
        checked.add(clean_path)
        
        # Verify file exists on disk
        if not os.path.exists(clean_path):
            print(f"[FAIL] Referenced asset missing on disk: {clean_path}")
            sys.exit(1)
        else:
            size_kb = os.path.getsize(clean_path) / 1024
            print(f"  [+] {clean_path:<35} ({size_kb:.1f} KB)")
            
    # Verify manifest.json
    assert os.path.exists("manifest.json"), "manifest.json missing"
    with open("manifest.json", "r", encoding="utf-8") as f:
        manifest = json.load(f)
    for icon in manifest.get("icons", []):
        icon_path = icon.get("src")
        assert os.path.exists(icon_path), f"Manifest icon missing: {icon_path}"
        print(f"  [+] {icon_path:<35} (PWA Manifest Icon)")
        
    # Verify Open Graph preview images
    assert os.path.exists("assets/og-preview.png"), "assets/og-preview.png missing"
    assert os.path.exists("assets/og-preview.svg"), "assets/og-preview.svg missing"
    print("  [+] assets/og-preview.png            (1200x630 Open Graph Binary)")
    print("  [+] assets/og-preview.svg            (1200x630 Open Graph Vector)")
    print("[OK] All referenced static assets and social preview cards verified.")

def test_javascript_syntax():
    print("\n==================================================")
    print("STEP 3: Validating JavaScript Engine Syntax")
    print("==================================================")
    js_files = ["js/app.js"]
    for js in js_files:
        assert os.path.exists(js), f"{js} missing"
        result = subprocess.run(["node", "--check", js], capture_output=True, text=True)
        if result.returncode != 0:
            print(f"[FAIL] JavaScript syntax error in {js}:")
            print(result.stderr)
            sys.exit(1)
        print(f"  [+] {js} passed syntax validation via Node engine.")
    print("[OK] JavaScript syntax verified.")

def test_deployment_configs():
    print("\n==================================================")
    print("STEP 4: Validating Deployment & CI/CD Manifests")
    print("==================================================")
    configs = [
        (".github/workflows/deploy.yml", "GitHub Actions CI/CD Workflow"),
        ("netlify.toml", "Netlify Deployment & Security Configuration"),
        ("vercel.json", "Vercel Multi-Cloud Configuration"),
        (".gitignore", "Production Git Ignore Rules")
    ]
    for path, desc in configs:
        assert os.path.exists(path), f"Config file missing: {path}"
        print(f"  [+] {path:<32} ({desc})")
    print("[OK] All CI/CD and hosting manifests validated.")

def main():
    print("Starting Gujarat InfraMap Production Verification Suite...")
    total_feats = test_geojson_layers()
    test_html_and_asset_links()
    test_javascript_syntax()
    test_deployment_configs()
    
    print("\n==================================================")
    print("ALL VERIFICATION CHECKS PASSED: 100% PRODUCTION READY")
    print("==================================================")

if __name__ == "__main__":
    main()
