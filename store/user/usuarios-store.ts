import { create } from 'zustand';

export type User = {
  id: string;
  name: string;
  clienteCi: string | null;
  userName: string;
  avatarUrl: string;
  email: string;
}

type State = {
  usuarios: User[];
  setUsuarios: (usuarios: User[]) => void;
}

export const useUsuariosStore = create<State>()((set) => ({
  usuarios: [],
  setUsuarios: (usuarios: User[]) => set({ usuarios }),
}));
