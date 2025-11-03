'use client';

import { useState } from 'react';
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
import { addMenu } from '@/server/queries/menu-queries';
import { useMenuStore } from '@/store/menu/menu-store';

const formSchema = z.object({
  descripcion: z.string().min(1, 'La descripción es requerida'),
  fecha: z.string().min(1, 'La fecha es requerida'),
  estado: z.string().min(1, 'El estado es requerido'),
});

type FormData = z.infer<typeof formSchema>;

interface AddMenuFormProps {
  onSuccess?: () => void;
}

export function AddMenuForm({ onSuccess }: AddMenuFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const addMenuToStore = useMenuStore((state) => state.addMenu);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      descripcion: '',
      fecha: new Date().toISOString().split('T')[0],
      estado: 'activo',
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const newMenu = await addMenu(data);
      addMenuToStore({
        ...newMenu,
        productos: [],
      });
      
      toast.success('Menú creado exitosamente');
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error('Error creating menu:', error);
      toast.error('Error al crear menú');
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
          {isLoading ? 'Creando...' : 'Crear Menú'}
        </Button>
      </form>
    </Form>
  );
} 
