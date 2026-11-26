import { create } from 'zustand';

export type AuthStatus = 'unknown' | 'signedOut' | 'signedIn';

interface AuthState {
  status: AuthStatus;
  /** Phase 2 replaces this stub with a Google Sign-In silent restore. */
  restoreSession: () => Promise<void>;
  setStatus: (status: AuthStatus) => void;
}

export const useAuthStore = create<AuthState>(set => ({
  status: 'unknown',
  restoreSession: async () => {
    set({ status: 'signedOut' });
  },
  setStatus: status => set({ status }),
}));
