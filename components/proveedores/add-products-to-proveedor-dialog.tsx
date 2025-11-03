'use client';

import { useState, useEffect } from 'react';
import { Check, Plus, Package } from 'lucide-react';
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
import { toast } from 'sonner';
import { getProductos } from '@/server/product-queries';
import { addProductToProveedor } from '@/server/queries/proveedores-queries';
import { useProveedorStore } from '@/store';
import type { Proveedor, Producto } from '@/store/proveedor/proveedor-store';

interface AddProductsToProveedorDialogProps {
  proveedor: Proveedor;
  trigger?: React.ReactNode;
}

export function AddProductsToProveedorDialog({
  proveedor,
  trigger,
}: AddProductsToProveedorDialogProps) {
  const [open, setOpen] = useState(false);
  const [allProducts, setAllProducts] = useState<Producto[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const updateProveedor = useProveedorStore((state) => state.updateProveedor);

  // Get products not already associated with this proveedor
  const availableProducts = allProducts.filter(
    (product) => !proveedor.productos.some((p) => p.id === product.id)
  );

  // Filter products based on search term
  const filteredProducts = availableProducts.filter((product) =>
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

  const handleProductSelect = (productId: number, checked: boolean) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, productId]);
    } else {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    }
  };

  const handleAddProducts = async () => {
    if (selectedProducts.length === 0) {
      toast.error('Selecciona al menos un producto');
      return;
    }

    setIsLoading(true);
    try {
      // Add each selected product to the proveedor
      for (const productId of selectedProducts) {
        await addProductToProveedor(proveedor.id, productId);
      }

      // Update the store with new products
      const addedProducts = allProducts.filter((p) => selectedProducts.includes(p.id));
      updateProveedor({
        ...proveedor,
        productos: [...proveedor.productos, ...addedProducts],
      });

      toast.success(`Se agregaron ${selectedProducts.length} productos al proveedor`);
      setOpen(false);
      setSelectedProducts([]);
      setSearchTerm('');
    } catch (error) {
      console.error('Error adding products:', error);
      toast.error('Error al agregar productos');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Agregar Productos
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Agregar Productos a {proveedor.nombre}
          </DialogTitle>
          <DialogDescription>
            Selecciona los productos que este proveedor puede suministrar
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <Input
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Selected count */}
          {selectedProducts.length > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {selectedProducts.length} productos seleccionados
              </Badge>
            </div>
          )}

          {/* Products list */}
          <div className="max-h-96 overflow-y-auto space-y-2">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {availableProducts.length === 0
                  ? 'No hay productos disponibles para agregar'
                  : 'No se encontraron productos'}
              </div>
            ) : (
              filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50"
                >
                  <input
                    type="checkbox"
                    id={`product-${product.id}`}
                    checked={selectedProducts.includes(product.id)}
                    onChange={(e) =>
                      handleProductSelect(product.id, e.target.checked)
                    }
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{product.nombre}</span>
                      <Badge variant={product.tipo === 'plato' ? 'default' : 'secondary'}>
                        {product.tipo === 'plato' ? '🍽️ Plato' : '☕ Bebida'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {product.descripcion}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-medium">
                        {product.precio.toLocaleString('es-BO', {
                          style: 'currency',
                          currency: 'BOB',
                        })}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {product.categoria}
                      </span>
                    </div>
                  </div>
                  <img
                    src={product.urlImagen}
                    alt={product.nombre}
                    className="w-12 h-12 rounded-lg object-cover border"
                  />
                </div>
              ))
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleAddProducts}
              disabled={selectedProducts.length === 0 || isLoading}
            >
              {isLoading ? (
                <>Agregando...</>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Agregar ({selectedProducts.length})
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 
