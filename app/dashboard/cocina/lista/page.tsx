import { PlatosCocina } from '@/components/cocina';
import { Metadata } from 'next';

// Force dynamic rendering for this page since it shows real-time kitchen data
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Cocina - Terrasse',
  description: 'Platos en cocina',
};

export default async function CocinaPage() {
  return (
    <>
      <PlatosCocina />
    </>
  );
}
