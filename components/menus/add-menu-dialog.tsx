'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AddMenuForm } from './add-menu-form';

interface AddMenuDialogProps {
  trigger?: React.ReactNode;
}

export function AddMenuDialog({ trigger }: AddMenuDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Menú
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Menú</DialogTitle>
          <DialogDescription>
            Crea un nuevo menú para una fecha específica
          </DialogDescription>
        </DialogHeader>
        <AddMenuForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
} 
