import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AuthCodeError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Error de autenticación
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Hubo un problema al procesar tu solicitud de autenticación.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-center space-y-4">
            <p className="text-gray-700">
              El código de autenticación ha expirado o es inválido. 
              Por favor, intenta iniciar sesión nuevamente.
            </p>
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/login">
                  Volver al inicio de sesión
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/register">
                  Crear nueva cuenta
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
