'use server';
import 'server-only';

import { db } from '@/server/db';
import { detalleCombo, detalleProductos, mesa, pedido, pago, factura } from '../db/schema';
import { eq, gte } from 'drizzle-orm';
import { getLaPazDate } from '@/lib/utils';

export async function getPedidos() {
  // Get start of today in La Paz timezone
  const today = getLaPazDate();
  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);

  const pedidos = await db.query.pedido.findMany({
    where: (p, { gte }) => gte(p.fechaHoraPedido, startOfDay),
    orderBy: (p, { desc }) => desc(p.fechaHoraPedido),
    with: {
      mesa: true,
      cliente: true,
      mesero: true,
      pago: {
        with: {
          factura: true,
        },
      },
      detalleProductos: {
        with: {
          producto: true,
        },
      },
      detalleCombos: {
        with: {
          combo: {
            with: {
              productoCombo: {
                with: {
                  producto: true,
                },
              },
            },
          },
        },
      },
    },
  });
  return pedidos;
}

export async function getPedidoById(id: number) {
  const pedido = await db.query.pedido.findFirst({
    where: (p, { eq }) => eq(p.id, id),
    with: {
      mesa: true,
      cliente: true,
      mesero: true,
      pago: {
        with: {
          factura: true,
        },
      },
      detalleProductos: {
        with: {
          producto: true,
        },
      },
      detalleCombos: {
        with: {
          combo: {
            with: {
              productoCombo: {
                with: {
                  producto: true,
                },
              },
            },
          },
        },
      },
    },
  });
  return pedido;
}

export type AddPedidoData = {
  tipo: 'mesa' | 'domicilio';
  clienteCi: string;
};

export async function addPedido(data: AddPedidoData) {
  const result = await db.insert(pedido).values({
    ...data,
    estado: 'pendiente',
    total: 0,
    fechaHoraPedido: getLaPazDate(),
    fechaHoraEntrega: null,
  }).returning({ id: pedido.id });
  
  return result[0];
}

export async function asignarMesero(meseroId: string, pedidoId: number) {
  // Get existing pedido to preserve fechaHoraPedido
  const existingPedido = await db.query.pedido.findFirst({
    where: eq(pedido.id, pedidoId),
  });

  if (!existingPedido) {
    throw new Error('Pedido no encontrado');
  }

  await db.update(pedido).set({ 
    meseroId
  }).where(eq(pedido.id, pedidoId));
}

export async function asignarMesa(
  mesaId: number,
  pedidoId: number,
  anteriorMesaId?: number
) {
  // Verify pedido exists
  const pedidoToUpdate = await db.query.pedido.findFirst({
    where: eq(pedido.id, pedidoId)
  });

  if (!pedidoToUpdate) {
    throw new Error('Pedido no encontrado');
  }

  // Verify mesa exists and is available before assigning
  const mesaToAssign = await db.query.mesa.findFirst({
    where: eq(mesa.id, mesaId),
  });

  if (!mesaToAssign) {
    throw new Error('Mesa no encontrada');
  }

  // Only check if mesa is occupied if it's not the same as the current mesa
  if (mesaToAssign.estado === 'ocupada' && mesaId !== anteriorMesaId) {
    throw new Error('Mesa ya está ocupada');
  }

  await db.transaction(async (tx) => {
    // If there was a previous mesa, free it
    
    if (pedidoToUpdate.mesaId && anteriorMesaId !== mesaId) {
      await tx
        .update(mesa)
        .set({ estado: 'libre' })
        .where(eq(mesa.id, pedidoToUpdate.mesaId));
    }

    // Update pedido with new mesa, preserving fechaHoraPedido
    await tx
      .update(pedido)
      .set({ 
        mesaId,
        fechaHoraPedido: getLaPazDate()
      })
      .where(eq(pedido.id, pedidoId));

    // Mark new mesa as occupied
    await tx
      .update(mesa)
      .set({ estado: 'ocupada' })
      .where(eq(mesa.id, mesaId));
  });
}

type CantidadPedida = {
  cantidad: number;
  id: number;
};

