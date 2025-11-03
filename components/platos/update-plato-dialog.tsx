'use client';
import { Dialog, DialogContent } from '@/components/ui/dialog';

import { usePlatosStore } from '@/store/platos/platos-store';
import { UpdatePlatoForm } from './update-plato-form';

export function UpdatePlatoDialog() {
  const open = usePlatosStore((state) => state.openUpdateDialog);
  const setOpen = usePlatosStore((state) => state.setOpenUpdateDialog);

  const closeDialog = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <UpdatePlatoForm closeDialog={closeDialog} />
      </DialogContent>
    </Dialog>
  );
}
