'use client';

import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/client';

export const SignInWithGoogle = () => {
  const supabase = createClient();
  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_URL!}/auth/callback`,
      },
    });
  };

  return (
    <Button variant="outline" type="button" onClick={handleSignIn}>
      <img src="/google.png" alt="google icon" className="size-6 mr-2" />
      Inicia sesión con google
    </Button>
  );
};
