import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { usePedidosStore, Pedido } from '@/store/pedidos/pedidos-store';
import { useMesasStore, Mesa } from '@/store/mesas/mesas-store';

// Mock component simulating the pedidos workflow
const PedidosWorkflowComponent = () => {
  const pedidosLocal = usePedidosStore((state) => state.pedidosLocal);
  const pedidosDomicilio = usePedidosStore((state) => state.pedidosDomicilio);
  const setPedidos = usePedidosStore((state) => state.setPedidos);
  const updatePedidoInStore = usePedidosStore((state) => state.updatePedidoInStore);
  
  const mesas = useMesasStore((state) => state.mesas);
  const setMesas = useMesasStore((state) => state.setMesas);
  const updateMesaInStore = useMesasStore((state) => state.updateMesaInStore);

  // Initialize mesas
  React.useEffect(() => {
    if (mesas.length === 0) {
      setMesas([
        { id: 1, numero: 1, estado: 'libre', capacidad: 4 },
        { id: 2, numero: 2, estado: 'libre', capacidad: 6 },
        { id: 3, numero: 3, estado: 'libre', capacidad: 2 },
      ]);
    }
  }, []);

  const createPedidoLocal = (mesaId: number) => {
    const mesa = mesas.find((m) => m.id === mesaId);
    if (!mesa || mesa.estado !== 'libre') return;

    const newPedido: Pedido = {
      id: Date.now(),
      fechaHoraPedido: new Date(),
      fechaHoraEntrega: null,
      tipo: 'mesa',
      estado: 'pendiente',
      calificacionMesero: null,
      total: 100,
      mesaId: mesaId,
      clienteCi: '12345678',
      meseroId: null,
      pagoId: null,
      mesa: { ...mesa, estado: 'ocupada' },
      cliente: null,
      mesero: null,
      pago: null,
      detalleProductos: [],
      detalleCombos: [],
    };

    // Update mesa status
    updateMesaInStore({ ...mesa, estado: 'ocupada' });
    
    // Add pedido
    const allPedidos = [...pedidosLocal, ...pedidosDomicilio, newPedido];
    setPedidos(allPedidos);
  };

  const createPedidoDomicilio = () => {
    const newPedido: Pedido = {
      id: Date.now(),
      fechaHoraPedido: new Date(),
      fechaHoraEntrega: null,
      tipo: 'domicilio',
      estado: 'pendiente',
      calificacionMesero: null,
      total: 150,
      mesaId: null,
      clienteCi: '87654321',
      meseroId: null,
      pagoId: null,
      mesa: null,
      cliente: null,
      mesero: null,
      pago: null,
      detalleProductos: [],
      detalleCombos: [],
    };

    const allPedidos = [...pedidosLocal, ...pedidosDomicilio, newPedido];
    setPedidos(allPedidos);
  };

  const updateEstado = (pedidoId: number, nuevoEstado: Pedido['estado']) => {
    updatePedidoInStore(pedidoId, { estado: nuevoEstado });
  };

  const entregarPedido = (pedido: Pedido) => {
    updatePedidoInStore(pedido.id, { 
      estado: 'entregado',
      fechaHoraEntrega: new Date(),
    });
    
    // Free the mesa if it's a local order
    if (pedido.mesaId) {
      const mesa = mesas.find((m) => m.id === pedido.mesaId);
      if (mesa) {
        updateMesaInStore({ ...mesa, estado: 'libre' });
      }
    }
  };

  return (
    <div>
      <h1>Sistema de Pedidos</h1>

      <section>
        <h2>Mesas</h2>
        <ul>
          {mesas.map((mesa) => (
            <li key={mesa.id} data-testid={`mesa-${mesa.id}`}>
              Mesa {mesa.numero} - {mesa.estado} - {mesa.capacidad} personas
              {mesa.estado === 'libre' && (
                <button onClick={() => createPedidoLocal(mesa.id)}>
                  Crear Pedido
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Pedidos Locales ({pedidosLocal.length})</h2>
        <ul>
          {pedidosLocal.map((pedido) => (
            <li key={pedido.id} data-testid={`pedido-local-${pedido.id}`}>
              <span>Pedido #{pedido.id.toString().slice(-4)}</span>
              <span> - Mesa {pedido.mesaId}</span>
              <span> - Estado: {pedido.estado}</span>
              <span> - Total: Bs. {pedido.total}</span>
              {pedido.estado === 'pendiente' && (
                <button onClick={() => updateEstado(pedido.id, 'listo para recoger')}>
                  Listo
                </button>
              )}
              {pedido.estado === 'listo para recoger' && (
                <button onClick={() => entregarPedido(pedido)}>
                  Entregar
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Pedidos a Domicilio ({pedidosDomicilio.length})</h2>
        <button onClick={createPedidoDomicilio}>Nuevo Pedido Domicilio</button>
        <ul>
          {pedidosDomicilio.map((pedido) => (
            <li key={pedido.id} data-testid={`pedido-domicilio-${pedido.id}`}>
              <span>Pedido #{pedido.id.toString().slice(-4)}</span>
              <span> - Estado: {pedido.estado}</span>
              <span> - Total: Bs. {pedido.total}</span>
              {pedido.estado === 'pendiente' && (
                <button onClick={() => updateEstado(pedido.id, 'en camino')}>
                  Enviar
                </button>
              )}
              {pedido.estado === 'en camino' && (
                <button onClick={() => entregarPedido(pedido)}>
                  Entregar
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Resumen</h2>
        <p data-testid="total-pedidos">
          Total pedidos: {pedidosLocal.length + pedidosDomicilio.length}
        </p>
        <p data-testid="mesas-ocupadas">
          Mesas ocupadas: {mesas.filter((m) => m.estado === 'ocupada').length}
        </p>
      </section>
    </div>
  );
};

describe('Pedidos Workflow Integration', () => {
  beforeEach(() => {
    usePedidosStore.setState({
      pedidosLocal: [],
      pedidosDomicilio: [],
    });
    useMesasStore.setState({
      mesas: [],
      mesaToUpdate: null,
      openAddDialog: false,
      openUpdateDialog: false,
    });
  });

  it('should render initial state', () => {
    render(<PedidosWorkflowComponent />);
    
    expect(screen.getByText('Pedidos Locales (0)')).toBeInTheDocument();
    expect(screen.getByText('Pedidos a Domicilio (0)')).toBeInTheDocument();
    expect(screen.getByTestId('total-pedidos')).toHaveTextContent('Total pedidos: 0');
  });

  it('should initialize mesas', () => {
    render(<PedidosWorkflowComponent />);
    
    expect(screen.getByText(/Mesa 1 - libre/)).toBeInTheDocument();
    expect(screen.getByText(/Mesa 2 - libre/)).toBeInTheDocument();
    expect(screen.getByText(/Mesa 3 - libre/)).toBeInTheDocument();
  });

  it('should create local pedido and occupy mesa', async () => {
    const user = userEvent.setup();
    render(<PedidosWorkflowComponent />);

    // Create pedido for mesa 1
    const createButtons = screen.getAllByText('Crear Pedido');
    await user.click(createButtons[0]);

    expect(screen.getByText('Pedidos Locales (1)')).toBeInTheDocument();
    expect(screen.getByText(/Mesa 1 - ocupada/)).toBeInTheDocument();
    expect(screen.getByTestId('mesas-ocupadas')).toHaveTextContent('Mesas ocupadas: 1');
  });

  it('should create domicilio pedido', async () => {
    const user = userEvent.setup();
    render(<PedidosWorkflowComponent />);

    await user.click(screen.getByText('Nuevo Pedido Domicilio'));

    expect(screen.getByText('Pedidos a Domicilio (1)')).toBeInTheDocument();
    expect(screen.getByTestId('total-pedidos')).toHaveTextContent('Total pedidos: 1');
  });

  it('should update pedido estado to listo', async () => {
    const user = userEvent.setup();
    render(<PedidosWorkflowComponent />);

    // Create local pedido
    const createButtons = screen.getAllByText('Crear Pedido');
    await user.click(createButtons[0]);

    expect(screen.getByText(/Estado: pendiente/)).toBeInTheDocument();

    // Mark as ready
    await user.click(screen.getByText('Listo'));

    expect(screen.getByText(/Estado: listo para recoger/)).toBeInTheDocument();
  });

  it('should complete pedido workflow and free mesa', async () => {
    const user = userEvent.setup();
    render(<PedidosWorkflowComponent />);

    // Create local pedido
    const createButtons = screen.getAllByText('Crear Pedido');
    await user.click(createButtons[0]);

    expect(screen.getByText(/Mesa 1 - ocupada/)).toBeInTheDocument();

    // Mark as ready
    await user.click(screen.getByText('Listo'));
    
    // Deliver
    await user.click(screen.getByText('Entregar'));

    expect(screen.getByText(/Estado: entregado/)).toBeInTheDocument();
    expect(screen.getByText(/Mesa 1 - libre/)).toBeInTheDocument();
    expect(screen.getByTestId('mesas-ocupadas')).toHaveTextContent('Mesas ocupadas: 0');
  });

  it('should handle domicilio pedido workflow', async () => {
    const user = userEvent.setup();
    render(<PedidosWorkflowComponent />);

    // Create domicilio pedido
    await user.click(screen.getByText('Nuevo Pedido Domicilio'));

    expect(screen.getByText(/Estado: pendiente/)).toBeInTheDocument();

    // Send
    await user.click(screen.getByText('Enviar'));
    expect(screen.getByText(/Estado: en camino/)).toBeInTheDocument();

    // Deliver
    await user.click(screen.getByText('Entregar'));
    expect(screen.getByText(/Estado: entregado/)).toBeInTheDocument();
  });

  it('should handle multiple pedidos simultaneously', async () => {
    const user = userEvent.setup();
    render(<PedidosWorkflowComponent />);

    // Create local pedidos - need to re-query after each click since DOM changes
    let createButtons = screen.getAllByText('Crear Pedido');
    await user.click(createButtons[0]); // Mesa 1

    // Re-query for the updated DOM
    createButtons = screen.getAllByText('Crear Pedido');
    await user.click(createButtons[0]); // Mesa 2 (now first available)

    // Create domicilio pedido
    await user.click(screen.getByText('Nuevo Pedido Domicilio'));

    expect(screen.getByText('Pedidos Locales (2)')).toBeInTheDocument();
    expect(screen.getByText('Pedidos a Domicilio (1)')).toBeInTheDocument();
    expect(screen.getByTestId('total-pedidos')).toHaveTextContent('Total pedidos: 3');
    expect(screen.getByTestId('mesas-ocupadas')).toHaveTextContent('Mesas ocupadas: 2');
  });

  it('should not allow creating pedido on occupied mesa', async () => {
    const user = userEvent.setup();
    render(<PedidosWorkflowComponent />);

    // Create pedido for mesa 1
    const createButtons = screen.getAllByText('Crear Pedido');
    await user.click(createButtons[0]);

    // Mesa 1 should show "ocupada" and not have a "Crear Pedido" button
    const mesa1 = screen.getByTestId('mesa-1');
    expect(within(mesa1).getByText(/ocupada/i)).toBeInTheDocument();
    expect(within(mesa1).queryByText('Crear Pedido')).not.toBeInTheDocument();
  });
});
