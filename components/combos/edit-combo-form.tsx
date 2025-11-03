import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { DialogFooter, DialogHeader } from '@/components/ui/dialog';
import {
  DialogClose,
  DialogDescription,
  DialogTitle,
} from '@radix-ui/react-dialog';
import { addCombo, updateCombo } from '@/server/queries';
import { useState } from 'react';
import { toast } from 'sonner';
import { AddProductsCombo } from './add-products-combo';
import { Combo, useBebidasStore, usePlatosStore } from '@/store';

const formSchema = z.object({
  estado: z.string().min(2, 'El estado debe tener al menos 2 caracteres'),
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  precio: z.coerce.number().positive('El precio debe ser un número positivo'),
  urlImagen: z.string().url('La url de la imagen no es válida'),
});

type Props = {
  closeDialog: () => void;
  combo: Combo;
};

export const EditComboForm = ({ closeDialog, combo }: Props) => {
  const platosMap = usePlatosStore((state) => state.platosMap);
  const bebidasMap = useBebidasStore((state) => state.bebidasMap);
  const [productoIds, setProductoIds] = useState<number[]>(
    combo.productos.map((producto) => producto.id)
  );
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      estado: combo.estado,
      nombre: combo.nombre,
      precio: combo.precio,
      urlImagen: combo.urlImagen ?? '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      await updateCombo({
        id: combo.id,
        ...values,
        productoIds,
      });
      toast.success('Operacion exitosa!', {
        description: 'El combo se ha editado correctamente',
      });
      closeDialog();
    } catch (error) {
      setLoading(false);
      toast.error('Error al agregar combo');
    }
  };

  return (
    <Form {...form}>
      <DialogHeader>
        <DialogTitle>Editar Combo</DialogTitle>
        <DialogDescription>
          Llena la informacion del combo que deseas editar
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="estado"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado</FormLabel>
              <FormControl>
                <Input placeholder="Estado del combo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Nombre del combo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="precio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Precio</FormLabel>
              <FormControl>
                <Input
                  placeholder="Precio del combo"
                  {...field}
                  type="number"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="urlImagen"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Url imagen</FormLabel>
              <FormControl>
                <Input placeholder="Url de la imagen del combo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <AddProductsCombo
          productoIds={productoIds}
          setProductoIds={setProductoIds}
        />
        <ul role="list" className="divide-y divide-gray-100">
          {productoIds.map((id) => {
            const producto = platosMap.get(id) || bebidasMap.get(id);

            if (!producto) return;

            return (
              <li key={id} className="flex gap-x-4 py-3">
                <img
                  className="size-12 flex-none rounded-full bg-gray-50"
                  src={producto.urlImagen}
                  alt={producto.nombre}
                />
                <div className="min-w-0">
                  <p className="text-sm/6 font-semibold text-gray-900">
                    {producto.nombre}
                  </p>
                  <p className="mt-1 truncate text-xs/5 text-gray-500">
                    {producto.precio} Bs.
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancelar</Button>
          </DialogClose>
          <Button type="submit" disabled={loading}>
            {loading ? 'Editando...' : 'Editar combo'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
