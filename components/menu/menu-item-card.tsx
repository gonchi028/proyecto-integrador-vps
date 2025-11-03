'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Producto } from '@/store/platos/platos-store';
import { Combo } from '@/store/combo/combo-store';
import { ComboProductsDialog } from '@/components/combos';
import { ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

interface MenuItemCardProps {
  item: Producto | Combo;
  type: 'producto' | 'combo';
}

export const MenuItemCard = ({ item, type }: MenuItemCardProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB',
    }).format(price);
  };

  const handleOrdenar = async () => {
    setLoading(true);
    try {
      // For now, redirect to mesa selection page
      // In a real app, you might want to create a pedido with a default cliente
      router.push('/dashboard/pedidos/mesas');
    } catch (error) {
      toast.error('Error al crear pedido');
      console.error('Error creating pedido:', error);
    } finally {
      setLoading(false);
    }
  };

  const isCombo = type === 'combo';
  const combo = isCombo ? (item as Combo) : null;
  const producto = !isCombo ? (item as Producto) : null;

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 h-full border-0 shadow-md hover:scale-[1.02] bg-card">
      <div className="relative overflow-hidden">
        <img
          src={item.urlImagen || '/placeholder-image.png'}
          alt={item.nombre}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-3 left-3">
          <Badge
            variant={isCombo ? 'default' : 'secondary'}
            className="bg-background/95 backdrop-blur-sm border-0 shadow-sm font-semibold text-primary"
          >
            {isCombo ? 'Combo' : producto?.tipo || 'Producto'}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Badge
            variant="outline"
            className="bg-background/95 backdrop-blur-sm border-0 shadow-sm font-semibold text-primary"
          >
            {formatPrice(item.precio)}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-4 space-y-3">
        <CardTitle className="text-xl font-bold line-clamp-2 min-h-[3.5rem] text-foreground group-hover:text-primary transition-colors duration-200">
          {item.nombre}
        </CardTitle>
        {producto && (
          <Badge
            variant="secondary"
            className="w-fit bg-muted text-muted-foreground"
          >
            {producto.categoria}
          </Badge>
        )}
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        {producto && (
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {producto.descripcion}
          </p>
        )}

                {combo && (
          <div className="space-y-4">
            <p className="text-sm font-medium text-foreground">
              Incluye {combo.productos.length} productos:
            </p>
            <div className="flex flex-wrap gap-2">
              {combo.productos.slice(0, 3).map((prod) => (
                <Badge 
                  key={prod.id} 
                  variant="outline" 
                  className="text-xs bg-primary/5 text-primary border-primary/20 hover:bg-primary/10 transition-colors"
                >
                  {prod.nombre}
                </Badge>
              ))}
              {combo.productos.length > 3 && (
                <Badge 
                  variant="outline" 
                  className="text-xs bg-muted text-muted-foreground border-border"
                >
                  +{combo.productos.length - 3} más
                </Badge>
              )}
            </div>
            <div className="pt-2 border-t border-border/50">
              <ComboProductsDialog combo={combo} variant="card" />
            </div>
          </div>
        )}

        {/* Order Button */}
        <div className="pt-4 border-t border-border/50">
          <Button 
            onClick={handleOrdenar}
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {loading ? 'Creando pedido...' : 'Ordenar ahora'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}; 
