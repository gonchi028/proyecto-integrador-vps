'use client';

import Link from 'next/link';
import {
  Pedido,
  useBebidasStore,
  useCombosStore,
  usePlatosStore,
} from '@/store';
import { useEffect, useState } from 'react';
import { ProductosListDialog } from '../combos';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Separator } from '../ui/separator';
import { 
  Trash2Icon, 
  PlusIcon, 
  MinusIcon, 
  SearchIcon,
  ShoppingCartIcon,
  ArrowLeftIcon,
  CheckIcon
} from 'lucide-react';
import { realizarPedido } from '@/server/queries';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type Ordenado = {
  cantidad: number;
  id: number;
};

type Props = {
  pedido: Pedido;
};

export const Ordenar = ({ pedido }: Props) => {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const combos = useCombosStore((state) => state.combos);
  const platos = usePlatosStore((state) => state.platos);
  const bebidas = useBebidasStore((state) => state.bebidas);

  const combosMap = useCombosStore((state) => state.combosMap);
  const platosMap = usePlatosStore((state) => state.platosMap);
  const bebidasMap = useBebidasStore((state) => state.bebidasMap);

  const [combosOrdenados, setCombosOrdenados] = useState<Ordenado[]>(
    pedido.detalleCombos.map((dc) => ({
      cantidad: dc.cantidad,
      id: dc.comboId,
    }))
  );
  const [platosOrdenados, setPlatosOrdenados] = useState<Ordenado[]>(
    pedido.detalleProductos
      .filter((dp) => dp.producto.tipo === 'plato')
      .map((dp) => ({
        cantidad: dp.cantidad,
        id: dp.productoId,
      }))
  );
  const [bebidasOrdenadas, setBebidasOrdenadas] = useState<Ordenado[]>(
    pedido.detalleProductos
      .filter((dp) => dp.producto.tipo === 'bebida')
      .map((dp) => ({
        cantidad: dp.cantidad,
        id: dp.productoId,
      }))
  );

  const [total, setTotal] = useState(0);

  useEffect(() => {
    let costoTotal = 0;
    combosOrdenados.forEach((combo) => {
      const c = combosMap.get(combo.id);
      if (c === undefined) return;
      costoTotal += c.precio * combo.cantidad;
    });
    platosOrdenados.forEach((plato) => {
      const p = platosMap.get(plato.id);
      if (p === undefined) return;
      costoTotal += p.precio * plato.cantidad;
    });
    bebidasOrdenadas.forEach((bebida) => {
      const b = bebidasMap.get(bebida.id);
      if (b === undefined) return;
      costoTotal += b.precio * bebida.cantidad;
    });
    setTotal(costoTotal);
  }, [combosOrdenados, platosOrdenados, bebidasOrdenadas]);

  const realizarOrden = async () => {
    const totalItems = combosOrdenados.length + platosOrdenados.length + bebidasOrdenadas.length;
    if (totalItems === 0) {
      toast.error('No hay productos en el pedido');
      return;
    }

    setLoading(true);
    try {
      await realizarPedido(pedido.id, total, combosOrdenados, [
        ...platosOrdenados,
        ...bebidasOrdenadas,
      ]);
      toast.success('Pedido realizado exitosamente');
      router.push('/dashboard/pedidos/lista');
    } catch (error) {
      toast.error('Error al realizar el pedido');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = (
    id: number,
    newQuantity: number,
    type: 'combo' | 'plato' | 'bebida'
  ) => {
    if (newQuantity <= 0) {
      removeItem(id, type);
      return;
    }

    switch (type) {
      case 'combo':
        setCombosOrdenados(prev => 
          prev.map(item => item.id === id ? { ...item, cantidad: newQuantity } : item)
        );
        break;
      case 'plato':
        setPlatosOrdenados(prev => 
          prev.map(item => item.id === id ? { ...item, cantidad: newQuantity } : item)
        );
        break;
      case 'bebida':
        setBebidasOrdenadas(prev => 
          prev.map(item => item.id === id ? { ...item, cantidad: newQuantity } : item)
        );
        break;
    }
  };

  const addItem = (id: number, type: 'combo' | 'plato' | 'bebida') => {
    switch (type) {
      case 'combo':
        const existingCombo = combosOrdenados.find(item => item.id === id);
        if (existingCombo) {
          updateQuantity(id, existingCombo.cantidad + 1, type);
        } else {
          setCombosOrdenados(prev => [...prev, { id, cantidad: 1 }]);
        }
        break;
      case 'plato':
        const existingPlato = platosOrdenados.find(item => item.id === id);
        if (existingPlato) {
          updateQuantity(id, existingPlato.cantidad + 1, type);
        } else {
          setPlatosOrdenados(prev => [...prev, { id, cantidad: 1 }]);
        }
        break;
      case 'bebida':
        const existingBebida = bebidasOrdenadas.find(item => item.id === id);
        if (existingBebida) {
          updateQuantity(id, existingBebida.cantidad + 1, type);
        } else {
          setBebidasOrdenadas(prev => [...prev, { id, cantidad: 1 }]);
        }
        break;
    }
  };

  const removeItem = (id: number, type: 'combo' | 'plato' | 'bebida') => {
    switch (type) {
      case 'combo':
        setCombosOrdenados(prev => prev.filter(item => item.id !== id));
        break;
      case 'plato':
        setPlatosOrdenados(prev => prev.filter(item => item.id !== id));
        break;
      case 'bebida':
        setBebidasOrdenadas(prev => prev.filter(item => item.id !== id));
        break;
    }
  };

  const getAllOrderItems = () => {
    const items: Array<{
      id: number;
      cantidad: number;
      name: string;
      price: number;
      image: string;
      type: 'combo' | 'plato' | 'bebida';
    }> = [];
    
    combosOrdenados.forEach(combo => {
      const c = combosMap.get(combo.id);
      if (c) {
        items.push({
          ...combo,
          name: c.nombre,
          price: c.precio,
          image: c.urlImagen || '',
          type: 'combo' as const
        });
      }
    });

    platosOrdenados.forEach(plato => {
      const p = platosMap.get(plato.id);
      if (p) {
        items.push({
          ...plato,
          name: p.nombre,
          price: p.precio,
          image: p.urlImagen || '',
          type: 'plato' as const
        });
      }
    });

    bebidasOrdenadas.forEach(bebida => {
      const b = bebidasMap.get(bebida.id);
      if (b) {
        items.push({
          ...bebida,
          name: b.nombre,
          price: b.precio,
          image: b.urlImagen || '',
          type: 'bebida' as const
        });
      }
    });

    return items;
  };

  const filteredCombos = combos.filter(combo =>
    combo.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPlatos = platos.filter(plato =>
    plato.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plato.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBebidas = bebidas.filter(bebida =>
    bebida.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bebida.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const ProductCard = ({ 
    product, 
    type, 
    ordered 
  }: { 
    product: any, 
    type: 'combo' | 'plato' | 'bebida',
    ordered?: Ordenado 
  }) => (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-200">
      <div className="relative">
        <img
          src={product.urlImagen || ''}
          alt={product.nombre}
          className="w-full h-48 object-contain bg-gray-50"
        />
        {ordered && (
          <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
            {ordered.cantidad}
          </Badge>
        )}
      </div>
             <CardContent className="p-4">
                  <div className="space-y-2 mb-3">
           <h3 className="font-semibold text-sm line-clamp-2 leading-tight">{product.nombre}</h3>
           {product.categoria && (
             <Badge variant="secondary" className="text-xs w-fit">
               {product.categoria}
             </Badge>
           )}
           <div className="flex justify-between items-center">
             <span className="text-lg font-bold text-primary">
               {product.precio} Bs.
             </span>
           </div>
         </div>

        {type === 'combo' && (
          <div className="mb-3">
            <ProductosListDialog productos={product.productos} />
          </div>
        )}

        <div className="flex items-center justify-between">
          {ordered ? (
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateQuantity(product.id, ordered.cantidad - 1, type)}
              >
                <MinusIcon className="h-3 w-3" />
              </Button>
              <span className="font-medium min-w-[2rem] text-center">
                {ordered.cantidad}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateQuantity(product.id, ordered.cantidad + 1, type)}
              >
                <PlusIcon className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => removeItem(product.id, type)}
              >
                <Trash2Icon className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              onClick={() => addItem(product.id, type)}
              className="w-full"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Agregar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const orderItems = getAllOrderItems();

  return (
    <div className="w-full mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/pedidos/lista">
            <Button variant="outline" size="sm">
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Realizar Pedido</h1>
            <p className="text-muted-foreground">Pedido #{pedido.id}</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Products Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search */}
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Product Tabs */}
          <Tabs defaultValue="combos" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="combos">
                Combos ({filteredCombos.length})
              </TabsTrigger>
              <TabsTrigger value="platos">
                Platos ({filteredPlatos.length})
              </TabsTrigger>
              <TabsTrigger value="bebidas">
                Bebidas ({filteredBebidas.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="combos" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredCombos.map((combo) => (
                  <ProductCard
                    key={combo.id}
                    product={combo}
                    type="combo"
                    ordered={combosOrdenados.find(o => o.id === combo.id)}
                  />
                ))}
              </div>
              {filteredCombos.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No se encontraron combos
                </div>
              )}
            </TabsContent>

            <TabsContent value="platos" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredPlatos.map((plato) => (
                  <ProductCard
                    key={plato.id}
                    product={plato}
                    type="plato"
                    ordered={platosOrdenados.find(o => o.id === plato.id)}
                  />
                ))}
              </div>
              {filteredPlatos.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No se encontraron platos
                </div>
              )}
            </TabsContent>

            <TabsContent value="bebidas" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredBebidas.map((bebida) => (
                  <ProductCard
                    key={bebida.id}
                    product={bebida}
                    type="bebida"
                    ordered={bebidasOrdenadas.find(o => o.id === bebida.id)}
                  />
                ))}
              </div>
              {filteredBebidas.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No se encontraron bebidas
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Order Summary - Sticky */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCartIcon className="h-5 w-5" />
                  Resumen del Pedido
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {orderItems.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <ShoppingCartIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Tu pedido está vacío</p>
                    <p className="text-sm">Agrega productos para comenzar</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {orderItems.map((item) => (
                        <div key={`${item.type}-${item.id}`} className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg">
                          <img
                            src={item.image || ''}
                            alt={item.name}
                            className="w-10 h-10 object-contain rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm line-clamp-1">{item.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.cantidad} × {item.price} Bs.
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => updateQuantity(item.id, item.cantidad - 1, item.type)}
                              className="h-6 w-6 p-0"
                            >
                              <MinusIcon className="h-3 w-3" />
                            </Button>
                            <span className="text-sm w-6 text-center">{item.cantidad}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => updateQuantity(item.id, item.cantidad + 1, item.type)}
                              className="h-6 w-6 p-0"
                            >
                              <PlusIcon className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal:</span>
                        <span>{total} Bs.</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span>{total} Bs.</span>
                      </div>
                    </div>

                    <Button
                      onClick={realizarOrden}
                      disabled={loading || orderItems.length === 0}
                      className="w-full"
                      size="lg"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Procesando...
                        </>
                      ) : (
                        <>
                          <CheckIcon className="h-4 w-4 mr-2" />
                          Realizar Pedido
                        </>
                      )}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
