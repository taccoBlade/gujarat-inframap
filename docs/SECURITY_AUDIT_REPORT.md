# MASTER DEFENSIVE SECURITY AUDIT & REMEDIATION REPORT
## Gujarat InfraMap / Gujarat Atlas Spatial Discovery Platform

**Assessment Date:** October 2026  
**Target Application:** https://gujarat-inframap.vercel.app/  
**Repository Branch:** `security/audit-and-remediation`  
**Assessment Type:** White-box Defensive Penetration Test, Cloud Architecture Security Audit & Code-Level Remediation  
**Status:** Remediated & Verified (100% Automated Regression Tests Passing)

---

## 1. Executive Summary

Gujarat InfraMap is a high-performance spatial discovery and cultural digital twin platform for Gujarat, featuring an interactive Leaflet geospatial engine, 34-district digital passport system, and 37 curated tourist destinations. Authentication and persistence are powered by Firebase Authentication (Google Identity Services + Phone OTP) and Google Cloud Firestore.

This defensive security audit identified **8 confirmed vulnerabilities** ranging from **Critical** to **Low** severity:
1. **Critical:** Complete absence of production Firestore Security Rules (`firestore.rules`), which would leave the database open to unrestricted cross-tenant read/write/delete attacks and privilege escalation.
2. **High:** Hardcoded demo OTP verification codes and unverified mock login bypasses accessible in production without cryptographic token confirmation.
3. **Medium:** Absence of rate limiting, resend cooldowns, and request caps on phone authentication, creating serious SMS bombing and billing exhaustion risks.
4. **Medium:** Missing DOM reCAPTCHA container and improper invisible app-verification lifecycle, causing silent failures on genuine Firebase Phone Auth flows.
5. **Medium:** Overly restrictive and mismatched Content Security Policy (CSP) in `vercel.json` and `netlify.toml` that would block Google Identity popups, reCAPTCHA iframes, Firestore REST/WebSocket streams, and verified CDN landmark photos.
6. **Low:** Incomplete `.gitignore` configuration allowing `.env` and credential files to be tracked, paired with missing configuration templates.
7. **Low:** Potential DOM-based XSS injection vector through unescaped dynamic properties inside Leaflet popup templates.
8. **Low:** PWA Service Worker caching policy risking cache poisoning by failing to exclude third-party authentication and API endpoints.

All code-level vulnerabilities have been remediated in the codebase, locked behind strict production gates, hardened with defensive sanitation, and backed by a 27-check automated regression test suite (`npm run test:security`).

---

## 2. Complete Security Inventory

| Component | Architecture / Provider | Trust Boundary | Enforcement Mechanism |
| :--- | :--- | :--- | :--- |
| **Google Sign-In** | Firebase Auth / Google Identity Services | Browser Client & Google OAuth 2.0 Provider | OAuth Popup flow (`GoogleAuthProvider`), select_account prompt |
| **Phone / WhatsApp OTP** | Firebase Phone Auth (SMS) | Browser Client & Firebase Auth API | Invisible `RecaptchaVerifier`, `signInWithPhoneNumber`, E.164 phone formatting |
| **User Passport Profile** | Google Cloud Firestore (`/users/{uid}`) | Firebase Security Rules (Cloud Server-Enforced) | `firestore.rules` (owner-only `request.auth.uid == userId` and schema whitelist) |
| **Session Persistence** | LocalStorage + Firebase Auth Client State | Browser Sandbox | Zustand store (`useAtlasStore`), `onAuthStateChanged` listener, explicit logout purge |
| **Public Datasets** | 14 GeoJSON layers (Static Edge CDN) | Public Static Assets | Read-only static delivery, edge caching (`max-age=604800`) |
| **Service Worker / PWA** | Web Cache API (`sw.js`) | Browser Sandbox | Same-origin isolation, strict bypass of `*.googleapis.com` & `*.firebase*` |
| **Deployment / Edge** | Vercel & Netlify Edge CDN | Edge Reverse Proxy | HSTS, CSP, X-Frame-Options: DENY, Referrer-Policy, Permissions-Policy |

---

