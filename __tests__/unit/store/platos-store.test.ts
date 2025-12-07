import { describe, it, expect, beforeEach } from 'vitest';
import { usePlatosStore, Producto } from '@/store/platos/platos-store';

describe('Platos Store', () => {
  const mockPlatos: Producto[] = [
    {
      id: 1,
      nombre: 'Pizza Margherita',
      descripcion: 'Pizza clásica con tomate y mozzarella',
      cantidad: 10,
      categoria: 'Pizzas',
      precio: 45.00,
      tipo: 'plato',
      urlImagen: 'https://example.com/pizza.jpg',
    },
    {
      id: 2,
      nombre: 'Pasta Carbonara',
      descripcion: 'Pasta con salsa cremosa de huevo y panceta',
      cantidad: 15,
      categoria: 'Pastas',
      precio: 35.00,
      tipo: 'plato',
      urlImagen: 'https://example.com/pasta.jpg',
    },
    {
      id: 3,
      nombre: 'Ensalada César',
      descripcion: 'Lechuga, crutones y aderezo césar',
      cantidad: null,
      categoria: 'Ensaladas',
      precio: 25.00,
      tipo: 'plato',
      urlImagen: 'https://example.com/ensalada.jpg',
    },
  ];

  beforeEach(() => {
    usePlatosStore.setState({
      platos: [],
      platosMap: new Map<number, Producto>(),
      openUpdateDialog: false,
      platoToUpdate: null,
    });
  });

  describe('setPlatos', () => {
    it('should set platos array', () => {
      usePlatosStore.getState().setPlatos(mockPlatos);
      
      const { platos } = usePlatosStore.getState();
      expect(platos).toHaveLength(3);
      expect(platos).toEqual(mockPlatos);
    });

    it('should also create platosMap', () => {
      usePlatosStore.getState().setPlatos(mockPlatos);
      
      const { platosMap } = usePlatosStore.getState();
      expect(platosMap.size).toBe(3);
      expect(platosMap.get(1)?.nombre).toBe('Pizza Margherita');
      expect(platosMap.get(2)?.nombre).toBe('Pasta Carbonara');
    });

    it('should replace existing platos', () => {
      usePlatosStore.getState().setPlatos(mockPlatos);
      
      const newPlatos: Producto[] = [{
        id: 4,
        nombre: 'Sopa',
        descripcion: 'Sopa del día',
        cantidad: 5,
        categoria: 'Sopas',
        precio: 15.00,
        tipo: 'plato',
        urlImagen: 'https://example.com/sopa.jpg',
      }];
      
      usePlatosStore.getState().setPlatos(newPlatos);
      
      const { platos, platosMap } = usePlatosStore.getState();
      expect(platos).toHaveLength(1);
      expect(platosMap.size).toBe(1);
    });
  });

  describe('addPlatoToStore', () => {
    it('should add a new plato', () => {
      const newPlato: Producto = {
        id: 4,
        nombre: 'Tacos',
        descripcion: 'Tacos mexicanos',
        cantidad: 20,
        categoria: 'Mexicano',
        precio: 30.00,
        tipo: 'plato',
        urlImagen: 'https://example.com/tacos.jpg',
      };
      
      usePlatosStore.getState().addPlatoToStore(newPlato);
      
      const { platos } = usePlatosStore.getState();
      expect(platos).toHaveLength(1);
      expect(platos[0]).toEqual(newPlato);
    });

    it('should append plato to existing list', () => {
      usePlatosStore.getState().setPlatos(mockPlatos);
      
      const newPlato: Producto = {
        id: 4,
        nombre: 'Tacos',
        descripcion: 'Tacos mexicanos',
        cantidad: 20,
        categoria: 'Mexicano',
        precio: 30.00,
        tipo: 'plato',
        urlImagen: 'https://example.com/tacos.jpg',
      };
      
      usePlatosStore.getState().addPlatoToStore(newPlato);
      
      const { platos } = usePlatosStore.getState();
      expect(platos).toHaveLength(4);
    });
  });

  describe('deletePLatoFromStore', () => {
    it('should delete a plato by id', () => {
      usePlatosStore.getState().setPlatos(mockPlatos);
      
      usePlatosStore.getState().deletePLatoFromStore(1);
      
      const { platos } = usePlatosStore.getState();
      expect(platos).toHaveLength(2);
      expect(platos.find(p => p.id === 1)).toBeUndefined();
    });

    it('should not affect other platos', () => {
      usePlatosStore.getState().setPlatos(mockPlatos);
      
      usePlatosStore.getState().deletePLatoFromStore(1);
      
      const { platos } = usePlatosStore.getState();
      expect(platos.find(p => p.id === 2)).toBeDefined();
      expect(platos.find(p => p.id === 3)).toBeDefined();
    });

    it('should handle deleting non-existent plato', () => {
      usePlatosStore.getState().setPlatos(mockPlatos);
      
      usePlatosStore.getState().deletePLatoFromStore(999);
      
      const { platos } = usePlatosStore.getState();
      expect(platos).toHaveLength(3);
    });
  });

  describe('updatePlatoFromStore', () => {
    it('should update an existing plato', () => {
      usePlatosStore.getState().setPlatos(mockPlatos);
      
      const updatedPlato: Producto = {
        ...mockPlatos[0],
        nombre: 'Pizza Especial',
        precio: 55.00,
      };
      
      usePlatosStore.getState().updatePlatoFromStore(updatedPlato);
      
      const { platos } = usePlatosStore.getState();
      const plato = platos.find(p => p.id === 1);
      expect(plato?.nombre).toBe('Pizza Especial');
      expect(plato?.precio).toBe(55.00);
    });

    it('should not modify other platos', () => {
      usePlatosStore.getState().setPlatos(mockPlatos);
      
      const updatedPlato: Producto = {
        ...mockPlatos[0],
        nombre: 'Pizza Especial',
      };
      
      usePlatosStore.getState().updatePlatoFromStore(updatedPlato);
      
      const { platos } = usePlatosStore.getState();
      const otherPlato = platos.find(p => p.id === 2);
      expect(otherPlato?.nombre).toBe('Pasta Carbonara');
    });
  });

  describe('setPlatoToUpdate', () => {
    it('should set plato to update', () => {
      usePlatosStore.getState().setPlatoToUpdate(mockPlatos[0]);
      
      const { platoToUpdate } = usePlatosStore.getState();
      expect(platoToUpdate).toEqual(mockPlatos[0]);
    });
  });

  describe('setOpenUpdateDialog', () => {
    it('should set openUpdateDialog to true', () => {
      usePlatosStore.getState().setOpenUpdateDialog(true);
      expect(usePlatosStore.getState().openUpdateDialog).toBe(true);
    });

    it('should set openUpdateDialog to false', () => {
      usePlatosStore.getState().setOpenUpdateDialog(true);
      usePlatosStore.getState().setOpenUpdateDialog(false);
      expect(usePlatosStore.getState().openUpdateDialog).toBe(false);
    });
  });
});
