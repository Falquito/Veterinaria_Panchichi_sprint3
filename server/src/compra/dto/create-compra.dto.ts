// server/src/compra/dto/create-compra.dto.ts
import { Type } from "class-transformer";
import { IsArray, IsNumber, IsString, ValidateNested } from "class-validator";

export class productsRemitoDto {
    @IsNumber()
    id_producto: number;

    @IsNumber()
    cantidad: number;
    
    @IsString()
    unidad_medida: string;
}

export class CreateCompraDto {
    @IsNumber()
    id_proveedor: number;
    
    @IsNumber()
    id_oc: number;

    @IsString()
    numero_remito: string;

    @IsString()
    fecha: string;

    @IsString()
    direccion_entrega: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => productsRemitoDto)
    productos: productsRemitoDto[];
}