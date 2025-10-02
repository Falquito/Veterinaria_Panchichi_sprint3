// src/proveedores/entities/proveedor.entity.ts
import { Remito } from 'src/compra/entities/compra.entity';
import { Comprobante } from 'src/comprobante/entities/comprobante.entity';
import { OrdenDeCompra } from 'src/orden-de-compra/entities/orden-de-compra.entity';
import { OrdenDePago } from 'src/orden-de-pago/entities/orden-de-pago.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Proveedor {
  @PrimaryGeneratedColumn('identity')
  id_proveedor: number;

  //nombre del proveedor
  @Column({ type: 'text' })
  nombre: string;

  //dni o cuit
  @Column({ type: 'text', nullable: true })
  cuit: string;

  @Column({ type: 'text', nullable: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  telefono: string;

  @Column({ type: 'text', nullable: true })
  direccion: string;

  // Estado del proveedor
  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @OneToMany(() => OrdenDeCompra, orden => orden.proveedor)
  ordenes: OrdenDeCompra[];

  @OneToMany(()=>Remito,(remito)=>remito.id_proveedor)
  remitos:Remito[]


  @OneToMany(()=>Comprobante,(comprobante)=>comprobante.proveedor)
  comprobante:Comprobante[];

  @OneToMany(()=>OrdenDePago,(ordenDePago)=>ordenDePago.proveedor)
  ordenesDePago:OrdenDePago[];

  

}
