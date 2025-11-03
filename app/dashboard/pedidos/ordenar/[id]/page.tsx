import { z } from 'zod';
import { Ordenar } from '@/components/pedidos/ordenar';
import { getPedidoById } from '@/server/queries';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Realizar pedido - Terrasse',
  description: 'Realizar pedido',
};

export const dynamic = 'force-dynamic';

const idSchema = z.coerce.number().positive().int();

export default async function OrdenarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  if (!idSchema.safeParse(id).success) {
    return <h1>Necesitas un codigo de pedido valido</h1>;
  }

  const pedido = await getPedidoById(+id);

  if (!pedido) {
    return <h1>No se encontro el pedido</h1>;
  }

  return (
    <>
      <Ordenar pedido={pedido} />
    </>
  );
}
