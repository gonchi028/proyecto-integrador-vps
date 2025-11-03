'use client';

import { useState } from 'react';
import { Calendar, ChefHat, TrendingUp, Package, Eye, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { toast } from 'sonner';
import { deleteMenu } from '@/server/queries/menu-queries';
import { useMenuStore } from '@/store/menu/menu-store';
import { AddProductsToMenuDialog } from './add-products-to-menu-dialog';
import { MenuDetailsDialog } from './menu-details-dialog';
import { EditMenuDialog } from './edit-menu-dialog';
import type { Menu } from '@/store/menu/menu-store';

interface MenusGridProps {
  searchTerm: string;
}

export const MenusGrid = ({ searchTerm }: MenusGridProps) => {
  const { menus, deleteMenu: deleteMenuFromStore } = useMenuStore();
  const [loadingMenuId, setLoadingMenuId] = useState<number | null>(null);

  // Filter menus based on search term
  const filteredMenus = menus.filter((menu) =>
    menu.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    menu.fecha.includes(searchTerm) ||
    menu.estado.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteMenu = async (menuId: number) => {
    setLoadingMenuId(menuId);
    try {
      await deleteMenu(menuId);
      deleteMenuFromStore(menuId);
      toast.success('Menú eliminado exitosamente');
    } catch (error) {
      console.error('Error deleting menu:', error);
      toast.error('Error al eliminar menú');
    } finally {
      setLoadingMenuId(null);
    }
  };

  const getEstadoBadgeVariant = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'activo':
        return 'default';
      case 'publicado':
        return 'default';
      case 'inactivo':
        return 'secondary';
      case 'borrador':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const calculateSalesProgress = (menu: Menu) => {
    const totalPreparada = menu.productos.reduce((sum, p) => sum + p.cantidadPreparada, 0);
    const totalVendida = menu.productos.reduce((sum, p) => sum + p.cantidadVendida, 0);
    return totalPreparada > 0 ? (totalVendida / totalPreparada) * 100 : 0;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-BO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredMenus.map((menu) => {
        const totalPreparada = menu.productos.reduce((sum, p) => sum + p.cantidadPreparada, 0);
        const totalVendida = menu.productos.reduce((sum, p) => sum + p.cantidadVendida, 0);
        const salesProgress = calculateSalesProgress(menu);

        return (
          <Card key={menu.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative bg-gradient-to-br from-orange-50 to-orange-100 p-6">
              <div className="absolute top-2 right-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <MenuDetailsDialog 
                        menu={menu}
                        trigger={
                          <div className="flex items-center w-full">
                            <Eye className="mr-2 h-4 w-4" />
                            Ver Detalles
                          </div>
                        }
                      />
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <EditMenuDialog 
                        menu={menu}
                        trigger={
                          <div className="flex items-center w-full">
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </div>
                        }
                      />
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDeleteMenu(menu.id)}
                      disabled={loadingMenuId === menu.id}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {loadingMenuId === menu.id ? 'Eliminando...' : 'Eliminar'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="absolute top-2 left-2">
                <Badge variant={getEstadoBadgeVariant(menu.estado)}>
                  {menu.estado}
                </Badge>
              </div>

              <div className="flex flex-col items-center mt-8">
                <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mb-3">
                  <ChefHat className="h-8 w-8 text-white" />
                </div>
                <div className="flex items-center gap-2 text-center">
                  <Calendar className="h-4 w-4 text-orange-600" />
                  <span className="font-medium text-sm">
                    {formatDate(menu.fecha)}
                  </span>
                </div>
              </div>
            </div>

            <CardContent className="p-4">
              <div className="space-y-4">
                {/* Description */}
                <div>
                  <h3 className="font-semibold text-lg mb-2">{menu.descripcion}</h3>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Productos</span>
                    </div>
                    <span className="text-xl font-bold">{menu.productos.length}</span>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Preparadas</span>
                    </div>
                    <span className="text-xl font-bold">{totalPreparada}</span>
                  </div>
                </div>

                {/* Sales Progress */}
                {totalPreparada > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Vendidas: {totalVendida}</span>
                      <span>{Math.round(salesProgress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-orange-600 h-2 rounded-full transition-all" 
                        style={{ width: `${Math.min(salesProgress, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Products Preview */}
                {menu.productos.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Productos del menú:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {menu.productos.slice(0, 3).map((producto) => (
                        <Badge key={producto.id} variant="secondary" className="text-xs">
                          {producto.nombre}
                        </Badge>
                      ))}
                      {menu.productos.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{menu.productos.length - 3} más
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-3 border-t">
                  <AddProductsToMenuDialog 
                    menu={menu}
                    trigger={
                      <Button variant="outline" size="sm" className="flex-1">
                        <Package className="h-4 w-4 mr-1" />
                        Gestionar
                      </Button>
                    }
                  />
                  <MenuDetailsDialog 
                    menu={menu}
                    trigger={
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-4 w-4 mr-1" />
                        Ver
                      </Button>
                    }
                  />
                </div>

                {/* Menu ID */}
                <div className="flex justify-center pt-2">
                  <Badge variant="outline" className="text-xs">
                    ID: {menu.id}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
      
      {filteredMenus.length === 0 && (
        <div className="col-span-full text-center py-8 text-muted-foreground">
          No se encontraron menús
        </div>
      )}
    </div>
  );
}; 
