'use client';
import { Dialog, DialogContent } from '@/components/ui/dialog';

import { UpdateBebidaForm } from './update-bebida-form';
import { useBebidasStore } from '@/store/bebida/bebida-store';

export function UpdateBebidaDialog() {
  const open = useBebidasStore((state) => state.openUpdateDialog);
  const setOpen = useBebidasStore((state) => state.setOpenUpdateDialog);

  const closeDialog = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <UpdateBebidaForm closeDialog={closeDialog} />
      </DialogContent>
    </Dialog>
  );
}
