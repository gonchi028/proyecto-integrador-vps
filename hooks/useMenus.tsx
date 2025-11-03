'use client';

import { useEffect, useCallback } from 'react';
import { useMenuStore } from '@/store/menu/menu-store';
import { createClient } from '@/utils/supabase/client';
import { getMenus } from '@/server/queries/menu-queries';

export const useMenus = () => {
  const supabase = createClient();
  const { menus, setMenus } = useMenuStore();

  const fetchMenus = useCallback(async () => {
    try {
      const menusData = await getMenus();
      setMenus(menusData);
    } catch (error) {
      console.error('❌ Error fetching menus:', error);
    }
  }, [setMenus]);

  const refetch = useCallback(() => {
    fetchMenus();
  }, [fetchMenus]);

  useEffect(() => {
    const subscription = supabase
      .channel('menus-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'menu' },
        (payload) => {
          fetchMenus();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'menuProducto' },
        (payload) => {
          fetchMenus();
        }
      )
      .subscribe((status) => {
        console.log('🔄 Menus subscription status:', status);
      });

    fetchMenus();

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, fetchMenus]);

  return {
    menus,
    refetch,
  };
}; 
