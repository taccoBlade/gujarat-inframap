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

  if (dismissed) return null;

  return (
    <>
      {/* 1. Offline Mode Alert Banner (0 Bars in Kutch or Dangs) */}
      {!isOnline && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="sticky top-16 z-30 bg-amber-500 text-slate-950 px-4 py-2.5 font-bold text-xs flex items-center justify-between border-b-2 border-black shadow-lg"
        >
          <div className="flex items-center gap-2.5 max-w-5xl mx-auto flex-grow">
            <div className="w-6 h-6 rounded bg-black/20 flex items-center justify-center flex-shrink-0">
              <WifiOff className="w-3.5 h-3.5" />
            </div>
            <div>
              <span>Offline Roadtrip Mode Active • </span>
              <span className="font-normal">
                Zero signal detected (Kutch White Desert / Dang Forest). All 34 districts, stories &amp; EV highway lifelines are accessible offline.
              </span>
            </div>
          </div>
          <button 
            onClick={() => setDismissed(true)}
            className="p-1 rounded bg-black/10 hover:bg-black/20 text-slate-950 ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* 2. PWA Install & Offline Pack Utility Pill (When Online) */}
      {isOnline && (isInstallPromptAvailable || !offlinePackReady) && (
        <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2 text-xs">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            
            <div className="flex items-center gap-2 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-[11px] text-amber-400 font-bold uppercase">
                Remote Highway Pack
              </span>
              <span className="hidden sm:inline text-slate-400 text-[11px]">
                {offlinePackReady 
                  ? 'All 34 districts & maps cached for offline travel' 
                  : 'Pre-cache Gujarat for zero-reception forest & desert roadtrips'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Pre-download Offline Pack Button */}
              {!offlinePackReady ? (
                <button
                  onClick={downloadOfflinePack}
                  disabled={offlinePackProgress > 0 && offlinePackProgress < 100}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-[11px] font-bold flex items-center gap-1.5 transition-colors disabled:opacity-60"
                >
                  <Download className="w-3 h-3 text-amber-400" />
                  <span>
                    {offlinePackProgress > 0 
                      ? `Caching ${offlinePackProgress}%...` 
                      : 'Download Offline Pack (2.4 MB)'}
                  </span>
                </button>
              ) : (
                <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Offline Ready ✓</span>
                </span>
              )}

              {/* Install PWA Prompt */}
              {isInstallPromptAvailable && (
                <button
                  onClick={triggerPwaInstall}
                  className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] flex items-center gap-1.5 shadow-[1px_1px_0px_#000] transition-colors"
                >
                  <Smartphone className="w-3 h-3" />
                  <span>Install App</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
};
