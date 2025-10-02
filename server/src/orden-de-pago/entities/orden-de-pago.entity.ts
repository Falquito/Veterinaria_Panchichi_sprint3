import { DetalleOrdenDePago } from "src/entities/detalle-orden-de-pago.entity";
import { Proveedor } from "src/proveedores/entities/proveedor.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";

@Entity()
export class OrdenDePago {
  @PrimaryGeneratedColumn("identity")
  id: number;

  @Column({ type: "text" })
  fecha: string;

  @ManyToOne(() => Proveedor, (proveedor) => proveedor.ordenesDePago, { eager: true ,nullable:false})
  proveedor: Proveedor;

  @Column({ type: "varchar", length: 50 })
  formaDePago: string;  // ejemplo: "Efectivo", "Transferencia", "Cheque"

  @Column({ type: "decimal", precision: 12, scale: 2, nullable: true })
  montoTotal: number;

  @Column({ type: "varchar", length: 20, default: "Pendiente" })
  estado: string; // "Pendiente", "Pagado", "Anulado"

  @OneToMany(() => DetalleOrdenDePago, (detalle) => detalle.ordenDePago, {
    cascade: true,
    eager: true,
  })
  detalles: DetalleOrdenDePago[];
}
