'use client';

import { useState, useMemo } from 'react';
import { usePedidosStore, Pedido } from '@/store';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ClockIcon,
  SearchIcon,
  MapPinIcon,
  UserIcon,
  CreditCardIcon,
  TruckIcon,
  UtensilsIcon,
  MoreVerticalIcon,
  CheckCircleIcon,
  XCircleIcon,
  DollarSignIcon,
  PhoneIcon,
  HashIcon,
  CalendarIcon,
  AlertCircleIcon
} from 'lucide-react';
import { AddPedidoDialog } from './add-pedido-dialog';
import { PedidoDetailsDialog } from './pedido-details-dialog';
import { ProcesarPagoDialog } from './procesar-pago-dialog';
import { AsignarMesa } from './asignar-mesa';
import { AsignarMeseroDialog } from './asignar-mesero';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

type StatusFilter = 'todos' | 'pendiente' | 'en camino' | 'listo para recoger' | 'entregado' | 'cancelado';
type PaymentFilter = 'todos' | 'pagado' | 'sin-pagar';

export const PedidosTabs = () => {
  const router = useRouter();
  const pedidosLocal = usePedidosStore((state) => state.pedidosLocal);
  const pedidosDomicilio = usePedidosStore((state) => state.pedidosDomicilio);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('todos');
  const [paymentFilter, setPaymentFilter] = useState<PaymentFilter>('sin-pagar');
  const [selectedOrderType, setSelectedOrderType] = useState<'local' | 'domicilio'>('local');

  // Get all pedidos combined
  const allPedidos = useMemo(() => [...pedidosLocal, ...pedidosDomicilio], [pedidosLocal, pedidosDomicilio]);

  // Filter pedidos based on type, search, status, and payment
  const filteredPedidos = useMemo(() => {
    return allPedidos.filter((pedido) => {
      // Filter by order type
      if (selectedOrderType === 'local' && pedido.tipo !== 'mesa') return false;
      if (selectedOrderType === 'domicilio' && pedido.tipo !== 'domicilio') return false;

      // Filter by search term
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          pedido.id.toString().includes(searchLower) ||
          (pedido.cliente?.nombre.toLowerCase().includes(searchLower)) ||
          (pedido.mesa?.numero.toString().includes(searchLower)) ||
          (pedido.cliente?.celular?.includes(searchTerm));
        
        if (!matchesSearch) return false;
      }

      // Filter by status
      if (statusFilter !== 'todos' && pedido.estado !== statusFilter) return false;

      // Filter by payment status
      if (paymentFilter === 'pagado' && !pedido.pago) return false;
      if (paymentFilter === 'sin-pagar' && pedido.pago) return false;

      return true;
    });
  }, [allPedidos, selectedOrderType, searchTerm, statusFilter, paymentFilter]);

  // Statistics
  const stats = useMemo(() => {
    const currentTypePedidos = allPedidos.filter((p) => 
      selectedOrderType === 'local' ? p.tipo === 'mesa' : p.tipo === 'domicilio'
    );

    return {
      total: currentTypePedidos.length,
      pendiente: currentTypePedidos.filter((p) => p.estado === 'pendiente').length,
      enCamino: currentTypePedidos.filter((p) => p.estado === 'en camino').length,
      listos: currentTypePedidos.filter((p) => p.estado === 'listo para recoger').length,
      entregados: currentTypePedidos.filter((p) => p.estado === 'entregado').length,
      sinPagar: currentTypePedidos.filter((p) => !p.pago).length,
      totalValue: currentTypePedidos.reduce((sum, p) => sum + (p.total || 0), 0)
    };
  }, [allPedidos, selectedOrderType]);

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'pendiente': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'en camino': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'listo para recoger': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'entregado': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelado': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case 'pendiente': return <ClockIcon className="h-4 w-4" />;
      case 'en camino': return <TruckIcon className="h-4 w-4" />;
      case 'listo para recoger': return <CheckCircleIcon className="h-4 w-4" />;
      case 'entregado': return <CheckCircleIcon className="h-4 w-4" />;
      case 'cancelado': return <XCircleIcon className="h-4 w-4" />;
      default: return <ClockIcon className="h-4 w-4" />;
    }
  };

  const formatTime = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB',
    }).format(amount);
  };

  const getTimeElapsed = (date: Date | string) => {
    const orderTime = typeof date === 'string' ? new Date(date) : date;
    return formatDistanceToNow(orderTime, { 
      addSuffix: true, 
      locale: es 
    });
  };

  const OrderCard = ({ pedido }: { pedido: Pedido }) => (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-lg cursor-pointer",
      pedido.estado === 'pendiente' && "border-l-4 border-l-yellow-500",
      pedido.estado === 'en camino' && "border-l-4 border-l-blue-500",
      pedido.estado === 'listo para recoger' && "border-l-4 border-l-purple-500",
      pedido.estado === 'entregado' && "border-l-4 border-l-green-500",
      pedido.estado === 'cancelado' && "border-l-4 border-l-red-500"
    )}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 flex-wrap">
            <Badge variant="outline" className="text-xl font-bold px-4 py-2">
              <HashIcon className="h-5 w-5 mr-2" />
              #{pedido.id}
            </Badge>
            <Badge className={cn("border text-sm px-3 py-1", getStatusColor(pedido.estado))}>
              {getStatusIcon(pedido.estado)}
              <span className="ml-2 capitalize font-medium">{pedido.estado}</span>
            </Badge>
            {!pedido.pago && (
              <Badge variant="destructive" className="px-3 py-1">
                <AlertCircleIcon className="h-4 w-4 mr-2" />
                Sin Pagar
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Tiempo</div>
              <div className="text-sm font-medium">
                {getTimeElapsed(pedido.fechaHoraPedido)}
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVerticalIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <PedidoDetailsDialog
                  pedido={pedido}
                  trigger={
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <UtensilsIcon className="h-4 w-4 mr-2" />
                      Ver Detalles Completos
                    </DropdownMenuItem>
                  }
                />
                <DropdownMenuItem onClick={() => router.push(`/dashboard/pedidos/ordenar/${pedido.id}`)}>
                  <UtensilsIcon className="h-4 w-4 mr-2" />
                  Editar Orden
                </DropdownMenuItem>
                {!pedido.pago && (
                  <ProcesarPagoDialog
                    pedido={pedido}
                    trigger={
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <DollarSignIcon className="h-4 w-4 mr-2" />
                        Procesar Pago
                      </DropdownMenuItem>
                    }
                  />
                )}

                <DropdownMenuItem className="text-red-600">
                  <XCircleIcon className="h-4 w-4 mr-2" />
                  Cancelar Pedido
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Customer & Location Info */}
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Cliente</div>
              <div className="flex items-center gap-2">
                <UserIcon className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold text-lg">{pedido.cliente?.nombre || 'Cliente no disponible'}</span>
              </div>
            </div>
            {pedido.cliente?.celular && (
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Teléfono</div>
                <div className="flex items-center gap-2">
                  <PhoneIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{pedido.cliente.celular}</span>
                </div>
              </div>
            )}
          </div>

          <div className="text-right">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Ubicación</div>
            {pedido.tipo === 'mesa' ? (
              <div className="flex items-center gap-2 justify-end">
                <MapPinIcon className="h-5 w-5 text-blue-600" />
                <span className="font-bold text-xl text-blue-600">
                  {pedido.mesa ? `Mesa ${pedido.mesa.numero}` : 'Sin mesa'}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 justify-end">
                <TruckIcon className="h-5 w-5 text-orange-600" />
                <span className="font-bold text-xl text-orange-600">Domicilio</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions & Order Summary */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Items del pedido</div>
              <div className="text-sm text-muted-foreground">
                {(pedido.detalleProductos?.length || 0) + (pedido.detalleCombos?.length || 0)} productos
              </div>
            </div>
            <PedidoDetailsDialog
              pedido={pedido}
              trigger={
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:text-blue-700"
                >
                  Ver detalles →
                </Button>
              }
            />
          </div>

          {/* Assignment Actions */}
          <div className={cn(
            "grid gap-3",
            pedido.tipo === 'mesa' ? "grid-cols-2" : "grid-cols-1"
          )}>
            {pedido.tipo === 'mesa' && (
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground uppercase tracking-wide">Mesa</div>
                <div className="flex items-center gap-2">
                  {pedido.mesa ? (
                    <Badge variant="secondary" className="text-sm px-3 py-1">
                      Mesa {pedido.mesa.numero}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-sm px-3 py-1 text-yellow-600 border-yellow-600">
                      Sin mesa
                    </Badge>
                  )}
                  <AsignarMesa pedido={pedido} mesaId={pedido.mesa?.id ?? 0} />
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground uppercase tracking-wide">
                {pedido.tipo === 'mesa' ? 'Mesero' : 'Repartidor'}
              </div>
              <div className="flex items-center gap-2">
                {pedido.mesero ? (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={pedido.mesero.avatarUrl} />
                      <AvatarFallback className="text-xs">
                        {pedido.mesero.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{pedido.mesero.name}</span>
                  </div>
                ) : (
                  <Badge variant="outline" className="text-sm px-3 py-1 text-yellow-600 border-yellow-600">
                    {pedido.tipo === 'mesa' ? 'Sin mesero' : 'Sin repartidor'}
                  </Badge>
                )}
                <AsignarMeseroDialog
                  pedidoId={pedido.id}
                  meseroId={pedido.mesero?.id ?? ''}
                />
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Footer with total and actions */}
        <div className="flex items-end justify-between">
          <div className="space-y-2">
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Hora del pedido</div>
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {formatTime(pedido.fechaHoraPedido)}
                </span>
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Total</div>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(pedido.total || 0)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {pedido.mesero && (
              <div className="text-center">
                <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Mesero</div>
                <Avatar className="h-10 w-10 mx-auto">
                  <AvatarImage src={pedido.mesero.avatarUrl} />
                  <AvatarFallback className="text-xs font-semibold">
                    {pedido.mesero.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
            )}
            <div className="text-center">
              <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                {pedido.pago ? 'Estado' : 'Acción'}
              </div>
              {pedido.pago ? (
                <Button
                  size="lg"
                  variant="default"
                  className="px-6 py-2 bg-green-600 hover:bg-green-700"
                  disabled
                >
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  Pagado
                </Button>
              ) : (
                <ProcesarPagoDialog
                  pedido={pedido}
                  trigger={
                    <Button
                      size="lg"
                      variant="outline"
                      className="px-6 py-2 border-2 hover:bg-blue-50"
                    >
                      <CreditCardIcon className="h-4 w-4 mr-2" />
                      Procesar Pago
                    </Button>
                  }
                />
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header with Statistics */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gestión de Pedidos</h1>
            <p className="text-muted-foreground">Sistema de gestión integral de órdenes</p>
          </div>
          <AddPedidoDialog />
        </div>

                {/* Statistics Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stats.total}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Total Pedidos</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">{stats.pendiente}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Pendientes</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stats.enCamino}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">En Camino</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{stats.listos}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Listos</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{stats.entregados}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Entregados</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">{stats.sinPagar}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Sin Pagar</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="text-xl font-bold text-green-600 mb-2">{formatCurrency(stats.totalValue)}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Valor Total</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Order Type Tabs */}
      <Tabs value={selectedOrderType} onValueChange={(value) => setSelectedOrderType(value as 'local' | 'domicilio')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="local" className="flex items-center gap-2">
            <MapPinIcon className="h-4 w-4" />
            Pedidos en Mesa
          </TabsTrigger>
          <TabsTrigger value="domicilio" className="flex items-center gap-2">
            <TruckIcon className="h-4 w-4" />
            Pedidos a Domicilio
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedOrderType} className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por ID, cliente, mesa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              
                             <select
                 value={statusFilter}
                 onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                 className="px-3 py-2 border rounded-md text-sm"
               >
                 <option value="todos">Todos los estados</option>
                 <option value="pendiente">Pendientes</option>
                 <option value="en camino">En camino</option>
                 <option value="listo para recoger">Listos</option>
                 <option value="entregado">Entregados</option>
                 <option value="cancelado">Cancelados</option>
               </select>

              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value as PaymentFilter)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="todos">Estado de pago</option>
                <option value="pagado">Pagados</option>
                <option value="sin-pagar">Sin pagar</option>
              </select>
            </div>

            <div className="text-sm text-muted-foreground">
              Mostrando {filteredPedidos.length} de {stats.total} pedidos
            </div>
          </div>

          {/* Orders Grid */}
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredPedidos.map((pedido) => (
              <OrderCard key={pedido.id} pedido={pedido} />
            ))}
          </div>

          {filteredPedidos.length === 0 && (
            <Card className="p-12">
              <div className="text-center text-muted-foreground">
                <UtensilsIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No hay pedidos</h3>
                <p>No se encontraron pedidos que coincidan con los filtros seleccionados</p>
              </div>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}; 
