'use client';

import { useState } from 'react';
import { Settings, Plus, Trash2, Package, Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { removeProductFromProveedor } from '@/server/queries/proveedores-queries';
import { useProveedorStore } from '@/store';
import { AddProductsToProveedorDialog } from './add-products-to-proveedor-dialog';
import type { Proveedor, Producto } from '@/store/proveedor/proveedor-store';

interface ManageProveedorProductsDialogProps {
  proveedor: Proveedor;
  trigger?: React.ReactNode;
}

export function ManageProveedorProductsDialog({
  proveedor,
  trigger,
}: ManageProveedorProductsDialogProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [removingProductId, setRemovingProductId] = useState<number | null>(null);

  const updateProveedor = useProveedorStore((state) => state.updateProveedor);

  // Filter products based on search term
  const filteredProducts = proveedor.productos.filter((product) =>
    product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRemoveProduct = async (productId: number) => {
    setRemovingProductId(productId);
    try {
      await removeProductFromProveedor(proveedor.id, productId);
      
      // Update the store
      updateProveedor({
        ...proveedor,
        productos: proveedor.productos.filter((p) => p.id !== productId),
      });

      toast.success('Producto removido del proveedor');
    } catch (error) {
      console.error('Error removing product:', error);
      toast.error('Error al remover producto');
    } finally {
      setRemovingProductId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Administrar Productos
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Productos de {proveedor.nombre}
          </DialogTitle>
          <DialogDescription>
            Administra los productos que puede suministrar este proveedor
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Actions Header */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-sm">
                {proveedor.productos.length} productos
              </Badge>
            </div>
            <AddProductsToProveedorDialog
              proveedor={proveedor}
              trigger={
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Agregar Productos
                </Button>
              }
            />
          </div>

          <Separator />

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Products Grid */}
          <div className="max-h-96 overflow-y-auto">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                {proveedor.productos.length === 0 ? (
                  <div className="space-y-3">
                    <Package className="h-12 w-12 mx-auto text-muted-foreground" />
                    <div>
                      <p className="text-lg font-medium text-muted-foreground">
                        Sin productos asignados
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Agrega productos que este proveedor puede suministrar
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Search className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="text-muted-foreground">
                      No se encontraron productos con "{searchTerm}"
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center space-x-3 p-4 border rounded-lg hover:shadow-sm transition-shadow"
                  >
                    <img
                      src={product.urlImagen}
                      alt={product.nombre}
                      className="w-16 h-16 rounded-lg object-cover border"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium truncate">{product.nombre}</h4>
                        <Badge variant={product.tipo === 'plato' ? 'default' : 'secondary'}>
                          {product.tipo === 'plato' ? '🍽️' : '☕'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate mb-2">
                        {product.descripcion}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">
                            {product.precio.toLocaleString('es-BO', {
                              style: 'currency',
                              currency: 'BOB',
                            })}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {product.categoria}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveProduct(product.id)}
                          disabled={removingProductId === product.id}
                          className="ml-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          {removingProductId === product.id ? (
                            'Removiendo...'
                          ) : (
                            <>
                              <Trash2 className="h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end pt-4 border-t">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cerrar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 
