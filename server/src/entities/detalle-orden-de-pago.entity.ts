// server/src/entities/detalle-orden-de-pago.entity.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { OrdenDePago } from "src/orden-de-pago/entities/orden-de-pago.entity";
import { Factura } from "src/facturas/entities/factura.entity";

@Entity()
export class DetalleOrdenDePago {
  @PrimaryGeneratedColumn("identity")
  id: number;

  // --- CORRECCIÓN AQUÍ ---
  @ManyToOne(() => OrdenDePago, (ordenDePago) => ordenDePago.detalles)
  @JoinColumn({ name: "ordenDePagoId" }) // Le decimos el nombre explícito
  ordenDePago: OrdenDePago;

  @ManyToOne(() => Factura, (factura) => factura.ordenesDePagoDetalles, { eager: true })
  @JoinColumn({ name: "facturaId" }) // Le decimos el nombre explícito
  factura: Factura;
  // --- FIN DE LA CORRECCIÓN ---
}
