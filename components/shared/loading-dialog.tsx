'use client';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogDescription,
} from '@/components/ui/alert-dialog';
import { useLoadingStore } from '@/store';
import { AlertDialogTitle } from '@radix-ui/react-alert-dialog';
import { LoaderCircleIcon } from 'lucide-react';

export const LoadingDialog = () => {
  const open = useLoadingStore((state) => state.loading);
  const message = useLoadingStore((state) => state.message);

  return (
    <>
      <AlertDialog open={open}>
        <AlertDialogContent className="max-w-xs">
          <AlertDialogHeader>
            <AlertDialogTitle className="sr-only">
              Dialogo de carga
            </AlertDialogTitle>
            <AlertDialogDescription className="flex justify-center flex-col items-center gap-4 py-2">
              <LoaderCircleIcon className="animate-spin h-10 w-10" />
              <span className="animate-pulse">{message}</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
