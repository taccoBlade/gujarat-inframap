import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { useAtlasStore } from '../../stores/useAtlasStore';
import { GUJARAT_34_DISTRICTS } from '../../data/passport-districts';

export const AtlasMap: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const { theme, userProfile, claimDistrictStamp, setMode } = useAtlasStore();

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Initialize Leaflet Map centered on Gujarat
      const map = L.map(mapContainerRef.current, {
        center: [22.3094, 72.1362],
        zoom: 7.5,
        minZoom: 6,
        maxZoom: 18,
        zoomControl: false,
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Basemap Tiles (OpenStreetMap Humanitarian OSM France)
      const tileUrl = 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png';

      const tileLayer = L.tileLayer(tileUrl, {
        attribution: '&copy; OpenStreetMap contributors, Tiles by HOT',
        subdomains: ['a', 'b', 'c'],
        maxZoom: 19,
      }).addTo(map);

      tileLayerRef.current = tileLayer;
      mapInstanceRef.current = map;

      // Add Custom Interactive District Passport Markers
      GUJARAT_34_DISTRICTS.forEach((d) => {
        const isStamped = userProfile.collectedStampIds.includes(d.id);

        const customIcon = L.divIcon({
          className: 'custom-passport-pin',
          html: `
            <div style="
              width: 38px;
              height: 38px;
              background: ${isStamped ? '#f59e0b' : '#1e293b'};
              color: ${isStamped ? '#000000' : '#ffffff'};
              border: 2px solid ${isStamped ? '#000000' : '#475569'};
              border-radius: 10px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 18px;
              box-shadow: 3px 3px 0px rgba(0,0,0,0.4);
              cursor: pointer;
              transform: translate(-50%, -50%);
              transition: transform 0.2s ease;
            ">
              ${d.icon}
            </div>
          `,
          iconSize: [38, 38],
          iconAnchor: [19, 19],
        });

        const marker = L.marker(d.coordinates, { icon: customIcon }).addTo(map);

        marker.bindPopup(`
          <div style="font-family: sans-serif; padding: 4px; min-width: 220px; color: #18181b;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
              <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: #64748b;">${d.region}</span>
              <span style="font-size: 10px; font-weight: 800; color: #d97706;">${isStamped ? '✓ Stamped' : 'Unvisited'}</span>
            </div>
            <h3 style="margin: 0 0 2px 0; font-size: 16px; font-weight: 800;">
              ${d.name} <span style="font-size: 13px; color: #b45309;">(${d.gujaratiName})</span>
            </h3>
            <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: 600; color: #334155;">
              ${d.landmark}
            </p>
            <p style="margin: 0 0 10px 0; font-size: 11px; color: #64748b; line-height: 1.3;">
              ${d.culturalTitle}
            </p>
            <button 
              onclick="window.claimFromMap('${d.id}')"
              style="
                width: 100%;
                padding: 6px 8px;
                background: ${isStamped ? '#10b981' : '#f59e0b'};
                color: #000;
                font-weight: 800;
                font-size: 11px;
                border: 2px solid #000;
                border-radius: 6px;
                box-shadow: 2px 2px 0px #000;
                cursor: pointer;
              "
            >
              ${isStamped ? '✓ Stamped in Passport' : 'Stamp This District (GPS)'}
            </button>
          </div>
        `);
      });

      // Expose globally for Leaflet popup click handler
      (window as unknown as { claimFromMap: (id: string) => void }).claimFromMap = (id: string) => {
        claimDistrictStamp(id);
      };
    }

    return () => {
      // keep instance alive or handle unmount if needed
    };
  }, [claimDistrictStamp, userProfile.collectedStampIds, theme]);

  // Update tile layer when theme changes
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    mapInstanceRef.current.removeLayer(tileLayerRef.current);

    const tileUrl = 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png';

    tileLayerRef.current = L.tileLayer(tileUrl, {
      attribution: '&copy; OpenStreetMap contributors, Tiles by HOT',
      subdomains: ['a', 'b', 'c'],
      maxZoom: 19,
    }).addTo(mapInstanceRef.current);
  }, [theme]);

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] bg-slate-950 overflow-hidden">
      
      {/* Floating Map HUD Top Pill */}
      <div className="absolute top-4 left-4 z-[400] bg-slate-900/90 backdrop-blur-md border-2 border-slate-700 px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block">
            PASSPORT STAMP RADAR
          </span>
          <span className="text-xs font-bold text-amber-400 font-['Outfit']">
            {userProfile.collectedStampIds.length} of 34 Districts Explored
          </span>
        </div>
        <button
          onClick={() => setMode('passport')}
          className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold rounded-lg shadow-[2px_2px_0px_#000] border border-black"
        >
          View Passport
        </button>
      </div>

      {/* The Leaflet Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};