export async function realizarPedido(
  pedidoId: number,
  total: number,
  combos: CantidadPedida[],
  productos: CantidadPedida[]
) {
  await db.transaction(async (tx) => {
    // First verify the pedido exists and get its current data
    const existingPedido = await tx.query.pedido.findFirst({
      where: eq(pedido.id, pedidoId),
    });

    if (!existingPedido) {
      throw new Error('Pedido no encontrado');
    }

    // Update only the total, preserving all other fields including fechaHoraPedido
    await tx.update(pedido).set({ 
      total,
      // Explicitly preserve fechaHoraPedido if it exists, otherwise set current time
      fechaHoraPedido: getLaPazDate()
    }).where(eq(pedido.id, pedidoId));

    // Delete existing details
    await tx.delete(detalleCombo).where(eq(detalleCombo.pedidoId, pedidoId));
    await tx.delete(detalleProductos).where(eq(detalleProductos.pedidoId, pedidoId));

    // Insert new combo details
    if (combos.length > 0) {
      await tx.insert(detalleCombo).values(
        combos.map((c) => ({
          pedidoId,
          comboId: c.id,
          cantidad: c.cantidad,
          estado: 'pendiente' as 'pendiente' | 'en preparacion' | 'entregado',
        }))
      );
    }

    // Insert new product details
    if (productos.length > 0) {
      await tx.insert(detalleProductos).values(
        productos.map((p) => ({
          pedidoId,
          productoId: p.id,
          cantidad: p.cantidad,
          estado: 'pendiente' as 'pendiente' | 'en preparacion' | 'entregado',
        }))
      );
    }
  });
}

export async function updatePedidoEstado(
  pedidoId: number, 
  estado: 'pendiente' | 'cancelado' | 'en camino' | 'listo para recoger' | 'entregado'
) {
  // Get existing pedido to preserve fechaHoraPedido
  const existingPedido = await db.query.pedido.findFirst({
    where: eq(pedido.id, pedidoId),
  });

  if (!existingPedido) {
    throw new Error('Pedido no encontrado');
  }

  await db.update(pedido).set({ 
    estado,
    fechaHoraPedido: existingPedido.fechaHoraPedido || getLaPazDate(),
    ...(estado === 'entregado' ? { fechaHoraEntrega: getLaPazDate() } : {})
  }).where(eq(pedido.id, pedidoId));
}

export async function deletePedido(pedidoId: number) {
  await db.transaction(async (tx) => {
    // Delete related records first
    await tx.delete(detalleProductos).where(eq(detalleProductos.pedidoId, pedidoId));
    await tx.delete(detalleCombo).where(eq(detalleCombo.pedidoId, pedidoId));
    
    // Delete the pedido
    await tx.delete(pedido).where(eq(pedido.id, pedidoId));
  });
}

export async function procesarPago(
  pedidoId: number,
  tipoPago: string,
  monto: number,
  facturaData?: { nit: string; razonSocial: string }
) {
  await db.transaction(async (tx) => {
    // Get existing pedido to preserve fechaHoraPedido
    const existingPedido = await tx.query.pedido.findFirst({
      where: eq(pedido.id, pedidoId),
    });

    if (!existingPedido) {
      throw new Error('Pedido no encontrado');
    }

    // Create payment record
    const newPago = await tx.insert(pago).values({
      tipo: tipoPago,
      monto: monto,
      fechaHora: getLaPazDate(),
    }).returning({ id: pago.id });

    // Create factura if requested
    if (facturaData) {
      await tx.insert(factura).values({
        nit: facturaData.nit,
        razonSocial: facturaData.razonSocial,
        pagoId: newPago[0].id,
      });
    }

    // Update pedido with payment ID and change state to entregado
    await tx.update(pedido).set({ 
      pagoId: newPago[0].id,
      estado: 'entregado',
      fechaHoraPedido: existingPedido.fechaHoraPedido || getLaPazDate(),
      fechaHoraEntrega: getLaPazDate()
    }).where(eq(pedido.id, pedidoId));

    // If pedido has a mesa, free it
    if (existingPedido.mesaId) {
      await tx
        .update(mesa)
        .set({ estado: 'libre' })
        .where(eq(mesa.id, existingPedido.mesaId));
    }
  });
}

// export async function asignarMesa(pedidoId: number, mesaId: number) {
//   await db.update(pedido).set({ mesaId }).where(eq(pedido.id, pedidoId));
// }
