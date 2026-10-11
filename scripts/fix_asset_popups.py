import re

with open('js/app.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Fix urban data processing loop
old_urban_block = """        const p = feature.properties || {};
        const geom = feature.geometry || {};
        const cat = p.asset_category || "";
        const name = p.name || "Urban Asset";

        if (geom.type === "Point") {
          const latlng = [geom.coordinates[1], geom.coordinates[0]];
          let targetGroup = layerGroups.urbanMetro;
          let paneName = "urbanMetroPane";
          let color = "#06b6d4";
          let radius = 7;
          let typeLabel = "Smart City";
          let badgeBg = "#0284c7";
          let icon = "🏙️";

          if (cat === "COMMERCIAL_SEAPORT") {
            targetGroup = layerGroups.portsAirports;
            paneName = "portsAirportsPane";
            color = "#6366f1";
            badgeBg = "#4f46e5";
            typeLabel = "Commercial Seaport";
            icon = "⚓";
            const cap = parseFloat(p.annual_capacity_mmt) || 10;
            radius = Math.max(6, Math.min(14, Math.sqrt(cap) * 0.8));
            allPortsList.push({ name, latlng, properties: p, feature });
          } else if (cat === "COMMERCIAL_AIRPORT") {
            targetGroup = layerGroups.portsAirports;
            paneName = "portsAirportsPane";
            color = "#0284c7";
            badgeBg = "#0369a1";
            typeLabel = "Commercial Airport";
            icon = "✈️";
            radius = 7.5;
            allAirportsList.push({ name, latlng, properties: p, feature });
          } else if (cat === "INDUSTRIAL_SEZ") {
            targetGroup = layerGroups.industries;
            paneName = "industryPane";
            color = "#f59e0b";
            badgeBg = "#d97706";
            typeLabel = "Mega GIDC / SEZ";
            icon = "🏭";
            radius = 8.0;
          } else if (cat === "MUNICIPAL_CORPORATION") {
            targetGroup = layerGroups.urbanMetro;
            paneName = "urbanMetroPane";
            color = "#06b6d4";
            badgeBg = "#0891b2";
            typeLabel = "Municipal Corporation";
            icon = "🏛️";
            radius = 8.5;
          }

          const marker = L.circleMarker(latlng, {
            pane: paneName,
            radius: radius,
            fillColor: color,
            color: "#ffffff",
            weight: 1.8,
            opacity: 0.95,
            fillOpacity: 0.92
          }).addTo(targetGroup);

          urbanAssetsByName[name] = { marker, feature, latlng, category: cat };
          allUrbanList.push({ marker, feature, latlng, name, category: cat, typeLabel, color });

          marker.bindTooltip(`<strong>${icon} ${name}</strong><br><small style="color: ${color};">${typeLabel}</small>`, {
            direction: "top",
            offset: [0, -8],
            opacity: 0.95
          });

          let detailsHtml = "";
          if (cat === "COMMERCIAL_SEAPORT") {
            detailsHtml = `
              <span class="grid-key">Annual Cargo Capacity:</span>
              <span class="grid-val"><strong style="color: #818cf8;">${p.annual_capacity_mmt} MMT</strong></span>
              <span class="grid-key">Maximum Draft:</span>
              <span class="grid-val">${p.max_draft_m} meters</span>
              <span class="grid-key">Berths Count:</span>
              <span class="grid-val">${p.berths_count} Berths</span>
              <span class="grid-key">Terminal Operator:</span>
              <span class="grid-val">${p.operator || p.authority}</span>
            `;
          } else if (cat === "COMMERCIAL_AIRPORT") {
            detailsHtml = `
              <span class="grid-key">IATA / ICAO Code:</span>
              <span class="grid-val"><strong style="color: #38bdf8;">${p.iata_code} / ${p.icao_code}</strong></span>
              <span class="grid-key">Runway Length:</span>
              <span class="grid-val">${p.runway_length_m} m (${p.runway_surface})</span>
              <span class="grid-key">Terminal Capacity:</span>
              <span class="grid-val">${p.terminal_capacity_mppa} MPPA</span>
              <span class="grid-key">Airport Operator:</span>
              <span class="grid-val">${p.operator || p.authority}</span>
            `;
          } else if (cat === "INDUSTRIAL_SEZ") {
            detailsHtml = `
              <span class="grid-key">Notified Area:</span>
              <span class="grid-val"><strong style="color: #fbbf24;">${p.area_sqkm ? p.area_sqkm + ' sq km' : (p.area_acres + ' acres')}</strong></span>
              <span class="grid-key">Anchor Sectors:</span>
              <span class="grid-val">${p.key_sectors}</span>
              <span class="grid-key">Nodal Developer:</span>
              <span class="grid-val">${p.developer || 'GIDC'}</span>
            `;
          } else if (cat === "MUNICIPAL_CORPORATION") {
            detailsHtml = `
              <span class="grid-key">Civic Area:</span>
              <span class="grid-val"><strong style="color: #22d3ee;">${p.area_sqkm} sq km</strong></span>
              <span class="grid-key">Population (2011 Census):</span>
              <span class="grid-val">${parseFloat(p.population_2011).toLocaleString()}</span>
              <span class="grid-key">Smart City Status:</span>
              <span class="grid-val">${p.smart_city_status ? 'Active Smart City Mission' : 'Municipal Corporation'}</span>
            `;
          }

          marker.bindPopup(`
            <div class="popup-card">
              <div class="popup-card-header">
                <span class="popup-category" style="background: ${badgeBg}; color: #fff;">${typeLabel.toUpperCase()}</span>
                <h4 class="popup-card-title">${icon} ${name}</h4>
              </div>
              <div class="popup-grid">
                ${detailsHtml}
                <span class="grid-key">Data Source:</span>
                <span class="grid-val">${p.source_org}</span>
              </div>
              <div class="popup-action-row">
                <button class="popup-btn-zoom" onclick="window.selectUrbanAssetByName('${name.replace(/'/g, "\\\\'")}', true)">
                  🔍 Zoom & Inspect
                </button>
              </div>
            </div>
          `, { maxWidth: 320 });

          marker.on("click", (e) => {
            if (e && e.originalEvent) {
              e.originalEvent._infraHandled = true;
              L.DomEvent.stopPropagation(e.originalEvent);
            }
            if (typeof selectUrbanAsset === "function") selectUrbanAsset(name, false);
            inspectAsset({
              properties: { ...p, asset_category: cat.toLowerCase() },
              geometry: feature.geometry,
              type: cat.toLowerCase()
            });
          });

          searchIndex.push({
            title: name,
            subtitle: `${typeLabel} • ${p.source_org || 'Gujarat'}`,
            type: "urban",
            category: typeLabel.toUpperCase(),
            badgeClass: cat === "COMMERCIAL_SEAPORT" ? "tag-port" : (cat === "COMMERCIAL_AIRPORT" ? "tag-airport" : "tag-industry"),
            icon: icon,
            priority: cat === "COMMERCIAL_SEAPORT" ? 95 : (cat === "COMMERCIAL_AIRPORT" ? 93 : 84),
            layerKey: targetGroup === layerGroups.portsAirports ? "portsAirports" : (targetGroup === layerGroups.industries ? "industries" : "urbanMetro"),
            searchTerms: [name, typeLabel, p.source_org, p.iata_code || "", p.operator || "", "port", "airport", "gidc", "sez", "smart city", "urban"].join(" ").toLowerCase(),
            urbanName: name,
            latlng: latlng,
            layer: marker
          });"""

new_urban_block = """        const p = feature.properties || {};
        const geom = feature.geometry || {};
        const rawCat = (p.asset_category || p.category || "").toLowerCase();
        const name = p.name || "Urban Asset";

        const isSeaport = rawCat === "seaport" || rawCat === "commercial_seaport";
        const isAirport = rawCat === "airport" || rawCat === "commercial_airport";
        const isIndustry = rawCat === "industrial_estate" || rawCat === "industrial_sez" || rawCat === "industry";
        const isMunicipal = rawCat === "municipal_corporation";

        if (geom.type === "Point") {
          const latlng = [geom.coordinates[1], geom.coordinates[0]];
          let targetGroup = layerGroups.urbanMetro;
          let paneName = "urbanMetroPane";
          let color = "#06b6d4";
          let radius = 7;
          let typeLabel = "Smart City";
          let badgeBg = "#0284c7";
          let icon = "🏙️";
          let canonicalCat = "municipal_corporation";

          if (isSeaport) {
            targetGroup = layerGroups.portsAirports;
            paneName = "portsAirportsPane";
            color = "#6366f1";
            badgeBg = "#4f46e5";
            typeLabel = "Commercial Seaport";
            icon = "⚓";
            canonicalCat = "commercial_seaport";
            const cap = parseFloat(p.capacity_mmt || p.annual_capacity_mmt) || 10;
            radius = Math.max(6, Math.min(14, Math.sqrt(cap) * 0.8));
            allPortsList.push({ name, latlng, properties: p, feature });
          } else if (isAirport) {
            targetGroup = layerGroups.portsAirports;
            paneName = "portsAirportsPane";
            color = "#0284c7";
            badgeBg = "#0369a1";
            typeLabel = "Commercial Airport";
            icon = "✈️";
            canonicalCat = "commercial_airport";
            radius = 7.5;
            allAirportsList.push({ name, latlng, properties: p, feature });
          } else if (isIndustry) {
            targetGroup = layerGroups.industries;
            paneName = "industryPane";
            color = "#f59e0b";
            badgeBg = "#d97706";
            typeLabel = "Mega GIDC / SEZ";
            icon = "🏭";
            canonicalCat = "industrial_sez";
            radius = 8.0;
          } else if (isMunicipal) {
            targetGroup = layerGroups.urbanMetro;
            paneName = "urbanMetroPane";
            color = "#06b6d4";
            badgeBg = "#0891b2";
            typeLabel = "Municipal Corporation";
            icon = "🏛️";
            canonicalCat = "municipal_corporation";
            radius = 8.5;
          }

          const marker = L.circleMarker(latlng, {
            pane: paneName,
            radius: radius,
            fillColor: color,
            color: "#ffffff",
            weight: 1.8,
            opacity: 0.95,
            fillOpacity: 0.92
          }).addTo(targetGroup);

          urbanAssetsByName[name] = { marker, feature, latlng, category: canonicalCat };
          allUrbanList.push({ marker, feature, latlng, name, category: canonicalCat, typeLabel, color });

          marker.bindTooltip(`<strong>${icon} ${name}</strong><br><small style="color: ${color};">${typeLabel}</small>`, {
            direction: "top",
            offset: [0, -8],
            opacity: 0.95
          });

          let detailsHtml = "";
          if (isSeaport) {
            const capVal = p.capacity_mmt || p.annual_capacity_mmt || "10";
            const draftVal = p.draft_m || p.max_draft_m || "12";
            const berthsVal = p.berths_count || p.berths || "—";
            const authVal = p.authority || p.operator || "Gujarat Maritime Board";
            detailsHtml = `
              <span class="grid-key">Annual Cargo Capacity:</span>
              <span class="grid-val"><strong style="color: #818cf8;">${capVal} MMT</strong></span>
              <span class="grid-key">Maximum Draft:</span>
              <span class="grid-val">${draftVal} meters</span>
              <span class="grid-key">Berths Count:</span>
              <span class="grid-val">${berthsVal} Berths</span>
              <span class="grid-key">Port Authority:</span>
              <span class="grid-val">${authVal}</span>
            `;
          } else if (isAirport) {
            const iataVal = p.iata || p.iata_code || "—";
            const icaoVal = p.icao || p.icao_code || "—";
            const runwayVal = p.runway_length_m ? `${p.runway_length_m} m` : "Operational";
            const paxVal = p.passenger_traffic_fy24 || (p.terminal_capacity_mppa ? `${p.terminal_capacity_mppa} MPPA` : "Commercial");
            const opVal = p.operator || p.authority || "Airports Authority of India (AAI)";
            detailsHtml = `
              <span class="grid-key">IATA / ICAO Code:</span>
              <span class="grid-val"><strong style="color: #38bdf8;">${iataVal} / ${icaoVal}</strong></span>
              <span class="grid-key">Runway Length:</span>
              <span class="grid-val">${runwayVal}</span>
              <span class="grid-key">Traffic / Capacity:</span>
              <span class="grid-val">${paxVal}</span>
              <span class="grid-key">Airport Operator:</span>
              <span class="grid-val">${opVal}</span>
            `;
          } else if (isIndustry) {
            const areaVal = p.area_sqkm ? `${p.area_sqkm} sq km` : (p.area_acres ? `${p.area_acres} acres` : "—");
            const focusVal = p.focus || p.key_sectors || "Industrial Manufacturing";
            const devVal = p.governing_body || p.developer || "GIDC";
            detailsHtml = `
              <span class="grid-key">Notified Area:</span>
              <span class="grid-val"><strong style="color: #fbbf24;">${areaVal}</strong></span>
              <span class="grid-key">Anchor Focus:</span>
              <span class="grid-val">${focusVal}</span>
              <span class="grid-key">Nodal Developer:</span>
              <span class="grid-val">${devVal}</span>
            `;
          } else if (isMunicipal) {
            detailsHtml = `
              <span class="grid-key">Civic Area:</span>
              <span class="grid-val"><strong style="color: #22d3ee;">${p.area_sqkm || '—'} sq km</strong></span>
              <span class="grid-key">Population (2011 Census):</span>
              <span class="grid-val">${p.population_2011 ? parseFloat(p.population_2011).toLocaleString() : '—'}</span>
              <span class="grid-key">Smart City Status:</span>
              <span class="grid-val">${p.smart_city_status || 'Municipal Corporation'}</span>
            `;
          }

          marker.bindPopup(`
            <div class="popup-card">
              <div class="popup-card-header">
                <span class="popup-category" style="background: ${badgeBg}; color: #fff;">${typeLabel.toUpperCase()}</span>
                <h4 class="popup-card-title">${icon} ${name}</h4>
              </div>
              <div class="popup-grid">
                ${detailsHtml}
                <span class="grid-key">Data Source:</span>
                <span class="grid-val">${p.source_org}</span>
              </div>
              <div class="popup-action-row">
                <button class="popup-btn-zoom" onclick="window.selectUrbanAssetByName('${name.replace(/'/g, "\\\\'")}', true)">
                  🔍 Zoom & Inspect
                </button>
              </div>
            </div>
          `, { maxWidth: 320 });

          marker.on("click", (e) => {
            if (e && e.originalEvent) {
              e.originalEvent._infraHandled = true;
              L.DomEvent.stopPropagation(e.originalEvent);
            }
            if (typeof selectUrbanAsset === "function") selectUrbanAsset(name, false);
            inspectAsset({
              properties: { ...p, asset_category: canonicalCat },
              geometry: feature.geometry,
              type: canonicalCat
            });
          });

          searchIndex.push({
            title: name,
            subtitle: `${typeLabel} • ${p.source_org || 'Gujarat'}`,
            type: "urban",
            category: typeLabel.toUpperCase(),
            badgeClass: isSeaport ? "tag-port" : (isAirport ? "tag-airport" : (isIndustry ? "tag-industry" : "tag-urban")),
            icon: icon,
            priority: isSeaport ? 95 : (isAirport ? 93 : (isIndustry ? 84 : 75)),
            layerKey: targetGroup === layerGroups.portsAirports ? "portsAirports" : (targetGroup === layerGroups.industries ? "industries" : "urbanMetro"),
            searchTerms: [name, typeLabel, p.source_org, p.iata || p.iata_code || "", p.operator || p.authority || "", "port", "airport", "gidc", "sez", "smart city", "urban"].join(" ").toLowerCase(),
            urbanName: name,
            latlng: latlng,
            layer: marker
          });"""

assert old_urban_block in content, "old_urban_block not found in js/app.js!"
content = content.replace(old_urban_block, new_urban_block)

# 2. Fix selectUrbanAsset and filterUrbanByType
old_select_block = """    let group = layerGroups.urbanMetro;
    let toggleId = "layerUrbanMetro";
    if (category === "COMMERCIAL_SEAPORT" || category === "COMMERCIAL_AIRPORT") {
      group = layerGroups.portsAirports;
      toggleId = "layerPortsAirports";
    } else if (category === "INDUSTRIAL_SEZ") {
      group = layerGroups.industries;
      toggleId = "layerIndustries";
    }
    if (!map.hasLayer(group)) {
      map.addLayer(group);
      const chk = document.getElementById(toggleId);
      if (chk) chk.checked = true;
      updateActiveLayersCount();
    }
    switchInspectorTab("tabUrban");

    activeHighlightedUrban = name;

    if (zoom) {
      map.flyTo(latlng, 13, { duration: 1.2 });
      setTimeout(() => marker.openPopup(), 450);
    } else {
      marker.openPopup();
    }

    const telemetry = document.getElementById("urbanTelemetry");
    const urbanTelName = document.getElementById("urbanTelName");
    const urbanTelBadge = document.getElementById("urbanTelBadge");
    const urbanTelAuthority = document.getElementById("urbanTelAuthority");
    const urbanTelMetric1 = document.getElementById("urbanTelMetric1");
    const urbanTelLbl1 = document.getElementById("urbanTelLbl1");
    const urbanTelMetric2 = document.getElementById("urbanTelMetric2");
    const urbanTelLbl2 = document.getElementById("urbanTelLbl2");
    const urbanTelStatus = document.getElementById("urbanTelStatus");
    const urbanSelect = document.getElementById("urbanSelect");

    if (telemetry) telemetry.classList.remove("hidden");
    if (urbanTelName) urbanTelName.textContent = name;
    if (urbanSelect && urbanSelect.value !== name) urbanSelect.value = name;

    if (category === "COMMERCIAL_SEAPORT") {
      if (urbanTelBadge) { urbanTelBadge.textContent = `${p.annual_capacity_mmt} MMT`; urbanTelBadge.style.background = "#4f46e5"; }
      if (urbanTelAuthority) urbanTelAuthority.textContent = `${p.operator || p.authority} — Maritime Gateway`;
      if (urbanTelMetric1) urbanTelMetric1.textContent = `${p.max_draft_m} m`;
      if (urbanTelLbl1) urbanTelLbl1.textContent = "Draft Depth";
      if (urbanTelMetric2) urbanTelMetric2.textContent = `${p.berths_count}`;
      if (urbanTelLbl2) urbanTelLbl2.textContent = "Berths Count";
      if (urbanTelStatus) urbanTelStatus.textContent = "Operational";
    } else if (category === "COMMERCIAL_AIRPORT") {
      if (urbanTelBadge) { urbanTelBadge.textContent = `${p.iata_code} / ${p.icao_code}`; urbanTelBadge.style.background = "#0284c7"; }
      if (urbanTelAuthority) urbanTelAuthority.textContent = `${p.operator || p.authority} — Aviation Infrastructure`;
      if (urbanTelMetric1) urbanTelMetric1.textContent = `${p.runway_length_m} m`;
      if (urbanTelLbl1) urbanTelLbl1.textContent = "Runway Length";
      if (urbanTelMetric2) urbanTelMetric2.textContent = `${p.terminal_capacity_mppa} MPPA`;
      if (urbanTelLbl2) urbanTelLbl2.textContent = "Pax Capacity";
      if (urbanTelStatus) urbanTelStatus.textContent = p.airport_type || "Commercial";
    } else if (category === "INDUSTRIAL_SEZ") {
      if (urbanTelBadge) { urbanTelBadge.textContent = p.area_sqkm ? `${p.area_sqkm} sq km` : `${p.area_acres} ac`; urbanTelBadge.style.background = "#d97706"; }
      if (urbanTelAuthority) urbanTelAuthority.textContent = `${p.developer || 'GIDC'} — Industrial Hub`;
      if (urbanTelMetric1) urbanTelMetric1.textContent = p.area_sqkm ? `${p.area_sqkm} km²` : '—';
      if (urbanTelLbl1) urbanTelLbl1.textContent = "Notified Area";
      if (urbanTelMetric2) urbanTelMetric2.textContent = (p.anchor_units || "").split(",")[0] || "Multiple";
      if (urbanTelLbl2) urbanTelLbl2.textContent = "Anchor Units";
      if (urbanTelStatus) urbanTelStatus.textContent = p.status || "Active";
    } else if (category === "MUNICIPAL_CORPORATION") {
      if (urbanTelBadge) { urbanTelBadge.textContent = `${p.area_sqkm} sq km`; urbanTelBadge.style.background = "#0891b2"; }
      if (urbanTelAuthority) urbanTelAuthority.textContent = `${name} — Urban Governance`;
      if (urbanTelMetric1) urbanTelMetric1.textContent = `${(parseFloat(p.population_2011) / 1e6).toFixed(2)}M`;
      if (urbanTelLbl1) urbanTelLbl1.textContent = "Population";
      if (urbanTelMetric2) urbanTelMetric2.textContent = `${p.area_sqkm} km²`;
      if (urbanTelLbl2) urbanTelLbl2.textContent = "Area";
      if (urbanTelStatus) urbanTelStatus.textContent = p.smart_city_status ? "Smart City" : "Corporation";
    }

    inspectAsset({
      properties: { ...p, name: name, asset_category: category ? category.toLowerCase() : "industrial_sez" },
      geometry: feature.geometry,
      type: category ? category.toLowerCase() : "industrial_sez"
    });
  }

  function clearUrbanFocus(resetDropdown = true) {
    activeHighlightedUrban = null;
    const telemetry = document.getElementById("urbanTelemetry");
    const urbanSelect = document.getElementById("urbanSelect");
    if (telemetry) telemetry.classList.add("hidden");
    if (resetDropdown && urbanSelect) urbanSelect.value = "";
  }

  function filterUrbanByType(type) {
    allUrbanList.forEach(({ marker, category }) => {
      let match = (type === "all");
      if (type === "seaport" && category === "COMMERCIAL_SEAPORT") match = true;
      else if (type === "airport" && category === "COMMERCIAL_AIRPORT") match = true;
      else if (type === "industrial_estate" && category === "INDUSTRIAL_SEZ") match = true;
      else if (type === "municipal_corporation" && category === "MUNICIPAL_CORPORATION") match = true;"""

new_select_block = """    const catKey = (category || "").toLowerCase();
    const isSeaport = catKey === "seaport" || catKey === "commercial_seaport";
    const isAirport = catKey === "airport" || catKey === "commercial_airport";
    const isIndustry = catKey === "industrial_estate" || catKey === "industrial_sez" || catKey === "industry";
    const isMunicipal = catKey === "municipal_corporation";

    let group = layerGroups.urbanMetro;
    let toggleId = "layerUrbanMetro";
    if (isSeaport || isAirport) {
      group = layerGroups.portsAirports;
      toggleId = "layerPortsAirports";
    } else if (isIndustry) {
      group = layerGroups.industries;
      toggleId = "layerIndustries";
    }
    if (!map.hasLayer(group)) {
      map.addLayer(group);
      const chk = document.getElementById(toggleId);
      if (chk) chk.checked = true;
      updateActiveLayersCount();
    }
    switchInspectorTab("tabUrban");

    activeHighlightedUrban = name;

    if (zoom) {
      map.flyTo(latlng, 13, { duration: 1.2 });
      setTimeout(() => marker.openPopup(), 450);
    } else {
      marker.openPopup();
    }

    const telemetry = document.getElementById("urbanTelemetry");
    const urbanTelName = document.getElementById("urbanTelName");
    const urbanTelBadge = document.getElementById("urbanTelBadge");
    const urbanTelAuthority = document.getElementById("urbanTelAuthority");
    const urbanTelMetric1 = document.getElementById("urbanTelMetric1");
    const urbanTelLbl1 = document.getElementById("urbanTelLbl1");
    const urbanTelMetric2 = document.getElementById("urbanTelMetric2");
    const urbanTelLbl2 = document.getElementById("urbanTelLbl2");
    const urbanTelStatus = document.getElementById("urbanTelStatus");
    const urbanSelect = document.getElementById("urbanSelect");

    if (telemetry) telemetry.classList.remove("hidden");
    if (urbanTelName) urbanTelName.textContent = name;
    if (urbanSelect && urbanSelect.value !== name) urbanSelect.value = name;

    if (isSeaport) {
      const cap = p.capacity_mmt || p.annual_capacity_mmt || "10";
      const draft = p.draft_m || p.max_draft_m || "12";
      const berths = p.berths_count || p.berths || "—";
      const auth = p.authority || p.operator || "Gujarat Maritime Board";
      if (urbanTelBadge) { urbanTelBadge.textContent = `${cap} MMT`; urbanTelBadge.style.background = "#4f46e5"; }
      if (urbanTelAuthority) urbanTelAuthority.textContent = `${auth} — Maritime Gateway`;
      if (urbanTelMetric1) urbanTelMetric1.textContent = `${draft} m`;
      if (urbanTelLbl1) urbanTelLbl1.textContent = "Draft Depth";
      if (urbanTelMetric2) urbanTelMetric2.textContent = `${berths}`;
      if (urbanTelLbl2) urbanTelLbl2.textContent = "Berths Count";
      if (urbanTelStatus) urbanTelStatus.textContent = p.status || "Operational";
    } else if (isAirport) {
      const iataCode = p.iata || p.iata_code || "—";
      const icaoCode = p.icao || p.icao_code || "—";
      const op = p.operator || p.authority || "Airports Authority of India (AAI)";
      const rwy = p.runway_length_m ? `${p.runway_length_m} m` : "3,500 m";
      const pax = p.passenger_traffic_fy24 || (p.terminal_capacity_mppa ? `${p.terminal_capacity_mppa} MPPA` : "Commercial Operations");
      if (urbanTelBadge) { urbanTelBadge.textContent = `${iataCode} / ${icaoCode}`; urbanTelBadge.style.background = "#0284c7"; }
      if (urbanTelAuthority) urbanTelAuthority.textContent = `${op} — Aviation Infrastructure`;
      if (urbanTelMetric1) urbanTelMetric1.textContent = rwy;
      if (urbanTelLbl1) urbanTelLbl1.textContent = "Runway Length";
      if (urbanTelMetric2) urbanTelMetric2.textContent = pax;
      if (urbanTelLbl2) urbanTelLbl2.textContent = "Traffic / Capacity";
      if (urbanTelStatus) urbanTelStatus.textContent = p.status || "Operational";
    } else if (isIndustry) {
      const area = p.area_sqkm ? `${p.area_sqkm} sq km` : (p.area_acres ? `${p.area_acres} ac` : "—");
      const dev = p.governing_body || p.developer || "GIDC";
      const focus = p.focus || p.key_sectors || "Industrial Estate";
      if (urbanTelBadge) { urbanTelBadge.textContent = area; urbanTelBadge.style.background = "#d97706"; }
      if (urbanTelAuthority) urbanTelAuthority.textContent = `${dev} — Industrial Hub`;
      if (urbanTelMetric1) urbanTelMetric1.textContent = p.area_sqkm ? `${p.area_sqkm} km²` : '—';
      if (urbanTelLbl1) urbanTelLbl1.textContent = "Notified Area";
      if (urbanTelMetric2) urbanTelMetric2.textContent = (p.notable_units || p.anchor_units || focus).split(",")[0] || "Multiple Units";
      if (urbanTelLbl2) urbanTelLbl2.textContent = "Anchor Units";
      if (urbanTelStatus) urbanTelStatus.textContent = p.status || "Active";
    } else if (isMunicipal) {
      if (urbanTelBadge) { urbanTelBadge.textContent = `${p.area_sqkm || '—'} sq km`; urbanTelBadge.style.background = "#0891b2"; }
      if (urbanTelAuthority) urbanTelAuthority.textContent = `${name} — Urban Governance`;
      if (urbanTelMetric1) urbanTelMetric1.textContent = p.population_2011 ? `${(parseFloat(p.population_2011) / 1e6).toFixed(2)}M` : '—';
      if (urbanTelLbl1) urbanTelLbl1.textContent = "Population";
      if (urbanTelMetric2) urbanTelMetric2.textContent = `${p.area_sqkm || '—'} km²`;
      if (urbanTelLbl2) urbanTelLbl2.textContent = "Area";
      if (urbanTelStatus) urbanTelStatus.textContent = p.smart_city_status || "Municipal Corporation";
    }

    const canonicalType = isSeaport ? "commercial_seaport" : (isAirport ? "commercial_airport" : (isIndustry ? "industrial_sez" : "municipal_corporation"));
    inspectAsset({
      properties: { ...p, name: name, asset_category: canonicalType },
      geometry: feature.geometry,
      type: canonicalType
    });
  }

  function clearUrbanFocus(resetDropdown = true) {
    activeHighlightedUrban = null;
    const telemetry = document.getElementById("urbanTelemetry");
    const urbanSelect = document.getElementById("urbanSelect");
    if (telemetry) telemetry.classList.add("hidden");
    if (resetDropdown && urbanSelect) urbanSelect.value = "";
  }

  function filterUrbanByType(type) {
    allUrbanList.forEach(({ marker, category }) => {
      const c = (category || "").toLowerCase();
      let match = (type === "all");
      if (type === "seaport" && (c === "seaport" || c === "commercial_seaport")) match = true;
      else if (type === "airport" && (c === "airport" || c === "commercial_airport")) match = true;
      else if (type === "industrial_estate" && (c === "industrial_estate" || c === "industrial_sez" || c === "industry")) match = true;
      else if (type === "municipal_corporation" && c === "municipal_corporation") match = true;"""

assert old_select_block in content, "old_select_block not found in js/app.js!"
content = content.replace(old_select_block, new_select_block)

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully patched js/app.js with normalized seaport and airport categories!")
