'use client';

import { Button } from '@/components/ui';
import { signOut } from '@/app/(autenticacion)/login/actions';

export const LogOutButton = () => {
  const cerrarSesion = async () => {
    await signOut();
  };

  return (
    <>
      <Button variant="destructive" size="sm" onClick={cerrarSesion}>
        Log out
      </Button>
    </>
  );
};
