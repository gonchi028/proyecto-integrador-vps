import { create } from 'zustand';

export type Atencion = {
  estado: string;
  fechaHora: string;
  id_cliente: {
    avatar_url: string;
    created_at: string;
    email: string;
    id: string;
    name: string;
    user_name: string;
  };
  id_mesero: {
    avatar_url: string;
    created_at: string;
    email: string;
    id: string;
    name: string;
    user_name: string;
  };
  id_pedido: number | null;
  idAtencion: number;
  mesa: number;
};

interface State {
  listaAtenciones: Atencion[];
  setListaAtenciones: (value: Atencion[]) => void;
}

export const useAtencionStore = create<State>()((set) => ({
  listaAtenciones: [],
  setListaAtenciones: (lista: Atencion[]) =>
    set((state) => ({ listaAtenciones: lista })),
}));
