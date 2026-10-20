import { create } from 'zustand';
import { AtlasMode, UserPassportProfile } from '../types/atlas';
import { GUJARAT_34_DISTRICTS } from '../data/passport-districts';
import { syncProfileToFirestore, logoutUser } from '../lib/firebase';
import confetti from 'canvas-confetti';

interface AtlasState {
  currentMode: AtlasMode;
  theme: 'dark' | 'light';
  searchQuery: string;
  selectedDistrict: string | null;
  selectedStoryId: string | null;
  activeShareModal: boolean;
  isAuthModalOpen: boolean;
  isOnboardingOpen: boolean;
  userProfile: UserPassportProfile;

  // PWA & Offline Roadtrip state
  isOnline: boolean;
  isInstallPromptAvailable: boolean;
  deferredInstallPrompt: any;
  offlinePackProgress: number; // 0 to 100
  offlinePackReady: boolean;

  // EV Corridor state
  selectedEVStationId: string | null;
  evFilterCorridor: string;
  evFilterFastOnly: boolean;
  evFilterDgBackupOnly: boolean;

  // Actions
  setMode: (mode: AtlasMode) => void;
  toggleTheme: () => void;
  setSearchQuery: (query: string) => void;
  setSelectedDistrict: (districtId: string | null) => void;
  setSelectedStoryId: (storyId: string | null) => void;
  setShareModalOpen: (open: boolean) => void;
  setAuthModalOpen: (open: boolean) => void;
  setOnboardingOpen: (open: boolean) => void;

  // PWA Actions
  setIsOnline: (online: boolean) => void;
  setDeferredInstallPrompt: (prompt: any) => void;
  triggerPwaInstall: () => Promise<boolean>;
  downloadOfflinePack: () => Promise<void>;

  // EV Actions
  setSelectedEVStationId: (id: string | null) => void;
  setEvFilterCorridor: (corridor: string) => void;
  setEvFilterFastOnly: (fast: boolean) => void;
  setEvFilterDgBackupOnly: (dg: boolean) => void;

  // Auth & Profile Actions
  setLoggedInUser: (profile: UserPassportProfile) => void;
  logout: () => void;
  setHomeDistrict: (districtId: string) => void;
  claimDistrictStamp: (districtId: string) => { success: boolean; message: string };
  toggleBookmark: (storyId: string) => void;
  resetPassport: () => void;
  // Dossier & Saved Locations
  activeDossierAsset: any | null;
  setActiveDossierAsset: (asset: any | null) => void;
  saveLocation: (loc: { name: string; lat: number; lng: number; category?: string; notes?: string }) => void;
  removeSavedLocation: (id: string) => void;
  detectAndSaveCurrentLocation: () => Promise<{ success: boolean; lat?: number; lng?: number; message: string }>;
}

const DEFAULT_PROFILE: UserPassportProfile = {
  uid: 'guest_' + Math.random().toString(36).substring(7),
  name: 'Gujarat Explorer',
  handle: '@explorer',
  homeDistrict: 'ahmedabad',
  collectedStampIds: ['ahmedabad'], // Start with home district stamped!
  bookmarkedStoryIds: [],
  visitedPlaceIds: ['ahmedabad'],
  badges: ['solanki_explorer'],
  joinedDate: new Date().toISOString().split('T')[0],
  isLoggedIn: false
};

function getSavedProfile(): UserPassportProfile {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem('gujarat_passport_profile');
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_PROFILE, ...parsed };
    }
  } catch (e) {
    console.error('Failed to parse saved passport profile:', e);
  }
  return DEFAULT_PROFILE;
}

