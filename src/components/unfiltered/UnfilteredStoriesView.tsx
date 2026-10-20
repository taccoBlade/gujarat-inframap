import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAtlasStore } from '../../stores/useAtlasStore';
import { getRegionalCulture } from '../../utils/cultural-regions';
import unfilteredData from '../../../data/gujarat_unfiltered.json';
import { ToranOrnamentalBorder, AjrakhStarPattern } from '../cultural/GujaratiPatterns';
import { getDistrictPhoto } from '../../utils/district-photos';
import { Sparkles, Bookmark, BookmarkCheck, Search, ShieldAlert, Eye, Info, Compass, BookOpen, CheckCircle } from 'lucide-react';

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
  const { userProfile, toggleBookmark, theme, setActiveDossierAsset } = useAtlasStore();
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
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 transition-colors duration-200 ${
      theme === 'dark' ? 'text-[#F1E8D7]' : 'text-[#101827]'
    }`}>
      
      {/* Editorial Header in Gen Z Neo-Brutalist Frame */}
      <div className={`relative border-2 rounded-2xl p-6 sm:p-8 mb-6 sm:mb-8 shadow-[4px_4px_0px_#101827] overflow-hidden transition-colors ${
        theme === 'dark' ? 'bg-[#151F30] border-[#25324A]' : 'bg-[#FAF6ED] border-[#25324A]'
      }`}>
        {/* Toran Border Trim on Top */}
        <ToranOrnamentalBorder className="rounded-t mb-4 -mt-6 -mx-6 sm:-mt-8 sm:-mx-8" height={10} />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-[11px] font-bold font-mono uppercase tracking-wider bg-[#9D233B]/15 text-[#9D233B] border border-[#9D233B]/40">
              <Sparkles className="w-3.5 h-3.5" />
              <span>EDITORIAL ARCHIVE • ૪૫ અજાણી વાતો (45 DOSSIERS)</span>
            </div>

            <h1 className={`text-2xl sm:text-3xl md:text-4xl font-black font-editorial tracking-tight ${
              theme === 'dark' ? 'text-white' : 'text-[#101827]'
            }`}>
              Gujarat <span className="text-[#FF9418] italic font-serif">Unfiltered</span>
            </h1>

            <p className={`text-xs sm:text-sm font-['Noto_Sans_Gujarati',sans-serif] leading-relaxed ${
              theme === 'dark' ? 'text-[#8F9CAE]' : 'text-[#606F7B]'
            }`}>
              ગુજરાતની રહસ્યમય જગ્યાઓ, સદીઓ જૂની લોકવાયકાઓ (Oral Folklore) અને વિજ્ઞાન તેમજ સરકારી ગેઝેટિયર્સ આધારિત ફોરેન્સિક વાસ્તવિકતા (Ground Reality).
            </p>
          </div>

          <div className={`px-4 py-2.5 rounded-xl border-2 text-center shadow-[2px_2px_0px_#101827] flex-shrink-0 ${
            theme === 'dark' ? 'bg-[#101827] border-[#25324A]' : 'bg-white border-[#25324A]'
          }`}>
            <span className="text-2xl font-black font-mono block text-[#FF9418]">45</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8F9CAE]">Folklore vs Reality</span>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="pt-5 mt-5 border-t-2 border-[#25324A] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Search box */}
          <div className="relative flex-grow max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8F9CAE]" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Search Dumas Beach, Shamlaji, Uparkot..."
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-semibold outline-none border-2 transition-all ${
                theme === 'dark'
                  ? 'bg-[#101827] border-[#25324A] text-white placeholder-[#8F9CAE] focus:border-[#FF9418]'
                  : 'bg-white border-[#25324A] text-[#101827] placeholder-[#8F9CAE] focus:border-[#FF9418]'
              }`}
            />
          </div>

          {/* Category Chips with Ajrakh & Mineral Dye Tones */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
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
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border-2 whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-[#FF9418] text-[#101827] border-[#101827] shadow-[2px_2px_0px_#101827]'
                    : theme === 'dark'
                      ? 'bg-[#101827] text-[#8F9CAE] border-[#25324A] hover:border-[#FF9418] hover:text-white'
                      : 'bg-white text-[#25324A] border-[#25324A] hover:border-[#FF9418]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Stories Grid */}
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
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                className={`rounded-2xl border-2 overflow-hidden shadow-[4px_4px_0px_#101827] hover:shadow-[6px_6px_0px_#9D233B] flex flex-col justify-between transition-all duration-200 group ${
                  theme === 'dark' ? 'bg-[#151F30] border-[#25324A]' : 'bg-[#FAF6ED] border-[#25324A]'
                }`}
              >
                {/* Regional Cultural Toran Trim */}
                <div style={{ height: '3px', background: culture.borderTrimStyle }} className="w-full" />

                {/* Media Image Header with district-accurate photo & guaranteed visibility */}
                <div className="relative aspect-[16/10] w-full overflow-hidden border-b-2 border-[#25324A] bg-[#101827]">
                  <img
                    src={story.imageUrl || getDistrictPhoto(story.district, story.id)}
                    alt={story.name}
                    loading="lazy"
                    onError={(e) => {
                      const target = e.currentTarget;
                      const fallback = getDistrictPhoto(story.district, story.id);
                      if (target.src !== fallback) {
                        target.src = fallback;
                      } else {
                        target.src = '/images/destinations/statue-of-unity.jpg';
                      }
                    }}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101827] via-black/20 to-black/35 pointer-events-none" />

                  {/* Top Badges */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#101827]/90 text-[#FF9418] border border-[#25324A] backdrop-blur-sm">
                      📍 {story.district}
                    </span>

                    <button
                      onClick={() => toggleBookmark(story.id)}
                      className={`p-1.5 rounded-lg border-2 transition-all backdrop-blur-sm ${
                        isBookmarked 
                          ? 'bg-[#FF9418] text-[#101827] border-[#101827] shadow-[2px_2px_0px_#101827]' 
                          : 'bg-[#101827]/85 text-[#8F9CAE] border-[#25324A] hover:text-white'
                      }`}
                      aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark story'}
                    >
                      {isBookmarked ? <BookmarkCheck className="w-4 h-4 text-[#101827]" /> : <Bookmark className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Bottom Header: Region Name & Fact-check Badge */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#FF9418] text-[#101827] border border-[#101827] shadow-sm font-mono">
                      {story.factCheckBadge || 'Documented Lore'}
                    </span>
                    <span className="text-[10px] font-mono text-[#F1E8D7] bg-[#101827]/90 px-2 py-0.5 rounded border border-[#25324A] backdrop-blur-sm">
                      {culture.primaryIcon} {culture.regionName}
                    </span>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col">
                  
                  <div className="mb-2">
                    <span className="text-xs font-bold text-[#FF9418] font-['Noto_Sans_Gujarati']">
                      {story.gujaratiName}
                    </span>
                    <h3 className={`text-lg font-black font-editorial leading-snug transition-colors line-clamp-1 ${
                      theme === 'dark' ? 'text-white group-hover:text-[#FF9418]' : 'text-[#101827] group-hover:text-[#9D233B]'
                    }`}>
                      {story.name}
                    </h3>

                    {/* Regional Folk Tag */}
                    <div className="mt-1">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold ${culture.badgeBg} ${culture.textColor} border ${culture.badgeBorder}`}>
                        {culture.culturalTag}
                      </span>
                    </div>

                    <p className={`text-xs mt-2 line-clamp-2 leading-relaxed ${
                      theme === 'dark' ? 'text-[#8F9CAE]' : 'text-[#606F7B]'
                    }`}>
                      {story.tagline}
                    </p>
                  </div>

                  {/* Myth vs Reality Tab Switcher */}
                  <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl border-2 border-[#25324A] bg-[#101827] text-xs font-bold my-3" role="tablist">
                    <button
                      role="tab"
                      aria-selected={activeTab === 'folklore'}
                      onClick={() => toggleTab(story.id, 'folklore')}
                      className={`py-1 rounded-lg text-center transition-all ${
                        activeTab === 'folklore'
                          ? 'bg-[#9D233B] text-white shadow-[2px_2px_0px_#101827] font-black'
                          : 'text-[#8F9CAE] hover:text-white'
                      }`}
                    >
                      📜 Oral Folklore
                    </button>
                    <button
                      role="tab"
                      aria-selected={activeTab === 'reality'}
                      onClick={() => toggleTab(story.id, 'reality')}
                      className={`py-1 rounded-lg text-center transition-all ${
                        activeTab === 'reality'
                          ? 'bg-[#1C6555] text-white shadow-[2px_2px_0px_#101827] font-black'
                          : 'text-[#8F9CAE] hover:text-white'
                      }`}
                    >
                      🔬 Ground Reality
                    </button>
                  </div>

                  {/* Dynamic Tab Body with persistent stable layout - Fully readable */}
                  <div className={`text-xs p-3.5 rounded-xl border-2 min-h-[110px] flex items-start ${
                    theme === 'dark' 
                      ? 'bg-[#101827] text-[#F1E8D7] border-[#25324A]' 
                      : 'bg-white text-[#101827] border-[#25324A]'
                  }`}>
                    <p className="leading-relaxed font-sans max-h-36 overflow-y-auto pr-1">
                      {activeTab === 'folklore' ? story.theFolklore : story.theGroundReality}
                    </p>
                  </div>

                </div>

                {/* Card Footer: Legal Access & Archival Provenance */}
                <div className={`px-4 sm:px-5 py-3 border-t-2 border-[#25324A] flex items-center justify-between text-[11px] ${
                  theme === 'dark' ? 'bg-[#101827] text-[#8F9CAE]' : 'bg-[#F1E8D7] text-[#606F7B]'
                }`}>
                  <span className="flex items-center gap-1 font-mono text-[10px] font-bold">
                    <ShieldAlert className="w-3.5 h-3.5 text-[#FF9418]" />
                    {typeof story.legalAccess === 'string'
                      ? story.legalAccess.replace(/_/g, ' ').toUpperCase()
                      : (story.legalAccess?.accessType || 'PUBLIC ACCESS')}
                  </span>

                  <button
                    onClick={() => setActiveDossierAsset({ ...story, type: 'story' })}
                    className="text-[#FF9418] font-bold hover:underline cursor-pointer flex items-center gap-1 text-xs"
                  >
                    <span>Full Dossier ↗</span>
                  </button>
                </div>

              </motion.article>
            );
          })}
        </AnimatePresence>
      </div>

    </div>
  );
};
