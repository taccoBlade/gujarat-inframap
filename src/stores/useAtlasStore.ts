import { create } from 'zustand';
import { AtlasMode, UserPassportProfile } from '../types/atlas';
import { GUJARAT_34_DISTRICTS } from '../data/passport-districts';
import confetti from 'canvas-confetti';

interface AtlasState {
  currentMode: AtlasMode;
  theme: 'dark' | 'light';
  searchQuery: string;
  selectedDistrict: string | null;
  selectedStoryId: string | null;
  afterDarkRadarActive: boolean;
  activeShareModal: boolean;
  userProfile: UserPassportProfile;

  // Actions
  setMode: (mode: AtlasMode) => void;
  toggleTheme: () => void;
  setSearchQuery: (query: string) => void;
  setSelectedDistrict: (districtId: string | null) => void;
  setSelectedStoryId: (storyId: string | null) => void;
  toggleAfterDarkRadar: () => void;
  setShareModalOpen: (open: boolean) => void;

  // Passport Actions
  setHomeDistrict: (districtId: string) => void;
  claimDistrictStamp: (districtId: string) => { success: boolean; message: string };
  toggleBookmark: (storyId: string) => void;
  resetPassport: () => void;
}

const DEFAULT_PROFILE: UserPassportProfile = {
  name: 'Gujarat Explorer',
  handle: '@explorer',
  homeDistrict: 'ahmedabad',
  collectedStampIds: ['ahmedabad'], // Start with home district stamped!
  bookmarkedStoryIds: [],
  joinedDate: new Date().toISOString().split('T')[0]
};

function getSavedProfile(): UserPassportProfile {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem('gujarat_passport_profile');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse saved passport profile:', e);
  }
  return DEFAULT_PROFILE;
}

export const useAtlasStore = create<AtlasState>((set, get) => ({
  currentMode: 'passport', // Boot straight to the viral passport experience!
  theme: 'dark',
  searchQuery: '',
  selectedDistrict: null,
  selectedStoryId: null,
  afterDarkRadarActive: false,
  activeShareModal: false,
  userProfile: getSavedProfile(),

  setMode: (mode) => set({ currentMode: mode }),

  toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),

  setSearchQuery: (query) => set({ searchQuery: query }),

  setSelectedDistrict: (districtId) => set({ selectedDistrict: districtId }),

  setSelectedStoryId: (storyId) => set({ selectedStoryId: storyId }),

  toggleAfterDarkRadar: () => set((state) => ({ afterDarkRadarActive: !state.afterDarkRadarActive })),

  setShareModalOpen: (open) => set({ activeShareModal: open }),

  setHomeDistrict: (districtId) => {
    const current = get().userProfile;
    const updated: UserPassportProfile = {
      ...current,
      homeDistrict: districtId,
      collectedStampIds: Array.from(new Set([...current.collectedStampIds, districtId]))
    };
    localStorage.setItem('gujarat_passport_profile', JSON.stringify(updated));
    set({ userProfile: updated });
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

    // 🎊 Trigger cinematic confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#d97706', '#b45309', '#ef4444', '#10b981']
      });
    } catch (e) {
      // Confetti fallback
    }

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
  },

  resetPassport: () => {
    localStorage.removeItem('gujarat_passport_profile');
    set({ userProfile: DEFAULT_PROFILE });
  }
}));
