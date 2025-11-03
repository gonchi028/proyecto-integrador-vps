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
import { addPlato } from '@/server/product-queries';
import { useState } from 'react';
import { toast } from 'sonner';
import { Cliente } from '@/store/cliente/cliente-store';
import { getCliente } from '@/server/cliente-queries';
import { SearchIcon } from 'lucide-react';
import { addPedido } from '@/server/queries';

const formSchema = z.object({
  clienteCi: z.string().min(1, 'La cedula del cliente no puede estar vacia'),
});

type Props = {
  closeDialog: () => void;
};

export const AddPedidoForm = ({ closeDialog }: Props) => {
  const [loading, setLoading] = useState(false);
  const [loadingCliente, setLoadingCliente] = useState(false);
  const [cliente, setCliente] = useState<Cliente | undefined>(undefined);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clienteCi: '',
    },
  });

  const searchCliente = async () => {
    const ci = form.getValues('clienteCi');
    setLoadingCliente(true);
    const cliente = await getCliente(ci);
    console.log(ci, cliente);
    setCliente(cliente);
    setLoadingCliente(false);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const ci = values.clienteCi;

    // Validate that client exists before creating pedido
    if (!cliente) {
      toast.error('Error!', {
        description: 'Debes buscar y verificar que el cliente exista antes de crear el pedido.',
      });
      return;
    }

    setLoading(true);
    try {
      const result = await addPedido({ tipo: 'mesa', clienteCi: ci });
      
      toast.success('Operación exitosa!', {
        description: `El pedido se ha creado correctamente para ${cliente.nombre}`,
      });
      closeDialog();
    } catch (error) {
      console.error('Error creating pedido:', error);
      toast.error('Error!', {
        description: 'No se pudo crear el pedido. Verifica que el CI del cliente sea válido.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <DialogHeader>
        <DialogTitle>Agregar pedido</DialogTitle>
        <DialogDescription>
          Introduce el CI del cliente para crear un pedido
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="clienteCi"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CI Cliente</FormLabel>
              <FormControl>
                <div className="flex gap-2">
                  <Input placeholder="CI Cliente" {...field} />
                  <Button
                    onClick={searchCliente}
                    type="button"
                    variant="outline"
                    size="icon"
                  >
                    <SearchIcon className="size-6" />
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {loadingCliente && (
          <div className="flex items-center gap-x-2">
            <svg
              className="animate-spin size-1.5 text-sky-500"
              viewBox="0 0 24 24"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className="opacity-25"
              />
              <path
                fill="currentColor"
                d="M12 2.5A9.5 9.5 0 002.5 12h3a6.5 6.5 0 016.5-6.5V2.5z"
              />
            </svg>
            <p className="text-sm/6 text-gray-500">Buscando cliente...</p>
          </div>
        )}
        {cliente !== undefined && !loadingCliente && (
          <div className="min-w-0">
            <div className="flex items-start gap-x-3">
              <p className="text-sm/6 font-semibold text-gray-900">
                {cliente.nombre}
              </p>
              {!!cliente.celular && (
                <p className="mt-0.5 whitespace-nowrap rounded-md bg-sky-50 px-1.5 py-0.5 text-xs font-medium text-sky-700 ring-1 ring-inset ring-sky-600/20">
                  {cliente.celular}
                </p>
              )}
            </div>
            <div className="mt-1 flex items-center gap-x-2 text-xs/5 text-gray-500">
              <p className="whitespace-nowrap">NIT: {cliente.nit ?? 'NA'}</p>
              <svg viewBox="0 0 2 2" className="size-0.5 fill-current">
                <circle cx="1" cy="1" r="1" />
              </svg>
              <p className="truncate">
                Razón Social: {cliente.razonSocial ?? 'NA'}
              </p>
            </div>
          </div>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancelar</Button>
          </DialogClose>
          <Button type="submit" disabled={loading}>
            {loading ? 'Agregando...' : 'Agregar pedido'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
