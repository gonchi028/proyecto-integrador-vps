'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, Package, Utensils, Coffee } from 'lucide-react';
import { type Proveedor } from '@/store/proveedor/proveedor-store';

interface ProveedorProductsDialogProps {
  proveedor: Proveedor;
  variant?: 'menu' | 'card';
}

export const ProveedorProductsDialog = ({ proveedor, variant = 'menu' }: ProveedorProductsDialogProps) => {
  const [open, setOpen] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB',
    }).format(price);
  };

  const getProductIcon = (tipo: 'plato' | 'bebida') => {
    return tipo === 'plato' ? Utensils : Coffee;
  };

  const getProductTypeColor = (tipo: 'plato' | 'bebida') => {
    return tipo === 'plato' ? 'bg-orange-600' : 'bg-blue-600';
  };

  if (variant === 'menu') {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="flex items-center w-full">
          <Eye className="mr-2 h-4 w-4" />
          Ver productos
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Productos de {proveedor.nombre}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {proveedor.productos.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No hay productos asociados</h3>
                <p>Este proveedor no tiene productos asignados</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {proveedor.productos.map((producto) => {
                  const ProductIcon = getProductIcon(producto.tipo);
                  return (
                    <Card key={producto.id} className="overflow-hidden">
                      <div className="relative">
                        <img
                          src={producto.urlImagen || '/placeholder-product.png'}
                          alt={producto.nombre}
                          className="w-full h-32 object-cover"
                        />
                        <div className="absolute top-2 left-2">
                          <Badge className={getProductTypeColor(producto.tipo)}>
                            <ProductIcon className="h-3 w-3 mr-1" />
                            {producto.tipo === 'plato' ? 'Plato' : 'Bebida'}
                          </Badge>
                        </div>
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary">
                            {formatPrice(producto.precio)}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-3">
                        <h3 className="font-medium text-sm mb-1 line-clamp-1">
                          {producto.nombre}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                          {producto.descripcion}
                        </p>
                        <div className="flex items-center justify-between text-xs">
                          <Badge variant="outline">
                            {producto.categoria}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            ID: {producto.id}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex-1">
          <Eye className="h-4 w-4 mr-1" />
          Ver productos
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Productos de {proveedor.nombre}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {proveedor.productos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No hay productos asociados</h3>
              <p>Este proveedor no tiene productos asignados</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {proveedor.productos.map((producto) => {
                const ProductIcon = getProductIcon(producto.tipo);
                return (
                  <Card key={producto.id} className="overflow-hidden">
                    <div className="relative">
                      <img
                        src={producto.urlImagen || '/placeholder-product.png'}
                        alt={producto.nombre}
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute top-2 left-2">
                        <Badge className={getProductTypeColor(producto.tipo)}>
                          <ProductIcon className="h-3 w-3 mr-1" />
                          {producto.tipo === 'plato' ? 'Plato' : 'Bebida'}
                        </Badge>
                      </div>
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary">
                          {formatPrice(producto.precio)}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-3">
                      <h3 className="font-medium text-sm mb-1 line-clamp-1">
                        {producto.nombre}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                        {producto.descripcion}
                      </p>
                      <div className="flex items-center justify-between text-xs">
                        <Badge variant="outline">
                          {producto.categoria}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          ID: {producto.id}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}; 
