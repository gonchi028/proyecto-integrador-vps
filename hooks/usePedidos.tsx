'use client';

import { useEffect, useCallback } from 'react';
import { usePedidosStore } from '@/store';
import { createClient } from '@/utils/supabase/client';
import { getPedidos } from '@/server/queries';

export const usePedidos = () => {
  const supabase = createClient();
  const setPedidos = usePedidosStore((state) => state.setPedidos);

  const fetchPedidos = useCallback(async () => {
    try {
      const pedidos = await getPedidos();
      setPedidos(pedidos);
    } catch (error) {
    }
  }, [setPedidos]);

  useEffect(() => {
    const subscription = supabase
      .channel('pedidos-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'pedido' },
        (payload) => {
          fetchPedidos();
        }
      )
      .subscribe();

    fetchPedidos();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, fetchPedidos]);

  return;
};
