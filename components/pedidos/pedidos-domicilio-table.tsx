'use client';

import { useState, useMemo } from 'react';
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
import { DollarSignIcon, UtensilsIcon, MapPinIcon } from 'lucide-react';
import { DataTableColumnHeader } from '../shared/data-table-column-header';
import { DataTableViewOptions } from '../shared/data-table-view-options';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Pedido, usePedidosStore } from '@/store';
import { cn } from '@/lib/utils';
import { Mesero, Pago } from '../../store/pedidos/pedidos-store';
import { Cliente } from '@/store/cliente/cliente-store';
import { AddPedidoDialog } from './add-pedido-dialog';
import { AsignarMeseroDialog } from './asignar-mesero';
import { ProcesarPagoDialog } from './procesar-pago-dialog';
import { useRouter } from 'next/navigation';

const columns: ColumnDef<Pedido>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
  },
  {
    accessorKey: 'estado',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" />
    ),
    cell: ({ row }) => {
      const estado = row.getValue<string>('estado');

      return (
        <span
          className={cn(
            'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset',
            estado === 'pendiente' &&
              'bg-yellow-100 text-yellow-700 ring-yellow-600/20',
            estado === 'entregado' &&
              'bg-green-100 text-green-700 ring-green-600/20',
            estado === 'cancelado' && 'bg-red-100 text-red-700 ring-red-600/20',
            estado === 'en camino' &&
              'bg-blue-100 text-blue-700 ring-blue-600/20',
            estado === 'listo para recoger' &&
              'bg-purple-100 text-purple-700 ring-purple-600/20'
          )}
        >
          {estado}
        </span>
      );
    },
  },
  {
    accessorKey: 'fechaHoraPedido',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Hora Pedido" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('fechaHoraPedido'));
      return (
        <div>
          <p className="text-sm/6 text-gray-900 font-medium">
            {date.toLocaleTimeString()}
          </p>
          <p className="text-xs/5 text-gray-500">{date.toLocaleDateString()}</p>
        </div>
      );
    },
  },
  {
    accessorKey: 'fechaHoraEntrega',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Hora Entrega" />
    ),
    cell: ({ row }) => {
      if (row.getValue('fechaHoraEntrega') === null) {
        return (
          <span className="text-gray-400 text-sm">Por definir</span>
        );
      }

      const date = new Date(row.getValue('fechaHoraEntrega'));
      return (
        <div>
          <p className="text-sm/6 text-gray-900 font-medium">
            {date.toLocaleTimeString()}
          </p>
          <p className="text-xs/5 text-gray-500">{date.toLocaleDateString()}</p>
        </div>
      );
    },
  },
  {
    accessorKey: 'cliente',
    header: 'Cliente',
    cell: ({ row }) => {
      const cliente = row.getValue<Cliente>('cliente');
      return (
        <HoverCard>
          <HoverCardTrigger asChild>
            <span className="cursor-pointer hover:underline">{cliente.nombre}</span>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="min-w-0">
              <div className="flex items-start gap-x-3">
                <p className="text-sm/6 font-semibold text-gray-900">
                  {cliente.nombre}
                </p>
                {!!cliente.celular && (
                  <p className="mt-0.5 whitespace-nowrap rounded-md bg-sky-50 px-1.5 py-0.5 text-xs font-medium text-sky-700 ring-1 ring-inset ring-sky-600/20">
                    {cliente.celular}
                  </p>
                )}
              </div>
              <div className="mt-2">
                {cliente.direccion && (
                  <div className="flex items-center gap-x-2 text-xs/5 text-gray-500 mb-1">
                    <MapPinIcon className="h-3 w-3" />
                    <p className="truncate">{cliente.direccion}</p>
                  </div>
                )}
                {cliente.notasEntrega && (
                  <div className="text-xs/5 text-gray-500">
                    <p className="font-medium">Notas de entrega:</p>
                    <p className="truncate">{cliente.notasEntrega}</p>
                  </div>
                )}
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      );
    },
  },
  {
    accessorKey: 'mesero',
    header: 'Repartidor',
    cell: ({ row }) => {
      const mesero = row.getValue<Mesero | null>('mesero');
      if (mesero === null) {
        return (
          <span className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset bg-yellow-100 text-yellow-700 ring-yellow-600/20">
            Sin asignar
          </span>
        );
      }
      return (
        <HoverCard>
          <HoverCardTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarImage src={mesero.avatarUrl} alt={mesero.name} />
              <AvatarFallback>NO</AvatarFallback>
            </Avatar>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="flex min-w-0 gap-x-4">
              <Avatar className="size-12">
                <AvatarImage src={mesero.avatarUrl} alt={mesero.name} />
                <AvatarFallback>NA</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-auto">
                <p className="text-sm/6 font-semibold text-gray-900">
                  <span className="">{mesero.name}</span>
                </p>
                <p className="mt-1 flex text-xs/5 text-gray-500">
                  <span className="truncate">{mesero.email}</span>
                </p>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      );
    },
  },
  {
    accessorKey: 'total',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total" />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('total'));
      const formatted = new Intl.NumberFormat('es-BO', {
        style: 'currency',
        currency: 'BOB',
      }).format(amount);

      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: 'pago',
    header: 'Pago',
    cell: ({ row }) => {
      const pagoId = row.getValue<Pago | null>('pago');
      if (pagoId === null) {
        return (
          <span className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset bg-yellow-100 text-yellow-700 ring-yellow-600/20">
            Sin pagar
          </span>
        );
      }
      return (
        <span className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset bg-green-100 text-green-700 ring-green-600/20">
          Pagado
        </span>
      );
    },
  },
  {
    id: 'actions',
    header: 'Acciones',
    cell: ({ row }) => {
      const pedido = row.original;
      const router = useRouter();

      return (
        <div className="flex gap-1">
          <AsignarMeseroDialog
            pedidoId={pedido.id}
            meseroId={pedido.mesero?.id ?? ''}
          />
          <Button
            onClick={() =>
              router.push(`/dashboard/pedidos/ordenar/${pedido.id}`)
            }
            variant="outline"
            size="icon"
            title="Ordenar productos"
          >
            <UtensilsIcon className="h-4 w-4" />
          </Button>
                          <ProcesarPagoDialog 
                  pedido={pedido} 
                  trigger={
                    <Button variant="outline" size="icon">
                      <DollarSignIcon className="h-4 w-4" />
                    </Button>
                  }
                />
        </div>
      );
    },
  },
];

