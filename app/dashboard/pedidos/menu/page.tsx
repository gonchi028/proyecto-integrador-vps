import { MenusView } from '@/components/menus';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Menús del Día - Dashboard',
  description: 'Gestiona los menús diarios del restaurante',
};

export default function MenuPage() {
  return <MenusView />;
} 
