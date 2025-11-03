'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useProveedorStore } from '@/store/proveedor/proveedor-store';
import { addProveedor } from '@/server/queries/proveedores-queries';


interface AddProveedorFormProps {
  onSuccess?: () => void;
}

export const AddProveedorForm = ({ onSuccess }: AddProveedorFormProps) => {
  const [formData, setFormData] = useState({
    nombre: '',
    celular: '',
    telefono: '',
    correo: '',
    direccion: '',
  });

  const { addProveedor: addProveedorToStore } = useProveedorStore();

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
      const newProveedor = await addProveedor({
        nombre: formData.nombre,
        celular: formData.celular || undefined,
        telefono: formData.telefono || undefined,
        correo: formData.correo || undefined,
        direccion: formData.direccion || undefined,
      });

      addProveedorToStore({...newProveedor, productos: []});
      toast.success('Proveedor agregado exitosamente');
      
      // Reset form
      setFormData({
        nombre: '',
        celular: '',
        telefono: '',
        correo: '',
        direccion: '',
      });

      onSuccess?.();
    } catch (error) {
      console.error('Error adding proveedor:', error);
      toast.error('Error al agregar proveedor');
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
          Agregar Proveedor
        </Button>
      </div>
    </form>
  );
}; 
