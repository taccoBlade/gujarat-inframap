import { PlaceToExplore } from '../../types/inframap';

export const VERIFIED_PLACES_SEED: PlaceToExplore[] = [
  {
    id: 'adalaj-ni-vav',
    slug: 'adalaj-ni-vav',
    name: 'Adalaj ni Vav (Rudabai Stepwell)',
    gujaratiName: 'અડાલજની વાવ',
    category: 'Heritage & History',
    district: 'Gandhinagar',
    coordinates: { lat: 23.1667, lng: 72.5800 },
    tagline: 'Five-storey Solanki-Vaghela subterranean architectural marvel',
    significance: 'Built in 1498 CE by Queen Rudabai, this octagonal stepwell showcases the pinnacle of Solanki stepwell engineering and Indo-Islamic decorative syncretism, functioning as an ancient water reservoir, civic retreat, and caravan shelter.',
    visitorExperience: [
      'Descend five subterranean levels where temperature drops noticeably by 5-6°C',
      'Examine carved sandstone niches combining Hindu iconographic motifs with Islamic floral filigree',
      'Observe the direct alignment with the Narmada canal basin corridor just south of the village'
    ],
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Adalaj_Stepwell_Interior_Ahmedabad_Gujarat.jpg/800px-Adalaj_Stepwell_Interior_Ahmedabad_Gujarat.jpg',
      alt: 'Adalaj Stepwell Intricate Carved Sandstone Pillars and Octagonal Well Shaft',
      attribution: 'Wikimedia Commons / ASI Vadodara Circle',
      licenseNote: 'CC BY-SA 4.0'
    },
    visitorLogistics: {
      openingHours: { value: '06:00 - 18:00 (Daily)', status: 'VERIFIED' },
      entryFee: { value: 'Free / Non-ticketed ASI protected monument', status: 'VERIFIED' },
      permitsOrRestrictions: { value: 'None for general visitors; tripod photography requires ASI permission', status: 'VERIFIED' },
      seasonalNotes: 'Pleasant throughout winter (Oct-Feb). Subterranean galleries remain cool during hot summer months.'
    },
    nearbyInfrastructureIds: ['GJ-WR-CANAL-NMC', 'GJ-TR-HWY-NH147'],
    provenance: {
      sourceAgency: 'Archaeological Survey of India (ASI) Vadodara Circle',
      sourceTitle: 'Monuments of National Importance in Gujarat — Adalaj ni Vav',
      sourceUrl: 'https://asivadodara.org',
      publicationDate: '2024',
      lastCheckedDate: '2026-10-18',
      datasetVersion: '1.2.0',
      verificationTier: 'OFFICIAL_RECORD',
      positionalAccuracyNote: 'Centroid of stepwell shaft structure.',
      knownLimitations: []
    }
  },
  {
    id: 'sun-temple-modhera',
    slug: 'sun-temple-modhera',
    name: 'Sun Temple, Modhera',
    gujaratiName: 'મોઢેરા સૂર્ય મંદિર',
    category: 'Heritage & History',
    district: 'Mehsana',
    coordinates: { lat: 23.5835, lng: 72.1331 },
    tagline: '11th-century Solanki solar temple and India’s first 24x7 solar-powered village',
    significance: 'Commissioned in 1026-27 CE by King Bhima I of the Chaulukya (Solanki) dynasty on the Pushpavati river, designed so the equinoctial sun rays illuminated the sanctum. In 2022, Modhera became India’s first net-zero solar heritage village.',
    visitorExperience: [
      'Admire the 52 carved pillars of the Sabha Mandapa representing the weeks of the solar year',
      'Walk along the geometric stepped terraces of the Surya Kund (Ramakunda) reservoir',
      'Witness the night illumination powered 100% by local rooftop and ground-mounted solar-BESS systems'
    ],
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Modhera_Sun_Temple_Surya_Kund_Stepwell.jpg/800px-Modhera_Sun_Temple_Surya_Kund_Stepwell.jpg',
      alt: 'Surya Kund Stepped Reservoir and Main Temple Sanctuary at Modhera',
      attribution: 'Wikimedia Commons / ASI Vadodara Circle',
      licenseNote: 'CC BY-SA 4.0'
    },
    visitorLogistics: {
      openingHours: { value: '07:00 - 18:00 (Daily); Light & Sound Show at 19:00 (Fri-Sun)', status: 'VERIFIED' },
      entryFee: { value: '₹25 for Indian citizens; ₹300 for foreign tourists (Cashless QR available)', status: 'VERIFIED' },
      permitsOrRestrictions: { value: 'Standard ASI monument entry guidelines apply', status: 'VERIFIED' },
      seasonalNotes: 'Annual Modhera Dance Festival held in third week of January. Avoid peak midday heat in April-June.'
    },
    nearbyInfrastructureIds: ['GJ-ENG-SOL-MODHERA-01', 'GJ-TR-HWY-SH41'],
    provenance: {
      sourceAgency: 'Archaeological Survey of India (ASI) & Gujarat Energy Development Agency (GEDA)',
      sourceTitle: 'Modhera Solar Village Project & National Monument Register',
      sourceUrl: 'https://geda.gujarat.gov.in',
      publicationDate: '2024',
      lastCheckedDate: '2026-10-18',
      datasetVersion: '2.1.0',
      verificationTier: 'OFFICIAL_RECORD',
      positionalAccuracyNote: 'Exact sanctuary coordinates from ASI geodetic survey.',
      knownLimitations: []
    }
  },
  {
    id: 'sardar-sarovar-ekta-nagar',
    slug: 'sardar-sarovar-ekta-nagar',
    name: 'Sardar Sarovar Dam & Ekta Nagar Complex',
    gujaratiName: 'સરદાર સરોવર ડેમ અને એકતા નગર',
    category: 'Iconic Gujarat',
    district: 'Narmada',
    coordinates: { lat: 21.8380, lng: 73.7483 },
    tagline: 'Life-line of Gujarat: Engineering mega-dam and Statue of Unity precinct',
    significance: 'One of the largest concrete gravity dams in the world (163 m crest height, 1,210 m length) providing drinking water to 9,000+ villages and 1.8M hectares of irrigation, flanked by the 182-metre Statue of Unity.',
    visitorExperience: [
      'Dam Viewpoints 1, 2, and 3 overlooking the 30 radial spillway gates and downstream Narmada canyon',
      'Interactive Khalwani eco-tourism circuits, Cactus & Butterfly Gardens, and Valley of Flowers',
      'Riverbed Powerhouse (1,200 MW underground Francis reversible pump-turbines)'
    ],
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Sardar_Sarovar_Dam_Narmada_River_Gujarat.jpg/800px-Sardar_Sarovar_Dam_Narmada_River_Gujarat.jpg',
      alt: 'Sardar Sarovar Dam Spillway and Narmada Reservoir View',
      attribution: 'Wikimedia Commons / SSNNL Public Disclosure',
      licenseNote: 'CC BY-SA 4.0'
    },
    visitorLogistics: {
      openingHours: { value: '08:00 - 18:00 (Closed Mondays for Maintenance)', status: 'VERIFIED' },
      entryFee: { value: 'Basic Campus Entry ₹150; Viewing Gallery ₹380 (Online booking mandatory)', status: 'VERIFIED' },
      permitsOrRestrictions: { value: 'Dam view points require official security clearance / tourist pass issued with SoU ticket', status: 'VERIFIED' },
      seasonalNotes: 'Spectacular overflowing spillway views during peak monsoon discharge (August-September).'
    },
    nearbyInfrastructureIds: ['GJ-WR-DAM-001', 'GJ-PWR-HYD-SSNNL-01', 'GJ-TR-STA-EKNR'],
    provenance: {
      sourceAgency: 'Sardar Sarovar Narmada Nigam Limited (SSNNL)',
      sourceTitle: 'Sardar Sarovar Dam Project Infrastructure & Visitor Ledger',
      sourceUrl: 'https://sardarsarovardam.org',
      publicationDate: '2025',
      lastCheckedDate: '2026-10-18',
      datasetVersion: '4.0.0',
      verificationTier: 'OFFICIAL_RECORD',
      positionalAccuracyNote: 'Exact dam axis stationing marker.',
      knownLimitations: []
    }
  },
  {
    id: 'lothal-archaeological-site',
    slug: 'lothal-archaeological-site',
    name: 'Lothal Harappan Port City & Dockyard',
    gujaratiName: 'લોથલ હડપ્પીય બંદર',
    category: 'Heritage & History',
    district: 'Ahmedabad',
    coordinates: { lat: 22.5228, lng: 72.2494 },
    tagline: 'World’s oldest known tidal dockyard and maritime trading hub (2400-1900 BCE)',
    significance: 'Prominent southern city of the ancient Indus Valley Civilization, Lothal featured a sophisticated tidal dockyard, bead manufacturing factory, acropolis, and lower town with underground brick drainage that linked Gujarat with the Bronze Age world.',
    visitorExperience: [
      'Inspect the 214m x 36m burnt-brick tidal dock basin and water inlet sluice channel',
      'Explore the archaeological warehouse platform and bead-maker workshop furnaces',
      'Visit the ASI Archaeological Museum housing terracotta seals, micro-beads, and Indus weights'
    ],
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Lothal_Dockyard.jpg/800px-Lothal_Dockyard.jpg',
      alt: 'Ancient Burnt-Brick Tidal Dock Basin at Lothal Harappan Site',
      attribution: 'Wikimedia Commons / ASI Vadodara Circle',
      licenseNote: 'CC BY-SA 4.0'
    },
    visitorLogistics: {
      openingHours: { value: '10:00 - 17:00 (Site open daily; Museum closed on Fridays)', status: 'VERIFIED' },
      entryFee: { value: '₹25 for Indian citizens; ₹300 for foreigners; children up to 15 free', status: 'VERIFIED' },
      permitsOrRestrictions: { value: 'Excavation boundaries strictly preserved; do not climb brick walls', status: 'VERIFIED' },
      seasonalNotes: 'Open arid plain; bring sun protection, hat, and water. Best visited between October and March.'
    },
    nearbyInfrastructureIds: ['GJ-URB-DHOLERA-01', 'GJ-TR-HWY-NH47'],
    provenance: {
      sourceAgency: 'Archaeological Survey of India (ASI) & National Maritime Heritage Complex (NMHC)',
      sourceTitle: 'Lothal Excavation Memoirs & World Heritage Tentative List Dossier',
      sourceUrl: 'https://asi.nic.in',
      publicationDate: '2024',
      lastCheckedDate: '2026-10-18',
      datasetVersion: '1.5.0',
      verificationTier: 'OFFICIAL_RECORD',
      positionalAccuracyNote: 'Dockyard basin geographic centroid.',
      knownLimitations: []
    }
  },
  {
    id: 'dholavira-harappan-city',
    slug: 'dholavira-harappan-city',
    name: 'Dholavira: A Harappan City (Khadir Bet)',
    gujaratiName: 'ધોળાવીરા: હડપ્પન મહાનગર',
    category: 'Heritage & History',
    district: 'Kachchh',
    coordinates: { lat: 23.8864, lng: 70.2178 },
    tagline: 'UNESCO World Heritage Harappan metropolis renowned for hydraulic reservoir engineering',
    significance: 'Inscribed on the UNESCO World Heritage list in 2021, Dholavira was occupied between 3000 and 1500 BCE. Its stone-cut storm water harvesting reservoirs, cascading check-dams across the Mansar and Manhar seasonal streams, and monumental sign-board reflect extraordinary urban planning.',
    visitorExperience: [
      'Walk through the massive stone-cut rock reservoirs capable of storing 300,000 m³ of water',
      'Explore the Citadel, Bailey, Middle Town, and Ceremonial Ground with orthogonal stone streets',
      'Drive across the picturesque "Road to Heaven" causeway cutting through the glistening White Rann'
    ],
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Dholavira_Rock_Cut_Reservoir.jpg/800px-Dholavira_Rock_Cut_Reservoir.jpg',
      alt: 'Ancient Rock-Cut Water Reservoir System at UNESCO World Heritage Dholavira',
      attribution: 'Wikimedia Commons / UNESCO World Heritage Centre',
      licenseNote: 'CC BY-SA 4.0'
    },
    visitorLogistics: {
      openingHours: { value: '06:00 - 18:00 (Daily)', status: 'VERIFIED' },
      entryFee: { value: '₹25 for Indian citizens; ₹300 for foreigners (Online/QR ticketing)', status: 'VERIFIED' },
      permitsOrRestrictions: { value: 'No special border permit needed for Dholavira village; Rann causeway monitored by BSF/Police checkposts', status: 'VERIFIED' },
      seasonalNotes: 'Summers are extremely harsh (>45°C). Excellent winter conditions from November to February.'
    },
    nearbyInfrastructureIds: ['GJ-PWR-SOL-KHAVDA-01', 'GJ-TR-HWY-NH27'],
    provenance: {
      sourceAgency: 'UNESCO World Heritage Centre & Archaeological Survey of India (ASI)',
      sourceTitle: 'Dholavira: A Harappan City — UNESCO World Heritage List Inscription No. 1644',
      sourceUrl: 'https://whc.unesco.org/en/list/1644',
      publicationDate: '2024',
      lastCheckedDate: '2026-10-18',
      datasetVersion: '2.0.0',
      verificationTier: 'OFFICIAL_RECORD',
      positionalAccuracyNote: 'Citadel high mound survey benchmark.',
      knownLimitations: []
    }
  }
];
