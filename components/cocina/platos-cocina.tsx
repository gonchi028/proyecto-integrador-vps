'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useCocinaStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ClockIcon, 
  ChefHatIcon, 
  CheckIcon, 
  AlertTriangleIcon,
  TimerIcon,
  MapPinIcon,
  HashIcon,
  PauseIcon,
  PlayIcon
} from 'lucide-react';
import { updateEstadoPlatoCocina, updateEstadoComboCocina } from '@/server/queries';
import { toast } from 'sonner';

type EstadoFilter = 'pendiente' | 'en preparacion' | 'entregado' | 'todos';

export const PlatosCocina = () => {
  const platosCocina = useCocinaStore((state) => state.platosCocina);
  const updatePlatoCocinaEstado = useCocinaStore((state) => state.updatePlatoCocinaEstado);
  const [filterEstado, setFilterEstado] = useState<EstadoFilter>('pendiente');
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());

  // Filter and sort platos - pending first, then by creation time
  const filteredPlatos = platosCocina
    .filter((pc) => {
      if (filterEstado === 'todos') return true;
      return pc.estado === filterEstado;
    })
    .sort((a, b) => {
      // Sort by status priority, then by order creation time
      const statusPriority = { 'pendiente': 3, 'en preparacion': 2, 'entregado': 1 };
      if (a.estado !== b.estado) {
        return statusPriority[b.estado] - statusPriority[a.estado];
      }
             return a.pedido.id - b.pedido.id; // Sort by pedido ID as proxy for creation time
    });

  const pendienteCount = platosCocina.filter(pc => pc.estado === 'pendiente').length;
  const enPreparacionCount = platosCocina.filter(pc => pc.estado === 'en preparacion').length;
  const entregadoCount = platosCocina.filter(pc => pc.estado === 'entregado').length;

  const updateEstado = async (
    idPedido: number,
    idProducto: number,
    tipo: 'producto' | 'combo',
    nuevoEstado: 'pendiente' | 'en preparacion' | 'entregado'
  ) => {
    const itemKey = `${idPedido}-${idProducto}-${tipo}`;
    setUpdatingItems(prev => new Set(prev).add(itemKey));

    try {
      if (tipo === 'producto') {
        await updateEstadoPlatoCocina(idPedido, idProducto, nuevoEstado);
      } else {
        await updateEstadoComboCocina(idPedido, idProducto, nuevoEstado);
      }
      
      updatePlatoCocinaEstado(idPedido, idProducto, tipo, nuevoEstado);
      
      toast.success(`Estado actualizado a ${nuevoEstado}`);
    } catch (error) {
      toast.error('Error al actualizar el estado');
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemKey);
        return newSet;
      });
    }
  };

  const getOrderPosition = (pedidoId: number) => {
    const allPedidoIds = platosCocina.map(pc => pc.pedido.id).sort((a, b) => a - b);
    const position = allPedidoIds.indexOf(pedidoId) + 1;
    return `#${position}`;
  };

  const getUrgencyBadge = (pedidoId: number, estado: string) => {
    if (estado === 'entregado') return null;
    
    // Calculate urgency based on order position in queue
    const allPendingIds = platosCocina
      .filter(pc => pc.estado !== 'entregado')
      .map(pc => pc.pedido.id)
      .sort((a, b) => a - b);
    
    const position = allPendingIds.indexOf(pedidoId);
    
    if (position < 3 && estado === 'pendiente') {
      return (
        <Badge variant="destructive" className="animate-pulse">
          <AlertTriangleIcon className="h-3 w-3 mr-1" />
          PRIORITARIO
        </Badge>
      );
    } else if (position < 5 && estado === 'pendiente') {
      return (
        <Badge variant="secondary" className="bg-orange-100 text-orange-800">
          <TimerIcon className="h-3 w-3 mr-1" />
          PRÓXIMO
        </Badge>
      );
    }
    return null;
  };

  const StatusButtons = ({ pc }: { pc: any }) => {
    const itemKey = `${pc.pedido.id}-${pc.producto.id}-${pc.tipo}`;
    const isUpdating = updatingItems.has(itemKey);

    return (
      <div className="space-y-2">
        {pc.estado === 'pendiente' && (
          <Button
            size="lg"
            onClick={() => updateEstado(pc.pedido.id, pc.producto.id, pc.tipo, 'en preparacion')}
            disabled={isUpdating}
            className="w-full font-bold text-base py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {isUpdating ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            ) : (
              <>
                <PlayIcon className="h-5 w-5 mr-2" />
                COMENZAR PREPARACIÓN
              </>
            )}
          </Button>
        )}
        
        {pc.estado === 'en preparacion' && (
          <div className="space-y-2">
            <Button
              size="lg"
              onClick={() => updateEstado(pc.pedido.id, pc.producto.id, pc.tipo, 'entregado')}
              disabled={isUpdating}
              className="w-full font-bold text-base py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isUpdating ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              ) : (
                <>
                  <CheckIcon className="h-5 w-5 mr-2" />
                  MARCAR COMO LISTO
                </>
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => updateEstado(pc.pedido.id, pc.producto.id, pc.tipo, 'pendiente')}
              disabled={isUpdating}
              className="w-full border-gray-300 text-gray-600 hover:bg-gray-50"
            >
              <PauseIcon className="h-4 w-4 mr-1" />
              Pausar
            </Button>
          </div>
        )}

        {pc.estado === 'entregado' && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => updateEstado(pc.pedido.id, pc.producto.id, pc.tipo, 'en preparacion')}
            disabled={isUpdating}
            className="w-full border-blue-300 text-blue-600 hover:bg-blue-50"
          >
            <ChefHatIcon className="h-4 w-4 mr-1" />
            Volver a Preparar
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with improved stats */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Cocina</h1>
            <p className="text-muted-foreground">Gestión de platos en tiempo real</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-red-600">{pendienteCount}</div>
              <div className="text-sm text-muted-foreground">Pendientes</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{enPreparacionCount}</div>
              <div className="text-sm text-muted-foreground">En Prep.</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">{entregadoCount}</div>
              <div className="text-sm text-muted-foreground">Listos</div>
            </div>
          </div>
        </div>

        {/* Filter buttons */}
                 <div className="flex gap-2">
          <Button
            variant={filterEstado === 'pendiente' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterEstado('pendiente')}
            className={cn(
              filterEstado === 'pendiente' 
                ? 'bg-red-600 hover:bg-red-700 border-red-600' 
                : 'border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300'
            )}
          >
            <ClockIcon className="h-4 w-4 mr-2" />
            Pendientes ({pendienteCount})
          </Button>
          <Button
            variant={filterEstado === 'en preparacion' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterEstado('en preparacion')}
            className={cn(
              filterEstado === 'en preparacion' 
                ? 'bg-blue-600 hover:bg-blue-700 border-blue-600' 
                : 'border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300'
            )}
          >
            <ChefHatIcon className="h-4 w-4 mr-2" />
            En Preparación ({enPreparacionCount})
          </Button>
          <Button
            variant={filterEstado === 'entregado' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterEstado('entregado')}
            className={cn(
              filterEstado === 'entregado' 
                ? 'bg-green-600 hover:bg-green-700 border-green-600' 
                : 'border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300'
            )}
          >
            <CheckIcon className="h-4 w-4 mr-2" />
            Listos ({entregadoCount})
          </Button>
          <Button
            variant={filterEstado === 'todos' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterEstado('todos')}
            className="hover:bg-gray-50"
          >
            Todos ({platosCocina.length})
          </Button>
        </div>
      </div>

      {/* Kitchen Board */}
      <div className="space-y-4">
        {filteredPlatos.length === 0 ? (
          <Card className="p-12">
            <div className="text-center text-muted-foreground">
              <ChefHatIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">
                {filterEstado === 'todos' 
                  ? 'No hay platos en cocina'
                  : `No hay platos ${filterEstado === 'en preparacion' ? 'en preparación' : filterEstado}`
                }
              </h3>
              <p>Los pedidos aparecerán aquí cuando lleguen</p>
            </div>
          </Card>
                ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredPlatos.map((pc) => (
              <Card 
                key={`${pc.pedido.id}-${pc.producto.id}-${pc.tipo}`}
                className={cn(
                  "transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-fit overflow-hidden",
                  "border-0 shadow-md",
                  pc.estado === 'pendiente' && "bg-gradient-to-br from-red-50 to-red-100/50 ring-2 ring-red-200",
                  pc.estado === 'en preparacion' && "bg-gradient-to-br from-blue-50 to-blue-100/50 ring-2 ring-blue-200",
                  pc.estado === 'entregado' && "bg-gradient-to-br from-green-50 to-green-100/50 ring-2 ring-green-200"
                )}
              >
                {/* Status Header */}
                <div className={cn(
                  "px-4 py-3 text-center font-bold text-white text-sm",
                  pc.estado === 'pendiente' && "bg-gradient-to-r from-red-500 to-red-600",
                  pc.estado === 'en preparacion' && "bg-gradient-to-r from-blue-500 to-blue-600",
                  pc.estado === 'entregado' && "bg-gradient-to-r from-green-500 to-green-600"
                )}>
                  <div className="flex items-center justify-center gap-2">
                    {pc.estado === 'pendiente' && <><ClockIcon className="h-4 w-4" /> PENDIENTE</>}
                    {pc.estado === 'en preparacion' && <><ChefHatIcon className="h-4 w-4" /> PREPARANDO</>}
                    {pc.estado === 'entregado' && <><CheckIcon className="h-4 w-4" /> LISTO</>}
                  </div>
                </div>

                <CardContent className="p-0">
                  {/* Priority & Location Bar */}
                  <div className="px-4 py-3 bg-white/80">
                    <div className="flex items-center justify-between">
                      {/* Mesa/Domicilio - Most Important */}
                      {pc.pedido.mesa ? (
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          <span className="font-bold text-blue-700 text-lg">MESA {pc.pedido.mesa.numero}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                          <span className="font-bold text-orange-700 text-lg">DOMICILIO</span>
                        </div>
                      )}
                      
                      {/* Urgency Badge */}
                      <div className="flex flex-col items-end gap-1">
                        {getUrgencyBadge(pc.pedido.id, pc.estado)}
                        <span className="text-xs font-medium text-gray-500">
                          Orden {getOrderPosition(pc.pedido.id)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="px-4 pb-4 space-y-4">
                    {/* Product Visual Section */}
                    <div className="text-center space-y-3">
                      {/* Product Image - Larger and more prominent */}
                      <div className="flex justify-center">
                        <div className="relative">
                          <img
                            src={pc.producto.urlImagen || ''}
                            alt={pc.producto.nombre}
                            className="w-24 h-24 rounded-full object-cover shadow-md border-4 border-white"
                          />
                          {/* Quantity Indicator */}
                          <div className="absolute -top-1 -right-1 bg-gray-800 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-lg">
                            {pc.cantidad}
                          </div>
                        </div>
                      </div>

                      {/* Product Name - Most prominent text */}
                      <div>
                        <h3 className="font-bold text-xl text-gray-900 leading-tight mb-1">
                          {pc.producto.nombre}
                        </h3>
                        
                        {/* Product Type & Order Info */}
                        <div className="flex justify-center items-center gap-2">
                          <Badge variant="outline" className="text-xs font-medium">
                            Pedido #{pc.pedido.id}
                          </Badge>
                          {pc.tipo === 'combo' && (
                            <Badge className="bg-purple-600 text-white text-xs font-medium">
                              COMBO
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Section */}
                    <div className="pt-2">
                      <StatusButtons pc={pc} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
