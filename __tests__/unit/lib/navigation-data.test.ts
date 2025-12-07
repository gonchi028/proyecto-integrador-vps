import { describe, it, expect } from 'vitest';
import { navigationData } from '@/lib/navigation-data';

describe('Navigation Data', () => {
  describe('restaurant info', () => {
    it('should have restaurant name', () => {
      expect(navigationData.restaurant.name).toBe('Terrasse');
    });

    it('should have restaurant image URL', () => {
      expect(navigationData.restaurant.imgUrl).toBeDefined();
      expect(navigationData.restaurant.imgUrl).toMatch(/^https?:\/\//);
    });
  });

  describe('navMain', () => {
    it('should have navigation items', () => {
      expect(navigationData.navMain).toBeDefined();
      expect(Array.isArray(navigationData.navMain)).toBe(true);
      expect(navigationData.navMain.length).toBeGreaterThan(0);
    });

    it('should have Productos section', () => {
      const productos = navigationData.navMain.find(item => item.title === 'Productos');
      expect(productos).toBeDefined();
      expect(productos?.isActive).toBe(true);
    });

    it('should have correct Productos subitems', () => {
      const productos = navigationData.navMain.find(item => item.title === 'Productos');
      const items = productos?.items;
      
      expect(items).toContainEqual({ title: 'Platos', url: '/dashboard/productos/platos' });
      expect(items).toContainEqual({ title: 'Bebidas', url: '/dashboard/productos/bebidas' });
      expect(items).toContainEqual({ title: 'Combos', url: '/dashboard/productos/combos' });
      expect(items).toContainEqual({ title: 'Proveedores', url: '/dashboard/productos/proveedores' });
    });

    it('should have Atencion section', () => {
      const atencion = navigationData.navMain.find(item => item.title === 'Atencion');
      expect(atencion).toBeDefined();
      expect(atencion?.isActive).toBe(true);
    });

    it('should have correct Atencion subitems', () => {
      const atencion = navigationData.navMain.find(item => item.title === 'Atencion');
      const items = atencion?.items;
      
      expect(items).toContainEqual({ title: 'Menu', url: '/dashboard/pedidos/menu' });
      expect(items).toContainEqual({ title: 'Pedidos', url: '/dashboard/pedidos/lista' });
      expect(items).toContainEqual({ title: 'Mesas', url: '/dashboard/pedidos/mesas' });
      expect(items).toContainEqual({ title: 'Reservas', url: '/dashboard/pedidos/reservas' });
    });

    it('should have Cocina section', () => {
      const cocina = navigationData.navMain.find(item => item.title === 'Cocina');
      expect(cocina).toBeDefined();
      expect(cocina?.isActive).toBe(true);
    });

    it('should have correct Cocina subitems', () => {
      const cocina = navigationData.navMain.find(item => item.title === 'Cocina');
      const items = cocina?.items;
      
      expect(items).toContainEqual({ title: 'Platos en cocina', url: '/dashboard/cocina/lista' });
    });

    it('should have Personas section', () => {
      const personas = navigationData.navMain.find(item => item.title === 'Personas');
      expect(personas).toBeDefined();
      expect(personas?.isActive).toBe(true);
    });

    it('should have correct Personas subitems', () => {
      const personas = navigationData.navMain.find(item => item.title === 'Personas');
      const items = personas?.items;
      
      expect(items).toContainEqual({ title: 'Usuarios', url: '/dashboard/personas/usuarios' });
      expect(items).toContainEqual({ title: 'Clientes', url: '/dashboard/personas/clientes' });
    });

    it('all navigation items should have icons', () => {
      navigationData.navMain.forEach(item => {
        expect(item.icon).toBeDefined();
      });
    });

    it('all URLs should start with /dashboard', () => {
      navigationData.navMain.forEach(section => {
        section.items.forEach(item => {
          expect(item.url).toMatch(/^\/dashboard\//);
        });
      });
    });
  });
});
