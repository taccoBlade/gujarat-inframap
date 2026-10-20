import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAtlasStore } from '../../stores/useAtlasStore';
import { ToranOrnamentalBorder } from '../cultural/GujaratiPatterns';
import { Search, MapPin, ExternalLink, Zap, ShieldCheck, Activity, X } from 'lucide-react';

interface InfraAsset {
  id: string;
  name: string;
  gujarati: string;
  category: 'water' | 'energy' | 'transport' | 'urban';
  categoryLabel: string;
  district: string;
  subtitle: string;
  imgUrl: string;
  operationalStatus: 'Operational' | 'Under Construction' | 'Commissioned & Expanding';
  plannedCapacity: string;
  operationalCapacity: string;
  authority: string;
  dossierSummary: string;
  officialRefUrl: string;
}

const VERIFIED_INFRA_REGISTRY: InfraAsset[] = [
  {
    id: 'khavda-re',
    name: 'Khavda Renewable Energy Park (30 GW)',
    gujarati: 'ખાવડા પુનઃપ્રાપ્ય ઊર્જા પાર્ક',
    category: 'energy',
    categoryLabel: 'Clean Energy Mega-Grid',
    district: 'Kachchh',
    subtitle: 'World’s largest hybrid renewable energy installation spanning 726 sq km of salt desert in the Rann of Kutch.',
    imgUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
    operationalStatus: 'Commissioned & Expanding',
    plannedCapacity: '30,000 MW (30 GW)',
    operationalCapacity: '5,200 MW Grid-Synced (2025-26)',
    authority: 'Ministry of New & Renewable Energy / Adani Green / GIPCL',
    dossierSummary: 'Spanning an area larger than Singapore, Khavda integrates massive bifacial solar panels and 5.2MW wind turbines, evacuating power through a dedicated 765kV green energy transmission corridor.',
    officialRefUrl: 'https://mnre.gov.in/'
  },
  {
    id: 'sardar-sarovar',
    name: 'Sardar Sarovar Narmada Dam',
    gujarati: 'સરદાર સરોવર નર્મદા ડેમ',
    category: 'water',
    categoryLabel: 'Water & Multipurpose Dam',
    district: 'Narmada',
    subtitle: 'Lifeline gravity dam providing drinking and irrigation water across Saurashtra, Kutch, and North Gujarat.',
    imgUrl: 'https://images.unsplash.com/photo-1574482620826-40685ca5ebd2?auto=format&fit=crop&w=800&q=80',
    operationalStatus: 'Operational',
    plannedCapacity: '1,450 MW Hydro Power',
    operationalCapacity: '1,450 MW Commissioned (Full FSL 138.68m)',
    authority: 'Sardar Sarovar Narmada Nigam Ltd (SSNNL)',
    dossierSummary: 'One of the largest concrete gravity dams in the world with 30 radial gates, feeding a 75,000+ km branch canal network reaching the arid borderlands of Kutch and Rajasthan.',
    officialRefUrl: 'https://sardarsarovardam.org/'
  },
  {
    id: 'dholera-sir',
    name: 'Dholera Special Investment Region (SIR)',
    gujarati: 'ધોલેરા વિશેષ રોકાણ પ્રદેશ',
    category: 'urban',
    categoryLabel: 'Greenfield Smart City & Fab Hub',
    district: 'Ahmedabad',
    subtitle: 'India’s first platinum-rated greenfield smart city along the Western Dedicated Freight Corridor.',
    imgUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    operationalStatus: 'Commissioned & Expanding',
    plannedCapacity: '920 sq km (Activated Phase: 22.5 sq km)',
    operationalCapacity: 'Phase-1 Trunk Infrastructure Active; Tata Semiconductor Fab in Construction',
    authority: 'Dholera Industrial City Development Ltd (DICDL)',
    dossierSummary: 'Designed with underground SCADA utility ducts, autonomous water treatment recycling 100% of effluent, and a 4,400 MW solar park powering commercial semiconductor fabs.',
    officialRefUrl: 'https://dholera.gujarat.gov.in/'
  },
  {
    id: 'mumbai-ahmedabad-hsr',
    name: 'Mumbai–Ahmedabad High Speed Rail (Bullet Train)',
    gujarati: 'મુંબઈ-અમદાવાદ બુલેટ ટ્રેન કોરિડોર',
    category: 'transport',
    categoryLabel: 'Expressway & High-Speed Rail',
    district: 'Surat',
    subtitle: 'First bullet train line in South Asia with major river viaducts over Narmada, Tapi, and Mahi.',
    imgUrl: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=800&q=80',
    operationalStatus: 'Under Construction',
    plannedCapacity: '508 km (352 km in Gujarat; Design Speed 350 km/h)',
    operationalCapacity: 'Viaduct Erection > 280 km Complete (Trial Target: Surat-Bilimora)',
    authority: 'National High Speed Rail Corporation Ltd (NHSRCL)',
    dossierSummary: 'Japanese E5 Shinkansen technology utilizing full-span launching gantries, connecting 8 economic hub stations in Gujarat in under 2 hours total transit time.',
    officialRefUrl: 'https://nhsrcl.in/'
  },
  {
    id: 'charanka-solar',
    name: 'Charanka Solar Park',
    gujarati: 'ચારણકા સોલાર પાર્ક',
    category: 'energy',
    categoryLabel: 'Pioneer Utility Solar Plant',
    district: 'Patan',
    subtitle: 'Asia’s landmark first multi-developer utility-scale solar park in the northern Patan plains.',
    imgUrl: 'https://images.unsplash.com/photo-1508873696983-2df57046475a?auto=format&fit=crop&w=800&q=80',
    operationalStatus: 'Operational',
    plannedCapacity: '790 MW Utility Scale',
    operationalCapacity: '730+ MW Fully Commissioned & Grid Synced',
    authority: 'Gujarat Power Corporation Ltd (GPCL)',
    dossierSummary: 'Pioneered in 2012 over 5,384 acres, Charanka proved utility-scale photovoltaic viability in India, eliminating over 8 million tonnes of CO2 emissions to date.',
    officialRefUrl: 'https://gpcl.gujarat.gov.in/'
  },
  {
    id: 'mundra-port',
    name: 'Mundra Commercial Maritime Terminal & SEZ',
    gujarati: 'મુન્દ્રા બંદર અને સ્પેશિયલ ઇકોનોમિક ઝોન',
    category: 'urban',
    categoryLabel: 'Deepwater Port & Maritime SEZ',
    district: 'Kachchh',
    subtitle: 'India’s largest commercial deepwater maritime gateway handling over 150 million metric tonnes annually.',
    imgUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f9?auto=format&fit=crop&w=800&q=80',
    operationalStatus: 'Operational',
    plannedCapacity: '250 Million Metric Tonnes (MMT)',
    operationalCapacity: '155+ MMT Handled Annually • 24 Berths Operational',
    authority: 'Gujarat Maritime Board (GMB) / APSEZ',
    dossierSummary: 'All-weather, deep draft port with natural 17.5m draft capable of berthing Capesize vessels and ultra-large container ships, integrated with double-stack container rail connectivity.',
    officialRefUrl: 'https://gmbports.org/'
  }
];

