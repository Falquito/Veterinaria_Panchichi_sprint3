import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Venta } from "./venta.entity";
import { Producto } from "src/productos/entities/producto.entity";

@Entity()
export class DetalleVenta{
    @PrimaryGeneratedColumn("identity")
    id_detalle:number;

    @Column("int")
    cantidad:number;

    @Column("int")
    precio_unitario:number;


    @ManyToOne(()=>Venta,(venta)=>venta.detalles)
    venta:Venta;


    @ManyToOne(() => Producto, (producto) => producto.detallesVenta, { eager: true }) // eager: true cargará el producto automáticamente
    producto: Producto;

}