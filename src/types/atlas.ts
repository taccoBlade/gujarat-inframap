export type AtlasMode = 
  | 'explore'
  | 'places'
  | 'unfiltered'
  | 'passport'
  | 'infrastructure'
  | 'ev';

export type DistrictRegion = 
  | 'Kachchh' 
  | 'Saurashtra' 
  | 'North Gujarat' 
  | 'Central Gujarat' 
  | 'South Gujarat';

export interface DistrictPassportStamp {
  id: string;                 // e.g. 'patan'
  name: string;               // e.g. 'Patan'
  gujaratiName: string;       // e.g. 'પાટણ'
  region: DistrictRegion;
  hq: string;
  icon: string;               // Emoji or SVG motif icon
  landmark: string;           // e.g. 'Rani ki Vav'
  culturalTitle: string;      // e.g. 'Capital of Solanki Architecture & Patola Weaving'
  coordinates: [number, number]; // [lat, lng]
  isCollected: boolean;
  collectedAt?: string;
  rarityPercentile: number;   // e.g. 96 (Top 4%)
}

export interface UnfilteredPlaceStory {
  id: string;
  name: string;
  gujaratiName: string;
  district: string;
  category: 'folklore_eerie' | 'heritage' | 'nature' | 'viewpoint' | 'unusual_landmark' | 'curated_short_trip';
  tagline: string;
  folkloreMyth: string;
  groundReality: string;
  factCheckStatus: 'debunked_legend' | 'historical_fact' | 'geological_phenomenon' | 'unverified_folklore';
  legalAccess: 'public_open' | 'statutory_restricted' | 'permit_required' | 'daylight_only';
  coordinates: [number, number];
  photoUrl: string;
  recommendedTime?: string;
  routeTip?: string;
}

export interface UserPassportProfile {
  uid: string;
  name: string;
  handle: string;
  email?: string;
  phoneNumber?: string;
  photoURL?: string;
  authProvider?: 'google' | 'phone' | 'demo' | 'anonymous';
  homeDistrict: string;
  collectedStampIds: string[];
  bookmarkedStoryIds: string[];
  visitedPlaceIds?: string[];
  badges?: string[];
  lastCheckedInDistrict?: string;
  joinedDate: string;
  isLoggedIn: boolean;
}
