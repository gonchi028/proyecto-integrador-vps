'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Phone, Mail, MapPin, Copy, Check } from 'lucide-react';
import { type Proveedor } from '@/store/proveedor/proveedor-store';
import { UpdateProveedorDialog } from './update-proveedor-dialog';
import { DeleteProveedorDialog } from './delete-proveedor-dialog';
import { ProveedorProductsDialog } from './proveedor-products-dialog';
import { ManageProveedorProductsDialog } from './manage-proveedor-products-dialog';
import { DataTableViewOptions } from '@/components/shared/data-table-view-options';
import { DataTableColumnHeader } from '@/components/shared/data-table-column-header';

interface ProveedoresTableProps {
  data: Proveedor[];
}

export const ProveedoresTable = ({ data }: ProveedoresTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const copyToClipboard = async (text: string, id: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Error copying to clipboard:', err);
    }
  };

  const columns: ColumnDef<Proveedor>[] = [
    {
      accessorKey: 'id',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('id')}</div>
      ),
    },
    {
      accessorKey: 'nombre',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nombre" />
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('nombre')}</div>
      ),
    },
    {
      accessorKey: 'celular',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Celular" />
      ),
      cell: ({ row }) => {
        const celular = row.getValue('celular') as string | null;
        return celular ? (
          <div className="flex items-center">
            <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
            {celular}
          </div>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      },
    },
    {
      accessorKey: 'telefono',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Teléfono" />
      ),
      cell: ({ row }) => {
        const telefono = row.getValue('telefono') as string | null;
        return telefono ? (
          <div className="flex items-center">
            <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
            {telefono}
          </div>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      },
    },
    {
      accessorKey: 'correo',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Correo" />
      ),
      cell: ({ row }) => {
        const correo = row.getValue('correo') as string | null;
        return correo ? (
          <div className="flex items-center">
            <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
            {correo}
          </div>
        ) : (
          <span className="text-muted-foreground">-</span>
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
        return direccion ? (
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
            {direccion}
          </div>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      },
    },
    {
      id: 'productos',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Productos" />
      ),
      cell: ({ row }) => {
        const proveedor = row.original;
        return (
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {proveedor.productos.length} productos
            </Badge>
            {proveedor.productos.length > 0 && (
              <ProveedorProductsDialog proveedor={proveedor} />
            )}
          </div>
        );
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const proveedor = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menú</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => copyToClipboard(proveedor.id.toString(), proveedor.id)}
                className="cursor-pointer"
              >
                {copiedId === proveedor.id ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copiar ID
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <ProveedorProductsDialog proveedor={proveedor} />
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <ManageProveedorProductsDialog 
                  proveedor={proveedor}
                  trigger={
                    <div className="flex items-center w-full">
                      <MoreHorizontal className="mr-2 h-4 w-4" />
                      Administrar Productos
                    </div>
                  }
                />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    {
      id: 'edit',
      enableHiding: false,
      cell: ({ row }) => {
        const proveedor = row.original;
        return <UpdateProveedorDialog proveedor={proveedor} />;
      },
    },
    {
      id: 'manage',
      enableHiding: false,
      cell: ({ row }) => {
        const proveedor = row.original;
        return (
          <ManageProveedorProductsDialog 
            proveedor={proveedor}
            trigger={
              <Button variant="outline" size="sm">
                Administrar
              </Button>
            }
          />
        );
      },
    },
    {
      id: 'delete',
      enableHiding: false,
      cell: ({ row }) => {
        const proveedor = row.original;
        return <DeleteProveedorDialog proveedor={proveedor} />;
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filtrar proveedores..."
          value={(table.getColumn('nombre')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('nombre')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
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
                  className="h-24 text-center"
                >
                  No se encontraron resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} de{' '}
          {table.getFilteredRowModel().rows.length} fila(s) seleccionada(s).
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}; 
