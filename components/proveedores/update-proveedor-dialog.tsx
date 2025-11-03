'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { UpdateProveedorForm } from './update-proveedor-form';
import { type Proveedor } from '@/store/proveedor/proveedor-store';

interface UpdateProveedorDialogProps {
  proveedor: Proveedor;
}

export const UpdateProveedorDialog = ({ proveedor }: UpdateProveedorDialogProps) => {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Proveedor</DialogTitle>
        </DialogHeader>
        <UpdateProveedorForm proveedor={proveedor} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}; 
