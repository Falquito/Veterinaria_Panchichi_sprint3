import { Remito_Por_producto } from "src/entities/Detalle_Remito.entity";
import { OrdenDeCompra } from "src/orden-de-compra/entities/orden-de-compra.entity";
import { Proveedor } from "src/proveedores/entities/proveedor.entity";
import { Column, Entity, JoinColumn, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Remito {


    @PrimaryGeneratedColumn("identity")
    id_remito:number;
    @ManyToMany(()=> Proveedor,(proveedor)=>proveedor.remitos,{eager:true})
    id_proveedor:Proveedor;

    @OneToOne(()=>OrdenDeCompra,(ordenDeCompra)=>ordenDeCompra.remito)
    @JoinColumn()
    ordenDeCompra:OrdenDeCompra;

    @Column({type:"text"})
    fecha:string;


    @OneToMany(()=>Remito_Por_producto,(detalle_remito)=>detalle_remito.remito)
    detalles:Remito_Por_producto[]
}
