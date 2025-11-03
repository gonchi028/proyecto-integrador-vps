import { MesasTable } from '@/components/mesas/mesas-table';
import { getMesas } from '@/server/queries/mesas-queries';

export default async function MesasPage() {
  const mesas = await getMesas();

  return (
    <>
      <MesasTable mesas={mesas} />
    </>
  );
}
