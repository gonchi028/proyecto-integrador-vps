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
import { createReserva } from '@/server/queries/reservas-queries';
import { useLoadingStore } from '@/store';
import { toast } from 'sonner';
import { getClientes } from '@/server/cliente-queries';

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

export const AddReservaForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const addReservaToStore = useReservasStore((state) => state.addReservaToStore);
  const setOpenAddDialog = useReservasStore((state) => state.setOpenAddDialog);
  const showLoading = useLoadingStore((state) => state.showLoading);
  const hideLoading = useLoadingStore((state) => state.hideLoading);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clienteCi: '',
      fechaHora: '',
      mesa: '',
      cantidadPersonas: '',
      estado: 'pendiente',
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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      showLoading('Creando reserva...');
      const newReserva = await createReserva({
        clienteCi: values.clienteCi,
        fechaHora: new Date(values.fechaHora),
        mesa: parseInt(values.mesa),
        cantidadPersonas: parseInt(values.cantidadPersonas),
        estado: values.estado,
      });
      hideLoading();
      addReservaToStore(newReserva);
      setOpenAddDialog(false);
      form.reset();
      toast('Operacion exitosa!', {
        description: 'La reserva fue creada correctamente',
      });
    } catch (error) {
      hideLoading();
      toast('Error!', {
        description: 'No se pudo crear la reserva',
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
            onClick={() => setOpenAddDialog(false)}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creando...' : 'Crear Reserva'}
          </Button>
        </div>
      </form>
    </Form>
  );
}; 
