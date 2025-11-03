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
import { MoreHorizontal, Edit, Trash2, Copy } from 'lucide-react';
import { Producto, usePlatosStore } from '@/store/platos/platos-store';
import { deletePlato } from '@/server/product-queries';
import { useLoadingStore } from '@/store';
import { toast } from 'sonner';
import { useProductos } from '@/hooks';

interface PlatosGridProps {
  searchTerm: string;
}

export const PlatosGrid = ({ searchTerm }: PlatosGridProps) => {
  useProductos();
  
  const platosStore = usePlatosStore((state) => state.platos);
  const setPlatoToUpdate = usePlatosStore((state) => state.setPlatoToUpdate);
  const setOpenUpdateDialog = usePlatosStore((state) => state.setOpenUpdateDialog);
  const deletePlatoFromStore = usePlatosStore((state) => state.deletePLatoFromStore);
  const showLoading = useLoadingStore((state) => state.showLoading);
  const hideLoading = useLoadingStore((state) => state.hideLoading);

  // Filter platos based on search term
  const filteredPlatos = platosStore.filter((plato) =>
    plato.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plato.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plato.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const borrarPlato = async (id: number) => {
    showLoading('Eliminando plato...');
    try {
      await deletePlato(id);
      deletePlatoFromStore(id);
      toast('Operacion exitosa!', {
        description: 'El plato fue eliminado correctamente',
      });
    } catch (error) {
      toast('Error!', {
        description: 'No se pudo eliminar el plato',
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredPlatos.map((plato) => (
        <Card key={plato.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="relative">
            <img
              src={plato.urlImagen}
              alt={plato.nombre}
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
                    onClick={() => navigator.clipboard.writeText(plato.id.toString())}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copiar ID
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      setPlatoToUpdate(plato);
                      setOpenUpdateDialog(true);
                    }}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => borrarPlato(plato.id)}>
                    <Trash2 className="mr-2 h-4 w-4 text-red-600" />
                    <span className="text-red-600">Eliminar</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg line-clamp-1">{plato.nombre}</CardTitle>
            <Badge variant="secondary" className="mt-2 w-fit">{plato.categoria}</Badge>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3 h-10">
              {plato.descripcion}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-primary">
                {formatPrice(plato.precio)}
              </span>
              <Badge variant="outline">
                ID: {plato.id}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
      {filteredPlatos.length === 0 && (
        <div className="col-span-full text-center py-8 text-muted-foreground">
          No se encontraron platos
        </div>
      )}
    </div>
  );
}; 
