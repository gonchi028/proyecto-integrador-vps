import { create } from 'zustand';

interface State {
  idPedido: number;
  bebidas: {
    productoId: number;
    cantidad: number;
  }[];
  platos: {
    productoId: number;
    cantidad: number;
  }[];
  combo: {
    comboId: number;
    cantidad: number;
  }[];
}

export const useOrdenStore = create<State>()((set) => ({
  idPedido: 0,
  bebidas: [],
  platos: [],
  combo: [],
}));
