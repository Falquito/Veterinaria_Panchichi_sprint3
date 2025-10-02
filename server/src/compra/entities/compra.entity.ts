import { Remito_Por_producto } from "src/entities/Detalle_Remito.entity";
import { Factura } from "src/facturas/entities/factura.entity";
import { OrdenDeCompra } from "src/orden-de-compra/entities/orden-de-compra.entity";
import { Proveedor } from "src/proveedores/entities/proveedor.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Remito {

    @PrimaryGeneratedColumn("identity")
    id_remito:number;

    // La propiedad se llamaba `id_proveedor`, lo correcto es `proveedor` para que TypeORM maneje la relación
    @ManyToOne(()=> Proveedor,(proveedor)=>proveedor.remitos,{eager:true})
    proveedor:Proveedor;

    @OneToOne(()=>OrdenDeCompra,(ordenDeCompra)=>ordenDeCompra.remito, {eager: true})
    @JoinColumn()
    ordenDeCompra:OrdenDeCompra;

    @Column({type:"text"})
    fecha:string;

    @Column({type: "varchar", default: 'Pendiente'})
    estado: string;

    @OneToMany(()=>Remito_Por_producto,(detalle_remito)=>detalle_remito.remito,{cascade:true,eager:true})
    detalles:Remito_Por_producto[]

    @OneToOne(()=>Factura,(factura)=>factura.remito)
    factura:Factura;
}