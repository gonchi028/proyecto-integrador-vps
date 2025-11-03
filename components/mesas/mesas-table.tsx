'use client';

import { useEffect, useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  // Filtrado
  ColumnFiltersState,
  SortingState,
  getFilteredRowModel,
  getSortedRowModel,
  // Visiblidad
  VisibilityState,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { MoreHorizontal, TableIcon, Grid3X3Icon } from 'lucide-react';
import { DataTableColumnHeader } from '../shared/data-table-column-header';
import { DataTableViewOptions } from '../shared/data-table-view-options';
import { useLoadingStore } from '@/store';
import { toast } from 'sonner';
import { UpdateMesaDialog } from './update-mesa-dialog';
import { AddMesaDialog } from './add-mesa-dialog';
import { Mesa, useMesasStore } from '@/store/mesas/mesas-store';
import { deleteMesa } from '@/server/queries/mesas-queries';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const columns: ColumnDef<Mesa>[] = [
  {
    accessorKey: 'numero',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Número" />
    ),
  },
  {
    accessorKey: 'estado',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" />
    ),
    cell: ({ row }) => {
      const estado = row.getValue('estado') as string;
      return (
        <Badge
          variant={
            estado === 'libre' ? 'default' :
            estado === 'ocupada' ? 'destructive' : 'secondary'
          }
          className={
            estado === 'libre' ? 'bg-green-600' :
            estado === 'ocupada' ? 'bg-red-600' : 'bg-blue-600'
          }
        >
          {estado}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'capacidad',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Capacidad" />
    ),
    cell: ({ row }) => {
      const capacidad = row.getValue('capacidad') as number;
      return `${capacidad} personas`;
    },
  },
  {
    id: 'actions',
    header: 'Acciones',
    cell: ({ row }) => {
      const mesa = row.original;

      const setMesaToUpdate = useMesasStore(
        (state) => state.setMesaToUpdate
      );
      const setOpenMesaDialog = useMesasStore(
        (state) => state.setOpenUpdateDialog
      );

      const deleteMesaFromStore = useMesasStore(
        (state) => state.deleteMesaFromStore
      );

      const showLoading = useLoadingStore((state) => state.showLoading);
      const hideLoading = useLoadingStore((state) => state.hideLoading);

      const eliminarMesa = async (id: number) => {
        showLoading('Eliminando mesa...');
        await deleteMesa(id);
        hideLoading();
        deleteMesaFromStore(id);
        toast('Operacion exitosa!', {
          description: 'La mesa fue eliminada correctamente',
        });
      }
      
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(mesa.numero.toString())}
            >
              Copiar número
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => {
              setMesaToUpdate(mesa);
              setOpenMesaDialog(true);
            }}>Editar</DropdownMenuItem>
            <DropdownMenuItem onClick={() => eliminarMesa(mesa.id)}>
              <span className="text-red-600">Eliminar</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

type Props = {
  mesas: Mesa[];
};

export const MesasTable = ({ mesas }: Props) => {
  const mesasStore = useMesasStore((state) => state.mesas);
  const setMesas = useMesasStore((state) => state.setMesas);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid');

  useEffect(() => {
    setMesas(mesas);
  }, []);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data: mesasStore,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // Sorting
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'libre':
        return 'bg-green-600';
      case 'ocupada':
        return 'bg-red-600';
      case 'reservada':
        return 'bg-blue-600';
      default:
        return 'bg-gray-600';
    }
  };

  const MesaCard = ({ mesa }: { mesa: Mesa }) => {
    const setMesaToUpdate = useMesasStore((state) => state.setMesaToUpdate);
    const setOpenMesaDialog = useMesasStore((state) => state.setOpenUpdateDialog);
    const deleteMesaFromStore = useMesasStore((state) => state.deleteMesaFromStore);
    const showLoading = useLoadingStore((state) => state.showLoading);
    const hideLoading = useLoadingStore((state) => state.hideLoading);

    const eliminarMesa = async (id: number) => {
      showLoading('Eliminando mesa...');
      await deleteMesa(id);
      hideLoading();
      deleteMesaFromStore(id);
      toast('Operacion exitosa!', {
        description: 'La mesa fue eliminada correctamente',
      });
    };

    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">Mesa {mesa.numero}</CardTitle>
            <Badge
              variant={
                mesa.estado === 'libre' ? 'default' :
                mesa.estado === 'ocupada' ? 'destructive' : 'secondary'
              }
              className={getEstadoColor(mesa.estado)}
            >
              {mesa.estado}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Capacidad:</span>
              <span className="font-medium">{mesa.capacidad} personas</span>
            </div>
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={() => navigator.clipboard.writeText(mesa.numero.toString())}
                  >
                    Copiar número
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => {
                    setMesaToUpdate(mesa);
                    setOpenMesaDialog(true);
                  }}>
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => eliminarMesa(mesa.id)}>
                    <span className="text-red-600">Eliminar</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Filtrar por número..."
            value={(table.getColumn('numero')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('numero')?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <AddMesaDialog />
          <DataTableViewOptions table={table} />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('table')}
          >
            <TableIcon className="h-4 w-4 mr-2" />
            Tabla
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3Icon className="h-4 w-4 mr-2" />
            Cuadrícula
          </Button>
        </div>
      </div>

      {viewMode === 'table' ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-12 text-center"
                  >
                    Sin mesas registradas.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <MesaCard key={row.id} mesa={row.original} />
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              Sin mesas registradas.
            </div>
          )}
        </div>
      )}
      <UpdateMesaDialog />
    </div>
  );
}; 
