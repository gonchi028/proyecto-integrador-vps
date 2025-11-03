import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
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
import { useState } from 'react';
import { toast } from 'sonner';
import { addCliente } from '@/server/cliente-queries';
import { useClienteStore } from '@/store/cliente/cliente-store';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  // Required fields
  ci: z.string().min(6, 'El CI debe tener al menos 6 caracteres'),
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  
  // Optional contact fields
  celular: z.string().optional().nullable(),
  direccion: z.string().optional().nullable(),
  notasEntrega: z.string().optional().nullable(),
  
  // Optional business fields
  razonSocial: z.string().optional().nullable(),
  nit: z.string().optional().nullable(),
});

type Props = {
  closeDialog: () => void;
};

export const AddClienteForm = ({ closeDialog }: Props) => {
  const [loading, setLoading] = useState(false);
  const addClienteToStore = useClienteStore((state) => state.addClienteToStore);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ci: '',
      nombre: '',
      celular: '',
      direccion: '',
      notasEntrega: '',
      razonSocial: '',
      nit: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      // Ensure all optional fields are properly typed
      const clienteData = {
        ci: values.ci,
        nombre: values.nombre,
        celular: values.celular || null,
        direccion: values.direccion || null,
        notasEntrega: values.notasEntrega || null,
        razonSocial: values.razonSocial || null,
        nit: values.nit || null,
      };
      
      const cliente = await addCliente(clienteData);
      addClienteToStore(cliente[0]);
      toast.success('¡Operación exitosa!', {
        description: 'El cliente ha sido registrado correctamente',
      });
      closeDialog();
    } catch (error) {
      toast.error('Error', {
        description: 'No se pudo registrar el cliente',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <DialogHeader>
        <DialogTitle>Registrar cliente</DialogTitle>
        <DialogDescription>
          Completa la información del cliente que deseas registrar
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Personal Information Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <h4 className="font-medium text-sm">Información Personal</h4>
            <span className="text-red-500 text-xs">* Campos obligatorios</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="ci"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CI *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Número de identificación" 
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Documento de identidad del cliente
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre completo *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre y apellidos" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="celular"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Celular</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Número de celular"
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormDescription>
                  Número de contacto del cliente
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        {/* Delivery Information Section */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Información de Entrega</h4>
          
          <FormField
            control={form.control}
            name="direccion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dirección</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Dirección completa para entregas"
                    {...field}
                    value={field.value ?? ''}
                    rows={2}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="notasEntrega"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notas de entrega</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Referencias adicionales, instrucciones especiales..."
                    {...field}
                    value={field.value ?? ''}
                    rows={2}
                  />
                </FormControl>
                <FormDescription>
                  Información adicional para facilitar la entrega
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        {/* Business Information Section */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Información Empresarial (Opcional)</h4>
          <p className="text-xs text-muted-foreground">
            Completa solo si el cliente requiere factura empresarial
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="razonSocial"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Razón social</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nombre de la empresa"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="nit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NIT</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Número de identificación tributaria"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormDescription>
                    Identificación fiscal de la empresa
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary" disabled={loading}>
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit" disabled={loading}>
            {loading ? 'Registrando...' : 'Registrar cliente'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

function addClienteToStore(arg0: {
  ci: string;
  nombre: string;
  celular: string | null;
  direccion: string | null;
  notasEntrega: string | null;
  razonSocial: string | null;
  nit: string | null;
  puntos: number | null;
}) {
  throw new Error('Function not implemented.');
}

function useClientesStore(arg0: (state: any) => any) {
  throw new Error('Function not implemented.');
}
