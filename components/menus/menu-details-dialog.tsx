'use client';

import { useState } from 'react';
import { Eye, Calendar, ChefHat, Package, TrendingUp, TrendingDown } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { Menu } from '@/store/menu/menu-store';

interface MenuDetailsDialogProps {
  menu: Menu;
  trigger?: React.ReactNode;
}

export function MenuDetailsDialog({ menu, trigger }: MenuDetailsDialogProps) {
  const [open, setOpen] = useState(false);

  const totalPreparada = menu.productos.reduce((sum, p) => sum + p.cantidadPreparada, 0);
  const totalVendida = menu.productos.reduce((sum, p) => sum + p.cantidadVendida, 0);
  const salesProgress = totalPreparada > 0 ? (totalVendida / totalPreparada) * 100 : 0;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-BO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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

  const getProductPerformance = (preparada: number, vendida: number) => {
    if (preparada === 0) return { percentage: 0, status: 'neutral' };
    const percentage = (vendida / preparada) * 100;
    if (percentage >= 90) return { percentage, status: 'excellent' };
    if (percentage >= 70) return { percentage, status: 'good' };
    if (percentage >= 50) return { percentage, status: 'average' };
    return { percentage, status: 'poor' };
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Ver Detalles
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ChefHat className="h-5 w-5 text-orange-600" />
            Detalles del Menú
          </DialogTitle>
          <DialogDescription>
            Información completa del menú y rendimiento de productos
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Menu Header Info */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-orange-900 mb-2">
                  {menu.descripcion}
                </h2>
                <div className="flex items-center gap-2 text-orange-700">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">{formatDate(menu.fecha)}</span>
                </div>
              </div>
              <Badge variant={getEstadoBadgeVariant(menu.estado)} className="text-sm">
                {menu.estado}
              </Badge>
            </div>

            {/* Overall Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-white/70 rounded-lg">
                <Package className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                <p className="text-2xl font-bold text-orange-900">{menu.productos.length}</p>
                <p className="text-sm text-orange-700">Productos</p>
              </div>
              <div className="text-center p-4 bg-white/70 rounded-lg">
                <TrendingUp className="h-6 w-6 mx-auto mb-2 text-green-600" />
                <p className="text-2xl font-bold text-green-900">{totalPreparada}</p>
                <p className="text-sm text-green-700">Preparadas</p>
              </div>
              <div className="text-center p-4 bg-white/70 rounded-lg">
                <TrendingDown className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                <p className="text-2xl font-bold text-blue-900">{totalVendida}</p>
                <p className="text-sm text-blue-700">Vendidas</p>
              </div>
              <div className="text-center p-4 bg-white/70 rounded-lg">
                <div className="w-6 h-6 mx-auto mb-2 rounded-full bg-purple-600 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">%</span>
                </div>
                <p className="text-2xl font-bold text-purple-900">{Math.round(salesProgress)}%</p>
                <p className="text-sm text-purple-700">Rendimiento</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Products List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Productos del Menú</h3>
            
            {menu.productos.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                <p>No hay productos asignados a este menú</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {menu.productos.map((producto) => {
                  const performance = getProductPerformance(producto.cantidadPreparada, producto.cantidadVendida);
                  
                  return (
                    <div key={producto.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                      <div className="flex items-start gap-3">
                        <img
                          src={producto.urlImagen}
                          alt={producto.nombre}
                          className="w-16 h-16 rounded-lg object-cover border"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium truncate">{producto.nombre}</h4>
                            <Badge variant={producto.tipo === 'plato' ? 'default' : 'secondary'}>
                              {producto.tipo === 'plato' ? '🍽️' : '☕'}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-2">
                            {producto.categoria} - {producto.precio.toLocaleString('es-BO', {
                              style: 'currency',
                              currency: 'BOB',
                            })}
                          </p>

                          {/* Quantity Stats */}
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Preparadas: {producto.cantidadPreparada}</span>
                              <span>Vendidas: {producto.cantidadVendida}</span>
                            </div>
                            
                            {/* Performance Bar */}
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full transition-all ${
                                  performance.status === 'excellent' ? 'bg-green-500' :
                                  performance.status === 'good' ? 'bg-blue-500' :
                                  performance.status === 'average' ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${Math.min(performance.percentage, 100)}%` }}
                              />
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-muted-foreground">
                                {Math.round(performance.percentage)}% vendido
                              </span>
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${
                                  performance.status === 'excellent' ? 'text-green-700 border-green-300' :
                                  performance.status === 'good' ? 'text-blue-700 border-blue-300' :
                                  performance.status === 'average' ? 'text-yellow-700 border-yellow-300' : 'text-red-700 border-red-300'
                                }`}
                              >
                                {performance.status === 'excellent' ? 'Excelente' :
                                 performance.status === 'good' ? 'Bueno' :
                                 performance.status === 'average' ? 'Regular' : 'Bajo'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end pt-4 border-t">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cerrar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 
