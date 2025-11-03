'use client';

import { useState, useEffect } from 'react';
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
import { updateMesa } from '@/server/queries/mesas-queries';
import { useLoadingStore } from '@/store';
import { toast } from 'sonner';
import { Mesa } from '@/store/mesas/mesas-store';

const formSchema = z.object({
  numero: z.string().min(1, 'El número es requerido'),
  estado: z.enum(['libre', 'ocupada', 'reservada']),
  capacidad: z.string().min(1, 'La capacidad es requerida'),
});

type Props = {
  mesa: Mesa;
};

export const UpdateMesaForm = ({ mesa }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const updateMesaInStore = useMesasStore((state) => state.updateMesaInStore);
  const setOpenUpdateDialog = useMesasStore((state) => state.setOpenUpdateDialog);
  const showLoading = useLoadingStore((state) => state.showLoading);
  const hideLoading = useLoadingStore((state) => state.hideLoading);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numero: mesa.numero.toString(),
      estado: mesa.estado,
      capacidad: mesa.capacidad.toString(),
    },
  });

  useEffect(() => {
    form.reset({
      numero: mesa.numero.toString(),
      estado: mesa.estado,
      capacidad: mesa.capacidad.toString(),
    });
  }, [mesa, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      showLoading('Actualizando mesa...');
      const updatedMesa = await updateMesa(mesa.id, {
        numero: parseInt(values.numero),
        estado: values.estado,
        capacidad: parseInt(values.capacidad),
      });
      hideLoading();
      updateMesaInStore(updatedMesa);
      setOpenUpdateDialog(false);
      toast('Operacion exitosa!', {
        description: 'La mesa fue actualizada correctamente',
      });
    } catch (error) {
      hideLoading();
      toast('Error!', {
        description: 'No se pudo actualizar la mesa',
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
              <Select onValueChange={field.onChange} value={field.value}>
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
            onClick={() => setOpenUpdateDialog(false)}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Actualizando...' : 'Actualizar Mesa'}
          </Button>
        </div>
      </form>
    </Form>
  );
}; 
