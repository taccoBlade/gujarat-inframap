export type CityName = 'Ahmedabad' | 'Gandhinagar' | 'Vadodara' | 'Surat';

export type EntityType = 'individual_business' | 'food_street_precinct' | 'public_space';

export type FoodCategory =
  | 'Night-out destinations and hangout spots'
  | 'Cafés & coffee spots'
  | 'Late-night food'
  | 'Street food & local favourites'
  | 'Budget-friendly places for students'
  | 'Evening walks, waterfronts and public spaces';

export interface VerifiedFoodVenue {
  id: string;
  name: string;
  branch: string;
  entity_type: EntityType;
  city: CityName;
  area: string;
  category: FoodCategory;
  secondary_categories?: string[];
  address: string;
  latitude: number;
  longitude: number;
  price_range: string;
  opening_hours: string;
  late_night: boolean;
  vegetarian: string;
  status: string;
  source_urls: string[];
  last_verified: string;
  verification_notes: string;
  photo_url?: string;
  google_maps_url?: string;
}

export interface VenueOpenStatus {
  isOpen: boolean;
  isUnverified: boolean;
  badgeText: string;
  statusColor: 'green' | 'amber' | 'red';
  disclaimer?: string;
  openSpan?: string;
}

export interface VenueCorrectionReport {
  id: string;
  venueId: string;
  venueName: string;
  reportType: 'permanently_closed' | 'temporarily_closed' | 'incorrect_hours' | 'wrong_location' | 'price_change' | 'other';
  notes: string;
  submittedAt: string;
  userContact?: string;
}
