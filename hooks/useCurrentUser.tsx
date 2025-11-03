'use client';

import { useEffect } from 'react';
import { useUserStore } from '@/store';
import { createClient } from '@/utils/supabase/client';

export const useCurrentUser = () => {
  const supabase = createClient();
  const { user, customUserData, setUser, setCustomUserData } = useUserStore();

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: authData } = await supabase.auth.getUser();
      setUser(authData.user);

      if (authData.user) {
        try {
          // You can fetch from your custom database here
          // For now, let's use the Supabase auth data with proper fallbacks
          const userData = {
            id: authData.user.id,
            name: authData.user.user_metadata?.name || 
                  authData.user.user_metadata?.full_name || 
                  authData.user.email?.split('@')[0] || 
                  'Usuario',
            userName: authData.user.user_metadata?.user_name || 
                     authData.user.user_metadata?.preferred_username ||
                     authData.user.email?.split('@')[0] || 
                     'usuario',
            avatarUrl: authData.user.user_metadata?.avatar_url || 
                       authData.user.user_metadata?.picture ||
                       `https://api.dicebear.com/7.x/avataaars/svg?seed=${authData.user.email}`,
            email: authData.user.email || '',
          };
          setCustomUserData(userData);
        } catch (error) {
          console.error('Error processing user data:', error);
        }
      }
    };

    fetchUserData();
  }, [supabase, setUser, setCustomUserData]);

  return { user, customUserData };
}; 
