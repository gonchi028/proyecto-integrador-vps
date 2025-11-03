'use client';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { AddClienteForm } from './add-cliente-form';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

import { PlusIcon } from '@radix-ui/react-icons';

export const AddClienteDialog = () => {
  const [open, setOpen] = useState(false);

  const closeDialog = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          Registrar Cliente
          <PlusIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <AddClienteForm closeDialog={closeDialog} />
      </DialogContent>
    </Dialog>
  );
};
