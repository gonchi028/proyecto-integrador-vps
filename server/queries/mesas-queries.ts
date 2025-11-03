'use server';
import 'server-only';
import { db } from '@/server/db';
import { mesa } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

export async function getMesas() {
  const mesas = await db.query.mesa.findMany({
    orderBy: (mesa, { asc }) => [asc(mesa.numero)],
  });
  return mesas;
}

export async function createMesa(data: {
  numero: number;
  estado: 'libre' | 'ocupada' | 'reservada';
  capacidad: number;
}) {
  const newMesa = await db.insert(mesa).values(data).returning();
  return newMesa[0];
}

export async function updateMesa(
  id: number,
  data: {
    numero: number;
    estado: 'libre' | 'ocupada' | 'reservada';
    capacidad: number;
  }
) {
  const updatedMesa = await db
    .update(mesa)
    .set(data)
    .where(eq(mesa.id, id))
    .returning();
  return updatedMesa[0];
}

export async function deleteMesa(id: number) {
  await db.delete(mesa).where(eq(mesa.id, id));
}
