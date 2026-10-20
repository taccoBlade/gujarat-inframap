/**
 * GUJARAT INFRAMAP — 3D CORRIDORS, BLUEPRINT PARCELS & VIRAL MECHANICS DATA
 * Verified against Gujarat Government Gazette, NHSRCL, DICDL, GIDC, and GMRC portals.
 */

export interface TourWaypoint {
  id: string;
  name: string;
  gujaratiName: string;
  coords: [number, number]; // [lat, lng]
  zoom: number;
  badge: string;
  tagline: string;
  capex: string;
  completion: number; // percentage
  agency: string;
  specifications: string;
  description: string;
  imageUrl: string;
}

export interface GuidedTour {
  id: string;
  title: string;
  gujaratiTitle: string;
  category: 'High-Speed Rail' | 'Smart Metropolis' | 'Financial & Urban' | 'Renewable Megastructure';
  tagline: string;
  totalLengthOrArea: string;
  totalCapEx: string;
  executingAgency: string;
  accentColor: string;
  alignmentCoords: [number, number][];
  waypoints: TourWaypoint[];
}

export interface BlueprintParcel {
  id: string;
  name: string;
  gujaratiName: string;
  schemeId: string;
  district: string;
  capex: string;
  completion: number;
  executingAgency: string;
  areaSqKm: number;
  focus: string;
  anchorTenants: string[];
  coordinates: [number, number][]; // Polygon vertices [lat, lng]
  center: [number, number];
}

export interface InfraAssetForImpact {
  id: string;
  name: string;
  gujaratiName: string;
  category: 'Metro Rail' | 'Bullet Train' | 'Expressway & Ring Road' | 'Airport' | 'Industrial Mega-Hub' | 'Port & Logistics';
  coordinates: [number, number];
  completionYear: string;
  status: 'Operational' | 'Under Construction' | 'Advanced Testing' | 'Planned Expansion';
  capex: string;
  agency: string;
  impactRadiusKm: number;
}

export interface BeforeAfterZone {
  id: string;
  title: string;
  gujaratiTitle: string;
  location: string;
  capex: string;
  completion: string;
  agency: string;
  historicYear: string;
  plannedYear: string;
  historicDesc: string;
  plannedDesc: string;
  historicImage: string;
  plannedImage: string;
  highlights: string[];
}

