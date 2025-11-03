'use server';
import 'server-only';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createOrUpdateUser } from '@/server/users-queries';

const loginSchema = z.object({
  email: z.string().email('Ingresa un email válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

const registerSchema = z.object({
  email: z.string().email('Ingresa un email válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  userName: z.string().min(2, 'El nombre de usuario debe tener al menos 2 caracteres'),
});

export type LoginFormState = {
  errors?: {
    email?: string[];
    password?: string[];
    general?: string[];
  };
  success?: boolean;
};

export type RegisterFormState = {
  errors?: {
    email?: string[];
    password?: string[];
    name?: string[];
    userName?: string[];
    general?: string[];
  };
  success?: boolean;
};

export const signInWithEmail = async (
  prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> => {
  const validatedFields = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      errors: {
        general: ['Credenciales inválidas. Por favor verifica tu email y contraseña.'],
      },
    };
  }

  // Sync user with our custom database
  if (data.user) {
    try {
      await createOrUpdateUser({
        id: data.user.id,
        email: data.user.email!,
        name: data.user.user_metadata?.name,
        userName: data.user.user_metadata?.user_name,
        avatarUrl: data.user.user_metadata?.avatar_url,
      });
    } catch (dbError) {
      console.error('Error syncing user to database:', dbError);
      // Continue with authentication even if DB sync fails
    }
  }

  redirect('/dashboard');
};

export const signUpWithEmail = async (
  prevState: RegisterFormState,
  formData: FormData
): Promise<RegisterFormState> => {
  const validatedFields = registerSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    name: formData.get('name'),
    userName: formData.get('userName'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password, name, userName } = validatedFields.data;
  const supabase = createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        user_name: userName,
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`,
      },
    },
  });

  if (error) {
    return {
      errors: {
        general: [error.message || 'Error al crear la cuenta. Por favor intenta de nuevo.'],
      },
    };
  }

  return { success: true };
};

export const signOut = async () => {
  'use server';

  const supabase = createClient();
  await supabase.auth.signOut();
  return redirect('/login');
};
