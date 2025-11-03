export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      cliente: {
        Row: {
          celular: string | null;
          ci: string;
          direccion: string | null;
          nit: string | null;
          nombre: string;
          notasEntrega: string | null;
          puntos: number | null;
          razonSocial: string | null;
        };
        Insert: {
          celular?: string | null;
          ci: string;
          direccion?: string | null;
          nit?: string | null;
          nombre: string;
          notasEntrega?: string | null;
          puntos?: number | null;
          razonSocial?: string | null;
        };
        Update: {
          celular?: string | null;
          ci?: string;
          direccion?: string | null;
          nit?: string | null;
          nombre?: string;
          notasEntrega?: string | null;
          puntos?: number | null;
          razonSocial?: string | null;
        };
        Relationships: [];
      };
      combo: {
        Row: {
          estado: string;
          id: number;
          nombre: string;
          precio: number;
          urlImagen: string | null;
        };
        Insert: {
          estado: string;
          id?: number;
          nombre: string;
          precio: number;
          urlImagen?: string | null;
        };
        Update: {
          estado?: string;
          id?: number;
          nombre?: string;
          precio?: number;
          urlImagen?: string | null;
        };
        Relationships: [];
      };
      detalleCombo: {
        Row: {
          calificacion: number | null;
          cantidad: number;
          combo_id: number;
          detallePedido_id: number;
          estado: Database['public']['Enums']['estadoOrden'];
        };
        Insert: {
          calificacion?: number | null;
          cantidad: number;
          combo_id: number;
          detallePedido_id: number;
          estado: Database['public']['Enums']['estadoOrden'];
        };
        Update: {
          calificacion?: number | null;
          cantidad?: number;
          combo_id?: number;
          detallePedido_id?: number;
          estado?: Database['public']['Enums']['estadoOrden'];
        };
        Relationships: [
          {
            foreignKeyName: 'detalleCombo_combo_id_combo_id_fk';
            columns: ['combo_id'];
            isOneToOne: false;
            referencedRelation: 'combo';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'detalleCombo_detallePedido_id_detallePedido_id_fk';
            columns: ['detallePedido_id'];
            isOneToOne: false;
            referencedRelation: 'detallePedido';
            referencedColumns: ['id'];
          }
        ];
      };
      detallePedido: {
        Row: {
          id: number;
          total: number;
        };
        Insert: {
          id?: number;
          total: number;
        };
        Update: {
          id?: number;
          total?: number;
        };
        Relationships: [];
      };
      detalleProductos: {
        Row: {
          calificacion: number | null;
          cantidad: number;
          detallePedido_id: number;
          estado: Database['public']['Enums']['estadoOrden'];
          producto_id: number;
        };
        Insert: {
          calificacion?: number | null;
          cantidad: number;
          detallePedido_id: number;
          estado: Database['public']['Enums']['estadoOrden'];
          producto_id: number;
        };
        Update: {
          calificacion?: number | null;
          cantidad?: number;
          detallePedido_id?: number;
          estado?: Database['public']['Enums']['estadoOrden'];
          producto_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'detalleProductos_detallePedido_id_detallePedido_id_fk';
            columns: ['detallePedido_id'];
            isOneToOne: false;
            referencedRelation: 'detallePedido';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'detalleProductos_producto_id_producto_id_fk';
            columns: ['producto_id'];
            isOneToOne: false;
            referencedRelation: 'producto';
            referencedColumns: ['id'];
          }
        ];
      };
      factura: {
        Row: {
          id: number;
          nit: string;
          pago_id: number;
          razonSocial: string;
        };
        Insert: {
          id?: number;
          nit: string;
          pago_id: number;
          razonSocial: string;
        };
        Update: {
          id?: number;
          nit?: string;
          pago_id?: number;
          razonSocial?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'factura_pago_id_pago_id_fk';
            columns: ['pago_id'];
            isOneToOne: false;
            referencedRelation: 'pago';
            referencedColumns: ['id'];
          }
        ];
      };
      menu: {
        Row: {
          descripcion: string;
          estado: string;
          fecha: string;
          id: number;
        };
        Insert: {
          descripcion: string;
          estado: string;
          fecha: string;
          id?: number;
        };
        Update: {
          descripcion?: string;
          estado?: string;
          fecha?: string;
          id?: number;
        };
        Relationships: [];
      };
      menuProducto: {
        Row: {
          cantidadPreparada: number;
          cantidadVendida: number;
          menu_id: number;
          producto_id: number;
        };
        Insert: {
          cantidadPreparada: number;
          cantidadVendida: number;
          menu_id: number;
          producto_id: number;
        };
        Update: {
          cantidadPreparada?: number;
          cantidadVendida?: number;
          menu_id?: number;
          producto_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'menuProducto_menu_id_menu_id_fk';
            columns: ['menu_id'];
            isOneToOne: false;
            referencedRelation: 'menu';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'menuProducto_producto_id_producto_id_fk';
            columns: ['producto_id'];
            isOneToOne: false;
            referencedRelation: 'producto';
            referencedColumns: ['id'];
          }
        ];
      };
      mesa: {
        Row: {
          estado: Database['public']['Enums']['estadoMesa'];
          id: number;
          numero: number;
        };
        Insert: {
          estado: Database['public']['Enums']['estadoMesa'];
          id?: number;
          numero: number;
        };
        Update: {
          estado?: Database['public']['Enums']['estadoMesa'];
          id?: number;
          numero?: number;
        };
        Relationships: [];
      };
      pago: {
        Row: {
          fechaHora: string;
          id: number;
          monto: number;
          tipo: string;
        };
        Insert: {
          fechaHora: string;
          id?: number;
          monto: number;
          tipo: string;
        };
        Update: {
          fechaHora?: string;
          id?: number;
          monto?: number;
          tipo?: string;
        };
        Relationships: [];
      };
      pedido: {
        Row: {
          calificacionMesero: number | null;
          cliente_ci: string;
          detallePedido_id: number | null;
          estado: Database['public']['Enums']['estadoPedido'];
          fechaHoraEntrega: string;
          fechaHoraPedido: string;
          id: number;
          mesa_id: number;
          mesero_id: string;
          pago_id: number | null;
          tipo: string;
        };
        Insert: {
          calificacionMesero?: number | null;
          cliente_ci: string;
          detallePedido_id?: number | null;
          estado: Database['public']['Enums']['estadoPedido'];
          fechaHoraEntrega: string;
          fechaHoraPedido: string;
          id?: number;
          mesa_id: number;
          mesero_id: string;
          pago_id?: number | null;
          tipo: string;
        };
        Update: {
          calificacionMesero?: number | null;
          cliente_ci?: string;
          detallePedido_id?: number | null;
          estado?: Database['public']['Enums']['estadoPedido'];
          fechaHoraEntrega?: string;
          fechaHoraPedido?: string;
          id?: number;
          mesa_id?: number;
          mesero_id?: string;
          pago_id?: number | null;
          tipo?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'pedido_cliente_ci_cliente_ci_fk';
            columns: ['cliente_ci'];
            isOneToOne: false;
            referencedRelation: 'cliente';
            referencedColumns: ['ci'];
          },
          {
            foreignKeyName: 'pedido_detallePedido_id_detallePedido_id_fk';
            columns: ['detallePedido_id'];
            isOneToOne: false;
            referencedRelation: 'detallePedido';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'pedido_mesa_id_mesa_id_fk';
            columns: ['mesa_id'];
            isOneToOne: false;
            referencedRelation: 'mesa';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'pedido_mesero_id_user_id_fk';
            columns: ['mesero_id'];
            isOneToOne: false;
            referencedRelation: 'user';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'pedido_pago_id_pago_id_fk';
            columns: ['pago_id'];
            isOneToOne: false;
            referencedRelation: 'pago';
            referencedColumns: ['id'];
          }
        ];
      };
      producto: {
        Row: {
          cantidad: number | null;
          categoria: string;
          descripcion: string;
          id: number;
          nombre: string;
          precio: number;
          tipo: Database['public']['Enums']['tipoProducto'];
          urlImagen: string;
        };
        Insert: {
          cantidad?: number | null;
          categoria: string;
          descripcion: string;
          id?: number;
          nombre: string;
          precio: number;
          tipo: Database['public']['Enums']['tipoProducto'];
          urlImagen: string;
        };
        Update: {
          cantidad?: number | null;
          categoria?: string;
          descripcion?: string;
          id?: number;
          nombre?: string;
          precio?: number;
          tipo?: Database['public']['Enums']['tipoProducto'];
          urlImagen?: string;
        };
        Relationships: [];
      };
      productoCombo: {
        Row: {
          combo_id: number;
          producto_id: number;
        };
        Insert: {
          combo_id: number;
          producto_id: number;
        };
        Update: {
          combo_id?: number;
          producto_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'productoCombo_combo_id_combo_id_fk';
            columns: ['combo_id'];
            isOneToOne: false;
            referencedRelation: 'combo';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'productoCombo_producto_id_producto_id_fk';
            columns: ['producto_id'];
            isOneToOne: false;
            referencedRelation: 'producto';
            referencedColumns: ['id'];
          }
        ];
      };
      productoProveedor: {
        Row: {
          producto_id: number;
          proveedor_id: number;
        };
        Insert: {
          producto_id: number;
          proveedor_id: number;
        };
        Update: {
          producto_id?: number;
          proveedor_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'productoProveedor_producto_id_producto_id_fk';
            columns: ['producto_id'];
            isOneToOne: false;
            referencedRelation: 'producto';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'productoProveedor_proveedor_id_proveedor_id_fk';
            columns: ['proveedor_id'];
            isOneToOne: false;
            referencedRelation: 'proveedor';
            referencedColumns: ['id'];
          }
        ];
      };
      proveedor: {
        Row: {
          celular: string | null;
          correo: string | null;
          direccion: string | null;
          id: number;
          nombre: string;
          telefono: string | null;
        };
        Insert: {
          celular?: string | null;
          correo?: string | null;
          direccion?: string | null;
          id?: number;
          nombre: string;
          telefono?: string | null;
        };
        Update: {
          celular?: string | null;
          correo?: string | null;
          direccion?: string | null;
          id?: number;
          nombre?: string;
          telefono?: string | null;
        };
        Relationships: [];
      };
      reserva: {
        Row: {
          cantidadPersonas: number;
          cliente_ci: string;
          estado: Database['public']['Enums']['estadoReserva'];
          fechaHora: string;
          id: number;
          mesa: number;
        };
        Insert: {
          cantidadPersonas: number;
          cliente_ci: string;
          estado: Database['public']['Enums']['estadoReserva'];
          fechaHora: string;
          id?: number;
          mesa: number;
        };
        Update: {
          cantidadPersonas?: number;
          cliente_ci?: string;
          estado?: Database['public']['Enums']['estadoReserva'];
          fechaHora?: string;
          id?: number;
          mesa?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'reserva_cliente_ci_cliente_ci_fk';
            columns: ['cliente_ci'];
            isOneToOne: false;
            referencedRelation: 'cliente';
            referencedColumns: ['ci'];
          }
        ];
      };
      reservaPlatos: {
        Row: {
          cantidad: number;
          producto_id: number | null;
          reserva_id: number | null;
        };
        Insert: {
          cantidad: number;
          producto_id?: number | null;
          reserva_id?: number | null;
        };
        Update: {
          cantidad?: number;
          producto_id?: number | null;
          reserva_id?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'reservaPlatos_producto_id_producto_id_fk';
            columns: ['producto_id'];
            isOneToOne: false;
            referencedRelation: 'producto';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'reservaPlatos_reserva_id_reserva_id_fk';
            columns: ['reserva_id'];
            isOneToOne: false;
            referencedRelation: 'reserva';
            referencedColumns: ['id'];
          }
        ];
      };
      user: {
        Row: {
          avatar_url: string;
          cliente_ci: string | null;
          email: string;
          id: string;
          name: string;
          user_name: string;
        };
        Insert: {
          avatar_url: string;
          cliente_ci?: string | null;
          email: string;
          id: string;
          name: string;
          user_name: string;
        };
        Update: {
          avatar_url?: string;
          cliente_ci?: string | null;
          email?: string;
          id?: string;
          name?: string;
          user_name?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_cliente_ci_cliente_ci_fk';
            columns: ['cliente_ci'];
            isOneToOne: false;
            referencedRelation: 'cliente';
            referencedColumns: ['ci'];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      estadoMesa: 'ocupada' | 'libre' | 'reservada';
      estadoOrden: 'pendiente' | 'en preparacion' | 'entregado';
      estadoPedido:
        | 'pendiente'
        | 'cancelado'
        | 'en camino'
        | 'listo para recoger'
        | 'entregado';
      estadoReserva:
        | 'pendiente'
        | 'confirmada'
        | 'cancelada'
        | 'utilizada'
        | 'no asistio';
      tipoProducto: 'plato' | 'bebida';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null;
          avif_autodetection: boolean | null;
          created_at: string | null;
          file_size_limit: number | null;
          id: string;
          name: string;
          owner: string | null;
          owner_id: string | null;
          public: boolean | null;
          updated_at: string | null;
        };
        Insert: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id: string;
          name: string;
          owner?: string | null;
          owner_id?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Update: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id?: string;
          name?: string;
          owner?: string | null;
          owner_id?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      migrations: {
        Row: {
          executed_at: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Insert: {
          executed_at?: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Update: {
          executed_at?: string | null;
          hash?: string;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      objects: {
        Row: {
          bucket_id: string | null;
          created_at: string | null;
          id: string;
          last_accessed_at: string | null;
          metadata: Json | null;
          name: string | null;
          owner: string | null;
          owner_id: string | null;
          path_tokens: string[] | null;
          updated_at: string | null;
          user_metadata: Json | null;
          version: string | null;
        };
        Insert: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          owner_id?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          user_metadata?: Json | null;
          version?: string | null;
        };
        Update: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          owner_id?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          user_metadata?: Json | null;
          version?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'objects_bucketId_fkey';
            columns: ['bucket_id'];
            isOneToOne: false;
            referencedRelation: 'buckets';
            referencedColumns: ['id'];
          }
        ];
      };
      s3_multipart_uploads: {
        Row: {
          bucket_id: string;
          created_at: string;
          id: string;
          in_progress_size: number;
          key: string;
          owner_id: string | null;
          upload_signature: string;
          user_metadata: Json | null;
          version: string;
        };
        Insert: {
          bucket_id: string;
          created_at?: string;
          id: string;
          in_progress_size?: number;
          key: string;
          owner_id?: string | null;
          upload_signature: string;
          user_metadata?: Json | null;
          version: string;
        };
        Update: {
          bucket_id?: string;
          created_at?: string;
          id?: string;
          in_progress_size?: number;
          key?: string;
          owner_id?: string | null;
          upload_signature?: string;
          user_metadata?: Json | null;
          version?: string;
        };
        Relationships: [
          {
            foreignKeyName: 's3_multipart_uploads_bucket_id_fkey';
            columns: ['bucket_id'];
            isOneToOne: false;
            referencedRelation: 'buckets';
            referencedColumns: ['id'];
          }
        ];
      };
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string;
          created_at: string;
          etag: string;
          id: string;
          key: string;
          owner_id: string | null;
          part_number: number;
          size: number;
          upload_id: string;
          version: string;
        };
        Insert: {
          bucket_id: string;
          created_at?: string;
          etag: string;
          id?: string;
          key: string;
          owner_id?: string | null;
          part_number: number;
          size?: number;
          upload_id: string;
          version: string;
        };
        Update: {
          bucket_id?: string;
          created_at?: string;
          etag?: string;
          id?: string;
          key?: string;
          owner_id?: string | null;
          part_number?: number;
          size?: number;
          upload_id?: string;
          version?: string;
        };
        Relationships: [
          {
            foreignKeyName: 's3_multipart_uploads_parts_bucket_id_fkey';
            columns: ['bucket_id'];
            isOneToOne: false;
            referencedRelation: 'buckets';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 's3_multipart_uploads_parts_upload_id_fkey';
            columns: ['upload_id'];
            isOneToOne: false;
            referencedRelation: 's3_multipart_uploads';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string;
          name: string;
          owner: string;
          metadata: Json;
        };
        Returns: undefined;
      };
      extension: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      filename: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      foldername: {
        Args: {
          name: string;
        };
        Returns: string[];
      };
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>;
        Returns: {
          size: number;
          bucket_id: string;
        }[];
      };
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string;
          prefix_param: string;
          delimiter_param: string;
          max_keys?: number;
          next_key_token?: string;
          next_upload_token?: string;
        };
        Returns: {
          key: string;
          id: string;
          created_at: string;
        }[];
      };
      list_objects_with_delimiter: {
        Args: {
          bucket_id: string;
          prefix_param: string;
          delimiter_param: string;
          max_keys?: number;
          start_after?: string;
          next_token?: string;
        };
        Returns: {
          name: string;
          id: string;
          metadata: Json;
          updated_at: string;
        }[];
      };
      operation: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      search: {
        Args: {
          prefix: string;
          bucketname: string;
          limits?: number;
          levels?: number;
          offsets?: number;
          search?: string;
          sortcolumn?: string;
          sortorder?: string;
        };
        Returns: {
          name: string;
          id: string;
          updated_at: string;
          created_at: string;
          last_accessed_at: string;
          metadata: Json;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
      PublicSchema['Views'])
  ? (PublicSchema['Tables'] &
      PublicSchema['Views'])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
  ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
  ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
  ? PublicSchema['Enums'][PublicEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
  ? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
  : never;
