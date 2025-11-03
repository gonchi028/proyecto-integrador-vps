CREATE TYPE "public"."tipoPedido" AS ENUM('mesa', 'domicilio');--> statement-breakpoint
ALTER TABLE "pago" ALTER COLUMN "fechaHora" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "pedido" ALTER COLUMN "fechaHoraPedido" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "pedido" ALTER COLUMN "fechaHoraPedido" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "pedido" ALTER COLUMN "fechaHoraEntrega" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "pedido" ALTER COLUMN "fechaHoraEntrega" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "pedido" ALTER COLUMN "tipo" SET DATA TYPE tipoPedido;--> statement-breakpoint
ALTER TABLE "pedido" ALTER COLUMN "mesa_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "pedido" ALTER COLUMN "mesero_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "productoCombo" ALTER COLUMN "producto_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "productoCombo" ALTER COLUMN "combo_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "reserva" ALTER COLUMN "fechaHora" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "reservaPlatos" ALTER COLUMN "reserva_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "reservaPlatos" ALTER COLUMN "producto_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "reservaPlatos" ADD CONSTRAINT "reservaPlatos_reserva_id_producto_id_pk" PRIMARY KEY("reserva_id","producto_id");--> statement-breakpoint
ALTER TABLE "mesa" ADD COLUMN "capacidad" integer DEFAULT 4 NOT NULL;