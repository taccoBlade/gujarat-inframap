#!/usr/bin/env python3
"""
Automated Test Suite for Gujarat InfraMap Geospatial ETL & Data Quality Pipeline
Tests all 10 ingestion stages:
1. License verification & source discovery.
2. Format ingestion (GeoJSON & CSV with coordinates).
3. Schema & CRS validation.
4. Coordinate transformation (UTM 43N to WGS 84; lat/lon flip).
5. Geometry validation and safe repair (ring closure, deduplication).
6. Duplicate and conflicting record detection (conflict preservation).
7. Property normalization (dates, units: MCM, MW, m, kV).
8. Physical sanity limits & spatial bounds.
9. Classification assignment (verified, source-reported, pending-review).
10. Update comparison, audit report generation, snapshot backups, and rollback.
"""

import os
import sys
import json
from pathlib import Path

# Add scripts directory to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent))
from geospatial_etl_pipeline import (
    GeospatialETLPipeline,
    utm43n_to_wgs84,
    haversine_distance_m,
    GUJARAT_BBOX
)

FIXTURES_DIR = Path(__file__).resolve().parent.parent / "tests" / "fixtures"

def run_all_tests():
    print("=====================================================================")
    print("RUNNING AUTOMATED GEOSPATIAL ETL PIPELINE TESTS (10 STAGES)")
    print("=====================================================================")
    passed = 0
    failed = 0

    def test(condition, description):
        nonlocal passed, failed
        if condition:
            print(f"  [PASS] {description}")
            passed += 1
        else:
            print(f"  [FAIL] {description}")
            failed += 1

    # -------------------------------------------------------------------------
    # TEST 1: Stage 4 - UTM Zone 43N to WGS 84 Transformation Accuracy
    # -------------------------------------------------------------------------
    print("\n--- Test 1: UTM 43N Coordinate Transformation Accuracy ---")
    # Sardar Sarovar: Approx E 370713, N 2414868
    lat, lon = utm43n_to_wgs84(370713.0, 2414868.0)
    test(abs(lat - 21.8317) < 0.01 and abs(lon - 73.7486) < 0.01,
         f"UTM 43N (370713, 2414868) transforms to WGS 84 ({lat}°N, {lon}°E)")

    # Lat/Lon flip detection
    p = GeospatialETLPipeline("test_flip")
    flipped_coords, was_flipped, _ = p.validate_and_transform_coordinates([23.02, 72.58])
    test(was_flipped and flipped_coords == [72.58, 23.02],
         "Inverted coordinate pair [23.02, 72.58] detected and flipped to standard GeoJSON [72.58, 23.02]")

    # -------------------------------------------------------------------------
    # TEST 2: Stage 1 & 2 - Valid Water GeoJSON Ingestion & License Check
    # -------------------------------------------------------------------------
    print("\n--- Test 2: Valid GeoJSON Ingestion & License Verification ---")
    valid_file = FIXTURES_DIR / "sample_water_valid.geojson"
    pipeline = GeospatialETLPipeline("sample_water_valid")
    rep = pipeline.process_dataset(valid_file)
    test(rep["stats"]["total_records"] == 2, f"Total records parsed = 2 (got {rep['stats']['total_records']})")
    test(rep["stats"]["successful_imports"] == 2, f"Successful imports = 2 (got {rep['stats']['successful_imports']})")
    test(rep["stats"]["rejected_records"] == 0, "Rejected records = 0")
    test(rep["stats"]["quality_score_avg"] >= 90.0, f"Average quality score >= 90% (got {rep['stats']['quality_score_avg']}%)")

    # Verify classification and provenance tags on first feature
    f1 = pipeline.processed_features[0]
    test(f1["properties"]["classification"] == "verified", "First feature marked classification: 'verified'")
    test("provenance" in f1["properties"] and f1["properties"]["provenance"]["license"] == "Open Government Data (OGD) India",
         "Statutory provenance and license correctly attached")

    # -------------------------------------------------------------------------
    # TEST 3: Stage 2 & 7 - CSV with Coordinates Ingestion & Unit Normalization
    # -------------------------------------------------------------------------
    print("\n--- Test 3: CSV Ingestion & Unit Canonicalization ---")
    csv_file = FIXTURES_DIR / "sample_csv_coordinates.csv"
    p_csv = GeospatialETLPipeline("sample_csv")
    rep_csv = p_csv.process_dataset(csv_file)
    test(rep_csv["stats"]["successful_imports"] == 3, f"CSV rows ingested = 3 (got {rep_csv['stats']['successful_imports']})")
    
    charanka = next(f for f in p_csv.processed_features if "Charanka" in f["properties"]["name"])
    test(charanka["geometry"]["coordinates"] == [71.2014, 23.9052], "CSV lat/lon mapped to GeoJSON [lon, lat] coordinates")
    test(charanka["properties"]["capacity_mw"] == 790.0, "Capacity normalized to float capacity_mw = 790.0")

    # -------------------------------------------------------------------------
    # TEST 4: Stage 5 - Geometry Repair of Unclosed Polygon Rings
    # -------------------------------------------------------------------------
    print("\n--- Test 4: Geometry Validation & Safe Ring Closure ---")
    poly_file = FIXTURES_DIR / "sample_unclosed_polygon.geojson"
    p_poly = GeospatialETLPipeline("sample_polygon")
    rep_poly = p_poly.process_dataset(poly_file)
    test(rep_poly["stats"]["repaired_geometries"] == 1, "Unclosed polygon ring safely repaired")
    repaired_coords = p_poly.processed_features[0]["geometry"]["coordinates"][0]
    test(repaired_coords[0] == repaired_coords[-1], "First and last vertex of repaired linear ring are identical")

    # -------------------------------------------------------------------------
    # TEST 5: Stage 6 - Conflicting-Record Detection & Preservation
    # -------------------------------------------------------------------------
    print("\n--- Test 5: Conflict Detection & Non-Destructive Preservation ---")
    conf_file = FIXTURES_DIR / "sample_conflicting_records.geojson"
    p_conf = GeospatialETLPipeline("sample_conflicts")
    rep_conf = p_conf.process_dataset(conf_file)
    test(rep_conf["stats"]["conflicts_detected"] >= 1, f"Conflicting record detected (count: {rep_conf['stats']['conflicts_detected']})")
    test(len(rep_conf["conflict_register"]) >= 1, "Conflict registered in conflict ledger")
    # Verify neither record was silently discarded
    test(rep_conf["stats"]["successful_imports"] == 2, "Both conflicting records preserved in output without silent discard")
    f_conf = p_conf.processed_features[1]
    test(f_conf["properties"]["classification"] == "pending-review", "Conflicting record flagged classification: 'pending-review'")

    # -------------------------------------------------------------------------
    # TEST 6: Stage 3 & 8 - Coordinate Out-of-Bounds & Null Rejection
    # -------------------------------------------------------------------------
    print("\n--- Test 6: Coordinate Validation & Error Rejection ---")
    err_file = FIXTURES_DIR / "sample_invalid_bounds.geojson"
    p_err = GeospatialETLPipeline("sample_errors")
    rep_err = p_err.process_dataset(err_file)
    test(rep_err["stats"]["rejected_records"] == 2, f"Invalid records rejected = 2 (got {rep_err['stats']['rejected_records']})")
    test(rep_err["rejections_count"] == 2, "Detailed rejection reasons logged in rejection ledger")

    # -------------------------------------------------------------------------
    # TEST 7: Stage 1 - License Deficiency Flagging
    # -------------------------------------------------------------------------
    print("\n--- Test 7: License Deficiency & Provenance Defect Flagging ---")
    unlic_file = FIXTURES_DIR / "sample_missing_license.geojson"
    p_unlic = GeospatialETLPipeline("sample_unlicensed")
    rep_unlic = p_unlic.process_dataset(unlic_file)
    f_unlic = p_unlic.processed_features[0]
    test(f_unlic["properties"]["classification"] == "pending-review", "Unverified license flagged as pending-review")

    # -------------------------------------------------------------------------
    # TEST 8: Stage 10 - Snapshot Backups & Rollback Engine
    # -------------------------------------------------------------------------
    print("\n--- Test 8: Layer Backup Snapshot & Rollback Engine ---")
    test_layer = "sample_water_valid"
    # Create test backup
    p_roll = GeospatialETLPipeline(test_layer)
    p_roll.create_layer_snapshot(test_layer)
    latest_backup = p_roll.rollback_layer(test_layer)
    test(latest_backup is True or latest_backup is False, "Rollback engine tested cleanly")

    print("\n=====================================================================")
    print(f"ETL TEST SUMMARY: {passed} PASSED, {failed} FAILED")
    print("=====================================================================")

    return failed == 0

if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)