## 3. Vulnerability Findings & Code-Level Remediations

### Finding 1: Absence of Cloud Firestore Security Rules (Cross-Tenant Account Takeover & Privilege Escalation)
- **Severity:** Critical (CVSS: 9.1)
- **Affected Files:** `firestore.rules`, `firebase.json`, `src/lib/firebase.ts`
- **Description & Realistic Impact:**
  Prior to remediation, no `firestore.rules` file existed in source control. In default or improperly configured Firestore databases, unauthenticated or cross-tenant attackers could read, modify, or delete any user document in `/users/{userId}`. This exposed private personal data (emails, phone numbers, home district, visited places) and allowed attackers to grant themselves unauthorized badges or overwrite other users' travel passports.
- **Root Cause:** Missing database security policy in source control; client-side `syncProfileToFirestore` assumed server security without declarative rules.
- **Remediation Applied:**
  1. Created `firestore.rules` enforcing strict Default-Deny (`match /{document=**} { allow read, write: if false; }`).
  2. Implemented owner-only access for `/users/{userId}` (`request.auth != null && request.auth.uid == userId`).
  3. Added schema validation function `isValidProfileData(userId)` verifying data types, string length boundaries (name <= 100 chars), list constraints (stamps <= 34), and whitelisting allowed keys to block privilege escalation.
  4. Configured `firebase.json` binding `firestore.rules`.
  5. Hardened `syncProfileToFirestore` in `src/lib/firebase.ts` to assert that `auth.currentUser.uid === profile.uid`.
- **Regression Test:** `scripts/verify_security_hardening.js` (Checks 1-7). **Status: PASS**.

---

### Finding 2: Insecure Hardcoded Phone OTP Code & Production Mock Login Bypass
- **Severity:** High (CVSS: 8.2)
- **Affected Files:** `src/lib/firebase.ts`, `src/components/auth/AuthModal.tsx`
- **Description & Realistic Impact:**
  `src/lib/firebase.ts` contained a hardcoded mock code (`mockCode: '789012'`) in `sendPhoneOtp`, and `verifyPhoneOtp` accepted any 6-digit code or fallback values when `confirmationResult` was absent. Furthermore, `AuthModal.tsx` never stored `res.confirmationResult` in state and always called `verifyPhoneOtp(otpCode, undefined, phoneNumber)`. In production, this would allow anyone to bypass phone authentication without verifying SMS delivery or possessing the phone number.
- **Root Cause:** Development test stubs were left unguarded and active in production code paths.
- **Remediation Applied:**
  1. Gated all mock OTP and fallback behavior strictly behind `!import.meta.env.PROD`.
  2. In production (`import.meta.env.PROD === true`), `sendPhoneOtp` never returns `mockCode`, and `verifyPhoneOtp` strictly requires a valid `ConfirmationResult` from Firebase Auth.
  3. Stored `confirmationResult` in `AuthModal.tsx` React state and passed it directly to `verifyPhoneOtp`.
  4. Removed "Demo OTP: 789012" hints and the "Instant Demo Explorer Login" button from production UI builds.
- **Regression Test:** `scripts/verify_security_hardening.js` (Checks 10, 11, 14, 15, 16). **Status: PASS**.

---

### Finding 3: Lack of Rate Limiting & Cooldown Protection on OTP Dispatch (SMS Bombing Risk)
- **Severity:** Medium (CVSS: 6.5)
- **Affected Files:** `src/components/auth/AuthModal.tsx`, `src/lib/firebase.ts`
- **Description & Realistic Impact:**
  The phone login form had no rate-limiting or cooldown mechanism. An automated script or malicious user could rapidly trigger `sendPhoneOtp`, flooding a victim's phone number with SMS verification messages (SMS bombing), causing carrier complaints, exhausting Firebase daily SMS quotas, and racking up unexpected GCP verification fees.
