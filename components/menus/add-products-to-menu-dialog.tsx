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
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { getProductos } from '@/server/product-queries';
import { addProductToMenu } from '@/server/queries/menu-queries';
import { useMenuStore } from '@/store/menu/menu-store';
import type { Menu, MenuProducto } from '@/store/menu/menu-store';

interface ProductWithQuantity {
  id: number;
  nombre: string;
  descripcion: string;
  cantidad: number | null;
  categoria: string;
  precio: number;
  tipo: 'plato' | 'bebida';
  urlImagen: string;
  cantidadPreparada: number;
}

interface AddProductsToMenuDialogProps {
  menu: Menu;
  trigger?: React.ReactNode;
}

export function AddProductsToMenuDialog({
  menu,
  trigger,
}: AddProductsToMenuDialogProps) {
  const [open, setOpen] = useState(false);
  const [allProducts, setAllProducts] = useState<ProductWithQuantity[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<ProductWithQuantity[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const updateMenu = useMenuStore((state) => state.updateMenu);

  // Get products not already in this menu
  const availableProducts = allProducts.filter(
    (product) => !menu.productos.some((p) => p.id === product.id)
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
      setAllProducts(
        products.map((p) => ({
          ...p,
          cantidadPreparada: 10, // Default quantity
        }))
      );
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Error al cargar productos');
    }
  };

  const handleProductSelect = (product: ProductWithQuantity) => {
    const exists = selectedProducts.find((p) => p.id === product.id);
    if (exists) {
      setSelectedProducts(selectedProducts.filter((p) => p.id !== product.id));
    } else {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  const updateProductQuantity = (productId: number, quantity: number) => {
    setSelectedProducts(
      selectedProducts.map((p) =>
        p.id === productId ? { ...p, cantidadPreparada: quantity } : p
      )
    );
  };

  const handleAddProducts = async () => {
    if (selectedProducts.length === 0) {
      toast.error('Selecciona al menos un producto');
      return;
    }

    setIsLoading(true);
    try {
      // Add each selected product to the menu
      for (const product of selectedProducts) {
        await addProductToMenu(menu.id, product.id, product.cantidadPreparada);
      }

      // Update the store
      const newMenuProducts: MenuProducto[] = selectedProducts.map((product) => ({
        ...product,
        cantidadVendida: 0,
      }));

      updateMenu({
        ...menu,
        productos: [...menu.productos, ...newMenuProducts],
      });

      toast.success(`Se agregaron ${selectedProducts.length} productos al menú`);
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
      <DialogContent className="max-w-4xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Agregar Productos al Menú
          </DialogTitle>
          <DialogDescription>
            Selecciona productos y define la cantidad esperada a preparar
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <Input
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Available Products */}
            <div className="space-y-3">
              <h3 className="font-medium">Productos Disponibles</h3>
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
                      className={`flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer ${
                        selectedProducts.some((p) => p.id === product.id)
                          ? 'border-blue-500 bg-blue-50'
                          : ''
                      }`}
                      onClick={() => handleProductSelect(product)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedProducts.some((p) => p.id === product.id)}
                        onChange={() => handleProductSelect(product)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <img
                        src={product.urlImagen}
                        alt={product.nombre}
                        className="w-12 h-12 rounded-lg object-cover border"
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
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Selected Products */}
            <div className="space-y-3">
              <h3 className="font-medium">
                Productos Seleccionados ({selectedProducts.length})
              </h3>
              <div className="max-h-96 overflow-y-auto space-y-2">
                {selectedProducts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Selecciona productos de la lista
                  </div>
                ) : (
                  selectedProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center space-x-3 p-3 border rounded-lg"
                    >
                      <img
                        src={product.urlImagen}
                        alt={product.nombre}
                        className="w-12 h-12 rounded-lg object-cover border"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{product.nombre}</span>
                          <Badge variant={product.tipo === 'plato' ? 'default' : 'secondary'}>
                            {product.tipo === 'plato' ? '🍽️' : '☕'}
                          </Badge>
                        </div>
                        <div className="space-y-2 mt-2">
                          <Label htmlFor={`quantity-${product.id}`} className="text-sm">
                            Cantidad a preparar:
                          </Label>
                          <Input
                            id={`quantity-${product.id}`}
                            type="number"
                            min="1"
                            value={product.cantidadPreparada}
                            onChange={(e) =>
                              updateProductQuantity(product.id, parseInt(e.target.value) || 1)
                            }
                            className="w-20"
                          />
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleProductSelect(product)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Quitar
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
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
