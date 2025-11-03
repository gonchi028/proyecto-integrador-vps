'use server';
import 'server-only';
import { db } from '@/server/db';
import { cliente } from './db/schema';
import { asc, eq } from 'drizzle-orm';

import { Cliente } from '@/store/cliente/cliente-store';

export async function getClientes() {
  const clientes = await db.query.cliente.findMany({
    orderBy: (cliente, { asc }) => [asc(cliente.ci)],
  });
  return clientes;
}

export async function getCliente(ci: string) {
  const cliente = await db.query.cliente.findFirst({
    where: (cliente) => eq(cliente.ci, ci),
  });
  return cliente;
}

export async function addCliente(data: Omit<Cliente, 'puntos'>) {
  const newCliente = await db
    .insert(cliente)
    .values({ ...data, puntos: 0 })
    .returning();
  return newCliente;
}

export async function updateCliente(ci: string, data: Omit<Cliente, 'puntos'>) {
  await db.update(cliente).set(data).where(eq(cliente.ci, ci));
}

export async function deleteCliente(ci: string) {
  await db.delete(cliente).where(eq(cliente.ci, ci));
}
