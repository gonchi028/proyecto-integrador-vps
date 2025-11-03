'use client';

import { useState } from 'react';
import { RefreshCw, ChefHat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMenus } from '@/hooks/useMenus';
import { MenusGrid } from './menus-grid';
import { AddMenuDialog } from './add-menu-dialog';

export const MenusView = () => {
  const { menus, refetch } = useMenus();
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <ChefHat className="h-8 w-8 text-orange-600" />
            Menús del Día
          </h1>
          <p className="text-muted-foreground">
            Gestiona los menús diarios y sus productos
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Buscar menús..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="max-w-sm"
          />
          <AddMenuDialog />
          <Button variant="outline" size="sm" onClick={refetch}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
        </div>
      </div>

      <MenusGrid searchTerm={searchTerm} />
    </div>
  );
}; 
