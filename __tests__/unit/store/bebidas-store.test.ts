import { describe, it, expect, beforeEach } from 'vitest';
import { useBebidasStore } from '@/store/bebida/bebida-store';
import { Producto } from '@/store/platos/platos-store';

describe('Bebidas Store', () => {
  const mockBebidas: Producto[] = [
    {
      id: 1,
      nombre: 'Coca Cola',
      descripcion: 'Refresco de cola',
      cantidad: 50,
      categoria: 'Refrescos',
      precio: 8.00,
      tipo: 'bebida',
      urlImagen: 'https://example.com/coca.jpg',
    },
    {
      id: 2,
      nombre: 'Jugo de Naranja',
      descripcion: 'Jugo natural',
      cantidad: 30,
      categoria: 'Jugos',
      precio: 12.00,
      tipo: 'bebida',
      urlImagen: 'https://example.com/jugo.jpg',
    },
    {
      id: 3,
      nombre: 'Agua Mineral',
      descripcion: 'Agua con gas',
      cantidad: 100,
      categoria: 'Aguas',
      precio: 5.00,
      tipo: 'bebida',
      urlImagen: 'https://example.com/agua.jpg',
    },
  ];

  beforeEach(() => {
    useBebidasStore.setState({
      bebidas: [],
      bebidasMap: new Map<number, Producto>(),
      openUpdateDialog: false,
      bebidaToUpdate: null,
    });
  });

  describe('setBebidas', () => {
    it('should set bebidas array', () => {
      useBebidasStore.getState().setBebidas(mockBebidas);
      
      const { bebidas } = useBebidasStore.getState();
      expect(bebidas).toHaveLength(3);
      expect(bebidas).toEqual(mockBebidas);
    });

    it('should also create bebidasMap', () => {
      useBebidasStore.getState().setBebidas(mockBebidas);
      
      const { bebidasMap } = useBebidasStore.getState();
      expect(bebidasMap.size).toBe(3);
      expect(bebidasMap.get(1)?.nombre).toBe('Coca Cola');
      expect(bebidasMap.get(2)?.nombre).toBe('Jugo de Naranja');
    });

    it('should replace existing bebidas', () => {
      useBebidasStore.getState().setBebidas(mockBebidas);
      
      const newBebidas: Producto[] = [{
        id: 4,
        nombre: 'Café',
        descripcion: 'Café americano',
        cantidad: 25,
        categoria: 'Calientes',
        precio: 10.00,
        tipo: 'bebida',
        urlImagen: 'https://example.com/cafe.jpg',
      }];
      
      useBebidasStore.getState().setBebidas(newBebidas);
      
      const { bebidas, bebidasMap } = useBebidasStore.getState();
      expect(bebidas).toHaveLength(1);
      expect(bebidasMap.size).toBe(1);
    });
  });

  describe('addBebidaToStore', () => {
    it('should add a new bebida', () => {
      const newBebida: Producto = {
        id: 4,
        nombre: 'Limonada',
        descripcion: 'Limonada fresca',
        cantidad: 40,
        categoria: 'Refrescos',
        precio: 10.00,
        tipo: 'bebida',
        urlImagen: 'https://example.com/limonada.jpg',
      };
      
      useBebidasStore.getState().addBebidaToStore(newBebida);
      
      const { bebidas } = useBebidasStore.getState();
      expect(bebidas).toHaveLength(1);
      expect(bebidas[0]).toEqual(newBebida);
    });

    it('should append bebida to existing list', () => {
      useBebidasStore.getState().setBebidas(mockBebidas);
      
      const newBebida: Producto = {
        id: 4,
        nombre: 'Limonada',
        descripcion: 'Limonada fresca',
        cantidad: 40,
        categoria: 'Refrescos',
        precio: 10.00,
        tipo: 'bebida',
        urlImagen: 'https://example.com/limonada.jpg',
      };
      
      useBebidasStore.getState().addBebidaToStore(newBebida);
      
      const { bebidas } = useBebidasStore.getState();
      expect(bebidas).toHaveLength(4);
    });
  });

  describe('deleteBebidaFromStore', () => {
    it('should delete a bebida by id', () => {
      useBebidasStore.getState().setBebidas(mockBebidas);
      
      useBebidasStore.getState().deleteBebidaFromStore(1);
      
      const { bebidas } = useBebidasStore.getState();
      expect(bebidas).toHaveLength(2);
      expect(bebidas.find(b => b.id === 1)).toBeUndefined();
    });

    it('should not affect other bebidas', () => {
      useBebidasStore.getState().setBebidas(mockBebidas);
      
      useBebidasStore.getState().deleteBebidaFromStore(1);
      
      const { bebidas } = useBebidasStore.getState();
      expect(bebidas.find(b => b.id === 2)).toBeDefined();
      expect(bebidas.find(b => b.id === 3)).toBeDefined();
    });

    it('should handle deleting non-existent bebida', () => {
      useBebidasStore.getState().setBebidas(mockBebidas);
      
      useBebidasStore.getState().deleteBebidaFromStore(999);
      
      const { bebidas } = useBebidasStore.getState();
      expect(bebidas).toHaveLength(3);
    });
  });

  describe('updateBebidaFromStore', () => {
    it('should update an existing bebida', () => {
      useBebidasStore.getState().setBebidas(mockBebidas);
      
      const updatedBebida: Producto = {
        ...mockBebidas[0],
        nombre: 'Coca Cola Zero',
        precio: 9.00,
      };
      
      useBebidasStore.getState().updateBebidaFromStore(updatedBebida);
      
      const { bebidas } = useBebidasStore.getState();
      const bebida = bebidas.find(b => b.id === 1);
      expect(bebida?.nombre).toBe('Coca Cola Zero');
      expect(bebida?.precio).toBe(9.00);
    });

    it('should not modify other bebidas', () => {
      useBebidasStore.getState().setBebidas(mockBebidas);
      
      const updatedBebida: Producto = {
        ...mockBebidas[0],
        nombre: 'Coca Cola Zero',
      };
      
      useBebidasStore.getState().updateBebidaFromStore(updatedBebida);
      
      const { bebidas } = useBebidasStore.getState();
      const otherBebida = bebidas.find(b => b.id === 2);
      expect(otherBebida?.nombre).toBe('Jugo de Naranja');
    });
  });

  describe('setBebidaToUpdate', () => {
    it('should set bebida to update', () => {
      useBebidasStore.getState().setBebidaToUpdate(mockBebidas[0]);
      
      const { bebidaToUpdate } = useBebidasStore.getState();
      expect(bebidaToUpdate).toEqual(mockBebidas[0]);
    });
  });

  describe('setOpenUpdateDialog', () => {
    it('should set openUpdateDialog to true', () => {
      useBebidasStore.getState().setOpenUpdateDialog(true);
      expect(useBebidasStore.getState().openUpdateDialog).toBe(true);
    });

    it('should set openUpdateDialog to false', () => {
      useBebidasStore.getState().setOpenUpdateDialog(true);
      useBebidasStore.getState().setOpenUpdateDialog(false);
      expect(useBebidasStore.getState().openUpdateDialog).toBe(false);
    });
  });
});
