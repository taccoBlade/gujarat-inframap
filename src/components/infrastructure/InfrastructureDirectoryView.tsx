import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAtlasStore } from '../../stores/useAtlasStore';
import { Search, MapPin, ExternalLink, Zap } from 'lucide-react';

interface InfraAsset {
  id: string;
  name: string;
  gujarati: string;
  category: 'water' | 'energy' | 'transport' | 'urban' | 'public';
  categoryLabel: string;
  district: string;
  subtitle: string;
  imgUrl: string;
  spec1: string;
  spec2: string;
}

const SAMPLE_INFRA_ASSETS: InfraAsset[] = [
  {
    id: 'khavda-re',
    name: 'Khavda Renewable Energy Park (30 GW)',
    gujarati: 'ખાવડા પુનઃપ્રાપ્ય ઊર્જા પાર્ક',
    category: 'energy',
    categoryLabel: 'Clean Energy Mega-Grid',
    district: 'Kachchh',
    subtitle: 'World’s largest hybrid renewable energy installation spanning 726 sq km in the Rann of Kutch.',
    imgUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
    spec1: 'Capacity: 30,000 MW',
    spec2: 'Status: Operational & Expanding'
  },
  {
    id: 'sardar-sarovar',
    name: 'Sardar Sarovar Narmada Dam',
    gujarati: 'સરદાર સરોવર નર્મદા ડેમ',
    category: 'water',
    categoryLabel: 'Water & Multipurpose Dam',
    district: 'Narmada',
    subtitle: 'Lifeline of Gujarat providing drinking and irrigation water across Saurashtra, Kutch, and North Gujarat.',
    imgUrl: 'https://images.unsplash.com/photo-1574482620826-40685ca5ebd2?auto=format&fit=crop&w=800&q=80',
    spec1: 'Dam Height: 163 Meters',
    spec2: 'Canal Network: 75,000+ km'
  },
  {
    id: 'dholera-sir',
    name: 'Dholera Special Investment Region (SIR)',
    gujarati: 'ધોલેરા વિશેષ રોકાણ પ્રદેશ',
    category: 'urban',
    categoryLabel: 'Greenfield Smart City',
    district: 'Ahmedabad',
    subtitle: 'India’s first platinum-rated greenfield smart city along the Western Dedicated Freight Corridor.',
    imgUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    spec1: 'Area: 920 sq km',
    spec2: 'Semiconductor Fab Hub'
  },
  {
    id: 'mumbai-ahmedabad-hsr',
    name: 'Mumbai–Ahmedabad High Speed Rail (Bullet Train)',
    gujarati: 'મુંબઈ-અમદાવાદ બુલેટ ટ્રેન કોરિડોર',
    category: 'transport',
    categoryLabel: 'Expressway & Rail',
    district: 'Surat',
    subtitle: 'First bullet train line in South Asia with major river bridges over Narmada, Tapi, and Mahi.',
    imgUrl: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=800&q=80',
    spec1: 'Design Speed: 350 km/h',
    spec2: 'Length: 508 km (352 km in Guj)'
  },
  {
    id: 'charanka-solar',
    name: 'Charanka Solar Park',
    gujarati: 'ચારણકા સોલાર પાર્ક',
    category: 'energy',
    categoryLabel: 'Solar Power Plant',
    district: 'Patan',
    subtitle: 'Pioneer utility-scale solar park in India generating clean grid electricity in northern plains.',
    imgUrl: 'https://images.unsplash.com/photo-1508873696983-2df57046475a?auto=format&fit=crop&w=800&q=80',
    spec1: 'Capacity: 790 MW',
    spec2: 'Authority: GPCL'
  },
  {
    id: 'mundra-port',
    name: 'Mundra Commercial Maritime Terminal',
    gujarati: 'મુન્દ્રા બંદર અને સ્પેશિયલ ઇકોનોમિક ઝોન',
    category: 'urban',
    categoryLabel: 'Deepwater Port & SEZ',
    district: 'Kachchh',
    subtitle: 'India’s largest commercial deepwater maritime port handling over 150 million metric tonnes annually.',
    imgUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f9?auto=format&fit=crop&w=800&q=80',
    spec1: 'Draft: 17.5 Meters',
    spec2: 'Container Berths: 24'
  }
];