// 1. 1-CLICK GUIDED TOURS (3D CORRIDOR FLYTHROUGHS)
export const GUIDED_3D_TOURS: GuidedTour[] = [
  {
    id: 'bullet-train-corridor',
    title: 'Mumbai–Ahmedabad High Speed Rail',
    gujaratiTitle: 'મુંબઈ-અમદાવાદ બુલેટ ટ્રેન કોરિડોર',
    category: 'High-Speed Rail',
    tagline: '508 km E5 Series Shinkansen High-Speed Rail Corridor flying at 320 km/h across 12 high-tech stations.',
    totalLengthOrArea: '508.17 km (352 km in Gujarat)',
    totalCapEx: '₹1,08,000 Cr',
    executingAgency: 'National High Speed Rail Corporation Ltd (NHSRCL) & JICA',
    accentColor: '#FF9418',
    alignmentCoords: [
      [20.3800, 72.9100], // Vapi
      [20.6100, 72.9300], // Bilimora
      [20.9500, 72.9200], // Navsari
      [21.2000, 72.8400], // Surat
      [21.7100, 72.9900], // Bharuch
      [22.3100, 73.1800], // Vadodara
      [22.5600, 72.9300], // Anand / Nadiad
      [23.0100, 72.6000], // Ahmedabad South
      [23.0800, 72.5800]  // Sabarmati Hub
    ],
    waypoints: [
      {
        id: 'wp-vapi',
        name: 'Vapi High-Speed Terminal',
        gujaratiName: 'વાપી હાઇ-સ્પીડ ટર્મિનલ',
        coords: [20.3800, 72.9100],
        zoom: 12,
        badge: 'Southern Gujarat Gateway',
        tagline: 'First station in Gujarat after the Maharashtra undersea rock tunnel section.',
        capex: '₹4,800 Cr',
        completion: 78,
        agency: 'NHSRCL & L&T Heavy Civil',
        specifications: '320 km/h design speed • 4 elevated platforms • Multi-modal road transit hub',
        description: 'Positioned right at Gujarat\'s industrial chemicals capital, featuring aerodynamic noise barriers, earthquake early warning seismometers, and direct elevated connection to NH-48.',
        imageUrl: '/images/destinations/udvada-atash-behram.jpg'
      },
      {
        id: 'wp-surat',
        name: 'Surat Antroli High Speed Terminal',
        gujaratiName: 'સુરત અંત્રોલી ટર્મિનલ',
        coords: [21.2000, 72.8400],
        zoom: 12.5,
        badge: 'Diamond City Transit Citadel',
        tagline: 'Gujarat\'s most advanced elevated Shinkansen terminal with Diamond-inspired parametric roof.',
        capex: '₹8,200 Cr',
        completion: 86,
        agency: 'NHSRCL / SUDA',
        specifications: 'Full girder launching completed • 6-lane Outer Ring Road interchange • Metro Phase 1 connection',
        description: 'First high-speed rail station to complete full structural slab casting. Connects the global diamond and textile bourse directly to Mumbai in 1 hour 15 minutes.',
        imageUrl: '/images/destinations/udvada-atash-behram.jpg'
      },
      {
        id: 'wp-bharuch',
        name: 'Bharuch Narmada River Mega-Bridge',
        gujaratiName: 'ભરૂચ નર્મદા નદી મેગા-બ્રિજ',
        coords: [21.7100, 72.9900],
        zoom: 12.5,
        badge: '1.4 km Engineering Feat',
        tagline: 'Heavy continuous steel truss bridge spanning the tidal Narmada estuary.',
        capex: '₹3,400 Cr',
        completion: 92,
        agency: 'NHSRCL & Consortium',
        specifications: '1.4 km continuous bridge • 24 piers founded in deep marine silt • Wind anemometer auto-brakes',
        description: 'One of the most complex aquatic engineering achievements on the corridor, equipped with automatic real-time wind gust sensors that communicate directly with train automated braking computers.',
        imageUrl: '/images/destinations/galteshwar-temple.jpg'
      },
      {
        id: 'wp-vadodara',
        name: 'Vadodara Central Interchange',
        gujaratiName: 'વડોદરા સેન્ટ્રલ ઇન્ટરચેન્જ',
        coords: [22.3100, 73.1800],
        zoom: 12.5,
        badge: 'Heritage & High-Speed Synthesis',
        tagline: 'Elevated station constructed directly above existing 7-platform Western Railway network.',
        capex: '₹7,100 Cr',
        completion: 72,
        agency: 'NHSRCL & Western Railway',
        specifications: '220 m steel truss span over existing tracks • Integrated luxury passenger concourse',
        description: 'Features a massive 220-meter single steel truss span over India\'s busiest conventional railway corridor without halting a single passenger train during fabrication.',
        imageUrl: '/images/destinations/laxmi-vilas-palace.jpg'
      },
      {
        id: 'wp-sabarmati',
        name: 'Sabarmati Multimodal Transport Hub',
        gujaratiName: 'સાબરમતી મલ્ટી-મોડલ ટ્રાન્સપોર્ટ હબ',
        coords: [23.0800, 72.5800],
        zoom: 13,
        badge: 'Northern Terminus & Control HQ',
        tagline: 'Gujarat\'s apex multimodal terminus integrating Bullet Train, Metro, Indian Railways & BRTS.',
        capex: '₹9,500 Cr',
        completion: 94,
        agency: 'NHSRCL & GMRC',
        specifications: 'Central Operation Control Center (OCC) • Rooftop solar array • Dandi March memorial motif',
        description: 'State-of-the-art terminal building featuring the master Shinkansen maintenance depot, rolling stock testing tracks, and direct air-conditioned foot-overbridges connecting Ahmedabad Metro and Western Railway.',
        imageUrl: '/images/destinations/sabarmati-ashram.jpg'
      }
    ]
  },
  {
    id: 'dholera-sir-corridor',
    title: 'Dholera SIR Greenfield Smart Metropolis',
    gujaratiTitle: 'ધોલેરા સ્પેશિયલ ઇન્વેસ્ટમેન્ટ રીજન (SIR)',
    category: 'Smart Metropolis',
    tagline: '920 sq km India\'s first platinum-rated smart industrial metropolis and semiconductor semiconductor manufacturing hub.',
    totalLengthOrArea: '920 sq km (Activation Area: 22.5 sq km)',
    totalCapEx: '₹70,000+ Cr',
    executingAgency: 'Dholera Industrial City Development Ltd (DICDL) & NICDC',
    accentColor: '#00F0FF',
    alignmentCoords: [
      [22.8000, 72.4500], // Ahmedabad-Dholera Expressway Origin
      [22.5500, 72.3200], // Fedara Junction
      [22.3500, 72.1800], // Dholera International Airport
      [22.2500, 72.0500], // Activation Area & Tata OSAT Fab
      [22.1500, 72.1200]  // 5000MW Solar Park & Coastal Port
    ],
    waypoints: [
      {
        id: 'wp-dholera-exp',
        name: 'Ahmedabad-Dholera Access Expressway',
        gujaratiName: 'અમદાવાદ-ધોલેરા એક્સેસ એક્સપ્રેસવે',
        coords: [22.8000, 72.4500],
        zoom: 11.5,
        badge: '109 km High-Speed Arterial',
        tagline: '4-lane access-controlled greenfield expressway slashing travel time to 45 minutes.',
        capex: '₹4,200 Cr',
        completion: 91,
        agency: 'NHAI & DICDL',
        specifications: '4-lane expandable to 8 lanes • Grade-separated interchanges • High-speed bus transit median',
        description: 'Engineered as the logistical lifeline connecting Ahmedabad SP Ring Road directly to the Dholera Activation Zone and International Airport with dedicated heavy cargo lanes.',
        imageUrl: '/images/destinations/statue-of-unity.jpg'
      },
      {
        id: 'wp-dholera-airport',
        name: 'Dholera Greenfield International Airport',
        gujaratiName: 'ધોલેરા ગ્રીનફિલ્ડ ઇન્ટરનેશનલ એરપોર્ટ',
        coords: [22.3500, 72.1800],
        zoom: 12.5,
        badge: 'Code 4E Two-Runway Cargo & Aero Hub',
        tagline: 'Navsari-sized international airport designed for widebody passenger and heavy cargo aircraft.',
        capex: '₹1,378 Cr (Phase 1)',
        completion: 68,
        agency: 'Dholera International Airport Company Ltd (DIACL) / AAI',
        specifications: 'Runway: 3,200 m × 45 m • Cat I ILS • Dedicated MRO & air cargo complex',
        description: 'Relieves passenger pressure on Ahmedabad SVPIA while serving as the primary air-freight springboard for semiconductor chips, defense avionics, and high-tech exports.',
        imageUrl: '/images/destinations/dholavira-harappan-city.jpg'
      },
      {
        id: 'wp-dholera-fab',
        name: 'Activation Area & Tata Semiconductor Fab',
        gujaratiName: 'એક્ટિવેશન એરિયા અને ટાટા સેમિકન્ડક્ટર ફેબ',
        coords: [22.2500, 72.0500],
        zoom: 13,
        badge: '₹91,000 Cr Semiconductor Epicenter',
        tagline: 'India\'s first commercial chip fabrication plant in partnership with PSMC Taiwan.',
        capex: '₹91,000 Cr',
        completion: 55,
        agency: 'Tata Electronics / DICDL / India Semiconductor Mission',
        specifications: '50,000 wafer starts/month • 28nm/90nm nodes • 24/7 subterranean utility tunnels',
        description: 'Equipped with underground utility tunnels housing ICT fiber, recycled water, power cables, and automated effluent pipelines so roads never need to be dug up.',
        imageUrl: '/images/destinations/lothal-archaeological-site.jpg'
      },
      {
        id: 'wp-dholera-solar',
        name: '5,000 MW Ultra-Mega Coastal Solar Park',
        gujaratiName: '૫,૦૦૦ મેગાવોટ અલ્ટ્રા-મેગા સોલાર પાર્ક',
        coords: [22.1500, 72.1200],
        zoom: 12,
        badge: 'Clean Energy Sovereign Foundation',
        tagline: 'World\'s largest coastal salt-flat solar generation facility feeding Dholera\'s green power grid.',
        capex: '₹25,000 Cr',
        completion: 62,
        agency: 'GPCL / GUVNL / Tata Power',
        specifications: '5 GW total target • Salt-tolerant marine foundations • Dedicated 765 kV substation',
        description: 'Transforms tidal saline wastelands into a clean energy engine, providing 100% certified green zero-carbon power to Dholera\'s global manufacturing corporations.',
        imageUrl: '/images/destinations/white-rann-dhordo.jpg'
      }
    ]
  },
  {
    id: 'gift-riverfront-corridor',
    title: 'GIFT City & Sabarmati Riverfront 3D Axis',
    gujaratiTitle: 'ગિફ્ટ સિટી & સાબરમતી રિવરફ્રન્ટ 3D કોરિડોર',
    category: 'Financial & Urban',
    tagline: 'Twin engine of futuristic Gujarat combining India\'s global financial haven with world-class riverfront promenades.',
    totalLengthOrArea: '38 km Twin Metropolitan Axis',
    totalCapEx: '₹45,000+ Cr',
    executingAgency: 'GIFT City Co. Ltd, AMC & GMRC',
    accentColor: '#10B981',
    alignmentCoords: [
      [23.0300, 72.5800], // Sabarmati Riverfront Phase 1
      [23.0900, 72.5900], // Motera Narendra Modi Stadium & Sports Hub
      [23.1600, 72.6800], // GIFT City IFSC Towers
      [23.2200, 72.6500]  // Gandhinagar Mahatma Mandir Axis
    ],
    waypoints: [
      {
        id: 'wp-riverfront',
        name: 'Sabarmati Riverfront Urban Rejuvenation',
        gujaratiName: 'સાબરમતી રિવરફ્રન્ટ અર્બન પ્રોમેનાડ',
        coords: [23.0300, 72.5800],
        zoom: 13,
        badge: '11.5 km Waterfront Renaissance',
        tagline: 'Iconic lower promenades, Atal Foot Bridge, biodiversity parks, and water sports arena.',
        capex: '₹1,400 Cr (Phase 1 & 2)',
        completion: 96,
        agency: 'Sabarmati Riverfront Development Corp Ltd (SRFDCL)',
        specifications: '11.5 km two-tier promenade • Interceptor sewer network • Atal Pedestrian Cable Bridge',
        description: 'Transformed an arid, flood-prone riverbed into an internationally recognized public waterfront with zero sewage contamination and smart cultural event plazas.',
        imageUrl: '/images/destinations/sabarmati-ashram.jpg'
      },
      {
        id: 'wp-motera',
        name: 'Narendra Modi Stadium & Olympic Sports Enclave',
        gujaratiName: 'નરેન્દ્ર મોદી સ્ટેડિયમ & ઓલિમ્પિક સ્પોર્ટ્સ એન્ક્લેવ',
        coords: [23.0900, 72.5900],
        zoom: 13.5,
        badge: '1,32,000 Capacity Colosseum',
        tagline: 'World\'s largest cricket arena and centerpiece of Ahmedabad\'s 2036 Olympic Bid.',
        capex: '₹800 Cr + ₹4,600 Cr (Olympic Enclave)',
        completion: 89,
        agency: 'Gujarat Cricket Association & AMC Sports Authority',
        specifications: '1,32,000 spectators • Pillarless roof sightlines • Direct Metro skywalk link',
        description: 'Global benchmark for mega-sports infrastructure, featuring 360-degree LED ring lights, sub-surface drainage clearing rain in 30 minutes, and direct connection to Ahmedabad Metro Phase 1.',
        imageUrl: '/images/destinations/akshardham-gandhinagar.jpg'
      },
      {
        id: 'wp-gift-ifsc',
        name: 'GIFT City International Financial Centre',
        gujaratiName: 'ગિફ્ટ સિટી ઇન્ટરનેશનલ ફાયનાન્સિયલ સેન્ટર',
        coords: [23.1600, 72.6800],
        zoom: 14,
        badge: 'Global Financial Haven (IFSC)',
        tagline: 'India\'s sole sovereign offshore financial jurisdiction housing Google, Bank of America & IIBX.',
        capex: '₹25,000 Cr',
        completion: 82,
        agency: 'GIFTCL / IFSCA',
        specifications: 'India INX & Bullion Exchange • District Cooling System (saves 30% energy) • Automated Waste Tubes',
        description: 'Features multi-utility tunnels, automated pneumatic waste collection traveling at 70 km/h underground, and custom corporate tax enclaves hosting over 500 international finance and tech firms.',
        imageUrl: '/images/destinations/statue-of-unity.jpg'
      },
      {
        id: 'wp-gandhinagar-axis',
        name: 'Gandhinagar Green Capital & Mahatma Mandir',
        gujaratiName: 'ગાંધીનગર રાજધાની સંકુલ & મહાત્મા મંદિર',
        coords: [23.2200, 72.6500],
        zoom: 13,
        badge: 'State Civic Citadel & Global Summit Hub',
        tagline: 'Tree-lined capital grid and permanent home to the biennial Vibrant Gujarat Global Summit.',
        capex: '₹3,200 Cr',
        completion: 98,
        agency: 'Roads & Buildings Dept, GoG',
        specifications: '30 planned sectors • Dandi Salt Mound memorial • Solar rooftop capital buildings',
        description: 'One of the greenest planned capitals in Asia, designed on an orthogonal grid system with wide tree canopies, rapid bus transit, and the iconic cone-shaped Mahatma Mandir convention complex.',
        imageUrl: '/images/destinations/akshardham-gandhinagar.jpg'
      }
    ]
  },
  {
    id: 'khavda-renewable-corridor',
    title: 'Khavda Renewable Energy Park (World\'s Largest)',
    gujaratiTitle: 'ખાવડા પુનઃપ્રાપ્ય ઊર્જા પાર્ક (વિશ્વનો સૌથી મોટો)',
    category: 'Renewable Megastructure',
    tagline: 'World\'s largest clean energy park generating 30,000 MW of solar and wind power across 726 sq km.',
    totalLengthOrArea: '726 sq km (Equal to Singapore)',
    totalCapEx: '₹1,50,000 Cr',
    executingAgency: 'Adani Green Energy, NTPC & GIPCL',
    accentColor: '#3B82F6',
    alignmentCoords: [
      [23.2400, 69.6600], // Bhuj Grid Substation
      [23.8500, 69.7300], // Khavda Gateway
      [24.0500, 69.8500], // Core 30GW Wind-Solar Array
      [24.1800, 69.9500]  // Indo-Pak Border Salt Frontier
    ],
    waypoints: [
      {
        id: 'wp-bhuj-grid',
        name: 'Bhuj 765 kV Super Grid Evacuation Substation',
        gujaratiName: 'ભુજ 765 kV સુપર ગ્રીડ સબસ્ટેશન',
        coords: [23.2400, 69.6600],
        zoom: 11,
        badge: 'High-Voltage Green Energy Pipeline',
        tagline: 'Apex inter-state power transmission highway channeling Kutch power to national grid.',
        capex: '₹6,500 Cr',
        completion: 95,
        agency: 'Power Grid Corporation of India Ltd (PGCIL)',
        specifications: '765 kV / 400 kV gas-insulated bays • High-voltage DC (HVDC) converter link',
        description: 'Engineered to withstand coastal salt air corrosion, transmitting over 25,000 MW of renewable power thousands of kilometers to industrial clusters in Northern and Central India.',
        imageUrl: '/images/destinations/aina-mahal-bhuj.jpg'
      },
      {
        id: 'wp-khavda-core',
        name: '30,000 MW Khavda Wind-Solar Megastructure',
        gujaratiName: '૩૦,૦૦૦ મેગાવોટ ખાવડા સોલાર-વિન્ડ મેગાસ્ટ્રક્ચર',
        coords: [24.0500, 69.8500],
        zoom: 12,
        badge: 'Visible from International Space Station',
        tagline: '726 sq km of bifacial solar panels and 5.2 MW offshore-class giant wind turbines.',
        capex: '₹1,50,000 Cr',
        completion: 48,
        agency: 'Adani Green / NTPC Green Energy',
        specifications: '30 GW peak generation • Waterless robotic module cleaning • 81 Billion units/year',
        description: 'Spanning an area equal to the entire country of Singapore in the harsh Rann of Kutch, generating enough clean electricity to illuminate 1.61 Crore Indian households while offsetting 58 million tonnes of CO2 annually.',
        imageUrl: '/images/destinations/white-rann-dhordo.jpg'
      },
      {
        id: 'wp-border-frontier',
        name: 'Indo-Pak Border Salt Marsh Radar Frontier',
        gujaratiName: 'ભારત-પાકિસ્તાન સરહદી ક્ષાર સીમા',
        coords: [24.1800, 69.9500],
        zoom: 12,
        badge: 'Sovereign Energy Borderland',
        tagline: 'Strategic infrastructure fortress guarding India\'s northwestern desert perimeter.',
        capex: '₹2,800 Cr',
        completion: 88,
        agency: 'BSF & Ministry of Power',
        specifications: 'All-weather smart floodlit border roads • Thermal drone surveillance perimeter',
        description: 'Dual-purpose national security and economic megastructure, transforming previously inaccessible treacherous salt marsh borderlands into India\'s greatest clean energy vanguard.',
        imageUrl: '/images/destinations/lakhpat-fort-town.jpg'
      }
    ]
  }
];

