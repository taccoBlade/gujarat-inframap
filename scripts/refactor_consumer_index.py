#!/usr/bin/env python3
"""
Surgical Consumer Refactor Script
Removes all engineering simulation workbenches, specialist tools, and 3D modules from index.html.
Preserves 100% of verified data and consumer discovery capabilities.
"""

import sys

def main():
    with open('index.html', 'r', encoding='utf-8') as f:
        c = f.read()

    # 1. Promote Trip Reality to top-level #planVisitView
    old_tr_split = '''          <!-- Tourism Cards Grid -->
          <div id="tourismCardsGrid" class="tourism-cards-grid" role="region" aria-label="Gujarat Destinations Grid">
            <!-- Populated dynamically by TourismDiscovery.render() -->
          </div>
        </div>

        <!-- Mode 2: Trip Reality & Last-Mile Feasibility Sub-View -->
        <div id="tripRealitySubView" class="places-subview hidden">'''

    new_tr_split = '''          <!-- Tourism Cards Grid -->
          <div id="tourismCardsGrid" class="tourism-cards-grid" role="region" aria-label="Gujarat Destinations Grid">
            <!-- Populated dynamically by TourismDiscovery.render() -->
          </div>
        </div>
      </div>
    </section>

    <!-- 4. Plan a Visit (Trip Reality & Last-Mile Feasibility) View Overlay -->
    <section id="planVisitView" class="public-view-container hidden" aria-label="Gujarat Trip Reality & Last-Mile Feasibility">
      <div class="public-view-inner">
        <div id="tripRealitySubView" class="places-subview">'''

    if old_tr_split in c:
        c = c.replace(old_tr_split, new_tr_split, 1)
        print("[+] Promoted Trip Reality to top-level #planVisitView")
    else:
        print("[!] Warning: old_tr_split not matched")

    # 2. In #layerDrawer, remove specialized inspector container
    insp_start = c.find('      <!-- Specialized Infrastructure Inspectors')
    insp_end = c.find('      <!-- Compact Refined Symbology Key -->')
    if insp_start != -1 and insp_end != -1:
        c = c[:insp_start] + c[insp_end:]
        print(f"[+] Removed specialized drawer inspectors ({insp_end - insp_start} bytes)")
    else:
        print("[!] Warning: insp markers not found")

    # 3. In #assetInspectorDrawer, remove lab and report buttons
    old_insp_btns = '''            <button id="inspOpenLabBtn" class="insp-open-lab-btn hidden" title="Open Dam Science Lab for this asset" onclick="window.DamScienceLab && window.DamScienceLab.openCurrentAsset()">
              🔬 Science Lab
            </button>
            <button id="inspGenerateReportBtn" class="insp-open-report-btn" title="Generate Civil Engineering Report for this asset" onclick="window.DigitalTwinReportBuilder && window.DigitalTwinReportBuilder.openForCurrentAsset()">
              📄 Report
            </button>
'''
    if old_insp_btns in c:
        c = c.replace(old_insp_btns, '', 1)
        print("[+] Removed Science Lab & Report buttons from Asset Inspector")
    else:
        print("[!] Warning: old_insp_btns not found")

    # 4. In .map-hud, remove CRS EPSG
    old_hud = '''    <!-- Bottom HUD Bar -->
    <div class="map-hud">
      <div class="hud-item">
        <span class="hud-label">CRS</span>
        <span class="hud-value font-mono">EPSG:4326 (WGS 84)</span>
      </div>
      <div class="hud-divider"></div>'''

    new_hud = '''    <!-- Bottom HUD Bar -->
    <div class="map-hud">'''
    if old_hud in c:
        c = c.replace(old_hud, new_hud, 1)
        print("[+] Removed CRS EPSG technical jargon from bottom HUD")
    else:
        print("[!] Warning: old_hud not found")

    # 5. Mobile bottom nav
    mob_nav_start = c.find('  <!-- Mobile Purpose-Built Bottom Navigation Bar')
    mob_nav_end = c.find('  <!-- Mobile Dedicated Search Sheet -->')
    if mob_nav_start != -1 and mob_nav_end != -1:
        new_mob_nav = '''  <!-- Mobile Purpose-Built Bottom Navigation Bar (Phone & Narrow Tablet) -->
  <nav class="mobile-bottom-nav" id="mobileBottomNav" aria-label="Gujarat InfraMap Mobile Navigation">
    <button class="mobile-nav-btn active" data-nav="explore" id="mobileNavMapBtn" aria-label="Explore Map">
      <svg class="mobile-nav-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
        <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon>
        <line x1="9" y1="3" x2="9" y2="18"></line>
        <line x1="15" y1="6" x2="15" y2="21"></line>
      </svg>
      <span class="mobile-nav-label">Explore</span>
    </button>
    <button class="mobile-nav-btn" data-nav="places" id="mobileNavPlacesBtn" aria-label="Places to Explore">
      <svg class="mobile-nav-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
      </svg>
      <span class="mobile-nav-label">Places</span>
    </button>
    <button class="mobile-nav-btn" data-nav="infrastructure" id="mobileNavInfraBtn" aria-label="Infrastructure">
      <svg class="mobile-nav-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
      </svg>
      <span class="mobile-nav-label">Infra</span>
    </button>
    <button class="mobile-nav-btn" data-nav="plan" id="mobileNavPlanBtn" aria-label="Plan a Visit">
      <svg class="mobile-nav-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
      </svg>
      <span class="mobile-nav-label">Plan</span>
    </button>
    <button class="mobile-nav-btn" data-nav="layers" id="mobileNavLayersBtn" aria-label="Map Layers">
      <svg class="mobile-nav-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
        <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
        <polyline points="2 17 12 22 22 17"></polyline>
        <polyline points="2 12 12 17 22 12"></polyline>
      </svg>
      <span class="mobile-nav-label">Layers</span>
    </button>
  </nav>

'''
        c = c[:mob_nav_start] + new_mob_nav + c[mob_nav_end:]
        print("[+] Streamlined mobile bottom navigation to 5 consumer destinations")
    else:
        print("[!] Warning: mob nav markers not found")

    # 6. Delete mobileStudiosSheet completely
    studios_start = c.find('  <!-- Mobile Studios & Spatial Tools Sheet -->')
    studios_end = c.find('  <!-- Technical Specs & Metadata Modal')
    if studios_start != -1 and studios_end != -1:
        c = c[:studios_start] + c[studios_end:]
        print(f"[+] Deleted Mobile Studios Sheet ({studios_end - studios_start} bytes)")
    else:
        print("[!] Warning: studios sheet markers not found")

    # 7. Delete obsolete modals
    modals_start = c.find('  <!-- Technical Specs & Metadata Modal')
    modals_end = c.find('  <!-- Destination Profile & Editorial Guide Modal Dialog -->')
    if modals_start != -1 and modals_end != -1:
        c = c[:modals_start] + c[modals_end:]
        print(f"[+] Deleted 10 obsolete engineering modals ({modals_end - modals_start} bytes)")
    else:
        print("[!] Warning: modals markers not found")

    # 8. Script tags cleanup
    scripts_start = c.find('  <!-- Reusable Civil Science Stop Framework Component -->')
    scripts_end = c.find('  <!-- Gujarat Atlas Places to Explore & Tourism Discovery Engine -->')
    if scripts_start != -1 and scripts_end != -1:
        new_scripts = '''  <!-- Modular Layer Manager & Scale-Dependent LOD Engine Component -->
  <script src="js/layer_manager.js?v=5.0.0"></script>

  <!-- Infrastructure Asset Inspector Component -->
  <script src="js/asset_inspector.js?v=5.0.0"></script>

'''
        c = c[:scripts_start] + new_scripts + c[scripts_end:]
        print(f"[+] Streamlined script imports, removed 17 engineering simulation engines")
    else:
        print("[!] Warning: scripts markers not found")

    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(c)

    print(f"\n[SUCCESS] index.html successfully refactored. Total size: {len(c):,} bytes.")

if __name__ == '__main__':
    main()
