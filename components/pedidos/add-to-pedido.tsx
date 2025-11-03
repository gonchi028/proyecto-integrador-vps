'use client';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { PlusIcon } from 'lucide-react';
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type ClassValue } from 'clsx';

const formSchema = z.object({
  cantidad: z.coerce
    .number()
    .int('La cantidad debe ser entera.')
    .positive('La cantidad debe ser un número positivo'),
});

type Props = {
  lista: {
    cantidad: number;
    id: number;
  }[];
  setLista: (lista: { cantidad: number; id: number }[]) => void;
  id: number;
};

export function AddToPedido({ lista, setLista, id }: Props) {
  const [open, setOpen] = useState(false);

  const closeDialog = () => {
    setLista([
      ...lista.filter((item) => item.id !== id),
      { id, cantidad: form.getValues().cantidad },
    ]);
    setOpen(false);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cantidad: 1,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    closeDialog();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <PlusIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <Form {...form}>
          <DialogTitle>Agregar</DialogTitle>
          <DialogDescription>
            <span className="sr-only">Especifica la cantidad</span>
          </DialogDescription>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="cantidad"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cantidad</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Cantidad de producto"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" onClick={closeDialog} variant="outline">
                Cancelar
              </Button>
              <Button type="submit" onClick={() => {}}>
                Agregar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
