import { MesasTable } from '@/components/mesas/mesas-table';
import { getMesas } from '@/server/queries/mesas-queries';

// Force dynamic rendering - don't pre-render at build time
export const dynamic = 'force-dynamic';

export default async function MesasPage() {
  const mesas = await getMesas();

  return (
    <>
      <MesasTable mesas={mesas} />
    </>
  );
}
