import { create } from 'zustand';

export type Producto = {
  id: number;
  nombre: string;
  descripcion: string;
  cantidad: number | null;
  categoria: string;
  precio: number;
  tipo: 'plato' | 'bebida';
  urlImagen: string;
};

export type Proveedor = {
  id: number;
  nombre: string;
  celular: string | null;
  telefono: string | null;
  correo: string | null;
  direccion: string | null;
  productos: Producto[];
};

type ProveedorStore = {
  proveedores: Proveedor[];
  setProveedores: (proveedores: Proveedor[]) => void;
  addProveedor: (proveedor: Proveedor) => void;
  updateProveedor: (proveedor: Proveedor) => void;
  deleteProveedor: (id: number) => void;
};

export const useProveedorStore = create<ProveedorStore>((set) => ({
  proveedores: [],
  setProveedores: (proveedores) => set({ proveedores }),
  addProveedor: (proveedor) =>
    set((state) => ({
      proveedores: [...state.proveedores, proveedor],
    })),
  updateProveedor: (updatedProveedor) =>
    set((state) => ({
      proveedores: state.proveedores.map((proveedor) =>
        proveedor.id === updatedProveedor.id ? updatedProveedor : proveedor
      ),
    })),
  deleteProveedor: (id) =>
    set((state) => ({
      proveedores: state.proveedores.filter((proveedor) => proveedor.id !== id),
    })),
})); 
