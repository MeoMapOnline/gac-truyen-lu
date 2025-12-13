import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  checkAuth: () => Promise<void>;
  loginWithGoogle: (token: string, userInfo: any) => Promise<void>;
  logout: () => void;
  deposit: (amount: number) => Promise<void>;
  unlockChapter: (chapterId: string, price: number) => Promise<boolean>;
}

const API_URL = 'https://backend.youware.com/api';

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  checkAuth: async () => {
    try {
      // 1. Get Platform Info
      const platformRes = await fetch('https://backend.youware.com/__user_info__');
      const platformData = await platformRes.json();
      
      if (platformData.code === 0 && platformData.data.encrypted_yw_id) {
        // 2. Get DB User Info
        const res = await fetch(`${API_URL}/me`);
        const data = await res.json();
        
        if (data.user) {
          set({ user: data.user, isAuthenticated: true, isLoading: false });
        } else {
          // Not registered in our DB yet, but has platform ID
          set({ isLoading: false });
        }
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      set({ isLoading: false });
    }
  },

  loginWithGoogle: async (token, userInfo) => {
    try {
      const res = await fetch(`${API_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, userInfo })
      });
      const data = await res.json();
      if (data.user) {
        set({ user: data.user, isAuthenticated: true });
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  },

  logout: () => {
    // For MVP, just clear local state. 
    // In real app, might need to clear platform session if possible, but usually just local.
    set({ user: null, isAuthenticated: false });
  },

  deposit: async (amount) => {
    try {
      await fetch(`${API_URL}/deposit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
      });
      // Refresh user
      get().checkAuth();
    } catch (error) {
      console.error('Deposit failed:', error);
    }
  },

  unlockChapter: async (chapterId, price) => {
    try {
      const res = await fetch(`${API_URL}/unlock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chapterId })
      });
      
      if (res.ok) {
        // Refresh user to update balance and unlocks
        await get().checkAuth();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Unlock failed:', error);
      return false;
    }
  },
}));
