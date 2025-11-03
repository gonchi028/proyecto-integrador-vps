'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Grid, Table, RefreshCw } from 'lucide-react';
import { PlatosTable } from './platos-table';
import { PlatosGrid } from './platos-grid';
import { AddPlatoDialog } from './add-plato-dialog';
import { UpdatePlatoDialog } from './update-plato-dialog';

type ViewMode = 'table' | 'grid';

export const PlatosView = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Buscar platos..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="max-w-sm"
          />
          <AddPlatoDialog />
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
          >
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
        <PlatosGrid searchTerm={searchTerm} />
      ) : (
        <PlatosTable />
      )}
      
      <UpdatePlatoDialog />
    </div>
  );
}; 
