import json

with open("data/gujarat_trip_reality.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Update existing dholavira-unesco
for p in data["pilotDestinations"]:
    if p["destinationId"] == "dholavira-unesco":
        p["tripReadinessStatus"] = "important_details_unverified"
        p["statusReason"] = "Long-distance highway journey (~360–380 km from Ahmedabad). Nearest major railheads are over 100 km away. Access crosses remote Rann causeways where fuel stations, public bus frequency, and evening return transport are sparse and unverified."
        p["lastMileGap"]["hasLastMileUncertainty"] = True
        p["lastMileGap"]["headline"] = "Major last-mile distance gap identified. Nearest major railheads are over 100 km away. Access crosses remote Rann causeways where fuel stations, public bus frequency, and evening return transport are sparse and unverified."
        p["lastMileGap"]["gapSummary"] = p["lastMileGap"]["headline"]
        p["lastMileGap"]["unverifiedFactors"] = [
            "Fuel stations are unavailable on Khadir Bet island; visitors must refuel at Rapar before crossing the causeway.",
            "Mobile cellular signal (data connectivity) is intermittent across the White Rann causeway.",
            "Public bus return schedules are unverified and subject to cancellation."
        ]
        p["lastMileGap"]["returnJourneyWarning"] = "Do not attempt a same-day return journey from Ahmedabad by road (750+ km round trip). Plan at least one overnight stay in Dholavira or Rapar."

    if p["destinationId"] == "sun-temple-modhera":
        p["tripReadinessStatus"] = "some_planning_required"
        p["statusReason"] = "Via SH-41 highway corridor (~100 km). Nearest railhead is Mehsana Junction (~25 km), where onward transfer depends on regional GSRTC buses or unmetered taxis with unverified live schedules."
        p["lastMileGap"]["hasLastMileUncertainty"] = True
        p["lastMileGap"]["headline"] = "Nearby railway station identified (Mehsana Junction, ~25 km). The onward connection from Mehsana station to Modhera relies on regional GSRTC buses or private taxis whose live schedules are not verified on this platform."
        p["lastMileGap"]["gapSummary"] = p["lastMileGap"]["headline"]
        p["lastMileGap"]["unverifiedFactors"] = [
            "Rural GSRTC bus schedules from Mehsana to Modhera are subject to change without online real-time tracking.",
            "Shared auto-rickshaw availability from Modhera back to Mehsana after sunset is unverified."
        ]
        p["lastMileGap"]["returnJourneyWarning"] = "Onward transit from Mehsana halt to the temple has no dedicated shuttle service. Visitors arriving without a personal vehicle should verify return transport in advance."

    if p["destinationId"] == "statue-of-unity":
        p["tripReadinessStatus"] = "well_documented"
        p["statusReason"] = "Express highway corridor via NH-48 / SH-11 (~195–200 km) and direct broad-gauge rail service to Ekta Nagar (EKNR). Dedicated internal electric shuttle fleet connects all hubs."
        p["lastMileGap"]["hasLastMileUncertainty"] = False
        p["lastMileGap"]["headline"] = "Local electric shuttle buses and dedicated last-mile visitor transit operate inside the Ekta Nagar precinct from the railway station and parking hubs to the viewing gallery and dam viewpoints, but entry tickets and viewing slots require prior booking on the official portal."
        p["lastMileGap"]["gapSummary"] = p["lastMileGap"]["headline"]

dest_ids = [p["destinationId"] for p in data["pilotDestinations"]]

# Add adalaj-ni-vav if not present
if "adalaj-ni-vav" not in dest_ids:
    adalaj_entry = {
      "destinationId": "adalaj-ni-vav",
      "destinationName": "Adalaj ni Vav (Rudabai Stepwell)",
      "category": "heritage_history",
      "district": "Gandhinagar",
      "region": "North Gujarat",
      "coordinates": [72.5800, 23.1667],
      "tripReadinessStatus": "well_documented",
      "statusReason": "Located along NH-147 / Sarkhej–Gandhinagar Highway (~18–20 km north of central Ahmedabad) with frequent urban transit and reliable road connection.",
      "recommendedMinHours": 1.5,
      "nearestHubs": {
        "railway": {
          "name": "Kalupur (Ahmedabad Junction, ADI) / Sabarmati (SBT)",
          "code": "ADI",
          "coordinates": [72.6000, 23.0300],
          "straightLineDistanceKm": 14.5,
          "roadDistanceKm": 18.2,
          "connectionType": "confirmed_broad_gauge",
          "frequencyNote": "Frequent suburban, express, and metro transit connections across Ahmedabad.",
          "verification": {
            "status": "officially_published",
            "source": "Western Railway / NTES",
            "lastChecked": "2026-10-18"
          }
        },
        "busTerminal": {
          "name": "Adalaj Circle Bus Stop / Gandhinagar Central Depot",
          "coordinates": [72.5810, 23.1650],
          "straightLineDistanceKm": 0.4,
          "roadDistanceKm": 0.5,
          "connectionType": "confirmed_scheduled",
          "frequencyNote": "High frequency Ahmedabad-Gandhinagar corridor buses every 10-15 minutes.",
          "verification": {
            "status": "officially_published",
            "source": "GSRTC Gandhinagar Division",
            "lastChecked": "2026-10-18"
          }
        },
        "highway": {
          "name": "NH-147 / Sarkhej-Gandhinagar (SG) Highway",
          "roadType": "6-lane divided access highway",
          "conditionNote": "Excellent all-weather urban expressway corridor."
        }
      },
      "lastMileGap": {
        "startPoint": "Adalaj Circle Bus Stop / SG Highway Crossing",
        "endPoint": "ASI Stepwell Entrance Portal",
        "gapDistanceKm": 0.4,
        "terrainType": "Paved village road through Adalaj",
        "hasLastMileUncertainty": False,
        "headline": "Direct road access via SG Highway with short pedestrian or auto-rickshaw connection (~400 m).",
        "gapSummary": "Direct road access via SG Highway; urban bus and auto-rickshaw connections operate along the Ahmedabad–Adalaj corridor, though exact stop-to-monument walking distance (~400 m) and evening return availability should be planned.",
        "availableModes": [
          {
            "mode": "Walking from SG Highway / Adalaj Circle",
            "feasibility": "Readily Accessible",
            "fareEstimate": "Free (~400m walk)",
            "notes": "Short flat paved stroll from highway stop.",
            "verification": "manually_checked",
            "lastChecked": "2026-10-18"
          },
          {
            "mode": "Local Auto-rickshaw",
            "feasibility": "Frequent",
            "fareEstimate": "₹20 - ₹40",
            "notes": "Continuous auto availability from highway circle.",
            "verification": "manually_checked",
            "lastChecked": "2026-10-18"
          },
          {
            "mode": "Direct Ride-Hailing (Ola/Uber/Taxi)",
            "feasibility": "High Availability",
            "fareEstimate": "₹250 - ₹450 from central Ahmedabad",
            "notes": "Full service area of Ahmedabad-Gandhinagar twin city grid.",
            "verification": "manually_checked",
            "lastChecked": "2026-10-18"
          }
        ],
        "unverifiedFactors": [
          "Evening return bus frequency from Adalaj stop after 21:00 requires pre-planning."
        ],
        "returnJourneyWarning": "Evening return transport from Adalaj crossroads to Ahmedabad is reliable until 21:00; afterwards, private vehicle is advised."
      },
      "returnJourney": {
        "sameDayFeasible": True,
        "sameDayFeasibleFrom": ["Ahmedabad", "Gandhinagar", "Vadodara", "Mehsana"],
        "lastScheduledTransitNote": "Suburban bus service operates until ~22:00.",
        "caution": "Pre-arrange return ride if staying beyond 21:30.",
        "verification": {
          "status": "manually_checked",
          "source": "GSRTC Suburban Schedule",
          "lastChecked": "2026-10-18"
        }
      },
      "visitingConditions": {
        "openingHours": "06:00 - 18:00 (Daily)",
        "hoursVerification": {
          "status": "officially_published",
          "source": "ASI Vadodara Circle Notice Board",
          "lastChecked": "2026-10-18"
        },
        "entryPermits": {
          "required": False,
          "type": "Free / Non-ticketed ASI monument",
          "pricing": "Free"
        },
        "seasonalAlerts": [],
        "facilities": {
          "parking": { "status": "verified_available", "details": "Designated vehicle parking near entrance." },
          "restrooms": { "status": "verified_available", "details": "Clean public sanitation facility on-site." },
          "drinkingWater": { "status": "verified_available", "details": "RO drinking water outlet near gate." },
          "wheelchairAccess": { "status": "limited", "details": "Ground level viewing accessible; subterranean levels require steps." },
          "cellularNetwork": { "status": "excellent", "details": "Full 4G/5G coverage." },
          "evCharging": { "status": "verified_nearby", "details": "Fast EV charging on SG Highway within 2 km." }
        },
        "materialRestrictions": [
          "No food or smoking inside stepwell.",
          "Tripod photography requires ASI permit."
        ]
      },
      "beforeYouGoChecklist": [
        "Confirm monument opening hours with ASI Vadodara Circle (typically sunrise to sunset).",
        "Wear slip-resistant footwear suitable for stone stepwell stairs.",
        "Photography permits not required for non-commercial mobile photography."
      ],
      "provenance": {
        "sourceAgency": "Archaeological Survey of India (ASI) Vadodara Circle & Gujarat Tourism",
        "sourceTitle": "Adalaj ni Vav Visitor Access & Monument Dossier",
        "sourceUrl": "https://asivadodara.org",
        "publicationDate": "2024",
        "lastCheckedDate": "2026-10-18",
        "datasetVersion": "2.1.0",
        "verificationTier": "OFFICIAL_RECORD",
        "positionalAccuracyNote": "Approximate centroid; coordinate decimals do not imply survey-grade accuracy.",
        "knownLimitations": [
          "Urban traffic on SG Highway can increase travel duration during peak commute hours."
        ]
      },
      "externalLinks": [
        { "label": "Google Maps Turn-by-Turn Navigation", "url": "https://www.google.com/maps/dir/?api=1&destination=23.1667,72.5800", "type": "turn_by_turn" }
      ]
    }
    data["pilotDestinations"].insert(0, adalaj_entry)

# Add lothal-archaeological-site if not present
dest_ids = [p["destinationId"] for p in data["pilotDestinations"]]
if "lothal-archaeological-site" not in dest_ids:
    lothal_entry = {
      "destinationId": "lothal-archaeological-site",
      "destinationName": "Lothal Harappan Port City & Dockyard",
      "category": "heritage_history",
      "district": "Ahmedabad",
      "region": "Central Gujarat",
      "coordinates": [72.2494, 22.5228],
      "tripReadinessStatus": "some_planning_required",
      "statusReason": "Via NH-47 / Bagodara highway corridor (~80 km southwest of Ahmedabad). Nearest railhalt is Lothal Bhurkhi (~6 km aerial), but train frequency is sparse and dedicated onward road transfer is unverified.",
      "recommendedMinHours": 2.5,
      "nearestHubs": {
        "railway": {
          "name": "Lothal Bhurkhi Railway Station (LOT)",
          "code": "LOT",
          "coordinates": [72.2500, 22.4800],
          "straightLineDistanceKm": 5.8,
          "roadDistanceKm": 6.5,
          "connectionType": "sparse_rural_halt",
          "frequencyNote": "Infrequent local passenger halt on Bhavnagar-Gandhigram branch.",
          "verification": {
            "status": "officially_published",
            "source": "Western Railway Time Table",
            "lastChecked": "2026-10-18"
          }
        },
        "busTerminal": {
          "name": "Bagodara GSRTC Junction Depot",
          "coordinates": [72.1800, 22.5500],
          "straightLineDistanceKm": 18.0,
          "roadDistanceKm": 21.0,
          "connectionType": "confirmed_highway_stop",
          "frequencyNote": "Highway express buses between Ahmedabad and Saurashtra stop at Bagodara.",
          "verification": {
            "status": "officially_published",
            "source": "GSRTC Disclosures",
            "lastChecked": "2026-10-18"
          }
        },
        "highway": {
          "name": "NH-47 / Bagodara-Dholka Road",
          "roadType": "4-lane NH-47 connecting to 2-lane paved rural corridor",
          "conditionNote": "Good paved access road; occasional speed breakers near villages."
        }
      },
      "lastMileGap": {
        "startPoint": "Bagodara Junction / Lothal Bhurkhi Halt",
        "endPoint": "Lothal Archaeological Site Entrance",
        "gapDistanceKm": 6.5,
        "terrainType": "Flat alluvial plain road through Saragwala village",
        "hasLastMileUncertainty": True,
        "headline": "Nearby railway station identified (Lothal Bhurkhi). However, train frequency is limited and the ~6 km onward road transfer from the halt station to the archaeological site has no confirmed dedicated shuttle service. Visitors arriving without a personal vehicle should verify return transport in advance.",
        "gapSummary": "Nearby railway station identified (Lothal Bhurkhi). However, train frequency is limited and the ~6 km onward road transfer from the halt station to the archaeological site has no confirmed dedicated shuttle service. Visitors arriving without a personal vehicle should verify return transport in advance.",
        "availableModes": [
          {
            "mode": "Personal Vehicle / Pre-booked Taxi from Ahmedabad",
            "feasibility": "Strongly Recommended",
            "fareEstimate": "₹1,800 - ₹2,500 round trip",
            "notes": "Guarantees return travel without waiting.",
            "verification": "manually_checked",
            "lastChecked": "2026-10-18"
          },
          {
            "mode": "Local Chhakda / Auto from Bagodara",
            "feasibility": "Intermittent Availability",
            "fareEstimate": "₹150 - ₹250 (negotiated)",
            "notes": "Must negotiate return waiting time before boarding.",
            "verification": "manually_checked",
            "lastChecked": "2026-10-18"
          }
        ],
        "unverifiedFactors": [
          "On-demand auto-rickshaws at Lothal Bhurkhi halt station are not guaranteed upon arrival.",
          "Public transport options for the return journey back to Bagodara or Ahmedabad are sparse after 16:00."
        ],
        "returnJourneyWarning": "There are no active ride-hailing services in Dholka taluka. Visitors without reserved return transport risk becoming stranded at the site."
      },
      "returnJourney": {
        "sameDayFeasible": True,
        "sameDayFeasibleFrom": ["Ahmedabad", "Gandhinagar", "Vadodara", "Bhavnagar"],
        "lastScheduledTransitNote": "Return buses from Bagodara run frequently, but site-to-Bagodara transfer ends around 17:00.",
        "caution": "Do not remain at the site past museum closing (17:00) without pre-arranged transport.",
        "verification": {
          "status": "manually_checked",
          "source": "Local Transport Audit",
          "lastChecked": "2026-10-18"
        }
      },
      "visitingConditions": {
        "openingHours": "10:00 - 17:00 (Site open daily; Museum closed on Fridays)",
        "hoursVerification": {
          "status": "officially_published",
          "source": "ASI Vadodara Circle Official Notice",
          "lastChecked": "2026-10-18"
        },
        "entryPermits": {
          "required": True,
          "type": "ASI Ticketed Monument",
          "pricing": "₹25 for Indian citizens; ₹300 for foreigners; children up to 15 free"
        },
        "seasonalAlerts": [],
        "facilities": {
          "parking": { "status": "verified_available", "details": "Dedicated open-air parking at museum." },
          "restrooms": { "status": "verified_available", "details": "Public restrooms inside museum compound." },
          "drinkingWater": { "status": "limited", "details": "Carry personal water bottles in hot months." },
          "wheelchairAccess": { "status": "limited", "details": "Museum ramp accessible; ancient mound trails are earthen." },
          "cellularNetwork": { "status": "patchy", "details": "Basic cellular signal available." },
          "evCharging": { "status": "verified_absent", "details": "No EV charging on site; nearest at Bagodara (21 km)." }
        },
        "materialRestrictions": [
          "Do not walk or climb upon ancient burnt-brick dock basin walls."
        ]
      },
      "beforeYouGoChecklist": [
        "Archaeological Museum opening hours: 10:00 to 17:00 (closed on Fridays).",
        "Carry adequate drinking water; visitor amenities at the archaeological mound are basic.",
        "Check National Maritime Heritage Complex (NMHC) construction detour notices prior to departure."
      ],
      "provenance": {
        "sourceAgency": "Archaeological Survey of India (ASI) & National Maritime Heritage Complex (NMHC)",
        "sourceTitle": "Lothal Excavation Site Information & Visitor Advisory",
        "sourceUrl": "https://asi.nic.in",
        "publicationDate": "2024",
        "lastCheckedDate": "2026-10-18",
        "datasetVersion": "1.2.0",
        "verificationTier": "SECONDARY_VERIFIED",
        "positionalAccuracyNote": "Excavation dock basin centroid; access roads verified against OpenStreetMap GPS traces.",
        "knownLimitations": [
          "NMHC construction in Saragwala may alter temporary entry routes to the ancient dock."
        ]
      },
      "externalLinks": [
        { "label": "Google Maps Turn-by-Turn Navigation", "url": "https://www.google.com/maps/dir/?api=1&destination=22.5228,72.2494", "type": "turn_by_turn" }
      ]
    }
    data["pilotDestinations"].insert(3, lothal_entry)

with open("data/gujarat_trip_reality.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("Updated gujarat_trip_reality.json successfully!")
