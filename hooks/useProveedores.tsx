'use client';

import { useEffect } from 'react';
import { useProveedorStore } from '@/store/proveedor/proveedor-store';
import { getProveedores } from '@/server/queries/proveedores-queries';

export const useProveedores = () => {
  const { proveedores, setProveedores } = useProveedorStore();

  const fetchProveedores = async () => {
    try {
      const data = await getProveedores();
      setProveedores(data);
    } catch (error) {
      console.error('Error fetching proveedores:', error);
    }
  };

  useEffect(() => {
    fetchProveedores();
  }, []);

  return {
    proveedores,
    refetch: fetchProveedores,
  };
}; 
