import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useMesasStore, Mesa } from '@/store/mesas/mesas-store';

// Mock component that uses the mesas store
const MesasTestComponent = () => {
  const mesas = useMesasStore((state) => state.mesas);
  const addMesaToStore = useMesasStore((state) => state.addMesaToStore);
  const deleteMesaFromStore = useMesasStore((state) => state.deleteMesaFromStore);
  const updateMesaInStore = useMesasStore((state) => state.updateMesaInStore);
  const openAddDialog = useMesasStore((state) => state.openAddDialog);
  const setOpenAddDialog = useMesasStore((state) => state.setOpenAddDialog);

  const handleAddMesa = () => {
    const newMesa: Mesa = {
      id: Date.now(),
      numero: mesas.length + 1,
      estado: 'libre',
      capacidad: 4,
    };
    addMesaToStore(newMesa);
  };

  return (
    <div>
      <h1>Mesas ({mesas.length})</h1>
      <button onClick={handleAddMesa}>Agregar Mesa</button>
      <button onClick={() => setOpenAddDialog(!openAddDialog)}>
        {openAddDialog ? 'Cerrar Dialog' : 'Abrir Dialog'}
      </button>
      {openAddDialog && <div data-testid="dialog">Dialog Abierto</div>}
      <ul>
        {mesas.map((mesa) => (
          <li key={mesa.id} data-testid={`mesa-${mesa.id}`}>
            <span>Mesa {mesa.numero}</span>
            <span> - {mesa.estado}</span>
            <span> - {mesa.capacidad} personas</span>
            <button onClick={() => deleteMesaFromStore(mesa.id)}>Eliminar</button>
            <button
              onClick={() =>
                updateMesaInStore({
                  ...mesa,
                  estado: mesa.estado === 'libre' ? 'ocupada' : 'libre',
                })
              }
            >
              Cambiar Estado
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

describe('Mesas Store Integration', () => {
  beforeEach(() => {
    useMesasStore.setState({
      mesas: [],
      mesaToUpdate: null,
      openAddDialog: false,
      openUpdateDialog: false,
    });
  });

  it('should render empty mesas list initially', () => {
    render(<MesasTestComponent />);
    expect(screen.getByText('Mesas (0)')).toBeInTheDocument();
  });

  it('should add a mesa when clicking add button', async () => {
    const user = userEvent.setup();
    render(<MesasTestComponent />);

    await user.click(screen.getByText('Agregar Mesa'));

    expect(screen.getByText('Mesas (1)')).toBeInTheDocument();
    expect(screen.getByText(/Mesa 1/)).toBeInTheDocument();
  });

  it('should add multiple mesas', async () => {
    const user = userEvent.setup();
    render(<MesasTestComponent />);

    await user.click(screen.getByText('Agregar Mesa'));
    await user.click(screen.getByText('Agregar Mesa'));
    await user.click(screen.getByText('Agregar Mesa'));

    expect(screen.getByText('Mesas (3)')).toBeInTheDocument();
  });

  it('should delete a mesa', async () => {
    const user = userEvent.setup();
    render(<MesasTestComponent />);

    // Add a mesa first
    await user.click(screen.getByText('Agregar Mesa'));
    expect(screen.getByText('Mesas (1)')).toBeInTheDocument();

    // Delete the mesa
    await user.click(screen.getByText('Eliminar'));
    expect(screen.getByText('Mesas (0)')).toBeInTheDocument();
  });

  it('should update mesa estado', async () => {
    const user = userEvent.setup();
    render(<MesasTestComponent />);

    // Add a mesa first
    await user.click(screen.getByText('Agregar Mesa'));
    expect(screen.getByText(/libre/)).toBeInTheDocument();

    // Change estado
    await user.click(screen.getByText('Cambiar Estado'));
    expect(screen.getByText(/ocupada/)).toBeInTheDocument();

    // Change back
    await user.click(screen.getByText('Cambiar Estado'));
    expect(screen.getByText(/libre/)).toBeInTheDocument();
  });

  it('should toggle dialog open state', async () => {
    const user = userEvent.setup();
    render(<MesasTestComponent />);

    expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();

    await user.click(screen.getByText('Abrir Dialog'));
    expect(screen.getByTestId('dialog')).toBeInTheDocument();

    await user.click(screen.getByText('Cerrar Dialog'));
    expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
  });

  it('should maintain state across re-renders', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<MesasTestComponent />);

    await user.click(screen.getByText('Agregar Mesa'));
    await user.click(screen.getByText('Agregar Mesa'));

    // Rerender the component
    rerender(<MesasTestComponent />);

    // State should be preserved
    expect(screen.getByText('Mesas (2)')).toBeInTheDocument();
  });
});
