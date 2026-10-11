#!/usr/bin/env python3
"""
Transportation Network & Civil Structures Compiler
Gujarat InfraMap — Infrastructure Geospatial Twin
Builds data/gujarat_transport_structures.geojson and enriches gujarat_roads.geojson
with civil engineering specifications, bridge crossing links, and multi-modal connectivity.
"""

import os
import sys
import json

# Ensure UTF-8 output
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

def build_transport_structures():
    print("Compiling Gujarat Transport Structures GeoJSON...")
    
    structures = [
        # ==========================================
        # 1. BRIDGES (SIGNATURE WATER & ROAD CROSSINGS)
        # ==========================================
        {
            "id": "GJ-BRG-001",
            "name": "Sudarshan Setu (Okha–Beyt Dwarka Cable-Stayed Bridge)",
            "alternate_name": "Signature Bridge Dwarka",
            "asset_category": "bridge",
            "bridge_type": "Cable-Stayed Bridge",
            "superstructure": "Composite Steel Box Girder with Twin Inclined Pylons (Solar Panel Deck: 1 MW)",
            "substructure": "Cast-in-situ Bored Marine Concrete Piles with Wave Deflectors",
            "waterway_crossed": "Gulf of Kutch / Okha Marine Strait",
            "feature_crossed_id": "strait_okha",
            "supporting_corridor": "NH 51 (Coastal Highway)",
            "supporting_corridor_id": "NH 51",
            "district": "Devbhumi Dwarka",
            "location_desc": "Connecting mainland Okha port to Beyt Dwarka island",
            "length_m": 2324,
            "max_span_m": 500,
            "deck_width_m": 27.2,
            "lane_count": 4,
            "pedestrian_walkway": "Yes (Solar-canopied pedestrian footpaths)",
            "commissioning_year": 2024,
            "commissioning_date": "2024-02-25",
            "responsible_authority": "Ministry of Road Transport and Highways (MoRTH) / NHAI",
            "design_consultant": "L&T Infrastructure Engineering",
            "cost_inr_crore": 979,
            "navigation_clearance_m": 20.0,
            "traffic_disclosure": "Designed for all-weather pilgrimage & port transit (capacity 15,000 PCU/day); dynamic structural health monitoring system installed on cables.",
            "inspection_disclosure": "Continuous automated structural health monitoring (strain & vibration sensors on stay cables); mandatory biennial audit under IRC:SP:18; no structural distress reported in official logs.",
            "coordinates": [69.0988, 22.4633]
        },
        {
            "id": "GJ-BRG-002",
            "name": "New Narmada Bridge (3rd Narmada Extradosed Bridge, Bharuch)",
            "alternate_name": "Bharuch Cable Bridge / Golden Quadrilateral Narmada Crossing",
            "asset_category": "bridge",
            "bridge_type": "Extradosed Cable-Stayed Bridge",
            "superstructure": "Prestressed Concrete (PSC) Box Girder with Extradosed Stay Cables",
            "substructure": "Massive Concrete Pier Well Foundations in Deep Alluvial Riverbed",
            "waterway_crossed": "Narmada River",
            "feature_crossed_id": "river_narmada",
            "supporting_corridor": "NH 48 (Golden Quadrilateral Arterial)",
            "supporting_corridor_id": "NH 48",
            "district": "Bharuch",
            "location_desc": "Crossing Narmada River between Bharuch and Ankleshwar",
            "length_m": 1344,
            "max_span_m": 144,
            "deck_width_m": 20.8,
            "lane_count": 4,
            "pedestrian_walkway": "Service walkways only",
            "commissioning_year": 2017,
            "commissioning_date": "2017-03-07",
            "responsible_authority": "National Highways Authority of India (NHAI)",
            "design_consultant": "Larsen & Toubro (L&T) Heavy Civil",
            "cost_inr_crore": 379,
            "navigation_clearance_m": 14.5,
            "traffic_disclosure": "High-volume freight artery carrying ~45,000 commercial vehicles/day on the Delhi-Mumbai freight corridor.",
            "inspection_disclosure": "Mandatory annual condition assessment by NHAI Project Implementation Unit (PIU) Bharuch per IRC:SP:35; routine stay cable tension calibration; structural integrity rated satisfactory.",
            "coordinates": [72.9866, 21.7042]
        },
        {
            "id": "GJ-BRG-003",
            "name": "Golden Bridge (Historic Narmada Road Bridge, Bharuch)",
            "alternate_name": "Narmada Victorian Lattice Bridge",
            "asset_category": "bridge",
            "bridge_type": "Lattice Truss Bridge",
            "superstructure": "Wrought Iron / Mild Steel Pratt Lattice Trusses (84 spans of 18.2 m)",
            "substructure": "Cast Iron Screw Piles and Masonry Piers anchored in bedrock",
            "waterway_crossed": "Narmada River",
            "feature_crossed_id": "river_narmada",
            "supporting_corridor": "Old NH-8 / State Highway 160 (Bharuch-Ankleshwar Link)",
            "supporting_corridor_id": "SH 160",
            "district": "Bharuch",
            "location_desc": "Historic crossing between Bharuch Old City and Ankleshwar",
            "length_m": 1412,
            "max_span_m": 18.2,
            "deck_width_m": 7.5,
            "lane_count": 2,
            "pedestrian_walkway": "Single-side cantilever walkway",
            "commissioning_year": 1881,
            "commissioning_date": "1881-05-16",
            "responsible_authority": "Roads & Buildings Department, Government of Gujarat",
            "design_consultant": "Sir John Hawkshaw / Bombay, Baroda and Central India Railway (BB&CI)",
            "cost_inr_crore": 0.45,
            "navigation_clearance_m": 9.2,
            "traffic_disclosure": "Heavy Commercial Vehicles (HCV) restricted to preserve heritage superstructure; light motor vehicles and two-wheelers permitted.",
            "inspection_disclosure": "Annual pre-monsoon and post-monsoon structural engineering inspection by Gujarat R&B Quality Control Division; corrosion protective re-coating executed; preserved as working heritage asset.",
            "coordinates": [72.9930, 21.7100]
        },
        {
            "id": "GJ-BRG-004",
            "name": "Silver Jubilee Railway Bridge (Narmada River, Bharuch)",
            "alternate_name": "Western Railway Bridge No. 464",
            "asset_category": "bridge",
            "bridge_type": "Through Truss Railway Bridge",
            "superstructure": "Double Track Broad Gauge Steel Through Trusses (17 spans of 87 m)",
            "substructure": "Deep Caisson Well Foundations in Narmada estuarine alluvium",
            "waterway_crossed": "Narmada River",
            "feature_crossed_id": "river_narmada",
            "supporting_corridor": "Western Railway Main Line (Mumbai–Ahmedabad)",
            "supporting_corridor_id": "WR_MAIN_LINE",
            "district": "Bharuch",
            "location_desc": "Western Railway broad gauge double track between Bharuch and Ankleshwar",
            "length_m": 1406,
            "max_span_m": 87.0,
            "deck_width_m": 10.5,
            "lane_count": 2,
            "pedestrian_walkway": "Railway inspection catwalk only",
            "commissioning_year": 1935,
            "commissioning_date": "1935-12-20",
            "responsible_authority": "Western Railway (Vadodara Division)",
            "design_consultant": "Braithwaite & Co / BB&CI Railway",
            "cost_inr_crore": 1.25,
            "navigation_clearance_m": 11.5,
            "traffic_disclosure": "Handles over 120 express, freight, and container rakes daily on the Western Railway trunk trunk route.",
            "inspection_disclosure": "Quarterly ultrasonic testing of steel truss members and underwater diver sonar scour audits of piers by Western Railway Bridge Workshop Sabarmati.",
            "coordinates": [72.9980, 21.7120]
        },
        {
            "id": "GJ-BRG-005",
            "name": "Surat Cable-Stayed Bridge (Pandit Deendayal Upadhyay Bridge)",
            "alternate_name": "Tapi River Athwalines-Adajan Cable Bridge",
            "asset_category": "bridge",
            "bridge_type": "Cable-Stayed Bridge",
            "superstructure": "Continuous Aerodynamic Steel Box Girder with Single Central A-Frame Pylon (105 m high)",
            "substructure": "Reinforced Concrete Bored Pile Foundations in Tapi riverbed alluvium",
            "waterway_crossed": "Tapi River",
            "feature_crossed_id": "river_tapi",
            "supporting_corridor": "Surat City West Arterial (Athwalines to Adajan)",
            "supporting_corridor_id": "SURAT_RING_LINK",
            "district": "Surat",
            "location_desc": "Crossing Tapi River connecting Athwalines to Adajan, Surat",
            "length_m": 918,
            "max_span_m": 150,
            "deck_width_m": 24.5,
            "lane_count": 4,
            "pedestrian_walkway": "Flanked pedestrian sidewalks with architectural viewing points",
            "commissioning_year": 2018,
            "commissioning_date": "2018-10-02",
            "responsible_authority": "Surat Municipal Corporation (SMC)",
            "design_consultant": "Gammon India / Unique EPC Projects",
            "cost_inr_crore": 143,
            "navigation_clearance_m": 12.0,
            "traffic_disclosure": "Peak hour traffic ~55,000 PCU/day; significantly mitigated congestion on Sardar Bridge and Hope Bridge.",
            "inspection_disclosure": "Quarterly laser deflector and stay-cable accelerometer testing managed by SMC Bridge Cell; no structural anomalies identified.",
            "coordinates": [72.7845, 21.1895]
        },
        {
            "id": "GJ-BRG-006",
            "name": "Atal Pedestrian Bridge (Sabarmati Riverfront, Ahmedabad)",
            "alternate_name": "Atal Foot Over Bridge",
            "asset_category": "bridge",
            "bridge_type": "Tubular Steel Truss Pedestrian Bridge",
            "superstructure": "Sculptural Origami-inspired Steel Tubular Truss with Tensile Fabric Roof Canopy",
            "substructure": "RCC Riverbed Piers anchored into Sabarmati Riverfront barrage pool",
            "waterway_crossed": "Sabarmati River (Vasna Barrage Impoundment)",
            "feature_crossed_id": "river_sabarmati",
            "supporting_corridor": "Sabarmati Riverfront Promenade (East Bank to West Bank)",
            "supporting_corridor_id": "SABARMATI_PROMENADE",
            "district": "Ahmedabad",
            "location_desc": "Between Sardar Bridge and Ellis Bridge connecting East and West Riverfront promenades",
            "length_m": 300,
            "max_span_m": 100,
            "deck_width_m": 14.0,
            "lane_count": 0,
            "pedestrian_walkway": "100% Pedestrian & Non-Motorised Transport (NMT)",
            "commissioning_year": 2022,
            "commissioning_date": "2022-08-27",
            "responsible_authority": "Sabarmati Riverfront Development Corporation Limited (SRFDCL) / AMC",
            "design_consultant": "STUP Consultants / P&R Infraprojects",
            "cost_inr_crore": 74,
            "navigation_clearance_m": 8.5,
            "traffic_disclosure": "Exclusively pedestrian promenade asset; capacity 12,000 visitors/day.",
            "inspection_disclosure": "Bi-monthly aerodynamic wind tunnel and tuned mass damper inspection by SRFDCL engineering wing.",
            "coordinates": [72.5714, 23.0232]
        },
        {
            "id": "GJ-BRG-007",
            "name": "Ellis Bridge / Swami Vivekananda Bridge (Sabarmati River)",
            "alternate_name": "Historic Bowstring Lattice Bridge",
            "asset_category": "bridge",
            "bridge_type": "Bowstring Truss & Parallel RCC Bridges",
            "superstructure": "Heritage Bowstring Steel Trusses alongside twin 3-lane RCC prestressed box girders",
            "substructure": "Stone Masonry Piers (Heritage) and Cast-in-situ Bored Piles (Modern spans)",
            "waterway_crossed": "Sabarmati River",
            "feature_crossed_id": "river_sabarmati",
            "supporting_corridor": "Ashram Road to Relief Road Arterial",
            "supporting_corridor_id": "AHMEDABAD_CENTRAL_LINK",
            "district": "Ahmedabad",
            "location_desc": "Connecting Paldi/Ashram Road to Victoria Garden / Old Ahmedabad",
            "length_m": 433,
            "max_span_m": 43.5,
            "deck_width_m": 18.5,
            "lane_count": 6,
            "pedestrian_walkway": "Yes (Heritage span dedicated to pedestrian heritage walks)",
            "commissioning_year": 1892,
            "commissioning_date": "1892-05-18",
            "responsible_authority": "Ahmedabad Municipal Corporation (AMC)",
            "design_consultant": "Sir Himmatlal Dhirajram / Modern spans by AMC Bridge Project Cell",
            "cost_inr_crore": 18.5,
            "navigation_clearance_m": 7.0,
            "traffic_disclosure": "Vehicular traffic accommodated on parallel twin modern bridges (~70,000 PCU/day); historic bowstring span closed to motor vehicles.",
            "inspection_disclosure": "Regular seismic retrofitting audits by AMC and CEPT University structural laboratories; heritage iron conservation plan active.",
            "coordinates": [72.5712, 23.0205]
        },
        {
            "id": "GJ-BRG-008",
            "name": "Nehru Bridge (Sabarmati River, Ahmedabad)",
            "alternate_name": "Relief Road Sabarmati Crossing",
            "asset_category": "bridge",
            "bridge_type": "Balanced Cantilever Girder Bridge",
            "superstructure": "Reinforced Concrete Balanced Cantilever Box Girder",
            "substructure": "RCC Mass Piers on Open Raft & Well Foundations",
            "waterway_crossed": "Sabarmati River",
            "feature_crossed_id": "river_sabarmati",
            "supporting_corridor": "Relief Road to Navrangpura Arterial",
            "supporting_corridor_id": "AHMEDABAD_ARTERIAL_01",
            "district": "Ahmedabad",
            "location_desc": "Crossing Sabarmati River connecting Ahmedabad Railway Station area to West Ahmedabad",
            "length_m": 442,
            "max_span_m": 48.0,
            "deck_width_m": 22.0,
            "lane_count": 6,
            "pedestrian_walkway": "Twin cantilever walkways",
            "commissioning_year": 1962,
            "commissioning_date": "1962-09-08",
            "responsible_authority": "Ahmedabad Municipal Corporation (AMC)",
            "design_consultant": "AMC Engineering Department",
            "cost_inr_crore": 1.1,
            "navigation_clearance_m": 7.5,
            "traffic_disclosure": "Heavy urban commuting artery carrying BRTS buses and city traffic (~85,000 PCU/day).",
            "inspection_disclosure": "Comprehensive structural rehabilitation and epoxy carbon fiber wrapping executed in 2018; annual deflection audit.",
            "coordinates": [72.5746, 23.0270]
        },
        {
            "id": "GJ-BRG-009",
            "name": "Subhash Bridge (Sabarmati River, Ahmedabad)",
            "alternate_name": "RTO Sabarmati River Crossing",
            "asset_category": "bridge",
            "bridge_type": "Prestressed Concrete Girder Bridge",
            "superstructure": "Precast Prestressed Concrete I-Girders with RCC Deck Slab",
            "substructure": "RCC Circular Piers on Bored Cast-in-situ Piles",
            "waterway_crossed": "Sabarmati River",
            "feature_crossed_id": "river_sabarmati",
            "supporting_corridor": "132ft Inner Ring Road",
            "supporting_corridor_id": "AHMEDABAD_INNER_RING",
            "district": "Ahmedabad",
            "location_desc": "Connecting Shahibaug / Cantonment to RTO / Ranip / Sabarmati",
            "length_m": 438,
            "max_span_m": 36.5,
            "deck_width_m": 24.0,
            "lane_count": 6,
            "pedestrian_walkway": "Sidewalks on both flanks",
            "commissioning_year": 1973,
            "commissioning_date": "1973-11-14",
            "responsible_authority": "Ahmedabad Municipal Corporation (AMC)",
            "design_consultant": "Gujarat PWD / AMC",
            "cost_inr_crore": 2.4,
            "navigation_clearance_m": 8.0,
            "traffic_disclosure": "Connects northern industrial and transit corridors; ~60,000 vehicles/day.",
            "inspection_disclosure": "Bearing replacement and expansion joint renewal completed in 2021; AMC structural registry rating: Good.",
            "coordinates": [72.5840, 23.0610]
        },
        {
            "id": "GJ-BRG-010",
            "name": "Mahi River Highway Bridge (Vasad, NH-48)",
            "alternate_name": "Vasad Twin Bridges on Mahi",
            "asset_category": "bridge",
            "bridge_type": "Prestressed Concrete Box Girder Bridge",
            "superstructure": "Twin Continuous PSC Box Girders (8 lanes total)",
            "substructure": "Massive Circular Well Foundations in Mahi deep silt bed",
            "waterway_crossed": "Mahi River",
            "feature_crossed_id": "river_mahi",
            "supporting_corridor": "NH 48 (Golden Quadrilateral Arterial)",
            "supporting_corridor_id": "NH 48",
            "district": "Anand",
            "location_desc": "Crossing Mahi River between Anand and Vadodara districts at Vasad",
            "length_m": 960,
            "max_span_m": 48.0,
            "deck_width_m": 35.0,
            "lane_count": 8,
            "pedestrian_walkway": "Outer maintenance parapets",
            "commissioning_year": 2004,
            "commissioning_date": "2004-12-15",
            "responsible_authority": "National Highways Authority of India (NHAI)",
            "design_consultant": "Gammon India / NHAI PIU Vadodara",
            "cost_inr_crore": 85,
            "navigation_clearance_m": 12.0,
            "traffic_disclosure": "Key national logistics choke-point carrying >65,000 PCU/day between Ahmedabad and Mumbai.",
            "inspection_disclosure": "High-speed road profiler and underwater ultrasonic foundation scanning completed in 2023 by NHAI.",
            "coordinates": [73.0720, 22.4550]
        },
        {
            "id": "GJ-BRG-011",
            "name": "Damanganga River Highway Bridge (Vapi, NH-48)",
            "alternate_name": "Vapi Southern Gateway Bridge",
            "asset_category": "bridge",
            "bridge_type": "Prestressed Concrete Girder Bridge",
            "superstructure": "Continuous PSC Box Girders with Asphalt Wearing Course",
            "substructure": "RCC Pier Columns on Rock-Socketed Piles",
            "waterway_crossed": "Damanganga River",
            "feature_crossed_id": "river_damanganga",
            "supporting_corridor": "NH 48",
            "supporting_corridor_id": "NH 48",
            "district": "Valsad",
            "location_desc": "Crossing Damanganga River on the southern outskirts of Vapi industrial zone",
            "length_m": 480,
            "max_span_m": 40.0,
            "deck_width_m": 26.0,
            "lane_count": 6,
            "pedestrian_walkway": "Flanked service pathways",
            "commissioning_year": 2002,
            "commissioning_date": "2002-04-10",
            "responsible_authority": "NHAI PIU Surat",
            "design_consultant": "L&T / NHAI",
            "cost_inr_crore": 42,
            "navigation_clearance_m": 9.5,
            "traffic_disclosure": "Transits inter-state commercial freight between Gujarat, Daman, and Maharashtra.",
            "inspection_disclosure": "Annual bridge health inspection under NHAI BMS; expansion joint rehabilitation executed 2022.",
            "coordinates": [72.9180, 20.3720]
        },
        {
            "id": "GJ-BRG-012",
            "name": "Bhadar River Bridge (Jetpur, NH-27)",
            "alternate_name": "Saurashtra East-West Corridor Bhadar Crossing",
            "asset_category": "bridge",
            "bridge_type": "Continuous RCC Girder Bridge",
            "superstructure": "Precast RCC T-Beam and Slab Superstructure",
            "substructure": "Solid Masonry Piers on Shallow Basalt Foundations",
            "waterway_crossed": "Bhadar River",
            "feature_crossed_id": "river_bhadar",
            "supporting_corridor": "NH 27 (Porbandar–Silchar Corridor)",
            "supporting_corridor_id": "NH 27",
            "district": "Rajkot",
            "location_desc": "Crossing Bhadar River at Jetpur textile cluster",
            "length_m": 360,
            "max_span_m": 30.0,
            "deck_width_m": 18.0,
            "lane_count": 4,
            "pedestrian_walkway": "Sidewalks on both sides",
            "commissioning_year": 2011,
            "commissioning_date": "2011-06-20",
            "responsible_authority": "NHAI PIU Rajkot",
            "design_consultant": "Sadbhav Engineering / NHAI",
            "cost_inr_crore": 28,
            "navigation_clearance_m": 8.0,
            "traffic_disclosure": "Major agricultural and industrial transit artery connecting Porbandar Port to Rajkot and Gondal.",
            "inspection_disclosure": "Monsoon flood gauge telemetry installed; structural health verified under IRC guidelines.",
            "coordinates": [70.6280, 21.7510]
        },
        {
            "id": "GJ-BRG-013",
            "name": "Shetrunji River Bridge (Talaja, NH-51)",
            "alternate_name": "Talaja Coastal Highway Shetrunji Crossing",
            "asset_category": "bridge",
            "bridge_type": "Prestressed Concrete Box Girder Bridge",
            "superstructure": "Continuous PSC Box Girder with Monolithic Pier Connections",
            "substructure": "Cast-in-situ Bored Piles in Alluvial Sand Bed",
            "waterway_crossed": "Shetrunji River",
            "feature_crossed_id": "river_shetrunji",
            "supporting_corridor": "NH 51 (Coastal Highway)",
            "supporting_corridor_id": "NH 51",
            "district": "Bhavnagar",
            "location_desc": "Crossing Shetrunji River south of Talaja near Gulf of Khambhat estuary",
            "length_m": 420,
            "max_span_m": 35.0,
            "deck_width_m": 16.5,
            "lane_count": 4,
            "pedestrian_walkway": "Single-side footpath",
            "commissioning_year": 2016,
            "commissioning_date": "2016-11-15",
            "responsible_authority": "NHAI PIU Bhavnagar",
            "design_consultant": "GSRDC / NHAI",
            "cost_inr_crore": 36,
            "navigation_clearance_m": 9.0,
            "traffic_disclosure": "Evacuates coastal traffic between Bhavnagar, Alang Shipbreaking Yard, and Pipavav Port.",
            "inspection_disclosure": "Routine saline corrosion protective coating inspection; structure rated fully serviceable.",
            "coordinates": [72.0350, 21.3520]
        },
        {
            "id": "GJ-BRG-014",
            "name": "Machhu River Bridge (Morbi, NH-27 Bypass)",
            "alternate_name": "Morbi Ceramic Belt Machhu Crossing",
            "asset_category": "bridge",
            "bridge_type": "RCC Multi-Beam Girder Bridge",
            "superstructure": "Reinforced Concrete T-Beams with Cast-in-situ Deck Slab",
            "substructure": "Reinforced Concrete Circular Piers on Hard Sandstone Strata",
            "waterway_crossed": "Machhu River",
            "feature_crossed_id": "river_machhu",
            "supporting_corridor": "NH 27 (Bypass Link)",
            "supporting_corridor_id": "NH 27",
            "district": "Morbi",
            "location_desc": "Crossing Machhu River downstream of Machhu-II Dam",
            "length_m": 310,
            "max_span_m": 28.0,
            "deck_width_m": 22.0,
            "lane_count": 4,
            "pedestrian_walkway": "Both flanks with concrete parapets",
            "commissioning_year": 2008,
            "commissioning_date": "2008-08-10",
            "responsible_authority": "National Highways Authority of India (NHAI)",
            "design_consultant": "NHAI PIU Gandhidham",
            "cost_inr_crore": 22,
            "navigation_clearance_m": 8.5,
            "traffic_disclosure": "Heavy multi-axle truck corridor carrying ceramic export freight towards Kandla and Mundra ports.",
            "inspection_disclosure": "Visual and rebound hammer non-destructive testing logged in 2022; no structural damage recorded.",
            "coordinates": [70.8350, 22.8120]
        },
        {
            "id": "GJ-BRG-015",
            "name": "MAHSR Bullet Train Narmada River Bridge (Bharuch)",
            "alternate_name": "High Speed Rail Narmada Steel Truss Bridge",
            "asset_category": "bridge",
            "bridge_type": "Continuous Steel Truss Rail Bridge",
            "superstructure": "Continuous High-Strength Steel Truss with Concrete Track Slab for 350 km/h Shinkansen Trains",
            "substructure": "Massive Cast-in-situ Bored Piles (2.5 m diameter) with Scour Cutoffs",
            "waterway_crossed": "Narmada River",
            "feature_crossed_id": "river_narmada",
            "supporting_corridor": "Mumbai–Ahmedabad High Speed Rail (MAHSR)",
            "supporting_corridor_id": "MAHSR_CORRIDOR",
            "district": "Bharuch",
            "location_desc": "Crossing Narmada River upstream of Golden Bridge between Bharuch and Ankleshwar",
            "length_m": 1400,
            "max_span_m": 130,
            "deck_width_m": 14.5,
            "lane_count": 2,
            "pedestrian_walkway": "High-speed rail maintenance walkway with acoustic barrier walls",
            "commissioning_year": 2026,
            "commissioning_date": "Target 2026",
            "responsible_authority": "National High Speed Rail Corporation Limited (NHSRCL)",
            "design_consultant": "Japan International Consultants for Transportation (JICC) / L&T Heavy Civil",
            "cost_inr_crore": 680,
            "navigation_clearance_m": 16.0,
            "traffic_disclosure": "Dedicated high-speed passenger rail corridor engineered for 320 km/h commercial operations.",
            "inspection_disclosure": "State-of-the-art Japanese Shinkansen standard seismic and wind vibration sensors; structural execution subject to stringent third-party quality audits.",
            "coordinates": [73.0120, 21.7160]
        },
        {
            "id": "GJ-BRG-016",
            "name": "MAHSR Bullet Train Sabarmati River Bridge (Ahmedabad)",
            "alternate_name": "High Speed Rail Sabarmati Viaduct Bridge",
            "asset_category": "bridge",
            "bridge_type": "Prestressed Concrete Continuous Girder Bridge",
            "superstructure": "Continuous PSC Box Girder for Ballastless Track High Speed Slab",
            "substructure": "Reinforced Concrete Piers with Seismic Isolator Bearings",
            "waterway_crossed": "Sabarmati River",
            "feature_crossed_id": "river_sabarmati",
            "supporting_corridor": "Mumbai–Ahmedabad High Speed Rail (MAHSR)",
            "supporting_corridor_id": "MAHSR_CORRIDOR",
            "district": "Ahmedabad",
            "location_desc": "Crossing Sabarmati River approaching Sabarmati HSR Terminal",
            "length_m": 350,
            "max_span_m": 60.0,
            "deck_width_m": 14.5,
            "lane_count": 2,
            "pedestrian_walkway": "Inspection walkway with sound-absorbing barrier parapets",
            "commissioning_year": 2026,
            "commissioning_date": "Target 2026",
            "responsible_authority": "National High Speed Rail Corporation Limited (NHSRCL)",
            "design_consultant": "JICA / NHSRCL / Afcons Infrastructure",
            "cost_inr_crore": 145,
            "navigation_clearance_m": 10.0,
            "traffic_disclosure": "Terminal approach section decelerating towards Sabarmati Multimodal Transport Hub.",
            "inspection_disclosure": "Full-span precast box girders tested in casting yard prior to erection; zero defects documented.",
            "coordinates": [72.5810, 23.0550]
        },
        {
            "id": "GJ-BRG-017",
            "name": "Hope Bridge (Tapi River, Surat)",
            "alternate_name": "Historic Surat Tapi Iron Bridge",
            "asset_category": "bridge",
            "bridge_type": "Steel Truss Bridge (Rebuilt with RCC spans)",
            "superstructure": "Multi-span Steel Pratt Trusses with modern Composite RCC Decking",
            "substructure": "Cast Iron Screw Piles with Masonry Casings and River Pier Protections",
            "waterway_crossed": "Tapi River",
            "feature_crossed_id": "river_tapi",
            "supporting_corridor": "Chowk Bazaar to Rander Road",
            "supporting_corridor_id": "SURAT_HISTORIC_LINK",
            "district": "Surat",
            "location_desc": "Historic crossing between Surat Chowk and Rander across Tapi River",
            "length_m": 420,
            "max_span_m": 35.0,
            "deck_width_m": 12.0,
            "lane_count": 2,
            "pedestrian_walkway": "Sidewalks on both flanks",
            "commissioning_year": 1877,
            "commissioning_date": "1877-03-25",
            "responsible_authority": "Surat Municipal Corporation (SMC)",
            "design_consultant": "Theodore Hope / Bombay PWD",
            "cost_inr_crore": 0.8,
            "navigation_clearance_m": 8.0,
            "traffic_disclosure": "Operates for light motor vehicles and public intra-city transit (~25,000 PCU/day).",
            "inspection_disclosure": "Major structural strengthening and replacement of corroded cross-girders carried out by SMC in 2019.",
            "coordinates": [72.8120, 21.1980]
        },
        {
            "id": "GJ-BRG-018",
            "name": "Wanakbori Weir Road Bridge (Mahi River)",
            "alternate_name": "Wanakbori Hydro-Thermal Weir Causeway Bridge",
            "asset_category": "bridge",
            "bridge_type": "Submersible Cause-way & Pier Bridge",
            "superstructure": "Reinforced Concrete Solid Slab resting on Masonry Weir Crest Piers",
            "substructure": "Mass Concrete Gravity Weir Foundation on Basaltic Bedrock",
            "waterway_crossed": "Mahi River",
            "feature_crossed_id": "river_mahi",
            "supporting_corridor": "State Highway 88 (Thasra–Balasinor Link)",
            "supporting_corridor_id": "SH 88",
            "district": "Kheda",
            "location_desc": "Crossing Mahi River directly over Wanakbori Weir and Thermal Power Plant water intake",
            "length_m": 820,
            "max_span_m": 22.0,
            "deck_width_m": 8.5,
            "lane_count": 2,
            "pedestrian_walkway": "Service walkway for irrigation and weir sluice gates",
            "commissioning_year": 1954,
            "commissioning_date": "1954-10-12",
            "responsible_authority": "Gujarat Water Resources Department / GSECL",
            "design_consultant": "Bombay State PWD",
            "cost_inr_crore": 1.8,
            "navigation_clearance_m": 4.5,
            "traffic_disclosure": "Dual utility: provides regional road transit and serves as the operating bridge for weir radial gates.",
            "inspection_disclosure": "Annual structural stability audit by Water Resources Quality Control Division; submerged masonry checked by divers.",
            "coordinates": [73.3550, 22.9150]
        },

        # ==========================================
        # 2. FLYOVERS & ELEVATED EXPRESS CORRIDORS
        # ==========================================
        {
            "id": "GJ-FLY-001",
            "name": "SG Highway Elevated Corridor (Gota–Uvarsad)",
            "alternate_name": "Sarkhej–Gandhinagar Elevated Expressway",
            "asset_category": "flyover",
            "bridge_type": "Elevated Highway Viaduct",
            "superstructure": "Continuous Precast Prestressed Concrete Box Girders on Single Central Piers (T-Piers)",
            "substructure": "Cast-in-situ Bored Piles on Central Median Strip",
            "waterway_crossed": "Multiple Grade Junctions (Gota, Sola, Science City, Vaishnodevi, Khoraj, Uvarsad)",
            "feature_crossed_id": "road_intersections_sg",
            "supporting_corridor": "NH 147 (SG Highway)",
            "supporting_corridor_id": "NH 147",
            "district": "Ahmedabad",
            "location_desc": "Continuous elevated expressway grade separator connecting Ahmedabad to Gandhinagar",
            "length_m": 14800,
            "max_span_m": 42.0,
            "deck_width_m": 27.5,
            "lane_count": 6,
            "pedestrian_walkway": "Expressway standard; pedestrian traffic segregated to ground-level service roads",
            "commissioning_year": 2022,
            "commissioning_date": "2022-09-30",
            "responsible_authority": "National Highways Authority of India (NHAI) / Gujarat R&B",
            "design_consultant": "NHAI PIU Ahmedabad",
            "cost_inr_crore": 867,
            "navigation_clearance_m": 5.5,
            "traffic_disclosure": "Express transit carrying >110,000 PCU/day; reduced transit time between Ahmedabad and Gandhinagar to 18 minutes.",
            "inspection_disclosure": "Continuous CCTV traffic telemetry and mandatory biennial structural deflector scan by NHAI.",
            "coordinates": [72.5350, 23.1150]
        },
        {
            "id": "GJ-FLY-002",
            "name": "Atal Bihari Vajpayee Flyover (Genda Circle to Manisha Chokdi)",
            "alternate_name": "Vadodara Central Spine Elevated Flyover",
            "asset_category": "flyover",
            "bridge_type": "Urban Elevated Flyover",
            "superstructure": "Prestressed Concrete U-Girders and Segmental Box Girders",
            "substructure": "Reinforced Concrete Portal Piers on Bored Pile Foundations",
            "waterway_crossed": "5 Urban Grade Junctions (Genda Circle, Akshar Chowk, Old Padra Road, Manisha Chokdi)",
            "feature_crossed_id": "vadodara_urban_crossings",
            "supporting_corridor": "Vadodara Central Arterial",
            "supporting_corridor_id": "VADODARA_CENTRAL",
            "district": "Vadodara",
            "location_desc": "Longest municipal flyover in Gujarat passing through the commercial core of Vadodara",
            "length_m": 3500,
            "max_span_m": 38.0,
            "deck_width_m": 16.5,
            "lane_count": 4,
            "pedestrian_walkway": "Median service catwalks with crash barriers",
            "commissioning_year": 2022,
            "commissioning_date": "2022-12-25",
            "responsible_authority": "Vadodara Municipal Corporation (VMC)",
            "design_consultant": "VMC Bridge Project Cell / Ranjit Buildcon",
            "cost_inr_crore": 230,
            "navigation_clearance_m": 5.5,
            "traffic_disclosure": "Cuts cross-city transit time from 40 mins to 7 mins; accommodates ~75,000 vehicles/day.",
            "inspection_disclosure": "Structural audit by Sardar Vallabhbhai National Institute of Technology (SVNIT) Surat in 2023; satisfactory.",
            "coordinates": [73.1750, 22.3050]
        },
        {
            "id": "GJ-FLY-003",
            "name": "Surat Textile Ring Road Elevated Flyover Corridor",
            "alternate_name": "Sahara Darwaja Multi-Tier Elevated Flyover",
            "asset_category": "flyover",
            "bridge_type": "Multi-Tier Y-Shaped Urban Flyover",
            "superstructure": "Composite Steel-Concrete Girders and Prestressed Concrete Slabs",
            "substructure": "Steel Flanged Piers and Heavy RCC Pile Caps",
            "waterway_crossed": "Surat Railway Line & Textile Wholesale Market Corridor",
            "feature_crossed_id": "rail_and_textile_grid",
            "supporting_corridor": "Surat Ring Road Arterial",
            "supporting_corridor_id": "SURAT_RING_CORRIDOR",
            "district": "Surat",
            "location_desc": "Multi-level flyover system crossing Western Railway mainline tracks and dense wholesale textile markets",
            "length_m": 2800,
            "max_span_m": 55.0,
            "deck_width_m": 18.0,
            "lane_count": 4,
            "pedestrian_walkway": "Pedestrian foot overbridges connected at bus interchange nodes",
            "commissioning_year": 2019,
            "commissioning_date": "2019-07-15",
            "responsible_authority": "Surat Municipal Corporation (SMC)",
            "design_consultant": "SMC Engineering Cell",
            "cost_inr_crore": 133,
            "navigation_clearance_m": 6.8,
            "traffic_disclosure": "High density freight and intra-city vehicular volume (~90,000 PCU/day); relieves textile market gridlock.",
            "inspection_disclosure": "Quarterly vibration and dynamic deflection audit by SMC Bridge Department.",
            "coordinates": [72.8420, 21.1920]
        },
        {
            "id": "GJ-FLY-004",
            "name": "KKV Elevated Multi-Tier Overpass (150ft Ring Road, Rajkot)",
            "alternate_name": "Rajkot Two-Tier Elevated Corridor",
            "asset_category": "flyover",
            "bridge_type": "Two-Tier Elevated Flyover",
            "superstructure": "Precast Prestressed Concrete Segmental Box Girders with Spline Beams",
            "substructure": "Heavy Duty Portal Framing on Bored Cast-in-situ Piles",
            "waterway_crossed": "Kalawad Road Cross Intersection & KKV Circle",
            "feature_crossed_id": "kkv_circle_cross",
            "supporting_corridor": "Rajkot 150ft Ring Road",
            "supporting_corridor_id": "RAJKOT_RING_ROAD",
            "district": "Rajkot",
            "location_desc": "Strategic two-tier grade separator on the 150ft Ring Road at Kalawad Road junction",
            "length_m": 1150,
            "max_span_m": 35.0,
            "deck_width_m": 16.5,
            "lane_count": 4,
            "pedestrian_walkway": "Ground-level pedestrian signal crossings",
            "commissioning_year": 2023,
            "commissioning_date": "2023-01-24",
            "responsible_authority": "Rajkot Municipal Corporation (RMC)",
            "design_consultant": "RMC Project Cell / Backbone Projects",
            "cost_inr_crore": 129,
            "navigation_clearance_m": 5.5,
            "traffic_disclosure": "Separates express ring road traffic from university and hospital corridors; ~60,000 PCU/day.",
            "inspection_disclosure": "Tested with static load tests up to 400 metric tonnes prior to public commissioning; certified sound.",
            "coordinates": [70.7760, 22.2850]
        },
        {
            "id": "GJ-FLY-005",
            "name": "Bopal Flyover & SP Ring Road Overpass (Ahmedabad)",
            "alternate_name": "Sardar Patel Ring Road Bopal Grade Separator",
            "asset_category": "flyover",
            "bridge_type": "RCC Arterial Overpass",
            "superstructure": "Continuous Prestressed Concrete Box Girder",
            "substructure": "Reinforced Concrete Piers on Driven Piles",
            "waterway_crossed": "Bopal Cross Roads and SP Ring Road Junction",
            "feature_crossed_id": "bopal_junction",
            "supporting_corridor": "Sardar Patel Ring Road (NH 147A)",
            "supporting_corridor_id": "NH 147A",
            "district": "Ahmedabad",
            "location_desc": "Crossing Bopal-Ambli commercial arterial over the Sardar Patel Ring Road",
            "length_m": 1420,
            "max_span_m": 36.0,
            "deck_width_m": 24.0,
            "lane_count": 6,
            "pedestrian_walkway": "Segregated service lanes",
            "commissioning_year": 2018,
            "commissioning_date": "2018-05-10",
            "responsible_authority": "Ahmedabad Urban Development Authority (AUDA)",
            "design_consultant": "AUDA Engineering Cell",
            "cost_inr_crore": 78,
            "navigation_clearance_m": 5.5,
            "traffic_disclosure": "Carries bypass freight and western Ahmedabad suburban commuters (~80,000 PCU/day).",
            "inspection_disclosure": "Regular pavement resurfacing and expansion joint maintenance by AUDA.",
            "coordinates": [72.4820, 23.0310]
        },

        # ==========================================
        # 3. TUNNELS & GEOTECHNICAL PASS CUTTINGS
        # ==========================================
        {
            "id": "GJ-TUN-001",
            "name": "MAHSR Bullet Train Undersea & Approach Tunnel Portal",
            "alternate_name": "High Speed Rail Gujarat Coastal Approach Tunnel",
            "asset_category": "tunnel",
            "bridge_type": "Single-Bore Twin-Track High-Speed Tunnel",
            "superstructure": "Precast Fiber-Reinforced Concrete Segmental Liners (13.2 m outer diameter)",
            "substructure": "Excavated with Slurry Tunnel Boring Machine (TBM) through basalt and marine clays",
            "waterway_crossed": "Coastal creek and basalt ridge",
            "feature_crossed_id": "creek_and_ridge",
            "supporting_corridor": "Mumbai–Ahmedabad High Speed Rail (MAHSR)",
            "supporting_corridor_id": "MAHSR_CORRIDOR",
            "district": "Valsad",
            "location_desc": "South Gujarat approach section transitioning from undersea Thane Creek segment towards Vapi viaduct",
            "length_m": 1800,
            "max_span_m": 13.2,
            "deck_width_m": 13.2,
            "lane_count": 2,
            "pedestrian_walkway": "Continuous emergency evacuation catwalks with cross-passages every 250 m",
            "commissioning_year": 2026,
            "commissioning_date": "Target 2026",
            "responsible_authority": "National High Speed Rail Corporation Limited (NHSRCL)",
            "design_consultant": "JICA / NHSRCL / Afcons Infrastructure",
            "cost_inr_crore": 950,
            "navigation_clearance_m": 7.5,
            "traffic_disclosure": "Designed for aerodynamic pressure pulse management when 320 km/h Shinkansen trains enter portal.",
            "inspection_disclosure": "Continuous fibre-optic strain gauges embedded in precast tunnel rings; geotechnical settlement monitors active.",
            "coordinates": [72.8900, 20.4500]
        },
        {
            "id": "GJ-TUN-002",
            "name": "Modasa–Shamlaji Aravalli Hill Pass Cutting & Rock Gallery",
            "alternate_name": "Aravalli Ridge Reinforced Highway Cut",
            "asset_category": "tunnel",
            "bridge_type": "Rock Cut with Reinforced Concrete Gallery",
            "superstructure": "RCC Rockfall Canopy and Steel Wire Mesh Rock Bolting",
            "substructure": "Anchored Rock Bolts and Shotcrete reinforced quartzite strata",
            "waterway_crossed": "Aravalli Hill Ridge Gap",
            "feature_crossed_id": "aravalli_ridge",
            "supporting_corridor": "NH 48 / NH 58 connector link",
            "supporting_corridor_id": "NH 48",
            "district": "Aravalli",
            "location_desc": "Deep rock pass cut through the Aravalli hills connecting Modasa to Shamlaji and Rajasthan border",
            "length_m": 650,
            "max_span_m": 18.0,
            "deck_width_m": 18.0,
            "lane_count": 4,
            "pedestrian_walkway": "Safety barrier walkway",
            "commissioning_year": 2014,
            "commissioning_date": "2014-03-12",
            "responsible_authority": "Roads & Buildings Department, Gujarat",
            "design_consultant": "Gujarat R&B Highway Division",
            "cost_inr_crore": 35,
            "navigation_clearance_m": 5.8,
            "traffic_disclosure": "Freight corridor connecting North Gujarat industrial belt to Delhi corridor (~25,000 PCU/day).",
            "inspection_disclosure": "Annual geological slope stability assessment; rock bolting inspected post-monsoon.",
            "coordinates": [73.3550, 23.6820]
        },

        # ==========================================
        # 4. FREIGHT TERMINALS & MULTI-MODAL LOGISTICS PARKS
        # ==========================================
        {
            "id": "GJ-TRM-001",
            "name": "CONCOR Multi-Modal Logistics Park Sanand (ICD Sanand)",
            "alternate_name": "Sanand Inland Container Depot & WDFC Rail Siding",
            "asset_category": "freight_terminal",
            "bridge_type": "Inland Container Depot & Rail Freight Terminal",
            "superstructure": "Heavy-Duty PQC Rigid Pavement Container Stacking Yard & Pre-engineered Steel Warehouses",
            "substructure": "Reinforced Subgrade Pavement designed for 40-tonne axle loads",
            "waterway_crossed": "Direct rail connection to Western Dedicated Freight Corridor (WDFC)",
            "feature_crossed_id": "wdfc_rail_grid",
            "supporting_corridor": "Western Dedicated Freight Corridor (WDFC) & SH 17 (Sanand-Viramgam)",
            "supporting_corridor_id": "WDFC_CORRIDOR",
            "district": "Ahmedabad",
            "location_desc": "Adjacent to Sanand GIDC Automobile Hub with direct electrified rail sidings to WDFC",
            "length_m": 1200,
            "max_span_m": 0,
            "deck_width_m": 0,
            "lane_count": 6,
            "pedestrian_walkway": "Industrial safety walkways",
            "commissioning_year": 2018,
            "commissioning_date": "2018-06-20",
            "responsible_authority": "Container Corporation of India (CONCOR) / Indian Railways",
            "design_consultant": "CONCOR Engineering Division",
            "cost_inr_crore": 340,
            "navigation_clearance_m": 0,
            "traffic_disclosure": "Handles 180,000 TEUs/year; automated handling of double-stack container rakes and automotive wagon racks.",
            "inspection_disclosure": "Statutory safety audits by Western Railway Operating Division and Customs Department for international EXIM clearance.",
            "coordinates": [72.3380, 22.9820]
        },
        {
            "id": "GJ-TRM-002",
            "name": "CONCOR ICD Sabarmati (Khodiyar Freight Terminal)",
            "alternate_name": "Khodiyar Container Terminal",
            "asset_category": "freight_terminal",
            "bridge_type": "Inland Container Depot & EXIM Rail Hub",
            "superstructure": "Bonded Customs Warehouses & High-Capacity Gantry Crane Rail Tracks",
            "substructure": "Heavy Duty Industrial Flooring and Rail Spurs",
            "waterway_crossed": "Western Railway Mainline Rail Siding",
            "feature_crossed_id": "western_rail_main",
            "supporting_corridor": "Western Railway Broad Gauge & SG Highway / SP Ring Road",
            "supporting_corridor_id": "WR_MAIN_LINE",
            "district": "Gandhinagar",
            "location_desc": "Khodiyar railway station hub connecting Ahmedabad-Gandhinagar EXIM cargo to Mundra & Pipavav ports",
            "length_m": 1500,
            "max_span_m": 0,
            "deck_width_m": 0,
            "lane_count": 8,
            "pedestrian_walkway": "Industrial safety access paths",
            "commissioning_year": 1995,
            "commissioning_date": "1995-04-12",
            "responsible_authority": "Container Corporation of India (CONCOR)",
            "design_consultant": "CONCOR / Western Railway",
            "cost_inr_crore": 120,
            "navigation_clearance_m": 0,
            "traffic_disclosure": "Largest container dry port in North Gujarat handling over 240,000 TEUs annually.",
            "inspection_disclosure": "Quarterly railway track geometry car inspection on internal sidings; fire and customs certification valid.",
            "coordinates": [72.5680, 23.1850]
        },
        {
            "id": "GJ-TRM-003",
            "name": "CONCOR ICD Ankleshwar",
            "alternate_name": "Ankleshwar Chemical Belt Container Hub",
            "asset_category": "freight_terminal",
            "bridge_type": "Chemical Container Depot & Rail Siding",
            "superstructure": "Hazardous Material Segregated Stacking Yards and Dedicated Tank Container Cleaning Bays",
            "substructure": "Impervious Chemical-Resistant Polymer Concrete Pavement",
            "waterway_crossed": "Western Railway Trunk Line Siding",
            "feature_crossed_id": "western_rail_main",
            "supporting_corridor": "NH 48 & Western Railway Main Line",
            "supporting_corridor_id": "NH 48",
            "district": "Bharuch",
            "location_desc": "Servicing Asia's largest chemical industrial cluster at Ankleshwar-Panoli",
            "length_m": 850,
            "max_span_m": 0,
            "deck_width_m": 0,
            "lane_count": 4,
            "pedestrian_walkway": "Industrial safety passages",
            "commissioning_year": 2005,
            "commissioning_date": "2005-09-18",
            "responsible_authority": "Container Corporation of India (CONCOR)",
            "design_consultant": "CONCOR",
            "cost_inr_crore": 95,
            "navigation_clearance_m": 0,
            "traffic_disclosure": "Specialized ISO tank container freight terminal handling 95,000 TEUs/year.",
            "inspection_disclosure": "GPCB environmental compliance certification and Chief Controller of Explosives (PESO) statutory safety licenses current.",
            "coordinates": [73.0150, 21.6320]
        },
        {
            "id": "GJ-TRM-004",
            "name": "DP World Hazira Multi-Modal Logistics Park (MMLP)",
            "alternate_name": "Hazira Port Logistics Park",
            "asset_category": "freight_terminal",
            "bridge_type": "Port-Linked CFS & Intermodal Freight Hub",
            "superstructure": "Temperature-Controlled Pharmaceutical Warehousing & Container Freight Station",
            "substructure": "Heavy Industrial Deep Piled Foundations",
            "waterway_crossed": "Hazira Port Dedicated Rail Siding",
            "feature_crossed_id": "hazira_port_rail",
            "supporting_corridor": "Hazira Port Access Road & Surat-Hazira Highway",
            "supporting_corridor_id": "HAZIRA_CORRIDOR",
            "district": "Surat",
            "location_desc": "In direct proximity to Adani Hazira Port and AM/NS Steel Plant",
            "length_m": 900,
            "max_span_m": 0,
            "deck_width_m": 0,
            "lane_count": 4,
            "pedestrian_walkway": "Facility pathways",
            "commissioning_year": 2016,
            "commissioning_date": "2016-03-22",
            "responsible_authority": "DP World / Gujarat Maritime Board",
            "design_consultant": "DP World Logistics Engineering",
            "cost_inr_crore": 210,
            "navigation_clearance_m": 0,
            "traffic_disclosure": "Integrated logistics node with customs clearance capacity of 120,000 TEUs/year.",
            "inspection_disclosure": "Private logistics facility audited per ISO 9001 and ISO 14001 standards; customs bond renewed annually.",
            "coordinates": [72.6750, 21.1150]
        },
        {
            "id": "GJ-TRM-005",
            "name": "Pipavav Railway Corporation Terminal (PRCL Rail Yard)",
            "alternate_name": "Pipavav Dedicated Freight Rail Yard",
            "asset_category": "freight_terminal",
            "bridge_type": "Port-Rail Siding & Double-Stack Interchange Yard",
            "superstructure": "Electrified 25 kV AC Broad Gauge Yard Tracks and Direct Ship-to-Rail Gantry Cranes",
            "substructure": "Reinforced Coastal Marine Embankment with Geotextile Liners",
            "waterway_crossed": "PRCL Broad Gauge Line to Surendranagar",
            "feature_crossed_id": "prcl_line",
            "supporting_corridor": "271 km PRCL Railway Line & NH 51",
            "supporting_corridor_id": "NH 51",
            "district": "Amreli",
            "location_desc": "Terminal rail yard of APM Terminals Pipavav connecting to North India container grid",
            "length_m": 1600,
            "max_span_m": 0,
            "deck_width_m": 0,
            "lane_count": 8,
            "pedestrian_walkway": "Rail yard inspection catwalks",
            "commissioning_year": 2003,
            "commissioning_date": "2003-05-20",
            "responsible_authority": "Pipavav Railway Corporation Limited (PRCL) / Indian Railways",
            "design_consultant": "Indian Railways / APM Terminals",
            "cost_inr_crore": 315,
            "navigation_clearance_m": 0,
            "traffic_disclosure": "First private port-railway JV in India; operates double-stack container trains carrying >500,000 TEUs annually.",
            "inspection_disclosure": "Annual statutory safety inspection by Commissioner of Railway Safety (Western Circle).",
            "coordinates": [71.5050, 20.9120]
        },
        {
            "id": "GJ-TRM-006",
            "name": "Mundra Port Rail Yard & Marshaling Terminal (MDIPL)",
            "alternate_name": "Mundra Port Railway Siding Yard",
            "asset_category": "freight_terminal",
            "bridge_type": "World-Class Port Marshaling Yard & Rail Freight Head",
            "superstructure": "14 Dedicated Broad Gauge Electrified Tracks with Automated Rapid Loading Silos (Coal/Fertilizer)",
            "substructure": "Marine Soil Stabilized Subgrade with Stone Columns and PQC Stacking Aprons",
            "waterway_crossed": "Dedicated 64 km Adipur-Mundra Port Private Rail Line",
            "feature_crossed_id": "adipur_mundra_line",
            "supporting_corridor": "Adipur-Mundra Rail Corridor connecting to Western DFC & NH 41",
            "supporting_corridor_id": "NH 41",
            "district": "Kutch",
            "location_desc": "India's largest commercial port rail yard at APSEZ Mundra",
            "length_m": 2200,
            "max_span_m": 0,
            "deck_width_m": 0,
            "lane_count": 14,
            "pedestrian_walkway": "Yard pathways with high-mast lighting",
            "commissioning_year": 2001,
            "commissioning_date": "2001-07-10",
            "responsible_authority": "Adani Ports and Special Economic Zone (APSEZ) / Indian Railways",
            "design_consultant": "Adani Infra / Western Railway",
            "cost_inr_crore": 480,
            "navigation_clearance_m": 0,
            "traffic_disclosure": "Handles over 30 train rakes daily; direct double-stack container connectivity to NCR and Northern India via WDFC.",
            "inspection_disclosure": "Quarterly permanent way track geometry audit by Western Railway engineers; automatic weighbridges certified annually.",
            "coordinates": [69.7120, 22.7550]
        }
    ]

    features = []
    for s in structures:
        feat = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": s["coordinates"]
            },
            "properties": {k: v for k, v in s.items() if k != "coordinates"}
        }
        features.append(feat)

    output_path = "data/gujarat_transport_structures.geojson"
    fc = {
        "type": "FeatureCollection",
        "name": "gujarat_transport_structures",
        "crs": {
            "type": "name",
            "properties": {
                "name": "urn:ogc:def:crs:OGC:1.3:CRS84"
            }
        },
        "features": features
    }

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(fc, f, indent=2, ensure_ascii=False)

    print(f"  [OK] Saved {len(features)} transport structures to {output_path} ({os.path.getsize(output_path)/1024:.1f} KB)")
    return len(features)

