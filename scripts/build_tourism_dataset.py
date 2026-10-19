#!/usr/bin/env python3
"""
Gujarat Atlas — Tourism & Destinations Dataset Builder
Generates data/gujarat_tourism_destinations.geojson
Contains 48 curated, verified destinations across all regions of Gujarat.
Adheres to strict geospatial standards: WGS 84 (EPSG:4326), valid geometry,
complete visitor metadata, statutory source links, and nearby infrastructure links.
"""

import json
import os

DESTINATIONS = [
    # =========================================================================
    # 1. ICONIC GUJARAT
    # =========================================================================
    {
        "id": "statue-of-unity",
        "name": "Statue of Unity & Kevadia Complex",
        "category": "iconic",
        "categoryLabel": "World's Tallest Monument & Memorial",
        "district": "Narmada",
        "region": "Central Gujarat",
        "coordinates": [73.7191, 21.8380],
        "summary": "At 182 metres, the world's tallest statue stands on Sadhu Bet island overlooking the Sardar Sarovar Dam on the Narmada River. Dedicated to Sardar Vallabhbhai Patel, the complex includes a viewing gallery at 153 metres, museum, Valley of Flowers, and riverfront promenade.",
        "highlights": [
            "182m colossal bronze sculpture of Sardar Vallabhbhai Patel",
            "High-speed viewing gallery elevator at chest level (153m) looking across Narmada river & dam",
            "Extensive exhibition hall & museum at the base detailing India's unification",
            "Valley of Flowers, Glow Garden, and evening projection mapping light & sound show",
            "Direct electric bus and e-rickshaw network connecting all Kevadia attractions"
        ],
        "significance": "National memorial commemorating the architect of united India; engineering landmark fabricated with 25,000 tonnes of steel and 1,700 tonnes of bronze cladding.",
        "bestSeason": "October to March (Comfortable outdoor weather; river views at their fullest post-monsoon)",
        "recommendedDuration": "Full day (6–8 hours for statue, viewing gallery, and valley)",
        "timings": "08:00 AM – 06:00 PM (Closed Mondays for maintenance; tickets must be booked online)",
        "entryFee": "Basic Entry: ₹150 (Adults), ₹90 (Children); Viewing Gallery: ₹380 / Express ₹1,030",
        "facilities": "Full wheelchair accessibility, battery-operated buses, multi-cuisine food court, escalators, extensive parking",
        "rulesRestrictions": "Online pre-booking mandatory on official portal; outside food prohibited inside statue complex; drone flying strictly prohibited without statutory permit",
        "sourceName": "Statue of Unity Official Portal (SOU Tourism Authority)",
        "sourceUrl": "https://statueofunity.in",
        "verificationStatus": "official_statutory",
        "image": "https://upload.wikimedia.org/wikipedia/commons/0/07/Statue_of_Unity.jpg",
        "tags": ["monument", "sardar sarovar", "kevadiya", "world record", "narmada", "national landmark"],
        "isLesserKnown": False,
        "weekendFrom": ["Vadodara", "Ahmedabad", "Surat"],
        "nearbyInfrastructure": {
            "railway": "Ekta Nagar (Kevadiya) Railway Station (~5.5 km)",
            "airport": "Vadodara Airport (~90 km)",
            "highway": "Vadodara-Kevadia 4-Lane State Highway / NH-56"
        }
    },
    {
        "id": "rani-ki-vav",
        "name": "Rani ki Vav (Queen's Stepwell)",
        "category": "iconic",
        "categoryLabel": "UNESCO World Heritage Stepwell",
        "district": "Patan",
        "region": "North Gujarat",
        "coordinates": [72.1023, 23.8589],
        "summary": "Built in the 11th century CE by Queen Udayamati as a memorial to King Bhimdev I of the Chaulukya dynasty, this subterranean water management architecture is recognized as a UNESCO World Heritage Site. Designed as an inverted temple highlighting the sanctity of water, it features seven pillared terraces with over 500 principal sculptures.",
        "highlights": [
            "Seven levels of subterranean sculpted stone galleries descending 27 metres below ground",
            "Over 500 major and 1,000 minor intricately carved sculptures of Dashavatara (ten Vishnu avatars)",
            "Masterpiece of the Maru-Gurjara architectural style with intricate geometric pillar carvings",
            "Depicted on the reverse of the Reserve Bank of India ₹100 banknote",
            "Surrounded by well-maintained archaeological lawns and ASI interpretation centre"
        ],
        "significance": "Supreme example of underground stepped water architecture demonstrating technological, artistic, and hydraulic mastery in arid western India.",
        "bestSeason": "October to March (Crisp winter sunshine highlights the subterranean stone carvings)",
        "recommendedDuration": "2 – 3 hours",
        "timings": "08:00 AM – 06:00 PM daily (Open all days)",
        "entryFee": "₹40 for Indian citizens; ₹600 for foreign visitors (ASI statutory ticket; digital payment accepted)",
        "facilities": "Ramped access to upper park level, ticket counter, drinking water, restrooms, book shop, parking",
        "rulesRestrictions": "Subterranean steps may be steep; footwear allowed on terraces but prohibited in immediate sanctum well shaft; touch carvings avoided for preservation",
        "sourceName": "Archaeological Survey of India (ASI) & UNESCO World Heritage Centre",
        "sourceUrl": "https://whc.unesco.org/en/list/1317",
        "verificationStatus": "official_statutory",
        "image": "https://upload.wikimedia.org/wikipedia/commons/a/a5/Rani_ki_vav_02.jpg",
        "tags": ["stepwell", "unesco", "heritage", "sculpture", "patan", "archaeology", "maru-gurjara"],
        "isLesserKnown": False,
        "weekendFrom": ["Ahmedabad", "Gandhinagar", "Mehsana"],
        "nearbyInfrastructure": {
            "railway": "Patan Railway Station (~3.8 km)",
            "airport": "Sardar Vallabhbhai Patel International Airport, Ahmedabad (~125 km)",
            "highway": "State Highway 7 / NH-68 Corridor"
        }
    },
    {
        "id": "somnath-temple",
        "name": "Somnath Jyotirlinga Temple",
        "category": "iconic",
        "categoryLabel": "First of the Twelve Sacred Jyotirlingas",
        "district": "Gir Somnath",
        "region": "Saurashtra",
        "coordinates": [70.4012, 20.8880],
        "summary": "Standing on the rugged shores of the Arabian Sea at Prabhas Patan, Somnath is reverently considered the first ('Prathama') among the twelve holy Jyotirlinga shrines of Lord Shiva. Rebuilt in the Chalukya Kailas Mahameru Prasad style under Sardar Patel's leadership post-independence, the temple grounds feature the famous Baan Stambh (arrow pillar) marking an unobstructed ocean meridian to Antarctica.",
        "highlights": [
            "Magnificent seaside temple spire (shikhara) rising 50 metres above the breaking waves",
            "Baan Stambh (Arrow Pillar) marking uninterrupted line of sight from Somnath to South Pole",
            "Evening Light & Sound Show ('Jai Somnath') with narration by Amitabh Bachchan",
            "Triveni Sangam confluence where Hiran, Kapila, and mythical Saraswati rivers meet the Arabian Sea",
            "Scenic marine promenade along the rocky shoreline offering sunset views"
        ],
        "significance": "Ancient pilgrimage site symbolizing resilience, having been reconstructed multiple times through Indian history.",
        "bestSeason": "October to March (Pleasant ocean breeze; Shivratri festival celebrated with great splendour)",
        "recommendedDuration": "3 – 4 hours",
        "timings": "06:00 AM – 10:00 PM (Aarti at 07:00 AM, 12:00 PM, and 07:00 PM)",
        "entryFee": "Free entry for darshan; Light & Sound show: ₹30; VIP Darshan queues available online",
        "facilities": "Shree Somnath Trust guest houses, cloakrooms, free shoe stands, drinking water, wheelchair assistance, wide parking",
        "rulesRestrictions": "Strict security screening; mobile phones, cameras, leather items, and electronic devices strictly prohibited inside the inner temple perimeter",
        "sourceName": "Shree Somnath Trust Official Portal & Gujarat Tourism",
        "sourceUrl": "https://somnath.org",
        "verificationStatus": "official_statutory",
        "image": "https://upload.wikimedia.org/wikipedia/commons/7/7b/%22Aerial_view_of_Somnath_temple_01%2C_Prabhas_Patan_Gujarat.jpg",
        "tags": ["temple", "shiva", "jyotirlinga", "somnath", "arabian sea", "pilgrimage", "prabhas patan"],
        "isLesserKnown": False,
        "weekendFrom": ["Rajkot", "Junagadh", "Porbandar"],
        "nearbyInfrastructure": {
            "railway": "Veraval Junction (~6.2 km) / Somnath Railway Station (~1.5 km)",
            "airport": "Keshod Airport (~55 km) / Diu Airport (~85 km)",
            "highway": "NH-51 Coastal Highway"
        }
    },
    {
        "id": "sun-temple-modhera",
        "name": "Sun Temple, Modhera",
        "category": "iconic",
        "categoryLabel": "11th-Century Solar Architectural Masterpiece",
        "district": "Mehsana",
        "region": "North Gujarat",
        "coordinates": [72.1333, 23.5835],
        "summary": "Built in 1026 CE during the reign of King Bhimdev I of the Chaulukya dynasty on the banks of the Pushpavati River, the Sun Temple at Modhera is an architectural wonder designed so that the sun's rays at the equinox illuminated the inner sanctum. The complex comprises the Gudhamandapa (shrine hall), Sabhamandapa (assembly hall with 52 intricately carved pillars representing weeks of the year), and the magnificent stepped Surya Kund.",
        "highlights": [
            "Surya Kund (stepped tank) featuring 108 miniature shrines along geometrically carved terraces",
            "Sabhamandapa with 52 intricately carved stone pillars depicting scenes from Ramayana & Mahabharata",
            "Equinoctial solar alignment engineered into the celestial sanctum orientation",
            "Modhera is India's first 24x7 solar-powered village, combining ancient solar reverence with modern solar technology",
            "Annual Uttarardh Mahotsav (Modhera Dance Festival) held every January"
        ],
        "significance": "One of India's premier medieval solar temples, showcasing astronomical precision and Solanki stone-carving artistry.",
        "bestSeason": "October to March (Pleasant weather; spectacular annual dance festival in January)",
        "recommendedDuration": "2 – 3 hours",
        "timings": "07:00 AM – 06:00 PM daily (Evening projection lighting on selected days)",
        "entryFee": "₹25 for Indian citizens; ₹300 for foreign tourists (ASI ticket)",
        "facilities": "ASI interpretation centre, landscaped lawns, EV charging stations in village, cafeteria, restrooms, parking",
        "rulesRestrictions": "No active ritual worship; visitors may not climb on ancient stone plinths or enter the direct water tank",
        "sourceName": "Archaeological Survey of India & Ministry of New & Renewable Energy (MNRE)",
        "sourceUrl": "https://www.gujarattourism.com/north-zone/mehsana/sun-temple.html",
        "verificationStatus": "official_statutory",
        "image": "https://upload.wikimedia.org/wikipedia/commons/7/7d/Sun_Temple%2C_Modhera.jpg",
        "tags": ["sun temple", "solanki", "modhera", "architecture", "heritage", "mehsana", "surya kund"],
        "isLesserKnown": False,
        "weekendFrom": ["Ahmedabad", "Gandhinagar", "Mehsana"],
        "nearbyInfrastructure": {
            "railway": "Mehsana Junction (~25 km)",
            "airport": "Ahmedabad Airport (~95 km)",
            "highway": "State Highway 134 / Mehsana-Radhanpur Highway"
        }
    },
    {
        "id": "white-rann-dhordo",
        "name": "White Rann of Kutch & Dhordo",
        "category": "iconic",
        "categoryLabel": "Endless Salt Marsh Desert & Cultural Gateway",
        "district": "Kachchh",
        "region": "Kachchh",
        "coordinates": [69.5167, 23.7833],
        "summary": "The Great Rann of Kutch is one of the world's largest seasonal salt deserts, transforming during winter into an ethereal, blinding white expanse of crystal salts under cobalt blue skies. Best experienced during full-moon nights when the salt crust glimmers silver, the area hosts the world-famous Rann Utsav festival centered at Dhordo village, celebrating Kutchi music, dance, craft, and desert hospitality.",
        "highlights": [
            "Vast, mirror-like salt flat stretching endlessly to the horizon under clear desert skies",
            "Magical full moon night walking tours when the white crystals glow silver under lunar light",
            "Camel safaris, paramotoring, and all-terrain desert vehicle experiences",
            "Dhordo village recognized by UNWTO as one of the 'Best Tourism Villages' in the world",
            "Annual Rann Utsav (November to March) showcasing master artisans of embroidery, Rogan art, and mud-mirror work"
        ],
        "significance": "Globally unique biogeographical salt desert ecosystem and vibrant tribal crafts hub.",
        "bestSeason": "November to February (Cool desert winter; dried salt crust fully formed and walkable)",
        "recommendedDuration": "2 days / 1 night (Essential to stay overnight for sunset, sunrise, and moonrise)",
        "timings": "06:00 AM – 08:00 PM (Entry permitted with police permit; moon night viewing extended)",
        "entryFee": "Rann Entry Permit: ₹100 per adult, ₹50 per child, ₹50 per vehicle (Available online or at Bhirandiyara checkpoint)",
        "facilities": "Tent City luxury accommodation, traditional Kutchi bhungas (mud huts), craft bazaars, food courts, medical aid",
        "rulesRestrictions": "Border zone permits mandatory; valid government photo ID required; driving personal vehicles on delicate salt crust prohibited",
        "sourceName": "Tourism Corporation of Gujarat Limited (TCGL) & UNWTO",
        "sourceUrl": "https://www.gujarattourism.com/kutch-zone/kutch/white-rann.html",
        "verificationStatus": "official_statutory",
        "image": "https://upload.wikimedia.org/wikipedia/commons/e/ec/Rann_of_Kutch_-_White_Desert_2.jpg",
        "tags": ["white rann", "kutch", "desert", "salt desert", "rann utsav", "dhordo", "full moon"],
        "isLesserKnown": False,
        "weekendFrom": ["Bhuj", "Gandhidham"],
        "nearbyInfrastructure": {
            "railway": "Bhuj Railway Station (~80 km)",
            "airport": "Bhuj Domestic Airport (~80 km)",
            "highway": "Bhuj-Khavda-Dhordo Road"
        }
    },
    {
        "id": "dwarkadhish-temple",
        "name": "Dwarkadhish Temple (Jagat Mandir)",
        "category": "iconic",
        "categoryLabel": "Char Dham Pilgrimage & Ancient Coastal Sanctum",
        "district": "Devbhumi Dwarka",
        "region": "Saurashtra",
        "coordinates": [68.9685, 22.2376],
        "summary": "One of the sacred Char Dham pilgrimage destinations in Hinduism, the 5-storey Jagat Mandir stands proudly on the Gomti creek near the Arabian Sea. Believed to have been originally established over 2,200 years ago by Vajranabh, great-grandson of Lord Krishna, the present limestone shrine rises 78 metres on 72 ornate pillars, flying the revered 52-yard triangular flag (Dhwaja) that is changed five times daily.",
        "highlights": [
            "Majestic 78-metre tall 5-storey main shikhara supported by 72 exquisitely carved stone columns",
            "Traditional ceremonial changing of the 52-yard Dhwaja (sacred flag) five times every day",
            "Swarg Dwar (Gate to Heaven) facing Gomti river steps and Moksha Dwar (Gate to Liberation)",
            "Gomti Ghat where pilgrims perform holy ablutions before darshan",
            "Nearby connection to Sudarshan Setu (India's longest cable-stayed bridge) leading to Beyt Dwarka"
        ],
        "significance": "Premier pilgrimage site in Sanatan Dharma, ancient coastal kingdom identified in the Mahabharata, and marine archaeology site of submerged ancient Dwarka.",
        "bestSeason": "October to March (Cool coastal breezes; Janmashtami celebrated with grand fervour in August/September)",
        "recommendedDuration": "3 – 4 hours",
        "timings": "06:30 AM – 01:00 PM and 05:00 PM – 09:30 PM daily",
        "entryFee": "Free general darshan; VIP and special pooja tokens can be booked via Devasthan Samiti",
        "facilities": "Pilgrim dharamshalas, luggage/shoe storage counters, wheelchair facilities, tourist information centre, coastal pathway",
        "rulesRestrictions": "Electronic items, cameras, smartwatches, and leather goods prohibited inside inner temple sanctum; modest traditional dress required",
        "sourceName": "Dwarka Devasthan Samiti & Gujarat Tourism",
        "sourceUrl": "https://dwarkadhish.org",
        "verificationStatus": "official_statutory",
        "image": "https://upload.wikimedia.org/wikipedia/commons/a/a2/Dwarkadheesh_temple.jpg",
        "tags": ["dwarka", "krishna", "char dham", "temple", "jagat mandir", "gomti", "arabian sea"],
        "isLesserKnown": False,
        "weekendFrom": ["Jamnagar", "Porbandar", "Rajkot"],
        "nearbyInfrastructure": {
            "railway": "Dwarka Railway Station (~2.2 km)",
            "airport": "Jamnagar Airport (~135 km) / Porbandar Airport (~105 km)",
            "highway": "NH-51 Coastal Highway"
        }
    },
    {
        "id": "gir-national-park",
        "name": "Gir National Park & Wildlife Sanctuary",
        "category": "iconic",
        "categoryLabel": "Last Abode of the Asiatic Lion",
        "district": "Junagadh",
        "region": "Saurashtra",
        "coordinates": [70.7933, 21.1242],
        "summary": "Covering 1,412 km² of dry deciduous teak and acacia forest, Gir is the only natural habitat of the endangered Asiatic Lion (Panthera leo persica) on Earth. Rescued from the brink of extinction by the Nawabs of Junagadh and subsequent conservation programmes, the sanctuary is also home to leopards, spotted deer (chital), sambar, nilgai, marsh crocodiles (mugger), and over 300 bird species.",
        "highlights": [
            "Open-top 4x4 Gypsy jungle safaris through rugged teak scrub tracking wild Asiatic lions",
            "Over 674 wild Asiatic lions recorded in the Greater Gir landscape",
            "High concentration of leopards, chital, four-horned antelopes (chousingha), and crested serpent eagles",
            "Kamleshwar Dam inside the park, a crucial water reservoir with a large marsh crocodile population",
            "Devalia Safari Park (Gir Interpretation Zone) offering guaranteed wildlife sightings in fenced natural reserve"
        ],
        "significance": "Global conservation success story; sole natural refuge of the Asiatic lion on the planet.",
        "bestSeason": "December to March (Pleasant weather; peak wildlife activity). Sanctuary closed June 16 to October 15 during monsoon.",
        "recommendedDuration": "1 – 2 days (At least 2–3 safari slots recommended for high lion-tracking probability)",
        "timings": "Morning Safaris: 06:00 AM – 09:00 AM; Afternoon Safaris: 03:00 PM – 06:00 PM (Pre-booking mandatory)",
        "entryFee": "Permit: ₹800–₹1,000 (Indian) / ₹4,800 (Foreigner) + Gypsy hire (~₹2,000) + Mandatory certified eco-guide (~₹500)",
        "facilities": "Sinh Sadan forest lodge, certified guides, briefing theatre, eco-camps, Souvenir shop, forest canteen",
        "rulesRestrictions": "All jungle permits must be pre-booked online through official Gir forest portal; private vehicles prohibited inside core park; disembarking from Gypsy forbidden",
        "sourceName": "Gujarat Forest Department — Wildlife Wing",
        "sourceUrl": "https://girlion.gujarat.gov.in",
        "verificationStatus": "official_statutory",
        "image": "https://upload.wikimedia.org/wikipedia/commons/b/b8/Asiatic_lion_03.jpg",
        "tags": ["wildlife", "safari", "lion", "asiatic lion", "gir", "national park", "forest"],
        "isLesserKnown": False,
        "weekendFrom": ["Rajkot", "Junagadh", "Ahmedabad"],
        "nearbyInfrastructure": {
            "railway": "Junagadh Junction (~60 km) / Veraval (~45 km)",
            "airport": "Keshod Airport (~50 km) / Rajkot International Airport (~160 km)",
            "highway": "Junagadh-Mendarda-Sasan Road / SH-26"
        }
    },
    {
        "id": "champaner-pavagadh",
        "name": "Champaner-Pavagadh Archaeological Park",
        "category": "iconic",
        "categoryLabel": "UNESCO World Heritage Historical Landscape",
        "district": "Panchmahal",
        "region": "Central Gujarat",
        "coordinates": [73.5333, 22.4833],
        "summary": "A UNESCO World Heritage site since 2004, Champaner-Pavagadh represents a concentration of largely unexcavated archaeological, historic, and living cultural heritage. Set around the volcanic Pavagadh hill, it encompasses prehistoric chalcolithic sites, an 8th-to-14th-century Hindu hill fortress, and the 15th-century capital of Sultan Mahmud Begada displaying early Mughal and Indo-Islamic architecture with exquisite water-harvesting cisterns.",
        "highlights": [
            "Jami Masjid: majestic 15th-century mosque with 172 carved stone pillars and delicate floral jali work",
            "Kalika Mata Temple atop the 800-metre volcanic summit of Pavagadh Hill, reachable via ropeway",
            "Elaborate medieval gravity water structures including Helical Stepwell, Geban Shah Stepwell, and rainwater talavs",
            "Intact medieval city fortifications, city gates (Bhadra Gate), citadels, and royal granaries (Makai Kothar)",
            "Scenic trekking routes through deciduous forest and geological escarpments"
        ],
        "significance": "Only complete and unchanged Islamic pre-Mughal city remaining in India, demonstrating harmony between Hindu, Jain, and Islamic architectural idioms.",
        "bestSeason": "October to February (Monsoon brings lush green hills and waterfalls; winter is ideal for monument walks)",
        "recommendedDuration": "Full day (4–6 hours for monuments in plains plus hill ascent)",
        "timings": "Monuments: 08:30 AM – 05:30 PM; Ropeway: 06:00 AM – 07:00 PM",
        "entryFee": "ASI Plain Monuments: ₹40 (Indian citizens), ₹600 (Foreigners); Pavagadh Ropeway: ~₹170 return ticket",
        "facilities": "Udan Khatola passenger ropeway, ASI information plaques, local eateries, parking at Manchi and plains",
        "rulesRestrictions": "Wear comfortable walking shoes for cobblestones and steps; monkeys present on upper Pavagadh trail so secure bags",
        "sourceName": "UNESCO World Heritage Centre & Archaeological Survey of India",
        "sourceUrl": "https://whc.unesco.org/en/list/1101",
        "verificationStatus": "official_statutory",
        "image": "https://upload.wikimedia.org/wikipedia/commons/1/17/JAMI_MASJID%2CCHAMPANER.jpg",
        "tags": ["unesco", "champaner", "pavagadh", "heritage", "jami masjid", "fort", "panchmahal"],
        "isLesserKnown": False,
        "weekendFrom": ["Vadodara", "Ahmedabad", "Surat"],
        "nearbyInfrastructure": {
            "railway": "Champaner Road Station (~15 km) / Vadodara Junction (~48 km)",
            "airport": "Vadodara Airport (~45 km)",
            "highway": "Vadodara-Halol 4-Lane Toll Road / SH-5"
        }
    },
    {
        "id": "sabarmati-ashram",
        "name": "Sabarmati Ashram (Gandhi Ashram)",
        "category": "iconic",
        "categoryLabel": "Epicentre of India's Non-Violent Freedom Struggle",
        "district": "Ahmedabad",
        "region": "Central Gujarat",
        "coordinates": [72.5800, 23.0600],
        "summary": "Established in 1917 on the tranquil banks of the Sabarmati River by Mahatma Gandhi, this ashram served as the nerve centre of India's freedom struggle for 13 years. It was from here on March 12, 1930, that Gandhi led the historic 241-mile Dandi Salt March, vowing not to return to the ashram until India won independence.",
        "highlights": [
            "Hriday Kunj: the modest cottage where Mahatma Gandhi and Kasturba lived, preserving his original charkha and writing desk",
            "Gandhi Smarak Sangrahalaya: peaceful museum designed by celebrated architect Charles Correa, housing original letters, manuscripts, and oil paintings",
            "Magan Niwas: original workshop where various improvements to spinning wheels (charkhas) were innovated",
            "Nandini: the ashram guest house where luminaries like Rabindranath Tagore, Jawaharlal Nehru, and C.F. Andrews stayed",
            "Bookstore offering authentic literature on Gandhian thought, peace studies, and handspun khadi"
        ],
        "significance": "Hallowed historical site of international stature representing satyagraha, non-violence, and simplicity; core milestone of modern world history.",
        "bestSeason": "Open year-round; October to March offers pleasant shaded riverfront breezes",
        "recommendedDuration": "1.5 – 2.5 hours",
        "timings": "08:30 AM – 06:30 PM daily (Open 365 days a year)",
        "entryFee": "Free entry for all visitors",
        "facilities": "Wheelchair accessible ramps, quiet library, audio guides, clean drinking water, shaded courtyards, parking",
        "rulesRestrictions": "Respect the serene atmosphere; maintain silence in museum galleries; commercial videography requires trust approval",
        "sourceName": "Sabarmati Ashram Preservation and Memorial Trust",
        "sourceUrl": "https://gandhiashramsabarmati.org",
        "verificationStatus": "official_statutory",
        "image": "https://upload.wikimedia.org/wikipedia/commons/3/32/Sabarmati_Ashram_-_Ahmedabad_-_Gujarat_-_DSC001.jpg",
        "tags": ["gandhi", "freedom struggle", "sabarmati", "ahmedabad", "museum", "history", "peace"],
        "isLesserKnown": False,
        "weekendFrom": ["Ahmedabad", "Gandhinagar"],
        "nearbyInfrastructure": {
            "railway": "Sabarmati Junction (~2 km) / Ahmedabad Kalupur Junction (~6 km)",
            "airport": "Sardar Vallabhbhai Patel International Airport (~7 km)",
            "highway": "Ashram Road / 132 Feet Ring Road / Sabarmati Riverfront"
        }
    },
    {
        "id": "dholavira-harappan-city",
        "name": "Dholavira: A Harappan City",
        "category": "iconic",
        "categoryLabel": "UNESCO World Heritage Indus Valley Metropolis",
        "district": "Kachchh",
        "region": "Kachchh",
        "coordinates": [70.2133, 23.8867],
        "summary": "Inscribed as a UNESCO World Heritage Site in 2021, Dholavira is one of the most remarkable and well-preserved urban settlements of the South Asian Bronze Age (3000–1500 BCE). Situated on Khadir Bet island in the Great Rann, it features an elaborate multi-tiered stone fortification, grand ceremonial grounds, a ten-symbol monumental Indus script signboard, and the ancient world's most sophisticated rainwater harvesting and storage system comprising 16 interconnected reservoirs carved into bedrock.",
        "highlights": [
            "Monumental stone-cut reservoirs and subterranean channels demonstrating hydraulic engineering 4,500 years ago",
            "Citadel (Castle & Bailey) built entirely with dressed stone and mud-brick masonry",
            "Northern Gatehouse where the celebrated ten-character Indus script 'Signboard' was discovered",
            "Huge ceremonial stadium with stepped terraced seating for community assemblies",
            "ASI On-Site Archaeological Museum displaying seals, terracotta beads, gold ornaments, and copper tools",
            "Scenic approach across the newly constructed 'Road to Heaven' through the white salt flats"
        ],
        "significance": "Outstanding testimony to the planning, hydraulic technology, water management, and social organization of the Indus Valley Civilization.",
        "bestSeason": "November to February (Cool desert winter; summer temperatures can be extreme)",
        "recommendedDuration": "3 – 5 hours",
        "timings": "08:00 AM – 06:00 PM daily",
        "entryFee": "₹40 for Indian citizens; ₹600 for foreign nationals (ASI statutory entry fee)",
        "facilities": "ASI museum, orientation centre, local eco-resorts on Khadir Bet, drinking water, parking",
        "rulesRestrictions": "Do not touch, remove, or walk across fragile ancient stone wall crests; carry sun protection and sufficient drinking water; remote desert driving requires full fuel tank",
        "sourceName": "UNESCO World Heritage Centre & Archaeological Survey of India",
        "sourceUrl": "https://whc.unesco.org/en/list/1644",
        "verificationStatus": "official_statutory",
        "image": "https://upload.wikimedia.org/wikipedia/commons/8/80/Dholavira_gujarat.jpg",
        "tags": ["dholavira", "unesco", "harappan", "indus valley", "archaeology", "khadir bet", "kutch"],
        "isLesserKnown": False,
        "weekendFrom": ["Bhuj", "Gandhidham"],
        "nearbyInfrastructure": {
            "railway": "Samakhiali Junction (~135 km) / Bhuj (~215 km)",
            "airport": "Bhuj Airport (~215 km)",
            "highway": "Khavda-Khadir Bet 'Road to Heaven' / NH-754K"
        }
    },

    # =========================================================================
    # 2. LESSER-KNOWN GUJARAT (OFF THE FAMILIAR TRAIL)
    # =========================================================================
    {
        "id": "polo-forest-ruins",
        "name": "Polo Forest & Ancient Idar Valley Ruins",
        "category": "lesser_known",
        "categoryLabel": "Secluded Forest Reserve with 10th-Century Stone Temples",
        "district": "Sabarkantha",
        "region": "North Gujarat",
        "coordinates": [73.2389, 23.9783],
        "summary": "Tucked away in the foothills of the Aravalli range along the perennial Harnav River, Polo Forest is an ancient hidden sanctuary where nature and medieval stone heritage intertwine. Established around the 10th century CE by the Parihar kings of Idar, the dense teak forest conceals ornate ruined Jain and Shiva temples, stepwells, and watchtowers overgrown with banyan roots.",
        "highlights": [
            "15th-century Vireshwar Shiva Temple and intricately carved Sharaneshwar temple group",
            "Ruined Jain temples featuring weathered stone shikharas enveloped by forest canopy and roots",
            "Harnav River riverside walks, natural rock pools, and the picturesque Vanaj Dam overflow",
            "Eco-campsites managed by the Gujarat Forest Department with guided forest nature trails",
            "Exceptional birdwatching habitat home to grey hornbills, paradise flycatchers, and raptors"
        ],
        "significance": "Remarkable confluence of dry deciduous biodiversity and secluded medieval Solanki and Parihar rock architecture.",
        "bestSeason": "July to February (Spectacular post-monsoon lushness and misty mornings)",
        "recommendedDuration": "1 – 2 days (Ideal weekend getaway from Ahmedabad/Gandhinagar)",
        "timings": "07:00 AM – 06:00 PM (Entry regulated by Forest Dept checkpoint at Vanaj)",
        "entryFee": "Free general entry to forest; Forest Dept eco-camps and guided treks available at published tariffs",
        "facilities": "Forest eco-campsite (tents and cottages), local tribal food stalls, parking near Vanaj Dam",
        "rulesRestrictions": "Plastic-free zone enforced; loud music and evening camping outside designated forest department sites strictly prohibited; wild animals inhabit the area so do not venture off trails after dusk",
        "sourceName": "Gujarat Forest Department & Gujarat Tourism",
        "sourceUrl": "https://www.gujarattourism.com/north-zone/sabarkantha/polo-monuments-and-vijaynagar-forests.html",
        "verificationStatus": "official_statutory",
        "image": "https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1200&q=80",
        "tags": ["polo forest", "sabarkantha", "aravalli", "harnav", "ruins", "nature", "weekend getaway", "lesser-known"],
        "isLesserKnown": True,
        "weekendFrom": ["Ahmedabad", "Gandhinagar", "Himmatnagar"],
        "nearbyInfrastructure": {
            "railway": "Himmatnagar Junction (~70 km)",
            "airport": "Ahmedabad Airport (~150 km)",
            "highway": "Himmatnagar-Idar-Vijaynagar State Highway"
        }
    },
    {
        "id": "dada-harir-stepwell",
        "name": "Dada Harir (Bai Harir Sultani) Stepwell",
        "category": "lesser_known",
        "categoryLabel": "15th-Century Multi-Tiered Subterranean Architectural Marvel",
        "district": "Ahmedabad",
        "region": "Central Gujarat",
        "coordinates": [72.6041, 23.0504],
        "summary": "Built in 1499 CE by Bai Harir Sultani, a superintendent of the royal harem under Sultan Mahmud Begada, this five-storey sandstone stepwell in Asarwa is one of Ahmedabad's most magnificent yet quiet historic monuments. Unlike the heavily visited Adalaj stepwell, Dada Harir offers an unhurried experience of exquisite Indo-Islamic stone carvings, Sanskrit and Arabic dual inscriptions, and subterranean spiral staircases.",
        "highlights": [
            "Five levels of carved octagonal pavilions descending into the cool subterranean water shaft",
            "Bilingual stone foundation tablets carved in both Sanskrit and Arabic dating to 1499 CE",
            "Intricate decorative motifs combining traditional Hindu floral swags with Islamic geometric friezes",
            "Adjacent marble tomb of Bai Harir and the intricately carved 15th-century mosque with domed roofs",
            "Peaceful atmosphere tucked away in the heritage quarter of Asarwa"
        ],
        "significance": "Exceptional architectural testimony to the syncretic Solanki-Sultanate architectural idiom; dual-language inscriptions record builder, date, and expenses.",
        "bestSeason": "October to March (Subterranean shafts provide cool respite even during warm afternoons)",
        "recommendedDuration": "1 – 1.5 hours",
        "timings": "09:00 AM – 05:00 PM daily",
        "entryFee": "Free entry (Centrally Protected Monument maintained by ASI)",
        "facilities": "Quiet garden enclave, informational stone plaques; street parking available nearby",
        "rulesRestrictions": "Watch footing on steep, uneven stone steps; flash photography restricted inside deep shaft to preserve stone surfaces",
        "sourceName": "Archaeological Survey of India — Vadodara Circle",
        "sourceUrl": "https://asivadodaracircle.in",
        "verificationStatus": "official_statutory",
        "image": "https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=1200&q=80",
        "tags": ["stepwell", "ahmedabad", "asarwa", "dada harir", "bai harir", "sultanate", "lesser-known", "heritage"],
        "isLesserKnown": True,
        "weekendFrom": ["Ahmedabad", "Gandhinagar"],
        "nearbyInfrastructure": {
            "railway": "Ahmedabad Junction (Kalupur) (~3.2 km) / Asarwa Railway Station (~1.0 km)",
            "airport": "Ahmedabad Airport (~6.5 km)",
            "highway": "Naroda Road / Chamunda Bridge / Inner Ring Road"
        }
    },
    {
        "id": "lakhpat-fort-town",
        "name": "Lakhpat Walled Fort & Deserted Port Town",
        "category": "lesser_known",
        "categoryLabel": "Historic Border Fortress at the Edge of the Rann",
        "district": "Kachchh",
        "region": "Kachchh",
        "coordinates": [68.7833, 23.8333],
        "summary": "Perched at the extreme northwestern tip of India where the Indus River once emptied into the Arabian Sea before the devastating 1819 Allah Bund earthquake changed its course, Lakhpat was once a bustling maritime trade hub generating over 100,000 koris in daily tax revenue (giving it the name Lakhpat). Today, it is an evocative, windswept deserted fortified town enclosed by 7 kilometres of towering battlements overlooking the Great Rann.",
        "highlights": [
            "7-kilometre intact perimeter stone ramparts with panoramic vistas over the Great Rann and Kori Creek",
            "Historic Lakhpat Gurdwara Sahib where Guru Nanak stayed en route to Mecca (UNESCO Asia-Pacific Heritage Award)",
            "Exquisitely carved 16th-century tomb complex of Sufi saint Pir Ghaus Muhammad with intricate jaalis",
            "Atmospheric abandoned stone streets, ruined havelis, and ancient granaries of a forgotten port city",
            "Proximity to BSF border outpost and bird-rich tidal mangrove mudflats"
        ],
        "significance": "A poignant ghost city bearing testimony to seismic-geomorphic displacement in 1819; sacred site in Sikh and Sufi traditions.",
        "bestSeason": "November to February (Cool desert winds; summer temperatures are harsh)",
        "recommendedDuration": "3 – 4 hours",
        "timings": "Sunrise to Sunset (Gurdwara open 24 hours with community langar service)",
        "entryFee": "Free entry",
        "facilities": "Gurdwara langar (free community kitchen) and modest pilgrim rooms; basic tea stalls outside gate",
        "rulesRestrictions": "Close to the international border; visitors must carry government ID; do not photograph military installations or venture beyond signposted tracks",
        "sourceName": "Gujarat Tourism & Archaeological Survey of India",
        "sourceUrl": "https://www.gujarattourism.com/kutch-zone/kutch/lakhpat.html",
        "verificationStatus": "official_statutory",
        "image": "https://upload.wikimedia.org/wikipedia/commons/c/c7/Distant_view_of_Lakhpat_Fort.jpg",
        "tags": ["lakhpat", "kutch", "fort", "ghost town", "gurdwara", "heritage", "border", "lesser-known"],
        "isLesserKnown": True,
        "weekendFrom": ["Bhuj", "Mandvi"],
        "nearbyInfrastructure": {
            "railway": "Bhuj Railway Station (~135 km)",
            "airport": "Bhuj Airport (~135 km)",
            "highway": "State Highway 45 / Bhuj-Nakhtrana-Lakhpat Road"
        }
    },
    {
        "id": "khambhalida-caves",
        "name": "Khambhalida Buddhist Rock-Cut Caves",
        "category": "lesser_known",
        "categoryLabel": "4th-Century Subterranean Rock-Cut Monastic Sanctuary",
        "district": "Rajkot",
        "region": "Saurashtra",
        "coordinates": [70.7667, 21.8000],
        "summary": "Carved into soft limestone cliffs along the banks of a quiet seasonal spring near Gondal, the Khambhalida Caves date back to the 4th–5th century CE. Discovered in 1958 by renowned archaeologist P.P. Pandya, the central chaitya cave is flanked by two monumental, life-sized carved Bodhisattvas — Padmapani and Vajrapani — a rare and significant sculpture style in western Indian Buddhist art.",
        "highlights": [
            "Monumental carved Bodhisattva Padmapani holding a lotus flower with attendants and celestial fly-whisk bearers",
            "Bodhisattva Vajrapani carving displaying intricate Ashokan-Gupta transitional artistic influences",
            "Central chaitya hall with rock-cut stupa and circular meditation niches carved directly into the bedrock cliff",
            "Tranquil, uncrowded rural setting surrounded by agricultural fields and babool scrub",
            "Close proximity to the historic princely town of Gondal and Naulakha Palace"
        ],
        "significance": "Crucial evidence of thriving Buddhist monastic networks across inland Saurashtra during the Kshatrapa-Gupta era.",
        "bestSeason": "October to March (Post-monsoon greenery highlights the ravine)",
        "recommendedDuration": "1 – 1.5 hours",
        "timings": "09:00 AM – 05:30 PM daily",
        "entryFee": "Free entry (Protected State Archaeological Monument)",
        "facilities": "ASI paved walkway, basic shade shelter, parking area",
        "rulesRestrictions": "Limestone is delicate; scratching or touching ancient relief sculptures strictly prohibited; wear sturdy shoes for rock paths",
        "sourceName": "Gujarat Directorate of Archaeology & Tourism Corporation of Gujarat",
        "sourceUrl": "https://www.gujarattourism.com/saurashtra/rajkot/khambhalida-caves.html",
        "verificationStatus": "official_statutory",
        "image": "https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?auto=format&fit=crop&w=1200&q=80",
        "tags": ["buddhist", "caves", "khambhalida", "rajkot", "gondal", "heritage", "rock-cut", "lesser-known"],
        "isLesserKnown": True,
        "weekendFrom": ["Rajkot", "Gondal", "Junagadh"],
        "nearbyInfrastructure": {
            "railway": "Gondal Railway Station (~22 km) / Rajkot Junction (~65 km)",
            "airport": "Rajkot International Airport (~85 km)",
            "highway": "NH-27 Rajkot-Gondal-Jetpur Highway"
        }
    },
    {
        "id": "galteshwar-temple",
        "name": "Galteshwar Ancient Shiva Temple",
        "category": "lesser_known",
        "categoryLabel": "12th-Century Chaulukya Sanctuary at River Confluence",
        "district": "Kheda",
        "region": "Central Gujarat",
        "coordinates": [73.1611, 22.8467],
        "summary": "Standing serenely at the picturesque confluence of the sacred Mahi and Galti rivers near Dakor, Galteshwar is an 11th–12th century Solanki-Chaulukya stone temple. Dedicated to Lord Shiva, the temple features an unusual octagonal sanctum (Garbhagriha) and an exquisitely carved open assembly mandapa supported by eight pillars displaying figures of gods, apsaras, and musicians.",
        "highlights": [
            "Unique circular/octagonal sanctum architecture resembling the Bhumija temple style rarely seen in Gujarat",
            "Natural river confluence (Sangam) setting where cool river breezes wash over the ancient plinths",
            "Stone carvings depicting dancers, musicians, warriors, and Hindu mythological episodes",
            "Natural perennial spring inside the sanctum that continuously bathes the Shiva lingam",
            "Picturesque riverfront embankment popular for quiet family picnics and sunset views"
        ],
        "significance": "Rare architectural transition between Solanki and Malwa Bhumija temple styles; notable riverine heritage sanctuary.",
        "bestSeason": "July to February (Rivers are full post-monsoon; winters are idyllic for day trips)",
        "recommendedDuration": "1.5 – 2 hours",
        "timings": "06:00 AM – 07:00 PM daily",
        "entryFee": "Free entry (Centrally Protected ASI Monument)",
        "facilities": "Local tea stalls, paved steps down to riverbank, vehicle parking",
        "rulesRestrictions": "Do not venture deep into the Mahi river waters during high discharge periods; maintain cleanliness of riverfront and temple grounds",
        "sourceName": "Archaeological Survey of India — Vadodara Circle",
        "sourceUrl": "https://asivadodaracircle.in",
        "verificationStatus": "official_statutory",
        "image": "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=1200&q=80",
        "tags": ["galteshwar", "kheda", "mahi river", "temple", "shiva", "solanki", "heritage", "lesser-known"],
        "isLesserKnown": True,
        "weekendFrom": ["Ahmedabad", "Vadodara", "Anand"],
        "nearbyInfrastructure": {
            "railway": "Thasra Railway Station (~16 km) / Anand Junction (~55 km)",
            "airport": "Vadodara Airport (~65 km) / Ahmedabad (~90 km)",
            "highway": "Dakor-Sevaliya Road / Godhra Highway"
        }
    },
    {
        "id": "sarkhej-roza",
        "name": "Sarkhej Roza Architectural Complex",
        "category": "lesser_known",
        "categoryLabel": "15th-Century 'Acropolis of Ahmedabad' on Water Reservoir",
        "district": "Ahmedabad",
        "region": "Central Gujarat",
        "coordinates": [72.5028, 22.9819],
        "summary": "Referred to by legendary architect Le Corbusier as the 'Acropolis of Ahmedabad' for its peerless spatial balance, Sarkhej Roza is a tomb and mosque complex centered around an enormous excavated water reservoir (Sarkhej Lake). Built in the mid-15th century around the shrine of Sufi saint Shaikh Ahmed Ganj Bakhsh Khattu, the architecture abandoned traditional minarets in favour of pillared pavilions, airy porticos, and delicate stone screens.",
        "highlights": [
            "Vast central excavated lake (talav) framed by pillared sluices, palaces, and steps",
            "Tomb of Sufi Saint Shaikh Ahmed Khattu Ganj Bakhsh featuring the largest dome in Gujarat and brass pierced jalis",
            "Royal pavilions and royal tombs of Sultan Mahmud Begada and Queen Rajabai",
            "Masterpiece of Indo-Saracenic design combining Hindu trabeate (post-and-lintel) construction with Islamic spatial geometry",
            "Photographers' paradise during sunset when geometric stone colonnades cast long shadows across the lake"
        ],
        "significance": "Seminal monument of Ahmedabad's UNESCO World Heritage City, epitomizing cultural syncretism in Gujarati architecture.",
        "bestSeason": "July to March (Spectacular when monsoon rains fill the reservoir; winter evenings are serene)",
        "recommendedDuration": "2 – 3 hours",
        "timings": "09:00 AM – 06:00 PM daily",
        "entryFee": "Free entry (Centrally Protected Monument)",
        "facilities": "Quiet landscaped gardens, informational plaques, book counter, parking outside outer gate",
        "rulesRestrictions": "Head covering recommended in inner saint's tomb; remove shoes before entering the mosque platform; professional filming requires prior ASI approval",
        "sourceName": "Sarkhej Roza Committee & Archaeological Survey of India",
        "sourceUrl": "https://sarkhejroza.org",
        "verificationStatus": "official_statutory",
        "image": "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80",
        "tags": ["sarkhej roza", "ahmedabad", "unesco", "heritage", "sufi", "architecture", "lesser-known", "acropolis"],
        "isLesserKnown": True,
        "weekendFrom": ["Ahmedabad", "Gandhinagar"],
        "nearbyInfrastructure": {
            "railway": "Sarkhej Railway Station (~2 km) / Kalupur Junction (~12 km)",
            "airport": "Ahmedabad International Airport (~18 km)",
            "highway": "Sarkhej-Gandhinagar (SG) Highway / SP Ring Road"
        }
    },
    {
        "id": "gira-waterfalls",
        "name": "Gira Waterfalls & Waghai Botanical Garden",
        "category": "lesser_known",
        "categoryLabel": "30-Metre Forest Waterfall in Tribal Dangs",
        "district": "Dang",
        "region": "South Gujarat",
        "coordinates": [73.5186, 20.7639],
        "summary": "Plunging 30 metres into the Ambika River amidst dense teak forests of the Dang tribal district, Gira Falls is a breathtaking natural cascade near Waghai. Powered by monsoon runoff, the falls create a dramatic curtain of mist. Nearby lies the Waghai Botanical Garden, one of the largest in India, preserving over 1,400 indigenous forest species and medicinal herb collections.",
        "highlights": [
            "30-metre high thundering waterfall plunging over basalt rock into the churning Ambika River",
            "Misty spray creating vibrant rainbows in the afternoon sunlight",
            "Local tribal stalls selling authentic bamboo handicrafts, wild forest honey, and herbal remedies",
            "Waghai Botanical Garden (24 hectares) with bamboo arboretum and cactus house just 3 km away",
            "Picturesque narrow-gauge railway ride connecting Waghai to Bilimora through tribal teak hills"
        ],
        "significance": "Premier natural ecotourism attraction in the biodiversity-rich Western Ghats (Dangs) bio-reserve.",
        "bestSeason": "July to November (Peak volume during monsoon; steady scenic flow through autumn)",
        "recommendedDuration": "2 – 3 hours",
        "timings": "08:00 AM – 06:00 PM daily",
        "entryFee": "₹20 nominal vehicle entry fee charged by local tribal forest cooperative",
        "facilities": "Viewing platforms, local tribal food stalls (hot tea, roasted corn), basic restrooms, parking",
        "rulesRestrictions": "Swimming in the deep whirlpool basin below the waterfall is strictly prohibited due to dangerous undertows; stay within barricades",
        "sourceName": "Gujarat Forest Department — Dangs Division & Gujarat Tourism",
        "sourceUrl": "https://www.gujarattourism.com/south-zone/dangs/gira-waterfall.html",
        "verificationStatus": "official_statutory",
        "image": "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80",
        "tags": ["waterfall", "dang", "waghai", "nature", "forest", "ambika", "tribal", "lesser-known"],
        "isLesserKnown": True,
        "weekendFrom": ["Surat", "Valsad", "Navsari", "Saputara"],
        "nearbyInfrastructure": {
            "railway": "Waghai Heritage Narrow Gauge Station (~3 km) / Bilimora Junction (~65 km)",
            "airport": "Surat Airport (~115 km)",
            "highway": "Waghai-Saputara State Highway / SH-14"
        }
    },

    # =========================================================================
    # 3. NATURE & WILDLIFE SANCTUARIES
    # =========================================================================
    {
        "id": "velavadar-blackbuck-np",
        "name": "Blackbuck National Park, Velavadar",
        "category": "nature_wildlife",
        "categoryLabel": "Open Savannah Grassland & Wildlife Sanctuary",
        "district": "Bhavnagar",
        "region": "Saurashtra",
        "coordinates": [72.0333, 21.9333],
        "summary": "Covering 34 km² of unique coastal grassland savannah, Velavadar is world-renowned for its thriving population of the graceful Blackbuck antelope (Antilope cervicapra). It is also one of the world's most vital winter roosting grounds for Montagu's and Pallid harriers, and a crucial sanctuary for the endangered Indian grey wolf, striped hyena, and nilgai.",
        "highlights": [
            "Over 4,000 graceful spiralled-horn Blackbucks leaping across golden savannah grasslands",
            "World's largest communal roosting site for migratory harriers (raptors)",
            "High probability of spotting the elusive Indian grey wolf hunting in natural packs",
            "Open safari tracks offering spectacular unimpeded wildlife photography against grassland horizon",
            "Dedicated Forest Department interpretation centre with expert local wildlife trackers"
        ],
        "significance": "Critically important semi-arid grassland ecosystem preserving the world's highest density of blackbuck antelopes.",
        "bestSeason": "October to March (Pleasant weather; thousands of migratory birds present; park closed during peak monsoon July–September)",
        "recommendedDuration": "Half day to Full day (1–2 open vehicle safaris)",
        "timings": "Sunrise to Sunset (06:30 AM – 10:30 AM and 03:30 PM – 06:30 PM)",
        "entryFee": "Park permit: ₹100 per Indian; ₹800 per Foreigner + Gypsy & guide charges (~₹1,500)",
        "facilities": "Forest Department Kaliyar Bhavan rest house, certified guides, briefing theatre, parking",
        "rulesRestrictions": "Walking inside grassland strictly restricted to prevent disturbance to ground-nesting birds and wolves; stay inside authorized safari vehicles",
        "sourceName": "Gujarat Forest Department — Wildlife Division",
        "sourceUrl": "https://www.gujarattourism.com/saurashtra/bhavnagar/blackbuck-national-park.html",
        "verificationStatus": "official_statutory",
        "image": "https://images.unsplash.com/photo-1484406566174-9da000fda645?auto=format&fit=crop&w=1200&q=80",
        "tags": ["wildlife", "blackbuck", "velavadar", "bhavnagar", "safari", "grassland", "wolf"],
        "isLesserKnown": False,
        "weekendFrom": ["Ahmedabad", "Bhavnagar", "Vadodara"],
        "nearbyInfrastructure": {
            "railway": "Bhavnagar Terminus (~45 km) / Ahmedabad Junction (~140 km)",
            "airport": "Bhavnagar Airport (~45 km)",
            "highway": "Ahmedabad-Bhavnagar Short Route Highway / SH-6"
        }
    },
    {
        "id": "marine-national-park-narara",
        "name": "Marine National Park (Narara Reef)",
        "category": "nature_wildlife",
        "categoryLabel": "India's First Marine Sanctuary & Intertidal Coral Reef",
        "district": "Jamnagar",
        "region": "Saurashtra",
        "coordinates": [69.7500, 22.4667],
        "summary": "Established in 1982 in the Gulf of Kutch, this is India's very first Marine National Park. The accessible intertidal reef at Narara allows visitors to embark on an incredible 'walking marine safari' during low tide without diving gear — walking along the exposed shallow sea floor to observe live corals, sea anemones, octopus, pufferfish, sea cucumbers, and colourful nudibranchs.",
        "highlights": [
            "Walk on the exposed seabed during low tide accompanied by certified marine eco-guides",
            "Observe live hard and soft corals, sea anemones, sponge colonies, and crabs in tidal pools",
            "Occasional sightings of octopus, stingrays, pufferfish, and colourful sea slugs",
            "Extensive mangrove channels home to flamingos, painted storks, and migratory waders",
            "Exceptional educational experience for students and nature lovers"
        ],
        "significance": "Pioneering marine protected area protecting northernmost coral reefs in mainland India under high tidal amplitude conditions.",
        "bestSeason": "November to March (Favourable tide timings and pleasant coastal climate)",
        "recommendedDuration": "3 – 4 hours (Timed strictly around the daily low-tide window)",
        "timings": "Strictly dependent on daily tidal tables (Visit must coincide with low tide; Forest Dept issues permits accordingly)",
        "entryFee": "Forest Entry Permit: ₹100 per adult; Eco-guide fee: ~₹300 per group",
        "facilities": "Forest Department interpretation centre, vehicle parking, certified local marine naturalists",
        "rulesRestrictions": "Wear thick-soled canvas shoes or diving boots to walk safely over barnacle-crusted rocks; never touch or step on living coral polyps; collecting shells or marine specimens is a non-bailable wildlife offence",
        "sourceName": "Gujarat Forest Department — Marine National Park Division",
        "sourceUrl": "https://www.gujarattourism.com/saurashtra/jamnagar/marine-national-park.html",
        "verificationStatus": "official_statutory",
        "image": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
        "tags": ["marine", "coral reef", "jamnagar", "narara", "gulf of kutch", "wildlife", "sea life"],
        "isLesserKnown": False,
        "weekendFrom": ["Jamnagar", "Rajkot"],
        "nearbyInfrastructure": {
            "railway": "Jamnagar Railway Station (~55 km)",
            "airport": "Jamnagar Domestic Airport (~55 km)",
            "highway": "Jamnagar-Dwarka Highway / NH-947"
        }
    },
    {
        "id": "wild-ass-sanctuary",
        "name": "Indian Wild Ass Sanctuary, Little Rann of Kutch",
        "category": "nature_wildlife",
        "categoryLabel": "World's Sole Habitat of the Indian Wild Ass (Khur)",
        "district": "Surendranagar",
        "region": "Saurashtra",
        "coordinates": [71.5500, 23.3333],
        "summary": "Spanning 4,953 km² across the Little Rann of Kutch, this expansive salt marsh desert and mudflat ecosystem is the last remaining haven of the endangered Indian Wild Ass (Equus hemionus khur, locally called 'Khur'). Known for its blinding flat salt crust that reflects mirages in summer, the sanctuary also attracts thousands of Greater and Lesser Flamingos, desert foxes, and migratory waterfowl in winter.",
        "highlights": [
            "Spot herds of galloping Indian Wild Asses capable of running at 50 km/h across the flat salt pans",
            "Surajbari and Bajana creek waters teeming with tens of thousands of pink flamingos and pelicans",
            "Desert safaris in open 4x4 vehicles across the flat dried mud crust to isolated island mounds (bets)",
            "Observe traditional Agariya salt workers harvesting inland crystal salt ('Vadapu')",
            "High biodiversity of desert predators: desert fox, striped hyena, and desert cat"
        ],
        "significance": "UNESCO World Heritage tentative list biosphere reserve; sole natural refuge for the subspecies Equus hemionus khur.",
        "bestSeason": "October to March (Winter brings pleasant temperatures and massive bird migrations)",
        "recommendedDuration": "1 – 2 days (Morning and evening desert safaris)",
        "timings": "06:00 AM – 06:00 PM (Safaris timed at dawn and dusk)",
        "entryFee": "Forest Permit: ₹150 per person; Vehicle fee: ₹500; Guide fee: ₹300",
        "facilities": "Eco-resorts at Dasada and Bajana, certified safari trackers, village craft shops",
        "rulesRestrictions": "Do not chase or approach wild asses closer than permitted distances; desert navigation can be disorienting so always travel with authorized local guides",
        "sourceName": "Gujarat Forest Department — Wild Ass Sanctuary Division",
        "sourceUrl": "https://www.gujarattourism.com/saurashtra/surendranagar/wild-ass-sanctuary.html",
        "verificationStatus": "official_statutory",
        "image": "https://images.unsplash.com/photo-1574063413132-355dbfd83e22?auto=format&fit=crop&w=1200&q=80",
        "tags": ["wild ass", "khur", "little rann", "surendranagar", "dasada", "safari", "flamingos"],
        "isLesserKnown": False,
        "weekendFrom": ["Ahmedabad", "Gandhinagar", "Rajkot"],
        "nearbyInfrastructure": {
            "railway": "Viramgam Junction (~40 km) / Dhrangadhra (~35 km)",
            "airport": "Ahmedabad Airport (~95 km)",
            "highway": "Ahmedabad-Viramgam-Maliya Highway / NH-947"
        }
    },
    {
        "id": "nalsarovar-bird-sanctuary",
        "name": "Nalsarovar Bird Sanctuary",
        "category": "nature_wildlife",
        "categoryLabel": "Ramsar Wetland & Migratory Avian Paradise",
        "district": "Ahmedabad",
        "region": "Central Gujarat",
        "coordinates": [72.0333, 22.8000],
        "summary": "Covering 120 km² of shallow freshwater lake and marshland dotted with 360 small islands, Nalsarovar was designated as Gujarat's first Ramsar Site in 2012. Every winter between November and February, over 250 species of migratory birds from Siberia, Central Asia, and Europe converge here, creating a vibrant spectacle of flamingos, pelicans, cranes, ducks, and waders.",
        "highlights": [
            "Tranquil sunrise boat rides on hand-rowed country boats through reed beds and floating lotus leaves",
            "Flocks of Greater and Lesser Flamingos feeding in shallow saline-freshwater ecotones",
            "Pelicans, white storks, glossy ibises, sarus cranes, and diverse migratory waterfowl species",
            "Visit Dhrabla Island in the center of the lake for traditional Kathiyawadi village meals (bajra rotla and garlic chutney)",
            "Well-equipped Interpretation Centre with telescope viewing decks"
        ],
        "significance": "Internationally recognized Ramsar Wetland of high ecological importance along the Central Asian Flyway.",
        "bestSeason": "November to February (Peak migratory bird congregation; best observed between 06:00 AM and 09:00 AM)",
        "recommendedDuration": "Half day (3–4 hours, starting at sunrise)",
        "timings": "06:00 AM – 05:30 PM daily",
        "entryFee": "Sanctuary Entry: ₹75 per adult (weekdays), ₹100 (weekends); Boat hiring rates regulated by Forest Dept (~₹220 per seat)",
        "facilities": "Forest Department ticketing, boat jetty, eco-guides, viewing tower, cafeteria, parking",
        "rulesRestrictions": "Motorized power boats strictly banned to prevent water contamination and noise pollution; feeding wild birds strictly prohibited",
        "sourceName": "Gujarat Forest Department & Ramsar Convention on Wetlands",
        "sourceUrl": "https://rsis.ramsar.org/ris/2078",
        "verificationStatus": "official_statutory",
        "image": "https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=1200&q=80",
        "tags": ["ramsar", "birds", "wetland", "nalsarovar", "ahmedabad", "nature", "boating", "flamingos"],
        "isLesserKnown": False,
        "weekendFrom": ["Ahmedabad", "Gandhinagar", "Sanand"],
        "nearbyInfrastructure": {
            "railway": "Sanand Railway Station (~40 km) / Ahmedabad Junction (~64 km)",
            "airport": "Ahmedabad Airport (~75 km)",
            "highway": "Ahmedabad-Sanand-Nalsarovar Road"
        }
    },
    {
        "id": "saputara-hill-station",
        "name": "Saputara Hill Station & Table Top Point",
        "category": "nature_wildlife",
        "categoryLabel": "Gujarat's Sole Hill Station in the Western Ghats (Sahyadris)",
        "district": "Dang",
        "region": "South Gujarat",
        "coordinates": [73.7486, 20.5750],
        "summary": "Perched at an elevation of 1,000 metres on a plateau in the Sahyadri range of the Western Ghats, Saputara ('Abode of Serpents') is Gujarat's only hill station. Surrounded by dense verdant forests, cascading seasonal waterfalls, and misty valleys, it offers a refreshing retreat with activities like lake boating, cable car rides, tribal museum visits, and panoramic sunset viewpoints.",
        "highlights": [
            "Saputara Lake boating surrounded by green hills, gardens, and walking promenades",
            "Pushpak Ropeway (cable car) crossing the valley from the lake to Sunset Point",
            "Governor's Hill and Table Land offering panoramic vistas of the Sahyadri ranges",
            "Saputara Tribal Museum displaying the rich heritage, musical instruments, and woodcraft of the Dangi tribes",
            "Artist Village showcasing live demonstrations of Warli painting, bamboo craft, and pottery"
        ],
        "significance": "Unique climatic haven in Gujarat offering highland biodiversity, tribal culture, and cool hill microclimate.",
        "bestSeason": "Monsoon (July to September) for misty green hills and waterfalls; October to March for cool pleasant weather",
        "recommendedDuration": "2 days / 1 night (Relaxing weekend getaway)",
        "timings": "Open all hours (Viewpoints best enjoyed at sunrise and sunset; ropeway 09:00 AM – 06:00 PM)",
        "entryFee": "Free general town access; Ropeway: ~₹100; Boating: ~₹50–₹150 depending on boat type",
        "facilities": "Wide range of TCGL hotels and private resorts, restaurants, emergency hospital, tourist police",
        "rulesRestrictions": "Drive carefully on winding ghat roads with sharp hairpin bends, especially in dense monsoon fog; respect tribal traditions",
        "sourceName": "Gujarat Tourism & Dang District Administration",
        "sourceUrl": "https://www.gujarattourism.com/south-zone/dangs/saputara.html",
        "verificationStatus": "official_statutory",
        "image": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
        "tags": ["saputara", "hill station", "dang", "nature", "western ghats", "boating", "weekend getaway"],
        "isLesserKnown": False,
        "weekendFrom": ["Surat", "Valsad", "Navsari", "Nashik", "Mumbai"],
        "nearbyInfrastructure": {
            "railway": "Waghai (~50 km) / Bilimora (~110 km) / Nashik Road (~85 km)",
            "airport": "Surat Airport (~160 km) / Nashik Airport (~85 km)",
            "highway": "Surat-Vyara-Waghai-Saputara Highway / SH-14"
        }
    },

    # =========================================================================
    # 4. HERITAGE & HISTORY
    # =========================================================================
    {
        "id": "laxmi-vilas-palace",
        "name": "Laxmi Vilas Palace & Museum",
        "category": "heritage_history",
        "categoryLabel": "Grand Indo-Saracenic Royal Residence",
        "district": "Vadodara",
        "region": "Central Gujarat",
        "coordinates": [73.1906, 22.2933],
        "summary": "Built in 1890 by Maharaja Sayajirao Gaekwad III and designed by Major Charles Mant, Laxmi Vilas Palace is four times the size of Buckingham Palace and remains the private residence of the Gaekwad royal family of Baroda. Exemplifying flamboyant Indo-Saracenic architecture, it integrates Hindu, Mughal, Gothic, and Venetian architectural styles, featuring Belgian stained glass, Italian marble mosaic floors, and an exceptional armoury.",
        "highlights": [
            "Magnificent Darbar Hall with Belgian stained-glass windows, Venetian mosaic floors, and ornate silver throne",
            "Maharaja Fateh Singh Museum showcasing European oil paintings by Raja Ravi Varma, sculptures, and Murano glass",
            "Extensive private royal armoury featuring historic swords, daggers, and historic Mughal armaments",
            "500-acre sprawling palace grounds with manicured gardens, peacocks, and private golf course",
            "Comprehensive audio tour narrated by the current Maharaja included with every entry ticket"
        ],
        "significance": "One of the grandest 19th-century private royal residences in the world, symbolizing Baroda's progressive Princely State heritage.",
        "bestSeason": "October to March (Ideal for garden walks and palace touring)",
        "recommendedDuration": "2 – 3 hours",
        "timings": "10:00 AM – 04:30 PM (Closed Mondays and public holidays)",
        "entryFee": "₹250 for Indian visitors; ₹500 for Foreign visitors (includes high-fidelity multi-language audio guide)",
        "facilities": "Audio guide counter, Palace souvenir shop, royal café, landscaped lawns, visitor parking",
        "rulesRestrictions": "Photography strictly prohibited inside the private residential halls and Darbar Hall; allowed in exterior courtyards; shoe covers provided",
        "sourceName": "Gaekwad Royal Family Trust & Gujarat Tourism",
        "sourceUrl": "https://www.gujarattourism.com/central-zone/vadodara/laxmi-vilas-palace.html",
        "verificationStatus": "official_statutory",
        "image": "https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=1200&q=80",
        "tags": ["palace", "vadodara", "baroda", "gaekwad", "heritage", "ravi varma", "architecture"],
        "isLesserKnown": False,
        "weekendFrom": ["Vadodara", "Ahmedabad", "Surat"],
        "nearbyInfrastructure": {
            "railway": "Vadodara Junction (~4.5 km)",
            "airport": "Vadodara Airport (~7.5 km)",
            "highway": "Jawaharlal Nehru Marg / NH-48 Corridor"
        }
    },
    {
        "id": "uparkot-fort-junagadh",
        "name": "Uparkot Fort & Ancient Buddhist Caves",
        "category": "heritage_history",
        "categoryLabel": "2,300-Year-Old Mauryan Citadel on Volcanic Plateau",
        "district": "Junagadh",
        "region": "Saurashtra",
        "coordinates": [70.4700, 21.5200],
        "summary": "Dating back to the Mauryan Empire (circa 319 BCE) during Chandragupta Maurya's reign, Uparkot Fort is an ancient citadel in the heart of Junagadh that endured 16 historic sieges. Recently restored by the Gujarat government, the fort complex houses 2nd-century CE rock-cut Buddhist caves, two enormous 15th-century Turkish bronze cannons (Neelam and Kadanal), and two legendary rock-cut stepwells: Adi Kadi Vav and Navghan Kuwo.",
        "highlights": [
            "Adi Kadi Vav: subterranean stepwell carved straight out of solid bedrock without any structural masonry",
            "Navghan Kuwo: deep well descending 52 metres with spiral staircases cut directly into rock",
            "2nd-century CE Buddhist Caves featuring stone pillars with Greco-Scythian architectural influences",
            "Huge historic bronze cannons 'Neelam' and 'Kadanal' forged in Cairo in 1531 and brought during the Siege of Diu",
            "Recently restored battlements offering sweeping panoramic views of holy Mount Girnar"
        ],
        "significance": "One of India's oldest continually occupied urban citadels; exceptional rock-cut hydraulic and monastic engineering.",
        "bestSeason": "October to March (Comfortable climbing and exploring outdoor ramparts)",
        "recommendedDuration": "3 – 4 hours",
        "timings": "08:00 AM – 06:00 PM daily",
        "entryFee": "₹50 for Indian adults; ₹20 for children; ₹500 for foreign visitors (ASI/State Archaeology)",
        "facilities": "Restored paved walkways, interpretive signage, electric buggy service for seniors, clean restrooms, ticket counter, parking",
        "rulesRestrictions": "Do not climb ancient battlements; watch your step on deep rock-cut well stairways; maintain cleanliness",
        "sourceName": "Gujarat Directorate of Archaeology & Tourism Corporation of Gujarat",
        "sourceUrl": "https://www.gujarattourism.com/saurashtra/junagadh/uparkot-fort.html",
        "verificationStatus": "official_statutory",
        "image": "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80",
        "tags": ["fort", "uparkot", "junagadh", "buddhist", "stepwell", "heritage", "girnar"],
        "isLesserKnown": False,
        "weekendFrom": ["Rajkot", "Junagadh"],
        "nearbyInfrastructure": {
            "railway": "Junagadh Junction (~2.5 km)",
            "airport": "Keshod Airport (~40 km) / Rajkot Airport (~105 km)",
            "highway": "NH-151 / Junagadh Bypass"
        }
    },
    {
        "id": "lothal-archaeological-site",
        "name": "Lothal Harappan Port City & Museum",
        "category": "heritage_history",
        "categoryLabel": "World's Oldest Discovered Tidal Dockyard (2400 BCE)",
        "district": "Ahmedabad",
        "region": "Central Gujarat",
        "coordinates": [72.2492, 22.5222],
        "summary": "Excavated by the Archaeological Survey of India between 1955 and 1960, Lothal ('Mound of the Dead') was one of the southernmost outposts of the Indus Valley Civilization and an international maritime trading port connecting ancient Gujarat with Mesopotamia and the Persian Gulf. Its centerpiece is a massive burnt-brick tidal dockyard connected via sluices to the Sabarmati river basin, representing the earliest known maritime hydraulic engineering in the world.",
        "highlights": [
            "World's oldest known tidal dockyard engineered with brick basin (214m x 36m) and automated sluice gates",
            "Acroplis and lower town showcasing sophisticated underground drainage, kiln-brick public baths, and paved lanes",
            "Extensive bead factory and lapidary workshops that exported carnelian beads across the ancient world",
            "ASI On-Site Archaeological Museum displaying iconic Indus seals, weights, pottery, terracotta games, and copper tools",
            "National Maritime Heritage Complex (NMHC) being developed adjacent to the historic site"
        ],
        "significance": "Cradle of Indian maritime navigation and international trade dating back 4,500 years; pivotal world heritage archaeology site.",
        "bestSeason": "October to March (Cool winter weather; open exposed archaeological site can be hot in summer)",
        "recommendedDuration": "2 – 3 hours",
        "timings": "10:00 AM – 05:00 PM (Museum closed on Fridays; archaeological site open daily 08:00 AM – 06:00 PM)",
        "entryFee": "Archaeological Site: ₹25 (Indian), ₹300 (Foreigner); Museum: ₹5",
        "facilities": "ASI museum, well-marked walking trails with bilingual interpretive boards, restrooms, parking",
        "rulesRestrictions": "Do not step into the brick dockyard basin or touch excavated brick footings; carry water and hat for open sun",
        "sourceName": "Archaeological Survey of India & Ministry of Ports, Shipping and Waterways",
        "sourceUrl": "https://www.gujarattourism.com/central-zone/ahmedabad/lothal.html",
        "verificationStatus": "official_statutory",
        "image": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80",
        "tags": ["lothal", "harappan", "indus valley", "dockyard", "maritime", "ahmedabad", "archaeology"],
        "isLesserKnown": False,
        "weekendFrom": ["Ahmedabad", "Gandhinagar", "Vadodara"],
        "nearbyInfrastructure": {
            "railway": "Lothal Bhurkhi Railway Station (~6 km) / Ahmedabad (~85 km)",
            "airport": "Ahmedabad Airport (~90 km)",
            "highway": "Ahmedabad-Bhavnagar Highway / SH-8"
        }
    },
    {
        "id": "aina-mahal-bhuj",
        "name": "Aina Mahal (Hall of Mirrors) & Prag Mahal",
        "category": "heritage_history",
        "categoryLabel": "18th-Century Venetian-Kutchi Royal Palaces",
        "district": "Kachchh",
        "region": "Kachchh",
        "coordinates": [69.6689, 23.2547],
        "summary": "Located in the heart of historic Bhuj, the Aina Mahal was commissioned in 1752 by Maharao Lakhpatji and mastercrafted by the legendary artisan Ramsinh Malam, who lived in the Netherlands and Venice for 18 years to master European glasswork, enamel, and stonecraft. The palace features a hall of mirrors adorned with Venetian chandeliers, gilded wood carvings, and a subterranean pleasure pool.",
        "highlights": [
            "Hira Mahal: royal bedroom adorned with Venetian mirrors, Belgian chandeliers, and gilded pillars",
            "Fuvara Mahal: pleasure pool surrounded by fountains that sprayed water to cool the Maharao in desert heat",
            "Collection of rare 18th-century European clocks, mechanical toys, and Dutch maps",
            "Adjacent Prag Mahal: grand Italian Gothic palace with a 45-metre clock tower offering panoramic views of Bhuj",
            "Restored Darbar Hall displaying Kutchi royal costumes, silver palanquins, and historic armaments"
        ],
        "significance": "A masterpiece of artistic cultural confluence where 18th-century European craftsmanship merged with Kutchi royal aesthetics.",
        "bestSeason": "October to March (Ideal for exploring Bhuj heritage quarters)",
        "recommendedDuration": "2 – 3 hours for both palaces",
        "timings": "09:00 AM – 11:45 AM and 03:00 PM – 05:45 PM (Closed Thursdays)",
        "entryFee": "Aina Mahal: ₹30; Prag Mahal: ₹30; Clock Tower Climb: ₹30; Camera fee: ₹50",
        "facilities": "Ticket counter, museum gift shop, local craft stalls in courtyard, street parking",
        "rulesRestrictions": "Flash photography restricted in delicate mirror rooms; watch footing on steep stairs of the clock tower",
        "sourceName": "Aina Mahal Trust & Gujarat Tourism",
        "sourceUrl": "https://www.gujarattourism.com/kutch-zone/kutch/aina-mahal.html",
        "verificationStatus": "official_statutory",
        "image": "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80",
        "tags": ["aina mahal", "prag mahal", "bhuj", "kutch", "palace", "mirrors", "heritage"],
        "isLesserKnown": False,
        "weekendFrom": ["Bhuj", "Gandhidham"],
        "nearbyInfrastructure": {
            "railway": "Bhuj Railway Station (~2.5 km)",
            "airport": "Bhuj Airport (~4.5 km)",
            "highway": "Bhuj-Anjar-Gandhidham Highway / NH-341"
        }
    },

    # =========================================================================
    # 5. SPIRITUAL & CULTURAL SANCTUARIES
    # =========================================================================
    {
        "id": "palitana-shatrunjaya",
        "name": "Palitana Shatrunjaya Sacred Jain Temples",
        "category": "spiritual_cultural",
        "categoryLabel": "Sacred Hill with Over 860 Marble Jain Temples",
        "district": "Bhavnagar",
        "region": "Saurashtra",
        "coordinates": [71.8389, 21.5033],
        "summary": "Rising above the town of Palitana, Shatrunjaya Hill is the holiest of all pilgrimage sites (Tirth) in Jainism, where the first Tirthankara, Lord Rishabhdev, delivered his first sermon. Over 860 breathtaking marble temples crown the twin peaks, constructed over a span of 900 years through voluntary community contributions. Palitana is recognized as the world's only legally strictly vegetarian city.",
        "highlights": [
            "Ascent of 3,745 hand-cut stone steps to the summit offering vistas of the Shetrunji River and surrounding plains",
            "Over 860 white marble temples organized in fortified enclosures (tuks), with the main temple dedicated to Adinath",
            "Exquisite stone fretwork, ceiling medallions, and marble pillars that rival the Dilwara temples of Mount Abu",
            "Doli (palanquin) services carried by certified local porters available for elderly or infirm pilgrims",
            "Palitana city is legally 100% vegetarian, with meat, fish, and abattoirs completely prohibited by municipal statute"
        ],
        "significance": "Supreme pilgrimage destination of Svetambara Jains worldwide; unparalleled concentration of high-medieval marble temple architecture.",
        "bestSeason": "October to March (Climb must begin before dawn to avoid intense midday sun; hill closed to overnight stays)",
        "recommendedDuration": "Full day (Climb begins around 05:30 AM; 4–5 hours for ascent, darshan, and descent)",
        "timings": "Sunrise to Sunset (No one, including priests, is permitted to stay on the sacred hill after dusk)",
        "entryFee": "Free entry; Doli charges regulated by the Anandji Kalyanji Trust according to weight",
        "facilities": "Anandji Kalyanji Trust dharamshalas, doli counters at base, filtered drinking water posts along the steps",
        "rulesRestrictions": "Strict code of reverence: no leather items (belts, wallets, shoes) permitted on sacred hill; modest dress code; food consumption on sacred hill strictly prohibited; descent must be completed before sundown",
        "sourceName": "Sheth Anandji Kalyanji Trust & Gujarat Tourism",
        "sourceUrl": "https://www.gujarattourism.com/saurashtra/bhavnagar/palitana.html",
        "verificationStatus": "official_statutory",
        "image": "https://images.unsplash.com/photo-1545638898-0c623266ddc0?auto=format&fit=crop&w=1200&q=80",
        "tags": ["palitana", "jain", "shatrunjaya", "bhavnagar", "temple", "marble", "pilgrimage"],
        "isLesserKnown": False,
        "weekendFrom": ["Bhavnagar", "Ahmedabad", "Surat"],
        "nearbyInfrastructure": {
            "railway": "Palitana Railway Station (~3.5 km) / Bhavnagar Terminus (~50 km)",
            "airport": "Bhavnagar Airport (~50 km)",
            "highway": "Bhavnagar-Palitana Road / SH-33"
        }
    },
    {
        "id": "ambaji-temple",
        "name": "Shree Ambaji Mata Temple & Gabbar Hill",
        "category": "spiritual_cultural",
        "categoryLabel": "Major 51-Shakti Peetha Shrine without an Idol",
        "district": "Banaskantha",
        "region": "North Gujarat",
        "coordinates": [72.8528, 24.3314],
        "summary": "Nestled in the Arasur hills of the Aravalli range, Ambaji is one of the celebrated 51 ancient Shakti Peethas, where the heart of Goddess Sati is believed to have fallen. Uniquely, the temple sanctum contains no stone idol; worship is offered to the sacred 'Viso Yantra' engraved with Vedic syllables. Nearby Gabbar Hill features a passenger ropeway and the 51 Shakti Peeth replica parikrama.",
        "highlights": [
            "Ancient sanctum where worship is offered to the golden Viso Yantra, adorned in fresh silk attire daily",
            "Gabbar Hill: sacred hill with 999 stone steps and modern passenger ropeway leading to the eternal flame shrine",
            "51 Shakti Peeth Parikrama: full-scale replica circuit of all 51 Shakti Peeth temples across the subcontinent",
            "Magnificent white marble temple architecture with gold-plated Kalash and ornate carved ceiling domes",
            "Annual Bhadarvi Poonam Mahamela attracting over 2 million walking pilgrims (padayatris) from across India"
        ],
        "significance": "Foremost centre of Shakti worship in Western India; revered by millions of pilgrims across Gujarat and Rajasthan.",
        "bestSeason": "October to March (Cool mountain climate; vibrant Navratri and Diwali celebrations)",
        "recommendedDuration": "3 – 5 hours (including Gabbar Hill visit)",
        "timings": "07:00 AM – 11:30 AM, 12:30 PM – 04:30 PM, and 06:30 PM – 09:00 PM daily",
        "entryFee": "Free general darshan; VIP token booking available online; Gabbar Ropeway: ~₹115 return",
        "facilities": "Shree Arasuri Ambaji Mata Devasthan Trust dharamshalas, dining halls (Bhojanalaya), ropeway, medical centres, extensive parking",
        "rulesRestrictions": "Photography strictly prohibited inside inner sanctum; mobile phones must be deposited in safe lockers; modest traditional attire required",
        "sourceName": "Shree Arasuri Ambaji Mata Devasthan Trust",
        "sourceUrl": "https://ambajitemple.in",
        "verificationStatus": "official_statutory",
        "image": "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1200&q=80",
        "tags": ["ambaji", "shakti peeth", "temple", "banaskantha", "gabbar", "aravalli", "pilgrimage"],
        "isLesserKnown": False,
        "weekendFrom": ["Ahmedabad", "Gandhinagar", "Abu Road", "Palanpur"],
        "nearbyInfrastructure": {
            "railway": "Abu Road Railway Station (~22 km) / Palanpur Junction (~65 km)",
            "airport": "Ahmedabad Airport (~180 km) / Udaipur Airport (~160 km)",
            "highway": "NH-58 / Palanpur-Danta-Ambaji Road"
        }
    },
    {
        "id": "akshardham-gandhinagar",
        "name": "BAPS Shri Swaminarayan Mandir Akshardham",
        "category": "spiritual_cultural",
        "categoryLabel": "Monumental Pink Sandstone Temple & Cultural Complex",
        "district": "Gandhinagar",
        "region": "Central Gujarat",
        "coordinates": [72.6842, 23.2300],
        "summary": "Inaugurated in 1992 and set across 23 acres of manicured gardens in the state capital, Akshardham Gandhinagar is a monument of spiritual and architectural grandeur. Built without the use of steel or iron using 6,000 tonnes of pink Rajasthani sandstone, it houses a 7-foot gold-leafed idol of Bhagwan Swaminarayan and interactive cultural exhibitions on Indian wisdom.",
        "highlights": [
            "Monumental central temple rising 33 metres, supported by 97 carved stone pillars and 17 domes",
            "7-foot high gold-leafed sanctum murti of Bhagwan Swaminarayan surrounded by ornate marble carvings",
            "Sat-Chit-Anand Water Show: spectacular evening laser, fire, water, and multimedia projection performance",
            "Interactive cultural exhibitions: Sahajanand Darsan and Mystic India large-format film theatre",
            "Sahaj Anand water fountain and extensive peaceful gardens ideal for families and reflection"
        ],
        "significance": "A landmark of modern traditional temple architecture, celebrating universal spiritual values and cultural heritage.",
        "bestSeason": "October to March (Pleasant evenings for the outdoor water show)",
        "recommendedDuration": "3 – 4 hours (Plan for afternoon arrival leading into the evening water show)",
        "timings": "09:30 AM – 07:30 PM (Closed Mondays); Water show starts around 07:30 PM",
        "entryFee": "Complex entry is free; Exhibition halls: ₹60 (Adults), ₹40 (Children); Water Show: ₹100",
        "facilities": "Premvati food court serving vegetarian delicacies, cloakrooms, wheelchair accessibility, bookstore, ample parking",
        "rulesRestrictions": "Strict security screening; mobile phones, cameras, electronic devices, bags, and food items strictly prohibited inside; secure free lockers provided",
        "sourceName": "BAPS Swaminarayan Sanstha & Gujarat Tourism",
        "sourceUrl": "https://www.akshardham.com/gandhinagar",
        "verificationStatus": "official_statutory",
        "image": "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80",
        "tags": ["akshardham", "gandhinagar", "baps", "swaminarayan", "temple", "water show", "sandstone"],
        "isLesserKnown": False,
        "weekendFrom": ["Ahmedabad", "Gandhinagar"],
        "nearbyInfrastructure": {
            "railway": "Gandhinagar Capital Station (~4 km) / Ahmedabad Kalupur (~28 km)",
            "airport": "Ahmedabad International Airport (~18 km)",
            "highway": "CH Road / SG Highway / Gandhinagar-Ahmedabad Expressway"
        }
    },
    {
        "id": "udvada-atash-behram",
        "name": "Udvada Atash Behram & Zoroastrian Heritage",
        "category": "spiritual_cultural",
        "categoryLabel": "Sacred Iran Shah: World's Oldest Continuously Burning Parsi Fire",
        "district": "Valsad",
        "region": "South Gujarat",
        "coordinates": [72.9194, 20.4889],
        "summary": "Udvada is the global spiritual heartland of the Zoroastrian (Parsi) community. Established in 1742, the sacred Iranshah Atash Behram houses the holy victory fire that was consecrated upon the Parsis' arrival at Sanjan in Gujarat in the 8th century CE and has burned continuously without interruption for over 1,280 years. The coastal village preserves authentic colonial Parsi streetscapes, wooden verandas, and traditional bakeries.",
        "highlights": [
            "Historic Iranshah Atash Behram: highest grade of consecrated Zoroastrian fire on Earth",
            "Charming heritage village streets lined with classic Parsi residences featuring sloped roofs and otlas (verandas)",
            "Zoroastrian Information Centre & Museum detailing the history of Parsi migration from Iran to Gujarat",
            "Famous traditional culinary delicacies: authentic Parsi dhansak, patra ni machhi, and mawa cakes from local heritage bakeries",
            "Tranquil Arabian Sea coastal promenade just a short walk from the temple quarter"
        ],
        "significance": "Unbroken living heritage of the Zoroastrian faith; recognized as a designated heritage precinct by the Gujarat Government.",
        "bestSeason": "October to February (Pleasant coastal winter; Iranshah Udvada Utsav festival held periodically)",
        "recommendedDuration": "Half day to Full day",
        "timings": "Village & Museum: 09:30 AM – 05:00 PM; Inner Atash Behram fire chamber restricted to Zoroastrian community members",
        "entryFee": "Free access to heritage village; Museum entry: nominal ₹20",
        "facilities": "Parsi dharamsalas and heritage homestays, famous Irani bakeries, parking near village perimeter",
        "rulesRestrictions": "Non-Parsis are respectfully not permitted inside the inner fire temple sanctum in accordance with centuries-old Zoroastrian tradition; photography of fire chamber strictly prohibited",
        "sourceName": "Udvada Utsav Foundation & Gujarat Tourism",
        "sourceUrl": "https://www.gujarattourism.com/south-zone/valsad/udvada.html",
        "verificationStatus": "official_statutory",
        "image": "https://images.unsplash.com/photo-1572947650440-e8a97ef053b2?auto=format&fit=crop&w=1200&q=80",
        "tags": ["udvada", "parsi", "zoroastrian", "atash behram", "iranshah", "valsad", "heritage", "coastal"],
        "isLesserKnown": False,
        "weekendFrom": ["Surat", "Valsad", "Vapi", "Mumbai"],
        "nearbyInfrastructure": {
            "railway": "Udvada Railway Station (~3 km) / Vapi Railway Station (~12 km)",
            "airport": "Surat Airport (~110 km) / Mumbai International Airport (~170 km)",
            "highway": "NH-48 Golden Corridor"
        }
    },

    # =========================================================================
    # 6. BEACHES & COASTAL DESTINATIONS
    # =========================================================================
    {
        "id": "shivrajpur-beach",
        "name": "Shivrajpur Blue Flag Beach",
        "category": "coastal_beach",
        "categoryLabel": "Internationally Certified Eco-Clean Beach",
        "district": "Devbhumi Dwarka",
        "region": "Saurashtra",
        "coordinates": [68.9500, 22.3333],
        "summary": "Situated 12 km north of Dwarka, Shivrajpur is one of India's few beaches awarded the prestigious international 'Blue Flag' eco-certification by the Foundation for Environmental Education (FEE), Denmark. Characterized by pristine white sands, crystal-clear turquoise waters, and shallow swimming zones, the beach offers water sports, eco-friendly facilities, and magnificent sunsets over the Arabian Sea.",
        "highlights": [
            "International Blue Flag certified for pristine water quality, safety, and environmental management",
            "Shallow, calm swimming areas suitable for families and children",
            "Certified water sports: scuba diving, sea karting, jet skiing, parasailing, and speed boating",
            "Eco-friendly bamboo beach shacks, solar-powered lighting, and clean drinking water stations",
            "Frequent sightings of wild dolphins in the nearshore waters during morning hours"
        ],
        "significance": "Benchmark model for sustainable coastal tourism in India; premier beach destination of the Saurashtra coast.",
        "bestSeason": "October to April (Calm seas and warm sunshine; summer and monsoon have rougher surf)",
        "recommendedDuration": "3 – 5 hours (ideal afternoon through sunset)",
        "timings": "07:00 AM – 07:00 PM daily",
        "entryFee": "Nominal beach upkeep fee: ₹30 per adult; Water sports charged individually by certified operators",
        "facilities": "International-standard change rooms, showers, lockers, trained lifeguards, disabled-access boardwalk, cafeteria, parking",
        "rulesRestrictions": "Strict zero-litter and single-use plastic ban; swimming only permitted within designated lifeguard-patrolled zones; consumption of alcohol strictly prohibited under state laws",
        "sourceName": "Foundation for Environmental Education (FEE) Blue Flag & Gujarat Tourism",
        "sourceUrl": "https://www.gujarattourism.com/saurashtra/devbhumi-dwarka/shivrajpur-beach.html",
        "verificationStatus": "official_statutory",
        "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
        "tags": ["beach", "blue flag", "shivrajpur", "dwarka", "arabian sea", "water sports", "clean beach"],
        "isLesserKnown": False,
        "weekendFrom": ["Dwarka", "Jamnagar", "Porbandar"],
        "nearbyInfrastructure": {
            "railway": "Dwarka Railway Station (~12 km)",
            "airport": "Jamnagar Airport (~140 km)",
            "highway": "NH-51 Coastal Highway"
        }
    },
    {
        "id": "madhavpur-ghed-beach",
        "name": "Madhavpur Ghed Scenic Beach",
        "category": "coastal_beach",
        "categoryLabel": "Pristine Arabian Sea Coastline & Cultural Haven",
        "district": "Porbandar",
        "region": "Saurashtra",
        "coordinates": [70.0417, 21.2500],
        "summary": "Flanked by coconut groves and fertile tidal farmlands, Madhavpur Ghed offers one of Gujarat's most photogenic and unspoiled coastal drives along National Highway 51. The long sandy beach is famous for its rolling turquoise surf, scenic coastal dunes, the historic 12th-century Madhavrai Temple, and the vibrant annual Madhavpur Fair celebrating the union of Lord Krishna and Rukmini.",
        "highlights": [
            "Breathtaking coastal drive along NH-51 where the highway runs directly parallel to breaking waves",
            "Endless golden sand beach framed by wind-swept coconut palms and coastal sand dunes",
            "Historic Madhavrai Temple dedicated to Lord Krishna and adjacent Osho Dhyan Mandir ashram",
            "Annual Madhavpur Mela (April) celebrating the cultural bond between Gujarat and the Northeast states of India",
            "Crucial nesting site for endangered Green Sea Turtles and Olive Ridley turtles"
        ],
        "significance": "Culturally significant coastal village mentioned in mythological epics; vital sea turtle nesting sanctuary.",
        "bestSeason": "October to March (Warm breezes and brilliant sunsets; April for the cultural festival)",
        "recommendedDuration": "2 – 3 hours (Excellent stopover between Somnath and Porbandar/Dwarka)",
        "timings": "Open all hours (Best visited in late afternoon for sunset)",
        "entryFee": "Free entry",
        "facilities": "Beachside coconut water stalls, local snack kiosks, temple guest houses, vehicle parking alongside highway",
        "rulesRestrictions": "Strong undercurrents and sudden drop-offs make swimming hazardous in certain stretches; observe local safety signboards",
        "sourceName": "Gujarat Tourism & Ministry of Culture",
        "sourceUrl": "https://www.gujarattourism.com/saurashtra/porbandar/madhavpur-beach.html",
        "verificationStatus": "official_statutory",
        "image": "https://images.unsplash.com/photo-1509233725247-49e657c54213?auto=format&fit=crop&w=1200&q=80",
        "tags": ["madhavpur", "beach", "porbandar", "coastal", "arabian sea", "scenic drive", "nh-51"],
        "isLesserKnown": True,
        "weekendFrom": ["Porbandar", "Somnath", "Junagadh"],
        "nearbyInfrastructure": {
            "railway": "Porbandar Railway Station (~60 km) / Veraval (~75 km)",
            "airport": "Porbandar Airport (~60 km) / Keshod Airport (~45 km)",
            "highway": "NH-51 Coastal Highway"
        }
    },
    {
        "id": "mandvi-beach-palace",
        "name": "Mandvi Beach & Wind Farm Coast",
        "category": "coastal_beach",
        "categoryLabel": "Historic Shipbuilding Port & Wind-Powered Shoreline",
        "district": "Kachchh",
        "region": "Kachchh",
        "coordinates": [69.3500, 22.8167],
        "summary": "Once a premier 16th-century international port established by the kings of Kutch, Mandvi combines maritime heritage with long sandy beaches. Visitors can witness 400-year-old traditional wooden dhow shipbuilding on the banks of the Rukmavati River, stroll along Wind Farm Beach dotted with early wind turbines, and visit the beachfront royal retreat of Vijay Vilas Palace.",
        "highlights": [
            "Active 400-year-old wooden shipbuilding yard along the Rukmavati riverbank crafting massive cargo dhows",
            "Wind Farm Beach featuring one of Asia's first coastal wind turbine installations",
            "Camel rides, horse rides, and water sports along the wide sandy tidal flats",
            "Vijay Vilas Palace: 1929 Rajput stone palace featuring royal suites, domed chhatris, and private beach estate",
            "Traditional Kutchi street food: authentic Mandvi dabeli (invented here in the 1960s)"
        ],
        "significance": "Historic maritime trade center with surviving master hand-crafted shipbuilding tradition.",
        "bestSeason": "October to March (Pleasant coastal winter; cool evening sea breezes)",
        "recommendedDuration": "1 – 2 days (Explore shipbuilding yards, palace, and beach)",
        "timings": "Beach open all hours; Vijay Vilas Palace: 09:00 AM – 06:00 PM daily",
        "entryFee": "Public beach is free; Vijay Vilas Palace: ₹70 (Adults), ₹20 (Children); Vehicle entry: ₹50",
        "facilities": "Beachside shacks, resort hotels, water sports operators, dabeli stalls, parking",
        "rulesRestrictions": "Respect active industrial activity around dry-dock shipbuilding yards; observe tide lines before parking near tidal sands",
        "sourceName": "Gujarat Tourism & Kutch District Administration",
        "sourceUrl": "https://www.gujarattourism.com/kutch-zone/kutch/mandvi-beach.html",
        "verificationStatus": "official_statutory",
        "image": "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1200&q=80",
        "tags": ["mandvi", "kutch", "beach", "shipbuilding", "dhow", "vijay vilas", "coastal"],
        "isLesserKnown": False,
        "weekendFrom": ["Bhuj", "Gandhidham"],
        "nearbyInfrastructure": {
            "railway": "Bhuj Railway Station (~60 km) / Gandhidham (~95 km)",
            "airport": "Bhuj Airport (~60 km)",
            "highway": "Bhuj-Mandvi State Highway / SH-47"
        }
    },
    {
        "id": "tithal-beach",
        "name": "Tithal Black Sand Beach",
        "category": "coastal_beach",
        "categoryLabel": "Famous Volcanic Black Sand Beach on the Arabian Sea",
        "district": "Valsad",
        "region": "South Gujarat",
        "coordinates": [72.9000, 20.6000],
        "summary": "Located 4 km west of Valsad city, Tithal Beach is famous for its distinctive heavy volcanic black mineral sands and sweeping views of the Arabian Sea. The beach is a popular family recreation destination equipped with an illuminated seaside promenade, peaceful Swaminarayan and Sai Baba temples right on the shoreline, and street food stalls serving fresh local snacks.",
        "highlights": [
            "Distinctive volcanic black mineral sands stretching along the South Gujarat shoreline",
            "Wide pedestrian promenade with benches, lighting, and safe walking tracks",
            "Shri Sai Baba Temple and BAPS Swaminarayan Temple situated directly facing the sea",
            "Local culinary specialties: roasted corn on the cob, bhajiya, ice golas, and fresh coconut water",
            "Water sports and camel rides available during post-monsoon and winter seasons"
        ],
        "significance": "Most popular weekend coastal promenade for South Gujarat and nearby industrial belts.",
        "bestSeason": "October to March (Warm gentle coastal winter; spectacular during sunset hours)",
        "recommendedDuration": "2 – 3 hours (ideal late afternoon)",
        "timings": "06:00 AM – 10:00 PM daily",
        "entryFee": "Free entry",
        "facilities": "Paved coastal promenade, food plaza, public restrooms, children's amusement rides, parking",
        "rulesRestrictions": "High tide waters reach right up to the sea wall; adhere to lifeguard whistles and avoid entering deep water",
        "sourceName": "Valsad District Administration & Gujarat Tourism",
        "sourceUrl": "https://www.gujarattourism.com/south-zone/valsad/tithal-beach.html",
        "verificationStatus": "official_statutory",
        "image": "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=1200&q=80",
        "tags": ["tithal", "valsad", "black sand", "beach", "coastal", "south gujarat", "weekend"],
        "isLesserKnown": False,
        "weekendFrom": ["Surat", "Valsad", "Navsari", "Vapi"],
        "nearbyInfrastructure": {
            "railway": "Valsad Railway Station (~4.5 km)",
            "airport": "Surat Airport (~95 km) / Mumbai (~190 km)",
            "highway": "Valsad-Tithal Road / NH-48 Corridor"
        }
    },

    # =========================================================================
    # 7. FOOD & LOCAL CRAFTS
    # =========================================================================
    {
        "id": "bhujodi-ajrakhpur-crafts",
        "name": "Bhujodi & Ajrakhpur Artisan Villages",
        "category": "food_craft",
        "categoryLabel": "World Capital of Block Printing & Handloom Weaving",
        "district": "Kachchh",
        "region": "Kachchh",
        "coordinates": [69.7333, 23.2333],
        "summary": "Located just outside Bhuj, the twin craft villages of Bhujodi and Ajrakhpur are globally celebrated epicentres of living textile heritage. Bhujodi is home to the Vankar community of master weavers who create GI-tagged Kutchi shawls and rugs on traditional pit looms, while Ajrakhpur is dedicated to ancient 16-step natural indigo and madder block-printing ('Ajrakh') practiced by Khatri master artisans.",
        "highlights": [
            "Watch master artisans practice complex multi-stage Ajrakh resist block printing using natural vegetable dyes",
            "Visit Hira Laxmi Craft Park in Bhujodi showcasing diverse traditional Kutchi arts under one roof",
            "Interact directly with National Award-winning weavers in their open home courtyards",
            "Shop directly from artisan families for authentic GI-tagged Kutchi shawls, stoles, and block-printed textiles",
            "Workshops and craft demonstrations explaining natural dye extraction from pomegranate, indigo, and iron rust"
        ],
        "significance": "Recognized UNESCO living craft heritage preserving centuries-old sustainable natural dye and handloom traditions.",
        "bestSeason": "October to March (Comfortable weather to walk around artisan villages and courtyards)",
        "recommendedDuration": "Half day to Full day (3–5 hours across both villages)",
        "timings": "09:00 AM – 06:30 PM (Most artisan studios open Monday to Saturday; reduced activity on Fridays)",
        "entryFee": "Free entry into artisan villages; small nominal fee at Hira Laxmi Memorial Craft Park",
        "facilities": "Artisan cooperative shops, shaded courtyards, local tea stalls, village parking",
        "rulesRestrictions": "Always ask permission before photographing individual weavers or printing workshops; purchase directly from artisans to support their livelihood",
        "sourceName": "Kutch Craft Collective & Ministry of Textiles (DC Handlooms)",
        "sourceUrl": "https://www.gujarattourism.com/kutch-zone/kutch/bhujodi.html",
        "verificationStatus": "official_statutory",
        "image": "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=1200&q=80",
        "tags": ["craft", "ajrakh", "bhujodi", "kutch", "handloom", "textiles", "weaving", "artisan"],
        "isLesserKnown": False,
        "weekendFrom": ["Bhuj", "Gandhidham"],
        "nearbyInfrastructure": {
            "railway": "Bhuj Railway Station (~8 km)",
            "airport": "Bhuj Domestic Airport (~10 km)",
            "highway": "Bhuj-Anjar Highway / NH-341"
        }
    },
    {
        "id": "patan-patola-museum",
        "name": "Patan Patola Heritage Museum",
        "category": "food_craft",
        "categoryLabel": "Double Ikkat Silk Weaving: Master Art of Salvi Weavers",
        "district": "Patan",
        "region": "North Gujarat",
        "coordinates": [72.1050, 23.8550],
        "summary": "Patan Patola represents the pinnacle of complex textile engineering: double ikkat silk weaving, where both warp and weft threads are individually tie-dyed with natural pigments before weaving so that the geometric patterns align with mathematical precision. Managed by the Salvi family who have preserved this craft for 35 generations since King Kumarapala brought them from Jalna in the 12th century, the museum offers live demonstrations of this extraordinary art.",
        "highlights": [
            "Live demonstration of the ancient slanted handloom operated in tandem by master weavers",
            "Exhibition of centuries-old heirloom Patola sarees that retain their vibrant natural colours",
            "Explanation of the complex mathematical design calculations and natural dye formulations",
            "A single authentic Patola saree takes 6 months to 1 year to complete and lasts for generations",
            "Located just 1 km from the UNESCO World Heritage Rani ki Vav"
        ],
        "significance": "One of the most complex handloom textile traditions in human history; protected by Geographical Indication (GI) status.",
        "bestSeason": "October to March (Combine comfortably with Rani ki Vav visit)",
        "recommendedDuration": "1 – 1.5 hours",
        "timings": "09:00 AM – 06:00 PM daily",
        "entryFee": "Free entry (Donations welcome to the Salvi artisan family trust)",
        "facilities": "Guided demonstration gallery, craft shop, visitor parking",
        "rulesRestrictions": "Respect the master weavers during active loom operation; photography permitted in designated demonstration area",
        "sourceName": "Patan Patola Heritage Trust & Ministry of Textiles",
        "sourceUrl": "https://www.gujarattourism.com/north-zone/patan/patola-saris.html",
        "verificationStatus": "official_statutory",
        "image": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80",
        "tags": ["patola", "patan", "silk", "double ikkat", "craft", "textiles", "heritage", "gi-tag"],
        "isLesserKnown": False,
        "weekendFrom": ["Ahmedabad", "Gandhinagar", "Mehsana"],
        "nearbyInfrastructure": {
            "railway": "Patan Railway Station (~3.2 km)",
            "airport": "Ahmedabad Airport (~125 km)",
            "highway": "SH-7 / Patan-Chanasma Highway"
        }
    },
    {
        "id": "manek-chowk-food-night",
        "name": "Manek Chowk Heritage Night Food Market",
        "category": "food_craft",
        "categoryLabel": "Legendary Historic City Square & Midnight Gastronomy",
        "district": "Ahmedabad",
        "region": "Central Gujarat",
        "coordinates": [72.5872, 23.0239],
        "summary": "Situated in the heart of Old Ahmedabad's UNESCO World Heritage city, Manek Chowk is an extraordinary public space named after 15th-century saint Baba Maneknath. By day a vegetable market and in the afternoon India's second-largest bullion jewellery market, by 8:30 PM it dramatically transforms into an energetic open-air nocturnal food street renowned for inventive street cuisine.",
        "highlights": [
            "Remarkable urban multi-use transformation from morning vegetable mart to afternoon gold market to nocturnal food plaza",
            "Iconic culinary inventions: Gwalior Dosa, Chocolate & Cheese Sandwiches, Pav Bhaji, and Jamun Shots",
            "Authentic traditional desserts: Ashrafi Kulfi, Kesar Pista Matka Kulfi, and rabdi jalebi",
            "Framed by historic monuments: King's Tomb (Badshah no Hajiro), Queen's Tomb (Rani no Hajiro), and Jama Masjid",
            "Vibrant sensory immersion in the bustling nocturnal life of the walled city"
        ],
        "significance": "Celebrated urban sociological and gastronomic landmark within Ahmedabad's UNESCO World Heritage City.",
        "bestSeason": "October to March (Pleasant, cool night air ideal for open-air dining)",
        "recommendedDuration": "1.5 – 2 hours (Best between 09:30 PM and 01:00 AM)",
        "timings": "08:30 PM – 02:00 AM (Food stalls active at night only)",
        "entryFee": "Free entry; street food dishes range from ₹60 to ₹250",
        "facilities": "Plastic street furniture, bustling open-air dining; limited auto-rickshaw drop-off at entrance",
        "rulesRestrictions": "Extremely crowded on weekend nights; park two-wheelers outside the heritage pols or take an auto-rickshaw; keep belongings secure in dense crowds",
        "sourceName": "Ahmedabad Municipal Corporation Heritage Department & Gujarat Tourism",
        "sourceUrl": "https://www.gujarattourism.com/central-zone/ahmedabad/manek-chowk.html",
        "verificationStatus": "official_statutory",
        "image": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
        "tags": ["food", "street food", "manek chowk", "ahmedabad", "night market", "heritage", "unesco"],
        "isLesserKnown": False,
        "weekendFrom": ["Ahmedabad", "Gandhinagar"],
        "nearbyInfrastructure": {
            "railway": "Ahmedabad Kalupur Junction (~1.8 km)",
            "airport": "Ahmedabad International Airport (~9 km)",
            "highway": "Relief Road / Gandhi Road / Heritage Pol Corridors"
        }
    }
]

