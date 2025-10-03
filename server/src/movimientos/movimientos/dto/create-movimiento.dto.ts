import { Type } from "class-transformer";
import { IsArray, IsNumber, IsString } from "class-validator";

export class CreateMovimientoDto{

    @IsString()
    tipo:string;

    @IsString()
    motivo:string;

    @IsString()
    observaciones:string;

    @IsArray()
    @Type(()=>detalleMovimientoDto)
    detalle:detalleMovimientoDto[]
}

export class detalleMovimientoDto{

    @IsNumber()
    cantidad:number;
    
    @IsNumber()
    idProducto:number

    @IsNumber()
    idDeposito:number;
}