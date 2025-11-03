import { create } from 'zustand';

export type Cliente = {
  nombre: string;
  celular: string | null;
  direccion: string | null;
  ci: string;
  puntos: number | null;
  notasEntrega: string | null;
  razonSocial: string | null;
  nit: string | null;
};

interface State {
  clientes: Cliente[];
  openUpdateDialog: boolean;
  clienteToUpdate: Cliente | null;

  setClientes: (value: Cliente[]) => void;
  addClienteToStore: (value: Cliente) => void;
  deleteClienteFromStore: (ci: string) => void;
  updateClienteFromStore: (value: Cliente) => void;

  setClienteToUpdate: (value: Cliente) => void;
  setOpenUpdateDialog: (value: boolean) => void;
}

export const useClienteStore = create<State>()((set) => ({
  clientes: [],
  openUpdateDialog: false,
  clienteToUpdate: null,

  setClientes: (lista: Cliente[]) => set((state) => ({ clientes: lista })),
  addClienteToStore: (cliente: Cliente) =>
    set((state) => ({ clientes: [...state.clientes, cliente] })),
  deleteClienteFromStore: (ci: string) =>
    set((state) => ({ clientes: state.clientes.filter((p) => p.ci !== ci) })),
  updateClienteFromStore(value: Cliente) {
    set((state) => ({
      clientes: state.clientes.map((p) => {
        if (p.ci == value.ci) return value;
        return p;
      }),
    }));
  },

  setClienteToUpdate: (cliente: Cliente) =>
    set((state) => ({ clienteToUpdate: cliente })),
  setOpenUpdateDialog: (value: boolean) =>
    set((state) => ({ openUpdateDialog: value })),
}));