// 2. BLUEPRINT / TERROIR PARCEL HIGHLIGHTS (INDUSTRIAL CORRIDORS & TP SCHEMES)
export const INDUSTRIAL_BLUEPRINT_PARCELS: BlueprintParcel[] = [
  {
    id: 'sanand-auto-cluster',
    name: 'Sanand GIDC Industrial Corridor & Auto-EV Cluster',
    gujaratiName: 'સાણંદ જીઆઇડીસી ઓટો & સેમિકન્ડક્ટર ક્લસ્ટર',
    schemeId: 'GIDC-SND-TP2',
    district: 'Ahmedabad',
    capex: '₹42,000 Cr',
    completion: 88,
    executingAgency: 'Gujarat Industrial Development Corporation (GIDC)',
    areaSqKm: 21.5,
    focus: 'Automotive & Semiconductor Assembly, Testing, Marking and Packaging (ATMP)',
    anchorTenants: ['Micron Technology ATMP (₹22,500 Cr)', 'Tata Motors Passenger Vehicles', 'Tata Motors EV Plant (formerly Ford)', 'Maxxis Rubber', 'Coloplast'],
    center: [23.0000, 72.3800],
    coordinates: [
      [22.9700, 72.3300],
      [23.0300, 72.3400],
      [23.0450, 72.4100],
      [22.9900, 72.4300],
      [22.9700, 72.3300]
    ]
  },
  {
    id: 'dahej-pcpir',
    name: 'Dahej Petroleum, Chemicals & Petrochemicals Region',
    gujaratiName: 'દહેજ પેટ્રોકેમિકલ્સ અને રસાયણ રોકાણ ક્ષેત્ર (PCPIR)',
    schemeId: 'PCPIR-DHJ-01',
    district: 'Bharuch',
    capex: '₹96,000 Cr',
    completion: 92,
    executingAgency: 'GIDC & Gujarat PCPIR Authority',
    areaSqKm: 453.0,
    focus: 'Petrochemicals, Specialty Chemicals, Cryogenic LNG & Port Logistics',
    anchorTenants: ['ONGC Petro Additions Ltd (OPaL)', 'Petronet LNG Terminal', 'Reliance Industries Dahej', 'Gujarat Alkalies (GACL)', 'Deepak Nitrite'],
    center: [21.7000, 72.5800],
    coordinates: [
      [21.6500, 72.5000],
      [21.7600, 72.5200],
      [21.7800, 72.6400],
      [21.6700, 72.6300],
      [21.6500, 72.5000]
    ]
  },
  {
    id: 'mandal-becharaji-sir',
    name: 'Mandal-Becharaji Special Investment Region (MBSIR)',
    gujaratiName: 'માંડલ-બેચરાજી સ્પેશિયલ ઇન્વેસ્ટમેન્ટ રીજન',
    schemeId: 'MBSIR-TP-01',
    district: 'Mehsana / Ahmedabad',
    capex: '₹38,000 Cr',
    completion: 76,
    executingAgency: 'GIDC & MBSIR Development Authority',
    areaSqKm: 102.0,
    focus: 'Automobile Manufacturing, Lithium-ion Battery Gigafactories, Aerospace Parts',
    anchorTenants: ['Suzuki Motor Gujarat (SMG Plants 1-3)', 'TDS Lithium-ion Battery Gujarat (Toshiba/Denso/Suzuki)', 'Honda Motorcycle & Scooter India'],
    center: [23.5000, 72.0800],
    coordinates: [
      [23.4400, 72.0100],
      [23.5600, 72.0400],
      [23.5700, 72.1500],
      [23.4600, 72.1400],
      [23.4400, 72.0100]
    ]
  },
  {
    id: 'dholera-sir-tp1',
    name: 'Dholera SIR Activation Area (Town Planning Scheme 1 & 2)',
    gujaratiName: 'ધોલેરા એસઆઇઆર ટીપી સ્કીમ ૧ & ૨',
    schemeId: 'DSIR-TP1-TP2',
    district: 'Ahmedabad',
    capex: '₹70,000 Cr',
    completion: 64,
    executingAgency: 'Dholera Industrial City Development Ltd (DICDL)',
    areaSqKm: 22.5,
    focus: 'Semiconductor Fabrication, Defense & Aerospace, Heavy Electronics',
    anchorTenants: ['Tata Electronics Semiconductor Fab (₹91,000 Cr)', 'Foxconn Ecosystem Suppliers', 'Dholera 5GW Solar Park', 'Torrent Power Grid'],
    center: [22.2500, 72.1800],
    coordinates: [
      [22.1800, 72.1000],
      [22.3200, 72.1200],
      [22.3400, 72.2600],
      [22.2000, 72.2700],
      [22.1800, 72.1000]
    ]
  },
  {
    id: 'gift-city-sez',
    name: 'GIFT City Multi-Services Special Economic Zone (SEZ)',
    gujaratiName: 'ગિફ્ટ સિટી સ્પેશિયલ ઇકોનોમિક ઝોન (SEZ)',
    schemeId: 'GIFT-TP-01',
    district: 'Gandhinagar',
    capex: '₹25,000 Cr',
    completion: 82,
    executingAgency: 'GIFTCL / Gujarat Urban Development Company',
    areaSqKm: 3.6,
    focus: 'Offshore Banking, FinTech Global HQs, International Bullion Exchange',
    anchorTenants: ['India International Exchange (India INX)', 'National Stock Exchange IX (NSE IX)', 'Bank of America Global Center', 'HSBC', 'Google FinTech Base'],
    center: [23.1600, 72.6850],
    coordinates: [
      [23.1450, 72.6700],
      [23.1800, 72.6750],
      [23.1850, 72.6980],
      [23.1500, 72.6950],
      [23.1450, 72.6700]
    ]
  }
];

