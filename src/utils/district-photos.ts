/**
 * GUJARAT INFRAMAP — DISTRICT PHOTOGRAPHIC ASSET REGISTRY
 * Maps all 34 administrative districts and cultural regions to verified local landscape photos
 * stored in public/images/destinations/.
 */

const DISTRICT_PHOTO_MAP: Record<string, string[]> = {
  'Ahmedabad': [
    '/images/destinations/sabarmati-ashram.jpg',
    '/images/destinations/sarkhej-roza.jpg',
    '/images/destinations/dada-harir-stepwell.jpg',
    '/images/destinations/lothal-archaeological-site.jpg',
    '/images/destinations/manek-chowk-food-night.jpg',
    '/images/destinations/nalsarovar-bird-sanctuary.jpg'
  ],
  'Amreli': [
    '/images/destinations/gir-national-park.jpg'
  ],
  'Anand': [
    '/images/destinations/galteshwar-temple.jpg'
  ],
  'Aravalli': [
    '/images/destinations/polo-forest-ruins.jpg'
  ],
  'Banaskantha': [
    '/images/destinations/ambaji-temple.jpg'
  ],
  'Bharuch': [
    '/images/destinations/galteshwar-temple.jpg'
  ],
  'Bhavnagar': [
    '/images/destinations/palitana-shatrunjaya.jpg',
    '/images/destinations/velavadar-blackbuck-np.jpg'
  ],
  'Botad': [
    '/images/destinations/velavadar-blackbuck-np.jpg'
  ],
  'Chhota Udaipur': [
    '/images/destinations/champaner-pavagadh.jpg'
  ],
  'Dahod': [
    '/images/destinations/champaner-pavagadh.jpg'
  ],
  'Dang': [
    '/images/destinations/saputara-hill-station.jpg',
    '/images/destinations/gira-waterfalls.jpg'
  ],
  'The Dangs': [
    '/images/destinations/saputara-hill-station.jpg',
    '/images/destinations/gira-waterfalls.jpg'
  ],
  'Devbhumi Dwarka': [
    '/images/destinations/dwarkadhish-temple.jpg',
    '/images/destinations/shivrajpur-beach.jpg'
  ],
  'Gandhinagar': [
    '/images/destinations/akshardham-gandhinagar.jpg'
  ],
  'Gir Somnath': [
    '/images/destinations/somnath-temple.jpg'
  ],
  'Jamnagar': [
    '/images/destinations/marine-national-park-narara.jpg'
  ],
  'Junagadh': [
    '/images/destinations/uparkot-fort-junagadh.jpg',
    '/images/destinations/gir-national-park.jpg'
  ],
  'Kachchh': [
    '/images/destinations/white-rann-dhordo.jpg',
    '/images/destinations/dholavira-harappan-city.jpg',
    '/images/destinations/mandvi-beach-palace.jpg',
    '/images/destinations/aina-mahal-bhuj.jpg',
    '/images/destinations/bhujodi-ajrakhpur-crafts.jpg',
    '/images/destinations/lakhpat-fort-town.jpg'
  ],
  'Kutch': [
    '/images/destinations/white-rann-dhordo.jpg',
    '/images/destinations/dholavira-harappan-city.jpg',
    '/images/destinations/mandvi-beach-palace.jpg',
    '/images/destinations/aina-mahal-bhuj.jpg',
    '/images/destinations/bhujodi-ajrakhpur-crafts.jpg',
    '/images/destinations/lakhpat-fort-town.jpg'
  ],
  'Kheda': [
    '/images/destinations/galteshwar-temple.jpg'
  ],
  'Mahisagar': [
    '/images/destinations/galteshwar-temple.jpg'
  ],
  'Mehsana': [
    '/images/destinations/sun-temple-modhera.jpg'
  ],
  'Morbi': [
    '/images/destinations/wild-ass-sanctuary.jpg'
  ],
  'Narmada': [
    '/images/destinations/statue-of-unity.jpg'
  ],
  'Navsari': [
    '/images/destinations/udvada-atash-behram.jpg'
  ],
  'Panchmahal': [
    '/images/destinations/champaner-pavagadh.jpg'
  ],
  'Patan': [
    '/images/destinations/rani-ki-vav.jpg',
    '/images/destinations/patan-patola-museum.jpg'
  ],
  'Porbandar': [
    '/images/destinations/madhavpur-ghed-beach.jpg'
  ],
  'Rajkot': [
    '/images/destinations/khambhalida-caves.jpg'
  ],
  'Sabarkantha': [
    '/images/destinations/polo-forest-ruins.jpg'
  ],
  'Surat': [
    '/images/destinations/udvada-atash-behram.jpg',
    '/images/destinations/tithal-beach.jpg'
  ],
  'Surendranagar': [
    '/images/destinations/wild-ass-sanctuary.jpg'
  ],
  'Tapi': [
    '/images/destinations/gira-waterfalls.jpg'
  ],
  'Vadodara': [
    '/images/destinations/laxmi-vilas-palace.jpg'
  ],
  'Valsad': [
    '/images/destinations/tithal-beach.jpg',
    '/images/destinations/udvada-atash-behram.jpg'
  ]
};

/**
 * Returns a crisp, verified photo for a given district.
 * If multiple photos exist for the district, uses optional seed to pick deterministically.
 */
export function getDistrictPhoto(district: string, seed?: string | number): string {
  if (!district) return '/images/destinations/statue-of-unity.jpg';

  // Normalize name
  const cleanName = district.trim();
  const photos = DISTRICT_PHOTO_MAP[cleanName] || 
    DISTRICT_PHOTO_MAP[Object.keys(DISTRICT_PHOTO_MAP).find(k => k.toLowerCase() === cleanName.toLowerCase()) || ''];

  if (photos && photos.length > 0) {
    if (!seed) return photos[0];
    let num = 0;
    if (typeof seed === 'number') {
      num = seed;
    } else {
      for (let i = 0; i < seed.length; i++) {
        num = (num * 31 + seed.charCodeAt(i)) >>> 0;
      }
    }
    return photos[num % photos.length];
  }

  return '/images/destinations/statue-of-unity.jpg';
}
