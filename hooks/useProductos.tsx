'use client';

import { useEffect, useCallback } from 'react';
import { usePlatosStore, useBebidasStore } from '@/store';
import { Producto } from '@/store/platos/platos-store';
import { createClient } from '@/utils/supabase/client';
import { getProductos } from '@/server/product-queries';

export const useProductos = () => {
  const supabase = createClient();
  const setPlatos = usePlatosStore((state) => state.setPlatos);
  const setBebidas = useBebidasStore((state) => state.setBebidas);

  const updateProducts = useCallback(async () => {
    try {
      const productos = await getProductos();

      const platos: Producto[] = [];
      const bebidas: Producto[] = [];

      productos.forEach((producto) => {
        if (producto.tipo === 'plato') {
          platos.push(producto);
        } else {
          bebidas.push(producto);
        }
      });

      setPlatos(platos);
      setBebidas(bebidas);
    } catch (error) {
      console.error('❌ Error fetching products:', error);
    }
  }, [setPlatos, setBebidas]);

  useEffect(() => {
    const subscription = supabase
      .channel('productos-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'producto' },
        (payload) => {
          updateProducts();
        }
      )
      .subscribe((status) => {
      });

    updateProducts();

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, updateProducts]);

  return;
};
