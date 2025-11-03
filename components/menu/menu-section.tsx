'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { MenuItemCard } from './menu-item-card';
import { Producto } from '@/store/platos/platos-store';
import { Combo } from '@/store/combo/combo-store';

interface MenuSectionProps {
  title: string;
  items: (Producto | Combo)[];
  type: 'producto' | 'combo';
  icon?: React.ReactNode;
}

export const MenuSection = ({ title, items, type, icon }: MenuSectionProps) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="mb-16">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-2 rounded-full bg-primary/10">
          {icon}
        </div>
        <h2 className="text-3xl font-bold text-foreground tracking-tight">{title}</h2>
        <div className="h-px bg-gradient-to-r from-border to-transparent flex-1 ml-6" />
      </div>
      
      <Carousel
        opts={{
          align: "start",
          loop: false,
          dragFree: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-3 md:-ml-4">
          {items.map((item) => (
            <CarouselItem key={item.id} className="pl-3 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
              <MenuItemCard item={item} type={type} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex -left-12 border-border bg-background hover:bg-muted shadow-md" />
        <CarouselNext className="hidden md:flex -right-12 border-border bg-background hover:bg-muted shadow-md" />
      </Carousel>
    </div>
  );
}; 