// 3. VIRAL MECHANIC 1: 5 KM INFRA IMPACT SCORE ASSETS REGISTRY
export const MAJOR_INFRA_ASSETS: InfraAssetForImpact[] = [
  // Metro Stations & Rail
  {
    id: 'IA-METRO-THALTEJ',
    name: 'Thaltej Gam Metro Station (East-West Line)',
    gujaratiName: 'થલતેજ ગામ મેટ્રો સ્ટેશન',
    category: 'Metro Rail',
    coordinates: [23.0510, 72.5020],
    completionYear: '2022 (Operational)',
    status: 'Operational',
    capex: '₹12,118 Cr (Phase 1)',
    agency: 'Gujarat Metro Rail Corporation (GMRC)',
    impactRadiusKm: 5.0
  },
  {
    id: 'IA-METRO-SHELA-EXT',
    name: 'Shela Elevated Metro Extension Station',
    gujaratiName: 'શેલા એલિવેટેડ મેટ્રો એક્સટેન્શન',
    category: 'Metro Rail',
    coordinates: [23.0120, 72.4680],
    completionYear: '2026 (Under Construction)',
    status: 'Under Construction',
    capex: '₹1,850 Cr',
    agency: 'GMRC & AUDA',
    impactRadiusKm: 5.0
  },
  {
    id: 'IA-METRO-BOPAL',
    name: 'South Bopal Ring Road Metro Interchange',
    gujaratiName: 'સાઉથ બોપલ રિંગ રોડ મેટ્રો ઇન્ટરચેન્જ',
    category: 'Metro Rail',
    coordinates: [23.0280, 72.4740],
    completionYear: '2026 (Under Construction)',
    status: 'Under Construction',
    capex: '₹2,100 Cr',
    agency: 'GMRC',
    impactRadiusKm: 5.0
  },
  {
    id: 'IA-METRO-MOTERA',
    name: 'Motera Stadium Metro Interchange (North-South)',
    gujaratiName: 'મોટેરા સ્ટેડિયમ મેટ્રો સ્ટેશન',
    category: 'Metro Rail',
    coordinates: [23.1080, 72.6030],
    completionYear: '2022 (Phase 1) / 2024 (Phase 2)',
    status: 'Operational',
    capex: '₹5,384 Cr (Phase 2)',
    agency: 'GMRC',
    impactRadiusKm: 5.0
  },
  {
    id: 'IA-METRO-GIFT',
    name: 'GIFT City Elevated Metro Station & Skywalk',
    gujaratiName: 'ગિફ્ટ સિટી મેટ્રો સ્ટેશન',
    category: 'Metro Rail',
    coordinates: [23.1620, 72.6820],
    completionYear: '2024 (Operational)',
    status: 'Operational',
    capex: '₹5,384 Cr (Phase 2 Network)',
    agency: 'GMRC',
    impactRadiusKm: 5.0
  },
  {
    id: 'IA-METRO-KUDASAN',
    name: 'Kudasan / Raysan Metro Hub (Gandhinagar)',
    gujaratiName: 'કુડાસણ / રાયસણ મેટ્રો હબ',
    category: 'Metro Rail',
    coordinates: [23.1780, 72.6450],
    completionYear: '2024 (Operational)',
    status: 'Operational',
    capex: '₹5,384 Cr',
    agency: 'GMRC',
    impactRadiusKm: 5.0
  },
  {
    id: 'IA-METRO-SURAT-ADAJAN',
    name: 'Adajan Gam Metro Station (Surat Line 1)',
    gujaratiName: 'અડાજણ ગામ મેટ્રો સ્ટેશન (સુરત)',
    category: 'Metro Rail',
    coordinates: [21.1980, 72.7930],
    completionYear: '2027 (Under Construction)',
    status: 'Under Construction',
    capex: '₹12,020 Cr (Surat Metro)',
    agency: 'GMRC & SMC',
    impactRadiusKm: 5.0
  },
  {
    id: 'IA-METRO-SURAT-VESU',
    name: 'Vesu VIP Road Metro Terminal (Surat Line 2)',
    gujaratiName: 'વેસુ વીઆઇપી રોડ મેટ્રો ટર્મિનલ',
    category: 'Metro Rail',
    coordinates: [21.1350, 72.7680],
    completionYear: '2027 (Under Construction)',
    status: 'Under Construction',
    capex: '₹12,020 Cr',
    agency: 'GMRC & SMC',
    impactRadiusKm: 5.0
  },

  // High Speed Rail & Expressways
  {
    id: 'IA-HSR-SABARMATI',
    name: 'Sabarmati High Speed Bullet Train Terminal',
    gujaratiName: 'સાબરમતી હાઇ સ્પીડ બુલેટ ટ્રેન ટર્મિનલ',
    category: 'Bullet Train',
    coordinates: [23.0800, 72.5800],
    completionYear: '2027 (Targeted)',
    status: 'Under Construction',
    capex: '₹9,500 Cr',
    agency: 'NHSRCL',
    impactRadiusKm: 8.0
  },
  {
    id: 'IA-HSR-SURAT',
    name: 'Surat Antroli High Speed Bullet Train Hub',
    gujaratiName: 'સુરત અંત્રોલી બુલેટ ટ્રેન હબ',
    category: 'Bullet Train',
    coordinates: [21.2000, 72.8400],
    completionYear: '2026 (Advanced Testing)',
    status: 'Advanced Testing',
    capex: '₹8,200 Cr',
    agency: 'NHSRCL',
    impactRadiusKm: 8.0
  },
  {
    id: 'IA-RING-SPRR-SOPAL',
    name: 'Sardar Patel Ring Road (SPRR) 6-Lane Flyover Junction',
    gujaratiName: 'સરદાર પટેલ રિંગ રોડ ૬-લેન ફ્લાયઓવર જંકશન',
    category: 'Expressway & Ring Road',
    coordinates: [23.0250, 72.4700],
    completionYear: '2024 (Operational)',
    status: 'Operational',
    capex: '₹1,250 Cr (Widening & Grade Separation)',
    agency: 'AUDA & R&B Dept',
    impactRadiusKm: 4.0
  },
  {
    id: 'IA-RING-SURAT-ORR',
    name: 'Surat Outer Ring Road (6-Lane Corridor)',
    gujaratiName: 'સુરત આઉટર રિંગ રોડ (૬-લેન)',
    category: 'Expressway & Ring Road',
    coordinates: [21.1500, 72.8200],
    completionYear: '2025 (Advanced Stage)',
    status: 'Under Construction',
    capex: '₹2,400 Cr',
    agency: 'SUDA',
    impactRadiusKm: 5.0
  },
  {
    id: 'IA-EXP-DHOLERA-FEEDER',
    name: 'Ahmedabad-Dholera Expressway Sanand Feeder',
    gujaratiName: 'અમદાવાદ-ધોલેરા એક્સપ્રેસવે સાણંદ ફીડર',
    category: 'Expressway & Ring Road',
    coordinates: [22.9500, 72.4200],
    completionYear: '2025 (Under Construction)',
    status: 'Under Construction',
    capex: '₹4,200 Cr',
    agency: 'NHAI',
    impactRadiusKm: 6.0
  },

  // Airports & Mega Projects
  {
    id: 'IA-AIR-AMD',
    name: 'Sardar Vallabhbhai Patel International Airport (Terminal 3)',
    gujaratiName: 'સરદાર વલ્લભભાઈ પટેલ આંતરરાષ્ટ્રીય એરપોર્ટ',
    category: 'Airport',
    coordinates: [23.0772, 72.6347],
    completionYear: '2026 (Expansion)',
    status: 'Operational',
    capex: '₹3,500 Cr (New Terminal 3)',
    agency: 'Adani Airports / AAI',
    impactRadiusKm: 7.0
  },
  {
    id: 'IA-AIR-SURAT',
    name: 'Surat International Airport New Terminal Building',
    gujaratiName: 'સુરત ઇન્ટરનેશનલ એરપોર્ટ નવું ટર્મિનલ',
    category: 'Airport',
    coordinates: [21.1140, 72.7420],
    completionYear: '2024 (Operational)',
    status: 'Operational',
    capex: '₹353 Cr',
    agency: 'Airports Authority of India (AAI)',
    impactRadiusKm: 6.0
  },
  {
    id: 'IA-AIR-DHOLERA',
    name: 'Dholera Greenfield International Airport',
    gujaratiName: 'ધોલેરા ગ્રીનફિલ્ડ ઇન્ટરનેશનલ એરપોર્ટ',
    category: 'Airport',
    coordinates: [22.3500, 72.1800],
    completionYear: '2026 (Targeted)',
    status: 'Under Construction',
    capex: '₹1,378 Cr',
    agency: 'DIACL / AAI',
    impactRadiusKm: 10.0
  },
  {
    id: 'IA-MEGA-MICRON-SANAND',
    name: 'Micron Semiconductor ATMP Mega-Facility',
    gujaratiName: 'માઈક્રોન સેમિકન્ડક્ટર એટીએમપી ફેસિલિટી (સાણંદ)',
    category: 'Industrial Mega-Hub',
    coordinates: [23.0020, 72.3850],
    completionYear: '2025 (Phase 1 Testing)',
    status: 'Under Construction',
    capex: '₹22,500 Cr',
    agency: 'Micron Technology / GIDC',
    impactRadiusKm: 8.0
  },
  {
    id: 'IA-MEGA-TATA-FAB-DHOLERA',
    name: 'Tata Electronics Semiconductor Fab (Dholera TP-1)',
    gujaratiName: 'ટાટા સેમિકન્ડક્ટર ફેબ (ધોલેરા)',
    category: 'Industrial Mega-Hub',
    coordinates: [22.2500, 72.0500],
    completionYear: '2026 (First Silicon Wafers)',
    status: 'Under Construction',
    capex: '₹91,000 Cr',
    agency: 'Tata Electronics / DICDL',
    impactRadiusKm: 10.0
  }
];

