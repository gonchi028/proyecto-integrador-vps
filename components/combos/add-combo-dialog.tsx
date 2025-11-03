'use client';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { AddComboForm } from './add-combo-form';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

import { PlusIcon } from '@radix-ui/react-icons';

export function AddComboDialog() {
  const [open, setOpen] = useState(false);

  const closeDialog = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          Agregar Combo
          <PlusIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <AddComboForm closeDialog={closeDialog} />
      </DialogContent>
    </Dialog>
  );
}