- **Root Cause:** Absence of stateful client cooldown logic and attempt counters.
- **Remediation Applied:**
  1. Implemented a 60-second cooldown timer (`OTP_COOLDOWN_SECONDS = 60`) upon successful dispatch, disabling the "Send OTP" and "Resend OTP" buttons with a live UI countdown.
  2. Implemented a maximum failed attempt lockout (`MAX_OTP_ATTEMPTS = 5`) locking verification requests after repeated invalid inputs.
  3. Added strict Indian phone number regex validation (`^\+91[6-9]\d{9}$`) before dispatching requests.
- **Regression Test:** `scripts/verify_security_hardening.js` (Checks 8, 9, 12, 13). **Status: PASS**.

---

### Finding 4: Missing DOM reCAPTCHA Container & Improper App-Verification Setup
- **Severity:** Medium (CVSS: 5.3)
- **Affected Files:** `src/components/auth/AuthModal.tsx`, `src/lib/firebase.ts`
- **Description & Realistic Impact:**
  Firebase Phone Authentication requires an app-verification mechanism (reCAPTCHA v2 / enterprise invisible widget). In `AuthModal.tsx`, no DOM container element (`<div id="recaptcha-container"></div>`) existed, and `sendPhoneOtp` was invoked without an initialized `verifier`. In a live Firebase deployment, this caused phone verification to fail silently.
- **Root Cause:** Missing UI lifecycle hook and container element for `RecaptchaVerifier`.
- **Remediation Applied:**
  1. Added `<div id="recaptcha-container"></div>` into `AuthModal.tsx`.
  2. Initialized invisible `setupRecaptcha('recaptcha-container')` when opening phone authentication mode.
  3. Exported `clearRecaptcha()` and hooked it to modal dismissal and unmount handlers to avoid memory leaks.
- **Regression Test:** `scripts/verify_security_hardening.js` (Check 14). **Status: PASS**.

---

### Finding 5: Overly Restrictive / Incompatible Content Security Policy (CSP)
- **Severity:** Medium (CVSS: 6.1)
- **Affected Files:** `vercel.json`, `netlify.toml`
- **Description & Realistic Impact:**
  The HTTP Content Security Policy deployed in `vercel.json` and `netlify.toml` lacked directives for:
  - Google OAuth identity endpoints (`https://apis.google.com`, `https://accounts.google.com`)
  - Firebase Authentication backend endpoints (`https://identitytoolkit.googleapis.com`, `https://securetoken.googleapis.com`)
  - Google reCAPTCHA scripts and frames (`https://www.google.com/recaptcha/`, `https://recaptcha.google.com/`)
  - Cloud Firestore WebSocket/REST channels (`https://firestore.googleapis.com`)
  - Destination media CDN domains (`https://images.unsplash.com`, `https://upload.wikimedia.org`)
  In production, modern browsers enforcing this CSP would block login popups, reCAPTCHA challenges, and landmark images.
- **Root Cause:** Static CSP headers were configured without testing live provider network requests.
- **Remediation Applied:**
  Updated `vercel.json` and `netlify.toml` with a comprehensive, hardened CSP:
  - `script-src 'self' 'unsafe-inline' https://unpkg.com https://cdn.jsdelivr.net https://apis.google.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/;`
  - `frame-src 'self' https://accounts.google.com https://*.firebaseapp.com https://www.google.com/recaptcha/ https://recaptcha.google.com/;`
  - `connect-src 'self' data: blob: https://*.tile.openstreetmap.fr https://*.basemaps.cartocdn.com https://*.arcgisonline.com https://server.arcgisonline.com https://services.arcgisonline.com https://*.tile.opentopomap.org https://api.mapbox.com https://unpkg.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://firestore.googleapis.com https://www.googleapis.com https://apis.google.com;`
  - `img-src 'self' data: blob: https://*.tile.openstreetmap.fr https://*.basemaps.cartocdn.com https://*.arcgisonline.com https://server.arcgisonline.com https://services.arcgisonline.com https://*.tile.opentopomap.org https://api.mapbox.com https://*.tiles.mapbox.com https://unpkg.com https://images.unsplash.com https://upload.wikimedia.org https://lh3.googleusercontent.com;`
  - Retained `frame-ancestors 'none'`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and `Strict-Transport-Security`.
- **Regression Test:** `scripts/verify_security_hardening.js` (Checks 17, 18, 19). **Status: PASS**.

