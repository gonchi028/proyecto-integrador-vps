import { create } from 'zustand';

export type Mesa = {
  id: number;
  numero: number;
  estado: 'libre' | 'ocupada' | 'reservada';
  capacidad: number;
};

interface State {
  mesas: Mesa[];
  mesaToUpdate: Mesa | null;
  openAddDialog: boolean;
  openUpdateDialog: boolean;

  setMesas: (value: Mesa[]) => void;
  addMesaToStore: (mesa: Mesa) => void;
  updateMesaInStore: (mesa: Mesa) => void;
  deleteMesaFromStore: (id: number) => void;
  setMesaToUpdate: (mesa: Mesa | null) => void;
  setOpenAddDialog: (open: boolean) => void;
  setOpenUpdateDialog: (open: boolean) => void;
}

export const useMesasStore = create<State>()((set) => ({
  mesas: [],
  mesaToUpdate: null,
  openAddDialog: false,
  openUpdateDialog: false,

  setMesas: (mesas) => set({ mesas }),
  addMesaToStore: (mesa) => set((state) => ({ 
    mesas: [...state.mesas, mesa] 
  })),
  updateMesaInStore: (mesa) => set((state) => ({ 
    mesas: state.mesas.map((m) => (m.id === mesa.id ? mesa : m)) 
  })),
  deleteMesaFromStore: (id) => set((state) => ({ 
    mesas: state.mesas.filter((m) => m.id !== id) 
  })),
  setMesaToUpdate: (mesa) => set({ mesaToUpdate: mesa }),
  setOpenAddDialog: (open) => set({ openAddDialog: open }),
  setOpenUpdateDialog: (open) => set({ openUpdateDialog: open }),
}));
