'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';
import { Combo } from '@/store/combo/combo-store';

type Props = {
  combo: Combo;
  variant?: 'default' | 'card';
};

export function ComboProductsDialog({ combo, variant = 'default' }: Props) {
  const [open, setOpen] = useState(false);

  const closeDialog = () => {
    setOpen(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB',
    }).format(price);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {variant === 'card' ? (
          <Button variant="outline" size="sm" className="w-full">
            <Eye className="mr-2 h-4 w-4" />
            Ver productos ({combo.productos.length})
          </Button>
        ) : (
          <Button variant="ghost" size="sm" className="h-8 w-full justify-start">
            <Eye className="mr-2 h-4 w-4" />
            Ver productos ({combo.productos.length})
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Productos del combo: {combo.nombre}</DialogTitle>
        </DialogHeader>
        <div className="max-h-96 overflow-y-auto">
          <ul className="divide-y divide-gray-100 overflow-hidden bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
            {combo.productos.map((producto) => (
              <li
                key={producto.id}
                className="relative flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6"
              >
                <div className="flex min-w-0 gap-x-4">
                  <img
                    className="size-12 flex-none rounded-full bg-gray-50 object-cover"
                    src={producto.urlImagen}
                    alt={producto.nombre}
                  />
                  <div className="min-w-0 flex-auto">
                    <p className="text-sm/6 font-semibold text-gray-900">
                      {producto.nombre}
                    </p>
                    <p className="mt-1 flex text-xs/5 text-gray-500">
                      <Badge variant="secondary" className="text-xs">
                        {producto.categoria}
                      </Badge>
                    </p>
                    <p className="mt-1 text-xs/5 text-gray-500 line-clamp-2">
                      {producto.descripcion}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-x-4">
                  <div className="hidden sm:flex sm:flex-col sm:items-end">
                    <p className="text-sm/6 text-gray-900 font-semibold">
                      {formatPrice(producto.precio)}
                    </p>
                    <Badge variant="outline" className="text-xs mt-1">
                      {producto.tipo}
                    </Badge>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={closeDialog}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 
