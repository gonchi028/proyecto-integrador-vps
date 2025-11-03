'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useProveedorStore, type Proveedor } from '@/store/proveedor/proveedor-store';
import { updateProveedor } from '@/server/queries/proveedores-queries';

interface UpdateProveedorFormProps {
  proveedor: Proveedor;
  onSuccess?: () => void;
}

export const UpdateProveedorForm = ({ proveedor, onSuccess }: UpdateProveedorFormProps) => {
  const [formData, setFormData] = useState({
    nombre: '',
    celular: '',
    telefono: '',
    correo: '',
    direccion: '',
  });

  const { updateProveedor: updateProveedorInStore } = useProveedorStore();

  useEffect(() => {
    setFormData({
      nombre: proveedor.nombre || '',
      celular: proveedor.celular || '',
      telefono: proveedor.telefono || '',
      correo: proveedor.correo || '',
      direccion: proveedor.direccion || '',
    });
  }, [proveedor]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombre.trim()) {
      toast.error('El nombre es requerido');
      return;
    }

    try {
      const updatedProveedor = await updateProveedor({
        id: proveedor.id,
        nombre: formData.nombre,
        celular: formData.celular || undefined,
        telefono: formData.telefono || undefined,
        correo: formData.correo || undefined,
        direccion: formData.direccion || undefined,
      });

      updateProveedorInStore({...updatedProveedor, productos: []});
      toast.success('Proveedor actualizado exitosamente');
      onSuccess?.();
    } catch (error) {
      console.error('Error updating proveedor:', error);
      toast.error('Error al actualizar proveedor');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre *</Label>
          <Input
            id="nombre"
            type="text"
            value={formData.nombre}
            onChange={(e) => handleInputChange('nombre', e.target.value)}
            placeholder="Nombre del proveedor"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="celular">Celular</Label>
          <Input
            id="celular"
            type="text"
            value={formData.celular}
            onChange={(e) => handleInputChange('celular', e.target.value)}
            placeholder="Número de celular"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="telefono">Teléfono</Label>
          <Input
            id="telefono"
            type="text"
            value={formData.telefono}
            onChange={(e) => handleInputChange('telefono', e.target.value)}
            placeholder="Número de teléfono"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="correo">Correo</Label>
          <Input
            id="correo"
            type="email"
            value={formData.correo}
            onChange={(e) => handleInputChange('correo', e.target.value)}
            placeholder="correo@ejemplo.com"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="direccion">Dirección</Label>
          <Input
            id="direccion"
            type="text"
            value={formData.direccion}
            onChange={(e) => handleInputChange('direccion', e.target.value)}
            placeholder="Dirección del proveedor"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="submit">
          Actualizar Proveedor
        </Button>
      </div>
    </form>
  );
}; 
