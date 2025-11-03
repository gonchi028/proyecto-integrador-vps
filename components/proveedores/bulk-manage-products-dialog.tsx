'use client';

import { useState, useEffect } from 'react';
import { Settings, Package, Plus, Trash2, Check, Search } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { getProductos } from '@/server/product-queries';
import { addProductToProveedor, removeProductFromProveedor } from '@/server/queries/proveedores-queries';
import { useProveedorStore } from '@/store';
import type { Proveedor, Producto } from '@/store/proveedor/proveedor-store';

interface BulkManageProductsDialogProps {
  trigger?: React.ReactNode;
}

export function BulkManageProductsDialog({
  trigger,
}: BulkManageProductsDialogProps) {
  const [open, setOpen] = useState(false);
  const [allProducts, setAllProducts] = useState<Producto[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const proveedores = useProveedorStore((state) => state.proveedores);
  const updateProveedor = useProveedorStore((state) => state.updateProveedor);

  // Filter products based on search term
  const filteredProducts = allProducts.filter((product) =>
    product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (open) {
      loadProducts();
    }
  }, [open]);

  const loadProducts = async () => {
    try {
      const products = await getProductos();
      setAllProducts(products);
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Error al cargar productos');
    }
  };

  const getProveedoresWithProduct = (productId: number) => {
    return proveedores.filter(proveedor => 
      proveedor.productos.some(p => p.id === productId)
    );
  };

  const getProveedoresWithoutProduct = (productId: number) => {
    return proveedores.filter(proveedor => 
      !proveedor.productos.some(p => p.id === productId)
    );
  };

  const handleAddProductToProveedores = async (productId: number, proveedorIds: number[]) => {
    setIsLoading(true);
    try {
      const product = allProducts.find(p => p.id === productId);
      if (!product) return;

      for (const proveedorId of proveedorIds) {
        await addProductToProveedor(proveedorId, productId);
        
        // Update store
        const proveedor = proveedores.find(p => p.id === proveedorId);
        if (proveedor) {
          updateProveedor({
            ...proveedor,
            productos: [...proveedor.productos, product],
          });
        }
      }

      toast.success(`Producto agregado a ${proveedorIds.length} proveedores`);
    } catch (error) {
      console.error('Error adding product to proveedores:', error);
      toast.error('Error al agregar producto');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveProductFromProveedores = async (productId: number, proveedorIds: number[]) => {
    setIsLoading(true);
    try {
      for (const proveedorId of proveedorIds) {
        await removeProductFromProveedor(proveedorId, productId);
        
        // Update store
        const proveedor = proveedores.find(p => p.id === proveedorId);
        if (proveedor) {
          updateProveedor({
            ...proveedor,
            productos: proveedor.productos.filter(p => p.id !== productId),
          });
        }
      }

      toast.success(`Producto removido de ${proveedorIds.length} proveedores`);
    } catch (error) {
      console.error('Error removing product from proveedores:', error);
      toast.error('Error al remover producto');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedProduct = selectedProductId ? allProducts.find(p => p.id === selectedProductId) : null;
  const proveedoresWithProduct = selectedProductId ? getProveedoresWithProduct(selectedProductId) : [];
  const proveedoresWithoutProduct = selectedProductId ? getProveedoresWithoutProduct(selectedProductId) : [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Administración Masiva
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Administración Masiva de Productos
          </DialogTitle>
          <DialogDescription>
            Gestiona productos en múltiples proveedores simultáneamente
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Product Selection */}
          <div className="space-y-3">
            <h3 className="font-medium">1. Selecciona un producto</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="max-h-32 overflow-y-auto border rounded-lg">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className={`flex items-center space-x-3 p-3 cursor-pointer hover:bg-muted/50 ${
                    selectedProductId === product.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                  onClick={() => setSelectedProductId(product.id)}
                >
                  <img
                    src={product.urlImagen}
                    alt={product.nombre}
                    className="w-10 h-10 rounded object-cover border"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{product.nombre}</span>
                      <Badge variant={product.tipo === 'plato' ? 'default' : 'secondary'}>
                        {product.tipo === 'plato' ? '🍽️' : '☕'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {product.categoria} - {product.precio.toLocaleString('es-BO', {
                        style: 'currency',
                        currency: 'BOB',
                      })}
                    </p>
                  </div>
                  {selectedProductId === product.id && (
                    <Check className="h-5 w-5 text-blue-600" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Proveedor Management */}
          {selectedProduct && (
            <div className="space-y-3">
              <h3 className="font-medium">2. Administrar en proveedores</h3>
              
              <Tabs defaultValue="add" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="add" className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Agregar ({proveedoresWithoutProduct.length})
                  </TabsTrigger>
                  <TabsTrigger value="remove" className="flex items-center gap-2">
                    <Trash2 className="h-4 w-4" />
                    Remover ({proveedoresWithProduct.length})
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="add" className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Proveedores que no tienen este producto:
                    </p>
                    {proveedoresWithoutProduct.length > 0 && (
                      <Button
                        size="sm"
                        onClick={() => handleAddProductToProveedores(
                          selectedProduct.id,
                          proveedoresWithoutProduct.map(p => p.id)
                        )}
                        disabled={isLoading}
                      >
                        Agregar a todos
                      </Button>
                    )}
                  </div>
                  
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {proveedoresWithoutProduct.length === 0 ? (
                      <p className="text-center py-4 text-muted-foreground">
                        Todos los proveedores ya tienen este producto
                      </p>
                    ) : (
                      proveedoresWithoutProduct.map((proveedor) => (
                        <div
                          key={proveedor.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{proveedor.nombre}</p>
                            <p className="text-sm text-muted-foreground">
                              {proveedor.productos.length} productos
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAddProductToProveedores(
                              selectedProduct.id,
                              [proveedor.id]
                            )}
                            disabled={isLoading}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="remove" className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Proveedores que tienen este producto:
                    </p>
                    {proveedoresWithProduct.length > 0 && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRemoveProductFromProveedores(
                          selectedProduct.id,
                          proveedoresWithProduct.map(p => p.id)
                        )}
                        disabled={isLoading}
                      >
                        Remover de todos
                      </Button>
                    )}
                  </div>
                  
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {proveedoresWithProduct.length === 0 ? (
                      <p className="text-center py-4 text-muted-foreground">
                        Ningún proveedor tiene este producto
                      </p>
                    ) : (
                      proveedoresWithProduct.map((proveedor) => (
                        <div
                          key={proveedor.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{proveedor.nombre}</p>
                            <p className="text-sm text-muted-foreground">
                              {proveedor.productos.length} productos
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRemoveProductFromProveedores(
                              selectedProduct.id,
                              [proveedor.id]
                            )}
                            disabled={isLoading}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

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
