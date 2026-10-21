/**
 * Gujarat InfraMap — Food & Nightlife Photo & Fallback Registry
 * Provides guaranteed local and verified CDN fallbacks for venue cards and drawers.
 */

export const CITY_DEFAULT_FOOD_PHOTOS: Record<string, string> = {
  Ahmedabad: '/images/destinations/manek-chowk-food-night.jpg',
  Gandhinagar: '/images/destinations/akshardham-gandhinagar.jpg',
  Vadodara: '/images/destinations/laxmi-vilas-palace.jpg',
  Surat: '/images/destinations/manek-chowk-food-night.jpg',
  default: '/images/destinations/manek-chowk-food-night.jpg'
};

export const CATEGORY_FALLBACK_PHOTOS: Record<string, string> = {
  'Street food & local favourites': '/images/destinations/manek-chowk-food-night.jpg',
  'Cafés & coffee spots': 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
  'Late-night food': '/images/destinations/manek-chowk-food-night.jpg',
  'Night-out destinations and hangout spots': 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
  'Evening walks, waterfronts and public spaces': '/images/destinations/sabarmati-ashram.jpg',
  'Budget-friendly places for students': 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80',
  default: '/images/destinations/manek-chowk-food-night.jpg'
};

export function getFoodFallbackPhoto(city?: string, category?: string): string {
  if (category && CATEGORY_FALLBACK_PHOTOS[category]) {
    return CATEGORY_FALLBACK_PHOTOS[category];
  }
  if (city && CITY_DEFAULT_FOOD_PHOTOS[city]) {
    return CITY_DEFAULT_FOOD_PHOTOS[city];
  }
  return CITY_DEFAULT_FOOD_PHOTOS.default;
}
