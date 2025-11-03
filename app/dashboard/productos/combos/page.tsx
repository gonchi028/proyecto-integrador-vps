import { CombosView } from '@/components/combos';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Combos - Terrasse',
  description: 'Combos de Terrasse',
};

export default function CombosPage() {
  return (
    <>
      <CombosView />
    </>
  );
}
