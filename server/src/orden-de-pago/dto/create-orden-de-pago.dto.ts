// server/src/orden-de-pago/dto/create-orden-de-pago.dto.ts
import { Type } from "class-transformer";
import { IsArray, IsNumber, IsString, ValidateNested } from "class-validator";

class FacturaDto {
    @IsNumber()
    idFactura: number;
}

export class CreateOrdenDePagoDto {
    @IsString()
    fecha: string;

    @IsString()
    formaDePago: string;

    @IsNumber()
    idProveedor: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => FacturaDto)
    facturas: FacturaDto[];
}