import { PlatosView } from '@/components/platos';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Platos - Terrasse',
};

export default async function PlatosPage() {
  return (
    <>
      <PlatosView />
    </>
  );
}
