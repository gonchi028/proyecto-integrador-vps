import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Form validation schema (similar to the one used in add-cliente-form)
const clienteSchema = z.object({
  ci: z.string().min(6, 'El CI debe tener al menos 6 caracteres'),
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  celular: z.string().optional().nullable(),
  direccion: z.string().optional().nullable(),
  notasEntrega: z.string().optional().nullable(),
  razonSocial: z.string().optional().nullable(),
  nit: z.string().optional().nullable(),
});

type ClienteFormData = z.infer<typeof clienteSchema>;

// Test form component
const TestClienteForm = ({ onSubmit }: { onSubmit: (data: ClienteFormData) => void }) => {
  const form = useForm<ClienteFormData>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      ci: '',
      nombre: '',
      celular: '',
      direccion: '',
      notasEntrega: '',
      razonSocial: '',
      nit: '',
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data);
  });

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="ci">CI *</label>
        <input
          id="ci"
          {...form.register('ci')}
          data-testid="input-ci"
        />
        {form.formState.errors.ci && (
          <span data-testid="error-ci">{form.formState.errors.ci.message}</span>
        )}
      </div>

      <div>
        <label htmlFor="nombre">Nombre *</label>
        <input
          id="nombre"
          {...form.register('nombre')}
          data-testid="input-nombre"
        />
        {form.formState.errors.nombre && (
          <span data-testid="error-nombre">{form.formState.errors.nombre.message}</span>
        )}
      </div>

      <div>
        <label htmlFor="celular">Celular</label>
        <input
          id="celular"
          {...form.register('celular')}
          data-testid="input-celular"
        />
      </div>

      <div>
        <label htmlFor="direccion">Dirección</label>
        <input
          id="direccion"
          {...form.register('direccion')}
          data-testid="input-direccion"
        />
      </div>

      <div>
        <label htmlFor="razonSocial">Razón Social</label>
        <input
          id="razonSocial"
          {...form.register('razonSocial')}
          data-testid="input-razon-social"
        />
      </div>

      <div>
        <label htmlFor="nit">NIT</label>
        <input
          id="nit"
          {...form.register('nit')}
          data-testid="input-nit"
        />
      </div>

      <button type="submit" data-testid="btn-submit">
        Guardar Cliente
      </button>
    </form>
  );
};

describe('E2E: Cliente Form Validation', () => {
  it('should show validation errors for empty required fields', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    
    render(<TestClienteForm onSubmit={onSubmit} />);

    // Submit empty form
    await user.click(screen.getByTestId('btn-submit'));

    // Should show validation errors
    expect(await screen.findByTestId('error-ci')).toHaveTextContent('El CI debe tener al menos 6 caracteres');
    expect(await screen.findByTestId('error-nombre')).toHaveTextContent('El nombre debe tener al menos 2 caracteres');

    // Should not call onSubmit
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('should show validation error for short CI', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    
    render(<TestClienteForm onSubmit={onSubmit} />);

    // Fill with short CI
    await user.type(screen.getByTestId('input-ci'), '123');
    await user.type(screen.getByTestId('input-nombre'), 'Juan Pérez');
    await user.click(screen.getByTestId('btn-submit'));

    // Should show CI error
    expect(await screen.findByTestId('error-ci')).toHaveTextContent('El CI debe tener al menos 6 caracteres');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('should show validation error for short name', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    
    render(<TestClienteForm onSubmit={onSubmit} />);

    // Fill with short name
    await user.type(screen.getByTestId('input-ci'), '12345678');
    await user.type(screen.getByTestId('input-nombre'), 'J');
    await user.click(screen.getByTestId('btn-submit'));

    // Should show name error
    expect(await screen.findByTestId('error-nombre')).toHaveTextContent('El nombre debe tener al menos 2 caracteres');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('should submit form with valid data', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    
    render(<TestClienteForm onSubmit={onSubmit} />);

    // Fill valid data
    await user.type(screen.getByTestId('input-ci'), '12345678');
    await user.type(screen.getByTestId('input-nombre'), 'Juan Pérez');
    await user.type(screen.getByTestId('input-celular'), '70012345');
    await user.type(screen.getByTestId('input-direccion'), 'Calle 1 #123');
    await user.click(screen.getByTestId('btn-submit'));

    // Should call onSubmit with form data
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        ci: '12345678',
        nombre: 'Juan Pérez',
        celular: '70012345',
        direccion: 'Calle 1 #123',
      })
    );
  });

  it('should submit form with only required fields', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    
    render(<TestClienteForm onSubmit={onSubmit} />);

    // Fill only required data
    await user.type(screen.getByTestId('input-ci'), '12345678');
    await user.type(screen.getByTestId('input-nombre'), 'Juan Pérez');
    await user.click(screen.getByTestId('btn-submit'));

    // Should call onSubmit
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        ci: '12345678',
        nombre: 'Juan Pérez',
      })
    );
  });

  it('should submit form with all fields filled', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    
    render(<TestClienteForm onSubmit={onSubmit} />);

    // Fill all data
    await user.type(screen.getByTestId('input-ci'), '12345678');
    await user.type(screen.getByTestId('input-nombre'), 'Juan Pérez García');
    await user.type(screen.getByTestId('input-celular'), '70012345');
    await user.type(screen.getByTestId('input-direccion'), 'Calle Principal #456');
    await user.type(screen.getByTestId('input-razon-social'), 'Empresa ABC SRL');
    await user.type(screen.getByTestId('input-nit'), '1234567890');
    await user.click(screen.getByTestId('btn-submit'));

    // Should call onSubmit with all data
    expect(onSubmit).toHaveBeenCalledWith({
      ci: '12345678',
      nombre: 'Juan Pérez García',
      celular: '70012345',
      direccion: 'Calle Principal #456',
      notasEntrega: '',
      razonSocial: 'Empresa ABC SRL',
      nit: '1234567890',
    });
  });

  it('should clear errors when user starts typing', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    
    render(<TestClienteForm onSubmit={onSubmit} />);

    // Submit empty form to show errors
    await user.click(screen.getByTestId('btn-submit'));
    expect(await screen.findByTestId('error-ci')).toBeInTheDocument();

    // Start typing
    await user.type(screen.getByTestId('input-ci'), '12345678');
    await user.click(screen.getByTestId('btn-submit'));

    // CI error should be gone
    expect(screen.queryByTestId('error-ci')).not.toBeInTheDocument();
  });
});

