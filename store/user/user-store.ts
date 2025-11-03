import { User } from '@supabase/supabase-js';
import { create } from 'zustand';

export type CustomUserData = {
  id: string;
  name: string;
  userName: string;
  avatarUrl: string;
  email: string;
};

interface State {
  user: User | null;
  customUserData: CustomUserData | null;
  setUser: (user: User | null) => void;
  setCustomUserData: (userData: CustomUserData | null) => void;
}

export const useUserStore = create<State>()((set) => ({
  user: null,
  customUserData: null,
  setUser: (user: User | null) => set({ user }),
  setCustomUserData: (userData: CustomUserData | null) => set({ customUserData: userData }),
}));
