'use server';
import 'server-only';
import { db } from '@/server/db';
import { producto } from './db/schema';
import { eq } from 'drizzle-orm';

export async function getProductos() {
  const productos = await db.query.producto.findMany({
    orderBy: (t, { asc }) => asc(t.id),
  });

  return productos;
}

export async function getPlatos() {
  const platos = await db.query.producto.findMany({
    where: (t, { eq }) => eq(t.tipo, 'plato'),
    orderBy: (t, { asc }) => asc(t.id),
  });
  return platos;
}

export async function addPlato(data: {
  nombre: string;
  descripcion: string;
  categoria: string;
  precio: number;
  urlImagen: string;
}) {
  const plato = await db
    .insert(producto)
    .values({ ...data, tipo: 'plato' })
    .returning();
  return plato;
}

export async function updatePlato(
  id: number,
  data: {
    nombre: string;
    descripcion: string;
    categoria: string;
    precio: number;
    urlImagen: string;
  }
) {
  await db.update(producto).set(data).where(eq(producto.id, id));
}

export async function deletePlato(id: number) {
  await db.delete(producto).where(eq(producto.id, id));
}

export async function getBebidas() {
  const bebidas = await db.query.producto.findMany({
    where: (t, { eq }) => eq(t.tipo, 'bebida'),
    orderBy: (t, { asc }) => asc(t.id),
  });
  return bebidas;
}

export async function addBebida(data: {
  nombre: string;
  descripcion: string;
  categoria: string;
  precio: number;
  cantidad: number;
  urlImagen: string;
}) {
  const plato = await db
    .insert(producto)
    .values({ ...data, tipo: 'bebida' })
    .returning();
  return plato;
}

export async function updateBebida(
  id: number,
  data: {
    nombre: string;
    descripcion: string;
    categoria: string;
    precio: number;
    cantidad: number;
    urlImagen: string;
  }
) {
  await db.update(producto).set(data).where(eq(producto.id, id));
}

export async function deleteBebida(id: number) {
  await db.delete(producto).where(eq(producto.id, id));
}
