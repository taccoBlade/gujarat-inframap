import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAtlasStore } from '../../stores/useAtlasStore';
import { getRegionalCulture } from '../../utils/cultural-regions';
import unfilteredData from '../../../data/gujarat_unfiltered.json';
import { Sparkles, Bookmark, BookmarkCheck, Search, ShieldAlert, Eye, Info, Compass } from 'lucide-react';

interface StoryItem {
  id: string;
  name: string;
  gujaratiName: string;
  district: string;
  category: string;
  collection: string;
  tagline: string;
  theFolklore: string;
  theGroundReality: string;
  claimClassification: string;
  factCheckBadge: string;
  legalAccess: {
    isSafeAndLawful?: boolean;
    accessType?: string;
    rulesAndWarnings?: string;
    source?: string;
  } | string;
  imageUrl: string;
  bestTimeToExperience?: string;
  photoSpotTip?: string;
}

export const UnfilteredStoriesView: React.FC = () => {
  const { userProfile, toggleBookmark, theme } = useAtlasStore();
  const [activeTabMap, setActiveTabMap] = useState<Record<string, 'folklore' | 'reality'>>({});
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const stories: StoryItem[] = ((unfilteredData as { stories?: StoryItem[] }).stories || (unfilteredData as unknown as StoryItem[]));

  const filteredStories = stories.filter((story) => {
    if (selectedCategory !== 'all' && story.category !== selectedCategory) {
      return false;
    }

    if (filterQuery.trim()) {
      const q = filterQuery.toLowerCase();
      const matchName = story.name.toLowerCase().includes(q);
      const matchDist = story.district.toLowerCase().includes(q);
      const matchTag = (story.tagline || '').toLowerCase().includes(q);
      if (!matchName && !matchDist && !matchTag) return false;
    }

    return true;
  });

  const toggleTab = (id: string, tab: 'folklore' | 'reality') => {
    setActiveTabMap(prev => ({ ...prev, [id]: tab }));
  };

  return (
    <div className={`max-w-7xl mx-auto px-4 py-8 transition-colors duration-200 ${theme === 'dark' ? 'text-slate-100' : 'text-[#282823]'}`}>
      
      {/* Editorial Header in Traditional Gujarati Heritage Style */}
      <div className={`relative border rounded-3xl p-6 sm:p-8 mb-6 sm:mb-8 shadow-sm overflow-hidden transition-colors ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-[#121c2e] via-[#0f172a] to-[#090d16] border-amber-500/20'
          : 'bg-gradient-to-br from-[#FDFBF7] via-[#F8F4EC] to-[#EFE7D8] border-[#D8C3A5]'
      }`}>
        
        {/* Toran Border Trim on Top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold font-mono uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>EDITORIAL ARCHIVE • ૪૫ અજાણી વાતો (45 DOSSIERS)</span>
            </div>

            <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold font-serif tracking-tight ${
              theme === 'dark' ? 'text-white' : 'text-[#1c1917]'
            }`}>
              Gujarat <span className="text-amber-500 font-serif italic">Unfiltered</span>
            </h1>

            <p className={`text-xs sm:text-sm font-['Noto_Sans_Gujarati',sans-serif] leading-relaxed ${
              theme === 'dark' ? 'text-slate-300' : 'text-[#57534e]'
            }`}>
              ગુજરાતની રહસ્યમય જગ્યાઓ, સદીઓ જૂની લોકવાયકાઓ (Oral Folklore) અને વિજ્ઞાન તેમજ સરકારી ગેઝેટિયર્સ આધારિત ફોરેન્સિક વાસ્તવિકતા (Ground Reality).
            </p>
          </div>

          <div className={`px-4 py-2.5 rounded-2xl border text-center shadow-sm flex-shrink-0 ${
            theme === 'dark'
              ? 'bg-slate-900/80 border-slate-700/80'
              : 'bg-white/80 border-[#D8C3A5]'
          }`}>
            <span className={`text-2xl font-black font-mono block ${theme === 'dark' ? 'text-amber-400' : 'text-[#9a3412]'}`}>45</span>
            <span className={`text-[10px] font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-slate-400' : 'text-[#78716c]'}`}>Oral Folklore vs Reality</span>
          </div>
        </div>

        {/* Filter controls */}
        <div className={`pt-5 mt-5 border-t flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 ${
          theme === 'dark' ? 'border-slate-800' : 'border-stone-200'
        }`}>
          
          {/* Search box */}
          <div className="relative flex-grow max-w-md">
            <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-slate-400' : 'text-stone-400'}`} />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Search Dumas Beach, Shamlaji, Uparkot..."
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs outline-none border transition-all ${
                theme === 'dark'
                  ? 'bg-slate-900/90 border-slate-700/80 text-white placeholder-slate-500 focus:border-amber-400'
                  : 'bg-white/90 border-[#D8C3A5] text-[#282823] placeholder-stone-400 focus:border-amber-600'
              }`}
            />
          </div>

          {/* Category Chips with authentic mineral dye tones */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'all', label: 'All Dossiers (45)' },
              { id: 'folklore_eerie', label: '👁️ Eerie Folklore' },
              { id: 'heritage', label: '🏛️ Solanki & Sultanate' },
              { id: 'nature', label: '🌿 Sacred Groves & Rann' },
              { id: 'unusual_landmark', label: '📍 Curious Landmarks' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                    : theme === 'dark'
                      ? 'bg-slate-900/60 text-slate-300 border-slate-800 hover:text-white hover:border-slate-700'
                      : 'bg-white/60 text-stone-700 border-[#D8C3A5] hover:border-amber-600'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Stories Grid with Authentic Gujarati Motifs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredStories.map((story) => {
            const isBookmarked = userProfile.bookmarkedStoryIds.includes(story.id);
            const activeTab = activeTabMap[story.id] || 'folklore';
            const culture = getRegionalCulture(story.district);

            return (
              <motion.article
                key={story.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25 }}
                className={`rounded-2xl border overflow-hidden shadow-sm hover:shadow-xl flex flex-col justify-between transition-all duration-300 group ${
                  theme === 'dark'
                    ? 'bg-[#121926] border-slate-800/90 hover:border-amber-500/50'
                    : 'bg-[#FDFBF7] border-[#DFD3C3] hover:border-amber-600 text-[#282823]'
                }`}
              >
                {/* Regional Cultural Toran Trim */}
                <div style={{ height: '3px', background: culture.borderTrimStyle }} className="w-full" />

                {/* Media Image Header */}
                <div 
                  className="h-52 w-full bg-cover relative p-3 flex flex-col justify-between overflow-hidden"
                  style={{ backgroundImage: `url('${story.imageUrl}')`, backgroundPosition: 'center 20%' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/60 pointer-events-none" />

                  {/* Top Badges */}
                  <div className="relative z-10 flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-md bg-black/80 backdrop-blur text-amber-200 border border-amber-500/40">
                      📍 {story.district}
                    </span>

                    <button
                      onClick={() => toggleBookmark(story.id)}
                      className={`p-1.5 rounded-md backdrop-blur border transition-all ${
                        isBookmarked 
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow' 
                          : 'bg-black/70 text-slate-300 border-white/20 hover:text-white'
                      }`}
                    >
                      {isBookmarked ? <BookmarkCheck className="w-4 h-4 text-slate-950" /> : <Bookmark className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Bottom Header: Region Name & Fact-check Badge */}
                  <div className="relative z-10 flex items-center justify-between gap-2">
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded bg-amber-500 text-slate-950 border border-black shadow-sm font-mono">
                      {story.factCheckBadge || 'Documented Lore'}
                    </span>
                    <span className="text-[10px] font-mono text-amber-200 bg-black/60 px-2 py-0.5 rounded border border-white/20">
                      {culture.primaryIcon} {culture.regionName}
                    </span>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-5 flex-1 flex flex-col">
                  
                  <div className="mb-3">
                    <span className="text-xs font-bold text-amber-500 font-['Noto_Sans_Gujarati']">
                      {story.gujaratiName}
                    </span>
                    <h3 className={`text-lg font-black font-['Lora',serif] leading-snug transition-colors ${
                      theme === 'dark' ? 'text-white group-hover:text-amber-300' : 'text-[#1c1917] group-hover:text-[#9a3412]'
                    }`}>
                      {story.name}
                    </h3>

                    {/* Regional Folk Tag */}
                    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono mt-1.5 ${culture.badgeBg} ${culture.textColor} border ${culture.badgeBorder}`}>
                      <span>{culture.culturalTag}</span>
                    </div>

                    <p className={`text-xs mt-2 line-clamp-2 leading-relaxed ${
                      theme === 'dark' ? 'text-slate-300' : 'text-[#57534e]'
                    }`}>
                      {story.tagline}
                    </p>
                  </div>

                  {/* Myth vs Reality Tab Switcher */}
                  <div className={`grid grid-cols-2 gap-1 p-1 rounded-lg border text-xs font-bold my-3 ${
                    theme === 'dark' ? 'bg-[#09101c] border-amber-600/30' : 'bg-[#EDE5D8] border-[#D8C3A5]'
                  }`}>
                    <button
                      onClick={() => toggleTab(story.id, 'folklore')}
                      className={`py-1 rounded text-center transition-all ${
                        activeTab === 'folklore'
                          ? 'bg-rose-900 text-amber-100 shadow-sm border border-rose-700/60'
                          : theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-[#57534e] hover:text-[#1c1917]'
                      }`}
                    >
                      📜 Oral Folklore
                    </button>
                    <button
                      onClick={() => toggleTab(story.id, 'reality')}
                      className={`py-1 rounded text-center transition-all ${
                        activeTab === 'reality'
                          ? 'bg-amber-600 text-slate-950 shadow-sm border border-amber-400'
                          : theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-[#57534e] hover:text-[#1c1917]'
                      }`}
                    >
                      🔬 Ground Reality
                    </button>
                  </div>

                  {/* Dynamic Tab Body */}
                  <div className={`text-xs p-3.5 rounded-lg border min-h-[95px] flex items-center ${
                    theme === 'dark' 
                      ? 'bg-[#09101c]/80 text-slate-200 border-amber-600/20' 
                      : 'bg-[#F7F2E8] text-[#282823] border-[#DFD3C3]'
                  }`}>
                    <p className="line-clamp-4 leading-relaxed font-['Lora',serif]">
                      {activeTab === 'folklore' ? story.theFolklore : story.theGroundReality}
                    </p>
                  </div>

                </div>

                {/* Card Footer: Legal Access */}
                <div className={`px-5 py-3 border-t flex items-center justify-between text-[11px] ${
                  theme === 'dark' 
                    ? 'border-amber-600/20 bg-[#09101c]/60 text-slate-300' 
                    : 'border-[#D8C3A5] bg-[#EDE5D8]/60 text-[#57534e]'
                }`}>
                  <span className="flex items-center gap-1 font-mono text-[10px]">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                    {typeof story.legalAccess === 'string'
                      ? story.legalAccess.replace(/_/g, ' ').toUpperCase()
                      : (story.legalAccess?.accessType || 'PUBLIC OPEN')}
                  </span>

                  <span className="text-amber-600 font-bold hover:underline cursor-pointer">
                    Read Investigation →
                  </span>
                </div>

              </motion.article>
            );
          })}
        </AnimatePresence>
      </div>

    </div>
  );
};
