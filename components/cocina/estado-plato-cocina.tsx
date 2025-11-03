'use client';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { PencilIcon } from 'lucide-react';
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog';
import { updateEstadoPlatoCocina, updateEstadoComboCocina } from '@/server/queries';

const formSchema = z.object({
  estado: z.enum(['pendiente', 'en preparacion', 'entregado']),
});

type Props = {
  idPedido: number;
  idProducto: number;
  tipo: 'producto' | 'combo';
};

export function EstadoPlatoCocina({ idPedido, idProducto, tipo }: Props) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const closeDialog = () => {
    setOpen(false);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      estado: 'pendiente',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    
    if (tipo === 'producto') {
      await updateEstadoPlatoCocina(idPedido, idProducto, values.estado);
    } else {
      await updateEstadoComboCocina(idPedido, idProducto, values.estado);
    }
    
    closeDialog();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <PencilIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <Form {...form}>
          <DialogTitle>Editar estado</DialogTitle>
          <DialogDescription>
            <span className="sr-only">Actualiza el estado del {tipo}</span>
          </DialogDescription>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="estado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a verified email to display" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pendiente">pendiente</SelectItem>
                      <SelectItem value="en preparacion">
                        en preparacion
                      </SelectItem>
                      <SelectItem value="entregado">entregado</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <span className="animate-pulse">Guardando...</span>
                ) : (
                  'Guardar'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
