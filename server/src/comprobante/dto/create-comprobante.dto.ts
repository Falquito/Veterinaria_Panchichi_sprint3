import { Type } from "class-transformer";
import { IsArray, isNumber, IsNumber, IsString } from "class-validator";

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
    
}

export class comprobanteProductDto{
    @IsNumber()
    idProducto:number;
    @IsNumber()
    cantidad:number;
}