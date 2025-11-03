import { MenuDisplay } from '@/components/menu';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Menú - Terrasse',
  description: 'Descubre nuestra deliciosa selección de platos, bebidas y combos especiales',
};

export default function MenuPage() {
  return <MenuDisplay />;
}
