export type VerificationTier =
  | 'OFFICIAL_RECORD'        // Direct government/agency publication (e.g., Narmada Water Resources, GSRTC, Western Railway, ASI)
  | 'SECONDARY_VERIFIED'     // Cross-referenced public documentation
  | 'MANUALLY_REVIEWED'      // Audited project record with known date
  | 'DERIVED_GEOMETRY'       // Aerial/straight-line calculation (must be labeled as non-network)
  | 'UNVERIFIED_RECORD';     // Legacy dataset record awaiting source confirmation

export interface DataProvenance {
  sourceAgency: string;
  sourceTitle: string;
  sourceUrl?: string;
  publicationDate?: string;   // ISO YYYY-MM-DD or YYYY, or undefined if undated
  lastCheckedDate: string;    // e.g., '2026-10-18'
  datasetVersion?: string;
  verificationTier: VerificationTier;
  positionalAccuracyNote: string; // e.g., "Approximate centroid; coordinate decimals do not imply survey-grade accuracy."
  knownLimitations: string[];
}

export type InfrastructureCategory =
  | 'Water & Dams'
  | 'Water Transfer Schemes'
  | 'Renewable Energy'
  | 'Roads & Highways'
  | 'Railways & Stations'
  | 'Industrial & Regional Corridors';

export interface PublicInfrastructureAsset {
  id: string;
  slug: string;
  name: string;
  gujaratiName?: string;
  category: InfrastructureCategory;
  district: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  summary: string; // Plain-language explanation for citizens, students, and researchers
  verifiedCharacteristics: Array<{
    label: string;
    value: string;
    unit?: string;
    isVerified: boolean;
  }>;
  missingOrUnconfirmedFields: string[]; // Explicitly disclosed missing data
  responsibleAgency?: string;
  provenance: DataProvenance;
  relatedAssetIds: string[];
  relatedPlaceIds: string[];
}

export type PlaceCategory =
  | 'Iconic Gujarat'
  | 'Lesser-Known Places'
  | 'Nature & Wildlife'
  | 'Heritage & History'
  | 'Spiritual & Cultural'
  | 'Beaches & Coastal'
  | 'Weekend Destinations';

export interface PlaceToExplore {
  id: string;
  slug: string;
  name: string;
  gujaratiName?: string;
  category: PlaceCategory;
  district: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  tagline: string;
  significance: string; // Why the place matters culturally, historically, or ecologically
  visitorExperience: string[];
  image: {
    url: string;
    alt: string;
    attribution: string;
    licenseNote: string;
  };
  visitorLogistics: {
    openingHours: { value: string | null; status: 'VERIFIED' | 'UNVERIFIED_CHECK_LOCALLY' };
    entryFee: { value: string | null; status: 'VERIFIED' | 'UNVERIFIED_CHECK_LOCALLY' };
    permitsOrRestrictions: { value: string | null; status: 'VERIFIED' | 'UNVERIFIED_CHECK_LOCALLY' };
    seasonalNotes: string;
  };
  nearbyInfrastructureIds: string[];
  provenance: DataProvenance;
}

export type TripReadinessStatus =
  | 'WELL_DOCUMENTED'
  | 'SOME_PLANNING_REQUIRED'
  | 'IMPORTANT_DETAILS_UNVERIFIED';

export interface JourneyReadinessProfile {
  id: string;
  originCity: 'Ahmedabad'; // Initial validated origin
  destinationId: string;
  primaryAccessCorridor: {
    highwaySummary: string;
    nearestRailHub: {
      stationName: string;
      stationCode?: string;
      aerialDistanceKm: number; // Explicitly calculated or documented aerial/road distance
      roadDistanceKm?: number;  // Only populated if verified
      connectionVerified: boolean;
      note: string;
    };
    nearestBusNode: {
      depotName: string;
      serviceVerificationNote: string;
    };
  };
  lastMileGap: {
    hasLastMileUncertainty: boolean;
    headline: string; // e.g., "Nearby railway station identified. The onward connection from the station to this destination has not been verified."
    verifiedOptions: string[];
    unverifiedFactors: string[];
    returnJourneyWarning: string;
  };
  beforeYouGoChecklist: string[];
  provenance: DataProvenance;
}
