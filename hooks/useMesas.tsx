'use client';

import { useEffect } from 'react';
import { useMesasStore } from '@/store';
import { createClient } from '@/utils/supabase/client';

import { getMesas } from '@/server/queries';

export const useMesas = () => {
  const supabase = createClient();
  const setMesas = useMesasStore((state) => state.setMesas);

  const fetchMesas = async () => {
    const mesas = await getMesas();
    setMesas(mesas);
  };

  useEffect(() => {
    const subscription = supabase
      .channel('mesas')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'mesa' },
        (payload) => {
          console.log('payload', payload);
          fetchMesas();
        }
      )
      .subscribe();

    fetchMesas();
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return;
};
