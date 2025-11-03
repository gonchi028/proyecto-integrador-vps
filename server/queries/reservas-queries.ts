'use server';
import 'server-only';
import { db } from '@/server/db';
import { reserva, cliente } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

export async function getReservas() {
  const reservas = await db.query.reserva.findMany({
    with: {
      cliente: true,
    },
    orderBy: (reserva, { desc }) => [desc(reserva.fechaHora)],
  });
  return reservas;
}

export async function createReserva(data: {
  estado: 'pendiente' | 'confirmada' | 'cancelada' | 'utilizada' | 'no asistio';
  cantidadPersonas: number;
  fechaHora: Date;
  mesa: number;
  clienteCi: string;
}) {
  const newReserva = await db.insert(reserva).values(data).returning();
  return newReserva[0];
}

export async function updateReserva(
  id: number,
  data: {
    estado: 'pendiente' | 'confirmada' | 'cancelada' | 'utilizada' | 'no asistio';
    cantidadPersonas: number;
    fechaHora: Date;
    mesa: number;
    clienteCi: string;
  }
) {
  const updatedReserva = await db
    .update(reserva)
    .set(data)
    .where(eq(reserva.id, id))
    .returning();
  return updatedReserva[0];
}

export async function deleteReserva(id: number) {
  await db.delete(reserva).where(eq(reserva.id, id));
} 