export const PedidosDomicilioTable = () => {
  const pedidosDomicilio = usePedidosStore((state) => state.pedidosDomicilio);
  const [filterPago, setFilterPago] = useState<'todos' | 'pagado' | 'sin-pagar'>('sin-pagar');

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  // Memoize filter calculations to prevent infinite loops
  const filterCounts = useMemo(() => {
    const total = pedidosDomicilio.length;
    const pagados = pedidosDomicilio.filter(p => p.pago !== null).length;
    const sinPagar = pedidosDomicilio.filter(p => p.pago === null).length;
    return { total, pagados, sinPagar };
  }, [pedidosDomicilio]);

  // Filter pedidos based on payment status
  const filteredPedidos = useMemo(() => {
    return pedidosDomicilio.filter((pedido) => {
      if (filterPago === 'todos') return true;
      if (filterPago === 'pagado') return pedido.pago !== null;
      if (filterPago === 'sin-pagar') return pedido.pago === null;
      return true;
    });
  }, [pedidosDomicilio, filterPago]);

  const getButtonVariant = (filter: 'todos' | 'pagado' | 'sin-pagar') => {
    if (filterPago === filter) return 'default';
    return 'outline';
  };

  const getButtonColor = (filter: 'todos' | 'pagado' | 'sin-pagar') => {
    switch (filter) {
      case 'pagado':
        return 'border-green-600 text-green-600 hover:bg-green-50';
      case 'sin-pagar':
        return 'border-yellow-600 text-yellow-600 hover:bg-yellow-50';
      default:
        return '';
    }
  };

  const table = useReactTable({
    data: filteredPedidos,
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

  return (
    <div>
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <AddPedidoDialog />
          <DataTableViewOptions table={table} />
        </div>
        <div className="flex gap-2">
          <Button
            variant={getButtonVariant('todos')}
            size="sm"
            onClick={() => setFilterPago('todos')}
            className={cn(
              getButtonVariant('todos') === 'outline' && getButtonColor('todos')
            )}
          >
            Todos ({filterCounts.total})
          </Button>
          <Button
            variant={getButtonVariant('pagado')}
            size="sm"
            onClick={() => setFilterPago('pagado')}
            className={cn(
              getButtonVariant('pagado') === 'outline' && getButtonColor('pagado')
            )}
          >
            Pagados ({filterCounts.pagados})
          </Button>
          <Button
            variant={getButtonVariant('sin-pagar')}
            size="sm"
            onClick={() => setFilterPago('sin-pagar')}
            className={cn(
              getButtonVariant('sin-pagar') === 'outline' && getButtonColor('sin-pagar')
            )}
          >
            Sin Pagar ({filterCounts.sinPagar})
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
                  {filterPago === 'todos' 
                    ? 'Sin pedidos de domicilio registrados.'
                    : filterPago === 'pagado'
                    ? 'Sin pedidos de domicilio pagados.'
                    : 'Sin pedidos de domicilio sin pagar.'
                  }
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
