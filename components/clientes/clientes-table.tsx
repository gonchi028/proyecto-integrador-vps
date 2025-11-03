'use client';

import { useEffect, useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnFiltersState,
  SortingState,
  getFilteredRowModel,
  getSortedRowModel,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { MoreHorizontal, Phone, Star, Copy, UserCheck, Building2 } from 'lucide-react';
import { DataTableColumnHeader } from '../shared/data-table-column-header';
import { DataTableViewOptions } from '../shared/data-table-view-options';
import { UpdateClienteDialog } from './update-cliente-dialog';
import { AddClienteDialog } from './add-cliente-dialog';
import { DeleteClienteDialog } from './delete-cliente-dialog';
import { Cliente, useClienteStore } from '@/store/cliente/cliente-store';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const columns: ColumnDef<Cliente>[] = [
  {
    accessorKey: 'ci',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="CI" />
    ),
    cell: ({ row }) => {
      const ci = row.getValue('ci') as string;
      return (
        <div className="flex items-center space-x-2">
          <span className="font-mono text-sm">{ci}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigator.clipboard.writeText(ci)}
            className="h-6 w-6 p-0"
          >
            <Copy className="h-3 w-3" />
          </Button>
        </div>
      );
    },
  },
  {
    accessorKey: 'nombre',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cliente" />
    ),
    cell: ({ row }) => {
      const cliente = row.original;
      return (
        <div className="flex items-center space-x-2">
          <div>
            <div className="font-medium">{cliente.nombre}</div>
            {cliente.razonSocial && (
              <div className="text-xs text-muted-foreground flex items-center">
                <Building2 className="h-3 w-3 mr-1" />
                {cliente.razonSocial}
              </div>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'celular',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Contacto" />
    ),
    cell: ({ row }) => {
      const celular = row.getValue('celular') as string | null;
      if (!celular) return <span className="text-muted-foreground">-</span>;
      
      return (
        <div className="flex items-center space-x-2">
          <Phone className="h-3 w-3" />
          <span>{celular}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(`tel:${celular}`, '_self')}
            className="h-6 w-6 p-0"
            title="Llamar"
          >
            <Phone className="h-3 w-3" />
          </Button>
        </div>
      );
    },
  },
  {
    accessorKey: 'puntos',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Puntos" />
    ),
    cell: ({ row }) => {
      const puntos = row.getValue('puntos') as number | null;
      const puntosValue = puntos ?? 0;
      
      return (
        <div className="flex items-center space-x-2">
          <Star className="h-3 w-3 text-yellow-500" />
          <span className="font-medium">{puntosValue}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'direccion',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Dirección" />
    ),
    cell: ({ row }) => {
      const direccion = row.getValue('direccion') as string | null;
      if (!direccion) return <span className="text-muted-foreground">-</span>;
      
      return (
        <div className="max-w-[200px] truncate" title={direccion}>
          {direccion}
        </div>
      );
    },
  },
  {
    id: 'business',
    header: 'Empresa',
    cell: ({ row }) => {
      const cliente = row.original;
      if (!cliente.razonSocial && !cliente.nit) {
        return <span className="text-muted-foreground">-</span>;
      }
      
      return (
        <div className="text-xs">
          {cliente.razonSocial && (
            <div className="font-medium">{cliente.razonSocial}</div>
          )}
          {cliente.nit && (
            <div className="text-muted-foreground">NIT: {cliente.nit}</div>
          )}
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: 'Acciones',
    cell: ({ row }) => {
      const cliente = row.original;
      const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

      const setClienteToUpdate = useClienteStore(
        (state) => state.setClienteToUpdate
      );
      const setOpenClienteDialog = useClienteStore(
        (state) => state.setOpenUpdateDialog
      );

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menú</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(cliente.ci)}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copiar CI
              </DropdownMenuItem>
              {cliente.celular && (
                <DropdownMenuItem
                  onClick={() => window.open(`tel:${cliente.celular}`, '_self')}
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Llamar
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setClienteToUpdate(cliente);
                  setOpenClienteDialog(true);
                }}
              >
                <UserCheck className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setDeleteDialogOpen(true)}
                className="text-red-600"
              >
                <span className="text-red-600">Eliminar</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DeleteClienteDialog
            cliente={cliente}
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
          />
        </>
      );
    },
  },
];

type Props = {
  clientes: Cliente[];
};

export const ClientesTable = ({ clientes }: Props) => {
  const clientesStore = useClienteStore((state) => state.clientes);
  const setClientes = useClienteStore((state) => state.setClientes);

  useEffect(() => {
    setClientes(clientes);
  }, [clientes, setClientes]);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    business: false, // Hide business column by default
  });
  const [searchFilter, setSearchFilter] = useState('nombre');

  const table = useReactTable({
    data: clientesStore,
    columns,
    getCoreRowModel: getCoreRowModel(),
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

  const searchPlaceholders = {
    nombre: 'Buscar por nombre...',
    ci: 'Buscar por CI...',
    celular: 'Buscar por celular...',
    direccion: 'Buscar por dirección...',
  };

  return (
    <div className="w-full">

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center py-4 gap-2">
        <div className="flex items-center space-x-2 flex-1">
          <Select value={searchFilter} onValueChange={setSearchFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nombre">Nombre</SelectItem>
              <SelectItem value="ci">CI</SelectItem>
              <SelectItem value="celular">Celular</SelectItem>
              <SelectItem value="direccion">Dirección</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder={searchPlaceholders[searchFilter as keyof typeof searchPlaceholders]}
            value={(table.getColumn(searchFilter)?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn(searchFilter)?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
        <div className="flex items-center space-x-2">
          <AddClienteDialog />
          <DataTableViewOptions table={table} />
        </div>
      </div>

      {/* Table */}
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
                  className="h-24 text-center"
                >
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <UserCheck className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">No hay clientes registrados</p>
                      <p className="text-sm text-muted-foreground">
                        Comienza agregando tu primer cliente
                      </p>
                    </div>
                    <AddClienteDialog />
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <UpdateClienteDialog />
    </div>
  );
};
