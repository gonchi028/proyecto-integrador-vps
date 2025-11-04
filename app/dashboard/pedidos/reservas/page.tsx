import { ReservasTable } from '@/components/reservas/reservas-table';
import { getReservas } from '@/server/queries/reservas-queries';

// Force dynamic rendering - don't pre-render at build time
export const dynamic = 'force-dynamic';

export default async function ReservasPage() {
  const reservas = await getReservas();

  return (
    <>
      <ReservasTable reservas={reservas} />
    </>
  );
} 
