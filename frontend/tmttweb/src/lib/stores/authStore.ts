import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';
import { STORAGE_KEYS } from '@/config/constants';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isManager: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: true,
      isManager: true,

      setAuth: (user, token) => {
        // Sauvegarder le token dans localStorage
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
        
        set({
          user,
          token,
          isAuthenticated: true,
          isManager: user.role === 'gca' || user.role === 'luffy',
        });
      },

      clearAuth: () => {
        // Nettoyer le localStorage
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isManager: false,
        });
      },

      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
    }),
    {
      name: STORAGE_KEYS.USER,
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        isManager: state.isManager,
      }),
    }
  )
);