import { create } from 'zustand';
import { Mesa, Producto } from '@/store';

export type ProductosCocina = {
  estado: 'pendiente' | 'en preparacion' | 'entregado';
  cantidad: number;
  calificacion: number | null;
  tipo: 'producto' | 'combo';

  producto: Producto;
  pedido: {
    id: number;
    tipo: 'mesa' | 'domicilio';
    mesa: Mesa | null;
  };
};

interface State {
  platosCocina: ProductosCocina[];
  setPlatosCocina: (value: ProductosCocina[]) => void;
  updatePlatoCocinaEstado: (
    idPedido: number,
    idProducto: number,
    tipo: 'producto' | 'combo',
    nuevoEstado: 'pendiente' | 'en preparacion' | 'entregado'
  ) => void;
}

export const useCocinaStore = create<State>()((set) => ({
  platosCocina: [],
  setPlatosCocina: (lista: ProductosCocina[]) => set({ platosCocina: lista }),
  updatePlatoCocinaEstado: (idPedido, idProducto, tipo, nuevoEstado) =>
    set((state) => ({
      platosCocina: state.platosCocina.map((pc) =>
        pc.pedido.id === idPedido && pc.producto.id === idProducto && pc.tipo === tipo
          ? { ...pc, estado: nuevoEstado }
          : pc
      ),
    })),
}));
