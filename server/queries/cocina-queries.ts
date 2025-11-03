'use server';
import 'server-only';
import { db } from '@/server/db';
import * as schema from '@/server/db/schema';
import { and, eq, gte, lte } from 'drizzle-orm';
import { getLaPazDate } from '@/lib/utils';

export async function getPlatosCocina() {
  // Get start of today in La Paz timezone
  const today = getLaPazDate();
  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);

  // Get productos from start of today onwards using join
  const productosCocina = await db
    .select()
    .from(schema.detalleProductos)
    .innerJoin(schema.pedido, eq(schema.detalleProductos.pedidoId, schema.pedido.id))
    .innerJoin(schema.producto, eq(schema.detalleProductos.productoId, schema.producto.id))
    .leftJoin(schema.mesa, eq(schema.pedido.mesaId, schema.mesa.id))
    .where(gte(schema.pedido.fechaHoraPedido, startOfDay))
    .orderBy(schema.detalleProductos.estado);

  // Get combos from start of today onwards using join
  const combosCocina = await db
    .select()
    .from(schema.detalleCombo)
    .innerJoin(schema.pedido, eq(schema.detalleCombo.pedidoId, schema.pedido.id))
    .innerJoin(schema.combo, eq(schema.detalleCombo.comboId, schema.combo.id))
    .leftJoin(schema.mesa, eq(schema.pedido.mesaId, schema.mesa.id))
    .where(gte(schema.pedido.fechaHoraPedido, startOfDay))
    .orderBy(schema.detalleCombo.estado);

  // Map productos
  const mappedProductos = productosCocina.map((pc) => ({
    estado: pc.detalleProductos.estado,
    cantidad: pc.detalleProductos.cantidad,
    calificacion: pc.detalleProductos.calificacion,
    producto: pc.producto,
    pedido: {
      id: pc.pedido.id,
      tipo: pc.pedido.tipo,
      mesa: pc.mesa,
    },
    tipo: 'producto' as const,
  }));

  // Map combos
  const mappedCombos = combosCocina.map((cc) => ({
    estado: cc.detalleCombo.estado,
    cantidad: cc.detalleCombo.cantidad,
    calificacion: cc.detalleCombo.calificacion,
    producto: cc.combo, // Use combo as producto for consistency
    pedido: {
      id: cc.pedido.id,
      tipo: cc.pedido.tipo,
      mesa: cc.mesa,
    },
    tipo: 'combo' as const,
  }));

  // Combine and sort by estado
  return [...mappedProductos, ...mappedCombos].sort((a, b) => {
    const estadoOrder = { 'pendiente': 0, 'en preparacion': 1, 'entregado': 2 };
    return estadoOrder[a.estado] - estadoOrder[b.estado];
  });
}

export async function updateEstadoPlatoCocina(
  idPedido: number,
  idProducto: number,
  estado: 'pendiente' | 'en preparacion' | 'entregado'
) {
  await db.transaction(async (tx) => {
    // Update the producto estado
    await tx
      .update(schema.detalleProductos)
      .set({ estado })
      .where(
        and(
          eq(schema.detalleProductos.pedidoId, idPedido),
          eq(schema.detalleProductos.productoId, idProducto)
        )
      );

    // If the estado is being set to 'entregado', check if this is the last item
    if (estado === 'entregado') {
      // Get all productos for this pedido
      const allProductos = await tx.query.detalleProductos.findMany({
        where: eq(schema.detalleProductos.pedidoId, idPedido),
      });

      // Get all combos for this pedido
      const allCombos = await tx.query.detalleCombo.findMany({
        where: eq(schema.detalleCombo.pedidoId, idPedido),
      });

      // Check if all productos and combos are now 'entregado'
      const allProductosEntregados = allProductos.every((producto) => producto.estado === 'entregado');
      const allCombosEntregados = allCombos.every((combo) => combo.estado === 'entregado');

      if (allProductosEntregados && allCombosEntregados) {
        // Update pedido estado to 'entregado' and set fechaHoraEntrega
        await tx
          .update(schema.pedido)
          .set({ 
            estado: 'entregado',
            fechaHoraEntrega: getLaPazDate()
          })
          .where(eq(schema.pedido.id, idPedido));
      }
    }
  });
}

export async function updateEstadoComboCocina(
  idPedido: number,
  idCombo: number,
  estado: 'pendiente' | 'en preparacion' | 'entregado'
) {
  await db.transaction(async (tx) => {
    // Update the combo estado
    await tx
      .update(schema.detalleCombo)
      .set({ estado })
      .where(
        and(
          eq(schema.detalleCombo.pedidoId, idPedido),
          eq(schema.detalleCombo.comboId, idCombo)
        )
      );

    // If the estado is being set to 'entregado', check if this is the last item
    if (estado === 'entregado') {
      // Get all productos for this pedido
      const allProductos = await tx.query.detalleProductos.findMany({
        where: eq(schema.detalleProductos.pedidoId, idPedido),
      });

      // Get all combos for this pedido
      const allCombos = await tx.query.detalleCombo.findMany({
        where: eq(schema.detalleCombo.pedidoId, idPedido),
      });

      // Check if all productos and combos are now 'entregado'
      const allProductosEntregados = allProductos.every((producto) => producto.estado === 'entregado');
      const allCombosEntregados = allCombos.every((combo) => combo.estado === 'entregado');

      if (allProductosEntregados && allCombosEntregados) {
        // Update pedido estado to 'entregado' and set fechaHoraEntrega
        await tx
          .update(schema.pedido)
          .set({ 
            estado: 'entregado',
            fechaHoraEntrega: getLaPazDate()
          })
          .where(eq(schema.pedido.id, idPedido));
      }
    }
  });
}
