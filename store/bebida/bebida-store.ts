import { create } from 'zustand';
import { Producto } from '../platos/platos-store';

interface State {
  bebidas: Producto[];
  bebidasMap: Map<number, Producto>;
  openUpdateDialog: boolean;
  bebidaToUpdate: Producto | null;

  setBebidas: (value: Producto[]) => void;
  addBebidaToStore: (value: Producto) => void;
  deleteBebidaFromStore: (id: number) => void;
  updateBebidaFromStore: (value: Producto) => void;

  setBebidaToUpdate: (value: Producto) => void;
  setOpenUpdateDialog: (value: boolean) => void;
}

export const useBebidasStore = create<State>()((set) => ({
  bebidas: [],
  bebidasMap: new Map<number, Producto>(),
  openUpdateDialog: false,
  bebidaToUpdate: null,

  setBebidas: (lista: Producto[]) => {
    const map = new Map<number, Producto>();
    lista.forEach((p) => map.set(p.id, p));
    set((state) => ({ bebidas: lista, bebidasMap: map }));
  },
  addBebidaToStore: (plato: Producto) =>
    set((state) => ({ bebidas: [...state.bebidas, plato] })),
  deleteBebidaFromStore: (id: number) =>
    set((state) => ({ bebidas: state.bebidas.filter((p) => p.id !== id) })),
  updateBebidaFromStore(value: Producto) {
    set((state) => ({
      bebidas: state.bebidas.map((p) => {
        if (p.id == value.id) return value;
        return p;
      }),
    }));
  },

  setBebidaToUpdate: (plato: Producto) =>
    set((state) => ({ bebidaToUpdate: plato })),
  setOpenUpdateDialog: (value: boolean) =>
    set((state) => ({ openUpdateDialog: value })),
}));
