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

import { MoreHorizontal, RefreshCw } from 'lucide-react';
import { AddPlatoDialog } from './add-plato-dialog';
import { Producto, usePlatosStore } from '@/store/platos/platos-store';
import { DataTableColumnHeader } from '../shared/data-table-column-header';
import { DataTableViewOptions } from '../shared/data-table-view-options';
import { deletePlato } from '@/server/product-queries';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UpdatePlatoDialog } from './update-plato-dialog';
import { useLoadingStore } from '@/store';
import { toast } from 'sonner';
import { useProductos } from '@/hooks';

const columns: ColumnDef<Producto>[] = [
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
    accessorKey: 'descripcion',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Descripcion" />
    ),
  },
  { accessorKey: 'categoria', header: 'Categoría' },
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
  { accessorKey: 'tipo', header: 'Tipo' },
  {
    accessorKey: 'urlImagen',
    header: 'Imagen',
    cell: ({ row }) => {
      return (
        <HoverCard>
          <HoverCardTrigger asChild>
            <Avatar>
              <AvatarImage
                src={row.original.urlImagen}
                alt={row.original.nombre}
              />
              <AvatarFallback>NO</AvatarFallback>
            </Avatar>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <img
              className="w-full h-48 object-cover rounded-md"
              src={row.original.urlImagen}
              alt={row.original.nombre}
            />
            <h4 className="text-sm font-semibold mt-4">
              {row.original.nombre}
            </h4>
            <p className="text-sm mt-1">{row.original.descripcion}</p>
          </HoverCardContent>
        </HoverCard>
      );
    },
  },
  {
    id: 'actions',
    header: 'Acciones',
    cell: ({ row }) => {
      const plato = row.original;
      const setPlatoToUpdate = usePlatosStore(
        (state) => state.setPlatoToUpdate
      );
      const setOpenUpdateDialog = usePlatosStore(
        (state) => state.setOpenUpdateDialog
      );

      const deletePlatoFromStore = usePlatosStore(
        (state) => state.deletePLatoFromStore
      );

      const showLoading = useLoadingStore((state) => state.showLoading);
      const hideLoading = useLoadingStore((state) => state.hideLoading);

      const borrarPlato = async (id: number) => {
        showLoading('Eliminando plato...');
        try {
          await deletePlato(id);
          deletePlatoFromStore(id);
          toast('Operacion exitosa!', {
            description: 'El plato fue eliminado correctamente',
          });
        } catch (error) {
          toast('Error!', {
            description: 'No se pudo eliminar el plato',
          });
        } finally {
          hideLoading();
        }
      };

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
              onClick={() => navigator.clipboard.writeText(plato.id.toString())}
            >
              Copiar ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                setPlatoToUpdate(plato);
                setOpenUpdateDialog(true);
              }}
            >
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => borrarPlato(plato.id)}>
              <span className="text-red-600">Eliminar</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const PlatosTable = () => {
  useProductos();
  
  const platosStore = usePlatosStore((state) => state.platos);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data: platosStore,
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
    </div>
  );
};
