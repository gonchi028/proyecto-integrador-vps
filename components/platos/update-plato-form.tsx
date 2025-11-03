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
import { updatePlato } from '@/server/product-queries';
import { usePlatosStore } from '@/store/platos/platos-store';
import { useState } from 'react';
import { toast } from 'sonner';

const formSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  descripcion: z
    .string()
    .min(2, 'La descripcion debe tener al menos 2 caracteres'),
  categoria: z.string().min(2, 'La categoria debe tener al menos 2 caracteres'),
  precio: z.coerce.number().positive('El precio debe ser un número positivo'),
  urlImagen: z.string().url('La url de la imagen no es válida'),
});

type Props = {
  closeDialog: () => void;
};

export const UpdatePlatoForm = ({ closeDialog }: Props) => {
  const [loading, setLoading] = useState(false);
  const platoToUpdate = usePlatosStore((state) => state.platoToUpdate);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: platoToUpdate?.nombre ?? '',
      descripcion: platoToUpdate?.descripcion ?? '',
      categoria: platoToUpdate?.categoria ?? '',
      precio: platoToUpdate?.precio ?? 0,
      urlImagen: platoToUpdate?.urlImagen ?? '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      await updatePlato(platoToUpdate?.id ?? 0, values);
      toast.success('Operacion exitosa!', {
        description: 'El plato se ha actualizado correctamente',
      });
      closeDialog();
    } catch (error) {
      toast.error('Error!', {
        description: 'No se pudo actualizar el plato',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <DialogHeader>
        <DialogTitle>Modificar plato</DialogTitle>
        <DialogDescription>
          Llena la informacion del plato que quieres modificar
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Nombre del plato" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="descripcion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripcion</FormLabel>
              <FormControl>
                <Input placeholder="Descripcion del plato" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="categoria"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoria</FormLabel>
              <FormControl>
                <Input placeholder="Categoria del plato" {...field} />
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
                  placeholder="Precio del plato"
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
                <Input placeholder="Url de la imagen del plato" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancelar</Button>
          </DialogClose>
          <Button type="submit" disabled={loading}>
            {loading ? 'Actualizando...' : 'Actualizar'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
