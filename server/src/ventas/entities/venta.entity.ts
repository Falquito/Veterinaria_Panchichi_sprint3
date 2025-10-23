import { Clientes } from "src/entities/Cliente.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DetalleVenta } from "./detalle-venta.entity";

@Entity()
export class Venta {
    @PrimaryGeneratedColumn("identity")
    id_venta:number

    @Column("text",{nullable:true})
    fecha:string;

    @Column("int")
    total:number;

    @ManyToOne(()=>Clientes,(clientes)=>clientes.compras)
    clientes:Clientes

    @OneToMany(()=>DetalleVenta,(detalleVenta)=>detalleVenta.venta)
    detalles:DetalleVenta[]
}
