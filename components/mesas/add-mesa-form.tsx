'use client';

import { useState } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMesasStore } from '@/store/mesas/mesas-store';
import { createMesa } from '@/server/queries/mesas-queries';
import { useLoadingStore } from '@/store';
import { toast } from 'sonner';

const formSchema = z.object({
  numero: z.string().min(1, 'El número es requerido'),
  estado: z.enum(['libre', 'ocupada', 'reservada']),
  capacidad: z.string().min(1, 'La capacidad es requerida'),
});

export const AddMesaForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addMesaToStore = useMesasStore((state) => state.addMesaToStore);
  const setOpenAddDialog = useMesasStore((state) => state.setOpenAddDialog);
  const showLoading = useLoadingStore((state) => state.showLoading);
  const hideLoading = useLoadingStore((state) => state.hideLoading);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numero: '',
      estado: 'libre',
      capacidad: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      showLoading('Creando mesa...');
      const newMesa = await createMesa({
        numero: parseInt(values.numero),
        estado: values.estado,
        capacidad: parseInt(values.capacidad),
      });
      hideLoading();
      addMesaToStore(newMesa);
      setOpenAddDialog(false);
      form.reset();
      toast('Operacion exitosa!', {
        description: 'La mesa fue creada correctamente',
      });
    } catch (error) {
      hideLoading();
      toast('Error!', {
        description: 'No se pudo crear la mesa',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="numero"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número de Mesa</FormLabel>
              <FormControl>
                <Input placeholder="1" {...field} />
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
                  <SelectItem value="libre">Libre</SelectItem>
                  <SelectItem value="ocupada">Ocupada</SelectItem>
                  <SelectItem value="reservada">Reservada</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="capacidad"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Capacidad</FormLabel>
              <FormControl>
                <Input placeholder="4" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpenAddDialog(false)}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creando...' : 'Crear Mesa'}
          </Button>
        </div>
      </form>
    </Form>
  );
}; 
