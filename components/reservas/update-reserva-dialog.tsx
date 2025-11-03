'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { UpdateReservaForm } from './update-reserva-form';
import { useReservasStore } from '@/store/reservas/reservas-store';

export const UpdateReservaDialog = () => {
  const open = useReservasStore((state) => state.openUpdateDialog);
  const setOpen = useReservasStore((state) => state.setOpenUpdateDialog);
  const reservaToUpdate = useReservasStore((state) => state.reservaToUpdate);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Reserva</DialogTitle>
          <DialogDescription>
            Modifica los datos de la reserva seleccionada.
          </DialogDescription>
        </DialogHeader>
        {reservaToUpdate && <UpdateReservaForm reserva={reservaToUpdate} />}
      </DialogContent>
    </Dialog>
  );
}; 
