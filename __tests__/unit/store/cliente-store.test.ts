import { describe, it, expect, beforeEach } from 'vitest';
import { useClienteStore, Cliente } from '@/store/cliente/cliente-store';

describe('Cliente Store', () => {
  const mockClientes: Cliente[] = [
    {
      ci: '12345678',
      nombre: 'Juan Pérez',
      celular: '70012345',
      direccion: 'Calle 1 #123',
      puntos: 100,
      notasEntrega: 'Tocar el timbre',
      razonSocial: 'Juan Pérez SRL',
      nit: '1234567890',
    },
    {
      ci: '87654321',
      nombre: 'María García',
      celular: '70098765',
      direccion: 'Av. Principal #456',
      puntos: 50,
      notasEntrega: null,
      razonSocial: null,
      nit: null,
    },
  ];

  beforeEach(() => {
    useClienteStore.setState({
      clientes: [],
      openUpdateDialog: false,
      clienteToUpdate: null,
    });
  });

  describe('setClientes', () => {
    it('should set clientes array', () => {
      useClienteStore.getState().setClientes(mockClientes);
      
      const { clientes } = useClienteStore.getState();
      expect(clientes).toHaveLength(2);
      expect(clientes).toEqual(mockClientes);
    });

    it('should replace existing clientes', () => {
      useClienteStore.getState().setClientes(mockClientes);
      
      const newClientes: Cliente[] = [{
        ci: '11111111',
        nombre: 'Pedro López',
        celular: null,
        direccion: null,
        puntos: 0,
        notasEntrega: null,
        razonSocial: null,
        nit: null,
      }];
      useClienteStore.getState().setClientes(newClientes);
      
      const { clientes } = useClienteStore.getState();
      expect(clientes).toHaveLength(1);
      expect(clientes[0].nombre).toBe('Pedro López');
    });
  });

  describe('addClienteToStore', () => {
    it('should add a new cliente', () => {
      const newCliente: Cliente = {
        ci: '99999999',
        nombre: 'Nuevo Cliente',
        celular: '79999999',
        direccion: 'Nueva Dirección',
        puntos: 0,
        notasEntrega: null,
        razonSocial: null,
        nit: null,
      };
      
      useClienteStore.getState().addClienteToStore(newCliente);
      
      const { clientes } = useClienteStore.getState();
      expect(clientes).toHaveLength(1);
      expect(clientes[0]).toEqual(newCliente);
    });

    it('should append cliente to existing list', () => {
      useClienteStore.getState().setClientes(mockClientes);
      
      const newCliente: Cliente = {
        ci: '99999999',
        nombre: 'Nuevo Cliente',
        celular: '79999999',
        direccion: 'Nueva Dirección',
        puntos: 0,
        notasEntrega: null,
        razonSocial: null,
        nit: null,
      };
      
      useClienteStore.getState().addClienteToStore(newCliente);
      
      const { clientes } = useClienteStore.getState();
      expect(clientes).toHaveLength(3);
    });
  });

  describe('deleteClienteFromStore', () => {
    it('should delete a cliente by CI', () => {
      useClienteStore.getState().setClientes(mockClientes);
      
      useClienteStore.getState().deleteClienteFromStore('12345678');
      
      const { clientes } = useClienteStore.getState();
      expect(clientes).toHaveLength(1);
      expect(clientes.find(c => c.ci === '12345678')).toBeUndefined();
    });

    it('should not affect other clientes when deleting', () => {
      useClienteStore.getState().setClientes(mockClientes);
      
      useClienteStore.getState().deleteClienteFromStore('12345678');
      
      const { clientes } = useClienteStore.getState();
      expect(clientes.find(c => c.ci === '87654321')).toBeDefined();
    });

    it('should handle deleting non-existent cliente', () => {
      useClienteStore.getState().setClientes(mockClientes);
      
      useClienteStore.getState().deleteClienteFromStore('00000000');
      
      const { clientes } = useClienteStore.getState();
      expect(clientes).toHaveLength(2);
    });
  });

  describe('updateClienteFromStore', () => {
    it('should update an existing cliente', () => {
      useClienteStore.getState().setClientes(mockClientes);
      
      const updatedCliente: Cliente = {
        ...mockClientes[0],
        nombre: 'Juan Updated',
        puntos: 200,
      };
      
      useClienteStore.getState().updateClienteFromStore(updatedCliente);
      
      const { clientes } = useClienteStore.getState();
      const cliente = clientes.find(c => c.ci === '12345678');
      expect(cliente?.nombre).toBe('Juan Updated');
      expect(cliente?.puntos).toBe(200);
    });

    it('should not modify other clientes', () => {
      useClienteStore.getState().setClientes(mockClientes);
      
      const updatedCliente: Cliente = {
        ...mockClientes[0],
        nombre: 'Juan Updated',
      };
      
      useClienteStore.getState().updateClienteFromStore(updatedCliente);
      
      const { clientes } = useClienteStore.getState();
      const otherCliente = clientes.find(c => c.ci === '87654321');
      expect(otherCliente?.nombre).toBe('María García');
    });
  });

  describe('setClienteToUpdate', () => {
    it('should set cliente to update', () => {
      useClienteStore.getState().setClienteToUpdate(mockClientes[0]);
      
      const { clienteToUpdate } = useClienteStore.getState();
      expect(clienteToUpdate).toEqual(mockClientes[0]);
    });
  });

  describe('setOpenUpdateDialog', () => {
    it('should set openUpdateDialog to true', () => {
      useClienteStore.getState().setOpenUpdateDialog(true);
      expect(useClienteStore.getState().openUpdateDialog).toBe(true);
    });

    it('should set openUpdateDialog to false', () => {
      useClienteStore.getState().setOpenUpdateDialog(true);
      useClienteStore.getState().setOpenUpdateDialog(false);
      expect(useClienteStore.getState().openUpdateDialog).toBe(false);
    });
  });
});
