'use client';

import { useEffect, useMemo } from 'react';
import { MenuSection } from './menu-section';
import { usePlatosStore } from '@/store/platos/platos-store';
import { useCombosStore } from '@/store/combo/combo-store';
import { useBebidasStore } from '@/store/bebida/bebida-store';
import { useProductos, useCombos } from '@/hooks';
import { 
  Coffee, 
  UtensilsCrossed, 
  Wine, 
  Package,
  ChefHat,
  Sparkles 
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export const MenuDisplay = () => {
  // Load data using hooks
  useProductos();
  useCombos();

  // Get data from stores
  const platos = usePlatosStore((state) => state.platos);
  const bebidas = useBebidasStore((state) => state.bebidas);
  const combos = useCombosStore((state) => state.combos);

  // Group products by category
  const platosByCategory = useMemo(() => {
    const categories = platos.reduce((acc, plato) => {
      if (!acc[plato.categoria]) {
        acc[plato.categoria] = [];
      }
      acc[plato.categoria].push(plato);
      return acc;
    }, {} as Record<string, typeof platos>);
    
    return categories;
  }, [platos]);

  const bebidasByCategory = useMemo(() => {
    const categories = bebidas.reduce((acc: Record<string, typeof bebidas>, bebida) => {
      if (!acc[bebida.categoria]) {
        acc[bebida.categoria] = [];
      }
      acc[bebida.categoria].push(bebida);
      return acc;
    }, {} as Record<string, typeof bebidas>);
    
    return categories;
  }, [bebidas]);

  // Filter active combos
  const activeCombos = useMemo(() => {
    return combos.filter(combo => combo.estado.toLowerCase() === 'activo');
  }, [combos]);

  const isLoading = platos.length === 0 && bebidas.length === 0 && combos.length === 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="mb-12">
              <Skeleton className="h-8 w-48 mb-6" />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((j) => (
                  <Skeleton key={j} className="h-80 w-full rounded-lg" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-2 rounded-full bg-primary/10">
                <ChefHat className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
                Nuestro Menú
              </h1>
              <div className="p-2 rounded-full bg-primary/10">
                <ChefHat className="h-8 w-8 text-primary" />
              </div>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Descubre nuestra deliciosa selección de platos, bebidas y combos especiales
            </p>
          </div>
        </div>
      </div>

      {/* Menu Content */}
      <div className="container mx-auto px-4 py-12">
                {/* Combos Section */}
        {activeCombos.length > 0 && (
          <MenuSection
            title="Combos Especiales"
            items={activeCombos}
            type="combo"
            icon={<Sparkles className="h-6 w-6 text-primary" />}
          />
        )}

        {/* Platos by Category */}
        {Object.entries(platosByCategory).map(([category, items]) => (
          <MenuSection
            key={`platos-${category}`}
            title={`${category}`}
            items={items}
            type="producto"
            icon={<UtensilsCrossed className="h-6 w-6 text-primary" />}
          />
        ))}

        {/* Bebidas by Category */}
        {Object.entries(bebidasByCategory).map(([category, items]) => (
          <MenuSection
            key={`bebidas-${category}`}
            title={`${category}`}
            items={items as any[]}
            type="producto"
            icon={<Wine className="h-6 w-6 text-primary" />}
          />
        ))}

        {/* Empty State */}
        {platos.length === 0 && bebidas.length === 0 && combos.length === 0 && (
          <div className="text-center py-16">
            <div className="p-4 rounded-full bg-muted/50 w-fit mx-auto mb-6">
              <Package className="h-16 w-16 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No hay productos disponibles
            </h3>
            <p className="text-muted-foreground">
              Pronto tendremos deliciosos platos y bebidas para ti
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t bg-card/30 mt-16">
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-muted-foreground text-lg">
            ¿Tienes alguna pregunta sobre nuestro menú?{' '}
            <span className="text-primary font-medium">No dudes en consultarnos.</span>
          </p>
        </div>
      </div>
    </div>
  );
}; 