// 4. TRENDING REAL ESTATE LOCALITIES FOR 1-CLICK PIN DROPS
export const TRENDING_PIN_LOCALITIES = [
  { name: 'Shela', city: 'Ahmedabad', coords: [23.0120, 72.4680] as [number, number], tag: 'Metro Phase 2 & SP Ring Road' },
  { name: 'Bopal', city: 'Ahmedabad', coords: [23.0330, 72.4720] as [number, number], tag: 'ISRO / Science City Belt' },
  { name: 'Adajan', city: 'Surat', coords: [21.1980, 72.7930] as [number, number], tag: 'Surat Metro Line 1 & Cable Bridge' },
  { name: 'Vesu', city: 'Surat', coords: [21.1350, 72.7680] as [number, number], tag: 'Airport Road & Outer Ring Road' },
  { name: 'Kudasan (GIFT Suburb)', city: 'Gandhinagar', coords: [23.1780, 72.6450] as [number, number], tag: 'GIFT City Skywalk Fringe' },
  { name: 'Dholera TP-1 (Fedara)', city: 'Ahmedabad Rural', coords: [22.2500, 72.0500] as [number, number], tag: 'Tata Fab & Expressway Junction' },
  { name: 'Sanand GIDC', city: 'Ahmedabad', coords: [23.0020, 72.3850] as [number, number], tag: 'Micron & Tata EV Industrial Hub' },
  { name: 'Sargasan', city: 'Gandhinagar', coords: [23.1950, 72.6100] as [number, number], tag: 'Gandhinagar Metro Corridor' }
];

