'use client';
import { Dialog, DialogContent } from '@/components/ui/dialog';

import { UpdateClienteForm } from './update-cliente-form';
import { useClienteStore } from '@/store/cliente/cliente-store';

export function UpdateClienteDialog() {
  const open = useClienteStore((state) => state.openUpdateDialog);
  const setOpen = useClienteStore((state) => state.setOpenUpdateDialog);

  const closeDialog = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <UpdateClienteForm closeDialog={closeDialog} />
      </DialogContent>
    </Dialog>
  );
}
