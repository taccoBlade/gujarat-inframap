import React, { useEffect, useState } from 'react';
import { useAtlasStore } from '../../stores/useAtlasStore';
import { WifiOff, Download, CheckCircle, Smartphone, X, Sparkles, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const OfflineBanner: React.FC = () => {
  const { 
    isOnline, 
    setIsOnline, 
    isInstallPromptAvailable, 
    triggerPwaInstall, 
    offlinePackProgress, 
    offlinePackReady, 
    downloadOfflinePack,
    setDeferredInstallPrompt 
  } = useAtlasStore();

  const [dismissed, setDismissed] = useState(false);
  const [showIosPrompt, setShowIosPrompt] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => {
      setIsOnline(false);
      setDismissed(false); // Re-surface alert when losing connection
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Detect iOS Safari
    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;
    if (isIos && !isStandalone) {
      setShowIosPrompt(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [setIsOnline, setDeferredInstallPrompt]);

  if (dismissed || isOnline) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        className="sticky top-16 z-30 bg-amber-500 text-slate-950 px-4 py-2 font-bold text-xs flex items-center justify-between border-b border-amber-600 shadow-md"
      >
        <div className="flex items-center gap-2.5 max-w-5xl mx-auto flex-grow">
          <div className="w-6 h-6 rounded bg-black/15 flex items-center justify-center flex-shrink-0">
            <WifiOff className="w-3.5 h-3.5" />
          </div>
          <div>
            <span>Offline Roadtrip Mode Active • </span>
            <span className="font-normal opacity-90">
              Zero cellular signal detected. All 34 districts, stories &amp; EV lifelines are available offline from cache.
            </span>
          </div>
        </div>
        <button 
          onClick={() => setDismissed(true)}
          className="p-1 rounded bg-black/10 hover:bg-black/20 text-slate-950 ml-2 transition-colors"
          title="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};
