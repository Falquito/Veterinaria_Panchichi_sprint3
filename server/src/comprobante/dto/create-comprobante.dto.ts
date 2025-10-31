import { Type } from "class-transformer";
import { IsArray, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateComprobanteDto {
    @IsNumber()
    idTipoDeComprobante: number;

    @IsString()
    fecha: string;

    @IsNumber()
    idProveedor: number;

    @IsNumber()
    idOrdenDeCompra: number;

    @IsNumber()
    idDeposito: number;

    @IsArray()
    @Type(() => comprobanteProductDto)
    productos: comprobanteProductDto[];

    @IsString()
    @IsOptional()
    observaciones?: string;

    @IsOptional()
    @IsNumber()
    numero?: number;

    @IsOptional()
    @IsNumber()
    total?: number;

    @IsOptional()
    @IsString()
    direccion_entrega?: string;

    @IsOptional()
    @IsNumber()
    idTipoFactura?: number;
}

export class comprobanteProductDto {
    @IsNumber()
    idProducto: number;

    @IsNumber()
    cantidad: number;
}
