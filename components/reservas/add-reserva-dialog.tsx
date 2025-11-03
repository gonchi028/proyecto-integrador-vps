'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { AddReservaForm } from './add-reserva-form';
import { useReservasStore } from '@/store/reservas/reservas-store';

export const AddReservaDialog = () => {
  const open = useReservasStore((state) => state.openAddDialog);
  const setOpen = useReservasStore((state) => state.setOpenAddDialog);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Reserva
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agregar Reserva</DialogTitle>
          <DialogDescription>
            Completa los datos para crear una nueva reserva.
          </DialogDescription>
        </DialogHeader>
        <AddReservaForm />
      </DialogContent>
    </Dialog>
  );
}; 
