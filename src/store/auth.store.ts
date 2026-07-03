import { create } from 'zustand';
import type { User, AuthCredentials } from '../types/user';
import { authApi } from '../api/auth';

// ---------------------------------------------------------------------------
// Auth store — replaces JSP session user + ExtJS readOnly user fields
// ---------------------------------------------------------------------------

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (credentials: AuthCredentials) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  loadSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (credentials) => {
    const response = await authApi.login(credentials);
    set({
      user: response.user,
      token: response.token ?? null,
      isAuthenticated: true,
    });
  },

  logout: () => {
    authApi.logout().catch(() => {}); // Fire-and-forget
    set({ user: null, token: null, isAuthenticated: false });
  },

  setUser: (user) => set({ user, isAuthenticated: true }),

  loadSession: async () => {
    try {
      const response = await authApi.me();
      set({
        user: response.user,
        token: response.token ?? null,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch {
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
