import { create } from 'zustand';

export type MenuProducto = {
  id: number;
  nombre: string;
  descripcion: string;
  cantidad: number | null;
  categoria: string;
  precio: number;
  tipo: 'plato' | 'bebida';
  urlImagen: string;
  cantidadPreparada: number;
  cantidadVendida: number;
};

export type Menu = {
  id: number;
  descripcion: string;
  fecha: string;
  estado: string;
  productos: MenuProducto[];
};

type MenuStore = {
  menus: Menu[];
  setMenus: (menus: Menu[]) => void;
  addMenu: (menu: Menu) => void;
  updateMenu: (menu: Menu) => void;
  deleteMenu: (id: number) => void;
};

export const useMenuStore = create<MenuStore>((set) => ({
  menus: [],
  setMenus: (menus) => set({ menus }),
  addMenu: (menu) =>
    set((state) => ({
      menus: [...state.menus, menu],
    })),
  updateMenu: (updatedMenu) =>
    set((state) => ({
      menus: state.menus.map((menu) =>
        menu.id === updatedMenu.id ? updatedMenu : menu
      ),
    })),
  deleteMenu: (id) =>
    set((state) => ({
      menus: state.menus.filter((menu) => menu.id !== id),
    })),
})); 