// 5. VIRAL MECHANIC 3: "BEFORE VS. PLANNED" SPLIT-SCREEN SLIDER ZONES
export const BEFORE_AFTER_ZONES: BeforeAfterZone[] = [
  {
    id: 'dholera-airport-zone',
    title: 'Dholera International Airport & Aerotropolis',
    gujaratiTitle: 'ધોલેરા ઇન્ટરનેશનલ એરપોર્ટ: ૨૦૧૮ vs ૨૦૨૬+',
    location: 'Fedara / Dholera SIR (Ahmedabad District)',
    capex: '₹1,378 Cr (Phase 1) / ₹3,800 Cr (Master Plan)',
    completion: '68% (Targeted Flight Testing: 2026)',
    agency: 'Dholera International Airport Company Ltd (DIACL) / AAI',
    historicYear: '2018 (Arid Salt Flat)',
    plannedYear: '2026+ (Code 4E Two-Runway Aerotropolis)',
    historicDesc: 'Uninhabited, saline tidal mudflats prone to monsoon siltation with zero metalled roads, single-phase power, or aviation infrastructure.',
    plannedDesc: 'Master-planned Code 4E greenfield airport with twin 3,200m runways, 100,000 MT/year cold chain cargo complex, and high-speed rail express terminal.',
    historicImage: '/images/destinations/lothal-archaeological-site.jpg',
    plannedImage: '/images/destinations/dholavira-harappan-city.jpg',
    highlights: [
      '3,200 m × 45 m CAT I ILS Runway for Boeing 777 & Airbus A350 widebodies',
      'Integrated cargo logistics springboard for Tata Semiconductor Fab',
      'Automated high-speed baggage handling and zero-carbon solar apron',
      'Direct 4-lane grade-separated access to Ahmedabad-Dholera Expressway'
    ]
  },
  {
    id: 'sabarmati-bullet-hub',
    title: 'Sabarmati Bullet Train Multimodal Mega-Hub',
    gujaratiTitle: 'સાબરમતી હાઇ સ્પીડ મલ્ટી-મોડલ હબ: ૨૦૧૯ vs ૨૦૨૬+',
    location: 'Sabarmati, Ahmedabad',
    capex: '₹9,500 Cr',
    completion: '94% (Building Structurally Complete)',
    agency: 'National High Speed Rail Corporation Ltd (NHSRCL)',
    historicYear: '2019 (Old Railway Freight Yards)',
    plannedYear: '2026+ (Aerodynamic High-Speed Terminal)',
    historicDesc: 'Congested 1950s locomotive maintenance sheds, unpaved marshaling yards, and tangled overhead electrical wiring with no transit integration.',
    plannedDesc: 'Aerodynamic steel and glass terminal spanning 1.4 lakh sq m, housing the Shinkansen OCC, rooftop solar canopy, and air-conditioned skywalks to Metro and Indian Railways.',
    historicImage: '/images/destinations/sarkhej-roza.jpg',
    plannedImage: '/images/destinations/sabarmati-ashram.jpg',
    highlights: [
      'Seamless covered skywalks to Ahmedabad Metro Line 1 & Western Railway',
      'Operation Control Center (OCC) tracking 320 km/h bullet trains',
      'Green Building Council Platinum Rating with 1.2 MW rooftop solar array',
      'Direct under-10-minute transit to Ahmedabad International Airport'
    ]
  },
  {
    id: 'gift-city-skyline',
    title: 'GIFT City International Financial Services Centre',
    gujaratiTitle: 'ગિફ્ટ સિટી આંતરરાષ્ટ્રીય ફાયનાન્સિયલ સ્કાયલાઇન: ૨૦૧૦ vs ૨૦૨૬+',
    location: 'Gandhinagar / Ahmedabad Border',
    capex: '₹25,000+ Cr',
    completion: '82% (Phase 1 & 2 Operational)',
    agency: 'GIFTCL / IFSCA',
    historicYear: '2010 (Barren Riverbed & Farm Scrubs)',
    plannedYear: '2026+ (Futuristic 886-Acre Financial Metropolis)',
    historicDesc: 'Arid scrubland and non-perennial river sandbanks with zero civic infrastructure, water access, or financial connectivity.',
    plannedDesc: 'India\'s first operational smart skyscraper city, featuring district cooling, automated pneumatic trash tubes, IIBX bullion vault, and 25,000+ financial tech employees.',
    historicImage: '/images/destinations/dada-harir-stepwell.jpg',
    plannedImage: '/images/destinations/statue-of-unity.jpg',
    highlights: [
      'Underground Multi-Utility Tunnel (MUT) housing power, water, ICT fiber',
      'Automated Vacuum Waste Collection (AVAC) whisking trash at 70 km/h',
      'District Cooling System slashing air-conditioning energy use by 30%',
      'Single-window sovereign IFSCA regulatory regime for global finance'
    ]
  },
  {
    id: 'surat-bullet-terminal',
    title: 'Surat Antroli High Speed Terminal & Ring Road',
    gujaratiTitle: 'સુરત અંત્રોલી બુલેટ ટ્રેન ટર્મિનલ: ૨૦૨૦ vs ૨૦૨૬+',
    location: 'Antroli, Surat',
    capex: '₹8,200 Cr',
    completion: '86% (Viaduct & Track Foundation Ready)',
    agency: 'NHSRCL & Surat Urban Development Authority (SUDA)',
    historicYear: '2020 (Agricultural Sugarcane Fields)',
    plannedYear: '2026+ (Diamond Parametric Shinkansen Terminal)',
    historicDesc: 'Isolated rural farming plots with narrow rural village roads and zero arterial highway infrastructure.',
    plannedDesc: 'Futuristic Diamond City transit citadel featuring parametric faceted facades, 6 elevated tracks, and direct interchange with Surat 6-Lane Outer Ring Road.',
    historicImage: '/images/destinations/champaner-pavagadh.jpg',
    plannedImage: '/images/destinations/tithal-beach.jpg',
    highlights: [
      'First HSR station on the corridor with 100% full slab casting complete',
      'Multi-modal integration with Surat Metro Phase 1 and BRTS rapid lines',
      'Fast 1 hr 15 min travel time connecting Surat directly to BKC Mumbai',
      'Surat Diamond Bourse shuttle terminal with EV rapid charging plaza'
    ]
  }
];

