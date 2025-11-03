'use server';
import 'server-only';
import { db } from '@/server/db';
import { combo, productoCombo } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

export async function getCombos() {
  const combos = await db.query.combo.findMany({
    orderBy: (combo, { asc }) => [asc(combo.id)],
    with: {
      productoCombo: {
        with: {
          producto: true,
        },
      },
    },
  });

  return combos.map(
    ({ id, nombre, precio, estado, urlImagen, productoCombo }) => ({
      id,
      nombre,
      precio,
      estado,
      urlImagen,
      productos: productoCombo.map(({ producto }) => producto),
    })
  );
}

export async function addCombo(data: {
  nombre: string;
  precio: number;
  urlImagen: string;
  productoIds: number[];
}) {
  await db.transaction(async (tx) => {
    const comboDB = await tx
      .insert(combo)
      .values({
        nombre: data.nombre,
        precio: data.precio,
        urlImagen: data.urlImagen,
        estado: 'Activo',
      })
      .returning();

    const comboId = comboDB[0].id;

    await tx.insert(productoCombo).values(
      data.productoIds.map((productoId) => ({
        comboId,
        productoId,
      }))
    );
  });
}

export async function deleteCombo(id: number) {
  await db.transaction(async (tx) => {
    await tx.delete(productoCombo).where(eq(productoCombo.comboId, id));
    await tx.delete(combo).where(eq(combo.id, id));
  });
}

export async function updateCombo(data: {
  id: number;
  nombre: string;
  precio: number;
  urlImagen: string;
  estado: string;
  productoIds: number[];
}) {
  await db.transaction(async (tx) => {
    await tx
      .update(combo)
      .set({
        nombre: data.nombre,
        precio: data.precio,
        urlImagen: data.urlImagen,
        estado: data.estado,
      })
      .where(eq(combo.id, data.id));

    await tx.delete(productoCombo).where(eq(productoCombo.comboId, data.id));
    await tx.insert(productoCombo).values(
      data.productoIds.map((productoId) => ({
        comboId: data.id,
        productoId,
      }))
    );
  });
}
