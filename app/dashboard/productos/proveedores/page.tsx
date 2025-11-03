import { ProveedoresView } from '@/components/proveedores';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Proveedores - Terrasse',
  description: 'Proveedores de Terrasse',
};

export default function ProveedoresPage() {
  return (
    <>
      <ProveedoresView />
    </>
  );
}
