// server/src/facturas/entities/factura.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { Proveedor } from 'src/proveedores/entities/proveedor.entity';
import { DetalleFactura } from './detalle_factura.entity';
import { Remito } from 'src/compra/entities/compra.entity';
import { DetalleOrdenDePago } from 'src/entities/detalle-orden-de-pago.entity';

@Entity('facturas')
export class Factura {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @ManyToOne(() => Proveedor, { eager: true })
  proveedor: Proveedor;

  @OneToMany(() => DetalleOrdenDePago, (detalle) => detalle.factura)
  ordenesDePagoDetalles: DetalleOrdenDePago[];

  @Column({ type: 'text', unique: true })
  numero: string; // ej: "A-0001-00001234"

  @Column({ type: 'text' })
  fecha: string;

  @Column({ type: 'text', nullable: true })
  tipo?: string; // A/B/C

  @OneToMany(() => DetalleFactura, (d) => d.factura, { cascade: true, eager: true })
  detalles: DetalleFactura[];

  @Column({ type: 'float', default: 0 })
  total_neto: number;

  @Column({ type: 'float', default: 0 })
  iva: number;

  @Column({ type: 'float', default: 0 })
  total: number;

  @Column({ type: 'text', nullable: true })
  observaciones?: string;

  @OneToOne(() => Remito, (remito) => remito.factura)
  @JoinColumn()
  remito: Remito;

  @Column({ type: "text", default: "PENDIENTE" })
  estado: string; // PENDIENTE, PAGADO, CANCELADO, ANULADO
}