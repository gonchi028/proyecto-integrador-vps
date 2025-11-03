'use client';

import { useState } from 'react';
import { Pedido } from '@/store';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  ClockIcon,
  MapPinIcon,
  UserIcon,
  PhoneIcon,
  TruckIcon,
  UtensilsIcon,
  CheckCircleIcon,
  XCircleIcon,
  DollarSignIcon,
  CalendarIcon,
  HashIcon,
  AlertCircleIcon,
  CreditCardIcon,
  ReceiptIcon,
  Package2Icon
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PedidoDetailsDialogProps {
  pedido: Pedido;
  trigger: React.ReactNode;
}

export const PedidoDetailsDialog = ({ pedido, trigger }: PedidoDetailsDialogProps) => {
  const [open, setOpen] = useState(false);

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
    return dateObj.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

  const calculateSubtotal = () => {
    const productosTotal = (pedido.detalleProductos || []).reduce((sum, detalle) => 
      sum + (detalle.producto.precio * detalle.cantidad), 0
    );
    const combosTotal = (pedido.detalleCombos || []).reduce((sum, detalle) => 
      sum + (detalle.combo.precio * detalle.cantidad), 0
    );
    return productosTotal + combosTotal;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <DialogTitle className="flex items-center gap-3">
            <Badge variant="outline" className="text-xl font-bold px-4 py-2">
              <HashIcon className="h-5 w-5 mr-2" />
              Pedido #{pedido.id}
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
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClockIcon className="h-5 w-5" />
                  Cronología del Pedido
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <div>
                        <div className="font-medium">Pedido creado</div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(pedido.fechaHoraPedido)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatTime(pedido.fechaHoraPedido)}</div>
                      <div className="text-sm text-muted-foreground">
                        {getTimeElapsed(pedido.fechaHoraPedido)}
                      </div>
                    </div>
                  </div>

                  {pedido.fechaHoraEntrega && (
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        <div>
                          <div className="font-medium">Pedido entregado</div>
                          <div className="text-sm text-muted-foreground">
                            {formatDate(pedido.fechaHoraEntrega)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatTime(pedido.fechaHoraEntrega)}</div>
                        <div className="text-sm text-muted-foreground">
                          {getTimeElapsed(pedido.fechaHoraEntrega)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package2Icon className="h-5 w-5" />
                  Productos del Pedido
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Individual Products */}
                {pedido.detalleProductos && pedido.detalleProductos.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <UtensilsIcon className="h-4 w-4" />
                      Productos Individuales
                    </h4>
                    <div className="space-y-2">
                      {pedido.detalleProductos.map((detalle, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                              <UtensilsIcon className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <div>
                              <div className="font-medium">{detalle.producto.nombre}</div>
                              <div className="text-sm text-muted-foreground">
                                {detalle.producto.categoria} • {formatCurrency(detalle.producto.precio)}
                              </div>
                              {detalle.producto.descripcion && (
                                <div className="text-xs text-muted-foreground mt-1">
                                  {detalle.producto.descripcion}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-lg">×{detalle.cantidad}</div>
                            <div className="text-sm text-muted-foreground">
                              {formatCurrency(detalle.producto.precio * detalle.cantidad)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Combos */}
                {pedido.detalleCombos && pedido.detalleCombos.length > 0 && (
                  <div>
                    <Separator className="my-4" />
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Package2Icon className="h-4 w-4" />
                      Combos
                    </h4>
                    <div className="space-y-2">
                      {pedido.detalleCombos.map((detalle, index) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                <Package2Icon className="h-6 w-6 text-orange-600" />
                              </div>
                              <div>
                                <div className="font-medium">{detalle.combo.nombre}</div>
                                <div className="text-sm text-muted-foreground">
                                  Combo • {formatCurrency(detalle.combo.precio)}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-lg">×{detalle.cantidad}</div>
                              <div className="text-sm text-muted-foreground">
                                {formatCurrency(detalle.combo.precio * detalle.cantidad)}
                              </div>
                            </div>
                          </div>
                          {detalle.combo.productoCombo && (
                            <div className="ml-15 space-y-1">
                              <div className="text-xs text-muted-foreground mb-2">Incluye:</div>
                              {detalle.combo.productoCombo.map((pc, pcIndex) => (
                                <div key={pcIndex} className="text-sm text-muted-foreground flex items-center gap-2">
                                  <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                                  {pc.producto.nombre}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Customer & Payment Info */}
          <div className="space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5" />
                  Información del Cliente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Nombre</div>
                  <div className="font-semibold text-lg">{pedido.cliente?.nombre || 'No disponible'}</div>
                </div>
                
                {pedido.cliente?.celular && (
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Teléfono</div>
                    <div className="flex items-center gap-2">
                      <PhoneIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{pedido.cliente.celular}</span>
                    </div>
                  </div>
                )}

                {pedido.cliente?.nit && (
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">NIT</div>
                    <div className="font-medium">{pedido.cliente.nit}</div>
                  </div>
                )}

                {pedido.cliente?.razonSocial && (
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Razón Social</div>
                    <div className="font-medium">{pedido.cliente.razonSocial}</div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Location Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPinIcon className="h-5 w-5" />
                  Ubicación
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pedido.tipo === 'mesa' ? (
                  <div className="text-center p-6 bg-blue-50 rounded-lg">
                    <MapPinIcon className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-blue-600">
                      {pedido.mesa ? `Mesa ${pedido.mesa.numero}` : 'Sin mesa asignada'}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">Servicio en mesa</div>
                  </div>
                ) : (
                  <div className="text-center p-6 bg-orange-50 rounded-lg">
                    <TruckIcon className="h-12 w-12 text-orange-600 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-orange-600">Domicilio</div>
                    <div className="text-sm text-muted-foreground mt-1">Servicio a domicilio</div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Waiter Information */}
            {pedido.mesero && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserIcon className="h-5 w-5" />
                    Mesero Asignado
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={pedido.mesero.avatarUrl} />
                      <AvatarFallback className="text-lg font-semibold">
                        {pedido.mesero.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-lg">{pedido.mesero.name}</div>
                      <div className="text-sm text-muted-foreground">@{pedido.mesero.userName}</div>
                      <div className="text-sm text-muted-foreground">{pedido.mesero.email}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCardIcon className="h-5 w-5" />
                  Información de Pago
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="font-medium">{formatCurrency(calculateSubtotal())}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-green-600">{formatCurrency(pedido.total || 0)}</span>
                  </div>
                </div>

                {pedido.pago ? (
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircleIcon className="h-5 w-5 text-green-600" />
                      <span className="font-semibold text-green-800">Pagado</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Método:</span>
                        <span className="font-medium">{pedido.pago.tipo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Monto:</span>
                        <span className="font-medium">{formatCurrency(pedido.pago.monto)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Fecha:</span>
                        <span className="font-medium">
                          {formatTime(pedido.pago.fechaHora)} - {formatDate(pedido.pago.fechaHora)}
                        </span>
                      </div>
                      {pedido.pago.factura && (
                        <div className="mt-3 p-2 bg-white rounded border">
                          <div className="flex items-center gap-2 mb-1">
                            <ReceiptIcon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-xs font-medium uppercase tracking-wide">Factura</span>
                          </div>
                          <div className="text-xs space-y-1">
                            <div>NIT: {pedido.pago.factura.nit}</div>
                            <div>Razón Social: {pedido.pago.factura.razonSocial}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircleIcon className="h-5 w-5 text-red-600" />
                      <span className="font-semibold text-red-800">Pendiente de Pago</span>
                    </div>
                    <div className="text-sm text-red-700">
                      Este pedido aún no ha sido pagado
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 
