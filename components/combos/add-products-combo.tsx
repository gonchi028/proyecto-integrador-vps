'use client';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';

import { PlusIcon } from '@radix-ui/react-icons';
import { useBebidasStore, usePlatosStore } from '@/store';
import {
  DialogClose,
  DialogDescription,
  DialogTitle,
} from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';

type Props = {
  productoIds: number[];
  setProductoIds: (ids: number[]) => void;
};

export function AddProductsCombo({ productoIds, setProductoIds }: Props) {
  const platos = usePlatosStore((state) => state.platos);
  const bebidas = useBebidasStore((state) => state.bebidas);
  const [open, setOpen] = useState(false);

  const closeDialog = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Agregar productos
          <PlusIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogTitle>Agregar productos</DialogTitle>
        <DialogDescription>
          Selecciona los productos que deseas agregar al combo
        </DialogDescription>
        <div className="grid gap-4">
          <h4 className="text-sm font-semibold">Platos</h4>
          {platos.map((plato) => (
            <button
              key={plato.id}
              onClick={() => {
                if (productoIds.includes(plato.id)) {
                  setProductoIds(productoIds.filter((id) => id !== plato.id));
                } else {
                  setProductoIds([...productoIds, plato.id]);
                }
              }}
              className={cn(
                'border rounded-lg p-2 flex gap-x-4',
                productoIds.includes(plato.id) ? 'bg-sky-100' : 'bg-primary-500'
              )}
            >
              <img
                className="size-12 flex-none rounded-full bg-gray-50"
                src={plato.urlImagen}
                alt={plato.nombre}
              />
              <div className="text-start">
                <p className="text-sm/6 font-semibold text-gray-900">
                  {plato.nombre}
                </p>
                <p className="mt-1 truncate text-xs/5 text-gray-500">
                  {plato.precio} Bs.
                </p>
              </div>
            </button>
          ))}
          <h4 className="text-sm font-semibold">Bebidas</h4>
          {bebidas.map((bebida) => (
            <button
              key={bebida.id}
              onClick={() => {
                if (productoIds.includes(bebida.id)) {
                  setProductoIds(productoIds.filter((id) => id !== bebida.id));
                } else {
                  setProductoIds([...productoIds, bebida.id]);
                }
              }}
              className={cn(
                'border rounded-lg p-2 flex gap-x-4',
                productoIds.includes(bebida.id)
                  ? 'bg-sky-100'
                  : 'bg-primary-500'
              )}
            >
              <img
                className="size-12 flex-none rounded-full bg-gray-50"
                src={bebida.urlImagen}
                alt={bebida.nombre}
              />
              <div className="text-start">
                <p className="text-sm/6 font-semibold text-gray-900">
                  {bebida.nombre}
                </p>
                <p className="mt-1 truncate text-xs/5 text-gray-500">
                  {bebida.precio} Bs.
                </p>
              </div>
            </button>
          ))}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" size="sm">
              OK
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
