import { Remito_Por_producto } from "src/entities/Detalle_Remito.entity";
import { Factura } from "src/facturas/entities/factura.entity";
import { OrdenDeCompra } from "src/orden-de-compra/entities/orden-de-compra.entity";
import { Proveedor } from "src/proveedores/entities/proveedor.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Remito {


    @PrimaryGeneratedColumn("identity")
    id_remito:number;
    @ManyToOne(()=> Proveedor,(proveedor)=>proveedor.remitos,{eager:true})
    id_proveedor:Proveedor;

    @OneToOne(()=>OrdenDeCompra,(ordenDeCompra)=>ordenDeCompra.remito)
    @JoinColumn()
    ordenDeCompra:OrdenDeCompra;

    @Column({type:"text"})
    fecha:string;


    @OneToMany(()=>Remito_Por_producto,(detalle_remito)=>detalle_remito.remito,{cascade:true,eager:true})
    detalles:Remito_Por_producto[]

    @OneToOne(()=>Factura,(factura)=>factura.remito)
    factura:Factura;


    @Column({type:"text"})
    direccion_entrega:string;
}
