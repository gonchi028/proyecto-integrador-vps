'use client';

import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Edit, Trash2, Copy, Eye } from 'lucide-react';
import { Combo, useCombosStore } from '@/store/combo/combo-store';
import { deleteCombo } from '@/server/queries/combos-queries';
import { useLoadingStore } from '@/store';
import { toast } from 'sonner';
import { useCombos } from '@/hooks';
import { ComboProductsDialog } from './combo-products-dialog';

interface CombosGridProps {
  searchTerm: string;
}

export const CombosGrid = ({ searchTerm }: CombosGridProps) => {
  useCombos();
  
  const combosStore = useCombosStore((state) => state.combos);
  const showLoading = useLoadingStore((state) => state.showLoading);
  const hideLoading = useLoadingStore((state) => state.hideLoading);

  // Filter combos based on search term
  const filteredCombos = combosStore.filter((combo) =>
    combo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    combo.estado.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const borrarCombo = async (id: number) => {
    showLoading('Eliminando combo...');
    try {
      await deleteCombo(id);
      // Reload to update the store
      window.location.reload();
      toast('Operacion exitosa!', {
        description: 'El combo fue eliminado correctamente',
      });
    } catch (error) {
      toast('Error!', {
        description: 'No se pudo eliminar el combo',
      });
    } finally {
      hideLoading();
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB',
    }).format(price);
  };

  const getEstadoColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'activo':
        return 'bg-green-600';
      case 'inactivo':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

// Removed handleViewProducts function - now handled by ComboProductsDialog directly

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCombos.map((combo) => (
          <Card key={combo.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img
                src={combo.urlImagen || '/placeholder-combo.png'}
                alt={combo.nombre}
                className="w-full h-48 object-contain"
              />
              <div className="absolute top-2 right-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="sm" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => navigator.clipboard.writeText(combo.id.toString())}
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copiar ID
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <ComboProductsDialog combo={combo} />
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => borrarCombo(combo.id)}>
                      <Trash2 className="mr-2 h-4 w-4 text-red-600" />
                      <span className="text-red-600">Eliminar</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="absolute top-2 left-2">
                <Badge className={getEstadoColor(combo.estado)}>
                  {combo.estado}
                </Badge>
              </div>
            </div>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg line-clamp-1">{combo.nombre}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {combo.productos.length} productos
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-primary">
                  {formatPrice(combo.precio)}
                </span>
                <Badge variant="outline">
                  ID: {combo.id}
                </Badge>
              </div>
              <div className="mt-3">
                <p className="text-sm text-muted-foreground">
                  Productos incluidos:
                </p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {combo.productos.slice(0, 3).map((producto) => (
                    <Badge key={producto.id} variant="secondary" className="text-xs">
                      {producto.nombre}
                    </Badge>
                  ))}
                  {combo.productos.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{combo.productos.length - 3} más
                    </Badge>
                  )}
                </div>
              </div>
              <div className="mt-4 pt-3 border-t">
                <ComboProductsDialog combo={combo} variant="card" />
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredCombos.length === 0 && (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            No se encontraron combos
          </div>
        )}
      </div>

      {/* Products dialog is now handled individually by each combo card */}
    </>
  );
}; 
