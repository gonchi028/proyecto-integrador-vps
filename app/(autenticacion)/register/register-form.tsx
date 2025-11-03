'use client';

import { useFormState } from 'react-dom';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { signUpWithEmail, type RegisterFormState } from '../login/actions';
import { useRouter } from 'next/navigation';

const initialState: RegisterFormState = {};

export const RegisterForm = () => {
  const [state, formAction] = useFormState(signUpWithEmail, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Redirect to verification page when registration is successful
  useEffect(() => {
    if (state.success) {
      router.push('/auth/verify-email');
    }
  }, [state.success, router]);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    try {
      await formAction(formData);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form action={handleSubmit} className="space-y-4">
      {state.errors?.general && (
        <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
          {state.errors.general.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Nombre completo</Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="Ingresa tu nombre completo"
          required
        />
        {state.errors?.name && (
          <p className="text-sm text-red-500">{state.errors.name[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="userName">Nombre de usuario</Label>
        <Input
          id="userName"
          name="userName"
          type="text"
          placeholder="Ingresa tu nombre de usuario"
          required
        />
        {state.errors?.userName && (
          <p className="text-sm text-red-500">{state.errors.userName[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="ejemplo@correo.com"
          required
        />
        {state.errors?.email && (
          <p className="text-sm text-red-500">{state.errors.email[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Ingresa tu contraseña"
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOffIcon className="h-4 w-4" />
            ) : (
              <EyeIcon className="h-4 w-4" />
            )}
          </Button>
        </div>
        {state.errors?.password && (
          <p className="text-sm text-red-500">{state.errors.password[0]}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading || state.success}>
        {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
      </Button>
    </form>
  );
}; 
