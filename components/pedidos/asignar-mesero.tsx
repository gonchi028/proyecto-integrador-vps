'use client';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger } from '@/components/ui/dialog';

import { HandPlatterIcon } from 'lucide-react';
import { useUsuariosStore, usePedidosStore } from '@/store';
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { asignarMesero } from '@/server/queries';
import { toast } from 'sonner';

type Props = {
  pedidoId: number;
  meseroId: string;
};

export function AsignarMeseroDialog({ pedidoId, meseroId }: Props) {
  const usuarios = useUsuariosStore((state) => state.usuarios);
  const updatePedidoInStore = usePedidosStore((state) => state.updatePedidoInStore);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [idAsignado, setIdAsignado] = useState('');

  const closeDialog = () => {
    setOpen(false);
  };

  const asignar = async (idMesero: string) => {
    setLoading(true);
    setIdAsignado(idMesero);
    
    try {
      await asignarMesero(idMesero, pedidoId);
      
      // Find the selected mesero to update the store
      const selectedMesero = usuarios.find(u => u.id === idMesero);
      if (selectedMesero) {
        updatePedidoInStore(pedidoId, {
          meseroId: idMesero,
          mesero: {
            id: selectedMesero.id,
            name: selectedMesero.name,
            userName: selectedMesero.userName,
            avatarUrl: selectedMesero.avatarUrl,
            email: selectedMesero.email,
            clienteCi: selectedMesero.clienteCi
          }
        });
      }
      
      toast.success(`${selectedMesero?.name} asignado correctamente`);
      closeDialog();
    } catch (error) {
      toast.error('Error al asignar mesero');
      console.error('Error assigning mesero:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <HandPlatterIcon />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-md"
        aria-describedby="Formulario de asignacion de mesero"
      >
        <DialogTitle>Asigna a tu mesero</DialogTitle>
        
        <DialogDescription>
          Selecciona un mesero para asignar a este pedido
        </DialogDescription>
        
        <div className="py-4 space-y-2">
          {usuarios.map((usuario) => (
            <button
              disabled={loading}
              onClick={() => asignar(usuario.id)}
              className={cn(
                usuario.id === meseroId && 'bg-emerald-100',
                'p-3 rounded-lg hover:bg-emerald-200 w-full'
              )}
              key={usuario.id}
            >
              <div className="flex min-w-0 gap-x-4 text-left">
                <Avatar className="size-12">
                  <AvatarImage src={usuario.avatarUrl} alt={usuario.name} />
                  <AvatarFallback>NA</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-auto">
                  <p className="text-sm/6 font-semibold text-gray-900">
                    <span className="">{usuario.name}</span>
                  </p>
                  <p className="mt-1 flex text-xs/5 text-gray-500">
                    <span className="truncate">{usuario.email}</span>{' '}
                  </p>
                </div>
                <div className="flex items-center">
                  {loading && idAsignado === usuario.id && (
                    <span className="text-gray-500 animate-pulse text-sm">
                      Asignando
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancelar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
