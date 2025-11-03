import {
  pgTable,
  uuid,
  serial,
  text,
  integer,
  real,
  timestamp,
  date,
  primaryKey,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const proveedor = pgTable('proveedor', {
  id: serial('id').primaryKey(),
  nombre: text('nombre').notNull(),
  celular: text('celular'),
  telefono: text('telefono'),
  correo: text('correo'),
  direccion: text('direccion'),
});

export const proveedorRelations = relations(proveedor, ({ many }) => ({
  productoProveedor: many(productoProveedor),
}));

export const productoProveedor = pgTable(
  'productoProveedor',
  {
    productoId: integer('producto_id')
      .references(() => producto.id)
      .notNull(),
    proveedorId: integer('proveedor_id')
      .references(() => proveedor.id)
      .notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.productoId, t.proveedorId] }),
  })
);

export const productoProveedorRelations = relations(
  productoProveedor,
  ({ one }) => ({
    proveedor: one(proveedor, {
      fields: [productoProveedor.proveedorId],
      references: [proveedor.id],
    }),
    producto: one(producto, {
      fields: [productoProveedor.productoId],
      references: [producto.id],
    }),
  })
);

export const tipoProducto = pgEnum('tipoProducto', ['plato', 'bebida']);

export const producto = pgTable('producto', {
  id: serial('id').primaryKey(),
  nombre: text('nombre').notNull(),
  descripcion: text('descripcion').notNull(),
  cantidad: integer('cantidad'),
  categoria: text('categoria').notNull(),
  precio: real('precio').notNull(),
  tipo: tipoProducto('tipo').notNull(),
  urlImagen: text('urlImagen').notNull(),
});

export const productoRelations = relations(producto, ({ many }) => ({
  productoProveedor: many(productoProveedor),
  menuProducto: many(menuProducto),
  reservaPlatos: many(reservaPlatos),
  productoCombo: many(productoCombo),
  detalleProductos: many(detalleProductos),
}));

export const menu = pgTable('menu', {
  id: serial('id').primaryKey(),
  descripcion: text('descripcion').notNull(),
  fecha: date('fecha').notNull(),
  estado: text('estado').notNull(),
});

export const menuRelations = relations(menu, ({ many }) => ({
  menuProducto: many(menuProducto),
}));

export const menuProducto = pgTable(
  'menuProducto',
  {
    cantidadPreparada: integer('cantidadPreparada').notNull(),
    cantidadVendida: integer('cantidadVendida').notNull(),
    menuId: integer('menu_id')
      .references(() => menu.id)
      .notNull(),
    productoId: integer('producto_id')
      .references(() => producto.id)
      .notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.menuId, t.productoId] }),
  })
);

export const menuProductoRelations = relations(menuProducto, ({ one }) => ({
  menu: one(menu, {
    fields: [menuProducto.menuId],
    references: [menu.id],
  }),
  producto: one(producto, {
    fields: [menuProducto.productoId],
    references: [producto.id],
  }),
}));

export const user = pgTable('user', {
  id: uuid('id').primaryKey(),
  name: text('name').notNull(),
  userName: text('user_name').notNull(),
  avatarUrl: text('avatar_url').notNull(),
  email: text('email').notNull(),
  clienteCi: text('cliente_ci').references(() => cliente.ci),
});

export const userRelations = relations(user, ({ many, one }) => ({
  pedidosAtendidos: many(pedido),
  clienteInfo: one(cliente, {
    fields: [user.clienteCi],
    references: [cliente.ci],
  }),
}));

export const reservaPlatos = pgTable(
  'reservaPlatos',
  {
    cantidad: integer('cantidad').notNull(),
    reservaId: integer('reserva_id')
      .references(() => reserva.id)
      .notNull(),
    productoId: integer('producto_id')
      .references(() => producto.id)
      .notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.reservaId, t.productoId] }),
  })
);

export const reservaPlatosRelations = relations(reservaPlatos, ({ one }) => ({
  reserva: one(reserva, {
    fields: [reservaPlatos.reservaId],
    references: [reserva.id],
  }),
  producto: one(producto, {
    fields: [reservaPlatos.productoId],
    references: [producto.id],
  }),
}));

export const estadoReserva = pgEnum('estadoReserva', [
  'pendiente',
  'confirmada',
  'cancelada',
  'utilizada',
  'no asistio',
]);

export const reserva = pgTable('reserva', {
  id: serial('id').primaryKey(),
  estado: estadoReserva('estado').notNull(),
  cantidadPersonas: integer('cantidadPersonas').notNull(),
  fechaHora: timestamp('fechaHora', { withTimezone: true }).notNull(),
  mesa: integer('mesa').notNull(),
  clienteCi: text('cliente_ci')
    .references(() => cliente.ci)
    .notNull(),
});

export const reservaRelations = relations(reserva, ({ many, one }) => ({
  reservaPlatos: many(reservaPlatos),
  cliente: one(cliente, {
    fields: [reserva.clienteCi],
    references: [cliente.ci],
  }),
}));

export const cliente = pgTable('cliente', {
  ci: text('ci').primaryKey(),
  nombre: text('nombre').notNull(),
  celular: text('celular'),
  puntos: integer('puntos'),
  direccion: text('direccion'),
  notasEntrega: text('notasEntrega'),
  razonSocial: text('razonSocial'),
  nit: text('nit'),
});

export const clienteRelations = relations(cliente, ({ many, one }) => ({
  reservas: many(reserva),
  pedidos: many(pedido),
  user: one(user),
}));

