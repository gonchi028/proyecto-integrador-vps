import { ReservasTable } from '@/components/reservas/reservas-table';
import { getReservas } from '@/server/queries/reservas-queries';

export default async function ReservasPage() {
  const reservas = await getReservas();

  return (
    <>
      <ReservasTable reservas={reservas} />
    </>
  );
} 
