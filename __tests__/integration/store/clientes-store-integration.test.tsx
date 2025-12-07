import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useClienteStore, Cliente } from '@/store/cliente/cliente-store';

// Mock component that uses the cliente store
const ClientesTestComponent = () => {
  const clientes = useClienteStore((state) => state.clientes);
  const addClienteToStore = useClienteStore((state) => state.addClienteToStore);
  const deleteClienteFromStore = useClienteStore((state) => state.deleteClienteFromStore);
  const updateClienteFromStore = useClienteStore((state) => state.updateClienteFromStore);
  const clienteToUpdate = useClienteStore((state) => state.clienteToUpdate);
  const setClienteToUpdate = useClienteStore((state) => state.setClienteToUpdate);

  const [formData, setFormData] = React.useState({
    ci: '',
    nombre: '',
    celular: '',
  });

  const handleAddCliente = () => {
    if (!formData.ci || !formData.nombre) return;
    
    const newCliente: Cliente = {
      ci: formData.ci,
      nombre: formData.nombre,
      celular: formData.celular || null,
      direccion: null,
      puntos: 0,
      notasEntrega: null,
      razonSocial: null,
      nit: null,
    };
    addClienteToStore(newCliente);
    setFormData({ ci: '', nombre: '', celular: '' });
  };

  const handleUpdatePuntos = (cliente: Cliente) => {
    updateClienteFromStore({
      ...cliente,
      puntos: (cliente.puntos || 0) + 10,
    });
  };

  return (
    <div>
      <h1>Clientes ({clientes.length})</h1>
      
      <div>
        <input
          placeholder="CI"
          value={formData.ci}
          onChange={(e) => setFormData({ ...formData, ci: e.target.value })}
          data-testid="input-ci"
        />
        <input
          placeholder="Nombre"
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          data-testid="input-nombre"
        />
        <input
          placeholder="Celular"
          value={formData.celular}
          onChange={(e) => setFormData({ ...formData, celular: e.target.value })}
          data-testid="input-celular"
        />
        <button onClick={handleAddCliente}>Agregar Cliente</button>
      </div>

      {clienteToUpdate && (
        <div data-testid="cliente-selected">
          Cliente seleccionado: {clienteToUpdate.nombre}
        </div>
      )}

      <ul>
        {clientes.map((cliente) => (
          <li key={cliente.ci} data-testid={`cliente-${cliente.ci}`}>
            <span>{cliente.nombre}</span>
            <span> - CI: {cliente.ci}</span>
            <span> - Puntos: {cliente.puntos}</span>
            <button onClick={() => deleteClienteFromStore(cliente.ci)}>Eliminar</button>
            <button onClick={() => handleUpdatePuntos(cliente)}>+10 Puntos</button>
            <button onClick={() => setClienteToUpdate(cliente)}>Seleccionar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

describe('Clientes Store Integration', () => {
  beforeEach(() => {
    useClienteStore.setState({
      clientes: [],
      openUpdateDialog: false,
      clienteToUpdate: null,
    });
  });

  it('should render empty clientes list initially', () => {
    render(<ClientesTestComponent />);
    expect(screen.getByText('Clientes (0)')).toBeInTheDocument();
  });

  it('should add a cliente with form data', async () => {
    const user = userEvent.setup();
    render(<ClientesTestComponent />);

    await user.type(screen.getByTestId('input-ci'), '12345678');
    await user.type(screen.getByTestId('input-nombre'), 'Juan Pérez');
    await user.type(screen.getByTestId('input-celular'), '70012345');
    await user.click(screen.getByText('Agregar Cliente'));

    expect(screen.getByText('Clientes (1)')).toBeInTheDocument();
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    expect(screen.getByText(/CI: 12345678/)).toBeInTheDocument();
  });

  it('should not add cliente without required fields', async () => {
    const user = userEvent.setup();
    render(<ClientesTestComponent />);

    // Try to add without filling in required fields
    await user.click(screen.getByText('Agregar Cliente'));

    expect(screen.getByText('Clientes (0)')).toBeInTheDocument();
  });

  it('should clear form after adding cliente', async () => {
    const user = userEvent.setup();
    render(<ClientesTestComponent />);

    const ciInput = screen.getByTestId('input-ci');
    const nombreInput = screen.getByTestId('input-nombre');

    await user.type(ciInput, '12345678');
    await user.type(nombreInput, 'Juan Pérez');
    await user.click(screen.getByText('Agregar Cliente'));

    expect(ciInput).toHaveValue('');
    expect(nombreInput).toHaveValue('');
  });

  it('should delete a cliente', async () => {
    const user = userEvent.setup();
    render(<ClientesTestComponent />);

    // Add a cliente first
    await user.type(screen.getByTestId('input-ci'), '12345678');
    await user.type(screen.getByTestId('input-nombre'), 'Juan Pérez');
    await user.click(screen.getByText('Agregar Cliente'));
    expect(screen.getByText('Clientes (1)')).toBeInTheDocument();

    // Delete the cliente
    await user.click(screen.getByText('Eliminar'));
    expect(screen.getByText('Clientes (0)')).toBeInTheDocument();
  });

  it('should update cliente puntos', async () => {
    const user = userEvent.setup();
    render(<ClientesTestComponent />);

    // Add a cliente
    await user.type(screen.getByTestId('input-ci'), '12345678');
    await user.type(screen.getByTestId('input-nombre'), 'Juan Pérez');
    await user.click(screen.getByText('Agregar Cliente'));

    expect(screen.getByText(/Puntos: 0/)).toBeInTheDocument();

    // Add points
    await user.click(screen.getByText('+10 Puntos'));
    expect(screen.getByText(/Puntos: 10/)).toBeInTheDocument();

    // Add more points
    await user.click(screen.getByText('+10 Puntos'));
    expect(screen.getByText(/Puntos: 20/)).toBeInTheDocument();
  });

  it('should select cliente', async () => {
    const user = userEvent.setup();
    render(<ClientesTestComponent />);

    // Add a cliente
    await user.type(screen.getByTestId('input-ci'), '12345678');
    await user.type(screen.getByTestId('input-nombre'), 'Juan Pérez');
    await user.click(screen.getByText('Agregar Cliente'));

    // Select the cliente
    await user.click(screen.getByText('Seleccionar'));

    expect(screen.getByTestId('cliente-selected')).toHaveTextContent(
      'Cliente seleccionado: Juan Pérez'
    );
  });

  it('should handle multiple clientes', async () => {
    const user = userEvent.setup();
    render(<ClientesTestComponent />);

    // Add first cliente
    await user.type(screen.getByTestId('input-ci'), '11111111');
    await user.type(screen.getByTestId('input-nombre'), 'Cliente 1');
    await user.click(screen.getByText('Agregar Cliente'));

    // Add second cliente
    await user.type(screen.getByTestId('input-ci'), '22222222');
    await user.type(screen.getByTestId('input-nombre'), 'Cliente 2');
    await user.click(screen.getByText('Agregar Cliente'));

    // Add third cliente
    await user.type(screen.getByTestId('input-ci'), '33333333');
    await user.type(screen.getByTestId('input-nombre'), 'Cliente 3');
    await user.click(screen.getByText('Agregar Cliente'));

    expect(screen.getByText('Clientes (3)')).toBeInTheDocument();
    expect(screen.getByText('Cliente 1')).toBeInTheDocument();
    expect(screen.getByText('Cliente 2')).toBeInTheDocument();
    expect(screen.getByText('Cliente 3')).toBeInTheDocument();
  });
});
