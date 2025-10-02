import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { Proveedor } from 'src/proveedores/entities/proveedor.entity';
import { DetalleFactura } from './detalle_factura.entity';
import { Remito } from 'src/compra/entities/compra.entity';

@Entity('facturas')
export class Factura {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @ManyToOne(() => Proveedor, { eager: true })
  proveedor: Proveedor;

  @Column({ type: 'text' })
  numero: string; // ej: "A-0001-00001234"

  @Column({ type: 'text' })
  fecha: string;

  @Column({ type: 'text', nullable: true })
  tipo?: string; // A/B/C

  @OneToMany(() => DetalleFactura, (d) => d.factura, { cascade: true ,eager:true})
  detalles: DetalleFactura[];

  // totales calculados
  @Column({ type: 'float', default: 0 })
  //total sin iva
  total_neto: number;

  @Column({ type: 'float', default: 0 })
  iva: number;

  @Column({ type: 'float', default: 0 })
  //total con iva calculado
  total: number;

  @Column({ type: 'text', nullable: true })
  observaciones?: string;

  @OneToOne(()=>Remito,(remito)=>remito.factura)
  @JoinColumn()
  remito:Remito;
}
