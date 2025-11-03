'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { UpdateMesaForm } from './update-mesa-form';
import { useMesasStore } from '@/store/mesas/mesas-store';

export const UpdateMesaDialog = () => {
  const open = useMesasStore((state) => state.openUpdateDialog);
  const setOpen = useMesasStore((state) => state.setOpenUpdateDialog);
  const mesaToUpdate = useMesasStore((state) => state.mesaToUpdate);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Mesa</DialogTitle>
          <DialogDescription>
            Modifica los datos de la mesa seleccionada.
          </DialogDescription>
        </DialogHeader>
        {mesaToUpdate && <UpdateMesaForm mesa={mesaToUpdate} />}
      </DialogContent>
    </Dialog>
  );
}; 
