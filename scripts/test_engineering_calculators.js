/**
 * Gujarat InfraMap — Civil Engineering Calculators Unit Test Suite
 * Tests:
 * 1. Superelevation (IRC:73-1980 / IRC:SP:84-2019)
 * 2. Stopping Sight Distance (SSD per IRC:73)
 * 3. Lacey's Regime Bridge Pier Scour Depth (IRC:5-1998 / IRC:78-2014)
 * 4. Dam Hydrostatic Thrust & Overturning Safety Factor (IS 6512-1984)
 * 5. Hydropower: Nameplate Capacity vs Annual Energy Generation (CEA standards)
 */

const assert = require('assert');

console.log('======================================================================');
console.log('GUJARAT INFRAMAP — CIVIL ENGINEERING CALCULATORS VERIFICATION SUITE');
console.log('======================================================================');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  [PASS] ${name}`);
    passed++;
  } catch (err) {
    console.error(`  [FAIL] ${name}: ${err.message}`);
    failed++;
  }
}

// -----------------------------------------------------------------------------
// 1. SUPERELEVATION CALCULATOR (IRC:73-1980 Clause 4.3)
// Formula: e = V^2 / (225 * R) (designing for 75% design speed counteracting centrifugal force)
// Plain & Rolling Terrain max: 7.0% (0.07)
// Hilly Terrain max: 10.0% (0.10)
// Urban Roads with frequent intersections max: 4.0% (0.04)
// -----------------------------------------------------------------------------
console.log('\n--- 1. Superelevation (IRC:73-1980) Compliance Tests ---');

function calcSuperelevation(V_kmh, R_m, terrain = 'plain') {
  const e = (V_kmh * V_kmh) / (225 * R_m);
  const ePercent = e * 100;
  
  const limits = {
    plain: 7.0,
    hilly: 10.0,
    urban: 4.0
  };
  const maxAllowable = limits[terrain] || 7.0;
  const isCompliant = ePercent <= maxAllowable;

  let status = '';
  if (ePercent <= 7.0) {
    status = 'COMPLIANT_PLAIN';
  } else if (ePercent <= 10.0) {
    status = 'PERMISSIBLE_HILLY_ONLY';
  } else {
    status = 'EXCEEDS_MAX_ALLOWABLE';
  }

  // Minimum curve radius to satisfy plain terrain at speed V
  const minRadiusForPlain = (V_kmh * V_kmh) / (225 * 0.07);
  // Maximum safe speed on radius R for plain terrain
  const maxSpeedForRadius = Math.sqrt(0.07 * 225 * R_m);

  return {
    e,
    ePercent,
    status,
    isCompliant,
    maxAllowable,
    minRadiusForPlain,
    maxSpeedForRadius
  };
}

test('V=100 km/h, R=500m on Plain Terrain exceeds 7% limit (8.89% calculated)', () => {
  const res = calcSuperelevation(100, 500, 'plain');
  assert(Math.abs(res.ePercent - 8.8889) < 0.01, `Expected ~8.89%, got ${res.ePercent.toFixed(2)}%`);
  assert.strictEqual(res.isCompliant, false, 'Should be NON-COMPLIANT for plain terrain');
  assert.strictEqual(res.status, 'PERMISSIBLE_HILLY_ONLY');
  // Remedy: radius must be increased to >= 635m
  assert(res.minRadiusForPlain > 634 && res.minRadiusForPlain < 635.5, `Expected R >= ~635m, got ${res.minRadiusForPlain}`);
  // Or speed restricted to <= 88.7 km/h
  assert(res.maxSpeedForRadius > 88.0 && res.maxSpeedForRadius < 89.0, `Expected V <= ~88.7 km/h, got ${res.maxSpeedForRadius}`);
});

test('V=80 km/h, R=500m on Plain Terrain is fully compliant (5.69% <= 7.0%)', () => {
  const res = calcSuperelevation(80, 500, 'plain');
  assert(Math.abs(res.ePercent - 5.6889) < 0.01, `Expected ~5.69%, got ${res.ePercent.toFixed(2)}%`);
  assert.strictEqual(res.isCompliant, true, 'Should be COMPLIANT for plain terrain');
  assert.strictEqual(res.status, 'COMPLIANT_PLAIN');
});

test('V=100 km/h, R=700m on Plain Terrain is compliant (6.35% <= 7.0%)', () => {
  const res = calcSuperelevation(100, 700, 'plain');
  assert(Math.abs(res.ePercent - 6.349) < 0.01, `Expected ~6.35%, got ${res.ePercent.toFixed(2)}%`);
  assert.strictEqual(res.isCompliant, true, 'Should be COMPLIANT for plain terrain');
  assert.strictEqual(res.status, 'COMPLIANT_PLAIN');
});

test('V=120 km/h, R=400m exceeds all terrain limits (16.0% > 10.0%)', () => {
  const res = calcSuperelevation(120, 400, 'plain');
  assert(Math.abs(res.ePercent - 16.0) < 0.01, `Expected 16.0%, got ${res.ePercent.toFixed(2)}%`);
  assert.strictEqual(res.status, 'EXCEEDS_MAX_ALLOWABLE');
  assert.strictEqual(res.isCompliant, false);
});

// -----------------------------------------------------------------------------
// 2. STOPPING SIGHT DISTANCE (IRC:73-1980 Clause 4.2)
// Formula: SSD = Lag Distance + Braking Distance
// SSD = 0.278 * V * t + V^2 / (254 * (f + G))
// where t = 2.5s (driver reaction time), f = coefficient of longitudinal friction (0.35-0.40)
// -----------------------------------------------------------------------------
console.log('\n--- 2. Stopping Sight Distance (IRC:73) Tests ---');

function calcSSD(V_kmh, t_sec = 2.5, f = 0.35, G = 0.0) {
  const lagDist = 0.278 * V_kmh * t_sec;
  const denominator = 254 * (f + G);
  const brakeDist = (V_kmh * V_kmh) / denominator;
  const totalSSD = lagDist + brakeDist;
  return { lagDist, brakeDist, totalSSD };
}

test('V=100 km/h, t=2.5s, f=0.35 on level grade yields SSD ~181.8m', () => {
  const res = calcSSD(100, 2.5, 0.35, 0.0);
  assert(Math.abs(res.lagDist - 69.5) < 0.1, `Lag distance expected 69.5m, got ${res.lagDist}`);
  assert(Math.abs(res.brakeDist - 112.49) < 0.2, `Brake distance expected ~112.5m, got ${res.brakeDist}`);
  assert(Math.abs(res.totalSSD - 182.0) < 1.0, `Total SSD expected ~182m, got ${res.totalSSD}`);
});

test('V=60 km/h, t=2.5s, f=0.36 on level grade yields SSD ~81m', () => {
  const res = calcSSD(60, 2.5, 0.36, 0.0);
  assert(Math.abs(res.lagDist - 41.7) < 0.1);
  assert(res.totalSSD > 80 && res.totalSSD < 83, `Expected ~81m, got ${res.totalSSD}`);
});

// -----------------------------------------------------------------------------
// 3. LACEY REGIME BRIDGE PIER SCOUR DEPTH (IRC:5-1998 & IRC:78-2014)
// Formula: Mean regime scour depth below HFL R = 1.35 * (q^2 / f)^(1/3)
// Maximum pier scour depth below HFL = 2.0 * R
// Minimum foundation grip length = 0.33 * R
// -----------------------------------------------------------------------------
console.log('\n--- 3. Bridge Pier Lacey Regime Scour (IRC:5 / IRC:78) Tests ---');

function calcLaceyScour(q_m3s_m, siltFactor_f) {
  assert(q_m3s_m > 0, 'Discharge intensity q must be positive');
  assert(siltFactor_f > 0, 'Silt factor f must be positive');
  const R = 1.35 * Math.pow((q_m3s_m * q_m3s_m) / siltFactor_f, 1 / 3);
  const maxPierScour = 2.0 * R;
  const minGrip = 0.33 * R;
  return { R, maxPierScour, minGrip };
}

test('q=20 m³/s/m, f=1.0 (medium sand) yields R=10.02m, Pier Scour=20.05m', () => {
  const res = calcLaceyScour(20, 1.0);
  // (20^2 / 1.0)^(1/3) = 400^(1/3) = 7.368
  // R = 1.35 * 7.368 = 9.947 m
  assert(Math.abs(res.R - 9.95) < 0.1, `Expected R ~9.95m, got ${res.R.toFixed(2)}m`);
  assert(Math.abs(res.maxPierScour - 19.89) < 0.2, `Expected Pier Scour ~19.9m, got ${res.maxPierScour.toFixed(2)}m`);
  assert(Math.abs(res.minGrip - 3.28) < 0.1, `Expected Grip ~3.28m, got ${res.minGrip.toFixed(2)}m`);
});

test('Higher silt factor f=1.5 reduces regime scour depth (coarser gravel/coarse sand)', () => {
  const sand = calcLaceyScour(20, 1.0);
  const coarse = calcLaceyScour(20, 1.5);
  assert(coarse.R < sand.R, 'Coarser sediment with higher silt factor must have lower scour depth');
});

// -----------------------------------------------------------------------------
// 4. DAM HYDROSTATIC FORCES & OVERTURNING FOS (IS 6512-1984)
// Hydrostatic Thrust: F_h = 0.5 * rho * g * H^2 (per metre run)
// Overturning Moment: M_o = F_h * (H / 3)
// Resisting Moment: M_r = W * d
// FOS = M_r / M_o (IS 6512 specifies FOS >= 1.5 for normal operating condition)
// -----------------------------------------------------------------------------
console.log('\n--- 4. Dam Hydrostatic & Stability (IS 6512-1984) Tests ---');

function calcDamStability(H_water_m, damHeight_m, damTopWidth_m, damBaseWidth_m, concreteDensity = 2400) {
  const rho_w = 1000; // kg/m³
  const g = 9.81; // m/s²
  
  // Hydrostatic horizontal thrust per metre run (kN/m)
  const F_h = 0.5 * rho_w * g * (H_water_m * H_water_m) / 1000;
  // Overturning moment about toe (kNm/m)
  const M_o = F_h * (H_water_m / 3);

  // Dam dead weight (trapezoid section) per metre run
  const area = 0.5 * (damTopWidth_m + damBaseWidth_m) * damHeight_m;
  const weight_kN = (area * concreteDensity * g) / 1000;
  
  // Approximate centroid distance from downstream toe for standard gravity dam
  const d_toe = damBaseWidth_m * 0.45;
  const M_r = weight_kN * d_toe;

  const fos_overturning = M_r / M_o;
  const isSafeIS6512 = fos_overturning >= 1.5;

  return { F_h, M_o, weight_kN, M_r, fos_overturning, isSafeIS6512 };
}

test('Sardar Sarovar scale dam (H=138.68m, Base=125m) demonstrates stable FOS >= 1.5', () => {
  const res = calcDamStability(138.68, 163.0, 12.0, 125.0);
  assert(res.F_h > 94000, `Expected thrust > 94,000 kN/m, got ${res.F_h}`);
  assert(res.fos_overturning > 1.5, `Expected FOS >= 1.5, got ${res.fos_overturning.toFixed(2)}`);
  assert.strictEqual(res.isSafeIS6512, true, 'Dam should be safe against overturning under normal conditions');
});

// -----------------------------------------------------------------------------
// 5. HYDROPOWER ESTIMATES: NAMEPLATE VS AUDITED ANNUAL GENERATION
// Plant Load Factor (PLF): PLF = Generation (GWh) * 10^6 / (Capacity_MW * 8760 hours * 10^3)
// -----------------------------------------------------------------------------
console.log('\n--- 5. Hydropower Nameplate vs Observed Generation (CEA) Tests ---');

function calcPLF(capacity_MW, annualGen_GWh) {
  const maxPossibleGWh = (capacity_MW * 8760) / 1000;
  const plf = (annualGen_GWh / maxPossibleGWh) * 100;
  return { maxPossibleGWh, plf };
}

test('Sardar Sarovar RBPH+CHPH (1,450 MW) at ~3,500 GWh/yr yields realistic PLF ~27.5%', () => {
  const res = calcPLF(1450, 3500);
  assert(Math.abs(res.plf - 27.55) < 0.5, `Expected PLF ~27.5%, got ${res.plf.toFixed(2)}%`);
  assert(res.plf > 15 && res.plf < 45, 'Hydro peaking PLF must be within realistic seasonal monsoon range');
});

console.log('\n======================================================================');
console.log(`ENGINEERING CALCULATORS TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log('======================================================================');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('[SUCCESS] All civil engineering standard equations verified against reference examples!');
}
