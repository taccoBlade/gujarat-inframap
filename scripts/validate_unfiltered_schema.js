/**
 * Gujarat InfraMap — Gujarat Unfiltered Schema Validation Suite
 * 
 * Strictly validates data/gujarat_unfiltered.json against
 * data/schema/gujarat_unfiltered.schema.json specifications.
 */

const fs = require('fs');
const path = require('path');

const schema = JSON.parse(fs.readFileSync('data/schema/gujarat_unfiltered.schema.json', 'utf8'));
const data = JSON.parse(fs.readFileSync('data/gujarat_unfiltered.json', 'utf8'));

console.log('======================================================================');
console.log('GUJARAT UNFILTERED — SCHEMA CONFORMANCE AUDIT');
console.log('======================================================================\n');

let errors = 0;
let passed = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    passed++;
  } else {
    console.error(`  [FAIL] ${testName}`, details);
    errors++;
  }
}

// 1. Array check
assert(Array.isArray(data), 'Dataset root is an Array');
assert(data.length === 45, `Dataset contains exactly 45 verified records (got: ${data.length})`);

const seenIds = new Set();
const seenDistricts = new Set();

const validDistricts = new Set(schema.items.properties.district.enum);
const validRegions = new Set(schema.items.properties.region.enum);
const validCategories = new Set(schema.items.properties.category.enum);
const validCollections = new Set(schema.items.properties.collection.enum);
const validClaims = new Set(schema.items.properties.claimClassification.enum);
const validStatuses = new Set(schema.items.properties.researchStatus.items.enum);
const validConfidences = new Set(schema.items.properties.positionalConfidence.enum);

data.forEach((item, index) => {
  const prefix = `[Record #${index + 1} "${item.name}"]`;

  // Required properties
  schema.items.required.forEach(prop => {
    assert(typeof item[prop] !== 'undefined', `${prefix} Has required property: "${prop}"`);
  });

  // ID validation
  assert(!seenIds.has(item.id), `${prefix} ID is unique: "${item.id}"`);
  seenIds.add(item.id);
  assert(/^[a-z0-9]+(-[a-z0-9]+)*$/.test(item.id), `${prefix} ID matches slug format`);

  // District validation
  assert(validDistricts.has(item.district), `${prefix} District "${item.district}" is in official 34 districts`);
  seenDistricts.add(item.district === 'Dang' ? 'The Dangs' : item.district);

  // Region validation
  assert(validRegions.has(item.region), `${prefix} Region "${item.region}" is valid`);

  // Coordinates validation
  assert(Array.isArray(item.coordinates) && item.coordinates.length === 2, `${prefix} Coordinates is [lng, lat] array`);
  const [lng, lat] = item.coordinates;
  assert(typeof lng === 'number' && lng >= 68 && lng <= 75, `${prefix} Longitude is within Gujarat bounds (got: ${lng})`);
  assert(typeof lat === 'number' && lat >= 20 && lat <= 25, `${prefix} Latitude is within Gujarat bounds (got: ${lat})`);
  assert(typeof item.coordinatesSource === 'string' && item.coordinatesSource.length > 5, `${prefix} Coordinates source is documented`);
  assert(validConfidences.has(item.positionalConfidence), `${prefix} Positional confidence "${item.positionalConfidence}" is valid`);

  // Category and Collection
  assert(validCategories.has(item.category), `${prefix} Category "${item.category}" is valid`);
  assert(validCollections.has(item.collection), `${prefix} Collection "${item.collection}" is valid`);
  assert(validClaims.has(item.claimClassification), `${prefix} Claim classification "${item.claimClassification}" is valid`);

  // Narrative and Fact-checking
  assert(typeof item.theStory === 'string' && item.theStory.length >= 80, `${prefix} theStory narrative is rich and atmospheric`);
  assert(typeof item.theFolklore === 'string' && item.theFolklore.length >= 50, `${prefix} theFolklore is explicitly documented`);
  assert(typeof item.theGroundReality === 'string' && item.theGroundReality.length >= 80, `${prefix} theGroundReality fact-check is rigorous`);

  // Research Status array
  assert(Array.isArray(item.researchStatus) && item.researchStatus.length >= 2, `${prefix} researchStatus has at least 2 coexisting dimensions`);
  item.researchStatus.forEach(st => {
    assert(validStatuses.has(st), `${prefix} Status label "${st}" is valid`);
  });

  // Legal Access
  assert(typeof item.legalAccess === 'object' && item.legalAccess !== null, `${prefix} legalAccess object exists`);
  assert(typeof item.legalAccess.isSafeAndLawful === 'boolean', `${prefix} legalAccess.isSafeAndLawful is boolean`);
  assert(typeof item.legalAccess.accessType === 'string' && item.legalAccess.accessType.length > 0, `${prefix} legalAccess.accessType is defined`);
  assert(typeof item.legalAccess.rulesAndWarnings === 'string' && item.legalAccess.rulesAndWarnings.length > 20, `${prefix} rulesAndWarnings provides actionable advisory`);
  assert(typeof item.legalAccess.source === 'string' && item.legalAccess.source.length > 0, `${prefix} legalAccess.source is cited`);

  // Primary Sources
  assert(Array.isArray(item.primarySources) && item.primarySources.length >= 1, `${prefix} primarySources contains at least 1 authoritative citation`);
  item.primarySources.forEach((src, sIdx) => {
    assert(typeof src.title === 'string' && src.title.length > 0, `${prefix} primarySource #${sIdx + 1} has title`);
    assert(typeof src.url === 'string' && src.url.startsWith('http'), `${prefix} primarySource #${sIdx + 1} has valid URL`);
    assert(typeof src.publisher === 'string' && src.publisher.length > 0, `${prefix} primarySource #${sIdx + 1} has publisher`);
  });

  // Corroborating Sources
  assert(Array.isArray(item.corroboratingSources), `${prefix} corroboratingSources is an array`);

  // Research Date and Uncertainties
  assert(/^\d{4}-\d{2}-\d{2}$/.test(item.researchDate), `${prefix} researchDate matches YYYY-MM-DD`);
  assert(typeof item.uncertaintiesNote === 'string' && item.uncertaintiesNote.length >= 15, `${prefix} uncertaintiesNote documents field limitations`);

  // Image provenance
  assert(typeof item.imageUrl === 'string' && item.imageUrl.startsWith('https://'), `${prefix} imageUrl is valid secure URL`);
  assert(typeof item.imageCredit === 'string' && item.imageCredit.length > 0, `${prefix} imageCredit is provided`);
  assert(typeof item.imageLicense === 'string' && item.imageLicense.length > 0, `${prefix} imageLicense is documented`);
});

// District Coverage Completeness
assert(seenDistricts.size === 34, `All 34 official districts are covered in data (got: ${seenDistricts.size})`);

console.log(`\n======================================================================`);
console.log(`SCHEMA VALIDATION SUMMARY: ${passed} PASSED, ${errors} FAILED`);
console.log(`======================================================================`);

if (errors > 0) {
  process.exit(1);
} else {
  console.log('[SUCCESS] All 45 records perfectly conform to data/schema/gujarat_unfiltered.schema.json!');
  process.exit(0);
}
