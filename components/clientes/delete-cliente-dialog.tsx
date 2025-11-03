'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Cliente, useClienteStore } from '@/store/cliente/cliente-store';
import { useLoadingStore } from '@/store';
import { deleteCliente } from '@/server/cliente-queries';
import { toast } from 'sonner';

interface Props {
  cliente: Cliente | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DeleteClienteDialog = ({ cliente, open, onOpenChange }: Props) => {
  const deleteClienteFromStore = useClienteStore(
    (state) => state.deleteClienteFromStore
  );
  const showLoading = useLoadingStore((state) => state.showLoading);
  const hideLoading = useLoadingStore((state) => state.hideLoading);

  const handleDelete = async () => {
    if (!cliente) return;
    
    showLoading('Eliminando cliente...');
    try {
      await deleteCliente(cliente.ci);
      deleteClienteFromStore(cliente.ci);
      toast.success('¡Operación exitosa!', {
        description: 'El cliente fue eliminado correctamente',
      });
      onOpenChange(false);
    } catch (error) {
      toast.error('Error', {
        description: 'No se pudo eliminar el cliente',
      });
    } finally {
      hideLoading();
    }
  };

  if (!cliente) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Se eliminará permanentemente el
            cliente <strong>{cliente.nombre}</strong> (CI: {cliente.ci}) del
            sistema.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700"
          >
            Eliminar cliente
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}; 
