import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { useAtlasStore } from './stores/useAtlasStore';
import './styles/globals.css';

// Expose store globally for programmatic control & testing
(window as unknown as { useAtlasStore: typeof useAtlasStore }).useAtlasStore = useAtlasStore;

// Register PWA Service Worker for offline roadtrip caching
if ('serviceWorker' in navigator && typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        console.log('[PWA] Service Worker registered for offline roadtrip navigation:', reg.scope);
      })
      .catch((err) => {
        console.warn('[PWA] Service Worker registration failed:', err);
      });
  });
}

// Capture PWA install prompt
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  useAtlasStore.getState().setDeferredInstallPrompt(e);
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
