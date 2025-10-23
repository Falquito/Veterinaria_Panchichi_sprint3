import { DetalleVenta } from "src/ventas/entities/detalle-venta.entity";
import { Venta } from "src/ventas/entities/venta.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Clientes{
    @PrimaryGeneratedColumn("identity")
    id:number;

    @Column("text")
    nombre:string;

    @Column("text")
    email:string;

    @Column("bool",{default:true})
    activo:boolean;

    @OneToMany(()=>Venta,(venta)=>venta.clientes)
    compras:Venta[]

    
}