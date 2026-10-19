import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useAtlasStore } from '../../stores/useAtlasStore';
import { GUJARAT_34_DISTRICTS } from '../../data/passport-districts';
import { VERIFIED_TOURIST_DESTINATIONS } from '../../data/tourist-destinations';
import { GUJARAT_HIGHWAY_EV_STATIONS } from '../../data/ev-stations';
import { getRegionalCulture } from '../../utils/cultural-regions';
import unfilteredStoriesRaw from '../../../data/gujarat_unfiltered.json';
import { 
  Award, 
  MapPin, 
  Compass, 
  Sparkles, 
  Zap, 
  Layers, 
  ExternalLink, 
  Clock, 
  Ticket, 
  ShieldCheck,
  AlertTriangle,
  X,
  BatteryCharging,
  Sun,
  Coffee,
  HelpCircle
} from 'lucide-react';

interface StoryItem {
  id: string;
  name: string;
  gujaratiName?: string;
  district: string;
  tagline: string;
  theGroundReality: string;
  theFolklore: string;
  factCheckBadge?: string;
  coordinates: [number, number]; // [lng, lat]
  imageUrl: string;
}

function escapeHtml(str: any): string {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export const AtlasMap: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  
  // Layer groups refs
  const districtLayerRef = useRef<L.LayerGroup | null>(null);
  const touristLayerRef = useRef<L.LayerGroup | null>(null);
  const storyLayerRef = useRef<L.LayerGroup | null>(null);
  const evLayerRef = useRef<L.LayerGroup | null>(null);
  const geojsonBoundaryRef = useRef<L.GeoJSON | null>(null);

  const { theme, userProfile, claimDistrictStamp, setMode } = useAtlasStore();

  // Map readiness state ensures markers populate cleanly without race condition
  const [mapReady, setMapReady] = useState(false);

  // Layer Visibility State
  const [showDistricts, setShowDistricts] = useState(true);
  const [showTourist, setShowTourist] = useState(true);
  const [showStories, setShowStories] = useState(true);
  const [showEV, setShowEV] = useState(true);

  // Embedded EV Highway Radar Drawer State
  const [evRadarOpen, setEvRadarOpen] = useState(false);
  const [evFilterDgOnly, setEvFilterDgOnly] = useState(false);
  const [evFilterFastOnly, setEvFilterFastOnly] = useState(false);
  const [evSelectedCorridor, setEvSelectedCorridor] = useState<string>('all');
  const [troubleshootStationId, setTroubleshootStationId] = useState<string | null>(null);

  const stories: StoryItem[] = (unfilteredStoriesRaw as any).stories || (unfilteredStoriesRaw as unknown as StoryItem[]);

  const corridors = [
    { id: 'all', label: 'All Corridors', center: [22.40, 71.80] as [number, number], zoom: 7.4 },
    { id: 'NE-1', label: 'NE-1 (Ahmd–Vdr)', center: [22.65, 72.85] as [number, number], zoom: 10 },
    { id: 'NH-48', label: 'NH-48 (Surat–Vapi)', center: [21.05, 72.95] as [number, number], zoom: 9.5 },
    { id: 'NH-47', label: 'Saurashtra & Dwarka', center: [22.25, 70.30] as [number, number], zoom: 8.5 },
    { id: 'Kutch', label: 'Kutch Desert Route', center: [23.65, 70.10] as [number, number], zoom: 9 },
    { id: 'Dang', label: 'Dang Forest & Saputara', center: [20.75, 73.65] as [number, number], zoom: 9.5 }
  ];

  const flyToCorridor = (corridorId: string) => {
    setEvSelectedCorridor(corridorId);
    setShowEV(true);
    const target = corridors.find(c => c.id === corridorId);
    if (target && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(target.center, target.zoom, { duration: 1.2 });
    }
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // 1. Strict Boundary Locking to Gujarat (Survey of India Alignment)
      const gujaratBounds = L.latLngBounds(
        L.latLng(19.8, 67.5),
        L.latLng(24.9, 74.8)
      );

      const map = L.map(mapContainerRef.current, {
        center: [22.40, 71.80],
        zoom: 7.4,
        minZoom: 6.8,
        maxZoom: 18,
        maxBounds: gujaratBounds,
        maxBoundsViscosity: 1.0,
        zoomControl: false,
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Clean Humanitarian Basemap with Survey of India Alignment attribution
      L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap | Survey of India Alignment | Gujarat Atlas',
        subdomains: ['a', 'b', 'c'],
        maxZoom: 19,
      }).addTo(map);

      // Initialize Layer Groups
      districtLayerRef.current = L.layerGroup().addTo(map);
      touristLayerRef.current = L.layerGroup().addTo(map);
      storyLayerRef.current = L.layerGroup().addTo(map);
      evLayerRef.current = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;

      // 2. Load and render official Gujarat Administrative District Polygons
      fetch('/data/gujarat_districts.geojson')
        .then(res => res.json())
        .then(geojsonData => {
          if (!mapInstanceRef.current) return;
          geojsonBoundaryRef.current = L.geoJSON(geojsonData, {
            style: {
              color: '#9a3412',
              weight: 1.8,
              opacity: 0.85,
              fillColor: '#d97706',
              fillOpacity: 0.04,
              dashArray: '3 3'
            },
            onEachFeature: (feature, layer) => {
              const dName = feature.properties?.district || 'District';
              const dGu = feature.properties?.district_gu || '';
              layer.bindTooltip(`
                <div style="font-family: 'Noto Sans Gujarati', sans-serif; font-weight: bold; font-size: 11px; color: #1e293b;">
                  ${dName} ${dGu ? `(${dGu})` : ''}
                </div>
              `, { sticky: true });
            }
          }).addTo(mapInstanceRef.current);
        })
        .catch(err => console.warn('District boundary polygon load note:', err));

      // Global callbacks for popups
      (window as unknown as { claimFromMap: (id: string) => void }).claimFromMap = (id: string) => {
        claimDistrictStamp(id);
      };
      (window as unknown as { viewStoriesFromMap: () => void }).viewStoriesFromMap = () => {
        setMode('unfiltered');
      };
      (window as unknown as { viewDestinationsFromMap: () => void }).viewDestinationsFromMap = () => {
        setMode('places');
      };

      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
          setMapReady(true);
        }
      }, 150);
    }
  }, [claimDistrictStamp, setMode]);

  // Update Pins when state changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapReady) return;

    // --- 1. District Passport Hubs Layer ---
    if (districtLayerRef.current) {
      districtLayerRef.current.clearLayers();
      if (showDistricts) {
        GUJARAT_34_DISTRICTS.forEach((d) => {
          const isStamped = userProfile.collectedStampIds.includes(d.id);
          const icon = L.divIcon({
            className: 'passport-pin',
            html: `
              <div style="
                width: 36px;
                height: 36px;
                background: ${isStamped ? '#9a3412' : '#1e293b'};
                color: #ffffff;
                border: 2px solid ${isStamped ? '#f59e0b' : '#64748b'};
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 17px;
                box-shadow: 2px 2px 0px rgba(0,0,0,0.6);
                cursor: pointer;
                transform: translate(-50%, -50%);
              ">
                ${d.icon}
              </div>
            `,
            iconSize: [36, 36],
            iconAnchor: [18, 18],
          });

          const culture = getRegionalCulture(d.region || d.name);
          const m = L.marker(d.coordinates, { icon }).addTo(districtLayerRef.current!);
          m.bindPopup(`
            <div style="font-family: 'Manrope', -apple-system, sans-serif; min-width: 260px; max-width: 300px; color: #1c1917; overflow: hidden; border-radius: 10px;">
              <div style="height: 4px; background: ${culture.borderTrimStyle}; width: 100%;"></div>
              <div style="padding: 12px 14px 14px 14px;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                  <span style="font-size: 10px; font-weight: 800; color: #9a3412; text-transform: uppercase; font-family: monospace; letter-spacing: 0.05em;">
                    ${culture.primaryIcon} ${d.region} • ${isStamped ? '✓ STAMPED' : 'UNVISITED'}
                  </span>
                  <span style="font-size: 9px; font-weight: 600; color: #78716c; font-family: 'Noto Sans Gujarati', sans-serif;">
                    ${culture.gujaratiTitle}
                  </span>
                </div>
                <h3 style="margin: 2px 0 3px 0; font-size: 16px; font-weight: 800; color: #0f172a; font-family: 'Lora', serif;">
                  ${d.name} <span style="font-family: 'Noto Sans Gujarati', sans-serif; font-weight: 600; color: #b45309; font-size: 14px;">(${d.gujaratiName})</span>
                </h3>
                <p style="margin: 2px 0 8px 0; font-size: 11px; font-weight: 600; color: #57534e; line-height: 1.35;">
                  📍 ${d.landmark}
                </p>
                <div style="font-size: 10px; color: #78716c; background: #f5f0e6; padding: 4px 8px; border-radius: 5px; border: 1px solid #e7dfd3; margin-bottom: 10px; font-family: monospace;">
                  ${culture.culturalTag}
                </div>
                <button onclick="window.claimFromMap('${d.id}')" style="
                  width: 100%; padding: 8px; background: ${isStamped ? '#15803d' : 'linear-gradient(135deg, #d97706 0%, #b45309 100%)'};
                  color: #fff; font-weight: 800; font-size: 11px; border: 1px solid ${isStamped ? '#14532d' : '#78350f'};
                  border-radius: 6px; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.15);
                ">
                  ${isStamped ? '✓ Stamped in Digital Passport' : '★ Stamp This District in Passport'}
                </button>
              </div>
            </div>
          `, { className: 'ethnic-leaflet-popup', maxWidth: 310, minWidth: 260 });
        });
      }
    }

    // --- 2. 🏛️ Tourist Destinations Layer ---
    if (touristLayerRef.current) {
      touristLayerRef.current.clearLayers();
      if (showTourist) {
        VERIFIED_TOURIST_DESTINATIONS.forEach((place) => {
          const icon = L.divIcon({
            className: 'tourist-pin',
            html: `
              <div style="
                width: 36px;
                height: 36px;
                background: linear-gradient(135deg, #b45309 0%, #9a3412 100%);
                color: #fef3c7;
                border: 2px solid #f59e0b;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 2px 3px 0px rgba(0,0,0,0.6);
                font-size: 17px;
                cursor: pointer;
                transform: translate(-50%, -50%);
              ">
                🏛️
              </div>
            `,
            iconSize: [36, 36],
            iconAnchor: [18, 18],
          });

          const culture = getRegionalCulture(place.district || place.region);
          const isDeadZone = place.district.toLowerCase() === 'kachchh' || place.district.toLowerCase() === 'the dangs';
          const timingsDisplay = place.timings ? place.timings.split('(')[0].trim() : '08:00 – 18:00';
          const feeDisplay = place.entryFee ? place.entryFee.split(';')[0].replace('Basic Entry: ', '').trim() : 'Free / ASI';

          const m = L.marker(place.coordinates, { icon }).addTo(touristLayerRef.current!);
          m.bindPopup(`
            <div style="font-family: 'Manrope', -apple-system, sans-serif; min-width: 285px; max-width: 325px; color: #1c1917; overflow: hidden; border-radius: 10px;">
              <div style="height: 4px; background: ${culture.borderTrimStyle}; width: 100%;"></div>
              
              <div style="padding: 10px 14px 12px 14px;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                  <span style="font-size: 10px; font-weight: 800; color: #9a3412; text-transform: uppercase; font-family: monospace; letter-spacing: 0.05em;">
                    ${culture.primaryIcon} ${escapeHtml(place.district)} • ASI &amp; Tourism
                  </span>
                  <span style="font-size: 9px; font-weight: 600; color: #78716c; font-family: 'Noto Sans Gujarati', sans-serif;">
                    ${escapeHtml(culture.gujaratiTitle)}
                  </span>
                </div>

                <h3 style="margin: 0 0 4px 0; font-size: 15px; font-weight: 800; color: #0f172a; line-height: 1.25; font-family: 'Lora', serif;">
                  ${escapeHtml(place.name)}
                </h3>

                ${place.image ? `
                  <div style="position: relative; width: 100%; height: 155px; overflow: hidden; border-radius: 8px; margin: 6px 0; background: #1c1917; border: 1px solid #e7dfd3;">
                    <img 
                      src="${place.image}" 
                      alt="${escapeHtml(place.name)}" 
                      referrerpolicy="no-referrer"
                      style="width: 100%; height: 100%; object-fit: cover; object-position: center center; display: block;" 
                      onerror="this.onerror=null; this.src='/images/destinations/statue-of-unity.jpg';"
                    />
                    <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, transparent 40%, rgba(0,0,0,0.65) 100%); pointer-events: none;"></div>
                    <div style="position: absolute; bottom: 6px; left: 8px; right: 8px; display: flex; align-items: center; justify-content: space-between; font-size: 10px; font-weight: 700; color: #fff; text-shadow: 0 1px 3px rgba(0,0,0,0.9);">
                      <span>🏛️ ${escapeHtml(place.district)}</span>
                      <span style="background: rgba(0,0,0,0.65); padding: 1.5px 6px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.25); font-size: 9px; font-family: monospace;">${escapeHtml(place.categoryLabel || 'Heritage')}</span>
                    </div>
                  </div>
                ` : ''}

                <p style="margin: 4px 0 6px 0; font-size: 11px; color: #44403c; line-height: 1.35;">
                  ${escapeHtml(place.summary.slice(0, 115))}...
                </p>

                <!-- Key Logistics Chips -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin: 6px 0; font-size: 10px; font-family: monospace;">
                  <div style="background: #f5f0e6; padding: 4px 6px; border-radius: 5px; border: 1px solid #e7dfd3; color: #44403c; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                    🕒 ${escapeHtml(timingsDisplay)}
                  </div>
                  <div style="background: #f5f0e6; padding: 4px 6px; border-radius: 5px; border: 1px solid #e7dfd3; color: #44403c; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                    🎟️ ${escapeHtml(feeDisplay)}
                  </div>
                </div>

                <!-- EV Reachability Status -->
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 3px 7px; border-radius: 5px; background: ${isDeadZone ? '#fef2f2' : '#f0fdf4'}; border: 1px solid ${isDeadZone ? '#fecaca' : '#bbf7d0'}; font-size: 10px; font-family: monospace; margin-bottom: 8px;">
                  <span style="color: ${isDeadZone ? '#991b1b' : '#166534'}; font-weight: 700;">
                    ${isDeadZone ? '⚠️ Remote Dead Zone: Top-up battery' : '⚡ EV Ready: Fast Charger < 45km'}
                  </span>
                  <span style="font-size: 9px; color: #64748b;">${isDeadZone ? 'Remote' : '60-180kW'}</span>
                </div>

                <button onclick="window.viewDestinationsFromMap()" style="
                  width: 100%; padding: 8px; background: linear-gradient(135deg, #b45309 0%, #9a3412 100%);
                  color: #fff; font-weight: 800; font-size: 11px; border: 1px solid #78350f;
                  border-radius: 6px; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.15);
                  display: flex; align-items: center; justify-content: center; gap: 4px;
                ">
                  <span>Explore Destination Details</span> <span>→</span>
                </button>
              </div>
            </div>
          `, { className: 'ethnic-leaflet-popup', maxWidth: 325, minWidth: 285 });
        });
      }
    }

    // --- 3. 📜 Unfiltered Stories Layer ---
    if (storyLayerRef.current) {
      storyLayerRef.current.clearLayers();
      if (showStories) {
        stories.forEach((story) => {
          const coords: [number, number] = [story.coordinates[1], story.coordinates[0]];
          const icon = L.divIcon({
            className: 'story-pin',
            html: `
              <div style="
                width: 36px;
                height: 36px;
                background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
                color: #fde047;
                border: 2px solid #991b1b;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 2px 3px 0px rgba(0,0,0,0.6);
                font-size: 17px;
                cursor: pointer;
                transform: translate(-50%, -50%);
              ">
                📜
              </div>
            `,
            iconSize: [36, 36],
            iconAnchor: [18, 18],
          });

          const culture = getRegionalCulture(story.district);
          const m = L.marker(coords, { icon }).addTo(storyLayerRef.current!);
          m.bindPopup(`
            <div style="font-family: 'Manrope', -apple-system, sans-serif; min-width: 285px; max-width: 325px; color: #1c1917; overflow: hidden; border-radius: 10px;">
              <div style="height: 4px; background: ${culture.borderTrimStyle}; width: 100%;"></div>

              <div style="padding: 10px 14px 12px 14px;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                  <span style="font-size: 10px; font-weight: 800; color: #991b1b; text-transform: uppercase; font-family: monospace; letter-spacing: 0.05em;">
                    ${culture.primaryIcon} ${story.district} • Unfiltered Dossier
                  </span>
                  <span style="font-size: 9px; font-weight: 600; color: #78716c; font-family: 'Noto Sans Gujarati', sans-serif;">
                    ${culture.gujaratiTitle}
                  </span>
                </div>

                <h3 style="margin: 0 0 2px 0; font-size: 15px; font-weight: 800; color: #0f172a; font-family: 'Lora', serif;">
                  ${story.name}
                </h3>
                ${story.gujaratiName ? `<div style="font-size: 11px; color: #b45309; margin-bottom: 4px; font-family: 'Noto Sans Gujarati', sans-serif; font-weight: 600;">${story.gujaratiName}</div>` : ''}

                ${story.imageUrl ? `
                  <div style="position: relative; width: 100%; height: 145px; overflow: hidden; border-radius: 8px; margin: 6px 0; background: #1c1917; border: 1px solid #e7dfd3;">
                    <img 
                      src="${story.imageUrl}" 
                      alt="${story.name}" 
                      style="width: 100%; height: 100%; object-fit: cover; object-position: center 25%; display: block;" 
                      onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1599837565318-67429bde7162?w=800&auto=format&fit=crop&q=80';"
                    />
                    <div style="position: absolute; inset: 0; background: linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.65) 100%); pointer-events: none;"></div>
                    <div style="position: absolute; bottom: 6px; left: 8px; font-size: 9px; font-family: monospace; background: rgba(0,0,0,0.7); color: #fde047; padding: 2px 6px; border-radius: 4px; border: 1px solid rgba(253,224,71,0.3);">
                      ⚖️ Forensic Ground Reality
                    </div>
                  </div>
                ` : ''}

                <p style="margin: 4px 0 6px 0; font-size: 11px; color: #44403c; line-height: 1.35;">
                  ${story.tagline}
                </p>

                <div style="padding: 6px 8px; background: #fdfbf7; border-left: 3px solid #991b1b; border: 1px solid #e7dfd3; border-left-width: 3px; font-size: 10px; color: #1c1917; margin-bottom: 8px; border-radius: 4px;">
                  <strong style="color: #991b1b;">Ground Reality:</strong> ${story.theGroundReality.slice(0, 95)}...
                </div>

                <button onclick="window.viewStoriesFromMap()" style="
                  width: 100%; padding: 8px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
                  color: #fde047; font-weight: 800; font-size: 11px; border: 1px solid #991b1b;
                  border-radius: 6px; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                  display: flex; align-items: center; justify-content: center; gap: 4px;
                ">
                  <span>Read Full Folklore vs Reality</span> <span>→</span>
                </button>
              </div>
            </div>
          `, { className: 'ethnic-leaflet-popup', maxWidth: 325, minWidth: 285 });
        });
      }
    }

    // --- 4. ⚡ EV Highway Fast Chargers Layer (with Dynamic Filter) ---
    if (evLayerRef.current) {
      evLayerRef.current.clearLayers();
      if (showEV) {
        const filteredStations = GUJARAT_HIGHWAY_EV_STATIONS.filter((st) => {
          if (evFilterDgOnly && !st.hasDgBackup) return false;
          if (evFilterFastOnly && st.totalPowerKw < 120) return false;
          if (evSelectedCorridor !== 'all' && !st.corridor.toLowerCase().includes(evSelectedCorridor.toLowerCase())) return false;
          return true;
        });

        filteredStations.forEach((station) => {
          const icon = L.divIcon({
            className: 'ev-pin',
            html: `
              <div style="
                width: 34px;
                height: 34px;
                background: linear-gradient(135deg, #14532d 0%, #166534 100%);
                color: #fef08a;
                border: 2px solid #ca8a04;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 2px 3px 0px rgba(0,0,0,0.6);
                font-size: 16px;
                cursor: pointer;
                transform: translate(-50%, -50%);
              ">
                ⚡
              </div>
            `,
            iconSize: [34, 34],
            iconAnchor: [17, 17],
          });

          const m = L.marker(station.coordinates, { icon }).addTo(evLayerRef.current!);
          m.bindPopup(`
            <div style="font-family: 'Manrope', -apple-system, sans-serif; min-width: 275px; max-width: 310px; color: #1c1917; overflow: hidden; border-radius: 10px;">
              <div style="height: 4px; background: linear-gradient(90deg, #15803d 0%, #ca8a04 50%, #166534 100%); width: 100%;"></div>

              <div style="padding: 10px 14px 12px 14px;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                  <span style="font-size: 10px; font-weight: 800; color: #15803d; text-transform: uppercase; font-family: monospace; letter-spacing: 0.05em;">
                    ⚡ ${station.network} • ${station.totalPowerKw} kW DC Fast
                  </span>
                  <span style="font-size: 9px; font-weight: 700; color: #854d0e; background: #fef9c3; padding: 1px 5px; border-radius: 3px; border: 1px solid #fde047;">
                    ${station.corridor}
                  </span>
                </div>

                <h3 style="margin: 0 0 2px 0; font-size: 14px; font-weight: 800; color: #0f172a; font-family: 'Lora', serif;">
                  ${station.name}
                </h3>
                <p style="margin: 0 0 4px 0; font-size: 11px; color: #b45309; font-family: 'Noto Sans Gujarati', sans-serif; font-weight: 600;">
                  ${station.gujaratiName}
                </p>
                <p style="margin: 0 0 6px 0; font-size: 11px; color: #44403c; line-height: 1.35;">
                  📍 ${station.locationDesc}
                </p>

                <div style="font-size: 10px; color: #15803d; font-weight: bold; margin-bottom: 6px; background: #f0fdf4; padding: 4px 6px; border-radius: 4px; border: 1px solid #bbf7d0;">
                  ✓ ${station.reliabilityScore}% Gun Reliability • ${station.hasDgBackup ? '⚡ DG Generator Backup' : '⚠️ No DG Backup'}
                </div>

                ${station.criticalRoadtripWarning ? `
                  <div style="padding: 4px 6px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 4px; font-size: 10px; color: #991b1b; margin-bottom: 6px;">
                    ⚠️ ${station.criticalRoadtripWarning}
                  </div>
                ` : ''}

                <div style="font-size: 10px; color: #57534e; margin-bottom: 8px; font-family: monospace;">
                  Tariff: <strong>${station.tariffPerKwh}</strong> | Food: ${station.amenities.food}
                </div>

                <a href="https://www.google.com/maps/dir/?api=1&destination=${station.coordinates[0]},${station.coordinates[1]}" target="_blank" style="
                  display: flex; align-items: center; justify-content: center; gap: 4px;
                  width: 100%; box-sizing: border-box; padding: 8px;
                  background: linear-gradient(135deg, #15803d 0%, #166534 100%);
                  color: #fff; font-weight: 800; font-size: 11px; text-decoration: none;
                  border-radius: 6px; border: 1px solid #14532d; box-shadow: 0 2px 4px rgba(0,0,0,0.15);
                ">
                  <span>Open in Google Maps Navigation</span> <span>↗</span>
                </a>
              </div>
            </div>
          `, { className: 'ethnic-leaflet-popup', maxWidth: 300, minWidth: 260 });
        });
      }
    }

  }, [mapReady, showDistricts, showTourist, showStories, showEV, evFilterDgOnly, evFilterFastOnly, evSelectedCorridor, userProfile.collectedStampIds, stories]);

  return (
    <div className="relative w-full h-[calc(100vh-4.25rem)] bg-[#0c1524] overflow-hidden">
      
      {/* Floating Layer Control Panel (Traditional Gujarati Ethnic Styling) */}
      <div className="absolute top-4 left-4 z-[1050] bg-[#0c1524]/95 backdrop-blur-md border-2 border-amber-600/60 p-3.5 sm:p-4 rounded-xl shadow-2xl text-slate-100 max-w-sm select-none">
        
        {/* Decorative mini toran border on layer panel */}
        <div className="ethnic-toran-trim rounded-t mb-2 -mt-1 -mx-1" />

        <div className="flex items-center justify-between gap-3 mb-2.5 pb-2 border-b border-amber-600/30">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold flex items-center justify-center text-xs font-['Noto_Sans_Gujarati']">
              ગૂ
            </span>
            <span className="text-xs font-bold font-['Outfit'] text-white">
              Atlas Map Layers • નકશા સ્તરો
            </span>
          </div>
          <span className="text-[10px] font-mono font-bold text-amber-400">
            {userProfile.collectedStampIds.length}/34 Stamped
          </span>
        </div>

        {/* Layer Checkbox Buttons */}
        <div className="space-y-1.5 text-xs">
          <label className="flex items-center justify-between p-1.5 rounded hover:bg-amber-950/30 cursor-pointer">
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                checked={showTourist} 
                onChange={(e) => setShowTourist(e.target.checked)} 
                className="accent-amber-500 rounded"
              />
              <span className="font-bold text-slate-200">🏛️ Tourist Spots</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.2 bg-amber-950/80 text-amber-300 rounded border border-amber-600/50">
              37 Sites
            </span>
          </label>

          <label className="flex items-center justify-between p-1.5 rounded hover:bg-amber-950/30 cursor-pointer">
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                checked={showStories} 
                onChange={(e) => setShowStories(e.target.checked)} 
                className="accent-amber-500 rounded"
              />
              <span className="font-bold text-slate-200">📜 Unfiltered Stories</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.2 bg-rose-950/80 text-rose-300 rounded border border-rose-700/50">
              45 Dossiers
            </span>
          </label>

          <label className="flex items-center justify-between p-1.5 rounded hover:bg-amber-950/30 cursor-pointer">
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                checked={showEV} 
                onChange={(e) => setShowEV(e.target.checked)} 
                className="accent-amber-500 rounded"
              />
              <span className="font-bold text-slate-200">⚡ EV Fast Chargers</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.2 bg-emerald-950/80 text-emerald-300 rounded border border-emerald-700/50">
              12 Hubs
            </span>
          </label>

          <label className="flex items-center justify-between p-1.5 rounded hover:bg-amber-950/30 cursor-pointer">
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                checked={showDistricts} 
                onChange={(e) => setShowDistricts(e.target.checked)} 
                className="accent-amber-500 rounded"
              />
              <span className="font-bold text-slate-200">🛂 34 District Hubs</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.2 bg-amber-900/60 text-amber-300 rounded border border-amber-600/50">
              34 Districts
            </span>
          </label>
        </div>

        {/* Embedded EV Highway Corridor Radar Quick Toggle */}
        <div className="mt-3 pt-2.5 border-t border-amber-600/30">
          <button
            onClick={() => setEvRadarOpen(!evRadarOpen)}
            className="w-full py-1.5 px-3 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black text-xs flex items-center justify-between shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all"
          >
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              <span>{evRadarOpen ? 'Close EV Corridor Radar' : '⚡ EV Highway Corridor Radar'}</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/25 text-black font-mono">
              60-180kW
            </span>
          </button>
        </div>

      </div>

      {/* Embedded Highway EV Corridor Radar Slide-Out Panel */}
      {evRadarOpen && (
        <div className="absolute top-4 right-4 z-[1050] bg-[#0c1524]/95 backdrop-blur-md border-2 border-amber-600/60 p-4 rounded-xl shadow-2xl text-slate-100 max-w-sm w-full select-none animate-in fade-in slide-in-from-right duration-200">
          
          <div className="flex items-center justify-between gap-3 mb-2 pb-2 border-b border-amber-600/30">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs">
                ⚡
              </span>
              <div>
                <h4 className="text-xs font-black text-white font-['Outfit']">
                  Highway EV Radar Lifeline
                </h4>
                <span className="text-[10px] text-amber-300/80 font-['Noto_Sans_Gujarati']">
                  ઈ-વ્હીકલ હાઈવે નેટવર્ક
                </span>
              </div>
            </div>
            <button 
              onClick={() => setEvRadarOpen(false)}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 gap-2 my-2 text-center font-mono">
            <div className="p-1.5 rounded bg-[#121c2e] border border-amber-600/20">
              <span className="text-base font-black text-amber-400 block font-['Outfit']">180 kW</span>
              <span className="text-[9px] text-slate-400 uppercase">Hypercharger Peak</span>
            </div>
            <div className="p-1.5 rounded bg-[#121c2e] border border-amber-600/20">
              <span className="text-base font-black text-emerald-400 block font-['Outfit']">98.2%</span>
              <span className="text-[9px] text-slate-400 uppercase">Gun Reliability</span>
            </div>
          </div>

          {/* Critical Corridor Dead Zone Warning */}
          <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-500/50 text-[11px] text-rose-200 mb-2.5">
            <div className="flex items-center gap-1.5 font-bold text-rose-300 mb-0.5">
              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Dead Zone Alert: Kutch &amp; Dang</span>
            </div>
            <p className="text-[10px] text-slate-300 leading-tight">
              Zero DC fast chargers exist between Khavda &amp; Dholavira in Kutch, or inside Saputara Teak Forest. Charge to 100% at Bhuj or Waghai before crossing!
            </p>
          </div>

          {/* Feature Filters */}
          <div className="space-y-1.5 pt-1 border-t border-amber-600/20 text-xs">
            <span className="text-[10px] font-mono text-slate-400 block font-bold">
              SOLVED ROADTRIP PAIN POINTS:
            </span>

            <button
              onClick={() => setEvFilterDgOnly(!evFilterDgOnly)}
              className={`w-full p-2 rounded text-left transition-colors flex items-center justify-between border ${
                evFilterDgOnly 
                  ? 'bg-emerald-950/80 text-emerald-200 border-emerald-500' 
                  : 'bg-[#121c2e] text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-semibold text-[11px]">Generator (DG) Backup Only</span>
              </div>
              <span className="text-[9px] px-1 py-0.2 rounded font-mono bg-black/40 text-emerald-300">
                Blackout-Proof
              </span>
            </button>

            <button
              onClick={() => setEvFilterFastOnly(!evFilterFastOnly)}
              className={`w-full p-2 rounded text-left transition-colors flex items-center justify-between border ${
                evFilterFastOnly 
                  ? 'bg-amber-950/80 text-amber-200 border-amber-500' 
                  : 'bg-[#121c2e] text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-semibold text-[11px]">120kW+ Hyperchargers Only</span>
              </div>
              <span className="text-[9px] px-1 py-0.2 rounded font-mono bg-black/40 text-amber-300">
                Ultra-Fast
              </span>
            </button>
          </div>

          {/* Fly-to Corridor Quick Jump */}
          <div className="mt-3 pt-2 border-t border-amber-600/20">
            <span className="text-[10px] font-mono text-slate-400 block font-bold mb-1.5">
              FAST-FOCUS HIGHWAY CORRIDOR:
            </span>
            <div className="grid grid-cols-2 gap-1.5 text-[10px]">
              {corridors.filter(c => c.id !== 'all').map(c => (
                <button
                  key={c.id}
                  onClick={() => flyToCorridor(c.id)}
                  className={`p-1.5 rounded text-left font-semibold truncate transition-colors border ${
                    evSelectedCorridor === c.id
                      ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                      : 'bg-[#121c2e] text-slate-300 border-slate-700 hover:text-white'
                  }`}
                >
                  📍 {c.label}
                </button>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* The Leaflet Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};