---

### Finding 6: Missing Git Exclusions for Credentials and Lack of Environment Template
- **Severity:** Low (CVSS: 3.3)
- **Affected Files:** `.gitignore`, `.env.example`
- **Description & Realistic Impact:**
  `.gitignore` did not exclude `.env`, `.env.local`, `*.pem`, or service account keys. If developers created local credential files, git would track and commit them to public or private source control.
- **Root Cause:** Incomplete ignore rules in `.gitignore`.
- **Remediation Applied:**
  1. Updated `.gitignore` to explicitly ignore `.env`, `.env.local`, `.env.*.local`, `*.pem`, `*.key`, and `service-account*.json`.
  2. Created `.env.example` with sanitized placeholders.
- **Regression Test:** `scripts/verify_security_hardening.js` (Checks 6, 7). **Status: PASS**.

---

### Finding 7: Potential DOM-Based XSS in Leaflet Map Popup Templates
- **Severity:** Low (CVSS: 3.8)
- **Affected Files:** `src/components/map/AtlasMap.tsx`
- **Description & Realistic Impact:**
  Dynamic strings (place name, summary, timings, district) were interpolated directly into Leaflet HTML popup templates without HTML entity encoding. If any external dataset, user review, or fetched payload contained malicious HTML (`<img src=x onerror=...>`), it would execute in the user's browser context.
- **Root Cause:** Unescaped template literals passed into Leaflet `m.bindPopup(html)`.
- **Remediation Applied:**
  Added an `escapeHtml()` utility to `AtlasMap.tsx` escaping `&`, `<`, `>`, `"`, and `'` characters across all popup strings.
- **Regression Test:** `scripts/verify_security_hardening.js` (Check 21). **Status: PASS**.

---

### Finding 8: Service Worker Cache Poisoning Risk for Auth & API Requests
- **Severity:** Low (CVSS: 3.5)
- **Affected Files:** `public/sw.js`
- **Description & Realistic Impact:**
  The PWA service worker's `fetch` handler previously intercepted all GET requests and cached successful 200 responses into `CACHE_NAME` without verifying if the target domain was external or sensitive. This could lead to storing sensitive tokens or profile data in the offline cache.
- **Root Cause:** Unrestricted network-first caching handler.
- **Remediation Applied:**
  Added an explicit bypass in `public/sw.js` ignoring any requests targeting `googleapis.com`, `google.com`, or `firebase`, and restricted application shell caching strictly to same-origin requests (`url.origin === self.location.origin`).
- **Regression Test:** `scripts/verify_security_hardening.js` (Check 20). **Status: PASS**.

---

## 4. Destination Landmarks Photographic Quality & Aspect Framing Review

In accordance with the directive: *"just like sardar statue do it for all places"*:
- **Image URL Audit:** All 37 destinations in `src/data/tourist-destinations.ts` were inspected for broken links and HTTP status codes. Three 404 links (Polo Forest, Wild Ass Sanctuary, Palitana) were replaced with verified, high-resolution landscape photographs.
- **Landscape Framing:** Every landmark is displayed in an authentic `aspect-[16/10]` responsive card with `object-fit: cover` and `object-position: center center`.
- **Hotlink & Rate-Limit Protection:** Added `referrerPolicy="no-referrer"` to all image tags across `PlacesDestinationView.tsx` and `AtlasMap.tsx` popups.
- **Fallback Resilience:** Configured `onError` fallback to the verified local landscape asset `/images/destinations/statue-of-unity.jpg`.
- **Automated Validation:** Verified that all 37 destinations have valid image entries and proper layout properties (`scripts/verify_security_hardening.js` Checks 22 & 23).

---

## 5. Automated Validation & Test Record

