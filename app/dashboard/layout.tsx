'use client';

import { useState, useEffect, Fragment } from 'react';
import Link from 'next/link';
import {
  BadgeCheck,
  Bell,
  ChevronRight,
  ChevronsUpDown,
  CreditCard,
  LogOut,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';
import { createClient } from '@/utils/supabase/client';
import { useUserStore } from '@/store';
import { signOut } from '../(autenticacion)/login/actions';
import { navigationData } from '@/lib/navigation-data';
import { usePathname } from 'next/navigation';

import { HooksProvider } from '@/hooks';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);

  const supabase = createClient();

  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    const updateUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    updateUser();
  }, [supabase, setUser]);

  const cerrarSesion = async () => {
    await signOut();
  };

  const pathName = usePathname();
  const breadCrumbs = pathName.split('/');

  // Helper function to get user display name
  const getUserDisplayName = () => {
    if (user?.user_metadata?.name) return user.user_metadata.name;
    if (user?.user_metadata?.full_name) return user.user_metadata.full_name;
    if (user?.email) return user.email.split('@')[0];
    return 'Usuario';
  };

  // Helper function to get user avatar URL
  const getUserAvatarUrl = () => {
    if (user?.user_metadata?.avatar_url) return user.user_metadata.avatar_url;
    if (user?.user_metadata?.picture) return user.user_metadata.picture;
    if (user?.email) return `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`;
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=default`;
  };

  // Helper function to get user initials
  const getUserInitials = () => {
    const name = getUserDisplayName();
    if (name && name !== 'Usuario') {
      return name.split(' ').map((word: string) => word[0]).join('').toUpperCase().slice(0, 2);
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return 'US';
  };

  return (
    <HooksProvider>
      <SidebarProvider open={open} onOpenChange={setOpen}>
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <div className="flex gap-2 items-center">
                  <Avatar className={`${open ? 'size-12' : 'size-8'}`}>
                    <AvatarImage
                      src={navigationData.restaurant.imgUrl}
                      alt={navigationData.restaurant.name}
                    />
                    <AvatarFallback>TE</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight grow">
                    <span className="truncate font-semibold">
                      {navigationData.restaurant.name}
                    </span>
                    <span className="truncate text-xs">Administrador</span>
                  </div>
                </div>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Administracion</SidebarGroupLabel>
              <SidebarMenu>
                {navigationData.navMain.map((item) => (
                  <Collapsible
                    key={item.title}
                    asChild
                    defaultOpen={item.isActive}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip={item.title}>
                          {item.icon && <item.icon />}
                          <span>{item.title}</span>
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items?.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={pathName === subItem.url}
                              >
                                <Link href={subItem.url}>
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                      size="lg"
                      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    >
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage
                          src={getUserAvatarUrl()}
                          alt={getUserDisplayName()}
                        />
                        <AvatarFallback className="rounded-lg">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {getUserDisplayName()}
                        </span>
                        <span className="truncate text-xs">
                          {user?.email || ''}
                        </span>
                      </div>
                      <ChevronsUpDown className="ml-auto size-4" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                    side="bottom"
                    align="end"
                    sideOffset={4}
                  >
                    <DropdownMenuLabel className="p-0 font-normal">
                      <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar className="h-8 w-8 rounded-lg">
                          <AvatarImage
                            src={getUserAvatarUrl()}
                            alt={getUserDisplayName()}
                          />
                          <AvatarFallback className="rounded-lg">
                            {getUserInitials()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-semibold">
                            {getUserDisplayName()}
                          </span>
                          <span className="truncate text-xs">
                            {user?.email || ''}
                          </span>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        <BadgeCheck />
                        Cuenta
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <CreditCard />
                        Facturación
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Bell />
                        Notificaciones
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={cerrarSesion}>
                      <LogOut className="text-red-600" />
                      <span className="text-red-600">Cerrar sesión</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>

        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink asChild>
                      <Link href="/dashboard">Dashboard</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {breadCrumbs.map((item, index) => {
                    if (index < 2) return null;
                    return (
                      <Fragment key={index}>
                        <BreadcrumbSeparator className="hidden md:block" />
                        <BreadcrumbItem>
                          <BreadcrumbPage className="capitalize">
                            {item}
                          </BreadcrumbPage>
                        </BreadcrumbItem>
                      </Fragment>
                    );
                  })}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 pt-0 max-w-[100vw]">
            {children}
          </main>
          <Toaster />
        </SidebarInset>
      </SidebarProvider>
    </HooksProvider>
  );
}
