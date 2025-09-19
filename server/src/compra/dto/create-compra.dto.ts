import { Type } from "class-transformer";
import { IsArray, IsNumber, IsString } from "class-validator";

export class CreateCompraDto {
    @IsNumber()
    id_proveedor:number;
    
    @IsNumber()
    id_oc:number;
    @IsArray()
    @Type(() => productsRemitoDto)
    productos:productsRemitoDto[]
}

export class productsRemitoDto{
    @IsNumber()
    id_producto:number;

    @IsNumber()
    cantidad:number    
}