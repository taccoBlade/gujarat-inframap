import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAtlasStore } from '../../stores/useAtlasStore';
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
  const { userProfile, toggleBookmark } = useAtlasStore();
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
    <div className="max-w-7xl mx-auto px-4 py-8 text-slate-100">
      
      {/* Editorial Header in Traditional Gujarati Heritage Style */}
      <div className="relative bg-gradient-to-br from-[#1b1724] via-[#121c2e] to-[#0c1524] border-2 border-amber-600/50 rounded-2xl p-6 sm:p-8 mb-8 shadow-2xl overflow-hidden">
        
        {/* Toran Border Trim on Top */}
        <div className="ethnic-toran-trim absolute top-0 left-0 right-0" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/15 border border-amber-500/40 rounded-full text-xs font-bold text-amber-300 font-mono uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>EDITORIAL ARCHIVE • ૪૫ અજાણી વાતો (45 DOSSIERS)</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-['Lora',serif] tracking-tight">
              Gujarat <span className="text-amber-400 font-serif italic">Unfiltered</span>
            </h1>

            <p className="text-sm sm:text-base text-amber-100/90 max-w-2xl font-['Noto_Sans_Gujarati',sans-serif] leading-relaxed">
              ગુજરાતની રહસ્યમય જગ્યાઓ, સદીઓ જૂની લોકવાયકાઓ (Oral Folklore) અને વિજ્ઞાન તેમજ સરકારી ગેઝેટિયર્સ આધારિત ફોરેન્સિક વાસ્તવિકતા (Ground Reality).
            </p>
          </div>

          <div className="bg-[#121c2e] border-2 border-amber-600/40 p-4 rounded-xl shadow-lg flex-shrink-0 text-center font-mono">
            <span className="text-3xl font-black text-amber-400 font-['Outfit'] block">45</span>
            <span className="text-[10px] text-amber-200/70 uppercase tracking-wider">Oral Folklore vs Reality</span>
          </div>
        </div>

        {/* Filter controls */}
        <div className="pt-6 mt-6 border-t border-amber-600/30 flex flex-wrap items-center justify-between gap-3">
          
          {/* Search box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-amber-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Search Dumas Beach, Shamlaji, Uparkot..."
              className="w-full pl-9 pr-4 py-2 bg-[#0c1524] border-2 border-amber-600/40 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 transition-colors font-mono"
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
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white border-black shadow-[2px_2px_0px_#000]'
                    : 'bg-[#121c2e] text-amber-200/80 border-amber-600/30 hover:text-white hover:border-amber-500'
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

            return (
              <motion.article
                key={story.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className="bg-[#0f1a2d] border-2 border-amber-600/40 hover:border-amber-400/80 rounded-2xl overflow-hidden shadow-[4px_4px_0px_rgba(0,0,0,0.6)] flex flex-col justify-between transition-colors group"
              >
                {/* Media Image Header */}
                <div 
                  className="h-52 w-full bg-cover bg-center relative p-3 flex flex-col justify-between overflow-hidden"
                  style={{ backgroundImage: `url('${story.imageUrl}')` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f1a2d] via-black/40 to-black/70 pointer-events-none" />

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

                  {/* Bottom Header: Fact-check Badge */}
                  <div className="relative z-10 flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded bg-amber-500 text-slate-950 border border-black shadow-sm font-mono">
                      {story.factCheckBadge || 'Documented Lore'}
                    </span>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-5 flex-1 flex flex-col">
                  
                  <div className="mb-3">
                    <span className="text-xs font-bold text-amber-400 font-['Noto_Sans_Gujarati']">
                      {story.gujaratiName}
                    </span>
                    <h3 className="text-lg font-black text-white font-['Lora',serif] leading-snug group-hover:text-amber-300 transition-colors">
                      {story.name}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                      {story.tagline}
                    </p>
                  </div>

                  {/* Myth vs Reality Tab Switcher (Sindoor Madder vs Haldi Sandstone) */}
                  <div className="grid grid-cols-2 gap-1 bg-[#09101c] p-1 rounded-lg border border-amber-600/30 text-xs font-bold my-3">
                    <button
                      onClick={() => toggleTab(story.id, 'folklore')}
                      className={`py-1 rounded text-center transition-all ${
                        activeTab === 'folklore'
                          ? 'bg-rose-900 text-amber-100 shadow-sm border border-rose-700/60'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      📜 Oral Folklore
                    </button>
                    <button
                      onClick={() => toggleTab(story.id, 'reality')}
                      className={`py-1 rounded text-center transition-all ${
                        activeTab === 'reality'
                          ? 'bg-amber-600 text-slate-950 shadow-sm border border-amber-400'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      🔬 Ground Reality
                    </button>
                  </div>

                  {/* Dynamic Tab Body */}
                  <div className="text-xs text-slate-200 bg-[#09101c]/80 p-3.5 rounded-lg border border-amber-600/20 min-h-[95px] flex items-center">
                    <p className="line-clamp-4 leading-relaxed font-['Lora',serif]">
                      {activeTab === 'folklore' ? story.theFolklore : story.theGroundReality}
                    </p>
                  </div>

                </div>

                {/* Card Footer: Legal Access */}
                <div className="px-5 py-3 border-t border-amber-600/20 bg-[#09101c]/60 flex items-center justify-between text-[11px] text-slate-300">
                  <span className="flex items-center gap-1 font-mono text-[10px]">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                    {typeof story.legalAccess === 'string'
                      ? story.legalAccess.replace(/_/g, ' ').toUpperCase()
                      : (story.legalAccess?.accessType || 'PUBLIC OPEN')}
                  </span>

                  <span className="text-amber-400 font-bold hover:underline cursor-pointer">
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
