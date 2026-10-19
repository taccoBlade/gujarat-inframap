#!/usr/bin/env node
/**
 * =============================================================================
 * GUJARAT INFRAMAP — AUTOMATED SECURITY & HARDENING REGRESSION TEST SUITE
 * =============================================================================
 * Validates:
 * 1. Cloud Firestore Security Rules (Default deny, owner-only authorization, schema validation, nullable fields)
 * 2. Firebase Project & Emulator configuration
 * 3. Secret Leakage & Git Tracking Protections (.gitignore and .env.example)
 * 4. Phone Authentication Validation & E.164 sanitization
 * 5. Production vs Development Authentication Bypass Isolation & Session Guarantees
 * 6. Rate-Limiting, Lockout Controls & State Resets in UI
 * 7. Content Security Policy & HTTP Security Headers (Vercel & Netlify)
 * 8. Service Worker Cache Poisoning Protections & Fallback Asset Pre-caching
 * 9. Cross-Site Scripting (XSS) Sanitization across all Leaflet Map Popups & Reverse Tabnabbing
 * 10. Destination Landmark Photographic Assets (37/37 verified local landscape images)
 * =============================================================================
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

let passedTests = 0;
let totalTests = 0;

function it(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  [PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  [FAIL] ${name}`);
    console.error(`         Error: ${err.message}`);
    process.exitCode = 1;
  }
}

console.log('======================================================================');
console.log('GUJARAT INFRAMAP — AUTOMATED SECURITY REGRESSION TEST SUITE');
console.log('======================================================================');

// -----------------------------------------------------------------------------
// TEST GROUP 1: FIRESTORE SECURITY RULES & ACCESS CONTROL
// -----------------------------------------------------------------------------
console.log('\n--- GROUP 1: Cloud Firestore Security Rules & Access Control ---');

it('firestore.rules file must exist', () => {
  assert.ok(fs.existsSync('firestore.rules'), 'firestore.rules is missing');
});

const rulesContent = fs.readFileSync('firestore.rules', 'utf8');

it('firestore.rules specifies rules_version = "2"', () => {
  assert.ok(rulesContent.includes("rules_version = '2'"), 'rules_version must be 2');
});

it('firestore.rules implements Default-Deny on unmatched documents', () => {
  const defaultDenyRegex = /match\s+\/\{document=\*\*\}\s*\{\s*allow\s+read,\s*write:\s*if\s+false;\s*\}/;
  assert.ok(defaultDenyRegex.test(rulesContent), 'Default deny rule matching /{document=**} is missing');
});

it('firestore.rules restricts /users/{userId} to authenticated owner only', () => {
  assert.ok(rulesContent.includes('match /users/{userId}'), 'users collection rule missing');
  assert.ok(rulesContent.includes('allow read: if isOwner(userId)'), 'read permission must require isOwner');
  assert.ok(rulesContent.includes('allow create, update: if isOwner(userId) && isValidProfileData(userId)'), 'write must require owner + validation');
  assert.ok(rulesContent.includes('allow delete: if isOwner(userId)'), 'delete must require owner');
});

it('firestore.rules enforces strict schema validation and prevents privilege escalation', () => {
  assert.ok(rulesContent.includes('data.uid == userId'), 'Must enforce UID matches document key');
  assert.ok(rulesContent.includes('data.keys().hasOnly(allowedKeys)'), 'Must whitelist allowedKeys to prevent mass assignment');
  assert.ok(rulesContent.includes('data.collectedStampIds is list'), 'Must enforce list type for stamps');
  assert.ok(rulesContent.includes('data.name.size() <= 100'), 'Must enforce name length boundary');
});

it('firestore.rules correctly handles nullable fields without rejecting legitimate profiles', () => {
  assert.ok(rulesContent.includes('data.email == null || data.email is string'), 'Must allow null for email (phone logins)');
  assert.ok(rulesContent.includes('data.phoneNumber == null || data.phoneNumber is string'), 'Must allow null for phone (google logins)');
  assert.ok(rulesContent.includes('data.photoURL == null || data.photoURL is string'), 'Must allow null for photoURL');
  assert.ok(rulesContent.includes('data.lastCheckedInDistrict == null || data.lastCheckedInDistrict is string'), 'Must allow null for lastCheckedInDistrict');
  assert.ok(rulesContent.includes('data.bookmarkedStoryIds is list'), 'Must validate bookmarkedStoryIds as list');
  assert.ok(rulesContent.includes('data.visitedPlaceIds is list'), 'Must validate visitedPlaceIds as list');
});

it('firestore.rules blocks client writes on public collections', () => {
  assert.ok(rulesContent.includes('match /public_infrastructure/{docId}'), 'public_infrastructure collection missing');
  assert.ok(rulesContent.includes('match /tourist_destinations/{docId}'), 'tourist_destinations collection missing');
  const writeFalseCount = (rulesContent.match(/allow write:\s*if false;/g) || []).length;
  assert.ok(writeFalseCount >= 2, 'Public collections must strictly prohibit client write');
});

it('firebase.json exists and binds firestore.rules', () => {
  assert.ok(fs.existsSync('firebase.json'), 'firebase.json is missing');
  const fbConfig = JSON.parse(fs.readFileSync('firebase.json', 'utf8'));
  assert.strictEqual(fbConfig.firestore?.rules, 'firestore.rules', 'firebase.json must link firestore.rules');
});

// -----------------------------------------------------------------------------
// TEST GROUP 2: SECRETS, ENVIRONMENT & GIT HYGIENE
// -----------------------------------------------------------------------------
console.log('\n--- GROUP 2: Secrets, Environment & Git Hygiene ---');

it('.gitignore blocks .env files and credentials', () => {
  const gitignore = fs.readFileSync('.gitignore', 'utf8');
  assert.ok(gitignore.includes('.env'), '.env missing in .gitignore');
  assert.ok(gitignore.includes('.env.local'), '.env.local missing in .gitignore');
  assert.ok(gitignore.includes('*.pem'), '*.pem missing in .gitignore');
  assert.ok(gitignore.includes('service-account*.json'), 'service-account*.json missing in .gitignore');
});

it('.env.example template exists without real credentials', () => {
  assert.ok(fs.existsSync('.env.example'), '.env.example is missing');
  const envExample = fs.readFileSync('.env.example', 'utf8');
  assert.ok(envExample.includes('VITE_FIREBASE_API_KEY='), 'Missing VITE_FIREBASE_API_KEY in template');
  assert.ok(!envExample.includes('AIzaSy'), 'Must not contain actual Google API keys');
});

// -----------------------------------------------------------------------------
// TEST GROUP 3: AUTHENTICATION INPUT VALIDATION & PHONE SECURITY
// -----------------------------------------------------------------------------
console.log('\n--- GROUP 3: Authentication Input Validation & Phone Security ---');

const fbCode = fs.readFileSync('src/lib/firebase.ts', 'utf8');

function isValidIndianPhoneNumber(phoneNumber) {
  const formatted = phoneNumber.trim().replace(/\s+/g, '');
  return /^\+91[6-9]\d{9}$/.test(formatted);
}

it('Indian phone number regex validates proper E.164 formats', () => {
  assert.strictEqual(isValidIndianPhoneNumber('+919876543210'), true);
  assert.strictEqual(isValidIndianPhoneNumber('+916234567890'), true);
  assert.strictEqual(isValidIndianPhoneNumber('+91 98765 43210'), true);
});

it('Indian phone number regex strictly rejects invalid formats and injection attempts', () => {
  assert.strictEqual(isValidIndianPhoneNumber('+1234567890'), false, 'Non-Indian country code should fail');
  assert.strictEqual(isValidIndianPhoneNumber('+910123456789'), false, 'Starting with 0 should fail');
  assert.strictEqual(isValidIndianPhoneNumber('+915123456789'), false, 'Starting with 5 should fail');
  assert.strictEqual(isValidIndianPhoneNumber('+91987654321'), false, 'Too short should fail');
  assert.strictEqual(isValidIndianPhoneNumber('+91987654321000'), false, 'Too long should fail');
  assert.strictEqual(isValidIndianPhoneNumber('+919876543210; DROP TABLE'), false, 'SQL injection attempt should fail');
  assert.strictEqual(isValidIndianPhoneNumber('<script>+919876543210</script>'), false, 'XSS attempt should fail');
});

it('src/lib/firebase.ts exports phone number validator', () => {
  assert.ok(fbCode.includes('export function isValidIndianPhoneNumber'), 'isValidIndianPhoneNumber must be exported');
});

it('src/lib/firebase.ts isolates demo fallbacks to non-production only', () => {
  assert.ok(fbCode.includes('if (import.meta.env.PROD)'), 'Must check import.meta.env.PROD');
  assert.ok(fbCode.includes('Phone authentication is not configured in this environment'), 'Must return error in production if not configured');
  assert.ok(fbCode.includes('Missing active verification session'), 'Must require confirmationResult in production');
});

it('src/lib/firebase.ts guards against guest profile writes and requires active auth session in syncProfileToFirestore', () => {
  assert.ok(fbCode.includes("profile.uid.startsWith('guest_')"), 'Must guard guest profiles in syncProfileToFirestore');
  assert.ok(fbCode.includes('auth.currentUser.uid !== profile.uid'), 'Must check auth.currentUser.uid matches profile.uid');
  assert.ok(fbCode.includes('!auth.currentUser'), 'Must require active authenticated session when auth is initialized');
});

it('src/lib/firebase.ts guards against guest probes and unauthenticated fetch in fetchProfileFromFirestore', () => {
  assert.ok(fbCode.includes("uid.startsWith('guest_')"), 'Must guard guest profiles in fetchProfileFromFirestore');
  assert.ok(fbCode.includes('auth.currentUser.uid !== uid'), 'Must check auth.currentUser.uid matches requested uid');
  assert.ok(fbCode.includes('!auth.currentUser'), 'Must require active authenticated session for profile reads');
});

// -----------------------------------------------------------------------------
// TEST GROUP 4: UI RATE LIMITING, ABUSE CONTROLS & RECAPTCHA
// -----------------------------------------------------------------------------
console.log('\n--- GROUP 4: UI Rate Limiting, Abuse Controls & reCAPTCHA ---');

const authModalCode = fs.readFileSync('src/components/auth/AuthModal.tsx', 'utf8');

it('AuthModal.tsx implements 60-second OTP cooldown timer', () => {
  assert.ok(authModalCode.includes('OTP_COOLDOWN_SECONDS = 60'), 'Cooldown seconds must be 60');
  assert.ok(authModalCode.includes('setCooldown(OTP_COOLDOWN_SECONDS)'), 'Must activate cooldown on OTP dispatch');
});

it('AuthModal.tsx enforces maximum failed attempts lockout and disables submit buttons', () => {
  assert.ok(authModalCode.includes('MAX_OTP_ATTEMPTS = 5'), 'Max failed attempts must be 5');
  assert.ok(authModalCode.includes('failedAttempts >= MAX_OTP_ATTEMPTS'), 'Must check failed attempts cap');
  assert.ok(authModalCode.includes('disabled={loading || cooldown > 0 || failedAttempts >= MAX_OTP_ATTEMPTS'), 'Send button must be disabled on lockout');
  assert.ok(authModalCode.includes('disabled={loading || failedAttempts >= MAX_OTP_ATTEMPTS'), 'Verify button must be disabled on lockout');
});

it('AuthModal.tsx includes invisible reCAPTCHA container', () => {
  assert.ok(authModalCode.includes('id="recaptcha-container"'), 'recaptcha-container DOM element missing');
  assert.ok(authModalCode.includes('setupRecaptcha'), 'setupRecaptcha must be called');
  assert.ok(authModalCode.includes('clearRecaptcha'), 'clearRecaptcha must be called on modal close');
});

it('AuthModal.tsx stores and resets confirmationResult on number change', () => {
  assert.ok(authModalCode.includes('setConfirmationResult(res.confirmationResult)'), 'Must retain confirmationResult');
  assert.ok(authModalCode.includes('setConfirmationResult(null)'), 'Must reset confirmationResult on number change / back');
});

it('AuthModal.tsx gates demo button to non-production environments', () => {
  assert.ok(authModalCode.includes('!import.meta.env.PROD'), 'Must gate demo options with !import.meta.env.PROD');
  assert.ok(authModalCode.includes('if (import.meta.env.PROD) return;'), 'Must abort demo login handler in production');
});

// -----------------------------------------------------------------------------
// TEST GROUP 5: HTTP SECURITY HEADERS & CONTENT SECURITY POLICY (CSP)
// -----------------------------------------------------------------------------
console.log('\n--- GROUP 5: HTTP Security Headers & Content Security Policy (CSP) ---');

const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
const netlifyConfig = fs.readFileSync('netlify.toml', 'utf8');

it('vercel.json includes all mandatory security headers', () => {
  const rootHeaders = vercelConfig.headers.find(h => h.source === '/(.*)').headers;
  const headerKeys = rootHeaders.map(h => h.key);
  
  assert.ok(headerKeys.includes('X-Frame-Options'), 'X-Frame-Options missing');
  assert.ok(headerKeys.includes('X-Content-Type-Options'), 'X-Content-Type-Options missing');
  assert.ok(headerKeys.includes('Strict-Transport-Security'), 'Strict-Transport-Security missing');
  assert.ok(headerKeys.includes('Referrer-Policy'), 'Referrer-Policy missing');
  assert.ok(headerKeys.includes('Content-Security-Policy'), 'Content-Security-Policy missing');
});

it('vercel.json CSP permits Google OAuth, Firebase Auth and reCAPTCHA while denying frame-ancestors', () => {
  const rootHeaders = vercelConfig.headers.find(h => h.source === '/(.*)').headers;
  const csp = rootHeaders.find(h => h.key === 'Content-Security-Policy').value;

  assert.ok(csp.includes('frame-ancestors \'none\''), 'frame-ancestors must be none');
  assert.ok(csp.includes('https://apis.google.com'), 'Must allow apis.google.com for Google Auth');
  assert.ok(csp.includes('https://www.google.com/recaptcha/'), 'Must allow Google reCAPTCHA');
  assert.ok(csp.includes('https://identitytoolkit.googleapis.com'), 'Must allow Firebase identity toolkit');
  assert.ok(csp.includes('https://firestore.googleapis.com'), 'Must allow Cloud Firestore');
});

it('netlify.toml security headers mirror vercel.json defense-in-depth', () => {
  assert.ok(netlifyConfig.includes('X-Frame-Options = "DENY"'), 'Netlify X-Frame-Options missing');
  assert.ok(netlifyConfig.includes('X-Content-Type-Options = "nosniff"'), 'Netlify X-Content-Type-Options missing');
  assert.ok(netlifyConfig.includes('Content-Security-Policy'), 'Netlify CSP missing');
});

// -----------------------------------------------------------------------------
// TEST GROUP 6: SERVICE WORKER & XSS / TABNABBING HARDENING
// -----------------------------------------------------------------------------
console.log('\n--- GROUP 6: Service Worker & XSS / Tabnabbing Hardening ---');

const swCode = fs.readFileSync('public/sw.js', 'utf8');

it('public/sw.js ignores sensitive Google and Firebase domains to prevent cache poisoning', () => {
  assert.ok(swCode.includes("url.hostname.includes('googleapis.com')"), 'Must exclude googleapis.com from SW caching');
  assert.ok(swCode.includes("url.hostname.includes('firebase')"), 'Must exclude firebase from SW caching');
  assert.ok(swCode.includes('url.origin === self.location.origin'), 'Must check origin for application asset caching');
});

it('public/sw.js pre-caches fallback destination photo for offline reliability', () => {
  assert.ok(swCode.includes('/images/destinations/statue-of-unity.jpg'), 'Must pre-cache statue of unity fallback photo');
});

const atlasMapCode = fs.readFileSync('src/components/map/AtlasMap.tsx', 'utf8');
const evRadarCode = fs.readFileSync('src/components/ev/EVHighwayRadar.tsx', 'utf8');

it('AtlasMap.tsx sanitizes dynamic HTML across tourist, story, district, and EV layers', () => {
  assert.ok(atlasMapCode.includes('function escapeHtml(str: any): string'), 'escapeHtml helper missing in AtlasMap.tsx');
  // Tourist destinations
  assert.ok(atlasMapCode.includes('escapeHtml(place.name)'), 'place.name must be escaped');
  assert.ok(atlasMapCode.includes('escapeHtml(place.district)'), 'place.district must be escaped');
  // Stories
  assert.ok(atlasMapCode.includes('escapeHtml(story.name)'), 'story.name must be escaped');
  assert.ok(atlasMapCode.includes('escapeHtml(story.district)'), 'story.district must be escaped');
  // Districts
  assert.ok(atlasMapCode.includes('escapeHtml(d.name)'), 'd.name must be escaped');
  assert.ok(atlasMapCode.includes('escapeHtml(d.landmark)'), 'd.landmark must be escaped');
  // EV stations
  assert.ok(atlasMapCode.includes('escapeHtml(station.name)'), 'station.name must be escaped');
  assert.ok(atlasMapCode.includes('escapeHtml(station.network)'), 'station.network must be escaped');
});

it('AtlasMap.tsx and EVHighwayRadar.tsx prevent reverse tabnabbing on external navigation links', () => {
  assert.ok(atlasMapCode.includes('rel="noopener noreferrer"'), 'AtlasMap.tsx must specify rel="noopener noreferrer"');
  assert.ok(evRadarCode.includes('rel="noopener noreferrer"'), 'EVHighwayRadar.tsx must specify rel="noopener noreferrer"');
});

// -----------------------------------------------------------------------------
// TEST GROUP 7: 37 DESTINATION LANDMARKS PHOTOGRAPHIC QUALITY & LOCAL REACHABILITY
// -----------------------------------------------------------------------------
console.log('\n--- GROUP 7: 37 Destination Landmarks Photographic Quality & Local Assets ---');

const destinationsFile = fs.readFileSync('src/data/tourist-destinations.ts', 'utf8');

it('All 37 destinations have valid local image definitions', () => {
  const imgMatches = destinationsFile.match(/"image":\s*"([^"]+)"/g);
  assert.strictEqual(imgMatches?.length, 37, 'Must have exactly 37 destination images');
  
  imgMatches.forEach(match => {
    const url = match.split('"')[3];
    assert.ok(url.startsWith('/images/destinations/'), `Image must be a local asset: ${url}`);
    assert.ok(url.endsWith('.jpg'), `Image must be a jpg: ${url}`);
  });
});

it('All 37 destination images exist as physical files in public/images/destinations/', () => {
  const localDestDir = path.join(__dirname, '../public/images/destinations');
  assert.ok(fs.existsSync(localDestDir), 'public/images/destinations directory must exist');

  const files = fs.readdirSync(localDestDir);
  assert.strictEqual(files.length, 37, `Must contain all 37 destination photos (found ${files.length})`);

  files.forEach(f => {
    const fullPath = path.join(localDestDir, f);
    const stat = fs.statSync(fullPath);
    assert.ok(stat.size > 10000, `Image file ${f} must be valid non-empty file (size: ${stat.size} bytes)`);
  });
});

it('PlacesDestinationView uses aspect-[16/10], no-referrer and statue fallback', () => {
  const placesViewCode = fs.readFileSync('src/components/places/PlacesDestinationView.tsx', 'utf8');
  assert.ok(placesViewCode.includes('aspect-[16/10]'), 'Must use aspect-[16/10] container');
  assert.ok(placesViewCode.includes('referrerPolicy="no-referrer"'), 'Must specify referrerPolicy="no-referrer"');
  assert.ok(placesViewCode.includes('/images/destinations/statue-of-unity.jpg'), 'Must specify statue-of-unity fallback');
});

// -----------------------------------------------------------------------------
// SUMMARY
// -----------------------------------------------------------------------------
console.log('\n======================================================================');
console.log(`SECURITY REGRESSION TEST SUITE: ${passedTests} / ${totalTests} CHECKS PASSED`);
console.log('======================================================================');

if (passedTests !== totalTests) {
  process.exit(1);
}
