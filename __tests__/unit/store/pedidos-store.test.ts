import { describe, it, expect, beforeEach } from 'vitest';
import { usePedidosStore, Pedido } from '@/store/pedidos/pedidos-store';

describe('Pedidos Store', () => {
  const mockPedidoLocal: Pedido = {
    id: 1,
    fechaHoraPedido: new Date('2024-01-01T12:00:00'),
    fechaHoraEntrega: null,
    tipo: 'mesa',
    estado: 'pendiente',
    calificacionMesero: null,
    total: 100,
    mesaId: 1,
    clienteCi: '12345678',
    meseroId: 'mesero-1',
    pagoId: null,
    mesa: { id: 1, numero: 1, estado: 'ocupada', capacidad: 4 },
    cliente: {
      ci: '12345678',
      nombre: 'Juan',
      celular: '70012345',
      direccion: 'Calle 1',
      puntos: 50,
      notasEntrega: null,
      razonSocial: null,
      nit: null,
    },
    mesero: null,
    pago: null,
    detalleProductos: [],
    detalleCombos: [],
  };

  const mockPedidoDomicilio: Pedido = {
    id: 2,
    fechaHoraPedido: new Date('2024-01-01T13:00:00'),
    fechaHoraEntrega: null,
    tipo: 'domicilio',
    estado: 'en camino',
    calificacionMesero: null,
    total: 150,
    mesaId: null,
    clienteCi: '87654321',
    meseroId: null,
    pagoId: null,
    mesa: null,
    cliente: {
      ci: '87654321',
      nombre: 'María',
      celular: '70098765',
      direccion: 'Av. Principal 456',
      puntos: 100,
      notasEntrega: 'Dejar en portería',
      razonSocial: null,
      nit: null,
    },
    mesero: null,
    pago: null,
    detalleProductos: [],
    detalleCombos: [],
  };

  beforeEach(() => {
    usePedidosStore.setState({
      pedidosLocal: [],
      pedidosDomicilio: [],
    });
  });

  describe('setPedidos', () => {
    it('should separate pedidos by tipo', () => {
      const pedidos = [mockPedidoLocal, mockPedidoDomicilio];
      
      usePedidosStore.getState().setPedidos(pedidos);
      
      const { pedidosLocal, pedidosDomicilio } = usePedidosStore.getState();
      expect(pedidosLocal).toHaveLength(1);
      expect(pedidosDomicilio).toHaveLength(1);
    });

    it('should put mesa type in pedidosLocal', () => {
      usePedidosStore.getState().setPedidos([mockPedidoLocal]);
      
      const { pedidosLocal, pedidosDomicilio } = usePedidosStore.getState();
      expect(pedidosLocal).toHaveLength(1);
      expect(pedidosLocal[0].tipo).toBe('mesa');
      expect(pedidosDomicilio).toHaveLength(0);
    });

    it('should put domicilio type in pedidosDomicilio', () => {
      usePedidosStore.getState().setPedidos([mockPedidoDomicilio]);
      
      const { pedidosLocal, pedidosDomicilio } = usePedidosStore.getState();
      expect(pedidosDomicilio).toHaveLength(1);
      expect(pedidosDomicilio[0].tipo).toBe('domicilio');
      expect(pedidosLocal).toHaveLength(0);
    });

    it('should replace existing pedidos', () => {
      usePedidosStore.getState().setPedidos([mockPedidoLocal, mockPedidoDomicilio]);
      usePedidosStore.getState().setPedidos([mockPedidoLocal]);
      
      const { pedidosLocal, pedidosDomicilio } = usePedidosStore.getState();
      expect(pedidosLocal).toHaveLength(1);
      expect(pedidosDomicilio).toHaveLength(0);
    });

    it('should handle empty array', () => {
      usePedidosStore.getState().setPedidos([mockPedidoLocal]);
      usePedidosStore.getState().setPedidos([]);
      
      const { pedidosLocal, pedidosDomicilio } = usePedidosStore.getState();
      expect(pedidosLocal).toHaveLength(0);
      expect(pedidosDomicilio).toHaveLength(0);
    });

    it('should handle multiple pedidos of same type', () => {
      const anotherLocalPedido: Pedido = {
        ...mockPedidoLocal,
        id: 3,
        mesaId: 2,
      };
      
      usePedidosStore.getState().setPedidos([mockPedidoLocal, anotherLocalPedido]);
      
      const { pedidosLocal } = usePedidosStore.getState();
      expect(pedidosLocal).toHaveLength(2);
    });
  });

  describe('updatePedidoInStore', () => {
    it('should update pedido in pedidosLocal', () => {
      usePedidosStore.getState().setPedidos([mockPedidoLocal, mockPedidoDomicilio]);
      
      usePedidosStore.getState().updatePedidoInStore(1, { estado: 'entregado' });
      
      const { pedidosLocal } = usePedidosStore.getState();
      const pedido = pedidosLocal.find(p => p.id === 1);
      expect(pedido?.estado).toBe('entregado');
    });

    it('should update pedido in pedidosDomicilio', () => {
      usePedidosStore.getState().setPedidos([mockPedidoLocal, mockPedidoDomicilio]);
      
      usePedidosStore.getState().updatePedidoInStore(2, { estado: 'entregado' });
      
      const { pedidosDomicilio } = usePedidosStore.getState();
      const pedido = pedidosDomicilio.find(p => p.id === 2);
      expect(pedido?.estado).toBe('entregado');
    });

    it('should update multiple fields', () => {
      usePedidosStore.getState().setPedidos([mockPedidoLocal]);
      
      usePedidosStore.getState().updatePedidoInStore(1, {
        estado: 'entregado',
        total: 200,
        calificacionMesero: 5,
      });
      
      const { pedidosLocal } = usePedidosStore.getState();
      const pedido = pedidosLocal.find(p => p.id === 1);
      expect(pedido?.estado).toBe('entregado');
      expect(pedido?.total).toBe(200);
      expect(pedido?.calificacionMesero).toBe(5);
    });

    it('should not affect other pedidos', () => {
      const anotherLocalPedido: Pedido = {
        ...mockPedidoLocal,
        id: 3,
        total: 80,
      };
      
      usePedidosStore.getState().setPedidos([mockPedidoLocal, anotherLocalPedido]);
      usePedidosStore.getState().updatePedidoInStore(1, { total: 200 });
      
      const { pedidosLocal } = usePedidosStore.getState();
      const otherPedido = pedidosLocal.find(p => p.id === 3);
      expect(otherPedido?.total).toBe(80);
    });

    it('should handle updating non-existent pedido', () => {
      usePedidosStore.getState().setPedidos([mockPedidoLocal]);
      
      usePedidosStore.getState().updatePedidoInStore(999, { estado: 'entregado' });
      
      const { pedidosLocal } = usePedidosStore.getState();
      expect(pedidosLocal).toHaveLength(1);
      expect(pedidosLocal[0].estado).toBe('pendiente');
    });
  });
});
