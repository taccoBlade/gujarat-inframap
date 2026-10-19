// ==============================================================================
// GUJARAT SUB-REGIONAL CULTURAL TAXONOMY & AUTHENTIC FOLK MOTIFS
// Tailored patterns for Kutch/Bhuj, Saurashtra, Gir/Junagadh, North, Dang/South
// ==============================================================================

export interface RegionalCulture {
  regionKey: 'kutch' | 'saurashtra' | 'gir' | 'north' | 'central' | 'south';
  regionName: string;
  gujaratiTitle: string;
  craftHeritage: string;
  patternClass: string;
  accentColor: string;
  badgeBg: string;
  badgeBorder: string;
  textColor: string;
  primaryIcon: string;
  borderTrimStyle: string;
  culturalTag: string;
  patternSvgDataUri?: string;
}

export function getRegionalCulture(regionOrDistrict: string = ''): RegionalCulture {
  const norm = regionOrDistrict.toLowerCase().trim();

  // 1. Kutch & Bhuj (કચ્છ & ભુજ)
  if (norm.includes('kutch') || norm.includes('kachchh') || norm.includes('bhuj') || norm.includes('dholavira') || norm.includes('rann') || norm.includes('mandvi')) {
    return {
      regionKey: 'kutch',
      regionName: 'Kachchh & Bhuj',
      gujaratiTitle: 'કચ્છી અજરખ & લિપ્પણ કળા',
      craftHeritage: 'Ajrakh Star Block-Print & Lippan Kaam Mirrors',
      patternClass: 'pattern-kutch-ajrakh',
      accentColor: '#991B1B', // Deep Madder Red & Indigo
      badgeBg: 'bg-red-950/60',
      badgeBorder: 'border-red-600/50',
      textColor: 'text-red-300',
      primaryIcon: '🪞',
      borderTrimStyle: 'linear-gradient(90deg, #8B0000 0%, #1E3A8A 50%, #C49A45 100%)',
      culturalTag: '🎨 Kutch Craft: Ajrakh Hand-Block & Abhla Mud Mirrors'
    };
  }

  // 2. Gir & Junagadh (ગીર & જૂનાગઢ)
  if (norm.includes('gir') || norm.includes('junagadh') || norm.includes('amreli') || norm.includes('sasan') || norm.includes('girnar')) {
    return {
      regionKey: 'gir',
      regionName: 'Gir & Junagadh',
      gujaratiTitle: 'ગીર સાવજ & ગિરનાર વન્યશ્રી',
      craftHeritage: 'Asiatic Lion Reserve & Teak Forest Silhouettes',
      patternClass: 'pattern-gir-lion',
      accentColor: '#52664B', // Neem & Gir Teak Green
      badgeBg: 'bg-emerald-950/60',
      badgeBorder: 'border-emerald-600/50',
      textColor: 'text-emerald-300',
      primaryIcon: '🦁',
      borderTrimStyle: 'linear-gradient(90deg, #2D4A22 0%, #D97706 50%, #78350F 100%)',
      culturalTag: '🦁 Gir Ecology: Asiatic Lion Bastion & Teak Canopy'
    };
  }

  // 3. Saurashtra / Kathiawad (સૌરાષ્ટ્ર / કાઠિયાવાડ)
  if (norm.includes('saurashtra') || norm.includes('rajkot') || norm.includes('jamnagar') || norm.includes('dwarka') || norm.includes('porbandar') || norm.includes('bhavnagar') || norm.includes('surendranagar') || norm.includes('morbi') || norm.includes('botad')) {
    return {
      regionKey: 'saurashtra',
      regionName: 'Saurashtra & Kathiawad',
      gujaratiTitle: 'સૌરાષ્ટ્ર બાંધણી & સોલંકી વાવ',
      craftHeritage: 'Jamnagar Bandhani Tie-Dye & Solanki Stepwells',
      patternClass: 'pattern-saurashtra-bandhani',
      accentColor: '#D97706', // Turmeric & Saffron Gold
      badgeBg: 'bg-amber-950/60',
      badgeBorder: 'border-amber-600/50',
      textColor: 'text-amber-300',
      primaryIcon: '🛕',
      borderTrimStyle: 'linear-gradient(90deg, #B45309 0%, #DC2626 50%, #F59E0B 100%)',
      culturalTag: '🧵 Saurashtra Craft: Jamnagar Bandhani & Solanki Stepwells'
    };
  }

  // 4. North Gujarat / Patan & Modhera (પાટણ / મોઢેરા)
  if (norm.includes('north') || norm.includes('patan') || norm.includes('mehsana') || norm.includes('modhera') || norm.includes('banaskantha') || norm.includes('sabarkantha') || norm.includes('aravalli') || norm.includes('gandhinagar')) {
    return {
      regionKey: 'north',
      regionName: 'North Gujarat & Patan',
      gujaratiTitle: 'પાટણ પટોળા & સૂર્ય મંદિર',
      craftHeritage: 'UNESCO Double-Ikat Patola & Modhera Sun Mandala',
      patternClass: 'pattern-patola-ikkat',
      accentColor: '#A64036', // Patola Madder Red
      badgeBg: 'bg-rose-950/60',
      badgeBorder: 'border-rose-600/50',
      textColor: 'text-rose-300',
      borderTrimStyle: 'linear-gradient(90deg, #991B1B 0%, #C49A45 50%, #7C2D12 100%)',
      primaryIcon: '🪡',
      culturalTag: '🪡 North Gujarat: UNESCO Patan Patola Double-Ikat'
    };
  }

  // 5. South Gujarat & Dang (ડાંગ & દક્ષિણ ગુજરાત)
  if (norm.includes('dang') || norm.includes('valsad') || norm.includes('navsari') || norm.includes('surat') || norm.includes('tapi') || norm.includes('saputara') || norm.includes('south')) {
    return {
      regionKey: 'south',
      regionName: 'Dang & South Gujarat',
      gujaratiTitle: 'ડાંગ વારલી કળા & સાપુતારા ગિરિમાળા',
      craftHeritage: 'Warli Tribal Circle Dance & Bamboo Monsoon Weave',
      patternClass: 'pattern-dang-warli',
      accentColor: '#15803D', // Monsoon Forest Green
      badgeBg: 'bg-lime-950/60',
      badgeBorder: 'border-lime-600/50',
      textColor: 'text-lime-300',
      primaryIcon: '🌾',
      borderTrimStyle: 'linear-gradient(90deg, #3F6212 0%, #9A3412 50%, #15803D 100%)',
      culturalTag: '🌾 Dang Culture: Warli Tribal Folk Art & Teak Highlands'
    };
  }

  // 6. Central Gujarat (મધ્ય ગુજરાત / Narmada / Vadodara / Ahmedabad)
  return {
    regionKey: 'central',
    regionName: 'Central Gujarat & Narmada',
    gujaratiTitle: 'નર્મદા તપોભૂમિ & સરદાર સ્મારક',
    craftHeritage: 'Sankheda Lacquered Timber & Champaner Citadels',
    patternClass: 'pattern-solanki-stepwell',
    accentColor: '#B45309', // Warm Sandstone & Madder
    badgeBg: 'bg-amber-950/60',
    badgeBorder: 'border-amber-600/50',
    textColor: 'text-amber-300',
    primaryIcon: '🏛️',
    borderTrimStyle: 'linear-gradient(90deg, #9A3412 0%, #D97706 50%, #243B53 100%)',
    culturalTag: '🏛️ Central Gujarat: Narmada River Heritage & World Citadels'
  };
}
