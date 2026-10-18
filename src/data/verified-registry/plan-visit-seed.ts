import { JourneyReadinessProfile } from '../../types/inframap';

export const VERIFIED_PLAN_VISIT_SEEDS: JourneyReadinessProfile[] = [
  {
    id: 'jrn-ahmedabad-adalaj',
    originCity: 'Ahmedabad',
    destinationId: 'adalaj-ni-vav',
    primaryAccessCorridor: {
      highwaySummary: 'Located along NH-147 / Sarkhej–Gandhinagar Highway corridor (approx. 18–20 km north of central Ahmedabad).',
      nearestRailHub: {
        stationName: 'Kalupur (Ahmedabad Junction) / Sabarmati Junction',
        stationCode: 'ADI / SBT',
        aerialDistanceKm: 14.5,
        roadDistanceKm: 18.2,
        connectionVerified: true,
        note: 'Frequent suburban and express connections to Ahmedabad Junction (ADI) and Sabarmati Junction (SBT).'
      },
      nearestBusNode: {
        depotName: 'GSRTC Gandhinagar Central / Adalaj Circle Stop',
        serviceVerificationNote: 'High-frequency Ahmedabad–Gandhinagar BRTS and GSRTC suburban corridor buses stop at Adalaj Crossroads.'
      }
    },
    lastMileGap: {
      hasLastMileUncertainty: false,
      headline: 'Direct road access via SG Highway with short pedestrian or auto-rickshaw connection.',
      verifiedOptions: [
        'Local auto-rickshaw available from Adalaj Crossroads directly to monument entrance (~400m).',
        'Direct taxi or ride-hailing services operate continuously from central Ahmedabad.'
      ],
      unverifiedFactors: [
        'Late evening return transit frequency (post 20:00) requires prior arrangement.'
      ],
      returnJourneyWarning: 'Evening return transport from Adalaj crossroads to Ahmedabad is reliable until 21:00; afterwards, private vehicle is advised.'
    },
    beforeYouGoChecklist: [
      'Confirm monument opening hours with ASI Vadodara Circle (typically sunrise to sunset).',
      'Wear slip-resistant footwear suitable for stone stepwell stairs.',
      'Photography permits not required for non-commercial mobile photography.'
    ],
    provenance: {
      sourceAgency: 'Archaeological Survey of India (ASI) Vadodara Circle & Gujarat Tourism',
      sourceTitle: 'Adalaj ni Vav Visitor Access & Monument Dossier',
      sourceUrl: 'https://asivadodara.org',
      publicationDate: '2024',
      lastCheckedDate: '2026-10-18',
      datasetVersion: '2.1.0',
      verificationTier: 'OFFICIAL_RECORD',
      positionalAccuracyNote: 'Approximate centroid; coordinate decimals do not imply survey-grade accuracy.',
      knownLimitations: [
        'Urban traffic on SG Highway can increase travel duration during peak commute hours (09:00-11:00, 18:00-20:00).'
      ]
    }
  },
  {
    id: 'jrn-ahmedabad-modhera',
    originCity: 'Ahmedabad',
    destinationId: 'sun-temple-modhera',
    primaryAccessCorridor: {
      highwaySummary: 'Via SH-41 / Ahmedabad–Mehsana–Becharaji highway corridor (~100 km road distance).',
      nearestRailHub: {
        stationName: 'Mehsana Junction',
        stationCode: 'MSH',
        aerialDistanceKm: 23.4,
        roadDistanceKm: 26.5,
        connectionVerified: true,
        note: 'Major broad-gauge junction with daily express connections from Ahmedabad.'
      },
      nearestBusNode: {
        depotName: 'GSRTC Mehsana Central / Modhera Village Stand',
        serviceVerificationNote: 'Periodic GSRTC rural feeder buses operate between Mehsana bus station and Becharaji via Modhera.'
      }
    },
    lastMileGap: {
      hasLastMileUncertainty: true,
      headline: 'Nearby railway station identified (Mehsana Junction, ~25 km). The onward connection from Mehsana station to Modhera relies on regional GSRTC buses or private taxis whose live schedules are not verified on this platform.',
      verifiedOptions: [
        'Private hire taxi from Mehsana Junction or Ahmedabad.'
      ],
      unverifiedFactors: [
        'Rural GSRTC bus schedules from Mehsana to Modhera are subject to change without online real-time tracking.',
        'Shared auto-rickshaw availability from Modhera back to Mehsana after sunset is unverified.'
      ],
      returnJourneyWarning: 'Onward transit from Mehsana halt to the temple has no dedicated shuttle service. Visitors without a personal vehicle should verify return transport in advance.'
    },
    beforeYouGoChecklist: [
      'Book morning departure from Ahmedabad to allow 2 hours on-site at the Surya Kund and Sabha Mandapa.',
      'Check evening light & sound show timings locally if planning an evening visit.',
      'Confirm battery vehicle availability for elderly visitors at the ASI reception.'
    ],
    provenance: {
      sourceAgency: 'Archaeological Survey of India (ASI) & Gujarat Energy Development Agency (GEDA)',
      sourceTitle: 'Modhera Sun Temple & Solar Heritage Village Access Registry',
      sourceUrl: 'https://asivadodara.org',
      publicationDate: '2024',
      lastCheckedDate: '2026-10-18',
      datasetVersion: '1.4.0',
      verificationTier: 'SECONDARY_VERIFIED',
      positionalAccuracyNote: 'Approximate monument centroid; road distances derived from state highway markers.',
      knownLimitations: [
        'Transit feeder schedules from Mehsana to Modhera are not integrated with live GPS tracking.'
      ]
    }
  },
  {
    id: 'jrn-ahmedabad-sardar-sarovar',
    originCity: 'Ahmedabad',
    destinationId: 'sardar-sarovar-ekta-nagar',
    primaryAccessCorridor: {
      highwaySummary: 'Express highway corridor via NH-48 (Ahmedabad–Vadodara) connecting to SH-11 / Dabhoi–Ekta Nagar corridor (~195–200 km).',
      nearestRailHub: {
        stationName: 'Ekta Nagar Railway Station',
        stationCode: 'EKNR',
        aerialDistanceKm: 5.2,
        roadDistanceKm: 6.8,
        connectionVerified: true,
        note: 'Purpose-built terminal station with daily express Jan Shatabdi and overnight trains from Ahmedabad, Mumbai, and Delhi.'
      },
      nearestBusNode: {
        depotName: 'Ekta Nagar Central Tourist Bus Terminal',
        serviceVerificationNote: 'Dedicated zero-emission electric visitor shuttles operate across all Kevadia tourist circuits.'
      }
    },
    lastMileGap: {
      hasLastMileUncertainty: false,
      headline: 'Dedicated internal electric shuttle circuit connects Ekta Nagar station, parking hubs, and dam viewing galleries.',
      verifiedOptions: [
        'Statutory electric tourist shuttle fleet operating on scheduled internal routes.',
        'Station-to-complex autorickshaw and pre-booked electric cab transfers.'
      ],
      unverifiedFactors: [
        'Private vehicle entry into core monument zone is restricted; visitors must park in designated peripheral lots and use authorized shuttles.'
      ],
      returnJourneyWarning: 'Pre-book return train tickets on EKNR departures as evening express seats book out quickly on weekends.'
    },
    beforeYouGoChecklist: [
      'Entry tickets, dam viewpoint slots, and viewing gallery passes must be pre-booked on the official Statue of Unity portal (no on-spot ticket counters).',
      'Statue complex is closed on Mondays for maintenance.',
      'Check SSNNL dam reservoir water-level advisories during monsoon release periods.'
    ],
    provenance: {
      sourceAgency: 'Sardar Sarovar Narmada Nigam Ltd. (SSNNL) & Statue of Unity Tourism Authority (SOUADTGA)',
      sourceTitle: 'Ekta Nagar Strategic Visitor & Hydraulic Infrastructure Disclosures',
      sourceUrl: 'https://sardarsarovardam.org',
      publicationDate: '2025',
      lastCheckedDate: '2026-10-18',
      datasetVersion: '3.0.0',
      verificationTier: 'OFFICIAL_RECORD',
      positionalAccuracyNote: 'Exact survey benchmark at dam crest & visitor complex terminal.',
      knownLimitations: [
        'Peak holiday traffic on Dabhoi–Kevadia highway can cause delays despite 4-lane expansion.'
      ]
    }
  },
  {
    id: 'jrn-ahmedabad-lothal',
    originCity: 'Ahmedabad',
    destinationId: 'lothal-archaeological-site',
    primaryAccessCorridor: {
      highwaySummary: 'Via NH-47 / Bagodara highway corridor connecting to Dholka–Bhurkhi road (~80 km southwest of Ahmedabad).',
      nearestRailHub: {
        stationName: 'Lothal Bhurkhi Railway Station',
        stationCode: 'LOT',
        aerialDistanceKm: 5.8,
        roadDistanceKm: 6.5,
        connectionVerified: false,
        note: 'Small rural halt on the Gandhigram–Bhavnagar meter/broad gauge line with very sparse passenger train service.'
      },
      nearestBusNode: {
        depotName: 'GSRTC Bagodara Junction / Dholka Bus Station',
        serviceVerificationNote: 'Buses connect Ahmedabad to Bagodara; local onward connection to Saragwala village is intermittent.'
      }
    },
    lastMileGap: {
      hasLastMileUncertainty: true,
      headline: 'Nearby railway station identified (Lothal Bhurkhi). However, train frequency is limited and the ~6 km onward road transfer from the halt station to the archaeological site has no confirmed dedicated shuttle service. Visitors arriving without a personal vehicle should verify return transport in advance.',
      verifiedOptions: [
        'Personal car, hired taxi, or tour vehicle from Ahmedabad is strongly advised.'
      ],
      unverifiedFactors: [
        'On-demand auto-rickshaws at Lothal Bhurkhi halt station are not guaranteed upon arrival.',
        'Public transport options for the return journey back to Bagodara or Ahmedabad are sparse after 16:00.'
      ],
      returnJourneyWarning: 'There are no active ride-hailing services in Dholka taluka. Visitors without reserved return transport risk becoming stranded at the site.'
    },
    beforeYouGoChecklist: [
      'Archaeological Museum opening hours: 10:00 to 17:00 (closed on Fridays).',
      'Carry adequate drinking water; visitor amenities at the archaeological mound are basic.',
      'Check National Maritime Heritage Complex (NMHC) construction detour notices prior to departure.'
    ],
    provenance: {
      sourceAgency: 'Archaeological Survey of India (ASI) & National Maritime Heritage Complex (NMHC)',
      sourceTitle: 'Lothal Harappan Port City Excavation Site Information & NMHC Master Plan',
      sourceUrl: 'https://asi.nic.in',
      publicationDate: '2024',
      lastCheckedDate: '2026-10-18',
      datasetVersion: '1.2.0',
      verificationTier: 'SECONDARY_VERIFIED',
      positionalAccuracyNote: 'Excavation dock basin centroid; access roads verified against OpenStreetMap GPS traces.',
      knownLimitations: [
        'NMHC construction in Saragwala may alter temporary entry routes to the ancient dock.'
      ]
    }
  },
  {
    id: 'jrn-ahmedabad-dholavira',
    originCity: 'Ahmedabad',
    destinationId: 'dholavira-harappan-city',
    primaryAccessCorridor: {
      highwaySummary: 'Long-distance highway journey via NH-27, Rapar, and the Khadir Bet causeway / "Road to Heaven" (~360–380 km from Ahmedabad).',
      nearestRailHub: {
        stationName: 'Bhuj Railway Station / Samakhiali Junction',
        stationCode: 'BHUJ / SIOB',
        aerialDistanceKm: 110.0,
        roadDistanceKm: 140.0,
        connectionVerified: false,
        note: 'Major railheads are located over 100 km away across the Little and Great Rann.'
      },
      nearestBusNode: {
        depotName: 'GSRTC Rapar Bus Station',
        serviceVerificationNote: 'Limited rural bus runs from Rapar across the Khadir causeway to Dholavira village once or twice daily.'
      }
    },
    lastMileGap: {
      hasLastMileUncertainty: true,
      headline: 'Major last-mile distance gap identified. Nearest major railheads are over 100 km away. Access crosses remote Rann causeways where fuel stations, public bus frequency, and evening return transport are sparse and unverified.',
      verifiedOptions: [
        'Dedicated high-clearance private vehicle or verified hired taxi from Bhuj or Ahmedabad with reserved overnight stay.'
      ],
      unverifiedFactors: [
        'Fuel stations are unavailable on Khadir Bet island; visitors must refuel at Rapar before crossing the causeway.',
        'Mobile cellular signal (data connectivity) is intermittent across the White Rann causeway.',
        'Public bus return schedules are unverified and subject to cancellation.'
      ],
      returnJourneyWarning: 'Do not attempt a same-day return journey from Ahmedabad by road (750+ km round trip). Plan at least one overnight stay in Dholavira or Rapar.'
    },
    beforeYouGoChecklist: [
      'UNESCO World Heritage Site open 06:00 to 18:00 daily.',
      'Refuel fully at Rapar (~90 km south) before entering the Rann causeway.',
      'Confirm accommodation in advance (Dholavira Tourism Resort or local homestays).',
      'During monsoon season (July-September), verify causeway water submergence status with Kutch district administration.'
    ],
    provenance: {
      sourceAgency: 'UNESCO World Heritage Centre & Archaeological Survey of India (ASI)',
      sourceTitle: 'Dholavira: A Harappan City Nomination Dossier & Gujarat R&B Dept.',
      sourceUrl: 'https://whc.unesco.org/en/list/1644',
      publicationDate: '2024',
      lastCheckedDate: '2026-10-18',
      datasetVersion: '2.0.0',
      verificationTier: 'OFFICIAL_RECORD',
      positionalAccuracyNote: 'Ancient citadel coordinate centroid; causeway distances verified via Survey of India state road atlas.',
      knownLimitations: [
        'Causeway subject to high winds and seasonal saline flooding in late monsoon.'
      ]
    }
  }
];
