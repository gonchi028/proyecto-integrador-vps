import { Metadata } from 'next';
import { BebidasView } from '@/components/bebidas';

export const metadata: Metadata = {
  title: 'Bebidas - Terrasse',
};

export default async function BebidasPage() {
  return (
    <>
      <BebidasView />
    </>
  );
}
