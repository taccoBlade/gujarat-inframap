import React, { useEffect } from 'react';
import { useAtlasStore } from './stores/useAtlasStore';
import { Header } from './components/navigation/Header';
import { GujaratPassport } from './components/passport/GujaratPassport';
import { AtlasMap } from './components/map/AtlasMap';
import { UnfilteredStoriesView } from './components/unfiltered/UnfilteredStoriesView';
import { InfrastructureDirectoryView } from './components/infrastructure/InfrastructureDirectoryView';
import { PlacesDestinationView } from './components/places/PlacesDestinationView';
import { OfflineBanner } from './components/pwa/OfflineBanner';
import { MobileBottomNav } from './components/navigation/MobileBottomNav';
import { CulturalFooter } from './components/navigation/CulturalFooter';
import { ShareableStoryCardModal } from './components/share/ShareableStoryCardModal';
import { AuthModal } from './components/auth/AuthModal';
import { OnboardingModal } from './components/auth/OnboardingModal';
import { AssetDossierModal } from './components/common/AssetDossierModal';
import { CinematicTransitionOverlay } from './components/navigation/CinematicTransitionOverlay';
import { motion, AnimatePresence } from 'framer-motion';

const fluidPageVariants = {
  initial: { opacity: 0, y: 16, scale: 0.99 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -12, scale: 0.99 }
};

const fluidTransition = {
  duration: 0.45,
  ease: [0.16, 1, 0.3, 1] as const
};

export const App: React.FC = () => {
  const { currentMode, theme } = useAtlasStore();

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.classList.toggle('theme-light', theme === 'light');
    }
  }, [theme]);

  const isMapMode = currentMode === 'explore' || currentMode === 'ev';

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#101827] text-[#F1E8D7]' : 'bg-[#F1E8D7] text-[#101827]'} font-sans`}>
      {/* Sticky Navigation Header */}
      <Header />

      {/* PWA & Offline Roadtrip Status Banner (Only appears when cellular drops) */}
      <OfflineBanner />

      {/* Main View Container with Fluid Transitions & Safe Area Mobile Spacing */}
      <main className={`relative ${isMapMode ? 'pb-20 lg:pb-0' : 'pb-28 lg:pb-12'}`}>
        {/* Persistent Atlas Map View (Preserves Leaflet Instance & Camera Pan/Zoom) */}
        <div className={isMapMode ? 'block' : 'hidden'} aria-hidden={!isMapMode}>
          <AtlasMap />
        </div>

        {/* Content Views with Fluid Framer-Motion Transitions */}
        <AnimatePresence mode="wait">
          {!isMapMode && (
            <motion.div
              key={currentMode}
              variants={fluidPageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={fluidTransition}
            >
              {currentMode === 'places' && <PlacesDestinationView />}
              {currentMode === 'passport' && <GujaratPassport />}
              {currentMode === 'unfiltered' && <UnfilteredStoriesView />}
              {currentMode === 'infrastructure' && <InfrastructureDirectoryView />}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Cultural Editorial Footer (Non-map views) */}
      <CulturalFooter />

      {/* Mobile Native-Style Bottom Navigation */}
      <MobileBottomNav />

      {/* Modals & Dialogs */}
      <AssetDossierModal />
      <CinematicTransitionOverlay />
      <AuthModal />
      <OnboardingModal />
      <ShareableStoryCardModal />
    </div>
  );
};

export default App;
