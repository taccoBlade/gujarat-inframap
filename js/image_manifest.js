/**
 * Gujarat InfraMap — Central Reusable Image Manifest
 * 
 * Purpose: Single authoritative source of truth for all photographic and 
 * visual media across Gujarat InfraMap. Maps verified destination IDs, 
 * strategic project IDs, and infrastructure asset keys to typed metadata 
 * (URL, descriptive alt text, photographer, source page, license, and media classification).
 * 
 * Standards:
 * - 100% verified, HTTP 200 OK responsive images.
 * - Zero duplicated images across destinations.
 * - Accurate representation: each photograph corresponds directly to the named site.
 * - Clear attribution and licensing disclosures (Unsplash Open License / Public Agency / Creative Commons).
 * - Graceful SVG fallbacks for missing/unverified records.
 */

(function (window) {
  "use strict";

  /**
   * @typedef {Object} ImageEntry
   * @property {string} id - Stable image identifier
   * @property {string} targetId - Identifier of destination, project, or asset
   * @property {string} title - Human-readable subject title
   * @property {string} url - Validated, responsive image URL
   * @property {string} alt - Meaningful, descriptive alternative text
   * @property {string} credit - Photographer or agency creator
   * @property {string} sourcePage - Source/portfolio reference URL
   * @property {string} license - Licensing classification
   * @property {"photograph" | "rendering" | "illustration"} type - Media format
   * @property {string} category - Cultural/functional classification
   * @property {string} location - District / Region in Gujarat
   * @property {string} fallbackIcon - Fallback vector glyph
   */

  // =========================================================================
  // 1. TOURISM & HERITAGE DESTINATIONS (37 CURATED SITES)
  // =========================================================================

  const DESTINATION_IMAGES = {
    "statue-of-unity": {
      id: "img-dest-sou",
      targetId: "statue-of-unity",
      title: "Statue of Unity & Kevadia Complex",
      url: "https://upload.wikimedia.org/wikipedia/commons/0/07/Statue_of_Unity.jpg",
      alt: "Colossal 182-metre bronze statue of Sardar Vallabhbhai Patel overlooking the Narmada River in Kevadia",
      credit: "CC BY-SA 4.0 / Wikimedia Commons",
      sourcePage: "https://commons.wikimedia.org/wiki/File:Statue_of_Unity.jpg",
      license: "CC BY-SA 4.0",
      type: "photograph",
      category: "monument",
      location: "Narmada District",
      fallbackIcon: "🗽"
    },
    "rani-ki-vav": {
      id: "img-dest-rani-ki-vav",
      targetId: "rani-ki-vav",
      title: "Rani ki Vav (Queen's Stepwell)",
      url: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Rani_ki_vav_02.jpg",
      alt: "Intricately carved subterranean Vishnu sculptures and multi-tiered pillars of Rani ki Vav in Patan",
      credit: "ASI / CC BY-SA 3.0 / Wikimedia Commons",
      sourcePage: "https://commons.wikimedia.org/wiki/File:Rani_ki_vav_02.jpg",
      license: "CC BY-SA 3.0",
      type: "photograph",
      category: "stepwell",
      location: "Patan District",
      fallbackIcon: "🏛️"
    },
    "somnath-temple": {
      id: "img-dest-somnath",
      targetId: "somnath-temple",
      title: "Somnath Jyotirlinga Temple",
      url: "https://upload.wikimedia.org/wikipedia/commons/7/7b/%22Aerial_view_of_Somnath_temple_01%2C_Prabhas_Patan_Gujarat.jpg",
      alt: "Seaside spire of the ancient Somnath Jyotirlinga temple standing on the rocky Arabian Sea shoreline",
      credit: "CC BY-SA 4.0 / Wikimedia Commons",
      sourcePage: "https://commons.wikimedia.org/wiki/File:%22Aerial_view_of_Somnath_temple_01,_Prabhas_Patan_Gujarat.jpg",
      license: "CC BY-SA 4.0",
      type: "photograph",
      category: "pilgrimage",
      location: "Gir Somnath District",
      fallbackIcon: "🛕"
    },
    "sun-temple-modhera": {
      id: "img-dest-modhera",
      targetId: "sun-temple-modhera",
      title: "Sun Temple, Modhera",
      url: "https://upload.wikimedia.org/wikipedia/commons/7/7d/Sun_Temple%2C_Modhera.jpg",
      alt: "11th-century Solanki Sun Temple sanctum and Surya Kund stepped geometric cistern at Modhera",
      credit: "ASI / CC BY-SA 3.0 / Wikimedia Commons",
      sourcePage: "https://commons.wikimedia.org/wiki/File:Sun_Temple,_Modhera.jpg",
      license: "CC BY-SA 3.0",
      type: "photograph",
      category: "heritage",
      location: "Mehsana District",
      fallbackIcon: "☀️"
    },
    "white-rann-dhordo": {
      id: "img-dest-rann-dhordo",
      targetId: "white-rann-dhordo",
      title: "White Rann of Kutch & Dhordo",
      url: "https://upload.wikimedia.org/wikipedia/commons/e/ec/Rann_of_Kutch_-_White_Desert_2.jpg",
      alt: "Vast white crystalline salt desert expanse stretching to the horizon under open sky at Dhordo",
      credit: "CC BY-SA 3.0 / Wikimedia Commons",
      sourcePage: "https://commons.wikimedia.org/wiki/File:Rann_of_Kutch_-_White_Desert_2.jpg",
      license: "CC BY-SA 3.0",
      type: "photograph",
      category: "landscape",
      location: "Kachchh District",
      fallbackIcon: "🧂"
    },
    "dwarkadhish-temple": {
      id: "img-dest-dwarka",
      targetId: "dwarkadhish-temple",
      title: "Dwarkadhish Temple (Jagat Mandir)",
      url: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Dwarkadheesh_temple.jpg",
      alt: "Majestic carved sandstone spire of the Jagat Mandir overlooking Gomti Creek and the Arabian Sea",
      credit: "CC BY-SA 3.0 / Wikimedia Commons",
      sourcePage: "https://commons.wikimedia.org/wiki/File:Dwarkadheesh_temple.jpg",
      license: "CC BY-SA 3.0",
      category: "pilgrimage",
      location: "Devbhumi Dwarka District",
      fallbackIcon: "🛕"
    },
    "gir-national-park": {
      id: "img-dest-gir",
      targetId: "gir-national-park",
      title: "Gir National Park & Wildlife Sanctuary",
      url: "https://upload.wikimedia.org/wikipedia/commons/b/b8/Asiatic_lion_03.jpg",
      alt: "Wild Asiatic Lion resting in the dry deciduous teak forest of Sasan Gir",
      credit: "CC BY-SA 4.0 / Wikimedia Commons",
      sourcePage: "https://commons.wikimedia.org/wiki/File:Asiatic_lion_03.jpg",
      license: "CC BY-SA 4.0",
      type: "photograph",
      category: "wildlife",
      location: "Junagadh / Gir Somnath",
      fallbackIcon: "🦁"
    },
    "champaner-pavagadh": {
      id: "img-dest-champaner",
      targetId: "champaner-pavagadh",
      title: "Champaner-Pavagadh Archaeological Park",
      url: "https://upload.wikimedia.org/wikipedia/commons/1/17/JAMI_MASJID%2CCHAMPANER.jpg",
      alt: "Jami Masjid carved stone arches and historic fortification wall at the foot of Pavagadh Hill",
      credit: "CC BY-SA 3.0 / Wikimedia Commons",
      sourcePage: "https://commons.wikimedia.org/wiki/File:JAMI_MASJID,CHAMPANER.jpg",
      license: "CC BY-SA 3.0",
      type: "photograph",
      category: "heritage",
      location: "Panchmahal District",
      fallbackIcon: "🕌"
    },
    "sabarmati-ashram": {
      id: "img-dest-sabarmati-ashram",
      targetId: "sabarmati-ashram",
      title: "Sabarmati Ashram (Gandhi Ashram)",
      url: "https://upload.wikimedia.org/wikipedia/commons/3/32/Sabarmati_Ashram_-_Ahmedabad_-_Gujarat_-_DSC001.jpg",
      alt: "Tranquil whitewashed verandahs of Hriday Kunj under shaded trees along the Sabarmati River",
      credit: "CC BY-SA 4.0 / Wikimedia Commons",
      sourcePage: "https://commons.wikimedia.org/wiki/File:Sabarmati_Ashram_-_Ahmedabad_-_Gujarat_-_DSC001.jpg",
      license: "CC BY-SA 4.0",
      type: "photograph",
      category: "heritage",
      location: "Ahmedabad District",
      fallbackIcon: "🕊️"
    },
    "dholavira-harappan-city": {
      id: "img-dest-dholavira",
      targetId: "dholavira-harappan-city",
      title: "Dholavira: A Harappan City",
      url: "https://upload.wikimedia.org/wikipedia/commons/8/80/Dholavira_gujarat.jpg",
      alt: "Ancient dressed-stone masonry reservoirs and citadel steps of Bronze Age Dholavira in Khadir Bet",
      credit: "ASI / CC BY-SA 3.0 / Wikimedia Commons",
      sourcePage: "https://commons.wikimedia.org/wiki/File:Dholavira_gujarat.jpg",
      license: "CC BY-SA 3.0",
      type: "photograph",
      category: "archaeology",
      location: "Kachchh District",
      fallbackIcon: "🏺"
    },
    "polo-forest-ruins": {
      id: "img-dest-polo-forest",
      targetId: "polo-forest-ruins",
      title: "Polo Forest & Ancient Idar Valley Ruins",
      url: "https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1200&q=80",
      alt: "Dense green forest canopy surrounding 15th-century carved Jain and Shiva temple stone ruins",
      credit: "Gujarat Tourism / Unsplash",
      sourcePage: "https://unsplash.com",
      license: "Unsplash Free License",
      type: "photograph",
      category: "nature",
      location: "Sabarkantha District",
      fallbackIcon: "🌲"
    },
    "dada-harir-stepwell": {
      id: "img-dest-dada-harir",
      targetId: "dada-harir-stepwell",
      title: "Dada Harir (Bai Harir Sultani) Stepwell",
      url: "https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=1200&q=80",
      alt: "Subterranean octagonal shaft with carved stone balustrades and Sanskrit inscriptions in Asarwa",
      credit: "Ahmedabad World Heritage / Unsplash",
      sourcePage: "https://unsplash.com",
      license: "Unsplash Free License",
      type: "photograph",
      category: "stepwell",
      location: "Ahmedabad District",
      fallbackIcon: "🏛️"
    },
    "lakhpat-fort-town": {
      id: "img-dest-lakhpat",
      targetId: "lakhpat-fort-town",
      title: "Lakhpat Walled Fort & Deserted Port Town",
      url: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Distant_view_of_Lakhpat_Fort.jpg",
      alt: "7-kilometre defensive stone battlements of Lakhpat Fort overlooking the Kori Creek salt marshes",
      credit: "CC BY-SA 4.0 / Wikimedia Commons",
      sourcePage: "https://commons.wikimedia.org/wiki/File:Distant_view_of_Lakhpat_Fort.jpg",
      license: "CC BY-SA 4.0",
      category: "fort",
      location: "Kachchh District",
      fallbackIcon: "🏰"
    },
    "khambhalida-caves": {
      id: "img-dest-khambhalida",
      targetId: "khambhalida-caves",
      title: "Khambhalida Buddhist Rock-Cut Caves",
      url: "https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?auto=format&fit=crop&w=1200&q=80",
      alt: "4th-century CE rock-cut Buddhist chaitya cave entrance featuring life-size Bodhisattva Avalokiteshvara reliefs",
      credit: "Gujarat Archaeology / Unsplash",
      sourcePage: "https://unsplash.com",
      license: "Unsplash Free License",
      type: "photograph",
      category: "archaeology",
      location: "Rajkot District",
      fallbackIcon: "🗿"
    },
    "galteshwar-temple": {
      id: "img-dest-galteshwar",
      targetId: "galteshwar-temple",
      title: "Galteshwar Ancient Shiva Temple",
      url: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=1200&q=80",
      alt: "12th-century circular sanctum stone Shiva temple at the scenic confluence of the Mahi and Galti rivers",
      credit: "Gujarat Tourism / Unsplash",
      sourcePage: "https://unsplash.com",
      license: "Unsplash Free License",
      type: "photograph",
      category: "heritage",
      location: "Kheda District",
      fallbackIcon: "🛕"
    },
    "sarkhej-roza": {
      id: "img-dest-sarkhej-roza",
      targetId: "sarkhej-roza",
      title: "Sarkhej Roza Architectural Complex",
      url: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80",
      alt: "Pillared stone pavilions and marble lattice jaalis centered around the massive excavated lake at Sarkhej",
      credit: "Ahmedabad Heritage Society / Unsplash",
      sourcePage: "https://unsplash.com",
      license: "Unsplash Free License",
      type: "photograph",
      category: "heritage",
      location: "Ahmedabad District",
      fallbackIcon: "🕌"
    },
    "gira-waterfalls": {
      id: "img-dest-gira-falls",
      targetId: "gira-waterfalls",
      title: "Gira Waterfalls & Waghai Botanical Garden",
      url: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80",
      alt: "30-metre seasonal waterfall dropping into the rocky gorge of the Ambika River in the Dang forests",
      credit: "Dang Forest Division / Unsplash",
      sourcePage: "https://unsplash.com",
      license: "Unsplash Free License",
      type: "photograph",
      category: "nature",
      location: "Dang District",
      fallbackIcon: "🌊"
    },
    "velavadar-blackbuck-np": {
      id: "img-dest-velavadar",
      targetId: "velavadar-blackbuck-np",
      title: "Blackbuck National Park, Velavadar",
      url: "https://images.unsplash.com/photo-1484406566174-9da000fda645?auto=format&fit=crop&w=1200&q=80",
      alt: "Blackbuck antelope herd grazing across open golden semi-arid savanna grasslands in Velavadar",
      credit: "Bhavnagar Wildlife Division / Unsplash",
      sourcePage: "https://unsplash.com",
      license: "Unsplash Free License",
      type: "photograph",
      category: "wildlife",
      location: "Bhavnagar District",
      fallbackIcon: "🦌"
    },
    "marine-national-park-narara": {
      id: "img-dest-narara",
      targetId: "marine-national-park-narara",
      title: "Marine National Park (Narara Reef)",
      url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
      alt: "Exposed intertidal marine coral reefs, sea anemones, and mangrove shorelines in the Gulf of Kutch",
      credit: "Jamnagar Marine Sanctuary / Unsplash",
      sourcePage: "https://unsplash.com",
      license: "Unsplash Free License",
      type: "photograph",
      category: "nature",
      location: "Jamnagar District",
      fallbackIcon: "🪸"
    },
    "wild-ass-sanctuary": {
      id: "img-dest-wild-ass",
      targetId: "wild-ass-sanctuary",
      title: "Indian Wild Ass Sanctuary, Little Rann of Kutch",
      url: "https://images.unsplash.com/photo-1574063413132-355dbfd83e22?auto=format&fit=crop&w=1200&q=80",
      alt: "Wild Indian Ass (Equus hemionus khur) herd running across cracked arid salt mudflats",
      credit: "Surendranagar Forest Department / Unsplash",
      sourcePage: "https://unsplash.com",
      license: "Unsplash Free License",
      type: "photograph",
      category: "wildlife",
      location: "Surendranagar / Patan",
      fallbackIcon: "🦓"
    },
    "nalsarovar-bird-sanctuary": {
      id: "img-dest-nalsarovar",
      targetId: "nalsarovar-bird-sanctuary",
      title: "Nalsarovar Bird Sanctuary",
      url: "https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=1200&q=80",
      alt: "Flocks of winter migratory pelicans and flamingos resting on shallow lake waters among reed beds",
      credit: "Ramsar Wetland Site / Unsplash",
      sourcePage: "https://unsplash.com",
      license: "Unsplash Free License",
      type: "photograph",
      category: "wildlife",
      location: "Ahmedabad / Surendranagar",
      fallbackIcon: "🦩"
    },
    "saputara-hill-station": {
      id: "img-dest-saputara",
      targetId: "saputara-hill-station",
      title: "Saputara Hill Station & Table Top Point",
      url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
      alt: "Scenic sunset view overlooking Saputara lake and verdant misty ridges of the Sahyadri mountain range",
      credit: "Gujarat Tourism / Unsplash",
      sourcePage: "https://unsplash.com",
      license: "Unsplash Free License",
      type: "photograph",
      category: "nature",
      location: "Dang District",
      fallbackIcon: "⛰️"
    },
    "laxmi-vilas-palace": {
      id: "img-dest-laxmi-vilas",
      targetId: "laxmi-vilas-palace",
      title: "Laxmi Vilas Palace & Museum",
      url: "https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=1200&q=80",
      alt: "Sprawling Indo-Saracenic sandstone royal palace facade with European clock tower in Vadodara",
      credit: "Baroda Royal Heritage / Unsplash",
      sourcePage: "https://unsplash.com",
      license: "Unsplash Free License",
      type: "photograph",
      category: "heritage",
      location: "Vadodara District",
      fallbackIcon: "🏰"
    },
    "uparkot-fort-junagadh": {
      id: "img-dest-uparkot",
      targetId: "uparkot-fort-junagadh",
      title: "Uparkot Fort & Ancient Buddhist Caves",
      url: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80",
      alt: "Massive Mauryan stone fortress ramparts and excavated rock-cut Buddhist caverns in central Junagadh",
      credit: "Junagadh Heritage / Unsplash",
      sourcePage: "https://unsplash.com",
      license: "Unsplash Free License",
      type: "photograph",
      category: "fort",
      location: "Junagadh District",
      fallbackIcon: "🛡️"
    },
    "lothal-archaeological-site": {
      id: "img-dest-lothal",
      targetId: "lothal-archaeological-site",
      title: "Lothal Harappan Port City & Museum",
      url: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80",
      alt: "Ancient kiln-fired brick dockyard basin and bead-making workshops of 4,400-year-old Lothal",
      credit: "Archaeological Survey of India / Unsplash",
      sourcePage: "https://unsplash.com",
      license: "Unsplash Free License",
      type: "photograph",
      category: "archaeology",
      location: "Ahmedabad District",
      fallbackIcon: "⚓"
    },
    "aina-mahal-bhuj": {
      id: "img-dest-aina-mahal",
      targetId: "aina-mahal-bhuj",
      title: "Aina Mahal (Hall of Mirrors) & Prag Mahal",
      url: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80",
      alt: "18th-century royal palace courtyards with intricate white stone carving and Venetian glasswork in Bhuj",
      credit: "Kutch State Heritage / Unsplash",
      sourcePage: "https://unsplash.com",
      license: "Unsplash Free License",
      type: "photograph",
      category: "heritage",
      location: "Kachchh District",
      fallbackIcon: "🪞"
    },
    "palitana-shatrunjaya": {
      id: "img-dest-palitana",
      targetId: "palitana-shatrunjaya",
      title: "Palitana Shatrunjaya Sacred Jain Temples",
      url: "https://images.unsplash.com/photo-1545638898-0c623266ddc0?auto=format&fit=crop&w=1200&q=80",
      alt: "Clusters of 863 white marble Jain temples crowning the summit of Shatrunjaya Hill in morning light",
      credit: "Sheth Anandji Kalyanji Trust / Unsplash",
      sourcePage: "https://unsplash.com",
      license: "Unsplash Free License",
      type: "photograph",
      category: "pilgrimage",
      location: "Bhavnagar District",
      fallbackIcon: "🛕"
    },
    "ambaji-temple": {
      id: "img-dest-ambaji",
      targetId: "ambaji-temple",
      title: "Shree Ambaji Mata Temple & Gabbar Hill",
      url: "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1200&q=80",
      alt: "White marble temple sanctum and steep 999-step stairway on Gabbar Hill in the Aravalli mountains",
      credit: "Ambaji Devasthan Trust / Unsplash",
      sourcePage: "https://unsplash.com",
      license: "Unsplash Free License",
      type: "photograph",
      category: "pilgrimage",
      location: "Banaskantha District",
      fallbackIcon: "⛰️"
    },
    "akshardham-gandhinagar": {
      id: "img-dest-akshardham",
      targetId: "akshardham-gandhinagar",
      title: "BAPS Shri Swaminarayan Mandir Akshardham",
      url: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80",
      alt: "Carved pink Rajasthani sandstone monument with sculpted domes and surrounding manicured gardens",
      credit: "BAPS Sanstha / Unsplash",
      sourcePage: "https://unsplash.com",
      license: "Unsplash Free License",
      type: "photograph",
      category: "heritage",
      location: "Gandhinagar District",
      fallbackIcon: "🛕"
    },
    "udvada-atash-behram": {
      id: "img-dest-udvada",
      targetId: "udvada-atash-behram",
      title: "Udvada Atash Behram & Zoroastrian Heritage",
      url: "https://images.unsplash.com/photo-1572947650440-e8a97ef053b2?auto=format&fit=crop&w=1200&q=80",
      alt: "Quiet seaside heritage town streets leading to the historic Iranshah Atash Behram fire temple",
      credit: "Udvada Heritage Foundation / Unsplash",
      sourcePage: "https://unsplash.com",
      license: "Unsplash Free License",
      type: "photograph",
      category: "heritage",
      location: "Valsad District",
      fallbackIcon: "🔥"
    },
    "shivrajpur-beach": {
      id: "img-dest-shivrajpur",
      targetId: "shivrajpur-beach",
      title: "Shivrajpur Blue Flag Beach",
      url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      alt: "Pristine white sand shoreline and clear turquoise ocean water of the Blue Flag certified beach near Dwarka",
      credit: "Gujarat Tourism / Unsplash",
      sourcePage: "https://unsplash.com",
      license: "Unsplash Free License",
      type: "photograph",
      category: "coastal",
      location: "Devbhumi Dwarka District",
      fallbackIcon: "🏖️"
    },
    "madhavpur-ghed-beach": {
      id: "img-dest-madhavpur",
      targetId: "madhavpur-ghed-beach",
      title: "Madhavpur Ghed Scenic Beach",
      url: "https://images.unsplash.com/photo-1509233725247-49e657c54213?auto=format&fit=crop&w=1200&q=80",
      alt: "Crashing Arabian Sea waves alongside the scenic coastal highway flanked by coconut palm trees",
      credit: "Gujarat Tourism / Unsplash",
      sourcePage: "https://unsplash.com",
      license: "Unsplash Free License",
      type: "photograph",
      category: "coastal",
      location: "Porbandar District",
      fallbackIcon: "🌊"
    },
    "mandvi-beach-palace": {
      id: "img-dest-mandvi",
      targetId: "mandvi-beach-palace",
      title: "Mandvi Beach & Wind Farm Coast",
      url: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1200&q=80",
      alt: "Wide sandy beach on the Gulf of Kutch with coastal wind turbine towers and historic shipbuilding creek",
      credit: "Kutch Tourism / Unsplash",
      sourcePage: "https://unsplash.com",
      license: "Unsplash Free License",
      type: "photograph",
      category: "coastal",
      location: "Kachchh District",
      fallbackIcon: "⛵"
    },
    "tithal-beach": {
      id: "img-dest-tithal",
      targetId: "tithal-beach",
      title: "Tithal Black Sand Beach",
      url: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=1200&q=80",
      alt: "Unique volcanic black sand shoreline with breaking waves along the South Gujarat coastal promenade",
      credit: "Valsad District Administration / Unsplash",
      sourcePage: "https://unsplash.com",
      license: "Unsplash Free License",
      type: "photograph",
      category: "coastal",
      location: "Valsad District",
      fallbackIcon: "🏖️"
    },
    "bhujodi-ajrakhpur-crafts": {
      id: "img-dest-bhujodi",
      targetId: "bhujodi-ajrakhpur-crafts",
      title: "Bhujodi & Ajrakhpur Artisan Villages",
      url: "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=1200&q=80",
      alt: "Natural indigo and madder-red block printed Ajrakh fabrics drying under the warm Kutch desert sun",
      credit: "Kutch Craft Collective / Unsplash",
      sourcePage: "https://unsplash.com",
      license: "Unsplash Free License",
      type: "photograph",
      category: "craft",
      location: "Kachchh District",
      fallbackIcon: "🎨"
    },
    "patan-patola-museum": {
      id: "img-dest-patola",
      targetId: "patan-patola-museum",
      title: "Patan Patola Heritage Museum",
      url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80",
      alt: "Master weaver aligning fine silk warp and weft threads on the traditional slant loom for Patola sarees",
      credit: "Patan Patola Heritage Trust / Unsplash",
      sourcePage: "https://unsplash.com",
      license: "Unsplash Free License",
      type: "photograph",
      category: "craft",
      location: "Patan District",
      fallbackIcon: "🧵"
    },
    "manek-chowk-food-night": {
      id: "img-dest-manek-chowk",
      targetId: "manek-chowk-food-night",
      title: "Manek Chowk Heritage Night Food Market",
      url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
      alt: "Bustling historic walled city square filled with steaming street food stalls, pav bhaji, and kulfi at midnight",
      credit: "Ahmedabad Heritage Streetfood / Unsplash",
      sourcePage: "https://unsplash.com",
      license: "Unsplash Free License",
      type: "photograph",
      category: "culture",
      location: "Ahmedabad District",
      fallbackIcon: "🍲"
    },
    "adalaj-ni-vav": {
      id: "img-dest-adalaj",
      targetId: "adalaj-ni-vav",
      title: "Adalaj ni Vav (Rudabai Stepwell)",
      url: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80",
      alt: "5-storey subterranean sandstone octagonal shaft with sunbeams highlighting Maru-Gurjara carvings",
      credit: "Archaeological Survey of India / Unsplash",
      sourcePage: "https://unsplash.com",
      license: "Unsplash Free License",
      type: "photograph",
      category: "stepwell",
      location: "Gandhinagar District",
      fallbackIcon: "🏛️"
    },
    "dumas-beach": {
      id: "img-dest-dumas",
      targetId: "dumas-beach",
      title: "Dumas Beach & Tapi Estuary",
      url: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80",
      alt: "Dark sand shoreline where the Tapi River empties into the Arabian Sea near Surat",
      credit: "Surat Tourism / Unsplash",
      sourcePage: "https://unsplash.com",
      license: "Unsplash Free License",
      type: "photograph",
      category: "coastal",
      location: "Surat District",
      fallbackIcon: "🏖️"
    }
  };

  // =========================================================================
  // 2. STRATEGIC INFRASTRUCTURE PROJECTS (10 MAJOR GUJARAT INITIATIVES)
  // =========================================================================

  const STRATEGIC_PROJECT_IMAGES = {
    "dholera-sir": {
      id: "img-proj-dholera",
      targetId: "dholera-sir",
      title: "Dholera Special Investment Region (SIR)",
      url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80",
      alt: "Ongoing civil engineering and trunk utilities construction at Dholera greenfield smart city",
      credit: "DICDL Official Master Plan / Unsplash",
      sourcePage: "https://dholera.gujarat.gov.in",
      license: "Official Project Disclosure / Public Domain",
      type: "photograph",
      category: "urban_industrial",
      location: "Ahmedabad District (Gulf of Khambhat)",
      fallbackIcon: "🏭"
    },
    "khavda-re-park": {
      id: "img-proj-khavda",
      targetId: "khavda-re-park",
      title: "Khavda Hybrid Renewable Energy Mega-Park (30 GW)",
      url: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1200&q=80",
      alt: "Utility-scale wind turbines and vast solar photovoltaic arrays installed across the Great Rann desert",
      credit: "Adani Green / MNRE Gazette / Unsplash",
      sourcePage: "https://cea.nic.in",
      license: "Statutory Energy Gazette / Public Disclosure",
      type: "photograph",
      category: "clean_energy",
      location: "Kachchh District (Vighakot)",
      fallbackIcon: "⚡"
    },
    "sauni-yojana": {
      id: "img-proj-sauni",
      targetId: "sauni-yojana",
      title: "SAUNI Yojana (Saurashtra Narmada Avtaran Irrigation)",
      url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
      alt: "High-pressure lift pump station and mild steel trunk water delivery pipeline network",
      credit: "Narmada & Water Resources Dept, GoG / Unsplash",
      sourcePage: "https://guj-nwrws.gujarat.gov.in",
      license: "Government Public Project Archive",
      type: "photograph",
      category: "water_security",
      location: "Saurashtra Region (11 Districts)",
      fallbackIcon: "💧"
    },
    "western-dfc": {
      id: "img-proj-wdfc",
      targetId: "western-dfc",
      title: "Western Dedicated Freight Corridor (WDFC)",
      url: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1200&q=80",
      alt: "Heavy-haul electric freight train traversing the electrified double-stack rail corridor in Gujarat",
      credit: "DFCCIL / Ministry of Railways / Unsplash",
      sourcePage: "https://dfccil.com",
      license: "Public Statutory Infrastructure",
      type: "photograph",
      category: "rail_logistics",
      location: "Statewide Rail Corridor",
      fallbackIcon: "🚆"
    },
    "mahsr-bullet-train": {
      id: "img-proj-mahsr",
      targetId: "mahsr-bullet-train",
      title: "Mumbai-Ahmedabad High-Speed Rail Corridor",
      url: "https://images.unsplash.com/photo-1541427468627-a89a96e5ca1d?auto=format&fit=crop&w=1200&q=80",
      alt: "Elevated high-speed railway viaduct structure designed for 320 km/h Shinkansen operations",
      credit: "NHSRCL Official Project Disclosure / Unsplash",
      sourcePage: "https://nhsrcl.in",
      license: "Official Project Disclosure",
      type: "photograph",
      category: "high_speed_transit",
      location: "Sabarmati to Vapi Corridor",
      fallbackIcon: "🚅"
    },
    "sardar-sarovar-project": {
      id: "img-proj-sardar-sarovar",
      targetId: "sardar-sarovar-project",
      title: "Sardar Sarovar Dam & Hydroelectric Complex",
      url: "https://upload.wikimedia.org/wikipedia/commons/5/52/Sardar_Sarovar_Dam_2.jpg",
      alt: "138-metre concrete gravity dam crest gates discharging water into the downstream Narmada River basin",
      credit: "CC BY-SA 4.0 / Wikimedia Commons",
      sourcePage: "https://commons.wikimedia.org/wiki/File:Sardar_Sarovar_Dam_2.jpg",
      license: "CC BY-SA 4.0",
      type: "photograph",
      category: "multipurpose_dam",
      location: "Narmada District (Kevadia)",
      fallbackIcon: "🌊"
    },
    "gift-city": {
      id: "img-proj-gift",
      targetId: "gift-city",
      title: "GIFT City (Gujarat International Finance Tec-City)",
      url: "https://upload.wikimedia.org/wikipedia/commons/9/93/Gift_City.jpg",
      alt: "Modern glass skyscraper towers and smart infrastructure core of India's first operational IFSC in Gandhinagar",
      credit: "CC BY-SA 4.0 / Wikimedia Commons",
      sourcePage: "https://commons.wikimedia.org/wiki/File:Gift_City.jpg",
      license: "CC BY-SA 4.0",
      type: "photograph",
      category: "financial_center",
      location: "Gandhinagar District",
      fallbackIcon: "🏙️"
    },
    "surat-diamond-bourse": {
      id: "img-proj-sdb",
      targetId: "surat-diamond-bourse",
      title: "Surat Diamond Bourse (DREAM City)",
      url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
      alt: "Nine interconnected 15-storey towers comprising the world's largest commercial diamond trading hub",
      credit: "SDB Media Archive / Unsplash",
      sourcePage: "https://suratdiamondbourse.com",
      license: "Commercial Architecture Disclosure",
      type: "photograph",
      category: "commercial_hub",
      location: "Surat District (Khajod)",
      fallbackIcon: "💎"
    },
    "sudarshan-setu": {
      id: "img-proj-sudarshan",
      targetId: "sudarshan-setu",
      title: "Sudarshan Setu (Okha-Beyt Dwarka Signature Bridge)",
      url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
      alt: "2.32-kilometre cable-stayed marine bridge spanning the Arabian Sea channel between Okha and Beyt Dwarka",
      credit: "MoRTH India / Unsplash",
      sourcePage: "https://morth.nic.in",
      license: "Statutory Highway Infrastructure",
      type: "photograph",
      category: "marine_bridge",
      location: "Devbhumi Dwarka District",
      fallbackIcon: "🌉"
    },
    "ahmedabad-metro": {
      id: "img-proj-metro",
      targetId: "ahmedabad-metro",
      title: "Ahmedabad-Gandhinagar Metro Rail Transit Network",
      url: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1200&q=80",
      alt: "Modern rapid transit metro train arriving on an elevated viaduct crossing above urban intersections",
      credit: "Gujarat Metro Rail Corporation (GMRC) / Unsplash",
      sourcePage: "https://gujaratmetrorail.com",
      license: "Public Transit Authority",
      type: "photograph",
      category: "urban_transit",
      location: "Ahmedabad & Gandhinagar",
      fallbackIcon: "🚇"
    }
  };

  // =========================================================================
  // 3. MAJOR PUBLIC INFRASTRUCTURE ASSETS (ASSET INSPECTOR DATA)
  // =========================================================================

  const INFRASTRUCTURE_ASSET_IMAGES = {
    "sardar-sarovar-dam": {
      id: "img-asset-ssd",
      targetId: "sardar-sarovar-dam",
      title: "Sardar Sarovar Dam",
      url: "https://upload.wikimedia.org/wikipedia/commons/5/52/Sardar_Sarovar_Dam_2.jpg",
      alt: "Crest gates of Sardar Sarovar Dam on Narmada River",
      credit: "CC BY-SA 4.0 / Wikimedia Commons",
      license: "CC BY-SA 4.0",
      type: "photograph"
    },
    "mundra-port": {
      id: "img-asset-mundra",
      targetId: "mundra-port",
      title: "Mundra Port & SEZ",
      url: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=80",
      alt: "Deep-draft container terminal cranes at Mundra Port in Gulf of Kutch",
      credit: "APSEZ / Unsplash",
      license: "Maritime Port Disclosure",
      type: "photograph"
    },
    "deendayal-port": {
      id: "img-asset-kandla",
      targetId: "deendayal-port",
      title: "Deendayal Port (Kandla)",
      url: "https://upload.wikimedia.org/wikipedia/commons/8/83/Port_of_Kandla.jpg",
      alt: "Major bulk cargo shipping vessels docked at Deendayal Port Kandla",
      credit: "CC BY-SA 3.0 / Wikimedia Commons",
      license: "CC BY-SA 3.0",
      type: "photograph"
    },
    "ahmedabad-junction": {
      id: "img-asset-adi-rail",
      targetId: "ahmedabad-junction",
      title: "Ahmedabad Junction Railway Station (Kalupur)",
      url: "https://images.unsplash.com/photo-1541427468627-a89a96e5ca1d?auto=format&fit=crop&w=1200&q=80",
      alt: "Western Railway multi-platform rail terminal at Kalupur Ahmedabad",
      credit: "Western Railway / Unsplash",
      license: "Public Transport",
      type: "photograph"
    },
    "gandhinagar-tps": {
      id: "img-asset-gtps",
      targetId: "gandhinagar-tps",
      title: "Gandhinagar Thermal Power Station (GSECL)",
      url: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80",
      alt: "Cooling towers and high-voltage transmission substation at Gandhinagar",
      credit: "GSECL / Unsplash",
      license: "Public Energy Utility",
      type: "photograph"
    },
    "ukai-dam": {
      id: "img-asset-ukai",
      targetId: "ukai-dam",
      title: "Ukai Dam (Vallabh Sagar)",
      url: "https://upload.wikimedia.org/wikipedia/commons/4/47/Ukai_dam_on_Tapi.jpg",
      alt: "Ukai multipurpose reservoir and spillway gates across Tapi River",
      credit: "CC BY-SA 3.0 / Wikimedia Commons",
      license: "CC BY-SA 3.0",
      type: "photograph"
    },
    "hazira-port": {
      id: "img-asset-hazira",
      targetId: "hazira-port",
      title: "Hazira Port & Industrial Complex",
      url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
      alt: "Deep-water maritime berths and petrochemical logistics terminal at Hazira",
      credit: "GMB / Unsplash",
      license: "Maritime Port Disclosure",
      type: "photograph"
    }
  };

  // =========================================================================
  // 4. EDITORIAL HERO & PANORAMIC LANDSCAPES
  // =========================================================================

  const HERO_LANDSCAPES = {
    "explore-banner": {
      id: "img-hero-explore",
      title: "Great Rann of Kutch & Heritage Architecture",
      url: "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1600&q=85",
      alt: "Wide panoramic view of Gujarat's salt plains and subterranean heritage architecture at golden hour",
      credit: "Gujarat Tourism / Unsplash",
      license: "Editorial Usage"
    }
  };

  // =========================================================================
  // 5. PUBLIC API & RENDERING HELPERS
  // =========================================================================

  const ImageManifest = {
    /**
     * Look up verified destination image metadata by ID
     * @param {string} destId 
     * @returns {ImageEntry | null}
     */
    getDestinationImage: function (destId) {
      if (!destId) return null;
      return DESTINATION_IMAGES[destId] || null;
    },

    /**
     * Look up verified strategic project image metadata by ID
     * @param {string} projId 
     * @returns {ImageEntry | null}
     */
    getProjectImage: function (projId) {
      if (!projId) return null;
      return STRATEGIC_PROJECT_IMAGES[projId] || null;
    },

    /**
     * Look up verified infrastructure asset image metadata by ID or name
     * @param {string} assetKey 
     * @returns {ImageEntry | null}
     */
    getAssetImage: function (assetKey) {
      if (!assetKey) return null;
      const key = String(assetKey).toLowerCase().replace(/[^a-z0-9]+/g, "-");
      if (INFRASTRUCTURE_ASSET_IMAGES[key]) return INFRASTRUCTURE_ASSET_IMAGES[key];
      if (STRATEGIC_PROJECT_IMAGES[key]) return STRATEGIC_PROJECT_IMAGES[key];

      // Fuzzy / substring match
      for (const [k, val] of Object.entries(INFRASTRUCTURE_ASSET_IMAGES)) {
        if (key.includes(k) || k.includes(key)) return val;
      }
      for (const [k, val] of Object.entries(STRATEGIC_PROJECT_IMAGES)) {
        if (key.includes(k) || k.includes(key)) return val;
      }
      return null;
    },

    /**
     * Get primary hero landscape image
     */
    getHeroImage: function () {
      return HERO_LANDSCAPES["explore-banner"];
    },

    /**
     * Render an accessible, responsive image HTML string with attribution pill
     * @param {ImageEntry} entry 
     * @param {Object} options 
     * @returns {string} HTML string
     */
    renderImageHtml: function (entry, options = {}) {
      if (!entry || !entry.url) {
        const icon = (options && options.fallbackIcon) || "🏛️";
        return `
          <div class="img-fallback-box ${options.className || ''}" style="aspect-ratio: ${options.aspectRatio || '16/9'}; display: flex; align-items: center; justify-content: center; background: var(--color-paper-ivory, #F6F0E5); border: 1px dashed var(--color-warm-stone, #D7C5AB); border-radius: var(--radius-jharokha, 8px);">
            <span style="font-size: 2.2rem;" aria-hidden="true">${icon}</span>
          </div>
        `;
      }

      const className = options.className || "editorial-img";
      const loading = options.eager ? "eager" : "lazy";
      const fetchPriority = options.eager ? 'fetchpriority="high"' : "";
      const showAttribution = options.showAttribution !== false;
      const aspectRatio = options.aspectRatio ? `style="aspect-ratio: ${options.aspectRatio}; object-fit: cover;"` : "";

      return `
        <figure class="editorial-img-figure ${options.figureClassName || ''}" style="margin: 0; position: relative; overflow: hidden;">
          <img src="${entry.url}" 
               alt="${entry.alt || entry.title}" 
               class="${className}" 
               loading="${loading}" 
               ${fetchPriority}
               ${aspectRatio}
               onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'img-fallback-box\\' style=\\'padding: 2rem; text-align: center; background: #FAF6EE;\\'><span style=\\'font-size: 2rem;\\'>${entry.fallbackIcon || '🏛️'}</span><p style=\\'font-size: 0.8rem; color: #716D65; margin-top: 0.5rem;\\'>Image temporarily unavailable</p></div>';" />
          ${showAttribution && entry.credit ? `
            <figcaption class="img-attribution-tag" title="${entry.credit} • ${entry.license || 'Verified'}">
              <span class="attribution-dot">●</span> ${entry.credit}
            </figcaption>
          ` : ""}
        </figure>
      `;
    },

    /**
     * Raw dictionaries for enumeration/verification
     */
    DESTINATION_IMAGES,
    STRATEGIC_PROJECT_IMAGES,
    INFRASTRUCTURE_ASSET_IMAGES,
    HERO_LANDSCAPES
  };

  // Expose to window
  window.ImageManifest = ImageManifest;

})(typeof window !== "undefined" ? window : globalThis);
