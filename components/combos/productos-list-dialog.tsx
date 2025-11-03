'use client';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';

import { InfoIcon } from 'lucide-react';
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog';
import { Producto } from '@/store';

type Props = {
  productos: Producto[];
};

export function ProductosListDialog({ productos }: Props) {
  const [open, setOpen] = useState(false);

  const closeDialog = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <InfoIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogTitle>Productos del combo</DialogTitle>
        <DialogDescription>
          <span className="sr-only">Lista de productos del combo</span>
        </DialogDescription>
        <ul
          role="list"
          className="divide-y divide-gray-100 overflow-hidden bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl"
        >
          {productos.map((p) => (
            <li
              key={p.id}
              className="relative flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6"
            >
              <div className="flex min-w-0 gap-x-4">
                <img
                  className="size-12 flex-none rounded-full bg-gray-50"
                  src={p.urlImagen}
                  alt=""
                />
                <div className="min-w-0 flex-auto">
                  <p className="text-sm/6 font-semibold text-gray-900">
                    <a href="#">
                      <span className="absolute inset-x-0 -top-px bottom-0"></span>
                      {p.nombre}
                    </a>
                  </p>
                  <p className="mt-1 flex text-xs/5 text-gray-500">
                    <a
                      href="mailto:leslie.alexander@example.com"
                      className="relative truncate hover:underline"
                    >
                      {p.categoria}
                    </a>
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-x-4">
                <div className="hidden sm:flex sm:flex-col sm:items-end">
                  <p className="text-sm/6 text-gray-900">{p.precio} Bs.</p>
                  <p className="mt-1 text-xs/5 text-gray-500">{p.tipo}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <DialogFooter>
          <Button variant="outline" onClick={closeDialog}>
            OK
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
