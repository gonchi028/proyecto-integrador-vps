import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useMesasStore, Mesa } from '@/store/mesas/mesas-store';
import { usePedidosStore, Pedido } from '@/store/pedidos/pedidos-store';
import { usePlatosStore, Producto } from '@/store/platos/platos-store';
import { useBebidasStore } from '@/store/bebida/bebida-store';
import { useClienteStore, Cliente } from '@/store/cliente/cliente-store';

// Complete restaurant application simulation
const RestaurantApp = () => {
  const [currentView, setCurrentView] = React.useState<'mesas' | 'pedido' | 'menu' | 'clientes'>('mesas');
  const [selectedMesa, setSelectedMesa] = React.useState<Mesa | null>(null);
  const [currentPedido, setCurrentPedido] = React.useState<Pedido | null>(null);

  // Stores
  const mesas = useMesasStore((state) => state.mesas);
  const setMesas = useMesasStore((state) => state.setMesas);
  const updateMesaInStore = useMesasStore((state) => state.updateMesaInStore);

  const pedidosLocal = usePedidosStore((state) => state.pedidosLocal);
  const setPedidos = usePedidosStore((state) => state.setPedidos);

  const platos = usePlatosStore((state) => state.platos);
  const setPlatos = usePlatosStore((state) => state.setPlatos);
  const platosMap = usePlatosStore((state) => state.platosMap);

  const bebidas = useBebidasStore((state) => state.bebidas);
  const setBebidas = useBebidasStore((state) => state.setBebidas);
  const bebidasMap = useBebidasStore((state) => state.bebidasMap);

  const clientes = useClienteStore((state) => state.clientes);
  const setClientes = useClienteStore((state) => state.setClientes);
  const addClienteToStore = useClienteStore((state) => state.addClienteToStore);

  const [cart, setCart] = React.useState<{ id: number; tipo: 'plato' | 'bebida'; cantidad: number }[]>([]);

  // Initialize data
  React.useEffect(() => {
    if (mesas.length === 0) {
      setMesas([
        { id: 1, numero: 1, estado: 'libre', capacidad: 4 },
        { id: 2, numero: 2, estado: 'libre', capacidad: 6 },
        { id: 3, numero: 3, estado: 'libre', capacidad: 2 },
      ]);
    }
    if (platos.length === 0) {
      setPlatos([
        { id: 1, nombre: 'Pizza Margherita', descripcion: 'Pizza clásica', cantidad: 10, categoria: 'Pizzas', precio: 45, tipo: 'plato', urlImagen: '' },
        { id: 2, nombre: 'Pasta Carbonara', descripcion: 'Pasta cremosa', cantidad: 10, categoria: 'Pastas', precio: 35, tipo: 'plato', urlImagen: '' },
        { id: 3, nombre: 'Ensalada César', descripcion: 'Ensalada fresca', cantidad: 10, categoria: 'Ensaladas', precio: 25, tipo: 'plato', urlImagen: '' },
      ]);
    }
    if (bebidas.length === 0) {
      setBebidas([
        { id: 101, nombre: 'Coca Cola', descripcion: 'Refresco', cantidad: 50, categoria: 'Refrescos', precio: 8, tipo: 'bebida', urlImagen: '' },
        { id: 102, nombre: 'Jugo de Naranja', descripcion: 'Jugo natural', cantidad: 30, categoria: 'Jugos', precio: 12, tipo: 'bebida', urlImagen: '' },
      ]);
    }
  }, []);

  const handleSelectMesa = (mesa: Mesa) => {
    if (mesa.estado !== 'libre') return;
    setSelectedMesa(mesa);
    setCurrentView('menu');
    
    // Create new pedido
    const newPedido: Pedido = {
      id: Date.now(),
      fechaHoraPedido: new Date(),
      fechaHoraEntrega: null,
      tipo: 'mesa',
      estado: 'pendiente',
      calificacionMesero: null,
      total: 0,
      mesaId: mesa.id,
      clienteCi: '',
      meseroId: null,
      pagoId: null,
      mesa: mesa,
      cliente: null,
      mesero: null,
      pago: null,
      detalleProductos: [],
      detalleCombos: [],
    };
    setCurrentPedido(newPedido);
  };

  const addToCart = (id: number, tipo: 'plato' | 'bebida') => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === id && item.tipo === tipo);
      if (existing) {
        return prev.map((item) =>
          item.id === id && item.tipo === tipo
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      return [...prev, { id, tipo, cantidad: 1 }];
    });
  };

  const removeFromCart = (id: number, tipo: 'plato' | 'bebida') => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === id && item.tipo === tipo);
      if (existing && existing.cantidad > 1) {
        return prev.map((item) =>
          item.id === id && item.tipo === tipo
            ? { ...item, cantidad: item.cantidad - 1 }
            : item
        );
      }
      return prev.filter((item) => !(item.id === id && item.tipo === tipo));
    });
  };

  const getTotal = () => {
    return cart.reduce((total, item) => {
      const producto = item.tipo === 'plato' ? platosMap.get(item.id) : bebidasMap.get(item.id);
      return total + (producto?.precio || 0) * item.cantidad;
    }, 0);
  };

  const confirmPedido = () => {
    if (!selectedMesa || !currentPedido || cart.length === 0) return;

    // Update mesa to occupied
    updateMesaInStore({ ...selectedMesa, estado: 'ocupada' });

    // Create the pedido with products
    const finalPedido: Pedido = {
      ...currentPedido,
      total: getTotal(),
      detalleProductos: cart
        .filter((c) => c.tipo === 'plato')
        .map((c) => ({
          estado: 'pendiente',
          cantidad: c.cantidad,
          calificacion: null,
          productoId: c.id,
          pedidoId: currentPedido.id,
          producto: platosMap.get(c.id)!,
        })),
      detalleCombos: [],
    };

    setPedidos([...pedidosLocal, finalPedido]);
    
    // Reset state
    setCart([]);
    setCurrentPedido(null);
    setSelectedMesa(null);
    setCurrentView('mesas');
  };

  const cancelPedido = () => {
    setCart([]);
    setCurrentPedido(null);
    setSelectedMesa(null);
    setCurrentView('mesas');
  };

  // Navigation
  const renderNavigation = () => (
    <nav>
      <button onClick={() => setCurrentView('mesas')} data-testid="nav-mesas">
        Mesas
      </button>
      <button onClick={() => setCurrentView('clientes')} data-testid="nav-clientes">
        Clientes
      </button>
    </nav>
  );

  // Mesas view
  const renderMesasView = () => (
    <div data-testid="view-mesas">
      <h2>Mesas del Restaurante</h2>
      <div className="mesas-grid">
        {mesas.map((mesa) => (
          <div
            key={mesa.id}
            data-testid={`mesa-card-${mesa.id}`}
            onClick={() => handleSelectMesa(mesa)}
            style={{ cursor: mesa.estado === 'libre' ? 'pointer' : 'not-allowed' }}
          >
            <h3>Mesa {mesa.numero}</h3>
            <p>Estado: {mesa.estado}</p>
            <p>Capacidad: {mesa.capacidad} personas</p>
            {mesa.estado === 'libre' && (
              <button data-testid={`btn-select-mesa-${mesa.id}`}>Seleccionar</button>
            )}
          </div>
        ))}
      </div>
      <div>
        <h3>Pedidos Activos ({pedidosLocal.filter(p => p.estado !== 'entregado').length})</h3>
        <ul>
          {pedidosLocal.filter(p => p.estado !== 'entregado').map((pedido) => (
            <li key={pedido.id} data-testid={`pedido-activo-${pedido.id}`}>
              Mesa {pedido.mesaId} - Total: Bs. {pedido.total} - {pedido.estado}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  // Menu view
  const renderMenuView = () => (
    <div data-testid="view-menu">
      <h2>Menú - Mesa {selectedMesa?.numero}</h2>
      
      <section>
        <h3>Platos</h3>
        <ul>
          {platos.map((plato) => (
            <li key={plato.id} data-testid={`menu-plato-${plato.id}`}>
              <span>{plato.nombre} - Bs. {plato.precio}</span>
              <button onClick={() => addToCart(plato.id, 'plato')} data-testid={`add-plato-${plato.id}`}>
                +
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Bebidas</h3>
        <ul>
          {bebidas.map((bebida) => (
            <li key={bebida.id} data-testid={`menu-bebida-${bebida.id}`}>
              <span>{bebida.nombre} - Bs. {bebida.precio}</span>
              <button onClick={() => addToCart(bebida.id, 'bebida')} data-testid={`add-bebida-${bebida.id}`}>
                +
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section data-testid="cart-section">
        <h3>Carrito</h3>
        <ul>
          {cart.map((item) => {
            const producto = item.tipo === 'plato' ? platosMap.get(item.id) : bebidasMap.get(item.id);
            return (
              <li key={`${item.tipo}-${item.id}`} data-testid={`cart-item-${item.tipo}-${item.id}`}>
                <span>{producto?.nombre} x {item.cantidad}</span>
                <span> = Bs. {(producto?.precio || 0) * item.cantidad}</span>
                <button onClick={() => removeFromCart(item.id, item.tipo)} data-testid={`remove-${item.tipo}-${item.id}`}>
                  -
                </button>
              </li>
            );
          })}
        </ul>
        <p data-testid="cart-total">Total: Bs. {getTotal()}</p>
        <button onClick={confirmPedido} disabled={cart.length === 0} data-testid="btn-confirm-pedido">
          Confirmar Pedido
        </button>
        <button onClick={cancelPedido} data-testid="btn-cancel-pedido">
          Cancelar
        </button>
      </section>
    </div>
  );

  return (
    <div data-testid="restaurant-app">
      <h1>Restaurante Terrasse</h1>
      {renderNavigation()}
      
      {currentView === 'mesas' && renderMesasView()}
      {currentView === 'menu' && renderMenuView()}
      {currentView === 'clientes' && (
        <ClientesView 
          clientes={clientes} 
          addClienteToStore={addClienteToStore} 
        />
      )}
    </div>
  );
};

// Separate component to avoid hook ordering issues
const ClientesView = ({ 
  clientes, 
  addClienteToStore 
}: { 
  clientes: Cliente[]; 
  addClienteToStore: (cliente: Cliente) => void;
}) => {
  const [formData, setFormData] = React.useState({ ci: '', nombre: '', celular: '' });

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

  return (
    <div data-testid="view-clientes">
      <h2>Gestión de Clientes ({clientes.length})</h2>
      
      <div>
        <input
          placeholder="CI"
          value={formData.ci}
          onChange={(e) => setFormData({ ...formData, ci: e.target.value })}
          data-testid="cliente-input-ci"
        />
        <input
          placeholder="Nombre"
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          data-testid="cliente-input-nombre"
        />
        <input
          placeholder="Celular"
          value={formData.celular}
          onChange={(e) => setFormData({ ...formData, celular: e.target.value })}
          data-testid="cliente-input-celular"
        />
        <button onClick={handleAddCliente} data-testid="btn-add-cliente">
          Agregar Cliente
        </button>
      </div>

      <ul>
        {clientes.map((cliente) => (
          <li key={cliente.ci} data-testid={`cliente-${cliente.ci}`}>
            {cliente.nombre} - CI: {cliente.ci} - Puntos: {cliente.puntos}
          </li>
        ))}
      </ul>
    </div>
  );
};

describe('E2E: Complete Restaurant Workflow', () => {
  beforeEach(() => {
    useMesasStore.setState({
      mesas: [],
      mesaToUpdate: null,
      openAddDialog: false,
      openUpdateDialog: false,
    });
    usePedidosStore.setState({
      pedidosLocal: [],
      pedidosDomicilio: [],
    });
    usePlatosStore.setState({
      platos: [],
      platosMap: new Map<number, Producto>(),
      openUpdateDialog: false,
      platoToUpdate: null,
    });
    useBebidasStore.setState({
      bebidas: [],
      bebidasMap: new Map<number, Producto>(),
      openUpdateDialog: false,
      bebidaToUpdate: null,
    });
    useClienteStore.setState({
      clientes: [],
      openUpdateDialog: false,
      clienteToUpdate: null,
    });
  });

  describe('Initial State', () => {
    it('should render the restaurant app', () => {
      render(<RestaurantApp />);
      expect(screen.getByTestId('restaurant-app')).toBeInTheDocument();
      expect(screen.getByText('Restaurante Terrasse')).toBeInTheDocument();
    });

    it('should show mesas view by default', () => {
      render(<RestaurantApp />);
      expect(screen.getByTestId('view-mesas')).toBeInTheDocument();
    });

    it('should display 3 mesas', () => {
      render(<RestaurantApp />);
      expect(screen.getByTestId('mesa-card-1')).toBeInTheDocument();
      expect(screen.getByTestId('mesa-card-2')).toBeInTheDocument();
      expect(screen.getByTestId('mesa-card-3')).toBeInTheDocument();
    });

    it('should show no active pedidos initially', () => {
      render(<RestaurantApp />);
      expect(screen.getByText('Pedidos Activos (0)')).toBeInTheDocument();
    });
  });

  describe('Complete Order Flow', () => {
    it('should complete a full order from mesa selection to confirmation', async () => {
      const user = userEvent.setup();
      render(<RestaurantApp />);

      // Step 1: Select mesa
      await user.click(screen.getByTestId('btn-select-mesa-1'));
      expect(screen.getByTestId('view-menu')).toBeInTheDocument();
      expect(screen.getByText('Menú - Mesa 1')).toBeInTheDocument();

      // Step 2: Add items to cart
      await user.click(screen.getByTestId('add-plato-1')); // Pizza 45
      await user.click(screen.getByTestId('add-plato-2')); // Pasta 35
      await user.click(screen.getByTestId('add-bebida-101')); // Coca Cola 8
      await user.click(screen.getByTestId('add-bebida-101')); // Coca Cola 8 (x2)

      // Step 3: Verify cart
      expect(screen.getByTestId('cart-total')).toHaveTextContent('Total: Bs. 96');

      // Step 4: Confirm order
      await user.click(screen.getByTestId('btn-confirm-pedido'));

      // Step 5: Verify back to mesas view
      expect(screen.getByTestId('view-mesas')).toBeInTheDocument();
      
      // Step 6: Verify mesa is now occupied
      expect(screen.getByTestId('mesa-card-1')).toHaveTextContent('ocupada');
      
      // Step 7: Verify active pedidos count
      expect(screen.getByText('Pedidos Activos (1)')).toBeInTheDocument();
    });

    it('should not allow selecting an occupied mesa', async () => {
      const user = userEvent.setup();
      render(<RestaurantApp />);

      // Create first order
      await user.click(screen.getByTestId('btn-select-mesa-1'));
      await user.click(screen.getByTestId('add-plato-1'));
      await user.click(screen.getByTestId('btn-confirm-pedido'));

      // Mesa 1 should not have a select button anymore
      const mesa1 = screen.getByTestId('mesa-card-1');
      expect(within(mesa1).queryByTestId('btn-select-mesa-1')).not.toBeInTheDocument();
    });

    it('should cancel order and return to mesas', async () => {
      const user = userEvent.setup();
      render(<RestaurantApp />);

      // Select mesa
      await user.click(screen.getByTestId('btn-select-mesa-1'));
      expect(screen.getByTestId('view-menu')).toBeInTheDocument();

      // Add items
      await user.click(screen.getByTestId('add-plato-1'));

      // Cancel
      await user.click(screen.getByTestId('btn-cancel-pedido'));

      // Should be back at mesas view
      expect(screen.getByTestId('view-mesas')).toBeInTheDocument();
      
      // Mesa should still be libre
      expect(screen.getByTestId('mesa-card-1')).toHaveTextContent('libre');
    });
  });

  describe('Cart Management', () => {
    it('should add and remove items from cart', async () => {
      const user = userEvent.setup();
      render(<RestaurantApp />);

      // Select mesa
      await user.click(screen.getByTestId('btn-select-mesa-1'));

      // Add items
      await user.click(screen.getByTestId('add-plato-1'));
      await user.click(screen.getByTestId('add-plato-1'));
      expect(screen.getByTestId('cart-total')).toHaveTextContent('Total: Bs. 90');

      // Remove one
      await user.click(screen.getByTestId('remove-plato-1'));
      expect(screen.getByTestId('cart-total')).toHaveTextContent('Total: Bs. 45');

      // Remove all
      await user.click(screen.getByTestId('remove-plato-1'));
      expect(screen.getByTestId('cart-total')).toHaveTextContent('Total: Bs. 0');
    });

    it('should not allow confirming empty cart', async () => {
      const user = userEvent.setup();
      render(<RestaurantApp />);

      await user.click(screen.getByTestId('btn-select-mesa-1'));

      const confirmButton = screen.getByTestId('btn-confirm-pedido');
      expect(confirmButton).toBeDisabled();
    });
  });

  describe('Navigation', () => {
    it('should navigate between views', async () => {
      const user = userEvent.setup();
      render(<RestaurantApp />);

      // Go to clientes
      await user.click(screen.getByTestId('nav-clientes'));
      expect(screen.getByTestId('view-clientes')).toBeInTheDocument();

      // Go back to mesas
      await user.click(screen.getByTestId('nav-mesas'));
      expect(screen.getByTestId('view-mesas')).toBeInTheDocument();
    });
  });

  describe('Cliente Management', () => {
    it('should add a new cliente', async () => {
      const user = userEvent.setup();
      render(<RestaurantApp />);

      // Navigate to clientes
      await user.click(screen.getByTestId('nav-clientes'));

      // Fill form
      await user.type(screen.getByTestId('cliente-input-ci'), '12345678');
      await user.type(screen.getByTestId('cliente-input-nombre'), 'Juan Pérez');
      await user.type(screen.getByTestId('cliente-input-celular'), '70012345');

      // Submit
      await user.click(screen.getByTestId('btn-add-cliente'));

      // Verify
      expect(screen.getByText('Gestión de Clientes (1)')).toBeInTheDocument();
      expect(screen.getByTestId('cliente-12345678')).toHaveTextContent('Juan Pérez');
    });
  });

  describe('Multiple Orders', () => {
    it('should handle multiple simultaneous orders', async () => {
      const user = userEvent.setup();
      render(<RestaurantApp />);

      // Order 1: Mesa 1
      await user.click(screen.getByTestId('btn-select-mesa-1'));
      await user.click(screen.getByTestId('add-plato-1'));
      await user.click(screen.getByTestId('btn-confirm-pedido'));

      // Order 2: Mesa 2
      await user.click(screen.getByTestId('btn-select-mesa-2'));
      await user.click(screen.getByTestId('add-plato-2'));
      await user.click(screen.getByTestId('add-bebida-102'));
      await user.click(screen.getByTestId('btn-confirm-pedido'));

      // Verify both mesas occupied
      expect(screen.getByTestId('mesa-card-1')).toHaveTextContent('ocupada');
      expect(screen.getByTestId('mesa-card-2')).toHaveTextContent('ocupada');
      expect(screen.getByTestId('mesa-card-3')).toHaveTextContent('libre');

      // Verify active pedidos
      expect(screen.getByText('Pedidos Activos (2)')).toBeInTheDocument();
    });
  });
});
