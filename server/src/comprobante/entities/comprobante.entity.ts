import { Deposito } from "src/depositos/entities/deposito.entity";
import { DetalleComprobante } from "src/entities/DetalleComprobante.entity";
import { TipoDeComprobante } from "src/entities/TipoDeComprobante.entity";
import { TipoDeFactura } from "src/entities/TipoDeFactura.entity";
import { OrdenDeCompra } from "src/orden-de-compra/entities/orden-de-compra.entity";
import { Proveedor } from "src/proveedores/entities/proveedor.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Comprobante {
    @PrimaryGeneratedColumn("identity")
    id:number;

    @Column({type:"text"})
    fecha:string;

    @ManyToOne(()=>TipoDeComprobante,(tipoDeComprobante)=>tipoDeComprobante.comprobante,{eager:true})
    tipoDeComprobante:TipoDeComprobante;

    @ManyToOne(()=>Proveedor,(proveedor)=>proveedor.comprobante,{eager:true})
    proveedor:Proveedor;


    @OneToOne(()=>OrdenDeCompra,(ordenDeCompra)=>ordenDeCompra.comprobante,{eager:true})
    @JoinColumn()
    ordenDeCompra:OrdenDeCompra;


    @OneToMany(()=>DetalleComprobante,(detalleComprobante)=>detalleComprobante.comprobante,{cascade:true,eager:true})
        detalles:DetalleComprobante[]
    @ManyToOne(()=>Deposito,(deposito)=>deposito.comprobante,{eager:true})
    deposito:Deposito;

    @Column({type:"int",nullable:true})
    numero:number;

    @Column({type:"text",nullable:true})
    observaciones:string;

    @Column({type:"int",nullable:true})
    total:number;

    @Column({type:"text",nullable:true})
    direccion_entrega:string;

    @ManyToOne(()=>TipoDeFactura,(tipoDeFactura)=>tipoDeFactura.id ,{eager:true})
    tipoFactura:TipoDeFactura|string;

    
}
