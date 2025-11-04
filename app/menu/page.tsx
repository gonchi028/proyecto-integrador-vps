import { MenuDisplay } from '@/components/menu';
import { Metadata } from 'next';

// Force dynamic rendering - menu data is fetched at runtime
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Menú - Terrasse',
  description: 'Descubre nuestra deliciosa selección de platos, bebidas y combos especiales',
};

export default function MenuPage() {
  return <MenuDisplay />;
}
