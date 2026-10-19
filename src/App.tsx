import React from 'react';
import { useAtlasStore } from './stores/useAtlasStore';
import { Header } from './components/navigation/Header';
import { GujaratPassport } from './components/passport/GujaratPassport';
import { AtlasMap } from './components/map/AtlasMap';
import { UnfilteredStoriesView } from './components/unfiltered/UnfilteredStoriesView';
import { InfrastructureDirectoryView } from './components/infrastructure/InfrastructureDirectoryView';
import { PlacesDestinationView } from './components/places/PlacesDestinationView';
import { OfflineBanner } from './components/pwa/OfflineBanner';
import { ShareableStoryCardModal } from './components/share/ShareableStoryCardModal';
import { AuthModal } from './components/auth/AuthModal';
import { OnboardingModal } from './components/auth/OnboardingModal';
import { motion, AnimatePresence } from 'framer-motion';

export const App: React.FC = () => {
  const { currentMode, theme } = useAtlasStore();

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0c1524] text-[#f7f2e8]' : 'bg-[#f7f2e8] text-[#282823]'} font-sans`}>
      {/* Sticky Navigation Header */}
      <Header />

      {/* PWA & Offline Roadtrip Status Banner */}
      <OfflineBanner />

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

          {(currentMode === 'explore' || currentMode === 'ev') && (
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
              <PlacesDestinationView />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Modals & Dialogs */}
      <AuthModal />
      <OnboardingModal />
      <ShareableStoryCardModal />
    </div>
  );
};

export default App;
