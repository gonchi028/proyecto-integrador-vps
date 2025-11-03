import { create } from 'zustand';
import { Producto } from '@/store/platos/platos-store';

export type Combo = {
  id: number;
  nombre: string;
  precio: number;
  estado: string;
  urlImagen: string | null;
  productos: Producto[];
};

interface State {
  combos: Combo[];
  combosMap: Map<number, Combo>;
  setCombos: (combos: Combo[]) => void;
}

export const useCombosStore = create<State>()((set) => ({
  combos: [],
  combosMap: new Map(),
  setCombos: (combos) => {
    const comboMap = new Map();
    combos.forEach((combo) => {
      comboMap.set(combo.id, combo);
    });
    set({ combos, combosMap: comboMap });
  },
}));
