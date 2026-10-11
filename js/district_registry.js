/**
 * Gujarat InfraMap — Multi-Modal District Infrastructure Registry
 * Digital Twin Cross-Domain Gazette Matrix for all 33 Districts
 */
(function() {
  const registry = {
    "Ahmedabad": {
      highways: [{ code: "NE 1", label: "NE-1 (120 km/h)" }, { code: "NH 48", label: "NH 48 (GQ)" }, { code: "NH 47", label: "NH 47" }],
      railways: [{ code: "ADI", label: "Ahmedabad JN (ADI)" }, { code: "SBT", label: "Sabarmati JN (SBT)" }],
      power: [{ name: "Sabarmati Thermal Power Station (Torrent Power)", label: "Sabarmati (482 MW)" }],
      dams: [{ name: "Narmada Main Canal (NMC)", label: "Narmada Main Canal (40,000 cfs)" }],
      portsAirports: [{ name: "Sardar Vallabhbhai Patel International Airport (SVPIA)", label: "SVPIA Airport (AMD)" }],
      industry: [
        { name: "Sanand Industrial Estate (GIDC Auto Hub)", label: "Sanand Auto Hub" },
        { name: "Dholera Special Investment Region (DSIR)", label: "Dholera SIR (920 km²)" },
        { name: "Ahmedabad Municipal Corporation (AMC)", label: "AMC Smart City" }
      ]
    },
    "Amreli": {
      highways: [{ code: "NH 51", label: "NH 51 (Coastal)" }],
      railways: [{ code: "AE", label: "Amreli (AE)" }],
      power: [],
      dams: [{ name: "Shetrunji Dam", label: "Shetrunji Basin" }],
      portsAirports: [{ name: "Pipavav Port (APM Terminals)", label: "Pipavav Port (20 MMT)" }],
      industry: []
    },
    "Anand": {
      highways: [{ code: "NE 1", label: "NE-1 Expressway" }, { code: "NH 48", label: "NH 48 (GQ)" }],
      railways: [{ code: "ANND", label: "Anand JN (ANND)" }],
      power: [],
      dams: [{ name: "Narmada Main Canal (NMC)", label: "NMC Canal Network" }],
      portsAirports: [],
      industry: [{ name: "Ankleshwar GIDC (Asia's Largest Chemical Hub)", label: "Milk & Agro Processing Cluster" }]
    },
    "Aravalli": {
      highways: [{ code: "NH 48", label: "NH 48 Trunk" }],
      railways: [{ code: "MDSA", label: "Modasa (MDSA)" }],
      power: [],
      dams: [{ name: "Mahi River Trunk Corridor", label: "Mahi Tributaries" }],
      portsAirports: [],
      industry: []
    },
    "Banaskantha": {
      highways: [{ code: "NH 27", label: "NH 27 (East-West)" }, { code: "NH 58", label: "NH 58" }],
      railways: [{ code: "PNU", label: "Palanpur JN (PNU)" }],
      power: [],
      dams: [{ name: "Dantiwada Dam", label: "Dantiwada Dam (464 MCM)" }],
      portsAirports: [],
      industry: []
    },
    "Bharuch": {
      highways: [{ code: "NH 48", label: "NH 48 (Delhi-Mumbai GQ)" }, { code: "NH 53", label: "NH 53 Link" }],
      railways: [{ code: "BH", label: "Bharuch JN (BH)" }, { code: "AKV", label: "Ankleshwar JN (AKV)" }],
      power: [
        { name: "DGEN Mega Combined Cycle Power Plant (Torrent Dahej)", label: "DGEN Dahej (1,200 MW)" },
        { name: "Paguthan Combined Cycle Power Plant (CLP India)", label: "Paguthan (655 MW)" },
        { name: "Gandhar Gas Power Station (NTPC Jhanor)", label: "Gandhar Gas (648 MW)" }
      ],
      dams: [{ name: "Narmada River Trunk Corridor", label: "Narmada River Downstream" }],
      portsAirports: [{ name: "Dahej Port & Petronet LNG", label: "Dahej Port (45 MMT)" }],
      industry: [
        { name: "Dahej PCPIR (Petroleum & Chemicals Region)", label: "Dahej PCPIR (453 km²)" },
        { name: "Ankleshwar GIDC (Asia's Largest Chemical Hub)", label: "Ankleshwar GIDC" }
      ]
    },
    "Bhavnagar": {
      highways: [{ code: "NH 51", label: "NH 51 (Coastal Saurashtra)" }],
      railways: [{ code: "BVC", label: "Bhavnagar Terminus (BVC)" }],
      power: [],
      dams: [{ name: "Shetrunji Dam", label: "Shetrunji Dam (308 MCM)" }],
      portsAirports: [{ name: "Bhavnagar Airport", label: "Bhavnagar Airport (BVC)" }],
      industry: [{ name: "Bhavnagar Municipal Corporation (BMC)", label: "BMC Corporation" }]
    },
    "Botad": {
      highways: [{ code: "NH 51", label: "NH 51 Corridor" }],
      railways: [{ code: "BTD", label: "Botad JN (BTD)" }],
      power: [],
      dams: [],
      portsAirports: [],
      industry: []
    },
    "Chhota Udepur": {
      highways: [{ code: "NH 56", label: "NH 56 Tribal Trunk" }],
      railways: [{ code: "CTD", label: "Chhota Udepur (CTD)" }],
      power: [],
      dams: [],
      portsAirports: [],
      industry: []
    },
    "Dahod": {
      highways: [{ code: "NH 47", label: "NH 47 Interstate" }],
      railways: [{ code: "DHD", label: "Dahod (DHD)" }],
      power: [],
      dams: [],
      portsAirports: [],
      industry: []
    },
    "Dang": {
      highways: [{ code: "NH 56", label: "NH 56 (Ahwa)" }],
      railways: [{ code: "WGI", label: "Waghai (WGI)" }],
      power: [],
      dams: [],
      portsAirports: [],
      industry: []
    },
    "Devbhumi Dwarka": {
      highways: [{ code: "NH 51", label: "NH 51 Coastal" }],
      railways: [{ code: "DWK", label: "Dwarka (DWK)" }, { code: "OKHA", label: "Okha Port (OKHA)" }],
      power: [{ name: "Dwarka Coastal Wind Farm", label: "Dwarka Wind (450 MW)" }],
      dams: [],
      portsAirports: [{ name: "Okha Commercial Port", label: "Okha Port" }],
      industry: []
    },
    "Gandhinagar": {
      highways: [{ code: "NH 48", label: "NH 48 Highway" }],
      railways: [{ code: "GNC", label: "Gandhinagar Capital (GNC)" }],
      power: [{ name: "Gandhinagar Thermal Power Station", label: "Gandhinagar TPS (630 MW)" }],
      dams: [{ name: "Sabarmati River Trunk Corridor", label: "Sabarmati Basin" }],
      portsAirports: [],
      industry: [
        { name: "GIFT City (International Financial Services Centre)", label: "GIFT City IFSC" },
        { name: "Gandhinagar Municipal Corporation (GMC)", label: "GMC Corporation" }
      ]
    },
    "Gir Somnath": {
      highways: [{ code: "NH 51", label: "NH 51 Coastal" }],
      railways: [{ code: "VRL", label: "Veraval JN (VRL)" }],
      power: [],
      dams: [{ name: "Gir National Park & Wildlife Sanctuary", label: "Gir National Park" }],
      portsAirports: [],
      industry: []
    },
    "Jamnagar": {
      highways: [{ code: "NH 27", label: "NH 27 (East-West)" }, { code: "NH 754K", label: "NH 754K (Amritsar-Jamnagar)" }],
      railways: [{ code: "JAM", label: "Jamnagar (JAM)" }, { code: "HAPA", label: "Hapa (HAPA)" }],
      power: [
        { name: "Salaya Thermal Power Plant (Essar Power)", label: "Salaya TPP (1,200 MW)" },
        { name: "Sikka Thermal Power Station", label: "Sikka TPS (500 MW)" }
      ],
      dams: [],
      portsAirports: [
        { name: "Sikka Marine Terminal", label: "Sikka SPM (125 MMT)" },
        { name: "Jamnagar Airport", label: "Jamnagar Airport" }
      ],
      industry: [{ name: "Jamnagar Municipal Corporation (JMC)", label: "JMC Corporation" }]
    },
    "Junagadh": {
      highways: [{ code: "NH 51", label: "NH 51 Link" }],
      railways: [{ code: "JND", label: "Junagadh JN (JND)" }],
      power: [],
      dams: [{ name: "Gir National Park & Wildlife Sanctuary", label: "Gir Sanctuary Buffer" }],
      portsAirports: [],
      industry: [{ name: "Junagadh Municipal Corporation", label: "Junagadh Corporation" }]
    },
    "Kheda": {
      highways: [{ code: "NE 1", label: "NE-1 (Nadiad Exit)" }, { code: "NH 48", label: "NH 48 (GQ)" }],
      railways: [{ code: "ND", label: "Nadiad JN (ND)" }],
      power: [{ name: "Wanakbori Thermal Power Station", label: "Wanakbori TPS (1,640 MW)" }],
      dams: [{ name: "Mahi River Trunk Corridor", label: "Mahi Basin" }],
      portsAirports: [],
      industry: []
    },
    "Kutch": {
      highways: [{ code: "NH 27", label: "NH 27 (East-West)" }, { code: "NH 41", label: "NH 41 (Kandla/Mandvi)" }],
      railways: [{ code: "GIMB", label: "Gandhidham BG (GIMB)" }, { code: "BHUJ", label: "Bhuj (BHUJ)" }],
      power: [
        { name: "Mundra Thermal Power Station (Adani Power)", label: "Mundra Thermal (4,620 MW - Largest)" },
        { name: "Mundra Ultra Mega Power Plant (Tata Power UMPP)", label: "Mundra UMPP (4,000 MW)" },
        { name: "Khavda Renewable Energy Park (Phase I)", label: "Khavda RE Mega-Park (2,140 MW)" },
        { name: "Jakhau Wind Energy Farm", label: "Jakhau Wind (1,000 MW)" }
      ],
      dams: [],
      portsAirports: [
        { name: "Mundra Port (APSEZ)", label: "Mundra Port (260 MMT)" },
        { name: "Deendayal Port (Kandla)", label: "Deendayal Port (137 MMT)" },
        { name: "Bhuj Airport (Civil Enclave)", label: "Bhuj Airport (BHJ)" }
      ],
      industry: [{ name: "Mundra Multi-Product SEZ (APSEZ)", label: "Mundra SEZ (84 km²)" }]
    },
    "Mahisagar": {
      highways: [{ code: "NH 56", label: "NH 56 Corridor" }],
      railways: [{ code: "GDA", label: "Godhra JN Gateway (GDA)" }],
      power: [{ name: "Kadana Hydro Power Station", label: "Kadana Hydro (240 MW)" }],
      dams: [{ name: "Kadana Dam", label: "Kadana Dam (1,542 MCM • Mahi)" }],
      portsAirports: [],
      industry: []
    },
    "Mehsana": {
      highways: [{ code: "NH 58", label: "NH 58 Trunk" }],
      railways: [{ code: "MSH", label: "Mahesana JN (MSH)" }],
      power: [],
      dams: [{ name: "Dharoi Dam", label: "Dharoi Dam (815 MCM • Sabarmati)" }],
      portsAirports: [],
      industry: []
    },
    "Morbi": {
      highways: [{ code: "NH 27", label: "NH 27 (Ceramic Belt)" }],
      railways: [{ code: "MVI", label: "Morbi (MVI)" }],
      power: [],
      dams: [{ name: "Machhu II Dam", label: "Machhu II Dam (100 MCM)" }],
      portsAirports: [],
      industry: [{ name: "Morbi Ceramic Industrial Cluster", label: "Morbi Ceramic Hub" }]
    },
    "Narmada": {
      highways: [{ code: "NH 56", label: "NH 56 (Tribal Highway)" }],
      railways: [{ code: "DB", label: "Dabhoi JN Gateway (DB)" }],
      power: [{ name: "Sardar Sarovar River Bed Power House (RBPH)", label: "Sardar Sarovar Hydro (1,200 MW)" }],
      dams: [
        { name: "Sardar Sarovar Dam", label: "Sardar Sarovar (9,460 MCM • 1,450 MW)" },
        { name: "Karjan Dam", label: "Karjan Dam (630 MCM)" }
      ],
      portsAirports: [],
      industry: []
    },
    "Navsari": {
      highways: [{ code: "NH 48", label: "NH 48 (Golden Quad)" }],
      railways: [{ code: "NVS", label: "Navsari (NVS)" }],
      power: [],
      dams: [],
      portsAirports: [],
      industry: []
    },
    "Panchmahal": {
      highways: [{ code: "NH 47", label: "NH 47 (Godhra-Indore)" }],
      railways: [{ code: "GDA", label: "Godhra JN (GDA)" }],
      power: [],
      dams: [{ name: "Panam Dam", label: "Panam Dam (738 MCM)" }],
      portsAirports: [],
      industry: []
    },
    "Patan": {
      highways: [{ code: "NH 68", label: "NH 68 (Radhanpur)" }],
      railways: [{ code: "PTN", label: "Patan (PTN)" }],
      power: [
        { name: "Charanka Solar Park", label: "Charanka Solar (790 MW)" },
        { name: "Raghanesda Solar Park", label: "Raghanesda Solar (700 MW)" }
      ],
      dams: [],
      portsAirports: [],
      industry: []
    },
    "Porbandar": {
      highways: [{ code: "NH 27", label: "NH 27 Trunk" }, { code: "NH 51", label: "NH 51 Coastal" }],
      railways: [{ code: "PBR", label: "Porbandar (PBR)" }],
      power: [],
      dams: [],
      portsAirports: [{ name: "Porbandar Port & Airport", label: "Porbandar Port" }],
      industry: []
    },
    "Rajkot": {
      highways: [{ code: "NH 27", label: "NH 27 (East-West)" }, { code: "NH 47", label: "NH 47 (Ahmedabad-Rajkot)" }],
      railways: [{ code: "RJT", label: "Rajkot JN (RJT)" }],
      power: [],
      dams: [
        { name: "Bhadar Dam", label: "Bhadar Dam (238 MCM)" },
        { name: "Aji-I Dam", label: "Aji-I Dam (38 MCM)" }
      ],
      portsAirports: [{ name: "Rajkot Hirasar International Airport", label: "Rajkot Hirasar Airport (HSR)" }],
      industry: [{ name: "Rajkot Municipal Corporation (RMC)", label: "RMC Smart City" }]
    },
    "Sabarkantha": {
      highways: [{ code: "NH 48", label: "NH 48 Corridor" }],
      railways: [{ code: "HMT", label: "Himmatnagar (HMT)" }],
      power: [],
      dams: [],
      portsAirports: [],
      industry: []
    },
    "Surat": {
      highways: [{ code: "NH 48", label: "NH 48 (Golden Quad)" }, { code: "NH 53", label: "NH 53 (Hazira Port)" }],
      railways: [{ code: "ST", label: "Surat Terminal (ST)" }, { code: "UDN", label: "Udhna JN (UDN)" }],
      power: [
        { name: "Kakrapar Atomic Power Station (KAPS Unit 1-4)", label: "Kakrapar Nuclear (1,840 MW)" },
        { name: "Sugen Combined Cycle Power Plant (Torrent Power)", label: "Sugen CCPP (1,148 MW)" }
      ],
      dams: [{ name: "Ukai Dam (Vallabh Sagar)", label: "Ukai Dam Downstream" }],
      portsAirports: [
        { name: "Hazira Port (Adani / AMNS)", label: "Hazira Port (50 MMT)" },
        { name: "Surat International Airport", label: "Surat Airport (STV)" }
      ],
      industry: [
        { name: "Hazira Heavy Industrial Complex", label: "Hazira Heavy Belt" },
        { name: "Surat Municipal Corporation (SMC)", label: "SMC Smart City" }
      ]
    },
    "Surendranagar": {
      highways: [{ code: "NH 47", label: "NH 47 Trunk" }],
      railways: [{ code: "SUNR", label: "Surendranagar (SUNR)" }],
      power: [],
      dams: [{ name: "Wild Ass Sanctuary (Little Rann of Kutch)", label: "Little Rann Wild Ass Sanctuary" }],
      portsAirports: [],
      industry: []
    },
    "Tapi": {
      highways: [{ code: "NH 53", label: "NH 53 Corridor" }],
      railways: [{ code: "VYA", label: "Vyara (VYA)" }],
      power: [
        { name: "Ukai Hydro Power Station", label: "Ukai Hydro (300 MW)" },
        { name: "Ukai Thermal Power Station", label: "Ukai Thermal (850 MW)" }
      ],
      dams: [{ name: "Ukai Dam (Vallabh Sagar)", label: "Ukai Dam (7,414 MCM • Tapi Basin)" }],
      portsAirports: [],
      industry: []
    },
    "Vadodara": {
      highways: [{ code: "NE 1", label: "NE-1 (120 km/h)" }, { code: "Delhi - Vadodara Expressway", label: "NE-4 (120 km/h)" }, { code: "NH 48", label: "NH 48 (GQ)" }],
      railways: [{ code: "BRC", label: "Vadodara JN (BRC)" }],
      power: [{ name: "Wanakbori Thermal Power Station", label: "Wanakbori TPS Link (1,640 MW)" }],
      dams: [{ name: "Vishwamitri River & Vadodara Flash Flood Zone", label: "Vishwamitri Basin" }],
      portsAirports: [{ name: "Vadodara Airport (Civil Aerodrome Harni)", label: "Vadodara Airport (BDQ)" }],
      industry: [{ name: "Vadodara Municipal Corporation (VMC)", label: "VMC Smart City" }]
    },
    "Valsad": {
      highways: [{ code: "NH 48", label: "NH 48 (Golden Quad)" }],
      railways: [{ code: "BL", label: "Valsad (BL)" }, { code: "VAPI", label: "Vapi (VAPI)" }],
      power: [],
      dams: [{ name: "Damanganga (Madhuban) Dam", label: "Damanganga Dam (567 MCM)" }],
      portsAirports: [],
      industry: [{ name: "Vapi GIDC Industrial Complex", label: "Vapi Chemical GIDC" }]
    }
  };;
  if (typeof window !== 'undefined') {
    window.DISTRICT_INFRA_REGISTRY = registry;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = registry;
  }
})();
