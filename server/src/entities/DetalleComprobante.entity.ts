import { Comprobante } from "src/comprobante/entities/comprobante.entity";
import { Producto } from "src/productos/entities/producto.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class DetalleComprobante{
    @PrimaryGeneratedColumn("identity")
    id:number;

    @ManyToOne(()=>Comprobante,(comprobante)=>comprobante.detalles)
    comprobante:Comprobante;

    @ManyToOne(()=>Producto,(producto)=>producto.detalleComprobante,{eager:true})
    producto:Producto;

    @Column({type:"int"})
    cantidad:number;    
}