import { EVChargingStation } from '../types/ev';

export const GUJARAT_HIGHWAY_EV_STATIONS: EVChargingStation[] = [
  // 1. NE-1 Expressway (Ahmedabad - Vadodara)
  {
    id: 'GJ-EV-NE1-01',
    name: 'Tata Power 120kW Dual Gun — Reliance Food Plaza, NE-1',
    gujaratiName: 'ટાટા પાવર ૧૨૦ કિલોવૉટ સુપરચાર્જર — એક્સપ્રેસવે ફૂડ પ્લાઝા',
    network: 'Tata Power EZ Charge',
    corridor: 'NE-1 Ahmedabad–Vadodara Expressway',
    district: 'Anand',
    locationDesc: 'KM 48, Midway Oasis Food Plaza, Towards Vadodara',
    coordinates: [22.5645, 72.9289],
    totalPowerKw: 120,
    guns: [
      { type: 'CCS2', count: 2, speedKw: 60, status: 'Available' },
      { type: 'Type 2 AC', count: 1, speedKw: 7.4, status: 'Available' }
    ],
    reliabilityScore: 98,
    lastVerifiedWorking: 'Today, 1h ago by Nexon EV Max driver',
    hasDgBackup: true,
    hasCanopyShade: true,
    has24x7Security: true,
    tariffPerKwh: '₹21.00 / kWh + 18% GST',
    idleFee: '₹1.50/min if idle >15 mins',
    paymentMethods: ['Tata Power EZ Charge App', 'RFID Tap-Card', 'AutoCharge Plug & Play'],
    amenities: {
      food: 'Honest Restaurant, Subway, Tea Post, Costa Coffee',
      washroom: 'Clean & AC',
      nightSafeForFamily: true,
      restLounge: true
    },
    criticalRoadtripWarning: 'Dual 120kW drops to 60kW dynamic sharing if two vehicles charge simultaneously.',
    troubleshootingTip: 'If handshake stalls at 99% connecting, turn car off completely, lock doors for 60 seconds, and replug gun firmly until double click.',
    supportPhone: '1800-209-5161'
  },
  {
    id: 'GJ-EV-NE1-02',
    name: 'Jio-bp pulse 60kW DC Fast Charger — Nadiad Bypass Hub',
    gujaratiName: 'જિયો-બીપી પલ્સ ૬૦ કિલોવૉટ ફાસ્ટ ચાર્જર — નડિયાદ બાયપાસ',
    network: 'Jio-bp pulse',
    corridor: 'NE-1 Ahmedabad–Vadodara Expressway',
    district: 'Kheda',
    locationDesc: 'Near Nadiad Toll Plaza Exit, Wild Camp Food Court',
    coordinates: [22.6916, 72.8634],
    totalPowerKw: 60,
    guns: [
      { type: 'CCS2', count: 2, speedKw: 60, status: 'Available' }
    ],
    reliabilityScore: 96,
    lastVerifiedWorking: 'Today, 3h ago by MG ZS EV driver',
    hasDgBackup: true,
    hasCanopyShade: true,
    has24x7Security: true,
    tariffPerKwh: '₹20.50 / kWh + GST',
    paymentMethods: ['Jio-bp pulse App', 'UPI QR Code', 'RFID Card'],
    amenities: {
      food: 'Wild Camp Kathiyawadi, Dosa Plaza, Nescafe Kiosk',
      washroom: 'Clean Standard',
      nightSafeForFamily: true,
      restLounge: false
    },
    troubleshootingTip: 'Scan QR before plugging in cable to avoid server timeout.',
    supportPhone: '1800-891-9023'
  },

  // 2. NH-48 Golden Corridor (Vadodara - Bharuch - Surat - Navsari - Valsad)
  {
    id: 'GJ-EV-NH48-01',
    name: 'ChargeZone 180kW Hypercharger — Honest Food Mall, Ankleshwar',
    gujaratiName: 'ચાર્જઝોન ૧૮૦ કિલોવૉટ હાઇપરચાર્જર — હોનેસ્ટ ફૂડ મૉલ, અંકલેશ્વર',
    network: 'ChargeZone',
    corridor: 'NH-48 Ahmedabad–Surat Golden Corridor',
    district: 'Bharuch',
    locationDesc: 'NH-48 Golden Bridge Bypass, Opp Ankleshwar GIDC Gate',
    coordinates: [21.6264, 73.0033],
    totalPowerKw: 180,
    guns: [
      { type: 'CCS2', count: 2, speedKw: 120, status: 'Available' },
      { type: 'CCS2', count: 1, speedKw: 60, status: 'Available' }
    ],
    reliabilityScore: 99,
    lastVerifiedWorking: 'Today, 45m ago by BYD Atto 3 driver',
    hasDgBackup: true,
    hasCanopyShade: true,
    has24x7Security: true,
    tariffPerKwh: '₹22.50 / kWh + GST',
    idleFee: '₹2.00/min after 100% full',
    paymentMethods: ['ChargeZone App', 'Preloaded Wallet', 'RFID Card'],
    amenities: {
      food: '24/7 Honest Pav Bhaji, Bikanervala, Cafe Coffee Day',
      washroom: 'Clean & AC',
      nightSafeForFamily: true,
      restLounge: true
    },
    troubleshootingTip: 'Heavy liquid-cooled cable. Hold the gun elevated until the blue LED turns pulsing green.',
    supportPhone: '080-6927-4000'
  },
  {
    id: 'GJ-EV-NH48-02',
    name: 'Tata Power 60kW Fast Charger — Sugar Bowl Highway Retreat',
    gujaratiName: 'ટાટા પાવર ૬૦ કિલોવૉટ ફાસ્ટ ચાર્જર — સુગર બાઉલ હાઇવે રીટ્રીટ',
    network: 'Tata Power EZ Charge',
    corridor: 'NH-48 Ahmedabad–Surat Golden Corridor',
    district: 'Navsari',
    locationDesc: 'NH-48 Navsari South Bypass, Near Gandevi Flyover',
    coordinates: [20.9467, 72.9520],
    totalPowerKw: 60,
    guns: [
      { type: 'CCS2', count: 2, speedKw: 30, status: 'Available' }
    ],
    reliabilityScore: 94,
    lastVerifiedWorking: 'Yesterday, 8h ago by Tiago EV driver',
    hasDgBackup: false,
    hasCanopyShade: true,
    has24x7Security: true,
    tariffPerKwh: '₹21.00 / kWh + GST',
    paymentMethods: ['Tata Power App', 'RFID Card'],
    amenities: {
      food: 'Sugar Bowl Pure Veg Gujarati & South Indian, Fresh Sugarcane Juice',
      washroom: 'Clean Standard',
      nightSafeForFamily: true,
      restLounge: false
    },
    troubleshootingTip: 'No generator backup here. If local grid fluctuates during thunderstorm, charger pauses automatically.',
    supportPhone: '1800-209-5161'
  },
  {
    id: 'GJ-EV-NH48-03',
    name: 'Statiq 120kW Dual Gun — Hotel Decent Highway Hub, Vapi',
    gujaratiName: 'સ્ટેટિક ૧૨૦ કિલોવૉટ ડ્યુઅલ ગન — હોટેલ ડીસન્ટ હાઇવે હબ, વાપી',
    network: 'Statiq',
    corridor: 'NH-48 Surat–Mumbai Border Corridor',
    district: 'Valsad',
    locationDesc: 'NH-48 Vapi Border Milestone 14, Near Daman Junction',
    coordinates: [20.3725, 72.9106],
    totalPowerKw: 120,
    guns: [
      { type: 'CCS2', count: 2, speedKw: 60, status: 'Available' },
      { type: 'Type 2 AC', count: 1, speedKw: 11, status: 'Available' }
    ],
    reliabilityScore: 95,
    lastVerifiedWorking: 'Today, 2h ago by Ioniq 5 driver',
    hasDgBackup: true,
    hasCanopyShade: true,
    has24x7Security: true,
    tariffPerKwh: '₹21.50 / kWh + GST',
    paymentMethods: ['Statiq App', 'UPI QR', 'RFID Keyfob'],
    amenities: {
      food: 'Hotel Decent Multi-Cuisine, McDonald’s Drive-Thru, CCD',
      washroom: 'Clean & AC',
      nightSafeForFamily: true,
      restLounge: true
    },
    troubleshootingTip: 'Ensure parking inside yellow boundary lines to prevent cable stretching.',
    supportPhone: '011-4118-2000'
  },

  // 3. NH-47 / NH-27 Saurashtra Corridor (Ahmedabad - Rajkot - Jamnagar - Dwarka)
  {
    id: 'GJ-EV-NH47-01',
    name: 'Jio-bp pulse 120kW Fast Hub — Chotila Hillside Food Mall',
    gujaratiName: 'જિયો-બીપી પલ્સ ૧૨૦ કિલોવૉટ હબ — ચોટીલા હિલસાઇડ ફૂડ મૉલ',
    network: 'Jio-bp pulse',
    corridor: 'NH-47 / NH-27 Ahmedabad–Rajkot Highway',
    district: 'Surendranagar',
    locationDesc: 'NH-47 Chotila Bypass, 2 km after Chamunda Mata Temple turnoff',
    coordinates: [22.4211, 71.1925],
    totalPowerKw: 120,
    guns: [
      { type: 'CCS2', count: 2, speedKw: 60, status: 'Available' }
    ],
    reliabilityScore: 97,
    lastVerifiedWorking: 'Today, 1h ago by XUV400 driver',
    hasDgBackup: true,
    hasCanopyShade: true,
    has24x7Security: true,
    tariffPerKwh: '₹20.50 / kWh + GST',
    paymentMethods: ['Jio-bp pulse App', 'RFID Card'],
    amenities: {
      food: 'Chamunda Dining Hall (Kathiyawadi Thali), Tea Post, Havmor Ice Cream',
      washroom: 'Clean & AC',
      nightSafeForFamily: true,
      restLounge: true
    },
    troubleshootingTip: 'High traffic during weekend Chotila temple pilgrimage. Use in-app slot reserve feature if available.',
    supportPhone: '1800-891-9023'
  },
  {
    id: 'GJ-EV-NH27-02',
    name: 'BPCL eDrive 60kW DC Fast Charger — Khambhalia–Dwarka Highway',
    gujaratiName: 'બીપીસીએલ ઈ-ડ્રાઈવ ૬૦ કિલોવૉટ ફાસ્ટ ચાર્જર — ખંભાળિયા-દ્વારકા હાઇવે',
    network: 'BPCL eDrive',
    corridor: 'NH-27 Rajkot–Jamnagar–Dwarka Highway',
    district: 'Devbhumi Dwarka',
    locationDesc: 'BPCL COCO Fuel Station, 22 km before Dwarkadhish Temple',
    coordinates: [22.2442, 68.9685],
    totalPowerKw: 60,
    guns: [
      { type: 'CCS2', count: 2, speedKw: 30, status: 'Available' }
    ],
    reliabilityScore: 92,
    lastVerifiedWorking: 'Yesterday, 14h ago by Punch EV driver',
    hasDgBackup: true,
    hasCanopyShade: true,
    has24x7Security: true,
    tariffPerKwh: '₹19.50 / kWh + GST',
    paymentMethods: ['Hello BPCL App', 'Fuel Card', 'UPI'],
    amenities: {
      food: 'In & Out Convenience Store, Kathiyawadi Dhaba nearby',
      washroom: 'Clean Standard',
      nightSafeForFamily: true,
      restLounge: false
    },
    criticalRoadtripWarning: '⚠️ LAST RELIABLE FAST CHARGER BEFORE BEYT DWARKA & OKHA JETTY! Charge to at least 80% to cover the coastal return loop.',
    troubleshootingTip: 'If Hello BPCL app gives location permission error, pay cash at BPCL counter to initiate pump card RFID authorization.',
    supportPhone: '1800-22-4344'
  },

  // 4. Kutch Desert Corridor (Maliya - Samakhiali - Bhuj - Khavda Lifeline)
  {
    id: 'GJ-EV-KUTCH-01',
    name: 'Tata Power 60kW DC Fast Charger — Hotel Prince, Bhuj Central',
    gujaratiName: 'ટાટા પાવર ૬૦ કિલોવૉટ ડીસી ફાસ્ટ ચાર્જર — ભુજ સિટી સેન્ટ્રલ',
    network: 'Tata Power EZ Charge',
    corridor: 'Kutch Desert & Rann Corridor',
    district: 'Kachchh',
    locationDesc: 'Station Road, Opp Old Civil Hospital, Bhuj',
    coordinates: [23.2420, 69.6669],
    totalPowerKw: 60,
    guns: [
      { type: 'CCS2', count: 2, speedKw: 30, status: 'Available' }
    ],
    reliabilityScore: 96,
    lastVerifiedWorking: 'Today, 5h ago by Nexon EV driver',
    hasDgBackup: true,
    hasCanopyShade: true,
    has24x7Security: true,
    tariffPerKwh: '₹22.00 / kWh + GST',
    paymentMethods: ['Tata Power EZ Charge App', 'RFID Card'],
    amenities: {
      food: 'Toran Dining Hall, Prince Multi-Cuisine, Kutchhi Sweets',
      washroom: 'Clean & AC',
      nightSafeForFamily: true,
      restLounge: true
    },
    criticalRoadtripWarning: '⚠️ CRITICAL KUTCH WHITE RANN ALERT: This is the LAST high-speed DC fast charger before Dhordo White Desert (85 km) and Khavda / Dholavira (140 km). MUST CHARGE TO 100% HERE! Tent City has limited 15A slow sockets only.',
    troubleshootingTip: 'Kutch temperature hits 46°C in summer. Always run pre-cooling / AC for 5 minutes before fast charging to avoid battery thermal throttling.',
    supportPhone: '1800-209-5161'
  },
  {
    id: 'GJ-EV-KUTCH-02',
    name: 'Jio-bp pulse 60kW Fast Charger — Samakhiali Junction Hub',
    gujaratiName: 'જિયો-બીપી પલ્સ ૬૦ કિલોવૉટ — સામખિયાળી જંકશન ગેટવે',
    network: 'Jio-bp pulse',
    corridor: 'Kutch Desert & Rann Corridor',
    district: 'Kachchh',
    locationDesc: 'Samakhiali Toll Plaza Intersection, Gateway to Kutch',
    coordinates: [23.3106, 70.4728],
    totalPowerKw: 60,
    guns: [
      { type: 'CCS2', count: 2, speedKw: 30, status: 'Available' }
    ],
    reliabilityScore: 94,
    lastVerifiedWorking: 'Today, 4h ago by MG ZS EV driver',
    hasDgBackup: true,
    hasCanopyShade: true,
    has24x7Security: true,
    tariffPerKwh: '₹21.00 / kWh + GST',
    paymentMethods: ['Jio-bp pulse App', 'RFID Card'],
    amenities: {
      food: 'Gateway Dhaba, Tea Post, Highway Food Plaza',
      washroom: 'Clean Standard',
      nightSafeForFamily: true,
      restLounge: false
    },
    criticalRoadtripWarning: 'Strong coastal crosswinds across Surajbari bridge increase EV highway consumption by 15-20%. Plan for 180 Wh/km.',
    troubleshootingTip: 'If mobile network drops on border SIM towers, connect to the fuel pump complimentary Wi-Fi to start session.',
    supportPhone: '1800-891-9023'
  },

  // 5. Dang Forest Ghat Route (Navsari - Waghai - Saputara)
  {
    id: 'GJ-EV-DANG-01',
    name: 'ChargeZone 60kW DC Fast Charger — Waghai Forest Crossroads',
    gujaratiName: 'ચાર્જઝોન ૬૦ કિલોવૉટ ફાસ્ટ ચાર્જર — વઘઇ ફોરેસ્ટ ચાર રસ્તા',
    network: 'ChargeZone',
    corridor: 'Dang Teak Forest & Saputara Ghat Corridor',
    district: 'The Dangs',
    locationDesc: 'SH-14 Waghai Junction, Opposite Botanical Garden Gateway',
    coordinates: [20.7681, 73.5042],
    totalPowerKw: 60,
    guns: [
      { type: 'CCS2', count: 2, speedKw: 30, status: 'Available' }
    ],
    reliabilityScore: 91,
    lastVerifiedWorking: 'Yesterday, 11h ago by Nexon EV driver',
    hasDgBackup: true,
    hasCanopyShade: true,
    has24x7Security: true,
    tariffPerKwh: '₹22.50 / kWh + GST',
    paymentMethods: ['ChargeZone App', 'RFID Card'],
    amenities: {
      food: 'Forest Canteen (Organic Dangi Nagli Roti & Urad Dal), Tea Stalls',
      washroom: 'Basic',
      nightSafeForFamily: false,
      restLounge: false
    },
    criticalRoadtripWarning: '⚠️ CRITICAL DANG FOREST ELEVATION WARNING: Climbing from Waghai (120m) to Saputara (1,000m) consumes ~2.2x normal battery percentage. Zero fast chargers exist inside the forest sanctuary. MUST have at least 65% battery before ascending.',
    troubleshootingTip: 'Cellular signal drops to 2G inside the deep teak forest. Download offline QR or tap RFID card to authenticate session.',
    supportPhone: '080-6927-4000'
  },

  // 6. Saurashtra Coastal & Somnath Corridor
  {
    id: 'GJ-EV-COAST-01',
    name: 'Zeon 60kW Fast Hub — Somnath Gateway Complex, Veraval',
    gujaratiName: 'ઝિઓન ૬૦ કિલોવૉટ ફાસ્ટ હબ — સોમનાથ ગેટવે કોમ્પ્લેક્સ, વેરાવળ',
    network: 'Zeon',
    corridor: 'Saurashtra Coastal Highway',
    district: 'Gir Somnath',
    locationDesc: 'NH-51 Bypass, 4 km before Somnath First Jyotirlinga Shrine',
    coordinates: [20.9080, 70.3705],
    totalPowerKw: 60,
    guns: [
      { type: 'CCS2', count: 2, speedKw: 30, status: 'Available' },
      { type: 'Type 2 AC', count: 1, speedKw: 7.4, status: 'Available' }
    ],
    reliabilityScore: 97,
    lastVerifiedWorking: 'Today, 3h ago by Tata Curvv EV driver',
    hasDgBackup: true,
    hasCanopyShade: true,
    has24x7Security: true,
    tariffPerKwh: '₹21.00 / kWh + GST',
    paymentMethods: ['Zeon Charging App', 'RFID Card', 'UPI'],
    amenities: {
      food: 'Somnath Sagar Restaurant (Kathiyawadi Thali), Coconut Water Stalls',
      washroom: 'Clean & AC',
      nightSafeForFamily: true,
      restLounge: true
    },
    troubleshootingTip: 'Coastal salinity can corrode plug pins. If locking motor clicks repeatedly, gently hold the cable straight into the socket until lock engages.',
    supportPhone: '1800-572-8888'
  },

  // 7. North Gujarat & Vav-Tharad Border Corridor
  {
    id: 'GJ-EV-BORDER-01',
    name: 'BPCL eDrive 60kW DC Fast Charger — Tharad Crossroads Border Lifeline',
    gujaratiName: 'બીપીસીએલ ઈ-ડ્રાઈવ ૬૦ કિલોવૉટ — થરાદ ક્રોસરોડ્સ બોર્ડર લાઈફલાઈન',
    network: 'BPCL eDrive',
    corridor: 'North Gujarat Border Corridor',
    district: 'Vav-Tharad',
    locationDesc: 'NH-68 Intersection, Tharad Gateway to Nadabet Indo-Pak Border',
    coordinates: [24.3942, 71.6268],
    totalPowerKw: 60,
    guns: [
      { type: 'CCS2', count: 2, speedKw: 30, status: 'Available' }
    ],
    reliabilityScore: 93,
    lastVerifiedWorking: 'Today, 6h ago by Punch EV driver',
    hasDgBackup: true,
    hasCanopyShade: true,
    has24x7Security: true,
    tariffPerKwh: '₹20.00 / kWh + GST',
    paymentMethods: ['Hello BPCL App', 'RFID Card', 'Cash Counter Activation'],
    amenities: {
      food: 'Tharad Highway Dhaba (Bajra No Rotlo & Ringna No Olo)',
      washroom: 'Clean Standard',
      nightSafeForFamily: true,
      restLounge: false
    },
    criticalRoadtripWarning: '⚠️ NADABET SEEMA DARSHAN WARNING: Last high-speed charger before Nadabet border zero-point (72 km away). Charge to 90%+ here as Nadabet outpost has only a shared single AC plug.',
    troubleshootingTip: 'Rural Rajasthan/Gujarat border power line. Verify that the charger display is lit up green before parking.',
    supportPhone: '1800-22-4344'
  }
];
