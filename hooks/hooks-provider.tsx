'use client';
import {
  useProductos,
  useMesas,
  usePedidos,
  useUsuarios,
  useCombos,
  useCocina,
} from '@/hooks';

type Props = {
  children: React.ReactNode;
};

export const HooksProvider = ({ children }: Props) => {
  useProductos();
  useMesas();
  usePedidos();
  useUsuarios();
  useCombos();
  useCocina();

  return <>{children}</>;
};
