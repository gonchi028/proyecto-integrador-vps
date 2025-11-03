'use server';
import 'server-only';
import { db } from '@/server/db';
import { proveedor, productoProveedor } from '@/server/db/schema';
import { eq, and } from 'drizzle-orm';

export async function getProveedores() {
  const proveedores = await db.query.proveedor.findMany({
    orderBy: (proveedor, { asc }) => [asc(proveedor.nombre)],
    with: {
      productoProveedor: {
        with: {
          producto: true,
        },
      },
    },
  });

  return proveedores.map(({ productoProveedor, ...proveedor }) => ({
    ...proveedor,
    productos: productoProveedor.map(({ producto }) => producto),
  }));
}

export async function addProveedor(data: {
  nombre: string;
  celular?: string;
  telefono?: string;
  correo?: string;
  direccion?: string;
}) {
  const result = await db
    .insert(proveedor)
    .values(data)
    .returning();

  return result[0];
}

export async function updateProveedor(data: {
  id: number;
  nombre: string;
  celular?: string;
  telefono?: string;
  correo?: string;
  direccion?: string;
}) {
  const { id, ...updateData } = data;
  
  const result = await db
    .update(proveedor)
    .set(updateData)
    .where(eq(proveedor.id, id))
    .returning();

  return result[0];
}

export async function deleteProveedor(id: number) {
  await db.transaction(async (tx) => {
    // First delete all product associations
    await tx.delete(productoProveedor).where(eq(productoProveedor.proveedorId, id));
    // Then delete the proveedor
    await tx.delete(proveedor).where(eq(proveedor.id, id));
  });
}

export async function addProductToProveedor(proveedorId: number, productoId: number) {
  await db.insert(productoProveedor).values({
    proveedorId,
    productoId,
  });
}

export async function removeProductFromProveedor(proveedorId: number, productoId: number) {
  await db.delete(productoProveedor).where(
    and(
      eq(productoProveedor.proveedorId, proveedorId),
      eq(productoProveedor.productoId, productoId)
    )
  );
}

export async function updateProveedorProducts(proveedorId: number, productoIds: number[]) {
  await db.transaction(async (tx) => {
    // Remove all existing associations
    await tx.delete(productoProveedor).where(eq(productoProveedor.proveedorId, proveedorId));
    
    // Add new associations
    if (productoIds.length > 0) {
      await tx.insert(productoProveedor).values(
        productoIds.map((productoId) => ({
          proveedorId,
          productoId,
        }))
      );
    }
  });
} 
