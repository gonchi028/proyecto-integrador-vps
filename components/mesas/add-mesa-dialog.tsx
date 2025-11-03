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
import { AddMesaForm } from './add-mesa-form';
import { useMesasStore } from '@/store/mesas/mesas-store';

export const AddMesaDialog = () => {
  const open = useMesasStore((state) => state.openAddDialog);
  const setOpen = useMesasStore((state) => state.setOpenAddDialog);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Mesa
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agregar Mesa</DialogTitle>
          <DialogDescription>
            Completa los datos para agregar una nueva mesa al restaurante.
          </DialogDescription>
        </DialogHeader>
        <AddMesaForm />
      </DialogContent>
    </Dialog>
  );
}; 
