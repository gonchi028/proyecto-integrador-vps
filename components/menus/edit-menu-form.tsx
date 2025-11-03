'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { toast } from 'sonner';
import { updateMenu } from '@/server/queries/menu-queries';
import { useMenuStore } from '@/store/menu/menu-store';
import type { Menu } from '@/store/menu/menu-store';

const formSchema = z.object({
  descripcion: z.string().min(1, 'La descripción es requerida'),
  fecha: z.string().min(1, 'La fecha es requerida'),
  estado: z.string().min(1, 'El estado es requerido'),
});

type FormData = z.infer<typeof formSchema>;

interface EditMenuFormProps {
  menu: Menu;
  onSuccess?: () => void;
}

export function EditMenuForm({ menu, onSuccess }: EditMenuFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const updateMenuInStore = useMenuStore((state) => state.updateMenu);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      descripcion: menu.descripcion,
      fecha: menu.fecha,
      estado: menu.estado,
    },
  });

  // Reset form when menu changes
  useEffect(() => {
    form.reset({
      descripcion: menu.descripcion,
      fecha: menu.fecha,
      estado: menu.estado,
    });
  }, [menu, form]);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      await updateMenu(menu.id, data);
      
      // Update the store
      updateMenuInStore({
        ...menu,
        ...data,
      });
      
      toast.success('Menú actualizado exitosamente');
      onSuccess?.();
    } catch (error) {
      console.error('Error updating menu:', error);
      toast.error('Error al actualizar menú');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="descripcion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descripción del menú..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fecha"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="estado"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un estado" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                  <SelectItem value="borrador">Borrador</SelectItem>
                  <SelectItem value="publicado">Publicado</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? 'Actualizando...' : 'Actualizar Menú'}
        </Button>
      </form>
    </Form>
  );
} 
