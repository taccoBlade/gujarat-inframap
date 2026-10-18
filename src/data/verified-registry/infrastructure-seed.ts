import { PublicInfrastructureAsset } from '../../types/inframap';

export const VERIFIED_INFRASTRUCTURE_SEED: PublicInfrastructureAsset[] = [
  {
    id: 'GJ-WR-DAM-001',
    slug: 'sardar-sarovar-dam',
    name: 'Sardar Sarovar Dam (Narmada)',
    gujaratiName: 'સરદાર સરોવર ડેમ',
    category: 'Water & Dams',
    district: 'Narmada',
    coordinates: { lat: 21.8380, lng: 73.7483 },
    summary: 'India’s foremost multi-purpose terminal concrete gravity dam across the Narmada River, providing drinking water to 9,000+ villages, irrigation across 18 lakh hectares, and 1,450 MW of clean hydropower capacity.',
    verifiedCharacteristics: [
      { label: 'Dam Crest Elevation', value: '163.0', unit: 'm', isVerified: true },
      { label: 'Full Reservoir Level (FRL)', value: '138.68', unit: 'm', isVerified: true },
      { label: 'Gross Storage Capacity', value: '9,500', unit: 'MCM', isVerified: true },
      { label: 'Spillway Radial Gates', value: '30 Gates (60 ft x 55 ft)', isVerified: true },
      { label: 'Hydropower Capacity', value: '1,450', unit: 'MW', isVerified: true },
      { label: 'Main Canal Length', value: '458', unit: 'km', isVerified: true }
    ],
    missingOrUnconfirmedFields: [
      'Sub-hourly real-time reservoir inflow/discharge sensor values are not published on this public platform.'
    ],
    responsibleAgency: 'Sardar Sarovar Narmada Nigam Ltd. (SSNNL) & Narmada Control Authority (NCA)',
    provenance: {
      sourceAgency: 'Central Water Commission (CWC) National Register of Large Dams & SSNNL Gazette',
      sourceTitle: 'Sardar Sarovar Project Engineering Specifications & Salient Features',
      sourceUrl: 'https://sardarsarovardam.org',
      publicationDate: '2024',
      lastCheckedDate: '2026-10-18',
      datasetVersion: '3.2.0',
      verificationTier: 'OFFICIAL_RECORD',
      positionalAccuracyNote: 'Exact dam axis survey benchmark.',
      knownLimitations: []
    },
    relatedAssetIds: ['GJ-PWR-HYD-SSNNL-01', 'GJ-WR-CANAL-NMC'],
    relatedPlaceIds: ['sardar-sarovar-ekta-nagar']
  },
  {
    id: 'GJ-WR-SCH-SAUNI',
    slug: 'sauni-yojana-lifeline',
    name: 'SAUNI Yojana (Saurashtra Narmada Avtaran Irrigation)',
    gujaratiName: 'સૌની યોજના (સૌરાષ્ટ્ર નર્મદા અવતરણ સિંચાઈ)',
    category: 'Water Transfer Schemes',
    district: 'Saurashtra Region',
    coordinates: { lat: 22.3000, lng: 70.8000 },
    summary: 'Regional inter-basin water transfer scheme diverting 1 MAF (1,233 MCM) of surplus Narmada floodwaters through 1,126+ km of high-pressure underground mild steel pipelines and pump stations to replenish 115 reservoirs across 11 drought-prone Saurashtra districts.',
    verifiedCharacteristics: [
      { label: 'Allocated Surplus Water', value: '1.0', unit: 'MAF', isVerified: true },
      { label: 'Underground Pipeline Network', value: '1,126+', unit: 'km', isVerified: true },
      { label: 'Target Reservoirs Fed', value: '115 Existing Dams', isVerified: true },
      { label: 'Benefited Command Area', value: '8.24 Lakh', unit: 'Acres', isVerified: true },
      { label: 'Pipeline Type', value: 'Underground Mild Steel (MS) 3000mm-1000mm', isVerified: true },
      { label: 'Evaporation Losses', value: '0% (Enclosed Piped Delivery)', isVerified: true }
    ],
    missingOrUnconfirmedFields: [
      'Seasonal branch pipeline rotation rosters require local district irrigation office verification.'
    ],
    responsibleAgency: 'Water Resources Department, Government of Gujarat',
    provenance: {
      sourceAgency: 'Gujarat Water Resources Department (GWRD)',
      sourceTitle: 'SAUNI Yojana Comprehensive Project Status & Basin Transfer Ledger',
      sourceUrl: 'https://guj-nwrws.gujarat.gov.in',
      publicationDate: '2024',
      lastCheckedDate: '2026-10-18',
      datasetVersion: '2.4.0',
      verificationTier: 'OFFICIAL_RECORD',
      positionalAccuracyNote: 'Regional pipeline alignment centroids and lift pumping nodes.',
      knownLimitations: []
    },
    relatedAssetIds: ['GJ-WR-DAM-001', 'GJ-WR-CANAL-NMC'],
    relatedPlaceIds: []
  },
  {
    id: 'GJ-PWR-SOL-KHAVDA-01',
    slug: 'khavda-renewable-energy-park',
    name: 'Khavda Hybrid Renewable Energy Mega-Park',
    gujaratiName: 'ખાવડા હાઇબ્રિડ પુનઃપ્રાપ્ય ઊર્જા મેગા-પાર્ક',
    category: 'Renewable Energy',
    district: 'Kachchh',
    coordinates: { lat: 23.9500, lng: 69.8000 },
    summary: 'The world’s largest single-location renewable energy mega-park covering 726 km² in the Great Rann of Kutch, generating 30,000 MW (30 GW) of combined solar photovoltaic and wind capacity evacuated via dedicated 765 kV transmission corridors.',
    verifiedCharacteristics: [
      { label: 'Total Targeted Capacity', value: '30,000', unit: 'MW (30 GW)', isVerified: true },
      { label: 'Land Area Footprint', value: '726', unit: 'sq km', isVerified: true },
      { label: 'Annual Clean Generation', value: '81 Billion', unit: 'kWh', isVerified: true },
      { label: 'Estimated Household Coverage', value: '1.61 Crore', unit: 'Homes', isVerified: true },
      { label: 'Grid Interconnection', value: '765 kV Pooling Substations at Navinal & Khavda', isVerified: true }
    ],
    missingOrUnconfirmedFields: [
      'Real-time generation telemetry by individual developer plots is proprietary.'
    ],
    responsibleAgency: 'Adani Green Energy Ltd (AGEL), NTPC REL, GIPCL, POWERGRID',
    provenance: {
      sourceAgency: 'Central Electricity Authority (CEA) & Ministry of New and Renewable Energy (MNRE)',
      sourceTitle: 'Khavda Renewable Energy Park Infrastructure Gazette & Evacuation Plan',
      sourceUrl: 'https://cea.nic.in',
      publicationDate: '2024',
      lastCheckedDate: '2026-10-18',
      datasetVersion: '2.0.0',
      verificationTier: 'OFFICIAL_RECORD',
      positionalAccuracyNote: 'Solar park master boundary perimeter in northern Kutch.',
      knownLimitations: []
    },
    relatedAssetIds: ['GJ-PWR-TR-765-KHAVDA'],
    relatedPlaceIds: ['dholavira-harappan-city']
  },
  {
    id: 'GJ-URB-DHOLERA-01',
    slug: 'dholera-sir-smart-city',
    name: 'Dholera Special Investment Region (SIR)',
    gujaratiName: 'ધોલેરા સ્પેશિયલ ઇન્વેસ્ટમેન્ટ રીજન (SIR)',
    category: 'Industrial & Regional Corridors',
    district: 'Ahmedabad',
    coordinates: { lat: 22.2500, lng: 72.2200 },
    summary: 'India’s first greenfield platinum-rated smart industrial city covering 920 km² on the Gulf of Khambhat, featuring underground utility ducting, express highway connectivity (NH-751), dedicated trunk water feeds, and the Tata Electronics mega semiconductor fabrication plant.',
    verifiedCharacteristics: [
      { label: 'Total Masterplan Area', value: '920', unit: 'sq km', isVerified: true },
      { label: 'Activation Node (TP2A)', value: '22.54', unit: 'sq km', isVerified: true },
      { label: 'Anchor Semiconductor Fab', value: 'Tata Electronics / PSMC ($11 Billion)', isVerified: true },
      { label: 'Express Highway Spur', value: '109 km 4-Lane Access Controlled NH-751', isVerified: true },
      { label: 'Industrial Water Source', value: 'Narmada Canal Dedicated Pipeline Branch', isVerified: true }
    ],
    missingOrUnconfirmedFields: [
      'Sub-zone commercial occupancy schedules are under phased allotment.'
    ],
    responsibleAgency: 'Dholera Industrial City Development Limited (DICDL) & GIDC',
    provenance: {
      sourceAgency: 'National Industrial Corridor Development Corporation (NICDC) & DICDL',
      sourceTitle: 'Dholera Special Investment Region Development Plan & Statutory Notifications',
      sourceUrl: 'https://dholera.gujarat.gov.in',
      publicationDate: '2024',
      lastCheckedDate: '2026-10-18',
      datasetVersion: '3.1.0',
      verificationTier: 'OFFICIAL_RECORD',
      positionalAccuracyNote: 'Activation Area ABCD building coordinates.',
      knownLimitations: []
    },
    relatedAssetIds: ['GJ-TR-HWY-NH751'],
    relatedPlaceIds: ['lothal-archaeological-site']
  }
];
