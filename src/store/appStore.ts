import { create } from 'zustand';
import { MIN_SPLASH_MS } from '../app/config/constants';
import { initializeDatabase } from '../database/init';
import { errorMessage, sleep } from '../utils/format';
import { useAuthStore } from './authStore';

interface AppState {
  isReady: boolean;
  initError: string | null;
  initialize: () => Promise<void>;
}

export const useAppStore = create<AppState>(set => ({
  isReady: false,
  initError: null,
  initialize: async () => {
    set({ initError: null });
    try {
      await Promise.all([
        (async () => {
          await initializeDatabase();
          await useAuthStore.getState().restoreSession();
        })(),
        sleep(MIN_SPLASH_MS),
      ]);
      set({ isReady: true });
    } catch (e) {
      // Message only; never log tokens, paths or receipt content.
      set({ initError: errorMessage(e) });
    }
  },
}));
