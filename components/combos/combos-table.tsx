'use client';

import { useState } from 'react';
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

import { Input } from '@/components/ui/input';

// import { AddPlatoDialog } from './add-plato-dialog';
import { DataTableColumnHeader } from '../shared/data-table-column-header';
import { DataTableViewOptions } from '../shared/data-table-view-options';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { UpdatePlatoDialog } from './update-plato-dialog';
import { Combo, useCombosStore } from '@/store';
import { toast } from 'sonner';
import { ProductosListDialog } from './productos-list-dialog';
import { AddComboDialog } from './add-combo-dialog';
import { DeleteComboDialog } from './delete-combo-dialog';
import { EditComboDialog } from './edit-combo-dialog';

const columns: ColumnDef<Combo>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
  },
  {
    accessorKey: 'nombre',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre" />
    ),
  },
  {
    accessorKey: 'precio',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Precio" />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('precio'));
      const formatted = new Intl.NumberFormat('es-BO', {
        style: 'currency',
        currency: 'BOB',
      }).format(amount);

      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: 'estado',
    header: 'Tipo',
    cell: ({ row }) => {
      const estado = row.original.estado;
      if (estado.toUpperCase() === 'ACTIVO') {
        return (
          <span className="px-3 py-1 rounded-md border border-green-600 bg-green-50 text-green-600">
            {estado}
          </span>
        );
      } else {
        return (
          <span className="px-3 py-1 rounded-md border border-red-600 bg-red-50 text-red-600">
            {estado}
          </span>
        );
      }
    },
  },
  {
    accessorKey: 'urlImagen',
    header: 'Imagen',
    cell: ({ row }) => {
      return (
        <HoverCard>
          <HoverCardTrigger asChild>
            <Avatar>
              <AvatarImage
                src={row.original.urlImagen ?? ''}
                alt={row.original.nombre}
              />
              <AvatarFallback>NO</AvatarFallback>
            </Avatar>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <img
              className="w-full h-48 object-cover rounded-md"
              src={row.original.urlImagen ?? ''}
              alt={row.original.nombre}
            />
            <h4 className="text-sm font-semibold mt-4">
              {row.original.nombre}
            </h4>
          </HoverCardContent>
        </HoverCard>
      );
    },
  },
  {
    id: 'actions',
    header: 'Acciones',
    cell: ({ row }) => {
      const combo = row.original;

      return (
        <div className="flex gap-x-2">
          <ProductosListDialog productos={combo.productos} />
          <EditComboDialog combo={combo} />
          <DeleteComboDialog comboId={combo.id} />
        </div>
      );
    },
  },
];

export const CombosTable = () => {
  const combos = useCombosStore((state) => state.combos);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data: combos,
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

  return (
    <div className="w-full">
      <div className="flex items-center py-4 gap-2">
        <Input
          placeholder="Filtrar por nombre..."
          value={(table.getColumn('nombre')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('nombre')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <AddComboDialog />
        <DataTableViewOptions table={table} />
      </div>
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
                  Sin platos registrados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* <UpdatePlatoDialog /> */}
    </div>
  );
};
