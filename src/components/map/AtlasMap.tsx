import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useAtlasStore } from '../../stores/useAtlasStore';
import { GUJARAT_34_DISTRICTS } from '../../data/passport-districts';
import { VERIFIED_TOURIST_DESTINATIONS } from '../../data/tourist-destinations';
import { GUJARAT_HIGHWAY_EV_STATIONS } from '../../data/ev-stations';
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
  ShieldCheck 
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

  const stories: StoryItem[] = (unfilteredStoriesRaw as any).stories || (unfilteredStoriesRaw as unknown as StoryItem[]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // 1. Strict Boundary Locking to Gujarat (Survey of India Alignment)
      // Clamped strictly to Gujarat state coordinates so northern international borders cannot be reached
      const gujaratBounds = L.latLngBounds(
        L.latLng(19.8, 67.5), // South-West (Arabian Sea / Valsad border)
        L.latLng(24.9, 74.8)  // North-East (Kachchh / Banaskantha / Rajasthan border)
      );

      const map = L.map(mapContainerRef.current, {
        center: [22.40, 71.80],
        zoom: 7.4,
        minZoom: 6.8,
        maxZoom: 18,
        maxBounds: gujaratBounds,
        maxBoundsViscosity: 1.0, // Hard bounce-back so user can never pan outside Gujarat!
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
              color: '#9a3412', // Terracotta Clay outline
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

      // Global callback for popups
      (window as unknown as { claimFromMap: (id: string) => void }).claimFromMap = (id: string) => {
        claimDistrictStamp(id);
      };
      (window as unknown as { viewStoriesFromMap: () => void }).viewStoriesFromMap = () => {
        setMode('unfiltered');
      };
      (window as unknown as { viewDestinationsFromMap: () => void }).viewDestinationsFromMap = () => {
        setMode('places');
      };

      // Ensure proper sizing and trigger marker drawing
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

          const m = L.marker(d.coordinates, { icon }).addTo(districtLayerRef.current!);
          m.bindPopup(`
            <div style="font-family: sans-serif; min-width: 220px; color: #1c1917; padding: 2px;">
              <div style="height: 3px; background: linear-gradient(90deg, #9a3412, #d97706); border-radius: 2px; margin-bottom: 6px;"></div>
              <span style="font-size: 10px; font-weight: 800; color: #9a3412; text-transform: uppercase; font-family: monospace;">
                ${d.region} • ${isStamped ? '✓ STAMPED' : 'UNVISITED'}
              </span>
              <h3 style="margin: 2px 0; font-size: 15px; font-weight: 800; color: #0f172a;">
                ${d.name} (${d.gujaratiName})
              </h3>
              <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 600; color: #57534e;">
                📍 ${d.landmark}
              </p>
              <button onclick="window.claimFromMap('${d.id}')" style="
                width: 100%; padding: 7px; background: ${isStamped ? '#15803d' : '#d97706'};
                color: #fff; font-weight: bold; font-size: 11px; border: 1.5px solid #000;
                border-radius: 6px; cursor: pointer; box-shadow: 1px 1px 0px #000;
              ">
                ${isStamped ? '✓ Stamped in Passport' : 'Stamp This District'}
              </button>
            </div>
          `);
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

          const m = L.marker(place.coordinates, { icon }).addTo(touristLayerRef.current!);
          m.bindPopup(`
            <div style="font-family: sans-serif; min-width: 240px; max-width: 270px; color: #1c1917; padding: 2px;">
              <div style="height: 3px; background: linear-gradient(90deg, #b45309, #d97706); border-radius: 2px; margin-bottom: 6px;"></div>
              <span style="font-size: 10px; font-weight: 800; color: #9a3412; text-transform: uppercase; font-family: monospace;">
                ${place.district} • ASI &amp; Tourism Landmark
              </span>
              <h3 style="margin: 2px 0 4px 0; font-size: 15px; font-weight: 800; color: #0f172a;">
                ${place.name}
              </h3>
              ${place.image ? `<img src="${place.image}" style="width: 100%; height: 110px; object-fit: cover; border-radius: 6px; margin-bottom: 6px; border: 1px solid #e7e5e4;" />` : ''}
              <p style="margin: 0 0 6px 0; font-size: 11px; color: #44403c; line-height: 1.35;">
                ${place.summary.slice(0, 115)}...
              </p>
              <div style="font-size: 10px; color: #78716c; margin-bottom: 8px; font-family: monospace;">
                🕒 ${place.timings || '08:00 - 18:00'} | 🎟️ ${place.entryFee || 'Free'}
              </div>
              <button onclick="window.viewDestinationsFromMap()" style="
                width: 100%; padding: 7px; background: #9a3412; color: #fff;
                font-weight: bold; font-size: 11px; border: 1.5px solid #000;
                border-radius: 6px; cursor: pointer; box-shadow: 1px 1px 0px #000;
              ">
                Explore Destination Details →
              </button>
            </div>
          `);
        });
      }
    }

    // --- 3. 📜 Unfiltered Stories Layer ---
    if (storyLayerRef.current) {
      storyLayerRef.current.clearLayers();
      if (showStories) {
        stories.forEach((story) => {
          // story.coordinates in json is [lng, lat]
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

          const m = L.marker(coords, { icon }).addTo(storyLayerRef.current!);
          m.bindPopup(`
            <div style="font-family: sans-serif; min-width: 240px; max-width: 270px; color: #1c1917; padding: 2px;">
              <div style="height: 3px; background: linear-gradient(90deg, #991b1b, #f59e0b); border-radius: 2px; margin-bottom: 6px;"></div>
              <span style="font-size: 10px; font-weight: 800; color: #991b1b; text-transform: uppercase; font-family: monospace;">
                ${story.district} • Unfiltered Dossier
              </span>
              <h3 style="margin: 2px 0 2px 0; font-size: 14px; font-weight: 800; color: #0f172a;">
                ${story.name}
              </h3>
              ${story.gujaratiName ? `<div style="font-size: 11px; color: #b45309; margin-bottom: 4px; font-family: 'Noto Sans Gujarati'; font-weight: 600;">${story.gujaratiName}</div>` : ''}
              ${story.imageUrl ? `<img src="${story.imageUrl}" style="width: 100%; height: 105px; object-fit: cover; border-radius: 6px; margin-bottom: 6px; border: 1px solid #e7e5e4;" />` : ''}
              <p style="margin: 0 0 6px 0; font-size: 11px; color: #44403c; line-height: 1.35;">
                ${story.tagline}
              </p>
              <div style="padding: 5px 7px; background: #fdfbf7; border-left: 3px solid #991b1b; border: 1px solid #e7e5e4; border-left-width: 3px; font-size: 10px; color: #1c1917; margin-bottom: 8px;">
                <strong>Truth:</strong> ${story.theGroundReality.slice(0, 95)}...
              </div>
              <button onclick="window.viewStoriesFromMap()" style="
                width: 100%; padding: 7px; background: #1e293b; color: #fff;
                font-weight: bold; font-size: 11px; border: 1.5px solid #000;
                border-radius: 6px; cursor: pointer; box-shadow: 1px 1px 0px #000;
              ">
                Read Full Folklore vs Reality →
              </button>
            </div>
          `);
        });
      }
    }

    // --- 4. ⚡ EV Highway Fast Chargers Layer ---
    if (evLayerRef.current) {
      evLayerRef.current.clearLayers();
      if (showEV) {
        GUJARAT_HIGHWAY_EV_STATIONS.forEach((station) => {
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
            <div style="font-family: sans-serif; min-width: 230px; color: #1c1917; padding: 2px;">
              <div style="height: 3px; background: linear-gradient(90deg, #15803d, #ca8a04); border-radius: 2px; margin-bottom: 6px;"></div>
              <span style="font-size: 10px; font-weight: 800; color: #15803d; text-transform: uppercase; font-family: monospace;">
                ${station.network} • ${station.totalPowerKw} kW DC Fast
              </span>
              <h3 style="margin: 2px 0 4px 0; font-size: 14px; font-weight: 800; color: #0f172a;">
                ${station.name}
              </h3>
              <p style="margin: 0 0 6px 0; font-size: 11px; color: #44403c;">
                📍 ${station.locationDesc}
              </p>
              <div style="font-size: 10px; color: #15803d; font-weight: bold; margin-bottom: 6px;">
                ✓ ${station.reliabilityScore}% Reliability • ${station.hasDgBackup ? '⚡ Has Generator Backup' : '⚠️ No DG Backup'}
              </div>
              <a href="https://www.google.com/maps/dir/?api=1&destination=${station.coordinates[0]},${station.coordinates[1]}" target="_blank" style="
                display: block; text-align: center; width: 100%; box-sizing: border-box; padding: 7px;
                background: #15803d; color: #fff; font-weight: bold; font-size: 11px;
                text-decoration: none; border-radius: 6px; border: 1.5px solid #000; box-shadow: 1px 1px 0px #000;
              ">
                Navigate in Maps →
              </a>
            </div>
          `);
        });
      }
    }

  }, [mapReady, showDistricts, showTourist, showStories, showEV, userProfile.collectedStampIds, stories]);

  return (
    <div className="relative w-full h-[calc(100vh-4.25rem)] bg-[#0c1524] overflow-hidden">
      
      {/* Floating Layer Control Panel (Traditional Gujarati Ethnic Styling) */}
      <div className="absolute top-4 left-4 z-[400] bg-[#0c1524]/95 backdrop-blur-md border-2 border-amber-600/60 p-3.5 sm:p-4 rounded-xl shadow-2xl text-slate-100 max-w-sm select-none">
        
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
      </div>

      {/* The Leaflet Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};
