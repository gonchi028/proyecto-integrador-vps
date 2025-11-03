'use client';

import { useEffect } from 'react';
import { useUsuariosStore } from '@/store';
import { createClient } from '@/utils/supabase/client';
import { getUsuarios } from '@/server/users-queries';

export const useUsuarios = () => {
  const supabase = createClient();
  const setUsuarios = useUsuariosStore((state) => state.setUsuarios);

  const updateUsuarios = async () => {
    const usuarios = await getUsuarios();
    setUsuarios(usuarios);
  };

  useEffect(() => {
    const subscription = supabase
      .channel('products-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user' },
        (payload) => {
          updateUsuarios();
        }
      )
      .subscribe();

    updateUsuarios();
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return;
};