// Producto form schema
const productoSchema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  descripcion: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  precio: z.number().min(0.01, 'El precio debe ser mayor a 0'),
  cantidad: z.number().min(0, 'La cantidad no puede ser negativa'),
  categoria: z.string().min(1, 'Debe seleccionar una categoría'),
});

type ProductoFormData = z.infer<typeof productoSchema>;

const TestProductoForm = ({ onSubmit }: { onSubmit: (data: ProductoFormData) => void }) => {
  const form = useForm<ProductoFormData>({
    resolver: zodResolver(productoSchema),
    defaultValues: {
      nombre: '',
      descripcion: '',
      precio: 0,
      cantidad: 0,
      categoria: '',
    },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div>
        <input
          placeholder="Nombre"
          {...form.register('nombre')}
          data-testid="input-nombre"
        />
        {form.formState.errors.nombre && (
          <span data-testid="error-nombre">{form.formState.errors.nombre.message}</span>
        )}
      </div>

      <div>
        <textarea
          placeholder="Descripción"
          {...form.register('descripcion')}
          data-testid="input-descripcion"
        />
        {form.formState.errors.descripcion && (
          <span data-testid="error-descripcion">{form.formState.errors.descripcion.message}</span>
        )}
      </div>

      <div>
        <input
          type="number"
          placeholder="Precio"
          {...form.register('precio', { valueAsNumber: true })}
          data-testid="input-precio"
        />
        {form.formState.errors.precio && (
          <span data-testid="error-precio">{form.formState.errors.precio.message}</span>
        )}
      </div>

      <div>
        <input
          type="number"
          placeholder="Cantidad"
          {...form.register('cantidad', { valueAsNumber: true })}
          data-testid="input-cantidad"
        />
        {form.formState.errors.cantidad && (
          <span data-testid="error-cantidad">{form.formState.errors.cantidad.message}</span>
        )}
      </div>

      <div>
        <select {...form.register('categoria')} data-testid="select-categoria">
          <option value="">Seleccionar categoría</option>
          <option value="pizzas">Pizzas</option>
          <option value="pastas">Pastas</option>
          <option value="ensaladas">Ensaladas</option>
          <option value="bebidas">Bebidas</option>
        </select>
        {form.formState.errors.categoria && (
          <span data-testid="error-categoria">{form.formState.errors.categoria.message}</span>
        )}
      </div>

      <button type="submit" data-testid="btn-submit">
        Guardar Producto
      </button>
    </form>
  );
};

describe('E2E: Producto Form Validation', () => {
  it('should show all validation errors for empty form', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    
    render(<TestProductoForm onSubmit={onSubmit} />);

    await user.click(screen.getByTestId('btn-submit'));

    expect(await screen.findByTestId('error-nombre')).toHaveTextContent('El nombre debe tener al menos 3 caracteres');
    expect(await screen.findByTestId('error-descripcion')).toHaveTextContent('La descripción debe tener al menos 10 caracteres');
    expect(await screen.findByTestId('error-categoria')).toHaveTextContent('Debe seleccionar una categoría');
    
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('should validate precio is greater than 0', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    
    render(<TestProductoForm onSubmit={onSubmit} />);

    await user.type(screen.getByTestId('input-nombre'), 'Pizza');
    await user.type(screen.getByTestId('input-descripcion'), 'Una deliciosa pizza');
    await user.clear(screen.getByTestId('input-precio'));
    await user.type(screen.getByTestId('input-precio'), '0');
    await user.selectOptions(screen.getByTestId('select-categoria'), 'pizzas');
    await user.click(screen.getByTestId('btn-submit'));

    expect(await screen.findByTestId('error-precio')).toHaveTextContent('El precio debe ser mayor a 0');
  });

  it('should submit valid producto form', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    
    render(<TestProductoForm onSubmit={onSubmit} />);

    await user.type(screen.getByTestId('input-nombre'), 'Pizza Margherita');
    await user.type(screen.getByTestId('input-descripcion'), 'Deliciosa pizza con tomate y mozzarella fresca');
    await user.clear(screen.getByTestId('input-precio'));
    await user.type(screen.getByTestId('input-precio'), '45');
    await user.clear(screen.getByTestId('input-cantidad'));
    await user.type(screen.getByTestId('input-cantidad'), '10');
    await user.selectOptions(screen.getByTestId('select-categoria'), 'pizzas');
    await user.click(screen.getByTestId('btn-submit'));

    expect(onSubmit).toHaveBeenCalled();
    expect(onSubmit.mock.calls[0][0]).toEqual({
      nombre: 'Pizza Margherita',
      descripcion: 'Deliciosa pizza con tomate y mozzarella fresca',
      precio: 45,
      cantidad: 10,
      categoria: 'pizzas',
    });
  });
});
