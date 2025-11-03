'use client';

import { useState } from 'react';
import { Edit } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { EditMenuForm } from './edit-menu-form';
import type { Menu } from '@/store/menu/menu-store';

interface EditMenuDialogProps {
  menu: Menu;
  trigger?: React.ReactNode;
}

export function EditMenuDialog({ menu, trigger }: EditMenuDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Menú</DialogTitle>
          <DialogDescription>
            Modifica la información del menú
          </DialogDescription>
        </DialogHeader>
        <EditMenuForm menu={menu} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
} 