export const useAtlasStore = create<AtlasState>((set, get) => ({
  currentMode: 'explore',
  theme: 'light',
  searchQuery: '',
  selectedDistrict: null,
  selectedStoryId: null,
  activeShareModal: false,
  isAuthModalOpen: false,
  isOnboardingOpen: false,
  userProfile: getSavedProfile(),

  // PWA initial state
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  isInstallPromptAvailable: false,
  deferredInstallPrompt: null,
  offlinePackProgress: 0,
  offlinePackReady: typeof localStorage !== 'undefined' ? localStorage.getItem('gujarat_offline_pack_ready') === 'true' : false,

  // EV initial state
  selectedEVStationId: null,
  evFilterCorridor: 'all',
  evFilterFastOnly: false,
  evFilterDgBackupOnly: false,

  setMode: (mode) => set({ currentMode: mode }),

  toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),

  setSearchQuery: (query) => set({ searchQuery: query }),

  setSelectedDistrict: (districtId) => set({ selectedDistrict: districtId }),

  setSelectedStoryId: (storyId) => set({ selectedStoryId: storyId }),

  setShareModalOpen: (open) => set({ activeShareModal: open }),

  setAuthModalOpen: (open) => set({ isAuthModalOpen: open }),

  setOnboardingOpen: (open) => set({ isOnboardingOpen: open }),

  // PWA & Offline methods
  setIsOnline: (online) => set({ isOnline: online }),

  setDeferredInstallPrompt: (prompt) => set({ deferredInstallPrompt: prompt, isInstallPromptAvailable: Boolean(prompt) }),

  triggerPwaInstall: async () => {
    const prompt = get().deferredInstallPrompt;
    if (!prompt) return false;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === 'accepted') {
      set({ deferredInstallPrompt: null, isInstallPromptAvailable: false });
      return true;
    }
    return false;
  },

  downloadOfflinePack: async () => {
    set({ offlinePackProgress: 10 });
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'DOWNLOAD_OFFLINE_PACK' });
    }
    // Simulate / step progress gracefully
    for (let p = 25; p <= 100; p += 25) {
      await new Promise(r => setTimeout(r, 200));
      set({ offlinePackProgress: p });
    }
    localStorage.setItem('gujarat_offline_pack_ready', 'true');
    set({ offlinePackReady: true });

    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#10b981', '#34d399', '#059669', '#f59e0b']
      });
    } catch (e) {}
  },

  // EV Corridor methods
  setSelectedEVStationId: (id) => set({ selectedEVStationId: id }),
  setEvFilterCorridor: (corridor) => set({ evFilterCorridor: corridor }),
  setEvFilterFastOnly: (fast) => set({ evFilterFastOnly: fast }),
  setEvFilterDgBackupOnly: (dg) => set({ evFilterDgBackupOnly: dg }),

  // User Auth & Passport methods
  setLoggedInUser: (profile) => {
    localStorage.setItem('gujarat_passport_profile', JSON.stringify(profile));
    set({ userProfile: profile, isAuthModalOpen: false });
    if (profile.isLoggedIn && !profile.uid.startsWith('guest_')) {
      syncProfileToFirestore(profile);
    }
  },

  logout: () => {
    logoutUser();
    const guest: UserPassportProfile = {
      ...DEFAULT_PROFILE,
      uid: 'guest_' + Math.random().toString(36).substring(7),
      isLoggedIn: false
    };
    localStorage.setItem('gujarat_passport_profile', JSON.stringify(guest));
    set({ userProfile: guest });
  },

  setHomeDistrict: (districtId) => {
    const current = get().userProfile;
    const updated: UserPassportProfile = {
      ...current,
      homeDistrict: districtId,
      collectedStampIds: Array.from(new Set([...current.collectedStampIds, districtId]))
    };
    localStorage.setItem('gujarat_passport_profile', JSON.stringify(updated));
    set({ userProfile: updated, isOnboardingOpen: false });
    if (updated.isLoggedIn && !updated.uid.startsWith('guest_')) {
      syncProfileToFirestore(updated);
    }

    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#f59e0b', '#fbbf24', '#d97706', '#ec4899', '#3b82f6']
      });
    } catch (e) {}
  },

  claimDistrictStamp: (districtId) => {
    const current = get().userProfile;
    const district = GUJARAT_34_DISTRICTS.find(d => d.id === districtId);
    if (!district) return { success: false, message: 'Invalid district' };

    if (current.collectedStampIds.includes(districtId)) {
      return { success: false, message: `${district.name} is already stamped in your passport!` };
    }

    const updated: UserPassportProfile = {
      ...current,
      collectedStampIds: [...current.collectedStampIds, districtId],
      lastCheckedInDistrict: districtId
    };

    localStorage.setItem('gujarat_passport_profile', JSON.stringify(updated));
    set({ userProfile: updated });
    if (updated.isLoggedIn && !updated.uid.startsWith('guest_')) {
      syncProfileToFirestore(updated);
    }

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#d97706', '#b45309', '#ef4444', '#10b981']
      });
    } catch (e) {}

    return { 
      success: true, 
      message: `🎉 Stamped! You unlocked ${district.name} (${district.gujaratiName}). ${updated.collectedStampIds.length}/34 Districts Completed!` 
    };
  },

  toggleBookmark: (storyId) => {
    const current = get().userProfile;
    const exists = current.bookmarkedStoryIds.includes(storyId);
    const updated: UserPassportProfile = {
      ...current,
      bookmarkedStoryIds: exists
        ? current.bookmarkedStoryIds.filter(id => id !== storyId)
        : [...current.bookmarkedStoryIds, storyId]
    };
    localStorage.setItem('gujarat_passport_profile', JSON.stringify(updated));
    set({ userProfile: updated });
    if (updated.isLoggedIn && !updated.uid.startsWith('guest_')) {
      syncProfileToFirestore(updated);
    }
  },

  resetPassport: () => {
    localStorage.removeItem('gujarat_passport_profile');
    set({ userProfile: DEFAULT_PROFILE });
  },

  activeDossierAsset: null,
  setActiveDossierAsset: (asset) => set({ activeDossierAsset: asset }),

  saveLocation: (loc) => {
    const current = get().userProfile;
    const existing = current.savedLocations || [];
    const newLoc = {
      id: 'loc_' + Date.now().toString(36),
      name: loc.name,
      lat: loc.lat,
      lng: loc.lng,
      savedAt: new Date().toISOString().split('T')[0],
      category: loc.category || 'User Pin',
      notes: loc.notes
    };
    const updated = {
      ...current,
      savedLocations: [newLoc, ...existing.filter(l => l.name !== loc.name)]
    };
    localStorage.setItem('gujarat_passport_profile', JSON.stringify(updated));
    set({ userProfile: updated });
    if (updated.isLoggedIn && !updated.uid.startsWith('guest_')) {
      syncProfileToFirestore(updated);
    }
  },

  removeSavedLocation: (id) => {
    const current = get().userProfile;
    const existing = current.savedLocations || [];
    const updated = {
      ...current,
      savedLocations: existing.filter(l => l.id !== id)
    };
    localStorage.setItem('gujarat_passport_profile', JSON.stringify(updated));
    set({ userProfile: updated });
    if (updated.isLoggedIn && !updated.uid.startsWith('guest_')) {
      syncProfileToFirestore(updated);
    }
  },

  detectAndSaveCurrentLocation: async () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      return { success: false, message: 'Geolocation is not supported by your browser.' };
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = parseFloat(pos.coords.latitude.toFixed(5));
          const lng = parseFloat(pos.coords.longitude.toFixed(5));
          const current = get().userProfile;
          const existing = current.savedLocations || [];
          const liveLoc = {
            id: 'gps_' + Date.now().toString(36),
            name: '📍 Live GPS Spot (' + lat + ', ' + lng + ')',
            lat,
            lng,
            savedAt: new Date().toISOString().split('T')[0],
            category: 'Live GPS Pin'
          };
          const updated = {
            ...current,
            currentGpsCoords: [lat, lng] as [number, number],
            savedLocations: [liveLoc, ...existing.filter(l => !l.id.startsWith('gps_'))]
          };
          localStorage.setItem('gujarat_passport_profile', JSON.stringify(updated));
          set({ userProfile: updated });
          if (updated.isLoggedIn && !updated.uid.startsWith('guest_')) {
            syncProfileToFirestore(updated);
          }
          resolve({
            success: true,
            lat,
            lng,
            message: 'Live GPS Location captured and saved!'
          });
        },
        (err) => {
          resolve({ success: false, message: err.message || 'Could not fetch GPS coordinates.' });
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  }
}));
