import { Type } from "class-transformer";
import { IsArray, isNumber, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateComprobanteDto {
    @IsNumber()
    idTipoDeComprobante:number;

    @IsString()
    fecha:string;

    @IsNumber()
    idProveedor:number;


    @IsNumber()
    idOrdenDeCompra:number;

    @IsNumber()
    idDeposito:number;

    @IsArray()
    @Type(()=>comprobanteProductDto)
    productos:comprobanteProductDto[]

    @IsString()
    @IsOptional()
    observaciones:string;
    
    @IsNumber()
    numero:number;
    @IsNumber()
    total:number;

    @IsOptional()
    @IsString()
    direccion_entrega:string;
    

    @IsNumber()
    @IsOptional()
    idTipoFactura:number;
    
}

export class comprobanteProductDto{
    @IsNumber()
    idProducto:number;
    @IsNumber()
    cantidad:number;
}