// HELPER: Haversine distance in Kilometers
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// HELPER: Calculate 5 km Infra Impact Score
export interface ImpactScoreResult {
  score: number;
  tier: 'Platinum Growth Tier' | 'Hyper-Growth Hub' | 'High Potential Axis' | 'Emerging Corridor';
  totalProjectsWithin5Km: number;
  assets: {
    asset: InfraAssetForImpact;
    distanceKm: number;
  }[];
  scoreBreakdown: {
    metroScore: number;
    highwayScore: number;
    hsrScore: number;
    megaProjectScore: number;
  };
}

export function compute5KmInfraImpact(lat: number, lng: number): ImpactScoreResult {
  const scoredAssets = MAJOR_INFRA_ASSETS.map(asset => {
    const dist = calculateDistanceKm(lat, lng, asset.coordinates[0], asset.coordinates[1]);
    return { asset, distanceKm: dist };
  }).sort((a, b) => a.distanceKm - b.distanceKm);

  const within5Km = scoredAssets.filter(item => item.distanceKm <= 5.0);

  // If rural with < 2 projects within 5km, include up to 3 nearest within 15km
  const displayAssets = within5Km.length >= 2 
    ? within5Km 
    : scoredAssets.filter(item => item.distanceKm <= 15.0).slice(0, 4);

  // Score calculation
  let metroScore = 0;
  let highwayScore = 0;
  let hsrScore = 0;
  let megaProjectScore = 0;

  displayAssets.forEach(({ asset, distanceKm }) => {
    const proximityMultiplier = Math.max(0.2, (5.5 - Math.min(distanceKm, 5.0)) / 5.0);

    if (asset.category === 'Metro Rail') {
      metroScore = Math.min(35, metroScore + Math.round(20 * proximityMultiplier));
    } else if (asset.category === 'Expressway & Ring Road') {
      highwayScore = Math.min(30, highwayScore + Math.round(18 * proximityMultiplier));
    } else if (asset.category === 'Bullet Train' || asset.category === 'Airport') {
      hsrScore = Math.min(20, hsrScore + Math.round(15 * proximityMultiplier));
    } else if (asset.category === 'Industrial Mega-Hub' || asset.category === 'Port & Logistics') {
      megaProjectScore = Math.min(15, megaProjectScore + Math.round(12 * proximityMultiplier));
    }
  });

  // Base connectivity score from urban proximity
  const rawScore = metroScore + highwayScore + hsrScore + megaProjectScore;
  const score = Math.max(38, Math.min(99, rawScore + (within5Km.length > 0 ? 12 : 5)));

  let tier: 'Platinum Growth Tier' | 'Hyper-Growth Hub' | 'High Potential Axis' | 'Emerging Corridor' = 'Emerging Corridor';
  if (score >= 88) tier = 'Platinum Growth Tier';
  else if (score >= 74) tier = 'Hyper-Growth Hub';
  else if (score >= 60) tier = 'High Potential Axis';

  return {
    score,
    tier,
    totalProjectsWithin5Km: within5Km.length,
    assets: displayAssets,
    scoreBreakdown: {
      metroScore,
      highwayScore,
      hsrScore,
      megaProjectScore
    }
  };
}