def enrich_roads_layer():
    print("Enriching data/gujarat_roads.geojson with civil engineering metadata...")
    roads_path = "data/gujarat_roads.geojson"
    with open(roads_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Dictionary of known bridges mapped to corridor IDs
    bridge_corridor_map = {
        "NH 48": ["GJ-BRG-002", "GJ-BRG-010", "GJ-BRG-011", "GJ-TUN-002", "GJ-TRM-003"],
        "NH 51": ["GJ-BRG-001", "GJ-BRG-013", "GJ-TRM-005"],
        "NH 27": ["GJ-BRG-012", "GJ-BRG-014"],
        "NH 147": ["GJ-FLY-001", "GJ-BRG-009"],
        "NH 147A": ["GJ-FLY-005"],
        "NH 41": ["GJ-TRM-006"]
    }

    for feat in data["features"]:
        props = feat["properties"]
        corridor = props.get("corridor", "")
        cat = props.get("category", "")
        
        # Classification
        if cat == "expressway":
            props["road_classification"] = "National Expressway (Controlled Access)"
            props["surface_type"] = "Rigid Pavement Concrete (PQC / DLC)"
            props["lane_count"] = 6
            props["project_details"] = "Bharatmala Pariyojana / High-Speed Golden Corridor"
            props["responsible_authority"] = "National Highways Authority of India (NHAI)"
        elif cat == "golden_quadrilateral":
            props["road_classification"] = "Golden Quadrilateral Trunk Corridor"
            props["surface_type"] = "Dense Bituminous Macadam (DBM) with Asphalt Concrete (BC)"
            props["lane_count"] = 6
            props["project_details"] = "National Highways Development Project (NHDP Phase I & V)"
            props["responsible_authority"] = "National Highways Authority of India (NHAI)"
        elif cat == "arterial_corridor":
            props["road_classification"] = "Primary National Highway Corridor"
            props["surface_type"] = "Bituminous Asphalt (Flexible Pavement)"
            props["lane_count"] = 4
            props["project_details"] = "Bharatmala Pariyojana Economic Corridor (East-West & Port Connectivity)"
            props["responsible_authority"] = "National Highways Authority of India (NHAI)"
        elif cat == "feeder_highway":
            props["road_classification"] = "Inter-District Feeder National Highway"
            props["surface_type"] = "Bituminous Asphalt / Surface Dressing"
            props["lane_count"] = 2
            props["project_details"] = "MoRTH National Highway Widening Program"
            props["responsible_authority"] = "Ministry of Road Transport and Highways (MoRTH) / Gujarat R&B"
        else:
            props["road_classification"] = "National Highway"
            props["surface_type"] = "Bituminous Asphalt"
            props["lane_count"] = 4
            props["project_details"] = "National Highway Network Upgrade"
            props["responsible_authority"] = "NHAI / MoRTH"

        # Attached bridge IDs
        props["connected_bridge_ids"] = bridge_corridor_map.get(corridor, [])

    with open(roads_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"  [OK] Enriched {len(data['features'])} road corridors in {roads_path}")

def enrich_urban_logistics():
    print("Enriching data/gujarat_urban_industry.geojson ports & airports with transport links...")
    urban_path = "data/gujarat_urban_industry.geojson"
    with open(urban_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Port connectivity
    port_connectivity = {
        "GJ-LOG-PORT-001": { # Deendayal Port (Kandla)
            "highway_connectivity": "NH 41 (Kandla–Gandhidham–Ahmedabad) & NH 27",
            "rail_connectivity": "Western Railway Gandhidham Division + Western Dedicated Freight Corridor (WDFC) feeder link",
            "freight_facilities": "16 Berths, 6 Oil Jetties, 137 MMT Capacity, Liquid Chemical Terminal",
            "connected_structures": ["GJ-TRM-006"]
        },
        "GJ-LOG-PORT-002": { # Mundra Port
            "highway_connectivity": "NH 41 & 4-lane State Coastal Access Highway",
            "rail_connectivity": "64 km Private Port Railway to Adipur + Western Dedicated Freight Corridor (WDFC)",
            "freight_facilities": "28 Berths, 4 Container Terminals, 2 Single Point Moorings (SPM), 260 MMT Capacity",
            "connected_structures": ["GJ-TRM-006"]
        },
        "GJ-LOG-PORT-003": { # Pipavav Port
            "highway_connectivity": "NH 51 (Coastal National Highway)",
            "rail_connectivity": "271 km Pipavav Railway Corporation Ltd (PRCL) broad gauge line to Surendranagar",
            "freight_facilities": "5 Berths, Double-Stack Container Depot, 20 MMT Capacity",
            "connected_structures": ["GJ-TRM-005", "GJ-BRG-013"]
        },
        "GJ-LOG-PORT-004": { # Dahej Port
            "highway_connectivity": "Bharuch-Dahej 6-lane Expressway / SH 6",
            "rail_connectivity": "Bharuch-Dahej Broad Gauge Line (Western Railway)",
            "freight_facilities": "Petronet LNG Terminal, Chemical Solid Cargo Port, 45 MMT Capacity",
            "connected_structures": ["GJ-TRM-003", "GJ-BRG-002"]
        },
        "GJ-LOG-PORT-005": { # Hazira Port
            "highway_connectivity": "Surat-Hazira 6-lane Port Expressway / NH 53",
            "rail_connectivity": "Surat-Hazira Port Rail Corridor",
            "freight_facilities": "7 Berths, Shell LNG Terminal, Adani Container Terminal, 50 MMT Capacity",
            "connected_structures": ["GJ-TRM-004", "GJ-FLY-003", "GJ-BRG-005"]
        },
        "GJ-LOG-PORT-006": { # Sikka Marine Terminal
            "highway_connectivity": "NH 27 / Jamnagar-Bediswar Road",
            "rail_connectivity": "Jamnagar-Kanalus Broad Gauge Line",
            "freight_facilities": "Single Point Mooring (SPM) for VLCC Crude Carriers (Reliance Jamnagar Refinery)",
            "connected_structures": []
        },
        "GJ-LOG-PORT-007": { # Porbandar Port
            "highway_connectivity": "NH 27 (Western Terminus of East-West Corridor)",
            "rail_connectivity": "Porbandar Railway Station / Bhavnagar Division",
            "freight_facilities": "All-Weather Direct Berthing Port, 5 MMT Capacity",
            "connected_structures": ["GJ-BRG-012"]
        },
        "GJ-LOG-PORT-008": { # Bhavnagar Port
            "highway_connectivity": "NH 51 & Bhavnagar-Ahmedabad Short Route Highway",
            "rail_connectivity": "Western Railway Bhavnagar Division",
            "freight_facilities": "Historic Tidal Lock Gate Port, 8 MMT Capacity",
            "connected_structures": ["GJ-BRG-013"]
        }
    }

    # Airport connectivity
    airport_connectivity = {
        "GJ-LOG-AIR-001": { # SVPIA Ahmedabad
            "highway_connectivity": "Airport Road, Sardar Patel Ring Road, 132ft Ring Road",
            "public_transit_connectivity": "Ahmedabad Metro Phase 2 (under development) & AMTS Airport Express",
            "runway_specifications": "Runway 05/23: 3,505 m × 45 m (Code 4E CAT I ILS, widebody capable)",
            "passenger_traffic_fy24": "11.6 Million Passengers (Audited FY 2023-24)",
            "connected_structures": ["GJ-BRG-006", "GJ-BRG-009"]
        },
        "GJ-LOG-AIR-002": { # Surat Airport
            "highway_connectivity": "Surat-Dumas Road, Surat BRTS Airport Line",
            "public_transit_connectivity": "Surat City Bus & Metro Phase 1 connection planned",
            "runway_specifications": "Runway 04/22: 2,905 m × 45 m (CAT I ILS)",
            "passenger_traffic_fy24": "1.3 Million Passengers (Audited FY 2023-24)",
            "connected_structures": ["GJ-BRG-005", "GJ-FLY-003"]
        },
        "GJ-LOG-AIR-003": { # Vadodara Airport
            "highway_connectivity": "Harni Road, VIP Road, Golden Quadrilateral NH 48 (5 km)",
            "public_transit_connectivity": "VMC City Bus Services",
            "runway_specifications": "Runway 04/22: 2,469 m × 45 m",
            "passenger_traffic_fy24": "1.1 Million Passengers (Audited FY 2023-24)",
            "connected_structures": ["GJ-FLY-002", "GJ-BRG-010"]
        },
        "GJ-LOG-AIR-004": { # Rajkot Hirasar
            "highway_connectivity": "NH 27 (Rajkot-Ahmedabad Highway, 6-lane access corridor)",
            "public_transit_connectivity": "RMC Direct Airport Shuttle & Regional GSRTC",
            "runway_specifications": "Runway 05/23: 3,040 m × 45 m (Greenfield International Airport)",
            "passenger_traffic_fy24": "0.9 Million Passengers (Inaugural Year FY 2023-24)",
            "connected_structures": ["GJ-FLY-004", "GJ-BRG-012"]
        },
        "GJ-LOG-AIR-005": { # Bhuj
            "highway_connectivity": "Bhuj-Mirzapar Road, NH 41 Link",
            "public_transit_connectivity": "GSRTC Kutch Transit",
            "runway_specifications": "Runway 05/23: 2,501 m × 45 m (Civil Enclave / IAF)",
            "passenger_traffic_fy24": "0.3 Million Passengers",
            "connected_structures": []
        },
        "GJ-LOG-AIR-006": { # Jamnagar
            "highway_connectivity": "NH 27 / Airport Road",
            "public_transit_connectivity": "City Transit",
            "runway_specifications": "Runway 06/24: 2,512 m × 45 m (Civil Enclave / IAF)",
            "passenger_traffic_fy24": "0.25 Million Passengers",
            "connected_structures": []
        },
        "GJ-LOG-AIR-007": { # Bhavnagar
            "highway_connectivity": "Airport Road / NH 51 link",
            "public_transit_connectivity": "City Bus Transit",
            "runway_specifications": "Runway 07/25: 1,920 m × 45 m",
            "passenger_traffic_fy24": "0.15 Million Passengers",
            "connected_structures": ["GJ-BRG-013"]
        }
    }

    for feat in data["features"]:
        fid = feat["properties"].get("id")
        if fid in port_connectivity:
            feat["properties"].update(port_connectivity[fid])
        elif fid in airport_connectivity:
            feat["properties"].update(airport_connectivity[fid])

    with open(urban_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"  [OK] Enriched ports and airports in {urban_path}")

if __name__ == "__main__":
    build_transport_structures()
    enrich_roads_layer()
    enrich_urban_logistics()
    print("Transport network compilation completed successfully!")
