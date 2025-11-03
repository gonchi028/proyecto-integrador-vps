'use client';

import { useEffect, useState, useMemo } from 'react';
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

import { MoreHorizontal } from 'lucide-react';
import { DataTableColumnHeader } from '../shared/data-table-column-header';
import { DataTableViewOptions } from '../shared/data-table-view-options';
import { useLoadingStore } from '@/store';
import { toast } from 'sonner';
import { UpdateReservaDialog } from './update-reserva-dialog';
import { AddReservaDialog } from './add-reserva-dialog';
import { Reserva, useReservasStore } from '@/store/reservas/reservas-store';
import { deleteReserva } from '@/server/queries/reservas-queries';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const columns: ColumnDef<Reserva>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
  },
  {
    id: 'cliente',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cliente" />
    ),
    cell: ({ row }) => {
      const cliente = row.original.cliente;
      return cliente ? cliente.nombre : 'N/A';
    },
    accessorFn: (row) => row.cliente?.nombre || 'N/A',
  },
  {
    accessorKey: 'fechaHora',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha y Hora" />
    ),
    cell: ({ row }) => {
      const fechaHora = row.getValue('fechaHora') as Date;
      return format(new Date(fechaHora), 'dd/MM/yyyy HH:mm', { locale: es });
    },
  },
  {
    accessorKey: 'mesa',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mesa" />
    ),
  },
  {
    accessorKey: 'cantidadPersonas',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Personas" />
    ),
  },
  {
    accessorKey: 'estado',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" />
    ),
    cell: ({ row }) => {
      const estado = row.getValue('estado') as string;
      const getEstadoColor = (estado: string) => {
        switch (estado) {
          case 'pendiente':
            return 'bg-yellow-600';
          case 'confirmada':
            return 'bg-green-600';
          case 'cancelada':
            return 'bg-red-600';
          case 'utilizada':
            return 'bg-blue-600';
          case 'no asistio':
            return 'bg-gray-600';
          default:
            return 'bg-gray-600';
        }
      };
      
      return (
        <Badge className={getEstadoColor(estado)}>
          {estado}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    header: 'Acciones',
    cell: ({ row }) => {
      const reserva = row.original;

      const setReservaToUpdate = useReservasStore(
        (state) => state.setReservaToUpdate
      );
      const setOpenReservaDialog = useReservasStore(
        (state) => state.setOpenUpdateDialog
      );

      const deleteReservaFromStore = useReservasStore(
        (state) => state.deleteReservaFromStore
      );

      const showLoading = useLoadingStore((state) => state.showLoading);
      const hideLoading = useLoadingStore((state) => state.hideLoading);

      const eliminarReserva = async (id: number) => {
        showLoading('Eliminando reserva...');
        await deleteReserva(id);
        hideLoading();
        deleteReservaFromStore(id);
        toast('Operacion exitosa!', {
          description: 'La reserva fue eliminada correctamente',
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
              onClick={() => navigator.clipboard.writeText(reserva.id.toString())}
            >
              Copiar ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => {
              setReservaToUpdate(reserva);
              setOpenReservaDialog(true);
            }}>Editar</DropdownMenuItem>
            <DropdownMenuItem onClick={() => eliminarReserva(reserva.id)}>
              <span className="text-red-600">Eliminar</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

type Props = {
  reservas: Reserva[];
};

export const ReservasTable = ({ reservas }: Props) => {
  const reservasStore = useReservasStore((state) => state.reservas);
  const setReservas = useReservasStore((state) => state.setReservas);
  const [filterEstado, setFilterEstado] = useState<'todos' | 'pendiente' | 'confirmada' | 'cancelada' | 'utilizada' | 'no asistio'>('pendiente');

  useEffect(() => {
    setReservas(reservas);
  }, []);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  // Memoize filter calculations to prevent infinite loops
  const filterCounts = useMemo(() => {
    const total = reservasStore.length;
    const pendiente = reservasStore.filter(r => r.estado === 'pendiente').length;
    const confirmada = reservasStore.filter(r => r.estado === 'confirmada').length;
    const cancelada = reservasStore.filter(r => r.estado === 'cancelada').length;
    const utilizada = reservasStore.filter(r => r.estado === 'utilizada').length;
    const noAsistio = reservasStore.filter(r => r.estado === 'no asistio').length;
    return { total, pendiente, confirmada, cancelada, utilizada, noAsistio };
  }, [reservasStore]);

  // Filter reservas based on estado
  const filteredReservas = useMemo(() => {
    return reservasStore.filter((reserva) => {
      if (filterEstado === 'todos') return true;
      return reserva.estado === filterEstado;
    });
  }, [reservasStore, filterEstado]);

  const getButtonVariant = (filter: 'todos' | 'pendiente' | 'confirmada' | 'cancelada' | 'utilizada' | 'no asistio') => {
    if (filterEstado === filter) return 'default';
    return 'outline';
  };

  const getButtonColor = (filter: 'todos' | 'pendiente' | 'confirmada' | 'cancelada' | 'utilizada' | 'no asistio') => {
    switch (filter) {
      case 'pendiente':
        return 'border-yellow-600 text-yellow-600 hover:bg-yellow-50';
      case 'confirmada':
        return 'border-green-600 text-green-600 hover:bg-green-50';
      case 'cancelada':
        return 'border-red-600 text-red-600 hover:bg-red-50';
      case 'utilizada':
        return 'border-blue-600 text-blue-600 hover:bg-blue-50';
      case 'no asistio':
        return 'border-gray-600 text-gray-600 hover:bg-gray-50';
      default:
        return '';
    }
  };

  const table = useReactTable({
    data: filteredReservas,
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
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Filtrar por cliente..."
            value={(table.getColumn('cliente')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('cliente')?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <AddReservaDialog />
          <DataTableViewOptions table={table} />
        </div>
        <div className="flex gap-2">
          <Button
            variant={getButtonVariant('todos')}
            size="sm"
            onClick={() => setFilterEstado('todos')}
            className={cn(
              getButtonVariant('todos') === 'outline' && getButtonColor('todos')
            )}
          >
            Todos ({filterCounts.total})
          </Button>
          <Button
            variant={getButtonVariant('pendiente')}
            size="sm"
            onClick={() => setFilterEstado('pendiente')}
            className={cn(
              getButtonVariant('pendiente') === 'outline' && getButtonColor('pendiente')
            )}
          >
            Pendientes ({filterCounts.pendiente})
          </Button>
          <Button
            variant={getButtonVariant('confirmada')}
            size="sm"
            onClick={() => setFilterEstado('confirmada')}
            className={cn(
              getButtonVariant('confirmada') === 'outline' && getButtonColor('confirmada')
            )}
          >
            Confirmadas ({filterCounts.confirmada})
          </Button>
          <Button
            variant={getButtonVariant('cancelada')}
            size="sm"
            onClick={() => setFilterEstado('cancelada')}
            className={cn(
              getButtonVariant('cancelada') === 'outline' && getButtonColor('cancelada')
            )}
          >
            Canceladas ({filterCounts.cancelada})
          </Button>
          <Button
            variant={getButtonVariant('utilizada')}
            size="sm"
            onClick={() => setFilterEstado('utilizada')}
            className={cn(
              getButtonVariant('utilizada') === 'outline' && getButtonColor('utilizada')
            )}
          >
            Utilizadas ({filterCounts.utilizada})
          </Button>
          <Button
            variant={getButtonVariant('no asistio')}
            size="sm"
            onClick={() => setFilterEstado('no asistio')}
            className={cn(
              getButtonVariant('no asistio') === 'outline' && getButtonColor('no asistio')
            )}
          >
            No Asistió ({filterCounts.noAsistio})
          </Button>
        </div>
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
                  {filterEstado === 'todos' 
                    ? 'Sin reservas registradas.'
                    : filterEstado === 'pendiente'
                    ? 'Sin reservas pendientes.'
                    : filterEstado === 'confirmada'
                    ? 'Sin reservas confirmadas.'
                    : filterEstado === 'cancelada'
                    ? 'Sin reservas canceladas.'
                    : filterEstado === 'utilizada'
                    ? 'Sin reservas utilizadas.'
                    : 'Sin reservas de no asistió.'
                  }
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <UpdateReservaDialog />
    </div>
  );
}; 
