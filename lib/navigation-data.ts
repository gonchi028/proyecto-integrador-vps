import {
  Bot,
  SoupIcon,
  SquareTerminal,
  UsersIcon,
  UtensilsIcon,
} from 'lucide-react';

export const navigationData = {
  restaurant: {
    name: 'Terrasse',
    imgUrl:
      'https://previews.123rf.com/images/maxutov/maxutov1710/maxutov171000042/87944028-cocinar-el-restaurante-cocinero-ilustraci%C3%B3n-de-vector-aislado-en-un-fondo-blanco.jpg',
  },
  navMain: [
    {
      title: 'Productos',
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: 'Platos',
          url: '/dashboard/productos/platos',
        },
        {
          title: 'Bebidas',
          url: '/dashboard/productos/bebidas',
        },
        {
          title: 'Combos',
          url: '/dashboard/productos/combos',
        },
        {
          title: 'Proveedores',
          url: '/dashboard/productos/proveedores',
        },
      ],
    },
    {
      title: 'Atencion',
      icon: UtensilsIcon,
      isActive: true,
      items: [
        {
          title: 'Menu',
          url: '/dashboard/pedidos/menu',
        },
        {
          title: 'Pedidos',
          url: '/dashboard/pedidos/lista',
        },
        {
          title: 'Mesas',
          url: '/dashboard/pedidos/mesas',
        },
        {
          title: 'Reservas',
          url: '/dashboard/pedidos/reservas',
        },
      ],
    },
    {
      title: 'Cocina',
      icon: SoupIcon,
      isActive: true,
      items: [
        {
          title: 'Platos en cocina',
          url: '/dashboard/cocina/lista',
        },
      ],
    },
    {
      title: 'Personas',
      icon: UsersIcon,
      isActive: true,
      items: [
        {
          title: 'Usuarios',
          url: '/dashboard/personas/usuarios',
        },
        {
          title: 'Clientes',
          url: '/dashboard/personas/clientes',
        },
      ],
    },
  ],
};
