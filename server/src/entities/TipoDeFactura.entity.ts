import { Comprobante } from "src/comprobante/entities/comprobante.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
export enum TipoFacturaEnum {
  A = "A",
  B = "B",
  C = "C",
}
@Entity()
export class TipoDeFactura{
    @PrimaryGeneratedColumn("identity")
    id:number;

    @Column({type:"enum",enum:TipoFacturaEnum})
    tipo:TipoFacturaEnum;

    @OneToMany(()=>Comprobante,(comprobante)=>comprobante.tipoFactura)
    comprobante:Comprobante[];
}