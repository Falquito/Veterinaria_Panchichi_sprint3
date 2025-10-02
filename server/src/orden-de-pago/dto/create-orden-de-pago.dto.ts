import { Type } from "class-transformer";
import { IsArray, IsNumber, IsString } from "class-validator";

export class CreateOrdenDePagoDto {
    @IsString()
    fecha:string;
    @IsString()
    formaDePago:string;
    @IsNumber()
    idProveedor:number

    @IsNumber()
    montoTotal:number
    @IsArray()
    @Type(()=>Comprobantes)
    comprobantes:Comprobantes[]
}

class Comprobantes{
    @IsNumber()
    idComprobante:number

}