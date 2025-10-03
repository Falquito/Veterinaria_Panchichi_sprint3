import { Remito } from "src/compra/entities/compra.entity";
import { Comprobante } from "src/comprobante/entities/comprobante.entity";
import { OrdenDeCompraPorProducto } from "src/entities/Orden_de_compra_Por_Producto.entity";
import { Proveedor } from "src/proveedores/entities/proveedor.entity";
import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class OrdenDeCompra {
    @PrimaryGeneratedColumn("identity")
    id_oc:number;

    @Column({type:"text"})
    fecha: string;

    @Column('decimal', { default: 0 })
    total: number;

    @OneToMany(() => OrdenDeCompraPorProducto, o => o.ordenDeCompra, { cascade: true , eager:true})
    productos: OrdenDeCompraPorProducto[];

     @Column('decimal', { nullable: true })
  precioUnitario: number;

    @ManyToOne(() => Proveedor, proveedor => proveedor.ordenes, { eager: true })
    proveedor: Proveedor;
    @OneToOne(()=>Remito,(remito)=>remito.ordenDeCompra)
    remito:Remito;

    @OneToOne(()=>Comprobante,(comprobante)=>comprobante.ordenDeCompra)
    comprobante:Comprobante;
}
