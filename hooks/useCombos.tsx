'use client';

import { useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

import { getCombos } from '@/server/queries';
import { useCombosStore } from '@/store';

export const useCombos = () => {
  const supabase = createClient();
  const setCombos = useCombosStore((state) => state.setCombos);

  const fetchCombos = async () => {
    const combos = await getCombos();
    setCombos(combos);
  };

  useEffect(() => {
    const subscription = supabase
      .channel('mesas')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'combo' },
        (payload) => {
          fetchCombos();
        }
      )
      .subscribe();

    fetchCombos();
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return;
};
