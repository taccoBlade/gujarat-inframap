import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { useAtlasStore } from './stores/useAtlasStore';
import './styles/globals.css';

// Expose store globally for programmatic control & debugging
(window as unknown as { useAtlasStore: typeof useAtlasStore }).useAtlasStore = useAtlasStore;

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
