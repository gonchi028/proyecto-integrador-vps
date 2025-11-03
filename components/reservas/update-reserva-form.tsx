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
import { useReservasStore } from '@/store/reservas/reservas-store';
import { updateReserva } from '@/server/queries/reservas-queries';
import { useLoadingStore } from '@/store';
import { toast } from 'sonner';
import { Reserva } from '@/store/reservas/reservas-store';
import { getClientes } from '@/server/cliente-queries';
import { format } from 'date-fns';

const formSchema = z.object({
  clienteCi: z.string().min(1, 'El cliente es requerido'),
  fechaHora: z.string().min(1, 'La fecha y hora es requerida'),
  mesa: z.string().min(1, 'La mesa es requerida'),
  cantidadPersonas: z.string().min(1, 'La cantidad de personas es requerida'),
  estado: z.enum(['pendiente', 'confirmada', 'cancelada', 'utilizada', 'no asistio']),
});

type Cliente = {
  ci: string;
  nombre: string;
  celular: string | null;
  puntos: number | null;
  direccion: string | null;
  notasEntrega: string | null;
  razonSocial: string | null;
  nit: string | null;
};

type Props = {
  reserva: Reserva;
};

export const UpdateReservaForm = ({ reserva }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const updateReservaInStore = useReservasStore((state) => state.updateReservaInStore);
  const setOpenUpdateDialog = useReservasStore((state) => state.setOpenUpdateDialog);
  const showLoading = useLoadingStore((state) => state.showLoading);
  const hideLoading = useLoadingStore((state) => state.hideLoading);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clienteCi: reserva.clienteCi,
      fechaHora: format(new Date(reserva.fechaHora), "yyyy-MM-dd'T'HH:mm"),
      mesa: reserva.mesa.toString(),
      cantidadPersonas: reserva.cantidadPersonas.toString(),
      estado: reserva.estado,
    },
  });

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const clientesData = await getClientes();
        setClientes(clientesData);
      } catch (error) {
        console.error('Error fetching clientes:', error);
      }
    };
    fetchClientes();
  }, []);

  useEffect(() => {
    form.reset({
      clienteCi: reserva.clienteCi,
      fechaHora: format(new Date(reserva.fechaHora), "yyyy-MM-dd'T'HH:mm"),
      mesa: reserva.mesa.toString(),
      cantidadPersonas: reserva.cantidadPersonas.toString(),
      estado: reserva.estado,
    });
  }, [reserva, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      showLoading('Actualizando reserva...');
      const updatedReserva = await updateReserva(reserva.id, {
        clienteCi: values.clienteCi,
        fechaHora: new Date(values.fechaHora),
        mesa: parseInt(values.mesa),
        cantidadPersonas: parseInt(values.cantidadPersonas),
        estado: values.estado,
      });
      hideLoading();
      updateReservaInStore(updatedReserva);
      setOpenUpdateDialog(false);
      toast('Operacion exitosa!', {
        description: 'La reserva fue actualizada correctamente',
      });
    } catch (error) {
      hideLoading();
      toast('Error!', {
        description: 'No se pudo actualizar la reserva',
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
          name="clienteCi"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cliente</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un cliente" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {clientes.map((cliente) => (
                    <SelectItem key={cliente.ci} value={cliente.ci}>
                      {cliente.nombre} - {cliente.ci}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fechaHora"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha y Hora</FormLabel>
              <FormControl>
                <Input 
                  type="datetime-local" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="mesa"
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
          name="cantidadPersonas"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cantidad de Personas</FormLabel>
              <FormControl>
                <Input placeholder="4" {...field} />
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
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="confirmada">Confirmada</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                  <SelectItem value="utilizada">Utilizada</SelectItem>
                  <SelectItem value="no asistio">No Asistió</SelectItem>
                </SelectContent>
              </Select>
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
            {isSubmitting ? 'Actualizando...' : 'Actualizar Reserva'}
          </Button>
        </div>
      </form>
    </Form>
  );
}; 
