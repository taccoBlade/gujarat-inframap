import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAtlasStore } from '../../stores/useAtlasStore';
import unfilteredData from '../../../data/gujarat_unfiltered.json';
import { Sparkles, Bookmark, BookmarkCheck, Search, ShieldAlert, Eye, Info } from 'lucide-react';

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
  const { userProfile, toggleBookmark, afterDarkRadarActive } = useAtlasStore();
  const [activeTabMap, setActiveTabMap] = useState<Record<string, 'folklore' | 'reality'>>({});
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const stories: StoryItem[] = ((unfilteredData as { stories?: StoryItem[] }).stories || (unfilteredData as unknown as StoryItem[]));

  const filteredStories = stories.filter((story) => {
    // If After Dark radar is on, prioritize folklore and eerie places
    if (afterDarkRadarActive && story.category !== 'folklore_eerie' && story.collection !== 'after_dark') {
      return false;
    }

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
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      {/* Editorial Header */}
      <div className="mb-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/10 border border-rose-500/30 rounded-full text-xs font-bold text-rose-400 font-mono uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>EDITORIAL DISCOVERY • 45 DOCUMENTED STORIES</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-['Outfit'] tracking-tight">
          Gujarat <span className="text-rose-400 font-serif italic">Unfiltered</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl font-['Lora']">
          "Gujarat has stories you haven’t heard." Strange places. Forgotten oral folklore. Forensic ground realities.
        </p>

        {/* Filter controls */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-3">
          
          {/* Search box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Search by story or district..."
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border-2 border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-400 transition-colors"
            />
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {['all', 'folklore_eerie', 'heritage', 'nature', 'unusual_landmark'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all border ${
                  selectedCategory === cat
                    ? 'bg-rose-500 text-white border-black shadow-[2px_2px_0px_#000]'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {cat.replace('_', ' ')}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Stories Grid with 3D Tilt Cards */}
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
                className="bg-slate-900 border-2 border-slate-700 hover:border-rose-400/80 rounded-2xl overflow-hidden shadow-[4px_4px_0px_#000] flex flex-col justify-between transition-colors group"
              >
                {/* Media Image Header */}
                <div 
                  className="h-52 w-full bg-cover bg-center relative p-3 flex flex-col justify-between overflow-hidden"
                  style={{ backgroundImage: `url('${story.imageUrl}')` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-black/60 pointer-events-none" />

                  {/* Top Badges */}
                  <div className="relative z-10 flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-md bg-black/70 backdrop-blur text-white border border-white/20">
                      📍 {story.district}
                    </span>

                    <button
                      onClick={() => toggleBookmark(story.id)}
                      className={`p-1.5 rounded-md backdrop-blur border transition-all ${
                        isBookmarked 
                          ? 'bg-rose-500 text-white border-rose-400 shadow' 
                          : 'bg-black/60 text-slate-300 border-white/20 hover:text-white'
                      }`}
                    >
                      {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Bottom Header: Fact-check Badge */}
                  <div className="relative z-10 flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-rose-500/90 text-slate-950 border border-black shadow-sm font-mono">
                      {story.factCheckBadge || 'Verified Audit'}
                    </span>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-5 flex-1 flex flex-col">
                  
                  <div className="mb-3">
                    <span className="text-xs font-bold text-amber-400 font-['Noto_Sans_Gujarati']">
                      {story.gujaratiName}
                    </span>
                    <h3 className="text-lg font-black text-white font-['Outfit'] leading-snug group-hover:text-rose-300 transition-colors">
                      {story.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {story.tagline}
                    </p>
                  </div>

                  {/* Myth vs Reality Tab Switcher */}
                  <div className="grid grid-cols-2 gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-bold my-3">
                    <button
                      onClick={() => toggleTab(story.id, 'folklore')}
                      className={`py-1 rounded text-center transition-all ${
                        activeTab === 'folklore'
                          ? 'bg-rose-500 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      👁️ Folklore Myth
                    </button>
                    <button
                      onClick={() => toggleTab(story.id, 'reality')}
                      className={`py-1 rounded text-center transition-all ${
                        activeTab === 'reality'
                          ? 'bg-emerald-500 text-slate-950 shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      🔬 Ground Reality
                    </button>
                  </div>

                  {/* Dynamic Tab Body */}
                  <div className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 min-h-[90px] flex items-center">
                    <p className="line-clamp-4 leading-relaxed font-['Lora']">
                      {activeTab === 'folklore' ? story.theFolklore : story.theGroundReality}
                    </p>
                  </div>

                </div>

                {/* Card Footer: Legal Access & Photo Tip */}
                <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1 font-mono text-[10px]">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                    {typeof story.legalAccess === 'string'
                      ? story.legalAccess.replace(/_/g, ' ').toUpperCase()
                      : (story.legalAccess?.accessType || 'PUBLIC OPEN')}
                  </span>

                  <span className="text-rose-400 font-bold hover:underline cursor-pointer">
                    Read Forensic Dossier →
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
