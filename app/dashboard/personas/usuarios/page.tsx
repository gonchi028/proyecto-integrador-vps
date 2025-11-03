import { UsuariosTable } from '@/components/usuarios';
import { getUsuarios } from '@/server/users-queries';

export default async function UsuariosPage() {
  return (
    <>
      <UsuariosTable />
    </>
  );
}
