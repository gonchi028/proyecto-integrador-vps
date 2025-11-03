'use client';

import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Edit, Trash2, Copy, Eye, Phone, Mail, MapPin, Package } from 'lucide-react';
import { type Proveedor, useProveedorStore } from '@/store/proveedor/proveedor-store';
import { deleteProveedor } from '@/server/queries/proveedores-queries';
import { toast } from 'sonner';
import { useProveedores } from '@/hooks/useProveedores';
import { UpdateProveedorDialog } from './update-proveedor-dialog';
import { ProveedorProductsDialog } from './proveedor-products-dialog';
import { ManageProveedorProductsDialog } from './manage-proveedor-products-dialog';

interface ProveedoresGridProps {
  searchTerm: string;
}

export const ProveedoresGrid = ({ searchTerm }: ProveedoresGridProps) => {
  useProveedores();
  
  const proveedores = useProveedorStore((state) => state.proveedores);
  const { deleteProveedor: deleteProveedorFromStore } = useProveedorStore();
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Filter proveedores based on search term
  const filteredProveedores = proveedores.filter((proveedor) =>
    proveedor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proveedor.correo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proveedor.direccion?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteProveedor = async (id: number) => {
    try {
      await deleteProveedor(id);
      deleteProveedorFromStore(id);
      toast.success('Proveedor eliminado exitosamente');
    } catch (error) {
      console.error('Error deleting proveedor:', error);
      toast.error('Error al eliminar proveedor');
    }
  };

  const copyToClipboard = async (text: string, id: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
      toast.success('ID copiado al portapapeles');
    } catch (err) {
      console.error('Error copying to clipboard:', err);
      toast.error('Error al copiar');
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProveedores.map((proveedor) => (
          <Card key={proveedor.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative bg-gradient-to-br from-blue-50 to-blue-100 p-6">
              <div className="absolute top-2 right-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="sm" className="h-8 w-8 p-0">
                      <span className="sr-only">Abrir menú</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => copyToClipboard(proveedor.id.toString(), proveedor.id)}
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      {copiedId === proveedor.id ? 'Copiado' : 'Copiar ID'}
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <ProveedorProductsDialog proveedor={proveedor} />
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <ManageProveedorProductsDialog 
                        proveedor={proveedor}
                        trigger={
                          <div className="flex items-center w-full">
                            <Edit className="mr-2 h-4 w-4" />
                            Administrar Productos
                          </div>
                        }
                      />
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleDeleteProveedor(proveedor.id)}>
                      <Trash2 className="mr-2 h-4 w-4 text-red-600" />
                      <span className="text-red-600">Eliminar</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="absolute top-2 left-2">
                <Badge className="bg-blue-600">
                  <Package className="h-3 w-3 mr-1" />
                  {proveedor.productos.length} productos
                </Badge>
              </div>
              <div className="flex flex-col items-center mt-8">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-3">
                  <Package className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-lg text-center">{proveedor.nombre}</h3>
              </div>
            </div>
            
            <CardContent className="p-4">
              <div className="space-y-3">
                {/* Contact Information */}
                <div className="space-y-2">
                  {proveedor.celular && (
                    <div className="flex items-center text-sm">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{proveedor.celular}</span>
                    </div>
                  )}
                  {proveedor.telefono && (
                    <div className="flex items-center text-sm">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{proveedor.telefono}</span>
                    </div>
                  )}
                  {proveedor.correo && (
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="truncate">{proveedor.correo}</span>
                    </div>
                  )}
                  {proveedor.direccion && (
                    <div className="flex items-start text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                      <span className="line-clamp-2">{proveedor.direccion}</span>
                    </div>
                  )}
                </div>

                {/* Products Preview */}
                {proveedor.productos.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Productos suministrados:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {proveedor.productos.slice(0, 3).map((producto) => (
                        <Badge key={producto.id} variant="secondary" className="text-xs">
                          {producto.nombre}
                        </Badge>
                      ))}
                      {proveedor.productos.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{proveedor.productos.length - 3} más
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-3 border-t">
                  <UpdateProveedorDialog proveedor={proveedor} />
                  <ProveedorProductsDialog proveedor={proveedor} variant="card" />
                  <ManageProveedorProductsDialog 
                    proveedor={proveedor}
                    trigger={
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="h-4 w-4 mr-1" />
                        Administrar
                      </Button>
                    }
                  />
                </div>

                {/* ID Badge */}
                <div className="flex justify-center pt-2">
                  <Badge variant="outline" className="text-xs">
                    ID: {proveedor.id}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredProveedores.length === 0 && (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            No se encontraron proveedores
          </div>
        )}
      </div>
    </>
  );
}; 
