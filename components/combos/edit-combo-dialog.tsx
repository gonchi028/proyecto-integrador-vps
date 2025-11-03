'use client';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

import { PencilIcon } from 'lucide-react';
import { Combo } from '@/store';
import { EditComboForm } from './edit-combo-form';

type Props = {
  combo: Combo;
};

export function EditComboDialog({ combo }: Props) {
  const [open, setOpen] = useState(false);

  const closeDialog = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <PencilIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <EditComboForm closeDialog={closeDialog} combo={combo} />
      </DialogContent>
    </Dialog>
  );
}