| Test Suite | Command | Total Checks | Result | Execution Context |
| :--- | :--- | :--- | :--- | :--- |
| **Security Hardening Suite** | `node scripts/verify_security_hardening.js` | 27 / 27 Passed | **100% PASS** | Node.js rule parser, regex validator, manifest checker |
| **Step 3 Auth Verification** | `node scripts/verify_auth_step3.js` | 6 / 6 Checks Passed | **100% PASS** | Chrome Headless CDP (Auth modal, onboarding, passport sync) |
| **Ethnic Redesign & EV Radar** | `node scripts/verify_ethnic_redesign.js` | 7 / 7 Checks Passed | **100% PASS** | Chrome Headless CDP (Destinations, 37 pins, EV radar, paper theme) |
| **Consumer Experience Suite** | `node scripts/verify_consumer_experience.js` | 47 / 47 Checks Passed | **100% PASS** | Chrome Headless CDP (5 navigation views, stamps, trip reality) |
| **Production Deployment Check** | `python scripts/verify_deployment.py` | 14 GeoJSON layers | **100% PASS** | Python 3 (3,374 engineering features, asset inventory) |
| **TypeScript & React Build** | `npm run build:react` | 2,372 Modules | **100% PASS** | `tsc --noEmit` & Vite production bundle (`dist/app.html`) |

---

## 6. Manual Actions Required (External Console Configurations)

While all code-level vulnerabilities have been fixed, the following administrative settings require configuration in the external cloud consoles:

### 1. Google Cloud Console (APIs & Services -> Credentials)
- **API Key Restrictions:**
  Navigate to the browser API key used for `VITE_FIREBASE_API_KEY`.
  - Under **Application restrictions**, set **Websites** and add:
    - `https://gujarat-inframap.vercel.app`
    - `https://*.vercel.app` (optional, for preview branches if desired)
    - `http://localhost:3000` (for local development)
  - Under **API restrictions**, restrict the key to:
    - *Identity Toolkit API*
    - *Token Service API*
    - *Cloud Firestore API*

### 2. Firebase Console (Authentication -> Settings -> Authorized Domains)
- Verify that only legitimate domains are in the list:
  - `gujarat-inframap.vercel.app`
  - `localhost`
  - Delete any abandoned preview or unknown project domains.
- Under **Phone Auth**, ensure SMS region is set to India (`+91`) or intended jurisdictions to mitigate global international SMS fraud.
- Under **App Check** (Optional but Recommended): Register reCAPTCHA Enterprise or reCAPTCHA v3 in Firebase App Check to cryptographically protect Firestore and Auth APIs against automated headless bot scraping.

### 3. Firebase Console (Firestore Database -> Rules)
- Deploy the newly created `firestore.rules` using the Firebase CLI:
  ```bash
  firebase deploy --only firestore:rules
  ```
  Ensure the rules are active on the production Firestore instance.

### 4. Vercel Dashboard (Project Settings -> Environment Variables)
- Add production environment variables:
  - `VITE_FIREBASE_API_KEY`
  - `VITE_FIREBASE_AUTH_DOMAIN`
  - `VITE_FIREBASE_PROJECT_ID`
  - `VITE_FIREBASE_STORAGE_BUCKET`
  - `VITE_FIREBASE_MESSAGING_SENDER_ID`
  - `VITE_FIREBASE_APP_ID`
- Ensure variables are marked for **Production** and **Preview** as appropriate, and that no service account private keys (`serviceAccountKey.json`) are ever entered into client environment variables.

---

## 7. Residual Risks & Ongoing Hygiene

1. **Third-Party CDN Image Availability:** The application relies on external CDNs (Unsplash, Wikimedia Commons) for landmark imagery. While all URLs are valid and backed by local fallbacks (`/images/destinations/statue-of-unity.jpg`), external CDNs can occasionally experience transient network outages. Ongoing monitoring or migrating all 37 images to local `/public/images/destinations/` storage will completely eliminate external media dependencies.
2. **Client-Side Environment Variables:** Firebase web configuration keys (`apiKey`, `projectId`) are visible in browser network traffic by design in all Firebase client apps. They are not secret keys, but they rely on Google Cloud API Key restrictions and Firebase Security Rules for protection. Enforcing the manual steps in Section 6 is essential.
3. **SMS Verification Quotas:** Even with client cooldowns and reCAPTCHA, determined human actors can request OTPs up to the provider limit. Monitoring Firebase daily quota alerts in the GCP console will prevent surprise billing spikes.
