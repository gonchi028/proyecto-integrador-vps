'use client';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';

import { ArmchairIcon, RotateCwIcon } from 'lucide-react';
import { Pedido, useMesasStore, usePedidosStore } from '@/store';
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';
import { asignarMesa } from '@/server/queries';
import { toast } from 'sonner';

type Props = {
  pedido: Pedido;
  mesaId: number;
};

export function AsignarMesa({ pedido, mesaId }: Props) {
  const mesas = useMesasStore((state) => state.mesas);
  const updateMesaInStore = useMesasStore((state) => state.updateMesaInStore);
  const updatePedidoInStore = usePedidosStore((state) => state.updatePedidoInStore);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [idAsignado, setIdAsignado] = useState(0);

  const closeDialog = () => {
    setOpen(false);
  };

  const asignar = async (idMesa: number) => {
    setLoading(true);
    setIdAsignado(idMesa);
    
    try {
      await asignarMesa(idMesa, pedido.id, Number(pedido.mesaId));
      
      // Find the selected mesa to update the stores
      const selectedMesa = mesas.find(m => m.id === idMesa);
      const previousMesa = mesas.find(m => m.id === Number(pedido.mesaId));
      
      if (selectedMesa) {
        // Update pedido store
        updatePedidoInStore(pedido.id, {
          mesaId: idMesa,
          mesa: selectedMesa
        });
        
        // Update the new mesa to 'ocupada' in the mesas store
        updateMesaInStore({
          ...selectedMesa,
          estado: 'ocupada'
        });
      }
      
      // Update the previous mesa to 'libre' if it exists and is different
      if (previousMesa && previousMesa.id !== idMesa) {
        updateMesaInStore({
          ...previousMesa,
          estado: 'libre'
        });
      }
      
      toast.success(`Mesa ${selectedMesa?.numero} asignada correctamente`);
      closeDialog();
    } catch (error) {
      toast.error('Error al asignar mesa');
      console.error('Error assigning mesa:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <ArmchairIcon />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-lg"
        aria-describedby="Formulario de asignacion de mesero"
      >
        <DialogTitle>Asigna una mesa al pedido</DialogTitle>

        <DialogDescription>
          Selecciona una mesa disponible para asignar al pedido
        </DialogDescription>
        
        <div className="py-4">
          <ul
            role="list"
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6"
          >
            {mesas.map(({ id, numero, estado, capacidad }) => (
              <button
                key={id}
                className="bg-white disabled:bg-gray-200"
                disabled={
                  estado === 'ocupada' || estado === 'reservada' || loading
                }
                onClick={() => asignar(id)}
              >
                <li className="col-span-1 flex rounded-md shadow-sm text-left">
                  <div
                    className={cn(
                      'flex w-16 shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white',
                      estado === 'libre' && 'bg-green-600',
                      estado === 'ocupada' && 'bg-pink-600',
                      estado === 'reservada' && 'bg-sky-600'
                    )}
                  >
                    # {numero}
                  </div>
                  <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-b border-r border-t border-gray-200">
                    <div className="flex-1 truncate px-4 py-2 text-sm">
                      <a
                        href="#"
                        className="font-medium text-gray-900 hover:text-gray-600"
                      >
                        {estado}
                      </a>
                      <p className="text-gray-500">{capacidad} personas</p>
                    </div>
                    {idAsignado === id && loading && (
                      <span className="text-xs px-2 animate-spin">
                        <RotateCwIcon />
                      </span>
                    )}
                  </div>
                </li>
              </button>
            ))}
          </ul>
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
