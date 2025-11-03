import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircleIcon } from 'lucide-react';

export default function VerifyEmail() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <CheckCircleIcon className="mx-auto h-12 w-12 text-green-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            ¡Cuenta creada exitosamente!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Verifica tu email para completar el registro
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-center space-y-4">
            <p className="text-gray-700">
              Hemos enviado un enlace de verificación a tu correo electrónico.
              Por favor, revisa tu bandeja de entrada y haz clic en el enlace
              para activar tu cuenta.
            </p>
            <div className="text-sm text-gray-600">
              <p>¿No recibiste el correo?</p>
              <p>Revisa tu carpeta de spam o correo no deseado.</p>
            </div>
            <Button asChild className="w-full">
              <Link href="/login">
                Volver al inicio de sesión
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 