export const InfrastructureDirectoryView: React.FC = () => {
  const { theme } = useAtlasStore();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [query, setQuery] = useState('');

  const filtered = SAMPLE_INFRA_ASSETS.filter(item => {
    if (activeCategory !== 'all' && item.category !== activeCategory) return false;
    if (query.trim()) {
      const q = query.toLowerCase();
      return item.name.toLowerCase().includes(q) || item.district.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 transition-colors duration-200 ${theme === 'dark' ? 'text-slate-100' : 'text-[#282823]'}`}>
      
      {/* Header */}
      <div className={`relative border rounded-3xl p-6 sm:p-8 mb-6 sm:mb-8 shadow-sm overflow-hidden transition-colors ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-[#121c2e] via-[#0f172a] to-[#090d16] border-amber-500/20'
          : 'bg-gradient-to-br from-[#FDFBF7] via-[#F8F4EC] to-[#EFE7D8] border-[#D8C3A5]'
      }`}>
        {/* Subtle top hairline */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500" />

        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold font-mono uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Zap className="w-3.5 h-3.5" />
            <span>STATUTORY PUBLIC INFRASTRUCTURE REGISTRY</span>
          </div>

          <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold font-serif tracking-tight ${theme === 'dark' ? 'text-white' : 'text-[#1c1917]'}`}>
            Gujarat <span className="text-amber-500">Infrastructure Directory</span>
          </h1>
          <p className={`text-xs sm:text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-[#57534e]'}`}>
            Explore 3,337 verified public engineering works across all 34 districts — dams, clean energy hubs, rail corridors, and smart cities.
          </p>
        </div>

        {/* Filter bar */}
        <div className={`pt-5 mt-5 border-t flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 ${
          theme === 'dark' ? 'border-slate-800' : 'border-stone-200'
        }`}>
          <div className="relative flex-grow max-w-md">
            <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-slate-400' : 'text-stone-400'}`} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by asset or district..."
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs outline-none border transition-all ${
                theme === 'dark'
                  ? 'bg-slate-900/90 border-slate-700/80 text-white placeholder-slate-500 focus:border-amber-400'
                  : 'bg-white/90 border-[#D8C3A5] text-[#282823] placeholder-stone-400 focus:border-amber-600'
              }`}
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {['all', 'energy', 'water', 'transport', 'urban'].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize transition-all border whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                    : theme === 'dark'
                      ? 'bg-slate-900/60 text-slate-300 border-slate-800 hover:text-white hover:border-slate-700'
                      : 'bg-white/60 text-stone-700 border-[#D8C3A5] hover:border-amber-600'
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
            whileHover={{ y: -4 }}
            transition={{ duration: 0.25 }}
            className={`border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl flex flex-col justify-between transition-all duration-300 ${
              theme === 'dark'
                ? 'bg-[#121926] border-slate-800/90 hover:border-amber-500/50'
                : 'bg-[#FDFBF7] border-[#DFD3C3] hover:border-amber-600 text-[#282823]'
            }`}
          >
            {/* Media */}
            <div 
              className="h-48 w-full bg-cover relative p-3 flex flex-col justify-between"
              style={{ backgroundImage: `url('${item.imgUrl}')`, backgroundPosition: 'center 20%' }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-black/50 pointer-events-none" />
              
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-amber-500 text-black border border-black shadow">
                  {item.categoryLabel}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/70 text-white border border-white/20">
                  📍 {item.district}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-amber-600 font-['Noto_Sans_Gujarati']">
                  {item.gujarati}
                </span>
                <h3 className={`text-lg font-black font-['Outfit'] mt-0.5 ${theme === 'dark' ? 'text-white' : 'text-[#1c1917]'}`}>
                  {item.name}
                </h3>
                <p className={`text-xs mt-1 line-clamp-2 leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-[#57534e]'}`}>
                  {item.subtitle}
                </p>
              </div>

              {/* Specs Grid */}
              <div className={`grid grid-cols-2 gap-2 my-4 pt-3 border-t ${theme === 'dark' ? 'border-slate-800' : 'border-[#DFD3C3]'}`}>
                <div className={`p-2 rounded-lg border ${
                  theme === 'dark' ? 'bg-slate-950/80 border-slate-800' : 'bg-[#F7F2E8] border-[#D8C3A5]'
                }`}>
                  <span className={`text-[9px] font-mono uppercase block ${theme === 'dark' ? 'text-slate-500' : 'text-[#78716c]'}`}>Metric 01</span>
                  <span className={`text-xs font-bold ${theme === 'dark' ? 'text-slate-200' : 'text-[#1c1917]'}`}>{item.spec1}</span>
                </div>
                <div className={`p-2 rounded-lg border ${
                  theme === 'dark' ? 'bg-slate-950/80 border-slate-800' : 'bg-[#F7F2E8] border-[#D8C3A5]'
                }`}>
                  <span className={`text-[9px] font-mono uppercase block ${theme === 'dark' ? 'text-slate-500' : 'text-[#78716c]'}`}>Metric 02</span>
                  <span className={`text-xs font-bold ${theme === 'dark' ? 'text-slate-200' : 'text-[#1c1917]'}`}>{item.spec2}</span>
                </div>
              </div>

              {/* Action */}
              <button 
                onClick={() => alert(`Opening technical dossier for ${item.name}`)}
                className={`w-full py-2 text-xs font-bold rounded-lg transition-colors border flex items-center justify-center gap-1.5 ${
                  theme === 'dark'
                    ? 'bg-slate-800 hover:bg-amber-500 text-slate-300 hover:text-slate-950 border-slate-700 hover:border-black'
                    : 'bg-[#EDE5D8] hover:bg-amber-500 text-[#1c1917] hover:text-slate-950 border-[#D8C3A5] hover:border-black'
                }`}
              >
                <span>View Engineering Dossier</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.article>
        ))}
      </div>

    </div>
  );
};
