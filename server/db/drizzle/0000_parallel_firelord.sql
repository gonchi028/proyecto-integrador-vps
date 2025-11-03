CREATE TYPE "public"."estadoMesa" AS ENUM('ocupada', 'libre', 'reservada');--> statement-breakpoint
CREATE TYPE "public"."estadoOrden" AS ENUM('pendiente', 'en preparacion', 'entregado');--> statement-breakpoint
CREATE TYPE "public"."estadoPedido" AS ENUM('pendiente', 'cancelado', 'en camino', 'listo para recoger', 'entregado');--> statement-breakpoint
CREATE TYPE "public"."estadoReserva" AS ENUM('pendiente', 'confirmada', 'cancelada', 'utilizada', 'no asistio');--> statement-breakpoint
CREATE TYPE "public"."tipoProducto" AS ENUM('plato', 'bebida');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cliente" (
	"ci" text PRIMARY KEY NOT NULL,
	"nombre" text NOT NULL,
	"celular" text,
	"puntos" integer,
	"direccion" text,
	"notasEntrega" text,
	"razonSocial" text,
	"nit" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "combo" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" text NOT NULL,
	"precio" real NOT NULL,
	"estado" text NOT NULL,
	"urlImagen" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "detalleCombo" (
	"estado" "estadoOrden" NOT NULL,
	"calificacion" integer,
	"cantidad" integer NOT NULL,
	"combo_id" integer NOT NULL,
	"pedido_id" integer NOT NULL,
	CONSTRAINT "detalleCombo_combo_id_pedido_id_pk" PRIMARY KEY("combo_id","pedido_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "detalleProductos" (
	"estado" "estadoOrden" NOT NULL,
	"calificacion" integer,
	"cantidad" integer NOT NULL,
	"producto_id" integer NOT NULL,
	"pedido_id" integer NOT NULL,
	CONSTRAINT "detalleProductos_producto_id_pedido_id_pk" PRIMARY KEY("producto_id","pedido_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "factura" (
	"id" serial PRIMARY KEY NOT NULL,
	"razonSocial" text NOT NULL,
	"nit" text NOT NULL,
	"pago_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "menu" (
	"id" serial PRIMARY KEY NOT NULL,
	"descripcion" text NOT NULL,
	"fecha" date NOT NULL,
	"estado" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "menuProducto" (
	"cantidadPreparada" integer NOT NULL,
	"cantidadVendida" integer NOT NULL,
	"menu_id" integer NOT NULL,
	"producto_id" integer NOT NULL,
	CONSTRAINT "menuProducto_menu_id_producto_id_pk" PRIMARY KEY("menu_id","producto_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mesa" (
	"id" serial PRIMARY KEY NOT NULL,
	"numero" integer NOT NULL,
	"estado" "estadoMesa" NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pago" (
	"id" serial PRIMARY KEY NOT NULL,
	"tipo" text NOT NULL,
	"monto" real NOT NULL,
	"fechaHora" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pedido" (
	"id" serial PRIMARY KEY NOT NULL,
	"fechaHoraPedido" timestamp NOT NULL,
	"fechaHoraEntrega" timestamp NOT NULL,
	"tipo" text NOT NULL,
	"estado" "estadoPedido" NOT NULL,
	"calificacionMesero" integer,
	"total" real NOT NULL,
	"mesa_id" integer NOT NULL,
	"cliente_ci" text NOT NULL,
	"mesero_id" uuid NOT NULL,
	"pago_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "producto" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" text NOT NULL,
	"descripcion" text NOT NULL,
	"cantidad" integer,
	"categoria" text NOT NULL,
	"precio" real NOT NULL,
	"tipo" "tipoProducto" NOT NULL,
	"urlImagen" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "productoCombo" (
	"producto_id" integer,
	"combo_id" integer,
	CONSTRAINT "productoCombo_producto_id_combo_id_pk" PRIMARY KEY("producto_id","combo_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "productoProveedor" (
	"producto_id" integer NOT NULL,
	"proveedor_id" integer NOT NULL,
	CONSTRAINT "productoProveedor_producto_id_proveedor_id_pk" PRIMARY KEY("producto_id","proveedor_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "proveedor" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" text NOT NULL,
	"celular" text,
	"telefono" text,
	"correo" text,
	"direccion" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reserva" (
	"id" serial PRIMARY KEY NOT NULL,
	"estado" "estadoReserva" NOT NULL,
	"cantidadPersonas" integer NOT NULL,
	"fechaHora" timestamp NOT NULL,
	"mesa" integer NOT NULL,
	"cliente_ci" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reservaPlatos" (
	"cantidad" integer NOT NULL,
	"reserva_id" integer,
	"producto_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"user_name" text NOT NULL,
	"avatar_url" text NOT NULL,
	"email" text NOT NULL,
	"cliente_ci" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "detalleCombo" ADD CONSTRAINT "detalleCombo_combo_id_combo_id_fk" FOREIGN KEY ("combo_id") REFERENCES "public"."combo"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "detalleCombo" ADD CONSTRAINT "detalleCombo_pedido_id_pedido_id_fk" FOREIGN KEY ("pedido_id") REFERENCES "public"."pedido"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "detalleProductos" ADD CONSTRAINT "detalleProductos_producto_id_producto_id_fk" FOREIGN KEY ("producto_id") REFERENCES "public"."producto"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "detalleProductos" ADD CONSTRAINT "detalleProductos_pedido_id_pedido_id_fk" FOREIGN KEY ("pedido_id") REFERENCES "public"."pedido"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "factura" ADD CONSTRAINT "factura_pago_id_pago_id_fk" FOREIGN KEY ("pago_id") REFERENCES "public"."pago"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "menuProducto" ADD CONSTRAINT "menuProducto_menu_id_menu_id_fk" FOREIGN KEY ("menu_id") REFERENCES "public"."menu"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "menuProducto" ADD CONSTRAINT "menuProducto_producto_id_producto_id_fk" FOREIGN KEY ("producto_id") REFERENCES "public"."producto"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pedido" ADD CONSTRAINT "pedido_mesa_id_mesa_id_fk" FOREIGN KEY ("mesa_id") REFERENCES "public"."mesa"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pedido" ADD CONSTRAINT "pedido_cliente_ci_cliente_ci_fk" FOREIGN KEY ("cliente_ci") REFERENCES "public"."cliente"("ci") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pedido" ADD CONSTRAINT "pedido_mesero_id_user_id_fk" FOREIGN KEY ("mesero_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pedido" ADD CONSTRAINT "pedido_pago_id_pago_id_fk" FOREIGN KEY ("pago_id") REFERENCES "public"."pago"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "productoCombo" ADD CONSTRAINT "productoCombo_producto_id_producto_id_fk" FOREIGN KEY ("producto_id") REFERENCES "public"."producto"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "productoCombo" ADD CONSTRAINT "productoCombo_combo_id_combo_id_fk" FOREIGN KEY ("combo_id") REFERENCES "public"."combo"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "productoProveedor" ADD CONSTRAINT "productoProveedor_producto_id_producto_id_fk" FOREIGN KEY ("producto_id") REFERENCES "public"."producto"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "productoProveedor" ADD CONSTRAINT "productoProveedor_proveedor_id_proveedor_id_fk" FOREIGN KEY ("proveedor_id") REFERENCES "public"."proveedor"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reserva" ADD CONSTRAINT "reserva_cliente_ci_cliente_ci_fk" FOREIGN KEY ("cliente_ci") REFERENCES "public"."cliente"("ci") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reservaPlatos" ADD CONSTRAINT "reservaPlatos_reserva_id_reserva_id_fk" FOREIGN KEY ("reserva_id") REFERENCES "public"."reserva"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reservaPlatos" ADD CONSTRAINT "reservaPlatos_producto_id_producto_id_fk" FOREIGN KEY ("producto_id") REFERENCES "public"."producto"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user" ADD CONSTRAINT "user_cliente_ci_cliente_ci_fk" FOREIGN KEY ("cliente_ci") REFERENCES "public"."cliente"("ci") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
