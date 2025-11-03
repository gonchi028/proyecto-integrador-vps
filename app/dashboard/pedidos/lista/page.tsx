import { PedidosTabs } from '@/components/pedidos/pedidos-tabs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pedidos - Terrasse',
  description: 'Lista de pedidos en Terrasse',
};

export default async function ListaPedidosPage() {
  return (
    <div className="container mx-auto py-6">
      <PedidosTabs />
    </div>
  );
}
