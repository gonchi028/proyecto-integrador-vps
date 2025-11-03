'use client';

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useProveedorStore, type Proveedor } from '@/store/proveedor/proveedor-store';
import { deleteProveedor } from '@/server/queries/proveedores-queries';

interface DeleteProveedorDialogProps {
  proveedor: Proveedor;
}

export const DeleteProveedorDialog = ({ proveedor }: DeleteProveedorDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteProveedor: deleteProveedorFromStore } = useProveedorStore();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteProveedor(proveedor.id);
      deleteProveedorFromStore(proveedor.id);
      toast.success('Proveedor eliminado exitosamente');
    } catch (error) {
      console.error('Error deleting proveedor:', error);
      toast.error('Error al eliminar proveedor');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Se eliminará permanentemente el proveedor
            <strong> {proveedor.nombre}</strong> del sistema.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? 'Eliminando...' : 'Eliminar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}; 
