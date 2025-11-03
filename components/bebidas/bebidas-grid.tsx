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
import { Producto } from '@/store/platos/platos-store';
import { useBebidasStore } from '@/store/bebida/bebida-store';
import { deleteBebida } from '@/server/product-queries';
import { useLoadingStore } from '@/store';
import { toast } from 'sonner';
import { useProductos } from '@/hooks';

interface BebidasGridProps {
  searchTerm: string;
}

export const BebidasGrid = ({ searchTerm }: BebidasGridProps) => {
  useProductos();
  
  const bebidasStore = useBebidasStore((state) => state.bebidas);
  const setBebidaToUpdate = useBebidasStore((state) => state.setBebidaToUpdate);
  const setOpenUpdateDialog = useBebidasStore((state) => state.setOpenUpdateDialog);
  const deleteBebidaFromStore = useBebidasStore((state) => state.deleteBebidaFromStore);
  const showLoading = useLoadingStore((state) => state.showLoading);
  const hideLoading = useLoadingStore((state) => state.hideLoading);

  // Filter bebidas based on search term
  const filteredBebidas = bebidasStore.filter((bebida) =>
    bebida.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bebida.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bebida.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const borrarBebida = async (id: number) => {
    showLoading('Eliminando bebida...');
    try {
      await deleteBebida(id);
      deleteBebidaFromStore(id);
      toast('Operacion exitosa!', {
        description: 'La bebida fue eliminada correctamente',
      });
    } catch (error) {
      toast('Error!', {
        description: 'No se pudo eliminar la bebida',
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
      {filteredBebidas.map((bebida) => (
        <Card key={bebida.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="relative">
            <img
              src={bebida.urlImagen}
              alt={bebida.nombre}
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
                    onClick={() => navigator.clipboard.writeText(bebida.id.toString())}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copiar ID
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      setBebidaToUpdate(bebida);
                      setOpenUpdateDialog(true);
                    }}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => borrarBebida(bebida.id)}>
                    <Trash2 className="mr-2 h-4 w-4 text-red-600" />
                    <span className="text-red-600">Eliminar</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg line-clamp-1">{bebida.nombre}</CardTitle>
            <Badge variant="secondary" className="mt-2 w-fit">{bebida.categoria}</Badge>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3 h-10">
              {bebida.descripcion}
            </p>
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-bold text-primary">
                {formatPrice(bebida.precio)}
              </span>
              <Badge variant="outline">
                ID: {bebida.id}
              </Badge>
            </div>
            {bebida.cantidad !== null && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Cantidad:</span>
                <Badge variant={bebida.cantidad > 0 ? "default" : "destructive"}>
                  {bebida.cantidad}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
      {filteredBebidas.length === 0 && (
        <div className="col-span-full text-center py-8 text-muted-foreground">
          No se encontraron bebidas
        </div>
      )}
    </div>
  );
}; 
