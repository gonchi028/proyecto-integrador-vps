import { create } from 'zustand';

export type Producto = {
  id: number;
  nombre: string;
  descripcion: string;
  cantidad: number | null;
  categoria: string;
  precio: number;
  tipo: 'plato' | 'bebida';
  urlImagen: string;
};

interface State {
  platos: Producto[];
  platosMap: Map<number, Producto>;
  openUpdateDialog: boolean;
  platoToUpdate: Producto | null;

  setPlatos: (value: Producto[]) => void;
  addPlatoToStore: (value: Producto) => void;
  deletePLatoFromStore: (id: number) => void;
  updatePlatoFromStore: (value: Producto) => void;

  setPlatoToUpdate: (value: Producto) => void;
  setOpenUpdateDialog: (value: boolean) => void;
}

export const usePlatosStore = create<State>()((set) => ({
  platos: [],
  platosMap: new Map<number, Producto>(),
  openUpdateDialog: false,
  platoToUpdate: null,

  setPlatos: (lista: Producto[]) => {
    const map = new Map<number, Producto>();
    lista.forEach((p) => map.set(p.id, p));
    set((state) => ({ platos: lista, platosMap: map }));
  },
  addPlatoToStore: (plato: Producto) =>
    set((state) => ({ platos: [...state.platos, plato] })),
  deletePLatoFromStore: (id: number) =>
    set((state) => ({ platos: state.platos.filter((p) => p.id !== id) })),
  updatePlatoFromStore(value: Producto) {
    set((state) => ({
      platos: state.platos.map((p) => {
        if (p.id == value.id) return value;
        return p;
      }),
    }));
  },

  setPlatoToUpdate: (plato: Producto) =>
    set((state) => ({ platoToUpdate: plato })),
  setOpenUpdateDialog: (value: boolean) =>
    set((state) => ({ openUpdateDialog: value })),
}));
