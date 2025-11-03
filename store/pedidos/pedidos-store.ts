import { create } from 'zustand';
import { Mesa } from '@/store/mesas/mesas-store';
import { Cliente } from '@/store/cliente/cliente-store';
import { Producto } from '@/store/platos/platos-store';

export type Pago = {
  id: number;
  tipo: string;
  monto: number;
  fechaHora: Date;
  factura: {
    id: number;
    razonSocial: string;
    nit: string;
    pagoId: number;
  } | null;
}

export type Mesero = {
  id: string;
  name: string;
  userName: string;
  avatarUrl: string;
  email: string;
  clienteCi: string | null;
};

export type Pedido = {
  id: number;
  fechaHoraPedido: Date;
  fechaHoraEntrega: Date | null;
  tipo: 'mesa' | 'domicilio';
  estado:
    | 'pendiente'
    | 'entregado'
    | 'cancelado'
    | 'en camino'
    | 'listo para recoger';
  calificacionMesero: number | null;
  total: number;
  mesaId: number | null;
  clienteCi: string;
  meseroId: string | null;
  pagoId: number | null;
  mesa: Mesa | null;
  cliente: Cliente | null;
  mesero: Mesero | null;
  pago: Pago | null;
  detalleProductos: {
    estado: 'pendiente' | 'en preparacion' | 'entregado';
    cantidad: number;
    calificacion: number | null;
    productoId: number;
    pedidoId: number;
    producto: Producto;
  }[];
  detalleCombos: {
    estado: 'pendiente' | 'en preparacion' | 'entregado';
    calificacion: number | null;
    cantidad: number;
    comboId: number;
    pedidoId: number;
    combo: {
      id: number;
      nombre: string;
      precio: number;
      estado: string;
      urlImagen: string | null;
      productoCombo: {
        productoId: number;
        comboId: number;
        producto: Producto;
      }[];
    };
  }[];
};

interface State {
  pedidosLocal: Pedido[];
  pedidosDomicilio: Pedido[];

  setPedidos: (value: Pedido[]) => void;
  updatePedidoInStore: (pedidoId: number, updates: Partial<Pedido>) => void;
}

export const usePedidosStore = create<State>()((set) => ({
  pedidosLocal: [],
  pedidosDomicilio: [],

  setPedidos: (pedidos) => {
    const pedidosLocal: Pedido[] = [];
    const pedidosDomicilio: Pedido[] = [];

    pedidos.forEach((pedido) => {
      if (pedido.tipo === 'mesa') {
        pedidosLocal.push(pedido);
      } else {
        pedidosDomicilio.push(pedido);
      }
    });

    set({ pedidosLocal, pedidosDomicilio });
  },

  updatePedidoInStore: (pedidoId, updates) => {
    set((state) => {
      const updatePedidoInArray = (pedidos: Pedido[]) =>
        pedidos.map((pedido) =>
          pedido.id === pedidoId ? { ...pedido, ...updates } : pedido
        );

      return {
        pedidosLocal: updatePedidoInArray(state.pedidosLocal),
        pedidosDomicilio: updatePedidoInArray(state.pedidosDomicilio),
      };
    });
  },
}));
