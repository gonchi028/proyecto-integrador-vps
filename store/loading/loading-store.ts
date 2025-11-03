import { create } from 'zustand';

interface State {
  loading: boolean;
  message: string;
  showLoading: (message: string) => void;
  hideLoading: () => void;
}

export const useLoadingStore = create<State>()((set) => ({
  loading: false,
  message: '',
  showLoading: (message: string) => set({ loading: true, message }),
  hideLoading: () => set({ loading: false, message: '' }),
}));
