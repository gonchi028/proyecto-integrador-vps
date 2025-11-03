import { create } from 'zustand';

export type Reserva = {
  id: number;
  estado: 'pendiente' | 'confirmada' | 'cancelada' | 'utilizada' | 'no asistio';
  cantidadPersonas: number;
  fechaHora: Date;
  mesa: number;
  clienteCi: string;
  cliente?: {
    ci: string;
    nombre: string;
    celular: string | null;
    puntos: number | null;
    direccion: string | null;
    notasEntrega: string | null;
    razonSocial: string | null;
    nit: string | null;
  };
};

interface State {
  reservas: Reserva[];
  reservaToUpdate: Reserva | null;
  openAddDialog: boolean;
  openUpdateDialog: boolean;

  setReservas: (value: Reserva[]) => void;
  addReservaToStore: (reserva: Reserva) => void;
  updateReservaInStore: (reserva: Reserva) => void;
  deleteReservaFromStore: (id: number) => void;
  setReservaToUpdate: (reserva: Reserva | null) => void;
  setOpenAddDialog: (open: boolean) => void;
  setOpenUpdateDialog: (open: boolean) => void;
}

export const useReservasStore = create<State>()((set) => ({
  reservas: [],
  reservaToUpdate: null,
  openAddDialog: false,
  openUpdateDialog: false,

  setReservas: (reservas) => set({ reservas }),
  addReservaToStore: (reserva) => set((state) => ({ 
    reservas: [...state.reservas, reserva] 
  })),
  updateReservaInStore: (reserva) => set((state) => ({ 
    reservas: state.reservas.map((r) => (r.id === reserva.id ? reserva : r)) 
  })),
  deleteReservaFromStore: (id) => set((state) => ({ 
    reservas: state.reservas.filter((r) => r.id !== id) 
  })),
  setReservaToUpdate: (reserva) => set({ reservaToUpdate: reserva }),
  setOpenAddDialog: (open) => set({ openAddDialog: open }),
  setOpenUpdateDialog: (open) => set({ openUpdateDialog: open }),
})); 
