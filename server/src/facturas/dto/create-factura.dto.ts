import { Type } from 'class-transformer';
import { IsArray, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested, Min } from 'class-validator';

class DetalleItemDto {
  @IsNumber() productoId: number;
  @Type(() => Number) @IsNumber() @Min(1) cantidad: number;
  @Type(() => Number) @IsNumber() @Min(0) precio_unitario_compra: number;
  @IsOptional() @Type(() => Number) @IsNumber() iva_porcentaje?: number;
}

export class CreateFacturaDto {
  @IsNumber() proveedorId: number;
  @IsString() @IsNotEmpty() numero: string;
  @IsString() fecha: string;
  @IsOptional() @IsString() tipo?: string;
  @IsNumber() idRemito:number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetalleItemDto)
  detalles: DetalleItemDto[];

  @IsOptional() @IsString() observaciones?: string;
}
