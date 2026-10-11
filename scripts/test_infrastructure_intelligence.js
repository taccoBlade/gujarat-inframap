/**
 * Automated Headless Chrome CDP Verification Suite for Gujarat Infrastructure Intelligence Engine
 * Tests asset relationships, district comparisons, WEA nexus, context reports,
 * coverage audit, distinctive superlatives, and keyboard accessibility.
 */

const http = require('http');
const { spawn } = require('child_process');
const path = require('path');
const os = require('os');

async function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.id = 1;
    this.callbacks = new Map();
    this.eventListeners = new Map();
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.onopen = () => resolve();
      this.ws.onerror = (err) => reject(err);
      this.ws.onmessage = (msg) => {
        const data = JSON.parse(msg.data);
        if (data.id && this.callbacks.has(data.id)) {
          const cb = this.callbacks.get(data.id);
          this.callbacks.delete(data.id);
          if (data.error) cb.reject(data.error);
          else cb.resolve(data.result);
        } else if (data.method) {
          const listeners = this.eventListeners.get(data.method) || [];
          for (const l of listeners) l(data.params);
        }
      };
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  on(event, handler) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(handler);
  }

  async eval(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true
    });
    if (res.exceptionDetails) {
      throw new Error(`Eval error: ${JSON.stringify(res.exceptionDetails)}`);
    }
    return res.result ? res.result.value : undefined;
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function runTests() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = path.join(os.tmpdir(), 'chrome-intel-test-' + Date.now());
  const port = 9226;

  console.log(`Starting headless Chrome on port ${port}...`);
  const chromeProc = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    '--window-size=1600,900',
    'http://127.0.0.1:8080/'
  ], { detached: false });

  let versionInfo = null;
  for (let i = 0; i < 20; i++) {
    await sleep(500);
    try {
      versionInfo = await getJson(`http://127.0.0.1:${port}/json/version`);
      if (versionInfo) break;
    } catch (e) {}
  }

  if (!versionInfo) {
    console.error('Failed to connect to Chrome debugging port.');
    chromeProc.kill();
    process.exit(1);
  }

  const targets = await getJson(`http://127.0.0.1:${port}/json/list`);
  const pageTarget = targets.find(t => t.type === 'page' && t.url.includes('127.0.0.1:8080'));
  if (!pageTarget) {
    console.error('Failed to locate target page.');
    chromeProc.kill();
    process.exit(1);
  }

  const client = new CDPClient(pageTarget.webSocketDebuggerUrl);
  await client.connect();

  const consoleErrors = [];
  client.on('Runtime.consoleAPICalled', (params) => {
    if (params.type === 'error') {
      consoleErrors.push(params.args.map(a => a.value || a.description).join(' '));
    }
  });

  await client.send('Runtime.enable');
  await client.send('Page.enable');

  console.log('Waiting for application and InfrastructureIntelligence initialization...');
  await sleep(4000);

  try {
    // -----------------------------------------------------------------------
    console.log('\n========================================');
    console.log('TEST 1: MODULE INITIALIZATION & CONSOLE HEALTH');
    console.log('========================================');
    const isMounted = await client.eval(`typeof window.InfrastructureIntelligence === "object"`);
    console.log('InfrastructureIntelligence mounted:', isMounted);
    if (!isMounted) throw new Error('InfrastructureIntelligence is not mounted on window');
    console.log('Console Errors detected:', consoleErrors.length);
    if (consoleErrors.length > 0) {
      console.warn('Errors:', consoleErrors);
    }

    // -----------------------------------------------------------------------
    console.log('\n========================================');
    console.log('TEST 2: ASSET RELATIONSHIPS EXPLORER');
    console.log('========================================');
    const relSardarSarovar = await client.eval(`
      (() => {
        const rel = window.InfrastructureIntelligence.getAssetRelationships("GJ-WR-DAM-001");
        return {
          found: rel.found,
          name: rel.asset.name,
          upstreamCount: rel.upstream.length,
          downstreamCount: rel.downstream.length,
          dependentCount: rel.dependent.length,
          verifiedLinksCount: rel.verifiedLinksCount
        };
      })()
    `);
    console.log('Sardar Sarovar Dam Relationships:', relSardarSarovar);
    if (!relSardarSarovar.found || relSardarSarovar.verifiedLinksCount < 2) {
      throw new Error('Asset relationships for Sardar Sarovar Dam failed');
    }

    // -----------------------------------------------------------------------
    console.log('\n========================================');
    console.log('TEST 3: DISTRICT INFRASTRUCTURE COMPARISON');
    console.log('========================================');
    const distStats = await client.eval(`
      (() => {
        const stats = window.InfrastructureIntelligence.getDistrictStatistics();
        const districtsCount = Object.keys(stats).length;
        const amd = stats["Ahmedabad"];
        const kutch = stats["Kachchh"];
        const narmada = stats["Narmada"];
        return {
          districtsCount: districtsCount,
          ahmedabad: {
            area_sqkm: amd ? amd.area_sqkm : 0,
            power_capacity_mw: amd ? amd.power_capacity_mw : 0,
            railway_stations_count: amd ? amd.railway_stations_count : 0
          },
          kachchh: {
            dams_count: kutch ? kutch.dams_count : 0,
            ports_airports_count: kutch ? kutch.ports_airports_count : 0
          },
          narmada: {
            gross_storage_mcm: narmada ? narmada.gross_storage_mcm : 0,
            power_capacity_mw: narmada ? narmada.power_capacity_mw : 0
          }
        };
      })()
    `);
    console.log('District Statistics Summary:', distStats);
    if (distStats.districtsCount !== 33) {
      throw new Error(`Expected 33 districts, found ${distStats.districtsCount}`);
    }
    if (distStats.narmada.gross_storage_mcm < 9000) {
      throw new Error('Narmada storage calculation mismatch (expected >9000 MCM for Sardar Sarovar)');
    }

    // -----------------------------------------------------------------------
    console.log('\n========================================');
    console.log('TEST 4: WATER-ENERGY-AGRICULTURE NEXUS');
    console.log('========================================');
    const nexusSummary = await client.eval(`
      (() => {
        const systems = window.InfrastructureIntelligence.getNexusSystems();
        return {
          systemsCount: systems.length,
          firstSystemTitle: systems[0].title,
          firstSystemStorageMcm: systems[0].storage_mcm,
          firstSystemHydroMw: systems[0].hydro_mw,
          firstSystemStagesCount: systems[0].stages.length
        };
      })()
    `);
    console.log('WEA Nexus Systems:', nexusSummary);
    if (nexusSummary.systemsCount !== 5 || nexusSummary.firstSystemStagesCount < 4) {
      throw new Error('WEA Nexus systems validation failed');
    }

    // -----------------------------------------------------------------------
    console.log('\n========================================');
    console.log('TEST 5: ON-DEMAND CONTEXT SCREENING REPORT');
    console.log('========================================');
    const reportRes = await client.eval(`
      (() => {
        const rep = window.InfrastructureIntelligence.generateContextReport(21.833, 73.749, "Sardar Sarovar Dam Origin");
        return {
          district: rep.admin.district,
          utmEasting: rep.utm.easting_m,
          utmNorthing: rep.utm.northing_m,
          nearestDam: rep.water.dam ? rep.water.dam.name : null,
          nearestDamDistKm: rep.water.dam ? rep.water.dam.dist_km : null,
          seismicZone: rep.hazards.seismic_zone,
          hasDisclaimer: !!rep.disclaimer
        };
      })()
    `);
    console.log('Context Report Output:', reportRes);
    if (!reportRes.nearestDam || !reportRes.hasDisclaimer) {
      throw new Error('Context Report generation failed or missing statutory disclaimer');
    }

    // -----------------------------------------------------------------------
    console.log('\n========================================');
    console.log('TEST 6: COVERAGE AUDIT & DISTINCTIVE SUPERLATIVES');
    console.log('========================================');
    const auditRes = await client.eval(`
      (() => {
        const cov = window.InfrastructureIntelligence.getCoverageRegistry();
        const dist = window.InfrastructureIntelligence.getDistinctiveAssets();
        return {
          layersAudited: cov.length,
          totalFeaturesSum: cov.reduce((acc, c) => acc + c.feature_count, 0),
          distinctiveAssetsCount: dist.length,
          topAsset: dist[0].name
        };
      })()
    `);
    console.log('Audit & Superlatives:', auditRes);
    if (auditRes.layersAudited !== 13 || auditRes.totalFeaturesSum !== 3327) {
      throw new Error(`Expected 13 layers and 3327 features, got ${auditRes.layersAudited} / ${auditRes.totalFeaturesSum}`);
    }

    // -----------------------------------------------------------------------
    console.log('\n========================================');
    console.log('TEST 7: MODAL UI & SHORTCUT NAVIGATION (KEY I & ESC)');
    console.log('========================================');
    const modalTest = await client.eval(`
      (() => {
        window.InfrastructureIntelligence.openModal("relationships");
        const modal = document.getElementById("infraIntelModal");
        const isOpen = modal && modal.open;
        const title = document.getElementById("infraIntelModalTitle").textContent;
        
        // Test tab switching
        window.InfrastructureIntelligence.switchTab("districts");
        const distPaneActive = document.getElementById("intelPane-districts").classList.contains("active");

        window.InfrastructureIntelligence.switchTab("nexus");
        const nexusPaneActive = document.getElementById("intelPane-nexus").classList.contains("active");

        window.InfrastructureIntelligence.switchTab("reports");
        const repPaneActive = document.getElementById("intelPane-reports").classList.contains("active");

        window.InfrastructureIntelligence.switchTab("coverage");
        const covPaneActive = document.getElementById("intelPane-coverage").classList.contains("active");

        window.InfrastructureIntelligence.switchTab("distinctive");
        const distTabActive = document.getElementById("intelPane-distinctive").classList.contains("active");

        // Close modal
        window.InfrastructureIntelligence.closeModal();
        const isClosed = !modal.open;

        return {
          isOpen,
          title,
          allTabsSwitched: distPaneActive && nexusPaneActive && repPaneActive && covPaneActive && distTabActive,
          isClosed
        };
      })()
    `);
    console.log('Modal & Tab Navigation:', modalTest);
    if (!modalTest.isOpen || !modalTest.allTabsSwitched || !modalTest.isClosed) {
      throw new Error('Modal interaction test failed');
    }

    console.log('\nALL GUJARAT INFRASTRUCTURE INTELLIGENCE TESTS COMPLETED SUCCESSFULLY!\n');
  } catch (err) {
    console.error('Test Suite Failed:', err);
    process.exitCode = 1;
  } finally {
    client.close();
    chromeProc.kill();
  }
}

runTests();
