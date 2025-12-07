import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { usePlatosStore, Producto } from '@/store/platos/platos-store';
import { useBebidasStore } from '@/store/bebida/bebida-store';

// Component simulating a products menu
const ProductosMenuComponent = () => {
  const platos = usePlatosStore((state) => state.platos);
  const bebidas = useBebidasStore((state) => state.bebidas);
  
  const setPlatos = usePlatosStore((state) => state.setPlatos);
  const setBebidas = useBebidasStore((state) => state.setBebidas);

  const [cart, setCart] = React.useState<{ id: number; tipo: 'plato' | 'bebida'; cantidad: number }[]>([]);

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

  const getTotal = () => {
    return cart.reduce((total, item) => {
      // Find the producto from the arrays (since map isn't updated on addPlatoToStore)
      const producto =
        item.tipo === 'plato' 
          ? platos.find(p => p.id === item.id)
          : bebidas.find(b => b.id === item.id);
      return total + (producto?.precio || 0) * item.cantidad;
    }, 0);
  };

  const handleAddPlato = () => {
    const newPlato: Producto = {
      id: Date.now(),
      nombre: `Plato ${platos.length + 1}`,
      descripcion: 'Descripción del plato',
      cantidad: 10,
      categoria: 'Principal',
      precio: 45,
      tipo: 'plato',
      urlImagen: '',
    };
    // Use setPlatos to ensure platosMap is updated
    setPlatos([...platos, newPlato]);
  };

  const handleAddBebida = () => {
    const newBebida: Producto = {
      id: Date.now(),
      nombre: `Bebida ${bebidas.length + 1}`,
      descripcion: 'Descripción de la bebida',
      cantidad: 20,
      categoria: 'Refrescos',
      precio: 10,
      tipo: 'bebida',
      urlImagen: '',
    };
    // Use setBebidas to ensure bebidasMap is updated
    setBebidas([...bebidas, newBebida]);
  };

  const handleDeletePlato = (id: number) => {
    setPlatos(platos.filter(p => p.id !== id));
  };

  const handleDeleteBebida = (id: number) => {
    setBebidas(bebidas.filter(b => b.id !== id));
  };

  return (
    <div>
      <h1>Menú del Restaurante</h1>
      
      <div>
        <button onClick={handleAddPlato}>Agregar Plato</button>
        <button onClick={handleAddBebida}>Agregar Bebida</button>
      </div>

      <section>
        <h2>Platos ({platos.length})</h2>
        <ul>
          {platos.map((plato) => (
            <li key={plato.id} data-testid={`plato-${plato.id}`}>
              <span>{plato.nombre}</span>
              <span> - Bs. {plato.precio}</span>
              <button onClick={() => addToCart(plato.id, 'plato')}>Agregar al carrito</button>
              <button onClick={() => handleDeletePlato(plato.id)}>Eliminar</button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Bebidas ({bebidas.length})</h2>
        <ul>
          {bebidas.map((bebida) => (
            <li key={bebida.id} data-testid={`bebida-${bebida.id}`}>
              <span>{bebida.nombre}</span>
              <span> - Bs. {bebida.precio}</span>
              <button onClick={() => addToCart(bebida.id, 'bebida')}>Agregar al carrito</button>
              <button onClick={() => handleDeleteBebida(bebida.id)}>Eliminar</button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Carrito ({cart.length} items)</h2>
        <ul>
          {cart.map((item, index) => {
            const producto =
              item.tipo === 'plato'
                ? platos.find(p => p.id === item.id)
                : bebidas.find(b => b.id === item.id);
            return (
              <li key={`${item.tipo}-${item.id}-${index}`}>
                {producto?.nombre} x {item.cantidad} = Bs.{' '}
                {(producto?.precio || 0) * item.cantidad}
              </li>
            );
          })}
        </ul>
        <p data-testid="total">Total: Bs. {getTotal()}</p>
      </section>
    </div>
  );
};

describe('Productos Menu Integration', () => {
  beforeEach(() => {
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
  });

  it('should render empty menu initially', () => {
    render(<ProductosMenuComponent />);
    expect(screen.getByText('Platos (0)')).toBeInTheDocument();
    expect(screen.getByText('Bebidas (0)')).toBeInTheDocument();
    expect(screen.getByText('Carrito (0 items)')).toBeInTheDocument();
  });

  it('should add platos to the menu', async () => {
    const user = userEvent.setup();
    render(<ProductosMenuComponent />);

    await user.click(screen.getByText('Agregar Plato'));
    await user.click(screen.getByText('Agregar Plato'));

    expect(screen.getByText('Platos (2)')).toBeInTheDocument();
    expect(screen.getByText(/Plato 1/)).toBeInTheDocument();
    expect(screen.getByText(/Plato 2/)).toBeInTheDocument();
  });

  it('should add bebidas to the menu', async () => {
    const user = userEvent.setup();
    render(<ProductosMenuComponent />);

    await user.click(screen.getByText('Agregar Bebida'));
    await user.click(screen.getByText('Agregar Bebida'));

    expect(screen.getByText('Bebidas (2)')).toBeInTheDocument();
    expect(screen.getByText(/Bebida 1/)).toBeInTheDocument();
    expect(screen.getByText(/Bebida 2/)).toBeInTheDocument();
  });

  it('should add items to cart', async () => {
    const user = userEvent.setup();
    render(<ProductosMenuComponent />);

    // Add products first
    await user.click(screen.getByText('Agregar Plato'));
    await user.click(screen.getByText('Agregar Bebida'));

    // Add to cart
    const agregarButtons = screen.getAllByText('Agregar al carrito');
    await user.click(agregarButtons[0]); // Add plato
    await user.click(agregarButtons[1]); // Add bebida

    expect(screen.getByText('Carrito (2 items)')).toBeInTheDocument();
  });

  it('should calculate cart total correctly', async () => {
    const user = userEvent.setup();
    render(<ProductosMenuComponent />);

    // Add products
    await user.click(screen.getByText('Agregar Plato')); // Bs. 45
    await user.click(screen.getByText('Agregar Bebida')); // Bs. 10

    // Add to cart
    const agregarButtons = screen.getAllByText('Agregar al carrito');
    await user.click(agregarButtons[0]); // Add plato (45)
    await user.click(agregarButtons[1]); // Add bebida (10)

    expect(screen.getByTestId('total')).toHaveTextContent('Total: Bs. 55');
  });

  it('should increment quantity when adding same item', async () => {
    const user = userEvent.setup();
    render(<ProductosMenuComponent />);

    // Add a plato
    await user.click(screen.getByText('Agregar Plato'));

    // Add same plato to cart twice
    const agregarButton = screen.getByText('Agregar al carrito');
    await user.click(agregarButton);
    await user.click(agregarButton);

    // Should show 1 item but x2 quantity
    expect(screen.getByText('Carrito (1 items)')).toBeInTheDocument();
    expect(screen.getByText(/x 2/)).toBeInTheDocument();
  });

  it('should delete products from menu', async () => {
    const user = userEvent.setup();
    render(<ProductosMenuComponent />);

    // Add products
    await user.click(screen.getByText('Agregar Plato'));
    await user.click(screen.getByText('Agregar Bebida'));

    expect(screen.getByText('Platos (1)')).toBeInTheDocument();
    expect(screen.getByText('Bebidas (1)')).toBeInTheDocument();

    // Delete plato first
    let eliminarButtons = screen.getAllByText('Eliminar');
    await user.click(eliminarButtons[0]); // Delete plato

    expect(screen.getByText('Platos (0)')).toBeInTheDocument();
    expect(screen.getByText('Bebidas (1)')).toBeInTheDocument();

    // Now delete bebida - need to re-query since DOM has changed
    eliminarButtons = screen.getAllByText('Eliminar');
    await user.click(eliminarButtons[0]); // Delete bebida (now the only button)

    expect(screen.getByText('Platos (0)')).toBeInTheDocument();
    expect(screen.getByText('Bebidas (0)')).toBeInTheDocument();
  });
});
