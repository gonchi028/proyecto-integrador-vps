'use client';

import { useState } from 'react';
import { Pedido } from '@/store';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  CreditCardIcon,
  DollarSignIcon,
  ReceiptIcon,
  CheckCircleIcon,
  HashIcon,
  AlertCircleIcon
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { procesarPago } from '@/server/queries/pedidos-queries';
import { usePedidosStore } from '@/store/pedidos/pedidos-store';

interface ProcesarPagoDialogProps {
  pedido: Pedido;
  trigger: React.ReactNode;
}

export const ProcesarPagoDialog = ({ pedido, trigger }: ProcesarPagoDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [metodoPago, setMetodoPago] = useState<string>('');
  const [montoRecibido, setMontoRecibido] = useState<string>('');
  
  // Factura fields
  const [emitirFactura, setEmitirFactura] = useState(false);
  const [nitFactura, setNitFactura] = useState('');
  const [razonSocial, setRazonSocial] = useState('');

  // Store functions
  const updatePedidoInStore = usePedidosStore((state) => state.updatePedidoInStore);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB',
    }).format(amount);
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

  const totalPedido = pedido.total || calculateSubtotal();
  const montoRecibidoNum = parseFloat(montoRecibido) || 0;
  const cambio = montoRecibidoNum - totalPedido;

  const handleProcesarPago = async () => {
    if (!metodoPago) {
      toast.error('Selecciona un método de pago');
      return;
    }

    if (metodoPago === 'efectivo' && montoRecibidoNum < totalPedido) {
      toast.error('El monto recibido debe ser mayor o igual al total');
      return;
    }

    if (emitirFactura && (!nitFactura || !razonSocial)) {
      toast.error('Completa los datos de facturación');
      return;
    }

    setLoading(true);

    try {
      // Prepare payment data
      const montoFinal = metodoPago === 'efectivo' ? montoRecibidoNum : totalPedido;
      const facturaData = emitirFactura ? { nit: nitFactura, razonSocial } : undefined;

      // Process payment using the real API
      await procesarPago(pedido.id, metodoPago, montoFinal, facturaData);

      // Update pedido in store to reflect the changes
      updatePedidoInStore(pedido.id, {
        estado: 'entregado',
        pagoId: Date.now(), // This will be updated when we refetch
        fechaHoraEntrega: new Date(),
      });

      toast.success('Pago procesado exitosamente');
      setOpen(false);
      
      // Reset form
      setMetodoPago('');
      setMontoRecibido('');
      setEmitirFactura(false);
      setNitFactura('');
      setRazonSocial('');
      
    } catch (error) {
      toast.error(`Error al procesar el pago: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      console.error('Payment error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="space-y-4 flex-shrink-0">
          <DialogTitle className="flex items-center gap-3">
            <CreditCardIcon className="h-6 w-6" />
            Procesar Pago
            <Badge variant="outline" className="text-lg font-bold px-3 py-1">
              <HashIcon className="h-4 w-4 mr-1" />
              #{pedido.id}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 overflow-y-auto flex-1 pr-2">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ReceiptIcon className="h-5 w-5" />
                Resumen del Pedido
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Cliente:</span>
                  <span className="font-medium">{pedido.cliente?.nombre || 'No disponible'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Ubicación:</span>
                  <span className="font-medium">
                    {pedido.tipo === 'mesa' 
                      ? (pedido.mesa ? `Mesa ${pedido.mesa.numero}` : 'Sin mesa') 
                      : 'Domicilio'
                    }
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Items:</span>
                  <span className="font-medium">
                    {(pedido.detalleProductos?.length || 0) + (pedido.detalleCombos?.length || 0)} productos
                  </span>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="font-medium">{formatCurrency(calculateSubtotal())}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total a Pagar:</span>
                  <span className="text-green-600">{formatCurrency(totalPedido)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSignIcon className="h-5 w-5" />
                Método de Pago
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="metodo-pago">Selecciona el método de pago</Label>
                <Select value={metodoPago} onValueChange={setMetodoPago}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar método de pago" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="efectivo">Efectivo</SelectItem>
                    <SelectItem value="tarjeta">Tarjeta de Crédito/Débito</SelectItem>
                    <SelectItem value="transferencia">Transferencia Bancaria</SelectItem>
                    <SelectItem value="qr">QR (Tigo Money, Banco Unión)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {metodoPago === 'efectivo' && (
                <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="space-y-2">
                    <Label htmlFor="monto-recibido">Monto Recibido</Label>
                    <Input
                      id="monto-recibido"
                      type="number"
                      step="0.01"
                      placeholder="Ingresa el monto recibido"
                      value={montoRecibido}
                      onChange={(e) => setMontoRecibido(e.target.value)}
                    />
                  </div>
                  
                  {montoRecibidoNum > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total:</span>
                        <span className="font-medium">{formatCurrency(totalPedido)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Recibido:</span>
                        <span className="font-medium">{formatCurrency(montoRecibidoNum)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className={cn(
                          "font-semibold",
                          cambio >= 0 ? "text-green-600" : "text-red-600"
                        )}>
                          {cambio >= 0 ? 'Cambio:' : 'Faltante:'}
                        </span>
                        <span className={cn(
                          "font-bold text-lg",
                          cambio >= 0 ? "text-green-600" : "text-red-600"
                        )}>
                          {formatCurrency(Math.abs(cambio))}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Factura Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ReceiptIcon className="h-5 w-5" />
                Facturación
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="emitir-factura"
                  checked={emitirFactura}
                  onChange={(e) => setEmitirFactura(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="emitir-factura">Emitir factura</Label>
              </div>

              {emitirFactura && (
                <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="space-y-2">
                    <Label htmlFor="nit">NIT</Label>
                    <Input
                      id="nit"
                      placeholder="Ingresa el NIT"
                      value={nitFactura}
                      onChange={(e) => setNitFactura(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="razon-social">Razón Social</Label>
                    <Input
                      id="razon-social"
                      placeholder="Ingresa la razón social"
                      value={razonSocial}
                      onChange={(e) => setRazonSocial(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

        </div>

        {/* Action Buttons - Fixed at bottom */}
        <div className="flex gap-3 justify-end pt-4 border-t flex-shrink-0">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleProcesarPago}
            disabled={loading || !metodoPago}
            className="bg-green-600 hover:bg-green-700"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Procesando...
              </>
            ) : (
              <>
                <CheckCircleIcon className="h-4 w-4 mr-2" />
                Procesar Pago
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 
