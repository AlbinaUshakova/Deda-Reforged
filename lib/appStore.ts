'use client';

import { create } from 'zustand';
import {
  DEFAULT_SETTINGS,
  getSettings,
  setSettings,
  subscribeToSettings,
  type Settings,
} from '@/lib/settings';
import {
  getLocalProgressMap,
  loadProgressMapCached,
  subscribeToProgress,
  type ProgressMap,
} from '@/lib/supabase';

type AppStoreState = {
  settings: Settings;
  progressMap: ProgressMap;
  alphabetOpen: boolean;
  alphabetToggleRequest: number;
  profileMenuOpen: boolean;
  hydrate: () => Promise<void>;
  updateSettings: (next: Partial<Settings>) => void;
  refreshProgress: (forceRefresh?: boolean) => Promise<void>;
  requestAlphabetToggle: () => void;
  setAlphabetOpen: (open: boolean) => void;
  setProfileMenuOpen: (open: boolean) => void;
};

let hydrationPromise: Promise<void> | null = null;
let subscriptionsInitialized = false;

export const useAppStore = create<AppStoreState>((set, get) => ({
  settings: DEFAULT_SETTINGS,
  progressMap: {},
  alphabetOpen: false,
  alphabetToggleRequest: 0,
  profileMenuOpen: false,
  hydrate: async () => {
    if (typeof window === 'undefined') return;

    if (!subscriptionsInitialized) {
      subscriptionsInitialized = true;
      subscribeToSettings(settings => {
        set({ settings });
      });
      subscribeToProgress(progressMap => {
        set({ progressMap });
      });
    }

    set({
      settings: getSettings(),
      progressMap: getLocalProgressMap(),
    });

    if (!hydrationPromise) {
      hydrationPromise = (async () => {
        const progressMap = await loadProgressMapCached();
        set({ progressMap, settings: getSettings() });
      })().finally(() => {
        hydrationPromise = null;
      });
    }

    await hydrationPromise;
  },
  updateSettings: next => {
    setSettings(next);
  },
  refreshProgress: async (forceRefresh = false) => {
    const progressMap = await loadProgressMapCached(forceRefresh);
    set({ progressMap });
  },
  requestAlphabetToggle: () => {
    set(state => ({
      alphabetToggleRequest: state.alphabetToggleRequest + 1,
    }));
  },
  setAlphabetOpen: open => {
    if (get().alphabetOpen === open) return;
    set({ alphabetOpen: open });
  },
  setProfileMenuOpen: open => {
    if (get().profileMenuOpen === open) return;
    set({ profileMenuOpen: open });
  },
}));
