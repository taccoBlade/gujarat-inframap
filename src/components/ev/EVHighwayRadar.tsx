import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAtlasStore } from '../../stores/useAtlasStore';
import { GUJARAT_HIGHWAY_EV_STATIONS } from '../../data/ev-stations';
import { EVChargingStation, EVNetwork } from '../../types/ev';
import { 
  Zap, 
  BatteryCharging, 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  Sun, 
  Coffee, 
  Clock, 
  ExternalLink,
  ChevronRight,
  Filter,
  Flame,
  HelpCircle
} from 'lucide-react';

export const EVHighwayRadar: React.FC = () => {
  const { 
    evFilterCorridor, 
    setEvFilterCorridor, 
    evFilterFastOnly, 
    setEvFilterFastOnly, 
    evFilterDgBackupOnly, 
    setEvFilterDgBackupOnly 
  } = useAtlasStore();

  const [selectedNetwork, setSelectedNetwork] = useState<string>('all');
  const [expandedTroubleshootId, setExpandedTroubleshootId] = useState<string | null>(null);

  const corridors = [
    { id: 'all', label: 'All Highway Corridors' },
    { id: 'NE-1', label: 'NE-1 Expressway (Ahmd–Vdr)' },
    { id: 'NH-48', label: 'NH-48 Golden Corridor (Surat/Vapi)' },
    { id: 'NH-47', label: 'NH-47/27 Saurashtra & Dwarka' },
    { id: 'Kutch', label: 'Kutch White Desert Route' },
    { id: 'Dang', label: 'Dang Teak Forest & Saputara' },
    { id: 'Border', label: 'North Gujarat & Vav-Tharad' }
  ];

  const filteredStations = GUJARAT_HIGHWAY_EV_STATIONS.filter(st => {
    const matchesCorridor = evFilterCorridor === 'all' || st.corridor.toLowerCase().includes(evFilterCorridor.toLowerCase());
    const matchesNetwork = selectedNetwork === 'all' || st.network === selectedNetwork;
    const matchesFast = !evFilterFastOnly || st.totalPowerKw >= 120;
    const matchesDg = !evFilterDgBackupOnly || st.hasDgBackup;
    return matchesCorridor && matchesNetwork && matchesFast && matchesDg;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-slate-100">
      
      {/* Hero Header with Traditional Gujarati Travel Theme */}
      <div className="relative bg-gradient-to-br from-[#0c2417] via-[#0f1d2c] to-[#0c1524] border-2 border-amber-600/50 rounded-2xl p-6 sm:p-8 mb-6 shadow-2xl overflow-hidden">
        
        {/* Toran Border Trim on Top */}
        <div className="ethnic-toran-trim absolute top-0 left-0 right-0" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/15 border border-amber-500/40 rounded-full text-xs font-bold text-amber-300 uppercase tracking-widest font-mono">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>HIGHWAY FAST-CHARGING RADAR • ઈ-વ્હીકલ હાઈવે નેટવર્ક</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white font-['Lora',serif] tracking-tight">
              Gujarat EV <span className="text-amber-400">Roadtrip Lifeline</span>
            </h1>

            <p className="text-sm text-slate-300 max-w-2xl font-['Plus_Jakarta_Sans',sans-serif] leading-relaxed">
              Real-world highway fast chargers (60kW–180kW) with live gun reliability ratings, diesel generator power-cut protection, 45°C thermal shade indicators, and dead-zone warnings for remote Kutch &amp; Dang roadtrips.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-3 bg-[#0c1524] border-2 border-amber-600/40 p-3.5 rounded-xl shadow-lg flex-shrink-0 text-center font-mono">
            <div className="p-2 border-r border-amber-600/30">
              <span className="text-2xl font-black text-amber-400 font-['Outfit']">180 kW</span>
              <p className="text-[10px] text-slate-400 uppercase">Peak Hypercharger</p>
            </div>
            <div className="p-2">
              <span className="text-2xl font-black text-emerald-400 font-['Outfit']">98.2%</span>
              <p className="text-[10px] text-slate-400 uppercase">Gun Reliability</p>
            </div>
          </div>
        </div>

        {/* Trending Pain Points Solved Banner */}
        <div className="mt-6 pt-5 border-t border-amber-600/30 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#0c1524]/70 border border-amber-600/20">
            <span className="w-6 h-6 rounded bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-bold">✓</span>
            <div>
              <strong className="text-white block text-[11px]">No Phantom Chargers</strong>
              <span className="text-[10px] text-slate-400">Every charger verified by local drivers</span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#0c1524]/70 border border-amber-600/20">
            <span className="w-6 h-6 rounded bg-amber-500/20 flex items-center justify-center text-amber-400 text-xs font-bold">⚡</span>
            <div>
              <strong className="text-white block text-[11px]">Rural Power-Cut Shield</strong>
              <span className="text-[10px] text-slate-400">Flags generator backup at dhabas</span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#0c1524]/70 border border-amber-600/20">
            <span className="w-6 h-6 rounded bg-rose-500/20 flex items-center justify-center text-rose-400 text-xs font-bold">⚠️</span>
            <div>
              <strong className="text-white block text-[11px]">Dead-Zone Warnings</strong>
              <span className="text-[10px] text-slate-400">Last-chance alerts before Kutch &amp; Dangs</span>
            </div>
          </div>
        </div>

      </div>

      {/* Critical Highway Warning Banner */}
      <div className="mb-6 p-4 rounded-xl bg-rose-950/60 border-2 border-rose-500/50 text-rose-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 flex-shrink-0 mt-0.5 sm:mt-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-rose-300 uppercase tracking-wider block">
              Trending EV Highway Danger: Rural Dead Zones
            </span>
            <span className="text-slate-300">
              Zero DC fast chargers exist between Khavda &amp; Dholavira in Kutch, or inside the Saputara Teak Forests. Charge to 100% at Bhuj or Waghai before crossing the threshold!
            </span>
          </div>
        </div>
        <span className="px-2.5 py-1 bg-rose-900/60 border border-rose-600 rounded text-[10px] font-mono font-bold text-rose-300 flex-shrink-0">
          Range Emergency Protocol
        </span>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-[#0f1a2d] border-2 border-amber-600/30 rounded-xl p-4 mb-6 space-y-3">
        {/* Corridors scroll */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {corridors.map((c) => (
            <button
              key={c.id}
              onClick={() => setEvFilterCorridor(c.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${
                evFilterCorridor === c.id
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 border-black shadow-[2px_2px_0px_#000]'
                  : 'bg-[#0c1524] text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Feature Toggles */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-amber-600/20 text-xs">
          <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5 text-amber-400" />
            Filters:
          </span>

          <button
            onClick={() => setEvFilterFastOnly(!evFilterFastOnly)}
            className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors flex items-center gap-1.5 ${
              evFilterFastOnly
                ? 'bg-amber-500/20 text-amber-300 border-amber-500'
                : 'bg-[#0c1524] text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            <Zap className="w-3 h-3 text-amber-400" />
            <span>120kW+ Hyperchargers Only</span>
          </button>

          <button
            onClick={() => setEvFilterDgBackupOnly(!evFilterDgBackupOnly)}
            className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors flex items-center gap-1.5 ${
              evFilterDgBackupOnly
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                : 'bg-[#0c1524] text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Has Generator (DG) Backup</span>
          </button>

          <span className="ml-auto font-mono text-[11px] text-slate-400">
            Showing <strong>{filteredStations.length}</strong> verified stations
          </span>
        </div>
      </div>

      {/* Stations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredStations.map((station) => (
          <motion.div
            key={station.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0f1a2d] border-2 border-amber-600/30 hover:border-amber-400/70 rounded-xl p-5 shadow-xl transition-all flex flex-col justify-between relative overflow-hidden"
          >
            {/* Top row: Network, Corridor & Speed badge */}
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">
                    {station.network}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 border border-slate-700 px-2 py-0.5 rounded bg-[#0c1524]">
                    {station.district} • {station.corridor.split(' ')[0]}
                  </span>
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-lg font-black text-amber-400 font-['Outfit'] leading-none">
                    {station.totalPowerKw} kW
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">DC Peak</span>
                </div>
              </div>

              {/* Station Name & Location */}
              <h3 className="font-extrabold text-base text-white tracking-tight font-['Lora',serif] mb-0.5">
                {station.name}
              </h3>
              <p className="text-xs text-amber-300/90 font-['Noto_Sans_Gujarati'] mb-1 font-semibold">
                {station.gujaratiName}
              </p>
              <p className="text-xs text-slate-300 flex items-center gap-1.5 mb-3">
                <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span>{station.locationDesc}</span>
              </p>

              {/* Critical Roadtrip Warning if any */}
              {station.criticalRoadtripWarning && (
                <div className="p-3 mb-3 rounded-lg bg-amber-950/60 border border-amber-500/50 text-amber-200 text-xs">
                  <strong className="block font-bold mb-0.5 text-amber-300">
                    Corridor Lifeline Disclosure:
                  </strong>
                  <span>{station.criticalRoadtripWarning}</span>
                </div>
              )}

              {/* Gun Availability & Speeds */}
              <div className="p-3 bg-[#0c1524] rounded-lg border border-amber-600/20 mb-3 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400 font-bold uppercase">Connectors</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {station.reliabilityScore}% Reliability
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {station.guns.map((gun, idx) => (
                    <div 
                      key={idx}
                      className="px-2.5 py-1 rounded bg-[#121c2e] border border-slate-700 flex items-center gap-2 text-xs"
                    >
                      <BatteryCharging className="w-3.5 h-3.5 text-amber-400" />
                      <span className="font-bold text-white">{gun.type}</span>
                      <span className="text-slate-300 font-mono text-[11px]">{gun.speedKw}kW ({gun.count} Guns)</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    </div>
                  ))}
                </div>

                <p className="text-[11px] text-slate-400 font-mono italic pt-1">
                  ✓ {station.lastVerifiedWorking}
                </p>
              </div>

              {/* Solved Roadtrip Problems Badge Strip */}
              <div className="flex flex-wrap items-center gap-2 mb-3 text-[11px] font-mono">
                {station.hasDgBackup ? (
                  <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded flex items-center gap-1">
                    ⚡ DG Generator Backup (Zero Blackout)
                  </span>
                ) : (
                  <span className="px-2 py-0.5 bg-rose-950/60 text-rose-300 border border-rose-800/80 rounded flex items-center gap-1">
                    ⚠️ No DG Backup (Subject to Rural Grid)
                  </span>
                )}

                {station.hasCanopyShade && (
                  <span className="px-2 py-0.5 bg-slate-800 text-amber-300 border border-slate-700 rounded flex items-center gap-1">
                    <Sun className="w-3 h-3 text-amber-400" />
                    Canopy Shade (Anti-Overheat)
                  </span>
                )}

                {station.amenities.nightSafeForFamily && (
                  <span className="px-2 py-0.5 bg-slate-800 text-amber-200 border border-slate-700 rounded flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-amber-400" />
                    24/7 Security &amp; Well-Lit
                  </span>
                )}
              </div>

              {/* Amenities & Tariff info */}
              <div className="text-xs text-slate-300 space-y-1 bg-[#0c1524]/60 p-2.5 rounded-lg border border-amber-600/20">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Tariff: <strong className="text-amber-300 font-mono">{station.tariffPerKwh}</strong></span>
                  <span className="text-slate-400">Washrooms: <strong className="text-white">{station.amenities.washroom}</strong></span>
                </div>
                <div className="flex items-start gap-1.5 text-slate-400 text-[11px] pt-1">
                  <Coffee className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300 line-clamp-1">Food: {station.amenities.food}</span>
                </div>
              </div>

              {/* Troubleshooting Drawer Toggle */}
              <div className="mt-2.5">
                <button
                  onClick={() => setExpandedTroubleshootId(expandedTroubleshootId === station.id ? null : station.id)}
                  className="text-[11px] text-amber-400 hover:text-amber-300 font-mono flex items-center gap-1"
                >
                  <HelpCircle className="w-3 h-3" />
                  <span>{expandedTroubleshootId === station.id ? 'Hide Handshake Tip' : 'Handshake Stuck? Click Troubleshooting Tip'}</span>
                </button>

                {expandedTroubleshootId === station.id && (
                  <div className="mt-2 p-2.5 rounded bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200">
                    <p className="font-bold text-[11px] mb-1">🔧 Pro Tip for this Charger:</p>
                    <p className="text-[11px] text-slate-300 leading-relaxed">{station.troubleshootingTip}</p>
                    <p className="text-[10px] text-amber-400 mt-1 font-mono">Operator Support: {station.supportPhone}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 mt-3 border-t border-amber-600/20 flex items-center justify-between gap-2">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${station.coordinates[0]},${station.coordinates[1]}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-lg shadow-[2px_2px_0px_#000] flex items-center gap-1.5 transition-colors"
              >
                <span>Navigate in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={`tel:${station.supportPhone}`}
                className="px-3 py-1.5 bg-[#0c1524] hover:bg-slate-800 text-slate-300 hover:text-white font-bold text-xs rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>Call Support</span>
              </a>
            </div>

          </motion.div>
        ))}
      </div>

    </div>
  );
};