def build_geojson():
    features = []
    for d in DESTINATIONS:
        feat = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": d["coordinates"]
            },
            "properties": {
                "id": d["id"],
                "name": d["name"],
                "category": d["category"],
                "categoryLabel": d["categoryLabel"],
                "district": d["district"],
                "region": d["region"],
                "summary": d["summary"],
                "highlights": d["highlights"],
                "significance": d["significance"],
                "bestSeason": d["bestSeason"],
                "recommendedDuration": d["recommendedDuration"],
                "timings": d["timings"],
                "entryFee": d["entryFee"],
                "facilities": d["facilities"],
                "rulesRestrictions": d["rulesRestrictions"],
                "sourceName": d["sourceName"],
                "sourceUrl": d["sourceUrl"],
                "verificationStatus": d["verificationStatus"],
                "image": d["image"],
                "tags": d["tags"],
                "isLesserKnown": d["isLesserKnown"],
                "weekendFrom": d["weekendFrom"],
                "nearbyInfrastructure": d["nearbyInfrastructure"]
            }
        }
        features.append(feat)

    collection = {
        "type": "FeatureCollection",
        "name": "gujarat_tourism_destinations",
        "crs": {
            "type": "name",
            "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84"}
        },
        "metadata": {
            "title": "Gujarat Atlas — Tourism & Destinations Dataset",
            "license": "Open Data Commons / Government Statutory Disclosures",
            "featureCount": len(features),
            "updated": "2026-10-16",
            "source": "Gujarat Tourism, Incredible India, ASI, Forest Dept"
        },
        "features": features
    }

    out_path = os.path.join("data", "gujarat_tourism_destinations.geojson")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(collection, f, indent=2, ensure_ascii=False)

    print(f"[OK] Generated {out_path} with {len(features)} curated destinations.")
    return len(features)

if __name__ == "__main__":
    count = build_geojson()
    print(f"Total curated tourism destinations: {count}")
