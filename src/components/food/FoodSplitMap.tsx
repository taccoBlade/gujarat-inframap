import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { VerifiedFoodVenue } from '../../types/food';
import { evaluateVenueOpenStatus } from '../../utils/opening-hours';
import { useAtlasStore } from '../../stores/useAtlasStore';

interface FoodSplitMapProps {
  venues: VerifiedFoodVenue[];
  selectedVenue: VerifiedFoodVenue | null;
  onSelectVenue: (venue: VerifiedFoodVenue) => void;
}

const CITY_CENTERS: Record<string, { center: [number, number]; zoom: number }> = {
  Ahmedabad: { center: [23.0338, 72.5256], zoom: 12.5 },
  Gandhinagar: { center: [23.1850, 72.6450], zoom: 12.5 },
  Vadodara: { center: [22.3101, 73.1869], zoom: 13 },
  Surat: { center: [21.1702, 72.7858], zoom: 13 },
  all: { center: [22.40, 71.80], zoom: 7.6 }
};

function escapeHtml(str: any): string {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export const FoodSplitMap: React.FC<FoodSplitMapProps> = ({ venues, selectedVenue, onSelectVenue }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerGroupRef = useRef<L.LayerGroup | null>(null);
  const districtBoundaryRef = useRef<L.GeoJSON | null>(null);

  const { theme, foodCityFilter } = useAtlasStore();

  // Initialize Map using the exact same basemap & bounds as the home page AtlasMap
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const initial = CITY_CENTERS[foodCityFilter] || CITY_CENTERS.all;

    const gujaratBounds = L.latLngBounds(
      L.latLng(19.8, 67.5),
      L.latLng(24.9, 74.8)
    );

    const map = L.map(mapContainerRef.current, {
      center: initial.center,
      zoom: initial.zoom,
      minZoom: 6.8,
      maxZoom: 18,
      maxBounds: gujaratBounds,
      maxBoundsViscosity: 0.9,
      zoomControl: false,
      attributionControl: false
    });

    // Same Humanitarian Basemap with Survey of India Alignment used in AtlasMap
    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap | Survey of India Alignment | Gujarat Atlas',
      subdomains: ['a', 'b', 'c'],
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Load official Gujarat administrative district boundaries (same as Home Page AtlasMap)
    fetch('/data/gujarat_districts.geojson')
      .then(res => res.json())
      .then(geojsonData => {
        if (!mapInstanceRef.current) return;
        districtBoundaryRef.current = L.geoJSON(geojsonData, {
          style: {
            color: '#B45309', // Warm amber / Solanki terracotta cartographic border
            weight: 1.5,
            opacity: 0.70,
            fillColor: 'transparent',
            fillOpacity: 0,
            dashArray: '3 3'
          },
          onEachFeature: (feature, layer: any) => {
            const dName = feature.properties?.district || 'District';
            const dGu = feature.properties?.district_gu || '';
            layer.bindTooltip(`
              <div style="font-family: 'Noto Sans Gujarati', sans-serif; font-weight: bold; font-size: 11px; color: #101827; padding: 2px 6px;">
                ${escapeHtml(dName)} ${dGu ? `(${escapeHtml(dGu)})` : ''}
              </div>
            `, { sticky: true });
          }
        }).addTo(mapInstanceRef.current);
      })
      .catch((err) => console.warn('Could not load district boundaries:', err));

    const markerGroup = L.layerGroup().addTo(map);
    markerGroupRef.current = markerGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markerGroupRef.current = null;
      districtBoundaryRef.current = null;
    };
  }, []);

  // Pan to City center when city filter changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const target = CITY_CENTERS[foodCityFilter] || CITY_CENTERS.all;
    mapInstanceRef.current.flyTo(target.center, target.zoom, { duration: 1.2 });
  }, [foodCityFilter]);

  // Pan to selected venue if changed
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedVenue) return;
    mapInstanceRef.current.flyTo([selectedVenue.latitude, selectedVenue.longitude], 15.5, { duration: 1 });
  }, [selectedVenue]);

  // Update Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markerGroupRef.current) return;
    const group = markerGroupRef.current;
    group.clearLayers();

    venues.forEach((v) => {
      const openStatus = evaluateVenueOpenStatus(v.opening_hours, v.status);
      const isSelected = selectedVenue?.id === v.id;

      let iconEmoji = '🌮';
      let iconColor = '#FF9418';

      if (v.category === 'Cafés & coffee spots') {
        iconEmoji = '☕';
        iconColor = '#D97706';
      } else if (v.category === 'Late-night food') {
        iconEmoji = '🌙';
        iconColor = '#818CF8';
      } else if (v.category === 'Night-out destinations and hangout spots') {
        iconEmoji = '✨';
        iconColor = '#EC4899';
      } else if (v.category === 'Evening walks, waterfronts and public spaces') {
        iconEmoji = '🌳';
        iconColor = '#10B981';
      } else if (v.category === 'Budget-friendly places for students') {
        iconEmoji = '💸';
        iconColor = '#10B981';
      }

      const pulseHtml = openStatus.isOpen
        ? `<div class="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white animate-ping"></div>`
        : '';

      const markerHtml = `
        <div class="relative group cursor-pointer transition-transform ${isSelected ? 'scale-125 z-50' : 'hover:scale-115'}">
          <div style="background-color: ${isSelected ? '#FF9418' : '#151F30'}; border: 2.5px solid ${isSelected ? '#101827' : iconColor};" 
               class="w-9 h-9 rounded-2xl flex items-center justify-center text-sm shadow-[3px_3px_0px_#101827] select-none">
            <span>${iconEmoji}</span>
          </div>
          ${pulseHtml}
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'food-marker-custom',
        html: markerHtml,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -20]
      });

      const marker = L.marker([v.latitude, v.longitude], { icon: customIcon });

      const popupHtml = `
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; min-width: 260px; max-width: 310px; overflow: hidden; border-radius: 12px;">
          <div style="height: 4px; background: ${iconColor}; width: 100%;"></div>
          <div style="padding: 12px 14px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 3px;">
              <span style="font-size: 10px; font-weight: 800; color: #FF9418; font-family: monospace; text-transform: uppercase;">
                ${escapeHtml(v.city)} • ${escapeHtml(v.area)}
              </span>
              <span style="font-size: 9px; padding: 2px 6px; border-radius: 4px; background: rgba(255,148,24,0.15); color: #FF9418; font-weight: bold;">
                Verified
              </span>
            </div>
            
            <h3 style="margin: 3px 0 2px 0; font-size: 14px; font-weight: 800; font-family: 'Outfit', sans-serif; line-height: 1.3;">
              ${escapeHtml(v.name)}
            </h3>
            <p style="margin: 0 0 6px 0; font-size: 11px; color: #8F9CAE;">
              ${escapeHtml(v.branch)}
            </p>

            <div style="font-size: 11px; margin-bottom: 6px; padding: 5px 8px; border-radius: 6px; background: rgba(0,0,0,0.25); border: 1px solid #25324A;">
              <span style="font-weight: 700; color: ${openStatus.statusColor === 'green' ? '#10B981' : openStatus.statusColor === 'amber' ? '#F59E0B' : '#EF4444'};">
                ● ${escapeHtml(openStatus.badgeText)}
              </span>
              <div style="font-size: 10px; color: #8F9CAE; margin-top: 2px;">
                🕒 ${escapeHtml(v.opening_hours)}
              </div>
            </div>

            <div style="font-size: 10px; color: #10B981; font-weight: 700; margin-bottom: 8px;">
              🌱 ${escapeHtml(v.vegetarian)}
            </div>

            <div style="display: flex; gap: 6px; margin-top: 8px;">
              <a href="${v.google_maps_url || `https://www.google.com/maps/dir/?api=1&destination=${v.latitude},${v.longitude}`}" 
                 target="_blank" 
                 rel="noopener noreferrer" 
                 style="flex: 1; text-align: center; background: #FF9418; color: #101827; font-weight: 800; font-size: 11px; padding: 7px 10px; border-radius: 8px; border: 1.5px solid #101827; text-decoration: none; box-shadow: 2px 2px 0px #101827; display: flex; align-items: center; justify-content: center; gap: 4px;">
                Directions 🗺️
              </a>
              <button id="view-venue-btn-${v.id}"
                      style="cursor: pointer; flex: 1; text-align: center; background: #25324A; color: #FFFFFF; font-weight: 700; font-size: 11px; padding: 7px 10px; border-radius: 8px; border: 1.5px solid #101827; box-shadow: 2px 2px 0px #101827;">
                Dossier 📋
              </button>
            </div>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, { 
        className: 'ethnic-leaflet-popup', 
        maxWidth: 310, 
        minWidth: 260, 
        autoPan: false 
      });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`view-venue-btn-${v.id}`);
        if (btn) {
          btn.onclick = () => {
            onSelectVenue(v);
          };
        }
      });

      marker.on('click', () => {
        onSelectVenue(v);
      });

      group.addLayer(marker);
    });
  }, [venues, selectedVenue]);

  return (
    <div className="relative w-full h-full min-h-[380px] rounded-3xl overflow-hidden border-2 border-[#25324A] shadow-[4px_4px_0px_#101827]">
      <div ref={mapContainerRef} className="w-full h-full z-0" />
      
      {/* City Legend Indicator Overlay */}
      <div className="absolute top-3 left-3 z-[400] flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#101827]/90 backdrop-blur-md border border-[#25324A] text-white shadow-md">
        <span className="w-2.5 h-2.5 rounded-full bg-[#FF9418] animate-pulse" />
        <span className="text-xs font-mono font-bold">
          {venues.length} Venues • {foodCityFilter === 'all' ? 'All Gujarat' : foodCityFilter}
        </span>
      </div>
    </div>
  );
};
