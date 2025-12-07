import { describe, it, expect, beforeEach } from 'vitest';
import { useMesasStore, Mesa } from '@/store/mesas/mesas-store';

describe('Mesas Store', () => {
  const mockMesas: Mesa[] = [
    { id: 1, numero: 1, estado: 'libre', capacidad: 4 },
    { id: 2, numero: 2, estado: 'ocupada', capacidad: 6 },
    { id: 3, numero: 3, estado: 'reservada', capacidad: 2 },
  ];

  beforeEach(() => {
    // Reset the store before each test
    useMesasStore.setState({
      mesas: [],
      mesaToUpdate: null,
      openAddDialog: false,
      openUpdateDialog: false,
    });
  });

  describe('setMesas', () => {
    it('should set mesas array', () => {
      useMesasStore.getState().setMesas(mockMesas);
      
      const { mesas } = useMesasStore.getState();
      expect(mesas).toHaveLength(3);
      expect(mesas).toEqual(mockMesas);
    });

    it('should replace existing mesas', () => {
      useMesasStore.getState().setMesas(mockMesas);
      
      const newMesas: Mesa[] = [
        { id: 4, numero: 4, estado: 'libre', capacidad: 8 },
      ];
      useMesasStore.getState().setMesas(newMesas);
      
      const { mesas } = useMesasStore.getState();
      expect(mesas).toHaveLength(1);
      expect(mesas[0].numero).toBe(4);
    });
  });

  describe('addMesaToStore', () => {
    it('should add a new mesa to the store', () => {
      const newMesa: Mesa = { id: 4, numero: 4, estado: 'libre', capacidad: 4 };
      
      useMesasStore.getState().addMesaToStore(newMesa);
      
      const { mesas } = useMesasStore.getState();
      expect(mesas).toHaveLength(1);
      expect(mesas[0]).toEqual(newMesa);
    });

    it('should append mesa to existing mesas', () => {
      useMesasStore.getState().setMesas(mockMesas);
      const newMesa: Mesa = { id: 4, numero: 4, estado: 'libre', capacidad: 4 };
      
      useMesasStore.getState().addMesaToStore(newMesa);
      
      const { mesas } = useMesasStore.getState();
      expect(mesas).toHaveLength(4);
      expect(mesas[3]).toEqual(newMesa);
    });
  });

  describe('updateMesaInStore', () => {
    it('should update an existing mesa', () => {
      useMesasStore.getState().setMesas(mockMesas);
      
      const updatedMesa: Mesa = { id: 1, numero: 1, estado: 'ocupada', capacidad: 4 };
      useMesasStore.getState().updateMesaInStore(updatedMesa);
      
      const { mesas } = useMesasStore.getState();
      const mesa = mesas.find(m => m.id === 1);
      expect(mesa?.estado).toBe('ocupada');
    });

    it('should not modify other mesas', () => {
      useMesasStore.getState().setMesas(mockMesas);
      
      const updatedMesa: Mesa = { id: 1, numero: 1, estado: 'ocupada', capacidad: 4 };
      useMesasStore.getState().updateMesaInStore(updatedMesa);
      
      const { mesas } = useMesasStore.getState();
      const mesa2 = mesas.find(m => m.id === 2);
      expect(mesa2?.estado).toBe('ocupada');
    });

    it('should not add mesa if id does not exist', () => {
      useMesasStore.getState().setMesas(mockMesas);
      
      const nonExistentMesa: Mesa = { id: 999, numero: 999, estado: 'libre', capacidad: 10 };
      useMesasStore.getState().updateMesaInStore(nonExistentMesa);
      
      const { mesas } = useMesasStore.getState();
      expect(mesas).toHaveLength(3);
      expect(mesas.find(m => m.id === 999)).toBeUndefined();
    });
  });

  describe('deleteMesaFromStore', () => {
    it('should delete a mesa by id', () => {
      useMesasStore.getState().setMesas(mockMesas);
      
      useMesasStore.getState().deleteMesaFromStore(1);
      
      const { mesas } = useMesasStore.getState();
      expect(mesas).toHaveLength(2);
      expect(mesas.find(m => m.id === 1)).toBeUndefined();
    });

    it('should not affect other mesas when deleting', () => {
      useMesasStore.getState().setMesas(mockMesas);
      
      useMesasStore.getState().deleteMesaFromStore(1);
      
      const { mesas } = useMesasStore.getState();
      expect(mesas.find(m => m.id === 2)).toBeDefined();
      expect(mesas.find(m => m.id === 3)).toBeDefined();
    });

    it('should handle deleting non-existent mesa', () => {
      useMesasStore.getState().setMesas(mockMesas);
      
      useMesasStore.getState().deleteMesaFromStore(999);
      
      const { mesas } = useMesasStore.getState();
      expect(mesas).toHaveLength(3);
    });
  });

  describe('setMesaToUpdate', () => {
    it('should set mesa to update', () => {
      const mesa: Mesa = { id: 1, numero: 1, estado: 'libre', capacidad: 4 };
      
      useMesasStore.getState().setMesaToUpdate(mesa);
      
      const { mesaToUpdate } = useMesasStore.getState();
      expect(mesaToUpdate).toEqual(mesa);
    });

    it('should clear mesa to update when set to null', () => {
      const mesa: Mesa = { id: 1, numero: 1, estado: 'libre', capacidad: 4 };
      useMesasStore.getState().setMesaToUpdate(mesa);
      
      useMesasStore.getState().setMesaToUpdate(null);
      
      const { mesaToUpdate } = useMesasStore.getState();
      expect(mesaToUpdate).toBeNull();
    });
  });

  describe('Dialog controls', () => {
    it('should set openAddDialog to true', () => {
      useMesasStore.getState().setOpenAddDialog(true);
      expect(useMesasStore.getState().openAddDialog).toBe(true);
    });

    it('should set openAddDialog to false', () => {
      useMesasStore.getState().setOpenAddDialog(true);
      useMesasStore.getState().setOpenAddDialog(false);
      expect(useMesasStore.getState().openAddDialog).toBe(false);
    });

    it('should set openUpdateDialog to true', () => {
      useMesasStore.getState().setOpenUpdateDialog(true);
      expect(useMesasStore.getState().openUpdateDialog).toBe(true);
    });

    it('should set openUpdateDialog to false', () => {
      useMesasStore.getState().setOpenUpdateDialog(true);
      useMesasStore.getState().setOpenUpdateDialog(false);
      expect(useMesasStore.getState().openUpdateDialog).toBe(false);
    });
  });
});
