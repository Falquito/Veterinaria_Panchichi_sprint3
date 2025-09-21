import { Comprobante } from "src/comprobante/entities/comprobante.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TipoDeComprobante{
    @PrimaryGeneratedColumn("identity")
    id:number;

    @Column({type:"text"})
    tipo:string;

    @OneToMany(()=>Comprobante,(comprobante)=>comprobante.tipoDeComprobante)
    comprobante:Comprobante[];
}