import { Remito } from "src/compra/entities/compra.entity";
import { Producto } from "src/productos/entities/producto.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Remito_Por_producto{
    @PrimaryGeneratedColumn("identity")
    id_detalle_remito:number;

    @ManyToOne(()=>Remito,(compra)=>compra.detalles)
    remito:Remito;

    @ManyToOne(()=>Producto,(producto)=>producto.remitos)
    producto:Producto;

    @Column({type:"int"})
    cantidad:number;

    
}