export const productoCombo = pgTable(
  'productoCombo',
  {
    productoId: integer('producto_id')
      .references(() => producto.id)
      .notNull(),
    comboId: integer('combo_id')
      .references(() => combo.id)
      .notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.productoId, t.comboId] }),
  })
);

export const productoComboRelations = relations(productoCombo, ({ one }) => ({
  producto: one(producto, {
    fields: [productoCombo.productoId],
    references: [producto.id],
  }),
  combo: one(combo, {
    fields: [productoCombo.comboId],
    references: [combo.id],
  }),
}));

export const combo = pgTable('combo', {
  id: serial('id').primaryKey(),
  nombre: text('nombre').notNull(),
  precio: real('precio').notNull(),
  estado: text('estado').notNull(),
  urlImagen: text('urlImagen'),
});

export const comboRelations = relations(combo, ({ many }) => ({
  productoCombo: many(productoCombo),
  detalleCombo: many(detalleCombo),
}));

export const estadoOrden = pgEnum('estadoOrden', [
  'pendiente',
  'en preparacion',
  'entregado',
]);

export const detalleCombo = pgTable(
  'detalleCombo',
  {
    estado: estadoOrden('estado').notNull(),
    calificacion: integer('calificacion'),
    cantidad: integer('cantidad').notNull(),
    comboId: integer('combo_id')
      .references(() => combo.id)
      .notNull(),
    pedidoId: integer('pedido_id')
      .references(() => pedido.id)
      .notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.comboId, t.pedidoId] }),
  })
);

export const detalleComboRelations = relations(detalleCombo, ({ one }) => ({
  combo: one(combo, {
    fields: [detalleCombo.comboId],
    references: [combo.id],
  }),
  pedido: one(pedido, {
    fields: [detalleCombo.pedidoId],
    references: [pedido.id],
  }),
}));

export const detalleProductos = pgTable(
  'detalleProductos',
  {
    estado: estadoOrden('estado').notNull(),
    calificacion: integer('calificacion'),
    cantidad: integer('cantidad').notNull(),
    productoId: integer('producto_id')
      .references(() => producto.id)
      .notNull(),
    pedidoId: integer('pedido_id')
      .references(() => pedido.id)
      .notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.productoId, t.pedidoId] }),
  })
);

export const detalleProductosRelations = relations(
  detalleProductos,
  ({ one }) => ({
    producto: one(producto, {
      fields: [detalleProductos.productoId],
      references: [producto.id],
    }),
    pedido: one(pedido, {
      fields: [detalleProductos.pedidoId],
      references: [pedido.id],
    }),
  })
);

export const estadoPedido = pgEnum('estadoPedido', [
  'pendiente',
  'cancelado',
  'en camino',
  'listo para recoger',
  'entregado',
]);

export const tipoPedido = pgEnum('tipoPedido', ['mesa', 'domicilio']);

export const pedido = pgTable('pedido', {
  id: serial('id').primaryKey(),
  fechaHoraPedido: timestamp('fechaHoraPedido', { withTimezone: true })
    .notNull()
    .defaultNow(),
  fechaHoraEntrega: timestamp('fechaHoraEntrega', { withTimezone: true }),
  tipo: tipoPedido('tipo').notNull(),
  estado: estadoPedido('estado').notNull(),
  calificacionMesero: integer('calificacionMesero'),
  total: real('total').notNull(),
  mesaId: integer('mesa_id').references(() => mesa.id),
  clienteCi: text('cliente_ci')
    .references(() => cliente.ci)
    .notNull(),
  meseroId: uuid('mesero_id').references(() => user.id),
  pagoId: integer('pago_id').references(() => pago.id),
});

export const pedidoRelations = relations(pedido, ({ one, many }) => ({
  mesa: one(mesa, {
    fields: [pedido.mesaId],
    references: [mesa.id],
  }),
  cliente: one(cliente, {
    fields: [pedido.clienteCi],
    references: [cliente.ci],
  }),
  mesero: one(user, {
    fields: [pedido.meseroId],
    references: [user.id],
  }),
  pago: one(pago, {
    fields: [pedido.pagoId],
    references: [pago.id],
  }),
  detalleProductos: many(detalleProductos),
  detalleCombos: many(detalleCombo),
}));

export const estadoMesa = pgEnum('estadoMesa', [
  'ocupada',
  'libre',
  'reservada',
]);

export const mesa = pgTable('mesa', {
  id: serial('id').primaryKey(),
  numero: integer('numero').notNull(),
  estado: estadoMesa('estado').notNull(),
  capacidad: integer('capacidad').notNull().default(4),
});

export const mesaRelations = relations(mesa, ({ many }) => ({
  pedido: many(pedido),
}));

export const pago = pgTable('pago', {
  id: serial('id').primaryKey(),
  tipo: text('tipo').notNull(),
  monto: real('monto').notNull(),
  fechaHora: timestamp('fechaHora', { withTimezone: true }).notNull(),
});

export const pagoRelations = relations(pago, ({ one }) => ({
  factura: one(factura),
  pedido: one(pedido),
}));

export const factura = pgTable('factura', {
  id: serial('id').primaryKey(),
  razonSocial: text('razonSocial').notNull(),
  nit: text('nit').notNull(),
  pagoId: integer('pago_id')
    .references(() => pago.id)
    .notNull(),
});

export const facturaRelations = relations(factura, ({ one }) => ({
  pago: one(pago, {
    fields: [factura.pagoId],
    references: [pago.id],
  }),
}));