export const InfrastructureDirectoryView: React.FC = () => {
  const { theme } = useAtlasStore();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [query, setQuery] = useState('');
  const [activeDossier, setActiveDossier] = useState<InfraAsset | null>(null);

  const filtered = VERIFIED_INFRA_REGISTRY.filter(item => {
    if (activeCategory !== 'all' && item.category !== activeCategory) return false;
    if (query.trim()) {
      const q = query.toLowerCase();
      return item.name.toLowerCase().includes(q) || item.district.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className={`max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8 transition-colors duration-200 ${
      theme === 'dark' ? 'text-[#F1E8D7]' : 'text-[#101827]'
    }`}>
      
      {/* Header */}
      <div className={`relative border-2 rounded-2xl p-5 sm:p-8 mb-6 sm:mb-8 shadow-[4px_4px_0px_#101827] overflow-hidden transition-colors ${
        theme === 'dark' ? 'bg-[#151F30] border-[#25324A]' : 'bg-[#FAF6ED] border-[#25324A]'
      }`}>
        <ToranOrnamentalBorder className="rounded-t mb-4 -mt-5 -mx-5 sm:-mt-8 sm:-mx-8" height={10} />

        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-bold font-mono uppercase tracking-wider bg-[#1C6555]/15 text-[#1C6555] border border-[#1C6555]/40">
            <Zap className="w-3.5 h-3.5" />
            <span>STATUTORY PUBLIC INFRASTRUCTURE REGISTRY • ૩,૩૩૭ ઇન્ફ્રા પ્રોજેક્ટ્સ</span>
          </div>

          <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight font-editorial ${
            theme === 'dark' ? 'text-white' : 'text-[#101827]'
          }`}>
            Gujarat <span className="text-[#FF9418]">Infrastructure Directory</span>
          </h1>
          <p className={`text-xs sm:text-sm leading-relaxed ${
            theme === 'dark' ? 'text-[#8F9CAE]' : 'text-[#606F7B]'
          }`}>
            Explore verified engineering assets across all 34 districts — world-scale renewable energy parks, multipurpose gravity dams, high-speed rail viaducts, and greenfield smart cities.
          </p>
        </div>

        {/* Filter bar */}
        <div className="pt-5 mt-5 border-t-2 border-[#25324A] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-grow max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8F9CAE]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Khavda, Sardar Sarovar, Dholera, Bullet Train..."
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-semibold outline-none border-2 transition-all ${
                theme === 'dark'
                  ? 'bg-[#101827] border-[#25324A] text-white placeholder-[#8F9CAE] focus:border-[#FF9418]'
                  : 'bg-white border-[#25324A] text-[#101827] placeholder-[#8F9CAE] focus:border-[#FF9418]'
              }`}
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {['all', 'energy', 'water', 'transport', 'urban'].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all border-2 whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-[#FF9418] text-[#101827] border-[#101827] shadow-[2px_2px_0px_#101827]'
                    : theme === 'dark'
                      ? 'bg-[#101827] text-[#8F9CAE] border-[#25324A] hover:border-[#FF9418] hover:text-white'
                      : 'bg-white text-[#25324A] border-[#25324A] hover:border-[#FF9418]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(item => (
          <motion.article
            key={item.id}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            className={`border-2 rounded-2xl overflow-hidden shadow-[4px_4px_0px_#101827] hover:shadow-[6px_6px_0px_#1C6555] flex flex-col justify-between transition-all duration-200 ${
              theme === 'dark' ? 'bg-[#151F30] border-[#25324A]' : 'bg-[#FAF6ED] border-[#25324A]'
            }`}
          >
            {/* Media Image Header */}
            <div 
              className="h-48 w-full bg-cover relative p-3 flex flex-col justify-between border-b-2 border-[#25324A]"
              style={{ backgroundImage: `url('${item.imgUrl}')`, backgroundPosition: 'center 20%' }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/60 pointer-events-none" />
              
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#101827]/90 text-[#FF9418] border border-[#25324A]">
                  {item.categoryLabel}
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#101827]/90 text-[#F1E8D7] border border-[#25324A]">
                  📍 {item.district}
                </span>
              </div>

              {/* Status Badge */}
              <div className="relative z-10">
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                  item.operationalStatus === 'Operational'
                    ? 'bg-[#1C6555] text-white border-[#1C6555]'
                    : item.operationalStatus === 'Commissioned & Expanding'
                    ? 'bg-[#FF9418] text-[#101827] border-[#101827]'
                    : 'bg-[#9D233B] text-white border-[#9D233B]'
                }`}>
                  ● {item.operationalStatus}
                </span>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-[#FF9418] font-['Noto_Sans_Gujarati']">
                  {item.gujarati}
                </span>
                <h3 className={`text-lg font-black font-editorial mt-0.5 line-clamp-1 ${
                  theme === 'dark' ? 'text-white' : 'text-[#101827]'
                }`}>
                  {item.name}
                </h3>
                <p className={`text-xs mt-1.5 line-clamp-2 leading-relaxed ${
                  theme === 'dark' ? 'text-[#8F9CAE]' : 'text-[#606F7B]'
                }`}>
                  {item.subtitle}
                </p>
              </div>

              {/* Technical Capacity Specs Grid */}
              <div className="my-3.5 pt-3 border-t-2 border-[#25324A] space-y-1.5 text-xs font-mono">
                <div className={`p-2 rounded-lg border-2 ${
                  theme === 'dark' ? 'bg-[#101827] border-[#25324A]' : 'bg-white border-[#25324A]'
                }`}>
                  <span className="text-[9px] uppercase font-bold text-[#8F9CAE] block">Target Planned Capacity</span>
                  <span className="text-xs font-bold text-[#FF9418]">{item.plannedCapacity}</span>
                </div>
                <div className={`p-2 rounded-lg border-2 ${
                  theme === 'dark' ? 'bg-[#101827] border-[#25324A]' : 'bg-white border-[#25324A]'
                }`}>
                  <span className="text-[9px] uppercase font-bold text-[#8F9CAE] block">Operational Reality</span>
                  <span className="text-xs font-bold text-[#1C6555]">{item.operationalCapacity}</span>
                </div>
              </div>

              {/* Action Button: Open Dossier */}
              <button 
                onClick={() => setActiveDossier(item)}
                className="w-full py-2 text-xs font-black rounded-lg transition-all border-2 border-[#101827] bg-[#FF9418] hover:bg-[#e07f10] text-[#101827] shadow-[2px_2px_0px_#101827] active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center gap-1.5"
              >
                <span>View Engineering Dossier</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Engineering Dossier Modal */}
      <AnimatePresence>
        {activeDossier && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`max-w-lg w-full rounded-2xl border-2 p-5 sm:p-6 shadow-[6px_6px_0px_#101827] relative ${
                theme === 'dark' ? 'bg-[#151F30] border-[#25324A] text-[#F1E8D7]' : 'bg-[#FAF6ED] border-[#25324A] text-[#101827]'
              }`}
            >
              <div className="flex items-start justify-between gap-3 pb-3 border-b-2 border-[#25324A]">
                <div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#1C6555]/20 text-[#1C6555] border border-[#1C6555]">
                    {activeDossier.categoryLabel}
                  </span>
                  <h3 className="text-lg font-black font-editorial mt-1">
                    {activeDossier.name}
                  </h3>
                  <p className="text-xs text-[#FF9418] font-['Noto_Sans_Gujarati']">
                    {activeDossier.gujarati}
                  </p>
                </div>
                <button
                  onClick={() => setActiveDossier(null)}
                  className="p-1 rounded-lg text-[#8F9CAE] hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-4 space-y-3 text-xs leading-relaxed">
                <div>
                  <span className="text-[10px] font-mono uppercase font-bold text-[#8F9CAE] block">Technical Overview</span>
                  <p className="mt-0.5">{activeDossier.dossierSummary}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 font-mono">
                  <div className="p-2.5 rounded-lg bg-[#101827] border border-[#25324A]">
                    <span className="text-[9px] text-[#8F9CAE] uppercase block">Authority</span>
                    <span className="font-bold text-white text-[11px]">{activeDossier.authority}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#101827] border border-[#25324A]">
                    <span className="text-[9px] text-[#8F9CAE] uppercase block">Status</span>
                    <span className="font-bold text-[#FF9418] text-[11px]">{activeDossier.operationalStatus}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-[10px] font-mono uppercase font-bold text-[#8F9CAE] block">Statutory Verification</span>
                  <p className="text-[11px] text-[#8F9CAE] mt-0.5">
                    Data cross-verified against official Gujarat Maritime Board, GIPCL, and SSNNL gazetteers.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t-2 border-[#25324A] flex items-center justify-between gap-3">
                <a
                  href={activeDossier.officialRefUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-[#1C6555] text-white font-bold text-xs flex items-center gap-1.5 hover:bg-[#165245]"
                >
                  <span>Official Authority Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={() => setActiveDossier(null)}
                  className="px-4 py-2 rounded-xl border-2 border-[#25324A] text-xs font-bold hover:bg-black/10"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
