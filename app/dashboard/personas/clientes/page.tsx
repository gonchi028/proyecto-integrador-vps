import { ClientesTable } from '@/components/clientes/clientes-table';
import { getClientes } from '@/server/cliente-queries';
import { Users } from 'lucide-react';

// Force dynamic rendering - don't pre-render at build time
export const dynamic = 'force-dynamic';

export default async function ClientesPage() {
  const clientes = await getClientes();

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Users className="h-6 w-6" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestión de Clientes</h1>
          <p className="text-muted-foreground">
            Administra la información de tus clientes y sus datos de contacto
          </p>
        </div>
      </div>
      
      <ClientesTable clientes={clientes} />
    </div>
  );
}
