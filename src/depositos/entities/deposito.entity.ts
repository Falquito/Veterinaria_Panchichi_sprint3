import { LoteXDeposito } from "src/entities/LoteXDeposito.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Deposito {

    @PrimaryGeneratedColumn("identity")
    id_deposito:number;

    @Column({type:"text"})
    nombre:string;

    @Column({type:"text"})
    direccion:string;

    @OneToMany(() => LoteXDeposito,(loteXDeposito) => loteXDeposito.deposito,{ eager: true })
    lotesDeposito:LoteXDeposito[];

    @Column({type:"bool"})
    activo:boolean

}
