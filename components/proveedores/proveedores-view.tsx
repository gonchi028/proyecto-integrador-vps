'use client';

import { useState } from 'react';
import { RefreshCw, Grid, Table } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProveedores } from '@/hooks/useProveedores';
import { ProveedoresTable } from './proveedores-table';
import { ProveedoresGrid } from './proveedores-grid';
import { AddProveedorDialog } from './add-proveedor-dialog';
import { BulkManageProductsDialog } from './bulk-manage-products-dialog';

type ViewMode = 'table' | 'grid';

export const ProveedoresView = () => {
  const { proveedores, refetch } = useProveedores();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4">
        <div>
          <h1 className="text-3xl font-bold">Proveedores</h1>
          <p className="text-muted-foreground">
            Gestiona los proveedores del restaurante
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Buscar proveedores..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="max-w-sm"
          />
          <AddProveedorDialog />
          <BulkManageProductsDialog />
          <Button variant="outline" size="sm" onClick={refetch}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
        </div>
        
        <div className="flex items-center gap-1 border rounded-lg p-1">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="h-8 px-3"
          >
            <Grid className="h-4 w-4 mr-1" />
            Cuadrícula
          </Button>
          <Button
            variant={viewMode === 'table' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('table')}
            className="h-8 px-3"
          >
            <Table className="h-4 w-4 mr-1" />
            Tabla
          </Button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <ProveedoresGrid searchTerm={searchTerm} />
      ) : (
        <ProveedoresTable data={proveedores} />
      )}
    </div>
  );
}; 
