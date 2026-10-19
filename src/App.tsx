import React from 'react';
import { useAtlasStore } from './stores/useAtlasStore';
import { Header } from './components/navigation/Header';
import { GujaratPassport } from './components/passport/GujaratPassport';
import { AtlasMap } from './components/map/AtlasMap';
import { UnfilteredStoriesView } from './components/unfiltered/UnfilteredStoriesView';
import { InfrastructureDirectoryView } from './components/infrastructure/InfrastructureDirectoryView';
import { ShareableStoryCardModal } from './components/share/ShareableStoryCardModal';
import { motion, AnimatePresence } from 'framer-motion';

export const App: React.FC = () => {
  const { currentMode, theme } = useAtlasStore();

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0b0f19] text-slate-100' : 'bg-[#f8fafc] text-slate-900'} font-sans`}>
      {/* Sticky Navigation Header */}
      <Header />

      {/* Main View Container */}
      <main className="relative">
        <AnimatePresence mode="wait">
          {currentMode === 'passport' && (
            <motion.div
              key="passport"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <GujaratPassport />
            </motion.div>
          )}

          {currentMode === 'explore' && (
            <motion.div
              key="explore"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <AtlasMap />
            </motion.div>
          )}

          {currentMode === 'unfiltered' && (
            <motion.div
              key="unfiltered"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <UnfilteredStoriesView />
            </motion.div>
          )}

          {currentMode === 'infrastructure' && (
            <motion.div
              key="infrastructure"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <InfrastructureDirectoryView />
            </motion.div>
          )}

          {currentMode === 'places' && (
            <motion.div
              key="places"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <UnfilteredStoriesView />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 9:16 Instagram Share Modal */}
      <ShareableStoryCardModal />
    </div>
  );
};

export default App;
