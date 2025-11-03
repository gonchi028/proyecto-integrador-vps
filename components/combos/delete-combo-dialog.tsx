'use client';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Trash2Icon } from 'lucide-react';
import {
  DialogClose,
  DialogDescription,
  DialogTitle,
} from '@radix-ui/react-dialog';
import { toast } from 'sonner';
import { deleteCombo } from '@/server/queries';

type Props = {
  comboId: number;
};

export function DeleteComboDialog({ comboId }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const closeDialog = () => {
    setOpen(false);
  };

  const eliminarCombo = async () => {
    setLoading(true);
    try {
      await deleteCombo(comboId);
      toast.success('Combo eliminado correctamente');
      closeDialog();
    } catch (error) {
      setLoading(false);
      toast.error('Error al eliminar el combo');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="border-red-200">
          <Trash2Icon className="text-red-600" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogTitle>Borrar Combo</DialogTitle>
        <DialogDescription>
          Estas seguro que deseas eliminar el combo?
        </DialogDescription>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={closeDialog}>
              Cancelar
            </Button>
          </DialogClose>
          <Button
            disabled={loading}
            type="button"
            variant="destructive"
            onClick={eliminarCombo}
          >
            {loading ? (
              <span className="animate-pulse">Eliminando...</span>
            ) : (
              'Eliminar'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
