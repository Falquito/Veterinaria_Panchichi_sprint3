import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";

import { Comprobante } from "src/comprobante/entities/comprobante.entity";
import { OrdenDePago } from "src/orden-de-pago/entities/orden-de-pago.entity";

@Entity()
export class DetalleOrdenDePago {
  @PrimaryGeneratedColumn("identity")
  id: number;

  @ManyToOne(() => OrdenDePago, (ordenDePago) => ordenDePago.detalles)
  ordenDePago: OrdenDePago;

  @ManyToOne(() => Comprobante, (comprobante) => comprobante.id, { eager: true })
  comprobante: Comprobante;

//   @Column({ type: "decimal", precision: 12, scale: 2 })
//   montoAplicado: number;
}
