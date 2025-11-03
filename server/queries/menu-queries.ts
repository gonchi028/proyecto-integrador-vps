'use server';
import 'server-only';
import { db } from '@/server/db';
import { menu, menuProducto } from '@/server/db/schema';
import { eq, and } from 'drizzle-orm';

export async function getMenus() {
  const menus = await db.query.menu.findMany({
    orderBy: (menu, { desc }) => [desc(menu.fecha)],
    with: {
      menuProducto: {
        with: {
          producto: true,
        },
      },
    },
  });

  return menus.map(({ menuProducto, ...menu }) => ({
    ...menu,
    productos: menuProducto.map(({ cantidadPreparada, cantidadVendida, producto }) => ({
      ...producto,
      cantidadPreparada,
      cantidadVendida,
    })),
  }));
}

export async function getMenuById(id: number) {
  const menuData = await db.query.menu.findFirst({
    where: eq(menu.id, id),
    with: {
      menuProducto: {
        with: {
          producto: true,
        },
      },
    },
  });

  if (!menuData) return null;

  const { menuProducto, ...menuInfo } = menuData;
  return {
    ...menuInfo,
    productos: menuProducto.map(({ cantidadPreparada, cantidadVendida, producto }) => ({
      ...producto,
      cantidadPreparada,
      cantidadVendida,
    })),
  };
}

export async function addMenu(data: {
  descripcion: string;
  fecha: string;
  estado: string;
}) {
  const newMenu = await db.insert(menu).values(data).returning();
  return newMenu[0];
}

export async function updateMenu(
  id: number,
  data: {
    descripcion: string;
    fecha: string;
    estado: string;
  }
) {
  await db.update(menu).set(data).where(eq(menu.id, id));
}

export async function deleteMenu(id: number) {
  await db.transaction(async (tx) => {
    // Remove all menu-product associations
    await tx.delete(menuProducto).where(eq(menuProducto.menuId, id));
    // Delete the menu
    await tx.delete(menu).where(eq(menu.id, id));
  });
}

export async function addProductToMenu(
  menuId: number,
  productoId: number,
  cantidadPreparada: number
) {
  await db.insert(menuProducto).values({
    menuId,
    productoId,
    cantidadPreparada,
    cantidadVendida: 0,
  });
}

export async function removeProductFromMenu(menuId: number, productoId: number) {
  await db.delete(menuProducto).where(
    and(
      eq(menuProducto.menuId, menuId),
      eq(menuProducto.productoId, productoId)
    )
  );
}

export async function updateMenuProductQuantities(
  menuId: number,
  productoId: number,
  cantidadPreparada: number,
  cantidadVendida: number
) {
  await db
    .update(menuProducto)
    .set({ cantidadPreparada, cantidadVendida })
    .where(
      and(
        eq(menuProducto.menuId, menuId),
        eq(menuProducto.productoId, productoId)
      )
    );
}

export async function updateMenuProducts(
  menuId: number,
  products: Array<{
    productoId: number;
    cantidadPreparada: number;
    cantidadVendida?: number;
  }>
) {
  await db.transaction(async (tx) => {
    // Remove all existing associations
    await tx.delete(menuProducto).where(eq(menuProducto.menuId, menuId));
    
    // Add new associations
    if (products.length > 0) {
      await tx.insert(menuProducto).values(
        products.map((product) => ({
          menuId,
          productoId: product.productoId,
          cantidadPreparada: product.cantidadPreparada,
          cantidadVendida: product.cantidadVendida || 0,
        }))
      );
    }
  });
} 
