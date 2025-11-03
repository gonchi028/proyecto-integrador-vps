'use client';

import { useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

import { ProductosCocina, useCocinaStore } from '@/store';
import { getPlatosCocina } from '@/server/queries';

export const useCocina = () => {
  const supabase = createClient();
  const setPlatosCocina = useCocinaStore((state) => state.setPlatosCocina);

  const fetchProductosCocina = async () => {
    const productosCocina = await getPlatosCocina();
    setPlatosCocina(productosCocina as ProductosCocina[]);
  };

  useEffect(() => {
    const subscription = supabase
      .channel('cocina')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'detalleProductos' },
        (payload) => {
          fetchProductosCocina();
        }
      )
      .subscribe();

    fetchProductosCocina();
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return;
};
